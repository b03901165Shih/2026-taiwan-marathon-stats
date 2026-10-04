"""Shared, fail-closed proof checks for audited BraveLog-derived workbooks."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

VERSION = 1


def is_bravelog(event):
    from urllib.parse import urlsplit
    host = urlsplit(event.get('source_url', '')).hostname
    return (bool(event.get('bravelog_source_url')) or host in ('www.bravelog.tw', 'bravelog.tw', 'www.run2pix.com', 'run2pix.com')
            or bool(event.get('bravelog_filters')))


def workbook_path(event, config):
    path = Path(event['excel'])
    root = Path(config).resolve().parent
    if not path.is_absolute():
        path = root / path
    if not path.exists() and len(Path(event['excel']).parts) == 1:
        path = root / 'excels' / event['excel']
    return path


def dataframe_digest(df):
    columns = ['背號', '賽別', '分組', '完賽時間', '排名資格', '來源總排名', '排名來源']
    if '查核狀態' in df.columns:
        columns.append('查核狀態')
    records = df[columns].astype(object).fillna('').astype(str).values.tolist()
    return hashlib.sha256(json.dumps(sorted(records), ensure_ascii=False).encode()).hexdigest()


def create_proof(df, event, sources):
    from extract_excel_result import time_str_to_seconds, group_label
    public_rows = sorted([str(row['賽別']), group_label(row['分組']), time_str_to_seconds(row['完賽時間'])]
                         for _, row in df[df['排名資格']].iterrows())
    public_digest = hashlib.sha256(json.dumps(public_rows, ensure_ascii=False, separators=(',', ':')).encode()).hexdigest()
    return {'version': VERSION, 'event_id': event['id'],
            'checked_at': datetime.now(timezone.utc).isoformat(),
            'method': event['ranking_validation'], 'sources': sources,
            'digest': dataframe_digest(df), 'public_data_digest': public_digest}


def validate_workbook(excel, event):
    import pandas as pd
    df = pd.read_excel(excel, dtype={'背號': str, '賽別': str, '來源總排名': str})
    try:
        proof = json.loads(pd.read_excel(excel, sheet_name='排名查核').iloc[0]['查核JSON'])
    except (ValueError, KeyError, IndexError) as error:
        raise ValueError('BraveLog 資料未完成查核；先執行 python audit_bravelog.py --event-id ' + event['id']) from error
    required = {'排名資格', '來源總排名', '排名來源'}
    if not required.issubset(df.columns):
        raise ValueError('Missing ranking qualification columns')
    if (proof.get('version') != VERSION or proof.get('event_id') != event['id']
            or proof.get('method') != event.get('ranking_validation')
            or proof.get('digest') != dataframe_digest(df)):
        raise ValueError('Ranking proof is stale, changed or belongs to another event')
    if df['排名資格'].isna().any() or not df['排名資格'].isin([True, False]).all():
        raise ValueError('Ambiguous ranking eligibility')
    from extract_excel_result import time_str_to_seconds
    clocks = df.loc[df['排名資格'], '完賽時間'].map(time_str_to_seconds)
    if clocks.isna().any() or (clocks <= 0).any():
        raise ValueError('Eligible row has no valid official clock')
    if not proof.get('public_data_digest') or proof['public_data_digest'] != create_proof(df, event, proof['sources'])['public_data_digest']:
        raise ValueError('Public ranking fingerprint differs from qualified rows')
    if set(proof['sources']) != set(event['race_types']) or set(df['賽別']) != set(event['race_types']):
        raise ValueError('Ranking proof must cover every configured race')
    for race, source in proof['sources'].items():
        if proof['method'] == 'bravelog_individual' and (not source.get('raw_count') or source.get('profile_count') != source['raw_count']
                or source['raw_count'] != len(df[df['賽別'] == race])):
            raise ValueError('Individual audit must cover all raw rows, including missing list clocks')
        eligible = df[(df['賽別'] == race) & df['排名資格']]
        if proof['method'] == 'bravelog_individual':
            raw = df[df['賽別'] == race]
            statuses = raw['查核狀態'] if '查核狀態' in raw else pd.Series('verified_profile', index=raw.index)
            if not statuses.isin(['verified_profile', 'missing_no_clock_404']).all():
                raise ValueError('Unknown individual audit status')
            missing = raw[statuses == 'missing_no_clock_404']
            if (len(missing) != source.get('unavailable_no_clock_count', 0)
                    or source.get('verified_profile_count', len(raw)) != len(raw) - len(missing)):
                raise ValueError('Source gap counts differ from raw evidence')
            if (missing['排名資格'].any() or missing['來源總排名'].notna().any()
                    or not missing['完賽時間'].isin(['00:00:00', '--:--:--', '—', '-', '--', '–']).all()):
                raise ValueError('A source gap must have no ranking or published clock')
        ranks = pd.to_numeric(eligible['來源總排名'], errors='coerce')
        if ranks.isna().any() or (ranks <= 0).any():
            raise ValueError('Eligible row has no positive official overall rank')
        if len(eligible) != source['ranked_count']:
            raise ValueError('Qualified count differs from independent source count')
        if source.get('first_ten_seconds') != sorted(eligible['完賽時間'].map(time_str_to_seconds).tolist())[:10]:
            raise ValueError('Qualified first ten differ from source anchors')
        expected_url = (event.get('ranking_report_urls', {}).get(race) if proof['method'] == 'run2pix'
                        else event.get('bravelog_source_url', event['source_url']))
        if source['url'] != expected_url:
            raise ValueError('Audit source differs from configured source')
        if not eligible['排名來源'].eq(expected_url).all():
            raise ValueError('Qualified row source differs from configured source')
    return df, proof


def save_audited_workbook(df, event, sources, path, old=None):
    import pandas as pd
    from extract_excel_result import group_label
    df = df.copy()
    df['來源分組標籤'] = df['分組']
    df['分組'] = df['分組'].map(group_label)
    proof = create_proof(df, event, sources)
    temporary = path.with_name(path.stem + '.audited.xlsx')
    path.parent.mkdir(exist_ok=True, parents=True)
    # Use the exact Excel-normalized values for the proof, including nullable ranks.
    with pd.ExcelWriter(temporary, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='完整成績', index=False)
        if old is not None:
            old.to_excel(writer, sheet_name='修正前原始資料', index=False)
    normalized = pd.read_excel(temporary, dtype={'背號': str, '賽別': str, '來源總排名': str})
    proof['digest'] = dataframe_digest(normalized)
    with pd.ExcelWriter(temporary, engine='openpyxl', mode='a') as writer:
        pd.DataFrame([{'查核JSON': json.dumps(proof, ensure_ascii=False)}]).to_excel(writer, sheet_name='排名查核', index=False)
    validate_workbook(temporary, event)
    if path.exists():
        import shutil
        from uuid import uuid4
        history = path.parent / '.source-cache' / 'workbook-history' / event['id']
        history.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, history / (datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S') + '_' + uuid4().hex + '.xlsx'))
    temporary.replace(path)
    return proof

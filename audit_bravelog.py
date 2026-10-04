"""Complete public ranking audit: one command for new or existing BraveLog events."""
import argparse
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, wait, FIRST_COMPLETED
from pathlib import Path
from urllib.parse import urlencode

from extract_excel_result import load_event_configs, time_str_to_seconds, seconds_to_time_str
from qualify_run2pix import fetch_rankings
from ranking_validation import workbook_path, save_audited_workbook, is_bravelog
from scrap_bravelog import read_page, parse_page, PublicSourceHTTPError
from scrap_irunner import text

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')


def valid_seconds(value):
    if not re.fullmatch(r'\d{2,3}:[0-5]\d:[0-5]\d', str(value)):
        return None
    result = time_str_to_seconds(value)
    return result if result > 0 else None


def fetch_profile(detail_url, race_id, bib, list_time):
    try:
        return parse_athlete(read_page(detail_url), race_id, bib)
    except PublicSourceHTTPError as error:
        if (error.status == 404 and error.url == detail_url
                and list_time in ('00:00:00', '--:--:--', '—', '-', '--', '–')):
            return {'rank': None, 'total': None, 'time': None, 'status': 'missing_no_clock_404'}
        raise


def bounded_results(pool, function, items, limit):
    """Keep a small request queue so a changed source can stop promptly."""
    from itertools import islice
    iterator = iter(items)
    pending = {pool.submit(function, item) for item in islice(iterator, limit)}
    try:
        while pending:
            done, pending = wait(pending, return_when=FIRST_COMPLETED)
            for future in done:
                yield future.result()
                item = next(iterator, None)
                if item is not None:
                    pending.add(pool.submit(function, item))
    finally:
        for future in pending:
            future.cancel()


def parse_athlete(page, race_id, bib):
    # Require the exact public page identity, not a login/error page with partial markup.
    if not re.search(r'/athlete/' + re.escape(str(race_id)) + '/' + re.escape(str(bib)) + r'(?:["?/<])', page):
        raise ValueError('Athlete identity missing or changed')
    ranks = re.findall(r'<p[^>]*class="[^"]*rank-title[^"]*"[^>]*>(.*?)</p>\s*<p[^>]*class="[^"]*rank-text[^"]*"[^>]*>(.*?)</p>', page, re.S)
    overall = [text(value) for label, value in ranks if 'Overall Ranking' in text(label)]
    if len(overall) != 1:
        raise ValueError('Missing or ambiguous public overall ranking')
    times = re.findall(r'<p[^>]*class="[^"]*rankCard-title[^"]*"[^>]*>(.*?)</p>\s*<p[^>]*class="[^"]*grade[^\"]*"[^>]*>(.*?)</p>', page, re.S)
    official = [text(value) for label, value in times if 'Official Time' in text(label)]
    if len(official) != 1:
        raise ValueError('Missing or ambiguous official clock')
    value = overall[0]
    missing_clocks = ('00:00:00', '--:--:--', '—', '-', '--', '–')
    if valid_seconds(official[0]) is None and official[0] not in missing_clocks:
        raise ValueError('Unknown or invalid official clock')
    if value.isdigit():
        return {'rank': int(value) or None, 'total': None, 'time': official[0]}
    match = re.fullmatch(r'(\d+)\s*/\s*(\d[\d,]*)', value)
    if not match:
        if value not in ('—', '-', '--', '–'):
            raise ValueError('Unknown rank status; refusing to infer eligibility')
        return {'rank': None, 'total': None, 'time': official[0]}
    rank, total = (int(part.replace(',', '')) for part in match.groups())
    if rank == 0:
        return {'rank': None, 'total': total, 'time': official[0]}
    if valid_seconds(official[0]) is not None and (total <= 0 or rank > total):
        raise ValueError('Invalid positive ranking/time/denominator')
    return {'rank': rank, 'total': total, 'time': official[0]}


def fetch_brave_race(event, race_id, race, cache_dir, workers):
    url = event.get('bravelog_source_url', event['source_url'])
    first_url = url + '?' + urlencode({'raceId': race_id, 'page': 1})
    first = read_page(first_url)
    if '請至選手名單查詢個人成績' in first:
        raise ValueError(f'{race}: source does not publish a ranking; remove it from ranked comparisons')
    rows, number, pages = parse_page(first, race_id, race)
    if number != 1 or pages < 1:
        raise ValueError('Invalid first page')
    if not 0 < len(rows) <= 20 or (pages > 1 and len(rows) != 20):
        raise ValueError('Incomplete first result page or changed page size')
    def page_batch(number):
        batch, actual, total = parse_page(read_page(url + '?' + urlencode({'raceId': race_id, 'page': number})), race_id, race)
        if (actual != number or total != pages or not 0 < len(batch) <= 20
                or (number < pages and len(batch) != 20)):
            raise ValueError('Changed, repeated or truncated result pages')
        return batch
    with ThreadPoolExecutor(max_workers=workers) as pool:
        for n, batch in enumerate(pool.map(page_batch, range(2, pages + 1)), 2):
            rows.extend(batch)
            if n % 50 == 0 or n == pages:
                print(f'{event["id"]} {race}: list {n}/{pages}, {len(rows)} rows', flush=True)
    if len({row['背號'] for row in rows}) != len(rows):
        raise ValueError('Duplicate public bib within race')
    cache_dir.mkdir(parents=True, exist_ok=True)
    list_timed = {row['背號'] for row in rows if valid_seconds(row['完賽時間']) is not None}
    candidates = rows
    def qualify(row):
        bib = row['背號']
        path = cache_dir / f'{race_id}_{bib}.json'
        detail_url = f'https://www.bravelog.tw/athlete/{race_id}/{bib}'
        if path.exists():
            cached = json.loads(path.read_text(encoding='utf-8'))
            if cached.get('list_time') == row['完賽時間'] and cached.get('url') == detail_url:
                result = cached['result']
            else:
                result = fetch_profile(detail_url, race_id, bib, row['完賽時間'])
        else:
            result = fetch_profile(detail_url, race_id, bib, row['完賽時間'])
        from uuid import uuid4
        temporary = path.with_name(path.name + '.' + uuid4().hex + '.tmp')
        temporary.write_text(json.dumps({'url': detail_url, 'list_time': row['完賽時間'], 'result': result}, ensure_ascii=False), encoding='utf-8')
        temporary.replace(path)
        return bib, result
    qualified = {}
    started = time.monotonic()
    def attempt(row):
        try:
            return row, qualify(row), None
        except Exception as error:
            return row, None, error
    pending = candidates
    errors = []
    for pass_number in range(3):
        retry, errors = [], []
        with ThreadPoolExecutor(max_workers=workers if pass_number == 0 else min(workers, 4)) as pool:
            for n, (row, outcome, error) in enumerate(bounded_results(pool, attempt, pending, workers * 2), 1):
                if error is not None:
                    if isinstance(error, ValueError):
                        raise ValueError(f'Source format/status could not be verified: {error}') from error
                    retry.append(row)
                    errors.append(error)
                else:
                    bib, result = outcome
                    qualified[bib] = result
                if n % 200 == 0 or n == len(pending):
                    print(f'{event["id"]} {race}: individual {len(qualified)}/{len(candidates)}, pending errors {len(retry)}, {int(time.monotonic()-started)}s', flush=True)
        if not retry:
            break
        if any(isinstance(error, ValueError) for error in errors):
            raise ValueError(f'{len(retry)} source records could not be verified; first error: {errors[0]}')
        pending = retry
        print(f'{event["id"]} {race}: retrying {len(pending)} unavailable public pages', flush=True)
        time.sleep(5 * (pass_number + 1))
    if errors:
        raise ValueError(f'{len(errors)} public pages still unavailable; source remains unverified')
    denominators = set()
    for row in rows:
        result = qualified.get(row['背號'])
        row['查核狀態'] = result.get('status', 'verified_profile')
        row['排名資格'] = bool(result and result['rank'] is not None and valid_seconds(result['time']) is not None)
        row['來源總排名'] = result['rank'] if result else None
        row['排名來源'] = url
        if row['排名資格']:
            if result['time'] != row['完賽時間']:
                row['BraveLog原始列表時間'] = row['完賽時間']
                row['完賽時間'] = result['time']
            if result['total'] is not None:
                denominators.add(result['total'])
    count = sum(row['排名資格'] for row in rows)
    qualified_list_timed = sum(row['排名資格'] and row['背號'] in list_timed for row in rows)
    # A displayed denominator may include entrants lacking an official finish clock.
    # Eligibility comes from each positive rank AND valid clock, never the denominator.
    ranked_times = sorted(valid_seconds(row['完賽時間']) for row in rows if row['排名資格'])
    source = {'url': url, 'race_id': str(race_id), 'pages': pages, 'raw_count': len(rows),
              'profile_count': len(qualified), 'timed_count': len(list_timed), 'ranked_count': count,
              'excluded_timed': len(list_timed)-qualified_list_timed,
              'restored_missing_clock': count-qualified_list_timed,
              'first_ten_seconds': ranked_times[:10]}
    missing = sum(result.get('status') == 'missing_no_clock_404' for result in qualified.values())
    source['unavailable_no_clock_count'] = missing
    source['verified_profile_count'] = len(qualified) - missing
    source['published_overall_denominators'] = sorted(denominators)
    return rows, source


def prepare_cache(root, event_id, refresh=False):
    from datetime import datetime, timezone
    run_path = root / event_id / 'run.txt'
    run_path.parent.mkdir(parents=True, exist_ok=True)
    completed_path = run_path.parent / 'completed.txt'
    current = run_path.read_text(encoding='utf-8') if run_path.exists() else None
    completed = current is not None and completed_path.exists() and completed_path.read_text(encoding='utf-8') == current
    expired = True
    if current:
        try:
            started = datetime.strptime(current, '%Y%m%dT%H%M%S%f').replace(tzinfo=timezone.utc)
            expired = (datetime.now(timezone.utc)-started).total_seconds() > 86400
        except ValueError:
            pass
    if refresh or completed or expired:
        current = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%f')
        run_path.write_text(current, encoding='utf-8')
    return run_path, completed_path, run_path.parent / current


def audit_event(event, config, workers, refresh=False):
    import pandas as pd
    if not is_bravelog(event):
        raise ValueError('Not a BraveLog-derived event')
    path = workbook_path(event, config)
    old = pd.read_excel(path, dtype={'背號': str}) if path.exists() else None
    rows, sources = [], {}
    if event['ranking_validation'] == 'run2pix':
        for race, url in event['ranking_report_urls'].items():
            records = fetch_rankings(url, expected_name=event.get('ranking_report_name'))
            for bib, result in records.items():
                rows.append({'姓名': '', '背號': str(bib), '賽別': race, '賽事類型': race,
                             '分組': result['group'], '完賽時間': seconds_to_time_str(result['time']),
                             '排名資格': True, '來源總排名': result['rank'], '排名來源': url})
            sources[race] = {'url': url, 'ranked_count': len(records),
                             'first_ten_seconds': sorted(record['time'] for record in records.values())[:10]}
    else:
        root = Path(config).resolve().parent / 'excels' / '.source-cache'
        # Each audit run has its own namespace; resume only within that explicit run.
        run_path, completed_path, cache = prepare_cache(root, event['id'], refresh)
        for race_id, race in event['bravelog_filters'].items():
            batch, source = fetch_brave_race(event, race_id, race, cache, workers)
            rows.extend(batch)
            sources[race] = source
    df = pd.DataFrame(rows)
    df['來源總排名'] = pd.to_numeric(df['來源總排名'], errors='coerce').astype('Int64')
    proof = save_audited_workbook(df, event, sources, path, old=old)
    if event['ranking_validation'] == 'bravelog_individual':
        completed_path.write_text(run_path.read_text(encoding='utf-8'), encoding='utf-8')
    print(f'{event["id"]}: AUDIT COMPLETE { {r:s["ranked_count"] for r,s in sources.items()} }', flush=True)
    return proof


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--event-id')
    parser.add_argument('--all', action='store_true')
    parser.add_argument('--refresh', action='store_true', help='Start fresh source checks; otherwise resume interrupted current audit')
    parser.add_argument('--resume', action='store_true', help='Resume this audit batch, skipping completed verified workbooks')
    parser.add_argument('--workers', type=int, default=6)
    parser.add_argument('--config', default=str(Path(__file__).with_name('events_config.json')))
    args = parser.parse_args()
    if not 1 <= args.workers <= 8:
        parser.error('workers must be 1–8')
    all_events = load_event_configs(args.config)
    events = [e for e in all_events if is_bravelog(e) and (args.all or e['id'] == args.event_id)]
    events.sort(key=lambda e: e['ranking_validation'] != 'run2pix')
    if not events:
        parser.error('Specify --all or a BraveLog event ID')
    target = Path(args.config).resolve().parent / 'data' / 'source-audit.json'
    target.parent.mkdir(parents=True, exist_ok=True)
    audits = json.loads(target.read_text(encoding='utf-8')) if target.exists() else {}
    def publish(event, proof):
        from extract_excel_result import build_data, output_event_js, output_catalog
        from audit_report import update_report
        audits[event['id']] = {key: value for key, value in proof.items() if key != 'digest'}
        temporary = target.with_suffix('.json.tmp')
        temporary.write_text(json.dumps(audits, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
        temporary.replace(target)
        combined, metadata = build_data(workbook_path(event, args.config), event)
        output_event_js(combined, metadata, target.parent / f'{event["id"]}_data.js')
        output_catalog(all_events, target.parent.parent)
        update_report(all_events, audits, target.parent.parent)
    failures = []
    for event in events:
        try:
            if args.resume and event['id'] in audits:
                from ranking_validation import validate_workbook
                _, proof = validate_workbook(workbook_path(event, args.config), event)
                from datetime import datetime, timezone
                if (datetime.now(timezone.utc)-datetime.fromisoformat(proof['checked_at'])).total_seconds() > 86400:
                    raise ValueError('Completed audit is older than 24 hours; rerun without --resume')
                print(f'{event["id"]}: verified workbook already completed in this batch', flush=True)
                publish(event, proof)
                continue
            proof = audit_event(event, args.config, args.workers, args.refresh)
            publish(event, proof)
        except Exception as error:
            print(f'{event["id"]}: FAILED {error}', flush=True)
            failures.append(event['id'])
    if failures:
        raise SystemExit('Unverified events: ' + ', '.join(failures))
    if args.all:
        import shutil, subprocess
        root = target.parent.parent
        node = shutil.which('node')
        if not node:
            raise SystemExit('Source checks finished; install Node.js to verify the published data tests.')
        for name in ('stats', 'age', 'data', 'catalog', 'source', 'audit', 'loader'):
            subprocess.run([node, str(root / 'tests' / f'{name}.test.js')], cwd=root, check=True)
    print('All requested source audits and frontend updates completed.', flush=True)


if __name__ == '__main__':
    main()

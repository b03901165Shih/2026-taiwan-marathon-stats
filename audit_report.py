"""Keep the human-readable audit status in sync with completed source checks."""
import json
import re
from pathlib import Path

from ranking_validation import is_bravelog


def update_report(events, audits, root):
    root = Path(root)
    events = [event for event in events if is_bravelog(event)]
    before_path = root / 'data' / 'source-audit-before.json'
    before = json.loads(before_path.read_text(encoding='utf-8')).get('events', {}) if before_path.exists() else {}
    completed = sum(bool(audits.get(event['id'], {}).get('public_data_digest')) for event in events)
    status = f'BraveLog 排名資格查核：已完成 {completed}／{len(events)} 場。未完成或前端資料未同步的場次，暫不參與查詢與比較。'
    rows = ['| 賽事／賽別 | 查核前時間筆數 | 已核實排名筆數 | 最快大會時間 | 方法／狀態 |',
            '| --- | ---: | ---: | --- | --- |']
    for event in events:
        proof = audits.get(event['id'], {})
        for race in event['race_types']:
            source = proof.get('sources', {}).get(race)
            old = before.get(event['id'], {}).get('races', {}).get(race, {}).get('count', '—')
            count_before = f'{old:,}' if isinstance(old, int) else '—'
            if not source or not proof.get('public_data_digest'):
                rows.append(f"| {event['name']}／{race} | {count_before} | — | — | 待完成 |")
                continue
            from extract_excel_result import seconds_to_time_str
            anchors = source.get('first_ten_seconds', [])
            fastest = seconds_to_time_str(anchors[0]) if anchors else '—'
            method = '正式報表' if proof['method'] == 'run2pix' else '逐筆公開個人頁'
            if source.get('unavailable_no_clock_count'):
                method += f"；{source['unavailable_no_clock_count']} 筆列表無時間且個人頁 404，無法核實、未納入"
            rows.append(f"| {event['name']}／{race} | {count_before} | {source['ranked_count']:,} | {fastest} | [{method}]({source['url']}) |")
    start, end = '<!-- ranking-audit:start -->', '<!-- ranking-audit:end -->'
    section = '\n'.join([start, '## BraveLog 全站排名資格查核', '', status, '',
                         '此表由查核入口依 `data/source-audit.json` 更新；待完成不能當作已核實。查核前筆數來自本批修正前的匿名摘要，包含前一輪已修正的長榮。人數增加可能是補回舊檔缺漏，減少可能是排除未排名時間，不能僅由淨差推定原因。', '',
                         *rows, '',
                         '來源查核時間（UTC）與全部前十筆、逐筆分組／時間指紋保存在公開 JSON；原始成績、未排名紀錄及修正前完整 Excel 僅留本機。個人頁模式以正總排名及有效大會時間為準；即時排名仍以主辦最終公告為準。', end])
    for name, replacement in [('DATA_SOURCES.md', section), ('README.md', '\n'.join([start, status, end]))]:
        path = root / name
        if not path.exists():
            continue
        content = path.read_text(encoding='utf-8-sig')
        pattern = re.escape(start) + r'.*?' + re.escape(end)
        content = re.sub(pattern, lambda _: replacement, content, flags=re.S) if start in content else content.rstrip() + '\n\n' + replacement + '\n'
        path.write_text(content, encoding='utf-8')

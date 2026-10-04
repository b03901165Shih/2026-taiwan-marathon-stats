"""Import all public CT Run ranking pages without opening protected certificates."""
import argparse
import json
import re
import time
from pathlib import Path
from urllib.request import Request, urlopen
from extract_excel_result import load_event_configs, seconds_to_time_str
from scrap_bravelog import read_page


def fetch_results(event):
    url = event['source_url']
    if not re.fullmatch(r'https://accounter\.ctrun\.com\.tw/RSIS/Result/[A-Z0-9]+', url):
        raise ValueError('Expected official CT Run result URL')
    page = read_page(url)
    event_id = re.search(r'eventID:\s*"([^"]+)"', page)[1]
    types = json.loads(re.search(r'types:\s*(\[.*?\]),\s*groups:', page, re.S)[1])
    published = {item['name']: item['ID'] for item in types}
    if not set(event['race_types']).issubset(published):
        raise ValueError('Configured race names differ from public results')
    rows, counts = [], {}
    for race in event['race_types']:
        number, total, pages, seen = 1, None, None, set()
        while pages is None or number <= pages:
            payload = {'eventID': event_id, 'typeId': published[race], 'groupId': 'ALL', 'page': number}
            request = Request('https://accounter.ctrun.com.tw/RSIS/Event/GetRanking', data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Referer': url})
            with urlopen(request, timeout=40) as response:
                result = json.load(response)
            if not result.get('success'):
                raise ValueError('Public ranking request failed')
            pagination = result['pagination']
            if int(pagination['currentPage']) != number or (total is not None and int(pagination['totalCount']) != total) or (pages is not None and int(pagination['totalPage']) != pages):
                raise ValueError('Ranking pagination changed')
            total, pages = int(pagination['totalCount']), int(pagination['totalPage'])
            batch = result['data']
            if not batch and number <= pages:
                raise ValueError('Empty intermediate result page')
            for item in batch:
                value = item['value']
                if len(value) < 6 or value[2] != race or value[0] in seen or item['typeID'] != published[race]:
                    raise ValueError('Duplicate bib or wrong race in results')
                seen.add(value[0])
                ticks = int(value[5] or 0)
                rows.append({'姓名': value[1], '背號': value[0], '賽別': race, '賽事類型': race, '分組': value[3], '完賽時間': seconds_to_time_str(ticks // 10000000) if ticks > 0 else 'DNF'})
            number += 1
            time.sleep(.2)
        if len(seen) != total:
            raise ValueError('Missing records in public ranking')
        counts[race] = total
        print(f'{race}: {total} public ranked results', flush=True)
    return rows, counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--event-id', required=True)
    parser.add_argument('--config', default=str(Path(__file__).with_name('events_config.json')))
    args = parser.parse_args()
    event = next((e for e in load_event_configs(args.config) if e['id'] == args.event_id), None)
    if not event:
        parser.error('Unknown event ID')
    rows, counts = fetch_results(event)
    import pandas as pd
    target = Path(args.config).resolve().parent / 'excels' / Path(event['excel']).name
    target.parent.mkdir(exist_ok=True)
    with pd.ExcelWriter(target, engine='openpyxl') as writer:
        pd.DataFrame(rows).to_excel(writer, sheet_name='完整成績', index=False)
        pd.DataFrame([{'賽別': race, '來源筆數': count} for race, count in counts.items()]).to_excel(writer, sheet_name='來源筆數', index=False)
    print(f'Saved {len(rows)} results: {target.name}')


if __name__ == '__main__':
    main()

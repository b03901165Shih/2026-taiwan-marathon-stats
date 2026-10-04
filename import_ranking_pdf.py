"""Import official rank/bib/name/nation/time PDFs configured in events_config.json."""
import argparse
import io
import re
import time
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen
from extract_excel_result import load_event_configs


def parse_ranked_text(content, race, group):
    rows = []
    pending = ''
    for line in content.splitlines():
        rank = len(rows) + 1
        if not re.search(r'\d{2}:\d{2}:\d{2}', line):
            if re.match(r'\s*' + str(rank) + r'\s+\d+\S', line):
                pending = line.strip()
            continue
        if pending:
            line = pending + ' ' + line.strip()
            pending = ''
        match = re.fullmatch(r'\s*' + str(rank) + r'\s*(\d+)\s*(.*?)([A-Z]{3})\s+(\d{2}:\d{2}:\d{2})\s*', line)
        if not match:
            raise ValueError(f'Unrecognized or missing ranking row at position {rank}')
        rows.append({'姓名': match[2], '背號': match[1], '賽別': race, '賽事類型': race, '分組': group, '完賽時間': match[4], '來源總排名': rank})
    if not rows or len({row['背號'] for row in rows}) != len(rows):
        raise ValueError('Empty results or duplicate bibs in official PDF')
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--event-id', required=True)
    parser.add_argument('--config', default=str(Path(__file__).with_name('events_config.json')))
    args = parser.parse_args()
    event = next((e for e in load_event_configs(args.config) if e['id'] == args.event_id), None)
    if not event:
        parser.error('Unknown event ID')
    from pypdf import PdfReader
    import pandas as pd
    rows, counts = [], []
    seen = set()
    for source in event['pdf_ranking_sources']:
        if not source['url'].startswith('https://'):
            raise ValueError('Expected official HTTPS PDF URL')
        request = Request(quote(source['url'], safe=':/%'), headers={'User-Agent': 'Mozilla/5.0'})
        with urlopen(request, timeout=40) as response:
            reader = PdfReader(io.BytesIO(response.read()))
        batch = parse_ranked_text('\n'.join(page.extract_text() for page in reader.pages), source['race'], source['group'])
        if len(batch) != source['expected_count']:
            raise ValueError('PDF row count differs from the verified official announcement')
        for row in batch:
            key = (row['賽別'], row['背號'])
            if key in seen:
                raise ValueError('Duplicate bib across PDF sources')
            seen.add(key)
        rows.extend(batch)
        counts.append({'賽別': source['race'], '分組': source['group'], '來源筆數': len(batch), '來源': source['url']})
        print(source['race'], source['group'], len(batch), flush=True)
        time.sleep(.2)
    target = Path(args.config).resolve().parent / 'excels' / Path(event['excel']).name
    target.parent.mkdir(exist_ok=True)
    with pd.ExcelWriter(target, engine='openpyxl') as writer:
        pd.DataFrame(rows).to_excel(writer, sheet_name='完整成績', index=False)
        pd.DataFrame(counts).to_excel(writer, sheet_name='來源筆數', index=False)
    print(f'Saved {len(rows)} official PDF results: {target.name}')


if __name__ == '__main__':
    main()

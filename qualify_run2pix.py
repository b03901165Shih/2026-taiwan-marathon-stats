"""核對公開 Run2Pix 正式排名，保留原始 Excel 並標記排名資格。"""
import argparse
import re
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlsplit, urlunsplit
from urllib.request import Request, urlopen

from extract_excel_result import load_event_configs, time_str_to_seconds, seconds_to_time_str
from scrap_irunner import text


def read_page(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
    }
    with urlopen(Request(url, headers=headers), timeout=40) as response:
        return response.read().decode('utf-8-sig')


def parse_page(page):
    pagination = re.search(r'Total:\s*(\d+).*?Page:\s*(\d+)\s*/\s*(\d+)', text(page), re.S)
    if not pagination:
        raise ValueError('Missing report pagination')
    rows = []
    for row in re.findall(r"<tr\b[^>]*class=['\"]r2p-result-row['\"][^>]*>.*?</tr>", page, re.S):
        bib = re.search(r'viewscore_w\.php\?bib=(\d+)&', row)
        cells = {label: text(value) for label, value in re.findall(r"<td\b[^>]*data-label=['\"]([^'\"]*)['\"][^>]*>(.*?)</td>", row, re.S)}
        if not bib or not cells.get('Overall Rank', '').isdigit() or int(cells['Overall Rank']) <= 0:
            raise ValueError('Report row has no valid overall rank')
        try:
            clock = time_str_to_seconds(cells.get('Official Time', ''))
        except ValueError as error:
            raise ValueError('Report row has no valid official clock') from error
        if clock is None or clock <= 0 or not cells.get('Category'):
            raise ValueError('Report row has no valid official clock or category')
        rows.append({'bib': int(bib[1]), 'rank': int(cells['Overall Rank']),
                     'time': clock, 'group': cells['Category']})
    total, number, pages = map(int, pagination.groups())
    return rows, total, number, pages


def fetch_rankings(url, expected_name=None):
    parts = urlsplit(url)
    if parts.scheme != 'https' or parts.netloc != 'www.run2pix.com' or parts.path != '/report/report_w.php':
        raise ValueError('Expected public Run2Pix ranking report URL')
    query = parse_qs(parts.query, keep_blank_values=True)
    if not all(query.get(key) for key in ('EventCode', 'Race', 'sn')):
        raise ValueError('Missing event/race/report identity')
    if any(key in query for key in ('Sex', 'CatId', 'Cat', 'pagenum')):
        raise ValueError('Use unfiltered first-page report URL')
    records, expected, pages, number = {}, None, None, 1
    while pages is None or number <= pages:
        page_query = dict(query, Sex=['N'], CatId=['0'], pagenum=[str(number)])
        page_url = urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(page_query, doseq=True), ''))
        page = read_page(page_url)
        if expected_name:
            heading = re.search(r'<td\b[^>]*class=["\']REPORTHEADER["\'][^>]*>\s*<span[^>]*>(.*?)</span>', page, re.S)
            normalize = lambda value: re.sub(r'\s+', '', value).replace('臺', '台')
            if not heading or normalize(text(heading[1])) != normalize(expected_name):
                raise ValueError('Formal report belongs to a different event')
        rows, total, actual, count = parse_page(page)
        if actual != number or (expected is not None and (total != expected or count != pages)):
            raise ValueError('Report pagination changed or repeated')
        expected, pages = total, count
        for row in rows:
            if row['bib'] in records:
                raise ValueError('Duplicate bib in ranked report')
            records[row['bib']] = row
        print(f'Ranking: {number}/{pages} pages, {len(records)}/{expected}', flush=True)
        number += 1
    if len(records) != expected:
        raise ValueError('Incomplete ranked report')
    return records


def qualify_rows(df, race, records):
    seen = set()
    for index, row in df[df['賽別'] == race].iterrows():
        bib = int(row['背號'])
        if bib in seen:
            raise ValueError('Duplicate bib in original race')
        seen.add(bib)
        record = records.get(bib)
        if record is not None:
            if str(row['分組']).strip() != record['group'].strip():
                raise ValueError('Ranked category differs from original record')
            # Published formal ranking is authoritative; retain the raw clock separately.
            df.at[index, '完賽時間'] = seconds_to_time_str(record['time'])
            df.at[index, '排名資格'] = True
            df.at[index, '來源總排名'] = record['rank']
    if not set(records).issubset(seen):
        raise ValueError('Ranked report contains athletes missing from original race')


def main():
    # Retain the previous command as a compatible, fully audited entry point.
    from audit_bravelog import main as audited_main
    return audited_main()


if __name__ == '__main__':
    main()

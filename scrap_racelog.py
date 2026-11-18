"""Import public individual result lists from RaceLog into the event Excel workflow."""
import argparse
import html
import re
import time
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen

from extract_excel_result import load_event_configs, time_str_to_seconds


class RaceLogPage(HTMLParser):
    """Read category links and result tables without depending on page styling."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.anchors = []
        self.tables = []
        self.table = None
        self.row = None
        self.cell = None
        self.anchor = None
        self.h1_parts = []
        self.in_h1 = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a':
            self.anchor = {'href': attrs.get('href', ''), 'label_parts': [], 'in_small': False}
        elif tag == 'small' and self.anchor:
            self.anchor['in_small'] = True
        if tag == 'h1':
            self.in_h1 = True
        if tag == 'table':
            self.table = {'headers': [], 'rows': []}
        elif tag == 'tr' and self.table is not None:
            self.row = []
        elif tag in ('th', 'td') and self.row is not None:
            self.cell = {'tag': tag, 'parts': []}

    def handle_endtag(self, tag):
        if tag in ('th', 'td') and self.cell is not None:
            value = normalize_text(' '.join(self.cell['parts']))
            if self.cell['tag'] == 'th':
                self.table['headers'].append(value)
            else:
                self.row.append(value)
            self.cell = None
        elif tag == 'tr' and self.row is not None:
            if self.row:
                self.table['rows'].append(self.row)
            self.row = None
        elif tag == 'table' and self.table is not None:
            self.tables.append(self.table)
            self.table = None
        elif tag == 'small' and self.anchor:
            self.anchor['in_small'] = False
        elif tag == 'a' and self.anchor:
            label = normalize_text(' '.join(self.anchor['label_parts']))
            self.anchors.append((self.anchor['href'], label))
            self.anchor = None
        elif tag == 'h1':
            self.in_h1 = False

    def handle_data(self, data):
        if self.cell is not None:
            self.cell['parts'].append(data)
        if self.anchor:
            if not self.anchor['in_small']:
                self.anchor['label_parts'].append(data)
        if self.in_h1:
            self.h1_parts.append(data)


def normalize_text(value):
    return re.sub(r'\s+', ' ', html.unescape(str(value or ''))).strip()


def read_page(url):
    parts = urlsplit(url)
    if parts.scheme != 'https' or parts.hostname not in ('racelog.tw', 'www.racelog.tw'):
        raise ValueError('RaceLog source must be an HTTPS racelog.tw URL')
    request = Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; TaiwanMarathonStats/1.0)',
                                    'Accept': 'text/html'})
    with urlopen(request, timeout=60) as response:
        if response.status != 200:
            raise ValueError(f'RaceLog returned HTTP {response.status}')
        return response.read().decode('utf-8')


def _category_links(page, base_url, event_id):
    parsed = RaceLogPage()
    parsed.feed(page)
    found = {}
    for href, label in parsed.anchors:
        candidate = urljoin(base_url, html.unescape(href))
        parts = urlsplit(candidate)
        query = parse_qs(parts.query)
        if (parts.path.rstrip('/').endswith('/event.php') and query.get('id', [''])[0] == str(event_id)
                and query.get('category') and label):
            category_id = query['category'][0]
            if category_id in found and found[category_id] != label:
                raise ValueError('RaceLog has conflicting labels for a category')
            found[category_id] = label
    return found


def discover_categories(page, base_url, event_id, race_types, distances, configured_map=None):
    """Map RaceLog category ids to project race types by explicit map, name or distance."""
    configured_map = configured_map or {}
    links = _category_links(page, base_url, event_id)
    if not links:
        raise ValueError('No RaceLog category links found; refusing an empty import')
    distance_patterns = [
        (re.compile(r'\b(?:ma|full\s*(?:marathon)?|全馬|全程)\b', re.I), 42.195),
        (re.compile(r'\b(?:hm|half\s*(?:marathon)?|半馬)\b', re.I), 21.0975),
        (re.compile(r'(?<!\d)(\d+(?:\.\d+)?)\s*(?:km|k|公里)', re.I), None),
    ]
    mapped = {}
    for category_id, label in links.items():
        if label in configured_map:
            race = configured_map[label]
            if race not in race_types:
                raise ValueError(f'RaceLog map points to unknown race type: {race}')
        elif label in race_types:
            race = label
        else:
            source_distance = None
            for pattern, distance in distance_patterns:
                match = pattern.search(label)
                if match:
                    source_distance = float(match.group(1)) if distance is None else distance
                    if source_distance == 42:
                        source_distance = 42.195
                    elif source_distance == 21:
                        source_distance = 21.0975
                    break
            candidates = [race for race in race_types
                          if race in distances and source_distance is not None
                          and abs(float(distances[race]) - source_distance) < 0.02]
            if len(candidates) != 1:
                raise ValueError(f'Cannot uniquely map RaceLog category "{label}" to event race_types; add racelog_filters')
            race = candidates[0]
        if race in mapped.values():
            raise ValueError(f'Multiple RaceLog categories map to race type {race}')
        mapped[category_id] = race
    if set(mapped.values()) != set(race_types):
        missing = sorted(set(race_types) - set(mapped.values()))
        raise ValueError(f'RaceLog categories do not cover configured race_types: {missing}')
    return mapped


def _summary_counts(page):
    summary = re.search(r'目前顯示\s*<strong>\s*(\d+)\s*</strong>\s*筆個人成績', page, re.S)
    if not summary:
        raise ValueError('RaceLog page is missing result completeness counts')
    total = int(summary[1])
    detail = re.search(r'有完賽時間\s*<strong>\s*(\d+)\s*</strong>.*?'
                       r'無完賽時間\s*<strong>\s*(\d+)\s*</strong>', page, re.S)
    if not detail:
        return total, None, None
    timed, untimed = map(int, detail.groups())
    if total != timed + untimed:
        raise ValueError('RaceLog source counts do not add up')
    return total, timed, untimed


def _table_by_headers(parsed, required):
    matches = [table for table in parsed.tables if set(required).issubset(table['headers'])]
    if len(matches) != 1:
        raise ValueError(f'Expected one RaceLog result table with columns {required}')
    return matches[0]


def parse_page(page, event_id, race):
    parsed = RaceLogPage()
    parsed.feed(page)
    page_event = re.search(r'<input\s+[^>]*name=["\']id["\'][^>]*value=["\'](\d+)', page, re.I)
    if not page_event:
        page_event = re.search(r'<input\s+[^>]*value=["\'](\d+)["\'][^>]*name=["\']id', page, re.I)
    if not page_event or page_event[1] != str(event_id):
        raise ValueError('RaceLog result page belongs to a different event')
    total, timed_count, untimed_count = _summary_counts(page)
    timed_table = _table_by_headers(parsed, ['總排名', '號碼布', '選手', '組別', '性別', '年齡組', '完賽時間'])
    timed_rows, seen = [], set()
    for cells in timed_table['rows']:
        if len(cells) != len(timed_table['headers']):
            raise ValueError('RaceLog timed row has an unexpected number of fields')
        row = dict(zip(timed_table['headers'], cells))
        if row['組別'] != race:
            raise ValueError(f'RaceLog row has unexpected race type: {row["組別"]}')
        bib = row['號碼布']
        if not bib or bib == '—' or bib in seen:
            raise ValueError('RaceLog timed results contain an empty or duplicate bib')
        if not re.fullmatch(r'\d+', bib):
            raise ValueError(f'Unexpected RaceLog bib format: {bib}')
        try:
            time_str_to_seconds(row['完賽時間'])
        except ValueError as exc:
            raise ValueError(f'Invalid RaceLog finish time for bib {bib}') from exc
        seen.add(bib)
        timed_rows.append({'姓名': row['選手'], '背號': bib, '賽別': race, '賽事類型': race,
                           '分組': row['年齡組'] if row['年齡組'] not in ('', '—') else row['性別'],
                           '完賽時間': row['完賽時間'], '排名資格': True, '排名來源': 'RaceLog'})
    untimed_rows = []
    untimed_tables = [table for table in parsed.tables if set(['號碼布', '選手', '組別', '性別', '年齡組', '狀態']).issubset(table['headers'])]
    if len(untimed_tables) > 1:
        raise ValueError('RaceLog has multiple no-time result tables')
    if untimed_tables:
        table = untimed_tables[0]
        for cells in table['rows']:
            if len(cells) != len(table['headers']):
                raise ValueError('RaceLog no-time row has an unexpected number of fields')
            row = dict(zip(table['headers'], cells))
            if row['組別'] != race:
                raise ValueError(f'RaceLog no-time row has unexpected race type: {row["組別"]}')
            bib = row['號碼布']
            if not bib or bib == '—' or bib in seen or not re.fullmatch(r'\d+', bib):
                raise ValueError('RaceLog results contain an empty or duplicate bib')
            seen.add(bib)
            untimed_rows.append({'姓名': row['選手'], '背號': bib, '賽別': race, '賽事類型': race,
                                 '分組': row['年齡組'] if row['年齡組'] not in ('', '—') else row['性別'],
                                 '完賽時間': row['狀態'] or '無完賽時間', '排名資格': False,
                                 '排名來源': 'RaceLog'})
    if (timed_count is not None and len(timed_rows) != timed_count
            or untimed_count is not None and len(untimed_rows) != untimed_count
            or len(seen) != total):
        raise ValueError(f'RaceLog row count mismatch: page says {total} ({timed_count} timed, {untimed_count} no-time), '
                         f'parsed {len(timed_rows)} and {len(untimed_rows)}')
    return timed_rows + untimed_rows, total


def _with_query(url, **params):
    parts = urlsplit(url)
    query = parse_qs(parts.query, keep_blank_values=True)
    query.update({key: [str(value)] for key, value in params.items()})
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query, doseq=True), parts.fragment))


def fetch_results(event, url=None):
    source_url = url or event.get('racelog_source_url')
    if not source_url:
        raise ValueError('Add racelog_source_url to this event or pass --url')
    parts = urlsplit(source_url)
    if parts.scheme != 'https' or parts.hostname not in ('racelog.tw', 'www.racelog.tw') or not parts.path.endswith('/event.php'):
        raise ValueError('source URL must be a RaceLog event.php URL')
    event_id = parse_qs(parts.query).get('id', [''])[0]
    if not event_id.isdigit():
        raise ValueError('RaceLog event URL must include a numeric id parameter')
    initial = read_page(source_url)
    page_parser = RaceLogPage()
    page_parser.feed(initial)
    expected_name = event.get('racelog_event_name')
    if expected_name and normalize_text(''.join(page_parser.h1_parts)) != normalize_text(expected_name):
        raise ValueError('RaceLog event name does not match configured racelog_event_name')
    categories = discover_categories(initial, source_url, event_id, event['race_types'],
                                     event['race_distances_km'], event.get('racelog_filters'))
    rows, counts = [], {}
    all_bibs = set()
    for category_id, race in categories.items():
        page_url = _with_query(source_url, id=event_id, category=category_id, view='individual')
        page = read_page(page_url)
        batch, reported = parse_page(page, event_id, race)
        for row in batch:
            key = (race, row['背號'])
            if key in all_bibs:
                raise ValueError(f'Duplicate bib across RaceLog categories: {race} {row["背號"]}')
            all_bibs.add(key)
        rows.extend(batch)
        counts[race] = reported
        print(f'{race}: {len(batch)} rows ({reported} on RaceLog)', flush=True)
        time.sleep(.2)
    return rows, counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--event-id', required=True)
    parser.add_argument('--url', help='RaceLog event URL; defaults to event racelog_source_url')
    parser.add_argument('--config', default=str(Path(__file__).with_name('events_config.json')))
    args = parser.parse_args()
    events = load_event_configs(args.config)
    event = next((item for item in events if item['id'] == args.event_id), None)
    if not event:
        parser.error('Unknown event ID')
    rows, counts = fetch_results(event, args.url)
    import pandas as pd
    root = Path(args.config).resolve().parent
    target = root / 'excels' / Path(event['excel']).name
    target.parent.mkdir(exist_ok=True)
    with pd.ExcelWriter(target, engine='openpyxl') as writer:
        pd.DataFrame(rows).to_excel(writer, sheet_name='完整成績', index=False)
        pd.DataFrame([{'賽別': race, '來源筆數': count} for race, count in counts.items()]).to_excel(
            writer, sheet_name='來源筆數', index=False)
    print(f'Saved {len(rows)} RaceLog rows to {target}; next run: python extract_excel_result.py --event-id {event["id"]}')


if __name__ == '__main__':
    main()

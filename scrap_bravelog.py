"""Import complete public BraveLog ranking pages using the event configuration."""
import argparse
import json
import re
import time
import gzip
import http.client
import threading
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from pathlib import Path
from extract_excel_result import load_event_configs
from scrap_irunner import text

_connections = threading.local()


class PublicSourceHTTPError(ValueError):
    def __init__(self, status, url):
        self.status = status
        self.url = url
        super().__init__(f'Public source returned HTTP {status}')


def read_page(url):
    from urllib.parse import urlsplit
    parts = urlsplit(url)
    if parts.scheme != 'https' or parts.netloc != 'www.bravelog.tw':
        raise ValueError('Expected a public HTTPS BraveLog URL')
    for attempt in range(3):
        try:
            connection = getattr(_connections, 'brave', None)
            if connection is None:
                connection = http.client.HTTPSConnection(parts.netloc, timeout=40)
                _connections.brave = connection
            connection.request('GET', parts.path + ('?' + parts.query if parts.query else ''),
                               headers={'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html', 'Accept-Encoding': 'gzip'})
            response = connection.getresponse()
            body = response.read()
            if response.status != 200:
                raise PublicSourceHTTPError(response.status, url)
            if response.getheader('Content-Encoding') == 'gzip':
                body = gzip.decompress(body)
            return body.decode('utf8')
        except Exception:
            if getattr(_connections, 'brave', None):
                _connections.brave.close()
                _connections.brave = None
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))


def parse_page(page, race_id, race):
    pagination = re.search(r'<ul\s+[^>]*id="pagination"[^>]*>', page)
    if not pagination:
        raise ValueError('Missing public pagination; refusing incomplete results')
    attrs = dict(re.findall(r'([\w-]+)="([^"]*)"', pagination[0]))
    rows = []
    for card in page.split('<div class="fl-wrap list-single-main-item_content mb-2">')[1:]:
        link = re.search(r'/athlete/(\d+)/([^"/]+)', card)
        if not link or link[1] != str(race_id):
            raise ValueError('Result belongs to a different race')
        info = re.search(r'<div class="detail-info">(.*?)</div>', card, re.S)
        spans = re.findall(r'<span[^>]*>(.*?)</span>', info[1], re.S) if info else []
        if len(spans) != 3 or text(spans[1]) != race or text(spans[0]) != link[2]:
            raise ValueError('Unexpected athlete row format')
        finish = re.search(r'<div class="time">(.*?)</div>', card, re.S)
        name = re.search(r'<div class="name">(.*?)</div>', card, re.S)
        if not finish or not name:
            raise ValueError('Missing official finish time or name field')
        rows.append({'姓名': text(name[1]), '背號': link[2], '賽別': race,
                     '賽事類型': race, '分組': text(spans[2]), '完賽時間': text(finish[1])})
    return rows, int(attrs['data-page']), int(attrs['data-total'])


def fetch_results(event):
    url = event.get('bravelog_source_url', event['source_url'])
    if not re.fullmatch(r'https://www\.bravelog\.tw/contest/rank/\d+', url):
        raise ValueError('source_url must be an official BraveLog ranking page')
    initial = read_page(url)
    select = re.search(r'<select name="raceId"[^>]*>(.*?)</select>', initial, re.S)
    published = {rid: text(name) for rid, name in re.findall(r'<option value="(\d+)"[^>]*>(.*?)</option>', select[1], re.S)} if select else {}
    filters = event['bravelog_filters']
    if any(published.get(rid) != name for rid, name in filters.items()):
        raise ValueError('Configured race IDs/names differ from the official page')
    rows, counts = [], {}
    for rid, race in filters.items():
        seen, expected_pages, number = set(), None, 1
        while expected_pages is None or number <= expected_pages:
            page = read_page(url + '?' + urlencode({'raceId': rid, 'page': number}))
            batch, actual_page, pages = parse_page(page, rid, race)
            if actual_page != number or (expected_pages is not None and pages != expected_pages):
                raise ValueError('Pagination changed or a page was repeated')
            expected_pages = pages
            if not batch and pages > 0:
                raise ValueError('Empty intermediate result page')
            for row in batch:
                if row['背號'] in seen:
                    raise ValueError('Duplicate bib in paginated results')
                seen.add(row['背號'])
            rows.extend(batch)
            if number % 25 == 0 or number == pages:
                print(f'{race}: {number}/{pages} pages, {len(seen)} results', flush=True)
            number += 1
            time.sleep(.15)
        counts[race] = len(seen)
    return rows, counts


def main():
    # The supported import entry point always audits eligibility before writing.
    from audit_bravelog import main as audited_main
    return audited_main()


if __name__ == '__main__':
    main()

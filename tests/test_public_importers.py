import io
import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import scrap_bravelog as brave
import scrap_ctrun as ct
import scrap_racelog as racelog
from ranking_validation import is_bravelog
from import_ranking_pdf import parse_ranked_text


def brave_page(bib='12', number=1, total=1):
    return (f'<ul id="pagination" data-page="{number}" data-total="{total}">'
            '<div class="fl-wrap list-single-main-item_content mb-2">'
            f'<a href="/athlete/123/{bib}">Runner</a>'
            f'<div class="detail-info"><span>{bib}</span><span>21K</span><span>男A組</span></div>'
            '<div class="name">Runner</div><div class="time">01:30:00</div>')


class PublicImportTests(unittest.TestCase):
    def racelog_page(self, count='1', timed='1', untimed='0', race='HM'):
        return f'''<form><input type="hidden" name="id" value="108"></form>
        <div>目前顯示 <strong>{count}</strong> 筆個人成績（有完賽時間 <strong>{timed}</strong>、
        無完賽時間 <strong>{untimed}</strong>）</div>
        <table><thead><tr><th>總排名</th><th>號碼布</th><th>選手</th><th>組別</th><th>性別</th>
        <th>年齡組</th><th>完賽時間</th><th>性別排名</th><th>分組排名</th></tr></thead>
        <tbody><tr><td>—</td><td>008262</td><td>Runner A</td><td>{race}</td><td>男</td>
        <td>男17-35歲</td><td>01:06:56</td><td>—</td><td>—</td></tr></tbody></table>'''

    def test_racelog_parse_validates_counts_and_preserves_bib(self):
        rows, count = racelog.parse_page(self.racelog_page(), '108', 'HM')
        self.assertEqual(count, 1)
        self.assertEqual(rows[0]['背號'], '008262')
        self.assertTrue(rows[0]['排名資格'])

    def test_racelog_preserves_no_time_rows_but_excludes_them(self):
        page = '''<form><input type="hidden" name="id" value="108"></form>
        <div>目前顯示 <strong>1</strong> 筆個人成績（有完賽時間 <strong>0</strong>、
        無完賽時間 <strong>1</strong>）</div>
        <table><thead><tr><th>總排名</th><th>號碼布</th><th>選手</th><th>組別</th><th>性別</th>
        <th>年齡組</th><th>完賽時間</th><th>性別排名</th><th>分組排名</th></tr></thead></table>
        <table><thead><tr><th>號碼布</th><th>選手</th><th>組別</th><th>性別</th><th>年齡組</th>
        <th>狀態</th></tr></thead><tbody><tr><td>12345</td><td>Runner B</td><td>HM</td>
        <td>女</td><td>—</td><td>無完賽時間</td></tr></tbody></table>'''
        rows, count = racelog.parse_page(page, '108', 'HM')
        self.assertEqual(count, 1)
        self.assertEqual(rows[0]['背號'], '12345')
        self.assertFalse(rows[0]['排名資格'])

    def test_racelog_rejects_wrong_event_and_count_mismatch(self):
        with self.assertRaisesRegex(ValueError, 'different event'):
            racelog.parse_page(self.racelog_page().replace('value="108"', 'value="109"'), '108', 'HM')
        with self.assertRaisesRegex(ValueError, 'row count mismatch'):
            racelog.parse_page(self.racelog_page(count='2', timed='2'), '108', 'HM')

    def test_racelog_discovers_categories_and_maps_by_distance(self):
        page = '''<form><input name="id" value="108"></form>
        <a href="event.php?id=108&amp;category=426">MA <small>10</small></a>
        <a href="event.php?id=108&amp;category=427">21K半程組 <small>20</small></a>
        <a href="event.php?id=108&amp;category=428">10KM <small>30</small></a>'''
        categories = racelog.discover_categories(
            page, 'https://www.racelog.tw/event.php?id=108', '108', ['全馬', '半馬', '十公里'],
            {'全馬': 42.195, '半馬': 21.0975, '十公里': 10})
        self.assertEqual(categories, {'426': '全馬', '427': '半馬', '428': '十公里'})

    def test_racelog_event_does_not_enter_bravelog_audit_flow(self):
        self.assertFalse(is_bravelog({'result_source': 'racelog',
                                     'source_url': 'https://www.racelog.tw/event.php?id=108',
                                     'bravelog_filters': {'1': 'HM'}}))

    def test_brave_missing_pagination_rejected(self):
        with self.assertRaisesRegex(ValueError, 'pagination'):
            brave.parse_page('no results', '123', '21K')

    def test_brave_wrong_race_rejected(self):
        with self.assertRaisesRegex(ValueError, 'different race'):
            brave.parse_page(brave_page(), '456', '21K')

    def test_brave_repeated_bib_rejected(self):
        initial = '<select name="raceId"><option value="123">21K</option></select>'
        with patch.object(brave, 'read_page', side_effect=[initial, brave_page(total=2), brave_page(number=2, total=2)]), patch.object(brave.time, 'sleep'):
            with self.assertRaisesRegex(ValueError, 'Duplicate bib'):
                brave.fetch_results({'source_url': 'https://www.bravelog.tw/contest/rank/2026010101', 'bravelog_filters': {'123': '21K'}})

    def ct_fetch(self, total):
        result = {'success': True, 'pagination': {'currentPage': 1, 'totalPage': 1, 'totalCount': total},
                  'data': [{'typeID': 'race-id', 'value': ['12', 'Runner', '21K', '男甲組', 1, 54009999999]}]}
        with patch.object(ct, 'read_page', return_value='eventID: "event-id", types: [{"name":"21K","ID":"race-id"}], groups:'), patch.object(ct, 'urlopen', return_value=io.BytesIO(json.dumps(result).encode())), patch.object(ct.time, 'sleep'):
            return ct.fetch_results({'source_url': 'https://accounter.ctrun.com.tw/RSIS/Result/PH260426', 'race_types': ['21K']})

    def test_ct_ticks_match_source_whole_second_display(self):
        rows, counts = self.ct_fetch(1)
        self.assertEqual(rows[0]['完賽時間'], '01:30:00')
        self.assertEqual(counts, {'21K': 1})

    def test_ct_truncated_results_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Missing records'):
            self.ct_fetch(2)

    def test_pdf_joined_columns_and_wrapped_names(self):
        rows = parse_ranked_text('1 123王小明TPE 01:00:00\n2 456李小華\n😂 TPE 01:01:00', '10K', '女子組')
        self.assertEqual([r['背號'] for r in rows], ['123', '456'])
        self.assertEqual(rows[1]['完賽時間'], '01:01:00')

    def test_pdf_missing_rank_and_duplicate_bib_rejected(self):
        for content in ('1 123王TPE 01:00:00\n3 456李TPE 01:01:00', '1 123王TPE 01:00:00\n2 123李TPE 01:01:00'):
            with self.assertRaises(ValueError):
                parse_ranked_text(content, '10K', '女子組')


if __name__ == '__main__':
    unittest.main()

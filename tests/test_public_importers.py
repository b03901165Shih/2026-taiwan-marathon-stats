import io
import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import scrap_bravelog as brave
import scrap_ctrun as ct
from import_ranking_pdf import parse_ranked_text


def brave_page(bib='12', number=1, total=1):
    return (f'<ul id="pagination" data-page="{number}" data-total="{total}">'
            '<div class="fl-wrap list-single-main-item_content mb-2">'
            f'<a href="/athlete/123/{bib}">Runner</a>'
            f'<div class="detail-info"><span>{bib}</span><span>21K</span><span>男A組</span></div>'
            '<div class="name">Runner</div><div class="time">01:30:00</div>')


class PublicImportTests(unittest.TestCase):
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

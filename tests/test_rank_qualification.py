import sys
import io
import unittest
from unittest.mock import patch
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import pandas as pd
from qualify_run2pix import parse_page, qualify_rows, fetch_rankings
from extract_excel_result import load_and_group_seconds, build_data


class RankingQualificationTests(unittest.TestCase):
    def test_same_date_report_for_another_event_rejected(self):
        page = '<td class="REPORTHEADER"><span>2026 渣打臺北公益馬拉松</span></td>'
        with patch('qualify_run2pix.read_page', return_value=page):
            with self.assertRaisesRegex(ValueError, 'different event'):
                fetch_rankings('https://www.run2pix.com/report/report_w.php?EventCode=20260111&Race=MA&sn=360',
                               expected_name='2026 高雄富邦馬拉松')

    def sample(self):
        return pd.DataFrame([
            {'姓名': 'Ranked', '背號': '002065', '賽別': 'MA', '賽事類型': 'MA', '分組': '男36-50歲', '完賽時間': '02:18:12', '排名資格': False},
            {'姓名': 'Unranked', '背號': '004020', '賽別': 'MA', '賽事類型': 'MA', '分組': '男51-60歲', '完賽時間': '01:42:31', '排名資格': False},
        ])

    def test_time_without_qualification_excluded(self):
        df = self.sample()
        qualify_rows(df, 'MA', {2065: {'rank': 1, 'time': 8292, 'group': '男36-50歲'}})
        path = io.BytesIO()
        df.to_excel(path, index=False)
        path.seek(0)
        self.assertEqual(load_and_group_seconds(path)[('MA', 'ALL')], [8292])

    def test_winner_with_category_rank_zero_remains_qualified(self):
        page = "Total: 1 Page: 1/1<tr class='r2p-result-row' onClick=\"self.location='viewscore_w.php?bib=2065&EventCode=20251026'\">"
        for label, value in [('Category', '男36-50歲'), ('Official Time', '02:18:12'), ('Overall Rank', '1'), ('Category Rank', '0')]:
            page += f"<td data-label='{label}'>{value}</td>"
        page += '</tr>'
        rows, total, number, pages = parse_page(page)
        self.assertEqual(rows[0]['rank'], 1)
        self.assertEqual((total, number, pages), (1, 1, 1))
        with self.assertRaisesRegex(ValueError, 'overall rank'):
            parse_page(page.replace("data-label='Overall Rank'>1", "data-label='Overall Rank'>—"))
        for clock in ('00:00:00', '00:99:00', '--:--:--'):
            with self.assertRaisesRegex(ValueError, 'official clock'):
                parse_page(page.replace('02:18:12', clock))

    def test_mismatch_or_missing_original_rejected(self):
        for record in ({2065: {'rank': 1, 'time': 8292, 'group': '女36-50歲'}},
                       {999: {'rank': 1, 'time': 8292, 'group': '男36-50歲'}}):
            with self.assertRaises(ValueError):
                qualify_rows(self.sample(), 'MA', record)

    def test_formal_report_can_restore_missing_clock(self):
        df = self.sample()
        df.loc[0, '完賽時間'] = '--:--:--'
        qualify_rows(df, 'MA', {2065: {'rank': 1, 'time': 8292, 'group': '男36-50歲'}})
        self.assertEqual(df.loc[0, '完賽時間'], '02:18:12')

    def test_reimport_cannot_skip_required_qualification(self):
        path = io.BytesIO()
        self.sample().drop(columns=['排名資格']).to_excel(path, index=False)
        path.seek(0)
        with self.assertRaisesRegex(ValueError, 'qualify_run2pix'):
            build_data(path, {'ranking_report_urls': {'MA': 'report'}})

    def test_ambiguous_qualification_rejected(self):
        path = io.BytesIO()
        df = self.sample()
        df['排名資格'] = ['yes', 'no']
        df.to_excel(path, index=False)
        path.seek(0)
        with self.assertRaisesRegex(ValueError, '排名資格'):
            load_and_group_seconds(path)


if __name__ == '__main__':
    unittest.main()

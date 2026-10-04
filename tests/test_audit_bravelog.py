import copy
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import audit_bravelog as audit
from extract_excel_result import load_event_configs
from ranking_validation import save_audited_workbook, validate_workbook


def athlete(bib, ranking='1/1', official='02:18:12'):
    return (f'<a href="/athlete/123/{bib}">detail</a>'
            '<p class="rankCard-title rank-title">總排名<br>Overall Ranking</p>'
            f'<p class="rank-text">{ranking}</p>'
            '<p class="rankCard-title">大會成績<br>Official Time</p>'
            f'<p class="rankCard-text grade">{official}</p>'
            '<p class="rank-title">Div Ranking</p><p class="rank-text">0/1</p>')


class AuditTests(unittest.TestCase):
    def test_only_explicit_missing_clock_404_is_documented_source_gap(self):
        url = 'https://www.bravelog.tw/athlete/123/001'
        with patch.object(audit, 'read_page', side_effect=audit.PublicSourceHTTPError(404, url)):
            result = audit.fetch_profile(url, '123', '001', '--:--:--')
            self.assertEqual(result['status'], 'missing_no_clock_404')
            self.assertIsNone(result['rank'])
            for clock in ('02:18:12', 'unknown'):
                with self.assertRaises(audit.PublicSourceHTTPError):
                    audit.fetch_profile(url, '123', '001', clock)
        for error in (audit.PublicSourceHTTPError(503, url), TimeoutError('network unavailable')):
            with patch.object(audit, 'read_page', side_effect=error):
                with self.assertRaises(type(error)):
                    audit.fetch_profile(url, '123', '001', '--:--:--')

    def test_source_gap_cannot_hide_a_timed_or_qualified_row(self):
        df = self.dataframe()
        df['查核狀態'] = ['verified_profile', 'missing_no_clock_404']
        source = dict(self.source(), unavailable_no_clock_count=1, verified_profile_count=1)
        with self.workspace_directory() as directory:
            path = Path(directory) / 'source.xlsx'
            with self.assertRaisesRegex(ValueError, 'source gap'):
                save_audited_workbook(df, self.event(), {'MA': source}, path)
            df.loc[1, '完賽時間'] = '--:--:--'
            save_audited_workbook(df, self.event(), {'MA': source}, path)
            validate_workbook(path, self.event())

    def workspace_directory(self):
        return tempfile.TemporaryDirectory(prefix='.audit-test-', dir=Path(__file__).parent)

    def event(self):
        return {'id': 'sample', 'source_url': 'https://www.bravelog.tw/contest/rank/2025010101',
                'bravelog_source_url': 'https://www.bravelog.tw/contest/rank/2025010101',
                'ranking_validation': 'bravelog_individual', 'race_types': ['MA'],
                'bravelog_filters': {'123': 'MA'}}

    def source(self):
        return dict(url=self.event()['source_url'], ranked_count=1, raw_count=2,
                    profile_count=2, first_ten_seconds=[8292])

    def test_missing_list_clock_still_gets_individual_rank_check(self):
        rows = self.dataframe().drop(columns=['排名資格', '來源總排名', '排名來源']).to_dict('records')
        rows[0]['完賽時間'] = '--:--:--'
        rows.append(dict(rows[0], 背號='003'))
        def page(url):
            if '/athlete/123/001' in url: return athlete('001')
            if '/athlete/123/002' in url: return athlete('002', '0/1', '01:42:31')
            if '/athlete/123/003' in url: return athlete('003', '17/1834', '00:00:00')
            return 'list page'
        with self.workspace_directory() as directory:
            with patch.object(audit, 'read_page', side_effect=page), patch.object(audit, 'parse_page', return_value=(rows,1,1)):
                qualified, source = audit.fetch_brave_race(self.event(), '123', 'MA', Path(directory), workers=1)
        self.assertEqual(source['profile_count'], 3)
        self.assertEqual(source['ranked_count'], 1)
        self.assertEqual(source['restored_missing_clock'], 1)
        self.assertEqual(source['excluded_timed'], 1)
        self.assertEqual(qualified[0]['完賽時間'], '02:18:12')
        self.assertFalse(qualified[1]['排名資格'], 'A finish clock with overall rank zero is not qualified')
        self.assertFalse(qualified[2]['排名資格'], 'Published positive rank with a zero clock is not a valid finisher')
        self.assertEqual(qualified[2]['來源總排名'], 17)

    def dataframe(self):
        df = pd.DataFrame([
            {'姓名': '', '背號': '001', '賽別': 'MA', '賽事類型': 'MA', '分組': '男40-49歲',
             '完賽時間': '02:18:12', '排名資格': True, '來源總排名': 1, '排名來源': self.event()['source_url']},
            {'姓名': '', '背號': '002', '賽別': 'MA', '賽事類型': 'MA', '分組': '男40-49歲',
             '完賽時間': '01:42:31', '排名資格': False, '來源總排名': None, '排名來源': self.event()['source_url']},
        ])
        df['來源總排名'] = pd.to_numeric(df['來源總排名'], errors='coerce').astype('Int64')
        return df

    def test_public_rank_and_unranked_clock(self):
        self.assertEqual(audit.parse_athlete(athlete('001'), '123', '001')['rank'], 1)
        self.assertIsNone(audit.parse_athlete(athlete('002', '—', '01:42:31'), '123', '002')['rank'])
        self.assertIsNone(audit.parse_athlete(athlete('002', '0/1834', '00:00:00'), '123', '002')['rank'])
        self.assertIsNone(audit.parse_athlete(athlete('002', '0/0', '00:00:00'), '123', '002')['rank'])

    def test_empty_category_survives_excel_round_trip_without_guessing(self):
        from extract_excel_result import load_and_group_seconds
        with self.workspace_directory() as directory:
            path = Path(directory)/'results.xlsx'
            df = self.dataframe()
            df.loc[0, '分組'] = ''
            save_audited_workbook(df, self.event(), {'MA':self.source()}, path)
            normalized, proof = validate_workbook(path, self.event())
            self.assertEqual(normalized.loc[0,'分組'], '未提供分組')
            groups = load_and_group_seconds(path)
            self.assertEqual(groups[('MA','ALL')], [8292])
            self.assertEqual(groups[('MA','未提供分組')], [8292])

    def test_public_rank_without_denominator_and_comma_denominator(self):
        self.assertEqual(audit.parse_athlete(athlete('001', '1'), '123', '001')['rank'], 1)
        self.assertEqual(audit.parse_athlete(athlete('001', '1/2,623'), '123', '001')['total'], 2623)

    def test_only_current_incomplete_cache_can_resume(self):
        with self.workspace_directory() as directory:
            root = Path(directory)
            run, completed, first = audit.prepare_cache(root, 'sample')
            self.assertEqual(audit.prepare_cache(root, 'sample')[2], first)
            completed.write_text(run.read_text(encoding='utf-8'), encoding='utf-8')
            self.assertNotEqual(audit.prepare_cache(root, 'sample')[2], first)
            run.write_text('20200101T000000000000', encoding='utf-8')
            self.assertNotEqual(audit.prepare_cache(root, 'sample')[2].name, '20200101T000000000000')

    def test_unknown_status_wrong_identity_or_invalid_time_fails(self):
        for markup, bib in [(athlete('001', 'unknown'), '001'), (athlete('001'), '999'),
                            (athlete('001', '2/1'), '001'), (athlete('001', '1/1', '00:99:00'), '001')]:
            with self.assertRaises(ValueError):
                audit.parse_athlete(markup, '123', bib)

    def test_tampered_or_wrong_event_workbook_rejected(self):
        with self.workspace_directory() as directory:
            path = Path(directory)/'results.xlsx'
            source = {'MA': self.source()}
            save_audited_workbook(self.dataframe(), self.event(), source, path)
            self.assertEqual(validate_workbook(path, self.event())[1]['sources']['MA']['ranked_count'], 1)
            wrong = dict(self.event(), id='different')
            with self.assertRaisesRegex(ValueError, 'stale'):
                validate_workbook(path, wrong)
            changed = pd.read_excel(path, dtype={'背號':str})
            changed.loc[0, '完賽時間'] = '01:42:31'
            with pd.ExcelWriter(path, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
                changed.to_excel(writer, sheet_name='完整成績', index=False)
            with self.assertRaisesRegex(ValueError, 'stale'):
                validate_workbook(path, self.event())

    def test_legacy_numbered_rows_without_proof_rejected(self):
        with self.workspace_directory() as directory:
            path = Path(directory)/'legacy.xlsx'
            df = self.dataframe().drop(columns=['排名資格','來源總排名','排名來源'])
            df['總排名'] = [1, 2]  # Old scraper's invented row counter is not official rank.
            df.to_excel(path, index=False)
            with self.assertRaisesRegex(ValueError, 'audit_bravelog'):
                validate_workbook(path, self.event())

    def test_source_count_or_url_mismatch_rejected(self):
        with self.workspace_directory() as directory:
            for source, reason in ((dict(self.source(), ranked_count=2), 'count'),
                                   (dict(self.source(), url='https://www.bravelog.tw/contest/rank/OTHER'), 'source')):
                with self.assertRaisesRegex(ValueError, reason):
                    save_audited_workbook(self.dataframe(), self.event(), {'MA':source}, Path(directory)/'bad.xlsx')

    def test_public_fingerprint_and_source_anchors_must_match(self):
        with self.workspace_directory() as directory:
            path = Path(directory)/'results.xlsx'
            source = {'MA': self.source()}
            original = save_audited_workbook(self.dataframe(), self.event(), source, path)
            for field in ('public_data_digest', 'anchors'):
                proof = copy.deepcopy(original)
                if field == 'anchors':
                    proof['sources']['MA']['first_ten_seconds'] = [1]
                else:
                    del proof[field]
                with pd.ExcelWriter(path, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
                    pd.DataFrame([{'查核JSON':json.dumps(proof)}]).to_excel(writer, sheet_name='排名查核', index=False)
                with self.assertRaisesRegex(ValueError, 'fingerprint|anchors'):
                    validate_workbook(path, self.event())

    def test_new_bravelog_config_cannot_omit_ranking_rules(self):
        path = Path(__file__).resolve().parents[1]/'events_config.json'
        data = json.loads(path.read_text(encoding='utf-8'))
        e = next(e for events in data.values() for e in events if e['id']=='2026_puma_night_run')
        del e['ranking_validation']
        with self.workspace_directory() as directory:
            config = Path(directory)/'config.json'
            config.write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
            with self.assertRaisesRegex(ValueError, '排名資格'):
                load_event_configs(config)

    def test_failure_does_not_replace_original_workbook(self):
        with self.workspace_directory() as directory:
            path = Path(directory)/'original.xlsx'
            self.dataframe().to_excel(path, index=False)
            before = path.read_bytes()
            event = dict(self.event(), excel=str(path), ranking_validation='run2pix', ranking_report_urls={'MA':'report'})
            with patch.object(audit, 'fetch_rankings', side_effect=ValueError('Incomplete report')):
                with self.assertRaises(ValueError):
                    audit.audit_event(event, Path(directory)/'config.json', workers=1)
            self.assertEqual(path.read_bytes(), before)


if __name__ == '__main__':
    unittest.main()

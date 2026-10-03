import io
import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.parse import parse_qs

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import scrap_irunner as importer


def runner(bib, official="01:30:00"):
    return {"Name": f"<a href='/track/1457/record/{bib}'>Masked runner</a>",
            "ItemGroup": "男丁組", "OfficailTime": official, "NetTime": "01:29:00", "TotalRank": 1}


class FakeSource:
    def __init__(self, pages):
        self.pages, self.starts = list(pages), []

    def open(self, request, **kwargs):
        if isinstance(request, str):
            return io.BytesIO(b'<meta name="csrf-token" content="test"><li data-filter="21K">')
        params = parse_qs(request.data.decode())
        self.starts.append(int(params["start"][0]))
        return io.BytesIO(json.dumps(self.pages.pop(0)).encode())


class ImportTests(unittest.TestCase):
    event = {"source_url": "https://irunner.biji.co/track/1457/results", "irunner_filters": {"21K": "21K組"}}

    def fetch(self, source):
        with patch.object(importer, "build_opener", return_value=source), patch.object(importer.time, "sleep"):
            return importer.fetch_results(self.event)

    def test_short_pages_keep_official_time_and_invalid_records(self):
        source = FakeSource([{"recordsFiltered": 3, "data": [runner("1"), runner("2", "DNF")]},
                             {"recordsFiltered": 3, "data": [runner("3")]}])
        rows, counts = self.fetch(source)
        self.assertEqual(source.starts, [0, 2])
        self.assertEqual(counts, {"21K組": 3})
        self.assertEqual(rows[0]["完賽時間"], "01:30:00")
        self.assertEqual(rows[1]["完賽時間"], "DNF")

    def test_repeated_page_rejected(self):
        source = FakeSource([{"recordsFiltered": 2, "data": [runner("1")]},
                             {"recordsFiltered": 2, "data": [runner("1")]}])
        with self.assertRaisesRegex(ValueError, "重複"):
            self.fetch(source)

    def test_incomplete_source_rejected(self):
        source = FakeSource([{"recordsFiltered": 2, "data": [runner("1")]},
                             {"recordsFiltered": 2, "data": []}])
        with self.assertRaisesRegex(ValueError, "分頁中斷"):
            self.fetch(source)

    def test_team_aggregate_is_not_individual_time(self):
        source = FakeSource([{"recordsFiltered": 1, "data": [{**runner("1"), "Name": "Team score"}]}])
        with self.assertRaisesRegex(ValueError, "個人號碼布"):
            self.fetch(source)


if __name__ == "__main__":
    unittest.main()

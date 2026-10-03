"""Import public iRunner individual results into the existing Excel workflow."""
import argparse
import html
import http.cookiejar
import json
import re
import time
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, build_opener, HTTPCookieProcessor

from extract_excel_result import load_event_configs


class TextParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def text(value):
    parser = TextParser()
    parser.feed(str(value or ""))
    return html.unescape(" ".join(parser.parts)).strip()


def fetch_results(event, page_size=500):
    url = event["source_url"]
    match = re.fullmatch(r"https://irunner\.biji\.co/track/(\d+)/results", url)
    if not match:
        raise ValueError("source_url 必須是 iRunner /track/編號/results 官方成績頁")
    filters = event["irunner_filters"]
    opener = build_opener(HTTPCookieProcessor(http.cookiejar.CookieJar()))
    page = opener.open(url, timeout=30).read().decode("utf-8")
    published = set(re.findall(r"data-filter=['\"]([^'\"]+)['\"]", page))
    if not set(filters).issubset(published):
        raise ValueError("設定的篩選 ID 不在官方成績頁，請核對 irunner_filters")
    token = re.search(r'<meta name="csrf-token" content="([^"]+)"', page)
    if not token:
        raise ValueError("官方頁面沒有 CSRF token，請確認網址／網站格式")
    rows, seen, counts = [], set(), {}
    for filter_id, race in filters.items():
        start, total, draw = 0, None, 1
        while total is None or start < total:
            payload = {"racing": match[1], "filter": filter_id, "start": start,
                       "length": page_size, "draw": draw, "csrf_token": token[1]}
            request = Request("https://irunner.biji.co/timing/loadresults",
                              data=urlencode(payload).encode(), headers={
                                  "X-CSRF-Token": token[1], "X-Requested-With": "XMLHttpRequest",
                                  "Referer": url})
            with opener.open(request, timeout=30) as response:
                result = json.load(response)
            if "data" not in result:
                raise ValueError(f"官方回傳非成績資料: {race}")
            count = int(result["recordsFiltered"])
            if total is not None and total != count:
                raise ValueError(f"{race} 資料人數在擷取時變動，請重新執行")
            total = count
            batch = result["data"]
            if not batch and start < total:
                raise ValueError(f"{race} 分頁中斷: {start}/{total}")
            for item in batch:
                name_html = item.get("Name", "")
                bib_match = re.search(r"/record/(\d+)", name_html)
                if not bib_match:
                    raise ValueError(f"{race} 並非有個人號碼布的成績，不能混入團隊總時間")
                bib = bib_match[1]
                key = (filter_id, bib)
                if key in seen:
                    raise ValueError(f"{race} 分頁出現重複號碼布，拒絕產生不完整資料")
                seen.add(key)
                rows.append({"姓名": text(name_html), "背號": bib, "賽別": race,
                             "賽事類型": race, "分組": text(item["ItemGroup"]),
                             "完賽時間": text(item["OfficailTime"]),
                             "晶片時間": text(item.get("NetTime")),
                             "來源總排名": item.get("TotalRank")})
            start += len(batch)
            draw += 1
            time.sleep(.3)
        counts[race] = total
        print(f"{race}: {total} 筆公開成績（含無有效時間者）")
    return rows, counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--event-id", required=True)
    parser.add_argument("--config", default=str(Path(__file__).with_name("events_config.json")))
    args = parser.parse_args()
    event = next((e for e in load_event_configs(args.config) if e["id"] == args.event_id), None)
    if not event:
        parser.error("找不到賽事 ID")
    rows, counts = fetch_results(event)
    import pandas as pd
    target = Path(args.config).resolve().parent / "excels" / Path(event["excel"]).name
    target.parent.mkdir(exist_ok=True)
    with pd.ExcelWriter(target, engine="openpyxl") as writer:
        pd.DataFrame(rows).to_excel(writer, sheet_name="完整成績", index=False)
        pd.DataFrame([{"賽別": race, "來源筆數": n} for race,n in counts.items()]).to_excel(writer, sheet_name="來源筆數", index=False)
    print(f"已儲存 {len(rows)} 筆至 {target.name}；下一步執行 extract_excel_result.py --event-id {event['id']}")


if __name__ == "__main__":
    main()

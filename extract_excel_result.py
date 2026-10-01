import argparse
import math
import json
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path
import pandas as pd


# Windows 傳統主控台可能使用 CP950，無法輸出程式內的 emoji。
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


# ========= 基本工具函式 =========

def time_str_to_seconds(t: str) -> int:
    """
    將 'HH:MM:SS' 轉成秒數 (int)。
    若格式不合法，拋出 ValueError。
    """
    h, m, s = map(int, str(t).split(":"))
    return h * 3600 + m * 60 + s


def seconds_to_time_str(sec: int) -> str:
    """
    將秒數轉回 'HH:MM:SS' 字串。
    """
    sec = int(sec)
    h = sec // 3600
    m = (sec % 3600) // 60
    s = sec % 60
    return f"{h:02d}:{m:02d}:{s:02d}"



def build_group_keys(row) -> list[tuple[str, str]]:
    """給一列成績，回傳它應該被歸到哪些 (賽別, 分組key)"""
    keys: list[tuple[str, str]] = []
    race_type = row["賽別"]
    group = str(row["分組"])
    
    # 1) 賽別 + ALL
    keys.append((race_type, "ALL"))
    # 2) 賽別 + 原始分組
    keys.append((race_type, group))
    return keys


# ========= 讀取 Excel & 整理秒數 =========

def load_and_group_seconds(excel_path: str) -> dict[tuple[str, str], list[int]]:
    """
    從 Excel 讀取資料，依 (賽別, 分組key) 回傳完賽秒數 list。
    Excel 欄位（A1~I1）：
        姓名, 背號, 賽別, 賽事類型, 分組, 完賽時間, 來源分組標籤, 完賽時間_td, 總排名
    """
    df = pd.read_excel(excel_path)

    required_cols = ["姓名", "背號", "賽別", "賽事類型", "分組", "完賽時間"]
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Excel 缺少必要欄位: {col}")

    # 篩選有效資料 + 轉秒數
    def safe_time_to_seconds(t):
        """安全轉換：無效值回傳 None"""
        if pd.isna(t) or str(t).strip() in ['--', '-', 'DNF', 'DNS', '']:
            return None
        try:
            return time_str_to_seconds(str(t))
        except:
            return None

    # 如有 seconds 欄位，可以直接用；否則從完賽時間轉
    if "seconds" in df.columns:
        df["seconds"] = df["seconds"].astype(int)
    else:
        df["seconds"] = df["完賽時間"].apply(safe_time_to_seconds)

    group_seconds: dict[tuple[str, str], list[int]] = defaultdict(list)

    for _, row in df.iterrows():
        time_val = row["完賽時間"]
        if pd.isna(time_val):
            continue

        try:
            sec = int(row["seconds"])
        except Exception:
            try:
                sec = time_str_to_seconds(time_val)
            except Exception:
                continue

        # DNF / 空值排除可以在這裡加條件
        for race_type, key in build_group_keys(row):
            group_seconds[(race_type, key)].append(sec)

    # 排序
    for k in group_seconds:
        group_seconds[k].sort()

    return group_seconds


# ========= 建立 5 分鐘 histogram =========

def build_histograms(group_seconds: dict[tuple[str, str], list[int]],
                     bin_size_sec: int = 5 * 60) -> dict[str, dict]:
    """
    為每個 (賽別, 分組key) 做 5 分鐘 bin 的 histogram。
    回傳:
        {
          "HM__ALL": {
            "histogram_5min": [
              {"start_sec":..., "end_sec":..., "start_time":..., "end_time":..., "count":...},
              ...
            ]
          },
          ...
        }
    """
    result: dict[str, dict] = {}

    for (race_type, group_key), arr in group_seconds.items():
        if not arr:
            continue
        print(f'KEYS = {(race_type, group_key)} -> len = {len(arr)}')
        min_s = min(arr)
        max_s = max(arr)

        start_bin = int(min_s // bin_size_sec)
        end_bin = int(math.ceil(max_s / bin_size_sec))

        bins = []
        for b in range(start_bin, end_bin + 1):
            lo = b * bin_size_sec
            hi = (b + 1) * bin_size_sec
            # 計數：lo <= sec < hi
            count = sum(1 for x in arr if lo <= x < hi)
            bins.append({
                "start_sec": lo,
                "end_sec": hi,
                "start_time": seconds_to_time_str(lo),
                "end_time": seconds_to_time_str(hi),
                "count": count,
            })

        key = f"{race_type}__{group_key}"
        if key not in result:
            result[key] = {}
        result[key]["histogram_5min"] = bins

    return result


# ========= 各組 summary（人數/最短/最長/平均/中位數） =========

def build_sorted_seconds(group_seconds: dict[tuple[str, str], list[int]]) -> dict[str, dict]:
    """建立 sorted_seconds"""
    result: dict[str, dict] = {}
    for (race_type, group_key), arr in group_seconds.items():
        if not arr:
            continue
        key = f"{race_type}__{group_key}"
        result[key] = {
            "sorted_seconds": [int(x) for x in sorted(arr)]
        }
    return result

# ========= 🚀 擴充性最佳方案：Metadata 結構 =========
def create_metadata(event_config: dict) -> dict:
    """建立標準化 metadata"""
    metadata = {
        "event_id": event_config["id"],
        "event_name": event_config["name"],
        "event_date": event_config.get("date", ""),
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_participants": event_config.get("total_count", 0),
        "race_types": event_config["race_types"],
        "race_distances_km": event_config["race_distances_km"],
        "group_categories": event_config.get("group_categories", ["ALL", "一般", "輪椅", "視障"]),
        "data_structure": {
            "histogram_bin_size": "5min",
            "percentile_precision": "0.1%",
            "time_format": "HH:MM:SS"
        }
    }

    for optional_key in ("source_url", "status", "notes"):
        if optional_key in event_config:
            metadata[optional_key] = event_config[optional_key]

    return metadata

def build_data(excel_path: str, event_config: dict) -> tuple[dict, dict, dict]:
    """建立完整資料集：combined + summary + metadata"""
    print("🔄 讀取並整理秒數中...")
    group_seconds = load_and_group_seconds(excel_path)
    actual_race_types = {str(race_type) for race_type, _ in group_seconds}
    missing_distances = actual_race_types - set(event_config["race_distances_km"])
    if missing_distances:
        raise ValueError(f"成績賽別缺少距離設定: {sorted(missing_distances)}")
    
    print("📊 計算 histogram...")
    hist_json = build_histograms(group_seconds)
    
    print("⚡ 建立 sorted_seconds...")
    sorted_json = build_sorted_seconds(group_seconds)
    
    # 合併成 event 前綴 key
    combined: dict[str, dict] = {}
    all_keys = set(hist_json.keys()) | set(sorted_json.keys())
    for k in all_keys:
        full_key = f"{event_config['id']}__{k}"
        combined[full_key] = {}
        if k in hist_json:
            combined[full_key].update(hist_json[k])
        if k in sorted_json:
            combined[full_key]["sorted_seconds"] = sorted_json[k]["sorted_seconds"]
    
    metadata = create_metadata(event_config)
    return combined,  metadata

def output_event_js(combined: dict, metadata: dict, js_filename: str):
    """輸出標準化 .js 檔案，包含完整 metadata"""
    with open(js_filename, "w", encoding="utf-8") as f:
        f.write("// ================================================\n")
        f.write(f"// {metadata['event_name']} 前處理資料\n")
        f.write(f"// 生成時間：{metadata['generated_at']}\n")
        f.write(f"// 總人數：{metadata['total_participants']}人\n")
        f.write("// 包含：histogram_5min + sorted_seconds\n")
        f.write("// ================================================\n\n")
        
        f.write("window.marathonData = window.marathonData || {};\n\n")
        f.write(f"// {metadata['event_name']} 資料\n")
        f.write(f"window.marathonData['{metadata['event_id']}'] = ")
        json.dump({
            "metadata": metadata,
            "binsAndPr": combined,
        }, f, ensure_ascii=False, indent=2)
        f.write(f";\n\n")
        
        # 統計資訊註解
        total_keys = len(combined)
        total_races = len({k.split("__", 2)[1] for k in combined})
        total_people = sum(
            len(v.get("sorted_seconds", []))
            for k, v in combined.items() if k.endswith("__ALL")
        )
        f.write(f"// 📊 統計：{total_races}賽別 × {total_keys}分組 = {total_people:,}完賽記錄\n")
    
    print(f"✅ 輸出：{js_filename}")
    print(f"   📅 {metadata['event_name']}")
    print(f"   👥 {total_people:,}人 / {total_races}賽別 / {total_keys}分組")

# ========= 賽事設定檔 =========
DEFAULT_EVENT_CONFIG_PATH = Path(__file__).with_name("events_config.json")


def load_event_configs(config_path: str | Path = DEFAULT_EVENT_CONFIG_PATH) -> list[dict]:
    """從 JSON 設定檔載入賽事設定。"""
    path = Path(config_path)
    with path.open("r", encoding="utf-8") as f:
        payload = json.load(f)

    if isinstance(payload, dict):
        events = payload.get("past_events", []) + payload.get("events", [])
    else:
        events = payload
    if not isinstance(events, list):
        raise ValueError("賽事設定格式錯誤：events 必須是 list")

    required_keys = {"id", "name", "excel", "date", "race_types", "race_distances_km"}
    seen_ids = set()
    for event in events:
        missing = required_keys - set(event.keys())
        if missing:
            raise ValueError(f"賽事設定缺少欄位 {missing}: {event}")
        if event["id"] in seen_ids:
            raise ValueError(f"重複的賽事 id: {event['id']}")
        seen_ids.add(event["id"])
        distances = event["race_distances_km"]
        if not isinstance(distances, dict) or set(distances) != set(event["race_types"]):
            raise ValueError(f"{event['id']} 的 race_distances_km 必須逐一對應 race_types")
        if any(not isinstance(km, (int, float)) or isinstance(km, bool)
               or not math.isfinite(km) or km <= 0 for km in distances.values()):
            raise ValueError(f"{event['id']} 的賽別距離必須是正數公里數")

    return events


# ========= 🎯 主程式：支援多賽事擴充 =========
def main():
    """支援未來無限擴充新賽事！"""

    parser = argparse.ArgumentParser(description="根據 Excel 成績檔生成前端資料檔")
    parser.add_argument(
        "--config",
        default=str(DEFAULT_EVENT_CONFIG_PATH),
        help="賽事設定 JSON 路徑（預設: events_config.json）",
    )
    parser.add_argument("--event-id", help="只產生指定賽事的資料檔")
    args = parser.parse_args()

    config_dir = Path(args.config).resolve().parent
    EVENTS = load_event_configs(args.config)
    if args.event_id:
        EVENTS = [event for event in EVENTS if event["id"] == args.event_id]
        if not EVENTS:
            parser.error(f"找不到賽事 id: {args.event_id}")

    # 未來加新賽事：直接在 events_config.json 新增一筆即可。

    failures = []
    for event in EVENTS:
        try:
            excel_path = Path(event["excel"])
            if not excel_path.is_absolute():
                excel_path = config_dir / excel_path
            if not excel_path.exists() and len(Path(event["excel"]).parts) == 1:
                excel_path = config_dir / "excels" / event["excel"]
            combined, metadata = build_data(excel_path, event)
            data_dir = config_dir / "data"
            data_dir.mkdir(exist_ok=True)
            js_filename = data_dir / f"{event['id']}_data.js"
            output_event_js(combined, metadata, js_filename)
            print()
        except Exception as e:
            print(f"❌ {event['name']} 處理失敗：{e}")
            failures.append(event["id"])

    if failures:
        raise SystemExit(f"以下賽事產生失敗：{', '.join(failures)}")

if __name__ == "__main__":
    main()

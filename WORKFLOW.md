# 賽事資料更新與維護

網站是靜態 HTML／CSS／JavaScript。賽事名稱、日期、距離及代碼組的歲數集中在 `events_config.json`；一般資料擴充不需要修改 HTML 或 JavaScript。

## 新增一場賽事

1. 用 `scrap_result.py` 取得成績 Excel，放在專案根目錄或 `excels/`。「完整成績」工作表需包含 `姓名`、`背號`、`賽別`、`賽事類型`、`分組`、`完賽時間`。爬蟲使用 Selenium，Excel 轉檔使用 pandas、openpyxl。
2. 在 `events_config.json` 的 `events` 清單複製一筆，修改 ID、名稱、Excel 檔名、日期、賽別與公里數。賽別須與 Excel 一致；ID 使用英文、數字、底線或連字號。不要依代碼猜距離，例如 Panasonic 的 `10` 實際為 12.5 公里。
3. 執行以下命令，將 `2026_example` 換成新 ID：

```powershell
python extract_excel_result.py --event-id 2026_example
```

程式產生 `data/2026_example_data.js`，並自動更新 `data/event-catalog.js`。重新整理即可看到新賽事，**不用加入 script 標籤**。沒有有效完賽資料的賽別不出現在選單。

設定範例：

```json
{
  "id": "2026_example",
  "name": "2026 範例路跑",
  "excel": "範例成績.xlsx",
  "date": "2026-10-03",
  "race_types": ["半馬"],
  "race_distances_km": {"半馬": 21.0975},
  "total_count": 0,
  "source_url": "https://example.org/results"
}
```

`total_count` 可填 0，由成績檔計算有效完賽人數。前端資料只含時間陣列及統計，不含跑者姓名、背號；原始 Excel 已被 `.gitignore` 排除。

### iRunner 成績來源

若來源是 iRunner，使用 `scrap_irunner.py`，不需要 Selenium。先在賽事設定填官方 `source_url`（`https://irunner.biji.co/track/編號/results`），並增加成績頁各賽別的篩選 ID 對照，例如寶礦力：

```json
"irunner_filters": {
  "21K": "21K組",
  "21KG": "21K 團隊競賽組",
  "10K": "10K組",
  "10KG": "10K 團隊競賽組"
}
```

篩選 ID 取自官方成績頁的 `data-filter`，不能只憑名稱猜測；右側名稱須與 `race_types` 一致。依序執行：

```powershell
python scrap_irunner.py --event-id 2025_pocari_run
python extract_excel_result.py --event-id 2025_pocari_run
```

匯入程式使用 Python 標準 HTTP 函式庫及官方頁面的正常 session／CSRF；每頁確認人數與號碼布，分頁中斷或重複時停止，避免產生缺漏資料。Excel 保留大會時間和晶片時間，前處理只用大會時間。團隊資料須仍有個人號碼布，不接受隊伍加總時間。`來源筆數` 工作表記錄各賽別含無效時間者的人數。

族群選單依來源實際提供的性別顯示，單純「男／女」分組不重複列入其他原始分組；團隊原始分組不含性別時不推估性別。

## 代碼組補上歲數

原始組名若已是 `男30-39歲`、`女60歲+`，網站直接解析。只有 A／B／甲／乙時，先查看**同一年、同一賽別的原始簡章**，再於賽事設定新增：

```json
"group_age_source": "https://example.org/original-rules",
"group_age_ranges": {
  "半馬": {
    "男D組": [30, 39],
    "男A組": [60, null]
  }
}
```

外層鍵是 Excel 賽別，內層鍵是 Excel 原始分組名稱。`[30,39]` 為 30–39 歲，`[60,null]` 為 60 歲以上，`[0,19]` 為 19 歲以下。男女、半馬與 10K 的代碼可能不同，要分別填寫。年齡依各場簡章的出生年或採計規則，不從時間推估。

只修改名稱、日期、距離或歲數，不需重讀 Excel：

```powershell
python extract_excel_result.py --catalog-only
```

此命令只需 Python 標準函式庫，不需 pandas。設定檔是唯一維護入口；`data/event-catalog.js` 為自動產物，請勿手改。清單套用最新設定，刪除年齡對照也會清除舊定義；只登錄已有 `*_data.js` 的賽事，轉檔失敗會回報錯誤。

## 代碼年齡的查核來源

核對日期：2026-10-03。完整逐組對照見 `events_config.json` 的 `group_age_ranges`。

| 賽事 | 原始來源 | 注意事項 |
| --- | --- | --- |
| 2026 國家地理路跑 | [官方報名簡章，第 13 項](https://irunner.biji.co/2026NGR?page=4422) | 半馬男 D 為 30–39 歲，女 D 為 16–29 歲；男女代碼不同。 |
| 2025 統一發票盃 | [官方報名簡章](https://irunner.biji.co/2025mofrun10k-21k?page=4149) | 半馬男女甲60+、乙50–59、丙40–49、丁30–39、戊18–29；10K 高齡70+、A60–69、B50–59、C40–49、D30–39、E20–29、F19以下。 |
| 2026 臺南古都 | [學校公告附的官方競賽規程 PDF，第 2 頁](https://schoolweb.tn.edu.tw/~ssjh_web/modules/tadnews/index.php?files_sn=3982&fn=%E5%BA%9C%E5%9F%8E%E9%A6%AC%E6%8B%89%E6%9D%BE.pdf&op=tufdl) | 男 E 為 30–39 歲，女 D 為 30–39 歲；10K 另有男 H12–16、女 G12–16，半馬無此兩組。 |
| 2026 PUMA 螢光夜跑 | [官方網站](https://www.puma-nightrun.com.tw/) → [原報名頁](https://bao-ming.com/eb/content/6829) | 原報名頁目前失效／轉回首頁，無法核實甲乙組歲數。介面明示「歲數定義待核實」，不猜測、不納入年齡跨場比較。取得原始簡章後只需填設定與執行 catalog-only。 |
| 2025 寶礦力路跑 | [2025 活動簡章存檔，第 10 頁](https://www.scribd.com/document/976856802/2025-Pocari-Sweat-Run活動簡章)；[大腳丫分齡表交叉核對](https://www.bigfoot.org.tw/Notice/ScoreDetail?ID=beb9c364-60c2-43b1-9dda-3ae1bb722292) | 官方舊報名頁已失效，使用同年度簡章存檔；21K 男女高組66+、甲56–65、乙46–55、丙36–45、丁26–35、戊17–25。團隊組不納入分齡敘獎。 |

PUMA 日期已依 [BraveLog 賽事頁](https://www.bravelog.tw/contest/2026032802) 更正為 2026-03-28。

寶礦力 2025-10-18 賽事來源為 [iRunner 官方總成績](https://irunner.biji.co/track/1457/results)。2026-10-03 擷取 6,016 筆，排除無有效大會時間後保留 5,177 筆：21K個人1,767、團隊172、10K個人3,030、團隊208。四個賽別分開保存，個人與團隊的號碼布無重複；原始團隊分組未提供性別，因此只開放全體查詢。簡章標示 21K，設定為21公里，無法確認為21.0975公里時不混比；4K／線上跑未收錄。

## 比較及目標的規則

- PR = 嚴格慢於查詢時間的人數 ÷ 有效完賽人數 × 100。同秒者不算超越；試算排名為更快的人數 + 1。
- PR 反查找出至少達標的最慢整秒。PR 0 無時間上限，顯示最慢已觀測時間；PR 100 需快於最快成績。
- 名次目標預設前 10，可選 1／3／5／10／20／50，標題隨所選名次更新。顯示第 N 筆時間及快 1 秒的建議目標，不足 N 人則提示無門檻。前 10 筆列表按時間排序，同秒可占多筆，不模擬官方頒獎名次及總排得獎者排除規則。
- 跨場只比較相同公里數、參賽類型及族群。年齡組須相同性別、最低／最高歲數；可合併完整相鄰組，不能把長榮 36–50 歲切成 40–49 歲。未納入的同距離場次會列原因。
- 分布比較採完整資料，可看累積比例或每 5 分鐘比例。我的位置圖可收合極端尾端；PR 和排名始終使用全部資料。
- 三頁共用時間，改動即更新；分享連結保存篩選、時間、PR、名次、目標分組及頁籤。

## 檔案職責

| 檔案 | 負責內容 |
| --- | --- |
| `index.html`／`styles.css` | 頁面結構、共用字級與手機排版。 |
| `events_config.json` | 人工維護的賽事、距離及年齡定義。 |
| `extract_excel_result.py` | Excel → 時間資料；設定 → 賽事清單，含設定驗證。 |
| `scrap_irunner.py` | 依賽事設定分頁下載官方公開個人成績，保存本機 Excel。 |
| `data/event-catalog.js` | 自動產生的載入清單與顯示設定。 |
| `js/data-loader.js` | 依清單載入資料、套用最新設定及回報載入失敗。 |
| `js/stats.js` | 獨立排名、PR、百分位及目標計算。 |
| `js/age-groups.js` | 通用年齡解析、標籤及完整區間配對，不寫死賽事。 |
| `js/app.js` | 選單、共用查詢狀態、結果與圖表；索引與合併快取。 |
| `preview.cjs`／`tests/` | 本機預覽／統計、資料與設定驗證。 |

不需要 npm 安裝、框架、打包或後端。Chart.js 4.4.8 由 CDN 載入；圖表套件失效時文字試算仍可用。

## 修改後驗證與文件同步

```powershell
node tests/stats.test.js
node tests/age.test.js
node tests/data.test.js
node tests/catalog.test.js
python -m unittest discover -s tests -p "test_irunner.py"
node --check js/app.js
node preview.cjs
```

開啟 `http://127.0.0.1:5173/`，檢查頁籤切換後時間保留、歲數標籤、年齡比較、PR／名次目標、連結還原及手機排版。

每次修改功能、資料、介面或維護流程，**同一次工作同步更新相關 `.md`**：README 功能／限制、本文件操作／來源／驗證及有變動的專案規範。永久規範見 `CLAUDE.md`。送交 review 前檢查 `git diff --check`，列出仍待核實的來源。

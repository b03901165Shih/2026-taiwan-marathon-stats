# 賽事資料更新與維護

網站是靜態 HTML／CSS／JavaScript。賽事名稱、日期、距離及代碼組的歲數集中在 `events_config.json`；一般資料擴充不需要修改 HTML 或 JavaScript。

## 新增一場賽事

1. 先照下方供應商設定，用對應匯入程式取得成績 Excel，放在專案根目錄或 `excels/`。「完整成績」工作表需包含 `姓名`、`背號`、`賽別`、`賽事類型`、`分組`、`完賽時間`。Excel 轉檔使用 pandas、openpyxl；不需要 Selenium；舊版 `scrap_result.py` 已改為查核入口相容指令。
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

### BraveLog、全統及官方 PDF

三種來源都沿用「填設定 → 取得本機 Excel → 轉成網頁資料」，不需要逐場修改程式。安裝 Excel 依賴：`python -m pip install pandas openpyxl`；只有 PDF 來源額外需要 `pypdf`。

| 來源 | 在設定中增加 | 匯入命令範例 |
| --- | --- | --- |
| BraveLog | 官方排名 `source_url`、`bravelog_filters`（頁面 `raceId` → 完整賽別名稱）、`ranking_validation` | `python audit_bravelog.py --event-id 2025_chiayi_twinlake_elite` |
| 全統 | 官方 `https://accounter.ctrun.com.tw/RSIS/Result/活動代碼`、`race_types` 完整名稱；賽別 ID 自動讀取 | `python scrap_ctrun.py --event-id 2026_zepro_taichung` |
| 官方排名 PDF | `pdf_ranking_sources`，每份填 `url`、`race`、`group`、`expected_count` | `python import_ranking_pdf.py --event-id 2026_wanjinshi_marathon` |

設定可直接複製本次對應賽事。匯入後一律執行 `python extract_excel_result.py --event-id 相同ID`。PDF 適用「排名／背號／姓名／國籍／時間」欄位的文字型公告；其他格式需要新增解析器，不能直接套用。`expected_count` 必須從公告末筆排名核實，不是報名上限。

BraveLog 完整流程另見下方「排名資格強制查核」；全統另比對 API 總筆數及實際頁碼。全統 ticks 依原頁顯示方式取整秒，零值視為無有效成績。PDF 逐筆核對連續排名、背號不重複、公告筆數，並支援欄位相連及姓名換行。所有匯入完成後才寫 Excel，分頁缺漏時停止，不輸出部分成果。公開排名不是報名人數，無有效時間者不進前端統計；各來源可能未公開所有 DNS／DNF。

只讀取公開排名，不需要登入或解鎖個人成績證書。PDF 只有性別時保留性別，不依姓名、背號或賽事年齡表猜測逐人分齡。

設定的 `notes` 會顯示在網頁共用選單下方，可說明未提供分齡、距離差異或非競賽計時等限制；修改後執行 `--catalog-only` 即生效。

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

本次新增 10 場（包含竹北）的官方來源、逐賽別原始／有效筆數及分齡規則見 [DATA_SOURCES.md](DATA_SOURCES.md)。全站已有 21 場、49 個有效賽別。

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
- 參考年份從可用賽事日期自動產生，新到舊排列；參考賽事只列所選年度，切換年份選該年最新場次，保留時間／頁籤及仍可用的篩選。年份不限制跨場比較。連結同時有年份與賽事時，以實際賽事年份為準，兼容舊連結與無效參數；新增年度只需照既有流程加賽事。

## 檔案職責

| 檔案 | 負責內容 |
| --- | --- |
| `index.html`／`styles.css` | 頁面結構、共用字級與手機排版。 |
| `events_config.json` | 人工維護的賽事、距離及年齡定義。 |
| `extract_excel_result.py` | Excel → 時間資料；設定 → 賽事清單，含設定驗證。 |
| `scrap_irunner.py` | 依賽事設定分頁下載官方公開個人成績，保存本機 Excel。 |
| `scrap_bravelog.py`／`scrap_ctrun.py` | 通用公開排名匯入，驗證分頁與背號。 |
| `audit_bravelog.py`／`qualify_run2pix.py`／`ranking_validation.py` | 完整資格查核、正式報表解析及查核憑據／轉檔防漏；舊指令也進入相同流程。 |
| `import_ranking_pdf.py` | 固定欄位的官方文字 PDF 匯入與公告筆數核對。 |
| `DATA_SOURCES.md` | 本次新增來源、距離及年齡查核，原始與有效筆數分開記錄。 |
| `data/event-catalog.js` | 自動產生的載入清單與顯示設定。 |
| `js/data-loader.js` | 依清單按需載入、檢查來源查核、優先處理使用者選取，並以有限並行數背景預載。 |
| `js/stats.js` | 獨立排名、PR、百分位及目標計算。 |
| `js/age-groups.js` | 通用年齡解析、標籤及完整區間配對，不寫死賽事。 |
| `js/app.js` | 選單、共用查詢狀態、結果與圖表；索引與合併快取。 |
| `preview.cjs`／`tests/` | 本機預覽／統計、資料與設定驗證。 |

不需要 npm 安裝、框架、打包或後端。Chart.js 4.4.8 由 CDN 非同步載入，不阻塞文字查詢；圖表套件失效時文字試算仍可用。

載入策略：首頁只等待分享連結指定或預設的第一場，完成後即開放查詢；瀏覽器閒置時最多預載兩場，背景工作一次只下載一場。使用者切換賽事可與背景下載並行，且優先於排隊工作。跨場頁依參考賽別的實際公里數載入其他場次，完成一場便更新一次表格；不必等待全部賽事，也不把不同距離的資料抓下來。相同檔案的請求會共用同一個載入 Promise；查核不符與載入失敗仍會排除。

## 修改後驗證與文件同步

```powershell
node tests/stats.test.js
node tests/age.test.js
node tests/data.test.js
node tests/catalog.test.js
node tests/source.test.js
node tests/audit.test.js
node tests/loader.test.js
python -m unittest discover -s tests -p "test_*.py"
node --check js/app.js
node preview.cjs
```

開啟 `http://127.0.0.1:5173/`，檢查頁籤切換後時間保留、歲數標籤、年齡比較、PR／名次目標、連結還原及手機排版。新增來源的測試包含錯誤賽別、遺失分頁、重複背號、PDF 缺名次與姓名換行。確認新賽事筆數與來源查核表相符，前端 JS 不含姓名／背號。

年份選單變更另檢查：預設最新年度、切換後只列該年賽事、舊連結自動選對年度、矛盾／無效參數不產生空選單、跨場結果仍可包含其他年份，手機先年份再賽事依序排列。

### 發現來源矛盾時

先確認賽別、性別與參賽類型，再回查原始來源。保留修正前的筆數／異常摘要，重新匯入整場各賽別，核對來源第一筆時間、分頁、背號唯一與有效筆數，重產前端資料。不能只設速度門檻刪除疑似異常值；有姓名／背號的原始 Excel 保留本機，公開查核記錄不需暴露個人資料。

### 排名資格強制查核

BraveLog 及 Run2Pix 報表來源自動要求查核，不能只填「有時間」或自行編的總排名。新人只需要在 `events_config.json` 複製同來源設定，使用同一個指令；不修改 HTML／JavaScript。

**沒有完整正式報表時：** `source_url` 填公開 BraveLog 排名頁，`ranking_validation` 填 `bravelog_individual`，`bravelog_filters` 填實際 `raceId` 對應的完整賽別。舊匯入指令 `scrap_bravelog.py`、`scrap_result.py` 都會轉入同一套查核流程。

**有 Run2Pix 正式報表時：** 複製長榮設定，`ranking_validation` 填 `run2pix`；`bravelog_source_url` 保留 BraveLog 原始頁；`ranking_report_urls` 為每個賽別對應的未篩選報表 URL，`ranking_report_name` 複製報表頂端原始賽事名稱，`source_url` 指向主要報表。不能只按日期猜報表：同一天可能有多場賽事。程式逐頁核對報表身分、全部分頁、總筆數及背號唯一。

```powershell
# 新增或更新單場：匯入、查核、前端轉檔及查核文件一次完成
python audit_bravelog.py --event-id 2025_eva_air_marathon

# 全部 BraveLog 場次自動查核
python audit_bravelog.py --all
```

個人頁模式完整下載所選賽別全部分頁，對**所有原始列，包含列表無時間者**讀取實際公開個人成績頁，核對頁面身分、正總排名與有效大會時間。有時間但無總排名者排除；列表無時間但個人頁有正排名及有效大會時間者補回。時間與個人頁不一致時保留原始列表值，以個人頁大會時間為準。總排得獎者的分組排名0不影響資格。頁面可能只有名次或另列分母；分母不直接等同有效完賽人數。個人頁無排名或有效時間者仍保留本機，不進排名資料；未知排名格式、來源錯誤、遺失分頁或重複背號均停止，不憑速度推定資格。BraveLog 即時榜單不是主辦最終公告，設定說明明示正式公告優先。

Excel 的「完整成績」存本次查核列，「修正前原始資料」保留舊檔，「排名查核」存來源、方法、查核時間、筆數及內容指紋；每次替換前另備份整個舊 Excel 到 `excels/.source-cache/workbook-history/`，保留更早的原始工作表。全部查核通過才替換 Excel。`排名資格` 明確標記，正總排名存 `來源總排名`；舊 `總排名` 流水號不接受為證據。轉檔核對憑據、每個賽別、來源設定、有效時間及完整內容，改過 Excel、缺憑據或缺查核的資料一律拒絕。前端必須與清單內的最新公開查核紀錄一致，缺少查核或尚未同步的 BraveLog 檔案不參與比較。

公開的 `data/source-audit.json` 只保存來源、日期、筆數、來源前十筆及完整分組／時間指紋，不含姓名、背號或個人頁列表。網頁「查看成績來源」隨賽別使用正確報表／榜單。`data/source-audit-before.json` 是本批修正前的匿名摘要，不能拿它當已核實來源。

個人頁查核須記錄 `profile_count` 且與 `raw_count` 及 Excel 該賽別總列數一致；另列 `excluded_timed`（排除的列表計時）與 `restored_missing_clock`（補回的列表無時間紀錄）。只查有時間的列表列不算整場完成。列表非末頁須有完整20列，缺列或來源每頁格式改變時停止。

公開個人頁可能顯示正排名但大會時間為 `00:00:00`；這是無有效完賽時間，仍排除，不能單憑有名次保留。已核對的缺時間標記與格式錯誤分開：缺時間保留原始列但不納入排名；未知時間或排名格式停止該場。

PUMA／楓半馬實際公布的總排名0（含`0/人數`）視為未排名，仍排除；分組排名0與總排名0不同。缺大會時間者不作有效排名，來源殘留的名次及分母只留作原始紀錄。高雄富邦一筆正排名、有時間的原始列分組為空：轉存前保留`來源分組標籤`，統計與查核指紋共用「未提供分組」標籤，避免空字串轉成Excel空值後失配；不猜性別／年齡，也不因缺分組刪掉有效全體成績。

每完成一場，入口自動轉檔、更新清單，以及 README／DATA_SOURCES 的 `ranking-audit` 區塊；未完成場次明示待完成，不能把筆數填成已核實。一般功能或設定變動仍須人工同步相關說明。逐筆個人頁查核可能需數小時；連線錯誤只重試缺漏頁面，查核失敗保留原檔。

`--all` 全場完成後會自動執行全部前端資料／來源測試，需本機已安裝 Node.js；任何場次或完整資料驗證失敗，整批會以失敗狀態結束，不印完成訊息。來源格式無法辨識時即停止該場，並限制尚未完成的請求佇列，避免繼續大量下載錯誤頁面。

網頁的「暫停使用的賽事」列出未完成或載入失敗的場次；查核完成後重新整理。分享連結指定尚未可用的場次時，提示已改顯示其他場次，避免誤讀比較基準。

中斷時執行 `python audit_bravelog.py --all --resume`，僅接續本次未完成快取，24小時內已完成且憑據一致的場次可跳過。一般更新不帶 `--resume`；已完成的查核會啟動新批次、重讀來源。未完成快取超過24小時也重新讀取，避免用上次更新的資格判定。`--refresh` 強制忽略未完成快取；`--workers` 預設6，上限8，使用安全連線重用及gzip減少下載量。原始快取在 `excels/.source-cache/`，由 Git 排除，不公開。

`tests/source.test.js` 保留獨立核實的長榮三賽別最快時間／全馬前10筆。`tests/audit.test.js` 要求所有 BraveLog 場次均完成查核，核對全部賽別筆數、來源前十筆及所有分組時間指紋；不能依生成的前端 JS 自動改寫來源值。Python 測試涵蓋未排名計時、分組名次0、缺／錯憑據、內容變更、錯賽事、錯報表、未知排名格式、時間格式及失敗時原檔不變。內部統計測試不能取代來源查核。實際查核結果見 [DATA_SOURCES.md](DATA_SOURCES.md)。

`tests/loader.test.js` 驗證缺查核及版本未同步的資料均不載入。`.github/workflows/validate.yml` 在 push／PR 執行本機相同的離線資料與 Python 回歸檢查；未完成全場查核時來源測試應失敗。此流程是檢查，不代表已設定遠端分支保護或部署阻擋。

大量逐筆查核仍在執行時，可用 `node tests/audit.test.js --completed-only` 驗證已完成部分；輸出明示只是子集，不替代上述全場檢查，也不作遠端 CI 放行條件。

每次修改功能、資料、介面或維護流程，**同一次工作同步更新相關 `.md`**：README 功能／限制、本文件操作／來源／驗證及有變動的專案規範。永久規範見 `CLAUDE.md`。送交 review 前檢查 `git diff --check`，列出仍待核實的來源。

個人頁缺頁處理：僅在原始列表明確沒有時間（如 `--:--:--`、`00:00:00`），且其正確個人頁回傳 HTTP 404 時，記錄 `missing_no_clock_404`，不納入比較，也不推定為 DNF。公開查核 JSON 分開記錄已讀取個人頁數與此類缺頁數；報告列出缺頁限制。有時間的紀錄遇到 404、其他 HTTP 錯誤、網路中斷或未知格式，仍停止查核，保留原檔。查核狀態一併受原始資料指紋保護。

介面依目前賽別的查核紀錄，自動顯示未提供時間且來源個人頁缺失的筆數；新增賽事沿用同一流程，不需要額外寫賽事專用畫面。

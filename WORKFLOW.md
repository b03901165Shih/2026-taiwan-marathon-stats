# 專案架構與賽事資料更新流程

## 結論

這個網站的資料流程是先從賽事官方成績頁（目前為 BraveLog）抓下成績、存成 Excel，再將 Excel 預先處理成 JavaScript 資料檔，最後把該 JS 檔以 `<script>` 加入 `index.html`。瀏覽器只讀取靜態 JS，不會在使用者開啟頁面時重新爬蟲。

```text
BraveLog 成績頁
    ↓ Selenium
scrap_result.py
    ↓ .xlsx
excels/<賽事>_完整成績.xlsx
    ↓ pandas
extract_excel_result.py
    ↓ .js
<event_id>_data.js
    ↓ <script src="...">
index.html（Chart.js 圖表、排名與 PR 查詢）
```

## 檔案職責

| 檔案／資料夾 | 用途 |
| --- | --- |
| `scrap_result.py` | 以 Selenium 操作 BraveLog 的賽別、分組與分頁，擷取每位跑者的姓名、背號、賽別、分組及完賽時間，輸出完整成績 Excel。 |
| `excels/` | 部分賽事的完整成績 Excel；其他賽事 Excel 位於專案根目錄。 |
| `events_config.json` | 前處理階段的賽事清單：事件 ID、顯示名稱、日期、Excel 名稱、賽別、每個賽別的實際距離、成績來源 URL。 |
| `extract_excel_result.py` | 將 Excel 轉成網站可直接讀取的資料 JS；同時計算每組 5 分鐘分布與依秒數排序的成績陣列。 |
| `<event_id>_data.js` | 各賽事獨立的前端資料檔；都會把成績與賽別距離寫到全域 `window.marathonData[event_id]`。 |
| `index.html` | 純靜態前端。依已載入的 `window.marathonData` 動態建立賽事／賽別／分組選單，顯示圖表、時間查排名與 PR 反查。 |
| `marathon_bins_and_pr.js` | 舊版或整合用的大型資料檔；目前 `index.html` 沒有載入它，現行網站以各賽事獨立的 `*_data.js` 為準。 |

## 爬蟲輸出的 Excel 結構

`scrap_result.py` 最後輸出的主工作表是「完整成績」。主要欄位為：

- `姓名`、`背號`
- `賽別`：成績卡本身列出的距離／賽別，前處理程式用這個欄位分組。
- `賽事類型`：爬蟲目前選到的賽事類型名稱。
- `分組`、`來源分組標籤`
- `完賽時間`、`完賽時間_td`
- `總排名`

爬蟲會針對頁面動態找到的每個賽別，再逐一切換分組並翻完所有分頁；資料排序後也會額外寫出「分組統計」、「賽事類型統計」及「賽事類型_分組統計」工作表。

## 前端資料格式

每個 `*_data.js` 的核心形式如下：

```js
window.marathonData = window.marathonData || {};
window.marathonData['2026_freeway_tpe'] = {
  metadata: { event_id: '2026_freeway_tpe', /* ... */ },
  binsAndPr: {
    '2026_freeway_tpe__MA__ALL': {
      histogram_5min: [/* 每 5 分鐘的人數 */],
      sorted_seconds: [/* 由快到慢的完賽秒數 */]
    }
  }
};
```

同一筆成績會被放入兩種群組：`賽別__ALL`（該賽別全場）與 `賽別__原始分組`。`index.html` 使用 `histogram_5min` 畫圖；使用已排序的 `sorted_seconds` 以二分搜尋計算排名與 PR，或由 PR 回推目標時間。

## 新增或更新一場賽事的操作順序

### 1. 設定並執行爬蟲

修改 `scrap_result.py` 頂端的兩個值：

```python
BASE_URL = 'https://www.bravelog.tw/contest/rank/<賽事代碼>'
output_file = '2026_<賽事名稱>_完整成績.xlsx'
```

執行：

```powershell
python scrap_result.py
```

所需套件：`selenium`、`beautifulsoup4`、`pandas`、`openpyxl`，以及可由 Selenium 啟動的 Chrome／ChromeDriver。完成後，將產生的 Excel 放到 `excels/`。

### 2. 登記賽事設定

在 `events_config.json` 的 `events` 陣列新增一筆，至少填入：

```json
{
  "id": "2026_example",
  "name": "2026 範例馬拉松",
  "excel": "2026_範例馬拉松_完整成績.xlsx",
  "date": "2026-12-31",
  "race_types": ["MA", "HM"],
  "race_distances_km": {"MA": 42.195, "HM": 21.0975},
  "source_url": "https://www.bravelog.tw/contest/rank/..."
}
```

`id` 必須是唯一且穩定的英文／數字底線 ID；它同時決定輸出的檔案名 `2026_example_data.js` 和前端資料鍵值。
`race_distances_km` 必須涵蓋 `race_types` 的每一項，單位為公里。請查賽事實際路線距離，不要只看 BraveLog 的賽別代碼；例如 Panasonic 的 `10` 實際是 12.5K。半馬統一記為 `21.0975`、全馬為 `42.195`。第 4 區塊只比較距離數值相同的賽別；同賽事的兩個同距離賽別會分別列出。

### 3. Excel 轉成前端 JavaScript

`extract_excel_result.py` 會讀取 `past_events` 和 `events`，逐場產出 `<id>_data.js`，並將 `race_distances_km` 寫進每場資料的 metadata。只更新一場可執行 `python extract_excel_result.py --event-id 2026_example`。

`excel` 可以寫專案根目錄的檔名、`excels/檔名.xlsx`，或只寫檔名而將檔案放在 `excels/`。之後在專案根目錄執行：

```powershell
python extract_excel_result.py
```

它會檢查必要欄位、賽別距離對照、排除無效時間，把時間轉成秒數，建立每 5 分鐘直方圖與排序陣列，再輸出 `<id>_data.js` 到專案根目錄。缺少距離設定或 Excel 出現未登記賽別時會報錯。

### 4. 讓 `index.html` 載入新資料檔

在 `index.html` 的既有資料載入區加入一行：

```html
<script src="2026_example_data.js"></script>
```

必須放在頁面主程式 `<script>` 之前。前端初始化會自動偵測 `window.marathonData` 的所有賽事，所以不需要另外改選單、圖表或 PR 查詢邏輯。

### 5. 驗證

以本機伺服器或部署後頁面開啟 `index.html`，確認：

1. 新賽事出現在各個賽事選單中。
2. 每個賽別與分組都能繪製圖表。
3. 輸入一個 Excel 已知成績時，總場及分組排名合理。
4. PR 反查的時間存在於該分組的成績範圍內。
5. 第 4 區塊只出現與參考賽別同距離的賽別；例如 12.5K 不會配到 10K 或半馬。

## 現行資料與載入關係

`index.html` 以各場 `<event_id>_data.js` 載入資料。`events_config.json` 中已設定但尚未產生 JS 的賽事，不會出現在前端選單；可用 `python extract_excel_result.py --event-id <event_id>` 產生指定資料檔。

## 維護提醒

- `scrap_result.py` 的 URL 與輸出檔名目前是手動寫死的；每換一場比賽都要改，且要確認 BraveLog 畫面結構、賽別／分組選單與分頁 selector 仍相容。
- 前處理程式認定 Excel 必備欄位為 `姓名`、`背號`、`賽別`、`賽事類型`、`分組`、`完賽時間`；爬蟲或人工整理時不可任意更名。
- `race_types` 主要是 metadata，前端實際可選賽別由輸出的 `binsAndPr` keys 自動推導。
- 網站使用大會時間（Official Time），與選手個人淨時間或官方個人名次可能有差異。

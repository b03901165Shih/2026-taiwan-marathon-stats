import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

# --------------------------------------------------
# Selenium / 瀏覽器設定
# --------------------------------------------------

BASE_URL = "https://www.bravelog.tw/contest/rank/2026011101"

chrome_options = Options()
chrome_options.add_argument("--headless=new")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.add_argument(
    "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
)


#現在會這樣，有很多地方寫太死，原本是MA/HA，現在是半程馬拉松(21.0975km)/ 全程馬拉松(42.095KM)/ 11KM these 3
#please make it more general
def setup_driver() -> webdriver.Chrome:
    """建立並回傳一個已設定好的 Chrome WebDriver。"""
    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(5)
    return driver


# --------------------------------------------------
# 賽事類型與分組處理
# --------------------------------------------------

# 預設分組列表（如果無法動態獲取時使用）
DEFAULT_GROUP_NAMES = [
    "男國際選手",
    "女國際選手",
    "女50-59歲",
    "女30-39歲",
    "女40-49歲",
    "女20-29歲",
    "女60歲+",
    "男40-49歲",
    "男30-39歲",
    "男20-29歲",
    "男50-59歲",
    "男60歲+",
    "女19歲-",
    "女視障選手",
    "男19歲-",
    "男視障選手",
]


def get_available_race_types(driver: webdriver.Chrome) -> list:
    """
    從當前頁面上動態獲取所有可用的賽事類型選項。
    回傳賽事類型列表，每個元素為 (顯示名稱, 選項文字, data_value) 的元組。
    """
    try:
        wait = WebDriverWait(driver, 10)
        
        # 先等所有 nice-select 都出現
        selects = wait.until(
            EC.presence_of_all_elements_located(
                (By.CSS_SELECTOR, "div.nice-select.chosen-select")
            )
        )
        
        race_types = []
        
        # 掃描所有下拉選單，找到賽事類型選單
        for select_root in selects:
            try:
                # 確保打開選單
                cls = select_root.get_attribute("class") or ""
                if "open" not in cls:
                    driver.execute_script("arguments[0].click();", select_root)
                    time.sleep(0.5)
                
                # 獲取這個選單中的所有選項
                options = select_root.find_elements(By.CSS_SELECTOR, "li.option")
                
                if not options:
                    if "open" in (select_root.get_attribute("class") or ""):
                        driver.execute_script("arguments[0].click();", select_root)
                    continue
                
                # 檢查這個選單是否為賽事類型選單
                # 賽事類型選單的特徵：選項的 data-value 是 4 位數字，且選項數量通常較少（2-5 個）
                option_data = []
                is_race_type_menu = False
                
                for opt in options:
                    text = opt.text.strip()
                    data_value = opt.get_attribute("data-value") or ""
                    
                    # 如果 data-value 是 4 位數字，這是賽事類型選單的特徵
                    if data_value.isdigit() and len(data_value) == 4:
                        is_race_type_menu = True
                        if text and text not in ("項目", "年齡分組"):
                            option_data.append((text, text, data_value))  # (顯示名稱, 選項文字, data_value)
                
                # 如果選項數量較少（2-5 個）且所有 data-value 都是 4 位數字，也可能是賽事類型選單
                if not is_race_type_menu and 2 <= len(options) <= 5:
                    all_4_digit = True
                    for opt in options:
                        data_value = opt.get_attribute("data-value") or ""
                        if data_value and (not data_value.isdigit() or len(data_value) != 4):
                            all_4_digit = False
                            break
                    if all_4_digit:
                        is_race_type_menu = True
                        for opt in options:
                            text = opt.text.strip()
                            data_value = opt.get_attribute("data-value") or ""
                            if text and text not in ("項目", "年齡分組"):
                                option_data.append((text, text, data_value))  # (顯示名稱, 選項文字, data_value)
                
                if is_race_type_menu and option_data:
                    race_types = option_data
                    # 關閉選單
                    if "open" in (select_root.get_attribute("class") or ""):
                        driver.execute_script("arguments[0].click();", select_root)
                    break
                
                # 關閉選單
                if "open" in (select_root.get_attribute("class") or ""):
                    driver.execute_script("arguments[0].click();", select_root)
                    
            except Exception:
                continue
        
        if race_types:
            print(f"✅ 動態獲取到 {len(race_types)} 個賽事類型：{[rt[0] for rt in race_types]}")
            return race_types
        else:
            print("⚠️ 無法動態獲取賽事類型，使用預設列表")
            # 如果無法動態獲取，返回常見的賽事類型作為備用（格式：name, value, data_value）
            # 注意：備用列表沒有 data_value，所以設為 None
            return [
                ("半馬", "半程馬拉松(21.0975km)", None),
                ("全馬", "全程馬拉松(42.195KM)", None),
                ("11KM", "11KM", None),
            ]
            
    except Exception as e:
        print(f"⚠️ 獲取賽事類型時發生錯誤: {e}，使用預設列表")
        return [
            ("半馬", "半程馬拉松(21.0975km)", None),
            ("全馬", "全程馬拉松(42.195KM)", None),
            ("11KM", "11KM", None),
        ]


def get_available_groups(driver: webdriver.Chrome) -> list:
    """
    從當前頁面上動態獲取所有可用的分組選項。
    回傳分組列表，每個元素為 (分組名稱, data_value) 的元組，如果沒有 data_value 則為 (分組名稱, None)。
    """
    try:
        wait = WebDriverWait(driver, 10)
        
        # 先等所有 nice-select 都出現
        try:
            selects = wait.until(
                EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, "div.nice-select")
                )
            )
        except Exception as e:
            print(f"⚠️ 找不到任何 nice-select 元素: {e}")
            print("   嘗試查找其他可能的選單元素...")
            # 嘗試其他可能的選擇器
            try:
                selects = driver.find_elements(By.CSS_SELECTOR, "select")
                if selects:
                    print(f"   找到 {len(selects)} 個 select 元素，但這不是預期的結構")
            except:
                pass
            return [(name, None) for name in DEFAULT_GROUP_NAMES]
        
        # 根據對應的 select 元素的 name 屬性來區分賽事類型選單和分組選單
        # 賽事類型選單：select[name="raceId"]，data-placeholder="項目"
        # 分組選單：select[name="group"]，data-placeholder="年齡分組"
        filtered_selects = []
        for sel in selects:
            # 嘗試找到對應的 select 元素
            try:
                # 查找父元素中的 select（nice-select 通常是 select 的下一個兄弟元素）
                # 或者查找同一個父元素中的 select
                parent = sel.find_element(By.XPATH, "./..")
                select_elem = parent.find_element(By.CSS_SELECTOR, "select")
                select_name = select_elem.get_attribute("name") or ""
                placeholder = select_elem.get_attribute("data-placeholder") or ""
                
                # 如果是 group 選單（分組選單），保留
                if select_name == "group" or placeholder == "年齡分組":
                    filtered_selects.append(sel)
                    continue
                
                # 如果是 raceId 選單（賽事類型選單），跳過
                if select_name == "raceId" or placeholder == "項目":
                    continue
            except:
                # 如果找不到對應的 select，嘗試打開選單檢查選項特徵
                pass
            
            # 如果無法通過 select 元素判斷，打開選單檢查選項特徵
            cls = sel.get_attribute("class") or ""
            was_open = "open" in cls
            
            if not was_open:
                try:
                    driver.execute_script("arguments[0].click();", sel)
                    time.sleep(0.3)
                except:
                    continue
            
            # 檢查選項的 data-value 格式
            try:
                options = sel.find_elements(By.CSS_SELECTOR, "li.option")
                if options:
                    # 檢查前幾個選項的 data-value
                    is_race_type_menu = False
                    for opt in options[:3]:  # 只檢查前3個選項
                        data_value = opt.get_attribute("data-value") or ""
                        # 如果 data-value 是 4 位數字，這是賽事類型選單
                        if data_value.isdigit() and len(data_value) == 4:
                            is_race_type_menu = True
                            break
                    
                    if not is_race_type_menu:
                        # 不是賽事類型選單，可能是分組選單
                        filtered_selects.append(sel)
            except:
                pass
            finally:
                # 如果我們打開了選單，關閉它
                if not was_open:
                    try:
                        if "open" in (sel.get_attribute("class") or ""):
                            driver.execute_script("arguments[0].click();", sel)
                    except:
                        pass
        
        selects = filtered_selects
        
        print(f"🔍 找到 {len(selects)} 個分組選單，開始掃描...")
        
        groups = []
        all_candidates = []  # 用於調試：記錄所有候選選單
        
        # 掃描所有下拉選單，找到分組選單
        for idx, select_root in enumerate(selects):
            try:
                # 確保打開選單（使用 JavaScript 點擊避免元素攔截）
                cls = select_root.get_attribute("class") or ""
                if "open" not in cls:
                    driver.execute_script("arguments[0].click();", select_root)
                    time.sleep(0.5)  # 簡單等待選單展開
                
                # 獲取這個選單中的所有選項
                options = select_root.find_elements(By.CSS_SELECTOR, "li.option")
                
                # 如果沒有選項，跳過這個選單
                if not options:
                    if "open" in (select_root.get_attribute("class") or ""):
                        driver.execute_script("arguments[0].click();", select_root)
                    continue
                
                # 檢查這個選單是否看起來像分組選單（排除賽事類型選單）
                option_data = []
                is_race_type_menu = False
                all_texts = []
                
                for opt in options:
                    text = opt.text.strip()
                    data_value = opt.get_attribute("data-value") or ""
                    all_texts.append(text)
                    
                    # 如果 data-value 是 4 位數字，這是賽事類型選單的特徵
                    if data_value.isdigit() and len(data_value) == 4:
                        is_race_type_menu = True
                        break
                    
                    # 如果文字是「項目」，這是賽事類型選單的標題
                    if text == "項目":
                        is_race_type_menu = True
                        break
                    
                    # 跳過空選項和「年齡分組」標題（但保留其他分組）
                    if not text or text == "年齡分組":
                        continue
                    
                    # 保存 (文字, data_value)
                    option_data.append((text, data_value if data_value else None))
                
                # 如果是賽事類型選單，跳過
                if is_race_type_menu:
                    if "open" in (select_root.get_attribute("class") or ""):
                        driver.execute_script("arguments[0].click();", select_root)
                    continue
                
                # 記錄候選選單（用於調試）
                if option_data:
                    all_candidates.append({
                        "index": idx,
                        "count": len(option_data),
                        "options": [opt[0] for opt in option_data[:10]]  # 只記錄前10個
                    })
                
                # 如果找到多個分組選項（通常分組選單會有 3+ 個選項），就使用這個
                # 降低門檻從 5 到 3，因為有些賽事可能分組較少
                if len(option_data) >= 3:
                    groups = option_data
                    print(f"✅ 在選單 #{idx} 找到 {len(option_data)} 個分組選項")
                    # 關閉選單
                    if "open" in (select_root.get_attribute("class") or ""):
                        driver.execute_script("arguments[0].click();", select_root)
                    break
                
                # 關閉選單
                if "open" in (select_root.get_attribute("class") or ""):
                    driver.execute_script("arguments[0].click();", select_root)
                    
            except Exception as e:
                print(f"   選單 #{idx} 處理時發生錯誤: {e}")
                # 確保關閉選單
                try:
                    if "open" in (select_root.get_attribute("class") or ""):
                        driver.execute_script("arguments[0].click();", select_root)
                except:
                    pass
                continue
        
        if groups:
            group_names = [g[0] for g in groups]
            print(f"✅ 動態獲取到 {len(groups)} 個分組：{group_names[:5]}..." if len(groups) > 5 else f"✅ 動態獲取到 {len(groups)} 個分組：{group_names}")
            return groups
        else:
            print("⚠️ 無法動態獲取分組")
            if all_candidates:
                print("   找到的候選選單：")
                for cand in all_candidates:
                    print(f"     選單 #{cand['index']}: {cand['count']} 個選項 - {cand['options']}")
            print("   使用預設分組列表")
            # 預設分組列表轉換為 (名稱, None) 格式
            return [(name, None) for name in DEFAULT_GROUP_NAMES]
            
    except Exception as e:
        print(f"⚠️ 獲取分組時發生錯誤: {e}，使用預設分組列表")
        import traceback
        traceback.print_exc()
        return [(name, None) for name in DEFAULT_GROUP_NAMES]


def switch_race_type(driver: webdriver.Chrome, race_type_value: str, data_value: str = None) -> bool:
    """
    切換賽事類型。
    race_type_value: 賽事類型的顯示文字（例如："半程馬拉松(21.0975km)"、"全程馬拉松(42.195KM)"、"11KM"）
    data_value: 選項的 data-value 屬性（如果提供，優先使用此值進行匹配）
    回傳是否成功切換。
    """
    try:
        wait = WebDriverWait(driver, 10)

        # 只鎖定賽事項目的 nice-select.chosen-select
        selects = wait.until(
            EC.presence_of_all_elements_located(
                (By.CSS_SELECTOR, "div.nice-select.chosen-select")
            )
        )

        for select_root in selects:
            try:
                driver.execute_script(
                    "arguments[0].scrollIntoView({block: 'center'});", select_root
                )

                # 確保打開選單（使用 JavaScript 點擊避免元素攔截）
                cls = select_root.get_attribute("class") or ""
                if "open" not in cls:
                    # 使用 JavaScript 直接點擊，繞過元素攔截問題
                    driver.execute_script("arguments[0].click();", select_root)
                    time.sleep(0.3)  # 增加等待時間確保選單完全打開

                # 檢查這個選單是否為賽事類型選單
                # 賽事類型選單的特徵：選項的 data-value 是 4 位數字，且選項數量通常較少（2-5 個）
                all_options = select_root.find_elements(By.CSS_SELECTOR, "li.option")
                is_race_type_menu = False
                
                if 2 <= len(all_options) <= 5:
                    # 檢查是否所有選項的 data-value 都是 4 位數字
                    all_4_digit = True
                    for opt in all_options:
                        data_value = opt.get_attribute("data-value") or ""
                        if data_value and (not data_value.isdigit() or len(data_value) != 4):
                            all_4_digit = False
                            break
                    if all_4_digit:
                        is_race_type_menu = True
                
                # 如果不是賽事類型選單，跳過
                if not is_race_type_menu:
                    if "open" in (select_root.get_attribute("class") or ""):
                        # 使用 JavaScript 點擊關閉選單
                        driver.execute_script("arguments[0].click();", select_root)
                    continue

                # 在這個 select 範圍內找對應的 option
                # 優先使用 data-value 匹配，如果沒有則使用文字匹配
                options = []
                
                if data_value:
                    # 使用 data-value 匹配（更可靠）
                    options = select_root.find_elements(
                        By.XPATH,
                        f".//li[@class='option' and @data-value='{data_value}']",
                    )
                
                # 如果 data-value 匹配失敗，嘗試文字匹配（精確匹配）
                if not options:
                    options = select_root.find_elements(
                        By.XPATH,
                        f".//li[@class='option' and normalize-space(text())='{race_type_value}']",
                    )
                
                # 如果精確匹配失敗，嘗試包含匹配（更寬鬆）
                if not options:
                    for opt in all_options:
                        opt_text = opt.text.strip()
                        if race_type_value in opt_text or opt_text in race_type_value:
                            options = [opt]
                            break
                
                # 如果還是找不到，列出所有可用選項用於調試
                if not options:
                    available_texts = [opt.text.strip() for opt in all_options if opt.text.strip() and opt.text.strip() not in ("項目", "年齡分組")]
                    print(f"   可用選項：{available_texts}")
                    print(f"   尋找選項：{race_type_value}")
                    # 關掉選單換下一個 select
                    if "open" in (select_root.get_attribute("class") or ""):
                        # 使用 JavaScript 點擊關閉選單
                        driver.execute_script("arguments[0].click();", select_root)
                    continue

                option = options[0]
                driver.execute_script(
                    "arguments[0].scrollIntoView({block: 'center'});", option
                )
                # 使用 JavaScript 直接點擊，繞過元素攔截問題
                driver.execute_script("arguments[0].click();", option)

                # 等待頁面載入和 AJAX 請求完成
                time.sleep(3)
                
                # 驗證切換是否成功：檢查當前選中的選項文字
                try:
                    # 重新獲取選單以檢查當前選項
                    current_span = select_root.find_element(By.CSS_SELECTOR, "span.current")
                    current_text = current_span.text.strip()
                    
                    # 檢查是否匹配（允許部分匹配，因為可能有格式差異）
                    if race_type_value in current_text or current_text in race_type_value:
                        print(f"   ✅ 已切換到：{current_text}")
                        # 額外等待分組選單更新（因為分組選單是動態載入的）
                        time.sleep(2)
                        return True
                    else:
                        print(f"   ⚠️ 切換後當前選項是「{current_text}」，預期是「{race_type_value}」")
                        # 即使文字不完全匹配，也繼續（可能是格式問題）
                        time.sleep(2)
                        return True
                except Exception as e:
                    print(f"   ⚠️ 無法驗證切換結果: {e}，但假設切換成功")
                    time.sleep(2)
                    return True
            except Exception as e:
                # 這個 select 失敗就試下一個
                continue

        print(f"⚠️ 找不到賽事類型「{race_type_value}」的選項")
        return False
    except Exception as e:
        print(f"⚠️ 切換賽事類型「{race_type_value}」時發生錯誤: {e}")
        return False


def click_category_tab(driver: webdriver.Chrome, category_name: str, category_data_value: str = None) -> bool:
    """
    在頁面上的 nice-select 下拉選單中選取指定分組。
    category_name: 分組名稱（文字）
    category_data_value: 分組的 data-value 屬性（如果提供，優先使用）
    回傳是否成功點擊。
    """
    try:
        wait = WebDriverWait(driver, 10)

        # 先等所有 nice-select 都出現，再一個一個掃描
        selects = wait.until(
            EC.presence_of_all_elements_located(
                (By.CSS_SELECTOR, "div.nice-select")
            )
        )

        for select_root in selects:
            try:
                driver.execute_script(
                    "arguments[0].scrollIntoView({block: 'center'});", select_root
                )

                # 確保打開選單（使用 JavaScript 點擊避免元素攔截）
                cls = select_root.get_attribute("class") or ""
                if "open" not in cls:
                    driver.execute_script("arguments[0].click();", select_root)
                    time.sleep(0.3)

                # 獲取所有選項
                all_options = select_root.find_elements(By.CSS_SELECTOR, "li.option")
                options = []
                
                # 優先使用 data-value 匹配
                if category_data_value:
                    options = [opt for opt in all_options if opt.get_attribute("data-value") == category_data_value]
                
                # 如果 data-value 匹配失敗，使用文字匹配（精確匹配）
                if not options:
                    options = [
                        opt for opt in all_options 
                        if opt.text.strip() == category_name
                    ]
                
                # 如果精確匹配失敗，嘗試包含匹配（更寬鬆）
                if not options:
                    for opt in all_options:
                        opt_text = opt.text.strip()
                        if category_name in opt_text or opt_text in category_name:
                            options = [opt]
                            break
                
                if not options:
                    # 沒有這個分組，關掉選單換下一個 select
                    if "open" in (select_root.get_attribute("class") or ""):
                        driver.execute_script("arguments[0].click();", select_root)
                    continue

                option = options[0]
                driver.execute_script(
                    "arguments[0].scrollIntoView({block: 'center'});", option
                )
                # 使用 JavaScript 直接點擊，繞過元素攔截問題
                driver.execute_script("arguments[0].click();", option)

                # 簡單等待頁面載入
                time.sleep(2)
                return True
            except Exception as e:
                # 這個 select 失敗就試下一個
                continue

        # 如果還是找不到，列出所有可用選項用於調試
        print(f"⚠️ 頁面上的所有下拉選單都找不到分組「{category_name}」")
        # 嘗試列出所有可用分組
        try:
            selects = driver.find_elements(By.CSS_SELECTOR, "div.nice-select")
            for select_root in selects:
                try:
                    cls = select_root.get_attribute("class") or ""
                    if "open" not in cls:
                        driver.execute_script("arguments[0].click();", select_root)
                        time.sleep(0.3)
                    all_options = select_root.find_elements(By.CSS_SELECTOR, "li.option")
                    available_texts = [opt.text.strip() for opt in all_options if opt.text.strip() and opt.text.strip() not in ("項目", "年齡分組")]
                    if available_texts and len(available_texts) >= 5:
                        print(f"   可用分組選項：{available_texts[:10]}..." if len(available_texts) > 10 else f"   可用分組選項：{available_texts}")
                        if "open" in (select_root.get_attribute("class") or ""):
                            driver.execute_script("arguments[0].click();", select_root)
                        break
                    if "open" in (select_root.get_attribute("class") or ""):
                        driver.execute_script("arguments[0].click();", select_root)
                except Exception:
                    continue
        except Exception:
            pass
        
        return False
    except Exception as e:
        print(f"⚠️ 找不到或無法點擊分組「{category_name}」: {e}")
        return False


# --------------------------------------------------
# 成績表解析
# --------------------------------------------------

def parse_time_to_timedelta(time_str: str):
    """將 hh:mm:ss 或 mm:ss 轉成 pandas Timedelta，錯誤則回傳 NaT。"""
    if not time_str or time_str in ("N/A", "-", "--"):
        return pd.NaT
    t = time_str.strip()
    try:
        parts = t.split(":")
        if len(parts) == 2:
            # mm:ss -> 0:mm:ss
            parts = ["0"] + parts
        if len(parts) != 3:
            return pd.NaT
        h, m, s = map(int, parts)
        return pd.to_timedelta(f"{h:02d}:{m:02d}:{s:02d}")
    except Exception:
        return pd.NaT


def scrape_current_table(driver: webdriver.Chrome, category_name: str, race_type_name: str = ""):
    """
    在當前已顯示該分組的頁面上，解析成績卡片列表。
    依照你提供的 HTML 結構，成績每一筆大致為：
    <div class="fl-wrap list-single-main-item_content">
        <div class="list-item">
            <div class="list-user-info">
                <div class="name">姓名</div>
                <div class="detail-info">
                    <span>背號</span>
                    <span>MA/HM 等賽別</span>
                    <span>分組名稱</span>
                </div>
            </div>
            <div class="time"><span>完賽時間</span></div>
        </div>
    race_type_name: 賽事類型名稱（例如："全馬"、"半馬"、"11KM"），用於標記資料來源
    """
    wait = WebDriverWait(driver, 10)

    # 等待至少一個成績卡片出現
    try:
        wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "div.fl-wrap.list-single-main-item_content")
            )
        )
    except Exception:
        print(f"⚠️ 分組「{category_name}」找不到成績區塊")
        return []

    soup = BeautifulSoup(driver.page_source, "html.parser")
    cards = soup.select("div.fl-wrap.list-single-main-item_content")

    results = []
    for card in cards:
        # 姓名
        name_el = card.select_one(".list-user-info .name")
        name = name_el.get_text(strip=True) if name_el else ""

        # 背號、賽別、分組
        spans = card.select(".list-user-info .detail-info span")
        bib = spans[0].get_text(strip=True) if len(spans) >= 1 else ""
        race_type = spans[1].get_text(strip=True) if len(spans) >= 2 else ""  # 賽事類型（如：半程馬拉松(21.0975km)）
        group_text = spans[2].get_text(strip=True) if len(spans) >= 3 else category_name

        # 完賽時間
        time_el = card.select_one(".time span")
        finish_time = time_el.get_text(strip=True) if time_el else ""

        # 沒有名字或背號就略過（通常是異常卡片）
        if not name and not bib:
            continue

        results.append(
            {
                "姓名": name,
                "背號": bib,
                "賽別": race_type,
                "賽事類型": race_type_name,  # 賽事類型名稱
                "分組": group_text,
                "完賽時間": finish_time,
                "來源分組標籤": category_name,
            }
        )

    print(f"「{category_name}」解析到 {len(results)} 筆")
    return results


def scrape_category(driver: webdriver.Chrome, category_info, race_type_name: str = ""):
    """
    切換到指定分組並抓取該分組「所有頁數」的成績。
    category_info: 分組資訊，可以是字串（分組名稱）或元組 (分組名稱, data_value)
    """
    # 處理分組資訊格式
    if isinstance(category_info, tuple):
        category_name, category_data_value = category_info
    else:
        category_name = category_info
        category_data_value = None
    
    print(f"=== 處理分組：{category_name} ===")
    ok = click_category_tab(driver, category_name, category_data_value)
    if not ok:
        return []

    all_results = []

    page_count = 0
    max_pages = 10000  # 安全上限，避免無限循環
    
    while page_count < max_pages:
        page_count += 1
        
        # 先抓目前頁面的所有卡片
        page_results = scrape_current_table(driver, category_name, race_type_name)
        all_results.extend(page_results)

        # 嘗試找到分頁區塊（每次都重新獲取，因為頁面更新後元素可能失效）
        try:
            pagination = driver.find_element(By.ID, "pagination")
        except Exception:
            # 沒有分頁區塊，表示只有一頁
            print(f"分組「{category_name}」沒有分頁區塊，結束")
            break

        try:
            current_page = int(pagination.get_attribute("data-page") or "1")
            total_pages = int(pagination.get_attribute("data-total") or "1")
        except Exception as e:
            # 取不到 page / total 就不要勉強翻頁
            print(f"⚠️ 分組「{category_name}」無法讀取頁數資訊: {e}")
            break

        # 顯示目前頁數資訊
        print(f"分組「{category_name}」目前在第 {current_page} / {total_pages} 頁（本頁爬取 {len(page_results)} 筆）")

        # 已經是最後一頁了，就結束這個分組
        if current_page >= total_pages:
            print(f"✅ 分組「{category_name}」已到最後一頁")
            break

        # 找「下一頁」按鈕（右箭頭），且不能是 disabled
        try:
            # 重新獲取 pagination 元素（頁面可能已更新）
            pagination = driver.find_element(By.ID, "pagination")
            next_btn = pagination.find_element(
                By.CSS_SELECTOR, "li.nextposts-link:not(.disabled) a.page-link"
            )
        except Exception as e:
            # 找不到可用的下一頁按鈕，就停在這一頁
            print(f"⚠️ 分組「{category_name}」找不到可用的下一頁按鈕: {e}")
            break

        # 滾動並點擊下一頁
        try:
            driver.execute_script(
                "arguments[0].scrollIntoView({block: 'center'});", next_btn
            )
            next_btn.click()
            
            # 簡單等待頁面載入
            time.sleep(2)
        except Exception as e:
            print(f"⚠️ 分組「{category_name}」翻頁時發生錯誤: {e}")
            break

    print(f"=== 分組「{category_name}」累計 {len(all_results)} 筆 ===")
    return all_results


# --------------------------------------------------
# 主流程
# --------------------------------------------------

def main():
    driver = setup_driver()

    try:
        print("開啟成績頁面…")
        driver.get(BASE_URL)
        time.sleep(3)

        all_results = []

        # 動態獲取所有可用的賽事類型
        race_types = get_available_race_types(driver)
        
        if not race_types:
            print("⚠️ 無法獲取任何賽事類型，結束程式")
            return

        # 循環處理每種賽事類型
        for race_type_info in race_types:
            # race_type_info 可能是 (name, value) 或 (name, value, data_value)
            if len(race_type_info) == 3:
                race_type_name, race_type_value, data_value = race_type_info
            else:
                race_type_name, race_type_value = race_type_info
                data_value = None
            
            print(f"\n{'='*50}")
            print(f"開始處理賽事類型：{race_type_name} ({race_type_value})")
            print(f"{'='*50}\n")
            
            # 切換到對應的賽事類型（最多重試 3 次）
            max_switch_retries = 3
            switch_success = False
            for switch_retry in range(max_switch_retries):
                if switch_race_type(driver, race_type_value, data_value):
                    # 額外等待頁面完全載入（包括分組選單的 AJAX 更新）
                    print("   等待分組選單更新...")
                    time.sleep(3)
                    
                    # 驗證當前賽事類型是否正確
                    try:
                        # 查找賽事類型選單的當前選項
                        race_selects = driver.find_elements(By.CSS_SELECTOR, "div.nice-select.chosen-select")
                        for rs in race_selects:
                            try:
                                parent = rs.find_element(By.XPATH, "./..")
                                select_elem = parent.find_element(By.CSS_SELECTOR, "select[name='raceId']")
                                current_span = rs.find_element(By.CSS_SELECTOR, "span.current")
                                current_text = current_span.text.strip()
                                print(f"   當前選中的賽事類型：{current_text}")
                                
                                # 驗證是否真的切換成功
                                if (race_type_value in current_text or 
                                    current_text in race_type_value or
                                    race_type_name in current_text):
                                    print(f"   ✅ 確認已切換到「{current_text}」")
                                    switch_success = True
                                    break
                                else:
                                    print(f"   ⚠️ 切換後仍然是「{current_text}」，預期是「{race_type_value}」")
                                    if switch_retry < max_switch_retries - 1:
                                        print(f"   重試切換... ({switch_retry + 1}/{max_switch_retries})")
                                        time.sleep(2)
                                        break
                            except:
                                continue
                        
                        if switch_success:
                            break
                    except Exception as e:
                        print(f"   ⚠️ 驗證時發生錯誤: {e}")
                        if switch_retry < max_switch_retries - 1:
                            print(f"   重試切換... ({switch_retry + 1}/{max_switch_retries})")
                            time.sleep(2)
                            continue
                        else:
                            print(f"   ⚠️ 無法驗證，但假設切換成功")
                            switch_success = True
                            break
                else:
                    if switch_retry < max_switch_retries - 1:
                        print(f"   ⚠️ 切換失敗，重試中... ({switch_retry + 1}/{max_switch_retries})")
                        time.sleep(2)
                        continue
                    else:
                        print(f"   ⚠️ 無法切換到「{race_type_name}」，跳過此賽事類型")
                        break
            
            if not switch_success:
                print(f"⚠️ 無法切換到「{race_type_name}」，跳過此賽事類型")
                continue
            
            # 動態獲取當前賽事類型下可用的分組列表
            available_groups = get_available_groups(driver)
            
            if not available_groups:
                print(f"⚠️ 「{race_type_name}」沒有可用分組，跳過")
                continue
            
            # 爬取這個賽事類型下的所有分組
            for cat_info in available_groups:
                data = scrape_category(driver, cat_info, race_type_name)
                all_results.extend(data)
                # 避免太頻繁操作
                time.sleep(1)

        df = pd.DataFrame(all_results)
        if df.empty:
            print("⚠️ 最後沒有抓到任何成績資料，請檢查 selector 或頁面結構。")
            return

        # 轉換完賽時間為 Timedelta 並排序
        df["完賽時間_td"] = df["完賽時間"].apply(parse_time_to_timedelta)
        df = df.sort_values(["完賽時間_td", "分組", "姓名"], na_position="last")

        # 加一個整體排名欄位
        df["總排名"] = range(1, len(df) + 1)

        # 儲存到 Excel
        output_file = "2026_渣打台北馬拉松_完整成績.xlsx"
        with pd.ExcelWriter(output_file, engine="openpyxl") as writer:
            df.to_excel(writer, sheet_name="完整成績", index=False)

            # 分組統計（只在確定欄位存在時進行）
            if "分組" in df.columns:
                group_stats = (
                    df.groupby("分組")
                    .agg(
                        完賽人數=("姓名", "count"),
                        最快時間=("完賽時間_td", "min"),
                        最慢時間=("完賽時間_td", "max"),
                    )
                )
                group_stats.to_excel(writer, sheet_name="分組統計")
            
            # 按賽事類型統計
            if "賽事類型" in df.columns:
                race_type_stats = (
                    df.groupby("賽事類型")
                    .agg(
                        完賽人數=("姓名", "count"),
                        最快時間=("完賽時間_td", "min"),
                        最慢時間=("完賽時間_td", "max"),
                    )
                )
                race_type_stats.to_excel(writer, sheet_name="賽事類型統計")
                
                # 按賽事類型+分組統計
                race_group_stats = (
                    df.groupby(["賽事類型", "分組"])
                    .agg(
                        完賽人數=("姓名", "count"),
                        最快時間=("完賽時間_td", "min"),
                        最慢時間=("完賽時間_td", "max"),
                    )
                )
                race_group_stats.to_excel(writer, sheet_name="賽事類型_分組統計")

        print(f"✅ 完成！共爬取 {len(df)} 筆成績，已儲存至 {output_file}")
        if "分組" in df.columns:
            print("\n各分組筆數：")
            print(df["分組"].value_counts())
        if "賽事類型" in df.columns:
            print("\n各賽事類型筆數：")
            print(df["賽事類型"].value_counts())

    except Exception as e:
        print(f"❌ 執行過程發生錯誤: {e}")

    finally:
        driver.quit()


if __name__ == "__main__":
    # 需要套件：pip install selenium beautifulsoup4 pandas openpyxl
    main()

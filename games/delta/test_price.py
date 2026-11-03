
import requests
from bs4 import BeautifulSoup

url = "https://orzice.com/v/info/949"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers, timeout=20)
response.raise_for_status()
response.encoding = response.apparent_encoding

soup = BeautifulSoup(response.text, "html.parser")
text = soup.get_text(" ", strip=True)

# 输出价格区域的 HTML 结构
for keyword in ["当前价格", "今日最高价", "今日最低价"]:
    element = soup.find(string=lambda s: s and keyword in s)

    if element:
        print(f"\n【{keyword}】")
        print(element.parent.parent.prettify()[:2000])

# 查找价格字段及其附近的文本
keywords = [
    "当前价格",
    "今日最高价",
    "今日最低价",
    "三日涨幅",
    "七日涨幅",
    "三十日涨幅",
]

for keyword in keywords:
    index = text.find(keyword)

    if index != -1:
        print(f"\n【{keyword}】")
        print(text[index:index + 100])

# 提取今日最高价
today_high_price = None

for stat in soup.select(".ii-stat"):
    title_element = stat.select_one(".ii-stat-title")
    value_element = stat.select_one(".ii-stat-val")

    if title_element and value_element:
        if title_element.get_text(strip=True) == "今日最高价":
            today_high_price = value_element.get_text(strip=True)
            break

print("今日最高价：", today_high_price)

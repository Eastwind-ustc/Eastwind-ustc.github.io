import requests
from bs4 import BeautifulSoup
import time
from openpyxl import Workbook
from pathlib import Path
import re
from urllib.parse import urlparse

url = "https://orzice.com/v/info/958"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers, timeout=20)
response.raise_for_status()
response.encoding = response.apparent_encoding

soup = BeautifulSoup(response.text, "html.parser")

# 物品名称
title = soup.select_one(".orz-item-title")
name = title.get_text(strip=True) if title else None

# 品质等级
icon = title.select_one("use") if title else None
quality_level = None

if icon:
    icon_href = icon.get("xlink:href") or icon.get("href")
    if icon_href and "icon-orz-level-" in icon_href:
        quality_level = icon_href.split("icon-orz-level-")[-1]

if icon:
    quality_icon = (
        icon.get("xlink:href")
        or icon.get("href")
    )

# 图片
image = soup.select_one(".orz-item-img img")
image_url = image.get("src") if image else None

# 大小
size_element = soup.select_one(".o_weight")
size = size_element.get_text(strip=True) if size_element else None

# 类型
type_element = soup.select_one(".o_info")
item_type = type_element.get_text(strip=True) if type_element else None

# 提取最新成交价
price_element = soup.select_one(".orz-item-price")
latest_price = (
    price_element.get_text(" ", strip=True)
    if price_element else None
)

# 先检查物品是否禁止交易
is_trade_prohibited = (
    "禁止交易" in price_element.get_text(" ", strip=True)
    if price_element else False
)

# 如果实时价格需要登录，则改用今日最高价
if latest_price and "登陆可查看实时价格" in latest_price:
    latest_price = None

if not latest_price or "登陆可查看实时价格" in latest_price:
    for stat in soup.select(".ii-stat"):
        title_element = stat.select_one(".ii-stat-title")
        value_element = stat.select_one(".ii-stat-val")

        if title_element and value_element:
            if title_element.get_text(strip=True) == "今日最高价":
                latest_price = value_element.get_text(strip=True)
                break

item = {
    "name": name,
    "image": image_url,
    "size": size,
    "type": item_type,
    "quality_level": quality_level,
    "latest_price": latest_price,
    "is_trade_prohibited": is_trade_prohibited,
}

print(item)

# 测试获取前 3 页的物品详情链接
base_url = "https://orzice.com/v/scp_book"

all_links = []

for page in range(1, 28):
    list_url = (
        f"{base_url}?top=3-2&grade=-1&mtype=-1&n=&p={page}"
    )

    list_response = requests.get(
        list_url,
        headers=headers,
        timeout=20
    )
    list_response.raise_for_status()
    list_response.encoding = list_response.apparent_encoding

    list_soup = BeautifulSoup(list_response.text, "html.parser")
    links = list_soup.select('a[href*="/v/info/"]')

    print(f"第 {page} 页找到 {len(links)} 个详情链接")

    for link in links:
        href = link.get("href")
        if href:
            full_url = requests.compat.urljoin(base_url, href)
            all_links.append(full_url)

print("共获取详情链接：", len(all_links))
print("去重后链接数量：", len(set(all_links)))
print("前 10 条链接：")

for link in list(dict.fromkeys(all_links))[:10]:
    print(link)

# 检查列表的最大页码
page_numbers = []

for link in list_soup.select("a[href]"):
    match = re.search(r"[?&]p=(\d+)", link.get("href", ""))
    if match:
        page_numbers.append(int(match.group(1)))

print("检测到的最大页码：", max(page_numbers, default=0))

# 测试批量提取前 5 个物品
items = []

for url in list(dict.fromkeys(all_links)):
    time.sleep(0.5)
    try:
        response = requests.get(
            url,
            headers=headers,
            timeout=20
        )
        response.raise_for_status()
        response.encoding = response.apparent_encoding

        soup = BeautifulSoup(response.text, "html.parser")

        title = soup.select_one(".orz-item-title")
        name = title.get_text(strip=True) if title else None

        icon = title.select_one("use") if title else None
        quality_level = None

        if icon:
            icon_href = icon.get("xlink:href") or icon.get("href")
            if icon_href and "icon-orz-level-" in icon_href:
                quality_level = icon_href.split("icon-orz-level-")[-1]

        image = soup.select_one(".orz-item-img img")
        image_url = image.get("src") if image else None

        size_element = soup.select_one(".o_weight")
        size = size_element.get_text(strip=True) if size_element else None

        type_element = soup.select_one(".o_info")
        item_type = type_element.get_text(strip=True) if type_element else None

        # 提取原始价格
        price_element = soup.select_one(".orz-item-price")
        latest_price = (
            price_element.get_text(" ", strip=True)
            if price_element else None
        )

        # 先判断是否禁止交易
        is_trade_prohibited = (
            "禁止交易" in latest_price
            if latest_price else False
        )

        if is_trade_prohibited:
            print("跳过禁止交易物品：", name)
            continue

        # 如果实时价格需要登录，则改用今日最高价
        if latest_price and "登陆可查看实时价格" in latest_price:
            latest_price = None

        if not latest_price:
            for stat in soup.select(".ii-stat"):
                title_element = stat.select_one(".ii-stat-title")
                value_element = stat.select_one(".ii-stat-val")

                if title_element and value_element:
                    if title_element.get_text(strip=True) == "今日最高价":
                        latest_price = value_element.get_text(strip=True)
                        break

        item = {
            "name": name,
            "image": image_url,
            "size": size,
            "type": item_type,
            "quality_level": quality_level,
            "latest_price": latest_price,
            "is_trade_prohibited": False,
        }

        items.append(item)
        print(f"进度：{len(items)} 个可交易物品，当前处理 {url}")
        print(item)

    except Exception as e:
        print("提取失败：", url, e)

print("成功提取且允许交易的物品数量：", len(items))


# 下载物品图片
"""
images_dir = Path("物品图片")
images_dir.mkdir(exist_ok=True)

for index, item in enumerate(items, start=1):
    image_url = item["image"]

    if not image_url:
        print("没有图片 URL：", item["name"])
        continue

    try:
        time.sleep(0.3)

        response = requests.get(
            image_url,
            headers=headers,
            timeout=20
        )
        response.raise_for_status()

        # 清理文件名中的非法字符
        safe_name = re.sub(
            r'[\\/:*?"<>|]',
            "_",
            item["name"] or "未命名"
        )

        # 从图片 URL 获取文件扩展名
        extension = Path(urlparse(image_url).path).suffix or ".png"

        # 加入编号，避免同名物品覆盖文件
        filename = f"{index:03d}_{safe_name}{extension}"
        image_path = images_dir / filename

        image_path.write_bytes(response.content)

        print(f"图片已保存：{filename}")

    except Exception as e:
        print(f"图片下载失败：{item['name']}，原因：{e}")

print("图片下载完成。")
"""


# 导出到 Excel
workbook = Workbook()
sheet = workbook.active
sheet.title = "可交易物品"

# 表头
headers_excel = [
    "名称",
    "图片URL",
    "尺寸",
    "类型",
    "品质等级",
    "最新成交价"
]
sheet.append(headers_excel)

# 写入物品数据
for item in items:
    price = item["latest_price"]

    # 去掉“最新成交价：”前缀
    if price:
        price = price.replace("最新成交价：", "").strip()

    sheet.append([
        item["name"],
        item["image"],
        item["size"],
        item["type"],
        item["quality_level"],
        price
    ])

# 保存文件到当前项目目录
output_file = "可交易物品.xlsx"
workbook.save(output_file)

print(f"Excel 导出完成：{output_file}")
print(f"共导出 {len(items)} 个物品")
from openpyxl import load_workbook

# 输入和输出文件
source_file = "可交易物品.xlsx"
output_file = "itemData.xlsx"

# 读取爬虫生成的表格
source_wb = load_workbook(source_file, data_only=True)
source_ws = source_wb.active

# 获取原表头及其列索引
headers = {
    cell.value: cell.column
    for cell in source_ws[1]
}

# 创建目标表头
target_headers = [
    "id", "name", "type", "quality",
    "width", "height", "weight", "value"
]

# 读取目标文件
target_wb = load_workbook(output_file)
target_ws = target_wb.active

# 清空目标工作表原有内容
target_ws.delete_rows(1, target_ws.max_row)

# 写入新表头
target_ws.append(target_headers)

# 转换每个物品
for row in range(2, source_ws.max_row + 1):
    name = source_ws.cell(row, headers["名称"]).value
    item_type = source_ws.cell(row, headers["类型"]).value
    quality = source_ws.cell(row, headers["品质等级"]).value
    size = source_ws.cell(row, headers["尺寸"]).value
    price = source_ws.cell(row, headers["最新成交价"]).value

    # 拆分尺寸，例如 2×3 -> width=2, height=3
    size_parts = str(size).replace(" ", "").lower().replace("x", "×").split("×")

    if len(size_parts) != 2:
        raise ValueError(f"第 {row} 行尺寸格式错误：{size}")

    width = int(size_parts[0])
    height = int(size_parts[1])

    # 将价格转换为整数，例如 "68,458" -> 68458
    value = int(str(price).replace(",", "").replace("，", "").strip())

    # 写入目标表格
    target_ws.append([
        f"item_{row - 1}",
        name,
        item_type,
        quality,
        width,
        height,
        1,
        value
    ])

# 保存目标文件
target_wb.save(output_file)

print(f"转换完成，共处理 {source_ws.max_row - 1} 个物品。")
print(f"结果已写入：{output_file}")
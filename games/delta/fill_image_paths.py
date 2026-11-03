from openpyxl import load_workbook

# Excel 文件
file_path = "itemData.xlsx"

# 读取工作簿
workbook = load_workbook(file_path)
worksheet = workbook.active

# 获取表头对应的列号
headers = {
    cell.value: cell.column
    for cell in worksheet[1]
}

id_col = headers["id"]
name_col = headers["name"]
image_col = headers["image"]

# 遍历每个物品
for row in range(2, worksheet.max_row + 1):

    item_id = worksheet.cell(row, id_col).value
    item_name = worksheet.cell(row, name_col).value

    # 提取 ID 中的数字，例如 item_26 -> 026
    number = str(item_id).replace("item_", "").zfill(3)

    # 生成图片路径
    image_path = f"images/items/{number}_{item_name}.png"

    # 写入 image 列
    worksheet.cell(row, image_col).value = image_path

# 保存文件
workbook.save(file_path)

print(f"图片路径填充完成，共处理 {worksheet.max_row - 1} 个物品。")
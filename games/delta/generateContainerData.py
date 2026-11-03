
import pandas as pd
import json

df = pd.read_excel("containerData.xlsx")

containers = {}

for _, row in df.iterrows():

    container_id = row["id"]

    # 将 possibleTypes 转换为列表
    if row["possibleTypes"] == "全部":
        possible_types = [
            "工艺藏品",
            "医疗道具",
            "电子物品",
            "工具材料",
            "资料情报",
            "能源燃料",
            "家居物品"
        ]
    else:
        possible_types = [
            item.strip()
            for item in row["possibleTypes"].split(",")
        ]

    containers[container_id] = {
        "id": container_id,
        "name": row["name"],
        "rows": int(row["rows"]),
        "columns": int(row["columns"]),
        "weight": int(row["weight"]),
        "maxItemCount": int(row["maxItemCount"]),
        "possibleTypes": possible_types
    }

with open(
    "js/containerData.js",
    "w",
    encoding="utf-8"
) as f:

    f.write(
        "const CONTAINER_DATA = "
        + json.dumps(
            containers,
            ensure_ascii=False,
            indent=4
        )
        + ";"
    )

print("containerData.js 已生成")

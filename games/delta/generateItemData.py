
import pandas as pd
import json

df = pd.read_excel("itemData.xlsx")
print(df.columns.tolist())

items = {}

for _, row in df.iterrows():

    item_id = row["id"]

    items[item_id] = {
        "id": item_id,
        "name": row["name"],
        "image": row["image"],
        "type": row["type"],
        "quality": int(row["quality"]),
        "season": int(row["season"]),
        "unlocked": int(row["unlocked"]),
        "width": int(row["width"]),
        "height": int(row["height"]),
        "weight": int(row["weight"]),
        "value": int(row["value"]),
    }

with open(
    "js/itemData.js",
    "w",
    encoding="utf-8"
) as f:

    f.write(
        "const ITEM_DATA = "
        + json.dumps(
            items,
            ensure_ascii=False,
            indent=4
        )
        + ";"
    )

print("itemData.js 已生成")

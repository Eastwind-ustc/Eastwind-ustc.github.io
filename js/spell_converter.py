import pandas as pd
import json

df = pd.read_excel("spells.xlsx")

spells = []

for _, row in df.iterrows():

    spells.append({
        "id": row["id"],
        "name": row["name"],
        "desc": row["desc"],
        "qualificationCost": int(row["qualificationCost"]),
        "unlocked": bool(row["unlocked"]),
        "castsPerTurn": int(row["castsPerTurn"]),
        "slots": int(row["slots"]),
        "effectId": row["effectId"]
    })

with open(
    "spellData.js",
    "w",
    encoding="utf-8"
) as f:

    f.write(
        "const SPELL_DATA = "
        + json.dumps(
            spells,
            ensure_ascii=False,
            indent=2
        )
        + ";"
    )

print("spellData.js 已生成")
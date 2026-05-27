// =========================
// ===== LEVEL DATA ========
// =========================

const LEVEL_DATA = [

    // 测试关
    {
        id: "tutorial",
        name: "基础营业",
        orderPool: [
            "lucky_potion",
            "cube_absorber",
            "masked_request"
        ],
        spawnRules: [
            {
                type: "weight_budget",
                totalWeightFnId: "constant_1"
            },
            {
                type: "fixed_schedule",
                schedule: {
                    3: [{orderId: "cube_absorber", count: 1}]
                }
            }
        ],
        startingIngredients: 2,
        ingredientGain: 2
    }

];
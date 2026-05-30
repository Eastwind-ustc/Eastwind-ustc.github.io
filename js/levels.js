// =========================
// ===== LEVEL DATA ========
// =========================

const LEVEL_DATA = [

    // 初始关卡: 测试程序与 UI 功能是否运行正常
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
                totalWeightFnId: "constant_2"
            },
            {
                type: "fixed_schedule",
                schedule: {
                    3: [{orderId: "cube_absorber", count: 1}]
                }
            }
        ],
        finalSpawnTurn: 20,
        startingIngredients: 14,
        ingredientGain: 14
    },

    // 试验关卡: 每回合 1 原料, 1 幸运药水; 5 回合
    {
        id: "level_0_1",
        name: "0-1",
        orderPool: [
            "lucky_potion",
        ],
        spawnRules: [
            {
                type: "weight_budget",
                totalWeightFnId: "constant_1"
            },
        ],
        finalSpawnTurn: 5,
        startingIngredients: 2,
        ingredientGain: 1
    },

    // 试验关卡: 每回合 2 原料; 10 回合; 出怪数列 1111122223
    {
        id: "level_0_2",
        name: "0-2",
        orderPool: [
            "lucky_potion",
            "solvent"
        ],
        spawnRules: [
            {
                type: "weight_budget",
                totalWeightFnId: "level_0_1"
            }
        ],
        finalSpawnTurn: 10,
        startingIngredients: 2,
        ingredientGain: 2
    }

];
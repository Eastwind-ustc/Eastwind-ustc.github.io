// =========================
// ===== LEVEL DATA ========
// =========================

const LEVEL_DATA = [

    // 测试关卡: 测试程序与 UI 功能是否运行正常
    {
        id: "tutorial",
        name: "测试关卡",
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
        startingIngredients: 2,
        ingredientGain: 2,
        startingRating: 3,
        completionGold: 100,
        perfectGold: 50,
    },

    // 0-1: 每回合 1 原料, 1 幸运药水; 5 回合
    {
        id: "level_0_1",
        name: "0-1 第一课",
        orderPool: [
            "lucky_potion",
        ],
        spawnRules: [
            {
                type: "weight_budget",
                totalWeightFnId: "level_0_1"
            },
        ],
        finalSpawnTurn: 4,
        startingIngredients: 2,
        ingredientGain: 1,
        startingRating: 10,
        completionGold: 100,
        perfectGold: 50,
    },

    // 0-2: 每回合 2 原料; 10 回合; 出怪数列 1111122223
    {
        id: "level_0_2",
        name: "0-2 规模提升",
        orderPool: [
            "lucky_potion",
            "potion_35"
        ],
        spawnRules: [
            {
                type: "weight_budget",
                totalWeightFnId: "level_0_2"
            },
            {
                type: "fixed_schedule",
                schedule: {
                    1: [{orderId: "lucky_potion", count: 1}],
                    2: [{orderId: "lucky_potion", count: 1}],
                    3: [{orderId: "potion_35", count: 1}],
                    6: [{orderId: "lucky_potion", count: 2}],
                    7: [{orderId: "lucky_potion", count: 1},{orderId: "potion_35", count: 1}],
                    8: [{orderId: "lucky_potion", count: 1}],
                    9: [{orderId: "potion_35", count: 2}],
                    10: [{orderId: "lucky_potion", count: 1},{orderId: "potion_35", count: 1}],
                }
            }
        ],
        finalSpawnTurn: 10,
        startingIngredients: 2,
        ingredientGain: 2,
        startingRating: 5,
        completionGold: 100,
        perfectGold: 50,
    }

];
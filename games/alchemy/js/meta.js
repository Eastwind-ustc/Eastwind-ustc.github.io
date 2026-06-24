// =========================
// ===== META STATE ========
// =========================
// 记录不属于单局游戏的数据 (局外数据)



// 局外状态
const metaState = {
    // 当前选中关卡
    selectedLevelId: "level_0_1",
    // 选中的法术
    selectedSpellIds: [],
    // 法术装配上限
    selectedSpellsLimit: 10,
    // 金币
    gold: 0
};

// 当前界面
let currentScene = "main_menu";
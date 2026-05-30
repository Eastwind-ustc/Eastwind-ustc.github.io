// =========================
// ===== GAME CREATE =======
// =========================

function createGame(levelId, spellIds) {

    currentLevel =
        LEVEL_DATA.find(
            l => l.id === levelId
        );

    // 重置局内数据
    turn = 0;
    state.skipPotionDiscard = false;
    state.rating = 3;
    state.medals = 0;
    state.gameResult = null;
    gameOver = false;
    state.ingredientGain = currentLevel.ingredientGain;
    state.startingIngredients = currentLevel.startingIngredients;
    hand = [];
    orders = [];
    associationOrder = null;
    spells = createSpells(spellIds);
    saveGame();

    associationOrder = generateAssociationOrder();

    // 初始原料
    for (
        let i = 0;
        i < state.startingIngredients;
        i++
    ) {
        gainCard(generateIngredientCard());
    }
}







// =========================
// ===== SELECT UI =========
// =========================







// 开始一局游戏
if (!loadGame()) {
    render();
} else {
    render();
}



// 放弃单局游戏
function abandonGame() {
    clearSave();
    currentScene =
        "level_select";
    currentLevel =
        null;
    render();
}
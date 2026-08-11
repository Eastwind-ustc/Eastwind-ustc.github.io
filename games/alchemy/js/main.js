// =========================
// ===== GAME CREATE =======
// =========================

// 创建一局游戏 ***
function createGame(levelId, spellIds) {

    currentLevel =
        LEVEL_DATA.find(
            l => l.id === levelId
        );

    gameOver = false;

    // 重置局内数据
    state.turn = 0;
    state.skipPotionDiscard = false;
    state.rating = currentLevel.startingRating ?? 3;
    state.medals = 0;
    state.gameResult = null;
    state.ingredientGain = currentLevel.ingredientGain;
    state.startingIngredients = currentLevel.startingIngredients;
    state.hand = [];
    state.orders = [];
    state.associationOrder = null;
    state.spells = createSpells(spellIds);

    state.associationOrder = generateAssociationOrder();

    state.reactor = {
        type: null,
        index: null
    };

    // 初始原料
    for (
        let i = 0;
        i < state.startingIngredients;
        i++
    ) {
        gainCard(generateIngredientCard());
    }
}



// 主程序
if (!loadGame()) {

    // 没有存档
    // 如果尚未看过开场白，则进入开场白
    if (!metaState.hasSeenOpening) {

        currentScene = "opening";

        render();

        startOpening("opening_0_1");

    } else {

        currentScene = "main_menu";

        render();

    }

} else {

    // 有存档
    // 如果尚未看过开场白，则进入开场白
    if (!metaState.hasSeenOpening) {

        currentScene = "opening";

        render();

        startOpening("opening_0_1");

    } else {

        render();

    }
}
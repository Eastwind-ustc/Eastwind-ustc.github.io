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

    state.ingredientGain =
        currentLevel.ingredientGain;

    state.startingIngredients =
        currentLevel.startingIngredients;

    hand = [];
    orders = [];
    associationOrder = null;

    spells =
        createSpells(spellIds);

    saveGame();

    associationOrder =
        generateAssociationOrder();

    // 初始原料
    for (
        let i = 0;
        i < state.startingIngredients;
        i++
    ) {
        gainCard(
            generateIngredientCard()
        );
    }
}



// 开始游戏
function startGame() {

    createGame(
        metaState.selectedLevelId,
        metaState.selectedSpellIds
    );

    currentScene = "gameplay";

    emitEvent("gameStart", {
        hand,
        orders,
        spells,
        turn,
        state
    });

    render();
}



// =========================
// ===== SELECT UI =========
// =========================

function selectLevel(id) {
    metaState.selectedLevelId = id;
    render();
}

function toggleSpellSelect(id) {
    const arr = metaState.selectedSpellIds;
    const idx = arr.indexOf(id);
    if (idx >= 0) {
        arr.splice(idx, 1);
    } else {
        if (arr.length >= 10)
            return;
        arr.push(id);
    }

    render();
}



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
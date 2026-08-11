const openingState = {
    active: false,
    openingId: null,
    index: 0,
    lines: []
};

function startOpening(openingId) {

    const lines =
        OPENING_SCRIPTS[openingId];

    if (!lines || lines.length === 0) {
        return;
    }

    openingState.active = true;
    openingState.openingId = openingId;
    openingState.index = 0;
    openingState.lines = lines;

    renderOpening();
}



function advanceOpening() {

    if (!openingState.active) {
        return;
    }

    // 还没有显示到最后一行
    if (
        openingState.index <
        openingState.lines.length - 1
    ) {

        openingState.index++;

        renderOpening();

        return;
    }

    // 已经显示最后一行
    endOpening();
}



function endOpening() {

    // 标记玩家已经看过开场白
    metaState.hasSeenOpening = true;

    // 清理开场白状态
    openingState.active = false;
    openingState.openingId = null;
    openingState.index = 0;
    openingState.lines = [];

    // 进入主菜单
    currentScene = "main_menu";

    // 保存状态
    saveGame();

    // 渲染主菜单
    render();
}



document.addEventListener(
    "click",
    () => {

        console.log(
            "GLOBAL CLICK",
            currentScene
        );

        if (
            currentScene !==
            "opening"
        ) {
            return;
        }

        advanceOpening();
    }
);
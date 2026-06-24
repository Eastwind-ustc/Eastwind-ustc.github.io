// 生成格子 DOM
function createBoard() {

    for (let y = 0; y < BOARD_SIZE; y++) {

        for (let x = 0; x < BOARD_SIZE; x++) {

            const cell = document.createElement("div");

            cell.className = "cell";

            cell.dataset.x = x;
            cell.dataset.y = y;

            // cell.onclick = onBoardCellClicked;

            board.appendChild(cell);
        }
    }
}



// 给整个页面注册一个 "鼠标按下" 事件监听器, 不管点击发生在页面哪里都会触发
// 效果: 当点击位置不在装备槽内也不在棋盘内时, 退出装备预备
/*
document.addEventListener("mousedown", (event) => {
    // 如果 selectedEquipment 为空, 即没有选中装备, 中止
    if (!selectedEquipment) return;
    // 判断点击的位置是否在 board 元素内部, 结果记作 isBoardClick
    const isBoardClick = event.target.closest("#board");
    // 判断点击的位置是否在 equipment-slot 元素内部, 结果记作 isEquipmentClick
    const isEquipmentClick = event.target.closest(".equipment-slot");
    // 如果点击发生在合法交互区域 (棋盘或装备槽), 则不处理取消逻辑, 直接退出函数
    if (isBoardClick || isEquipmentClick) return;
    // 否则, 取消当前装备的选中状态, 退出预备状态
    cancelEquipmentSelection();
});
 */



// 点击棋盘格后触发函数
/*
function onBoardCellClicked(event) {
    // 如果 selectedEquipment 不存在, 中止
    if (!selectedEquipment) return;
    // 如果 selectedEquipment 的目标类型不是棋盘格
    if (selectedEquipment.type.targeting !== "grid") {
        // 取消装备选中
        cancelEquipmentSelection();
        // 游戏状态切换
        gameStateMode = "idle";
        // 中止
        return;
    }
    // 如果 selectedEquipment 不以棋盘格为目标, 中止
    if (!canTargetBoardGrid(selectedEquipment)) {return;}
    // 记当前点击的棋盘格为 cell
    const cell = event.currentTarget;
    // 记 cell 的 x 坐标为 x
    const x = Number(cell.dataset.x);
    // 记 cell 的 y 坐标为 y
    const y = Number(cell.dataset.y);

    activateSelectedEquipment(x, y);
}
 */



// 回合结束
function endTurn() {
    // 如果 gameOver 为真即游戏已结束, 中止
    if (gameOver) return;
    // 触发所有装备的回合结束效果
    triggerEquipmentTurnEnd();
    // 回合开始
    startTurn();
}



// 回合开始
function startTurn() {
    // 对于所有装备, 恢复其本回合使用次数
    for (const equipment of equipments) equipment.remainingUsesThisTurn = equipment.currentUsesPerTurn;
    // 刷新装备面板
    refreshEquipmentPanel();
    // 获得零件
    parts += partsPerTurn;
    // 更新游戏 UI
    updateGameUI();
    // 对于所有棋子, 移动 ***
    for (const piece of pieces) {
        piece.y += 4;
        piece.targetY = piece.y;
        if (piece.y >= BOARD_SIZE) {piece.removing = true;}
    }
    // 如果防线耐久不超过 0 ***
    if (defenseHP <= 0) {
        defenseHP = 0;
        triggerGameOver();
        updateGameUI();
        return;
    }
    //
    const randomX = Math.floor(Math.random() * BOARD_SIZE);

    createPiece(randomX, 0);

    initShop();

    updateGameUI();
}
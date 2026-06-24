// 上一帧时间戳
let lastTime = 0;



// 开始生成游戏
init();



// 生成游戏
function init() {
    // 给 gameState 中的数据赋值
    // 防线生命值
    defenseHP = 100;
    // 游戏是否结束
    gameOver = false;
    // 棋子数量
    pieces.length = 0;

    // 在装备栏中加入装备 0,1,2 (测试用)
    equipments.push( createEquipment( EQUIPMENT_TYPES[0] ) );
    equipments.push( createEquipment( EQUIPMENT_TYPES[1] ) );
    equipments.push( createEquipment( EQUIPMENT_TYPES[2] ) );
    equipments.push( createEquipment( EQUIPMENT_TYPES[3] ) );
    equipments.push( createEquipment( EQUIPMENT_TYPES[4] ) );
    equipments.push( createEquipment( EQUIPMENT_TYPES[5] ) );
    equipments.push( createEquipment( EQUIPMENT_TYPES[6] ) );

    // 生成界面
    createLayout();
    // 生成棋盘
    createBoard();
    // 更新装备栏 UI
    refreshEquipmentPanel();
    // 更新防线血量显示与游戏结束状态展示
    updateGameUI();

    // 生成装备池子
    initEquipmentPool();
    // 生成商店
    initShop();

    // ***
    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                selectedEquipment
            ) {

                cancelEquipmentSelection();
            }
        }
    );

    //
    requestAnimationFrame(gameLoop);
}



// 游戏主循环, 每一帧执行一次
// timestamp 为浏览器自动传入的时间 (单位: 毫秒)
function gameLoop(timestamp) {
    // 初始化上一帧时间; 如果是第一帧, 让 lastTime 等于当前时间
    if (!lastTime) lastTime = timestamp;
    // 计算时间间隔 delta time, 单位从毫秒转为秒, 表示 "距离上一帧过去多少秒"
    const dt = (timestamp - lastTime) / 1000;
    // 更新上一帧时间, 为下一帧计算 dt 做准备
    lastTime = timestamp;
    // 执行游戏逻辑更新. 包括: 棋子移动, effect 更新, 生命周期处理
    update(dt);
    // 递归调用自己, 让浏览器在下一帧继续执行这个函数
    requestAnimationFrame(gameLoop);
}



// 每一帧的游戏状态更新, dt 表示这一帧距离上一帧的时间
function update(dt) {
    // 计算棋子移动速度
    const speed = 4 / MOVE_DURATION;
    // 对于每个棋子
    for (const piece of pieces) {
        // 如果当前位置在目标左侧, 向右移动
        if (piece.visualX < piece.targetX) {
            piece.visualX += speed * dt;
            if (piece.visualX > piece.targetX) piece.visualX = piece.targetX;
        }
        // 如果当前位置在目标右侧, 向左移动
        if (piece.visualX > piece.targetX) {
            piece.visualX -= speed * dt;
            if (piece.visualX < piece.targetX) piece.visualX = piece.targetX;
        }
        // ***
        if (piece.visualY < piece.targetY) {
            piece.visualY += speed * dt;
            if (piece.visualY > piece.targetY) piece.visualY = piece.targetY;
        }
        // ***
        if (piece.visualY > piece.targetY) {
            piece.visualY -= speed * dt;
            if (piece.visualY < piece.targetY) piece.visualY = piece.targetY;
        }
        // 把计算后的视觉位置同步到 DOM
        updatePieceDOM(piece);
    }
    // 更新所有 effect 的逻辑
    updateEffects(dt);
    // 清理已完成的 effect
    removeFinishedEffects();
    // 清除被标记删除的 piece
    removeFinishedPieces();
}
// 生成整个界面结构 (棋盘, 装备栏, UI 面板, effect/piece 图层)
// 绑定核心 UI DOM 引用与按钮事件 (结束回合, 重新开始)
function createLayout() {
    //
    const root = document.getElementById("sceneRoot");

    // 初始化装备栏的 html
    let equipmentHtml = "";
    // 对于装备栏的每个槽位, 将其与装备列的对应装备绑定
    for (let i = 0; i < 10; i++) {
        equipmentHtml += `
        <div class="equipment-slot" data-slot-index="${i}"></div>
    `;
    }

    // 注入 html
    // hp 文本
    // 主要区域, 包括装备栏与棋盘, 棋盘上有棋子图层与效果图层
    // "结束回合" 按钮
    // 游戏失败面板, 包括游戏失败信息与 "重新开始游戏" 按钮
    root.innerHTML = `
    <div id="gameRoot">

        <div id="shopPanel">
            <div id="shopTitle">
                商店
            </div>
            <div id="shopSlots">
                <div class="shop-slot"></div>
                <div class="shop-slot"></div>
                <div class="shop-slot"></div>
                <div class="shop-slot"></div>
                <div class="shop-slot"></div>
                <div class="shop-slot"></div>
            </div>
        </div>

        <div id="battlefield">
            <div id="topBar">
                <div id="hpText"></div>
                <button id="endTurnBtn">
                    结束回合
                </button>
            </div>
            <div id="board">
                <div id="pieceLayer"></div>
                <div id="effectLayer"></div>
            </div>
            <div id="bottomBar">
                <div id="equipmentPanel">
                    ${equipmentHtml}
                </div>
            </div>
        </div>

    </div>

    <div id="gameOverPanel" style="display:none;">
        <div id="gameOverText">
            游戏失败...
        </div>
        <button id="restartBtn">
            重新开始游戏
        </button>
    </div>
`;

    // 根据 id 为 board 找到元素并记作 board, 即棋盘
    board = document.getElementById("board");
    // 根据 id 为 pieceLayer 找到元素并记作 pieceLayer, 即棋子图层
    pieceLayer = document.getElementById("pieceLayer");

    effectLayer = document.getElementById("effectLayer");
    // 根据 id 为 hpText 找到元素并记作 hpText, 即当前状态数据文本
    hpText = document.getElementById("hpText");
    // 根据 id 为 endTurnBtn 找到元素并记作 endTurnBtn, 即回合结束按钮
    endTurnBtn = document.getElementById("endTurnBtn");
    //
    gameOverPanel = document.getElementById("gameOverPanel");
    // 将 endTurnBt 绑定上函数 endTurn, 触发方式为点击
    endTurnBtn.addEventListener("click", endTurn);
    // 根据 id wei restartBtn 找到元素, 并绑定上函数 restartGame, 触发方式为点击
    document.getElementById("restartBtn").addEventListener("click", restartGame);
}



// 更新防线血量显示与游戏结束状态展示
function updateGameUI() {
    // 更新元素 hpText 的文本内容
    hpText.textContent = `防线耐久：${defenseHP} | 零件：${parts}`;
    // 如果游戏结束
    if (gameOver) {
        // 回合结束按钮不可用
        endTurnBtn.disabled = true;
        //
        gameOverPanel.style.display = "block";
    }
}



// 控制游戏结束
function triggerGameOver() {
    gameOver = true;
}



// 游戏重启
function restartGame() {
    location.reload();
}
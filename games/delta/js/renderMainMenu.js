// 渲染主界面
function renderMainMenu() {

    const gameRoot = document.getElementById("gameRoot");

    gameRoot.innerHTML = "";

    // 主界面容器
    const mainMenu = document.createElement("div");
    mainMenu.className = "main-menu";

    // 标题
    const title = document.createElement("h1");
    title.textContent = "三角洲";

    // 开始游戏按钮
    const startButton = document.createElement("button");
    startButton.textContent = "开始游戏";

    startButton.onclick = startGame;

    // 按上下关系加入
    mainMenu.appendChild(title);
    mainMenu.appendChild(startButton);

    gameRoot.appendChild(mainMenu);
}



// 开始一局新游戏
function startGame() {
    // 重置玩家哈夫币
    playerCurrency = 0;
    // 重置回合数
    currentRound = 0;
    // 重置玩家生命值
    playerHP = 100;
    // 开始第一回合
    startNextRound();
    // 切换到游戏界面
    currentScene = "gameplay";
    // 刷新画面
    render();
}
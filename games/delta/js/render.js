// 渲染整个页面
function render() {

    // 根据当前界面的类型选择渲染函数
    switch (currentScene) {

        // 主界面
        case "main_menu":
            renderMainMenu();
            break;

        // 游戏界面
        case "gameplay":
            renderGameplay();
            break;
    }
}
// =========================
// ===== RENDER ============
// =========================
// 这份文件含有关于渲染页面的函数. 包括:
// 函数 render: 渲染整个页面
// 函数 renderOrders: 渲染订单部分



// 渲染整个页面
function render() {

  renderScriptOverlay();

  // updateBGM();

  // 根据当前界面的类型选择渲染函数
  switch (currentScene) {
    // 主界面
    case "main_menu":
      renderMainMenu();
      saveGame();
      break;
    // 关卡选择界面
    case "level_select":
      renderLevelSelect();
      saveGame();
      break;
    // 法术选择界面
    case "spell_select":
      renderSpellSelect();
      saveGame();
      break;
    // 局内游戏界面
    case "gameplay":
      renderGameplay();
      break;
    // 结算界面
    case "settlement":
      renderSettlement();
      saveGame();
      break;
  }
}
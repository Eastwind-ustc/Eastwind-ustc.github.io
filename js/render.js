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
  // 主界面
  if (currentScene === "main_menu") {
    renderMainMenu();
    saveGame();
    return;
  }
  // 关卡选择界面
  if (currentScene === "level_select") {
    renderLevelSelect();
    saveGame();
    return;
  }
  // 法术选择界面
  if (currentScene === "spell_select") {
    renderSpellSelect();
    saveGame();
    return;
  }
  // 游玩界面
  if (currentScene === "gameplay") {
    renderGameplay();
    saveGame();
    return;
  }
}
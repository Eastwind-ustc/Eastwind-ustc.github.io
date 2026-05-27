// =========================
// ===== RENDER ============
// =========================
// 这份文件含有关于渲染页面的函数. 包括:
// 函数 render: 渲染整个页面
// 函数 renderOrders: 渲染订单部分



// 渲染整个页面
function render() {

  if (currentScene === "level_select") {
    renderLevelSelect();
    saveGame();
    return;
  }

  if (currentScene === "gameplay") {
    renderGameplay();
    saveGame();
    return;
  }
}

// =========================
// ===== TURN SYSTEM =======
// =========================

function nextTurn() {

  if (!canDoAction("nextTurn")) return;

  // 回合数 +1
  state.turn++;
  // 刷新协会订单
  state.associationOrder = generateAssociationOrder();
  // 已有订单剩余时间减少
  for (const o of state.orders) {
    o.remainingTime--;
  }
  // 统计超时订单, 计算数量并记录
  let penalty = 0;
  const newOrders = [];
  for (const o of state.orders) {
    if (o.remainingTime <= 0) { // 超时的订单不记录, 没超时的订单记录
      penalty++;
    } else {
      newOrders.push(o);
    }
  }
  // 营业评级 -= 超时订单数
  state.rating -= penalty;
  // 更新订单列表, 留下刚才被记录的订单 (等效于超时的直接消失)
  state.orders = newOrders;
  // 如果营业评级不大于 0, 游戏失败
  checkDefeat();
  // 出怪
  if (state.turn <= currentLevel.finalSpawnTurn) {
    state.orders.push(
        ...generateOrders()
    );
  }
  // 如果不跳过弃置药水阶段, 就弃置所有 type 为 "药水" 的 hand
  if (!state.skipPotionDiscard) {
    state.hand = state.hand.filter(c => c.type !== "药水");
  }
  // 随机获得两份原料
  for (let i = 0; i < state.ingredientGain; i++) {
    gainCard(generateIngredientCard());
  }
  // 每个法术的已使用次数变更为 0
  state.spells.forEach(s => s.castsUsed = 0);
  // 广播
  emitEvent("turnStart", {});
  onGameEvent("turnStart", {});
  // 判断是否胜利
  checkVictory();
  // 回合开始完成后, 保存游戏
  saveGame();
  // 渲染
  render();
}



// 检查失败
function checkDefeat() {

  if (state.rating <= 0) {
    state.gameResult = "defeat";
    gameOver = true;
    saveGame();
  }

  return false;
}



// 检查胜利
function checkVictory() {
  if (!currentLevel) return;
  if (state.turn < currentLevel.finalSpawnTurn) return;
  if (state.orders.length > 0) return;
  if (state.rating <= 0) return;
  state.gameResult = "victory";
  gameOver = true;
  // 游戏胜利后, 保存游戏
  saveGame();
  // 渲染
  // render();
}
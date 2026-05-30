// =========================
// ===== TURN SYSTEM =======
// =========================

function nextTurn() {

  if (!canDoAction("nextTurn")) return;

  // 回合数 +1
  turn++;
  // 刷新协会订单
  associationOrder = generateAssociationOrder();
  // 已有订单剩余时间减少
  for (const o of orders) {
    o.remainingTime--;
  }
  // 统计超时订单, 计算数量并记录
  let penalty = 0;
  const newOrders = [];
  for (const o of orders) {
    if (o.remainingTime <= 0) { // 超时的订单不记录, 没超时的订单记录
      penalty++;
    } else {
      newOrders.push(o);
    }
  }
  // 营业评级 -= 超时订单数
  state.rating -= penalty;
  // 更新订单列表, 留下刚才被记录的订单 (等效于超时的直接消失)
  orders = newOrders;
  // 如果营业评级不大于 0, 游戏失败
  if (state.rating <= 0) {
    state.gameResult = "defeat";
    gameOver = true;
  }
  // 出怪
  if (turn <= currentLevel.finalSpawnTurn) {
    orders.push(
        ...generateOrders()
    );
  }
  // 如果不跳过弃置药水阶段, 就弃置所有 type 为 "药水" 的 hand
  if (!state.skipPotionDiscard) {
    hand = hand.filter(c => c.type !== "药水");
  }
  // 随机获得两份原料
  for (let i = 0; i < state.ingredientGain; i++) {
    gainCard(generateIngredientCard());
  }
  // 每个法术的已使用次数变更为 0
  spells.forEach(s => s.castsUsed = 0);
  // 广播
  emitEvent("turnStart", {});
  onGameEvent("turnStart", {});
  // 判断是否胜利
  checkVictory();
  // 渲染
  render();
}



function checkVictory() {
  if (!currentLevel) return;
  if (turn <= currentLevel.finalSpawnTurn) return;
  if (orders.length > 0) return;
  if (state.rating <= 0) return;
  state.gameResult = "victory";
  gameOver = true;
  // 渲染
  render();
}
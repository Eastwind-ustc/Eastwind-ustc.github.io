// =========================
// ===== TURN SYSTEM =======
// =========================

function nextTurn() {

  turn++;

  // 协会订单：每回合刷新
  associationOrder = generateAssociationOrder();

  // 1. 先减少时间
  for (const o of orders) {
    o.remainingTime--;
  }

  // 2. 统计超时订单
  let penalty = 0;

  const newOrders = [];

  for (const o of orders) {

    if (o.remainingTime <= 0) {
      penalty++;
    } else {
      newOrders.push(o);
    }
  }

  // 3. 扣评级
  state.rating -= penalty;

  // 4. 更新订单列表（超时的直接消失）
  orders = newOrders;

  // 5. 游戏失败判断
  if (state.rating <= 0) {
    gameOver = true;
  }

  orders.push(generateOrder());

  gainCard(generateHerbCard());
  gainCard(generateHerbCard());

  if (!state.skipPotionDiscard) {
    hand = hand.filter(c => c.type !== "药水");
  }

  spells.forEach(s => s.castsUsed = 0);

  render();
}
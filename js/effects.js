// =========================
// ===== EFFECT ENGINE =====
// =========================



// 根据 result 的 type 决定执行哪类操作, 再根据 result 携带的其余信息决定对谁操作. 操作包括: 获得手牌, 删除手牌, 改变state, 产生新的订单等
function applyEffect(result) {

  if (!result) return;

  switch (result.type) {

    // 获得卡牌
    case "gainCard":
      gainCard(result.card);
      break;

    // 移除卡牌
    case "removeCard":
      removeCard(result.index);
      break;

    // 获得奖章
    case "gainMedals":
      state.medals += result.amount;
      break;

    // 修改状态
    case "modifyState":
      Object.assign(state, result.payload);
      break;

    // 产生订单
    case "spawnOrder":
      orders.push(result.order);
      break;

    // 多效果
    case "multiEffect":
      result.effects.forEach(e => applyEffect(e));
      break;

    // 法术替换
    case "replaceSpell": {
      const idx =
          spells.findIndex(s => s.id === result.from);
      if (idx < 0) return;
      const newSpell =
          createSpells([result.to])[0];
      newSpell.runtimeState = result.state || {};
      spells[idx] = newSpell;
      break;
    }
  }
}
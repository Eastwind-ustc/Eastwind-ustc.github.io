// =========================
// ===== HAND ==============
// =========================
// 这份文件含有与修改手牌相关的函数. 包括:
// 函数 gainCard: 将一张牌 card 加入手牌, 除非手牌数量大于等于手牌上限
// 函数 removeCard: 从手牌的第 index 号位置开始, 删除一张牌



// 将一张牌 card 加入手牌, 除非手牌数量大于等于手牌上限
function gainCard(card) {
  if (state.hand.length >= HAND_LIMIT) return;
  state.hand.push(card);
}

// 从手牌的第 index 号位置开始, 删除一张牌
function removeCard(index) {
  state.hand.splice(index, 1);
}
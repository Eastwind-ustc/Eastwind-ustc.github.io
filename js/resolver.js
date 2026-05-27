// =========================
// ===== SLOT RESOLVER =====
// =========================

function resolveInputs(spell, uiState) {

  const cards = [];
  const indices = [];

  const used = new Set(); // ⭐ 防重复用

  for (let i = 0; i < spell.slots.length; i++) {

    const idx = uiState.selected[i];

/* // 调试代码
console.log(
  "slot", i,
  "idx=", idx,
  "type=", typeof idx
);*/

    // 1. 必须存在
    if (idx === "" || idx === undefined) return null;

    const nIdx = Number(idx);

    // 2. 防重复选卡 ⭐核心
    if (used.has(nIdx)) return null;

    used.add(nIdx);

    const card = hand[nIdx];

    // 3. 卡牌必须存在
    if (!card) return null;

    cards.push(card);
    indices.push(nIdx);
  }

  return {
    cards,
    indices
  };
}
// 解析输入
function resolveInputs(spell, uiState, spellIndex) {

  const selects = document.querySelectorAll(
      `select[data-spell="${spellIndex}"]`
  );

  if (!selects.length) {
    // 0槽位法术
    if (spell.slots.length === 0) {
      return {
        cards: [],
        indices: []
      };
    }
    return null;
  }

  // 建立卡牌列 cards 与索引列 indices (索引指示一张卡牌在手牌中的位置)
  const cards = [];
  const indices = [];

  // 用 cards 记录一张
  for (let i = 0; i < selects.length; i++) {
    const idx = selects[i].value;
    if (idx === "") return null;

    cards.push(hand[idx]);
    indices.push(idx);
  }

  return { cards, indices };
}
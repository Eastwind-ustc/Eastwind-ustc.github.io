// =========================
// ===== SPELL ENGINE ======
// =========================

const SPELL_EFFECTS = {

mix(ctx) {

  const a = ctx.cards[0];
  const b = ctx.cards[1];

  return {
    type: "gainCard",
    card: createPotionCard(
      addFrac(a.value, b.value)
    ),
    consume: ctx.indices
  };
},

filter(ctx) {

  const a = ctx.cards[0];
  const b = ctx.cards[1];

  return {
    type: "gainCard",
    card: createPotionCard(
      subFrac(a.value, b.value)
    ),
    consume: ctx.indices
  };
},

burn(ctx) {

  const a = ctx.cards[0];
  const b = ctx.cards[1];

  return {
    type: "gainCard",
    card: createPotionCard(
      mulFrac(a.value, b.value)
    ),
    consume: ctx.indices
  };
},

extract(ctx) {

  const a = ctx.cards[0];
  const b = ctx.cards[1];

  if (b.value.num === 0) {
    return null;
  }

  return {
    type: "gainCard",
    card: createPotionCard(
      divFrac(a.value, b.value)
    ),
    consume: ctx.indices
  };
},

activate(ctx) {

  const a = ctx.cards[0];

  return {
    type: "gainCard",
    card: createPotionCard(
      addFrac(a.value, intToFrac(1))
    ),
    consume: [ctx.indices[0]]
  };
}

};

const spells = SPELL_DATA.map(s => ({

  ...s,

  castsUsed: 0,

  slots:
    Array.from(
      { length: s.slots },
      () => ({ type: "card" })
    ),

  effect: SPELL_EFFECTS[s.effectId]
}));

// =========================
// ===== CAST SPELL ========
// =========================

function castSpell(spellIndex, uiState) {

  // 在法术列表 spells 中根据 spellIndex 找到施放的法术, 记作 spell
  const spell = spells[spellIndex];

  // 如果达到施放次数上限，不生效
  if (
    spell.castsPerTurn >= 0 &&
    spell.castsUsed >= spell.castsPerTurn
  ) return;

  // 根据 spell 和 uiState 解析出 input
  const input = resolveInputs(spell, uiState);

  // 如果 input==null 不发生任何效果
  if (!input) return;

  // 将 spell.effect 作用于 {手牌,订单,回合数,状态,卡牌s,索引s} 得到法术效果, 记作result
  const result = spell.effect({
    hand,
    orders,
    turn,
    state,
    cards: input.cards,
    indices: input.indices
  });

  // 将 result 传给 applyEffect, 执行效果
  applyEffect(result);

  // 将 spell 的已使用次数增加 1
  spell.castsUsed++;

  // 如果法术生效且法术要消耗, 消耗这些卡牌 (consume是要删的卡牌的索引)
  if (result && result.consume) {

    result.consume
      .sort((a, b) => b - a)
      .forEach(i => removeCard(i));
  }

  render();
}
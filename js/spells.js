// =========================
// ===== SPELL ENGINE ======
// =========================



// 法术条件
const SPELL_CONDITIONS = {

  // 默认条件: 永远允许
  always(ctx) {
    return true;
  },

  // 第二个输入不为0 (用于除法)
  y_not_zero(ctx) {
    const b = ctx.cards[1];
    if (!b) return false;
    return b.value.num !== 0;
  },

  // 条件: 只收原料
  ingredient_only(ctx) {
    return (
        ctx.cards[0]?.type === "原料"
    );
  },

  // 镜像条件: 数值 == 11
  value_11(ctx) {
    return equalFrac(
        ctx.cards[0].value,
        intToFrac(11)
    );
  },

  // 计算误差: 数值 == 23
  value_23(ctx) {
    return equalFrac(
        ctx.cards[0].value,
        intToFrac(23)
    );
  },

  // 灰色交易条件: 数值 == 协会订单.数值
  association_match(ctx) {
    const a = ctx.cards[0];
    return (
        a.value.den === 1 &&
        a.value.num ===
        associationOrder.requirement
    );
  },

  // 会员注册条件: 全部花色的同种数值原料
  all_suits_ingredient_same_value(ctx) {
    const cards = ctx.cards;
    if (!cards || cards.length !== 4) return false;
    // 全是原料牌
    if (!cards.every(c => c.type === "原料")) return false;
    // 花色顺序
    const suits = cards.map(c => c.suit);
    const suitOk =
        suits[0] === "♠"
        &&
        suits[1] === "♥"
        &&
        suits[2] === "♣"
        &&
        suits[3] === "♦";
    if (!suitOk) {return false;}
    // 数值相同
    const num = cards[0].value.num;
    const den = cards[0].value.den;
    const sameValue =
        cards.every(
            c =>
                c.value.num === num &&
                c.value.den === den
        );
    return num;
  },

  // 国士无双条件: 国士无双
  thirteen_orphans_condition(ctx) {
    const cards = ctx.cards;
    if (!cards || cards.length !== 14) return false;
    // 全是原料牌
    if (!cards.every(c => c.type === "原料")) return false;
    // 前13个必须是 1~13
    for (let i = 0; i < 13; i++) {
      const v = cards[i].value?.num;
      if (v !== i + 1) return false;
    }
    return true;
  },
};



// 法术效果
const SPELL_EFFECTS = {

  // 研磨
  grind(ctx) {
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

  // 过滤
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

  // 灼烧
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

  // 萃取
  extract(ctx) {
    const a = ctx.cards[0];
    const b = ctx.cards[1];
    return {
      type: "gainCard",
      card: createPotionCard(
        divFrac(a.value, b.value)
      ),
      consume: ctx.indices
    };
  },

  // 活化
  activate(ctx) {
    const a = ctx.cards[0];
    return {
      type: "gainCard",
      card: createPotionCard(
        addFrac(a.value, intToFrac(1))
      ),
      consume: [ctx.indices[0]]
    };
  },

  // 规模扩张
  scale_expand(ctx) {
    return {
      type: "gainCard",
      card: generateIngredientCard(),
      consume: []
    };
  },

  // 丰饶大地
  fertile_land(ctx) {
    return {
      type: "multiEffect",
      effects: [
        {
          type: "gainCard",
          card: generateIngredientCard()
        },
        {
          type: "gainCard",
          card: generateIngredientCard()
        }
      ],
      consume: []
    };
  },

  // 异变
  cyclic_mutate(ctx) {
    const a = ctx.cards[0];
    // 13 -> 1，否则 +1
    const v =
        a.value.den === 1
            ? ((a.value.num % 13) + 1)
            : null;
    return {
      type: "gainCard",
      card: {
        type: "原料",
        suit: a.suit,
        value: intToFrac(v)
      },
      consume: [ctx.indices[0]]
    };
  },

  // 计算误差
  calculation_error(ctx) {
    return {
      type: "multiEffect",
      effects: [
        {
          type: "gainCard",
          card: generateIngredientCard()
        },
        {
          type: "gainCard",
          card: generateIngredientCard()
        },
        {
          type: "gainCard",
          card: generateIngredientCard()
        },
        {
          type: "gainCard",
          card: generateIngredientCard()
        }
      ],
      consume: [ctx.indices[0]]
    };
  },

  // 灰色交易
  grey_trade(ctx) {
    const a = ctx.cards[0];
    return {
      type: "multiEffect",
      effects: [
        {
          type: "gainCard",
          card: generateIngredientCard()
        },
        {
          type: "gainCard",
          card: generateIngredientCard()
        },
        {
          type: "gainCard",
          card: generateIngredientCard()
        }
      ],
      consume: [ctx.indices[0]]
    };
  },

  // 快速降温
  quick_cool(ctx) {
    const a = ctx.cards[0];
    const n =
        ((a.value.num + 11) % 13) + 1;
    return {
      type: "gainCard",
      card: {
        type: "原料",
        suit: a.suit,
        value: intToFrac(n)
      },
      consume: [ctx.indices[0]]
    };
  },

  // 周期律
  cycle_law(ctx) {
    const a = ctx.cards[0];
    const spell = ctx.spell;
    const step = spell.cycleState || 1;
    const n = ((a.value.num + step - 1) % 13) + 1;
    return {
      type: "gainCard",
      card: {
        type: "原料",
        suit: a.suit,
        value: intToFrac(n)
      },
      consume: [ctx.indices[0]]
    };
  },

  // 复制
  duplicate(ctx) {
    if (ctx.hand.length===1) return null;
    let idx = ctx.indices[0];
    let c=ctx.hand[0];
    if(idx===0) c = ctx.hand[1];
    return {
      type: "gainCard",
      card: {
        type:c.type,
        suit:c.suit,
        value:{...c.value}
      },
      consume: [ctx.indices[0]]
    };
  },

  // 投影
  projection(ctx) {
    const source = ctx.cards[0];
    const consumed = ctx.indices.length;
    let n =
        ctx.hand.length -
        consumed;
    if (n <= 0) {
      return null;
    }
    if (n < 1 || n > 13) {
      n = 13;
    }
    return {
      type: "gainCard",
      card: {
        type: "原料",
        suit: source.suit,
        value: intToFrac(n)
      },
      consume: [ctx.indices[0]]
    };
  },

  // 会员注册
  membership_register(ctx){
    const X = ctx.cards[0].value;
    return {
      type: "replaceSpell",
      from: "membership_register",
      to: "membership_lifetime",
      state:{X},
      consume: ctx.indices
    };
  },

  // 终身会员
  membership_lifetime(ctx){
    const X = ctx.spell.runtimeState.X;
    return {
      type: "gainCard",
      card: createIngredientCard(X)
    };
  },

  // 国士无双 (考虑保留)
  /* thirteen_orphans(ctx) {
    // 解锁所有法术
    for (const spell of spells) {
      spell.unlocked = true;
    }
    return {
      consume: ctx.indices
    };
  }
   */

  thirteen_orphans(ctx) {
    return {
      type: "gainMedals",
      amount: 13
    };
  },

};



const SPELL_PASSIVES = {

  // 快速冷却被动: orderCompleted触发, 如果自身已解锁且本回合已使用过, 已使用次数减少 1
  quick_cool_passive: [
    {
      event: "orderCompleted",
      handler(ctx) {
        const spell = ctx.spell;
        if (
            spell.unlocked &&
            spell.castsUsed > 0
        ) {
          spell.castsUsed--;
        }
        return null;
      }
    }
  ],

  // 周期律被动: spellCast 触发, 自身切换到下一个状态
  cycle_law_passive: [
    {
      event: "spellCast",
      handler(ctx) {
        const spell = ctx.spell;
        // 必须是自己
        if (spell.effectId !== "cycle_law") return null;
        // 未解锁不触发
        if (!spell.unlocked) return null;
        // 切换至周期的下一个状态
        spell.cycleState = ((spell.cycleState || 1) % 13) + 1;
        return null;
      }
    }
  ],

  // 战术快递被动: gameStart触发, 获得两份原料
  tactical_delivery_passive: [
    {
      event: "gameStart",
      handler(ctx) {
        return {
          type: "multiEffect",
          effects: [
            {
              type: "gainCard",
              card: generateIngredientCard()
            },
            {
              type: "gainCard",
              card: generateIngredientCard()
            }],
          }
        }
      }
  ],

  fake_medal_passive: [
    {
      event: "gameStart",
      handler(ctx) {
        return {
          type: "gainMedals",
          amount: 1
        }
      }
    }
  ],

};



const SPELL_DESC_FNS = {

  // 周期律描述
  cycle_law_desc(spell) {
    const step = spell.cycleState || 1;
    return `获得原料[X+${step}]. 每当你施放一个法术, 周期律会切换到下一个形态.`;
  },

  // 终身会员描述
  membership_lifetime(spell){
    const X = spell.runtimeState?.X;
    if(X === undefined){
      return "获得一份随机类型的原料[X].";
    }

    return `获得一份随机类型的原料[${X.num}].`;
  }

};



// 创建法术列
let spells = [];



// =========================
// ===== CAST SPELL ========
// =========================

// 根据 spellIndex 和 uiState 施放法术
function castSpell(spellIndex, uiState) {

  // 在法术列表 spells 中根据 spellIndex 找到施放的法术, 记作 spell
  const spell = spells[spellIndex];
  
  // 如果达到施放次数上限，不生效
  if (
    spell.castsPerTurn >= 0 &&
    spell.castsUsed >= spell.castsPerTurn
  ) return;
  // 根据 spell 和 uiState 解析出 input
  const input = resolveInputs(spell, uiState, spellIndex);
  // 如果 input==null 不发生任何效果
  if (!input) return;

  const ctx = {
    hand,
    orders,
    turn,
    state,
    cards: input.cards,
    indices: input.indices,
    spell
  };

  if (
      spell.condition &&
      !spell.condition(ctx)
  ) return;

  console.log("OK", spell);

  const result =
      spell.effect(ctx);

  // 如果法术生效且法术要消耗, 消耗这些卡牌 (consume是要删的卡牌的索引)
  if (result && result.consume) {
    result.consume
        .sort((a, b) => b - a)
        .forEach(i => removeCard(i));
  }

  // 将 result 传给 applyEffect, 执行效果
  applyEffect(result);

  // 广播
  emitEvent("spellCast", {
    spellIndex,
    spell,
    result
  });

  // 将 spell 的已使用次数增加 1
  spell.castsUsed++;

  render();
}



// 根据法术ID创建本局法术
function createSpells(selectedIds) {

  return SPELL_DATA
      .filter(s =>
          selectedIds.includes(s.id)
      )
      .map(s => ({

        ...structuredClone(s),

        castsUsed: 0,

        runtimeState: {},

        slots: Array.from(
            { length: s.slots },
            (_, i) => ({
              type: "card",
              display:
                  s.slotDisplay?.[i] ?? "-"
            })
        ),

        effect:
            SPELL_EFFECTS[s.effectId],

        condition:
            SPELL_CONDITIONS[
                s.conditionId
                ] ??
            SPELL_CONDITIONS.always,

        passives:
            SPELL_PASSIVES[
                s.passiveId
                ] ?? [],

        descFn:
            SPELL_DESC_FNS[
                s.descFnId
                ] ?? null,

        trigger: s.trigger ?? "cast",

      }));
}
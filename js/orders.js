// =========================
// ===== ORDERS ============
// =========================

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// =========================
// ===== ORDER TYPES =======
// =========================

const ORDER_TYPES = [

  // --- 24订单 ---
  {
    id:
      "lucky_potion",

    name:
      "幸运药水订单",

    potionRequirement: [
      intToFrac(24)
    ],

    deadline: 3,
    remainingTime: 3,

    rewardDesc:
      "随机获得1份药材",

    rewardEffect(ctx) {

      gainCard(
        generateHerbCard()
      );
    }
  },

  // --- 4/8/16订单 ---
  {
    id:
      "cube_absorber",

    name:
      "方体吸附剂订单",

    potionRequirement: [
      intToFrac(4),
      intToFrac(8),
      intToFrac(16)
    ],

    deadline: 3,
    remainingTime: 3,

    rewardDesc:
      "获得3张2药水",

    rewardEffect(ctx) {

      for (let i = 0; i < 3; i++) {

        gainCard(
          createPotionCard(
            intToFrac(2)
          )
        );
      }
    }
  }
];

// =========================
// ===== ORDER CLONE =======
// =========================

function cloneOrder(template) {

  return {

    id:
      template.id,

    name:
      template.name,

    potionRequirement:
      template.potionRequirement
        .map(f => ({ ...f })),

    deadline:
      template.deadline,

    remainingTime:
      template.deadline,

    rewardDesc:
      template.rewardDesc,

    rewardEffect:
      template.rewardEffect
  };
}

// =========================
// ===== ORDER GENERATE ====
// =========================

function generateOrder() {

  const template =
    randomChoice(ORDER_TYPES);

  return cloneOrder(template);
}

function generateAssociationOrder() {

  return {
    id: "association",

    name: "协会订单",

    requirement: Math.floor(Math.random() * 101),

    rewardDesc: "奖章 +1",

    rewardEffect(ctx) {
      state.medals += 1;
    }
  };
}

// =========================
// ===== ORDER RESOLVER ====
// =========================

function resolveOrderInputs(order, uiState) {

  const cards = [];
  const indices = [];
  const used = new Set();

  for (let i = 0; i < order.potionRequirement.length; i++) {

    const idx = uiState.selected[i];

    if (
      idx === "" ||
      idx === undefined ||
      idx === null
    ) return null;

    const nIdx = Number(idx);

    if (used.has(nIdx)) return null;
    used.add(nIdx);

    const card = hand[nIdx];

    if (!card) return null;

    cards.push(card);
    indices.push(nIdx);
  }

  return {
    cards,
    indices
  };
}

// =========================
// ===== SUBMIT ORDER ======
// =========================

function submitOrder(orderIndex, uiState) {

  const order = orders[orderIndex];

  if (!order) return;

  const input =
    resolveOrderInputs(order, uiState);

  if (!input) return;

  // 检查提交是否完全匹配
  for (let i = 0; i < order.potionRequirement.length; i++) {

    if (
      !equalFrac(
        input.cards[i].value,
        order.potionRequirement[i]
      )
    ) {
      return;
    }
  }

  // 消耗提交卡（降序删）
  input.indices
    .sort((a,b)=>b-a)
    .forEach(i=>removeCard(i));

  // 删除订单
  orders.splice(orderIndex,1);

  // 执行奖励效果
  if (order.rewardEffect) {

    order.rewardEffect({
      hand,
      orders,
      turn,
      state
    });
  }

  render();
}

// 
function submitAssociationOrder(cardIndex) {

  const card = hand[cardIndex];

  if (!card) return;

  const value = card.value.num;

  if (value === associationOrder.requirement) {

    // 完成奖励
    associationOrder.rewardEffect();

    // 删除卡
    removeCard(cardIndex);

    // 立刻生成新订单
    associationOrder = generateAssociationOrder();
  }
}
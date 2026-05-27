// =========================
// ===== ORDERS ============
// =========================



function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}





// =========================
// ===== ORDER TYPES =======
// =========================



const ORDER_REQUIREMENTS = {

  lucky_potion(ctx) {
    return equalFrac(
        ctx.cards[0].value,
        intToFrac(24)
    );
  },

  cube_absorber(ctx) {
    return (
        equalFrac(ctx.cards[0].value,intToFrac(2)) &&
        equalFrac(ctx.cards[1].value,intToFrac(4)) &&
        equalFrac(ctx.cards[2].value,intToFrac(8))
    );
  },

  masked_request(ctx) {
    if (!associationOrder) return false;
    const a = ctx.cards[0];
    return (
        a.value.den === 1 &&
        a.value.num === associationOrder.requirement
    );
  },
}



const ORDER_REWARDS = {

  // 幸运药水订单奖励
  lucky_potion(ctx) {
    gainCard(generateIngredientCard());
  },

  // 方体吸附剂订单奖励
  cube_absorber(ctx) {
    for (let i=0;i<3;i++) {
      gainCard(
          createPotionCard(
              intToFrac(2)
          )
      );
    }
  },

  // 蒙面人的请求奖励
  masked_request(ctx) {

    if (ctx.hand.length===0) return;
    const c=ctx.hand[0];
    gainCard({
      type:c.type,
      suit:c.suit,
      value:{...c.value}
    });
  },
}



const ORDER_TYPES = ORDER_DATA.map(o => ({
  ...o,

  requirementCheck:
      ORDER_REQUIREMENTS[o.requirementId],

  rewardEffect:
      ORDER_REWARDS[o.rewardId]
}));





// =========================
// ===== ORDER CLONE =======
// =========================



// 根据 template 中给出的订单模板信息创造一个订单实体
function cloneOrder(template) {
  return {
    id: template.id,
    name: template.name,
    slotCount: template.slotCount,
    requirementDesc: template.requirementDesc,
    requirementCheck: template.requirementCheck,
    deadline: template.deadline,
    remainingTime: template.deadline,
    rewardDesc: template.rewardDesc,
    rewardEffect: template.rewardEffect,
    submitCheck: template.submitCheck,
  };
}





// =========================
// ===== ORDER GENERATE ====
// =========================



// 在固定订单池中产生一个生成
function generateOrder() {
  if (!currentLevel) return null;
  const pool = ORDER_TYPES.filter(t =>
      currentLevel.orderPool.includes(t.id)
  );
  const template = randomChoice(pool);
  return cloneOrder(template);
}

// 生成订单
function generateOrders() {
  // 如果 currentLevel 不存在, 退出
  if (!currentLevel) return [];
  // 创建本回合订单列 spawned
  const spawned = [];
  // rules 为本关出怪规则
  const rules =
      currentLevel.spawnRules
      ?? [];
  // 对于 rules 中的每条规则
  for (const rule of rules) {

    const fn =
        SPAWN_RULES[
            rule.type
            ];

    if (!fn) continue;

    spawned.push(
        ...fn(
            {
              turn,
              level:
              currentLevel,
              orders,
              state
            },
            rule
        )
    );
  }

  return spawned;
}

// 创造一个协会订单, 数值在从 0 到 100 的整数中等概率随机
function generateAssociationOrder() {
  return {
    id: "association",
    name: "协会订单",
    requirement: Math.floor(Math.random() * 101),
    rewardDesc: "一枚资质奖章.",
    rewardEffect(ctx) {
      state.medals += 1;
    }
  };
}





// =========================
// ===== ORDER RESOLVER ====
// =========================



// 根据 order 与 uiState 解析提交输入, 并检查合法性
function resolveOrderInputs(order, uiState) {

  // 创建空的卡牌列, 序号列(保存卡牌在手牌中的位置序号), 已被使用的索引集合(防止重复使用同一手牌)
  const cards = [];
  const indices = [];
  const used = new Set();

  // 记录每个槽位选取的手牌的序号, 并检查单独合法性与整体合法性
  for (let i = 0; i < order.slotCount; i++) {

    // 记录第 i 个槽位的 UI 选择值(字符串类型), 记作 idx
    const idx = uiState.selected[i];
    // 如果有槽位没有选牌, 返回 null
    if (idx === "" || idx === undefined || idx === null) return null;

    // 将字符串索引 idx 转换为序号 nIdx
    const nIdx = Number(idx);
    // 如果 used 中已有 nIdx, 说明一张牌被选择过超过一次, 返回 null
    if (used.has(nIdx)) return null;
    // 在 used 中加入 nIdx
    used.add(nIdx);

    // 根据 nIdx 在手牌中的对应位置找到卡牌 card
    const card = hand[nIdx];
    // 如果 card 不存在, 返回 null
    if (!card) return null;
    // 将卡牌 card 加入卡牌列 cards
    cards.push(card);
    // 将 nIdx 加入序号列 indices
    indices.push(nIdx);
  }

  // 返回卡牌列 cards 与序号列 indices
  return {
    cards,
    indices
  };
}





// =========================
// ===== SUBMIT ORDER ======
// =========================



// 根据订单序号 orderIndex 和 uiState 提交订单
function submitOrder(orderIndex, uiState) {

  // 根据订单序号 orderIndex 在订单列 orders 找到对应订单, 记作 order (正在被提交的订单)
  const order = orders[orderIndex];
  // 如果 order 不存在, 中止
  if (!order) return;
  // 根据 order 和 uiState 解析提交输入并检查合法性, 解析出的输入记作 input
  const input = resolveOrderInputs(order, uiState);
  // 如果 input 为 null, 中止
  if (!input) return;
  // 如果有任何槽位提交的卡牌数值不是需求的数值, 中止
  if (
      order.requirementCheck &&
      !order.requirementCheck({
        hand,
        orders,
        turn,
        state,
        cards: input.cards,
        indices: input.indices
      })
  ) return;

  // ⭐ 额外订单判定
    if (
        order.submitCheck &&
        !order.submitCheck({
          hand,
          orders,
          turn,
          state,
          cards: input.cards,
          indices: input.indices
        })
    ) return;

  // 到这个位置, 提交判定已经成功, 开始执行效果
  // 消耗提交的卡牌 (降序删)
  input.indices
    .sort((a,b)=>b-a)
    .forEach(i=>removeCard(i));
  // 在订单列中找到 orderIndex 对应的位置, 从那里开始删除1个订单
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

  emitEvent(
      "orderCompleted",
      { order }
  );

  // 渲染
  render();
}



// 根据卡牌序号 cardIndex 提交协会订单
function submitAssociationOrder(cardIndex) {

  // 根据卡牌序号 cardIndex 在手牌列 hand 找到对应手牌, 记作 card (正在用于提交的手牌)
  const card = hand[cardIndex];
  // 如果 card 不存在, 中止
  if (!card) return;
  // 将 card.value 记作 value
  const value = card.value;
  // 如果 value 的分母为1且分子等于协会订单的 requirement, 提交成功, 开始执行提交成功后的效果
  if (value.den === 1 && value.num === associationOrder.requirement) {
    // 触发协会订单的奖励效果
    associationOrder.rewardEffect();
    // 根据 cardIndex 在手牌中删除这张牌
    removeCard(cardIndex);
    // 立刻生成新的协会订单
    associationOrder = generateAssociationOrder();
  }
}
// =========================
// ===== GAME STATE ========
// =========================
// 这份文件记录了一局游戏开始时固有的数据. 包括:
// 数据(括号内为初始值): 回合数(0), 状态(包括是否跳过弃置药水牌(否), 营业评级(3), 资质奖章(0)), 订单列(空), 手牌列(空), 协会订单(null)
// 常量: 手牌上限14



// 初始回合数为0
let turn = 0;
// 初始状态: 不跳过弃置药水牌阶段, 营业评级为3, 资质奖章为0
const state = {
  skipPotionDiscard: false,
  rating: 3,
  medals: 0,
  ingredientGain: 2,
  startingIngredients: 3,
  gameResult: null,
};

// 初始状态: 订单列为空, 手牌列为空, 协会订单为 null
let orders = [];
let hand = [];
let associationOrder = null;
let currentLevel = null;

// 手牌上限为 14
const HAND_LIMIT = 14;
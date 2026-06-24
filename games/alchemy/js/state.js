// =========================
// ===== GAME STATE ========
// =========================

// 当前关卡
let currentLevel = null;

// 游戏结束标记
let gameOver = false;

// 局内状态
const state = {
  turn: 0,
  rating: 3,
  gameResult: null,
  skipPotionDiscard: false,

  reactor: {
    type: null,
    index: null
  },

  hand: [],
  orders: [],
  spells: [],
  associationOrder: null,

  ingredientGain: 0,
  startingIngredients: 0
};

// 手牌上限
const HAND_LIMIT = 14;
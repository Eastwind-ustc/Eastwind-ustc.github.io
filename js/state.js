// =========================
// ===== GAME STATE ========
// =========================

let turn = 0;
const state = {
  skipPotionDiscard: false,
  rating: 3,
  medals: 0
};

let orders = [];
let hand = [];
let associationOrder = null;

const HAND_LIMIT = 14;
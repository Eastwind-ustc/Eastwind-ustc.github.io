// =========================
// ===== HAND ==============
// =========================

function gainCard(card) {
  if (hand.length >= HAND_LIMIT) return;
  hand.push(card);
}

function removeCard(index) {
  hand.splice(index, 1);
}
// =========================
// ===== CARDS =============
// =========================

function generateHerbCard() {
  const suits = ["♥", "♦", "♠", "♣"];
  return {
    type: "药材",
    suit: suits[Math.floor(Math.random() * suits.length)],
    value: intToFrac(Math.floor(Math.random() * 13) + 1)
  };
}

function createPotionCard(value) {
  return {
    type: "药水",
    value: simplify(value)
  };
}
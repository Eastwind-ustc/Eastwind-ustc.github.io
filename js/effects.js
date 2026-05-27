// =========================
// ===== EFFECT ENGINE =====
// =========================

function applyEffect(result) {

  if (!result) return;

  switch (result.type) {

    case "gainCard":
      gainCard(result.card);
      break;

    case "removeCard":
      removeCard(result.index);
      break;

    case "modifyState":
      Object.assign(state, result.payload);
      break;

    case "spawnOrder":
      orders.push(result.order);
      break;
  }
}
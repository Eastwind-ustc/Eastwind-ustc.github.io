// =========================
// ===== UI BRIDGE =========
// =========================

function castFromUI(spellIndex) {

  const selects = document.querySelectorAll(
    `[data-spell="${spellIndex}"]`
  );

  const uiState = { selected: [] };

  selects.forEach(s => {
    uiState.selected.push(s.value);
  });

  castSpell(spellIndex, uiState);
}

function applyQualification(spellIndex) {

  const spell = spells[spellIndex];

  if (spell.unlocked) return;

  const n = spell.qualificationCost;

  if (state.medals < n) return;

  state.medals -= n;

  spell.unlocked = true;

  render();
}



// =========================
// ===== ORDER UI =========
// =========================
function submitOrderFromUI(orderIndex) {

  const selects = document.querySelectorAll(
    `[data-order="${orderIndex}"]`
  );

  const uiState = {
    selected:[]
  };

  selects.forEach(s=>{
    uiState.selected.push(s.value);
  });

  submitOrder(orderIndex, uiState);
}



//
function submitAssociationFromUI() {
  const sel = document.getElementById("associationSelect");
  const idx = sel.value;

  if (idx === "") return;

  submitAssociationOrder(Number(idx));
  render();
}



//
function selectCard(spellIndex, slotIndex, cardIndex) {

  if (!uiState.spellSelections) {
    uiState.spellSelections = {};
  }

  if (!uiState.spellSelections[spellIndex]) {
    uiState.spellSelections[spellIndex] = {};
  }

  uiState.spellSelections[spellIndex][slotIndex] = cardIndex;

  render();
}
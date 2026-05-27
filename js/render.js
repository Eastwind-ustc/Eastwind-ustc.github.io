// =========================
// ===== RENDER ============
// =========================

function render() {

  document.getElementById("turnInfo").innerText = `经营天数: ${turn}`;

document.getElementById("ratingDisplay").innerText =
  `营业评级: ${state.rating}  资质奖章: ${state.medals}`;

  renderOrders();
  renderHand();
  renderSpells();

  const status = document.getElementById("statusMessage");
  status.innerText =
    state.rating <= 0 ? "游戏失败" : "";

  // ✅ 新增：按钮状态控制
  const btn = document.getElementById("nextTurnBtn");

  btn.disabled = state.rating <= 0;

  if (state.rating <= 0) {
    btn.style.opacity = 0.5;
    btn.style.cursor = "not-allowed";
  } else {
    btn.style.opacity = 1;
    btn.style.cursor = "pointer";
  }
}

// -------------------------

function renderOrders() {

  const area = document.getElementById("orders");
  area.innerHTML = "";

// ===== 协会订单 =====
if (associationOrder) {

  const div = document.createElement("div");
  div.className = "order-card";

  let html = `
    <div><b>${associationOrder.name}</b></div>
    <div style="font-size:12px">目标: ${associationOrder.requirement}</div>
    <div style="font-size:12px">完成后或下一天开始时替换</div>
    <div style="font-size:12px">奖励: ${associationOrder.rewardDesc}</div>
    <br>
    <select id="associationSelect">
      <option value="">-</option>
  `;

  hand.forEach((c, idx) => {
    html += `
      <option value="${idx}">
        ${idx}: ${fracToString(c.value)}
      </option>
    `;
  });

  html += `
    </select>
    <button style="font-size:12px" onclick="submitAssociationFromUI()">
      提交协会订单
    </button>
  `;

  div.innerHTML = html;
  area.appendChild(div);
}

  orders.forEach((o, i) => {

    const div = document.createElement("div");
    div.className = "order-card";

    let html = `
      <div>${o.name}</div>
      <div style="font-size:12px">
        目标:
        ${
          o.potionRequirement
            .map(fracToString)
            .join(", ")
        }
      </div>
      <div style="font-size:12px">剩余: ${o.remainingTime}</div>
      <div style="font-size:12px">奖励: ${o.rewardDesc}</div>
      <br>
    `;

    // 提交槽
    o.potionRequirement.forEach((req, si)=>{

      html += `
        <select
          data-order="${i}"
          data-slot="${si}"
        >
          <option value="">-</option>
      `;

      hand.forEach((c, idx)=>{

        html += `
          <option value="${idx}">
            ${idx}: ${fracToString(c.value)}
          </option>
        `;
      });

      html += `</select>`;
    });

    html += `
      <button style="font-size:12px" onclick="submitOrderFromUI(${i})">
        提交
      </button>
    `;

    div.innerHTML = html;

    area.appendChild(div);
  });
}

// -------------------------

function renderHand() {

  const area = document.getElementById("hand");
  area.innerHTML = "";

  hand.forEach(card => {

    const div = document.createElement("div");

    div.className =
      (card.suit === "♥" || card.suit === "♦")
        ? "card red"
        : "card";

    div.innerHTML = `
      <div>${card.suit || "⚗"}</div>
      <div>${fracToString(card.value)}</div>
      <div style="font-size:12px">${card.type}</div>
    `;

    area.appendChild(div);
  });
}

// -------------------------

function renderSpells() {

  const area = document.getElementById("spells");
  area.innerHTML = "";

  spells.forEach((spell, i) => {

    let html = `
      <b>${spell.name}</b>
      <div style="font-size:12px">${spell.desc}</div>
    `;

    if (!spell.unlocked) {

  html += `
    <div style="font-size:12px; display:inline-block;">
      资质需求: ${spell.qualificationCost}
    </div>

    <button style="font-size:12px" onclick="applyQualification(${i})">
      资质申请
    </button>
  `;

} else {

  spell.slots.forEach((slot, si) => {

    html += `
      <select data-spell="${i}" data-slot="${si}">
        <option value="">-</option>
    `;

    hand.forEach((c, idx) => {
      html += `
        <option value="${idx}">
          ${idx}: ${fracToString(c.value)}
        </option>
      `;
    });

    html += `</select>`;
  });

  html += `
    <button style="font-size:12px" onclick="castFromUI(${i})">
      施放
    </button>
  `;
}

    const div = document.createElement("div");
    div.className = "spell-card";
    div.innerHTML = html;

    area.appendChild(div);
  });
}
// 渲染选卡界面
function renderSpellSelect() {

    const area =
        document.getElementById(
            "sceneRoot"
        );

    let html = `
    <h1>${currentLevel.name}</h1>
    
    <div style="margin-bottom:15px;">
        <button onclick="backToLevelSelect()">
            返回
        </button>
    </div>
    
    <div class="panel">
      <h2>可能出现的订单</h2>
    <div class="order-grid-preview">
  `;

    currentLevel.orderPool
        .forEach(id => {

            const order =
                ORDER_DATA.find(
                    o => o.id === id
                );

            if (!order) return;

            html += `
          <div class="order-card preview">
            <div><b>${order.name}</b></div>
            <div style="font-size:12px">需求: ${order.requirementDesc}</div>
            <div style="font-size:12px">时间期限: ${order.deadline}天</div>
            <div style="font-size:12px">奖励: ${order.rewardDesc}</div>
          </div>
        `;
        });

    html += `
      </div>
      <h2 style="margin-top:20px">选择法术</h2>
      <div id="spellSelectGrid" class="spell-grid">
    `;

    SPELL_DATA
        .filter(
            spell => spell.selectable
        )
        .forEach(spell => {
            const selected =
                metaState.selectedSpellIds
                    .includes(spell.id);

            html += `
                <div class="spell-card ${selected ? 'selected' : ''}">
                    <b>${spell.name}</b>
                    <div style="font-size:12px">${spell.desc}</div>
                    <div style="font-size:12px">资质需求:${spell.qualificationCost}</div>
                    <button onclick="toggleSpellSelect('${spell.id}')"
                            ${
                !selected &&
                metaState
                    .selectedSpellIds
                    .length >= 10
                    ? "disabled"
                    : ""
            }
                    >
                        ${selected ? "卸下" : "装配"}
                    </button>
                </div>
            `;
        });

    html += `
      </div>
      <div style="margin-top:20px;font-size:16px;">已选择: ${metaState.selectedSpellIds.length}/10</div>
      <button style="margin-top:15px;font-size:16px;" onclick="startGame()">
        开始游戏
      </button>
    </div>
    `;

    area.innerHTML = html;
}



// "返回" 按钮的实际效果
function backToLevelSelect(){
    currentScene = "level_select";
    render();
}



// 点击法术按钮的效果
function toggleSpellSelect(id) {
    const arr = metaState.selectedSpellIds;
    const idx = arr.indexOf(id);
    if (idx >= 0) {
        arr.splice(idx, 1);
    } else {
        if (arr.length >= 10)
            return;
        arr.push(id);
    }

    render();
}



// "开始游戏" 按钮的实际效果
function startGame() {
    // 根据关卡 Id 和法术 Id 创建游戏
    createGame(
        metaState.selectedLevelId,
        metaState.selectedSpellIds
    );
    // currentScene 切换到 "gameplay", 表示切换至打关界面
    currentScene = "gameplay";
    // 触发事件 "游戏开始"
    emitEvent("gameStart", {hand, orders, spells, turn, state});
    onGameEvent("gameStart", {hand, orders, spells, turn, state});
    // 渲染
    render();
    //
    startLevelScript(currentLevel.id);
    renderScriptOverlay();
}



// 渲染单张订单卡 ***
function renderOrderCard(order, mode = "battle") {

    const div = document.createElement("div");
    div.className = "order-card";
    let html = `
        <div><b>${order.name}</b></div>
        <div style="font-size:12px">需求: ${order.requirementDesc}</div>
    `;
    // 时间显示规则
    if (mode === "battle") {
        html += `
            <div style="font-size:12px">
                剩余时间: ${order.remainingTime}天
            </div>
        `;
    } else {
        html += `
            <div style="font-size:12px">
                时间期限: ${order.deadline}天
            </div>
        `;
    }
    html += `
        <div style="font-size:12px">
            奖励: ${order.rewardDesc}
        </div>
    `;
    // 槽位逻辑
    if (mode === "battle") {
        for (let si = 0; si < order.slotCount; si++) {
            html += `
                <select data-order="${order.index}" data-slot="${si}">
                    <option value="">-</option>
            `;
            hand.forEach((c, idx) => {
                const valueStr = fracToString(c.value);
                let label;
                if (c.type === "药水") {
                    label = `(${valueStr})`;
                } else {
                    label = `[${c.suit}${valueStr}]`;
                }
                html += `
                    <option value="${idx}">
                        ${label}
                    </option>
                `;
            });
            html += `</select>`;
        }
        html += `
            <button onclick="submitOrderFromUI(${order.index})">
                交付
            </button>
        `;
    }
    div.innerHTML = html;
    return div;
}



// 选卡界面渲染所有可能出现订单种类 ***
function renderSpellSelectOrders() {
    //
    const area = document.getElementById("ordersPreview");
    //
    if (!area) return;
    //
    area.innerHTML = "";
    // 对于本关订单池 currentLevel.orderPool 中每个订单种类
    currentLevel.orderPool.forEach(id => {
        //
        const order = ORDER_DATA.find(o => o.id === id);
        // 如果不存在这样的订单, 中止渲染
        if (!order) return;
        //
        const card = renderOrderCard(order, "preview");
        //
        area.appendChild(card);
    });
}

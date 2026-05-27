// 渲染打关页面
function renderGameplay() {

    const root =
        document.getElementById(
            "sceneRoot"
        );

    root.innerHTML = `
        <h1>炼金术师的店铺</h1>
        
        <div style="margin-bottom:15px;">
            <button id="abandonBtn">
                放弃本局
            </button>
            <button id="bgmToggleBtn">
                ${bgmEnabled ? "🔊 BGM: ON" : "🔇 BGM: OFF"}
            </button>
        </div>

        <div class="top-bar">
            <button id="nextTurnBtn">
                下一天
            </button>
            <span id="turnInfo"></span>
            <span id="ratingInfo"></span>
            <span id="medalInfo"></span>
        </div>

        <div class="game-board">
            <div class="panel">
                <h2>订单</h2>
                <div id="orders"></div>
            </div>
            <div class="panel">
                <h2>法术</h2>
                <div id="spells"></div>
            </div>
            <div class="panel">
                <h2>手牌</h2>
                <div id="hand"></div>
            </div>
        </div>

        <div id="statusMessage"></div>
    `;

    // 找到页面上的元素 "turnInfo", 把 "经营天数: turn" 显示进去
    document.getElementById("turnInfo").innerText = `经营天数: ${turn}`;
    // 找到页面上的元素 "ratingDisplay", 把 "营业评级: state.rating" 显示进去
    document.getElementById("ratingInfo").innerText = `营业评级: ${state.rating}`;
    // 找到页面上的元素 "ratingDisplay", 把 "资质奖章: state.medals" 显示进去
    document.getElementById("medalInfo").innerText = `资质奖章:${state.medals}`;

    // 分别渲染订单, 手牌, 法术三部分
    renderOrders();
    renderHand();
    renderSpells();

    // 从网页中找到 id 为 "statusMessage" 的元素, 并保存到变量 status
    const status = document.getElementById("statusMessage");
    // 如果 status.rating 不大于 0, 就显示 "游戏失败"
    if (state.rating <= 0) status.innerText = "游戏失败";
    // 放弃按钮
    document.getElementById("abandonBtn").onclick = abandonGame;
    // 音乐切换按钮
    document.getElementById("bgmToggleBtn").onclick = toggleBGM;
    // 在网页中找到 id 为 "nextTurnBtn" 的按钮，并保存到变量 btn
    const btn = document.getElementById("nextTurnBtn");
    btn.onclick = nextTurn;
    // 如果 status.rating 不大于 0, 就让按钮不可用, 让按钮变灰, 让鼠标在按钮上方悬停时变为禁止符号
    if (state.rating <= 0) {
        btn.disabled = true;
        btn.style.opacity = 0.5;
        btn.style.cursor = "not-allowed";
    } else {
        btn.disabled = false;
        btn.style.opacity = 1;
        btn.style.cursor = "pointer";
    }
}



// 渲染订单部分
function renderOrders() {

    // 从 HTML 中找到 id 为 "orders" 的元素，并存到变量 area
    const area = document.getElementById("orders");
    // 清空 area 内部的内容
    area.innerHTML = "";

    // 渲染协会订单部分
    // 如果协会订单存在才渲染, 否则不渲染
    if (associationOrder) {
        // 创建容器 div
        const div = document.createElement("div");
        // div 类名为 "order-card"
        div.className = "order-card";
        // 开始拼字符串 html
        // 显示协会订单名称 "协会订单"
        // 显示协会订单需求
        // 显示协会订单特性 "完成后或下一天开始时替换"
        // 显示协会订单奖励描述
        // 创建下拉框
        // 加入默认空选项
        let html = `
            <div><b>${associationOrder.name}</b></div>
            <div style="font-size:12px">需求: 药水(${associationOrder.requirement}).</div>
            <div style="font-size:12px">完成后或下一天开始时替换.</div>
            <div style="font-size:12px">奖励: ${associationOrder.rewardDesc}</div>
            <select id="associationSelect">
                <option value="">-</option>
        `;
        // 对于每张手牌, 为其创建一个选项
        hand.forEach((c, idx) => {
            // 选项框显示 $卡牌序号: $卡牌数值
            const valueStr = fracToString(c.value);
            let label;
            if (c.type === "药水") {
                label = `(${valueStr})`;
            } else {
                label = `[${c.suit}${valueStr}]`;
            }

            html += `
                <option value="${idx}">${label}</option>
            `;
        });
        // 完成下拉框
        // 创建交付按钮
        html += `
            </select>
            <button style="font-size:12px" onclick="submitAssociationFromUI()">
                交付
            </button>
        `;
        // 将字符转 html 转化为容器 div 中的 DOM 对象
        div.innerHTML = html;
        // 把容器 div 挂到区域 area 里面
        area.appendChild(div);
    }

    // 渲染每个订单
    orders.forEach((o, i) => {
        // 创建容器 div
        const div = document.createElement("div");
        // div 类名为 "order-card"
        div.className = "order-card";
        // 开始拼 html 字符串
        // 显示订单名称
        // 显示订单需求
        // 显示订单剩余时间
        // 显示订单奖励描述
        let html = `
            <div>${o.name}</div>
            <div style="font-size:12px">需求:${o.requirementDesc}</div>
            <div style="font-size:12px">剩余时间: ${o.remainingTime}天.</div>
            <div style="font-size:12px">奖励: ${o.rewardDesc}</div>
        `;
        // 为每个槽位创建一个提交框
        for (let si = 0; si < o.slotCount; si++) {
            html += `
                <select data-order="${i}" data-slot="${si}">
                    <option value="">-</option>
            `;
            // 对于每张手牌, 创建一个选项
            hand.forEach((c, idx) => {
                const valueStr = fracToString(c.value);
                let label;
                if (c.type === "药水") {
                    label = `(${valueStr})`;
                } else {
                    label = `[${c.suit}${valueStr}]`;
                }

                html += `
                    <option value="${idx}">${label}</option>
                `;
            });
            // 完成下拉框
            html += `</select>`;
        }

        // 创建交付订单按钮
        html += `
            <button style="font-size:12px" onclick="submitOrderFromUI(${i})">
            交付
            </button>
        `;
        // 将字符转 html 转化为容器 div 中的 DOM 对象
        div.innerHTML = html;
        // 把容器 div 挂到区域 area 里面
        area.appendChild(div);
    });
}



// 渲染法术部分
function renderSpells() {
    // 从 HTML 中找到 id 为 "spells" 的元素，并存到变量 area
    const area = document.getElementById("spells");
    // 清空 area 内部的内容
    area.innerHTML = "";

    // 对于每个法术
    spells.forEach((spell, i) => {

        const desc =
            spell.descFn
                ? spell.descFn(spell)
                : spell.desc;

        let html = `
            <b>${spell.name}</b>
            <div style="font-size:12px">${desc}</div>
        `;

        if (!spell.unlocked) {
            html += `
                <div style="font-size:12px; display:inline-block;">激活消耗: ${spell.qualificationCost}</div>
                <button style="font-size:12px" onclick="applyQualification(${i})">激活</button>
            `;
        } else {
            // 对于每个槽位, 建立下拉框
            spell.slots.forEach((slot, si) => {
                html += `
                    <select data-spell="${i}" data-slot="${si}">
                        <option value="">${slot.display}</option>
                `;
                // 对于每张手牌, 创建选项
                hand.forEach((c, idx) => {
                    const valueStr = fracToString(c.value);
                    let label;
                    if (c.type === "药水") {
                        label = `(${valueStr})`;
                    } else {
                        label = `[${c.suit}${valueStr}]`;
                    }

                    html += `
                        <option value="${idx}">${label}</option>
                    `;
                });
                html += `</select>`;
            });

            const coolingDown =
                spell.castsPerTurn >= 0 &&
                spell.castsUsed >= spell.castsPerTurn;
            // 施放按钮
            html += `
                <button style="font-size:12px" onclick="${coolingDown ? "" : `castFromUI(${i})`}" ${coolingDown ? "disabled" : ""}>
                    ${coolingDown ? "冷却中" : "施放"}
                </button>
            `;
        }

        const div = document.createElement("div");
        div.className = "spell-card";
        div.innerHTML = html;

        area.appendChild(div);
    });
}



// 渲染手牌部分
function renderHand() {

    const area = document.getElementById("hand");
    area.innerHTML = "";

    hand.forEach(card => {

        const div = document.createElement("div");

        let colorClass = "";

        if (card.type === "药水") {
            colorClass = "green";
        } else if (card.suit === "♥") {
            colorClass = "red";
        } else if (card.suit === "♦") {
            colorClass = "orange";
        } else if (card.suit === "♠") {
            colorClass = "black";
        } else if (card.suit === "♣") {
            colorClass = "blue";
        }

        div.className = `card ${colorClass}`;

        const valueText =
            card.type === "药水"
                ? `(${fracToString(card.value)})`
                : `[${fracToString(card.value)}]`;

        div.innerHTML = `
      <div class="card-name">${getCardName(card)}</div>
      <div class="card-value">${valueText}</div>
      <div class="card-type">${getScenticType(card)}</div>
    `;

        area.appendChild(div);
    });
}
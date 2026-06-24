// =========================
// ==== RENDER GAMEPLAY ====
// =========================
// 这份文件含有关于渲染游玩界面的函数. 包括:
// 渲染整个游玩界面
// 渲染订单区, 反应台区, 法术区, 手牌区
// 设置反应台区的 state, 以及根据 state 分情况渲染反应台区
// "返回" "开始游戏" 按钮的实际效果



// 渲染打关页面
function renderGameplay() {
    // 从 HTML 中找到 id 为 "sceneRoot" 的元素，并存到变量 root
    const root = document.getElementById("sceneRoot");
    // 开始注入 innerHTML
    // 左上角: "下一天" 按钮, 回合数, 评级分, 奖章数等
    // 右上角: 关卡名, "结束本局游戏" 按钮
    // 游戏棋盘: 订单区, 反应台区, 法术区
    // 手牌区
    // 结算区
    root.innerHTML = `
        <div class="top-bar">
            <div class="top-bar-left">
                <button id="nextTurnBtn">
                    下一天
                </button>
                <span id="turnInfo"></span>
                <span id="ratingInfo"></span>
                <span id="medalInfo"></span>
            </div>
            <div class="top-bar-right">
                <h1 id="levelTitle">${currentLevel.name}</h1>
                <button id="abandonBtn">
                    结束本局游戏
                </button>
                <!--
                <button id="bgmToggleBtn">
                    ${1 ? "🔊 BGM: ON" : "🔇 BGM: OFF"}
                </button>
                -->
            </div>
        </div>

        <div class="game-board">
            <div class="orders-panel panel">
                <h2>订单</h2>
                <div id="orders"></div>
            </div>
            <div class="reactor-panel panel">
                <h2>反应台</h2>
                <div id="reactor"></div>
            </div>
            <div class="spells-panel panel">
                <h2>法术</h2>
                <div id="spells"></div>
            </div>
        </div>
        
        <div class="panel hand-panel">
            <div id="hand"></div>
        </div>

        <div id="statusMessage" class="status-message"></div>
    `;

    // 找到页面上的元素 "turnInfo", 把 "经营天数: turn" 显示进去
    document.getElementById("turnInfo").innerText = `📅: ${state.turn}`;
    // 找到页面上的元素 "ratingDisplay", 把 "营业评级: state.rating" 显示进去
    document.getElementById("ratingInfo").innerText = `⭐: ${state.rating}`;
    // 找到页面上的元素 "ratingDisplay", 把 "资质奖章: state.medals" 显示进去
    document.getElementById("medalInfo").innerText = `🎖️:${state.medals}`;

    // 分别渲染订单, 反应台, 法术三部分
    renderOrders();
    renderReactor();
    renderSpells();
    // 渲染手牌
    renderHand();

    // 从网页中找到 id 为 "statusMessage" 的元素, 并保存到变量 status
    const status = document.getElementById("statusMessage");
    // 显示游戏结束信息
    status.innerText = "";
    if (state.gameResult === "defeat") status.innerText = "游戏失败...";
    if (state.gameResult === "victory") {
        status.innerHTML = `
        游戏胜利!
        <div style="margin-top:10px">
            <button onclick="goSettlement()">
                结算
            </button>
        </div>
    `;
    }
    // 放弃按钮
    document.getElementById("abandonBtn").onclick = abandonGame;
    // 音乐切换按钮
    // document.getElementById("bgmToggleBtn").onclick = toggleBGM;
    // 在网页中找到 id 为 "nextTurnBtn" 的按钮，并保存到变量 btn
    const btn = document.getElementById("nextTurnBtn");
    // btn 的效果为触发函数 nextTurn
    btn.onclick = nextTurn;
    // 如果 status.rating 不大于 0, 就让按钮不可用, 让按钮变灰, 让鼠标在按钮上方悬停时变为禁止符号
    if (gameOver) {
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
    if (state.associationOrder) {
        // 创建容器 div
        const div = document.createElement("div");
        // div 类名为 "order-card"
        div.className = "order-card";
        // 开始注入 html
        // 显示协会订单名称 "协会订单"
        // 显示协会订单需求
        // 显示协会订单特性 "完成后或下一天替换"
        // 显示协会订单报酬描述
        // 创建下拉框
        // 加入默认空选项
        let html = `
            <div><b>${state.associationOrder.name}</b></div>
            <div style="font-size:12px">需求: 药水(${state.associationOrder.requirement}).</div>
            <div style="font-size:12px">完成后或下一天替换.</div>
            <div style="font-size:12px">报酬: ${state.associationOrder.rewardDesc}</div>
            <select id="associationSelect">
                <option value="">-</option>
        `;
        // 对于每张手牌, 为其创建一个选项
        state.hand.forEach((c, idx) => {
            // 选项框显示 $卡牌序号: $卡牌数值
            const valueStr = fracToString(c.value);
            // 定义变量 label, 表示在选项卡中显示的文本
            let label;
            // 药水牌用圆括号表示
            if (c.type === "药水") label = `(${valueStr})`;
            // 原料牌用方括号表示, 并带有花色
            else label = `[${c.suit}${valueStr}]`;
            // 继续注入 html, 创建选项卡并填入文本
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
    // 对于每个订单 o 及其在订单列中的序号 i
    state.orders.forEach((o, i) => {
        o.index = i;
        const card = renderOrderCard(o, "panel");
        document.getElementById("orders").appendChild(card);
    });
}



// 渲染反应台
function renderReactor() {
    // ***
    const area = document.getElementById("reactor");
    area.innerHTML = "";
    // 如果反应台状态不存在, 中止
    if (!state.reactor) return;
    // 法术模式
    if (state.reactor.type === "spell") {
        // 在法术列 spells 中通过反应台状态的 index 找到法术 spell
        const spell = state.spells[state.reactor.index];
        // 如果 spell 不存在, 中止
        if (!spell) return;
        // 渲染反应台模式下的法术卡
        const card = renderSpellCard(spell, state.reactor.index, "reactor");
        // 注入 html
        area.appendChild(card);
    }
    // 订单模式
    else if (state.reactor.type === "order") {
        // 在订单列 orders 中通过反应台状态的 index 找到订单 order
        const order = state.orders[state.reactor.index];
        // 如果 order 不存在, 中止
        if (!order) return;
        // 渲染反应台模式下的订单卡
        const card =renderOrderCard(order,"reactor");
        // 注入 html
        area.appendChild(card);
    }
}



// 反应台订单模式
function showOrderInReactor(orderIndex) {
    // 将反应台状态设置为 {订单, orderIndex}
    state.reactor = {
        type: "order",
        index: orderIndex
    };
    // 渲染
    render();
}



// 反应台法术模式
function showSpellInReactor(spellIndex) {
    // 将反应台状态设置为 {法术, spellIndex}
    state.reactor = {
        type: "spell",
        index: spellIndex
    };
    // 渲染
    render();
}



// 渲染法术区 ***
function renderSpells() {
    // ***
    const area = document.getElementById("spells");
    area.innerHTML = "";
    // 对于每个法术
    state.spells.forEach((spell, i) => {
        //
        const card = renderSpellCard(spell, i, "panel");
        //
        area.appendChild(card);
    });
}



// 渲染手牌部分
function renderHand() {
    //
    const area = document.getElementById("hand");
    area.innerHTML = "";

    state.hand.forEach(card => {

        const div = document.createElement("div");

        let colorClass = "";

        if (card.type === "药水") {
            colorClass = "grey";
        } else if (card.suit === "♥") {
            colorClass = "red";
        } else if (card.suit === "♦") {
            colorClass = "orange";
        } else if (card.suit === "♠") {
            colorClass = "blue";
        } else if (card.suit === "♣") {
            colorClass = "green";
        }

        div.className = `card ${colorClass}`;

        const valueText =
            card.type === "药水"
                ? `(${fracToString(card.value)})`
                : `[${card.suit}${fracToString(card.value)}]`;

        div.innerHTML = `
      <div class="card-name">${getCardName(card)}</div>
      <div class="card-value">${valueText}</div>
      <div class="card-type">${getScenticType(card)}</div>
    `;

        area.appendChild(div);
    });
}



// 放弃单局游戏
function abandonGame() {
    clearSave();
    currentScene = "level_select";
    currentLevel = null;
    render();
}



// 进入结算界面
function goSettlement() {

    currentScene = "settlement";

    render();
}
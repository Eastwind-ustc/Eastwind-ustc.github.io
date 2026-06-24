// =========================
// == RENDER SPELL SELECT ==
// =========================
// 这份文件含有关于渲染法术选择界面的函数. 包括:
// 渲染整个法术选择界面
// 每个法术 "装配/卸下" 按钮的实际效果
// "返回" "开始游戏" 按钮的实际效果


// 渲染选卡界面 ***
function renderSpellSelect() {
    // ***
    const area = document.getElementById("sceneRoot");
    // 开始注入 html
    // 大标题: 关卡名
    area.innerHTML = `
        <h1>${currentLevel.name}</h1>
        <div style="margin-bottom:15px;">
            <button onclick="backToLevelSelect()">
                返回
            </button>
        </div>
        <div class="panel">
            <h2>可能出现的订单</h2>
            <div id="orderPreviewGrid" class="order-grid-preview"></div>
                <h2 style="margin-top:20px">选择法术</h2>
            <div id="spellSelectGrid" class="spell-grid"></div>
            <div id="spellSelectCount" style="margin-top:20px;font-size:16px;"></div>
            <button style="margin-top:15px;font-size:16px;" onclick="startGame()">
                开始游戏
            </button>
        </div>
    `;

    // 渲染订单预览
    const orderGrid =document.getElementById("orderPreviewGrid");
    //
    currentLevel.orderPool
        .forEach(id => {
            //
            const order = ORDER_DATA.find(o => o.id === id);
            //
            if (!order) return;
            //
            const card = renderOrderCard(order,"preview");
            //
            orderGrid.appendChild(card);
        });

    // 渲染法术选择
    // ***
    const spellGrid = document.getElementById("spellSelectGrid");
    spellGrid.innerHTML = "";
    // 对于所有可选法术
    SPELL_DATA
        // 筛选出
        .filter(spell => spell.selectable)
        .forEach(spell => {

            const selected = metaState.selectedSpellIds.includes(spell.id);

            const card = renderSpellCard(spell,0,"select");
            // 如果 renderSpellCard 内部不处理 selected 样式，需要额外加 class
            if (selected) {card.classList.add("selected");}

            spellGrid.appendChild(card);
        });

    // 已装配数量
    document.getElementById("spellSelectCount").innerText = `已装配: ${metaState.selectedSpellIds.length}/${metaState.selectedSpellsLimit}`;
}



// "返回" 按钮的实际效果
function backToLevelSelect(){
    // 切换至关卡选择界面
    currentScene = "level_select";
    // 渲染
    render();
}



// 点击法术按钮的效果
function toggleSpellSelect(id) {
    // 记已选择法术列为 arr
    const arr = metaState.selectedSpellIds;
    // 查找该法术 id 是否已经在 arr 中, 用 idx 表示结果
    const idx = arr.indexOf(id);
    // 如果该法术已经选中
    if (idx >= 0) {
        // 从 arr 中删除该法术的 id, 表示取消选中
        arr.splice(idx, 1);
    }
    // 如果该法术未被选中
    else {
        // 如果已选法术达到上限, 终止
        if (arr.length >= metaState.selectedSpellsLimit) return;
        // 否则将该法术的 id 加入 arr
        arr.push(id);
    }
    // 渲染
    render();
}



// "开始游戏" 按钮的实际效果
function startGame() {
    // 根据关卡 Id 和法术 Id 创建游戏
    createGame(
        metaState.selectedLevelId,
        metaState.selectedSpellIds
    );
    // currentScene 切换到 "gameplay", 表示切换至游玩界面
    currentScene = "gameplay";
    // 触发事件 "游戏开始"
    emitEvent("gameStart", {state});
    onGameEvent("gameStart", {state});
    // 保存游戏
    saveGame();
    // 渲染
    render();
    // 启动关卡 id 对应的对话脚本
    startLevelScript(currentLevel.id);
    // 渲染对话脚本
    renderScriptOverlay();
}



// 分模式渲染订单卡
function renderOrderCard(order, mode = "panel") {
    // 创建元素 div
    const div = document.createElement("div");
    // 类名: order-card
    div.className = "order-card";
    // 预览模式下, 类名添加 preview
    if (mode === "preview") div.classList.add("preview");
    // 公共信息: 订单名, 需求
    let html = `
        <div><b>${order.name}</b></div>
        <div style="font-size:12px">需求: ${order.requirementDesc}</div>
    `;
    // 预览模式显示期限, 订单区模式与反应台模式显示剩余时间
    if (mode === "reactor" || mode === "panel") {
        html += `<div style="font-size:12px">剩余: ${order.remainingTime}天</div>`;
    } else if (mode === "preview") {
        html += `<div style="font-size:12px">期限: ${order.deadline}天</div>`;
    }
    // 公共信息: 报酬
    html += `<div style="font-size:12px">报酬: ${order.rewardDesc}</div>`;
    // 订单区模式, 交付按钮功能为将反应台状态切换到该订单
    if (mode === "panel") {
        html += `<button onclick="showOrderInReactor(${order.index})">交付</button>`;
    }
    // 反应台模式, 显示槽位与提交按钮
    else if (mode === "reactor") {
        // 对于每个槽位
        for (let si = 0; si < order.slotCount; si++) {
            html += `<select data-order="${order.index}" data-slot="${si}">
                        <option value="">-</option>`;
            // 对于每张手牌, 创建选项卡
            state.hand.forEach((c, idx) => {
                const valueStr = fracToString(c.value);
                const label = c.type === "药水" ? `(${valueStr})` : `[${c.suit}${valueStr}]`;
                html += `<option value="${idx}">${label}</option>`;
            });
            html += `</select>`;
        }
        // 创建交付按钮
        html += `<button onclick="submitOrderFromUI(${order.index})">交付</button>`;
    }
    // 注入 html
    div.innerHTML = html;
    // 返回元素 div
    return div;
}



// 分模式渲染法术卡
function renderSpellCard(spell, i, mode = "panel") {
    // 创建元素 div
    const div = document.createElement( "div" );
    // 如果 spell 有施放次数限制且施放次数不小于施放次数限制, 冷却 coolingDown 为真
    const coolingDown = spell.castsPerTurn >= 0 && spell.castsUsed >= spell.castsPerTurn;
    // 如果不是选卡模式, 且 spell 未解锁或处于冷却, 灰色 greyed 为真
    const greyed = mode !== "select" && ( !spell.unlocked || coolingDown );
    // 如果 greyed 为真, 类名为 spell-card spell-disabled, 否则为 spell-card
    div.className = greyed ? "spell-card spell-disabled" : "spell-card";
    // 如果 spell 有可变描述, 描述 desc 为 descFn(spell) , 否则为 desc
    const desc = spell.descFn ? spell.descFn(spell) : spell.desc;

    // 开始注入 html
    // 公共信息: 法术名 (选卡模式下同一行显示奖章消耗) , 法术描述
    let html = `
        <div class="spell-header">
            <b>${spell.name}</b>
            ${mode === "select" ? `<span class="spell-cost">${spell.qualificationCost}🎖️</span>` : ""}
        </div>
        <div style="font-size:12px">${desc}</div>
    `;
    // 选卡模式
    if (mode === "select") {
        // 添加只读槽位
        html += renderSpellSlots(spell, i, "readonly");
        // 如果选中法术列 selectedSpellIds 包含 spell.id, 就说明 spell 此时被选中, 记作 selected
        const selected =metaState.selectedSpellIds.includes(spell.id);
        // 对于选中法术, CSS 类名添加 selected
        if (selected) div.classList.add("selected");
        // 点击整个卡片
        div.onclick = () => {
            // 如果 spell 已选中且已选法术数量达到法术装配上限 , 中止
            if (!selected && metaState.selectedSpellIds.length >= metaState.selectedSpellsLimit) return;
            // 否则, 切换 spell 的选中与否状态
            toggleSpellSelect(spell.id);
        };
    }
    // 法术区模式
    else if (mode === "panel") {
        // 添加只读槽位
        html += renderSpellSlots(spell, i, "readonly");
        // 如果法术未解锁
        if (!spell.unlocked) {
            // 添加激活按钮
            // 显示消耗数量与奖章图案, 点击后调用 applyQualification 函数
            html += `
                <button style="font-size:12px" onclick="applyQualification(${i})">
                    ${spell.qualificationCost}🎖️
                </button>
            `;
        }
        // 如果法术已解锁
        else {
            // 添加施放按钮
            // 冷却状态下无效果; 非冷却状态下调用 showSpellInReactor 函数
            // 冷却状态下不可用; 非冷却状态下可用
            // 冷却状态下显示 "冷却中" ; 非冷却状态下显示 "施放"
            html += `
                <button 
                style="font-size:12px" 
                onclick="${coolingDown ? "" : `showSpellInReactor(${i})`}" 
                ${coolingDown ? "disabled" : ""}>
                    ${coolingDown ? "冷却中" : "施放"}
                </button>
            `;
        }
    }
    // 反应台模式
    else if (mode === "reactor") {
        // 添加可交互槽位
        html += renderSpellSlots(spell, i, "reactor");
        // 添加施放按钮
        // 冷却状态下无效果; 非冷却状态下调用 castFromUI 函数
        // 冷却状态下不可用; 非冷却状态下可用
        // 冷却状态下显示 "冷却中" ; 非冷却状态下显示 "施放"
        html += `
        <button
            style="font-size:12px"
            onclick="${coolingDown ? "" : `castFromUI(${i})`}"
            ${coolingDown ? "disabled" : ""}>
            ${coolingDown ? "冷却中" : "施放" }
        </button>
    `;
    }
    // 注入 html
    div.innerHTML = html;
    // 返回元素 div
    return div;
}



// 渲染法术卡槽位***
function renderSpellSlots(spell, i, mode) {

    const slotDisplays = spell.slotDisplay || [];

    let html = "";
    // 对于每个槽位的显示文本
    slotDisplays.forEach((display, si) => {
        // 反应台模式下, 槽位可交互
        if (mode === "reactor") {

            html += `
                <select data-spell="${i}" data-slot="${si}">
                    <option value="">${display}</option>
            `;
            // 对于每张手牌
            state.hand.forEach((c, idx) => {
                const valueStr = fracToString(c.value);
                const label = c.type === "药水"
                    ? `(${valueStr})`
                    : `[${c.suit}${valueStr}]`;

                html += `<option value="${idx}">${label}</option>`;
            });

            html += `</select>`;
        }
        // 只读模式下, 槽位不可交互
        else {
            html += `
                <div class="spell-slot readonly">
                    ${display}
                </div>
            `;
        }
    });

    return html;
}
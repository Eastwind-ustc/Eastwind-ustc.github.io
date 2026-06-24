const shopSlots = [];



// 初始化装备池
function initEquipmentPool() {
    // 清空装备池
    equipmentPool = [];
    // 对于每个装备类型 type
    for (const type of Object.values(EQUIPMENT_TYPES)) {
        // 初始化 count 为 0
        let count = 0;
        // 根据 type.level 决定 type 在池子中的初始数量
        if (type.level === 5) count = 7;
        else if (type.level === 4) count = 9;
        else if (type.level === 3) count = 11;
        else if (type.level === 2) count = 13;
        else if (type.level === 1) count = 15;
        // 将 count 个 type 加入装备池 equipmentPool 中
        for (let i = 0; i < count; i++) {
            equipmentPool.push(type);
        }
    }
}



// 刷新商店
function initShop() {

    const slots = document.querySelectorAll(".shop-slot");

    // shopSlots.length = 0;

    const n = shopSlotsUnlocked;

    // ✔ Step 1：把旧商店装备放回池子
    for (let i = 0; i < n; i++) {

        const eq = shopSlots[i];

        if (eq) {
            equipmentPool.push(eq.type);
        }
    }

    // ✔ Step 2：填充新商店
    for (let i = 0; i < slots.length; i++) {

        const dom = slots[i];

        if (i < n) {

            if (equipmentPool.length === 0) {
                renderEmptyShopSlot(dom);
                shopSlots[i] = null;
                continue;
            }

            // ✔ 无放回抽取
            const idx =
                Math.floor(Math.random() * equipmentPool.length);

            const type =
                equipmentPool.splice(idx, 1)[0];

            const equipment =
                createEquipment(type);

            shopSlots[i] = equipment;

            renderShopSlot(dom, equipment);

        } else {

            shopSlots[i] = null;
            renderEmptyShopSlot(dom);
        }
    }
}



function renderShopSlot(dom, equipment) {

    //
    dom.style.background = "#ffffff";
    //
    dom.style.borderColor = "transparent";

    dom.style.borderColor =
        EQUIPMENT_SET_COLOR[equipment.type.set];

    dom.textContent =
        `${equipment.type.name}\n` +
        `攻击力: ${equipment.currentAttack}\n` +
        `次数: ${equipment.remainingUsesThisTurn}/${equipment.currentUsesPerTurn}`;
}



function renderEmptyShopSlot(dom) {

    dom.textContent = "";

    dom.style.background = "#e0e0e0";   // 灰色表示未解锁
    dom.style.borderColor = "#999";
}
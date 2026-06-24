document.addEventListener(
    "mousedown",
    handleMouseDown
);



// 处理鼠标点击
function handleMouseDown(event) {

    console.log("点击前游戏状态: " + gameStateMode);

    console.log("点击到了 " + event.target.id);

    switch (gameStateMode) {

        case "idle":
            handleIdleStateClick(event);
            break;

        case "equipmentReady":
            handleEquipmentReadyStateClick(event);
            break;

        case "shopReady":
            handleShopReadyStateClick(event);
            break;

        case "upgradeReady":
            handleUpgradeReadyStateClick(event);
            break;

        case "sellReady":
            handleSellReadyStateClick(event);
            break;
    }

    // 刷新装备面板
    refreshEquipmentPanel();

    console.log("点击后游戏状态: " + gameStateMode);

    console.log("----------------");
}



function handleIdleStateClick(event) {

    // console.log("idle");

    const slot = event.target.closest(".equipment-slot");

    if (!slot) {console.log("idle 状态下, 点击到的不是装备槽位"); return;} //

    const index = Number(slot.dataset.index);

    console.log("点击到的装备序号为: " + index);

    const equipment = equipments[index];

    if (!equipment) {console.log("idle 状态下点击装备槽, 没有找到装备"); return;} //

    if (equipment.remainingUsesThisTurn <= 0) {return;}

    if (equipment.type.targeting === "none") {
        selectedEquipment = equipment;
        activateSelectedEquipment();
        selectedEquipment = null;
        gameStateMode = "idle";
        return;
    }

    selectedEquipment = equipment;

    gameStateMode = "equipmentReady";

    refreshEquipmentPanel();
}



function handleEquipmentReadyStateClick(event) {

    const boardCell = event.target.closest(".cell");

    if(boardCell) console.log("点击到的棋盘格为:" + boardCell.dataset.x + "," + boardCell.dataset.y); //

    const equipmentSlot = event.target.closest(".equipment-slot");

    if(equipmentSlot) console.log("点击到的装备序号为: " + equipmentSlot.dataset.index); //

    // =========================
    // 情况1：点击棋盘格
    // =========================
    if (boardCell) {

        if (selectedEquipment.type.targeting === "grid") {

            const x = Number(boardCell.dataset.x);
            const y = Number(boardCell.dataset.y);

            activateSelectedEquipment(x, y);

        } else {

            selectedEquipment = null;
            gameStateMode = "idle";
        }

        return;
    }

    // =========================
    // 情况2：点击装备槽
    // =========================
    if (equipmentSlot) {

        const index =
            Number(equipmentSlot.dataset.index);

        const targetEquipment =
            equipments[index];

        if (!targetEquipment) {
            selectedEquipment = null;
            gameStateMode = "idle";
            return;
        }

        if (selectedEquipment.type.targeting === "equipment") {

            activateSelectedEquipment(targetEquipment);

        } else {

            selectedEquipment = null;
            gameStateMode = "idle";
        }

        return;
    }

    // =========================
    // 情况3：其他区域
    // =========================
    selectedEquipment = null;
    gameStateMode = "idle";
}

function handleShopReadyStateClick(event) {
    console.log("shopReady");
}

function handleUpgradeReadyStateClick(event) {
    console.log("upgradeReady");
}

function handleSellReadyStateClick(event) {
    console.log("sellReady");
}
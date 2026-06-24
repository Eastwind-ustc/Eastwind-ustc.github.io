// 创建装备实体
function createEquipment(type) {
    // 复制 type, 通过 type 获得当前攻击力, 并初始化可用状态
    return {
        type: type,
        currentAttack: type.attack,
        currentUsesPerTurn: type.usesPerTurn,
        remainingUsesThisTurn: type.usesPerTurn,
        star: 1,
        currentDismantleGain: type.dismantleGain,
    };
}



// 同步更新 UI 的 slot
function refreshEquipmentPanel() {
    // 从 HTML 中找到所有 class 为 "equipment-slot" 的元素，并存到 NodeList root
    const slots = document.querySelectorAll(".equipment-slot");
    // 在 slots 中, i 从 0 遍历到 slots.length-1
    // 现在开始根据 equipments[i] 的信息, 更新第 i 个装备槽的 UI
    for (let i = 0; i < slots.length; i++) {
        // 记 slots 的第 i 个元素为 slot
        const slot = slots[i];

        //
        slot.dataset.index = i;

        // 清除 slot 的点击功能
        slot.onclick = null;
        // 记 equipments[i] 为 equipment
        const equipment = equipments[i];
        // ***
        slot.classList.remove("selected", "disabled");
        // 装备槽底色默认为白色 (空装备槽)
        slot.style.background = EQUIPMENT_SET_COLOR.null;
        // 如果 equipment 不存在
        if (!equipment) {
            // 装备文本内容为空
            slot.textContent = "";
            // 装备槽底色 ***
            slot.style.background = "#ffffff";
            // 装备槽边界颜色 ***
            slot.style.borderColor = "transparent";
            // 继续
            continue;
        }
        // 为 slot 绑定点击效果
        /*
        slot.onclick = () => {
            // 如果 selectedEquipment 存在, 即有装备被选中
            if (selectedEquipment) {
                // 如果选中装备以装备为目标
                if (canTargetEquipment(selectedEquipment)) {
                    // 对 equipment 执行选中装备的效果
                    onEquipmentClicked(equipment);
                }
                return;
            }
            // 如果 equipment
            if (equipment.remainingUsesThisTurn <= 0) {
                return;
            }
            selectEquipment(equipment);
        };

         */

        // ⭐ 有装备：设置对应颜色
        slot.style.background = EQUIPMENT_SET_COLOR[equipment.type.set];

        let text =
            `${equipment.type.name}
            攻击力: ${equipment.currentAttack}
            次数: ${equipment.remainingUsesThisTurn}/${equipment.currentUsesPerTurn}`;

        if (
            equipment === selectedEquipment
        ) {
            slot.classList.add(
                "selected"
            );
        }

        if (
            equipment.remainingUsesThisTurn <= 0
        ) {
            slot.classList.add(
                "disabled"
            );
        }

        slot.textContent = text;

        slot.style.background =
            equipment.remainingUsesThisTurn <= 0 ? "#e9e9e9" : "#ffffff";

        slot.style.borderColor =
            EQUIPMENT_SET_COLOR[equipment.type.set];
    }
}



// 选中装备
function selectEquipment(equipment) {
    // 游戏状态切换
    gameStateMode = "equipmentReady";
    // 选中装备设置为 equipment
    selectedEquipment = equipment;
    // 如果 equipment 的目标类型是 none
    if (equipment.type.targeting === "none") {
        // 触发选中装备效果
        activateSelectedEquipment();
        // 选中装备设置为 null
        selectedEquipment = null;
        // 游戏状态切换
        gameStateMode = "idle";
        // 刷新装备面板
        refreshEquipmentPanel();
        return;
    }
    // 刷新装备面板
    refreshEquipmentPanel();
}



// 取消装备选择
function cancelEquipmentSelection() {
    // 选中装备设置为 null
    selectedEquipment = null;
    // 游戏状态切换
    gameStateMode = "idle";
    // 刷新装备面板
    refreshEquipmentPanel();
}



// 判断装备 equipment 的目标类型是否是 targeting
function hasTargeting(equipment, targeting) {
    return (equipment.type.targeting === targeting);
}



// 判断 equipment 的目标类型是否是棋盘格
function canTargetBoardGrid(equipment) {
    return hasTargeting(equipment, "grid");
}



// 判断 equipment 的目标类型是否是装备
function canTargetEquipment(equipment) {
    return hasTargeting(equipment, "equipment");
}



// 点击装备槽后触发函数
/*
function onEquipmentClicked(targetEquipment) {
    // 如果 selectedEquipment 不存在, 中止
    if (!selectedEquipment) {return;}
    // 如果 selectedEquipment 不以装备为目标, 中止
    if (!canTargetEquipment(selectedEquipment)) {return;}
    // 以 targetEquipment 为目标执行 选中装备 selectedEquipment 的对装备使用效果
    activateSelectedEquipment(targetEquipment);
}
 */



function useEquipment(equipment, ...targets) {

    equipment.type.use(...targets, equipment);

    equipment.remainingUsesThisTurn = Math.max(0, equipment.remainingUsesThisTurn - 1);
}



function activateSelectedEquipment(...targets) {

    if (!selectedEquipment) {return;}

    useEquipment(selectedEquipment, ...targets);

    if (selectedEquipment.remainingUsesThisTurn <= 0) {
        cancelEquipmentSelection();
        gameStateMode = "idle";
    }

    refreshEquipmentPanel();
}



function triggerEquipmentTurnEnd() {

    for (
        const equipment of equipments
        ) {

        equipment.type.onTurnEnd?.(
            equipment
        );
    }
}
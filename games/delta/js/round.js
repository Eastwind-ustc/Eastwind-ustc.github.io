// 按权重随机选择一项
function chooseWeightedRandom(dataTable) {

    const entries = Object.values(dataTable);

    const totalWeight = entries.reduce(
        (sum, entry) => sum + entry.weight,
        0
    );

    if (totalWeight <= 0) {
        return null;
    }

    let randomValue = Math.random() * totalWeight;

    for (const entry of entries) {

        randomValue -= entry.weight;

        if (randomValue < 0) {
            return entry;
        }
    }

    return entries[entries.length - 1];
}



// 等概率随机决定生成的物品数量：1 至容器的最大物品数量
function generateItemCount(maxItemCount) {
    return Math.floor(Math.random() * maxItemCount) + 1;
}



// 根据指定物品类型集合等概率随机生成一个物品实例
function generateRandomItem(possibleTypes) {
    // 根据物品类型筛选出允许生成的物品
    const availableItems = Object.values(ITEM_DATA).filter(
        itemData => possibleTypes.includes(itemData.type)
    );
    // 如果没有可生成的物品，则返回 null
    if (availableItems.length === 0) {
        return null;
    }
    // 等概率随机选择一个物品
    const randomIndex = Math.floor(
        Math.random() * availableItems.length
    );
    const itemData = availableItems[randomIndex];
    return createItemInstance(itemData.id);
}



// 按从左到右、再从上到下的顺序寻找物品位置
function findItemPosition(space, item) {

    for (let row = 0; row < space.rows; row++) {

        for (let col = 0; col < space.cols; col++) {

            if (canPlaceItem(space, item, row, col)) {
                return { row, col };
            }
        }
    }

    return null;
}



// 尝试将一个物品放入容器
function tryPlaceItemInContainer(container, item) {

    const position = findItemPosition(container, item);

    if (!position) {
        return false;
    }

    return placeItem(
        container,
        item,
        position.row,
        position.col
    );
}



// 生成当前回合的容器及其内部物品
function startNextRound() {
    // 回合数增加
    currentRound++;
    // 随机选择容器类型
    const containerData = chooseWeightedRandom(CONTAINER_DATA);
    if (!containerData) {
        return false;
    }
    // 创建容器的二维空间
    currentContainer = createGrid(
        containerData.rows,
        containerData.columns
    );

    console.log("容器数据：", containerData);
    console.log("容器格网：", currentContainer);
    console.log("容器行数：", currentContainer.length);
    console.log("容器列数：", currentContainer[0]?.length);

    currentContainer.containerId = containerData.id;
    currentContainer.name = containerData.name;
    // 随机决定生成物品的数量
    const itemCount = generateItemCount(
        containerData.maxItemCount
    );
    // 依次生成物品并尝试放入容器
    for (let i = 0; i < itemCount; i++) {
        const item = generateRandomItem(
            containerData.possibleTypes
        );

        console.log("生成的物品：", item);

        if (!item) {
            continue;
        }
        // 如果无法放入，则跳过该物品
        tryPlaceItemInContainer(currentContainer, item);
    }

    console.log("最终容器内容：", currentContainer);

    return true;
}



// 结束当前回合
function endCurrentRound() {
    // 计算当前回合的缴纳额
    const payment = calculatePayment(currentRound);
    // 哈夫币足够缴纳
    if (playerCurrency >= payment) {
        playerCurrency -= payment;
    }
    // 哈夫币不足缴纳
    else {
        // 计算未缴纳部分占缴纳额的百分比，向下取整
        const unpaidRatio = (payment - playerCurrency) / payment;
        const hpLoss = Math.floor(unpaidRatio * 100);

        // 失去所有哈夫币
        playerCurrency = 0;

        // 扣除生命值，最低为 0
        playerHP = Math.max(0, playerHP - hpLoss);
    }
}
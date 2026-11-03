// 创建一个行数为 rows, 列数为 cols 的二维空间, 以此作为返回值
function createGrid(rows, cols) {

    const grid = [];
    // 创建数量为 rows 的行
    for (let row = 0; row < rows; row++) {

        const line = [];
        // 对于每一行, 创建数量为 cols 的位置
        for (let col = 0; col < cols; col++) {
            line.push(null);
        }

        grid.push(line);
    }

    return {
        rows: rows,
        cols: cols,
        grid: grid,
        items: []
    };
}



// 创建一个物品实例
function createItemInstance(itemId) {

    const itemData = ITEM_DATA[itemId];

    if (!itemData) {
        return null;
    }

    return {
        instanceId: crypto.randomUUID(),
        itemId: itemId,

        // 物品在 Grid 中左上角的位置
        row: null,
        col: null,
        currentValue: ITEM_DATA[itemId].value,
    };
}



// 检查物品是否可以放置
function canPlaceItem(space, item, row, col) {

    const itemData = ITEM_DATA[item.itemId];

    if (!itemData) {
        return false;
    }

    const width = itemData.width;
    const height = itemData.height;

    // 检查是否超出边界
    if (row < 0 || col < 0) {
        return false;
    }
    if (row + height > space.rows) {
        return false;
    }
    if (col + width > space.cols) {
        return false;
    }

    // 检查空间是否与其他物品重叠
    for (let y = row; y < row + height; y++) {

        for (let x = col; x < col + width; x++) {

            if (space.grid[y][x] !== null) {
                return false;
            }
        }
    }

    return true;
}



// 将物品放入空间
function placeItem(space, item, row, col) {

    if (!canPlaceItem(space, item, row, col)) {
        return false;
    }

    const itemData = ITEM_DATA[item.itemId];

    item.row = row;
    item.col = col;

    // 将物品占据的格子标记为该物品的 instanceId
    for (let y = row; y < row + itemData.height; y++) {
        for (let x = col; x < col + itemData.width; x++) {
            space.grid[y][x] = item.instanceId;
        }
    }
    space.items.push(item);
    return true;
}



// 将物品移动到指定空间的指定位置
function moveItemToPosition(sourceSpace, item, targetSpace, targetRow, targetCol) {

    // 检查物品类型是否存在
    const itemData = ITEM_DATA[item.itemId];
    if (!itemData) {
        return false;
    }

    // 确认物品确实存在于来源空间
    if (!sourceSpace.items.includes(item)) {
        return false;
    }

    // 检查物品在来源空间中的格子是否正确
    for (let y = item.row; y < item.row + itemData.height; y++) {
        for (let x = item.col; x < item.col + itemData.width; x++) {
            if (sourceSpace.grid[y]?.[x] !== item.instanceId) {
                return false;
            }
        }
    }

    // 检查目标位置是否越界
    if (
        targetRow < 0 ||
        targetCol < 0 ||
        targetRow + itemData.height > targetSpace.rows ||
        targetCol + itemData.width > targetSpace.cols
    ) {
        return false;
    }

    // 检查目标位置是否被其他物品占据
    for (let y = targetRow; y < targetRow + itemData.height; y++) {
        for (let x = targetCol; x < targetCol + itemData.width; x++) {

            const cellItemId = targetSpace.grid[y][x];

            // 允许占据物品自身原本占据的格子
            if (
                cellItemId !== null &&
                cellItemId !== item.instanceId
            ) {
                return false;
            }
        }
    }

    // 所有检查通过后，才开始修改数据

    // 清除物品在来源空间中的旧位置
    for (let y = item.row; y < item.row + itemData.height; y++) {
        for (let x = item.col; x < item.col + itemData.width; x++) {
            sourceSpace.grid[y][x] = null;
        }
    }

    // 如果移动到另一个空间，更新物品数组
    if (sourceSpace !== targetSpace) {
        sourceSpace.items.splice(sourceSpace.items.indexOf(item), 1);
        targetSpace.items.push(item);
    }

    // 更新物品的左上角坐标
    item.row = targetRow;
    item.col = targetCol;

    // 标记物品在目标空间中占据的格子
    for (let y = targetRow; y < targetRow + itemData.height; y++) {
        for (let x = targetCol; x < targetCol + itemData.width; x++) {
            targetSpace.grid[y][x] = item.instanceId;
        }
    }

    return true;
}



// 从空间中移除物品
function removeItem(space, item) {

    const index = space.items.indexOf(item);

    if (index === -1) {
        return false;
    }

    const itemData = ITEM_DATA[item.itemId];

    // 清除物品占据的格子
    for (let y = item.row; y < item.row + itemData.height; y++) {

        for (let x = item.col; x < item.col + itemData.width; x++) {

            if (space.grid[y][x] === item.instanceId) {
                space.grid[y][x] = null;
            }
        }
    }

    space.items.splice(index, 1);

    item.row = null;
    item.col = null;

    return true;
}



// 根据 instanceId 获取物品
function getItemByInstanceId(space, instanceId) {

    return space.items.find(
        item => item.instanceId === instanceId
    ) || null;
}



// 回收物品
function recycleSelectedItem() {

    // 没有选中物品时，不执行回收
    if (!hasSelectedItem || !selectedItem || !selectedSourceSpace) {
        return;
    }

    const item = selectedItem;
    const sourceSpace = selectedSourceSpace;

    // 检查物品类型是否存在
    const itemData = ITEM_DATA[item.itemId];
    if (!itemData) {
        return;
    }

    // 确认物品确实存在于来源空间
    if (!sourceSpace.items.includes(item)) {
        return;
    }

    // 检查物品在来源空间中的格子是否正确
    for (let y = item.row; y < item.row + itemData.height; y++) {
        for (let x = item.col; x < item.col + itemData.width; x++) {
            if (sourceSpace.grid[y]?.[x] !== item.instanceId) {
                return;
            }
        }
    }

    // 根据当前价值计算回收所得
    const currencyGain = Math.floor(item.currentValue * 0.8);

    // 清除物品占据的所有格子
    for (let y = item.row; y < item.row + itemData.height; y++) {
        for (let x = item.col; x < item.col + itemData.width; x++) {
            sourceSpace.grid[y][x] = null;
        }
    }

    // 从来源空间的物品数组中删除该物品
    sourceSpace.items.splice(sourceSpace.items.indexOf(item), 1);

    // 增加玩家哈夫币
    playerCurrency += currencyGain;

    // 清除选中状态
    hasSelectedItem = false;
    selectedItem = null;
    selectedSourceSpace = null;

    // 刷新游戏界面
    render();
}

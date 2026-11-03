// 开始拖拽物品
function startDrag(item, sourceSpace) {

    dragState.active = true;

    dragState.item = item;
    dragState.sourceSpace = sourceSpace;

    dragState.sourceRow = item.row;
    dragState.sourceCol = item.col;

    dragState.targetRow = null;
    dragState.targetCol = null;
}


// 更新拖拽目标位置
function updateDragTarget(row, col) {

    if (!dragState.active) {
        return false;
    }

    dragState.targetRow = row;
    dragState.targetCol = col;

    return canPlaceItem(
        dragState.sourceSpace,
        dragState.item,
        row,
        col
    );
}


// 完成拖拽
function finishDrag(targetSpace, row, col) {

    if (!dragState.active) {
        return false;
    }

    const item = dragState.item;
    const sourceSpace = dragState.sourceSpace;

    // 如果目标空间就是原空间，
    // 需要先移除原位置，否则原来的格子会被判定为重叠。
    if (sourceSpace === targetSpace) {

        const oldRow = item.row;
        const oldCol = item.col;

        removeItem(sourceSpace, item);

        if (!placeItem(targetSpace, item, row, col)) {

            // 放置失败则恢复原位置
            placeItem(sourceSpace, item, oldRow, oldCol);

            cancelDrag();

            return false;
        }

    } else {

        if (!canPlaceItem(targetSpace, item, row, col)) {
            return false;
        }

        removeItem(sourceSpace, item);
        placeItem(targetSpace, item, row, col);
    }

    cancelDrag();

    return true;
}


// 取消拖拽
function cancelDrag() {

    dragState.active = false;

    dragState.item = null;
    dragState.sourceSpace = null;

    dragState.sourceRow = null;
    dragState.sourceCol = null;

    dragState.targetRow = null;
    dragState.targetCol = null;
}
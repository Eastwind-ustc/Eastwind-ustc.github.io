// 渲染游戏界面
function renderGameplay() {

    // 获取游戏根元素并清空旧内容
    const gameRoot = document.getElementById("gameRoot");
    gameRoot.innerHTML = "";

    // 创建整体游戏界面
    const gameplay = document.createElement("div");
    gameplay.className = "gameplay";

    // 创建顶部按钮栏
    const topBar = document.createElement("div");
    topBar.className = "gameplay-topbar";

    // 创建返回按钮
    const backButton = document.createElement("button");
    backButton.textContent = "返回";
    backButton.onclick = function () {
        currentScene = "main_menu";
        render();
    };
    topBar.appendChild(backButton);

    // 创建回收区域
    const recycleArea = document.createElement("div");
    recycleArea.className = "recycle-area";
    recycleArea.textContent = "回收";
    recycleArea.onclick = function () {
        recycleSelectedItem();
    };
    topBar.appendChild(recycleArea);

    // 创建下一回合按钮
    const nextRoundButton = document.createElement("button");
    nextRoundButton.textContent = "下一回合";
    nextRoundButton.onclick = function () {
        endCurrentRound();
        startNextRound();
        render();
    };
    topBar.appendChild(nextRoundButton);


    // 创建数据面板
    const dataPanel = document.createElement("div");
    dataPanel.className = "gameplay-data-panel";
    // 创建哈夫币显示文字
    const currencyText = document.createElement("div");
    currencyText.innerHTML = `
        <span>回合数: ${currentRound}</span>
        <span>哈夫币: ${playerCurrency}</span>
        <span>生命值: ${playerHP}/100</span>
        <span>缴纳额: ${calculatePayment(currentRound)}</span>
    `;
    dataPanel.appendChild(currencyText);


    // 分别渲染左右区域
    const leftArea = renderLeftArea();
    const rightArea = renderRightArea();
    // 组合左右区域
    const gameArea = document.createElement("div");
    gameArea.className = "gameplay-area";
    gameArea.appendChild(leftArea);
    gameArea.appendChild(rightArea);

    // 组合整个游戏界面
    gameplay.appendChild(topBar);
    gameplay.appendChild(dataPanel);
    gameplay.appendChild(gameArea);

    gameRoot.appendChild(gameplay);
}



// 渲染左侧区域: 玩家物品
function renderLeftArea() {
    // 创建左侧区域
    const leftArea = document.createElement("div");
    leftArea.className = "gameplay-left";
    const backpackGrid = createGridElement(
        playerInventory,
        "backpack-grid"
    );
    renderItems(playerInventory, backpackGrid);
    // 将背包格网添加到左侧区域
    leftArea.appendChild(backpackGrid);
    return leftArea;
}



//渲染右侧区域: 当前容器与回合操作
function renderRightArea() {
    const rightArea = document.createElement("div");
    rightArea.className = "gameplay-right";
    // 判断当前是否存在容器
    if (currentContainer) {
        // 创建容器标题
        const containerTitle = document.createElement("h2");
        containerTitle.textContent = currentContainer.name;
        rightArea.appendChild(containerTitle);
        const containerGrid = createGridElement(
            currentContainer,
            "container-grid"
        );
        renderItems(currentContainer, containerGrid);
        rightArea.appendChild(containerGrid);
    }
    return rightArea;
}



/**
 * 渲染指定空间中的所有物品
 * @param {Object} space - 物品所在的空间
 * @param {HTMLElement} gridElement - 用于显示物品的网格元素
 */
function renderItems(space, gridElement) {
    // 遍历空间中的物品
    for (const item of space.items) {
        const itemData = ITEM_DATA[item.itemId];
        if (!itemData) {
            continue;
        }
        // 创建物品显示元素
        const itemElement = document.createElement("div");
        itemElement.className = `container-item quality-${itemData.quality}`;
        // 创建物品图片
        const itemImage = document.createElement("img");
        itemImage.src = itemData.image;
        itemImage.alt = itemData.name;
        // 将图片添加到物品元素
        itemElement.appendChild(itemImage);
        // 绑定统一的物品点击处理函数
        itemElement.onclick = function (event) {
            handleItemClick(event, item, space);
        };
        // 如果当前物品已被选中，则添加选中样式
        if (hasSelectedItem && selectedItem === item) {
            itemElement.classList.add("selected");
        }
        // 设置物品在网格中的位置和占格大小
        itemElement.style.gridRow =
            `${item.row + 1} / span ${itemData.height}`;
        itemElement.style.gridColumn =
            `${item.col + 1} / span ${itemData.width}`;
        // 添加到网格
        gridElement.appendChild(itemElement);
    }
}



function handleItemClick(event, item, sourceSpace) {

    // 防止点击事件继续传播
    event.stopPropagation();

    // 如果点击的是当前已选中的物品，则取消选中
    if (selectedItem === item) {
        hasSelectedItem = false;
        selectedItem = null;
        selectedSourceSpace = null;
        render();
        return;
    }

    // 选中当前物品
    hasSelectedItem = true;
    selectedItem = item;
    selectedSourceSpace = sourceSpace;
    render();
}



/**
 * 创建网格元素及其所有格子
 * @param {Object} space - 网格对应的数据空间
 * @param {string} className - 网格元素的 CSS 类名
 * @returns {HTMLElement} 创建好的网格元素
 */
function createGridElement(space, className) {
    // 创建网格元素
    const gridElement = document.createElement("div");
    gridElement.className = className;
    // 设置网格的行数和列数
    gridElement.style.gridTemplateColumns =
        `repeat(${space.cols}, 40px)`;
    gridElement.style.gridTemplateRows =
        `repeat(${space.rows}, 40px)`;
    // 创建所有格子
    for (let row = 0; row < space.rows; row++) {
        for (let col = 0; col < space.cols; col++) {
            const cell = document.createElement("div");
            cell.className = "container-cell";
            cell.style.gridRow = row + 1;
            cell.style.gridColumn = col + 1;
            // 保存格子的行列坐标
            cell.dataset.row = row;
            cell.dataset.col = col;
            // 点击格子时，***
            cell.onclick = function () {
                // 如果没有选中物品，则不执行移动
                if (!hasSelectedItem || !selectedItem) {
                    return;
                }
                // 尝试将选中的物品移动到目标位置
                const success = moveItemToPosition(
                    selectedSourceSpace,
                    selectedItem,
                    space,
                    row,
                    col
                );
                // 只有移动成功才取消选中并刷新画面
                if (success) {
                    hasSelectedItem = false;
                    selectedItem = null;
                    selectedSourceSpace = null;
                    render();
                }
            };
            gridElement.appendChild(cell);
        }
    }
    return gridElement;
}
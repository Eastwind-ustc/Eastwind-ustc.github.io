// 当前界面
let currentScene = "main_menu";



// 当前游戏回合数
let currentRound = 0;
// 玩家当前拥有的哈夫币
let playerCurrency = 0;
// 计算当前回合需要缴纳的哈夫币
function calculatePayment(round) {
    return 1000 * round;
}
// 玩家当前生命值
let playerHP = 100;

// 玩家物品空间
const playerInventory = createGrid(10, 5);
// 当前容器
let currentContainer = null;

// 当前是否有物品被选中
let hasSelectedItem = false;
// 当前选中的物品实例
let selectedItem = null;
// 当前选中物品的来源空间
let selectedSourceSpace = null;

// 当前拖拽状态
const dragState = {

    active: false,

    // 正在拖拽的物品
    item: null,

    // 物品原本所在的空间
    sourceSpace: null,

    // 物品原本的位置
    sourceRow: null,
    sourceCol: null,

    // 当前目标位置
    targetRow: null,
    targetCol: null
};
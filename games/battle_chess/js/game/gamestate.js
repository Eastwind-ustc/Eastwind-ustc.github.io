// 棋盘边长格数
const BOARD_SIZE = 10;
// 棋格边长
const CELL_SIZE = 40;
// 棋子移动速度
const MOVE_DURATION = 0.5; // 秒

// 防线生命值
let defenseHP;
// 游戏结束状态
let gameOver;

// 现有零件数
let parts = 50;
// 每回合获得零件数
let partsPerTurn = 50;

// 商店解锁槽位数
let shopSlotsUnlocked = 3;
// 商店装备池
let equipmentPool = [];

// 棋子列
const pieces = [];
// 装备列
const equipments = [];

// 棋盘
let board;
// 棋子层
let pieceLayer;
// 效果层
let effectLayer;
// 防线耐久文本
let hpText;
// 回合结束按钮
let endTurnBtn;
// 游戏结束面板
let gameOverPanel;

// 游戏状态
let gameStateMode = "idle";
// 选中装备
let selectedEquipment = null;
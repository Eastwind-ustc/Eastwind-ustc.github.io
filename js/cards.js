// =========================
// ===== CARDS =============
// =========================
// 这份文件含有关于生成牌的函数. 包括:
// 函数 generateIngredientCard: 随机生成原料牌
// 函数 createPotionCard: 生成值为 value 的药水牌



// 随机生成原料牌
function generateIngredientCard() {
  const suits = ["♥", "♦", "♠", "♣"];
  return {
    type: "原料",
    suit: suits[Math.floor(Math.random() * suits.length)],
    value: intToFrac(Math.floor(Math.random() * 13) + 1)
  };
}



// 根据给定值生成随机花色的原料牌
function createIngredientCard(value) {
  const suits = ["♥", "♦", "♠", "♣"];
  return {
    type: "原料",
    suit: suits[Math.floor(Math.random() * suits.length)], // 或可控
    value: simplify(value)
  };
}



// 生成值为 value 的药水牌
function createPotionCard(value) {
  return {
    type: "药水",
    value: simplify(value)
  };
}



// 映射原料类型名称
function getScenticType(card) {
  const suitMap = {
    "♠": "灵魂残渣",
    "♥": "动物肢体",
    "♣": "草药",
    "♦": "矿石"
  };
  if (card.type === "原料") {
    return `原料:${suitMap[card.suit] ?? "未知"}`;
  }
  if (card.type === "药水") {
    return "药水";
  }
  return card.type;
}



// 映射药水名称
const POTION_NAME_MAP = {
  0: "一个空瓶子",
  1: "水",
  2: "始生元素",
  3: "活跃元素",
  4: "方体颗粒",
  5: "秩序元素",
  6: "调和剂",
  7: "神秘元素",
  8: "方体",
  9: "活化因子",
  10: "补养剂",
  11: "幻影元素",
  12: "\"和谐之元\"",
  13: "恶兆元素",
  16: "超方体",
  17: "突兀元素",
  20: "治疗药水",
  24: "幸运药水",
  25: "固化剂",
  26: "预言凝液",
  32: "多层方体",
  36: "喜乐水",
  39: "毒",
  40: "强效治疗药水",
  48: "许愿灵液",
  50: "镇定剂",
  64: "方体结晶",
  72: "\"至高欢愉\"",
  75: "凝滞因子",
  78: "死水",
  80: "瓶装生命",
  81: "不稳定因子",
  87: "疯癫水",
  96: "完美溶剂",
  97: "终末元素",
  99: "万灵药",
  100: "周期",
};



// 映射卡牌名称
function getCardName(card) {

  // 映射原料名称
  if (card.type === "原料") {
    const map = {
      "♥": {
        1: "史莱姆凝液",
        2: "食人鱼眼",
        3: "天马蹄",
        4: "麒麟血浆",
        5: "巨龟壳",
        6: "公鸡蛋",
        7: "石像鬼唾液",
        8: "衔尾蛇牙",
        9: "狮鹫指甲",
        10: "独角兽角",
        11: "多头犬神经",
        12: "凤凰尾羽",
        13: "龙血",
      },
      "♦": {
        1: "冰",
        2: "沙",
        3: "钟乳岩",
        4: "石英",
        5: "黑曜石",
        6: "云母",
        7: "磁铁矿",
        8: "黄玉",
        9: "翡翠",
        10: "砂金",
        11: "秘银",
        12: "紫水晶",
        13: "钻石",
      },
      "♠": {
        1: "\"平庸\"",
        2: "\"好奇\"",
        3: "\"躁动\"",
        4: "\"观察\"",
        5: "\"淡漠\"",
        6: "\"联想\"",
        7: "\"恐惧\"",
        8: "\"渴嗜\"",
        9: "\"欲望\"",
        10: "\"求生\"",
        11: "\"模仿\"",
        12: "\"思索\"",
        13: "\"满足\"",
      },
      "♣": {
        1: "水草",
        2: "苔藓",
        3: "薄荷",
        4: "艾草",
        5: "睡莲",
        6: "金盏花",
        7: "银杏叶",
        8: "大蒜",
        9: "魔藤",
        10: "金苹果",
        11: "水仙",
        12: "白蔷薇",
        13: "曼德拉草",
      }
    };

    // 这里给默认规则兜底
    const suit = card.suit;
    const n = card.value.num;
    const key = `${suit}-${n}`;
    return map[suit][n]
        || `${suit}${n}`;
  }

  // 映射药水名称
  if (card.type === "药水") {
    const v = card.value;
    // 非整数: 不稳定药水
    if (v.den !== 1) {
      return "不稳定药水";
    }

    const num = v.num;
    // 超过 100 的整数: 膨胀药水
    if (num > 100) return "膨胀药水";
    // 负整数: 黑暗药水
    if (num < 0) return "黑暗药水";
    // 0-100 的整数: 各自有独特的名称
    return POTION_NAME_MAP[num] ?? `药水${num}`;
  }

}
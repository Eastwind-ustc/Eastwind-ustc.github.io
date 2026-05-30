const SPELL_DATA = [
  {
    "name": "基本反应: 研磨",
    "id": "grind",
    "selectable": true,
    "desc": "获得药水(X＋Y). <span class='italic'>使用次数不限.</span>",
    "qualificationCost": 0,
    "unlocked": true,
    "castsPerTurn": -1,
    "slots": 2,
    "slotDisplay": [
      "X",
      "Y"
    ],
    "conditionId": "always",
    "effectId": "grind",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "基本反应: 过滤",
    "id": "filter",
    "selectable": true,
    "desc": "获得药水(X－Y). <span class='italic'>使用次数不限.</span>",
    "qualificationCost": 0,
    "unlocked": true,
    "castsPerTurn": -1,
    "slots": 2,
    "slotDisplay": [
      "X",
      "Y"
    ],
    "conditionId": "always",
    "effectId": "filter",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "基本反应: 灼烧",
    "id": "burn",
    "selectable": true,
    "desc": "获得药水(X×Y). <span class='italic'>使用次数不限.</span>",
    "qualificationCost": 0,
    "unlocked": true,
    "castsPerTurn": -1,
    "slots": 2,
    "slotDisplay": [
      "X",
      "Y"
    ],
    "conditionId": "always",
    "effectId": "burn",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "基本反应: 萃取",
    "id": "extract",
    "selectable": true,
    "desc": "获得药水(X÷Y). <span class='italic'>使用次数不限.</span>",
    "qualificationCost": 0,
    "unlocked": true,
    "castsPerTurn": -1,
    "slots": 2,
    "slotDisplay": [
      "X",
      "Y"
    ],
    "conditionId": "y_not_zero",
    "effectId": "extract",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "活化",
    "id": "activate",
    "selectable": true,
    "desc": "获得药水(X＋1).",
    "qualificationCost": 0,
    "unlocked": true,
    "castsPerTurn": 1,
    "slots": 1,
    "slotDisplay": [
      "X"
    ],
    "conditionId": "always",
    "effectId": "activate",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "激化",
    "id": "intensify",
    "selectable": true,
    "desc": "获得药水(2X).",
    "qualificationCost": 0,
    "unlocked": true,
    "castsPerTurn": 1,
    "slots": 1,
    "slotDisplay": [
      "X"
    ],
    "conditionId": "always",
    "effectId": "intensify",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "冷冻",
    "id": "freezing",
    "selectable": true,
    "desc": "获得一份原料[♦1].",
    "qualificationCost": 1,
    "unlocked": false,
    "castsPerTurn": 1,
    "slots": 0,
    "slotDisplay": [],
    "conditionId": "always",
    "effectId": "freezing",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "镜像制造",
    "id": "clone",
    "selectable": true,
    "desc": "获得填入手牌的两份复制.",
    "qualificationCost": 4,
    "unlocked": false,
    "castsPerTurn": 1,
    "slots": 1,
    "slotDisplay": [
      "X"
    ],
    "conditionId": "always",
    "effectId": "clone",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "规模扩张",
    "id": "scale_expand",
    "selectable": true,
    "desc": "随机获得一份原料.",
    "qualificationCost": 2,
    "unlocked": false,
    "castsPerTurn": 1,
    "slots": 0,
    "slotDisplay": [],
    "conditionId": "always",
    "effectId": "scale_expand",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "丰饶大地",
    "id": "fertile_land",
    "selectable": true,
    "desc": "随机获得两份原料.",
    "qualificationCost": 5,
    "unlocked": false,
    "castsPerTurn": 1,
    "slots": 0,
    "slotDisplay": [],
    "conditionId": "always",
    "effectId": "fertile_land",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "灰色交易",
    "id": "grey_trade",
    "selectable": true,
    "desc": "所需药水与协会订单相同. 随机获得三份原料.",
    "qualificationCost": 1,
    "unlocked": false,
    "castsPerTurn": 1,
    "slots": 1,
    "slotDisplay": [
      "X"
    ],
    "conditionId": "association_match",
    "effectId": "grey_trade",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "计算误差",
    "id": "calculation_error",
    "selectable": true,
    "desc": "将药水(23)转化为四份随机原料.",
    "qualificationCost": 2,
    "unlocked": false,
    "castsPerTurn": 1,
    "slots": 1,
    "slotDisplay": [
      "(23)"
    ],
    "conditionId": "value_23",
    "effectId": "calculation_error",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "会员注册",
    "id": "membership_register",
    "selectable": true,
    "desc": "向原料供应商注册终身会员!",
    "qualificationCost": 0,
    "unlocked": true,
    "castsPerTurn": 1,
    "slots": 4,
    "slotDisplay": [
      "[♠X]",
      "[♥X]",
      "[♣X]",
      "[♦X]"
    ],
    "conditionId": "all_suits_ingredient_same_value",
    "effectId": "membership_register",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "终身会员!",
    "id": "membership_lifetime",
    "selectable": false,
    "desc": "获得一份随机类型的原料[X].",
    "qualificationCost": 0,
    "unlocked": true,
    "castsPerTurn": 1,
    "slots": 0,
    "slotDisplay": [],
    "conditionId": "always",
    "effectId": "membership_lifetime",
    "passiveId": "",
    "descFnId": "membership_lifetime"
  },
  {
    "name": "异变",
    "id": "cyclic_mutate",
    "selectable": true,
    "desc": "获得原料[X+1]. <span class='italic'>表现出某种周期性...</span>",
    "qualificationCost": 1,
    "unlocked": false,
    "castsPerTurn": 1,
    "slots": 1,
    "slotDisplay": [
      "[X]"
    ],
    "conditionId": "ingredient_only",
    "effectId": "cyclic_mutate",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "快速降温",
    "id": "quick_cool",
    "selectable": true,
    "desc": "获得原料[X-1]. 完成一个订单后冷却结束.",
    "qualificationCost": 3,
    "unlocked": false,
    "castsPerTurn": 1,
    "slots": 1,
    "slotDisplay": [
      "[X]"
    ],
    "conditionId": "ingredient_only",
    "effectId": "quick_cool",
    "passiveId": "quick_cool_passive",
    "descFnId": ""
  },
  {
    "name": "周期律",
    "id": "cycle_law",
    "selectable": true,
    "desc": "获得原料[X+1]. 每当你施放一个法术, 周期律会切换到下一个形态.",
    "qualificationCost": 1,
    "unlocked": false,
    "castsPerTurn": 1,
    "slots": 1,
    "slotDisplay": [
      "[X]"
    ],
    "conditionId": "ingredient_only",
    "effectId": "cycle_law",
    "passiveId": "cycle_law_passive",
    "descFnId": "cycle_law_desc"
  },
  {
    "name": "战术快递",
    "id": "tactical_delivery",
    "selectable": true,
    "desc": "游戏开始时: 获得两份原料.",
    "qualificationCost": 0,
    "unlocked": true,
    "castsPerTurn": 0,
    "slots": 0,
    "slotDisplay": [],
    "conditionId": "always",
    "effectId": NaN,
    "passiveId": "tactical_delivery_passive",
    "descFnId": ""
  },
  {
    "name": "伪造的奖章",
    "id": "fake_medal",
    "selectable": true,
    "desc": "游戏开始时: 获得一个资质奖章.",
    "qualificationCost": 0,
    "unlocked": true,
    "castsPerTurn": 0,
    "slots": 0,
    "slotDisplay": [],
    "conditionId": "always",
    "effectId": NaN,
    "passiveId": "fake_medal_passive",
    "descFnId": ""
  },
  {
    "name": "投影",
    "id": "projection",
    "selectable": true,
    "desc": "转化一份原料, 新数值等同于你的其余手牌数.",
    "qualificationCost": 1,
    "unlocked": false,
    "castsPerTurn": 1,
    "slots": 1,
    "slotDisplay": [
      "[X]"
    ],
    "conditionId": "ingredient_only",
    "effectId": "projection",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "复制",
    "id": "duplicate",
    "selectable": true,
    "desc": "使用药水(11)复制最左侧的手牌.",
    "qualificationCost": 1,
    "unlocked": false,
    "castsPerTurn": 1,
    "slots": 1,
    "slotDisplay": [
      "11"
    ],
    "conditionId": "value_11",
    "effectId": "duplicate",
    "passiveId": "",
    "descFnId": ""
  },
  {
    "name": "国士无双",
    "id": "thirteen_orphans",
    "selectable": true,
    "desc": "获得十三个资质奖章.",
    "qualificationCost": 0,
    "unlocked": true,
    "castsPerTurn": 1,
    "slots": 14,
    "slotDisplay": [
      "[1]",
      "[2]",
      "[3]",
      "[4]",
      "[5]",
      "[6]",
      "[7]",
      "[8]",
      "[9]",
      "[10]",
      "[11]",
      "[12]",
      "[13]",
      "[X]"
    ],
    "conditionId": "thirteen_orphans_condition",
    "effectId": "thirteen_orphans",
    "passiveId": "",
    "descFnId": ""
  }
];
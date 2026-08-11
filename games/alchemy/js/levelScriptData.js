const LEVEL_SCRIPTS = {

    level_0_1: [
        // 第一段台词
        {
            speaker: "史蒂芬教授",
            text: "欢迎来到炼金工坊经营实习的第一课!",
            hint: "点击对话框以继续",
            trigger: {
                type: "click"
            },
            allowedActions: [
                "castSpell",
                "submitOrder",
                "nextTurn"
            ]
        },

        // 第二段台词
        {
            speaker: "史蒂芬教授",
            text: "让我们来学习如何经营一家炼金工坊.",
            hint: "点击对话框以继续",
            trigger: {
                type: "click"
            },
            allowedActions: [
                "castSpell",
                "submitOrder",
                "nextTurn"
            ]
        },

        // 第三段台词
        {
            speaker: "史蒂芬教授",
            text: "下面开始第一步.",
            hint: "点击对话框以继续",
            trigger: {
                type: "click"
            },
            allowedActions: [
                "castSpell",
                "submitOrder",
                "nextTurn"
            ]
        }
    ],

    level_0_1_start: [
        {
            speaker: "米勒",
            text: "我第一次尝试经营炼金工坊是在大四的实习课上.",
            hint: "点击对话框继续",
            trigger: {
                type: "click"
            },
            allowedActions: []
        },

        {
            speaker: "米勒",
            text: "史蒂芬教授指导我们如何用法术制作药水来完成订单.",
            hint: "点击对话框继续",
            trigger: {
                type: "click"
            },
            allowedActions: []
        }
    ],

    level_0_1_victory: [
        {
            speaker: "史蒂芬教授",
            text: "干得不错!",
            hint: "点击对话框继续",
            trigger: {
                type: "click"
            },
            allowedActions: []
        }
    ],
};
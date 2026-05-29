const LEVEL_SCRIPTS = {

    level_0_1: [
        {
            speaker: "史蒂芬教授",
            text: "欢迎来到炼金工坊经营实习的第一课!",
            trigger: {
                type: "event",
                event: "spellCast"
            },
            allowedActions: [
                "castSpell",
                "submitOrder",
                "nextTurn"
            ]
        }
    ]
};
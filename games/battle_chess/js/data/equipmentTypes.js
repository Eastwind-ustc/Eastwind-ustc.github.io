const EQUIPMENT_SET = Object.freeze({
    GUN: "gun",
    LASER: "laser",
    CANNON: "cannon",
    ARROW: "arrow",
    NONE: null
});

const EQUIPMENT_SET_LABEL = Object.freeze({
    gun: "火枪",
    laser: "激光",
    cannon: "火炮",
    arrow: "弩箭",
    null: "无",
});

const EQUIPMENT_SET_COLOR = Object.freeze({
    gun: "#ffd166",
    laser: "#4cc9f0",
    cannon: "#ef476f",
    arrow: "#AF855C",
    null: "#000000",
});



const EQUIPMENT_TYPES = [
    {
        name: "歼击炮",
        id: "sniper",
        set: "gun",
        level: 1,
        buildCost: 50,
        dismantleGain: 10,
        targeting: "grid",
        attack: 8,
        usesPerTurn: 1,
        use(targetX, targetY, equipment) {
            const piece = getPieceAt(targetX, targetY);
            if (!piece) {return;}
            damagePiece(piece, equipment.currentAttack);
        },
        onTurnEnd(equipment) {
        }
    },
    {
        name: "激光",
        id: "laser",
        set: "laser",
        level: 1,
        buildCost: 50,
        dismantleGain: 10,
        targeting: "grid",
        attack: 5,
        usesPerTurn: 1,
        use(targetX, targetY, equipment) {
            const targets = [];
            for (const piece of pieces) {
                if (piece.x === targetX) targets.push(piece);
            }
            createLaserEffect(
                targetX,
                equipment.currentAttack,
                targets
            );
        },
    },
    {
        name: "火炮",
        id: "cannon",
        set: "cannon",
        level: 1,
        buildCost: 50,
        dismantleGain: 10,
        targeting: "grid",
        attack: 8,
        usesPerTurn: 1,
        use(targetX, targetY, equipment) {
            let targetPiece = null;
            for (const piece of pieces) {
                if (piece.x !== targetX) continue;
                if (targetPiece === null || piece.y > targetPiece.y) {
                    targetPiece = piece;
                }
            }
            if (!targetPiece) return;
            createCannonShell(targetPiece, equipment.currentAttack);
        },
    },
    {
        name: "破旧连弩",
        id: "broken_crossbow",
        set: "arrow",
        level: 1,
        buildCost: 50,
        dismantleGain: 10,
        targeting: "grid",
        attack: 1,
        usesPerTurn: 5,
        use(targetX, targetY, equipment) {
            const piece = getPieceAt(targetX, targetY);
            if (piece) {damagePiece(piece, equipment.currentAttack);}
        }
    },
    {
        id: "shotgun",
        name: "霰弹",
        set: null,
        level: 1,
        buildCost: 50,
        dismantleGain: 10,
        targeting: "none",
        attack: 4,
        usesPerTurn: 2,
        use(equipment) {
            for (const piece of [...pieces]) {
                damagePiece(piece, equipment.currentAttack);
            }
        },
    },
    {
        id: "workshop",
        name: "改装车间",

        set: null,

        level: 1,
        buildCost: 50,
        dismantleGain: 10,

        attack: 0,

        usesPerTurn: 1,

        targeting: "equipment",

        use(targetEquipment, equipment) {

            if (!targetEquipment) {
                return;
            }

            targetEquipment.currentAttack += 1;
        },
    },
    {
        id: "collector",

        name: "采集器",

        set: null,

        level: 1,
        buildCost: 50,
        dismantleGain: 10,

        attack: 0,

        usesPerTurn: 0,

        targeting: "none",

        use(equipment) {
        },

        onTurnEnd(equipment) {

            parts += 20;

            updateGameUI();
        }
    }
];
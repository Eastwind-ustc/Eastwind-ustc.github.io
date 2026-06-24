function getRandomPieceType() {

    const index =
        Math.floor(
            Math.random() * PIECE_TYPES.length
        );

    return PIECE_TYPES[index];
}



function createPiece(x, y) {

    const element = document.createElement("div");

    element.className = "piece";

    const hpLabel = document.createElement("div");

    hpLabel.className = "hp-label";

    const atkLabel = document.createElement("div");

    atkLabel.className = "atk-label";

    element.appendChild(hpLabel);
    element.appendChild(atkLabel);

    pieceLayer.appendChild(element);

    const pieceType = getRandomPieceType();

    const piece = {
        // 模板
        type: pieceType,
        // 棋盘位置
        x,
        y,
        // 战斗属性
        maxHp: pieceType.maxHp,
        hp: pieceType.maxHp,
        attack: pieceType.attack,
        currentRewardParts: pieceType.rewardParts,
        // 动画数据
        visualX: x,
        visualY: y,

        targetX: x,
        targetY: y,
        // DOM
        dom: element,
        hpLabel,
        atkLabel,

        // 状态
        removing: false,
    };

    hpLabel.textContent = String(piece.hp);
    atkLabel.textContent = String(piece.attack);

    pieces.push(piece);

    updatePieceDOM(piece);
}



function updatePieceDOM(piece) {

    const px =
        piece.visualX * CELL_SIZE + 8;

    const py =
        piece.visualY * CELL_SIZE + 8;

    piece.dom.style.transform =
        `translate(${px}px, ${py}px)`;
}



function damagePiece(piece, damage) {

    damage = Math.max(0, damage);

    piece.hp -= damage;

    refreshPieceDisplay(piece);

    if (piece.hp <= 0) {
        killPiece(piece);
    }
}



function healPiece(piece, amount) {

    piece.hp += amount;

    if (piece.hp > piece.maxHp) {

        piece.hp =
            piece.maxHp;
    }

    refreshPieceDisplay(piece);
}



function setPieceMaxHp(piece, maxHp) {

    piece.maxHp = maxHp;

    if (piece.hp > piece.maxHp) {
        piece.hp = piece.maxHp;
    }

    refreshPieceDisplay(piece);
}



function addPieceMaxHp(piece, amount) {

    setPieceMaxHp(piece, piece.maxHp + amount);
}



function setPieceAttack(piece, attack) {

    piece.attack = attack;

    refreshPieceDisplay(piece);
}



function addPieceAttack(piece, amount) {

    setPieceAttack(piece, piece.attack + amount);
}



function isPieceAlive(piece) {
    return piece.hp > 0;
}



function killPiece(piece) {

    parts += piece.currentRewardParts;

    updateGameUI();

    piece.dom.remove();

    const index = pieces.indexOf(piece);

    if (index >= 0) {pieces.splice(index, 1);}
}



function removeFinishedPieces() {

    for ( let i = pieces.length - 1; i >= 0; i-- ) {

        const piece = pieces[i];

        const arrived =
            Math.abs( piece.visualY - piece.targetY ) < 0.001;

        if (piece.removing && arrived) {
            defenseHP -= piece.attack;

            if (defenseHP <= 0) {
                defenseHP = 0;
                triggerGameOver();
            }

            updateGameUI();

            piece.dom.remove();

            pieces.splice(i, 1);
        }
    }
}



function getPieceAt(x, y) {

    for (const piece of pieces) {

        if (
            piece.x === x &&
            piece.y === y
        ) {
            return piece;
        }
    }

    return null;
}



function getBottomPieceInColumn(x) {

    let result = null;

    for (const piece of pieces) {

        if (piece.x !== x) {
            continue;
        }

        if (
            result === null ||
            piece.y > result.y
        ) {

            result = piece;
        }
    }

    return result;
}



function refreshPieceDisplay(piece) {

    piece.hpLabel.textContent =
        String(piece.hp);

    piece.atkLabel.textContent =
        String(piece.attack);
}
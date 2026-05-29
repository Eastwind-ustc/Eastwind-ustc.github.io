// =========================
// ===== SAVE SYSTEM =======
// =========================

const SAVE_KEY =
    "alchemy_save";

// 给 spell 补回函数引用
function hydrateSpell(spell) {

    spell.effect =
        SPELL_EFFECTS[
            spell.effectId
            ];

    spell.condition =
        SPELL_CONDITIONS[
            spell.conditionId
            ] ??
        SPELL_CONDITIONS.always;

    spell.passives =
        SPELL_PASSIVES[
            spell.passiveId
            ] ?? [];

    spell.descFn =
        SPELL_DESC_FNS[
            spell.descFnId
            ] ?? null;

    return spell;
}

// 保存
function saveGame() {

    const saveData = {

        metaState,

        currentScene,

        currentLevelId:
            currentLevel?.id ?? null,

        state,

        turn,

        hand,

        orders,

        associationOrder,

        spells
    };

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(saveData)
    );
}

// 读取
function loadGame() {

    const raw =
        localStorage.getItem(
            SAVE_KEY
        );

    if (!raw) return false;

    const save =
        JSON.parse(raw);

    // meta
    Object.assign(
        metaState,
        save.metaState
    );

    currentScene =
        save.currentScene;

    // level
    currentLevel =
        LEVEL_DATA.find(
            l =>
                l.id ===
                save.currentLevelId
        ) ?? null;

    // state
    Object.assign(
        state,
        save.state
    );

    turn =
        save.turn;

    hand =
        save.hand;

    orders =
        save.orders;

    associationOrder =
        save.associationOrder;

    spells =
        (save.spells ?? [])
            .map(hydrateSpell);

    return true;
}

// 清档
function clearSave() {

    localStorage.removeItem(
        SAVE_KEY
    );
}
// =========================
// ===== SAVE SYSTEM =======
// =========================



const SAVE_KEY = "alchemy_save";



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
    // 需要保存的数据
    const saveData = {
        // 局外状态
        metaState,
        // 当前界面
        currentScene,
        // 当前关卡的 id. 如果没有, 赋值 null
        currentLevelId: currentLevel?.id ?? null,
        // 状态
        state,
        // 游戏结束与否状态
        gameOver,
    };
    // 把 saveData 转换成字符串并以 SAVE_KEY 为名字存入浏览器本地存储, 实现存档保存
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}



// 读取: 从浏览器本地存储读取存档数据, 并恢复游戏运行时的各项状态
function loadGame() {
    // 从 localStorage 中读取键名为 SAVE_KEY 的存档字符串, 并保存到 raw
    const raw = localStorage.getItem(SAVE_KEY);
    // 如果没有读到存档数据, 则立即返回 false, 表示读档失败
    if (!raw) return false;
    // 把读取到的 JSON 字符串解析回 JavaScript 对象 save
    const save = JSON.parse(raw);
    // 把存档 save 中的 metaState 属性复制到当前运行中的 metaState 对象里
    Object.assign(metaState, save.metaState);
    // 恢复当前界面
    currentScene = save.currentScene;
    // 在 LEVEL_DATA 中查找 id 等于存档记录的关卡, 并赋给 currentLevel; 找不到则设为 null
    currentLevel =
        LEVEL_DATA.find(
            l =>
                l.id ===
                save.currentLevelId
        ) ?? null;
    // 把存档中的 state 内容复制到当前游戏状态对象 state
    Object.assign(state, save.state);
    // 恢复法术运行时函数引用: 对每个法术调用 hydrateSpell 补回函数等运行时内容 (因为 JSON 不保存函数)
    state.spells = (save.state.spells ?? []).map(hydrateSpell);
    // 返回 true, 表示读档成功
    return true;
}



// 清档
function clearSave() {
    // 从 localStorage 中删除键名为 SAVE_KEY 的存档数据。
    localStorage.removeItem(SAVE_KEY);
}
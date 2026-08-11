// =========================
// ===== LEVEL SCRIPT ======
// =========================



// 保存当前剧情脚本的运行状态
const scriptState = {
    active: false, // 对话脚本是否激活
    levelId: null, // 当前关卡 Id
    index: 0, // 当前行序号
    lines: [], // 脚本内容序列
    nextScene: null, // 对话结束后的下一场景
    scriptType: null, // ***
};



// 当前是否阻塞操作
function isScriptBlocking() {
    const line = getCurrentLine();
    return !!line;
}



// 获取当前正在显示的行
function getCurrentLine() {
    // 如果脚本启动状态为 false, 结束
    if (!scriptState.active) return null;
    // 如果 lines[当前行序号] 为空, 输出 null; 否则输出 lines[当前行序号]
    return scriptState.lines[scriptState.index] || null;
}



// 根据 levelId , nextScene, 找到对应的对话脚本, 并开始显示
function startLevelScript(levelId, nextScene, scriptType = null) {
    console.log("SCRIPT START", levelId, LEVEL_SCRIPTS[levelId], scriptState.index);
    // 将该关卡的 LEVEL_SCRIPTS 记作 script
    const script = LEVEL_SCRIPTS[levelId];
    // 如果 script 不存在或 script 长度为 0, 结束脚本
    if (!script || script.length === 0) {
        currentScene = nextScene;
        render();
        return;
    }
    // 将脚本状态的启动状态设置为 true
    scriptState.active = true;
    // 将脚本状态的 levelId 设置为 levelId
    scriptState.levelId = levelId;
    // 将脚本状态的对话设置为 script
    scriptState.lines = script;
    // 将脚本状态的对话序号设置为 0
    scriptState.index = 0;

    scriptState.nextScene = nextScene;

    scriptState.scriptType = scriptType;

    showScriptLine();
}



// 显示当前行
function showScriptLine() {
    // 获取当前正在显示的行, 记作 line
    const line = getCurrentLine();
    // 如果 line 不存在
    if (!line) {
        // 将脚本激活状态设置为 false
        scriptState.active = false;
        // 渲染对话框
        renderScriptOverlay();
        // 终止
        return;
    }
    // 渲染对话框
    renderScriptOverlay();
}



// 推进脚本
function advanceScript() {

    if (!scriptState.active) {
        return;
    }

    scriptState.index++;

    const line = getCurrentLine();

    if (line) {
        renderScriptOverlay();
        saveGame();
        return;
    }

    // 剧情结束
    const nextScene = scriptState.nextScene;

    if (scriptState.scriptType && scriptState.levelId) {
        markScriptWatched(currentLevel.id, scriptState.scriptType);
    }

    scriptState.active = false;
    scriptState.levelId = null;
    scriptState.index = 0;
    scriptState.lines = [];
    scriptState.nextScene = null;
    scriptState.scriptType = null;

    saveGame();

    // 剧情结束后的场景处理
    if (nextScene === "gameplay") {
        // 进入 gameplay, enterGameplay() 内部会判断是否存在局内教程
        enterGameplay();
    } else if (nextScene) {
        // 其他场景直接切换
        currentScene = nextScene;
        render();
    } else {
        render();
    }
}



// 判断是否允许进行 actionType 操作\
function canDoAction(actionType) {
    // 记当前行为 line
    const line = getCurrentLine();
    // 如果 line 不存在, 返回 true
    if (!line) return true;
    // 记 line 允许的操作为 allowed
    const allowed = line.allowedActions;
    // 如果 allowed 不存在, 返回 false
    if (!allowed) return false;
    // 如果 allowed 中没有元素, 返回 false
    if (allowed.length === 0) return false;
    // 判断
    return allowed.includes(actionType);
}



// ===== EVENT HOOK ========

function onGameEvent(eventName, payload) {

    const line = getCurrentLine();
    if (!line) return;

    if (line.trigger?.type === "event") {

        if (line.trigger.event === eventName) {
            advanceScript();
        }
    }
}



//
function endLevelScript() {

    scriptState.active = false;
    scriptState.levelId = null;
    scriptState.index = 0;
    scriptState.lines = [];

    renderScriptOverlay();
}



// 判断某段剧情是否已经播放过
function hasWatchedScript(
    levelId,
    type
) {

    return (
        metaState
            .watchedScripts
            [levelId]
            ?.
            [type]
    ) ?? false;

}



// 标记某段剧情已经播放
function markScriptWatched(
    levelId,
    type
) {

    if (
        !metaState.watchedScripts[levelId]
    ) {

        metaState.watchedScripts[levelId] = {};
    }


    metaState
        .watchedScripts
        [levelId]
        [type] = true;


    saveGame();

}



document
    .getElementById("dialogueRoot")
    .addEventListener("click", () => {

        console.log("DIALOGUE CLICK");

        const line = getCurrentLine();

        console.log(
            "CURRENT LINE =",
            line
        );

        if (!line) {
            console.log("NO CURRENT LINE");
            return;
        }

        console.log(
            "TRIGGER TYPE =",
            line.trigger?.type
        );

        if (line.trigger?.type === "click") {

            console.log(
                "CALL advanceScript()"
            );

            advanceScript();
        }
    });



// =========================
// ===== UI OVERLAY ========
// =========================

// 渲染对话框
function renderScriptOverlay() {

    const root = document.getElementById("dialogueRoot");

    if (!root) return;

    const line = getCurrentLine();

    if (!line) {
        root.innerHTML = "";
        return;
    }

    root.innerHTML = `
        <div class="script-overlay">
            <div class="script-box">
                <div class="script-portrait"></div>

                <div class="script-content">

                    <div class="script-speaker">
                        ${line.speaker || ""}
                    </div>

                    <div class="script-text">
                        ${line.text || ""}
                    </div>

                    <div class="script-hint">
                        ${line.hint || ""}
                    </div>

                </div>
            </div>
        </div>
    `;
}
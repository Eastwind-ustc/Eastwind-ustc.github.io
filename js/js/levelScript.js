// =========================
// ===== LEVEL SCRIPT ======
// =========================

const scriptState = {
    active: false,
    levelId: null,
    index: 0,
    lines: []
};



// 当前是否阻塞操作
function isScriptBlocking() {
    const line = getCurrentLine();
    return !!line;
}



// 获取当前脚本行
function getCurrentLine() {
    if (!scriptState.active) return null;
    return scriptState.lines[scriptState.index] || null;
}



// 启动脚本
function startLevelScript(levelId) {

    console.log(
        "SCRIPT START",
        levelId,
        LEVEL_SCRIPTS[levelId]
    );

    const script = LEVEL_SCRIPTS[levelId];
    if (!script || script.length === 0) return;

    scriptState.active = true;
    scriptState.levelId = levelId;
    scriptState.lines = script;
    scriptState.index = 0;

    showScriptLine();
}



// 显示当前行
function showScriptLine() {
    const line = getCurrentLine();
    if (!line) {
        scriptState.active = false;
        renderScriptOverlay();
        return;
    }

    renderScriptOverlay();
}



// 推进脚本
function advanceScript() {
    if (!scriptState.active) return;

    scriptState.index++;
    showScriptLine();
}



// 判断是否允许操作
function canDoAction(actionType) {
    const line = getCurrentLine();
    if (!line) return true;

    const allowed = line.allowedActions;

    if (!allowed) return false;
    if (allowed.length === 0) return false;

    return allowed.includes(actionType);
}



// =========================
// ===== EVENT HOOK ========
// =========================

function onGameEvent(eventName, payload) {

    const line = getCurrentLine();
    if (!line) return;

    if (line.trigger?.type === "event") {

        if (line.trigger.event === eventName) {
            advanceScript();
        }
    }
}



// 点击推进
document.addEventListener("click", () => {

    const line = getCurrentLine();
    if (!line) return;

    if (line.trigger?.type === "click") {
        advanceScript();
    }
});



// =========================
// ===== UI OVERLAY ========
// =========================

function renderScriptOverlay() {

    console.log(
        "renderScriptOverlay",
        scriptState
    );

    console.log(
        document.getElementById("dialogueRoot")
    );

    const root =
        document.getElementById("dialogueRoot");

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
                </div>
            </div>
        </div>
    `;
}
function renderStory() {

    // console.log("renderStory()");

    const sceneRoot = document.getElementById("sceneRoot");

    sceneRoot.innerHTML = `
        <button
            class="story-back-button"
            onclick="exitStory()">
            返回
        </button>
    `;

    renderScriptOverlay();
}



function exitStory() {

    // 重置剧情状态
    scriptState.active = false;
    scriptState.levelId = null;
    scriptState.index = 0;
    scriptState.lines = [];
    scriptState.nextScene = null;

    // 返回法术选择界面
    currentScene = "spell_select";

    // 保存并重新渲染
    saveGame();
    render();
}
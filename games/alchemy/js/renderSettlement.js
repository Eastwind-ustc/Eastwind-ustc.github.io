// 渲染结算界面
// 渲染结算界面
function renderSettlement() {

    const perfect = state.rating === 3;

    const root = document.getElementById( "sceneRoot" );

    const completionGold = currentLevel.completionGold ?? 0;

    const perfectGold = perfect
        ? (currentLevel.perfectGold ?? 0)
        : 0;

    const totalGold = completionGold + perfectGold;

    root.innerHTML = `
        <div class="panel settlement-panel">
        
            <div class="settlement-title">
                ${perfect ? "完美营业!" : "营业完成!"}
            </div>

            <div>
                ⭐: ${state.rating}
            </div>

            <div style="margin-top:10px">
                营业收入: ${completionGold}💰
            </div>

            ${perfect ? `
                <div style="margin-top:10px">
                    完美营业奖励: ${perfectGold}💰
                </div>
                `
            : ""
            }

            <div style="margin-top:10px">
                总收入: ${totalGold}💰
            </div>

        </div>

        <div style="text-align:center; margin-top:20px">
            <button
                onclick="backToLevelSelectFromSettlement()">
                返回
            </button>
        </div>
    `;
}



// 结算界面返回选关
function backToLevelSelectFromSettlement() {

    const completionGold = currentLevel.completionGold ?? 0;

    const perfectGold = state.rating === 3 ? (currentLevel.perfectGold ?? 0) : 0;

    metaState.gold += completionGold + perfectGold;

    currentScene = "level_select";

    currentLevel = null;

    render();
}
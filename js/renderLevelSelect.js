// 渲染选关页面
function renderLevelSelect() {
    //
    const area =
        document.getElementById(
            "sceneRoot"
        );
    // 创建大标题, "返回" 按钮, 小标题
    let html = `
    <h1>关卡选择</h1>
    <div style="margin-bottom:15px;">
        <button onclick="goMainMenu()">
            返回
        </button>
    </div>
    <div class="panel">
      <h2>选择关卡</h2>
  `;
    // 为每个关卡创建条目. 其中每个关卡附带一个***
    LEVEL_DATA.forEach(level => {
        html += `
      <div>
        <label>
          <input
            type="radio"
            name="levelSelect"
            value="${level.id}"
            ${metaState.selectedLevelId === level.id ? "checked" : ""}
            onchange="selectLevel('${level.id}')"
          >
          ${level.name}
        </label>
      </div>
    `;
    });
    // 创建 "进入游戏" 按钮
    html += `
      <button style="margin-top:20px;font-size:16px;" onclick="goSpellSelect()">
        进入游戏
      </button>
    </div>
    `;

    area.innerHTML = html;
}



// "返回" 按钮的实际效果
function goMainMenu() {
    // 将当前界面设置为 "main_menu"
    currentScene = "main_menu";
    // 渲染
    render();
}



// 点击新关卡的实际效果
function selectLevel(id) {
    // 将 metaState.selectedLevelId 设置为所选关卡的 id
    metaState.selectedLevelId = id;
    // 重新渲染
    render();
}



// "进入游戏" 按钮的实际效果
function goSpellSelect(){
    // 找到其 id 与 metaState.selectedLevelId 相等的那个关卡, 将当前关卡设定为该关卡
    currentLevel =
        LEVEL_DATA.find(
            l =>
                l.id
                ===
                metaState.selectedLevelId
        );
    // 将当前界面设定为 "spell_select"
    currentScene =
        "spell_select";
    // 重新渲染
    render();
}
// =========================
// == RENDER LEVEL SELECT ==
// =========================
// 这份文件含有关于渲染关卡选择界面的函数. 包括:
// 渲染整个关卡选择界面
// 切换关卡选择的效果
// "返回" "进入关卡" 按钮的实际效果



// 渲染关卡选择界面
function renderLevelSelect() {
    // 获取 "整个位于页面的根容器" , 记作 area
    const area = document.getElementById("sceneRoot");
    // 创建大标题, "返回" 按钮, 小标题
    let html = `
    <h1>关卡选择</h1>
    <div style="margin-bottom:15px;">
        <button onclick="goMainMenu()">
            返回
        </button>
    </div>
    <div style="
        text-align:right;
        margin-bottom:12px;
        font-size:16px;
    ">
        💰: ${metaState.gold}
    </div>
    <div class="panel">
      <h2>选择关卡</h2>
  `;
    // 对于每个关卡, 创建一个单选按钮 ***
    LEVEL_DATA.forEach(level => {
        // 创建一个包裹当前选项的容器
        // 用 label 包住 input, 使得点击文字也能选中单选框
        // 创建一个单选按钮 (radio)
        // 所有 level radio 归为一组（只能选一个）
        // 这个选项的值是关卡 id
        // 如果当前关卡是已选关卡，则默认勾选
        // 当用户点击切换选项时: 调用 selectLevel(level.id), 更新选中的关卡状态
        // 显示关卡名称 (用户看到的文本)
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
    // 创建 "进入关卡" 按钮
    html += `
      <button style="margin-top:20px;font-size:16px;" onclick="goSpellSelect()">
        进入关卡
      </button>
    </div>
    `;
    // 将 area 的内容赋值为字符串 html
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



// "进入关卡" 按钮的实际效果
function goSpellSelect(){
    // 找到其 id 与 metaState.selectedLevelId 相等的那个关卡, 将当前关卡设定为该关卡
    currentLevel =
        LEVEL_DATA.find(
            l =>
                l.id === metaState.selectedLevelId
        );
    // 将当前界面设定为 "spell_select"
    currentScene = "spell_select";
    // 重新渲染
    render();
}
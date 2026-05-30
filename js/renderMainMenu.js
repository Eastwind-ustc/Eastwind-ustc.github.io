// 渲染主界面
function renderMainMenu() {

    const root = document.getElementById("sceneRoot");

    // 创建大标题, 主界面介绍语, 进入游戏按钮
    root.innerHTML = `
        <div style="
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            height:80vh;
        ">
            <h1 style="font-size:48px; margin-bottom:30px;">
                炼金术师的店铺
            </h1>
            
            <p>见习炼金术师米勒, 毕业于北方之国的首都魔法学院, 主修炼金术专业.</p>
            <p>如今, 她驾驶着刚入手的房车, 穿行于王国各地, 在旅途中经营着属于自己的流动炼金工坊.</p>
            <p>点击 "进入游戏" , 与米勒一同启程, 踏上横跨这片国土的炼金旅程. </p>
            <p></p>
            
            <button style="font-size:24px;padding:12px 24px;" onclick="goLevelSelect()">
                进入游戏
            </button>
        </div>
    `;
}



// "进入游戏" 按钮的实际效果: 前往选关界面
function goLevelSelect() {
    currentScene = "level_select";
    render();
}
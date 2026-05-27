// 渲染选关页面
function renderLevelSelect() {

    const area =
        document.getElementById(
            "sceneRoot"
        );

    area.innerHTML = "";

    let html = `
    <h1>炼金术师的店铺</h1>

    <div class="panel">

      <h2>选择关卡</h2>
  `;

    LEVEL_DATA.forEach(level => {

        html += `
      <div>
        <label>
          <input
            type="radio"
            name="levelSelect"
            value="${level.id}"

            ${
            metaState.selectedLevelId
            === level.id
                ? "checked"
                : ""
        }

            onchange="
              selectLevel(
                '${level.id}'
              )
            "
          >

          ${level.name}
        </label>
      </div>
    `;
    });

    html += `
      <h2 style="margin-top:20px">
        选择法术
      </h2>

      <div id="spellSelectGrid" class="spell-grid">
  `;

    SPELL_DATA
        .filter(
            spell =>
                spell.selectable
        )
        .forEach(spell => {

        const selected =
            metaState.selectedSpellIds
                .includes(spell.id);

        html += `
      <div class="spell-card ${selected ? 'selected' : ''}">
        <b>${spell.name}</b>
        <div style="font-size:12px">${spell.desc}</div>
        <div style="font-size:12px">资质需求:${spell.qualificationCost}</div>
        <button onclick="toggleSpellSelect('${spell.id}')"
          ${
            !selected &&
            metaState
                .selectedSpellIds
                .length >= 10
                ? "disabled"
                : ""
        }
        >
          ${
            selected
                ? "卸下"
                : "装配"
        }
        </button>
      </div>
    `;
    });

    html += `
      </div>
      <div style="margin-top:20px;font-size:16px;">
        已选择:
        ${
        metaState
            .selectedSpellIds
            .length
    }
        /10
      </div>

      <button
        style="
          margin-top:15px;
          font-size:16px;
        "
        onclick="startGame()"
      >
        开始游戏
      </button>

    </div>
  `;

    area.innerHTML = html;
}
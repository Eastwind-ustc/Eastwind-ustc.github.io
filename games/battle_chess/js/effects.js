// 效果列
let effects = [];



// 更新 effects
function updateEffects(dt) {
    // 对于效果列 effects 中的每个 effect
    for (const effect of effects) {
        // 根据 effect 的类型运行该类型对应的函数 update(effect, dt)
        effect.type.update(effect, dt);
        // 根据 effect 的类型运行该类型对应的函数 render(effect)
        effect.type.render(effect);
    }
    // 清理效果列 effect
    cleanupEffects();
}



// 清理效果列 effects
function cleanupEffects() {
    // 对于效果列 effects 中每个效果 effect
    effects = effects.filter(effect => {
        // 如果 effect.finished 为假, 即 effect 未完成, 在 effects 中保留 effect, 返回
        if (!effect.finished) return true;
        // 否则, 在页面中删除 effect.dom 即 effect 对应的 DOM 元素
        effect.dom.remove();
        // 在 effects 中删除 effect, 返回
        return false;
    });
}



// 创建 effect
function createEffect(data) {
    // 定义变量 effect, 直接复制 data
    const effect = {...data};
    // 在效果列 effects 中加入变量 effect
    effects.push(effect);
    // 返回 effect
    return effect;
}



// 完成 effect
function finishEffect(effect) {
    // 如果 effect.finished 为真即 effect 已完成, 中止
    if (effect.finished) return;
    // 否则, 将 effect.finished 设置为真.
    effect.finished = true;
    // 如果 effect 定义了 onFinish, 则调用它 ***
    effect.onFinish?.(effect);
    // 如果 effect 定义了 EFFECT_TYPES.xxx.onFinish, 则调用它 ***
    effect.type.onFinish?.(effect);
}



// 移除已完成 effect
function removeFinishedEffects() {
    // 取效果列 effects 的长度 length, i 从 0 到 length-1 遍历
    for ( let i = effects.length - 1; i >= 0; i-- ) {
        // 将效果列 effects 的第 i 个元素 记作 effect
        const effect = effects[i];
        // 如果 effect.removing 为真
        if ( effect.removing ) {
            // 调试用: 控制台输出 "effect removed"
            console.log( "effect removed" );
            // 在页面中删除 effect.dom 即 effect 对应的 DOM 元素
            effect.dom.remove();
            // 在效果列 effects 中, 从第 i 个开始删除, 删除一个
            effects.splice(i, 1);
        }
    }
}



// 更新 effect 的 DOM 元素
function updateEffectDOM(effect) {

    const cx = effect.x * CELL_SIZE + CELL_SIZE / 2;

    const cy = effect.y * CELL_SIZE + CELL_SIZE / 2;

    effect.dom.style.left = cx + "px";

    effect.dom.style.top = cy + "px";
}



function updateLaserDOM( effect ) {

    const center = effect.x * CELL_SIZE + CELL_SIZE / 2;

    effect.dom.style.left = `${center}px`;

    effect.dom.style.transform = "translateX(-50%)";
}



function createCannonShell( targetPiece, currentAttack ) {

    const dom = document.createElement("div");

    dom.className = "cannon-shell";

    effectLayer.appendChild(dom);

    createEffect({

        type: EFFECT_TYPES.cannonShell,

        x: targetPiece.x,

        y: BOARD_SIZE,

        targetY: targetPiece.y,

        attack: currentAttack,

        targetPiece: targetPiece,

        speed: 8,

        dom,

        removing: false
    });
}



function createLaserEffect( column, currentAttack, targets ) {

    const dom = document.createElement("div");

    dom.className = "laser-effect";

    effectLayer.appendChild(dom);

    createEffect({

        type: EFFECT_TYPES.laser,

        x: column,

        attack: currentAttack,

        targets,

        timer: 0,

        duration: 0.3,

        dom,

        removing: false
    });
}



function testCannonShell() {

    createCannonShell( 3, 5 );
}
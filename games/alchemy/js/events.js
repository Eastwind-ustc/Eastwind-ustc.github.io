// 事件广播与监听函数: 接受事件 name 发生的信号, 向所有法术传播, 并
function emitEvent(name, payload) {

    // 对于每个法术
    state.spells.forEach(spell => {
        // 如果该法术未解锁或没有被动效果, 不发生任何事
        if (!spell.unlocked) return;
        if (!spell.passives) return;
        // 对于该法术的每个被动
        spell.passives.forEach(p => {
            // 如果该被动的触发时机不是事件 name, 不发生任何事
            if (p.event !== name) return;
            // 根据该被动的 handler 效果, 得到应该触发的效果 result
            const result =
                p.handler({
                    state,
                    payload,
                    spell
                });
            // 触发效果 result
            applyEffect(result);
        });
    });
}
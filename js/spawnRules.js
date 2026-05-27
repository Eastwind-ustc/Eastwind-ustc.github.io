// 出怪总权重-回合数函数表单
const SPAWN_WEIGHT_FNS = {

    constant_1(turn){
        return 2;
    }

};



// 出怪模板表单
const SPAWN_RULES = {

    // 变压模式: 每回合 t 生成订单总权值为 rule.totalWeightFnId
    weight_budget(ctx, rule){
        const totalWeight =
            SPAWN_WEIGHT_FNS[
                rule.totalWeightFnId
                ](ctx.turn);
        let remain = totalWeight;
        const spawned = [];
        // 记本关订单池为 pool
        const pool =
            ORDER_TYPES.filter(o =>
                ctx.level.orderPool.includes(
                    o.id
                )
            );
        // 如果 remain > 0 (总权重还未达到) ,
        while(remain > 0){
            const candidates =
                pool.filter(
                    o => o.weight <= remain
                );
            if(
                candidates.length === 0
            ){
                console.warn(
                    "无法凑出订单权重",
                    remain
                );
                break;
            }
            const template =
                randomChoice(
                    candidates
                );
            spawned.push(
                cloneOrder(template)
            );
            remain -= template.weight;
        }
        return spawned;
    },

    // 确定性出怪: 指定每个回合生成多少种什么订单
    fixed_schedule(ctx, rule){
        const table =
            rule.schedule
            ?? {};
        const entries =
            table[ctx.turn]
            ?? [];
        const spawned = [];
        for (const entry of entries){
            const template =
                ORDER_TYPES.find(
                    o =>
                        o.id
                        ===
                        entry.orderId
                );
            if (!template){
                console.warn(
                    "不存在订单:",
                    entry.orderId
                );
                continue;
            }
            for(
                let i=0;
                i<entry.count;
                i++
            ){
                spawned.push(
                    cloneOrder(
                        template
                    )
                );
            }
        }
        return spawned;
    },

};
// 出怪总权重-回合数函数表单
const SPAWN_WEIGHT_FNS = {

    constant_1(turn){
        return 1;
    },

    constant_2(turn){
        return 2;
    },


    // 0-1
    level_0_1(turn) {
        if (turn <= 3) return 1;
        if (turn === 4) return 2;
        return 0;
    },

    // 0-2
    level_0_2(turn) {
        if (turn === 4 || turn === 5 || turn === 8 || turn === 10) return 1;
        return 0;
    },

};



// 出怪模式表单
const SPAWN_RULES = {

    // 变压出怪: 每回合 t 生成订单总权值为 rule.totalWeightFnId
    weight_budget(ctx, rule){
        // 根据总压力数列 rule.totalWeightFnId 和当前回合数 ctx.turn, 得到本回合总压力 totalWeight
        const totalWeight = SPAWN_WEIGHT_FNS[rule.totalWeightFnId](ctx.state.turn);
        // 令剩余压力 remain = totalWeight
        let remain = totalWeight;
        // 定义生成订单列 spawned
        const spawned = [];
        // 记本关订单池为 pool
        const pool =
            ORDER_TYPES.filter(o =>
                ctx.level.orderPool.includes(
                    o.id
                )
            );
        // 如果剩余压力 remain > 0 (总权重还未达到) , ***
        while(remain > 0){
            // 在 pool 中找到所有权重不大于剩余压力 remain 的订单, 构成备选订单列 candidates
            const candidates =
                pool.filter(
                    o => o.weight <= remain
                );
            // 如果不存在这样的队列, 在控制台输出报错信息与剩余压力 remain, 停止生成订单
            if(candidates.length === 0){
                console.warn("无法凑出订单权重", remain);
                break;
            }
            // 在备选订单列 candidates 中随机选择一个订单, 记作 template
            const template = randomChoice(candidates);
            // 将 template 的一个实例复制加入生成订单列 spawned
            spawned.push(cloneOrder(template));
            // 剩余压力 remain 减去 template 的权重
            remain -= template.weight;
        }
        // 返回生成订单列 spawned
        return spawned;
    },

    // 确定性出怪: 指定每个回合生成多少种什么订单
    fixed_schedule(ctx, rule){
        // ***
        const table = rule.schedule ?? {};
        // ***
        const entries = table[ctx.state.turn] ?? [];
        // 定义生成订单列 spawned
        const spawned = [];
        // ***
        for (const entry of entries){
            const template =
                ORDER_TYPES.find(
                    o =>
                        o.id
                        ===
                        entry.orderId
                );
            if (!template){
                console.warn("不存在订单:", entry.orderId);
                continue;
            }
            for(
                let i=0;
                i<entry.count;
                i++
            ){
                // 将 template 的一个实例复制加入生成订单列 spawned
                spawned.push(cloneOrder(template));
            }
        }
        // 返回生成订单列 spawned
        return spawned;
    },

};
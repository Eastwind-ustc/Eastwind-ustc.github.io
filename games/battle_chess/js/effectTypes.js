// effect 表单
const EFFECT_TYPES = {

    cannonShell: {

        render(effect) {updateEffectDOM(effect);},

        update(effect, dt) {

            effect.y -= effect.speed * dt;

            updateEffectDOM(effect);

            if (effect.y <= effect.targetY) {
                if (
                    effect.targetPiece &&
                    pieces.includes(effect.targetPiece)
                ) {
                    damagePiece(effect.targetPiece, effect.attack );
                } finishEffect(effect);

                // effect.removing = true;
            }
        }
    },

    laser: {

        render(effect) {
            updateEffectDOM(effect);
        },

        update(effect, dt) {

            effect.timer += dt;

            updateLaserDOM(effect);

            if (effect.timer >= effect.duration) {

                for (const piece of effect.targets) {

                    if (pieces.includes(piece)) {

                        damagePiece(piece, effect.attack);
                    }
                }

                finishEffect(effect);

                // effect.removing = true;
            }
        }
    },
};
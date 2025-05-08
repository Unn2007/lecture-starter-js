import controls from '../../constants/controls';

export function getHitPower(fighter) {
    // return hit power
    const criticalHitChance = Math.random() + 1;
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    // return block power
    const dodgeChance = Math.random() + 1;
    return fighter.defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    // return damage
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);
    const damage = hitPower - blockPower;
    return damage > 0 ? damage : 0;
}

function applyEffect(fighterPosition, effectClass) {
    const fighterEl = document.querySelector(`.arena___${fighterPosition}-fighter`);
    if (!fighterEl) return;

    fighterEl.classList.add(effectClass);
    setTimeout(() => fighterEl.classList.remove(effectClass), 400);
}

function showDamageEffect(fighterPosition) {
    const fighterEl = document.querySelector(`.arena___${fighterPosition}-fighter`);
    if (!fighterEl) return;

    fighterEl.classList.add('fighter-damaged');
    setTimeout(() => fighterEl.classList.remove('fighter-damaged'), 300);
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over

        const health = {
            left: firstFighter.health,
            right: secondFighter.health
        };

        const indicators = {
            left: document.getElementById('left-fighter-indicator'),
            right: document.getElementById('right-fighter-indicator')
        };

        const criticalHitKeys = {
            left: controls.PlayerOneCriticalHitCombination,
            right: controls.PlayerTwoCriticalHitCombination
        };

        const pressedKeys = new Set();
        const lastCriticalHit = {
            left: 0,
            right: 0
        };

        const isBlocking = {
            left: false,
            right: false
        };

        const updateHealthBar = fighterKey => {
            const initial = fighterKey === 'left' ? firstFighter.health : secondFighter.health;
            const current = health[fighterKey];
            const percentage = (current / initial) * 100;
            indicators[fighterKey].style.width = `${percentage}%`;
        };

        const onKeyUp = event => {
            pressedKeys.delete(event.code);
            if (event.code === controls.PlayerOneBlock) isBlocking.left = false;
            if (event.code === controls.PlayerTwoBlock) isBlocking.right = false;
        };

        const onKeyDown = event => {
            pressedKeys.add(event.code);

            if (event.code === controls.PlayerOneBlock) {
                isBlocking.left = true;
                applyEffect('left', 'fighter-block');
            }
            if (event.code === controls.PlayerTwoBlock) {
                isBlocking.right = true;
                applyEffect('right', 'fighter-block');
            }

            if (event.code === controls.PlayerOneAttack && !isBlocking.left) {
                const damage = getDamage(firstFighter, secondFighter);
                health.right -= damage;
                updateHealthBar('right');
                showDamageEffect('right');
                applyEffect('left', 'fighter-hit___left');
            }

            if (event.code === controls.PlayerTwoAttack && !isBlocking.right) {
                const damage = getDamage(secondFighter, firstFighter);
                health.left -= damage;
                updateHealthBar('left');
                showDamageEffect('left');
                applyEffect('right', 'fighter-hit___right');
            }

            const now = Date.now();
            if (criticalHitKeys.left.every(key => pressedKeys.has(key))) {
                if (now - lastCriticalHit.left > 10000) {
                    health.right -= 2 * firstFighter.attack;
                    updateHealthBar('right');
                    lastCriticalHit.left = now;
                    applyEffect('left', 'fighter-critical');
                    showDamageEffect('right');
                }
            }

            if (criticalHitKeys.right.every(key => pressedKeys.has(key))) {
                if (now - lastCriticalHit.right > 10000) {
                    health.left -= 2 * secondFighter.attack;
                    updateHealthBar('left');
                    lastCriticalHit.right = now;
                    applyEffect('right', 'fighter-critical');
                    showDamageEffect('left');
                }
            }

            if (health.left <= 0 || health.right <= 0) {
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('keyup', onKeyUp);
                const winner = health.left > 0 ? firstFighter : secondFighter;
                resolve(winner);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    });
}

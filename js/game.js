// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
function overlap(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
function inHole(x, y, w) {
    for (const h of hazards) {
        if (h.type !== 'hole') continue;
        if (x + w * 0.3 > h.x && x + w * 0.7 < h.x + h.w && y >= GY - 4) return true;
    }
    return false;
}

// return a theme color for a power id
function getPowerColor(id) {
    if (!id) return '#ffcc00';
        if (id.includes('crying.png') || id === '😭') return '#66ffcc'; // teal for invincible
    if (id.includes('eyebrow.png')) return '#ffd86b'; // gold for shield
    if (id === '🙂') return '#ff99cc'; // pink for double-jump
    if (id === '👍') return '#fff07a'; // yellow for boost
    if (id === '❤️' || id.includes('heart')) return '#ff6688';
    return PGLOW[id] || '#aaddff';
}

function isInv(id) {
    if (!id) return false;
    if (typeof id !== 'string') return false;
    return id.includes('crying.png') || id === '😭' || id.indexOf('😭') >= 0;
}

// ═══════════════════════════════════════════════
// LOADER
// ═══════════════════════════════════════════════
function loadLevel(idx) {
    const L = LEVELS[idx];
    Object.assign(plr, {
        x: L.ps.x, y: L.ps.y, vx: 0, vy: 0, onGround: false, jumpCount: 0,
        power: null, powerTimer: 0, invincible: false, invTimer: 0,
        powers: [], selPower: 0,
        canDoubleJump: false, shield: false, scoreMulti: 1, shootCD: 0, dir: 1
    });
    plr.stepTimer = 0;
    camera.x = 0; lastStory = '';
    particles = []; projectiles = []; eProjectiles = []; floatTexts = [];
    plats = [...L.plat]; mplats = L.mplat.map(m => ({ ...m }));
    hazards = [...L.haz]; enemies = L.enems.map(e => ({ ...e }));
    coins = L.coins.map(c => ({ ...c, got: false }));
    pups = L.pups.map(p => ({ ...p, got: false, spawnTimer: 46 }));
    // checkpoints
    checkpoints = (L.cps || []).map(c => ({ x: c.x, y: c.y, visited: false }));
    // player's respawn checkpoint; default to level start
    plr.checkpoint = { x: L.ps.x, y: L.ps.y };
    for (const p of pups) { burstSparks(p.x, p.y, getPowerColor(p.e) || '#fff', 8); }
    totalCoins = coins.length; coinsDone = 0;
    document.getElementById('levelEl').textContent = idx + 1;
    updateHUD();

    for (let i = 0; i < 20; i++) {
        const speed = 0.1 + Math.random() * 0.3;
        const color = L.bg === 'sky' ? '#ffffff15' : L.bg === 'night' ? '#aaaaff12' : '#ffaa0018';
        particles.push(mkParticle(Math.random() * L.W, Math.random() * 150 + 30, { vx: (Math.random() - 0.5) * speed, vy: Math.random() * 0.05 - 0.02, grav: 0 }, color, Math.random() < 0.3 ? 'circle' : 'spark', 0.5 + Math.random() * 1.5, 9999));
    }
}

// ═══════════════════════════════════════════════
// HUD + STORY
// ═══════════════════════════════════════════════
function updateHUD() {
    document.getElementById('scoreEl').textContent = score;
    document.getElementById('livesEl').textContent = '♥'.repeat(Math.max(0, lives));
    document.getElementById('ayaEl').textContent = coinsDone + '/' + totalCoins;
    const pEl = document.getElementById('powerEl');
    // show multiple active powers with timers
    if (!plr.powers || plr.powers.length === 0) { pEl.textContent = '—'; return; }
    let html = '';
    for (const pp of plr.powers) {
        const secs = Math.ceil(pp.t / 60);
        const color = getPowerColor(pp.id);
        const fg = (color === '#fff07a' || color === '#ffd86b') ? '#000' : '#fff';
        if (pp.id.includes('<img')) html += `<span style="display:inline-block;margin-right:8px;padding:4px 8px;border-radius:6px;background:${color};color:${fg};box-shadow:0 2px 6px ${color}66">${pp.id} ${secs}s</span>`;
        else html += `<span style="display:inline-block;margin-right:8px;padding:4px 8px;border-radius:6px;background:${color};color:${fg};box-shadow:0 2px 6px ${color}66">${pp.id} ${secs}s</span>`;
    }
    pEl.innerHTML = html;
}
function updateStory() {
    const story = LEVELS[curLevel].story;
    let chosen = story[0][1];
    for (const [thr, txt] of story) { if (camera.x >= thr) chosen = txt; else break; }
    if (chosen !== lastStory) {
        lastStory = chosen;
        const el = document.getElementById('storyText');
        el.style.opacity = '0';
        setTimeout(() => { el.textContent = chosen; el.style.opacity = '1'; }, 320);
    }
}

// ═══════════════════════════════════════════════
// POWERUPS
// ═══════════════════════════════════════════════
function applyPower(e, dur) {
    // support flexible power spec: string id or object { id, dur }
    plr.powers = plr.powers || [];
    let id = e;
    let ticks = null;
    if (typeof e === 'object' && e !== null) {
        id = e.id || id;
        if (typeof e.dur === 'number') ticks = Math.round(e.dur * 60);
        if (typeof e.t === 'number') ticks = e.t;
    }
    if (typeof dur === 'number') ticks = Math.round(dur * 60);
    // default durations: invincible 10s, others 15s (900 ticks)
    if (!ticks) ticks = isInv(id) ? 600 : 900;

    plr.powers.push({ id: id, t: ticks, maxT: ticks });
    // make this new power the active selection
    plr.power = id; plr.powerTimer = ticks; plr.selPower = plr.powers.length - 1;
    if (isInv(id)) { setInvincible(true); plr.canDoubleJump = true; }
    if (id === '🙂') { plr.canDoubleJump = true; }
    if ((typeof id === 'string' && id.includes('eyebrow.png')) ) { plr.shield = true; plr.shieldHp = 3; plr.shieldCrackTimer = 0; plr.shieldCrackLevel = 0; }
    if (id === '👍') { plr.scoreMulti = 3; }
    sfxPowerup(); updateHUD();
}
function clearPower() {
    plr.power = null; plr.powerTimer = 0;
    plr.powers = [];
    setInvincible(false); plr.canDoubleJump = false; plr.shield = false; plr.scoreMulti = 1;
    plr.shieldHp = 0; plr.shieldCrackTimer = 0; plr.shieldCrackLevel = 0;
    updateHUD();
}

function applyShieldHit() {
    if (!plr.shield) return;
    plr.shieldHp = Math.max(0, (plr.shieldHp || 3) - 1);
    plr.shieldCrackTimer = 36;
    plr.shieldCrackLevel = 3 - plr.shieldHp;
    burstSparks(plr.x + plr.w / 2, plr.y + plr.h / 2, '#ffd1aa', 10);
    particles.push(mkParticle(plr.x + plr.w / 2, plr.y + plr.h / 2, { vx: (Math.random() - 0.5) * 1.6, vy: -1 - Math.random() * 0.8, grav: 0.18 }, '#ffd1aa', 'spark', 2, 30));
    floatTxt(plr.x + plr.w / 2, plr.y - 6, plr.shieldHp > 0 ? 'SHIELD CRACK' : 'SHIELD BROKEN', '#ffd1aa');
    if (plr.shieldHp <= 0) {
        // end shield early
        if (plr.power && plr.power.includes('eyebrow.png')) clearPower(); else plr.shield = false;
    }
}

// ═══════════════════════════════════════════════
// SHOOTING
// ═══════════════════════════════════════════════
function shoot() {
    const em = plr.power;
    const px = plr.x + (plr.dir > 0 ? plr.w : -10), py = plr.y + plr.h / 2 - 10;
    if (em === '❤️') {
        // limit active hearts to 2
        const activeHearts = projectiles.filter(p => p.emoji === '❤️' && p.life > 0).length;
        if (activeHearts >= 2) return;
        projectiles.push({ wx: px, wy: py, vx: plr.dir * 8, vy: -4, grav: 0.4, bounces: 5, life: 150, emoji: '❤️', w: 16, h: 16, rot: 0, rotV: plr.dir * 0.22 + (Math.random() - 0.5) * 0.12, wobble: Math.random() * 0.6 });
    }
    else if (em === '🤨') { projectiles.push({ wx: px, wy: py, vx: plr.dir * 11, vy: 0, grav: 0, bounces: 0, life: 72, emoji: '❄️', w: 20, h: 20, freeze: true }); }
    else if (em === '🙂') { for (let a = -1; a <= 1; a++) projectiles.push({ wx: px, wy: py, vx: plr.dir * 9, vy: a * 2.6, grav: 0, bounces: 0, life: 56, emoji: '🙂', w: 14, h: 14 }); }
    else if (em === '👍') { projectiles.push({ wx: px, wy: py, vx: plr.dir * 13, vy: 0, grav: 0, bounces: 0, life: 82, emoji: '⭐', w: 18, h: 18 }); }
    plr.shootCD = 18; sfxShoot();
}

// ═══════════════════════════════════════════════
// DAMAGE
// ═══════════════════════════════════════════════
function takeDamage() {
    if (plr.invincible) return;
    lives--; updateHUD();
    hurtEffect(plr.x + plr.w / 2, plr.y + plr.h / 2);
    floatTxt(plr.x + plr.w / 2, plr.y - 10, '-LIFE', '#ff4444');
    sfxHurt();
    setInvincible(true); plr.invTimer = 140;
    if (lives <= 0) { gameOver(); return; }
    // respawn at last checkpoint (if set) rather than level start
    const cp = (plr.checkpoint && { x: plr.checkpoint.x, y: plr.checkpoint.y }) || LEVELS[curLevel].ps;
    plr.x = cp.x; plr.y = cp.y; plr.vx = plr.vy = 0;
}

// ═══════════════════════════════════════════════
// UPDATE
// ═══════════════════════════════════════════════
function update() {
    if (state !== 'play') return;
    const L = LEVELS[curLevel];
    const allP = [...plats, ...mplats];

    mplats.forEach(mp => {
        // move platform and compute horizontal delta
        const prevX = mp.x;
        mp.x += mp.dx;
        if (mp.x >= mp.x2 || mp.x <= mp.x1) mp.dx *= -1;
        mp.x = Math.max(mp.x1, Math.min(mp.x2, mp.x));
        const dx = mp.x - prevX;
        if (dx === 0) return;

        // carry anything that is sitting on (or very near above) the platform
        const topY = mp.y;
        const carryThresh = 20; // px above platform to be carried

        // player
        if (plr.y + plr.h <= topY && plr.y + plr.h >= topY - carryThresh && plr.x + plr.w > prevX && plr.x < prevX + mp.w) {
            plr.x += dx;
        }

        // enemies
        enemies.forEach(e => {
            if (e.hp <= 0) return;
            if (e.y + EH <= topY && e.y + EH >= topY - carryThresh && e.x + EW > prevX && e.x < prevX + mp.w) {
                e.x += dx;
            }
        });

        // coins (treat coin point as near-top)
        coins.forEach(c => {
            if (c.got) return;
            if (c.y <= topY + 6 && c.y >= topY - carryThresh && c.x > prevX - 4 && c.x < prevX + mp.w + 4) {
                c.x += dx;
            }
        });

        // pups (powerups)
        pups.forEach(p => {
            if (p.got) return;
            if (p.y <= topY + 6 && p.y >= topY - carryThresh && p.x + 16 > prevX && p.x - 16 < prevX + mp.w) {
                p.x += dx;
            }
        });
    });

    const goL = keys['ArrowLeft'] || keys['a'] || keys['A'];
    const goR = keys['ArrowRight'] || keys['d'] || keys['D'];
    const doJ = keys['ArrowUp'] || keys['w'] || keys['W'] || keys['z'] || keys['Z'];
    if (goL) { plr.vx = -SPD; plr.dir = -1; } else if (goR) { plr.vx = SPD; plr.dir = 1; } else plr.vx *= 0.55;

    if (Math.abs(plr.vx) > 0.5 && Math.random() < 0.15) {
        particles.push(mkParticle(plr.x + plr.w / 2 + (Math.random() - 0.5) * 20, plr.y + plr.h, { vx: (Math.random() - 0.5) * 0.5, vy: -1 - Math.random() * 0.5, grav: 0.1 }, '#ff69b4', 'spark', 2, 22));
    } else if (Math.random() < 0.03) {
        particles.push(mkParticle(plr.x + plr.w / 2 + (Math.random() - 0.5) * 30, plr.y + plr.h / 2 + (Math.random() - 0.5) * 20, { vx: (Math.random() - 0.5) * 0.2, vy: -0.1 - Math.random() * 0.2, grav: 0.01 }, '#ff69b4', 'spark', 1, 25));
    }

    if (keys[' '] && plr.shootCD <= 0) {
        // if selected power is shield, try to pick another shootable power (last non-shield)
        if (plr.power && plr.power.includes('eyebrow.png')) {
            const arr = plr.powers || [];
            let found = -1;
            for (let j = arr.length - 1; j >= 0; j--) if (!arr[j].id.includes('eyebrow.png')) { found = j; break; }
            if (found >= 0) { plr.power = arr[found].id; plr.powerTimer = arr[found].t; plr.selPower = found; }
        }
        if (plr.power) shoot();
    }
    if (plr.shootCD > 0) plr.shootCD--;

    if (doJ && !keys._jh) {
        if (plr.onGround) { plr.vy = JF; plr.jumpCount = 1; sfxJump(); jumpEffect(plr.x + plr.w / 2, plr.y + plr.h); }
        else if (plr.canDoubleJump && plr.jumpCount < 2) { plr.vy = JF * 0.8; plr.jumpCount++; sfxJump(); burstCircle(plr.x + plr.w / 2, plr.y + plr.h, '#aaffcc', 8, 2); }
        keys._jh = true;
    }
    if (!doJ) keys._jh = false;

    plr.vy = Math.min(plr.vy + G, 15);
    plr.y += plr.vy; plr.onGround = false;
    if (!inHole(plr.x, plr.y, plr.w) && plr.y + plr.h >= GY) { plr.y = GY - plr.h; plr.vy = 0; plr.onGround = true; plr.jumpCount = 0; }
    for (const p of allP) {
        if (plr.x + plr.w <= p.x + 2 || plr.x >= p.x + p.w - 2) continue;
        const prevBot = plr.y - plr.vy + plr.h;
        if (plr.vy >= 0 && plr.y + plr.h >= p.y && prevBot <= p.y + 10) { plr.y = p.y - plr.h; plr.vy = 0; plr.onGround = true; plr.jumpCount = 0; }
        else if (plr.vy < 0 && plr.y <= p.y + p.h && (plr.y - plr.vy) >= p.y + p.h - 5) { plr.y = p.y + p.h; plr.vy = 1; }
    }

    plr.x += plr.vx;
    for (const p of allP) {
        if (plr.y + plr.h <= p.y + 3 || plr.y >= p.y + p.h - 3) continue;
        if (plr.x + plr.w > p.x && plr.x < p.x + p.w) {
            const oR = (plr.x + plr.w) - p.x, oL = (p.x + p.w) - plr.x;
            if (oR < oL) { plr.x = p.x - plr.w; } else { plr.x = p.x + p.w; } plr.vx = 0;
        }
    }
    plr.x = Math.max(0, Math.min(L.W - plr.w, plr.x));

    if (plr.y > VH + 80) { takeDamage(); return; }
    // If player falls into a hole hazard, only apply damage/respawn when NOT invincible.
    // Previously this always returned early which froze the player when invincible.
    if (inHole(plr.x, plr.y + plr.h - 2, plr.w)) {
        if (!plr.invincible) { takeDamage(); return; }
        // if invincible, ignore the hole for movement (allow walking/falling through normally)
    }

    plr.animTimer++;
    if (Math.abs(plr.vx) > 0.5) { plr.animState = 'walk'; plr.animFrame = Math.floor(plr.animTimer / 8) % 4; }
    else { plr.animState = 'idle'; plr.animFrame = Math.floor(plr.animTimer / 15) % 2; }
    if (!plr.onGround) plr.animState = plr.vy < 0 ? 'jump' : 'fall';

    // footsteps: play while walking on ground
    if (plr.onGround && plr.animState === 'walk') {
        if (!plr.stepTimer || plr.stepTimer <= 0) {
            sfxFootstep();
            // basic cadence: faster when running
            const speed = Math.min(8, Math.abs(plr.vx));
            plr.stepTimer = Math.max(6, 16 - Math.floor(speed * 1.6));
        } else plr.stepTimer--;
    } else {
        plr.stepTimer = 0;
    }

    for (const h of hazards) { if (h.type === 'thorn' && overlap(plr, { x: h.x + 5, y: h.y + 4, w: h.w - 10, h: h.h - 6 })) takeDamage(); }

    // manage multiple power timers
    if (plr.powers && plr.powers.length > 0) {
        for (let i = plr.powers.length - 1; i >= 0; i--) {
            const pp = plr.powers[i]; pp.t = Math.max(0, pp.t - 1);
            // side-effects while active
            if (isInv(pp.id)) setInvincible(true);
            if (pp.id.includes('eyebrow.png')) plr.shield = true;
            if (pp.t <= 0) {
                const ended = pp.id;
                plr.powers.splice(i, 1);
                // turn off special effects for ended power
                if (isInv(ended)) setInvincible(false);
                if (ended.includes('eyebrow.png')) { plr.shield = false; plr.shieldHp = 0; plr.shieldCrackTimer = 0; plr.shieldCrackLevel = 0; }
                if (plr.power === ended) {
                    if (plr.powers.length > 0) { plr.power = plr.powers[plr.powers.length - 1].id; plr.powerTimer = plr.powers[plr.powers.length - 1].t; plr.selPower = plr.powers.length - 1; }
                    else { plr.power = null; plr.powerTimer = 0; plr.selPower = 0; }
                    updateHUD();
                }
            }
        }
    }
    // invincible timer from damage (keeps old behavior when hurt)
    if (plr.invTimer > 0) { plr.invTimer--; if (plr.invTimer <= 0) setInvincible(false); }
    if (plr.shieldCrackTimer > 0) plr.shieldCrackTimer--;

    enemies.forEach(e => {
        if (e.hp <= 0) return;
        if (e.frozen > 0) { e.frozen--; return; }
        const spd = e.spd * (e.type === 'fast' ? 1.55 : e.type === 'armored' ? 0.6 : e.type === 'bomber' ? 0.7 : 1);
        e.x += e.dir * spd;
        if (e.x <= e.patX1) { e.x = e.patX1; e.dir = 1; }
        if (e.x + EW >= e.patX2) { e.x = e.patX2 - EW; e.dir = -1; }
        e.vy = (e.vy || 0) + G * 0.4; e.y += e.vy;
        if (e.y + EH >= GY && !inHole(e.x + EW * 0.3, e.y + EH, EW * 0.4)) { e.y = GY - EH; e.vy = 0; }
        let onPlat = false;
        for (const p of allP) { if (e.x + EW > p.x + 2 && e.x < p.x + p.w - 2 && e.vy >= 0 && e.y + EH >= p.y && e.y + EH <= p.y + 18) { e.y = p.y - EH; e.vy = 0; onPlat = true; } }
        if (e.platY !== null && !onPlat && e.y + EH > GY - 2) { e.y = e.platY; e.vy = 0; }

        if (e.type === 'shooter' || e.type === 'bomber') {
            e.shootCD = (e.shootCD || 120) - 1;
            const dist = Math.abs(plr.x - e.x);
            if (e.shootCD <= 0 && dist < 320) {
                // shooter: fire every 120 ticks (~2s) and only if player is in front
                if (e.type === 'shooter') {
                    const dx = plr.x - (e.x + EW / 2);
                    if (dx * e.dir > 0) {
                        e.shootCD = 120;
                        eProjectiles.push({ wx: e.x + EW / 2, wy: e.y + EH / 2, vx: e.dir * 5.5, vy: 0, grav: 0, life: 200, w: 10, h: 10, emoji: '•', color: '#ff44aa', glow: '#ff88cc', r: 6, spin: (Math.random() - 0.5) * 0.6, trail: true });
                        sfxEnemyShoot();
                    }
                } else if (e.type === 'bomber') {
                    e.shootCD = 90 + Math.floor(Math.random() * 80);
                    eProjectiles.push({ wx: e.x + EW / 2, wy: e.y + EH, vx: 0, vy: 1, grav: 0.35, life: 80, w: 12, h: 12, emoji: '💣', bomb: true });
                    sfxEnemyShoot();
                }
            }
        }

        if (overlap(plr, { x: e.x, y: e.y, w: EW, h: EH })) {
            const stomping = plr.y + plr.h <= e.y + 12 && plr.vy > 0;
            if (stomping && e.type !== 'armored') {
                e.hp--; plr.vy = -8; stompEffect(e.x + EW / 2, e.y); sfxStomp(); floatTxt(e.x + EW / 2, e.y, '+150', '#ffff44'); score += 150 * plr.scoreMulti;
                if (e.hp <= 0) { deadEffect(e.x + EW / 2, e.y); score += 50 * plr.scoreMulti; floatTxt(e.x + EW / 2, e.y - 18, '💥+50', '#ff8800'); sfxKilled(); }
                updateHUD();
            } else if (stomping && e.type === 'armored' && !plr.invincible) {
                plr.vy = -5; floatTxt(e.x + EW / 2, e.y, 'ARMORED!', '#ff8800'); burstSparks(e.x + EW / 2, e.y, '#cc8800', 6); takeDamage();
            } else if (!plr.invincible) {
                    if (plr.shield) {
                        // shield absorbs hit and cracks
                        e.hp--; e.dir *= -1; burstCircle(e.x + EW / 2, e.y, '#f5ff88', 10);
                        applyShieldHit();
                        if (e.hp <= 0) { deadEffect(e.x + EW / 2, e.y); score += 200 * plr.scoreMulti; updateHUD(); sfxKilled(); }
                    } else takeDamage();
            }
            if (plr.invincible) { e.hp--; e.dir *= -1; burstCircle(e.x + EW / 2, e.y, 'rgba(91, 255, 0, 0.8)', 10); if (e.hp <= 0) { deadEffect(e.x + EW / 2, e.y); score += 200 * plr.scoreMulti; updateHUD(); sfxKilled(); } }
        }
    });

    // checkpoint activation: touching a flag sets the respawn point
    if (checkpoints && checkpoints.length > 0) {
        for (let i = 0; i < checkpoints.length; i++) {
            const cp = checkpoints[i];
            if (cp.visited) continue;
            // simple overlap test: treat cp as small upright flag area
            if (overlap(plr, { x: cp.x - 12, y: cp.y - 34, w: 24, h: 36 })) {
                cp.visited = true;
                plr.checkpoint = { x: cp.x, y: cp.y - plr.h }; // place player standing on flag ground
                burstSparks(cp.x, cp.y - 8, '#ffff88', 18);
                floatTxt(cp.x, cp.y - 40, 'CHECKPOINT!', '#ffff88');
                sfxPowerup();
            }
        }
    }

    projectiles.forEach(p => {
        p.wx += p.vx; p.wy += p.vy; p.vy += (p.grav || 0); p.life--;
        // apply spin/rotation if present
        if (p.rot !== undefined) p.rot += (p.rotV || 0);

        // hazards: destroy projectile on contact with any hazard
        for (const h of hazards) {
            if (p.life <= 0) break;
            if (overlap({ x: p.wx, y: p.wy, w: p.w, h: p.h }, { x: h.x, y: h.y, w: h.w, h: h.h })) {
                p.life = 0;
                burstSparks(p.wx, p.wy, '#ff8899', 6);
                particles.push(mkParticle(p.wx, p.wy, { vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.8) * 1.2, grav: 0.2 }, '#ff88aa', 'spark', 1.6, 20));
                break;
            }
        }

        // platform collisions (plats + mplats)
        for (const pl of allP) {
            if (p.life <= 0) break;
            // quick bounding check
            if (p.wx + p.w <= pl.x || p.wx >= pl.x + pl.w || p.wy + p.h <= pl.y || p.wy >= pl.y + pl.h) continue;
            const prevX = p.wx - p.vx, prevY = p.wy - p.vy;
            const prevRight = prevX + p.w, prevLeft = prevX, prevTop = prevY, prevBottom = prevY + p.h;
            const curRight = p.wx + p.w, curLeft = p.wx, curTop = p.wy, curBottom = p.wy + p.h;
            const plLeft = pl.x, plRight = pl.x + pl.w, plTop = pl.y, plBottom = pl.y + pl.h;

            // Determine collision side by comparing edge crossings
            const hitTop = prevBottom <= plTop && curBottom >= plTop;
            const hitBottom = prevTop >= plBottom && curTop <= plBottom;
            const hitLeft = prevRight <= plLeft && curRight >= plLeft;
            const hitRight = prevLeft >= plRight && curLeft <= plRight;

            if (hitTop) {
                // landed on top
                p.wy = plTop - p.h;
                p.vy *= -0.52;
                p.vx *= 0.86;
                if (p.bounces > 0) p.bounces--;
                if (p.emoji === '❤️') {
                    burstSparks(p.wx, p.wy + p.h / 2, '#ff88aa', 8);
                    particles.push(mkParticle(p.wx, p.wy + p.h / 2, { vx: (Math.random() - 0.5) * 1.2, vy: -1 - Math.random() * 0.8, grav: 0.18 }, '#ff6688', 'spark', 1.8, 36));
                    p.rotV = (Math.random() - 0.5) * 0.6;
                }
            } else if (hitBottom) {
                // hit from below
                p.wy = plBottom;
                p.vy *= -0.3;
                p.vx *= 0.8;
            } else if (hitLeft) {
                // hit left side of platform
                p.wx = plLeft - p.w;
                p.vx *= -0.6;
                p.vy *= 0.9;
                if (p.bounces > 0) p.bounces--;
                if (p.emoji === '❤️') {
                    particles.push(mkParticle(p.wx, p.wy + p.h / 2, { vx: -1 - Math.random() * 0.8, vy: (Math.random() - 0.5) * 1.2, grav: 0.12 }, '#ff99aa', 'spark', 1.4, 26));
                    p.rotV = -Math.abs(p.rotV || 0.3) * 0.8;
                }
            } else if (hitRight) {
                // hit right side of platform
                p.wx = plRight;
                p.vx *= -0.6;
                p.vy *= 0.9;
                if (p.bounces > 0) p.bounces--;
                if (p.emoji === '❤️') {
                    particles.push(mkParticle(p.wx, p.wy + p.h / 2, { vx: 1 + Math.random() * 0.8, vy: (Math.random() - 0.5) * 1.2, grav: 0.12 }, '#ff99aa', 'spark', 1.4, 26));
                    p.rotV = Math.abs(p.rotV || 0.3) * 0.8;
                }
            } else {
                // overlapping (embedded) - resolve by minimal translation
                const penLeft = curRight - plLeft;
                const penRight = plRight - curLeft;
                const penTop = curBottom - plTop;
                const penBottom = plBottom - curTop;
                const minPen = Math.min(penLeft, penRight, penTop, penBottom);
                if (minPen === penTop) { // push up
                    p.wy = plTop - p.h; p.vy *= -0.45; if (p.bounces > 0) p.bounces--; }
                else if (minPen === penBottom) { p.wy = plBottom; p.vy *= -0.3; }
                else if (minPen === penLeft) { p.wx = plLeft - p.w; p.vx *= -0.6; }
                else { p.wx = plRight; p.vx *= -0.6; }
                if (p.emoji === '❤️') p.rotV = (Math.random() - 0.5) * 0.6;
            }
        }

        // if underground (well below ground) make it disappear
        if (p.wy > GY + 24) { p.life = 0; }

        // ground bounce (fallback)
        if (p.bounces > 0 && p.wy + p.h >= GY) {
            p.wy = GY - p.h;
            p.vy *= -0.52;
            p.vx *= 0.86;
            p.bounces--;
            // make bounce more lively for hearts
            if (p.emoji === '❤️') {
                burstSparks(p.wx, p.wy + p.h / 2, '#ff88aa', 8);
                particles.push(mkParticle(p.wx, p.wy + p.h / 2, { vx: (Math.random() - 0.5) * 1.2, vy: -1 - Math.random() * 0.8, grav: 0.18 }, '#ff6688', 'spark', 1.8, 36));
                p.rotV = (Math.random() - 0.5) * 0.6;
            }
        }

        enemies.forEach(e => {
            if (e.hp <= 0 || p.life <= 0) return;
            if (overlap({ x: p.wx, y: p.wy, w: p.w, h: p.h }, { x: e.x, y: e.y, w: EW, h: EH })) {
                if (p.freeze) { e.frozen = 260; burstCircle(e.x, e.y, '#88ccff', 8); sfxFreeze(); }
                else { e.hp--; burstSparks(e.x + EW / 2, e.y, '#ff8866', 8); }
                if (e.hp <= 0) { deadEffect(e.x + EW / 2, e.y); score += 200 * plr.scoreMulti; floatTxt(e.x + EW / 2, e.y, '+200', '#ffcc00'); sfxStomp(); sfxKilled(); }
                p.life = 0; updateHUD();
            }
        });
    });
    projectiles = projectiles.filter(p => p.life > 0);

    eProjectiles.forEach(ep => {
        ep.wx += ep.vx; ep.wy += ep.vy; ep.vy += (ep.grav || 0); ep.life--;
        // visual trail for fancy shots
        if (ep.trail && ep.life % 2 === 0) {
            const c = ep.friendly ? '#88ff88' : (ep.color || '#ff44aa');
            particles.push(mkParticle(ep.wx - (ep.vx * 0.5), ep.wy - (ep.vy * 0.5), { vx: -ep.vx * 0.06 + (Math.random() - 0.5) * 0.2, vy: -ep.vy * 0.06 + (Math.random() - 0.5) * 0.2, grav: 0 }, c, 'spark', 1.2, 20));
        }
        if (ep.wy + ep.h >= GY) {
            if (ep.bomb) { burstCircle(ep.wx, ep.wy, '#ff8800', 14, 5); ringPop(ep.wx, ep.wy, 'rgba(255,120,0,0.7)', 30); floatTxt(ep.wx, ep.wy, '💥', '#ff8800'); if (Math.abs(plr.x - ep.wx) < 60 && Math.abs(plr.y - ep.wy) < 60) takeDamage(); }
            ep.life = 0; return;
        }
        // shield collision: semicircular dome above player (works while moving)
        let handledByShield = false;
        if (plr.shield) {
            const sx = plr.x + plr.w / 2; const sy = plr.y + plr.h / 2;
            const baseR = Math.max(plr.w, plr.h) * 1.02;
            const dx = ep.wx - sx, dy = ep.wy - sy;
            const dist2 = dx * dx + dy * dy;
            // only consider hits from above/sides (dy should be less than ~radius)
            if (dist2 <= baseR * baseR && dy < baseR * 0.6) {
                ep.vx = -ep.vx * 1.0; ep.vy = ep.vy * -0.5; burstSparks(ep.wx, ep.wy, '#dbff88', 8);
                applyShieldHit(); ep.friendly = true; handledByShield = true;
            }
        }
        // fallback to rectangle overlap if not handled yet
        if (!handledByShield && !plr.invincible && overlap(plr, { x: ep.wx, y: ep.wy, w: ep.w, h: ep.h })) {
            if (plr.shield) {
                ep.vx = -ep.vx; ep.vy *= -0.5; burstSparks(ep.wx, ep.wy, '#dbff88', 6);
                applyShieldHit(); ep.friendly = true;
            } else { takeDamage(); ep.life = 0; }
        }

        // if this enemy projectile has been reflected by the shield, it can damage enemies
        if (ep.friendly) {
            for (const e of enemies) {
                if (e.hp <= 0) continue;
                if (overlap({ x: ep.wx, y: ep.wy, w: ep.w, h: ep.h }, { x: e.x, y: e.y, w: EW, h: EH })) {
                    e.hp--; burstSparks(e.x + EW / 2, e.y, '#ff8866', 10);
                    if (e.hp <= 0) { deadEffect(e.x + EW / 2, e.y); score += 200 * plr.scoreMulti; floatTxt(e.x + EW / 2, e.y, '+200', '#ffcc00'); sfxStomp(); sfxKilled(); }
                    ep.life = 0; updateHUD(); break;
                }
            }
        }
    });
    eProjectiles = eProjectiles.filter(ep => ep.life > 0);

    coins.forEach(c => { if (!c.got && overlap(plr, { x: c.x - 15, y: c.y - 10, w: 32, h: 24 })) { c.got = true; coinsDone++; score += 100 * plr.scoreMulti; coinEffect(c.x, c.y); floatTxt(c.x, c.y, 'Aya!', 'rgba(255,255,0,0.5)'); sfxCoin(); updateHUD(); if (coinsDone >= totalCoins) levelComplete(); } });
    pups.forEach(p => {
        if (p.spawnTimer > 0) {
            p.spawnTimer--;
            if (Math.random() < 0.12) particles.push(mkParticle(p.x + (Math.random() - 0.5) * 24, p.y + (Math.random() - 0.5) * 12, { vx: (Math.random() - 0.5) * 0.3, vy: -0.2 - Math.random() * 0.2, grav: 0.01 }, getPowerColor(p.e) || '#fff', 'spark', 1.2, 22));
        }
        if (!p.got && overlap(plr, { x: p.x - 16, y: p.y - 16, w: 36, h: 36 })) {
            p.got = true; powerupEffect(p.x, p.y, PGLOW[p.e] || '#fff'); floatTxt(p.x, p.y, (typeof p.e === 'string' && p.e.includes('<img')) ? 'POWER UP' : (typeof p.e === 'string' ? p.e : (p.e && p.e.id ? p.e.id : 'POWER UP')) + ' GET!', '#fff');
            applyPower(p.e, p.dur);
        }
    });

    // --- checkpoints carry-on: ensure flags stay within level bounds (no-op but kept for clarity)
    if (checkpoints) checkpoints.forEach(cp => { cp.x = Math.max(0, Math.min(L.W, cp.x)); });

    particles.forEach(p => { p.wx += p.vx; p.wy += p.vy; p.vy += (p.grav || 0); p.life--; p.rot += (p.rotV || 0); if (p.shape === 'ring') p.r += 2.2; });
    particles = particles.filter(p => p.life > 0);
    floatTexts.forEach(t => { t.wy += t.vy; t.alpha -= 0.013; t.life--; });
    floatTexts = floatTexts.filter(t => t.life > 0);

    const tx = plr.x - VW / 3; camera.x += (tx - camera.x) * 0.1; camera.x = Math.max(0, Math.min(L.W - VW, camera.x));
    updateStory(); updateHUD();
}

// ═══════════════════════════════════════════════
// DRAW Entities
// ═══════════════════════════════════════════════
function drawFrame() {
    ctx.clearRect(0, 0, VW, VH);
    if (state === 'title') return;
    const L = LEVELS[curLevel];
    const cx = camera.x;

        drawBackground(L.bg, L.W);
    [...plats, ...mplats].forEach(p => {
        const rx = p.x - cx; if (rx > VW + 4 || rx + p.w < -4) return;
        drawTile(rx, p.y, p.w, p.h, p.style);
        if (p.moving) { ctx.save(); ctx.strokeStyle = 'rgba(255,210,60,0.55)'; ctx.lineWidth = 2; ctx.strokeRect(rx + 1, p.y + 1, p.w - 2, p.h - 2); ctx.restore(); }
    });
    drawGround(L.bg);
    hazards.forEach(h => drawHazardDecal(h, cx));

    coins.forEach(c => {
        if (c.got) return;
        const rx = c.x - cx; if (rx < -40 || rx > VW + 40) return;
        const bob = Math.sin(Date.now() / 300 + c.x * 0.012) * 5, rot = Math.sin(Date.now() / 400 + c.x * 0.008) * 0.3;
        ctx.save(); ctx.translate(rx, c.y + bob); ctx.rotate(rot);
        ctx.strokeStyle = 'rgba(255,255,0,0.1)'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,0,0.2)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.stroke();
        if (Math.random() < 0.05) particles.push(mkParticle(c.x + (Math.random() - 0.5) * 30, c.y + bob + (Math.random() - 0.5) * 20, { vx: (Math.random() - 0.5) * 0.5, vy: -0.5 - Math.random() * 0.3, grav: 0.01 }, '#00ffff', 'spark', 1.5, 20));
        ctx.font = 'bold 16px "Press Start 2P",monospace'; ctx.fillStyle = '#FFDE21'; ctx.shadowColor = 'rgba(255,255,0,0.7)'; ctx.shadowBlur = 18; ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.strokeText('Aya', 0, 0); ctx.fillText('Aya', 0, 0); ctx.restore();
    });

    // draw checkpoint flags
    if (checkpoints && checkpoints.length > 0) {
        checkpoints.forEach((cp, idx) => {
            const rx = cp.x - cx, ry = cp.y;
            if (rx < -40 || rx > VW + 40) return;
            ctx.save();
            // pole
            ctx.strokeStyle = '#222'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx, ry - 28); ctx.stroke();
            // base
            ctx.fillStyle = '#444'; ctx.fillRect(rx - 6, ry, 12, 6);
            // banner — animate wave
            const t = Date.now();
            const wave = Math.sin(t * 0.01 + idx) * 2;
            const visited = !!cp.visited;
            ctx.save(); ctx.translate(rx, ry - 22);
            // flag background
            ctx.fillStyle = visited ? '#ffd86b' : '#ff66aa';
            ctx.beginPath(); ctx.moveTo(0, -6); ctx.quadraticCurveTo(18 + wave, -10, 34 + wave, -6); ctx.quadraticCurveTo(18 + wave, -2, 0, -6); ctx.closePath(); ctx.fill();
            // flag emblem
            ctx.fillStyle = visited ? '#222' : '#fff'; ctx.font = '12px "Press Start 2P"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('⚑', 14 + wave, -6);
            ctx.restore();
            // glow for active checkpoint
            if (cp.visited) {
                ctx.beginPath(); ctx.strokeStyle = 'rgba(255,220,120,0.6)'; ctx.lineWidth = 6; ctx.arc(rx, ry - 14, 18 + Math.sin(t * 0.01) * 2, 0, Math.PI * 2); ctx.stroke();
            }
            ctx.restore();
        });
    }

    pups.forEach(p => {
        if (p.got) return;
        const rx = p.x - cx; if (rx < -40 || rx > VW + 40) return;
        const t = Date.now();
        const bob = Math.sin(t / 260 + p.x * 0.012) * 6;
        const basePulse = Math.sin(t / 200 + p.x * 0.01) * 0.1 + 1;
        const spawnFrac = (p.spawnTimer || 0) / 46;
        const pulse = basePulse * (1 + spawnFrac * 0.18);

        // spawn ring / glow when appearing
        if (spawnFrac > 0) {
            ctx.save();
            const color = getPowerColor(p.e) || '#fff';
            ctx.globalAlpha = 0.9 * spawnFrac;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2 + spawnFrac * 4;
            const r = 20 + (1 - spawnFrac) * 12 + Math.sin(t * 0.01 + p.x) * 2;
            ctx.beginPath(); ctx.arc(rx, p.y + bob, r, 0, Math.PI * 2); ctx.stroke();
            ctx.globalCompositeOperation = 'lighter';
            for (let k = 0; k < 4; k++) {
                const a = t * 0.004 + k * Math.PI * 2 / 4;
                const ox = rx + Math.cos(a) * (r - 6);
                const oy = p.y + bob + Math.sin(a) * (r - 8);
                ctx.fillStyle = color + '88'; ctx.beginPath(); ctx.arc(ox, oy, 2 + spawnFrac * 2, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';
            ctx.restore();
        }

        ctx.save(); ctx.translate(rx, p.y + bob); ctx.scale(pulse, pulse);
        if (p.e.includes('<img')) {
            const srcMatch = p.e.match(/src="([^"]+)"/);
            if (srcMatch) {
                const src = srcMatch[1]; if (!pupImgCache[src]) { pupImgCache[src] = new Image(); pupImgCache[src].src = src; }
                if (pupImgCache[src].complete) ctx.drawImage(pupImgCache[src], -24, -24, 48, 48); else { ctx.fillStyle = '#fff'; ctx.fillRect(-24, -24, 48, 48); }
            }
        } else { ctx.font = '32px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(p.e, 0, 0); }

        // small continuous spawn particles while spawnTimer active
        if (spawnFrac > 0 && Math.random() < 0.16) particles.push(mkParticle(p.x + (Math.random() - 0.5) * 30, p.y + bob + (Math.random() - 0.5) * 18, { vx: (Math.random() - 0.5) * 0.6, vy: -0.2 - Math.random() * 0.4, grav: 0.01 }, getPowerColor(p.e) || '#fff', 'spark', 1.6, 26));
        else if (Math.random() < 0.08) particles.push(mkParticle(p.x + (Math.random() - 0.5) * 40, p.y + bob + (Math.random() - 0.5) * 30, { vx: (Math.random() - 0.5) * 0.8, vy: -0.3 - Math.random() * 0.4, grav: 0.005 }, PGLOW[p.e] || '#fff', 'spark', 2, 25));
        ctx.restore();
    });

    enemies.forEach(e => {
    if (e.hp <= 0) return;
    const rx = e.x - cx + EW / 2; if (rx > VW + 80 || rx < -80) return;
    const t = Date.now();
    const bob = Math.sin(t / 210 + e.origX * 0.012) * 3;
    const by = e.y + bob;
    const isArmored = e.type === 'armored';
    const isShooter = e.type === 'shooter';
    const isBomber = e.type === 'bomber';
    const isFast = e.type === 'fast';
    const isFrozen = e.frozen > 0;

    ctx.save();

    // ─── HELPER: radial gradient fill ───────────────────────────────────────────
    const radGrad = (x, y, r0, r1, c0, c1) => {
        const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
        g.addColorStop(0, c0); g.addColorStop(1, c1); return g;
    };

    // ══════════════════════════════════════════════════════════════════════════════
    // FROZEN OVERRIDE — icy blue crystal look
    // ══════════════════════════════════════════════════════════════════════════════
    if (isFrozen) {
        // outer ice aura
        ctx.shadowColor = '#00eeff'; ctx.shadowBlur = 30;
        // ice block encasing
        ctx.fillStyle = 'rgba(0,200,255,0.18)';
        ctx.beginPath(); ctx.ellipse(rx, by + EH * 0.45, EW * 0.58, EH * 0.62, 0, 0, Math.PI * 2); ctx.fill();

        // crystal shard decorations
        ctx.strokeStyle = 'rgba(120,240,255,0.7)'; ctx.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) {
            const ang = (i / 6) * Math.PI * 2 + t / 2000;
            const sr = EW * 0.55, sx = rx + Math.cos(ang) * sr, sy = by + EH * 0.45 + Math.sin(ang) * sr * 0.75;
            ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(ang) * 8, sy + Math.sin(ang) * 8); ctx.stroke();
        }

        // body (frozen)
        ctx.fillStyle = radGrad(rx, by + EH * 0.35, 2, EW * 0.42, '#aaeeff', '#0099cc');
        ctx.beginPath(); ctx.ellipse(rx, by + EH * 0.56, EW * 0.42, EH * 0.42, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#44eeff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(rx, by + EH * 0.56, EW * 0.42, EH * 0.42, 0, 0, Math.PI * 2); ctx.stroke();

        // ice crack pattern on body
        ctx.strokeStyle = 'rgba(200,250,255,0.5)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(rx - 4, by + EH * 0.38); ctx.lineTo(rx + 2, by + EH * 0.5); ctx.lineTo(rx - 3, by + EH * 0.62); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx + 6, by + EH * 0.42); ctx.lineTo(rx + 1, by + EH * 0.52); ctx.stroke();

        // head (frozen)
        ctx.fillStyle = radGrad(rx - 3, by + EH * 0.12, 2, EW * 0.3, '#cceeff', '#0088bb');
        ctx.beginPath(); ctx.arc(rx, by + EH * 0.2, EW * 0.29, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#88ddff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(rx, by + EH * 0.2, EW * 0.29, 0, Math.PI * 2); ctx.stroke();

        // frozen eyes — wide open, glassy
        const eo = e.dir > 0 ? 5 : -5;
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(rx + eo, by + EH * 0.16, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(rx - eo + e.dir * 2, by + EH * 0.16, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0055aa'; ctx.beginPath(); ctx.arc(rx + eo, by + EH * 0.16, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0055aa'; ctx.beginPath(); ctx.arc(rx - eo + e.dir * 2, by + EH * 0.16, 2.2, 0, Math.PI * 2); ctx.fill();
        // tiny white sparkle on pupil
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(rx + eo + 1, by + EH * 0.145, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(rx - eo + e.dir * 2 + 1, by + EH * 0.145, 0.9, 0, Math.PI * 2); ctx.fill();

        // frozen label + snowflake
        ctx.shadowBlur = 0;
        ctx.font = '15px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText('❄️', rx, by - 2);
        ctx.font = '8px "Press Start 2P", monospace'; ctx.fillStyle = '#88eeff'; ctx.fillText('[FROZEN]', rx, by - 16);
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // ARMORED ENEMY — cracked iron golem, molten lava seeping through fractures
    // ══════════════════════════════════════════════════════════════════════════════
    else if (isArmored) {
        ctx.shadowColor = '#ff6600'; ctx.shadowBlur = 28;

        // molten outer pulse ring
        const mPulse = 0.88 + Math.sin(t / 280) * 0.1;
        ctx.strokeStyle = `rgba(255,80,0,${mPulse * 0.5})`; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.ellipse(rx, by + EH * 0.55, EW * 0.56 * mPulse, EH * 0.56 * mPulse, 0, 0, Math.PI * 2); ctx.stroke();

        // iron body — dark cold grey
        ctx.fillStyle = radGrad(rx - 6, by + EH * 0.3, 4, EW * 0.52, '#555566', '#111118');
        ctx.beginPath(); ctx.ellipse(rx, by + EH * 0.56, EW * 0.46, EH * 0.46, 0, 0, Math.PI * 2); ctx.fill();

        // surface plate lines
        ctx.strokeStyle = 'rgba(80,80,100,0.8)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(rx - 14, by + EH * 0.42); ctx.lineTo(rx - 6, by + EH * 0.68); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx + 8, by + EH * 0.44); ctx.lineTo(rx + 16, by + EH * 0.62); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx - 5, by + EH * 0.44); ctx.lineTo(rx + 4, by + EH * 0.70); ctx.stroke();

        // LAVA CRACKS — glowing orange seams
        const lavaFlicker = 0.7 + Math.sin(t / 120) * 0.3;
        ctx.strokeStyle = `rgba(255,120,0,${lavaFlicker})`; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        ctx.shadowColor = '#ff6600'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.moveTo(rx - 3, by + EH * 0.42); ctx.lineTo(rx + 5, by + EH * 0.52); ctx.lineTo(rx - 2, by + EH * 0.62); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx + 10, by + EH * 0.46); ctx.lineTo(rx + 4, by + EH * 0.55); ctx.lineTo(rx + 9, by + EH * 0.65); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx - 12, by + EH * 0.5); ctx.lineTo(rx - 6, by + EH * 0.57); ctx.stroke();
        ctx.strokeStyle = `rgba(255,220,80,${lavaFlicker * 0.6})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(rx - 3, by + EH * 0.42); ctx.lineTo(rx + 5, by + EH * 0.52); ctx.lineTo(rx - 2, by + EH * 0.62); ctx.stroke();
        ctx.shadowBlur = 28;

        // iron shoulder pauldrons
        ctx.fillStyle = radGrad(rx - EW * 0.42, by + EH * 0.38, 0, EW * 0.22, '#777788', '#222230');
        ctx.beginPath(); ctx.ellipse(rx - EW * 0.42, by + EH * 0.42, EW * 0.18, EH * 0.14, -0.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = radGrad(rx + EW * 0.42, by + EH * 0.38, 0, EW * 0.22, '#777788', '#222230');
        ctx.beginPath(); ctx.ellipse(rx + EW * 0.42, by + EH * 0.42, EW * 0.18, EH * 0.14, 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#aaaacc';
        ctx.beginPath(); ctx.arc(rx - EW * 0.42, by + EH * 0.4, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(rx + EW * 0.42, by + EH * 0.4, 2.5, 0, Math.PI * 2); ctx.fill();

        // thick stone neck
        ctx.fillStyle = radGrad(rx, by + EH * 0.35, 0, 10, '#555566', '#111118');
        ctx.beginPath(); ctx.rect(rx - 8, by + EH * 0.3, 16, EH * 0.16); ctx.fill();

        // HEAD — square iron block helmet
        ctx.fillStyle = radGrad(rx - 5, by + EH * 0.08, 3, EW * 0.34, '#666677', '#1a1a22');
        ctx.beginPath(); ctx.roundRect(rx - EW * 0.3, by + EH * 0.0, EW * 0.6, EH * 0.3, 5); ctx.fill();
        ctx.strokeStyle = '#444455'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(rx - EW * 0.3, by + EH * 0.0, EW * 0.6, EH * 0.3, 5); ctx.stroke();

        // helmet corner rivets
        ctx.fillStyle = '#999aaa';
        [[-0.24, 0.03], [0.24, 0.03], [-0.24, 0.25], [0.24, 0.25]].forEach(([bx, by2]) => {
            ctx.beginPath(); ctx.arc(rx + EW * bx, by + EH * by2, 2.2, 0, Math.PI * 2); ctx.fill();
        });

        // T-shaped visor slit
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(rx - EW * 0.22, by + EH * 0.1, EW * 0.44, 5);
        ctx.fillRect(rx - 4, by + EH * 0.08, 8, EH * 0.16);
        ctx.strokeStyle = `rgba(255,100,0,${lavaFlicker * 0.8})`; ctx.lineWidth = 1;
        ctx.strokeRect(rx - EW * 0.22, by + EH * 0.1, EW * 0.44, 5);

        // blazing eyes through visor
        const eo = e.dir > 0 ? 5 : -5;
        ctx.fillStyle = '#ff4400'; ctx.shadowColor = '#ff2200'; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(rx + eo, by + EH * 0.125, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(rx - eo + e.dir * 2, by + EH * 0.125, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffcc00'; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(rx + eo, by + EH * 0.125, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(rx - eo + e.dir * 2, by + EH * 0.125, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 28;

        // crown spikes
        ctx.fillStyle = '#444455';
        ctx.beginPath(); ctx.moveTo(rx - 10, by + EH * 0.0); ctx.lineTo(rx - 14, by - EH * 0.1); ctx.lineTo(rx - 6, by + EH * 0.0); ctx.fill();
        ctx.beginPath(); ctx.moveTo(rx - 2, by + EH * 0.0); ctx.lineTo(rx, by - EH * 0.13); ctx.lineTo(rx + 2, by + EH * 0.0); ctx.fill();
        ctx.beginPath(); ctx.moveTo(rx + 6, by + EH * 0.0); ctx.lineTo(rx + 14, by - EH * 0.1); ctx.lineTo(rx + 10, by + EH * 0.0); ctx.fill();
        ctx.fillStyle = `rgba(255,80,0,${lavaFlicker * 0.7})`;
        ctx.beginPath(); ctx.arc(rx - 14, by - EH * 0.1, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(rx, by - EH * 0.13, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(rx + 14, by - EH * 0.1, 2, 0, Math.PI * 2); ctx.fill();

        // label
        ctx.shadowBlur = 0;
        ctx.font = 'bold 9px "Press Start 2P", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#ff8844'; ctx.fillText('ARMORED', rx, by - 2);
        ctx.font = '7px "Press Start 2P", monospace'; ctx.fillStyle = '#ffaa44'; ctx.fillText('NO STOMP', rx, by - 13);
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // SHOOTER ENEMY — sleek purple/pink sci-fi sniper
    // ══════════════════════════════════════════════════════════════════════════════
    else if (isShooter) {
        ctx.shadowColor = '#ff00cc'; ctx.shadowBlur = 20;

        // outer energy ring (pulsing)
        const pulse = 0.85 + Math.sin(t / 160) * 0.12;
        ctx.strokeStyle = `rgba(255,0,200,${pulse * 0.7})`; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(rx, by + EH * 0.55, EW * 0.52 * pulse, EH * 0.52 * pulse, 0, 0, Math.PI * 2); ctx.stroke();
        // second ring
        ctx.strokeStyle = `rgba(180,0,255,${p

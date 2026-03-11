// ═══════════════════════════════════════════════
// PARTICLE SYSTEM
// ═══════════════════════════════════════════════
let particles = [];
let floatTexts = [];

function mkParticle(wx, wy, opts) {
    return {
        wx, wy, vx: opts.vx || 0, vy: opts.vy || 0, grav: opts.grav || 0,
        color: opts.color || 'rgba(255, 255, 255, 0.4)', shape: opts.shape || 'circle',
        r: opts.r || 3, life: opts.life || 30, ml: opts.life || 30,
        rot: Math.random() * Math.PI * 2, rotV: opts.rotV || 0, alpha: 1
    };
}

function burstCircle(wx, wy, color, n = 10, speed = 3.5) {
    for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, s = speed * (0.4 + Math.random() * 0.8);
        particles.push(mkParticle(wx, wy, {
            vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.5, grav: 0.18,
            color, shape: 'circle', r: 2 + Math.random() * 2.5, life: 28 + Math.random() * 14
        }));
    }
}

function burstSparks(wx, wy, color, n = 8) {
    for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 5;
        particles.push(mkParticle(wx, wy, {
            vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, grav: 0.25,
            color, shape: 'spark', r: 1.5 + Math.random() * 1.5, life: 20 + Math.random() * 12, rotV: 0.3
        }));
    }
}

function ringPop(wx, wy, color, r = 20) {
    particles.push(mkParticle(wx, wy, { color, shape: 'ring', r, life: 18, grav: 0 }));
}

function stompEffect(wx, wy) {
    burstSparks(wx, wy, '#ffdd44', 12);
    ringPop(wx, wy, 'rgba(255,220,100,0.7)', 18);
}

function coinEffect(wx, wy) {
    burstCircle(wx, wy, 'rgba(227, 255, 21, 0.8)', 6, 2.5);
    for (let i = 0; i < 4; i++) particles.push(mkParticle(wx, wy, {
        vx: (Math.random() - 0.5) * 2, vy: -3 - Math.random() * 2, grav: 0.1,
        color: 'rgba(227, 255, 21, 0.8)', shape: 'spark', r: 1, life: 22
    }));
    ringPop(wx, wy, 'rgba(245, 40, 145, 0.5)', 14);
}

function hurtEffect(wx, wy) {
    burstCircle(wx, wy, '#ff3333', 10, 4);
    burstSparks(wx, wy, '#ff8888', 8);
    ringPop(wx, wy, 'rgba(255,60,60,0.6)', 24);
}

function powerupEffect(wx, wy, color) {
    burstCircle(wx, wy, color, 20, 15);
    ringPop(wx, wy, color + 'aa', 28);
    ringPop(wx, wy, color + '66', 40);
}

function deadEffect(wx, wy) {
    burstCircle(wx, wy, '#ff4444', 16, 6);
    burstSparks(wx, wy, '#ffaa44', 14);
    ringPop(wx, wy, 'rgba(255,80,80,0.5)', 32);
}

function jumpEffect(wx, wy) {
    for (let i = 0; i < 4; i++) particles.push(mkParticle(wx, wy, {
        vx: (Math.random() - 0.5) * 2, vy: 1, grav: -0.05,
        color: 'rgba(220,220,255,0.5)', shape: 'circle', r: 3 + i, life: 12 - i * 2
    }));
}

function floatTxt(wx, wy, txt, color = '#ffff88') {
    floatTexts.push({ wx, wy, txt, color, alpha: 1, vy: -1.4, life: 70 });
}

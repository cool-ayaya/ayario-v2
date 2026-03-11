// ═══════════════════════════════════════════════
// AUDIO ENGINE
// ═══════════════════════════════════════════════
let AC, muted = false;

function initAudio() {
    if (AC) return;
    AC = new (window.AudioContext || window.webkitAudioContext)();
    startBgMusic();
}

document.getElementById('muteBtn').onclick = () => {
    muted = !muted;
    document.getElementById('muteBtn').textContent = muted ? '🔇' : '🔊';
    if (AC) { if (muted) AC.suspend(); else AC.resume(); }
    if (typeof bgAudioEl !== 'undefined' && bgAudioEl) bgAudioEl.volume = muted ? 0 : 0.6;
};

// ── helpers ──
function mkOsc(type, freq, vol, dur, when) {
    if (!AC || muted) return;
    const g = AC.createGain(), o = AC.createOscillator();
    o.type = type; o.frequency.setValueAtTime(freq, when || AC.currentTime);
    g.gain.setValueAtTime(vol, when || AC.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, (when || AC.currentTime) + dur);
    o.connect(g); g.connect(AC.destination);
    o.start(when || AC.currentTime); o.stop((when || AC.currentTime) + dur + 0.01);
}

function mkNoise(vol, dur, when) {
    if (!AC || muted) return;
    const buf = AC.createBuffer(1, AC.sampleRate * dur, AC.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = AC.createBufferSource(), g = AC.createGain();
    src.buffer = buf; g.gain.setValueAtTime(vol, when || AC.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, (when || AC.currentTime) + dur);
    src.connect(g); g.connect(AC.destination);
    src.start(when || AC.currentTime);
}

// ── sound effects ──
function sfxJump() { mkOsc('square', 280, 0.22, 0.12); mkOsc('square', 420, 0.15, 0.09, AC.currentTime + 0.06); }
function sfxStomp() { mkOsc('square', 180, 0.3, 0.08); mkOsc('square', 80, 0.25, 0.12, AC.currentTime + 0.04); }
function sfxKilled() { if (!muted) { try { const audio = new Audio('music/killed.mp3'); audio.play().catch(() => {}); } catch (e) {} } }
function sfxCoin() { if (!muted) { const audio = new Audio('ayaya.mp3'); audio.play(); } }
// synthesized footstep effect (low thump + tiny click)
function sfxFootstep() {
    if (!AC || muted) return;
    const t = AC.currentTime;
    mkNoise(0.06, 0.04, t);
    mkOsc('square', 220, 0.03, 0.06, t + 0.01);
}
function sfxHurt() { mkOsc('sawtooth', 120, 0.3, 0.18); mkNoise(0.15, 0.12); }
function sfxPowerup() { [440, 550, 660, 770, 880].forEach((f, i) => mkOsc('square', f, 0.18, 0.1, AC.currentTime + i * 0.07)); }
function sfxShoot() { mkOsc('square', 320, 0.15, 0.07); mkOsc('square', 480, 0.1, 0.06, AC.currentTime + 0.03); }
function sfxEnemyShoot() { mkOsc('triangle', 200, 0.12, 0.09); mkOsc('sawtooth', 150, 0.08, 0.07, AC.currentTime + 0.04); }
function sfxDead() { [220, 180, 140, 100, 70].forEach((f, i) => mkOsc('sawtooth', f, 0.2, 0.15, AC.currentTime + i * 0.1)); }
function sfxLevelClear() { [440, 494, 523, 587, 659, 698, 784, 880].forEach((f, i) => mkOsc('square', f, 0.18, 0.18, AC.currentTime + i * 0.1)); }
function sfxFreeze() { for (let i = 0; i < 6; i++) mkOsc('sine', 800 + i * 120, 0.08, 0.08, AC.currentTime + i * 0.04); }

// ── background music (looping) ──
let bgMusicNodes = [];
let bgAudioEl = null;
function playBgTrack(src, vol = 0.6) {
    stopBgMusic();
    if (bgAudioEl) try { bgAudioEl.pause(); } catch (e) {}
    bgAudioEl = new Audio(src);
    bgAudioEl.loop = true;
    bgAudioEl.volume = muted ? 0 : vol;
    bgAudioEl.play().catch(() => {});
}
function stopBgTrack() { if (bgAudioEl) { try { bgAudioEl.pause(); } catch (e) {} bgAudioEl = null; } }
function restoreBgMusic() { stopBgTrack(); startBgMusic(); }

function startBgMusic() {
    if (!AC || muted) return;
    stopBgMusic();
    const BPM = 148, BEAT = 60 / BPM;
    const melody = [
        [659, 1], [523, 0.5], [587, 0.5], [659, 1], [523, 1],
        [494, 1], [440, 1], [392, 1], [440, 0.5], [494, 0.5],
        [523, 1], [440, 1], [392, 0.5], [349, 0.5], [392, 1],
        [440, 1], [523, 1], [587, 0.5], [659, 0.5]
    ];
    const bass = [
        [165, 1], [131, 1], [147, 1], [110, 1], [131, 1], [165, 1], [147, 1], [196, 1],
        [165, 1], [131, 1], [147, 1], [110, 1], [131, 1], [165, 1], [196, 1], [220, 1]
    ];

    function schedulePattern() {
        if (!AC || muted) return;
        let t = AC.currentTime + 0.05;
        let loopIdx = 0;
        function doLoop() {
            melody.forEach(([f, dur]) => {
                mkOsc('square', f, 0.12, dur * BEAT * 0.85, t);
                t += dur * BEAT;
            });
            let bt = AC.currentTime + 0.05 + loopIdx * melody.reduce((s, [, d]) => s + d, 0) * BEAT;
            bass.forEach(([f, dur]) => { mkOsc('triangle', f, 0.18, dur * BEAT * 0.9, bt); bt += dur * BEAT; });
            const melDur = melody.reduce((s, [, d]) => s + d, 0) * BEAT;
            for (let i = 0; i < melDur / BEAT * 2; i++) mkNoise(0.04, 0.06, AC.currentTime + 0.05 + loopIdx * melDur + i * (BEAT / 2));
            loopIdx++;
        }
        doLoop();
        const loopDur = melody.reduce((s, [, d]) => s + d, 0) * BEAT * 1000;
        const tid = setInterval(() => { if (!AC || muted) { clearInterval(tid); return; } doLoop(); }, loopDur);
        bgMusicNodes.push(tid);
    }
    schedulePattern();
}

function stopBgMusic() { bgMusicNodes.forEach(id => clearInterval(id)); bgMusicNodes = []; }

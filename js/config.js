// ═══════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════
let VW = 800, VH = 400;
const G = 0.46, JF = -12, SPD = 4.0, TILE = 32;
const PW = 36, PH = 30, EW = 44, EH = 30;
let GY = VH - TILE;

const PGLOW = {
    '❤️': '#ff1493',
    '<img loading="lazy" alt="Telemoji (November 2023)" class="w-auto h-full" src="emojis/crying.png">': '#00ff88',
    '🤨': '#0088ff',
    '🙂': '#88ff00',
    '<img loading="lazy" alt="Telemoji (November 2023)" class="w-auto h-full" src="emojis/eyebrow.png">': '#fff705',
    '👍': '#ffaa00'
};

// ═══════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════
let state = 'title';
let curLevel = 0, lives = 3, score = 0;
let camera = { x: 0 };
let keys = {};
let projectiles = [];   // player projectiles
let eProjectiles = [];  // enemy projectiles
let plats = [], mplats = [], hazards = [], enemies = [], coins = [], pups = [];
let totalCoins = 0, coinsDone = 0;
let lastStory = '';
const pupImgCache = {};

const plr = {
    x: 55, y: GY - PH, vx: 0, vy: 0, w: PW, h: PH,
    onGround: false, dir: 1, jumpCount: 0,
    power: null, powerTimer: 0,
    invincible: false, invTimer: 0,
    canDoubleJump: false,
    shield: false,
    scoreMulti: 1,
    shootCD: 0,
    animTimer: 0, animFrame: 0, animState: 'idle'
};

// ═══════════════════════════════════════════════
// LEVEL DATA
// ═══════════════════════════════════════════════

// Stories
const STORIES = [
    [[0, "Hey Aya! Collect all Aya's to win"], [700, "Use your cool Emojis to defeat me"], [1500, "Aya will wipe Souhaib's tears with her cool papier mouchoirs"], [2300, "They can shoot! but Aya just side-eye them"], [2750, "That's annoying huh, sorry!."], [3900, "Last Aya sign visible! One final sprint and Souhaib go cries."]],
    [[0, "Chapter 2: Use your cool side eye look to kill Souhaib"], [600, "His patrol squads are faster here. Some even shoot back. Nobody warned Aya about this."], [1400, "Aya finds the side eye look emoji, Souhaib is doomed."], [2200, "The Ayas are hidden in narrow passages. Deliberate. Petty. Very Souhaib."], [3100, "Three shooter Souhaib squads block the exit. Aya loads up and charges through."], [4000, "The city cheers, silently, because they may make our cool Aya angry"]],
    [[0, "Chapter 3: The Lava Castle. Souhaib sits on a throne of stolen Aya's. Actual villain arc."], [800, "He's made armored variants of himself. They can't be stomped. Aya will need to shoot."], [1700, "LAVA FLOOR SECTIONS. Moving platforms. Armored shooters. This is the finale."], [2600, "Three armored Souhaib units fire simultaneously. Aya activates INVINCIBLE mode. They regret it."], [3500, "😭 INVINCIBLE Aya plows through everything. The castle literally shakes. Dramatic."], [4400, "NOOOO!!! Not again!! I promise I won't let this happen again Aya!"]],
];

// Helpers for level creation
function P(x, y, w, s = 'grass') { return { x, y, w, h: TILE, style: s, moving: false }; }
function MP(x, y, w, s, dx, x1, x2) { return { x, y, w, h: TILE - 10, style: s, moving: true, dx, x1, x2, ox: x }; }
function TH(x, w) { return { x, y: GY - 26, w, h: 26, type: 'thorn' }; }
function HOLE(x, w) { return { x, y: GY, w, h: TILE, type: 'hole' }; }
function EN(x, x1, x2, spd, hp, type = 'normal', platY = null) {
    return {
        x, y: platY || GY - EH, patX1: x1, patX2: x2, spd, hp, maxHp: hp, type, dir: 1, vy: 0,
        frozen: 0, origX: x, platY: platY, shootCD: type === 'shooter' || type === 'bomber' ? 120 + Math.random() * 60 : 9999
    };
}

const LEVELS = [
    // ─── LEVEL 1: GREEN MEADOW ─────────────────────────────────────────────────
    {
        name: 'Meadow', bg: 'sky', W: 5000, story: STORIES[0],
        ps: { x: 55, y: GY - PH },
        mplat: [
            MP(3500, GY - TILE * 3, 150, 'grass', 2.0, 3400, 3600),
            MP(3950, GY - TILE * 2, 150, 'grass', 2.0, 3800, 4000),
        ],
        cps: [
                { x: 3100, y: GY - TILE - 100 },
            ],
        haz: [ 
            // checkpoint positions (flags)
            
            // TH(2300, 95), 
            HOLE(2000, 150),
            HOLE(3200, 1100)
            ],
        enems: [
        
            EN(600, 500, 850, 1.3, 1, 'normal', GY - TILE),
            EN(800, 500, 850, 1.3, 1, 'normal', GY - TILE),

            EN(1500, 1300, 1600, 1.3, 1, 'normal', GY - TILE- 180),
            EN(1200, 1300, 1600, 1.3, 1, 'normal', GY - TILE- 180),

            EN(1600, 1400, 2000, 3, 1, 'fast', GY - TILE),
            EN(1700, 1700, 2000, 1.3, 1, 'normal', GY - TILE),
            EN(1850, 1600, 1800, 1.3, 1, 'normal', GY - TILE),


            EN(2900, 2200, 3000, 1.3, 1, 'shooter', GY - TILE),
            EN(2700, 2200, 3000, 1.3, 1, 'shooter', GY - TILE),
            EN(2500, 2200, 3000, 1.3, 1, 'shooter', GY - TILE),
            EN(4700, 4400, 4800, 1.3, 1, 'armored', GY - TILE),
      
        ],
        coins: [
            { x: 300, y: GY - TILE },
            { x: 400, y: GY - TILE },
            { x: 500, y: GY - TILE },
            { x: 1150, y: GY - TILE - 120},
            { x: 1050, y: GY - TILE - 120},

            { x: 100, y: GY - TILE},
            { x: 1600, y: GY - TILE},
            { x: 1700, y: GY - TILE},
            { x: 1800, y: GY - TILE},
            
    
            { x: 2400, y: GY - TILE},
            { x: 2500, y: GY - TILE},
            
            { x: 3575, y: GY - TILE * 3 - 20},
            { x: 4025, y: GY - TILE * 2 - 20},



           
            { x: 4900, y: GY - TILE},

        ],
        pups: [
            // { x: 2200, y: GY - TILE, e: '<img loading="lazy" alt="Telemoji (November 2023)" class="w-auto h-full" src="emojis/crying.png">' },
           
            // { x: 200, y: GY - TILE, e: '<img loading="lazy" alt="Telemoji (November 2023)" class="w-auto h-full" src="emojis/eyebrow.png">' },
            { x: 4400, y: GY - TILE, e: '<img loading="lazy" alt="Telemoji (November 2023)" class="w-auto h-full" src="emojis/crying.png">', dur: 10 },
            // { x: 400, y: GY - TILE, e: '❤️' },
            
            
            { x: 2200, y: GY - TILE, e: '<img loading="lazy" alt="Telemoji (November 2023)" class="w-auto h-full" src="emojis/eyebrow.png">', dur: 20},
            { x: 1550, y: GY - TILE - 180, e: '❤️', dur:15 },
        ],
        plat: [ 
            P(1000, GY - TILE - 90, 200, 'grass'),
            P(1300, GY - TILE - 150, 300, 'grass'),


            P(3000, GY - TILE - 95, 300, 'grass'),
            P(3000, GY - TILE - 64, 300, 'grass-wall'),
            P(3000, GY - TILE - 32, 200, 'grass-wall'),
            P(3000, GY - TILE, 200, 'grass-wall'),

            // P(400, GY - TILE - 90, 200, 'grass-wall'),
            // P(400, GY - TILE - 120, 200, 'grass-wall'),

            
        ]
    },
    // ─── LEVEL 2: NIGHT CITY ───────────────────────────────────────────────────
    {
        name: 'Night City', bg: 'night', W: 4200, story: STORIES[1],
        ps: { x: 50, y: GY - PH },
        plat: [
            P(120, GY - TILE, 64, 'metal'), P(184, GY - TILE * 2, 64, 'metal'), P(248, GY - TILE * 3, 64, 'metal'), P(312, GY - TILE * 2, 64, 'metal'), P(376, GY - TILE, 64, 'metal'),
            P(480, GY - TILE * 4, 220, 'metal'), P(460, GY - TILE * 2, 64, 'metal'),
            P(780, GY - TILE * 2, 80, 'metal'), P(840, GY - TILE * 5, 80, 'metal'), P(920, GY - TILE * 3, 80, 'metal'), P(1000, GY - TILE * 5, 80, 'metal'),
            P(1100, GY - TILE, 64, 'metal'), P(1164, GY - TILE * 2, 64, 'metal'), P(1228, GY - TILE * 3, 64, 'metal'), P(1292, GY - TILE * 4, 64, 'metal'), P(1356, GY - TILE * 5, 80, 'metal'),
            P(1480, GY - TILE * 5, 100, 'metal'), P(1600, GY - TILE * 3, 100, 'metal'), P(1720, GY - TILE * 6, 100, 'metal'),
            P(1880, GY - TILE * 4, 220, 'metal'),
            P(2180, GY - TILE * 2, 80, 'metal'), P(2280, GY - TILE * 5, 80, 'metal'), P(2380, GY - TILE * 3, 80, 'metal'), P(2480, GY - TILE * 6, 80, 'metal'),
            P(2580, GY - TILE * 5, 64, 'metal'), P(2644, GY - TILE * 4, 64, 'metal'), P(2708, GY - TILE * 3, 64, 'metal'), P(2772, GY - TILE * 2, 64, 'metal'),
            P(2900, GY - TILE * 4, 300, 'metal'),
            P(3280, GY - TILE * 6, 80, 'metal'), P(3380, GY - TILE * 3, 80, 'metal'), P(3480, GY - TILE * 5, 80, 'metal'), P(3580, GY - TILE * 2, 80, 'metal'), P(3680, GY - TILE * 4, 120, 'metal'),
            P(3860, GY - TILE * 3, 100, 'metal'), P(3980, GY - TILE * 5, 100, 'metal'), P(4100, GY - TILE * 3, 80, 'metal'),
        ],
        mplat: [
            MP(700, GY - TILE * 3, 90, 'metal', 2.0, 640, 900),
            MP(1080, GY - TILE * 4, 80, 'metal', 2.2, 980, 1140),
            MP(1820, GY - TILE * 5, 80, 'metal', 2.4, 1750, 1960),
            MP(2540, GY - TILE * 4, 80, 'metal', 2.6, 2460, 2660),
            MP(3200, GY - TILE * 5, 90, 'metal', 2.8, 3120, 3360),
            MP(3820, GY - TILE * 4, 80, 'metal', 3.0, 3720, 3940),
        ],
        haz: [
            TH(100, 36), TH(440, 54), TH(750, 54), TH(1060, 36), TH(1440, 54), TH(1840, 36), TH(2140, 54), TH(2860, 36), TH(3240, 54), TH(3660, 54), TH(4060, 36),
            HOLE(700, 56), HOLE(1060, 62), HOLE(1820, 52), HOLE(2560, 48), HOLE(3220, 56), HOLE(3760, 52),
        ],
        enems: [
            EN(160, 120, 440, 1.7, 1),
            EN(540, 480, 690, 1.5, 1, 'shooter', GY - TILE * 4 - EH),
            EN(600, 480, 690, 2.0, 1, 'fast', GY - TILE * 4 - EH),
            EN(860, 780, 995, 1.8, 1),
            EN(1160, 1100, 1350, 2.0, 1),
            EN(1500, 1480, 1590, 1.8, 1, 'armored', GY - TILE * 5 - EH),
            EN(1740, 1720, 1810, 2.0, 1, 'shooter', GY - TILE * 6 - EH),
            EN(1920, 1880, 2090, 2.2, 1, 'fast', GY - TILE * 4 - EH),
            EN(2010, 1880, 2090, 1.8, 1, 'armored', GY - TILE * 4 - EH),
            EN(2220, 2180, 2270, 1.7, 1),
            EN(2420, 2380, 2470, 2.0, 1, 'shooter'),
            EN(2950, 2900, 3190, 2.2, 1, 'fast', GY - TILE * 4 - EH),
            EN(3040, 2900, 3190, 1.9, 1, 'armored', GY - TILE * 4 - EH),
            EN(3320, 3280, 3370, 2.0, 1, 'shooter'),
            EN(3520, 3480, 3570, 2.2, 1, 'armored'),
            EN(3720, 3680, 3800, 2.4, 1, 'fast', GY - TILE * 4 - EH),
            EN(3900, 3860, 3970, 2.0, 1, 'shooter'),
            EN(4040, 3980, 4100, 1.8, 1, 'armored'),
            EN(720, 640, 900, 2.0, 1, 'fast', GY - TILE * 3 - EH),
            EN(1100, 980, 1140, 2.2, 1, 'shooter', GY - TILE * 4 - EH),
            EN(3230, 3120, 3360, 2.8, 1, 'bomber', GY - TILE * 5 - EH),
        ],
        coins: [
            { x: 152, y: GY - TILE - 22 }, { x: 216, y: GY - TILE * 2 - 22 }, { x: 280, y: GY - TILE * 3 - 22 },
            { x: 520, y: GY - TILE * 4 - 22 }, { x: 580, y: GY - TILE * 4 - 22 }, { x: 640, y: GY - TILE * 4 - 22 },
            { x: 860, y: GY - TILE * 2 - 22 }, { x: 880, y: GY - TILE * 5 - 22 }, { x: 960, y: GY - TILE * 3 - 22 },
            { x: 1132, y: GY - TILE - 22 }, { x: 1196, y: GY - TILE * 2 - 22 }, { x: 1260, y: GY - TILE * 3 - 22 }, { x: 1324, y: GY - TILE * 4 - 22 }, { x: 1388, y: GY - TILE * 5 - 22 },
            { x: 1510, y: GY - TILE * 5 - 22 }, { x: 1640, y: GY - TILE * 3 - 22 }, { x: 1760, y: GY - TILE * 6 - 22 },
            { x: 1920, y: GY - TILE * 4 - 22 }, { x: 1980, y: GY - TILE * 4 - 22 }, { x: 2040, y: GY - TILE * 4 - 22 },
            { x: 2210, y: GY - TILE * 2 - 22 }, { x: 2310, y: GY - TILE * 5 - 22 }, { x: 2410, y: GY - TILE * 3 - 22 }, { x: 2510, y: GY - TILE * 6 - 22 },
            { x: 2940, y: GY - TILE * 4 - 22 }, { x: 3040, y: GY - TILE * 4 - 22 }, { x: 3140, y: GY - TILE * 4 - 22 },
            { x: 3310, y: GY - TILE * 6 - 22 }, { x: 3410, y: GY - TILE * 3 - 22 }, { x: 3510, y: GY - TILE * 5 - 22 },
            { x: 3900, y: GY - TILE * 3 - 22 }, { x: 4010, y: GY - TILE * 5 - 22 }, { x: 4130, y: GY - TILE * 3 - 22 },
        ],
        pups: [
            { x: 560, y: GY - TILE * 4 - 50, e: '<img loading="lazy" alt="Telemoji (November 2023)" class="w-auto h-full" src="emojis/eyebrow.png">' },
            { x: 1370, y: GY - TILE * 5 - 50, e: '❤️' },
            { x: 1750, y: GY - TILE * 6 - 50, e: '🤨' },
            { x: 2000, y: GY - TILE * 4 - 50, e: '😭' },
            { x: 3130, y: GY - TILE * 4 - 50, e: '👍' },
            { x: 4120, y: GY - TILE * 3 - 50, e: '🙂' },
        ],
    },
    // ─── LEVEL 3: LAVA CASTLE ──────────────────────────────────────────────────
    {
        name: 'Lava Castle', bg: 'castle', W: 4800, story: STORIES[2],
        ps: { x: 50, y: GY - PH },
        plat: [
            P(100, GY - TILE, 64, 'brick'), P(164, GY - TILE * 2, 64, 'brick'), P(228, GY - TILE * 3, 64, 'brick'), P(292, GY - TILE * 4, 64, 'brick'), P(356, GY - TILE * 3, 64, 'brick'), P(420, GY - TILE * 2, 64, 'brick'),
            P(540, GY - TILE * 4, 260, 'brick'),
            P(880, GY - TILE * 2, 80, 'brick'), P(960, GY - TILE * 5, 80, 'brick'), P(1060, GY - TILE * 3, 80, 'brick'), P(1140, GY - TILE * 6, 80, 'brick'),
            P(1280, GY - TILE, 64, 'brick'), P(1344, GY - TILE * 2, 64, 'brick'), P(1408, GY - TILE * 3, 64, 'brick'), P(1472, GY - TILE * 4, 64, 'brick'), P(1536, GY - TILE * 5, 64, 'brick'),
            P(1660, GY - TILE * 5, 100, 'brick'), P(1780, GY - TILE * 3, 100, 'brick'), P(1900, GY - TILE * 6, 100, 'brick'),
            P(2060, GY - TILE * 4, 280, 'brick'),
            P(2420, GY - TILE * 6, 80, 'brick'), P(2520, GY - TILE * 4, 80, 'brick'), P(2620, GY - TILE * 6, 80, 'brick'), P(2720, GY - TILE * 3, 80, 'brick'),
            P(2860, GY - TILE * 2, 64, 'brick'), P(2924, GY - TILE * 3, 64, 'brick'), P(2988, GY - TILE * 4, 64, 'brick'), P(3052, GY - TILE * 5, 64, 'brick'), P(3116, GY - TILE * 6, 80, 'brick'),
            P(3260, GY - TILE * 5, 360, 'brick'),
            P(3720, GY - TILE * 7, 80, 'brick'), P(3820, GY - TILE * 5, 80, 'brick'), P(3920, GY - TILE * 7, 80, 'brick'), P(4020, GY - TILE * 4, 80, 'brick'),
            P(4180, GY - TILE * 3, 100, 'brick'), P(4300, GY - TILE * 5, 100, 'brick'), P(4420, GY - TILE * 3, 100, 'brick'), P(4560, GY - TILE * 5, 180, 'brick'),
        ],
        mplat: [
            MP(820, GY - TILE * 3, 80, 'brick', 2.5, 760, 960),
            MP(1220, GY - TILE * 4, 80, 'brick', 3.0, 1140, 1360),
            MP(2020, GY - TILE * 5, 80, 'brick', 3.2, 1940, 2140),
            MP(2800, GY - TILE * 4, 80, 'brick', 3.5, 2700, 2960),
            MP(3640, GY - TILE * 6, 80, 'brick', 3.0, 3540, 3800),
            MP(4140, GY - TILE * 4, 80, 'brick', 3.5, 4040, 4260),
        ],
        haz: [
            TH(60, 36), TH(480, 54), TH(820, 72), TH(1200, 54), TH(1620, 72), TH(2020, 54), TH(2380, 72), TH(2820, 72), TH(3220, 54), TH(3860, 72), TH(4150, 54), TH(4440, 72),
            HOLE(500, 80), HOLE(840, 80), HOLE(1200, 80), HOLE(1640, 70), HOLE(2380, 80), HOLE(2820, 70), HOLE(3240, 80), HOLE(4160, 80),
        ],
        enems: [
            EN(150, 100, 420, 1.8, 1),
            EN(580, 540, 790, 2.0, 2, 'armored', GY - TILE * 4 - EH),
            EN(700, 540, 790, 2.4, 1, 'shooter', GY - TILE * 4 - EH),
            EN(920, 880, 1050, 1.8, 2, 'armored'),
            EN(1100, 1060, 1130, 2.2, 1, 'shooter'),
            EN(1340, 1280, 1535, 2.0, 1),
            EN(1700, 1660, 1750, 2.2, 2, 'armored', GY - TILE * 5 - EH),
            EN(1830, 1780, 1890, 2.5, 1, 'shooter', GY - TILE * 3 - EH),
            EN(1950, 1900, 2000, 2.0, 2, 'armored', GY - TILE * 6 - EH),
            EN(2100, 2060, 2330, 2.4, 1, 'fast', GY - TILE * 4 - EH),
            EN(2200, 2060, 2330, 2.0, 2, 'armored', GY - TILE * 4 - EH),
            EN(2290, 2060, 2330, 2.6, 1, 'bomber', GY - TILE * 4 - EH),
            EN(2460, 2420, 2510, 2.2, 1, 'shooter'),
            EN(2760, 2720, 2810, 2.4, 2, 'armored'),
            EN(2920, 2860, 3110, 2.0, 2, 'armored'),
            EN(3030, 2860, 3110, 2.5, 1, 'bomber'),
            EN(3310, 3260, 3610, 2.4, 2, 'armored', GY - TILE * 5 - EH),
            EN(3430, 3260, 3610, 2.8, 1, 'shooter', GY - TILE * 5 - EH),
            EN(3550, 3260, 3610, 3.0, 1, 'fast', GY - TILE * 5 - EH),
            EN(3760, 3720, 3810, 2.5, 2, 'armored'),
            EN(3860, 3820, 3910, 2.8, 1, 'shooter'),
            EN(4220, 4180, 4270, 2.4, 2, 'armored'),
            EN(4340, 4300, 4390, 3.0, 1, 'bomber'),
            EN(4600, 4560, 4740, 2.8, 2, 'armored', GY - TILE * 5 - EH),
            EN(840, 760, 960, 2.5, 1, 'fast', GY - TILE * 3 - EH),
            EN(1240, 1140, 1360, 3.0, 2, 'armored', GY - TILE * 4 - EH),
            EN(3660, 3540, 3800, 3.0, 2, 'armored', GY - TILE * 6 - EH),
        ],
        coins: [
            { x: 132, y: GY - TILE - 22 }, { x: 196, y: GY - TILE * 2 - 22 }, { x: 260, y: GY - TILE * 3 - 22 }, { x: 324, y: GY - TILE * 4 - 22 },
            { x: 580, y: GY - TILE * 4 - 22 }, { x: 660, y: GY - TILE * 4 - 22 }, { x: 740, y: GY - TILE * 4 - 22 },
            { x: 912, y: GY - TILE * 2 - 22 }, { x: 992, y: GY - TILE * 5 - 22 }, { x: 1092, y: GY - TILE * 3 - 22 }, { x: 1172, y: GY - TILE * 6 - 22 },
            { x: 1312, y: GY - TILE - 22 }, { x: 1376, y: GY - TILE * 2 - 22 }, { x: 1440, y: GY - TILE * 3 - 22 }, { x: 1504, y: GY - TILE * 4 - 22 }, { x: 1568, y: GY - TILE * 5 - 22 },
            { x: 1700, y: GY - TILE * 5 - 22 }, { x: 1820, y: GY - TILE * 3 - 22 }, { x: 1940, y: GY - TILE * 6 - 22 },
            { x: 2100, y: GY - TILE * 4 - 22 }, { x: 2190, y: GY - TILE * 4 - 22 }, { x: 2280, y: GY - TILE * 4 - 22 },
            { x: 2452, y: GY - TILE * 6 - 22 }, { x: 2552, y: GY - TILE * 4 - 22 }, { x: 2652, y: GY - TILE * 6 - 22 }, { x: 2752, y: GY - TILE * 3 - 22 },
            { x: 2892, y: GY - TILE * 2 - 22 }, { x: 2956, y: GY - TILE * 3 - 22 }, { x: 3020, y: GY - TILE * 4 - 22 }, { x: 3084, y: GY - TILE * 5 - 22 }, { x: 3148, y: GY - TILE * 6 - 22 },
            { x: 3300, y: GY - TILE * 5 - 22 }, { x: 3400, y: GY - TILE * 5 - 22 }, { x: 3500, y: GY - TILE * 5 - 22 }, { x: 3600, y: GY - TILE * 5 - 22 },
            { x: 3750, y: GY - TILE * 7 - 22 }, { x: 3850, y: GY - TILE * 5 - 22 }, { x: 3950, y: GY - TILE * 7 - 22 }, { x: 4050, y: GY - TILE * 4 - 22 },
            { x: 4220, y: GY - TILE * 3 - 22 }, { x: 4340, y: GY - TILE * 5 - 22 }, { x: 4460, y: GY - TILE * 3 - 22 }, { x: 4600, y: GY - TILE * 5 - 22 },
        ],
        pups: [
            { x: 324, y: GY - TILE * 4 - 50, e: '❤️' },
            { x: 1552, y: GY - TILE * 5 - 50, e: '😭' },
            { x: 1920, y: GY - TILE * 6 - 50, e: '🤨' },
            { x: 2160, y: GY - TILE * 4 - 50, e: '<img loading="lazy" alt="Telemoji (November 2023)" class="w-auto h-full" src="emojis/eyebrow.png">' },
            { x: 3580, y: GY - TILE * 5 - 50, e: '🙂' },
            { x: 4580, y: GY - TILE * 5 - 50, e: '😭' },
            { x: 4700, y: GY - TILE * 5 - 50, e: '👍' },
        ],
    },
];

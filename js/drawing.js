// ═══════════════════════════════════════════════
// TILE + BACKGROUND DRAWING
// ═══════════════════════════════════════════════

function drawTile(x, y, w, h, style) {
    ctx.save();
    switch (style) {
        case 'grass': {

    // ===== BORDER =====
    ctx.fillStyle = '#64371b';
    ctx.fillRect(x, y, w, 1);
    ctx.fillRect(x, y + h - 1, w, 1);
    ctx.fillRect(x, y, 1, h);
    ctx.fillRect(x + w - 1, y, 1, h);


    // ===== GRASS TOP =====
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(x + 1, y + 1, w - 2, 6);

    // highlight
    ctx.fillStyle = '#7edc7e';
    ctx.fillRect(x + 1, y + 1, w - 2, 2);

    // shadow
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(x + 1, y + 5, w - 2, 2);


    // ===== GRASS TEXTURE =====
    ctx.fillStyle = '#2e7d32';
    for (let i = 3; i < w - 3; i += 4) {
        ctx.fillRect(x + i, y + 3, 1, 1);
    }


    // ===== DIRT BODY =====
    ctx.fillStyle = '#8b4a24';
    ctx.fillRect(x + 1, y + 7, w - 2, h - 8);


    // dirt shadow
    ctx.fillStyle = '#7e4a2b';
    ctx.fillRect(x + 1, y + h - 4, w - 2, 3);


    // dirt texture
    ctx.fillStyle = '#9b6029';
    for (let i = 3; i < w - 3; i += 5) {
        ctx.fillRect(x + i, y + 10, 1, 1);
        ctx.fillRect(x + i + 2, y + 13, 1, 1);
    }


    // ===== SMALL GRASS BLADES =====
    ctx.fillStyle = '#7edc7e';
    for (let i = 4; i < w - 4; i += 6) {
        ctx.fillRect(x + i, y - 1, 1, 2);
    }

    break;
}



case 'grass-wall': {

    // ===== BORDER =====
    ctx.fillStyle = '#64371b';
    ctx.fillRect(x, y, w, 1);
    ctx.fillRect(x, y + h - 1, w, 1);
    ctx.fillRect(x, y, 1, h);
    ctx.fillRect(x + w - 1, y, 1, h);


    // ===== GRASS TOP =====
    ctx.fillStyle = '#884d28';
    ctx.fillRect(x + 1, y + 1, w - 2, 6);

    // highlight
    ctx.fillStyle = '#864d2a';
    ctx.fillRect(x + 1, y + 1, w - 2, 2);

    // shadow
    ctx.fillStyle = '#804825';
    ctx.fillRect(x + 1, y + 5, w - 2, 2);


    // ===== GRASS TEXTURE =====
    ctx.fillStyle = '#7d4c2d';
    for (let i = 3; i < w - 3; i += 4) {
        ctx.fillRect(x + i, y + 3, 1, 1);
    }


    // ===== DIRT BODY =====
    ctx.fillStyle = '#814624';
    ctx.fillRect(x + 1, y + 7, w - 2, h - 8);


    // dirt shadow
    ctx.fillStyle = '#844e2d';
    ctx.fillRect(x + 1, y + h - 4, w - 2, 3);


    // dirt texture
    ctx.fillStyle = '#b87333';
    for (let i = 3; i < w - 3; i += 5) {
        ctx.fillRect(x + i, y + 10, 1, 1);
        ctx.fillRect(x + i + 2, y + 13, 1, 1);
    }


    // ===== SMALL GRASS BLADES =====
    

    break;
}



        case 'stone':
            ctx.fillStyle = '#4a6370'; ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#30454e';
            ctx.fillRect(x, y + h / 2 - 1, w, 2);
            {
                const bw = Math.max(2, Math.floor(w / 2));
                ctx.fillRect(x + bw, y, 2, h / 2);
                ctx.fillRect(x + bw / 2, y + h / 2, 2, h / 2);
            }
            ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(x, y, w, 2);
            break;
        case 'brick':
            ctx.fillStyle = '#7a3020'; ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#4a1a0e';
            ctx.fillRect(x, y + h / 2 - 1, w, 2);
            {
                const b = Math.max(2, Math.floor(w / 3));
                ctx.fillRect(x + b, y, 2, h / 2); ctx.fillRect(x + 2 * b, y, 2, h / 2);
                ctx.fillRect(x + b / 2, y + h / 2, 2, h / 2); ctx.fillRect(x + b * 1.5, y + h / 2, 2, h / 2);
            }
            ctx.fillStyle = 'rgba(255,140,60,0.06)'; ctx.fillRect(x, y, w, 2);
            break;
        case 'metal':
            {
                const g = ctx.createLinearGradient(x, y, x, y + h);
                g.addColorStop(0, '#8fa8b2'); g.addColorStop(0.4, '#4e6a78'); g.addColorStop(1, '#32444e');
                ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
                ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.fillRect(x, y, w, 3);
                ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.fillRect(x, y + h - 3, w, 3);
                ctx.fillStyle = '#6a8890';
                for (let i = 8; i < w - 4; i += 14) { ctx.beginPath(); ctx.arc(x + i, y + h / 2, 2.5, 0, Math.PI * 2); ctx.fill(); }
            }
            break;
        case 'cloud':
            ctx.fillStyle = 'rgba(240,248,255,0.9)'; ctx.fillRect(x, y, w, h);
            ctx.fillStyle = 'rgba(190,210,255,0.5)'; ctx.fillRect(x, y + h - 6, w, 6);
            ctx.fillStyle = 'rgba(255,255,255,0.65)'; ctx.fillRect(x + 2, y, w - 4, 5);
            break;
        default:
            ctx.fillStyle = '#555'; ctx.fillRect(x, y, w, h);
    }
    ctx.restore();
}

function drawHazardDecal(h, cx_offset) {
    const rx = h.x - cx_offset;
    if (rx > VW + 80 || rx + h.w < -80) return;
    ctx.save();
    if (h.type === 'thorn') {
        ctx.fillStyle = 'rgba(0, 180, 30, 0.55)';
        ctx.fillRect(rx, GY - 3, h.w, 3);
        const n = Math.max(1, Math.floor(h.w / 18));
        const sw = h.w / n;
        for (let i = 0; i < n; i++) {
            const sx = rx + i * sw + sw / 2;
            const tipY = GY - 28;
            ctx.beginPath();
            ctx.moveTo(sx, tipY - 3); ctx.lineTo(sx - sw * 0.44 - 2, GY + 2); ctx.lineTo(sx + sw * 0.44 + 2, GY + 2);
            ctx.closePath(); ctx.fillStyle = '#1a0000'; ctx.fill();
            ctx.beginPath();
            ctx.moveTo(sx, tipY); ctx.lineTo(sx - sw * 0.42, GY); ctx.lineTo(sx + sw * 0.42, GY);
            ctx.closePath();
            const spkG = ctx.createLinearGradient(sx, tipY, sx, GY);
            spkG.addColorStop(0, '#41ff11'); spkG.addColorStop(0.5, '#29cc00'); spkG.addColorStop(1, '#008800');
            ctx.fillStyle = spkG; ctx.fill();
            ctx.fillStyle = 'rgba(211, 255, 180, 0.8)'; ctx.fillRect(sx - 1, tipY, 2, 6);
        }
        const pulse = 0.3 + 0.25 * Math.sin(Date.now() / 220);
        ctx.shadowColor = '#04ff00'; ctx.shadowBlur = 14;
        ctx.strokeStyle = `rgba(255,50,50,${pulse})`;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < n; i++) {
            const sx = rx + i * sw + sw / 2;
            ctx.beginPath(); ctx.moveTo(sx, GY - 25); ctx.lineTo(sx - sw * 0.4, GY); ctx.lineTo(sx + sw * 0.4, GY);
            ctx.closePath(); ctx.stroke();
        }
        ctx.font = 'bold 7px "Press Start 2P",monospace';
        ctx.fillStyle = `rgba(255,80,80,${0.6 + 0.4 * Math.sin(Date.now() / 300)})`;
        ctx.textAlign = 'center'; ctx.shadowBlur = 6; ctx.shadowColor = '#4dff00';
        if (h.w > 30) ctx.fillText('!', rx + h.w / 2, GY - 32);
    } else if (h.type === 'hole') {
//         // Lava base
// ctx.fillStyle = '#2b0000';
// ctx.fillRect(rx, GY, h.w, TILE + 8);

// // Dark magma texture
// ctx.fillStyle = '#3a0000';
// for (let i = 0; i < h.w; i += 10) {
//   ctx.fillRect(rx + i, GY + Math.random()*6, 6, 6);
// }

// // Flowing lava body
// let grad = ctx.createLinearGradient(rx, GY, rx, GY + TILE + 8);
// grad.addColorStop(0, '#ff3c00');
// grad.addColorStop(0.4, '#ff1200');
// grad.addColorStop(1, '#6b0000');

// ctx.fillStyle = grad;
// ctx.fillRect(rx, GY + 2, h.w, TILE + 6);

// // Bright surface glow
// ctx.fillStyle = '#ff6a00';
// ctx.fillRect(rx, GY, h.w, 3);

// // Lava waves
// ctx.fillStyle = 'rgba(255,140,0,0.7)';
// for (let i = 0; i < h.w; i += 14) {
//   ctx.beginPath();
//   ctx.arc(rx + i + 6, GY + 3, 3, 0, Math.PI);
//   ctx.fill();
// }

// // Lava bubbles
// ctx.fillStyle = 'rgba(255,200,0,0.8)';
// for (let i = 0; i < h.w; i += 22) {
//   ctx.beginPath();
//   ctx.arc(rx + i + 5, GY + 6 + Math.random()*4, 2, 0, Math.PI*2);
//   ctx.fill();
// }

// // Magma cracks
// ctx.strokeStyle = 'rgba(255,90,0,0.6)';
// ctx.lineWidth = 1;
// for (let i = 0; i < h.w; i += 16) {
//   ctx.beginPath();
//   ctx.moveTo(rx + i, GY + 8);
//   ctx.lineTo(rx + i + 5, GY + 4);
//   ctx.lineTo(rx + i + 10, GY + 9);
//   ctx.stroke();
// }

// Deep water base
ctx.fillStyle = '#001a33';
ctx.fillRect(rx, GY, h.w, TILE + 8);

// Water gradient (depth effect)
let waterGrad = ctx.createLinearGradient(rx, GY, rx, GY + TILE + 8);
waterGrad.addColorStop(0, '#2aa9ff');
waterGrad.addColorStop(0.5, '#0077cc');
waterGrad.addColorStop(1, '#002f66');

ctx.fillStyle = waterGrad;
ctx.fillRect(rx, GY + 2, h.w, TILE + 6);

// Surface highlight
ctx.fillStyle = 'rgba(180,220,255,0.7)';
ctx.fillRect(rx, GY, h.w, 2);

// Light reflections
ctx.fillStyle = 'rgba(255,255,255,0.25)';
for (let i = 0; i < h.w; i += 18) {
  ctx.fillRect(rx + i, GY + 3, 10, 2);
}

// Small waves
ctx.fillStyle = 'rgba(150,200,255,0.6)';
for (let i = 0; i < h.w; i += 16) {
  ctx.beginPath();
  ctx.arc(rx + i + 8, GY + 4, 4, Math.PI, 0);
  ctx.fill();
}

// Water bubbles
ctx.fillStyle = 'rgba(200,230,255,0.6)';
for (let i = 0; i < h.w-12; i += 24) {
  ctx.beginPath();
  ctx.arc(rx + i + 12, GY + 5 + Math.random()*4, 2, 0, Math.PI * 2);
  ctx.fill();
}

    }

    
    ctx.restore();
}

function drawBackground(style, levelW) {
    const cx = camera.x;
    if (style === 'sky') {
        const g = ctx.createLinearGradient(0, 0, 0, VH);
        g.addColorStop(0, '#1155aa'); g.addColorStop(0.5, '#3a9edc'); g.addColorStop(1, '#a8dff5');
        ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
        ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#2a6e40';
        for (let i = -1; i < 4; i++) {
            const mx = ((i * 300 - cx * 0.13) % VW + VW + 300) % VW - 40;
            ctx.beginPath(); ctx.moveTo(mx, VH); ctx.lineTo(mx + 85, VH - 120); ctx.lineTo(mx + 170, VH); ctx.fill();
            ctx.beginPath(); ctx.moveTo(mx + 100, VH); ctx.lineTo(mx + 185, VH - 95); ctx.lineTo(mx + 270, VH); ctx.fill();
        }
        ctx.restore();
        [{ p: 0.07, y: 55, r: 54 }, { p: 0.24, y: 38, r: 68 }, { p: 0.43, y: 62, r: 48 }, { p: 0.61, y: 42, r: 60 }, { p: 0.79, y: 58, r: 56 }, { p: 0.94, y: 35, r: 62 }]
            .forEach(c => {
                const ccx = ((c.p * levelW - cx * 0.26) % (VW + 180) + VW + 180) % VW;
                ctx.save(); ctx.globalAlpha = 0.78; ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.arc(ccx, c.y, c.r, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(ccx + c.r * 0.55, c.y + 9, c.r * 0.65, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(ccx - c.r * 0.55, c.y + 9, c.r * 0.6, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            });
        ctx.fillStyle = '#1a5218';
        for (let ti = -1; ti < Math.ceil(VW / 70) + 2; ti++) {
            const tx = ((ti * 70 - cx * 0.45) % (VW + 90) + VW + 90) % VW;
            ctx.fillRect(tx + 30, VH - 50, 7, 26); ctx.beginPath(); ctx.arc(tx + 33, VH - 52, 17, 0, Math.PI * 2); ctx.fill();
        }
    } else if (style === 'night') {
        const g = ctx.createLinearGradient(0, 0, 0, VH);
        g.addColorStop(0, '#030310'); g.addColorStop(1, '#0a1428');
        ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
        for (let i = 0; i < 88; i++) {
            const sx = ((i * 197 + cx * 0.04) % (VW + 20) + VW + 20) % VW, sy = (i * 107) % 170;
            const fl = Math.sin(Date.now() / 380 + i) * 0.5 + 0.5;
            ctx.globalAlpha = 0.22 + fl * 0.68; ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy, i % 4 === 0 ? 2 : 1, i % 4 === 0 ? 2 : 1);
        }
        ctx.globalAlpha = 1;
        ctx.save(); ctx.fillStyle = '#fff9e6'; ctx.shadowColor = '#ffe082'; ctx.shadowBlur = 30;
        ctx.beginPath(); ctx.arc(VW - 65 - (cx * 0.015) % 140, 42, 22, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        ctx.save(); ctx.fillStyle = '#050518';
        for (let bi = 0; bi < Math.ceil(VW / 46) + 2; bi++) {
            const bx = ((bi * 46 - cx * 0.36) % (VW + 96) + VW + 96) % VW - 4;
            const bh = 55 + Math.sin(bi * 0.22) * 28;
            ctx.fillRect(bx, VH - bh, 40, bh);
        }
        ctx.fillStyle = 'rgba(255,255,140,0.4)';
        for (let bi = 0; bi < Math.ceil(VW / 46) + 2; bi++) {
            const bx = ((bi * 46 - cx * 0.36) % (VW + 96) + VW + 96) % VW - 4;
            const bh = 55 + Math.sin(bi * 0.22) * 28;
            for (let wy = VH - bh + 6; wy < VH - 8; wy += 11) for (let wx = 4; wx < 34; wx += 9) if ((bi * 17 + wy) % 13 < 7) ctx.fillRect(bx + wx, wy, 5, 7);
        }
        ctx.restore();
    } else {
        const g = ctx.createLinearGradient(0, 0, 0, VH);
        g.addColorStop(0, '#180000'); g.addColorStop(0.7, '#2a0600'); g.addColorStop(1, '#100000');
        ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
        const lg = ctx.createLinearGradient(0, VH - 85, 0, VH);
        lg.addColorStop(0, 'rgba(255,70,0,0)'); lg.addColorStop(1, 'rgba(255,40,0,0.5)');
        ctx.fillStyle = lg; ctx.fillRect(0, VH - 85, VW, 85);
        for (let i = 0; i < VW; i += 5) {
            const h2 = Math.sin(Date.now() / 210 + i * 0.24) * 5 + 7;
            ctx.fillStyle = `rgba(255,${60 + Math.round(Math.sin(Date.now() / 190 + i) * 30)},0,0.3)`;
            ctx.fillRect(i, VH - h2, 5, h2);
        }
        ctx.save(); ctx.globalAlpha = 0.13; ctx.fillStyle = '#4a1508';
        for (let row = 0; row < 5; row++) for (let col = 0; col < Math.ceil(VW / 64) + 2; col++) {
            const bx = ((col * 64 + (row % 2) * 32) - cx * 0.17) % (VW + 78) - 14;
            ctx.fillRect(bx, row * 36, 62, 34);
        }
        ctx.globalAlpha = 0.22; ctx.strokeStyle = '#622010'; ctx.lineWidth = 1;
        for (let row = 0; row < 5; row++) for (let col = 0; col < Math.ceil(VW / 64) + 2; col++) {
            const bx = ((col * 64 + (row % 2) * 32) - cx * 0.17) % (VW + 78) - 14;
            ctx.strokeRect(bx, row * 36, 62, 34);
        }
        ctx.restore();
        for (let i = 0; i < 14; i++) {
            const ex = ((i * 149 + Date.now() / 22) % VW + VW) % VW;
            const ey = VH - 25 - ((Date.now() / 4.2 + i * 52) % VH);
            ctx.fillStyle = `rgba(255,${90 + i * 10},0,0.6)`;
            ctx.beginPath(); ctx.arc(ex, ey, 1.5 + Math.sin(i) * 0.7, 0, Math.PI * 2); ctx.fill();
        }
    }
}

function drawGround(style) {
    if (style === 'sky') {
        // ===== GRASS TOP =====
ctx.fillStyle = '#3fa93f'; 
ctx.fillRect(0, GY, VW, TILE);

// top highlight (sun light)
ctx.fillStyle = '#6bd66b';
ctx.fillRect(0, GY, VW, 2);

// mid grass
ctx.fillStyle = '#3fa93f';
ctx.fillRect(0, GY + 2, VW, 4);

// darker grass underside
ctx.fillStyle = '#2f7d32';
ctx.fillRect(0, GY + 6, VW, 3);


// ===== DIRT LAYER =====
ctx.fillStyle = '#7a4422';
ctx.fillRect(0, GY + 9, VW, TILE - 9);

// dirt shadow bottom
ctx.fillStyle = '#5a2f16';
ctx.fillRect(0, GY + TILE - 4, VW, 4);


// ===== DIRT TEXTURE =====
ctx.fillStyle = '#a86a36';
for (let i = 0; i < VW; i += 6) {
    ctx.fillRect(i + 2, GY + 12, 1, 1);
    ctx.fillRect(i + 4, GY + 15, 1, 1);
}


// ===== GRASS PIXEL TEXTURE =====
ctx.fillStyle = '#2f7d32';
for (let i = 0; i < VW; i += 5) {
    ctx.fillRect(i + 1, GY + 4, 1, 1);
}
    } else if (style === 'night') {
        ctx.fillStyle = '#1a2630'; ctx.fillRect(0, GY, VW, TILE);
        ctx.fillStyle = '#22343e'; ctx.fillRect(0, GY, VW, 5);
        ctx.fillStyle = 'rgba(0,210,255,0.3)'; ctx.fillRect(0, GY, VW, 2);
    } else {
        const t = Date.now() / 300;
        ctx.fillStyle = '#720000'; ctx.fillRect(0, GY, VW, TILE);
        ctx.fillStyle = '#b03000';
        for (let i = 0; i < VW; i += 16) { const lh = 3 + Math.sin(t + i * 0.16) * 3; ctx.fillRect(i, GY, 13, lh); }
        ctx.fillStyle = 'rgba(255,120,0,0.35)'; ctx.fillRect(0, GY, VW, 3);
    }
}

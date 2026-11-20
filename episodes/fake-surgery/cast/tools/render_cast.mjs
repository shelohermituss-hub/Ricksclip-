// character-artist (fake-surgery, phase A 2026-11-16; copied from elevator-mirror): ONE command = golden views + contact sheet + face zoom + reclined-patient proof + numbers.
//   node cast/tools/render_cast.mjs        -> cast/out/cast_sheet.png (1600 wide), cast/out/cast_faces.png, cast/out/recline_proof.png (+ _phone360), cast/out/numbers.json, cast/views/<name>_<view>.png
// Cards are drawn through the film kit's own puppet adapter (puppets.mjs svgFor), then shaded with a port of film.js costumeShadedTexture
// (amount .45, start .35, cool .15, smooth 40; faces and whites untouched), so the sheet shows what the film shows.
import fs from 'fs'; import path from 'path'; import os from 'os'; import { fileURLToPath, pathToFileURL } from 'url'; import { createRequire } from 'module';
const HERE = path.dirname(fileURLToPath(import.meta.url)), CAST = path.resolve(HERE, '..'), ROOT = path.resolve(CAST, '../../..'), require = createRequire(import.meta.url);
const PKG = path.join(ROOT, 'templates/vector2d_characters/code'), KIT = path.join(ROOT, 'templates/threejs_film'), OUT = path.join(CAST, 'out'), VIEWS = path.join(CAST, 'views');
const imp = f => import(pathToFileURL(f).href);
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'surgery_')); fs.mkdirSync(path.join(TMP, 'sheets'));
for (const f of fs.readdirSync(PKG)) if (f.endsWith('.mjs')) fs.copyFileSync(path.join(PKG, f), path.join(TMP, f));
for (const f of ['puppets.mjs', 'poses.mjs']) fs.copyFileSync(path.join(KIT, f), path.join(TMP, f));
fs.copyFileSync(path.join(CAST, 'sheets/surgery.mjs'), path.join(TMP, 'sheets/surgery.mjs'));
const [char2d, memes, memes2, memes3, bodies, cast, castkit, grips] = await Promise.all(['char2d', 'memes', 'memes2', 'memes3', 'bodies', 'cast', 'castkit', 'grips'].map(n => imp(path.join(TMP, n + '.mjs'))));
const P = await imp(path.join(TMP, 'puppets.mjs')), sheet = await imp(path.join(TMP, 'sheets/surgery.mjs')), castIndex = {};
for (const c of sheet.CAST) { castIndex[c.name] = c; castIndex['surgery/' + c.name] = c; }
const KEYS = JSON.parse(fs.readFileSync(path.join(CAST, 'CAST_KEYS.json'), 'utf8')), CS = KEYS.costume_shade;
const epMoves = await imp(path.join(CAST, '../moves/ep_surgery.mjs')), motion = { LIB: [], mods: { '../../ep_surgery': epMoves }, cloth: null };
P.initPuppets({ char2d, memes, memes2, memes3, bodies, cast, castkit, castIndex, grips, motion, epFaces: KEYS.faces_ep, faceShadow: KEYS.face_shadow });
const MAIN = ['surgeon', 'surgeonOff', 'nurse', 'patient', 'patientShorts'], V4 = ['front', '34', 'side', 'back'];
const ALL = Object.keys(KEYS.cast), EXTRA = ALL.filter(n => !MAIN.includes(n)), MASKED = new Set(['surgeon']);
const tiles = [], T = (who, st, extra = {}) => { const E = KEYS.cast[who], m = P.metrics(E); const svg = P.svgFor(E, { view: 'front', dir: 1, pose: 'stand', face: 'standard', prop: null, hand: null, mouth: null, blink: null, ...st });
  const id = `${who}_${st.view || 'front'}${st.tag ? '_' + st.tag : ''}`; tiles.push({ id, who, view: st.view || 'front', hy: m.hy, headPx: m.headPx, px: m.px, height: E.height, hen: false, masked: MASKED.has(who), recline: !!st.recline, svg: 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'), ...extra }); return id; };
for (const w of ALL) for (const v of V4) T(w, { view: v });
const rows = [];
rows.push({ h: 400, label: 'THE SURGEON (hero, FAT, OR green #2f7d55): front, 3/4, side, back  ·  mask down (office, end) front + 3/4 k:proud  ·  masked k:smileEyes  ·  black fill', ids: [...V4.map(v => `surgeon_${v}`), 'surgeonOff_front', T('surgeonOff', { view: '34', face: 'k:proud', tag: 'proud' }), T('surgeon', { view: '34', face: 'k:smileEyes', tag: 'smileEyes' }), 'SIL:surgeon_front', 'SIL:surgeon_side'] });
rows.push({ h: 380, label: 'THE NURSE (mocker, STANDARD, ceil blue): 4 views + k:browUp  ·  THE PATIENT (LEAN veteran, gown, navy cap, grey moustache): 4 views', ids: [...V4.map(v => `nurse_${v}`), T('nurse', { view: '34', face: 'k:browUp', tag: 'browUp' }), ...V4.map(v => `patient_${v}`)] });
rows.push({ h: 380, label: 'THE PATIENT rows 31-50 (mustard polo, khaki shorts): 4 views + k:springGrin  ·  gown k:wince  ·  black fill: patient, shorts, nurse', ids: [...V4.map(v => `patientShorts_${v}`), T('patientShorts', { view: '34', face: 'k:springGrin', tag: 'springGrin' }), T('patient', { view: '34', face: 'k:wince', tag: 'wince' }), 'SIL:patient_front', 'SIL:patientShorts_34', 'SIL:nurse_front'] });
rows.push({ h: 300, label: 'THE BOY (~6): 4 views + k:crying (wail) + k:cheer  ·  THE GRANDKID (~5): front, 3/4, back + k:cheer', ids: [...V4.map(v => `boy_${v}`), T('boy', { view: '34', face: 'k:wail', tag: 'wail' }), T('boy', { view: '34', face: 'k:cheer', tag: 'cheer' }), 'grandkid_front', 'grandkid_34', 'grandkid_back', T('grandkid', { view: '34', face: 'k:cheer', tag: 'cheer' })] });
rows.push({ h: 320, label: 'STEP-CLIMBERS row 35 (wristbands = 3D rings: steel-blue / aqua / purple): front + 3/4 + side each', ids: ['climber1', 'climber2', 'climber3'].flatMap(w => [`${w}_front`, `${w}_34`, `${w}_side`]) });
rows.push({ h: 320, label: 'GURNEY PATIENTS row 14 (five gown prints) g1-g5  ·  the same five people in street clothes for the row-50 stream g1s-g5s', ids: ['g1', 'g2', 'g3', 'g4', 'g5', 'g1s', 'g2s', 'g3s', 'g4s', 'g5s'].map(w => `${w}_front`) });
rows.push({ h: 260, label: 'EXTRAS 3/4 and back (designed backs)', ids: ['g1', 'g2', 'g3', 'g4', 'g5', 'g1s', 'g2s', 'g3s', 'g4s', 'g5s'].map((w, i) => `${w}_${i % 2 ? 'back' : '34'}`) });
const faces = [{ h: 330, ids: ['surgeon_front', 'surgeon_34', 'surgeon_side', 'surgeonOff_front', 'nurse_front', 'nurse_34'] }, { h: 330, ids: ['patient_front', 'patient_34', 'patient_side', 'patient_back', 'patientShorts_34_springGrin', 'boy_34_wail'] }];
// THE RECLINED PATIENT: three acting styles of the episode move + one side view, each with its face
const REC = [['pt_recline', 'k:drowsy', '34'], ['pt_thumbs@=1.6', 'k:thumbsSmile', '34'], ['pt_smile@=1', 'k:drowsy', '34'], ['pt_recline_side', 'k:drowsy', 'side']];
const recIds = REC.map(([mv, fc, v], i) => T('patient', { view: v, pose: 'm:../../ep_surgery/' + mv, face: fc, tag: 'recline' + i, recline: true }));
const html = `<html><body style="margin:0;background:#fff"><canvas id="sheet"></canvas><canvas id="faces"></canvas><canvas id="rec"></canvas><script>
const CS = ${JSON.stringify(CS)}, TILES = ${JSON.stringify(tiles)}, ROWS = ${JSON.stringify(rows)}, FACES = ${JSON.stringify(faces)}, REC_IDS = ${JSON.stringify(recIds)}, SC = .75, CW = 800 * SC, CH = 1500 * SC, GY = 1440 * SC;
function shade(base, W, H, side, smooth) { const d = new Uint8ClampedArray(base), A = CS.amount, st0 = CS.start, cool = CS.cool, sc = H / 1500;
  const ink = i => base[i] + base[i + 1] + base[i + 2] < 150, skin = i => { const ch = Math.max(base[i], base[i + 1], base[i + 2]) - Math.min(base[i], base[i + 1], base[i + 2]), lo = Math.min(base[i], base[i + 1], base[i + 2]); return ch <= 40 && lo >= 150; };
  const XL = new Float32Array(H).fill(-1), XR = new Float32Array(H).fill(-1);
  for (let y = 0; y < H; y++) { let xl = -1, xr = -1; for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; if (base[i + 3] < 128 || ink(i) || skin(i)) continue; if (xl < 0) xl = x; xr = x; } XL[y] = xl; XR[y] = xr; }
  if (smooth > 0) { const n = Math.max(1, Math.round(smooth * sc)), a = XL.slice(), b = XR.slice(); for (let y = 0; y < H; y++) { if (a[y] < 0) continue; let sl = 0, sr = 0, m = 0; for (let q = Math.max(0, y - n); q <= Math.min(H - 1, y + n); q++) if (a[q] >= 0) { sl += a[q]; sr += b[q]; m++; } XL[y] = sl / m; XR[y] = sr / m; } }
  for (let y = 0; y < H; y++) { const xl = XL[y], xr = XR[y]; if (xl < 0 || xr - xl < 6) continue; const w = xr - xl;
    for (let x = (smooth > 0 ? 0 : xl); x <= (smooth > 0 ? W - 1 : xr); x++) { const i = (y * W + x) * 4; if (base[i + 3] < 40 || ink(i) || skin(i)) continue; let u = Math.min(1, Math.max(0, (x - xl) / w)); if (side < 0) u = 1 - u; let t = (u - st0) / (1 - st0); if (t <= 0) continue; t = Math.min(1, t); t = t * t * (3 - 2 * t); const k = 1 - A * t;
      d[i] = Math.round(base[i] * k * (1 - cool * t * .5)); d[i + 1] = Math.round(base[i + 1] * k * (1 - cool * t * .25)); d[i + 2] = Math.round(base[i + 2] * Math.min(1, k * (1 + cool * t * .2))); } }
  return d; }
const lumOf = (d, i) => .3 * d[i] + .59 * d[i + 1] + .11 * d[i + 2];
function streak(base, sh, W, H, y0, y1) { let s = 0, n = 0, mx = 0; for (let y = Math.max(1, y0); y < Math.min(H, y1); y++) for (let x = 0; x < W; x += 2) { const i = (y * W + x) * 4, j = i - W * 4; if (base[i + 3] < 200 || base[j + 3] < 200) continue; const a = lumOf(base, i), b = lumOf(base, j); if (a < 60 || b < 60) continue; if (Math.abs(a - b) > 6) continue;   // same flat colour above and below in the clean drawing
      const dd = Math.abs((lumOf(sh, i) - a) - (lumOf(sh, j) - b)); s += dd; n++; if (dd > 6) mx++; } return { mean: n ? +(s / n).toFixed(3) : 0, jumps: mx, n }; }
window.run = async () => { const C = {}, NUM = {}, PNG = {};
  for (const t of TILES) { const im = new Image(); await new Promise(ok => { im.onload = ok; im.src = t.svg; }); const c = document.createElement('canvas'); c.width = CW; c.height = CH; const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0, CW, CH);
    const W = CW, H = CH, id0 = g.getImageData(0, 0, W, H), base = id0.data, side = t.view === '34' || t.view === 'side' ? -1 : 1;
    PNG[t.id] = c.toDataURL('image/png');
    const sh = t.hen ? new Uint8ClampedArray(base) : shade(base, W, H, side, CS.smooth), sh0 = t.hen ? sh : shade(base, W, H, side, 0);
    let x0 = W, x1 = 0, y0 = H, y1 = 0; for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (base[(y * W + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    // numbers. face zone = the middle of the face (eyes to chin) in head units; head centre (CW/2, hy)
    const hcx = W / 2, hcy = t.hy * SC, R = t.headPx * .5 * SC; let faceN = 0, colour = 0, grey = 0, changed = 0, minLo = 255;
    if (!t.hen && t.view === 'front' && !t.recline) for (let y = Math.round(hcy - .3 * R); y < hcy + .62 * R; y++) for (let x = Math.round(hcx - .55 * R); x < hcx + .55 * R; x++) { const i = (y * W + x) * 4; if (base[i + 3] < 200) continue; const r = sh[i], gg = sh[i + 1], b = sh[i + 2], lo = Math.min(r, gg, b), ch = Math.max(r, gg, b) - lo; if (r + gg + b < 150) continue; if (Math.abs(x - hcx) < .62 * R && y > hcy + .02 * R && y < hcy + .4 * R) continue; faceN++;  /* moustache box excluded (facial hair is hair, not skin) */
        if (ch > 40) colour++; else if (lo < 200) grey++; if (ch <= 40 && lo < minLo) minLo = lo; const bl = Math.min(base[i], base[i + 1], base[i + 2]), bc = Math.max(base[i], base[i + 1], base[i + 2]) - bl; if (bl >= 150 && bc <= 40 && (sh[i] !== base[i] || sh[i + 1] !== base[i + 1] || sh[i + 2] !== base[i + 2])) changed++; }
    const headTop = Math.max(0, Math.round(hcy - 2.2 * R)), headBot = Math.round(hcy + 1.05 * R);
    let red = 0, tan = 0; for (let i = 0; i < sh.length; i += 4) { if (base[i + 3] < 200) continue; const r = sh[i], gg = sh[i + 1], b = sh[i + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
      if (mx > 0 && (mx - mn) / mx > .5 && mx / 255 > .55) { let hue = mx === r ? 60 * ((gg - b) / (mx - mn)) : mx === gg ? 60 * (2 + (b - r) / (mx - mn)) : 60 * (4 + (r - gg) / (mx - mn)); if (hue < 0) hue += 360; const dh = Math.min(Math.abs(hue - 356.3), 360 - Math.abs(hue - 356.3)); if (dh <= 12) red++; }
      if (r > 150 && r - b > 45 && r - b < 120 && gg > 100 && r > gg + 15) tan++; }   // RED GATE (LOOK_BIBLE): hue within 12 deg of #e01e2a, S > .5, V > .55; every pixel
    NUM[t.id] = { red_px: red, tan_px: tan, bbox: [x0, y0, x1, y1].map(v => Math.round(v / SC)), top_px: Math.round(y0 / SC), ground_px: Math.round(y1 / SC), face: t.view === 'front' && !t.hen ? { n: faceN, coloured_share: +(colour / Math.max(1, faceN)).toFixed(4), grey_share: +(grey / Math.max(1, faceN)).toFixed(4), darkest_skin: minLo, shade_touched: changed } : undefined,
      hair_streak_smooth40: t.hen ? undefined : streak(base, sh, W, H, headTop, headBot), hair_streak_smooth0: t.hen ? undefined : streak(base, sh0, W, H, headTop, headBot) };
    g.putImageData(new ImageData(sh, W, H), 0, 0); C[t.id] = { c, t, bb: [x0, y0, x1, y1] };
    const s = document.createElement('canvas'); s.width = W; s.height = H; const gs = s.getContext('2d'); gs.drawImage(c, 0, 0); gs.globalCompositeOperation = 'source-in'; gs.fillStyle = '#000'; gs.fillRect(0, 0, W, H); C['SIL:' + t.id] = { c: s, t, bb: [x0, y0, x1, y1] }; }
  // contact sheet
  const SW = 1600, LAB = 26, sheet = document.getElementById('sheet'); sheet.width = SW; sheet.height = ROWS.reduce((a, r) => a + r.h + LAB + 10, 10); const g = sheet.getContext('2d'); g.fillStyle = '#e9e2d2'; g.fillRect(0, 0, SW, sheet.height);
  let y = 10; for (const r of ROWS) { g.fillStyle = '#d8cfbb'; g.fillRect(0, y + LAB, SW, r.h); g.fillStyle = '#2a1a1f'; g.font = '700 15px Arial'; g.fillText(r.label, 10, y + 18);
    const its = r.ids.map(id => C[id]), cell = SW / its.length, ppmOf = o => o.t.hen ? 1 : o.t.px / o.t.height, ppmMax = Math.max(...its.filter(o => !o.t.hen).map(ppmOf), 0) || 1;   // same metres-to-pixels inside a row: sizes compare
    const need = its.map(o => { const k0 = o.t.hen ? 1 : ppmOf(o) / ppmMax; return { k0, hen: o.t.hen, w: (o.bb[2] - o.bb[0]) / k0, h: (GY - o.bb[1]) / k0 }; }), kOf = h => Math.min(...need.filter(n => !!n.hen === h).map(n => Math.min((cell - 8) / n.w, (r.h - 10) / n.h)), 9);
    its.forEach((o, i) => { const kk = kOf(!!o.t.hen) / need[i].k0, bw = o.bb[2] - o.bb[0], bh = GY - o.bb[1] + 6; g.drawImage(o.c, o.bb[0], o.bb[1], bw, bh, i * cell + cell / 2 - (CW / 2 - o.bb[0]) * kk, y + LAB + r.h - 6 - (GY - o.bb[1]) * kk, bw * kk, bh * kk); });
    y += r.h + LAB + 10; }
  // face-and-hair zoom
  const fc = document.getElementById('faces'); fc.width = SW; fc.height = FACES.reduce((a, r) => a + r.h + 6, 6); const gf = fc.getContext('2d'); gf.fillStyle = '#cfc6b2'; gf.fillRect(0, 0, SW, fc.height); y = 6;
  for (const r of FACES) { const cell = SW / r.ids.length; r.ids.forEach((id, i) => { const o = C[id], R = o.t.headPx * .5 * SC, hcy = o.t.hy * SC, cw = 4.3 * R, chh = cw * r.h / (cell - 6), sy = hcy - chh * .62; gf.drawImage(o.c, CW / 2 - cw / 2, sy, cw, chh, i * cell + 3, y, cell - 6, r.h); }); y += r.h + 6; }
  // RECLINED PROOF: each reclined card on a steel table whose head section is raised 35 deg (the plane runs from the hips up and back), a pillow,
  // and a blue drape from the chest to past the feet with the knee window (iodine orange, three dark dots), stacked as the OR shot will stack it.
  const rc = document.getElementById('rec'), RW = 1600, RH = 560; rc.width = RW; rc.height = RH; const gr = rc.getContext('2d'); gr.fillStyle = '#4fa59a'; gr.fillRect(0, 0, RW, RH); gr.fillStyle = '#123a36'; gr.fillRect(0, 0, RW, 40);
  REC_IDS.forEach((id, i) => { const o = C[id], cell = RW / REC_IDS.length, k = .5, ox = i * cell + cell / 2 - 400 * SC * k + 40, oy = RH - 60 - 1430 * SC * k, X = x => ox + x * SC * k, Y = y => oy + y * SC * k;
    let hx = 400, hy = 1430; { const g0 = o.c.getContext('2d').getImageData(0, 0, CW, CH).data; let ym = 0; for (let yy = CH - 1; yy > 0 && !ym; yy--) for (let xx = 0; xx < CW; xx++) if (g0[(yy * CW + xx) * 4 + 3] > 128) { ym = yy; break; } let xm = CW; for (let yy = ym - 24; yy <= ym; yy++) for (let xx = 0; xx < xm; xx++) if (g0[(yy * CW + xx) * 4 + 3] > 128) { xm = xx; break; } hx = xm / SC + 6; hy = ym / SC; }
    const a = 35 * Math.PI / 180, Lp = 760, ex = hx - Math.cos(a) * Lp, ey = hy - Math.sin(a) * Lp, th = 60;
    gr.lineJoin = 'round'; gr.lineWidth = 5; gr.strokeStyle = '#2a1a1f';
    gr.fillStyle = '#9aa6b0'; gr.beginPath(); gr.moveTo(X(hx + 520), Y(hy)); gr.lineTo(X(hx), Y(hy)); gr.lineTo(X(ex), Y(ey)); gr.lineTo(X(ex + 20), Y(ey + th)); gr.lineTo(X(hx + 10), Y(hy + th)); gr.lineTo(X(hx + 520), Y(hy + th)); gr.closePath(); gr.fill(); gr.stroke();
    gr.fillStyle = '#2f5f8a'; gr.beginPath(); gr.moveTo(X(hx + 520), Y(hy - 2)); gr.lineTo(X(hx), Y(hy - 2)); gr.lineTo(X(ex + 8), Y(ey - 2)); gr.lineTo(X(ex + 14), Y(ey + 22)); gr.lineTo(X(hx + 6), Y(hy + 22)); gr.lineTo(X(hx + 520), Y(hy + 22)); gr.closePath(); gr.fill(); gr.stroke();
    gr.fillStyle = '#f4f2ea'; gr.beginPath(); gr.ellipse(X(ex + 150), Y(ey + 60), 120 * SC * k, 42 * SC * k, -a, 0, 7); gr.fill(); gr.stroke();
    gr.drawImage(o.c, ox, oy, CW * k, CH * k);
    const cx0 = hx - Math.cos(a) * 250, cy0 = hy - Math.sin(a) * 250 - 70, kx = hx + 190, ky = hy - 230;
    gr.fillStyle = '#2f5fa8'; gr.beginPath(); gr.moveTo(X(cx0 - 30), Y(cy0 + 10)); gr.quadraticCurveTo(X(hx - 40), Y(hy - 210), X(kx - 70), Y(ky + 10)); gr.quadraticCurveTo(X(kx), Y(ky - 40), X(kx + 70), Y(ky + 20)); gr.quadraticCurveTo(X(hx + 420), Y(hy - 140), X(hx + 560), Y(hy - 40)); gr.lineTo(X(hx + 580), Y(hy + 60)); gr.lineTo(X(hx - 120), Y(hy + 60)); gr.closePath(); gr.fill(); gr.stroke();
    gr.lineWidth = 3; gr.strokeStyle = '#1e3f78'; for (const q of [[hx - 60, hy - 120, hx + 40, hy + 40], [hx + 300, hy - 120, hx + 380, hy + 40]]) { gr.beginPath(); gr.moveTo(X(q[0]), Y(q[1])); gr.quadraticCurveTo(X(q[0] + 20), Y((q[1] + q[3]) / 2), X(q[2]), Y(q[3])); gr.stroke(); }
    gr.strokeStyle = '#2a1a1f'; gr.lineWidth = 4; gr.fillStyle = '#c0702a'; gr.beginPath(); gr.ellipse(X(kx), Y(ky + 8), 52 * SC * k, 30 * SC * k, 0, 0, 7); gr.fill(); gr.stroke();
    gr.fillStyle = '#4a2a18'; for (const dx of [-24, 0, 24]) { gr.beginPath(); gr.arc(X(kx + dx), Y(ky + 6), 6 * SC * k, 0, 7); gr.fill(); }
    gr.fillStyle = '#fff'; gr.font = '700 15px Arial'; gr.fillText(['rest  k:drowsy', 'row 10 thumbs-up  k:thumbsSmile', 'row 30 smile  pt_smile', 'side view  pt_recline_side'][i], i * cell + 12, 26); });
  const ph = document.createElement('canvas'); ph.width = 360; ph.height = Math.round(RH * 360 / (RW / 2)); ph.getContext('2d').drawImage(rc, 0, 0, RW / 2, RH, 0, 0, 360, ph.height);
  return { NUM, PNG, sheet: sheet.toDataURL('image/png'), faces: fc.toDataURL('image/png'), rec: rc.toDataURL('image/png'), phone: ph.toDataURL('image/png') }; };
</script></body></html>`;
let chromium; try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = require(path.join(KIT, 'node_modules/playwright'))); }
const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: 1600, height: 900 } }); pg.on('pageerror', e => console.log('PAGE ERROR', e.message));
await pg.setContent(html); const res = await pg.evaluate(() => window.run()); await b.close(); fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(VIEWS, { recursive: true });
const save = (f, url) => fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64'));
save(path.join(OUT, 'cast_sheet.png'), res.sheet); save(path.join(OUT, 'cast_faces.png'), res.faces); save(path.join(OUT, 'recline_proof.png'), res.rec); save(path.join(OUT, 'recline_proof_phone360.png'), res.phone);
for (const t of tiles) if (t.view === 'front' && t.id === t.who + '_front' && KEYS.cast[t.who]) KEYS.cast[t.who].heads_tall = +(t.px / t.headPx).toFixed(2);
fs.writeFileSync(path.join(CAST, 'CAST_KEYS.json'), JSON.stringify(KEYS, null, 1));
for (const [id, url] of Object.entries(res.PNG)) save(path.join(VIEWS, id + '.png'), url);
fs.writeFileSync(path.join(OUT, 'numbers.json'), JSON.stringify(res.NUM, null, 1));
// the short table (numbers before pictures)
let bad = 0; const line = (id, n) => { const fa = n.face, s = n.hair_streak_smooth40, s0 = n.hair_streak_smooth0; const flags = [];
  const msk = MASKED.has(id.split('_')[0]); if (fa && !msk && fa.coloured_share > .05) flags.push('COLOUR ON FACE'); if (fa && fa.grey_share > .12) flags.push('GREY PATCH'); if (fa && fa.shade_touched / fa.n > .03) flags.push('SHADE ON SKIN'); if (s && s.jumps / s.n > .01) flags.push('STREAKS'); if (n.red_px > 0) flags.push('RED ' + n.red_px); if (!/_recline/.test(id) && (n.ground_px < 1425 || n.ground_px > 1445)) flags.push('FEET ' + n.ground_px);
  bad += flags.length; return `${id.padEnd(20)} top ${String(n.top_px).padStart(4)} feet ${n.ground_px}` + (fa ? `  face: colour ${fa.coloured_share} grey ${fa.grey_share} darkest ${fa.darkest_skin} touched ${fa.shade_touched}` : '') + (s ? `  streak s40 ${s.mean}/${s.jumps}  s0 ${s0.mean}/${s0.jumps}` : '') + `  red ${n.red_px} tan ${n.tan_px}` + (flags.length ? '   <-- ' + flags.join(', ') : ''); };
const show = Object.entries(res.NUM);
console.log(show.map(([id, n]) => line(id, n)).join('\n')); console.log(bad ? `FLAGS ${bad}` : 'NUMBERS PASS (no red pixel on any costume; face zone: coloured share <= .05 (hat brim edge only), grey share <= .12, shade touches only anti-alias edge pixels < 3 %; hair and hat streak jumps < 1 % of pixels; feet on the ground line)');
console.log('ok', path.join(OUT, 'cast_sheet.png'));

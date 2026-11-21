// character-artist (plane-eater, 2026-11-21; adapted from episodes/yellow-fire-trucks/cast/tools/render_cast.mjs): ONE command =
// six views per character + contact sheet with the new faces + face-and-hair zoom + line-up (and its 360 px phone copy) + numbers.
//   node episodes/plane-eater/cast/tools/render_cast.mjs
//   -> cast/CAST_SHEET.jpg (1600 wide), cast/sheets/CAST_FACES.jpg, cast/sheets/LINEUP.jpg + LINEUP_phone360.jpg, cast/out/numbers.json, cast/views/<name>_<view>.png
// Cards are drawn through the film kit's own puppet adapter (puppets.mjs svgFor) and shaded with the port of film.js costumeShadedTexture
// (CAST_KEYS costume_shade; faces and whites untouched), so the sheet shows what the film shows. LEFT views = svgFor with dir -1 (the film's way).
import fs from 'fs'; import path from 'path'; import os from 'os'; import { fileURLToPath, pathToFileURL } from 'url'; import { createRequire } from 'module';
const HERE = path.dirname(fileURLToPath(import.meta.url)), CAST = path.resolve(HERE, '..'), ROOT = path.resolve(CAST, '../../..'), require = createRequire(import.meta.url);
const PKG = path.join(ROOT, 'templates/vector2d_characters/code'), KIT = path.join(ROOT, 'templates/threejs_film'), OUT = path.join(CAST, 'out'), VIEWS = path.join(CAST, 'views'), SHEETS = path.join(CAST, 'sheets');
const imp = f => import(pathToFileURL(f).href);
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'planeeater_')); fs.mkdirSync(path.join(TMP, 'sheets'));
for (const f of fs.readdirSync(PKG)) if (f.endsWith('.mjs')) fs.copyFileSync(path.join(PKG, f), path.join(TMP, f));
for (const f of ['puppets.mjs', 'poses.mjs']) fs.copyFileSync(path.join(KIT, f), path.join(TMP, f));
const BEFORE = process.env.CAST_BEFORE || '';   // FIX 1 proof: CAST_BEFORE=<old sheet file> -> only out/before/<id>.png, left views mirrored the old way (canvas), nothing else written
fs.copyFileSync(BEFORE || path.join(SHEETS, 'plane_eater.mjs'), path.join(TMP, 'sheets/plane_eater.mjs'));
const [char2d, memes, memes2, memes3, bodies, cast, castkit, grips] = await Promise.all(['char2d', 'memes', 'memes2', 'memes3', 'bodies', 'cast', 'castkit', 'grips'].map(n => imp(path.join(TMP, n + '.mjs'))));
const P = await imp(path.join(TMP, 'puppets.mjs')), sheet = await imp(path.join(TMP, 'sheets/plane_eater.mjs')), castIndex = {};
for (const c of sheet.CAST) { castIndex[c.name] = c; castIndex['plane_eater/' + c.name] = c; }
const KEYS = JSON.parse(fs.readFileSync(path.join(CAST, 'CAST_KEYS.json'), 'utf8')), CS = KEYS.costume_shade;
P.initPuppets({ char2d, memes, memes2, memes3, bodies, cast, castkit, castIndex, grips, motion: { LIB: [], mods: {}, cloth: null }, epFaces: KEYS.faces_ep, faceShadow: KEYS.face_shadow });
const V6 = ['front', '34', '34L', 'side', 'sideL', 'back'], DRV = Object.keys(KEYS.cast).filter(w => KEYS.cast[w].in_vehicle), ALL = Object.keys(KEYS.cast).filter(w => !DRV.includes(w) && (!BEFORE || castIndex[w])), HERO = new Set(['michel']);
const tiles = [], T = (who, st = {}) => { const E = KEYS.cast[who], m = P.metrics(E), v = st.view || 'front', mir = /L$/.test(v), vw = mir ? v.slice(0, -1) : v;
  const svg = P.svgFor(E, { view: vw, dir: 1, pose: 'stand', face: 'standard', prop: null, hand: null, mouth: null, blink: null, ...st, view: vw, ...(mir && !BEFORE ? { dir: -1 } : {}) });   // FIX 1 (2026-11-21): LEFT views drawn with dir -1 as film.js does (svgFor), no longer a canvas mirror of the right card
  const id = `${who}_${v}${st.tag ? '_' + st.tag : ''}`; tiles.push({ id, who, view: v, mir, flip: mir && !!BEFORE, hy: m.hy, headPx: m.headPx, px: m.px, height: E.height, hero: HERO.has(who), svg: 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64') }); return id; };
for (const w of ALL) for (const v of ['front', '34', '34L', 'side', 'sideL', 'back']) T(w, { view: v });
const six = w => V6.map(v => `${w}_${v}`);
const FX = [['michel', 'k:peChew', 'front'], ['michel', 'k:peChew', '34'], ['michel', 'k:peChew', 'side'], ['michel', 'k:peChewHard', '34'], ['michel', 'k:peDisgust', 'front'], ['michel', 'k:peDisgust', '34'],
  ['owner', 'k:peJawDrop', 'front'], ['owner', 'k:peJawDrop', '34'], ['ownerBeardXL', 'k:peJawDrop', 'front'], ['ownerBeardXL', 'k:peJawDrop', '34'], ['doctor', 'k:peJawDrop', '34'], ['doctorSlid', 'k:peDisgust', 'front'],
  ['michel', 'k:slyWink', '34'], ['michel', 'k:proud', 'front'], ['doctor', 'k:browUp', '34'], ['owner', 'k:laugh', 'front']];
const fxIds = FX.map(([w, fc, v]) => T(w, { view: v, face: fc, tag: fc.slice(2) }));
const rows = [
  { h: 330, label: 'MICHEL (thin; TOMATO RED only on him: bow tie + gingham napkin; signature: waxed moustache tips split like fork tines): six views  |  THE DOCTOR (fat; half-moon glasses; odd brown bottom button): six views', ids: [...six('michel'), ...six('doctor')] },
  { h: 330, label: 'THE OWNER (standard; olive coverall, grey cap with a silver wing badge, YELLOW rag in the hip pocket, pencil behind the ear, stubble): six views  |  Doctor glasses slid  |  black fill', ids: [...six('owner'), 'doctorSlid_front', 'doctorSlid_34', 'SIL:michel_front', 'SIL:doctor_front', 'SIL:owner_front'] },
  { h: 360, label: 'OWNER BEARD PROP, 4 sizes for the two-year time-lapse: S, M, L, XL (to the knees) front  |  XL in 3/4 R, side R, 3/4 L, back  |  black fill XL', ids: ['ownerBeardS_front', 'ownerBeardM_front', 'ownerBeardL_front', 'ownerBeardXL_front', 'ownerBeardXL_34', 'ownerBeardXL_side', 'ownerBeardXL_34L', 'ownerBeardXL_back', 'SIL:ownerBeardXL_front'] },
  { h: 330, label: 'NEW FACES (film sheet only, locked package untouched): CHEW with cheek bulge (front, 3/4, side, hard + watering)  |  DISGUST (front, 3/4)  |  JAW DROP: owner front, 3/4, bearded front, 3/4, doctor 3/4  |  doctor slid + disgust', ids: fxIds.slice(0, 12) },
  { h: 300, label: 'KIT FACES on this cast (no change): Michel sly wink 3/4 (last frame), proud front  |  Doctor brow up 3/4  |  Owner laugh front (line 1)', ids: fxIds.slice(12) },
];
const faces = [{ h: 300, ids: ['michel_front_peChew', 'michel_34_peChew', 'michel_side_peChew', 'michel_34_peChewHard', 'michel_front_peDisgust', 'michel_34_peDisgust'] },
  { h: 300, ids: ['owner_front_peJawDrop', 'owner_34_peJawDrop', 'ownerBeardXL_front_peJawDrop', 'ownerBeardXL_34_peJawDrop', 'doctor_34_peJawDrop', 'doctorSlid_front_peDisgust'] },
  { h: 300, ids: ['michel_front', 'michel_34', 'michel_side', 'doctor_front', 'doctor_34', 'owner_34'] }];
const LINE = ['doctor', 'michel', 'owner', 'ownerBeardXL'];
const html = `<html><body style="margin:0;background:#fff"><canvas id="sheet"></canvas><canvas id="faces"></canvas><canvas id="line"></canvas><script>
const CS = ${JSON.stringify(CS)}, TILES = ${JSON.stringify(tiles)}, ROWS = ${JSON.stringify(BEFORE ? [] : rows)}, FACES = ${JSON.stringify(BEFORE ? [] : faces)}, LINE = ${JSON.stringify(LINE)}, SC = .75, CW = 800 * SC, CH = 1500 * SC, GY = 1440 * SC;
function shade(base, W, H, side, smooth) { const d = new Uint8ClampedArray(base), A = CS.amount, st0 = CS.start, cool = CS.cool, sc = H / 1500;
  const ink = i => base[i] + base[i + 1] + base[i + 2] < 150, skin = i => { const ch = Math.max(base[i], base[i + 1], base[i + 2]) - Math.min(base[i], base[i + 1], base[i + 2]), lo = Math.min(base[i], base[i + 1], base[i + 2]); return ch <= 40 && lo >= 150; };
  const XL = new Float32Array(H).fill(-1), XR = new Float32Array(H).fill(-1);
  for (let y = 0; y < H; y++) { let xl = -1, xr = -1; for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; if (base[i + 3] < 128 || ink(i) || skin(i)) continue; if (xl < 0) xl = x; xr = x; } XL[y] = xl; XR[y] = xr; }
  if (smooth > 0) { const n = Math.max(1, Math.round(smooth * sc)), a = XL.slice(), b = XR.slice(); for (let y = 0; y < H; y++) { if (a[y] < 0) continue; let sl = 0, sr = 0, m = 0; for (let q = Math.max(0, y - n); q <= Math.min(H - 1, y + n); q++) if (a[q] >= 0) { sl += a[q]; sr += b[q]; m++; } XL[y] = sl / m; XR[y] = sr / m; } }
  for (let y = 0; y < H; y++) { const xl = XL[y], xr = XR[y]; if (xl < 0 || xr - xl < 6) continue; const w = xr - xl;
    for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; if (base[i + 3] < 40 || ink(i) || skin(i)) continue; let u = Math.min(1, Math.max(0, (x - xl) / w)); if (side < 0) u = 1 - u; let t = (u - st0) / (1 - st0); if (t <= 0) continue; t = Math.min(1, t); t = t * t * (3 - 2 * t); const k = 1 - A * t;
      d[i] = Math.round(base[i] * k * (1 - cool * t * .5)); d[i + 1] = Math.round(base[i + 1] * k * (1 - cool * t * .25)); d[i + 2] = Math.round(base[i + 2] * Math.min(1, k * (1 + cool * t * .2))); } }
  return d; }
const hueOf = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b); if (mx === mn) return 0; let h = mx === r ? 60 * ((g - b) / (mx - mn)) : mx === g ? 60 * (2 + (b - r) / (mx - mn)) : 60 * (4 + (r - g) / (mx - mn)); return h < 0 ? h + 360 : h; };
const dh = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
window.run = async () => { const C = {}, NUM = {}, PNG = {};
  for (const t of TILES) { const im = new Image(); await new Promise(ok => { im.onload = ok; im.src = t.svg; }); const c = document.createElement('canvas'); c.width = CW; c.height = CH; const g = c.getContext('2d', { willReadFrequently: true });
    if (t.flip) { g.translate(CW, 0); g.scale(-1, 1); } g.drawImage(im, 0, 0, CW, CH); g.setTransform(1, 0, 0, 1, 0, 0); g.setTransform(1, 0, 0, 1, 0, 0);
    const W = CW, H = CH, base = g.getImageData(0, 0, W, H).data, v0 = t.view.replace('L', ''), side = (v0 === '34' || v0 === 'side') ? (t.mir ? 1 : -1) : 1;   // light from screen left: the shade falls on the side away from it
    const sh = shade(base, W, H, side, CS.smooth);
    let x0 = W, x1 = 0, y0 = H, y1 = 0; for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (base[(y * W + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const hcx = W / 2, hcy = t.hy * SC, R = t.headPx * .5 * SC; let faceN = 0, colour = 0, grey = 0, minLo = 255;
    if (t.view === 'front') for (let y = Math.round(hcy - .3 * R); y < hcy + .62 * R; y++) for (let x = Math.round(hcx - .55 * R); x < hcx + .55 * R; x++) { const i = (y * W + x) * 4; if (base[i + 3] < 200) continue; const r = sh[i], gg = sh[i + 1], b = sh[i + 2], lo = Math.min(r, gg, b), ch = Math.max(r, gg, b) - lo; if (r + gg + b < 150) continue; if (Math.abs(x - hcx) < .62 * R && y > hcy + .02 * R && y < hcy + .4 * R) continue; faceN++;   /* moustache box excluded (facial hair is hair) */
        if (ch > 40) colour++; else if (lo < 200) grey++; if (ch <= 40 && lo < minLo) minLo = lo; }
    let red = 0, yel = 0, teal = 0, gold = 0, rag = 0; for (let i = 0; i < sh.length; i += 4) { if (base[i + 3] < 200) continue; const r = sh[i], gg = sh[i + 1], b = sh[i + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b); if (!mx) continue; const s = (mx - mn) / mx, v = mx / 255, h = hueOf(r, gg, b);
      if (s > .5 && v > .45 && dh(h, 4) <= 12) red++;               // TOMATO RED #D8342A (Michel only)
      if (s > .45 && v > .55 && h >= 48 && h <= 78) yel++;            // lemon / lime / yellow family (#E3EA22 = 62 deg)
      if (s > .6 && v > .55 && h >= 34 && h < 48) gold++;           // gold / brass (shield, buckle, pins)
      if (s > .5 && v > .4 && dh(h, 178) <= 14) teal++; if (s > .5 && v > .38 && h >= 38 && h <= 60) rag++; }            // HERO teal #12A5A0
    NUM[t.id] = { rag_px: rag, red_px: red, yellow_px: yel, gold_px: gold, teal_px: teal, top_px: Math.round(y0 / SC), ground_px: Math.round(y1 / SC), face: t.view === 'front' ? { n: faceN, coloured_share: +(colour / Math.max(1, faceN)).toFixed(4), grey_share: +(grey / Math.max(1, faceN)).toFixed(4), darkest_skin: minLo } : undefined };
    g.putImageData(new ImageData(sh, W, H), 0, 0); PNG[t.id] = c.toDataURL('image/png'); C[t.id] = { c, t, bb: [x0, y0, x1, y1] };
    const s = document.createElement('canvas'); s.width = W; s.height = H; const gs = s.getContext('2d'); gs.drawImage(c, 0, 0); gs.globalCompositeOperation = 'source-in'; gs.fillStyle = '#000'; gs.fillRect(0, 0, W, H); C['SIL:' + t.id] = { c: s, t, bb: [x0, y0, x1, y1] }; }
  const SW = 1600, LAB = 24, sheet = document.getElementById('sheet'); sheet.width = SW; sheet.height = ROWS.reduce((a, r) => a + r.h + LAB + 8, 8); const g = sheet.getContext('2d'); g.fillStyle = '#e4e2dd'; g.fillRect(0, 0, SW, sheet.height);
  const VL = { front: 'front', '34': '3/4 R', '34L': '3/4 L', side: 'side R', sideL: 'side L', back: 'back' };
  let y = 8; for (const r of ROWS) { g.fillStyle = '#cfccc5'; g.fillRect(0, y + LAB, SW, r.h); g.fillStyle = '#22202a'; g.font = '700 13px Arial'; g.fillText(r.label, 8, y + 16);
    const its = r.ids.map(id => C[id] || (() => { throw new Error('no tile ' + id); })()), cell = SW / its.length, ppmOf = o => o.t.px / o.t.height, ppmMax = Math.max(...its.map(ppmOf));
    const need = its.map(o => { const k0 = ppmOf(o) / ppmMax; return { k0, w: (o.bb[2] - o.bb[0]) / k0, h: (GY - o.bb[1]) / k0 }; }), kk0 = Math.min(...need.map(n => Math.min((cell - 6) / n.w, (r.h - 22) / n.h)), 9);
    its.forEach((o, i) => { const kk = kk0 / need[i].k0, bw = o.bb[2] - o.bb[0], bh = GY - o.bb[1] + 6; g.drawImage(o.c, o.bb[0], o.bb[1], bw, bh, i * cell + cell / 2 - (CW / 2 - o.bb[0]) * kk, y + LAB + r.h - 18 - (GY - o.bb[1]) * kk, bw * kk, bh * kk);
      g.fillStyle = '#4a4650'; g.font = '11px Arial'; g.textAlign = 'center'; const id = r.ids[i]; g.fillText(id.startsWith('SIL:') ? 'black fill ' + o.t.who : (o.t.who + ' ' + (VL[o.t.view] || o.t.view)), i * cell + cell / 2, y + LAB + r.h - 4); g.textAlign = 'left';
      if (i && its[i - 1].t.who !== o.t.who && !id.startsWith('SIL:')) { g.fillStyle = '#9a968e'; g.fillRect(i * cell - 1, y + LAB + 4, 2, r.h - 8); } });
    y += r.h + LAB + 8; }
  const fc = document.getElementById('faces'); fc.width = SW; fc.height = FACES.reduce((a, r) => a + r.h + 24, 6); const gf = fc.getContext('2d'); gf.fillStyle = '#cfccc5'; gf.fillRect(0, 0, SW, fc.height); y = 6;
  for (const r of FACES) { const cell = SW / r.ids.length; r.ids.forEach((id, i) => { const o = C[id], R = o.t.headPx * .5 * SC, hcy = o.t.hy * SC, cw = 4.3 * R, chh = cw * r.h / (cell - 6), sy = hcy - chh * .62; gf.drawImage(o.c, CW / 2 - cw / 2, sy, cw, chh, i * cell + 3, y, cell - 6, r.h);
      gf.fillStyle = '#22202a'; gf.font = '700 13px Arial'; gf.fillText(id.replace(/_/g, ' '), i * cell + 8, y + r.h + 16); }); y += r.h + 24; }
  const lc = document.getElementById('line'), LW = 1600, LH = 620; lc.width = LW; lc.height = LH; const gl = lc.getContext('2d'); gl.fillStyle = '#dcd8cf'; gl.fillRect(0, 0, LW, LH); gl.fillStyle = '#bdb6a8'; gl.fillRect(0, LH - 70, LW, 70);
  const its = LINE.map(w => C[w + '_front']), ppm = Math.max(...its.map(o => o.t.px / o.t.height)), kL = (LH - 90) / Math.max(...its.map(o => (GY - o.bb[1]) / (o.t.px / o.t.height / ppm))) ;
  its.forEach((o, i) => { const k = kL * ppm / (o.t.px / o.t.height), cx = (i + .5) * LW / its.length, bw = o.bb[2] - o.bb[0], bh = GY - o.bb[1] + 6; gl.drawImage(o.c, o.bb[0], o.bb[1], bw, bh, cx - (CW / 2 - o.bb[0]) * k, LH - 40 - (GY - o.bb[1]) * k, bw * k, bh * k); });
  const ph = document.createElement('canvas'); ph.width = 360; ph.height = Math.round(LH * 360 / LW); ph.getContext('2d').drawImage(lc, 0, 0, 360, ph.height);
  return { NUM, PNG, sheet: sheet.toDataURL('image/jpeg', .9), faces: fc.toDataURL('image/jpeg', .9), line: lc.toDataURL('image/jpeg', .9), phone: ph.toDataURL('image/jpeg', .92) }; };
</script></body></html>`;
let chromium; try { ({ chromium } = await import('playwright')); } catch { try { ({ chromium } = require(path.join(KIT, 'node_modules/playwright'))); } catch { ({ chromium } = require(process.env.PLAYWRIGHT_DIR || '/opt/node-tools/node_modules/playwright')); } }
const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: 1600, height: 900 } }); pg.on('pageerror', e => console.log('PAGE ERROR', e.message));
await pg.setContent(html); const res = await pg.evaluate(() => window.run()); await b.close(); fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(VIEWS, { recursive: true });
const save = (f, url) => fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64'));
if (BEFORE) { const BD = path.join(OUT, 'before'); fs.mkdirSync(BD, { recursive: true }); for (const [id, url] of Object.entries(res.PNG)) if (!/^SIL:/.test(id)) save(path.join(BD, id + '.png'), url); console.log('before views ->', BD); process.exit(0); }
save(path.join(CAST, 'CAST_SHEET.jpg'), res.sheet); save(path.join(SHEETS, 'CAST_FACES.jpg'), res.faces); save(path.join(SHEETS, 'LINEUP.jpg'), res.line); save(path.join(SHEETS, 'LINEUP_phone360.jpg'), res.phone);
for (const t of tiles) if (t.view === 'front' && t.id === t.who + '_front' && KEYS.cast[t.who]) KEYS.cast[t.who].heads_tall = +(t.px / t.headPx).toFixed(2);
for (const w of DRV) { const E = KEYS.cast[w], m = P.metrics(E), up = (sheet.DRIVER_HIP || {})[w]; if (!up) continue; const k = E.height / m.px;   // FIX 3: seat line in metres (card pos z = seat_z - hip_up_m)
  E.hip_up_m = +(up * k).toFixed(3); E.seated_head_m = +((m.px - up) * k).toFixed(3); E.cut_px = up - 14; console.log(`${w}: hip_up_m ${E.hip_up_m}  head top above the seat ${E.seated_head_m} m`); }
fs.writeFileSync(path.join(CAST, 'CAST_KEYS.json'), JSON.stringify(KEYS, null, 1));
for (const [id, url] of Object.entries(res.PNG)) if (!/^SIL:/.test(id)) save(path.join(VIEWS, id + '.png'), url);
fs.writeFileSync(path.join(OUT, 'numbers.json'), JSON.stringify(res.NUM, null, 1));
let bad = 0; const flagsOf = (id, n) => { const who = id.split('_')[0], fl = [], fa = n.face;
  if (fa && fa.coloured_share > .05) fl.push('COLOUR ON FACE ' + fa.coloured_share); if (fa && fa.grey_share > .12) fl.push('GREY PATCH ' + fa.grey_share);
  if (!HERO.has(who) && n.red_px > 0) fl.push('RED OFF-MICHEL ' + n.red_px); if (HERO.has(who) && !/back/.test(id) && n.red_px < 200) fl.push('MICHEL RED MISSING ' + n.red_px); const yg = n.rag_px; if (!/^owner/.test(who) && yg > 0) fl.push('YELLOW OFF-OWNER ' + yg); if (/^owner/.test(who) && yg < 300) fl.push('RAG MISSING ' + yg);
  if (!DRV.includes(who) && (n.ground_px < 1425 || n.ground_px > 1445)) fl.push('FEET ' + n.ground_px); return fl; };
for (const [id, n] of Object.entries(res.NUM)) { const fl = flagsOf(id, n); bad += fl.length; if (fl.length || id.endsWith('_front')) console.log(`${id.padEnd(28)} feet ${n.ground_px} red ${n.red_px} rag ${n.rag_px}` + (n.face ? ` face colour ${n.face.coloured_share} grey ${n.face.grey_share}` : '') + (fl.length ? '   <-- ' + fl.join(', ') : '')); }
console.log(`${Object.keys(res.NUM).length} tiles, ${bad ? 'FLAGS ' + bad : 'NUMBERS PASS'}`); console.log('ok', path.join(CAST, 'CAST_SHEET.jpg'));

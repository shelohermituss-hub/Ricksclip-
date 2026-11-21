// character-artist (yellow-fire-trucks, phase A 2026-11-20; adapted from episodes/fake-surgery/cast/tools/render_cast.mjs): ONE command =
// six views per character + contact sheet + face-and-hair zoom + line-up (and its 360 px phone copy) + numbers.
//   node episodes/yellow-fire-trucks/cast/tools/render_cast.mjs
//   -> cast/sheets/CAST_SHEET.jpg (1600 wide), cast/sheets/CAST_FACES.jpg, cast/sheets/LINEUP.jpg + LINEUP_phone360.jpg, cast/out/numbers.json, cast/views/<name>_<view>.png
// Cards are drawn through the film kit's own puppet adapter (puppets.mjs svgFor) and shaded with the port of film.js costumeShadedTexture
// (CAST_KEYS costume_shade; faces and whites untouched), so the sheet shows what the film shows. LEFT views = svgFor with dir -1 (the film's way, FIX 1 2026-11-21).
import fs from 'fs'; import path from 'path'; import os from 'os'; import { fileURLToPath, pathToFileURL } from 'url'; import { createRequire } from 'module';
const HERE = path.dirname(fileURLToPath(import.meta.url)), CAST = path.resolve(HERE, '..'), ROOT = path.resolve(CAST, '../../..'), require = createRequire(import.meta.url);
const PKG = path.join(ROOT, 'templates/vector2d_characters/code'), KIT = path.join(ROOT, 'templates/threejs_film'), OUT = path.join(CAST, 'out'), VIEWS = path.join(CAST, 'views'), SHEETS = path.join(CAST, 'sheets');
const imp = f => import(pathToFileURL(f).href);
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'firetrucks_')); fs.mkdirSync(path.join(TMP, 'sheets'));
for (const f of fs.readdirSync(PKG)) if (f.endsWith('.mjs')) fs.copyFileSync(path.join(PKG, f), path.join(TMP, f));
for (const f of ['puppets.mjs', 'poses.mjs']) fs.copyFileSync(path.join(KIT, f), path.join(TMP, f));
const BEFORE = process.env.CAST_BEFORE || '';   // FIX 1 proof: CAST_BEFORE=<old sheet file> -> only out/before/<id>.png, left views mirrored the old way (canvas), nothing else written
fs.copyFileSync(BEFORE || path.join(SHEETS, 'firetrucks.mjs'), path.join(TMP, 'sheets/firetrucks.mjs'));
const [char2d, memes, memes2, memes3, bodies, cast, castkit, grips] = await Promise.all(['char2d', 'memes', 'memes2', 'memes3', 'bodies', 'cast', 'castkit', 'grips'].map(n => imp(path.join(TMP, n + '.mjs'))));
const P = await imp(path.join(TMP, 'puppets.mjs')), sheet = await imp(path.join(TMP, 'sheets/firetrucks.mjs')), castIndex = {};
for (const c of sheet.CAST) { castIndex[c.name] = c; castIndex['firetrucks/' + c.name] = c; }
const KEYS = JSON.parse(fs.readFileSync(path.join(CAST, 'CAST_KEYS.json'), 'utf8')), CS = KEYS.costume_shade;
P.initPuppets({ char2d, memes, memes2, memes3, bodies, cast, castkit, castIndex, grips, motion: { LIB: [], mods: {}, cloth: null }, epFaces: KEYS.faces_ep, faceShadow: KEYS.face_shadow });
const V6 = ['front', '34', '34L', 'side', 'sideL', 'back'], DRV = Object.keys(KEYS.cast).filter(w => KEYS.cast[w].in_vehicle), ALL = Object.keys(KEYS.cast).filter(w => !DRV.includes(w) && (!BEFORE || castIndex[w])), HERO = new Set(['hero', 'heroShop', 'heroBare', 'heroShopEye']);
const tiles = [], T = (who, st = {}) => { const E = KEYS.cast[who], m = P.metrics(E), v = st.view || 'front', mir = /L$/.test(v), vw = mir ? v.slice(0, -1) : v;
  const svg = P.svgFor(E, { view: vw, dir: 1, pose: 'stand', face: 'standard', prop: null, hand: null, mouth: null, blink: null, ...st, view: vw, ...(mir && !BEFORE ? { dir: -1 } : {}) });   // FIX 1 (2026-11-21): LEFT views drawn with dir -1 as film.js does (svgFor), no longer a canvas mirror of the right card
  const id = `${who}_${v}${st.tag ? '_' + st.tag : ''}`; tiles.push({ id, who, view: v, mir, flip: mir && !!BEFORE, hy: m.hy, headPx: m.headPx, px: m.px, height: E.height, hero: HERO.has(who), svg: 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64') }); return id; };
for (const w of ALL) for (const v of ['front', '34', '34L', 'side', 'sideL', 'back']) T(w, { view: v });
const six = w => V6.map(v => `${w}_${v}`);
const FX = [['hero', 'k:aim', 'front'], ['hero', 'k:glanceCam', '34'], ['hero', 'k:proud', '34'], ['heroShop', 'k:think', '34'], ['chief', 'k:chiefShout', 'front'], ['chief', 'k:chiefShout', '34'], ['chief', 'k:proudShut', '34'],
  ['rookie', 'k:peekOne', 'front'], ['rookie', 'k:lipBite', '34'], ['rookie', 'k:browUp', '34'], ['milkman', 'k:frozenWide', 'front'], ['sceptic', 'k:browUp', '34'], ['oldTimer', 'k:sleepy', '34'], ['kid', 'k:confused', '34'], ['clerk', 'k:concentrate', '34']];
const fxIds = FX.map(([w, fc, v]) => T(w, { view: v, face: fc, tag: fc.slice(2) }));
const DV = ['front', '34', '34L', 'side'], drvIds = BEFORE ? [] : DRV.flatMap(w => DV.map(v => T(w, { view: v, pose: 'drive', face: 'standard', tag: 'drive' })));   // FIX 3: seated drivers, fists forward on the rim
if (!BEFORE) T('heroShopEye', { view: '34', face: 'k:concentrate', tag: 'concentrate' });
const PT = (process.env.CAST_POSETEST || '').split(',').filter(Boolean), ptIds = PT.flatMap(pz => ['front', '34'].map(v => T('scepticDriver', { view: v, pose: pz, tag: 'pt_' + pz.replace(/\W/g, '_') })));   // scratch: compare plain kit poses on a driver
const rows = [
  { h: 330, label: 'HERO (thin, tall; teal #12A5A0 ONLY on him; signature: big round wire glasses): yard, six views  |  eye shop: open white coat + head mirror, six views', ids: [...six('hero'), ...six('heroShop')] },
  { h: 330, label: 'THE CHIEF (fat, short; signature: grey walrus moustache under the ONLY white helmet): six views  |  VISITOR tag (Dallas) front + 3/4  |  helmet over the eyes + bent moustache  |  hero without helmet  |  black fill', ids: [...six('chief'), 'chiefVisitor_front', 'chiefVisitor_34', 'chiefDown_front', 'heroBare_front', 'SIL:hero_front', 'SIL:chief_front'] },
  { h: 330, label: 'THE OLD-TIMER (standard; coat open over a white vest; lunch box = prop, LEFT fist)  |  THE ROOKIE (thin, short; signature: helmet one size too big)', ids: [...six('oldTimer'), ...six('rookie')] },
  { h: 330, label: 'THE SCEPTIC (standard, tall; horseshoe moustache, long sideburns; signature arms-crossed = pose)  |  Rookie helmet down front + 3/4  |  CROWD firemen 1-3 (never clones) + black fill', ids: [...six('sceptic'), 'rookieDown_front', 'rookieDown_34', 'crew1_front', 'crew2_front', 'crew3_front', 'SIL:rookie_front'] },
  { h: 330, label: 'THE MILKMAN (thin, short; white cap, pencil moustache; bottle = prop, LEFT fist)  |  THE KID (child form; signature: plaster on the LEFT knee)', ids: [...six('milkman'), ...six('kid')] },
  { h: 330, label: 'THE DALLAS CLERK (standard; signature: tan cowboy hat; pencil behind the ear)  |  PAINTER thin (signature: brush behind the ear)', ids: [...six('clerk'), ...six('painterThin')] },
  { h: 330, label: 'FIX 2 heroShopEye: head mirror DOWN over the right eye (S2 row 11), six views  |  FIX 1 badge in the LEFT views: Chief, Old-Timer, Rookie, Sceptic 3/4 L + side L', ids: [...six('heroShopEye'), 'chief_34L', 'chief_sideL', 'oldTimer_34L', 'rookie_34L', 'sceptic_34L', 'crew1_34L'] },
  { h: 330, label: 'FIX 3 SEATED DRIVERS (cut at the seat line, fists on the rim = pose drive): Sceptic, Rookie, Milkman: front, 3/4 R, 3/4 L, side R', ids: drvIds },
  ...(PT.length ? [{ h: 330, label: 'POSE TEST ' + PT.join(' '), ids: ptIds }] : []),
  { h: 330, label: 'PAINTER fat (signature: rag out of the back pocket: side + back)  |  crowd firemen 3/4 and back  |  black fill', ids: [...six('painterFat'), 'crew1_34', 'crew2_back', 'crew3_34', 'SIL:milkman_front', 'SIL:kid_front', 'SIL:clerk_front'] },
];
const faces = [{ h: 300, ids: ['heroShopEye_front', 'heroShopEye_34', 'heroShopEye_34L', 'heroShopEye_side', 'heroShopEye_34_concentrate', 'heroShop_34'] }, { h: 300, ids: ['hero_front', 'hero_34', 'hero_side', 'hero_back', 'heroShop_front', 'heroShop_34'] }, { h: 300, ids: ['hero_front_aim', 'hero_34_glanceCam', 'hero_34_proud', 'heroShop_34_think', 'chief_front_chiefShout', 'chief_34_proudShut'] },
  { h: 300, ids: ['chief_front', 'chief_34', 'chief_side', 'chief_back', 'chiefDown_front', 'chief_34_chiefShout'] }, { h: 300, ids: ['rookie_front_peekOne', 'rookie_34_lipBite', 'rookieDown_front', 'milkman_front_frozenWide', 'sceptic_34_browUp', 'clerk_34_concentrate'] }];
const LINE = ['chief', 'oldTimer', 'rookie', 'hero', 'sceptic', 'milkman', 'kid', 'clerk', 'painterThin', 'painterFat'];
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
    let red = 0, yel = 0, teal = 0, gold = 0; for (let i = 0; i < sh.length; i += 4) { if (base[i + 3] < 200) continue; const r = sh[i], gg = sh[i + 1], b = sh[i + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b); if (!mx) continue; const s = (mx - mn) / mx, v = mx / 255, h = hueOf(r, gg, b);
      if (s > .5 && v > .55 && dh(h, 357) <= 12) red++;              // LOOK_BIBLE THE ONE RED #D3141C
      if (s > .45 && v > .55 && h >= 48 && h <= 78) yel++;            // lemon / lime / yellow family (#E3EA22 = 62 deg)
      if (s > .6 && v > .55 && h >= 34 && h < 48) gold++;           // gold / brass (shield, buckle, pins)
      if (s > .5 && v > .4 && dh(h, 178) <= 14) teal++; }            // HERO teal #12A5A0
    NUM[t.id] = { red_px: red, yellow_px: yel, gold_px: gold, teal_px: teal, top_px: Math.round(y0 / SC), ground_px: Math.round(y1 / SC), face: t.view === 'front' ? { n: faceN, coloured_share: +(colour / Math.max(1, faceN)).toFixed(4), grey_share: +(grey / Math.max(1, faceN)).toFixed(4), darkest_skin: minLo } : undefined };
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
save(path.join(SHEETS, 'CAST_SHEET.jpg'), res.sheet); save(path.join(SHEETS, 'CAST_FACES.jpg'), res.faces); save(path.join(SHEETS, 'LINEUP.jpg'), res.line); save(path.join(SHEETS, 'LINEUP_phone360.jpg'), res.phone);
for (const t of tiles) if (t.view === 'front' && t.id === t.who + '_front' && KEYS.cast[t.who]) KEYS.cast[t.who].heads_tall = +(t.px / t.headPx).toFixed(2);
fs.writeFileSync(path.join(CAST, 'CAST_KEYS.json'), JSON.stringify(KEYS, null, 1));
for (const [id, url] of Object.entries(res.PNG)) if (!/^SIL:/.test(id)) save(path.join(VIEWS, id + '.png'), url);
fs.writeFileSync(path.join(OUT, 'numbers.json'), JSON.stringify(res.NUM, null, 1));
let bad = 0; const flagsOf = (id, n) => { const who = id.split('_')[0], fl = [], fa = n.face;
  if (fa && fa.coloured_share > .05) fl.push('COLOUR ON FACE ' + fa.coloured_share); if (fa && fa.grey_share > .12) fl.push('GREY PATCH ' + fa.grey_share);
  if (n.red_px > 0) fl.push('RED ' + n.red_px); if (n.yellow_px > 0) fl.push('YELLOW ' + n.yellow_px); if (n.gold_px > 40) fl.push('GOLD ' + n.gold_px); if (!HERO.has(who) && n.teal_px > 0) fl.push('TEAL OFF-HERO ' + n.teal_px);
  if (!DRV.includes(who) && (n.ground_px < 1425 || n.ground_px > 1445)) fl.push('FEET ' + n.ground_px); return fl; };
for (const [id, n] of Object.entries(res.NUM)) { const fl = flagsOf(id, n); bad += fl.length; if (fl.length || id.endsWith('_front')) console.log(`${id.padEnd(28)} feet ${n.ground_px} red ${n.red_px} yel ${n.yellow_px} gold ${n.gold_px} teal ${n.teal_px}` + (n.face ? ` face colour ${n.face.coloured_share} grey ${n.face.grey_share}` : '') + (fl.length ? '   <-- ' + fl.join(', ') : '')); }
console.log(`${Object.keys(res.NUM).length} tiles, ${bad ? 'FLAGS ' + bad : 'NUMBERS PASS'}`); console.log('ok', path.join(SHEETS, 'CAST_SHEET.jpg'));

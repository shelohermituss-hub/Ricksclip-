// look-finisher (plane-eater LOOK CARD, 2026-11-21): the posed cast cards for the 3 look-card frames (A apron frame 0, B X-ray row 19-20, C cabin row 36).
//   node episodes/plane-eater/look/cards/make_look_cards.mjs        -> look/cards/raw_<id>.png + raw_meta.json ; then look/cards/finish_look_cards.py
// Drawn through the film kit's own puppet adapter (templates/threejs_film/puppets.mjs svgFor + poses.mjs) from the character-artist's sheet
// cast/sheets/plane_eater.mjs, unedited (copied to a temp dir, as cast/tools/render_cast.mjs does). One run-time pose (pe_hat) whose fists go where
// state.hat puts them (kit HELD-3D hook). 3D props (fork, salt shaker) are added in Blender at the fists; the owner's small far rag is drawn 2D here.
// Method copied from episodes/_style_test/cast/tools/make_cards.mjs (the library's posed-card path).
import fs from 'fs'; import path from 'path'; import os from 'os'; import { fileURLToPath, pathToFileURL } from 'url'; import { createRequire } from 'module';
const HERE = path.dirname(fileURLToPath(import.meta.url)), EP = path.resolve(HERE, '../..'), ROOT = path.resolve(EP, '../..'), require = createRequire(import.meta.url);
const PKG = path.join(ROOT, 'templates/vector2d_characters/code'), KIT = path.join(ROOT, 'templates/threejs_film'), CAST = path.join(EP, 'cast');
const imp = f => import(pathToFileURL(f).href);
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'pe_look_')); fs.mkdirSync(path.join(TMP, 'sheets'));
for (const f of fs.readdirSync(PKG)) if (f.endsWith('.mjs')) fs.copyFileSync(path.join(PKG, f), path.join(TMP, f));
for (const f of ['puppets.mjs', 'poses.mjs']) fs.copyFileSync(path.join(KIT, f), path.join(TMP, f));
fs.copyFileSync(path.join(CAST, 'sheets/plane_eater.mjs'), path.join(TMP, 'sheets/plane_eater.mjs'));
const [char2d, memes, memes2, memes3, bodies, cast, castkit, grips] = await Promise.all(['char2d', 'memes', 'memes2', 'memes3', 'bodies', 'cast', 'castkit', 'grips'].map(n => imp(path.join(TMP, n + '.mjs'))));
const P = await imp(path.join(TMP, 'puppets.mjs')), PO = await imp(path.join(TMP, 'poses.mjs')), sheet = await imp(path.join(TMP, 'sheets/plane_eater.mjs')), castIndex = {};
for (const c of sheet.CAST) { castIndex[c.name] = c; castIndex['plane_eater/' + c.name] = c; }
const KEYS = JSON.parse(fs.readFileSync(path.join(CAST, 'CAST_KEYS.json'), 'utf8'));
P.initPuppets({ char2d, memes, memes2, memes3, bodies, cast, castkit, castIndex, grips, motion: { LIB: [], mods: {}, cloth: null }, epFaces: KEYS.faces_ep, faceShadow: KEYS.face_shadow });
const INK = char2d.INK, f1 = v => (+v).toFixed(1), E = who => KEYS.cast[who];
PO.POSES.pe_hat = { both: [0.5, -0.4], over: 1 };                       // fists at state.hat (both arms in front of the body)
PO.POSES.pe_hat_sit = { both: [0.3, 0.5], drop: 0.5, spread: 0.12, head: 2, chair: 1, over: 1 };
const rest = (who, view, dir, pose = 'stand') => P.poseHands(E(who), { view, dir, pose });
const J = {};
// A. MICHEL, 3/4 facing screen LEFT (toward the wing tip at upper left): one fist high and forward over the wing tip (the shaker, turned over),
//    the other fist up beside his head (the fork, tines up). Face: calm appetite (kit standard is calm; slyWink comes at row 5).
{ const r = rest('michel', '34', -1); J.michel_salt = { who: 'michel', st: { view: '34', dir: -1, pose: 'pe_hat', face: process.env.MF || 'standard',
    hat: { R: [r.sh.R[0] - 190, r.sh.R[1] - 175], L: [r.sh.L[0] + 160, r.sh.L[1] - 120] } }, rest: r }; }
// B. DOCTOR from behind (over the shoulder), both fists up and to screen-right at the top corners of the film on the light box.
{ const r = rest('doctor', 'back', 1); J.doctor_clip = { who: 'doctor', st: { view: 'back', dir: 1, pose: 'pe_hat', face: 'standard',
    hat: { R: [r.sh.R[0] + 150, r.sh.R[1] - 190], L: [r.sh.L[0] + 300, r.sh.L[1] - 180] } }, rest: r }; }
// A. OWNER far behind, back to us, one fist up on the propeller blade with the yellow rag (2D, far and small), the other on the blade below.
{ const r = rest('owner', 'back', 1); J.owner_polish = { who: 'owner', st: { view: 'back', dir: 1, pose: 'pe_hat', face: 'standard',
    hat: { R: [r.sh.R[0] + 120, r.sh.R[1] - 140], L: [r.sh.L[0] + 270, r.sh.L[1] + 20] } }, rest: r, rag: 'R' }; }
// C. MICHEL seated (window seat), 3/4 facing screen LEFT toward the tray, DISGUST face; one fist low and forward on the meal tray edge.
{ const r = rest('michel', '34', -1, 'sit_chair'); J.michel_meal = { who: 'michel', st: { view: '34', dir: -1, pose: 'pe_hat_sit', face: 'k:peDisgust',
    hat: { R: [r.sh.R[0] - 170, r.sh.R[1] + 150], L: [r.sh.L[0] + 20, r.sh.L[1] + 170] } }, rest: r }; }
const rag = (h) => { const [x, y] = h; return `<g transform="rotate(-20 ${f1(x)} ${f1(y)})"><path d="M${f1(x - 30)},${f1(y - 36)} q30,-14 62,4 q6,30 -4,64 q-22,10 -54,-2 q-10,-34 -4,-66 Z" fill="#f2c230" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
  `<path d="M${f1(x - 18)},${f1(y - 20)} q16,8 34,0 M${f1(x - 20)},${f1(y + 4)} q18,6 36,-2" stroke="#c99a12" stroke-width="4" fill="none"/></g>`; };
const fist = (h, r) => `<circle cx="${f1(h[0])}" cy="${f1(h[1])}" r="${f1(r)}" fill="${INK}"/>`;
const PAD = { x0: -300, y0: -420, w: 1400, h: 1940 }, SC = +(process.env.SCALE || 1.0);
const frame = (svg, extra = '') => svg.replace(/<svg [^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(PAD.w * SC)}" height="${Math.round(PAD.h * SC)}" viewBox="${PAD.x0} ${PAD.y0} ${PAD.w} ${PAD.h}">`).replace(/<\/svg>\s*$/, extra + '</svg>');
const toPx = q => [+((q[0] - PAD.x0) * SC).toFixed(1), +((q[1] - PAD.y0) * SC).toFixed(1)];
const { chromium } = require('/opt/node-tools/node_modules/playwright'); const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: Math.round(PAD.w * SC), height: Math.round(PAD.h * SC) } });
const meta = { scale: SC, pad: PAD, card_rig: P.CARD };
for (const [id, j] of Object.entries(J)) {
  const ph = P.poseHands(E(j.who), j.st), m = P.metrics(E(j.who));
  const extra = j.rag ? rag(ph.hands[j.rag]) + fist(ph.hands[j.rag], ph.handR) : '';
  await page.setContent(`<html><body style="margin:0;background:transparent">${frame(P.svgFor(E(j.who), j.st), extra)}</body></html>`);
  await page.screenshot({ path: path.join(HERE, 'raw_' + id + '.png'), omitBackground: true });
  meta[id] = { who: j.who, view: j.st.view, dir: j.st.dir, face: j.st.face, pose: j.st.pose, height_m: E(j.who).height, rig_px_tall: m.px,
    ground_px: toPx([P.CARD.CX, P.CARD.GY]), hands: { R: toPx(ph.hands.R), L: toPx(ph.hands.L) }, far: ph.far, fist_r_px: +(ph.handR * SC).toFixed(1),
    sh: { R: toPx(ph.sh.R), L: toPx(ph.sh.L) } };
  console.log('CARD', id, JSON.stringify(meta[id]));
}
await b.close();
fs.writeFileSync(path.join(HERE, 'raw_meta.json'), JSON.stringify(meta, null, 1));

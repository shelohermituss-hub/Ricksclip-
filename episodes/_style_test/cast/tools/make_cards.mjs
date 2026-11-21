// character-artist, STYLE TEST (2026-11-21): ONE command = the two posed cast cards (PNG, alpha) + cards.json + CAST_SHEET.jpg inputs.
//   node episodes/_style_test/cast/tools/make_cards.mjs            (from the skill root; env GF / KF = face override, SCALE = render scale)
// Cards are drawn through the film kit's own puppet adapter (templates/threejs_film/puppets.mjs svgFor + poses.mjs applyPose, unedited) from the sheet
// cast/sheets/styletest.mjs (locked package parts only). Two poses are added to the kit's POSES table AT RUN TIME (the kit file is untouched):
//   jump_surprise (grandpa) and hose_aim (kid). Hands go where state.hat puts them (kit HELD-3D hook), at fixed arm length.
// Writes cast/out/<who>_raw.png (+ _noprop) at SCALE; cast/tools/finish_cards.py shades, crops and writes the cards, cards.json and the sheet.
import fs from 'fs'; import path from 'path'; import os from 'os'; import { fileURLToPath, pathToFileURL } from 'url'; import { createRequire } from 'module';
const HERE = path.dirname(fileURLToPath(import.meta.url)), CAST = path.resolve(HERE, '..'), ROOT = path.resolve(CAST, '../../..'), require = createRequire(import.meta.url);
const PKG = path.join(ROOT, 'templates/vector2d_characters/code'), KIT = path.join(ROOT, 'templates/threejs_film'), OUT = path.join(CAST, 'out');
fs.mkdirSync(OUT, { recursive: true });
const imp = f => import(pathToFileURL(f).href);
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'styletest_')); fs.mkdirSync(path.join(TMP, 'sheets'));
for (const f of fs.readdirSync(PKG)) if (f.endsWith('.mjs')) fs.copyFileSync(path.join(PKG, f), path.join(TMP, f));
for (const f of ['puppets.mjs', 'poses.mjs']) fs.copyFileSync(path.join(KIT, f), path.join(TMP, f));
fs.copyFileSync(path.join(CAST, 'sheets/styletest.mjs'), path.join(TMP, 'sheets/styletest.mjs'));
const [char2d, memes, memes2, memes3, bodies, cast, castkit, grips] = await Promise.all(['char2d', 'memes', 'memes2', 'memes3', 'bodies', 'cast', 'castkit', 'grips'].map(n => imp(path.join(TMP, n + '.mjs'))));
const P = await imp(path.join(TMP, 'puppets.mjs')), PO = await imp(path.join(TMP, 'poses.mjs')), sheet = await imp(path.join(TMP, 'sheets/styletest.mjs')), castIndex = {};
for (const c of sheet.CAST) { castIndex[c.name] = c; castIndex['styletest/' + c.name] = c; }
P.initPuppets({ char2d, memes, memes2, memes3, bodies, cast, castkit, castIndex, grips, motion: { LIB: [], mods: {}, cloth: null }, epFaces: {}, faceShadow: true });
const INK = char2d.INK, f1 = v => (+v).toFixed(1);

// ---- the two poses (run-time additions to the kit table) ----
// jump_surprise: whole body popped up off the ground (dy), near knee pulled up high, far leg hanging bent, both fists flung up and out, head back
PO.POSES.jump_surprise = { both: [0.86, -1.02], elbow: [0.86, -0.02], bow: 1, over: 1, dy: -150, legs: [[-34, 130, -70], [22, 40, 34]], head: -9 };
// hose_aim: both fists in front of the chest on one nozzle (positions from state.hat), a small lean forward, the near foot a step ahead, head down a little to aim
PO.POSES.hose_aim = { both: [0.5, 0.2], bow: 0.6, rot: 3, head: 5 };   // legs stay planted straight (the knee plaster sits on the drawn knee)

const HEIGHT = { grandpa: 1.75, kid: 1.25 };
const GF = process.env.GF || 'k:shocked', KF = process.env.KF || 'k:evil', SC = +(process.env.SCALE || 1.0);
const E = who => ({ puppet: 'cast:styletest/' + who });
const rest = (who, view, dir) => P.poseHands(E(who), { view, dir, pose: 'stand' });

// ---- GRANDPA: 3/4 facing screen LEFT (dir -1), mid-jump. Hands from the shoulders: the sponge fist (his RIGHT hand = screen left from the front,
// the forward hand facing left) flung up-forward, the other fist up-back. ----
const gR = rest('grandpa', '34', -1);
const JUMP = 150;   // rig px the body pops up (pose dy); state.hat points are final card px, so the posed shoulder = rest shoulder - JUMP
const gHat = { R: [gR.sh.R[0] - 215, gR.sh.R[1] - JUMP - 175], L: [gR.sh.L[0] + 200, gR.sh.L[1] - JUMP - 195] };
const gSt = { view: '34', dir: -1, pose: 'jump_surprise', face: GF, hat: gHat };
// ---- KID: 3/4 facing screen RIGHT (dir 1). Pistol nozzle: back fist (his RIGHT hand, screen left) on the grip at the chest, lead fist (LEFT, screen right)
// forward and up on the barrel; the nozzle points right and up (AIM_DEG above horizontal). ----
const kR = rest('kid', '34', 1), AIM = 28, a = AIM * Math.PI / 180;
const kBack = [kR.sh.L[0] + 105, kR.sh.L[1] + 25], kLead = [kBack[0] + 92 * Math.cos(a), kBack[1] - 92 * Math.sin(a)];
const kSt = { view: '34', dir: 1, pose: 'hose_aim', face: KF, hat: { R: kBack, L: kLead } };

const gH = P.poseHands(E('grandpa'), gSt), kH = P.poseHands(E('kid'), kSt);
// ---- props (SVG, card px): sponge in grandpa's R fist (drawn UNDER the fist: the fist closes on it), suds + flying drips; kid's nozzle (2D stand-in, preview only) ----
const sponge = (h, r) => { const [x, y] = h, w = 92, hh = 58;
  return `<g transform="rotate(-18 ${f1(x)} ${f1(y)})"><rect x="${f1(x - w / 2)}" y="${f1(y - hh * .78)}" width="${w}" height="${hh}" rx="18" fill="#f4c83c" stroke="${INK}" stroke-width="6"/>` +
    `<rect x="${f1(x - w / 2 + 6)}" y="${f1(y - hh * .78 + 6)}" width="${w - 12}" height="14" rx="7" fill="#ffe27a" opacity=".85"/>` +
    [[-30, -30, 4], [-14, -14, 3.2], [8, -34, 3.6], [24, -16, 3], [34, -32, 2.6], [-24, -2, 2.8], [16, 2, 3]].map(([dx, dy, rr]) => `<circle cx="${f1(x + dx)}" cy="${f1(y + dy)}" r="${rr}" fill="#c99a12"/>`).join('') +
    `<path d="M${f1(x - w / 2 + 4)},${f1(y - hh * .78 + 2)} q12,-22 30,-8 q10,-20 28,-4 q14,-16 26,4" fill="#ffffff" stroke="${INK}" stroke-width="3.6"/></g>` +   // soap suds on the sponge top
    [[-70, 30, 8], [-40, 70, 6], [40, 50, 7], [-96, 64, 5], [10, 96, 5.5]].map(([dx, dy, rr]) => `<path d="M${f1(x + dx)},${f1(y + dy - rr * 1.8)} Q${f1(x + dx + rr)},${f1(y + dy)} ${f1(x + dx)},${f1(y + dy + rr)} Q${f1(x + dx - rr)},${f1(y + dy)} ${f1(x + dx)},${f1(y + dy - rr * 1.8)} Z" fill="#cfeef6" stroke="${INK}" stroke-width="2.6"/>`).join('') +   // drips flung off the sponge
    [[60, -60, 10], [80, -30, 7], [-80, -70, 8]].map(([dx, dy, rr]) => `<circle cx="${f1(x + dx)}" cy="${f1(y + dy)}" r="${rr}" fill="#ffffff" fill-opacity=".85" stroke="${INK}" stroke-width="2.4"/><circle cx="${f1(x + dx - rr * .35)}" cy="${f1(y + dy - rr * .35)}" r="${f1(rr * .3)}" fill="#ffffff"/>`).join('');   // soap bubbles
};
const nozzle2d = (back, lead) => { const ang = Math.atan2(lead[1] - back[1], lead[0] - back[0]) * 180 / Math.PI, [x, y] = back;
  return `<g transform="translate(${f1(x)},${f1(y)}) rotate(${f1(ang)})"><path d="M-30,6 L-10,-14 L120,-14 L120,14 L-10,14 Z" fill="#c9a24a" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="120" y="-18" width="30" height="36" rx="6" fill="#b08a34" stroke="${INK}" stroke-width="6"/><rect x="-10" y="-10" width="120" height="7" rx="3" fill="#f3dc8e"/>` +
    `<path d="M-10,14 L-22,74 L4,74 L18,14 Z" fill="#3e8a3a" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-42,10 Q-80,20 -96,70" fill="none" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M-42,10 Q-80,20 -96,70" fill="none" stroke="#3f9a3a" stroke-width="16" stroke-linecap="round"/></g>`;
};
const PAD = { x0: -260, y0: -380, w: 1320, h: 1900 };
const frame = (svg, extra = '') => svg.replace(/<svg [^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(PAD.w * SC)}" height="${Math.round(PAD.h * SC)}" viewBox="${PAD.x0} ${PAD.y0} ${PAD.w} ${PAD.h}">`).replace(/<\/svg>\s*$/, extra + '</svg>');
const sv = { grandpa: P.svgFor(E('grandpa'), gSt), kid: P.svgFor(E('kid'), kSt), grandpaHat: P.svgFor(E('grandpaHat'), { view: '34', dir: -1, pose: 'stand', face: 'standard' }), kidRest: P.svgFor(E('kid'), { view: '34', dir: 1, pose: 'stand', face: 'standard' }) };
// the props sit UNDER the fists: drawn behind the whole card would hide them behind the body, so the fist is redrawn on top (same radius, same ink)
const fist = (h, r) => `<circle cx="${f1(h[0])}" cy="${f1(h[1])}" r="${f1(r)}" fill="${INK}"/><path d="M${f1(h[0] - r * .5)},${f1(h[1] - r * .35)} q${f1(r * .5)},${f1(r * .2)} ${f1(r)},0" stroke="#4a3a40" stroke-width="2.4" fill="none"/>`;
const jobs = [
  ['grandpa', frame(sv.grandpa, sponge(gH.hands.R) + fist(gH.hands.R, gH.handR))], ['grandpa_noprop', frame(sv.grandpa)],
  ['kid', frame(sv.kid)], ['kid_noprop', frame(sv.kid)], ['kid_nozzle2d', frame(sv.kid, nozzle2d(kH.hands.R, kH.hands.L) + fist(kH.hands.R, kH.handR) + fist(kH.hands.L, kH.handR))],
  ['grandpa_rest', frame(sv.grandpaHat)], ['kid_rest', frame(sv.kidRest)],
];
// black-fill test + the four views of each at rest (preset check)
for (const v of ['front', '34', 'side', 'back']) for (const w of ['grandpaHat', 'kid']) jobs.push([`view_${w}_${v}`, frame(P.svgFor(E(w), { view: v, dir: 1, pose: 'stand', face: 'standard' }))]);
const { chromium } = require('/opt/node-tools/node_modules/playwright'); const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: Math.round(PAD.w * SC), height: Math.round(PAD.h * SC) } });
for (const [id, svg] of jobs) { await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`); await page.screenshot({ path: path.join(OUT, id + '.png'), omitBackground: true }); }
await b.close();
const toPx = q => [+((q[0] - PAD.x0) * SC).toFixed(1), +((q[1] - PAD.y0) * SC).toFixed(1)];
const mG = P.metrics(E('grandpa')), mK = P.metrics(E('kid'));
const meta = { scale: SC, pad: PAD, card_rig: P.CARD, faces: { grandpa: GF, kid: KF }, aim_deg: AIM,
  grandpa: { dir: -1, view: '34', height_m: HEIGHT.grandpa, rig_px_tall: mG.px, ground_px: toPx([P.CARD.CX, P.CARD.GY]), hands: { R: toPx(gH.hands.R), L: toPx(gH.hands.L) }, far: gH.far, jump_rig_px: 150 },
  kid: { dir: 1, view: '34', height_m: HEIGHT.kid, rig_px_tall: mK.px, ground_px: toPx([P.CARD.CX, P.CARD.GY]), hands: { R: toPx(kH.hands.R), L: toPx(kH.hands.L) }, far: kH.far } };
fs.writeFileSync(path.join(OUT, 'raw_meta.json'), JSON.stringify(meta, null, 1));
console.log(JSON.stringify(meta));

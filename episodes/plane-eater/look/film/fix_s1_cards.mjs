// fix_s1_cards.mjs (look-finisher): Michel's drawings for S1 f0-72 with the salting fist over the wing tip (hats.json from film_lock.py hats),
// same rig canvas as the lock cards (800x1500 rig px at 2x = 1600x3000, ground 2880, centre 800), so they swap 1:1 on the lock card mesh.
//   node episodes/plane-eater/look/film/fix_s1_cards.mjs   -> fix_s1/m_####.png (scene frame f -> m_(f+1)) + hands_drawn.json
import fs from 'fs'; import path from 'path'; import os from 'os'; import { fileURLToPath, pathToFileURL } from 'url'; import { createRequire } from 'module';
const HERE = path.dirname(fileURLToPath(import.meta.url)), EP = path.resolve(HERE, '../..'), ROOT = path.resolve(EP, '../..'), require = createRequire(import.meta.url);
const PKG = path.join(ROOT, 'templates/vector2d_characters/code'), KIT = path.join(ROOT, 'templates/threejs_film'), CAST = path.join(EP, 'cast'), OUT = path.join(HERE, 'fix_s1');
const imp = f => import(pathToFileURL(f).href); const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'pe_fix_')); fs.mkdirSync(path.join(TMP, 'sheets'));
for (const f of fs.readdirSync(PKG)) if (f.endsWith('.mjs')) fs.copyFileSync(path.join(PKG, f), path.join(TMP, f));
for (const f of ['puppets.mjs', 'poses.mjs']) fs.copyFileSync(path.join(KIT, f), path.join(TMP, f));
fs.copyFileSync(path.join(CAST, 'sheets/plane_eater.mjs'), path.join(TMP, 'sheets/plane_eater.mjs'));
const [char2d, memes, memes2, memes3, bodies, cast, castkit, grips] = await Promise.all(['char2d', 'memes', 'memes2', 'memes3', 'bodies', 'cast', 'castkit', 'grips'].map(n => imp(path.join(TMP, n + '.mjs'))));
const P = await imp(path.join(TMP, 'puppets.mjs')), PO = await imp(path.join(TMP, 'poses.mjs')), sheet = await imp(path.join(TMP, 'sheets/plane_eater.mjs')), castIndex = {};
for (const c of sheet.CAST) { castIndex[c.name] = c; castIndex['plane_eater/' + c.name] = c; }
const KEYS = JSON.parse(fs.readFileSync(path.join(CAST, 'CAST_KEYS.json'), 'utf8'));
P.initPuppets({ char2d, memes, memes2, memes3, bodies, cast, castkit, castIndex, grips, motion: { LIB: [], mods: {}, cloth: null }, epFaces: KEYS.faces_ep, faceShadow: KEYS.face_shadow });
PO.POSES.pe_hat = { both: [0.5, -0.4], over: 1 };
const H = JSON.parse(fs.readFileSync(path.join(OUT, 'hats.json'), 'utf8')), E = KEYS.cast.michel;
const FACES = [[0, 'k:glanceCam'], [40, 'k:proud'], [54, 'k:smug'], [62, 'k:aim']], face = f => FACES.filter(x => x[0] <= f).pop()[1];
const { chromium } = require('/opt/node-tools/node_modules/playwright'); const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1600, height: 3000 } });
const drawn = {};
for (const [fs_, h] of Object.entries(H)) {
  const f = +fs_, st = { view: f < 66 ? 'front' : '34', dir: 1, pose: 'pe_hat', face: face(f), hat: { R: h.R, L: h.L } };
  const svg = P.svgFor(E, st).replace(/<svg [^>]*>/, '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="3000" viewBox="0 0 800 1500">');
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
  await page.screenshot({ path: path.join(OUT, `m_${String(f + 1).padStart(4, '0')}.png`), omitBackground: true });
  const ph = P.poseHands(E, st); drawn[f] = { R: [ph.hands.R[0] * 2, ph.hands.R[1] * 2], L: [ph.hands.L[0] * 2, ph.hands.L[1] * 2] };
}
await b.close(); fs.writeFileSync(path.join(OUT, 'hands_drawn.json'), JSON.stringify(drawn)); console.log('FIX_CARDS', Object.keys(drawn).length, drawn[0], drawn[72]);

// export_puppet.mjs (Unity test, 2026-11-22): the astro-flush cast's "newguy" as Unity puppet parts.
//   node unity_test/tools/export_puppet.mjs [who]   -> unity_test/character/<who>/
// torso_<view>_<face>.png = head + body + costume, NO legs, NO arms (the kit draws limbs as ink lines; Unity draws them as lines on the Mixamo joints)
// full_<view>.png = the same card with the kit's standing limbs (reference for scale and line look). rig.json = joints in card pixels.
// Card canvas 800 x 1500 px, CX 400, ground line GY 1440 (feet). Uses the kit's own adapter (puppets.mjs svgFor) so it is the film's drawing.
import fs from 'fs'; import path from 'path'; import os from 'os'; import { fileURLToPath, pathToFileURL } from 'url'; import { createRequire } from 'module';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'), CAST = ROOT + '/episodes/astro-flush-study/cast';
const PKG = ROOT + '/templates/vector2d_characters/code', KIT = ROOT + '/templates/threejs_film', WHO = process.argv[2] || 'newguy', OUT = ROOT + '/unity_test/character/' + WHO;
fs.mkdirSync(OUT, { recursive: true }); const imp = f => import(pathToFileURL(f).href), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'uexp_')); fs.mkdirSync(TMP + '/sheets');
for (const f of fs.readdirSync(PKG)) if (f.endsWith('.mjs')) fs.copyFileSync(PKG + '/' + f, TMP + '/' + f);
for (const f of ['puppets.mjs', 'poses.mjs']) fs.copyFileSync(KIT + '/' + f, TMP + '/' + f);
fs.appendFileSync(TMP + '/puppets.mjs', '\nexport { chOf as __chOf };\n');
fs.copyFileSync(CAST + '/sheets/astro_flush.mjs', TMP + '/sheets/astro_flush.mjs');
const mods = Object.fromEntries(await Promise.all(['char2d', 'memes', 'memes2', 'memes3', 'bodies', 'cast', 'castkit', 'grips'].map(async n => [n, await imp(TMP + '/' + n + '.mjs')])));
const P = await imp(TMP + '/puppets.mjs'), sheet = await imp(TMP + '/sheets/astro_flush.mjs'), castIndex = {};
for (const c of sheet.CAST) { castIndex[c.name] = c; castIndex['astro_flush/' + c.name] = c; }
const KEYS = JSON.parse(fs.readFileSync(CAST + '/CAST_KEYS.json', 'utf8')), E = KEYS.cast[WHO];
let LIMBS = true; const real = mods.char2d.drawCharacter;
const c2 = { ...mods.char2d, drawCharacter: S => { if (!LIMBS) { S.noLegs = true; S.arms = null; } return real(S); } };
P.initPuppets({ ...mods, char2d: c2, castIndex, motion: { LIB: [], mods: {}, cloth: null }, epFaces: KEYS.faces_ep, faceShadow: KEYS.face_shadow });
const VIEWS = ['front', '34', 'side'], FACES = ['standard', 'k:smug', 'k:nervousSmile', 'k:nervous', 'k:happy', 'k:surprised'];
const jobs = [];
const svg = (view, face, limbs) => { LIMBS = limbs; return P.svgFor(E, { view, dir: 1, pose: 'stand', face, prop: null, hand: null, mouth: null, blink: null }); };
for (const v of VIEWS) { jobs.push(['full_' + v, svg(v, 'standard', true)]); for (const f of FACES) jobs.push([`torso_${v}_${f.replace('k:', '')}`, svg(v, f, false)]); }
const ch = P.__chOf(E), m = P.metrics(E);
// PNGs through the pre-installed Chromium (transparent background, 800 x 1500)
const require = createRequire(KIT + '/package.json'); const { chromium } = require('playwright'); const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 800, height: 1500 } });
for (const [n, s] of jobs) { await pg.setContent(`<html><body style="margin:0;background:transparent">${s.replace(/^<\?xml[^>]*>/, '')}</body></html>`); const el = await pg.$('svg');
  await el.evaluate(e => { e.setAttribute('width', 800); e.setAttribute('height', 1500); e.style.display = 'block'; }); await el.screenshot({ path: OUT + '/' + n + '.png', omitBackground: true }); }
await br.close(); fs.rmSync(TMP, { recursive: true, force: true });
const rig = { who: WHO, card_px: [800, 1500], CX: 400, ground_y_px: 1440, height_m: E.height ?? 1.7, metres_per_px: +((E.height ?? 1.7) / m.px).toFixed(6), char_height_px: +m.px.toFixed(1),
  head_px: m.headPx, ink: '#2a1a1f', limb_line_px: 19, hand_radius_px: 26,
  joints_card_px_note: 'card pixels, x from the card centre line (CX 400), y down from the top; front view, dir 1 (facing screen right in side views)',
  chOf: ch, faces: FACES, views: VIEWS };
fs.writeFileSync(OUT + '/rig.json', JSON.stringify(rig, null, 1)); console.log('wrote', jobs.length, 'PNG +', 'rig.json ->', OUT); console.log(JSON.stringify(ch));

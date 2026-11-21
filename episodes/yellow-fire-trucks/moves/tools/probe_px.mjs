// probe: metres per card px (k = height / metrics.px) and the rig numbers (chOf) for this film's walkers
import fs from 'fs'; import path from 'path'; import os from 'os'; import { pathToFileURL } from 'url';
const ROOT = '/home/user/Ricksclip-', PKG = ROOT + '/templates/vector2d_characters/code', KIT = ROOT + '/templates/threejs_film', EPC = ROOT + '/episodes/yellow-fire-trucks/cast';
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'px_')); fs.mkdirSync(path.join(TMP, 'sheets'));
for (const f of fs.readdirSync(PKG)) if (f.endsWith('.mjs')) fs.copyFileSync(path.join(PKG, f), path.join(TMP, f));
for (const f of fs.readdirSync(PKG + '/sheets')) if (f.endsWith('.mjs')) fs.copyFileSync(path.join(PKG, 'sheets', f), path.join(TMP, 'sheets', f));
fs.copyFileSync(EPC + '/sheets/firetrucks.mjs', path.join(TMP, 'sheets', 'firetrucks.mjs'));
for (const f of ['puppets.mjs', 'poses.mjs']) fs.copyFileSync(path.join(KIT, f), path.join(TMP, f));
const imp = f => import(pathToFileURL(f).href);
const [char2d, memes, memes2, memes3, bodies, cast, castkit] = await Promise.all(['char2d', 'memes', 'memes2', 'memes3', 'bodies', 'cast', 'castkit'].map(n => imp(path.join(TMP, n + '.mjs'))));
const P = await imp(path.join(TMP, 'puppets.mjs')); const castIndex = {};
for (const f of fs.readdirSync(path.join(TMP, 'sheets')).sort()) { const m = await imp(path.join(TMP, 'sheets', f)); for (const c of m.CAST || []) { castIndex[c.name] ??= c; castIndex[f.replace(".mjs", "") + "/" + c.name] = c; } }
P.initPuppets({ char2d, memes, memes2, memes3, bodies, cast, castkit, castIndex });
const K = JSON.parse(fs.readFileSync(EPC + '/CAST_KEYS.json', 'utf8')).cast;
for (const who of ['hero', 'chief', 'chiefVisitor', 'kid', 'clerk']) { const e = K[who], m = P.metrics(e); console.log(who, 'px', m.px.toFixed(1), 'k m/px', (e.height / m.px).toFixed(6), 'px per m', (m.px / e.height).toFixed(2)); }
const ck = await imp(path.join(TMP, 'castkit.mjs')), sh = await imp(path.join(TMP, 'sheets', 'firetrucks.mjs'));
for (const name of ['hero', 'chief', 'chiefVisitor', 'kid', 'clerk']) { const S = ck.buildChar({ ...sh.CAST.find(c => c.name === name), face: 'standard' }, 400), bodyBot = S.bodyBot ?? 640, hipY = bodyBot - 30, g = S.ground ?? 900;
  console.log(name, 'ground', g, 'hipY', hipY, 'legL', Math.hypot(23, (g - 7) - hipY).toFixed(1), 'bodyTop', S.bodyTop, 'hipW', S.hipW); }

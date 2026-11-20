// character-artist (lightning-spear, 2026-11-15): LONG CLOTH legs test. CB: "legs need to be under the long cloth".
// Before = templates/threejs_film/puppets.mjs.bak_longcloth_20261115, after = puppets.mjs. Priest, market woman, girl, egg woman;
// stand, walk/A x3 phases, run/A, kneel/A, sit/A; front, 3/4, side. Optional: --f110 <before.png> <after.png> adds the S1 mother crop.
//   node cast/tools/render_longcloth.mjs [--f110 before after]  -> cast/out/long_cloth_before_after.jpg (1600 wide) + numbers on stdout
import fs from 'fs'; import path from 'path'; import os from 'os'; import { fileURLToPath, pathToFileURL } from 'url'; import { createRequire } from 'module';
const HERE = path.dirname(fileURLToPath(import.meta.url)), CAST = path.resolve(HERE, '..'), ROOT = path.resolve(CAST, '../../..'), require = createRequire(import.meta.url);
const PKG = path.join(ROOT, 'templates/vector2d_characters/code'), KIT = path.join(ROOT, 'templates/threejs_film'), MOT = path.join(ROOT, 'templates/motion_styles'), OUT = path.join(CAST, 'out');
const imp = f => import(pathToFileURL(f).href);
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'lcloth_')); fs.mkdirSync(path.join(TMP, 'sheets'));
for (const f of fs.readdirSync(PKG)) if (f.endsWith('.mjs')) fs.copyFileSync(path.join(PKG, f), path.join(TMP, f));
fs.copyFileSync(path.join(KIT, 'poses.mjs'), path.join(TMP, 'poses.mjs'));
fs.copyFileSync(path.join(KIT, 'puppets.mjs'), path.join(TMP, 'puppets_new.mjs'));
fs.copyFileSync(path.join(KIT, 'puppets.mjs.bak_longcloth_20261115'), path.join(TMP, 'puppets_old.mjs'));
fs.copyFileSync(path.join(CAST, 'sheets/spear.mjs'), path.join(TMP, 'sheets/spear.mjs'));
const [char2d, memes, memes2, memes3, bodies, cast, castkit, grips] = await Promise.all(['char2d', 'memes', 'memes2', 'memes3', 'bodies', 'cast', 'castkit', 'grips'].map(n => imp(path.join(TMP, n + '.mjs'))));
const sheet = await imp(path.join(TMP, 'sheets/spear.mjs')), castIndex = {};
for (const c of sheet.CAST) { castIndex[c.name] = c; castIndex['spear/' + c.name] = c; }
const lib = await imp(path.join(MOT, 'library.mjs')), cloth = await imp(path.join(MOT, 'cloth_live.mjs')), mods = {};
for (const mn of ['walk', 'walk_front', 'run', 'run_front', 'kneel', 'sit', 'sit_front']) if (fs.existsSync(path.join(MOT, 'moves', mn + '.mjs'))) mods[mn] = await imp(path.join(MOT, 'moves', mn + '.mjs'));
const motion = { LIB: lib.LIB, mods, cloth };
const OLD = await imp(path.join(TMP, 'puppets_old.mjs')), NEW = await imp(path.join(TMP, 'puppets_new.mjs'));
for (const P of [OLD, NEW]) P.initPuppets({ char2d, memes, memes2, memes3, bodies, cast, castkit, castIndex, motion, grips });
const KEYS = JSON.parse(fs.readFileSync(path.join(CAST, 'CAST_KEYS.json'), 'utf8'));
const WHO = ['priest', 'marketwoman', 'girl', 'eggwoman'], VIEWS = ['front', '34', 'side'];
const POSES = [['stand', 'stand'], ['walk 1', 'm:walk/A@=0.25'], ['walk 2', 'm:walk/A@=0.5'], ['walk 3', 'm:walk/A@=0.75'], ['run', 'm:run/A@=0.4'], ['kneel', 'm:kneel/A@=2.2'], ['sit', 'm:sit/A@=2.5']];
const b64 = s => 'data:image/svg+xml;base64,' + Buffer.from(s).toString('base64');
const rows = [];
for (const who of WHO) for (const v of VIEWS) { const E = KEYS.cast[who], cells = [];
  for (const [lab, pose] of POSES) for (const [tag, P] of [['before', OLD], ['after', NEW]]) {
    let s = ''; try { s = P.svgFor(E, { view: v, dir: 1, pose, face: 'standard', prop: null, hand: null, mouth: null, blink: null }); } catch (e) { console.log('ERR', who, v, lab, tag, e.message); }
    cells.push({ raw: s.replace(/\d+/g, '#'), lab: `${lab} ${tag === 'before' ? 'B' : 'A'}`, tag, svg: s ? b64(s) : null, same: false }); }
  for (let i = 0; i < cells.length; i += 2) cells[i + 1].same = cells[i].raw === cells[i + 1].raw;
  rows.push({ label: `${who} · ${v}`, cells }); }
const changed = rows.flatMap(r => r.cells.filter(c => c.tag === 'after' && !c.same).map(c => r.label + ' ' + c.lab)); rows.forEach(r => r.cells.forEach(c => delete c.raw));
const fA = process.argv.indexOf('--f110'), f110 = fA > 0 ? [process.argv[fA + 1], process.argv[fA + 2]].map(f => fs.existsSync(f) ? 'data:image/png;base64,' + fs.readFileSync(f).toString('base64') : null) : null;
const crop = (process.argv.find(a => a.startsWith('--crop=')) || '--crop=0,700,1080,1220').slice(7).split(',').map(Number);
const html = `<html><body style="margin:0"><canvas id="c"></canvas><script>
const ROWS = ${JSON.stringify(rows)}, F110 = ${JSON.stringify(f110)}, CROP = ${JSON.stringify(crop)};
const load = src => new Promise(ok => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = src; });
window.run = async () => { const SW = 1600, LW = 120, n = ROWS[0].cells.length, cw = (SW - LW) / n, ch = 190, LAB = 22, top = 30;
  const fh = F110 ? Math.round((SW / 2) * CROP[3] / CROP[2]) + 30 : 0, c = document.getElementById('c'); c.width = SW; c.height = top + ROWS.length * (ch + 4) + fh + 10;
  const g = c.getContext('2d'); g.fillStyle = '#efe8da'; g.fillRect(0, 0, SW, c.height); g.fillStyle = '#222'; g.font = '700 15px Arial';
  g.fillText('LONG CLOTH: legs under the cloth. B = before (kit backup), A = after (fix). Grey cell = picture changed.', 8, 20);
  let y = top; for (const r of ROWS) { g.fillStyle = '#222'; g.font = '700 13px Arial'; g.fillText(r.label, 6, y + ch / 2);
    for (let i = 0; i < n; i++) { const cl = r.cells[i], x = LW + i * cw; g.fillStyle = cl.tag === 'before' ? '#f7f2e6' : cl.same ? '#f7f2e6' : '#d9d4ea'; g.fillRect(x + 1, y, cw - 2, ch);
      if (cl.svg) { const im = await load(cl.svg); if (im) { const sx = 120, sy = 300, sw = 560, sh = 1180, k = Math.min((cw - 4) / sw, (ch - LAB) / sh); g.drawImage(im, sx, sy, sw, sh, x + (cw - sw * k) / 2, y + LAB, sw * k, sh * k); } }
      g.fillStyle = '#333'; g.font = '11px Arial'; g.fillText(cl.lab, x + 3, y + 13); }
    y += ch + 4; }
  if (F110) { g.fillStyle = '#222'; g.font = '700 14px Arial'; g.fillText('S1 film frame 110 (take B, street), mother in the gold dress: before (left) | after (right)', 8, y + 18); y += 26;
    for (let i = 0; i < 2; i++) { if (!F110[i]) continue; const im = await load(F110[i]); if (im) g.drawImage(im, CROP[0], CROP[1], CROP[2], CROP[3], i * SW / 2, y, SW / 2 - 4, (SW / 2 - 4) * CROP[3] / CROP[2]); } }
  return c.toDataURL('image/jpeg', .9); };
</script></body></html>`;
let chromium; try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = require(path.join(KIT, 'node_modules/playwright'))); }
const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: 1600, height: 900 } }); pg.on('pageerror', e => console.log('PAGE ERROR', e.message));
await pg.setContent(html); const url = await pg.evaluate(() => window.run()); await br.close(); fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true }); const outF = path.join(OUT, 'long_cloth_before_after.jpg'); fs.writeFileSync(outF, Buffer.from(url.split(',')[1], 'base64'));
console.log('cells changed', changed.length, 'of', rows.length * POSES.length); console.log(changed.join('\n')); console.log('ok', outF);

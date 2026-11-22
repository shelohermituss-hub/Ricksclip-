#!/usr/bin/env node
// check_collide.mjs: does anything pass through anything on the MOVING film? (user rule 2026-11-22 "nothing collides")
//   node tools/collide/check_collide.mjs <film.json> [--window a-b] [--step 2] [--puppets dir,dir] [--out dir] [--box-fail]
//   BODY_IN_OBJECT  FAIL  a character's body volume is over 5 cm into a set mesh's box AND 10 % or more of the drawn body is inside the mesh (3-10 % = WARN)
//   BODY_IN_BOX     WARN  boxes overlap over 5 cm but no body point is inside the mesh (open / hollow part); --box-fail makes it a FAIL
//   BODY_IN_BODY    FAIL  two characters within 30 cm in depth whose body boxes overlap 25 % of the smaller one on screen
//   PROP_IN_BODY    FAIL  the centre of a held 3D prop's box is inside another character's body volume
//   FLOATING / SUNK FAIL  film.json "collide": {"resting": {"prop": "support"}}: the prop's bottom is over 2 cm above / below the support's top
// film.json may carry "collide": {"ignore": ["name*"], "floor": ["name*"], "resting": {"prop name": "support name"}}.
// Writes out/collide.json beside the film. Exit 1 on any FAIL, 2 when it could not run.
import fs from 'fs'; import path from 'path'; import os from 'os'; import { fileURLToPath } from 'url'; import { spawnSync } from 'child_process';
const HERE = path.dirname(fileURLToPath(import.meta.url)), KIT = path.resolve(HERE, '..', '..', 'templates', 'threejs_film');
const A = process.argv.slice(2), has = k => A.includes(k), val = (k, d) => { const i = A.indexOf(k); return i >= 0 && A[i + 1] !== undefined ? A[i + 1] : d; };
if (!A[0] || A[0].startsWith('--')) { console.log('usage: node tools/collide/check_collide.mjs <film.json> [--window a-b] [--step 2] [--puppets dir,dir] [--out dir] [--box-fail]'); process.exit(2); }
const T0 = Date.now(), FILM = path.resolve(A[0]), EP = path.dirname(FILM), film = JSON.parse(fs.readFileSync(FILM, 'utf8')), OUT = path.resolve(val('--out', path.join(EP, 'out')));
if (!fs.existsSync(path.join(EP, 'out', 'plan', 'camera_baked.json'))) { console.error('No out/plan/camera_baked.json beside the film. Run: python tools/film_plan.py check ' + A[0]); process.exit(2); }
const win = /^(\d+)-(\d+)$/.exec(val('--window', '')), STEP = Math.max(1, Math.round(+val('--step', 2))), co = film.collide || {};
const cfg = { f0: win ? +win[1] : 0, f1: win ? +win[2] : 1e9, step: STEP, ignore: co.ignore || [], floor: co.floor || [], resting: co.resting || {},
  depth: +val('--depth', 0.16), lowSkip: 0.06, pen: +val('--pen', 0.05), inFail: +val('--in-fail', 0.10), inWarn: 0.03, boxFail: has('--box-fail'), pairDepth: +val('--pair-depth', 0.30), pairOverlap: +val('--pair-overlap', 0.25), restTol: +val('--rest-tol', 0.02),
  skipName: val('--skip', 'sky|dome|cone|beam|haze|fog|dust|glow|halo|smoke|spark|cloud|backdrop|mote|rain|snow'), seatName: val('--seat', 'seat|stool|bench|saddle|sofa|couch') };
const LOCKED = path.join(KIT, '..', 'vector2d_characters', 'code');
let pup = val('--puppets'); if (!pup && film.puppet_pkg) pup = [].concat(film.puppet_pkg).map(p => path.resolve(EP, p)).map(p => fs.existsSync(p) ? p : /vector2d_characters/.test(p) ? LOCKED : p).join(',');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'collide_')), evalFile = path.join(TMP, 'eval.js');
fs.writeFileSync(evalFile, 'window.__CO = ' + JSON.stringify(cfg) + ';\n' + fs.readFileSync(path.join(HERE, 'page_collide.js'), 'utf8'));
const run = spawnSync(process.execPath, ['render_gpu.mjs', FILM, '--frames', String(cfg.f0), '--scale', '0.1', '--seed', '7', '--no-captions', '--stills-dir', path.join(TMP, 'still'), '--eval', evalFile, ...(pup ? ['--puppets', pup] : [])], { cwd: KIT, encoding: 'utf8', maxBuffer: 1 << 30 });
const line = (run.stdout || '').split(/\r?\n/).find(l => l.startsWith('eval {')); fs.rmSync(TMP, { recursive: true, force: true });
if (!line) { console.error('collide: the film page gave no result.\n' + (run.stdout || '').split(/\r?\n/).filter(l => !l.startsWith('eval')).slice(-15).join('\n') + '\n' + (run.stderr || '').slice(-1500)); process.exit(2); }
const D = JSON.parse(line.slice(5)), F = D.frames, idx = new Map(F.map((f, i) => [f, i]));
// one row per (rule, level, a, b) and run of checked frames in a row
const groups = new Map(); for (const h of D.hits) { const k = [h.rule, h.level, h.a, h.b].join('|'); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(h); }
const rows = []; for (const hs of groups.values()) { hs.sort((a, b) => a.f - b.f); let run = [];
  const flush = () => { if (!run.length) return; const w = [...run].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))[0]; rows.push({ result: w.level, rule: w.rule, a: w.a, b: w.b, f0: run[0].f, f1: run[run.length - 1].f, frames_bad: run.length, worst_frame: w.f, value: w.value, what: w.text }); run = []; };
  for (const h of hs) { if (run.length && idx.get(h.f) !== idx.get(run[run.length - 1].f) + 1) flush(); run.push(h); } flush(); }
const rank = { FAIL: 0, WARN: 1, INFO: 2 }; rows.sort((a, b) => rank[a.result] - rank[b.result] || a.f0 - b.f0);
const n = s => rows.filter(r => r.result === s).length, secs = +((Date.now() - T0) / 1000).toFixed(1);
const restSum = {}; for (const r of D.resting) { const k = r.prop + ' on ' + r.support, e = restSum[k] || (restSum[k] = { frames: 0, min_cm: Infinity, max_cm: -Infinity, how: r.how }); e.frames++; e.min_cm = Math.min(e.min_cm, r.gap_cm); e.max_cm = Math.max(e.max_cm, r.gap_cm); }
const summary = { film: FILM, window: [F[0], F[F.length - 1]], step: STEP, frames_checked: F.length, cast: D.cast, held_props: D.held, fail: n('FAIL'), warn: n('WARN'), info: n('INFO'), resting: restSum, set_meshes: D.skipped, notes: D.notes, seconds: secs, scan_seconds: +(D.scan_ms / 1000).toFixed(1), numbers: cfg };
fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, 'collide.json'), JSON.stringify({ summary, rows }, null, 1));
const pad = (s, w) => String(s).length > w ? String(s).slice(0, w - 1) + '~' : String(s).padEnd(w), wd = [6, 15, 22, 26, 10, 78], fr = r => r.f0 === r.f1 ? 'f' + r.f0 : `f${r.f0}-${r.f1}`;
console.log(`collide: ${path.basename(EP)}/${path.basename(FILM)}  frames ${F[0]}-${F[F.length - 1]} every ${STEP} (${F.length} checked)  cast ${D.cast.join(', ')}  held 3D props: ${D.held.join(', ') || 'none'}`);
for (const [pl, s] of Object.entries(D.skipped)) console.log(`set ${pl}: ${s.tested} meshes tested; not tested: ${Object.entries(s).filter(([k]) => k !== 'tested').map(([k, v]) => `${v} ${k}`).join(', ') || 'none'}`);
for (const [k, e] of Object.entries(restSum)) console.log(`resting ${k}: gap ${e.min_cm} to ${e.max_cm} cm over ${e.frames} frames (${e.how})`);
if (!Object.keys(cfg.resting).length) console.log('resting: no "collide": {"resting": {...}} in the film.json, so FLOATING / SUNK was not tested');
console.log(['result', 'rule', 'who / what', 'against', 'frames', 'what'].map((h, i) => pad(h, wd[i])).join(' '));
const show = rows.filter(r => r.result !== 'INFO' || has('--all')); for (const r of show.slice(0, 40)) console.log([r.result, r.rule, r.a, r.b, fr(r), r.what].map((c, i) => pad(c, wd[i])).join(' '));
if (show.length > 40) console.log(`... ${show.length - 40} more in collide.json`); if (!show.length) console.log('(no row)');
for (const s of D.notes) console.log('note: ' + s);
console.log(`${n('FAIL')} FAIL, ${n('WARN')} WARN (${secs} s, scan ${summary.scan_seconds} s)  ->  ${path.join(OUT, 'collide.json')}`);
process.exit(n('FAIL') ? 1 : 0);

#!/usr/bin/env node
// scale_check.mjs (from the lean test r2, 2026-11-17; run by check.mjs, CB_RULES 11a2 guards). Numbers, not looking.
//   node tools/frame_checks/scale_check.mjs <film.json> [--frames a-b] [--step 4] [--out dir] [--puppets dir,dir] [--crops 8]
// Every character in frame is measured in WORLD metres against the named set reference it belongs to:
//   driver (cast in_vehicle, in a vehicles.js car or bus with userData.driverSeat):
//     seated       the drawing's soles sit BELOW the seat (legs bent down to the floor), not standing on the seat     FAIL when the soles are within 10 cm of the seat
//     head_roof    car: gap from the head top (hair/hat) to the roof line (driverSeat.window[1])      PASS 0-14 cm   FAIL < -2 cm (through the roof) or > 20 cm (sits low, reads small)
//                  bus: head top as a share of the windscreen band (window[0]-[1])                    PASS 0.35-0.75 (real driver: about mid window)
//     shoulder     the shoulder line (chin + 5 % of the head) above the window sill (window[0])          car FAIL < -8 cm, WARN < 0 ; bus FAIL < 0
//     seated_h     head top minus the seat (seated height) vs a real seated adult (0.85-0.95 m) x the vehicle's interior scale
//                  (car: roof-above-seat / 0.95 m real; bus: real size) PASS within 15 %, FAIL beyond 25 %
//     hands_wheel  both fists on the steering-wheel rim, measured on screen in metres at the wheel's depth  FAIL > 8 cm (WARN > 5 cm); a waving hand is exempt on the frames the act says it waves
//   rider / walker (everyone else):
//     h_vs_door    standing height / the bus door opening (bus_door_frame, real 1.9-2.0 m vs adult 1.65 = 0.80-0.90)  PASS 0.70-0.95
//     h_vs_wheel   standing height / bike wheel diameter (real 1.65 / 0.66 = 2.5)                       PASS 2.1-2.9
// Writes out/scale_check.json, out/scale_check.md and out/scale_check/*.jpg (one crop per FAIL). Exit 1 on any FAIL.
// Same engine as tools/frame_checks/check.mjs: starts templates/threejs_film/render_gpu.mjs once with --eval and reads the live scene; the kit is not changed.
import fs from 'fs'; import path from 'path'; import os from 'os'; import { fileURLToPath } from 'url'; import { spawnSync } from 'child_process';
const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '..', '..'), KIT = path.join(ROOT, 'templates', 'threejs_film');
const A = process.argv.slice(2), has = k => A.includes(k), val = (k, d) => { const i = A.indexOf(k); return i >= 0 && A[i + 1] !== undefined ? A[i + 1] : d; };
if (!A[0] || A[0].startsWith('--')) { console.log('usage: node tools/frame_checks/scale_check.mjs <film.json> [--frames a-b] [--step 4] [--out dir] [--crops 8]'); process.exit(2); }
const T0 = Date.now(), FILM = path.resolve(A[0]), EP = path.dirname(FILM), film = JSON.parse(fs.readFileSync(FILM, 'utf8')), OUT = path.resolve(val('--out', path.join(EP, 'out', 'scale')));
const m = /^(\d+)(?:-(\d+))?$/.exec(val('--frames', '0-0')), F0 = +m[1], F1 = +(m[2] ?? m[1]), STEP = +val('--step', 4);
const frames = []; for (let f = F0; f <= F1; f += STEP) frames.push(f); if (frames[frames.length - 1] !== F1) frames.push(F1);
// waving frames per character (an act note or pose that says "wave" = that hand leaves the wheel on purpose)
const waves = {}; for (const a of film.acts || []) if (/wav/i.test(a.note || '')) (waves[a.who] ||= []).push(a.at);
const cfg = { frames, crops: +val('--crops', 8), waves, waveSpan: 60 };
const LOCKED = path.join(KIT, '..', 'vector2d_characters', 'code');
let pup = val('--puppets'); if (!pup && film.puppet_pkg) pup = [].concat(film.puppet_pkg).map(p => path.resolve(EP, p)).map(p => fs.existsSync(p) ? p : /vector2d_characters/.test(p) ? LOCKED : p).join(',');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'scale_check_')), evalFile = path.join(TMP, 'eval.js');
fs.writeFileSync(evalFile, 'window.__SC = ' + JSON.stringify(cfg) + ';\n' + fs.readFileSync(path.join(HERE, 'page_scale.js'), 'utf8'));
const args = ['render_gpu.mjs', FILM, '--frames', String(frames[0]), '--scale', val('--scale', '0.5'), '--seed', '7', '--no-captions', '--stills-dir', path.join(TMP, 'still'), '--eval', evalFile, ...(pup ? ['--puppets', pup] : [])];
const run = spawnSync(process.execPath, args, { cwd: KIT, encoding: 'utf8', maxBuffer: 1 << 29 });
const line = (run.stdout || '').split(/\r?\n/).find(l => l.startsWith('eval {'));
if (!line) { console.error('scale_check: the film page gave no result.\n' + (run.stdout || '').split(/\r?\n/).filter(l => !l.startsWith('eval')).slice(-15).join('\n') + '\n' + (run.stderr || '').slice(-1500)); process.exit(3); }
const res = JSON.parse(line.slice(5)); fs.rmSync(TMP, { recursive: true, force: true });
const rank = { FAIL: 0, WARN: 1, PASS: 2 }, rows = res.rows.sort((a, b) => rank[a.status] - rank[b.status] || a.who.localeCompare(b.who) || a.check.localeCompare(b.check));
const cropDir = path.join(OUT, 'scale_check'); fs.mkdirSync(OUT, { recursive: true }); fs.rmSync(cropDir, { recursive: true, force: true });
for (const c of res.crops) { fs.mkdirSync(cropDir, { recursive: true }); const name = `FAIL_${c.check}_${c.who}_f${String(c.frame).padStart(5, '0')}.jpg`; fs.writeFileSync(path.join(cropDir, name), Buffer.from(c.jpg, 'base64')); const r = rows.find(q => q.who === c.who && q.check === c.check); if (r) r.crop = 'scale_check/' + name; }
const n = s => rows.filter(r => r.status === s).length, secs = +((Date.now() - T0) / 1000).toFixed(1);
const summary = { film: FILM, frames: frames.length, from: F0, to: F1, step: STEP, fail: n('FAIL'), warn: n('WARN'), pass: n('PASS'), seconds: secs, refs: res.refs };
fs.writeFileSync(path.join(OUT, 'scale_check.json'), JSON.stringify({ summary, rows }, null, 1));
const head = ['result', 'who', 'role', 'check', 'number', 'target', 'worst at', 'bad frames', 'what'];
const cell = r => [r.status, r.who, r.role, r.check, r.value + ' ' + r.unit, r.target, 'f' + r.frame, `${r.bad}/${r.n}`, r.detail || ''];
fs.writeFileSync(path.join(OUT, 'scale_check.md'), `# Scale check: ${path.basename(EP)}/${path.basename(FILM)} f${F0}-${F1} every ${STEP}\n\n${summary.fail} FAIL, ${summary.warn} WARN, ${summary.pass} PASS.\n\n` +
  `| ${head.join(' | ')} | crop |\n|${head.map(() => '---').join('|')}|---|\n` + rows.map(r => `| ${cell(r).join(' | ')} | ${r.crop ? `[crop](${r.crop})` : ''} |`).join('\n') + '\n\nReferences (world metres): ' + JSON.stringify(res.refs) + '\n');
const pad = (s, w) => String(s).length > w ? String(s).slice(0, w - 1) + '~' : String(s).padEnd(w), wd = [6, 10, 7, 12, 12, 16, 8, 10, 60];
console.log(`scale_check: ${path.basename(EP)}/${path.basename(FILM)}  f${F0}-${F1} every ${STEP} (${frames.length} frames)`);
console.log(head.map((h, i) => pad(h, wd[i])).join(' ')); for (const r of rows) console.log(cell(r).map((c, i) => pad(c, wd[i])).join(' '));
console.log(`${summary.fail} FAIL, ${summary.warn} WARN, ${summary.pass} PASS (${secs} s)  ->  ${path.join(OUT, 'scale_check.md')}` + (res.crops.length ? `, ${res.crops.length} crops` : ''));
process.exit(summary.fail ? 1 : 0);

#!/usr/bin/env node
// check_objects.mjs: is the MOVING film fluid? (user rule 2026-11-22 "fluid like a video game": every moving thing moves on every frame, eased and continuous)
//   node tools/motion_objects/check_objects.mjs <film.json> [--window a-b] [--step 1] [--puppets dir,dir] [--out dir] [--all]
// One page session, no drawing. Tracks: the camera, every character card (feet, head, both hands), every named scene object that changes.
//   HELD   FAIL  a track that moves is frozen for 1-3 frames between moving frames (motion on twos / threes)
//   JUMP   FAIL  one frame step over 4x the median speed of the 12 steps around it AND over a small floor (not at a cut)
//   POP    WARN  a thing turns visible / invisible inside the camera frame with no scale or opacity ramp
//   KICK   WARN  a camera JUMP on frames the plan marks as a kick (a wanted impact shake)
//   CUT    info  cuts of the plan (take / place change, cut flag) and camera teleports the plan does not declare
// Writes out/motion_objects.json beside the film. Exit 1 on any FAIL, 2 when it could not run.
import fs from 'fs'; import path from 'path'; import os from 'os'; import { fileURLToPath } from 'url'; import { spawnSync } from 'child_process';
const HERE = path.dirname(fileURLToPath(import.meta.url)), KIT = path.resolve(HERE, '..', '..', 'templates', 'threejs_film');
const A = process.argv.slice(2), has = k => A.includes(k), val = (k, d) => { const i = A.indexOf(k); return i >= 0 && A[i + 1] !== undefined ? A[i + 1] : d; };
if (!A[0] || A[0].startsWith('--')) { console.log('usage: node tools/motion_objects/check_objects.mjs <film.json> [--window a-b] [--step 1] [--puppets dir,dir] [--out dir] [--all]'); process.exit(2); }
const T0 = Date.now(), FILM = path.resolve(A[0]), EP = path.dirname(FILM), film = JSON.parse(fs.readFileSync(FILM, 'utf8')), OUT = path.resolve(val('--out', path.join(EP, 'out')));
if (!fs.existsSync(path.join(EP, 'out', 'plan', 'camera_baked.json'))) { console.error('No out/plan/camera_baked.json beside the film. Run: python tools/film_plan.py check ' + A[0]); process.exit(2); }
const win = /^(\d+)-(\d+)$/.exec(val('--window', '')), STEP = Math.max(1, Math.round(+val('--step', 1)));
// the numbers (all per FRAME of the film, whatever --step is)
const N = { frozenPos: 2e-5, frozenRot: 0.002, frozenScale: 2e-5, movePos: +val('--move-pos', 2e-4), moveRot: +val('--move-rot', 0.02), moveScale: 5e-4, heldMax: 3, heldFlank: 0.25, heldMin: { camera: [5e-4, 0.05], card: [5e-4, 0.05], object: [5e-4, 0.05], hand: [2e-3, 0.05] }, jumpX: +val('--jump-x', 4), jumpWin: 6,
  floor: { camera: { pos: 0.01, rot: 0.5, fov: 0.5 }, card: { pos: +val('--jump-floor', 0.02) }, hand: { pos: +val('--hand-floor', 0.04) }, object: { pos: +val('--jump-floor', 0.02), rot: 3, scale: 0.10 } },
  cutPos: 0.5, cutRot: 20, cutX: 8, popRamp: 0.8, popLook: 3 };
const LOCKED = path.join(KIT, '..', 'vector2d_characters', 'code');
let pup = val('--puppets'); if (!pup && film.puppet_pkg) pup = [].concat(film.puppet_pkg).map(p => path.resolve(EP, p)).map(p => fs.existsSync(p) ? p : /vector2d_characters/.test(p) ? LOCKED : p).join(',');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'motion_objects_')), evalFile = path.join(TMP, 'eval.js'), f0 = win ? +win[1] : 0, f1 = win ? +win[2] : 1e9;
fs.writeFileSync(evalFile, 'window.__MO = ' + JSON.stringify({ f0, f1, step: STEP }) + ';\n' + fs.readFileSync(path.join(HERE, 'page_objects.js'), 'utf8'));
const run = spawnSync(process.execPath, ['render_gpu.mjs', FILM, '--frames', String(f0), '--scale', '0.1', '--seed', '7', '--no-captions', '--stills-dir', path.join(TMP, 'still'), '--eval', evalFile, ...(pup ? ['--puppets', pup] : [])], { cwd: KIT, encoding: 'utf8', maxBuffer: 1 << 30 });
const line = (run.stdout || '').split(/\r?\n/).find(l => l.startsWith('eval {')); fs.rmSync(TMP, { recursive: true, force: true });
if (!line) { console.error('motion_objects: the film page gave no result.\n' + (run.stdout || '').split(/\r?\n/).filter(l => !l.startsWith('eval')).slice(-15).join('\n') + '\n' + (run.stderr || '').slice(-1500)); process.exit(2); }
const D = JSON.parse(line.slice(5)), F = D.frames, n = F.length;

// ---- small maths
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], len = a => Math.hypot(a[0], a[1], a[2]), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const qdelta = (a, b) => { const c = [-a[0], -a[1], -a[2], a[3]]; let d = [c[3] * b[0] + c[0] * b[3] + c[1] * b[2] - c[2] * b[1], c[3] * b[1] - c[0] * b[2] + c[1] * b[3] + c[2] * b[0], c[3] * b[2] + c[0] * b[1] - c[1] * b[0] + c[2] * b[3], c[3] * b[3] - c[0] * b[0] - c[1] * b[1] - c[2] * b[2]]; if (d[3] < 0) d = d.map(x => -x); const s = Math.hypot(d[0], d[1], d[2]), ang = 2 * Math.atan2(s, d[3]) * 180 / Math.PI; return [s > 1e-12 ? d.slice(0, 3).map(x => x / s * ang) : [0, 0, 0], ang]; };
const qrot = (q, v) => { const [x, y, z, w] = q, u = [x, y, z], c1 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]], c2 = [u[1] * c1[2] - u[2] * c1[1], u[2] * c1[0] - u[0] * c1[2], u[0] * c1[1] - u[1] * c1[0]]; return [v[0] + 2 * (w * c1[0] + c2[0]), v[1] + 2 * (w * c1[1] + c2[1]), v[2] + 2 * (w * c1[2] + c2[2])]; };
const med = v => { if (!v.length) return 0; const s = [...v].sort((a, b) => a - b); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
const ranges = (idx) => { const o = []; for (const i of idx) { const l = o[o.length - 1]; if (l && i <= l[1] + 1) l[1] = i; else o.push([i, i]); } return o; };
const fr = (a, b) => a === b ? 'f' + a : `f${a}-${b}`;

// ---- cuts: from the plan (take / place change, cut flag), and camera teleports the plan does not declare
const cam = D.cam, cuts = [], cutAt = new Set();
const camStep = i => ({ p: len(sub(cam[i], cam[i - 1])) / STEP, r: qdelta(cam[i - 1].slice(3, 7), cam[i].slice(3, 7))[1] / STEP, f: Math.abs(cam[i][7] - cam[i - 1][7]) / STEP });
for (let i = 1; i < n; i++) { const a = D.plan[i - 1], b = D.plan[i], why = b[2] ? 'cut flag' : a[1] !== b[1] ? `place ${a[1]} -> ${b[1]}` : a[0] !== b[0] ? `take ${a[0]} -> ${b[0]}` : null; if (why) { cuts.push({ frame: F[i], kind: 'plan', why }); cutAt.add(i); } }
{ const st = [null]; for (let i = 1; i < n; i++) st.push(camStep(i));
  for (let i = 1; i < n; i++) { if (cutAt.has(i)) continue; const nb = []; for (let k = Math.max(1, i - N.jumpWin); k <= Math.min(n - 1, i + N.jumpWin); k++) if (k !== i && !cutAt.has(k)) nb.push(st[k]);
    const mp = med(nb.map(s => s.p)), mr = med(nb.map(s => s.r)), s = st[i];
    if ((s.p * STEP > N.cutPos && s.p > N.cutX * mp) || (s.r * STEP > N.cutRot && s.r > N.cutX * mr)) { cuts.push({ frame: F[i], kind: 'detected', why: `camera teleport ${(s.p * STEP).toFixed(2)} m, ${(s.r * STEP).toFixed(1)} deg in one step; the plan declares no cut here` }); cutAt.add(i); } } }
cuts.sort((a, b) => a.frame - b.frame);

// ---- one track = per frame {p, q?, s?, x? (extra scalar, e.g. fov), v (visible)} or null
const tracks = [];
tracks.push({ name: 'CAMERA', kind: 'camera', rows: cam.map(c => ({ p: c.slice(0, 3), q: c.slice(3, 7), x: c[7], v: 1 })) });
for (const [who, rows] of Object.entries(D.cards)) {
  tracks.push({ name: who + '.feet', kind: 'card', rows: rows.map(r => r && { p: r.root, v: 1 }) });
  tracks.push({ name: who + '.head', kind: 'card', rows: rows.map(r => r && { p: r.head, v: 1 }), poses: rows.map(r => r && r.pose) });
  if (rows.some(r => r && r.hands)) for (const [k, nm] of [[0, 'handR'], [1, 'handL']]) tracks.push({ name: `${who}.${nm}`, kind: 'hand', rows: rows.map(r => r && r.hands && { p: r.hands[k], v: 1 }), poses: rows.map(r => r && r.pose) });
}
const changes = o => { let k = null; for (const r of o.rows) { if (!r) continue; if (k && r.some((x, i) => Math.abs(x - k[i]) > (i === 10 ? 0 : i === 11 ? 1e-3 : 2e-5))) return true; k = k || r; } return false; };   // float noise only = not a moving object
D.objects = D.objects.filter(changes);
for (const o of D.objects) tracks.push({ name: o.name, kind: 'object', type: o.type, rows: o.rows.map(r => r && { p: r.slice(0, 3), q: r.slice(3, 7), s: r.slice(7, 10), v: r[10], op: r[11] }) });

const events = [];
const analyse = (t) => {
  const fl = N.floor[t.kind], R = t.rows, st = new Array(n).fill(null);   // st[i] = step from frame i-1 to i, inside one shot, both frames visible
  for (let i = 1; i < n; i++) { const a = R[i - 1], b = R[i]; if (!a || !b || !a.v || !b.v || cutAt.has(i)) continue; const dp = sub(b.p, a.p), [rv, ang] = a.q ? qdelta(a.q, b.q) : [[0, 0, 0], 0];
    const sc = a.s ? Math.max(...a.s.map((x, k) => Math.abs(b.s[k] - x) / Math.max(1e-6, Math.abs(x)))) : 0, fx = a.x !== undefined ? Math.abs(b.x - a.x) : 0;
    const s = { dp, rv, pos: len(dp) / STEP, rot: ang / STEP, scale: sc / STEP, x: fx / STEP }; s.frozen = s.pos <= N.frozenPos && s.rot <= N.frozenRot && s.scale <= N.frozenScale && s.x <= 1e-4; s.moving = s.pos > N.movePos || s.rot > N.moveRot || s.scale > N.moveScale || s.x > 0.01; st[i] = s; }
  const res = { track: t.name, kind: t.kind, frames: R.filter(r => r && r.v).length, steps: st.filter(Boolean).length, moving: st.filter(s => s && s.moving).length, max_m_per_frame: 0, max_deg_per_frame: 0, held: 0, jump: 0, pop: 0 };
  for (const s of st) if (s) { res.max_m_per_frame = Math.max(res.max_m_per_frame, s.pos); res.max_deg_per_frame = Math.max(res.max_deg_per_frame, s.rot); }
  const around = (i, key) => { const v = []; for (let k = i - N.jumpWin; k <= i + N.jumpWin; k++) if (k !== i && k >= 1 && k < n && st[k]) { let cutBetween = false; for (let c = Math.min(i, k) + 1; c <= Math.max(i, k); c++) if (cutAt.has(c) || !st[c]) cutBetween = true; if (!cutBetween) v.push(st[k][key]); } return v; };
  // HELD: 1-3 frozen steps with a moving step on both sides (same shot), the motion going on the same way after the hold (a turn-round at the top of a bob is not a hold)
  const afterHeld = new Set();
  if (STEP === 1) for (let i = 2; i < n; i++) { if (!st[i] || !st[i].frozen || !st[i - 1] || !st[i - 1].moving) continue; let j = i; while (j + 1 < n && st[j + 1] && st[j + 1].frozen) j++;
    const a = st[i - 1], b = st[j + 1]; if (j - i + 1 <= N.heldMax && b && b.moving) {
      const hm = N.heldMin[t.kind], key = a.pos > hm[0] && b.pos > hm[0] ? 'pos' : a.rot > hm[1] && b.rot > hm[1] ? 'rot' : null, m = key ? med(around(i, key).filter(x => x > (key === 'pos' ? N.frozenPos : N.frozenRot))) : 0;
      const same = key === 'pos' ? dot(a.dp, b.dp) > 0 : key === 'rot' ? dot(a.rv, b.rv) > 0 : false, strong = !!key && (a[key] >= N.heldFlank * m && b[key] >= N.heldFlank * m);
      if (same && strong) { res.held++; afterHeld.add(j + 1); events.push({ level: 'FAIL', rule: 'HELD', track: t.name, f0: F[i], f1: F[j], text: `frozen ${j - i + 1} frame${j > i ? 's' : ''} between moving frames (${key === 'rot' ? `${a.rot.toFixed(2)} then ${b.rot.toFixed(2)} deg/frame` : `${(a.pos * 100).toFixed(1)} then ${(b.pos * 100).toFixed(1)} cm/frame`}): motion on ${j - i + 2}s` }); } }
    i = j; }
  // JUMP: a step over 4x the median of the 12 around it and over the floor
  const jf = [];
  for (let i = 1; i < n; i++) { const s = st[i]; if (!s || afterHeld.has(i)) continue;
    for (const [key, unit, k] of [['pos', 'm', 1], ['rot', 'deg', 1], ['scale', 'x scale', 1], ['x', 'deg fov', 1]]) { const floor = key === 'x' ? fl.fov : fl[key]; if (floor === undefined || s[key] * STEP <= floor) continue; const nb = around(i, key); if (nb.length < 2) continue; const m = med(nb);
      if (s[key] > N.jumpX * m) { jf.push({ i, key, unit, v: s[key] * STEP, m }); break; } } }
  for (const [a, b] of ranges(jf.map(j => j.i))) { const w = jf.filter(j => j.i >= a && j.i <= b).sort((p, q) => q.v - p.v)[0]; res.jump++;
    const pose = t.poses && t.poses[w.i - 1] !== t.poses[w.i] ? `, pose ${t.poses[w.i - 1]} -> ${t.poses[w.i]} (pose pop)` : '', kick = t.kind === 'camera' && [a - 1, a, b, b + 1].some(k => D.plan[k] && D.plan[k][4]); if (kick) res.jump--;
    events.push({ level: kick ? 'WARN' : 'FAIL', rule: kick ? 'KICK' : 'JUMP', track: t.name, f0: F[a], f1: F[b], text: `${kick ? 'camera kick declared in the plan: ' : ''}${w.key === 'pos' ? (w.v * 100).toFixed(1) + ' cm' : w.v.toFixed(2) + ' ' + w.unit} in one step at f${F[w.i]}, the steps around it run at ${w.key === 'pos' ? (w.m * 100).toFixed(2) + ' cm' : w.m.toFixed(3) + ' ' + w.unit}/frame (median)${pose}` }); }
  // POP: visible <-> invisible inside the camera frame, with no scale or opacity ramp
  for (let i = 1; i < n; i++) { if (cutAt.has(i)) continue; const a = R[i - 1], b = R[i], va = !!(a && a.v), vb = !!(b && b.v); if (va === vb || (!a && !b)) continue; if ((va ? a : b) === null) continue;
    const on = vb, at = on ? i : i - 1, r = R[at], c = cam[at], lp = qrot([-c[3], -c[4], -c[5], c[6]], sub(r.p, c)), th = Math.tan(c[7] * Math.PI / 360);
    if (!(lp[2] < -0.05 && Math.abs(lp[1]) <= -lp[2] * th * 1.05 && Math.abs(lp[0]) <= -lp[2] * th * c[8] * 1.05)) continue;
    const far = R[on ? Math.min(n - 1, at + N.popLook) : Math.max(0, at - N.popLook)]; let ramp = false;
    if (far && far.v && r.s && far.s) { const s0 = Math.cbrt(Math.abs(r.s[0] * r.s[1] * r.s[2])), s1 = Math.cbrt(Math.abs(far.s[0] * far.s[1] * far.s[2])); if (s0 < N.popRamp * s1 || (r.op ?? 1) < N.popRamp * (far.op ?? 1)) ramp = true; }
    if (!ramp) { res.pop++; events.push({ level: 'WARN', rule: 'POP', track: t.name, f0: F[i], f1: F[i], text: `turns ${on ? 'visible' : 'invisible'} inside the camera frame with no scale or opacity ramp` }); } }
  res.result = res.held || res.jump ? 'FAIL' : res.pop ? 'WARN' : 'PASS'; return res;
};
const table = tracks.map(analyse), camRow = table[0], camShare = camRow.steps ? camRow.moving / camRow.steps : 0;
const fails = events.filter(e => e.level === 'FAIL'), warns = events.filter(e => e.level === 'WARN'), secs = +((Date.now() - T0) / 1000).toFixed(1);
const summary = { film: FILM, window: [F[0], F[n - 1]], step: STEP, frames: n, fail: fails.length, warn: warns.length, tracks: table.length, tracks_failing: table.filter(r => r.result === 'FAIL').length, camera_moving_share: +camShare.toFixed(3), cuts, seconds: secs, page: D.stats, notes: [...D.notes, ...(STEP > 1 ? ['--step over 1: HELD is not tested (a hold of 1-3 frames cannot be seen)'] : [])], numbers: N };
fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, 'motion_objects.json'), JSON.stringify({ summary, table, events }, null, 1));

// ---- console
const pad = (s, w) => String(s).length > w ? String(s).slice(0, w - 1) + '~' : String(s).padEnd(w), wd = [6, 34, 7, 7, 9, 10, 5, 5, 4];
console.log(`motion_objects: ${path.basename(EP)}/${path.basename(FILM)}  frames ${F[0]}-${F[n - 1]}${STEP > 1 ? ' every ' + STEP : ''}  ${table.length} tracks (camera, ${Object.keys(D.cards).length} characters, ${D.objects.length} moving objects of ${D.stats.objects_seen})`);
console.log(`CAMERA moves on ${(camShare * 100).toFixed(0)} % of the frames (${camRow.moving} of ${camRow.steps} steps)`);
for (const c of cuts) console.log(`CUT  f${c.frame}  ${c.kind === 'plan' ? 'plan: ' : 'NOT IN THE PLAN: '}${c.why}`); if (!cuts.length) console.log('CUT  none');
const rank = { FAIL: 0, WARN: 1, PASS: 2 }, shown = has('--all') ? table : [table[0], ...table.slice(1).filter(r => r.kind !== 'object' || r.result !== 'PASS')], hidden = table.length - shown.length;
console.log(['result', 'track', 'frames', 'moving', 'max cm/f', 'max deg/f', 'held', 'jump', 'pop'].map((h, i) => pad(h, wd[i])).join(' '));
for (const r of [...shown].sort((a, b) => (a.kind === 'camera' ? -1 : b.kind === 'camera' ? 1 : rank[a.result] - rank[b.result]))) console.log([r.result, r.track, r.frames, r.moving, (r.max_m_per_frame * 100).toFixed(2), r.max_deg_per_frame.toFixed(2), r.held, r.jump, r.pop].map((c, i) => pad(c, wd[i])).join(' '));
if (hidden) console.log(`... ${hidden} moving objects with PASS not shown (--all shows them; all are in motion_objects.json)`);
const ev = [...fails, ...warns].sort((a, b) => rank[a.level] - rank[b.level] || a.f0 - b.f0), MAXL = +val('--lines', 40);
for (const e of ev.slice(0, MAXL)) console.log(`${e.level} ${e.rule.padEnd(4)} ${e.track}  ${fr(e.f0, e.f1)}  ${e.text}`); if (ev.length > MAXL) console.log(`... ${ev.length - MAXL} more in motion_objects.json`);
for (const s of summary.notes) console.log('note: ' + s);
console.log(`${fails.length} FAIL, ${warns.length} WARN on ${table.filter(r => r.result !== 'PASS').length} of ${table.length} tracks (${secs} s, page scan ${(D.stats.scan_ms / 1000).toFixed(1)} s = ${D.stats.ms_per_frame} ms/frame)  ->  ${path.join(OUT, 'motion_objects.json')}`);
process.exit(fails.length ? 1 : 0);

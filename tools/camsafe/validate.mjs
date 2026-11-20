// CAMERA-SAFE SHOT VALIDATOR (CB 2026-11-16, thread "Build camera-safe 2.5D character rig").
//   node tools/camsafe/validate.mjs <film.json> [--frames a-b] [--step 2] [--quiet]
// One command (CB_RULES 11b T4): it runs `render.mjs --camsafe` (numbers only, nothing is drawn), judges every character on every checked frame,
// prints a short table, writes out/plan/camsafe_report.json and exits 1 when anything FAILs. Numbers before pictures (T3).
//
// What it judges (our characters are flat cards that always face the lens and tip to it, so they are never thin or squashed; the faults left are these):
//  RIG_ERROR       FAIL  the preset cannot play this move at all (the film page would stop on it)
//  VIEW_MISMATCH   FAIL  the drawing is not the view the camera asked for (a move with no back drawing showed his face from behind)
//  MEME_SIDE       WARN  a side view drawn with a meme face: char2d slides the front face to the edge, it is not a profile (the kit faces k:... turn)
//  FACE_BEHIND     FAIL  the lens is behind him (150 deg or more round) but a face is drawn
//  LEGS_DISAGREE   FAIL  3D legs (sit_chair, sit_floor) point one way, the drawn body another (8 deg allowed for the planner's 6 deg hysteresis)
//  SEAT_DRIFT      FAIL  a seated card tips about its feet and its hips leave the seat by more than 6 cm (film.json "camsafe": true fixes it)
//  STEEP           WARN over 62 deg down, FAIL over 75: a standing card seen from almost straight above reads as a flat cut-out
//  LOW             WARN  more than 40 deg up at him
//  FACE_HIDDEN     WARN  he talks (mouth moves) while only his back is drawn: fine when the plan means it
//  FLICKER         WARN  the drawn view changes again within 8 frames, with no cut between (a pop back and forth while the camera drifts)
// Every flag prints the least disruptive fix first (move the camera a few degrees, then switch or add a drawing, then change the act), never a squash.
import fs from 'fs'; import path from 'path'; import { spawnSync } from 'child_process'; import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url)), KIT = path.join(HERE, '..', '..', 'templates', 'threejs_film');
const A = process.argv.slice(2), has = k => A.includes(k), val = (k, d) => { const i = A.indexOf(k); return i >= 0 && A[i + 1] && !A[i + 1].startsWith('--') ? A[i + 1] : d; };
if (!A[0]) { console.log('usage: node tools/camsafe/validate.mjs <film.json> [--frames a-b] [--step n] [--quiet] [--no-render]'); process.exit(2); }
const FILM = path.resolve(A[0]), OUT = path.join(path.dirname(FILM), 'out', 'plan'), RAW = path.join(OUT, 'camsafe.json');
if (!has('--no-render')) {
  const args = [path.join(KIT, 'render.mjs'), FILM, '--camsafe', ...(val('--frames') ? [val('--frames')] : []), '--step', val('--step', '1'), '--no-captions'];
  const r = spawnSync(process.execPath, args, { encoding: 'utf8' }); if (r.status !== 0) { console.log(r.stdout, r.stderr); process.exit(2); }
}
const film = JSON.parse(fs.readFileSync(FILM, 'utf8')), raw = JSON.parse(fs.readFileSync(RAW, 'utf8')), rows = raw.frames;
const VN = { front: 'front', 34: '3/4', side: 'side', back: 'back' };
const trueView = (a, full) => { const L = full ? [28, 68, 125] : [28, 110, 150]; return a < L[0] ? 'front' : a < L[1] ? '34' : a < L[2] ? 'side' : 'back'; };
const out = [], last = {};
for (const r of rows) {
  const flags = [], fix = [], a = Math.abs(r.yaw), tiny = r.screen_h != null && r.screen_h < .12, lie = !!r.lie;
  const add = (lvl, k, why, f) => { flags.push({ lvl, k, why }); if (f) fix.push(f); };
  if (r.rig_error) add('FAIL', 'RIG_ERROR', `${r.puppet} cannot play ${r.pose}: ${r.rig_error}`, `cast another preset for this move, or fix the preset's arms for the motion library (puppets.mjs chOf)`);
  if (!lie && !r.rig_error) {
    if (r.view_drawn !== r.view_want) add('FAIL', 'VIEW_MISMATCH', `asked ${VN[r.view_want]}, drew ${VN[r.view_drawn]} (${r.move || r.pose})`,
      r.view_want === 'side' ? `the move ${r.move} has no side drawing: add one to its module, or keep the camera under 68 deg round him` : `set film.json "camsafe": true (moves then draw the asked view)`);
    if (r.view_drawn === 'side' && r.face_mode === 'meme') add('WARN', 'MEME_SIDE', `side view with a drawn meme face (${r.face || 'own face'}): the face slides to the edge, it is not a profile`,
      `for a close side shot use a kit face (k:...) on this act, or keep the camera under 110 deg round him (3/4)`);
    if (r.facing_known && a >= 150 && (r.view_drawn === 'front' || r.view_drawn === '34') && r.look !== 'cam') add('FAIL', 'FACE_BEHIND', `lens ${Math.round(a)} deg round (behind him) but a face is drawn`, `give the act look_full (true back view), or move the camera in front of him`);
    if (r.legs3d && r.facing_known && r.view_drawn !== trueView(a, true) && r.view_drawn !== trueView(Math.max(0, a - 8), true) && r.view_drawn !== trueView(a + 8, true)) add('FAIL', 'LEGS_DISAGREE', `3D legs point where he faces (${Math.round(a)} deg) but the body is drawn ${VN[r.view_drawn]}`, `set film.json "camsafe": true (sitting with 3D legs then takes the true view)`);
    if (r.seat_drift > .06) add('FAIL', 'SEAT_DRIFT', `hips leave the seat by ${Math.round(r.seat_drift * 100)} cm when the card tips ${Math.round(r.tip)} deg`, `set film.json "camsafe": true (the card tips about its seat), or lower the camera`);
    if (r.pitch > 75) add('FAIL', 'STEEP', `camera ${Math.round(r.pitch)} deg down: a standing card reads as a cut-out lying flat`, `lower the camera to 60 deg or less, or use a lying / top drawing (lie_cam) if he is on the floor`);
    else if (r.pitch > 62) add('WARN', 'STEEP', `camera ${Math.round(r.pitch)} deg down`, `lower the camera to 60 deg or less unless the plan wants the top-down`);
    if (r.pitch < -40) add('WARN', 'LOW', `camera ${Math.round(-r.pitch)} deg up at him`, `raise the camera to 35 deg up or less, or check the chin and feet on the frame`);
    if (r.mouth && r.view_drawn === 'back') add('WARN', 'FACE_HIDDEN', `he talks with only his back drawn`, `fine if the plan row says so; else move the camera in front of him`);
  }
  const L = last[r.who];
  if (L && !r.cut && L.view !== r.view_drawn) { if (L.changed != null && r.f - L.changed <= 8 && !L.cutSince) add('WARN', 'FLICKER', `view ${VN[L.view]} -> ${VN[r.view_drawn]} again ${r.f - L.changed} frames after the last change`, `ease the camera through the switch angle, or hold the view (act key "view") for this move`); }
  if (!L || L.view !== r.view_drawn) last[r.who] = { view: r.view_drawn, changed: L ? r.f : null, cutSince: false }; else if (r.cut) L.cutSince = true;
  const fl = tiny ? flags.map(x => ({ ...x, lvl: x.lvl === 'FAIL' ? 'WARN' : x.lvl })) : flags;   // tiny far figures (under 12 % of the frame) warn only, as frame_checks does
  const verdict = fl.some(x => x.lvl === 'FAIL') ? 'FAIL' : fl.length ? 'WARN' : 'PASS';
  out.push({ f: r.f, who: r.who, verdict, flags: fl.map(x => x.k), why: fl.map(x => `${x.lvl} ${x.k}: ${x.why}`), fix, yaw: r.yaw, pitch: r.pitch, view_want: r.view_want, view_drawn: r.view_drawn, pose: r.pose, seat_drift: r.seat_drift });
}
fs.writeFileSync(path.join(OUT, 'camsafe_report.json'), JSON.stringify({ film: path.basename(path.dirname(FILM)), camsafe: !!film.camsafe, frames: out }, null, 1));
const n = k => out.filter(o => o.verdict === k).length, byFlag = {};
for (const o of out) for (const k of o.flags) byFlag[k] = (byFlag[k] || 0) + 1;
console.log(`CAMERA-SAFE  ${path.basename(path.dirname(FILM))}  camsafe ${film.camsafe ? 'on' : 'OFF'}  ${out.length} checks: PASS ${n('PASS')}  WARN ${n('WARN')}  FAIL ${n('FAIL')}`);
for (const [k, c] of Object.entries(byFlag).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(14)} ${c}`);
if (!has('--quiet')) { const seen = new Set(); for (const o of out) if (o.verdict !== 'PASS') { const key = o.who + o.flags.join(); if (seen.has(key)) continue; seen.add(key); console.log(`  f${o.f} ${o.who} ${o.verdict}  yaw ${o.yaw} pitch ${o.pitch}  ${o.why.join(' | ')}\n      FIX: ${o.fix[0] || ''}`); } }
console.log('report ->', path.join(OUT, 'camsafe_report.json'));
process.exit(n('FAIL') ? 1 : 0);

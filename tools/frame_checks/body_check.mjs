#!/usr/bin/env node
// body_check.mjs (2026-11-17, body rig): CONTACTS AND SCALE of every seated, driving and lying character, in numbers, no render.
//   node tools/frame_checks/body_check.mjs <film.json> [--json out.json]
// Reads the film's cast. A cast entry may carry "body": { "rig": "car" | "bus" | "chair" | "bed", "opt": { ...cabin options }, "set": { "seatToRoof": m, "seatH": m } }
// (templates/body_rig/body3d.mjs). For each one it solves the whole body from the contacts and reports every contact:
//   FLOAT / SUNK / STRETCH (a foot, hand, hip or head not on its contact), CRAMP (a knee or elbow past its limit), HEAD_CLIP (head in the roof),
//   SCALE (the character drawn at another size than its cast height, or a set built for another size).
// It also FAILS the old ways round: a cast "in_vehicle": true without a body rig (the page checks skip it), and an in-vehicle character drawn under 88 %
// of its cast height ("cast_height", default 1.7 m), as the traffic-lights drivers at 0.645 m.
// check.mjs runs this first and adds its rows to frame_checks.md. Exit code 1 on any FAIL.
import fs from 'fs'; import path from 'path'; import { fileURLToPath, pathToFileURL } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '..', '..'), TPL = path.join(ROOT, 'templates');
const B = await import(pathToFileURL(path.join(TPL, 'body_rig', 'body3d.mjs')).href);
const { formChar } = await import(pathToFileURL(path.join(TPL, 'vector2d_characters', 'code', 'bodies.mjs')).href);
export function bodyRows(film) {
  const rows = [], cast = film.cast || {};
  for (const [who, e] of Object.entries(cast)) {
    const H = e.height ?? 1.7, castH = e.cast_height ?? (e.in_vehicle ? 1.7 : H), push = (check, status, value, detail) => rows.push({ status, who, rest: 'film', check, value, frame: 0, bad_frames: status === 'PASS' ? 0 : 1, frames: 1, detail });
    if (e.in_vehicle && !e.body) push('body_contact', 'FAIL', null, 'in_vehicle: true skips the page checks; give this driver a "body" rig (car / bus) so seat, pedals, wheel and roof are checked');
    if (e.in_vehicle && H / castH < .88) push('body_scale', 'FAIL', Math.round(H / castH * 100), `drawn at ${H} m = ${Math.round(H / castH * 100)} % of the cast height ${castH} m: build the vehicle from the rider (body3d cabin.car / bus), never shrink the rider`);
    if (!e.body) continue;
    const form = /^form:(.+)/.exec(e.puppet || '')?.[1] || 'standard', S = formChar(form, 400, 'front', 1), sk = B.skeleton(S, H), rig = e.body.rig || 'chair';
    const fx = typeof rig === 'object' ? rig : B.cabin[rig](sk, e.body.opt || {}), sol = rig === 'bed' || fx.kind === 'bed' ? B.solveLie(sk, fx) : B.solveSit(sk, fx);
    for (const r of sol.report) push('body_contact', r.status === 'OK' ? 'PASS' : 'FAIL', r.gap_cm, `${r.contact}: ${r.status}${r.note ? ' (' + r.note + ')' : ''}`);
    if (e.body.set) { const f = B.setFit(sk, fx.kind || rig, e.body.set); if (f) push('body_scale', f.status === 'OK' ? 'PASS' : 'FAIL', null, `${fx.kind || rig}: ${f.note}`); }
  }
  return rows;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const F = process.argv[2]; if (!F) { console.log('usage: node tools/frame_checks/body_check.mjs <film.json>'); process.exit(2); }
  const rows = bodyRows(JSON.parse(fs.readFileSync(F, 'utf8'))), bad = rows.filter(r => r.status !== 'PASS');
  for (const r of rows) console.log(r.status.padEnd(5), r.who.padEnd(14), r.check.padEnd(13), String(r.value ?? '').padEnd(6), r.detail);
  const i = process.argv.indexOf('--json'); if (i > 0) fs.writeFileSync(process.argv[i + 1], JSON.stringify(rows, null, 1));
  console.log(`body_check: ${bad.length} FAIL, ${rows.length - bad.length} PASS`); process.exit(bad.length ? 1 : 0);
}

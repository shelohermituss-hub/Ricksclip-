// node sheet.mjs out.png [--bed-before <png of the current kit bed test>]
// PROOF SHEET for the body rig (2026-11-17): a car driver, a bus driver, a chair sit at a desk and a bed lie, BEFORE (the kit's current method) and
// AFTER (body3d.mjs: every joint solved from the contacts, the set built from the rider). Same character, same set, same cameras in both rows.
// The card draws the body and head only (locked look). Legs AND arms are 3D ink tubes on solved joints (the legs3d method CB locked 2026-11-16 for the
// floor sit), ending in the round ink fist ON the grip. Every panel lists its contact report (gaps in cm).
import { buildChar } from '../vector2d_characters/code/castkit.mjs';
import { drawCharacter } from '../vector2d_characters/code/char2d.mjs';
import { withHair } from '../vector2d_characters/code/hair_lib.mjs';
import * as B from './body3d.mjs';
import { createRequire } from 'module'; import http from 'http'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url)), OUT = process.argv[2] || 'body_rig_sheet.png';
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const THREE_DIR = arg('--three', path.join(HERE, '..', 'threejs_film', 'vendor'));
const { V } = B, D2R = Math.PI / 180;
const dd = t => t.replace(/<[a-zA-Z][^>]*>/g, tag => { const seen = new Set(); return tag.replace(/\s([a-zA-Z:-]+)="[^"]*"/g, (m, k) => seen.has(k) ? '' : (seen.add(k), m)); });

// THE CHARACTER: one locked cast character (standard size, outfit, hair), the same in every panel
const SPEC = withHair({ name: 'driver', form: 'standard', size: 'standard', coat: '#3f6f9e', face: 'standard', outfit: 'peasant' }, 'sidePart');
const mkS = (view, dir) => { const S = buildChar(SPEC, 400); S.view = view; S.dir = dir; S.noLegs = true; return S; };
const sk = B.skeleton(mkS('front', 1), 1.7);

// camera basis for a card standing on the floor and turned to the lens (as film.js): n = flat direction to the lens, ex = screen right, ey = up
function basis(A, cam) { const n = V.norm([cam[0] - A[0], 0, cam[2] - A[2]]); return { n, ex: V.norm(V.cross([0, 1, 0], n)), ey: [0, 1, 0] }; }
function viewOf(fwd, b) { const c = V.dot(fwd, b.n), s = V.dot(fwd, b.ex), a = Math.abs(Math.atan2(s, c)) / D2R;
  return { view: a <= 25 ? 'front' : a <= 65 ? '34' : a <= 125 ? 'side' : 'back', dir: s >= 0 ? 1 : -1 }; }
// a card point (px) to the world, and the card description for the page
const cardW = (C, u, v) => V.add(C.A, V.add(V.mul(C.ex, (u - C.pivot[0]) * C.k), V.mul(C.ey, (C.pivot[1] - v) * C.k)));
function cardOut(C, svgBody, defs) { const [x0, y0, w, h] = C.vb, ctr = cardW(C, x0 + w / 2, y0 + h / 2);
  return { svg: dd(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${C.vb.join(' ')}" width="${w}" height="${h}"><defs>${defs}</defs>${svgBody}</svg>`), w, h, ctr, ex: C.ex, ey: C.ey, n: C.n, sx: w * C.k, sy: h * C.k }; }
// pull the card toward the lens by d metres; on screen it does not move or change size (film.js camsafe nudge), it only comes in front of the seat
function nudge(C, cam, d) { const dist = V.len(V.sub(C.A, cam)), lam = 1 - d / dist; return { ...C, A: V.add(cam, V.mul(V.sub(C.A, cam), lam)), k: C.k * lam }; }

// ---------- AFTER: a seated body from the solver ----------
function seatedAfter(sol, cam, opt = {}) {
  const J = sol.J, b0 = basis(J.seat, cam), vw = viewOf([0, 0, 1], b0), S = mkS(vw.view, vw.dir);
  let C = { A: J.seat, ...b0, k: sk.k, pivot: [400, sk.bodyBot - 4], vb: [-100, -300, 1000, 1600] };
  C = nudge(C, cam, opt.nudge ?? .1);
  const up = V.norm(V.sub(J.neck, J.seat)), rot = Math.atan2(V.dot(up, C.ex), V.dot(up, C.ey)) / D2R;   // recline seen in the card plane
  const shPx = (() => { const a = S.arms({ cx: 400, view: vw.view, dir: vw.dir, turn: vw.view === '34' ? .55 * vw.dir : vw.view === 'side' ? vw.dir : 0 }), list = [].concat(a.front || []).map(x => /M\s*([-\d.]+)[ ,]+([-\d.]+)/.exec(x.d)).map(m => [+m[1], +m[2]]);
    if (a.back) { const m = /M\s*([-\d.]+)[ ,]+([-\d.]+)/.exec(a.back.d); list.push([+m[1], +m[2]]); } if (list.length < 2) list.push([...list[0]]); return list; })();
  S.arms = () => ({ front: [] });                                            // arms are 3D tubes now
  const r = drawCharacter(S), body = `<g transform="rotate(${rot.toFixed(2)},${C.pivot[0]},${C.pivot[1]})">${r.body}</g>`;
  const rotPx = p => { const a = rot * D2R, dx = p[0] - C.pivot[0], dy = p[1] - C.pivot[1]; return [C.pivot[0] + dx * Math.cos(a) - dy * Math.sin(a), C.pivot[1] + dx * Math.sin(a) + dy * Math.cos(a)]; };
  // which drawn shoulder belongs to which 3D arm: front/back by screen side, 3/4 and side by near/far
  const sides = ['L', 'R'], near = s => V.len(V.sub(J['shoulder' + s], cam)), order = vw.view === 'front' || vw.view === 'back' ? [...sides].sort((a, c) => V.dot(J['shoulder' + a], C.ex) - V.dot(J['shoulder' + c], C.ex)) : null;
  const tubes = [], balls = [], legR = sk.legR, armR = .017 * sk.H / 1.7, fistR = .046 * sk.H / 1.7, nearS = near('L') < near('R') ? 'L' : 'R';
  sides.forEach(s => {
    let px; if (order) { const sp = [...shPx].sort((a, c) => a[0] - c[0]); px = sp[order.indexOf(s)]; } else px = s === nearS ? shPx[0] : shPx[1];
    const isFar = !order && s !== nearS, shW = V.add(cardW(C, ...rotPx(px)), V.mul(C.n, isFar ? -sk.backDepth : .025));
    const hand = J['hand' + s], ar = B.ik2(shW, hand, sk.upper, sk.fore, [s === 'L' ? .6 : -.6, -1, -.3], B.LIMITS.elbow);
    tubes.push({ pts: [shW, ar.mid, ar.end], r: armR }); balls.push({ p: ar.end, r: fistR });
    const hipW = V.add(cardW(C, ...rotPx([400 + (s === nearS ? 1 : -1) * 0, sk.bodyBot - 40])), V.mul(C.n, isFar ? -sk.backDepth * .6 : .02)), hp = V.lerp(J['hip' + s], hipW, .5);
    tubes.push({ pts: [V.add(hp, [0, 0, 0]), J['knee' + s], J['ankle' + s], J['toe' + s]], r: legR, foot: true }); balls.push({ p: J['toe' + s], r: legR });
  });
  return { card: cardOut(C, body, r.defs), tubes, balls, view: vw };
}
// ---------- BEFORE: the kit's current seated method (sit_chair card + its fixed legs3d), at a given drawn height ----------
const SIT_LEGS = [[.075, .34, .0], [.085, .345, .2], [.09, .27, .25], [.095, .04, .26], [.1, .03, .35]];   // moves/sit_chair.mjs legs3d (SEAT_M 0.30)
function seatedBefore(seatTop0, pelvisZ, cam, drawnH, headTopAt = null) {
  const s = drawnH / 1.7, seatTop = headTopAt != null ? headTopAt - sk.seatToHeadTop * s : seatTop0, base = [0, seatTop - .30 * s, pelvisZ], b0 = basis(base, cam), vw = viewOf([0, 0, 1], b0), S = mkS(vw.view, vw.dir);
  const k = sk.k * s, seatPx = sk.bodyBot - 4;
  let C = { A: [0, seatTop, pelvisZ], ...b0, k, pivot: [400, seatPx], vb: [-100, -300, 1000, 1600] }; C = nudge(C, cam, .1 * s);
  const r = drawCharacter(S), tubes = [], balls = [];
  for (const sg of [1, -1]) { const pts = SIT_LEGS.map(p => V.add(base, [sg * p[0] * s, p[1] * s, p[2] * s])); tubes.push({ pts, r: .02 * s }); balls.push({ p: pts[pts.length - 1], r: .02 * s }); }
  // where the kit's drawn fists are (card hands hang at the sides): for the report
  const a = S.arms({ cx: 400, view: vw.view, dir: vw.dir, turn: 0 }), hands = [].concat(a.front || []).map(x => cardW(C, ...x.hand));
  return { card: cardOut(C, r.body, r.defs), tubes, balls, view: vw, hands, lift: seatTop - seatTop0 };
}
// ---------- AFTER: lying on the back ----------
function lyingAfter(fx, cam) {
  const toCam = V.sub(cam, [fx.hipX, fx.top, 0]); let ex = [1, 0, 0], n = V.norm([0, toCam[1], toCam[2]]), ey = V.cross(n, ex); let dir = 1;
  if (ey[1] < 0) { ex = [-1, 0, 0]; ey = V.cross(n, ex); dir = -1; }
  const above = n[1] > .85;   // camera almost straight down: front drawing (face up at us) - not used on this sheet
  const sol = B.solveLie(sk, { ...fx, pillow: { ...fx.pillow, h: fx.pillow.h / ey[1] } });   // contacts in the card plane: the pillow is seen through the card's tilt
  const S = mkS('side', dir), hl = sk.seatToHeadC - sk.seatToNeck, a = sol.neck * D2R * dir, nk = [400, sk.bodyTop], hc = [400, sk.hy];
  const rel = [hc[0] - nk[0], hc[1] - nk[1]], rr = [rel[0] * Math.cos(a) - rel[1] * Math.sin(a), rel[0] * Math.sin(a) + rel[1] * Math.cos(a)];
  S.headTilt = sol.neck * dir; S.headDx = rr[0] - rel[0]; S.headDy = rr[1] - rel[1]; S.lieFlat = true;
  const r = drawCharacter(S), th = (sol.spine - 90) * dir, pivot = [400, sk.bodyBot - 30];
  const A = V.add([fx.hipX, fx.top + .004, 0], V.mul(ey, sk.backDepth));   // the body's back line on the mattress top, the hip centre one half-body above it on the card
  const C = { A, ex, ey, n, k: sk.k, pivot, vb: [-900, -700, 2600, 2200] };
  const body = `<g transform="rotate(${th.toFixed(2)},${pivot[0]},${pivot[1]})">${r.body}</g>`, tubes = [], balls = [];
  for (const s of ['L', 'R']) { const J = sol.J; tubes.push({ pts: [V.add(J['hip' + s], V.mul(n, s === 'L' ? .03 : -.03)), J['knee' + s], J['ankle' + s], J['toe' + s]], r: sk.legR }); balls.push({ p: J['toe' + s], r: sk.legR }); }
  return { card: cardOut(C, body, r.defs), tubes, balls, view: { view: 'side', dir }, sol };
}

// ---------- SCENES ----------
const carFx = B.cabin.car(sk), busFx = B.cabin.bus(sk), chairFx = B.cabin.chair(sk, { desk: {} }), bedFx = B.cabin.bed(sk);
const carSol = B.solveSit(sk, carFx), busSol = B.solveSit(sk, busFx), chairSol = B.solveSit(sk, chairFx);
const KIT_CHAIR = { ...chairFx, seat: { ...chairFx.seat, h: .30 } };      // the kit's own test chair (sit_chair SEAT_M 0.30)
const handGap = (hands, targets) => targets.map((t, i) => Math.min(...hands.map(h => V.len(V.sub(h, t.p))))).map(g => +(g * 100).toFixed(0));
const SC = [
  { key: 'car', title: 'CAR DRIVER', fx: carFx, set: 'car', cams: [['3/4 front, through the windscreen', [-1.25, 1.55, 2.6], [0, .78, .05]], ['side window', [2.6, 1.0, -.2], [0, .8, -.2]]],
    before: cam => seatedBefore(carFx.seat.h, carSol.J.seat[2], cam, .645, carFx.roof - .06), after: cam => seatedAfter(carSol, cam, { nudge: .08 }), sol: carSol, drawnBefore: .645,
    beforeNote: 'kit today (traffic lights): drawn at 0.645 m (36 %) and lifted so the head shows in the window; sit_chair hands and legs' },
  { key: 'bus', title: 'BUS DRIVER', fx: busFx, set: 'bus', cams: [['3/4 front, through the windscreen', [.9, 1.85, 3.0], [0, .95, .05]], ['side window', [2.9, 1.25, -.2], [0, .95, -.2]]],
    before: cam => seatedBefore(busFx.seat.h, busSol.J.seat[2], cam, .645, carFx.roof - carFx.seat.h + busFx.seat.h - .06), after: cam => seatedAfter(busSol, cam, { nudge: .1 }), sol: busSol, drawnBefore: .645,
    beforeNote: 'kit today: same 36 % driver as the car, hands not on the wheel' },
  { key: 'chair', title: 'CHAIR, WRITING AT A DESK', fx: chairFx, set: 'chair', cams: [['3/4 front', [-1.9, 1.15, 2.9], [0, .65, .2]], ['side', [3.1, .95, .3], [0, .65, .2]]],
    before: cam => seatedBefore(.30, chairSol.J.seat[2], cam, 1.7), after: cam => seatedAfter(chairSol, cam, { nudge: .1 }), sol: chairSol, drawnBefore: 1.7, beforeFx: KIT_CHAIR,
    beforeNote: 'kit today: m:sit_chair (fixed 0.30 m seat, fixed legs, arms hang at the sides)' },
  { key: 'bed', title: 'LYING IN BED', fx: bedFx, set: 'bed', cams: [['level, side', [0, .75, 4.4], [0, .45, 0]], ['3/4 high', [3, 2.6, 3.1], [0, .45, 0]]],
    after: cam => lyingAfter(bedFx, cam), beforeImg: arg('--bed-before', null), beforeNote: 'kit today: bed test v8 (whole card tilted 14 deg to reach the pillow)' },
];

const W = 400, H = 520;
const html = `<html><body style="margin:0"><canvas id="c" width="${W}" height="${H}"></canvas><script type="module">
import * as THREE from '/three/three.module.js';
const R = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: true, preserveDrawingBuffer: true });
const INK = '#2a1a1f';
const tex = (s, w, h) => new Promise(r => { const im = new Image(); im.onload = () => { const sc = Math.min(1, 2048 / Math.max(w, h)), cv = document.createElement('canvas'); cv.width = w * sc; cv.height = h * sc; cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; r(t); }; im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); });
const M = c => new THREE.MeshLambertMaterial({ color: c });
function box(sc, w, h, d, x, y, z, mat, rx = 0, edges = true) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.rotation.x = rx; sc.add(m);
  if (edges) { const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: INK })); e.position.copy(m.position); e.rotation.copy(m.rotation); sc.add(e); } return m; }
function cyl(sc, r, h, x, y, z, mat, rotZ = 0, rotX = 0, seg = 28) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat); m.position.set(x, y, z); m.rotation.z = rotZ; m.rotation.x = rotX; sc.add(m); return m; }
function glass(sc, pts, op = .16) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts.flat(), 3)); g.setIndex([0, 1, 2, 0, 2, 3]); g.computeVertexNormals();
  sc.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: '#cfe8ff', transparent: true, opacity: op, side: THREE.DoubleSide, depthWrite: false }))); const l = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(...p))), new THREE.LineBasicMaterial({ color: INK })); sc.add(l); }
function ground(sc, col1, col2, y = 0, sz = 30) { const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d'); for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? col1 : col2; g.fillRect(i * 32, j * 32, 32, 32); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(sz / 2, sz / 2); const m = new THREE.Mesh(new THREE.PlaneGeometry(sz, sz), new THREE.MeshLambertMaterial({ map: t })); m.rotation.x = -Math.PI / 2; m.position.y = y; sc.add(m); }
function wheel(sc, w) { const g = new THREE.Group(); const t = new THREE.Mesh(new THREE.TorusGeometry(w.R, w.R * .11, 12, 48), M('#2b2b30')); g.add(t);
  for (const a of [0, 2.1, 4.2]) { const s = new THREE.Mesh(new THREE.BoxGeometry(w.R * .95, w.R * .1, w.R * .06), M('#3a3a40')); s.rotation.z = a + Math.PI / 2; s.position.set(Math.cos(a - Math.PI / 2) * w.R * .45, Math.sin(a - Math.PI / 2) * w.R * .45, 0); g.add(s); }
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(w.R * .22, w.R * .22, w.R * .12, 20).rotateX(Math.PI / 2), M('#55555c')));
  g.position.set(...w.c); g.rotation.x = -(w.tilt * Math.PI / 180); sc.add(g);
  const p0 = new THREE.Vector3(...w.c), p1 = p0.clone().add(new THREE.Vector3(0, -Math.cos(w.tilt * Math.PI / 180) * .5, Math.sin(w.tilt * Math.PI / 180) * .5).multiplyScalar(-1).multiplyScalar(-1));   // the column runs from the hub away from the driver, into the dash
  const dv = new THREE.Vector3(0, -Math.sin(w.tilt * Math.PI / 180), Math.cos(w.tilt * Math.PI / 180)).multiplyScalar(.45), q1 = p0.clone().add(dv);
  sc.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(p0, q1), 4, .03, 10), M('#3a3a40'))); }
function seat(sc, fx, colA, colB) { const s = fx.seat, w = s.x[1] - s.x[0], d = s.z1 - s.z0 + .04; box(sc, w, .1, d, 0, s.h - .05, (s.z0 + s.z1) / 2 + .02, M(colA));
  box(sc, w * .9, s.h - .1, d * .8, 0, (s.h - .1) / 2, (s.z0 + s.z1) / 2, M(colB));
  if (fx.back) { const r = fx.back.recline * Math.PI / 180, h = fx.back.h; const m = box(sc, w, h, .1, 0, s.h + Math.cos(r) * h / 2, s.z0 - Math.sin(r) * h / 2 - .02, M(colA), -r); } }
const SETS = {
  car(sc, fx) { sc.background = new THREE.Color('#bfe0f7'); ground(sc, '#7d8a96', '#86939e', -.32);
    const body = M('#d9453b'), dark = M('#2c2f36'), cx = -.36, x0 = cx - .82, x1 = cx + .82, zF = 2.0, zB = -1.25, wl = fx.windowLow, roof = fx.roof, zw = fx.wheel.c[2] + .22;
    box(sc, x1 - x0, wl + .32 - .05, zF - zB, cx, (wl - .32 - .05) / 2 + .0, (zF + zB) / 2, body);            // lower body
    box(sc, x1 - x0 - .02, .06, zF - zw - .55, cx, wl - .05, (zF + zw + .55) / 2, body);                          // bonnet top
    box(sc, x1 - x0, .06, (zw + .1) - (zB + .25), cx, roof + .03, ((zw + .1) + (zB + .25)) / 2, body);             // roof
    for (const x of [x0 + .03, x1 - .03]) { box(sc, .06, roof - wl + .06, .07, x, (roof + wl) / 2, zw + .35, body); box(sc, .06, roof - wl + .06, .07, x, (roof + wl) / 2, zB + .28, body); box(sc, .05, roof - wl, .05, x, (roof + wl) / 2, (zw + zB) / 2 - .05, body); }
    glass(sc, [[x0 + .03, wl, zw + .52], [x1 - .03, wl, zw + .52], [x1 - .03, roof, zw + .1], [x0 + .03, roof, zw + .1]]);   // windscreen
    for (const x of [x0 + .01, x1 - .01]) glass(sc, [[x, wl, zB + .3], [x, wl, zw + .48], [x, roof, zw + .12], [x, roof, zB + .3]], .1);   // side windows
    box(sc, x1 - x0 - .1, .22, .35, cx, wl - .1, zw + .1, dark);                                                   // dashboard
    for (const z of [zF - .45, zB + .35]) for (const x of [x0 - .02, x1 + .02]) cyl(sc, .3, .2, x, -.02, z, M('#1d1d22'), Math.PI / 2);
    for (const x of [x0 + .2, x1 - .2]) { box(sc, .3, .1, .04, x, wl - .22, zF + .01, M('#fff6c8'), 0, true); box(sc, .22, .08, .04, x, wl - .25, zB - .01, M('#ff4b3e')); }
    seat(sc, fx, '#3c3f4a', '#2a2c33'); wheel(sc, fx.wheel); for (const f of fx.feet) if (f.kind === 'pedal') box(sc, .08, .02, .1, f.p[0], f.p[1], f.p[2], M('#555'), -.5); },
  bus(sc, fx) { sc.background = new THREE.Color('#bfe0f7'); ground(sc, '#7d8a96', '#86939e', -.4);
    const body = M('#2f9e6a'), cx = .9, x0 = -.55, x1 = 2.35, zF = 1.15, zB = -4, wl = fx.windowLow, roof = fx.roof;
    box(sc, x1 - x0, wl + .4, zF - zB, cx, (wl - .4) / 2, (zF + zB) / 2, body); box(sc, x1 - x0, .12, zF - zB, cx, roof + .06, (zF + zB) / 2, M('#f2f2ee'));
    for (const x of [x0, x1]) { box(sc, .06, roof - wl, .08, x, (roof + wl) / 2, zF - .02, body); box(sc, .06, roof - wl, .08, x, (roof + wl) / 2, -.75, body); }
    glass(sc, [[x0, wl, zF], [x1, wl, zF], [x1, roof, zF - .05], [x0, roof, zF - .05]], .12); glass(sc, [[x0 - .01, wl, -.73], [x0 - .01, wl, zF], [x0 - .01, roof, zF], [x0 - .01, roof, -.73]], .1);
    box(sc, x1 - x0 - .1, .3, .3, cx, wl - .1, zF - .2, M('#2c2f36')); for (const z of [zF - .7]) cyl(sc, .4, .3, x0 - .05, 0, z, M('#1d1d22'), Math.PI / 2);
    box(sc, .5, .1, .04, x0 + .4, wl - .3, zF + .01, M('#fff6c8')); seat(sc, fx, '#24364f', '#1b2433'); wheel(sc, fx.wheel); for (const f of fx.feet) if (f.kind === 'pedal') box(sc, .09, .02, .12, f.p[0], f.p[1], f.p[2], M('#555'), -.5); },
  chair(sc, fx) { sc.background = new THREE.Color('#a7c4dc'); ground(sc, '#c99a63', '#bf8f58');
    box(sc, 12, 4, .1, 0, 2, -1.5, M('#7fa7c9'), 0, false); seat(sc, fx, '#8a5a3a', '#73492e');
    for (const x of [-.18, .18]) for (const z of [fx.seat.z0 + .03, fx.seat.z1 - .05]) box(sc, .04, fx.seat.h - .1, .04, x, (fx.seat.h - .1) / 2, z, M('#6b4429'));
    const d = fx.desk; box(sc, d.w, .05, d.z1 - d.z0, 0, d.h - .025, (d.z0 + d.z1) / 2, M('#a8743f')); for (const x of [-d.w / 2 + .05, d.w / 2 - .05]) for (const z of [d.z0 + .05, d.z1 - .05]) box(sc, .05, d.h - .05, .05, x, (d.h - .05) / 2, z, M('#8a5a3a'));
    box(sc, .3, .004, .22, .02, d.h + .003, d.z0 + .2, M('#f7f3e8'), 0, true); box(sc, .03, .03, .5, -.25, d.h + .1, d.z0 + .5, M('#d9453b')); },
  bed(sc, fx) { sc.background = new THREE.Color('#cfe3f2'); ground(sc, '#d8ccb0', '#cbbd9e');
    const wood = new THREE.MeshLambertMaterial({ color: '#8a5a3a' }), sheet = new THREE.MeshLambertMaterial({ color: '#f4f1ea' }); box(sc, 2.3, .3, 1.2, 0, .15, 0, wood); box(sc, 2.2, .2, 1.1, 0, fx.top - .1, 0, sheet); box(sc, .08, 1.0, 1.2, -1.19, .5, 0, wood);
    const p = fx.pillowBox; box(sc, p.x1 - p.x0, p.h, .7, (p.x0 + p.x1) / 2, fx.top + p.h / 2, 0, new THREE.MeshLambertMaterial({ color: '#dfe8f5' })); },
};
window.shoot = async (D) => {
  const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight('#ffffff', '#9a8a76', 2.2)); const dl = new THREE.DirectionalLight('#ffffff', 1.2); dl.position.set(-2, 4, 3); sc.add(dl);
  SETS[D.set](sc, D.fx);
  const ink = new THREE.MeshBasicMaterial({ color: INK });
  for (const t of D.tubes) { const c = new THREE.CatmullRomCurve3(t.pts.map(p => new THREE.Vector3(...p)), false, 'centripetal', .35); sc.add(new THREE.Mesh(new THREE.TubeGeometry(c, 64, t.r, 10, false), ink)); const s0 = new THREE.Mesh(new THREE.SphereGeometry(t.r, 12, 8), ink); s0.position.copy(c.getPoint(0)); sc.add(s0); }
  for (const b of D.balls) { const s = new THREE.Mesh(new THREE.SphereGeometry(b.r, 20, 14), ink); s.position.set(...b.p); sc.add(s); }
  for (const C of D.cards) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: await tex(C.svg, C.w, C.h), transparent: true, alphaTest: .4, side: THREE.DoubleSide }));
    m.matrixAutoUpdate = false; const mx = new THREE.Matrix4().makeBasis(new THREE.Vector3(...C.ex), new THREE.Vector3(...C.ey), new THREE.Vector3(...C.n)); mx.scale(new THREE.Vector3(C.sx, C.sy, 1)); mx.setPosition(...C.ctr); m.matrix.copy(mx); m.renderOrder = 1; sc.add(m); }
  const cam = new THREE.PerspectiveCamera(34, ${W} / ${H}, .05, 200); cam.position.set(...D.cam); cam.lookAt(...D.look); cam.updateMatrixWorld(true);
  R.render(sc, cam); return R.domElement.toDataURL('image/png');
};
window.ready = true;</script></body></html>`;

const srv = http.createServer((q, s) => { const u = q.url.split('?')[0]; if (u === '/') { s.writeHead(200, { 'content-type': 'text/html' }); return s.end(html); }
  if (u.startsWith('/three/')) { const f = path.join(THREE_DIR, path.basename(u)); if (fs.existsSync(f)) { s.writeHead(200, { 'content-type': 'text/javascript' }); return fs.createReadStream(f).pipe(s); } }
  s.writeHead(404); s.end(); }).listen(0);
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }), pg = await b.newPage({ viewport: { width: W, height: H } });
pg.on('pageerror', e => console.log('ERR', e.message)); pg.on('console', m => { if (m.type() === 'error') console.log('console', m.text()); });
await pg.goto(`http://localhost:${srv.address().port}/`); await pg.waitForFunction('window.ready');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const stCol = s => s === 'OK' ? '#1f7a3a' : '#b3261e';
const repHtml = rows => rows.map(r => `<div style="color:${stCol(r.status)}">${r.status === 'OK' ? '✓' : '✗ ' + r.status} · ${esc(r.contact)}${r.gap_cm ? ' (' + r.gap_cm + ' cm)' : ''}</div>`).join('');
let html2 = '', y = 10; const PW = 330, PH = Math.round(PW * H / W), GAP = 8, COLX = [150, 150 + PW + GAP, 150 + 2 * (PW + GAP) + 24, 150 + 3 * (PW + GAP) + 24];
html2 += `<div style="position:absolute;left:${COLX[0]}px;top:${y}px;width:${2 * PW + GAP}px;text-align:center;font:800 26px sans-serif;color:#b3261e">BEFORE · the kit today</div><div style="position:absolute;left:${COLX[2]}px;top:${y}px;width:${2 * PW + GAP}px;text-align:center;font:800 26px sans-serif;color:#1f7a3a">AFTER · body rig, every joint from the contacts</div>`; y += 42;
const fs2 = fs; const reports = {};
for (const S of SC) {
  const panels = [];
  for (const [lab, cam, look] of S.cams) {
    const bef = S.before ? S.before(cam) : null, aft = S.after(cam);
    const fxB = S.beforeFx || S.fx;
    const shot = async (R0, fx) => { const fxx = { ...fx }; if (S.set === 'bed') fxx.pillowBox = { x0: -1.14, x1: fx.hipX - (sk.seatToShoulder - sk.hipUp) * .78, h: fx.pillow.h };
      return pg.evaluate(D => window.shoot(D), { set: S.set, fx: fxx, tubes: R0.tubes, balls: R0.balls, cards: [R0.card], cam, look }); };
    panels.push({ lab, bef: bef ? await shot(bef, fxB) : null, aft: await shot(aft, S.fx), befR: bef, aftR: aft });
  }
  // reports
  const after = S.sol ? S.sol.report : panels[0].aftR.sol.report;
  let before;
  if (S.key === 'car' || S.key === 'bus') { const g = handGap(panels[0].befR.hands, S.fx.hands);
    before = [B.scaleCheck(1.7, S.drawnBefore, 'driver'), { contact: 'body above the seat (lifted so the head shows in the window)', gap_cm: Math.round(panels[0].befR.lift * 100), status: 'FLOAT' }, { contact: 'hands on the wheel', gap_cm: Math.max(...g), status: Math.max(...g) > 1.5 ? 'FLOAT' : 'OK' }, { contact: 'right foot on the pedal', gap_cm: 0, status: 'NOT SOLVED', note: 'fixed leg shape' }, { contact: 'checks', gap_cm: 0, status: 'SKIPPED', note: 'in_vehicle: true' }]; }
  else if (S.key === 'chair') { const g = handGap(panels[0].befR.hands, S.fx.hands); before = [{ contact: 'hands on the desk', gap_cm: Math.max(...g), status: 'FLOAT' }, { contact: 'seat height fixed at 0.30 m', gap_cm: 0, status: 'FIXED', note: '' }, { contact: 'legs: one fixed shape', gap_cm: 0, status: 'FIXED' }]; }
  else before = [{ contact: 'hips and legs off the mattress (body tilted 14 deg)', gap_cm: 0, status: 'TILT' }, { contact: 'neck: none, the whole body turns', gap_cm: 0, status: 'FIXED' }];
  reports[S.key] = { before, after, fixture: S.fx };
  html2 += `<div style="position:absolute;left:10px;top:${y + 4}px;width:130px;font:800 20px sans-serif;color:#1d2f6f">${S.title}</div>`;
  html2 += `<div style="position:absolute;left:10px;top:${y + 96}px;width:132px;font:12px sans-serif;color:#333">${esc(S.beforeNote)}</div>`;
  panels.forEach((p, i) => {
    const xb = COLX[i], xa = COLX[2 + i];
    html2 += `<div style="position:absolute;left:${xb}px;top:${y}px;width:${PW}px;font:bold 13px sans-serif;color:#1d2f6f;text-align:center">${esc(p.lab)}</div>`;
    html2 += `<div style="position:absolute;left:${xa}px;top:${y}px;width:${PW}px;font:bold 13px sans-serif;color:#1d2f6f;text-align:center">${esc(p.lab)}</div>`;
    const bsrc = p.bef || (S.beforeImg && fs2.existsSync(S.beforeImg.replace('%d', i)) ? 'data:image/png;base64,' + fs2.readFileSync(S.beforeImg.replace('%d', i)).toString('base64') : '');
    html2 += `<img style="position:absolute;left:${xb}px;top:${y + 18}px;border:3px solid #b3261e" width="${PW}" height="${PH}" src="${bsrc}">`;
    html2 += `<img style="position:absolute;left:${xa}px;top:${y + 18}px;border:3px solid #1f7a3a" width="${PW}" height="${PH}" src="${p.aft}">`;
  });
  y += PH + 26;
  html2 += `<div style="position:absolute;left:${COLX[0]}px;top:${y}px;width:${2 * PW + GAP}px;font:13px sans-serif;columns:2">${repHtml(before)}</div>`;
  html2 += `<div style="position:absolute;left:${COLX[2]}px;top:${y}px;width:${2 * PW + GAP}px;font:13px sans-serif;columns:2">${repHtml(after)}</div>`;
  y += 22 * Math.ceil(Math.max(before.length, after.length) / 2) + 26;
}
const TW = COLX[3] + PW + 16; await pg.setViewportSize({ width: TW, height: y + 10 });
await pg.setContent(`<html><body style="margin:0;background:#eef1f6;position:relative;height:${y + 10}px">${html2}</body></html>`); await pg.screenshot({ path: OUT, fullPage: true });
fs.writeFileSync(OUT.replace(/\.png$/, '.json'), JSON.stringify(reports, null, 1));
await b.close(); srv.close(); console.log('ok', OUT);

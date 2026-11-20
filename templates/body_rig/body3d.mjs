// BODY RIG 3D (2026-11-17, CB: "we still have issue with position natural ... it need to be something that you have control all over the character body").
// One full-body skeleton per character, in METRES, solved from CONTACTS on the set (seat, back rest, pedals, wheel, floor, desk, mattress, pillow).
// Before this every sit, drive and lie was its own hand-made pose with fixed numbers (sit_chair SEAT_M 0.30, drivers drawn at 0.36 of their height,
// the bed card tilted 14 deg to reach the pillow). Now:
//   1 skeleton(ch, H)   reads the locked puppet's own drawing (body top/bottom, shoulders, head, arm length) and gives every joint length in metres.
//   2 solveSit / solveLie place every joint from the contacts: pelvis on the seat, spine against the back rest, two-bone IK for each leg and arm
//                       (fixed lengths, knee and elbow limits, bend direction), neck and head tilt so the head rests where it should.
//   3 fit              the rider keeps his cast height; the set is built from the rider (cabin.car / bus / chair / bed give the numbers),
//                       or an existing set is measured and must be within 12 % of the rider (never a 0.36 driver).
//   4 report           every contact with its gap in cm: OK, FLOAT, SUNK, STRETCH (cannot reach), CRAMP (joint past its limit), HEAD_CLIP (head in the roof),
//                       SCALE (rider drawn at another size than his cast height, or a set built for another size).
// Character frame: x = to his LEFT, y = up, z = where he faces. Origin = the floor point under the middle of his hips (seated: under the seat contact).
// Nothing in the locked package (templates/vector2d_characters) is changed; the card still draws body, head and arms in the approved look,
// the legs are the approved 3D ink tubes (LOCKED 2026-11-16 floor sit), now with solved joints instead of fixed points.

export const V = { add: (a, b) => a.map((v, i) => v + b[i]), sub: (a, b) => a.map((v, i) => v - b[i]), mul: (a, s) => a.map(v => v * s), dot: (a, b) => a.reduce((s, v, i) => s + v * b[i], 0),
  len: a => Math.hypot(...a), norm: a => { const l = Math.hypot(...a) || 1; return a.map(v => v / l); }, cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  lerp: (a, b, u) => a.map((v, i) => v + (b[i] - v) * u) };
const D2R = Math.PI / 180, cm = m => +(m * 100).toFixed(1);

// 3D LEG LENGTHS: the approved seated 3D legs (sit_chair.mjs legs3d, CB 2026-11-16 "looks not natural" on 0.8 m legs) are thigh 0.25, shin 0.28,
// foot 0.09 on a 1.7 m character. Kept as shares of the height so every size and scale keeps the approved look.
export const LEG3D = { thigh: .25 / 1.7, shin: .28 / 1.7, foot: .09 / 1.7, ankle: .05 / 1.7, r: .02 / 1.7 };
export const LIMITS = { knee: [4, 150], elbow: [8, 150], recline: [-12, 35], neck: [-35, 45] };   // degrees of bend; recline = spine back from vertical

// --- 1 SKELETON from the puppet's own numbers (castkit.buildChar S, or rig.mjs makeChar ch). px = card pixels.
export function skeleton(S, H = 1.7) {
  const K = S.headK ?? S.K ?? 1.5, bodyTop = S.bodyTop ?? 333, bodyBot = S.bodyBot ?? 640, ground = S.ground ?? 900;
  const hy = bodyTop - 100 * K * .78, top = hy - 100 * K, px = ground - top, k = H / px;
  let sh = S.shPx, armPx = S.armPx;
  if (!sh && S.arms) { const a = [].concat(S.arms({ cx: S.x ?? 400, view: 'front', dir: 1, turn: 0 }).front)[0], m = /M\s*([-\d.]+)[ ,]+([-\d.]+)/.exec(a.d);
    sh = [Math.abs(+m[1] - (S.x ?? 400)), +m[2]]; armPx = Math.hypot(a.hand[0] - +m[1], a.hand[1] - +m[2]) * 1.05; }
  if (!sh) { sh = S.sh; armPx = S.armL; }
  return { H, k, px, K, bodyTop, bodyBot, ground, hy, top, shPx: sh, armPx,
    seatToShoulder: (bodyBot - 4 - sh[1]) * k, seatToNeck: (bodyBot - 4 - bodyTop) * k, seatToHeadC: (bodyBot - 4 - hy) * k, seatToHeadTop: (bodyBot - 4 - top) * k,
    headR: 100 * K * k, shoulderW: sh[0] * k * .8, hipW: .075 * H / 1.7, hipUp: .055 * H / 1.7, backDepth: ((S.wBot ?? 104) * .8 / 2) * k,
    upper: armPx * k / 2, fore: armPx * k / 2, thigh: LEG3D.thigh * H, shin: LEG3D.shin * H, foot: LEG3D.foot * H, ankle: LEG3D.ankle * H, legR: LEG3D.r * H };
}

// --- two-bone IK: root, target, lengths, pole (the side the middle joint bends to). Returns the middle joint, the end, the reach gap and the bend.
export function ik2(root, target, L1, L2, pole, lim = [0, 180]) {
  let d = V.sub(target, root), dl = V.len(d); const want = dl, maxR = (L1 + L2) * .999, minR = Math.abs(L1 - L2) + 1e-4;
  const gap = dl > maxR ? dl - maxR : 0; dl = Math.min(maxR, Math.max(minR, dl)); const u = V.norm(d);
  let a = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + dl * dl - L2 * L2) / (2 * L1 * dl))));   // angle at the root between the line and the first bone
  let bend = 180 - Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + L2 * L2 - dl * dl) / (2 * L1 * L2)))) / D2R;   // 0 = straight
  let clamped = null; if (bend > lim[1]) clamped = 'CRAMP'; if (bend < lim[0]) { bend = lim[0]; }
  const p = V.norm(V.sub(pole, V.mul(u, V.dot(pole, u)))), mid = V.add(root, V.add(V.mul(u, L1 * Math.cos(a)), V.mul(p, L1 * Math.sin(a))));
  const end = V.add(mid, V.mul(V.norm(V.sub(V.add(root, V.mul(u, dl)), mid)), L2));
  return { mid, end, gap, bend: +bend.toFixed(1), want, clamped };
}

// --- 2a SOLVE A SEATED BODY (chair, car, bus, bench, stool). fx = fixture in the character frame:
//   seat: { h, z0 (seat back edge), z1 (seat front edge), x: [min, max] }, back: { recline (deg) } or null, roof: y or null,
//   feet: [{ p: [x, y, z], kind: 'pedal'|'floor', toe: deg }, left, right], hands: [{ p }|null, left, right] (null = resting on the thigh),
//   head: { tilt } (deg, + = chin down), pelvisZ (optional, default = seat middle-back)
export function solveSit(sk, fx) {
  const st = fx.seat, rec = Math.max(LIMITS.recline[0], Math.min(LIMITS.recline[1], fx.back ? fx.back.recline ?? 8 : fx.recline ?? 2)) * D2R;
  const pz = fx.pelvisZ ?? (fx.back ? st.z0 + sk.backDepth * .9 + sk.backDepth * Math.sin(rec) : (st.z0 + st.z1) / 2 - .04);
  const seatPt = [0, st.h, pz], up = [0, Math.cos(rec), -Math.sin(rec)];        // spine direction (back rest pushes the top back)
  const J = { seat: seatPt, pelvis: V.add(seatPt, [0, sk.hipUp, 0]) };
  J.neck = V.add(seatPt, V.mul(up, sk.seatToNeck)); J.chest = V.add(seatPt, V.mul(up, sk.seatToShoulder));
  const tilt = (fx.head && fx.head.tilt) || 0, hu = [0, Math.cos(rec + tilt * D2R), -Math.sin(rec + tilt * D2R)];
  J.headC = V.add(J.neck, V.mul(hu, sk.seatToHeadC - sk.seatToNeck)); J.headTop = V.add(J.neck, V.mul(hu, sk.seatToHeadTop - sk.seatToNeck));
  J.backTop = V.add(V.add(seatPt, V.mul(up, sk.seatToShoulder)), [0, 0, -sk.backDepth]);
  const side = ['L', 'R'], sg = [1, -1], out = { J, legs: [], arms: [], rec: rec / D2R, tilt };
  // legs: hip on the seat, the thigh starts along the seat; knee bends forward and up, IK to the foot target
  for (let i = 0; i < 2; i++) {
    const hip = [sg[i] * sk.hipW, st.h + sk.legR + .01, pz + .02], ft = fx.feet[i], toeA = (ft.toe ?? 0) * D2R;   // the knee bends up and forward (never down through the seat)
    const ankle = V.add(ft.p, [0, sk.ankle * Math.cos(toeA), -sk.ankle * Math.sin(toeA) * .5]);
    const r = ik2(hip, ankle, sk.thigh, sk.shin, [0, 1, .35], LIMITS.knee), fd = [0, Math.sin(toeA), Math.cos(toeA)], toe = V.add(r.end, V.mul(fd, sk.foot));
    J['hip' + side[i]] = hip; J['knee' + side[i]] = r.mid; J['ankle' + side[i]] = r.end; J['toe' + side[i]] = toe;
    out.legs.push({ side: side[i], ...r, target: ft.p, kind: ft.kind || 'floor' });
  }
  // arms: shoulders on the spine, IK to the hand target; elbows bend down and out; a free hand rests on the thigh
  for (let i = 0; i < 2; i++) {
    const shp = V.add(J.chest, [sg[i] * sk.shoulderW, 0, 0]), knee = J['knee' + side[i]], hip = J['hip' + side[i]];
    const h = fx.hands[i], tgt = h ? h.p : V.add(V.lerp(hip, knee, .55), [sg[i] * .02, sk.legR + .03, 0]);
    const r = ik2(shp, tgt, sk.upper, sk.fore, [sg[i] * .7, -1, -.2], LIMITS.elbow);
    J['shoulder' + side[i]] = shp; J['elbow' + side[i]] = r.mid; J['hand' + side[i]] = r.end;
    out.arms.push({ side: side[i], ...r, target: tgt, kind: h ? h.kind || 'grip' : 'lap' });
  }
  out.report = reportSit(sk, fx, out); return out;
}

// --- 2b SOLVE A LYING BODY (bed, couch, floor, stretcher). fx: { top (mattress top y), pillow: { h (height above top), x0, x1 (along the body) } | null,
//   axis: 1|-1 (head toward -x of the bed frame: the body line runs along x), hipX, knees: 'flat'|'up', on: 'back'|'belly' }
// The body line lies FLAT on the mattress (no whole-body tilt); the NECK bends so the head rests on the pillow (old bed v8: the card tilted 14 deg).
export function solveLie(sk, fx) {
  // The cartoon head is much deeper than the body (side view: head radius 0.29 m on a 0.12 m half-body), so lying flat its back would sink 15 cm into the
  // mattress. Rick props the upper body on the pillow: HIPS on the mattress, SHOULDERS on the pillow (the spine bends at the hips, the legs stay flat),
  // and the NECK lifts the head until it rests on the pillow top. Old bed v8 tilted the whole card 14 deg instead (hips and legs off the mattress).
  const top = fx.top, hipX = fx.hipX ?? .2, ph = fx.pillow ? fx.pillow.h : 0, Ls = sk.seatToShoulder - sk.hipUp, Ln = sk.seatToNeck - sk.hipUp, hl = sk.seatToHeadC - sk.seatToNeck;
  const sp = Math.asin(Math.max(0, Math.min(.6, ph / Ls)));                   // spine lift so the shoulder blades lie on the pillow
  const pel = [hipX, top + sk.backDepth, 0], ax = [-Math.cos(sp), Math.sin(sp), 0];   // body line from the hips toward the head (-x), lifted by sp
  const J = { pelvis: pel, chest: V.add(pel, V.mul(ax, Ls)), neck: V.add(pel, V.mul(ax, Ln)) };
  let best = 0, err = 1e9, headLow = 0;
  for (let a = LIMITS.neck[0]; a <= LIMITS.neck[1]; a += .25) { const t = sp + a * D2R, c = V.add(J.neck, [-hl * Math.cos(t), hl * Math.sin(t), 0]), low = c[1] - sk.headR * .92 - (top + ph);
    if (Math.abs(low) < err) { err = Math.abs(low); best = a; headLow = low; } }
  const t = sp + best * D2R; J.headC = V.add(J.neck, [-hl * Math.cos(t), hl * Math.sin(t), 0]); J.headTop = V.add(J.headC, [-sk.headR * Math.cos(t), sk.headR * Math.sin(t), 0]);
  const out = { J, legs: [], arms: [], spine: sp / D2R, neck: best, headGap: err, headLow };
  const sg = [1, -1], side = ['L', 'R'];
  for (let i = 0; i < 2; i++) {
    const z = sg[i] * sk.hipW, hip = [hipX, top + sk.legR + .01, z], up = fx.knees === 'up' && i === 0;
    const heel = up ? [hipX + (sk.thigh + sk.shin) * .62, top + sk.ankle, z * 1.3] : [hipX + (sk.thigh + sk.shin) * .985, top + sk.legR + .005, z * 1.25];
    const r = ik2(hip, heel, sk.thigh, sk.shin, [0, 1, 0], [0, 150]), toe = V.add(r.end, up ? [sk.foot, -sk.ankle * .6, 0] : [sk.foot * .25, sk.foot * .9, 0]);
    J['hip' + side[i]] = hip; J['knee' + side[i]] = r.mid; J['ankle' + side[i]] = r.end; J['toe' + side[i]] = toe;
    out.legs.push({ side: side[i], ...r, target: heel, kind: 'mattress' });
  }
  out.report = reportLie(sk, fx, out); return out;
}

// --- 3 SETS BUILT FROM THE RIDER. The numbers a set builder needs (character frame, metres). Every vehicle and chair is sized to the cast's height:
// Rick's drivers fill the window (head just under the roof), so the cabin follows the rider, never the rider the cabin.
export const cabin = {
  car(sk, o = {}) {   // hatchback / sedan driver: low seat, legs forward to the pedals, wheel at a bent-elbow reach, 12 deg recline
    const seat = { h: o.seatH ?? .28 * sk.H / 1.7, z0: -.30 * sk.H / 1.7, z1: .18 * sk.H / 1.7, x: [-.26, .26].map(v => v * sk.H / 1.7) }, rec = o.recline ?? 14;
    const fx = { kind: 'car', seat, back: { recline: rec, h: .62 * sk.H / 1.7 }, feet: [], hands: [] };
    const tmp = solveSit(sk, { ...fx, feet: [{ p: [0, 0, .4] }, { p: [0, 0, .4] }], hands: [null, null] }), hipY = st0 => st0 + sk.legR + .01;
    // pedals at 88 % of the leg reach, forward and a little up from the cabin floor; the left foot rests flat on the floor
    const reach = (sk.thigh + sk.shin) * .88, py = .10 * sk.H / 1.7, dz = Math.sqrt(Math.max(.01, reach * reach - (hipY(seat.h) - py - sk.ankle) ** 2));
    const dzF = Math.sqrt(Math.max(.01, reach * reach - (hipY(seat.h) - sk.ankle) ** 2)) * .97;   // the resting foot flat on the floor, same reach
    fx.feet = [{ p: [sk.hipW * 1.3, 0, tmp.J.pelvis[2] + dzF], kind: 'floor', toe: 8 }, { p: [-sk.hipW * 1.1, py, tmp.J.pelvis[2] + dz], kind: 'pedal', toe: 38 }];
    seat.z1 = tmp.J.pelvis[2] + sk.thigh * .75;   // the seat ends just behind the knee
    // wheel: centre in front of the chest at 80 % of the arm reach, tilted 25 deg back from vertical; hands at ten and two
    const R = o.wheelR ?? .17 * sk.H / 1.7, tiltW = (o.wheelTilt ?? 28) * D2R, ch = tmp.J.chest, armR = (sk.upper + sk.fore) * .80;
    const c = [0, ch[1] - .16 * sk.H / 1.7, ch[2] + Math.sqrt(Math.max(.02, armR * armR - .16 ** 2 - (R * .8) ** 2))];
    fx.wheel = { c, R, tilt: tiltW / D2R }; fx.hands = [rim(c, R, tiltW, 300), rim(c, R, tiltW, 60)].map(p => ({ p, kind: 'wheel' }));
    fx.roof = tmp.J.headTop[1] + (o.headroom ?? .05) * sk.H / 1.7; fx.windowLow = c[1] - R * .45;   // the wheel and the fists show through the windscreen   // head inside the window band, roof just over the head (Rick)
    return fx;
  },
  bus(sk, o = {}) {   // bus / truck driver: high seat, upright, big flat wheel low in front of the belly, feet flat
    const seat = { h: o.seatH ?? .36 * sk.H / 1.7, z0: -.32 * sk.H / 1.7, z1: .2 * sk.H / 1.7, x: [-.3, .3].map(v => v * sk.H / 1.7) };
    const fx = { kind: 'bus', seat, back: { recline: o.recline ?? 4, h: .7 * sk.H / 1.7 }, feet: [], hands: [] };
    const tmp = solveSit(sk, { ...fx, feet: [{ p: [0, 0, .3] }, { p: [0, 0, .3] }], hands: [null, null] });
    const fz = tmp.J.pelvis[2] + (sk.thigh + sk.shin) * .55; seat.z1 = tmp.J.pelvis[2] + sk.thigh * .75;
    fx.feet = [{ p: [sk.hipW * 1.3, 0, fz], kind: 'floor', toe: 5 }, { p: [-sk.hipW * 1.2, .06 * sk.H / 1.7, fz + .06], kind: 'pedal', toe: 30 }];
    const R = o.wheelR ?? .26 * sk.H / 1.7, tiltW = (o.wheelTilt ?? 62) * D2R, ch = tmp.J.chest, armR = (sk.upper + sk.fore) * .82, dy = Math.min(.30 * sk.H / 1.7, armR * .62), dx = Math.max(0, R * .94 - sk.shoulderW);
    const c = [0, ch[1] - dy, ch[2] + Math.sqrt(Math.max(.01, armR * armR - dy * dy - dx * dx)) - R * .34 * Math.cos(tiltW)];   // the big flat wheel at a bent-elbow reach for THIS rider's arms
    fx.wheel = { c, R, tilt: tiltW / D2R }; fx.hands = [rim(c, R, tiltW, 290), rim(c, R, tiltW, 70)].map(p => ({ p, kind: 'wheel' }));
    fx.roof = tmp.J.headTop[1] + .35 * sk.H / 1.7; fx.windowLow = c[1] - .12 * sk.H / 1.7; return fx;
  },
  chair(sk, o = {}) {  // dining / desk chair: seat at the rider's knee height, knees 90 deg, feet flat, hands on the desk (o.desk) or on the thighs
    const kneeH = sk.shin + sk.ankle * .2, seat = { h: o.seatH ?? kneeH - sk.legR, z0: -.2 * sk.H / 1.7, z1: .2 * sk.H / 1.7, x: [-.21, .21].map(v => v * sk.H / 1.7) };
    const fx = { kind: 'chair', seat, back: { recline: o.recline ?? 6, h: .45 * sk.H / 1.7 }, feet: [], hands: [null, null] };
    const tmp = solveSit(sk, { ...fx, feet: [{ p: [0, 0, .3] }, { p: [0, 0, .3] }] }), fz = tmp.J.pelvis[2] + sk.thigh * .98; seat.z1 = tmp.J.pelvis[2] + sk.thigh * .75;
    fx.feet = [{ p: [sk.hipW * 1.4, 0, fz], kind: 'floor', toe: 0 }, { p: [-sk.hipW * 1.4, 0, fz], kind: 'floor', toe: 0 }];
    if (o.desk) { const ch = tmp.J.chest, armR = (sk.upper + sk.fore) * .85, dh = o.desk.h ?? ch[1] - Math.min(.30 * sk.H / 1.7, armR * .7), dz = o.desk.z ?? Math.min(tmp.J.pelvis[2] + .26 * sk.H / 1.7, ch[2] + Math.sqrt(Math.max(.01, armR * armR - (ch[1] - dh) ** 2)) - .16);
      fx.desk = { h: dh, z0: dz - .06, z1: dz + .7, w: 1.1 * sk.H / 1.7 }; fx.hands = [[.10, dh + .02, dz + .14], [-.13, dh + .02, dz + .1]].map(p => ({ p, kind: 'desk' })); }
    return fx;
  },
  bed(sk, o = {}) {    // bed: mattress top, a pillow under the head that the neck can reach, the body line flat on the mattress
    // the cartoon head is deeper than the body: lying flat, its back hangs (headR - backDepth) below the body line, so the pillow is as high as the
    // neck needs at a calm 12 deg lift. (Old bed v8: a fixed 9 cm pillow, then the WHOLE body tilted to reach it.)
    return { kind: 'bed', top: o.top ?? .5, pillow: { h: o.pillowH ?? .11 * sk.H / 1.7, len: .62 * sk.H / 1.7 }, hipX: o.hipX ?? .2, knees: o.knees ?? 'up', on: 'back' };
  },
};
// a point on a wheel rim: centre c, radius R, tilted back by tilt from vertical, clock angle in degrees (0 = top, 90 = his right ... seen from him)
export function rim(c, R, tilt, clock) { const a = clock * D2R, lx = -Math.sin(a) * R, ly = Math.cos(a) * R;   // + x = his left
  return [c[0] + lx, c[1] + ly * Math.sin(tilt), c[2] - ly * Math.cos(tilt)]; }

// real-world sizes, so a set built at real size can be checked against the rider it holds
export const REAL = { car: { seatToRoof: .95, seatH: .27 }, bus: { seatToRoof: 1.25, seatH: .45 }, chair: { seatH: .45 }, bed: { top: .5 } };

// --- 4 REPORT. Gaps in cm. OK <= 1.5 cm. Every line: { contact, gap_cm, status, note }.
const TOL = .015;
function line(contact, gap, ok, bad, note = '') { const g = cm(gap); return { contact, gap_cm: g, status: Math.abs(gap) <= TOL ? 'OK' : (gap > 0 ? ok : bad), note }; }
function reportSit(sk, fx, s) {
  const R = [], J = s.J;
  R.push({ contact: 'seat', gap_cm: 0, status: 'OK', note: 'body bottom on the seat top' });
  if (fx.back) R.push({ contact: 'back rest', gap_cm: 0, status: 'OK', note: `spine ${s.rec.toFixed(0)} deg back, against the rest` });
  for (const L of s.legs) { const gv = L.gap ? L.gap : V.len(V.sub(L.end, V.add(L.target, [0, 0, 0]))) - sk.ankle;
    R.push(L.gap > TOL ? { contact: `${L.side} foot on the ${L.kind}`, gap_cm: cm(L.gap), status: 'STRETCH', note: 'leg too short for this target: FLOATING foot' }
      : L.clamped ? { contact: `${L.side} knee`, gap_cm: 0, status: 'CRAMP', note: `knee bent ${L.bend} deg (limit ${LIMITS.knee[1]})` }
      : { contact: `${L.side} foot on the ${L.kind}`, gap_cm: 0, status: 'OK', note: `knee ${L.bend} deg` });
    if (L.mid[1] < fx.seat.h - .005 && L.mid[2] < fx.seat.z1) R.push({ contact: `${L.side} thigh`, gap_cm: cm(L.mid[1] - fx.seat.h), status: 'SUNK', note: 'knee inside the seat' }); }
  for (const A of s.arms) R.push(A.gap > TOL ? { contact: `${A.side} hand on the ${A.kind}`, gap_cm: cm(A.gap), status: 'STRETCH', note: 'arm cannot reach' }
      : A.clamped ? { contact: `${A.side} elbow`, gap_cm: 0, status: 'CRAMP', note: `elbow ${A.bend} deg` } : { contact: `${A.side} hand on the ${A.kind}`, gap_cm: 0, status: 'OK', note: `elbow ${A.bend} deg` });
  if (fx.roof != null) { const g = fx.roof - J.headTop[1]; R.push({ contact: 'head under the roof', gap_cm: cm(g), status: g < 0 ? 'HEAD_CLIP' : 'OK', note: g < 0 ? 'head through the roof: build the cabin from cabin.' + (fx.kind || 'car') : `${cm(g)} cm head room` }); }
  return R;
}
function reportLie(sk, fx, s) {
  return [{ contact: 'hips on the mattress', gap_cm: 0, status: 'OK', note: 'hips and legs flat on the mattress' }, { contact: 'shoulders on the pillow', gap_cm: 0, status: 'OK', note: `spine bends ${s.spine.toFixed(1)} deg at the hips` },
    { contact: 'head on the pillow', gap_cm: cm(s.headLow), status: Math.abs(s.headLow) <= TOL ? 'OK' : s.headLow > 0 ? 'FLOAT' : 'SUNK', note: `neck ${s.neck.toFixed(1)} deg` + (Math.abs(s.headLow) > TOL ? ' (at its limit): change the pillow height' : '') },
    ...s.legs.map(L => ({ contact: `${L.side} heel on the mattress`, gap_cm: cm(L.gap), status: L.gap > TOL ? 'STRETCH' : 'OK', note: `knee ${L.bend} deg` }))];
}
// SCALE check: the card must be drawn at the cast height (film.json cast "height", default 1.7). drawnH = the height the film draws him at.
export function scaleCheck(castH, drawnH, who = '') { const r = drawnH / castH;
  return { contact: `${who} drawn size`, gap_cm: cm(drawnH - castH), status: r < .88 || r > 1.12 ? 'SCALE' : 'OK', note: `${(r * 100).toFixed(0)} % of the cast height` + (r < .88 ? ': shrunk to fit a set, build the set from the rider instead' : '') }; }
// a set built elsewhere (real size): how big must it be for this rider?
export function setFit(sk, kind, setNums) { const need = cabin[kind] ? cabin[kind](sk) : null; if (!need) return null;
  if (kind === 'car' || kind === 'bus') { const needH = need.roof - need.seat.h, r = setNums.seatToRoof / needH; return { kind, need_seat_to_roof: +needH.toFixed(3), set_seat_to_roof: setNums.seatToRoof, set_scale_needed: +(1 / r).toFixed(2), status: r < .95 ? 'SCALE' : 'OK', note: r < .95 ? `build the ${kind} at ${(1 / r).toFixed(2)} x real size (Rick: the vehicle fits its rider)` : 'fits' }; }
  if (kind === 'chair') { const r = setNums.seatH / need.seat.h; return { kind, need_seat_h: +need.seat.h.toFixed(3), set_seat_h: setNums.seatH, status: Math.abs(r - 1) > .12 ? 'SCALE' : 'OK', note: r > 1.12 ? 'feet cannot reach the floor: build the chair at the rider knee height' : r < .88 ? 'seat too low: knees above the hips' : 'fits' }; }
  return null;
}
export const worst = rep => rep.some(r => !['OK'].includes(r.status)) ? 'FAIL' : 'PASS';

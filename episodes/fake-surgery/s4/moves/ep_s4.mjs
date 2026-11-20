// EPISODE MOVES, fake-surgery S4 (film 42.70-56.10 s = frames 1281-1683, plan rows 31-39), S4 stretch builder 2026-11-16.
// STUDIO MOTION form (./studio_ep.mjs: Rick's snap 5/16/31/48/66 %, settle, DEAD STILL in holds), drawn new on every frame (tween.ones).
// Every move's frame 0 = the frame of its film.json act (t from the act). Written facing +x (dir 1); act dir -1 mirrors.
// Rig units: y down, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX, ch.hipY. hands[0] = far / held3d 'L', hands[1] = near / held3d 'R'.
import { snap, tr, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000, PI = Math.PI;
export const N = 200;

// ---- PATIENT m:pt_bound (SIDE), row 33 EXTREME "CLIMBING STAIRS again": three springy strides up the flight (film.json moves the card a third of the flight
// per stride, f4 / f13 / f22, 9 f each): crouch 2 f, push and fly 5 f (front knee high, back leg trailing, arms pumping, lean 10), land with a dip;
// after the third: chest out, head up (springy, proud), settle, then DEAD STILL from f52.
export const BOUND = [4, 13, 22];
function ptBound(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  let y = 0, fx = 22, fl = 0, bx = -26, bl = 0, rot = 2, ap = 0;
  for (const s of BOUND) { const g = f - s; if (g < -1 || g > 14) continue;
    const air = snap(g - 2, 3) - snap(g - 6, 3);
    y += 12 * (snap(g, 2) - snap(g - 2, 3)) - 40 * air + dip(f, s + 7, 10, 4);
    fx += 70 * (snap(g - 2, 3) - snap(g - 7, 4)); fl += 72 * air; bx -= 60 * (snap(g - 2, 3) - snap(g - 7, 4)); bl += 34 * (snap(g - 3, 3) - snap(g - 7, 3));
    rot += 9 * (snap(g, 2) - snap(g - 8, 5)); ap += snap(g - 2, 3) - snap(g - 7, 4); }
  const done = snap(f - 32, 12), head = -2 - 7 * done + ring(f, 32, 3, 12);
  rot += -4 * done;
  return { view: 'side', dir: 1, x: 0, y, rot, head, feet: [{ x: bx, lift: bl }, { x: fx, lift: fl }], farArmFront: false,
    hands: [{ wx: Wd * .3 + .55 * L * ap - .1 * L * (1 - ap), wy: S + .45 * L - .55 * L * ap, bow: .45 }, { wx: Wd * .2 - .5 * L * ap + .25 * L * done, wy: S + .6 * L - .1 * L * ap - .25 * L * done, bow: .45, over: true }], held: [] }; }

// ---- PATIENT m:pt_dial (SIDE), row 34 "PAIN way DOWN": on the tread beside the wall dial, near fist ON the handrail ahead; on "pain" (f11) his head turns up
// to the dial (snap 10), on "down" (f26) the relief: shoulders drop (dip), lean back a touch, the far fist pats his chest (2 pats), then DEAD STILL from f56.
export const DIAL = { pain: 11, down: 26 };
function ptDial(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const head = tr([[0, 2], [DIAL.pain, -11, 10], [DIAL.down, -6, 14]], f), rot = tr([[0, 3], [DIAL.down, -3, 14]], f), y = dip(f, DIAL.down, 9, 5);
  const pat = 9 * (snap(f - 30, 4) - snap(f - 34, 5) + snap(f - 40, 4) - snap(f - 44, 6)), up = snap(f - DIAL.down, 8);
  return { view: 'side', dir: 1, x: 0, y, rot, head, feet: [{ x: -24, lift: 0 }, { x: 40, lift: 30 }], farArmFront: false,
    hands: [{ wx: Wd * .2 + .12 * L * up, wy: S + .55 * L - .5 * L * up + pat, bow: .5 }, { wx: Wd * .5 + .62 * L, wy: S + .62 * L, bow: .35, over: true }], held: [] }; }

// ---- m:pt_step / m:cl_step (SIDE), row 35 TWIST: one step up a tread every 12 f from f2 (film.json moves each card one tread per step), the SAME foot on
// the same frame for all four (same move, same start = the rhyme): lift 4 f, plant 5 f, a little rise and dip; arms swing against the legs.
export const STEP = { f0: 2, T: 12, n: 6 };
function step(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  let y = 0, f0x = -22, f0l = 0, f1x = 26, f1l = 0, sw = 0;
  for (let k = 0; k < STEP.n; k++) { const s = STEP.f0 + k * STEP.T, g = f - s; if (g < -1 || g > STEP.T + 6) continue; const lift = snap(g, 4) - snap(g - 4, 5), fwd = snap(g, 6) - snap(g - 8, 5), sg = k % 2 ? -1 : 1;
    if (k % 2 === 0) { f1x += 34 * fwd; f1l += 82 * lift; } else { f0x += 34 * fwd; f0l += 82 * lift; }
    y += -14 * lift + dip(f, s + 9, 6, 4); sw += sg * (snap(g, 5) - snap(g - 7, 6)); }
  return { view: 'side', dir: 1, x: 0, y, rot: 6, head: -3, feet: [{ x: f0x, lift: f0l }, { x: f1x, lift: f1l }], farArmFront: false,
    hands: [{ wx: Wd * .2 + .3 * L * sw, wy: S + .78 * L, bow: .45 }, { wx: Wd * .2 - .3 * L * sw, wy: S + .78 * L, bow: .45, over: true }], held: [] }; }

// ---- m:cl_march (SIDE), S4 v2 r2 row 35 (CB: "why they sliding"): the climbers are staged ALREADY ON THE FLIGHT and step in place in the SAME rhythm as the
// patient (STEP timing, same foot on the same frame): each foot lifts 4 f and plants back on ITS OWN spot (no forward travel, the card never moves), body rises and dips.
function march(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  let y = 0, f0l = 0, f1l = 0, sw = 0;
  for (let k = 0; k < STEP.n; k++) { const s = STEP.f0 + k * STEP.T, g = f - s; if (g < -1 || g > STEP.T + 6) continue; const lift = snap(g, 4) - snap(g - 4, 5), sg = k % 2 ? -1 : 1;
    if (k % 2 === 0) f1l += 70 * lift; else f0l += 70 * lift;
    y += -10 * lift + dip(f, s + 9, 6, 4); sw += sg * (snap(g, 5) - snap(g - 7, 6)); }
  return { view: 'side', dir: 1, x: 0, y, rot: 6, head: -3, feet: [{ x: -22, lift: f0l }, { x: 26, lift: f1l }], farArmFront: false,
    hands: [{ wx: Wd * .2 + .3 * L * sw, wy: S + .78 * L, bow: .45 }, { wx: Wd * .2 - .3 * L * sw, wy: S + .78 * L, bow: .45, over: true }], held: [] }; }

// ---- SURGEON (mask down) m:sg_ruler (3/4), rows 36-39 in the striped office, one move from the act at film 1490:
//   r36 f0-45: beside the light box, the ruler down in his near fist; a small nod on each bar pop (f18, f26, f35)
//   r37 f50: the fist lifts the ruler over the bar tops (snap 8), HOLD 8 f hovering (f58-66), lays it down in 3 f (f66-69), IMPACT f70 ("height"), settle ring,
//            FREEZE dead still f82-92 (held3d tip_at puts the ruler's far end on bar 1 from f56: the fist goes where the ruler reaches)
//   r38 f94 "see": head turns (tilts) toward the scope case (fat body: slower, smaller, snap 14), back to the bars on "work" f111, a small "got it" nod f122
//   r39 f139 "wasn't": humble, head down 6 (snap 16), DEAD STILL f160 to the end
export const SG = { pops: [18, 26, 35], lift: 50, hover: [58, 66], land: 66, hit: 70, see: 94, work: 111, nod: 122, wasnt: 139 };
function sgRuler(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const nod = SG.pops.reduce((a, p) => a + 3 * (snap(f - p, 3) - snap(f - p - 3, 8)), 0) + 5 * (snap(f - SG.nod, 5) - snap(f - SG.nod - 5, 10));
  const up = snap(f - SG.lift, 8) - .35 * snap(f - SG.land, 9), hit = dip(f, SG.hit - 1, 5, 6) + ring(f, SG.hit + 2, 4, 10);
  const head = tr([[0, 4], [SG.see, 10, 14], [SG.work, 3, 12], [SG.wasnt, 9, 16]], f) + nod, rot = tr([[0, 0], [SG.lift, -3, 8], [SG.wasnt, 2, 16]], f);
  return { view: '34', dir: 1, x: 0, y: hit * .6, rot, head, feet: [{ x: -34, lift: 0 }, { x: 30, lift: 0 }], farArmFront: false,
    hands: [{ wx: -Wd * .7, wy: ch.hipY - 40, bow: .55 }, ch.tgt ? { wx: ch.tgt[0], wy: ch.tgt[1] + hit, bow: .45, over: true } : { wx: Wd * .6 + (.35 + .3 * up) * L, wy: S + (.75 - .8 * up) * L + hit, bow: .45, over: f < 44, behind: f >= 44 }], held: [] }; }   // BUILD-OUT: from f44 the near arm is the set's 3D arm (s4o.arm3d) ON the ruler end; the card arm tucks behind   // film.json hand_at puts the near fist ON the ruler end (s4_office anchor ruler_end)

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('pt_bound', ptBound, 'three springy strides up the flight'), sty('pt_dial', ptDial, 'beside the pain dial: looks up, relief'),
  sty('pt_step', step, 'one tread per 12 f, same foot as the climbers'), sty('cl_step', step, 'climber: the same step as the patient'), sty('cl_march', march, 'climber: steps in place on his tread, same rhythm, planted feet'),
  sty('sg_ruler', sgRuler, 'office: bars pop, ruler hover-land-freeze, looks scope -> bars, humble')];
export default { title: 'SURGERY S4: episode moves', dur: N / 30, styles: STY };
export const front = { title: 'SURGERY S4: episode moves', dur: N / 30, styles: STY };
export const W = {};
// motion-gate plan (moves/tools/check_motion_ep.mjs): strikes + holds in frames from the move start
export const PLAN = {
  pt_bound: { who: 'patientShorts', view: 'side', strikes: [{ name: 'stride 1 lift', f0: 6, ch: 'ft3', to: 'max' }], holds: [[54, N - 1, 'proud, dead still']], acting: [0, 52] },
  pt_dial: { who: 'patientShorts', view: 'side', strikes: [{ name: 'look up "pain"', f0: DIAL.pain, ch: 'head', to: 'min' }], holds: [[58, N - 1, 'relieved, dead still']], acting: [0, 56] },
  pt_step: { who: 'patientShorts', view: 'side', strikes: [], holds: [[STEP.f0 + STEP.n * STEP.T + 14, N - 1, 'stopped']], acting: [0, STEP.f0 + STEP.n * STEP.T + 10] },
  cl_step: { who: 'climber1', view: 'side', strikes: [], holds: [[STEP.f0 + STEP.n * STEP.T + 14, N - 1, 'stopped']], acting: [0, STEP.f0 + STEP.n * STEP.T + 10] },
  cl_march: { who: 'climber1', view: 'side', strikes: [], holds: [[STEP.f0 + STEP.n * STEP.T + 14, N - 1, 'stopped']], acting: [0, STEP.f0 + STEP.n * STEP.T + 10] },
  sg_ruler: { who: 'surgeonOff', view: '34', strikes: [{ name: 'ruler up f50', f0: SG.lift, ch: 'h1y', to: 'min' }, { name: 'look "see" f94', f0: SG.see, ch: 'head', to: 'max' }],
    holds: [[SG.hover[0] + 1, SG.hover[1], 'hover HOLD 8 f'], [84, 92, 'FREEZE'], [162, N - 1, 'humble, dead still']], acting: [0, 160] },
};

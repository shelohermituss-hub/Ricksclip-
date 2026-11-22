// EPISODE MOVES, plane-eater S3 THE X-RAY (film 17.30-21.28 s = frames 519-638, plan rows 19-22, script line 5). S3 stretch builder 2026-11-22 (DRAFT round).
// STUDIO MOTION form (./studio_ep.mjs: Rick's snap, settle, DEAD STILL in holds), drawn new on every frame (tween.ones). The act starts at film frame 519,
// so move frame m = film frame - 519. Written facing +x (dir 1). Hands as {f, d} = forward / down in arm lengths from the shoulder (rig.mjs).
// words.json frames (s x 30): x 519, -rayed 528, him 537, and 541, found 550, a 556, stomach 562, lining 572, so 581, THICK 592, the 604, metal 613, just 620, SLID 627, through 638
import { snap, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000, A0 = 519;
export const N = 120;
export const W = { x: 519, rayed: 528, him: 537, and: 541, found: 550, a: 556, stomach: 562 };

// ---- DOCTOR m:dr_lean (3/4, faces the light box), row 19 (the camera leaves him at f572 into the film).
//   f519-527  the near hand (R) is up on the film clip bar (he just clipped the film), the far hand at his belly; the box flickers twice
//   f528      "-RAYED": he LEANS IN to the film (anticipation 3 f back, then rot +7 over 12 f), head down 6 = peering over the half-moon glasses
//   f541      "and": the far hand flies up to the nose and pushes the glasses down (snap 6), stays there (the clip hand stays on the clip)
//   f550      "found": a small jolt back as he sees the plane (rot -4, snap 5, ring on the head), then DEAD STILL, staring, until the camera has gone
function drLean(t, ch, view = '34') { const f = F(t) + A0;
  const ant = snap(f - (W.rayed - 3), 3) - snap(f - W.rayed, 4), lean = snap(f - W.rayed, 12), jolt = snap(f - W.found, 5) - .5 * snap(f - W.found - 6, 10);
  const gl = snap(f - W.and, 6);
  // f628-638 DOUBLE TAKE (row 23 start, the camera has come back out of the film): he looks away (head -10, snap 4), then SNAPS back to the film
  // (head +9, body jolts back, dip 6) on f634, glasses fly up his nose (far hand back to the nose)
  const away = snap(f - 628, 4) - snap(f - 633, 3), snapB = snap(f - 633, 3), dt = snapB - .6 * snap(f - 637, 8);
  const rot = -2 * ant + 7 * lean - 4 * jolt - 6 * dt, head = 6 * lean - 3 * jolt + ring(f, W.found, 4, 10) - 10 * away + 3 * dt + ring(f, 634, 5, 10);
  const far = { f: .35 + (.42 - .35) * gl, d: .78 - 1.38 * gl, bow: .45, over: gl > .5 };           // belly -> the nose (glasses down)
  const near = { f: .98, d: -.42 + .05 * lean + .5 * dt, bow: .3 };                                               // up on the film clip bar
  return { view, dir: 1, x: 0, y: dip(f, W.found, 4, 5) + dip(f, 634, 6, 5), rot, head, feet: [{ x: -26, lift: 0 }, { x: 24, lift: 0 }], farArmFront: gl > .5,
    hands: [far, near], held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY_SIDE = [sty('dr_lean', (t, ch) => drLean(t, ch, 'side'), 'side drawing (camera-safe: the camera asks for side beyond 68 deg)')];
const STY = [sty('dr_lean', drLean, 'hand on the film clip, leans in, pushes the glasses down, jolts on "found"')];
export default { title: 'PLANE-EATER S3: episode moves (side)', dur: N / 30, styles: STY_SIDE };
export const front = { title: 'PLANE-EATER S3: episode moves', dur: N / 30, styles: STY };
export const PLAN = { dr_lean: { who: 'doctor', view: '34', strikes: [528, 541, 550], holds: [[560, 638, 'staring, still']], acting: [519, 559] } };

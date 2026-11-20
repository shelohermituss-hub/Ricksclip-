// SIT ON A CHAIR WITH 3D LEGS (CB 2026-11-16: "fix also the sitting on chair. make it correct", after the locked floor sit with 3D legs).
// The card draws body, arms and head only, with the bottom ON the seat (SEAT_M above the floor). The legs are 3D ink tubes (legs3d, film.js floorLegs):
// thighs forward along the seat, a soft knee, shins down to the floor, a small foot forward. Every camera sees them in true perspective.
import { blinkAt, G } from '../rig.mjs';
const sin = Math.sin, loop = 5, SEAT_M = .30;                       // seat height in metres: fits the character's own legs (about 0.5 m, rig legL), so the feet reach the floor
const seatY = ch => { const top = ch.hy - 100 * ch.K, k = 1.7 / (G - top); return G - SEAT_M / k - 640 + 4; };   // body bottom on the seat
const breathe = t => 2 * sin(t * 2.4);
const pose = view => (t0, ch) => { const t = t0 % loop, b = breathe(t);
  return { view, dir: 1, x: 0, y: seatY(ch) + b, rot: 0, feet: [], hands: [{ f: .45, d: .9, bow: .4 }, { f: .45, d: .9, bow: .4 }], head: 0, face: 'k:standard', blink: blinkAt(t), cam: 0, camY: -200 }; };
// metres from the floor point under the hips: x = to his side, y = up, z = toward where he faces. Second leg = mirror.
// lengths match the card's legs (CB 2026-11-16 "looks not natural": the first version had 0.8 m spider legs): thigh about 0.24 m, shin about 0.26 m, foot 0.09 m
export const legs3d = { r: .02, pts: [[.075, SEAT_M + .04, .0], [.085, SEAT_M + .045, .2], [.09, SEAT_M - .03, .25], [.095, .04, .26], [.1, .03, .35]] };
export const chair3d = { seat: SEAT_M };   // test_move3d.mjs draws a chair under him
const A = { key: 'A', name: 'On a chair', blurb: 'sits upright, thighs on the seat, feet on the floor (3D legs)' };
export default { title: 'SIT ON A CHAIR  ·  side', dur: loop, styles: [{ ...A, pose: pose('side') }] };
export const front = { title: 'SIT ON A CHAIR  ·  front', dur: loop, styles: [{ ...A, pose: pose('front') }] };
export const views = { title: 'SIT ON A CHAIR  ·  3 views', dur: loop, styles: [
  { key: 'A', name: 'Front', blurb: '', pose: pose('front') }, { key: 'B', name: '3/4', blurb: '', pose: pose('34') }, { key: 'C', name: 'Side', blurb: '', pose: pose('side') }] };

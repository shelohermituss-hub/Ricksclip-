// EPISODE MOVES, plane-eater S2 THE TABLE (film 8.56-17.30 s = frames 257-519, plan rows 10-18, script lines 3-4). S2 stretch builder 2026-11-22.
// Every act starts at film frame 0 in film.json? NO: each move starts at its act frame; times below are FILM frames (MOVE frame + its act's start, see OFF).
// Hands: [far (L, held3d 'L'), near (R, held3d 'R')] as {f, d} = forward / down from the shoulder in arm lengths. Written facing +x (dir 1).
import { blinkAt, G } from './motion/rig.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
function tr(keys, f) { let v = keys[0][1]; for (let i = 1; i < keys.length; i++) { const [f0, to, n = 12] = keys[i]; if (f <= f0) break; const u = snap(f - f0, n); v = Array.isArray(to) ? v.map((a, j) => a + (to[j] - a) * u) : v + (to - v) * u; } return v; }
const ring = (f, f0, amp, n = 10) => f > f0 && f < f0 + n ? amp * Math.exp(-(f - f0) / 3) * Math.sin((f - f0) * 2.1) * (1 - (f - f0) / n) : 0;
const dip = (f, f0, amp = 8, n = 4) => f > f0 && f < f0 + n ? amp * Math.sin(Math.PI * (f - f0) / n) : 0;
// words.json frames (s x 30): Every 257, day 266, glass 283, oil 296, jug 318, water 331, two 356, pounds 365, airplane 378, Wings 407, wheels 428,
// seats 451, even 469, tires 478, Doctors 509, x 519
export const W = { every: 257, day: 266, glass: 283, oil: 296, jug: 318, water: 331, two: 356, pounds: 365, airplane: 378, wings: 407, wheels: 428, seats: 451, even: 469, tires: 478, doctors: 509 };
export const SEAT_M = .485;                                   // the bentwood chair seat in sets/apron (chair_seat top 0.485 m)
const seatY = ch => { const top = ch.hy - 100 * ch.K, k = 1.7 / (G - top); return G - SEAT_M / k - 640 + 4; };
// 3D legs (film.js floorLegs): metres from the floor point under the hips; x = to his side, y = up, z = toward where he faces (under the table)
export const legs3d = { r: .024, pts: [[.08, SEAT_M + .04, .0], [.09, SEAT_M + .045, .24], [.095, SEAT_M - .03, .29], [.1, .04, .32], [.105, .03, .42]] };
export const chair3d = { seat: SEAT_M };
const OFF = { mi_table: 262, ow_watch: 0 };                  // round 2 FIX: the kit's move clock (mt) restarts on every POSE change: mi_table starts at its act f262 (round 1 played every hand 262 f late)

// ---- MICHEL m:mi_table (SIDE, seated at the white-cloth table, faces the table = +x). One move for rows 10-18.
//  257-275 "Every day": he settles onto the seat (body drops 14 px, bounce), both hands tuck the chair in (grip at the hips, 2 small scoots of the body forward)
//  283 "glass": near hand (R) lifts the oil glass (snap 8), 288-300 swirls it (3 small circles, never a sine on the whole arm: ring loops), 300-312 to the nose:
//      sniff (head tips up 6, eyes close), 312 nod (head -5 ring), 316 sets it down
//  318 "jug": near hand grabs the jug (snap 6), lifts and tilts it (held3d angle keys) 324-340 = the glug; 343 sets it down
//  344-362 far hand (L) brings the tumbler to the mouth, head back 8, drinks, down
//  352 tongs in the near hand over the scale: 365 "pounds" the bites drop (the hand opens: small up-jerk), 378 browUp, the hand returns to rest 384
//  398-414 "Wings": the wing slice to the mouth, SNAP on 407 (head dip 5, body dip 6) = the crack
//  420-436 "wheels": the hub to the mouth, bite 428 (head forward like into a doughnut)
//  444-458 "seats": the cushion to the mouth, bite 451; 456 far hand index pushes the spring back (458-466)
//  470-478 "even the tires": the tire to the mouth, bites 478; 480-488 the near hand PULLS the tire away (strand stretches, body leans back 6 deg),
//      489 SNAP back (hand jerks back toward the face 0.3 L, head recoils 7, ring), 490-506 chews hard (head bobs every 5 f), 505 swallow
//  509 "Doctors": far hand pats the belly twice (512, 517), contented lean back
const REST = { f: .42, d: .62 }, MOUTH = { f: .3, d: -.12 }, NOSE = { f: .32, d: -.2 };
const P2 = (keys, f) => { const v = tr(keys.map(k => [k[0], [k[1].f, k[1].d], k[2]]), f); return { f: v[0], d: v[1] }; };
function miTable(t, ch) { const f = F(t) + OFF.mi_table, S = ch.sh[1], L = ch.armL;
  const sit = snap(f - 262, 6), y0 = seatY(ch) - 30 * (1 - sit) + dip(f, 266, 6, 5) + dip(f, 274, 4, 4);   // fix 1: drops onto the seat at 262, two tuck bumps 266 / 274
  // near hand (R): the busy one
  const swirl = f > 288 && f < 300 ? .035 : 0, ang = (f - 288) * 2 * Math.PI / 4;
  let R = P2([[0, { f: .18, d: .78 }], [257, { f: .3, d: .6 }, 4], [266, { f: .1, d: .75 }, 4], [276, REST, 8], [283, { f: .5, d: .32 }, 8], [300, NOSE, 10], [313, { f: .48, d: .4 }, 8], [316, REST, 6],
    [318, { f: .56, d: .28 }, 6], [324, { f: .62, d: .2 }, 8], [341, { f: .55, d: .45 }, 8], [345, REST, 6],
    [352, { f: .62, d: .3 }, 8], [365, { f: .62, d: .24 }, 3], [369, { f: .62, d: .3 }, 6], [384, REST, 10],
    [394, { f: .7, d: -.05 }, 6], [402, MOUTH, 5], [409, { f: .7, d: .02 }, 6], [417, { f: .7, d: -.05 }, 5], [424, MOUTH, 4], [431, { f: .7, d: .02 }, 6], [440, { f: .7, d: -.05 }, 5], [447, MOUTH, 4], [454, { f: .66, d: .05 }, 6],
    [470, MOUTH, 8], [480, { f: .78, d: .05 }, 8], [489, { f: .4, d: .02 }, 2], [492, REST, 12]], f);
  if (swirl) R = { f: R.f + swirl * Math.cos(ang), d: R.d + swirl * Math.sin(ang) };
  // far hand (L)
  const Lh = P2([[0, { f: .1, d: .8 }], [257, { f: .25, d: .62 }, 4], [266, { f: .05, d: .78 }, 4], [276, { f: .36, d: .66 }, 8], [344, { f: .4, d: .4 }, 6], [348, MOUTH, 8], [358, { f: .36, d: .66 }, 8],
    [456, { f: .5, d: .38 }, 6], [460, { f: .52, d: .34 }, 3], [466, { f: .36, d: .66 }, 8],
    [509, { f: .16, d: .7 }, 6]], f);
  const pat = f > 509 ? 5 * (dip(f, 512, 1, 4) + dip(f, 517, 1, 4)) : 0;
  const chew = f > 490 && f < 507 ? 3 * Math.abs(Math.sin((f - 490) * Math.PI / 5)) : 0;
  const head = tr([[0, 0], [300, -6, 8], [312, 4, 4], [316, 0, 8], [348, -8, 8], [358, 0, 8], [365, 4, 6], [378, 0, 10], [405, 5, 3], [409, 0, 8],
    [426, 6, 4], [431, 0, 8], [449, 5, 4], [454, 0, 8], [476, 5, 4], [480, -3, 6], [489, -7, 2], [492, 0, 10], [512, -3, 10]], f) + ring(f, 312, 5, 10) + ring(f, 489, 6, 12) + chew;
  const rot = tr([[0, 2], [257, 3, 8], [276, 1, 10], [480, -6, 8], [489, 3, 3], [495, 1, 10], [509, -4, 12]], f) + ring(f, 407, 2, 8);
  const face = f < 283 ? 'k:standard' : f < 300 ? 'k:proud' : f < 316 ? 'k:concentrate' : f < 378 ? 'k:proud' : f < 398 ? 'k:browUp'
    : f < 407 ? 'k:proud' : f < 412 ? 'k:peChew' : f < 428 ? 'k:proud' : f < 434 ? 'k:peChew' : f < 451 ? 'k:proud' : f < 458 ? 'k:peChew' : f < 470 ? 'k:proud'
    : f < 478 ? 'k:aim' : f < 490 ? 'k:peChewHard' : f < 506 ? 'k:peChew' : 'k:proud';
  return { view: 'side', dir: 1, x: 0, y: y0 + dip(f, 407, 6, 4) + pat * 0, rot, head, feet: [], farArmFront: f > 344 && f < 362 || f > 455 && f < 468 || f > 508,
    hands: [{ f: Lh.f, d: Lh.d + pat / L, bow: .35 }, { f: R.f, d: R.d, bow: .35, over: true }], face, blink: face === 'k:standard' ? blinkAt(t) : null, held: [] }; }

// ---- OWNER m:ow_watch (34): far back by the plane, arms crossed, the yellow rag over his shoulder hand; leans in on "glass" (row 11),
//      WINCES on the tire snap (489: shoulders up, head back 8, ring), then shakes his head slowly (495-515).
function owWatch(t, ch) { const f = F(t) + OFF.ow_watch, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const wince = snap(f - 489, 4) - snap(f - 500, 12), shake = f > 498 && f < 516 ? 4 * Math.sin((f - 498) * Math.PI / 6) : 0;
  return { view: '34', dir: 1, x: 0, y: -4 * wince, rot: tr([[0, -2], [285, 2, 12], [330, -2, 12]], f) - 3 * wince, head: tr([[0, -2], [285, 3, 12], [330, -2, 12]], f) - 8 * wince + shake, shrug: 10 * wince,
    feet: [{ x: -24, lift: 0 }, { x: 24, lift: 0 }], farArmFront: true,
    hands: [{ wx: Wd * .55, wy: S + .22 * L, bow: .25, over: true }, { wx: -Wd * .5, wy: S + .26 * L, bow: .25, over: true }], held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('mi_table', miTable, 'seated at the table: oil glass, jug, tumbler, scale, wing / wheel / seat / tire bites, belly pat'),
  sty('ow_watch', owWatch, 'arms crossed far back, leans in, winces on the tire snap')];
export default { title: 'PLANE-EATER S2: episode moves', dur: 520 / 30, styles: STY };
export const front = { title: 'PLANE-EATER S2: episode moves', dur: 520 / 30, styles: STY };

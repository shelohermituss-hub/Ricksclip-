// EPISODE MOVE, plane-eater S4: m:../../ep_s4o/ow_deck = the OWNER waiting in his deck chair (seat 0.36 m), the yellow rag in his near hand on his lap,
// arms folded over it; used by owner / ownerBeardS / M / L / XL (the beard puppet is swapped per beat in film.json). Move frame = film frame (act at 0).
//  660-712 waits: breathes slow, the head sinks a little with each season (he gets older, more bored), one tap of the foot... (3D legs: none)
//  713 "PLANE": his jaw drops INTO the beard (face from film.json), shoulders up, head back 6, then frozen
import { G } from './motion/rig.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
export const SEAT_M = .36;
const seatY = ch => { const top = ch.hy - 100 * ch.K, k = 1.7 / (G - top); return G - SEAT_M / k - 640 + 4; };
export const legs3d = { r: .026, pts: [[.08, SEAT_M + .04, .0], [.09, SEAT_M + .03, .3], [.095, SEAT_M - .02, .36], [.1, .04, .5], [.105, .03, .6]] };
export const chair3d = { seat: SEAT_M };
function owDeck(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const age = Math.min(1, Math.max(0, (f - 672) / 40)), jaw = snap(f - 713, 4), br = 2 * Math.sin(f * .12);
  return { view: '34', dir: 1, x: 0, y: seatY(ch) + br, rot: -4 + 6 * age - 3 * jaw, head: 2 + 8 * age - 12 * jaw, shrug: 8 * jaw,
    feet: [], farArmFront: true, hands: [{ wx: Wd * .45, wy: S + .4 * L, bow: .25, over: true }, { wx: -Wd * .4, wy: S + .45 * L, bow: .25, over: true }], held: [] }; }
const STY = [{ key: 'ow_deck', name: 'ow_deck', blurb: 'waits in the deck chair, rag on the lap, ages, jaw drops on "plane"', pose: owDeck }];
export default { title: 'PLANE-EATER S4: owner in the deck chair', dur: 944 / 30, styles: STY };
export const front = { title: 'PLANE-EATER S4: owner in the deck chair', dur: 944 / 30, styles: STY };

// EPISODE MOVES, astro-flush-study place ship: shot 7 (navigator behind the cockpit glass, f538-705, rendered f531-712) and shot 11 (new guy in porthole_b, f867-885).
// f below = FILM frame = his reference frame. Pose keys: smoothstep over >= 6 frames starting 2 f before the key (MOTION RULES 5); holds float (bob, tilt), never frozen.
// Board: refs/SHOT_BOARD.md section 3 rows 7 and 11.
import { blinkAt } from './motion/rig.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
const snap = (f, n = 6) => { n = Math.max(6, n); if (f <= 0) return 0; const u = f / n; return u >= 1 ? 1 : u * u * (3 - 2 * u); };
function tr(keys, f) { let v = keys[0][1]; for (let i = 1; i < keys.length; i++) { const [k0, to, n = 6] = keys[i], f0 = k0 - 2; if (f <= f0) break; const u = snap(f - f0, n); v = Array.isArray(to) ? v.map((a, j) => a + (to[j] - a) * u) : v + (to - v) * u; } return v; }
const P2 = (keys, f) => { const v = tr(keys.map(k => [k[0], [k[1].f, k[1].d], k[2]]), f); return { f: v[0], d: v[1] }; };
const step = (keys, f) => { let v = keys[0][1]; for (const [f0, x] of keys) if (f >= f0) v = x; return v; };
const bob = (f, ph = 0, a = 7, T = 46) => a * Math.sin(2 * Math.PI * (f + ph) / T);
const tilt = (f, ph = 0, a = 1.6, T = 64) => a * Math.sin(2 * Math.PI * (f + ph) / T + 1.3);
const dangle = (f, ph = 0, lift = 60) => [{ x: -30 + 4 * Math.sin((f + ph) / 9), lift: lift + 10 * Math.sin((f + ph) / 13) }, { x: 30 + 4 * Math.sin((f + ph) / 11 + 1), lift: lift * .7 + 10 * Math.sin((f + ph) / 15 + 2) }];

// ---- NAVIGATOR, shot 7: centre behind the glass, faces the lens, cup at the chest. ~540-560 neutral; ~564-576 eyes closed, sips; ~582 half-open;
// ~588 round wide eyes, open mouth ("the window," 581); ~594 gasp, eyes shut; ~600-606 wide again, the cup leaves her hand (set mover drifts right);
// ~612 blink, ~618 wide; from 624 arms out, slow turn of the body.
function nav7(t, ch) { const f = F(t);
  const face = step([[0, 'k:standard'], [564, 'k:smug'], [582, 'k:afEyeRoll'], [588, 'k:shocked'], [594, 'k:surprised'], [600, 'k:shocked'], [618, 'k:open']], f);
  const L = P2([[0, { f: .35, d: .45 }], [600, { f: .55, d: .3 }, 8], [624, { f: .95, d: -.15 }, 12]], f);
  const R = P2([[0, { f: .4, d: .4 }], [564, { f: .3, d: .1 }, 8], [578, { f: .4, d: .4 }, 8], [600, { f: .8, d: .1 }, 8], [624, { f: .95, d: -.2 }, 12]], f);
  const head = tr([[0, 0], [564, 5, 6], [582, -2, 6], [588, -6, 6], [594, 4, 6], [600, -4, 6], [618, 2, 6]], f) + tilt(f, 5, 1.8);
  const rot = tr([[0, 0], [588, -3, 6], [624, 6, 16]], f) + tilt(f, 21, 1.4) + (f > 630 ? 3 * Math.sin((f - 630) / 18) : 0);
  const view = f < 640 ? 'front' : '34';
  return { view, dir: 1, x: 0, y: bob(f, 0, 6, 50), rot, head, feet: dangle(f, 7, 55), farArmFront: true,
    hands: [{ f: L.f, d: L.d, bow: .3 }, { f: R.f, d: R.d, bow: .3 }], face, blink: f >= 610 && f < 614 ? 1 : (face === 'k:smug' ? null : blinkAt(t, 3.1, .4)), held: [] }; }

// ---- NEW GUY, shot 11: in porthole_b, faces out: f867-875 nervous smile, sweat drop, small worried bob; ~876-884 slides sideways out (pos glide in acts).
function ng11(t, ch) { const f = F(t);
  const face = 'k:afSweat';
  return { view: 'front', dir: 1, x: 0, y: bob(f, 3, 3, 34), rot: tr([[0, 0], [876, -6, 8]], f) + tilt(f, 9, 1.2), head: tilt(f, 2, 2.4, 40) + tr([[0, 0], [874, 5, 6]], f), feet: dangle(f, 11, 40), farArmFront: true,
    hands: [{ f: .45, d: -.2, bow: .5 }, { f: .45, d: -.2, bow: .5 }], face, blink: blinkAt(t, 2.2, .5), held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('nav7', nav7, 'navigator shot 7: neutral, sip, puzzled, shocked, gasp, wide, arms out'), sty('ng11', ng11, 'new guy shot 11: nervous smile in the porthole, sweat, slides out')];
export default { title: 'ASTRO-FLUSH ship: episode moves', dur: 1200 / 30, styles: STY };
export const front = { title: 'ASTRO-FLUSH ship: episode moves', dur: 1200 / 30, styles: STY };

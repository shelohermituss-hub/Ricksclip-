// EPISODE MOVES, astro-flush-study place cabin: shot 4 (cabin day, f284-410, rendered to f422) and shot 5 (sleep bay night, f423-494, rendered f411-499).
// Every act starts at film frame 0, so f below = FILM frame = his reference frame. Snap = 2-3 frames; holds float (bob 2-4 cm, tilt): weightless, never frozen.
// Board: refs/SHOT_BOARD.md section 3 rows 4 and 5. Hands: [screen-left, screen-right] as {f, d} in arm lengths (f out, d down; d < 0 = up).
import { blinkAt } from './motion/rig.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
// round 2 (MOTION RULES): every pose key is a smoothstep over >= 6 frames, starting 2 f before its key (as ep_mc.mjs round 3)
const snap = (f, n = 6) => { n = Math.max(6, n); if (f <= 0) return 0; const u = f / n; return u >= 1 ? 1 : u * u * (3 - 2 * u); };
function tr(keys, f) { let v = keys[0][1]; for (let i = 1; i < keys.length; i++) { const [k0, to, n = 6] = keys[i], f0 = k0 - 2; if (f <= f0) break; const u = snap(f - f0, n); v = Array.isArray(to) ? v.map((a, j) => a + (to[j] - a) * u) : v + (to - v) * u; } return v; }
const P2 = (keys, f) => { const v = tr(keys.map(k => [k[0], [k[1].f, k[1].d], k[2]]), f); return { f: v[0], d: v[1] }; };
const step = (keys, f) => { let v = keys[0][1]; for (const [f0, x] of keys) if (f >= f0) v = x; return v; };
const bob = (f, ph = 0, a = 7, T = 46) => a * Math.sin(2 * Math.PI * (f + ph) / T);
const tilt = (f, ph = 0, a = 1.6, T = 64) => a * Math.sin(2 * Math.PI * (f + ph) / T + 1.3);
// legs dangle and swing a little (weightless): bent knees = feet lifted, out of step
const dangle = (f, ph = 0, lift = 60) => [{ x: -30 + 4 * Math.sin((f + ph) / 9), lift: lift + 10 * Math.sin((f + ph) / 13) }, { x: 30 + 4 * Math.sin((f + ph) / 11 + 1), lift: lift * .7 + 10 * Math.sin((f + ph) / 15 + 2) }];
const talk = (f, a, b, on, off) => f >= on && f < off ? (Math.floor((f - on) / 3) % 2 ? a : b) : null;   // a new mouth every 3 frames on his speaking frames

// ---- NEW GUY, shot 4: centre, holds the teal magazine (screen-left hand) and the drink ball (screen-right). f284-315 reads (deadpan);
// 317 "rolls": big round eyes up (snap 3); 330-346 eye roll, head tilts ("his eyes."); 348 smirk at the lens ("It's a" 350); 356-372 talks,
// magazine lowered ("toilet." 360); 376-384 leans to the commander ("What's it" 380); 388-392 laughs, arms out ("gonna do?"), 392 tosses the
// magazine (the set mover flies off up-left, film.json held); 396-410 hands on hips, smug, legs dangle.
function ng4(t, ch) { const f = F(t);
  const L = P2([[0, { f: .5, d: .3 }], [356, { f: .4, d: .6 }, 3], [376, { f: .55, d: .35 }, 10], [386, { f: .95, d: -.35 }, 12], [396, { f: .35, d: .55 }, 14]], f);
  const R = P2([[0, { f: .45, d: .45 }], [386, { f: .95, d: -.2 }, 12], [396, { f: .35, d: .55 }, 14]], f);
  const head = tr([[0, 4], [317, -6, 3], [330, 9, 3], [348, -2, 3], [376, -7, 3], [388, 0, 3], [396, 4, 3]], f) + tilt(f, 5, 1.8);
  const rot = tr([[0, 0], [376, -7, 4], [388, 0, 3], [396, 3, 3]], f) + tilt(f, 21, 1.2);
  // round 3: faces read on his frames f300-410 every 10 (same keys as make_film.py FACES4; the kit plays the move's face)
  const face = step([[0, 'k:afEyeRoll'], [316, 'k:open'], [336, 'k:afEyeRoll'], [348, 'k:cheer'], [376, 'k:laugh'], [388, 'k:cheer'], [398, 'k:happy'], [406, 'k:laugh']], f);
  return { view: 'front', dir: 1, x: 0, y: bob(f, 0, 7, 48), rot, head, feet: dangle(f, 0), farArmFront: true,
    hands: [{ f: L.f, d: L.d, bow: f >= 396 ? -.9 : .3 }, { f: R.f, d: R.d, bow: f >= 396 ? -.9 : .3 }], face, blink: face === 'k:afEyeRoll' ? blinkAt(t, 2.4, .2) : null, held: [] }; }

// ---- COMMANDER, shot 4: left, floats seated by the galley, 3/4 to the right; frown all through; 340-352 eyes shut in annoyance; 396 turns his head to the new guy.
function cmd4(t, ch) { const f = F(t);
  const face = 'k:afEyeRoll';   // round 3: stern half-lid all through (his f300-410)
  return { view: '34', dir: 1, x: 0, y: bob(f, 17, 6, 52), rot: tilt(f, 40, 1.4), head: tr([[0, 0], [340, 5, 3], [353, 0, 3], [396, -6, 3]], f) + tilt(f, 9, 1.6), feet: dangle(f, 23, 70), farArmFront: true,
    hands: [{ f: .35, d: .6, bow: .3 }, { f: .45, d: .5, bow: .3 }], face, blink: blinkAt(t, 2.9, .7), held: [] }; }

// ---- NAVIGATOR, shot 4: right, 3/4 to the left; clipboard (screen-left hand) + pencil (screen-right), side look to the new guy, small head turns only; pencil taps.
function nav4(t, ch) { const f = F(t);
  const face = 'k:smug', tap = 0.04 * Math.sin(f * Math.PI / 4) * (f % 60 < 24 ? 1 : 0);
  return { view: '34', dir: 1, x: 0, y: bob(f, 31, 7, 44), rot: tilt(f, 3, 1.3), head: tr([[0, -3], [330, 3, 4], [376, -4, 4]], f) + tilt(f, 27, 1.5), feet: dangle(f, 47, 55), farArmFront: true,
    hands: [{ f: .5, d: .4, bow: .3 }, { f: .45, d: .35 + tap, bow: .3 }], face, blink: blinkAt(t, 3.3, 1.1), held: [] }; }

// round 3: sleepers' arms up by the head, above the collar (his f430: heads, shoulders and hands over the bags).
// ---- SHOT 5: asleep in the bags (bodies hidden by the bag fronts), heads loll slowly; the new guy opens one eye ~452, slides out 457-469
// (pos glide in acts), 472 looks back at the commander with the sweat drop, 474-494 drifts right to the door, 3/4 away, arms tucked, tiptoe, look over the shoulder.
const loll = (f, ph, a = 5) => a * Math.sin(2 * Math.PI * (f + ph) / 90);
function nav5(t, ch) { const f = F(t);
  return { view: 'front', dir: 1, x: 0, y: bob(f, 11, 4, 70), rot: loll(f, 20, 2), head: loll(f, 0, 6), feet: [{ x: -20, lift: 0 }, { x: 20, lift: 0 }], hands: [{ f: .5, d: -.3, bow: .6 }, { f: .5, d: -.3, bow: .6 }], face: 'k:sleepy', blink: null, held: [] }; }
function cmd5(t, ch) { const f = F(t);
  return { view: 'front', dir: 1, x: 0, y: bob(f, 37, 4, 76), rot: loll(f, 50, 2), head: loll(f, 33, 7), feet: [{ x: -20, lift: 0 }, { x: 20, lift: 0 }], hands: [{ f: .5, d: -.3, bow: .6 }, { f: .5, d: -.3, bow: .6 }], face: 'k:sleepy', blink: null, held: [] }; }
function ng5(t, ch) { const f = F(t), out = f >= 446;
  const face = step([[0, 'k:sleepy'], [452, 'k:sneaky'], [470, 'k:afSweat']], f);
  const view = f < 472 ? 'front' : '34', head = tr([[0, 0], [452, -3, 3], [470, -9, 3], [474, 6, 3], [486, -5, 4]], f) + (f < 452 ? loll(f, 65, 6) : tilt(f, 3, 1.5));
  const H = P2([[0, { f: .5, d: -.3 }], [446, { f: .1, d: .95 }, 12], [472, { f: .45, d: .2 }, 10]], f);   // round 3: arms up by the head while asleep (his f430)
  const uf = snap(f - 468, 10), A0 = [{ x: -16, lift: 0 }, { x: 16, lift: 0 }], A1 = [{ x: -24 + 6 * Math.sin(f / 7), lift: 40 + 15 * Math.sin(f / 7) }, { x: 26, lift: 75 + 8 * Math.sin(f / 9) }];
  const feet = A0.map((a, i) => ({ x: a.x + (A1[i].x - a.x) * uf, lift: a.lift + (A1[i].lift - a.lift) * uf }));   // tiptoe blended in over 10 f (no feet JUMP)
  return { view, dir: 1, x: 0, y: bob(f, 3, 4 + 2 * snap(f - 446, 16), 60), rot: tr([[0, 0], [446, 0], [472, 8, 8]], f) + tilt(f, 15, 1.2), head, feet, farArmFront: true,
    hands: [{ f: H.f, d: H.d, bow: .5 }, { f: H.f, d: H.d, bow: .5 }], face, blink: null, held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('ng4', ng4, 'new guy shot 4: reads, eye roll, smug, talks, laughs, tosses the magazine, hands on hips'),
  sty('cmd4', cmd4, 'commander shot 4: frown, eyes shut, turns to the new guy'), sty('nav4', nav4, 'navigator shot 4: side look, clipboard, pencil taps'),
  sty('nav5', nav5, 'navigator shot 5 asleep'), sty('cmd5', cmd5, 'commander shot 5 asleep'), sty('ng5', ng5, 'new guy shot 5: wakes, slides out, sweat, to the door')];
export default { title: 'ASTRO-FLUSH cabin: episode moves', dur: 900 / 30, styles: STY };
export const front = { title: 'ASTRO-FLUSH cabin: episode moves', dur: 900 / 30, styles: STY };

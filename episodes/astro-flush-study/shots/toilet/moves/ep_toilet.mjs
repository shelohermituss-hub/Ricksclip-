// EPISODE MOVES, astro-flush-study place toilet: shot 1 (f0-34, to f41), shot 6 (f500-530, rendered f495-537), shot 12 (f1007-1113, rendered from f998).
// Every act starts at film frame 0, so f below = FILM frame = his reference frame. Board: refs/SHOT_BOARD.md section 3 rows 1, 6, 12.
// Motion rules of this film (ep_mc.mjs round 3): every pose key is a smoothstep over >= 6 frames starting 2 f before the key; holds float (bob + tilt).
// Hands: front view [screen-left, screen-right] as {f, d} in arm lengths (f out, d down; d < 0 = up; f < 0 = across the body).
import { blinkAt } from './motion/rig.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
const snap = (f, n = 6) => { n = Math.max(6, n); if (f <= 0) return 0; const u = f / n; return u >= 1 ? 1 : u * u * (3 - 2 * u); };
function tr(keys, f) { let v = keys[0][1]; for (let i = 1; i < keys.length; i++) { const [k0, to, n = 6] = keys[i], f0 = k0 - 2; if (f <= f0) break; const u = snap(f - f0, n); v = Array.isArray(to) ? v.map((a, j) => a + (to[j] - a) * u) : v + (to - v) * u; } return v; }
const P2 = (keys, f) => { const v = tr(keys.map(k => [k[0], [k[1].f, k[1].d], k[2]]), f); return { f: v[0], d: v[1] }; };
const step = (keys, f) => { let v = keys[0][1]; for (const [f0, x] of keys) if (f >= f0) v = x; return v; };
const bob = (f, ph = 0, a = 6, T = 46) => a * Math.sin(2 * Math.PI * (f + ph) / T);
const tilt = (f, ph = 0, a = 1.6, T = 64) => a * Math.sin(2 * Math.PI * (f + ph) / T + 1.3);
const dangle = (f, ph = 0, lift = 30) => [{ x: -26 + 4 * Math.sin((f + ph) / 9), lift: lift + 8 * Math.sin((f + ph) / 13) }, { x: 26 + 4 * Math.sin((f + ph) / 11 + 1), lift: lift * .8 + 8 * Math.sin((f + ph) / 15 + 2) }];
const talk = (f, a, b, on, off) => f >= on && f < off ? (Math.floor((f - on) / 3) % 2 ? a : b) : null;

// ---- NEW GUY shot 1: left of the toilet, faces the lens; his right hand on the hip (screen-left), screen-right arm out to the flush lever.
// f0-7 smug ("If you"); f8-10 presses the lever (hand down) and snaps to closed happy eyes + open laughing mouth ("flush" f11); held to f41, small bob.
function ng1(t, ch) { const f = F(t);
  const R = P2([[0, { f: .85, d: .3 }], [9, { f: .9, d: .5 }, 6], [18, { f: .85, d: .36 }, 8]], f);
  const face = step([[0, 'k:smug'], [9, 'k:laugh']], f);
  const head = tr([[0, -3], [9, 5, 6]], f) + tilt(f, 5, 1.5), rot = tr([[0, 2], [9, -2, 6]], f) + tilt(f, 21, 1);
  return { view: 'front', dir: 1, x: 0, y: bob(f, 0, 5, 44), rot, head, feet: dangle(f, 0, 6), farArmFront: true,
    hands: [{ f: .35, d: .55, bow: -.9 }, { f: R.f, d: R.d, bow: .2 }], face, blink: face === 'k:smug' ? blinkAt(t, 2.6, .1) : null, held: [] }; }

// ---- NEW GUY shot 6 (night, close): f500-506 wince, screen-right arm to the lever; f507-508 SNAP: wide eyes, small "o" mouth (flush);
// ~f510 recoil (eyes shut); f512-530 relaxed smile, brows up, screen-left arm up holding the wall rail; one sweat drop all shot.
function ng6(t, ch) { const f = F(t);
  const R = P2([[0, { f: .7, d: .45 }], [506, { f: .8, d: .62 }, 6], [513, { f: .4, d: .6 }, 8]], f);
  const L = P2([[0, { f: .3, d: .6 }], [512, { f: .55, d: -.85 }, 8]], f);
  const face = step([[0, 'k:nervous'], [507, 'k:afSweat'], [510, 'k:nervous'], [513, 'k:nervousSmile']], f);
  const head = tr([[0, 4], [507, -4, 6], [510, 7, 6], [513, -3, 8]], f) + tilt(f, 9, 1.4), rot = tr([[0, 0], [510, -4, 6], [516, 2, 8]], f) + tilt(f, 30, 1);
  return { view: 'front', dir: 1, x: 0, y: bob(f, 7, 5, 48), rot, head, feet: dangle(f, 3, 20), farArmFront: true,
    hands: [{ f: L.f, d: L.d, bow: .3 }, { f: R.f, d: R.d, bow: .2 }], face, blink: null, held: [] }; }

// ---- COMMANDER shot 12: in the blue doorway, arms crossed, glare; ~f1062-1070 leans to the new guy (screen right), then the camera leaves him.
function cmd12(t, ch) { const f = F(t);
  const face = step([[0, 'k:annoyed'], [1040, 'k:angry']], f);
  const rot = tr([[0, 0], [1062, 7, 8], [1076, 3, 10]], f) + tilt(f, 40, 1.1), head = tr([[0, 0], [1062, 6, 8], [1076, 2, 10]], f) + tilt(f, 9, 1.4);
  return { view: 'front', dir: 1, x: 0, y: bob(f, 17, 5, 52), rot, head, feet: [{ x: -22, lift: 0 }, { x: 22, lift: 0 }], farArmFront: true,
    hands: [{ f: -.35, d: .38, bow: .2, over: true }, { f: -.35, d: .32, bow: .2, over: true }], face, blink: blinkAt(t, 2.9, .7), held: [] }; }

// ---- NEW GUY shot 12: f1007-1034 stiff, round scared eyes, arms down ("get lost from one"); ~f1038 snaps to a wide innocent smile ("flush?" f1040);
// ~f1054-1066 hand on hip, explaining ("Well," f1061); f1074-1094 slides to centre (act pos), smug half-lids ("a spaceship toilet");
// ~f1098 turns in profile to the toilet coming apart and points ("doesn't" f1099); f1102-1113 back to the lens, shrug smile ("have pipes.").
function ng12(t, ch) { const f = F(t);
  const L = P2([[0, { f: .15, d: .95 }], [1038, { f: .2, d: .85 }, 6], [1054, { f: .35, d: .55 }, 8], [1102, { f: .9, d: -.15 }, 6]], f);
  const R = P2([[0, { f: .15, d: .95 }], [1038, { f: .2, d: .85 }, 6], [1054, { f: .7, d: .1 }, 8], [1068, { f: .35, d: .55 }, 8], [1097, { f: 1.0, d: -.05 }, 6], [1102, { f: .9, d: -.15 }, 6]], f);
  let face = step([[0, 'k:afSweat'], [1038, 'k:happy'], [1054, 'k:smug'], [1074, 'k:smug'], [1097, 'k:browUp'], [1102, 'k:happy']], f);
  face = talk(f, 'k:talk', 'k:smug', 1056, 1068) || face;
  const view = f >= 1097 && f < 1102 ? '34' : 'front';
  const head = tr([[0, 0], [1038, 4, 6], [1054, -3, 8], [1074, 3, 8], [1097, 8, 6], [1102, 0, 6]], f) + tilt(f, 3, 1.5);
  const rot = tr([[0, 0], [1054, 3, 8], [1074, -2, 8], [1102, 0, 6]], f) + tilt(f, 15, 1);
  return { view, dir: 1, x: 0, y: bob(f, 3, 5, 46), rot, head, feet: [{ x: -22, lift: 0 }, { x: 22, lift: 0 }], farArmFront: true,
    hands: [{ f: L.f, d: L.d, bow: f >= 1054 && f < 1097 ? -.9 : .2 }, { f: R.f, d: R.d, bow: .2 }], face, blink: face === 'k:smug' ? blinkAt(t, 2.4, .3) : null, held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('ng1', ng1, 'new guy shot 1: smug, flushes, laughs'), sty('ng6', ng6, 'new guy shot 6: wince, flush snap, relief, sweat'),
  sty('cmd12', cmd12, 'commander shot 12: doorway, arms crossed, glare, leans'), sty('ng12', ng12, 'new guy shot 12: scared, innocent smile, explains, points at the exploded toilet')];
export default { title: 'ASTRO-FLUSH toilet: episode moves', dur: 1300 / 30, styles: STY };
export const front = { title: 'ASTRO-FLUSH toilet: episode moves', dur: 1300 / 30, styles: STY };

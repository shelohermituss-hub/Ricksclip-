// EPISODE MOVES, astro-flush-study place mc (mission control), shots 3 (f120-283, rendered to f410) and 10 (f803-866). Stretch builder mc, 2026-11-22.
// Every act starts at film frame 0 (OFF = 0), so f below = FILM frame = his reference frame. Snap = 2-3 frames, holds float (bob 2-4 cm, tilt).
// Board: refs/SHOT_BOARD.md section 3 (shot 3 and shot 10 rows). Hands: front view [screen-left, screen-right] as {f, d} in arm lengths.
import { blinkAt, cycle } from './motion/rig.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 3) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
function tr(keys, f) { let v = keys[0][1]; for (let i = 1; i < keys.length; i++) { const [f0, to, n = 3] = keys[i]; if (f <= f0) break; const u = snap(f - f0, n); v = Array.isArray(to) ? v.map((a, j) => a + (to[j] - a) * u) : v + (to - v) * u; } return v; }
const P2 = (keys, f) => { const v = tr(keys.map(k => [k[0], [k[1].f, k[1].d], k[2]]), f); return { f: v[0], d: v[1] }; };
const step = (keys, f) => { let v = keys[0][1]; for (const [f0, x] of keys) if (f >= f0) v = x; return v; };
// weightless float: slow bob (6-8 rig px = 3-4 cm) + slight tilt, phase per character so heads bob out of step
const bob = (f, ph = 0, a = 7, T = 46) => a * Math.sin(2 * Math.PI * (f + ph) / T);
const tilt = (f, ph = 0, a = 1.6, T = 64) => a * Math.sin(2 * Math.PI * (f + ph) / T + 1.3);
const FEET = [{ x: -34, lift: 0 }, { x: 32, lift: 0 }], WALK_M = 1.65;
const REST = [{ f: .2, d: .9, bow: .3 }, { f: .2, d: .9, bow: .3 }];

// ---- DIRECTOR, shot 3. 149 enters right (walk glide in film.json acts 149-178), bouncy walk to the left, 3/4 facing left;
// 176-190 "exactly when": faces front (snap 178), screen-right index up beside the head; 192-220 turned to the screen (back view, head up);
// 224 snaps to front, closed smug eyes on GO ("flush."); 236-248 both arms out = shrug ("So" 240); 252-256 looks at the button (head down/right);
// 256-262 screen-right arm out to the NO GO button (6 frames, eased); 263 finger on the button (262-264 press); 268-283 arm back, flat stare,
// head a little down ("is no flushing"); 284-410 (shot 4 monitor picture) holds the stare with a quiet float, small head shake 330-350.
function dir3(t, ch) { const f = F(t) + 0;
  const walking = f >= 149 && f < 179, wt = (f - 149) / 30;
  // round 2: PLANTED feet. The act glides the card linearly WALK_M metres in 30 f; rig px per metre on the card = PPM / card sx (0.8).
  const PPM = 470 / .8, Sx = WALK_M * PPM / 6, C = walking ? cycle(wt, { T: 5 / 30, S: Sx, dir: -1, lift: 34 }) : null;
  const hop = walking ? -14 * Math.abs(Math.sin(Math.PI * C.p)) : 0;                       // bounce: up between foot falls (every 5 f)
  const view = f < 179 ? '34' : f < 192 ? 'front' : f < 224 ? 'back' : 'front', dir = f < 179 ? -1 : 1;
  const R = P2([[0, { f: .25, d: .85 }], [178, { f: .55, d: -.75 }, 3], [190, { f: .25, d: .85 }, 3], [224, { f: .3, d: .8 }, 3], [236, { f: .95, d: -.1 }, 3], [249, { f: .25, d: .85 }, 3],
    [256, { f: .98, d: .32 }, 6], [263, { f: 1.0, d: .4 }, 2], [268, { f: .25, d: .85 }, 5]], f);
  const L = P2([[0, { f: .25, d: .85 }], [224, { f: .3, d: .8 }, 3], [236, { f: .95, d: -.1 }, 3], [249, { f: .25, d: .85 }, 3]], f);
  const swing = walking ? .25 * Math.sin(Math.PI * 2 * (f - 149) / 10) : 0;   // 192-220: 3/4 from behind is not a rig view: 'back' with the head up
  const head = tr([[0, 0], [178, 4, 3], [192, -12, 3], [224, 2, 3], [252, 10, 3], [268, 6, 3], [330, 3, 8], [350, 6, 8]], f) + tilt(f, 11) + (f > 330 && f < 350 ? 4 * Math.sin((f - 330) * Math.PI / 5) : 0);
  const rot = tr([[0, 0], [178, 0], [236, -2, 3], [249, 0, 3], [256, 4, 6], [268, 0, 5]], f) + .6 * tilt(f, 30);
  const face = step([[0, 'k:standard'], [176, 'k:talk'], [178, 'k:browUp'], [192, 'k:standard'], [224, 'k:smug'], [236, 'k:skeptical'], [252, 'k:standard'], [262, 'k:concentrate'], [268, 'k:afEyeRoll'], [300, 'k:annoyed'], [340, 'k:afEyeRoll'], [375, 'k:skeptical']], f);
  const feet = walking ? C.feet.map(ft => ({ x: ft.x - C.bx, lift: ft.lift, toe: ft.toe })) : FEET;
  return { view, dir, x: 0, y: hop + (walking ? 0 : bob(f, 0, 6)), rot, head, feet, farArmFront: view !== 'back',
    hands: [{ f: L.f + swing, d: L.d, bow: .3 }, { f: R.f - swing, d: R.d, bow: .3, over: f >= 178 && f < 190 }], face, blink: face === 'k:standard' ? blinkAt(t) : null, held: [] }; }

// ---- CONTROLLERS, shot 3: faces to camera behind the desk, out-of-step float; 244-268 eyes big and round, heads turn to the director (screen right).
// 284-410: quiet: back to standard, small head turns to each other. ph = phase, lk = head turn toward the director.
function ctl3(ph, lk) { return (t, ch) => { const f = F(t);
  const look = tr([[0, 0], [176 + ph % 4, lk, 3], [226 + ph % 5, lk * .3, 3], [244 + ph % 5, lk, 3], [290 + ph % 7, lk * .4, 8], [360, 0, 10]], f);
  const face = step([[0, 'k:standard'], [176 + ph % 4, 'k:open'], [226 + ph % 5, 'k:standard'], [264 + ph % 3, 'k:surprised'], [290 + ph % 4, 'k:open'], [320, 'k:standard']], f);
  const rise = 260 * (1 - snap(f - 131, 8));                                                // round 2: heads rise in from the bottom f131-139 (hidden behind the desk before)
  return { view: 'front', dir: 1, x: 0, y: rise + bob(f, ph * 9, 7, 40 + ph), rot: tilt(f, ph * 13, 1.2), head: look + tilt(f, ph * 7, 2), feet: FEET,
    hands: [{ f: .55, d: .55, bow: .3 }, { f: .55, d: .55, bow: .3 }], face, blink: face === 'k:standard' ? blinkAt(t, 2.2 + ph * .1, ph * .3) : null, held: [] }; }; }

// ---- DIRECTOR, shot 10 (f803-866): 803-805 round shocked eyes, 806 "o" mouth, ~812 angry brows, 815-818 gritted teeth ("drifting"), 821 wide open
// ("off"), 827 teeth, 830-833 open ("course."), 836 teeth; 839-842 lunges to the lens (pos glide in acts); 842-845 fist shoots up on his left
// (screen right) in 3 frames ("Who" 842, "flushed?" 845); 848-857 shouting, a new mouth every 3 frames; 860 teeth; 863-866 mouth shut, glare, fist up.
function dir10(t, ch) { const f = F(t);
  const shout = ['k:afGrit', 'k:angry', 'k:afGrit', 'k:frustrated'];                        // round 2: bared teeth, a new mouth every 3 f (no X-eyed kit faces)
  let face = step([[0, 'k:open'], [806, 'k:surprised'], [812, 'k:angry'], [815, 'k:afGrit'], [821, 'k:angry'], [827, 'k:afGrit'], [830, 'k:angry'], [836, 'k:afGrit'],
    [842, 'k:afGrit'], [860, 'k:afGrit'], [863, 'k:annoyed']], f);
  if (f >= 848 && f < 860) face = shout[Math.floor((f - 848) / 3) % shout.length];
  const R = P2([[0, { f: .25, d: .85 }], [812, { f: .45, d: .55 }, 3], [842, { f: .35, d: -1.0 }, 3]], f);
  const L = P2([[0, { f: .25, d: .85 }], [812, { f: .45, d: .55 }, 3], [839, { f: .3, d: .75 }, 3]], f);
  const lunge = snap(f - 839, 3), shake = f >= 846 && f < 860 ? 2.5 * Math.sin((f - 846) * Math.PI / 3) : 0;
  return { view: 'front', dir: 1, x: 0, y: bob(f, 5, 5, 40) + 10 * lunge, rot: -4 * lunge + tilt(f, 3, 1), head: tr([[0, -2], [812, 3, 3], [839, -6, 3], [863, -3, 4]], f) + shake,
    feet: FEET, hands: [{ f: L.f, d: L.d, bow: .3 }, { f: R.f, d: R.d, bow: .25, over: f >= 842 }], face, blink: null, held: [] }; }

// ---- CONTROLLERS, shot 10: round eyes all through; from ~845 ctlBlue ducks (drops 60 px behind the desk).
function ctl10(ph, duck) { return (t, ch) => { const f = F(t);
  const d = duck ? 70 * snap(f - 845, 3) : 0;
  return { view: 'front', dir: 1, x: 0, y: bob(f, ph * 9, 6, 40 + ph) + d, rot: tilt(f, ph * 13, 1.2), head: tr([[0, 0], [803, 4], [845 + ph % 3, duck ? -8 : 6, 3]], f) + tilt(f, ph * 7, 2), feet: FEET,
    hands: duck ? [{ f: .5, d: .55 - .9 * snap(f - 845, 3), bow: .3, over: f >= 846 }, { f: .5, d: .55 - .9 * snap(f - 845, 3), bow: .3, over: f >= 846 }] : [{ f: .55, d: .55, bow: .3 }, { f: .55, d: .55, bow: .3 }],
    face: f >= 845 && duck ? 'k:scared' : 'k:open', blink: null, held: [] }; }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('dir3', dir3, 'director shot 3: walk in, exactly-when finger, turn to screen, smug GO, shrug, press NO GO, flat stare'),
  sty('fao3', ctl3(0, 5), 'FAO shot 3'), sty('capcom3', ctl3(3, 6), 'CAPCOM shot 3'), sty('guido3', ctl3(6, 7), 'GUIDO shot 3'),
  sty('dir10', dir10, 'director shot 10: shocked, gritted, lunge, fist up, shout'),
  sty('fao10', ctl10(0, false), 'FAO shot 10'), sty('capcom10', ctl10(3, true), 'CAPCOM shot 10 (ducks)'), sty('guido10', ctl10(6, false), 'GUIDO shot 10')];
export default { title: 'ASTRO-FLUSH mc: episode moves', dur: 900 / 30, styles: STY };
export const front = { title: 'ASTRO-FLUSH mc: episode moves', dur: 900 / 30, styles: STY };

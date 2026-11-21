// EPISODE MOVES, yellow-fire-trucks S2 THE SECRET (film 9.60-15.80 s = frames 288-474, plan rows 9-13, script lines 3-4). S2 stretch builder 2026-11-21.
// STUDIO MOTION form (./studio_ep.mjs, copy of s1's: Rick's snap, settle, DEAD STILL in holds), drawn new on every frame (tween.ones).
// Both moves' clocks start at film frame 288 (the first act that sets the pose; re-setting the same pose at 328 does NOT restart it, LECONS): move frame + 288 = FILM frame.
// Act frames are plain frame numbers from voice/words.json (s x 30, rounded). Written facing +x (dir 1); the act's dir -1 mirrors.
// Rig units: y down, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX, ch.hipY. hands[0] = far (held3d 'L'), hands[1] = near (held3d 'R').
import { snap, tr, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
export const N = 187;
// words.json: But 294, fireman 303, had 315, second 325, job 332, By 356, day 360, was 376, eye 385, doctor 392, and 407, knew 415, something 419,
// strange 429, about 443, red 453
export const W = { but: 294, fireman: 303, second: 325, job: 332, day: 360, eye: 385, doctor: 392, and: 407, knew: 415, strange: 429, red: 453 };

// ---- HERO m:he_enter (yard outfit, helmet on), f288-327: he walks in from the shop door with four even strides (the card glides 2.4 m, film.json),
//   arms swinging against the legs; he leaves the frame on the right about f300 and the card is hidden at f322 (the helmet doff is off screen in this round).
function heEnter(t, ch) { const f = F(t) + 288, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  let l0 = 0, l1 = 0, sw = 0;
  for (let k = 0; k < 4; k++) { const s = 289 + k * 7, g = f - s, l = 26 * (snap(g, 3) - snap(g - 3, 4)); if (k % 2) l1 += l; else l0 += l; sw += (k % 2 ? -1 : 1) * (snap(g, 4) - snap(g - 4, 3)); }
  const brim = snap(f - 306, 6), back = snap(f - 311, 5), ant = 4 * (snap(f - 304, 2) - snap(f - 307, 3));   // off screen from ~f300 (board round), so it plays early and settles before the card hides at 322
  const head = -2 + 4 * brim - 6 * back + ring(f, 312, 2, 8);
  const n = { wx: Wd * .7 + 24 * sw, wy: ch.hipY - 14 - 8 * Math.abs(sw) }, r = { wx: -Wd * .7 - 24 * sw, wy: ch.hipY - 14 - 8 * Math.abs(sw) };
  const up = { wx: Wd * .2, wy: S - .66 * L }, over = { wx: -Wd * .35, wy: S - .75 * L };
  const m = (a, b, u) => ({ wx: a.wx + (b.wx - a.wx) * u, wy: a.wy + (b.wy - a.wy) * u });
  const h1 = m(m(n, up, brim), over, back);
  return { view: '34', dir: 1, x: 0, y: dip(f, 289, 5, 4) + dip(f, 296, 5, 4) + dip(f, 303, 5, 4) + dip(f, 310, 4, 4) + ant, rot: 3 - 2 * brim, head,
    feet: [{ x: -26, lift: l0 }, { x: 26, lift: l1 }], farArmFront: true, hands: [{ ...r, bow: .45 }, { ...h1, bow: .3, over: true }], held: [] }; }

// ---- HERO m:he_shop (shop coat, head mirror up), f328-474.
//   f328-338 the sweep finishes: near arm comes down from behind the shoulder (snap 10), settle ring
//   f334-352 the coat: both fists at the lapels, two short tugs down (f334, f343), chest out; DEAD STILL f356-371
//   f372-385 "eye": near fist rises to the mirror band, knuckle up (anticipation 3 f down), on f385 the knuckle FLICKS (snap 3, 8 px up) and the head
//            dips forward 4 (the mirror comes down in the drawing request); fist back down f394 (snap 10); DEAD STILL f404
//   f405-418 "knew": near fist (toy, held3d R) rises out to the lamp at shoulder height (snap 12), head tilts 6 (a man checking what he knows)
//   f429-446 "strange": the toy goes a hand's width further out, out of the cone (snap 7), held, and back in (snap 8); head leans in 3
//   f453     "red": head turns to the lens (head -7, snap 10, the face glanceCam does the eyes); DEAD STILL from 464
function heShop(t, ch) { const f = F(t) + 288,   // the move clock runs from the act that first sets the pose (heroShop, hidden, f288), not from the f328 re-set
  S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const down = snap(f - 328, 10), lap = snap(f - 334, 6) - snap(f - 352, 10), tug = 10 * (snap(f - 336, 3) - snap(f - 339, 4)) + 10 * (snap(f - 345, 3) - snap(f - 348, 4));
  const rise = snap(f - 372, 10) - snap(f - 394, 10), flick = 8 * (snap(f - W.eye, 3) - snap(f - W.eye - 4, 6)), ant = 3 * (snap(f - 381, 2) - snap(f - W.eye, 2));
  const lift = snap(f - 405, 12), out = snap(f - W.strange, 7) - snap(f - 440, 8), look = snap(f - W.red, 10);
  const head = 2 + ring(f, 330, 2, 8) - 4 * (snap(f - W.eye, 4) - snap(f - 396, 10)) + 6 * (snap(f - W.knew, 8) - snap(f - W.red, 10)) + 3 * out - 7 * look;
  const m = (a, b, u) => ({ wx: a.wx + (b.wx - a.wx) * u, wy: a.wy + (b.wy - a.wy) * u });
  const rest1 = { wx: Wd * .75, wy: ch.hipY - 14 }, rest0 = { wx: -Wd * .75, wy: ch.hipY - 14 };
  const behind = { wx: -Wd * .35, wy: S - .75 * L }, lapel1 = { wx: Wd * .62, wy: ch.hipY - 30 + tug }, lapel0 = { wx: -Wd * .58, wy: ch.hipY - 30 + tug };
  const brow = { wx: Wd * .62, wy: S - .72 * L - flick + ant }, lamp = { wx: Wd * .3 + .8 * L, wy: S - .1 * L }, far = { wx: Wd * .3 + .95 * L, wy: S - .16 * L };
  let h1 = m(behind, rest1, down); h1 = m(h1, lapel1, lap); h1 = m(h1, brow, rise); h1 = m(h1, lamp, lift); h1 = m(h1, far, out);
  const h0 = m(rest0, lapel0, lap);
  return { view: '34', dir: 1, x: 0, y: dip(f, 352, 3, 4), rot: 1 - 2 * lap + 2 * lift, head, feet: [{ x: -26, lift: 0 }, { x: 26, lift: 0 }], farArmFront: true,
    hands: [{ ...h0, bow: .45 }, { ...h1, bow: lift > .5 ? .25 : .4, over: true }], held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('he_enter', heEnter, 'walks in from the door, fist to the helmet brim, sweeps it back onto the stand'),
  sty('he_shop', heShop, 'coat tug, knuckle flicks the head mirror on "eye", toy up to the lamp, out of the cone and back, glance to the lens')];
export default { title: 'FIRETRUCKS S2: episode moves', dur: N / 30, styles: STY };
export const front = { title: 'FIRETRUCKS S2: episode moves', dur: N / 30, styles: STY };
// motion-gate plan (moves/tools/check_motion_ep.mjs): strikes + holds in frames from the move start (both 288)
export const PLAN = {
  he_enter: { who: 'hero', view: '34', strikes: [{ name: 'sweep (off screen) f311', f0: 23, ch: 'h1x', to: 'min' }], holds: [], acting: [0, 33] },
  he_shop: { who: 'heroShop', view: '34', strikes: [{ name: 'flick "eye" f385', f0: W.eye - 288, ch: 'h1y', to: 'min' }, { name: 'out "strange" f429', f0: W.strange - 288, ch: 'h1x', to: 'max' }],
    holds: [[76, 83, 'coat on, dead still'], [176, 186, 'looks at us, dead still']], acting: [40, 175] },
};

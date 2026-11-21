// EPISODE MOVES, yellow-fire-trucks S8 THE PAYOFF (film 58.45-63.25 s = frames 1754-1898, plan rows 54-58, script line 14). S8 stretch builder 2026-11-21.
// STUDIO MOTION form (./studio_ep.mjs, same copy as s1: Rick's snap, settle, DEAD STILL in holds), drawn new on every frame (tween.ones).
// Every move starts at its film.json act frame 1754, so move frame f = film frame - 1754 (ch_splat counts from "into": f - 122).
// Written facing +x (dir 1). Rig units: y down, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX, ch.hipY. hands[0] = far, hands[1] = near.
import { snap, tr, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
export const N = 165;   // the gate looks up to 20 f past a strike; the stretch itself ends at move frame 144
// words.json (s x 30 - 1754): That 5, evening 14, chief 33, marched 40, out 49, his 61, beautiful 66, red 76, truck 86, and 95, walked 103, straight 110, into 122, it 132
export const W = { that: 5, evening: 14, chief: 33, marched: 40, out: 49, beaut: 66, red: 76, and: 95, walked: 103, straight: 110, into: 122, it: 132 };
const STEP = 14, S0 = 40;   // the parade march: a step every 14 f from "marched"

// ---- CHIEF m:ch_march (SIDE, faces his truck), rows 55-57. Visible from f33 ("chief"); hidden in the POV (the camera is his eyes).
//   f33-40  he sets himself: chest out (rot -5), chin up (head -9), a breath in (rises 6 px)
//   f40-     the parade march: high knee every 14 f (lift 34, snap 4 up / 5 down), body bob 5 px per step, arms swing stiff
//   f66     "beautiful": the near fist goes out level to pat a fender that is a little further left than he thinks (snap 8), stays out
//   f116-121 the last step is the biggest (lift 44): it is cut by the bump (the chiefDown card takes over at 1876)
function chMarch(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const set = snap(f - W.chief, 7);
  let l0 = 0, l1 = 0, sw = 0, bob = 0;
  for (let k = 0; k < 7; k++) { const s = S0 + k * STEP, g = f - s; if (g < -1 || g > STEP + 6) continue; const big = k >= 5 ? 44 : 34;
    const l = big * (snap(g, 4) - snap(g - 5, 5)); if (k % 2) l1 += l; else l0 += l; sw += (k % 2 ? -1 : 1) * (snap(g, 5) - snap(g - 7, 7)); bob += 5 * (snap(g, 4) - snap(g - 6, 6)); }
  const pat = snap(f - W.beaut + 2, 8);
  const swing = (s) => ({ wx: s * 18 * sw + Wd * .2, wy: ch.hipY - 18 - 8 * Math.abs(sw) });
  let near = swing(1), far = swing(-1);
  near = { wx: near.wx + (Wd * .6 + .95 * L - near.wx) * pat, wy: near.wy + (S + .05 * L - near.wy) * pat };
  return { view: 'side', dir: 1, x: 0, y: -6 * set - bob, rot: -5 * set, head: -9 * set, feet: [{ x: -20, lift: l0 }, { x: 22, lift: l1 }], farArmFront: false,
    hands: [{ ...far, bow: .35 }, { ...near, bow: pat > .5 ? .15 : .35, over: true }], held: [] }; }

// ---- CHIEF m:ch_splat (chiefDown card: helmet over the eyes, moustache bent), row 58, from film 1876 ("into").
//   f0      the bump: body pressed into the truck nose (x +10, rot +7), both arms flung up flat on the grille; impact dip 10 px / 4 f
//   f0-12   head rebound ring 4, hands slide 6 px down the paint and stop; DEAD STILL from f14
function chSplat(t, ch) { const f = F(t) - W.into, S = ch.sh[1], L = ch.armL, Wd = ch.handX; const slide = 6 * snap(f - 2, 10);
  return { view: 'side', dir: 1, x: 10, y: dip(f, 0, 10, 4), rot: 7 - 3 * snap(f - 1, 6), head: 3 + ring(f, 0, 4, 12), feet: [{ x: -18, lift: 0 }, { x: 26, lift: 0 }], farArmFront: false,
    hands: [{ wx: Wd * .5 + .62 * L, wy: S - .5 * L + slide, bow: .2 }, { wx: Wd * .6 + .7 * L, wy: S - .08 * L + slide, bow: .2, over: true }], held: [] }; }

// ---- HERO m:he_mug (3/4, faces the Chief), rows 55-58. Mug in the near fist at his chest from the start, steam rising (s8_yard.js).
//   f0-     still, mug at chest: he knows what is coming and says nothing; one slow glance from the Chief to his mug and back (f70-90, head only)
//   f124    the mug rises to his chin (snap 9); f133 the unhurried SIP (head tips back 4, the mug tips with it), DEAD STILL from f146
function heMug(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const up = snap(f - 124, 9), sip = snap(f - 133, 6), glance = snap(f - 70, 8) - snap(f - 84, 8);
  return { view: '34', dir: 1, x: 0, y: 0, rot: -1 * sip, head: 2 + 3 * glance - 4 * sip, feet: [{ x: -26, lift: 0 }, { x: 24, lift: 0 }], farArmFront: true,
    hands: [{ wx: -Wd * .7, wy: ch.hipY - 20 }, { wx: Wd * .25 + .3 * L - .08 * L * up, wy: S + .42 * L - .36 * L * up - .04 * L * sip, bow: .35, over: true }], held: [] }; }

// ---- OLD-TIMER m:ot_bite (3/4), by the lemon truck: sees it coming and takes a bite on "and" (61.64 = f95): near fist to the mouth (snap 8), head dips 3; DEAD STILL after
//   (no sandwich prop exists: the fist is empty, see STATE.md requests)
function otBite(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX; const b = snap(f - 91, 8), nod = 3 * (snap(f - W.and, 4) - snap(f - W.and - 4, 8));
  return { view: '34', dir: 1, x: 0, y: 0, rot: -3, head: 4 + nod, feet: [{ x: -30, lift: 0 }, { x: 28, lift: 0 }], farArmFront: true,
    hands: [{ wx: -Wd * .8, wy: ch.hipY - 22 }, { wx: Wd * .2 + (.05 * L) * b, wy: S + .35 * L - .55 * L * b, over: true }], held: [] }; }

// ---- ROOKIE m:rk_up (3/4): stands beside the hero's side of the yard, heels together; on "it" (f132) both fists push his own helmet UP (snap 6) and stay at the brim
function rkUp(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX; const p = snap(f - W.it + 2, 6);
  const rest = { wx: Wd * .75, wy: ch.hipY - 14 }, up = { wx: Wd * .3, wy: S - .82 * L };
  const h = { wx: rest.wx + (up.wx - rest.wx) * p, wy: rest.wy + (up.wy - rest.wy) * p };
  return { view: '34', dir: 1, x: 0, y: -4 * p + dip(f, W.it + 6, 4, 4), rot: 0, head: -4 * p, feet: [{ x: -26, lift: 0 }, { x: 24, lift: 0 }], farArmFront: true,
    hands: [{ ...h, wx: -h.wx, bow: .5 }, { ...h, bow: .5, over: true }], held: [] }; }

// ---- SCEPTIC m:sc_open (3/4): arms crossed high, DEAD STILL; on "it" (f132) the ONLY time his arms fall open (snap 8), a lean back 3
function scOpen(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX; const o = snap(f - W.it, 8);
  const c0 = { wx: -Wd * .5, wy: S + .26 * L }, c1 = { wx: Wd * .55, wy: S + .22 * L }, o0 = { wx: -Wd * .9 - .3 * L, wy: ch.hipY - 30 }, o1 = { wx: Wd * .9 + .3 * L, wy: ch.hipY - 30 };
  const m = (a, b) => ({ wx: a.wx + (b.wx - a.wx) * o, wy: a.wy + (b.wy - a.wy) * o });
  return { view: '34', dir: 1, x: 0, y: 0, rot: -3 * o, head: -2 - 3 * o, feet: [{ x: -28, lift: 0 }, { x: 28, lift: 0 }], farArmFront: true,
    hands: [{ ...m(c1, o0), bow: .3, over: o < .5 }, { ...m(c0, o1), bow: .3, over: true }], held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('ch_march', chMarch, 'parade march, chin up, eyes shut, fist out to pat'), sty('ch_splat', chSplat, 'flat against the truck nose'),
  sty('he_mug', heMug, 'calm with the mug, the sip'), sty('ot_bite', otBite, 'sees it coming, takes a bite'), sty('rk_up', rkUp, 'pushes his helmet up to see'),
  sty('sc_open', scOpen, 'arms crossed, fall open once')];
export default { title: 'FIRETRUCKS S8: episode moves', dur: N / 30, styles: STY };
export const front = { title: 'FIRETRUCKS S8: episode moves', dur: N / 30, styles: STY };
export const PLAN = {
  ch_march: { who: 'chief', view: 'side', strikes: [{ name: 'pat "beautiful" f66', f0: W.beaut - 2, ch: 'h1x', to: 'max' }], holds: [], acting: [33, 121] },
  ch_splat: { who: 'chiefDown', view: 'side', strikes: [], holds: [[138, N - 1, 'flat on the truck']], acting: [122, 137] },
  he_mug: { who: 'hero', view: '34', strikes: [{ name: 'mug up f124', f0: 124, ch: 'h1y', to: 'min' }], holds: [[0, 69, 'waits'], [98, 123, 'waits'], [146, N - 1, 'sipped']], acting: [70, 145] },
  ot_bite: { who: 'oldTimer', view: '34', strikes: [{ name: 'bite f91', f0: 91, ch: 'h1y', to: 'min' }], holds: [[0, 90, 'watches'], [110, N - 1, 'chews']], acting: [91, 109] },
  rk_up: { who: 'rookie', view: '34', strikes: [{ name: 'helmet up "it" f130', f0: W.it - 2, ch: 'h1y', to: 'min' }], holds: [[0, 129, 'heels together']], acting: [130, 144] },
  sc_open: { who: 'sceptic', view: '34', strikes: [{ name: 'arms open "it" f132', f0: W.it, ch: 'h1x', to: 'max' }], holds: [[0, 131, 'stone']], acting: [132, 144] },
};

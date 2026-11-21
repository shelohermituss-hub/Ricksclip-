// EPISODE MOVES, yellow-fire-trucks S6 THE ANSWER (film 40.05-52.54 s = frames 1202-1576, plan rows 36-48, script lines 10-12). S6 stretch builder 2026-11-21.
// STUDIO MOTION form (./studio_ep.mjs, the same copy as S1/S3). Each move starts at its film.json act: f = F(t) + the act frame, so all numbers below are FILM frames.
// Written facing +x (dir 1); the act's dir -1 mirrors. Rig units: y down, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX, ch.hipY.
// hands[0] = far (held3d 'L': the Milkman's milk bottle), hands[1] = near.
import { snap, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
// words.json frames (s x 30): A 1318, bright 1324, red 1331, truck 1339, turns 1348, dark 1357, gray 1368, like 1384, a 1390, red 1394, ball 1400, that 1408,
// vanishes 1414, in 1427, the 1433, evening 1436, grass 1445; But 1470, yellow 1474, green 1483, That's 1508, color 1523, your 1530, eyes 1535, hold 1544,
// on 1551, to 1556, the 1561, longest 1565, And 1576
export const W = { red: 1331, gray: 1368, like: 1384, red2: 1394, ball: 1400, vanish: 1414, inn: 1427, evening: 1436, grass: 1445, shrug: 1452,
  but: 1470, green: 1483, color: 1523, eyes: 1535, hold: 1544, to: 1556, longest: 1565, and: 1576 };
const mix = (a, b, u) => ({ wx: a.wx + (b.wx - a.wx) * u, wy: a.wy + (b.wy - a.wy) * u });

// ---- KID m:kid_park (3/4, in the park lawn), rows 42-44. Act at f1376.
//   1376-1393 the TWO-FISTED THROW wind-up: both fists go up behind the head (snap 10 from 1380), body leans back 8
//   1394 "red": the throw: both fists snap forward and down (snap 4), lean forward 10, a dip on the release; DEAD STILL watching 1402-1416
//   1418-1430 the quick run in (film.json moves the card; feet alternate on 4s); 1431 the sudden stop with the head tilted (ring)
//   1433 "the": bent forward, hands on knees (crouch-search, y +14, rot 14); 1438 "evening": parting the grass with both fists low a step from the ball
//   1445 "grass": the step over: the near foot lifts high (snap 4) and comes down beyond the ball (the card moves); 1452 the SHRUG to the lens, both arms up, palms up; DEAD STILL
function kidPark(t, ch) { const f = F(t) + 1376, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const wind = snap(f - 1380, 10) - snap(f - W.red2, 4), thr = snap(f - W.red2, 4) - snap(f - 1416, 6);
  const run = f >= 1418 && f < 1431 ? 1 : 0, stop = ring(f, 1431, 5, 10), crouch = snap(f - 1433, 6) - snap(f - W.grass, 5), part = snap(f - 1438, 6) - snap(f - W.grass, 5);
  const over = snap(f - W.grass, 4) - snap(f - W.grass - 5, 4), shrug = snap(f - W.shrug, 6);
  const up = [{ wx: -Wd * .2, wy: S - 1.05 * L }, { wx: Wd * .25, wy: S - 1.0 * L }], fw = [{ wx: Wd * .5 + .8 * L, wy: S + .1 * L }, { wx: Wd * .7 + .82 * L, wy: S + .12 * L }];
  const hang = [{ wx: -Wd * .5, wy: ch.hipY + 6 }, { wx: Wd * .55, wy: ch.hipY + 6 }], knee = [{ wx: Wd * .3 + .35 * L, wy: ch.hipY + .55 * L }, { wx: Wd * .55 + .35 * L, wy: ch.hipY + .5 * L }];
  const grassH = [{ wx: Wd * .6 + .6 * L, wy: ch.hipY + .75 * L }, { wx: Wd * .9 + .6 * L, wy: ch.hipY + .7 * L }], sh = [{ wx: -Wd * .7 - .55 * L, wy: S - .55 * L }, { wx: Wd * .7 + .55 * L, wy: S - .55 * L }];
  const hands = [0, 1].map(i => { let h = mix(hang[i], up[i], wind); h = mix(h, fw[i], thr); h = mix(h, knee[i], crouch); h = mix(h, grassH[i], part); return mix(h, sh[i], shrug); });
  const ph = Math.floor((f - 1418) / 4) % 2;
  return { view: '34', dir: 1, x: 0, y: dip(f, W.red2, 6, 4) + 14 * crouch - 3 * shrug, rot: -8 * wind + 10 * thr + 14 * crouch + 4 * run, head: 6 * crouch + stop + 7 * shrug,
    feet: [{ x: -16, lift: run && ph ? 10 : 0 }, { x: 16 + 10 * over, lift: run && !ph ? 10 : 22 * over }], farArmFront: false, hands: [{ ...hands[0], bow: .3 }, { ...hands[1], bow: .3, over: true }], held: [] }; }

// ---- MILKMAN m:mk_cross (3/4, at the wheel in the open door of his van on the same white bar), rows 45-48. Act at f1470.
//   1470 "But": both fists on the wheel, the same careful look left (head 3, snap 10; act dir)
//   1483 "green": the head STOPS DEAD (no ring, held from 1486): he SEES the lemon dot down the street (face browUp)
//   1523 "color": the head turns with the truck as it comes (act dir flips), lean back 4
//   1544 "hold": the foot goes down: a small jolt back (snap 3) and the van stays behind the bar; eyes locked
//   1556 "to": the far fist lifts the bottle (held3d L) up to the truck like a toast (snap 8), small smile; DEAD STILL 1566-1576
function mkCross(t, ch) { const f = F(t) + 1470, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const look = 3 * snap(f - 1472, 10), stopH = snap(f - W.green, 3), turn = snap(f - W.color, 10), brake = snap(f - W.hold, 3) - snap(f - W.hold - 4, 8), toast = snap(f - W.to, 8);
  const wheel = [{ wx: Wd * .25 + .55 * L, wy: S + .45 * L }, { wx: Wd * .45 + .62 * L, wy: S + .42 * L }];
  const h0 = mix(wheel[0], { wx: Wd * .45 + .55 * L, wy: S - .75 * L }, toast);
  return { view: '34', dir: 1, x: -5 * brake, y: dip(f, W.hold, 4, 4), rot: 3 - 4 * turn - 4 * brake - 3 * toast, head: look * (1 - stopH) - 2 * stopH - 4 * turn - 3 * toast,
    feet: [{ x: -22, lift: 0 }, { x: 22, lift: 0 }], farArmFront: true, hands: [{ ...h0, bow: .3 }, { ...wheel[1], bow: .35, over: true }], held: [] }; }

// ---- ROOKIE m:rk_cab (3/4, at the wheel of the lemon truck, helmet pushed up), rows 46-48. Act at f1470.
//   both fists on the wheel; 1523 "color": chin up (head -6, snap 10), proud, sees everything; 1566 one small nod to the toasting Milkman (dip); DEAD STILL
function rkCab(t, ch) { const f = F(t) + 1470, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const chin = snap(f - W.color, 10), nod = dip(f, 1566, 5, 6);
  return { view: '34', dir: 1, x: 0, y: 0, rot: -2 * chin, head: -6 * chin + nod,
    feet: [{ x: -24, lift: 0 }, { x: 24, lift: 0 }], farArmFront: true, hands: [{ wx: Wd * .45 + .55 * L, wy: S + .35 * L, bow: .25 }, { wx: Wd * .6 + .62 * L, wy: S + .33 * L, bow: .25, over: true }], held: [] }; }

// ---- SCEPTIC m:sc_park (3/4, at the wheel of the red pumper in the park street), rows 40-41. Act at f1318.
//   proud of the shine: chest out (y -4, rot -3, snap 10 from 1324 "bright"); 1348 "turns": one glance down at his own door (head 6), back at 1362; DEAD STILL
function scPark(t, ch) { const f = F(t) + 1318, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const proud = snap(f - 1324, 10), gl = snap(f - 1348, 6) - snap(f - 1362, 8);
  return { view: '34', dir: 1, x: 0, y: -4 * proud, rot: -3 * proud, head: -3 * proud + 6 * gl,
    feet: [{ x: -24, lift: 0 }, { x: 24, lift: 0 }], farArmFront: true, hands: [{ wx: Wd * .45 + .5 * L, wy: S + .33 * L, bow: .25 }, { wx: Wd * .6 + .6 * L, wy: S + .32 * L, bow: .25, over: true }], held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('kid_park', kidPark, 'park: two-fisted throw, run, stop, crouch-search, part the grass, step over the ball, shrug'),
  sty('mk_cross', mkCross, 'at the wheel: look left, head stops dead on green, turns with the truck, brakes, toasts with the bottle'),
  sty('rk_cab', rkCab, 'lemon cab: chin up, small nod'), sty('sc_park', scPark, 'red cab in the park street: proud, glance down at the door')];
export const N = 1577;
export default { title: 'FIRETRUCKS S6: episode moves', dur: N / 30, styles: STY };
export const front = { title: 'FIRETRUCKS S6: episode moves', dur: N / 30, styles: STY };

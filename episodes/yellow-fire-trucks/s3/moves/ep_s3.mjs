// EPISODE MOVES, yellow-fire-trucks S3 THE CROSSING AT DUSK (film 15.80-25.65 s = frames 474-770, plan rows 14-21, script lines 5-6). S3 stretch builder 2026-11-21.
// STUDIO MOTION form (./studio_ep.mjs, the same copy as S1). Each move starts at its film.json act: f = F(t) + the act frame, so all numbers below are FILM frames.
// Written facing +x (dir 1); the act's dir -1 mirrors. Rig units: y down, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX, ch.hipY.
// hands[0] = far (held3d 'L': the Milkman's milk bottle), hands[1] = near.
import { snap, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
// words.json frames (s x 30): Every 485, dusk 511, red 530, kept 553, hit 569, crossings 581, sirens 608, screaming 613, lights 637, flashing 643,
// The 668, drivers 673, said 690, thing 707, I 721, never 734, saw 745, it 755, mouth shut 765
export const W = { every: 485, dusk: 511, red: 530, kept: 553, hit: 569, cross: 581, bottle: 591, scream: 613, flash: 643, the: 668, said: 690, I: 721, never: 734, saw: 745, it: 755, shut: 765 };

// ---- MILKMAN m:mk_van (3/4, standing at the wheel of his step van, the door open), rows 14-18. Act at f474.
//   474-505 both fists on the wheel rim (the bottle in the far/left fist rides on the rim), leaning in: careful creep to the white bar
//   511 "dusk": the long look LEFT (head turn = act dir 1 in film.json, here a lean and a slow head tilt, DEAD STILL 520-528)
//   530 "red": the long look RIGHT (act dir -1), straight at the dark truck; DEAD STILL 538-551
//   553 "kept": one small nod (head dip 6, snap 5), the van rolls
//   569 "hit": the bump: body thrown back 10 px (snap 3), then FROZEN stiff, shoulders up at his ears (y -10, fists jammed up to the chest), DEAD STILL 575-589
//   591 bottle check: the far fist lifts the bottle to eye height (snap 8), head tips to it; DEAD STILL 600-636
//   643 "flashing": head tips back, looking up at the beacon row (head -12), the bottle back down to the rim; lost; DEAD STILL 652-664
function mkVan(t, ch) { const f = F(t) + 474, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const lean = 4 * snap(f - 476, 10) - 4 * snap(f - W.hit, 3), nod = dip(f, W.kept, 6, 6);
  const jolt = snap(f - W.hit, 3) - snap(f - W.hit - 4, 8), freeze = snap(f - W.hit - 2, 5) - snap(f - 640, 10);
  const chk = snap(f - W.bottle, 8) - snap(f - W.flash, 8), up = snap(f - W.flash, 9);
  const look = 3 * snap(f - W.dusk, 10) - 6 * snap(f - W.red, 10) + 3 * snap(f - W.kept, 8);
  const head = look + nod * .8 - 4 * freeze + 6 * chk - 12 * up + ring(f, W.hit + 3, 4, 10);
  const wheel = [{ wx: Wd * .25 + .55 * L, wy: S + .45 * L }, { wx: Wd * .45 + .62 * L, wy: S + .42 * L }];
  const jam = [{ wx: Wd * .1 + .3 * L, wy: S + .1 * L }, { wx: Wd * .3 + .34 * L, wy: S + .08 * L }];
  const mix = (a, b, u) => ({ wx: a.wx + (b.wx - a.wx) * u, wy: a.wy + (b.wy - a.wy) * u });
  let h0 = mix(wheel[0], jam[0], freeze), h1 = mix(wheel[1], jam[1], freeze);
  h0 = mix(h0, { wx: Wd * .3 + .5 * L, wy: S - .25 * L }, chk);
  return { view: '34', dir: 1, x: -10 * jolt, y: -10 * freeze + dip(f, W.hit, 5, 4), rot: lean - 6 * jolt, head,
    feet: [{ x: -22, lift: 0 }, { x: 22, lift: 0 }], farArmFront: false, hands: [{ ...h0, bow: .35 }, { ...h1, bow: .35, over: true }], held: [] }; }

// ---- MILKMAN m:mk_out (3/4, climbed out, standing small in front of the huge truck), rows 19-21. Act at f668 (he steps out between 660 and 670).
//   668-689 cap askew (head tilt 4), arms hanging, bottle low in the far fist; small, careful
//   690 "said": turns to the lens and draws breath (chest up: y -5, rot -3, snap 8)
//   721 "I": BOTH ARMS WIDE, palms up (snap 6 after a 3 f dip): the bottle goes out with the far arm; held through "never"
//   734 "never": eyes to the lens (face), head shakes 3 times (734-745)
//   745 "saw": a half look back over his shoulder (head 8, snap 5) and back (snap 5 at 750)
//   755 "it": the snap round and UP: head back -16, the near knuckle pushes the cap back (hand to the brow, snap 6); DEAD STILL from 765 (mouth shut)
function mkOut(t, ch) { const f = F(t) + 668, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const breath = snap(f - W.said, 8), wide = snap(f - W.I, 6) - snap(f - W.it, 8) * .55, ant = dip(f, W.I - 3, 4, 3);
  const shake = f > W.never && f < W.saw ? 4 * Math.sin((f - W.never) / 11 * Math.PI * 3) : 0;
  const back = 8 * (snap(f - W.saw, 5) - snap(f - W.saw - 5, 5)), upL = snap(f - W.it, 6), cap = snap(f - W.it - 1, 6);
  const head = 4 * (1 - breath) + shake + back - 16 * upL + ring(f, W.it + 6, 3, 10);
  const hang = [{ wx: -Wd * .55, wy: ch.hipY + 8 }, { wx: Wd * .6, wy: ch.hipY + 6 }];
  const arms = [{ wx: -Wd * .6 - .78 * L, wy: S - .02 * L }, { wx: Wd * .6 + .78 * L, wy: S - .05 * L }];
  const mix = (a, b, u) => ({ wx: a.wx + (b.wx - a.wx) * u, wy: a.wy + (b.wy - a.wy) * u });
  const h0 = mix(hang[0], arms[0], wide);
  const h1 = mix(mix(hang[1], arms[1], wide), { wx: Wd * .25, wy: S - .95 * L }, cap);
  return { view: '34', dir: 1, x: 0, y: -5 * breath + ant, rot: -3 * breath - 4 * upL, head,
    feet: [{ x: -20, lift: 0 }, { x: 20, lift: 0 }], farArmFront: true, hands: [{ ...h0, bow: .3 }, { ...h1, bow: .3, over: true }], held: [] }; }

// ---- SCEPTIC m:sc_cab (3/4, in the red truck's cab, driver's window on the south side), rows 16-21. Act at f566 (hidden while the truck races: far and small).
//   566-568 both fists on the wheel, arms half crossed; 569 "hit": a small jolt forward (6 px), then still: unimpressed (one brow, the face)
//   680 leans out of the window (film.json moves the card 0.4 m south) and looks DOWN at the Milkman: rot 14, head 10 (snap 10); DEAD STILL to the end
function scCab(t, ch) { const f = F(t) + 566, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const jolt = snap(f - W.hit, 3) - snap(f - W.hit - 3, 8), lean = snap(f - 680, 10);
  return { view: '34', dir: 1, x: 6 * jolt, y: 0, rot: 3 * jolt + 14 * lean, head: 10 * lean + ring(f, W.hit + 3, 3, 9),
    feet: [{ x: -24, lift: 0 }, { x: 24, lift: 0 }], farArmFront: true,
    hands: [{ wx: Wd * .45 + .3 * L * (1 - lean), wy: S + .3 * L + .2 * L * lean, bow: .25 }, { wx: Wd * .6 + .5 * L * (1 - lean) + .2 * L * lean, wy: S + .32 * L - .1 * L * lean, bow: .25, over: true }], held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('mk_van', mkVan, 'at the wheel: creep, look left, look right, nod, bump, freeze, bottle check, look up'),
  sty('mk_out', mkOut, 'out of the van: breath, arms wide, head shake, half look back, double take up the truck'),
  sty('sc_cab', scCab, 'in the cab: jolt on the bump, leans out and looks down')];
export const N = 771;
export default { title: 'FIRETRUCKS S3: episode moves', dur: N / 30, styles: STY };
export const front = { title: 'FIRETRUCKS S3: episode moves', dur: N / 30, styles: STY };

// EPISODE MOVES, yellow-fire-trucks S7 THE FALSE WIN (frames 1576-1754, plan rows 49-53, script line 13). S7 stretch builder 2026-11-21, BOARD round.
// STUDIO MOTION form (./studio_ep.mjs): snap, settle, DEAD STILL in holds; drawn new on every frame (tween.ones). Clocks start at film frame 1576
// (the first act that sets each pose): move frame + 1576 = FILM frame. Written facing +x (dir 1); apply_looks mirrors and picks the view.
// STILLNESS f1730-1745: every move is dead still (all strikes settle by 1729).
import { snap, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
export const N = 200;
// words.json: And 1576, Dallas 1592, It 1618, went 1624, back 1629, red 1643, anyway 1649, because 1667, firetruck 1678, just 1695, has 1702, red 1720
export const W = { dallas: 1592, back: 1629, anyway: 1649, because: 1667, firetruck: 1678, has: 1702, red: 1720 };
const m = (a, b, u) => ({ wx: a.wx + (b.wx - a.wx) * u, wy: a.wy + (b.wy - a.wy) * u });

// ---- THIN PAINTER m:pt_s7: f1596-1606 the shrug at the order sheet (both shoulders up, gun hand open out, head tilt), f1612 gun up to aim (snap 8),
//   f1629-1648 "back": the long fast sweep (gun hand travels front to back in two passes), f1667 "because": steps aside, gun down (snap 8); dead still from 1690
function ptS7(t, ch) { const f = F(t) + 1576, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const rest1 = { wx: Wd * .75, wy: ch.hipY - 14 }, rest0 = { wx: -Wd * .75, wy: ch.hipY - 14 };
  const shrug = snap(f - 1596, 5) - snap(f - 1604, 8), aim = snap(f - 1612, 8) - snap(f - W.because, 8);
  const sweep = Math.sin(Math.PI * 2 * Math.max(0, Math.min(1, (f - W.back) / 19))) * (f > W.back && f < 1648 ? 1 : 0);
  const gun = { wx: Wd * .5 + .7 * L + 8 * sweep, wy: S - .25 * L - 26 * sweep };
  let h1 = m(rest1, { wx: Wd * .9 + 20, wy: ch.hipY - 40 }, shrug); h1 = m(h1, gun, aim);
  const h0 = m(m(rest0, { wx: -Wd * .9 - 20, wy: ch.hipY - 40 }, shrug), { wx: Wd * .3, wy: S - .35 * L }, aim * .8);
  const head = 6 * shrug + ring(f, 1606, 2, 8) - 3 * aim + ring(f, 1675, 2, 8);
  const step = 26 * (snap(f - 1668, 3) - snap(f - 1671, 4));
  return { view: '34', dir: 1, x: 0, y: -10 * shrug + dip(f, 1612, 3, 4) + dip(f, 1672, 4, 4), rot: 2 * aim + 2 * sweep, head,
    feet: [{ x: -24, lift: step }, { x: 24, lift: 0 }], farArmFront: true, hands: [{ ...h0, bow: .45 }, { ...h1, bow: .3, over: true }], held: [] }; }

// ---- FAT PAINTER m:pf_s7: f1614 gun up, tongue out; f1629-1648 short neat dabs (four); f1650-1658 "anyway": gun hand down, the FREE (far) hand
//   pats the last yellow patch twice (f1651, f1655), a small sorry head tilt; f1658-1664 covers it with one dab; f1667 steps aside, gun down; dead still 1690
function pfS7(t, ch) { const f = F(t) + 1576, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const rest1 = { wx: Wd * .75, wy: ch.hipY - 14 }, rest0 = { wx: -Wd * .75, wy: ch.hipY - 14 };
  const aim = snap(f - 1614, 8) - snap(f - W.because, 8), pat = snap(f - 1649, 4) - snap(f - 1658, 5);
  let dab = 0; for (const f0 of [1630, 1635, 1640, 1645, 1659]) dab += 10 * (snap(f - f0, 2) - snap(f - f0 - 2, 3));
  const tap = 8 * (snap(f - 1651, 2) - snap(f - 1653, 2)) + 8 * (snap(f - 1655, 2) - snap(f - 1657, 2));
  const gun = { wx: Wd * .45 + .62 * L + dab, wy: S - .2 * L };
  const h1 = m(m(rest1, gun, aim), { wx: Wd * .8, wy: ch.hipY - 20 }, pat);
  const h0 = m(m(rest0, { wx: Wd * .2, wy: S - .3 * L }, aim * .7), { wx: Wd * .5 + .7 * L + tap, wy: S - .1 * L }, pat);
  const head = -3 * aim + 6 * pat + ring(f, 1659, 2, 8);
  const step = 24 * (snap(f - 1669, 3) - snap(f - 1672, 4));
  return { view: '34', dir: 1, x: 0, y: dip(f, 1614, 3, 4) + 4 * pat, rot: 3 * aim - 3 * pat, head,
    feet: [{ x: -24, lift: step }, { x: 24, lift: 0 }], farArmFront: true, hands: [{ ...h0, bow: .4, over: pat > .5 }, { ...h1, bow: .3, over: true }], held: [] }; }

// ---- CHIEF (VISITOR) m:cv_s7: watches with thumbs in his belt (f1576-1676, a slow pleased nod on "back" f1632); f1678 "firetruck": the PLANT,
//   a little hop and stamp (y dip 10), chest out (rot -4), thumbs re-hooked; f1702 "has": the far hand SALUTES (snap 6), eyes shut (face), he rocks
//   back on his heels too far (rot +9 over 8 f), the belly wobbles (ring); f1720 "red": he catches himself (snap 4), chin up, the proud nod (head -6);
//   dead still from 1730 (STILLNESS)
function cvS7(t, ch) { const f = F(t) + 1576, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const belt1 = { wx: Wd * .45, wy: ch.hipY - 34 }, belt0 = { wx: -Wd * .45, wy: ch.hipY - 34 };
  const plant = snap(f - W.firetruck, 5), hop = 14 * (snap(f - 1675, 3) - snap(f - W.firetruck, 3));
  const salute = snap(f - W.has, 6) - snap(f - 1726, 8), rock = snap(f - 1706, 8) - snap(f - W.red, 4);
  const h0 = m(belt0, { wx: Wd * .2, wy: S - .95 * L }, salute);
  const head = 4 * (snap(f - 1632, 6) - snap(f - 1642, 8)) - 3 * plant + 4 * rock - 6 * snap(f - W.red, 6) + ring(f, 1724, 3, 9);
  return { view: '34', dir: 1, x: 0, y: -hop + dip(f, W.firetruck, 10, 4) + ring(f, 1712, 5, 10) + dip(f, W.red + 2, 5, 4), rot: -4 * plant + 9 * rock, head,
    feet: [{ x: -26, lift: hop * .8 }, { x: 26, lift: hop * .6 }], farArmFront: false, hands: [{ ...h0, bow: .35, over: salute > .3 }, { ...belt1, bow: .4, over: true }], held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('pt_s7', ptS7, 'shrug at the order sheet, aims, long sweep on "back", steps aside'), sty('pf_s7', pfS7, 'dabs, pats the last yellow patch, covers it, steps aside'),
  sty('cv_s7', cvS7, 'thumbs in belt, the plant on "firetruck", eyes-shut salute and rock back on "has", catch and proud nod on "red"')];
const AS = view => STY.map(s => ({ ...s, pose: (t, ch) => ({ ...s.pose(t, ch), view }) }));
export default { title: 'FIRETRUCKS S7: episode moves', dur: N / 30, styles: AS('side') };
export const front = { title: 'FIRETRUCKS S7: episode moves', dur: N / 30, styles: AS('front') };
export const PLAN = {
  pt_s7: { who: 'painterThin', view: '34', strikes: [{ name: 'aim f1612', f0: 36, ch: 'h1y', to: 'min' }], holds: [[120, 175, 'aside, dead still']], acting: [20, 100] },
  pf_s7: { who: 'painterFat', view: '34', strikes: [{ name: 'pat "anyway" f1651', f0: 75, ch: 'h0x', to: 'max' }], holds: [[120, 175, 'aside, dead still']], acting: [38, 100] },
  cv_s7: { who: 'chiefVisitor', view: '34', strikes: [{ name: 'salute "has" f1702', f0: 126, ch: 'h0y', to: 'min' }], holds: [[156, 175, 'STILLNESS, dead still']], acting: [100, 154] },
};

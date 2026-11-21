// EPISODE MOVES, yellow-fire-trucks S4 THE IDEA SPREADS (film 25.65-32.30 s = frames 770-969, plan rows 22-27, script line 7). S4 stretch builder 2026-11-21, BOARD.
// STUDIO MOTION form (./studio_ep.mjs, copy of s2's: snap, settle, DEAD STILL in holds), drawn new on every frame (tween.ones).
// Every move's clock starts at film frame 770 (the first act that sets the pose, LECONS s2): move frame + 770 = FILM frame.
// The cast stands on the map at station scale (x0.088 = the tiny trucks' scale), so these are small figures; the rig units are the same.
// Rig: y down, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX, ch.hipY. hands[0] = far (held3d 'L'), hands[1] = near (held3d 'R').
import { snap, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
const T0 = 770;
export const N = 222;   // the stretch ends at move frame 199; the motion gate looks ~20 f past a strike (s8 LECONS)
// words.json (s x 30): So 773, 1970s 789, cities 833, started 835, painting 848, their 858, trucks 866, lime 874, yellow 885, Plenty 916, of 924,
// firemen 932, hated 944, them 952 (end 962)
export const W = { cities: 833, painting: 848, trucks: 866, lime: 874, plenty: 916, firemen: 932, hated: 944, them: 952 };
const mix = (a, b, u) => ({ wx: a.wx + (b.wx - a.wx) * u, wy: a.wy + (b.wy - a.wy) * u });

// ---- THIN PAINTER m:pt_spray (row 24): gun at the hip; raises it to the red truck nose (838, snap 8); on "painting" one long sweep across the nose
//   (848-862, snap 14: brisk), gun down on "trucks" (866, snap 10); DEAD STILL after 878.
function ptSpray(t, ch) { const f = F(t) + T0, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const up = snap(f - 838, 8) - snap(f - W.trucks, 10), sw = snap(f - W.painting, 14);
  const hip = { wx: Wd * .7, wy: ch.hipY - 18 }, aim0 = { wx: Wd * .3 + .92 * L, wy: S + .12 * L }, aim1 = { wx: Wd * .3 + .9 * L, wy: S - .2 * L };
  const h1 = mix(hip, mix(aim0, aim1, sw), up), h0 = mix({ wx: -Wd * .7, wy: ch.hipY - 14 }, { wx: Wd * .2, wy: S + .35 * L }, up);
  return { view: '34', dir: 1, x: 0, y: dip(f, 838, 3, 4), rot: 4 * up - 2 * sw * up, head: 3 * up + ring(f, 866, 2, 8), feet: [{ x: -30, lift: 0 }, { x: 30, lift: 0 }], farArmFront: true,
    hands: [{ ...h0, bow: .4 }, { ...h1, bow: .25, over: true }], held: [] }; }

// ---- FAT PAINTER m:pt_watch (row 24): careful helper, both fists together at the chest; leans in on "painting" (848, snap 10, tongue out face);
//   a small satisfied nod on "lime" (874); DEAD STILL after 890.
function ptWatch(t, ch) { const f = F(t) + T0, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const lean = snap(f - W.painting, 10), nod = 4 * (snap(f - W.lime, 4) - snap(f - W.lime - 4, 8));
  const c = { wx: Wd * .15, wy: S + .45 * L };
  return { view: '34', dir: 1, x: 0, y: 0, rot: 5 * lean, head: 4 * lean + nod, feet: [{ x: -32, lift: 0 }, { x: 30, lift: 0 }], farArmFront: true,
    hands: [{ ...c, wx: -c.wx, bow: .5 }, { ...c, bow: .5, over: true }], held: [] }; }

// ---- SCEPTIC m:sc_hate (row 26): arms crossed high, DEAD STILL; on "firemen" (932) a slow turn of the head away (snap 12) and the near fist
//   comes up over his eyes (snap 10); DEAD STILL after.
function scHate(t, ch) { const f = F(t) + T0, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const u = snap(f - W.firemen + 2, 10), turn = snap(f - W.firemen, 12);
  const c0 = { wx: -Wd * .5, wy: S + .26 * L }, c1 = { wx: Wd * .55, wy: S + .22 * L }, eyes = { wx: Wd * .1, wy: S - .88 * L };
  return { view: '34', dir: 1, x: 0, y: 0, rot: -2 * turn, head: -8 * turn, feet: [{ x: -28, lift: 0 }, { x: 28, lift: 0 }], farArmFront: true,
    hands: [{ ...c1, bow: .3 }, { ...mix(c0, eyes, u), bow: .3, over: true }], held: [] }; }

// ---- ROOKIE m:rk_peek (row 27, THE TELL-TALE PEEK): heels together, fists at his sides; on "hated" (944) BOTH fists clap over his eyes (snap 5,
//   instant and too big, impact dip); on "them" (952) the top (near) fist sinks below one eye (snap 6) and he looks over it a beat too long;
//   at 966 (32.2) the fist snaps back up (he sees the Sceptic). Holds dead still between.
function rkPeek(t, ch) { const f = F(t) + T0, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const clap = snap(f - W.hated + 1, 5), sink = snap(f - W.them, 6) - snap(f - 966, 4);
  const side0 = { wx: -Wd * .72, wy: ch.hipY - 14 }, side1 = { wx: Wd * .72, wy: ch.hipY - 14 };
  const eye0 = { wx: -Wd * .14, wy: S - .9 * L }, eye1 = { wx: Wd * .18, wy: S - .86 * L }, low1 = { wx: Wd * .22, wy: S - .6 * L };
  return { view: '34', dir: 1, x: 0, y: dip(f, W.hated + 3, 5, 4), rot: -2 * clap + 2 * sink, head: 5 * clap - 4 * sink + ring(f, W.hated + 4, 2, 8), feet: [{ x: -22, lift: 0 }, { x: 22, lift: 0 }],
    farArmFront: false, hands: [{ ...mix(side0, eye0, clap), bow: .35 }, { ...mix(mix(side1, eye1, clap), low1, sink), bow: .35, over: true }], held: [] }; }

// ---- OLD-TIMER m:ot_late (row 27): weight back, lunch-box fist down; a second late (960 = 32.0 s) his near fist pulls the helmet brim down (snap 8)
function otLate(t, ch) { const f = F(t) + T0, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const p = snap(f - 958, 8);
  const rest = { wx: Wd * .75, wy: ch.hipY - 16 }, brim = { wx: Wd * .28, wy: S - 1.08 * L };
  return { view: '34', dir: 1, x: 0, y: 0, rot: -3, head: 2 + 5 * p, feet: [{ x: -30, lift: 0 }, { x: 28, lift: 0 }], farArmFront: true,
    hands: [{ wx: -Wd * .8, wy: ch.hipY - 22, bow: .45 }, { ...mix(rest, brim, p), bow: .35, over: true }], held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('pt_spray', ptSpray, 'thin painter: gun up, one long sweep over the red nose on "painting"'),
  sty('pt_watch', ptWatch, 'fat painter: fists at the chest, leans in, nods on "lime"'),
  sty('sc_hate', scHate, 'sceptic: arms crossed; on "firemen" head away, fist over the eyes'),
  sty('rk_peek', rkPeek, 'rookie: both fists over the eyes on "hated", one eye over the sunk fist on "them"'),
  sty('ot_late', otLate, 'old-timer: a second late, pulls his helmet down')];
// camsafe (s2 LECONS): `default` draws side, `front` draws front (the kit turns it to 3/4 or back), so each export draws its own view
const AS = view => STY.map(s => ({ ...s, pose: (t, ch) => ({ ...s.pose(t, ch), view }) }));
export default { title: 'FIRETRUCKS S4: episode moves', dur: N / 30, styles: AS('side') };
export const front = { title: 'FIRETRUCKS S4: episode moves', dur: N / 30, styles: AS('front') };
// motion-gate plan (moves/tools/check_motion_ep.mjs): strikes + holds in frames from the move start (770)
export const PLAN = {
  pt_spray: { who: 'painterThin', view: '34', strikes: [{ name: 'gun up f838', f0: 838 - T0, ch: 'h1y', to: 'min' }], holds: [[110, 140, 'gun down, still']], acting: [60, 108] },
  pt_watch: { who: 'painterFat', view: '34', strikes: [], holds: [[125, 140, 'still']], acting: [70, 120] },
  sc_hate: { who: 'sceptic', view: '34', strikes: [{ name: 'fist "firemen" f932', f0: W.firemen - 2 - T0, ch: 'h1y', to: 'min' }], holds: [[0, 150, 'arms crossed, still'], [180, 199, 'fist over the eyes']], acting: [160, 178] },
  rk_peek: { who: 'rookie', view: '34', strikes: [{ name: 'clap "hated" f944', f0: W.hated - 1 - T0, ch: 'h1y', to: 'min' }], holds: [[0, 170, 'heels together, still'], [188, 195, 'the peek']], acting: [173, 187] },
  ot_late: { who: 'oldTimer', view: '34', strikes: [{ name: 'brim f958', f0: 958 - T0, ch: 'h1y', to: 'min' }], holds: [[0, 185, 'still']], acting: [186, 199] },
};

// EPISODE MOVES, yellow-fire-trucks S5 THE COUNT (frames 969-1202, plan rows 28-35, script lines 8-9). S5 stretch builder 2026-11-21, BOARD round.
// STUDIO MOTION form (./studio_ep.mjs, copy of s2's): Rick's snap, settle, DEAD STILL in holds; drawn new on every frame (tween.ones).
// The move's clock starts at film frame 969 (the first act that sets the pose, LECONS s2): move frame + 969 = FILM frame.
// Written facing +x (dir 1, toward the board); apply_looks mirrors and picks the view. Rig units: y down; hands[0] far, hands[1] near (held3d 'R' = chalk).
import { snap, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
export const N = 260;
// words.json: Dallas 982, ran 992, side 1019, side 1034, four 1049, years 1058, counted 1078, every 1088, crash 1100, red 1127, hit 1147, up 1153,
// three 1161, times 1170, as 1179, often 1184
export const W = { side: 1019, four: 1049, counted: 1078, crash: 1100, red: 1127, hit: 1147, three: 1161, times: 1170, as: 1179, often: 1184 };
const m = (a, b, u) => ({ wx: a.wx + (b.wx - a.wx) * u, wy: a.wy + (b.wy - a.wy) * u });

// ---- CLERK m:cl_count
//  f1012-1024 "side": chalk comes up to shoulder height, ready (snap 12); DEAD STILL to 1046
//  f1049/1053/1057 "four": one small patient nod per calendar leaf
//  f1074-1082 "counted": the chalk fist points back over his shoulder (at the plastered red fender) without looking round, then a tick (f1086)
//           with a nod, a second tick (f1094); f1100 "crash": fist to the mouth, blows the dust off (f1102-1110), back down
//  f1112-1124 three quicker ticks climbing the board (each higher), the last at the top (f1124); f1126-1134 he steps up on the stool (film.json glide)
//  f1136-1142 reaches up, nothing left to write on: a first frown (face think, film.json)
//  f1147 "hit": both fists up to the ladder rails; f1150-1163 climb: alternate fists reach up rung over rung (the card rises on the rungs, film.json)
//  f1164-1172 "three"/"times": chalk out to the board, three strokes of the 3x
//  f1174-1180 "as": the near fist goes to the hat brim, the knuckle tips it back (snap 4), fist down; f1184 "often": the long look DOWN; DEAD STILL from 1196
function clCount(t, ch) { const f = F(t) + 969, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const rest1 = { wx: Wd * .75, wy: ch.hipY - 14 }, rest0 = { wx: -Wd * .75, wy: ch.hipY - 14 };
  const ready = { wx: Wd * .55 + .25 * L, wy: S - .05 * L }, back = { wx: -Wd * .6, wy: S - .55 * L }, mouth = { wx: Wd * .45, wy: S - .62 * L };
  const tickAt = h => ({ wx: Wd * .4 + .62 * L, wy: S - h * L });
  let h1 = m(rest1, ready, snap(f - 1012, 12));
  h1 = m(h1, back, snap(f - 1074, 6) - snap(f - 1083, 6));
  const tick = (f0, h) => { h1 = m(h1, tickAt(h), snap(f - f0, 4)); h1.wy += 10 * (snap(f - f0 - 3, 3) - snap(f - f0 - 6, 3)); };
  tick(1084, .05); tick(1092, .15);
  h1 = m(h1, mouth, snap(f - W.crash, 5) - snap(f - 1110, 6));
  tick(1112, .3); tick(1117, .5); tick(1122, .72);
  h1 = m(h1, { wx: Wd * .3 + .5 * L, wy: S - .95 * L }, snap(f - 1136, 6));          // reaches higher: nothing left
  // the climb: hands to the rails, alternate reaches
  const climb = snap(f - W.hit, 4) - snap(f - 1164, 5);
  let rl0 = { wx: -Wd * .2, wy: S - .9 * L }, rl1 = { wx: Wd * .5, wy: S - .9 * L };
  for (let k = 0; k < 4; k++) { const f0 = 1150 + 3.3 * k, up = 20 * (snap(f - f0, 2) - snap(f - f0 - 2, 2)); if (k % 2) rl0 = { ...rl0, wy: rl0.wy - up }; else rl1 = { ...rl1, wy: rl1.wy - up }; }
  h1 = m(h1, rl1, climb);
  // the 3x strokes (chalk out to the board, three short strokes)
  const write = snap(f - 1164, 4) - snap(f - 1173, 5), str = 12 * (snap(f - 1165, 2) - snap(f - 1167, 2)) + 12 * (snap(f - 1168, 2) - snap(f - 1170, 2)) + 10 * (snap(f - 1171, 2) - snap(f - 1172.5, 2));
  h1 = m(h1, { wx: Wd * .4 + .78 * L, wy: S - .45 * L + str }, write);
  // the hat tip on "as"
  const brim = snap(f - 1174, 4) - snap(f - 1182, 6), tip = 8 * (snap(f - W.as, 3) - snap(f - W.as - 3, 5));
  h1 = m(h1, { wx: Wd * .62, wy: S - .78 * L - tip }, brim);
  h1 = m(h1, { wx: Wd * .5, wy: S - .9 * L }, snap(f - 1183, 6));                    // back to the rail
  let h0 = m(rest0, rl0, climb + snap(f - 1164, 5) * (f > 1164 ? 1 : 0));            // far hand stays on the rail once up
  const nods = [1049, 1053, 1057, 1086, 1094].reduce((s, f0) => s + 4 * (snap(f - f0, 2) - snap(f - f0 - 2, 3)), 0);
  const blow = 4 * (snap(f - 1102, 3) - snap(f - 1110, 5)), frown = 3 * (snap(f - 1136, 6));
  const look = snap(f - W.often, 10), up = snap(f - 1140, 6) - snap(f - 1150, 4);
  const head = nods + blow + frown - 6 * up + 10 * look + ring(f, 1096, 2, 8) - 4 * (snap(f - 1164, 4) - snap(f - 1174, 6));
  const fl = (k, f0) => 30 * (snap(f - f0, 2) - snap(f - f0 - 2, 2));
  const climbF = [1150, 1153.3, 1156.6, 1160];
  const l0 = fl(0, 1127) + climbF.filter((_, k) => k % 2 === 0).reduce((s, f0) => s + fl(0, f0), 0), l1 = fl(1, 1129) + climbF.filter((_, k) => k % 2).reduce((s, f0) => s + fl(1, f0), 0);
  return { view: '34', dir: 1, x: 0, y: dip(f, 1131, 4, 4) + dip(f, 1163, 5, 4) + 3 * look, rot: 2 * snap(f - 1012, 12) - 3 * climb + 2 * look, head,
    feet: [{ x: -24, lift: l0 }, { x: 24, lift: l1 }], farArmFront: true, hands: [{ ...h0, bow: .45 }, { ...h1, bow: .35, over: true }], held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('cl_count', clCount, 'ready chalk, nods per leaf, points back at the plasters, ticks, blows the dust, stool, ladder climb, chalks 3x, hat tip, long look down')];
const AS = view => STY.map(s => ({ ...s, pose: (t, ch) => ({ ...s.pose(t, ch), view }) }));
export default { title: 'FIRETRUCKS S5: episode moves', dur: N / 30, styles: AS('side') };
export const front = { title: 'FIRETRUCKS S5: episode moves', dur: N / 30, styles: AS('front') };
export const PLAN = {
  cl_count: { who: 'clerk', view: '34', strikes: [{ name: 'point back "counted" f1074', f0: 1074 - 969, ch: 'h1x', to: 'min' }, { name: 'tick f1084', f0: 1084 - 969, ch: 'h1x', to: 'max' }],
    holds: [[56, 76, 'ready, dead still'], [227, 245, 'the long look, dead still']], acting: [43, 226] },
};

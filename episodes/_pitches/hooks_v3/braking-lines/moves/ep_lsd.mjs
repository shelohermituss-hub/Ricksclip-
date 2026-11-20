// PITCH 2 board episode moves (2026-11-16): THE LINES ON THE S-CURVE. STUDIO MOTION form (notice, anticipate, strike, settle, dead still), drawn new
// on every frame (tween.ones). Frame 0 of each move is the HOLD of its action, so a still reads at phone size; after it the action plays on.
// Written facing +x (dir 1); film.json act dir -1 mirrors. Rig units: y down, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX, ch.hipY.
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
const fr = t => Math.round(t * 30 * 100) / 100;

// PAINTER, 3/4 facing right: wide stance, knees soft, leaning into the long roller pole; both fists on the pole (upper fist near the chest, lower fist
// out to the right). One stroke = anticipate back 4 f, PUSH (snap 6 f), settle 8 f, every 24 f. Frame 0 = the push held at full reach.
function pntRoll(t, ch) { const f = fr(t), S = ch.sh[1], L = ch.armL, u = f % 24;
  const push = f < 6 ? 1 : u < 4 ? 1 - .35 * snap(u, 4) : u < 10 ? .65 + .35 * snap(u - 4, 6) : 1;
  const dx = 26 * (push - 1);
  return { view: '34', dir: 1, x: dx * .4, y: 6, rot: 9 + 3 * (push - 1), feet: [{ x: -48, lift: 0 }, { x: 44, lift: 0 }],
    hands: [{ wx: .86 * L + dx, wy: S + .62 * L, bow: .3 }, { wx: .42 * L + dx, wy: S + .36 * L, bow: .5, over: true }], head: 7, held: [] }; }

// TRUCKER, 3/4: leaning out of the cab window; near fist jabs a finger-point at the painter (snap 3 f, settle 6 f) every 18 f, far fist on the sill,
// head thrown back on the laugh. Frame 0 = the jab held.
function trkMock(t, ch) { const f = fr(t), S = ch.sh[1], L = ch.armL, u = f % 18, jab = f < 6 ? 1 : u < 3 ? snap(u, 3) : 1 - .25 * snap(u - 3, 6) + .25 * snap(u - 12, 6);
  return { view: '34', dir: 1, x: 0, y: 0, rot: 10, feet: [{ x: -26, lift: 0 }, { x: 26, lift: 0 }], farArmFront: false,
    hands: [{ wx: .30 * L, wy: S + .62 * L, bow: .6 }, { wx: (.55 + .38 * jab) * L, wy: S - .10 * L, bow: .25, over: true }], head: -10 + 4 * (1 - jab), held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('pnt_roll', pntRoll, 'leans into the roller pole, push strokes'), sty('trk_mock', trkMock, 'leans out of the cab, jabbing point, laugh')];
export default { title: 'LSD hook: episode moves', dur: 3, styles: STY };
export const front = { title: 'LSD hook: episode moves (3/4)', dir: 1, dur: 3, styles: STY };

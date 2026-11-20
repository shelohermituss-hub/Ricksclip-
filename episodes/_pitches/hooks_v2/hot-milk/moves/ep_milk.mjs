// Pitch 2 hook episode moves ("Why Hot Milk Froze First", frame 0 = the strange act). STUDIO MOTION sequences, drawn new on every frame (tween ones).
// Frame 0 of each move is its key moment, the moves run on after it (so the same file plays when the hook is animated):
//   boy_shove     side, facing +x (to the freezer): lunging forward on the front foot, back heel up, the near fist pushes the steaming mug INTO the
//                 freezer box at shoulder height, the far fist holds the freezer flap up; then the last push (3 f snap), a dip, dead still.
//   kid_point     side, facing +x: laughing, the near arm points straight at the boy, the far fist holds his own mug at the chest; belly bounce on a 4 f beat.
//   kid_fold      side, facing +x: doubled forward with laughter (hips back over the feet), the near fist on his belly, the far fist with the mug held out.
//   kid_hold      3/4, facing +x: both fists hold the mug at the chest, head thrown back, shoulders up; laughing bounce.
//   master_fold   front: arms folded high on the chest, chin down, the head shakes slowly (+-7 deg, 0.6 s a swing), dead still after two swings.
const PI = Math.PI, sin = Math.sin, SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
const F = t => Math.round(t * 30 * 100) / 100;
const dip = (f, f0, amp = 8, n = 4) => f > f0 && f < f0 + n ? amp * sin(PI * (f - f0) / n) : 0;
const beat = (f, amp, end = 60, per = 4) => f < end ? Math.abs(sin(PI * f / per)) * amp * Math.max(0, 1 - f / end) : 0;

function boy_shove(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, p = snap(f - 6, 3), d = dip(f, 9, 8, 4);
  const near = [1.02 * L + 26 * p, S - .06 * L], far = [.92 * L, S - .5 * L];
  return { view: 'side', dir: 1, x: 6 * p, y: 10 + d, rot: 17 + 3 * p, feet: [{ x: -120, lift: 34 }, { x: 70, lift: 0 }],
    hands: [{ wx: far[0], wy: far[1], bow: .3 }, { wx: near[0], wy: near[1], bow: .2, over: true }], head: -4 + 2 * p, shrug: 6, held: [] }; }

function kid_point(t, ch) { const f = F(t) + 16, S = ch.sh[1], L = ch.armL, b = beat(f, 9);
  return { view: 'side', dir: 1, x: 0, y: b, rot: -9 - 2 * sin(f * .8), feet: [{ x: -46 }, { x: 52 }],
    hands: [{ wx: .38 * L, wy: S + .42 * L + b, bow: .7 }, { wx: 1.0 * L, wy: S - .1 * L + .4 * b, bow: .08, over: true }], head: -16 + .3 * b, shrug: 14, held: [] }; }

function kid_fold(t, ch) { const f = F(t) + 30, S = ch.sh[1], L = ch.armL, b = beat(f, 8, 70);
  return { view: 'side', dir: 1, x: -60, y: 30 + b, rot: 24, feet: [{ x: -14 }, { x: 96 }],
    hands: [{ wx: .7 * L, wy: S + .3 * L + b, bow: .5 }, { wx: .3 * L, wy: S + .78 * L, bow: .9, over: true }], head: 12 + .3 * b, shrug: 18, held: [] }; }

function kid_hold(t, ch) { const f = F(t) + 20, S = ch.sh[1], L = ch.armL, b = beat(f, 8, 64);
  return { view: '34', dir: 1, x: 0, y: b, rot: -6, feet: [{ x: -40 }, { x: 40 }],
    hands: [{ wx: .22 * L, wy: S + .55 * L + b, bow: .7, over: true }, { wx: -.1 * L, wy: S + .6 * L + b, bow: .7, over: true }], head: -14 + .3 * b, shrug: 16, held: [] }; }

function master_fold(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, sw = f < 40 ? 7 * sin(PI * f / 18) * (1 - f / 40) : 0;
  return { view: 'front', dir: 1, x: 0, y: 0, rot: 0, feet: [{ x: -34 }, { x: 34 }],
    hands: [{ wx: .38 * L, wy: S + .4 * L, bow: .75, over: true }, { wx: -.34 * L, wy: S + .46 * L, bow: .75, over: true }], head: -4 + sw, shrug: 8, held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const LIST = [sty('boy_shove', boy_shove, 'lunge, mug into the freezer, last push, dip, still'), sty('kid_point', kid_point, 'laugh and point at the boy'),
  sty('kid_fold', kid_fold, 'doubled over laughing, hand on belly'), sty('kid_hold', kid_hold, 'head back laugh, mug in both fists'), sty('master_fold', master_fold, 'arms folded, head shake, still')];
export default { title: 'MILK hook: episode moves', dur: 3, styles: LIST };
export const front = { title: 'MILK hook: episode moves (front/3-4)', dur: 3, styles: LIST };

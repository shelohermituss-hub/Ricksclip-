// PITCH 1 board episode moves (2026-11-16): THE TRAFFIC LIGHT COMES OUT. STUDIO MOTION form (notice, anticipate, strike, settle, dead still), drawn new
// on every frame (tween.ones). Frame 0 of each move is the HOLD of its action, so the still reads at phone size; after it the action plays on.
// Written facing +x (dir 1). Rig units: y down, ground 1010, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX, ch.hipY.
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
const fr = t => Math.round(t * 30 * 100) / 100;

// WORKER, side, facing the pole's foot: leans far back, front foot braced, back foot dug in; both round fists on the pole, the lower (near, R) fist
// forward at chest height, the upper (far) fist higher along the pole's line (-125 deg). Frame 0 = the heave held at full lean; then a heave every 18 f:
// anticipate forward 3 f, snap back 4 f, settle 8 f (the pole is in the R fist, so it rocks with him).
function haul(t, ch) { const f = fr(t), S = ch.sh[1], L = ch.armL, u = f % 18;
  const hv = f < 6 ? 0 : u < 3 ? -.4 * snap(u, 3) : -.4 + 1.4 * snap(u - 3, 4) - 1 * snap(u - 7, 8);
  const near = [.82 * L - hv * .05 * L, S + .02 * L], far = [near[0] - .30 * L, near[1] - .43 * L];
  return { view: 'side', dir: 1, x: 0, y: 8, rot: -18 - 3 * hv, feet: [{ x: -78, lift: 0 }, { x: 58, lift: 0 }], farArmFront: false,
    hands: [{ wx: far[0], wy: far[1], bow: .3 }, { wx: near[0], wy: near[1], bow: .25, over: true }], head: -6, held: [] }; }

// DRUGSTORE KEEPER, 3/4: carries the bandage crate out in front of his belly (box grip solves the arms), proud, chin up; a small hitch of the crate
// every 24 f (2 f up, 8 f down). Frame 0 = the crate held still.
function crate(t, ch) { const f = fr(t), u = f % 24, h = f < 8 ? 0 : 6 * snap(u, 2) - 6 * snap(u - 2, 8), W = ch.handX, S = ch.sh[1], L = ch.armL;
  return { view: '34', dir: 1, x: 0, y: -h * .3, rot: -4, feet: [{ x: -26, lift: 0 }, { x: 26, lift: 0 }],
    hands: [{ wx: -W * .55, wy: S + .4 * L - h, bow: .6 }, { wx: W * .55, wy: S + .4 * L - h, bow: .6 }], head: 5, held: [] }; }

// OLD MAN, 3/4: the near arm points hard across at the worker (fist at full reach, shoulder high), the far fist on his hip; shakes the pointing fist
// every 10 f (2 f out, 5 f back). Frame 0 = the point held.
function point(t, ch) { const f = fr(t), u = f % 10, sh = f < 6 ? 0 : 10 * snap(u, 2) - 10 * snap(u - 2, 5), W = ch.handX, S = ch.sh[1], L = ch.armL;
  return { view: '34', dir: 1, x: 0, y: 0, rot: 5, feet: [{ x: -30, lift: 0 }, { x: 34, lift: 0 }], farArmFront: false,
    hands: [{ wx: -W * .95, wy: ch.hipY - 44, bow: .95 }, { wx: W * .55 + .95 * L + sh, wy: S - .12 * L - sh * .4, bow: .1, over: true }], head: 4, held: [] }; }

// LADY, 3/4: both fists pressed to her cheeks (Munch), shoulders up, leaning back; a little shudder every 8 f. Frame 0 = the gasp held.
function gasp(t, ch) { const f = fr(t), u = f % 8, s = f < 6 ? 0 : 4 * Math.sin(Math.PI * u / 4), W = ch.handX, S = ch.sh[1], L = ch.armL;
  return { view: '34', dir: 1, x: s * .5, y: -4, rot: -6, feet: [{ x: -22, lift: 0 }, { x: 22, lift: 0 }], farArmFront: true,
    hands: [{ wx: -W * .32 + s, wy: S - .62 * L, bow: .5 }, { wx: W * .32 + s, wy: S - .62 * L, bow: .5, over: true }], head: -5, held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('haul', haul, 'leans back, both fists on the pole, heaves'), sty('crate', crate, 'carries the bandage crate out, proud'),
  sty('point', point, 'points at the worker, fist on hip'), sty('gasp', gasp, 'fists to cheeks, shudders')];
export default { title: 'CROSSING board: episode moves', dur: 3, styles: STY };
export const front = { title: 'CROSSING board: episode moves (3/4)', dur: 3, styles: STY };

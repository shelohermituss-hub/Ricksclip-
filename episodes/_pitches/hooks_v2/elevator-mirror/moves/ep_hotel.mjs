// PITCH 5 hook episode moves (2026-11-16): THE MIRROR IN THE SLOW ELEVATOR. STUDIO MOTION form (notice, anticipate, strike, settle, dead still), drawn
// new on every frame (tween.ones). Frame 0 of each move is the HOLD of its action, so the still reads at phone size; after it the action plays on.
// Written facing +x (dir 1); film.json act dir -1 mirrors. Rig units: y down, ground MG 1010, ch.sh = [shoulder half width, shoulder y], ch.armL.
const PI = Math.PI, SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
const fr = t => Math.round(t * 30 * 100) / 100;

// JANITOR, side view: up on his toes at the mirror's top corner. Far fist flat on the mirror frame (holds it level), near fist on the screwdriver at the
// top screw, elbow out. Frame 0 = the HOLD mid-turn; then a quarter turn of the wrist every 14 f (anticipate back 3 f, snap 4 f, settle), head tilted up.
function janScrew(t, ch) { const f = fr(t), S = ch.sh[1], L = ch.armL, k = Math.floor(Math.max(0, f - 8) / 14), u = Math.max(0, f - 8) - k * 14;
  const twist = f < 8 ? 0 : u < 3 ? -6 * snap(u, 3) : -6 + 10 * snap(u - 3, 4) - 4 * snap(u - 7, 7);
  const near = [.80 * L + twist * .4, S - .46 * L + twist], far = [.86 * L, S - .02 * L];
  return { view: 'side', dir: 1, x: 0, y: -10, rot: 5, feet: [{ x: -70, lift: 0 }, { x: 34, lift: 0 }], farArmFront: false,
    hands: [{ wx: far[0], wy: far[1], bow: .35 }, { wx: near[0], wy: near[1], bow: .55, over: true }], head: -9, held: [] }; }

// OWNER, 3/4 facing the janitor: the near fist on his hip (elbow out = indignant), the bill held out at chest height in the screen-right fist;
// leans back, chin down. Frame 0 = the stare hold; then a small shake of the bill (2 f snap, 6 f settle) every 20 f.
function ownBill(t, ch) { const f = fr(t), S = ch.sh[1], L = ch.armL, W = ch.handX, u = f % 20, sh = f < 10 ? 0 : 8 * snap(u, 2) - 8 * snap(u - 2, 6);
  return { view: '34', dir: 1, x: 0, y: 0, rot: -3, feet: [{ x: -28, lift: 0 }, { x: 28, lift: 0 }],
    hands: [{ wx: -W * .98, wy: ch.hipY - 46, bow: .95 }, { wx: W * .62 + .06 * L, wy: S + .2 * L - sh, bow: .3 }], head: 4, held: [] }; }

// GUEST WITH THE WATCH, 3/4: near forearm raised across the chest, the far fist taps the wrist (tap = 2 f down, 4 f up, every 9 f). Frame 0 = fist on the wrist.
function gWatch(t, ch) { const f = fr(t), S = ch.sh[1], L = ch.armL, W = ch.handX, u = f % 9, tap = 12 * snap(u, 2) - 12 * snap(u - 2, 4);
  return { view: '34', dir: 1, x: 0, y: 0, rot: 2, feet: [{ x: -24, lift: 0 }, { x: 24, lift: 0 }], farArmFront: true,
    hands: [{ wx: W * .20, wy: S + .36 * L, bow: .6 }, { wx: W * .22, wy: S + .27 * L - tap, bow: .5, over: true }], head: 6, held: [] }; }

// LADY, 3/4: arms crossed tight over the chest, weight on one hip; foot tap on the near foot every 12 f. Frame 0 = arms locked.
function gCross(t, ch) { const f = fr(t), S = ch.sh[1], L = ch.armL, W = ch.handX, u = f % 12, lift = 14 * snap(u, 3) - 14 * snap(u - 3, 5);
  return { view: '34', dir: 1, x: 0, y: 0, rot: -2, feet: [{ x: -26, lift }, { x: 26, lift: 0 }], farArmFront: true,
    hands: [{ wx: W * .55, wy: S + .33 * L, bow: .7 }, { wx: -W * .5, wy: S + .30 * L, bow: .7, over: true }], head: -3, held: [] }; }

// SAILOR, 3/4: both fists on his hips, elbows out wide, chin forward; rocks on his heels every 24 f. Frame 0 = the planted pose.
function gHips(t, ch) { const f = fr(t), W = ch.handX, u = f % 24, rk = 3 * Math.sin(PI * u / 12) * snap(f, 8);
  return { view: '34', dir: 1, x: 0, y: 0, rot: rk, feet: [{ x: -30, lift: 0 }, { x: 30, lift: 0 }],
    hands: [{ wx: -W * 1.02, wy: ch.hipY - 40, bow: .95 }, { wx: W * 1.0, wy: ch.hipY - 40, bow: .95 }], head: 2, held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('jan_screw', janScrew, 'tiptoe at the top corner, quarter turns of the screwdriver'), sty('own_bill', ownBill, 'fist on hip, bill held out, stare'),
  sty('g_watch', gWatch, 'taps his wristwatch'), sty('g_cross', gCross, 'arms crossed, foot tap'), sty('g_hips', gHips, 'fists on hips, rocks on heels')];
export default { title: 'HOTEL hook: episode moves', dur: 3, styles: STY };
export const front = { title: 'HOTEL hook: episode moves (3/4)', dur: 3, styles: STY };

// hookA episode move (rough pitch frame): THE MASON NAILS THE SPEAR. Side view, facing screen right (+x) toward his work.
// Frame 0 = the top of the wind-up (STUDIO MOTION: ANTICIPATE / HOLD): the far fist holds the spear shaft out in front at chest height, the near fist has
// the hammer wound up high behind his head, the body leans back over the lower (back) foot, the front foot stands higher on the roof slope.
// After the hold: strike in 3 f on an arc down to the bracket, impact dip, ring, dead still (so the same move can play when the pitch is animated).
const PI = Math.PI, SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
export const SLOPE_LIFT = 76;       // rig px the front foot stands higher than the back foot (the roof slope under him)
function nail(t, ch) { const f = Math.round(t * 30 * 100) / 100, S = ch.sh[1], L = ch.armL;
  const far = [.97 * L, S + .02 * L], up = [-.82 * L, S - .3 * L], hit = [.62 * L, S + .34 * L];
  const TS = 14, u = Math.min(1, Math.max(0, (f - TS) / 3)), q = u * u; let near = [up[0] + (hit[0] - up[0]) * q, up[1] + (hit[1] - up[1]) * q - 60 * Math.sin(PI * u)];
  const dipv = f > TS + 3 && f < TS + 7 ? 10 * Math.sin(PI * (f - TS - 3) / 4) : 0, lean = -3 + 12 * snap(f - TS, 3) - 5 * snap(f - TS - 3, 8);
  return { view: 'side', dir: 1, x: 0, y: 4 + dipv, rot: lean, feet: [{ x: -150, lift: 0 }, { x: 10, lift: SLOPE_LIFT }],
    hands: [{ wx: far[0], wy: far[1], bow: .25 }, { wx: near[0], wy: near[1], bow: .5, over: true }], head: -4 + 8 * snap(f - TS, 3), held: [] }; }
const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
export default { title: 'TOWER hook: episode moves', dur: 3, styles: [sty('tower_nail', nail, 'wind-up hold, hammer strike on the bracket, dip, still')] };
export const front = { title: 'TOWER hook: episode moves (3/4)', dur: 3, styles: [sty('tower_nail', nail, 'same')] };

// HOOK episode moves (pitch 3, champagne, 1816). STUDIO MOTION, drawn new every frame. Frame 0 = the hook still.
// widow_drill: side view facing +x (her table). Leans over the brace: the far fist presses the head pad, the near fist turns the crank on a circle
//   (one turn every 20 f), the body bobs with each push (snap on the down stroke, settle), head down toward the bit.
// cellar_shock: 3/4 facing left toward her. Frame 0 = the top of a throw-up: both fists high and wide above the cap, body leaned back,
//   then a small settle bounce (impact 3 f, settle 10 f), dead still.
const PI = Math.PI, SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
export const DRILL = { pad: [.86, .02], crank: [.56, .46], crankR: .16 };   // in arm lengths from the shoulder line (x forward, y down)
function drill(t, ch) { const f = t * 30, S = ch.sh[1], L = ch.armL, ph = 2 * PI * f / 20;
  const pad = [DRILL.pad[0] * L, S + DRILL.pad[1] * L], cr = [DRILL.crank[0] * L + DRILL.crankR * L * Math.cos(ph) * .35, S + DRILL.crank[1] * L + DRILL.crankR * L * Math.sin(ph) * .15];
  const push = .5 - .5 * Math.cos(ph);   // one push per turn
  return { view: 'side', dir: 1, x: 0, y: 4 + 4 * push, rot: 13 + 2 * push, feet: [{ x: -150, lift: 0 }, { x: 46, lift: 0 }],
    hands: [{ wx: pad[0], wy: pad[1], bow: .25 }, { wx: cr[0], wy: cr[1], bow: .45, over: true }], head: 7 + 2 * push, held: [] }; }
function shock(t, ch) { const f = t * 30, S = ch.sh[1], L = ch.armL, s = snap(f, 3) - .25 * snap(f - 3, 10);
  const up = [[-.9 * L, S - .42 * L], [.92 * L, S - .38 * L]];
  return { view: '34', dir: -1, x: 0, y: -2 * s, rot: 5, feet: [{ x: -40, lift: 0 }, { x: 40, lift: 0 }],
    hands: [{ wx: up[0][0], wy: up[0][1] - 10 * s, bow: .35, over: true }, { wx: up[1][0], wy: up[1][1] - 10 * s, bow: .35, over: true }], head: -6, held: [] }; }
const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('widow_drill', drill, 'leans on the brace, cranks, pushes'), sty('cellar_shock', shock, 'hands thrown up, settle, still')];
export default { title: 'CHAMPAGNE hook: episode moves', dur: 3, styles: STY };
export const front = { title: 'CHAMPAGNE hook: episode moves (front / 3/4)', dur: 3, styles: STY };

// PITCH 4 hook episode moves (2026-11-16): THE SURGERY WHERE THE SURGEON DID NOTHING. STUDIO MOTION form (notice, anticipate, strike, settle,
// dead still), drawn new on every frame (tween.ones). Frame 0 of each move is the HOLD of its first action, so the still reads at phone size.
// Written facing +x (dir 1); film.json act dir -1 mirrors. Rig units: y down, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX, ch.hipY.
// The working hand is put ON the knee by film.json held3d tip_at (scalpel tip, bulb nozzle, needle); the steadying hand by hand_at (ch.tgt).
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
const fr = t => Math.round(t * 30 * 100) / 100;

// SURGEON, 3/4: three beats on the words. CUT (0-77 f, 'cut ... knee'): bent in over the knee, a tiny press of the scalpel every 16 f (anticipate up 3 f, snap
// down 3 f, settle). SPLASH (78-122 f, 'splashed'): straightens a little, the bulb hand squeezes twice (snap 2 f, settle 8 f). SEW (123 f on, 'sewed'): anticipates down,
// then the needle hand pulls the thread UP and out in a big arc (snap 5 f, settle 10 f), the body rises with it, then dead still.
function sgWork(t, ch) { const f = fr(t), S = ch.sh[1], L = ch.armL, W = ch.handX;
  let rot, head, near;
  if (f < 78) { const u = f % 16, pr = u < 3 ? -snap(u, 3) : u < 6 ? -1 + 2 * snap(u - 3, 3) : 1 - snap(u - 6, 8);
    rot = 11; head = 7 + pr * 1.5; near = [W * .9 + .52 * L, S + .78 * L + pr * 8]; }
  else if (f < 123) { const g = f - 78, sq = g < 10 ? snap(g, 2) - snap(g - 2, 8) : g < 26 ? 0 : snap(g - 26, 2) - snap(g - 28, 8);
    rot = 11 - 3 * snap(g, 10); head = 5 - sq * 2; near = [W * .9 + .5 * L, S + .62 * L - sq * 10]; }
  else { const g = f - 123, an = snap(g, 4) - snap(g - 4, 4), up = snap(g - 6, 5) - .06 * snap(g - 11, 10);
    rot = 9 - 7 * up + 2 * an; head = 5 - 9 * up; near = [W * .9 + (.72 + .15 * up) * L, S + (.62 + .1 * an - 1.3 * up) * L]; }
  const far = ch.tgt ? [ch.tgt[0], ch.tgt[1]] : [W * .8 + .45 * L, S + .8 * L];
  return { view: '34', dir: 1, x: 0, y: 0, rot, feet: [{ x: -34, lift: 0 }, { x: 30, lift: 0 }], farArmFront: true,
    hands: [{ wx: far[0], wy: far[1], bow: .45 }, { wx: near[0], wy: near[1], bow: .5, over: true }], head, held: [] }; }

// NURSE, 3/4 facing the surgeon: frame 0 = she has stopped dead, the near hand half up at chest height (a stiff "wait"), the far fist clutching
// a folded towel at the waist. At 3.9 s (just before 'sewed') the hand jerks higher to shoulder height and she leans in (anticipate back 3 f, snap 4 f, settle 10 f).
function nrStare(t, ch) { const f = fr(t), S = ch.sh[1], L = ch.armL, W = ch.handX, g = f - 116, an = snap(g, 3) - snap(g - 3, 3), up = snap(g - 3, 4) - .08 * snap(g - 7, 10);
  return { view: '34', dir: 1, x: 0, y: 0, rot: -2 - 3 * an + 6 * up, feet: [{ x: -26, lift: 0 }, { x: 26, lift: 0 }], farArmFront: true,
    hands: [{ wx: W * .35, wy: ch.hipY - 30, bow: .6 }, { wx: W * .8 + (.3 + .1 * up) * L, wy: S + (-.3 - .3 * up) * L, bow: .55, over: true }], head: 5 + 4 * up, held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('sg_work', sgWork, 'cut, splash, sew: three beats over the knee'), sty('nr_stare', nrStare, 'stops dead, hand half up, then higher')];
export default { title: 'SURGERY hook: episode moves', dur: 5, styles: STY };
export const front = { title: 'SURGERY hook: episode moves (3/4)', dur: 5, styles: STY };

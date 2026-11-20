// Pitch 4 hook episode moves (STUDIO MOTION form, drawn new on every frame; frame 0 = the HOLD of each act, then strike/settle so the same
// move can play when the pitch is animated).
//  owner_point : 3/4 facing right. Smug lean back, belly out; far (screen-right) arm snaps up into a point at the crate, near fist on the waistcoat.
//  sailor_buoy : front. Hunched, shoulders up, both fists clutch the lifebuoy at the chest (held3d two-hand), small tremble only during the move.
//  deck_panic  : 3/4 facing left. Both fists up beside the head, body pulled back from the water, front foot lifted off the wet deck.
//  docker_haul : side facing right. Leaning back on the tag rope, both fists on the rope in front, back foot braced.
const PI = Math.PI, SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
const F = t => Math.round(t * 30 * 100) / 100;

function ownerPoint(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, s = snap(f - 6, 5);
  const pt = [ch.sh[0] + 1.0 * L, S - .3 * L], rest = [ch.sh[0] + .5 * L, S + .4 * L];
  const far = [rest[0] + (pt[0] - rest[0]) * (1 - s * 0), rest[1] + (pt[1] - rest[1]) * 1];
  return { view: '34', dir: 1, x: 0, y: 0, rot: -5 + 1.5 * snap(f - 8, 8), feet: [{ x: -78, lift: 0 }, { x: 70, lift: 0 }],
    hands: [{ wx: -.25 * (ch.handX || 120), wy: ch.bodyBot - 170, bow: .35 }, { wx: far[0], wy: far[1], bow: .2 }], head: -6, held: [] }; }

function sailorBuoy(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, tr = f > 0 && f < 20 ? 2 * Math.sin(f * 2.1) * (1 - f / 20) : 0;
  return { view: 'front', dir: 1, x: tr, y: 8, rot: 0, shrug: 22, feet: [{ x: -62, lift: 0 }, { x: 58, lift: 0 }],
    hands: [{ wx: -.42 * L, wy: S + .42 * L, bow: .6 }, { wx: .42 * L, wy: S + .42 * L, bow: .6 }], head: 4, held: [] }; }

function deckPanic(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL;
  return { view: '34', dir: -1, x: 0, y: 0, rot: 7, shrug: 14, feet: [{ x: -60, lift: 0 }, { x: 70, lift: 34 }],
    hands: [{ wx: -.55 * L, wy: S - .78 * L, bow: .6 }, { wx: .5 * L, wy: S - .82 * L, bow: .6 }], head: 6, held: [] }; }

function dockerHaul(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL;
  return { view: 'side', dir: 1, x: 0, y: 6, rot: -14, feet: [{ x: -150, lift: 0 }, { x: 40, lift: 0 }],
    hands: [{ wx: .95 * L, wy: S - .2 * L, bow: .25 }, { wx: .7 * L, wy: S - .05 * L, bow: .4, over: true }], head: -6, held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('owner_point', ownerPoint, 'smug lean, point at the crate'), sty('sailor_buoy', sailorBuoy, 'hunched, clutching the lifebuoy'),
  sty('deck_panic', deckPanic, 'fists up, pulling back from the water'), sty('docker_haul', dockerHaul, 'leaning back on the tag rope')];
export default { title: 'COFFIN SHIP hook: episode moves', dur: 3, styles: STY };
export const front = { title: 'COFFIN SHIP hook: episode moves (front / 3-4)', dur: 3, styles: STY };

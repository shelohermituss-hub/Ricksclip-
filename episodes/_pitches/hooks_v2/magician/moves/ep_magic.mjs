// hooks_v2 pitch 1 episode moves (2026-11-16): THE BOX THE STRONGEST MAN COULDN'T LIFT. Frame 0 = the key pose of every move (the hook still);
// after it each move keeps playing (so the same moves can run when the pitch is animated): strain surges, the smug wave, the crowd's laughs.
// Units: rig px (ground G = 1010, x = 0 at the character's own position). Hands in world px {wx, wy}.
const PI = Math.PI, sin = Math.sin;
export const G = 1010;
// THE STRAIN (strongman, SIDE view facing right: in 3/4 the near arm could not reach the handle in front of him): wide stance, knees bent, hips dropped, the body thrown BACK over the rear foot, both fists locked on the box
// handle in front of his belly; every 0.5 s a surge (body jerks back 3 deg, shoulders shiver), the fists never move (the box does not move an inch).
export const HANDLE = { wx: 215, wy: 700 };   // where the fists close: the box handle (rig px), measured against the set in the film
function strain(t, ch) { const surge = Math.max(0, sin(2 * PI * t / .5)) ** 3, shiver = 3 * sin(t * 71);
  return { view: 'side', dir: 1, x: -30, y: 96 + 6 * surge, rot: -13 - 3 * surge, feet: [{ x: -190, lift: 0, kneeK: .9, toe: 0 }, { x: 30, lift: 0, kneeK: 1.0, toe: 0 }],
    hands: [{ wx: HANDLE.wx - 14, wy: HANDLE.wy + shiver * .3, bow: .35 }, { wx: HANDLE.wx + 14, wy: HANDLE.wy + shiver * .3, bow: .35 }], head: 8 + 2 * surge + shiver * .2, shrug: 18 + 4 * surge }; }
// THE SMUG WAVE (magician, 3/4 facing left toward the strongman): weight on the back leg, chest out, chin up, the near fist on his hip, the far fist up at
// head height waving lazily at the giant (a slow 1.2 s side to side), a tiny bob.
function wave(t, ch) { const S = ch.sh[1], Lr = ch.armL, w = sin(2 * PI * t / 1.2);
  return { view: '34', dir: -1, x: 0, y: 4 + 2 * sin(2 * PI * t / 2.4), rot: 4, feet: [{ x: -46, lift: 0, kneeK: .3 }, { x: 52, lift: 0, kneeK: .2, toe: -30 }],
    hands: [{ wx: -.3 * Lr, wy: S + .58 * Lr, bow: .9 }, { wx: .85 * Lr + 22 * w, wy: S - .66 * Lr, bow: .45 }], head: -9, shrug: 6 }; }
// LAUGH, POINTING (crowd): leaning back, the belly bouncing on a 4 f beat, one arm out pointing at the strongman, the other fist on the belly.
const laughPoint = (dir, ph = 0) => (t, ch) => { const S = ch.sh[1], Lr = ch.armL, b = Math.abs(sin(PI * (t * 30 + ph) / 4)) * 10;
  return { view: '34', dir, x: 0, y: b, rot: -9 * dir, feet: [{ x: -60, lift: 0, kneeK: .4 }, { x: 64, lift: 0, kneeK: .4 }],
    hands: [{ wx: .95 * Lr, wy: S - .32 * Lr, bow: .2 }, { wx: -.1 * Lr, wy: S + .62 * Lr + b, bow: .8 }], head: -16 * dir + .4 * b, shrug: 14 }; };
// LAUGH, DOUBLED (crowd): both fists on the belly, head thrown back, knees soft, the whole body bouncing.
const laughBelly = (dir, ph = 0) => (t, ch) => { const S = ch.sh[1], Lr = ch.armL, b = Math.abs(sin(PI * (t * 30 + ph) / 4)) * 12;
  return { view: 'front', dir, x: 0, y: 10 + b, rot: 3 * dir, feet: [{ x: -66, lift: 0, kneeK: .5 }, { x: 66, lift: 0, kneeK: .5 }],
    hands: [{ wx: -.32 * Lr, wy: S + .7 * Lr + b, bow: .7 }, { wx: .32 * Lr, wy: S + .7 * Lr + b, bow: .7 }], head: -14 * dir, shrug: 20 }; };
// THE BOY: on his toes, both fists up in the air, laughing and jumping (the hop starts after frame 0).
function boyHop(t, ch) { const S = ch.sh[1], Lr = ch.armL, u = (t % .6) / .6, hop = t < .3 ? 0 : 40 * Math.max(0, sin(PI * u));
  return { view: 'front', dir: 1, x: 0, y: -hop, rot: -4, feet: [{ x: -40, lift: hop, kneeK: .3 }, { x: 40, lift: hop, kneeK: .3 }], hands: [{ wx: -.55 * Lr, wy: S - .85 * Lr - hop, bow: .3 }, { wx: .6 * Lr, wy: S - .8 * Lr - hop, bow: .3 }], head: -10, shrug: 10 }; }
const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('strain', strain, 'both fists on the tiny box handle, thrown back, surging, the box never moves'), sty('wave', wave, 'smug lazy wave at the giant, fist on hip'),
  sty('laughR', laughPoint(1, 0), 'laughs and points to screen right'), sty('laughL', laughPoint(-1, 2), 'laughs and points to screen left'),
  sty('bellyA', laughBelly(1, 1), 'doubled-up belly laugh'), sty('bellyB', laughBelly(-1, 3), 'doubled-up belly laugh, other phase'), sty('boyhop', boyHop, 'boy hops with fists up')];
export default { title: 'MAGICIAN hook: episode moves', dur: 3, styles: STY };
export const front = { title: 'MAGICIAN hook: episode moves (front / 3/4)', dur: 3, styles: STY };

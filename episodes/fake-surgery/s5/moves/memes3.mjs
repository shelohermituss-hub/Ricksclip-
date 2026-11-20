// S5 v2 (2026-11-16): the kit's memes3 hub, unchanged, plus three episode faces for the knocked-out patient (FIX_BRIEF_v2 rule 6, rows 40-41).
// This file sits in the puppet_pkg folder "moves" (first in the list), so it is served as /puppets/memes3.mjs for S5 only; the kit file is not touched.
// Use in film.json as face: 'koSleep' | 'koMelt' | 'koBliss' (faceFn searches TEEN after MEMES, so the names must not exist in MEMES).
import { TEEN as TEEN0, TEEN_DEFS } from './faces_teen.mjs';
import { VILLAIN, VILLAIN_DEFS } from './faces_villain.mjs';
import { MONSTER, MONSTER_DEFS } from './faces_monster.mjs';
import { memes2Defs } from './memes2.mjs';
import { INK, brush } from './char2d.mjs';
import { L, P, ell, star4, heart, bird, blush, f1, PINK } from './memes.mjs';

const zz = (x, y, k = 1, col = INK) => {   // a drawn "z Z" (two strokes each, never a font)
  const z = (x0, y0, s) => L(`M${f1(x0)},${f1(y0)} l${f1(s)},0 l${f1(-s)},${f1(s)} l${f1(s)},0`, 4.2 * k, col);
  return [z(x, y, 16 * k), z(x + 22 * k, y - 34 * k, 24 * k)];
};
const zBubble = (x, y, k = 1) => [ell(x + 14 * k, y - 10 * k, 38 * k, 32 * k, '#ffffff', INK, 3.4), ell(x - 30 * k, y + 26 * k, 7 * k, 6 * k, '#ffffff', INK, 2.6), ...zz(x - 4 * k, y - 4 * k, .8 * k)];
const halo = (cx, hy) => [`<ellipse cx="${cx}" cy="${hy - 126}" rx="74" ry="15" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="6 7" opacity=".6"/>`, star4(cx - 66, hy - 128, 12), star4(cx + 70, hy - 132, 11), bird(cx - 8, hy - 112)];
const tongueMouth = (cx, hy, t = 1) => [brush(cx - 30, hy + 36, cx, hy + 50, cx + 30, hy + 34, 6, { tip: .4 }),
  P(`M${cx - 6},${hy + 42} Q${cx - 14},${hy + 42 + 50 * t} ${cx + 4},${hy + 44 + 50 * t} Q${cx + 20},${hy + 42 + 50 * t} ${cx + 14},${hy + 44}`, PINK, INK, 3.5)];
const spiral = (x, y) => { let d = `M${x},${y}`; for (let a = 0; a < Math.PI * 6; a += .25) { const r = 1.15 * a; d += ` L${f1(x + Math.cos(a) * r)},${f1(y + Math.sin(a) * r)}`; } return L(d, 4.5); };
const happyLid = (ex, ey, w = 18) => brush(ex - w, ey + 6, ex, ey - 12, ex + w, ey + 6, 7, { tip: .4 });   // ^ closed happy eye
const restLid = (ex, ey, w = 18) => brush(ex - w, ey - 2, ex, ey + 8, ex + w, ey - 2, 7, { tip: .4 });    // relaxed closed eye

const EXTRA = {
  // KNOCKED OUT asleep: the kit's ko (spiral + X eyes, tongue flop, birdies, dazed ring) WITHOUT the head bump (reads as an injury), plus a zZ bubble
  koSleep: (cx, hy) => ({ over: [spiral(cx - 34, hy - 16), brush(cx + 20, hy - 30, cx + 34, hy - 16, cx + 50, hy - 2, 8, { tip: .5 }), brush(cx + 50, hy - 30, cx + 34, hy - 16, cx + 20, hy - 2, 8, { tip: .5 }),
    ...tongueMouth(cx, hy), ...halo(cx, hy)], rot: 18 }),   // v3: no zZ in the face (zzz_fx floats the Zs, A3)
  // the melt (4-6 frames): eyes relax shut, the tongue slides half in, the corners lift, the first heart
  koMelt: (cx, hy) => ({ over: [restLid(cx - 32, hy - 16), restLid(cx + 32, hy - 16), brush(cx - 32, hy + 34, cx, hy + 54, cx + 32, hy + 32, 6.5, { tip: .4 }),
    P(`M${cx - 4},${hy + 46} Q${cx - 8},${hy + 66} ${cx + 4},${hy + 67} Q${cx + 15},${hy + 66} ${cx + 12},${hy + 46}`, PINK, INK, 3.2), ...halo(cx, hy), heart(cx + 92, hy - 92, 13)], rot: 14 }),
  // BLISS: happy closed eyes, a wide dreamy smile, blush, little hearts floating up, a happy zZ (the Z ends in a heart)
  koBliss: (cx, hy) => ({ over: [happyLid(cx - 32, hy - 14), happyLid(cx + 32, hy - 14), brush(cx - 40, hy + 28, cx, hy + 66, cx + 40, hy + 26, 8, { bias: .5, tip: .35 }),
    P(`M${cx - 18},${hy + 44} Q${cx},${hy + 60} ${cx + 18},${hy + 44} Q${cx},${hy + 52} ${cx - 18},${hy + 44} Z`, PINK, INK, 2.4), ...blush(cx, hy, 1.0),
    heart(cx + 86, hy - 98, 15), heart(cx + 122, hy - 140, 11), heart(cx - 78, hy - 118, 10), star4(cx - 96, hy - 70, 9, '#fff2a8')], rot: 12 }),
};
export const TEEN = { ...TEEN0, ...EXTRA };
export { VILLAIN, MONSTER };
export const memes3Defs = () => memes2Defs() + TEEN_DEFS + VILLAIN_DEFS + MONSTER_DEFS;

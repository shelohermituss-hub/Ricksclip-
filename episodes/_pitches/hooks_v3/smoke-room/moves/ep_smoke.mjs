// PITCH 3 hook episode moves (2026-11-16): THE ROOM FILLS WITH SMOKE AND NOBODY MOVES. STUDIO MOTION form (notice, anticipate, strike, settle, dead
// still), drawn new on every frame (tween.ones). All three sit at small tables seen FRONT-ON (the 3D table hides the legs, like act_desk clerkF):
// body dropped y 190, thighs to the lens (kneeK), both fists ON the table top (rig DT 690 = the 3D table top). Frame 0 of each move is a held writing pose.
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
const fr = t => Math.round(t * 30 * 100) / 100, DT = 690;
const sitF = o => ({ view: 'front', dir: 1, x: 0, y: 190, rot: 0, feet: [{ x: -60, kneeK: .2 }, { x: 58, kneeK: .2 }], ...o });

// THE STUDENT: writes fast and neat. Pencil fist travels along a line in 4 snapped word-strokes (each: 2 f lift, 4 f snap across, settle), then a
// carriage return back to the left (anticipate up, snap, settle) = one line every 30 f. Near fist flat on the form holds it. Head down to the page.
function stWrite(t) { const f = fr(t), L = f % 30, w = Math.min(3, Math.floor(L / 6)), u = L - w * 6;
  const along = L < 24 ? 14 * w + 14 * snap(u - 1, 4) : 56 - 56 * snap(L - 24, 5), lift = L < 24 ? 5 * snap(u, 1) - 5 * snap(u - 1, 3) : 12 * Math.sin(Math.PI * Math.min(1, (L - 24) / 6));
  const line = Math.floor(f / 30) * 5;
  return sitF({ rot: 2, hands: [{ wx: -92, wy: DT + 2, bow: .55 }, { wx: 40 + along, wy: DT - 14 - lift + line * .2, bow: .6 }], head: 7 }); }

// CALM MAN A (pipe): slow writing, then THE SHRUG (f100): shoulders up 4 f snap, a 10 f hold, a slow 12 f settle; the pencil never stops.
function caPipe(t) { const f = fr(t), L = f % 45, along = 30 * snap(L, 30) - 30 * snap(L - 36, 8);
  const sh = 26 * snap(f - 100, 4) - 26 * snap(f - 114, 12);
  return sitF({ rot: -2, shrug: sh, hands: [{ wx: -96, wy: DT + 2 - sh * .3, bow: .55 }, { wx: 44 + along, wy: DT - 12 - sh * .4, bow: .6 }], head: 4 - sh * .15 }); }

// CALM MAN B (blazer): writes, and at f70 turns the page with the near fist (anticipate 3 f, sweep 6 f, settle), unhurried.
function cbWrite(t) { const f = fr(t), L = f % 40, along = 24 * snap(L, 28) - 24 * snap(L - 32, 8);
  const pg = snap(f - 70, 9) - snap(f - 82, 10), ant = 6 * snap(f - 67, 3) * (1 - snap(f - 70, 3));
  return sitF({ rot: 1, hands: [{ wx: -92 + 120 * pg - ant, wy: DT + 2 - 50 * Math.sin(Math.PI * pg), bow: .55 }, { wx: 46 + along, wy: DT - 12, bow: .6 }], head: 5 }); }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('st_write', stWrite, 'student writes fast, word strokes and carriage returns'), sty('ca_pipe', caPipe, 'calm man A writes slowly, one shrug'),
  sty('cb_write', cbWrite, 'calm man B writes, turns the page')];
export default { title: 'SMOKE ROOM hook: episode moves (front, seated at a table)', dur: 5, styles: STY };
export const front = { title: 'SMOKE ROOM hook: episode moves (front)', dur: 5, styles: STY };

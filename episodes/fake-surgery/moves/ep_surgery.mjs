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


// PATIENT RECLINED ON THE OR TABLE (cast phase A, 2026-11-16; CB "use patient also chracter"). The table's head section is raised about 35 deg:
// the whole body card is turned back about the HIP (rot -55 = 35 deg above the table pad), the head tilted forward again (+22) as if on a pillow, so the
// face reads in 3/4 or side over the drape. The body bottom rests ON the card ground line = the table pad top (film.json act pos z = pad height).
// Legs: the far leg lies along the pad, the near leg bent with the knee up (under the drape; the hero knee prop is the one the viewer sees).
// Styles: pt_recline (drowsy rest, slow breathing, hands on the belly), pt_thumbs (row 10: the near fist rises slowly to a thumbs-up height above the
// drape and holds), pt_smile (row 30 / 40-41: rest, head lifts a touch on the smile). Faces come from film.json (faces_ep: drowsy, wince, thumbsSmile, springGrin).
function ptRecline(t, ch, mode = 'rest', view = '34') { const f = fr(t), br = Math.sin(2 * Math.PI * t / 4.2), R = (-55 + .8 * br) * Math.PI / 180;
  // pivot = the BACK-BOTTOM of the body (on the pad, where the raised head section hinges): everything else turns up and back from it, nothing sinks
  const X0 = 230, B = (ch.handX ?? 120) - 14, y = (MGP - 10) - ch.bodyBot, gy = MGP - 10, piv = [X0 - B, gy], legL = ch.legL;   // X0: the body slides right on the card so the head stays inside it
  const rot = q => { const dx = q[0] - piv[0], dy = q[1] - piv[1], c = Math.cos(R), s = Math.sin(R); return [piv[0] + dx * c - dy * s, piv[1] + dx * s + dy * c]; };
  const hip = rot([X0, ch.hipY + y]), up = mode === 'thumbs' ? snap(f - 10, 24) - .06 * snap(f - 34, 12) : 0, lift = mode === 'smile' ? snap(f - 6, 10) : 0;
  const near = up > 0 ? { f: .28 + .5 * up, d: .62 - 1.0 * up, bow: .45, over: true } : { f: .3, d: .64, bow: .45, over: true };
  const r0 = v => Math.round(v), kneeN = [hip[0] + legL * .45, gy - legL * .6], ankN = [Math.min(320, hip[0] + legL * .9), gy - 6], kneeF = [hip[0] + legL * .5, gy - 14], ankF = [Math.min(335, hip[0] + legL * .95), gy - 6];
  return { view, dir: 1, x: X0, y, rot: R * 180 / Math.PI, pivot: piv, head: 22 + 3 * lift - .6 * br,
    feet: [{ pts: [hip, kneeN, ankN].map(q => q.map(r0)), curve: true }, { pts: [[hip[0] + 8, hip[1] + 4], kneeF, ankF].map(q => q.map(r0)), curve: true }],
    hands: [{ f: .32, d: .7, bow: .4 }, near], farArmFront: false, held: [] }; }
const MGP = 1010;

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('sg_work', sgWork, 'cut, splash, sew: three beats over the knee'), sty('nr_stare', nrStare, 'stops dead, hand half up, then higher'),
  sty('pt_recline', t => 0, 'patient reclined 35 deg on the table, drowsy rest'), sty('pt_thumbs', t => 0, 'reclined, slow thumbs-up fist'), sty('pt_smile', t => 0, 'reclined, head lifts on the smile'), sty('pt_recline_side', t => 0, 'reclined, side view (camera across the table)')];
for (const [k, m, v] of [['pt_recline', 'rest', '34'], ['pt_thumbs', 'thumbs', '34'], ['pt_smile', 'smile', '34'], ['pt_recline_side', 'rest', 'side']]) STY.find(s => s.key === k).pose = (t, ch) => ptRecline(t, ch, m, v);
export default { title: 'SURGERY hook: episode moves', dur: 5, styles: STY };
export const front = { title: 'SURGERY hook: episode moves (3/4)', dur: 5, styles: STY };

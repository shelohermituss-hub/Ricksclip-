// EPISODE MOVES, fake-surgery S1 (film 0-12.5 s = frames 0-374, plan rows 1-10, script lines 1-3), S1 stretch builder 2026-11-16.
// STUDIO MOTION form (./studio_ep.mjs: Rick's snap 5/16/31/48/66 %, settle, DEAD STILL in holds), drawn new on every frame (tween.ones).
// Pattern: ../../moves/ep_surgery.mjs (sg_work, nr_stare, pt_recline). Every move starts at FILM frame 0 (act at 0), so f = t * 30 = the film frame.
// Rig units: y down, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX. Written facing +x (dir 1); film.json dir -1 mirrors.
// The working (near) fist is put ON the knee by film.json held3d tip_at (scalpel tip on the dots, bulb nozzle, plaster sticky end on knee_plaster_n);
// ROUND 2: the working near arm + fist + tool is drawn by the SET (or_room hand3d) ON the knee; the card's near arm is tucked BEHIND the body (behind: true).
// the steadying (far) fist by hand_at (ch.tgt) BEHIND and above the knee: never over it.
import { snap, tr, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000, PI = Math.PI;
// the words (words_s1.json start * 30; "Doctor" and "you" moved to the loudness curve of voice.wav: 10.12 / 11.10)
export const W = { surgeon: 6, cut: 16, three: 25, tiny: 37, holes: 46, mans: 64, knee: 73, splashed: 88, water: 104, stuck: 131, three2: 147, plasters: 155,
  never: 187, inside: 213, knee2: 228, nurse: 250, leans: 256, whispers: 279, doctor: 304, you: 333, forgot: 338, operation: 350 };
// POWER r5 timing: slap 1 on "stuck" (133), slap 2 on "three" (147), hand hangs HIGH 148-155 (hold 8 f), IMPACT 156-157, slap 3 lands 156, settle, small pat 166
export const PW = { s1: 133, s2: 147, up: 148, s3: 156, pat: 166 };

// ---- SURGEON m:sg_s1 (3/4). Beats: CUT three touches (25 / 37 / 46: anticipate up 3 f, press 3 f, settle 8 f); rows 3: still, eyes on the knee;
// SPLASH two perfume squeezes (90, 104: snap 2 f, settle 8 f, body straightens a hair); PLASTERS: slap 1 (133) and 2 (147) like stamps, then the hand
// hangs HIGH (148-155, the anticipation hold), slams on 156, settles, a small pat 166; rows 6-9: calm, a nod on "nurse"; row 10: listens, nod on "forgot",
// pats the third plaster on "operation" (350).
function sgS1(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const press = f0 => { const u = f - f0 + 3; return u < 0 || u > 14 ? 0 : u < 3 ? -snap(u, 3) : u < 6 ? -1 + 2 * snap(u - 3, 3) : 1 - snap(u - 6, 8); };
  const pr = press(W.three) + press(W.tiny) + press(W.holes);
  const sq = f0 => snap(f - f0, 2) - snap(f - f0 - 2, 8);
  const squeeze = sq(90) + sq(104);
  // plaster slaps: rise 6 f before, slap 3 f, settle 8 f
  const slap = f0 => snap(f - f0 + 6, 4) - snap(f - f0 + 2, 3) * 1.2 + .2 * snap(f - f0 + 2 - 3, 8);
  const hang = snap(f - PW.up, 4) * 1.8 - snap(f - (PW.s3 - 2), 2) * 2.2 + .4 * snap(f - PW.s3, 8);
  const lift = f < 128 ? 0 : f < PW.up ? slap(PW.s1) + slap(PW.s2) : hang;
  const pat = f0 => snap(f - f0 + 3, 3) - snap(f - f0, 3) + .0 * f0;
  const pats = pat(PW.pat) + pat(W.operation) + .6 * pat(W.operation + 9);
  const rot = tr([[0, 11], [84, 8, 10], [126, 11, 8], [PW.up, 7, 6], [PW.s3 - 2, 13, 3], [PW.s3 + 4, 11, 10], [W.nurse, 10, 12], [W.forgot, 12, 9], [W.forgot + 14, 10, 12]], f);
  const head = tr([[0, 7], [W.mans, 2, 10], [84, 3, 10], [126, 7, 8], [PW.up, 1, 6], [PW.s3 - 2, 9, 3], [PW.s3 + 4, 7, 10], [W.nurse, 2, 12], [W.doctor, -3, 10], [W.forgot, 4, 9], [W.forgot + 14, -2, 10], [W.operation, 6, 6], [W.operation + 10, 3, 10]], f)
    + 1.5 * pr + ring(f, PW.s3, 3, 10);
  const near = [Wd * .9 + .55 * L, S + .8 * L + pr * 8 - squeeze * 6 - lift * .35 * L];
  const far = ch.tgt ? [ch.tgt[0], ch.tgt[1] + 10 * pats] : [Wd * .8 + .45 * L, S + .8 * L + 10 * pats];
  return { view: '34', dir: 1, x: 0, y: dip(f, PW.s3, 6, 4), rot, feet: [{ x: -34, lift: 0 }, { x: 30, lift: 0 }], farArmFront: true,
    hands: [{ wx: far[0], wy: far[1], bow: .45 }, { wx: Wd * .1 + .5 * (near[0] - Wd * .9 - .55 * L), wy: S + .42 * L + .5 * (near[1] - S - .8 * L), bow: .3, behind: true }], head, held: [] }; }

// ---- NURSE m:nr_s1 (3/4, facing the surgeon). f0: arms folded, standing back (dry). "nurse" (250): stops dead (a jolt back 3 f, settle, glasses chain ring);
// "leans" (256): leans in to his ear (snap 10 f); "whispers" (279): near fist up, cupped at her mouth; "forgot" (338): the far fist flat out low toward the
// clean tray, head down to it; "operation" (350): head up to him, eyebrow up (face), the cupped fist drops a little.
function nrS1(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const jolt = snap(f - W.nurse, 3) - snap(f - W.nurse - 3, 9);
  const lean = snap(f - W.leans, 10);
  const cup = snap(f - W.whispers, 8) - .25 * snap(f - W.operation, 10);
  const point = snap(f - W.forgot, 12) - snap(f - W.operation - 6, 12);
  const rot = -2 - 4 * jolt + 9 * lean + 2 * point;
  const head = tr([[0, 2], [W.leans, 9, 10], [W.forgot, 15, 10], [W.operation + 2, 6, 10]], f) + ring(f, W.nurse + 3, 3, 10);
  const fold = [Wd * .2, S + .38 * L];
  const nearH = [fold[0] + cup * (.22 * L), fold[1] - cup * (.72 * L)];
  const farH = [-Wd * .1 + point * (.95 * L), S + .36 * L + point * (.18 * L)];
  return { view: '34', dir: 1, x: 0, y: 0, rot, feet: [{ x: -26, lift: 0 }, { x: 26, lift: 0 }], farArmFront: true,
    hands: [{ wx: farH[0], wy: farH[1], bow: .5 }, { wx: nearH[0], wy: nearH[1], bow: .55, over: true }], head, held: [] }; }

// ---- PATIENT m:pt_s1 (reclined 35 deg, from ../../moves/ep_surgery.mjs ptRecline): drowsy rest + slow breath; "man's" (64): the head lifts a hair
// (moustache twitch is the face key); "operation" (350): the near fist rises slowly to a thumbs-up above the drape (24 f) and holds.
const MGP = 1010;
function ptS1(t, ch) { const f = F(t), br = Math.sin(2 * PI * t / 4.2), R = (-55 + .8 * br) * PI / 180;
  const X0 = 230, B = (ch.handX ?? 120) - 14, y = (MGP - 10) - ch.bodyBot, gy = MGP - 10, piv = [X0 - B, gy], legL = ch.legL;
  const rot = q => { const dx = q[0] - piv[0], dy = q[1] - piv[1], c = Math.cos(R), s = Math.sin(R); return [piv[0] + dx * c - dy * s, piv[1] + dx * s + dy * c]; };
  const hip = rot([X0, ch.hipY + y]), up = snap(f - (W.operation - 6), 24) - .06 * snap(f - (W.operation + 18), 12), lift = snap(f - W.mans, 10) - snap(f - W.mans - 14, 12);
  const near = up > 0 ? { f: .28 + .5 * up, d: .62 - 1.0 * up, bow: .45, over: true } : { f: .3, d: .64, bow: .45, over: true };
  const r0 = v => Math.round(v), kneeN = [hip[0] + legL * .45, gy - legL * .6], ankN = [Math.min(320, hip[0] + legL * .9), gy - 6], kneeF = [hip[0] + legL * .5, gy - 14], ankF = [Math.min(335, hip[0] + legL * .95), gy - 6];
  return { view: '34', dir: 1, x: X0, y, rot: R * 180 / PI, pivot: piv, head: 22 + 3 * lift - .6 * br,
    feet: [{ pts: [hip, kneeN, ankN].map(q => q.map(r0)), curve: true }, { pts: [[hip[0] + 8, hip[1] + 4], kneeF, ankF].map(q => q.map(r0)), curve: true }],
    hands: [{ f: .32, d: .7, bow: .4 }, near], farArmFront: false, held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('sg_s1', sgS1, 'S1 surgeon: three touches, two squeezes, three stamp slaps (power hold on 3), pats'),
  sty('nr_s1', nrS1, 'S1 nurse: folded, stops, leans in, cups her mouth, points at the tray'),
  sty('pt_s1', ptS1, 'S1 patient reclined: drowsy, head lift on "man\'s", thumbs-up on "operation"')];
export default { title: 'fake-surgery S1 episode moves', dur: 12.5, styles: STY };
export const front = { title: 'fake-surgery S1 episode moves (3/4)', dur: 12.5, styles: STY };

// EPISODE MOVES, fake-surgery S3 (film 25.90-42.70 s = frames 777-1281, plan rows 21-30, script lines 7-9), S3 stretch builder 2026-11-16.
// STUDIO MOTION form (./studio_ep.mjs: Rick's snap, settle, DEAD STILL in holds), drawn new on every frame (tween.ones). Every move starts at FILM frame 0
// (act at 0), so f = t * 30 = the film frame. Written facing +x (dir 1); film.json dir -1 mirrors. Rig units: y down, ch.sh, ch.armL, ch.handX.
// Pattern: ../../moves/ep_surgery.mjs + ../../s1/moves/ep_s1.mjs (ptRecline).
import { snap, tr, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000, PI = Math.PI;
// word frames (voice/words.json start * 30; the three "60" checked on the loudness curve of voice.wav, see ../words_s3.json)
export const W = { sixty1: 793, scraped: 812, sixty2: 841, rinsed: 853, sixty3: 879, trick: 902, everyone: 932, signs: 941, form: 958, pretend: 996, surgery: 1003,
  nobody: 1030, told: 1046, which: 1053, real: 1100, plays: 1123, screen: 1143, wiggles: 1169, leg: 1185, splashes: 1201, water: 1215, loudly: 1226, sounds: 1252, real2: 1261 };
export const PW = { peel: 879, walk: 890, stick: 902 };
const stand = [{ x: -34, lift: 0 }, { x: 30, lift: 0 }];
export const WALKS = [[790, 829, 2.31], [832, 847, 2.87], [848, 879, -0.26], [890, 902, -1.7]];   // [from, to, vm]: vm = card px/f the STANCE foot counter-moves (world-fixed) = lateral card speed; sign: dir -1 mirrors   // v2: the office floor moves (film.json acts move_s), walked

// ---- SURGEON, MASK DOWN, office (rows 21-23) m:so_s3. Beside the lockers, a card from the tray in the near fist; on each "60" the near fist snaps out to point
// at the label (snap 6, settle 10, back on the rest after 20 f); "60" no. 3: turns to the locker, the fist reaches up to the note (peel 879), brings it in to the
// chest (886), carries it to tray 3 (walk 890-904 is the act), sticks it on the label (902, thumb press dip), pats it (912); the wink is the face key.
function soS3(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const pt = f0 => snap(f - f0, 8) - snap(f - f0 - 22, 12);
  const point = pt(W.sixty1) + pt(W.sixty2);
  const reach = snap(f - PW.peel, 8) - snap(f - PW.peel - 10, 10), carry = snap(f - PW.peel - 10, 10), stick = snap(f - PW.stick + 4, 8), pat = snap(f - 914, 4) - snap(f - 920, 10);
  const nx = Wd * .9 + L * (.32 + .45 * point + .5 * reach - .15 * carry + .45 * stick);
  const ny = S + L * (.62 - .2 * point - .95 * reach + .25 * carry * (1 - stick) + .22 * stick) + 8 * pat;
  const rot = tr([[0, 2], [W.sixty1, 5, 8], [W.sixty1 + 22, 2, 12], [W.sixty2, 5, 8], [W.sixty2 + 22, 2, 12], [PW.peel, -3, 6], [PW.peel + 8, 2, 8], [PW.stick - 4, 9, 6], [PW.stick + 14, 4, 12]], f);
  const head = tr([[0, 3], [W.sixty1, 7, 6], [W.sixty1 + 22, 3, 10], [W.sixty2, 7, 6], [W.sixty2 + 22, 3, 10], [PW.peel, -6, 6], [PW.peel + 8, 4, 8], [W.trick, -4, 5], [W.trick + 10, 2, 10]], f) + ring(f, PW.stick, 3, 10);
  // v2 (CB "why they sliding"): every floor move of film.json is a walk: alternating stepping feet (8 f per step, lifted swing foot), a bob per step
  // v2 round 2: stance foot counter-moves at the card's lateral speed (world-fixed), swing foot returns lifted; feet carried across holds; negated while the card is mirrored (dir +1 at 879-888)
  let bob = 0, feet = stand; { let carry = [stand[0].x, stand[1].x]; const base = carry.slice();
    for (const [a, b, vm] of WALKS) { if (f < a) break; const end = Math.min(f, b), g = end - a, K = Math.floor(g / 8), u = (g - K * 8) / 8; const cur = carry.slice(); let fx = null, lf = [0, 0];
      // replay steps 0..K to know each foot's start of stance
      let st = carry.slice(); for (let k = 0; k <= K; k++) { const uu = k < K ? 1 : u; const i0 = k % 2, i1 = 1 - k % 2;   // foot i0 stance, i1 swing in step k
        const x = []; x[i0] = st[i0] + vm * 8 * uu; x[i1] = st[i1] + (base[i1] - st[i1]) * uu; const l = [0, 0]; l[i1] = 14 * Math.sin(PI * uu); if (k === K) { fx = x; lf = l; } st = x; }
      if (f >= b) { carry = fx; /* standing after the walk */ } else { carry = fx; if (f >= a) { feet = [{ x: fx[0], lift: lf[0] }, { x: fx[1], lift: lf[1] }]; bob = -5 * Math.sin(PI * u); } } if (f < b) break; }
    if (feet === stand) feet = [{ x: carry[0], lift: 0 }, { x: carry[1], lift: 0 }];
    if (f >= 880 && f < 888) feet = feet.map(q => ({ x: -q.x, lift: q.lift })); }
  return { view: '34', dir: 1, x: 0, y: dip(f, PW.stick, 5, 4) + bob, rot, feet, farArmFront: true,
    hands: [{ wx: Wd * .7, wy: S + .78 * L, bow: .45 }, { wx: nx, wy: ny, bow: .5, over: true }], head, held: [] }; }

// ---- SURGEON, MASKED, pre-op + OR (rows 26-30) m:sg_s3. r26: the envelope fist rises to the chest pocket on "nobody" (1034), slips it in (1046),
// slides it HIGHER on "which" (1053) as the patient peeks. OR: hands on the knee (1087-1168); "wiggles": pumps the knee like a pump handle, the near fist
// down-up every 10 f (1169-1200); "splashes": the jug fist rises HIGH (1196, hold 1204-1214 = anticipation), tips on "water" (1215), the pour, back down
// after "loudly" (1232); "sounds": calm, a small showman nod (1252).
function sgS3(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const up = snap(f - W.nobody - 2, 8), tuck = snap(f - W.told, 5), high = snap(f - W.which, 4) - .15 * snap(f - W.which - 4, 8);
  let nx = Wd * .4 + L * (.1 + .15 * up - .1 * tuck), ny = S + L * (.85 - .55 * up - .1 * tuck - .22 * high);
  { const b = snap(f - 1076, 10); nx += (Wd * .9 + .55 * L - nx) * b; ny += (S + .78 * L - ny) * b; }
  if (f >= W.wiggles && f < 1189) { const g = f - W.wiggles, per = 10, k = Math.floor(g / per), h = g - k * per, u = k % 2 === 0 ? snap(h, per) : 1 - snap(h, per); ny += 18 * u; }
  const lift = snap(f - 1194, 10) - snap(f - 1233, 12), tip = snap(f - W.water, 10) - snap(f - 1233, 12);
  if (f >= 1194) { nx = Wd * .9 + L * (.55 + .1 * lift + .08 * tip); ny = S + L * (.78 - 1.15 * lift + .1 * tip); }
  const rot = tr([[0, 3], [W.told, 6, 8], [W.which, 2, 10], [1100, 8, 12], [W.wiggles, 12, 6], [1196, 4, 8], [W.water, 7, 6], [1233, 5, 12], [W.sounds, 3, 12]], f);
  const head = tr([[0, 2], [W.nobody, -2, 8], [W.which, 4, 6], [W.which + 10, 0, 10], [1100, 6, 12], [W.wiggles, 9, 6], [1196, -5, 8], [W.loudly - 1, 2, 8], [W.sounds, -3, 8], [W.sounds + 10, 1, 10]], f);
  const pump = f >= W.wiggles && f < 1189 ? (() => { const g = f - W.wiggles, k = Math.floor(g / 10), h = g - k * 10; return k % 2 === 0 ? snap(h, 10) : 1 - snap(h, 10); })() : 0;
  const far = ch.tgt ? [ch.tgt[0], ch.tgt[1] + 14 * pump] : [Wd * .8 + .45 * L, S + .8 * L + 14 * pump];
  return { view: '34', dir: 1, x: 0, y: 0, rot: rot + 3 * pump, feet: stand, farArmFront: true,
    hands: [{ wx: far[0], wy: far[1], bow: .45 }, { wx: nx, wy: ny, bow: .5, over: true }], head: head + 2 * pump, held: [] }; }

// ---- NURSE, OR (rows 27-30) m:nr_s3. Arms folded, dry; on the SPLOOSH (1226) a jolt back (3 f), then both fists up to her glasses (1236) and a slow
// deadpan wipe (three small rubs, 1240-1270), eyebrow up is the face.
function nrS3(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const jolt = snap(f - W.loudly, 4) - snap(f - W.loudly - 6, 12), wipe = snap(f - 1236, 10);
  let rub = 0; for (const f0 of [1248, 1264]) rub += snap(f - f0, 6) - snap(f - f0 - 6, 10);
  const fold = [Wd * .2, S + .38 * L];
  const nearH = [fold[0] + wipe * .3 * L + rub * 9, fold[1] - wipe * .78 * L], farH = [-Wd * .1 + wipe * .5 * L - rub * 6, S + .36 * L - wipe * .74 * L];
  return { view: '34', dir: 1, x: 0, y: 0, rot: -2 - 5 * jolt, feet: [{ x: -26, lift: 0 }, { x: 26, lift: 0 }], farArmFront: true,
    hands: [{ wx: farH[0], wy: farH[1], bow: .5 }, { wx: nearH[0], wy: nearH[1], bow: .55, over: true }], head: 3 - 4 * jolt + 5 * wipe + ring(f, W.loudly + 3, 3, 10), held: [] }; }

// ---- PATIENT, standing, pre-op (rows 24-26) m:pt_s3. Cane in the far fist; "everyone": leans to the side table (932); "signs": the pen fist scribbles
// the signature (941-975, small strokes every 6 f); "pretend": the tick (996: snap down-up); "told": leans toward the surgeon's pocket to peek (1046), "which":
// pulled back upright, a little sheepish (1056).
function ptS3(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const lean = snap(f - W.everyone, 10) - snap(f - 1020, 12), peek = snap(f - W.told, 8) - snap(f - W.which - 3, 12);
  let scr = 0; for (let f0 = W.signs; f0 < 975; f0 += 8) scr += snap(f - f0, 8) * (((f0 - W.signs) / 8) % 2 ? -1 : 1);
  const tick = snap(f - W.pretend, 5) - snap(f - W.pretend - 5, 10);
  const nx = Wd * .9 + L * (.35 + .35 * lean) + 10 * scr, ny = S + L * (.7 + .1 * lean) + 8 * tick;
  return { view: '34', dir: 1, x: 0, y: 0, rot: 2 + 10 * lean + 9 * peek, feet: stand, farArmFront: false,
    hands: [{ wx: Wd * .6, wy: S + .9 * L, bow: .4 }, { wx: nx, wy: ny, bow: .5, over: true }], head: tr([[0, 2], [W.everyone, 8, 10], [1020, 2, 10], [W.told, 10, 6], [W.which + 3, 0, 10]], f), held: [] }; }

// ---- EXTRAS in the pre-op bay (row 24) m:ex_s3: hold a clipboard at the chest, one page flip each (snap 4, settle 8) at their own beat.
function exS3(t, ch, f1 = 950) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX, fl = snap(f - f1, 8) - snap(f - f1 - 10, 12);
  return { view: '34', dir: 1, x: 0, y: 0, rot: 1, feet: stand, farArmFront: true, hands: [{ wx: Wd * .5, wy: S + .5 * L, bow: .45 }, { wx: Wd * .7 + .1 * L, wy: S + (.45 - .2 * fl) * L, bow: .5, over: true }], head: 4 + 3 * fl, held: [] }; }

// ---- PATIENT RECLINED on the OR table (rows 27-30) m:ptr_s3 (from ep_surgery.mjs ptRecline): drowsy rest, slow breath; "sounds" (1252): the head lifts on the smile.
const MGP = 1010;
function ptrS3(t, ch) { const f = F(t), br = Math.sin(2 * PI * t / 4.2), R = (-55 + .8 * br) * PI / 180;
  const X0 = 230, B = (ch.handX ?? 120) - 14, y = (MGP - 10) - ch.bodyBot, gy = MGP - 10, piv = [X0 - B, gy], legL = ch.legL;
  const rot = q => { const dx = q[0] - piv[0], dy = q[1] - piv[1], c = Math.cos(R), s = Math.sin(R); return [piv[0] + dx * c - dy * s, piv[1] + dx * s + dy * c]; };
  const hip = rot([X0, ch.hipY + y]), lift = snap(f - W.sounds, 10);
  const r0 = v => Math.round(v), kneeN = [hip[0] + legL * .45, gy - legL * .6], ankN = [Math.min(320, hip[0] + legL * .9), gy - 6], kneeF = [hip[0] + legL * .5, gy - 14], ankF = [Math.min(335, hip[0] + legL * .95), gy - 6];
  return { view: '34', dir: 1, x: X0, y, rot: R * 180 / PI, pivot: piv, head: 22 + 4 * lift - .6 * br,
    feet: [{ pts: [hip, kneeN, ankN].map(q => q.map(r0)), curve: true }, { pts: [[hip[0] + 8, hip[1] + 4], kneeF, ankF].map(q => q.map(r0)), curve: true }],
    hands: [{ f: .32, d: .7, bow: .4 }, { f: .3, d: .64, bow: .45, over: true }], farArmFront: false, held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('so_s3', soS3, 'S3 surgeon mask down: points on each "60", peels the ? note, sticks it on tray 3'),
  sty('sg_s3', sgS3, 'S3 surgeon masked: envelope to the pocket + slide higher; hands on the knee; pump-handle wiggle; jug high, pour'),
  sty('nr_s3', nrS3, 'S3 nurse: folded, jolt on the SPLOOSH, deadpan glasses wipe'),
  sty('pt_s3', ptS3, 'S3 patient standing: lean, sign, tick, peek'),
  sty('ex_s3a', t => 0, 'pre-op extra A: clipboard, page flip'), sty('ex_s3b', t => 0, 'pre-op extra B: clipboard, page flip'),
  sty('ptr_s3', ptrS3, 'S3 patient reclined: drowsy, smile lift on "sounds"')];
STY.find(s => s.key === 'ex_s3a').pose = (t, ch) => exS3(t, ch, 950); STY.find(s => s.key === 'ex_s3b').pose = (t, ch) => exS3(t, ch, 978);
export default { title: 'fake-surgery S3 episode moves', dur: 43, styles: STY };
export const front = { title: 'fake-surgery S3 episode moves (3/4)', dur: 43, styles: STY };

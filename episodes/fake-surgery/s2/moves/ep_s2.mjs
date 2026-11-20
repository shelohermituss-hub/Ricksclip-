// EPISODE MOVES, fake-surgery S2 (film 12.50-25.90 s = frames 375-777, plan rows 11-20, script lines 4-6), S2 stretch builder 2026-11-16.
// STUDIO MOTION form (./studio_ep.mjs: Rick's snap 5/16/31/48/66 %, settle, DEAD STILL in holds), drawn new on every frame (tween.ones).
// Pattern: ../../s1/moves/ep_s1.mjs + ../../moves/ep_surgery.mjs. Every move starts at FILM frame 0 (act at 0), so f = t * 30 = the film frame.
// Rig units: y down, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX. Written facing +x (dir 1); film.json dir -1 mirrors.
// Held props (cup, card) ride the NEAR fist = hands[1] (held3d "hand": "L", PROPS_README hand key).
import { snap, tr, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000, PI = Math.PI;
// word starts (voice/words.json * 30)
export const W = { back: 385, y1990: 400, houston: 427, scrape: 457, rinse: 476, sore: 483, knees: 492, all: 499, day: 509, long: 515, then: 538,
  another: 544, doctor: 556, asks: 566, nasty: 586, question: 595, what: 622, heads: 650, so: 666, takes: 674, n180: 681, knees2: 716, splits: 733, three: 757, groups: 764 };

// ---- SURGEON (masked) m:sg_s2, corridor, 3/4. Calm until "all" (499): the near fist rises (anticipate 3 f, snap 6 f), two cheery waves (505, 511),
// on "long" (515) a big beckon sweep toward the OR door, settle (12 f), dead still.
function sgS2(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const up = snap(f - W.all - 3, 6) - .3 * snap(f - W.long, 8) , an = snap(f - W.all, 3) - snap(f - W.all - 3, 4);
  const wave = (snap(f - 505, 3) - snap(f - 508, 3)) + (snap(f - 511, 3) - snap(f - 514, 3));
  const sweep = snap(f - W.long, 9);
  const near = [Wd * .9 + (.25 + .35 * up + .15 * wave + .25 * sweep) * L, S + (.75 + .12 * an - 1.25 * up + .45 * sweep) * L];
  const rot = tr([[0, 2], [W.all, 5, 9], [W.long, -3, 10]], f), head = tr([[0, 3], [W.all, 6, 9], [W.long, 1, 10]], f) ;
  return { view: '34', dir: 1, x: 0, y: 0, rot, feet: [{ x: -30, lift: 0 }, { x: 30, lift: 0 }], farArmFront: true,
    hands: [{ wx: Wd * .55, wy: ch.hipY - 24, bow: .5 }, { wx: near[0], wy: near[1], bow: .5, over: true }], head, held: [] }; }

// ---- SURGEON mask DOWN m:so_s2, office night, 3/4 behind the desk.
// SIP (540-621): the cup at his lips, small sips on "another" (546) and "asks" (566); eyes slide to the note (face).
// POWER r18: "what" (622) the cup up again (snap 8 f), ANTICIPATION HOLD dead still 632-649 (the coffee rises), "heads" (650) IMPACT: a jolt back (3 f),
// head ring, settle (12 f), dead still. r19 "so" (666): cup put down, both fists to the stack sides at the desk (snap 6 f); "takes" (674) a dip (4 f),
// then the LIFT (snap 10 f) and the stack's sway in the fists (ring); "180" (681) holds high. r20 "splits" (733): the far fist hugs the stack at his chest,
// the near fist DEALS like a card dealer: L, M, R, L, M, R every 5 f (out 2 f, flick, back 3 f); "three" (757) a sticky card shake; "groups" (764) the
// flick into tray 3, settle, dead still.
export const DEAL = [734, 740, 746, 752, 758, 764];
function soS2(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX, hip = ch.hipY;
  const mouth = [Wd * .35 + .22 * L, S - .32 * L];
  const sip = f0 => snap(f - f0, 4) - snap(f - f0 - 5, 8);
  const raise = snap(f - W.what, 8) - snap(f - (W.what - 14), 6) * 0;
  const jolt = snap(f - W.heads, 3) - .85 * snap(f - W.heads - 3, 12);
  const down = snap(f - (W.so + 3), 6), dipT = snap(f - W.takes, 4) - snap(f - W.takes - 4, 4), lift = snap(f - (W.takes + 6), 10);
  const sway = ring(f, W.takes + 16, 7, 16);
  const s0 = sip(546) + sip(566), pre = [mouth[0], mouth[1] - 6 * s0 + 10 * snap(f - 600, 8) - 10 * raise], far0 = [Wd * .45, hip - 30];
  const sideL = [-.1 * L, hip - 70 - lift * .55 * L + 8 * dipT + sway], sideR = [Wd * .9 + .35 * L, hip - 70 - lift * .55 * L + 8 * dipT - sway];
  const tgt = [[-.15 * L, hip - 10], [Wd * .5 + .2 * L, hip - 4], [Wd + .55 * L, hip - 10]], home = [Wd * .55 + .2 * L, S + .55 * L], farD = [Wd * .15, S + .45 * L];
  const toDeal = snap(f - 726, 8);
  let dx = 0, dy = 0; for (let i = 0; i < DEAL.length; i++) { const f0 = DEAL[i], g = tgt[i % 3], o = snap(f - f0, 2) - snap(f - f0 - 2, 4); dx += (g[0] - home[0]) * o; dy += (g[1] - home[1]) * o; }
  const shake = f >= W.three && f < W.three + 8 ? 3 * Math.sin((f - W.three) * 1.6) * (1 - (f - W.three) / 8) * (1 - (f - W.three) / 8) : 0;
  const mid = [pre[0] + (sideR[0] - pre[0]) * down, pre[1] + (sideR[1] - pre[1]) * down], midF = [far0[0] + (sideL[0] - far0[0]) * down, far0[1] + (sideL[1] - far0[1]) * down];
  const near = [mid[0] + (home[0] + dx + shake - mid[0]) * toDeal, mid[1] + (home[1] + dy - mid[1]) * toDeal], far = [midF[0] + (farD[0] - midF[0]) * toDeal, midF[1] + (farD[1] - midF[1]) * toDeal];
  const rot = tr([[0, 3], [W.what, 1, 8], [W.heads, -6, 3], [W.heads + 3, -2, 12], [W.so + 3, 6, 8], [W.takes + 6, -3, 10], [W.splits - 4, 7, 8], [W.groups + 6, 3, 12]], f);
  const head = tr([[0, 4], [546, 0, 5], [552, 4, 8], [W.asks, -4, 8], [W.what, 0, 8], [W.heads, -8, 3], [W.heads + 3, -3, 12], [W.so + 3, 6, 8], [W.takes + 6, -10, 10], [W.splits, 6, 8], [W.groups + 6, 2, 12]], f)
    + ring(f, W.heads + 2, 3, 10) + ring(f, W.takes + 16, 2, 10);
  return { view: '34', dir: 1, x: 0, y: dip(f, W.takes, 6, 4), rot, feet: [{ x: -34, lift: 0 }, { x: 30, lift: 0 }], farArmFront: true,
    hands: [{ wx: far[0], wy: far[1], bow: .45 }, { wx: near[0], wy: near[1], bow: .5, over: true }], head: head + 0 * jolt, held: [] }; }

// ---- GURNEY PATIENTS m:gw_s2 (reclined on the gurney deck like ep_surgery ptRecline, 35 deg up): the near fist ON the bent knee, a slow rock of pain;
// on "sore" (483) a wince pulse (head drops 3 f, settle 10 f) and on "knees" (492) the fist rubs the knee (two small snaps).
const MGP = 1010;
function gwS2(t, ch) { const f = F(t), br = Math.sin(2 * PI * t / 3.1), R = (-55 + 1.2 * br) * PI / 180;
  const X0 = 230, B = (ch.handX ?? 120) - 14, y = (MGP - 10) - ch.bodyBot, gy = MGP - 10, piv = [X0 - B, gy], legL = ch.legL;
  const rot = q => { const dx = q[0] - piv[0], dy = q[1] - piv[1], c = Math.cos(R), s = Math.sin(R); return [piv[0] + dx * c - dy * s, piv[1] + dx * s + dy * c]; };
  const hip = rot([X0, ch.hipY + y]), pulse = snap(f - W.sore, 3) - snap(f - W.sore - 3, 10), rub = (snap(f - W.knees, 3) - snap(f - W.knees - 3, 4)) + (snap(f - W.knees - 8, 3) - snap(f - W.knees - 11, 6));
  const r0 = v => Math.round(v), kneeN = [hip[0] + legL * .45, gy - legL * .6], ankN = [Math.min(320, hip[0] + legL * .9), gy - 6], kneeF = [hip[0] + legL * .5, gy - 14], ankF = [Math.min(335, hip[0] + legL * .95), gy - 6];
  return { view: '34', dir: 1, x: X0, y, rot: R * 180 / PI, pivot: piv, head: 22 - 6 * pulse - .8 * br,
    feet: [{ pts: [hip, kneeN, ankN].map(q => q.map(r0)), curve: true }, { pts: [[hip[0] + 8, hip[1] + 4], kneeF, ankF].map(q => q.map(r0)), curve: true }],
    hands: [{ f: .32, d: .7, bow: .4 }, { wx: kneeN[0] - 6 + 8 * rub, wy: kneeN[1] - 14, bow: .45, over: true }], farArmFront: false, held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('sg_s2', sgS2, 'S2 surgeon (masked) corridor: calm, waves on "all", beckons the next gurney in on "long"'),
  sty('so_s2', soS2, 'S2 surgeon mask down office: sips, freezes cup at lips (POWER r18), lifts the 180 stack, deals into three trays'),
  sty('gw_s2', gwS2, 'S2 gurney patient reclined: fist on the knee, slow rock, wince pulse on "sore", rub on "knees"')];
export default { title: 'fake-surgery S2 episode moves', dur: 26, styles: STY };
export const front = { title: 'fake-surgery S2 episode moves (3/4)', dur: 26, styles: STY };

// EPISODE MOVES, fake-surgery S5 (film 56.10-73.62 s = frames 1683-2209, plan rows 40-50), S5 stretch builder 2026-11-16.
// STUDIO MOTION form (./studio_ep.mjs: Rick's snap, settle, DEAD STILL in holds), drawn new on every frame (tween.ones). Every move starts at FILM frame 0
// (act at 0), so f = t * 30 = the film frame. Rig units: y down, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX, ch.hipY, ch.legL. Written facing +x.
import { snap, tr, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000, PI = Math.PI, GY = 1000;
export const W = { being: 1695, sure: 1701, fixed: 1717, knee: 1745, less: 1756, kid: 1783, waiting: 1796, nurse: 1836, plasters: 1843, knee2: 1877, stops: 1896, hurting: 1906,
  y2004: 1934, medicare: 1970, stopped: 1977, paying: 1991, arthritis: 2024, knee3: 2038, pain: 2047, nurse2: 2085, right: 2097, forgot: 2125, operation: 2140, patients: 2170, never: 2181, missed: 2194 };
const P2 = (k, f) => tr(k, f);   // arrays snap too
const hand = (p, bow = .45, over = false) => ({ wx: p[0], wy: p[1], bow, over });

// ---- ROW 40 SURGEON m:sg_slap3 (3/4): replay of the third plaster. The plaster fist hangs HIGH (hold 1699-1707, eyes narrow), SNAPS down on the knee
// (1708-1711, 3 f), pats once (ring), stays on it, then lifts a hand's width and goes DEAD STILL; the other fist steadies on the drape.
function sgSlap3(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const hi = [Wd * .9 + .42 * L, S - .3 * L], up = [Wd * .9 + .4 * L, S - .45 * L], on = [Wd * .9 + .62 * L, S + .72 * L], rest = [Wd * .9 + .58 * L, S + .55 * L];
  const h = P2([[0, hi], [1694, up, 10], [1708, on, 3], [1728, rest, 12]], f), pat = ring(f, 1711, 6, 10);
  const rot = tr([[0, 6], [1694, 4, 10], [1708, 12, 3], [1728, 9, 12]], f), head = tr([[0, 4], [1694, 2, 10], [1708, 8, 4], [1728, 5, 12]], f);
  return { view: '34', dir: 1, x: 0, y: dip(f, 1709, 6, 4), rot, head, feet: [{ x: -34, lift: 0 }, { x: 30, lift: 0 }], farArmFront: true,
    hands: [hand([Wd * .8 + .45 * L, S + .8 * L]), hand([h[0], h[1] + pat], .5, true)], held: [] }; }

// ---- ROWS 40-41 PATIENT reclined (cast phase A recipe, ep_surgery.mjs ptRecline): drowsy rest, slow breath; m:pt_smile5 lifts the head a touch on "knee" (1745).
const MGP = 1010;
function ptRecline(t, ch, mode, view = '34') { const f = F(t), br = Math.sin(2 * PI * t / 4.2), R = (-55 + .8 * br) * PI / 180;
  const X0 = 230, B = (ch.handX ?? 120) - 14, y = (MGP - 10) - ch.bodyBot, gy = MGP - 10, piv = [X0 - B, gy], legL = ch.legL;
  const rot = q => { const dx = q[0] - piv[0], dy = q[1] - piv[1], c = Math.cos(R), s = Math.sin(R); return [piv[0] + dx * c - dy * s, piv[1] + dx * s + dy * c]; };
  const hip = rot([X0, ch.hipY + y]), lift = mode === 'smile' ? snap(f - W.knee, 10) : 0;
  const r0 = v => Math.round(v), kneeN = [hip[0] + legL * .45, gy - legL * .6], ankN = [Math.min(320, hip[0] + legL * .9), gy - 6], kneeF = [hip[0] + legL * .5, gy - 14], ankF = [Math.min(335, hip[0] + legL * .95), gy - 6];
  return { view, dir: 1, x: X0, y, rot: R * 180 / PI, pivot: piv, head: 22 + 4 * lift - .6 * br,
    feet: [{ pts: [hip, kneeN, ankN].map(q => q.map(r0)), curve: true }, { pts: [[hip[0] + 8, hip[1] + 4], kneeF, ankF].map(q => q.map(r0)), curve: true }],
    hands: [{ f: .32, d: .7, bow: .4 }, { f: .3, d: .64, bow: .45, over: true }], farArmFront: false, held: [] }; }

// ---- ROWS 42-44 BOY m:boy_sit (FRONT): sat on the orange shell, fists at his eyes, head rocking with the wail (every 9 f, snap + settle); on "plasters" a flinch;
// on "STOPS" (1896) EVERYTHING freezes mid-wail (dead still: the frozen tear, the sob bubble); 1904 hidden (the running card takes over).
const wailRock = f => { if (f >= W.stops) return 0; const k = Math.floor(f / 9), u = f - k * 9; return (k % 2 ? 1 : -1) * (u < 4 ? -1 + 2 * snap(u, 4) : 1); };
// v2 r2 ROW 43 (SIDE, facing right): sat on the chair; from 1816 the NEAR leg (feet[0], drawn over the body) bends up, KNEE UP and forward of the shirt (BOY_KNEE),
// the foot on the seat edge; the far leg hangs to the floor. Far fist rubs his eye, near fist grips the seat behind (nothing crosses the knee). BOY_KNEE = the knee in move-rig px (sets/waiting.js stickers card px = +400, +430).
export const BOY_KNEE = [130, 650];   // r2b: hips ON the chair seat (.45 m): drop -.34 legL
function boySit(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, legL = ch.legL, drop = -.34 * legL;
  const hipY = ch.hipY + drop, sh = f < W.stops ? wailRock(f) : 0, fl = snap(f - (W.plasters + 1), 3) - snap(f - (W.plasters + 4), 8), up = snap(f - 1816, 10), r0 = v => Math.round(v);
  const lp = (a, b) => [a[0] + (b[0] - a[0]) * up, a[1] + (b[1] - a[1]) * up];
  const near = { pts: [[-4, hipY - 6], lp([62, hipY + 6], BOY_KNEE), lp([70, hipY + 88], [BOY_KNEE[0] + 10, hipY + 22]), lp([110, hipY + 88], [BOY_KNEE[0] + 46, hipY + 22])].map(q => q.map(r0)), curve: true };
  const far = { pts: [[6, hipY - 4], [66, hipY + 8], [74, hipY + 88], [114, hipY + 88]].map(q => q.map(r0)), curve: true };   // feet dangle (a kid on an adult chair)
  return { view: 'side', dir: 1, x: 0, y: drop + fl * 4, rot: 2 * sh, head: 3 * sh - 6 * fl, shrug: 6 * fl, feet: [near, far],
    hands: [hand([.3 * L + 3 * sh, S + drop - .7 * L + 5 * fl]), hand([-.18 * L, hipY - 4])], held: [] }; }
// ---- ROW 44 m:boy_run (SIDE): jumps off the chair and RUNS out right (a stride every 5 f, knees high, fists pumping), cheering.
function boyRun(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, T = 5, g = Math.max(0, f - 1904), k = Math.floor(g / T), u = (g - k * T) / T, on = f > 1904, s = k % 2;
  const feet = [0, 1].map(i => ({ x: (i ? 22 : -22) + (on && i === s ? 18 * Math.sin(PI * u) : 0), lift: on ? (i === s ? 34 : 7) * Math.sin(PI * u) : 0 }));   // the stance foot hops >3 px: a sprint has air phases, no planted-foot glide
  const pump = on ? Math.cos(PI * (k + u)) : 0;
  const P = { view: 'side', dir: 1, x: 0, y: on ? -8 * Math.sin(PI * u) ** 2 : 0, rot: on ? 12 : 4, head: on ? -6 : 0, feet,
    hands: [hand([.15 * L - 18 * pump, S + .55 * L]), hand([.25 * L + 18 * pump, S + .45 * L], .45, true)], held: [] };
  P._walk = { on, travel: 0, planted: feet.map(q => !on && !q.lift), side: false }; return P; }

// ---- ROW 43 NURSE m:nr_kneel (3/4 facing the boy): down on one knee beside his chair; the plaster fist rises HIGH (1832-1840 hold), SLAPS onto his knee on
// "plasters" (1841-1844), pats (ring), stays; the far fist holds his shin. Then dead still, kind.
// v2 r2: SIDE view, written facing +x (the act turns her to face left, toward the boy). Down on one knee (near leg, knee on the floor), the far foot forward;
// the near fist rises HIGH (1826-1840), SLAPS onto his knee on "plasters" (1841-1844, ch.tgt = film.json hand_at = his knee point), pats (ring), lifts a hand's width, still.
function nrKneel(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX, legL = ch.legL, drop = .7 * legL, hipY = ch.hipY + drop;
  const tg = ch.tgt ? [ch.tgt[0], ch.tgt[1]] : [.62 * L + 60, S + drop + .9 * L];
  const hi = [.35 * L, S + drop - .45 * L], on = tg, rest = [tg[0] + 50, tg[1] - 190]   /* v2 r3: lifts clear of the plaster so it reads */;
  const h = P2([[0, [.25 * L, S + drop + .45 * L]], [1826, hi, 8], [1841, on, 3], [1847, rest, 10]], f), pat = ring(f, 1844, 7, 10);
  const r0 = v => Math.round(v), near = { pts: [[-6, hipY], [-10, GY - 6], [-64, GY - 4]].map(q => q.map(r0)), curve: true }, far = { pts: [[8, hipY], [8 + .42 * legL, hipY + 4], [12 + .42 * legL, GY - 6], [52 + .42 * legL, GY - 6]].map(q => q.map(r0)), curve: true };
  return { view: 'side', dir: 1, x: 0, y: drop + dip(f, 1842, 5, 4), rot: tr([[0, 4], [1826, 6, 8], [1841, 12, 3], [1847, 7, 10]], f), head: tr([[0, 0], [1826, -4, 8], [1841, 2, 4], [1847, -2, 10]], f),
    feet: [near, far], farArmFront: false, hands: [hand([.3 * L, S + drop + .5 * L]), hand([h[0], h[1] + pat], .5, true)], held: [] }; }
// ---- ROW 42 m:nr_watch (3/4): at the nurse station, a file on her arm; on "kid" her head turns to the wail (snap), dead still.
function nrWatch(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  return { view: '34', dir: 1, x: 0, y: 0, rot: tr([[0, -2], [W.kid + 2, 3, 10]], f), head: tr([[0, -4], [W.kid + 2, 7, 8]], f), feet: [{ x: -24, lift: 0 }, { x: 24, lift: 0 }], farArmFront: true,
    hands: [hand([Wd * .4, S + .5 * L]), hand([Wd * .5 + .25 * L, S + .3 * L], .45, true)], held: [] }; }

// ---- ROWS 45-47 SURGEON m:sg_stamp (FRONT, mask down, behind the desk): both fists on the big stamp's knob at chest; on "Medicare" it goes UP over his head
// (1962-1971) and HANGS (anticipation hold 1971-1975); SLAM on "stopped" (1975-1978, 3 f), body dip + shake; leans on it; 2012 lifts it off the letter.
function sgStamp(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const chest = [Wd * .1, S + .2 * L], over = [Wd * .1, S - .95 * L], down = [Wd * .1, S + .72 * L], lift = [Wd * .1, S + .25 * L];
  const h = P2([[0, chest], [1960, over, 10], [1975, down, 3], [2012, lift, 12]], f);
  const rot = tr([[0, 0], [1960, -4, 10], [1975, 8, 3], [2012, 2, 12]], f), head = tr([[0, 0], [1960, -8, 10], [1975, 10, 3], [2012, 0, 12]], f);
  return { view: 'front', dir: 1, x: 0, y: dip(f, 1977, 10, 4), rot, head, shrug: tr([[0, 0], [1960, 10, 10], [1975, -4, 3], [2012, 0, 12]], f), feet: [{ x: -26, lift: 0 }, { x: 26, lift: 0 }],
    hands: [hand([h[0] - 30, h[1] + 6], .45, true), hand([h[0] + 30, h[1]], .45, true)], held: [] }; }

// ---- ROW 48 NURSE m:nr_tray (3/4, facing the lens): the clean tray flat on both fists at the waist; on "right" (2095) she LIFTS it to shoulder height
// (snap 6 f, ring), one eyebrow up (face), dead still.
function nrTray(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX, u = tr([[0, 0], [2093, 1, 6]], f), rg = ring(f, 2099, 5, 10);
  const y0 = S + .45 * L, y1 = S - .15 * L, yy = y0 + (y1 - y0) * u + rg;
  return { view: '34', dir: 1, x: 0, y: 0, rot: tr([[0, -2], [2093, -5, 6]], f), head: tr([[0, 2], [2093, -4, 6]], f), feet: [{ x: -24, lift: 0 }, { x: 24, lift: 0 }], farArmFront: true,
    hands: [hand([-Wd * .25, yy + 4]), hand([Wd * .7 + .62 * L, yy], .45, true)], held: [] }; }

// ---- ROW 49 SURGEON masked m:sg_mask (3/4): fists down; 2114 the near fist rises to the mask edge (snap 6 f) and HOLDS there; hidden at 2125 (swap).
function sgMask(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX, hy = ch.hy ?? (ch.bodyTop - 78 * (ch.K ?? 1.5)), K = ch.K ?? 1.5;
  const h = P2([[0, [Wd * .6 + .1 * L, S + .7 * L]], [2112, [Wd * .4, hy + 50 * K], 8]], f);
  return { view: '34', dir: 1, x: 0, y: 0, rot: 2, head: tr([[0, 2], [2112, -3, 8]], f), feet: [{ x: -28, lift: 0 }, { x: 28, lift: 0 }], farArmFront: true,
    hands: [hand([-Wd * .6, S + .75 * L]), hand(h, .45, true)], held: [] }; }
// ---- ROW 49 m:sg_shrug (3/4, mask down): the fist pulls the mask down to his chin and drops (2125-2131), SHRUG on "operation" (2134-2140: shoulders up, both
// fists out palms-up, sheepish), holds; 2146 turns and walks to the OR door (act linear move 2146-2152), 2152 the near fist PUSHES the door plate (snap 4 f).
function sgShrug(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX, hy = ch.hy ?? (ch.bodyTop - 78 * (ch.K ?? 1.5)), K = ch.K ?? 1.5;
  const chin = [Wd * .4, hy + 70 * K], low = [Wd * .6 + .1 * L, S + .7 * L], outN = [Wd * .9 + .45 * L, S + .25 * L], outF = [-Wd * .9 - .35 * L, S + .3 * L], push = [Wd * .9 + .78 * L, S + .1 * L];
  const hn = P2([[0, chin], [2127, low, 6], [2133, outN, 6], [2146, low, 8], [2154, push, 8]], f), hf = P2([[0, [-Wd * .6, S + .75 * L]], [2133, outF, 6], [2146, [-Wd * .6, S + .75 * L], 8]], f);
  const T = 4, g = f - 2141, on = g > 0 && g < 14, k = Math.floor(Math.max(0, g) / T), u = (Math.max(0, g) - k * T) / T, s = k % 2;
  const feet = [0, 1].map(i => ({ x: (i ? 28 : -28), lift: on && i === s ? 16 * Math.sin(PI * u) : 0 }));
  const P = { view: '34', dir: 1, x: 0, y: on ? -4 * Math.sin(PI * u) ** 2 : 0, rot: tr([[0, 2], [2133, -3, 6], [2146, 6, 8], [2154, 10, 8]], f), head: tr([[0, 0], [2133, 8, 6], [2146, 0, 8]], f),
    shrug: tr([[0, 0], [2133, 16, 6], [2146, 0, 8]], f), feet, farArmFront: true, hands: [hand(hf), hand(hn, .45, true)], held: [] };
  P._walk = { on, travel: 0, planted: feet.map(q => !q.lift), side: false }; return P; }

// ---- ROW 50 SURGEON m:sg_fold (FRONT, mask down): arms FOLDED, calm, DEAD STILL (the hold); on "missed" (2194) the head tips a touch and the grin lands (face).
function sgFold(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  return { view: 'front', dir: 1, x: 0, y: 0, rot: 0, head: tr([[0, 0], [2192, 5, 8]], f), feet: [{ x: -30, lift: 0 }, { x: 30, lift: 0 }],
    hands: [hand([Wd * .55, S + .42 * L], .7, true), hand([-Wd * .5, S + .36 * L], .7, true)], held: [] }; }
// ---- ROW 50 VETERAN m:vet_bound (SIDE, shorts): two treads at a time, the lead foot UP high (from 2160) and it SLAMS down on the step on "missed" (2192-2195),
// body dip + settle; fists up holding the grandkid's ankles at his shoulders.
function vetBound(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, up = tr([[0, 0], [2158, 1, 8], [2191, -.1, 3], [2195, 0, 8]], f);
  return { view: 'side', dir: 1, x: 0, y: -12 * up + dip(f, 2194, 9, 4), rot: 8 + 4 * up, head: -4 - 2 * up, feet: [{ x: -38, lift: 0 }, { x: 40 + 10 * up, lift: 70 * Math.max(0, up) }],
    hands: [hand([.12 * L, S - .35 * L]), hand([.3 * L, S - .3 * L], .45, true)], held: [] }; }
// ---- ROW 50 GRANDKID m:kid_ride (FRONT): on his shoulders, both fists UP like on a ride, legs dangling; bounces with him (dip on "missed").
function kidRide(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX, up = tr([[0, 0], [2158, 1, 8], [2191, 0, 3]], f), legL = ch.legL, drop = .4 * legL, hipY = ch.hipY + drop, hw = ch.hipW ?? 13;
  const leg = s => ({ pts: [[s * hw, hipY], [s * (hw + 26), hipY + .3 * legL], [s * (hw + 20), hipY + .75 * legL]].map(q => q.map(Math.round)), curve: true });
  return { view: 'front', dir: 1, x: 0, y: drop - 12 * up + dip(f, 2195, 12, 5), rot: 0, head: tr([[0, -3], [2158, -8, 8], [2194, 4, 6]], f), feet: [leg(-1), leg(1)],
    hands: [hand([-Wd * .7 - .3 * L, S - .8 * L - 10 * up]), hand([Wd * .7 + .3 * L, S - .8 * L - 10 * up])], held: [] }; }
// ---- ROW 50 CLIMBERS m:climb (3/4): every former patient lifts the SAME foot at the same time (from 2160, the row 35 rhyme) and plants it on "missed".
function climb(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX, up = tr([[0, 0], [2158, 1, 8], [2191, 0, 4]], f);
  return { view: '34', dir: 1, x: 0, y: -8 * up + dip(f, 2194, 6, 4), rot: 6 + 4 * up, head: -2, feet: [{ x: -26, lift: 0 }, { x: 30 + 8 * up, lift: 44 * up }], farArmFront: false,
    hands: [hand([-Wd * .5 + 16 * up, S + .62 * L]), hand([Wd * .5 + .2 * L - 20 * up, S + .55 * L], .45, true)], held: [] }; }
// ---- ROW 50 NURSE m:nr_door (3/4): at the stair door, the clean tray on both fists at her waist, head tilted; on "missed" a small nod (smile face).
function nrDoor(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  return { view: '34', dir: 1, x: 0, y: 0, rot: -3, head: tr([[0, -5], [2194, 3, 8]], f), feet: [{ x: -24, lift: 0 }, { x: 24, lift: 0 }], farArmFront: true,
    hands: [hand([-Wd * .25, S + .5 * L]), hand([Wd * .7 + .62 * L, S + .46 * L], .45, true)], held: [] }; }

const sty = (key, pose, blurb) => ({ key, name: key, blurb, pose });
const MOVES = [sty('sg_slap3', sgSlap3, 'row 40 replay: the third plaster hangs high, slaps the knee, pats'), sty('pt_recline5', (t, ch) => ptRecline(t, ch, 'rest'), 'reclined, drowsy rest'),
  sty('pt_smile5', (t, ch) => ptRecline(t, ch, 'smile'), 'reclined, head lifts on "knee"'), sty('boy_sit', boySit, 'sat on the chair, wailing, freezes on "stops"'), sty('boy_run', boyRun, 'runs off cheering'),
  sty('nr_kneel', nrKneel, 'kneels, slaps one plaster on the knee'), sty('nr_watch', nrWatch, 'at the station, turns to the wail'), sty('sg_stamp', sgStamp, 'the paint-tin stamp up, hangs, SLAMS on "stopped"'),
  sty('nr_tray', nrTray, 'lifts the clean tray on "right"'), sty('sg_mask', sgMask, 'fist to the mask'), sty('sg_shrug', sgShrug, 'mask down, shrug, walks to the door, pushes it'),
  sty('sg_fold', sgFold, 'arms folded, calm, grin on "missed"'), sty('vet_bound', vetBound, 'bounds two treads, foot slams on "missed"'), sty('kid_ride', kidRide, 'on his shoulders, arms up'),
  sty('climb', climb, 'everyone lifts the same foot, plants on "missed"'), sty('nr_door', nrDoor, 'at the stair door with the tray')];
export default { title: 'SURGERY S5 moves', dur: 74, styles: MOVES };
export const front = { title: 'SURGERY S5 moves (3/4)', dur: 74, styles: MOVES };
// motion gate plan (moves/tools/check_motion_ep.mjs reads it): strikes + dead-still holds in FILM frames
const S_ = (name, f0, ch, to) => ({ name, f0, ch, to });
export const PLAN = {
  sg_slap3: { who: 'surgeon', view: '34', strikes: [S_('slap 3 "fixed" replay', 1708, 'h1y', 'max')], holds: [[1745, 2209, 'dead still after the pat']], acting: [1683, 1765] },
  pt_recline5: { who: 'patient', view: '34', strikes: [], holds: [], acting: [1683, 1765] },
  pt_smile5: { who: 'patient', view: '34', strikes: [], holds: [], acting: [1683, 1765] },
  boy_sit: { who: 'boy', view: 'side', strikes: [], holds: [[W.stops + 1, 2209, 'FROZEN mid-wail']], acting: [1766, 1895] },
  boy_run: { who: 'boy', view: 'side', strikes: [], holds: [[0, 1904, 'before the run (hidden)']], acting: [1905, 1930] },
  nr_kneel: { who: 'nurse', view: 'side', strikes: [S_('slap "plasters"', 1841, 'h1y', 'max')], holds: [[1880, 2209, 'kind, still']], acting: [1826, 1880] },
  nr_watch: { who: 'nurse', view: '34', strikes: [], holds: [[W.kid + 24, 2209, 'still']], acting: [1766, 1830] },
  sg_stamp: { who: 'surgeonOff', view: 'front', strikes: [S_('SLAM "stopped"', 1975, 'h1y', 'max')], holds: [[2030, 2209, 'still']], acting: [1926, 2062] },
  nr_tray: { who: 'nurse', view: '34', strikes: [S_('tray up "right"', 2093, 'h1y', 'min')], holds: [[2112, 2209, 'still']], acting: [2063, 2155] },
  sg_mask: { who: 'surgeon', view: '34', strikes: [], holds: [[2124, 2209, 'hidden']], acting: [2063, 2124] },
  sg_shrug: { who: 'surgeonOff', view: '34', strikes: [S_('shrug "operation"', 2133, 'h1y', 'min')], holds: [[2170, 2209, 'at the door']], acting: [2125, 2160] },
  sg_fold: { who: 'surgeonOff', view: 'front', strikes: [], holds: [[0, 2191, 'CALM hold'], [2206, 2209, 'last frame']], acting: [2156, 2209] },
  vet_bound: { who: 'patientShorts', view: 'side', strikes: [S_('foot slams "missed"', 2191, 'y', 'max')], holds: [[2208, 2209, 'last']], acting: [2156, 2209] },
  kid_ride: { who: 'grandkid', view: 'front', strikes: [], holds: [], acting: [2156, 2209] },
  climb: { who: 'climber1', view: '34', strikes: [], holds: [[2208, 2209, 'last']], acting: [2156, 2209] },
  nr_door: { who: 'nurse', view: '34', strikes: [], holds: [[2203, 2209, 'still']], acting: [2156, 2209] },
};

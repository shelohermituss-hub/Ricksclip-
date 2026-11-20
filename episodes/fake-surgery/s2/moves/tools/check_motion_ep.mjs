// MOTION GATE for the moonrakers episode moves (animator 2026-11-14). The master templates/motion_styles/check_motion.mjs named in STUDIO_MOTION.md
// is NOT on this PC, so this is the episode's own check with the same measures. It plays every move frame by frame (on ones, 30 fps) and reads the
// numbers the kit draws from (body x, y, lean, head, both hand targets, feet, held keg), so it measures exactly what the card shows.
//   node moves/tools/check_motion_ep.mjs            -> prints the table and writes moves/out/check_motion.json
// Measures (STUDIO_MOTION 3-5, CB_RULES 5):
//   twos       a held frame between two moving frames (a drawing shown twice) .......................... must be 0
//   linear     a run of 4+ frames where a moving channel keeps the same speed (> 0.3 px/f, change < 4 %) .... must be 0
//   no_settle  a stop where the last 3 frames do not slow down to under 25 % of the move's top speed ....... must be 0
//   creep      a frame inside a hold that moves 0.001-0.5 px (not dead still) ........................... must be 0
//   snap       share of each STRIKE done after 1-5 frames, against Rick's 5 / 16 / 31 / 48 / 66 %
//   contact    the planted knee off its spot, a planted foot sliding, an arm asked to reach past its length, the keg off the hand
//   dps        drawings per second while acting (frames that differ from the one before)
import fs from 'fs'; import path from 'path'; import os from 'os'; import { fileURLToPath, pathToFileURL } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url)), MV = path.resolve(HERE, '..'), EP = path.resolve(MV, '..'), ROOT = path.resolve(EP, '../../..'), PKG = path.join(ROOT, 'templates/vector2d_characters/code');
const imp = f => import(pathToFileURL(f).href);
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 's2surgck_')); fs.mkdirSync(path.join(TMP, 'sheets'));
for (const f of fs.readdirSync(PKG)) if (f.endsWith('.mjs')) fs.copyFileSync(path.join(PKG, f), path.join(TMP, f));
fs.copyFileSync(path.join(EP, 'cast/sheets/surgery.mjs'), path.join(TMP, 'sheets', 'surgery.mjs'));
for (const f of fs.readdirSync(MV)) if (f.endsWith('.mjs')) fs.copyFileSync(path.join(MV, f), path.join(TMP, f));
const castkit = await imp(path.join(TMP, 'castkit.mjs')), sheet = await imp(path.join(TMP, 'sheets', 'surgery.mjs')), EPM = await imp(path.join(TMP, 'ep_s2.mjs'));
const chOf = name => { const S = castkit.buildChar({ ...sheet.CAST.find(c => c.name === name), face: 'standard' }, 400), fr = S.arms({ cx: 400, view: 'front', dir: 1, turn: 0 }).front, a = fr[fr.length - 1], m = /M\s*([-\d.]+)[ ,]+([-\d.]+)/.exec(a.d), bodyBot = S.bodyBot ?? 640, hipY = bodyBot - 30;
  return { bodyTop: S.bodyTop ?? 333, bodyBot, ground: S.ground ?? 900, K: S.headK ?? 1.5, hipY, legL: Math.hypot(23, ((S.ground ?? 900) - 7) - hipY), sh: [Math.abs(+m[1] - 400), +m[2]], armL: (a.len0 ?? Math.hypot(a.hand[0] - +m[1], a.hand[1] - +m[2])) * 1.24, hipW: S.hipW ?? 13, handX: Math.abs(a.hand[0] - 400), hy: (S.bodyTop ?? 333) - 100 * (S.headK ?? 1.5) * .78 }; };
const D2R = Math.PI / 180, rotP = (p, deg, c) => { const r = deg * D2R, s = Math.sin(r), k = Math.cos(r), dx = p[0] - c[0], dy = p[1] - c[1]; return [c[0] + dx * k - dy * s, c[1] + dx * s + dy * k]; };
const N = 790, Wd = EPM.W;
// S2 (film f375-777): strikes and holds per move (frames = film frames; every move starts at film frame 0)
const PLAN = {
  sg_s2: { who: 'surgeon', view: '34', strikes: [{ name: 'wave up "all"', f0: Wd.all + 3, ch: 'h1y', to: 'min' }], holds: [[540, 789, 'gone to the office']], acting: [480, 537] },
  so_s2: { who: 'surgeonOff', view: '34', strikes: [{ name: 'jolt "HEADS" (power)', f0: Wd.heads, ch: 'rot', to: 'min' }, { name: 'lift "takes"', f0: Wd.takes + 6, ch: 'h1y', to: 'min' }], holds: [[634, 649, 'cup at lips, coffee rising']], acting: [540, 777] },
  gw_s2: { who: 'g1', view: '34', strikes: [], holds: [], acting: [470, 537] },
};
const report = { _about: 'moves/tools/check_motion_ep.mjs, animator 2026-11-14', moves: [] };
for (const st of EPM.default.styles) {
  const plan = PLAN[st.key]; if (!plan) continue; const view = plan.view; const ch = chOf(plan.who), sig = [], meta = [];
  for (let f = 0; f < N; f++) { const P = st.pose(f / 30, ch), h = P.hands.map(q => [q.wx, q.wy]), kg = [0, 0];   // the keg while it is his (on the grass, in the fist); from f78 it is keg_roll.json's
    const tv = P._walk && P._walk.side ? P._walk.travel : 0, tz = 0, ft = P.feet.flatMap(q => [q.x + tv, (q.lift || 0) + tz, q.thigh ?? 0]);   // a walking card: feet in WORLD x and height (the card slides down the slope; planted = still)
    sig.push({ th: P._th ?? 0, x: P.x, y: P.y, rot: P.rot, head: P.head, h0x: h[0][0], h0y: h[0][1], h1x: h[1][0], h1y: h[1][1], kx: kg[0], ky: kg[1], ...Object.fromEntries(ft.map((v, i) => ['ft' + i, v])) }); meta.push(P); }
  if (process.env.PEEK && st.key === process.env.PEEKM) console.log(view, process.env.PEEK, sig.slice(0, 16).map(q => (+q[process.env.PEEK]).toFixed(2)).join(' '));   // PEEK=<channel> prints f0-15
  const keys = Object.keys(sig[0]), d = (a, b) => Math.max(...keys.map(k => Math.abs(sig[a][k] - sig[b][k]))), moving = f => f > 0 && d(f, f - 1) > 1e-6;
  // twos
  let twos = 0; const twoList = []; for (let f = 2; f < N - 1; f++) if (!moving(f) && moving(f - 1) && moving(f + 1)) { twos++; twoList.push(f); }
  // linear runs (per channel)
  let linear = 0; const linList = []; for (const k of keys) { let run = 0; for (let f = 2; f < N; f++) { const v1 = sig[f][k] - sig[f - 1][k], v0 = sig[f - 1][k] - sig[f - 2][k]; const lin = Math.abs(v1) > .3 && Math.abs(v0) > .3 && Math.abs(v1 - v0) < .04 * Math.abs(v1); run = lin ? run + 1 : 0; if (run === 3) { linear++; linList.push(k + '@' + (f - 3)); } } }
  // stops and settles: a moving segment that ends in stillness
  let noSettle = 0, stops = 0; const segs = []; { let a = null; for (let f = 1; f < N; f++) { const m = d(f, f - 1) > .05; if (m && a === null) a = f; if (!m && a !== null) { segs.push([a, f - 1]); a = null; } } if (a !== null) segs.push([a, N - 1]); }
  for (const [a, b] of segs) { if (b >= N - 1) continue; stops++; const sp = []; for (let f = a; f <= b; f++) sp.push(d(f, f - 1)); const peak = Math.max(...sp), last = sp.slice(-3); const ok = last[last.length - 1] < .25 * peak && last.reduce((x, y) => x + y, 0) / last.length < .2 * peak; /* slowed right down (a pure Rick snap tail on a small move scores about 16 %; a hard stop scores 60-100 %); a rebound in the settle is allowed (STUDIO 3) */ if (!ok) { noSettle++; twoList.push('no_settle@' + a + '-' + b + ' (peak ' + peak.toFixed(1) + ', last ' + last.map(v => v.toFixed(2)).join('/') + ')'); } }
  // creeping holds
  let creep = 0; for (const [a, b] of plan.holds) for (let f = a + 1; f <= b; f++) { const v = d(f, f - 1); if (v > 1e-3 && v < .5) { creep++; twoList.push('creep@' + f); } }
  const holdMoves = plan.holds.map(([a, b, n]) => { let mx = 0; for (let f = a + 1; f <= b; f++) mx = Math.max(mx, d(f, f - 1)); return { hold: n, frames: [a, b], max_px_per_frame: +mx.toFixed(4) }; });
  // snap shares
  const snaps = plan.strikes.map(s => { const v = f => sig[Math.min(N - 1, f)][s.ch]; let end = s.f0 + 1; while (end < N - 1 && Math.abs(v(end + 1) - v(end)) > .02) end++; const span = []; for (let f = s.f0; f <= end; f++) span.push(v(f)); const tgt = s.to === 'min' ? Math.min(...span) : s.to === 'max' ? Math.max(...span) : s.to === 'strike' ? (meta[s.f0 + 12] && meta[s.f0 + 12]._thKey) ?? v(end) : s.to ?? v(end), tot = tgt - v(s.f0); return { ...s, end, share: [1, 2, 3, 4, 5].map(k => tot ? Math.round((v(s.f0 + k) - v(s.f0)) / tot * 100) : 0) }; });
  // contact and grounding
  const HL = ch.legL / 2; let kneeOff = 0, footSlide = 0, overReach = 0, legStretch = 0, groundGap = 0;
  for (let f = 0; f < N; f++) { const P = meta[f], piv = [P.x, ch.hipY + P.y], side = P.view === 'side';
    const hs = side ? [[P.x - 12, ch.hipY], [P.x + 10, ch.hipY]] : [[P.x - ch.hipW, ch.hipY], [P.x + ch.hipW, ch.hipY]];
    P.feet.forEach((q, i) => { const h = rotP([hs[i][0], hs[i][1] + P.y], P.rot, piv), Aq = [q.x, 1003 - (q.lift || 0)]; legStretch = Math.max(legStretch, Math.hypot(Aq[0] - h[0], Aq[1] - h[1]) - ch.legL); if (!q.lift) groundGap = Math.max(groundGap, 0); });
    if (f) { const Q = meta[f - 1], wx = (M, q) => q.x + (M._walk && M._walk.side ? M._walk.travel : 0), pl = (M, i) => M._walk ? M._walk.planted[i] : (M.feet[i].lift || 0) === 0;
      footSlide = Math.max(footSlide, ...P.feet.map((q, i) => pl(P, i) && pl(Q, i) && (!P._walk || P._walk.side || !P._walk.on) ? Math.abs(wx(P, q) - wx(Q, Q.feet[i])) : 0)); }
    const sg = Array.isArray(P.shrug) ? P.shrug : [P.shrug || 0, P.shrug || 0], shs = side ? [[P.x + 8, ch.sh[1] - sg[0] + P.y + 35], [P.x + 8, ch.sh[1] - sg[1] + P.y + 35]] : [[P.x - ch.sh[0], ch.sh[1] - sg[0] + P.y], [P.x + ch.sh[0], ch.sh[1] - sg[1] + P.y]];   // per-hand shrug, as the kit draws it
    P.hands.forEach((q, i) => { const S = rotP(shs[i], P.rot, piv); overReach = Math.max(overReach, Math.hypot(q.wx - S[0], q.wy - S[1]) - ch.armL); }); }
  const changed = []; for (let f = plan.acting[0] + 1; f <= plan.acting[1]; f++) changed.push(moving(f) ? 1 : 0);
  const dps = +(changed.reduce((a, b) => a + b, 0) / (changed.length / 30)).toFixed(1);
  report.moves.push({ move: st.key, view, frames: N, twos, two_frames: twoList, linear, linear_runs: linList, stops, no_settle: noSettle, creep, holds: holdMoves, snaps, rick_snap: [5, 16, 31, 48, 66],
    contact: { knee_off_spot_px: +kneeOff.toFixed(2), planted_foot_slide_px: +footSlide.toFixed(3), arm_over_reach_px: +Math.max(0, overReach).toFixed(2), leg_stretch_px: +Math.max(0, legStretch).toFixed(2), off_built_ground_px: +groundGap.toFixed(2) }, drawings_per_second_acting: dps });
}
fs.mkdirSync(path.join(MV, 'out'), { recursive: true }); fs.writeFileSync(path.join(MV, 'out', 'check_motion.json'), JSON.stringify(report, null, 1));
for (const m of report.moves) { console.log(`${m.move} [${m.view}]  twos ${m.twos} ${m.two_frames.join(' ')}  linear ${m.linear}${m.linear ? ' (' + m.linear_runs.slice(0, 6).join(' ') + ')' : ''}  stops ${m.stops} no_settle ${m.no_settle}  creep ${m.creep}  dps ${m.drawings_per_second_acting}  contact ${JSON.stringify(m.contact)}`);
  for (const s of m.snaps) console.log(`   snap ${s.name.padEnd(30)} f${s.f0}-${s.end}  ${s.share.join(' / ')} %   (Rick 5 / 16 / 31 / 48 / 66)`); for (const h of m.holds) console.log(`   hold ${h.hold.padEnd(32)} f${h.frames.join('-')}  max ${h.max_px_per_frame} px/f`); }
fs.rmSync(TMP, { recursive: true, force: true });

// SHARED LOCKED-FEET MOVES for yellow-fire-trucks (animator, 2026-11-21). One file for every stretch: each stretch links it into its moves/ folder
// (ln -s ../../moves/shared_walks.mjs <stretch>/moves/shared_walks.mjs) and plays a use as pose "m:../../shared_walks/<use key>".
// Self-contained on purpose: the render cache copies moves/*.mjs flat, so this file imports nothing.
// THE METHOD (why nothing glides): the card never travels by a film_plan tween. The film carries one act per frame with the card position this file
// computes (shared_walks_acts.json, written by tools/make_acts.mjs from the same USES table), so the card is exactly where the body is on every frame;
// the feet are drawn in card px = (foot world - body world) across the picture, so a planted foot stays on its spot in the world.
// Travel toward or away from the lens cannot be undone on one card: in a run or a burst it happens ONLY on the frames with both feet off the ground
// (flight), in a climb only on the frames with the lower foot off its tread. A WALK must be laid across the picture (its depth part is listed in
// SHARED_WALKS.md per use and kept under 15 % of the path).
// Times are FRAMES at 30 fps from the start of the move (g = 0 on the act that sets the pose). Written facing +x (dir 1); the act's dir -1 mirrors.

const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];   // Rick's measured body snap (STUDIO_MOTION 1)
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
const ease = (f, n) => { if (f <= 0) return 0; if (f >= n) return 1; const u = f / n; return u * u * u * (u * (u * 6 - 15) + 10); };   // smootherstep: foot swings and the body ramp
const ring = (f, f0, amp, n = 10) => f > f0 && f < f0 + n ? amp * Math.exp(-(f - f0) / 3) * Math.sin((f - f0) * 2.1) * (1 - (f - f0) / n) : 0;
const dip = (f, f0, amp = 8, n = 4) => f > f0 && f < f0 + n ? amp * Math.sin(Math.PI * (f - f0) / n) : 0;
const mixP = (a, b, u) => ({ wx: a.wx + (b.wx - a.wx) * u, wy: a.wy + (b.wy - a.wy) * u });
const G0 = 1003;                                                         // the move rig's ground line for a foot centre (MG 1010 - 7)

// metres -> card px per cast member: metrics(entry).px / height, measured on this film's cast (tools/probe_px.mjs output in SHARED_WALKS.md)
export const PXM = { hero: 494.50, chief: 598.82, chiefVisitor: 598.82, kid: 519.21, clerk: 533.64 };

// ---------------------------------------------------------------------------------------------------------------------------------------------
// GAIT: walk / march / run / burst. spec: { who, n steps, T frames per step, a first lift frame, G frames in all, across m, depth m, kind,
//   lift px (swing height), lean deg, home [rear, front] foot px, hands (fn of ch, phase, g) , end { rot, head, y } settle target }
function planGait(U) {
  const run = U.kind === 'run' || U.kind === 'burst', T = U.T, n = U.n, sw = run ? Math.round(T * 1.4) : Math.max(3, Math.round(T * .72));
  const steps = []; for (let j = 0; j < n; j++) { const i = (U.lead ?? 1) === 1 ? (j + 1) % 2 : j % 2;   // lead foot = the front foot (feet[1]) by default
    const to = Math.min(1, (j + 1) / (n - 1)), g0 = U.a + j * T; steps.push({ j, i, g0, g1: g0 + (j === n - 1 && !run ? Math.max(3, sw - 1) : sw), to }); }
  return { run, sw, steps };
}
// the across axis: the camera's horizontal right at the middle of the path (the card turns to the lens, so its x axis is this one)
export function axes(U) { const m = [0, 1].map(k => (U.P0[k] + U.P1[k]) / 2), f = [m[0] - U.cam[0], m[1] - U.cam[1]], fl = Math.hypot(...f), r = [f[1] / fl, -f[0] / fl];
  const d = [U.P1[0] - U.P0[0], U.P1[1] - U.P0[1]], ac = d[0] * r[0] + d[1] * r[1];
  return { r, across: Math.abs(ac), dir: ac < 0 ? -1 : 1, depth: [d[0] - ac * r[0], d[1] - ac * r[1], U.P1[2] - U.P0[2]], path: Math.hypot(...d) }; }
function gaitTables(U) {
  const AX = axes(U), Dpx = AX.across * PXM[U.who], { run, steps } = planGait(U), G = U.G, home = U.home || [-22, 24];
  const Sv = U.strideVis ?? 0;                                                                    // drawn stride for a path into the lens (px): feet still step apart
  const fq = [[], []], fl = [[], []];
  for (let g = 0; g <= G; g++) for (let i = 0; i < 2; i++) {
    let x = 0, lift = 0; for (const s of steps.filter(s => s.i === i)) { if (g >= s.g1) x = s.to; else if (g > s.g0) { const u = (g - s.g0) / (s.g1 - s.g0);
      x = x + (s.to - x) * ease(Math.max(0, u - .08), .92); lift = U.lift * Math.sin(Math.PI * Math.min(1, u)) ** (run ? .7 : 1.2); } }
    fq[i][g] = x; fl[i][g] = lift < .5 ? 0 : lift; }
  // the body rides the mean of the two feet, smoothed by a wide triangle (it keeps moving through the double support, starts and stops soft)
  const avg = []; for (let g = 0; g <= G; g++) avg[g] = (fq[0][g] + fq[1][g]) / 2;
  const W = Math.max(3, Math.round(U.T * (run ? .9 : .8))), bq = [];
  for (let g = 0; g <= G; g++) { let s = 0, w = 0; for (let k = -W; k <= W; k++) { const q = Math.min(G, Math.max(0, g + k)), c = W + 1 - Math.abs(k); s += avg[q] * c; w += c; } bq[g] = s / w; }
  for (let g = 0; g <= G; g++) if (g >= steps[steps.length - 1].g1 + W) bq[g] = 1;              // settled exactly on the end spot
  const span = Math.max(Dpx, Sv);                                                                // px per unit of gait progress, as drawn
  const fx = [0, 1].map(i => fq[i].map(q => q * span + home[i])), bx = bq.map(q => q * span), bw = bq.map(q => q * Dpx);
  // card path (plan metres), per frame: across with the body; depth with the body in a walk, only on flight frames in a run / burst
  const air = g => [0, 1].every(i => fl[i][g] >= 3 || (g > 0 && fl[i][g - 1] >= 3));
  // U.ground: the share of the depth a run may take on a planted frame (all of it on flight frames read as 60 cm pops)
  const inc = []; let tot = 0; for (let g = 1; g <= G; g++) { const d = Math.max(0, bq[g] - bq[g - 1]) * (!run || air(g) ? 1 : U.ground ?? 0) + (run && air(g) ? 1e-4 : 0); inc[g] = d; tot += d; }
  const card = []; let acc = 0; for (let g = 0; g <= G; g++) { if (g) acc += tot ? inc[g] / tot : 0; const a = bq[g] * AX.across * AX.dir;
    card[g] = [0, 1, 2].map(k => +(U.P0[k] + (k < 2 ? AX.r[k] * a : 0) + AX.depth[k] * acc).toFixed(4)); }
  return { Dpx, run, steps, fx, fl, bx, bw, card, AX };
}
function gaitPose(U, tab, g, ch, view = U.view) {
  const gi = Math.max(0, Math.min(U.G, Math.round(g))), { fx, fl, bx, bw, steps, run } = tab, body = bx[gi];
  const hipY = ch.hipY, V0 = G0 - hipY, L = ch.legL * .985, hx = view === 'side' ? [-12, 10] : [-(ch.hipW || 13), ch.hipW || 13];
  // hip drop that keeps every planted foot inside the leg's reach (the rig would pull an out-of-reach foot in = a slide)
  let need = 0; for (let i = 0; i < 2; i++) { const dx = fx[i][gi] - body - hx[i], vert = Math.sqrt(Math.max(0, L * L - dx * dx)) - fl[i][gi]; need = Math.max(need, V0 - vert); }
  const last = steps[steps.length - 1], gEnd = last.g1, lands = steps.map(s => s.g1);
  let y = Math.max(0, need) + (U.bob || 0) * lands.reduce((a, l) => a + dip(gi, l - 1, 1, 5), 0);
  if (run) { const air = fl[0][gi] > 2 && fl[1][gi] > 2; y -= air ? (U.hop || 10) * Math.min(fl[0][gi], fl[1][gi]) / U.lift : 0; }
  const E = U.end || {}, SF = U.fast || 10, settle = snap(gi - gEnd, SF);
  const go = snap(gi - U.a + 2, 6) - snap(gi - gEnd, SF);                                         // the lean comes in with the first step, goes with the stop
  const ant = U.ant ? U.ant * (snap(gi - U.a + 4, 3) - snap(gi - U.a, 3)) : 0;                    // anticipation crouch before the first step (runs)
  const stomp = U.stomp ? lands.reduce((a, l) => a + dip(gi, l, U.stomp, 4), 0) : 0;              // the proud stomp: the body drops on every plant
  y += ant + stomp;
  const rot = (U.lean || 0) * go + (E.rot || 0) * settle + ring(gi, gEnd, U.skid || 0, 10) + (U.rot0 || 0) * (1 - settle);
  const head = (U.head || 0) * go + (E.head || 0) * settle + ring(gi, gEnd, U.nod || 0, 10) + (U.head0 || 0) * (1 - settle);
  if (E.y != null) y = Math.max(need, (y - Math.max(0, need)) * (1 - settle) + Math.max(0, need) * (1 - settle) + E.y * settle);   // lands in the hand-off pose's own crouch
  // arms: counter-swing to the legs (each step a snap, never a sine), or the use's own hands
  let swing = 0, prev = 0; for (const s of steps) { const tgt = s.j === steps.length - 1 ? 0 : s.i === 1 ? 1 : -1; swing += (tgt - prev) * snap(gi - s.g0, s.g1 - s.g0 + 2); prev = tgt; }   // the arm opposite the stepping foot goes forward
  const hands = U.hands(ch, swing, gi, { go, settle: U.fast ? snap(gi - gEnd + 3, 6) : settle, gEnd }).map((h, i) => reach(ch, h, i, y, view === 'side', rot));
  return { view: U.view, dir: 1, x: 0, y, rot, head, farArmFront: !!U.farArmFront,
    feet: [0, 1].map(i => ({ x: fx[i][gi] - body, lift: fl[i][gi] })), hands, held: [],
    _walk: { side: true, on: true, travel: body, world: bw[gi], planted: [fl[0][gi] === 0, fl[1][gi] === 0] } };
}

// a fist never asks past the arm (the rig would clamp it and the gate counts it): pulled in to 96 % of the arm from its shoulder
function reach(ch, h, i, y, side, rot) { const r = rot * Math.PI / 180, ox = side ? 8 : (i ? 1 : -1) * ch.sh[0], oy = ch.sh[1] - ch.hipY, sx = ox * Math.cos(r) - oy * Math.sin(r), sy = ch.hipY + y + ox * Math.sin(r) + oy * Math.cos(r), dx = h.wx - sx, dy = h.wy - sy, d = Math.hypot(dx, dy), L = ch.armL * .96;   // shoulder turned with the lean about the hip
  return d <= L ? h : { ...h, wx: sx + dx * L / d, wy: sy + dy * L / d }; }
// arm sets per personality
const armsHero = (ch, s, g, k) => { const S = ch.sh[1], L = ch.armL, Wd = ch.handX;            // calm: arms long and loose, a small even swing
  return [{ wx: -Wd * .2 - .18 * L * s, wy: ch.hipY - 8 + 6 * Math.abs(s), bow: .3 }, { wx: Wd * .2 + .18 * L * s, wy: ch.hipY - 8 + 6 * Math.abs(s), bow: .3, over: true }]; };
const armsThumbs = (ch, s, g, k) => [{ wx: -ch.handX * .45, wy: ch.hipY - 34 - 3 * Math.abs(s), bow: .35 }, { wx: ch.handX * .45, wy: ch.hipY - 34 - 3 * Math.abs(s), bow: .4, over: true }];   // thumbs in the belt (cv_s7's own pose)
const armsPump = (end) => (ch, s, g, k) => { const S = ch.sh[1], L = ch.armL, Wd = ch.handX, u = k.settle;   // fists pumping, bent at the elbow
  const p0 = { wx: -Wd * .3 - .35 * L * s, wy: S + .45 * L - .25 * L * Math.max(0, -s) }, p1 = { wx: Wd * .3 + .35 * L * s, wy: S + .45 * L - .25 * L * Math.max(0, s) };
  const e = end ? end(ch) : [{ wx: -Wd * .9, wy: ch.hipY - 10 }, { wx: Wd * .9, wy: ch.hipY - 10 }];
  return [{ ...mixP(p0, e[0], u), bow: .45 }, { ...mixP(p1, e[1], u), bow: .45, over: true }]; };

// ---------------------------------------------------------------------------------------------------------------------------------------------
// LADDER CLIMB (S5 Clerk): treads every RUNG m; three stages with a pause; hands on the rails at rung height, feet on the treads.
// The card's ground = the tread under the LOWER planted foot; it jumps up one tread on the frame the lower foot is off its tread (lift > 0),
// and every card-px value shifts by the same amount on that frame, so nothing moves in the world.
function planClimb(U) {
  const ev = []; let g = U.a; const fr = [0, 0], hr = [0, 0];                                     // foot tread index, hand rung index (from the start tread)
  fr[0] = 0; fr[1] = 0; hr[0] = U.handStart; hr[1] = U.handStart + 1;
  for (let st = 0; st < U.stages.length; st++) { const n = U.stages[st];
    for (let k = 0; k < n; k++) { const i = k % 2;                                              // the foot that steps; the opposite hand reaches
      const hand = 1 - i; ev.push({ type: 'hand', i: hand, g0: g, g1: g + U.T - 1, from: hr[hand], to: hr[hand] + 2 }); hr[hand] += 2;
      const up = fr[i] === fr[1 - i] ? 1 : 2; ev.push({ type: 'foot', i, g0: g + 1, g1: g + U.T, from: fr[i], to: fr[i] + up }); fr[i] += up; g += U.T; }
    g += st < U.stages.length - 1 ? U.pause : 0; }
  return { ev, gEnd: g, top: Math.max(...fr) };
}
function climbTables(U) {
  const { ev, gEnd } = planClimb(U), G = U.G, ft = [[], []], hd = [[], []], lift = [[], []];
  for (let g = 0; g <= G; g++) { for (let i = 0; i < 2; i++) { let r = 0, l = 0, h = i ? U.handStart + 1 : U.handStart;
      for (const e of ev.filter(e => e.i === i)) { if (e.type === 'foot') { if (g >= e.g1) r = e.to; else if (g > e.g0) { const u = (g - e.g0) / (e.g1 - e.g0); r = e.from + (e.to - e.from) * ease(Math.max(0, u - .1), .9); l = 1; } else if (g <= e.g0) {} }
        else { if (g >= e.g1) h = e.to; else if (g > e.g0) { const u = (g - e.g0) / (e.g1 - e.g0); h = e.from + (e.to - e.from) * snap(u * 12, 12); } } }
      ft[i][g] = r; lift[i][g] = l; hd[i][g] = h; } }
  // the card ground (tread index): the lower planted foot's tread, held until that foot is off it
  const cg = []; let c = 0; for (let g = 0; g <= G; g++) { const pl = [0, 1].filter(i => !lift[i][g]); const low = pl.length ? Math.min(...pl.map(i => ft[i][g])) : c; if (low > c && pl.length) c = low; cg[g] = c; }
  // the hips: never above the reach of the lowest PLANTED foot; they rise onto the upper foot as the lower one leaves (approach, not a ramp)
  const hs = []; let h = 0; for (let g = 0; g <= G; g++) { const pl = [0, 1].filter(i => !lift[i][g]), tg = pl.length ? Math.min(...pl.map(i => ft[i][g])) : h; h += (tg - h) * (tg > h ? .42 : 1); if (Math.abs(tg - h) < .004) h = tg; hs[g] = h; }
  const L = U.ladder, card = cg.map(k => { const z = L.z0 + k * U.rung; return [L.x, +(L.y0 + (L.y1 - L.y0) * (z - L.zb) / (L.top - L.zb) - L.off).toFixed(4), +z.toFixed(4)]; });
  return { ev, gEnd, ft, lift, hd, cg, hs, card };
}
function climbPose(U, tab, g, ch, view = U.view) {
  const gi = Math.max(0, Math.min(U.G, Math.round(g))), px = PXM[U.who] * U.rung, { ft, hd, cg, gEnd } = tab, c = cg[gi];
  const S = ch.sh[1], L = ch.armL;
  const fH = [0, 1].map(i => (ft[i][gi] - c) * px), lowH = Math.min(...fH);
  const y = -(tab.hs[gi] - c) * px + 8 * (snap(gi - U.a, 4) - snap(gi - gEnd, 10));                // hips on the lowest planted tread; a small crouch while climbing
  const top = snap(gi - gEnd - U.tipAt, 6) - snap(gi - gEnd - U.tipAt - 12, 8);                     // the hat tip at the top: knuckle to the brim and back
  const look = snap(gi - gEnd - 2, 8);
  const hands = [0, 1].map(i => { const hy = G0 - (hd[i][gi] - c) * px - 6, hx = (i ? 1 : -1) * ch.handX * .55; return { wx: hx, wy: Math.max(S - .95 * L + y, hy), bow: .3, over: !!i }; });
  for (let i = 0; i < 2; i++) hands[i] = reach(ch, hands[i], i, y, view === 'side', -3 * (1 - snap(gi - gEnd, 12)));
  if (top > 0) { const brim = { wx: ch.handX * .35, wy: ch.hy - 95 + y }; hands[1] = { ...mixP(hands[1], brim, top), bow: .5, over: true }; }
  const head = -6 * look + 4 * top + ring(gi, gEnd + U.tipAt + 6, 2.5, 9);
  const feet = [0, 1].map(i => ({ x: (i ? 14 : -14), lift: fH[i] + (tab.lift[i][gi] ? 10 * Math.sin(Math.PI * Math.min(1, Math.max(0, frac(tab, i, gi)))) : 0) }));
  return { view: U.view, dir: 1, x: 0, y, rot: -3 * (1 - snap(gi - gEnd, 12)), head, farArmFront: true, feet, hands, held: [],
    _walk: { side: true, on: false, travel: 0, planted: [!tab.lift[0][gi], !tab.lift[1][gi]] }, _card: c };
}
const frac = (tab, i, g) => { const e = tab.ev.find(e => e.type === 'foot' && e.i === i && g > e.g0 && g < e.g1); return e ? (g - e.g0) / (e.g1 - e.g0) : 0; };

// ---------------------------------------------------------------------------------------------------------------------------------------------
// USES: one per stretch place change. A = film frame of the act that sets the pose; P0 / P1 plan metres; cam = camera pos at the travel (for the across axis).
export const USES = {
  // S1 row 6: the Chief bursts out of the bay 2 mouth beside his red pumper on "chief" (f163): two fast planted strides, lands in ch_burst's f171 crouch
  s1_ch_burst: { stretch: 's1', who: 'chief', A: 157, back: { pose: 'm:../../ep_s1/ch_burst@5.7', at: 171 }, P0: [3.0, 20.15, 0.14], P1: [2.45, 19.1, 0.14], cam: [-0.15, 12.74, 1.41],
    kind: 'burst', ground: .35, view: '34', n: 3, T: 3, a: 0, G: 14, fast: 3, lift: 34, hop: 12, lean: 10, head: -4, ant: 8, home: [-30, 30], hands: armsPump(),
    end: { rot: .4, head: -6, y: 14 }, farArmFront: true },
  // S2 row 9: the fireman's long calm stride on the pavement toward his shop door (hidden at 322 as now)
  s2_he_walk: { stretch: 's2', who: 'hero', A: 289, P0: [2.95, -2.15, 0.02], P1: [2.6, -3.2, 0.02], cam: [1.04, -5.18, 2.08],
    kind: 'walk', view: 'side', n: 3, T: 12, a: 1, G: 44, lift: 16, bob: 0, lean: 2, head: 1, home: [-22, 24], hands: armsHero },
  // S6 row 43: the Kid's quick run in behind the ball (stops with the head tilted on "in" f1427 / think face f1431)
  s6_kid_run: { stretch: 's6', who: 'kid', A: 1408, P0: [36.9, -12.8, 0.0], P1: [36.35, -10.35, 0.0], cam: [35.3, -9.85, 0.35],
    kind: 'run', ground: .35, view: '34', n: 5, T: 4, a: 3, G: 30, lift: 22, hop: 8, lean: 14, head: 4, ant: 6, skid: -5, home: [-14, 14], hands: armsPump(),
    end: { rot: -3, head: 8 }, nod: 3, farArmFront: true },
  // S7 row 51: the Chief marches to the wet red door, thumbs in his belt, high knees, and plants himself with a stomp ON "firetruck" (f1678)
  s7_cv_march: { stretch: 's7', who: 'chiefVisitor', A: 1647, back: { pose: 'm:../../ep_s7/cv_s7@3.8', at: 1690 }, P0: [6.82, 9.89, 0.12], P1: [5.75, 9.35, 0.12], cam: [6.67, 8.0, 1.41],
    kind: 'walk', view: '34', n: 5, T: 6, a: 2, G: 43, lift: 40, stomp: 6, lean: -4, head: -2, home: [-26, 26], hands: armsThumbs,
    end: { rot: -4, head: -3 }, farArmFront: false },
  // S8 rows 55-57 (S8 builder 2026-11-21): the Chief's proud parade march up the white yard line into his own pumper's nose; the last plant is the bump on "into" (1876)
  s8_ch_march: { stretch: 's8', who: 'chief', A: 1794, P0: [4.2, 14.2, 0.14], P1: [4.2, 17.95, 0.14], cam: [10.2, 16.4, 1.25],
    kind: 'walk', view: 'side', n: 8, T: 10, a: 2, G: 82, lift: 40, stomp: 6, lean: -4, head: -6, home: [-26, 26], hands: armsThumbs,
    end: { rot: -4, head: -6 }, farArmFront: false },
  // S5 rows 33-34: the Clerk climbs the ladder from the stool top: three stages with a pause, hands on the rails, feet on the treads, hat tip at the top
  s5_cl_climb: { stretch: 's5', who: 'clerk', A: 1147, climb: true, rung: .3, ladder: { x: -0.1, y0: 6.95, y1: 8.33, top: 7.5, zb: 0.12, z0: 0.72, off: 0.24 }, view: '34', stages: [2, 2, 2], T: 4, pause: 4, a: 2, handStart: 4, tipAt: 6, G: 64 },
};
const TABS = {}; const tabOf = (k, ch) => (TABS[k] ||= USES[k].climb ? climbTables(USES[k]) : gaitTables(USES[k], ch));
const poseOf = (k, view) => (t, ch) => { const U = USES[k], g = t * 30, P = U.climb ? climbPose(U, tabOf(k, ch), g, ch, view) : gaitPose(U, tabOf(k, ch), g, ch, view); return view ? { ...P, view } : P; };
export const tables = (k, ch) => tabOf(k, ch);

const STY = Object.keys(USES).map(k => ({ key: k, name: k, blurb: USES[k].kind || 'climb', pose: poseOf(k, USES[k].view === 'side' ? 'side' : 'side') }));
const STF = Object.keys(USES).map(k => ({ key: k, name: k, blurb: USES[k].kind || 'climb', pose: poseOf(k, USES[k].view === 'side' ? 'front' : USES[k].view) }));
export const N = 100;   // S8 builder 2026-11-21: was 80; s8_ch_march runs 82 f (the gate reads every move to N)
export default { title: 'FIRETRUCKS shared locked-feet moves (side)', dur: N / 30, styles: STY };
export const front = { title: 'FIRETRUCKS shared locked-feet moves (front / 3/4)', dur: N / 30, styles: STF };
// motion-gate plan (moves/tools/check_motion_ep.mjs): frames from the move start
export const PLAN = {
  s1_ch_burst: { who: 'chief', view: '34', strikes: [], holds: [], acting: [0, 14] },
  s2_he_walk: { who: 'hero', view: 'side', strikes: [], holds: [[43, 44, 'at the door']], acting: [0, 33] },
  s6_kid_run: { who: 'kid', view: '34', strikes: [], holds: [[29, 30, 'stopped, head tilted']], acting: [0, 28] },
  s7_cv_march: { who: 'chiefVisitor', view: '34', strikes: [], holds: [[41, 43, 'planted']], acting: [0, 40] },
  s8_ch_march: { who: 'chief', view: 'side', strikes: [], holds: [], acting: [0, 82] },
  s5_cl_climb: { who: 'clerk', view: '34', strikes: [], holds: [[61, 64, 'at the top, hat tipped back']], acting: [0, 60] },
};
export const BW = { dz: 0 };   // the motion gate reads BW.dz (a sloped walk); these walks are on flat ground

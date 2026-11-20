// EPISODE MOVES, yellow-fire-trucks S1 THE HOOK (film 0.00-9.60 s = frames 0-288, plan rows 1-8, script lines 1-2). S1 stretch builder 2026-11-20.
// STUDIO MOTION form (./studio_ep.mjs, copied from fake-surgery s4: Rick's snap 5/16/31/48/66 %, settle, DEAD STILL in holds), drawn new on every frame
// (tween.ones). Every move starts at its film.json act; all acts start at film frame 0 (Chief: frame 0 too, hidden until 160), so move frame = FILM frame.
// Act frames are plain frame numbers from voice/words.json (x 30, rounded). Written facing +x (dir 1); the act's dir -1 mirrors.
// Rig units: y down, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX, ch.hipY. hands[0] = far (held3d 'L'), hands[1] = near (held3d 'R').
import { snap, tr, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
export const N = 289;
// words.json frames (s x 30): grabbed 19, gun 41, painted 56, brand 83, firetruck 98, bright 116, lemon 127, yellow 136, The 160, chief 163, exploded 172,
// Fire 200, trucks 208, are 215, red 223, We 243, look 248, like 253, a 257, giant 262, lemon 272, mouth shut 283
export const W = { grab: 19, painted: 56, brand: 83, bright: 116, lemon: 127, yellow: 136, chief: 163, exploded: 172, fire: 200, trucks: 208, are: 215, red: 223, we: 243, giant: 262, lemonC: 272, shut: 283 };

// ---- HERO m:he_spray (SIDE, faces the truck), rows 1-5 + listening in rows 6-8.
//   f0-116  the level sweep: the gun fist (near, R) out at shoulder height, passes every 26 f (out snap 14, back snap 12: never a sine, never linear),
//           the body rocks 3 deg with each pass; the far fist (L) is on the hose low at his hip until "grabbed" f19: 4 f dip, then it SNAPS up (6 f) and clamps
//           on the hose just behind the gun, riding with the gun fist from then on.
//   f116    "bright": gun lowered (snap 10), one step back (front foot lifts, plants 6 px back of the old spot; body x -14)
//   f127    "lemon": the free fist (L) lets go of the hose and goes out to arm's length at eye height (anticipation 4 f down, strike 7 f); head leans in 5
//   f136    "yellow": settle; DEAD STILL f150-175
//   f176    after "exploded": head turns up and back toward the Chief (tilt -9, snap 10), the free fist drops to the hose again; DEAD STILL f196-262
//   f262    "giant": he turns back to his truck: gun fist up to the spray line (snap 12), head 0; DEAD STILL from f282
const SW0 = 2, SWT = 26, SWN = 4;
function heSpray(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  let sw = 0, sy = 0, rk = 0;
  for (let k = 0; k < SWN; k++) { const s = SW0 + k * SWT; if (f < s - 1 || f > s + SWT + 14) continue; const out = snap(f - s, 14) - snap(f - s - 14, 12);
    sw += out; sy += (k % 2 ? -1 : 1) * out; rk += out; }
  const lower = snap(f - W.bright, 10) - snap(f - 262, 12), step = snap(f - W.bright - 1, 8), lift = 20 * (snap(f - W.bright - 1, 4) - snap(f - W.bright - 5, 5));
  const judge = snap(f - W.lemon - 3, 7) - snap(f - 178, 10), ant = 6 * (snap(f - W.lemon + 1, 3) - snap(f - W.lemon - 3, 4));
  const listen = snap(f - 176, 10) - snap(f - 262, 12);
  const head = -3 + 5 * snap(f - W.lemon, 8) - 5 * snap(f - 150, 10) * 0 - 9 * listen ;
  const rot = 2 + 3 * rk - 2 * step + 2 * snap(f - 262, 12) * 0;
  const gx = Wd * .25 + .80 * L + .06 * L * sw - .32 * L * lower, gy = S + .16 * L + .05 * L * sy + .42 * L * lower;           // the gun fist
  const grab = snap(f - W.grab, 6), gdip = 10 * (snap(f - W.grab + 4, 2) - snap(f - W.grab, 3));
  const hoseX = gx - .21 * L, hoseY = gy + .13 * L;                                                                             // the hose just behind the gun
  let fx = Wd * .25 + .28 * L + (hoseX - Wd * .25 - .28 * L) * grab, fy = S + .68 * L + gdip + (hoseY - S - .68 * L) * grab;
  fx += (Wd * .35 + .88 * L - fx) * judge; fy += (S - .06 * L - fy) * judge + ant * (1 - judge);
  return { view: 'side', dir: 1, x: -14 * step, y: dip(f, W.bright + 7, 5, 5), rot, head,
    feet: [{ x: -22, lift: 0 }, { x: 24 - 20 * step, lift }], farArmFront: false,
    hands: [{ wx: fx, wy: fy, bow: .4 }, { wx: gx, wy: gy, bow: .35, over: true }], held: [] }; }

// ---- CHIEF m:ch_burst (3/4, faces the hero), rows 6-8. Hidden until f160 (film.json), the card glides from the bay mouth to his spot 160-170.
//   f160-170 the burst: two stamping strides (lift 4 f, plant 5 f), lean 10 forward, fists pumping
//   f168-171 ANTICIPATION: sinks 14 px, shoulders up, head down (the world goes quiet)
//   f172     IMPACT "exploded": jumps 46 px (snap 4), both fists fly out wide and high, head thrown back -10; HELD PEAK in the air f176-186; lands f190 (dip 9)
//   f200     "Fire": head thrust at the hero (rot 8, head 7), fists clenched at his hips; a head jab on "trucks" f208 and "are" f215
//   f214-219 anticipation of the stamp: rises 8 px, both fists up to the chest; f223 "RED": both fists punch down, both boots stamp (dip 11), ring
//   f243     "We": his head swings to the truck (head -2); f262 "giant": the near arm swings stiff to point at the truck (snap 6); a head shake 262-272
//   f272     "LEMON": a jolt (dip 7, head pop from the face change); f283 mouth shut: chest out (rot -5), DEAD STILL to the end
function chBurst(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  let lf0 = 0, lf1 = 0, pump = 0;
  for (const [s, k] of [[160, 0], [165, 1]]) { const g = f - s, l = 34 * (snap(g, 3) - snap(g - 3, 4)); if (k) lf1 += l; else lf0 += l; pump += (k ? -1 : 1) * (snap(g, 3) - snap(g - 4, 4)); }
  const ant = snap(f - 167, 4) - snap(f - 172, 3), jump = snap(f - W.exploded, 8) - snap(f - 184, 7), land = dip(f, 190, 9, 5);
  const thrust = snap(f - W.fire, 8) - snap(f - 276, 8), sup = snap(f - 214, 5) - snap(f - W.red, 3), stamp = dip(f, W.red, 11, 5);
  const jab = 3 * (snap(f - W.trucks, 3) - snap(f - W.trucks - 3, 6)) + 3 * (snap(f - W.are, 3) - snap(f - W.are - 3, 6));
  const point = snap(f - W.giant, 6), shake = 4 * (snap(f - 264, 3) - 2 * snap(f - 267, 3) + snap(f - 270, 3));
  const y = 14 * ant - 46 * jump + land - 8 * sup + stamp + dip(f, W.lemonC, 7, 4);
  const rot = 10 * (snap(f - 160, 3) - snap(f - 168, 4)) - 4 * jump + 8 * thrust - 5 * snap(f - 276, 8);
  const head = -6 * ant - 10 * jump + 7 * thrust + jab - 9 * snap(f - W.we, 8) + shake + ring(f, 190, 3, 10);
  // fists: near = 1, far = 0. Rest at the hips; pumping in the burst; wide and high in the jump; at the chest before the stamp, punched down on it
  const hip = (i, s) => ({ wx: s * Wd * .9, wy: ch.hipY - 10 });
  let n = hip(1, 1), r = hip(0, -1);
  n = { wx: n.wx + 30 * pump, wy: n.wy - 40 * Math.abs(pump) }; r = { wx: r.wx - 30 * pump, wy: r.wy - 40 * Math.abs(pump) };
  const wide = [{ wx: -Wd * .5 - .55 * L, wy: S - .55 * L }, { wx: Wd * .5 + .55 * L, wy: S - .6 * L }];
  const chest = [{ wx: -Wd * .15, wy: S + .2 * L }, { wx: Wd * .25, wy: S + .18 * L }], down = [{ wx: -Wd * .7, wy: ch.hipY + 25 }, { wx: Wd * .8, wy: ch.hipY + 25 }];
  const mix = (a, b, u) => ({ wx: a.wx + (b.wx - a.wx) * u, wy: a.wy + (b.wy - a.wy) * u });
  let h0 = mix(r, wide[0], jump), h1 = mix(n, wide[1], jump);
  h0 = mix(h0, chest[0], sup); h1 = mix(h1, chest[1], sup);
  const pd = snap(f - W.red, 4) - snap(f - 236, 10); h0 = mix(h0, down[0], pd * (1 - sup)); h1 = mix(h1, down[1], pd * (1 - sup));
  h1 = mix(h1, { wx: Wd * .6 + .95 * L, wy: S + .02 * L }, point);
  return { view: '34', dir: 1, x: 0, y, rot, head, feet: [{ x: -30, lift: lf0 + 22 * jump + 16 * sup * 0 }, { x: 30, lift: lf1 + 22 * jump }], farArmFront: true,
    hands: [{ ...h0, bow: .45 }, { ...h1, bow: point > .5 ? .2 : .45, over: true }], held: [] }; }

// ---- ROOKIE m:rk_frozen (3/4), helmet over his eyes (puppet rookieDown) to f163, then m:rk_jump on the rookie puppet:
//   rk_frozen: frozen with both fists up at the helmet brim (he pulled it down in horror), DEAD STILL; on "chief" f163 the jump is the other card.
//   rk_jump (from f164): lands from a startled hop (the swap frame is mid-air), fists push the brim up (snap 6), then the ping-pong look:
//   head to the Chief f200, to the hero f216, to the Chief f236, to the hero f262; DEAD STILL between.
function rkFrozen(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX; const hop = snap(f - 152, 10);
  return { view: '34', dir: 1, x: 0, y: -26 * hop, rot: -2, head: 3, feet: [{ x: -28, lift: 16 * hop }, { x: 26, lift: 16 * hop }], farArmFront: true,
    hands: [{ wx: -Wd * .35, wy: S - .62 * L - 10 * hop }, { wx: Wd * .35, wy: S - .62 * L - 10 * hop, over: true }], held: [] }; }
function rkJump(t, ch) { const f = F(t) + 164, S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const air = 1 - snap(f - 164, 6), push = snap(f - 168, 6), down = snap(f - 180, 10);
  const head = tr([[0, 0], [200, 6, 8], [216, -6, 8], [236, 6, 8], [262, -6, 8]], f) + ring(f, 171, 3, 10);
  const up = { wx: Wd * .3, wy: S - .78 * L }, rest = { wx: Wd * .75, wy: ch.hipY - 14 };
  const h = u => ({ wx: up.wx + (rest.wx - up.wx) * u, wy: up.wy + (rest.wy - up.wy) * u });
  const a = h(down), b = { ...h(down), wx: -h(down).wx };
  return { view: '34', dir: 1, x: 0, y: -26 * air + dip(f, 170, 8, 5), rot: -2 + 3 * down, head, feet: [{ x: -28, lift: 16 * air }, { x: 26, lift: 16 * air }], farArmFront: true,
    hands: [{ ...b, wy: b.wy - 12 * push * (1 - down), bow: .5 }, { ...a, wy: a.wy - 12 * push * (1 - down), bow: .5, over: true }], held: [] }; }

// ---- OLD-TIMER m:ot_frozen (3/4): frozen with his near fist halfway to his mouth (the bite he forgot), far fist at his belt. On "exploded" f172 the ring
//   reaches him: a flinch back (rot -5, snap 5) and back; on "RED" f223 his lunch box hops and he flinches again, smaller; DEAD STILL between.
function otFrozen(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const fl = snap(f - 174, 8) - snap(f - 182, 12), fl2 = .8 * (snap(f - 225, 12) - snap(f - 240, 12));
  return { view: '34', dir: 1, x: 0, y: 0, rot: -5 * (fl + fl2), head: 4 - 6 * fl - 4 * fl2, feet: [{ x: -30, lift: 0 }, { x: 28, lift: 0 }], farArmFront: true,
    hands: [{ wx: -Wd * .8, wy: ch.hipY - 22 }, { wx: Wd * .1 + .2 * L, wy: S - .18 * L - 10 * fl, over: true }], held: [] }; }

// ---- SCEPTIC m:sc_crossed (3/4): arms crossed high, DEAD STILL; one small lean back when the ring hits (f175, snap 6, back by f190); nothing else.
function scCrossed(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX; const lb = snap(f - 175, 12) - snap(f - 190, 12);
  return { view: '34', dir: 1, x: 0, y: 0, rot: -3 * lb, head: -2 - 3 * lb, feet: [{ x: -28, lift: 0 }, { x: 28, lift: 0 }], farArmFront: true,
    hands: [{ wx: Wd * .55, wy: S + .22 * L, bow: .25, over: true }, { wx: -Wd * .5, wy: S + .26 * L, bow: .25, over: true }], held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('he_spray', heSpray, 'level spray sweep, grab the hose, lower, step back, judge, listen, back to work'),
  sty('ch_burst', chBurst, 'burst, power jump on exploded, quote with stamp and point'), sty('rk_frozen', rkFrozen, 'helmet over the eyes, frozen'),
  sty('rk_jump', rkJump, 'startled hop, pushes the helmet up, ping-pong look'), sty('ot_frozen', otFrozen, 'fist halfway to the mouth, flinches'),
  sty('sc_crossed', scCrossed, 'arms crossed, one lean back')];
export default { title: 'FIRETRUCKS S1: episode moves', dur: N / 30, styles: STY };
export const front = { title: 'FIRETRUCKS S1: episode moves', dur: N / 30, styles: STY };
// motion-gate plan (moves/tools/check_motion_ep.mjs): strikes + holds in frames from the move start (= film frames here; rk_jump starts at f164)
export const PLAN = {
  he_spray: { who: 'hero', view: 'side', strikes: [{ name: 'grab "grabbed" f19', f0: W.grab, ch: 'h0y', to: 'min' }, { name: 'judge "lemon" f130', f0: W.lemon + 3, ch: 'h0y', to: 'min' }],
    holds: [[152, 175, 'judged, dead still'], [198, 261, 'listens, dead still'], [284, N - 1, 'back at work, dead still']], acting: [0, 150] },
  ch_burst: { who: 'chief', view: '34', strikes: [{ name: 'jump "exploded" f172', f0: W.exploded, ch: 'y', to: 'min' }, { name: 'point "giant" f262', f0: W.giant, ch: 'h1x', to: 'max' }],
    holds: [[285, N - 1, 'puffed up']], acting: [160, 284] },
  rk_frozen: { who: 'rookieDown', view: '34', strikes: [], holds: [[0, 151, 'frozen, helmet over the eyes']], acting: [152, 163] },
  rk_jump: { who: 'rookie', view: '34', strikes: [], holds: [[30, 35, 'brim up'], [62, 71, 'to the Chief']], acting: [0, 124] },
  ot_frozen: { who: 'oldTimer', view: '34', strikes: [], holds: [[0, 173, 'frozen'], [195, 224, 'still'], [253, N - 1, 'still']], acting: [174, 244] },
  sc_crossed: { who: 'sceptic', view: '34', strikes: [], holds: [[0, 174, 'stone'], [203, N - 1, 'stone']], acting: [175, 204] },
};

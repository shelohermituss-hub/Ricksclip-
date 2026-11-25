// EPISODE MOVE, red-suit-car S1 (5 s, frames 0-149), 2026-11-25. STUDIO MOTION form (./studio_ep.mjs: Rick's snap curve, settle rings,
// DEAD STILL in holds), drawn new on every frame (tween.ones). The act starts at film frame 0, so f = t * 30 = the film frame.
// Rig units: y down, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX, ch.legL. Written facing +x (dir 1); hands[1] = the NEAR arm.
// Beats (film frames): 0-28 seated, near hand pushes the door open (door 3-23); 30-52 leans out, swings out (film.json moves the soles 31-68);
// 52-68 rises to full height, chest out; 80 near hand up to the gold hat brim (glint 88, face proud on 80); 98 the near hand swings back
// and pushes the open door (hand_at on the door tip 100-110), without looking; 113 the slam: a small body jolt; 118 dead still, smug, to the end.
import { snap, tr, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000, PI = Math.PI;
export const B = { open: 4, lean: 30, out: 38, rise: 52, up: 68, hat: 80, glint: 88, hatDown: 96, reach: 98, push: 104, slam: 113, rest: 118 };

function out(t, ch) { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX, LL = ch.legL ?? 120, K = ch.K ?? 1;
  // crouch: 0 seated-tall (the soles are lifted by film.json pos z), .4 bent while swinging out, 0 standing
  const crouch = tr([[0, 0], [B.lean, .32, 10], [B.out, .42, 12], [B.rise, 0, 16]], f);
  const lean = tr([[0, 3], [B.lean, 16, 10], [B.rise, 6, 10], [B.up - 4, -6, 10], [B.slam, -3, 4], [B.slam + 4, -6, 10]], f);
  const head = tr([[0, -2], [B.open, 4, 8], [B.lean, 10, 10], [B.rise, -2, 12], [B.hat, -8, 10], [B.hatDown, -4, 12], [B.reach, -6, 8], [B.rest, -9, 10]], f)
    + ring(f, B.up, 4, 10) + ring(f, B.slam, 3, 10);
  const y = crouch * LL + dip(f, B.slam, 6, 4);
  // feet: tucked while seated, then two steps out (each lift snaps up and plants), planted from B.up
  const seated = f < B.lean + 6;
  const stepA = f > B.out && f < B.out + 12 ? Math.sin(PI * (f - B.out) / 12) : 0, stepB = f > B.out + 12 && f < B.out + 24 ? Math.sin(PI * (f - B.out - 12) / 12) : 0;
  const feet = seated ? [{ x: 40, lift: LL * .55, kneeK: .2 }, { x: 70, lift: LL * .55, kneeK: .2 }]
    : [{ x: -32 + 10 * snap(f - B.out, 12), lift: 46 * stepA }, { x: 30 - 8 * snap(f - B.out - 12, 12), lift: 46 * stepB }];
  // FAR hand: on the wheel while seated, on the door top while he swings out, then hangs relaxed by his side
  const far = f < B.lean ? { f: .55, d: .42, bow: .4 } : f < B.rise + 6 ? { f: .7, d: .7, bow: .5 } : { f: .05, d: .92, bow: .35 };
  // NEAR hand: pushes the door open (4-20), grips the sill (30-52), hangs, up to the hat brim (80-96), swings back to the door (98-110), hangs
  const hatU = snap(f - B.hat, 8) - snap(f - B.hatDown, 10);
  const hatTarget = [-(Wd * .95 + 75 * K), (ch.hy ?? S - 120) - 30 * K];
  let near;
  if (f < B.lean) { const p = snap(f - B.open, 6) - .6 * snap(f - B.open - 10, 10); near = { f: -.2 - .55 * p, d: .55 - .2 * p, bow: .45 }; }
  else if (f < B.rise + 4) near = { f: -.45, d: .82, bow: .4 };
  else if (hatU > .02 && f < B.reach) { const rest = [-Wd * .4, S + .95 * L]; near = { wx: rest[0] + (hatTarget[0] - rest[0]) * hatU, wy: rest[1] + (hatTarget[1] - rest[1]) * hatU, bow: .6 }; }
  else if (f >= B.reach && f < B.slam + 8 && ch.tgt) { const u = snap(f - B.reach, 6) - snap(f - B.slam - 2, 10); near = { wx: -Wd * .05 + (ch.tgt[0] + Wd * .05) * u, wy: S + .95 * L + (ch.tgt[1] - S - .95 * L) * u, bow: .5 }; }
  else near = { f: -.05, d: .95, bow: .35 };
  return { view: '34', dir: 1, x: 0, y, rot: lean, feet, hands: [near, far], head, held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('out', out, 'S1: seated in the roadster, pushes the door open, swings out, rises, touches the gold hat, backhand shuts the door, smug')];
export default { title: 'red-suit-car S1 episode move', dur: 5, styles: STY };
export const front = { title: 'red-suit-car S1 episode move (3/4)', dur: 5, styles: STY };

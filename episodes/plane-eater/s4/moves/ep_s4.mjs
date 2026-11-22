// EPISODE MOVES, plane-eater S4 (rows 24-34, film 22.08-31.44 s = frames 660-942, script lines 6-8a). S4 stretch builder 2026-11-22 (DRAFT).
// m:../../ep_s4/mi_s4 = Michel SEATED at the white-cloth table (the s2 chair, seat 0.485 m), one move for rows 24-34. The act that sets this pose is at
// film frame 0 (OFF), so move frame = film frame. Written facing +x (dir 1). Hands [far (L), near (R)] as {f, d} = forward / down in arm lengths.
import { blinkAt, G } from './motion/rig.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
function tr(keys, f) { let v = keys[0][1]; for (let i = 1; i < keys.length; i++) { const [f0, to, n = 12] = keys[i]; if (f <= f0) break; const u = snap(f - f0, n); v = Array.isArray(to) ? v.map((a, j) => a + (to[j] - a) * u) : v + (to - v) * u; } return v; }
const ring = (f, f0, amp, n = 10) => f > f0 && f < f0 + n ? amp * Math.exp(-(f - f0) / 3) * Math.sin((f - f0) * 2.1) * (1 - (f - f0) / n) : 0;
const dip = (f, f0, amp = 8, n = 4) => f > f0 && f < f0 + n ? amp * Math.sin(Math.PI * (f - f0) / n) : 0;
// words: took 669, two 679, years 686, finish 701, plane 713, and 728, dessert 740, Bikes 768, carts 796, TVs 818, and 841, coffin 850, Guinness 855,
// called 875, strangest 894, diet 912, ever 920, Honestly 943
export const SEAT_M = .485;
const seatY = ch => { const top = ch.hy - 100 * ch.K, k = 1.7 / (G - top); return G - SEAT_M / k - 640 + 4; };
export const legs3d = { r: .034, pts: [[.08, SEAT_M + .04, .0], [.09, SEAT_M + .045, .24], [.095, SEAT_M - .03, .29], [.1, .04, .32], [.105, .03, .42]] };
export const chair3d = { seat: SEAT_M };
const P2 = (keys, f) => { const v = tr(keys.map(k => [k[0], [k[1].f, k[1].d], k[2]]), f); return { f: v[0], d: v[1] }; };
const REST = { f: .42, d: .62 }, MOUTH = { f: .3, d: -.12 }, PLATE = { f: .5, d: .45 };
// ---- MICHEL m:mi_s4
//  660-703 TIME-LAPSE (rows 24-25): fork from the plate to the mouth every 7 f (fast, a time-lapse eater), head bobs, chews; never looks up
//  703-713 "PLANE": the near hand takes the last piece, the SPINNER, up like a cherry (708), pops it in on 713 (head back 8, ring), swallows
//  716-727 the far hand dabs the mouth with the napkin twice (718, 723), deep satisfaction (eyes shut proud)
//  728-736 "and for" PLANNED STILLNESS (dead still, a look to the lens side)
//  737-752 "DESSERT?": the near hand lifts the silver table bell, rings it (740-750, small fast wrist shakes), sets it down
//  755-840 watches the trolley come and the tower rise: head tips up with each tier (768, 796, 818), thrilled
//  830-850 the near hand lifts his plate; the coffin topples (841): plate out and up, he CATCHES it on 850 (dip + ring), nervous smile, relief 858
//  866-878 sets the plate (with the coffin) down
//  882-894 takes the certificate off the book, 894 "STRANGEST": holds it up, chest out (rot -6), proud pose, far hand on the other side of the frame
//  906-912 brings the frame to his mouth: 912 "DIET" bites a corner like a champion's medal (head forward 6, dip 5), 914-940 chews, calm delight
function miS4(t, ch) { const f = F(t);
  const y0 = seatY(ch);
  const lapse = f > 662 && f < 703 ? f : 0, ph = lapse ? ((f - 662) % 7) / 7 : 0, toM = lapse ? (ph < .45 ? snap(ph * 7, 3) : 1 - snap((ph - .45) * 7, 3)) : 0;
  let R = P2([[0, PLATE], [703, { f: .6, d: .4 }, 4], [707, { f: .5, d: .05 }, 5], [711, MOUTH, 3], [715, REST, 8],
    [737, { f: .62, d: .42 }, 4], [740, { f: .55, d: .08 }, 4], [751, { f: .62, d: .42 }, 5], [755, REST, 8],
    [830, { f: .6, d: .42 }, 6], [836, { f: .55, d: .3 }, 6], [843, { f: .74, d: .12 }, 5], [850, { f: .72, d: .16 }, 2], [853, { f: .62, d: .42 }, 3],   // catch, then the plate goes down on the cloth (855)
    [858, { f: .64, d: .36 }, 3], [862, { f: .62, d: .32 }, 3], [866, { f: .56, d: -.18 }, 6], [874, { f: .74, d: .0 }, 6], [881, REST, 6],   // GUINNESS: he lifts the cloche off the book, holds it up, puts it aside
    [890, { f: .5, d: .1 }, 6], [894, { f: .5, d: -.12 }, 6], [906, REST, 8]], f);   // the near hand helps hold the frame up on STRANGEST
  if (lapse) R = { f: PLATE.f + (MOUTH.f - PLATE.f) * toM, d: PLATE.d + (MOUTH.d - PLATE.d) * toM };
  if (f > 740 && f < 751) R = { f: R.f + .025 * Math.sin((f - 740) * 2.6), d: R.d };                        // the bell rings
  if (f > 850 && f < 853) R = { f: R.f, d: R.d + .04 * Math.exp(-(f - 850) / 3) * Math.sin((f - 850) * 2.1) };   // the catch rings out in the arm
  const Lh = P2([[0, { f: .36, d: .66 }], [716, { f: .3, d: -.08 }, 5], [721, { f: .34, d: .0 }, 3], [723, { f: .3, d: -.08 }, 3], [728, { f: .36, d: .66 }, 8],
    [841, { f: .5, d: .3 }, 4], [858, { f: .36, d: .66 }, 10], [880, { f: .6, d: .42 }, 5], [887, { f: .5, d: .1 }, 7], [894, { f: .58, d: -.3 }, 6], [906, { f: .42, d: -.14 }, 6], [912, { f: .36, d: -.12 }, 3], [930, { f: .5, d: .02 }, 12]], f);   // the far hand (in front) carries the certificate
  const chewL = lapse ? 3 * Math.abs(Math.sin((f - 662) * Math.PI / 3.5)) : 0, chew2 = f > 914 && f < 942 ? 3 * Math.abs(Math.sin((f - 914) * Math.PI / 6)) : 0;
  const head = tr([[0, 2], [707, -2, 5], [713, -8, 3], [718, 2, 6], [728, 0, 6], [755, -6, 12], [768, -10, 8], [796, -14, 8], [818, -18, 8], [841, -6, 6], [850, 4, 2], [860, 0, 10],
    [894, -5, 6], [910, 4, 3], [914, 2, 6]], f) + ring(f, 713, 5, 10) + ring(f, 850, 4, 10) + chewL + chew2 + (lapse ? 4 * toM : 0);
  const rot = tr([[0, 1], [728, 0, 8], [755, -2, 12], [841, 4, 4], [850, -1, 4], [894, -6, 6], [912, 2, 3], [920, -1, 12]], f) + ring(f, 850, 2, 8);
  const face = f < 663 ? 'k:proud' : f < 703 ? (Math.floor((f - 662) / 7) % 2 ? 'k:peChew' : 'k:proud') : f < 713 ? 'k:aim' : f < 718 ? 'k:peChew' : f < 728 ? 'k:proud'
    : f < 737 ? 'k:standard' : f < 755 ? 'k:browUp' : f < 841 ? 'k:happy' : f < 858 ? 'k:nervousSmile' : f < 894 ? 'k:proud' : f < 911 ? 'k:proud' : f < 930 ? 'k:peChew' : 'k:happy';
  return { view: 'side', dir: 1, x: 0, y: y0 + dip(f, 713, 4, 4) + dip(f, 850, 6, 4) + dip(f, 912, 5, 4), rot, head, feet: [], farArmFront: (f > 715 && f < 728) || (f > 840 && f < 858) || (f > 879),
    hands: [{ f: Lh.f, d: Lh.d, bow: .35 }, { f: R.f, d: R.d, bow: .35, over: true }], face, blink: face === 'k:standard' ? blinkAt(t) : null, held: [] }; }
const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('mi_s4', miS4, 'seated: time-lapse eating, the spinner cherry, bell, coffin catch, certificate up, medal bite')];
export default { title: 'PLANE-EATER S4: Michel seated', dur: 944 / 30, styles: STY };
export const front = { title: 'PLANE-EATER S4: Michel seated', dur: 944 / 30, styles: STY };

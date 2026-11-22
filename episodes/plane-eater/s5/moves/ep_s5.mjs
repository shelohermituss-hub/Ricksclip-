// EPISODE MOVES, plane-eater S5 THE ENDING (film 31.44-34.04 s = frames 943-1021, plan rows 35-38, script line 8b). S5 stretch builder 2026-11-22 (DRAFT round).
// Both men SIT in airliner seats: the card draws body, arms and head; legs3d / chair3d (the kit's sit-on-a-chair method, motion_styles/moves/sit_chair.mjs)
// put the bottom on the seat and draw the legs as 3D ink tubes. Acts start at film frame 943, so move frame = film frame - 943.
// Hands as {f, d} = forward / down in arm lengths from the shoulder (rig.mjs). hands[0] = far, hands[1] = near.
// words.json frames: Honestly 943 (-955), STILLNESS 955-968, still 969, better 977, than 985, airline 991, FOOD 1001 (-1012), end 1021
import { snap, dip, ring, step } from './studio_ep.mjs';
import { G } from './motion/rig.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000, A0 = 943, SEAT_M = .52;   // the cabin seat pan top (sets/cabin: seat_0A_pan z .40-.52); pos z = the floor
export const N = 79;
export const W = { honestly: 943, still0: 955, still1: 968, still: 969, better: 977, than: 985, airline: 991, food: 1001, end: 1021 };
const seatY = ch => { const top = ch.hy - 100 * ch.K, k = 1.7 / (G - top); return G - SEAT_M / k - 640 + 4; };   // body bottom on the seat (sit_chair.mjs)
export const legs3d = { r: .022, pts: [[.075, SEAT_M + .04, .0], [.085, SEAT_M + .045, .22], [.09, SEAT_M - .02, .28], [.095, .05, .32], [.1, .03, .43]] };   // thighs along the pan to its front edge (x .26), shins to the floor, feet under the tray
export const chair3d = { seat: SEAT_M };
const mix = (a, b, u) => ({ f: a.f + (b.f - a.f) * u, d: a.d + (b.d - a.d) * u });

// ---- MICHEL m:mi_meal (front/3-4, window seat), rows 35-38.
//   943-948  "Honestly": the near hand (R) pinches the foil and LIFTS it (snap 5, foil state flips at 948), head forward to sniff
//   955-968  STILLNESS (the film's one): DEAD STILL, nose over the meal, the foil held up
//   969      "still": the face falls (peDisgust), head back -5 (snap 10); 977 "better": the near hand comes down, ONE finger slides the meal aside (976-988)
//   991      "airline": knife (L, far) and fork (R, near) fly UP like a conductor (snap 6), held up 994-999 (anticipation)
//   1001     "FOOD": both hands strike DOWN on the tray table (snap 4), body lean 9, dip 8: the bite is cut out of the table; 1006 back up, fork to the mouth, chewing
function miMeal(t, ch) { const f = F(t) + A0;
  const lift = snap(f - 944, 5), sniff = snap(f - 949, 6), back = snap(f - W.still, 10), push = snap(f - 976, 6) - snap(f - 989, 6);
  const up = snap(f - W.airline, 6), down = snap(f - (W.food - 2), 4), raise = snap(f - 1006, 8);
  let near = { f: .55, d: .75 };
  near = mix(near, { f: .85, d: .55 }, snap(f - 943, 2)); near = mix(near, { f: .62, d: -.45 }, lift);                 // foil up
  near = mix(near, { f: .88, d: .62 }, snap(f - 971, 5));                                                              // finger to the tray edge
  near = { f: near.f, d: near.d }; const slide = push;                                                                 // the slide is the set state "meal"
  let far = { f: .45, d: .78 };
  near = mix(near, { f: .38, d: -.42 }, up); far = mix(far, { f: .38, d: -.42 }, up);                                // conductor: knife and fork up
  near = mix(near, { f: .9, d: .5 }, down); far = mix(far, { f: .9, d: .52 }, down);                                 // the strike on FOOD
  near = mix(near, { f: .35, d: -.25 }, raise); far = mix(far, { f: .55, d: .3 }, raise);                            // fork to the mouth, knife rests
  const chew = f > 1008 ? 1.5 * Math.sin((f - 1008) * .9) : 0;
  return { view: '34', dir: 1, x: 0, y: seatY(ch) + dip(f, W.food, 8, 6) + chew, rot: 4 * sniff - 4 * back + 9 * down - 9 * raise,
    head: 7 * sniff - 12 * back + 5 * down - 5 * raise + ring(f, W.food, 3, 10), feet: [], farArmFront: true,
    hands: [{ ...far, bow: .4 }, { ...near, bow: .35, over: up > .5 && raise < .5 }], held: [] }; }

// ---- OWNER m:ow_wary (3/4, aisle seat), rows 35-38: arms folded on his belly, wary side-eye at Michel; DEAD STILL in the stillness;
//   1003 after "FOOD": the near hand (rag) flies up to his eyes and RUBS them (3 rubs, 1006-1016); 1017 the hand drops, defeated
function owWary(t, ch) { const f = F(t) + A0;
  const lean = snap(f - 977, 10), rubIn = snap(f - 1003, 5) - snap(f - 1010, 5), rub = f > 1005 && f < 1010 ? .06 * Math.sin((f - 1005) * 1.9) : 0;
  const reach = snap(f - 1009, 6), wipe = f > 1014 ? .07 * Math.sin((f - 1014) * 1.6) : 0;
  let near = mix({ f: .35, d: .62 }, { f: .28 + rub, d: -.38 }, rubIn); near = mix(near, { f: 1.0 + wipe, d: -.28 }, reach);   // row 38: leans over and wipes the window, rag at eye height
  const far = { f: .2, d: .66 };
  return { view: '34', dir: 1, x: 0, y: seatY(ch), rot: -3 * lean + 3 * rubIn + 12 * reach, head: -4 * lean + 6 * rubIn - 4 * reach, feet: [], farArmFront: true,
    hands: [{ ...far, bow: .4 }, { ...near, bow: .3, over: rubIn > .5 || reach > .5 }], held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('mi_meal', miMeal, 'lifts the foil, sniffs (stillness), disgust, slides the meal aside, knife and fork up, strikes the tray table, chews'),
  sty('ow_wary', owWary, 'wary side-eye, rubs his eyes with the rag after FOOD')];
export default { title: 'PLANE-EATER S5: episode moves', dur: N / 30, styles: STY };
export const front = { title: 'PLANE-EATER S5: episode moves', dur: N / 30, styles: STY };
export const PLAN = {
  mi_meal: { who: 'michel', view: '34', strikes: [948, 977, 991, 1001], holds: [[955, 968, 'STILLNESS']], acting: [943, 1021] },
  ow_wary: { who: 'owner', view: '34', strikes: [1003], holds: [[955, 968, 'STILLNESS']], acting: [977, 1021] },
};

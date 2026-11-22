// EPISODE MOVES, plane-eater S1 THE HOOK (film 0.00-8.56 s = frames 0-256, plan rows 1-9, script lines 1-2). S1 stretch builder 2026-11-22.
// STUDIO MOTION form (./studio_ep.mjs, Rick's snap 5/16/31/48/66 %, settle, DEAD STILL in holds), drawn new on every frame (tween.ones).
// Every move starts at film frame 0 (its act at 0), so move frame = FILM frame. Act frames = voice/words.json seconds x 30, rounded.
// Written facing +x (dir 1). Rig units: y down, ch.sh = [shoulder half width, shoulder y], ch.armL, ch.handX, ch.hipY. hands[0] = far (held3d 'L'), hands[1] = near ('R').
// Where film.json held3d has a tip_at window (shaker on the wing tip, saw strokes, tongs to the cut and the plate) the kit puts that fist on the point;
// the hand targets below are the same places in card space so the arm never jumps when a window opens or closes.
import { snap, tr, dip, ring } from './studio_ep.mjs';
const F = t => Math.round(t * 30 * 1000) / 1000;
export const N = 257;
// words.json frames: 1978 6, French 47, guy 54, looked 62, airplane 76, thought 98, Lunch 121, Michel 157, cut 173, whole 185, Cessna 192, tiny 214, metal 226, bites 235
export const W = { guy: 54, looked: 62, airplane: 76, thought: 98, lunch: 121, michel: 157, cut: 173, whole: 185, cessna: 192, tiny: 214, metal: 226, bites: 235 };

// ---- MICHEL m:mi_hook (one move for the stretch)
//   f0-58    SALTING (rows 1-2): far fist (L) high over the wing tip with the inverted shaker, a shake every 6 f (down snap 3, up snap 3); the near fist (R)
//            holds the fork up beside his shoulder like a conductor's baton; body leans 3 deg into the wing with each shake
//   f54      "guy": a pleased little shoulder lift (6 px, snap 5) - the moustache-tip twitch is the face
//   f62      "looked": shaking stops, the shaker fist lowers to his chest (snap 10); head lifts and turns along the wing (look change in film.json)
//   f98      "thought": the fork fist comes to his chin (snap 10), head tilts 4; f113-121 ANTICIPATION: sinks 6 px, shoulders up, dead quiet
//   f121     "LUNCH!": impact dip 8; both fists snap to the collar (5 f) and TUG the red napkin tight (4 f down), back out to rest by f132;
//            f133-150 DEAD STILL, grin to the lens
//   f150-160 the hacksaw comes up to the cut (near fist), the far fist rises to steady the wing tip from below
//   f160-203 tiny careful strokes every 8 f (push snap 4, pull snap 4), the body rocks 1.5 deg with them; f203 done, a satisfied breath (y -4, snap 8)
//   f205-213 the near fist (now the sugar tongs) reaches up to the cut corner; f214 "tiny" pinches; f222-235 carries down to the plate; f235 "bites":
//            proud nod (head 6, snap 5, back snap 8); the far fist back to his hip f206; DEAD STILL from f246
function miHook(t, ch, view = 'front') { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  let sh = 0; for (let k = 0; k < 10; k++) { const s = 2 + k * 6; if (s > 56) break; sh += snap(f - s, 3) - snap(f - s - 3, 3); }
  const stopSalt = snap(f - W.looked, 10), chin = snap(f - W.thought, 10) - snap(f - W.lunch, 5), ant = snap(f - 113, 8) - snap(f - W.lunch, 3);
  const collar = snap(f - W.lunch, 5) - snap(f - 128, 6), tug = snap(f - 125, 4) - snap(f - 129, 4);
  const sawUp = snap(f - 150, 10) - snap(f - 202, 8), steady = snap(f - 152, 10) - snap(f - 206, 10);
  let st = 0; for (let k = 0; k < 5; k++) { const s = 162 + k * 8; st += snap(f - s, 4) - snap(f - s - 4, 4); }
  const tongUp = snap(f - 205, 8), tongDown = snap(f - 222, 12);
  const rot = 3 * sh * (1 - stopSalt) + 1.5 * st * sawUp - 2 * ant + 2 * snap(f - 150, 10) - 2 * snap(f - 206, 10);
  const y = -6 * (snap(f - W.guy, 5) - snap(f - W.guy - 6, 6)) + 6 * ant + dip(f, W.lunch, 8, 4) - 4 * (snap(f - 202, 8) - snap(f - 214, 8)) + dip(f, W.bites - 1, 5, 4);
  const head = -4 * (snap(f - W.looked, 8)) + 4 * snap(f - W.looked, 8) * 0 + 4 * chin - 3 * ant + 6 * (snap(f - W.bites + 1, 5) - snap(f - W.bites - 4, 8)) + ring(f, W.lunch + 3, 3, 9);
  // fix round: 'hi' is inside the arm's reach (motion gate arm_over_reach)
  // far fist (L): shaker high over the wing -> chest -> collar -> hip -> steadies the wing -> hip
  const hi = { wx: Wd * .3 + .5 * L, wy: S - .55 * L + .05 * L * sh }, chest = { wx: Wd * .2 + .25 * L, wy: S + .35 * L }, hip = { wx: -Wd * .7, wy: ch.hipY - 18 };
  const mix = (a, b, u) => ({ wx: a.wx + (b.wx - a.wx) * u, wy: a.wy + (b.wy - a.wy) * u });
  let h0 = mix(hi, chest, stopSalt); h0 = mix(h0, { wx: -Wd * .12, wy: S + .02 * L + .1 * L * tug }, collar); h0 = mix(h0, hip, snap(f - 130, 10) * (1 - steady));
  h0 = mix(h0, { wx: Wd * .3 + .55 * L, wy: S - .78 * L }, steady);
  // near fist (R): fork up at the shoulder -> chin -> collar -> fork up -> saw at the cut (strokes) -> tongs: cut corner -> plate
  const baton = { wx: Wd * .55 + .2 * L, wy: S - .05 * L };
  let h1 = mix(baton, { wx: Wd * .15 + .12 * L, wy: S - .22 * L }, chin); h1 = mix(h1, { wx: Wd * .12, wy: S + .02 * L + .1 * L * tug }, collar);
  const saw = { wx: Wd * .3 + .6 * L + .06 * L * st, wy: S - .66 * L }; h1 = mix(h1, saw, sawUp);
  h1 = mix(h1, { wx: Wd * .3 + .6 * L, wy: S - .62 * L }, tongUp * (1 - tongDown)); h1 = mix(h1, { wx: Wd * .3 + .6 * L, wy: S + .12 * L }, tongDown);   // fix round: the plate is on the side table at his chest
  // fix round 2: hand_at targets (ch.tgt, card px) take the working fist: salt f0-62 (fist 0), saw f150-202 and tongs f205-218 at the cut, tongs at the plate f226+ (fist 1)
  if (ch.tgt) { const T = { wx: ch.tgt[0], wy: ch.tgt[1] };
    if (f < 76) h0 = mix(h0, T, 1 - snap(f - W.looked, 10));
    else { const w = f < 222 ? snap(f - 150, 10) * (1 - snap(f - 212, 8)) + 0 : snap(f - 224, 12); h1 = mix(h1, T, w); } }
  return { view, dir: 1, x: 0, y, rot, head, feet: [{ x: -26, lift: 0 }, { x: 26, lift: 0 }], farArmFront: false,
    hands: [{ ...h0, bow: .4 }, { ...h1, bow: .35, over: true }], held: [] }; }

// ---- OWNER m:ow_polish (3/4, far back at the propeller): the rag fist polishes the blade in small circles (4 stops a turn, each a 7 f snap, never a sine);
//   the other fist steadies the blade. f185 "whole": he sees the cut: a jolt (dip 7, head back 6), then polishes TWICE as fast (4 f snaps) in denial.
const RING = [[0, 0], [1, -.6], [0, -1.1], [-1, -.5]];
function owPolish(t, ch, view = 'front') { const f = F(t), S = ch.sh[1], L = ch.armL, Wd = ch.handX;
  const fast = f >= 190, per = fast ? 4 : 7, f0 = fast ? 190 : 0, k = Math.floor((f - f0) / per), u = snap((f - f0) - k * per, per);
  const a = RING[((k % 4) + 4) % 4], b = RING[(((k + 1) % 4) + 4) % 4], r = fast ? 14 : 10;
  const cx = Wd * .4 + .55 * L, cy = S + .1 * L;
  const jolt = snap(f - W.whole, 4) - snap(f - W.whole - 4, 10);
  return { view, dir: 1, x: 0, y: dip(f, W.whole, 7, 4), rot: -4 * jolt + (fast ? 3 : 1), head: -6 * jolt + 2,
    feet: [{ x: -28, lift: 0 }, { x: 26, lift: 0 }], farArmFront: true,
    hands: [{ wx: Wd * .2 + .5 * L, wy: S + .3 * L, bow: .4 }, { wx: cx + r * (a[0] + (b[0] - a[0]) * u), wy: cy + r * (a[1] + (b[1] - a[1]) * u), bow: .35, over: true }], held: [] }; }

const sty = (key, fn, blurb) => ({ key, name: key, blurb, pose: fn });
const STY = [sty('mi_hook', miHook, 'salts the wing tip, looks along the plane, thinks, LUNCH napkin snap, saws the tip, tongs the first bite to the plate'),
  sty('ow_polish', owPolish, 'polishes the propeller in circles, jolt on "whole", polishes faster')];
// camera-safe (LECONS 2026-11-22, S3): puppets.mjs draws `default` for side views and `front` for front / 3-4; the front style returns view 'front'
// (the kit turns a front drawing to 3/4 or back itself, camsafeView), so a front ask on "Lunch!" is no VIEW_MISMATCH
const STY_SIDE = [sty('mi_hook', (t, ch) => miHook(t, ch, 'side'), 'side drawing'), sty('ow_polish', (t, ch) => owPolish(t, ch, 'side'), 'side drawing')];
export default { title: 'PLANE-EATER S1: episode moves (side)', dur: N / 30, styles: STY_SIDE };
export const front = { title: 'PLANE-EATER S1: episode moves', dur: N / 30, styles: STY };
export const PLAN = {
  mi_hook: { who: 'michel', view: '34', strikes: [{ name: 'napkin tug "Lunch" f125', f0: 125, ch: 'h1y', to: 'max' }, { name: 'nod "bites" f235', f0: W.bites, ch: 'head', to: 'max' }],
    holds: [[141, 149, 'grin to the lens, dead still'], [249, N - 1, 'proud, dead still']], acting: [0, 246] },
  ow_polish: { who: 'owner', view: '34', strikes: [{ name: 'jolt "whole" f185', f0: W.whole, ch: 'head', to: 'min' }], holds: [], acting: [0, N - 1] },
};

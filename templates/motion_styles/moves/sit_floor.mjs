// SIT ON THE FLOOR, LEGS STRETCHED FORWARD (CB 2026-11-16: "how they look when sitting on floor and leg stretc forward to camera. on 3 d space").
// The bottom rests ON the floor (never in it); the legs lie along the floor toward where he faces.
// FRONT: the legs come straight at the lens, so they are short (foreshortened) and end in two big soles, toes up (as the lying "feet" drawing in char2d).
// 3/4: the legs come toward the lens and to the side he faces; the near sole big, the far one smaller.
// SIDE: the legs lie flat along the floor, heels down, toes up.
import { blinkAt, G } from '../rig.mjs';
const sin = Math.sin, loop = 5;
const Y = G - 640 - 4, HIP = 610 + Y;                       // body bottom on the floor line; hip height when sitting
const INK = '#2a1a1f';
const sole = (x, y, rx, ry, tilt = 0) => {                  // a sole facing the lens: black rim, dark grey sole, five toes on top, small light
  const toes = [-.62, -.3, 0, .3, .58].map((t, i) => `<circle cx="${(x + t * rx * .9).toFixed(1)}" cy="${(y - ry * .92 + Math.abs(t) * rx * .32).toFixed(1)}" r="${(rx * [.2, .22, .24, .26, .3][i]).toFixed(1)}" fill="${INK}"/>`).join('');
  return `<g transform="rotate(${tilt},${x},${y})">${toes}<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${INK}"/><ellipse cx="${x}" cy="${y + 7}" rx="${rx - 11}" ry="${ry - 13}" fill="#5b4c57"/><ellipse cx="${x - rx * .3}" cy="${y - ry * .4}" rx="${rx * .28}" ry="${ry * .15}" fill="#ffffff" opacity=".22"/></g>`;
};
const breathe = t => 2 * sin(t * 2.4);

// Rick's way (CB 2026-11-16, reference "What the Grave Bell Really Meant": "leg and feet dont have circle, and sit straight legs little up curve like your knee"):
// seen from the front the legs are two long plain ink lines from the hips toward the lens, slightly apart, with a soft knee bend; no soles, no foot circles.
const legF = (hx, kx, ex, b) => ({ pts: [[hx, HIP + b], [kx, HIP + 150], [ex, HIP + 300]], curve: true, over: true });
function frontPose(t0) { const t = t0 % loop, b = breathe(t);
  return { view: 'front', dir: 1, x: 0, y: Y + b, rot: 0,
    feet: [],   /* legs: legs3d below (3D ink on the floor) */
    hands: [{ lx: -128, ly: 1000, bow: .3 }, { lx: 128, ly: 1000, bow: .3 }], head: 0, face: 'k:standard', blink: blinkAt(t), cam: 0, camY: -230 }; }

function threeQ(t0) { const t = t0 % loop, b = breathe(t);
  return { view: '34', dir: 1, x: 0, y: Y + b, rot: 0,
    feet: [],
    hands: [{ lx: -110, ly: 1000, bow: .3 }, { lx: 120, ly: 995, bow: .3, behind: true }], head: 0, face: 'k:standard', blink: blinkAt(t), cam: 0, camY: -230 }; }

function side(t0) { const t = t0 % loop, b = breathe(t);
  // legs along the floor, the knee a little up (soft curve), heel on the floor, a small foot pointing up
  const leg = (dx, dy) => [[8 + dx, HIP + b + dy], [140 + dx, 968 + dy], [262 + dx, 1002 + dy], [276 + dx, 972 + dy]];
  return { view: 'side', dir: 1, x: 0, y: Y + b, rot: 0,
    feet: [],
    hands: [{ lx: -100, ly: 1000, bow: .3 }, { lx: -70, ly: 1000, bow: .3, behind: true }], head: 0, face: 'k:standard', blink: blinkAt(t), cam: 0, camY: -230 }; }

// IN THE 3D FILM the legs of a floor sit are NOT drawn on the card: they are two 3D ink tubes lying on the floor (legs3d), so every camera sees them
// in true perspective (from the front they come at the lens and shorten, from the side they lie flat). The card shows the body, arms and head only.
// Points in metres from the hips (x = to his left/right, y = up, z = toward where he faces); the knee is a little up; the second leg is the mirror (x -> -x).
export const legs3d = { r: .02, pts: [[.08, .06, .02], [.11, .16, .34], [.13, .03, .66], [.14, .1, .7]] };
const A_front = { key: 'A', name: 'Legs forward', blurb: 'sits on the floor, legs stretched forward (3D legs)', pose: frontPose };
// the kit picks the drawing by view: default = side, front = front and 3/4 (puppets.mjs moveOf)
export default { title: 'SIT ON THE FLOOR, LEGS FORWARD  ·  side', dur: loop, styles: [{ ...A_front, pose: side }] };
export const front = { title: 'SIT ON THE FLOOR, LEGS FORWARD  ·  front', dur: loop, styles: [A_front] };
// all three drawings side by side (for test_move3d.mjs)
export const views = { title: 'SIT ON THE FLOOR, LEGS FORWARD  ·  3 views', dur: loop, styles: [
  { key: 'A', name: 'Front', blurb: 'long legs toward the lens, soft knee', pose: frontPose },
  { key: 'B', name: '3/4', blurb: 'legs toward the lens and to his side', pose: threeQ },
  { key: 'C', name: 'Side', blurb: 'legs along the floor, knee a little up', pose: side },
] };

// EPISODE MOVE, plane-eater S2 (fix round 1, 2026-11-22): m:../../ep_s2a/mi_stand = Michel STANDING behind the pulled-out chair (S1's last state, (3.4, -1.45)),
// both fists on the chair back hoop, f257-261: a small polite bow toward the table (snap), then the act at 262 switches to the seated m:../../ep_s2/mi_table.
// Separate module because ep_s2 exports legs3d (3D seated legs for every style in it); this one draws standing feet.
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
function miStand(t, ch) { const f = Math.round(t * 30000) / 1000, b = snap(f - 257, 5);
  return { view: 'side', dir: 1, x: 0, y: 4 * b, rot: 6 * b, head: 4 * b, feet: [{ x: -22, lift: 0 }, { x: 22, lift: 0 }], farArmFront: true,
    hands: [{ f: .5, d: .55 + .05 * b, bow: .35 }, { f: .55, d: .5 + .05 * b, bow: .35, over: true }], held: [] }; }
const STY = [{ key: 'mi_stand', name: 'mi_stand', blurb: 'standing at the pulled-out chair, fists on the back hoop, small bow', pose: miStand }];
export default { title: 'PLANE-EATER S2: standing at the chair', dur: 520 / 30, styles: STY };
export const front = { title: 'PLANE-EATER S2: standing at the chair', dur: 520 / 30, styles: STY };

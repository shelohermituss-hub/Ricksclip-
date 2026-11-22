// EPISODE MOVES, plane-eater S4 (standing): m:../../ep_s4b/mi_clinic = Michel STANDING in the X-ray clinic behind the Doctor (row 23, 638-668):
// hands on his belly, two polite pats (646, 652), a small bow of the head, a calm "normal day" smile. m:../../ep_s4b/ow_stare = the OWNER (beard XL)
// standing at the empty plane cradle, rag hanging from the near hand, staring at Michel (rows 33-34, 880-942): dead still, one slow blink, head shake 925.
const F = t => Math.round(t * 30 * 1000) / 1000;
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
const dip = (f, f0, amp = 8, n = 4) => f > f0 && f < f0 + n ? amp * Math.sin(Math.PI * (f - f0) / n) : 0;
function miClinic(t, ch) { const f = F(t), p = dip(f, 646, 1, 4) + dip(f, 652, 1, 4), bow = snap(f - 656, 6) - snap(f - 664, 8);
  return { view: '34', dir: 1, x: 0, y: 3 * bow, rot: 3 * bow, head: 5 * bow, feet: [{ x: -22, lift: 0 }, { x: 22, lift: 0 }], farArmFront: true,
    hands: [{ f: .28, d: .78 - .06 * p, bow: .4, over: true }, { f: .34, d: .74 - .06 * p, bow: .4, over: true }], held: [] }; }
function owStare(t, ch) { const f = F(t) + 878, S = ch.sh[1], L = ch.armL, Wd = ch.handX, sh = f > 925 && f < 941 ? 4 * Math.sin((f - 925) * Math.PI / 5) : 0;
  return { view: '34', dir: -1, x: 0, y: 0, rot: -2, head: -2 + sh, feet: [{ x: -24, lift: 0 }, { x: 24, lift: 0 }], farArmFront: false,
    hands: [{ f: .1, d: .9, bow: .25 }, { f: .22, d: .84, bow: .25, over: true }], held: [] }; }
const STY = [{ key: 'mi_clinic', name: 'mi_clinic', blurb: 'standing behind the doctor, pats his belly politely', pose: miClinic },
  { key: 'ow_stare', name: 'ow_stare', blurb: 'owner standing at the empty cradle, rag down, staring', pose: owStare }];
export default { title: 'PLANE-EATER S4: standing', dur: 944 / 30, styles: STY };
export const front = { title: 'PLANE-EATER S4: standing', dur: 944 / 30, styles: STY };

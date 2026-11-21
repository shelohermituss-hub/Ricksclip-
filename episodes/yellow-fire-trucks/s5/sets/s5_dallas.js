// s5_dallas.js: S5 THE COUNT (frames 969-1202, plan rows 28-35, script lines 8-9), the DALLAS FIRE DEPT. STATION 14 yard at hot noon (NO light).
// S5 stretch builder 2026-11-21, BOARD round. Builds the shared set (sets/dallas.js, unchanged, LITE copy) and adds ONLY this stretch's story motion;
// no set or prop builder is edited (sets/, assets_prod/ are symlinked into s5/ because the render server serves the stretch folder only).
//   - "ran" (f992): both trucks roll out of their bays abreast and stop nose level (f1024) with a dip; wheels turn
//   - "four" (f1049, 1053, 1057): calendar leaves YEAR 1-3 drop off (YEAR 4 stays); cross plasters pop on the driver sides: three red, one lime
//   - red board 2 is dropped on and nailed (f1136-1141), board 3 + UP TO 3x (f1155-1160); a step stool (own prop) from f1126
//   - OWN sectioned ladder at the RIGHT edge of the red stack (the set ladder is switched off: boards.ladder false, it covers UP TO 3x in the set as built):
//     section A swings up against the stack on "hit" (f1144-1149), section B clacks on above it on "three" (f1157-1161)
//   - buildChalk: the Clerk's chalk stick (held3d)
import { build as dallasBuild } from './dallas.js';
import { buildProp2 } from './assets.js';
const sm = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
const ring = (f, f0, amp, n = 10) => f > f0 && f < f0 + n ? amp * Math.exp(-(f - f0) / 3) * Math.sin((f - f0) * 2.1) * (1 - (f - f0) / n) : 0;
const Z = .12;                                             // the apron top (dallas_meta anchors)
export const S5 = { LX: -.1, LY0: 6.95, LY1: 8.33, LTOP: 7.5, STOOL: [-.2, 7.45, Z], ROLL0: 992, ROLL1: 1024, B2: 1136, B3: 1155, LA: 1144, LB: 1157, STOOLF: 1126 };
export const ladderY = z => S5.LY0 + (S5.LY1 - S5.LY0) * (z - Z) / (S5.LTOP - Z);   // the ladder's plan y at height z (it leans north onto the stack)

export function buildChalk(THREE) {   // a used stick of white chalk, 7 cm, one worn end
  const g = new THREE.Group(); g.name = 's5_chalk';
  const m = new THREE.MeshStandardMaterial({ color: '#f4f2ea', roughness: .95 });
  const c = new THREE.Mesh(new THREE.CylinderGeometry(.0075, .0085, .07, 10), m); c.rotation.z = Math.PI / 2; g.add(c);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(.0076, 8, 6), m); tip.position.x = .035; tip.scale.set(.6, 1, 1); g.add(tip);
  return { group: g, grip: new THREE.Vector3(-.01, 0, 0), tip: new THREE.Vector3(.04, 0, 0) };
}
function bar(THREE, mat, p0, p1, w, d) {          // a box from p0 to p1 (three.js points)
  const v = p1.clone().sub(p0), L = v.length(), m = new THREE.Mesh(new THREE.BoxGeometry(w, L, d), mat);
  m.position.copy(p0).add(p1).multiplyScalar(.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.normalize()); m.castShadow = m.receiveShadow = true; return m;
}
function ladderSection(THREE, V, z0, z1, mats) {   // aluminium rails with a chipped orange top cap, ribbed rungs every 0.30 m
  const g = new THREE.Group(); const xs = [S5.LX - .22, S5.LX + .22];
  for (const x of xs) { g.add(bar(THREE, mats.al, V([x, ladderY(z0) - .06, z0]), V([x, ladderY(z1) - .06, z1]), .055, .025));
    const cap = bar(THREE, mats.cap, V([x, ladderY(z1 - .12) - .06, z1 - .12]), V([x, ladderY(z1) - .06, z1]), .06, .03); g.add(cap); }
  for (let z = Math.ceil((z0 + .05 - Z) / .3) * .3 + Z; z < z1 - .05; z += .3) g.add(bar(THREE, mats.rung, V([xs[0], ladderY(z) - .06, z]), V([xs[1], ladderY(z) - .06, z]), .035, .035));
  return g;
}
function stool(THREE, V) {                          // a two-step wooden step stool, worn paint, 42 cm
  const g = new THREE.Group(), w = new THREE.MeshStandardMaterial({ color: '#8a6a44', roughness: .7 }), top = new THREE.MeshStandardMaterial({ color: '#5d4a36', roughness: .8 });
  const box = (sx, sy, sz, x, y, z, m) => { const b = new THREE.Mesh(new THREE.BoxGeometry(sx, sz, sy), m); b.position.copy(V([x, y, z])); b.castShadow = b.receiveShadow = true; g.add(b); };
  const [x, y] = S5.STOOL; box(.42, .34, .03, x, y, Z + .42, top); box(.42, .16, .03, x, y - .2, Z + .21, top);
  for (const dx of [-.19, .19]) { box(.025, .5, .42, x + dx, y - .05, Z + .21, w); }
  return g;
}
export async function build(THREE, scene, film, ctx) {
  const D = await dallasBuild(THREE, scene, film, ctx);
  const V = p => ctx.B2T(p), A = D.anchors, red = D.red, lime = D.lime, N = D.nodes;
  // ---- the ladder (own prop, right edge of the red stack) and the stool
  const mats = { al: new THREE.MeshStandardMaterial({ color: '#b9bcc0', roughness: .35, metalness: .8 }), rung: new THREE.MeshStandardMaterial({ color: '#9ea2a7', roughness: .45, metalness: .7 }),
    cap: new THREE.MeshStandardMaterial({ color: '#c8642a', roughness: .6 }) };
  const secA = ladderSection(THREE, V, Z, 4.1, mats), secB = ladderSection(THREE, V, 3.6, S5.LTOP, mats); scene.add(secA, secB);
  const pivot = V([S5.LX, S5.LY0, Z]), axis = V([S5.LX, S5.LY1, S5.LTOP]).sub(pivot).normalize();
  const st = stool(THREE, V); scene.add(st);
  // ---- plasters (props-hero plaster.glb on the truck's own anchors plaster_1..3, driver side)
  const pl = [];
  for (const [T, k] of [[red, 1], [red, 2], [red, 3], [lime, 1]]) { if (!T) continue; const a = T.anchors['plaster_' + k]; if (!a) { console.warn('S5: no plaster_' + k); continue; }
    const P = await buildProp2(THREE, 'plaster'); P.group.position.copy(a); P.group.scale.setScalar(1.6); T.group.add(P.group); pl.push(P.group); }
  // ---- remember the dropped-on parts' rest positions
  const base = new Map(); for (const k of ['stack2', 'stack3', 'cal1', 'cal2', 'cal3']) for (const o of N[k]) base.set(o, o.position.clone());
  const drop = (k, f0, f, h = .9) => { const u = snap(f - f0, 5); for (const o of N[k]) { o.visible = f >= f0; o.position.copy(base.get(o)); o.position.y += h * (1 - u) + ring(f, f0 + 5, -.03, 8); } };
  const leaf = (k, f0, f) => { const u = sm((f - f0) / 14); for (const o of N[k]) { o.visible = f < f0 + 14; const b = base.get(o); o.position.set(b.x + .35 * u, b.y - 1.9 * u * u, b.z + .25 * Math.sin(u * 5)); } };
  function update(f) {
    // the paint frame workaround (assets.js not edited; s1_yard.js, LECONS_TECHNIQUES.md 2026-11-20): uInvRoot every frame for both trucks
    for (const T of [red, lime]) { if (!T) continue; const m0 = T.group.getObjectByProperty('isMesh', true); if (m0 && m0.onBeforeRender) m0.onBeforeRender(null, scene); }
    // "ran": out of the bays (noses at y ~ 15.2 inside) to nose level, eased, a small nose dip on the stop
    const u = sm((f - S5.ROLL0) / (S5.ROLL1 - S5.ROLL0)), dy = 7.1 * (1 - u);
    for (const [T, a] of [[red, A.truck_red], [lime, A.truck_lime]]) { if (!T) continue; T.group.position.copy(V([a[0], a[1] + dy, a[2]])); T.setWheels(7.1 * u);
      T.group.rotation.z = ring(f, S5.ROLL1 - 2, .012, 10); }
    // calendar leaves on "four", plasters pop with them
    leaf('cal1', 1049, f); leaf('cal2', 1053, f); leaf('cal3', 1057, f);
    pl.forEach((p, i) => { const f0 = 1050 + 4 * i, s = snap(f - f0, 4); p.visible = f >= f0; p.scale.setScalar(1.6 * (s + ring(f, f0 + 3, .35, 8))); });
    // the red stack grows; the stool; the ladder sections
    drop('stack2', S5.B2, f); drop('stack3', S5.B3, f, 1.1);
    st.visible = f >= S5.STOOLF; st.position.set(0, .5 * (1 - snap(f - S5.STOOLF, 4)), 0);
    const a = (1 - snap(f - S5.LA, 6)) * 1.1 + ring(f, S5.LA + 6, .02, 8);     // swings up from lying back, hits the stack
    secA.visible = f >= S5.LA - 2; secA.position.set(0, 0, 0); secA.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), a); secA.position.copy(pivot).sub(pivot.clone().applyQuaternion(secA.quaternion));
    const b = 1 - snap(f - S5.LB, 4); secB.visible = f >= S5.LB; secB.quaternion.copy(secA.quaternion); secB.position.copy(secA.position).addScaledVector(axis, -3.3 * b + ring(f, S5.LB + 4, .04, 8));
  }
  return { anchors: { ...A, ladder_x: [S5.LX, S5.LY0, Z] }, update };
}

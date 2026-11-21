// s2_shop.js: S2 THE SECRET (frames 288-474, plan rows 9-13, script lines 3-4), the eye doctor's shop in Pine Hollow, MORNING (window daylight + the
// amber eye lamp). S2 stretch builder 2026-11-21, BOARD round. It builds the shared town set (sets/town.js, unchanged, LITE copy) and adds ONLY this
// stretch's story things; no set or prop builder is edited (sets/, assets_prod/ are symlinked into s2/ because the render server serves the film folder only).
//   - the station truck in bay 1 is now FINISHED lemon (time has passed since S1; places.<name>.hero opts)
//   - a bentwood COAT STAND inside, beside the exam chair: one white coat left on it (he wears the other), his black fire helmet lands on its top hook
//     on "second" (f328, the same frame the card swaps from the yard outfit to the shop outfit)
//   - the EYE LAMP beside the chair: a clone of the set's own desk lamp asset (desk_lamp_arm_01, Poly Haven CC0) on a small instrument table, with its
//     amber cone (spot light + a faint visible cone); the toy truck stands on the table until he picks it up (f405)
//   - the toy truck in his fist (held3d buildToyTruck below): it dulls when he carries it out of the cone on "strange" (f436-446) and is red again in it
import { build as townBuild } from './town.js';
import { GLTFLoader } from '../assets_prod/vendor/GLTFLoader.js';
const sm = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
// story positions (plan metres, Z up), shared with make_film.py (keep in step). Shop floor top z 0.15.
const Z = .15;
export const S2 = { hero: [1.2, -11.5, Z], stand: [2.2, -12.3, Z], table: [0.45, -11.2, Z], CHANGE: 328, PICK: 405, OUT0: 436, OUT1: 446 };
const RED = '#D3141C', DULL = '#5a3a40';

// ---- the toy truck: the light truck asset (assets_prod/out/truck_light.glb, robinmikart CC BY 4.0) as an 18 cm pressed-tin miniature
const TOY = await new GLTFLoader().loadAsync(new URL('../assets_prod/out/truck_light.glb', import.meta.url).href);
const PARTOF = o => { let p = o; while (p) { if (p.userData && p.userData.phfd_part === 'ribbon') return 'ribbon'; p = p.parent; } return ''; };
let toyPaint = null;
export function buildToyTruck(THREE, opts = {}) {
  const g = new THREE.Group(); g.name = 's2_toy_truck'; const s = TOY.scene.clone(true); g.add(s);
  const k = (opts.length || .18) / 7.59; s.scale.setScalar(k);
  const paint = new THREE.MeshPhysicalMaterial({ color: RED, roughness: .32, metalness: .15, clearcoat: 1, clearcoatRoughness: .08 }); paint.name = 'toy_tin_red';
  s.traverse(o => { if (!o.isMesh) return; o.castShadow = !opts.inHand; o.receiveShadow = true; if (PARTOF(o) === 'ribbon' || /^anchor_/.test(o.name)) { o.visible = false; return; }
    const nm = o.material && o.material.name || ''; if (nm === 'body_paint') o.material = paint; else if (nm === 'letters_gold') o.visible = false; });
  if (!opts.inHand) toyPaint = toyPaint || paint; else toyPaint = paint;
  g.userData.paint = paint;
  // grip under the middle of the chassis (the fist holds it wheels down), tip = the cab roof
  return { group: g, grip: new THREE.Vector3(0, -.004, 0), tip: new THREE.Vector3(-.06, .07, 0), paint };
}

function coatStand(THREE) {
  const g = new THREE.Group(); g.name = 's2_coat_stand';
  const wood = new THREE.MeshStandardMaterial({ color: '#5e3a20', roughness: .45 }), brass = new THREE.MeshStandardMaterial({ color: '#c9a24a', roughness: .25, metalness: 1 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.025, .032, 1.82, 14), wood); pole.position.y = .91; g.add(pole);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(.045, 14, 10), wood); knob.position.y = 1.84; g.add(knob);
  for (let i = 0; i < 3; i++) { const a = i * 2.094, leg = new THREE.Mesh(new THREE.CylinderGeometry(.018, .02, .48, 8), wood); leg.position.set(Math.cos(a) * .17, .1, Math.sin(a) * .17); leg.rotation.set(Math.sin(a) * 1.15, 0, -Math.cos(a) * 1.15); g.add(leg);
    const foot = new THREE.Mesh(new THREE.SphereGeometry(.022, 8, 6), brass); foot.position.set(Math.cos(a) * .36, .02, Math.sin(a) * .36); g.add(foot); }
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + .4, hook = new THREE.Mesh(new THREE.TorusGeometry(.06, .009, 6, 12, Math.PI * 1.2), brass); hook.position.set(Math.cos(a) * .05, 1.7, Math.sin(a) * .05); hook.rotation.set(0, -a, Math.PI / 2); g.add(hook); }
  // the white coat left on it (short clinic coat, collar and two pockets)
  const cloth = new THREE.MeshStandardMaterial({ color: '#f2f0ea', roughness: .9 }), seam = new THREE.MeshStandardMaterial({ color: '#c9c6bd', roughness: .9 });
  const coat = new THREE.Mesh(new THREE.CylinderGeometry(.13, .24, .92, 18, 1, true, -2.4, 4.8), cloth); coat.material.side = THREE.DoubleSide; coat.position.set(.07, 1.17, 0); coat.rotation.y = Math.PI; g.add(coat);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(.11, .025, 8, 16), cloth); collar.position.set(.07, 1.63, 0); collar.rotation.x = Math.PI / 2; g.add(collar);
  for (const dz of [-.1, .1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(.012, .12, .1), seam); p.position.set(.07 + .235, .9, dz); g.add(p); }
  return g;
}
function fireHelmet(THREE) {   // black leather helmet, long rear brim, brass eagle + front shield "1" (PROPS line "Fire helmet"); hangs on the stand from f328
  const g = new THREE.Group(); g.name = 's2_helmet';
  const blk = new THREE.MeshStandardMaterial({ color: '#1d1b20', roughness: .35, metalness: .1 }), brass = new THREE.MeshStandardMaterial({ color: '#c49a40', roughness: .3, metalness: 1 });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(.13, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), blk); dome.scale.set(1, .85, 1.15); g.add(dome);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .012, 24), blk); brim.scale.set(1, 1, 1.45); brim.position.set(0, 0, -.06); g.add(brim);
  const shield = new THREE.Mesh(new THREE.BoxGeometry(.075, .09, .01), blk); shield.position.set(0, .07, .155); shield.rotation.x = -.35; g.add(shield);
  const eagle = new THREE.Mesh(new THREE.ConeGeometry(.025, .05, 6), brass); eagle.position.set(0, .135, .14); g.add(eagle);
  return g;
}

export async function build(THREE, scene, film, ctx) {
  const T = await townBuild(THREE, scene, film, ctx);
  const V = p => ctx.B2T(p), hero = T.hero;
  // ---- coat stand + helmet
  const stand = coatStand(THREE); stand.position.copy(V(S2.stand)); stand.rotation.y = .3; scene.add(stand);
  const helmet = fireHelmet(THREE); helmet.position.copy(V([S2.stand[0] - .02, S2.stand[1], Z + 1.79])); helmet.rotation.set(.25, 2.4, 0); scene.add(helmet);
  // ---- instrument table + the eye lamp (clone of the set's desk lamp asset)
  const wood = new THREE.MeshStandardMaterial({ color: '#7A4B2A', roughness: .5 });
  const top = new THREE.Mesh(new THREE.BoxGeometry(.5, .04, .42), wood); top.position.copy(V([S2.table[0], S2.table[1], Z + .74])); top.castShadow = top.receiveShadow = true; scene.add(top);
  for (const [dx, dy] of [[-.21, -.17], [.21, -.17], [-.21, .17], [.21, .17]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(.017, .014, .72, 8), wood); l.position.copy(V([S2.table[0] + dx, S2.table[1] + dy, Z + .36])); l.castShadow = true; scene.add(l); }
  let orig = null; scene.traverse(o => { if (!orig && /^desk_lamp_arm_01/.test(o.name)) orig = o; }); let lampHead = V([S2.table[0], S2.table[1], Z + 1.32]);
  if (orig) { const lamp = orig.clone(true); lamp.name = 's2_eye_lamp'; orig.updateWorldMatrix(true, false); lamp.position.copy(V([S2.table[0] - .1, S2.table[1] + .05, Z + .76])); lamp.rotation.copy(orig.rotation); lamp.rotateY((film.places && ctx.place && ctx.place.lamp_yaw || 160) * Math.PI / 180); scene.add(lamp); }
  else console.warn('S2: desk_lamp_arm_01.000 not found in the town GLB');
  const cone = new THREE.SpotLight('#ffb35a', 26, 3.2, .62, .55, 2); cone.position.copy(lampHead); const tgt = new THREE.Object3D(); tgt.position.copy(V([S2.table[0] + .45, S2.table[1] - .15, Z + 1.05])); scene.add(tgt); cone.target = tgt; cone.castShadow = false; scene.add(cone);
  const cg = new THREE.ConeGeometry(.42, .9, 24, 1, true); cg.translate(0, -.45, 0);
  const cm = new THREE.Mesh(cg, new THREE.MeshBasicMaterial({ color: '#ffc070', transparent: true, opacity: .07, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, fog: false }));
  cm.position.copy(lampHead); cm.lookAt(tgt.position); cm.rotateX(-Math.PI / 2); cm.renderOrder = 6; scene.add(cm);
  // ---- the toy on the table until he picks it up
  const toyT = buildToyTruck(THREE, {}); toyT.group.position.copy(V([S2.table[0] + .1, S2.table[1] - .08, Z + .76])); toyT.group.rotation.y = 2.2; scene.add(toyT.group);
  function update(f) {
    // the light-truck paint frame workaround (assets.js not edited; see s1_yard.js and LECONS_TECHNIQUES.md): set uInvRoot every frame for both trucks
    for (const tk of [hero, T.chief]) { if (!tk) continue; const m0 = tk.group.getObjectByProperty('isMesh', true); if (m0 && m0.onBeforeRender) m0.onBeforeRender(null, scene); }
    helmet.visible = f >= S2.CHANGE; toyT.group.visible = f < S2.PICK;
    // the held toy dulls out of the cone on "strange" (its own paint, never a frame grade)
    const out = sm((f - S2.OUT0) / 4) - sm((f - S2.OUT1) / 5);
    scene.traverse(o => { if (o.name === 's2_toy_truck' && o.userData.paint && o !== toyT.group) o.userData.paint.color.set(RED).lerp(new THREE.Color(DULL), out); });
  }
  return { anchors: { ...T.anchors, lamp_head: [S2.table[0], S2.table[1], Z + 1.32] }, update };
}

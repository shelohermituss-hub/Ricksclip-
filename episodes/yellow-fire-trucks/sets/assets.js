// assets.js: the PRODUCTION downloaded assets in the three.js kit (props-hero 2026-11-20). The SAME GLBs that assets_prod/build_assets.sh writes next to
// the .blend files the final Blender render uses, so staging and final agree. Credits: assets/ASSETS.md (CC-BY 4.0: robinmikart, Oleksii.Rozumnyi, TheAlex).
//   const T = await buildTruck(THREE, ctx, { paint: 'half', edge: .3, drain: 0, masking: true, letters: 'under', ribbon: true, wear: .6 });
//   place(THREE, scene, ctx, T, [x, y, 0], yawDeg);  T.setPaint({ edge, drain, paint, masking, letters, ribbon });  T.setWheels(metres);  T.setBeacon(on, deg);
//   T.setDoor(deg);  T.setBell(deg);  T.anchors.{cab_door, door_handle, pump_panel, rear_step, bell, beacon, nose, ribbon_bow} (truck-local Vector3, three axes)
//   film.json held3d: { obj: 'spray_gun', module: 'sets/assets.js', builder: 'buildSprayGun', grip: 'handle', anchor: 'grip', tip: 'tip', scale: 1 }
//   const C = buildCompressor(THREE, ctx);  const H = buildAirHose(THREE, ctx, { from: [x, y, z], to: [x, y, z] })   (three-space points, Y up)
// Frame (truck): metres, front -X, driver's side +Z (Blender -Y), Y up, origin on the ground. Gun: nozzle +X, Y up, origin = grip. Compressor: origin on the ground.
// The paint rules are the GLSL twin of assets_prod/scripts/paint_nodes.py (same constants; the noise functions differ, so the speckle pattern is not pixel-equal).
import { GLTFLoader } from '../assets_prod/vendor/GLTFLoader.js';
import { place as placeProp, kit } from './prop_kit.js';
export const place = placeProp;
const DIR = new URL('../assets_prod/out/', import.meta.url).href;   // sets/ and assets_prod/ are siblings in the episode folder
export const COLORS = { red: '#D3141C', lemon: '#E3EA22', dusk: '#4B4753', roof: '#F3EFE2', soot: '#2b2521', primer: '#7d7a74' };
const PAINT_GLSL = `
uniform vec3 uColA, uColB; uniform float uEdge, uDrain, uDrainA, uDrainB, uWear, uRoofOn, uUnder; uniform sampler2D uWearMap;
varying vec3 vRP; varying vec3 vRN;
float h31(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float vnoise(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fbm(vec3 p){ float a = .5, s = 0.; for (int i = 0; i < 5; i++) { s += a * vnoise(p); p *= 2.; a *= .5; } return s / .97; }
vec3 lin3(vec3 c){ return c; }
// P, N in the truck's Blender frame (x front -, y driver -, z up)
void phfdPaint(vec3 P, vec3 N, out vec3 col, out float rough, out float cover){
  float ks = (P.x - uEdge) / .38 + sin(P.y * 2.6 - P.z * 1.3) * .22 + (fbm(P * 1.6) - .5) * .5;
  float t = smoothstep(-1., 1., ks);
  vec3 c = floor(P * 110.); vec3 o = vec3(h31(c), h31(c + 17.1), h31(c + 3.7)); float vd = length(fract(P * 110.) - o) ;
  float band = clamp(1. - max(-ks, 0.) / 2.2, 0., 1.); float dots = step(vd, band * .34);
  // runs (round 2, same constants as paint_nodes.py RUN_*): 9 columns per metre, 65 % carry a run 30-90 cm long, 3.5 cm wide with a 7.5 cm bead, 0.2-1.1 m ahead of the edge
  float colx = floor(P.x * 9.), side = sign(P.y); float hv = h31(vec3(colx, side, 0.)), h0 = h31(vec3(colx, side, 1.)), h1 = h31(vec3(colx, side, 2.));
  float on = step(.35, hv), fx = abs(fract(P.x * 9.) - .5);
  float zs = .8 + h0 * .8, ze = zs - (.3 + h1 * .6), bead = clamp(1. - abs(P.z - ze) / .035, 0., 1.), width = .16 + bead * .18;
  float nearE = step(P.x, uEdge - .2) * step(uEdge - 1.1, P.x), inz = step(P.z, zs) * step(ze - .02, P.z);
  float run = on * step(fx, width) * nearE * inz;
  cover = max(t, max(dots, run));
  vec3 A = mix(uColA, ${'DUSKV'}, uDrain * uDrainA), B = mix(uColB, ${'DUSKV'}, uDrain * uDrainB);
  vec3 cc = mix(A, B, cover);
  float roof = step(2.12, P.z) * step(P.x, -.80) * uRoofOn; cc = mix(cc, ${'ROOFV'}, roof);
  vec3 w = pow(abs(N), vec3(4.)); w /= (w.x + w.y + w.z + 1e-5); vec3 q = P * .5;
  vec3 wm = texture2D(uWearMap, q.yz).rgb * w.x + texture2D(uWearMap, q.xz).rgb * w.y + texture2D(uWearMap, q.xy).rgb * w.z;
  float soot = wm.r * (1. - smoothstep(.25, 1., P.z)) * uWear * .7, stain = wm.g * step(P.z, 1.9) * uWear * .55, chips = step(.5, wm.b) * step(P.z, .9) * uWear * .8;
  vec3 lighter = 1. - (1. - cc) * (1. - .35 * vec3(.55, .53, .5));
  cc = mix(cc, lighter, stain); cc = mix(cc, ${'SOOTV'}, soot); cc = mix(cc, ${'PRIMV'}, chips);
  col = cc; rough = .26 + stain * .3 + soot * .45; }
`;
function glslVec(THREE, h) { const c = new THREE.Color(h); return `vec3(${c.r.toFixed(5)}, ${c.g.toFixed(5)}, ${c.b.toFixed(5)})`; }
function paintPatch(THREE, mat, U, kind) {
  mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    const src = PAINT_GLSL.replace(/DUSKV/g, glslVec(THREE, COLORS.dusk)).replace(/ROOFV/g, glslVec(THREE, COLORS.roof)).replace(/SOOTV/g, glslVec(THREE, COLORS.soot)).replace(/PRIMV/g, glslVec(THREE, COLORS.primer)).replace(/\$\{'(\w+)'\}/g, '$1');
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform mat4 uInvRoot; varying vec3 vRP; varying vec3 vRN;')
      .replace('#include <project_vertex>', '#include <project_vertex>\n{ vec4 rp = uInvRoot * modelMatrix * vec4(transformed, 1.); vRP = vec3(rp.x, -rp.z, rp.y); vec3 rn = mat3(uInvRoot * modelMatrix) * objectNormal; vRN = normalize(vec3(rn.x, -rn.z, rn.y)); }');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + src);
    if (kind === 'paint') sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\nvec3 pCol; float pRough, pCov; phfdPaint(vRP, vRN, pCol, pRough, pCov); diffuseColor.rgb = pCol;')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = pRough;');
    else sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n{ vec3 pc; float pr, pv; phfdPaint(vRP, vRN, pc, pr, pv); diffuseColor.a *= 1. - uUnder * pv; }');
  };
  mat.customProgramCacheKey = () => 'phfd_' + kind;
}
function triplanarPatch(mat, U, scale) {
  mat.onBeforeCompile = sh => { Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform mat4 uInvRoot; varying vec3 vRP; varying vec3 vRN;')
      .replace('#include <project_vertex>', `#include <project_vertex>\n{ vec4 rp = uInvRoot * modelMatrix * vec4(transformed, 1.); vRP = rp.xyz; vRN = normalize(mat3(uInvRoot * modelMatrix) * objectNormal); }`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform sampler2D uPaper; varying vec3 vRP; varying vec3 vRN;')
      .replace('#include <map_fragment>', `{ vec3 w = pow(abs(vRN), vec3(4.)); w /= (w.x + w.y + w.z + 1e-5); vec3 q = vRP / ${scale.toFixed(3)};
        vec4 tx = texture2D(uPaper, q.zy) * w.x + texture2D(uPaper, q.xz) * w.y + texture2D(uPaper, q.xy) * w.z; diffuseColor.rgb *= tx.rgb; }`); };
  mat.customProgramCacheKey = () => 'phfd_paper';
}
const loader = () => new GLTFLoader();
const TRUCK_GLTF = {};
async function truckGltf(light) { const f = light ? 'truck_light.glb' : 'truck.glb'; return TRUCK_GLTF[f] ||= await loader().loadAsync(DIR + f); }
const TEXC = {}; const tex = (THREE, f, srgb) => TEXC[f] ||= new THREE.TextureLoader().loadAsync(DIR + f).then(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; return t; });
const PART = o => (o.userData && o.userData.phfd_part) || '';

export async function buildTruck(THREE, ctx = {}, opts = {}) {
  // round 2 opts: light (the ~35 k tris truck_light.glb: rows of trucks, Dallas, toy), letters ('truck_letters' | '_e2' | '_dal14' | '_dal22'), age (0..1),
  // sirens (0..4), beaconRow, priceCard (hero only; absent from the light file)
  const gl = await truckGltf(!!opts.light), group = new THREE.Group(); group.name = 'phfd_truck';
  const s = gl.scene.clone(true); group.add(s);
  const [wearMap, paper, kraft] = await Promise.all([tex(THREE, 'wear.png', false), tex(THREE, 'newspaper.png', true), tex(THREE, 'kraft.png', true)]);   // awaited: a still rendered before the load showed black paper
  const U = { uColA: { value: new THREE.Color(COLORS.red) }, uColB: { value: new THREE.Color(COLORS.red) }, uEdge: { value: 99 }, uDrain: { value: 0 }, uDrainA: { value: 1 }, uDrainB: { value: 1 },
    uWear: { value: opts.wear ?? .6 }, uRoofOn: { value: 1 }, uUnder: { value: 0 }, uWearMap: { value: wearMap }, uInvRoot: { value: new THREE.Matrix4() }, uPaper: { value: paper } };
  const mats = {}, masked = [], ribbon = [], nodes = {}, anchors = {}; let tris = 0;
  s.traverse(o => {
    if (o.name) nodes[o.name] = o;
    if (o.name && o.name.startsWith('anchor_')) anchors[o.name.slice(7)] = o;
    if (!o.isMesh) return; o.castShadow = o.receiveShadow = true; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    const m = o.material, nm = m.name;
    if (nm === 'body_paint') { o.material = mats.paint ||= (() => { const k = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .3, clearcoat: 1, clearcoatRoughness: .05, normalMap: m.normalMap || null }); k.name = 'body_paint'; paintPatch(THREE, k, U, 'paint'); return k; })(); }
    else if (nm === 'letters_gold') { o.material = mats.letters ||= (() => { const k = m.clone(); k.transparent = true; k.depthWrite = false; k.polygonOffset = true; k.polygonOffsetFactor = -2; paintPatch(THREE, k, U, 'letters'); return k; })(); o.renderOrder = 2; }
    if (o.userData.mask || (o.parent && o.parent.userData && o.parent.userData.mask)) masked.push([o, o.material]);
    let p = o; while (p && p !== s) { if (PART(p) === 'ribbon') { ribbon.push(o); break; } p = p.parent; }
  });
  const paperMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .85 }); triplanarPatch(paperMat, U, 1.2);   // newspaper tile 1.2 m (round 2)
  const kraftMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .9 }); triplanarPatch(kraftMat, { ...U, uPaper: { value: kraft } }, .6);   // mask 2 = tyres
  kraftMat.customProgramCacheKey = () => 'phfd_paper_k';
  const glbMats = []; s.traverse(o => { if (o.isMesh && !Object.values(mats).includes(o.material)) glbMats.push(o.material); });
  // the kit hands its studio reflection to its own pbr materials only: share it with the GLB's on the first frame (else chrome reads black, asset test)
  let envDone = false; const giveEnv = scene => { if (envDone || !scene) return; let env = null; scene.traverse(o => { if (!env && o.isMesh && o.material && o.material.envMap && !glbMats.includes(o.material)) env = o.material.envMap; });
    if (env) { for (const m of [...new Set([...glbMats, ...Object.values(mats), paperMat])]) if (!m.envMap) { m.envMap = env; m.envMapIntensity = .9; m.needsUpdate = true; } envDone = true; } };
  const any = s.getObjectByProperty('isMesh', true); const inv = U.uInvRoot.value;
  any.onBeforeRender = (r, scene) => { group.updateMatrixWorld(); inv.copy(group.matrixWorld).invert(); giveEnv(scene); };
  const state = {};
  function setPaint(o = {}) {
    Object.assign(state, o); const st = state.paint || 'red', A = state.a || (st === 'lemon' ? COLORS.lemon : COLORS.red), B = state.b || (st === 'red' ? COLORS.red : COLORS.lemon);
    U.uColA.value.set(A); U.uColB.value.set(B); U.uEdge.value = st === 'half' ? (state.edge ?? .3) : (st === 'lemon' ? -99 : 99);
    U.uDrain.value = state.drain ?? 0; U.uDrainA.value = A.toUpperCase() === COLORS.red ? 1 : 0; U.uDrainB.value = B.toUpperCase() === COLORS.red ? 1 : 0;
    U.uWear.value = state.wear ?? .6; U.uUnder.value = state.letters === 'under' ? 1 : 0; U.uRoofOn.value = state.roof === false ? 0 : 1;
    for (const [m, orig] of masked) m.material = state.masking ? ((m.userData.mask || (m.parent && m.parent.userData.mask)) === 2 ? kraftMat : paperMat) : orig;
    for (const r of ribbon) r.visible = !!state.ribbon;
  }
  const wheels = ['wheel_FL', 'wheel_FR', 'wheel_RL', 'wheel_RR'].map(n => nodes[n]).filter(Boolean);
  const setWheels = m => { for (const w of wheels) w.rotation.z = m / (w.userData.radius || .5); };          // rolls toward -X for positive metres
  const domes = [], row = []; s.traverse(o => { if (!o.isMesh) return; if (PART(o) === 'beacon_dome') { o.material = o.material.clone(); domes.push(o.material); }
    if (PART(o) === 'beacon_row_dome') { o.material = o.material.clone(); row.push([o.material, +((o.parent && o.parent.name.match(/(\d+)/) || [0, 0])[1])]); } });
  // wave: null = the whole row steady; a number (radians) = the running pulse of plan row 18 (beacon k peaks at wave = .9 k), as truck_api.set_beacon
  const setBeacon = (on = true, deg = 0, wave = null) => { if (nodes.beacon) nodes.beacon.rotation.y = deg * Math.PI / 180; for (const m of domes) { m.emissive = new THREE.Color('#ff1a10'); m.emissiveIntensity = on ? 3 : 0; }
    for (const [m, k] of row) { m.emissive = new THREE.Color('#ff1a10'); m.emissiveIntensity = on ? 4 * (wave == null ? 1 : Math.max(0, Math.cos(wave - .9 * k)) ** 2) : 0; }
    for (let k = 1; k <= 5; k++) if (nodes['beacon_row_' + k]) nodes['beacon_row_' + k].rotation.y = (deg + 47 * k) * Math.PI / 180; };
  const setExtras = ({ sirens = 4, beaconRow = true, priceCard } = {}) => { for (let k = 1; k <= 4; k++) if (nodes['siren_' + k]) nodes['siren_' + k].visible = k <= sirens;
    if (nodes.beacon_bar) nodes.beacon_bar.visible = !!beaconRow; if (nodes.price_card && priceCard != null) nodes.price_card.visible = !!priceCard; };
  const letterMats = Object.values(mats).filter(m => m.name !== 'body_paint');
  const setLetters = async (which = 'truck_letters') => { const t = await tex(THREE, which + '.png', true); t.flipY = false; for (const m of letterMats) { m.map = t; m.needsUpdate = true; } };
  const setAge = (age = 1) => { s.traverse(o => { if (!o.isMesh || Object.values(mats).includes(o.material) || o.material.metalness < .5 || o.userData.phfdOld) return;
    o.material = o.material.clone(); o.userData.phfdOld = 1; o.material.roughness = Math.min(.6, o.material.roughness + .22 * age); o.material.color.multiply(new THREE.Color(1 - .25 * age, 1 - .3 * age, 1 - .42 * age)); }); U.uWear.value = .6 + .4 * age; };
  const setDoor = deg => { if (nodes.door_driver) nodes.door_driver.rotation.y = -deg * Math.PI / 180; };  // opens outward (+Z, the driver's side)
  const setBell = deg => { if (nodes.bell_swing) nodes.bell_swing.rotation.z = -deg * Math.PI / 180; };
  setPaint({ paint: 'red', masking: false, letters: 'over', ribbon: false, ...opts }); setBeacon(!!opts.beacon, 0);
  setExtras({ sirens: opts.sirens ?? 4, beaconRow: opts.beaconRow ?? true, priceCard: opts.priceCard ?? true });
  if (opts.letters_set) await setLetters(opts.letters_set); if (opts.age) setAge(opts.age);
  group.updateMatrixWorld(true);
  const an = {}; for (const [k, o] of Object.entries(anchors)) an[k] = group.worldToLocal(o.getWorldPosition(new THREE.Vector3()));
  return { group, setPaint, setWheels, setBeacon, setDoor, setBell, setExtras, setLetters, setAge, anchors: an, nodes, tris: Math.round(tris), parts: [], state };
}

// ---------------------------------------------------------------- props: loaded once at import (held3d builders are called synchronously)
const t0 = performance.now();
const [GUN, COMP] = await Promise.all([loader().loadAsync(DIR + 'gun.glb'), loader().loadAsync(DIR + 'compressor.glb')]);
console.warn('PHFD_ASSETS_LOAD_MS ' + Math.round(performance.now() - t0));
function nodeAnchors(THREE, root) { const an = {}; root.updateMatrixWorld(true); root.traverse(o => { if (o.name && o.name.startsWith('anchor_')) an[o.name.slice(7)] = root.worldToLocal(o.getWorldPosition(new THREE.Vector3())); }); return an; }
function propEnv(THREE, g) {   // held props live outside the set's env: prop_kit's studio sky on every GLB material (as the asset test)
  const env = kit(THREE, {}).metal('steel', '#ffffff').envMap; if (!env) return;
  g.traverse(o => { if (o.isMesh) for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (!m.envMap) { m.envMap = env; m.envMapIntensity = 1; m.needsUpdate = true; } });
}
// THE FIST FIX (props-hero 2026-11-20, LECONS): film.js h3Fist draws the cast's round fist in ink #2a1a1f with toneMapped:false, but the kit's final pass
// tone-maps every pixel outside the CARD mask with neutral(); for dark colours neutral() subtracts (min - 6.25 min^2) from all channels, so the ink
// (linear .0232/.0103/.0137) came out (31, 2, 7): dark maroon. Pre-compensate the fist's colours right before they are drawn: c = t + (sqrt(min/6.25) - min).
function inkFist(THREE, scene) {
  scene.traverse(o => { if (!o.isMesh || o.userData.phfdInk) return; let p = o, f = false; while (p) { if (p.name === 'held3d_fist') { f = true; break; } p = p.parent; } if (!f) return;
    o.userData.phfdInk = 1; o.onBeforeRender = () => { const m = o.material; if (!m || !m.color || m.transparent) return; const c = m.color;
      if (m.userData.comp && c.getHex() === m.userData.comp) return; const t = Math.min(c.r, c.g, c.b), x = Math.sqrt(t / 6.25);
      // inverse of neutral(): off(x) = x - 6.25x^2 below .08, a flat .04 above
      const off = x < .08 ? x - t : .04; c.setRGB(c.r + off, c.g + off, c.b + off); m.userData.comp = c.getHex(); }; });
}
export function buildSprayGun(THREE, opts = {}) {
  const g = new THREE.Group(); g.name = 'phfd_spray_gun'; const s = GUN.scene.clone(true); g.add(s); let tris = 0;
  s.traverse(o => { if (o.isMesh) { o.castShadow = opts.inHand ? false : true; o.receiveShadow = true; const ge = o.geometry; tris += (ge.index ? ge.index.count : ge.attributes.position.count) / 3; } });
  if (opts.size) s.scale.setScalar(opts.size / .24);
  const an = nodeAnchors(THREE, g); propEnv(THREE, g);
  const first = s.getObjectByProperty('isMesh', true); first.onBeforeRender = (r, scene) => { inkFist(THREE, scene); };
  return { group: g, grip: an.grip || new THREE.Vector3(), tip: an.tip, inlet: an.air_inlet, anchors: an, parts: [], tris: Math.round(tris) };
}
export function buildCompressor(THREE, a = {}, b) {
  const g = new THREE.Group(); g.name = 'phfd_compressor'; const s = COMP.scene.clone(true); g.add(s); let tris = 0;
  s.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; const ge = o.geometry; tris += (ge.index ? ge.index.count : ge.attributes.position.count) / 3; } });
  const an = nodeAnchors(THREE, g); propEnv(THREE, g); return { group: g, anchors: an, outlet: an.outlet, parts: [], tris: Math.round(tris) };
}
// the same rule as assets_prod/scripts/props_api.py hose_points (three axes: y up)
export function hosePoints(THREE, A, B, loops = true) {
  const d = B.clone().sub(A); d.y = 0; const side = new THREE.Vector3(-d.z, 0, d.x).normalize(), r = .0085;
  const P = (t, off, y) => { const p = A.clone().lerp(B, t).addScaledVector(side, off); p.y = y; return p; };
  const pts = [A.clone(), P(.04, .02, Math.max(r, A.y * .5)), P(.1, .12, r), P(.3, .32, r), P(.45, .1, r)];
  if (loops) pts.push(P(.52, -.22, r), P(.42, -.34, r), P(.38, -.12, r * 3), P(.55, .05, r));
  pts.push(P(.72, -.2, r), P(.9, -.06, r), P(.97, 0, Math.max(r, B.y * .5)), B.clone()); return pts;
}
export function buildAirHose(THREE, a = {}, b) {
  const opts = b || a, A = new THREE.Vector3(...(opts.from || [0, .47, 0])), B = new THREE.Vector3(...(opts.to || [2, 0, 0])), g = new THREE.Group(); g.name = 'phfd_air_hose';
  const pts = hosePoints(THREE, A, B, opts.loops !== false), curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const hose = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, .0085, 8), new THREE.MeshStandardMaterial({ color: '#26262a', roughness: .6 })); hose.name = 'air_hose'; hose.castShadow = hose.receiveShadow = true; g.add(hose);
  const brass = new THREE.MeshStandardMaterial({ color: '#dcae52', metalness: 1, roughness: .25 });
  for (const [p, q] of [[pts[0], pts[1]], [pts[pts.length - 1], pts[pts.length - 2]]]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.013, .013, .05, 14), brass); c.name = 'hose_coupler'; c.position.copy(p); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p.clone().sub(q).normalize()); g.add(c); }
  return { group: g, anchors: { from: A, to: B }, parts: [], tris: 160 * 8 * 2 };
}
// ---------------------------------------------------------------- round 2 props (assets_prod/scripts/bl_props2.py; credits assets/ASSETS.md). Loaded on first use (async).
// name: 'milk_van' | 'hubcap' | 'milk_bottle' | 'milk_crate' | 'lunch_box' | 'lemon' | 'paint_tin_lemon' | 'paint_tin_lime' | 'paint_tin_red' | 'mug' | 'ribbon_set' | 'plaster'
const PROP2 = {};
export async function buildProp2(THREE, name, opts = {}) {
  const gl = await (PROP2[name] ||= loader().loadAsync(DIR + name + '.glb')); const g = new THREE.Group(); g.name = 'phfd_' + name; const s = gl.scene.clone(true); g.add(s); let tris = 0;
  s.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; const ge = o.geometry; tris += (ge.index ? ge.index.count : ge.attributes.position.count) / 3; } });
  const an = nodeAnchors(THREE, g); propEnv(THREE, g); return { group: g, anchors: an, parts: [], tris: Math.round(tris) };
}
// the held props of the cast: sync builders for film.json held3d (GLBs preloaded here)
const [BOTTLE, MUGG] = await Promise.all([loader().loadAsync(DIR + 'milk_bottle.glb'), loader().loadAsync(DIR + 'mug.glb')]);
function held(THREE, gl, name, opts) { const g = new THREE.Group(); g.name = 'phfd_' + name; const s = gl.scene.clone(true); g.add(s);
  s.traverse(o => { if (o.isMesh) { o.castShadow = !opts.inHand; o.receiveShadow = true; } }); const an = nodeAnchors(THREE, g); propEnv(THREE, g);
  const first = s.getObjectByProperty('isMesh', true); first.onBeforeRender = (r, scene) => { inkFist(THREE, scene); };
  return { group: g, grip: an.grip || an.handle || new THREE.Vector3(), anchors: an, parts: [] }; }
export const buildMilkBottle = (THREE, opts = {}) => held(THREE, BOTTLE, 'milk_bottle', opts);
export const buildMug = (THREE, opts = {}) => held(THREE, MUGG, 'mug', opts);
export const BUILDERS = { buildTruck, buildSprayGun, buildCompressor, buildAirHose, buildProp2, buildMilkBottle, buildMug };

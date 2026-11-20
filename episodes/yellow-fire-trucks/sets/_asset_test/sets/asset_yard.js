// asset_yard.js: TEST ONLY (props-hero asset test 2026-11-20). The yard of sets/hero_yard_test.js (same floor, wall, sign, light)
// with a DOWNLOADED Sketchfab GLB truck in place of the coded hero_truck.js, so the sheet shows asset vs renderer.
// Place keys: asset: 'afe' | 'alf', paint: 'orig' | 'red' | 'lemon' | 'half', edge (plan x of the sprayed edge), gun_on_floor.
// Plan metres, Z up; truck at the origin, front toward -x, driver's side toward -y (as hero_yard_test.js).
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { kit, handText } from './prop_kit.js';
export const ASSETS = {   // file under ../assets (link), real length, three-space yaw that puts the front at -x, cab roof height and cab rear (plan x) for the white roof
  afe: { f: 'assets/american_fire_engine/american_fire_engine.glb', L: 8.2, yaw: 90, roof: 2.05, cab: -1.5, red: m => m.color && m.color.r > .5 && m.color.g < .15 && m.color.b < .15 },
  alf: { f: 'assets/alf_1940s/alf_1940s.glb', L: 8.0, yaw: -90, roof: 2.2, cab: -1.0, red: m => m.name === 'van_paint_2' },
};
const PAINT = { red: '#D3141C', lemon: '#E3EA22', roof: '#F2F0EA' };
export async function loadAsset(THREE, key, dir) {
  const A = ASSETS[key], t0 = performance.now(), gl = await new GLTFLoader().loadAsync(dir + A.f), root = new THREE.Group(), s = gl.scene;
  s.rotation.y = A.yaw * Math.PI / 180; root.add(s); root.updateMatrixWorld(true);
  let bb = new THREE.Box3().setFromObject(s); const k = A.L / Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z); s.scale.setScalar(k); root.updateMatrixWorld(true);
  bb = new THREE.Box3().setFromObject(s); const c = bb.getCenter(new THREE.Vector3()); s.position.sub(new THREE.Vector3(c.x, bb.min.y, c.z)); root.updateMatrixWorld(true);
  let tris = 0; s.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3; } });
  return { root, tris: Math.round(tris), loadMs: Math.round(performance.now() - t0), size: new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3()) };
}
function paintMat(THREE, K, state, A, edge) {   // our paint on the asset's red panels: clear-coat red / lemon / half (soft sprayed edge) + white cab roof, from world position
  const m = K.pb ? K.pb.metal('wet', { color: '#ffffff', rough: .2, finish: 'smooth', nscale: .06, coat: 1, coatRough: .05, env: .85, scale: 1.3, seed: 11 }) : new THREE.MeshPhysicalMaterial({ roughness: .3, clearcoat: 1 });
  if (m.color) m.color.set('#ffffff');
  const U = { uA: { value: new THREE.Color(state === 'lemon' ? PAINT.lemon : PAINT.red) }, uB: { value: new THREE.Color(state === 'red' ? PAINT.red : PAINT.lemon) }, uR: { value: new THREE.Color(PAINT.roof) },
    uEdge: { value: edge }, uRoof: { value: state === 'lemon' ? 99 : A.roof }, uCab: { value: A.cab } };
  m.onBeforeCompile = sh => { Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP;').replace('#include <project_vertex>', '#include <project_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uA; uniform vec3 uB; uniform vec3 uR; uniform float uEdge; uniform float uRoof; uniform float uCab;\nvarying vec3 vWP;')
      .replace('#include <map_fragment>', `#include <map_fragment>
      { vec3 q = fract(floor(vWP * 85.0) * .1031); q += dot(q, q.yzx + 33.33); float hs = fract((q.x + q.y) * q.z);
        float ks = (vWP.x - uEdge) / .38 + sin(vWP.y * 2.6 - vWP.z * 1.3) * .22 + (hs - .5) * .5;
        vec3 pc = mix(uA, uB, smoothstep(-1.0, 1.0, ks));
        pc = mix(pc, uR, step(uRoof, vWP.y) * step(vWP.x, uCab));
        diffuseColor.rgb *= pc; }`); };
  m.customProgramCacheKey = () => 'asset_paint_' + state; return m;
}
export async function build(THREE, scene, film, ctx) {
  const { B2T } = ctx, pl = ctx.place || {}, K = kit(THREE, ctx), V = (x, y, z) => B2T([x, y, z]);
  const add = (geo, mat, name, role, p, sh = true) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = sh; m.receiveShadow = true; scene.add(m); return m; };
  const box = (sx, sy, sz, mat, name, role, x, y, z, sh) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, role, V(x, y, z), sh);
  if (ctx.sky && ctx.sky.clouds) ctx.sky.clouds({ kind: 'clear-day', seed: 4 });
  // the yard of hero_yard_test.js (copied lines, so the light and the ground are the same as the coded truck's tiles)
  const conc = ctx.relief('plaster', '#aeaaa0', { size: 4, normal: 1.4 }), brick = ctx.relief('brick', '#9a5a44'), wood = ctx.relief('wood', '#e6e0cc', { size: 1.2 });
  const fl = add(new THREE.PlaneGeometry(90, 70), conc, 'yard_concrete', 'ground', V(0, 0, 0), false); fl.rotation.x = -Math.PI / 2;
  for (let i = -5; i <= 5; i++) { const j = add(new THREE.PlaneGeometry(.035, 70), K.std('#5e5a52'), 'joint', 'ground', V(i * 4.2 + 1.1, 0, .003), false); j.rotation.x = -Math.PI / 2; const k = add(new THREE.PlaneGeometry(90, .035), K.std('#5e5a52'), 'joint', 'ground', V(0, i * 4.2 - 1.6, .003), false); k.rotation.x = -Math.PI / 2; }
  box(13, .4, 6.4, brick, 'wall_l', 'brick', -11.5, 13, 3.2); box(13, .4, 6.4, brick, 'wall_r', 'brick', 11.5, 13, 3.2); box(10, .4, 1.9, brick, 'lintel', 'brick', 0, 13, 5.45);
  box(10, .1, 4.5, wood, 'bay_door', 'wood', 0, 13.1, 2.25); for (let i = 1; i < 5; i++) box(10, .12, .04, K.std('#8a8576'), 'door_joint', 'wood', 0, 13.04, i * .9, false);
  for (let i = -3; i <= 3; i++) box(.9, .12, .5, K.std('#27343c', { roughness: .2 }), 'door_window', 'glass', i * 1.3, 13.03, 3.15, false);
  const sign = K.tex('station_sign', 1024, 160, (c, w, h) => { c.fillStyle = '#20301f'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e8b93c'; c.lineWidth = 6; c.strokeRect(10, 10, w - 20, h - 20); handText(c, 'PINE HOLLOW FIRE DEPT.  ·  ENGINE No. 1', w / 2, 84, 44, { fill: '#e8b93c', shade: '#0a0f0a', seed: 8 }); });
  add(new THREE.PlaneGeometry(8, 1.25), new THREE.MeshStandardMaterial({ map: sign, roughness: .7 }), 'sign', 'wood', V(0, 12.78, 5.4), false);
  box(60, .3, 1.8, brick, 'boundary_wall', 'brick', 0, -26, .9);
  // THE DOWNLOADED TRUCK
  const key = pl.asset || 'afe', A = ASSETS[key], st = pl.paint || 'orig', T = await loadAsset(THREE, key, ctx.dir || '/ep/');
  const glb = []; let pm = null;
  T.root.traverse(o => { if (!o.isMesh) return; const ms = Array.isArray(o.material) ? o.material : [o.material];
    const out = ms.map(m => { if (st !== 'orig' && A.red(m)) return pm ||= paintMat(THREE, K, st, A, pl.edge ?? .3); glb.push(m); return m; }); o.material = Array.isArray(o.material) ? out : out[0]; });
  scene.add(T.root);
  // the kit gives its studio reflection only to its own pbr materials: hand the same one to the GLB's materials on the first frame (else chrome reads black)
  let envDone = false; const giveEnv = () => { if (envDone) return; let env = null; scene.traverse(o => { if (!env && o.isMesh && o.material && o.material.envMap) env = o.material.envMap; });
    if (env) { for (const m of glb) if (!m.envMap) { m.envMap = env; m.envMapIntensity = .85; m.needsUpdate = true; } envDone = true; } };
  const stats = { asset: key, paint: st, tris: T.tris, load_ms: T.loadMs, size: [T.size.x, T.size.y, T.size.z].map(v => +v.toFixed(2)), glb_materials: new Set(glb).size };
  console.warn('ASSET_STATS ' + JSON.stringify(stats)); if (typeof window !== 'undefined') (window.__assetStats ||= {})[pl.set_key || key] = stats;
  return { update: () => { giveEnv(); }, anchors: { truck: [0, 0, 1.4] } };
}

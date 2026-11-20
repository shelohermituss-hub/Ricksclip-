// asset_props.js: TEST ONLY (props-hero asset test 2026-11-20). The DOWNLOADED Sketchfab "Spray Gun" (Oleksii.Rozumnyi, CC-BY) as a kit held3d builder.
// film.json "held3d": [{ who, obj: 'spray_gun', module: 'sets/asset_props.js', builder: 'buildAssetGun', grip: 'handle', face: 'out', hand: 'R', anchor: 'grip', tip: 'tip', when: 'always', scale: 1.7 }]
// Same frame as hero_props.js buildSprayGun: local metres, Y up, nozzle toward +X, grip point = middle of the handle at the origin. The GLB is loaded once (top-level await).
import * as THREE0 from '/kit/vendor/three.module.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { kit } from './prop_kit.js';
const t0 = performance.now(), GUN = await new GLTFLoader().loadAsync('/ep/assets/spray_gun/spray_gun.glb');
console.warn('ASSET_GUN_LOAD_MS ' + Math.round(performance.now() - t0));
export function buildAssetGun(THREE, opts = {}) {
  const g = new THREE.Group(), s = GUN.scene.clone(true); g.name = 'asset_spray_gun';
  s.rotation.y = Math.PI; g.add(s); g.updateMatrixWorld(true);   // as shipped the nozzle points to -X: turn it to +X
  let bb = new THREE.Box3().setFromObject(s); const sz = bb.getSize(new THREE.Vector3()), k = (opts.size || .24) / Math.max(sz.x, sz.y, sz.z); s.scale.multiplyScalar(k); g.updateMatrixWorld(true);
  bb = new THREE.Box3().setFromObject(s); const H = bb.max.y - bb.min.y;
  // grip = middle of the handle: the mean of the vertices in the lower half (above the brass air nipple)
  const acc = new THREE.Vector3(), v = new THREE.Vector3(); let n = 0, tris = 0; const tipA = new THREE.Vector3(); let tn = 0;
  s.traverse(o => { if (!o.isMesh) return; o.castShadow = false; const p = o.geometry.attributes.position; tris += (o.geometry.index ? o.geometry.index.count : p.count) / 3;
    for (let i = 0; i < p.count; i += 3) { v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld);
      if (v.y > bb.min.y + .18 * H && v.y < bb.min.y + .5 * H) { acc.add(v); n++; }
      if (v.x > bb.max.x - .012) { tipA.add(v); tn++; } } });
  const grip = acc.divideScalar(Math.max(1, n)); grip.y = bb.min.y + .36 * H; s.position.sub(grip); g.updateMatrixWorld(true);
  const tip = tipA.divideScalar(Math.max(1, tn)).sub(grip);
  const env = kit(THREE, {}).metal('steel', '#ffffff').envMap;   // prop_kit's studio sky (no kit3d ctx in the fist)
  s.traverse(o => { if (o.isMesh) { const ms = Array.isArray(o.material) ? o.material : [o.material]; for (const m of ms) if (!m.envMap) { m.envMap = env; m.envMapIntensity = 1; m.needsUpdate = true; } } });
  console.warn('ASSET_GUN ' + JSON.stringify({ tris: Math.round(tris), grip_from_bottom: +(.36 * H).toFixed(3), tip: tip.toArray().map(x => +x.toFixed(3)) }));
  return { group: g, grip: new THREE.Vector3(0, 0, 0), tip, parts: [], tris: Math.round(tris) };
}

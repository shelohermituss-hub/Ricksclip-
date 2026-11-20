// prove_power.mjs (vfx-artist 2026-11-16): numeric proof of the six power effects. Run from anywhere: node templates/pieces/fx/power/prove_power.mjs
// With the kit's own three.js (templates/threejs_film/vendor, r165), for every effect, under the scene AND under a moved, turned, scaled parent:
//   1. the module loads and the factory builds (no document, no canvas, no WebGL needed)
//   2. update(t) for t = -0.5 .. 3.0 s every 1/30 s (106 frames) throws nothing and leaves no NaN / Infinity in any position, scale, turn,
//      opacity, uniform, vertex position or vertex colour
//   3. it is stateless: the picture at t = 0.5 is the same whether reached frame by frame or by a jump from t = 2.9 (stills render out of order)
//   4. it shows something after its word: at t = 0.1 at least one object is visible with opacity > 0
//   5. dispose() removes every object it added (object count back to the start) and frees every geometry and material it made
import * as THREE from '../../../threejs_film/vendor/three.module.js';
import { finiteCheck } from './_core.mjs';
import { makeShockwaveRing } from './shockwave_ring.mjs';
import { makeRayBurst } from './ray_burst.mjs';
import { makeCrackVeins } from './crack_veins.mjs';
import { makeAura } from './aura.mjs';
import { makeSpiralEyes } from './spiral_eyes.mjs';
import { makeSparkTrail } from './spark_trail.mjs';

const cam = new THREE.PerspectiveCamera(40, 9 / 16, .1, 200); cam.position.set(0, 1.4, 6); cam.lookAt(0, 1, 0); cam.updateMatrixWorld();
function fakeCard(scene) {   // the shape of a kit card (film.js R.cards[who]): a plane on the ground line, scaled CARD.W*k x CARD.H*k
  const k = 1.75 / 560, geo = new THREE.PlaneGeometry(1, 1); geo.translate(0, .5 - 60 / 1500, 0);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial()); mesh.scale.set(800 * k, 1500 * k, 1); mesh.position.set(0, 0, 0); scene.add(mesh);
  return { mesh, m: { headPx: 300, px: 560 }, k, entry: { height: 1.75 } };
}
const CASES = {
  shockwave_ring: (s) => makeShockwaveRing(THREE, s, [0, .02, 0], { camera: cam }),
  shockwave_ring_camera: (s) => makeShockwaveRing(THREE, s, [0, 1, 0], { camera: cam, orient: 'camera' }),
  ray_burst: (s) => makeRayBurst(THREE, s, [0, 1.4, -1], { camera: cam }),
  ray_burst_fan_ink: (s) => makeRayBurst(THREE, s, [0, 1.4, -1], { camera: cam, fan: 140, blend: 'normal', ink: '#202020', orient: [0, 0, 1] }),
  crack_veins_floor: (s) => makeCrackVeins(THREE, s, [0, 0, 0], { normal: [0, 1, 0] }),
  crack_veins_wall: (s) => makeCrackVeins(THREE, s, [0, 1, -2], { normal: [0, 0, 1], end: 2.2 }),
  aura: (s, card) => makeAura(THREE, s, card.mesh, { camera: cam, end: 2.4 }),
  spiral_eyes_card: (s, card) => makeSpiralEyes(THREE, s, card, { camera: cam, end: 2.5, cardWarm: .3 }),
  spiral_eyes_points: (s) => makeSpiralEyes(THREE, s, { eyes: [[-.1, 1.6, 0], [.1, 1.6, 0]] }, { camera: cam }),
  spark_trail: (s) => makeSparkTrail(THREE, s, [[-2, 0, 0], [-1, .2, .3], [0, .1, 0], [1, .6, -.2], [1.5, 1.2, 0]], { camera: cam }),
};
const count = o => { let n = 0; o.traverse(() => n++); return n; };
const snap = root => { const out = []; root.traverse(o => { out.push(o.visible ? 1 : 0, ...o.position.toArray(), ...o.scale.toArray()); if (o.material && !Array.isArray(o.material)) out.push(o.material.opacity); const a = o.geometry && o.geometry.attributes; if (a && a.position) out.push(...Array.from(a.position.array).slice(0, 300)); if (a && a.color) out.push(...Array.from(a.color.array).slice(0, 300)); }); return out; };
const shows = root => { let v = false; root.traverse(o => { if (!o.visible) return; let p = o; while (p) { if (!p.visible) return; p = p.parent; } const m = o.material; if (m && !Array.isArray(m) && (m.opacity > 0 || (m.uniforms && m.uniforms.uOp && m.uniforms.uOp.value > 0))) v = true; }); return v; };

let fails = 0; const rows = [];
for (const [name, make] of Object.entries(CASES)) for (const parented of [false, true]) {
  const scene = new THREE.Scene(), card = fakeCard(scene); let par = scene;
  if (parented) { par = new THREE.Group(); par.position.set(3, -1, 2); par.rotation.set(.3, 1.1, -.2); par.scale.setScalar(1.7); scene.add(par); }
  scene.updateMatrixWorld(true);
  const n0 = count(scene), errs = []; let fx, nan = 0, frames = 0;
  try { fx = make(par, card); } catch (e) { errs.push('build: ' + e.message); }
  const made = new Set(); if (fx) scene.traverse(o => { if (o.geometry) made.add(o.geometry); for (const m of o.material ? [].concat(o.material) : []) made.add(m); });
  for (const o of made) { o.userData = o.userData || {}; o.addEventListener('dispose', () => { o.userData.__disposed = true; }); }
  if (fx) {
    for (let f = -15; f <= 90; f++) { try { fx.update(f / 30); frames++; nan += finiteCheck(scene); } catch (e) { errs.push(`t=${(f / 30).toFixed(2)}: ${e.message}`); break; } }
    fx.update(.5); const a = snap(scene); fx.update(2.9); fx.update(.5); const b = snap(scene);
    const diff = a.length !== b.length ? Infinity : Math.max(0, ...a.map((v, i) => Math.abs(v - b[i])));
    if (!(diff < 1e-6)) errs.push('not stateless: max diff ' + diff);
    fx.update(.1); if (!shows(scene)) errs.push('nothing visible at t = 0.1');
    fx.update(-.5 - .2);
    try { fx.dispose(); } catch (e) { errs.push('dispose: ' + e.message); }
    const n1 = count(scene); if (n1 !== n0) errs.push(`objects left: ${n1 - n0}`);
    const leaked = [...made].filter(o => !o.userData.__disposed && o !== card.mesh.geometry && o !== card.mesh.material).length; if (leaked) errs.push(`not freed: ${leaked} geometries/materials`);
  }
  if (nan) errs.push(`${nan} non-finite numbers`);
  const ok = !errs.length; if (!ok) fails++;
  rows.push(`${ok ? 'ok  ' : 'FAIL'} ${(name + (parented ? ' (turned parent)' : '')).padEnd(42)} frames ${frames}  made ${made.size}  ${errs.join('; ')}`);
}
console.log(rows.join('\n'));
console.log(fails ? `FAIL (${fails} of ${rows.length})` : `PASS (${rows.length} runs, 6 effects, update -0.5..3.0 s, stateless, dispose clean)`);
process.exit(fails ? 1 : 0);

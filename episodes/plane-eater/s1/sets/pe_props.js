// pe_props.js: S1 held props of plane-eater for film.json "held3d" (S1 stretch builder 2026-11-22). Loads props/out/*.glb once (top-level await),
// then every builder is synchronous, as film.js h3gBuild wants. Builder space: the object's LONG axis is +Y (grips.mjs angle convention), origin = fist centre.
// The GLBs were exported Z-up from Blender (glTF Y-up): fork / hacksaw / tongs have their working end on +X -> turned +90 deg about Z so it is +Y.
// The salt shaker has its cap on +Y already. The fist ink fix is the props-hero's (yellow-fire-trucks/sets/assets.js, LECONS 2026-11-20).
import { GLTFLoader } from './vendor/GLTFLoader.js';
const DIR = new URL('../props/out/', import.meta.url).href;
const L = new GLTFLoader(), G = {};
for (const n of ['salt_shaker', 'fork', 'hacksaw', 'sugar_tongs', 'metal_bites', 'plate']) G[n] = await L.loadAsync(DIR + n + '.glb');
export const GLB = G;
function inkFist(THREE, scene) {
  scene.traverse(o => { if (!o.isMesh || o.userData.peInk) return; let p = o, f = false; while (p) { if (p.name === 'held3d_fist') { f = true; break; } p = p.parent; } if (!f) return;
    o.userData.peInk = 1; o.onBeforeRender = () => { const m = o.material; if (!m || !m.color || m.transparent) return; const c = m.color;
      if (m.userData.comp && c.getHex() === m.userData.comp) return; const t = Math.min(c.r, c.g, c.b), x = Math.sqrt(t / 6.25);
      const off = x < .08 ? x - t : .04; c.setRGB(c.r + off, c.g + off, c.b + off); m.userData.comp = c.getHex(); }; });
}
function make(THREE, name, turn, tipLocal, opts = {}) {
  const g = new THREE.Group(); g.name = 'pe_' + name; const s = G[name].scene.clone(true); if (turn) s.rotation.z = turn; g.add(s);
  if (opts.size) s.scale.setScalar(opts.size);
  s.traverse(o => { if (o.isMesh) { o.castShadow = !opts.inHand; o.receiveShadow = true; } });
  const first = s.getObjectByProperty('isMesh', true); if (first) { const prev = first.onBeforeRender; first.onBeforeRender = (r, scene, ...a) => { inkFist(THREE, scene); }; }
  const k = opts.size || 1;
  return { group: g, grip: new THREE.Vector3(0, 0, 0), tip: new THREE.Vector3(tipLocal[0] * k, tipLocal[1] * k, tipLocal[2] * k) };
}
// tips (builder space, metres): the shaker cap top 0.07 m above the grip (origin at 40 % of 0.12 m); fork tines 0.20 m; hacksaw blade middle 0.25 m; tongs claws 0.11 m
export const buildShaker = (THREE, o = {}) => make(THREE, 'salt_shaker', 0, [0, .072, 0], o);
export const buildFork = (THREE, o = {}) => make(THREE, 'fork', Math.PI / 2, [0, .20, 0], o);
export const buildSaw = (THREE, o = {}) => make(THREE, 'hacksaw', Math.PI / 2, [0, .26, -.06], o);
export const buildTongs = (THREE, o = {}) => make(THREE, 'sugar_tongs', Math.PI / 2, [0, .115, 0], o);

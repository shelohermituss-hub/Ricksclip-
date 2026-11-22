// pe_props.js: held props of plane-eater for the kit's GENERIC HELD 3D path (film.json held3d with "grip"); S5 stretch builder 2026-11-22.
// Loads the locked props GLBs (props/out/*.glb, origin = fist centre, business end +X) and hands the kit a builder per prop:
//   buildFork / buildKnife / buildRag (THREE, opts) -> { group, grip, tip }. The kit wants the long axis on +Y, so the model turns +X -> +Y.
import { GLTFLoader } from './vendor/GLTFLoader.js';
const DIR = new URL('../props/out/', import.meta.url).href, L = new GLTFLoader();
const G = {}; for (const n of ['fork', 'knife', 'owner_rag_spanner']) G[n] = (await L.loadAsync(DIR + n + '.glb')).scene;
function make(THREE, src, keep, len, scale = 1) {
  const group = new THREE.Group(), m = src.clone(true);
  if (keep) m.traverse(o => { if (o.isMesh && !keep.test(o.name)) o.visible = false; });
  m.rotation.z = Math.PI / 2; m.scale.setScalar(scale); group.add(m);
  m.traverse(o => { if (o.isMesh) { o.castShadow = true; const mt = o.material; if (mt && mt.metalness > .5) { mt.metalness = .55; mt.roughness = Math.max(mt.roughness, .3); } } });
  return { group, grip: new THREE.Vector3(0, 0, 0), tip: new THREE.Vector3(0, len * scale, 0) };
}
export const buildFork = (THREE, o = {}) => make(THREE, G.fork, null, .2, o.scale ?? 1.4);
export const buildKnife = (THREE, o = {}) => make(THREE, G.knife, null, .27, o.scale ?? 1.4);
export const buildRag = (THREE, o = {}) => make(THREE, G.owner_rag_spanner, /^rag/, .12, o.scale ?? 1.2);

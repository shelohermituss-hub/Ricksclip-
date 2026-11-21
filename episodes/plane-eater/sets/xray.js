// xray.js: PLACE X, the 1970s clinic corner with the X-ray light box (row 19) + THE X-RAY WORLD inside the stomach (rows 20-22), for the three.js kit
// (set-builder 2026-11-21). Loads the SAME set the Blender final uses: sets/xray/out/xray_lite.glb (+ xray_meta.json), built by sets/xray/build_xray.sh.
// film.json: "places": { "xray": { "set": "xray", "xray": { "puff": 0, "ride": null, "flicker": 0, "keys": [ {"f": 0, "puff": 0}, {"f": 30, "puff": 1}, {"f": 40, "ride": 0}, {"f": 70, "ride": 1} ] } } }
//   puff 0..1 = the lining's shape key 'puff' (thin lining -> quilted mattress; the runway dashes rise with it); ride 0..1 = the mini bite-Cessna along meta.slide_path
//   (null = parked at slide_path_flat[0] or slide_path[0] when puffed); flicker 0..1 = the light box buzz (row 19: two flickers then hold).
// Anchors (Blender metres, Z up; ctx.B2T): film_hero {c, w, h}, lightbox, bench_top, step_stool, desk_top, doctor_stand, stomach_centre, stomach_axes.
// Cameras: CAMS.CAM_SHOULDER (row 19), CAM_WIDE (reverse/establishing), CAM_FILM (fly-in start, row 20), CAM_INSIDE (row 20), CAM_LINING (row 21), CAM_RIDE (row 22).
import { GLTFLoader } from './vendor/GLTFLoader.js';
const DIR = new URL('./xray/out/', import.meta.url).href;
const META = await (await fetch(DIR + 'xray_meta.json')).json();
export const ANCHORS = META.anchors, CAMS = META.cams, PATH = META.slide_path, PATH_FLAT = META.slide_path_flat;
let GLTF = null;
export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, P = pl.xray || {}, V = p => ctx.B2T(p), t0 = performance.now();
  GLTF ||= await new GLTFLoader().loadAsync(DIR + 'xray_lite.glb');
  const root = GLTF.scene.clone(true); root.name = 'xray'; scene.add(root);
  const puffs = [], glow = []; let tris = 0, mini = null, film_ = null;
  root.traverse(o => {
    if (o.name === 'xw_mini_cessna') mini = o;
    if (!o.isMesh) return; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    o.castShadow = o.receiveShadow = !/^xw_|^window_backdrop/.test(o.name);
    if (o.morphTargetInfluences && o.morphTargetInfluences.length) puffs.push(o);
    const m = o.material; if (m.emissive && m.emissive.getHex() !== 0) { m.toneMapped = false; glow.push(m); }
    if (o.name === 'xray_film_hero') film_ = m;
    if (/chrome|steel/.test(m.name)) { m.metalness = Math.min(m.metalness, .55); m.roughness = Math.max(m.roughness, .3); }   // no env map in the kit: a true mirror renders black
    if (/stomach_glass/.test(m.name)) { m.transparent = true; m.opacity = .28; m.depthWrite = false; m.side = THREE.DoubleSide; }
  });
  const base = new Map(glow.map(m => [m, m.emissiveIntensity]));
  // light: window sun + troffer + the box glow in the clinic; the X-ray world is self-lit with a cyan key
  const sun = new THREE.DirectionalLight('#f2f6ff', 2.4); sun.position.copy(V([-5, .9, 4])); sun.target.position.copy(V([0, 1, 0])); sun.castShadow = true; scene.add(sun, sun.target);
  const box = new THREE.PointLight('#bff4ff', 3, 4, 2); box.position.copy(V([ANCHORS.lightbox[0], ANCHORS.lightbox[1] - .3, ANCHORS.lightbox[2]])); scene.add(box);
  const tro = new THREE.PointLight('#f4fbff', 4, 6, 2); tro.position.copy(V([-.1, .9, 2.5])); scene.add(tro);
  const xk = new THREE.PointLight('#d8fbff', 30, 12, 2); xk.position.copy(V([META.X0[0] - 1.5, META.X0[1] - 2.5, META.X0[2] + 2.2])); scene.add(xk);
  scene.add(new THREE.HemisphereLight('#dfe9f7', '#a9c4bd', 1.1));
  const S = { puff: P.puff ?? 0, ride: P.ride ?? null, flicker: P.flicker ?? 0 }, tmp = new THREE.Vector3();
  function along(path, u) { const n = path.length - 1, f = Math.min(Math.max(u, 0), 1) * n, i = Math.min(Math.floor(f), n - 1), k = f - i; return V(path[i]).lerp(V(path[i + 1]), k); }
  function setState(s = {}) {
    Object.assign(S, s);
    puffs.forEach(o => { o.morphTargetInfluences[0] = S.puff; });
    if (mini) { const p = S.ride == null ? V((S.puff > .5 ? PATH : PATH_FLAT)[0]) : along(PATH, S.ride); mini.position.copy(p);
      if (S.ride != null) { tmp.copy(along(PATH, Math.min(1, S.ride + .02))); } }
    glow.forEach(m => { m.emissiveIntensity = base.get(m) * (/diffuser|film/.test(m.name) ? 1 - .8 * S.flicker : 1); }); box.intensity = 3 * (1 - .8 * S.flicker);
  }
  const K = (P.keys || []).slice().sort((a, b) => a.f - b.f);
  function at(f) {
    if (!K.length) return {}; let a = K[0], b = K[K.length - 1];
    for (let i = 0; i < K.length - 1; i++) if (f >= K[i].f && f <= K[i + 1].f) { a = K[i]; b = K[i + 1]; break; }
    const u = b.f > a.f ? Math.min(1, Math.max(0, (f - a.f) / (b.f - a.f))) : 1, e = u * u * (3 - 2 * u), o = {};
    for (const k of ['puff', 'ride', 'flicker']) if (a[k] != null || b[k] != null) o[k] = (a[k] ?? b[k]) + ((b[k] ?? a[k]) - (a[k] ?? b[k])) * e;
    return o;
  }
  const prop = root.getObjectByName('xw_mini_cessna_prop');
  function update(f, t) { setState(at(f)); if (prop) prop.rotation.x = t * 60; }      // the tiny propeller hums
  setState();
  console.warn('PE_XRAY ' + JSON.stringify({ meshes: root.children.length, glb_tris: Math.round(tris), morphs: puffs.length, load_ms: Math.round(performance.now() - t0) }));
  return { anchors: ANCHORS, cams: CAMS, update, setState };
}

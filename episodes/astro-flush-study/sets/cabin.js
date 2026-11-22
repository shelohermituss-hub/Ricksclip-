// cabin.js: PLACES D + E of astro-flush-study (ship cabin by day, sleep bay by night: two rooms in one scene) for the three.js kit.
// Loads sets/cabin/out/cabin_lite.glb + cabin_meta.json, the same scene the Blender stills use (built by sets/cabin/build_cabin.sh).
// NO geometry is made here: everything seen is in the Blender scene. This module only switches the mode, swaps the green bag, moves the movers, sets lights.
// film.json: "places": { "cabin": { "set": "cabin", "cabin": { "mode": "day", "bag_new_guy": "full", "door": 1, "sway": 0, "monitor": "<picture url>",
//   "keys": [ {"f": 460, "bag_new_guy": "full"}, {"f": 466, "bag_new_guy": "empty"}, {"f": 423, "sway": -1}, {"f": 494, "sway": 1} ] } } }
//   mode day|night (a step: lights + world); bag_new_guy full|empty (a step: bag_new_guy / bag_new_guy_open); door 0..1 = bay_door slides open;
//   sway -1..1 = every sleeping bag turns sway * sway_deg about its hook. Numbers are eased (smoothstep) between keys.
// Monitor: the stretch builder feeds cabin_monitor_pic: setMonitor(texture or url) (rect in META.monitor_pic, 9:16, Blender metres).
// Movers (named objects, origin at the pivot, META.movers): magazine, drink_ball, clipboard, pencil, float_tube, float_book, float_crisps, float_strip, float_pen,
//   bag_navigator, bag_commander, bag_new_guy, bag_new_guy_open, bay_door, cabin_monitor_pic. Animate them by name with mover(name).
// Cameras: CAMS.f284 f300 f330 f390 f430 f460 f490 = {loc, look, roll, vfov} in Blender metres (the proof cameras of sets/cabin/STATE.md).
import { GLTFLoader } from './vendor/GLTFLoader.js';
const DIR = new URL('./cabin/out/', import.meta.url).href;
const META = await (await fetch(DIR + 'cabin_meta.json')).json();
export const ANCHORS = META.anchors, CAMS = META.cams, MOVERS = META.movers, FRAMES = META.frames, MONITOR = META.monitor_pic;
let GLTF = null;
const D2R = Math.PI / 180;
export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, P = pl.cabin || {}, t0 = performance.now();
  const V = p => (ctx.B2T ? ctx.B2T(p) : new THREE.Vector3(p[0], p[2], -p[1]));
  const D = d => new THREE.Vector3(d[0], d[2], -d[1]);
  // Blender euler XYZ (degrees) -> glTF/three quaternion: Blender XYZ = three order 'ZYX'; the exporter maps (x, y, z, w) -> (x, z, -y, w)
  const Q = r => { const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(r[0] * D2R, r[1] * D2R, r[2] * D2R, 'ZYX')); return new THREE.Quaternion(q.x, q.z, -q.y, q.w); };
  GLTF ||= await new GLTFLoader().loadAsync(DIR + 'cabin_lite.glb');
  const root = GLTF.scene.clone(true); root.name = 'cabin'; scene.add(root); let tris = 0;
  const N = n => root.getObjectByName(n), mats = {};
  root.traverse(o => {
    if (!o.isMesh) return; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    o.castShadow = o.receiveShadow = !/(ceiling|monitor_pic|skylight_glow|porthole_stars|floor_dots|floor_holes|toilet_room)/.test(o.name);
    for (const m of [].concat(o.material)) { if (m.name) mats[m.name] = m; if (m.emissive && (m.emissive.getHex() !== 0 || m.emissiveMap)) m.toneMapped = false; }
  });
  // kit bloom adds the halo: emission lower than Blender's (same as toilet.js)
  for (const [n, k] of [['skylight', .55], ['floor_light', 1.6], ['led_green', 1.2], ['hatch_teal', .15], ['hatch_glass', .35], ['monitor_placeholder', .85], ['porthole_stars', .8]]) if (mats[n]) mats[n].emissiveIntensity = k;
  const MV = Object.entries(MOVERS).map(([n, m]) => [N(n), m]).filter(([o]) => o);
  // lights from meta: SUN -> directional (hard shadow), SPOT -> spot, POINT / AREA -> point. Watts -> three intensity by light_scale (sun by sun_scale).
  const LS = P.light_scale ?? 0.025, SS = P.sun_scale ?? 0.4, lights = {}, hemi = new THREE.HemisphereLight('#ffffff', '#000000', 0); scene.add(hemi);
  for (const [n, L] of Object.entries(META.lights)) {
    let l; const col = new THREE.Color(...L.color), p = V(L.loc);
    if (L.kind === 'SUN') {
      l = new THREE.DirectionalLight(col, 0); l.target.position.copy(V(META.anchors.cabin_wall_centre)); l.position.copy(l.target.position).addScaledVector(D(L.dir), -14); scene.add(l.target);
      l.castShadow = true; const c = l.shadow.camera; c.left = c.bottom = -6; c.right = c.top = 6; c.near = 1; c.far = 40; l.shadow.mapSize.set(2048, 2048); l.shadow.bias = -.0008; l.shadow.normalBias = .02;
    } else if (L.kind === 'SPOT') {
      l = new THREE.SpotLight(col, 0, 0, (L.spot_deg || 40) * D2R / 2, .6, 2); l.position.copy(p); l.target.position.copy(p).add(D(L.dir)); scene.add(l.target);
    } else { l = new THREE.PointLight(col, 0, 0, 2); l.position.copy(p); }
    l.name = 'cabin_' + n; scene.add(l); lights[n] = l;
  }
  const S = { ...META.state_default, ...P }; delete S.keys;
  function setMonitor(src) {
    const o = N('cabin_monitor_pic'); if (!o || !src) return; const m = o.material;
    const apply = t => { t.colorSpace = THREE.SRGBColorSpace; t.flipY = false; m.emissiveMap = t; m.map = null; m.color.set('#000000'); m.emissive.set('#ffffff'); m.needsUpdate = true; };
    if (src.isTexture) apply(src); else new THREE.TextureLoader().load(src, apply);
  }
  function setState(s = {}) {
    Object.assign(S, s); if (typeof S.door === 'string') S.door = { open: 1, closed: 0 }[S.door] ?? 1;
    const K = META.light_kinds[S.mode] || META.light_kinds.day;
    for (const [n, l] of Object.entries(lights)) l.intensity = (K[n] ?? 0) * (l.isDirectionalLight ? SS : LS);
    hemi.color.setRGB(...K.world[0]).convertLinearToSRGB(); hemi.intensity = K.world[1] * 2;
    for (const [n, st] of Object.entries(META.variants)) { const o = N(n); if (o) o.visible = st.includes(S.bag_new_guy); }
    for (const [o, m] of MV) {
      if (m.open) { o.position.copy(V(m.loc)).lerp(V(m.open.loc), +S.door); o.quaternion.copy(Q(m.rot)).slerp(Q(m.open.rot), +S.door); }
      if (m.sway_deg != null) o.quaternion.copy(Q([m.rot[0] + (+S.sway || 0) * m.sway_deg, m.rot[1], m.rot[2]]));
    }
    if (s.monitor) setMonitor(s.monitor);
  }
  // rest pose of a mover + a helper the stretch builders use: mover('magazine').position / .quaternion (three space); rest(name) puts it back
  const mover = n => N(n), rest = n => { const m = MOVERS[n], o = N(n); if (o && m) { o.position.copy(V(m.loc)); o.quaternion.copy(Q(m.rot)); } };
  const K = (P.keys || []).slice().sort((a, b) => a.f - b.f);
  function at(f) {
    if (!K.length) return {}; let a = K[0], b = K[K.length - 1];
    for (let i = 0; i < K.length - 1; i++) if (f >= K[i].f && f <= K[i + 1].f) { a = K[i]; b = K[i + 1]; break; }
    const u = b.f > a.f ? Math.min(1, Math.max(0, (f - a.f) / (b.f - a.f))) : (f >= b.f ? 1 : 0), sm = u * u * (3 - 2 * u), o = {};
    for (const k of ['mode', 'bag_new_guy']) if (a[k] != null || b[k] != null) o[k] = f >= b.f ? (b[k] ?? a[k]) : (a[k] ?? b[k]);
    for (const k of ['door', 'sway']) if (a[k] != null || b[k] != null) { const v0 = a[k] ?? b[k], v1 = b[k] ?? a[k]; o[k] = v0 + (v1 - v0) * sm; }
    return o;
  }
  function update(f, t) { setState(at(f)); }
  setState(); if (P.monitor) setMonitor(P.monitor);
  console.warn('AF_CABIN ' + JSON.stringify({ meshes: root.children.length, glb_tris: Math.round(tris), load_ms: Math.round(performance.now() - t0), mode: S.mode }));
  return { anchors: ANCHORS, cams: CAMS, update, setState, setMonitor, mover, rest };
}

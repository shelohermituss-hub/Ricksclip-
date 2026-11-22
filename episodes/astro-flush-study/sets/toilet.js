// toilet.js: PLACES A + H of astro-flush-study (ship toilet room, under-floor hose bay, WASTE VENT, nozzle, inside of the tube) for the three.js kit.
// Loads sets/toilet/out/toilet_lite.glb + toilet_meta.json, the same scene the Blender stills use (built by sets/toilet/build_toilet.sh).
// NO geometry is made here: everything seen is in the Blender scene. This module only shows/hides variants, moves the named movers and sets emission/lights.
// film.json: "places": { "toilet": { "set": "toilet", "toilet": { "light": "day", "glow": 0, "exploded": 0, "door": 0, "hatch": 0, "pulse": 0, "paper": 0,
//   "keys": [ {"f": 1086, "glow": 0}, {"f": 1090, "glow": 1}, {"f": 1097, "exploded": 0}, {"f": 1104, "exploded": 1} ] } } }
//   light day|night|wide (a step); glow 0..1 = toilet emission + halo lamp + hose ribs; exploded 0..1 = every toilet part from its rest to its exploded
//   transform (meta movers); door 0..1 = door_leaf slides open; hatch 0..1 = hatch_panel swings open; pulse 0..1 = place of the cyan pulse on meta hose_path;
//   paper 0..1 = floating roll (paper < .5) or ribbon into the bowl (>= .5). Numbers are eased (smoothstep) between keys, light and paper are steps.
// Anchors (Blender metres, Z up; ctx.B2T): toilet, toilet_bowl_centre, window, porthole, door, hose_port, hatch, flange, nozzle, tube_in, tube_core, newguy_s1/_s6/_s12, commander_s12 ...
// Cameras: CAMS.f5 f33 f515 f1030 f1105 f1125 f1150 f1190 = {loc, look, roll, vfov} in Blender metres (the proof cameras of sets/toilet/STATE.md).
import { GLTFLoader } from './vendor/GLTFLoader.js';
const DIR = new URL('./toilet/out/', import.meta.url).href;
const META = await (await fetch(DIR + 'toilet_meta.json')).json();
export const ANCHORS = META.anchors, CAMS = META.cams, MOVERS = META.movers, FRAMES = META.frames;
let GLTF = null;
const D2R = Math.PI / 180;
export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, P = pl.toilet || {}, t0 = performance.now();
  const V = p => (ctx.B2T ? ctx.B2T(p) : new THREE.Vector3(p[0], p[2], -p[1]));
  // Blender euler XYZ (degrees) -> glTF/three quaternion: Blender XYZ = three order 'ZYX'; the exporter maps (x, y, z, w) -> (x, z, -y, w)
  const Q = r => { const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(r[0] * D2R, r[1] * D2R, r[2] * D2R, 'ZYX')); return new THREE.Quaternion(q.x, q.z, -q.y, q.w); };
  GLTF ||= await new GLTFLoader().loadAsync(DIR + 'toilet_lite.glb');
  const root = GLTF.scene.clone(true); root.name = 'toilet'; scene.add(root); let tris = 0;
  const N = n => root.getObjectByName(n), mats = {};
  root.traverse(o => {
    if (!o.isMesh) return; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    o.castShadow = o.receiveShadow = !/^(window_view|tube_|hose_pulse)/.test(o.name);
    const m = o.material; if (m.name) mats[m.name] = m; if (m.emissive && m.emissive.getHex() !== 0) m.toneMapped = false;
  });
  const hex = n => new THREE.Color(META.palette[n] || '#ffffff');
  for (const [n, c] of [['porcelain', 'toilet_glow'], ['hose_rib', 'hose_glow'], ['glow_ring', 'glow_ring'], ['hose_glow', 'hose_glow']]) if (mats[n]) { mats[n].emissive = hex(c); mats[n].toneMapped = false; }
  // movers: rest transforms from meta, exploded / open targets
  const MV = Object.entries(MOVERS).map(([n, m]) => [N(n), m]).filter(([o]) => o);
  // lights: one set per kind, made from meta lights (watts -> three intensity by light_scale) and the world colour as a hemisphere fill
  const LS = P.light_scale ?? 0.025, lights = {}, hemi = new THREE.HemisphereLight('#ffffff', '#000000', 0); scene.add(hemi);
  for (const [n, L] of Object.entries(META.lights)) {
    const l = new THREE.PointLight(new THREE.Color(...L.color), 0, 0, 2); l.position.copy(V(L.loc)); l.castShadow = /^key_/.test(n); l.shadow.bias = -.002; l.shadow.normalBias = .03; l.name = 'toilet_' + n; scene.add(l); lights[n] = l;
  }
  const S = { light: 'day', glow: 0, exploded: 0, door: 0, hatch: 0, pulse: 0, paper: 0, ...META.state_default, ...P }; S.door = { open: 1, closed: 0 }[S.door] ?? S.door;
  const HP = META.hose_path.map(V), lerp = (a, b, u) => a + (b - a) * u;
  function setState(s = {}) {
    Object.assign(S, s); if (typeof S.door === 'string') S.door = { open: 1, closed: 0 }[S.door] ?? 0;
    const K = META.light_kinds[S.light] || META.light_kinds.day, g = +S.glow, e = +S.exploded, night = S.light === 'night';
    for (const [n, l] of Object.entries(lights)) l.intensity = (K[n] ?? 0) * LS;
    lights.toilet_glow_light.intensity = g * (night ? 20 : 120) * LS; lights.pulse_light.intensity = 110 * g * LS;
    hemi.color.setRGB(...K.world[0]).convertLinearToSRGB(); hemi.intensity = K.world[1] * 2;
    for (const mn of ['tile_white', 'tile_black']) if (mats[mn]) mats[mn].roughness = K.floor_rough;
    for (const [n, kinds] of Object.entries(META.variants)) { const o = N(n); if (o) o.visible = kinds.includes(S.light); }
    const vd = N('window_view_day'), vn = N('window_view_night'); if (vd) vd.visible = !night; if (vn) vn.visible = night;
    if (mats.porcelain) mats.porcelain.emissiveIntensity = g * (night ? .12 : .35);
    if (mats.hose_rib) mats.hose_rib.emissiveIntensity = g * .3; if (mats.glow_ring) mats.glow_ring.emissiveIntensity = 1.2 * g;   // kit bloom adds the halo: lower than Blender's emission
    if (mats.hose_glow) mats.hose_glow.emissiveIntensity = 2 * g;
    for (const [o, m] of MV) {
      for (const [key, u] of [['exploded', e], ['open', o.name === 'door_leaf' ? +S.door : +S.hatch]]) {
        if (!m[key]) continue;
        o.position.copy(V(m.loc)).lerp(V(m[key].loc), u); o.quaternion.copy(Q(m.rot)).slerp(Q(m[key].rot), u);
        const s0 = m.scale || [1, 1, 1], s1 = m[key].scale || s0; o.scale.set(lerp(s0[0], s1[0], u), lerp(s0[2], s1[2], u), lerp(s0[1], s1[1], u));
      }
    }
    const pu = Math.max(0, Math.min(1, +S.pulse)) * (HP.length - 1), i = Math.min(Math.floor(pu), HP.length - 2), pp = HP[i].clone().lerp(HP[i + 1], pu - i);
    const hp = N('hose_pulse'); if (hp) { hp.position.copy(pp); hp.visible = g > 0; } lights.pulse_light.position.copy(pp).add(new THREE.Vector3(0, .12, 0));
    const day = S.light === 'day', pr = N('paper_roll_float'), rb = N('paper_ribbon'); if (pr) pr.visible = day && S.paper < .5; if (rb) rb.visible = day && S.paper >= .5;
  }
  const K = (P.keys || []).slice().sort((a, b) => a.f - b.f);
  function at(f) {
    if (!K.length) return {}; let a = K[0], b = K[K.length - 1];
    for (let i = 0; i < K.length - 1; i++) if (f >= K[i].f && f <= K[i + 1].f) { a = K[i]; b = K[i + 1]; break; }
    const u = b.f > a.f ? Math.min(1, Math.max(0, (f - a.f) / (b.f - a.f))) : (f >= b.f ? 1 : 0), sm = u * u * (3 - 2 * u), o = {};
    for (const k of ['light', 'paper']) if (a[k] != null || b[k] != null) o[k] = f >= b.f ? (b[k] ?? a[k]) : (a[k] ?? b[k]);
    for (const k of ['glow', 'exploded', 'door', 'hatch', 'pulse']) if (a[k] != null || b[k] != null) { const v0 = a[k] ?? b[k], v1 = b[k] ?? a[k]; o[k] = v0 + (v1 - v0) * sm; }
    return o;
  }
  function update(f, t) { setState(at(f)); }
  setState();
  console.warn('AF_TOILET ' + JSON.stringify({ meshes: root.children.length, glb_tris: Math.round(tris), load_ms: Math.round(performance.now() - t0) }));
  return { anchors: ANCHORS, cams: CAMS, update, setState };
}

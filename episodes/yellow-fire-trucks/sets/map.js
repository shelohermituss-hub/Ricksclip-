// map.js: PLACE C, THE MAP (S4, line 7) for the staging in the three.js kit (set-builder 2026-11-21). It loads the LITE copy of the same world the final
// Blender render uses: sets/map/out/map_lite.glb (written by sets/map/build_map.sh from map.blend) + one tiny lime truck instanced in all 94 bays.
// Story: sets/map_STORY.md. Credits: assets/ASSETS.md (MAP section). Geography and every number: sets/map/scripts/map_geo.py -> out/map_meta.json.
// film.json: "places": { "map": { "set": "map", "light": "noon", "light_over": <LIGHT.map>, "kit3d": { "envGround": "#8a6a4a" },
//      "doors": { "at": 27.78, "wave": 2.4, "dur": 0.5 },      door wave west -> east from film second `at` (row 23); omitted = all open
//      "paint": "lime" | "red" | "wave",                        "wave": a truck turns lime when its door has opened, plus `lime_delay` s (rows 24-25)
//      "sand": 0..1  or  { "at": 32.3, "dur": 0.6 } } }          the paper round DALLAS turns to sand (S4 -> S5 join)
// Returns anchors (plan metres, Z up, the kit maps them with ctx.B2T): map_centre, pine_hollow_station, dallas_label, dallas_station, door_row
// ([x, y, z, city] west -> east), highway_path (Pine Hollow -> Little Rock -> Texarkana -> DALLAS, on the paper), title_block, compass, cities{}.
import { GLTFLoader } from '../assets_prod/vendor/GLTFLoader.js';
const DIR = new URL('./map/out/', import.meta.url).href;
const META = await (await fetch(DIR + 'map_meta.json')).json();
export const LIGHT = META.light;            // { map: {...} } for places.<name>.light_over (= map_api.KIT_LIGHT in Blender)
export const ANCHORS = META.anchors;
const LIME = '#E3EA22', RED = '#D3141C', STUCK = 'DENVER';
let GL = null, TINY = null;
export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, t0 = performance.now();
  GL ||= await new GLTFLoader().loadAsync(DIR + 'map_lite.glb'); TINY ||= await new GLTFLoader().loadAsync(DIR + 'map_truck_tiny.glb');
  const root = GL.scene.clone(true); root.name = 'usa_map'; scene.add(root);
  let tris = 0, meshes = 0; const doors = {}, roots = {}; let sand = null;
  root.traverse(o => {
    if (/^door_\d\d_\d$/.test(o.name)) doors[o.name] = o;
    if (/^st_\d\d$/.test(o.name)) roots[o.name] = o;
    if (!o.isMesh) return; meshes++; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    o.castShadow = !/^MAP_PAPER|^inset_|^table|^sand/.test(o.name); o.receiveShadow = true;
    const m = o.material; if (m.map) m.map.anisotropy = 8;
    if (/^inset_/.test(o.name)) { m.polygonOffset = true; m.polygonOffsetFactor = -2; }
    if (/^sand_blend/.test(o.name)) { sand = o; m.transparent = true; m.depthWrite = false; m.polygonOffset = true; m.polygonOffsetFactor = -4; o.renderOrder = 2; }
  });
  // trucks: one InstancedMesh per tiny-truck material (4 draw calls), nose in each bay, paint per instance (red -> lime)
  const S = META.truck_scale, parts = [], list = [];
  META.stations.forEach((s, i) => [-.19, .19].forEach((cx, k) => list.push({ s, i, k, p: [s.pos[0] + cx, s.pos[1] - .02, s.pos[2] + .008] })));
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2), SC = new THREE.Vector3(S, S, S);
  TINY.scene.updateMatrixWorld(true);
  TINY.scene.traverse(o => {
    if (!o.isMesh) return; const g = o.geometry.clone().applyMatrix4(o.matrixWorld); const m = o.material.clone(); const paint = /paint/.test(m.name);
    if (paint) { m.color.set('#ffffff'); m.roughness = .3; m.metalness = 0; }
    const im = new THREE.InstancedMesh(g, m, list.length); im.castShadow = true; im.receiveShadow = true; im.name = 'map_trucks_' + m.name;
    list.forEach((it, j) => { M.compose(ctx.B2T(it.p), Q, SC); im.setMatrixAt(j, M); if (paint) im.setColorAt(j, new THREE.Color(LIME)); });
    im.instanceMatrix.needsUpdate = true; scene.add(im); tris += (g.index ? g.index.count : g.attributes.position.count) / 3 * list.length; if (paint) parts.push(im);
  });
  const xs = META.stations.map(s => s.pos[0]), x0 = Math.min(...xs), x1 = Math.max(...xs);
  const D = pl.doors || null, wave = D ? (D.wave ?? 2.4) : 0, dur = D ? (D.dur ?? .5) : 1;
  const open = (s, t) => !D ? 1 : Math.max(0, Math.min(1, (t - D.at - wave * (s.pos[0] - x0) / (x1 - x0)) / dur));
  const cRed = new THREE.Color(RED), cLime = new THREE.Color(LIME);
  function update(f, t) {
    META.stations.forEach((s, i) => { const k = open(s, t); for (const d of [0, 1]) { const o = doors['door_' + String(i).padStart(2, '0') + '_' + d]; if (o) o.scale.y = Math.max(.03, 1 - (s.city === STUCK && d === 1 ? Math.min(k, .5) : k)); } });
    const mode = pl.paint || 'lime';
    if (parts.length && mode !== 'lime') list.forEach((it, j) => { const lime = mode === 'wave' ? open(it.s, t - (pl.lime_delay ?? .3)) >= 1 : false; for (const im of parts) im.setColorAt(j, lime ? cLime : cRed); });
    for (const im of parts) if (im.instanceColor) im.instanceColor.needsUpdate = true;
    if (sand) { const v = typeof pl.sand === 'object' && pl.sand ? Math.max(0, Math.min(1, (t - pl.sand.at) / (pl.sand.dur || .6))) : (pl.sand || 0); sand.visible = v > 0; sand.material.opacity = v; }
  }
  update(0, 0);
  console.warn('PHFD_MAP ' + JSON.stringify({ meshes, stations: META.stations.length, trucks: list.length, tris: Math.round(tris), load_ms: Math.round(performance.now() - t0) }));
  return { anchors: ANCHORS, update };
}

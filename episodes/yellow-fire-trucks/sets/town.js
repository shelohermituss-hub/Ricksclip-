// town.js: PLACE A, the town of PINE HOLLOW, for the staging in the three.js kit (set-builder 2026-11-20). It loads the SAME world the final Blender
// render uses: sets/town/out/town.glb (written by sets/town/build_town.sh next to town.blend; heavy trees and grass decimated for the kit only) and the
// two trucks of sets/assets.js (hero in bay 1, the Chief's older red pumper in bay 2). Story and map: sets/town_STORY.md. Credits: assets/ASSETS.md.
// film.json:  "places": { "yard_am": { "set": "town", "kind": "am", "light": "morning", "light_over": <LIGHT.am>, "kit3d": { "envGround": "#8f8a7e" } } }
//   kind 'am' | 'du' (the two LOOK_BIBLE lights; light_over values = export LIGHT, the same numbers as town_api.KIT_LIGHT in Blender)
//   hero: buildTruck opts for the hero (default: AM half-sprayed + masking, DU lemon), chief: opts for the pumper (default red, aged), trucks: false = none
//   card: { png: 'cast/views/chief_34.png', pos: [x, y, z], h: 1.8, face: [x, y] }   a flat cast stand-in (detail gate only)
// Returns anchors (plan metres, Z up): yard_centre, bay1_truck, bay2_truck, station_door, yard_line_start, yard_line_end, shop_window, shop_chair,
// crossing_stop_bar, street_lamp, park_swing, park_fence_gap, water_tower, wall_lamp, bench, hose_reel, yard_drain, shop_lamp, shop_shingle, park_bench, park_tree.
import { GLTFLoader } from '../assets_prod/vendor/GLTFLoader.js';
import { buildTruck, place } from './assets.js';
const DIR = new URL('./town/out/', import.meta.url).href;
const META = await (await fetch(DIR + 'town_meta.json')).json();
export const LIGHT = META.light;            // { am: {...}, du: {...} } for places.<name>.light_over
export const ANCHORS = META.anchors;
let GLTF = null;
export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, du = (pl.kind || 'am') === 'du', t0 = performance.now();
  GLTF ||= await new GLTFLoader().loadAsync(DIR + 'town.glb');
  const root = GLTF.scene.clone(true); root.name = 'pine_hollow'; scene.add(root);     // glTF is Y up with Blender's -Y as +Z: the same map as B2T
  let tris = 0, meshes = 0; const lit = [], lamps = [], grass = [];
  root.traverse(o => {
    if (!o.isMesh) return; meshes++; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    const m = o.material, n = m.name || '';
    o.castShadow = !/^decal_|puddle|glass|win_/.test(n); o.receiveShadow = true;
    if (/^decal_|puddle/.test(n)) { m.transparent = true; m.depthWrite = false; m.polygonOffset = true; m.polygonOffsetFactor = -4; o.renderOrder = 1; o.castShadow = false; }
    if (/^win_lit/.test(n)) lit.push(m);
    if (/^lamp_/.test(n)) lamps.push(m);
    if (n === 'shop_glass') { m.transparent = true; m.opacity = .18; m.depthWrite = false; m.roughness = .02; m.metalness = .2; }
    if (/^tpl_grass|^tpl_dandelion|^tpl_bush|^tpl_island/.test(g.name || o.name)) o.castShadow = false;   // leaf cards: no shadow-map cost in the kit
    if (m.map) m.map.anisotropy = 4;
    if (/^tpl_grass_patch/.test(g.name || '')) grass.push(o);
  });
  // SwiftShader (no GPU) hit the 30 s screenshot limit on the park with all 210 blade patches: keep pl.grass_keep of them (default 0.4) in the kit
  const keep = pl.grass_keep ?? .4; grass.forEach((o, i) => { if ((i * .618) % 1 >= keep) o.visible = false; else o.scale.multiplyScalar(1.15); });
  for (const m of lit) { m.emissiveIntensity = du ? 2.2 : 0; m.needsUpdate = true; }
  for (const m of lamps) { const day = m.name === 'lamp_fluor'; m.emissiveIntensity = du ? 6 : (day ? 2 : 0); m.needsUpdate = true; }
  const A = ANCHORS, V = p => ctx.B2T(p);
  // the practical lamps (Blender: town_api.build_lights): shop amber lamp and bay tubes always, street sodium, station wall lamp and porch at dusk
  const pt = (p, col, I, d) => { const l = new THREE.PointLight(col, I, d, 2); l.position.copy(V(p)); scene.add(l); return l; };
  pt(A.shop_lamp, '#ffb85c', 8, 6); pt([-1.0, -12.3, 3.6], '#ffe0b0', 40, 14); pt([-1.0, -9.0, 2.5], '#fff2dc', 25, 10);   // the shop reads dark in the kit without a stronger fill (sheet 1)
  for (const bx of [-4.2, 4.2]) pt([bx, 27, 4.2], '#f2f4ea', 30, 14);
  if (du) { pt([A.street_lamp[0], A.street_lamp[1], A.street_lamp[2] - .3], '#ffae4a', 120, 24); pt([A.wall_lamp[0], A.wall_lamp[1] - .3, A.wall_lamp[2] - .1], '#ffd49a', 40, 12);
    pt([A.station_door[0] + 1.9, A.station_door[1], 2.4], '#ffd49a', 6, 6); }
  let hero = null, chief = null;
  if (pl.trucks !== false) {
    hero = await buildTruck(THREE, ctx, { ...(du ? { paint: 'lemon', masking: false, letters: 'over' } : { paint: 'half', edge: .3, masking: true, letters: 'under' }), wear: .25, ...(pl.hero || {}) });
    place(THREE, scene, ctx, hero, A.bay1_truck, 90);
    chief = await buildTruck(THREE, ctx, { paint: 'red', masking: false, letters: 'over', wear: .9, drain: du ? 1 : 0, age: 1, sirens: 1, beaconRow: false, priceCard: false, ...(pl.chief || {}) });
    place(THREE, scene, ctx, chief, A.bay2_truck, 90);
  }
  if (pl.card) {                                          // a flat cast stand-in for the detail gate (the real cast comes from film.json acts)
    const c = pl.card, tx = await new THREE.TextureLoader().loadAsync(new URL('../' + c.png, import.meta.url).href); tx.colorSpace = THREE.SRGBColorSpace;
    const w = tx.image.width, h = tx.image.height, s = c.h / (h * .723);
    const card = new THREE.Mesh(new THREE.PlaneGeometry(w * s, h * s), new THREE.MeshBasicMaterial({ map: tx, transparent: true, alphaTest: .4, side: THREE.DoubleSide }));
    card.position.copy(V([c.pos[0], c.pos[1], c.pos[2] + h * s / 2 - (h - 1082) * s])); const f = c.face || [c.pos[0], c.pos[1] - 5];
    card.rotation.y = Math.atan2(f[0] - c.pos[0], -(f[1] - c.pos[1])); card.castShadow = true;   // +Z of the plane turned to the face point (three: B2T)
    card.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tx, alphaTest: .5 }); scene.add(card);
  }
  if (ctx.sky && ctx.sky.clouds && !du) scene.add(ctx.sky.clouds({ kind: 'clear-day', seed: 4 }));
  console.warn('PHFD_TOWN ' + JSON.stringify({ kind: du ? 'du' : 'am', meshes, tris: Math.round(tris), load_ms: Math.round(performance.now() - t0) }));
  return { anchors: A, hero, chief };
}

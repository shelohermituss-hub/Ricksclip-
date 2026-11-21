// dallas.js: PLACE B, the DALLAS FIRE DEPT. STATION 14 yard at hot noon, for the staging in the three.js kit (set-builder 2026-11-21). It loads the SAME
// world the final Blender render uses: sets/dallas/out/dallas.glb (or the LITE staging copy dallas_lite.glb; build_dallas.sh writes both next to dallas.blend)
// and the Dallas pair from sets/assets.js: ENGINE No. 14 red (west) and ENGINE No. 22 lime (east), noses south, nose level, the tally boards between them.
// Story: sets/dallas_STORY.md. Credits: assets/ASSETS.md (DALLAS SET). Light: the one NO noon kind (LOOK_BIBLE), export LIGHT.no = dallas_api.KIT_LIGHT['no'].
// film.json:  "places": { "dallas": { "set": "dallas", "kind": "no", "light": "day", "light_over": <LIGHT.no>, "lite": true, "kit3d": { "envGround": "#cdb690" } } }
//   boards: { n: 1|2|3, ladder: bool, stool: bool, painters: bool, leaves: 0-3 }   story state of the tally (default n 3, ladder, painters; S5 rows 30-32: n 1, no ladder)
//   red / lime: buildTruck opts over the defaults (red: paint 'red'; lime: paint 'lemon'); trucks: false = none; truckFull: true = the full trucks in lite
//   card: { png, pos, h, face } a flat cast stand-in (detail gate only); still: true = no world motion (the STILLNESS 57.75-58.45)
// Returns { anchors, red, lime, nodes } . Anchors (plan metres, Z up): truck_red, truck_lime, clerk_spot, board_red_foot, board_lime_foot, board_red_top_1..3,
// up_to_3x, board_lime_top, calendar, ladder_foot, ladder_top, stool, chalk_table, painters_spot, order_sheet, station_door, bay_red, bay_lime, sign_front,
// station_plate, cooler, flag_pole, water_tank, derrick, far_skyline, yard_centre.
// nodes: { stack2, stack3, ladder, stool, painters, cal1..cal4 } arrays of meshes (toggle .visible; the calendar leaves cal1..4 fly off in row 31).
import { GLTFLoader } from '../assets_prod/vendor/GLTFLoader.js';
import { buildTruck, place } from './assets.js';
const DIR = new URL('./dallas/out/', import.meta.url).href;
const META = await (await fetch(DIR + 'dallas_meta.json')).json();
export const LIGHT = META.light;            // { no: {...} } for places.<name>.light_over
export const ANCHORS = META.anchors;
let FULL = null, LITE = null;
export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, t0 = performance.now(), lite = !!(pl.lite || ctx.lite);
  const G = lite ? (LITE ||= await new GLTFLoader().loadAsync(DIR + 'dallas_lite.glb')) : (FULL ||= await new GLTFLoader().loadAsync(DIR + 'dallas.glb'));
  const root = G.scene.clone(true); root.name = 'dallas'; scene.add(root);      // glTF is Y up with Blender's -Y as +Z: the same map as B2T
  let tris = 0, meshes = 0; const nodes = { stack2: [], stack3: [], ladder: [], stool: [], painters: [], cal1: [], cal2: [], cal3: [], cal4: [] };
  root.traverse(o => {
    const g = (o.userData && o.userData.grp) || ((o.name.match(/^dal_(\w+?)__/) || [])[1]);
    if (g && nodes[g]) nodes[g].push(o);
    if (!o.isMesh) return; meshes++; const ge = o.geometry; tris += (ge.index ? ge.index.count : ge.attributes.position.count) / 3;
    const m = o.material, n = m.name || '';
    o.castShadow = !/^decal_|fence_mesh|glass|win_|haze|ground_far|sand$|drygrass_ground/.test(n); o.receiveShadow = true;
    if (/^decal_/.test(n)) { m.transparent = true; m.depthWrite = false; m.polygonOffset = true; m.polygonOffsetFactor = -4; o.renderOrder = 1; o.castShadow = false; }
    if (n === 'fence_mesh') { m.transparent = false; m.alphaTest = .45; m.side = THREE.DoubleSide; }
    if (/^tpl_grass|^tpl_wild_rooibos/.test(ge.name || o.name)) o.castShadow = false;   // straw cards: no shadow-map cost in the kit
    if (/^lamp_/.test(n)) { m.emissiveIntensity = 2; m.needsUpdate = true; }
    if (m.map) m.map.anisotropy = 4;
  });
  const b = { n: 3, ladder: true, stool: false, painters: true, leaves: 0, ...(pl.boards || {}) };
  const vis = (k, on) => nodes[k].forEach(o => { o.visible = on; });
  vis('stack2', b.n >= 2); vis('stack3', b.n >= 3); vis('ladder', !!b.ladder); vis('stool', !!b.stool); vis('painters', !!b.painters);
  for (let i = 1; i <= 4; i++) vis('cal' + i, i > b.leaves);
  const A = ANCHORS, V = p => ctx.B2T(p);
  for (const bx of [-3.2, 3.2]) { const l = new THREE.PointLight('#f2f4ea', 18, 12, 2); l.position.copy(V([bx, 28, 4.4])); scene.add(l); }   // the bay tubes (Blender: lamp_bay)
  let red = null, lime = null; const lt = lite && pl.truckFull !== true ? { light: true } : {};
  if (pl.trucks !== false) {
    red = await buildTruck(THREE, ctx, { paint: 'red', masking: false, letters: 'over', wear: .45, ribbon: false, sirens: 2, priceCard: false, letters_set: 'truck_letters_dal14', ...lt, ...(pl.red || {}) });
    place(THREE, scene, ctx, red, A.truck_red, 90);
    lime = await buildTruck(THREE, ctx, { paint: 'lemon', masking: false, letters: 'over', wear: .35, ribbon: false, sirens: 2, priceCard: false, letters_set: 'truck_letters_dal22', ...lt, ...(pl.lime || {}) });
    place(THREE, scene, ctx, lime, A.truck_lime, 90);
  }
  if (pl.card) {                                          // a flat cast stand-in for the detail gate (the real cast comes from film.json acts); same maths as town.js
    const c = pl.card, tx = await new THREE.TextureLoader().loadAsync(new URL('../' + c.png, import.meta.url).href); tx.colorSpace = THREE.SRGBColorSpace;
    const w = tx.image.width, h = tx.image.height, s = c.h / (h * .723);
    const card = new THREE.Mesh(new THREE.PlaneGeometry(w * s, h * s), new THREE.MeshBasicMaterial({ map: tx, transparent: true, alphaTest: .4, side: THREE.DoubleSide }));
    card.position.copy(V([c.pos[0], c.pos[1], c.pos[2] + h * s / 2 - (h - 1082) * s])); const f = c.face || [c.pos[0], c.pos[1] - 5];
    card.rotation.y = Math.atan2(f[0] - c.pos[0], -(f[1] - c.pos[1])); card.castShadow = true;
    card.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tx, alphaTest: .5 }); scene.add(card);
  }
  console.warn('PHFD_DALLAS ' + JSON.stringify({ lite, meshes, tris: Math.round(tris), boards: b, load_ms: Math.round(performance.now() - t0) }));
  return { anchors: A, red, lime, nodes };
}

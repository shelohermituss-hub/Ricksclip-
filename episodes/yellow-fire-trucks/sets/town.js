// town.js: PLACE A, the town of PINE HOLLOW, for the staging in the three.js kit (set-builder 2026-11-20). It loads the SAME world the final Blender
// render uses: sets/town/out/town.glb (written by sets/town/build_town.sh next to town.blend; heavy trees and grass decimated for the kit only) and the
// two trucks of sets/assets.js (hero in bay 1, the Chief's older red pumper in bay 2). Story and map: sets/town_STORY.md. Credits: assets/ASSETS.md.
// lite: places.<name>.lite = true loads town_lite.glb (the fast staging copy; the final render stays on Blender's full town).
// film.json:  "places": { "yard_am": { "set": "town", "kind": "am", "light": "morning", "light_over": <LIGHT.am>, "kit3d": { "envGround": "#8f8a7e" } } }
//   kind 'am' | 'du' (the two LOOK_BIBLE lights; light_over values = export LIGHT, the same numbers as town_api.KIT_LIGHT in Blender)
//   hero: buildTruck opts for the hero (default: AM half-sprayed + masking, DU lemon), chief: opts for the pumper (default red, aged), trucks: false = none
//   card: { png: 'cast/views/chief_34.png', pos: [x, y, z], h: 1.8, face: [x, y] }   a flat cast stand-in (detail gate only)
//   air: 1 (default) | 0.5 | 0   FIX 1 air life: AM dust motes in the sun (yard, shop), DU moths + warm mist at the street and wall lamps; drifts per frame (update)
//   FIX 2: bays: 0-1 (default 1) dims the two bay tubes (lights + fluor lens; S8 POV: the Chief's pumper almost invisible); glow: 1 (default) scales the
//     dusk lamp halo (now .9 m sprite + lens 2.5, was 2.6 m + 6: it filled a third of the sky); park_fill: 1 (default) the dusk park fill (Blender lamp_parkfill)
//   FIX 1 also: DU sodium pool (spot + additive decal) under the street lamp, retro blade letters at dusk, shop glass sheen, cut-out leaves and LITE tuft cards
// Returns anchors (plan metres, Z up): yard_centre, bay1_truck, bay2_truck, station_door, yard_line_start, yard_line_end, shop_window, shop_chair,
// crossing_stop_bar, street_lamp, park_swing, park_fence_gap, water_tower, wall_lamp, bench, hose_reel, yard_drain, shop_lamp, shop_shingle, park_bench, park_tree.
import { GLTFLoader } from '../assets_prod/vendor/GLTFLoader.js';
import { buildTruck, place } from './assets.js';
const DIR = new URL('./town/out/', import.meta.url).href;
const META = await (await fetch(DIR + 'town_meta.json')).json();
export const LIGHT = META.light;            // { am: {...}, du: {...} } for places.<name>.light_over
export const ANCHORS = META.anchors;
let GLTF = null, LITE = null;
export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, du = (pl.kind || 'am') === 'du', t0 = performance.now();
  const lite = !!(pl.lite || ctx.lite);   // lite: out/town_lite.glb, the staging copy (about 1 M tris instead of 16 M; build_town.sh makes it; trucks use the 35 k-tri truck_light.glb unless places.<name>.truckFull)
  GLTF = lite ? (LITE ||= await new GLTFLoader().loadAsync(DIR + 'town_lite.glb')) : (GLTF ||= await new GLTFLoader().loadAsync(DIR + 'town.glb'));
  const root = GLTF.scene.clone(true); root.name = 'pine_hollow'; scene.add(root);     // glTF is Y up with Blender's -Y as +Z: the same map as B2T
  let tris = 0, meshes = 0; const lit = [], lamps = [], grass = [], blades = [];
  root.traverse(o => {
    if (!o.isMesh) return; meshes++; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    const m = o.material, n = m.name || '';
    o.castShadow = !/^decal_|puddle|glass|win_/.test(n); o.receiveShadow = true;
    if (/^decal_|puddle/.test(n)) { m.transparent = true; m.depthWrite = false; m.polygonOffset = true; m.polygonOffsetFactor = -4; o.renderOrder = 1; o.castShadow = false; }
    if (/^win_lit/.test(n)) lit.push(m);
    if (/^lamp_/.test(n)) lamps.push(m);
    if (n === 'shop_glass') { m.transparent = true; m.opacity = .34; m.depthWrite = false; m.roughness = .02; m.metalness = .2; m.map = glassSheen(THREE); m.color.set('#ffffff'); }   // FIX 1: a faint reflection (sky sheen + two diagonal streaks)
    if (/^sign_blade/.test(n)) { m.emissive = new THREE.Color('#ffffff'); m.emissiveMap = m.map; blades.push(m); }   // FIX 1: retro-reflective blade letters (lit at dusk, like Blender)
    if (/leaves/.test(n) || n === 'lite_tuft') { m.transparent = false; m.alphaTest = .5; m.depthWrite = true; m.side = THREE.DoubleSide; if (n === 'lite_tuft') o.castShadow = false; }   // FIX 1: cut-out leaves and tufts (no sorting holes)
    if (/^tpl_grass|^tpl_dandelion|^tpl_bush|^tpl_island/.test(g.name || o.name)) o.castShadow = false;   // leaf cards: no shadow-map cost in the kit
    if (m.map) m.map.anisotropy = 4;
    if (/^tpl_grass_patch/.test(g.name || '')) grass.push(o);
  });
  // SwiftShader (no GPU) hit the 30 s screenshot limit on the park with all 210 blade patches: keep pl.grass_keep of them (default 0.4) in the kit
  const keep = pl.grass_keep ?? .4; grass.forEach((o, i) => { if ((i * .618) % 1 >= keep) o.visible = false; else o.scale.multiplyScalar(1.15); });
  for (const m of lit) { m.emissiveIntensity = du ? 2.2 : 0; m.needsUpdate = true; }
  for (const m of blades) { m.emissiveIntensity = du ? .45 : 0; m.needsUpdate = true; }
  const bays = pl.bays ?? 1, glow = pl.glow ?? 1;
  // FIX 2: dusk lens 6 -> 2.5 (the kit bloom made a halo a third of the sky wide); the fluor tubes follow bays
  for (const m of lamps) { const day = m.name === 'lamp_fluor'; m.emissiveIntensity = (day ? (du ? 6 : 2) * bays : (du ? 2.5 * glow : 0)); m.needsUpdate = true; }
  const A = ANCHORS, V = p => ctx.B2T(p);
  // the practical lamps (Blender: town_api.build_lights): shop amber lamp and bay tubes always, street sodium, station wall lamp and porch at dusk
  const pt = (p, col, I, d) => { const l = new THREE.PointLight(col, I, d, 2); l.position.copy(V(p)); scene.add(l); return l; };
  pt(A.shop_lamp, '#ffb85c', 8, 6); pt([-1.0, -12.3, 3.6], '#ffe0b0', 40, 14); pt([-1.0, -9.0, 2.5], '#fff2dc', 25, 10);   // the shop reads dark in the kit without a stronger fill (sheet 1)
  if (bays > 0) for (const bx of [-4.2, 4.2]) pt([bx, 27, 4.2], '#f2f4ea', 30 * bays, 14);
  if (du && (pl.park_fill ?? 1) > 0) pt([37.0, -17.0, 9.0], '#e8d6e4', 70 * (pl.park_fill ?? 1), 28);   // FIX 2: the dusk park fill (Blender lamp_parkfill)
  if (du) { pt([A.street_lamp[0], A.street_lamp[1], A.street_lamp[2] - .3], '#ffae4a', 40, 10);
    // FIX 1: the sodium POOL under the street lamp (Blender: lamp_street spot 5200 W, 100 deg): a spot on road, stop bar and kerb + a soft additive pool decal
    const sl = A.street_lamp, sp = new THREE.SpotLight('#ffa040', 520, 16, Math.PI * .3, .55, 2); sp.position.copy(V([sl[0], sl[1], sl[2] - .2])); sp.target.position.copy(V([sl[0] + .4, sl[1] - .3, 0])); scene.add(sp, sp.target);
    for (const [z, r, op] of [[.012, 4.6, .55], [.215, 4.0, .35]]) { const d = new THREE.Mesh(new THREE.CircleGeometry(r, 48), new THREE.MeshBasicMaterial({ map: poolTex(THREE), transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false }));
      d.rotation.x = -Math.PI / 2; d.position.copy(V([sl[0] + .4, sl[1] - .3, z])); d.renderOrder = 2; d.userData.noExport = true; scene.add(d); } pt([A.wall_lamp[0], A.wall_lamp[1] - .3, A.wall_lamp[2] - .1], '#ffd49a', 40, 12);
    pt([A.station_door[0] + 1.9, A.station_door[1], 2.4], '#ffd49a', 6, 6); }
  let hero = null, chief = null;
  if (pl.trucks !== false) {
    hero = await buildTruck(THREE, ctx, { ...(du ? { paint: 'lemon', masking: false, letters: 'over' } : { paint: 'half', edge: .3, masking: true, letters: 'under' }), wear: .25, ...(lite && pl.truckFull !== true ? { light: true } : {}), ...(pl.hero || {}) });
    place(THREE, scene, ctx, hero, A.bay1_truck, 90);
    chief = await buildTruck(THREE, ctx, { paint: 'red', masking: false, letters: 'over', wear: .9, drain: du ? 1 : 0, age: 1, sirens: 1, beaconRow: false, priceCard: false, ...(lite && pl.truckFull !== true ? { light: true } : {}), ...(pl.chief || {}) });
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
  const air = airLife(THREE, scene, A, V, du, pl.air ?? 1, glow);           // FIX 1: AM dust motes in the sun / DU moths + mist at the lamps (places.<name>.air: 0 = off, 0.5 = half)
  console.warn('PHFD_TOWN ' + JSON.stringify({ lite, kind: du ? 'du' : 'am', meshes, tris: Math.round(tris), load_ms: Math.round(performance.now() - t0) }));
  return { anchors: A, hero, chief, update: (f, t) => air.update(t) };
}

// ---------------------------------------------------------------- FIX 1 helpers (procedural, no extra files): pool decal, glass sheen, air life
let POOL = null, SHEEN = null, DOT = null;
function poolTex(THREE) {                                    // sodium pool: warm centre, long soft falloff
  if (POOL) return POOL; const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, 'rgba(255,170,80,1)'); r.addColorStop(.35, 'rgba(255,150,60,.6)'); r.addColorStop(.7, 'rgba(240,120,50,.18)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, 256, 256);
  POOL = new THREE.CanvasTexture(c); POOL.colorSpace = THREE.SRGBColorSpace; return POOL;
}
function glassSheen(THREE) {                                 // shop window: pale sky sheen, brighter at the top, two soft diagonal streaks (a reflection, not a picture)
  if (SHEEN) return SHEEN; const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d'), v = g.createLinearGradient(0, 0, 0, 256);
  v.addColorStop(0, '#e6eef4'); v.addColorStop(1, '#9fb0bd'); g.fillStyle = v; g.fillRect(0, 0, 512, 256);
  for (const [x, w, a] of [[120, 70, .55], [215, 26, .4], [390, 46, .3]]) { g.save(); g.translate(x, 0); g.transform(1, 0, -.45, 1, 0, 0); const h = g.createLinearGradient(-w, 0, w, 0);
    h.addColorStop(0, 'rgba(255,255,255,0)'); h.addColorStop(.5, `rgba(255,255,255,${a})`); h.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = h; g.fillRect(-w, 0, 2 * w + 140, 256); g.restore(); }
  SHEEN = new THREE.CanvasTexture(c); SHEEN.colorSpace = THREE.SRGBColorSpace; return SHEEN;
}
function dotTex(THREE) {
  if (DOT) return DOT; const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.4, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  DOT = new THREE.CanvasTexture(c); return DOT;
}
function airLife(THREE, scene, A, V, du, amount, glow = 1) {
  // seeded, so a frame renders the same twice (REGLES 4). Plan metres (X east, Y north, Z up) -> three through V (B2T). Every piece is userData.noExport.
  let s = 1970; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647, layers = [];
  const cloud = (n, box, size, col, op, amp, speed, flutter) => {
    n = Math.round(n * amount); if (!n) return; const base = [], ph = [], pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { base.push([box[0][0] + rnd() * (box[1][0] - box[0][0]), box[0][1] + rnd() * (box[1][1] - box[0][1]), box[0][2] + rnd() * (box[1][2] - box[0][2])]); ph.push([rnd() * 6.28, rnd() * 6.28, rnd() * 6.28]); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({ size, map: dotTex(THREE), color: col, transparent: true, opacity: op, depthWrite: false, blending: flutter ? THREE.NormalBlending : THREE.AdditiveBlending, sizeAttenuation: true, toneMapped: false }));
    p.frustumCulled = false; p.userData.noExport = true; scene.add(p);
    const upd = t => { for (let i = 0; i < n; i++) { const b = base[i], q = ph[i], w = speed;
      const x = b[0] + amp * Math.sin(t * w * .7 + q[0]) + (flutter ? .12 * Math.sin(t * 13 + q[1] * 3) : 0), y = b[1] + amp * Math.sin(t * w * .53 + q[1]) + (flutter ? .12 * Math.cos(t * 11 + q[2] * 3) : 0), z = b[2] + amp * .6 * Math.sin(t * w * .9 + q[2]) + (flutter ? .08 * Math.sin(t * 17 + q[0]) : 0);
      const v = V([x, y, z]); pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z; } g.attributes.position.needsUpdate = true; };
    upd(0); layers.push(upd);
  };
  if (!du) {                                                // AM: dust motes catching the low sun over the yard, and in the shop's lamp light
    cloud(700, [[-9, 2.5, .3], [13, 21, 4.5]], .028, '#fff2d6', .55, .35, .25, false);
    cloud(140, [[-5.5, -12.5, .9], [3.5, -8.0, 3.6]], .016, '#ffe6bf', .5, .15, .3, false);
  } else {                                                  // DU: moths fluttering at the street, wall and porch lamps + a soft warm mist ball at each lamp
    const sl = A.street_lamp, wl = A.wall_lamp;
    cloud(26, [[sl[0] - 1.2, sl[1] - 1.2, sl[2] - 1.4], [sl[0] + 1.2, sl[1] + 1.2, sl[2] + .3]], .05, '#e8dcc0', .9, .25, 1.4, true);
    cloud(16, [[wl[0] - .8, wl[1] - .9, wl[2] - .9], [wl[0] + .8, wl[1] + .1, wl[2] + .3]], .04, '#ecdcbc', .9, .2, 1.6, true);
    for (const [p, r, op] of [[[sl[0], sl[1], sl[2] - .45], .9 * glow, .12], [[wl[0], wl[1] - .3, wl[2] - .2], .7 * glow, .12]]) {   // FIX 2: halo 2.6 -> .9 m
      const m = new THREE.SpriteMaterial({ map: dotTex(THREE), color: '#ffb060', transparent: true, opacity: op * amount, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false });
      const sp = new THREE.Sprite(m); sp.position.copy(V(p)); sp.scale.setScalar(r); sp.userData.noExport = true; scene.add(sp);
    }
  }
  return { update: t => layers.forEach(u => u(t)) };
}

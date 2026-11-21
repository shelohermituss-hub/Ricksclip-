// dallas.js: PLACE B, the DALLAS FIRE DEPT. STATION 14 yard at hot noon, for the staging in the three.js kit (set-builder 2026-11-21). It loads the SAME
// world the final Blender render uses: sets/dallas/out/dallas.glb (or the LITE staging copy dallas_lite.glb; build_dallas.sh writes both next to dallas.blend)
// and the Dallas pair from sets/assets.js: ENGINE No. 14 red (west) and ENGINE No. 22 lime (east), noses south, nose level, the tally boards between them.
// Story: sets/dallas_STORY.md. Credits: assets/ASSETS.md (DALLAS SET). Light: the one NO noon kind (LOOK_BIBLE), export LIGHT.no = dallas_api.KIT_LIGHT['no'].
// film.json:  "places": { "dallas": { "set": "dallas", "kind": "no", "light": "day", "light_over": <LIGHT.no>, "lite": true, "kit3d": { "envGround": "#cdb690" } } }
//   boards: { n: 1|2|3, ladder: bool | 'side', stool: bool, painters: bool, leaves: 0-4, ground: 0-4 }   story state of the tally (default n 3, ladder, painters; S5 rows 30-32: n 1, no ladder)
//     FIX 2: ladder 'side' = leaning on the stack's west edge (UP TO 3x and RED read in the wide; anchors ladder_side_foot / ladder_side_top);
//     ground = torn YEAR leaves lying on the concrete (default 3 as before; YEAR 4 lies by the red truck's nose). setLadder(v) / setGround(k) at run time.
//   env: false = no painted studio sky on the set's metals (FIX 2: on by default, ladder/galvanised read black without it)
//   air: 1 (default) | 0.5 | 0   FIX 2 air life: noon dust motes over the apron, chalk dust at the boards, flies at the cooler (per-frame drift in update)
//   red / lime: buildTruck opts over the defaults (red: paint 'red'; lime: paint 'lemon'); trucks: false = none; truckFull: true = the full trucks in lite
//   card: { png, pos, h, face } a flat cast stand-in (detail gate only)
//   still: true = no world motion at all | [t0, t1] (seconds) = frozen between t0 and t1, no jump (the S7 STILLNESS 1730-1754 = [57.667, 58.467])
// Returns { anchors, red, lime, nodes, update(f, t), setLadder(v), setGround(k) } . Call update from the stretch's own update for the air life. Anchors (plan metres, Z up): truck_red, truck_lime, clerk_spot, board_red_foot, board_lime_foot, board_red_top_1..3,
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
  let tris = 0, meshes = 0; const nodes = { stack2: [], stack3: [], ladder: [], stool: [], painters: [], cal1: [], cal2: [], cal3: [], cal4: [], gl1: [], gl2: [], gl3: [], gl4: [] };
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
    if (m.metalness > .5 && !m.envMap && pl.env !== false) { m.envMap = studioEnv(THREE); m.envMapIntensity = 1.0; }   // FIX 2: metal read black (no env map in the kit)
  });
  const b = { n: 3, ladder: true, stool: false, painters: true, leaves: 0, ...(pl.boards || {}) };
  const vis = (k, on) => nodes[k].forEach(o => { o.visible = on; });
  vis('stack2', b.n >= 2); vis('stack3', b.n >= 3); vis('ladder', !!b.ladder); vis('stool', !!b.stool); vis('painters', !!b.painters);
  for (let i = 1; i <= 4; i++) vis('cal' + i, i > b.leaves);
  // FIX 2: ladder 'side' (move only the group's top nodes, so a child is not shifted twice) and the leaves on the ground
  const DX = META.ladder_side_dx ?? -.9, lad = nodes.ladder.filter(o => !nodes.ladder.includes(o.parent));
  lad.forEach(o => { o.userData.baseX = o.position.x; });
  const setLadder = v => { lad.forEach(o => { o.position.x = o.userData.baseX + (v === 'side' ? DX : 0); }); vis('ladder', !!v); };
  const setGround = k => { for (let i = 1; i <= 4; i++) vis('gl' + i, i <= k); };
  setLadder(b.ladder); setGround(b.ground ?? 3);
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
  const air = airLife(THREE, scene, A, V, pl.air ?? 1), still = pl.still;
  const update = (f, t) => { if (still === true) return; let tt = t; if (Array.isArray(still) && t >= still[0]) tt = t <= still[1] ? still[0] : t - (still[1] - still[0]); air.update(tt); };
  console.warn('PHFD_DALLAS ' + JSON.stringify({ lite, meshes, tris: Math.round(tris), boards: b, load_ms: Math.round(performance.now() - t0) }));
  return { anchors: A, red, lime, nodes, update, setLadder, setGround };
}

// ---------------------------------------------------------------- FIX 2 air life (seeded, procedural; the same drift maths as town.js airLife). Plan metres -> three via V.
let DOT = null, ENV = null;
function studioEnv(THREE) {                 // FIX 2: a painted noon sky + pale apron horizon as the reflection of the set's metals (same idea as prop_kit.js studioEnv)
  if (ENV) return ENV; const c = document.createElement('canvas'); c.width = 256; c.height = 128; const x = c.getContext('2d'), gr = x.createLinearGradient(0, 0, 0, 128);
  gr.addColorStop(0, '#8fb4ee'); gr.addColorStop(.46, '#e9eef4'); gr.addColorStop(.52, '#d6d8d6'); gr.addColorStop(1, '#8a8a86'); x.fillStyle = gr; x.fillRect(0, 0, 256, 128);
  x.fillStyle = '#fffbea'; x.fillRect(150, 8, 20, 20);
  ENV = new THREE.CanvasTexture(c); ENV.mapping = THREE.EquirectangularReflectionMapping; ENV.colorSpace = THREE.SRGBColorSpace; return ENV;
}
function dotTex(THREE) {
  if (DOT) return DOT; const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.4, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  DOT = new THREE.CanvasTexture(c); return DOT;
}
function airLife(THREE, scene, A, V, amount) {
  let s = 1414; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647, layers = [];
  const cloud = (n, box, size, col, op, amp, speed, flutter) => {
    n = Math.round(n * amount); if (!n) return; const base = [], ph = [], pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      base.push([0, 1, 2].map(k => box[0][k] + rnd() * (box[1][k] - box[0][k]))); ph.push([rnd() * 6.28, rnd() * 6.28, rnd() * 6.28]);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({ size, map: dotTex(THREE), color: col, transparent: true, opacity: op, depthWrite: false,
      blending: flutter ? THREE.NormalBlending : THREE.AdditiveBlending, sizeAttenuation: true, toneMapped: false }));
    p.frustumCulled = false; p.userData.noExport = true; scene.add(p);
    const upd = t => {
      for (let i = 0; i < n; i++) {
        const b = base[i], q = ph[i], fl = flutter ? .1 : 0;
        const v = V([b[0] + amp * Math.sin(t * speed * .7 + q[0]) + fl * Math.sin(t * 13 + q[1] * 3), b[1] + amp * Math.sin(t * speed * .53 + q[1]) + fl * Math.cos(t * 11 + q[2] * 3),
          b[2] + amp * .6 * Math.sin(t * speed * .9 + q[2])]);
        pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
      }
      g.attributes.position.needsUpdate = true;
    };
    upd(0); layers.push(upd);
  };
  cloud(600, [[-9, 1.0, .3], [9, 21, 4.0]], .026, '#fff6e2', .45, .35, .22, false);
  const bf = A.board_red_foot || [-.95, 8.15, .12];
  cloud(90, [[bf[0] - .9, bf[1] - .9, .2], [bf[0] + 2.4, bf[1] + .1, 2.6]], .014, '#f4f2ea', .55, .12, .35, false);
  const co = A.cooler || [0, 21.55, .93];
  cloud(9, [[co[0] - .7, co[1] - .8, .6], [co[0] + .7, co[1] - .1, 1.6]], .03, '#2a2622', .9, .25, 1.6, true);
  return { update: t => layers.forEach(u => u(t)) };
}

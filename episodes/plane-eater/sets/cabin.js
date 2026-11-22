// cabin.js: PLACE C, the airliner cabin row (rows 35-38) for the three.js kit (set-builder 2026-11-21). Loads sets/cabin/out/cabin_lite.glb (+ cabin_meta.json),
// the same set the Blender final uses (built by sets/cabin/build_cabin.sh). Michel = window seat 0A (y 1.2), the owner = aisle seat 0B (y .68), nose +X.
// film.json: "places": { "cabin": { "set": "cabin", "cabin": { "bitten": 0, "foil": 0, "pea": 0, "keys": [ {"f": 0, "foil": 0}, {"f": 12, "foil": 1}, {"f": 59, "bitten": 1} ] } } }
//   bitten 0/1 = tray_table -> tray_table_bitten (a step at FOOD 33.38); foil 0/1 = meal_foil_on -> meal_foil_lifted (a step); pea 0..1 = pea_runaway rolls off the tray edge.
// Anchors (Blender metres, Z up; ctx.B2T): michel_seat, owner_seat, tray_table, meal_tray, foil_lid, pea_runaway, window, wing_bite, aisle_y, rows_x.
// Cameras: CAMS.CAM_TWO (row 35 two-shot from the aisle), CAM_TRAY (rows 36-37), CAM_WINDOW (row 38, the bitten wing through the window).
import { GLTFLoader } from './vendor/GLTFLoader.js';
const DIR = new URL('./cabin/out/', import.meta.url).href;
const META = await (await fetch(DIR + 'cabin_meta.json')).json();
export const ANCHORS = META.anchors, CAMS = META.cams;
let GLTF = null;
export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, P = pl.cabin || {}, V = p => ctx.B2T(p), t0 = performance.now();
  GLTF ||= await new GLTFLoader().loadAsync(DIR + 'cabin_lite.glb');
  const root = GLTF.scene.clone(true); root.name = 'cabin'; scene.add(root); let tris = 0;
  root.traverse(o => {
    if (!o.isMesh) return; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    o.castShadow = o.receiveShadow = !/^cloud_|^sky_dome/.test(o.name);
    const m = o.material; if (m.emissive && m.emissive.getHex() !== 0) m.toneMapped = false;
    if (/chrome|intake/.test(m.name)) { m.metalness = Math.min(m.metalness, .55); m.roughness = Math.max(m.roughness, .3); }
    if (/glass|cup|cutlery/.test(m.name)) { m.transparent = true; m.depthWrite = false; }
    if (/^window_glass/.test(o.name)) { m.transparent = true; m.opacity = Math.min(m.opacity, .18); m.depthWrite = false; }   // S5 2026-11-22: clear glass so the sky card and the wing read
  });
  // S5 builder 2026-11-22 WILD ROW: film.json places.cabin.wild = ["8A", "8B"] lifts the upper seat backs (back, shell, covers, headrest, pocket, latch, belts)
  // of the row in front, as a film crew pulls a seat row, so the lens can sit in front of the two men; seat pans, legs and the tray table stay.
  const WILD = new Set(P.wild || []);
  if (WILD.size) root.traverse(o => { const m = /^seat_(-?\d+[A-F])_(back|shell|cover|cover_top|cover_txt|headrest|pocket|safety_card|tray_latch|belt_1|belt_-1|buckle)$/.exec(o.name); if (m && WILD.has(m[1])) o.visible = false; if (WILD.has('8B') && o.name === 'tray_table_B_stowed') o.visible = false; });
  // S5 builder 2026-11-22 SKY CARD (the known fault: the windows read flat grey; the look card used a card too, look/look_cabin.py): a bright
  // sky-above-the-clouds card outside the left windows, beyond the wing: deep blue top, pale blue horizon, a white cumulus deck with light-blue shade low.
  if (P.sky_card !== false) {
    const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const g = cv.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#2f6fd0'); gr.addColorStop(.45, '#8cc0ee'); gr.addColorStop(.58, '#d9ecfb'); gr.addColorStop(1, '#eef6ff'); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    let sd = 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 140; i++) { const x = rnd() * 1024, y = 300 + rnd() * 200, r = 18 + rnd() * 46; g.fillStyle = '#b9d3ee'; g.beginPath(); g.arc(x, y + r * .25, r, 0, 7); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x - r * .1, y, r * .9, 0, 7); g.fill(); }
    const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace;
    const card = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.MeshBasicMaterial({ map: tx, toneMapped: false, fog: false }));
    card.name = 'sky_card'; card.position.copy(V([0, 14, -3])); card.lookAt(V([0, 0, -3])); card.userData.noExport = true; scene.add(card);
  }
  // S5 fix round 2026-11-22: "wing_offset": [dx, dy, dz] (plan metres) moves the whole outside wing (wing, winglet, engine, flap canoes, nav light)
  // so its bite (anchors.wing_bite) lands on the ray of the film's own window station (make_film.py computes it); "foil_raise" lifts the lifted foil higher (m).
  if (P.wing_offset) { const d = V(P.wing_offset).sub(V([0, 0, 0])); root.traverse(o => { if (/^(wing_left|winglet|engine_|flap_|nav_light)/.test(o.name) && !/^(wing_left|winglet|engine_|flap_|nav_light)/.test((o.parent || {}).name || '')) o.position.add(d); }); }
  const N = n => root.getObjectByName(n), tray = N('tray_table'), trayB = N('tray_table_bitten'), foilOn = N('meal_foil_on'), foilUp = N('meal_foil_lifted'), pea = N('pea_runaway');
  const pea0 = pea ? pea.position.clone() : null;
  // S5 builder 2026-11-22: "meal" 0..1 = Michel slides the grey meal aside with one finger (row 36, toward the owner's side, 14 cm); all meal_* nodes ride together
  const meal = []; root.traverse(o => { if (/^meal_/.test(o.name) && !(o.parent && /^meal_/.test(o.parent.name))) meal.push([o, o.position.clone()]); });
  const sun = new THREE.DirectionalLight('#fff6e8', 3.2); sun.position.copy(V([-3, 10, 7])); sun.target.position.copy(V([0, 0, 0])); sun.castShadow = true; scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight('#e8f0ff', '#6a7896', 1.3));
  for (const s of [1, -1]) { const l = new THREE.PointLight('#fff6ec', 2.2, 5, 2); l.position.copy(V([.4, s * .8, 2.1])); scene.add(l); }
  const S = { bitten: P.bitten ?? 0, foil: P.foil ?? 0, pea: P.pea ?? 0, meal: P.meal ?? 0 };
  function setState(s = {}) {
    Object.assign(S, s); const b = S.bitten >= .5, f = S.foil >= .5;
    if (tray) tray.visible = !b; if (trayB) trayB.visible = b; if (foilOn) foilOn.visible = !f; if (foilUp) foilUp.visible = f; if (foilUp && P.foil_raise) { foilUp.userData.p0 ||= foilUp.position.clone(); foilUp.position.copy(foilUp.userData.p0).add(new THREE.Vector3(-.04, P.foil_raise, 0)); }
    meal.forEach(([o, p0]) => o.position.copy(p0).add(new THREE.Vector3(0, 0, .14 * S.meal)));
    if (pea) { const u = S.pea; pea.position.copy(pea0).add(new THREE.Vector3(-.06 * u, -(u > .7 ? (u - .7) * (u - .7) * 6 : 0), .0)); }
  }
  const K = (P.keys || []).slice().sort((a, b) => a.f - b.f);
  function at(f) {
    if (!K.length) return {}; let a = K[0], b = K[K.length - 1];
    for (let i = 0; i < K.length - 1; i++) if (f >= K[i].f && f <= K[i + 1].f) { a = K[i]; b = K[i + 1]; break; }
    const u = b.f > a.f ? Math.min(1, Math.max(0, (f - a.f) / (b.f - a.f))) : 1, o = {};
    for (const k of ['bitten', 'foil']) o[k] = f >= b.f ? (b[k] ?? a[k] ?? S[k]) : (a[k] ?? S[k]);          // posed steps
    for (const k of ['meal']) if (a[k] != null || b[k] != null) { const v0 = a[k] ?? b[k], v1 = b[k] ?? a[k], e = u * u * (3 - 2 * u); o[k] = v0 + (v1 - v0) * e; }
    if (a.pea != null || b.pea != null) o.pea = (a.pea ?? b.pea) + ((b.pea ?? a.pea) - (a.pea ?? b.pea)) * u;
    return o;
  }
  function update(f, t) { setState(at(f)); }
  setState();
  console.warn('PE_CABIN ' + JSON.stringify({ meshes: root.children.length, glb_tris: Math.round(tris), load_ms: Math.round(performance.now() - t0) }));
  return { anchors: ANCHORS, cams: CAMS, update, setState };
}

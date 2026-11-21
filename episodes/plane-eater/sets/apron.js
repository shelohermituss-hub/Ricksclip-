// apron.js: THE AIRFIELD APRON of AERODROME DE VILLEBRUNE (plane-eater) for the staging in the three.js kit (set-builder 2026-11-21).
// It loads the SAME world the final Blender render uses: sets/apron/out/apron_lite.glb (written by sets/apron/build_apron.sh next to apron.blend,
// about 0.4 M tris). The Cessna is NOT in it: the hero prop comes from props/out (cessna150*.glb) onto ANCHORS.cessna_spot (nose -Y, south).
// film.json:  "places": { "apron_day": { "set": "apron", "kind": "day", "light_over": <LIGHT.day> } }
//   kind 'day' | 'dusk' | 'winter'   dusk = the four gooseneck work lamps over the hangar sign + the hangar tubes snap on (row 27); winter = snow tint on lawn
//   air: 1 (default) | 0.5 | 0     dust motes in the sun over the table and in the hangar mouth (drift per frame), slow (row 4: "dust specks slow")
//   wind: 1 (default)               the windsock sways (out of phase with the grass); signs, plaque and poster stay still and flat (CB 2026-11-13)
// Returns anchors (plan metres, Z up): cessna_spot, apron_centre, hangar_door_gap, hangar_mouth, hangar_sign, hazard_plaque, poster_1978, owner_polish_spot,
//   table_centre, table_seat, oil_glass, water_jug, scale_spot, salt_spot, chair, owner_deckchair, windsock, fence_gate, tree_table, lens_band_hook.
import { GLTFLoader } from '../../yellow-fire-trucks/assets_prod/vendor/GLTFLoader.js';
const DIR = new URL('./apron/out/', import.meta.url).href;
const META = await (await fetch(DIR + 'apron_meta.json')).json();
export const LIGHT = META.light;
export const ANCHORS = META.anchors;
let GLTF = null;
export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, kind = pl.kind || 'day', dusk = kind === 'dusk', t0 = performance.now();
  GLTF ||= await new GLTFLoader().loadAsync(DIR + 'apron_lite.glb');
  const root = GLTF.scene.clone(true); root.name = 'villebrune_apron'; scene.add(root);
  let tris = 0, meshes = 0; const lamps = [], sock = [];
  root.traverse(o => {
    if (!o.isMesh) return; meshes++; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    const m = o.material, n = m.name || '';
    o.castShadow = !/glass|air_mote|lawn|far_|tufts|blade/.test(n + o.name); o.receiveShadow = true;
    if (/glass|water_clear/.test(n)) { m.transparent = true; m.depthWrite = false; }
    if (/^clad_|corr/.test(o.name) || /hangar_sage|leaves|card/.test(n)) m.side = THREE.DoubleSide;
    if (/bulb_work/.test(n)) lamps.push(m);
    if (n === 'lamp_fluor') m.emissiveIntensity = dusk ? 4 : 2;
    if (n === 'oil_amber') m.emissiveIntensity = .25;                     // the warmest thing on the table glows a little, like wine in sun
    if (n === 'air_mote' || /^contact_/.test(o.name)) o.visible = false;   // Blender-only contact discs (kit: its own shadows)                              // the kit draws its own drifting motes (below)
    if (o.name.startsWith('windsock')) sock.push(o);
    if (kind === 'winter' && /^lawn|lawn_mown/.test(n)) m.color.set('#cfe0f5');
    if (m.map) m.map.anisotropy = 4;
  });
  for (const m of lamps) { m.emissiveIntensity = dusk ? 6 : 0; m.needsUpdate = true; }
  const A = ANCHORS, V = p => ctx.B2T(p);
  if (dusk) for (const x of [-6.6, -2.2, 2.2, 6.6]) {                    // the work lamps (Blender lamp_work_*: spot 600 W, 80 deg)
    const sp = new THREE.SpotLight('#ffd49a', 60, 14, Math.PI * .22, .5, 2); sp.position.copy(V([x, 8.28, 6.25])); sp.target.position.copy(V([x, 5.5, 0])); scene.add(sp, sp.target);
  }
  for (const y of [13, 21]) { const l = new THREE.PointLight('#f4f6ff', dusk ? 40 : 25, 16, 2); l.position.copy(V([0, y, 4.6])); scene.add(l); }   // the hangar tubes keep the mouth bright
  const air = motes(THREE, scene, V, pl.air ?? 1), wind = pl.wind ?? 1, sock0 = sock.map(o => o.rotation.clone());
  console.warn('PE_APRON ' + JSON.stringify({ kind, meshes, tris: Math.round(tris), load_ms: Math.round(performance.now() - t0) }));
  return { anchors: A, update: (f, t) => { air(t); sock.forEach((o, i) => { o.rotation.y = sock0[i].y + wind * .05 * Math.sin(t * 1.3); }); } };
}
function motes(THREE, scene, V, amount) {            // seeded: a frame renders the same twice
  let s = 1978; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647, n = Math.round(160 * amount); if (!n) return () => {};
  const c = document.createElement('canvas'); c.width = c.height = 64; const g2 = c.getContext('2d'), r = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g2.fillStyle = r; g2.fillRect(0, 0, 64, 64);
  const base = [], ph = [], pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const z = i < n / 2; base.push(z ? [2.0 + rnd() * 3.4, -1.6 + rnd() * 2.4, .7 + rnd() * 1.4] : [-3.5 + rnd() * 7, 8.5 + rnd() * 3, .5 + rnd() * 3.5]); ph.push([rnd() * 6.3, rnd() * 6.3]); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ size: .022, map: new THREE.CanvasTexture(c), color: '#fff2d6', transparent: true, opacity: .6, depthWrite: false, blending: THREE.AdditiveBlending }));
  p.frustumCulled = false; p.userData.noExport = true; scene.add(p);
  const upd = t => { for (let i = 0; i < n; i++) { const b = base[i], q = ph[i], v = V([b[0] + .25 * Math.sin(t * .17 + q[0]), b[1] + .2 * Math.sin(t * .13 + q[1]), b[2] + .12 * Math.sin(t * .21 + q[0] + q[1])]);
    pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z; } g.attributes.position.needsUpdate = true; };
  upd(0); return upd;
}

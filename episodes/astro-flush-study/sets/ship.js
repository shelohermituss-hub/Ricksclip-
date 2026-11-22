// ship.js: PLACE ship of astro-flush-study (LOOK_INVENTORY B + F + G) for the three.js kit. ONLY loads sets/ship/out/ship_lite.glb (+ ship_meta.json)
// and applies states; NO geometry is made here (everything seen is in the Blender scene built by sets/ship/build_ship.sh).
// film.json: "places": { "ship": { "set": "ship", "ship": { "flame": 0, "glitter": 0, "keys": [ {"f": 96, "flame": 0}, {"f": 110, "flame": 1}, {"f": 772, "comm": 1} ] } } }
// States (same names as scripts/ship_api.py): flame 0-1, preglow 0-1, glitter 0-1 (4 trail steps + collar puff), glitter_ck 0-1 (3 steps), comm 0/1,
// digits 0-3, starmap 0-1, ship [x,y,z,rx,ry,rz] (ship_root, Blender metres/degrees), earth [x,y,z,R], fan (deg). Anchors / cams: META.anchors, META.cams.
import { GLTFLoader } from './vendor/GLTFLoader.js';
const DIR = new URL('./ship/out/', import.meta.url).href;
const META = await (await fetch(DIR + 'ship_meta.json')).json();
export const ANCHORS = META.anchors, CAMS = META.cams;
let GLTF = null;
export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, P = pl.ship || {}, t0 = performance.now(), D2R = Math.PI / 180;
  GLTF ||= await new GLTFLoader().loadAsync(DIR + 'ship_lite.glb');
  const root = GLTF.scene.clone(true); root.name = 'ship'; scene.add(root); let tris = 0;
  root.traverse(o => {
    if (!o.isMesh) return; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    o.castShadow = o.receiveShadow = !/^(sky_dome|earth|glitter|flame|canopy_glass|star_map)/.test(o.name);
    const m = o.material; if (m.emissive && m.emissive.getHex() !== 0) m.toneMapped = false;
    if (/glass|flame|earth_rim|star_map|lodestar|glitter/.test(m.name) || m.opacity < 1) { m.transparent = true; m.depthWrite = false; }
    if (o.name === 'sky_dome') { m.side = THREE.BackSide; m.fog = false; }
  });
  const N = n => root.getObjectByName(n), vis = (n, on) => { const o = N(n); if (o) o.visible = !!on; };
  // the GLB carries tiny stand-in pictures for the Earth and the sky (Blender keeps the big ones): load the kit JPEGs written by make_tex.py
  const TL = new THREE.TextureLoader();
  for (const [obj, file] of Object.entries(META.kit_pictures || {})) {
    const o = N(obj); if (!o) continue; const tx = await TL.loadAsync(DIR + file); tx.colorSpace = THREE.SRGBColorSpace; tx.flipY = false;
    o.traverse(m => { if (m.isMesh) { m.material = m.material.clone(); m.material.map = tx; if (m.material.emissiveMap !== undefined) m.material.emissiveMap = tx; m.material.needsUpdate = true; } });
  }
  // the kit camera sees 600 m at most: the 20 km sky dome is shrunk to 500 m, and a far Earth is pulled in along its direction keeping its size in view
  const sky = N('sky_dome'); if (sky) sky.scale.setScalar(.025);
  // round 3 SPACE LIGHT (no geometry): hide the kit's gradient sky dome (film.js baseLight), no fog, black background, the kit's hemisphere fill
  // turned to a faint navy and its sun put where Blender's space key is; star dome, Earth and rim unlit (basic, toneMapped false) so they show as in Blender
  if (P.fog !== true) {
    scene.fog = null; scene.background = new THREE.Color('#000005');
    scene.children.forEach(o => { if (o === root) return; if (o.isMesh && o.userData.noExport && o.material && o.material.side === THREE.BackSide) o.visible = false;
      if (o.isHemisphereLight) { o.color.set('#2a3060'); o.groundColor.set('#000000'); o.intensity = .35; }
      if (o.isDirectionalLight) { o.color.set('#ffffff'); o.intensity = 3.2; o.position.copy(ctx.B2T([.2, .5, .85]).multiplyScalar(60)); } });
  }
  const basic = (o, opt) => { if (o) o.traverse(m => { if (m.isMesh) m.material = new THREE.MeshBasicMaterial(Object.assign({ toneMapped: false, fog: false }, opt(m.material))); }); };
  basic(N('sky_dome'), m => ({ map: m.map, side: THREE.DoubleSide }));
  basic(N('earth'), m => ({ map: m.map }));
  basic(N('earth_rim'), () => ({ color: '#bfeaff', transparent: true, opacity: .35, side: THREE.BackSide, depthWrite: false }));
  const ct = await new THREE.TextureLoader().loadAsync(DIR + 'cloud_tile_kit.png'); ct.wrapS = ct.wrapT = THREE.RepeatWrapping; ct.repeat.set(6, 3); ct.colorSpace = THREE.SRGBColorSpace;
  basic(N('earth_clouds'), () => ({ map: ct, transparent: true, depthWrite: false }));
  const FL = { flame_core: ['#fefefe', 1], flame_mid: ['#cbaaf1', .55], flame_outer: ['#8a6ee7', .35], flame_halo: ['#6d51b8', .22], flame_glow: ['#8a6ee7', .1] };
  for (const [n, [c, a]] of Object.entries(FL)) basic(N(n), () => ({ color: c, transparent: a < 1, opacity: a, depthWrite: false }));
  root.traverse(o => { if (o.isMesh && /^glitter/.test(o.name)) o.material = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }); });   // space: no kit fog (it greys the stars and the hull); film.json places.ship.ship.fog = true keeps it
  const shipRoot = N('ship_root'), earth = N('earth'), flames = ['flame_core', 'flame_mid', 'flame_outer', 'flame_halo', 'flame_glow'].map(N).filter(Boolean);
  const nozzleMat = (N('nozzle_glow') || {}).material, B2T = ctx.B2T;
  const S = Object.assign({}, META.state_default, P);
  function setState(s = {}) {
    Object.assign(S, s);
    if (shipRoot && S.ship) { shipRoot.position.copy(B2T(S.ship.slice(0, 3))); shipRoot.rotation.set(S.ship[3] * D2R, S.ship[5] * D2R, -S.ship[4] * D2R); }
    if (earth && S.earth) { const p = B2T(S.earth.slice(0, 3)), d = p.length(), k = d > 420 ? 420 / d : 1; earth.position.copy(p.multiplyScalar(k)); earth.scale.setScalar(S.earth[3] * k);
      earth.rotation.set(75 * D2R, 30 * D2R, 0, 'YXZ'); }   // the api turns the equator toward the lens (Blender x 75, z 30)
    const f = +S.flame; flames.forEach(o => { o.visible = f > .001; o.scale.set(Math.max(f, .001), .45 + .55 * f, .45 + .55 * f); });   // glTF is Y-up: Blender x stays x, the width axes are y and z
    if (nozzleMat) nozzleMat.emissiveIntensity = 8 * Math.max(+S.preglow, f > 0 ? 1 : 0);
    for (let k = 0; k < 4; k++) vis('glitter_trail_' + k, S.glitter > k / 4); vis('glitter_collar', S.glitter >= .5);
    for (let k = 0; k < 3; k++) vis('glitter_cockpit_' + k, S.glitter_ck > k / 3);
    const c = +S.comm; vis('comm_lamp_on', c); vis('comm_lamp_off', !c); vis('mfd_on', c); vis('mfd_off', !c);
    for (let k = 0; k < 4; k++) vis('radio_digits_' + k, (S.digits | 0) === k);
    vis('star_map_sheet', S.starmap > 0); vis('star_map_tape', S.starmap > 0);
    for (const n of ['solar_fan_p', 'solar_fan_n']) for (const o of [N(n), N(n + '_spokes')]) if (o) o.rotation.z = -(S.fan || 0) * D2R;
  }
  const K = (P.keys || []).slice().sort((a, b) => a.f - b.f), STEP = ['comm', 'digits', 'shot'];
  function at(f) {
    if (!K.length) return {}; let a = K[0], b = K[K.length - 1];
    for (let i = 0; i < K.length - 1; i++) if (f >= K[i].f && f <= K[i + 1].f) { a = K[i]; b = K[i + 1]; break; }
    const u = b.f > a.f ? Math.min(1, Math.max(0, (f - a.f) / (b.f - a.f))) : 1, e = u * u * (3 - 2 * u), o = {};
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (k === 'f') continue; const v0 = a[k] ?? b[k], v1 = b[k] ?? a[k];
      o[k] = STEP.includes(k) ? (f >= b.f ? v1 : v0) : Array.isArray(v0) ? v0.map((x, i) => x + (v1[i] - x) * e) : v0 + (v1 - v0) * e;
    }
    return o;
  }
  function update(f) { setState(at(f)); }
  setState();
  console.warn('AF_SHIP ' + JSON.stringify({ meshes: root.children.length, glb_tris: Math.round(tris), load_ms: Math.round(performance.now() - t0) }));
  return { anchors: ANCHORS, cams: CAMS, update, setState };
}

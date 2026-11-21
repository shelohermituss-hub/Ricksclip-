// lamproom.js: PLACE D, THE LAMP ROOM BEHIND THE EYE (the signature, rows 36-39, 40.24-43.94 s) for the three.js kit (set-builder 2026-11-21).
// It loads the SAME room the Blender final uses: sets/lamproom/out/lamproom_lite.glb (shell, bulkhead + chrome entry ring + reflector, iris with the
// morph 'open', catwalk, relay box, cables, Poly Haven meter and cabinet) written by sets/lamproom/build_lamproom.sh next to lamproom.blend, and
// instances the 4,376 lamps from lamproom_meta.json (same positions, kinds, states and wave groups as Blender). Story: sets/lamproom_STORY.md.
// film.json: "places": { "eye": { "set": "lamproom", "light": "night", "lamproom": { "wave": 0, "iris": 0, "dim": 1, "grey": null, "keys": [ {"f": 0, "wave": 0, "iris": 0}, {"f": 38, "wave": 4, "iris": 0.6} ] } } }
//   wave 0..4 = red lamp groups 1..wave off (posed steps, no fade); iris 0..1 = pupil radius r_closed -> r_open; dim 0..1 = the dusk in the window;
//   grey null = follows the wave (truck grey from step 2), or 0..1; keys (optional) = per-frame track, wave holds (steps), iris/dim/grey ease.
// Anchors (Blender plan metres, Z up, eye axis +Y; use ctx.B2T): entry_ring {c, r}, reflector_mouth {c, r}, room_centre, pupil {c, r_closed, r_open},
//   exit_point, relay_box, window_view {c, size}, deck_z. Cameras: CAMS.CAM_ENTRY (the ring fills 89 % of the frame width = the headlamp match),
//   CAM_ROOM (pupil centre at 40 % from the top), CAM_EXIT. Returned: { anchors, cams, update, setState }.
import { GLTFLoader } from '../assets_prod/vendor/GLTFLoader.js';
const DIR = new URL('./lamproom/out/', import.meta.url).href;
const META = await (await fetch(DIR + 'lamproom_meta.json')).json();
export const ANCHORS = META.anchors, CAMS = META.cams, LAYOUT = META.layout, SCREEN = META.screen;
const KIND = ['#D3141C', '#E3EA22', '#3C6CFF'];
let GLTF = null;
export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, P = pl.lamproom || {}, V = p => ctx.B2T(p), t0 = performance.now();
  GLTF ||= await new GLTFLoader().loadAsync(DIR + 'lamproom_lite.glb');
  const root = GLTF.scene.clone(true); root.name = 'lamproom'; scene.add(root);
  const iris = [], levers = [], ind = {}; let tris = 0;
  root.traverse(o => {
    if (/^switch_lever_red_(\d)/.test(o.name)) levers.push({ o, g: 1 + (+o.name.match(/_(\d)/)[1] >> 1) });
    if (!o.isMesh) return; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    o.castShadow = false; o.receiveShadow = false;                                   // the room is lit by its own lamps: no shadow maps (SwiftShader cost)
    if (o.morphTargetInfluences && o.morphTargetInfluences.length) iris.push(o);
    const m = o.material; if (/^ind_/.test(m.name)) { (ind[m.name] ||= []).push(m); m.toneMapped = false; }
    if (m.map) m.map.anisotropy = 4;
  });
  // the lamps: relay plate + socket cup (one InstancedMesh each) and one bulb InstancedMesh per kind/state/wave group
  const L = META.lamps, n = L.length, q = new THREE.Quaternion(), Z = new THREE.Vector3(0, 0, 1), m4 = new THREE.Matrix4(), one = new THREE.Vector3(1, 1, 1);
  const plateG = new THREE.BoxGeometry(.215, .215, .022).translate(0, 0, .011), cupG = new THREE.CylinderGeometry(.06, .07, .07, 12, 1).rotateX(Math.PI / 2).translate(0, 0, .057);
  const bulbG = new THREE.SphereGeometry(.047, 10, 7).scale(1, 1, 1.25).translate(0, 0, .13);
  const plate = new THREE.InstancedMesh(plateG, new THREE.MeshStandardMaterial({ color: '#2e2648', roughness: .45, metalness: .6 }), n);
  const cup = new THREE.InstancedMesh(cupG, new THREE.MeshStandardMaterial({ color: '#b89a5a', roughness: .35, metalness: .9 }), n);
  const groups = {}, mats = {};
  L.forEach((l, i) => {
    const p = V([l[0], l[1], l[2]]), nn = p.clone().negate().normalize(); q.setFromUnitVectors(Z, nn); m4.compose(p, q, one);
    plate.setMatrixAt(i, m4); cup.setMatrixAt(i, m4); const key = l[3] + '_' + l[4] + '_' + l[5]; (groups[key] ||= []).push(m4.clone());
  });
  scene.add(plate, cup);
  for (const [key, ms] of Object.entries(groups)) {
    const [k, s] = key.split('_').map(Number), c = new THREE.Color(KIND[k]);
    const mat = new THREE.MeshStandardMaterial({ color: s === 2 ? c.clone().multiplyScalar(.18) : c, emissive: s === 2 ? '#000000' : c, emissiveIntensity: 1, roughness: .15, toneMapped: false });
    const im = new THREE.InstancedMesh(bulbG, mat, ms.length); ms.forEach((m, i) => im.setMatrixAt(i, m)); im.userData.lampKey = key; scene.add(im); mats[key] = mat;
  }
  // the pupil window: the real dusk crossing rendered from town.blend (sets/lamproom/out/window_*.png), red truck -> grey truck, dimmable
  const tl = new THREE.TextureLoader(), tex = await Promise.all(['window_red.png', 'window_grey.png'].map(f => tl.loadAsync(DIR + f)));
  tex.forEach(t => { t.colorSpace = THREE.SRGBColorSpace; });
  const W = ANCHORS.window_view, wg = new THREE.PlaneGeometry(W.size, W.size);
  const wRed = new THREE.Mesh(wg, new THREE.MeshBasicMaterial({ map: tex[0], toneMapped: false, fog: false }));
  const wGrey = new THREE.Mesh(wg, new THREE.MeshBasicMaterial({ map: tex[1], toneMapped: false, transparent: true, opacity: 0, depthWrite: false, fog: false }));
  wRed.position.copy(V(W.c)); wGrey.position.copy(V(W.c)).add(new THREE.Vector3(0, 0, .01)); scene.add(wRed, wGrey);
  // light: the lamps light the room (the same fill points as Blender, red ones follow the wave), the window's dusk, a violet ambient
  const pt = (p, col, I, d) => { const l = new THREE.PointLight(col, I, d, 2); l.position.copy(V(p)); scene.add(l); return l; };
  const redFill = [];
  for (let g = 1; g <= 4; g++) {
    const pc = (135 - 45 - 90 * (g - 1)) * Math.PI / 180;
    redFill.push(pt([3.6 * Math.cos(pc), 1.2, 3.6 * Math.sin(pc)], KIND[0], pl.fillI ?? 14, 10)); pt([3.6 * Math.cos(pc + .6), 0, 3.6 * Math.sin(pc + .6)], KIND[1], (pl.fillI ?? 14) * .7, 10);
  }
  pt([0, 2, 3.5], KIND[2], 10, 10); pt([2.4, -1, -2.2], KIND[2], 7, 9); pt([0, -3.8, 1], '#8a6ad8', 6, 9);
  const win = pt([0, LAYOUT.YI - .4, 0], '#f0a878', 10, 9);
  scene.add(new THREE.AmbientLight('#2a1d52', .5));
  // state
  const S = { wave: P.wave ?? 0, iris: P.iris ?? 0, dim: P.dim ?? 1, grey: P.grey ?? null, flick: .5 };
  function setState(s = {}) {
    Object.assign(S, s); const w = Math.max(0, Math.min(4, Math.round(S.wave))), grey = S.grey == null ? (w >= 2 ? 1 : 0) : S.grey;
    for (const [key, mat] of Object.entries(mats)) {
      const [k, st, g] = key.split('_').map(Number); if (st === 2) continue;
      const off = k === 0 && g >= 1 && g <= w; mat.emissiveIntensity = off ? 0 : (st === 1 ? S.flick * 2 * .45 : 1); mat.color.set(KIND[k]).multiplyScalar(off ? .16 : 1);
    }
    redFill.forEach((l, i) => { l.visible = i + 1 > w; });
    for (const [nm, ms] of Object.entries(ind)) { const g = +(nm.match(/_g(\d)/) || [0, 0])[1]; ms.forEach(m => { m.emissiveIntensity = g && g <= w ? 0 : 2.5; }); }
    levers.forEach(({ o, g }) => { o.rotation.set((g <= w ? 35 : -35) * Math.PI / 180, 0, 0); });
    iris.forEach(o => { o.morphTargetInfluences[0] = S.iris; });
    const pr = LAYOUT.PUP0 + (LAYOUT.PUP1 - LAYOUT.PUP0) * S.iris; win.intensity = 10 * S.dim * (pr / LAYOUT.PUP0) ** 2;
    wGrey.material.opacity = grey; const b = .35 + .65 * S.dim; wRed.material.color.setScalar(b); wGrey.material.color.setScalar(b);
  }
  const K = (P.keys || []).slice().sort((a, b) => a.f - b.f);
  function at(f) {                                                                  // keys: wave holds (posed steps), the rest eases
    if (!K.length) return {}; let a = K[0], b = K[K.length - 1];
    for (let i = 0; i < K.length - 1; i++) if (f >= K[i].f && f <= K[i + 1].f) { a = K[i]; b = K[i + 1]; break; }
    const u = b.f > a.f ? Math.min(1, Math.max(0, (f - a.f) / (b.f - a.f))) : 1, e = u * u * (3 - 2 * u), o = {};
    for (const k of ['iris', 'dim', 'grey']) if (a[k] != null || b[k] != null) o[k] = (a[k] ?? b[k]) + ((b[k] ?? a[k]) - (a[k] ?? b[k])) * e;
    o.wave = f >= b.f ? (b.wave ?? a.wave ?? S.wave) : (a.wave ?? S.wave); return o;
  }
  function update(f, t) { const fl = .5 + .5 * Math.sin(t * 23.0) * Math.sin(t * 7.3 + 1.1); setState({ ...at(f), flick: fl > .55 ? .9 : .15 }); }   // old bulbs flicker out of phase with the wave
  setState();
  console.warn('PHFD_LAMPROOM ' + JSON.stringify({ meshes: root.children.length, glb_tris: Math.round(tris), lamps: n, groups: Object.keys(mats).length, load_ms: Math.round(performance.now() - t0) }));
  return { anchors: ANCHORS, cams: CAMS, update, setState };
}

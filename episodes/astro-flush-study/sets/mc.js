// mc.js: PLACE C, mission control (shots 3 f120-283 and 10 f803-866) for the three.js kit. Loads sets/mc/out/mc_lite.glb (+ mc_meta.json),
// the same set the Blender final uses (built by sets/mc/build_mc.sh). NO geometry is made here: this module only loads the GLB and applies states.
// film.json: "places": { "mc": { "set": "mc", "mc": { "keys": "reference" } } }  -> screen, clocks, mood, NO GO box/cover/button follow the reference frames;
//   or explicit keys: [ {"f": 0, "screen": "map", "mood": "blue"}, {"f": 64, "screen": "3"} ... ] (screen/mood/clock/off are steps, nogo_box/cover/press ease).
// States: screen = map|ring|3|2|1|go|alarm|noflush|offcourse (one named plane mc_screen_<state>; mc_space_panel shows with map and takes ctx.place.mc.space_texture,
// the previous shot as a THREE.Texture, at meta.space_panel), mood = blue|teal|red-violet|pink (light colours from meta.moods), clock = index in meta.clock.seq,
// off = index in meta.offcourse_seq. Anchors (Blender metres, Z up; ctx.B2T): desk, ctl_fao/capcom/guido, director, pedestal_go/nogo, go_button, nogo_button.
// Cameras: CAMS.f140 ... f860 (proof frames), CAM_MONITOR = the framing at f283 (the room as a picture in the ship's wall monitor, shot 4).
import { GLTFLoader } from './vendor/GLTFLoader.js';
const DIR = new URL('./mc/out/', import.meta.url).href, TEX = new URL('./mc/tex/', import.meta.url).href;
const META = await (await fetch(DIR + 'mc_meta.json')).json();
export const ANCHORS = META.anchors, CAMS = META.cams, CAM_MONITOR = META.cam_monitor;
let GLTF = null;
export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, P = pl.mc || {}, t0 = performance.now();
  GLTF ||= await new GLTFLoader().loadAsync(DIR + 'mc_lite.glb');
  const root = GLTF.scene.clone(true); root.name = 'mc'; scene.add(root); let tris = 0;
  root.traverse(o => {
    if (!o.isMesh) return; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    o.castShadow = o.receiveShadow = !/^mc_screen_|^mc_clock|^mc_side|^mc_label|^mc_space|^carpet_specks|^ceiling_grid/.test(o.name);
    const m = o.material; if (m.emissive && (m.emissive.getHex() !== 0 || m.emissiveMap)) m.toneMapped = false;
  });
  const N = n => root.getObjectByName(n), loader = new THREE.TextureLoader(), texCache = {};
  // picture sequences (clock strip, OFF COURSE) are loaded BEFORE the first frame, else a swapped plane renders black until its picture arrives
  await Promise.all([...META.clock.seq, ...META.offcourse_seq].map(async e => { const t = await loader.loadAsync(TEX + e.png); t.colorSpace = THREE.SRGBColorSpace; t.flipY = false; texCache[e.png] = t; }));
  const tex = png => texCache[png] ||= loader.load(TEX + png, t => { t.colorSpace = THREE.SRGBColorSpace; t.flipY = false; });
  const swap = (obj, png) => { if (!obj) return; const m = obj.material; const t = tex(png); if (m.emissiveMap !== t) { m.emissiveMap = t; m.map = null; m.needsUpdate = true; } };
  const space = N('mc_space_panel'); if (space && P.space_texture) { space.material = space.material.clone(); space.material.emissiveMap = P.space_texture; space.material.needsUpdate = true; }
  const lin = h => new THREE.Color(h);
  const fill = new THREE.HemisphereLight('#b8bfee', '#2a2d55', 1.6);
  const top = new THREE.DirectionalLight('#b8bfee', 1.2); top.position.copy(ctx.B2T([0, -10, 7])); top.target.position.copy(ctx.B2T([0, -10, 0]));
  const scr = new THREE.PointLight('#6f86ff', 6, 14, 1.5); scr.position.copy(ctx.B2T([0, -1.5, META.screen.centre[2]]));
  scene.add(fill, top, top.target, scr);
  const MV = META.movers, mv = n => MV[n], nogoBox = N('mc_nogo_box'), btn = N('mc_nogo_button'), cover = N('mc_nogo_cover');
  const rest = {}; for (const n of ['mc_nogo_button', 'mc_nogo_cover']) { const o = N(n); if (o) rest[n] = { p: o.position.clone(), q: o.quaternion.clone() }; }
  const S = Object.assign({}, META.state_default, P.state || {});
  // MOTION (2026-11-22, all off unless film.json places.mc.mc.motion is set, so the old one-frame swaps stay the default):
  //   motion.screen_fade {state: [frames before, frames after]} = the screen INTO that state cross-fades (new plane over the old, opacity eased);
  //   motion.mood_fade {mood: frames} = the light colours ease into that mood over n frames; motion.box_rise [f0, f1] = the NO GO box rises out of
  //   the floor (translation, eased) instead of the Y-scale pop, button/cover/label ride on it; motion.cover [f0, f1] = cover opening eased over that span.
  const MO = P.motion || null, ease = u => { u = Math.min(1, Math.max(0, u)); return u * u * (3 - 2 * u); };
  const rest2 = {}; for (const n of ['mc_nogo_box', 'mc_label_nogo']) { const o = N(n); if (o) rest2[n] = o.position.clone(); }
  let boxH = 0; if (nogoBox) { const b = new THREE.Box3().setFromObject(nogoBox); boxH = (b.max.y - b.min.y) * 1.02; }
  const fadeMat = {}; const fm = o => fadeMat[o.name] ||= (() => { const m0 = o.material, m = m0.clone(); m.transparent = true; m.polygonOffset = true; m.polygonOffsetFactor = -2; m.polygonOffsetUnits = -2; return { m0, m }; })();
  function setState(s = {}) {
    Object.assign(S, s);
    for (const [st, n] of Object.entries(META.screen_planes)) { const o = N(n); if (o) { o.visible = st === S.screen || (S.fadeTo != null && st === S.fadeTo); if (fadeMat[n]) o.material = fadeMat[n].m0; } }
    if (S.fadeTo != null) { const o = N(META.screen_planes[S.fadeTo]); if (o) { const F = fm(o); o.material = F.m; F.m.opacity = S.fadeU; } }
    if (space) space.visible = S.screen === 'map';
    if (space && MO) { space.material.transparent = S.fadeTo != null; space.material.opacity = S.fadeTo != null ? 1 - S.fadeU : 1; }
    if (S.screen === 'offcourse') swap(N('mc_screen_offcourse'), META.offcourse_seq[S.off | 0].png);
    swap(N('mc_clock'), META.clock.seq[S.clock | 0].png);
    for (const n of ['mc_bin', 'mc_bin_paper']) { const o = N(n); if (o) o.visible = !!S.bin; }
    const u = Math.min(1, Math.max(0, S.nogo_box)), rise = !!(MO && MO.box_rise), dy = rise ? -(1 - u) * boxH : 0;
    if (nogoBox) { if (rise) { nogoBox.scale.set(1, 1, 1); nogoBox.position.copy(rest2.mc_nogo_box); nogoBox.position.y += dy; nogoBox.visible = u > 0; } else nogoBox.scale.set(1, 0.01 + .99 * u, 1); }       // glTF Y up: the Blender Z scale is the kit's Y
    for (const n of ['mc_nogo_button', 'mc_nogo_cover', 'mc_label_nogo']) { const o = N(n); if (o) o.visible = rise ? u > 0 : u > .95; }
    if (rise && rest2.mc_label_nogo) { const o = N('mc_label_nogo'); o.position.copy(rest2.mc_label_nogo); o.position.y += dy; }
    if (btn && rest.mc_nogo_button) { const d = mv('mc_nogo_button').pressed.loc[2] - mv('mc_nogo_button').loc[2]; btn.position.copy(rest.mc_nogo_button.p); btn.position.y += d * S.press + dy; }
    if (cover && rest.mc_nogo_cover) { cover.position.copy(rest.mc_nogo_cover.p); cover.position.y += dy; cover.quaternion.copy(rest.mc_nogo_cover.q); cover.rotateX(mv('mc_nogo_cover').open.rot[0] * Math.PI / 180 * S.cover); }
    const M = META.moods[S.mood], M0 = S.moodFrom ? META.moods[S.moodFrom] : null, mu = S.moodU ?? 1, mix = (a, b) => M0 ? lin(a).lerp(lin(b), mu) : lin(b);
    fill.color = mix(M0 && M0.fill, M.fill); top.color = mix(M0 && M0.fill, M.fill); scr.color = mix(M0 && M0.spill, M.spill); scr.intensity = 6 * (M0 ? M0.spill_w + (M.spill_w - M0.spill_w) * mu : M.spill_w) / 900;
  }
  // the reference timing (same rule as mc_api.frame_state in Blender)
  function refState(f) {
    const o = {}; for (const [st, d] of Object.entries(META.screens)) if (f >= d.f[0] && f <= d.f[1]) o.screen = st;
    o.mood = f >= 803 ? 'pink' : f >= 264 ? 'red-violet' : f >= 224 ? 'teal' : 'blue';
    let ci = 0; META.clock.seq.forEach((c, i) => { if (c.f <= f && (f >= 803) === (c.f >= 803)) ci = i; }); o.clock = ci;
    let oi = 0; META.offcourse_seq.forEach((c, i) => { if (c.f <= f) oi = i; }); o.off = oi;
    const cl = v => Math.min(1, Math.max(0, v)); o.bin = f < 150 ? 1 : 0; o.nogo_box = cl((f - 176) / 4); o.cover = cl((f - 258) / 3);
    o.press = f >= 803 ? 0 : f < 263 ? cl((f - 261) / 2) : f <= 268 ? 1 : cl(1 - (f - 268) / 4);
    if (MO) {
      if (MO.box_rise) o.nogo_box = ease((f - MO.box_rise[0]) / (MO.box_rise[1] - MO.box_rise[0]));
      if (MO.cover) o.cover = ease((f - MO.cover[0]) / (MO.cover[1] - MO.cover[0]));
      o.fadeTo = null; o.moodFrom = null; o.moodU = 1;
      for (const [st, [b, a]] of Object.entries(MO.screen_fade || {})) { const d = META.screens[st]; if (!d) continue; const f0 = d.f[0] - b, f1 = d.f[0] + a;
        if (f >= f0 && f < f1) { const prev = Object.entries(META.screens).find(([, e]) => e.f[1] === d.f[0] - 1); if (!prev) continue; o.screen = prev[0]; o.fadeTo = st; o.fadeU = ease((f - f0 + 1) / (f1 - f0 + 1)); } }
      const MOODS = [[0, 'blue'], [224, 'teal'], [264, 'red-violet'], [803, 'pink']];
      for (let i = 1; i < MOODS.length; i++) { const n = (MO.mood_fade || {})[MOODS[i][1]]; if (n && f >= MOODS[i][0] && f < MOODS[i][0] + n) { o.moodFrom = MOODS[i - 1][1]; o.moodU = ease((f - MOODS[i][0] + 1) / (n + 1)); } }
    }
    return o;
  }
  const K = Array.isArray(P.keys) ? P.keys.slice().sort((a, b) => a.f - b.f) : null;
  function at(f) {
    if (P.keys === 'reference') return refState(f + (P.ref_f0 ?? 0));
    if (!K || !K.length) return {}; let a = K[0], b = K[K.length - 1];
    for (let i = 0; i < K.length - 1; i++) if (f >= K[i].f && f <= K[i + 1].f) { a = K[i]; b = K[i + 1]; break; }
    const u = b.f > a.f ? Math.min(1, Math.max(0, (f - a.f) / (b.f - a.f))) : 1, o = {};
    for (const k of ['screen', 'mood', 'clock', 'off', 'bin']) o[k] = f >= b.f ? (b[k] ?? a[k] ?? S[k]) : (a[k] ?? S[k]);
    for (const k of ['nogo_box', 'cover', 'press']) if (a[k] != null || b[k] != null) { const v0 = a[k] ?? b[k], v1 = b[k] ?? a[k], e = u * u * (3 - 2 * u); o[k] = v0 + (v1 - v0) * e; }
    return o;
  }
  function update(f, t) { setState(at(f)); }
  setState();
  console.warn('AF_MC ' + JSON.stringify({ meshes: root.children.length, glb_tris: Math.round(tris), load_ms: Math.round(performance.now() - t0) }));
  return { anchors: ANCHORS, cams: CAMS, cam_monitor: CAM_MONITOR, update, setState };
}

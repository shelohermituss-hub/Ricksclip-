// ship.js: PLACE ship of astro-flush-study (LOOK_INVENTORY B + F + G) for the three.js kit. ONLY loads sets/ship/out/ship_lite.glb (+ ship_meta.json)
// and applies states; NO geometry is made here (everything seen is in the Blender scene built by sets/ship/build_ship.sh).
// film.json: "places": { "ship": { "set": "ship", "ship": { "flame": 0, "glitter": 0, "keys": [ {"f": 96, "flame": 0}, {"f": 110, "flame": 1}, {"f": 772, "comm": 1} ] } } }
// States (same names as scripts/ship_api.py): flame 0-1, preglow 0-1, glitter 0-1 (4 trail steps + collar puff), glitter_ck 0-1 (3 steps), comm 0/1,
// digits 0-3, starmap 0-1, ship [x,y,z,rx,ry,rz] (ship_root, Blender metres/degrees), earth [x,y,z,R], fan (deg). Anchors / cams: META.anchors, META.cams.
// round 8: light 'space' | 'warm' | 'map' | 'radio' (place state or per-frame key, switches at the key; same numbers as ship_api.py LIGHTS: sun, fill,
// interior lamps, cockpit fill, porthole rooms, comm / mfd, wall wash; the lamps are real three.js lights at the Blender lamp places), twinkle (glitter
// shimmer time; no key = f / 20), radio_desk 0|1 (0, or shot 7, hides the radio station), flame_w (plume width factor). glitter / glitter_ck fade
// sparkle by sparkle (per-sparkle phase in the GLB colour attribute), no steps; flame grows continuously (preglow stub, then length and width).
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
  // round 4: unlit Earth as in Blender: the painted map (clouds inside, make_earth_stars.py), pale limb, soft white glare spot at a screen place (S.earth_glare)
  const GL = { glare: { value: new THREE.Vector4(.5, -.7, .3, 0) }, term: { value: new THREE.Vector3(-.6, .6, 0) } };
  const em = N('earth'); if (em) em.traverse(m => { if (!m.isMesh) return; m.material = new THREE.ShaderMaterial({ uniforms: Object.assign({ map: { value: m.material.map } }, GL), toneMapped: false, fog: false,
    vertexShader: 'varying vec2 vUv; varying vec3 vP, vN; varying vec2 vPA; void main(){ vUv = uv; vPA = vec2(projectionMatrix[0][0], projectionMatrix[1][1]); vec4 p = modelViewMatrix * vec4(position, 1.); vP = p.xyz; vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * p; }',
    fragmentShader: 'uniform sampler2D map; uniform vec4 glare; uniform vec3 term; varying vec2 vUv; varying vec3 vP, vN; varying vec2 vPA; void main(){ vec3 c = texture2D(map, vUv).rgb;' +
      ' float fa = 1. - abs(dot(normalize(vN), normalize(-vP))); c = mix(c, vec3(.83, .94, 1.), .6 * pow(fa, 14.));' +
      ' float A = vPA.x, B = vPA.y; vec2 s = vP.xy / -vP.z - vec2(glare.x / A, glare.y / B); float r = glare.z / B, d2 = dot(s, s) / (r * r), g = glare.w * (exp(-d2) + .45 * exp(-.15 * d2));' +
      ' float T = smoothstep(-.2, .3, dot(normalize(vN), normalize(vec3(term.xy, .5)))); c *= 1. - term.z * (1. - T);' +
      ' gl_FragColor = linearToOutputTexel(vec4(mix(c, vec3(1.), clamp(g, 0., 1.)), 1.)); }' }); m.material.map = null; });
  basic(N('earth_rim'), () => ({ color: '#c8ecff', transparent: true, opacity: .45, side: THREE.BackSide, depthWrite: false }));
  vis('earth_clouds', false);   // round 4: the cloud shell and its tile are gone (clouds are painted into the Earth map)
  const FL = { flame_core: ['#fefefe', 1], flame_mid: ['#cbaaf1', .55], flame_outer: ['#8a6ee7', .35], flame_halo: ['#6d51b8', .22], flame_glow: ['#8a6ee7', .1] };
  for (const [n, [c, a]] of Object.entries(FL)) basic(N(n), () => ({ color: c, transparent: a < 1, opacity: a, depthWrite: false }));
  // round 8 glitter: unlit, additive, per-sparkle fade (colour attribute: r = phase, g = brightness, b = twinkle seed), same formula as the Blender nodes
  const GU = { trail: { state: { value: 0 }, twinkle: { value: 0 } }, ck: { state: { value: 0 }, twinkle: { value: 0 } } };
  const glitMat = U => new THREE.ShaderMaterial({ uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false, side: THREE.DoubleSide,
    vertexShader: 'attribute vec4 color; varying vec3 vC; void main(){ vC = color.rgb; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: 'uniform float state, twinkle; varying vec3 vC; void main(){ float fade = clamp((state * 1.15 - vC.r) * 6.67, 0., 1.), sh = .55 + .45 * sin(6.2832 * (twinkle + vC.b));' +
      ' float k = fade * sh * vC.g; gl_FragColor = vec4(vec3(1., .97, .92) * min(3. * k, 1.), 1.); }' });
  root.traverse(o => { if (o.isMesh && /^glitter/.test(o.name)) { o.material = glitMat(/cockpit/.test(o.name) ? GU.ck : GU.trail); o.frustumCulled = false; } });
  // round 8 LIGHT KINDS: three.js lights at the Blender light places (META.lights, ship_root children), strengths from META.light_kinds.
  // Blender W -> three candela: W / (4 pi) x KW (KW tuned by eye on f600 / f740 / f790 against the Blender stills); sun W/m2 -> intensity x KS
  const KW = 1.0 / (4 * Math.PI), KS = 1.07, LT = {}, ML = META.lights || {};
  for (const [n, d] of Object.entries(ML)) {
    const l = d.type === 'SPOT' ? new THREE.SpotLight(new THREE.Color(...d.color), 0, 0, d.spot[0] / 2, d.spot[1], 2) : new THREE.PointLight(new THREE.Color(...d.color), 0, 0, 2);
    l.name = n + '_kit'; l.position.copy(ctx.B2T(d.loc)); l.castShadow = false;
    if (l.isSpotLight) { l.target.position.copy(ctx.B2T(d.loc.map((v, i) => v + d.dir[i] * 3))); (N('ship_root') || root).add(l.target); }
    (N('ship_root') || root).add(l); LT[n] = l;
  }
  const mats = {}; root.traverse(o => { if (o.isMesh && o.material && o.material.name) mats[o.material.name] = o.material; });
  let SUN = null, HEMI = null; scene.children.forEach(o => { if (o.isDirectionalLight) SUN = o; if (o.isHemisphereLight) HEMI = o; });
  const L0 = { tint: ctx.light && ctx.light.tint, gain: ctx.light && ctx.light.card_gain };
  function applyLight(kind, s) {
    const K = (META.light_kinds || {})[kind]; if (!K) return; const [dir, col, e] = K.sun, sd = s.sun_dir || dir, W = x => x * KW;
    if (SUN) { SUN.color.setRGB(...col); SUN.intensity = e * (s.sun_k ?? 1) * KS; SUN.position.copy(ctx.B2T(sd).normalize().multiplyScalar(60)); SUN.visible = e > 0; }
    if (HEMI) { HEMI.intensity = .35 * K.fill / .25; }
    for (const n of ['lamp_light_0', 'lamp_light_1']) if (LT[n]) LT[n].intensity = W(K.lamps);
    if (LT.ck_fill) LT.ck_fill.intensity = W(K.ck_fill);
    for (const n of ['room_light_a', 'room_light_b']) if (LT[n]) LT[n].intensity = W(K.rooms);
    const c = +s.comm; if (LT.comm_light) LT.comm_light.intensity = W(['radio', 'map', 'warm'].includes(kind) ? (kind === 'radio' ? 9 : 25) * c : 0);
    if (LT.mfd_light) LT.mfd_light.intensity = W(kind === 'radio' ? (c ? 6 : 1.5) : 0);
    if (LT.wall_wash) LT.wall_wash.intensity = W(+s.wash || (META.wash || {})[kind] || 0) * .5;
    if (LT.flame_light) LT.flame_light.intensity = W(60000 * (+s.flame || 0)) * .02;   // the kit's near/far range: a softer flame light
    const es = (META.lamp_emit || {})[kind] ?? 1; if (mats.lamp_tip) mats.lamp_tip.emissiveIntensity = 14 * es; if (mats.lamp_tube) mats.lamp_tube.emissiveIntensity = 0;
    if (ctx.light) { const inside = kind !== 'space'; ctx.light.tint = inside ? '#ffffff' : L0.tint; ctx.light.card_gain = inside ? Math.max(L0.gain ?? 1, kind === 'warm' ? 1.12 : 1) : L0.gain; }   // cards stay full colour inside
  }   // space: no kit fog (it greys the stars and the hull); film.json places.ship.ship.fog = true keeps it
  const shipRoot = N('ship_root'), earth = N('earth'), flames = ['flame_core', 'flame_mid', 'flame_outer', 'flame_halo', 'flame_glow'].map(N).filter(Boolean);
  const nozzleMat = (N('nozzle_glow') || {}).material, B2T = ctx.B2T;
  const S = Object.assign({}, META.state_default, P);
  function setState(s = {}) {
    Object.assign(S, s);
    if (shipRoot && S.ship) { shipRoot.position.copy(B2T(S.ship.slice(0, 3))); shipRoot.rotation.set(S.ship[3] * D2R, S.ship[5] * D2R, -S.ship[4] * D2R); }
    if (S.earth_glare) GL.glare.value.set(...S.earth_glare); if (S.earth_term) GL.term.value.set(...S.earth_term);   // round 5: same numbers as ship_api.py
    for (const n of ['solar_fan_p', 'solar_fan_n', 'solar_fan_p_spokes', 'solar_fan_n_spokes', 'solar_boom_p', 'solar_boom_n']) vis(n, S.fans ?? 1);
    if (earth && S.earth) { const p = B2T(S.earth.slice(0, 3)), d = p.length(), k = d > 420 ? 420 / d : 1; earth.position.copy(p.multiplyScalar(k)); earth.scale.setScalar(S.earth[3] * k);
      const er = S.earth_rot || [75, 0, 30]; earth.rotation.set(er[0] * D2R, er[2] * D2R, -er[1] * D2R, 'YZX'); }   // round 5: Blender XYZ euler earth_rot (Rz Ry Rx) in Y-up axes
    const f = +S.flame, pg = +S.preglow || 0, fw = S.flame_w ?? 1, Lf = Math.max(.06 * pg, f > 0 ? Math.pow(f, .8) : 0), Wf = (.3 + .7 * Math.max(f, .25 * pg)) * fw;   // round 8: ship_api.flame_scale
    flames.forEach(o => { o.visible = true; o.scale.set(Math.max(Lf, .001), Math.max(Wf, .001), Math.max(Wf, .001)); });   // glTF is Y-up: Blender x stays x, the width axes are y and z
    if (nozzleMat) nozzleMat.emissiveIntensity = 8 * Math.max(pg, Math.min(1, f * 4));
    GU.trail.state.value = +S.glitter || 0; GU.ck.state.value = +S.glitter_ck || 0; GU.trail.twinkle.value = GU.ck.twinkle.value = +S.twinkle || 0;
    applyLight(S.light || 'space', S);
    const c = +S.comm; vis('comm_lamp_on', c); vis('comm_lamp_off', !c); vis('mfd_on', c); vis('mfd_off', !c);
    for (let k = 0; k < 4; k++) vis('radio_digits_' + k, (S.digits | 0) === k);
    vis('star_map_sheet', S.starmap > 0); vis('star_map_tape', S.starmap > 0);
    for (const n of ['solar_fan_p', 'solar_fan_n']) for (const o of [N(n), N(n + '_spokes')]) if (o) o.rotation.z = -(S.fan || 0) * D2R;
    const RG = (META.groups || {}).radio_station || [], hideR = +S.shot === 7 || +(S.radio_desk ?? 1) === 0;   // round 8: no radio desk in shot 7
    for (const n of RG) if (hideR) vis(n, false); else if (!/^(comm_lamp_|mfd_o|radio_digits_)/.test(n)) vis(n, true);
  }
  const K = (P.keys || []).slice().sort((a, b) => a.f - b.f), STEP = ['comm', 'digits', 'shot', 'light', 'radio_desk', 'fans'];
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
  const twKeyed = K.some(k => k.twinkle !== undefined);
  function update(f) { const s = at(f); if (!twKeyed) s.twinkle = f / 20; setState(s); }
  setState();
  console.warn('AF_SHIP ' + JSON.stringify({ meshes: root.children.length, glb_tris: Math.round(tris), load_ms: Math.round(performance.now() - t0) }));
  return { anchors: ANCHORS, cams: CAMS, update, setState };
}

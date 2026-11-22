// s4_apron.js: plane-eater S4 TWO YEARS + DESSERT + RECORD (rows 24-34, frames 660-942) on the shared apron set. S4 stretch builder 2026-11-22.
// The apron (apron.js) + the hero Cessna in its SLICED state (props/out/cessna150_sliced.glb), eaten tail first in the time-lapse (hide s8_* .. s0_*,
// the sawhorses stay: the empty cradle), the SEASONS (summer -> autumn -> snow #cfe0f5 -> spring -> dusk) and the sun swinging round, all driven per frame
// in update(); the owner's deck chair moved to the nose side so the wide sees him; the dessert trolley (props/out/dessert_trolley.glb) SCALED x2 with
// extra bikes / carts / TVs cloned round each tier (the tower must read BIG), tiers popping in one per word, the coffin wobble + fall to Michel's plate;
// the cloche on the table lifting off the BOOK OF RECORDS + certificate; the dusk work lamps snapping on at "dessert?". Plus the held3d builders.
import { build as apronBuild } from './apron.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
const P = new URL('../props/out/', import.meta.url).href, ld = new GLTFLoader();
const G = {};
for (const n of ['cessna150_sliced', 'dessert_trolley', 'cloche_bell', 'record_book', 'certificate', 'plate', 'fork']) G[n] = (await ld.loadAsync(P + n + '.glb')).scene;
let THREE_ = null;
const clone = n => G[n].clone(true);
function part(name, keep) { const g = clone(name), drop = []; g.traverse(o => { if (o.isMesh && !keep.test(o.name)) drop.push(o); }); for (const o of drop) o.removeFromParent(); return g; }   // removes (not hides) the rest, so a bounding box sees only the part
const sm = u => { u = Math.min(1, Math.max(0, u)); return u * u * (3 - 2 * u); };
const lerpC = (T, a, b, u) => new T.Color(a).lerp(new T.Color(b), u);
// ---- frames (words.json x 30): took 669, two 679, years 686, finish 701, plane 713, dessert 740, Bikes 768, carts 796, TVs 818, coffin 850,
//      Guinness 855, strangest 894, diet 912, ever 920
export const TL0 = 672, TL1 = 708;                    // the time-lapse: slices go 672-706, the season wheel turns 672-712
export const DESK = [3.47, -0.42, .78];                // where the cloche / book sit on the table (in reach of the seated Michel at (3.4, -1.0))
export const TROLLEY = { from: [1.6, 9.6, .03], to: [3.25, 1.55, .03], f0: 742, f1: 766, scale: 2.4 };
export const CATCH = [3.62, -0.68, 1.34];              // his plate in the near hand at the catch (f850), from the --held dump of the draft
export const DECK = [-1.6, -4.2, .03];                  // the owner's deck chair, moved from (-6.4, 5.4) to the nose side of the plane (seen in the wide)
// ---- season / light keys (frame, look). Each look: sky top, horizon, sun colour, sun intensity, ambient colour, ambient intensity, ground (lawn), leaves, card tint
const DAY = { top: '#1a86f2', hor: '#cfe6ff', sun: '#fff6e6', si: 4.6, amb: '#e6edf7', ai: 2.0, lawn: null, leaf: null, tint: '#ffffff', snow: 0 };
const KEYS = [
  [0, DAY], [674, DAY],
  [682, { top: '#3d7fd0', hor: '#ffd9a8', sun: '#ffc98a', si: 3.6, amb: '#d9c9b8', ai: 1.7, lawn: '#a79a52', leaf: '#d9822b', tint: '#fff1e0', snow: 0 }],     // autumn: orange tree
  [690, { top: '#7d97b8', hor: '#e8eef6', sun: '#eef4ff', si: 3.0, amb: '#dfe8f5', ai: 2.2, lawn: '#cfe0f5', leaf: '#e9f0fa', tint: '#f3f7ff', snow: 1 }],     // winter: snow #cfe0f5
  [698, { top: '#7d97b8', hor: '#e8eef6', sun: '#eef4ff', si: 3.0, amb: '#dfe8f5', ai: 2.2, lawn: '#cfe0f5', leaf: '#e9f0fa', tint: '#f3f7ff', snow: 1 }],
  [705, { top: '#2f8ae8', hor: '#d8f0d0', sun: '#fff8e0', si: 4.2, amb: '#e3eedf', ai: 1.9, lawn: '#7fbf4a', leaf: '#8fd14f', tint: '#ffffff', snow: 0 }],     // spring: fresh green
  [716, { top: '#2f8ae8', hor: '#d8f0d0', sun: '#fff8e0', si: 4.2, amb: '#e3eedf', ai: 1.9, lawn: '#7fbf4a', leaf: '#8fd14f', tint: '#ffffff', snow: 0 }],
  [738, { top: '#604bde', hor: '#c58aa8', sun: '#ffa58f', si: 3.0, amb: '#8f7be0', ai: 1.5, lawn: '#6e7a52', leaf: '#5d6e48', tint: '#ffe4dc', snow: 0 }],     // DUSK (rick_light dusk)
  [9999, { top: '#604bde', hor: '#c58aa8', sun: '#ffa58f', si: 3.0, amb: '#8f7be0', ai: 1.5, lawn: '#6e7a52', leaf: '#5d6e48', tint: '#ffe4dc', snow: 0 }]];
function look(T, f) { let i = 0; while (i < KEYS.length - 2 && f >= KEYS[i + 1][0]) i++; const [fa, A] = KEYS[i], [fb, B] = KEYS[i + 1], u = sm((f - fa) / Math.max(1, fb - fa));
  const c = k => lerpC(T, A[k] || B[k] || '#000000', B[k] || A[k] || '#000000', u);
  return { top: c('top'), hor: c('hor'), sun: c('sun'), amb: c('amb'), tint: c('tint'), si: A.si + (B.si - A.si) * u, ai: A.ai + (B.ai - A.ai) * u,
    lawn: (A.lawn || B.lawn) ? c('lawn') : null, leaf: (A.leaf || B.leaf) ? c('leaf') : null, lawnK: A.lawn && B.lawn ? 1 : A.lawn ? 1 - u : B.lawn ? u : 0, snow: A.snow + (B.snow - A.snow) * u }; }
// ---- held3d builders (origin = grip, business end +X)
function wrap(g, tipX = .1) { const T = THREE_; const group = new T.Group(); group.add(g); return { group, grip: new T.Vector3(0, 0, 0), tip: new T.Vector3(tipX, 0, 0) }; }
const centred = (T, g) => { const b = new T.Box3().setFromObject(g), c = b.getCenter(new T.Vector3()); g.position.sub(c); const h = new T.Group(); h.add(g); return h; };
export function buildFork(T) { THREE_ ||= T; const g = clone('fork'); g.scale.setScalar(1.4); return wrap(g, .2); }
export function buildBell(T) { THREE_ ||= T; const g = part('cloche_bell', /^bell/); g.traverse(o => { if (o.isMesh && /bell_(dome|body|cup)?$|bell_dome|bell_body/.test(o.name)) { o.material = o.material.clone(); o.material.metalness = .55; o.material.roughness = .2; o.material.color.set('#e4e7ec'); } }); g.position.x = -.30; g.scale.setScalar(1.6); return wrap(g, .05); }   // the silver table bell (grip = its wood knob)
export function buildSpinner(T) { THREE_ ||= T; const s = part('cessna150_sliced', /^s0_spinner$/); const h = centred(T, s); h.scale.setScalar(.55); return wrap(h, .06); }   // the last piece: the spinner, cherry-size in his fingers
let heldCoffin = null;
export function buildPlate(T) { THREE_ ||= T; const g = new T.Group(), p = clone('plate'); p.scale.setScalar(1.3); g.add(p);
  const c = part('dessert_trolley', /^coffin_/), h = centred(T, c); h.scale.setScalar(.55); h.position.set(.0, .07, 0); h.rotation.y = .5; h.visible = false; g.add(h); heldCoffin = h;
  const o = new T.Group(); o.add(g); g.rotation.z = 0; return { group: o, grip: new T.Vector3(0, 0, 0), tip: new T.Vector3(.12, 0, 0) }; }
let certWhole = null, certBit = null;
export function buildCert(T) { THREE_ ||= T; const g = new T.Group();
  const a = part('certificate', /^cert_(?!bitten)/), b = part('certificate', /^cert_bitten/); const ha = centred(T, a), hb = centred(T, b);
  for (const h of [ha, hb]) { h.scale.setScalar(.62); h.rotation.y = Math.PI; g.add(h); } hb.visible = false; certWhole = ha; certBit = hb;   // faces -Y in the glb: turned to the lens side
  const o = new T.Group(); g.position.x = .28; o.add(g); return { group: o, grip: new T.Vector3(0, 0, 0), tip: new T.Vector3(.56, 0, 0) }; }
export async function build(THREE, scene, film, ctx) {
  THREE_ = THREE; const V = p => ctx.B2T(p);
  const base = await apronBuild(THREE, scene, film, ctx);
  // the kit's lights / sky / fog (film.js baseLight) to drive the seasons
  let hemi = null, sun = null, sky = null; scene.traverse(o => { if (o.isHemisphereLight) hemi = o; if (o.isDirectionalLight) sun = o; if (o.isMesh && o.geometry && o.geometry.type === 'SphereGeometry' && o.geometry.parameters.radius === 400) sky = o; });
  const sun0 = sun ? sun.position.clone() : null;
  const lawnM = new Map(), leafM = new Map(), lampM = [], deck = [];
  scene.traverse(o => { if (!o.isMesh) return; const n = (o.material && o.material.name) || '';
    if (/^lawn|lawn_mown|grass|tuft/.test(n) || /^lawn|tufts/.test(o.name)) lawnM.set(o.material, o.material.color.clone());
    else if (/leaves|crown|hedge/.test(n + ' ' + o.name)) leafM.set(o.material, o.material.color.clone());
    if (/bulb_work/.test(n)) lampM.push(o.material);
    if (/^(dchair_|crate_|thermos|radio_|rag_folded|rag_spare|contact_deckchair|contact_crate)/.test(o.name)) deck.push(o);
    if (/^(plate_main|plate_main_rim)$/.test(o.name)) o.visible = false; });                  // the cloche + book take the main plate spot
  { const d = V([DECK[0] + 6.4, DECK[1] - 5.4, 0]).sub(V([0, 0, 0])); for (const o of deck) o.position.add(d); }
  // the hero Cessna, sliced; eaten tail first (slice 8 -> 0), the sawhorses stay as the empty cradle
  const plane = clone('cessna150_sliced'); plane.position.copy(V(ANCH(base, 'cessna_spot'))); plane.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; }); scene.add(plane);
  const slices = []; for (let k = 0; k < 9; k++) { const s = plane.getObjectByName('slice_' + k), parts = []; if (s) s.traverse(o => { if (o.isMesh && !/^sawhorse/.test(o.name)) parts.push(o); }); slices.push(parts); }
  const spinner = []; plane.traverse(o => { if (o.isMesh && /s0_spinner/.test(o.name)) spinner.push(o); });
  // snow: a soft white skin over the apron slab + white caps on the plane slices and the table cloth (opacity follows the season)
  const snowM = new THREE.MeshStandardMaterial({ color: '#eef4fb', roughness: .9, transparent: true, opacity: 0, depthWrite: false });
  const snow = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), snowM); snow.rotation.x = -Math.PI / 2; snow.position.copy(V([0, 0, .045])); snow.receiveShadow = true; scene.add(snow);
  let s = 25; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647, flakes = [];
  const flM = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false });
  for (let i = 0; i < 260; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.03 + rnd() * .03, 5, 4), flM); m.userData.p = [rnd() * 16 - 6, rnd() * 12 - 7, rnd() * 5]; m.visible = false; scene.add(m); flakes.push(m); }
  // the table: silver cloche over the open BOOK OF RECORDS + the certificate on it
  const put = (g, p, yawDeg = 0, sc = 1) => { g.position.copy(V(p)); g.rotation.y = yawDeg * Math.PI / 180; g.scale.setScalar(sc); g.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; }); scene.add(g); return g; };
  const book = put(clone('record_book'), DESK, 90, 1.25);
  const certOnBook = put(part('certificate', /^cert_(?!bitten)/), [DESK[0] + .0, DESK[1] + .02, DESK[2] + .075], 0, .42); certOnBook.rotation.x = -Math.PI / 2 + .25;
  { const c = new THREE.Box3().setFromObject(certOnBook).getCenter(new THREE.Vector3()), want = V([DESK[0], DESK[1], DESK[2] + .1]); certOnBook.position.add(want.sub(c)); }
  const cloche = put(part('cloche_bell', /^cloche/), [DESK[0], DESK[1], DESK[2] + .005], 0, 1.35);
  const silver = g => g.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); o.material.color.set('#e4e7ec'); o.material.metalness = .55; o.material.roughness = .22; } });   // draft: the env map is too dark for pure metal (read black)
  silver(cloche);
  const bellOnTable = put(part('cloche_bell', /^bell/), [3.72, -0.62, .78], 0, 1.6); bellOnTable.position.add(V([-.30 * 1.6, 0, 0]).sub(V([0, 0, 0])));
  const cl0 = cloche.position.clone();
  // the dessert trolley: x2, more of everything round each tier
  const tro = new THREE.Group(); scene.add(tro); const src = clone('dessert_trolley'), groups = { bike: [], cart: [], tv: [], coffin: [] };
  src.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; const k = /^bike_/.test(o.name) ? 'bike' : /^cart_/.test(o.name) ? 'cart' : /^tv_/.test(o.name) ? 'tv' : /^coffin_/.test(o.name) ? 'coffin' : null; if (k) groups[k].push(o); } });
  tro.add(src); tro.scale.setScalar(TROLLEY.scale);
  const tiers = { bike: [], cart: [], tv: [], coffin: [] };
  for (const k of ['bike', 'cart', 'tv', 'coffin']) { const g = new THREE.Group(); for (const o of groups[k]) g.add(o); src.add(g); tiers[k].push(g);
    const n = { bike: 3, cart: 2, tv: 3, coffin: 0 }[k]; for (let i = 1; i <= n; i++) { const c = g.clone(true); c.rotation.y = i * 2 * Math.PI / (n + 1); c.scale.setScalar(.92); src.add(c); tiers[k].push(c); } }
  const tvScreens = []; for (const g of tiers.tv) g.traverse(o => { if (o.isMesh && /tv_screen/.test(o.name)) { o.material = new THREE.MeshStandardMaterial({ color: '#111', emissive: '#ffffff', emissiveIntensity: 0, roughness: .2 }); tvScreens.push(o); } });
  const stripe = (() => { const c = document.createElement('canvas'); c.width = 64; c.height = 32; const g = c.getContext('2d'); ['#ffffff', '#ffe600', '#00e5ff', '#00d84a', '#ff3bd4', '#ff3030', '#2040ff'].forEach((col, i) => { g.fillStyle = col; g.fillRect(i * 64 / 7, 0, 64 / 7 + 1, 32); }); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  for (const o of tvScreens) o.material.emissiveMap = stripe;
  { const g = tiers.coffin[0], b = new THREE.Box3(); for (const o of g.children) { o.geometry.computeBoundingBox(); const bb = o.geometry.boundingBox.clone(); o.updateMatrix(); bb.applyMatrix4(o.matrix); b.union(bb); }
    const c = b.getCenter(new THREE.Vector3()); for (const o of g.children) o.position.sub(c); g.position.copy(c); }
  const coffin = tiers.coffin[0], coffin0 = { p: coffin.position.clone(), r: coffin.rotation.clone() };
  // the hangar work lamps (dusk): off until "dessert?", then they snap on
  const spots = []; for (const x of [-6.6, -2.2, 2.2, 6.6]) { const sp = new THREE.SpotLight('#ffd49a', 0, 16, Math.PI * .24, .5, 2); sp.position.copy(V([x, 8.28, 6.25])); sp.target.position.copy(V([x, 4.5, 0])); scene.add(sp, sp.target); spots.push(sp); }
  const key = new THREE.PointLight('#ffb48a', 0, 9, 2); key.position.copy(V([4.6, -0.2, 2.6])); scene.add(key);   // warm pink lamp key on the table + cake (dusk)
  const tmp = new THREE.Vector3();
  return { anchors: { ...base.anchors, DESK, CATCH }, update: (f, t) => { base.update && base.update(f, t);
    // ---- seasons + the sun swinging (time-lapse) ----
    const L = look(THREE, f); if (hemi) { hemi.color.copy(L.amb); hemi.intensity = L.ai; }
    const tl = f >= TL0 && f <= TL1 + 4 ? (f - TL0) / (TL1 + 4 - TL0) : 0, flick = tl ? .78 + .22 * Math.cos(tl * Math.PI * 2 * 5) : 1;   // 5 days strobe by (soft)
    if (sun) { sun.color.copy(L.sun); sun.intensity = L.si * flick; const a = tl * Math.PI * 2 * 2.5 + (f > TL1 + 4 ? Math.PI * 5 + .9 * sm((f - TL1 - 4) / 26) : 0);
      sun.position.copy(sun0).applyAxisAngle(new THREE.Vector3(0, 1, 0), a); if (f > TL1 + 4) sun.position.y = sun0.y * (1 - .55 * sm((f - TL1 - 4) / 26)); }
    if (sky) { const pos = sky.geometry.attributes.position, col = sky.geometry.attributes.color; for (let i = 0; i < pos.count; i++) { const u = Math.max(0, Math.min(1, pos.getY(i) / 400 * 2.2)), c = L.hor.clone().lerp(L.top, Math.pow(u, .7)); col.setXYZ(i, c.r * flick, c.g * flick, c.b * flick); } col.needsUpdate = true; }
    if (scene.fog) scene.fog.color.copy(L.hor);
    if (ctx.light) ctx.light.tint = '#' + L.tint.getHexString();
    for (const [m, c0] of lawnM) m.color.copy(L.lawn ? c0.clone().lerp(L.lawn, L.lawnK * .85) : c0);
    for (const [m, c0] of leafM) m.color.copy(L.leaf ? c0.clone().lerp(L.leaf, L.lawnK * .9) : c0);
    snowM.opacity = .92 * L.snow; snow.visible = L.snow > .01;
    flM.opacity = L.snow; flakes.forEach((m, i) => { m.visible = L.snow > .05; if (!m.visible) return; const p = m.userData.p, z = ((p[2] - f * .09) % 5 + 5) % 5; m.position.copy(V([p[0] + .2 * Math.sin(f * .2 + i), p[1], z])); });
    // ---- the plane, eaten tail first ----
    const gone = f < TL0 ? 0 : Math.min(9, (f - TL0) / ((TL1 - 2 - TL0) / 9));           // slices gone (0..9)
    slices.forEach((parts, k) => { const v = (8 - k) >= Math.floor(gone); for (const o of parts) o.visible = v && !(k === 0 && /spinner/.test(o.name) && f >= 704); });
    for (const o of spinner) o.visible = f < 704;
    // ---- work lamps snap on with "dessert?" (740), the pink key warms the table ----
    const on = f < 740 ? 0 : 1 - Math.exp(-(f - 740) / 1.5); for (const sp of spots) sp.intensity = 70 * on; key.intensity = 14 * on; for (const m of lampM) { m.emissiveIntensity = 6 * on; }
    // ---- the cloche + book: the cloche lifts on "Guinness" (855), rises and tips back out of frame by 870 ----
    { const u = sm((f - 855) / 12); cloche.position.copy(cl0).add(new THREE.Vector3(.0, 1.6 * u * u + .25 * u, -.3 * u)); cloche.rotation.x = -1.1 * u; cloche.visible = f < 872; }
    certOnBook.visible = f < 884;
    bellOnTable.visible = !(f >= 737 && f <= 752);
    // ---- the trolley rolls out of the hangar (742-766), tiers pop in one per word, TVs flick on, the coffin wobbles and falls ----
    { const u = sm((f - TROLLEY.f0) / (TROLLEY.f1 - TROLLEY.f0)), a = TROLLEY.from, b = TROLLEY.to, p = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, .03];
      tro.position.copy(V(p)); tro.rotation.y = Math.atan2(b[0] - a[0], b[1] - a[1]) * 0 + .35; tro.visible = f >= TROLLEY.f0 - 2;
      const pop = (g, f0) => { const k = f < f0 ? 0 : f >= f0 + 6 ? 1 : 1 + .25 * Math.sin((f - f0) / 6 * Math.PI) * (1 - (f - f0) / 6) - (1 - Math.min(1, (f - f0) / 3)) * .9; return k; };
      for (const [k, f0] of [['bike', 768], ['cart', 796], ['tv', 818], ['coffin', 832]]) tiers[k].forEach((g, i) => { const sc = pop(g, f0 + i * 2) * (i ? .92 : 1); g.visible = sc > .02; g.scale.setScalar(Math.max(.001, sc)); });
      tvScreens.forEach((o, i) => { o.material.emissiveIntensity = f < 820 + i ? 0 : (f < 823 + i ? 1.6 : .9 + .1 * Math.sin(f * 1.7 + i)); });
      // coffin: wobble 834-841, tips over and falls toward his plate 841-850 (world path), lands; from 850 the held copy on the plate takes over
      coffin.position.copy(coffin0.p); coffin.rotation.copy(coffin0.r); coffin.visible = f >= 832 && f < 850;
      if (f >= 834 && f < 841) coffin.rotation.z = coffin0.r.z + .12 * Math.sin((f - 834) * 1.9) * (1 + (f - 834) / 7);
      if (f >= 841 && f < 850) { const u2 = (f - 841) / 9; tro.updateMatrixWorld(true); const top = coffin.parent.localToWorld(coffin0.p.clone()), end = V(CATCH).add(new THREE.Vector3(0, .12, 0));
        const w = top.clone().lerp(end, u2); w.y = top.y + (end.y - top.y) * u2 * u2 + .25 * Math.sin(u2 * Math.PI); coffin.position.copy(coffin.parent.worldToLocal(w)); coffin.rotation.z = coffin0.r.z + u2 * 2.4; coffin.rotation.x = u2 * .8; } }
    if (heldCoffin) heldCoffin.visible = f >= 850;
    if (certWhole) { certWhole.visible = f < 913; certBit.visible = f >= 913; }
  } };
}
const ANCH = (b, k) => (b.anchors && b.anchors[k]) || [0, 0, .03];

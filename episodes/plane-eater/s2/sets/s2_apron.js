// s2_apron.js: plane-eater S2 THE TABLE (rows 10-18, frames 257-519). The shared apron set (apron.js) + the hero Cessna (sliced state, rows 2-9 already cut)
// + the table props of line 3-4 from props/out (oil glass, jug + tumbler, kitchen scale with a live needle, sugar tongs, the four list bites) and the
// held3d builders for them (origin = grip, business end +X, PROPS.md section 3). S2 stretch builder 2026-11-22.
// The set's own oil glass, jug and tumbler (apron_lite.glb) are hidden: ours are the same props in the same spots, so a hand can lift them.
import { build as apronBuild } from './apron.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
const P = new URL('../props/out/', import.meta.url).href, ld = new GLTFLoader();
const G = {};
for (const n of ['cessna150_sliced', 'oil_glass', 'water_jug', 'kitchen_scale', 'sugar_tongs', 'metal_bites']) G[n] = (await ld.loadAsync(P + n + '.glb')).scene;
// plan metres (X east, Y north, Z up): table spots, chosen within reach of Michel on the chair (3.4, -1.0) and on the cloth (y -0.72..0.08, z 0.78)
export const SPOT = { oil: [3.6, -0.56, .78], jug: [3.66, -0.36, .78], tumbler: [3.5, -0.62, .78], scale: [3.62, -0.42, .786], plate: [3.4, -0.46, .78] };
let THREE_ = null; const live = { needle: null, hub: null, strand: null, spring: null, crumbs: [] };
const node = (root, re) => { const out = []; root.traverse(o => { if (re.test(o.name)) out.push(o); }); return out; };
const clone = n => G[n].clone(true);
function part(name, keep) { const g = clone(name); g.traverse(o => { if (o.isMesh && !keep.test(o.name)) o.visible = false; }); return g; }
// ---- held3d builders (called once with { inHand: true })
function wrap(g, tipX = .1) { const T = THREE_; const group = new T.Group(); group.add(g); return { group, grip: new T.Vector3(0, 0, 0), tip: new T.Vector3(tipX, 0, 0) }; }
export function buildOil(T) { THREE_ ||= T; return wrap(clone('oil_glass'), .02); }
export function buildJug(T) { THREE_ ||= T; const g = part('water_jug', /^jug/); g.position.set(.12, -.17, 0); return wrap(g, .25); }      // grip = the handle (x -0.12, z 0.17)
export function buildTumbler(T) { THREE_ ||= T; const g = part('water_jug', /^tumbler/); g.position.set(-.22, -.05, 0); return wrap(g, .02); }
export function buildTongs(T) { THREE_ ||= T; const g = clone('sugar_tongs'); const b = part('metal_bites', /^bite_2/); b.position.set(-.04, -.005, .03); b.scale.setScalar(.8); g.add(b);
  live.tongsBite = b; return wrap(g, .12); }
// the four list bites (fix 1): the props-hero bites (props/out/metal_bites.glb bite_0..5, 3-4 cm squares, 1.5 mm sheet, cut aluminium edges, rivets)
// repainted with the look of the part they come from, held 5.5x (round 2: the lead wants each bite ~1/5 of the close frame) (a bite is still neat and small next to his cartoon head, but it must read on a phone)
function mat(T, c, r = .35, m = 0) { return new T.MeshStandardMaterial({ color: c, roughness: r, metalness: m }); }
function bite(T, name, paint, extra) { const g = new T.Group(), b = part('metal_bites', new RegExp('^' + name + '($|_)')); const box = new T.Box3().setFromObject(b), c = box.getCenter(new T.Vector3());
  b.position.sub(c); b.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); if (paint[o.name] || paint['*']) o.material.color.set(paint[o.name] || paint['*']); if (paint.metal && !/rivet|stripe/.test(o.name)) { o.material.metalness = paint.metal; o.material.roughness = .25; } } });
  const holder = new T.Group(); holder.add(b); holder.rotation.x = Math.PI / 2; holder.position.x = .1; holder.scale.setScalar(5.5); g.add(holder); if (extra) extra(g);
  return { group: g, grip: new T.Vector3(0, 0, 0), tip: new T.Vector3(.1, 0, 0) }; }
export function buildWingSlice(T) { THREE_ ||= T; return bite(T, 'bite_2', { '*': '#f3f4f1', bite_2_stripe: '#1d3461' }); }                        // white skin + the navy stripe
export function buildHub(T) { THREE_ ||= T; return bite(T, 'bite_3', { '*': '#c9ccd1', metal: 1 }, g => { const ty = new T.Mesh(new T.TorusGeometry(.05, .014, 10, 24, Math.PI), mat(T, '#26272b', .62)); ty.position.x = .05; ty.rotation.x = Math.PI / 2; g.add(ty); }); }   // cast hub + a half ring of tyre
export function buildCushion(T) { THREE_ ||= T; return bite(T, 'bite_4', { '*': '#2f5fb0' }, g => { const sp = new T.Mesh(new T.TorusGeometry(.012, .003, 6, 12), mat(T, '#c9ccd1', .2, 1)); sp.position.set(.08, .03, 0); g.add(sp); live.spring = sp; }); }   // blue seat foam + its spring
export function buildTire(T) { THREE_ ||= T; const r = bite(T, 'bite_5', { '*': '#232428' }); for (const o of r.group.children) o.traverse(m => { if (m.isMesh) m.material.roughness = .7; }); live.tireG = r.group; return r; }   // black rubber
const HELD = [['oil', 283, 316], ['jug', 318, 343], ['tumbler', 344, 362]];     // the static copy hides while it is in a hand (film frames)
export async function build(THREE, scene, film, ctx) {
  THREE_ = THREE; const V = p => ctx.B2T(p);
  const base = await apronBuild(THREE, scene, film, ctx);
  scene.traverse(o => { if (/^(oil_glass|oil_in_glass|water_jug|jug_water|jug_handle|tumbler|scale_mat)$/.test(o.name)) o.visible = false; });
  // the hero Cessna, sliced like a loaf (PROPS.md state S1), on its spot, nose south (the glb is already plan-registered: glTF +Y up)
  const plane = clone('cessna150_sliced'); plane.position.copy(V(ANCH(base, 'cessna_spot'))); plane.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } }); scene.add(plane);
  const put = (g, p, yawDeg = 0) => { g.position.copy(V(p)); g.rotation.y = yawDeg * Math.PI / 180; g.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; }); scene.add(g); return g; };
  const st = { oil: put(clone('oil_glass'), SPOT.oil), jug: put(part('water_jug', /^jug/), SPOT.jug, 180), tumbler: put(part('water_jug', /^tumbler/), [SPOT.tumbler[0] - .22, SPOT.tumbler[1], .78]) };
  const sc = put(clone('kitchen_scale'), SPOT.scale, 154);       // fix 1: dial (-Y) faces the row-13 lens north-east of the table (his face behind the scale)
  live.needle = node(sc, /^scale_needle$/)[0];
  // the bites waiting on the main plate: a neat stack of squares + the four list pieces before they are taken
  const pile = put(clone('metal_bites'), [3.36, -0.47, .8], 20); pile.scale.setScalar(.9);
  const onScale = put(part('metal_bites', /^bite_[0-4]/), [SPOT.scale[0], SPOT.scale[1], 1.0], -30); onScale.scale.setScalar(.7); live.onScale = onScale;
  // crumbs of white paint on the wing snap (row 14): 10 tiny chips, seeded
  let s = 14; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(.008, .002, .008), mat(THREE, i % 3 ? '#f3f4f1' : '#1d3461', .3)); m.userData.v = [rnd() - .2, rnd() * .6, rnd() - .5]; m.visible = false; scene.add(m); live.crumbs.push(m); }
  // the chair (fix 1): pulled out to y -1.20 (S1 state, he stands behind it at -1.45), tucked in with him to -1.0 by 281 (the act glide)
  const chair = []; scene.traverse(o => { if (/^chair_/.test(o.name)) chair.push(o); });
  // the gum strand (fix 1): from the tire in his hand to his mouth (MOUTH = his near-hand grip at the bite, f478, from --held)
  const strand = new THREE.Mesh(new THREE.CylinderGeometry(.012, .02, 1, 10), mat(THREE, '#2b2c30', .6)); strand.visible = false; scene.add(strand);
  const MOUTH = V(MOUTH_P), tmp = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  // round 2: props in the pinned hand (film.json hand_at windows): the object sits on the fist point, 6 cm above it
  const B = n => { const b = (n === 'oil' ? buildOil : n === 'wing' ? buildWingSlice : n === 'hub' ? buildHub : n === 'cushion' ? buildCushion : buildTire)(THREE).group;
    if (n === 'oil') b.scale.setScalar(2.2); b.traverse(o => { if (o.isMesh) o.castShadow = true; }); b.visible = false; scene.add(b); return b; };
  const inHand = { oil: B('oil'), wing: B('wing'), hub: B('hub'), cushion: B('cushion'), tire: B('tire') };
  const WHO = f => f >= 290 && f <= 314 ? 'oil' : f >= 395 && f <= 410 ? 'wing' : f >= 417 && f <= 432 ? 'hub' : f >= 440 && f <= 456 ? 'cushion' : f >= 470 && f <= 489 ? 'tire' : null;
  const HW = (film.hand_at || []).filter(h => h.who === 'michel');
  const needle0 = live.needle ? live.needle.rotation.clone() : null;
  return { anchors: { ...base.anchors, ...SPOT }, update: (f, t) => { base.update && base.update(f, t);
    for (const [k, a, b] of HELD) st[k].visible = !(f >= 290 && f <= 316 && k === 'oil');
    const w = WHO(f), hw = HW.find(h => f >= h.f0 && f <= h.f1);
    for (const [k, g] of Object.entries(inHand)) { g.visible = k === w && !!hw; if (g.visible) { g.position.copy(V([hw.at[0], hw.at[1], hw.at[2] + .06])); g.rotation.set(0, -1.2, k === 'oil' ? 0 : .5); } }
    if (live.tireG !== inHand.tire) live.tireG = inHand.tire;
    // the scale: empty (0 lb) until the bites drop on "pounds" (365); the needle swings past 2 lb to 3.1, wobbles, settles ON 2 lb by 386
    const lb = f < 365 ? 0 : 2 + 1.1 * Math.exp(-(f - 365) / 5) * Math.cos((f - 365) * .55) - 2 * Math.exp(-(f - 365) / 1.2);
    if (live.needle) { live.needle.rotation.copy(needle0); live.needle.rotateZ(-(lb - 2) * 75 * Math.PI / 180); }
    onScale.visible = f >= 363; onScale.position.copy(V([SPOT.scale[0], SPOT.scale[1], f < 365 ? .97 + (365 - f) * .015 : .905 - .01 * Math.exp(-(f - 365) / 2) * Math.abs(Math.cos((f - 365) * 1.2))]));
    if (live.tongsBite) live.tongsBite.visible = f < 364;
    { const u = f < 266 ? 0 : f >= 281 ? 1 : (f - 266) / 15, k = u * u * (3 - 2 * u), dy = -0.20 * (1 - k); for (const o of chair) o.position.z = -dy; }
    // the tire strand: from the tire to his mouth while he pulls (480-488), snaps back on 489 (gone by 492)
    strand.visible = false;
    if (live.tireG && f >= 480 && f <= 489 && live.tireG.visible) { live.tireG.updateWorldMatrix(true, false); live.tireG.getWorldPosition(tmp);
      const m = f <= 488 ? MOUTH.clone() : MOUTH.clone().lerp(tmp, Math.min(1, (f - 488) / 3)), d = tmp.clone().sub(m), L = d.length();
      if (L > .02) { strand.visible = true; strand.position.copy(m).addScaledVector(d, .5); strand.scale.set(1 - .5 * Math.min(1, L / .5), L, 1 - .5 * Math.min(1, L / .5)); strand.quaternion.setFromUnitVectors(up, d.normalize()); } }
    // the seat spring boings out on 452, pushed back in 460
    if (live.spring) { const o = f < 452 ? 0 : f < 460 ? .05 * Math.min(1, (f - 452) / 2) + .008 * Math.sin((f - 452) * 2.4) : Math.max(0, .05 - (f - 460) * .012); live.spring.position.y = .04 + o; }
    // crumbs: fly out from the bite point on 407, fall, land on the cloth by 420
    live.crumbs.forEach((m, i) => { const u = (f - 407) / 30; m.visible = f >= 407 && f < 470; if (!m.visible) return; const v = m.userData.v;
      m.position.copy(V([3.55 + v[0] * .25 * Math.min(u, .5), -0.78 + v[2] * .2 * Math.min(u, .5), Math.max(.785, 1.12 + v[1] * .3 * u - 4.9 * u * u)])); m.rotation.set(i + f * .3, i * 2, 0); });
  } };
}
export let MOUTH_P = [3.45, -0.92, 1.16];
const ANCH = (b, k) => (b.anchors && b.anchors[k]) || [0, 0, .03];

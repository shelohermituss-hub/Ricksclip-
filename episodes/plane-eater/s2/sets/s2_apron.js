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
// the four list bites: built here (small, clean, flat paint; the Blender pass rebuilds them from the lock)
function mat(T, c, r = .35, m = 0) { return new T.MeshStandardMaterial({ color: c, roughness: r, metalness: m }); }
export function buildWingSlice(T) { THREE_ ||= T; const g = new T.Group();
  const s = new T.Mesh(new T.BoxGeometry(.16, .012, .1), mat(T, '#f3f4f1', .25)); s.position.x = .08; g.add(s);
  const st = new T.Mesh(new T.BoxGeometry(.16, .013, .025), mat(T, '#1d3461', .3)); st.position.set(.08, 0, .02); g.add(st);
  const bite = new T.Mesh(new T.CylinderGeometry(.03, .03, .016, 16), mat(T, '#b8bcc2', .28, 1)); bite.position.set(.16, 0, 0); g.add(bite);   // the bitten crescent (bare aluminium)
  return { group: g, grip: new T.Vector3(0, 0, 0), tip: new T.Vector3(.16, 0, 0) }; }
export function buildHub(T) { THREE_ ||= T; const g = new T.Group();
  const tire = new T.Mesh(new T.TorusGeometry(.075, .028, 12, 28), mat(T, '#26272b', .62)); tire.position.x = .09; g.add(tire);
  const hub = new T.Mesh(new T.CylinderGeometry(.055, .055, .05, 24), mat(T, '#c9ccd1', .22, 1)); hub.rotation.x = Math.PI / 2; hub.position.x = .09; g.add(hub);
  return { group: g, grip: new T.Vector3(0, 0, 0), tip: new T.Vector3(.17, 0, 0) }; }
export function buildCushion(T) { THREE_ ||= T; const g = new T.Group();
  const c = new T.Mesh(new T.BoxGeometry(.18, .06, .14), mat(T, '#7a4a2c', .55)); c.position.x = .09; g.add(c);
  const sp = new T.Mesh(new T.TorusGeometry(.012, .003, 6, 12), mat(T, '#c9ccd1', .2, 1)); sp.position.set(.17, .04, 0); g.add(sp); live.spring = sp;
  return { group: g, grip: new T.Vector3(0, 0, 0), tip: new T.Vector3(.18, 0, 0) }; }
export function buildTire(T) { THREE_ ||= T; const g = new T.Group();
  const tire = new T.Mesh(new T.TorusGeometry(.09, .035, 12, 28, Math.PI * 1.3), mat(T, '#26272b', .62)); tire.position.x = .02; tire.rotation.z = -Math.PI * .65; g.add(tire);
  const strand = new T.Mesh(new T.CylinderGeometry(.012, .018, 1, 10), mat(T, '#2b2c30', .55)); strand.rotation.z = Math.PI / 2; strand.position.x = .11; strand.scale.set(1, .02, 1); g.add(strand); live.strand = strand;
  return { group: g, grip: new T.Vector3(0, 0, 0), tip: new T.Vector3(.12, 0, 0) }; }

const HELD = [['oil', 283, 316], ['jug', 318, 343], ['tumbler', 344, 362]];     // the static copy hides while it is in a hand (film frames)
export async function build(THREE, scene, film, ctx) {
  THREE_ = THREE; const V = p => ctx.B2T(p);
  const base = await apronBuild(THREE, scene, film, ctx);
  scene.traverse(o => { if (/^(oil_glass|oil_in_glass|water_jug|jug_water|jug_handle|tumbler|scale_mat)$/.test(o.name)) o.visible = false; });
  // the hero Cessna, sliced like a loaf (PROPS.md state S1), on its spot, nose south (the glb is already plan-registered: glTF +Y up)
  const plane = clone('cessna150_sliced'); plane.position.copy(V(ANCH(base, 'cessna_spot'))); plane.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } }); scene.add(plane);
  const put = (g, p, yawDeg = 0) => { g.position.copy(V(p)); g.rotation.y = yawDeg * Math.PI / 180; g.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; }); scene.add(g); return g; };
  const st = { oil: put(clone('oil_glass'), SPOT.oil), jug: put(part('water_jug', /^jug/), SPOT.jug, 180), tumbler: put(part('water_jug', /^tumbler/), [SPOT.tumbler[0] - .22, SPOT.tumbler[1], .78]) };
  const sc = put(clone('kitchen_scale'), SPOT.scale, -30);       // dial (-Y) turned toward the lens side (south-east)
  live.needle = node(sc, /^scale_needle$/)[0];
  // the bites waiting on the main plate: a neat stack of squares + the four list pieces before they are taken
  const pile = put(clone('metal_bites'), [3.36, -0.47, .8], 20); pile.scale.setScalar(.9);
  const onScale = put(part('metal_bites', /^bite_[0-4]/), [SPOT.scale[0], SPOT.scale[1], 1.0], -30); onScale.scale.setScalar(.7); live.onScale = onScale;
  // crumbs of white paint on the wing snap (row 14): 10 tiny chips, seeded
  let s = 14; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(.008, .002, .008), mat(THREE, i % 3 ? '#f3f4f1' : '#1d3461', .3)); m.userData.v = [rnd() - .2, rnd() * .6, rnd() - .5]; m.visible = false; scene.add(m); live.crumbs.push(m); }
  const needle0 = live.needle ? live.needle.rotation.clone() : null;
  return { anchors: { ...base.anchors, ...SPOT }, update: (f, t) => { base.update && base.update(f, t);
    for (const [k, a, b] of HELD) st[k].visible = !(f >= a && f <= b);
    // the scale: empty (0 lb) until the bites drop on "pounds" (365); the needle swings past 2 lb to 3.1, wobbles, settles ON 2 lb by 386
    const lb = f < 365 ? 0 : 2 + 1.1 * Math.exp(-(f - 365) / 5) * Math.cos((f - 365) * .55) - 2 * Math.exp(-(f - 365) / 1.2);
    if (live.needle) { live.needle.rotation.copy(needle0); live.needle.rotateZ(-(lb - 2) * 75 * Math.PI / 180); }
    onScale.visible = f >= 363; onScale.position.copy(V([SPOT.scale[0], SPOT.scale[1], f < 365 ? .97 + (365 - f) * .015 : .905 - .01 * Math.exp(-(f - 365) / 2) * Math.abs(Math.cos((f - 365) * 1.2))]));
    if (live.tongsBite) live.tongsBite.visible = f < 364;
    // the tire strand: stretches like gum 480-488 (to 0.42 m), snaps back on 489
    if (live.strand) { const L = f < 480 ? .02 : f < 489 ? .02 + .4 * Math.min(1, (f - 480) / 8) ** .8 : Math.max(.02, .42 * Math.exp(-(f - 489) * 1.6)); live.strand.scale.y = L; live.strand.position.x = .11 + L / 2; }
    // the seat spring boings out on 452, pushed back in 460
    if (live.spring) { const o = f < 452 ? 0 : f < 460 ? .05 * Math.min(1, (f - 452) / 2) + .008 * Math.sin((f - 452) * 2.4) : Math.max(0, .05 - (f - 460) * .012); live.spring.position.y = .04 + o; }
    // crumbs: fly out from the bite point on 407, fall, land on the cloth by 420
    live.crumbs.forEach((m, i) => { const u = (f - 407) / 30; m.visible = f >= 407 && f < 470; if (!m.visible) return; const v = m.userData.v;
      m.position.copy(V([3.55 + v[0] * .25 * Math.min(u, .5), -0.78 + v[2] * .2 * Math.min(u, .5), Math.max(.785, 1.12 + v[1] * .3 * u - 4.9 * u * u)])); m.rotation.set(i + f * .3, i * 2, 0); });
  } };
}
const ANCH = (b, k) => (b.anchors && b.anchors[k]) || [0, 0, .03];

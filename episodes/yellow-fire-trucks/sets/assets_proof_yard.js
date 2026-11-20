// assets_proof_yard.js: PROOF ONLY (props-hero 2026-11-20, props/ASSET_PACK.jpg). The asset-test yard (sets/_asset_test/sets/asset_yard.js: same floor,
// wall, sign, light) with the PRODUCTION truck of sets/assets.js, and the compressor + air hose. Place keys: paint, edge, drain, masking, letters, ribbon, comp.
// Plan metres, Z up; truck at the origin, front toward -x, driver's side toward -y (= the Blender frame of assets_prod/out/truck.blend).
import { kit, handText } from './prop_kit.js';
import { buildTruck, buildCompressor, buildAirHose, place } from './assets.js';
export async function build(THREE, scene, film, ctx) {
  const { B2T } = ctx, pl = ctx.place || {}, K = kit(THREE, ctx), V = (x, y, z) => B2T([x, y, z]);
  const add = (geo, mat, name, role, p, sh = true) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = sh; m.receiveShadow = true; scene.add(m); return m; };
  const box = (sx, sy, sz, mat, name, role, x, y, z, sh) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, role, V(x, y, z), sh);
  if (ctx.sky && ctx.sky.clouds) ctx.sky.clouds({ kind: 'clear-day', seed: 4 });
  const conc = ctx.relief('plaster', '#aeaaa0', { size: 4, normal: 1.4 }), brick = ctx.relief('brick', '#9a5a44'), wood = ctx.relief('wood', '#e6e0cc', { size: 1.2 });
  const fl = add(new THREE.PlaneGeometry(90, 70), conc, 'yard_concrete', 'ground', V(0, 0, 0), false); fl.rotation.x = -Math.PI / 2;
  for (let i = -5; i <= 5; i++) { const j = add(new THREE.PlaneGeometry(.035, 70), K.std('#5e5a52'), 'joint', 'ground', V(i * 4.2 + 1.1, 0, .003), false); j.rotation.x = -Math.PI / 2; const k = add(new THREE.PlaneGeometry(90, .035), K.std('#5e5a52'), 'joint', 'ground', V(0, i * 4.2 - 1.6, .003), false); k.rotation.x = -Math.PI / 2; }
  box(13, .4, 6.4, brick, 'wall_l', 'brick', -11.5, 13, 3.2); box(13, .4, 6.4, brick, 'wall_r', 'brick', 11.5, 13, 3.2); box(10, .4, 1.9, brick, 'lintel', 'brick', 0, 13, 5.45);
  box(10, .1, 4.5, wood, 'bay_door', 'wood', 0, 13.1, 2.25);
  const sign = K.tex('station_sign', 1024, 160, (c, w, h) => { c.fillStyle = '#20301f'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e8b93c'; c.lineWidth = 6; c.strokeRect(10, 10, w - 20, h - 20); handText(c, 'PINE HOLLOW FIRE DEPT.  ·  ENGINE No. 1', w / 2, 84, 44, { fill: '#e8b93c', shade: '#0a0f0a', seed: 8 }); });
  add(new THREE.PlaneGeometry(8, 1.25), new THREE.MeshStandardMaterial({ map: sign, roughness: .7 }), 'sign', 'wood', V(0, 12.78, 5.4), false);
  const t0 = performance.now();
  const T = await buildTruck(THREE, ctx, { paint: pl.paint || 'red', edge: pl.edge ?? .3, drain: pl.drain ?? 0, masking: !!pl.masking, letters: pl.letters || 'over', ribbon: !!pl.ribbon });
  place(THREE, scene, ctx, T, [0, 0, 0], 0);
  const stats = { tris: T.tris, load_ms: Math.round(performance.now() - t0), anchors: Object.keys(T.anchors) };
  if (pl.comp) { const C = buildCompressor(THREE, ctx); place(THREE, scene, ctx, C, pl.comp, 0); const o = C.group.localToWorld(C.outlet.clone());
    const H = buildAirHose(THREE, ctx, { from: o.toArray(), to: V(...(pl.hose_to || [1.2, -2.2, .05])).toArray() }); scene.add(H.group); }
  console.warn('PHFD_PROOF ' + JSON.stringify(stats));
  return { anchors: { truck: [0, 0, 1.4], gun_spot: [1.0, -2.2, 1.2] } };
}

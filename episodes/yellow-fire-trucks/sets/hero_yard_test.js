// hero_yard_test.js: a TEST YARD only (props-hero 2026-11-20), to prove hero_truck.js and hero_props.js under one sun. Never the film's set (the set-builder owns that).
// Plan metres, Z up. Truck at the origin, front toward -x, driver's side toward -y (the lens). Place keys: truck: { paint, masking, edge, wear }, kit: true (compressor, tin, hose).
import * as HT from './hero_truck.js';
import * as HP from './hero_props.js';
import { kit, handText } from './prop_kit.js';
export async function build(THREE, scene, film, ctx) {
  const { B2T } = ctx, pl = ctx.place || {}, K = kit(THREE, ctx), O = pl.origin || [0, 0], V = (x, y, z) => B2T([x + O[0], y + O[1], z]), at = p => [p[0] + O[0], p[1] + O[1], p[2] || 0];
  const add = (geo, mat, name, role, p, sh = true) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = sh; m.receiveShadow = true; scene.add(m); return m; };
  const box = (sx, sy, sz, mat, name, role, x, y, z, sh) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, role, V(x, y, z), sh);
  if (ctx.sky && ctx.sky.clouds) ctx.sky.clouds({ kind: 'clear-day', seed: 4 });
  const conc = ctx.relief('plaster', '#aeaaa0', { size: 4, normal: 1.4 }), brick = ctx.relief('brick', '#9a5a44'), wood = ctx.relief('wood', '#e6e0cc', { size: 1.2 });
  const fl = add(new THREE.PlaneGeometry(90, 70), conc, 'yard_concrete', 'ground', V(0, 0, 0), false); fl.rotation.x = -Math.PI / 2;
  for (let i = -5; i <= 5; i++) { const j = add(new THREE.PlaneGeometry(.035, 70), K.std('#5e5a52'), 'concrete_expansion_joint', 'ground', V(i * 4.2 + 1.1, 0, .003), false); j.rotation.x = -Math.PI / 2; const k = add(new THREE.PlaneGeometry(90, .035), K.std('#5e5a52'), 'concrete_expansion_joint', 'ground', V(0, i * 4.2 - 1.6, .003), false); k.rotation.x = -Math.PI / 2; }
  // station wall with the bay door behind the truck, a low boundary wall on the far side
  box(13, .4, 6.4, brick, 'station_wall_left', 'brick', -11.5, 13, 3.2); box(13, .4, 6.4, brick, 'station_wall_right', 'brick', 11.5, 13, 3.2); box(10, .4, 1.9, brick, 'station_wall_lintel', 'brick', 0, 13, 5.45);
  box(10, .1, 4.5, wood, 'bay_door_sectional', 'wood', 0, 13.1, 2.25); for (let i = 1; i < 5; i++) box(10, .12, .04, K.std('#8a8576'), 'bay_door_panel_joint', 'wood', 0, 13.04, i * .9, false);
  for (let i = -3; i <= 3; i++) box(.9, .12, .5, K.std('#27343c', { roughness: .2 }), 'bay_door_window', 'glass', i * 1.3, 13.03, 3.15, false);
  const sign = K.tex('station_sign', 1024, 160, (c, w, h) => { c.fillStyle = '#20301f'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e8b93c'; c.lineWidth = 6; c.strokeRect(10, 10, w - 20, h - 20); handText(c, 'PINE HOLLOW FIRE DEPT.  ·  ENGINE No. 1', w / 2, 84, 44, { fill: '#e8b93c', shade: '#0a0f0a', seed: 8 }); });
  const sg = add(new THREE.PlaneGeometry(8, 1.25), new THREE.MeshStandardMaterial({ map: sign, roughness: .7 }), 'station_sign_board', 'wood', V(0, 12.78, 5.4), false);
  box(60, .3, 1.8, brick, 'boundary_wall', 'brick', 0, -26, .9); box(60, .4, .12, K.std('#9a958a'), 'boundary_wall_coping', 'stone', 0, -26, 1.86);
  // yard marks: a painted bay line, a drain, oil spots
  for (const x of [-5.2, 5.2]) { const l = add(new THREE.PlaneGeometry(.12, 9), new THREE.MeshStandardMaterial({ color: '#e8e4d6', roughness: .9, transparent: true, opacity: .8, polygonOffset: true, polygonOffsetFactor: -2 }), 'bay_line_paint', 'paint', V(x, 0, .004), false); l.rotation.x = -Math.PI / 2; }
  const oil = K.tex('oil_spot', 128, 128, (c, w, h) => { c.clearRect(0, 0, w, h); for (let i = 0; i < 9; i++) { const x = 64 + (Math.random() - .5) * 60, y = 64 + (Math.random() - .5) * 60, r = 10 + Math.random() * 26, gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(30,26,22,.5)'); gr.addColorStop(1, 'rgba(30,26,22,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); } });
  for (const [x, y, s] of [[-2.4, .1, 1.6], [1.8, -.2, 1.2], [3.2, -3.4, .8], [-5.5, -4, 1.0]]) { const o = add(new THREE.PlaneGeometry(s, s), new THREE.MeshStandardMaterial({ map: oil, transparent: true, depthWrite: false, roughness: .4, polygonOffset: true, polygonOffsetFactor: -3 }), 'oil_spot', 'ground', V(x, y, .005), false); o.rotation.x = -Math.PI / 2; }
  box(.5, .5, .02, K.metal('iron', '#3a3d44', .6, .6, { rust: .3 }), 'yard_drain_grate', 'metal', 4.6, -2.6, .01, false);
  // THE TRUCK
  const T = pl.truck || {}, truck = HT.buildTruck(THREE, ctx, { paint: T.paint || 'red', masking: T.masking, edge: T.edge ?? .3, wear: T.wear, ribbon: T.ribbon, sirens: T.sirens, horns: T.horns, engine: T.engine });
  HT.place(THREE, scene, ctx, truck, at([0, 0, 0]), T.yaw || 0); truck.update(); if (T.steer) truck.setSteer(T.steer);
  const anchors = { ...truck.plan }; let stats = { truck_tris: truck.tris, truck_meshes: truck.parts.length, truck_part_kinds: truck.partKinds };
  if (pl.kit) { const comp = HP.buildCompressor(THREE, ctx, {}); HP.place(THREE, scene, ctx, comp, at([2.6, -3.3, 0]), 200); const tin = HP.buildPaintTin(THREE, ctx, {}); HP.place(THREE, scene, ctx, tin, at([1.75, -3.0, 0]), 30);
    const gun = pl.gun_on_floor ? HP.buildSprayGun(THREE, ctx, { hose: 0 }) : null; if (gun) { HP.place(THREE, scene, ctx, gun, at([1.35, -3.25, .17]), 20); }
    const hose = HP.buildAirHose(THREE, ctx, { from: B2T(comp.plan.outlet).toArray(), to: B2T(at(pl.hose_to || [.75, -2.2, .02])).toArray() }); scene.add(hose.group);
    Object.assign(anchors, { compressor: comp.plan.top, tin: tin.plan.rim }); stats = { ...stats, compressor_tris: comp.tris, compressor_kinds: new Set(comp.parts.map(p => p.name)).size, tin_tris: tin.tris, tin_kinds: new Set(tin.parts.map(p => p.name)).size };
    const g2 = HP.buildSprayGun(THREE, ctx, { hose: 0 }); stats.gun_tris = g2.tris; stats.gun_kinds = new Set(g2.parts.map(p => p.name)).size; }
  console.warn('HERO_STATS ' + (pl.set_key || '') + ' ' + JSON.stringify(stats));
  if (typeof window !== 'undefined') { (window.__heroStats ||= {})[pl.set_key || T.paint || 'red'] = stats; window.__heroParts = truck.partNames; }
  return { update: () => { truck.update(); }, anchors };
}

// SET "lp_testroom" (look helper phase A 2026-11-16): a TEST BOX only, to prove the look pack and the light kinds CO / NI / AF / GR / EV until the real
// corridor / office / stairwell sets exist. Never used in the film. Plan metres, Z up; room 5 x 6 x 3.2 m, back wall y = 3 with a 1.6 x 1.4 m window.
// Place key  dress: 'CO' corridor (terrazzo, butter plaster over the sea-green tile dado, bumper rail, plastic chairs, Texas sky)
//                   'NI' | 'AF' | 'GR' office (veneer panelling, carpet tile, olive lockers, desk + desk lamp, venetian blinds; night / stripes / 2004 overcast)
//                   'EV' stairwell (painted cinder block over the tile dado, terrazzo steps, steel handrail, coral 7:15 PM sky)
import * as LP from './look_pack.js';
export async function build(THREE, scene, film, ctx) {
  const { B2T, toon } = ctx, V = (x, y, z) => B2T([x, y, z]), pl = ctx.place || {}, D = pl.dress || 'CO', M = LP.pack(THREE, ctx), L = ctx.light || {};
  const add = (geo, mat, name, role, p, sh = true) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = sh; m.receiveShadow = true; scene.add(m); return m; };
  const box = (sx, sy, sz, mat, name, role, x, y, z, sh) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, role, V(x, y, z), sh);
  scene.children.forEach(o => { if (o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.radius === 400) o.visible = false; });
  scene.background = new THREE.Color(L.top || '#333'); LP.applyLight(THREE, scene, ctx, { fog: [8, 30] });
  const office = /NI|AF|GR/.test(D), stair = D === 'EV';
  const floorM = office ? M.vinylOf('#b0a080') : M.terrazzo, upper = office ? M.veneer : stair ? M.block : M.plaster, lower = office ? M.veneer : M.dadoTile, dz = office ? 0 : 1.2;
  const f = add(new THREE.PlaneGeometry(5, 6), floorM, 'test_floor', 'floor', V(0, 0, 0), false); f.rotation.x = -Math.PI / 2;
  box(5, 6, .1, M.paint(office ? '#e8e2d0' : '#f2ecd8'), 'test_ceiling', 'ceiling', 0, 0, 3.25, false);
  // side walls (lower dado + upper)
  for (const x of [-2.55, 2.55]) { if (dz) box(.1, 6, dz, lower, 'test_dado', 'wall', x, 0, dz / 2, true); box(.1, 6, 3.2 - dz, upper, 'test_wall', 'wall', x, 0, dz + (3.2 - dz) / 2, true); if (dz) box(.05, 6, .06, M.steel, 'bumper_rail', 'metal', x * .985, 0, dz + .02, false); }
  // back wall around the window (x .6 +- .8, z .8 .. 2.2), cast shadows so the sun only comes in through the glass
  const wx0 = -.2, wx1 = 1.4, wz0 = .8, wz1 = 2.2, Y = 3;
  const wall = (x0, x1, z0, z1) => { const zm = Math.max(z0, Math.min(z1, dz)); if (dz && zm > z0) box(x1 - x0, .12, zm - z0, lower, 'test_back_dado', 'wall', (x0 + x1) / 2, Y, (z0 + zm) / 2, true); if (z1 > zm) box(x1 - x0, .12, z1 - zm, upper, 'test_back_wall', 'wall', (x0 + x1) / 2, Y, (zm + z1) / 2, true); };
  wall(-2.5, wx0, 0, 3.2); wall(wx1, 2.5, 0, 3.2); wall(wx0, wx1, 0, wz0); wall(wx0, wx1, wz1, 3.2);
  if (dz) box(5, .05, .06, M.steel, 'bumper_rail_back', 'metal', 0, Y - .07, dz + .02, false);
  box(1.7, .16, .05, M.paint('#e8e4d8'), 'window_sill', 'wood', .6, Y - .05, wz0, true); for (const x of [wx0, wx1]) box(.04, .14, 1.4, M.steelDk, 'window_frame', 'metal', x, Y, 1.5, true); box(.03, .1, 1.4, M.steelDk, 'window_mullion', 'metal', .6, Y, 1.5, true);
  const sk = LP.sky(THREE, ctx, { CO: 'texas', NI: 'night', AF: 'texas', GR: 'overcast', EV: 'coral' }[D], { w: 6, h: 3.75, at: [.6, 4.2, 1.6] }); scene.add(sk.mesh);
  const ticks = [sk.update];
  // the window sun (set-owned, like the real sets): a directional from L.dir through the window with its own tight shadow box, so blind stripes / shafts land on the floor
  if (pl.win_sun !== false && !/NI/.test(D)) { const dir = new THREE.Vector3(...(L.dir || [-1, 2, -6])).normalize(), c = V(.6, Y, 1.5), sun = new THREE.DirectionalLight(L.sun || '#ffffff', (L.si || 1) * (pl.win_k ?? 1.2));
    sun.position.copy(c).addScaledVector(dir, 8); sun.target.position.copy(c).addScaledVector(dir, -3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: .5, far: 20 }); sun.shadow.bias = -.0005; sun.name = 'window_sun'; scene.add(sun); scene.add(sun.target); }
  if (office) { const open = D === 'NI' ? .5 : D === 'AF' ? .9 : .7; for (let i = 0; i < 14; i++) { const s = box(1.6, .05, .012, M.paint('#e8e0c8'), 'blind_slat', 'plastic', .6, Y - .1, wz1 - .05 - i * .1, true); s.rotation.x = open; }
    box(1.65, .06, .05, M.steelDk, 'blind_head', 'metal', .6, Y - .1, wz1 + .02, true);
    // desk + lamp + lockers
    box(1.5, .75, .04, M.desk, 'desk_top', 'wood', .3, 1.6, .76, true); for (const [x, y] of [[-.4, 1.3], [1.0, 1.3], [-.4, 1.9], [1.0, 1.9]]) box(.05, .05, .74, M.steelDk, 'desk_leg', 'metal', x, y, .37, true);
    box(.45, .7, .7, M.desk, 'desk_pedestal', 'wood', .8, 1.6, .38, true);
    const lampP = [-.2, 1.75, 1.15]; add(new THREE.ConeGeometry(.12, .16, 18, 1, true), M.steel, 'desk_lamp_shade', 'metal', V(...lampP)); add(new THREE.CylinderGeometry(.01, .01, .35, 8), M.chrome, 'desk_lamp_arm', 'metal', V(lampP[0], lampP[1], .95)); add(new THREE.CylinderGeometry(.08, .09, .03, 16), M.steelDk, 'desk_lamp_base', 'metal', V(lampP[0], lampP[1], .79));
    if (D !== 'AF') { const pt = new THREE.PointLight(D === 'NI' ? '#ffb45a' : '#ffd8a0', D === 'NI' ? 7 : 1.6, 5, 1.6); pt.position.copy(V(lampP[0], lampP[1], lampP[2] - .08)); pt.castShadow = true; scene.add(pt); add(new THREE.CircleGeometry(.1, 16), M.glow(D === 'NI' ? '#ffd8a0' : '#fff0d0'), 'desk_lamp_bulb_lens', 'lamp', V(lampP[0], lampP[1], lampP[2] - .07), false).rotation.x = Math.PI / 2; }
    if (D === 'GR') { box(.4, .38, .34, toon('#d8d0b8'), 'crt_2004', 'plastic', .7, 1.75, .95, true); add(new THREE.PlaneGeometry(.3, .24), M.glow('#a8d0f0'), 'crt_screen', 'lamp', V(.7, 1.555, .96), false); const cl = new THREE.PointLight('#9ad0ff', 1.2, 2.5, 1.6); cl.position.copy(V(.7, 1.4, .96)); scene.add(cl); }
    for (let i = 0; i < 4; i++) { box(.38, .45, 1.85, M.locker, 'locker', 'metal', -2.25, -1.2 + i * .4, .93, true); for (let k = 0; k < 5; k++) box(.01, .2, .012, M.steelDk, 'locker_louvre', 'metal', -2.04, -1.2 + i * .4, 1.6 + k * .04, false); box(.02, .03, .1, M.chrome, 'locker_handle', 'metal', -2.04, -1.06 + i * .4, 1.0, false); }
  } else if (!stair) { for (let i = 0; i < 4; i++) { const pm = i % 2 ? M.plasticTeal : M.plasticOrange, y = -1.5 + i * .55; box(.45, .45, .04, pm, 'chair_seat', 'plastic', -2.2, y, .45, true); box(.04, .45, .42, pm, 'chair_back', 'plastic', -2.42, y, .7, true); for (const dy of [-.18, .18]) { box(.03, .03, .44, M.chrome, 'chair_leg', 'metal', -2.0, y + dy, .22, true); box(.03, .03, .44, M.chrome, 'chair_leg', 'metal', -2.38, y + dy, .22, true); } }
    for (const x of [-1, 1]) { box(1.2, .3, .02, M.glow('#fff8e0'), 'fluor_troffer', 'lamp', x, 1, 3.19, false); } }
  else { for (let i = 0; i < 6; i++) box(1.2, .28, .16, M.terrazzo, 'stair_step', 'stone', 1.6, -.6 + i * .28, .08 + i * .16, true);
    const rail = []; for (let i = 0; i <= 6; i++) rail.push([1.0, -.6 + i * .28, .95 + i * .16]); for (let i = 0; i < 6; i++) { const a = V(...rail[i]), b = V(...rail[i + 1]), d = b.clone().sub(a), m = add(new THREE.CylinderGeometry(.022, .022, d.length(), 10), M.steel, 'handrail', 'metal', a.clone().addScaledVector(d, .5)); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); }
    for (let i = 0; i < 7; i += 2) box(.025, .025, .95, M.steelDk, 'baluster', 'metal', 1.0, -.6 + i * .28, .48 + i * .16, true); }
  return { update: (fr, t) => { LP.sync(M); for (const fn of ticks) fn(t ?? fr / 30); } };
}

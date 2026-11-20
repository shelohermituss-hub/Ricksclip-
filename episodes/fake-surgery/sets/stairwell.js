// PLACE SET "stairwell" (D) of "The Surgery Where the Surgeon Did Nothing" (owner: set helper B2 2026-11-16, then the S4 / S5 builder). Mid-1990s Houston hospital stair.
// Plan metres, Z up, Y forward (away from the default lens). Built at world.js ORIGIN.stairwell; LOCAL coordinates below, ABSOLUTE = ORIGIN + local (anchors are absolute).
// PLACE KEYS (film.json places.<name>): light_kind (or light): 'afternoon' (default; AF gold, sun high through the tall window) | 'evening' (EV coral 7:15 PM, low long shafts, lilac sky)
//   shafts: true|false (sun shaft volumes, default true) · dust: true|false (motes in the shafts, default true) · lamps: true|false (caged wall lamps lit, default true)
//   sun_dir: [x,y,z] plan direction TOWARD the sun (default per light; the set aims the kit sun through the window, so the pane shadows land on the stairs)
//   dial: 0..1 pain needle (0 = deep green, 1 = deep red; default .9) · dial_at: [[frame, value], ...] keyed needle (linear, wins over dial; wobble = add two keys)
//   sign_spin: turns of the USE HANDRAIL sign about its one screw (default .02) · sign_spin_at: [[frame, turns], ...] · sign_blur: force the spin blur ring
//   door: 0..1 fire door open (default 0) · cane: true|false (stand-in cane + cobweb on the newel; default true until hero_props has the cane) · cobweb: 0..1 (default 1)
//   hide: [names] meshes/groups to hide for a shot (e.g. 'storey2_guard' for a clear upper view)
//   knee_plasters (S4 v2): { at: absolute plan point, f: [f0,f1], s, toward, stack, top } three cartoon plaster squares on a card's line knee, turned to the lens (replaces knee_leg)
// ANCHORS (plan metres, absolute): newel_top (cane hook point), cane, sign_screw, pain_dial (centre, faces -X), fire_door (sill centre), nurse_door (nurse feet, row 50),
//   surgeon_last (surgeon feet, row 50, low station), window_centre, landing_mid, f1_<i>_<lane> / f2_<i>_<lane> = tread-top feet points (i 1..9, lane 'w' wall side | 'r' rail side),
//   land_<k> = 6 feet points on the half landing, s2_<k> = 4 on the storey-2 landing; climb = ordered list of all of them bottom -> top (the row 50 stream path).
// STATIONS (export STATIONS, absolute; 9:16, character height unless named): wide_af (row 31-33 wide), newel (row 31 cane close), side_f1 (rows 33-34 the climber + dial in
//   profile, from under flight 2's well edge), last_low (ROW 50 LAST FRAME: low at the foot, surgeon big in front, the stream up to the window).
// PARTS: two flights of 10 risers (0.16 x 0.30) with a full-width half landing under the tall window; terrazzo treads + risers with aluminium safety nosings (dark abrasive
//   inserts, countersunk screws), worn centre paths and heel scuffs; steel picket guard (posts, pickets, bottom rail, the hand-polished steel top rail with worn paint)
//   + wall rails on rosette brackets; teal-painted steel stringers with bolt heads; painted cinder block above the SEA-GREEN glazed tile dado (follows the stair line,
//   bullnose cap, cove base); the two-storey steel window (4 x 8 lights of wired glass, one hopper open, crank rod, deep sill with a pothos, a coffee cup, a dead moth,
//   a corner cobweb); the storey-2 landing slab with its guard; the fire door (hollow-metal frame, narrow wired-glass light, panic bar, closer arm, kick plate,
//   green EXIT sign) with a corridor stub behind it; stencilled floor numbers "1" and "2"; caged jelly-jar wall lamps on conduit + junction boxes; sprinkler main with
//   heads; smoke detector; the newel post (ball cap) with the old cane + cobweb hammock + sleeping spider (stand-in); the USE HANDRAIL sign on one screw; the wall PAIN DIAL
//   (stand-in until hero_props.js has one: enamel face, green-yellow-red zones = THE ONE RED, ticks, 0 / 10, chrome bezel, needle).
// Surfaces: sets/look_pack.js (M.block, M.dadoTile, M.terrazzo, M.steel, M.chrome, M.paint, M.tile); sky: LP.sky 'texas' (AF) / 'coral' (EV). No red but the dial zone.
// ENV v3 key (env helper E2 2026-11-17; OFF unless set; every older key unchanged):
//   env_v3: true   blue wayfinding stripe over the dado (follows the stair), STAIR B / 1 FLOOR sign, FIRE EXIT PLAN, 'TAKE THE STAIRS!' 1994 health poster (orange heart),
//                  landing NOTICE CASE with 6 papers, FLU SHOTS poster (left wall), stainless WATER extinguisher + FIRE HOSE label, warm LIGHT POOLS on the block under the caged lamps
//                  (flat wall decals, no spheres), more scuffs + bumper rub + riser heel marks, landing PLANT (leaves tremble), the VIEW OUT (live oaks + visitor parking, 1990s cars,
//                  lamp posts; evening: coral tint + lit sodium lamps), VENETIAN BLINDS on the outer upper lights (bottom rail sways), steel PIPE GUARD in front of the cupboard
//                  (foreground posts), SECOND LIGHT COLOUR: cool dado bounce + landing fill (lilac in the evening). No new red.
import { ORIGIN, STOREY, DADO_Z } from './world.js';
import * as LP from './look_pack.js';

const RISE = STOREY / 20, RUN = .3, NT = 9, W0 = 2.0, WELL = .2, Y0 = -4.6, Y1 = 4.6, CEIL = 6.6, LANDZ = STOREY / 2, S2Z = STOREY;
const F1 = { x0: WELL, x1: W0 }, F2 = { x0: -W0, x1: -WELL }, LAND_Y = NT * RUN;   // flight 1 right (climbs +Y), flight 2 left (climbs -Y)
const WIN = { x0: -1.6, x1: 1.6, z0: 2.1, z1: 6.1, cols: 4, rows: 8 };
const SUN = { afternoon: [.35, 1, .95], evening: [.5, 1, .3] };
const O = ORIGIN.stairwell, A = (x, y, z) => [O[0] + x, O[1] + y, O[2] + z];
const zN1 = y => RISE + y * RISE / RUN, zN2 = y => LANDZ + RISE + (LAND_Y - y) * RISE / RUN;   // nosing lines of flight 1 and flight 2

export const STATIONS = {
  wide_af:  { pos: A(-.9, -3.1, 1.55), aim: A(.8, 2.6, 2.15), lens: 22, purpose: 'rows 31-33 wide: newel + cane mid, flight 1 up to the landing and the tall window' },
  newel:    { pos: A(.95, -1.05, 1.15), aim: A(.22, .02, .98), lens: 32, purpose: 'row 31: the cane on the newel post, cobweb hammock, USE HANDRAIL sign behind' },
  side_f1:  { pos: A(-1.0, 1.0, 1.75), aim: A(1.2, 1.9, 1.9), lens: 22, purpose: 'rows 33-34: the climber on flight 1 in profile with the pain dial on the wall beside him' },
  last_low: { pos: A(.6, -3.0, .5), aim: A(.2, 2.8, 2.7), lens: 18, purpose: 'ROW 50 LAST FRAME: low at the foot; surgeon big in front at surgeon_last; the stream up flight 1, across the window, up flight 2' },
};

const canvasTex = (THREE, w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const keyed = (k, f, dflt) => { if (!Array.isArray(k) || !k.length) return dflt; if (f <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (f <= k[i][0]) { const [fa, a] = k[i - 1], [fb, b] = k[i]; return a + (b - a) * (f - fa) / Math.max(1e-6, fb - fa); } return k[k.length - 1][1]; };

export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, light = (pl.light_kind || pl.light) === 'evening' ? 'evening' : 'afternoon', EV = light === 'evening';
  const M = LP.pack(THREE, ctx), toon = ctx.toon;
  const root = new THREE.Group(); root.name = 'stairwell'; root.position.copy(ctx.B2T(O)); scene.add(root);
  const V = (x, y, z) => ctx.B2T([x, y, z]);
  let seed = 11; const R0 = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * R0();
  const add = (geo, mat, name, role, p, parent = root, shadow = true) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m; };
  const box = (sx, sy, sz, mat, name, role, x, y, z, parent = root, shadow = true) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, role, V(x, y, z), parent, shadow);
  const bar = (a, b, r, mat, name, role = 'metal', parent = root, segs = 10) => { const P = V(...a), Q = V(...b), d = Q.clone().sub(P), L = Math.max(d.length(), 1e-4), m = add(new THREE.CylinderGeometry(r, r, L, segs), mat, name, role, P.clone().addScaledVector(d, .5), parent); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return m; };
  const beam = (a, b, w, h, mat, name, role = 'metal', parent = root) => { const P = V(...a), Q = V(...b), d = Q.clone().sub(P), L = Math.max(d.length(), 1e-4), m = add(new THREE.BoxGeometry(L, h, w), mat, name, role, P.clone().addScaledVector(d, .5), parent);
    const dir = d.clone().normalize(); let side = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)); if (side.lengthSq() < 1e-6) side.set(0, 0, 1); side.normalize(); m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(dir, new THREE.Vector3().crossVectors(side, dir), side)); return m; };
  // a ribbon on a wall plane: axis 'x' (wall at x = c, along y) or 'y' (wall at y = c, along x); pts [[along, zBottom, zTop], ...]
  const ribbon = (axis, c, pts, mat, name, role = 'wall', shadow = false) => { const pos = [], idx = [];
    pts.forEach(([a, zb, zt], i) => { const p0 = axis === 'x' ? V(c, a, zb) : V(a, c, zb), p1 = axis === 'x' ? V(c, a, zt) : V(a, c, zt); pos.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z); if (i) { const k = i * 2; idx.push(k - 2, k, k - 1, k - 1, k, k + 1); } });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); const m = add(g, mat, name, role, null, root, shadow); m.material.side = THREE.DoubleSide; return m; };
  const glow = M.glow, ink = toon('#2a1a1f');
  const paintTeal = M.paint('#2f5f66'), paintTealDk = M.paint('#24494f'), slabPaint = M.paint('#d9d0b4'), doorPaint = M.paint('#9fb6c0'), capTile = M.tile('#2f7d70', '#bcd2ca', .15), coveTile = M.tile('#2a6a60', '#a8c0b8', .15);
  const block = M.block, dado = M.dadoTile, tz = M.terrazzo, steel = M.steel, chrome = M.chrome, steelDk = M.steelDk;
  const alu = steel, abrasive = toon('#3a3a40'), rubber = toon('#2a2a30');

  scene.children.forEach(o => { if (o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.radius === 400) o.visible = false; });
  LP.applyLight(THREE, scene, ctx, { fillFrom: [O[0] - 6, O[1] - 8, 4], fog: [14, 40] });
  scene.background = new THREE.Color(EV ? '#3a2448' : '#3a3a6a');
  // aim the kit sun THROUGH the window (shadow box centred on the hall)
  const sd = pl.sun_dir || SUN[light], sv = V(sd[0], sd[1], sd[2]).sub(V(0, 0, 0)).normalize(), tgt = ctx.B2T(A(0, 1, 2.2));
  scene.traverse(o => { if (o.isDirectionalLight && o.castShadow) { o.target.position.copy(tgt); scene.add(o.target); o.position.copy(tgt).addScaledVector(sv, 30); Object.assign(o.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 70 }); o.shadow.camera.updateProjectionMatrix(); o.shadow.bias = -.0005; } });

  // ================= FLOORS, FLIGHTS, LANDINGS =================
  box(2 * W0, Y1 - Y0, .1, tz, 'ground_terrazzo', 'floor', 0, (Y0 + Y1) / 2, -.05, root, false);
  for (let y = -3.6; y < 0; y += 1.2) box(2 * W0, .012, .004, M.steelDk, 'floor_divider_strip', 'metal', 0, y, .002, root, false);
  box(2 * W0, Y1 - LAND_Y, LANDZ, slabPaint, 'landing_mass', 'stone', 0, (LAND_Y + Y1) / 2, LANDZ / 2 - .02, root, true);
  box(2 * W0, Y1 - LAND_Y, .04, tz, 'half_landing_terrazzo', 'floor', 0, (LAND_Y + Y1) / 2, LANDZ - .02, root, false);
  box(W0 - WELL, -Y0, .25, slabPaint, 'storey2_slab', 'stone', (F2.x0 + F2.x1) / 2, Y0 / 2, S2Z - .125, root, true);
  box(W0 - WELL, -Y0, .04, tz, 'storey2_terrazzo', 'floor', (F2.x0 + F2.x1) / 2, Y0 / 2, S2Z - .02, root, false);
  box(.02, -Y0, .25, alu, 'storey2_edge_angle', 'metal', F2.x1 + .01, Y0 / 2, S2Z - .125, root, false);
  const screwGeo = new THREE.CylinderGeometry(.006, .006, .004, 8), worn = new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: .08, depthWrite: false }), scuffM = new THREE.MeshBasicMaterial({ color: '#2a2420', transparent: true, opacity: .35, depthWrite: false });
  const nosing = (x0, x1, y, z, dirY) => { const cx = (x0 + x1) / 2, L = x1 - x0 - .08;   // aluminium nosing at the tread front edge, dirY = +1 if the stair climbs +Y
    box(L, .075, .012, alu, 'tread_nosing', 'metal', cx, y + dirY * .0375, z + .002, root, false);
    for (const k of [-1, 1]) box(L - .04, .012, .004, abrasive, 'nosing_abrasive', 'rubber', cx, y + dirY * (.0375 + k * .018), z + .009, root, false);
    for (let s = x0 + .12; s < x1 - .08; s += .3) { const sc = add(screwGeo, steelDk, 'nosing_screw', 'metal', V(s, y + dirY * .0375, z + .009), root, false); }
    box(L, .012, .03, alu, 'nosing_lip', 'metal', cx, y - dirY * .003, z - .015, root, false); };
  const flight = (F, dirY) => { const out = [];
    for (let i = 1; i <= NT; i++) { const ya = dirY > 0 ? (i - 1) * RUN : LAND_Y - (i - 1) * RUN, yc = ya + dirY * RUN / 2, zt = dirY > 0 ? i * RISE : LANDZ + i * RISE, zb = dirY > 0 ? 0 : zt - RISE - .24, cx = (F.x0 + F.x1) / 2, w = F.x1 - F.x0;
      box(w, RUN, zt - zb, slabPaint, 'step_mass', 'stone', cx, yc, (zt + zb) / 2, root, true);
      box(w, RUN + .01, .035, tz, 'tread_terrazzo', 'floor', cx, yc, zt - .017, root, false);
      box(w, .025, RISE - .03, tz, 'riser_terrazzo', 'stone', cx, ya - dirY * .0, zt - RISE / 2 - .016, root, false);
      nosing(F.x0, F.x1, ya, zt, dirY);
      const wp = add(new THREE.PlaneGeometry(.7, RUN * .7), worn, 'tread_worn_path', 'mark', V(F.x0 + w * (F === F1 ? .3 : .7), yc + dirY * .02, zt + .0015), root, false); wp.rotation.x = -Math.PI / 2;
      for (let k = 0; k < 2; k++) { const s = add(new THREE.PlaneGeometry(rr(.04, .11), .008), scuffM, 'riser_heel_scuff', 'mark', V(rr(F.x0 + .2, F.x1 - .2), ya - dirY * .014, zt - RISE * rr(.3, .8)), root, false); s.rotation.set(0, dirY > 0 ? Math.PI : 0, rr(-.3, .3)); }
      out.push({ i, y: yc, z: zt }); }
    // the last riser up to the landing / storey 2
    const yl = dirY > 0 ? LAND_Y : 0, zl = dirY > 0 ? LANDZ : S2Z; box(F.x1 - F.x0, .025, RISE - .03, tz, 'riser_terrazzo', 'stone', (F.x0 + F.x1) / 2, yl, zl - RISE / 2 - .016, root, false); nosing(F.x0, F.x1, yl, zl, dirY);
    return out; };
  const T1 = flight(F1, 1), T2 = flight(F2, -1);
  // stringers on the well side (teal-painted steel channel with bolt heads), following the nosing line
  const stringer = (x, ya, za, yb, zb, nm) => { beam([x, ya, za], [x, yb, zb], .03, .34, paintTeal, nm, 'metal'); const n = 7; for (let k = 1; k < n; k++) { const u = k / n; add(new THREE.SphereGeometry(.012, 8, 6), paintTealDk, 'stringer_bolt', 'metal', V(x + Math.sign(x) * .018, ya + (yb - ya) * u, za + (zb - za) * u - .08), root, false); } };
  stringer(F1.x0 - .015, -.05, .02, LAND_Y + .05, LANDZ - .1, 'stringer_f1'); stringer(F2.x1 + .015, LAND_Y + .05, LANDZ - .1, -.05, S2Z - .14, 'stringer_f2');
  // spine wall under flight 2 (closes the under-stair cupboard; tile dado on its well face)
  { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(LAND_Y, 0); sh.lineTo(LAND_Y, LANDZ - .26); sh.lineTo(0, S2Z - .27); sh.closePath(); const g = new THREE.ExtrudeGeometry(sh, { depth: .12, bevelEnabled: false });
    const sp = add(g, block, 'spine_wall_under_f2', 'wall', null, root, true); sp.rotation.y = Math.PI / 2; sp.position.copy(V(F2.x1 - .12, 0, 0)); }
  ribbon('x', F2.x1 + .012, [[0, 0, DADO_Z], [LAND_Y, 0, DADO_Z]], dado, 'spine_dado_tile'); ribbon('x', F2.x1 + .014, [[0, DADO_Z, DADO_Z + .06], [LAND_Y, DADO_Z, DADO_Z + .06]], capTile, 'spine_dado_cap');
  ribbon('x', F2.x1 + .014, [[0, 0, .1], [LAND_Y, 0, .1]], coveTile, 'spine_cove');
  // end wall of the cupboard facing the foot (y = 0, under the storey-2 slab)
  box(W0 - WELL, .12, S2Z - .25, block, 'cupboard_end_wall', 'wall', (F2.x0 + F2.x1) / 2, .06, (S2Z - .25) / 2, root, true);
  ribbon('y', -.012, [[F2.x0, 0, DADO_Z], [F2.x1, 0, DADO_Z]], dado, 'end_dado_tile'); ribbon('y', -.014, [[F2.x0, DADO_Z, DADO_Z + .06], [F2.x1, DADO_Z, DADO_Z + .06]], capTile, 'end_dado_cap');

  // ================= WALLS: painted cinder block over the sea-green tile dado that follows the stair line =================
  box(.2, Y1 - Y0 + .4, CEIL, block, 'wall_right_block', 'wall', W0 + .1, (Y0 + Y1) / 2, CEIL / 2, root, true);
  box(.2, Y1 - Y0 + .4, CEIL, block, 'wall_left_block', 'wall', -W0 - .1, (Y0 + Y1) / 2, CEIL / 2, root, true);
  box(2 * W0 + .4, .2, CEIL, block, 'wall_front_block_4th', 'wall', 0, Y0 - .1, CEIL / 2, root, true);
  // back wall with the window opening
  box(2 * W0 + .4, .24, WIN.z0, block, 'wall_back_low', 'wall', 0, Y1 + .12, WIN.z0 / 2, root, true);
  box(2 * W0 + .4, .24, CEIL - WIN.z1, block, 'wall_back_high', 'wall', 0, Y1 + .12, (WIN.z1 + CEIL) / 2, root, true);
  for (const s of [-1, 1]) box(W0 - WIN.x1 + .2, .24, WIN.z1 - WIN.z0, block, 'wall_back_jamb', 'wall', s * (WIN.x1 + (W0 + .2 - WIN.x1) / 2), Y1 + .12, (WIN.z0 + WIN.z1) / 2, root, true);
  box(2 * W0, 2 * W0 + Y1 - Y0, .2, slabPaint, 'ceiling_slab', 'ceiling', 0, (Y0 + Y1) / 2, CEIL + .1, root, true);
  const dadoRun = (axis, c, pts, nm) => { ribbon(axis, c, pts, dado, nm + '_tile'); ribbon(axis, c + (c > 0 ? -.004 : .004), pts.map(([a, , zt]) => [a, zt, zt + .06]), capTile, nm + '_cap'); ribbon(axis, c + (c > 0 ? -.004 : .004), pts.map(([a, zb]) => [a, zb, zb + .1]), coveTile, nm + '_cove'); };
  const iR = W0 - .012, iL = -W0 + .012;
  dadoRun('x', iR, [[Y0, 0, DADO_Z], [0, 0, DADO_Z], [LAND_Y, LANDZ - RISE, zN1(LAND_Y) + 1.02], [LAND_Y + .3, LANDZ, LANDZ + DADO_Z], [Y1, LANDZ, LANDZ + DADO_Z]], 'dado_right');
  dadoRun('x', iL, [[Y0, 0, DADO_Z], [0, 0, DADO_Z]], 'dado_left_ground');
  dadoRun('x', iL, [[Y1, LANDZ, LANDZ + DADO_Z], [LAND_Y + .3, LANDZ, LANDZ + DADO_Z], [LAND_Y, LANDZ, zN2(LAND_Y) + 1.02], [0, S2Z - RISE, zN2(0) + 1.02], [-.3, S2Z, S2Z + DADO_Z], [Y0, S2Z, S2Z + DADO_Z]], 'dado_left_upper');
  dadoRun('y', Y1 - .012, [[-W0, LANDZ, WIN.z0 - .07], [W0, LANDZ, WIN.z0 - .07]], 'dado_back');   // under the sill: tile up to the sill
  dadoRun('y', Y0 + .012, [[-W0, 0, DADO_Z], [W0, 0, DADO_Z]], 'dado_front');
  // stencilled floor numbers (big, as painted on site)
  const stencil = (txt, w, h) => canvasTex(THREE, 256, 256, (c, W, H) => { c.fillStyle = 'rgba(0,0,0,0)'; c.clearRect(0, 0, W, H); c.fillStyle = '#1e2a5a'; c.font = 'bold 210px Arial Black, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, W / 2, H / 2 + 8);
    c.fillStyle = '#e9e0c4'; for (const fx of [.42, .58]) c.fillRect(W * fx, 0, 7, H); });   // stencil bridges
  const num2 = add(new THREE.PlaneGeometry(.55, .55), new THREE.MeshLambertMaterial({ map: stencil('2'), transparent: true }), 'stencil_floor_2', 'sign', V(iL + .004, -1.2, S2Z + 1.75), root, false); num2.rotation.y = Math.PI / 2;
  const num1 = add(new THREE.PlaneGeometry(.42, .42), new THREE.MeshLambertMaterial({ map: stencil('1'), transparent: true }), 'stencil_floor_1', 'sign', V(-1.1, -.014, 1.85), root, false);

  // ================= THE TALL WINDOW (steel frame, wired glass, hopper, sill dressing) and the sky =================
  const winG = new THREE.Group(); winG.name = 'tall_window'; root.add(winG); const cw = (WIN.x1 - WIN.x0) / WIN.cols, rh = (WIN.z1 - WIN.z0) / WIN.rows, wy = Y1 + .02;
  const frameM = M.paint('#3a4a50');
  for (let c = 0; c <= WIN.cols; c++) box(c % WIN.cols ? .05 : .09, .1, WIN.z1 - WIN.z0 + .06, frameM, 'window_mullion', 'metal', WIN.x0 + c * cw, wy, (WIN.z0 + WIN.z1) / 2, winG, true);
  for (let r = 0; r <= WIN.rows; r++) box(WIN.x1 - WIN.x0, .09, r % 4 ? .035 : .08, frameM, 'window_transom', 'metal', 0, wy, WIN.z0 + r * rh, winG, true);
  const wireT = canvasTex(THREE, 128, 128, (c, w, h) => { c.fillStyle = 'rgba(220,235,240,0.10)'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(60,70,80,0.55)'; c.lineWidth = 1.2; for (let k = -w; k < w * 2; k += 16) { c.beginPath(); c.moveTo(k, 0); c.lineTo(k + h, h); c.stroke(); c.beginPath(); c.moveTo(k, h); c.lineTo(k + h, 0); c.stroke(); } });
  wireT.wrapS = wireT.wrapT = THREE.RepeatWrapping; wireT.repeat.set(cw / .25, rh / .25);
  const glassM = new THREE.MeshBasicMaterial({ map: wireT, transparent: true, depthWrite: false, toneMapped: false, color: EV ? '#ffe6b0' : '#fff4dc' });
  for (let c = 0; c < WIN.cols; c++) for (let r = 0; r < WIN.rows; r++) { const hop = c === 2 && r === 3, gp = add(new THREE.PlaneGeometry(cw - .05, rh - .035), glassM, 'window_wired_glass', 'glass', V(WIN.x0 + (c + .5) * cw, wy - .01, WIN.z0 + (r + .5) * rh), winG, false);
    if (hop) { gp.position.copy(V(WIN.x0 + (c + .5) * cw, wy - .1, WIN.z0 + (r + .5) * rh + .02)); gp.rotation.x = -.35; box(cw - .04, .03, .03, frameM, 'hopper_sash_bottom', 'metal', WIN.x0 + (c + .5) * cw, wy - .2, WIN.z0 + r * rh + .04, winG, true); } }
  bar([WIN.x0 + 2.5 * cw, wy - .12, WIN.z0 + 3 * rh], [WIN.x0 + 2.5 * cw + .02, wy - .05, WIN.z0 + .15], .007, steelDk, 'hopper_crank_rod', 'metal', winG);
  box(.06, .05, .08, steelDk, 'hopper_crank_box', 'metal', WIN.x0 + 2.5 * cw + .02, wy - .05, WIN.z0 + .12, winG, false);
  box(WIN.x1 - WIN.x0 + .2, .32, .06, M.paint('#cfc8b4'), 'window_sill_concrete', 'stone', 0, Y1 - .12, WIN.z0 - .03, winG, true);
  const dustSill = add(new THREE.PlaneGeometry(3.2, .25), new THREE.MeshBasicMaterial({ color: '#8a7a60', transparent: true, opacity: .18, depthWrite: false }), 'sill_dust', 'mark', V(0, Y1 - .12, WIN.z0 + .002), winG, false); dustSill.rotation.x = -Math.PI / 2;
  // pothos in a plastic pot on the sill (trailing leaves), the forgotten paper coffee cup, a dead moth, a corner cobweb
  add(new THREE.CylinderGeometry(.11, .085, .17, 16), M.plasticOf ? M.plasticOf('#c8b48a') : toon('#c8b48a'), 'pothos_pot', 'plastic', V(1.35, Y1 - .14, WIN.z0 + .085), winG);
  add(new THREE.CylinderGeometry(.13, .12, .015, 16), toon('#8a7a5a'), 'pothos_saucer', 'plastic', V(1.35, Y1 - .14, WIN.z0 + .008), winG);
  const leafM = [toon('#3f8a3a'), toon('#5aa848'), toon('#7ab84a'), toon('#2f6a32')];
  for (let k = 0; k < 38; k++) { const trail = k > 14, t = trail ? (k - 14) / 24 : 0, lx = trail ? 1.35 - .1 - t * .9 + Math.sin(k) * .05 : 1.35 + rr(-.12, .12), lz = trail ? WIN.z0 + .05 - Math.sin(t * 2.6) * .32 + t * .05 : WIN.z0 + .18 + rr(0, .16);
    const lf = add(new THREE.SphereGeometry(.045, 8, 6), leafM[k % 4], 'pothos_leaf', 'plant', V(lx, Y1 - .16 - (trail ? .12 + t * .05 : rr(-.06, .06)), lz), winG); lf.scale.set(1, .25, .75); lf.rotation.set(rr(-.6, .6), rr(0, 3), rr(-.6, .6)); }
  const vine = []; for (let k = 0; k <= 10; k++) { const t = k / 10; vine.push(V(1.25 - t * .9, Y1 - .28 - t * .05, WIN.z0 + .05 - Math.sin(t * 2.6) * .32 + t * .05)); } add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(vine), 20, .005, 4), leafM[3], 'pothos_vine', 'plant', null, winG);
  add(new THREE.CylinderGeometry(.04, .03, .1, 14), toon('#f4efe4'), 'paper_coffee_cup', 'paper', V(-1.25, Y1 - .16, WIN.z0 + .05), winG); add(new THREE.CylinderGeometry(.04, .04, .012, 14), toon('#1e2a5a'), 'cup_band', 'paper', V(-1.25, Y1 - .16, WIN.z0 + .07), winG);
  for (const s of [-1, 1]) { const w = add(new THREE.PlaneGeometry(.035, .02), toon('#7a6a54'), 'dead_moth_wing', 'creature', V(-.6 + s * .015, Y1 - .1, WIN.z0 + .003), winG, false); w.rotation.set(-Math.PI / 2, 0, s * .4); }
  const webM = new THREE.LineBasicMaterial({ color: '#f4f0e8', transparent: true, opacity: .55 }), web = (cx, cy, cz, r, plane, nm, parent = root) => { const pts = []; const P = (a, rad) => plane === 'yz' ? V(cx, cy + Math.cos(a) * rad, cz + Math.sin(a) * rad) : V(cx + Math.cos(a) * rad, cy, cz + Math.sin(a) * rad);
    for (let s = 0; s < 7; s++) { const a = Math.PI * (1.5 + s / 6 * .5); pts.push(P(Math.PI, 0).clone().set(V(cx, cy, cz).x, V(cx, cy, cz).y, V(cx, cy, cz).z), P(a, r)); }
    for (let ring = 1; ring <= 4; ring++) for (let s = 0; s < 6; s++) { const a0 = Math.PI * (1.5 + s / 6 * .5), a1 = Math.PI * (1.5 + (s + 1) / 6 * .5), q = r * ring / 4.4; pts.push(P(a0, q), P(a1, q * (.92 + .1 * Math.sin(s + ring)))); }
    const g = new THREE.BufferGeometry().setFromPoints(pts), l = new THREE.LineSegments(g, webM); l.name = nm; l.userData.role = 'creature'; parent.add(l); return l; };
  web(WIN.x0 + .06, wy - .06, WIN.z1 - .06, .45, 'xz', 'window_corner_cobweb', winG);
  const skyK = EV ? 'coral' : 'texas', sky = LP.sky(THREE, ctx, skyK, { w: 14, h: 10, gain: EV ? 1.0 : 1.05, parent: root }); sky.mesh.position.copy(V(0, Y1 + 5.5, 5.5));
  // window glow on the dado below the sill + the back wall reveal (soft bounce)
  const bounce = new THREE.PointLight(EV ? '#ff9a5a' : '#ffd890', EV ? 2.2 : 1.6, 7, 1.6); bounce.position.copy(V(0, Y1 - 1.2, LANDZ + .6)); root.add(bounce);

  // ================= RAILS: steel picket guard on the well edges, wall rails on brackets =================
  const railTop = M.steel, guardG = new THREE.Group(); guardG.name = 'guard_rails'; root.add(guardG);
  const guardRun = (pts, nm, every = .11, posts = 1.0) => { for (let k = 1; k < pts.length; k++) { const [a, b] = [pts[k - 1], pts[k]], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      bar([a[0], a[1], a[2] + .9], [b[0], b[1], b[2] + .9], .021, railTop, nm + '_top_rail', 'metal', guardG, 12);
      bar([a[0], a[1], a[2] + .08], [b[0], b[1], b[2] + .08], .012, paintTeal, nm + '_bottom_rail', 'metal', guardG, 8);
      const n = Math.max(1, Math.round(L / every)); for (let s = 0; s < n; s++) { const u = (s + .5) / n, x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u, z = a[2] + (b[2] - a[2]) * u; box(.016, .016, .82, paintTeal, nm + '_picket', 'metal', x, y, z + .49, guardG, true); }
      const np = Math.max(1, Math.round(L / posts)); for (let s = 0; s <= np; s++) { const u = s / np, x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u, z = a[2] + (b[2] - a[2]) * u; box(.045, .045, .92, paintTealDk, nm + '_post', 'metal', x, y, z + .45, guardG, true); add(new THREE.CylinderGeometry(.04, .04, .012, 12), paintTealDk, nm + '_post_flange', 'metal', V(x, y, z + .006), guardG, false); } } };
  const nl = y => zN1(y) - RISE * .5, n2 = y => zN2(y) - RISE * .5;   // rail base line (on the stringer top)
  guardRun([[F1.x0 + .02, .25, nl(.25)], [F1.x0 + .02, LAND_Y - .1, nl(LAND_Y - .1)]], 'guard_f1');
  guardRun([[F1.x0 + .02, LAND_Y + .1, LANDZ], [F2.x1 - .02, LAND_Y + .1, LANDZ]], 'guard_landing_end', .11, .4);
  guardRun([[F2.x1 - .02, LAND_Y - .1, n2(LAND_Y - .1)], [F2.x1 - .02, .1, n2(.1)]], 'guard_f2');
  guardRun([[F2.x1 - .03, -.05, S2Z], [F2.x1 - .03, Y0 + .05, S2Z]], 'storey2_guard', .11, 1.15);
  // THE NEWEL POST at the foot of flight 1 (heavier, ball cap; the cane hangs on it)
  const NEW = [F1.x0 + .03, .02, RISE]; box(.075, .075, 1.0, paintTealDk, 'newel_post', 'metal', NEW[0], NEW[1], RISE + .5, guardG, true);
  add(new THREE.SphereGeometry(.05, 16, 12), railTop, 'newel_ball_cap', 'metal', V(NEW[0], NEW[1], RISE + 1.04), guardG); add(new THREE.CylinderGeometry(.045, .045, .03, 14), paintTealDk, 'newel_collar', 'metal', V(NEW[0], NEW[1], RISE + 1.0), guardG);
  box(.11, .11, .02, paintTealDk, 'newel_base_plate', 'metal', NEW[0], NEW[1], RISE + .01, guardG, false); bar([NEW[0], NEW[1], RISE + .98], [F1.x0 + .02, .25, nl(.25) + .9], .021, railTop, 'newel_rail_joint', 'metal', guardG);
  // wall rails (round steel on rosette brackets) on both walls + across the landing back wall
  const wallRail = (pts, xOff, nm) => { for (let k = 1; k < pts.length; k++) { const [a, b] = [pts[k - 1], pts[k]]; bar([a[0], a[1], a[2]], [b[0], b[1], b[2]], .02, railTop, nm, 'metal', guardG, 12);
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / .9)); for (let s = 0; s <= n; s++) { const u = s / n, x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u, z = a[2] + (b[2] - a[2]) * u;
        bar([x, y, z - .03], [x + xOff[0], y + xOff[1], z - .06], .008, steelDk, nm + '_bracket', 'metal', guardG, 6); const ro = add(new THREE.CylinderGeometry(.03, .03, .01, 14), steelDk, nm + '_rosette', 'metal', V(x + xOff[0] * 1.05, y + xOff[1] * 1.05, z - .06), guardG, false); ro.rotation.z = Math.PI / 2; if (xOff[1]) ro.rotation.set(Math.PI / 2, 0, 0); } } };
  wallRail([[W0 - .075, -.3, .88], [W0 - .075, LAND_Y, zN1(LAND_Y) + .86], [W0 - .075, LAND_Y + .3, LANDZ + .88], [W0 - .075, Y1 - .2, LANDZ + .88]], [.065, 0], 'wall_rail_right');
  wallRail([[-W0 + .075, Y1 - .2, LANDZ + .88], [-W0 + .075, LAND_Y + .3, LANDZ + .88], [-W0 + .075, LAND_Y, zN2(LAND_Y) + .86], [-W0 + .075, 0, zN2(0) + .86], [-W0 + .075, -.3, S2Z + .88]], [-.065, 0], 'wall_rail_left');
  wallRail([[-W0 + .3, Y1 - .075, LANDZ + .88], [W0 - .3, Y1 - .075, LANDZ + .88]], [0, .065], 'wall_rail_back');

  // ================= FIRE DOOR (ground, left wall) + corridor stub, EXIT sign; storey-2 door =================
  const FD = { y: -2.2, w: .95, h: 2.1 }, doorG = new THREE.Group(); doorG.name = 'fire_door'; root.add(doorG);
  for (const s of [-1, 1]) box(.12, .06, FD.h + .06, steelDk, 'fire_door_frame_jamb', 'metal', -W0 + .02, FD.y + s * (FD.w / 2 + .03), FD.h / 2, doorG, true);
  box(.12, FD.w + .12, .06, steelDk, 'fire_door_frame_head', 'metal', -W0 + .02, FD.y, FD.h + .03, doorG, true);
  const leaf = new THREE.Group(); leaf.name = 'fire_door_leaf'; leaf.position.copy(V(-W0 + .03, FD.y - FD.w / 2, 0)); doorG.add(leaf);   // hinge on the -Y jamb, swings into the stairwell
  const LV = (x, y, z) => new THREE.Vector3(x, z, -y);
  const lf = (sx, sy, sz, m, nm, role, x, y, z, sh = true) => { const o = new THREE.Mesh(new THREE.BoxGeometry(sx, sz, sy), m); o.name = nm; o.userData.role = role; o.position.copy(LV(x, y, z)); o.castShadow = sh; o.receiveShadow = true; leaf.add(o); return o; };
  lf(.045, FD.w - .02, FD.h - .02, doorPaint, 'fire_door_steel_leaf', 'metal', .0, FD.w / 2, FD.h / 2);
  lf(.05, .14, .64, frameM, 'door_glass_frame', 'metal', .004, FD.w - .2, 1.55); const dg = new THREE.Mesh(new THREE.PlaneGeometry(.1, .6), new THREE.MeshBasicMaterial({ map: wireT, color: '#fff2d0', transparent: true, toneMapped: false })); dg.name = 'door_wired_glass'; dg.position.copy(LV(.03, FD.w - .2, 1.55)); dg.rotation.y = Math.PI / 2; leaf.add(dg);
  lf(.06, FD.w - .16, .05, chrome, 'panic_bar', 'metal', .045, FD.w / 2 + .02, 1.0); for (const s of [.14, FD.w - .1]) lf(.07, .06, .1, steelDk, 'panic_bar_end_case', 'metal', .045, s, 1.0);
  lf(.006, FD.w - .06, .25, steel, 'door_kick_plate', 'metal', .026, FD.w / 2, .14); lf(.03, .4, .05, steelDk, 'door_closer_body', 'metal', .04, .35, FD.h - .1);
  for (const hz of [.25, 1.05, 1.85]) lf(.03, .02, .1, steelDk, 'door_hinge', 'metal', .02, .0, hz);
  // corridor stub behind the door (butter-cream wall, terrazzo, ceiling light)
  box(.05, 1.6, 2.4, M.plaster, 'stub_corridor_back', 'wall', -W0 - 1.6, FD.y, 1.2, root, false); box(1.4, 1.6, .05, tz, 'stub_corridor_floor', 'floor', -W0 - .9, FD.y, .0, root, false);
  for (const s of [-1, 1]) box(1.4, .05, 2.4, M.plaster, 'stub_corridor_side', 'wall', -W0 - .9, FD.y + s * .8, 1.2, root, false);
  box(.6, .3, .03, glow('#fff2d0'), 'stub_corridor_lamp_panel', 'lamp', -W0 - .9, FD.y, 2.38, root, false);
  const exitT = canvasTex(THREE, 256, 110, (c, w, h) => { c.fillStyle = '#f4f2ea'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a9a5a'; c.font = 'bold 76px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('EXIT', w / 2, h / 2 + 4); });
  box(.08, .36, .18, toon('#e8e6de'), 'exit_sign_box', 'plastic', -W0 + .04, FD.y, FD.h + .24, root, false);
  const ex = add(new THREE.PlaneGeometry(.34, .15), new THREE.MeshBasicMaterial({ map: exitT, toneMapped: false }), 'exit_sign_face_lamp', 'lamp', V(-W0 + .085, FD.y, FD.h + .24), root, false); ex.rotation.y = Math.PI / 2;
  // storey-2 door (closed), left wall above
  box(.06, 1.02, 2.14, steelDk, 'storey2_door_frame', 'metal', -W0 + .02, -2.6, S2Z + 1.07, root, true); box(.05, .92, 2.06, doorPaint, 'storey2_door_leaf', 'metal', -W0 + .045, -2.6, S2Z + 1.04, root, true);
  box(.05, .1, .5, glow('#fff0c8'), 'storey2_door_light', 'glass', -W0 + .075, -2.3, S2Z + 1.5, root, false); box(.05, .16, .05, chrome, 'storey2_door_lever', 'metal', -W0 + .08, -2.25, S2Z + 1.0, root, false);
  // rubber mat at the fire door
  box(.9, 1.2, .012, rubber, 'fire_door_rubber_mat', 'rubber', -W0 + .5, FD.y, .006, root, false);

  // ================= SERVICES: caged jelly-jar lamps on conduit, junction boxes, sprinkler main, smoke detector =================
  const lampAt = (x, y, z, face, nm) => { const g = new THREE.Group(); g.name = nm; root.add(g); const nx = face[0], ny = face[1];
    box(Math.abs(nx) ? .05 : .16, Math.abs(ny) ? .05 : .16, .16, M.paint('#d0ccc0'), nm + '_base', 'metal', x, y, z, g, false);
    add(new THREE.CylinderGeometry(.06, .06, .14, 14), glow(pl.lamps === false ? '#d8d4c8' : '#fff1c8'), nm + '_globe', 'lamp', V(x + nx * .1, y + ny * .1, z - .02), g, false);
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; bar([x + nx * .03 + Math.cos(a) * .07 * Math.abs(ny), y + ny * .03 + Math.cos(a) * .07 * Math.abs(nx), z - .1], [x + nx * .03 + Math.cos(a) * .07 * Math.abs(ny), y + ny * .03 + Math.cos(a) * .07 * Math.abs(nx), z + .06], .004, steelDk, nm + '_cage_bar', 'metal', g, 4); }
    for (const dz of [-.08, .05]) { const rg = add(new THREE.TorusGeometry(.072, .005, 5, 16), steelDk, nm + '_cage_ring', 'metal', V(x + nx * .1, y + ny * .1, z + dz), g, false); rg.rotation.x = Math.PI / 2; }
    if (pl.lamps !== false) { const p = new THREE.PointLight('#ffe8c0', 1.2, 6, 1.8); p.position.copy(V(x + nx * .3, y + ny * .3, z - .1)); g.add(p); }
    bar([x, y, z + .08], [x, y, CEIL - .05], .011, steelDk, nm + '_conduit', 'metal', g, 6); box(Math.abs(nx) ? .05 : .12, Math.abs(ny) ? .05 : .12, .12, steelDk, nm + '_junction_box', 'metal', x, y, CEIL - .4, g, false); };
  lampAt(W0 - .03, LAND_Y + .9, LANDZ + 2.2, [-1, 0], 'lamp_landing_right'); lampAt(-W0 + .03, -1.0, S2Z + 2.3, [1, 0], 'lamp_storey2_left'); lampAt(W0 - .03, -1.6, 2.6, [-1, 0], 'lamp_ground_right');
  bar([0, Y0 + .2, CEIL - .25], [0, Y1 - .3, CEIL - .25], .03, M.paint('#b8b4a8'), 'sprinkler_main', 'metal');
  for (let y = Y0 + 1; y < Y1; y += 2.2) { bar([0, y, CEIL - .25], [0, y, CEIL - .4], .012, steel, 'sprinkler_drop', 'metal'); add(new THREE.CylinderGeometry(.03, .015, .03, 10), chrome, 'sprinkler_head', 'metal', V(0, y, CEIL - .42)); }
  for (let y = Y0 + .6; y < Y1; y += 1.5) { const h = add(new THREE.TorusGeometry(.04, .005, 5, 12), steelDk, 'sprinkler_hanger', 'metal', V(0, y, CEIL - .25)); h.rotation.y = Math.PI / 2; bar([0, y, CEIL - .21], [0, y, CEIL], .005, steelDk, 'hanger_rod'); }
  add(new THREE.CylinderGeometry(.07, .075, .035, 18), toon('#efece4'), 'smoke_detector', 'plastic', V(.9, 1.0, CEIL - .02)); add(new THREE.CylinderGeometry(.008, .008, .01, 8), glow('#7aff9a'), 'smoke_detector_led_lens', 'lamp', V(.94, 1.0, CEIL - .04));
  add(new THREE.CylinderGeometry(.07, .075, .035, 18), toon('#efece4'), 'smoke_detector_g', 'plastic', V(-1.0, -2.0, S2Z - .27));

  // ================= STORY PROPS: USE HANDRAIL sign on one screw, PAIN DIAL, cane + cobweb on the newel =================
  let HP = null; try { HP = await import('./hero_props.js'); } catch (e) { HP = null; }
  const findHP = re => HP && Object.keys(HP).find(k => re.test(k) && typeof HP[k] === 'function');
  // the USE HANDRAIL sign on ONE screw (hero_props buildHandrailSign; local stand-in only if it is missing)
  const SG = [W0 - .006, -.45, 1.78]; let signSet = null;
  if (HP && HP.buildHandrailSign) { const r = HP.buildHandrailSign(THREE, ctx, { spin: 0 }); r.group.rotation.y = -Math.PI / 2; r.group.position.copy(V(...SG)); root.add(r.group); signSet = (deg, fast) => r.setSpin(deg, fast); }
  else { const signG = new THREE.Group(); signG.name = 'use_handrail_sign'; signG.position.copy(V(...SG)); signG.rotation.y = -Math.PI / 2; root.add(signG); const pv = new THREE.Group(); signG.add(pv);
    const sp = new THREE.Mesh(new THREE.BoxGeometry(.4, .13, .006), toon('#1d3f8a')); sp.position.set(.175, -.04, .004); pv.add(sp); signSet = deg => { pv.rotation.z = -deg * Math.PI / 180; }; }
  const ghost = add(new THREE.PlaneGeometry(.42, .15), new THREE.MeshBasicMaterial({ color: '#f6f0dc', transparent: true, opacity: .45, depthWrite: false }), 'sign_ghost_patch', 'mark', V(W0 - .005, SG[1] - .175, SG[2] - .04), root, false); ghost.rotation.y = -Math.PI / 2;   // the paler unpainted patch where it hung straight for years
  // the PAIN DIAL (stand-in unless hero_props exports a dial builder)
  const PD = [W0 - .02, 2.05, 2.35]; let dialSet = null, dialRed = null; const dialG = new THREE.Group(); dialG.name = 'pain_dial'; dialG.position.copy(V(...PD)); root.add(dialG);
  if (HP && HP.buildPainDial) { const r = HP.buildPainDial(THREE, ctx, { value: pl.dial ?? .9 }); r.group.rotation.y = -Math.PI / 2; r.group.position.set(-.02, 0, 0); r.group.scale.setScalar(1.35); dialG.add(r.group); dialSet = r.setNeedle; dialG.traverse(o => { if (o.name === 'dial_face' && o.material && o.material.map && o.material.map.image) { const cv = o.material.map.image, c0 = document.createElement('canvas'); c0.width = cv.width; c0.height = cv.height; c0.getContext('2d').drawImage(cv, 0, 0); dialRed = { tex: o.material.map, cv, c0, u: 1 }; } }); }
  else { const face = canvasTex(THREE, 512, 512, (c, w, h) => { const cx = w / 2, cy = h * .56, R1 = 210, R2 = 150; c.fillStyle = '#f6f4ec'; c.beginPath(); c.arc(w / 2, h / 2, 250, 0, Math.PI * 2); c.fill();
      const zones = [['#2fae5a', 0, .45], ['#f2c62a', .45, .72], ['#e01e2a', .72, 1]]; for (const [col, a, b] of zones) { c.fillStyle = col; c.beginPath(); c.arc(cx, cy, R1, Math.PI + a * Math.PI, Math.PI + b * Math.PI); c.arc(cx, cy, R2, Math.PI + b * Math.PI, Math.PI + a * Math.PI, true); c.fill(); }
      c.strokeStyle = '#1e2a5a'; c.lineWidth = 5; for (let k = 0; k <= 10; k++) { const a = Math.PI + k / 10 * Math.PI; c.beginPath(); c.moveTo(cx + Math.cos(a) * (R2 - 6), cy + Math.sin(a) * (R2 - 6)); c.lineTo(cx + Math.cos(a) * (R2 - (k % 5 ? 26 : 44)), cy + Math.sin(a) * (R2 - (k % 5 ? 26 : 44))); c.stroke(); }
      c.fillStyle = '#1e2a5a'; c.font = 'bold 54px Arial'; c.textAlign = 'center'; c.fillText('0', cx - R1 + 16, cy + 58); c.fillText('10', cx + R1 - 22, cy + 58); c.font = 'bold 60px Arial'; c.fillText('PAIN', cx, cy + 120); });
    const fm = add(new THREE.CircleGeometry(.29, 40), new THREE.MeshLambertMaterial({ map: face }), 'pain_dial_face', 'sign', new THREE.Vector3(0, 0, .02), dialG, false); fm.rotation.y = -Math.PI / 2; fm.position.set(-.02, 0, 0);
    const bz = add(new THREE.TorusGeometry(.29, .022, 10, 40), chrome, 'pain_dial_bezel', 'metal', new THREE.Vector3(-.02, 0, 0), dialG, true); bz.rotation.y = Math.PI / 2;
    add(new THREE.CylinderGeometry(.3, .3, .03, 40), toon('#d8d4c8'), 'pain_dial_case', 'plastic', new THREE.Vector3(-.005, 0, 0), dialG, true).rotation.z = Math.PI / 2;
    for (const a of [.6, 2.5, 3.8, 5.6]) add(new THREE.SphereGeometry(.011, 8, 6), chrome, 'pain_dial_bezel_screw', 'metal', new THREE.Vector3(-.035, Math.sin(a) * .29, Math.cos(a) * .29), dialG, false);
    const needleP = new THREE.Group(); needleP.position.set(-.04, -.035, 0); dialG.add(needleP); const nd = new THREE.Mesh(new THREE.BoxGeometry(.008, .2, .016), toon('#1e2a5a')); nd.position.y = .1; nd.name = 'pain_dial_needle'; nd.castShadow = true; needleP.add(nd);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(.022, .022, .02, 16), chrome); hub.rotation.z = Math.PI / 2; needleP.add(hub);
    dialSet = v => { needleP.rotation.x = -(Math.PI / 2 - v * Math.PI); };
  }
  // the old cane on the newel post, cobweb hammock, sleeping spider, dust (stand-in unless hero_props has a cane)
  const caneG = new THREE.Group(); caneG.name = 'old_cane'; root.add(caneG); const fCane = HP && HP.buildCane ? 'buildCane' : null;
  if (pl.cane !== false) { if (fCane) { const r = HP.buildCane(THREE, ctx, { cobweb: pl.cobweb ?? 1, dust: pl.cane_dust ?? 1, spider: true }); caneG.add(r.group); caneG.position.copy(V(NEW[0], NEW[1], RISE + 1.09)).add(new THREE.Vector3(.055, -.8, 0)); }
    else { const wood = toon('#7a4a26'), woodDk = toon('#5a3418'); caneG.position.copy(V(NEW[0], NEW[1] - .0, RISE + 1.02));
      const crook = new THREE.Mesh(new THREE.TorusGeometry(.055, .014, 8, 20, Math.PI), wood); crook.name = 'cane_crook'; crook.rotation.y = Math.PI / 2; crook.position.set(0, 0, 0); caneG.add(crook);
      const sh = new THREE.Mesh(new THREE.CylinderGeometry(.013, .011, .86, 10), wood); sh.name = 'cane_shaft'; sh.position.copy(new THREE.Vector3(0, -.43, -.055)); caneG.add(sh);
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(.017, .019, .04, 10), rubber); tip.name = 'cane_rubber_tip'; tip.position.set(0, -.86, -.055); caneG.add(tip);
      const band = new THREE.Mesh(new THREE.TorusGeometry(.014, .004, 6, 12), woodDk); band.rotation.x = Math.PI / 2; band.position.set(0, -.08, -.055); caneG.add(band);
      const dust = new THREE.Mesh(new THREE.TorusGeometry(.055, .016, 6, 16, Math.PI), new THREE.MeshLambertMaterial({ color: '#e8e2d4', transparent: true, opacity: .55 })); dust.rotation.y = Math.PI / 2; dust.position.set(0, .004, 0); dust.scale.set(1, 1, .6); dust.name = 'cane_handle_dust'; caneG.add(dust); }
    if ((pl.cobweb ?? 1) > 0 && !fCane) { const op = pl.cobweb ?? 1, hm = new THREE.MeshBasicMaterial({ color: '#f2eee6', transparent: true, opacity: .32 * op, side: THREE.DoubleSide, depthWrite: false });
      const pts = []; for (let k = 0; k <= 12; k++) { const u = k / 12; pts.push(new THREE.Vector3(0, -.06 - Math.sin(u * Math.PI) * .14, -.055 + u * .05)); }   // a hammock sheet between the crook and the rail joint
      const hamG = new THREE.PlaneGeometry(.16, .22, 6, 8); const P = hamG.attributes.position; for (let i = 0; i < P.count; i++) { const x = P.getX(i), y = P.getY(i); P.setZ(i, Math.sin((y / .22 + .5) * Math.PI) * .05 * (1 - Math.abs(x) * 4)); } hamG.computeVertexNormals();
      const ham = new THREE.Mesh(hamG, hm); ham.name = 'cobweb_hammock'; ham.position.set(0, -.12, -.02); ham.rotation.y = Math.PI / 2; caneG.add(ham);
      const strM = new THREE.LineBasicMaterial({ color: '#f8f4ec', transparent: true, opacity: .7 * op }), sp2 = []; for (let k = 0; k < 18; k++) { const a = rr(0, Math.PI * 2); sp2.push(new THREE.Vector3(0, -.02, -.03), new THREE.Vector3(Math.cos(a) * .02, -.05 - rr(0, .22), -.03 + Math.sin(a) * .13)); }
      const strands = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(sp2), strM); strands.name = 'cobweb_strands'; caneG.add(strands);
      const spider = new THREE.Group(); spider.name = 'sleeping_spider'; spider.position.set(0, -.17, -.01); caneG.add(spider); const sb = new THREE.Mesh(new THREE.SphereGeometry(.012, 10, 8), ink); sb.scale.set(1, .8, 1.2); spider.add(sb); const shd = new THREE.Mesh(new THREE.SphereGeometry(.007, 8, 6), ink); shd.position.set(0, 0, .014); spider.add(shd);
      for (let k = 0; k < 8; k++) { const s = k < 4 ? 1 : -1, a = (k % 4) * .5 - .7; const lg = new THREE.Mesh(new THREE.CylinderGeometry(.0015, .0015, .025, 4), ink); lg.position.set(s * .014, -.004, Math.sin(a) * .01); lg.rotation.z = s * 1.0; lg.rotation.x = a * .6; spider.add(lg); }
      for (let z = 0; z < 2; z++) { const zz = new THREE.Mesh(new THREE.PlaneGeometry(.012, .012), new THREE.MeshBasicMaterial({ map: canvasTex(THREE, 32, 32, (c) => { c.fillStyle = '#1e2a5a'; c.font = 'bold 28px Arial'; c.fillText('z', 6, 26); }), transparent: true })); zz.position.set(-.02, -.13 + z * .025, .01 + z * .01); zz.rotation.y = -Math.PI / 2; zz.scale.setScalar(1 + z * .5); zz.name = 'spider_zz'; spider.add(zz); } }
  }

  // ================= AIR: sun shafts through the window + dust motes =================
  const air = new THREE.Group(); air.name = 'air'; root.add(air); const sunCol = new THREE.Color(EV ? '#ff8a4a' : '#ffcf7a');
  const shaftOn = pl.shafts !== false, sunP = new THREE.Vector3(sd[0], sd[1], sd[2]).normalize(), len = EV ? 11 : 7;
  if (shaftOn) for (let c = 0; c < WIN.cols; c++) for (let half = 0; half < 2; half++) { const x0 = WIN.x0 + c * cw + .04, x1 = WIN.x0 + (c + 1) * cw - .04, za = WIN.z0 + half * (WIN.z1 - WIN.z0) / 2 + .03, zb = WIN.z0 + (half + 1) * (WIN.z1 - WIN.z0) / 2 - .03;
    const q = [[x0, Y1, za], [x1, Y1, za], [x1, Y1, zb], [x0, Y1, zb]], far = q.map(p => [p[0] - sunP.x * len, p[1] - sunP.y * len, p[2] - sunP.z * len]); const pos = [], col = [], idx = [];
    const push = (p, k) => { const v = V(...p); pos.push(v.x, v.y, v.z); col.push(sunCol.r * k, sunCol.g * k, sunCol.b * k); };
    q.forEach(p => push(p, EV ? .16 : .12)); far.forEach(p => push(p, 0)); for (let s = 0; s < 4; s++) { const a = s, b = (s + 1) % 4; idx.push(a, b, b + 4, a, b + 4, a + 4); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false, fog: false })); m.name = 'sun_shaft'; m.userData.role = 'light'; m.castShadow = false; m.receiveShadow = false; air.add(m); }
  let dustPts = null, dustBase = null;
  if (pl.dust !== false) { const n = 700, pos = new Float32Array(n * 3); dustBase = []; for (let i = 0; i < n; i++) { const t = R0() * len * .8, p = [rr(WIN.x0, WIN.x1) - sunP.x * t, Y1 - .2 - sunP.y * t, rr(WIN.z0, WIN.z1) - sunP.z * t]; if (p[2] < .2) p[2] = rr(.3, 2.5); dustBase.push(p); const v = V(...p); pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); dustPts = new THREE.Points(g, new THREE.PointsMaterial({ color: EV ? '#ffd0a8' : '#fff0c0', size: .014, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); dustPts.name = 'dust_motes'; air.add(dustPts); }


  // ================= WALL LIFE: standpipe cabinet, drain pipe, bulletin board, grilles, scuffs; window haze glow =================
  box(.16, .7, .9, M.steel, 'standpipe_cabinet', 'metal', W0 - .08, -2.6, 1.35); box(.01, .6, .8, new THREE.MeshPhysicalMaterial({ color: '#e8f4f8', transparent: true, opacity: .3, roughness: .05 }), 'standpipe_glass', 'glass', W0 - .165, -2.6, 1.35, root, false);
  for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2; add(new THREE.TorusGeometry(.17 - k * .012, .018, 6, 18), M.paint('#c8b890'), 'coiled_hose', 'rubber', V(W0 - .1, -2.6, 1.3), root, false).rotation.y = Math.PI / 2; }
  add(new THREE.CylinderGeometry(.05, .05, .12, 12), M.chrome, 'standpipe_valve', 'metal', V(W0 - .1, -2.35, 1.62), root, false);
  bar([-W0 + .08, Y1 - .08, 0], [-W0 + .08, Y1 - .08, CEIL], .045, M.paint('#b8b4a8'), 'drain_pipe_corner', 'metal'); for (let z = .6; z < CEIL; z += 1.2) add(new THREE.TorusGeometry(.05, .008, 5, 14), steelDk, 'pipe_clamp', 'metal', V(-W0 + .08, Y1 - .08, z), root, false).rotation.x = Math.PI / 2;
  bar([W0 - .06, Y0 + .1, CEIL - .5], [W0 - .06, Y1 - .1, CEIL - .5], .02, steelDk, 'conduit_run_right', 'metal'); bar([-W0 + .06, Y0 + .1, CEIL - .55], [-W0 + .06, Y1 - .1, CEIL - .55], .02, steelDk, 'conduit_run_left', 'metal');
  box(.9, .03, .6, M.paint('#b08a5a'), 'cork_board', 'wood', -.86, -.02, 1.75); box(.96, .02, .66, M.paint('#6a4a2a'), 'cork_board_frame', 'wood', -.86, -.005, 1.75); const ccol = ['#f8f4e8', '#f2e28a', '#bfe0f0', '#f8f4e8', '#d8f0c8'];
  for (let k = 0; k < 7; k++) { const nt = box(rr(.12, .22), .004, rr(.14, .26), toon(ccol[k % 5]), 'cork_note', 'paper', -1.25 + k * .12 + rr(-.03, .03), -.04, 1.6 + rr(-.1, .2), root, false); nt.rotation.y = rr(-.08, .08); add(new THREE.SphereGeometry(.008, 6, 5), toon(['#2a7ab8', '#f2c62a', '#2fae5a'][k % 3]), 'push_pin', 'plastic', V(-1.25 + k * .12, -.05, 1.7), root, false); }
  for (const [x, y, z, ax] of [[W0 - .01, 3.6, 3.7, 'x'], [-W0 + .01, -3.5, .4, 'x']]) { box(.02, .45, .3, M.steel, 'vent_grille', 'metal', x, y, z, root, false); for (let k = 0; k < 6; k++) box(.03, .42, .012, steelDk, 'vent_slat', 'metal', x, y, z - .12 + k * .048, root, false); }
  for (let k = 0; k < 14; k++) { const sc = add(new THREE.PlaneGeometry(rr(.05, .2), rr(.006, .015)), new THREE.MeshBasicMaterial({ color: '#4a4038', transparent: true, opacity: .25, depthWrite: false }), 'wall_scuff', 'mark', V(W0 - .015, rr(-4, 3), rr(.2, 1.1) + Math.max(0, rr(-1, 1))), root, false); sc.rotation.set(0, -Math.PI / 2, rr(-.4, .4)); }
  { const hz = canvasTex(THREE, 256, 256, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
    for (const [y, sc, op] of [[Y1 - .6, 5.5, .32], [Y1 - 2.2, 7, .16], [.5, 9, .08]]) { const hp = add(new THREE.PlaneGeometry(sc, sc * 1.1), new THREE.MeshBasicMaterial({ map: hz, color: EV ? '#ff9a6a' : '#ffd890', transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false }), 'window_haze_glow', 'light', V(0, y, 4.0 - (Y1 - y) * .25), root, false); hp.renderOrder = 5; } }
  // ================= S4 KEYS (S4 builder 2026-11-16; off unless the film.json place sets them) =================
  // cobweb_xl 0..1: EXTREME row 31 "TWO YEARS LATER": extra hammock sheets + strands so the web is thick as a hammock round the hanging cane, dust like snow on the crook
  // knee_leg { at: [local x,y,z], yaw, bend, normal, f: [f0, f1] visible window }: row 32 the healed knee in khaki shorts (hero_props buildKneeLeg adult, three faint pale squares) for the knee close
  // speed_lines [{ f0, f1, from: [plan], to: [plan], n, spread }]: row 33 EXTREME: white streaks behind the bounding climber, fade over f0-f1
  // dial_xyz [local x,y,z]: move the pain dial (default right wall y 2.05 z 2.35)
  const s4fx = [];
  // cobweb_xl (round 3): a real orb web slung slack as a hammock between the cane shaft, the newel post and the rail: thin radial strands + a spiral, dust caught in it,
  //   a small cartoon spider asleep in the hub (eyes shut, zZ), a snow cap of dust on the crook. Pass cobweb: 0 to hide hero_props' own web.
  if ((pl.cobweb_xl ?? 0) > 0) { const cw0 = new THREE.Group(); cw0.name = 's4_cobweb_hammock'; root.add(cw0); root.updateMatrixWorld(true);
    const silk = new THREE.MeshBasicMaterial({ color: '#f7f5ef', transparent: true, opacity: .92, depthWrite: false, fog: false }), P3 = (x, y, z) => new THREE.Vector3(x, y, z);
    const tube = (pts, r, nm, mat = silk) => { const c = new THREE.CatmullRomCurve3(pts.map(p => V(p.x, p.y, p.z))); const m = new THREE.Mesh(new THREE.TubeGeometry(c, Math.max(8, pts.length * 3), r, 4, false), mat); m.name = nm; m.userData.role = 'cloth'; cw0.add(m); return m; };
    const Z = RISE + .29, FR = [P3(.292, .03, Z + .86), P3(.24, .16, 1.06), P3(.222, .4, 1.17), P3(.222, .5, .98), P3(.222, .44, .66), P3(.235, .2, .5), P3(.27, .06, .56), P3(.292, .03, .72)];   // cane, rail, balusters, post
    const HUB = P3(.31, .2, .78), SAG = P3(.07, -.07, -.03);   // the hub hangs low and bellies toward the lens (slack: two years untouched)
    const on = (j, u) => { const p = FR[j], q = HUB.clone().lerp(p, u); return q.add(SAG.clone().multiplyScalar(4 * u * (1 - u))).add(P3(0, 0, -.025 * Math.sin(Math.PI * u))); };
    FR.forEach((p, j) => tube([0, .25, .5, .75, 1].map(u => on(j, u)), .0011, 's4_web_radial'));
    for (let j = 0; j < FR.length; j++) tube([FR[j], FR[(j + 1) % FR.length].clone().lerp(FR[j], .5).add(P3(0, 0, -.02)), FR[(j + 1) % FR.length]], .0013, 's4_web_frame');
    const sp = [], NJ = FR.length, TURNS = 10; for (let t = 0; t <= NJ * TURNS; t++) { const j = t % NJ, u = .1 + .86 * t / (NJ * TURNS); const p = on(j, u), q = on((j + 1) % NJ, u + .86 / (NJ * TURNS)); sp.push(p, p.clone().lerp(q, .5).add(P3(0, 0, -.004 - .008 * u))); }
    tube(sp, .0009, 's4_web_spiral');
    for (const [x, y, z] of [[.23, .02, 1.2], [.222, .62, 1.24], [.24, .08, .3]]) tube([FR[0].clone().lerp(FR[2], .4), P3(x, y, z)], .0008, 's4_web_guy');
    const fluff = new THREE.MeshLambertMaterial({ color: '#ddd6c8' }); for (let k = 0; k < 18; k++) { const j = Math.floor(rr(0, NJ)), q = on(j, rr(.3, .95)); const m = add(new THREE.SphereGeometry(rr(.0025, .005), 6, 5), fluff, 's4_web_dust', 'cloth', V(q.x, q.y, q.z), cw0, false); m.scale.set(1, .6, 1); }
    // the sleeping spider in the hub: chubby, eyes shut (two dark arcs), rosy cheeks, legs tucked, a zZ
    const hp = on(0, 0), sg = new THREE.Group(); sg.name = 's4_sleeping_spider'; sg.position.copy(V(hp.x, hp.y, hp.z)); cw0.add(sg); const camDir = V(1.3 - hp.x, -1.45 - hp.y, 1.15 - hp.z).normalize();
    sg.lookAt(root.localToWorld(sg.position.clone().add(camDir)));
    const body = toon('#4a3630'), headM = toon('#7a5a4a'), dk = toon('#1a1214');
    add(new THREE.SphereGeometry(.022, 16, 12), body, 's4_spider_abdomen', 'skin', new THREE.Vector3(0, .004, -.022), sg).scale.set(1, .85, 1.1);
    add(new THREE.SphereGeometry(.014, 14, 10), headM, 's4_spider_head', 'skin', new THREE.Vector3(0, 0, .006), sg);
    for (const sx of [-1, 1]) { const arc = new THREE.Mesh(new THREE.TorusGeometry(.0042, .0011, 5, 10, Math.PI), dk); arc.position.set(sx * .0055, .002, .0195); arc.rotation.z = Math.PI; arc.name = 's4_spider_eye_shut'; sg.add(arc);
      add(new THREE.CircleGeometry(.0032, 10), toon('#e89a8a'), 's4_spider_cheek', 'skin', new THREE.Vector3(sx * .009, -.005, .0185), sg, false); }
    for (let k = 0; k < 8; k++) { const sx = k < 4 ? 1 : -1, a = (k % 4) * .38 - .55; const p0 = new THREE.Vector3(sx * .01, 0, -.008 + a * .02), p1 = new THREE.Vector3(sx * .028, .012, -.01 + a * .04), p2 = new THREE.Vector3(sx * .03, -.012, -.004 + a * .05);
      const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(p0, p1, p2), 8, .0016, 4, false), dk); m.name = 's4_spider_leg'; sg.add(m); }
    const zt = canvasTex(THREE, 128, 128, (c) => { c.clearRect(0, 0, 128, 128); c.fillStyle = '#1e2a5a'; c.strokeStyle = '#ffffff'; c.lineWidth = 6; c.font = 'bold 44px Arial'; c.strokeText('z', 18, 108); c.fillText('z', 18, 108); c.font = 'bold 64px Arial'; c.strokeText('Z', 58, 66); c.fillText('Z', 58, 66); });
    const zz = new THREE.Mesh(new THREE.PlaneGeometry(.06, .06), new THREE.MeshBasicMaterial({ map: zt, transparent: true, depthWrite: false })); zz.position.set(.03, .045, .01); zz.name = 's4_spider_zz'; sg.add(zz);
    // dust like snow on the crook (cane crook centre plan (.23, .02, RISE + 1.09), r .055)
    const snowM = toon('#efe9dc'), cap = []; for (let k = 0; k <= 16; k++) { const an = k / 16 * Math.PI; cap.push(P3(.23 + Math.cos(an) * .055, .02, RISE + 1.09 + Math.sin(an) * .055 + .012)); } tube(cap, .0065, 's4_dust_snow_cap', snowM);
    for (let k = 0; k < 45; k++) { const an = rr(.1, Math.PI - .1); add(new THREE.SphereGeometry(rr(.003, .007), 5, 4), snowM, 's4_dust_snow', 'cloth', V(.23 + Math.cos(an) * .055 + rr(-.004, .004), .02 + rr(-.012, .012), RISE + 1.09 + Math.sin(an) * .055 + .016 + rr(0, .006)), cw0, false); } }
  // knee_leg v2 (round 3) { v: 2, at: [local x,y,z] knee centre, f: [f0, f1] }: row 32: the patient's real bent climbing knee, foot planted on the tread .5 m below:
  //   a smooth tapered leg (thigh -> knee -> calf -> ankle), a kneecap with THREE faint pale squares, the KHAKI SHORTS hem (cast patientShorts #c2ad7a / #8f7c50), white sock, brown shoe.
  if (pl.knee_leg) { const kl = pl.knee_leg, g = new THREE.Group(); g.name = 's4_knee_leg'; g.position.copy(V(...kl.at)); root.add(g);
    const L = (x, y, z) => V(x, y, z), skin = toon('#efd2b8'), khaki = toon('#c2ad7a'), khakiD = toon('#8f7c50'), sock = toon('#f4f2ec'), shoe = toon('#6a4428'), sole = toon('#2a2224');
    const H = [0, -.4, .23], AN = [0, -.05, -.42], path = new THREE.CatmullRomCurve3([L(...H), L(0, -.2, .125), L(0, -.035, .03), L(0, .008, -.05), L(0, -.02, -.22), L(...AN)], false, 'centripetal');
    const radius = u => u < .45 ? .07 - .014 * (u / .45) : u < .55 ? .056 : u < .75 ? .056 + .002 * Math.sin((u - .55) / .2 * Math.PI) : .056 - .024 * ((u - .75) / .25);
    const tg = new THREE.TubeGeometry(path, 60, 1, 20, false), TP = tg.attributes.position; for (let i = 0; i <= 60; i++) { const u = i / 60, c = path.getPointAt(u), r = radius(u); for (let j = 0; j <= 20; j++) { const k = i * 21 + j, v = new THREE.Vector3().fromBufferAttribute(TP, k).sub(c).multiplyScalar(r); TP.setXYZ(k, c.x + v.x * 1.08, c.y + v.y, c.z + v.z); } } tg.computeVertexNormals();
    add(tg, skin, 's4_leg_skin', 'skin', null, g);
    // kneecap: front of the joint (bisector), slightly proud
    const nK = new THREE.Vector3(0, .9, .44).normalize(), KC = L(0, nK.y * .05, nK.z * .05); const pat = add(new THREE.SphereGeometry(1, 24, 18), skin, 's4_kneecap', 'skin', KC, g); pat.scale.set(.05, .042, .03);
    g.updateMatrixWorld(true); pat.lookAt(g.localToWorld(KC.clone().add(L(0, nK.y, nK.z))));
    // the three faint pale squares where the plasters were (row 5 spacing), on the kneecap facing up the stairs
    const sqT = canvasTex(THREE, 128, 128, (c) => { c.clearRect(0, 0, 128, 128); c.fillStyle = 'rgba(255,250,242,.95)'; c.strokeStyle = 'rgba(205,160,130,.9)'; c.lineWidth = 7; const r = 22; c.beginPath(); c.moveTo(14 + r, 14); c.arcTo(114, 14, 114, 114, r); c.arcTo(114, 114, 14, 114, r); c.arcTo(14, 114, 14, 14, r); c.arcTo(14, 14, 114, 14, r); c.closePath(); c.fill(); c.stroke(); });
    const sqM = new THREE.MeshLambertMaterial({ map: sqT, transparent: true, alphaTest: .05, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
    for (let i = -1; i <= 1; i++) { const p = KC.clone().add(L(i * .03, nK.y * .031 - Math.abs(i) * .008, nK.z * .031 - Math.abs(i) * .004)); const m = add(new THREE.PlaneGeometry(.026, .026), sqM, 's4_pale_square_' + (i + 2), 'mark', p, g, false); m.lookAt(g.localToWorld(p.clone().add(L(i * .35, nK.y, nK.z)))); m.renderOrder = 3; }
    // khaki shorts: thigh to a hem 0.15 m above the knee, a turned-up cuff, two creases
    const tl = Math.hypot(...H), td = H.map(v => v / tl), hem = td.map(v => v * .15), top = [H[0], H[1] - .12, H[2] + .07];
    bar(hem, top, .092, khaki, 's4_shorts_leg', 'cloth', g, 20); bar(hem, hem.map((v, i) => v + td[i] * .025), .095, khakiD, 's4_shorts_hem_cuff', 'cloth', g, 20);
    for (const sx of [-1, 1]) bar([sx * .05, hem[1] - .05, hem[2] + .08], [sx * .07, hem[1] - .16, hem[2] + .12], .002, khakiD, 's4_shorts_crease', 'cloth', g, 4);
    // leg hair (a few fine strokes on the shin)
    for (let k = 0; k < 22; k++) { const u = rr(.6, .9), c = path.getPointAt(u), an = rr(-1.3, 1.3), r = radius(u) + .001, p = c.clone().add(new THREE.Vector3(Math.sin(an) * r, 0, -Math.cos(an) * r)); const m = add(new THREE.CylinderGeometry(.0007, .0007, .012, 3), toon('#9a8a7a'), 's4_leg_hair', 'skin', p, g, false); m.rotation.set(rr(-.4, .4), 0, rr(-.6, .6)); }
    // white sock + ribbed band, brown shoe on the tread
    bar(AN, [0, -.035, -.3], .036, sock, 's4_sock', 'cloth', g, 16); for (let k = 0; k < 3; k++) bar([0, -.036, -.3 - k * .012], [0, -.036, -.306 - k * .012], .0375, toon('#d8d4cc'), 's4_sock_rib', 'cloth', g, 16);
    const sh = add(new THREE.SphereGeometry(1, 20, 14), shoe, 's4_shoe', 'leather', L(0, .03, -.465), g); sh.scale.set(.052, .045, .14);
    box(.1, .28, .018, sole, 's4_shoe_sole', 'rubber', 0, .035, -.49, g); for (let k = 0; k < 4; k++) bar([-.022, .04 + k * .02, -.432], [.022, .04 + k * .02, -.432], .002, toon('#f2eee2'), 's4_shoe_lace', 'cloth', g, 4);
    s4fx.push({ leg: g, win: kl.f || [-1e9, 1e9], slide: kl.slide || null, base: g.position.clone(), dv: V(...kl.slide ? kl.slide.d : [0, 0, 0]).sub(V(0, 0, 0)) }); }
  for (const sl of pl.speed_lines || []) { const n = sl.n ?? 6, M2 = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false, side: THREE.DoubleSide });
    const a = ctx.B2T(sl.from), b = ctx.B2T(sl.to), d = b.clone().sub(a), L = d.length(); for (let k = 0; k < n; k++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(L * rr(.5, 1), .012), M2); m.name = 's4_speed_line'; m.userData.role = 'fx';
      const off = new THREE.Vector3(0, (k - n / 2) * (sl.spread ?? .14) + rr(-.03, .03), 0); m.position.copy(a).addScaledVector(d, .5).add(off); m.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), d.clone().normalize()); scene.add(m); }
    s4fx.push({ sl, M2 }); }
  // S4 v2 knee_plasters { at: [ABSOLUTE plan x,y,z] the card's line knee, f: [f0, f1], s: .045 size, toward: .04 m to the lens, tilt: deg }: row 32 (CB v2: no human leg):
  //   three faint cartoon plaster squares drawn in the cast style (cream, black line, a pad, round corners) ON the patient card's black line knee, turned to the lens every frame
  let kps = null; if (pl.knee_plasters) { const kp = pl.knee_plasters, s = kp.s ?? .045, g = new THREE.Group(); g.name = 's4_knee_plasters'; scene.add(g);
    const pt = canvasTex(THREE, 128, 128, (c, w, h) => { c.clearRect(0, 0, w, h); const rp = (x, y, ww, hh, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + ww, y, x + ww, y + hh, r); c.arcTo(x + ww, y + hh, x, y + hh, r); c.arcTo(x, y + hh, x, y, r); c.arcTo(x, y, x + ww, y, r); c.closePath(); };
      c.fillStyle = '#1a1416'; rp(4, 4, 120, 120, 26); c.fill(); c.fillStyle = '#f4e8cc'; rp(13, 13, 102, 102, 20); c.fill(); c.fillStyle = '#e2cc9c'; rp(40, 40, 48, 48, 9); c.fill();
      c.fillStyle = 'rgba(150,120,80,.5)'; for (const [x, y] of [[24, 24], [98, 24], [24, 98], [98, 98], [61, 24], [61, 100]]) { c.beginPath(); c.arc(x, y, 3, 0, 7); c.fill(); } });
    const pm = new THREE.MeshBasicMaterial({ map: pt, transparent: true, opacity: kp.opacity ?? .9, depthWrite: false, depthTest: !kp.top, toneMapped: false, fog: false });   // top: drawn over the card (the card is nudged toward the lens)
    [-1, 0, 1].forEach(i => { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), pm); m.name = 's4_knee_plaster_' + (i + 2); m.userData.role = 'mark'; if (kp.stack) m.position.set(Math.abs(i) * s * .1, i * s * 1.12, 0); else m.position.set(i * s * 1.18, -Math.abs(i) * s * .12, 0); m.rotation.z = (kp.tilt ?? 8) * Math.PI / 180 * (i === 0 ? -.4 : i); m.renderOrder = kp.top ? 990 : 60; g.add(m); });
    kps = { g, kp, at: ctx.B2T(kp.at) }; g.visible = false; }
  if (pl.dial_xyz) dialG.position.copy(V(...pl.dial_xyz));
  // hide list
  for (const nm of pl.hide || []) root.traverse(o => { if (o.name === nm || (nm.endsWith('*') && o.name.startsWith(nm.slice(0, -1)))) o.visible = false; });

  // ================= ANCHORS =================
  const anchors = { newel_top: A(NEW[0], NEW[1], RISE + 1.06), cane: A(NEW[0], NEW[1], RISE + 1.02), sign_screw: A(...SG), pain_dial: A(...PD), fire_door: A(-W0, FD.y, 0), nurse_door: A(-W0 + .45, FD.y + .1, 0),
    surgeon_last: A(.25, -2.75, 0), window_centre: A(0, Y1, (WIN.z0 + WIN.z1) / 2), landing_mid: A(0, (LAND_Y + Y1) / 2, LANDZ), climb: [] };
  const lane = { w: [1.5, -1.5], r: [.7, -.7] };
  for (const t of T1) for (const ln of ['r', 'w']) { const p = A(lane[ln][0], t.y, t.z); anchors['f1_' + t.i + '_' + ln] = p; }
  for (const t of T2) for (const ln of ['r', 'w']) { const p = A(lane[ln][1], t.y, t.z); anchors['f2_' + t.i + '_' + ln] = p; }
  const landPts = [[1.4, 3.3], [.6, 3.9], [-.1, 3.5], [-.6, 4.0], [-1.3, 3.4], [1.0, 4.2]]; landPts.forEach((p, k) => anchors['land_' + k] = A(p[0], p[1], LANDZ));
  const s2 = [[-1.1, -.4], [-.6, -.9], [-1.5, -1.3], [-.9, -1.8]]; s2.forEach((p, k) => anchors['s2_' + k] = A(p[0], p[1], S2Z));
  for (let i = 1; i <= NT; i++) anchors.climb.push(anchors['f1_' + i + (i % 2 ? '_r' : '_w')]); anchors.climb.push(anchors.land_0, anchors.land_2, anchors.land_4);
  for (let i = 1; i <= NT; i++) anchors.climb.push(anchors['f2_' + i + (i % 2 ? '_w' : '_r')]); anchors.climb.push(anchors.s2_0, anchors.s2_1);

  // ================= UPDATE (dial, sign, door, dust drift) =================
  const update = (f, t, R) => { LP.sync(M);
    if (kps) { const w = kps.kp.f || [-1e9, 1e9]; kps.g.visible = f >= w[0] && f <= w[1]; if (kps.g.visible && R && R.camera) { const cp = R.camera.position, d = cp.clone().sub(kps.at).normalize(); kps.g.position.copy(kps.at).addScaledVector(d, kps.kp.toward ?? .04); kps.g.quaternion.copy(R.camera.quaternion); } }
    const dv = keyed(pl.dial_at, f, pl.dial ?? .9); if (dialSet) dialSet(Math.max(0, Math.min(1, dv)));
    // dial_red_at [[f, u]]: the red zone's strength (1 = full red, 0 = muted warm sand): red reads only where the story calls it (row 34)
    if (dialRed && pl.dial_red_at) { const ru = Math.round(keyed(pl.dial_red_at, f, 1) * 50) / 50; if (ru !== dialRed.u) { dialRed.u = ru; const g2 = dialRed.cv.getContext('2d'); g2.drawImage(dialRed.c0, 0, 0); if (ru < 1) { const A0 = Math.PI * 1.25, A1 = -Math.PI * .25; g2.globalAlpha = 1 - ru; g2.strokeStyle = '#ddd0a4'; g2.lineWidth = 46; g2.beginPath(); g2.arc(256, 256, 190, -(A0 + (A1 - A0) * .68), -(A0 + (A1 - A0) * 1), false); g2.stroke(); g2.globalAlpha = 1; } dialRed.tex.needsUpdate = true; } }
    const turns = keyed(pl.sign_spin_at, f, pl.sign_spin ?? .02), tPrev = keyed(pl.sign_spin_at, f - 1, pl.sign_spin ?? .02); if (signSet) signSet(turns * 360, pl.sign_blur ?? Math.abs(turns - tPrev) > .08);
    leaf.rotation.y = -(pl.door ?? 0) * 1.4;
    for (const e of s4fx) { if (e.leg) { e.leg.visible = f >= e.win[0] && f <= e.win[1]; if (e.slide) { const u = Math.max(0, Math.min(1, (f - e.slide.f0) / Math.max(1, e.slide.f1 - e.slide.f0))), k = 1 - u * u * (3 - 2 * u), uo = e.slide.o ? Math.max(0, Math.min(1, (f - e.slide.o[0]) / Math.max(1, e.slide.o[1] - e.slide.o[0]))) : 0; e.leg.position.copy(e.base).addScaledVector(e.dv, k - uo * uo * (3 - 2 * uo)); } continue; } const u = (f - e.sl.f0) / Math.max(1, e.sl.f1 - e.sl.f0); e.M2.opacity = u >= 0 && u <= 1 ? .75 * (1 - u) : 0; }
    if (dustPts) { const P = dustPts.geometry.attributes.position, tt = (t ?? f / 30); for (let i = 0; i < dustBase.length; i++) { const b = dustBase[i], v = V(b[0] + Math.sin(tt * .35 + i) * .05, b[1] + Math.cos(tt * .27 + i * 1.7) * .05, b[2] + Math.sin(tt * .2 + i * .3) * .06 + ((tt * .02 + i * .013) % .3)); P.setXYZ(i, v.x, v.y, v.z); } P.needsUpdate = true; } };
  // ================= ENV v3 (env helper E2, 2026-11-17; place key env_v3: true, default OFF): break the plain block walls, a view out, a second light colour =================
  const envT = [];
  if (pl.env_v3) {
    const lab = (w, h, bg, draw, transparent = false) => new THREE.MeshLambertMaterial({ transparent, map: canvasTex(THREE, w, h, (c, W, H) => { if (bg) { c.fillStyle = bg; c.fillRect(0, 0, W, H); } draw(c, W, H); }) });
    const txt = (c, s, x, y, px, col = '#1e2a2a', al = 'center') => { c.fillStyle = col; c.font = 'bold ' + px + 'px Arial'; c.textAlign = al; c.textBaseline = 'middle'; c.fillText(s, x, y); };
    const onR = (w, h, mat, nm, y, z, x = W0 - .022) => { const m = add(new THREE.PlaneGeometry(w, h), mat, nm, 'sign', V(x, y, z), root, false); m.rotation.y = -Math.PI / 2; return m; };   // right wall, faces -x
    const onL = (w, h, mat, nm, y, z, x = -W0 + .006) => { const m = add(new THREE.PlaneGeometry(w, h), mat, nm, 'sign', V(x, y, z), root, false); m.rotation.y = Math.PI / 2; return m; };
    const frameR = (w, h, nm, y, z, col = '#3a4a50') => box(.02, w + .05, h + .05, M.paint(col), nm + '_frame', 'metal', W0 - .01, y, z, root, false);
    // (1) a painted blue wayfinding stripe over the dado cap, following the stair line on the right wall (breaks the plain block)
    ribbon('x', W0 - .016, [[Y0, DADO_Z + .14, DADO_Z + .24], [0, DADO_Z + .14, DADO_Z + .24], [LAND_Y, zN1(LAND_Y) + 1.16, zN1(LAND_Y) + 1.26], [LAND_Y + .3, LANDZ + DADO_Z + .14, LANDZ + DADO_Z + .24], [Y1, LANDZ + DADO_Z + .14, LANDZ + DADO_Z + .24]], M.paint('#2f6f96'), 'env_wall_stripe_right');
    ribbon('x', -W0 + .016, [[Y0, DADO_Z + .14, DADO_Z + .24], [0, DADO_Z + .14, DADO_Z + .24]], M.paint('#2f6f96'), 'env_wall_stripe_left');
    // (2) STAIR ID sign (floor number) by the foot, the FIRE EXIT PLAN, the "TAKE THE STAIRS!" health poster above flight 1 (all on the right wall)
    frameR(.32, .44, 'env_stair_id', -1.95, 1.72, '#1d3f8a');
    onR(.32, .44, lab(192, 264, '#1d3f8a', (c, W, H) => { c.strokeStyle = '#fff'; c.lineWidth = 4; c.strokeRect(6, 6, W - 12, H - 12); txt(c, 'STAIR B', W / 2, 34, 26, '#fff'); txt(c, '1', W / 2, 124, 120, '#fff'); txt(c, 'FLOOR', W / 2, 196, 24, '#f2d24a'); txt(c, 'NO ROOF ACCESS', W / 2, 236, 16, '#fff'); }), 'env_stair_id_sign', -1.95, 1.72);
    frameR(.44, .33, 'env_exit_plan', -1.2, 1.64, '#d8d4c8');
    onR(.44, .33, lab(264, 198, '#f8f6ee', (c, W, H) => { txt(c, 'FIRE EXIT PLAN', W / 2, 16, 18, '#1e2a5a'); c.strokeStyle = '#2a2f3a'; c.lineWidth = 3; c.strokeRect(20, 32, W - 40, H - 54); for (const x of [80, 140, 200]) { c.beginPath(); c.moveTo(x, 32); c.lineTo(x, 100); c.stroke(); }
      c.beginPath(); c.moveTo(20, 110); c.lineTo(W - 20, 110); c.stroke(); c.strokeStyle = '#1f9a4a'; c.lineWidth = 6; c.beginPath(); c.moveTo(60, 130); c.lineTo(210, 130); c.lineTo(210, 165); c.stroke(); c.fillStyle = '#1f9a4a'; c.beginPath(); c.moveTo(200, 160); c.lineTo(220, 160); c.lineTo(210, 176); c.fill();
      c.fillStyle = '#3a7ad8'; c.beginPath(); c.arc(60, 130, 8, 0, 7); c.fill(); txt(c, 'YOU ARE HERE', 82, 152, 13, '#3a7ad8'); txt(c, 'EXIT', 230, 186, 13, '#1f9a4a'); }), 'env_exit_plan_sign', -1.2, 1.64);
    frameR(.56, .76, 'env_poster_stairs', .95, 2.45, '#e8e4d8');
    onR(.56, .76, lab(280, 380, '#2a9a96', (c, W, H) => { c.fillStyle = '#f2d24a'; c.fillRect(0, 0, W, 92); txt(c, 'TAKE THE', W / 2, 30, 34, '#1e2a5a'); txt(c, 'STAIRS!', W / 2, 70, 44, '#1e2a5a');
      c.fillStyle = '#f4efe0'; for (let k = 0; k < 6; k++) c.fillRect(30 + k * 36, 300 - k * 34, 44, 34 - 0); c.strokeStyle = '#1e2a5a'; c.lineWidth = 9; c.lineCap = 'round'; const fx = 150, fy = 160;
      c.beginPath(); c.arc(fx, fy - 30, 16, 0, 7); c.stroke(); c.beginPath(); c.moveTo(fx, fy - 12); c.lineTo(fx - 6, fy + 40); c.lineTo(fx + 22, fy + 62); c.moveTo(fx - 6, fy + 40); c.lineTo(fx - 30, fy + 70); c.moveTo(fx - 2, fy); c.lineTo(fx + 28, fy + 18); c.moveTo(fx - 2, fy); c.lineTo(fx - 28, fy + 12); c.stroke();
      c.fillStyle = '#8a5ac8'; c.beginPath(); c.moveTo(232, 150); c.bezierCurveTo(232, 128, 262, 128, 262, 150); c.bezierCurveTo(262, 168, 232, 184, 232, 196); c.bezierCurveTo(232, 184, 202, 168, 202, 150); c.bezierCurveTo(202, 128, 232, 128, 232, 150); c.fill();
      txt(c, 'GOOD FOR YOUR HEART', W / 2, 350, 18, '#f4efe0'); txt(c, 'HEALTHY HOUSTON 1994', W / 2, 372, 12, '#d8f0ec'); }), 'env_poster_take_the_stairs', .95, 2.45);
    // (3) NOTICE BOARD (glass case) on the landing's right wall with papers; a FLU SHOTS poster on the left ground wall
    { const NY = 3.05, NZ = LANDZ + 1.78; box(.05, 1.0, .66, M.paint('#6a4a2a'), 'env_notice_case', 'wood', W0 - .025, NY, NZ); onR(.92, .58, M.paint('#b08a5a'), 'env_notice_cork', NY, NZ, W0 - .052);
      const pc = ['#f8f4e8', '#f2e28a', '#bfe0f0', '#d8f0c8', '#f8f4e8', '#f4d8b0'], pt = ['IN-SERVICE TUE 2PM', 'FLU SHOTS', 'PICNIC 94', 'CPR CLASS', 'LOST: KEYS', 'CAR POOL'];
      for (let k = 0; k < 6; k++) { const pa = onR(.2, .24, lab(100, 120, pc[k], (c, W, H) => { txt(c, pt[k], W / 2, 18, pt[k].length > 9 ? 9 : 13, '#1e2a5a'); c.fillStyle = 'rgba(30,42,90,.35)'; for (let l = 0; l < 6; l++) c.fillRect(10, 38 + l * 13, W - 20 - (l % 3) * 12, 3); }), 'env_notice_paper', NY - .33 + (k % 3) * .3 + rr(-.03, .03), NZ + (k < 3 ? .13 : -.14), W0 - .056); pa.rotation.z = rr(-.08, .08); }
      onR(.92, .58, new THREE.MeshLambertMaterial({ color: '#e8f4f8', transparent: true, opacity: .14 }), 'env_notice_glass', NY, NZ, W0 - .062); }
    onL(.44, .6, lab(220, 300, '#f4efe0', (c, W, H) => { c.fillStyle = '#2a7ab8'; c.fillRect(0, 0, W, 70); txt(c, 'FLU SHOTS', W / 2, 36, 32, '#fff'); txt(c, 'EMPLOYEE', W / 2, 120, 24, '#1e2a5a'); txt(c, 'HEALTH', W / 2, 150, 24, '#1e2a5a'); txt(c, 'OCT 3 - 14', W / 2, 200, 26, '#1f7a3a'); txt(c, 'ROOM 112', W / 2, 250, 22, '#1e2a5a'); }), 'env_poster_flu', -.8, 1.7);
    // (4) a stainless WATER fire extinguisher on its bracket beside the standpipe cabinet + the FIRE HOSE label (never red: the one red stays on the pain dial)
    { const EX = [W0 - .12, -2.08]; add(new THREE.CylinderGeometry(.085, .085, .5, 20), M.chrome, 'env_extinguisher_body', 'metal', V(EX[0], EX[1], .82)); add(new THREE.SphereGeometry(.085, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.chrome, 'env_extinguisher_dome', 'metal', V(EX[0], EX[1], 1.07));
      box(.04, .04, .1, steelDk, 'env_extinguisher_valve', 'metal', EX[0], EX[1], 1.18); bar([EX[0], EX[1], 1.2], [EX[0] - .08, EX[1], 1.22], .008, steelDk, 'env_extinguisher_handle'); bar([EX[0] - .03, EX[1] + .02, 1.16], [EX[0] - .09, EX[1] + .06, .7], .01, ink, 'env_extinguisher_hose');
      add(new THREE.CylinderGeometry(.087, .087, .12, 20, 1, true), M.paint('#f4f2ea'), 'env_extinguisher_label', 'paper', V(EX[0], EX[1], .82)); onR(.1, .05, lab(96, 48, '#f4f2ea', (c, W, H) => txt(c, 'WATER', W / 2, H / 2, 22, '#1e2a5a')), 'env_extinguisher_label_txt', EX[1], .82, EX[0] - .089);
      box(.06, .1, .08, steelDk, 'env_extinguisher_bracket', 'metal', W0 - .03, EX[1], 1.0); onR(.4, .07, lab(256, 44, '#f4f2ea', (c, W, H) => txt(c, 'FIRE HOSE', W / 2, H / 2, 30, '#1e2a2a')), 'env_fire_hose_label', -2.6, 1.72, W0 - .172); }
    // (5) LIGHT POOLS on the block under each caged lamp (soft warm wall glow; flat decals on the wall, never a sphere near the lens)
    { const pT = canvasTex(THREE, 128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h * .3, 2, w / 2, h * .45, w * .55); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
      const pM = op => new THREE.MeshBasicMaterial({ map: pT, color: EV ? '#ffc890' : '#ffe2b0', transparent: true, opacity: pl.lamps === false ? 0 : op, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
      onR(1.6, 1.8, pM(.22), 'env_lamp_pool_ground', -1.6, 2.1, W0 - .02); onR(1.6, 1.8, pM(.2), 'env_lamp_pool_landing', LAND_Y + .9, LANDZ + 1.7, W0 - .02); onL(1.6, 1.8, pM(.18), 'env_lamp_pool_storey2', -1.0, S2Z + 1.8, -W0 + .02); }
    // (6) wear: more heel scuffs + a cart-bumper rub line on the left wall and the cupboard end wall; black heel marks on the lowest risers
    for (let k = 0; k < 18; k++) { const left = k < 9, sc = add(new THREE.PlaneGeometry(rr(.05, .22), rr(.006, .016)), new THREE.MeshBasicMaterial({ color: '#3e362e', transparent: true, opacity: .28, depthWrite: false }), 'env_wall_scuff', 'mark', left ? V(-W0 + .015, k % 2 ? rr(-4.3, -2.9) : rr(-1.5, -.3), rr(.15, .9)) : V(rr(-1.9, -.3), -.008, rr(.15, .8)), root, false); if (left) sc.rotation.y = Math.PI / 2; sc.rotation.z = rr(-.3, .3); }
    box(.006, 1.4, .035, M.paint('#8a8a80'), 'env_bumper_rub_left', 'mark', -W0 + .008, -3.7, .3, root, false);
    for (let i = 0; i < 4; i++) for (let k = 0; k < 3; k++) { const hm = add(new THREE.PlaneGeometry(rr(.04, .1), rr(.008, .02)), new THREE.MeshBasicMaterial({ color: '#2a2622', transparent: true, opacity: .35, depthWrite: false }), 'env_riser_heel_mark', 'mark', V(rr(.5, 1.7), i * RUN - .006, (i + 1) * RISE - rr(.03, .1)), root, false); }
    // (7) PLANT on the half landing (schefflera in a glazed pot, saucer), corner by the window: leaves tremble out of phase
    { const PX = 1.65, PY = Y1 - .35, PZ = LANDZ; add(new THREE.CylinderGeometry(.2, .15, .34, 18), M.plasticOf ? M.plasticOf('#2f6f96') : toon('#2f6f96'), 'env_landing_plant_pot', 'ceramic', V(PX, PY, PZ + .17)); add(new THREE.CylinderGeometry(.21, .2, .03, 18), toon('#2a4a5a'), 'env_plant_saucer', 'ceramic', V(PX, PY, PZ + .015));
      add(new THREE.CylinderGeometry(.18, .18, .02, 16), toon('#4a3a2a'), 'env_plant_soil', 'stone', V(PX, PY, PZ + .33)); const lm = [toon('#3f8a3a'), toon('#5aa848'), toon('#2f6a32'), toon('#7ab84a')], lv = [];
      for (let s = 0; s < 6; s++) { const a = s * 1.05 + .3, top = [PX + Math.cos(a) * .22, PY + Math.sin(a) * .18, PZ + .9 + (s % 3) * .2]; bar([PX, PY, PZ + .33], top, .009, toon('#6a5a3a'), 'env_plant_stem', 'plant');
        for (let k = 0; k < 7; k++) { const b = k / 7 * Math.PI * 2, lf = add(new THREE.SphereGeometry(.07, 8, 6), lm[(s + k) % 4], 'env_plant_leaf', 'plant', V(top[0] + Math.cos(b) * .09, top[1] + Math.sin(b) * .09, top[2] - .02)); lf.scale.set(1, .22, .45); lf.rotation.set(rr(-.4, .4), -b, rr(-.3, .3)); lv.push({ lf, r: lf.rotation.x, ph: rr(0, 6) }); } }
      envT.push(t => lv.forEach(o => { o.lf.rotation.x = o.r + .05 * Math.sin(t * 1.6 + o.ph); })); }
    // (8) THE VIEW OUT of the tall window: live-oak canopy + the visitor parking with 1990s cars and lamp posts (afternoon gold / evening coral with lit sodium lamps)
    { const vT = canvasTex(THREE, 1024, 512, (c, W, H) => { c.clearRect(0, 0, W, H); let s = 5; const R = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
        c.fillStyle = EV ? '#6a5a6a' : '#8a8a84'; c.fillRect(0, H * .5, W, H * .5); c.fillStyle = EV ? '#d8c8b8' : '#f4f2ea'; for (let x = 20; x < W; x += 64) { c.fillRect(x, H * .6, 4, 46); c.fillRect(x + 10, H * .78, 4, 46); }
        const cc = ['#e8e0c8', '#3a6ab8', '#f4f4f0', '#2f7a5a', '#b8bec4', '#d8c090', '#2a4a7a'];
        for (let k = 0; k < 26; k++) { const row = k % 2, x = 30 + (k >> 1) * 76 + R() * 10, y = H * (row ? .82 : .64); if (R() < .2) continue; c.fillStyle = cc[k % cc.length]; c.beginPath(); c.roundRect ? c.roundRect(x, y, 54, 26, 8) : c.rect(x, y, 54, 26); c.fill(); c.fillStyle = 'rgba(40,60,80,.75)'; c.fillRect(x + 12, y + 4, 30, 9); c.fillStyle = '#1e1e22'; c.fillRect(x + 6, y + 23, 10, 6); c.fillRect(x + 38, y + 23, 10, 6); }
        for (const x of [150, 470, 790]) { c.fillStyle = '#4a4a50'; c.fillRect(x, H * .3, 5, H * .3); c.fillRect(x - 20, H * .3, 45, 5); if (EV) { c.fillStyle = '#ffb060'; c.beginPath(); c.arc(x - 16, H * .31 + 4, 9, 0, 7); c.arc(x + 20, H * .31 + 4, 9, 0, 7); c.fill(); } }
        c.fillStyle = '#2a7ab8'; c.fillRect(600, H * .42, 90, 34); txt(c, 'VISITOR', 645, H * .42 + 17, 18, '#fff');
        const tg = EV ? ['#3a4a3a', '#4a5a42', '#2e3a32'] : ['#3f7a3a', '#5a9a48', '#2f5a30', '#78a850'];
        for (let k = 0; k < 900; k++) { const x = R() * W, band = R(), y = band < .6 ? H * (.26 + R() * .2) : H * (.92 + R() * .1); c.fillStyle = tg[k % tg.length]; c.beginPath(); c.arc(x, y, 8 + R() * 16, 0, 7); c.fill(); }
        for (let k = 0; k < 9; k++) { c.fillStyle = '#4a3a2a'; c.fillRect(60 + k * 115, H * .42, 7, H * .1); } });
      const view = add(new THREE.PlaneGeometry(11, 3.6), new THREE.MeshBasicMaterial({ map: vT, transparent: true, depthWrite: false, toneMapped: false, fog: false, color: EV ? '#f0c89a' : '#fff4e0' }), 'env_window_view', 'backdrop', V(0, Y1 + 2.2, 3.4), root, false); view.castShadow = false; view.receiveShadow = false; view.renderOrder = -1; }
    // (9) VENETIAN BLINDS half down on the two outer columns of the upper lights (head rail, slats, bottom rail, cords); the bottom rail sways in the hopper draught
    { const cwid = (WIN.x1 - WIN.x0) / WIN.cols, rhh = (WIN.z1 - WIN.z0) / WIN.rows, zt = WIN.z0 + 4 * rhh - .03, zb = WIN.z0 + 2.4 * rhh, bm = M.paint(EV ? '#e8d8c0' : '#f2ece0');
      for (const c0 of [0, 3]) { const cx = WIN.x0 + (c0 + .5) * cwid, by = Y1 - .1, g = new THREE.Group(); g.name = 'env_window_blind'; root.add(g);
        box(cwid - .04, .05, .04, bm, 'env_blind_head_rail', 'metal', cx, by, zt, g, false); for (let z = zt - .05; z > zb; z -= .045) { const sl = box(cwid - .07, .045, .004, bm, 'env_blind_slat', 'metal', cx, by, z, g, true); sl.rotation.x = .55; }
        const br = box(cwid - .06, .035, .02, bm, 'env_blind_bottom_rail', 'metal', cx, by, zb, g, true); for (const dx of [-.25, .25]) bar([cx + dx, by - .02, zt], [cx + dx, by - .02, zb], .002, toon('#d8d0c0'), 'env_blind_cord', 'cloth', g, 4);
        bar([cx + cwid * .38, by - .03, zt], [cx + cwid * .38, by - .03, zb - .35], .0025, toon('#d8d0c0'), 'env_blind_pull_cord', 'cloth', g, 4); envT.push(t => { br.rotation.y = .012 * Math.sin(t * 1.1 + c0); }); } }
    // (10) FOREGROUND RAIL POSTS: a steel pipe guard in front of the cupboard end wall (three posts, two rails, foot plates) = depth at the left of the wide
    { const gy = -.38, gm = M.paint('#7a8a8e'); for (const x of [-1.85, -1.1, -.35]) { bar([x, gy, 0], [x, gy, .95], .03, gm, 'env_pipe_guard_post'); box(.12, .12, .01, steelDk, 'env_pipe_guard_foot', 'metal', x, gy, .005); for (let k = 0; k < 4; k++) add(new THREE.CylinderGeometry(.008, .008, .012, 6), steelDk, 'env_pipe_guard_bolt', 'metal', V(x + (k % 2 ? .04 : -.04), gy + (k > 1 ? .04 : -.04), .012)); add(new THREE.SphereGeometry(.032, 10, 6), gm, 'env_pipe_guard_cap', 'metal', V(x, gy, .95)); }
      for (const z of [.5, .9]) bar([-1.85, gy, z], [-.35, gy, z], .022, gm, 'env_pipe_guard_rail'); }
    // (12) SECOND LIGHT COLOUR: cool sea-green bounce off the dado at the foot (vs the warm window sun + lamps); evening: a lilac fill
    { const b = new THREE.PointLight(EV ? '#a090d0' : '#8fd8d0', EV ? .9 : 1.0, 7, 1.2); b.position.copy(V(.6, -1.6, .7)); b.name = 'env_dado_bounce'; root.add(b);
      const b2 = new THREE.PointLight(EV ? '#9a88c8' : '#a8e0e8', .6, 6, 1.2); b2.position.copy(V(-1.0, 3.4, LANDZ + .8)); b2.name = 'env_landing_bounce'; root.add(b2); }
  }
  const upd = (f, t, R) => { update(f, t, R); const tt = t ?? f / 30; for (const fn of envT) fn(tt); };
  upd(0, 0);
  return { update: upd, anchors, stations: STATIONS };
}

// SET for pitch 1 board (2026-11-16): THE BUSIEST CROSSING OF A SMALL FRISIAN TOWN (Drachten, about 2003), late-afternoon sun.
// Plan metres, Z up, Y away from the frame-0 lens. Origin = the worker's feet on the near corner, beside the hole the light came out of.
// MAIN ROAD along X (y 3..12): red bike lane y 3..4.6, lane +x y 4.6..7.6, lane -x y 7.6..10.4, red bike lane 10.4..12, dashed centre line, painted bikes.
// CROSS STREET along Y toward the lens (x 1.8..5.6), brick klinkers, zebra crossing + shark-teeth yield triangles. Near sidewalk x < 1.8, y < 3 (grey 30 cm
// tiles, kerbs). FAR sidewalk y 12..16.5, then the brick row houses with step / neck / bell gables, white frames, net curtains, iron wall anchors,
// the DROGISTERIJ (x -4.2..0.6) with its green sign and striped awning. CANAL along Y (x 6.4..11), brick quays, bollards, a moored blue sloep, lime trees,
// the main road crosses it on a bridge with white railings; far-bank houses at x 12.
// THE HOLE (HOLE) on the near corner: broken tiles, the dark pit, cut cables; cones, a red-white barrier, the big spanner, the cable drum.
// Traffic moves in update(f): a white-and-teal town bus, three 2003 hatchbacks; the far corner's light still standing, its head bagged in black plastic.
export const HOLE = [1.2, .55];
const canvasTex = (THREE, w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };

export async function build(THREE, scene, film, ctx) {
  const { B2T, toon } = ctx, V = (x, y, z) => B2T([x, y, z]);
  let seed = 23; const R0 = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * R0();
  const add = (geo, mat, name, role, p, parent = scene, shadow = true) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m; };
  const box = (sx, sy, sz, mat, name, role, x, y, z, parent = scene, shadow = true) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, role, V(x, y, z), parent, shadow);
  const bar = (a, b, r, mat, name, role = 'metal', parent = scene, segs = 8) => { const A = V(...a), Bv = V(...b), d = Bv.clone().sub(A), L = Math.max(d.length(), 1e-4), m = add(new THREE.CylinderGeometry(r, r, L, segs), mat, name, role, A.clone().addScaledVector(d, .5), parent); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); return m; };
  const flat = (w, d, mat, name, x, y, z = .005, rot = 0) => { const m = add(new THREE.PlaneGeometry(w, d), mat, name, 'floor', V(x, y, z), scene, false); m.rotation.x = -Math.PI / 2; m.rotation.z = rot; return m; };
  const basic = c => new THREE.MeshBasicMaterial({ color: c });
  const pb = ctx.pbr, steel = pb ? pb.metal('steel', { color: '#c8ced6', rough: .4, toon: '#c8ced6' }) : toon('#c8ced6');
  const relief = (k, c, o) => ctx.relief ? ctx.relief(k, c, o) : toon(c);

  // ---------- sky: clear late afternoon with lit cumulus ----------
  if (ctx.sky && ctx.sky.clouds) ctx.sky.clouds({ kind: 'clear-day', seed: 4, coverage: 1.1 });

  // ---------- ground ----------
  const asphaltT = canvasTex(THREE, 512, 512, (c, w, h) => { c.fillStyle = '#4a4f5c'; c.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { const v = 60 + R0() * 60; c.fillStyle = `rgba(${v},${v + 4},${v + 14},.55)`; c.fillRect(R0() * w, R0() * h, 2, 2); }
    c.strokeStyle = 'rgba(30,32,40,.6)'; c.lineWidth = 3; for (let k = 0; k < 4; k++) { c.beginPath(); let x = R0() * w, y = R0() * h; c.moveTo(x, y); for (let q = 0; q < 8; q++) { x += (R0() - .5) * 60; y += (R0() - .5) * 60; c.lineTo(x, y); } c.stroke(); } }, [10, 3]);
  const asph = new THREE.MeshLambertMaterial({ map: asphaltT });
  flat(80, 9, asph, 'main_road_asphalt', -10, 7.5, .002);
  const bikeT = canvasTex(THREE, 256, 64, (c, w, h) => { c.fillStyle = '#b8473a'; c.fillRect(0, 0, w, h); for (let i = 0; i < 1500; i++) { c.fillStyle = `rgba(${120 + R0() * 80},${40 + R0() * 30},${30 + R0() * 20},.5)`; c.fillRect(R0() * w, R0() * h, 2, 2); } }, [20, 1]);
  const bikeM = new THREE.MeshLambertMaterial({ map: bikeT });
  flat(80, 1.6, bikeM, 'bike_lane_near_red', -10, 3.8, .004); flat(80, 1.6, bikeM, 'bike_lane_far_red', -10, 11.2, .004);
  // painted marks: centre dashes, lane edge lines, white bicycles on the red lanes, the zebra, the shark teeth
  const paint = basic('#f2f2ea');
  for (let x = -40; x < 30; x += 3) flat(1.5, .12, paint, 'centre_dash', x, 7.6, .007);
  for (const y of [4.6, 10.4]) flat(80, .1, paint, 'lane_edge_line', -10, y, .007);
  const bikeIcon = canvasTex(THREE, 256, 160, (c) => { c.strokeStyle = '#f2f2ea'; c.lineWidth = 12; c.beginPath(); c.arc(60, 100, 40, 0, 7); c.moveTo(236, 100); c.arc(196, 100, 40, 0, 7); c.moveTo(60, 100); c.lineTo(110, 40); c.lineTo(196, 100); c.moveTo(110, 40); c.lineTo(170, 40); c.lineTo(196, 100); c.moveTo(100, 30); c.lineTo(126, 30); c.moveTo(170, 40); c.lineTo(166, 20); c.stroke(); });
  const bikeMark = new THREE.MeshBasicMaterial({ map: bikeIcon, transparent: true, depthWrite: false });
  for (const [x, y] of [[-6, 3.8], [-15, 3.8], [8.5, 11.2], [-4, 11.2]]) flat(1.3, .8, bikeMark, 'painted_bike', x, y, .008);
  // cross street: brick klinkers in herringbone, kerbs
  flat(3.8, 40, relief('brick', '#a24c38', { size: .9 }), 'cross_street_klinkers', 3.7, -17, .003);
  for (let i = 0; i < 6; i++) flat(.5, 2.6, paint, 'zebra_bar', 2.1 + i * .65, 1.5, .009);
  const tooth = new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(-.22, 0), new THREE.Vector2(.22, 0), new THREE.Vector2(0, -.55)]));
  for (let i = 0; i < 7; i++) { const m = add(tooth, paint, 'shark_tooth', 'floor', V(2.05 + i * .52, -.25, .01), scene, false); m.rotation.x = -Math.PI / 2; }
  // near sidewalk: grey 30 cm tiles
  const tileT = canvasTex(THREE, 256, 256, (c, w, h) => { const n = 8, s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const v = 168 + R0() * 26; c.fillStyle = `rgb(${v},${v - 2},${v - 8})`; c.fillRect(i * s, j * s, s, s); } c.strokeStyle = '#7d7a74'; c.lineWidth = 2; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(i * s, 0); c.lineTo(i * s, h); c.stroke(); c.beginPath(); c.moveTo(0, i * s); c.lineTo(w, i * s); c.stroke(); } }, [1, 1]);
  const tileM = rep => { const t = tileT.clone(); t.repeat.set(rep[0], rep[1]); t.needsUpdate = true; return new THREE.MeshLambertMaterial({ map: t }); };
  box(30, 33, .12, tileM([12.5, 13.8]), 'near_sidewalk_tiles', 'floor', -13.2, -13.5, .06, scene, false);
  box(4.5, 4.5, .12, tileM([1.9, 1.9]), 'near_corner_tiles', 'floor', -.45, .75, .06, scene, false);
  box(34, 4.5, .12, tileM([14, 1.9]), 'far_sidewalk_tiles', 'floor', -11, 14.25, .06, scene, false);
  box(.8, 4.5, .12, tileM([.3, 1.9]), 'quay_corner_tiles', 'floor', 6.0, 14.25, .06, scene, false);
  const kerb = toon('#d8d6cf');
  box(.15, 30, .16, kerb, 'kerb_cross_west', 'stone', 1.78, -12, .08); box(30, .15, .16, kerb, 'kerb_main_near', 'stone', -12.8, 3.0, .08); box(28, .15, .16, kerb, 'kerb_main_far', 'stone', -10, 12.0, .08);
  // ---------- THE HOLE on the near corner ----------
  const [hx, hy] = HOLE;
  add(new THREE.CircleGeometry(.42, 18), basic('#141210'), 'hole_pit', 'floor', V(hx, hy, .125), scene, false).rotation.x = -Math.PI / 2;
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, r = .46 + R0() * .14; const m = box(rr(.14, .26), rr(.1, .2), rr(.05, .1), toon(i % 2 ? '#b8b4ac' : '#9a968e'), 'hole_broken_tile', 'stone', hx + Math.cos(a) * r, hy + Math.sin(a) * r, .14); m.rotation.y = rr(-.6, .6); m.rotation.x = rr(-.3, .3); }
  for (let i = 0; i < 5; i++) { const m = add(new THREE.DodecahedronGeometry(rr(.04, .08), 0), toon('#8d887f'), 'hole_rubble', 'stone', V(hx + rr(-.9, .9), hy + rr(-.7, .5), .14)); m.rotation.set(R0() * 3, R0() * 3, 0); }
  for (const [col, d] of [['#d8322a', [.25, -.2]], ['#2a64d8', [-.2, .15]], ['#e8c020', [.05, .3]]]) { const cv = new THREE.CatmullRomCurve3([V(hx, hy, -.1), V(hx + d[0] * .4, hy + d[1] * .4, .3), V(hx + d[0], hy + d[1], .22), V(hx + d[0] * 1.6, hy + d[1] * 1.5, .14)]); add(new THREE.TubeGeometry(cv, 20, .018, 6), toon(col), 'hole_cut_cable', 'cable'); }
  // cones, the red-white barrier, the spanner, the cable drum
  const cone = (x, y) => { const g = new THREE.Group(); g.position.copy(V(x, y, .12)); scene.add(g); add(new THREE.ConeGeometry(.17, .62, 16), toon('#f26a1c'), 'cone', 'plastic', V(0, 0, .33), g); add(new THREE.CylinderGeometry(.112, .143, .11, 16), toon('#f4f4f0'), 'cone_reflect_band', 'plastic', V(0, 0, .33), g); add(new THREE.BoxGeometry(.4, .04, .4), toon('#2a2a30'), 'cone_foot', 'plastic', V(0, 0, .02), g); };
  cone(2.15, -1.2); cone(-1.2, 2.35); cone(2.3, 2.5);
  const bw = canvasTex(THREE, 512, 64, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#f4f4f0' : '#d81e1e'; c.beginPath(); c.moveTo(i * 64, 0); c.lineTo(i * 64 + 64, 0); c.lineTo(i * 64 + 32, h); c.lineTo(i * 64 - 32, h); c.fill(); } });
  box(2.2, .05, .22, new THREE.MeshLambertMaterial({ map: bw }), 'barrier_board', 'plastic', -1.0, 2.55, .85);
  for (const x of [-2.0, 0.0]) { bar([x, 2.55, .12], [x, 2.55, .95], .03, toon('#f4f4f0'), 'barrier_leg'); box(.5, .3, .06, toon('#2a2a30'), 'barrier_foot', 'plastic', x, 2.55, .15); }
  const span = new THREE.Group(); span.position.copy(V(-.6, -.35, .135)); span.rotation.y = .6; scene.add(span); add(new THREE.BoxGeometry(.55, .025, .06), steel, 'big_spanner_handle', 'metal', V(0, 0, 0), span); add(new THREE.TorusGeometry(.06, .025, 6, 14, 5), steel, 'big_spanner_jaw', 'metal', V(.31, 0, 0), span).rotation.x = Math.PI / 2;
  const drum = new THREE.Group(); drum.position.copy(V(-2.3, -1.0, .12)); scene.add(drum); for (const s of [-.22, .22]) add(new THREE.CylinderGeometry(.45, .45, .05, 20), toon('#b5814a'), 'cable_drum_flange', 'wood', V(s, 0, .45), drum).rotation.z = Math.PI / 2; add(new THREE.CylinderGeometry(.33, .33, .42, 20), toon('#1d1d22'), 'cable_drum_coil', 'cable', V(0, 0, .45), drum).rotation.z = Math.PI / 2;

  // ---------- the far corner's light, still standing, its head bagged in black plastic + yellow tape ----------
  const fl = [-3.6, 12.5]; bar([fl[0], fl[1], .1], [fl[0], fl[1], 3.4], .06, steel, 'far_light_pole');
  for (let i = 0; i < 5; i++) bar([fl[0], fl[1], .42 + i * .1], [fl[0], fl[1], .52 + i * .1], .065, toon(i % 2 ? '#f4f4f0' : '#1f2228'), 'far_light_band');
  const bag = add(new THREE.SphereGeometry(.34, 12, 10), new THREE.MeshStandardMaterial({ color: '#16161c', roughness: .35, metalness: .1 }), 'far_light_bin_bag', 'plastic', V(fl[0], fl[1] - .05, 2.85)); bag.scale.set(.7, 1.6, .6);
  add(new THREE.TorusGeometry(.2, .025, 6, 16), toon('#f2c21c'), 'far_light_tape', 'plastic', V(fl[0], fl[1] - .05, 2.4)).rotation.x = Math.PI / 2;

  // ---------- HOUSES ----------
  const houseRow = (list, place) => { for (const h of list) house(h, place); };
  const glassT = canvasTex(THREE, 64, 128, (c, w, h) => { const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#9cc4e8'); g.addColorStop(.45, '#2e4a72'); g.addColorStop(1, '#1d2a48'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(250,250,245,.92)'; c.fillRect(0, h * .55, w, h * .45); c.strokeStyle = 'rgba(200,200,195,.9)'; c.lineWidth = 2; for (let x = 4; x < w; x += 7) { c.beginPath(); c.moveTo(x, h * .55); c.lineTo(x, h); c.stroke(); } });
  const glass = new THREE.MeshBasicMaterial({ map: glassT }), frameM = toon('#f6f4ee'), sillM = toon('#d8d4c8'), anchorM = toon('#1c1c22');
  function house(h, place) {
    const g = new THREE.Group(); g.name = 'house_' + h.name; const W = h.w, H = h.h, gt = h.gable;
    const sh = new THREE.Shape(); sh.moveTo(-W / 2, 0); sh.lineTo(W / 2, 0);
    if (gt === 'step') { const n = 4, sw = W / 2 / (n + .5), sH = (h.top - H) / n; sh.lineTo(W / 2, H); for (let i = 0; i < n; i++) { const x = W / 2 - (i + 1) * sw; sh.lineTo(x + sw, H + (i + 1) * sH); sh.lineTo(x, H + (i + 1) * sH); } sh.lineTo(-W / 2 + n * sw, h.top); for (let i = n - 1; i >= 0; i--) { const x = -W / 2 + i * sw; sh.lineTo(x + sw, H + (i + 1) * sH); sh.lineTo(x + sw, H + i * sH); } sh.lineTo(-W / 2, H); }
    else if (gt === 'neck') { sh.lineTo(W / 2, H); sh.quadraticCurveTo(W * .3, H + .4, W * .22, H + 1.2); sh.lineTo(W * .22, h.top - .4); sh.quadraticCurveTo(0, h.top + .3, -W * .22, h.top - .4); sh.lineTo(-W * .22, H + 1.2); sh.quadraticCurveTo(-W * .3, H + .4, -W / 2, H); }
    else if (gt === 'bell') { sh.lineTo(W / 2, H); sh.bezierCurveTo(W / 2, H + 1.4, W * .18, h.top - .9, W * .16, h.top); sh.lineTo(-W * .16, h.top); sh.bezierCurveTo(-W * .18, h.top - .9, -W / 2, H + 1.4, -W / 2, H); }
    else { sh.lineTo(W / 2, h.top); sh.lineTo(-W / 2, h.top); }
    sh.lineTo(-W / 2, 0);
    const fac = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: .35, bevelEnabled: false }), h.mat); fac.name = 'facade_' + h.name; fac.userData.role = 'wall'; fac.castShadow = fac.receiveShadow = true; fac.position.z = -.35; g.add(fac);
    const body = new THREE.Mesh(new THREE.BoxGeometry(W, H, 8), h.mat); body.position.set(0, H / 2, -4.3); body.castShadow = body.receiveShadow = true; body.name = 'house_body'; g.add(body);
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(.01, W * .55, 3, 4, 1, false, Math.PI / 4), relief('tile', h.roof || '#8a3a2a', { size: 1.8 })); roof.rotation.z = Math.PI / 2; roof.rotation.y = Math.PI / 2; roof.scale.set(1, 2.6, 1); roof.position.set(0, H + 1.2, -4.4); roof.name = 'house_roof'; roof.userData.role = 'roof'; g.add(roof);
    // windows: white frames, glazing bars, net curtains, sills; a door on the ground floor
    const floors = Math.max(1, Math.floor((H - .4) / 2.9)), nw = h.nw || 2;
    for (let fI = h.shop ? 1 : 0; fI <= floors; fI++) { const wy = fI === floors && gt !== 'flat' ? H + .6 : .7 + fI * 2.9; if (fI === floors && gt === 'flat') continue; const n = fI === floors ? 1 : nw;
      for (let k = 0; k < n; k++) { const wx = n === 1 ? 0 : -W / 2 + W * (k + .5) / n; if (fI === 0 && k === 0 && !h.shop) continue; const ww = .95, wh = fI === floors ? 1.2 : 1.7;
        const gl = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh), glass); gl.position.set(wx, wy + wh / 2, .02); gl.name = 'window_glass'; g.add(gl);
        for (const [sx, sy, px, py] of [[ww + .12, .08, 0, -.04], [ww + .12, .08, 0, wh + .04], [.08, wh, -ww / 2 - .02, wh / 2], [.08, wh, ww / 2 + .02, wh / 2], [.05, wh, 0, wh / 2], [ww, .05, 0, wh * .62]]) { const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, .07), frameM); m.position.set(wx + px, wy + py, .05); m.castShadow = true; g.add(m); }
        const sill = new THREE.Mesh(new THREE.BoxGeometry(ww + .3, .07, .16), sillM); sill.position.set(wx, wy - .09, .08); sill.castShadow = true; g.add(sill);
        if (fI > 0 && R0() < .5) { const pot = new THREE.Mesh(new THREE.CylinderGeometry(.09, .07, .14, 10), toon('#c8603a')); pot.position.set(wx + rr(-.3, .3), wy + .08, .02); g.add(pot); const fl2 = new THREE.Mesh(new THREE.SphereGeometry(.12, 8, 6), toon(R0() < .5 ? '#e84a6a' : '#f2d23a')); fl2.position.set(pot.position.x, wy + .24, .02); g.add(fl2); } } }
    if (!h.shop) { const door = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.2, .06), toon(h.door || '#1f5a3a')); door.position.set(-W / 2 + W / (2 * nw), 1.1, .03); door.castShadow = true; g.add(door);
      const fan = new THREE.Mesh(new THREE.PlaneGeometry(.9, .35), glass); fan.position.set(door.position.x, 2.42, .03); g.add(fan); const slot = new THREE.Mesh(new THREE.BoxGeometry(.26, .05, .02), toon('#d9a93a')); slot.position.set(door.position.x, 1.0, .07); g.add(slot);
      const num = canvasTex(THREE, 64, 64, (c) => { c.fillStyle = '#f6f4ee'; c.fillRect(0, 0, 64, 64); c.fillStyle = '#1c2a5a'; c.font = 'bold 40px Georgia'; c.textAlign = 'center'; c.fillText(String(h.num || 7), 32, 46); }); const np = new THREE.Mesh(new THREE.PlaneGeometry(.18, .18), new THREE.MeshBasicMaterial({ map: num })); np.position.set(door.position.x + .65, 2.0, .02); g.add(np); }
    for (let k = 0; k < 2; k++) { const a = new THREE.Mesh(new THREE.BoxGeometry(.06, .5, .04), anchorM); a.position.set((k ? 1 : -1) * W * .34, H - .5, .02); a.rotation.z = .5; g.add(a); const a2 = a.clone(); a2.rotation.z = -.5; g.add(a2); }
    if (h.year) { const ys = canvasTex(THREE, 128, 48, (c) => { c.fillStyle = '#e8dcc0'; c.fillRect(0, 0, 128, 48); c.fillStyle = '#5a3a20'; c.font = 'bold 34px Georgia'; c.textAlign = 'center'; c.fillText(h.year, 64, 36); }); const yp = new THREE.Mesh(new THREE.PlaneGeometry(.6, .22), new THREE.MeshBasicMaterial({ map: ys })); yp.position.set(0, H - .2, .02); g.add(yp); }
    if (h.shop) shopFront(g, W);
    const [px, py, rot] = place(h); g.position.copy(V(px, py, .12)); g.rotation.y = rot; scene.add(g);
  }
  // the DROGISTERIJ front: big window with shelves of goods, green sign, green-white awning, a rack of bandages outside
  function shopFront(g, W) {
    const sw = canvasTex(THREE, 256, 128, (c, w, h) => { c.fillStyle = '#e8f0f2'; c.fillRect(0, 0, w, h); for (let r = 0; r < 3; r++) { c.fillStyle = '#c8b090'; c.fillRect(0, 36 + r * 40, w, 4); for (let i = 0; i < 18; i++) { c.fillStyle = ['#e84a6a', '#3a8ad8', '#f2d23a', '#ffffff', '#58b85a', '#f08a3a'][(i + r) % 6]; c.fillRect(6 + i * 14, 14 + r * 40, 10, 22); } } });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(W * .62, 2.0), new THREE.MeshBasicMaterial({ map: sw })); win.position.set(-W * .12, 1.4, .03); g.add(win);
    const door = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.3), glass); door.position.set(W * .32, 1.15, .03); g.add(door);
    const sg = canvasTex(THREE, 512, 96, (c, w, h) => { c.fillStyle = '#1f7a4a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#f2d23a'; c.lineWidth = 5; c.strokeRect(6, 6, w - 12, h - 12); c.fillStyle = '#ffffff'; c.font = 'bold 60px Georgia'; c.textAlign = 'center'; c.fillText('DROGISTERIJ', w / 2, 68); });
    const sign = new THREE.Mesh(new THREE.BoxGeometry(W * .9, .55, .08), [toon('#1f7a4a'), toon('#1f7a4a'), toon('#1f7a4a'), toon('#1f7a4a'), new THREE.MeshBasicMaterial({ map: sg }), toon('#1f7a4a')]); sign.position.set(0, 2.95, .06); g.add(sign);
    const aw = canvasTex(THREE, 256, 32, (c, w, h) => { for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#f6f4ee' : '#2a8a52'; c.fillRect(i * 16, 0, 16, h); } });
    const awn = new THREE.Mesh(new THREE.PlaneGeometry(W * .95, 1.3), new THREE.MeshLambertMaterial({ map: aw, side: THREE.DoubleSide })); awn.rotation.x = -.85; awn.position.set(0, 2.45, .45); awn.castShadow = true; g.add(awn);
  }
  const brick = (c) => relief('brick', c, { size: .92 });
  const farRow = [
    { name: 'a', w: 5.6, h: 7.4, top: 10.2, gable: 'step', mat: brick('#9c4632'), year: '1897', num: 31 },
    { name: 'b', w: 5.2, h: 6.8, top: 9.4, gable: 'bell', mat: relief('plaster', '#efe6d2'), num: 29, door: '#22406a' },
    { name: 'shop', w: 6.2, h: 7.0, top: 7.6, gable: 'flat', mat: brick('#b0563a'), shop: true },
    { name: 'c', w: 5.0, h: 7.6, top: 10.4, gable: 'neck', mat: brick('#6e3426'), year: '1911', num: 25, door: '#7a1e22' },
    { name: 'd', w: 5.4, h: 6.6, top: 9.0, gable: 'step', mat: brick('#c9a15a'), num: 23 },
    { name: 'e', w: 5.0, h: 7.2, top: 9.8, gable: 'bell', mat: brick('#9c4632'), num: 21 },
  ];
  let fx = 5.4; for (const h of farRow) { h.cx = fx - h.w / 2; fx -= h.w; }
  houseRow(farRow, h => [h.cx, 16.5, 0]);
  const westRow = [ { name: 'w1', w: 5.6, h: 7.0, top: 9.8, gable: 'neck', mat: brick('#8a3a2a'), num: 2 }, { name: 'w2', w: 5.2, h: 6.6, top: 9.2, gable: 'step', mat: brick('#a85036'), num: 4 } ];
  let wx = -8; for (const h of westRow) { h.cx = wx; wx -= h.w; } houseRow(westRow, h => [h.cx, -6.2, 0]);
  const canalRow = [ { name: 'k1', w: 5.4, h: 7.2, top: 10, gable: 'bell', mat: brick('#7a3828'), num: 1 }, { name: 'k2', w: 5.0, h: 6.8, top: 9.6, gable: 'step', mat: relief('plaster', '#f2ecd8'), num: 3, door: '#1f5a3a' }, { name: 'k3', w: 5.6, h: 7.4, top: 10.4, gable: 'neck', mat: brick('#a24c38'), num: 5 }, { name: 'k4', w: 5.2, h: 7.0, top: 9.6, gable: 'step', mat: brick('#6e3426'), num: 7 } ];
  let ky = 15.5; for (const h of canalRow) { h.cy = ky; ky += h.w; } houseRow(canalRow, h => [12.2, h.cy + h.w / 2, -Math.PI / 2]);
  let ky2 = -2.5; for (const h of [{ ...canalRow[2], name: 'k5' }, { ...canalRow[0], name: 'k6' }, { ...canalRow[1], name: 'k7' }]) { houseRow([h], () => [12.2, ky2 - h.w / 2, -Math.PI / 2]); ky2 -= h.w; }

  // ---------- CANAL ----------
  const waterT = canvasTex(THREE, 256, 512, (c, w, h) => { c.fillStyle = '#2f6a78'; c.fillRect(0, 0, w, h); for (let i = 0; i < 260; i++) { c.fillStyle = R0() < .5 ? 'rgba(170,215,230,.45)' : 'rgba(20,60,70,.5)'; c.fillRect(R0() * w, R0() * h, 20 + R0() * 50, 2); } }, [2, 8]);
  const water = add(new THREE.PlaneGeometry(4.6, 80), new THREE.MeshStandardMaterial({ map: waterT, roughness: .12, metalness: .25 }), 'canal_water', 'water', V(8.7, 5, -.55), scene, false); water.rotation.x = -Math.PI / 2;
  for (const x of [6.25, 11.15]) { box(.3, 80, .8, brick('#7a3a2a'), 'quay_wall', 'wall', x, 5, -.3); box(.4, 80, .1, toon('#bdb8ae'), 'quay_coping', 'stone', x, 5, .12); }
  for (const y of [-12, -6, 16, 22, 28]) { const b = add(new THREE.CylinderGeometry(.12, .14, .5, 12), toon('#1c1c22'), 'bollard', 'metal', V(6.0, y, .37)); add(new THREE.SphereGeometry(.13, 10, 6, 0, 7, 0, 1.6), toon('#f4f4f0'), 'bollard_cap', 'metal', V(0, .26, 0), b); }
  // bridge: deck over the water + white railings
  box(4.9, 9, .3, asph, 'bridge_deck', 'stone', 8.7, 7.5, -.05);
  for (const y of [2.85, 12.15]) { bar([6.3, y, 1.0], [11.1, y, 1.0], .05, toon('#f6f4ee'), 'bridge_rail'); bar([6.3, y, .55], [11.1, y, .55], .03, toon('#f6f4ee'), 'bridge_rail_mid'); for (let x = 6.3; x <= 11.15; x += .8) bar([x, y, .1], [x, y, 1.0], .035, toon('#f6f4ee'), 'bridge_post'); }
  flat(4.9, 1.6, bikeM, 'bridge_bike_lane', 8.7, 3.8, .12); flat(4.9, 1.6, bikeM, 'bridge_bike_lane2', 8.7, 11.2, .12);
  // the moored sloep
  const boat = new THREE.Group(); boat.position.copy(V(7.3, 20, -.45)); scene.add(boat);
  add(new THREE.BoxGeometry(1.4, .5, 4.2), toon('#2a5aa8'), 'sloep_hull', 'wood', V(0, 0, .2), boat); add(new THREE.BoxGeometry(1.45, .08, 4.25), toon('#f4f4f0'), 'sloep_rub_rail', 'wood', V(0, 0, .48), boat);
  add(new THREE.BoxGeometry(1.2, .06, 3.6), relief('wood', '#c89a5c', { size: 1.2 }), 'sloep_deck_boards', 'wood', V(0, 0, .45), boat); add(new THREE.BoxGeometry(.8, .5, .6), toon('#d8d4c8'), 'sloep_cushion', 'cloth', V(0, -1.2, .55), boat);
  // lime trees along the quays
  if (ctx.trees && ctx.trees.tree) for (const [x, y, hgt, s] of [[5.95, 19, 8.5, 3], [5.95, 26, 9, 5], [11.6, -8, 8, 7], [5.95, -10, 8.5, 9]]) ctx.trees.tree({ kind: 'oak', at: [x, y, .1], height: hgt, seed: s, crownW: 4.5 });

  // ---------- street furniture ----------
  const green = toon('#1f4a34');
  const lampPost = (x, y) => { bar([x, y, .1], [x, y, 4.2], .07, green, 'lamp_post'); bar([x, y, 4.2], [x + .5, y, 4.4], .04, green, 'lamp_arm'); add(new THREE.ConeGeometry(.28, .3, 8), green, 'lamp_hood', 'metal', V(x + .55, y, 4.45)); add(new THREE.SphereGeometry(.13, 10, 8), basic('#fff4d0'), 'lamp_globe', 'lamp', V(x + .55, y, 4.25)); };
  lampPost(-6, 2.6); lampPost(-9, 12.4); lampPost(5.85, 13.0);
  const bikeSign = canvasTex(THREE, 128, 128, (c) => { c.fillStyle = '#1f5ab4'; c.beginPath(); c.arc(64, 64, 62, 0, 7); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 6; c.beginPath(); c.arc(64, 64, 56, 0, 7); c.stroke(); c.lineWidth = 7; c.beginPath(); c.arc(38, 78, 17, 0, 7); c.moveTo(107, 78); c.arc(90, 78, 17, 0, 7); c.moveTo(38, 78); c.lineTo(60, 50); c.lineTo(90, 78); c.moveTo(60, 50); c.lineTo(82, 50); c.stroke(); });
  bar([-7.5, 12.3, .1], [-7.5, 12.3, 2.4], .035, steel, 'bike_sign_pole'); add(new THREE.CircleGeometry(.3, 24), new THREE.MeshBasicMaterial({ map: bikeSign }), 'bike_path_sign', 'sign', V(-7.5, 12.26, 2.35), scene, false);
  const bin = add(new THREE.CylinderGeometry(.24, .22, .8, 14), toon('#2a6a3a'), 'litter_bin', 'metal', V(-5.2, 13.1, .52)); add(new THREE.CylinderGeometry(.26, .26, .06, 14), toon('#1f4a34'), 'litter_bin_lid', 'metal', V(0, .43, 0), bin);
  // bike racks with black omafiets (the Dutch "granny bike": upright frame, chain guard, rear rack, dynamo lamp)
  const omafiets = (x, y, rot, col = '#1c1c22') => { const g = new THREE.Group(); g.position.copy(V(x, y, .12)); g.rotation.y = rot; scene.add(g); const fm = toon(col), tyre = toon('#141418'), chrome = steel;
    for (const s of [-.55, .55]) { add(new THREE.TorusGeometry(.33, .025, 6, 26), tyre, 'bike_tyre', 'rubber', V(s, 0, .35), g); add(new THREE.TorusGeometry(.3, .008, 4, 20), chrome, 'bike_rim', 'metal', V(s, 0, .35), g); for (let k = 0; k < 6; k++) { const sp = add(new THREE.CylinderGeometry(.004, .004, .6, 3), chrome, 'bike_spoke', 'metal', V(s, 0, .35), g); sp.rotation.x = Math.PI / 2; sp.rotation.y = k * Math.PI / 6; sp.rotation.order = 'YXZ'; } }
    const tube = (a, b, r = .022) => { const A = new THREE.Vector3(a[0], a[2], a[1]), Bv = new THREE.Vector3(b[0], b[2], b[1]), d = Bv.clone().sub(A), m = add(new THREE.CylinderGeometry(r, r, d.length(), 6), fm, 'bike_tube', 'metal', A.clone().addScaledVector(d, .5), g); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); };
    tube([-.55, 0, .35], [-.05, 0, .35]); tube([-.05, 0, .35], [-.15, 0, .9]); tube([-.05, 0, .35], [.4, 0, .82]); tube([-.55, 0, .35], [-.15, 0, .82]); tube([.4, 0, .82], [.55, 0, .35]); tube([.4, 0, .82], [.35, 0, 1.05]); tube([.2, -.25, 1.08], [.42, 0, 1.05]); tube([.2, .25, 1.08], [.42, 0, 1.05]);
    add(new THREE.BoxGeometry(.24, .05, .1), toon('#3a2418'), 'bike_saddle', 'leather', V(-.17, 0, .95), g); add(new THREE.BoxGeometry(.45, .03, .16), chrome, 'bike_rear_rack', 'metal', V(-.45, 0, .7), g); add(new THREE.BoxGeometry(.5, .1, .03), fm, 'bike_chain_guard', 'metal', V(-.3, -.05, .38), g);
    add(new THREE.CylinderGeometry(.04, .03, .07, 8), chrome, 'bike_lamp', 'metal', V(.5, 0, .82), g).rotation.z = Math.PI / 2; };
  for (let i = 0; i < 3; i++) bar([-3.9 + i * .55, 3.1 - .4, .12], [-3.9 + i * .55, 3.1 - .4, .55], .02, steel, 'bike_rack_hoop');
  omafiets(-3.7, 2.4, Math.PI / 2 - .1); omafiets(-3.2, 2.55, Math.PI / 2 + .12, '#3a2a5a');
  omafiets(-6.6, 13.3, 0.1, '#2a4a7a'); omafiets(-8.4, 13.2, -.05);

  // ---------- TRAFFIC (moves in update) ----------
  const glassDk = new THREE.MeshStandardMaterial({ color: '#28405e', roughness: .1, metalness: .3 }), tyreM = toon('#16161a'), hub = steel;
  const wheel = (g, x, z, r) => { const w = add(new THREE.CylinderGeometry(r, r, .24, 16), tyreM, 'wheel', 'rubber', new THREE.Vector3(x, r, z), g); w.rotation.x = Math.PI / 2; add(new THREE.CylinderGeometry(r * .55, r * .55, .25, 12), hub, 'wheel_hub', 'metal', new THREE.Vector3(x, r, z), g).rotation.x = Math.PI / 2; };
  const car = (col, L = 3.9) => { const g = new THREE.Group(); g.name = 'car_2003'; scene.add(g); const body = toon(col), W = 1.7;
    add(new THREE.BoxGeometry(L, .62, W), body, 'car_body', 'metal', new THREE.Vector3(0, .58, 0), g);
    const cab = add(new THREE.BoxGeometry(L * .6, .55, W * .9), body, 'car_cabin', 'metal', new THREE.Vector3(-L * .08, 1.15, 0), g);
    for (const s of [-1, 1]) add(new THREE.PlaneGeometry(L * .5, .42), glassDk, 'car_side_window', 'glass', new THREE.Vector3(-L * .08, 1.15, s * (W * .45 + .003)), g).rotation.y = s < 0 ? Math.PI : 0;
    add(new THREE.PlaneGeometry(W * .8, .45), glassDk, 'car_windscreen', 'glass', new THREE.Vector3(L * .22 + .01, 1.12, 0), g).rotation.y = Math.PI / 2;
    add(new THREE.PlaneGeometry(W * .8, .42), glassDk, 'car_rear_window', 'glass', new THREE.Vector3(-L * .38 - .01, 1.12, 0), g).rotation.y = -Math.PI / 2;
    for (const s of [-1, 1]) { add(new THREE.BoxGeometry(.05, .14, .32), basic('#fff6d8'), 'car_headlamp_lens', 'lamp', new THREE.Vector3(L / 2, .7, s * .6), g); add(new THREE.BoxGeometry(.05, .14, .28), basic('#d81e1e'), 'car_tail_lamp', 'lamp', new THREE.Vector3(-L / 2, .72, s * .6), g); add(new THREE.BoxGeometry(.12, .1, .06), body, 'car_mirror', 'metal', new THREE.Vector3(L * .2, 1.0, s * (W / 2 + .06)), g); }
    add(new THREE.BoxGeometry(.06, .16, .52), toon('#f2f2ea'), 'car_plate', 'sign', new THREE.Vector3(L / 2 + .02, .45, 0), g); add(new THREE.BoxGeometry(.06, .16, .52), toon('#f2c21c'), 'car_plate_nl', 'sign', new THREE.Vector3(-L / 2 - .02, .45, 0), g);
    for (const x of [L * .32, -L * .32]) for (const s of [-1, 1]) wheel(g, x, s * W * .45, .3);
    return g; };
  const bus = () => { const g = new THREE.Group(); g.name = 'town_bus'; scene.add(g); const L = 11.5, W = 2.5, white = toon('#f4f4f0'), teal = toon('#1a9a9a');
    add(new THREE.BoxGeometry(L, 2.6, W), white, 'bus_body', 'metal', new THREE.Vector3(0, 1.65, 0), g); add(new THREE.BoxGeometry(L + .02, .35, W + .02), teal, 'bus_teal_band', 'metal', new THREE.Vector3(0, .62, 0), g);
    add(new THREE.BoxGeometry(L - .2, .08, W + .03), teal, 'bus_teal_stripe', 'metal', new THREE.Vector3(0, 2.28, 0), g);
    for (const s of [-1, 1]) for (let i = 0; i < 7; i++) add(new THREE.PlaneGeometry(1.3, 1.0), glassDk, 'bus_window', 'glass', new THREE.Vector3(-L / 2 + 1.0 + i * 1.5, 1.85, s * (W / 2 + .005)), g).rotation.y = s < 0 ? Math.PI : 0;
    add(new THREE.PlaneGeometry(W * .9, 1.5), glassDk, 'bus_windscreen', 'glass', new THREE.Vector3(L / 2 + .01, 1.75, 0), g).rotation.y = Math.PI / 2;
    const dest = canvasTex(THREE, 512, 64, (c, w, h) => { c.fillStyle = '#121212'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffae1a'; c.font = 'bold 44px "Courier New", monospace'; c.textAlign = 'center'; c.fillText('5  CENTRUM', w / 2, 46); });
    add(new THREE.PlaneGeometry(W * .8, .3), new THREE.MeshBasicMaterial({ map: dest }), 'bus_destination', 'sign', new THREE.Vector3(L / 2 + .02, 2.7, 0), g).rotation.y = Math.PI / 2;
    add(new THREE.PlaneGeometry(2.2, .3), new THREE.MeshBasicMaterial({ map: dest }), 'bus_side_destination', 'sign', new THREE.Vector3(L / 2 - 2, 2.7, -W / 2 - .01), g).rotation.y = Math.PI;
    for (const s of [-1, 1]) add(new THREE.BoxGeometry(.06, .2, .4), basic('#fff6d8'), 'bus_headlamp_lens', 'lamp', new THREE.Vector3(L / 2 + .02, .75, s * .9), g);
    add(new THREE.BoxGeometry(.9, 2.2, .04), glassDk, 'bus_door', 'glass', new THREE.Vector3(L / 2 - 1.2, 1.45, -W / 2 - .02), g);
    add(new THREE.BoxGeometry(.6, .6, .1), toon('#2a2a30'), 'bus_mirror', 'metal', new THREE.Vector3(L / 2 + .2, 2.2, -W / 2 - .3), g);
    for (const x of [L * .32, -L * .3]) for (const s of [-1, 1]) wheel(g, x, s * W * .44, .5);
    return g; };
  // lane, start x at frame 0, speed m/s (+ = toward +x), the vehicle
  const traffic = [
    { o: bus(), y: 6.1, x0: 6.0, v: 2.0 },
    { o: car('#c8202a'), y: 9.0, x0: -5, v: -3.5 },
    { o: car('#2a58c8'), y: 6.1, x0: -9, v: 1.0 },
    { o: car('#e8e4d8', 3.6), y: 9.0, x0: -17, v: -3.6 },
    { o: car('#1f8a5a', 3.7), y: 6.1, x0: -22, v: 3.0 },
  ];
  const place = (t, f) => { const x = t.x0 + t.v * f / 30; t.o.position.copy(V(x, t.y, .02)); t.o.rotation.y = t.v < 0 ? Math.PI : 0; };
  for (const t of traffic) place(t, 0);

  // ---------- THE KEY LIGHT: one hard warm pool on the hero (late sun breaking between the gables) ----------
  const key = new THREE.SpotLight('#ffe2b0', 3.6, 0, .24, .5, 0); key.position.copy(V(-3.2, -2.6, 9.5)); key.target.position.copy(V(.4, .4, .3)); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0006; scene.add(key, key.target);

  return { update: f => { for (const t of traffic) place(t, f); }, anchors: { hole: [HOLE[0], HOLE[1], .12] } };
}

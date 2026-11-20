// SET for hooks_v2 pitch 1 (2026-11-16): THE TOWN SQUARE, French Algeria 1856, golden hour. Robert-Houdin's open-air challenge stage.
// Plan metres, Z up, Y away from the camera. Origin = the stage's front-left corner on the paving, so the kit's sun shadow box covers the cast.
// FOREGROUND (bottom right): a low painted table with a brass coffee pot, a tray and tea glasses, and a clay water jar.
// MIDDLE (the action): the LOW STAGE (pine planks, nail heads, corner posts, a tricolour pleated skirt, three steps) and on its front-left corner THE TINY
// BOX (dovetailed walnut planks, brass bail handle with two mounts, eight iron corners, nail rows, a keyhole plate, a gold star painted on the front).
// BACK: the painted banner "ROBERT-HOUDIN" on two poles with a hanging brass lantern, a striped market awning with crates of oranges, whitewashed
// houses with flat roofs, parapets, blue horseshoe-arch doors and wooden window grilles, a square minaret with a green tile band, date palms, a golden sky.
// Every shader-free: kit toon / relief / pbr materials only, so no pow / sqrt on the card.
export const STAGE = { x0: -0.85, x1: 3.0, y0: -0.42, y1: 2.4 };
export async function build(THREE, scene, film, ctx) {
  const { B2T, toon } = ctx, pl = ctx.place || {}, V = (x, y, z) => B2T([x, y, z]);
  let seed = 11; const R0 = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * R0();
  const REL = (k, c, o = {}) => typeof ctx.relief === 'function' ? ctx.relief(k, c, o) : toon(c), MET = (k, o = {}) => ctx.pbr && ctx.pbr.metal ? ctx.pbr.metal(k, o) : toon(o.toon || '#888888');
  const add = (geo, mat, name, role, at, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (at) m.position.copy(at.isVector3 ? at : V(...at)); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };
  // plan box: centre (x, y, z = bottom), size (sx along x, sy along y, sz up)
  const box = (sx, sy, sz, mat, x, y, z, name = 'part', role = 'wood', parent) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, role, [x, y, z + sz / 2], parent);
  const cyl = (r0, r1, h, mat, x, y, z, name = 'part', role = 'wood', seg = 14) => add(new THREE.CylinderGeometry(r0, r1, h, seg), mat, name, role, [x, y, z + h / 2]);
  const M = { pine: REL('wood', '#c98a4a', { scale: 1.6, seed: 3 }), pineDk: toon('#7a4a24'), walnut: REL('wood', '#c07a3c', { scale: .5, seed: 7, normal: 1.4 }), walnutDk: toon('#7a4220'),
    iron: MET('iron', { toon: '#3e4460', seed: 2 }), brass: MET('brass', { toon: '#e2b04a', seed: 4 }), gold: toon('#ffcc33'), nail: toon('#3a3040'),
    blue: toon('#2f5fb8'), white: toon('#f6f2ea'), red: toon('#c8322a'), plaster: REL('plaster', '#fffaf0', { seed: 5, normal: .6 }), plasterP: REL('plaster', '#ffd8c0', { seed: 6, normal: .6 }), plasterO: REL('plaster', '#ffe49a', { seed: 8, normal: .6 }),
    door: REL('wood', '#2a7fc0', { scale: .8, seed: 9 }), doorG: REL('wood', '#2f9a7a', { scale: .8, seed: 10 }), grille: toon('#6a4022'), dark: toon('#3a2a3a'), tileG: REL('tile', '#2f9a6a', { seed: 12 }),
    clay: REL('mud', '#c8683a', { seed: 13, scale: .3 }), orange: toon('#ff9a1e'), leaf: toon('#3f8a3a'), leafDk: toon('#2a6a34'), bark: REL('bark', '#9a7048', { seed: 14 }), cloth: toon('#f4e2b8') };

  // ---------- sky: golden hour, a few big lit cumulus ----------
  if (ctx.sky && ctx.sky.on) ctx.sky.clouds({ kind: 'clear-day', seed: 31, coverage: .7, colors: { top: '#4f86d6', mid: '#8fb4e8', hor: '#ffd9a0', sun: '#ffd28a', lit: '#fff0d8', shade: '#c4a8c8', rim: '#ffe6b0' } });

  // ---------- the square's paving (big enough to reach the houses) ----------
  const pave = add(new THREE.PlaneGeometry(90, 90), REL('cobble', '#e0b47a', { seed: 2, size: 1.4 }), 'square_paving', 'ground', [0, 20, 0]); pave.rotation.x = -Math.PI / 2;
  // dust and straw on the paving, a dropped orange, a gutter line
  for (let i = 0; i < 30; i++) { const s = add(new THREE.CircleGeometry(rr(.05, .14), 6), toon(i % 3 ? '#c49a5c' : '#e8c070'), 'paving_dust', 'ground', [rr(-3, 4), rr(-3, 4), .004]); s.rotation.x = -Math.PI / 2; }
  add(new THREE.SphereGeometry(.05, 12, 10), M.orange, 'dropped_orange', 'prop', [-1.55, -1.6, .05]);

  // ---------- THE LOW STAGE ----------
  const S = STAGE, top = pl.stageTop ?? .6, W = S.x1 - S.x0, D = S.y1 - S.y0, cx = (S.x0 + S.x1) / 2, cy = (S.y0 + S.y1) / 2;
  box(W, D, .06, M.pine, cx, cy, top - .06, 'stage_deck', 'wood');
  for (let i = 1; i < 14; i++) box(W, .012, .004, M.pineDk, cx, S.y0 + i * D / 14, top, 'stage_plank_seam', 'wood');                     // plank seams
  for (let i = 0; i < 14; i++) for (const xx of [S.x0 + .06, cx, S.x1 - .06]) cyl(.009, .009, .006, M.nail, xx, S.y0 + (i + .5) * D / 14, top, 'stage_nail', 'metal', 6);
  for (const [x, y] of [[S.x0 + .05, S.y0 + .05], [S.x1 - .05, S.y0 + .05], [S.x0 + .05, S.y1 - .05], [S.x1 - .05, S.y1 - .05]]) box(.1, .1, top - .06, M.pineDk, x, y, 0, 'stage_post', 'wood');
  box(W + .04, .05, .07, M.pine, cx, S.y0 - .005, top - .07, 'stage_lip', 'wood');
  // the pleated tricolour skirt on the front and the left side (blue, white, red pleats with a gold fringe)
  const pleat = [M.blue, M.white, M.red];
  for (let i = 0; i < 27; i++) { const w = W / 27; box(w * .96, .03, top - .14, pleat[i % 3], S.x0 + (i + .5) * w, S.y0 - .03 - (i % 2) * .015, .02, 'stage_skirt_pleat', 'cloth'); }
  for (let i = 0; i < 20; i++) { const w = D / 20; box(.03, w * .96, top - .14, pleat[i % 3], S.x0 - .03 - (i % 2) * .015, S.y0 + (i + .5) * w, .02, 'stage_skirt_side', 'cloth'); }
  box(W + .06, .04, .05, M.gold, cx, S.y0 - .055, top - .14, 'stage_fringe', 'cloth'); box(.04, D, .05, M.gold, S.x0 - .055, cy, top - .14, 'stage_fringe_side', 'cloth');
  for (let k = 0; k < 3; k++) box(.7, .3, top * (k + 1) / 4, M.pine, S.x1 + .2 - k * 0, S.y0 + .5 + .3 * (2 - k), 0, 'stage_step', 'wood');     // three steps at the right end

  // ---------- THE TINY BOX (hero object) on the stage's front-left corner ----------
  const BX = pl.box || [.12, .05], bw = .26, bd = .19, bh = .16, bz = pl.boxZ ?? top, bg = new THREE.Group(); bg.name = 'tiny_box'; bg.position.copy(V(BX[0], BX[1], bz)); scene.add(bg);
  const bl = (sx, sy, sz, m, x, y, z, n, role = 'wood') => { const o = add(new THREE.BoxGeometry(sx, sz, sy), m, n, role, null, bg); o.position.set(x, z + sz / 2, -y); return o; };
  bl(bw, bd, bh, M.walnut, 0, 0, 0, 'box_body'); bl(bw + .016, bd + .016, .03, M.walnutDk, 0, 0, bh - .012, 'box_lid_rim');                // body + lid rim (the lid seam)
  for (const z of [.045, .1]) bl(bw + .004, bd + .004, .004, M.walnutDk, 0, 0, z, 'box_plank_seam');
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const z of [0, bh - .03]) { bl(.045, .006, .045, M.iron, sx * (bw / 2 - .02), sy * (bd / 2 + .002), z + .0, 'box_corner_iron', 'metal'); bl(.006, .045, .045, M.iron, sx * (bw / 2 + .002), sy * (bd / 2 - .02), z, 'box_corner_iron', 'metal'); }
  for (let i = 0; i < 5; i++) { const n = add(new THREE.SphereGeometry(.005, 6, 5), M.nail, 'box_nail', 'metal', null, bg); n.position.set(-bw / 2 + .03 + i * .05, .02, bd / 2 + .004); }
  bl(.03, .006, .04, M.brass, 0, -bd / 2 - .003, .085, 'box_keyhole_plate', 'metal'); bl(.006, .007, .016, M.dark, 0, -bd / 2 - .006, .095, 'box_keyhole');
  { const st = new THREE.Shape(); for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? .012 : .028; st[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
    const s = add(new THREE.ShapeGeometry(st), M.gold, 'box_gold_star', 'paint', null, bg); s.position.set(-.075, .085, bd / 2 + .007); }
  // the brass bail handle on the lid: two mounts and a half ring standing up (the fists close round it)
  for (const sx of [-1, 1]) bl(.03, .03, .018, M.brass, sx * .055, 0, bh, 'box_handle_mount', 'metal');
  { const h = add(new THREE.TorusGeometry(.055, .009, 10, 24, Math.PI), M.brass, 'box_handle_bail', 'metal', null, bg); h.position.set(0, bh + .014, 0); }
  bg.traverse(o => { if (o.isMesh) o.castShadow = false; });
  // contact shadow under the box (it sits dead on the planks)
  { const sh = add(new THREE.PlaneGeometry(bw + .06, bd + .06), new THREE.MeshBasicMaterial({ color: '#3a1e10', transparent: true, opacity: .45, depthWrite: false }), 'box_contact', 'fx', [BX[0], pl.boxShadowY ?? BX[1], top + .002]); sh.rotation.x = -Math.PI / 2; sh.castShadow = false; }

  // ---------- SWEAT flying off the strongman (place key sweat: [[x, y, z], ...]) ----------
  for (const [x, y, z, s] of pl.sweat || []) { const d = add(new THREE.SphereGeometry(.035 * (s || 1), 12, 10), new THREE.MeshBasicMaterial({ color: '#bfe6ff' }), 'sweat_drop', 'fx', [x, y, z]); d.scale.set(1, 1.6, 1); d.castShadow = false;
    const hi = add(new THREE.SphereGeometry(.011 * (s || 1), 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' }), 'sweat_glint', 'fx', [x - .01, y - .03, z + .02]); hi.castShadow = false; }

  // ---------- the banner on two poles, with a brass lantern ----------
  const bnY = S.y1 - .1, bnZ = pl.bannerZ ?? 3.25;
  for (const x of [S.x0 + .1, S.x1 - .1]) { cyl(.04, .05, bnZ + .55, M.pineDk, x, bnY, 0, 'banner_pole', 'wood'); add(new THREE.SphereGeometry(.07, 12, 10), M.brass, 'banner_pole_knob', 'metal', [x, bnY, bnZ + .6]); }
  { const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 192; const g = cv.getContext('2d');
    g.fillStyle = '#f6e6c0'; g.fillRect(0, 0, 1024, 192); g.fillStyle = '#2f4fa8'; g.fillRect(0, 0, 1024, 18); g.fillRect(0, 174, 1024, 18);
    g.fillStyle = '#c8322a'; g.font = 'bold 104px Georgia, "Times New Roman", serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('ROBERT-HOUDIN', 512, 100);
    g.strokeStyle = '#7a1a14'; g.lineWidth = 3; g.strokeText('ROBERT-HOUDIN', 512, 100); g.fillStyle = '#d8a020';
    for (const x of [40, 984]) { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 12 : 28; g.lineTo(x + Math.cos(a) * r, 98 + Math.sin(a) * r); } g.fill(); }
    const tex = new THREE.CanvasTexture(cv); if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    const ban = add(new THREE.PlaneGeometry(W - .3, (W - .3) * 192 / 1024), new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide }), 'banner_cloth', 'cloth', [cx, bnY - .02, bnZ]); ban.castShadow = false;
    for (let i = 0; i < 12; i++) { const t = add(new THREE.ConeGeometry(.05, .12, 4), i % 2 ? M.red : M.blue, 'banner_tassel', 'cloth', [S.x0 + .3 + i * (W - .6) / 11, bnY - .02, bnZ - (W - .3) * 96 / 1024 - .05]); t.rotation.x = Math.PI; } }
  // hanging pierced brass lantern on the left pole
  { const lx = S.x0 + .1, ly = bnY - .05, lz = bnZ - .55; cyl(.004, .004, .3, M.dark, lx + .2, ly, lz + .25, 'lantern_chain', 'metal'); box(.4, .02, .02, M.dark, lx + .1, ly, lz + .55, 'lantern_arm', 'metal');
    cyl(.07, .09, .2, M.brass, lx + .2, ly, lz, 'lantern_body', 'metal'); add(new THREE.ConeGeometry(.1, .1, 8), M.brass, 'lantern_cap', 'metal', [lx + .2, ly, lz + .25]); add(new THREE.SphereGeometry(.045, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffd27a' }), 'lantern_glow', 'fx', [lx + .2, ly, lz + .1]); }

  // ---------- the market stall behind left: striped awning on poles, crates of oranges, a basket of dates ----------
  { const ax = -3.6, ay = 5.2; for (const [dx, dy] of [[-1.2, -.7], [1.2, -.7], [-1.2, .7], [1.2, .7]]) cyl(.035, .035, 2.2, M.pineDk, ax + dx, ay + dy, 0, 'stall_pole', 'wood');
    for (let i = 0; i < 8; i++) { const a = box(2.6 / 8, 1.7, .03, i % 2 ? M.white : M.red, ax - 1.3 + (i + .5) * 2.6 / 8, ay - .1, 2.2, 'stall_awning_stripe', 'cloth'); a.rotation.x = -.18; }
    for (const [dx, dy] of [[-.7, -.4], [.1, -.45], [.8, -.3]]) { box(.55, .4, .3, M.pine, ax + dx, ay + dy, 0, 'stall_crate', 'wood'); for (let k = 0; k < 9; k++) add(new THREE.SphereGeometry(.06, 10, 8), M.orange, 'stall_orange', 'prop', [ax + dx - .18 + (k % 3) * .18, ay + dy - .12 + Math.floor(k / 3) * .12, .34]); } }

  // ---------- whitewashed houses round the square (flat roofs, parapets, horseshoe-arch doors, window grilles) ----------
  const house = (x, y, w, d, h, mat, door) => { box(w, d, h, mat, x, y, 0, 'house_wall', 'plaster'); box(w + .2, d + .2, .25, mat, x, y, h, 'house_parapet', 'plaster');
    for (let i = 0; i < Math.floor(w / 1.3); i++) box(.24, .2, .14, mat, x - w / 2 + .5 + i * 1.3, y - d / 2 - .02, h + .22, 'house_merlon', 'plaster');
    if (door) { const dx = x + rr(-w / 4, w / 4); box(1.1, .1, 2.0, door, dx, y - d / 2 - .03, 0, 'house_door', 'wood');
      const arch = add(new THREE.CylinderGeometry(.62, .62, .12, 20, 1, false, 0, Math.PI * 1.2), door, 'house_door_arch', 'wood', [dx, y - d / 2 - .03, 2.0]); arch.rotation.x = Math.PI / 2; arch.rotation.y = -Math.PI * .1;
      box(1.4, .14, .16, M.white, dx, y - d / 2 - .05, 2.65, 'house_door_lintel', 'plaster'); for (let k = 0; k < 4; k++) cyl(.025, .025, .015, M.brass, dx - .3 + k * .2, y - d / 2 - .09, 1.0, 'house_door_stud', 'metal', 6); }
    for (let i = 0; i < Math.floor(w / 2.2); i++) { const wx = x - w / 2 + 1.1 + i * 2.2, wz = h * .62; box(.7, .12, .9, M.dark, wx, y - d / 2 - .02, wz, 'house_window', 'glass');
      for (let k = 0; k < 4; k++) box(.04, .14, .9, M.grille, wx - .27 + k * .18, y - d / 2 - .06, wz, 'house_grille', 'wood'); for (let k = 0; k < 4; k++) box(.7, .14, .04, M.grille, wx, y - d / 2 - .06, wz + .1 + k * .23, 'house_grille', 'wood');
      box(.9, .2, .08, M.white, wx, y - d / 2 - .08, wz - .06, 'house_sill', 'plaster'); } };
  house(-9, 15, 6, 5, 7.5, M.plaster, M.door); house(-3.2, 16, 5.4, 5, 9, M.plasterO, M.doorG); house(2.4, 15, 5.6, 5, 7, M.plaster, M.door); house(8.2, 15.5, 6, 5, 8.5, M.plasterP, M.door);
  house(13.5, 14, 4.5, 5, 6.5, M.plaster, M.doorG); house(-14, 14, 4.5, 5, 6, M.plasterP, M.door);
  // laundry line between two roofs, a cloth awning over a door, potted geraniums on a sill
  { const pts = [], n = 16; for (let i = 0; i <= n; i++) pts.push(V(-6 + 6.2 * i / n, 12.4, 6.6 - .5 * Math.sin(Math.PI * i / n))); add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, .012, 4), M.dark, 'laundry_line', 'cloth');
    for (let i = 0; i < 6; i++) { const u = (i + 1) / 7; box(.5, .02, .7, [M.white, M.red, M.blue, M.cloth][i % 4], -6 + 6.2 * u, 12.4, 6.6 - .5 * Math.sin(Math.PI * u) - .72, 'laundry_cloth', 'cloth'); } }
  for (let i = 0; i < 4; i++) { cyl(.12, .09, .2, M.clay, 1.0 + i * .35, 12.4, 4.9, 'sill_pot', 'clay'); add(new THREE.SphereGeometry(.14, 10, 8), toon(i % 2 ? '#e8303a' : '#ff6a8a'), 'sill_geranium', 'foliage', [1.0 + i * .35, 12.4, 5.2]); }
  // the square minaret far behind: tall plaster shaft, a green tile band, a pierced gallery, a small lantern top with a gold finial
  { const mx = 4.5, my = 32; box(4.2, 4.2, 20, M.plaster, mx, my, 0, 'minaret_shaft', 'plaster'); box(4.3, 4.3, 1.2, M.tileG, mx, my, 15.5, 'minaret_tile_band', 'tile'); box(4.7, 4.7, .5, M.plaster, mx, my, 20, 'minaret_gallery', 'plaster');
    for (let i = 0; i < 3; i++) { box(.6, .12, 1.4, M.dark, mx - 1.2 + i * 1.2, my - 2.13, 12.5, 'minaret_arch', 'stone'); }
    box(2.2, 2.2, 3, M.plaster, mx, my, 20.5, 'minaret_lantern', 'plaster'); add(new THREE.ConeGeometry(1.4, 1.2, 4), M.tileG, 'minaret_roof', 'tile', [mx, my, 24.1]).rotation.y = Math.PI / 4;
    for (let i = 0; i < 3; i++) add(new THREE.SphereGeometry(.28 - i * .06, 10, 8), M.gold, 'minaret_finial', 'metal', [mx, my, 24.9 + i * .45]); }
  // far hills of the Atlas, warm in the low sun
  for (let i = 0; i < 7; i++) { const h = add(new THREE.SphereGeometry(1, 16, 10), toon(i % 2 ? '#d89a6a' : '#c08460'), 'far_hill', 'ground', [-60 + i * 22, 140 + rr(-10, 10), -4]); h.scale.set(26, 18 + rr(0, 10), 14); }

  // ---------- date palms (trunk rings, drooping fronds, date clusters) ----------
  const palm = (x, y, h, s0) => { const g = new THREE.Group(); g.name = 'date_palm'; g.position.copy(V(x, y, 0)); scene.add(g);
    for (let i = 0; i < 14; i++) { const r = .22 - i * .006, seg = add(new THREE.CylinderGeometry(r, r + .03, h / 14 * 1.02, 10), M.bark, 'palm_trunk_ring', 'bark', null, g); seg.position.set(Math.sin(i * .12 + s0) * .25 * i / 14, h * (i + .5) / 14, 0); }
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2 + s0, fr = new THREE.Group(); fr.position.set(Math.sin(s0) * .25, h, 0); fr.rotation.y = a; g.add(fr);
      for (let j = 0; j < 3; j++) { const lf = add(new THREE.SphereGeometry(1, 10, 6), j ? M.leaf : M.leafDk, 'palm_frond', 'foliage', null, fr); const t = (j + .5) / 3, L = 2.6;
        lf.position.set(L * t, .5 - 1.6 * t * t, 0); lf.scale.set(L / 3 * .62, .05, .34 - .08 * j); lf.rotation.z = -.3 - 1.0 * t; } }
    for (let k = 0; k < 4; k++) { const c = add(new THREE.SphereGeometry(.18, 8, 6), toon('#d8781e'), 'palm_dates', 'foliage', null, g); c.position.set(Math.cos(k * 1.6) * .3, h - .4, Math.sin(k * 1.6) * .3); c.scale.set(1, 1.5, 1); } };
  palm(-6.5, 10, 8.5, .3); palm(7, 9.5, 9.5, 1.4); palm(-12, 20, 10, 2.2); palm(12, 22, 9, .8);

  // ---------- FOREGROUND, bottom right: a low painted table with a brass coffee pot, a tray, tea glasses; a clay water jar ----------
  { const tx = pl.fg ? pl.fg[0] : 1.3, ty = pl.fg ? pl.fg[1] : -3.1;
    cyl(.34, .34, .05, REL('wood', '#2a7a6a', { scale: .4, seed: 21 }), tx, ty, .42, 'fg_table_top', 'wood', 24); cyl(.36, .36, .02, M.gold, tx, ty, .465, 'fg_table_rim', 'paint', 24);
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; box(.05, .05, .42, REL('wood', '#2a6a5a', { scale: .3, seed: 22 }), tx + Math.cos(a) * .26, ty + Math.sin(a) * .26, 0, 'fg_table_leg', 'wood'); }
    cyl(.28, .28, .015, M.brass, tx, ty, .47, 'fg_tray', 'metal', 28);
    cyl(.07, .1, .16, M.brass, tx - .06, ty + .05, .485, 'fg_pot_body', 'metal'); add(new THREE.ConeGeometry(.07, .1, 12), M.brass, 'fg_pot_lid', 'metal', [tx - .06, ty + .05, .7]); add(new THREE.SphereGeometry(.02, 8, 6), M.brass, 'fg_pot_knob', 'metal', [tx - .06, ty + .05, .76]);
    { const sp = add(new THREE.CylinderGeometry(.012, .02, .16, 8), M.brass, 'fg_pot_spout', 'metal', [tx + .04, ty + .05, .6]); sp.rotation.z = -.9; }
    for (let k = 0; k < 3; k++) { cyl(.025, .02, .07, new THREE.MeshLambertMaterial({ color: '#b8e0d8', transparent: true, opacity: .7 }), tx + .1 + k * .06, ty - .08 + (k % 2) * .05, .485, 'fg_tea_glass', 'glass', 10); cyl(.02, .018, .03, toon('#b8641e'), tx + .1 + k * .06, ty - .08 + (k % 2) * .05, .49, 'fg_tea', 'liquid', 10); }
    const jar = add(new THREE.SphereGeometry(.24, 18, 14), M.clay, 'fg_water_jar', 'clay', [tx + .55, ty + .2, .26]); jar.scale.set(1, 1.15, 1); cyl(.08, .11, .12, M.clay, tx + .55, ty + .2, .5, 'fg_jar_neck', 'clay');
    for (let k = 0; k < 2; k++) cyl(.245, .245, .02, toon('#7a2e1a'), tx + .55, ty + .2, .2 + k * .1, 'fg_jar_band', 'paint', 18); }

  return { update: () => {}, anchors: { box_handle: [BX[0], BX[1], top + bh + .07], stage_top: [cx, cy, top] } };
}

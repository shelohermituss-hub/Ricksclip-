// SET: THE CHATEAU KITCHEN, Reims 1816, early morning (hook builder, pitch 3 champagne, 2026-11-16).
// Plan metres, Z up, origin = floor under the middle of the table. Camera looks from -y toward +y (back wall at y 3.0).
// FRONT: a wine crate with straw and laid bottles (foreground, low right). MIDDLE: the oak kitchen table with the drilled row: six bottles UPSIDE DOWN
// in their holes (necks down, punts up, a white chalk riddling mark on each base), the hole being drilled (brace and bit, sawdust spray, curled shavings,
// sawdust heap, dust falling through), three chalk circles for the next holes, a candle stub, her cellar ledger. BACK: plastered stone wall, the tall
// small-paned window (morning light, vineyard slopes and Reims spire outside), the big stone hearth with iron crane and cauldron, the copper pot rack
// with hanging pans, a dresser with plates, stacked wine crates stencilled "REIMS 1816", an oak beam, a hanging herb bunch.
// place keys: brace { pad, crank, tip } plan points (from the widow's measured hands).
export async function build(THREE, scene, film, ctx) {
  const { B2T, toon } = ctx, pl = ctx.place || {}, V = (x, y, z) => B2T([x, y, z]);
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, rr = (a, b) => a + (b - a) * rnd();
  const add = (geo, mat, name, role, p, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };
  const box = (w, d, h, x, y, z, mat, name, role = 'wood', yaw = 0) => { const m = add(new THREE.BoxGeometry(w, h, d), mat, name, role, V(x, y, z + h / 2)); m.rotation.y = yaw; return m; };
  const bar = (a, b, r, mat, name, role = 'metal', segs = 8) => { const A = V(...a), Bv = V(...b), d = Bv.clone().sub(A), L = Math.max(d.length(), 1e-4), m = add(new THREE.CylinderGeometry(r, r, L, segs), mat, name, role, A.clone().addScaledVector(d, .5)); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); return m; };
  const tex = (w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; if (rep) t.repeat.set(rep[0], rep[1]); return t; };
  const blot = (g, x, y, r, col, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col.replace('A', a)); gr.addColorStop(1, col.replace('A', 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); };
  const RL = (k, c, o = {}) => ctx.relief ? ctx.relief(k, c, o) : toon(c), MT = (k, o = {}) => ctx.pbr ? ctx.pbr.metal(k, o) : toon(o.toon || o.color || '#3c3c44');
  const basic = (c, o = {}) => new THREE.MeshBasicMaterial({ color: c, ...o });
  const softTex = tex(64, 64, g => blot(g, 32, 32, 32, 'rgba(255,255,255,A)', 1));
  const contact = (x, y, z, rx, ry = rx, op = .45) => { const m = add(new THREE.CircleGeometry(1, 24), new THREE.MeshBasicMaterial({ map: softTex, color: '#2a140a', transparent: true, opacity: op, depthWrite: false }), 'contact_shadow', 'fx', V(x, y, z + .003)); m.rotation.x = -Math.PI / 2; m.scale.set(rx, ry, 1); m.castShadow = m.receiveShadow = false; return m; };
  const M = {
    tomette: RL('stone', '#b8603a', { size: .55, seed: 3 }), plaster: toon('#ffffff', { map: tex(1024, 1024, (g, W, H) => { g.fillStyle = '#efd8aa'; g.fillRect(0, 0, W, H); for (let i = 0; i < 120; i++) blot(g, rr(0, W), rr(0, H), rr(30, 140), rnd() < .5 ? 'rgba(214,176,120,A)' : 'rgba(250,236,204,A)', rr(.15, .45)); g.strokeStyle = 'rgba(150,110,70,.35)'; g.lineWidth = 3; for (let i = 0; i < 9; i++) { const x = rr(0, W), y = rr(0, H); g.strokeRect(x, y, rr(60, 110), rr(34, 50)); } }, [2, 1.4]) }), stone: RL('stone', '#c8b08a', { size: 1.6, seed: 5 }), stoneDk: RL('stone', '#8a7258', { size: 1.4, seed: 9 }),
    oak: RL('wood', '#b07840', { scale: .5, seed: 4 }), oakTop: RL('wood', '#c88a4c', { scale: .45, seed: 6 }), oakDk: RL('wood', '#6e4426', { scale: .6, seed: 8 }), beam: RL('wood', '#5e3a20', { scale: .9, seed: 1 }),
    crate: RL('wood', '#d0a066', { scale: .35, seed: 11 }), crateDk: RL('wood', '#a87444', { scale: .35, seed: 12 }), dresser: RL('wood', '#3f6e8a', { scale: .5, seed: 13 }),
    copper: MT('bronze', { color: '#d0703c', rough: .3, patina: 0, seed: 2, toon: '#d0703c' }), copperDk: MT('bronze', { color: '#a8502a', rough: .35, patina: 0, seed: 4, toon: '#a8502a' }),
    iron: MT('iron', { color: '#34363e', rough: .55, seed: 3, toon: '#2c2e36' }), braceM: MT('steel', { color: '#d8dee8', rough: .22, seed: 7, toon: '#d0d6e0' }), padM: RL('wood', '#e0a860', { scale: .2, seed: 31 }), steel: MT('steel', { color: '#b8bec8', rough: .3, seed: 5, toon: '#aab0ba' }), brass: MT('brass', { seed: 2, toon: '#d0a84a' }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#2f7a44', roughness: .12, metalness: 0, clearcoat: 1, clearcoatRoughness: .1, emissive: '#0c2a16', emissiveIntensity: .35 }),
    glassHi: basic('#bff0c8', { transparent: true, opacity: .55, depthWrite: false }), chalk: basic('#f6f4ee'), soot: toon('#2a2220'), straw: toon('#e2c06a'), sawdust: toon('#efc98a'), shaving: toon('#f2d29a', { side: THREE.DoubleSide }),
    hole: basic('#2a160c'), wax: toon('#f6ead0'), flame: basic('#ffd27a', { toneMapped: false }), flameHot: basic('#fff4d0', { toneMapped: false }), plate: toon('#f4f0e4'), plateRim: toon('#3d6fb0'),
    cloth: toon('#e8dcc0'), ledger: toon('#7a2e2a'), paper: toon('#f2e8cc'), herb: toon('#6f8a3a'), herb2: toon('#8a9a4a'), garlic: toon('#f2ead8'), rope: toon('#c8a870'), fire: basic('#ff9a3a', { toneMapped: false }), ember: basic('#ffd070', { toneMapped: false }),
  };
  const TABLE = { x0: -.62, x1: 1.3, y0: -.35, y1: .35, h: .64, th: .075 };

  // ---------- ROOM SHELL ----------
  const floor = add(new THREE.PlaneGeometry(14, 10), M.tomette, 'floor_tomettes', 'stone', V(.5, 0, 0)); floor.rotation.x = -Math.PI / 2; floor.castShadow = false;
  // back wall: plaster over a stone plinth, with a real window hole (x -1.9..-0.7, z 1.0..3.0)
  const WY = 3.0, WIN = { x0: -.75, x1: .55, z0: .9, z1: 3.0 };
  const wallPart = (w, h, x, z, mat, name) => { const m = box(w, .3, h, x, WY + .15, z, mat, name, 'plaster'); m.castShadow = false; return m; };
  wallPart(WIN.x0 + 5, 4.4, (-5 + WIN.x0) / 2, 0, M.plaster, 'wall_back_left'); wallPart(6.5 - WIN.x1, 4.4, (WIN.x1 + 6.5) / 2, 0, M.plaster, 'wall_back_right');
  wallPart(WIN.x1 - WIN.x0, WIN.z0, (WIN.x0 + WIN.x1) / 2, 0, M.plaster, 'wall_back_under_window'); wallPart(WIN.x1 - WIN.x0, 4.4 - WIN.z1, (WIN.x0 + WIN.x1) / 2, WIN.z1, M.plaster, 'wall_back_over_window');
  { const p = box(11.5, .06, .55, .75, WY - .02, 0, M.stoneDk, 'wall_plinth_stone', 'stone'); p.castShadow = false; }
  // side walls (mostly out of frame; give depth at the frame edges)
  { const l = box(.3, 6, 4.4, -2.9, 0, 0, M.plaster, 'wall_left', 'plaster'); l.castShadow = false; const r = box(.3, 6, 4.4, 3.6, 0, 0, M.plaster, 'wall_right', 'plaster'); r.castShadow = false; }
  // oak ceiling beams
  for (const x of [-2, -.5, 1, 2.5]) { const b = box(.26, 6.2, .3, x, 0, 3.85, M.beam, 'ceiling_beam'); b.castShadow = false; }
  { const b = box(7, .3, .32, .5, WY - .16, 3.55, M.beam, 'wall_plate_beam'); b.castShadow = false; }

  // ---------- THE WINDOW (tall, small panes, deep sill, morning glow, vineyard outside) ----------
  const out = tex(1024, 1024, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#7fb2e6'); gr.addColorStop(.48, '#ffe8c4'); gr.addColorStop(.62, '#ffd49a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    blot(g, W * .3, H * .5, W * .45, 'rgba(255,246,220,A)', .9);
    g.fillStyle = '#c8b8d0'; g.fillRect(W * .64, H * .32, 14, H * .28); g.beginPath(); g.moveTo(W * .64 - 4, H * .32); g.lineTo(W * .64 + 7, H * .2); g.lineTo(W * .64 + 18, H * .32); g.fill();   // Reims spire, far
    g.fillRect(W * .58, H * .44, W * .14, H * .16);
    for (let k = 0; k < 3; k++) { g.fillStyle = ['#9ab878', '#7aa25a', '#5a8a44'][k]; g.beginPath(); g.moveTo(0, H * (.56 + k * .08)); for (let x = 0; x <= W; x += 32) g.lineTo(x, H * (.56 + k * .08) - 40 * Math.sin(x * .004 + k)); g.lineTo(W, H); g.lineTo(0, H); g.fill();
      g.strokeStyle = ['#6a8a50', '#4a7238', '#3a6230'][k]; g.lineWidth = 3 + k * 2; for (let x = -200; x < W + 200; x += 26 + k * 10) { g.beginPath(); g.moveTo(x, H * (.6 + k * .08)); g.lineTo(x + 60 + k * 40, H); g.stroke(); } }
    g.fillStyle = '#f4ecd8'; for (let i = 0; i < 18; i++) g.fillRect(rr(0, W), rr(H * .62, H * .75), 3, 6); });
  { const o = add(new THREE.PlaneGeometry(6, 5), basic('#ffffff', { map: out, fog: false, toneMapped: false }), 'window_outside_vineyard', 'backdrop', V(-.1, WY + 2.2, 2.0)); o.rotation.y = 0; o.castShadow = o.receiveShadow = false; }
  const fr = M.oakDk, wz = (WIN.z0 + WIN.z1) / 2, ww = WIN.x1 - WIN.x0, wh = WIN.z1 - WIN.z0;
  box(ww + .16, .42, .07, (WIN.x0 + WIN.x1) / 2, WY - .05, WIN.z0 - .07, M.stone, 'window_sill_stone', 'stone');
  for (const x of [WIN.x0, WIN.x1]) box(.08, .12, wh, x, WY, WIN.z0, fr, 'window_frame');
  box(ww + .08, .12, .08, (WIN.x0 + WIN.x1) / 2, WY, WIN.z1 - .08, fr, 'window_frame');
  for (let i = 1; i < 3; i++) box(.035, .06, wh, WIN.x0 + ww * i / 3, WY, WIN.z0, fr, 'window_mullion');
  for (let j = 1; j < 5; j++) box(ww, .06, .035, (WIN.x0 + WIN.x1) / 2, WY, WIN.z0 + wh * j / 5, fr, 'window_glazing_bar');
  { const gl = add(new THREE.PlaneGeometry(ww, wh), new THREE.MeshBasicMaterial({ color: '#fff3d8', transparent: true, opacity: .22, depthWrite: false, toneMapped: false }), 'window_glass', 'glass', V((WIN.x0 + WIN.x1) / 2, WY + .02, wz)); gl.castShadow = false; }
  // shutters folded open against the wall (blue-grey, a French kitchen colour)
  for (const [x, s] of [[WIN.x0 - .3, -1], [WIN.x1 + .3, 1]]) { const sh = box(.5, .05, wh, x, WY - .06, WIN.z0, toon('#5f86a0'), 'window_shutter_open'); sh.castShadow = false;
    for (let j = 0; j < 6; j++) box(.46, .02, .025, x, WY - .09, WIN.z0 + .15 + j * wh / 6.2, toon('#4a6e86'), 'shutter_slat'); box(.04, .03, .04, x - s * .24, WY - .1, wz, M.iron, 'shutter_hinge', 'metal'); }
  // window light: a soft see-through shaft from the window down to the floor near the table + the light patch on the floor
  { const shaft = new THREE.MeshBasicMaterial({ map: softTex, color: '#ffe2a8', transparent: true, opacity: .16, depthWrite: false, toneMapped: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
    const g = new THREE.BufferGeometry(), a = [WIN.x0, WY, WIN.z1], b = [WIN.x1, WY, WIN.z1], c = [WIN.x1 + 1.7, -.4, 0], d = [WIN.x0 + 1.7, -.4, 0];
    const P = [a, b, c, d].map(p => V(...p)); g.setFromPoints([P[0], P[1], P[2], P[0], P[2], P[3]]); g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1], 2));
    const m = add(g, shaft, 'window_light_shaft', 'fx', null); m.castShadow = m.receiveShadow = false; m.renderOrder = 3;
    const patch = add(new THREE.PlaneGeometry(1.3, 1.6), new THREE.MeshBasicMaterial({ map: softTex, color: '#ffd89a', transparent: true, opacity: .35, depthWrite: false, blending: THREE.AdditiveBlending }), 'window_light_patch', 'fx', V(.25, -.8, .004)); patch.rotation.x = -Math.PI / 2; patch.castShadow = false; }
  // geranium pot on the sill
  { add(new THREE.CylinderGeometry(.09, .07, .14, 14), toon('#c8643a'), 'sill_flowerpot', 'stone', V(.3, WY - .1, WIN.z0 + .07)); for (let i = 0; i < 9; i++) add(new THREE.SphereGeometry(.045, 8, 6), i % 3 ? toon('#3f8a3a') : toon('#e0303a'), 'sill_geranium', 'foliage', V(.3 + rr(-.08, .08), WY - .1 + rr(-.05, .05), WIN.z0 + .2 + rr(0, .1))); }

  // ---------- THE HEARTH (right of the back wall) ----------
  const HX = 2.25;
  box(1.9, .55, .14, HX, WY - .27, 1.55, M.stone, 'hearth_mantel', 'stone');
  for (const x of [HX - .82, HX + .82]) box(.26, .5, 1.55, x, WY - .25, 0, M.stone, 'hearth_jamb', 'stone');
  { const back = box(1.38, .1, 1.5, HX, WY - .05, 0, M.soot, 'hearth_back_soot', 'stone'); back.castShadow = false; }
  box(1.5, .5, .08, HX, WY - .3, 0, M.stoneDk, 'hearth_floor', 'stone');
  box(1.75, .6, 1.3, HX, WY - .1, 1.69, M.stone, 'hearth_hood', 'stone'); box(1.85, .64, .1, HX, WY - .1, 1.69, M.oakDk, 'hearth_hood_lintel_beam');
  { const fire = []; for (let i = 0; i < 6; i++) { const lg = bar([HX - .4 + i * .14, WY - .35, .1], [HX - .3 + i * .1, WY - .1, .14], .045, M.oakDk, 'hearth_log', 'wood', 6); }
    for (let i = 0; i < 7; i++) fire.push(add(new THREE.ConeGeometry(.07 + rr(0, .05), .25 + rr(0, .2), 7), i % 2 ? M.fire : M.ember, 'hearth_flame', 'lamp', V(HX - .3 + i * .1, WY - .25, .3)));
    const pt = new THREE.PointLight('#ffa040', 2.2, 4, 1.6); pt.position.copy(V(HX, WY - .6, .5)); scene.add(pt); }
  // iron crane with a hanging cauldron over the fire
  bar([HX - .7, WY - .2, .3], [HX - .7, WY - .2, 1.3], .025, M.iron, 'crane_post'); bar([HX - .7, WY - .2, 1.2], [HX + .1, WY - .45, 1.2], .022, M.iron, 'crane_arm');
  bar([HX, WY - .42, 1.2], [HX, WY - .42, .75], .008, M.iron, 'pot_hook_chain'); { const c = add(new THREE.SphereGeometry(.22, 18, 12, 0, Math.PI * 2, Math.PI * .35, Math.PI * .65), M.iron, 'cauldron', 'metal', V(HX, WY - .42, .62)); }
  // copper pans hung along the mantel + a copper rack rail high on the wall
  bar([1.0, WY - .12, 2.35], [3.6, WY - .12, 2.35], .02, M.iron, 'pot_rail');
  [[1.2, .2], [1.6, .16], [1.95, .24], [2.4, .14], [2.75, .2], [3.1, .17], [3.45, .22]].forEach(([x, r], i) => { const z = 2.3 - r - .1;
    bar([x, WY - .12, 2.35], [x, WY - .12, z + r + .05], .01, M.iron, 'pan_hook');
    const pan = add(new THREE.CylinderGeometry(r, r * .9, r * .7, 22), i % 2 ? M.copper : M.copperDk, 'copper_pan', 'metal', V(x, WY - .2, z)); pan.rotation.x = Math.PI / 2;
    bar([x, WY - .26, z + r * .2], [x, WY - .26, z + r + .2], .016, M.brass, 'pan_handle'); });
  // mantel shelf things: brass candlesticks, a pepper mill, a salt box, a clock
  for (const x of [HX - .7, HX + .7]) { add(new THREE.CylinderGeometry(.05, .07, .22, 12), M.brass, 'mantel_candlestick', 'metal', V(x, WY - .3, 1.8)); add(new THREE.CylinderGeometry(.018, .018, .14, 8), M.wax, 'candle', 'cloth', V(x, WY - .3, 1.98)); add(new THREE.ConeGeometry(.018, .05, 8), M.flame, 'candle_flame_lens', 'lamp', V(x, WY - .3, 2.08)); }
  add(new THREE.CylinderGeometry(.05, .05, .2, 10), M.oak, 'pepper_mill', 'wood', V(HX - .3, WY - .32, 1.79)); box(.18, .12, .16, HX + .25, WY - .32, 1.69, M.dresser, 'salt_box');

  // ---------- DRESSER with plates (left of window, frame edge) and STACKED WINE CRATES (right) ----------
  { const DX = -1.6; box(.9, .45, .9, DX, WY - .3, 0, M.dresser, 'dresser_base'); box(.9, .2, 1.3, DX, WY - .1, .9, M.dresser, 'dresser_rack');
    for (let s = 0; s < 3; s++) { box(.88, .22, .03, DX, WY - .2, 1.0 + s * .42, M.oakDk, 'dresser_shelf'); for (let i = 0; i < 4; i++) { const p = add(new THREE.CylinderGeometry(.09, .09, .015, 20), M.plate, 'dresser_plate', 'cloth', V(DX - .32 + i * .21, WY - .26, 1.13 + s * .42)); p.rotation.x = Math.PI / 2 - .2; const rim = add(new THREE.TorusGeometry(.085, .008, 6, 22), M.plateRim, 'plate_rim', 'cloth', V(DX - .32 + i * .21, WY - .27, 1.13 + s * .42)); rim.rotation.x = -.2; } } }
  const stencil = (txt, sub) => tex(512, 256, (g, W, H) => { g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, W, H); g.fillStyle = '#2a1a12'; g.font = '900 92px Georgia, serif'; g.textAlign = 'center'; g.fillText(txt, W / 2, H * .5); g.font = '700 60px Georgia, serif'; g.fillText(sub, W / 2, H * .82); });
  const crateAt = (x, y, z, yaw, w, d, h, lab) => { const c = box(w, d, h, x, y, z, rnd() < .5 ? M.crate : M.crateDk, 'wine_crate', 'wood', yaw);
    for (let k = 0; k < 3; k++) { const s = box(w + .01, d + .01, .022, x, y, z + h * (.15 + k * .35), M.oakDk, 'crate_slat_gap', 'wood', yaw); s.scale.y = 1; }
    if (lab) { const L = add(new THREE.PlaneGeometry(w * .8, h * .5), new THREE.MeshBasicMaterial({ map: lab, transparent: true, depthWrite: false }), 'crate_stencil', 'fx', V(x, y - d / 2 - .006, z + h * .5)); L.rotation.y = yaw; L.castShadow = false; } return c; };
  const lab1 = stencil('REIMS', '1816'), lab2 = stencil('CHAMPAGNE', 'N° 14'), lab3 = stencil('V. C. P.', 'CAVE');
  [[1.0, 2.45, 0, .05, lab1], [1.0, 2.45, .42, -.04, lab2], [3.2, 1.6, 0, .1, lab3], [3.2, 1.6, .42, -.05, lab1], [-2.2, 1.6, 0, -.08, lab1], [-2.2, 1.6, .42, .05, lab3], [-1.75, 2.1, 0, .12, lab2]].forEach(([x, y, z, yaw, lab]) => crateAt(x, y, z, yaw, .7, .45, .42, lab));
  // a riddling of the future: one bottle-laid wine rack against the back wall right of the hearth
  { const RX = 3.2; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const b = add(new THREE.CylinderGeometry(.04, .04, .28, 10), M.glass, 'rack_bottle_laid', 'glass', V(RX - .3 + c * .17, WY - .25, 1.1 + r * .17)); b.rotation.x = Math.PI / 2; }
    box(.75, .35, .05, RX - .05, WY - .25, 1.0, M.oakDk, 'rack_shelf'); box(.75, .35, .05, RX - .05, WY - .25, 1.75, M.oakDk, 'rack_shelf'); for (const x of [RX - .42, RX + .32]) box(.05, .35, .8, x, WY - .25, 1.0, M.oakDk, 'rack_side'); }
  // hanging bunch of herbs and a garlic plait from the beam
  bar([-.5, 1.6, 3.85], [-.5, 1.6, 3.2], .006, M.rope, 'herb_string', 'cloth'); for (let i = 0; i < 14; i++) bar([-.5, 1.6, 3.2], [-.5 + rr(-.14, .14), 1.6 + rr(-.08, .08), 2.85 + rr(-.05, .05)], .012, i % 2 ? M.herb : M.herb2, 'herb_sprig', 'foliage', 4);
  for (let i = 0; i < 6; i++) add(new THREE.SphereGeometry(.045, 10, 8), M.garlic, 'garlic_bulb', 'cloth', V(2.55 + rr(-.04, .04), WY - .25, 1.0 - i * .07)).scale.set(1, 1, 1.15);

  // ---------- THE TABLE (oak, trestle legs, stretcher, plank top) ----------
  const T = TABLE, tcx = (T.x0 + T.x1) / 2, tl = T.x1 - T.x0;
  for (let i = 0; i < 4; i++) { const p = box(tl, (T.y1 - T.y0) / 4 - .006, T.th, tcx, T.y0 + (i + .5) * (T.y1 - T.y0) / 4, T.h - T.th, M.oakTop, 'table_top_plank'); }
  for (const x of [T.x0 + .14, T.x1 - .14]) for (const y of [T.y0 + .1, T.y1 - .1]) { box(.09, .09, T.h - T.th, x, y, 0, M.oak, 'table_leg'); }
  box(tl - .2, .05, .12, tcx, T.y0 + .07, T.h - T.th - .12, M.oak, 'table_apron'); box(tl - .2, .05, .12, tcx, T.y1 - .07, T.h - T.th - .12, M.oak, 'table_apron');
  box(tl - .3, .06, .06, tcx, 0, .18, M.oakDk, 'table_stretcher');
  // knife scars + a wine ring stain on the top (decals)
  { const st = tex(512, 256, (g, W, H) => { g.clearRect(0, 0, W, H); g.strokeStyle = 'rgba(90,40,30,.35)'; g.lineWidth = 6; g.beginPath(); g.arc(W * .8, H * .5, 30, 0, Math.PI * 1.7); g.stroke(); g.strokeStyle = 'rgba(70,40,20,.35)'; g.lineWidth = 2; for (let i = 0; i < 14; i++) { const x = rr(0, W), y = rr(0, H); g.beginPath(); g.moveTo(x, y); g.lineTo(x + rr(-40, 40), y + rr(-8, 8)); g.stroke(); } });
    const d = add(new THREE.PlaneGeometry(tl, T.y1 - T.y0), new THREE.MeshBasicMaterial({ map: st, transparent: true, depthWrite: false }), 'table_scars', 'fx', V(tcx, 0, T.h + .002)); d.rotation.x = -Math.PI / 2; d.castShadow = false; }
  contact(tcx, 0, 0, tl * .62, .55, .35);

  // ---------- THE UPSIDE-DOWN BOTTLES IN THEIR HOLES ----------
  const bottleProfile = []; { const pts = [[0, 0], [.044, 0], [.046, .02], [.046, .17], [.04, .2], [.022, .235], [.015, .25], [.015, .3], [.019, .305], [.019, .315], [0, .315]]; for (const [r, y] of pts) bottleProfile.push(new THREE.Vector2(r, y)); }
  const bottleGeo = new THREE.LatheGeometry(bottleProfile, 22);
  const BOT_Y = -.05, BOTS = [.02, .22, .42, .62, .82, 1.02], BS = 1.35;
  const bottle = (x, y, tilt = 0) => { const g = new THREE.Group(); g.name = 'bottle_upside_down'; scene.add(g); g.position.copy(V(x, y, T.h - .045 * BS)); g.scale.setScalar(BS); g.rotation.x = .22;
    const b = add(bottleGeo, M.glass, 'bottle_glass', 'glass', null, g); b.rotation.x = Math.PI;   // neck down
    b.position.y = .315 + .0;   // base (punt) up
    const punt = add(new THREE.CircleGeometry(.04, 18), toon('#1d4a2a'), 'bottle_punt', 'glass', new THREE.Vector3(0, .316, 0), g); punt.rotation.x = -Math.PI / 2;
    const ch = add(new THREE.PlaneGeometry(.06, .012), M.chalk, 'chalk_riddling_mark', 'fx', new THREE.Vector3(0, .318, 0), g); ch.rotation.x = -Math.PI / 2; ch.rotation.z = rr(-.6, .6); ch.castShadow = false;
    const hi = add(new THREE.PlaneGeometry(.012, .13), M.glassHi, 'bottle_highlight', 'fx', new THREE.Vector3(-.026, .2, .036), g); hi.castShadow = false;
    g.rotation.z = tilt; return g; };
  BOTS.forEach((x, i) => { const hx = x, hy = BOT_Y + (i % 2 ? .03 : -.02);
    const ring = add(new THREE.RingGeometry(.016, .03, 16), M.hole, 'drilled_hole_rim', 'fx', V(hx, hy, T.h + .003)); ring.rotation.x = -Math.PI / 2; ring.castShadow = false;
    for (let k = 0; k < 5; k++) { const s = add(new THREE.SphereGeometry(.007, 5, 4), M.sawdust, 'sawdust_crumb', 'wood', V(hx + rr(-.05, .05), hy + rr(-.05, .05), T.h + .003)); s.scale.y = .4; }
    bottle(hx, hy, rr(-.03, .03)); });
  // chalk circles marking the next holes (the plan of the whole riddling table)
  [[.3, .22], [.55, .25], [.8, .22], [1.05, .24]].forEach(([x, y]) => { const c = add(new THREE.RingGeometry(.03, .038, 20), M.chalk, 'chalk_next_hole', 'fx', V(x, y, T.h + .003)); c.rotation.x = -Math.PI / 2; c.castShadow = false;
    const c2 = add(new THREE.PlaneGeometry(.05, .006), M.chalk, 'chalk_cross', 'fx', V(x, y, T.h + .004)); c2.rotation.x = -Math.PI / 2; c2.rotation.z = .8; c2.castShadow = false; });
  // more bottles waiting: upright in a basket under the table end, one lying on the top
  { const bk = add(new THREE.CylinderGeometry(.24, .2, .26, 18, 1, true), toon('#c8964e', { side: THREE.DoubleSide }), 'wicker_basket', 'wood', V(-.05, .1, .13));
    for (let i = 0; i < 8; i++) { const r = bk.geometry; } for (let k = 0; k < 6; k++) { const h = add(new THREE.TorusGeometry(.225 - k * .006, .008, 4, 22), toon('#a87638'), 'basket_weave', 'wood', V(-.05, .1, .02 + k * .045)); h.rotation.x = Math.PI / 2; }
    for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2, b = add(bottleGeo, M.glass, 'basket_bottle', 'glass', V(-.05 + Math.cos(a) * .1, .1 + Math.sin(a) * .1, .02)); b.rotation.z = rr(-.12, .12); } }
  { const g = add(bottleGeo, M.glass, 'bottle_lying', 'glass', V(.15, .27, T.h + .046)); g.rotation.z = Math.PI / 2; g.rotation.y = .4; }
  // her cellar ledger, an inkwell and quill, a candle stub in a brass saucer
  { const lb = box(.26, .2, .035, .9, .2, T.h, M.ledger, 'cellar_ledger', 'cloth', .3); box(.24, .18, .012, .9, .2, T.h + .035, M.paper, 'ledger_page', 'cloth', .3);
    add(new THREE.CylinderGeometry(.03, .035, .05, 12), toon('#2a2a3a'), 'inkwell', 'glass', V(1.12, .02, T.h + .025)); bar([1.12, .02, T.h + .05], [1.18, .07, T.h + .22], .004, toon('#f4f0e8'), 'quill', 'cloth');
    add(new THREE.CylinderGeometry(.07, .07, .012, 18), M.brass, 'candle_saucer', 'metal', V(-.2, .27, T.h + .006)); add(new THREE.CylinderGeometry(.022, .024, .08, 10), M.wax, 'candle_stub', 'cloth', V(-.2, .27, T.h + .052));
    add(new THREE.ConeGeometry(.012, .04, 8), M.flame, 'candle_flame_lens', 'lamp', V(-.2, .27, T.h + .115)); }

  // ---------- THE BRACE AND BIT, THE HOLE BEING DRILLED, SAWDUST ----------
  const BR = pl.brace || { pad: [-.3, .03, 1.15], crank: [-.42, .03, .97], tip: [-.3, .03, T.h] };
  const pad = BR.pad, tip = BR.tip, crank = BR.crank, chuckZ = tip[2] + .12, px = pad[0], py = pad[1];
  bar([tip[0], py, tip[2] - .02], [tip[0], py, chuckZ], .006, M.steel, 'auger_bit', 'metal', 6);
  for (let k = 0; k < 5; k++) { const t2 = add(new THREE.TorusGeometry(.009, .003, 4, 10), M.steel, 'auger_twist', 'metal', V(tip[0], py, tip[2] + .015 + k * .02)); t2.rotation.x = Math.PI / 2 + .5; }
  add(new THREE.CylinderGeometry(.018, .014, .06, 12), M.brass, 'brace_chuck', 'metal', V(tip[0], py, chuckZ + .03));
  const cz0 = chuckZ + .06, cz1 = pad[2] - .06, hx = crank[0];
  const IR = .021; bar([px, py, cz0], [px, py, cz0 + .03], IR, M.braceM, 'brace_iron'); bar([px, py, cz0 + .03], [hx, py, Math.min(crank[2] - .06, cz0 + .1)], IR, M.braceM, 'brace_iron');
  bar([hx, py, Math.min(crank[2] - .06, cz0 + .1)], [hx, py, crank[2] + .07], IR, M.braceM, 'brace_iron'); bar([hx, py, crank[2] + .07], [px, py, Math.max(crank[2] + .14, cz1 - .02)], IR, M.braceM, 'brace_iron'); bar([px, py, Math.max(crank[2] + .14, cz1 - .02)], [px, py, pad[2] - .03], IR, M.braceM, 'brace_iron');
  bar([hx, py, crank[2] - .07], [hx, py, crank[2] + .07], .038, M.padM, 'brace_handle_sleeve', 'wood', 12);
  { const p = add(new THREE.SphereGeometry(.075, 16, 10, 0, Math.PI * 2, 0, Math.PI * .55), M.padM, 'brace_head_pad', 'wood', V(px, py, pad[2] - .04)); add(new THREE.CylinderGeometry(.075, .06, .04, 16), M.padM, 'brace_head_pad_base', 'wood', V(px, py, pad[2] - .055)); }
  // sawdust heap round the hole, curled shavings, a spray of sawdust flying off the turning bit, dust falling under the table
  { const heap = add(new THREE.ConeGeometry(.07, .025, 16), M.sawdust, 'sawdust_heap', 'wood', V(tip[0], py, T.h + .012)); heap.scale.set(1.2, 1, 1);
    for (let i = 0; i < 6; i++) { const a = rr(0, Math.PI * 2), r = rr(.04, .12), sv = add(new THREE.TorusGeometry(.016 + rr(0, .01), .005, 4, 14, Math.PI * 1.6), M.shaving, 'wood_shaving_curl', 'wood', V(tip[0] + Math.cos(a) * r, py + Math.sin(a) * r, T.h + .012)); sv.rotation.set(rr(0, 3), rr(0, 3), rr(0, 3)); }
    for (let i = 0; i < 46; i++) { const u = rnd(), dirx = 1, d = .06 + u * .5, z = chuckZ - .05 + Math.sin(u * Math.PI) * .22 * (1 - u * .4), s = add(new THREE.SphereGeometry(.007 + rnd() * .008, 5, 4), M.sawdust, 'sawdust_flying', 'wood', V(tip[0] + dirx * d * rr(.6, 1), py + rr(-.25, .05), z)); s.castShadow = false; }
    for (let i = 0; i < 4; i++) { const s = add(new THREE.TorusGeometry(.014, .004, 4, 12, Math.PI * 1.5), M.shaving, 'shaving_flying', 'wood', V(tip[0] + rr(.08, .3), py + rr(-.2, .05), chuckZ + rr(-.02, .12))); s.rotation.set(rr(0, 3), rr(0, 3), rr(0, 3)); }
    for (let i = 0; i < 18; i++) { const s = add(new THREE.SphereGeometry(.005, 4, 3), M.sawdust, 'sawdust_falling', 'wood', V(tip[0] + rr(-.04, .04), py + rr(-.03, .03), rr(.05, T.h - .1))); s.castShadow = false; }
    const fl = add(new THREE.CircleGeometry(.14, 16), M.sawdust, 'sawdust_floor_pile', 'wood', V(tip[0], py, .004)); fl.rotation.x = -Math.PI / 2; }

  // ---------- FOREGROUND: an open wine crate with straw and laid bottles (low right, near the lens) ----------
  { const FX = .55, FY = -1.05; const c = box(.7, .45, .36, FX, FY, 0, M.crate, 'fg_wine_crate', 'wood', -.18); const lab = stencil('REIMS', '1816');
    const L = add(new THREE.PlaneGeometry(.55, .2), new THREE.MeshBasicMaterial({ map: lab, transparent: true, depthWrite: false }), 'fg_crate_stencil', 'fx', V(FX - .04, FY - .24, .2)); L.rotation.y = -.18; L.castShadow = false;
    for (let i = 0; i < 26; i++) { const a = [FX + rr(-.3, .3), FY + rr(-.18, .18), .37]; bar(a, [a[0] + rr(-.08, .08), a[1] + rr(-.06, .06), .39 + rr(0, .03)], .0035, M.straw, 'fg_straw', 'foliage', 4); }
    for (let i = 0; i < 3; i++) { const b = add(bottleGeo, M.glass, 'fg_bottle_laid', 'glass', V(FX - .22 + i * .2, FY + .02, .38)); b.rotation.z = Math.PI / 2; b.rotation.y = -.18 + rr(-.1, .1); }
    contact(FX, FY, 0, .5, .35, .4); }
  // a small three-legged stool at the left edge with a cloth and an apron-basket of corks
  { box(.36, .36, .04, -1.75, -.9, .44, M.oak, 'stool_seat'); for (const [dx, dy] of [[-.12, -.12], [.12, -.12], [0, .14]]) bar([-1.75 + dx, -.9 + dy, 0], [-1.75 + dx * .6, -.9 + dy * .6, .44], .02, M.oakDk, 'stool_leg', 'wood', 6);
    add(new THREE.CylinderGeometry(.13, .11, .1, 14), toon('#c8964e'), 'cork_bowl', 'wood', V(-1.75, -.9, .53)); for (let i = 0; i < 10; i++) { const k = add(new THREE.CylinderGeometry(.012, .012, .04, 8), toon('#d8b07a'), 'cork', 'wood', V(-1.75 + rr(-.08, .08), -.9 + rr(-.08, .08), .59)); k.rotation.set(rr(0, 2), 0, rr(0, 2)); } }
  contact(-.8, 0, 0, .35, .22, .5); contact(1.45, 1.1, 0, .45, .28, .5);

  const anchors = { tip: tip, pad: pad, bottles: [.5, BOT_Y, T.h + .2], cellar: [1.45, 1.1, 1.6], window: [(WIN.x0 + WIN.x1) / 2, WY, wz] };
  return { anchors, update: () => {} };
}

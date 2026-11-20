// SET for pitch 2 hook frame (2026-11-16): THE SCHOOL KITCHEN of a boarding secondary school in the Usambara hills, Tanganyika, 1963, an afternoon.
// Plan metres, Z up, Y away from the camera. Camera about [0, -3, 1.2] looking +Y.
// Parts: red-oxide cement floor laid in squares; back wall with a green gloss dado and limewash above; a steel-framed window (cross bars, open casement)
// with banana leaves and blue sky outside and a warm sun shaft + barred light patch on the floor; exposed timber trusses under a corrugated iron roof;
// a bare bulb on a flex; THE FRIDGE (rounded 1950s-60s cabinet, chrome handle and badge, open door with bottle racks and milk bottles, the frosted
// freezer box with its flap down, ice-cube trays, a cold blue interior light, a taped paper sign "WAIT TILL COOL!"); the wooden crate the boy stands on
// (stencilled "TANGA TEA"); the wood stove with the big aluminium pot of boiled milk steaming; a work table with a row of cooling enamel mugs and a
// ladle; a shelf of enamel plates and a tin; a blackboard "ICE CREAM DAY / 1. BOIL  2. COOL  3. FREEZE" with COOL underlined; a 1963 calendar;
// a milk churn in the near foreground.
export const CRATE = { x: 0.12, y: 0.12, top: 0.32 };
export const FRIDGE = { x: 0.80, y: 0.36, yaw: -0.62, w: 0.70, d: 0.64, h: 1.46 };

export async function build(THREE, scene, film, ctx) {
  const { B2T, toon } = ctx, pl = ctx.place || {}, V = (x, y, z) => B2T([x, y, z]), PI = Math.PI;
  let seed = 11; const R0 = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * R0();
  const add = (geo, mat, name, role, p, parent = scene, o = {}) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = o.cast ?? true; m.receiveShadow = true; parent.add(m); return m; };
  const box = (name, role, w, d, h, p, mat, parent = scene, o = {}) => add(new THREE.BoxGeometry(w, h, d), mat, name, role, V(p[0], p[1], p[2] + h / 2), parent, o);
  const rel = (k, c, o) => ctx.relief ? ctx.relief(k, c, o) : toon(c), met = (k, o) => ctx.pbr ? ctx.pbr.metal(k, o) : toon(o.color || '#aaa');
  const basic = c => new THREE.MeshBasicMaterial({ color: c });
  const textTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };

  // ---------- kit sky off; warm interior haze ----------
  scene.children.forEach(o => { if (o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.radius === 400) o.visible = false; });
  scene.background = new THREE.Color('#e9b77a'); scene.fog = new THREE.Fog('#e8b57c', 9, 30);

  // ---------- floor: red-oxide polished cement in squares ----------
  const floor = add(new THREE.PlaneGeometry(14, 12), rel('stone', '#b7452c', { size: 1.2, normal: .5, seed: 3 }), 'floor_red_cement', 'stone', V(0, 2.5, 0), scene, { cast: false }); floor.rotation.x = -PI / 2;
  const WALL_Y = 4.2, WALL_H = 3.3, WX0 = -3.4, WX1 = 3.4;
  // ---------- back wall: green gloss dado, black line, limewash above (with a window hole) ----------
  const dado = rel('plaster', '#2f8c66', { size: 4, normal: .15, seed: 5 }), lime = toon('#f4e2b8');
  const WIN = { x0: -2.15, x1: -0.75, z0: 1.25, z1: 2.65 };
  box('wall_dado', 'plaster', WX1 - WX0, .12, 1.2, [0, WALL_Y, 0], dado, scene, { cast: false }); box('wall_dado_line', 'plaster', WX1 - WX0, .13, .05, [0, WALL_Y, 1.2], basic('#1d2a22'), scene, { cast: false });
  box('wall_upper_left', 'plaster', WIN.x0 - WX0, .12, WALL_H - 1.25, [(WX0 + WIN.x0) / 2, WALL_Y, 1.25], lime, scene, { cast: false });
  box('wall_upper_right', 'plaster', WX1 - WIN.x1, .12, WALL_H - 1.25, [(WX1 + WIN.x1) / 2, WALL_Y, 1.25], lime, scene, { cast: false });
  box('wall_over_window', 'plaster', WIN.x1 - WIN.x0, .12, WALL_H - WIN.z1, [(WIN.x0 + WIN.x1) / 2, WALL_Y, WIN.z1], lime, scene, { cast: false });
  box('wall_under_window', 'plaster', WIN.x1 - WIN.x0, .12, .05, [(WIN.x0 + WIN.x1) / 2, WALL_Y, 1.2], lime, scene, { cast: false });
  // side walls (the room is closed: no empty void at the frame edges)
  for (const s of [-1, 1]) { box('wall_side', 'plaster', .12, 6, 1.2, [s * WX1, 1.2, 0], dado, scene, { cast: false }); box('wall_side_up', 'plaster', .12, 6, WALL_H - 1.2, [s * WX1, 1.2, 1.2], lime, scene, { cast: false }); }
  // ---------- the window: steel frame, cross bars, an open casement, a concrete sill; outside banana leaves, a hedge, the blue sky ----------
  const steel = toon('#2e3a3a'), cxw = (WIN.x0 + WIN.x1) / 2, czw = (WIN.z0 + WIN.z1) / 2;
  const outTex = textTex(512, 512, (g, w, h) => { const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, '#3f8fe0'); sk.addColorStop(.6, '#9fd0f4'); sk.addColorStop(1, '#fbe2a8'); g.fillStyle = sk; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,.85)'; for (const [x, y, r] of [[120, 120, 40], [170, 110, 52], [220, 128, 36], [380, 70, 30], [420, 64, 40]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    g.fillStyle = '#3d7a2a'; g.fillRect(0, 400, w, 112); g.fillStyle = '#2a5e22'; for (let i = 0; i < 22; i++) { g.beginPath(); g.arc(i * 25, 405 + 12 * Math.sin(i), 28, 0, 7); g.fill(); }
    const leaf = (x, y, a, L, c) => { g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = c; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(L * .5, -L * .28, L, 0); g.quadraticCurveTo(L * .5, L * .2, 0, 0); g.fill(); g.strokeStyle = 'rgba(30,60,20,.6)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(L, 0); g.stroke();
      g.strokeStyle = 'rgba(30,60,20,.35)'; g.lineWidth = 1.5; for (let k = 1; k < 9; k++) { g.beginPath(); g.moveTo(L * k / 9, 0); g.lineTo(L * k / 9 + 10, -L * .1); g.stroke(); } g.restore(); };
    g.fillStyle = '#6b7a3a'; g.fillRect(380, 200, 26, 312); leaf(392, 210, -2.4, 260, '#4f9a32'); leaf(392, 230, -.5, 240, '#5fae3a'); leaf(392, 205, -1.4, 200, '#7cc24a'); leaf(395, 260, .4, 210, '#3f8a2c'); leaf(380, 250, -2.9, 230, '#5a9e36');
    leaf(30, 330, -.7, 220, '#4a9030'); leaf(60, 360, -1.9, 180, '#5fae3a'); });
  const outside = add(new THREE.PlaneGeometry(2.4, 2.4), new THREE.MeshBasicMaterial({ map: outTex, fog: false }), 'window_outside_view', 'plaster', V(cxw, WALL_Y + 1.4, czw + .1), scene, { cast: false });
  outside.lookAt(V(cxw, -10, czw + .1));
  for (const x of [WIN.x0, cxw, WIN.x1]) box('window_frame_v', 'metal', .045, .07, WIN.z1 - WIN.z0, [x, WALL_Y - .02, WIN.z0], steel);
  for (const z of [WIN.z0, czw, WIN.z0 + (WIN.z1 - WIN.z0) * .25, WIN.z0 + (WIN.z1 - WIN.z0) * .75, WIN.z1]) box('window_frame_h', 'metal', WIN.x1 - WIN.x0, .07, .04, [cxw, WALL_Y - .02, z - .02], steel);
  box('window_sill', 'stone', WIN.x1 - WIN.x0 + .2, .22, .06, [cxw, WALL_Y - .12, WIN.z0 - .06], rel('stone', '#d9cfb8', { size: 1, normal: .4 }));
  { const cas = new THREE.Group(); cas.position.copy(V(WIN.x1, WALL_Y - .05, WIN.z0)); cas.rotation.y = -1.0; scene.add(cas); const wv = (WIN.x1 - cxw);
    for (const x of [0, -wv]) add(new THREE.BoxGeometry(.04, czw - WIN.z0, .04), steel, 'casement_frame', 'metal', new THREE.Vector3(x, (czw - WIN.z0) / 2, 0), cas);
    for (const y of [0, czw - WIN.z0]) add(new THREE.BoxGeometry(wv, .04, .04), steel, 'casement_frame', 'metal', new THREE.Vector3(-wv / 2, y, 0), cas);
    const gl = add(new THREE.PlaneGeometry(wv, czw - WIN.z0), new THREE.MeshBasicMaterial({ color: '#cfe8ff', transparent: true, opacity: .22, depthWrite: false }), 'casement_glass', 'glass', new THREE.Vector3(-wv / 2, (czw - WIN.z0) / 2, 0), cas, { cast: false }); }
  // warm sun shaft from the window down across the room, and the barred light patch it lays on the floor (see-through, additive)
  const shaftTex = textTex(64, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,214,150,.9)'); gr.addColorStop(1, 'rgba(255,190,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); const sx = g.createLinearGradient(0, 0, w, 0); sx.addColorStop(0, 'rgba(0,0,0,1)'); sx.addColorStop(.25, 'rgba(0,0,0,0)'); sx.addColorStop(.75, 'rgba(0,0,0,0)'); sx.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = sx; g.fillRect(0, 0, w, h); });
  const shaftMat = new THREE.MeshBasicMaterial({ map: shaftTex, transparent: true, opacity: pl.shaft ?? .32, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false });
  for (const [dx, ww] of [[-.3, .55], [.3, .55]]) { const A = V(cxw + dx, WALL_Y - .05, czw), Bp = V(cxw + dx + 1.0, 1.4, 0), L = A.distanceTo(Bp), m = add(new THREE.PlaneGeometry(ww, L), shaftMat, 'sun_shaft', 'lamp', A.clone().lerp(Bp, .5), scene, { cast: false });
    m.lookAt(V(cxw + dx + .5, -6, 1.2)); const d = Bp.clone().sub(A).normalize(); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), d); m.rotateY(.25); }
  const patchTex = textTex(256, 256, (g, w, h) => { g.fillStyle = 'rgba(255,205,130,.95)'; for (const [x, y] of [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2], [0, 3], [1, 3]]) g.fillRect(8 + x * 124, 6 + y * 62, 112, 52); });
  const patch = add(new THREE.PlaneGeometry(1.25, 1.5), new THREE.MeshBasicMaterial({ map: patchTex, transparent: true, opacity: .12, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }), 'sun_patch_floor', 'lamp', V(-0.75, 1.75, .005), scene, { cast: false }); patch.rotation.x = -PI / 2; patch.rotation.z = .35;

  // ---------- roof: timber trusses and corrugated iron (seen from below), a bare bulb on a flex ----------
  const timber = rel('wood', '#8a5a32', { size: 1.6, normal: .7 }), iron = toon('#b9c2c4');
  for (const y of [-.6, 1.6, 3.8]) { box('truss_tie_beam', 'wood', 7, .14, .18, [0, y, WALL_H], timber); for (const s of [-1, 1]) { const r = add(new THREE.BoxGeometry(3.7, .16, .12), timber, 'truss_rafter', 'wood', V(s * 1.7, y, WALL_H + .75)); r.rotation.z = s * -.42; }
    box('truss_king_post', 'wood', .12, .12, 1.45, [0, y, WALL_H + .12], timber); for (const s of [-1, 1]) { const st = add(new THREE.BoxGeometry(1.4, .1, .1), timber, 'truss_strut', 'wood', V(s * .6, y, WALL_H + .5)); st.rotation.z = s * .7; } }
  for (const s of [-1, 1]) { const sh = add(new THREE.PlaneGeometry(3.8, 6.4, 60, 1), iron, 'roof_corrugated_iron', 'metal', V(s * 1.7, 1.6, WALL_H + .84), scene, { cast: false }); sh.receiveShadow = false; sh.rotation.x = PI / 2; sh.rotation.y = s * .42; sh.material.side = THREE.DoubleSide;
    const pos = sh.geometry.attributes.position; for (let i = 0; i < pos.count; i++) pos.setZ(i, .02 * Math.sin(pos.getX(i) * 82)); sh.geometry.computeVertexNormals(); }
  add(new THREE.CylinderGeometry(.006, .006, 1.3, 6), basic('#1a1a1a'), 'bulb_flex', 'metal', V(-.3, 2.4, WALL_H - .65));
  add(new THREE.SphereGeometry(.05, 14, 10), new THREE.MeshBasicMaterial({ color: '#ffe7b0' }), 'bulb_globe', 'lamp', V(-.3, 2.4, WALL_H - 1.33));
  add(new THREE.CylinderGeometry(.022, .022, .05, 10), toon('#b08a3a'), 'bulb_holder', 'metal', V(-.3, 2.4, WALL_H - 1.28));

  // ---------- back-wall dressing: blackboard, calendar 1963, plate shelf, clock ----------
  const board = textTex(640, 420, (g, w, h) => { g.fillStyle = '#23352c'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.06)'; for (let i = 0; i < 40; i++) g.fillRect(Math.random() * w, Math.random() * h, 80, 6);
    g.fillStyle = '#f4f1e6'; g.font = 'bold 64px "Comic Sans MS", "Segoe Print", cursive'; g.fillText('ICE CREAM DAY', 40, 88); g.font = 'bold 52px "Comic Sans MS", "Segoe Print", cursive'; g.fillText('1. BOIL', 60, 175); g.fillText('2. COOL', 60, 255); g.fillText('3. FREEZE', 60, 335);
    g.strokeStyle = '#ffe36a'; g.lineWidth = 7; g.beginPath(); g.moveTo(56, 270); g.quadraticCurveTo(170, 282, 290, 266); g.stroke(); g.fillStyle = '#ffe36a'; g.fillText('!', 300, 255); });
  const BBX = pl.bbx ?? .55, BBZ = pl.bbz ?? 2.05; box('blackboard_frame', 'wood', 1.5, .05, 1.0, [BBX, WALL_Y - .07, BBZ - .5], timber); add(new THREE.PlaneGeometry(1.38, .9), new THREE.MeshToonMaterial({ map: board }), 'blackboard', 'wood', V(BBX, WALL_Y - .1, BBZ), scene, { cast: false }).lookAt(V(BBX, -10, BBZ));
  box('chalk_ledge', 'wood', 1.5, .1, .04, [BBX, WALL_Y - .12, BBZ - .52], timber); box('chalk_stick', 'cloth', .08, .015, .015, [BBX - .35, WALL_Y - .14, BBZ - .48], basic('#fbfaf2'));
  const cal = textTex(256, 360, (g, w, h) => { g.fillStyle = '#fbf6e8'; g.fillRect(0, 0, w, h); g.fillStyle = '#c0392b'; g.fillRect(0, 0, w, 110); g.fillStyle = '#fff'; g.font = 'bold 54px Arial'; g.fillText('JULY', 64, 72); g.fillStyle = '#222'; g.font = 'bold 44px Arial'; g.fillText('1963', 78, 160);
    g.font = '22px Arial'; for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) g.fillText(String(r * 7 + c + 1).padStart(2, ' '), 14 + c * 34, 200 + r * 34); });
  add(new THREE.PlaneGeometry(.32, .45), new THREE.MeshToonMaterial({ map: cal }), 'calendar_1963', 'cloth', V(-2.75, WALL_Y - .08, 1.85), scene, { cast: false }).lookAt(V(-2.75, -10, 1.85));
  box('plate_shelf', 'wood', 1.2, .22, .04, [-.05, WALL_Y - .14, 1.95], timber); for (const s of [-1, 1]) box('shelf_bracket', 'wood', .03, .18, .16, [-.05 + s * .5, WALL_Y - .14, 1.8], timber);
  for (let i = 0; i < 5; i++) { const pm = add(new THREE.CylinderGeometry(.11, .085, .025, 20), toon('#f7f4ec'), 'enamel_plate', 'metal', V(-.48 + i * .2, WALL_Y - .18, 2.1)); pm.rotation.x = PI / 2 - .2; add(new THREE.TorusGeometry(.11, .007, 6, 20), toon('#1f4fb8'), 'plate_rim', 'metal', V(-.48 + i * .2, WALL_Y - .2, 2.1)).rotation.x = -.2; }
  add(new THREE.CylinderGeometry(.08, .08, .22, 16), toon('#d4a531'), 'tin_cocoa', 'metal', V(.42, WALL_Y - .16, 2.08));
  add(new THREE.CylinderGeometry(.16, .16, .04, 24), toon('#f4efe2'), 'wall_clock', 'metal', V(-.3, WALL_Y - .08, 2.75)).rotation.x = PI / 2;
  add(new THREE.TorusGeometry(.16, .015, 6, 24), toon('#3a2a1e'), 'clock_rim', 'wood', V(-.3, WALL_Y - .1, 2.75)); box('clock_hand', 'metal', .012, .01, .11, [-.3, WALL_Y - .11, 2.75], basic('#111')); { const hh = box('clock_hand2', 'metal', .012, .01, .08, [-.3, WALL_Y - .11, 2.75], basic('#111')); hh.rotation.y = -1.2; }

  // ---------- the wood stove with the big aluminium pot of boiled milk (where the hot milk came from) ----------
  const STX = 2.25, STY = 3.2; box('stove_body', 'brick', 1.3, .8, .8, [STX, STY, 0], rel('brick', '#8d3b2a', { normal: .8 })); box('stove_top', 'metal', 1.36, .86, .05, [STX, STY, .8], met('iron', { color: '#2e2f38', toon: '#2e2f38' }));
  box('stove_door', 'metal', .36, .03, .26, [STX - .25, STY - .41, .2], met('iron', { color: '#24252c', toon: '#24252c' })); add(new THREE.PlaneGeometry(.3, .08), new THREE.MeshBasicMaterial({ color: '#ff8a2a' }), 'stove_fire_glow', 'lamp', V(STX - .25, STY - .43, .43), scene, { cast: false }).lookAt(V(STX - .25, -10, .43));
  add(new THREE.CylinderGeometry(.09, .09, 2.6, 12), met('iron', { color: '#2b2b30', toon: '#2b2b30' }), 'stove_flue', 'metal', V(STX + .4, STY + .2, 2.15));
  const alu = met('steel', { color: '#c9cfd4', rough: .35, toon: '#c9cfd4' }); add(new THREE.CylinderGeometry(.3, .27, .36, 28, 1, true), alu, 'pot_sufuria', 'metal', V(STX - .15, STY - .05, 1.03)).material.side = THREE.DoubleSide;
  add(new THREE.CircleGeometry(.29, 28), toon('#fff7e4'), 'pot_milk', 'cloth', V(STX - .15, STY - .05, 1.17)).rotation.x = -PI / 2; add(new THREE.TorusGeometry(.3, .012, 6, 28), alu, 'pot_lip', 'metal', V(STX - .15, STY - .05, 1.21)).rotation.x = PI / 2;
  // ---------- work table with cooling mugs, a jug and a ladle (the class waiting for theirs to cool) ----------
  const TX = -1.75, TY = 3.0; box('table_top', 'wood', 1.8, .75, .06, [TX, TY, .82], timber); for (const [dx, dy] of [[-.82, -.32], [.82, -.32], [-.82, .32], [.82, .32]]) box('table_leg', 'wood', .07, .07, .82, [TX + dx, TY + dy, 0], timber);
  box('table_rail', 'wood', 1.7, .03, .1, [TX, TY - .34, .7], timber);
  const { buildMug } = await import('./milk_props.js');
  for (let i = 0; i < 6; i++) { const m = buildMug(THREE, { toon, rim: ['#1f4fb8', '#1f4fb8', '#2f8a4a'][i % 3], chips: i % 3 }); m.group.position.copy(V(TX - .7 + i * .26, TY - .15 + (i % 2) * .16, .88)); m.group.scale.setScalar(1.6); scene.add(m.group); }
  add(new THREE.CylinderGeometry(.08, .11, .26, 18), toon('#f7f4ec'), 'enamel_jug', 'metal', V(TX + .62, TY + .15, 1.0)); add(new THREE.TorusGeometry(.08, .008, 6, 18), toon('#1f4fb8'), 'jug_rim', 'metal', V(TX + .62, TY + .15, 1.13)).rotation.x = PI / 2;

  // ---------- THE FRIDGE: rounded cabinet, chrome, open door, frosted freezer box, cold blue light ----------
  const Fg = new THREE.Group(); Fg.name = 'fridge'; Fg.position.copy(V(FRIDGE.x, FRIDGE.y, 0)); Fg.rotation.y = FRIDGE.yaw; scene.add(Fg);
  const FW = FRIDGE.w, FD = FRIDGE.d, FH = FRIDGE.h, T = .05, cream = met('wet', { color: '#f3efe2', rough: .3, coat: .8, toon: '#f3efe2' }), chrome = met('steel', { color: '#e2e6ea', rough: .15, toon: '#dfe3e8' });
  const L3 = (x, z, y) => new THREE.Vector3(x, z, -y);   // fridge-local: x across the front, y back (depth), z up; front faces local -y (toward the boy after yaw)
  const fb = (name, w, d, h, x, y, z, mat, role = 'metal') => add(new THREE.BoxGeometry(w, h, d), mat, name, role, L3(x, z + h / 2, y), Fg);
  fb('fridge_side_l', T, FD, FH - .12, -FW / 2 + T / 2, 0, .08, cream); fb('fridge_side_r', T, FD, FH - .12, FW / 2 - T / 2, 0, .08, cream); fb('fridge_back', FW, T, FH - .12, 0, FD / 2 - T / 2, .08, cream);
  fb('fridge_bottom', FW, FD, .1, 0, 0, .08, cream); fb('fridge_plinth', FW - .06, FD - .06, .08, 0, .02, 0, basic('#2a2a2e'));
  { const top = add(new THREE.CylinderGeometry(.16, .16, FW, 20, 1, false, 0, PI), cream, 'fridge_round_top', 'metal', L3(0, FH - .2, 0), Fg); top.rotation.z = PI / 2; top.scale.set(1, 1, FD / .32); fb('fridge_top_fill', FW, FD, .08, 0, 0, FH - .22, cream); }
  const icy = new THREE.MeshBasicMaterial({ color: '#cfe9ff' }), inner = toon('#bcd8f0'), frost = new THREE.MeshBasicMaterial({ color: '#f2fbff' });
  fb('fridge_liner', FW - 2 * T, .02, FH - .3, 0, FD / 2 - T - .01, .18, new THREE.MeshBasicMaterial({ color: '#8cc8ff' })); for (const s of [-1, 1]) fb('fridge_liner_side', .012, FD - .1, FH - .3, s * (FW / 2 - T - .007), 0, .18, new THREE.MeshBasicMaterial({ color: s < 0 ? '#a9d6ff' : '#78b8f4' }));
  // freezer box at the top: frosted walls, its little flap hanging open, two ice-cube trays, frost lumps
  const FZ0 = FH - .5, FZ1 = FH - .2; fb('freezer_box_bottom', FW - 2 * T, FD - .1, .025, 0, .02, FZ0, frost); fb('freezer_box_wall', .02, FD - .1, FZ1 - FZ0, -FW / 2 + T + .14, .02, FZ0, frost);
  fb('freezer_box_back', FW - 2 * T, .02, FZ1 - FZ0, 0, FD / 2 - T - .04, FZ0, icy);
  for (let i = 0; i < 2; i++) { fb('ice_tray', .11, .3, .03, .03 + i * .14, .12, FZ0 + .03, chrome); for (let k = 0; k < 5; k++) fb('ice_cube', .035, .035, .025, .03 + i * .14, .0 + k * .06, FZ0 + .055, icy); }
  for (let i = 0; i < 14; i++) add(new THREE.SphereGeometry(rr(.015, .035), 8, 6), frost, 'frost_lump', 'cloth', L3(rr(-FW / 2 + .07, FW / 2 - .07), FZ1 - .01, rr(-FD / 2 + .08, FD / 2 - .1)), Fg, { cast: false });
  // freezer box made to READ: a thick frosted shell with a dark icy mouth, a crusted rim, icicles, and cold vapour pouring out and down (cold against the hot steam)
  { const shell = new THREE.MeshBasicMaterial({ color: '#eef8ff' }), mouth = new THREE.MeshBasicMaterial({ color: '#3d78c4' }), rimM = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    fb('freezer_shell_top', FW - 2 * T, FD - .08, .04, 0, .0, FZ1 - .02, shell); fb('freezer_mouth_dark', FW - 2 * T - .06, .01, FZ1 - FZ0 - .05, 0, FD / 2 - T - .06, FZ0 + .025, mouth);
    for (const [w, h, x, z] of [[FW - 2 * T, .035, 0, FZ1 - .035], [FW - 2 * T, .03, 0, FZ0 - .005], [.035, FZ1 - FZ0, -FW / 2 + T + .017, FZ0], [.035, FZ1 - FZ0, FW / 2 - T - .017, FZ0]]) fb('freezer_rim_frost', w, .03, h, x, -FD / 2 + .05, z, rimM);
    for (let i = 0; i < 9; i++) { const ic = add(new THREE.ConeGeometry(.008 + .006 * (i % 3), .04 + .03 * ((i * 7) % 4), 6), rimM, 'icicle', 'glass', L3(-FW / 2 + T + .05 + i * (FW - 2 * T - .1) / 8, FZ0 - .03 - .015 * ((i * 7) % 4), -FD / 2 + .05), Fg, { cast: false }); ic.rotation.x = PI; }
    const vt = textTex(128, 256, (g) => { for (let i = 0; i < 20; i++) { const y = 16 + i * 11, x = 64 + 18 * Math.sin(i * .6), r = 14 + i * 1.6, a = .5 * Math.sin(PI * (i + 1) / 21); const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(200,232,255,${a})`); gr.addColorStop(1, 'rgba(200,232,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } });
    for (let i = 0; i < 4; i++) { const v = new THREE.Sprite(new THREE.SpriteMaterial({ map: vt, transparent: true, opacity: .55 - i * .06, depthWrite: false, fog: false })); v.name = 'freezer_cold_vapour'; v.scale.set(.18 + i * .04, .36 + i * .07, 1); v.position.copy(L3(.02 + i * .07, FZ0 - .24 - i * .06, -FD / 2 + .12)); Fg.add(v); } }
  { const flap = add(new THREE.BoxGeometry(FW - 2 * T - .02, .014, FZ1 - FZ0 - .02), chrome, 'freezer_flap_open', 'metal', L3(0, FZ0 - .02, -FD / 2 + .05 - (FZ1 - FZ0) / 2), Fg); }
  // fridge shelves with a jug and a bowl, the cold light
  for (const z of [.55, .95]) fb('fridge_shelf_wire', FW - 2 * T, FD - .12, .012, 0, .04, z, chrome);
  add(new THREE.CylinderGeometry(.06, .07, .17, 14), toon('#f7f4ec'), 'fridge_jug', 'metal', L3(-.12, 1.045, .05), Fg); add(new THREE.CylinderGeometry(.11, .07, .07, 16), toon('#e4c34a'), 'fridge_bowl', 'metal', L3(.14, .6, .08), Fg);
  add(new THREE.SphereGeometry(.03, 10, 8), new THREE.MeshBasicMaterial({ color: '#eaf6ff' }), 'fridge_lamp_globe', 'lamp', L3(.22, FZ0 - .06, .1), Fg, { cast: false });
  const glowTex = textTex(128, 128, (g, w) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(160,215,255,1)'); gr.addColorStop(.5, 'rgba(110,180,255,.4)'); gr.addColorStop(1, 'rgba(90,160,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: pl.cold ?? .8, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })); glow.name = 'fridge_cold_glow'; glow.scale.set(.75, 1.1, 1); glow.position.copy(L3(.08, .8, -FD / 2 + .2)); Fg.add(glow);
  const coldPool = add(new THREE.CircleGeometry(.9, 32), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }), 'cold_light_pool', 'lamp', L3(0, .006, -FD / 2 - .55), Fg, { cast: false }); coldPool.rotation.x = -PI / 2; coldPool.scale.set(1, 1.3, 1);
  const pLight = new THREE.PointLight('#7fc3ff', pl.coldI ?? 3.0, 2.6, 1.6); pLight.position.copy(L3(0, 1.1, -FD / 2 + .1)); Fg.add(pLight);
  // the open door: hinged at the front-right edge, swung out ~110 deg; inner panel with bottle racks and three glass milk bottles; chrome handle, badge
  { const D = new THREE.Group(); D.name = 'fridge_door'; D.position.copy(L3(FW / 2, 0, -FD / 2)); D.rotation.y = (pl.door ?? 1.85); Fg.add(D);
    const db = (name, w, d, h, x, y, z, mat) => add(new THREE.BoxGeometry(w, h, d), mat, name, 'metal', new THREE.Vector3(x, z + h / 2, -y), D);
    db('door_panel', FW, .06, FH - .14, -FW / 2, -.03, .1, cream); db('door_liner', FW - .08, .03, FH - .3, -FW / 2, .02, .18, toon('#e3eef6'));
    db('door_gasket', FW - .02, .012, FH - .18, -FW / 2, .045, .12, basic('#3a3d44'));
    for (const z of [.4, .8, 1.15]) { db('door_rack_rail', FW - .1, .012, .012, -FW / 2, .14, z + .1, chrome); db('door_rack_lip', FW - .1, .1, .015, -FW / 2, .1, z, toon('#e3eef6')); }
    for (let i = 0; i < 3; i++) { const b = add(new THREE.CylinderGeometry(.034, .04, .2, 14), new THREE.MeshToonMaterial({ color: '#fbfaf3' }), 'milk_bottle', 'glass', new THREE.Vector3(-.18 - i * .17, .52, -.1), D); add(new THREE.CylinderGeometry(.036, .036, .02, 14), toon(['#c0392b', '#d4a531', '#c0392b'][i]), 'milk_bottle_cap', 'metal', new THREE.Vector3(-.18 - i * .17, .63, -.1), D); }
    db('door_handle', .04, .05, .32, -.07, -.09, .95, chrome); db('door_handle_post', .03, .04, .03, -.07, -.065, .97, chrome); db('door_handle_post2', .03, .04, .03, -.07, -.065, 1.24, chrome);
    // the paper sign taped to the OUTSIDE of the door (faces the room once the door is open)
    const sign = textTex(400, 300, (g, w, h) => { g.fillStyle = '#fbf3d8'; g.fillRect(0, 0, w, h); g.fillStyle = '#c0392b'; g.font = 'bold 74px "Comic Sans MS", "Segoe Print", cursive'; g.fillText('WAIT', 40, 100); g.fillText('TILL COOL!', 18, 200);
      g.fillStyle = '#2a2a2a'; g.font = 'italic 34px "Comic Sans MS", cursive'; g.fillText('- Mr. Kweka', 150, 268); g.fillStyle = 'rgba(230,220,160,.75)'; g.fillRect(0, 0, 90, 26); g.fillRect(w - 90, 0, 90, 26); });
    const sp = add(new THREE.PlaneGeometry(.34, .26), new THREE.MeshToonMaterial({ map: sign, side: THREE.DoubleSide }), 'door_sign_wait_till_cool', 'cloth', new THREE.Vector3(-FW / 2, 1.18, .066), D, { cast: false }); sp.rotation.y = 0; sp.rotation.z = .05; }
  // chrome badge strip across the top front
  fb('fridge_badge_strip', FW * .5, .015, .05, 0, -FD / 2 - .008, FH - .1, chrome);

  // ---------- the crate the boy stands on: slatted wood, stencilled TANGA TEA ----------
  const crate = new THREE.Group(); crate.name = 'tea_crate'; crate.position.copy(V(CRATE.x, CRATE.y, 0)); crate.rotation.y = .18; scene.add(crate);
  const ply = rel('wood', '#c58d4e', { size: 1.2, normal: .8, seed: 9 }), CW = .62, CD = .5, CH = CRATE.top;
  add(new THREE.BoxGeometry(CW, CH, CD), ply, 'crate_body', 'wood', new THREE.Vector3(0, CH / 2, 0), crate);
  for (const y of [.03, CH - .03]) for (const s of [-1, 1]) add(new THREE.BoxGeometry(CW + .01, .045, .02), timber, 'crate_batten', 'wood', new THREE.Vector3(0, y, s * (CD / 2 + .005)), crate);
  for (const s of [-1, 1]) add(new THREE.BoxGeometry(.03, CH, .02), timber, 'crate_corner', 'wood', new THREE.Vector3(s * (CW / 2 - .015), CH / 2, -CD / 2 - .012), crate);
  const sten = textTex(320, 160, (g, w, h) => { g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(40,24,18,.85)'; g.font = 'bold 62px Impact, Arial Black, sans-serif'; g.fillText('TANGA', 52, 70); g.font = 'bold 48px Impact, Arial Black, sans-serif'; g.fillText('TEA  1st', 70, 132); });
  add(new THREE.PlaneGeometry(.5, .25), new THREE.MeshToonMaterial({ map: sten, transparent: true }), 'crate_stencil_tanga_tea', 'wood', new THREE.Vector3(0, CH / 2, CD / 2 + .013), crate, { cast: false });

  // ---------- the bench under the window (a classmate climbed on it to see) ----------
  box('bench_top', 'wood', 1.1, .32, .05, [-1.55, 3.45, .5], timber); for (const dx of [-.45, .45]) box('bench_leg', 'wood', .06, .28, .5, [-1.55 + dx, 3.45, 0], timber); box('bench_rail', 'wood', .9, .03, .06, [-1.55, 3.45, .18], timber);
  // ---------- near foreground: the aluminium milk churn (lid, handles, dents) ----------
  const churn = new THREE.Group(); churn.name = 'milk_churn'; churn.position.copy(V(-0.95, -1.15, 0)); scene.add(churn);
  const pts = [[.0, 0], [.2, 0], [.21, .02], [.21, .42], [.17, .52], [.1, .58], [.1, .66], [.12, .68], [.0, .68]].map(([r, y]) => new THREE.Vector2(r, y));
  add(new THREE.LatheGeometry(pts, 30), alu, 'churn_body', 'metal', new THREE.Vector3(0, 0, 0), churn);
  for (const s of [-1, 1]) add(new THREE.TorusGeometry(.05, .012, 6, 12, PI), alu, 'churn_handle', 'metal', new THREE.Vector3(s * .19, .5, 0), churn).rotation.z = s * -PI / 2;
  add(new THREE.TorusGeometry(.212, .01, 6, 30), alu, 'churn_ring', 'metal', new THREE.Vector3(0, .22, 0), churn).rotation.x = PI / 2;
  add(new THREE.CylinderGeometry(.13, .12, .05, 20), alu, 'churn_lid', 'metal', new THREE.Vector3(0, .7, 0), churn);
  const tag = textTex(200, 100, (g, w, h) => { g.fillStyle = '#e8d9a0'; g.fillRect(0, 0, w, h); g.fillStyle = '#2b2b2b'; g.font = 'bold 40px Arial'; g.fillText('MAZIWA', 18, 64); });
  add(new THREE.PlaneGeometry(.18, .09), new THREE.MeshToonMaterial({ map: tag, side: THREE.DoubleSide }), 'churn_tag_maziwa', 'cloth', new THREE.Vector3(.05, .32, .214), churn, { cast: false }).rotation.y = .25;

  // ---------- micro motion: the pot's steam and the window light flicker of leaves (the hook is a still, kept simple) ----------
  const steamTex = textTex(128, 256, (g) => { for (let i = 0; i < 22; i++) { const y = 240 - i * 10, x = 64 + 20 * Math.sin(i * .5), r = 18 + i * 1.2, a = .45 * Math.sin(PI * (i + 1) / 23); const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,255,255,${a})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } });
  for (let i = 0; i < 4; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, opacity: .35, depthWrite: false })); s.name = 'pot_steam'; s.scale.set(.5, 1.0, 1); s.position.copy(V(STX - .25 + i * .08, STY - .05, 1.6 + i * .12)); scene.add(s); }
  const crateTop = CRATE.top;
  return { anchors: { crate_top: [CRATE.x, CRATE.y, crateTop], freezer: [FRIDGE.x - .1, FRIDGE.y - .3, FH - .38] } };
}

// SET: casino_front (red-suit-car, 2026-11-25). Golden hour, a teal-and-gold casino front, a red convertible at the kerb.
// Plan coordinates: metres, Z up, Y away from the opening camera. The car's nose points to -x; its DRIVER side faces the camera (-y).
// HERO OBJECT: the red roadster (more than 10 named parts: clearcoat body with wheel arches, hinged driver door with chrome handle and mirror,
// chrome-framed windscreen, two cream bucket seats with headrests and gold stitching, roadster humps, steering wheel, dash with gold gauges,
// five-spoke chrome wheels with tyres, discs and calipers, headlights with chrome bezels, grille with chrome slats, gold bonnet badge,
// gold pinstripe, side vents, twin chrome exhausts, front plate "BOSS 1").
// Keys (film.json places.<p>): none needed. Timing of the door, the slam and the hat glint is in DOOR / SLAM / GLINT below (film frames).
export const DOOR = { f0: 0, a0: 16, open: [3, 20, 74], close: [104, 9], slam: 113 };   // degrees; open [start, frames, to]; close [start, frames]
export const GLINT = { f: 88, len: 16, at: [-0.07, -0.98, 1.63] };                         // the gold hat flash (one horizontal streak, CB_RULES 6 HIGHLIGHT)
export const CAR = { x: 0, y: 0.9, hingeX: -0.62, side: 0.93, doorLen: 1.17 };

export function build(THREE, scene, film, ctx) {
  const { B2T, toon } = ctx, n = {}, PI = Math.PI;
  const add = (m, name, role, o = {}) => { n[name] = (n[name] || 0) + 1; m.name = n[name] > 1 ? `${name}_${String(n[name]).padStart(2, '0')}` : name; m.userData.role = role;
    m.castShadow = o.cast ?? true; m.receiveShadow = o.recv ?? true; (o.parent || scene).add(m); return m; };
  const P = (x, y, z) => B2T([x, y, z]);
  const box = (name, role, w, d, h, at, mat, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.copy(P(at[0], at[1], at[2] + h / 2)); if (o.rot) m.rotation.y = o.rot; return add(m, name, role, o); };
  const cyl = (name, role, r, h, at, mat, o = {}) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(o.r2 ?? r, r, h, o.seg ?? 20), mat); m.position.copy(P(at[0], at[1], at[2] + h / 2)); return add(m, name, role, o); };
  const glow = c => new THREE.MeshBasicMaterial({ color: c, toneMapped: false });
  const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(7);

  // ---------- materials ----------
  const paint = ctx.pbr.metal('wet', { color: '#c4121e', rough: .16, coat: 1, coatRough: .03, env: 1.25, nscale: .05, toon: '#c4121e' });
  const chrome = ctx.pbr.metal('steel', { finish: 'smooth', rough: .07, env: 1.7, color: '#e4e8ee', toon: '#cfd6de' });
  const gold = ctx.pbr.metal('gold', { toon: '#e0a92c' });
  const brass = ctx.pbr.metal('brass', { toon: '#c99a3a' });
  const iron = ctx.pbr.metal('iron', { toon: '#2a2d36', color: '#2a2d36', rust: .1 });
  const glass = ctx.pbr.metal('wet', { color: '#1d2a38', rough: .04, env: 1.5, toon: '#9fc4d8' }); glass.transparent = true; glass.opacity = .42; glass.depthWrite = false;
  const rubber = toon('#1b1b20'), rubber2 = toon('#2b2a30'), dark = toon('#141418');
  const leather = ctx.relief('plaster', '#efe0c0', { size: .6, normal: .6, seed: 3 }), leatherD = ctx.relief('plaster', '#3a2626', { size: .5, normal: .6, seed: 4 });
  const asphalt = ctx.relief('plaster', '#6f7a96', { size: 2.4, normal: .6, seed: 11 });
  const pave = ctx.relief('stone', '#dccbaa', { normal: .8, seed: 5 }), kerbM = ctx.relief('stone', '#c9c2b4', { size: 1.2, seed: 6 });
  const wallT = ctx.relief('plaster', '#56c2b6', { size: 3, normal: .6, seed: 8 }), cream = ctx.relief('plaster', '#f1e4c6', { size: 2, seed: 9 });
  const brick = ctx.relief('brick', '#b4664a', { seed: 12 }), brick2 = ctx.relief('brick', '#8a7a9a', { seed: 13 }), wood = ctx.relief('wood', '#6e4426', { seed: 14 });
  const carpetM = ctx.relief('plaster', '#1f6f74', { size: .8, normal: .4, seed: 15 }), soil = ctx.relief('mud', '#5a3e2a', { seed: 16 });
  const warm = glow('#ffd58a'), bulb = glow('#fff2c4'), tail = glow('#ff3b2e'), head = glow('#fff6dc');

  // ---------- text on a canvas ----------
  const label = (txt, w, h, o = {}) => { const c = document.createElement('canvas'); c.width = o.px || 1024; c.height = Math.round(c.width * h / w); const g = c.getContext('2d');
    g.fillStyle = o.bg || '#00000000'; g.fillRect(0, 0, c.width, c.height); g.font = `${o.weight || 900} ${Math.round(c.height * (o.size || .72))}px ${o.font || 'Georgia, serif'}`;
    g.textAlign = 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = c.height * .06; g.strokeStyle = o.stroke; g.strokeText(txt, c.width / 2, c.height * .54); }
    g.fillStyle = o.fg || '#ffffff'; g.fillText(txt, c.width / 2, c.height * .54);
    if (o.rim) { g.strokeStyle = o.rim; g.lineWidth = c.height * .05; g.strokeRect(c.height * .05, c.height * .05, c.width - c.height * .1, c.height - c.height * .1); }
    const t = new THREE.CanvasTexture(c); t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
    return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, transparent: !o.bg, toneMapped: false })); };

  // =====================================================================
  // GROUND: the street (asphalt with relief), lane paint, kerb, pavement, teal carpet
  box('street', 'ground', 140, 16, .02, [0, -6, -.02], asphalt, { cast: false });
  for (let x = -60; x < 60; x += 4.2) box('lane_dash', 'ground', 2.2, .14, .005, [x, -4.4, 0], toon('#ece6d6'), { cast: false });
  for (const x of [-3.2, 3.2, 9.6, -9.6]) box('bay_line', 'ground', .12, 2.4, .005, [x, 0.9, 0], toon('#ece6d6'), { cast: false });
  { const v = label('VALET', 2.6, .7, { fg: '#efe8d8', font: 'Arial Black, Arial', size: .8 }); v.rotation.x = -PI / 2; v.position.copy(P(-4.8, .9, .006)); v.rotation.z = 0; add(v, 'valet_paint', 'ground', { cast: false }); }
  // patched asphalt, an oil stain and a drain: wear where cars stand (CB_RULES 11i)
  for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.CircleGeometry(.3 + rnd() * .6, 18), toon(i % 3 ? '#7a7c88' : '#666874')); m.rotation.x = -PI / 2; m.scale.set(1.6, 1, 1); m.position.copy(P(-12 + rnd() * 24, -3 + rnd() * 5, .004)); add(m, 'asphalt_patch', 'ground', { cast: false }); }
  box('drain_grate', 'metal', .8, .4, .01, [3.6, 2.0, 0], iron, { cast: false });
  for (let i = 0; i < 6; i++) box('drain_bar', 'metal', .03, .36, .015, [3.3 + i * .12, 2.0, .005], dark, { cast: false });
  box('kerb', 'stone', 140, .3, .16, [0, 2.3, 0], kerbM);
  box('kerb_gold_line', 'stone', 140, .04, .005, [0, 2.17, .16], toon('#d9b24a'), { cast: false });
  box('pavement', 'stone', 140, 6.2, .16, [0, 5.55, 0], pave, { cast: false });
  box('carpet', 'cloth', 2.6, 5.4, .02, [0, 5.3, .16], carpetM, { cast: false });
  for (const s of [-1, 1]) box('carpet_gold_edge', 'cloth', .08, 5.4, .022, [s * 1.3, 5.3, .16], gold, { cast: false });

  // =====================================================================
  // THE CASINO FRONT (y 8.4): teal plaster, cream columns with gold capitals, three floors of windows, gold doors, the marquee with bulbs
  const FY = 8.4, top = 13;
  box('facade', 'plaster', 30, .5, top, [0, FY + .25, 0], wallT, { cast: false });
  box('facade_plinth', 'stone', 30.2, .6, .9, [0, FY - .05, 0], cream);
  for (const z of [4.6, 8.4, top - .5]) box('cornice', 'plaster', 30.4, .5, .28, [0, FY - .1, z], cream);
  for (const z of [4.6, 8.4]) box('cornice_gold', 'metal', 30.4, .02, .05, [0, FY - .36, z + .1], gold, { cast: false });
  for (const x of [-12, -8, -4.2, 4.2, 8, 12]) { cyl('column', 'plaster', .34, 4.4, [x, FY - .5, .9], cream, { seg: 24 }); cyl('column_base', 'stone', .44, .3, [x, FY - .5, .9], cream);
    cyl('column_capital', 'metal', .46, .26, [x, FY - .5, 5.1], gold, { r2: .38 }); for (let k = 0; k < 8; k++) { const a = k / 8 * 2 * PI; box('column_flute', 'plaster', .03, .03, 4.0, [x + .33 * Math.cos(a), FY - .5 + .33 * Math.sin(a), 1.1], toon('#dccca8'), { cast: false }); } }
  // windows: two upper floors, lit warm or dark, each with a frame, sill, mullion and a little balcony rail
  for (const z of [5.4, 9.2]) for (let x = -13; x <= 13; x += 2.2) { if (Math.abs(x) < 3 && z < 6) continue; const lit = rnd() < .55;
    box('window_frame', 'plaster', 1.3, .08, 2.0, [x, FY - .03, z], cream, { cast: false });
    box('window_glass', 'glass', 1.1, .06, 1.8, [x, FY - .07, z + .1], lit ? warm : toon('#26384a'), { cast: false });
    box('window_mullion', 'plaster', .06, .08, 1.8, [x, FY - .1, z + .1], cream, { cast: false }); box('window_transom', 'plaster', 1.1, .08, .06, [x, FY - .1, z + 1.25], cream, { cast: false });
    box('window_sill', 'stone', 1.5, .3, .1, [x, FY - .2, z - .08], cream);
    if (z > 7) { box('balcony_rail', 'metal', 1.5, .04, .04, [x, FY - .45, z + .55], brass); for (let k = -3; k <= 3; k++) box('balcony_bar', 'metal', .025, .025, .6, [x + k * .21, FY - .45, z], brass, { cast: false }); } }
  // ground floor: gold revolving door and two side doors, glass with gold frames, warm lobby light behind
  box('lobby_glow', 'lamp', 5.4, .05, 3.6, [0, FY - .02, .9], warm, { cast: false });
  for (const x of [-1.8, -.6, .6, 1.8]) box('door_frame_gold', 'metal', .08, .1, 3.4, [x, FY - .08, .9], gold);
  box('door_head_gold', 'metal', 3.8, .1, .12, [0, FY - .08, 4.3], gold);
  for (const x of [-1.2, 0, 1.2]) { box('door_glass', 'glass', 1.1, .04, 3.2, [x, FY - .1, .95], glass, { cast: false }); box('door_push_bar', 'metal', .7, .06, .05, [x, FY - .16, 2.0], brass); }
  // the marquee: a teal box on gold brackets, bulbs all round, PALACE in gold letters
  box('marquee', 'metal', 6.4, 2.2, .7, [0, FY - 1.4, 4.6], toon('#155e62'));
  box('marquee_gold_trim', 'metal', 6.5, 2.25, .08, [0, FY - 1.4, 4.56], gold); box('marquee_gold_trim', 'metal', 6.5, 2.25, .08, [0, FY - 1.4, 5.26], gold);
  for (const x of [-2.8, 2.8]) { const b = box('marquee_bracket', 'metal', .08, 2.2, .08, [x, FY - 1.3, 5.6], iron); b.rotation.x = .5; }
  { const s = label('PALACE', 5.2, .9, { fg: '#ffd35a', stroke: '#6a3a08', font: 'Georgia, serif', size: .86 }); s.position.copy(P(0, FY - 2.53, 4.95)); add(s, 'marquee_letters', 'lamp', { cast: false }); }
  for (let i = 0; i < 26; i++) { const x = -3.1 + i * 6.2 / 25; for (const z of [4.66, 5.18]) { const m = new THREE.Mesh(new THREE.SphereGeometry(.045, 10, 8), bulb); m.position.copy(P(x, FY - 2.52, z)); add(m, 'marquee_bulb', 'lamp', { cast: false }); } }
  // the tall CASINO sign at the corner, bulbs down both edges
  { const sx = 9.4; box('sign_casino_board', 'metal', 1.3, .3, 6.2, [sx, FY - .7, 5.4], toon('#155e62')); box('sign_casino_rim', 'metal', 1.42, .26, 6.34, [sx, FY - .66, 5.33], gold);
    const s = label('CASINO', 5.6, 1.0, { fg: '#ffd35a', stroke: '#6a3a08', font: 'Georgia, serif', size: .8 }); s.rotation.z = -PI / 2; s.position.copy(P(sx, FY - .87, 8.5)); add(s, 'sign_casino_letters', 'lamp', { cast: false });
    for (let k = 0; k < 22; k++) for (const dx of [-.56, .56]) { const m = new THREE.Mesh(new THREE.SphereGeometry(.05, 10, 8), bulb); m.position.copy(P(sx + dx, FY - .88, 5.7 + k * .27)); add(m, 'sign_bulb', 'lamp', { cast: false }); } }
  // planters with cypress trees, gold-banded
  for (const x of [-3.4, 3.4]) { box('planter', 'stone', 1.1, 1.1, .7, [x, 3.6, .16], cream); box('planter_gold_band', 'metal', 1.14, 1.14, .06, [x, 3.6, .7], gold); box('planter_soil', 'ground', .95, .95, .02, [x, 3.6, .86], soil, { cast: false });
    ctx.trees.tree({ kind: 'cypress', at: [x, 3.6, .86], height: 3.6, seed: x > 0 ? 3 : 7 }); }
  // brass rope posts along the carpet with teal velvet rope
  for (const s of [-1, 1]) { for (let k = 0; k < 4; k++) { const y = 3.0 + k * 1.5; cyl('rope_post', 'metal', .04, .95, [s * 1.65, y, .16], brass); const k2 = new THREE.Mesh(new THREE.SphereGeometry(.07, 14, 10), gold); k2.position.copy(P(s * 1.65, y, 1.14)); add(k2, 'rope_post_knob', 'metal');
      cyl('rope_post_foot', 'metal', .16, .05, [s * 1.65, y, .16], brass);
      if (k < 3) { const c = new THREE.CatmullRomCurve3([P(s * 1.65, y, 1.0), P(s * 1.65, y + .75, .78), P(s * 1.65, y + 1.5, 1.0)]); add(new THREE.Mesh(new THREE.TubeGeometry(c, 16, .03, 8), toon('#16585c')), 'velvet_rope', 'cloth'); } } }
  // valet podium with a little lamp and its sign
  box('valet_podium', 'wood', .7, .5, 1.1, [-5.2, 3.1, .16], wood); box('valet_podium_top', 'metal', .8, .6, .05, [-5.2, 3.1, 1.26], brass);
  { const v = label('VALET', .62, .2, { bg: '#155e62', fg: '#ffd35a', font: 'Arial Black, Arial', size: .7 }); v.position.copy(P(-5.2, 2.84, .95)); add(v, 'valet_sign', 'lamp', { cast: false }); }
  // street lamps along the kerb: iron posts, gold crowns, warm globes
  for (const x of [-11, -6.5, 6.5, 11, -18, 18, -26, 26]) { cyl('lamp_post', 'metal', .07, 4.0, [x, 2.75, .16], iron, { r2: .05 }); cyl('lamp_base', 'metal', .16, .5, [x, 2.75, .16], iron);
    const g = new THREE.Mesh(new THREE.SphereGeometry(.24, 18, 12), bulb); g.position.copy(P(x, 2.75, 4.42)); add(g, 'lamp_globe', 'lamp', { cast: false }); cyl('lamp_crown', 'metal', .14, .12, [x, 2.75, 4.62], gold); }
  // the street beyond: older brick blocks with lit shop windows and awnings, both ways (the camera sees down the street)
  for (const side of [-1, 1]) for (let i = 0; i < 6; i++) { const x = side * (17 + i * 7.5), h = 7 + (i * 5 % 4) * 2.2, m = i % 2 ? brick : brick2;
    box('block', 'brick', 7.2, 4, h, [x, FY + 2, 0], m, { cast: false }); box('block_cornice', 'plaster', 7.4, 4.2, .3, [x, FY + 2, h], cream, { cast: false });
    box('shop_window', 'glass', 5, .05, 2, [x, FY - .02, .6], rnd() < .7 ? warm : toon('#2c3a4c'), { cast: false });
    box('awning', 'cloth', 5.6, 1.2, .1, [x, FY - .6, 2.9], toon(['#1f6f74', '#d9b24a', '#2b4f8a'][i % 3]), { cast: false });
    for (let z = 3.6; z < h - 1; z += 2) for (let k = -2; k <= 2; k++) box('block_window', 'glass', .8, .05, 1.1, [x + k * 1.3, FY - .02, z], rnd() < .4 ? warm : toon('#2a3646'), { cast: false }); }
  // the near prop by the lens: a gold-capped iron bollard (depth layer 1)
  cyl('bollard', 'metal', .12, .9, [-2.5, -2.2, 0], iron, { seg: 24 }); { const c = new THREE.Mesh(new THREE.SphereGeometry(.13, 18, 12), gold); c.position.copy(P(-2.5, -2.2, .92)); add(c, 'bollard_cap', 'metal'); }
  for (const z of [.25, .7]) cyl('bollard_ring', 'metal', .135, .04, [-2.5, -2.2, z], gold);
  { const c = new THREE.CircleGeometry(.5, 24), m = new THREE.Mesh(c, ctx.pbr.metal('wet', { color: '#2c2e38', rough: .03, env: 1.4, toon: '#4a4c58' })); m.rotation.x = -PI / 2; m.scale.set(.9, .45, 1); m.position.copy(P(-1.9, -1.6, .006)); add(m, 'puddle', 'water', { cast: false }); }

  // =====================================================================
  // THE RED ROADSTER. Built in a group in three.js axes: local x = plan x, local y = up, local z = -plan y (driver side at +z).
  const car = new THREE.Group(); car.name = 'roadster'; car.position.copy(P(CAR.x, CAR.y, 0)); scene.add(car);
  const body = new THREE.Group(); body.name = 'roadster_body_rig'; car.add(body);          // rocks on the door slam
  const ca = (m, name, role, o = {}) => add(m, name, role, { ...o, parent: o.parent || body });
  const W = 1.86, BEV = .07;
  // body profile (x, up) with two wheel arches; extruded across the width
  const sh = new THREE.Shape(); sh.moveTo(-2.18, .3); sh.quadraticCurveTo(-2.32, .42, -2.24, .56); sh.lineTo(-2.1, .64); sh.quadraticCurveTo(-1.4, .74, -.8, .82); sh.lineTo(1.4, .86);
  sh.quadraticCurveTo(2.05, .9, 2.22, .82); sh.lineTo(2.26, .52); sh.lineTo(2.2, .3); sh.lineTo(1.78, .24); sh.absarc(1.32, .36, .44, -.27, PI + .27, false); sh.lineTo(.84, .22);
  sh.lineTo(-.92, .22); sh.absarc(-1.38, .36, .44, -.27, PI + .27, false); sh.lineTo(-1.86, .24); sh.lineTo(-2.18, .3);
  const bg = new THREE.ExtrudeGeometry(sh, { depth: W - 2 * BEV, bevelEnabled: true, bevelThickness: BEV, bevelSize: BEV, bevelSegments: 4, curveSegments: 28 }); bg.translate(0, 0, -(W - 2 * BEV) / 2);
  ca(new THREE.Mesh(bg, paint), 'roadster_body', 'metal');
  // the cockpit: a dark tub sunk into the body top, so the seats sit IN the car
  { const t = new THREE.Mesh(new THREE.BoxGeometry(1.55, .06, 1.5), leatherD); t.position.set(.2, .875, 0); ca(t, 'cockpit_floor_trim', 'cloth', { cast: false }); }
  // wheel wells (dark), wheels: tyre with tread, chrome five-spoke rim, disc, caliper, gold centre cap
  for (const wx of [-1.38, 1.32]) { const w = new THREE.Mesh(new THREE.BoxGeometry(.86, .5, W - .3), dark); w.position.set(wx, .46, 0); ca(w, 'wheel_well', 'metal', { cast: false });
    for (const s of [-1, 1]) { const wg = new THREE.Group(); wg.position.set(wx, .36, s * .8); body.add(wg); wg.name = 'wheel';
      const ty = new THREE.Mesh(new THREE.CylinderGeometry(.36, .36, .27, 44), rubber); ty.rotation.x = PI / 2; ca(ty, 'tyre', 'metal', { parent: wg });
      for (let k = 0; k < 36; k++) { const a = k / 36 * 2 * PI, tr = new THREE.Mesh(new THREE.BoxGeometry(.035, .02, .27), rubber2); tr.position.set(.355 * Math.cos(a), .355 * Math.sin(a), 0); tr.rotation.z = a; ca(tr, 'tyre_tread', 'metal', { parent: wg, cast: false }); }
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(.25, .25, .05, 36), chrome); rim.rotation.x = PI / 2; rim.position.z = s * .12; ca(rim, 'rim_dish', 'metal', { parent: wg });
      const lip = new THREE.Mesh(new THREE.TorusGeometry(.25, .018, 10, 40), chrome); lip.position.z = s * .145; ca(lip, 'rim_lip', 'metal', { parent: wg });
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(.19, .19, .02, 30), ctx.pbr.metal('steel', { toon: '#8a8e96' })); disc.rotation.x = PI / 2; disc.position.z = s * .1; ca(disc, 'brake_disc', 'metal', { parent: wg });
      const cal = new THREE.Mesh(new THREE.BoxGeometry(.1, .16, .06), gold); cal.position.set(.12, .1, s * .115); ca(cal, 'brake_caliper', 'metal', { parent: wg });
      for (let k = 0; k < 5; k++) { const a = k / 5 * 2 * PI + .3, sp = new THREE.Mesh(new THREE.BoxGeometry(.2, .05, .03), chrome); sp.position.set(.11 * Math.cos(a), .11 * Math.sin(a), s * .155); sp.rotation.z = a; ca(sp, 'rim_spoke', 'metal', { parent: wg }); }
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .03, 20), gold); cap.rotation.x = PI / 2; cap.position.z = s * .17; ca(cap, 'wheel_cap_gold', 'metal', { parent: wg }); } }
  // nose: headlights with chrome bezels, grille with chrome slats, fog lamps, gold badge, lower lip
  for (const s of [-1, 1]) { const hl = new THREE.Mesh(new THREE.SphereGeometry(.13, 20, 14), head); hl.scale.set(.55, .8, 1.2); hl.position.set(-2.17, .6, s * .6); ca(hl, 'headlight', 'lamp', { cast: false });
    const bz = new THREE.Mesh(new THREE.TorusGeometry(.13, .02, 10, 28), chrome); bz.rotation.y = PI / 2; bz.scale.set(1, .8, 1.2); bz.position.set(-2.15, .6, s * .6); ca(bz, 'headlight_bezel', 'metal');
    const fg = new THREE.Mesh(new THREE.SphereGeometry(.05, 12, 10), head); fg.position.set(-2.24, .36, s * .66); ca(fg, 'fog_lamp', 'lamp', { cast: false }); }
  { const gr = new THREE.Mesh(new THREE.BoxGeometry(.06, .2, .9), dark); gr.position.set(-2.27, .42, 0); ca(gr, 'grille', 'metal');
    for (let k = 0; k < 5; k++) { const sl = new THREE.Mesh(new THREE.BoxGeometry(.03, .016, .88), chrome); sl.position.set(-2.3, .34 + k * .04, 0); ca(sl, 'grille_slat', 'metal', { cast: false }); }
    const lipM = new THREE.Mesh(new THREE.BoxGeometry(.2, .05, 1.7), dark); lipM.position.set(-2.14, .23, 0); ca(lipM, 'front_lip', 'metal');
    const bd = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .02, 24), gold); bd.rotation.z = PI / 2 - .25; bd.position.set(-2.14, .66, 0); ca(bd, 'bonnet_badge', 'metal');
    const pl = label('BOSS 1', .52, .13, { bg: '#f4ecd6', fg: '#9a1220', font: 'Arial Black, Arial', size: .74, rim: '#c4121e', px: 512 }); pl.rotation.y = -PI / 2; pl.position.set(-2.33, .3, .0); ca(pl, 'front_plate', 'metal', { cast: false }); }
  // bonnet power bulge and louvres
  for (const s of [-1, 1]) { const ln = new THREE.Mesh(new THREE.BoxGeometry(1.0, .012, .04), toon('#8e0d16')); ln.position.set(-1.35, .785, s * .3); ln.rotation.z = -.06; ca(ln, 'bonnet_crease', 'metal', { cast: false }); }
  for (let k = 0; k < 6; k++) { const lv = new THREE.Mesh(new THREE.BoxGeometry(.05, .012, .26), dark); lv.position.set(-1.25 + k * .09, .79, .55); ca(lv, 'bonnet_louvre', 'metal', { cast: false }); const lv2 = lv.clone(); lv2.position.z = -.55; ca(lv2, 'bonnet_louvre', 'metal', { cast: false }); }
  // windscreen: chrome frame + tinted glass, raked back
  { const g2 = new THREE.Group(); g2.position.set(-.78, .84, 0); g2.rotation.z = -.62; body.add(g2); g2.name = 'windscreen';
    const gl = new THREE.Mesh(new THREE.PlaneGeometry(.42, 1.52), glass); gl.rotation.y = PI / 2; gl.position.y = .21; ca(gl, 'windscreen_glass', 'glass', { parent: g2, cast: false });
    for (const s of [-1, 1]) { const fr = new THREE.Mesh(new THREE.BoxGeometry(.04, .46, .04), chrome); fr.position.set(0, .21, s * .77); ca(fr, 'windscreen_pillar', 'metal', { parent: g2 }); }
    const tp = new THREE.Mesh(new THREE.BoxGeometry(.04, .04, 1.58), chrome); tp.position.set(0, .44, 0); ca(tp, 'windscreen_header', 'metal', { parent: g2 }); }
  // dash, gauges, steering wheel
  { const d = new THREE.Mesh(new THREE.BoxGeometry(.25, .12, 1.6), leatherD); d.position.set(-.62, .9, 0); ca(d, 'dashboard', 'cloth');
    for (const z of [.38, .52]) { const gg = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .02, 20), gold); gg.rotation.z = PI / 2; gg.position.set(-.5, .93, z); ca(gg, 'gauge_bezel', 'metal', { cast: false }); const gf = new THREE.Mesh(new THREE.CircleGeometry(.04, 20), glow('#fff3d0')); gf.rotation.y = PI / 2; gf.position.set(-.488, .93, z); ca(gf, 'gauge_face', 'lamp', { cast: false }); }
    const col = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, .3, 10), dark); col.rotation.z = PI / 2 + .6; col.position.set(-.42, .95, .45); ca(col, 'steering_column', 'metal');
    const sw = new THREE.Mesh(new THREE.TorusGeometry(.17, .022, 10, 36), leatherD); sw.rotation.y = PI / 2; sw.rotation.x = 0; sw.rotation.z = .5; sw.position.set(-.3, 1.02, .45); ca(sw, 'steering_wheel', 'cloth');
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, .03, 16), gold); hub.rotation.z = PI / 2 - .5; hub.position.set(-.3, 1.02, .45); ca(hub, 'steering_hub', 'metal'); }
  // two cream bucket seats with headrests and gold stitching, roll hoops, roadster humps
  for (const z of [.45, -.45]) { const sb = new THREE.Mesh(new THREE.BoxGeometry(.5, .14, .5), leather); sb.position.set(.25, .82, z); ca(sb, 'seat_base', 'cloth');
    const sk = new THREE.Mesh(new THREE.BoxGeometry(.12, .62, .5), leather); sk.position.set(.52, 1.05, z); sk.rotation.z = -.22; ca(sk, 'seat_back', 'cloth');
    for (let k = -1; k <= 1; k++) { const st = new THREE.Mesh(new THREE.BoxGeometry(.13, .55, .012), gold); st.position.set(.51, 1.05, z + k * .14); st.rotation.z = -.22; ca(st, 'seat_stitch_gold', 'cloth', { cast: false }); }
    const hr = new THREE.Mesh(new THREE.SphereGeometry(.16, 18, 12), leather); hr.scale.set(.5, .7, 1); hr.position.set(.62, 1.45, z); ca(hr, 'headrest', 'cloth');
    const hump = new THREE.Mesh(new THREE.SphereGeometry(.3, 24, 14, 0, 2 * PI, 0, PI / 2), paint); hump.scale.set(1.9, .55, .8); hump.position.set(1.25, .86, z); ca(hump, 'roadster_hump', 'metal');
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(.2, .025, 10, 24, PI), chrome); hoop.rotation.y = PI / 2; hoop.position.set(.78, .86, z); ca(hoop, 'roll_hoop', 'metal'); }
  // gold pinstripe and side vent behind the door, twin chrome exhausts, tail lights
  for (const s of [-1, 1]) { const ps = new THREE.Mesh(new THREE.BoxGeometry(4.1, .018, .01), gold); ps.position.set(0, .7, s * (W / 2 + .003)); ca(ps, 'pinstripe_gold', 'metal', { cast: false });
    for (let k = 0; k < 4; k++) { const v = new THREE.Mesh(new THREE.BoxGeometry(.28, .025, .01), dark); v.position.set(.98, .45 + k * .05, s * (W / 2 + .004)); ca(v, 'side_vent', 'metal', { cast: false }); }
    const tl = new THREE.Mesh(new THREE.BoxGeometry(.04, .07, .42), tail); tl.position.set(2.25, .7, s * .6); ca(tl, 'tail_light', 'lamp', { cast: false });
    const ex = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .2, 18, 1, true), chrome); ex.rotation.z = PI / 2; ex.position.set(2.27, .27, s * .4); ca(ex, 'exhaust_pipe', 'metal'); }
  // the open door shows the cockpit side: dark leather trim + a chrome sill plate (only seen when the door is open)
  { const it = new THREE.Mesh(new THREE.PlaneGeometry(1.15, .5), leatherD); it.position.set(-.04, .58, W / 2 + .002); ca(it, 'door_opening_trim', 'cloth', { cast: false });
    const sp = new THREE.Mesh(new THREE.BoxGeometry(1.15, .04, .02), chrome); sp.position.set(-.04, .34, W / 2 + .005); ca(sp, 'sill_plate', 'metal', { cast: false }); }
  // THE DOOR: a hinged group at the front of the opening; panel, inner trim with an armrest, chrome handle, side mirror
  const hinge = new THREE.Group(); hinge.name = 'driver_door_hinge'; hinge.position.set(CAR.hingeX, 0, W / 2 + .004); body.add(hinge);
  { const ds = new THREE.Shape(); ds.moveTo(0, .3); ds.lineTo(1.17, .3); ds.lineTo(1.17, .83); ds.lineTo(.02, .83); ds.quadraticCurveTo(-.02, .6, 0, .3);
    const dg = new THREE.ExtrudeGeometry(ds, { depth: .05, bevelEnabled: true, bevelThickness: .012, bevelSize: .012, bevelSegments: 2 }); const dm = new THREE.Mesh(dg, paint); ca(dm, 'driver_door', 'metal', { parent: hinge });
    const inn = new THREE.Mesh(new THREE.PlaneGeometry(1.1, .45), leatherD); inn.rotation.y = PI; inn.position.set(.58, .56, -.014); ca(inn, 'door_inner_trim', 'cloth', { parent: hinge, cast: false });
    const arm = new THREE.Mesh(new THREE.BoxGeometry(.5, .05, .07), leather); arm.position.set(.6, .62, -.05); ca(arm, 'door_armrest', 'cloth', { parent: hinge });
    const hd = new THREE.Mesh(new THREE.BoxGeometry(.18, .03, .03), chrome); hd.position.set(.95, .72, .07); ca(hd, 'door_handle', 'metal', { parent: hinge });
    const ps2 = new THREE.Mesh(new THREE.BoxGeometry(1.15, .018, .008), gold); ps2.position.set(.58, .7, .066); ca(ps2, 'door_pinstripe_gold', 'metal', { parent: hinge, cast: false });
    const mm = new THREE.Mesh(new THREE.SphereGeometry(.09, 16, 10), paint); mm.scale.set(1.4, .8, .6); mm.position.set(.12, .97, .07); ca(mm, 'mirror_housing', 'metal', { parent: hinge });
    const mg = new THREE.Mesh(new THREE.CircleGeometry(.07, 18), chrome); mg.scale.set(1.3, .7, 1); mg.rotation.y = PI / 2; mg.position.set(.24, .97, .07); ca(mg, 'mirror_glass', 'metal', { parent: hinge, cast: false });
    const ms = new THREE.Mesh(new THREE.BoxGeometry(.03, .12, .03), chrome); ms.position.set(.1, .88, .05); ca(ms, 'mirror_stem', 'metal', { parent: hinge }); }

  // =====================================================================
  // AIR LIFE: warm dust motes in the low sun (two layers: near the lens and round the car)
  const dot = (() => { const c = document.createElement('canvas'); c.width = c.height = 32; const g = c.getContext('2d'), gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.4, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); return new THREE.CanvasTexture(c); })();
  const motes = []; for (const [cnt, x0, x1, y0, y1, sz] of [[140, -4, 3, -3, 1, .018], [220, -10, 10, 0, 8, .03]]) { const pos = new Float32Array(cnt * 3), seed = [];
    for (let i = 0; i < cnt; i++) { const p = P(x0 + rnd() * (x1 - x0), y0 + rnd() * (y1 - y0), .3 + rnd() * 3.2); pos.set([p.x, p.y, p.z], i * 3); seed.push(rnd() * 6.28); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const base = pos.slice();
    const pm = new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffe3a8', size: sz * .8, map: dot, alphaTest: .02, transparent: true, opacity: .7, depthWrite: false })); pm.name = 'dust_motes'; pm.userData.noExport = true; scene.add(pm); motes.push({ g, base, seed }); }
  // THE HAT GLINT: one thin horizontal streak + a soft glow on the gold hat brim
  const gl = new THREE.Group(); gl.position.copy(P(...GLINT.at)); scene.add(gl); gl.userData.noExport = true;
  // soft textures that fade to zero on every edge (no visible box): a gaussian streak and a round glow
  const softTex = (w, h, sx, sy) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'), im = g.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const dx = (x - w / 2 + .5) / (w / 2), dy = (y - h / 2 + .5) / (h / 2), a = Math.exp(-(dx * dx) / sx - (dy * dy) / sy) * Math.max(0, 1 - Math.max(Math.abs(dx), Math.abs(dy)));
      const i = (y * w + x) * 4, core = Math.exp(-(dx * dx + dy * dy) / (sx * .05)); im.data[i] = 255; im.data[i + 1] = 222 + 33 * core; im.data[i + 2] = 140 + 110 * core; im.data[i + 3] = Math.round(255 * Math.min(1, a)); }
    g.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const sMat = map => new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, toneMapped: false });
  const streak = new THREE.Sprite(sMat(softTex(512, 32, .12, .25))); streak.scale.set(1.2, .05, 1); gl.add(streak);
  const halo = new THREE.Sprite(sMat(softTex(128, 128, .18, .18))); halo.scale.set(.3, .3, 1); gl.add(halo);
  streak.renderOrder = halo.renderOrder = 50;

  // sky: clear golden-hour cumulus
  ctx.sky.clouds({ kind: 'clear-day', seed: 4, coverage: .8, colors: { top: '#3d6fb8', mid: '#86a9d6', hor: '#ffd6a0', sun: '#fff0d0', lit: '#fff1d8', shade: '#c4a4b8', rim: '#fff6e0' } });

  // ---------- motion ----------
  const snap = (u) => u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.pow(1 - u, 3);
  const doorAngle = f => { let a = DOOR.a0; const [o0, on, oa] = DOOR.open; if (f > o0) a += (oa - DOOR.a0) * snap((f - o0) / on);
    const [c0, cn] = DOOR.close; if (f > c0) a = oa * (1 - Math.min(1, Math.pow((f - c0) / cn, 2)));
    if (f > DOOR.slam) a = 0; return a; };
  const update = (f, t) => {
    hinge.rotation.y = -doorAngle(f) * PI / 180;
    const ds = f - DOOR.slam; body.rotation.x = ds > 0 && ds < 24 ? -.012 * Math.exp(-ds / 5) * Math.cos(ds * 1.1) : 0; body.position.y = ds > 0 && ds < 18 ? -.008 * Math.exp(-ds / 4) * Math.cos(ds * 1.3) : 0;
    for (const m of motes) { const P2 = m.g.attributes.position; for (let i = 0; i < P2.count; i++) { const s = m.seed[i]; P2.setXYZ(i, m.base[i * 3] + .12 * Math.sin(t * .35 + s), m.base[i * 3 + 1] + .08 * Math.sin(t * .5 + s * 1.7), m.base[i * 3 + 2] + .1 * Math.cos(t * .3 + s)); } P2.needsUpdate = true; }
    const gu = (f - GLINT.f) / GLINT.len, on = gu > 0 && gu < 1 ? Math.sin(PI * Math.min(1, gu * 1.6)) * (gu < .62 ? 1 : 1 - (gu - .62) / .38) : 0;
    gl.visible = on > .01; streak.material.opacity = on; halo.material.opacity = on * .9; streak.scale.set(.25 + 1.3 * on, .045, 1);
  };
  const doorTip = f => { const a = doorAngle(f) * PI / 180, L = CAR.doorLen - .05; return [CAR.x + CAR.hingeX + L * Math.cos(a), CAR.y - CAR.side - L * Math.sin(a), .8]; };
  return { update, anchors: { door_tip: doorTip, car: [CAR.x, CAR.y, .6], hat: GLINT.at } };
}

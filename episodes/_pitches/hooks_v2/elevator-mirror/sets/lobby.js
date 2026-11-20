// SET for pitch 5 hook frame (2026-11-16): THE GRAND HOTEL LOBBY AND ITS SLOW BRASS ELEVATOR, evening, about 1955.
// Plan metres, Z up, Y forward (away from the lens). Origin = the left jamb of the elevator opening on the lobby floor.
// Parts: the elevator wall (mahogany wainscot, cream damask, brass surround, the floor-indicator dial, "ELEVATOR" plaque, two sconces); THE CAR (open
// brass cage: corner posts, crossed lattice side walls, crest of scrolls, a domed ceiling lamp, parquet floor with a brass sill, mahogany back wall with
// a brass hand rail); THE MIRROR (bevelled glass, gilt frame with corner rosettes, three screws home and the top-left one half in, a pencil mark, the
// open shipping crate "FRAGILE - MIRROR" and the toolbox); the lobby (marble checker floor, red runner with a gold border, marble columns with gilt
// capitals, coffered ceiling, the crystal chandelier, reception desk with bell, key rack with brass tags, the big wall clock, arched windows on a blue
// evening street, palms in brass pots, brass stanchions with red velvet rope, the overflowing COMPLAINTS box).
// Every shader-free: canvas textures only, so no pow/sqrt NaN risk on the card.
export const CAGE = { x0: -0.05, x1: 1.05, y0: -0.2, y1: 1.12, z0: 0.05, z1: 2.5 };
export const MIRROR = { x0: 0.5, x1: 0.98, z0: 0.62, z1: 2.04, y: 1.085 };

const canvasTex = (THREE, w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };

export async function build(THREE, scene, film, ctx) {
  const { B2T, toon } = ctx, V = (x, y, z) => B2T([x, y, z]);
  let seed = 11; const R0 = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * R0();
  const add = (geo, mat, name, role, p, parent = scene, shadow = true) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m; };
  const box = (sx, sy, sz, mat, name, role, x, y, z, parent, shadow) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, role, V(x, y, z), parent, shadow);   // plan sizes (x, y, z) -> three (x, z-up, y)
  const bar = (a, b, r, mat, name, role = 'metal', parent = scene, segs = 8) => { const A = V(...a), Bv = V(...b), d = Bv.clone().sub(A), L = Math.max(d.length(), 1e-4), m = add(new THREE.CylinderGeometry(r, r, L, segs), mat, name, role, A.clone().addScaledVector(d, .5), parent); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); return m; };
  const pb = ctx.pbr, brass = pb ? pb.metal('brass', { color: '#e0a83a', rough: .32, env: 1.1, toon: '#e0a83a' }) : toon('#e0a83a'), gilt = pb ? pb.metal('gold', { color: '#ffc845', toon: '#ffc845' }) : toon('#ffc845');
  const brassDk = pb ? pb.metal('brass', { color: '#a8741e', rough: .45, toon: '#a8741e' }) : toon('#a8741e');
  const mahog = ctx.relief ? ctx.relief('wood', '#8a3a1e', { size: 1.2 }) : toon('#8a3a1e'), mahogDk = toon('#5a2414'), cream = toon('#f3dcae'), white = toon('#fff6e6');
  const glow = c => new THREE.MeshBasicMaterial({ color: c, toneMapped: false }), ink = toon('#2a1a1f');

  // ---------- the kit's sky: replaced by the room; warm air ----------
  scene.children.forEach(o => { if (o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.radius === 400) o.visible = false; });
  scene.background = new THREE.Color('#2a1a14'); scene.fog = new THREE.Fog('#c99a6a', 14, 40);

  // ---------- floors: marble checker + the red runner with a gold border ----------
  const marbleT = canvasTex(THREE, 512, 512, (c, w, h) => { const n = 4, s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const dk = (i + j) % 2; c.fillStyle = dk ? '#2e5a4a' : '#f2e3c4'; c.fillRect(i * s, j * s, s, s);
      c.strokeStyle = dk ? 'rgba(160,210,190,.35)' : 'rgba(170,140,100,.35)'; c.lineWidth = 2; for (let k = 0; k < 3; k++) { c.beginPath(); let x = i * s + R0() * s, y = j * s; c.moveTo(x, y); for (let q = 0; q < 6; q++) { x += (R0() - .5) * 30; y += s / 6; c.lineTo(x, y); } c.stroke(); } }
    c.strokeStyle = '#c9a24a'; c.lineWidth = 3; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(i * s, 0); c.lineTo(i * s, h); c.stroke(); c.beginPath(); c.moveTo(0, i * s); c.lineTo(w, i * s); c.stroke(); } }, [6, 6]);
  const floor = add(new THREE.PlaneGeometry(24, 24), new THREE.MeshStandardMaterial({ map: marbleT, roughness: .28, metalness: 0 }), 'lobby_marble_floor', 'floor', V(-2, 3, 0)); floor.rotation.x = -Math.PI / 2; floor.castShadow = false;
  const rugT = (w0, h0, rx, ry) => canvasTex(THREE, w0, h0, (c, w, h) => { c.fillStyle = '#b01e22'; c.fillRect(0, 0, w, h); c.fillStyle = '#e4b444'; c.fillRect(0, 0, w, 14); c.fillRect(0, h - 14, w, 14); c.fillRect(0, 0, 14, h); c.fillRect(w - 14, 0, 14, h);
    c.fillStyle = '#7c1016'; c.fillRect(24, 24, w - 48, 6); c.fillRect(24, h - 30, w - 48, 6); c.fillRect(24, 24, 6, h - 48); c.fillRect(w - 30, 24, 6, h - 48);
    c.fillStyle = '#d0383a'; for (let y = 60; y < h - 40; y += 64) for (let x = 60; x < w - 40; x += 64) { c.beginPath(); c.moveTo(x, y - 14); c.lineTo(x + 14, y); c.lineTo(x, y + 14); c.lineTo(x - 14, y); c.fill(); } });
  const runner = add(new THREE.PlaneGeometry(1.3, 8.2), new THREE.MeshLambertMaterial({ map: rugT(256, 1600) }), 'red_runner_queue', 'carpet', V(-1.05, 2.6, .006)); runner.rotation.x = -Math.PI / 2; runner.castShadow = false;
  const mat2 = add(new THREE.PlaneGeometry(1.7, 1.25), new THREE.MeshLambertMaterial({ map: rugT(340, 250) }), 'red_mat_at_gate', 'carpet', V(.5, -.85, .008)); mat2.rotation.x = -Math.PI / 2; mat2.castShadow = false;

  // ---------- the elevator wall (front face y = -0.2), opening x -0.05..1.05 ----------
  const damask = canvasTex(THREE, 256, 256, (c, w, h) => { c.fillStyle = '#f0d49c'; c.fillRect(0, 0, w, h); c.fillStyle = '#e2bd78';
    for (const [x, y] of [[64, 64], [192, 192], [192, 64], [64, 192]]) { c.beginPath(); c.ellipse(x, y, 20, 34, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(x, y, 34, 12, 0, 0, Math.PI * 2); c.fill(); } }, [6, 6]);
  const wallUp = new THREE.MeshLambertMaterial({ map: damask }), EW = { y: -0.2, t: .22 };
  box(3.0, EW.t, 4.3, wallUp, 'elev_wall_right', 'wall', 1.05 + 1.5, EW.y + EW.t / 2, 2.15, scene, false);
  box(1.1, EW.t, 1.75, wallUp, 'elev_wall_over_door', 'wall', .5, EW.y + EW.t / 2, 2.5 + .875, scene, false);
  box(3.0, .05, 1.0, mahog, 'wainscot_right', 'wood', 1.05 + 1.5, EW.y - .02, .5, scene, false);
  box(3.0, .07, .07, gilt, 'dado_rail_right', 'metal', 2.55, EW.y - .05, 1.02);
  // brass surround: two fluted pilasters, a cornice, the semicircle FLOOR INDICATOR with its arrow, the ELEVATOR plaque
  for (const x of [1.12]) { box(.13, .08, 2.55, brass, 'surround_pilaster', 'metal', x, EW.y - .04, 1.275); for (const dx of [-.035, 0, .035]) box(.012, .02, 2.3, brassDk, 'pilaster_flute', 'metal', x + dx, EW.y - .085, 1.3, scene, false);
    box(.2, .1, .12, brass, 'pilaster_base', 'metal', x, EW.y - .05, .06); box(.2, .1, .1, brass, 'pilaster_cap', 'metal', x, EW.y - .05, 2.55); }
  box(1.5, .12, .14, brass, 'surround_cornice', 'metal', .5, EW.y - .06, 2.66); box(1.42, .1, .05, brassDk, 'surround_cornice_lip', 'metal', .5, EW.y - .1, 2.6);
  const dialT = canvasTex(THREE, 512, 280, (c, w, h) => { c.fillStyle = '#1c1612'; c.fillRect(0, 0, w, h); c.fillStyle = '#f8e7b0'; c.beginPath(); c.arc(w / 2, h - 10, 236, Math.PI, 0); c.fill(); c.fillStyle = '#1c1612'; c.beginPath(); c.arc(w / 2, h - 10, 40, Math.PI, 0); c.fill();
    const fl = ['L', '2', '3', '4', '5', '6', '7', '8', '9']; c.font = 'bold 38px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; fl.forEach((s, i) => { const a = Math.PI + Math.PI * (i + .5) / fl.length; c.fillStyle = '#3a2410'; c.fillText(s, w / 2 + Math.cos(a) * 190, h - 10 + Math.sin(a) * 190); });
    c.strokeStyle = '#b01e22'; c.lineWidth = 10; c.lineCap = 'round'; const a = Math.PI + Math.PI * .5 / fl.length; c.beginPath(); c.moveTo(w / 2, h - 10); c.lineTo(w / 2 + Math.cos(a) * 150, h - 10 + Math.sin(a) * 150); c.stroke(); });
  const dial = add(new THREE.PlaneGeometry(.66, .36), new THREE.MeshBasicMaterial({ map: dialT }), 'floor_indicator_dial', 'sign', V(.5, EW.y - .115, 2.92)); dial.castShadow = false;
  add(new THREE.TorusGeometry(.335, .025, 8, 24, Math.PI), brass, 'dial_brass_rim', 'metal', V(.5, EW.y - .12, 2.75));
  const plaqT = canvasTex(THREE, 512, 110, (c, w, h) => { c.fillStyle = '#141018'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e4b444'; c.lineWidth = 6; c.strokeRect(8, 8, w - 16, h - 16); c.fillStyle = '#ffd25a'; c.font = 'bold 62px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('ELEVATOR', w / 2, h / 2 + 3); });
  add(new THREE.PlaneGeometry(.9, .19), new THREE.MeshBasicMaterial({ map: plaqT }), 'elevator_plaque', 'sign', V(.5, EW.y - .115, 3.3), scene, false);
  // sconces: brass arm, a frosted tulip shade glowing warm
  for (const x of [1.55]) { box(.1, .04, .2, brass, 'sconce_plate', 'metal', x, EW.y - .02, 2.0); bar([x, EW.y - .02, 1.98], [x, EW.y - .2, 2.08], .012, brass, 'sconce_arm');
    add(new THREE.ConeGeometry(.075, .14, 12, 1, true), glow('#ffe2a8'), 'sconce_tulip', 'lamp', V(x, EW.y - .22, 2.16), scene, false).rotation.x = Math.PI; }

  // ---------- THE CAR: an open brass cage ----------
  const C = CAGE, car = new THREE.Group(), cw = C.x1 - C.x0; car.name = 'elevator_car'; scene.add(car);
  const parq = canvasTex(THREE, 256, 256, (c, w, h) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { c.fillStyle = ['#a0602e', '#8a4e24', '#b4723a'][(i * 3 + j * 5) % 3]; const v = (i + j) % 2; c.fillRect(i * 32, j * 32, 32, 32); c.strokeStyle = '#5a3014'; c.lineWidth = 2; c.strokeRect(i * 32, j * 32, 32, 32);
      c.beginPath(); if (v) { c.moveTo(i * 32 + 16, j * 32); c.lineTo(i * 32 + 16, j * 32 + 32); } else { c.moveTo(i * 32, j * 32 + 16); c.lineTo(i * 32 + 32, j * 32 + 16); } c.stroke(); } }, [2, 2]);
  box(cw, C.y1 - C.y0, .05, new THREE.MeshLambertMaterial({ map: parq }), 'car_parquet_floor', 'wood', (C.x0 + C.x1) / 2, (C.y0 + C.y1) / 2, C.z0 - .025, car, false);
  box(cw + .1, .07, .03, brass, 'car_sill', 'metal', (C.x0 + C.x1) / 2, C.y0 - .02, C.z0 - .005, car);
  // the shaft void round the car (dark) so the lattice reads against it
  box(cw + .4, .05, 4.2, toon('#2a1c18'), 'shaft_back_dark', 'wall', (C.x0 + C.x1) / 2 + .2, C.y1 + .4, 2.1, scene, false); box(.05, 2.4, 4.2, toon('#2a1c18'), 'shaft_wall_right', 'wall', C.x1 + .35, .9, 2.1, scene, false);
  // back wall: mahogany panels with brass-beaded mouldings and a brass hand rail
  box(cw, .06, C.z1 - C.z0, mahog, 'car_back_wall', 'wood', (C.x0 + C.x1) / 2, C.y1 + .03, (C.z0 + C.z1) / 2, car, false);
  for (const [x0, x1] of [[C.x0 + .06, .36]]) for (const [z0, z1] of [[.2, .95], [1.1, 2.35]]) { const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, w = x1 - x0, h = z1 - z0;
    box(w, .02, .025, brassDk, 'panel_bead', 'metal', cx, C.y1 - .005, z1, car, false); box(w, .02, .025, brassDk, 'panel_bead', 'metal', cx, C.y1 - .005, z0, car, false); box(.025, .02, h, brassDk, 'panel_bead', 'metal', x0, C.y1 - .005, cz, car, false); box(.025, .02, h, brassDk, 'panel_bead', 'metal', x1, C.y1 - .005, cz, car, false); }
  bar([C.x0 + .05, C.y1 - .08, .92], [C.x1 - .05, C.y1 - .08, .92], .018, brass, 'car_hand_rail', 'metal', car);
  for (const x of [C.x0 + .1, C.x1 - .1]) bar([x, C.y1 - .08, .92], [x, C.y1, .92], .012, brass, 'rail_bracket', 'metal', car);
  // corner posts (twisted look = rings), lattice side walls (crossed flat bars with rosettes at the crossings), top crest of scrolls
  for (const x of [C.x0, C.x1]) for (const y of [C.y0, C.y1]) { bar([x, y, C.z0], [x, y, C.z1 + .05], .028, brass, 'car_corner_post', 'metal', car, 10); for (let z = .3; z < 2.4; z += .3) add(new THREE.TorusGeometry(.031, .008, 6, 12), brassDk, 'post_ring', 'metal', V(x, y, z), car).rotation.x = Math.PI / 2; }
  const zb = C.z0 + .1, zt = C.z1 - .08, K = 1.6;   // diamond lattice: two families of diagonals, clipped to the side panel
  const clip = (yy, k) => { const pts = []; const add2 = (y, z) => { if (y >= C.y0 - 1e-6 && y <= C.y1 + 1e-6 && z >= zb - 1e-6 && z <= zt + 1e-6) pts.push([y, z]); };
    add2(C.y0, zb + (C.y0 - yy) * k); add2(C.y1, zb + (C.y1 - yy) * k); add2(yy + (zt - zb) / k * 0 + (zb - zb) / k, zb); add2(yy + (zt - zb) / k, zt); return pts.length >= 2 ? [pts[0], pts[pts.length - 1]] : null; };
  for (const x of [C.x0, C.x1]) { for (let yy = C.y0 - 2; yy < C.y1 + 2; yy += .26) for (const k of [K, -K]) { const s2 = clip(yy, k); if (s2 && Math.hypot(s2[1][0] - s2[0][0], s2[1][1] - s2[0][1]) > .05) bar([x, s2[0][0], s2[0][1]], [x, s2[1][0], s2[1][1]], .007, brass, 'lattice_bar', 'metal', car, 5); }
    for (let k = 0; k < 9; k++) bar([x, C.y0, C.z0 + .1 + k * .28], [x, C.y1, C.z0 + .1 + k * .28], .006, brassDk, 'lattice_rail', 'metal', car, 5); }
  bar([C.x0, C.y0, C.z1], [C.x1, C.y0, C.z1], .03, brass, 'car_top_beam_front', 'metal', car); bar([C.x0, C.y0, C.z0 + .9], [C.x0, C.y1, C.z0 + .9], .015, brass, 'side_rail', 'metal', car); bar([C.x1, C.y0, C.z0 + .9], [C.x1, C.y1, C.z0 + .9], .015, brass, 'side_rail', 'metal', car);
  for (let i = 0; i < 5; i++) { const x = C.x0 + .11 + i * (cw - .22) / 4; const s = add(new THREE.TorusGeometry(.07, .012, 6, 16, Math.PI * 1.5), brass, 'crest_scroll', 'metal', V(x, C.y0, C.z1 + .1), car); s.rotation.z = i % 2 ? .6 : -.6 + Math.PI; }
  add(new THREE.SphereGeometry(.045, 10, 8), brass, 'crest_finial', 'metal', V((C.x0 + C.x1) / 2, C.y0, C.z1 + .24), car);
  box(cw, C.y1 - C.y0, .04, toon('#6a2a18'), 'car_ceiling', 'wood', (C.x0 + C.x1) / 2, (C.y0 + C.y1) / 2, C.z1 + .02, car, false);
  add(new THREE.SphereGeometry(.09, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), glow('#fff0c8'), 'car_dome_lamp', 'lamp', V((C.x0 + C.x1) / 2, (C.y0 + C.y1) / 2, C.z1 - .07), car, false).rotation.x = Math.PI;
  // hoist cables above the car into the dark shaft, and the crosshead
  box(cw * .6, .1, .08, ink, 'car_crosshead', 'metal', (C.x0 + C.x1) / 2, (C.y0 + C.y1) / 2, C.z1 + .4, car, false);
  for (const dx of [-.05, 0, .05]) bar([(C.x0 + C.x1) / 2 + dx, (C.y0 + C.y1) / 2, C.z1 + .44], [(C.x0 + C.x1) / 2 + dx, (C.y0 + C.y1) / 2, 4.3], .007, toon('#4a4a52'), 'hoist_cable', 'metal', car, 5);
  // the folded scissor gate at the left jamb: a stack of flat bars with the diamond links squeezed shut
  for (let k = 0; k < 6; k++) bar([C.x1 - .03 - k * .018, C.y0 - .06, C.z0], [C.x1 - .03 - k * .018, C.y0 - .06, 2.35], .007, brass, 'gate_folded_bar', 'metal', car, 5);
  for (let z = .25; z < 2.3; z += .24) bar([C.x1 - .03, C.y0 - .06, z], [C.x1 - .12, C.y0 - .06, z + .1], .006, brassDk, 'gate_link', 'metal', car, 4);
  add(new THREE.SphereGeometry(.03, 8, 6), brass, 'gate_handle_knob', 'metal', V(C.x1 - .14, C.y0 - .09, 1.1), car);

  // ---------- THE MIRROR (hero object) on the back wall ----------
  const M = MIRROR, mw = M.x1 - M.x0, mh = M.z1 - M.z0, mcx = (M.x0 + M.x1) / 2, mcz = (M.z0 + M.z1) / 2;
  const glassT = canvasTex(THREE, 256, 640, (c, w, h) => { const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#e9f3fb'); g.addColorStop(.45, '#a9c6dc'); g.addColorStop(1, '#7d9cb8'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    const r = c.createRadialGradient(w * .2, h * .12, 4, w * .2, h * .12, 90); r.addColorStop(0, 'rgba(255,228,170,.95)'); r.addColorStop(1, 'rgba(255,228,170,0)'); c.fillStyle = r; c.fillRect(0, 0, w, h);   // the chandelier, reflected
    c.strokeStyle = 'rgba(120,90,40,.35)'; c.lineWidth = 3; for (let i = -6; i < 12; i++) { c.beginPath(); c.moveTo(i * 40, h); c.lineTo(i * 40 + 260, h - 600); c.stroke(); }                     // the lattice of the far side, reflected faint
    c.fillStyle = 'rgba(255,255,255,.85)'; for (const [x, wd] of [[60, 38], [118, 12], [150, 6]]) { c.beginPath(); c.moveTo(x, h); c.lineTo(x + wd, h); c.lineTo(x + wd + 210, 0); c.lineTo(x + 210, 0); c.fill(); }
    c.fillStyle = 'rgba(255,255,255,.9)'; c.fillRect(0, 0, w, 6); c.fillRect(0, 0, 6, h); });
  const mir = new THREE.Group(); mir.name = 'mirror_hero'; scene.add(mir);
  add(new THREE.PlaneGeometry(mw, mh), new THREE.MeshBasicMaterial({ map: glassT, toneMapped: false }), 'mirror_glass', 'glass', V(mcx, M.y - .028, mcz), mir, false);
  add(new THREE.PlaneGeometry(mw + .03, mh + .03), new THREE.MeshBasicMaterial({ color: '#dfe9f2' }), 'mirror_bevel', 'glass', V(mcx, M.y - .024, mcz), mir, false);
  const FR = .055; box(mw + 2 * FR, .05, FR, gilt, 'mirror_frame_top', 'metal', mcx, M.y - .02, M.z1 + FR / 2, mir); box(mw + 2 * FR, .05, FR, gilt, 'mirror_frame_bottom', 'metal', mcx, M.y - .02, M.z0 - FR / 2, mir);
  box(FR, .05, mh, gilt, 'mirror_frame_left', 'metal', M.x0 - FR / 2, M.y - .02, mcz, mir); box(FR, .05, mh, gilt, 'mirror_frame_right', 'metal', M.x1 + FR / 2, M.y - .02, mcz, mir);
  box(mw + 2 * FR, .01, .012, brassDk, 'mirror_frame_inner_bead', 'metal', mcx, M.y - .048, M.z1 - .004, mir, false); box(mw + 2 * FR, .01, .012, brassDk, 'mirror_frame_inner_bead', 'metal', mcx, M.y - .048, M.z0 + .004, mir, false);
  add(new THREE.TorusGeometry(.11, .022, 6, 16, Math.PI), gilt, 'mirror_crest_shell', 'metal', V(mcx, M.y - .02, M.z1 + FR), mir);
  for (const [x, z, k] of [[M.x0 - FR / 2, M.z1 + FR / 2, 'TL'], [M.x1 + FR / 2, M.z1 + FR / 2, 'TR'], [M.x0 - FR / 2, M.z0 - FR / 2, 'BL'], [M.x1 + FR / 2, M.z0 - FR / 2, 'BR']]) {
    add(new THREE.CylinderGeometry(.04, .04, .02, 14), gilt, 'mirror_rosette_' + k, 'metal', V(x, M.y - .05, z), mir).rotation.x = Math.PI / 2;
    const sc = add(new THREE.CylinderGeometry(.014, .014, k === 'TL' ? .04 : .012, 10), toon('#d8dde8'), 'mirror_screw_' + k, 'metal', V(x, M.y - (k === 'TL' ? .085 : .066), z), mir); sc.rotation.x = Math.PI / 2;
    box(.02, .003, .004, ink, 'screw_slot', 'metal', x, M.y - (k === 'TL' ? .106 : .073), z, mir, false); }
  bar([M.x0 - .09, M.y - .03, M.z1 + .1], [M.x0 - .05, M.y - .03, M.z1 + .1], .004, toon('#3a3a48'), 'pencil_mark', 'mark', mir, 4);
  // the open shipping crate on the floor under the mirror, its lid leaning on the lattice; straw; the toolbox
  const crateT = canvasTex(THREE, 512, 256, (c, w, h) => { c.fillStyle = '#d9b47a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#9a7040'; c.lineWidth = 4; for (let y = 0; y < h; y += 64) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    c.fillStyle = '#1e2a4a'; c.font = 'bold 64px Arial Black, Arial, sans-serif'; c.textAlign = 'center'; c.fillText('FRAGILE', w / 2, 92); c.font = 'bold 50px Arial Black, Arial, sans-serif'; c.fillText('MIRROR ↑', w / 2, 180);
    c.strokeStyle = '#b01e22'; c.lineWidth = 8; c.strokeRect(14, 14, w - 28, h - 28); });
  const crate = new THREE.Group(); crate.name = 'mirror_crate'; scene.add(crate);
  box(.66, .14, .34, [toon('#c99a5e'), toon('#c99a5e'), toon('#d8ad70'), toon('#b88a50'), new THREE.MeshLambertMaterial({ map: crateT }), toon('#c99a5e')], 'crate_box', 'wood', .7, .78, C.z0 + .17, crate);
  for (let i = 0; i < 9; i++) bar([.42 + i * .07, .74, C.z0 + .34], [.44 + i * .07 + rr(-.04, .04), .7 + rr(-.03, .03), C.z0 + .42 + rr(0, .05)], .006, toon('#f0d070'), 'packing_straw', 'straw', crate, 3);
  const lid = box(.7, .02, .38, new THREE.MeshLambertMaterial({ map: crateT }), 'crate_lid_leaning', 'wood', C.x1 - .05, .3, .3, crate); lid.rotation.y = Math.PI / 2 - .25; lid.rotation.z = .2;
  const tb = new THREE.Group(); tb.name = 'toolbox'; scene.add(tb); box(.36, .18, .16, toon('#b0242a'), 'toolbox_body', 'metal', .05, .02, C.z0 + .08, tb);
  bar([-.08, .02, C.z0 + .18], [.18, .02, C.z0 + .18], .01, ink, 'toolbox_handle', 'metal', tb); box(.12, .08, .12, toon('#d8dde8'), 'screw_jar', 'glass', .32, .1, C.z0 + .06, tb);

  // ---------- the lobby behind the queue (x < -0.3): side wall of the shaft, back wall with reception, clock, windows ----------
  // the open GRILLE SHAFT on the left of the car (the cage runs in an open ornamental shaft, the lobby is seen through it): uprights + a scroll band
  for (const y of []) bar([C.x0 - .3, y, 0], [C.x0 - .3, y, 4.2], .02, brassDk, 'grille_upright', 'metal');
  for (const z of [2.62, 2.78]) bar([C.x0 - .3, -0.2, z], [C.x0 - .3, 1.12, z], .014, brass, 'grille_band', 'metal');
  for (let i = 0; i < 6; i++) add(new THREE.TorusGeometry(.07, .01, 6, 14), brass, 'grille_scroll', 'metal', V(C.x0 - .3, -0.1 + i * .23, 2.7)).rotation.y = Math.PI / 2;
  box(9, .2, 4.3, wallUp, 'lobby_back_wall', 'wall', -4.8, 7.4, 2.15, scene, false); box(9, .05, 1.0, mahog, 'back_wainscot', 'wood', -4.8, 7.28, .5, scene, false);
  // the big wall clock (five to nine) over reception: Roman numerals, gilt sunburst rim
  const clockT = canvasTex(THREE, 400, 400, (c, w, h) => { c.fillStyle = '#fbf3dc'; c.beginPath(); c.arc(200, 200, 190, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#2a1a1f'; c.lineWidth = 8; c.stroke();
    c.fillStyle = '#2a1a1f'; c.font = 'bold 40px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].forEach((s, i) => { const a = -Math.PI / 2 + i * Math.PI / 6; c.fillText(s, 200 + Math.cos(a) * 150, 200 + Math.sin(a) * 150); });
    c.lineCap = 'round'; c.lineWidth = 14; const ah = -Math.PI / 2 + (8 + 55 / 60) * Math.PI / 6, am = -Math.PI / 2 + 55 * Math.PI / 30; c.beginPath(); c.moveTo(200, 200); c.lineTo(200 + Math.cos(ah) * 90, 200 + Math.sin(ah) * 90); c.stroke();
    c.lineWidth = 9; c.beginPath(); c.moveTo(200, 200); c.lineTo(200 + Math.cos(am) * 135, 200 + Math.sin(am) * 135); c.stroke(); c.beginPath(); c.arc(200, 200, 12, 0, Math.PI * 2); c.fill(); });
  add(new THREE.CircleGeometry(.55, 40), new THREE.MeshBasicMaterial({ map: clockT }), 'lobby_clock_face', 'sign', V(-1.6, 7.27, 3.05), scene, false);
  add(new THREE.TorusGeometry(.57, .05, 8, 40), gilt, 'clock_rim', 'metal', V(-1.6, 7.26, 3.05), scene, false);
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; bar([-1.6 + Math.cos(a) * .63, 7.27, 3.05 + Math.sin(a) * .63], [-1.6 + Math.cos(a) * (.78 + (i % 2) * .12), 7.27, 3.05 + Math.sin(a) * (.78 + (i % 2) * .12)], .018, gilt, 'clock_sunburst_ray', 'metal', scene, 5); }
  // reception desk: mahogany front with panels, marble top, brass bell, the register, the key rack with brass tags
  box(2.6, .6, 1.1, mahog, 'reception_desk', 'wood', -2.6, 6.6, .55, scene, true); box(2.7, .7, .06, toon('#f2e3c4'), 'desk_marble_top', 'stone', -2.6, 6.6, 1.13);
  for (let i = 0; i < 4; i++) box(.5, .02, .7, mahogDk, 'desk_panel', 'wood', -3.55 + i * .63, 6.29, .55, scene, false);
  add(new THREE.SphereGeometry(.07, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), brass, 'desk_bell', 'metal', V(-1.8, 6.45, 1.16)); box(.36, .26, .02, white, 'desk_register_book', 'paper', -2.4, 6.45, 1.17);
  box(1.6, .1, .9, mahogDk, 'key_rack', 'wood', -3.1, 7.25, 2.0, scene, false);
  for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) { box(.16, .02, .18, toon('#3a1a10'), 'key_cubby', 'wood', -3.78 + i * .195, 7.19, 1.68 + j * .21, scene, false); if ((i * 3 + j) % 4) box(.04, .01, .07, brass, 'key_tag', 'metal', -3.78 + i * .195, 7.17, 1.64 + j * .21, scene, false); }
  // arched windows on the evening street: blue glass, warm far windows
  const winT = canvasTex(THREE, 256, 512, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1b2f7a'); g.addColorStop(.7, '#3f62c0'); g.addColorStop(1, '#6a86d8'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#16204a'; for (let i = 0; i < 6; i++) { const bh = 120 + (i * 97) % 200; c.fillRect(i * 46 - 10, h - bh, 44, bh); } c.fillStyle = '#ffcf6a'; for (let i = 0; i < 40; i++) c.fillRect((i * 53) % w, h - 30 - (i * 71) % 260, 7, 10);
    c.strokeStyle = '#e4b444'; c.lineWidth = 8; c.strokeRect(4, 4, w - 8, h - 8); c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w / 2, h); c.moveTo(0, h * .45); c.lineTo(w, h * .45); c.stroke(); });
  for (const x of [-5.0, -6.9]) { add(new THREE.PlaneGeometry(1.1, 2.4), new THREE.MeshBasicMaterial({ map: winT }), 'arched_window', 'glass', V(x, 7.28, 2.1), scene, false); add(new THREE.CircleGeometry(.55, 24, 0, Math.PI), new THREE.MeshBasicMaterial({ color: '#2a3f96' }), 'window_arch', 'glass', V(x, 7.28, 3.3), scene, false);
    box(1.3, .08, .1, gilt, 'window_sill', 'metal', x, 7.24, .88, scene, false); }
  // marble columns with gilt capitals, palms in brass pots
  for (const [x, y] of [[-3.3, 3.2], [-3.3, 5.6]]) { add(new THREE.CylinderGeometry(.22, .24, 3.8, 20), toon('#f4e8d2'), 'marble_column', 'stone', V(x, y, 1.95)); add(new THREE.CylinderGeometry(.34, .24, .3, 20), gilt, 'column_capital', 'metal', V(x, y, 4.0)); add(new THREE.CylinderGeometry(.3, .32, .16, 20), gilt, 'column_base', 'metal', V(x, y, .08)); }
  for (const [x, y] of [[-2.4, 4.6], [-.95, 6.6]]) { add(new THREE.CylinderGeometry(.24, .18, .45, 16), brass, 'palm_pot', 'metal', V(x, y, .225)); for (let i = 0; i < 9; i++) { const a = i * 2.4, l = rr(.7, 1.1); const lf = add(new THREE.ConeGeometry(.09, l, 4), toon(i % 2 ? '#2f8a4a' : '#3fa45a'), 'palm_frond', 'plant', V(x + Math.cos(a) * l * .35, y + Math.sin(a) * l * .35, .5 + l * .45)); lf.rotation.set(Math.sin(a) * 1.0, 0, -Math.cos(a) * 1.0); } }
  // coffered ceiling (no shadow) with gilt ribs
  box(14, 12, .1, toon('#f0d8a8'), 'ceiling', 'ceiling', -2, 3, 4.3, scene, false);
  for (let x = -7; x <= 4; x += 1.4) box(.08, 12, .14, gilt, 'ceiling_rib', 'metal', x, 3, 4.2, scene, false); for (let y = -3; y <= 8; y += 1.4) box(14, .08, .14, gilt, 'ceiling_rib', 'metal', -2, y, 4.2, scene, false);

  // ---------- THE CHANDELIER (the warm key of the room) ----------
  const CH = [-.95, .7, 3.35], ch = new THREE.Group(); ch.name = 'crystal_chandelier'; scene.add(ch);
  bar([CH[0], CH[1], CH[2] + .35], [CH[0], CH[1], 4.25], .012, brass, 'chandelier_chain', 'metal', ch, 5);
  add(new THREE.SphereGeometry(.1, 12, 10), brass, 'chandelier_body', 'metal', V(CH[0], CH[1], CH[2] + .05), ch, false);
  for (const [r, z, n] of [[.48, -.05, 10], [.3, .22, 7]]) { const ring = add(new THREE.TorusGeometry(r, .016, 6, 40), brass, 'chandelier_ring', 'metal', V(CH[0], CH[1], CH[2] + z), ch, false); ring.rotation.x = Math.PI / 2;
    for (let i = 0; i < n; i++) { const a = i * Math.PI * 2 / n, x = CH[0] + Math.cos(a) * r, y = CH[1] + Math.sin(a) * r; add(new THREE.CylinderGeometry(.018, .018, .1, 8), white, 'candle_sleeve', 'lamp', V(x, y, CH[2] + z + .06), ch, false);
      add(new THREE.SphereGeometry(.032, 10, 8), glow('#fff2c6'), 'candle_bulb', 'lamp', V(x, y, CH[2] + z + .13), ch, false);
      for (let k = 0; k < 3; k++) add(new THREE.OctahedronGeometry(.022), new THREE.MeshBasicMaterial({ color: k % 2 ? '#fff8e8' : '#ffe0a0' }), 'crystal_drop', 'glass', V(x + Math.cos(a) * .02, y + Math.sin(a) * .02, CH[2] + z - .06 - k * .05), ch, false); } }
  for (let i = 0; i < 14; i++) { const a = i * Math.PI / 7; bar([CH[0] + Math.cos(a) * .48, CH[1] + Math.sin(a) * .48, CH[2] - .05], [CH[0] + Math.cos(a) * .16, CH[1] + Math.sin(a) * .16, CH[2] - .42], .004, toon('#fff4d8'), 'crystal_garland', 'glass', ch, 3); }
  add(new THREE.OctahedronGeometry(.07), new THREE.MeshBasicMaterial({ color: '#fff8e8' }), 'crystal_pendant', 'glass', V(CH[0], CH[1], CH[2] - .5), ch, false);
  const lamp = new THREE.PointLight('#ffc070', 5.5, 12, 1.2); lamp.position.copy(V(CH[0], CH[1], CH[2] - .1)); scene.add(lamp);
  const lamp2 = new THREE.PointLight('#ffd890', 2.2, 4, 1.4); lamp2.position.copy(V(.5, .45, 2.3)); scene.add(lamp2);   // the car's own dome lamp on the mirror and the janitor

  // ---------- foreground: brass stanchions with red velvet rope; the COMPLAINTS box ----------
  const velvet = toon('#b5161e');
  const stan = (x, y) => { add(new THREE.CylinderGeometry(.16, .18, .04, 18), brass, 'stanchion_foot', 'metal', V(x, y, .02)); bar([x, y, .04], [x, y, .95], .026, brass, 'stanchion_post', 'metal'); add(new THREE.SphereGeometry(.05, 12, 10), brass, 'stanchion_knob', 'metal', V(x, y, 1.0)); };
  const rope = (a, b) => { const pts = []; for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push(V(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, .9 - .22 * Math.sin(Math.PI * u))); } add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, .022, 8), velvet, 'velvet_rope', 'cloth'); };
  stan(-1.75, .2); stan(-1.75, 2.0); rope([-1.75, .2, 0], [-1.75, 2.0, 0]); stan(1.35, -.95); rope([1.35, -.95, 0], [1.35, -.25, 0]);
  const cbT = canvasTex(THREE, 256, 96, (c, w, h) => { c.fillStyle = '#5a2414'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd25a'; c.font = 'bold 40px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('COMPLAINTS', w / 2, h / 2 + 2); });
  box(.36, .26, .34, mahog, 'complaints_box', 'wood', 1.55, -.42, 1.12); add(new THREE.PlaneGeometry(.34, .13), new THREE.MeshBasicMaterial({ map: cbT }), 'complaints_label', 'sign', V(1.55, -.556, 1.15), scene, false);
  bar([1.55, -.42, 0], [1.55, -.42, .95], .02, brass, 'complaints_stand', 'metal');
  for (let i = 0; i < 9; i++) { const n = add(new THREE.PlaneGeometry(.08, .11), new THREE.MeshLambertMaterial({ color: i % 3 ? '#fbf6e8' : '#f4d8a8', side: THREE.DoubleSide }), 'complaint_slip', 'paper', V(1.48 + rr(0, .14), -.45 + rr(-.05, .05), 1.32 + rr(0, .1))); n.rotation.set(rr(-.6, .6), rr(-.8, .8), rr(-.6, .6)); }
  for (let i = 0; i < 4; i++) { const n = add(new THREE.PlaneGeometry(.08, .11), new THREE.MeshLambertMaterial({ color: '#fbf6e8', side: THREE.DoubleSide }), 'complaint_slip_floor', 'paper', V(1.35 + rr(0, .4), -.6 + rr(-.2, .2), .005)); n.rotation.set(-Math.PI / 2, 0, rr(0, 3)); }

  return { update: () => {}, anchors: { mirror_tl_screw: [MIRROR.x0 - .0275, MIRROR.y - .1, MIRROR.z1 + .0275] } };
}

// SET for pitch 4 hook (2026-11-16): OPERATING ROOM 3, a Houston veterans' hospital, 2002. The knee arthroscopy that was not done.
// Plan metres, Z up, Y forward (away from the lens). Origin = middle of the floor under the operating table.
// Parts: sea-green tiled walls with a steel skirting, speckled grey-green vinyl floor with a drain; THE OPERATING TABLE (black pad, steel side rails,
// column and base) with THE PATIENT under blue drapes: the bent right knee out of a drape window (orange iodine prep, three tiny cut marks, one blue
// stitch with its tails, the white stockinette over the shin and foot), the other leg straight, his sleeping head on a pillow in a blue hair cap;
// THE OR LAMP (twin-yoke arm from a ceiling hub, dome with six bulbs behind a glass, the sterile handle) = the hard key light, a see-through cone of
// light and a bright pool on the knee; the arthroscopy tower (monitor with NO SIGNAL, camera box, light source, pump with SALINE readout); IV pole with
// two SALINE bags; the instrument tray (Mayo stand, blue towel, scalpels, scissors, clamps, gauze, suture packs, a steel bowl of water); the back
// wall: X-ray light box with a knee film, the wall clock, OR 3 door with a round window, a glass-front steel cabinet; a steel kick bucket.
// Shader-free (canvas textures and plain materials), so no pow/sqrt NaN risk on the card.
export const KNEE = [0.36, 0.44, 1.3];
const canvasTex = (THREE, w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };

export async function build(THREE, scene, film, ctx) {
  const { B2T, toon } = ctx, V = (x, y, z) => B2T([x, y, z]);
  let seed = 7; const R0 = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * R0();
  const add = (geo, mat, name, role, p, parent = scene, shadow = true) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m; };
  const box = (sx, sy, sz, mat, name, role, x, y, z, parent, shadow) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, role, V(x, y, z), parent, shadow);
  const bar = (a, b, r, mat, name, role = 'metal', parent = scene, segs = 8) => { const A = V(...a), Bv = V(...b), d = Bv.clone().sub(A), L = Math.max(d.length(), 1e-4), m = add(new THREE.CylinderGeometry(r, r, L, segs), mat, name, role, A.clone().addScaledVector(d, .5), parent); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); return m; };
  const pb = ctx.pbr, steel = pb ? pb.metal('steel', { color: '#c8d0dc', rough: .3, env: 1.1, toon: '#c8d0dc' }) : toon('#c8d0dc'), steelDk = pb ? pb.metal('steel', { color: '#8a94a4', rough: .45, toon: '#8a94a4' }) : toon('#8a94a4');
  const glow = c => new THREE.MeshBasicMaterial({ color: c, toneMapped: false }), ink = toon('#2a1a1f'), white = toon('#f4f6f2');
  const drapeBlue = toon('#2f6fb8'), drapeBlueDk = toon('#24589a'), skin = toon('#fbf4ea');

  scene.children.forEach(o => { if (o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.radius === 400) o.visible = false; });
  scene.background = new THREE.Color('#123a36'); scene.fog = new THREE.Fog('#2f6a62', 9, 30);

  // ---------- floor: speckled grey-green sheet vinyl, coved; a round floor drain ----------
  const vinylT = canvasTex(THREE, 512, 512, (c, w, h) => { c.fillStyle = '#7f9a90'; c.fillRect(0, 0, w, h); for (let i = 0; i < 2600; i++) { c.fillStyle = ['#5f7a70', '#a9bdb4', '#6c867c', '#d6e2dc'][i % 4]; c.fillRect(R0() * w, R0() * h, 2 + R0() * 3, 2 + R0() * 2); }
    c.strokeStyle = 'rgba(40,60,52,.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.stroke(); }, [5, 5]);
  const floor = add(new THREE.PlaneGeometry(14, 14), new THREE.MeshStandardMaterial({ map: vinylT, roughness: .35, metalness: 0 }), 'or_vinyl_floor', 'floor', V(0, 1, 0)); floor.rotation.x = -Math.PI / 2; floor.castShadow = false;
  const drain = add(new THREE.CircleGeometry(.09, 20), steelDk, 'floor_drain', 'metal', V(-.6, -.9, .004), scene, false); drain.rotation.x = -Math.PI / 2;
  for (let i = -2; i <= 2; i++) { const s = add(new THREE.PlaneGeometry(.012, .15), ink, 'drain_slot', 'metal', V(-.6 + i * .03, -.9, .006), scene, false); s.rotation.x = -Math.PI / 2; }

  // ---------- walls: sea-green tiles (grid), steel skirting and a steel corner guard ----------
  const tileT = canvasTex(THREE, 512, 512, (c, w, h) => { c.fillStyle = '#3c9a86'; c.fillRect(0, 0, w, h); const n = 8, s = w / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { c.fillStyle = ['#3fae94', '#35a088', '#47b89c'][(i * 5 + j * 3) % 3]; c.fillRect(i * s + 2, j * s + 2, s - 4, s - 4); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(i * s + 6, j * s + 6, s * .3, 4); }
    c.strokeStyle = '#d8ebe4'; c.lineWidth = 4; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(i * s, 0); c.lineTo(i * s, h); c.stroke(); c.beginPath(); c.moveTo(0, i * s); c.lineTo(w, i * s); c.stroke(); } }, [6, 2]);
  const wallM = new THREE.MeshLambertMaterial({ map: tileT });
  box(8, .15, 3.2, wallM, 'back_wall_tiles', 'wall', 0, 3.1, 1.6, scene, false);
  const wl = box(.15, 8, 3.2, wallM, 'left_wall_tiles', 'wall', -2.8, 0, 1.6, scene, false), wr = box(.15, 8, 3.2, wallM, 'right_wall_tiles', 'wall', 2.8, 0, 1.6, scene, false);
  box(8, .03, .16, steel, 'skirting_back', 'metal', 0, 3.02, .08, scene, false); box(.03, 8, .16, steel, 'skirting_left', 'metal', -2.72, 0, .08, scene, false); box(.03, 8, .16, steel, 'skirting_right', 'metal', 2.72, 0, .08, scene, false);
  box(8, 8, .1, toon('#2c5a54'), 'ceiling', 'ceiling', 0, 1, 3.2, scene, false);
  for (const [x, y] of [[-1.6, -.6], [1.6, -.6], [-1.6, 2.2], [1.6, 2.2]]) box(.9, .5, .02, glow('#8fb8b0'), 'ceiling_light_panel', 'lamp', x, y, 3.14, scene, false);

  // ---------- back wall: X-ray light box with the knee film, clock, OR 3 door, steel cabinet ----------
  const xrayT = canvasTex(THREE, 512, 340, (c, w, h) => { c.fillStyle = '#eaf4fb'; c.fillRect(0, 0, w, h);
    for (const ox of [20, 270]) { c.fillStyle = '#121a22'; c.fillRect(ox, 14, 222, 312); c.fillStyle = 'rgba(220,235,245,.85)';
      c.beginPath(); c.moveTo(ox + 80, 20); c.lineTo(ox + 140, 20); c.lineTo(ox + 136, 140); c.quadraticCurveTo(ox + 160, 170, ox + 140, 178); c.lineTo(ox + 80, 178); c.quadraticCurveTo(ox + 60, 165, ox + 84, 140); c.fill();   // femur end
      c.beginPath(); c.moveTo(ox + 82, 190); c.lineTo(ox + 142, 190); c.quadraticCurveTo(ox + 150, 210, ox + 134, 222); c.lineTo(ox + 130, 320); c.lineTo(ox + 92, 320); c.lineTo(ox + 88, 222); c.quadraticCurveTo(ox + 72, 210, ox + 82, 190); c.fill();   // tibia
      c.beginPath(); c.ellipse(ox + 162, 168, 16, 28, .2, 0, Math.PI * 2); c.fill(); c.fillStyle = '#ffe9a0'; c.font = 'bold 22px Arial'; c.fillText(ox < 100 ? 'R' : 'L', ox + 12, 44); } });
  box(1.02, .08, .7, steel, 'xray_box_frame', 'metal', -1.25, 3.0, 1.75, scene, false);
  add(new THREE.PlaneGeometry(.96, .64), new THREE.MeshBasicMaterial({ map: xrayT, toneMapped: false }), 'xray_film', 'lamp', V(-1.25, 2.955, 1.75), scene, false);
  const clockT = canvasTex(THREE, 300, 300, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(150, 150, 140, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#2a1a1f'; c.lineWidth = 14; c.stroke();
    c.fillStyle = '#2a1a1f'; c.font = 'bold 34px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; for (let i = 1; i <= 12; i++) { const a = -Math.PI / 2 + i * Math.PI / 6; c.fillText(String(i), 150 + Math.cos(a) * 105, 150 + Math.sin(a) * 105); }
    c.lineCap = 'round'; c.lineWidth = 12; const ah = -Math.PI / 2 + 7.25 * Math.PI / 6, am = -Math.PI / 2 + 15 * Math.PI / 30; c.beginPath(); c.moveTo(150, 150); c.lineTo(150 + Math.cos(ah) * 60, 150 + Math.sin(ah) * 60); c.stroke();
    c.lineWidth = 8; c.beginPath(); c.moveTo(150, 150); c.lineTo(150 + Math.cos(am) * 95, 150 + Math.sin(am) * 95); c.stroke(); c.strokeStyle = '#e0242a'; c.lineWidth = 4; const as = -Math.PI / 2 + 41 * Math.PI / 30; c.beginPath(); c.moveTo(150, 150); c.lineTo(150 + Math.cos(as) * 110, 150 + Math.sin(as) * 110); c.stroke(); });
  add(new THREE.CircleGeometry(.24, 32), new THREE.MeshBasicMaterial({ map: clockT }), 'wall_clock_face', 'sign', V(.55, 3.0, 2.55), scene, false);
  add(new THREE.TorusGeometry(.245, .025, 8, 32), steel, 'wall_clock_rim', 'metal', V(.55, 3.0, 2.55), scene, false);
  // the OR 3 door: steel double door with round windows, push plates, the sign over it
  for (const dx of [-.42, .42]) { box(.82, .06, 2.15, toon('#9fb6c0'), 'or_door_leaf', 'metal', 1.85 + dx, 3.0, 1.08, scene, false); add(new THREE.CircleGeometry(.14, 24), glow('#bfe4f2'), 'door_porthole', 'glass', V(1.85 + dx, 2.965, 1.6), scene, false);
    add(new THREE.TorusGeometry(.145, .02, 6, 24), steel, 'porthole_ring', 'metal', V(1.85 + dx, 2.96, 1.6), scene, false); box(.12, .02, .3, steel, 'push_plate', 'metal', 1.85 + dx * .7, 2.965, 1.1, scene, false); box(.82, .03, .25, steel, 'kick_plate', 'metal', 1.85 + dx, 2.965, .14, scene, false); }
  const signT = canvasTex(THREE, 256, 96, (c, w, h) => { c.fillStyle = '#1d3f8a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.font = 'bold 60px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('OR 3', w / 2, h / 2 + 3); });
  add(new THREE.PlaneGeometry(.5, .19), new THREE.MeshBasicMaterial({ map: signT }), 'or3_sign', 'sign', V(1.85, 2.96, 2.4), scene, false);
  const inUseT = canvasTex(THREE, 256, 64, (c, w, h) => { c.fillStyle = '#300a0a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff4a3a'; c.font = 'bold 40px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('IN USE', w / 2, h / 2 + 2); });
  add(new THREE.PlaneGeometry(.34, .085), new THREE.MeshBasicMaterial({ map: inUseT, toneMapped: false }), 'in_use_light', 'lamp', V(1.85, 2.96, 2.6), scene, false);
  // glass-front steel cabinet with bottles and boxes
  box(.9, .4, 1.9, steel, 'cabinet_body', 'metal', -2.15, 2.75, .95, scene, true);
  for (let s = 0; s < 3; s++) { box(.84, .3, .02, steelDk, 'cabinet_shelf', 'metal', -2.15, 2.62, .65 + s * .45, scene, false);
    for (let k = 0; k < 6; k++) { const isB = (k + s) % 3; if (isB) add(new THREE.CylinderGeometry(.035, .035, .16, 10), toon(['#e8a23a', '#7fc6e8', '#f4f4f0'][k % 3]), 'cabinet_bottle', 'glass', V(-2.5 + k * .13, 2.62, .74 + s * .45));
      else box(.11, .1, .12, toon(['#f4f4f0', '#e2446c', '#3aa0d8'][s]), 'cabinet_box', 'paper', -2.5 + k * .13, 2.62, .72 + s * .45); } }
  box(.86, .02, 1.5, new THREE.MeshLambertMaterial({ color: '#dff4ff', transparent: true, opacity: .25 }), 'cabinet_glass', 'glass', -2.15, 2.53, 1.15, scene, false);

  // ---------- THE OPERATING TABLE ----------
  const T = { x0: -1.0, x1: .55, y: .62, w: .56, z: .85 };
  box(T.x1 - T.x0, T.w, .09, toon('#2a2f3a'), 'table_pad', 'leather', (T.x0 + T.x1) / 2, T.y, T.z - .045);
  for (const s of [-1, 1]) bar([T.x0, T.y + s * (T.w / 2 + .02), T.z - .1], [T.x1, T.y + s * (T.w / 2 + .02), T.z - .1], .012, steel, 'table_side_rail');
  box(T.x1 - T.x0 - .05, T.w - .05, .12, steelDk, 'table_frame', 'metal', (T.x0 + T.x1) / 2, T.y, T.z - .16);
  add(new THREE.CylinderGeometry(.13, .15, T.z - .3, 18), steel, 'table_column', 'metal', V(-.2, T.y, (T.z - .3) / 2 + .1));
  box(1.0, .5, .1, steelDk, 'table_base', 'metal', -.2, T.y, .05); box(.16, .16, .14, toon('#2a2f3a'), 'table_pedal', 'rubber', .2, T.y - .2, .07);
  // drapes hanging off the near side to the floor-ish, with folds
  const drapeT = canvasTex(THREE, 512, 256, (c, w, h) => { c.fillStyle = '#2f6fb8'; c.fillRect(0, 0, w, h); for (let i = 0; i < 14; i++) { const x = i * w / 14 + rr(-6, 6); const g = c.createLinearGradient(x, 0, x + w / 14, 0); g.addColorStop(0, 'rgba(10,30,70,.35)'); g.addColorStop(.5, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(10,30,70,.35)'); c.fillStyle = g; c.fillRect(x, 0, w / 14, h); } });
  const drapeHang = new THREE.MeshLambertMaterial({ map: drapeT, side: THREE.DoubleSide });
  box(T.x1 - T.x0 + .1, .015, .55, drapeHang, 'drape_hang_front', 'cloth', (T.x0 + T.x1) / 2, T.y - T.w / 2 - .04, T.z - .28, scene, false);
  box(.015, T.w + .1, .5, drapeHang, 'drape_hang_foot', 'cloth', T.x1 + .05, T.y, T.z - .26, scene, false);
  // the patient: torso and straight left leg under the blue drape (rounded), the bent RIGHT knee out of a drape window
  const torso = add(new THREE.CapsuleGeometry(.2, .55, 6, 14), drapeBlue, 'patient_torso_drape', 'cloth', V(-.55, T.y, T.z + .1)); torso.rotation.z = Math.PI / 2; torso.scale.set(1, 1, .7);
  const legL = add(new THREE.CapsuleGeometry(.08, .55, 6, 12), drapeBlueDk, 'patient_left_leg_drape', 'cloth', V(.27, T.y + .12, T.z + .07)); legL.rotation.z = Math.PI / 2;
  const K = KNEE, hip = [-.08, .44, T.z + .1], foot = [.5, .44, T.z + .08];
  const thigh = bar(hip, [K[0] - .02, K[1], K[2] - .04], .095, drapeBlue, 'patient_thigh_drape', 'cloth', scene, 14);
  const shin = bar([K[0] + .02, K[1], K[2] - .05], foot, .07, toon('#9fd0f0'), 'stockinette_shin', 'cloth', scene, 14);
  for (let i = 1; i < 6; i++) { const u = i / 6; add(new THREE.TorusGeometry(.072, .006, 5, 14), toon('#7fb4dc'), 'stockinette_rib', 'cloth', V(K[0] + .02 + (foot[0] - K[0] - .02) * u, K[1], K[2] - .05 + (foot[2] - K[2] + .05) * u)).rotation.set(0, Math.PI / 2, -.95); }
  const footM = add(new THREE.SphereGeometry(.08, 12, 10), toon('#9fd0f0'), 'stockinette_foot', 'cloth', V(foot[0] + .04, foot[1], foot[2] + .03)); footM.scale.set(1.5, .9, 1.2);
  // the knee: bare skin ball with the orange iodine prep and the drape window (a blue frame with tape edges) round it
  const kneeT = canvasTex(THREE, 256, 256, (c, w, h) => { c.fillStyle = '#fbf4ea'; c.fillRect(0, 0, w, h); const g = c.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, 120); g.addColorStop(0, '#e8962e'); g.addColorStop(.75, '#d4762a'); g.addColorStop(1, 'rgba(212,118,42,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(150,70,20,.45)'; c.lineWidth = 5; for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(w / 2, h / 2, 30 + i * 13, rr(0, 3), rr(3, 6)); c.stroke(); } });
  const knee = add(new THREE.SphereGeometry(.13, 22, 16), toon('#ee8f2c'), 'patient_knee_prepped', 'skin', V(...K)); knee.scale.set(1, .95, 1.05); knee.rotation.set(-Math.PI / 2, 0, 0);
  const win = add(new THREE.TorusGeometry(.13, .03, 8, 24), drapeBlue, 'drape_window_frame', 'cloth', V(K[0], K[1] + .03, K[2] - .02)); win.rotation.set(-.15, 0, 0); win.scale.set(1, 1.05, 1);
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; box(.04, .01, .02, toon('#f4f4f0'), 'drape_tape', 'cloth', K[0] + Math.cos(a) * .135, K[1] - .01, K[2] - .02 + Math.sin(a) * .135, scene, false); }
  // THE THREE TINY CUTS (dark little slits on the knee's front face) and THE STITCH on the first one (blue cross-thread + two tails)
  const fz = K[1] - .108;
  for (const [dx, dz, k] of [[-.05, .03, 'a'], [.045, .035, 'b'], [0, -.045, 'c']]) { const s = box(.026, .004, .007, toon('#7a2a2a'), 'tiny_cut_' + k, 'mark', K[0] + dx, fz + Math.abs(dx) * .4, K[2] + dz, scene, false); s.rotation.y = .3; }
  const stitch = new THREE.Group(); stitch.name = 'the_stitch'; scene.add(stitch);
  bar([K[0] - .065, fz - .004, K[2] + .045], [K[0] - .035, fz - .004, K[2] + .015], .0022, toon('#2a4cc8'), 'stitch_x1', 'cloth', stitch, 4);
  bar([K[0] - .065, fz - .004, K[2] + .015], [K[0] - .035, fz - .004, K[2] + .045], .0022, toon('#2a4cc8'), 'stitch_x2', 'cloth', stitch, 4);
  bar([K[0] - .035, fz - .005, K[2] + .045], [K[0] - .02, fz - .01, K[2] + .07], .0018, toon('#2a4cc8'), 'stitch_tail', 'cloth', stitch, 4);
  // his sleeping head on the pillow, in a blue hair cap, under the drape edge (2D look: white ball, ink rim, closed eyes)
  const pil = add(new THREE.BoxGeometry(.4, .1, .32), white, 'pillow', 'cloth', V(-.88, T.y, T.z + .05)); pil.scale.set(1, 1, 1);
  const faceT = canvasTex(THREE, 256, 256, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a1a1f'; c.lineWidth = 9; c.lineCap = 'round';
    for (const x of [90, 166]) { c.beginPath(); c.arc(x, 128, 16, .15 * Math.PI, .85 * Math.PI); c.stroke(); } c.beginPath(); c.ellipse(128, 176, 12, 9, 0, 0, Math.PI * 2); c.fillStyle = '#2a1a1f'; c.fill(); });
  const headG = new THREE.Group(); headG.name = 'patient_head'; headG.position.copy(V(-.86, T.y - .02, T.z + .23)); scene.add(headG);
  add(new THREE.SphereGeometry(.13, 20, 16), new THREE.MeshBasicMaterial({ color: '#2a1a1f', side: THREE.BackSide }), 'head_ink_rim', 'skin', new THREE.Vector3(0, 0, 0), headG, false).scale.setScalar(1.08);
  const hf = add(new THREE.SphereGeometry(.13, 20, 16), new THREE.MeshLambertMaterial({ map: faceT }), 'patient_face', 'skin', new THREE.Vector3(0, 0, 0), headG); hf.rotation.y = -Math.PI / 2 + .35;
  const cap = add(new THREE.SphereGeometry(.137, 20, 10, 0, Math.PI * 2, 0, Math.PI * .45), toon('#5f9ad8'), 'patient_hair_cap', 'cloth', new THREE.Vector3(0, 0, 0), headG); cap.rotation.z = .9;
  // the drape pulled up to his chin
  box(.12, T.w + .04, .08, drapeBlue, 'drape_chin_fold', 'cloth', -.7, T.y, T.z + .1);

  // ---------- THE OR LAMP: ceiling hub, twin yoke, the dome with six bulbs, the handle; the hard key light and its cone ----------
  const LMP = [.18, .5, 2.3], lampG = new THREE.Group(); lampG.name = 'or_lamp'; scene.add(lampG);
  add(new THREE.CylinderGeometry(.12, .12, .1, 16), steel, 'lamp_ceiling_hub', 'metal', V(.9, 1.2, 3.1), lampG); bar([.9, 1.2, 3.08], [.9, 1.2, 2.85], .035, steel, 'lamp_drop_tube', 'metal', lampG);
  bar([.9, 1.2, 2.85], [.4, .6, 2.75], .04, steel, 'lamp_arm', 'metal', lampG); bar([.4, .6, 2.75], [LMP[0], LMP[1], LMP[2] + .2], .03, steel, 'lamp_yoke', 'metal', lampG);
  const dome = add(new THREE.SphereGeometry(.36, 28, 14, 0, Math.PI * 2, 0, Math.PI * .42), toon('#e6eef2'), 'lamp_dome', 'metal', V(...LMP), lampG); dome.scale.set(1, .55, 1);
  add(new THREE.TorusGeometry(.33, .025, 8, 32), steelDk, 'lamp_rim', 'metal', V(LMP[0], LMP[1], LMP[2] - .01), lampG).rotation.x = Math.PI / 2;
  const face = add(new THREE.CircleGeometry(.32, 32), glow('#fffbe8'), 'lamp_glass', 'lamp', V(LMP[0], LMP[1], LMP[2] - .02), lampG, false); face.rotation.x = Math.PI / 2;
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3, b = add(new THREE.CircleGeometry(.07, 18), glow('#ffffff'), 'lamp_bulb', 'lamp', V(LMP[0] + Math.cos(a) * .19, LMP[1] + Math.sin(a) * .19, LMP[2] - .03), lampG, false); b.rotation.x = Math.PI / 2;
    const r = add(new THREE.TorusGeometry(.075, .008, 5, 16), steel, 'bulb_reflector_ring', 'metal', V(LMP[0] + Math.cos(a) * .19, LMP[1] + Math.sin(a) * .19, LMP[2] - .035), lampG, false); r.rotation.x = Math.PI / 2; }
  bar([LMP[0], LMP[1], LMP[2] - .03], [LMP[0], LMP[1], LMP[2] - .2], .025, toon('#3aa0d8'), 'lamp_sterile_handle', 'rubber', lampG);
  const spot = new THREE.SpotLight('#fff3d8', 60, 6, .42, .35, 1.4); spot.position.copy(V(LMP[0], LMP[1], LMP[2] - .05)); spot.target.position.copy(V(K[0] + .05, K[1] + .05, K[2] - .2));
  spot.castShadow = true; spot.shadow.mapSize.set(2048, 2048); spot.shadow.bias = -.0006; spot.shadow.radius = 2; scene.add(spot); scene.add(spot.target);
  // the see-through cone of light from the glass down past the knee to a pool on the floor
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(.28, .85, LMP[2] - .05, 32, 1, true), new THREE.MeshBasicMaterial({ color: '#ffe9b0', transparent: true, opacity: .045, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  cone.name = 'lamp_light_cone'; cone.userData.role = 'lamp'; cone.position.copy(V(LMP[0] + .05, LMP[1] + .02, (LMP[2] - .05) / 2)); scene.add(cone);
  const pool = add(new THREE.CircleGeometry(1.0, 40), new THREE.MeshBasicMaterial({ color: '#fff0c0', transparent: true, opacity: .16, depthWrite: false, blending: THREE.AdditiveBlending }), 'floor_light_pool', 'lamp', V(LMP[0] + .1, LMP[1] + .05, .008), scene, false); pool.rotation.x = -Math.PI / 2;
  for (let i = 0; i < 26; i++) add(new THREE.SphereGeometry(.006, 5, 4), glow('#fff6d8'), 'dust_in_light', 'lamp', V(LMP[0] + rr(-.4, .4), LMP[1] + rr(-.3, .3), rr(1.4, 2.2)), scene, false);

  // ---------- the arthroscopy tower: cart, NO SIGNAL monitor, camera box, light source, pump ----------
  const TW = [.42, 2.45], tw = new THREE.Group(); tw.name = 'arthroscopy_tower'; scene.add(tw);
  box(.62, .5, .06, steelDk, 'tower_base', 'metal', TW[0], TW[1], .1, tw); for (const [dx, dy] of [[-.26, -.2], [.26, -.2], [-.26, .2], [.26, .2]]) add(new THREE.SphereGeometry(.04, 8, 6), ink, 'tower_caster', 'rubber', V(TW[0] + dx, TW[1] + dy, .04), tw);
  for (const dx of [-.28, .28]) bar([TW[0] + dx, TW[1] - .2, .1], [TW[0] + dx, TW[1] - .2, 1.35], .02, steel, 'tower_post', 'metal', tw);
  const unitT = (label, col) => canvasTex(THREE, 256, 64, (c, w, h) => { c.fillStyle = '#e4e8ec'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a2f3a'; c.font = 'bold 22px Arial'; c.fillText(label, 10, 26); c.fillStyle = col; c.fillRect(170, 14, 70, 34); c.fillStyle = '#0a1a10'; c.font = 'bold 22px monospace'; c.fillText(label === 'PUMP' ? '0.0' : 'OFF', 180, 40);
    for (let i = 0; i < 4; i++) { c.fillStyle = ['#3aa0d8', '#e2446c', '#5ac85a', '#f2c230'][i]; c.beginPath(); c.arc(20 + i * 30, 48, 7, 0, Math.PI * 2); c.fill(); } });
  [['CAMERA', '#7fe08a'], ['LIGHT', '#ffd04a'], ['PUMP', '#7fd6ff']].forEach(([lb, col], i) => { const z = .35 + i * .26;
    box(.56, .42, .2, [toon('#c8ccd2'), toon('#c8ccd2'), toon('#d8dce2'), toon('#a8acb2'), new THREE.MeshLambertMaterial({ map: unitT(lb, col) }), toon('#c8ccd2')], 'tower_unit_' + lb.toLowerCase(), 'metal', TW[0], TW[1], z, tw); });
  box(.58, .44, .03, steelDk, 'tower_top_shelf', 'metal', TW[0], TW[1], 1.12, tw);
  const monT = canvasTex(THREE, 512, 340, (c, w, h) => { c.fillStyle = '#1a3fb0'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.font = 'bold 74px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('NO SIGNAL', w / 2, h / 2 - 10);
    c.font = 'bold 26px Arial'; c.fillStyle = '#bcd0ff'; c.fillText('ARTHROSCOPE: NOT CONNECTED', w / 2, h / 2 + 62); });
  box(.7, .12, .5, ink, 'monitor_shell', 'plastic', TW[0], TW[1] - .05, 1.42, tw); add(new THREE.PlaneGeometry(.62, .42), new THREE.MeshBasicMaterial({ map: monT, toneMapped: false }), 'monitor_screen_no_signal', 'lamp', V(TW[0], TW[1] - .115, 1.42), tw, false);
  box(.1, .1, .1, steelDk, 'monitor_neck', 'metal', TW[0], TW[1], 1.16, tw); add(new THREE.SphereGeometry(.015, 6, 4), glow('#5aff6a'), 'monitor_power_led', 'lamp', V(TW[0] + .28, TW[1] - .115, 1.19), tw, false);
  // the coiled camera cable lying unused on the top shelf (the scope never went in)
  for (let i = 0; i < 3; i++) { const r = add(new THREE.TorusGeometry(.09 - i * .015, .008, 6, 22), toon('#3a3f4a'), 'unused_scope_cable', 'rubber', V(TW[0] - .1, TW[1] - .05, 1.15 + i * .012), tw); r.rotation.x = Math.PI / 2; }

  // ---------- IV pole with two SALINE bags and a drip line looping down ----------
  const IV = [1.25, 1.75]; bar([IV[0], IV[1], .05], [IV[0], IV[1], 2.1], .014, steel, 'iv_pole'); for (let i = 0; i < 5; i++) bar([IV[0], IV[1], .06], [IV[0] + Math.cos(i * 1.256) * .25, IV[1] + Math.sin(i * 1.256) * .25, .03], .012, steel, 'iv_base_leg');
  bar([IV[0] - .18, IV[1], 2.08], [IV[0] + .18, IV[1], 2.08], .01, steel, 'iv_hook_bar');
  const salT = canvasTex(THREE, 128, 192, (c, w, h) => { c.fillStyle = '#eaf6fb'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d3f8a'; c.fillRect(0, 34, w, 38); c.fillStyle = '#ffffff'; c.font = 'bold 26px Arial'; c.textAlign = 'center'; c.fillText('SALINE', w / 2, 62); c.fillStyle = '#1d3f8a'; c.font = 'bold 18px Arial'; c.fillText('0.9% NaCl', w / 2, 100); c.fillText('3000 mL', w / 2, 124); });
  for (const dx of [-.13, .13]) { const bag = add(new THREE.BoxGeometry(.2, .3, .05), [toon('#dff0f8'), toon('#dff0f8'), toon('#dff0f8'), toon('#dff0f8'), new THREE.MeshLambertMaterial({ map: salT }), toon('#dff0f8')], 'saline_bag', 'plastic', V(IV[0] + dx, IV[1] - .02, 1.85)); bag.scale.set(1, 1, 1); }
  const tube = []; for (let i = 0; i <= 12; i++) { const u = i / 12; tube.push(V(IV[0] - .13 + u * .05, IV[1] - .03 - u * .3, 1.7 - 1.2 * u + .35 * Math.sin(Math.PI * u) * u)); }
  add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tube), 30, .006, 5), new THREE.MeshLambertMaterial({ color: '#e8f6ff', transparent: true, opacity: .7 }), 'saline_tube', 'plastic');

  // ---------- THE INSTRUMENT TRAY (Mayo stand) in the foreground ----------
  const MY = [-.98, -.75, .95], my = new THREE.Group(); my.name = 'instrument_tray'; scene.add(my);
  box(.62, .4, .025, steel, 'mayo_tray', 'metal', MY[0], MY[1], MY[2], my); for (const s of [-1, 1]) box(.62, .015, .04, steel, 'mayo_tray_lip', 'metal', MY[0], MY[1] + s * .2, MY[2] + .02, my); for (const s of [-1, 1]) box(.015, .4, .04, steel, 'mayo_tray_lip', 'metal', MY[0] + s * .31, MY[1], MY[2] + .02, my);
  bar([MY[0] - .32, MY[1], MY[2] - .02], [MY[0] - .32, MY[1], .08], .022, steel, 'mayo_post', 'metal', my); box(.5, .5, .04, steelDk, 'mayo_base', 'metal', MY[0] - .32, MY[1] + .1, .04, my);
  box(.58, .36, .012, toon('#3a8ad0'), 'tray_towel', 'cloth', MY[0], MY[1], MY[2] + .02, my);
  const onT = MY[2] + .03;
  for (let i = 0; i < 2; i++) { box(.16, .016, .006, steel, 'tray_scalpel', 'metal', MY[0] - .2, MY[1] - .12 + i * .04, onT, my); box(.03, .012, .004, toon('#ffffff'), 'tray_scalpel_blade', 'metal', MY[0] - .1, MY[1] - .12 + i * .04, onT + .002, my); }
  for (let i = 0; i < 3; i++) { const sx = MY[0] - .02 + i * .07; bar([sx, MY[1] - .14, onT + .004], [sx + .01, MY[1] + .06, onT + .004], .0045, steel, 'tray_clamp_shaft', 'metal', my, 5); add(new THREE.TorusGeometry(.016, .004, 5, 12), steel, 'tray_clamp_ring', 'metal', V(sx - .008, MY[1] - .16, onT + .004), my).rotation.x = Math.PI / 2; add(new THREE.TorusGeometry(.016, .004, 5, 12), steel, 'tray_clamp_ring', 'metal', V(sx + .012, MY[1] - .16, onT + .004), my).rotation.x = Math.PI / 2; }
  for (let i = 0; i < 4; i++) box(.1, .1, .008, toon('#ffffff'), 'tray_gauze', 'cloth', MY[0] + .2, MY[1] - .1, onT + .004 + i * .008, my);
  const sutT = canvasTex(THREE, 128, 96, (c, w, h) => { c.fillStyle = '#f4f4f0'; c.fillRect(0, 0, w, h); c.fillStyle = '#5a3aa8'; c.fillRect(0, 0, w, 26); c.fillStyle = '#ffffff'; c.font = 'bold 18px Arial'; c.fillText('SUTURE 3-0', 8, 19); c.strokeStyle = '#2a4cc8'; c.lineWidth = 3; c.beginPath(); c.arc(64, 62, 20, 0, Math.PI * 1.6); c.stroke(); });
  for (let i = 0; i < 2; i++) box(.11, .08, .01, [toon('#f4f4f0'), toon('#f4f4f0'), new THREE.MeshLambertMaterial({ map: sutT }), toon('#f4f4f0'), toon('#f4f4f0'), toon('#f4f4f0')], 'tray_suture_pack', 'paper', MY[0] + .2, MY[1] + .08 + i * .01, onT + .006 + i * .01, my);
  // the steel bowl of water (saline) with a ripple, where the bulb was filled
  const bowl = add(new THREE.SphereGeometry(.09, 20, 10, 0, Math.PI * 2, Math.PI * .5, Math.PI * .5), new THREE.MeshLambertMaterial({ color: '#c8d0dc', side: THREE.DoubleSide }), 'saline_bowl', 'metal', V(MY[0] - .05, MY[1] + .1, onT + .085), my); bowl.scale.y = .9;
  const wat = add(new THREE.CircleGeometry(.08, 24), new THREE.MeshBasicMaterial({ color: '#8fdcff' }), 'bowl_water', 'water', V(MY[0] - .05, MY[1] + .1, onT + .06), my, false); wat.rotation.x = -Math.PI / 2;
  const rip = add(new THREE.RingGeometry(.03, .036, 24), new THREE.MeshBasicMaterial({ color: '#ffffff' }), 'bowl_ripple', 'water', V(MY[0] - .05, MY[1] + .1, onT + .062), my, false); rip.rotation.x = -Math.PI / 2;

  // ---------- the kick bucket and the foot switch on the floor; a wet spot of splashed water under the knee ----------
  const kb = add(new THREE.CylinderGeometry(.2, .16, .3, 20, 1, true), new THREE.MeshLambertMaterial({ color: '#c8d0dc', side: THREE.DoubleSide }), 'kick_bucket', 'metal', V(1.25, -.35, .2)); add(new THREE.TorusGeometry(.2, .012, 6, 24), steel, 'kick_bucket_rim', 'metal', V(1.25, -.35, .35)).rotation.x = Math.PI / 2;
  add(new THREE.CylinderGeometry(.18, .18, .07, 18), steelDk, 'kick_bucket_dolly', 'metal', V(1.25, -.35, .04));
  box(.26, .18, .05, toon('#2a2f3a'), 'foot_switch', 'rubber', 1.3, .35, .025); bar([1.3, .45, .03], [.6, .9, .03], .008, toon('#2a2f3a'), 'foot_switch_cable', 'rubber');
  const wet = add(new THREE.CircleGeometry(.22, 24), new THREE.MeshBasicMaterial({ color: '#a8e4f8', transparent: true, opacity: .45 }), 'splash_puddle', 'water', V(.38, .2, .006), scene, false); wet.rotation.x = -Math.PI / 2; wet.scale.set(1.3, .8, 1);

  return { update: () => {}, anchors: { knee: K, knee_top: [K[0], K[1] - .05, K[2] + .09], knee_cut_a: [K[0] - .05, fz, K[2] + .03] } };
}

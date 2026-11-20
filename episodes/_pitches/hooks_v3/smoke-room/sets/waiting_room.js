// SET for pitch 3 hook (2026-11-16): THE SMOKE ROOM, a small waiting room of the psychology department, Columbia University, New York, 1968.
// Plan metres, Z up, Y forward (away from the lens). Origin = the floor under the front edge of the student's table.
// Parts: speckled vinyl tile floor; teal dado + mint upper walls with a wooden chair rail; acoustic-tile ceiling; THE WALL VENT (louvred steel grille,
// four screws, dark duct behind, soot smear) and THE SMOKE (puffs out of the vent that roll forward, rise, spread under the ceiling and sink as a layer,
// thicker every second); the ONE-WAY MIRROR (dark glass, aluminium frame, the faint observer with a clipboard behind it); the school clock; the cork
// notice board with flyers; the door with the frosted window "ROOM 418 PSYCHOLOGY"; the window with venetian blinds and the radiator; coat rack with a
// trench coat and umbrella; three small 1960s tables (walnut tops, chrome tube legs) with the questionnaires, pencils, a glass ashtray, the Greek-key
// coffee cup, books, a pipe pouch, a folded newspaper; shell chairs on chrome legs; the green enamel pendant lamp over the student = THE KEY LIGHT
// (one hard spot with real shadows + a visible cone that shows up more as the smoke thickens); a chrome pedestal ashtray and a wastebasket in front.
// Canvas textures and stock materials only (no custom shaders, so no pow/sqrt NaN risk on the card).
export const TT = 0.6;                                     // table top height (= rig DT 690 on the seated cards)
export const VENT = { x: -0.85, y: 2.47, z: 2.33 };
export const LAMP = { x: 0.0, y: -0.05, z: 2.42 };
const CEIL = 2.9, BACK = 2.5, LEFT = -2.6, RIGHT = 2.6;

const canvasTex = (THREE, w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };

export async function build(THREE, scene, film, ctx) {
  const { B2T, toon } = ctx, V = (x, y, z) => B2T([x, y, z]);
  let seed = 7; const R0 = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * R0();
  const add = (geo, mat, name, role, p, parent = scene, shadow = true) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m; };
  const box = (sx, sy, sz, mat, name, role, x, y, z, parent, shadow) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, role, V(x, y, z), parent, shadow);
  const bar = (a, b, r, mat, name, role = 'metal', parent = scene, segs = 8) => { const A = V(...a), Bv = V(...b), d = Bv.clone().sub(A), L = Math.max(d.length(), 1e-4), m = add(new THREE.CylinderGeometry(r, r, L, segs), mat, name, role, A.clone().addScaledVector(d, .5), parent); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); return m; };
  const plane = (w, h, mat, name, role, x, y, z, ry = 0, parent = scene) => { const m = add(new THREE.PlaneGeometry(w, h), mat, name, role, V(x, y, z), parent, false); m.rotation.y = ry; return m; };   // faces -y (the lens) by default
  const pb = ctx.pbr, chrome = pb ? pb.metal('brass', { color: '#d8dee6', rough: .22, env: 1.2, toon: '#d8dee6' }) : toon('#d8dee6'), alu = pb ? pb.metal('brass', { color: '#b8c0c8', rough: .4, toon: '#b8c0c8' }) : toon('#b8c0c8');
  const brass = pb ? pb.metal('brass', { color: '#d9a93a', rough: .35, toon: '#d9a93a' }) : toon('#d9a93a');
  const walnut = ctx.relief ? ctx.relief('wood', '#8a5228', { size: .8 }) : toon('#8a5228'), oak = ctx.relief ? ctx.relief('wood', '#b07a44', { size: 1 }) : toon('#b07a44');
  const ink = toon('#2a1a1f'), basic = (c, o = {}) => new THREE.MeshBasicMaterial({ color: c, ...o }), lam = (map, o = {}) => new THREE.MeshLambertMaterial({ map, ...o });
  const txt = (w, h, bg, draw) => canvasTex(THREE, w, h, (c, W, H) => { if (bg) { c.fillStyle = bg; c.fillRect(0, 0, W, H); } draw(c, W, H); });

  // ---------- the kit's sky off; the room's own air ----------
  scene.children.forEach(o => { if (o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.radius === 400) o.visible = false; });
  scene.background = new THREE.Color('#1c2a28'); scene.fog = new THREE.Fog('#9fd2c2', 10, 34);

  // ---------- floor: speckled vinyl tiles, cream and sage, with scuffs ----------
  const tileT = txt(512, 512, null, (c, w, h) => { const n = 4, s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { c.fillStyle = (i + j) % 2 ? '#4f9a6a' : '#f2d08e'; c.fillRect(i * s, j * s, s, s);
      for (let k = 0; k < 160; k++) { c.fillStyle = ['rgba(60,50,40,.35)', 'rgba(255,255,255,.4)', 'rgba(120,90,60,.3)'][k % 3]; c.fillRect(i * s + R0() * s, j * s + R0() * s, 2 + R0() * 3, 2 + R0() * 2); } }
    c.strokeStyle = 'rgba(40,40,30,.45)'; c.lineWidth = 2; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(i * s, 0); c.lineTo(i * s, h); c.stroke(); c.beginPath(); c.moveTo(0, i * s); c.lineTo(w, i * s); c.stroke(); }
    c.strokeStyle = 'rgba(30,25,20,.25)'; c.lineWidth = 3; for (let k = 0; k < 6; k++) { c.beginPath(); const x = R0() * w, y = R0() * h; c.moveTo(x, y); c.quadraticCurveTo(x + 30, y + 10, x + 60, y - 4); c.stroke(); } }, [4, 4]);
  const floor = add(new THREE.PlaneGeometry(5.2, 7), new THREE.MeshStandardMaterial({ map: tileT, roughness: .45, metalness: 0 }), 'vinyl_tile_floor', 'floor', V(0, -1, 0)); floor.rotation.x = -Math.PI / 2; floor.castShadow = false;
  box(5.2, .02, .1, toon('#2a3a36'), 'cove_base_back', 'wall', 0, BACK - .01, .05, scene, false);

  // ---------- walls: teal dado to 1.0 m, mint above, oak chair rail; acoustic tile ceiling ----------
  const upT = txt(256, 256, '#38b496', (c, w, h) => { for (let k = 0; k < 900; k++) { c.fillStyle = R0() < .5 ? 'rgba(255,255,255,.12)' : 'rgba(30,80,70,.10)'; c.fillRect(R0() * w, R0() * h, 2, 2); } });
  upT.wrapS = upT.wrapT = THREE.RepeatWrapping; upT.repeat.set(4, 3);
  const dadoT = txt(256, 128, '#0f7560', (c, w, h) => { c.fillStyle = 'rgba(0,0,0,.18)'; for (let x = 0; x < w; x += 64) c.fillRect(x, 0, 3, h); c.fillStyle = 'rgba(255,255,255,.08)'; for (let k = 0; k < 400; k++) c.fillRect(R0() * w, R0() * h, 2, 2); });
  dadoT.wrapS = dadoT.wrapT = THREE.RepeatWrapping; dadoT.repeat.set(5, 1);
  const wall = (name, w, cx, cy, ry) => { const up = add(new THREE.PlaneGeometry(w, CEIL - 1.0), lam(upT), name + '_upper', 'wall', V(cx, cy, 1.0 + (CEIL - 1.0) / 2), scene, false); up.rotation.y = ry;
    const lo = add(new THREE.PlaneGeometry(w, 1.0), lam(dadoT), name + '_dado', 'wall', V(cx, cy, .5), scene, false); lo.rotation.y = ry; };
  wall('back_wall', 5.2, 0, BACK, 0); wall('left_wall', 7, LEFT, -1, Math.PI / 2); wall('right_wall', 7, RIGHT, -1, -Math.PI / 2);
  box(5.2, .05, .06, oak, 'chair_rail_back', 'wood', 0, BACK - .025, 1.0, scene, false); box(.05, 7, .06, oak, 'chair_rail_left', 'wood', LEFT + .025, -1, 1.0, scene, false); box(.05, 7, .06, oak, 'chair_rail_right', 'wood', RIGHT - .025, -1, 1.0, scene, false);
  const ceilT = txt(256, 256, '#f2cf86', (c, w, h) => { c.fillStyle = 'rgba(80,70,60,.35)'; for (let y = 6; y < h; y += 12) for (let x = 6; x < w; x += 12) if (R0() < .8) c.fillRect(x + R0() * 3, y + R0() * 3, 2, 2); c.strokeStyle = '#b8b0a0'; c.lineWidth = 4; c.strokeRect(0, 0, w, h); }, [8, 10]);
  const ceil = add(new THREE.PlaneGeometry(5.2, 7), lam(ceilT), 'acoustic_tile_ceiling', 'ceiling', V(0, -1, CEIL), scene, false); ceil.rotation.x = Math.PI / 2;

  // ---------- THE WALL VENT (where the smoke comes in) ----------
  const VN = VENT, vw = .5, vh = .32;
  box(vw + .2, .02, vh + .2, basic('#3b3f3c', { transparent: true, opacity: .55 }), 'vent_soot_halo', 'decal', VN.x, BACK - .004, VN.z + .06, scene, false);
  box(vw, .06, vh, basic('#0d0f10'), 'vent_duct_dark', 'metal', VN.x, BACK + .01, VN.z, scene, false);
  for (const [sx, sz, x, z] of [[vw + .06, .035, VN.x, VN.z + vh / 2 + .0], [vw + .06, .035, VN.x, VN.z - vh / 2], [.035, vh, VN.x - vw / 2, VN.z], [.035, vh, VN.x + vw / 2, VN.z]]) box(sx, .03, sz, toon('#e8e2cf'), 'vent_frame', 'metal', x, BACK - .02, z);
  for (let i = 0; i < 6; i++) { const s = box(vw - .02, .045, .012, toon('#d8d2be'), 'vent_louvre', 'metal', VN.x, BACK - .03, VN.z - vh / 2 + .04 + i * .05); s.rotation.x = -.6; }
  for (const [dx, dz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) add(new THREE.CylinderGeometry(.012, .012, .01, 10), chrome, 'vent_screw', 'metal', V(VN.x + dx * (vw / 2 + .0), BACK - .04, VN.z + dz * (vh / 2 + .0)), scene, false).rotation.x = Math.PI / 2;
  const sootT = txt(128, 256, null, (c, w, h) => { const g = c.createLinearGradient(0, h, 0, 0); g.addColorStop(0, 'rgba(40,40,38,.7)'); g.addColorStop(1, 'rgba(40,40,38,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(w * .15, h); c.quadraticCurveTo(w * .1, h * .3, w * .5, 0); c.quadraticCurveTo(w * .9, h * .3, w * .85, h); c.fill(); });
  plane(.6, .55, basic('#ffffff', { map: sootT, transparent: true, depthWrite: false }), 'vent_soot_smear', 'decal', VN.x, BACK - .006, VN.z + vh / 2 + .27);

  // ---------- THE ONE-WAY MIRROR (back wall right): dark glass, aluminium frame, the observer behind it ----------
  const MW = { x0: .35, x1: 2.35, z0: 1.05, z1: 2.15 };
  const glassT = txt(512, 280, '#1d2a30', (c, w, h) => { const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, 'rgba(160,200,210,.22)'); g.addColorStop(.45, 'rgba(160,200,210,.04)'); g.addColorStop(.55, 'rgba(200,230,235,.18)'); g.addColorStop(1, 'rgba(160,200,210,.03)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    // the observer: a man in a lab coat with a clipboard, barely seen through the glass
    c.fillStyle = 'rgba(120,140,150,.28)'; c.beginPath(); c.arc(w * .78, h * .36, 34, 0, Math.PI * 2); c.fill(); c.fillRect(w * .78 - 48, h * .36 + 34, 96, 160); c.fillStyle = 'rgba(200,210,200,.28)'; c.fillRect(w * .78 - 70, h * .52, 40, 54);
    c.strokeStyle = 'rgba(255,255,255,.22)'; c.lineWidth = 5; for (const x of [80, 120, 300]) { c.beginPath(); c.moveTo(x, h); c.lineTo(x + 90, 0); c.stroke(); } });
  plane(MW.x1 - MW.x0, MW.z1 - MW.z0, new THREE.MeshStandardMaterial({ map: glassT, roughness: .08, metalness: .3 }), 'one_way_mirror_glass', 'glass', (MW.x0 + MW.x1) / 2, BACK - .01, (MW.z0 + MW.z1) / 2);
  for (const [sx, sz, x, z] of [[MW.x1 - MW.x0 + .08, .05, (MW.x0 + MW.x1) / 2, MW.z1], [MW.x1 - MW.x0 + .08, .07, (MW.x0 + MW.x1) / 2, MW.z0], [.05, MW.z1 - MW.z0, MW.x0, (MW.z0 + MW.z1) / 2], [.05, MW.z1 - MW.z0, MW.x1, (MW.z0 + MW.z1) / 2]]) box(sx, .04, sz, alu, 'mirror_alu_frame', 'metal', x, BACK - .02, z);
  box(MW.x1 - MW.x0 - .1, .07, .02, alu, 'mirror_sill', 'metal', (MW.x0 + MW.x1) / 2, BACK - .05, MW.z0 - .02);

  // ---------- the school clock (2:47, red sweep hand) above the mirror ----------
  const clockT = txt(256, 256, null, (c, w, h) => { c.fillStyle = '#fbf8ee'; c.beginPath(); c.arc(128, 128, 124, 0, Math.PI * 2); c.fill(); c.fillStyle = '#1a1a1e'; c.font = 'bold 30px Helvetica, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) { const a = i * Math.PI / 6 - Math.PI / 2; c.fillText(String(i), 128 + Math.cos(a) * 96, 128 + Math.sin(a) * 96); }
    for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30; c.fillRect(128 + Math.cos(a) * 116 - 1.5, 128 + Math.sin(a) * 116 - 1.5, 3, 3); }
    c.font = 'bold 12px Helvetica, Arial'; c.fillText('STANDARD ELECTRIC', 128, 168);
    const hand = (a, l, wd, col) => { c.strokeStyle = col; c.lineWidth = wd; c.lineCap = 'round'; c.beginPath(); c.moveTo(128, 128); c.lineTo(128 + Math.cos(a) * l, 128 + Math.sin(a) * l); c.stroke(); };
    hand((2 + 47 / 60) * Math.PI / 6 - Math.PI / 2, 58, 9, '#1a1a1e'); hand(47 * Math.PI / 30 - Math.PI / 2, 92, 6, '#1a1a1e'); hand(12 * Math.PI / 30 - Math.PI / 2, 100, 3, '#d01c1c'); c.fillStyle = '#d01c1c'; c.beginPath(); c.arc(128, 128, 7, 0, 7); c.fill(); });
  const CK = [1.35, BACK - .04, 2.5];
  add(new THREE.CylinderGeometry(.19, .19, .06, 32), toon('#2a2c30'), 'clock_case', 'metal', V(...CK)).rotation.x = Math.PI / 2;
  const face = plane(.33, .33, basic('#ffffff', { map: clockT, transparent: true }), 'clock_face', 'sign', CK[0], CK[1] - .035, CK[2]);
  add(new THREE.TorusGeometry(.18, .012, 6, 32), chrome, 'clock_ring', 'metal', V(CK[0], CK[1] - .04, CK[2]), scene, false);

  // ---------- notice board (back wall left of the vent) ----------
  const NB = [-1.85, BACK - .02, 1.55];
  const corkT = txt(256, 192, '#b98a52', (c, w, h) => { for (let k = 0; k < 1400; k++) { c.fillStyle = R0() < .5 ? 'rgba(90,50,20,.35)' : 'rgba(240,200,140,.3)'; c.fillRect(R0() * w, R0() * h, 2, 2); } });
  box(.95, .03, .7, lam(corkT), 'notice_board_cork', 'wood', NB[0], NB[1], NB[2]); for (const [sx, sz, x, z] of [[1.0, .03, NB[0], NB[2] + .36], [1.0, .03, NB[0], NB[2] - .36], [.03, .72, NB[0] - .49, NB[2]], [.03, .72, NB[0] + .49, NB[2]]]) box(sx, .045, sz, oak, 'notice_board_frame', 'wood', x, NB[1] - .005, z);
  const flyer = (title, sub, bg, col) => txt(160, 210, bg, (c, w, h) => { c.fillStyle = col; c.textAlign = 'center'; c.font = 'bold 26px Helvetica, Arial'; title.split('|').forEach((s, i) => c.fillText(s, w / 2, 40 + i * 30)); c.font = '15px Helvetica, Arial'; sub.split('|').forEach((s, i) => c.fillText(s, w / 2, 120 + i * 20)); c.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 4; i++) c.fillRect(20, 175 + i * 7, 120 - i * 15, 3); });
  for (const [t, x, z, r] of [[flyer('SUBJECTS|NEEDED', 'PSYCHOLOGY DEPT.|$2 PER HOUR|SCHERMERHORN', '#fbf6e2', '#1a2a6a'), -.25, .08, -.05], [flyer('SPRING|1968', 'MIXER FRIDAY|JOHN JAY|LOUNGE', '#f3c84a', '#7a1e1e'), .02, -.05, .06], [flyer('NO|SMOKING', 'IN THE|LABORATORY', '#ffffff', '#c01c1c'), .28, .12, -.03]]) {
    const m = plane(.22, .29, lam(t), 'notice_flyer', 'paper', NB[0] + x, NB[1] - .03, NB[2] + z); m.rotation.z = r; add(new THREE.SphereGeometry(.012, 8, 6), toon('#d01c1c'), 'push_pin', 'metal', V(NB[0] + x, NB[1] - .04, NB[2] + z + .12), scene, false); }

  // ---------- door with the frosted window (right wall) ----------
  const DR = { y: 1.0, w: .9, h: 2.1 };
  box(.05, DR.w, DR.h, oak, 'door_leaf', 'wood', RIGHT - .03, DR.y, DR.h / 2); for (const dy of [-1, 1]) box(.07, .07, DR.h + .07, toon('#5a3a22'), 'door_frame_side', 'wood', RIGHT - .03, DR.y + dy * (DR.w / 2 + .035), (DR.h + .07) / 2); box(.07, DR.w + .14, .07, toon('#5a3a22'), 'door_frame_top', 'wood', RIGHT - .03, DR.y, DR.h + .035);
  const frostT = txt(256, 300, '#d8e4e2', (c, w, h) => { for (let k = 0; k < 2000; k++) { c.fillStyle = R0() < .5 ? 'rgba(255,255,255,.4)' : 'rgba(150,170,170,.25)'; c.fillRect(R0() * w, R0() * h, 2, 2); } c.fillStyle = '#1a1a22'; c.textAlign = 'center'; c.font = 'bold 44px Georgia, serif'; c.fillText('ROOM 418', w / 2, 110); c.font = 'bold 28px Georgia, serif'; c.fillText('PSYCHOLOGY', w / 2, 160); c.font = '20px Georgia, serif'; c.fillText('PLEASE WAIT', w / 2, 200); });
  const fr = plane(.55, .65, lam(frostT, { emissive: '#3a4a48' }), 'door_frosted_window', 'glass', RIGHT - .06, DR.y, 1.55, -Math.PI / 2);
  add(new THREE.SphereGeometry(.035, 12, 10), brass, 'door_knob', 'metal', V(RIGHT - .09, DR.y - .34, 1.0)); box(.01, .85, .25, brass, 'door_kick_plate', 'metal', RIGHT - .06, DR.y, .14);

  // ---------- window with venetian blinds + radiator (left wall) ----------
  const WN = { y: -.4, w: 1.3, z0: 1.05, z1: 2.35 };
  const blindT = txt(256, 256, '#cfe6f2', (c, w, h) => { for (let y = 0; y < h; y += 16) { c.fillStyle = '#f2ece0'; c.fillRect(0, y, w, 11); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(0, y + 10, w, 2); } c.fillStyle = 'rgba(80,80,80,.6)'; c.fillRect(w * .25, 0, 2, h); c.fillRect(w * .75, 0, 2, h); });
  plane(WN.w, WN.z1 - WN.z0, basic('#ffffff', { map: blindT }), 'window_venetian_blinds', 'glass', LEFT + .02, WN.y, (WN.z0 + WN.z1) / 2, Math.PI / 2);
  for (const [sy, sz, y, z] of [[WN.w + .12, .06, WN.y, WN.z1 + .03], [WN.w + .2, .08, WN.y, WN.z0 - .03], [.06, WN.z1 - WN.z0, WN.y - WN.w / 2 - .03, (WN.z0 + WN.z1) / 2], [.06, WN.z1 - WN.z0, WN.y + WN.w / 2 + .03, (WN.z0 + WN.z1) / 2]]) box(.08, sy, sz, toon('#e8e2cf'), 'window_frame', 'wood', LEFT + .04, y, z);
  for (let i = 0; i < 14; i++) box(.1, .045, .55, toon('#d9d4c4'), 'radiator_fin', 'metal', LEFT + .1, WN.y - .45 + i * .07, .4); box(.12, 1.0, .04, toon('#c9c4b4'), 'radiator_top', 'metal', LEFT + .1, WN.y, .69);

  // ---------- coat rack (back-left corner): trench coat + umbrella ----------
  const CR = [-2.25, 2.15];
  bar([CR[0], CR[1], 0], [CR[0], CR[1], 1.8], .02, toon('#3a2a1e'), 'coat_rack_pole', 'wood'); for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; bar([CR[0], CR[1], 1.72], [CR[0] + Math.cos(a) * .14, CR[1] + Math.sin(a) * .14, 1.8], .012, toon('#3a2a1e'), 'coat_rack_hook', 'wood'); bar([CR[0], CR[1], .08], [CR[0] + Math.cos(a + .7) * .25, CR[1] + Math.sin(a + .7) * .25, 0], .015, toon('#3a2a1e'), 'coat_rack_foot', 'wood'); }
  const coat = add(new THREE.CylinderGeometry(.1, .24, 1.05, 10, 1, true), toon('#c8a46a'), 'trench_coat', 'cloth', V(CR[0] + .08, CR[1] - .06, 1.22)); coat.material.side = THREE.DoubleSide;
  box(.2, .02, .03, toon('#8a6a3a'), 'trench_belt', 'cloth', CR[0] + .08, CR[1] - .22, 1.05); bar([CR[0] + .18, CR[1] - .1, .05], [CR[0] + .12, CR[1] - .12, .9], .025, toon('#1e2230'), 'umbrella_furled', 'cloth'); add(new THREE.TorusGeometry(.04, .01, 6, 12, Math.PI), toon('#5a3a22'), 'umbrella_handle', 'wood', V(CR[0] + .12, CR[1] - .12, .93));

  // ---------- tables, chairs, papers ----------
  const qT = txt(360, 460, '#fbf8ee', (c, w, h) => { c.fillStyle = '#1a2a6a'; c.textAlign = 'center'; c.font = 'bold 22px Georgia, serif'; c.fillText('COLUMBIA UNIVERSITY', w / 2, 34); c.font = '15px Georgia, serif'; c.fillText('Department of Psychology', w / 2, 56);
    c.fillStyle = '#1a1a1e'; c.font = 'bold 21px Georgia, serif'; c.fillText('QUESTIONNAIRE', w / 2, 92); c.font = '14px Georgia, serif'; c.fillText('Problems of urban university life', w / 2, 112); c.textAlign = 'left';
    for (let i = 0; i < 7; i++) { const y = 150 + i * 42; c.fillStyle = '#1a1a1e'; c.font = 'bold 14px Georgia, serif'; c.fillText((i + 1) + '.', 22, y); c.fillStyle = '#9aa0b0'; c.fillRect(44, y - 9, 250 - (i * 31) % 90, 4); c.fillRect(44, y + 7, 280, 1.5);
      if (i < 4) { c.strokeStyle = '#3a3a6a'; c.lineWidth = 2; c.beginPath(); let x = 46; c.moveTo(x, y + 4); for (let k = 0; k < 22; k++) { x += 10; c.lineTo(x, y + 4 + (k % 2 ? -5 : 2)); } c.stroke(); } } });
  const paperM = lam(qT), blankM = toon('#f6f1e2');
  const table = (name, cx, cy, w = .8, d = .46, top = walnut) => { box(w, d, .03, top, name + '_top', 'wood', cx, cy, TT - .015); box(w - .02, .01, .035, toon('#5a3418'), name + '_edge', 'wood', cx, cy - d / 2, TT - .02);
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) bar([cx + sx * (w / 2 - .05), cy + sy * (d / 2 - .05), 0], [cx + sx * (w / 2 - .05), cy + sy * (d / 2 - .05), TT - .03], .014, chrome, name + '_leg', 'metal');
    bar([cx - w / 2 + .05, cy, .12], [cx + w / 2 - .05, cy, .12], .01, chrome, name + '_stretcher', 'metal'); };
  const sheet = (name, x, y, rz, m = paperM, w = .21, d = .27) => { const s = add(new THREE.PlaneGeometry(w, d), m, name, 'paper', V(x, y, TT + .002), scene, false); s.rotation.x = -Math.PI / 2; s.rotation.z = rz; return s; };
  const chair = (name, cx, cy, col) => { const shell = toon(col); box(.44, .42, .03, shell, name + '_seat', 'plastic', cx, cy, .44); const bk = box(.44, .03, .36, shell, name + '_back', 'plastic', cx, cy + .22, .66); bk.rotation.x = -.15;
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) bar([cx + sx * .19, cy + sy * .17, 0], [cx + sx * .16, cy + sy * .14, .43], .011, chrome, name + '_leg', 'metal'); };
  // THE STUDENT (centre)
  table('student_table', 0, -.22); chair('student_chair', 0, .48, '#d2601a');
  sheet('student_questionnaire', -.02, -.2, .06); sheet('student_form_stack', .27, -.24, -.12, blankM); sheet('student_form_stack2', .27, -.24, -.08, blankM).position.y += .004;
  const cupT = txt(256, 96, '#2a5ac4', (c, w, h) => { c.fillStyle = '#ffffff'; for (let x = 0; x < w; x += 32) { c.fillRect(x, 8, 26, 4); c.fillRect(x, 8, 4, 16); c.fillRect(x + 8, 16, 18, 4); c.fillRect(x, h - 12, 26, 4); } c.fillStyle = '#f2c84a'; c.font = 'bold 18px Georgia, serif'; c.textAlign = 'center'; c.fillText('WE ARE HAPPY TO SERVE YOU', w / 2, h / 2 + 6); });
  const cup = add(new THREE.CylinderGeometry(.042, .032, .11, 18, 1, true), lam(cupT, { side: THREE.DoubleSide }), 'greek_key_coffee_cup', 'paper', V(-.3, -.12, TT + .055)); add(new THREE.CircleGeometry(.04, 16), toon('#4a2a14'), 'coffee_surface', 'liquid', V(-.3, -.12, TT + .1), scene, false).rotation.x = -Math.PI / 2;
  const ashG = add(new THREE.CylinderGeometry(.06, .055, .025, 20), new THREE.MeshStandardMaterial({ color: '#b8d8e0', roughness: .1, transparent: true, opacity: .75 }), 'glass_ashtray', 'glass', V(.3, -.05, TT + .013));
  bar([.27, -.06, TT + .03], [.36, -.02, TT + .032], .005, toon('#f4efe4'), 'cigarette_butt', 'paper');
  box(.17, .24, .035, toon('#7a1e2e'), 'textbook_psychology', 'paper', -.31, -.12, TT + .018); box(.16, .23, .03, toon('#1f4a8a'), 'textbook_statistics', 'paper', -.3, -.11, TT + .05);
  // CALM MAN A (left, pipe)
  table('calmA_table', -.85, 1.06); chair('calmA_chair', -.85, 1.76, '#6f7a80'); sheet('calmA_questionnaire', -.85, 1.06, -.05); sheet('calmA_stack', -.58, 1.02, .15, blankM);
  box(.1, .07, .03, toon('#5a3418'), 'pipe_tobacco_pouch', 'leather', -1.12, 1.01, TT + .015); box(.045, .03, .008, toon('#d01c1c'), 'matchbook', 'paper', -1.08, 1.11, TT + .004);
  // CALM MAN B (right, blazer)
  table('calmB_table', .85, 1.1); chair('calmB_chair', .85, 1.8, '#6f7a80'); sheet('calmB_questionnaire', .85, 1.1, .04); sheet('calmB_page_turned', 1.1, 1.07, -.2, blankM);
  const newsT = txt(256, 180, '#efe8d4', (c, w, h) => { c.fillStyle = '#1a1a1e'; c.textAlign = 'center'; c.font = 'bold 30px Georgia, serif'; c.fillText('SPECTATOR', w / 2, 36); c.fillRect(10, 46, w - 20, 3); c.font = 'bold 20px Georgia, serif'; c.fillText('STUDENTS DEBATE GYM', w / 2, 76); c.fillStyle = 'rgba(0,0,0,.35)'; for (let i = 0; i < 9; i++) c.fillRect(14 + (i % 3) * 80, 92 + Math.floor(i / 3) * 26, 70, 4); });
  const np = add(new THREE.PlaneGeometry(.26, .18), lam(newsT), 'folded_newspaper', 'paper', V(.6, 1.15, TT + .004), scene, false); np.rotation.x = -Math.PI / 2; np.rotation.z = .3;

  // ---------- foreground: chrome pedestal ashtray + wastebasket ----------
  const PA = [-.95, -1.35];
  add(new THREE.CylinderGeometry(.16, .18, .03, 24), chrome, 'pedestal_ashtray_foot', 'metal', V(PA[0], PA[1], .015)); bar([PA[0], PA[1], .03], [PA[0], PA[1], .62], .018, chrome, 'pedestal_ashtray_post', 'metal', scene, 12);
  add(new THREE.CylinderGeometry(.13, .1, .06, 24), chrome, 'pedestal_ashtray_bowl', 'metal', V(PA[0], PA[1], .65)); add(new THREE.CircleGeometry(.11, 20), toon('#8a8478'), 'ash_sand', 'sand', V(PA[0], PA[1], .675), scene, false).rotation.x = -Math.PI / 2;
  for (let i = 0; i < 4; i++) bar([PA[0] - .05 + i * .03, PA[1] + rr(-.04, .04), .68], [PA[0] - .02 + i * .03, PA[1] + rr(-.06, .06), .69], .005, toon('#f4efe4'), 'sand_butt', 'paper');
  const wb = add(new THREE.CylinderGeometry(.15, .12, .36, 20, 1, true), toon('#5a6a5e'), 'wastebasket', 'metal', V(1.05, -.95, .18)); wb.material.side = THREE.DoubleSide;
  for (let i = 0; i < 3; i++) add(new THREE.IcosahedronGeometry(.05, 0), toon('#f6f1e2'), 'crumpled_form', 'paper', V(1.05 + rr(-.06, .06), -.95 + rr(-.06, .06), .34 + i * .02));

  // ---------- THE PENDANT LAMP over the student = the ONE hard key ----------
  const LP = LAMP;
  bar([LP.x, LP.y, LP.z + .16], [LP.x, LP.y, CEIL], .006, toon('#1a1a1e'), 'lamp_cord'); add(new THREE.CylinderGeometry(.04, .04, .03, 12), chrome, 'lamp_canopy', 'metal', V(LP.x, LP.y, CEIL - .015));
  const shade = add(new THREE.ConeGeometry(.24, .2, 28, 1, true), toon('#1f6a4a'), 'lamp_green_enamel_shade', 'metal', V(LP.x, LP.y, LP.z + .08)); shade.material.side = THREE.DoubleSide;
  add(new THREE.CylinderGeometry(.03, .045, .06, 12), toon('#1f6a4a'), 'lamp_neck', 'metal', V(LP.x, LP.y, LP.z + .19));
  add(new THREE.SphereGeometry(.055, 14, 10), basic('#fff6d8', { toneMapped: false }), 'lamp_bulb', 'lamp', V(LP.x, LP.y, LP.z + .02), scene, false);
  const key = new THREE.SpotLight('#ffe2b0', 38, 7, .52, .45, 1.1); key.position.copy(V(LP.x, LP.y, LP.z)); key.target.position.copy(V(0, -.1, 0)); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0004; key.shadow.radius = 2;
  scene.add(key); scene.add(key.target);
  const coneM = new THREE.MeshBasicMaterial({ color: '#ffd890', transparent: true, opacity: .06, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
  const cone = add(new THREE.ConeGeometry(1.25, 2.4, 40, 1, true), coneM, 'lamp_light_cone', 'fx', V(LP.x, LP.y - .05, LP.z - 1.2), scene, false); cone.receiveShadow = false;
  const poolT = txt(256, 256, null, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,236,190,.55)'); g.addColorStop(.7, 'rgba(255,236,190,.25)'); g.addColorStop(1, 'rgba(255,236,190,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const pool = add(new THREE.PlaneGeometry(2.6, 2.6), basic('#ffffff', { map: poolT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), 'lamp_floor_pool', 'fx', V(0, -.15, .004), scene, false); pool.rotation.x = -Math.PI / 2;
  const fillW = new THREE.PointLight('#bfe0ff', 1.2, 6, 1.5); fillW.position.copy(V(LEFT + .5, -.4, 1.7)); scene.add(fillW);   // soft cool spill from the blinds

  // ---------- THE SMOKE ----------
  const puffT = txt(128, 128, null, (c, w, h) => { for (let k = 0; k < 9; k++) { const x = 64 + rr(-26, 26), y = 64 + rr(-26, 26), r = rr(22, 40), g = c.createRadialGradient(x, y - r * .3, 0, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.6, 'rgba(232,238,238,.3)'); g.addColorStop(1, 'rgba(200,210,212,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }
    const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, 'rgba(0,0,0,0)'); s.addColorStop(1, 'rgba(70,80,84,.35)'); c.globalCompositeOperation = 'source-atop'; c.fillStyle = s; c.fillRect(0, 0, w, h); });
  const N = 460, puffs = [], smoke = new THREE.Group(); smoke.name = 'vent_smoke'; scene.add(smoke);
  for (let i = 0; i < N; i++) { const m = new THREE.SpriteMaterial({ map: puffT, color: '#f4f7f6', transparent: true, depthWrite: false, opacity: 0, fog: false }); const s = new THREE.Sprite(m); s.name = 'smoke_puff'; s.visible = false; smoke.add(s); puffs.push(s); }
  const layerT = txt(256, 128, null, (c, w, h) => { for (let k = 0; k < 16; k++) { const x = rr(30, w - 30), y = rr(40, h - 40), r = rr(30, 60), g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(240,244,244,.5)'); g.addColorStop(1, 'rgba(240,244,244,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); } });
  const layers = []; for (let i = 0; i < 14; i++) { const m = new THREE.SpriteMaterial({ map: layerT, color: '#e6eeee', transparent: true, depthWrite: false, opacity: 0, fog: false }), s = new THREE.Sprite(m); s.name = 'smoke_layer'; s.userData = { x: rr(-2.2, 2.2), y: rr(.2, 2.3), ph: rr(0, 6), w: rr(1.6, 2.4) }; smoke.add(s); layers.push(s); }
  const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const cl = v => Math.max(0, Math.min(1, v));
  const update = f => {
    const thick = cl((f + 40) / 190);                 // 0.21 at frame 0 -> 1 at frame 150: the room keeps filling
    let k = 0;
    for (let b = f; b > f - 170 && k < N; b--) {
      const r1 = hash(b), r2 = hash(b + 17.3), r3 = hash(b + 41.9); if (r1 > .78 + .22 * cl((b + 60) / 170)) continue;     // emission rate grows
      const a = (f - b) / 30, life = 5.5; if (a > life) continue; const s = puffs[k++];
      const zFree = VENT.z + .02 + .3 * a * (.8 + .4 * r1), size = Math.min(.95, .26 + .28 * a * (.8 + .4 * r3)), ceilZ = CEIL - .1 - size * .3;
      const tHit = Math.max(0, (ceilZ - VENT.z) / (.3 * (.8 + .4 * r1))), after = Math.max(0, a - tHit);
      const out = .8 * (1 - Math.exp(-a * 1.1)) / 1.1 * (.75 + .5 * r2) + .32 * after, dir = r2 * 2 - 1;
      const z = Math.min(zFree, ceilZ) - .8 * thick * cl(after / 2.5) * (.4 + .6 * r3);
      s.position.copy(V(VENT.x + .08 * dir + dir * (.12 * a + .38 * after) + .14 * after, VENT.y - .05 - out, z + .025 * Math.sin(a * 2.3 + r3 * 6)));
      s.scale.set(size * 1.3, size, 1); s.material.rotation = r3 * 6 + a * .3 * (r2 - .5);
      s.material.opacity = Math.min(1, a * 8) * (.9 - .45 * a / life) * (.8 + .2 * thick); s.visible = true; }
    for (; k < N; k++) puffs[k].visible = false;
    layers.forEach((s, i) => { const u = s.userData, z = CEIL - .18 - 1.0 * thick * (.6 + .4 * hash(i)) + .03 * Math.sin(f / 40 + u.ph);
      s.position.copy(V(u.x + .1 * Math.sin(f / 60 + u.ph), u.y, z)); s.scale.set(u.w, u.w * .4, 1); s.material.opacity = cl(thick * 1.3 - .2) * .6; });
    coneM.opacity = .05 + .1 * thick;
    scene.fog.near = 10 - 3 * thick; scene.fog.far = 34 - 10 * thick;
  };
  update(0);
  return { update, anchors: { vent: [VENT.x, VENT.y, VENT.z], student_form: [-.02, -.2, TT] } };
}

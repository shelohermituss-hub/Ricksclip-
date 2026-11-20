// SET "or_room": OPERATING ROOM 3, a Houston hospital, mid-1990s (fake-surgery; port of the hooks_v3 board, look helper phase A 2026-11-16; then the S1 builder).
// Plan metres, Z up, Y forward (away from the lens). Origin = middle of the floor under the operating table. Hook coordinates kept (KNEE, table, lamp hub, tower, door).
// Surfaces from look_pack.js (kit3d): sea-green glazed 15 cm tiles #4fa59a, dark teal ceiling panels, speckled vinyl + drain, steel skirting, blue drapes #2f5fa8.
// THE PATIENT IS A CAST PUPPET (cast:surgery/patient): the table has a RAISED HEAD SECTION (head_deg, default 35) and the drape over his chest-to-shin;
// the 3D sleeping head of the board is OUT. His card goes at anchors.patient_card (feet-end of the card = his hip on the pad, leaning back along the backrest).
// No red anywhere (LOOK_BIBLE THE ONE RED): IN USE light amber #ffb020, bulb grey-blue (or_props.js), iodine orange-brown #c0702a (never glowing), dots #4a2a18.
//
// PLACE KEYS (film.json places.<name>; every key OFF / default = the morning OR of rows 1-10):
//   knee: { dots: 0..3 (default 3), plasters: 0..3 (default 0), faded: false }   the marks on the kneecap, in ONE straight row; plasters cover dots 1..n
//   lamp_at: [x,y,z]   where the OR lamp aims (default [0.55, 0.3, 1.32]: the knee AND the surgeon's cap, hands, glasses; the floor pool of the board is gone)
//   lamp_i: number     OR lamp intensity (default 26; the knee patch must stay at brightness <= 0.80: measured in sets/_test)
//   evening: true      7:15 PM (light kind EV, rows 48-49): lamp off, IN USE off, coral low sun through the two door portholes (long shafts across the floor)
//   water_floor: 0..1  row 29 flood: water sheet up to 0.3 m x key (shin-deep at 1), ripple rings, the kick bucket bobs (update)
//   monitor: 'nosignal' (default) | 'tape' (the smooth pink joint picture of the "REAL ONE" tape, PLAY) | 'snow' (static, animated) | 'off'
//   head_deg: number   raised head section angle (default 35)
//   dust: number       motes in the lamp cone (default 40; evening: in the porthole shafts)
// S1 builder keys 2026-11-16 (all OFF unless set; other stretches unchanged):
//   knee_v2: true      phone-size marks: dots 34 mm, plasters 50 x 100 mm in one row 64 mm apart, knee skin toned so the lamp never blooms it (patch <= .80)
//   knee_track: [[f, dots, plasters], ...]  per-frame mark state (the last key at or before f); needs knee_v2
//   lamp_pos: [x,y,z]  OR lamp dome position (default [.18, .5, 2.3]); S1 swings it in front of the knee so the knee face and his cap, glasses, hands are lit
//   lamp_angle: rad    OR lamp cone (default .5); S1 uses a narrower cone so no hot pool spills on the floor
//   drape_soft: true   the near drape hangs in real folds (a displaced cloth sheet) instead of the flat slab
//   power: [{ kind, at, f, opts }]   sets/power pieces played from their word frame f (as elevator lobby.js)
//   impact: [[f, '#rrggbb'], ...]    anime IMPACT FRAME (lens-filling invert quad, tinted)
//   tiks: [[f, i], ...]              a tiny white "tik" star on dot i (0-2) for 4 frames (row 2 cut touches)
//   scope_view: true + scope_cam: { pos, aim, fade }   (fade: true | [near, far] m: film + tag fade in by the lens' distance to pos; build-out)
//     the sealed bag's crinkled plastic + seal tag in front of that lens (row 6 IMPOSSIBLE VIEW)
// S1 round 2 keys 2026-11-16 (OFF unless set):
//   knee_v3: { at, hip, foot, face, w, win, dot, dx, dome, pw }   the bent leg under a drape tent (knee PEAK), taped dark-blue window, matte iodine dome, marks on the face toward the lens (n = face)
//   hand3d: { shoulder, dx, keys: [[f, anchor|xyz, lift, prop]], r, width }   the surgeon's working arm + round fist + held tool drawn by the set ON the knee
//   tray_at: [x,y,z]   Mayo tray position (row 7: tray in frame with the knee)
// S1 round 3 key 2026-11-16 (OFF unless set):
//   knee_tapes: 'strips'   knee_v3 window tapes = four thin straight off-white strips along the dark-blue window edges (never crossing; default = the old corner tapes that read as an X)
// S1 round 4 keys 2026-11-16 (OFF unless set):
//   knee_scale: s        knee_v3 kneecap ball, window, dome, dots, dot spacing and plasters x s (a cartoon knee)
//   steps: [[x, y, h], ...]   OR step stools (steel, rubber top) the staff stand on
//   lie_body: true | { r, zs }   his body as a flattened drape mound from the raised head section down to the hips, so the drape reads as a man lying on the table
// S1 round 5 keys 2026-11-16 (OFF unless set):
//   leg_drape: { color, fold, far_y }   knee_v3 leg tent + kneecap ball in a LIGHTER blue with painted fold lines, so the raised-knee V separates from the darker table drape / body mound; far_y = y of the straight far leg (default T.y - .14)
//   knee_win: 'thin'   knee_v3 window = thin dark edge (no thick square slab frame), the off-white tape strips stay
// S1 build-out key 2026-11-16 (OFF unless set; S3/S5 may copy it for one OR knee look):
//   knee_crisp: { edge, ink, er, ir, fold, back }   knee_v3 raised-knee V drawn crisp: a hard lamp-edge line along the thigh + shin tops, a dark ink line behind it
//                (the V silhouette), painted fold lines down the near flank, and a darker body mound behind (back colour)
// Anchors: knee, knee_r (radii), knee_plaster_1..3, knee_top, knee_dot_1..3 (plan points on the kneecap), patient_card, patient_head, patient_hip, lamp, porthole_L/R, bowl, tray.
// ENV v3 key (env helper E2 2026-11-17; OFF unless set; every older key unchanged):
//   env_v3: true   OR 3 richer at phone size: deeper-teal tile band + pale cap course, anaesthesia DRUG CART (5 coloured drawers, 3 dial gauges, BP/SpO2/HR unit, sharps box,
//                  syringes), WHITEBOARD 'OR SCHEDULE TUE' (OR 3 8:15 KNEE SCOPE ringed), ceiling GAS PENDANT with O2/N2O/AIR/VAC outlets + 4 drooping coloured hoses (slow sway),
//                  floor SUCTION UNIT (5-star base, 2 canisters, vacuum dial, hose), BACK TABLE (drape, 18 instruments, basin, packs, 'KNEE SET' tag), LINEN HAMPER, 2nd kick bucket,
//                  2 more glass-door steel CABINETS with labelled boxes (left + right wall), OXYGEN IN USE sign (blue), wall phone + coiled cord, sharps box, thermometer dial,
//                  orange outlets, 2nd X-ray viewer (left wall), floor cables + power strip + yellow cable cover, laminar-flow ceiling diffuser + seams, speaker, smoke detector;
//                  SECOND LIGHT COLOUR: cool sea-green tile bounce (2 point lights; lilac in the evening). No red.
// S1 v3 keys (S1 builder 2026-11-17, FIX_BRIEF_v3; OFF unless set):
//   water_v3: { at, bursts, size, drops, f0, f1 }   ROW 4: the shared water_fx 'bulb_splash' (see-through water, foam crest, spray) from the bulb nozzle; replaces splash_big.
//   ko_clean: true   registers the meme face 'koClean' (memes 'ko' without bump and without zZ) via zzz_fx.registerKoClean.
//   zzz_v3: { head, toLens, lift, rise, size, f0, f1 }   floating Zs over the drawn card head: head = plan point of the CARD's drawn head top, moved toLens m toward the camera
//            every frame (so the depth-tested Zs sit on the lens side of the card, never behind the ceiling or inside the face).
import * as LP from './look_pack.js';
import { addWater, hideStaticBulbWater } from './water_fx.js';
import { addZzz, registerKoClean } from './zzz_fx.js';
export const KNEE = [0.36, 0.44, 1.3];
const canvasTex = (THREE, w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData = { canvas: c }; return t; };
// S1 v2 key porthole_view (CB: "why there is white fog"): the door portholes are clear glass that show the corridor outside (S2's amber wall, green dado,
// dark green ceiling grid, one ceiling light), with a faint green tint and one glint, instead of a pale glowing disc. The wired grid stays on top.
const portView = (THREE, dx) => { const t = canvasTex(THREE, 256, 256, (c, w, h) => {
  c.fillStyle = '#1f3d33'; c.fillRect(0, 0, w, h * .2); c.strokeStyle = '#3c5f50'; c.lineWidth = 3; for (let x = (dx > 0 ? 20 : 0); x < w; x += 64) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 12, h * .2); c.stroke(); }
  c.fillStyle = '#fff6d8'; c.fillRect(w * .3 + dx * 60, h * .06, w * .34, h * .07);
  const g = c.createLinearGradient(0, h * .2, 0, h * .62); g.addColorStop(0, '#f2b44c'); g.addColorStop(1, '#e09a36'); c.fillStyle = g; c.fillRect(0, h * .2, w, h * .42);
  c.fillStyle = '#c9a25a'; c.fillRect(0, h * .2, w, 5);
  c.fillStyle = '#2f6b4a'; c.fillRect(0, h * .62, w, h * .38); c.fillStyle = '#9aa6a8'; c.fillRect(0, h * .6, w, h * .045); c.fillStyle = '#d8e0e2'; c.fillRect(0, h * .6, w, h * .012);
  c.fillStyle = '#c7a24e'; c.fillRect(0, h * .9, w, h * .1); c.fillStyle = 'rgba(120,80,30,.35)'; for (let i = 0; i < 60; i++) c.fillRect((i * 37) % w, h * .9 + (i * 13) % (h * .1), 3, 3);
  c.fillStyle = 'rgba(150,215,200,.14)'; c.fillRect(0, 0, w, h);
  c.fillStyle = 'rgba(255,255,255,.28)'; c.beginPath(); c.moveTo(w * .18, h * .1); c.lineTo(w * .32, h * .1); c.lineTo(w * .12, h * .62); c.lineTo(w * .02, h * .62); c.fill(); });
  return new THREE.MeshBasicMaterial({ map: t }); };

export async function build(THREE, scene, film, ctx) {
  const { B2T, toon } = ctx, V = (x, y, z) => B2T([x, y, z]), pl = ctx.place || {}, M = LP.pack(THREE, ctx);
  const EVE = !!pl.evening, KN = { dots: 3, plasters: 0, faded: false, ...(pl.knee || {}) }, WF = Math.max(0, Math.min(1, +pl.water_floor || 0)), MON = pl.monitor || (EVE ? 'off' : 'nosignal'), HEAD = (pl.head_deg ?? 35) * Math.PI / 180;
  let seed = 7; const R0 = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * R0();
  const add = (geo, mat, name, role, p, parent = scene, shadow = true) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m; };
  const box = (sx, sy, sz, mat, name, role, x, y, z, parent, shadow) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, role, V(x, y, z), parent, shadow);
  const bar = (a, b, r, mat, name, role = 'metal', parent = scene, segs = 8) => { const A = V(...a), Bv = V(...b), d = Bv.clone().sub(A), L = Math.max(d.length(), 1e-4), m = add(new THREE.CylinderGeometry(r, r, L, segs), mat, name, role, A.clone().addScaledVector(d, .5), parent); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); return m; };
  const steel = M.steel, steelDk = M.steelDk, chrome = M.chrome, glow = M.glow, ink = toon('#2a1a1f'), white = toon('#f4f6f2'), ticks = [];

  scene.children.forEach(o => { if (o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.radius === 400) o.visible = false; });
  scene.background = new THREE.Color(EVE ? '#2a1a3a' : '#123a36'); scene.fog = new THREE.Fog(EVE ? '#3a2a48' : '#2f6a62', 9, 30); LP.applyLight(THREE, scene, ctx, { fog: [9, 30] });

  // ---------- floor: speckled sheet vinyl (look_pack), a round floor drain with slots ----------
  const floor = add(new THREE.PlaneGeometry(14, 14), M.vinyl, 'or_vinyl_floor', 'floor', V(0, 1, 0)); floor.rotation.x = -Math.PI / 2; floor.castShadow = false;
  const drain = add(new THREE.CircleGeometry(.09, 20), steelDk, 'floor_drain', 'metal', V(-.6, -.9, .004), scene, false); drain.rotation.x = -Math.PI / 2;
  for (let i = -2; i <= 2; i++) { const s = add(new THREE.PlaneGeometry(.012, .15), ink, 'drain_slot', 'metal', V(-.6 + i * .03, -.9, .006), scene, false); s.rotation.x = -Math.PI / 2; }

  // ---------- walls: glazed sea-green tile, coved steel skirting, steel corner guards; ceiling panels + light troffers ----------
  const wallM = M.tileSeaGloss;
  box(8, .15, 3.2, wallM, 'back_wall_tiles', 'wall', 0, 3.1, 1.6, scene, false);
  box(.15, 8, 3.2, wallM, 'left_wall_tiles', 'wall', -2.8, 0, 1.6, scene, false); box(.15, 8, 3.2, wallM, 'right_wall_tiles', 'wall', 2.8, 0, 1.6, scene, false);
  box(8, .03, .16, steel, 'skirting_back', 'metal', 0, 3.02, .08, scene, false); box(.03, 8, .16, steel, 'skirting_left', 'metal', -2.72, 0, .08, scene, false); box(.03, 8, .16, steel, 'skirting_right', 'metal', 2.72, 0, .08, scene, false);
  for (const x of [-2.72, 2.72]) bar([x, 3.02, .05], [x, 3.02, 2.0], .025, steel, 'corner_guard');
  box(8, .04, .05, steel, 'bumper_rail_back', 'metal', -1.8, 3.0, .95, scene, false);
  const ceil = box(8, 8, .1, M.ceilPanel, 'ceiling', 'ceiling', 0, 1, 3.2, scene, false);
  for (const [x, y] of [[-1.6, -.6], [1.6, -.6], [-1.6, 2.2], [1.6, 2.2]]) { box(.9, .5, .02, glow(EVE ? '#4a5a60' : '#cfe8e2'), 'ceiling_light_panel', 'lamp', x, y, 3.14, scene, false); for (let k = 1; k < 6; k++) box(.006, .5, .012, steelDk, 'troffer_louvre', 'metal', x - .45 + k * .15, y, 3.13, scene, false); }
  // wall gas outlets (oxygen green, air yellow, vacuum white) and a wall suction canister by the head end
  const gasT = canvasTex(THREE, 256, 96, (c, w, h) => { c.fillStyle = '#e8ecec'; c.fillRect(0, 0, w, h); [['O2', '#2a9a4a'], ['AIR', '#e8c040'], ['VAC', '#f4f4f4']].forEach(([t, col], i) => { c.fillStyle = col; c.beginPath(); c.arc(42 + i * 86, 44, 26, 0, 7); c.fill(); c.strokeStyle = '#5a6060'; c.lineWidth = 4; c.stroke(); c.fillStyle = '#1e2a2a'; c.font = 'bold 20px Arial'; c.textAlign = 'center'; c.fillText(t, 42 + i * 86, 88); c.beginPath(); c.arc(42 + i * 86, 44, 7, 0, 7); c.fill(); }); });
  add(new THREE.PlaneGeometry(.5, .19), new THREE.MeshLambertMaterial({ map: gasT }), 'wall_gas_outlets', 'sign', V(-2.0, 3.02, 1.35), scene, false);
  const can = add(new THREE.CylinderGeometry(.07, .07, .24, 16), new THREE.MeshLambertMaterial({ color: '#e8f4f0', transparent: true, opacity: .6 }), 'suction_canister', 'glass', V(-1.55, 3.0, 1.3)); add(new THREE.CylinderGeometry(.075, .075, .03, 16), toon('#3a7ad8'), 'canister_lid', 'plastic', V(-1.55, 3.0, 1.43));

  // ---------- back wall: X-ray light box with the knee film, clock 7:15, OR 3 door with portholes + IN USE (amber), glass steel cabinet ----------
  const xrayT = canvasTex(THREE, 512, 340, (c, w, h) => { c.fillStyle = '#eaf4fb'; c.fillRect(0, 0, w, h);
    for (const ox of [20, 270]) { c.fillStyle = '#121a22'; c.fillRect(ox, 14, 222, 312); c.fillStyle = 'rgba(220,235,245,.85)';
      c.beginPath(); c.moveTo(ox + 80, 20); c.lineTo(ox + 140, 20); c.lineTo(ox + 136, 140); c.quadraticCurveTo(ox + 160, 170, ox + 140, 178); c.lineTo(ox + 80, 178); c.quadraticCurveTo(ox + 60, 165, ox + 84, 140); c.fill();
      c.beginPath(); c.moveTo(ox + 82, 190); c.lineTo(ox + 142, 190); c.quadraticCurveTo(ox + 150, 210, ox + 134, 222); c.lineTo(ox + 130, 320); c.lineTo(ox + 92, 320); c.lineTo(ox + 88, 222); c.quadraticCurveTo(ox + 72, 210, ox + 82, 190); c.fill();
      c.beginPath(); c.ellipse(ox + 162, 168, 16, 28, .2, 0, Math.PI * 2); c.fill(); c.fillStyle = '#ffe9a0'; c.font = 'bold 22px Arial'; c.fillText(ox < 100 ? 'R' : 'L', ox + 12, 44); } });
  box(1.02, .08, .7, steel, 'xray_box_frame', 'metal', -1.25, 3.0, 1.75, scene, false);
  add(new THREE.PlaneGeometry(.96, .64), new THREE.MeshBasicMaterial({ map: xrayT, toneMapped: false, color: EVE ? '#6a6a7a' : '#ffffff' }), 'xray_film', 'lamp', V(-1.25, 2.955, 1.75), scene, false);
  for (const dx of [-.4, .4]) box(.05, .02, .03, chrome, 'xray_film_clip', 'metal', -1.25 + dx * .55, 2.95, 2.08, scene, false);
  const clockT = canvasTex(THREE, 300, 300, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(150, 150, 140, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#2a1a1f'; c.lineWidth = 14; c.stroke();
    c.fillStyle = '#2a1a1f'; c.font = 'bold 34px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; for (let i = 1; i <= 12; i++) { const a = -Math.PI / 2 + i * Math.PI / 6; c.fillText(String(i), 150 + Math.cos(a) * 105, 150 + Math.sin(a) * 105); }
    for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30; c.lineWidth = i % 5 ? 2 : 5; c.beginPath(); c.moveTo(150 + Math.cos(a) * 128, 150 + Math.sin(a) * 128); c.lineTo(150 + Math.cos(a) * 134, 150 + Math.sin(a) * 134); c.stroke(); }
    c.lineCap = 'round'; c.lineWidth = 12; const ah = -Math.PI / 2 + 7.25 * Math.PI / 6, am = -Math.PI / 2 + 15 * Math.PI / 30; c.beginPath(); c.moveTo(150, 150); c.lineTo(150 + Math.cos(ah) * 60, 150 + Math.sin(ah) * 60); c.stroke();
    c.lineWidth = 8; c.beginPath(); c.moveTo(150, 150); c.lineTo(150 + Math.cos(am) * 95, 150 + Math.sin(am) * 95); c.stroke(); c.strokeStyle = '#3a6aa8'; c.lineWidth = 4; const as = -Math.PI / 2 + 41 * Math.PI / 30; c.beginPath(); c.moveTo(150, 150); c.lineTo(150 + Math.cos(as) * 110, 150 + Math.sin(as) * 110); c.stroke(); });
  add(new THREE.CircleGeometry(.24, 32), new THREE.MeshBasicMaterial({ map: clockT, color: EVE ? '#c8a8b8' : '#ffffff' }), 'wall_clock_face', 'sign', V(.55, 3.0, 2.55), scene, false);
  add(new THREE.TorusGeometry(.245, .025, 8, 32), steel, 'wall_clock_rim', 'metal', V(.55, 3.0, 2.55), scene, false);
  // OR 3 door: steel double door, round portholes (wired glass), push plates, kick plates, the sign and the IN USE light (amber; off in the evening)
  const portC = EVE ? '#ffb07a' : '#cfe8f0';
  for (const dx of [-.42, .42]) { box(.82, .06, 2.15, steelDk, 'or_door_leaf', 'metal', 1.85 + dx, 3.0, 1.08, scene, false); add(new THREE.CircleGeometry(.14, 24), pl.porthole_view && !EVE ? portView(THREE, dx) : glow(portC), 'door_porthole', 'glass', V(1.85 + dx, 2.965, 1.6), scene, false);
    for (let k = -2; k <= 2; k++) { box(.27, .002, .003, toon('#8a9aa0'), 'porthole_wire', 'metal', 1.85 + dx, 2.962, 1.6 + k * .05, scene, false); box(.003, .002, .27, toon('#8a9aa0'), 'porthole_wire', 'metal', 1.85 + dx + k * .05, 2.962, 1.6, scene, false); }
    add(new THREE.TorusGeometry(.145, .02, 6, 24), steel, 'porthole_ring', 'metal', V(1.85 + dx, 2.96, 1.6), scene, false); box(.12, .02, .3, chrome, 'push_plate', 'metal', 1.85 + dx * .7, 2.965, 1.1, scene, false); box(.82, .03, .25, chrome, 'kick_plate', 'metal', 1.85 + dx, 2.965, .14, scene, false); }
  box(1.74, .08, .06, steel, 'door_frame_head', 'metal', 1.85, 2.98, 2.18, scene, false); for (const dx of [-.87, .87]) box(.06, .08, 2.2, steel, 'door_frame_jamb', 'metal', 1.85 + dx, 2.98, 1.1, scene, false);
  const signT = canvasTex(THREE, 256, 96, (c, w, h) => { c.fillStyle = '#1d3f8a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffffff'; c.lineWidth = 4; c.strokeRect(6, 6, w - 12, h - 12); c.fillStyle = '#ffffff'; c.font = 'bold 60px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('OR 3', w / 2, h / 2 + 3); });
  add(new THREE.PlaneGeometry(.5, .19), new THREE.MeshBasicMaterial({ map: signT }), 'or3_sign', 'sign', V(1.85, 2.96, 2.4), scene, false);
  const inUseT = canvasTex(THREE, 256, 64, (c, w, h) => { c.fillStyle = '#2a1a08'; c.fillRect(0, 0, w, h); c.fillStyle = EVE ? '#5a4628' : '#ffb020'; c.font = 'bold 40px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('IN USE', w / 2, h / 2 + 2); });
  add(new THREE.PlaneGeometry(.34, .085), new THREE.MeshBasicMaterial({ map: inUseT, toneMapped: false }), 'in_use_light', 'lamp', V(1.85, 2.96, 2.6), scene, false);
  // glass-front steel cabinet: bottles (amber, clear, blue), boxed gloves and gauze (no red, no logo)
  box(.9, .4, 1.9, steel, 'cabinet_body', 'metal', -2.15, 2.75, .95, scene, true);
  for (let s = 0; s < 3; s++) { box(.84, .3, .02, steelDk, 'cabinet_shelf', 'metal', -2.15, 2.62, .65 + s * .45, scene, false);
    for (let k = 0; k < 6; k++) { const isB = (k + s) % 3; if (isB) add(new THREE.CylinderGeometry(.035, .035, .16, 10), toon(['#e8a23a', '#7fc6e8', '#f4f4f0'][k % 3]), 'cabinet_bottle', 'glass', V(-2.5 + k * .13, 2.62, .74 + s * .45));
      else box(.11, .1, .12, toon(['#f4f4f0', '#8a5ac8', '#3aa0d8'][s]), 'cabinet_box', 'paper', -2.5 + k * .13, 2.62, .72 + s * .45); } }
  box(.86, .02, 1.5, new THREE.MeshLambertMaterial({ color: '#dff4ff', transparent: true, opacity: .25 }), 'cabinet_glass', 'glass', -2.15, 2.53, 1.15, scene, false);
  box(.03, .03, .14, chrome, 'cabinet_handle', 'metal', -1.75, 2.51, 1.2, scene, false);

  // ---------- THE OPERATING TABLE with the RAISED HEAD SECTION ----------
  const T = { x0: -1.0, x1: .55, y: .62, w: .56, z: .85 }, XH = -.42, LB = .62, padM = toon('#2a2f3a');
  const ch = Math.cos(HEAD), sh = Math.sin(HEAD), headEnd = [XH - LB * ch, T.y, T.z + LB * sh];
  box(T.x1 - XH, T.w, .09, padM, 'table_pad', 'leather', (XH + T.x1) / 2, T.y, T.z - .045);
  const back = new THREE.Group(); back.name = 'table_head_section'; back.position.copy(V(XH, T.y, T.z - .045)); back.rotation.z = -HEAD; scene.add(back);   // rotates about the hinge line (plan y)
  const bpad = add(new THREE.BoxGeometry(LB, .09, T.w), padM, 'table_back_pad', 'leather', new THREE.Vector3(-LB / 2, 0, 0), back); add(new THREE.BoxGeometry(LB - .04, .05, T.w - .05), steelDk, 'table_back_frame', 'metal', new THREE.Vector3(-LB / 2, -.08, 0), back);
  add(new THREE.BoxGeometry(.3, .07, .34), white, 'pillow', 'cloth', new THREE.Vector3(-LB + .17, .08, 0), back);
  for (const s of [-1, 1]) add(new THREE.CylinderGeometry(.012, .012, LB, 8), steel, 'back_side_rail', 'metal', new THREE.Vector3(-LB / 2, -.05, s * (T.w / 2 + .02)), back).rotation.z = Math.PI / 2;
  bar([XH - .3, T.y, T.z - .18], [XH - .3 * ch, T.y, T.z - .05 + .3 * sh - .08], .015, chrome, 'head_gas_strut');
  add(new THREE.CylinderGeometry(.035, .035, T.w + .08, 14), steel, 'head_hinge', 'metal', V(XH, T.y, T.z - .05)).rotation.x = Math.PI / 2;
  for (const s of [-1, 1]) bar([XH, T.y + s * (T.w / 2 + .02), T.z - .1], [T.x1, T.y + s * (T.w / 2 + .02), T.z - .1], .012, steel, 'table_side_rail');
  box(T.x1 - T.x0 - .05, T.w - .05, .12, steelDk, 'table_frame', 'metal', (T.x0 + T.x1) / 2 + .2, T.y, T.z - .16);
  add(new THREE.CylinderGeometry(.13, .15, T.z - .3, 18), steel, 'table_column', 'metal', V(-.2, T.y, (T.z - .3) / 2 + .1)); add(new THREE.CylinderGeometry(.16, .16, .04, 18), chrome, 'column_collar', 'metal', V(-.2, T.y, T.z - .25));
  box(1.0, .5, .1, steelDk, 'table_base', 'metal', -.2, T.y, .05); box(.16, .16, .14, toon('#2a2f3a'), 'table_pedal', 'rubber', .2, T.y - .2, .07);
  for (const dx of [-.42, .02]) box(.08, .52, .02, chrome, 'base_glide', 'metal', -.2 + dx, T.y, .005, scene, false);
  const handT = canvasTex(THREE, 128, 64, (c, w, h) => { c.fillStyle = '#d8dcde'; c.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) { c.fillStyle = '#2a2f3a'; c.fillRect(8 + i * 30, 10, 22, 22); c.fillStyle = '#ffffff'; c.font = 'bold 16px Arial'; c.fillText(['^', 'v', '<', '>'][i], 14 + i * 30, 27); } c.fillStyle = '#2a2f3a'; c.font = 'bold 13px Arial'; c.fillText('TABLE', 40, 54); });
  box(.08, .03, .16, [white, white, white, white, new THREE.MeshLambertMaterial({ map: handT }), white], 'table_hand_pendant', 'plastic', .1, T.y - T.w / 2 - .05, T.z - .25);
  bar([.1, T.y - T.w / 2 - .04, T.z - .17], [.05, T.y - T.w / 2 - .02, T.z - .1], .004, ink, 'pendant_cord', 'rubber');
  // drapes off the near side and the foot (folds), blue #2f5fa8
  if (pl.drape_soft) { const W0 = T.x1 - T.x0 + .1, g = new THREE.PlaneGeometry(W0, .58, 90, 12), P = g.attributes.position;
    for (let i = 0; i < P.count; i++) { const x = P.getX(i), y = P.getY(i), dn = (.29 - y) / .58; P.setZ(i, (.018 + .03 * dn) * Math.sin(x * 34 + 1.3 * Math.sin(x * 7)) + .012 * Math.sin(x * 83) * dn - .04 * dn * dn); }
    g.computeVertexNormals(); const dm = add(g, M.drape.clone ? M.drape.clone() : M.drape, 'drape_hang_front_soft', 'cloth', V((T.x0 + T.x1) / 2 + .1, T.y - T.w / 2 - .06, T.z - .3)); dm.material.side = THREE.DoubleSide; }
  else box(T.x1 - T.x0 + .1, .015, .55, M.drape, 'drape_hang_front', 'cloth', (T.x0 + T.x1) / 2 + .1, T.y - T.w / 2 - .04, T.z - .28, scene, false);
  for (let i = 0; i < 9; i++) { const x = T.x0 + .1 + i * .18; bar([x, T.y - T.w / 2 - .05, T.z - .02], [x + rr(-.03, .03), T.y - T.w / 2 - .055, T.z - .54], .012, M.drapeDk, 'drape_fold', 'cloth', scene, 6); }
  box(.015, T.w + .1, .5, M.drape, 'drape_hang_foot', 'cloth', T.x1 + .05, T.y, T.z - .26, scene, false);
  // the patient's body under the drape: chest-to-hip along the raised backrest, the straight left leg, the bent RIGHT knee out of the drape window (the card is drawn over the head end)
  const hip = [-.08, .5, T.z + .1], chest = [XH - .35 * ch, T.y, T.z + .06 + .35 * sh];
  const V2 = !!pl.knee_v2 || !!pl.knee_v3, V3 = pl.knee_v3 ? { at: [.25, .72, 1.22], hip: [-.17, .72, .93], foot: [.52, .72, .9], face: [.77, -.38, .51], w: .15, ...pl.knee_v3 } : null;
  if (V3 && pl.knee_scale) { const S = pl.knee_scale; V3.ball = (V3.ball ?? .09) * S; V3.win = (V3.win ?? .17) * S; V3.dot = (V3.dot ?? .016) * S; V3.dx = (V3.dx ?? .062) * S; V3.dome = (V3.dome ?? .035) * S; V3.pw = (V3.pw ?? [.05, .096, .044, .09, .03, .03]).map(v => v * S); }   // r4 knee_scale: a cartoon kneecap
  let K = V3 ? V3.at : KNEE, kneeR = .13; const fade = KN.faded ? .45 : 0, dots = [], plas = [], dotPts = []; let KF = null;
  if (!V3) {
  bar(chest, [hip[0], T.y, hip[2]], .19, M.drape, 'patient_torso_drape', 'cloth', scene, 16).scale.set(1, 1, .72);
  add(new THREE.SphereGeometry(.19, 16, 10), M.drape, 'drape_chest_round', 'cloth', V(...chest)).scale.set(1, .72, 1);
  const legL = bar([-.05, T.y + .12, T.z + .07], [.52, T.y + .12, T.z + .07], .08, M.drapeDk, 'patient_left_leg_drape', 'cloth', scene, 12);
  const foot = [.5, .44, T.z + .08];
  bar(hip, [K[0] - .02, K[1], K[2] - .04], .095, M.drape, 'patient_thigh_drape', 'cloth', scene, 14);
  bar([K[0] + .02, K[1], K[2] - .05], foot, .07, toon('#9fd0f0'), 'stockinette_shin', 'cloth', scene, 14);
  for (let i = 1; i < 6; i++) { const u = i / 6; add(new THREE.TorusGeometry(.072, .006, 5, 14), toon('#7fb4dc'), 'stockinette_rib', 'cloth', V(K[0] + .02 + (foot[0] - K[0] - .02) * u, K[1], K[2] - .05 + (foot[2] - K[2] + .05) * u)).rotation.set(0, Math.PI / 2, -.95); }
  const footM = add(new THREE.SphereGeometry(.08, 12, 10), toon('#9fd0f0'), 'stockinette_foot', 'cloth', V(foot[0] + .04, foot[1], foot[2] + .03)); footM.scale.set(1.5, .9, 1.2);
  // THE KNEE: skin with the iodine prep (orange-brown #c0702a painted in strokes, never glowing: Lambert, no emissive) and the drape window with tape
  let knee0; const kneeT = canvasTex(THREE, 256, 256, (c, w, h) => { c.fillStyle = '#f0dcc4'; c.fillRect(0, 0, w, h); const g = c.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, 125); g.addColorStop(0, '#c0702a'); g.addColorStop(.7, '#b8682a'); g.addColorStop(.92, 'rgba(184,104,42,.4)'); g.addColorStop(1, 'rgba(184,104,42,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(120,60,20,.35)'; c.lineWidth = 6; for (let i = 0; i < 8; i++) { c.beginPath(); c.arc(w / 2, h / 2, 26 + i * 12, rr(0, 3), rr(3, 6)); c.stroke(); } c.strokeStyle = 'rgba(230,160,90,.25)'; c.lineWidth = 3; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(w / 2 + rr(-8, 8), h / 2 + rr(-8, 8), 34 + i * 14, rr(0, 3), rr(3, 6)); c.stroke(); } });
  knee0 = add(new THREE.SphereGeometry(kneeR, 28, 20), new THREE.MeshLambertMaterial({ map: kneeT, color: V2 ? (pl.knee_tone || '#b8aca0') : '#e8e0d8' }), 'patient_knee_prepped', 'skin', V(...K)); knee0.scale.set(1, 1.05, 1); knee0.rotation.y = -Math.PI / 2;   // texture centre faces the lens (-y)
  const win = add(new THREE.TorusGeometry(.13, .03, 8, 24), M.drape, 'drape_window_frame', 'cloth', V(K[0], K[1] + .03, K[2] - .02)); win.rotation.set(-.15, 0, 0); win.scale.set(1, 1.05, 1);
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; box(.04, .01, .02, toon('#f4f4f0'), 'drape_tape', 'cloth', K[0] + Math.cos(a) * .135, K[1] - .01, K[2] - .02 + Math.sin(a) * .135, scene, false); }
  // THE MARKS in ONE straight row across the kneecap: dark-brown dots #4a2a18 (no red, no slit), plasters cream #f2e6c8 + tan pad #c9a56a + thin dark outline (~3x the dot)
  const onKnee = (dx, dz, lift = .002) => { const yy = K[1] - kneeR * 1.0 * Math.sqrt(Math.max(.05, 1 - (dx * dx + dz * dz) / (kneeR * kneeR))) - lift; return [K[0] + dx, yy, K[2] + dz]; };
  const dotC = new THREE.Color('#4a2a18').lerp(new THREE.Color('#c0702a'), fade), DX = V2 ? [-.064, 0, .064] : [-.045, 0, .045], DR = V2 ? .017 : .0105, PW = V2 ? [.058, .108, .052, .1, .04, .032] : [.068, .026, .064, .022, .022, .016];
  for (let i = 0; i < 3; i++) { const p = onKnee(DX[i], .005), nrm = V(...p).sub(V(...K)).normalize(); dotPts.push(p);
    if (V2 || i < KN.dots) { const d = add(new THREE.CircleGeometry(DR, 22), new THREE.MeshLambertMaterial({ color: dotC }), 'knee_dot_' + (i + 1), 'mark', V(...p), scene, false); d.lookAt(V(...p).add(nrm)); dots.push(d); }
    if (V2 || i < KN.plasters) { const pg = new THREE.Group(); plas.push(pg); pg.name = 'knee_plaster_' + (i + 1); pg.position.copy(V(...onKnee(DX[i], .005, .004))); pg.lookAt(pg.position.clone().add(nrm)); pg.rotateZ((V2 ? 0 : Math.PI / 2) + (i - 1) * .06); scene.add(pg);
      const pc = new THREE.Color('#f2e6c8').lerp(new THREE.Color('#e0c8a8'), fade), padC = new THREE.Color('#c9a56a');
      add(new THREE.PlaneGeometry(PW[0], PW[1]), new THREE.MeshLambertMaterial({ color: '#3a2a1e' }), 'plaster_outline', 'mark', new THREE.Vector3(0, 0, -.0005), pg, false);
      add(new THREE.PlaneGeometry(PW[2], PW[3]), new THREE.MeshLambertMaterial({ color: pc }), 'plaster_strip', 'mark', new THREE.Vector3(0, 0, 0), pg, false);
      add(new THREE.PlaneGeometry(PW[4], PW[5]), new THREE.MeshLambertMaterial({ color: padC }), 'plaster_pad', 'mark', new THREE.Vector3(0, 0, .0006), pg, false);
      for (const sx of [-1, 1]) for (let k = 0; k < 4; k++) add(new THREE.CircleGeometry(.0012, 5), new THREE.MeshLambertMaterial({ color: '#d0bc98' }), 'plaster_vent', 'mark', new THREE.Vector3(sx * (.018 + k * .0045), (k % 2 - .5) * .008, .0006), pg, false); } }
  } else { KF = buildKneeV3(); }
  if (pl.steps) for (const [sx, sy, sh2] of pl.steps) { box(.5, .36, sh2 - .025, steelDk, 'step_stool_v4', 'metal', sx, sy, (sh2 - .025) / 2); box(.5, .36, .025, toon('#2a2f3a'), 'step_stool_top_v4', 'rubber', sx, sy, sh2 - .0125); }   // r4 steps: OR step stools under the staff
  if (V3 && pl.lie_body) { const LB4 = { r: .16, zs: .55, ...(typeof pl.lie_body === 'object' ? pl.lie_body : {}) }, hp = [V3.hip[0] - .04, T.y, T.z + .03];   // r4 lie_body: HIS BODY lying along the table under the drape (head section -> hips)
    const backM = pl.knee_crisp && pl.knee_crisp.back ? toon(pl.knee_crisp.back) : M.drape; bar(chest, hp, LB4.r, backM, 'patient_body_drape_v4', 'cloth', scene, 16).scale.set(1, 1, LB4.zs);
    add(new THREE.SphereGeometry(LB4.r, 16, 10), backM, 'patient_hip_round_v4', 'cloth', V(...hp)).scale.set(1.15, 1, LB4.zs);
    bar([chest[0] - .08, T.y - .3, chest[2] + .02], [chest[0] - .08, T.y + .3, chest[2] + .02], .045, M.drapeDk, 'drape_chest_fold', 'cloth', scene, 10); }
  const kneeTop = KF ? [KF.C0.x + KF.b.x * .02, KF.C0.y + KF.b.y * .02, KF.C0.z + .07] : [K[0], K[1] - .05, K[2] + .09];
  // ---------- S1 round 2 key knee_v3: THE BENT LEG UNDER A DRAPE (thigh up ~33 deg, shin down, the knee a rounded PEAK), a taped dark-blue drape WINDOW on the kneecap,
  // the iodine patch a flattened matte dome ONLY inside the window, three dark-brown dots / three cream plasters in ONE straight row on the face that looks at the lens ----------
  function buildKneeV3() {
    const v3 = a => new THREE.Vector3(a[0], a[1], a[2]), H = v3(V3.hip), KP = v3(V3.at), FT = v3(V3.foot), PAD = T.z + .005, W0 = V3.w, LR = .075;
    const ridge = u => { // u 0..1 along hip -> knee -> foot, the knee rounded (quadratic blend)
      const a = .55; if (u < a - .1) return H.clone().lerp(KP, u / a); if (u > a + .1) return KP.clone().lerp(FT, (u - a) / (1 - a));
      const p0 = H.clone().lerp(KP, (a - .1) / a), p2 = KP.clone().lerp(FT, .1 / (1 - a)), t = (u - (a - .1)) / .2; return p0.clone().multiplyScalar((1 - t) * (1 - t)).addScaledVector(KP, 2 * t * (1 - t)).addScaledVector(p2, t * t); };
    const NU = 64, NV = 28, g = new THREE.BufferGeometry(), pos = [], idx = [];
    for (let i = 0; i <= NU; i++) { const u = -.06 + 1.1 * i / NU, R = ridge(Math.max(0, Math.min(1, u))), ext = u < 0 ? u : u > 1 ? u - 1 : 0; R.x += ext * .5;
      const nearK = Math.exp(-Math.pow((u - .55) / .18, 2)), w = W0 * (1 + .2 * nearK), top = R.z + LR - PAD;
      for (let j = 0; j <= NV; j++) { const v = -1.08 + 2.16 * j / NV, av = Math.min(1, Math.abs(v)), prof = Math.pow(Math.max(0, 1 - Math.pow(av, 2.4)), .7);
        const fold = (.010 + .012 * nearK) * Math.sin(v * 7.5 + u * 23 + 1.7 * Math.sin(u * 9)) * av + .006 * Math.sin(u * 61) * av;
        const y = R.y + v * w * (1 + .1 * av) + fold * .6, z = Math.abs(v) > 1 ? PAD - .02 * (Math.abs(v) - 1) / .08 : PAD + top * prof + fold;
        const P = V(R.x, y, z); pos.push(P.x, P.y, P.z); } }
    for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) { const a = i * (NV + 1) + j, b = a + NV + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); g.computeBoundingBox(); g.computeBoundingSphere();
    const tent = add(g, M.drape.clone ? M.drape.clone() : M.drape, 'patient_leg_drape_tent', 'cloth', null); tent.material.side = THREE.DoubleSide;
    let legM = M.drape;   // r5 leg_drape: lighter blue leg tent + kneecap with fold lines
    if (pl.leg_drape) { const LD = { color: '#5f8fd0', fold: '#3e6aa8', ...(typeof pl.leg_drape === 'object' ? pl.leg_drape : {}) }, uv = [];
      for (let i = 0; i <= NU; i++) for (let j = 0; j <= NV; j++) uv.push(i / NU, j / NV); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      const fT = canvasTex(THREE, 512, 256, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.strokeStyle = LD.fold; c.lineCap = 'round';
        for (let k = 0; k < 13; k++) { const u0 = 18 + k * 37 + rr(-8, 8); c.lineWidth = rr(3, 6); for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(u0 + rr(-4, 4), h / 2 + sd * 22); c.bezierCurveTo(u0 + rr(-14, 14), h / 2 + sd * 70, u0 + rr(-18, 18), h / 2 + sd * 100, u0 + rr(-22, 22), h / 2 + sd * 126); c.stroke(); } }
        c.lineWidth = 4; for (let k = 0; k < 5; k++) { const u0 = w * .55 + rr(-20, 20); for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(u0, h / 2 + sd * 30); c.quadraticCurveTo(u0 + (k - 2) * 26, h / 2 + sd * 80, u0 + (k - 2) * 46, h / 2 + sd * 124); c.stroke(); } } });
      const fM = tent.material; if (fM.color) fM.color.set('#ffffff'); fM.map = fT; if (fM.color) fM.color.set(LD.color); fM.needsUpdate = true;
      legM = M.drape.clone ? M.drape.clone() : M.drape; if (legM.color) legM.color.set(LD.color); }
    // the straight far leg under its own drape fold, flat on the pad (the other side of the table centre line); a low fold over the hips
    bar([V3.hip[0], (pl.leg_drape && pl.leg_drape.far_y) || T.y - .14, T.z + .06], [.5, (pl.leg_drape && pl.leg_drape.far_y) || T.y - .14, T.z + .06], .07, M.drapeDk, 'patient_left_leg_drape', 'cloth', scene, 12);
    bar([V3.hip[0] - .05, T.y - .22, T.z + .05], [V3.hip[0] - .05, T.y + .22, T.z + .05], .06, M.drapeDk, 'drape_hip_fold', 'cloth', scene, 10);
    if (pl.knee_crisp) { const KC = { edge: '#eaf6ff', ink: '#16233f', er: .007, ir: .011, ...(typeof pl.knee_crisp === 'object' ? pl.knee_crisp : {}) }, top = [];   // r6 knee_crisp: the raised-knee V drawn crisp
      for (let i = 0; i <= 60; i++) { const R = ridge(.02 + .96 * i / 60); top.push(V(R.x, R.y, R.z + LR)); }
      const cv = new THREE.CatmullRomCurve3(top), mk = (r, col, nm, dy, dz) => { const pts = top.map(P => { const q = V(0, 0, 0); return P.clone().add(V(0, dy, dz).sub(q)); });
        return add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, r, 6, false), new THREE.MeshBasicMaterial({ color: col }), nm, 'cloth', null); };
      mk(KC.ir, KC.ink, 'knee_v_ink_line', .012, .006);    // a dark ink line just behind/above the top of thigh + shin: the V silhouette
      mk(KC.er, KC.edge, 'knee_v_lamp_edge', -.012, -.001);   // the hard lamp edge along the tops (toward the lens side)
      for (const u of [.2, .3, .4, .7, .8, .9]) { const R = ridge(u); for (const sd of [-1]) bar([R.x, R.y + sd * .02, R.z + LR - .012], [R.x + (u < .55 ? .03 : -.03), R.y + sd * (V3.w ?? .15) * .9, PAD + .03], .0045, toon(KC.fold || '#2f5590'), 'knee_v_fold_line', 'cloth', scene, 5); } }
    // the kneecap face: n toward the lens side of the knee, t across the knee (the row), b along the leg
    const n = v3(V3.face).normalize(), t = new THREE.Vector3(-n.y, n.x, 0).normalize(), b = n.clone().cross(t).normalize(); const KB = ridge(.55).add(new THREE.Vector3(0, 0, LR - (V3.ball ?? .09) + .012)), C0 = KB.clone().addScaledVector(n, (V3.ball ?? .09) + .004);
    const O = V(0, 0, 0), D3 = p => V(p.x, p.y, p.z).sub(O), q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(D3(t), D3(b), D3(n)));
    add(new THREE.SphereGeometry(V3.ball ?? .09, 28, 18), legM, 'patient_kneecap_drape', 'cloth', V(KB.x, KB.y, KB.z));   // the round kneecap under the drape: the PEAK
    const face = new THREE.Group(); face.name = 'knee_face_v3'; face.position.copy(V(C0.x, C0.y, C0.z)); face.quaternion.copy(q); scene.add(face);
    const SW = V3.win ?? .17, TB = pl.knee_win === 'thin' ? .008 : .028, winM = toon('#1c3466');
    for (const [x, y, w, h] of [[0, SW / 2, SW + TB, TB], [0, -SW / 2, SW + TB, TB], [SW / 2, 0, TB, SW], [-SW / 2, 0, TB, SW]]) add(new THREE.BoxGeometry(w, h, pl.knee_win === 'thin' ? .004 : .012), winM, 'drape_window_v3', 'cloth', new THREE.Vector3(x, y, .004), face);
    if (pl.knee_tapes === 'strips') { for (const [x, y, w, h] of [[0, SW / 2, SW * .72, .007], [0, -SW / 2, SW * .72, .007], [SW / 2, 0, .007, SW * .72], [-SW / 2, 0, .007, SW * .72]]) add(new THREE.BoxGeometry(w, h, .003), toon('#eef0ea'), 'drape_tape_v3', 'cloth', new THREE.Vector3(x, y, .0115), face, false); }   // r3: four thin straight off-white strips ON the dark-blue edges, short of the corners: never crossing, no X
    else for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const tp = add(new THREE.BoxGeometry(.05, .022, .004), toon('#eef0ea'), 'drape_tape_v3', 'cloth', new THREE.Vector3(x * SW / 2, y * SW / 2, .012), face, false); tp.rotation.z = x * y * Math.PI / 4; }
    // the iodine patch: a flattened matte dome inside the window (orange-brown, never glowing), painted strokes
    const iT = canvasTex(THREE, 256, 256, (c, w, h) => { c.fillStyle = '#c0702a'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(110,52,18,.35)'; c.lineWidth = 7; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(w / 2, h / 2, 18 + i * 13, rr(0, 3), rr(3, 6)); c.stroke(); } c.strokeStyle = 'rgba(214,140,70,.3)'; c.lineWidth = 4; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(w / 2 + rr(-6, 6), h / 2 + rr(-6, 6), 30 + i * 15, rr(0, 3), rr(3, 6)); c.stroke(); } });
    const skinM = new THREE.MeshLambertMaterial({ map: iT, color: pl.knee_tone || '#d8ccc0' });
    const DRd = (SW - TB) / 2 - .004, DH = V3.dome ?? .035, dome = add(new THREE.SphereGeometry(DRd, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), skinM, 'knee_iodine_dome', 'skin', new THREE.Vector3(0, 0, -.004), face);
    dome.rotation.x = Math.PI / 2; dome.scale.set(1, DH / DRd, 1);
    add(new THREE.PlaneGeometry(SW - TB, SW - TB), skinM, 'knee_iodine_plate', 'skin', new THREE.Vector3(0, 0, -.002), face, false);
    const dotC = new THREE.Color('#4a2a18').lerp(new THREE.Color('#c0702a'), fade), DX = V3.dx ?? .062, DRt = V3.dot ?? .016, hAt = d => DH * Math.sqrt(Math.max(0, 1 - d * d / (DRd * DRd))) - .004;
    for (let i = 0; i < 3; i++) { const d = (i - 1) * DX, lz = hAt(d) + .0025, local = new THREE.Vector3(d, 0, lz), slope = -DH * d / (DRd * DRd) / Math.max(.2, Math.sqrt(1 - d * d / (DRd * DRd)));
      const wp = C0.clone().addScaledVector(t, d).addScaledVector(n, lz); dotPts.push([wp.x, wp.y, wp.z]);
      const dm = add(new THREE.CircleGeometry(DRt, 24), new THREE.MeshLambertMaterial({ color: dotC }), 'knee_dot_' + (i + 1), 'mark', local, face, false); dm.rotation.y = -Math.atan(slope); dots.push(dm);
      const pg = new THREE.Group(); pg.name = 'knee_plaster_' + (i + 1); pg.position.copy(local).add(new THREE.Vector3(0, 0, .002)); pg.rotation.y = -Math.atan(slope); pg.rotation.z = (i - 1) * .05; face.add(pg); plas.push(pg);
      const pc = new THREE.Color('#f2e6c8').lerp(new THREE.Color('#e0c8a8'), fade), PWd = V3.pw ?? [.05, .096, .044, .09, .03, .03];
      add(new THREE.PlaneGeometry(PWd[0], PWd[1]), new THREE.MeshLambertMaterial({ color: '#3a2a1e' }), 'plaster_outline', 'mark', new THREE.Vector3(0, 0, 0), pg, false);
      add(new THREE.PlaneGeometry(PWd[2], PWd[3]), new THREE.MeshLambertMaterial({ color: pc }), 'plaster_strip', 'mark', new THREE.Vector3(0, 0, .0006), pg, false);
      add(new THREE.PlaneGeometry(PWd[4], PWd[5]), new THREE.MeshLambertMaterial({ color: '#c9a56a' }), 'plaster_pad', 'mark', new THREE.Vector3(0, 0, .0012), pg, false); }
    kneeR = DRd; return { n, t, b, C0, face };
  }
  // the drape pulled up over his chest (the fold he lies under)
  if (!V3) bar([chest[0] - .08, T.y - .3, chest[2] + .05], [chest[0] - .08, T.y + .3, chest[2] + .05], .05, M.drapeDk, 'drape_chest_fold', 'cloth', scene, 10);

  // ---------- the anaesthesia machine at the head end (1990s: gauges, flowmeter tubes, bellows, hoses, a vaporiser) ----------
  const AN = [-1.75, 1.15], an = new THREE.Group(); an.name = 'anaesthesia_machine'; scene.add(an);
  box(.6, .5, .9, toon('#d8dcd4'), 'anaes_body', 'plastic', AN[0], AN[1], .55, an); box(.62, .52, .04, steelDk, 'anaes_worktop', 'metal', AN[0], AN[1], 1.02, an);
  for (const [dx, dy] of [[-.25, -.2], [.25, -.2], [-.25, .2], [.25, .2]]) add(new THREE.SphereGeometry(.035, 8, 6), ink, 'anaes_caster', 'rubber', V(AN[0] + dx, AN[1] + dy, .035), an);
  box(.5, .2, .4, toon('#c8ccc4'), 'anaes_top_unit', 'plastic', AN[0], AN[1] + .1, 1.25, an);
  for (let i = 0; i < 4; i++) { add(new THREE.CylinderGeometry(.012, .012, .2, 8), new THREE.MeshLambertMaterial({ color: '#e8f8ff', transparent: true, opacity: .6 }), 'flowmeter_tube', 'glass', V(AN[0] - .15 + i * .08, AN[1] - .01, 1.25), an); add(new THREE.SphereGeometry(.009, 6, 4), toon(['#2a9a4a', '#f4f4f4', '#3a7ad8', '#e8c040'][i]), 'flowmeter_ball', 'plastic', V(AN[0] - .15 + i * .08, AN[1] - .02, 1.2 + i * .02), an); }
  for (let i = 0; i < 3; i++) { add(new THREE.CylinderGeometry(.045, .045, .02, 18), chrome, 'gauge_bezel', 'metal', V(AN[0] - .16 + i * .16, AN[1] - .26, .88), an).rotation.x = Math.PI / 2; add(new THREE.CircleGeometry(.038, 18), white, 'gauge_face', 'sign', V(AN[0] - .16 + i * .16, AN[1] - .272, .88), an, false); box(.003, .002, .03, ink, 'gauge_needle', 'metal', AN[0] - .16 + i * .16 + .008, AN[1] - .274, .885, an, false); }
  add(new THREE.CylinderGeometry(.07, .07, .22, 16), new THREE.MeshLambertMaterial({ color: '#cfe6f0', transparent: true, opacity: .55 }), 'bellows_housing', 'glass', V(AN[0] + .18, AN[1] - .12, 1.16), an);
  for (let i = 0; i < 5; i++) add(new THREE.TorusGeometry(.055, .008, 5, 16), toon('#4a8ab8'), 'bellows_fold', 'rubber', V(AN[0] + .18, AN[1] - .12, 1.08 + i * .03), an).rotation.x = Math.PI / 2;
  add(new THREE.BoxGeometry(.1, .14, .1), toon('#7ac0e0'), 'vaporiser', 'metal', V(AN[0] - .22, AN[1] + .1, 1.12), an);
  const hose = []; for (let i = 0; i <= 10; i++) { const u = i / 10; hose.push(V(AN[0] + .2 - u * .55, AN[1] - .2 - u * .35, 1.05 - Math.sin(u * Math.PI) * .25 + u * .1)); } add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hose), 30, .016, 8), toon('#4a8ab8'), 'breathing_hose', 'rubber', null, an);

  // ---------- THE OR LAMP: ceiling hub, twin yoke, dome with six bulbs; the hard key light aimed at the knee AND the surgeon (place key lamp_at) ----------
  const LMP = pl.lamp_pos || [.18, .5, 2.3], LAT = pl.lamp_at || [.55, .3, 1.32], lampG = new THREE.Group(); lampG.name = 'or_lamp'; scene.add(lampG);
  add(new THREE.CylinderGeometry(.12, .12, .1, 16), steel, 'lamp_ceiling_hub', 'metal', V(.9, 1.2, 3.1), lampG); bar([.9, 1.2, 3.08], [.9, 1.2, 2.85], .035, steel, 'lamp_drop_tube', 'metal', lampG);
  bar([.9, 1.2, 2.85], [.4, .6, 2.75], .04, steel, 'lamp_arm', 'metal', lampG); bar([.4, .6, 2.75], [LMP[0], LMP[1], LMP[2] + .2], .03, steel, 'lamp_yoke', 'metal', lampG);
  add(new THREE.SphereGeometry(.05, 12, 8), chrome, 'lamp_knuckle', 'metal', V(.4, .6, 2.75), lampG); add(new THREE.SphereGeometry(.045, 12, 8), chrome, 'lamp_knuckle', 'metal', V(.9, 1.2, 2.85), lampG);
  const dome = add(new THREE.SphereGeometry(.36, 28, 14, 0, Math.PI * 2, 0, Math.PI * .42), toon('#e6eef2'), 'lamp_dome', 'metal', V(...LMP), lampG); dome.scale.set(1, .55, 1);
  add(new THREE.TorusGeometry(.33, .025, 8, 32), steelDk, 'lamp_rim', 'metal', V(LMP[0], LMP[1], LMP[2] - .01), lampG).rotation.x = Math.PI / 2;
  const face = add(new THREE.CircleGeometry(.32, 32), glow(EVE ? '#6a6a78' : '#f4fbff'), 'lamp_glass', 'lamp', V(LMP[0], LMP[1], LMP[2] - .02), lampG, false); face.rotation.x = Math.PI / 2;
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3, b = add(new THREE.CircleGeometry(.07, 18), glow(EVE ? '#8a8a98' : '#ffffff'), 'lamp_bulb', 'lamp', V(LMP[0] + Math.cos(a) * .19, LMP[1] + Math.sin(a) * .19, LMP[2] - .03), lampG, false); b.rotation.x = Math.PI / 2;
    const r = add(new THREE.TorusGeometry(.075, .008, 5, 16), chrome, 'bulb_reflector_ring', 'metal', V(LMP[0] + Math.cos(a) * .19, LMP[1] + Math.sin(a) * .19, LMP[2] - .035), lampG, false); r.rotation.x = Math.PI / 2; }
  bar([LMP[0], LMP[1], LMP[2] - .03], [LMP[0], LMP[1], LMP[2] - .2], .025, toon('#3aa0d8'), 'lamp_sterile_handle', 'rubber', lampG);
  if (!EVE) { const spot = new THREE.SpotLight('#f4fbff', pl.lamp_i ?? 26, 6, pl.lamp_angle ?? .5, .28, 1.4); spot.position.copy(V(LMP[0], LMP[1], LMP[2] - .05)); spot.target.position.copy(V(...LAT));
    spot.castShadow = true; spot.shadow.mapSize.set(2048, 2048); spot.shadow.bias = -.0006; spot.shadow.radius = 1.5; spot.name = 'or_lamp_key'; scene.add(spot); scene.add(spot.target);
    const dir = V(...LAT).sub(V(LMP[0], LMP[1], LMP[2] - .05)), Ld = dir.length(), cone = new THREE.Mesh(new THREE.CylinderGeometry(.26, .62, Ld, 32, 1, true), new THREE.MeshBasicMaterial({ color: '#e8f6ff', transparent: true, opacity: .04, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    cone.name = 'lamp_light_cone'; cone.userData.role = 'lamp'; cone.position.copy(V(LMP[0], LMP[1], LMP[2] - .05)).addScaledVector(dir, .5); cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.clone().normalize()); scene.add(cone); }
  // ---------- evening: coral low sun through the two portholes, long shafts across the floor to the table ----------
  if (EVE) { for (const dx of [-.42, .42]) { const src = V(1.85 + dx, 3.4, 1.75), tgt = V(.6 + dx * .6, .2, .0), sp = new THREE.SpotLight('#ff9a48', pl.eve_i ?? 22, 10, .2, .5, 1.1); sp.position.copy(src); sp.target.position.copy(tgt); sp.castShadow = dx > 0; sp.shadow.mapSize.set(1024, 1024); scene.add(sp); scene.add(sp.target);
      const d = tgt.clone().sub(src), sh = new THREE.Mesh(new THREE.CylinderGeometry(.14, .5, d.length(), 24, 1, true), new THREE.MeshBasicMaterial({ color: '#ffa070', transparent: true, opacity: .05, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
      sh.name = 'porthole_sun_shaft'; sh.userData.role = 'lamp'; sh.position.copy(src).addScaledVector(d, .5); sh.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), d.clone().normalize()); scene.add(sh); } }
  // dust motes in the lamp cone (or the porthole shafts), drifting out of phase
  const motes = []; for (let i = 0; i < (pl.dust ?? 40); i++) { const p = EVE ? [rr(.6, 2.2), rr(.6, 2.8), rr(.3, 1.7)] : [rr(LMP[0] - .1, LAT[0] + .2), rr(LAT[1] - .1, LMP[1] + .2), rr(1.45, 2.15)]; const m = add(new THREE.SphereGeometry(.0045, 5, 4), glow(EVE ? '#ffd0a0' : '#f4fbff'), 'dust_in_light', 'lamp', V(...p), scene, false); motes.push({ m, p, ph: rr(0, 6.28), sp: rr(.2, .5) }); }
  ticks.push(t => motes.forEach(o => o.m.position.copy(V(o.p[0] + Math.sin(t * o.sp + o.ph) * .03, o.p[1] + Math.cos(t * o.sp * .7 + o.ph) * .02, o.p[2] + Math.sin(t * o.sp * .5 + o.ph * 2) * .04))));

  // ---------- the arthroscopy tower: cart, CRT monitor (monitor key), camera box, light source, pump, the VCR with PLAY light, the scope coiled in its sealed bag ----------
  const TW = [.42, 2.45], tw = new THREE.Group(); tw.name = 'arthroscopy_tower'; scene.add(tw);
  box(.62, .5, .06, steelDk, 'tower_base', 'metal', TW[0], TW[1], .1, tw); for (const [dx, dy] of [[-.26, -.2], [.26, -.2], [-.26, .2], [.26, .2]]) add(new THREE.SphereGeometry(.04, 8, 6), ink, 'tower_caster', 'rubber', V(TW[0] + dx, TW[1] + dy, .04), tw);
  for (const dx of [-.28, .28]) bar([TW[0] + dx, TW[1] - .2, .1], [TW[0] + dx, TW[1] - .2, 1.35], .02, steel, 'tower_post', 'metal', tw);
  const unitT = (label, col) => canvasTex(THREE, 256, 64, (c, w, h) => { c.fillStyle = '#e4e8ec'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a2f3a'; c.font = 'bold 22px Arial'; c.fillText(label, 10, 26); c.fillStyle = col; c.fillRect(170, 14, 70, 34); c.fillStyle = '#0a1a10'; c.font = 'bold 22px monospace'; c.fillText(label === 'PUMP' ? '0.0' : label === 'VCR' ? 'PLAY' : 'OFF', 176, 40);
    for (let i = 0; i < 4; i++) { c.fillStyle = ['#3aa0d8', '#8a5ac8', '#5ac85a', '#f2c230'][i]; c.beginPath(); c.arc(20 + i * 30, 48, 7, 0, Math.PI * 2); c.fill(); } });
  [['VCR', '#7fe08a'], ['CAMERA', '#7fe08a'], ['LIGHT', '#ffd04a'], ['PUMP', '#7fd6ff']].forEach(([lb, col], i) => { const z = .3 + i * .21, gray = toon('#c8ccd2');
    box(.56, .42, .17, [gray, gray, toon('#d8dce2'), toon('#a8acb2'), new THREE.MeshLambertMaterial({ map: unitT(lb, col) }), gray], 'tower_unit_' + lb.toLowerCase(), 'metal', TW[0], TW[1], z, tw); });
  box(.2, .015, .02, ink, 'vcr_tape_slot', 'plastic', TW[0] + .05, TW[1] - .212, .33, tw); add(new THREE.SphereGeometry(.012, 6, 4), glow('#5aff6a'), 'vcr_play_led', 'lamp', V(TW[0] - .2, TW[1] - .215, .27), tw, false);
  box(.58, .44, .03, steelDk, 'tower_top_shelf', 'metal', TW[0], TW[1], 1.12, tw);
  const monC = document.createElement('canvas'); monC.width = 512; monC.height = 340; const mg = monC.getContext('2d');
  const drawMon = (t = 0) => { const w = 512, h = 340, c = mg;
    if (MON === 'tape') { c.fillStyle = '#2a1a22'; c.fillRect(0, 0, w, h); const g = c.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, 220); g.addColorStop(0, '#f8d8d0'); g.addColorStop(.6, '#e8a8a8'); g.addColorStop(1, '#5a2a3a'); c.fillStyle = g; c.beginPath(); c.arc(w / 2, h / 2, 160, 0, 7); c.fill();
      c.fillStyle = 'rgba(255,250,240,.85)'; c.beginPath(); c.ellipse(w / 2 - 30, h / 2 + 10, 90, 50, -.3, 0, 7); c.fill(); c.fillStyle = '#ffffff'; c.font = 'bold 26px monospace'; c.fillText('PLAY >', 24, 40); c.fillText('REAL ONE', w - 170, h - 22); }
    else if (MON === 'snow') { const im = c.createImageData(w, h), d = im.data; let s = (t * 1000 | 0) + 1; for (let i = 0; i < d.length; i += 4) { s = (s * 16807) % 2147483647; const v = 60 + (s % 190); d[i] = v; d[i + 1] = v; d[i + 2] = v + 8; d[i + 3] = 255; } c.putImageData(im, 0, 0); }
    else if (MON === 'off') { c.fillStyle = '#1a2422'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.08)'; c.beginPath(); c.ellipse(w * .3, h * .3, 120, 50, -.4, 0, 7); c.fill(); }
    else { c.fillStyle = '#1a3fb0'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.font = 'bold 74px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('NO SIGNAL', w / 2, h / 2 - 10); c.font = 'bold 26px Arial'; c.fillStyle = '#bcd0ff'; c.fillText('ARTHROSCOPE: NOT CONNECTED', w / 2, h / 2 + 62); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; }
    for (let y = 0; y < h; y += 3) { c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(0, y, w, 1); } };   // scanlines
  drawMon(0); const monT = new THREE.CanvasTexture(monC); monT.colorSpace = THREE.SRGBColorSpace;
  if (MON === 'snow') ticks.push(t => { drawMon(t); monT.needsUpdate = true; });
  box(.7, .34, .5, toon('#c8c4b8'), 'monitor_crt_shell', 'plastic', TW[0], TW[1] + .08, 1.42, tw); box(.7, .12, .5, toon('#d8d4c8'), 'monitor_bezel', 'plastic', TW[0], TW[1] - .05, 1.42, tw);
  add(new THREE.PlaneGeometry(.6, .41), new THREE.MeshBasicMaterial({ map: monT, toneMapped: false }), 'monitor_screen', 'lamp', V(TW[0], TW[1] - .115, 1.43), tw, false);
  box(.1, .1, .1, steelDk, 'monitor_neck', 'metal', TW[0], TW[1], 1.16, tw); add(new THREE.SphereGeometry(.015, 6, 4), glow('#5aff6a'), 'monitor_power_led', 'lamp', V(TW[0] + .28, TW[1] - .115, 1.19), tw, false);
  for (let i = 0; i < 3; i++) add(new THREE.CylinderGeometry(.012, .012, .02, 10), ink, 'monitor_knob', 'plastic', V(TW[0] + .12 + i * .05, TW[1] - .115, 1.2), tw).rotation.x = Math.PI / 2;
  // the scope never went in: coiled camera cable + the scope in its SEALED clear sterile bag with a seal tag on the top shelf
  for (let i = 0; i < 3; i++) { const r = add(new THREE.TorusGeometry(.09 - i * .015, .008, 6, 22), toon('#3a3f4a'), 'unused_scope_cable', 'rubber', V(TW[0] - .1, TW[1] - .05, 1.15 + i * .012), tw); r.rotation.x = Math.PI / 2; }
  bar([TW[0] + .02, TW[1] - .12, 1.15], [TW[0] + .24, TW[1] - .1, 1.15], .008, chrome, 'scope_shaft_in_bag', 'metal', tw);
  box(.3, .14, .03, new THREE.MeshLambertMaterial({ color: '#f0f8ff', transparent: true, opacity: .35 }), 'sterile_bag_sealed', 'plastic', TW[0] + .12, TW[1] - .1, 1.16, tw, false); box(.05, .02, .035, toon('#3a8ad0'), 'bag_seal_tag', 'paper', TW[0] + .27, TW[1] - .1, 1.16, tw, false);

  // ---------- IV pole with two SALINE bags and a drip line ----------
  const IV = [1.25, 1.75]; bar([IV[0], IV[1], .05], [IV[0], IV[1], 2.1], .014, chrome, 'iv_pole'); for (let i = 0; i < 5; i++) bar([IV[0], IV[1], .06], [IV[0] + Math.cos(i * 1.256) * .25, IV[1] + Math.sin(i * 1.256) * .25, .03], .012, steel, 'iv_base_leg');
  bar([IV[0] - .18, IV[1], 2.08], [IV[0] + .18, IV[1], 2.08], .01, chrome, 'iv_hook_bar');
  const salT = canvasTex(THREE, 128, 192, (c, w, h) => { c.fillStyle = '#eaf6fb'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d3f8a'; c.fillRect(0, 34, w, 38); c.fillStyle = '#ffffff'; c.font = 'bold 26px Arial'; c.textAlign = 'center'; c.fillText('SALINE', w / 2, 62); c.fillStyle = '#1d3f8a'; c.font = 'bold 18px Arial'; c.fillText('0.9% NaCl', w / 2, 100); c.fillText('3000 mL', w / 2, 124); for (let y = 140; y < 186; y += 9) c.fillRect(20, y, 12, 2); });
  for (const dx of [-.13, .13]) add(new THREE.BoxGeometry(.2, .3, .05), [toon('#dff0f8'), toon('#dff0f8'), toon('#dff0f8'), toon('#dff0f8'), new THREE.MeshLambertMaterial({ map: salT }), toon('#dff0f8')], 'saline_bag', 'plastic', V(IV[0] + dx, IV[1] - .02, 1.85));
  const tube = []; for (let i = 0; i <= 12; i++) { const u = i / 12; tube.push(V(IV[0] - .13 + u * .05, IV[1] - .03 - u * .3, 1.7 - 1.2 * u + .35 * Math.sin(Math.PI * u) * u)); }
  add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tube), 30, .006, 5), new THREE.MeshLambertMaterial({ color: '#e8f6ff', transparent: true, opacity: .7 }), 'saline_tube', 'plastic');

  // ---------- THE INSTRUMENT TRAY (Mayo stand) in the foreground: towel, scalpels, clamps, gauze, the steel bowl of water (no suture, no needle) ----------
  const MY = pl.tray_at || [-.98, -.75, .95], my = new THREE.Group(); my.name = 'instrument_tray'; scene.add(my);
  box(.62, .4, .025, steel, 'mayo_tray', 'metal', MY[0], MY[1], MY[2], my); for (const s of [-1, 1]) box(.62, .015, .04, steel, 'mayo_tray_lip', 'metal', MY[0], MY[1] + s * .2, MY[2] + .02, my); for (const s of [-1, 1]) box(.015, .4, .04, steel, 'mayo_tray_lip', 'metal', MY[0] + s * .31, MY[1], MY[2] + .02, my);
  bar([MY[0] - .32, MY[1], MY[2] - .02], [MY[0] - .32, MY[1], .08], .022, chrome, 'mayo_post', 'metal', my); box(.5, .5, .04, steelDk, 'mayo_base', 'metal', MY[0] - .32, MY[1] + .1, .04, my);
  box(.58, .36, .012, M.drape, 'tray_towel', 'cloth', MY[0], MY[1], MY[2] + .02, my);
  const onT = MY[2] + .03;
  for (let i = 0; i < 2; i++) { box(.16, .016, .006, chrome, 'tray_scalpel', 'metal', MY[0] - .2, MY[1] - .12 + i * .04, onT, my); box(.03, .012, .004, toon('#ffffff'), 'tray_scalpel_blade', 'metal', MY[0] - .1, MY[1] - .12 + i * .04, onT + .002, my); }
  for (let i = 0; i < 3; i++) { const sx = MY[0] - .02 + i * .07; bar([sx, MY[1] - .14, onT + .004], [sx + .01, MY[1] + .06, onT + .004], .0045, chrome, 'tray_clamp_shaft', 'metal', my, 5); for (const o of [-.008, .012]) add(new THREE.TorusGeometry(.016, .004, 5, 12), chrome, 'tray_clamp_ring', 'metal', V(sx + o, MY[1] - .16, onT + .004), my).rotation.x = Math.PI / 2; }
  for (let i = 0; i < 4; i++) box(.1, .1, .008, toon('#ffffff'), 'tray_gauze', 'cloth', MY[0] + .2, MY[1] - .1, onT + .004 + i * .008, my);
  const bowl = add(new THREE.SphereGeometry(.09, 20, 10, 0, Math.PI * 2, Math.PI * .5, Math.PI * .5), (ctx.pbr ? ctx.pbr.metal('steel', { color: '#c8d0dc', rough: .25, toon: '#c8d0dc', seed: 9 }) : toon('#c8d0dc')), 'saline_bowl', 'metal', V(MY[0] - .05, MY[1] + .1, onT + .085), my); bowl.scale.y = .9; bowl.material.side = THREE.DoubleSide;
  const wat = add(new THREE.CircleGeometry(.08, 24), new THREE.MeshBasicMaterial({ color: '#8fdcf0' }), 'bowl_water', 'water', V(MY[0] - .05, MY[1] + .1, onT + .06), my, false); wat.rotation.x = -Math.PI / 2;
  const rip = add(new THREE.RingGeometry(.03, .036, 24), new THREE.MeshBasicMaterial({ color: '#ffffff' }), 'bowl_ripple', 'water', V(MY[0] - .05, MY[1] + .1, onT + .062), my, false); rip.rotation.x = -Math.PI / 2;
  ticks.push(t => { const k = 1 + .25 * Math.sin(t * 3); rip.scale.set(k, k, 1); });

  // ---------- floor things: kick bucket on its dolly, foot switch + cable, the splash puddle under the knee; the row 29 flood (water_floor) ----------
  const kbG = new THREE.Group(); kbG.name = 'kick_bucket_group'; scene.add(kbG);
  add(new THREE.CylinderGeometry(.2, .16, .3, 20, 1, true), steel, 'kick_bucket', 'metal', V(1.25, -.35, .2), kbG); add(new THREE.TorusGeometry(.2, .012, 6, 24), chrome, 'kick_bucket_rim', 'metal', V(1.25, -.35, .35), kbG).rotation.x = Math.PI / 2;
  add(new THREE.CylinderGeometry(.18, .18, .07, 18), steelDk, 'kick_bucket_dolly', 'metal', V(1.25, -.35, .04), kbG);
  box(.26, .18, .05, toon('#2a2f3a'), 'foot_switch', 'rubber', 1.3, .35, .025); bar([1.3, .45, .03], [.6, .9, .03], .008, toon('#2a2f3a'), 'foot_switch_cable', 'rubber');
  const wet = add(new THREE.CircleGeometry(.22, 24), new THREE.MeshBasicMaterial({ color: '#a8e4f8', transparent: true, opacity: .35 }), 'splash_puddle', 'water', V(.38, .2, .006), scene, false); wet.rotation.x = -Math.PI / 2; wet.scale.set(1.3, .8, 1);
  if (WF > 0) { const dz = .3 * WF, wm = ctx.pbr && ctx.pbr.on !== false ? ctx.pbr.metal('wet', { color: '#3a9a9a', rough: .08, env: 1.2, toon: '#5ab8b8' }) : new THREE.MeshStandardMaterial({ color: '#5ab8b8', roughness: .1 });
    wm.transparent = true; wm.opacity = .72; const sheet = add(new THREE.PlaneGeometry(5.5, 6.2, 60, 60), wm, 'flood_water_sheet', 'water', V(0, .1, dz), scene, false); sheet.rotation.x = -Math.PI / 2;
    const rings = []; for (let i = 0; i < 6; i++) { const r = add(new THREE.RingGeometry(.2, .23, 32), new THREE.MeshBasicMaterial({ color: '#e8fbff', transparent: true, opacity: .5, depthWrite: false }), 'flood_ripple', 'water', V(.38 + rr(-.6, .6), .1 + rr(-.6, .6), dz + .003), scene, false); r.rotation.x = -Math.PI / 2; rings.push({ r, ph: rr(0, 1) }); }
    const pos = sheet.geometry.attributes.position, base = Float32Array.from(pos.array);
    ticks.push(t => { for (let i = 0; i < pos.count; i++) { const x = base[i * 3], y = base[i * 3 + 1]; pos.setZ(i, .012 * Math.sin(x * 4 + t * 2.2) + .008 * Math.sin(y * 5.3 - t * 1.7)); } pos.needsUpdate = true; sheet.geometry.computeVertexNormals();
      rings.forEach(o => { const u = (t * .5 + o.ph) % 1, k = .5 + u * 4; o.r.scale.set(k, k, 1); o.r.material.opacity = .5 * (1 - u); }); kbG.position.y = dz * .6 + .02 * Math.sin(t * 2); kbG.rotation.z = .05 * Math.sin(t * 1.3); }); }

  // ---------- ENV v3 (env helper E2, 2026-11-17; place key env_v3: true, default OFF): OR 3 richer at phone size. Additive only: nothing above moves. ----------
  if (pl.env_v3) {
    const lab = (w, h, bg, draw) => new THREE.MeshLambertMaterial({ map: canvasTex(THREE, w, h, (c, W, H) => { c.fillStyle = bg; c.fillRect(0, 0, W, H); draw(c, W, H); }) });
    const txt = (c, s, x, y, px, col = '#1e2a2a', al = 'left') => { c.fillStyle = col; c.font = 'bold ' + px + 'px Arial'; c.textAlign = al; c.textBaseline = 'middle'; c.fillText(s, x, y); };
    const tube = (pts, r, mat, nm, seg = 40) => add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => V(...p))), seg, r, 6), mat, nm, 'rubber', null, scene, false);
    const plas = c => (M.plasticOf ? M.plasticOf(c) : toon(c)), beigeP = plas('#dcd6c4'), greyP = plas('#b8bec4');
    // (1) wall colour band: a deeper teal tile course at hand height + a pale cap course (breaks the one flat tile colour), on the back + side walls
    for (const [sx, sy, x, y] of [[5.4, .01, 0, 3.02], [.01, 6.8, -2.72, -.4], [.01, 6.8, 2.72, -.4]]) { box(sx, sy, .15, M.paint('#2f7d72'), 'env_tile_band', 'wall', x, y, 1.12, scene, false); box(sx, sy, .03, M.paint('#cfe9e2'), 'env_tile_band_cap', 'wall', x, y, 1.21, scene, false); }
    // (2) anaesthesia DRUG CART with three dial gauges on its vitals unit (behind the head end, under the X-ray box)
    { const CX = -1.0, CY = 2.72, cg = new THREE.Group(); cg.name = 'env_anaes_cart'; scene.add(cg);
      box(.62, .46, .92, plas('#e4e0d2'), 'cart_body', 'plastic', CX, CY, .52, cg);
      const dc = ['#3a7ad8', '#f2c230', '#3aae5a', '#8a5ac8', '#f4f4f0'];
      for (let k = 0; k < 5; k++) { const z = .2 + k * .16; box(.56, .02, .13, toon(dc[k]), 'cart_drawer_front', 'plastic', CX, CY - .235, z, cg, false); box(.2, .025, .025, chrome, 'cart_drawer_pull', 'metal', CX, CY - .252, z + .02, cg, false); box(.08, .004, .04, white, 'cart_drawer_label', 'paper', CX + .19, CY - .248, z, cg, false); }
      for (const [dx, dy] of [[-.27, -.19], [.27, -.19], [-.27, .19], [.27, .19]]) add(new THREE.SphereGeometry(.035, 8, 6), ink, 'cart_caster', 'rubber', V(CX + dx, CY + dy, .035), cg);
      box(.66, .5, .03, steelDk, 'cart_top', 'metal', CX, CY, .995, cg); box(.5, .3, .26, greyP, 'cart_vitals_unit', 'plastic', CX, CY + .05, 1.14, cg);
      for (let i = 0; i < 3; i++) { const gx = CX - .15 + i * .15, gz = 1.17; add(new THREE.CylinderGeometry(.052, .052, .025, 20), chrome, 'cart_dial_bezel', 'metal', V(gx, CY - .1, gz), cg).rotation.x = Math.PI / 2;
        add(new THREE.CircleGeometry(.044, 20), lab(64, 64, '#f8f8f2', (c) => { c.strokeStyle = '#1e2a2a'; c.lineWidth = 3; for (let t = 0; t < 9; t++) { const a = Math.PI * (.75 + t * .1875); c.beginPath(); c.moveTo(32 + Math.cos(a) * 22, 32 + Math.sin(a) * 22); c.lineTo(32 + Math.cos(a) * 28, 32 + Math.sin(a) * 28); c.stroke(); } c.fillStyle = ['#3aae5a', '#f2c230', '#3a7ad8'][i]; c.fillRect(8, 44, 48, 6); }), 'cart_dial_face', 'sign', V(gx, CY - .115, gz), cg, false);
        const nd = box(.004, .002, .036, ink, 'cart_dial_needle', 'metal', gx, CY - .118, gz + .01, cg, false); nd.rotation.z = (i - 1) * .6; }
      add(new THREE.PlaneGeometry(.42, .05), lab(256, 32, '#2a2f3a', (c, W, H) => { txt(c, 'BP   SpO2   HR', W / 2, H / 2, 20, '#bfe8ff', 'center'); }), 'cart_vitals_label', 'sign', V(CX, CY - .102, 1.245), cg, false);
      box(.14, .12, .18, plas('#f2c230'), 'cart_sharps_box', 'plastic', CX + .22, CY - .05, 1.1, cg); box(.1, .1, .05, steel, 'cart_syringe_tray', 'metal', CX - .25, CY - .14, 1.035, cg);
      for (let k = 0; k < 4; k++) bar([CX - .28 + k * .02, CY - .17, 1.04], [CX - .28 + k * .02, CY - .1, 1.04], .005, toon(['#f4f4f0', '#3a7ad8', '#f4f4f0', '#3aae5a'][k]), 'cart_syringe', 'plastic', cg, 6); }
    // (3) WHITEBOARD with the day's OR schedule (back wall between the X-ray box and the tower), marker tray, two magnets
    { const wb = lab(512, 340, '#fbfbf6', (c, W, H) => { txt(c, 'OR SCHEDULE   TUE', 20, 34, 34, '#1e3f8a'); c.fillStyle = '#1e3f8a'; c.fillRect(20, 56, W - 40, 3);
        [['OR 1', '7:30', 'HIP', '#1e2a2a'], ['OR 2', '8:00', 'GALLBLADDER', '#1e2a2a'], ['OR 3', '8:15', 'KNEE SCOPE', '#1f7a3a'], ['OR 4', '9:45', 'HAND', '#1e2a2a']].forEach(([a, b, d, col], i) => { const y = 96 + i * 54; txt(c, a, 22, y, 28, col); txt(c, b, 128, y, 28, col); txt(c, d, 220, y, 28, col); c.fillStyle = 'rgba(30,42,42,.18)'; c.fillRect(20, y + 26, W - 40, 2); });
        c.strokeStyle = '#1f7a3a'; c.lineWidth = 4; c.beginPath(); c.ellipse(300, 204, 120, 26, 0, 0, 7); c.stroke(); c.fillStyle = 'rgba(120,140,150,.18)'; c.fillRect(330, 290, 150, 30); });
      box(.84, .03, .58, steel, 'whiteboard_frame', 'metal', -.32, 3.015, 1.92, scene, false); add(new THREE.PlaneGeometry(.8, .54), wb, 'whiteboard_schedule', 'sign', V(-.32, 2.995, 1.92), scene, false);
      box(.6, .06, .025, steel, 'whiteboard_marker_tray', 'metal', -.32, 2.97, 1.62, scene, false); ['#1e3f8a', '#1f7a3a', '#1e2a2a'].forEach((col, i) => bar([-.5 + i * .12, 2.965, 1.645], [-.42 + i * .12, 2.965, 1.645], .008, toon(col), 'whiteboard_marker', 'plastic', scene, 6));
      for (const [x, z, col] of [[-.66, 2.15, '#3a7ad8'], [.02, 2.16, '#f2c230']]) add(new THREE.CylinderGeometry(.018, .018, .01, 12), toon(col), 'whiteboard_magnet', 'plastic', V(x, 2.99, z), scene, false).rotation.x = Math.PI / 2; }
    // (4) CEILING SERVICE PENDANT (gas boom) over the head end: column, outlet block (O2 green, N2O blue, AIR yellow, VAC white) and drooping coloured hoses to the machine
    { const PX = -1.45, PY = 1.55; bar([PX, PY, 3.15], [PX, PY, 2.35], .07, steel, 'env_gas_pendant_column', 'metal'); add(new THREE.CylinderGeometry(.14, .14, .05, 20), steelDk, 'env_gas_pendant_cap', 'metal', V(PX, PY, 3.12));
      box(.26, .26, .42, plas('#e8ecec'), 'env_gas_pendant_block', 'plastic', PX, PY, 2.18);
      ['#2a9a4a', '#2a5ad8', '#e8c040', '#f4f4f4'].forEach((col, i) => { const z = 2.32 - i * .09; add(new THREE.CylinderGeometry(.03, .03, .02, 14), toon(col), 'env_pendant_outlet', 'plastic', V(PX + .14, PY - .05, z)).rotation.z = Math.PI / 2;
        const h = []; for (let k = 0; k <= 8; k++) { const u = k / 8; h.push([PX + .15 + u * (-1.65 - PX - .15) + Math.sin(u * 3 + i) * .04, PY - .05 + u * (1.05 - PY + .05) - i * .02, z - Math.sin(u * Math.PI) * (.45 + i * .07) - u * (z - 1.3)]); }
        const hm = tube(h, .011, toon(col), 'env_gas_hose'); ticks.push(t => { hm.rotation.x = .004 * Math.sin(t * .9 + i * 1.7); }); }); }
    // (5) floor SUCTION UNIT beside the head end: five-star base, pole, two clear canisters, vacuum dial, hose
    { const SX = -2.3, SY = .55; for (let i = 0; i < 5; i++) { const a = i * 1.2566; bar([SX, SY, .06], [SX + Math.cos(a) * .24, SY + Math.sin(a) * .24, .05], .015, steelDk, 'suction_base_leg'); add(new THREE.SphereGeometry(.025, 8, 6), ink, 'suction_caster', 'rubber', V(SX + Math.cos(a) * .24, SY + Math.sin(a) * .24, .025)); }
      bar([SX, SY, .06], [SX, SY, 1.25], .018, chrome, 'suction_pole'); box(.26, .18, .2, beigeP, 'suction_regulator', 'plastic', SX, SY, 1.15);
      add(new THREE.CylinderGeometry(.06, .06, .02, 20), chrome, 'suction_dial_bezel', 'metal', V(SX + .05, SY - .1, 1.17)).rotation.x = Math.PI / 2; add(new THREE.CircleGeometry(.05, 20), white, 'suction_dial_face', 'sign', V(SX + .05, SY - .112, 1.17)); box(.004, .002, .04, ink, 'suction_dial_needle', 'metal', SX + .06, SY - .114, 1.18).rotation.z = -.7;
      for (const dz of [.55, .85]) { add(new THREE.CylinderGeometry(.075, .075, .24, 18), new THREE.MeshLambertMaterial({ color: '#e8f4f0', transparent: true, opacity: .55 }), 'suction_canister_2', 'glass', V(SX + .1, SY - .06, dz)); add(new THREE.CylinderGeometry(.08, .08, .03, 18), toon('#3a7ad8'), 'suction_canister_lid', 'plastic', V(SX + .1, SY - .06, dz + .13)); box(.04, .1, .03, steelDk, 'suction_canister_bracket', 'metal', SX + .03, SY - .03, dz); }
      tube([[SX + .1, SY - .06, 1.0], [SX + .35, SY - .1, .7], [SX + .6, SY - .05, .25], [SX + .9, SY + .1, .03], [SX + 1.25, SY + .05, .03]], .012, new THREE.MeshLambertMaterial({ color: '#e8f6ff', transparent: true, opacity: .75 }), 'suction_hose'); }
    // (6) SECOND INSTRUMENT TROLLEY (the back table) along the right side: steel top, blue drape, instruments in rows, a basin, a lower shelf with packs
    { const BX = 2.05, BY = .3, bt = new THREE.Group(); bt.name = 'env_back_table'; scene.add(bt);
      box(.62, 1.25, .025, steel, 'back_table_top', 'metal', BX, BY, .9, bt); box(.6, 1.2, .02, steelDk, 'back_table_shelf', 'metal', BX, BY, .3, bt);
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) { bar([BX + sx * .29, BY + sy * .6, .05], [BX + sx * .29, BY + sy * .6, .9], .015, steel, 'back_table_leg', 'metal', bt); add(new THREE.SphereGeometry(.03, 8, 6), ink, 'back_table_caster', 'rubber', V(BX + sx * .29, BY + sy * .6, .03), bt); }
      box(.64, 1.27, .012, M.drape, 'back_table_drape', 'cloth', BX, BY, .918, bt); box(.012, 1.27, .28, M.drape, 'back_table_drape_hang', 'cloth', BX - .32, BY, .78, bt);
      for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) { const ix = BX - .2 + r * .14, iy = BY - .5 + k * .12; bar([ix, iy - .04, .93], [ix + .01, iy + .05, .93], .005, chrome, 'back_table_instrument', 'metal', bt, 5); if (r === 1) add(new THREE.TorusGeometry(.013, .003, 4, 10), chrome, 'instrument_ring', 'metal', V(ix, iy - .05, .932), bt).rotation.x = Math.PI / 2; }
      add(new THREE.SphereGeometry(.12, 20, 10, 0, Math.PI * 2, Math.PI * .5, Math.PI * .5), chrome, 'back_table_basin', 'metal', V(BX + .12, BY + .42, 1.04), bt);
      for (let k = 0; k < 3; k++) box(.24, .2, .07, toon(['#f4f4f0', '#bfe0f0', '#e8e4d8'][k]), 'back_table_pack', 'paper', BX - .1 + (k % 2) * .2, BY - .4 + k * .35, .35, bt);
      const tg = add(new THREE.PlaneGeometry(.16, .08), lab(128, 64, '#f4f4f0', (c, W, H) => txt(c, 'KNEE SET', W / 2, H / 2, 22, '#1e3f8a', 'center')), 'back_table_tag', 'paper', V(BX - .1, BY - .4, .39), bt, false); tg.rotation.x = -Math.PI / 2; }
    // (7) LINEN HAMPER (steel ring frame, blue cloth bag, lid) + a second kick bucket with gauze
    { const HX = -2.3, HY = -.7; box(.44, .44, .02, steelDk, 'hamper_base', 'metal', HX, HY, .07); for (const sx of [-1, 1]) for (const sy of [-1, 1]) bar([HX + sx * .2, HY + sy * .2, .07], [HX + sx * .2, HY + sy * .2, .85], .012, chrome, 'hamper_post');
      add(new THREE.TorusGeometry(.24, .015, 6, 24), chrome, 'hamper_ring', 'metal', V(HX, HY, .86)).rotation.x = Math.PI / 2; const bag = add(new THREE.CylinderGeometry(.23, .2, .7, 18, 3, true), (M.drapeDk || M.drape).clone(), 'hamper_bag', 'cloth', V(HX, HY, .5)); bag.material.side = THREE.DoubleSide;
      const lid = add(new THREE.CylinderGeometry(.25, .25, .025, 20), steel, 'hamper_lid', 'metal', V(HX + .12, HY, .98)); lid.rotation.z = .6; box(.12, .08, .02, ink, 'hamper_pedal', 'rubber', HX - .26, HY, .06);
      for (let k = 0; k < 4; k++) { const g = add(new THREE.SphereGeometry(.09, 8, 6), toon(['#3a6ab8', '#e8f0f4', '#5f8fd0', '#2f5fa8'][k]), 'hamper_linen_lump', 'cloth', V(HX + rr(-.1, .1), HY + rr(-.1, .1), .82 + rr(0, .06))); g.scale.set(1.3, .55, 1); }
      const kb = add(new THREE.CylinderGeometry(.18, .14, .28, 20, 1, true), steel.clone(), 'kick_bucket_2', 'metal', V(1.6, -.6, .19)); kb.material.side = THREE.DoubleSide; add(new THREE.CylinderGeometry(.16, .16, .06, 18), steelDk, 'kick_bucket_2_dolly', 'metal', V(1.6, -.6, .04));
      for (let k = 0; k < 2; k++) { const gz = add(new THREE.SphereGeometry(.05, 7, 5), white, 'kick_bucket_gauze', 'cloth', V(1.58 + k * .05, -.6, .3)); gz.scale.set(1, .5, 1); } }
    // (8) more STEEL CABINETS with glass doors + labelled boxes (right wall, left wall front)
    const cab = (x, y, face, nm) => { const g = new THREE.Group(); g.name = nm; scene.add(g); const ax = x + face * .2;
      box(.4, .9, 1.9, steel, nm + '_body', 'metal', ax, y, .95, g); const L = ['GAUZE 4x4', 'GLOVES 7.5', 'DRAPES', 'SPONGES', 'TUBING', 'GOWNS'], bc = ['#f4f4f0', '#8a5ac8', '#3a7ad8', '#f2c230', '#3aae5a', '#bfe0f0'];
      for (let s = 0; s < 4; s++) { box(.34, .84, .02, steelDk, nm + '_shelf', 'metal', ax + face * .02, y, .4 + s * .42, g, false);
        for (let k = 0; k < 4; k++) { const i = (s * 4 + k) % 6; box(.16, .18, .16, toon(bc[i]), nm + '_box', 'paper', ax + face * .06, y - .3 + k * .2, .49 + s * .42, g, false);
          const lb = add(new THREE.PlaneGeometry(.17, .08), lab(128, 64, '#f8f8f2', (c, W, H) => txt(c, L[i], W / 2, H / 2, 17, '#1e2a2a', 'center')), nm + '_box_label', 'paper', V(ax + face * .145, y - .3 + k * .2, .49 + s * .42), g, false); lb.rotation.y = face > 0 ? Math.PI / 2 : -Math.PI / 2; } }
      for (const dy of [-.22, .22]) { box(.015, .42, 1.5, new THREE.MeshLambertMaterial({ color: '#dff4ff', transparent: true, opacity: .22 }), nm + '_glass_door', 'glass', ax + face * .205, y + dy, 1.1, g, false); for (const z of [.34, 1.86]) box(.02, .42, .02, steel, nm + '_door_rail', 'metal', ax + face * .21, y + dy, z, g, false); }
      for (const dy of [-.03, .03]) box(.03, .03, .14, chrome, nm + '_handle', 'metal', ax + face * .22, y + dy, 1.15, g, false); };
    cab(-2.72, -1.8, 1, 'env_cabinet_left'); cab(2.72, 1.75, -1, 'env_cabinet_right');
    // (9) wall life: OXYGEN IN USE sign (blue, never red), wall phone + coiled cord, wall sharps box, thermometer dial, orange hospital-grade outlets, a second film viewer on the left wall
    add(new THREE.PlaneGeometry(.42, .18), lab(256, 110, '#1d3f8a', (c, W, H) => { c.strokeStyle = '#fff'; c.lineWidth = 4; c.strokeRect(5, 5, W - 10, H - 10); txt(c, 'OXYGEN IN USE', W / 2, 38, 30, '#fff', 'center'); txt(c, 'NO SMOKING', W / 2, 78, 26, '#f2d24a', 'center'); }), 'env_oxygen_sign', 'sign', V(-1.25, 2.995, 2.32), scene, false);
    { const RW = 2.715, onR = (geo, mat, nm, y, z) => { const m = add(geo, mat, nm, 'sign', V(RW, y, z), scene, false); m.rotation.y = -Math.PI / 2; return m; };
      box(.06, .16, .24, beigeP, 'env_wall_phone', 'plastic', 2.69, 2.75, 1.45); bar([2.65, 2.69, 1.52], [2.65, 2.69, 1.36], .022, beigeP, 'env_wall_phone_handset', 'plastic');
      const cd = []; for (let k = 0; k <= 18; k++) cd.push([2.63, 2.69 + Math.sin(k * 1.4) * .015, 1.34 - k * .025]); tube(cd, .004, beigeP, 'env_phone_cord');
      box(.1, .14, .2, plas('#f2c230'), 'env_wall_sharps', 'plastic', 2.66, 2.42, 1.4);
      onR(new THREE.CircleGeometry(.08, 24), lab(96, 96, '#f8f8f2', (c) => { c.strokeStyle = '#1e2a2a'; c.lineWidth = 3; c.beginPath(); c.arc(48, 48, 40, 0, 7); c.stroke(); txt(c, '68 F', 48, 54, 22, '#1e3f8a', 'center'); }), 'env_thermo_dial', 2.6, 1.95); }
    for (const x of [-.55, -.05]) box(.08, .02, .12, plas('#f09a2a'), 'env_outlet_hospital', 'plastic', x, 3.015, .42, scene, false);
    { const v2 = add(new THREE.PlaneGeometry(.9, .6), new THREE.MeshBasicMaterial({ map: xrayT, toneMapped: false, color: EVE ? '#6a6a7a' : '#e8f4ff' }), 'env_xray_film_2', 'lamp', V(-2.7, .9, 1.75), scene, false); v2.rotation.y = Math.PI / 2; box(.06, .98, .68, steel, 'env_xray_box_2', 'metal', -2.75, .9, 1.75, scene, false); }
    // (10) cables on the floor: tower power + monitor leads to the wall outlets, a grey power strip, a yellow cable cover; machine + suction leads
    box(.3, .06, .04, greyP, 'env_power_strip', 'plastic', .1, 2.75, .02);
    [[[.3, 2.25, .02], [.2, 2.5, .02], [.12, 2.72, .02]], [[.5, 2.25, .02], [.25, 2.6, .015], [.15, 2.78, .02]], [[.15, 2.75, .02], [.1, 2.95, .1], [.1, 3.0, .38]], [[-1.6, 1.0, .015], [-1.2, 1.9, .015], [-.6, 2.5, .015], [-.95, 2.99, .38]], [[-2.25, .55, .02], [-2.4, 1.6, .015], [-2.6, 2.6, .02], [-2.55, 2.98, .42]], [[.6, 2.3, .015], [1.0, 1.4, .015], [1.3, .9, .015], [1.3, .45, .03]]].forEach((p, i) => tube(p, .007, toon(['#2a2f3a', '#3a3f4a', '#2a2f3a', '#4a4f5a', '#2a2f3a', '#3a3f4a'][i]), 'env_floor_cable', 24));
    box(.6, .1, .015, toon('#f2c230'), 'env_cable_cover', 'rubber', -.3, 2.38, .008, scene, false);
    // (11) ceiling: laminar-flow diffuser over the table (perforated panel + frame), panel seams, a ceiling speaker, a smoke detector
    { const df = add(new THREE.PlaneGeometry(1.6, 1.2), lab(256, 192, '#d8e8e6', (c, W, H) => { c.fillStyle = '#9ab4b0'; for (let y = 6; y < H; y += 10) for (let x = 6; x < W; x += 10) c.fillRect(x, y, 3, 3); }), 'env_laminar_diffuser', 'ceiling', V(-.2, .9, 3.13), scene, false); df.rotation.x = Math.PI / 2;
      box(1.66, 1.26, .03, steel, 'env_laminar_frame', 'metal', -.2, .9, 3.14, scene, false);
      for (let x = -2.6; x <= 2.6; x += .6) box(.012, 8, .01, toon('#1f4a46'), 'env_ceiling_seam', 'ceiling', x, 1, 3.145, scene, false);
      add(new THREE.CylinderGeometry(.1, .1, .02, 20), toon('#d8dcd8'), 'env_ceiling_speaker', 'plastic', V(1.6, 2.4, 3.14)); add(new THREE.CylinderGeometry(.06, .065, .03, 16), toon('#efece4'), 'env_smoke_detector', 'plastic', V(-1.8, -1.4, 3.14)); }
    // (12) SECOND LIGHT COLOUR: cool sea-green bounce off the tiles (low, wide, no shadow) against the warm-white lamp; evening: a dim lilac bounce
    { const b1 = new THREE.PointLight(EVE ? '#9a88c8' : '#7fd8d0', EVE ? .6 : 1.1, 7, 1.2); b1.position.copy(V(-1.6, 2.4, .6)); b1.name = 'env_tile_bounce'; scene.add(b1);
      const b2 = new THREE.PointLight(EVE ? '#8a7ab8' : '#a8e8f0', EVE ? .4 : .8, 6, 1.2); b2.position.copy(V(2.2, -.5, 1.0)); b2.name = 'env_tile_bounce_r'; scene.add(b2); }
  }

  const d3 = i => dotPts[i];
  // ---------- S1 keys: knee_track, power, impact, tiks, scope_view ----------
  const fxU = [], RR = { camera: null };
  for (const pw of pl.power || []) { try { const mod = await import('./power/' + pw.kind + '.mjs'), mk = mod['make' + pw.kind.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join('')];
    const o = mk(THREE, scene, V(...pw.at), { ...(pw.opts || {}), camera: () => RR.camera }); fxU.push(f => o.update((f - pw.f) / 30)); } catch (e) { console.warn('or_room.js power ' + pw.kind, e && e.message); } }
  let impQ = null; if (pl.impact && pl.impact.length) { impQ = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: '#ffffff', blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneMinusDstColorFactor, blendDst: THREE.ZeroFactor, depthTest: false, depthWrite: false, fog: false, toneMapped: false })); impQ.name = 'fx_impact_frame'; impQ.renderOrder = 9999; impQ.frustumCulled = false; impQ.visible = false; scene.add(impQ); }
  const impact = f => { if (!impQ) return; const k = pl.impact.find(([g]) => Math.round(f) === g), cam = RR.camera; impQ.visible = !!(k && cam); if (!impQ.visible) return;
    impQ.material.color.set(k[1] || '#ffffff'); cam.updateMatrixWorld(true); const d = Math.max(.05, (cam.near || .1) * 2), hh = 2 * d * Math.tan((cam.fov || 60) * Math.PI / 360) * 1.3;
    impQ.position.copy(cam.getWorldPosition(new THREE.Vector3())).add(cam.getWorldDirection(new THREE.Vector3()).multiplyScalar(d)); impQ.quaternion.copy(cam.getWorldQuaternion(new THREE.Quaternion())); impQ.scale.set(hh * Math.max(1, cam.aspect || 1) * 1.3, hh, 1); };
  const tikT = canvasTex(THREE, 64, 64, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 7 : 30; c.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r); } c.fill(); });
  const tik = new THREE.Sprite(new THREE.SpriteMaterial({ map: tikT, depthTest: false, transparent: true, fog: false, toneMapped: false })); tik.name = 'fx_tik'; tik.visible = false; tik.renderOrder = 50; scene.add(tik);
  const tiks = f => { const k = (pl.tiks || []).find(([g]) => f >= g && f < g + 4); tik.visible = !!k; if (k) { const p = dotPts[k[1]]; tik.position.copy(V(p[0] + .02, p[1] - .03, p[2] + .03)); const s = .06 * (1 - (f - k[0]) / 5); tik.scale.set(s, s, s); } };
  const trk = f => { if (!V2) return; const K0 = pl.knee_track || [[0, KN.dots, KN.plasters]]; let st = K0[0]; for (const q of K0) if (f >= q[0]) st = q; dots.forEach((m, i) => { m.visible = i < st[1]; }); plas.forEach((m, i) => { m.visible = i < st[2]; }); };
  trk(0);
  if (pl.scope_view && pl.scope_cam) { const C = pl.scope_cam, bagT = canvasTex(THREE, 256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 3; for (let i = 0; i < 26; i++) { c.beginPath(); const x = (i * 53) % w, y = (i * 97) % h; c.moveTo(x, y); c.quadraticCurveTo(x + 30, y + 10, x + 60 - (i % 5) * 9, y + 50); c.stroke(); } c.fillStyle = 'rgba(220,240,255,.10)'; c.fillRect(0, 0, w, h); });
    const fw = V(...C.aim).sub(V(...C.pos)).normalize();
    const film = add(new THREE.PlaneGeometry(.3, .3, 20, 20), new THREE.MeshBasicMaterial({ map: bagT, transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false }), 'scope_bag_crinkle_near', 'glass', V(...C.pos).addScaledVector(fw, .07), scene, false);
    const Pp = film.geometry.attributes.position; for (let i = 0; i < Pp.count; i++) Pp.setZ(i, .008 * Math.sin(Pp.getX(i) * 40) * Math.sin(Pp.getY(i) * 33)); film.lookAt(V(...C.pos)); film.renderOrder = 40;
    const tagT = canvasTex(THREE, 256, 160, (c, w, h) => { c.fillStyle = '#f6d24a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#3a2a10'; c.lineWidth = 6; c.strokeRect(4, 4, w - 8, h - 8); c.fillStyle = '#2a1a08'; c.font = 'bold 40px Arial'; c.textAlign = 'center'; c.fillText('STERILE', w / 2, 52); c.font = 'bold 30px Arial'; c.fillText('SEALED', w / 2, 92); c.font = 'bold 20px Arial'; c.fillText('DO NOT OPEN IF DAMAGED', w / 2, 132); c.beginPath(); c.arc(26, 26, 9, 0, 7); c.fillStyle = '#ffffff'; c.fill(); });
    const tag = add(new THREE.PlaneGeometry(.064, .04), new THREE.MeshBasicMaterial({ map: tagT, fog: false, side: THREE.DoubleSide }), 'scope_seal_tag_near', 'paper', V(...C.pos).addScaledVector(fw, .14), scene, false);
    tag.lookAt(V(...C.pos)); tag.translateX(C.tag_dx ?? .032); tag.translateY(C.tag_dy ?? -.05); tag.rotateZ(.22); tag.renderOrder = 41; 
    if (C.fade) { const P0 = V(...C.pos), [n0, n1] = C.fade === true ? [.05, .32] : C.fade; fxU.push(() => { const cam = RR.camera; if (!cam) return; const d = cam.position.distanceTo(P0); { const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(cam.quaternion); film.position.copy(cam.position).addScaledVector(dir, .07); film.quaternion.copy(cam.quaternion); } const k = Math.max(0, Math.min(1, (n1 - d) / (n1 - n0))), o = k * k * (3 - 2 * k);
      film.material.opacity = o; film.visible = o > .01; tag.material.transparent = true; tag.material.opacity = o; tag.visible = o > .01; }); } }   // build-out scope_cam.fade: the bag film rides .07 in front of the lens and fades in with the tag as the lens slides into the bag (no one-frame pop)
  // ---------- S1 round 2 key hand3d: the surgeon's WORKING near arm drawn by the set in 3D (soft arm, one slight curve, round black fist) so the fist and the
  // tool are ON the knee in front of it (a fist drawn on his card sits behind the knee and is hidden). The card's own near arm is tucked behind his body by sg_s1.
  // hand3d: { shoulder: [x,y,z] plan (the card's shoulder line), dx: m along the lens' right (near shoulder side), keys: [[f, anchor|[x,y,z], lift, prop], ...] }
  // prop: 'scalpel' | 'bulb' | 'plaster' | null; lift: metres off the target along (up + .4 n); positions eased (smoothstep) key to key.
  const H3 = pl.hand3d, h3u = [], h3x = {};
  if (H3 && H3.keys && H3.keys.length) { const { softArm } = await import('./soft_arm.js'), OP = await import('./or_props.js'), HP = await import('./hero_props.js');
    const AR = softArm(THREE, { width: H3.width ?? .016, sag: .14, fist: true, fistR: H3.r ?? .036, name: 'surgeon_near_arm_3d' }); scene.add(AR.group);
    AR.group.traverse(o => { if (o.isMesh) { o.userData.role = 'skin'; o.castShadow = true; } });
    const props = { scalpel: OP.buildScalpel(THREE, { toon }), bulb: OP.buildBulb(THREE, { toon }), plaster: HP.buildPlaster(THREE, ctx, {}) };
    const PS = H3.prop_scale || { scalpel: 1.0, bulb: 1.1, plaster: 1.2 };
    h3x.bulb = props.bulb; if (pl.splash_big) props.bulb.group.traverse(o => { if (/^(water_stream|water_drop|drop_glint)$/.test(o.name)) o.visible = false; });   // S1 v2 splash_big: the static fan is replaced by the animated splash
    for (const [k, o] of Object.entries(props)) { o.holder = new THREE.Group(); o.holder.name = 'held3d_set_' + k; o.holder.add(o.group); o.group.position.copy(o.grip.clone().negate()); o.holder.scale.setScalar(PS[k] || 1); o.holder.visible = false; scene.add(o.holder); }
    const pinky = add(new THREE.CapsuleGeometry(.008, .03, 4, 8), new THREE.MeshBasicMaterial({ color: '#231c22' }), 'fist_pinky_out', 'skin', null, scene, false); pinky.visible = false;
    const nN = KF ? V(KF.n.x, KF.n.y, KF.n.z).sub(V(0, 0, 0)).normalize() : new THREE.Vector3(0, 1, 0), upT = new THREE.Vector3(0, 1, 0), liftD = upT.clone().addScaledVector(nN, .4).normalize();
    const tgt = k => { const a = typeof k[1] === 'string' ? (k[1] === 'knee_top' ? kneeTop : k[1].startsWith('knee_dot_') || k[1].startsWith('knee_plaster_') ? dotPts[(+k[1].slice(-1)) - 1] : K) : k[1]; return V(...a).addScaledVector(liftD, k[2] || 0); };
    const ss = x => x * x * (3 - 2 * x);
    h3u.push(f => { const K3 = H3.keys; let i = 0; while (i + 1 < K3.length && K3[i + 1][0] <= f) i++; const k0 = K3[i], k1 = K3[Math.min(i + 1, K3.length - 1)];
      const u = k1[0] > k0[0] ? ss(Math.max(0, Math.min(1, (f - k0[0]) / (k1[0] - k0[0])))) : 0, P = tgt(k0).lerp(tgt(k1), f < k0[0] ? 0 : u), prop = f < K3[0][0] ? null : k0[3] || null;
      const cam = RR.camera; let SH = V(...H3.shoulder); if (cam) { cam.updateMatrixWorld(true); const rt = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.getWorldQuaternion(new THREE.Quaternion())); rt.y = 0; rt.normalize(); SH.addScaledVector(rt, H3.dx ?? -.2); }
      const toSh = SH.clone().sub(P).normalize(); let fistP = P.clone();
      for (const [k, o] of Object.entries(props)) o.holder.visible = k === prop;
      if (prop) { const o = props[prop], L = o.tip.clone().sub(o.grip).length() * (PS[prop] || 1), dir = toSh.clone().multiplyScalar(.75).add(upT.clone().multiplyScalar(.32)).addScaledVector(nN, .22).normalize(); fistP = P.clone().addScaledVector(dir, L);
        o.holder.position.copy(fistP); o.holder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().negate()); }
      else fistP = P.clone().addScaledVector(liftD, (H3.r ?? .036) * .95);
      const side = new THREE.Vector3(0, -1, 0); AR.update(SH, fistP, side); AR.group.traverse(o => { if (o.isMesh && o.geometry) { o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere(); } });
      pinky.visible = prop === 'bulb'; if (pinky.visible) { const cam2 = RR.camera, rt = cam2 ? new THREE.Vector3(1, 0, 0).applyQuaternion(cam2.getWorldQuaternion(new THREE.Quaternion())) : new THREE.Vector3(1, 0, 0); pinky.position.copy(fistP).addScaledVector(rt, -.04).addScaledVector(upT, -.012); pinky.quaternion.setFromUnitVectors(upT, rt.clone().negate().addScaledVector(upT, -.3).normalize()); }
    }); }
  // ---------- S1 v2 keys (2026-11-16, CB's notes on final v1). Additive: a film without them is unchanged. ----------
  // ko_face: true    registers the meme face 'koZ' (memes.mjs 'ko' = spiral + X eyes, tongue flop, birdies; WITHOUT the head bump, which read as an injury)
  //                  plus a white zZ bubble above the head. Use it as an act face: face='koZ' (S1 rows 1-10, S3 rows 27-30, S5 rows 40-41).
  if (pl.ko_face) { try { const mm = await import('/puppets/memes.mjs'), MM = mm.MEMES, INK = '#231c22';
      const Z = (x, y, k) => { const d = `M${x - 9 * k},${y - 9 * k} L${x + 9 * k},${y - 9 * k} L${x - 9 * k},${y + 9 * k} L${x + 9 * k},${y + 9 * k}`; return `<path d="${d}" fill="none" stroke="#ffffff" stroke-width="${9 * k}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#2a62c8" stroke-width="${4.2 * k}" stroke-linejoin="round" stroke-linecap="round"/>`; };
      const bub = (cx, hy) => { const bx = cx + 92, by = hy - 92; return `<ellipse cx="${cx + 52}" cy="${hy - 52}" rx="6" ry="5" fill="#fff" stroke="${INK}" stroke-width="3"/><ellipse cx="${cx + 66}" cy="${hy - 68}" rx="9" ry="8" fill="#fff" stroke="${INK}" stroke-width="3"/>` +
        `<ellipse cx="${bx}" cy="${by}" rx="38" ry="30" fill="#fff" stroke="${INK}" stroke-width="4"/>` + Z(bx - 12, by + 6, 1.15) + Z(bx + 16, by - 9, .75); };
      if (MM && MM.ko && !MM.koZ) MM.koZ = (cx, hy) => { const m = MM.ko(cx, hy), over = (m.over || []).filter(x => !String(x).includes('url(#sk)')); over.push(bub(cx, hy)); return { ...m, over, rot: 12 }; };
    } catch (e) { console.warn('or_room.js ko_face: ' + (e && e.message)); } }
  // scope_tray: { at: [dx, dy] on the Mayo tray (default [-.04, 0]) }   ROW 6 (CB: no crinkle streaks): the arthroscope coiled in its SEALED clear sterile bag lies
  //   on the clean Mayo tray: a clear bag with a hard white seal edge and one fold, the black coiled cable + steel scope inside, a big yellow STERILE / SEALED tag. Reads at a glance.
  if (pl.scope_tray) { const ST = pl.scope_tray === true ? {} : pl.scope_tray, MYp = pl.tray_at || [-.98, -.75, .95], ofs = ST.at || [-.04, 0], bx = MYp[0] + ofs[0], by = MYp[1] + ofs[1], bz = MYp[2] + .062, sg = new THREE.Group(); sg.name = 'scope_sealed_on_tray'; scene.add(sg);
    for (let i = 0; i < 3; i++) { const r = add(new THREE.TorusGeometry(.085 - i * .016, .009, 8, 28), toon('#2c3038'), 'tray_scope_cable', 'rubber', V(bx - .05, by + .01, bz + .004 + i * .004), sg); r.rotation.x = Math.PI / 2; }
    bar([bx - .02, by - .07, bz + .012], [bx + .19, by - .055, bz + .012], .009, chrome, 'tray_scope_shaft', 'metal', sg, 12); add(new THREE.CylinderGeometry(.022, .022, .06, 14), toon('#3b4250'), 'tray_scope_camera_head', 'plastic', V(bx - .04, by - .072, bz + .014), sg).rotation.z = Math.PI / 2;
    const bagM = new THREE.MeshLambertMaterial({ color: '#e8f6ff', transparent: true, opacity: .32, depthWrite: false }); const bag = add(new THREE.BoxGeometry(.4, .03, .24), bagM, 'tray_sterile_bag', 'plastic', V(bx + .02, by - .02, bz + .012), sg, false); bag.renderOrder = 5;
    const edgeM = toon('#ffffff'); for (const s2 of [-1, 1]) { box(.4, .016, .006, edgeM, 'tray_bag_seal_edge', 'plastic', bx + .02, by - .02 + s2 * .12, bz + .03, sg, false); box(.016, .24, .006, edgeM, 'tray_bag_seal_edge', 'plastic', bx + .02 + s2 * .2, by - .02, bz + .03, sg, false); }
    const fold = box(.3, .006, .004, toon('#b8d4e6'), 'tray_bag_fold', 'plastic', bx + .04, by, bz + .03, sg, false); fold.rotation.y = .5;
    const tagT = canvasTex(THREE, 256, 160, (c, w, h) => { c.fillStyle = '#f6d24a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#3a2a10'; c.lineWidth = 8; c.strokeRect(5, 5, w - 10, h - 10); c.fillStyle = '#2a1a08'; c.textAlign = 'center'; c.font = 'bold 54px Arial'; c.fillText('STERILE', w / 2, 66); c.font = 'bold 40px Arial'; c.fillText('SEALED', w / 2, 116); c.fillStyle = '#c03a2a'; c.fillRect(20, 128, w - 40, 12); });
    const tag = add(new THREE.PlaneGeometry(.13, .081), new THREE.MeshLambertMaterial({ map: tagT }), 'tray_bag_seal_tag', 'paper', V(bx + .16, by - .1, bz + .036), sg, false); tag.rotation.x = -Math.PI / 2 + .35; tag.rotation.z = -.25; }
  // splash_big: { at: anchor|xyz (default knee_dot_2), bursts: [f, ...], n, drops, size, color }   ROW 4 (CB: "the splash water looks weak"): every squeeze of the bulb
  //   shoots a fat blue stream from the nozzle to the knee and throws a BIG opaque blue splash crown (inked, white highlights) off the drape; fat drops arc out and
  //   land as wet dark-blue splats on the drape (raycast at build, so they sit ON the cloth) and stay. Sized like a gag (crown ~0.2 m on a 0.18 m kneecap).
  if (pl.splash_big) { const SB = pl.splash_big === true ? {} : pl.splash_big, at = SB.at || 'knee_dot_2', HP0 = typeof at === 'string' ? (at.startsWith('knee_dot_') ? dotPts[(+at.slice(-1)) - 1] : at === 'knee_top' ? kneeTop : K) : at;
    const HIT = V(...HP0), SZ = SB.size ?? 1, waterM = new THREE.MeshBasicMaterial({ color: SB.color || '#2e8ff0' }), hiM = new THREE.MeshBasicMaterial({ color: '#bfe8ff' }), inkM = new THREE.MeshBasicMaterial({ color: '#16304e', side: THREE.BackSide }), wetM = new THREE.MeshBasicMaterial({ color: '#1f4f9a', transparent: true, opacity: .85, depthWrite: false });
    const UP = new THREE.Vector3(0, 1, 0), g0 = -2.6, sgp = new THREE.Group(); sgp.name = 'fx_splash_big'; scene.add(sgp);
    const blob = (r, name) => { const o = new THREE.Group(); o.name = name; const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), waterM), e = new THREE.Mesh(new THREE.SphereGeometry(r * 1.2, 14, 10), inkM), h = new THREE.Mesh(new THREE.SphereGeometry(r * .32, 8, 6), hiM);
      h.position.set(-r * .35, r * .45, r * .55); o.add(e, m, h); o.visible = false; o.userData.role = 'water'; sgp.add(o); return o; };
    scene.updateMatrixWorld(true); const rc = new THREE.Raycaster(), hitTargets = []; scene.traverse(o => { if (o.isMesh && o.visible && !/^fx_|splash|water|held3d|soft_arm/.test(o.name) && ['cloth', 'skin', 'paper'].includes(o.userData.role)) hitTargets.push(o); });
    const land = (x, z) => { rc.set(new THREE.Vector3(x, HIT.y + .6, z), new THREE.Vector3(0, -1, 0)); const h = rc.intersectObjects(hitTargets, false)[0]; return h && h.point.y > HIT.y - .45 ? { p: h.point, n: h.face ? h.face.normal.clone().transformDirection(h.object.matrixWorld) : UP.clone() } : null; };
    let sd = 11; const rnd = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
    const bursts = (SB.bursts || [89, 103]).map((f0, bi) => { const crown = [], drops = [];
      for (let i = 0; i < (SB.n ?? 14); i++) { const a = i / (SB.n ?? 14) * Math.PI * 2 + bi * .2, sp = (.55 + .25 * rnd()) * SZ; crown.push({ o: blob((.016 + .008 * rnd()) * SZ, 'fx_splash_crown'), v: new THREE.Vector3(Math.cos(a) * sp, (1.05 + .35 * rnd()) * SZ, Math.sin(a) * sp) }); }
      for (let i = 0; i < (SB.drops ?? 10); i++) { const a = rnd() * Math.PI * 2, r = (.14 + .16 * rnd()) * SZ, T = (13 + 6 * rnd()) / 30, L = land(HIT.x + Math.cos(a) * r, HIT.z + Math.sin(a) * r); if (!L) continue;
        const P1 = L.p.clone().addScaledVector(L.n, .006), v = P1.clone().sub(HIT).sub(new THREE.Vector3(0, .5 * g0 * T * T, 0)).divideScalar(T);
        const spl = add(new THREE.CircleGeometry((.02 + .014 * rnd()) * SZ, 14), wetM, 'fx_splash_wet', 'water', P1, sgp, false); spl.lookAt(P1.clone().add(L.n)); spl.visible = false; spl.renderOrder = 6;
        drops.push({ o: blob((.02 + .012 * rnd()) * SZ, 'fx_splash_drop'), v, T, spl, d: 1 + Math.floor(rnd() * 3) }); }
      const stream = new THREE.Mesh(new THREE.CylinderGeometry(.012 * SZ, .02 * SZ, 1, 10), waterM); stream.name = 'fx_splash_stream'; stream.visible = false; sgp.add(stream);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.06 * SZ, .016 * SZ, 8, 28), waterM); ring.name = 'fx_splash_ring'; ring.rotation.x = Math.PI / 2; ring.position.copy(HIT); ring.visible = false; sgp.add(ring);
      return { f0, crown, drops, stream, ring }; });
    const tipW = new THREE.Vector3();
    fxU.push(f => { for (const B of bursts) { const t = (f - B.f0) / 30;
      const sOn = h3x.bulb && h3x.bulb.holder.visible && f >= B.f0 - 2 && f < B.f0 + 6; B.stream.visible = !!sOn;
      if (sOn) { const o = h3x.bulb; o.holder.updateMatrixWorld(true); tipW.copy(o.tip).sub(o.grip); o.holder.localToWorld(tipW); const d = HIT.clone().sub(tipW), L = Math.max(.01, d.length()); B.stream.position.copy(tipW).addScaledVector(d, .5); B.stream.scale.set(1, L, 1); B.stream.quaternion.setFromUnitVectors(UP, d.clone().normalize().negate()); }
      const rk = t >= 0 && t < .3; B.ring.visible = rk; if (rk) { const k = 1 + t * 9; B.ring.scale.set(k, k, 1 - t * 2.5); }
      for (const c of B.crown) { const life = .42, on = t >= 0 && t < life; c.o.visible = on; if (!on) continue; c.o.position.copy(HIT).addScaledVector(c.v, t).add(new THREE.Vector3(0, .5 * g0 * t * t, 0)); const vv = c.v.clone().add(new THREE.Vector3(0, g0 * t, 0)); c.o.quaternion.setFromUnitVectors(UP, vv.clone().normalize()); const sc = t < .06 ? t / .06 : 1 - Math.max(0, (t - .28) / (life - .28)) * .8; c.o.scale.set(sc * .85, sc * 1.6, sc * .85); }
      for (const D of B.drops) { const td = t - D.d / 30, fly = td >= 0 && td < D.T; D.o.visible = fly; D.spl.visible = td >= D.T; if (D.spl.visible) { const k = Math.min(1, (td - D.T) * 12 + .4); D.spl.scale.set(k * 1.25, k, 1); }
        if (fly) { D.o.position.copy(HIT).addScaledVector(D.v, td).add(new THREE.Vector3(0, .5 * g0 * td * td, 0)); const vv = D.v.clone().add(new THREE.Vector3(0, g0 * td, 0)); D.o.quaternion.setFromUnitVectors(UP, vv.clone().normalize()); D.o.scale.set(.9, 1.45, .9); } } } }); }
  // ---------- S1 v3: shared water + Zs ----------
  if (pl.ko_clean) { try { await registerKoClean('koClean'); } catch (e) { console.warn('or_room.js ko_clean: ' + (e && e.message)); } }
  if (pl.water_v3) { const WV = pl.water_v3 === true ? {} : pl.water_v3; hideStaticBulbWater(scene);
    const atW = typeof WV.at === 'string' ? (WV.at.startsWith('knee_dot_') ? dotPts[(+WV.at.slice(-1)) - 1] : kneeTop) : (WV.at || dotPts[1]);
    const tipW3 = new THREE.Vector3(); const from = () => { const o = h3x.bulb; if (!o || !o.holder) return null; o.holder.updateMatrixWorld(true); tipW3.copy(o.tip).sub(o.grip); o.holder.localToWorld(tipW3); return tipW3.clone(); };
    const W = addWater(THREE, scene, 'bulb_splash', { at: atW, f0: WV.f0 ?? 85, f1: WV.f1 ?? 115, bursts: WV.bursts || [89, 103], size: WV.size ?? 2.6, drops: WV.drops ?? 22, from: h3x.bulb ? from : undefined });
    fxU.push(f => W.update(f, RR.camera)); }
  if (pl.zzz_v3) { const ZV = pl.zzz_v3, HD = V(...(ZV.head || [-0.92, 0.78, 2.02])), tl = ZV.toLens ?? .6, hp = new THREE.Vector3();
    const head = () => { hp.copy(HD); const cam = RR.camera; if (cam) { const d = cam.position.clone().sub(HD), L = d.length(); hp.addScaledVector(d.normalize(), Math.min(tl, L * .4)); } return hp; };
    const Z = addZzz(THREE, scene, { head, f0: ZV.f0 ?? -30, f1: ZV.f1 ?? 400, lift: ZV.lift ?? .06, rise: ZV.rise ?? .32, size: ZV.size ?? .2, side: ZV.side ?? 1 });
    fxU.push(f => Z.update(f, RR.camera)); }
  return { update: (f, t, R) => { if (R && R.camera) RR.camera = R.camera; LP.sync(M); const tt = t ?? f / 30; for (const fn of ticks) fn(tt); for (const u of fxU) u(f); impact(f); tiks(f); trk(f); for (const u of h3u) u(f); },
    anchors: { knee: K, knee_r: [kneeR, kneeR * 1.05, kneeR], knee_plaster_1: dotPts[0], knee_plaster_2: dotPts[1], knee_plaster_3: dotPts[2], knee_top: kneeTop, knee_dot_1: d3(0), knee_dot_2: d3(1), knee_dot_3: d3(2), knee_cut_a: d3(0),
      patient_hip: [hip[0], T.y, T.z + .05], patient_head: [headEnd[0] + .1, T.y, headEnd[2] + .16], patient_card: [XH, T.y - .05, T.z], lamp: LMP, lamp_at: LAT,
      porthole_L: [1.43, 2.96, 1.6], porthole_R: [2.27, 2.96, 1.6], bowl: [MY[0] - .05, MY[1] + .1, onT + .06], tray: MY } };
}

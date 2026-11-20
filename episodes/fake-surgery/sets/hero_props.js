// HERO + HELD PROPS of "The Surgery Where the Surgeon Did Nothing" (props-hero phase A, 2026-11-16). README: sets/PROPS_README.md. Import, never rebuild.
// Every builder: buildX(THREE, ctx, opts) or buildX(THREE, opts) (the kit's held3d form calls (THREE, { inHand, toon, ...opts })) ->
//   { group, parts, tris, grip, tip, anchors: { name: Vector3 (group-local) }, ...setters }.
// GROUPS are three.js LOCAL metres, Y up, the readable face toward +Z (the lens), real size (the held3d kit needs +Y = the long axis).
// PLACING in the set (plan metres, Z up): place(THREE, scene, ctx, o, [x, y, z], yawDeg) -> o.plan = { anchor: [x, y, z] plan } for film.json tip_at / camera.
// THE KNEE overlay works straight in plan metres on the OR knee: placeKneeMarks(THREE, scene, ctx, { knee: KNEE, ... }).
// THE ONE RED (#e01e2a) = PAIN: only buildPainDial's red zone and buildLightBox's three bars. Nothing else here is red (stamp ink BLACK, bulb GREY-BLUE).
// SURFACES: kit3d pbr metals (ctx.pbr.metal), ctx.relief('wood') and plain textures. LOOK PACK HOOK: pass ctx.lookPack = LP.pack(THREE, ctx) (sets/look_pack.js)
//   and plastics come from its plasticOf(colour); an object with .material(kind, colour) takes 'paper' | 'wood' | 'plastic' | 'rubber' | 'cloth' (mat() in kit()).
// Sizes are cartoon-readable where the plan says so (knee dots 34 mm, plasters 46 x 98 mm = the phone rule of PICTURE_PLAN "The knee must read").

export const PAIN_RED = '#e01e2a';
export const KNEE_OR = [0.36, 0.44, 1.3];                 // = or_room.js KNEE (plan); radii of its knee ellipsoid in plan x, y, z
export const KNEE_OR_RADII = [0.13, 0.1235, 0.1365];
export const COL = { iodine: '#c0702a', dot: '#4a2a18', plaster: '#f2e6c8', pad: '#c9a56a', outline: '#3a2a1e', scuff: '#b07a6a', bulb: '#6a86a0',
  steel: '#c9d0dc', beige: '#d8ccb0', manila: '#e8d4a0', trayBlue: '#4a78b0', trayAqua: '#2aa8a8', trayPurple: '#7a4aa8', ink: '#1b1b22', skin: '#f6e6d6', childSkin: '#f8e8d8' };
const HAND = '"Segoe Print", "Bradley Hand ITC", "Comic Sans MS", cursive', SANS = 'Arial, Helvetica, sans-serif';
const TEX = new Map();
function kit(THREE, ctx = {}) {
  const toonF = typeof ctx.toon === 'function' ? ctx.toon : (c, o = {}) => new THREE.MeshLambertMaterial({ color: c, ...o });
  const pb = ctx.pbr && typeof ctx.pbr.metal === 'function' ? ctx.pbr : null, LP = ctx.lookPack && typeof ctx.lookPack.material === 'function' ? ctx.lookPack : null;
  const metal = (kind, color, rough = .28, env = 1.15) => pb ? pb.metal(kind, { color, rough, env, toon: color }) : new THREE.MeshStandardMaterial({ color, metalness: .85, roughness: rough });
  const LPM = ctx.lookPack && !LP && typeof ctx.lookPack.plasticOf === 'function' ? ctx.lookPack : null;   // sets/look_pack.js pack(THREE, ctx) result: plastics come from it
  const mat = (kind, color, o = {}) => (LP && LP.material(kind, color, o)) || (LPM && kind === 'plastic' && LPM.plasticOf(color)) || (kind === 'wood' && ctx.relief ? ctx.relief('wood', color, { size: o.size || .25 }) : toonF(color));   // LOOK PACK HOOK
  const tex = (key, w, h, draw) => { if (TEX.has(key)) return TEX.get(key); const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData = { canvas: c }; TEX.set(key, t); return t; };
  const paper = (t, o = {}) => new THREE.MeshStandardMaterial({ map: t, roughness: .9, metalness: 0, ...o });
  const glow = (t, o = {}) => new THREE.MeshBasicMaterial({ map: t, toneMapped: false, ...o });
  const parts = [];
  const add = (par, geo, m, name, role = 'metal', pos, rot, shadow = true) => { const o = new THREE.Mesh(geo, m); o.name = name; o.userData.role = role; o.castShadow = shadow; o.receiveShadow = true;
    if (pos) o.position.set(pos[0], pos[1], pos[2]); if (rot) o.rotation.set(rot[0], rot[1], rot[2]); par.add(o); parts.push(o); return o; };
  const box = (par, s, m, name, role, pos, rot, shadow) => add(par, new THREE.BoxGeometry(s[0], s[1], s[2]), m, name, role, pos, rot, shadow);
  const bar = (par, a, b, r, m, name, role = 'metal', segs = 8, r2) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = Math.max(d.length(), 1e-4);
    const o = add(par, new THREE.CylinderGeometry(r2 ?? r, r, L, segs), m, name, role); o.position.copy(A).addScaledVector(d, .5); o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return o; };
  const tube = (par, pts, r, m, name, role = 'rubber', segs = 40, rs = 6) => add(par, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p))), segs, r, rs), m, name, role);
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * rnd();
  const basic = (c, o = {}) => new THREE.MeshBasicMaterial({ color: c, ...o });
  const screw = (par, p, rot, r = .004, m) => { const s = add(par, new THREE.CylinderGeometry(r, r, r * .6, 10), m || metal('steel', '#b8c0cc', .3), 'screw_head', 'metal', p, rot);
    box(s, [r * 1.7, r * .25, r * .7], basic('#4a505a'), 'screw_slot', 'metal', [0, r * .32, 0]); return s; };
  return { toon: toonF, metal, mat, tex, paper, glow, parts, add, box, bar, tube, rr, rnd, basic, screw, reseed: s => { seed = s; } };
}
const args = (a, b) => b === undefined ? [a || {}, a || {}] : [a || {}, b || {}];
const tris = g => { let n = 0; g.traverse(m => { if (m.isMesh && m.geometry) { const i = m.geometry.index; n += (i ? i.count : m.geometry.attributes.position.count) / 3; } }); return Math.round(n); };
const V3 = (THREE, p) => new THREE.Vector3(p[0], p[1], p[2]);
const done = (THREE, g, K, o) => { const an = {}; for (const [k, v] of Object.entries(o.anchors || {})) an[k] = v.isVector3 ? v : V3(THREE, v); const r = { group: g, parts: K.parts, tris: tris(g), ...o, anchors: an };
  for (const [k, v] of Object.entries(an)) if (!(k in r)) r[k] = v; if (o.grip && !o.grip.isVector3) r.grip = V3(THREE, o.grip); if (o.tip && !o.tip.isVector3) r.tip = V3(THREE, o.tip); return r; };
const txt = (c, s, x, y, font, col = COL.ink, align = 'center') => { c.fillStyle = col; c.font = font; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); };

// PLACE a built prop at a plan point (Z up) with a yaw; fills o.plan with every anchor in plan metres (for tip_at, cameras, the set's returned anchors).
export function place(THREE, scene, ctx, o, p, yawDeg = 0, extraRot) {
  o.group.position.copy(ctx.B2T(p)); o.group.rotation.y = yawDeg * Math.PI / 180; if (extraRot) { o.group.rotation.x = extraRot[0] || 0; o.group.rotation.z = extraRot[2] || 0; }
  scene.add(o.group); o.group.updateMatrixWorld(true); o.plan = {};
  const T2B = v => [v.x, -v.z, v.y];
  for (const [k, v] of Object.entries(o.anchors || {})) o.plan[k] = T2B(o.group.localToWorld(v.clone()));
  if (o.grip) o.plan.grip = T2B(o.group.localToWorld(o.grip.clone())); if (o.tip) o.plan.tip = T2B(o.group.localToWorld(o.tip.clone()));
  return o;
}

// ================================================================ THE KNEE MARKS (overlay on any knee ellipsoid)
// Decals are planes in the tangent space of the knee, every vertex projected onto the ellipsoid (+ a lift), so they sit ON the curve.
const PLASTER_TEX = (K, faded) => K.tex(faded ? 'plaster_faded' : 'plaster', 128, 272, (c, w, h) => {
  const rrect = (x, y, ww, hh, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + ww, y, x + ww, y + hh, r); c.arcTo(x + ww, y + hh, x, y + hh, r); c.arcTo(x, y + hh, x, y, r); c.arcTo(x, y, x + ww, y, r); c.closePath(); };
  c.clearRect(0, 0, w, h);
  if (faded) { c.fillStyle = 'rgba(255,250,238,.85)'; rrect(8, 50, w - 16, h - 100, 16); c.fill(); c.strokeStyle = 'rgba(200,170,140,.55)'; c.lineWidth = 3; c.stroke(); return; }   // pale square where it was
  c.fillStyle = COL.outline; rrect(2, 2, w - 4, h - 4, 40); c.fill(); c.fillStyle = COL.plaster; rrect(9, 9, w - 18, h - 18, 34); c.fill();
  c.fillStyle = 'rgba(150,120,80,.35)'; for (let y = 24; y < h - 20; y += 16) for (let x = 22; x < w - 18; x += 16) if (y < 86 || y > 186) { c.beginPath(); c.arc(x, y, 2.2, 0, 7); c.fill(); }   // vent holes
  c.fillStyle = '#7a5a34'; c.fillRect(17, 90, w - 34, 92); c.fillStyle = COL.pad; c.fillRect(22, 95, w - 44, 82);                       // tan pad with a dark edge
  c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 4; c.beginPath(); c.moveTo(26, 100); c.lineTo(26, 170); c.stroke(); });
const IODINE_TEX = K => K.tex('iodine', 256, 256, (c, w, h) => {
  c.clearRect(0, 0, w, h); const R0 = K.rnd; c.fillStyle = COL.iodine; c.beginPath();
  for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2, r = 118 - 10 * Math.abs(Math.sin(a * 3.3)) - 6 * R0(); const x = w / 2 + Math.cos(a) * r, y = h / 2 + Math.sin(a) * r; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.fill();
  c.strokeStyle = 'rgba(120,60,20,.35)'; c.lineWidth = 6; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(w / 2 + 8, h / 2 - 4, 28 + i * 15, R0() * 3, 3 + R0() * 3); c.stroke(); }   // the swab circles
  c.fillStyle = 'rgba(232,170,96,.35)'; c.beginPath(); c.ellipse(w * .42, h * .36, 40, 22, -.5, 0, 7); c.fill(); });       // dull sheen (never a glow)
const DOT_TEX = K => K.tex('kneedot', 64, 64, (c, w, h) => { c.clearRect(0, 0, w, h); c.fillStyle = COL.dot; c.beginPath(); c.arc(32, 32, 29, 0, 7); c.fill(); c.fillStyle = 'rgba(255,220,180,.18)'; c.beginPath(); c.arc(24, 24, 8, 0, 7); c.fill(); });
const SCUFF_TEX = K => K.tex('scuff', 128, 128, (c, w, h) => { c.clearRect(0, 0, w, h); c.fillStyle = 'rgba(176,122,106,.95)'; c.beginPath(); c.ellipse(64, 64, 52, 30, -.3, 0, 7); c.fill();
  c.strokeStyle = 'rgba(140,90,78,.9)'; c.lineWidth = 3; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(24 + i * 9, 50 + (i % 3) * 6); c.lineTo(40 + i * 9, 80 - (i % 2) * 8); c.stroke(); } });

function kneeFrame(THREE, C, R, n, t) {   // C centre, R radii, n outward normal of the mark row, t row axis: all in the knee's own coords (array)
  const N = new THREE.Vector3(...n).normalize(), T0 = new THREE.Vector3(...t); T0.addScaledVector(N, -T0.dot(N)).normalize(); const U = new THREE.Vector3().crossVectors(N, T0).normalize();
  const proj = (q, lift) => { const s = 1 / Math.sqrt((q.x / R[0]) ** 2 + (q.y / R[1]) ** 2 + (q.z / R[2]) ** 2); const d = q.clone().normalize(); return new THREE.Vector3(C[0], C[1], C[2]).addScaledVector(q, s).addScaledVector(d, lift); };
  const dirAt = a => N.clone().multiplyScalar(Math.cos(a)).addScaledVector(T0, Math.sin(a));   // a = angle along the row
  return { N, T0, U, proj, dirAt };
}
function decal(THREE, K, par, F, a, w, h, m, name, lift, map, spin = 0) {   // a: angle along the row; map: (Vector3 knee-coords) -> Vector3 three
  const d = F.dirAt(a), t = F.T0.clone().multiplyScalar(Math.cos(a)).addScaledVector(F.N, -Math.sin(a)), u = F.U, cs = Math.cos(spin), sn = Math.sin(spin);
  const rd = F.proj(d.clone(), 0).length(), g = new THREE.PlaneGeometry(w, h, 6, 10), P = g.attributes.position, base = d.clone().multiplyScalar(rd);   // tangent plane at the surface point; projection lays it on the shell
  for (let i = 0; i < P.count; i++) { const x = P.getX(i), y = P.getY(i), xx = x * cs - y * sn, yy = x * sn + y * cs;
    const q = base.clone().addScaledVector(t, xx).addScaledVector(u, yy); const s = F.proj(q, lift), w3 = map(s); P.setXYZ(i, w3.x, w3.y, w3.z); }
  g.computeVertexNormals(); const o = K.add(par, g, m, name, 'mark', null, null, false); o.renderOrder = 2; return { mesh: o, at: map(F.proj(d.clone(), lift)) };
}
// marks: { iodine true, dots 0-3, plasters 0-3, faded false (pale squares, no dots), spacing .06 m (along the row), dotD .034, plaster [.046, .098], scuff false, kidPlaster false }
function kneeMarks(THREE, K, par, F, map, o) {
  const out = { dots: [], plasters: [], faded: [], anchors: {} }, sp = o.spacing ?? .062, r = o.rowR ?? .13, ang = i => (i - 1) * sp / r, pl = o.plaster || [.046, .098], dD = o.dotD ?? .034;
  const LM = o.unlit ? THREE.MeshBasicMaterial : THREE.MeshLambertMaterial;
  const mI = new LM({ map: IODINE_TEX(K), transparent: true, alphaTest: .05, polygonOffset: true, polygonOffsetFactor: -1, depthWrite: false });
  if (o.iodine !== false && !o.child) out.iodine = decal(THREE, K, par, F, 0, o.iodineD ?? .25, (o.iodineD ?? .25) * .92, mI, 'knee_iodine_patch', .002, map).mesh;
  const mD = new LM({ map: DOT_TEX(K), transparent: true, alphaTest: .3, polygonOffset: true, polygonOffsetFactor: -2 });
  const mP = new LM({ map: PLASTER_TEX(K, false), transparent: true, alphaTest: .3, polygonOffset: true, polygonOffsetFactor: -3 });
  const mF = new LM({ map: PLASTER_TEX(K, true), transparent: true, alphaTest: .05, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const n = o.child ? 1 : 3;
  for (let i = 0; i < n; i++) { const a = o.child ? 0 : ang(i);
    if (!o.child) { const d = decal(THREE, K, par, F, a, dD, dD, mD, 'knee_dot_' + (i + 1), .0035, map); out.dots.push(d.mesh); out.anchors['dot_' + (i + 1)] = d.at; }
    const p = decal(THREE, K, par, F, a, pl[0], pl[1], mP, 'knee_plaster_' + (i + 1), .006, map, o.child ? .5 : (i - 1) * .06); out.plasters.push(p.mesh); out.anchors['plaster_' + (i + 1)] = p.at;
    if (!o.child) out.faded.push(decal(THREE, K, par, F, a, pl[0], pl[1] * .85, mF, 'knee_faded_square_' + (i + 1), .003, map).mesh); }
  if (o.child) { const s = decal(THREE, K, par, F, -.05, .07, .045, new THREE.MeshLambertMaterial({ map: SCUFF_TEX(K), transparent: true, alphaTest: .05, polygonOffset: true, polygonOffsetFactor: -1, depthWrite: false }), 'child_knee_scuff', .002, map); out.scuff = s.mesh; out.anchors.scuff = s.at; }
  out.set = st => { const S = { ...o, ...st }; Object.assign(o, S);
    out.dots.forEach((m, i) => { m.visible = !S.faded && i < (S.dots ?? 3); }); out.plasters.forEach((m, i) => { m.visible = !S.faded && i < (S.plasters ?? 0); });
    out.faded.forEach(m => { m.visible = !!S.faded; }); if (out.iodine) out.iodine.visible = S.iodine !== false && !S.faded; };
  out.set({}); return out;
}

// THE OR KNEE overlay (rows 1-10, 27-30, 40-41). Hides or_room's old cut slits + blue stitch, turns its glowing orange ball into skin with the iodine patch.
// opts: knee (plan, default KNEE_OR), radii (KNEE_OR_RADII), normal plan [0, -.8, .6] (toward the frame-0 lens and up), row [1, 0, 0], dots 3, plasters 0,
//   faded false, iodine true, hideOld true. Returns { group, set({ dots, plasters, faded, iodine }), plan: { dot_1..3, plaster_1..3, knee_top } }.
export function placeKneeMarks(THREE, scene, ctx, opts = {}) {
  const K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'knee_marks'; scene.add(g);
  const C = opts.knee || KNEE_OR, R = opts.radii || KNEE_OR_RADII, F = kneeFrame(THREE, [0, 0, 0], R, opts.normal || [0, -.8, .6], opts.row || [1, 0, 0]);
  const map = q => ctx.B2T([C[0] + q.x, C[1] + q.y, C[2] + q.z]);
  if (opts.hideOld !== false) scene.traverse(o => { if (/^tiny_cut_|^stitch_/.test(o.name) || o.name === 'the_stitch') o.visible = false;
    if (o.name === 'patient_knee_prepped' && o.material) { o.material = K.toon(opts.skin || '#d8b090'); } });
  const M = kneeMarks(THREE, K, g, F, map, { unlit: true, ...opts }), plan = {}; const T2B = v => [v.x, -v.z, v.y];
  for (const [k, v] of Object.entries(M.anchors)) plan[k] = T2B(v);
  const top = F.proj(F.N.clone().multiplyScalar(.2), .0); plan.knee_top = [C[0] + top.x, C[1] + top.y, C[2] + top.z];
  return { group: g, parts: K.parts, set: M.set, marks: M, plan };
}

// A STANDALONE KNEE CLOSE (rows 32, 42-44): a bent leg in shorts with the knee toward +Z. kind 'adult' (khaki shorts, light hair, faded 3 squares by default)
// | 'child' (smaller, navy shorts, the pink-brown scuff, plaster 0/1). opts: plasters, faded, dots (adult), bend deg (0 straight .. 90). Origin = the knee centre.
export function buildKneeLeg(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(), child = opts.kind === 'child'; g.name = child ? 'child_knee_leg' : 'adult_knee_leg';
  const s = child ? .62 : 1, R = [.11 * s, .1 * s, .115 * s], skin = K.toon(child ? COL.childSkin : COL.skin), skinDk = K.toon(child ? '#ead2bc' : '#e4cdb8');
  const bend = (opts.bend ?? 70) * Math.PI / 180, th = [-Math.cos(bend / 2), -Math.sin(bend / 2), 0], sh = [Math.cos(bend / 2), -Math.sin(bend / 2), 0];
  const L1 = .42 * s, L2 = .44 * s;
  K.add(g, new THREE.SphereGeometry(1, 28, 20), skin, 'knee_ball', 'skin').scale.set(R[0], R[1], R[2]);
  K.bar(g, [0, 0, 0], [th[0] * L1, th[1] * L1, 0], .085 * s, skin, 'thigh', 'skin', 16, .095 * s); K.bar(g, [0, 0, 0], [sh[0] * L2, sh[1] * L2, 0], .055 * s, skinDk, 'shin', 'skin', 16, .08 * s);
  K.add(g, new THREE.SphereGeometry(.035 * s, 10, 8), skinDk, 'kneecap_bump', 'skin', [0, .055 * s, .085 * s]).scale.set(1.3, .8, .6);
  const shorts = K.mat('cloth', child ? '#24346a' : '#b8a070'), hemC = child ? '#1a2650' : '#9a845a';
  const sp = [th[0] * L1 * .7, th[1] * L1 * .7, 0]; K.bar(g, sp, [th[0] * L1 * 1.05, th[1] * L1 * 1.05, 0], .118 * s, shorts, 'shorts_leg', 'cloth', 18, .125 * s);
  K.add(g, new THREE.TorusGeometry(.117 * s, .008 * s, 6, 24), K.toon(hemC), 'shorts_hem', 'cloth', sp, [Math.PI / 2, 0, -bend / 2 + Math.PI / 2]);
  for (let i = 0; i < 5; i++) K.bar(g, [sp[0] - .02 * s, sp[1] + .01 - i * .004, .1 * s - i * .02 * s], [sp[0] - .09 * s, sp[1] + .03 * s - i * .004, .1 * s - i * .02 * s], .0018, K.toon(hemC), 'shorts_crease', 'cloth', 4);
  if (child) { const sk = K.toon('#ffffff'); K.bar(g, [sh[0] * L2 * .8, sh[1] * L2 * .8, 0], [sh[0] * L2, sh[1] * L2, 0], .06 * s, sk, 'sock', 'cloth', 12); for (let i = 0; i < 2; i++) K.add(g, new THREE.TorusGeometry(.061 * s, .004, 5, 18), K.toon(COL.trayAqua), 'sock_stripe', 'cloth', [sh[0] * L2 * (.84 + i * .05), sh[1] * L2 * (.84 + i * .05), 0], [Math.PI / 2, 0, bend / 2 + Math.PI / 2]); }
  else for (let i = 0; i < 26; i++) { const u = K.rr(.25, .9), an = K.rr(-1.2, 1.2), r = .07 + (.08 - .07) * u; K.bar(g, [sh[0] * L2 * u + Math.sin(an) * .001, sh[1] * L2 * u, Math.cos(an) * r], [sh[0] * L2 * u + .008, sh[1] * L2 * u - .006, Math.cos(an) * (r + .006)], .0008, K.toon('#a89a8a'), 'leg_hair', 'skin', 3); }
  const F = kneeFrame(THREE, [0, 0, 0], R, opts.normal || [0, .35, 1], [1, 0, 0]), M = kneeMarks(THREE, K, g, F, q => q.clone(),
    { ...opts, child, iodine: false, spacing: .055 * (child ? 1 : 1), rowR: R[2], dots: opts.dots ?? 0, plasters: opts.plasters ?? (child ? 0 : 0), faded: opts.faded ?? !child, plaster: child ? [.04, .085] : undefined });
  return done(THREE, g, K, { grip: [th[0] * L1 * .5, th[1] * L1 * .5, .09 * s], tip: [0, 0, R[2]], anchors: { ...M.anchors, knee_front: [0, 0, R[2]], thigh_top: [th[0] * L1, th[1] * L1, .09 * s] }, set: M.set, marks: M });
}

// THE SINGLE PLASTER, held for the slap (rows 5, 40, 43): backing peeled, the sticky side down (-Z). +Y = long axis; grip = the top tab (fingertip pinch).
export function buildPlaster(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(), s = opts.child ? .87 : 1; g.name = 'plaster_held';
  const m = new THREE.MeshLambertMaterial({ map: PLASTER_TEX(K, false), transparent: true, alphaTest: .3, side: THREE.DoubleSide });
  const geo = new THREE.PlaneGeometry(.046 * s, .098 * s, 2, 8), P = geo.attributes.position; for (let i = 0; i < P.count; i++) { const y = P.getY(i); P.setZ(i, .02 * (y / .05) ** 2); } geo.computeVertexNormals();   // slight curl
  K.add(g, geo, m, 'plaster_strip', 'cloth', [0, 0, 0]);
  const tab = K.add(g, new THREE.PlaneGeometry(.044 * s, .03), K.toon('#ffffff', { side: THREE.DoubleSide }), 'plaster_backing_tab', 'paper', [0, .052 * s, .03]); tab.rotation.x = -.9;
  return done(THREE, g, K, { grip: [0, .05 * s, .02], tip: [0, -.045 * s, .015], anchors: { sticky_centre: [0, 0, 0] } });
}

// ================================================================ THE BULB SYRINGE (rows 4, 28-29): GREY-BLUE rubber #6a86a0, clear nozzle, the water fan.
// opts: water 0..1 (0 = no water out, 1 = the full fan), squeeze 0..1 (bulb flattened). +Y = nozzle. grip = bulb centre.
export function buildBulb(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'bulb_syringe';
  const rub = K.mat('rubber', COL.bulb), rubDk = K.toon('#4a6680'), clear = new THREE.MeshPhysicalMaterial({ color: '#e6f6ff', transparent: true, opacity: .45, roughness: .05, clearcoat: 1 });
  const water = new THREE.MeshPhysicalMaterial({ color: '#7fd4ff', transparent: true, opacity: .8, roughness: .02, clearcoat: 1 }), spark = K.basic('#ffffff');
  const sq = opts.squeeze ?? 0, bulb = K.add(g, new THREE.SphereGeometry(.045, 20, 14), rub, 'bulb_rubber', 'rubber'); bulb.scale.set(1 + .25 * sq, 1.25 - .35 * sq, 1 - .3 * sq);
  for (let i = 0; i < 6; i++) K.add(g, new THREE.TorusGeometry(.0455 - Math.abs(i - 2.5) * .004, .0012, 4, 24), rubDk, 'bulb_mould_ridge', 'rubber', [0, -.03 + i * .012, 0], [Math.PI / 2, 0, 0]).scale.set(1 + .25 * sq, 1 - .3 * sq, 1);
  K.add(g, new THREE.SphereGeometry(.012, 8, 6), K.toon('#9ab4cc'), 'bulb_highlight', 'rubber', [-.02, .02, .034]).scale.set(1, 1.6, .3);
  K.add(g, new THREE.TorusGeometry(.03, .006, 6, 16), rubDk, 'bulb_collar', 'rubber', [0, .056, 0], [Math.PI / 2, 0, 0]);
  K.add(g, new THREE.CylinderGeometry(.008, .016, .12, 14), clear, 'bulb_nozzle', 'glass', [0, .115, 0]); K.add(g, new THREE.CylinderGeometry(.005, .01, .08, 8), water, 'nozzle_water', 'water', [0, .12, 0]);
  for (let i = 0; i < 4; i++) K.add(g, new THREE.TorusGeometry(.0105 - i * .0013, .0008, 4, 14), K.toon('#9ab0c0'), 'nozzle_scale_ring', 'glass', [0, .08 + i * .018, 0], [Math.PI / 2, 0, 0]);
  K.box(g, [.003, .07, .003], spark, 'nozzle_glint', 'glass', [-.007, .12, .012]);
  const fan = new THREE.Group(); fan.name = 'water_fan'; g.add(fan); const wv = opts.water ?? 1; fan.visible = wv > 0; fan.scale.setScalar(Math.max(.01, wv));
  K.add(fan, new THREE.CylinderGeometry(.006, .011, .12, 8), water, 'water_stream', 'water', [0, .235, 0]);
  for (let i = 0; i < 30; i++) { const an = -1.35 + i * .093, r = .08 + (i % 5) * .035; const d = K.add(fan, new THREE.SphereGeometry(.009 + (i % 3) * .004, 8, 6), water, 'water_drop', 'water', [Math.sin(an) * r, .27 + Math.cos(an) * r * .6, (i % 2 ? .012 : -.012)]); d.scale.y = 1.5; }
  for (let i = 0; i < 7; i++) K.add(fan, new THREE.SphereGeometry(.004, 6, 4), spark, 'drop_glint', 'water', [Math.sin(-.9 + i * .3) * .13, .3 + Math.cos(-.9 + i * .3) * .07, .02]);
  return done(THREE, g, K, { grip: [0, 0, 0], tip: [0, .175, 0], anchors: { fan_centre: [0, .3, 0] }, setWater: u => { fan.visible = u > 0; fan.scale.setScalar(Math.max(.01, u)); } });
}

// ================================================================ THE SEALED SCOPE (rows 6, 48): camera head + coupler + rigid telescope, coiled light cable, all inside
// a crinkled clear sterile bag with a seal strip and a price-tag-like SEAL TAG "STERILE / SEALED / DO NOT OPEN IF DAMAGED", lot "0715".
// Lies flat on a tray (+Y = up). opts: sealed true (false = the bag torn at the seal, for nothing: it is never opened in the film), crinkle 0..1.
// Anchors: lens (the scope tip glass), cam_lens (2 cm behind the lens glass, INSIDE the bag: the row 6 impossible-view camera), cam_look (where it looks: out along the rod),
//   tag, bag_centre. Size 0.46 x 0.06 x 0.22.
export function buildScope(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'sealed_scope';
  const steel = K.metal('steel', COL.steel, .18), steelDk = K.metal('steel', '#8a94a4', .35), black = K.toon('#2a2e36'), cable = K.mat('rubber', '#3a4250'), glass = K.basic('#bfe8ff');
  // the rigid telescope (4 mm rod, 0.18 m) along +X, the camera head behind it, the focus ring with grip ribs, the light post with its cable
  K.bar(g, [-.02, .012, 0], [.2, .012, 0], .0025, steel, 'scope_rod', 'metal', 12); K.add(g, new THREE.CircleGeometry(.0024, 12), glass, 'scope_lens_glass', 'glass', [.2005, .012, 0], [0, Math.PI / 2, 0]);
  K.bar(g, [-.04, .012, 0], [-.02, .012, 0], .009, steel, 'scope_eyepiece', 'metal', 18); K.bar(g, [-.036, .012, 0], [-.034, .012, 0], .0105, steelDk, 'eyepiece_ring', 'metal', 18);
  K.bar(g, [-.012, .012, 0], [.0, .012, 0], .006, steel, 'scope_hub', 'metal', 14); K.bar(g, [-.006, .012, 0], [-.006, .032, 0], .003, steel, 'light_post', 'metal', 10);
  K.bar(g, [-.11, .012, 0], [-.04, .012, 0], .016, black, 'camera_head', 'plastic', 20);
  for (let i = 0; i < 9; i++) K.bar(g, [-.098 + i * .006, .012, 0], [-.095 + i * .006, .012, 0], .0172, K.toon('#4a505a'), 'focus_ring_rib', 'plastic', 20);
  for (let i = 0; i < 3; i++) K.add(g, new THREE.CylinderGeometry(.0035, .0035, .004, 10), K.toon(['#3aa0d8', '#f2c230', '#e8e8e8'][i]), 'camera_button', 'plastic', [-.07 + i * .012, .029, 0]);
  K.tube(g, [[-.11, .012, 0], [-.15, .01, .01], [-.19, .008, .05], [-.17, .008, .1], [-.1, .008, .11], [-.06, .008, .07], [-.1, .008, .04], [-.16, .008, .07]], .0045, cable, 'camera_cable_coil', 'rubber', 60);
  K.tube(g, [[-.006, .032, 0], [.0, .05, .03], [.04, .008, .06], [.12, .008, .07], [.16, .008, .04], [.13, .008, .02]], .0035, K.toon('#5a6a80'), 'light_cable', 'rubber', 50);
  // the bag: clear crinkled plastic (a displaced flat pillow), heat-seal strip, the dotted peel chevron, the paper back panel
  const bag = new THREE.BoxGeometry(.46, .05, .22, 30, 2, 14), P = bag.attributes.position, cr = opts.crinkle ?? 1;
  for (let i = 0; i < P.count; i++) { const x = P.getX(i), y = P.getY(i), z = P.getZ(i); const n = Math.sin(x * 61 + z * 23) * Math.sin(z * 47 - x * 17) * .004 * cr + Math.sin(x * 140) * .0012 * cr; P.setY(i, y * (1 - (x / .23) ** 6 * .8) + (y > 0 ? n : 0) + .02); }
  bag.computeVertexNormals();
  const bagM = new THREE.MeshPhysicalMaterial({ color: '#eef8ff', transparent: true, opacity: .26, roughness: .12, clearcoat: 1, clearcoatRoughness: .05, side: THREE.DoubleSide, depthWrite: false });
  K.add(g, bag, bagM, 'sterile_bag', 'glass', [0, 0, 0], null, false);
  const backT = K.tex('scope_bag_back', 512, 256, (c, w, h) => { c.fillStyle = '#e8ecf2'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(60,90,140,.25)'; for (let i = 0; i < 14; i++) c.fillRect(0, i * 20, w, 2);
    txt(c, 'STERILE', 120, 60, 'bold 34px ' + SANS, '#3a5a8a'); txt(c, 'STERILE', 380, 200, 'bold 34px ' + SANS, '#3a5a8a'); txt(c, 'ARTHROSCOPE 4.0 mm 30°', 256, 128, 'bold 22px ' + SANS, '#3a5a8a'); });
  K.add(g, new THREE.PlaneGeometry(.44, .2), K.paper(backT), 'bag_paper_back', 'paper', [0, .001, 0], [-Math.PI / 2, 0, 0], false);
  K.box(g, [.012, .006, .22], K.toon('#d8e4ee'), 'heat_seal_strip', 'plastic', [.215, .02, 0]); for (let i = 0; i < 14; i++) K.box(g, [.002, .007, .006], K.toon('#9ab0c4'), 'seal_rib', 'plastic', [.211 + (i % 2) * .006, .02, -.1 + i * .015]);
  for (let i = 0; i < 6; i++) K.box(g, [.012, .002, .003], K.toon('#5a7aa8'), 'peel_chevron', 'paper', [.19 - Math.abs(i - 2.5) * .006, .046, -.04 + i * .016], [0, (i < 3 ? 1 : -1) * .7, 0]);
  // THE SEAL TAG (price-tag shape: a pointed end with a punched hole, a string loop to the seal)
  const tagT = K.tex('seal_tag', 256, 128, (c, w, h) => { c.fillStyle = '#f2c230'; c.beginPath(); c.moveTo(40, 0); c.lineTo(w, 0); c.lineTo(w, h); c.lineTo(40, h); c.lineTo(0, h / 2); c.closePath(); c.fill();
    c.strokeStyle = COL.ink; c.lineWidth = 5; c.stroke(); c.fillStyle = '#7a5a10'; c.beginPath(); c.arc(30, h / 2, 9, 0, 7); c.fill();
    txt(c, 'STERILE', 150, 30, 'bold 34px ' + SANS); txt(c, 'SEALED', 150, 68, 'bold 36px ' + SANS); txt(c, 'DO NOT OPEN IF DAMAGED  LOT 0715', 150, 104, 'bold 13px ' + SANS); });
  const tagM = new THREE.MeshLambertMaterial({ map: tagT, transparent: true, alphaTest: .2, side: THREE.DoubleSide });
  const tag = K.add(g, new THREE.PlaneGeometry(.1, .05), tagM, 'seal_tag', 'paper', [.27, .03, .05], [-1.2, 0, -.2]);
  K.tube(g, [[.218, .022, .05], [.235, .03, .06], [.255, .03, .052]], .0008, K.toon('#f4f4f0'), 'tag_string', 'cloth', 10, 4);
  if (opts.sealed === false) tag.visible = false;
  return done(THREE, g, K, { grip: [-.075, .012, 0], tip: [.2, .012, 0], anchors: { lens: [.2005, .012, 0], cam_lens: [.215, .03, 0], cam_look: [.6, .05, 0], tag: [.27, .03, .05], bag_centre: [0, .02, 0] } });
}

// ================================================================ THE CRT MONITOR (rows 6, 27-28): beige 1990s 14" medical monitor, curved glass, scanlines, no logo.
// opts.screen 'nosignal' | 'snow' | 'tape' | 'off'; opts.inside true = the glass is see-through from behind (the row 27-28 impossible view from inside the CRT).
// setScreen(kind), update(t) (snow flickers). Anchors: screen_centre, cam_inside (inside the tube, behind the glass), cam_look (out through the glass), power_led.
// Size 0.42 w x 0.36 h x 0.40 d; origin bottom centre, screen toward +Z.
const SCREENS = {
  nosignal: (c, w, h) => { c.fillStyle = '#1a3fb0'; c.fillRect(0, 0, w, h); txt(c, 'NO SIGNAL', w / 2, h / 2 - 16, 'bold 70px ' + SANS, '#ffffff'); txt(c, 'CAMERA: NOT CONNECTED', w / 2, h / 2 + 52, 'bold 24px ' + SANS, '#bcd0ff'); },
  tape: (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * .62); g.addColorStop(0, '#f6c6c2'); g.addColorStop(.6, '#e8a0a8'); g.addColorStop(1, '#5a2a3a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#fbe6e0'; c.beginPath(); c.ellipse(w * .42, h * .58, 150, 70, -.15, 0, 7); c.fill(); c.fillStyle = '#f4d0cc'; c.beginPath(); c.ellipse(w * .62, h * .34, 110, 46, .2, 0, 7); c.fill();   // smooth joint surfaces
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 6; c.beginPath(); c.ellipse(w * .4, h * .52, 110, 30, -.15, 3.6, 5.4); c.stroke();
    c.fillStyle = 'rgba(20,10,20,.85)'; c.beginPath(); c.arc(w / 2, h / 2, w * .62, 0, 7); c.arc(w / 2, h / 2, w * .5, 0, 7, true); c.fill();   // the round scope vignette
    txt(c, 'PLAY ▶', 70, 28, 'bold 24px monospace', '#ffffff'); txt(c, '00:12:07', w - 80, h - 26, 'bold 22px monospace', '#ffffff'); },
  off: (c, w, h) => { c.fillStyle = '#1e2a26'; c.fillRect(0, 0, w, h); },
};
export function buildCRT(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'crt_monitor';
  const beige = K.mat('plastic', COL.beige), beigeDk = K.toon('#b8ac90'), dark = K.toon('#2a2a2e'), W = .42, H = .36, D = .4;
  K.box(g, [W, H, .06], beige, 'crt_front_bezel', 'plastic', [0, H / 2, D / 2 - .03]);
  const back = K.add(g, new THREE.CylinderGeometry(.11, .17, D - .06, 4, 1), beigeDk, 'crt_back_tube_housing', 'plastic', [0, H / 2 + .01, -.03], [Math.PI / 2, Math.PI / 4, 0]); back.scale.set(1.2, 1, 1);
  for (let i = 0; i < 9; i++) K.box(g, [.12, .004, .004], dark, 'crt_vent_slot', 'plastic', [0, H - .01, -.02 - i * .016]);
  // the glass: a shallow sphere cap, scanline overlay, a dark inner mask (the bezel's screen hole edge)
  const scr = K.tex('crt_' + (opts.screen || 'nosignal'), 512, 384, SCREENS[opts.screen] || SCREENS.nosignal), sw = .32, sh = .24;
  const glassG = new THREE.PlaneGeometry(sw, sh, 16, 12), PG = glassG.attributes.position; for (let i = 0; i < PG.count; i++) { const x = PG.getX(i), y = PG.getY(i); PG.setZ(i, .02 - (x * x + y * y) * .35); } glassG.computeVertexNormals();
  const scrM = K.glow(scr, { side: opts.inside ? THREE.DoubleSide : THREE.FrontSide, transparent: !!opts.inside, opacity: opts.inside ? .42 : 1 });
  const glass = K.add(g, glassG, scrM, 'crt_screen', 'lamp', [0, H / 2 + .02, D / 2 - .005], null, false);
  const scanT = K.tex('scanlines', 4, 256, (c, w, h) => { c.clearRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.32)'; for (let y = 0; y < h; y += 3) c.fillRect(0, y, w, 1); });
  const scanM = new THREE.MeshBasicMaterial({ map: scanT, transparent: true, depthWrite: false, side: THREE.DoubleSide }); scanT.wrapS = scanT.wrapT = THREE.RepeatWrapping; scanT.repeat.set(1, 2);
  K.add(g, glassG.clone(), scanM, 'crt_scanlines', 'lamp', [0, H / 2 + .02, D / 2 - .004], null, false);
  const sheen = K.add(g, new THREE.PlaneGeometry(.05, .22), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .14, depthWrite: false }), 'crt_glass_glint', 'glass', [-.09, H / 2 + .03, D / 2 + .018], [0, 0, -.5], false);
  for (const [x, y, w, h] of [[0, sh / 2 + .02, sw + .04, .04], [0, -sh / 2 - .02, sw + .04, .04], [-sw / 2 - .02, 0, .04, sh], [sw / 2 + .02, 0, .04, sh]]) K.box(g, [w, h, .02], dark, 'crt_screen_mask', 'plastic', [x, H / 2 + .02 + y, D / 2 + .005]);
  // the control strip: power button, green LED, four knobs, the speaker grille; no maker's name (a blank badge plate)
  K.box(g, [W - .02, .035, .02], beigeDk, 'crt_control_strip', 'plastic', [0, .022, D / 2 + .005]);
  K.box(g, [.03, .016, .012], K.toon('#a89c80'), 'crt_power_button', 'plastic', [.17, .022, D / 2 + .016]); const led = K.add(g, new THREE.SphereGeometry(.004, 8, 6), K.basic('#5aff6a'), 'crt_power_led', 'lamp', [.145, .022, D / 2 + .017]);
  for (let i = 0; i < 4; i++) K.add(g, new THREE.CylinderGeometry(.007, .008, .012, 14), dark, 'crt_knob', 'plastic', [-.05 + i * .035, .022, D / 2 + .018], [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 6; i++) K.box(g, [.05, .002, .004], dark, 'crt_speaker_slot', 'plastic', [-.15, .012 + i * .004, D / 2 + .016]);
  K.box(g, [.06, .012, .003], K.toon('#e8e0cc'), 'crt_blank_badge', 'plastic', [0, H - .016, D / 2 + .002]);
  for (const x of [-.16, .16]) K.box(g, [.04, .012, .3], dark, 'crt_rubber_foot', 'rubber', [x, .006, 0]);
  K.tube(g, [[0, .1, -.2], [0, .05, -.28], [.05, .01, -.33]], .006, K.toon('#2a2a2e'), 'crt_video_cable', 'rubber', 16);
  let kind = opts.screen || 'nosignal', snowC = null, snowT = null;
  const setScreen = k => { kind = k; if (k === 'snow') { if (!snowC) { snowC = document.createElement('canvas'); snowC.width = 160; snowC.height = 120; snowT = new THREE.CanvasTexture(snowC); snowT.colorSpace = THREE.SRGBColorSpace; snowT.userData = { canvas: snowC }; }
      update(0); scrM.map = snowT; } else scrM.map = K.tex('crt_' + k, 512, 384, SCREENS[k] || SCREENS.nosignal); scrM.needsUpdate = true; led.visible = k !== 'off'; };
  const update = t => { if (kind !== 'snow' || !snowC) return; const c = snowC.getContext('2d'), im = c.createImageData(160, 120); let s = (Math.floor(t * 30) * 7919 + 13) % 2147483647 || 1;
    for (let i = 0; i < im.data.length; i += 4) { s = (s * 16807) % 2147483647; const v = 40 + (s % 200); im.data[i] = v; im.data[i + 1] = v; im.data[i + 2] = v + 10; im.data[i + 3] = 255; } c.putImageData(im, 0, 0); snowT.needsUpdate = true; };
  if (kind === 'snow') setScreen('snow');
  return done(THREE, g, K, { grip: [0, H, 0], tip: [0, H / 2 + .02, D / 2], anchors: { screen_centre: [0, H / 2 + .02, D / 2 + .02], cam_inside: [0, H / 2 + .02, D / 2 - .09], cam_look: [0, H / 2 + .02, D / 2 + 2], power_led: [.145, .022, D / 2 + .017] }, setScreen, update, screenMaterial: scrM });
}

// THE VCR (row 27): 1990s black-silver VHS deck, cassette flap, green VFD clock "7:15", PLAY light (opts.play true) with the triangle. Size .38 x .09 x .3.
export function buildVCR(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'vcr';
  const body = K.toon('#2c2e34'), silver = K.metal('steel', '#a8b0bc', .35), W = .38, H = .09, D = .3;
  K.box(g, [W, H, D], body, 'vcr_body', 'plastic', [0, H / 2, 0]); K.box(g, [W, .03, .004], silver, 'vcr_front_trim', 'metal', [0, .015, D / 2 + .002]);
  K.box(g, [.19, .032, .006], K.toon('#1a1b20'), 'vcr_cassette_flap', 'plastic', [-.06, .058, D / 2 + .003]); K.box(g, [.19, .003, .007], silver, 'vcr_flap_lip', 'metal', [-.06, .042, D / 2 + .004]);
  const vfd = K.tex('vcr_vfd_' + (opts.play !== false ? 'play' : 'stop'), 256, 64, (c, w, h) => { c.fillStyle = '#0a1210'; c.fillRect(0, 0, w, h); const on = opts.play !== false;
    txt(c, '7:15', 70, 34, 'bold 38px monospace', '#7affc8'); txt(c, on ? '▶ PLAY' : 'STOP', 185, 34, 'bold 30px monospace', on ? '#7aff8a' : '#2a5a4a'); });
  K.add(g, new THREE.PlaneGeometry(.1, .025), K.glow(vfd), 'vcr_display', 'lamp', [.11, .06, D / 2 + .004], null, false);
  const btn = ['◀◀', '▶', '▶▶', '■', '⏏'];
  btn.forEach((s, i) => { K.box(g, [.022, .01, .008], K.toon(i === 1 && opts.play !== false ? '#7aff8a' : '#5a5e68'), 'vcr_button', 'plastic', [.075 + i * .026, .022, D / 2 + .005]); });
  const playLed = K.add(g, new THREE.SphereGeometry(.0035, 8, 6), K.basic(opts.play !== false ? '#7aff8a' : '#2a3a2e'), 'vcr_play_light', 'lamp', [-.16, .07, D / 2 + .004]);
  for (const x of [-.16, .16]) for (const z of [-.12, .12]) K.add(g, new THREE.CylinderGeometry(.012, .012, .008, 10), K.toon('#111'), 'vcr_foot', 'rubber', [x, -.002, z]);
  // the tape half in the slot, label "REAL ONE"
  const tape = buildTape(THREE, ctx, {}); tape.group.position.set(-.06, .058, D / 2 - .02); tape.group.rotation.x = -Math.PI / 2; tape.group.visible = opts.tapeIn !== false; g.add(tape.group);
  return done(THREE, g, K, { grip: [0, H, 0], anchors: { play_light: [-.16, .07, D / 2 + .004], display: [.11, .06, D / 2 + .004], slot: [-.06, .058, D / 2] }, tape, playLight: playLed });
}
// THE TAPE "REAL ONE": black VHS cassette, two reel windows with tape on the reels, the white paper label in marker hand. 0.187 x 0.103 x 0.025. Face +Z.
export function buildTape(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'vhs_tape_real_one';
  K.box(g, [.187, .103, .025], K.toon('#18191c'), 'tape_shell', 'plastic', [0, 0, 0]);
  const lab = K.tex('tape_label', 384, 128, (c, w, h) => { c.fillStyle = '#f8f4e8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#3a6ab0'; c.lineWidth = 2; for (let y = 40; y < h; y += 28) { c.beginPath(); c.moveTo(10, y); c.lineTo(w - 10, y); c.stroke(); }
    txt(c, opts.label || 'REAL ONE', w / 2, 68, 'bold 64px ' + HAND, COL.ink); c.strokeStyle = COL.ink; c.lineWidth = 4; c.beginPath(); c.moveTo(60, 104); c.quadraticCurveTo(w / 2, 116, w - 60, 100); c.stroke(); });
  K.add(g, new THREE.PlaneGeometry(.12, .04), K.paper(lab), 'tape_label', 'paper', [0, .025, .0128]);
  K.box(g, [.1, .03, .002], K.toon('#4a4e58'), 'tape_window', 'glass', [0, -.014, .013]);
  for (const x of [-.03, .03]) { K.add(g, new THREE.CylinderGeometry(.013 + (x > 0 ? .002 : .006), .013 + (x > 0 ? .002 : .006), .003, 18), K.toon('#3a2a20'), 'tape_reel_wound', 'plastic', [x, -.014, .0125], [Math.PI / 2, 0, 0]);
    K.add(g, new THREE.CylinderGeometry(.006, .006, .004, 6), K.toon('#e8e8e8'), 'tape_reel_hub', 'plastic', [x, -.014, .013], [Math.PI / 2, 0, 0]); }
  for (const x of [-.085, .085]) K.screw(g, [x, -.042, .0125], [Math.PI / 2, 0, 0], .003);
  return done(THREE, g, K, { grip: [.09, 0, 0], anchors: { label: [0, .025, .013] } });
}

// ================================================================ THE STEEL JUG + BOWL + SPLOOSH (rows 29, 4). Jug: stainless 1.5 l pitcher, rolled rim, spout, riveted handle.
// opts.pour 0..1 (a falling stream from the spout of that length x 0.9 m, the jug is not tilted here: tilt it with held3d angle). grip = handle middle, tip = spout lip.
export function buildJug(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'steel_jug';
  const steel = K.metal('steel', COL.steel, .14, 1.3), steelDk = K.metal('steel', '#9aa4b4', .3);
  const prof = [[.0, 0], [.065, 0], [.072, .01], [.07, .06], [.062, .14], [.06, .18], [.066, .2], [.068, .205]].map(p => new THREE.Vector2(p[0], p[1]));
  steel.side = THREE.DoubleSide; K.add(g, new THREE.LatheGeometry(prof, 40), steel, 'jug_body', 'metal');
  K.add(g, new THREE.TorusGeometry(.068, .004, 6, 40), steel, 'jug_rolled_rim', 'metal', [0, .205, 0], [Math.PI / 2, 0, 0]);
  const sp = K.add(g, new THREE.ConeGeometry(.03, .06, 16, 1, true, 0, Math.PI), steel, 'jug_spout', 'metal', [0, .19, .07], [Math.PI / 2 + .5, 0, 0]); 
  for (let i = 0; i < 3; i++) K.add(g, new THREE.TorusGeometry(.0655 - i * .002, .0012, 4, 40), steelDk, 'jug_spun_ring', 'metal', [0, .03 + i * .05, 0], [Math.PI / 2, 0, 0]);
  K.tube(g, [[0, .17, -.066], [0, .18, -.11], [0, .12, -.125], [0, .05, -.1], [0, .04, -.068]], .008, steel, 'jug_handle', 'metal', 30, 8);
  for (const y of [.17, .04]) K.add(g, new THREE.SphereGeometry(.0045, 8, 6), steelDk, 'jug_rivet', 'metal', [0, y, -.07]);
  K.add(g, new THREE.CircleGeometry(.06, 30), new THREE.MeshPhysicalMaterial({ color: '#8fd8ff', roughness: .02, clearcoat: 1, transparent: true, opacity: .85 }), 'jug_water_surface', 'water', [0, .16, 0], [-Math.PI / 2, 0, 0]);
  const stream = new THREE.Group(); stream.name = 'jug_pour_stream'; g.add(stream); const L = .9;
  K.tube(stream, [[0, .2, .1], [0, .16, .16], [0, .0, .2], [0, -L * .5, .22], [0, -L, .22]], .009, new THREE.MeshPhysicalMaterial({ color: '#8fd8ff', roughness: .02, clearcoat: 1, transparent: true, opacity: .75 }), 'pour_water', 'water', 30, 8);
  for (let i = 0; i < 8; i++) K.add(stream, new THREE.SphereGeometry(.006, 6, 5), K.basic('#ffffff'), 'pour_glint', 'water', [K.rr(-.01, .01), .1 - i * .12, .2 + K.rr(-.01, .02)]);
  const setPour = u => { stream.visible = u > 0; stream.scale.set(1, Math.max(.01, u), 1); }; setPour(opts.pour ?? 0);
  return done(THREE, g, K, { grip: [0, .11, -.118], tip: [0, .2, .1], anchors: { spout: [0, .2, .1], stream_end: [0, -L, .22] }, setPour });
}
// THE STEEL BOWL (rows 4, 29): 1990s stainless kidney-free round bowl, 26 cm, water + ripple rings. opts.water 0..1 level. Origin = base centre.
export function buildBowl(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'steel_bowl';
  const steel = K.metal('steel', COL.steel, .12, 1.3), prof = [[0, 0], [.06, 0], [.07, .004], [.1, .03], [.125, .07], [.13, .085], [.134, .088]].map(p => new THREE.Vector2(p[0], p[1]));
  steel.side = THREE.DoubleSide; K.add(g, new THREE.LatheGeometry(prof, 48), steel, 'bowl_body', 'metal');
  K.add(g, new THREE.TorusGeometry(.134, .003, 6, 48), steel, 'bowl_rolled_rim', 'metal', [0, .088, 0], [Math.PI / 2, 0, 0]);
  const lv = .02 + .05 * (opts.water ?? .6), wr = .07 + .055 * (lv - .004) / .066;
  K.add(g, new THREE.CircleGeometry(wr, 40), new THREE.MeshPhysicalMaterial({ color: '#7fd0f8', roughness: .02, clearcoat: 1, transparent: true, opacity: .82 }), 'bowl_water', 'water', [0, lv, 0], [-Math.PI / 2, 0, 0], false);
  for (let i = 0; i < 3; i++) K.add(g, new THREE.RingGeometry(.02 + i * .025, .023 + i * .025, 32), K.basic('#ffffff', { transparent: true, opacity: .6 - i * .15 }), 'bowl_ripple', 'water', [0, lv + .001, 0], [-Math.PI / 2, 0, 0], false);
  return done(THREE, g, K, { grip: [.134, .088, 0], anchors: { water_centre: [0, lv, 0], rim_left: [-.134, .088, 0], rim_right: [.134, .088, 0] } });
}
// THE SPLOOSH (row 29): a crown ring of water rising from the bowl + flying drops + one ring wave. opts.u 0..1 (grow and fall). setU(u). Origin = water centre.
export function buildSploosh(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'sploosh';
  const wat = new THREE.MeshPhysicalMaterial({ color: '#9fe0ff', roughness: .02, clearcoat: 1, transparent: true, opacity: .8, side: THREE.DoubleSide }), white = K.basic('#ffffff');
  const crown = K.add(g, new THREE.CylinderGeometry(.13, .09, .12, 32, 1, true), wat, 'sploosh_crown', 'water', [0, .06, 0]);
  const tips = []; for (let i = 0; i < 16; i++) { const an = i / 16 * Math.PI * 2; tips.push(K.add(g, new THREE.SphereGeometry(.012, 8, 6), wat, 'sploosh_crown_tip', 'water', [Math.cos(an) * .135, .13, Math.sin(an) * .135])); }
  const drops = []; for (let i = 0; i < 24; i++) { const an = K.rr(0, 6.28), r = K.rr(.12, .4); drops.push([K.add(g, new THREE.SphereGeometry(K.rr(.006, .014), 8, 6), i % 4 ? wat : white, 'sploosh_drop', 'water'), an, r, K.rr(.15, .45)]); }
  const ring = K.add(g, new THREE.RingGeometry(.14, .16, 48), K.basic('#e8f8ff', { transparent: true, opacity: .7, side: THREE.DoubleSide }), 'sploosh_ring_wave', 'water', [0, .004, 0], [-Math.PI / 2, 0, 0], false);
  const setU = u => { const up = Math.sin(Math.min(1, u) * Math.PI); crown.scale.set(1 + u * .6, Math.max(.01, up), 1 + u * .6); crown.position.y = .06 * up;
    tips.forEach((t, i) => { const an = i / 16 * Math.PI * 2; t.position.set(Math.cos(an) * .135 * (1 + u * .6), .13 * up, Math.sin(an) * .135 * (1 + u * .6)); t.visible = up > .1; });
    drops.forEach(([d, an, r, h]) => { d.position.set(Math.cos(an) * r * u, h * 4 * u * (1 - u), Math.sin(an) * r * u); d.visible = u > .02 && u < .98; });
    ring.scale.setScalar(1 + u * 2.5); ring.material.opacity = .7 * (1 - u); };
  setU(opts.u ?? .45);
  return done(THREE, g, K, { anchors: { centre: [0, 0, 0] }, setU });
}

// ================================================================ THE 180 FILE CARDS (rows 19-20)
// buildCardStack: opts.count 180, height (m; real 0.054 = 180 x 0.3 mm; EXTREME row 19 up to 2.9 = the lounge ceiling), sway 0..1 (the top leans, a curve),
//   tabs true (a coloured index tab every 15 cards in the three tray colours), topTab "180 KNEES" on the top card, doodle (knee drawing on the top card).
// grip_left / grip_right = the two hands at the bottom third (box hold), top = the top card. setSway(u). Card 0.127 x 0.076 (5 x 3 in), long side along X.
const CARD_TEX = (K, n, doodle) => K.tex('card_' + n + (doodle ? 'd' : ''), 320, 192, (c, w, h) => { c.fillStyle = '#fbf7ea'; c.fillRect(0, 0, w, h); c.strokeStyle = '#7aa6d8'; c.lineWidth = 2;
  for (let y = 54; y < h; y += 22) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } c.strokeStyle = '#d8a0b8'; c.beginPath(); c.moveTo(0, 40); c.lineTo(w, 40); c.stroke();   // pink-lilac head rule (no red)
  txt(c, 'KNEE  No. ' + String(n).padStart(3, '0'), 14, 22, 'bold 22px ' + HAND, '#1b2a5a', 'left'); txt(c, 'L / R   pain 7/10', 14, 70, '20px ' + HAND, '#1b2a5a', 'left');
  if (doodle) { c.strokeStyle = COL.ink; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(150, 170); c.lineTo(205, 92); c.lineTo(262, 170); c.stroke();   // the bent leg
    c.beginPath(); c.arc(205, 92, 20, 0, 7); c.stroke(); c.fillStyle = COL.ink; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(193 + i * 12, 92, 3.2, 0, 7); c.fill(); }
    c.lineWidth = 3; c.beginPath(); c.moveTo(232, 62); c.lineTo(244, 50); c.moveTo(240, 70); c.lineTo(256, 64); c.stroke(); } });
// EXTREME (height > 0.5 m, row "180 knees" taken literally): a leaning TOWER of real 5 x 3 in index cards (0.127 x 0.076), each card its own instance 4 mm thick
//   (cartoon thickness so the edges read as stripes), fanned (yaw +-0.45 rad, x random walk), 6 % loose cards slipping 4-8 cm out, coloured divider tabs out of the front every 12 cards,
//   the big yellow "180 KNEES" tab standing on the top card toward the lens. setSway(u) bends the whole tower (u 0..1; animate it with a sine for the wobble).
function buildCardTower(THREE, ctx, opts, K, g, H) {
  const cw = .127, cd = .076, t = .004, N = Math.round(H / t), edges = ['#f4ecd0', COL.manila, '#efe2b8', '#d9c48c', '#fbf6e4', '#e6d6a8'];
  const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(cw, t * .86, cd), new THREE.MeshLambertMaterial({ color: '#ffffff' }), N); inst.name = 'card_tower_cards'; inst.userData.role = 'paper'; inst.castShadow = inst.receiveShadow = true; g.add(inst); K.parts.push(inst);
  const tabCols = [COL.trayBlue, COL.trayAqua, COL.trayPurple, '#f2c230'], NT = Math.floor(N / 12);
  const tabs = new THREE.InstancedMesh(new THREE.BoxGeometry(.034, t * .8, .022), new THREE.MeshLambertMaterial({ color: '#ffffff' }), NT); tabs.name = 'card_tower_divider_tabs'; tabs.userData.role = 'paper'; tabs.castShadow = true; g.add(tabs); K.parts.push(tabs);
  K.reseed(31); const J = []; let walk = 0;
  for (let i = 0; i < N; i++) { walk = walk * .93 + K.rr(-.011, .011); const slip = K.rnd() < .06 ? K.rr(.04, .08) * (K.rnd() < .5 ? -1 : 1) : 0;
    J.push({ x: walk + slip, z: K.rr(-.006, .006) + (slip ? K.rr(-.01, .01) : 0), yaw: K.rr(-.45, .45) + (slip ? K.rr(-.3, .3) : 0), c: edges[Math.floor(K.rnd() * edges.length)], sh: K.rr(.86, 1.04) }); }
  const col = new THREE.Color(); for (let i = 0; i < N; i++) inst.setColorAt(i, col.set(J[i].c).multiplyScalar(J[i].sh)); for (let j = 0; j < NT; j++) tabs.setColorAt(j, col.set(tabCols[j % 4]));
  const top = new THREE.Group(); top.name = 'top_card'; g.add(top);
  K.add(top, new THREE.PlaneGeometry(cw, cd), K.paper(CARD_TEX(K, 1, opts.doodle !== false)), 'top_card_face', 'paper', [0, .0006, 0], [-Math.PI / 2, 0, 0]);
  const tabT = K.tex('tab_180_big', 512, 192, (c, w, h) => { c.fillStyle = '#f2c230'; c.beginPath(); c.moveTo(24, h); c.lineTo(52, 10); c.lineTo(w - 52, 10); c.lineTo(w - 24, h); c.closePath(); c.fill(); c.strokeStyle = COL.ink; c.lineWidth = 8; c.stroke(); txt(c, opts.topTab || '180 KNEES', w / 2, 108, 'bold 92px ' + SANS); });
  K.add(top, new THREE.PlaneGeometry(.2, .075), new THREE.MeshLambertMaterial({ map: tabT, transparent: true, alphaTest: .2, side: THREE.DoubleSide }), 'top_tab_180_knees', 'paper', [0, .037, cd / 2 - .01]);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1), P = new THREE.Vector3();
  const setSway = u => { const off = s => .35 * u * H * s * s * .45, ang = s => .7 * u * s * .45;
    for (let i = 0; i < N; i++) { const s = i / (N - 1), j = J[i]; e.set(0, j.yaw, -ang(s)); q.setFromEuler(e); m4.compose(P.set(off(s) + j.x, t * (i + .5), j.z), q, one); inst.setMatrixAt(i, m4); }
    for (let k = 0; k < NT; k++) { const i = k * 12 + 6, s = i / (N - 1), j = J[i], sx = (k % 3 - 1) * .038; e.set(0, j.yaw, -ang(s)); q.setFromEuler(e);
      const lp = new THREE.Vector3(sx, 0, cd / 2 + .006).applyEuler(e); m4.compose(P.set(off(s) + j.x + lp.x, t * (i + .5) + lp.y, j.z + lp.z), q, one); tabs.setMatrixAt(k, m4); }
    inst.instanceMatrix.needsUpdate = tabs.instanceMatrix.needsUpdate = true; if (inst.instanceColor) inst.instanceColor.needsUpdate = true; if (tabs.instanceColor) tabs.instanceColor.needsUpdate = true;
    top.position.set(off(1) + J[N - 1].x, t * N, J[N - 1].z); top.rotation.set(0, J[N - 1].yaw * .3, -ang(1)); };
  setSway(opts.sway ?? 0);
  return done(THREE, g, K, { grip: [0, H * .3, cd / 2], anchors: { grip_left: [-cw / 2, .6, 0], grip_right: [cw / 2, .6, 0], top: [0, H, 0], tab: [0, H + .04, cd / 2] }, setSway, height: H, cards: N });
}
export function buildCardStack(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'card_stack_180';
  if ((opts.height ?? .054) > .5) { g.name = 'card_stack_180_extreme'; return buildCardTower(THREE, ctx, opts, K, g, opts.height); }
  const N = opts.count ?? 180, H = opts.height ?? .054, cw = .127, cd = .076, th = H / N;
  const edges = [COL.manila, '#efe2b8', '#e2cc94', '#f4ecd0'];
  const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(cw, th * .92, cd), new THREE.MeshLambertMaterial({ color: '#ffffff' }), N); inst.name = 'card_stack_cards'; inst.userData.role = 'paper'; inst.castShadow = inst.receiveShadow = true; g.add(inst); K.parts.push(inst);
  const col = new THREE.Color(), jit = []; for (let i = 0; i < N; i++) jit.push([K.rr(-.004, .004), K.rr(-.003, .003), K.rr(-.06, .06)]);
  const tabCols = [COL.trayBlue, COL.trayAqua, COL.trayPurple], tabs = [];
  for (let i = 0; i < N; i += 15) { const t = K.box(g, [.022, Math.max(th * 3, .0015), .012], K.toon(tabCols[(i / 15) % 3]), 'card_index_tab', 'paper', [0, 0, 0]); tabs.push([t, i]); }
  const top = new THREE.Group(); top.name = 'top_card'; g.add(top);
  K.add(top, new THREE.PlaneGeometry(cw, cd), K.paper(CARD_TEX(K, 1, opts.doodle !== false)), 'top_card_face', 'paper', [0, .0006, 0], [-Math.PI / 2, 0, 0]);
  const tabT = K.tex('tab_180', 256, 96, (c, w, h) => { c.fillStyle = '#f2c230'; c.beginPath(); c.moveTo(16, h); c.lineTo(30, 6); c.lineTo(w - 30, 6); c.lineTo(w - 16, h); c.fill(); c.strokeStyle = COL.ink; c.lineWidth = 4; c.stroke(); txt(c, opts.topTab || '180 KNEES', w / 2, 56, 'bold 44px ' + SANS); });
  const tab = K.add(top, new THREE.PlaneGeometry(.075, .028), new THREE.MeshLambertMaterial({ map: tabT, transparent: true, alphaTest: .2, side: THREE.DoubleSide }), 'top_tab_180_knees', 'paper', [0, .014, -cd / 2 - .001]);
  const setSway = u => { const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    const off = s => .35 * u * H * s * s * (H > .5 ? .45 : .1), ang = s => .7 * u * s * (H > .5 ? .45 : .1);
    for (let i = 0; i < N; i++) { const s = i / Math.max(1, N - 1), y = th * (i + .5), j = jit[i]; e.set(0, j[2], -ang(s)); q.setFromEuler(e); m4.compose(new THREE.Vector3(off(s) + j[0], y, j[1]), q, new THREE.Vector3(1, 1, 1)); inst.setMatrixAt(i, m4);
      inst.setColorAt(i, col.set(edges[i % 4])); }
    inst.instanceMatrix.needsUpdate = true; if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    tabs.forEach(([t, i]) => { const s = i / Math.max(1, N - 1); t.position.set(off(s) + (i % 2 ? .03 : -.03), th * (i + .5), -cd / 2 - .005); t.rotation.z = -ang(s); });
    top.position.set(off(1), H, 0); top.rotation.set(0, jit[N - 1][2], -ang(1)); };
  setSway(opts.sway ?? 0);
  return done(THREE, g, K, { grip: [0, H * .3, cd / 2], anchors: { grip_left: [-cw / 2, Math.min(H * .3, .6), 0], grip_right: [cw / 2, Math.min(H * .3, .6), 0], top: [0, H, 0], tab: [0, H + .014, -cd / 2] }, setSway, height: H });
}
// ONE FILE CARD (row 20: the card that sticks to his thumb). opts.n (number), doodle. +Y = the long side (held3d point). grip = one short end.
export function buildFileCard(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'file_card';
  const geo = new THREE.PlaneGeometry(.076, .127, 2, 6), P = geo.attributes.position; for (let i = 0; i < P.count; i++) P.setZ(i, .006 * Math.cos(P.getY(i) * 20)); geo.computeVertexNormals();
  const t = CARD_TEX(K, opts.n ?? 97, !!opts.doodle); const m = K.paper(t, { side: THREE.DoubleSide }); t.center.set(.5, .5); t.rotation = Math.PI / 2;
  K.add(g, geo, m, 'file_card_face', 'paper', [0, 0, 0]);
  return done(THREE, g, K, { grip: [0, -.055, 0], tip: [0, .06, 0] });
}

// ================================================================ THE THREE WIRE TRAYS (rows 20-23, same left-right order as the bars 36-37)
// opts.kind 'scrape' (steel-blue tag, scraper icon, "60") | 'rinse' (aqua tag, water drop, "60") | 'trick' ("?" + magician hat + "60" + "PRETEND SURGERY", purple tag)
//   fill 0..1 (cards in it, 1 = 60 cards level with the other trays), note true (trick: the "?" sticky note on the label, row 23).
// 1990s chrome wire letter tray 0.34 x 0.07 x 0.26 (front lip toward +Z). Anchors: label, cards_top, drop (where a dealt card lands).
export function buildWireTray(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(), kind = opts.kind || 'scrape'; g.name = 'wire_tray_' + kind;
  const wire = K.metal('steel', '#d0d6e0', .2, 1.2), W = .34, D = .26, H = .07, r = .0022;
  for (const z of [-D / 2, D / 2]) { K.bar(g, [-W / 2, H, z], [W / 2, H, z], r * 1.3, wire, 'tray_top_rail', 'metal', 6); K.bar(g, [-W / 2, .004, z], [W / 2, .004, z], r, wire, 'tray_bottom_rail', 'metal', 6); }
  for (const x of [-W / 2, W / 2]) { K.bar(g, [x, H, -D / 2], [x, H, D / 2], r * 1.3, wire, 'tray_top_rail', 'metal', 6); K.bar(g, [x, .004, -D / 2], [x, .004, D / 2], r, wire, 'tray_bottom_rail', 'metal', 6); }
  for (let i = 0; i <= 12; i++) { const x = -W / 2 + i * W / 12; for (const z of [-D / 2, D / 2]) K.bar(g, [x, .004, z], [x, H, z], r * .8, wire, 'tray_upright', 'metal', 5); K.bar(g, [x, .003, -D / 2], [x, .003, D / 2], r * .8, wire, 'tray_floor_wire', 'metal', 5); }
  for (let i = 0; i <= 8; i++) { const z = -D / 2 + i * D / 8; for (const x of [-W / 2, W / 2]) K.bar(g, [x, .004, z], [x, H, z], r * .8, wire, 'tray_upright', 'metal', 5); }
  for (const x of [-W / 2 + .01, W / 2 - .01]) for (const z of [-D / 2 + .01, D / 2 - .01]) K.add(g, new THREE.CylinderGeometry(.006, .006, .004, 8), K.toon('#2a2a2e'), 'tray_rubber_foot', 'rubber', [x, .0, z]);
  // the cards inside (fill)
  const stack = buildCardStack(THREE, ctx, { count: 60, height: .025, doodle: false, topTab: ' ' }); stack.group.rotation.y = Math.PI / 2; stack.group.scale.set(1, 1, 1); stack.group.position.set(0, .005, 0);
  stack.group.children.forEach(c => { if (c.name === 'top_tab_180_knees') c.visible = false; }); g.add(stack.group); const setFill = u => { stack.group.visible = u > 0; stack.group.scale.y = Math.max(.01, u * 2.2); }; setFill(opts.fill ?? 0);
  // the label holder on the front lip: a steel frame with the card label in it
  const col = { scrape: COL.trayBlue, rinse: COL.trayAqua, trick: COL.trayPurple }[kind];
  const lab = K.tex('tray_label_' + kind + (opts.note ? 'n' : ''), 512, 224, (c, w, h) => { c.fillStyle = '#fbf7ea'; c.fillRect(0, 0, w, h); c.fillStyle = col; c.fillRect(0, 0, w, 30); c.fillRect(0, h - 14, w, 14);
    c.strokeStyle = COL.ink; c.fillStyle = COL.ink; c.lineWidth = 9; c.lineCap = 'round'; c.lineJoin = 'round';
    if (kind === 'scrape') { c.beginPath(); c.moveTo(60, 170); c.lineTo(150, 80); c.stroke(); c.fillStyle = '#9aa4b4'; c.beginPath(); c.moveTo(140, 70); c.lineTo(200, 60); c.lineTo(190, 110); c.closePath(); c.fill(); c.stroke(); for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(196, 66 + i * 12); c.lineTo(212, 64 + i * 12); c.stroke(); } }
    if (kind === 'rinse') { c.fillStyle = '#3aa0e8'; c.beginPath(); c.moveTo(130, 50); c.bezierCurveTo(90, 120, 80, 150, 130, 185); c.bezierCurveTo(180, 150, 170, 120, 130, 50); c.fill(); c.stroke(); c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(115, 140, 8, 16, -.3, 0, 7); c.fill(); }
    if (kind === 'trick') { c.fillStyle = '#1b1b22'; c.fillRect(70, 70, 80, 80); c.fillRect(45, 145, 130, 14); c.fillStyle = COL.trayPurple; c.fillRect(70, 128, 80, 14);   // magician top hat + purple band
      for (const [x, y] of [[48, 70], [176, 82], [160, 40]]) { c.fillStyle = '#f2c230'; c.beginPath(); for (let i = 0; i < 10; i++) { const an = i * Math.PI / 5, rr = i % 2 ? 6 : 14; c.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); } c.fill(); }
      txt(c, '?', 112, 52, 'bold 54px ' + HAND, COL.ink); txt(c, 'PRETEND SURGERY', w / 2, 188, 'bold 34px ' + SANS, COL.ink); }
    txt(c, '60', kind === 'trick' ? 360 : 340, kind === 'trick' ? 100 : 118, 'bold 120px ' + SANS, COL.ink); });
  const holder = new THREE.Group(); holder.name = 'tray_label_holder'; holder.position.set(0, H * .55, D / 2 + .006); g.add(holder);
  K.box(holder, [.124, .058, .003], wire, 'label_holder_frame', 'metal', [0, 0, -.002]); K.add(holder, new THREE.PlaneGeometry(.118, .052), K.paper(lab), 'tray_label', 'paper', [0, 0, .0005]);
  if (kind === 'trick' && opts.note) { const n = buildStickyNote(THREE, ctx, { size: .05 }); n.group.position.set(-.035, .005, .003); n.group.rotation.z = .12; holder.add(n.group); }
  return done(THREE, g, K, { grip: [0, H, D / 2], anchors: { label: [0, H * .55, D / 2 + .008], cards_top: [0, .03, 0], drop: [0, .12, 0], grip_left: [-W / 2, H, 0], grip_right: [W / 2, H, 0] }, setFill, kind });
}

// ================================================================ THE STICKY NOTE (rows 16-17, 23): canary-yellow pad note, a big "?" and a drawn head, a curled lower corner.
// opts.size (0.076 m square), curl 0..1. Face +Z; grip/tip = the lower-right corner (the peel, row 23).
export function buildStickyNote(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(), S = opts.size ?? .076; g.name = 'sticky_note_q';
  const t = K.tex('sticky_q', 256, 256, (c, w, h) => { c.fillStyle = '#ffe866'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(200,160,0,.25)'; c.fillRect(0, 0, w, 34);   // the glue band
    c.strokeStyle = COL.ink; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.arc(84, 150, 44, 0, 7); c.stroke();   // the head
    c.beginPath(); c.moveTo(60, 196); c.quadraticCurveTo(84, 230, 112, 196); c.stroke(); c.fillStyle = COL.ink; c.beginPath(); c.arc(70, 142, 5, 0, 7); c.arc(98, 142, 5, 0, 7); c.fill();
    c.beginPath(); c.moveTo(70, 172); c.quadraticCurveTo(84, 164, 98, 172); c.stroke();   // a doubtful mouth
    txt(c, '?', 182, 140, 'bold 150px ' + HAND, COL.ink); });
  const geo = new THREE.PlaneGeometry(S, S, 8, 8), P = geo.attributes.position, cu = opts.curl ?? .6;
  for (let i = 0; i < P.count; i++) { const x = P.getX(i) / S + .5, y = .5 - P.getY(i) / S; const k = Math.max(0, x + y - 1.3); P.setZ(i, cu * k * k * S * 1.6); } geo.computeVertexNormals();
  K.add(g, geo, K.paper(t, { side: THREE.DoubleSide }), 'sticky_note', 'paper');
  return done(THREE, g, K, { grip: [S * .45, -S * .45, .006], tip: [S * .45, -S * .45, .006], anchors: { glue_top: [0, S * .42, 0] } });
}

// ================================================================ THE CLIPBOARD + CONSENT FORM + PEN (rows 24-25, the POV top-down macro)
// buildClipboard: masonite board, steel lever clip with two rivets, the form "CONSENT TO PARTICIPATE" in type (no hospital name), 6 typed lines, three tick boxes,
//   the box "MAY BE PRETEND SURGERY" big and bold, the signature line. opts.tick 0..1 (the tick drawn in pen), signed true. Face +Z, clip at +Y.
//   Anchors: tick_box (centre of the big box: the pen tip_at target), sign_line, clip, grip (left edge, the far fist holds it).
export function buildClipboard(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'clipboard_consent';
  const W = .229, H = .318, board = K.mat('wood', '#8a5a32', { size: .2 });
  K.box(g, [W, H, .004], board, 'clipboard_board', 'wood', [0, 0, -.002]);
  const form = K.tex('consent_form', 512, 680, (c, w, h) => { c.fillStyle = '#fbfaf4'; c.fillRect(0, 0, w, h);
    txt(c, 'CONSENT TO TAKE PART', w / 2, 110, 'bold 34px ' + SANS); txt(c, 'IN A KNEE STUDY', w / 2, 150, 'bold 30px ' + SANS); c.fillStyle = '#3a3a44';
    for (let i = 0; i < 6; i++) c.fillRect(50, 192 + i * 22, i === 5 ? 260 : 410, 6);
    for (let i = 0; i < 2; i++) { c.strokeStyle = COL.ink; c.lineWidth = 3; c.strokeRect(54, 340 + i * 42, 22, 22); c.fillStyle = '#3a3a44'; c.fillRect(92, 348 + i * 42, 240, 6); }
    c.lineWidth = 6; c.strokeRect(46, 440, 64, 64); txt(c, 'MAY BE', 135, 452, 'bold 34px ' + SANS, COL.ink, 'left'); txt(c, 'PRETEND SURGERY', 135, 494, 'bold 40px ' + SANS, COL.ink, 'left');
    c.fillStyle = COL.ink; c.fillRect(50, 600, 300, 3); txt(c, 'SIGNATURE', 50, 620, 'bold 18px ' + SANS, '#5a5a64', 'left'); txt(c, 'DATE  ___ / ___ / 1994', 370, 612, 'bold 16px ' + SANS, '#5a5a64', 'left');
    if (opts.signed !== false) { c.strokeStyle = '#1d3f8a'; c.lineWidth = 4; c.beginPath(); c.moveTo(60, 590); c.bezierCurveTo(90, 540, 110, 600, 140, 570); c.bezierCurveTo(170, 540, 180, 600, 220, 575); c.lineTo(280, 585); c.stroke(); } });
  const fw = .216, fh = .287; K.add(g, new THREE.PlaneGeometry(fw, fh), K.paper(form), 'consent_form', 'paper', [0, -.012, .001]);
  for (let i = 0; i < 3; i++) K.box(g, [fw - .004, fh - .004, .0006], K.toon(['#f4f2ea', '#ece8dc', '#e4e0d2'][i]), 'form_sheet_under', 'paper', [.001 * i, -.013 - .001 * i, .0002 - i * .0003]);
  // tick box centre on the board: form px (78, 472) of 512 x 680
  const tb = [-fw / 2 + fw * 78 / 512, -.012 + fh / 2 - fh * 472 / 680, .0015];
  const tickPts = [[-.006, .0, 0], [-.0015, -.006, 0], [.009, .009, 0]].map(p => new THREE.Vector3(tb[0] + p[0] * 1.5, tb[1] + p[1] * 1.5, tb[2]));
  const tickCurve = new THREE.CatmullRomCurve3([tickPts[0], tickPts[0].clone().lerp(tickPts[1], .5), tickPts[1], tickPts[1].clone().lerp(tickPts[2], .5), tickPts[2]], false, 'centripetal');
  const tick = K.add(g, new THREE.TubeGeometry(tickCurve, 30, .0011, 5), K.basic('#1d3f8a'), 'tick_mark', 'ink'); const tickN = tick.geometry.index.count;
  const setTick = u => { tick.geometry.setDrawRange(0, Math.floor(tickN * Math.max(0, Math.min(1, u)) / 6) * 6); tick.visible = u > 0; }; setTick(opts.tick ?? 0);
  // the lever clip: a steel spring plate, the lever, two rivets, a hanging hole
  const steel = K.metal('steel', '#c0c8d4', .22); K.box(g, [.1, .03, .006], steel, 'clip_plate', 'metal', [0, H / 2 - .02, .004]); K.bar(g, [-.045, H / 2 - .008, .009], [.045, H / 2 - .008, .009], .004, steel, 'clip_lever_roll', 'metal', 10);
  K.box(g, [.07, .012, .003], steel, 'clip_lever', 'metal', [0, H / 2 - .002, .014], [-.5, 0, 0]); for (const x of [-.035, .035]) K.add(g, new THREE.SphereGeometry(.003, 8, 6), K.metal('steel', '#9aa4b4', .3), 'clip_rivet', 'metal', [x, H / 2 - .024, .0075]);
  K.add(g, new THREE.CircleGeometry(.004, 10), K.basic('#2a1a10'), 'clipboard_hang_hole', 'wood', [0, H / 2 - .006, .0003]);
  return done(THREE, g, K, { grip: [-W / 2, 0, 0], anchors: { tick_box: tb, tick_end: [tickPts[2].x, tickPts[2].y, tickPts[2].z], sign_line: [-.03, -.012 + fh / 2 - fh * 590 / 680, .002], clip: [0, H / 2 - .01, .01] }, setTick });
}
// THE BALLPOINT PEN (rows 24-25; also in the surgeon's chest pocket): 1990s click pen, navy barrel, steel clip + click button, grip rings. +Y = point. 0.14 m.
export function buildPen(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'ballpoint_pen';
  const barrel = K.toon(opts.color || '#1d3f8a'), steel = K.metal('steel', '#d0d6e0', .18), black = K.toon('#1b1b22');
  K.bar(g, [0, .02, 0], [0, .13, 0], .0045, barrel, 'pen_barrel', 'plastic', 14); K.bar(g, [0, .0, 0], [0, .02, 0], .0045, steel, 'pen_nose_cone', 'metal', 14, .0015);
  K.bar(g, [0, -.004, 0], [0, .0, 0], .0012, steel, 'pen_tip', 'metal', 8, .0004); for (let i = 0; i < 6; i++) K.add(g, new THREE.TorusGeometry(.0047, .0006, 4, 14), black, 'pen_grip_ring', 'rubber', [0, .025 + i * .004, 0], [Math.PI / 2, 0, 0]);
  K.bar(g, [0, .13, 0], [0, .142, 0], .0028, steel, 'pen_click_button', 'metal', 10); K.box(g, [.003, .05, .0015], steel, 'pen_clip', 'metal', [0, .11, .0055]); K.add(g, new THREE.SphereGeometry(.002, 6, 4), steel, 'pen_clip_ball', 'metal', [0, .086, .006]);
  K.box(g, [.0008, .06, .0002], K.basic('#ffffff'), 'pen_glint', 'plastic', [-.0025, .08, .0042]);
  return done(THREE, g, K, { grip: [0, .03, 0], tip: [0, -.004, 0] });
}
// THE SEALED ENVELOPE (row 26): manila 9 x 12 in, flap glued + string-and-button closure wound, typed "GROUP" + hand "?" + "DO NOT OPEN". grip = top edge. Face +Z.
export function buildEnvelope(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'sealed_envelope';
  const W = .229, H = .305, t = K.tex('envelope', 384, 512, (c, w, h) => { c.fillStyle = COL.manila; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(150,110,50,.2)'; for (let i = 0; i < 300; i++) c.fillRect(K.rr(0, w), K.rr(0, h), 2, 2);
    txt(c, 'GROUP', w / 2, 230, 'bold 44px ' + SANS); txt(c, '?', w / 2, 310, 'bold 110px ' + HAND); txt(c, 'DO NOT OPEN', w / 2, 420, 'bold 34px ' + SANS); c.strokeStyle = COL.ink; c.lineWidth = 3; c.strokeRect(70, 380, w - 140, 70); });
  K.box(g, [W, H, .004], K.toon(COL.manila), 'envelope_body', 'paper', [0, 0, -.002]); K.add(g, new THREE.PlaneGeometry(W, H), K.paper(t), 'envelope_front', 'paper', [0, 0, .0005]);
  const flap = new THREE.Shape(); flap.moveTo(-W / 2, 0); flap.lineTo(W / 2, 0); flap.lineTo(W * .1, -.07); flap.lineTo(-W * .1, -.07); flap.closePath();
  K.add(g, new THREE.ShapeGeometry(flap), K.toon('#dcc690'), 'envelope_flap_glued', 'paper', [0, H / 2, .001]);
  const btn = K.toon('#a88a5a'); for (const y of [H / 2 - .06, H / 2 - .12]) { K.add(g, new THREE.CylinderGeometry(.009, .009, .002, 14), btn, 'envelope_button', 'paper', [0, y, .002], [Math.PI / 2, 0, 0]); }
  K.tube(g, [[0, H / 2 - .06, .003], [.006, H / 2 - .09, .004], [0, H / 2 - .12, .003], [-.006, H / 2 - .09, .004], [0, H / 2 - .06, .0035]], .0008, K.toon('#f4ecd8'), 'envelope_string_wound', 'cloth', 20, 4);
  return done(THREE, g, K, { grip: [0, H / 2, 0], tip: [0, -H / 2, 0] });
}

// ================================================================ THE WOODEN CANE (rows 24, 31 EXTREME): crook-handle walnut cane, brass collar, grey rubber ferrule with tread rings.
// opts.cobweb 0..1 (0 none, 1 = the hammock: a web slung from crook to shaft, 30 silk threads), spider true (asleep in the hammock, Zz), dust 0..1 (snow-like on the top surfaces).
// Origin = ferrule tip (floor); +Y up; 0.91 m. grip = the crook. Hangs on a newel post: put anchor crook_inner on the post top.
export function buildCane(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'wooden_cane';
  const wood = K.mat('wood', '#6a3e1e', { size: .1 }), brass = K.metal('brass', '#d8a83c', .25), rub = K.toon('#4a4e56');
  K.bar(g, [0, .04, 0], [0, .8, 0], .0115, wood, 'cane_shaft', 'wood', 14, .0125);
  const crook = []; for (let i = 0; i <= 14; i++) { const an = i / 14 * Math.PI; crook.push([-.055 + Math.cos(an) * .055, .8 + Math.sin(an) * .055, 0]); } crook.push([-.11, .76, 0]);
  K.tube(g, crook, .0125, wood, 'cane_crook', 'wood', 30, 12); K.add(g, new THREE.SphereGeometry(.0125, 10, 8), wood, 'cane_crook_end', 'wood', [-.11, .76, 0]);
  for (let i = 0; i < 9; i++) K.bar(g, [0, .1 + i * .08, .011], [0, .14 + i * .08, .0115], .0012, K.toon('#4a2a12'), 'cane_wood_grain', 'wood', 4);
  K.bar(g, [0, .79, 0], [0, .81, 0], .0135, brass, 'cane_brass_collar', 'metal', 16); K.bar(g, [0, 0, 0], [0, .045, 0], .015, rub, 'cane_rubber_ferrule', 'rubber', 16, .0135);
  for (let i = 0; i < 3; i++) K.add(g, new THREE.TorusGeometry(.0152, .0012, 4, 16), K.toon('#2e3036'), 'ferrule_tread_ring', 'rubber', [0, .008 + i * .008, 0], [Math.PI / 2, 0, 0]);
  const web = new THREE.Group(); web.name = 'cobweb_hammock'; g.add(web); const silk = new THREE.MeshBasicMaterial({ color: '#f4f6fa', transparent: true, opacity: .85 });
  const A = [[-.11, .76, 0], [-.105, .82, 0], [-.07, .855, 0]], Bp = [[0, .55, 0], [0, .62, 0], [0, .7, 0]];
  for (let i = 0; i < 18; i++) { const u = i / 17, a0 = new THREE.Vector3(...A[0]).lerp(new THREE.Vector3(...A[2]), u), b0 = new THREE.Vector3(...Bp[0]).lerp(new THREE.Vector3(...Bp[2]), u), mid = a0.clone().lerp(b0, .5).add(new THREE.Vector3(-.03, -.05, .035 * Math.sin(u * 3)));
    K.tube(web, [a0.toArray(), mid.toArray(), b0.toArray()], .0006, silk, 'web_strand', 'cloth', 10, 3); }
  for (let j = 1; j < 7; j++) { const pts = []; for (let i = 0; i < 18; i++) { const u = i / 17, w = j / 7, a0 = new THREE.Vector3(...A[0]).lerp(new THREE.Vector3(...A[2]), u), b0 = new THREE.Vector3(...Bp[0]).lerp(new THREE.Vector3(...Bp[2]), u);
    const p = a0.clone().lerp(b0, w).add(new THREE.Vector3(-.03, -.05, .035 * Math.sin(u * 3)).multiplyScalar(Math.sin(w * Math.PI))); pts.push(p.toArray()); } K.tube(web, pts, .0005, silk, 'web_cross_thread', 'cloth', 30, 3); }
  const hamM = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .22, side: THREE.DoubleSide, depthWrite: false });
  const hamG = new THREE.PlaneGeometry(1, 1, 10, 10), HP = hamG.attributes.position; for (let i = 0; i < HP.count; i++) { const u = HP.getX(i) + .5, w = HP.getY(i) + .5, a0 = new THREE.Vector3(...A[0]).lerp(new THREE.Vector3(...A[2]), u), b0 = new THREE.Vector3(...Bp[0]).lerp(new THREE.Vector3(...Bp[2]), u);
    const p = a0.clone().lerp(b0, w).add(new THREE.Vector3(-.03, -.05, .035 * Math.sin(u * 3)).multiplyScalar(Math.sin(w * Math.PI))); HP.setXYZ(i, p.x, p.y, p.z); } hamG.computeVertexNormals();
  K.add(web, hamG, hamM, 'web_hammock_sheet', 'cloth', null, null, false);
  // the sleeping spider: round body + head, 8 bent legs tucked, closed eyes, a tiny night cap? no: three drawn "z"
  const sp = new THREE.Group(); sp.name = 'sleeping_spider'; sp.position.set(-.085, .66, .03); web.add(sp); const blk = K.toon('#2a2430');
  K.add(sp, new THREE.SphereGeometry(.009, 12, 10), blk, 'spider_body', 'skin').scale.set(1, .8, 1.2); K.add(sp, new THREE.SphereGeometry(.005, 10, 8), blk, 'spider_head', 'skin', [.009, .002, 0]);
  for (let i = 0; i < 8; i++) { const s = i < 4 ? 1 : -1, k = i % 4, z = s * .004, x = -.004 + k * .003; K.tube(sp, [[x, 0, z], [x + .002, .006, z + s * .008], [x + .004, -.004, z + s * .013]], .0008, blk, 'spider_leg', 'skin', 8, 3); }
  for (const z of [-.002, .002]) K.box(sp, [.0005, .0012, .0026], K.basic('#ffffff'), 'spider_closed_eye', 'skin', [.0135, .003, z]);
  const zT = K.tex('zzz', 128, 128, (c, w, h) => { c.clearRect(0, 0, w, h); txt(c, 'z', 30, 96, 'bold 40px ' + HAND); txt(c, 'z', 64, 64, 'bold 54px ' + HAND); txt(c, 'Z', 100, 28, 'bold 64px ' + HAND); });
  K.add(sp, new THREE.PlaneGeometry(.04, .04), new THREE.MeshBasicMaterial({ map: zT, transparent: true, depthWrite: false }), 'spider_zzz', 'sign', [.02, .03, .01], null, false);
  const dust = new THREE.Group(); dust.name = 'cane_dust'; g.add(dust); const dm = K.toon('#eeeae2');
  for (let i = 0; i < 70; i++) { const an = K.rr(0, Math.PI); K.add(dust, new THREE.SphereGeometry(K.rr(.0015, .0035), 5, 4), dm, 'dust_fleck', 'cloth', [-.055 + Math.cos(an) * .055 + K.rr(-.003, .003), .8 + Math.sin(an) * .055 + .011, K.rr(-.008, .008)]); }
  for (let i = 0; i < 24; i++) K.add(dust, new THREE.SphereGeometry(K.rr(.0015, .003), 5, 4), dm, 'dust_fleck', 'cloth', [K.rr(-.005, .005), K.rr(.3, .78), .011]);
  const setState = st => { const S = { cobweb: opts.cobweb ?? 0, spider: opts.spider ?? true, dust: opts.dust ?? 0, ...st }; web.visible = S.cobweb > 0; web.scale.setScalar(1); hamM.opacity = .22 * S.cobweb; silk.opacity = .85 * Math.min(1, S.cobweb * 1.5);
    sp.visible = S.cobweb > 0 && S.spider !== false; dust.visible = S.dust > 0; dust.children.forEach((d, i) => { d.visible = i / dust.children.length < S.dust; }); };
  setState({});
  return done(THREE, g, K, { grip: [-.055, .855, 0], tip: [0, 0, 0], anchors: { crook_inner: [-.055, .8, 0], spider: [-.085, .66, .03] }, setState });
}

// ================================================================ THE PAIN DIAL (row 34; the ONE red): a 1990s wall gauge, chrome bezel on 4 screws, white face, arc in three zones
// (green "LOW" / yellow / RED "HIGH" #e01e2a), ticks 0-10, the word "PAIN", the black needle on a steel hub. opts.value 0..1 (0 = green end, 1 = red end) or needleDeg.
// Face +Z, origin = dial centre, 0.36 m across. setNeedle(v). Anchors: needle_tip, centre.
export function buildPainDial(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(), R = .18; g.name = 'pain_dial';
  const A0 = Math.PI * 1.25, A1 = -Math.PI * .25;   // sweep 270 deg, value 0 at lower left
  const face = K.tex('pain_dial_face', 512, 512, (c, w, h) => { const cx = w / 2, cy = h / 2; c.fillStyle = '#fbf9f2'; c.beginPath(); c.arc(cx, cy, 250, 0, 7); c.fill();
    const zone = (u0, u1, col) => { c.strokeStyle = col; c.lineWidth = 46; c.beginPath(); c.arc(cx, cy, 190, -(A0 + (A1 - A0) * u0), -(A0 + (A1 - A0) * u1), false); c.stroke(); };
    zone(0, .42, '#2aa04a'); zone(.42, .68, '#f2c230'); zone(.68, 1, PAIN_RED);
    c.strokeStyle = COL.ink; c.fillStyle = COL.ink; for (let i = 0; i <= 50; i++) { const an = -(A0 + (A1 - A0) * i / 50), L = i % 5 ? 14 : 30; c.lineWidth = i % 5 ? 3 : 6; c.beginPath(); c.moveTo(cx + Math.cos(an) * 160, cy + Math.sin(an) * 160); c.lineTo(cx + Math.cos(an) * (160 - L), cy + Math.sin(an) * (160 - L)); c.stroke(); }
    for (let i = 0; i <= 10; i++) { const an = -(A0 + (A1 - A0) * i / 10); txt(c, String(i), cx + Math.cos(an) * 112, cy + Math.sin(an) * 112, 'bold 30px ' + SANS); }
    txt(c, 'PAIN', cx, cy + 120, 'bold 60px ' + SANS); txt(c, 'LOW', cx - 150, cy + 210, 'bold 24px ' + SANS, '#1e6a32'); txt(c, 'HIGH', cx + 150, cy + 210, 'bold 24px ' + SANS, COL.ink); });
  K.add(g, new THREE.CircleGeometry(R, 48), K.paper(face, { roughness: .6 }), 'dial_face', 'paper', [0, 0, .009]);
  K.add(g, new THREE.CylinderGeometry(R + .01, R + .016, .03, 48), K.toon('#e8e4da'), 'dial_case', 'plastic', [0, 0, -.01], [Math.PI / 2, 0, 0]);
  K.add(g, new THREE.TorusGeometry(R + .006, .009, 10, 48), K.metal('steel', '#d8dee8', .12, 1.4), 'dial_chrome_bezel', 'metal', [0, 0, .01]);
  K.add(g, new THREE.CircleGeometry(R, 48), new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: .08, roughness: .02, clearcoat: 1 }), 'dial_glass', 'glass', [0, 0, .016], null, false);
  K.add(g, new THREE.PlaneGeometry(.03, .22), K.basic('#ffffff', { transparent: true, opacity: .25, depthWrite: false }), 'dial_glass_glint', 'glass', [-.07, .04, .017], [0, 0, -.6], false);
  for (let i = 0; i < 4; i++) { const an = Math.PI / 4 + i * Math.PI / 2; K.screw(g, [Math.cos(an) * (R + .028), Math.sin(an) * (R + .028), -.004], [Math.PI / 2, 0, 0], .005); }
  K.box(g, [.05, .05, .02], K.metal('steel', '#9aa4b4', .3), 'dial_wall_bracket', 'metal', [0, R + .03, -.02]);
  for (let i = 0; i < 4; i++) { const an = Math.PI / 4 + i * Math.PI / 2; K.box(g, [.04, .012, .02], K.toon('#e8e4da'), 'dial_mount_lug', 'plastic', [Math.cos(an) * (R + .022), Math.sin(an) * (R + .022), -.012], [0, 0, an]); }
  const needle = new THREE.Group(); needle.name = 'dial_needle'; needle.position.set(0, 0, .012); g.add(needle);
  const nS = new THREE.Shape(); nS.moveTo(-.008, -.025); nS.lineTo(.008, -.025); nS.lineTo(.0025, .15); nS.lineTo(-.0025, .15); nS.closePath();
  K.add(needle, new THREE.ShapeGeometry(nS), K.toon('#1b1b22'), 'needle_blade', 'metal'); K.add(g, new THREE.CylinderGeometry(.016, .016, .01, 18), K.metal('steel', '#c9d0dc', .2), 'needle_hub', 'metal', [0, 0, .014], [Math.PI / 2, 0, 0]);
  const tipV = new THREE.Vector3(0, .15, .011);
  const setNeedle = v => { const an = A0 + (A1 - A0) * Math.max(0, Math.min(1, v)); needle.rotation.z = an - Math.PI / 2; tipV.set(Math.cos(an) * .15, Math.sin(an) * .15, .011); };
  setNeedle(opts.needleDeg != null ? (A0 - opts.needleDeg * Math.PI / 180) / (A0 - A1) : (opts.value ?? .9));
  return done(THREE, g, K, { anchors: { centre: [0, 0, .02], needle_tip: tipV }, setNeedle });
}

// ================================================================ THE LIGHT BOX + THREE PAIN CHARTS (rows 36-38; the ONE red bars) + THE RULER
// 1990s X-ray viewer, steel case 0.9 x 0.5, cool glowing panel, three clipped chart films, each: the tray icon (scraper / drop / "?" hat) under its bar, an axis "PAIN",
// grid lines, ONE red bar #e01e2a of height bars[i] (0..1 of the chart). opts.bars [.55, .55, .55], glow true. setBars([..]). Face +Z, origin = bottom centre.
// Anchors: bar_top_1..3 (centre of each bar top on the glass; the ruler lies across these), ruler_rest (middle of the three tops).
export function buildLightBox(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'light_box_charts';
  const W = .9, H = .5, steel = K.metal('steel', '#b8c0cc', .35), panel = K.tex('lightbox_panel', 64, 64, (c, w, h) => { c.fillStyle = '#eef6ff'; c.fillRect(0, 0, w, h); });
  K.box(g, [W + .04, H + .04, .08], steel, 'lightbox_case', 'metal', [0, H / 2 + .02, -.04]); K.add(g, new THREE.PlaneGeometry(W, H), K.glow(panel), 'lightbox_glow_panel', 'lamp', [0, H / 2 + .02, .001], null, false);
  K.box(g, [.05, .02, .012], K.toon('#2a2a2e'), 'lightbox_switch', 'plastic', [W / 2 - .04, .005, .006]); K.box(g, [W + .04, .006, .02], steel, 'lightbox_film_clip_rail', 'metal', [0, H + .015, .012]);
  const bars = (opts.bars || [.55, .55, .55]).slice(), icons = ['scrape', 'rinse', 'trick'], barMeshes = [], cw = .26, ch = .44, tops = [];
  icons.forEach((kind, i) => { const x = (i - 1) * .29;
    const t = K.tex('chart_' + kind, 256, 432, (c, w, h) => { c.fillStyle = 'rgba(250,252,255,1)'; c.fillRect(0, 0, w, h); c.strokeStyle = '#9ab0c8'; c.lineWidth = 2; for (let y = 60; y < 360; y += 30) { c.beginPath(); c.moveTo(50, y); c.lineTo(w - 20, y); c.stroke(); }
      c.strokeStyle = COL.ink; c.lineWidth = 5; c.beginPath(); c.moveTo(50, 40); c.lineTo(50, 360); c.lineTo(w - 16, 360); c.stroke(); c.save(); c.translate(22, 200); c.rotate(-Math.PI / 2); txt(c, 'PAIN', 0, 0, 'bold 26px ' + SANS); c.restore();
      c.lineWidth = 6; c.lineCap = 'round'; c.fillStyle = COL.ink;
      if (kind === 'scrape') { c.beginPath(); c.moveTo(110, 420); c.lineTo(150, 385); c.stroke(); c.beginPath(); c.moveTo(145, 378); c.lineTo(175, 374); c.lineTo(170, 398); c.closePath(); c.fill(); }
      if (kind === 'rinse') { c.fillStyle = '#3aa0e8'; c.beginPath(); c.moveTo(150, 372); c.bezierCurveTo(130, 400, 128, 414, 150, 426); c.bezierCurveTo(172, 414, 170, 400, 150, 372); c.fill(); }
      if (kind === 'trick') { c.fillRect(132, 380, 36, 34); c.fillRect(120, 410, 60, 8); txt(c, '?', 200, 396, 'bold 40px ' + HAND); }
      txt(c, '60', 70, 400, 'bold 30px ' + SANS); });
    K.add(g, new THREE.PlaneGeometry(cw, ch), K.glow(t), 'pain_chart_' + kind, 'paper', [x, H / 2 + .02, .004], null, false);
    K.box(g, [.05, .015, .01], steel, 'chart_clip', 'metal', [x, H + .01, .012]);
    const bw = .09, base = H / 2 + .02 - ch / 2 + ch * (432 - 360) / 432, maxH = ch * 300 / 432;
    const bar = K.add(g, new THREE.BoxGeometry(bw, 1, .004), K.basic(PAIN_RED, { toneMapped: false }), 'pain_bar_red_' + (i + 1), 'chart', [x + .02, base, .009], null, false); barMeshes.push([bar, base, maxH]);
    tops.push(new THREE.Vector3(x + .02, base, .012)); });
  const setBars = arr => arr.forEach((v, i) => { const [m, base, maxH] = barMeshes[i], h = Math.max(.002, v * maxH); m.scale.y = h; m.position.y = base + h / 2; tops[i].y = base + h; });
  setBars(bars);
  const rest = new THREE.Vector3(); rest.copy(tops[0]).add(tops[1]).add(tops[2]).multiplyScalar(1 / 3);
  return done(THREE, g, K, { anchors: { bar_top_1: tops[0], bar_top_2: tops[1], bar_top_3: tops[2], ruler_rest: rest }, setBars });
}
// THE RULER (row 37): a 1 m steel rule (cm ticks, numbers every 10, a hang hole); lies across the three bar tops "like a shelf". +Y = length (held3d point),
// grip = the 5 cm end, tip = the far end. Lettering black (no red), no maker's name.
export function buildRuler(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(), L = opts.length ?? 1.0; g.name = 'steel_ruler';
  const t = K.tex('ruler_' + L, 2048, 64, (c, w, h) => { c.fillStyle = '#e4e8ee'; c.fillRect(0, 0, w, h); c.fillStyle = COL.ink; const n = Math.round(L * 100);
    for (let i = 0; i <= n; i++) { const x = 8 + i * (w - 16) / n, l = i % 10 ? (i % 5 ? 14 : 24) : 36; c.fillRect(x - 1, 0, 2, l); if (i % 10 === 0 && i) txt(c, String(i), x, 50, 'bold 20px ' + SANS); } });
  const steel = K.metal('steel', '#d4dae4', .15, 1.4);
  K.box(g, [.03, L, .0012], steel, 'ruler_body', 'metal', [0, L / 2, 0]); K.box(g, [.035, L + .005, .0008], K.basic(COL.ink), 'ruler_ink_edge', 'metal', [0, L / 2, -.0011]);   // the ink outline: the steel reads on a white light box const f = K.add(g, new THREE.PlaneGeometry(.028, L), K.paper(t, { metalness: .4, roughness: .35 }), 'ruler_scale_face', 'metal', [0, L / 2, .0007]); f.material.map.center.set(.5, .5); f.material.map.rotation = Math.PI / 2;
  K.add(g, new THREE.CircleGeometry(.004, 12), K.basic('#2a2a2e'), 'ruler_hang_hole', 'metal', [0, L - .015, .0008]);
  K.box(g, [.002, L * .9, .0002], K.basic('#ffffff', { transparent: true, opacity: .6 }), 'ruler_edge_streak', 'metal', [.013, L / 2, .0009]);
  return done(THREE, g, K, { grip: [0, .05, 0], tip: [0, L, 0], anchors: { centre: [0, L / 2, 0] } });
}

// THE RULER AS A SHELF (row 37): lay a built ruler across the three red bar tops of a built light box (child of the light box, so any yaw / place works).
//   Its lower long edge rests ON the highest bar top, 1.4 cm in front of the panel, scale face to the lens. Call after place() of the light box; fills ru.plan.
export function restRulerOnBars(THREE, lb, ru) {
  const T = [lb.anchors.bar_top_1, lb.anchors.bar_top_2, lb.anchors.bar_top_3], top = Math.max(...T.map(v => v.y)), cx = (T[0].x + T[2].x) / 2, L = ru.tip.y;
  ru.group.position.set(cx - L / 2, top + .0155, .014); ru.group.rotation.set(0, 0, -Math.PI / 2); lb.group.add(ru.group); lb.group.updateMatrixWorld(true);
  const T2B = v => [v.x, -v.z, v.y]; ru.plan = {}; for (const [k, v] of Object.entries(ru.anchors || {})) ru.plan[k] = T2B(ru.group.localToWorld(v.clone()));
  ru.plan.grip = T2B(ru.group.localToWorld(ru.grip.clone())); ru.plan.tip = T2B(ru.group.localToWorld(ru.tip.clone())); return ru;
}

// ================================================================ THE SCOPE CASE (rows 38-39): black hard case with grey foam, the scope cut-out (scope shiny inside), two steel latches,
// a carry handle, 4 corner caps. opts.lid 0..1 (0 shut, 1 = open 105 deg), puff 0..1 (dust puff ring out of the seam when it shuts, row 39). setLid(u), setPuff(u).
// Origin = base bottom centre; 0.52 x 0.12 x 0.24. Anchors: lid_front (the lid's front edge), seam, scope.
export function buildScopeCase(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'scope_case';
  const shell = K.mat('plastic', '#24262c'), foam = K.toon('#6a6e78'), steel = K.metal('steel', '#c9d0dc', .2), W = .52, D = .24, H = .07;
  K.box(g, [W, H, D], shell, 'case_base', 'plastic', [0, H / 2, 0]); K.box(g, [W - .02, .012, D - .02], foam, 'case_base_foam', 'cloth', [0, H - .004, 0]);
  for (const x of [-W / 2, W / 2]) for (const z of [-D / 2, D / 2]) K.box(g, [.03, .12, .03], K.toon('#3a3c44'), 'case_corner_cap', 'plastic', [x * .97, .06, z * .97]);
  // the scope lying in its cut-out: shiny rod + camera head
  const sc = new THREE.Group(); sc.name = 'case_scope'; sc.position.set(0, H + .004, 0); g.add(sc);
  K.box(sc, [.42, .004, .05], K.toon('#3a3e48'), 'foam_cutout_shadow', 'cloth', [0, .0, 0]);
  K.bar(sc, [-.06, .01, 0], [.18, .01, 0], .0035, K.metal('steel', '#e4e8f0', .08, 1.6), 'case_scope_rod', 'metal', 14); K.bar(sc, [-.16, .01, 0], [-.07, .01, 0], .017, K.toon('#2a2e36'), 'case_scope_camera', 'plastic', 18);
  K.bar(sc, [-.075, .01, 0], [-.06, .01, 0], .009, steel, 'case_scope_eyepiece', 'metal', 16);
  const lid = new THREE.Group(); lid.name = 'case_lid'; lid.position.set(0, H, -D / 2); g.add(lid);
  K.box(lid, [W, .05, D], shell, 'case_lid_shell', 'plastic', [0, .025, D / 2]); K.box(lid, [W - .02, .012, D - .02], foam, 'case_lid_foam_egg', 'cloth', [0, .004, D / 2]);
  for (let i = 0; i < 12; i++) for (let j = 0; j < 5; j++) K.add(lid, new THREE.SphereGeometry(.009, 6, 4), foam, 'lid_egg_crate', 'cloth', [-W / 2 + .03 + i * .04, -.002, .03 + j * .045]).scale.y = .5;
  K.bar(lid, [-.08, .06, D * .5], [.08, .06, D * .5], .009, K.toon('#2a2a30'), 'case_handle', 'rubber', 10); for (const x of [-.08, .08]) K.box(lid, [.02, .02, .03], K.toon('#2a2a30'), 'handle_post', 'plastic', [x, .052, D * .5]);
  for (const x of [-.15, .15]) { K.box(g, [.04, .03, .012], steel, 'case_latch', 'metal', [x, H, D / 2 + .006]); K.screw(g, [x, H - .02, D / 2 + .013], [Math.PI / 2, 0, 0], .003); }
  K.bar(g, [-W / 2 + .02, H, -D / 2 - .004], [W / 2 - .02, H, -D / 2 - .004], .005, steel, 'case_hinge_pin', 'metal', 10);
  const puff = new THREE.Group(); puff.name = 'case_dust_puff'; g.add(puff); const pm = new THREE.MeshLambertMaterial({ color: '#e8e0d0', transparent: true, opacity: .7, depthWrite: false });
  const blobs = []; for (let i = 0; i < 22; i++) { const x = K.rr(-W / 2, W / 2), side = i % 2 ? 1 : -1; blobs.push([K.add(puff, new THREE.SphereGeometry(K.rr(.015, .035), 10, 8), pm, 'dust_puff_blob', 'cloth', [x, H, 0], null, false), x, side, K.rr(.5, 1.2)]); }
  const setLid = u => { lid.rotation.x = -Math.max(0, Math.min(1, u)) * 1.83; };
  const setPuff = u => { puff.visible = u > 0 && u < 1; pm.opacity = .7 * (1 - u); blobs.forEach(([m, x, s, k]) => { m.position.set(x * (1 + u * .3), H + .02 + u * .08 * k, s * (D / 2 + u * .12 * k)); m.scale.setScalar(.4 + u * 1.2); }); };
  setLid(opts.lid ?? 1); setPuff(opts.puff ?? 0);
  return done(THREE, g, K, { grip: [0, H + .06, 0], anchors: { lid_front: [0, H + .05, D / 2], seam: [0, H, D / 2], scope: [0, H + .015, 0] }, setLid, setPuff });
}

// ================================================================ THE LETTER + THE RUBBER STAMP (rows 45-47; EXTREME 46: the paint-tin stamp)
// buildLetter: plain letter, no letterhead, no logo, no name: typed "RE: KNEE ARTHROSCOPY FOR ARTHRITIS", 2004 date, 12 typed lines, a folded crease.
//   opts.stamped 0..1 (the black stamp mark "NOT PAID" / "ARTHRITIS KNEE" in a double frame, slightly rotated), lifted 0..1 (paper corners curl up from the thump).
// Flat on a desk: face +Y. 0.216 x 0.279. Anchors: stamp_spot.
export function buildLetter(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'plain_letter';
  const W = .216, H = .279, t = K.tex('letter_plain', 512, 660, (c, w, h) => { c.fillStyle = '#fbfaf4'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a2a34';
    txt(c, 'November 2004', 60, 70, '20px "Courier New", monospace', '#2a2a34', 'left'); txt(c, 'RE: KNEE ARTHROSCOPY', 60, 130, 'bold 24px "Courier New", monospace', '#2a2a34', 'left'); txt(c, 'FOR ARTHRITIS', 60, 158, 'bold 24px "Courier New", monospace', '#2a2a34', 'left');
    for (let i = 0; i < 12; i++) c.fillRect(60, 210 + i * 24, i % 4 === 3 ? 230 : 390, 5); c.strokeStyle = 'rgba(140,130,110,.4)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, h / 3); c.lineTo(w, h / 3); c.moveTo(0, h * 2 / 3); c.lineTo(w, h * 2 / 3); c.stroke(); });
  const geo = new THREE.PlaneGeometry(W, H, 6, 9), P = geo.attributes.position; const lift = opts.lifted ?? 0;
  for (let i = 0; i < P.count; i++) { const x = P.getX(i) / (W / 2), y = P.getY(i) / (H / 2); P.setZ(i, .002 * Math.abs(Math.sin(y * Math.PI * 1.5)) + lift * .03 * Math.max(0, Math.abs(x * y) - .4)); } geo.computeVertexNormals();
  K.add(g, geo, K.paper(t, { side: THREE.DoubleSide }), 'letter_sheet', 'paper', [0, .001, 0], [-Math.PI / 2, 0, 0]);
  const mark = K.add(g, new THREE.PlaneGeometry(.15, .075), new THREE.MeshBasicMaterial({ map: STAMP_INK(K, false), transparent: true, alphaTest: .15, color: '#111111' }), 'stamp_mark_not_paid', 'ink', [.005, .004, .04], [-Math.PI / 2, 0, .08], false);
  const setStamped = u => { mark.visible = u > 0; mark.material.opacity = Math.min(1, u * 1.2); mark.material.transparent = true; }; setStamped(opts.stamped ?? 0);
  return done(THREE, g, K, { grip: [0, 0, H / 2], anchors: { stamp_spot: [.005, .004, .04] }, setStamped });
}
const STAMP_INK = (K, mirror) => K.tex('stamp_ink' + (mirror ? '_m' : ''), 512, 256, (c, w, h) => { c.clearRect(0, 0, w, h); if (mirror) { c.translate(w, 0); c.scale(-1, 1); }
  c.strokeStyle = '#111111'; c.lineWidth = 10; c.strokeRect(12, 12, w - 24, h - 24); c.lineWidth = 4; c.strokeRect(28, 28, w - 56, h - 56);
  txt(c, 'NOT PAID:', w / 2, 92, 'bold 82px "Arial Black", ' + SANS, '#111111'); txt(c, 'ARTHRITIS KNEE', w / 2, 182, 'bold 56px "Arial Black", ' + SANS, '#111111');
  c.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 260; i++) { c.fillStyle = 'rgba(0,0,0,' + (.2 + (i % 5) * .15) + ')'; c.fillRect((i * 97) % w, (i * 53) % h, 3 + i % 4, 2 + i % 3); } });   // worn ink
// buildStamp: turned beech knob + neck, a steel base plate, the rubber die (mirrored text, black ink on it), an index label on top (the right-reading text).
//   opts.size 'normal' (0.08 x 0.04 die, 0.11 tall) | 'tin' (EXTREME row 46: a paint-tin-size stamp, 0.42 die, 0.55 tall). +Y up; grip = knob; tip = die face centre.
export function buildStamp(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(), s = opts.size === 'tin' ? 5.2 : 1; g.name = opts.size === 'tin' ? 'rubber_stamp_tin' : 'rubber_stamp';
  const wood = K.mat('wood', '#c88a4a', { size: .05 * s }), steel = K.metal('steel', '#b8c0cc', .3), rub = K.toon('#2a2a30'), W = .08 * s, D = .04 * s;
  K.box(g, [W, .004 * s, D], rub, 'stamp_rubber_die', 'rubber', [0, .002 * s, 0]); K.add(g, new THREE.PlaneGeometry(W * .96, D * .96), new THREE.MeshBasicMaterial({ map: STAMP_INK(K, true), transparent: true, alphaTest: .15 }), 'stamp_die_ink_mirrored', 'ink', [0, -.0002, 0], [Math.PI / 2, 0, 0], false);
  K.box(g, [W + .004 * s, .016 * s, D + .004 * s], wood, 'stamp_mount_block', 'wood', [0, .012 * s, 0]); K.box(g, [W + .006 * s, .003 * s, D + .006 * s], steel, 'stamp_steel_plate', 'metal', [0, .0055 * s, 0]);
  const lab = K.add(g, new THREE.PlaneGeometry(W * .9, D * .9), K.paper(STAMP_INK(K, false)), 'stamp_index_label', 'paper', [0, .0202 * s, 0], [-Math.PI / 2, 0, 0]);
  K.bar(g, [0, .02 * s, 0], [0, .06 * s, 0], .009 * s, wood, 'stamp_neck', 'wood', 16, .006 * s); K.add(g, new THREE.SphereGeometry(.02 * s, 18, 14), wood, 'stamp_knob', 'wood', [0, .075 * s, 0]).scale.y = .85;
  K.add(g, new THREE.TorusGeometry(.0065 * s, .0015 * s, 6, 16), steel, 'stamp_neck_ferrule', 'metal', [0, .058 * s, 0], [Math.PI / 2, 0, 0]);
  if (s > 1) for (let i = 0; i < 4; i++) K.screw(g, [(i % 2 ? 1 : -1) * W * .45, .02 * s + .001, (i < 2 ? 1 : -1) * D * .4], null, .01);
  return done(THREE, g, K, { grip: [0, .075 * s, 0], tip: [0, 0, 0], anchors: { die_centre: [0, 0, 0], knob_top: [0, .092 * s, 0] }, scaleK: s });
}

// ================================================================ THE UNUSED INSTRUMENT TRAY (rows 7, 10, 48): Mayo tray, folded blue towel, CLEAN steel laid in a perfect row:
// scalpel handle, scissors, two clamps, forceps, probe hook, a gauze stack, a paper sterility strip "UNUSED"? no word: the strip is plain blue (the nurse's line says it).
// Held by the nurse at row 48 (held3d 'box' anchors grip_left / grip_right). 0.48 x 0.32. Face +Y. Anchors: centre.
export function buildInstrumentTray(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'unused_instrument_tray';
  const steel = K.metal('steel', '#d0d6e0', .12, 1.4), W = .48, D = .32, towel = K.toon('#3a8ad0'), towelDk = K.toon('#2f72b0');
  K.box(g, [W, .012, D], steel, 'mayo_tray_floor', 'metal', [0, .006, 0]); for (const z of [-D / 2, D / 2]) K.box(g, [W, .03, .006], steel, 'mayo_tray_lip', 'metal', [0, .02, z]); for (const x of [-W / 2, W / 2]) K.box(g, [.006, .03, D], steel, 'mayo_tray_lip', 'metal', [x, .02, 0]);
  K.box(g, [W - .03, .006, D - .03], towel, 'tray_towel', 'cloth', [0, .015, 0]); for (let i = 0; i < 5; i++) K.box(g, [W - .03, .0015, .002], towelDk, 'towel_fold_line', 'cloth', [0, .0186, -D / 2 + .05 + i * .055]);
  const y = .021, row = (x, fn) => fn(x);
  row(-.18, x => { K.box(g, [.012, .004, .13], steel, 'tray_scalpel_handle', 'metal', [x, y, 0]); K.box(g, [.008, .002, .02], K.metal('steel', '#f0f4f8', .05, 1.6), 'tray_scalpel_blade_capped', 'metal', [x, y + .002, -.075]); });
  row(-.11, x => { for (const s of [-1, 1]) { K.box(g, [.006, .004, .1], steel, 'scissor_blade', 'metal', [x + s * .004, y, -.03], [0, s * .06, 0]); K.add(g, new THREE.TorusGeometry(.012, .0025, 6, 14), steel, 'scissor_ring', 'metal', [x + s * .014, y, .04], [Math.PI / 2, 0, 0]); } K.add(g, new THREE.CylinderGeometry(.003, .003, .006, 8), steel, 'scissor_screw', 'metal', [x, y + .002, .005]); });
  for (const x0 of [-.04, .02]) row(x0, x => { for (const s of [-1, 1]) { K.box(g, [.004, .004, .12], steel, 'clamp_shank', 'metal', [x + s * .003, y, -.02], [0, s * .03, 0]); K.add(g, new THREE.TorusGeometry(.01, .002, 6, 14), steel, 'clamp_ring', 'metal', [x + s * .011, y, .05], [Math.PI / 2, 0, 0]); } for (let i = 0; i < 3; i++) K.box(g, [.008, .003, .002], K.metal('steel', '#9aa4b4', .3), 'clamp_ratchet', 'metal', [x, y + .002, .03 - i * .003]); });
  row(.08, x => { K.box(g, [.008, .004, .14], steel, 'forceps', 'metal', [x, y, 0]); for (let i = 0; i < 6; i++) K.box(g, [.009, .001, .003], K.metal('steel', '#9aa4b4', .3), 'forceps_grip_serration', 'metal', [x, y + .0025, .02 + i * .005]); });
  row(.12, x => { K.bar(g, [x, y, -.07], [x, y, .07], .002, steel, 'probe_hook_shaft', 'metal', 8); K.box(g, [.006, .004, .006], steel, 'probe_hook_tip', 'metal', [x + .003, y, -.073]); });
  for (let i = 0; i < 4; i++) K.box(g, [.08, .006, .08], K.toon('#fbfbf6'), 'gauze_square', 'cloth', [.19, y + i * .006, -.08 + (i % 2) * .003]);
  K.box(g, [.06, .002, .14], K.toon('#bcd8f0'), 'sterility_strip_plain', 'paper', [.19, y, .07]);
  K.add(g, new THREE.PlaneGeometry(.02, .4), K.basic('#ffffff', { transparent: true, opacity: .5, depthWrite: false }), 'tray_lip_streak', 'metal', [0, .036, D / 2 + .004], [0, 0, Math.PI / 2], false);
  return done(THREE, g, K, { grip: [0, .02, D / 2], anchors: { centre: [0, .03, 0], grip_left: [-W / 2, .02, 0], grip_right: [W / 2, .02, 0] } });
}

// ================================================================ THE COFFEE CUP (row 18; POWER 18 overflow): 1990s mustard ceramic diner mug, a chip on the rim, a tea-brown ring,
// coffee surface at fill 0..1, overflow 0..1 (a dome over the rim, 5 runs down the side, a puddle on the desk), steam true. Face (handle) +X. grip = handle. 0.095 tall.
export function buildCoffeeCup(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'coffee_cup';
  const glaze = new THREE.MeshPhysicalMaterial({ color: '#e0a830', roughness: .25, clearcoat: .8, side: THREE.DoubleSide }), coffee = new THREE.MeshPhysicalMaterial({ color: '#4a2a14', roughness: .1, clearcoat: 1 });
  const prof = [[0, 0], [.038, 0], [.042, .004], [.044, .09], [.046, .095], [.041, .095], [.039, .01], [0, .01]].map(p => new THREE.Vector2(p[0], p[1]));
  K.add(g, new THREE.LatheGeometry(prof, 36), glaze, 'mug_body', 'ceramic'); K.add(g, new THREE.TorusGeometry(.026, .007, 8, 20, Math.PI * 1.1), glaze, 'mug_handle', 'ceramic', [.048, .05, 0], [0, 0, -Math.PI * .55]);
  K.add(g, new THREE.TorusGeometry(.0445, .0012, 4, 36), K.toon('#c08820'), 'mug_rim_line', 'ceramic', [0, .07, 0], [Math.PI / 2, 0, 0]);
  K.box(g, [.008, .004, .004], K.toon('#f4ece0'), 'mug_rim_chip', 'ceramic', [-.043, .094, .012]);
  const fill = opts.fill ?? .85, ov = opts.overflow ?? 0, surf = K.add(g, new THREE.CircleGeometry(.04, 30), coffee, 'coffee_surface', 'water', [0, .012 + .08 * fill, 0], [-Math.PI / 2, 0, 0], false);
  K.add(g, new THREE.RingGeometry(.035, .04, 30), K.toon('#8a5a2a'), 'coffee_crema_ring', 'water', [0, .013 + .08 * fill, 0], [-Math.PI / 2, 0, 0], false);
  const over = new THREE.Group(); over.name = 'coffee_overflow'; g.add(over);
  K.add(over, new THREE.SphereGeometry(.046, 24, 8, 0, Math.PI * 2, 0, Math.PI * .3), coffee, 'overflow_dome', 'water', [0, .075, 0]);
  for (let i = 0; i < 5; i++) { const an = i * 1.2 + .3, L = .03 + (i % 3) * .025; K.tube(over, [[Math.cos(an) * .046, .095, Math.sin(an) * .046], [Math.cos(an) * .048, .095 - L * .5, Math.sin(an) * .048], [Math.cos(an) * .047, .095 - L, Math.sin(an) * .047]], .004, coffee, 'overflow_run', 'water', 10, 6);
    K.add(over, new THREE.SphereGeometry(.0055, 8, 6), coffee, 'overflow_drip_bead', 'water', [Math.cos(an) * .047, .093 - L, Math.sin(an) * .047]); }
  K.add(over, new THREE.CircleGeometry(.08, 30), coffee, 'overflow_puddle', 'water', [.01, .001, .01], [-Math.PI / 2, 0, 0], false);
  const steam = new THREE.Group(); steam.name = 'coffee_steam'; g.add(steam); const sm = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .35, depthWrite: false });
  for (let i = 0; i < 3; i++) K.tube(steam, [[-.015 + i * .015, .1, 0], [-.005 + i * .015, .13, .005], [-.02 + i * .015, .16, 0], [-.008 + i * .015, .19, -.004]], .003, sm, 'steam_wisp', 'cloth', 16, 5);
  const set = st => { const S = { fill, overflow: ov, steam: opts.steam ?? true, ...st }; surf.position.y = .012 + .08 * Math.min(1, S.fill); over.visible = S.overflow > 0; over.scale.set(1, Math.max(.01, S.overflow), 1); over.children.forEach(c => { if (c.name === 'overflow_puddle') c.scale.setScalar(Math.max(.01, S.overflow)); }); steam.visible = !!S.steam; };
  set({});
  return done(THREE, g, K, { grip: [.07, .05, 0], tip: [-.044, .095, 0], anchors: { lip: [-.044, .095, 0], surface: [0, .08, 0] }, set });
}

// ================================================================ THE GURNEY (rows 14-15 queue, 26-27): 1990s steel stretcher, 4 swivel casters with brakes, fold-down side rails,
// vinyl mattress, pillow, IV pole socket, push bar, a chart holder with a clipped sheet. opts.drape true (pale blue sheet with a hem), hump true (a bent-knee peak under the sheet),
// patient false (no body: the cast puppet lies on it). 2.0 x 0.68, deck 0.82 high. Origin = floor under the centre; head end toward -X. Anchors: deck, knee_hump, head, push_bar.
export function buildGurney(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'gurney_1990s';
  const steel = K.metal('steel', '#c0c8d4', .25), steelDk = K.metal('steel', '#8a94a4', .4), rub = K.toon('#2a2a30'), L = 1.96, W = .66, Z = .78;
  K.box(g, [L, .04, W], steelDk, 'gurney_deck_frame', 'metal', [0, Z - .04, 0]); K.box(g, [L - .1, .025, W - .06], steel, 'gurney_deck_pan', 'metal', [0, Z - .015, 0]);
  K.box(g, [1.3, .08, .3], steelDk, 'gurney_base_shroud', 'metal', [0, .22, 0]); for (const x of [-.4, .4]) K.bar(g, [x, .26, 0], [x, Z - .06, 0], .04, steel, 'gurney_column', 'metal', 14);
  for (const x of [-L / 2 + .12, L / 2 - .12]) for (const z of [-W / 2 + .06, W / 2 - .06]) { K.bar(g, [x * .7, .2, z * .5], [x, .14, z], .018, steelDk, 'gurney_base_arm', 'metal', 8);
    K.add(g, new THREE.CylinderGeometry(.05, .05, .035, 18), rub, 'caster_wheel', 'rubber', [x, .06, z], [Math.PI / 2, 0, 0]); K.add(g, new THREE.CylinderGeometry(.018, .018, .04, 10), steel, 'caster_hub', 'metal', [x, .06, z], [Math.PI / 2, 0, 0]);
    K.box(g, [.03, .07, .05], steelDk, 'caster_fork', 'metal', [x, .12, z]); K.box(g, [.04, .012, .03], K.toon('#f2c230'), 'caster_brake_pedal', 'plastic', [x + .04, .14, z]); }
  const mat = K.mat('plastic', '#3a5a8a'); K.box(g, [L - .06, .09, W - .08], mat, 'gurney_mattress_vinyl', 'leather', [0, Z + .045, 0]); for (const x of [-.3, .35]) K.box(g, [.004, .092, W - .08], K.toon('#2a4a78'), 'mattress_seam', 'leather', [x, Z + .045, 0]);
  K.add(g, new THREE.CapsuleGeometry(.07, .3, 6, 12), K.toon('#f4f6f2'), 'gurney_pillow', 'cloth', [-L / 2 + .2, Z + .13, 0], [Math.PI / 2, 0, 0]).scale.set(1.3, 1, .7);
  for (const z of [-W / 2, W / 2]) { for (let i = 0; i < 2; i++) K.bar(g, [-.6, Z + .14 + i * .14, z], [.6, Z + .14 + i * .14, z], .012, steel, 'side_rail_bar', 'metal', 8); for (const x of [-.6, -.2, .2, .6]) K.bar(g, [x, Z, z], [x, Z + .28, z], .01, steel, 'side_rail_post', 'metal', 8); }
  K.bar(g, [L / 2 + .03, Z + .25, -W / 2 + .05], [L / 2 + .03, Z + .25, W / 2 - .05], .016, steel, 'gurney_push_bar', 'metal', 12); for (const z of [-W / 2 + .05, W / 2 - .05]) K.bar(g, [L / 2 - .02, Z, z], [L / 2 + .03, Z + .25, z], .014, steel, 'push_bar_upright', 'metal', 8);
  for (const z of [-W / 2 + .04, W / 2 - .04]) K.add(g, new THREE.CylinderGeometry(.015, .015, .1, 10), steelDk, 'iv_pole_socket', 'metal', [-L / 2 + .03, Z - .02, z]);
  for (const x of [-L / 2, L / 2]) for (const z of [-W / 2, W / 2]) K.add(g, new THREE.CylinderGeometry(.03, .03, .04, 14), rub, 'corner_bumper', 'rubber', [x, Z - .03, z]);
  const chart = K.tex('gurney_chart', 128, 160, (c, w, h) => { c.fillStyle = '#fbfaf4'; c.fillRect(0, 0, w, h); c.fillStyle = '#3a3a44'; for (let i = 0; i < 8; i++) c.fillRect(12, 30 + i * 15, i % 3 ? 100 : 70, 4); txt(c, 'KNEE', w / 2, 16, 'bold 18px ' + SANS); });
  K.box(g, [.004, .2, .15], K.toon('#8a5a32'), 'chart_holder_board', 'wood', [L / 2 + .045, Z + .1, 0]); K.add(g, new THREE.PlaneGeometry(.13, .17), K.paper(chart), 'chart_sheet', 'paper', [L / 2 + .048, Z + .1, 0], [0, Math.PI / 2, 0]);
  const dr = new THREE.Group(); dr.name = 'gurney_drape'; g.add(dr);
  const sh = new THREE.PlaneGeometry(1.5, W + .2, 40, 14), SP = sh.attributes.position, hx = .3, hz = 0;
  for (let i = 0; i < SP.count; i++) { const x = SP.getX(i), y = SP.getY(i), d = Math.hypot((x - hx) / .22, (y - .12) / .16), hump = (opts.hump !== false ? .26 : 0) * Math.exp(-d * d), body = .1 * Math.exp(-((y / .25) ** 2)) * (x < .1 ? 1 : .5);
    const edge = Math.max(0, Math.abs(y) - (W / 2 - .02)); SP.setZ(i, hump + body + .002 * Math.sin(x * 40) - edge * 2.2); }
  sh.computeVertexNormals(); K.add(dr, sh, new THREE.MeshLambertMaterial({ color: '#a8c8e8', side: THREE.DoubleSide }), 'drape_sheet', 'cloth', [.18, Z + .09, 0], [-Math.PI / 2, 0, 0]);
  K.box(dr, [.03, .004, W + .2], K.toon('#8ab0d8'), 'drape_hem', 'cloth', [-.57, Z + .1, 0]); dr.visible = opts.drape !== false;
  return done(THREE, g, K, { grip: [L / 2 + .03, Z + .25, 0], anchors: { deck: [0, Z + .09, 0], knee_hump: [.48, Z + .35, .12], head: [-L / 2 + .2, Z + .2, 0], push_bar: [L / 2 + .03, Z + .25, 0], grip_left: [L / 2 + .03, Z + .25, -W / 2 + .1], grip_right: [L / 2 + .03, Z + .25, W / 2 - .1] } });
}

// ================================================================ THE USE HANDRAIL SIGN (rows 33 EXTREME: spins like a propeller): enamel plate on ONE screw at its top-left hole,
// the other three holes empty. opts.spin deg (0 = hangs straight; the plate swings/spins round the screw), blur true (a faint disc when spinning fast). Origin = the screw.
export function buildHandrailSign(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'use_handrail_sign';
  const W = .4, H = .13, t = K.tex('use_handrail', 512, 166, (c, w, h) => { c.fillStyle = '#1d3f8a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffffff'; c.lineWidth = 8; c.strokeRect(12, 12, w - 24, h - 24);
    txt(c, 'USE HANDRAIL', w / 2 + 30, h / 2 + 3, 'bold 64px ' + SANS, '#ffffff'); c.strokeStyle = '#ffffff'; c.lineWidth = 8; c.beginPath(); c.moveTo(40, 120); c.lineTo(60, 120); c.lineTo(60, 100); c.lineTo(80, 100); c.lineTo(80, 80); c.lineTo(100, 80); c.lineTo(100, 60); c.stroke();
    c.fillStyle = '#ffffff'; for (const [x, y] of [[30, 30], [w - 30, 30], [30, h - 30], [w - 30, h - 30]]) { c.beginPath(); c.arc(x, y, 9, 0, 7); c.fill(); } });
  const plate = new THREE.Group(); plate.name = 'sign_plate_pivot'; g.add(plate); const off = [W / 2 - .025, -H / 2 + .025];   // screw sits in the top-left hole
  K.box(plate, [W, H, .003], K.toon('#e8ecf2'), 'sign_plate_back', 'metal', [off[0], off[1], -.002]); K.add(plate, new THREE.PlaneGeometry(W, H), K.paper(t, { roughness: .35, metalness: .1 }), 'sign_enamel_face', 'metal', [off[0], off[1], .0002]);
  K.add(plate, new THREE.PlaneGeometry(.03, H * .9), K.basic('#ffffff', { transparent: true, opacity: .25, depthWrite: false }), 'sign_enamel_glint', 'metal', [off[0] - .1, off[1], .001], [0, 0, -.4], false);
  K.screw(g, [0, 0, .003], [Math.PI / 2, 0, 0], .006);
  // the spin smear: a small fan (about one sign wide) trailing the plate round its screw, plus two thin speed arcs; never a full disc
  const blur = new THREE.Group(); blur.name = 'sign_spin_blur'; g.add(blur); const R = Math.hypot(W - .025, H) * .92, a0 = Math.atan2(off[1], off[0]);
  K.add(blur, new THREE.CircleGeometry(R, 24, 0, .95), new THREE.MeshBasicMaterial({ color: '#9ab0d8', transparent: true, opacity: .22, depthWrite: false, side: THREE.DoubleSide }), 'sign_spin_smear', 'sign', [0, 0, .001], null, false);
  for (const [r, o] of [[R * 1.02, .55], [R * .7, .4]]) K.add(blur, new THREE.RingGeometry(r - .004, r, 24, 1, 0, 1.15), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: o, depthWrite: false, side: THREE.DoubleSide }), 'sign_speed_arc', 'sign', [0, 0, .0015], null, false);
  const setSpin = (deg, fast) => { const r = -(deg || 0) * Math.PI / 180; plate.rotation.z = r; blur.rotation.z = r + a0 + .25; blur.visible = !!fast; }; setSpin(opts.spin ?? 0, opts.blur);
  return done(THREE, g, K, { anchors: { screw: [0, 0, .006], plate_centre: [off[0], off[1], 0] }, setSpin });
}

// The list builders use for the contact sheet / counts (name -> builder).
export const BUILDERS = { buildKneeLeg, buildPlaster, buildBulb, buildScope, buildCRT, buildVCR, buildTape, buildJug, buildBowl, buildSploosh, buildCardStack, buildFileCard, buildWireTray,
  buildStickyNote, buildClipboard, buildPen, buildEnvelope, buildCane, buildPainDial, buildLightBox, buildRuler, buildScopeCase, buildLetter, buildStamp, buildInstrumentTray, buildCoffeeCup, buildGurney, buildHandrailSign };

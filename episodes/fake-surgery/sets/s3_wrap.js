// PLACE SET "s3_wrap" (owner: the S3 stretch builder, 2026-11-16). Wraps a base set (place key `base`: or_room | office | corridor) and adds S3's own
// per-frame extras from hero_props.js, WITHOUT editing the base file (other stretches never see these keys). All keys live under place key `s3`.
// Plan metres, Z up, WORLD coordinates (corridor/office anchors already carry their origin).
//   hide: [names]                    hide base meshes by exact name (e.g. the or_room monitor box when the hero CRT stands in its place)
//   pops: [{ kind, f }]              wire-tray label pop on the word (scale snap 1 -> 2.6, settle 2.0) + a warm rim that blinks
//   note: { locker, yaw, tray, f_peel, f_stick }   the "?" sticky note: on the locker before f_peel, in his fist between (held3d), on tray 3's label from f_stick
//   crt: { at, yaw, scale, screen, inside, glass }  hero CRT (inside: see-through glass, front bezel hidden so the camera inside sees the screen mask as edges)
//   vcr: { at, yaw, scale } ; tape: { at, yaw, rot, scale }
//   clip: { at, yaw, rot, tick: [[f,u]], sign: [[f,u]] }   the consent clipboard (anchors clip_tick_box, clip_sign_line, clip_clip)
//   pov_arm: { f0, f1, shoulder, path: [[f,[x,y,z]]], width }   the patient's POV arm (sets/soft_arm.js: one slight curve, round black fist, gown sleeve) + pen
//   gurney: { path: [[f,[x,y,z]]], yaw }   a draped gurney rolled to the OR door (join r26 -> 27)
//   bowl: { at } ; sploosh: { at, f0, dur } ; clogs: [[x,y]] (bob on the flood) ; rattle: { f0, n } (the OR lamp shakes on the SPLOOSH)
//   door_open: { f0, f1, ang, vest }   v2 (CB 36 s): the OR 3 double doors swing open into the OR (leaves + plates + portholes about their hinges), vest = a lit sea-green vestibule behind them
//   splash_big: { at, f0, dur, scale, color }   v2 (CB "splash looks weak"): an opaque blue splash crown + fat drops + a floor ring, sized like a gag
//   shift: [{ names, d }]   v4: move base meshes by plan metres [dx,dy,dz] (the OR IV pole + saline bags off the nurse)
//   pump: { names, f0, f1, period, amp }   the plastered knee pumped up and down like a pump handle (knee + drape window + marks + thigh drape)
import * as HP from './hero_props.js';
import { softArm } from './soft_arm.js';
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
const path = (keys, f) => { if (f <= keys[0][0]) return keys[0][1]; for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) { const [f0, a] = keys[i - 1], [f1, b] = keys[i], u = snap(f - f0, Math.max(1, f1 - f0)); return a.map((v, j) => v + (b[j] - v) * u); } return keys[keys.length - 1][1]; };
const num = (keys, f) => { if (!Array.isArray(keys)) return keys || 0; if (f <= keys[0][0]) return keys[0][1]; for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) { const [f0, a] = keys[i - 1], [f1, b] = keys[i]; return a + (b - a) * snap(f - f0, Math.max(1, f1 - f0)); } return keys[keys.length - 1][1]; };

export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, X = pl.s3 || {}, base = await import('./' + (pl.base || 'or_room') + '.js');
  const B = (await base.build(THREE, scene, film, ctx)) || {}, ups = [], an = {}, V = p => ctx.B2T(p), byName = n => { const out = []; scene.traverse(o => { if (o.name === n) out.push(o); }); return out; };
  try { if (HP.place) ctx.lookPack = ctx.lookPack || null; } catch (e) { }
  for (const n of X.hide || []) byName(n).forEach(o => { o.visible = false; });
  // ---- v4 shift: [{ names, d: [dx,dy,dz] }] move base meshes by plan metres (a prop off a face / out of a body), base file untouched ----
  for (const sh of X.shift || []) for (const n of sh.names) byName(n).forEach(o => { o.position.x += sh.d[0]; o.position.y += sh.d[2]; o.position.z -= sh.d[1]; o.updateMatrixWorld(true); });
  // ---- tray cards recolour (r21-23: tame the lamp glare on the pastel card stacks; office.js untouched) ----
  if (X.cards) { const K2 = X.cards; scene.traverse(o => { if (!o.name || !o.name.startsWith('wire_tray_')) return; o.traverse(m => { if (!m.material) return;
      if (m.name === 'card_stack_cards') { m.material = m.material.clone(); m.material.color.set(K2.color || '#a89a7c'); if (m.instanceColor) { const c = new THREE.Color(K2.color || '#a89a7c'); for (let i = 0; i < m.count; i++) m.setColorAt(i, c); m.instanceColor.needsUpdate = true; } }
      if (m.name === 'card_index_tab' || m.name === 'top_card_face') { m.material = m.material.clone(); if (m.material.color) m.material.color.set(m.name === 'card_index_tab' ? (K2.tab || '#2c3c6a') : (K2.top || '#b8ab8c')); } }); }); }
  // ---- recolour: [{ names, color }] tint a base-set material (clone) without editing the base file (r21-23: the lamp-lit desk top read as red) ----
  for (const rc of X.recolor || []) for (const n of rc.names) byName(n).forEach(o => o.traverse(m => { if (m.material && m.material.color) { m.material = m.material.clone(); m.material.color.set(rc.color); } }));
  // ---- timed hides: [{ names, f0, f1 }] (a set prop that would fill a POV lens) ----
  const hk = (X.hide_k || []).map(h => ({ h, os: h.names.flatMap(byName) })); if (hk.length) ups.push(f => { for (const { h, os } of hk) os.forEach(o => { o.visible = !(f >= h.f0 && f <= h.f1); }); });
  // ---- tray label pops ----
  for (const p of X.pops || []) { const tr = byName('wire_tray_' + p.kind)[0]; if (!tr) continue; let hold = null; tr.traverse(o => { if (o.name === 'tray_label_holder') hold = o; }); if (!hold) continue;
    const rim = new THREE.Mesh(new THREE.PlaneGeometry(.15, .08), new THREE.MeshBasicMaterial({ color: '#fff0a8', transparent: true, opacity: 0, depthWrite: false, toneMapped: false })); rim.position.set(0, 0, -.004); hold.add(rim);
    ups.push(f => { const g = f - p.f, s = g < 0 ? 1 : 1 + (X.pop_peak ?? 2.2) * snap(g, 4) - ((X.pop_peak ?? 2.2) - (X.pop_settle ?? 1.7)) * snap(g - 4, 8); hold.scale.set(s, s, s); hold.position.y = .0385 + (s - 1) * .03; rim.material.opacity = g < 0 ? 0 : g < 3 ? .95 : g < 6 ? .25 : g < 9 ? .8 : .35; }); }
  // ---- the "?" sticky note ----
  if (X.note) { const N = X.note, n1 = HP.buildStickyNote(THREE, ctx, { size: .076 }); HP.place(THREE, scene, ctx, n1, N.locker, N.yaw ?? -90);
    const tr = byName('wire_tray_' + (N.tray || 'trick'))[0]; let hold = null; if (tr) tr.traverse(o => { if (o.name === 'tray_label_holder') hold = o; });
    const n2 = HP.buildStickyNote(THREE, ctx, { size: .05, curl: .3 }); if (hold) { n2.group.position.set(-.036, .006, .004); n2.group.rotation.z = .14; hold.add(n2.group); }
    ups.push(f => { n1.group.visible = f < N.f_peel; n2.group.visible = f >= N.f_stick; if (f >= N.f_stick) { const g = f - N.f_stick, s = 1.35 - .35 * snap(g, 6); n2.group.scale.set(s, s, s); } }); }
  // ---- the hero CRT (+ inside view), VCR, tape ----
  if (X.crt) { const C = X.crt, o = HP.buildCRT(THREE, ctx, { screen: C.screen || 'tape', inside: !!C.inside }); o.group.scale.setScalar(C.scale || 1); HP.place(THREE, scene, ctx, o, C.at, C.yaw || 0);
    if (C.inside) o.group.traverse(m => { if (m.name === 'crt_front_bezel' || m.name === 'crt_blank_badge') m.visible = false; if (m.name === 'crt_screen' && m.material) { m.material.opacity = C.glass ?? .3; m.material.depthWrite = false; } if (m.name === 'crt_scanlines' && m.material) m.material.opacity = C.scan ?? .9; });
    if (C.inside && C.bezel) { const Bz = C.bezel, sc = C.scale || 1, hw = (Bz.hole?.[0] ?? .3) * sc / 2, hh = (Bz.hole?.[1] ?? .22) * sc / 2, r = .03 * sc, R = 1.2 * sc;
      const sh = new THREE.Shape(); sh.moveTo(-R, -R); sh.lineTo(R, -R); sh.lineTo(R, R); sh.lineTo(-R, R); sh.lineTo(-R, -R);
      const hole = new THREE.Path(); hole.moveTo(-hw + r, -hh); hole.lineTo(hw - r, -hh); hole.quadraticCurveTo(hw, -hh, hw, -hh + r); hole.lineTo(hw, hh - r); hole.quadraticCurveTo(hw, hh, hw - r, hh); hole.lineTo(-hw + r, hh); hole.quadraticCurveTo(-hw, hh, -hw, hh - r); hole.lineTo(-hw, -hh + r); hole.quadraticCurveTo(-hw, -hh, -hw + r, -hh); sh.holes.push(hole);
      const bz = new THREE.Mesh(new THREE.ShapeGeometry(sh, 12), new THREE.MeshBasicMaterial({ color: Bz.color || '#7a705c', side: THREE.DoubleSide })); bz.name = 'crt_bezel_inside';
      const lipS = new THREE.Shape(); lipS.moveTo(-hw - .012 * sc, -hh - .012 * sc); lipS.lineTo(hw + .012 * sc, -hh - .012 * sc); lipS.lineTo(hw + .012 * sc, hh + .012 * sc); lipS.lineTo(-hw - .012 * sc, hh + .012 * sc); lipS.holes.push(hole);
      const lip = new THREE.Mesh(new THREE.ShapeGeometry(lipS, 12), new THREE.MeshBasicMaterial({ color: Bz.lip || '#c8bea4', side: THREE.DoubleSide })); lip.name = 'crt_bezel_inside_lip'; lip.position.z = -.002;
      const gb = new THREE.Group(); gb.add(bz, lip); gb.position.copy(V(Bz.at)); scene.add(gb);
      if (Bz.f0 != null) ups.push(f => { gb.visible = f >= Bz.f0 && f <= Bz.f1; }); }
    for (const [k, v] of Object.entries(o.plan || {})) an['crt_' + k] = v; if (o.update) ups.push((f, t) => o.update(t)); }
  if (X.vcr) { const C = X.vcr, o = HP.buildVCR(THREE, ctx, { play: true, tapeIn: true }); o.group.scale.setScalar(C.scale || 1); HP.place(THREE, scene, ctx, o, C.at, C.yaw || 0); for (const [k, v] of Object.entries(o.plan || {})) an['vcr_' + k] = v; }
  if (X.tape) { const C = X.tape, o = HP.buildTape(THREE, ctx, { label: 'REAL ONE' }); o.group.scale.setScalar(C.scale || 1); HP.place(THREE, scene, ctx, o, C.at, C.yaw || 0, C.rot); for (const [k, v] of Object.entries(o.plan || {})) an['tape_' + k] = v; }
  // ---- the consent clipboard ----
  if (X.clip) { const C = X.clip, o = HP.buildClipboard(THREE, ctx, { tick: 0, signed: false }); HP.place(THREE, scene, ctx, o, C.at, C.yaw || 0, C.rot || [-Math.PI / 2, 0, 0]);
    for (const [k, v] of Object.entries(o.plan || {})) an['clip_' + k] = v; if (o.setTick && C.tick) ups.push(f => o.setTick(num(C.tick, f))); }
  // ---- the patient's POV arm + pen (row 25) ----
  if (X.pov_arm) { const A = X.pov_arm, arm = softArm(THREE, { width: A.width ?? .03, fistR: A.fistR ?? .045, sag: .1 }); scene.add(arm.group);
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(.07, .08, .26, 18, 1, true), new THREE.MeshLambertMaterial({ color: '#a8c8e4', side: THREE.DoubleSide })); scene.add(sleeve);
    const dia = new THREE.Mesh(new THREE.CylinderGeometry(.0705, .0805, .26, 18, 1, true), new THREE.MeshBasicMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = 128; c.height = 128; const g = c.getContext('2d'); g.clearRect(0, 0, 128, 128); g.fillStyle = '#1e2a5a'; for (let y = 8; y < 128; y += 32) for (let x = 8; x < 128; x += 32) { g.beginPath(); g.moveTo(x, y - 7); g.lineTo(x + 6, y); g.lineTo(x, y + 7); g.lineTo(x - 6, y); g.fill(); } const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2); t.colorSpace = THREE.SRGBColorSpace; return t; })(), transparent: true, side: THREE.DoubleSide })); scene.add(dia);
    const pen = HP.buildPen(THREE, ctx, {}); scene.add(pen.group); pen.group.scale.setScalar(A.pen_scale ?? 1.3);
    ups.push(f => { const on = f >= A.f0 && f <= A.f1; arm.group.visible = sleeve.visible = dia.visible = pen.group.visible = on; if (!on) return;
      const to = V(path(A.path, f)), from = V(A.shoulder); arm.update(from, to, new THREE.Vector3(1, 0, 0));
      const mid = from.clone().lerp(to, .22), dir = to.clone().sub(from).normalize(); for (const m of [sleeve, dia]) { m.position.copy(mid); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); }
      const tip = V(path(A.tip_path || A.path, f)); pen.group.position.copy(tip); pen.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(tip).normalize()); }); }
  // ---- the gurney rolled to the OR door ----
  if (X.gurney) { const G = X.gurney, o = HP.buildGurney(THREE, ctx, { drape: true, hump: true }); HP.place(THREE, scene, ctx, o, G.path[0][1], G.yaw || 0); ups.push(f => { o.group.position.copy(V(path(G.path, f))); }); }
  // ---- OR: bowl, SPLOOSH, clogs, lamp rattle, knee pump ----
  if (X.bowl) { const o = HP.buildBowl(THREE, ctx, { water: .6 }); HP.place(THREE, scene, ctx, o, X.bowl.at, 0); for (const [k, v] of Object.entries(o.plan || {})) an['bowl2_' + k] = v;
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(.03, .16, X.bowl.at[2], 16), new THREE.MeshStandardMaterial({ color: '#b8c0cc', metalness: .7, roughness: .3 })); stand.position.copy(V([X.bowl.at[0], X.bowl.at[1], X.bowl.at[2] / 2])); scene.add(stand); }
  if (X.sploosh) { const S = X.sploosh, o = HP.buildSploosh(THREE, ctx, {}); o.group.scale.setScalar(S.scale || 2.2); HP.place(THREE, scene, ctx, o, S.at, 0); ups.push(f => { const u = (f - S.f0) / (S.dur || 24); o.group.visible = u >= 0 && u <= 1; if (o.setU && u >= 0 && u <= 1) o.setU(u); }); }
  if (X.clogs) { const cl = X.clogs.map(([x, y], i) => { const g = new THREE.Group(); const m = new THREE.MeshLambertMaterial({ color: '#f6f6f2' }); const sole = new THREE.Mesh(new THREE.BoxGeometry(.11, .06, .28), m); const toe = new THREE.Mesh(new THREE.SphereGeometry(.065, 14, 10), m); toe.scale.set(.9, .7, 1.2); toe.position.set(0, .04, -.07); const strap = new THREE.Mesh(new THREE.TorusGeometry(.05, .01, 6, 14, Math.PI), new THREE.MeshLambertMaterial({ color: '#d8dce4' })); strap.position.set(0, .05, .07); g.add(sole, toe, strap); g.position.copy(V([x, y, (X.water_z ?? .3) + .02])); g.rotation.y = i * 1.3 + .4; scene.add(g); return g; });
    ups.push((f, t) => cl.forEach((g, i) => { g.position.y = (X.water_z ?? .3) + .025 + .02 * Math.sin(t * 2.3 + i * 1.7); g.rotation.z = .12 * Math.sin(t * 1.9 + i); })); }
  if (X.rattle) { const L = byName('or_lamp')[0]; if (L) { const r0 = L.rotation.clone(); ups.push(f => { const g = f - X.rattle.f0, a = g > 0 && g < (X.rattle.n || 20) ? .02 * Math.exp(-g / 6) * Math.sin(g * 2.4) : 0; L.rotation.set(r0.x + a, r0.y, r0.z + a * .6); }); } }
  if (X.pump) { const P = X.pump, ms = []; scene.traverse(o => { if (o.isMesh || o.isGroup) for (const n of P.names) if (o.name === n || (n.endsWith('*') && o.name.startsWith(n.slice(0, -1)))) ms.push([o, o.position.clone()]); });
    ups.push(f => { const g = f - P.f0, per = P.period || 10; let u = 0; if (g > 0 && f < P.f1) { const k = Math.floor(g / per), h = g - k * per; u = k % 2 === 0 ? snap(h, per) : 1 - snap(h, per); } else if (f >= P.f1) { const k = Math.floor((P.f1 - P.f0) / per); u = k % 2 === 0 ? 0 : 1; u = u * (1 - snap(f - P.f1, 10)); }
      const dz = (P.amp || .06) * u; for (const [o, p0] of ms) { o.position.copy(p0); o.position.y += dz; } }); }
  // ---- v2: the OR 3 doors swing open (corridor) ----
  if (X.door_open) { const D = X.door_open, NM = /^(or_door_leaf|or_door_leaf_edge|or_door_kick_plate|or_door_push_plate|or_door_hinge|porthole_or_light|porthole_glass|porthole_glint|porthole_ring|porthole_screw|porthole_silhouette_.*)$/;
    const leaves = byName('or_door_leaf'); if (leaves.length >= 2) { const wp = o => { o.updateMatrixWorld(true); return o.getWorldPosition(new THREE.Vector3()); };
      const ps = leaves.map(wp), c = ps.reduce((a, b) => a.add(b), new THREE.Vector3()).multiplyScalar(1 / ps.length), objs = []; scene.traverse(o => { if (o.name && NM.test(o.name)) objs.push(o); });
      const piv = [-1, 1].map(sz => { const g = new THREE.Group(); g.position.set(c.x + .03, 0, c.z + sz * .81); scene.add(g); g.updateMatrixWorld(true); return { g, sz }; });
      for (const o of objs) { if (o.parent && objs.includes(o.parent)) continue; const z = wp(o).z, pv = piv[z < c.z ? 0 : 1]; pv.g.attach(o); }
      for (const pv of piv) pv.sign = pv.sz > 0 ? -1 : 1;
      if (D.vest) { const m = new THREE.MeshStandardMaterial({ color: D.wall || '#5fb5a8', roughness: .6 }), fl = new THREE.MeshStandardMaterial({ color: D.floor || '#cfd8d2', roughness: .5 }), L = D.len || 1.6;
        const bx = (w, h, d, mat, x, y, z) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); b.position.set(x, y, z); b.name = 'or_vestibule'; scene.add(b); };
        bx(L, .04, 2.2, fl, c.x + L / 2, .02, c.z); bx(L, .04, 2.2, m, c.x + L / 2, 2.45, c.z); for (const s2 of [-1, 1]) bx(L, 2.45, .05, m, c.x + L / 2, 1.22, c.z + s2 * 1.1);
        const pt = new THREE.PointLight('#f4fbff', 3, 4, 1.2); pt.position.set(c.x + .8, 2.1, c.z); scene.add(pt); }
      ups.push(f => { const u = snap(f - D.f0, Math.max(1, D.f1 - D.f0)); for (const pv of piv) pv.g.rotation.y = pv.sign * (D.ang ?? 80) * Math.PI / 180 * u; }); } }
  // ---- v2: the big blue splash crown ----
  if (X.splash_big) { const S = X.splash_big, g = new THREE.Group(), col = S.color || '#2f8fe0', mat = new THREE.MeshStandardMaterial({ color: col, roughness: .25, metalness: 0, emissive: col, emissiveIntensity: .15, side: THREE.DoubleSide }), hi = new THREE.MeshBasicMaterial({ color: '#dff4ff' });
    const N = 14, crown = new THREE.Group(); g.add(crown);
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(.16, .1, .2, 36, 1, true), mat); wall.position.y = .1; crown.add(wall);
    const spikes = []; for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2, sp = new THREE.Mesh(new THREE.ConeGeometry(.035, .16, 10), mat); sp.position.set(Math.cos(a) * .16, .26, Math.sin(a) * .16); sp.rotation.z = -Math.cos(a) * .5; sp.rotation.x = Math.sin(a) * .5; crown.add(sp);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(.03, 12, 8), mat); tip.position.set(Math.cos(a) * .2, .36, Math.sin(a) * .2); crown.add(tip); spikes.push(tip); }
    const drops = []; for (let i = 0; i < 18; i++) { const a = i * 2.39996, d = new THREE.Mesh(new THREE.SphereGeometry(.028 + .022 * ((i * 7) % 5) / 4, 14, 10), mat); d.scale.y = 1.35; g.add(d); const glint = new THREE.Mesh(new THREE.SphereGeometry(.008, 6, 4), hi); glint.position.set(-.01, .015, .02); d.add(glint);
      drops.push({ d, vx: Math.cos(a) * (.5 + .4 * ((i * 3) % 4) / 3), vz: Math.sin(a) * (.5 + .4 * ((i * 5) % 4) / 3), vy: 1.6 + .6 * ((i * 11) % 5) / 4 }); }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.3, .03, 8, 40), mat); ring.rotation.x = Math.PI / 2; g.add(ring);
    g.scale.setScalar(S.scale || 2.4); g.position.copy(V(S.at)); scene.add(g); const fy = ((S.floor ?? .3) - S.at[2]) / (S.scale || 2.4);
    ups.push(f => { const k = f - S.f0, dur = S.dur || 30, on = k >= 0 && k <= dur; g.visible = on; if (!on) return; const t = k / 30, u = k / dur;
      const rise = snap(k, 6), fall = snap(k - 10, Math.max(1, dur - 10)); crown.scale.set(1 + .9 * rise, Math.max(.05, 1.4 * rise - 1.3 * fall), 1 + .9 * rise);
      for (const p of drops) { p.d.position.set(p.vx * t, Math.max(fy, p.vy * t - 4.9 * t * t), p.vz * t); p.d.visible = u < .92; }
      const rr = .4 + 2.4 * snap(k - 4, dur - 4); ring.scale.set(rr, rr, 1); ring.position.y = fy; ring.visible = k > 3; }); }
  // ---- v3 (FIX_BRIEF_v3 A2): the shared see-through water_fx 'jug_flood' from the held jug's spout; white clogs float on it (replaces splash_big + or_room water_floor) ----
  //   jug_flood: { at:[x,y], f0, f1, depth, size, clogs:[[x,y]], jug:'jug_pour', fall:[x,y,z] (spout when the jug is not in a fist) }
  if (X.jug_flood) { const J = X.jug_flood, { addWater } = await import('./water_fx.js');
    const bob = (J.clogs || []).map(([x, y], i) => { const g = new THREE.Group(), m = new THREE.MeshLambertMaterial({ color: '#f6f6f2' }), sole = new THREE.Mesh(new THREE.BoxGeometry(.11, .06, .28), m), toe = new THREE.Mesh(new THREE.SphereGeometry(.065, 14, 10), m);
      toe.scale.set(.9, .7, 1.2); toe.position.set(0, .04, -.07); const strap = new THREE.Mesh(new THREE.TorusGeometry(.05, .01, 6, 14, Math.PI), new THREE.MeshLambertMaterial({ color: '#cfd8e6' })); strap.position.set(0, .05, .07);
      g.add(sole, toe, strap); g.name = 'clog_float_' + i; g.position.copy(V([x, y, 0.03])); scene.add(g); return { obj: g, xy: [x, y], phase: i * 2.1, yaw: .6 - i * 1.1 }; });
    const fall = J.fall || [J.at[0] - .18, J.at[1], 1.05];
    const from = f => { try { const a = typeof window !== 'undefined' && window.held3dAll ? window.held3dAll(f).find(x => x.obj === (J.jug || 'jug_pour')) : null; if (a && a.tip) return a.tip; } catch (e) { } return fall; };
    const W = addWater(THREE, scene, 'jug_flood', { at: J.at, from, f0: J.f0 ?? 1215, f1: J.f1 ?? 1260, floorZ: 0, depth: J.depth ?? .3, size: J.size ?? 1, bob });
    ups.push((f, t, R) => W.update(f, R && R.camera)); }
  return { update: (f, t, R) => { if (B.update) B.update(f, t, R); const tt = t ?? f / 30; for (const u of ups) u(f, tt, R); }, anchors: { ...(B.anchors || {}), ...an } };
}

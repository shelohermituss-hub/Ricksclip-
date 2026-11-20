// SET s4_office.js (owner: S4 stretch builder, 2026-11-16 board). Plan rows 36-39 of "The Surgery Where the Surgeon Did Nothing".
// office.js (B1 / S2, NOT edited: imported and built as it is, dress 'stripes') PLUS the S4 story beats, switched by the place key "s4o" (no key = office.js unchanged):
//   s4o.bars_at   [[f, [h1,h2,h3]], ...]  the three red pain bars (THE ONE RED), keyed (rows 36 "three pops in a row": snap 4 f + one overshoot ring each)
//   s4o.pops      [f1, f2, f3]            pop frames of the three bars (each bar grows from 0 to its height in 5 f with a 12 % overshoot, settles in 8 f)
//   s4o.hover     [[f, dz], ...]          the ruler (a set prop, restRulerOnBars) lifted dz m above its shelf rest (row 37 hold, then it lands at 0; dz >= 5 hides it). Anchor ruler_end = its right (tip) end at rest: film.json hand_at puts his fist there
//   s4o.lid_at    [[f, u], ...]           the scope case lid (1 open .. 0 shut), row 39; s4o.puff [f0, n] dust puff out of the seam when it shuts
//   s4o.band      [f0, f1]                a light band races along the ruler edge (row 37 POWER), s4o.flash [f0, f1] the three bar tops flash + one "lock" line
//   s4o.glint     { at: [x,y,z] plan, f0, f1 }   a lens glint on the surgeon's glasses (the row 38 POV is entered through it)
//   s4o.glasses   [f0, f1]                POV rims: the black rectangular rims of his glasses frame the view (row 38), fixed to the camera
//   s4o.stripes   { at, aim, i }          a projected blind-stripe spot (gold, hard slats) on the back wall + desk (B1 STATE: the stripes did not show)
//   s4o.dust      { f0, n, col }        BUILD-OUT: soft grey-brown dust cloud (sprite puffs, fading) out of the lid seam when it shuts (replaces hero_props' beige balls)
//   s4o.arm3d     { shoulder:[x,y,z] plan, f0, f1, hide:[[a,b]], keys:[[f, 'ruler_end'|[x,y,z], lift]], width, r }  BUILD-OUT: the surgeon's near arm (soft_arm, one slight curve, round black fist) drawn by the set ON the ruler end
//   s4o.dark      [[f, u], ...]         BUILD-OUT: the lens goes dark (camera-fixed black veil, 0..1) for the S5 join (the lid shuts onto the lens)
//   s4o.hide [names] (S4 v3) hide office objects by name; s4o.case_at [x,y,z] plan + case_rot (S4 v3) move the rebuilt scope case
//   s4o.case_col  { shell, cap, handle, foam }   S4 v2: recolour the rebuilt scope case (light steel grey); s4o.dust.op 0..1 = denser grey puff (S4 v2)
// The hero light box + scope case of office.js are hidden and rebuilt here from hero_props.js at the SAME spots, so their setters can be keyed.
// Anchors added: ruler_tip (function of f: bar_top_1 + hover), bar_top_1..3 (rebuilt box), scope_case_lid (rebuilt), glasses_glint.
import * as OF from './office.js';
import * as HP from './hero_props.js';
export * from './office.js';
const kf = (k, f, d) => { if (!Array.isArray(k) || !k.length) return d; if (f <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (f <= k[i][0]) { const [fa, a] = k[i - 1], [fb, b] = k[i], u = (f - fa) / Math.max(1e-6, fb - fa), s = u * u * (3 - 2 * u); return Array.isArray(a) ? a.map((v, j) => v + (b[j] - v) * s) : a + (b - a) * s; } return k[k.length - 1][1]; };
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1], snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
export async function build(THREE, scene, film, ctx) {
  const { softArm } = await import('./soft_arm.js');
  const base = await OF.build(THREE, scene, film, ctx), pl = ctx.place || {}, K = pl.s4o;
  if (!K) return base;
  const A = base.anchors, V = p => ctx.B2T(p);
  scene.traverse(o => { if (o.name === 'light_box_charts' || o.name === 'scope_case') o.visible = false; });
  // the rebuilt hero light box (setBars) + scope case (setLid, setPuff) at office.js's own spots
  const lb = HP.buildLightBox(THREE, ctx, { bars: [.55, .55, .55], glow: true }); HP.place(THREE, scene, ctx, lb, A.light_box, 0); lb.group.name = 's4_light_box';
  const sc = HP.buildScopeCase(THREE, ctx, { lid: 1 }); HP.place(THREE, scene, ctx, sc, K.case_at || (K.case_dx ? A.scope_case.map((v, i) => v + K.case_dx[i]) : A.scope_case), K.case_rot ?? 0); sc.group.name = 's4_scope_case';
  // S4 v3: K.hide [names]: hide office.js objects by name (D5: the desk lamp globe swept across the lens); K.case_at [x,y,z] plan / K.case_rot: move the rebuilt case
  for (const nm of K.hide || []) scene.traverse(o => { if (o.name === nm || (nm.endsWith('*') && o.name.startsWith(nm.slice(0, -1)))) o.visible = false; });
  // S4 v2 case_col { shell, cap, handle, foam }: the scope case recoloured light steel grey (CB v2: black read as a coffin); own material clones, hero_props untouched
  if (K.case_col) { const CC = K.case_col, pick = n => /^case_base$|^case_lid_shell$/.test(n) ? CC.shell : /corner_cap/.test(n) ? CC.cap : /handle/.test(n) ? CC.handle : /foam|egg_crate|cutout/.test(n) ? CC.foam : null;
    sc.group.traverse(o => { if (!o.isMesh) return; const c = pick(o.name); if (!c) return; o.material = (Array.isArray(o.material) ? o.material[0] : o.material).clone(); o.material.color && o.material.color.set(c); }); }
  const tops = [1, 2, 3].map(i => lb.plan['bar_top_' + i]), H0 = [.55, .55, .55];
  // the ruler as a shelf on the bar tops (restRulerOnBars, lead note 2026-11-16), lifted by s4o.hover (metres above the rest) before it lands; s4o.ruler false = none
  let ru = null; if (K.ruler !== false) { lb.setBars(H0); lb.group.updateMatrixWorld(true); ru = HP.restRulerOnBars(THREE, lb, HP.buildRuler(THREE, ctx, {})); ru.group.name = 's4_ruler'; ru.y0 = ru.group.position.y; }
  // bars: keyed heights (bars_at) x pop envelope (pops)
  const popU = (f, f0) => f < f0 ? 0 : snap(f - f0, 5) * (1 + .14 * Math.exp(-(f - f0) / 4) * Math.sin((f - f0) * .6));
  // light band along the ruler edge + bar flashes + the lock line (additive, no red: warm white)
  const add = new THREE.MeshBasicMaterial({ color: '#fff6dc', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const L0 = tops[0], L1 = [tops[0][0] + 1.0, tops[0][1], tops[0][2]];
  const band = new THREE.Mesh(new THREE.BoxGeometry(.16, .012, .004), add.clone()); band.name = 's4_ruler_light_band'; band.userData.role = 'fx'; scene.add(band);
  const lock = new THREE.Mesh(new THREE.BoxGeometry(1.0, .004, .002), add.clone()); lock.name = 's4_lock_line'; lock.userData.role = 'fx'; scene.add(lock);
  const fl = tops.map((t, i) => { const m = new THREE.Mesh(new THREE.CircleGeometry(.05, 24), add.clone()); m.name = 's4_bar_flash_' + (i + 1); m.userData.role = 'fx'; scene.add(m); return m; });
  const glint = new THREE.Group(); glint.name = 's4_glasses_glint'; scene.add(glint);
  const gS = new THREE.Mesh(new THREE.PlaneGeometry(.22, .006), add.clone()), gB = new THREE.Mesh(new THREE.CircleGeometry(.018, 20), add.clone()); glint.add(gS, gB);
  // POV rims (round 3): thin black rims only at the frame edges (~7 % each side), a nose bridge at the top middle, a faint lens tint; unit coords, scaled to the frame in update
  const rim = new THREE.Group(); rim.name = 's4_pov_glasses'; rim.userData.role = 'fx'; scene.add(rim); rim.visible = false;
  const inkM = new THREE.MeshBasicMaterial({ color: '#121016', depthTest: false, depthWrite: false, toneMapped: false, fog: false }), tintM = new THREE.MeshBasicMaterial({ color: '#cfe6ff', transparent: true, opacity: .05, depthTest: false, depthWrite: false, fog: false });
  { const s = new THREE.Shape(); s.moveTo(-.7, -.7); s.lineTo(.7, -.7); s.lineTo(.7, .7); s.lineTo(-.7, .7); s.closePath();
    const h = new THREE.Path(), x0 = -.43, x1 = .43, y0 = -.465, y1 = .455, rx = .1, ry = .06; h.moveTo(x0 + rx, y0); h.lineTo(x1 - rx, y0); h.quadraticCurveTo(x1, y0, x1, y0 + ry); h.lineTo(x1, y1 - ry); h.quadraticCurveTo(x1, y1, x1 - rx, y1);
    h.lineTo(.085, y1); h.quadraticCurveTo(.03, .37, 0, .365); h.quadraticCurveTo(-.03, .37, -.085, y1);   // the nose bridge dips in at the top middle
    h.lineTo(x0 + rx, y1); h.quadraticCurveTo(x0, y1, x0, y1 - ry); h.lineTo(x0, y0 + ry); h.quadraticCurveTo(x0, y0, x0 + rx, y0); s.holes.push(h);
    const m = new THREE.Mesh(new THREE.ShapeGeometry(s, 24), inkM); m.renderOrder = 999; rim.add(m); const t = new THREE.Mesh(new THREE.PlaneGeometry(.86, .92), tintM); t.renderOrder = 998; rim.add(t);
    const hl = new THREE.Mesh(new THREE.PlaneGeometry(.18, .006), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .35, depthTest: false, depthWrite: false, toneMapped: false })); hl.position.set(-.3, .4, 0); hl.rotation.z = -.5; hl.renderOrder = 999; rim.add(hl); }
  // IMPACT FRAME (round 3, in the render): K.impact [f0, f1]: two-tone gold / violet (hero light box + ruler + cast gold, room violet), the blind stripes as hard black bands fixed to the camera
  const imp = new THREE.Group(); imp.name = 's4_impact_bands'; imp.userData.role = 'fx'; imp.visible = false; scene.add(imp);
  { const bm = new THREE.MeshBasicMaterial({ color: '#08060c', depthTest: false, depthWrite: false, toneMapped: false, fog: false }); for (let k = -4; k <= 4; k++) { const b = new THREE.Mesh(new THREE.PlaneGeometry(3, .1), bm); b.position.set(0, k * .27, 0); b.rotation.z = -.36; b.renderOrder = 997; imp.add(b); } }
  const GOLD = new THREE.MeshBasicMaterial({ color: '#ffdb85', toneMapped: false, fog: false }), VIO = new THREE.MeshBasicMaterial({ color: '#33295f', toneMapped: false, fog: false }), goldMap = new Map();
  const heroOf = o => { for (let p = o; p; p = p.parent) { if (/^s4_ruler/.test(p.name)) return 'ruler'; if (/^s4_light_box/.test(p.name)) return 'gold'; if (p.name === 'office_set' || /^s4_scope_case/.test(p.name)) return 'vio'; } return 'other'; };
  const setImpact = on => { scene.traverse(o => { if (!o.isMesh || o.userData.role === 'fx' || o.parent === rim || o.parent === imp) return;
      if (on) { if (!o.userData.s4mat) o.userData.s4mat = o.material; const k = heroOf(o), om = o.userData.s4mat;
        const c0 = (Array.isArray(om) ? om[0] : om)?.color, red = c0 && c0.r > .5 && c0.g < .3 && c0.b < .3;
        if (k === 'vio' || k === 'ruler' || (k === 'gold' && red)) o.material = VIO; else if (k === 'gold') o.material = GOLD;
        else { const src = Array.isArray(om) ? om[0] : om; if (src && src.map) { let g = goldMap.get(src); if (!g) { g = new THREE.MeshBasicMaterial({ color: '#ffdb85', map: src.map, transparent: true, alphaTest: .4, side: src.side, depthWrite: true, toneMapped: false, fog: false }); goldMap.set(src, g); } o.material = g; } else o.material = GOLD; } }
      else if (o.userData.s4mat) { o.material = o.userData.s4mat; delete o.userData.s4mat; } }); };
  let impOn = false, bg0 = null;
  // projected blind stripes: a hard gold spot with a slat texture (map) through the window side
  if (K.stripes) { const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#fff'; for (let y = 6; y < 256; y += 24) g.fillRect(0, y, 256, 13);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.SpotLight(K.stripes.col || '#ffe2b4', K.stripes.i ?? 20, 12, .5, .15, 1.2); sp.map = tex; sp.castShadow = true; sp.shadow.mapSize.set(1024, 1024); sp.shadow.bias = -.0006;
    sp.position.copy(V(K.stripes.at)); sp.target.position.copy(V(K.stripes.aim)); scene.add(sp); scene.add(sp.target); sp.name = 's4_blind_stripes'; }
  // a neutral sky fill (K.fill { i, col }): lifts the shadows without adding orange, keeps the striped AF under saturation .65
  if (K.fill) { const hf = new THREE.HemisphereLight(K.fill.col || '#f3f1ee', '#8a8278', K.fill.i ?? .8); hf.name = 's4_neutral_fill'; scene.add(hf); }
  // a soft neutral fill on the scope case for the row 39 close (K.case_fill { at, i })
  if (K.case_fill) { const fl2 = new THREE.PointLight('#fff0dc', K.case_fill.i ?? 3, 3, 1.6); fl2.position.copy(V(K.case_fill.at)); fl2.name = 's4_case_fill'; scene.add(fl2); }

  // S4 r2 pov_fill { at, i, f:[f0,f1] }: a neutral soft fill inside the glasses view (r38 POV mean >= .31), eased in/out over 3 f
  const pf = K.pov_fill ? new THREE.PointLight('#fff3e6', 0, 7, 1.2) : null; if (pf) { pf.position.copy(V(K.pov_fill.at)); pf.name = 's4_pov_fill'; scene.add(pf); }
  // BUILD-OUT dust cloud: soft grey-brown sprite puffs from the lid seam (front + sides), drift out and up, grow, fade
  let dust = null; if (K.dust) { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(.45, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c); dust = []; let sd = 7; const rr = (a, b) => { sd = (sd * 16807) % 2147483647; return a + (b - a) * (sd / 2147483647); };
    for (let i = 0; i < 26; i++) { const m = new THREE.SpriteMaterial({ map: tex, color: K.dust.col || '#9a8b78', transparent: true, opacity: 0, depthWrite: false, fog: false }), sp = new THREE.Sprite(m); sp.name = 's4_dust_sprite'; sp.userData.role = 'fx';
      const fr = i < 18, x = fr ? rr(-.26, .26) : (i % 2 ? .27 : -.27), z = fr ? .125 : rr(-.1, .1); sp.position.set(x, .07, z); sc.group.add(sp);
      dust.push({ sp, x, z, dx: fr ? rr(-.06, .06) : (i % 2 ? 1 : -1) * rr(.06, .14), dz: fr ? rr(.06, .16) : rr(-.03, .03), up: rr(.03, .12), s0: rr(.05, .09), s1: rr(.14, .26), k: rr(.75, 1.15) }); } }
  // BUILD-OUT arm3d: the surgeon's near arm + round black fist ON the ruler end (the card's own near arm is tucked behind him by sg_ruler)
  let arm = null; const AM = K.arm3d; if (AM) { arm = softArm(THREE, { width: AM.width ?? .017, sag: .14, fist: true, fistR: AM.r ?? .04, name: 's4_surgeon_arm_3d' }); scene.add(arm.group);
    arm.group.traverse(o => { if (o.isMesh) { o.userData.role = 'skin'; o.castShadow = true; } }); }
  const RE0 = ru ? ru.plan.tip : [0, 0, 0], armT = k => { const a = k[1] === 'ruler_end' ? (ru ? (ru.group.updateMatrixWorld(true), ru.group.localToWorld(ru.tip.clone())) : V(RE0)) : V(k[1]); return a; };
  // BUILD-OUT dark veil fixed to the camera (s4o.dark)
  const veil = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshBasicMaterial({ color: '#050407', transparent: true, opacity: 0, depthTest: false, depthWrite: false, toneMapped: false, fog: false })); veil.name = 's4_dark_veil'; veil.userData.role = 'fx'; veil.renderOrder = 1000; veil.visible = false; scene.add(veil);
  const fps = (film && film.fps) || 30;
  const update = (f, t, R) => { if (base.update) base.update(f, t, R);
    const hk = kf(K.bars_at, f, H0), P = K.pops || [0, 0, 0]; lb.setBars(hk.map((h, i) => Math.max(0, h * popU(f, P[i]))));
    if (ru) { const h = kf(K.hover, f, 0); ru.group.position.y = ru.y0 + h; ru.group.visible = h < 5; }
    if (pf) { const [a, b] = K.pov_fill.f, e = Math.max(0, Math.min(1, Math.min(f - a + 1, b - f + 1) / 3)); pf.intensity = K.pov_fill.i * e * e * (3 - 2 * e); }
    sc.setLid(kf(K.lid_at, f, 1)); if (K.puff && !K.dust) sc.setPuff(f < K.puff[0] ? 0 : Math.min(1, (f - K.puff[0]) / (K.puff[1] || 18))); else sc.setPuff(0);
    if (dust) { const u = (f - K.dust.f0) / (K.dust.n || 24); dust.forEach(d => { const v = Math.min(1, Math.max(0, u * d.k)), e = 1 - Math.pow(1 - v, 2.2); d.sp.visible = u >= 0 && v < 1;
      d.sp.position.set(d.x + d.dx * e, .07 + d.up * e, d.z + d.dz * e); d.sp.scale.setScalar(d.s0 + (d.s1 - d.s0) * e); d.sp.material.opacity = u < 0 ? 0 : Math.min(.95, .62 * (K.dust.op ?? 1) * 1.45 ** ((K.dust.op ?? 0) ? 1 : 0)) * Math.min(1, v * 6) * (1 - v); }); }
    if (arm) { const hid = (AM.hide || []).some(([a, b]) => f >= a && f <= b), on = f >= (AM.f0 ?? -1e9) && f <= (AM.f1 ?? 1e9) && !hid; arm.group.visible = on;
      if (on) { const KK = AM.keys; let i = 0; while (i + 1 < KK.length && KK[i + 1][0] <= f) i++; const k0 = KK[i], k1 = KK[Math.min(i + 1, KK.length - 1)], ss = x => x * x * (3 - 2 * x);
        const u = k1[0] > k0[0] ? ss(Math.max(0, Math.min(1, (f - k0[0]) / (k1[0] - k0[0])))) : 0, up = new THREE.Vector3(0, 1, 0);
        const P = armT(k0).addScaledVector(up, (k0[2] || 0) + (AM.r ?? .04) * .8).lerp(armT(k1).addScaledVector(up, (k1[2] || 0) + (AM.r ?? .04) * .8), f < k0[0] ? 0 : u);
        arm.update(V(AM.shoulder), P, new THREE.Vector3(0, -1, 0)); arm.group.traverse(o => { if (o.isMesh && o.geometry) { o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere(); } }); } }
    { const dv = kf(K.dark, f, 0); veil.visible = dv > .001; veil.material.opacity = Math.min(1, dv); if (veil.visible && R && R.camera) { const cam = R.camera; cam.updateMatrixWorld(true); veil.position.copy(cam.position).add(new THREE.Vector3(0, 0, -.2).applyQuaternion(cam.quaternion)); veil.quaternion.copy(cam.quaternion); } }
    const [b0, b1] = K.band || [-9, -9], u = (f - b0) / Math.max(1, b1 - b0), on = u >= 0 && u <= 1;
    band.material.opacity = on ? 1.2 * Math.sin(Math.PI * u) + .2 : 0; band.position.copy(V([L0[0] + .05 + u * .9, L0[1] - .016, L0[2] + .017]));
    lock.material.opacity = on ? .9 * (1 - u) : 0; lock.position.copy(V([L0[0] + .5, L0[1] - .016, L0[2] + .002]));
    const [q0, q1] = K.flash || [-9, -9], w = (f - q0) / Math.max(1, q1 - q0); fl.forEach((m, i) => { m.position.copy(V([tops[i][0], tops[i][1] - .02, tops[i][2] + .01])); m.material.opacity = w >= 0 && w <= 1 ? .95 * (1 - w) : 0; m.scale.setScalar(.6 + w * 1.2); });
    const G = K.glint; if (G) { const g = (f - G.f0) / Math.max(1, G.f1 - G.f0), a = g >= 0 && g <= 1 ? Math.sin(Math.PI * g) : 0; glint.position.copy(V(G.at)); if (R && R.camera) glint.quaternion.copy(R.camera.quaternion); gS.material.opacity = a; gB.material.opacity = a; gS.scale.x = .4 + 1.6 * g; }
    const [r0, r1] = K.glasses || [-9, -9]; rim.visible = f >= r0 && f <= r1;
    if (rim.visible && R && R.camera) { const cam = R.camera; cam.updateMatrixWorld(true); const d = .3, hh = Math.tan(cam.fov * Math.PI / 360) * d * 2, ww = hh * cam.aspect;
      rim.position.copy(cam.position).add(new THREE.Vector3(0, 0, -d).applyQuaternion(cam.quaternion)); rim.quaternion.copy(cam.quaternion); rim.scale.set(ww, hh, 1); }
    const [i0, i1] = K.impact || [-9, -9], io = f >= i0 && f <= i1; imp.visible = io;
    if (io && R && R.camera) { const cam = R.camera; cam.updateMatrixWorld(true); const d = .31, hh = Math.tan(cam.fov * Math.PI / 360) * d * 2; imp.position.copy(cam.position).add(new THREE.Vector3(0, 0, -d).applyQuaternion(cam.quaternion)); imp.quaternion.copy(cam.quaternion); imp.scale.set(hh, hh, 1); }
    if (io !== impOn) { setImpact(io); impOn = io; if (io) { bg0 = scene.background; scene.background = new THREE.Color('#33295f'); } else scene.background = bg0; } };
  update(0, 0);
  const hov = f => kf(K.hover, f, 0), rt = f => [tops[0][0] + .002, tops[0][1] - .016, tops[0][2] + .016 + hov(f)];
  return { update, anchors: { ...A, ruler_tip: rt, ruler_end: ru ? ru.plan.tip : null, ruler_grip: ru ? ru.plan.grip : null, bar_top_1: tops[0], bar_top_2: tops[1], bar_top_3: tops[2], scope_case_lid: sc.plan.lid_front, scope: sc.plan.scope, glasses_glint: K.glint ? K.glint.at : null } };
}

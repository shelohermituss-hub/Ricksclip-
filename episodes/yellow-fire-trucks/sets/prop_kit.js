// prop_kit.js: the small builder kit shared by hero_truck.js and hero_props.js (props-hero 2026-11-20).
// Adapted from the private kit() of episodes/fake-surgery/sets/hero_props.js (same call shapes: add, box, bar, tube, tex, metal), plus cyl, torus, slab, lathe, decal.
// Local metres, Y up. Every mesh gets a name and userData.role. Materials: ctx.pbr.metal when the kit3d is on, toon colour when it is off.
const TEX = new Map();
export function kit(THREE, ctx = {}) {
  const toonF = typeof ctx.toon === 'function' ? ctx.toon : (c, o = {}) => new THREE.MeshLambertMaterial({ color: c, ...o });
  const pb = ctx.pbr && typeof ctx.pbr.metal === 'function' ? ctx.pbr : null;
  const MC = new Map();
  // no kit3d ctx (a held prop is built by film.js with { inHand, toon } only): a small painted studio sky as the reflection, so chrome and brass still shine in the fist
  const studioEnv = () => { if (TEX.has('__studio_env')) return TEX.get('__studio_env'); const c = document.createElement('canvas'); c.width = 256; c.height = 128; const x = c.getContext('2d'), gr = x.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, '#dfeaf8'); gr.addColorStop(.42, '#9db8d8'); gr.addColorStop(.5, '#e9e2d2'); gr.addColorStop(.56, '#4a443c'); gr.addColorStop(1, '#2a2622'); x.fillStyle = gr; x.fillRect(0, 0, 256, 128); x.fillStyle = '#fffdf2'; x.fillRect(40, 18, 26, 44); x.fillStyle = '#cfe0ff'; x.fillRect(170, 26, 12, 36);
    const t = new THREE.CanvasTexture(c); t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace; TEX.set('__studio_env', t); return t; };
  const metal = (kind, color, rough = .28, env = 1.15, o = {}) => { const key = [kind, color, rough, env, JSON.stringify(o)].join('|'); if (MC.has(key)) return MC.get(key);
    const m = pb ? pb.metal(kind, { color, rough, env, toon: color, ...o }) : new THREE.MeshPhysicalMaterial({ color, metalness: kind === 'wet' ? 0 : .92, roughness: Math.max(.08, rough), clearcoat: o.coat || 0, clearcoatRoughness: o.coatRough ?? .1, envMap: studioEnv(), envMapIntensity: env }); MC.set(key, m); return m; };
  const tex = (key, w, h, draw, o = {}) => { if (TEX.has(key)) return TEX.get(key); const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = o.data ? THREE.NoColorSpace : THREE.SRGBColorSpace; t.anisotropy = 8; if (o.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(o.repeat[0], o.repeat[1]); } t.userData = { canvas: c }; TEX.set(key, t); return t; };
  const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: .85, metalness: 0, ...o });
  const paper = (t, o = {}) => new THREE.MeshStandardMaterial({ map: t, roughness: .9, metalness: 0, ...o });
  const basic = (c, o = {}) => new THREE.MeshBasicMaterial({ color: c, ...o });
  const parts = [];
  const add = (par, geo, m, name, role = 'metal', pos, rot, shadow = true) => { const o = new THREE.Mesh(geo, m); o.name = name; o.userData.role = role; o.castShadow = shadow; o.receiveShadow = true;
    if (pos) o.position.set(pos[0], pos[1], pos[2]); if (rot) o.rotation.set(rot[0], rot[1], rot[2]); par.add(o); parts.push(o); return o; };
  const box = (par, s, m, name, role, pos, rot, shadow) => add(par, new THREE.BoxGeometry(s[0], s[1], s[2]), m, name, role, pos, rot, shadow);
  // box given by its two corners
  const bx = (par, x0, x1, y0, y1, z0, z1, m, name, role, shadow) => box(par, [Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)], m, name, role, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], null, shadow);
  const ROT = { x: [0, 0, Math.PI / 2], y: null, z: [Math.PI / 2, 0, 0] };
  const cyl = (par, r, len, axis, m, name, role = 'metal', pos, segs = 20, r2, open = false) => add(par, new THREE.CylinderGeometry(r2 ?? r, r, len, segs, 1, open), m, name, role, pos, ROT[axis]);
  const bar = (par, a, b, r, m, name, role = 'metal', segs = 8, r2) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = Math.max(d.length(), 1e-4);
    const o = add(par, new THREE.CylinderGeometry(r2 ?? r, r, L, segs), m, name, role); o.position.copy(A).addScaledVector(d, .5); o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return o; };
  const tube = (par, pts, r, m, name, role = 'rubber', segs = 40, rs = 6, closed = false) => add(par, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), closed), segs, r, rs, closed), m, name, role);
  const torus = (par, R, r, m, name, role = 'metal', pos, rot, arc = Math.PI * 2, rs = 8, ts = 28) => add(par, new THREE.TorusGeometry(R, r, rs, ts, arc), m, name, role, pos, rot);
  const sphere = (par, r, m, name, role = 'metal', pos, scl, ws = 16, hs = 10, th0 = 0, th1 = Math.PI) => { const o = add(par, new THREE.SphereGeometry(r, ws, hs, 0, Math.PI * 2, th0, th1), m, name, role, pos); if (scl) o.scale.set(scl[0], scl[1], scl[2]); return o; };
  const lathe = (par, prof, m, name, role = 'metal', pos, rot, segs = 28) => add(par, new THREE.LatheGeometry(prof.map(p => new THREE.Vector2(p[0], p[1])), segs), m, name, role, pos, rot);
  // slab: a rounded rectangle in plan (X, Z) from y0 to y1. r = [front (x0) corner radius, rear (x1) corner radius]; bevel rounds the top and bottom edge.
  const slab = (par, x0, x1, za, zb, y0, y1, r, m, name, role, bevel = 0) => { const z0 = -Math.max(za, zb), z1 = -Math.min(za, zb);   /* shape y = -z: rotateX(-90) turns it back */
    const [rf, rb] = Array.isArray(r) ? r : [r, r], s = new THREE.Shape(), e = 1e-4, a = Math.max(rf, e), b = Math.max(rb, e);
    s.moveTo(x0 + a, z0); s.lineTo(x1 - b, z0); s.quadraticCurveTo(x1, z0, x1, z0 + b); s.lineTo(x1, z1 - b); s.quadraticCurveTo(x1, z1, x1 - b, z1); s.lineTo(x0 + a, z1); s.quadraticCurveTo(x0, z1, x0, z1 - a); s.lineTo(x0, z0 + a); s.quadraticCurveTo(x0, z0, x0 + a, z0);
    const g = new THREE.ExtrudeGeometry(s, { depth: (y1 - y0) - 2 * bevel, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelOffset: -bevel, bevelSegments: 2, curveSegments: 8 });
    g.rotateX(-Math.PI / 2); g.translate(0, y0 + bevel, 0);
    return add(par, g, m, name, role); };
  // decal: a flat canvas picture just above a surface (no shadow, never fights the surface)
  const decal = (par, t, w, h, name, pos, rot, o = {}) => { const m = new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: o.rough ?? .5, metalness: o.metal ?? 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, depthWrite: false, side: o.side ?? THREE.FrontSide, opacity: o.opacity ?? 1 });
    if (o.glow) { m.emissive = new THREE.Color('#ffffff'); m.emissiveMap = t; m.emissiveIntensity = o.glow; }
    const d = add(par, new THREE.PlaneGeometry(w, h), m, name, o.role || 'paint', pos, rot, false); d.receiveShadow = true; d.renderOrder = o.order ?? 2; return d; };
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * rnd();
  return { THREE, toon: toonF, pb, metal, tex, std, paper, basic, parts, add, box, bx, cyl, bar, tube, torus, sphere, lathe, slab, decal, rr, rnd, reseed: s => { seed = s; } };
}
export const args = (a, b) => b === undefined ? [a || {}, a || {}] : [a || {}, b || {}];
export const tris = g => { let n = 0; g.traverse(m => { if (m.isMesh && m.geometry) { const i = m.geometry.index; n += (i ? i.count : m.geometry.attributes.position.count) / 3; } }); return Math.round(n); };
const V3 = (THREE, p) => new THREE.Vector3(p[0], p[1], p[2]);
export const done = (THREE, g, K, o) => { const an = {}; for (const [k, v] of Object.entries(o.anchors || {})) an[k] = v.isVector3 ? v : V3(THREE, v); const r = { group: g, parts: K.parts, tris: tris(g), ...o, anchors: an };
  for (const [k, v] of Object.entries(an)) if (!(k in r)) r[k] = v; if (o.grip && !o.grip.isVector3) r.grip = V3(THREE, o.grip); if (o.tip && !o.tip.isVector3) r.tip = V3(THREE, o.tip); return r; };
// PLACE a built prop at a plan point (Z up) with a yaw; fills o.plan with every anchor in plan metres.
export function place(THREE, scene, ctx, o, p, yawDeg = 0) {
  o.group.position.copy(ctx.B2T(p)); o.group.rotation.y = yawDeg * Math.PI / 180; scene.add(o.group); o.group.updateMatrixWorld(true); o.plan = {};
  const T2B = v => [+v.x.toFixed(4), +(-v.z).toFixed(4), +v.y.toFixed(4)];
  for (const [k, v] of Object.entries(o.anchors || {})) o.plan[k] = T2B(o.group.localToWorld(v.clone()));
  if (o.grip) o.plan.grip = T2B(o.group.localToWorld(o.grip.clone())); if (o.tip) o.plan.tip = T2B(o.group.localToWorld(o.tip.clone()));
  return o;
}
// hand-lettered text: each letter gets a small own tilt and lift (a sign painter's brush, never a typed font look). arc > 0 bends the line upward in the middle (px of rise).
export function handText(c, s, cx, cy, px, o = {}) {
  const font = `${o.weight || 'bold'} ${px}px ${o.font || '"Caladea", "Bitstream Charter", "DejaVu Serif", serif'}`; c.font = font; c.textAlign = 'center'; c.textBaseline = 'middle';
  const sp = o.spacing ?? px * .06, ws = [...s].map(ch => c.measureText(ch).width + sp), W = ws.reduce((a, b) => a + b, 0); let x = cx - W / 2, i = 0;
  let sd = o.seed || 3; const rn = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647 - .5; };
  for (const ch of [...s]) { const w = ws[i++], u = W > 0 ? ((x + w / 2) - cx) / (W / 2) : 0, y = cy - (o.arc || 0) * (1 - u * u) + rn() * px * .03, rot = (o.arc ? -u * (o.arc / Math.max(W, 1)) * 2.2 : 0) + rn() * .03;
    c.save(); c.translate(x + w / 2, y); c.rotate(-rot * (o.arc ? -1 : 1)); c.scale(1 + rn() * .04, 1 + rn() * .05);
    if (o.shade) { c.fillStyle = o.shade; c.fillText(ch, px * .07, px * .08); }
    if (o.outline) { c.lineWidth = o.lw || px * .09; c.strokeStyle = o.outline; c.lineJoin = 'round'; c.strokeText(ch, 0, 0); }
    c.fillStyle = o.fill || '#000'; c.fillText(ch, 0, 0);
    c.restore(); x += w; }
}

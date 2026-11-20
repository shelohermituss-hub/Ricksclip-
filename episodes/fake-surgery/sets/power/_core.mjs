// POWER FX CORE (vfx-artist 2026-11-16): helpers shared by the six drawn "power" effects in this folder.
// No three.js import: every factory gets THREE from its caller (the kit's vendor build in a film, the same file in node for prove_power.mjs).
// Nothing here touches document or a canvas, so every effect builds and updates in node.

export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, k) => a + (b - a) * k;
export const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
export const easeOut = x => { x = clamp(x); const y = 1 - x; return 1 - y * y * y; };
export const easeIn = x => { x = clamp(x); return x * x; };
export const easeOutBack = (x, s = 1.7) => { x = clamp(x); const y = x - 1; return 1 + (s + 1) * y * y * y + s * y * y; };
export function rng(seed) { let a = (seed >>> 0) || 1; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export const hash = (i, s = 0) => { let h = Math.imul((i | 0) + 1, 374761393) ^ Math.imul((s | 0) + 7, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

// build, pop, settle envelope on the word clock: 0 before -lead, rises to 1 at the word (t = 0), holds, then fades over `fade` s from `end` s.
export function envelope(t, { lead = 0.1, end = null, fade = 0.4 } = {}) {
  if (t < -lead) return 0; let k = t < 0 ? smooth((t + lead) / Math.max(lead, 1e-4)) : 1;
  if (end != null && t > end) k *= 1 - smooth((t - end) / Math.max(fade, 1e-4));
  return k;
}

// a point given as Vector3, [x, y, z], an Object3D (its world position), or a function of t returning one of those. plan: true reads arrays as the kit's plan coordinates (x, y forward, z up).
export function toV3(THREE, v, plan, out = new THREE.Vector3(), t = 0) {
  if (typeof v === 'function') v = v(t);
  if (!v) return out.set(0, 0, 0);
  if (v.isVector3) return out.copy(v);
  if (v.isObject3D) { v.updateWorldMatrix(true, false); return out.setFromMatrixPosition(v.matrixWorld); }
  return plan ? out.set(v[0], v[2], -v[1]) : out.set(v[0], v[1], v[2]);
}
export const toDir = (THREE, v, plan, def) => (v ? toV3(THREE, v, plan).normalize() : def.clone());
export const camOf = (p, cam) => { const c = cam || p.camera; return typeof c === 'function' ? c() : c || null; };
export const col = (THREE, c) => new THREE.Color(c);

// flat cartoon material: no tone mapping, no fog, no depth writes (it sits on the world, never cuts holes in it)
export function flatMat(THREE, o = {}) {
  const m = new THREE.MeshBasicMaterial({ color: o.color ?? '#ffffff', transparent: true, opacity: o.opacity ?? 1, depthWrite: false, depthTest: o.depthTest ?? true, toneMapped: false, fog: false, side: THREE.DoubleSide, vertexColors: !!o.vertexColors });
  if (o.additive) m.blending = THREE.AdditiveBlending;
  if (o.map) m.map = o.map;
  m.polygonOffset = true; m.polygonOffsetFactor = o.offset ?? -2; m.polygonOffsetUnits = o.offset ?? -2;
  return m;
}

// soft round dot, alpha only, made from numbers (no canvas): glow sprites and spark points
const TEX = new WeakMap();
export function glowTex(THREE) {
  if (TEX.has(THREE)) return TEX.get(THREE);
  const N = 64, d = new Uint8Array(N * N * 4);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const u = (x + .5) / N * 2 - 1, v = (y + .5) / N * 2 - 1, r2 = u * u + v * v, a = r2 >= 1 ? 0 : Math.exp(-r2 * 4.2) * (1 - r2), i = (y * N + x) * 4; d[i] = d[i + 1] = d[i + 2] = 255; d[i + 3] = Math.round(255 * clamp(a)); }
  const t = new THREE.DataTexture(d, N, N, THREE.RGBAFormat); t.magFilter = t.minFilter = THREE.LinearFilter; t.needsUpdate = true; t.userData.shared = true; TEX.set(THREE, t); return t;
}
export function glowSprite(THREE, color, o = {}) {
  const m = new THREE.SpriteMaterial({ map: glowTex(THREE), color, transparent: true, depthWrite: false, depthTest: o.depthTest ?? true, toneMapped: false, fog: false, blending: THREE.AdditiveBlending, opacity: 0 });
  const s = new THREE.Sprite(m); s.renderOrder = o.order ?? 30; return s;
}

// one root group per effect; dispose() removes it from its parent and frees every geometry and material made for it (shared textures stay)
export function makeRoot(THREE, parent, name) {
  const g = new THREE.Group(); g.name = name; g.userData.role = 'fx'; g.userData.noExport = true; parent.add(g); return g;
}
export function disposeRoot(root) {
  if (!root) return; root.traverse(o => { if (o.geometry) o.geometry.dispose(); const ms = o.material ? [].concat(o.material) : []; for (const m of ms) { for (const k of ['map', 'alphaMap']) if (m[k] && !m[k].userData?.shared) m[k].dispose(); m.dispose(); } });
  if (root.parent) root.parent.remove(root); root.clear();
}

// MULTI-STRIP RIBBON: many polylines drawn as quads in one geometry, rebuilt on the CPU every frame (a few thousand vertices).
// strips: [{ pts: [Vector3...], arr: [0..1 per point], w: [width per point] }]. side(i, p, tangent) -> unit Vector3 across the strip.
// widthAt(strip, i) and colorAt(strip, i, out4) are given per update; returns { mesh, update(widthAt, colorAt, side) }.
export function makeStrips(THREE, strips, mat) {
  let nV = 0, nI = 0; for (const s of strips) { nV += s.pts.length * 2; nI += (s.pts.length - 1) * 6; }
  const g = new THREE.BufferGeometry(), P = new Float32Array(nV * 3), C = new Float32Array(nV * 4), I = nV > 65535 ? new Uint32Array(nI) : new Uint16Array(nI);
  let v = 0, k = 0; for (const s of strips) { for (let i = 0; i < s.pts.length - 1; i++) { const a = v + i * 2; I.set([a, a + 1, a + 2, a + 1, a + 3, a + 2], k); k += 6; } v += s.pts.length * 2; }
  g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('color', new THREE.BufferAttribute(C, 4)); g.setIndex(new THREE.BufferAttribute(I, 1));
  mat.vertexColors = true; const mesh = new THREE.Mesh(g, mat); mesh.frustumCulled = false;
  const tg = new THREE.Vector3(), sd = new THREE.Vector3(), c4 = [0, 0, 0, 0];
  function update(widthAt, colorAt, side) {
    let o = 0;
    for (const s of strips) {
      const n = s.pts.length;
      for (let i = 0; i < n; i++) {
        const p = s.pts[i], a = s.pts[Math.max(0, i - 1)], b = s.pts[Math.min(n - 1, i + 1)];
        tg.subVectors(b, a); if (tg.lengthSq() < 1e-12) tg.set(1, 0, 0); tg.normalize();
        side(sd, p, tg); const w = Math.max(0, widthAt(s, i)) * .5;
        colorAt(s, i, c4); if (!(w > 0)) c4[3] = 0;
        for (let e = 0; e < 2; e++) { const q = (o + e) * 3, sg = e ? -w : w; P[q] = p.x + sd.x * sg; P[q + 1] = p.y + sd.y * sg; P[q + 2] = p.z + sd.z * sg; C.set(c4, (o + e) * 4); }
        o += 2;
      }
    }
    g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true;
  }
  return { mesh, update };
}

// place an effect root at a WORLD point under any parent (scene, or a moving / turned object): sets root.position in the parent's space and
// returns invQ, the inverse of the parent's world turn, so children can be turned in world terms: child.quaternion = invQ * worldQuat.
export function placeRoot(THREE, root, world) {
  const par = root.parent, invQ = new THREE.Quaternion();
  if (par) { par.updateWorldMatrix(true, false); root.position.copy(par.worldToLocal(world.clone())); par.getWorldQuaternion(invQ).invert(); } else root.position.copy(world);
  return invQ;
}
export function billboard(o, cam, invQ) { if (!cam) return; cam.updateMatrixWorld(); const q = cam.getWorldQuaternion(o.quaternion); if (invQ) o.quaternion.premultiply(invQ); return q; }

// a flat disc with a thin dark ink ring behind it (dust puffs, debris): two meshes in one group, turned to the lens on update
export function inkDisc(THREE, color, ink, inkK = 1.18, seg = 20) {
  const g = new THREE.Group(), geo = new THREE.CircleGeometry(1, seg);
  const fill = new THREE.Mesh(geo, flatMat(THREE, { color })), back = new THREE.Mesh(geo.clone(), flatMat(THREE, { color: ink, offset: -1 }));
  back.scale.setScalar(inkK); back.position.z = -0.002; fill.renderOrder = 21; back.renderOrder = 20; g.add(back, fill);
  g.userData.set = (op) => { fill.material.opacity = back.material.opacity = op; g.visible = op > 1e-3; };
  return g;
}

// check used by prove_power.mjs and by a film's own self-test: every number of every object under root is finite
export function finiteCheck(root) {
  let bad = 0; const chk = v => { if (!Number.isFinite(v)) bad++; };
  root.traverse(o => {
    for (const k of ['x', 'y', 'z']) { chk(o.position[k]); chk(o.scale[k]); }
    chk(o.quaternion.x); chk(o.quaternion.w);
    for (const m of o.material ? [].concat(o.material) : []) { chk(m.opacity); if (m.uniforms) for (const u of Object.values(m.uniforms)) { const x = u.value; if (typeof x === 'number') chk(x); else if (x && x.isVector3) { chk(x.x); chk(x.y); chk(x.z); } else if (x && x.isVector2) { chk(x.x); chk(x.y); } } }
    const a = o.geometry && o.geometry.attributes; if (a) for (const n of ['position', 'color']) if (a[n]) { const arr = a[n].array; for (let i = 0; i < arr.length; i++) if (!Number.isFinite(arr[i])) { bad++; break; } }
  });
  return bad;
}

// SHARED FX "water_fx" (owner: vfx-artist, phase A 2026-11-17; fake-surgery FIX_BRIEF_v3 "Shared pieces", ISSUES_v2 A1 + A2).
// CARTOON WATER that reads as water at phone size: a SEE-THROUGH cyan -> white body (fresnel shader: clear in the middle, white at the rims and on top),
// white foam crests, white highlight streaks, fat round drops flying in gravity arcs (each with a white glint, stretched along its velocity),
// a splash crown that rises and collapses (8-14 f), expanding ripple rings, a wet sheen where it lands. Never an opaque blue plastic shape.
// Technique: templates/pieces/fx/power/_core.mjs (point helpers, easing, hash) + the raycast landing idea of the old or_room splash_big; all shapes are new.
//
// API   import { addWater, hideStaticBulbWater } from './water_fx.js';
//       const W = addWater(THREE, scene, preset, opts);   ...in the set's update(f, t, R):  W.update(f, R && R.camera);
//   Every point is PLAN metres (x, y forward, z up), the same as film.json and the set anchors, OR a THREE.Vector3 (world), an Object3D (its world
//   position), or a function(f) returning one of these.
//   preset 'bulb_splash'  { at, dir, f0, f1, from, bursts, size, normal, land, seed }
//       at      the hit point on the knee drape (plan)                         dir   the jet direction nozzle -> knee (plan vector, default [0, .35, -1])
//       from    the nozzle tip (point / Object3D / function(f)); default at - dir * .22      f0, f1  the effect window (S1 row 4: 85, 115)
//       bursts  squeeze frames (default [f0 + 4, f0 + .6 (f1 - f0)] = S1 89, 103); the 2nd burst is 1.25x the 1st (gag escalation)
//       size    scale (default 1.3: crown ~0.17 m wide on a 0.18 m kneecap)    normal  the drape normal (plan; default: raycast on the drape, else up)
//       land    meshes the drops land on (default 'auto' = visible cloth / skin / paper meshes; [] = a plane under the hit)
//   preset 'jug_flood'    { at, from, f0, f1, floorZ, depth, radius, size, bob, seed }
//       at      where the pour hits the floor (plan [x, y] or [x, y, z])       from  the jug lip (default at + [-.18, 0, 1.05])
//       f0      the pour starts; f1 the floor water reaches full depth (S3 row 29: 1215, 1260); the pour runs f0 .. f0 + .6 (f1 - f0)
//       floorZ  floor height (default 0); depth: shin-deep .30 m; radius: the water sheet (default 3.2 m, the walls hide the rest)
//       bob     [{ obj | name, xy, amp, phase, draft }]  objects that float on the water (default: a white clog + a steel kidney dish); [] = none
//   returns { update(f, camera), group, level(f) }   level(f) = the water surface height (plan z) for other set parts (bucket, gurney wheels).
//   hideStaticBulbWater(scene)  hides or_props' static bulb fan (water_stream / water_drop / drop_glint) so only this water shows.
import { clamp, smooth, easeOut, hash, toV3 } from './power/_core.mjs';

const EPS = 1e-4, G = -6.5;             // cartoon gravity (m/s^2, a little floaty so the arcs read)
const P2T = (p, out) => out.set(p[0], p[2] === undefined ? 0 : p[2], -p[1]);
const nz = (v, d) => { const L = v.length(); return L > EPS ? v.multiplyScalar(1 / L) : v.copy(d); };

// ---- materials: ONE water language (FX style sheet in sets/FX_README.md) ----
const DEEP = '#22a6dc', LITE = '#eafcff', RIM = '#17669a';
function waterMat(THREE, o = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { cDeep: { value: new THREE.Color(o.deep || DEEP) }, cLite: { value: new THREE.Color(o.lite || LITE) }, op: { value: o.opacity ?? .5 }, hu: { value: o.hu ?? .45 }, rw: { value: o.rw ?? .95 }, fade: { value: 1 } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; varying float vH; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalMatrix * normal; vV = -mv.xyz; vH = uv.y; gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform vec3 cDeep; uniform vec3 cLite; uniform float op; uniform float hu; uniform float rw; uniform float fade; varying vec3 vN; varying vec3 vV; varying float vH;\n' +
      'void main(){ vec3 n = normalize(vN + vec3(1e-5)); vec3 v = normalize(vV + vec3(1e-5)); float fr = clamp(1.0 - abs(dot(n, v)), 0.0, 1.0);\n' +
      ' float k = clamp(0.12 + rw * fr * fr + hu * vH, 0.0, 1.0); vec3 c = mix(cDeep, cLite, k);\n' +
      ' float s = pow(max(dot(n, normalize(vec3(-0.45, 0.7, 0.55))), 0.0), 22.0); c = mix(c, vec3(1.0), s);\n' +
      ' float a = op * (0.6 + 0.5 * fr) + 0.25 * hu * vH + 0.7 * s; gl_FragColor = vec4(c, clamp(a, 0.0, 0.95) * fade);\n #include <colorspace_fragment>\n }',
    transparent: true, depthWrite: false, side: THREE.DoubleSide });
}
const basic = (THREE, c, o = {}) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o.opacity ?? 1, depthWrite: false, toneMapped: false, side: o.side ?? THREE.FrontSide, polygonOffset: !!o.po, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });

// a tube with a radius per ring, allocated once and re-shaped every frame (jet, pour column, highlight streak)
function varTube(THREE, segs, radial, mat) {
  const pos = new Float32Array((segs + 1) * (radial + 1) * 3), uv = new Float32Array((segs + 1) * (radial + 1) * 2), idx = [];
  for (let i = 0; i <= segs; i++) for (let j = 0; j <= radial; j++) { const q = i * (radial + 1) + j; uv[q * 2] = j / radial; uv[q * 2 + 1] = 1 - i / segs; if (i < segs && j < radial) { const a = q, b = q + radial + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); } }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  const m = new THREE.Mesh(g, mat); m.frustumCulled = false; m.renderOrder = 7;
  const T = new THREE.Vector3(), N = new THREE.Vector3(), B = new THREE.Vector3(), ref = new THREE.Vector3();
  m.shape = (pts, rad) => { for (let i = 0; i <= segs; i++) { const p = pts[i], pn = pts[Math.min(segs, i + 1)], pp = pts[Math.max(0, i - 1)]; nz(T.copy(pn).sub(pp), ref.set(0, -1, 0));
      ref.set(0, 1, 0); if (Math.abs(T.dot(ref)) > .9) ref.set(1, 0, 0); nz(N.crossVectors(T, ref), ref); B.crossVectors(T, N); const r = Math.max(0, rad[i]);
      for (let j = 0; j <= radial; j++) { const a = j / radial * Math.PI * 2, c = Math.cos(a) * r, s = Math.sin(a) * r, q = (i * (radial + 1) + j) * 3; pos[q] = p.x + N.x * c + B.x * s; pos[q + 1] = p.y + N.y * c + B.y * s; pos[q + 2] = p.z + N.z * c + B.z * s; } }
    g.attributes.position.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingSphere(); };
  return m;
}

// the crown: an open sheet that flares out, its rim scalloped into spikes; rises then collapses. Axis = local +Y of the returned group.
function crownSheet(THREE, mat, N, seed) {
  const RS = N * 6, HS = 6, geo = new THREE.CylinderGeometry(1, 1, 1, RS, HS, true), P = geo.attributes.position, base = [];
  for (let i = 0; i < P.count; i++) { const x = P.getX(i), y = P.getY(i) + .5, z = P.getZ(i); base.push([Math.atan2(z, x), clamp(y)]); }
  const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; mesh.renderOrder = 7; const ph = hash(seed, 3) * 6.28;
  const jag = a => 1 + .42 * Math.max(0, Math.cos(N * a + ph)) ** 3 - .12 + .1 * Math.sin(3 * a + ph * 2);
  mesh.shape = (r0, H, flare) => { for (let i = 0; i < P.count; i++) { const [a, v] = base[i], h = H * jag(a) * v, r = r0 * (1 + flare * v * v); P.setXYZ(i, Math.cos(a) * r, h, Math.sin(a) * r); }
    P.needsUpdate = true; geo.computeVertexNormals(); geo.computeBoundingSphere(); };
  mesh.tipAngle = k => k / N * Math.PI * 2 - ph / N; mesh.jag = jag;
  return mesh;
}

// a fat drop: see-through body + dark-cyan rim shell + a white glint (placed toward the camera every frame)
function makeDrop(THREE, parent, mats, r) {
  const g = new THREE.Group(), body = new THREE.Mesh(mats.geoS, mats.water), rim = new THREE.Mesh(mats.geoS, mats.rim), gl = new THREE.Mesh(mats.geoG, mats.white);
  body.scale.setScalar(r); rim.scale.setScalar(r * 1.14); gl.scale.setScalar(r * .3); body.renderOrder = 8; rim.renderOrder = 7; gl.renderOrder = 9;
  g.add(rim, body); g.visible = false; gl.visible = false; parent.add(g); parent.add(gl); return { g, gl, r };
}
function softDotTex(THREE) {
  if (typeof document === 'undefined') return null; const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.45, 'rgba(235,252,255,.8)'); gr.addColorStop(1, 'rgba(200,240,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); return t;
}

export function hideStaticBulbWater(scene) { scene.traverse(o => { if (/^(water_stream|water_drop|drop_glint)$/.test(o.name)) o.visible = false; }); }

export function addWater(THREE, scene, preset, opts = {}) {
  const root = new THREE.Group(); root.name = 'fx_water_' + preset; scene.add(root);
  const mats = { water: waterMat(THREE, { opacity: .85, hu: .2, rw: .45 }), splat: waterMat(THREE, { opacity: .45, hu: 0 }), sheet: waterMat(THREE, { opacity: .42, hu: .7 }), rim: basic(THREE, RIM, { opacity: .5, side: THREE.BackSide }), white: basic(THREE, '#ffffff'),
    foam: basic(THREE, '#f4fdff', { opacity: .95 }), ring: basic(THREE, '#effcff', { opacity: .85, side: THREE.DoubleSide, po: true }), wet: basic(THREE, '#173f7a', { opacity: .32, side: THREE.DoubleSide, po: true }),
    geoS: new THREE.SphereGeometry(1, 16, 12), geoG: new THREE.SphereGeometry(1, 8, 6), geoRing: new THREE.RingGeometry(.86, 1, 56), geoDisc: new THREE.CircleGeometry(1, 40), geoArc: new THREE.RingGeometry(.62, .78, 32, 1, .35, 1.5) };
  const dot = softDotTex(THREE), seed0 = opts.seed ?? 7; let sd = 0; const rnd = () => hash(sd++, seed0);
  const pt = (v, f, out = new THREE.Vector3()) => { if (typeof v === 'function') v = v(f); if (Array.isArray(v)) return P2T(v, out); return toV3(THREE, v, false, out); };
  const UPW = new THREE.Vector3(0, 1, 0), tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), q = new THREE.Quaternion();
  const camRT = new THREE.Vector3(1, 0, 0), camUP = new THREE.Vector3(0, 1, 0), camTO = new THREE.Vector3(0, 0, 1);
  const setCam = (cam, at) => { if (!cam) return; cam.updateMatrixWorld(); camRT.setFromMatrixColumn(cam.matrixWorld, 0); camUP.setFromMatrixColumn(cam.matrixWorld, 1); cam.getWorldPosition(camTO); nz(camTO.sub(at), UPW); };
  const flat = (geo, mat, name) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.visible = false; m.renderOrder = 6; m.frustumCulled = false; root.add(m); return m; };
  const orient = (o, n) => o.quaternion.setFromUnitVectors(tmp2.set(0, 0, 1), n);

  // ---- shared parts ----
  // drops: ballistic from p0 with velocity v (world, three Y up); land as a splat (sheen) or a ripple ring
  const drops = [];
  const addDrop = (o) => { const d = makeDrop(THREE, root, mats, o.r); Object.assign(d, o); if (o.splat) { d.spl = flat(mats.geoDisc, mats.splat, 'fx_water_splat'); d.splHi = flat(mats.geoArc, mats.white, 'fx_water_splat_hi'); } d.rr = flat(mats.geoRing, mats.ring, 'fx_water_drop_ring'); drops.push(d); return d; };
  const updDrops = (f) => { for (const d of drops) { const t = (f - d.fb) / 30, fly = t >= 0 && t < d.T; d.g.visible = d.gl.visible = fly;
      if (fly) { const p = tmp.copy(d.p0).addScaledVector(d.v, t); p.y += .5 * G * t * t; d.g.position.copy(p); const vv = tmp2.copy(d.v); vv.y += G * t; const sp = vv.length();
        d.g.quaternion.setFromUnitVectors(UPW, nz(vv, UPW)); const st = 1 + Math.min(.7, sp * .22); d.g.scale.set(1 / Math.sqrt(st), st, 1 / Math.sqrt(st));
        d.gl.position.copy(p).addScaledVector(camRT, -.32 * d.r).addScaledVector(camUP, .38 * d.r).addScaledVector(camTO, .9 * d.r); }
      const tl = (f - d.fb) / 30 - d.T, kf = tl * 30;                                                     // frames since landing
      if (d.spl) { const on = tl >= 0; d.spl.visible = d.splHi.visible = on; if (on) { const k = kf < 3 ? .4 + .9 * kf / 3 : 1.3 - .3 * smooth((kf - 3) / 5), dry = 1 - .55 * smooth((kf - 8) / 60);
          for (const m of [d.spl, d.splHi]) { m.position.copy(d.p1).addScaledVector(d.n, .004); orient(m, d.n); m.scale.set(d.r * 1.25 * k * 1.25, d.r * 1.25 * k, 1); } d.splHi.scale.multiplyScalar(.75); d.spl.visible = dry > 0; d.splHi.visible = dry > .6; } }
      const ron = kf >= 0 && kf < 12; d.rr.visible = ron; if (ron) { const u = kf / 12; d.rr.position.copy(d.p1).addScaledVector(d.n, .005); if (d.ringY) d.rr.position.y = d.ringY(f) + .005; orient(d.rr, d.n);
        d.rr.scale.setScalar(d.r * (1.2 + (d.ringY ? 6 : 2.4) * easeOut(u))); d.rr.material = d.rrM || (d.rrM = mats.ring.clone()); d.rrM.opacity = .6 * (1 - u); } } };
  // ripple rings: precomputed events { f, p (Vector3 | function(f)), n, size, life, yOf } so every frame is a pure function of f (stills render out of order)
  const rEv = [], rPool = [];
  const fireRipple = (f, p, n, size, life = 14, yOf = null) => rEv.push({ f, p, n: n.clone(), size, life, yOf });
  const updRipples = (f) => { let i = 0; for (const e of rEv) { const k = f - e.f; if (k < 0 || k >= e.life) continue; let m = rPool[i]; if (!m) { m = rPool[i] = flat(mats.geoRing, mats.ring.clone(), 'fx_water_ripple'); } i++;
      const u = k / Math.max(1, e.life); m.visible = true; m.position.copy(typeof e.p === 'function' ? e.p(e.f) : e.p).addScaledVector(e.n, .006); if (e.yOf) m.position.y = e.yOf(f) + .006; orient(m, e.n);
      m.scale.setScalar(e.size * (.15 + easeOut(u))); m.material.opacity = .9 * (1 - u) * (1 - u); }
    for (; i < rPool.length; i++) rPool[i].visible = false; };
  // mist: fine white spray (soft dots) at the hit, 8 f life
  const mist = (n, sz) => { if (!dot) return null; const geo = new THREE.BufferGeometry(), P = new Float32Array(n * 3); geo.setAttribute('position', new THREE.BufferAttribute(P, 3));
    const m = new THREE.Points(geo, new THREE.PointsMaterial({ map: dot, size: sz, transparent: true, depthWrite: false, opacity: .9, toneMapped: false, color: '#f2fdff' })); m.frustumCulled = false; m.visible = false; m.renderOrder = 9; root.add(m);
    const v = []; for (let i = 0; i < n; i++) v.push([rnd() * 2 - 1, rnd(), rnd() * 2 - 1, .5 + rnd()]); return { m, P, v, n }; };
  const updMist = (M, f, fb, at, ax, spd, life = 9) => { if (!M) return; const k = f - fb, on = k >= 0 && k < life; M.m.visible = on; if (!on) return; const t = k / 30;
    for (let i = 0; i < M.n; i++) { const [a, b, c, s] = M.v[i], vx = a * spd * s, vz = c * spd * s, vy = (.4 + b) * spd * 1.6 * s; M.P[i * 3] = at.x + vx * t + ax.x * vy * t; M.P[i * 3 + 1] = at.y + ax.y * vy * t + .5 * G * t * t; M.P[i * 3 + 2] = at.z + vz * t + ax.z * vy * t; }
    M.m.geometry.attributes.position.needsUpdate = true; M.m.material.opacity = .9 * (1 - k / life); };
  // a crown with foam beads on its spikes; the beads break off at the peak and fly as drops
  const makeCrown = (N, seedC) => { const g = new THREE.Group(), sh = crownSheet(THREE, mats.sheet.clone(), N, seedC), lip = []; g.add(sh); g.visible = false; root.add(g);
    for (let k = 0; k < N; k++) { const b = new THREE.Mesh(mats.geoS, mats.foam), rr = new THREE.Mesh(mats.geoS, mats.rim); b.renderOrder = 9; rr.renderOrder = 8; g.add(rr, b); lip.push({ b, rr, a: sh.tipAngle(k) }); } return { g, sh, lip }; };
  const updCrown = (C, k, L, r0, H, wob = 0) => { const on = k >= 0 && k < L; C.g.visible = on; if (!on) return false; const u = k / L, up = u < .4 ? easeOut(u / .4) : 1, dn = smooth((u - .4) / .6);
    const h = Math.max(.002, H * (up - .92 * dn)), r = r0 * (.45 + .55 * up + .55 * dn), flare = .25 + .9 * up + .8 * dn; C.sh.shape(r, h, flare); C.sh.material.uniforms.fade.value = 1 - smooth((u - .7) / .3);
    for (const l of C.lip) { const j = C.sh.jag(l.a), hh = h * j, rr = r * (1 + flare), bead = (u < .55 ? 1 : 1 - smooth((u - .55) / .3)) * r0 * .16 * (.7 + .3 * j); const vis = bead > r0 * .02;
      l.b.visible = l.rr.visible = vis; if (!vis) continue; const x = Math.cos(l.a) * rr, z = Math.sin(l.a) * rr; l.b.position.set(x, hh + bead * .4 + wob, z); l.rr.position.copy(l.b.position); l.b.scale.setScalar(bead); l.rr.scale.setScalar(bead * 1.18); }
    return true; };
  let api = null;

  if (preset === 'bulb_splash') {
    const f0 = opts.f0 ?? 85, f1 = opts.f1 ?? 115, S = opts.size ?? 1.3, bursts = opts.bursts || [f0 + 4, Math.round(f0 + .6 * (f1 - f0))];
    const HIT = pt(opts.at || [0, 0, 1], f0), DIR = nz(P2T(opts.dir || [0, .35, -1], new THREE.Vector3()), new THREE.Vector3(0, -1, 0));
    const from = opts.from || (() => HIT.clone().addScaledVector(DIR, -.22));
    // the drape under the hit: normal + landing targets by raycast (built once)
    scene.updateMatrixWorld(true); const rc = new THREE.Raycaster(); let targets = [];
    if (opts.land === 'auto' || opts.land === undefined) scene.traverse(o => { if (o.isMesh && o.visible && !/^fx_|splash|water|held3d|soft_arm|bulb/.test(o.name) && ['cloth', 'skin', 'paper'].includes(o.userData.role)) targets.push(o); });
    else targets = opts.land || [];
    let NRM = opts.normal ? nz(P2T(opts.normal, new THREE.Vector3()), UPW) : null;
    if (!NRM && targets.length) { rc.set(HIT.clone().addScaledVector(DIR, -.3), DIR); const h = rc.intersectObjects(targets, false).find(h => h.point.distanceTo(HIT) < .12); if (h && h.face) NRM = h.face.normal.clone().transformDirection(h.object.matrixWorld); }
    if (!NRM) NRM = UPW.clone(); if (NRM.dot(DIR) > 0) NRM.negate();
    const tang = nz(DIR.clone().addScaledVector(NRM, -DIR.dot(NRM)), new THREE.Vector3(1, 0, 0)), AX = nz(NRM.clone().addScaledVector(tang, .45).add(UPW.clone().multiplyScalar(.3)), UPW);
    const land = (x, z, y0) => { if (!targets.length) return null; rc.set(new THREE.Vector3(x, y0 + .5, z), new THREE.Vector3(0, -1, 0)); const h = rc.intersectObjects(targets, false)[0];
      return h && h.point.y > y0 - .5 ? { p: h.point.clone(), n: h.face ? h.face.normal.clone().transformDirection(h.object.matrixWorld) : UPW.clone() } : null; };
    // wet sheen at the hit: a darker wet patch + a white highlight crescent, grows with each burst, stays
    const wet = flat(mats.geoDisc, mats.wet, 'fx_water_wet'), wetHi = flat(mats.geoArc, mats.white.clone(), 'fx_water_wet_hi'); wetHi.material.opacity = .85; wetHi.material.transparent = true;
    const B = bursts.map((fb, bi) => { const s = S * (bi ? 1.25 : 1), jet = varTube(THREE, 18, 10, mats.water), core = varTube(THREE, 18, 6, mats.white), jRim = varTube(THREE, 18, 10, mats.rim); root.add(jRim, jet, core);
      const head = makeDrop(THREE, root, mats, .017 * s), crown = makeCrown(9 + bi, seed0 + bi), M = mist(28, .012 * s), dl = [];
      crown.g.position.copy(HIT); crown.g.quaternion.setFromUnitVectors(UPW, AX);
      const nD = Math.round((opts.drops ?? 12) * (bi ? 1.2 : 1));
      for (let i = 0; i < nD; i++) { const a = (i / nD) * Math.PI * 2 + rnd() * .5, rad = (.07 + .17 * rnd()) * s, T = (9 + 8 * rnd()) / 30;
        const off = new THREE.Vector3(Math.cos(a), 0, Math.sin(a)).multiplyScalar(rad).addScaledVector(tang, .06 * s), L = land(HIT.x + off.x, HIT.z + off.z, HIT.y);
        const P1 = L ? L.p : HIT.clone().add(off).add(new THREE.Vector3(0, -.06 - .2 * rad, 0)), n1 = L ? L.n : UPW.clone(); P1.addScaledVector(n1, .003);
        const p0 = HIT.clone().addScaledVector(AX, .02 * s), v = P1.clone().sub(p0); v.y -= .5 * G * T * T; v.multiplyScalar(1 / T);
        addDrop({ r: (.012 + .011 * rnd()) * s, p0, v, T, fb: fb + 2 + Math.floor(rnd() * 4), p1: P1, n: n1, splat: true }); }
      fireRipple(fb, HIT, NRM, .11 * s, 14); fireRipple(fb + 3, HIT, NRM, .15 * s, 16);
      return { fb, s, jet, core, jRim, head, crown, M, dl }; });
    const pts = [], ptsC = [], rad = [], radC = [], radR = []; for (let i = 0; i <= 18; i++) { pts.push(new THREE.Vector3()); ptsC.push(new THREE.Vector3()); }
    const A = new THREE.Vector3(), C = new THREE.Vector3();
    api = { group: root, update(f, cam) { setCam(cam, HIT); A.copy(pt(from, f)); updDrops(f);
        for (const b of B) { const k = f - b.fb;
          // the jet: the front shoots nozzle -> knee in 2 f, holds, the tail lets go at +4 f and arrives at +7 f; a sag arc, fat at the front, thin at the nozzle
          const fr = clamp((k + 2) / 2.5), tl = clamp((k - 3) / 3.5), on = k >= -2 && k < 7 && fr > tl + .02; b.jet.visible = b.core.visible = b.jRim.visible = on; b.head.g.visible = b.head.gl.visible = on && k < 0.5;
          if (on) { const len = Math.max(.01, A.distanceTo(HIT)); C.copy(A).lerp(HIT, .5); C.y += .05 * len; rad.length = radC.length = radR.length = 0;
            for (let i = 0; i <= 18; i++) { const s = tl + (fr - tl) * i / 18, w = 1 - s; pts[i].copy(A).multiplyScalar(w * w).addScaledVector(C, 2 * w * s).addScaledVector(HIT, s * s);
              const r = .006 * b.s * (1 + 1.3 * s) * (1 + .18 * Math.sin(s * 17 - f * 1.7)); rad.push(r); radR.push(r * 1.25); radC.push(r * .32);
              ptsC[i].copy(pts[i]).addScaledVector(camUP, r * .45).addScaledVector(camRT, -r * .25).addScaledVector(camTO, r * .6); }
            b.jet.shape(pts, rad); b.jRim.shape(pts, radR); b.core.shape(ptsC, radC);
            if (b.head.g.visible) { b.head.g.position.copy(pts[18]); b.head.g.scale.setScalar(1.15); b.head.gl.position.copy(pts[18]).addScaledVector(camUP, .006 * b.s).addScaledVector(camTO, .016 * b.s); } }
          updCrown(b.crown, k, 12, .045 * b.s, .085 * b.s);
          updMist(b.M, f, b.fb, HIT, AX, .45 * b.s);
        }
        updRipples(f);
        // wet sheen: appears on the 1st hit, grows on the 2nd, stays (dries a little)
        const kw = f - B[0].fb, grow = clamp(kw / 4) * .7 + (B[1] ? clamp((f - B[1].fb) / 4) * .3 : .3); wet.visible = wetHi.visible = kw >= 0;
        if (kw >= 0) { for (const m of [wet, wetHi]) { m.position.copy(HIT).addScaledVector(NRM, .003); orient(m, NRM); } wet.scale.set(.085 * S * grow * 1.3, .085 * S * grow, 1); wetHi.scale.set(.07 * S * grow * 1.3, .07 * S * grow, 1); wetHi.material.opacity = .85 - .35 * smooth((kw - 20) / 60); } },
      level: () => HIT.y };
  } else if (preset === 'jug_flood') {
    const f0 = opts.f0 ?? 1215, f1 = opts.f1 ?? 1260, S = opts.size ?? 1, FZ = opts.floorZ ?? 0, DEPTH = opts.depth ?? .3, RAD = opts.radius ?? 3.2;
    const at0 = opts.at || [0, 0], HIT0 = P2T([at0[0], at0[1], FZ], new THREE.Vector3()), fromP = opts.from || [at0[0] - .18, at0[1], FZ + 1.05];
    const fHit = f0 + 3, fPourEnd = Math.round(f0 + Math.max(8, .6 * (f1 - f0))), lvl = f => FZ + DEPTH * smooth((f - fHit) / Math.max(1, f1 - fHit)), lvlW = f => lvl(f);
    const spread = f => RAD * Math.max(.02, easeOut((f - fHit) / Math.max(1, .55 * (f1 - fHit))));
    // the floor water: one sheet, see-through cyan, white wave streaks, foam at the pour + along the advancing edge
    const sheetM = new THREE.ShaderMaterial({ uniforms: { t: { value: 0 }, c: { value: new THREE.Vector2(HIT0.x, HIT0.z) }, rE: { value: .1 }, foamR: { value: .3 * S }, pour: { value: 1 }, cDeep: { value: new THREE.Color('#1688c2') }, cLite: { value: new THREE.Color('#8fdcf2') }, op: { value: .34 } },
      vertexShader: 'varying vec3 vW; varying vec3 vV; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vec4 mv = viewMatrix * w; vV = -mv.xyz; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform float t; uniform vec2 c; uniform float rE; uniform float foamR; uniform float pour; uniform vec3 cDeep; uniform vec3 cLite; uniform float op; varying vec3 vW; varying vec3 vV;\n' +
        'void main(){ vec2 p = vW.xz; float d = length(p - c); if (d > rE) discard; vec3 v = normalize(vV + vec3(1e-5)); float gz = clamp(1.0 - abs(v.y), 0.0, 1.0);\n' +
        ' float w = sin(p.x * 7.0 + sin(p.y * 4.3 + t * 1.4) * 1.9 + t * 1.8) * sin(p.y * 5.5 - t * 1.5 + sin(p.x * 3.1 - t) * 1.4);\n' +
        ' float ring = sin(d * 26.0 - t * 9.0) * pour; float seg = smoothstep(0.15, 0.55, sin(p.x * 1.7 + p.y * 2.3 + t * 0.6) * sin(p.y * 1.3 - p.x * 0.9 - t * 0.4)); float streak = seg * (0.9 * smoothstep(0.05, 0.015, abs(w - 0.6)) + 0.4 * smoothstep(0.04, 0.01, abs(w + 0.5))) + 0.6 * smoothstep(0.9, 0.99, ring) * smoothstep(foamR * 4.0, 0.0, d);\n' +
        ' float foam = smoothstep(foamR, foamR * 0.2, d) * (0.6 + 0.4 * sin(p.x * 61.0 + t * 3.0) * sin(p.y * 57.0 - t * 2.0)) * pour; float edge = smoothstep(rE - 0.12, rE - 0.02, d);\n' +
        ' float wh = clamp(streak + foam + edge * (0.75 + 0.25 * sin(atan(p.y - c.y, p.x - c.x) * 23.0 + t * 2.0)), 0.0, 1.0);\n' +
        ' vec3 col = mix(mix(cDeep, cLite, 0.15 + 0.45 * gz), vec3(1.0), wh); gl_FragColor = vec4(col, clamp(op + 0.2 * gz + 0.55 * wh, 0.0, 0.92));\n #include <colorspace_fragment>\n }',
      transparent: true, depthWrite: false, side: THREE.DoubleSide });
    const sheet = new THREE.Mesh(new THREE.CircleGeometry(1, 96), sheetM); sheet.rotation.x = -Math.PI / 2; sheet.name = 'fx_water_floor'; sheet.renderOrder = 5; sheet.frustumCulled = false; sheet.visible = false; root.add(sheet);
    // the pour column: a fat glugging tube from the lip, falling in a gravity arc, white core streak, foam skirt where it hits
    const col = varTube(THREE, 24, 14, mats.water), colR = varTube(THREE, 24, 14, mats.rim), colC = varTube(THREE, 24, 6, mats.white); root.add(colR, col, colC);
    const skirt = makeCrown(14, seed0 + 9), big = makeCrown(12, seed0 + 5), small = makeCrown(8, seed0 + 6), M = mist(60, .03 * S), M2 = mist(40, .022 * S);
    for (const C of [skirt, big, small]) C.g.position.copy(HIT0);
    const nD = Math.round(opts.drops ?? 26);
    for (let i = 0; i < nD; i++) { const a = i / nD * Math.PI * 2 + rnd() * .4, rr = (.35 + .75 * rnd()) * S, T = (11 + 9 * rnd()) / 30, fb = fHit + 1 + Math.floor(rnd() * 5);
      const P1 = HIT0.clone().add(new THREE.Vector3(Math.cos(a) * rr, 0, Math.sin(a) * rr)); const yl = lvl(fb + T * 30); P1.y = yl;
      const p0 = HIT0.clone(); p0.y = lvl(fb) + .12 * S; const v = P1.clone().sub(p0); v.y -= .5 * G * T * T; v.multiplyScalar(1 / T);
      addDrop({ r: (.022 + .022 * rnd()) * S, p0, v, T, fb, p1: P1, n: UPW.clone(), splat: false, ringY: lvlW }); }
    // a second wave of drops from each glug crown while pouring
    for (let g2 = fHit + 8; g2 < fPourEnd; g2 += 8) for (let i = 0; i < 8; i++) { const a = rnd() * 6.283, rr = (.2 + .35 * rnd()) * S, T = (8 + 6 * rnd()) / 30, P1 = HIT0.clone().add(new THREE.Vector3(Math.cos(a) * rr, 0, Math.sin(a) * rr)); P1.y = lvl(g2 + T * 30);
      const p0 = HIT0.clone(); p0.y = lvl(g2) + .06; const v = P1.clone().sub(p0); v.y -= .5 * G * T * T; v.multiplyScalar(1 / T); addDrop({ r: (.016 + .012 * rnd()) * S, p0, v, T, fb: g2, p1: P1, n: UPW.clone(), splat: false, ringY: lvlW }); }
    // floating things
    let bob = opts.bob; if (bob === undefined) { const clog = new THREE.Group(), cm = new THREE.MeshLambertMaterial({ color: '#f4f2ea' }), sole = new THREE.Mesh(new THREE.BoxGeometry(.1, .05, .26), cm), toe = new THREE.Mesh(new THREE.SphereGeometry(.06, 14, 10), cm);
        toe.scale.set(.9, .75, 1.25); toe.position.set(0, .04, -.07); const strap = new THREE.Mesh(new THREE.TorusGeometry(.045, .012, 6, 16, Math.PI), new THREE.MeshLambertMaterial({ color: '#6fa9c8' })); strap.position.set(0, .03, .06); clog.add(sole, toe, strap);
        const dish = new THREE.Group(), steel = new THREE.MeshStandardMaterial({ color: '#cfd8dc', metalness: .85, roughness: .25 }), bowl = new THREE.Mesh(new THREE.SphereGeometry(.12, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), steel);
        bowl.scale.set(1.5, .45, .8); bowl.material.side = THREE.DoubleSide; const lipR = new THREE.Mesh(new THREE.TorusGeometry(.12, .008, 6, 32), steel); lipR.rotation.x = Math.PI / 2; lipR.scale.set(1.5, .8, 1); dish.add(bowl, lipR);
        for (const o of [clog, dish]) { o.traverse(m => { if (m.isMesh) { m.castShadow = true; m.userData.role = m === lipR || m === bowl ? 'metal' : 'rubber'; } }); root.add(o); }
        bob = [{ obj: clog, xy: [at0[0] + .62, at0[1] - .35], phase: 0, yaw: .6 }, { obj: dish, xy: [at0[0] - .55, at0[1] - .25], phase: 2.1, yaw: -.4, draft: .015 }]; }
    const bobs = (bob || []).map(b => ({ ...b, obj: b.obj || scene.getObjectByName(b.name), y0: null })).filter(b => b.obj);
    for (const b of bobs) { b.base = b.obj.position.clone(); b.rot = b.obj.rotation.clone(); }
    // a floating thing at frame f: afloat once the water is deeper than its draft; bobs, rolls, drifts slowly away from the pour
    const bobAt = (b, f) => { const xy = b.xy || [b.base.x, -b.base.z], Pd = P2T([xy[0], xy[1], 0], new THREE.Vector3()), dr = b.draft ?? .02, lv = lvl(f), afloat = lv - FZ > dr, ph = b.phase || 0, amp = b.amp ?? .018;
      const away = nz(Pd.clone().sub(HIT0).setY(0), UPW).multiplyScalar(afloat ? .22 * smooth((f - fHit) / 90) : 0), y = afloat ? lv - dr + amp * Math.sin(f * .21 + ph) : b.base.y;
      return { afloat, p: new THREE.Vector3(Pd.x + away.x, y, Pd.z + away.z), r: new THREE.Euler(b.rot.x + (afloat ? .09 * Math.sin(f * .17 + ph) : 0), (b.yaw ?? 0) + (afloat ? .004 * (f - fHit) : 0), b.rot.z + (afloat ? .07 * Math.sin(f * .23 + ph * 1.7) : 0)) }; };
    for (let f = fHit; f < fPourEnd + 6; f += 5) fireRipple(f, HIT0.clone().setY(lvl(f)), UPW, (.45 + ((f - fHit) % 10 ? 0 : .2)) * S, 18, lvlW);
    for (const b of bobs) { let fa = fHit; while (fa < f1 + 300 && !bobAt(b, fa).afloat) fa++; for (let f = fa + Math.round((b.phase || 0) * 7); f < fa + 1800; f += 22) fireRipple(f, ff => bobAt(b, ff).p, UPW, .22 * S, 20, lvlW); }
    api = { group: root, level: lvl, update(f, cam) { setCam(cam, HIT0); updDrops(f);
        const lv = lvl(f); sheet.visible = f >= fHit && lv > FZ + .002; const rE = sheet.visible ? spread(f) : .02; sheetM.uniforms.rE.value = rE; sheet.scale.set(rE, rE, 1); sheet.position.set(HIT0.x, lv, HIT0.z); sheetM.uniforms.t.value = f / 30; sheetM.uniforms.pour.value = 1 - smooth((f - fPourEnd) / 25);
        // pour column: front falls from the lip f0 .. fHit; the tail leaves the lip at fPourEnd and lands 4 f later
        const A = pt(fromP, f), Bh = HIT0.clone(); Bh.y = lv; const drop = Math.max(.05, A.y - Bh.y), Tf = Math.sqrt(2 * drop / -G), vx = (Bh.x - A.x) / Math.max(Tf, EPS), vz = (Bh.z - A.z) / Math.max(Tf, EPS);
        const fr = clamp((f - f0) / Math.max(1, fHit - f0)), tl = clamp((f - fPourEnd) / 4), cOn = f >= f0 && fr > tl + .02; col.visible = colR.visible = colC.visible = cOn;
        if (cOn) { const pts = [], ptsC = [], rad = [], radR = [], radC = [];
          for (let i = 0; i <= 24; i++) { const s = tl + (fr - tl) * i / 24, tt = s * Tf, p = new THREE.Vector3(A.x + vx * tt, A.y + .5 * G * tt * tt, A.z + vz * tt); pts.push(p);
            const r = .042 * S * (1 - .45 * s) * (1 + .26 * Math.sin(s * 14 - f * 1.3) * Math.sin(f * .45 + s * 3)) * (i === 0 && tl > 0 ? .5 : 1); rad.push(r); radR.push(r * 1.12); radC.push(r * .22);
            ptsC.push(p.clone().addScaledVector(camUP, r * .2).addScaledVector(camRT, -r * .45).addScaledVector(camTO, r * .7)); }
          col.shape(pts, rad); colR.shape(pts, radR); colC.shape(ptsC, radC); }
        // the big crown on first contact, a foam skirt + small crowns on every glug while pouring
        for (const C of [skirt, big, small]) C.g.position.y = lv;
        updCrown(big, f - fHit, 14, .16 * S, .5 * S);
        const pk = f - fHit - 10; updCrown(skirt, pk >= 0 && f < fPourEnd + 4 ? 6 + (pk % 6) * .2 : -1, 12, .07 * S, .07 * S, .005);
        const gk = (f - fHit - 8) % 8; updCrown(small, f >= fHit + 8 && f < fPourEnd ? gk : -1, 8, .07 * S, .17 * S);
        updMist(M, f, fHit, Bh, UPW, 1.0 * S, 12); updMist(M2, f, fHit + 9 + ((f - fHit - 9) >= 0 ? Math.floor((f - fHit - 9) / 9) * 9 : 0), Bh, UPW, .6 * S, 8);
        // bobbing objects: float once the water is deeper than their draft; bob + roll + slow drift away from the pour
        for (const b of bobs) { const st = bobAt(b, f); b.obj.position.copy(st.p); b.obj.rotation.copy(st.r); }
        updRipples(f); } };
  } else throw new Error('water_fx: unknown preset ' + preset);
  return api;
}

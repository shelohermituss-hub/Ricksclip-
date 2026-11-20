// POWER FX 18: SHOCKWAVE RING (vfx-artist 2026-11-16). Rick: the sheriff's axe fells the tree, "down." (The Instinct That Makes You Crash, s32-33):
// a fat white puffy ring blasts out, a thin second ring runs ahead of it, dust kicks up and stones fly.
// DRAWN, not simulated: a flat two-tone ring (white + a cool shade band on its inner side) with scalloped cloud edges and a thin dark ink line,
// a thinner faster second ring, ink-edged dust puffs riding the ring front, and dark debris chips on ballistic arcs.
// TIMING on the word clock (t = seconds since the word, the pop lands ON the word):
//   build  -lead..0   a small hot flash gathers at the centre
//   pop    0          ring born at startRadius, flash full; ring expands with a cubic ease-out (60 % of the radius in the first 20 % of dur)
//   settle 0..dur     ring thins to 35 %, fades over the last 45 %; ring 2 leads by `ring2.delay` and goes 35 % further; dust drifts and sinks to 1.6 s
// usage: const fx = makeShockwaveRing(THREE, scene, ctx.B2T([x, y, 0.02]), { orient: 'ground', radius: 4, camera: () => R.camera }); fx.update((f - F_WORD) / 30); fx.dispose();
import { clamp, lerp, easeOut, smooth, rng, toV3, toDir, camOf, flatMat, glowSprite, makeRoot, disposeRoot, inkDisc, placeRoot, billboard } from './_core.mjs';

export const DEFAULTS = {
  orient: 'ground',          // 'ground' (lies flat, up = +Y), 'camera' (faces the lens every frame), or a normal [x, y, z]
  radius: 4, startRadius: 0.25, thickness: 0.32,   // metres; thickness is a share of the current radius at birth
  dur: 0.75, lead: 0.08,
  color: '#ffffff', shade: '#c9d3e6', ink: '#1d1a2a', inkWidth: 0.035, // two-tone ring + ink line (metres)
  lobes: 22, puff: 0.32,     // cloud scallops on the edges: count round the ring, height as a share of thickness
  ring2: { color: '#ffffff', delay: -0.04, scale: 1.35, width: 0.05, dur: 0.55 },   // negative delay = it leads the fat ring
  flash: { color: '#fff4d6', size: 1.6, life: 0.14 },
  dust: { count: 18, color: '#e6dccb', ink: '#2a2230', size: 0.16, lift: 0.45, life: 1.4 },
  debris: { count: 10, color: '#4a3a32', size: 0.09, speed: 4.2, gravity: 9.8 },
  seed: 7, plan: false, camera: null,
};

export function makeShockwaveRing(THREE, parent, at, params = {}) {
  const p = { ...DEFAULTS, ...params, ring2: { ...DEFAULTS.ring2, ...(params.ring2 || {}) }, flash: { ...DEFAULTS.flash, ...(params.flash || {}) },
    dust: params.dust === null ? null : { ...DEFAULTS.dust, ...(params.dust || {}) }, debris: params.debris === null ? null : { ...DEFAULTS.debris, ...(params.debris || {}) } };
  const root = makeRoot(THREE, parent, 'fx_shockwave_ring'), R = rng(p.seed), centre = new THREE.Vector3();
  const plane = new THREE.Group(); root.add(plane);                       // the ring's own plane (local XY)
  const N = 132;
  // ring geometry: 5 radii per angle: inner edge, inner shade, shade/white step (twice), outer edge; vertex colours give the hard two-tone
  function ringMesh(colIn, colOut, order, offset) {
    const g = new THREE.BufferGeometry(), P = new Float32Array(N * 4 * 3), C = new Float32Array(N * 4 * 3), I = [];
    const ci = new THREE.Color(colIn), co = new THREE.Color(colOut);
    for (let i = 0; i < N; i++) { for (let j = 0; j < 4; j++) (j < 2 ? ci : co).toArray(C, (i * 4 + j) * 3); const a = i * 4, b = ((i + 1) % N) * 4; for (const [u, v] of [[0, 1], [2, 3]]) I.push(a + u, a + v, b + u, a + v, b + v, b + u); }
    g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('color', new THREE.BufferAttribute(C, 3)); g.setIndex(I);
    const m = new THREE.Mesh(g, flatMat(THREE, { vertexColors: true, offset })); m.renderOrder = order; m.frustumCulled = false; plane.add(m); return m;
  }
  const ph = [...Array(4)].map(() => R() * 6.283), wob = a => .55 * Math.abs(Math.sin(a * p.lobes * .5 + ph[0])) + .25 * Math.abs(Math.sin(a * p.lobes * .31 + ph[1])) + .2 * Math.abs(Math.sin(a * p.lobes * .77 + ph[2]));
  function setRing(m, r, th, split, ink = 0) {
    const P = m.geometry.attributes.position.array;
    for (let i = 0; i < N; i++) { const a = i / N * 6.283, w = wob(a), wi = wob(a + 1.7), c = Math.cos(a), s = Math.sin(a);
      const rIn = r - th * (.5 + p.puff * wi) - ink, rOut = r + th * (.5 + p.puff * w) + ink, rS = lerp(rIn, rOut, split);
      [rIn, rS, rS, rOut].forEach((rr, j) => { const q = (i * 4 + j) * 3; P[q] = c * Math.max(rr, 0); P[q + 1] = s * Math.max(rr, 0); P[q + 2] = 0; }); }
    m.geometry.attributes.position.needsUpdate = true;
  }
  const inkM = ringMesh(p.ink, p.ink, 22, -1), fatM = ringMesh(p.shade, p.color, 23, -3);
  const ink2 = ringMesh(p.ink, p.ink, 22, -1), thin = ringMesh(p.ring2.color, p.ring2.color, 23, -3);
  const flash = glowSprite(THREE, p.flash.color, { order: 31 }); root.add(flash);
  const puffs = (p.dust ? [...Array(p.dust.count)] : []).map((_, i) => { const d = inkDisc(THREE, p.dust.color, p.dust.ink, 1.16); root.add(d); return { d, a: (i + R() * .6) / p.dust.count * 6.283, k: .75 + R() * .35, s: .7 + R() * .6, up: .5 + R() }; });
  const chips = (p.debris ? [...Array(p.debris.count)] : []).map(() => { const m = new THREE.Mesh(new THREE.CircleGeometry(1, 5), flatMat(THREE, { color: p.debris.color })); m.renderOrder = 24; root.add(m); return { m, a: R() * 6.283, v: p.debris.speed * (.55 + R() * .6), up: .6 + R() * .9, s: p.debris.size * (.6 + R() * .9), spin: (R() - .5) * 18 }; });

  const U = new THREE.Vector3(), V = new THREE.Vector3(), Nn = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), tmp = new THREE.Vector3(), q = new THREE.Quaternion();
  let invQ = new THREE.Quaternion(); const upL = new THREE.Vector3(), wq = new THREE.Quaternion();
  function orient(cam) {
    if (p.orient === 'camera' && cam) { cam.updateMatrixWorld(); cam.getWorldQuaternion(wq); }
    else if (p.orient === 'ground' || p.orient === 'camera') wq.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    else wq.setFromUnitVectors(new THREE.Vector3(0, 0, 1), toDir(THREE, p.orient, p.plan, up));
    plane.quaternion.copy(wq).premultiply(invQ); upL.copy(up).applyQuaternion(invQ);
    U.set(1, 0, 0).applyQuaternion(plane.quaternion); V.set(0, 1, 0).applyQuaternion(plane.quaternion); Nn.set(0, 0, 1).applyQuaternion(plane.quaternion);
  }
  function face(o, cam) { billboard(o, cam, invQ); }

  function update(t, camera) {
    const cam = camOf(p, camera); toV3(THREE, at, p.plan, centre, t); invQ = placeRoot(THREE, root, centre); orient(cam);
    const on = t >= -p.lead; root.visible = on; if (!on) return;
    // build + pop: the flash
    const fl = t < 0 ? .35 * smooth((t + p.lead) / p.lead) : Math.exp(-t / p.flash.life); flash.material.opacity = clamp(fl); flash.scale.setScalar(p.flash.size * (t < 0 ? .4 + .6 * smooth((t + p.lead) / p.lead) : 1 + t * 2));
    // the fat ring
    const u = t / p.dur, born = t >= 0 && u <= 1;
    fatM.visible = inkM.visible = born;
    if (born) { const r = lerp(p.startRadius, p.radius, easeOut(u)), th = r * p.thickness * (1 - .65 * u) + .02, op = 1 - smooth((u - .55) / .45);
      setRing(fatM, r, th, .38); setRing(inkM, r, th, .5, p.inkWidth); fatM.material.opacity = inkM.material.opacity = op; }
    // ring 2: thin, faster, further
    const t2 = t - p.ring2.delay, u2 = t2 / p.ring2.dur, b2 = t2 >= 0 && u2 <= 1; thin.visible = ink2.visible = b2;
    if (b2) { const r = lerp(p.startRadius, p.radius * p.ring2.scale, easeOut(u2)), th = p.ring2.width * (1 - .5 * u2), op = 1 - smooth((u2 - .4) / .6);
      setRing(thin, r, th, 0, 0); setRing(ink2, r, th, .5, p.inkWidth * .6); thin.material.opacity = op * .95; ink2.material.opacity = op * .8; }
    // dust: rides behind the ring front, puffs up, sinks and fades
    for (const P of puffs) { if (t < 0) { P.d.userData.set(0); continue; } const life = p.dust.life * P.k, v = t / life;
      if (v > 1) { P.d.userData.set(0); continue; }
      const r = lerp(p.startRadius, p.radius * .92 * P.k, easeOut(Math.min(1, t / (p.dur * 1.1)))), h = p.dust.lift * P.up * Math.sin(Math.PI * Math.min(1, v * 1.3)) ;
      tmp.copy(U).multiplyScalar(Math.cos(P.a) * r).addScaledVector(V, Math.sin(P.a) * r).addScaledVector(p.orient === 'ground' ? upL : Nn, h);
      P.d.position.copy(tmp); face(P.d, cam); P.d.scale.setScalar(p.dust.size * P.s * (.4 + .8 * easeOut(v * 2.2)) * (1 - .45 * v)); P.d.userData.set(1 - smooth((v - .5) / .5)); }
    // debris: ballistic arcs from the centre, tumbling
    for (const C of chips) { if (t < 0) { C.m.visible = false; continue; } const hz = C.v * t, vz = C.v * C.up * t - .5 * p.debris.gravity * t * t; C.m.visible = vz > -.05 && t < 1.6;
      const sideK = p.orient === 'ground' ? upL : Nn; tmp.copy(U).multiplyScalar(Math.cos(C.a) * hz).addScaledVector(V, Math.sin(C.a) * hz).addScaledVector(sideK, Math.max(vz, 0));
      C.m.position.copy(tmp); face(C.m, cam); C.m.rotateZ(C.spin * t); C.m.scale.setScalar(C.s); C.m.material.opacity = 1 - smooth((t - 1.1) / .5); }
  }
  update(-1e3);
  return { group: root, params: p, update, dispose: () => disposeRoot(root) };
}
export default makeShockwaveRing;

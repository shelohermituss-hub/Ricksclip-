// POWER FX 23: SPARK TRAIL (vfx-artist 2026-11-16). Rick: "the spark races" down the cart's rope, then "splits" into a golden fan of rays
// (How One Cart Stopped an Entire Army s51-54).
// DRAWN: a hot spark head (white core + coloured glow sprite) running along a 3D path, a glowing trail that cools behind it, a dark burnt line left
// on the rope, crackling spark points thrown off the head (seeded, ballistic, no state), and a ray_burst where the path ends.
// TIMING (t = seconds since the word, e.g. "races"):
//   build  -lead..0        the spark lights at the start point (a flare)
//   run    0..runTime      the head runs the whole path (slight acceleration), trail cools over `trailTime` s behind it
//   pop    runTime         the ray_burst fires at the path end (set runTime = the gap to the burst word, e.g. "splits")
//   settle runTime..+0.6   head and trail die, sparks fall, the burnt line stays (ashA)
// usage: makeSparkTrail(THREE, scene, [[x,y,z], ...], { plan: true, camera: () => R.camera, runTime: 1.1, burst: { color: LOOK.gold } })
//   path = Vector3s, arrays (three.js, or plan with plan: true), or a THREE.Curve.
import { clamp, smooth, rng, toV3, camOf, flatMat, glowSprite, glowTex, makeRoot, disposeRoot, makeStrips, placeRoot, hash } from './_core.mjs';
import { makeRayBurst } from './ray_burst.mjs';

export const DEFAULTS = {
  runTime: 1.0, lead: 0.12, trailTime: 0.35, accel: 0.25,
  width: 0.05, glowWidth: 3.2, headSize: 0.5,
  head: '#ffffff', color: '#ffc24a', glow: '#ff9a2a', ash: '#2a2018', ashA: 0.6,
  sparks: { rate: 55, speed: 1.8, life: 0.38, size: 0.07, color: '#ffe08a', gravity: 6, up: 0.6 },
  burst: { count: 26, length: 1.8, fan: 360, dur: 0.9 },        // null: no burst. Any ray_burst parameter.
  samples: 200, seed: 9, plan: false, camera: null,
};

export function makeSparkTrail(THREE, parent, path, params = {}) {
  const p = { ...DEFAULTS, ...params, sparks: params.sparks === null ? null : { ...DEFAULTS.sparks, ...(params.sparks || {}) }, burst: params.burst === null ? null : { ...DEFAULTS.burst, ...(params.burst || {}) } };
  const root = makeRoot(THREE, parent, 'fx_spark_trail');
  const curve = path && path.isCurve ? path : new THREE.CatmullRomCurve3(path.map(v => toV3(THREE, v, p.plan)), false, 'centripetal');
  const W = curve.getSpacedPoints(p.samples - 1), Ns = W.length;              // world points, equal arc length
  const strip = [{ pts: W.map(() => new THREE.Vector3()) }];
  const mk = (mat, order) => { const st = makeStrips(THREE, strip, mat); st.mesh.renderOrder = order; root.add(st.mesh); return st; };
  const ash = mk(flatMat(THREE, { offset: -1 }), 24), glow = mk(flatMat(THREE, { additive: true, offset: -2 }), 25), core = mk(flatMat(THREE, { additive: true, offset: -3 }), 26);
  // the head lies on the rope, half inside the floor: never let the floor hide it
  const headG = glowSprite(THREE, p.glow, { order: 33, depthTest: false }), headC = glowSprite(THREE, p.head, { order: 34, depthTest: false }); root.add(headG, headC);
  // sparks: one Points cloud, every spark a pure function of t
  const nSp = p.sparks ? Math.ceil(p.sparks.rate * (p.runTime + p.lead)) + 12 : 0, spG = new THREE.BufferGeometry(), spP = new Float32Array(Math.max(nSp, 1) * 3), spC = new Float32Array(Math.max(nSp, 1) * 3);
  spG.setAttribute('position', new THREE.BufferAttribute(spP, 3)); spG.setAttribute('color', new THREE.BufferAttribute(spC, 3));
  const spM = new THREE.PointsMaterial({ size: p.sparks ? p.sparks.size : .05, map: glowTex(THREE), vertexColors: true, transparent: true, depthWrite: false, toneMapped: false, fog: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  const pts = new THREE.Points(spG, spM); pts.frustumCulled = false; pts.renderOrder = 35; root.add(pts);
  const R = rng(p.seed), sv = [...Array(nSp)].map(() => { const a = R() * 6.283, z = R() * 2 - 1, r = Math.sqrt(1 - z * z); return [Math.cos(a) * r, z, Math.sin(a) * r, .4 + R() * .6]; });
  const burst = p.burst ? makeRayBurst(THREE, parent, W[Ns - 1].clone(), { ...p.burst, camera: p.camera }) : null;
  const cC = new THREE.Color(p.color), cH = new THREE.Color(p.head), cG = new THREE.Color(p.glow), cA = new THREE.Color(p.ash), cS = new THREE.Color(p.sparks ? p.sparks.color : '#fff');
  const invM = new THREE.Matrix4(), zero = new THREE.Vector3(), cpos = new THREE.Vector3(), toCam = new THREE.Vector3(), gL = new THREE.Vector3(), tmp = new THREE.Vector3();
  const sAt = tt => { const u = clamp(tt / p.runTime); return clamp(u * (1 - p.accel) + u * u * p.accel); };
  const ptAt = (s, out) => { const x = s * (Ns - 1), i = Math.min(Ns - 2, Math.floor(x)); return out.lerpVectors(strip[0].pts[i], strip[0].pts[i + 1], x - i); };

  function update(t, camera) {
    const cam = camOf(p, camera), invQ = placeRoot(THREE, root, zero.set(0, 0, 0)); root.updateWorldMatrix(true, false); invM.copy(root.matrixWorld).invert();
    for (let i = 0; i < Ns; i++) strip[0].pts[i].copy(W[i]).applyMatrix4(invM);
    if (cam) { cam.updateMatrixWorld(); cam.getWorldPosition(cpos).applyMatrix4(invM); }
    gL.set(0, -1, 0).applyQuaternion(invQ);
    if (burst) burst.update(t - p.runTime, camera);
    const on = t >= -p.lead; root.visible = on; if (!on) return;
    const S = t < 0 ? 0 : sAt(t), die = t > p.runTime ? Math.exp(-(t - p.runTime) / .18) : 1, tf = p.trailTime / p.runTime;
    const kAt = i => { const u = i / (Ns - 1), b = S - u; return b < -1e-6 || t < 0 ? 0 : Math.exp(-b / Math.max(tf, 1e-3)) * die; };
    const side = (out, pt, tg) => { if (cam) { toCam.subVectors(cpos, pt); out.crossVectors(tg, toCam); } else out.set(-tg.y, tg.x, 0); if (out.lengthSq() < 1e-10) out.set(0, 1, 0); return out.normalize(); };
    const burnt = i => (t >= 0 && i / (Ns - 1) <= S ? 1 : 0);
    ash.update((s, i) => p.width * .8 * burnt(i), (s, i, c) => { c[0] = cA.r; c[1] = cA.g; c[2] = cA.b; c[3] = p.ashA; }, side);
    glow.update((s, i) => p.width * p.glowWidth * Math.sqrt(kAt(i)), (s, i, c) => { const k = kAt(i); c[0] = cG.r; c[1] = cG.g; c[2] = cG.b; c[3] = clamp(.55 * k); }, side);
    core.update((s, i) => p.width * (.5 + .7 * kAt(i)) * (kAt(i) > .02 ? 1 : 0), (s, i, c) => { const k = kAt(i), h = k * k; c[0] = (cC.r + (cH.r - cC.r) * h) * k; c[1] = (cC.g + (cH.g - cC.g) * h) * k; c[2] = (cC.b + (cH.b - cC.b) * h) * k; c[3] = clamp(k * 1.2); }, side);
    // head
    ptAt(S, tmp); headG.position.copy(tmp); headC.position.copy(tmp);
    const fl = .85 + .15 * Math.sin(t * 47) * Math.sin(t * 29 + 1), ign = t < 0 ? smooth((t + p.lead) / p.lead) : 1, hk = ign * die * fl;
    headG.scale.setScalar(p.headSize * (t < 0 ? 1.6 : 1) * fl); headG.material.opacity = clamp(hk); headC.scale.setScalar(p.headSize * .35 * fl); headC.material.opacity = clamp(hk * 1.2);
    // sparks thrown off the head
    for (let j = 0; j < nSp; j++) { const te = -p.lead + j / p.sparks.rate, a = t - te, life = p.sparks.life * sv[j][3], q = j * 3;
      if (a < 0 || a > life || te > p.runTime) { spC[q] = spC[q + 1] = spC[q + 2] = 0; spP[q] = spP[q + 1] = spP[q + 2] = 0; continue; }
      ptAt(te < 0 ? 0 : sAt(te), tmp); const v = p.sparks.speed * sv[j][3];
      spP[q] = tmp.x + (sv[j][0] * v - gL.x * v * p.sparks.up) * a + .5 * gL.x * p.sparks.gravity * a * a;
      spP[q + 1] = tmp.y + (sv[j][1] * v - gL.y * v * p.sparks.up) * a + .5 * gL.y * p.sparks.gravity * a * a;
      spP[q + 2] = tmp.z + (sv[j][2] * v - gL.z * v * p.sparks.up) * a + .5 * gL.z * p.sparks.gravity * a * a;
      const k = (1 - a / life) * (.6 + .4 * hash(j, Math.floor(t * 30))); spC[q] = cS.r * k; spC[q + 1] = cS.g * k; spC[q + 2] = cS.b * k; }
    spG.attributes.position.needsUpdate = spG.attributes.color.needsUpdate = true;
  }
  update(-1e3);
  return { group: root, burst, params: p, update, dispose: () => { if (burst) burst.dispose(); disposeRoot(root); } };
}
export default makeSparkTrail;

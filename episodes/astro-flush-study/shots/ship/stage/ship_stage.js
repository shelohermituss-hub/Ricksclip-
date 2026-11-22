// ship_stage.js: the ship stretch's thin wrapper around sets/ship.js (set builder's module, used unchanged). NO geometry: it builds the set through
// ship.js (flame / preglow / glitter / glitter_ck / comm / digits / starmap / ship / earth_rot / earth_glare / fans / fan stay ship.js keys, written per frame)
// and then, every frame, moves the set's own objects BY NAME:
//   film.json places.ship.stage = {
//     earth: [[f, x, y, z, R], ...]   Earth centre and radius in Blender metres (the real far place, ~3000 m); Catmull-Rom between keys. Every frame the
//                                     Earth is put at 450 m from the CAMERA on the same ray, radius scaled the same (same picture, inside the kit's far plane)
//     sky_follow: true                sky_dome centred on the camera (stars stay at infinity while the camera travels 200 m)
//     lamp_pulse: [period_f, lo]      comm_lamp_on brightness pulses (sine) while it is on
//     float: { name: { f0, v: [m/s], spin: [deg/s], bob: m } }   free floating set props drift from their rest (eased start over 12 f)
//   }
import { build as buildShip, ANCHORS, CAMS } from './ship.js';
export { ANCHORS, CAMS };
export async function build(THREE, scene, film, ctx) {
  const B = await buildShip(THREE, scene, film, ctx), ST = (ctx.place && ctx.place.stage) || {};
  const V = p => ctx.B2T(p), D2R = Math.PI / 180, N = n => scene.getObjectByName(n);
  const earth = N('earth'), sky = N('sky_dome'), lamp = N('comm_lamp_on');
  const lampMats = []; if (lamp) lamp.traverse(m => { if (m.isMesh && m.material) { m.material = m.material.clone(); lampMats.push([m.material, m.material.emissiveIntensity ?? 1, m.material.color ? m.material.color.clone() : null]); } });
  const rest = {}; for (const n of Object.keys(ST.float || {})) { const o = N(n); if (o) rest[n] = { p: o.position.clone(), q: o.quaternion.clone() }; }
  const EK = ST.earth || [];
  function cr(f) {   // Catmull-Rom through the earth keys (uniform), held outside
    if (!EK.length) return null; if (f <= EK[0][0]) return EK[0].slice(1); if (f >= EK[EK.length - 1][0]) return EK[EK.length - 1].slice(1);
    let i = 0; while (f > EK[i + 1][0]) i++; const k0 = EK[Math.max(0, i - 1)], k1 = EK[i], k2 = EK[i + 1], k3 = EK[Math.min(EK.length - 1, i + 2)], u = (f - k1[0]) / (k2[0] - k1[0]);
    return k1.slice(1).map((_, j) => { const p0 = k0[j + 1], p1 = k1[j + 1], p2 = k2[j + 1], p3 = k3[j + 1];
      return .5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u); }); }
  function update(f, t, R) {
    B.update(f, t, R); const cam = R && R.camera;
    if (cam) cam.updateMatrixWorld();
    const e = cr(f);
    if (earth && e && cam) { const P = V(e.slice(0, 3)), d = P.clone().sub(cam.position), L = d.length(), k = 450 / L;
      earth.position.copy(cam.position).add(d.multiplyScalar(k)); earth.scale.setScalar(e[3] * k); }
    if (sky && ST.sky_follow && cam) sky.position.copy(cam.position);
    if (lampMats.length && ST.lamp_pulse) { const [T, lo] = ST.lamp_pulse, s = lo + (1 - lo) * (.5 + .5 * Math.sin(2 * Math.PI * f / T));
      for (const [m, e0, c0] of lampMats) { if (m.emissiveIntensity !== undefined) m.emissiveIntensity = e0 * s; else if (c0) m.color.copy(c0).multiplyScalar(s); } }
    for (const [n, F] of Object.entries(ST.float || {})) { const o = N(n), r = rest[n]; if (!o || !r) continue;
      const dt = Math.max(0, f - (F.f0 ?? 0)), ease = dt < 12 ? dt * dt / 24 : dt - 6, s = ease / 30;   // eased start: velocity ramps over 12 f
      o.position.copy(r.p).add(V(F.v.map(x => x * s)).sub(V([0, 0, 0])));
      o.position.y += (F.bob ?? .02) * Math.sin(2 * Math.PI * f / 70 + n.length);
      const sp = (F.spin || [0, 0, 0]).map(x => x * s * D2R); o.quaternion.copy(r.q).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(sp[0], sp[2], -sp[1]))); }
  }
  return { ...B, update };
}

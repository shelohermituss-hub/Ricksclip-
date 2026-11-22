// toilet_stage.js: the toilet stretch's thin wrapper around sets/toilet.js (set builder's module, used unchanged). NO geometry: it builds the set
// through toilet.js (light / glow / door / hatch / pulse / paper keys stay toilet.js keys) and then, every frame, moves the set's own movers BY NAME:
//   film.json places.toilet.stage = {
//     near: { to: F, x: X }      frames <= F: camera near plane pushed to the plane Blender x = X (looking +x) = the pull-back out through the porthole wall
//                                (the set builder's cam f33 "clip"); near .05 otherwise
//     lever: [[f, deg], ...]     toilet_flush_lever turned about Blender Y by deg, smoothstep between keys
//     roll: { v: [m/s], spin: [deg/s], pull: [f0, f1], to: [x, y, z] }   paper_roll_float drifts from its rest, then is pulled (eased) to "to"
//     ribbon: { f: [f0, f1], pivot: [x, y, z], hide: f }                   paper_ribbon is drawn into the bowl (scaled about pivot, eased) and hidden from "hide"
//     explode: { f: f0, n: frames, delay: frames, order: [names...], float: m }  every toilet part with an "exploded" target goes rest -> exploded on its own
//                                delay (ease out), then hangs with a slow float (amplitude m)
//     floor: { from: F0, to: F1, z: Z }   frames F0..F1: near plane pushed past the floor slab (Blender z from Z to 0) while the camera dives down through it
//     pulse_light: [[f, k], ...]  toilet_pulse_light intensity and hose_pulse glow scaled by k (smoothstep between keys): no blown-out white at the flange
//   }
import { build as buildToilet, ANCHORS, CAMS, MOVERS, FRAMES } from './toilet.js';
export { ANCHORS, CAMS, MOVERS, FRAMES };
export async function build(THREE, scene, film, ctx) {
  const B = await buildToilet(THREE, scene, film, ctx), ST = (ctx.place && ctx.place.stage) || {};
  const V = p => (ctx.B2T ? ctx.B2T(p) : new THREE.Vector3(p[0], p[2], -p[1])), D2R = Math.PI / 180;
  const Q = r => { const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(r[0] * D2R, r[1] * D2R, r[2] * D2R, 'ZYX')); return new THREE.Quaternion(q.x, q.z, -q.y, q.w); };
  const N = n => scene.getObjectByName(n), ss = u => { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }, eo = u => { u = Math.max(0, Math.min(1, u)); return 1 - Math.pow(1 - u, 3); };
  const keyed = (K, f) => { if (!K || !K.length) return 0; if (f <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (f <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * ss((f - a) / (b - a)); } return K[K.length - 1][1]; };
  const AXY = new THREE.Vector3(0, 0, -1);   // Blender +Y in three axes
  const lerp = (a, b, u) => a + (b - a) * u;
  const EX = Object.entries(MOVERS).filter(([n, m]) => m.exploded);
  const order = (ST.explode && ST.explode.order) || EX.map(([n]) => n);
  function update(f, t, R) {
    B.update(f, t, R);
    // camera near plane (the pull-back through the porthole wall)
    if (R && R.camera) { const c = R.camera; let nr = ST.near && f <= ST.near.to ? Math.max(.05, ST.near.x - c.position.x) : .05;
      if (ST.floor && f >= ST.floor.from && f <= ST.floor.to) { const fw = new THREE.Vector3(); c.getWorldDirection(fw); const top = 0.02 - c.position.y, bot = ST.floor.z - .02 - c.position.y;   // three y = Blender z
        if (c.position.y > ST.floor.z - .02 && fw.y < -.05) nr = Math.max(nr, Math.min(4, (c.position.y - ST.floor.z + .02) / -fw.y)); } if (Math.abs(c.near - nr) > 1e-6) { c.near = nr; c.updateProjectionMatrix(); } }
    // exploded view, part by part
    if (ST.explode) { const E = ST.explode;
      for (const [n, m] of EX) { const o = N(n); if (!o) continue; const k = Math.max(0, order.indexOf(n)), u = eo((f - E.f - k * (E.delay ?? 1)) / (E.n ?? 7));
        const fl = u >= 1 ? (E.float ?? .015) * Math.sin(2 * Math.PI * (f - E.f) / 50 + k * 1.7) : 0, fr = u >= 1 ? 2.5 * Math.sin(2 * Math.PI * (f - E.f) / 64 + k) : 0;
        o.position.copy(V(m.loc)).lerp(V(m.exploded.loc), u); o.position.y += fl * u; o.quaternion.copy(Q(m.rot)).slerp(Q([m.exploded.rot[0], m.exploded.rot[1] + fr, m.exploded.rot[2]]), u);
        const s0 = m.scale || [1, 1, 1], s1 = m.exploded.scale || s0; o.scale.set(lerp(s0[0], s1[0], u), lerp(s0[2], s1[2], u), lerp(s0[1], s1[1], u)); } }
    if (ST.pulse_light) { const k = keyed(ST.pulse_light, f), L = N('toilet_pulse_light'), hp = N('hose_pulse'); if (L) L.intensity *= k; if (hp) hp.scale.setScalar(Math.max(.05, k)); }
    // flush lever
    if (ST.lever) { const o = N('toilet_flush_lever'); if (o) o.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(AXY, keyed(ST.lever, f) * D2R)); }
    // floating paper roll, then pulled to the bowl
    if (ST.roll) { const o = N('paper_roll_float'), m = MOVERS.paper_roll_float, r = ST.roll; if (o && m) { const P = r.pull || [1e9, 1e9], k = Math.min(f, P[0]) / 30;
        const p0 = V(m.loc.map((x, i) => x + r.v[i] * k)), u = ss((f - P[0]) / (P[1] - P[0])); o.position.copy(p0).lerp(V(r.to), u);
        const sp = f / 30 * (1 + 3 * u); o.quaternion.copy(Q(m.rot)).multiply(Q(r.spin.map(x => x * sp))); } }
    if (ST.ribbon) { const o = N('paper_ribbon'), r = ST.ribbon; if (o && o.visible) { const u = ss((f - r.f[0]) / (r.f[1] - r.f[0])), s = 1 - .95 * u, pv = V(r.pivot);
        o.scale.setScalar(s); o.position.copy(pv).multiplyScalar(1 - s); if (f >= r.hide) o.visible = false; } }
  }
  return { ...B, update };
}

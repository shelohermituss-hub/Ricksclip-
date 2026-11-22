// cab_stage.js: the cabin stretch's thin wrapper around sets/cabin.js (set builder's module, used unchanged). NO geometry: it builds the set
// through cabin.js and then, every frame, moves the set's own movers BY NAME (cabin.js mover(name)):
//   film.json places.cabin.held: [{ obj, who, hand: 0|1, off: [x, y, z] (plan m, + toward the lens added), spin: [rx, ry, rz] deg,
//                                   toss: { f, v: [m/s plan], spin: [deg/s] } }]   -> the mover sits ON that card hand (window.handWorld) until toss.f, then floats free
//   { obj, who: null, drift: { f, v, spin } }   -> a free floating mover drifts slowly from its rest (weightless room)
import { build as buildCabin, ANCHORS, CAMS, MOVERS, FRAMES, MONITOR } from './cabin.js';
export { ANCHORS, CAMS, MOVERS, FRAMES, MONITOR };
export async function build(THREE, scene, film, ctx) {
  const B = await buildCabin(THREE, scene, film, ctx), HELD = (ctx.place && ctx.place.held) || [];
  const V = p => (ctx.B2T ? ctx.B2T(p) : new THREE.Vector3(p[0], p[2], -p[1])), D2R = Math.PI / 180;
  const Q = r => { const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(r[0] * D2R, r[1] * D2R, r[2] * D2R, 'ZYX')); return new THREE.Quaternion(q.x, q.z, -q.y, q.w); };
  const R0 = {}, last = {};
  for (const h of HELD) { const o = B.mover(h.obj); if (!o) { console.warn('cab_stage: the set has no mover ' + h.obj); continue; } R0[h.obj] = { p: o.position.clone(), q: o.quaternion.clone() }; }
  const handAt = (h, f) => { const w = window.handWorld && window.handWorld(h.who, f); if (!w || !w.hands) return null; const p = w.hands[h.hand ?? 0] || w.hands[0];
    const cam = window.__camPos ? window.__camPos(f) : null; return p; };
  function place(f) {
    for (const h of HELD) { const o = B.mover(h.obj), r = R0[h.obj]; if (!o || !r) continue;
      if (!h.who) { const d = h.drift, k = Math.max(0, f - d.f) / 30; o.position.copy(r.p).add(V(d.v.map(x => x * k))); o.quaternion.copy(r.q).multiply(Q(d.spin.map(x => x * k))); continue; }
      const tf = h.toss ? h.toss.f : 1e9, fh = Math.min(f, tf), p = handAt(h, fh); if (!p) continue;
      const off = h.off || [0, 0, 0], base = V([p[0] + off[0], p[1] + off[1] - .06, p[2] + off[2]]);   // 6 cm toward the lens side (-y): in front of the card
      o.position.copy(base); o.quaternion.copy(r.q).multiply(Q(h.spin || [0, 0, 0]));
      if (f > tf) { const k = (f - tf) / 30, ease = k < .2 ? k * k / .4 : k - .1; o.position.add(V(h.toss.v.map(x => x * ease))); o.quaternion.multiply(Q(h.toss.spin.map(x => x * ease))); }
    }
  }
  function update(f, t, R) { B.update(f, t); place(f); }
  return { ...B, update };
}

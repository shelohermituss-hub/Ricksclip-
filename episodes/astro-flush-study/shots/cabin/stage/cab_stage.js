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
      const tf = h.toss ? h.toss.f : 1e9, p = handAt(h, Math.min(f, tf)); if (!p) continue;
      const off = h.off || [0, 0, 0], at = q => V([q[0] + off[0], q[1] + off[1] - .06, q[2] + off[2]]);   // 6 cm toward the lens side (-y): in front of the card
      o.position.copy(at(p)); o.quaternion.copy(r.q).multiply(Q(h.spin || [0, 0, 0]));
      if (f > tf) {   // round 2: free drift starts with the hand's own velocity at the release (no jump), plus the toss push eased in, and keeps turning
        const p0 = handAt(h, tf - 1) || p, vh = [0, 1, 2].map(i => (p[i] - p0[i]) * 30 * (h.toss.carry ?? 1)), k = (f - tf) / 30;
        const kh = (1 - Math.exp(-k * 2.5)) / 2.5, kt = k < .25 ? k * k / .5 : k - .125;        // hand speed fades (weightless drag), the push eases in over 0.25 s
        o.position.add(V([0, 1, 2].map(i => vh[i] * kh + h.toss.v[i] * kt))); o.quaternion.multiply(Q(h.toss.spin.map(x => x * kt)));
      }
    }
  }
  // round 2: the monitor placeholder breathes a little (emission +-amp, a slow pulse) so the frames it fills are not held; the lead feeds the real picture later
  const ML = ctx.place && ctx.place.monitor_live, mon = B.mover('cabin_monitor_pic'), m0 = mon && mon.material ? mon.material.emissiveIntensity : 1;
  // round 2: UPRIGHT cards for the sleepers. The kit tips every card to face the lens about its feet; from his high f430 camera (16 deg down) that
  // leaned the heads 0.38 m back into the bag wall and headrest pad (no head seen). In the bags the card stays vertical on the bag plane (only the
  // tip is taken off, eased back in over the "release" frames). film.json places.cabin.upright: [{ who, f1 (tip back from here), n (frames) }]
  const UP = (ctx.place && ctx.place.upright) || [], sm = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
  function update(f, t, R) { B.update(f, t); place(f);
    for (const u of UP) { const c = R && R.cards && R.cards[u.who]; if (!c || !c.mesh) continue; c.mesh.rotation.x *= sm((f - (u.f1 ?? 1e9)) / (u.n || 12)); } if (ML && mon && mon.material) mon.material.emissiveIntensity = m0 * (1 + ML.amp * Math.sin(2 * Math.PI * f / ML.period)); }
  return { ...B, update };
}

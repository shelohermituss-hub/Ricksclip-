// POWER FX 19: RAY BURST (vfx-artist 2026-11-16). Rick: light rays burst from the stump as the tree falls ("truck", The Instinct That Makes You Crash s33),
// and the golden fan of rays when the cart's fuse splits into 82 ("splits ... tiny", How One Cart Stopped an Entire Army s52-54).
// DRAWN: sharp tapered spikes (long and short alternate), each a bright thin core over a wide soft glow, fanned round a point, with a hot flash sprite.
// TIMING (t = seconds since the word):
//   build  -lead..0   a pin-point gathers (flash grows to 35 %), rays are stubs
//   pop    0..grow    rays shoot to full length with an overshoot ease (3 frames at grow 0.09), flash full on the word frame
//   settle grow..dur  rays thin to nothing and fade, keep creeping out 15 %, turn slowly (spin), flicker per ray; flash decays in `flash.life`
// usage: const rays = makeRayBurst(THREE, scene, ctx.B2T([0, 2, 1.4]), { camera: () => R.camera, color: LOOK.gold }); rays.update((f - F_WORD) / 30);
import { clamp, lerp, smooth, easeOutBack, rng, toV3, toDir, camOf, flatMat, glowSprite, makeRoot, disposeRoot, placeRoot, billboard } from './_core.mjs';

export const DEFAULTS = {
  count: 22, length: 3, lengthJitter: 0.5, longShort: 0.55,   // metres; every second ray is longShort as long
  width: 0.2, innerRadius: 0.12,                              // base width (metres) and the gap round the centre (share of length)
  fan: 360, dir: 90,                                          // spread and centre direction in degrees in the burst's plane (90 = up on screen)
  orient: 'camera',                                           // 'camera' (faces the lens), 'ground', or a normal [x, y, z]
  color: '#ffd45e', core: '#fffbe8', glowK: 0.45, glowWidth: 2.6,   // ray glow colour, hot core colour, glow strength and width factor
  blend: 'additive',                                          // 'additive' (dark or dusk) or 'normal' (flat colour in bright day, where additive washes out)
  ink: null,                                                  // '#..' draws a thin dark ink edge round each spike (normal blend only)
  lead: 0.1, grow: 0.09, dur: 0.95, spin: 5,                  // seconds; spin in degrees per second
  flash: { color: '#fff6dc', size: 2.2, life: 0.12 },
  seed: 11, plan: false, camera: null,
};

export function makeRayBurst(THREE, parent, at, params = {}) {
  const p = { ...DEFAULTS, ...params, flash: { ...DEFAULTS.flash, ...(params.flash || {}) } };
  const root = makeRoot(THREE, parent, 'fx_ray_burst'), R = rng(p.seed), centre = new THREE.Vector3(), plane = new THREE.Group(); root.add(plane);
  const add = p.blend !== 'normal';
  const rays = [...Array(p.count)].map((_, i) => { const k = p.count > 1 ? i / (p.fan >= 360 ? p.count : p.count - 1) : .5, a = (p.dir - p.fan / 2 + p.fan * k + (R() - .5) * p.fan / p.count * .7) * Math.PI / 180;
    return { a, L: p.length * (i % 2 ? p.longShort : 1) * (1 - p.lengthJitter * .5 + R() * p.lengthJitter * .5), w: .7 + R() * .6, ph: R() * 6.28 }; });
  // one geometry per layer: a triangle per ray (base on the inner circle, tip far out); 4-channel vertex colours fade the tip
  function layer(widthK, order, colorBase, colorTip, alphaBase, alphaTip, additive, offset) {
    const g = new THREE.BufferGeometry(), P = new Float32Array(p.count * 9), C = new Float32Array(p.count * 12), cb = new THREE.Color(colorBase), ct = new THREE.Color(colorTip);
    for (let i = 0; i < p.count; i++) { C.set([cb.r, cb.g, cb.b, alphaBase, cb.r, cb.g, cb.b, alphaBase, ct.r, ct.g, ct.b, alphaTip], i * 12); }
    g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('color', new THREE.BufferAttribute(C, 4));
    const m = new THREE.Mesh(g, flatMat(THREE, { vertexColors: true, additive, offset })); m.renderOrder = order; m.frustumCulled = false; plane.add(m);
    return { m, widthK, set(len, wid, rot, flick) { for (let i = 0; i < p.count; i++) { const r = rays[i], a = r.a + rot, c = Math.cos(a), s = Math.sin(a), L = r.L * len, r0 = p.innerRadius * p.length * Math.min(1, len + .2), hw = p.width * r.w * wid * widthK * .5 * flick[i];
      P.set([c * r0 - s * hw, s * r0 + c * hw, 0, c * r0 + s * hw, s * r0 - c * hw, 0, c * (r0 + L), s * (r0 + L), 0], i * 9); }
      g.attributes.position.needsUpdate = true; } };
  }
  const L = [];
  if (p.ink && !add) L.push(layer(1.5, 25, p.ink, p.ink, 1, .9, false, -1));
  L.push(layer(p.glowWidth, 26, p.color, p.color, p.glowK, 0, true, -2));
  L.push(layer(1, 27, p.core, p.color, 1, add ? .05 : .55, add, -3));
  const flash = glowSprite(THREE, p.flash.color, { order: 32 }); root.add(flash);
  const flick = new Float32Array(p.count); let invQ = new THREE.Quaternion(); const wq = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);

  function update(t, camera) {
    const cam = camOf(p, camera); toV3(THREE, at, p.plan, centre, t); invQ = placeRoot(THREE, root, centre);
    if (p.orient === 'camera') { if (cam) billboard(plane, cam, invQ); }
    else { if (p.orient === 'ground') wq.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2); else wq.setFromUnitVectors(new THREE.Vector3(0, 0, 1), toDir(THREE, p.orient, p.plan, up)); plane.quaternion.copy(wq).premultiply(invQ); }
    const on = t >= -p.lead && t <= p.dur + .05; root.visible = on; if (!on) return;
    let len, wid, op;
    if (t < 0) { const b = smooth((t + p.lead) / p.lead); len = .05 + .1 * b; wid = .4 * b; op = b * .7; }
    else if (t < p.grow) { len = easeOutBack(t / p.grow, 2.2); wid = 1.15; op = 1; }
    else { const u = (t - p.grow) / Math.max(p.dur - p.grow, 1e-3); len = 1 + .15 * u; wid = 1.15 * (1 - u) * (1 - u) + .02; op = 1 - smooth((u - .35) / .65); }
    for (let i = 0; i < p.count; i++) flick[i] = .85 + .15 * Math.sin(t * 31 + rays[i].ph);
    const rot = p.spin * Math.PI / 180 * Math.max(t, 0);
    for (const l of L) { l.set(Math.max(len, 0), Math.max(wid, 0), rot, flick); l.m.material.opacity = clamp(op); }
    const fl = t < 0 ? .35 * smooth((t + p.lead) / p.lead) : Math.exp(-t / p.flash.life); flash.material.opacity = clamp(fl);
    flash.scale.setScalar(p.flash.size * (t < 0 ? .25 + .3 * smooth((t + p.lead) / p.lead) : 1 + 1.5 * t));
  }
  update(-1e3);
  return { group: root, params: p, update, dispose: () => disposeRoot(root) };
}
export default makeRayBurst;

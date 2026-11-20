// POWER FX 22: SPIRAL EYES (vfx-artist 2026-11-16). Rick: the sheriff stares at the tree, "onto it ... let go", and his eyes become glowing hypnotised
// spirals (The Instinct That Makes You Crash s53-54).
// DRAWN: one spiral disc per eye laid ON the character's own card (same plane, a hair toward the lens): two flat colours in an Archimedean spiral,
// a dark pupil dot, a thin ink ring; it turns. A soft additive glow sits round EACH EYE ONLY (CB face rule: no coloured rim on faces);
// its strength is a parameter, and so is `cardWarm` (0 by default), which warms the whole card for a film whose LOOK_BIBLE allows it.
// TIMING (t = seconds since the word):
//   build  -lead..0     small discs shimmer in (30 %)
//   pop    0..0.18      discs pop to full size with an overshoot, the eye glow flashes 1.8x
//   hold   ..end        the spiral spins up to `spin` turns/s in ~0.3 s, the glow breathes at 1.5 Hz
//   settle end..+fade   discs shrink to nothing (the drawn eyes come back)
// usage: const se = makeSpiralEyes(THREE, scene, R.cards.sheriff, { camera: () => R.camera }); se.update((f - F_WORD) / 30)
//   target = a kit card ({ mesh, m, k, entry } from R.cards[who]) or { eyes: [p1, p2] } (world points, Object3Ds or a function of t).
import { clamp, smooth, easeOutBack, toV3, camOf, glowSprite, makeRoot, disposeRoot, placeRoot } from './_core.mjs';

export const DEFAULTS = {
  eyeOffset: [[-0.36, 0.06], [0.36, 0.06]],   // card mode: eye centres in head radii from the head centre (x right, y up); one entry for a side view
  headDrop: 0.95,                              // card mode: head centre = height - headDrop * head radius
  size: null,                                  // disc radius in metres (default 0.27 head radius)
  front: 0.02,                                 // metres toward the lens
  colorA: '#fff1c2', colorB: '#f08a1c', ink: '#1a1018', arms: 2, turns: 2.6, spin: 1.6, bright: 1.25,
  glow: { color: '#ffb04a', size: 2.6, strength: 0.55 },
  cardWarm: 0, warmColor: '#ffc890',
  lead: 0.1, end: null, fade: 0.25,
  seed: 1, plan: false, camera: null,
};

const VS = `varying vec2 vUv; void main(){ vUv = uv * 2. - 1.; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`;
const FS = `
uniform vec3 uA, uB, uInk; uniform float uPh, uArms, uTurns, uBright, uOp; varying vec2 vUv;
void main(){
  float r = length(vUv); if (r > 1.) discard;
  float a = atan(vUv.y, vUv.x + 1e-5);
  float s = sin(6.28318 * (a / 6.28318 * uArms + r * uTurns - uPh));
  float band = smoothstep(-.18, .18, s);
  vec3 c = mix(uB, uA * uBright, band);
  c = mix(c, uA * uBright * 1.15, smoothstep(.3, .0, r) * .5);       // hot centre
  float ink = max(smoothstep(.84, .88, r), smoothstep(.11, .08, r));  // ink rim and pupil dot
  c = mix(c, uInk, ink);
  gl_FragColor = vec4(c, uOp * (1. - smoothstep(.97, 1., r)));
}`;

export function makeSpiralEyes(THREE, parent, target, params = {}) {
  const p = { ...DEFAULTS, ...params, glow: { ...DEFAULTS.glow, ...(params.glow || {}) } };
  const root = makeRoot(THREE, parent, 'fx_spiral_eyes'), card = target && target.mesh && target.m ? target : null, pts = !card && target ? (target.eyes || target) : null;
  const nEyes = card ? p.eyeOffset.length : (typeof pts === 'function' ? 2 : pts.length);
  const headR = card ? card.m.headPx * card.k * .5 : .12, rad = p.size ?? headR * .27;
  const eyes = [...Array(nEyes)].map((_, i) => {
    const mat = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false, toneMapped: false, fog: false, side: THREE.DoubleSide,
      uniforms: { uA: { value: new THREE.Color(p.colorA) }, uB: { value: new THREE.Color(p.colorB) }, uInk: { value: new THREE.Color(p.ink) }, uPh: { value: 0 }, uArms: { value: p.arms }, uTurns: { value: p.turns }, uBright: { value: p.bright }, uOp: { value: 0 } } });
    const disc = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); disc.renderOrder = 40; disc.frustumCulled = false;
    const glow = glowSprite(THREE, p.glow.color, { order: 39 }); root.add(glow, disc); return { disc, glow };
  });
  const w = new THREE.Vector3(), cpos = new THREE.Vector3(), q = new THREE.Quaternion(), toCam = new THREE.Vector3(), warm = new THREE.Color(p.warmColor), zero = new THREE.Vector3(), invM = new THREE.Matrix4();

  function eyeWorld(i, t, out) {
    if (!card) { const arr = typeof pts === 'function' ? pts(t) : pts; return toV3(THREE, arr[i], p.plan, out, t); }
    const m = card.mesh, h = card.entry.height || 1.7, hc = h - p.headDrop * headR, o = p.eyeOffset[i];
    m.updateWorldMatrix(true, false);
    return out.set(o[0] * headR / Math.abs(m.scale.x || 1) * Math.sign(m.scale.x || 1), (hc + o[1] * headR) / (m.scale.y || 1), 0).applyMatrix4(m.matrixWorld);
  }

  function update(t, camera) {
    const cam = camOf(p, camera), invQ = placeRoot(THREE, root, zero.set(0, 0, 0)); root.updateWorldMatrix(true, false); invM.copy(root.matrixWorld).invert();
    const on = t >= -p.lead && !(p.end != null && t > p.end + p.fade) && !(card && !card.mesh.visible); root.visible = on; if (!on) return;
    let s, g;
    if (t < 0) { const b = smooth((t + p.lead) / p.lead); s = .3 * b; g = .3 * b; }
    else { s = t < .18 ? easeOutBack(t / .18, 2.2) : 1; g = 1 + .8 * Math.exp(-t / .12) + .12 * Math.sin(t * 9.4); }
    if (p.end != null && t > p.end) { const u = smooth((t - p.end) / p.fade); s *= 1 - u; g *= 1 - u; }
    const tau = .3, ph = p.spin * (Math.max(t, 0) - tau * (1 - Math.exp(-Math.max(t, 0) / tau)));
    if (card) { card.mesh.getWorldQuaternion(q); } else if (cam) { cam.updateMatrixWorld(); cam.getWorldQuaternion(q); }
    if (cam) cam.getWorldPosition(cpos);
    eyes.forEach((E, i) => {
      eyeWorld(i, t, w); if (cam) { toCam.subVectors(cpos, w).normalize(); w.addScaledVector(toCam, p.front); }
      w.applyMatrix4(invM);
      E.disc.position.copy(w); E.disc.quaternion.copy(q).premultiply(invQ); E.disc.scale.setScalar(Math.max(rad * s, 1e-5));
      E.disc.material.uniforms.uPh.value = ph; E.disc.material.uniforms.uOp.value = clamp(s * 4);
      E.glow.position.copy(w); E.glow.scale.setScalar(Math.max(rad * p.glow.size * 2, 1e-5)); E.glow.material.opacity = clamp(p.glow.strength * g);
    });
    if (card && p.cardWarm > 0) card.mesh.material.color.lerp(warm, clamp(p.cardWarm * Math.min(g, 1)));   // the kit sets the card colour every frame before the set update, so this never accumulates
  }
  update(-1e3);
  return { group: root, params: p, update, dispose: () => disposeRoot(root) };
}
export default makeSpiralEyes;

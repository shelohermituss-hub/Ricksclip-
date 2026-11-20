// POWER FX 21: AURA (vfx-artist 2026-11-16). Rick: on "bench" a big dark shadow-aura grows behind the angry inmate (The Pink Prison Cell Experiment s51).
// DRAWN: one flat silhouette behind the character card, a body-shaped blob whose top breaks into flame tongues that lick upward; flat fill,
// a lighter rim band just inside its edge, an optional soft outer glow. Not a light: it never touches the card or the face.
// TIMING (t = seconds since the word):
//   build  -lead..0     a small dark blob swells from the feet up
//   pop    0..grow      grows past full size (overshoot ease) and lands; the flames start to lick
//   hold   grow..end    flickers (noise flames rising at `speed`), breathes 3 % at 1.6 Hz
//   settle end..+fade   shrinks 15 % and fades (end: null keeps it)
// usage: const au = makeAura(THREE, scene, R.cards.inmate.mesh, { camera: () => R.camera, height: 1.8, color: LOOK.shadow }); au.update((f - F_WORD) / 30)
import { clamp, smooth, easeOutBack, toV3, camOf, makeRoot, disposeRoot, placeRoot, billboard } from './_core.mjs';

export const DEFAULTS = {
  height: 1.75,            // the character's height in metres (a kit card: card.entry.height)
  scale: 1.5, width: 0.9, // aura height as a share of the character, and width as a share of its own height
  behind: 0.3,             // metres behind the card, away from the lens
  lift: 0.0,               // metres up from the target's feet
  color: '#2b1a3c', rim: '#5a3a78', rimWidth: 0.05, opacity: 0.88, glow: '#7a4aa8', glowA: 0.0,
  flames: 5, flameH: 0.24, speed: 1.3, wobble: 0.16,
  lead: 0.15, grow: 0.35, end: null, fade: 0.4,
  blend: 'normal',         // 'normal' = a dark shape (Rick); 'additive' = a glowing coloured aura (then pick a light colour)
  seed: 3, plan: false, camera: null,
};

const VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`;
const FS = `
uniform vec3 uCol, uRim, uGlow; uniform float uT, uOp, uRimW, uGlowA, uFlames, uFlameH, uWob, uSeed, uW;
varying vec2 vUv;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
void main(){
  vec2 p = vUv - vec2(.5, 0.);                                   // x across (-.5..5), y up from the feet (0..1)
  p.x = p.x / max(uW, 1e-3) * .92;   // blob units: the blob (half-width up to ~.46) fills 1/1.3 of the plane
  float y = p.y;
  // body blob: an egg wider at the shoulders, flat-ish base
  float rx = .42 * (.62 + .45 * smoothstep(.0, .55, y) - .35 * smoothstep(.62, 1., y));   // narrow at the feet, round shoulders, tucked under the flames
  float d = abs(p.x) / max(rx, 1e-3);                           // < 1 inside across
  float top = .66;                                              // where the flames start
  // flame tongues: pointed bumps above 'top', each licking up with noise
  float fx = (p.x + .5) * uFlames;
  float tongue = pow(abs(sin(3.14159 * fx)), .6);
  float lick = vn(vec2(fx * 1.3, y * 3. - uT * 1.7)) * .7 + vn(vec2(fx * 2.9, y * 6. - uT * 2.6)) * .3;
  float ceil = top + uFlameH * (.35 + .65 * tongue) * (.6 + .8 * lick);
  float edgeN = (vn(vec2(y * 7. - uT * 1.2, p.x * 3.)) - .5) * uWob;
  float inside = min((1. + edgeN) - d, (ceil - y) * 3.);         // > 0 inside
  inside = min(inside, y * 6. + .2);                            // soft foot
  float a = smoothstep(0., .02, inside);
  float rimK = 1. - smoothstep(uRimW * .5, uRimW, inside);
  vec3 c = mix(uCol, uRim, rimK * a);
  float g = uGlowA * exp(-max(-inside, 0.) * 14.) * (1. - a);
  gl_FragColor = vec4(mix(uGlow, c, a), clamp((a + g) * uOp, 0., 1.));
}`;

export function makeAura(THREE, parent, target, params = {}) {
  const p = { ...DEFAULTS, ...params }, root = makeRoot(THREE, parent, 'fx_aura'), base = new THREE.Vector3();
  const mat = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false, toneMapped: false, fog: false, side: THREE.DoubleSide,
    blending: p.blend === 'additive' ? THREE.AdditiveBlending : THREE.NormalBlending,
    uniforms: { uCol: { value: new THREE.Color(p.color) }, uRim: { value: new THREE.Color(p.rim) }, uGlow: { value: new THREE.Color(p.glow) }, uT: { value: 0 }, uOp: { value: 0 }, uRimW: { value: p.rimWidth },
      uGlowA: { value: p.glowA }, uFlames: { value: p.flames }, uFlameH: { value: p.flameH }, uWob: { value: p.wobble }, uSeed: { value: p.seed * 1.37 }, uW: { value: 1 } } });
  const geo = new THREE.PlaneGeometry(1, 1); geo.translate(0, .5, 0);
  const mesh = new THREE.Mesh(geo, mat); mesh.renderOrder = -1; mesh.frustumCulled = false; root.add(mesh);
  const fwd = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);

  function update(t, camera) {
    const cam = camOf(p, camera); toV3(THREE, target, p.plan, base, t); base.addScaledVector(up, p.lift);
    if (cam) { cam.updateMatrixWorld(); cam.getWorldDirection(fwd); fwd.y = 0; if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, -1); fwd.normalize(); base.addScaledVector(fwd, p.behind); }
    const invQ = placeRoot(THREE, root, base); if (cam) billboard(mesh, cam, invQ);
    const on = t >= -p.lead && !(p.end != null && t > p.end + p.fade); root.visible = on; if (!on) return;
    let s, op = p.opacity;
    if (t < 0) { const b = smooth((t + p.lead) / p.lead); s = .25 * b + .05; op *= b; }
    else if (t < p.grow) s = easeOutBack(t / p.grow, 2.4);
    else s = 1 + .03 * Math.sin((t - p.grow) * 6.283 * 1.6);
    if (p.end != null && t > p.end) { const u = smooth((t - p.end) / p.fade); s *= 1 - .15 * u; op *= 1 - u; }
    const H = p.height * p.scale * Math.max(s, 0), W = H * p.width;
    mesh.scale.set(Math.max(W, 1e-4) * 1.3, Math.max(H, 1e-4), 1);    // the plane is 30 % wider than the blob so the flame wobble never clips
    mat.uniforms.uW.value = 1 / 1.3; mat.uniforms.uT.value = Math.max(t, -p.lead) * p.speed; mat.uniforms.uOp.value = clamp(op);
  }
  update(-1e3);
  return { group: root, params: p, update, dispose: () => disposeRoot(root) };
}
export default makeAura;

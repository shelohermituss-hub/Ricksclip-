// POWER FX 20: CRACK VEINS (vfx-artist 2026-11-16). Rick: the 300 lb inmate's strength made visible on "laughing" (The Pink Prison Cell Experiment s27-28):
// branching veins shoot over the wall and floor from where he stands, then stay.
// DRAWN: a seeded branching tree of jittered lines lying ON a surface (wall or floor), three layers: a wide soft additive glow, a dark ink crack,
// and a glowing core whose colour falls back toward the ink as it dims. Widths taper from root to tip and by branch level.
// TIMING (t = seconds since the word):
//   build  -lead..0       a glow swells at the origin
//   pop    0..crawl       the veins crawl out from the origin (ease-out: the first half of the reach in ~25 % of crawl), a hot head on every front
//   hold   crawl..hold    full glow with a slow pulse
//   settle hold..dimBy    glow dims to dimTo; the ink cracks stay. end (optional) fades everything out over fade s.
// usage: makeCrackVeins(THREE, scene, ctx.B2T([0, 2.99, 1.0]), { normal: [0, 0, 1], up: [0, 1, 0], color: LOOK.power }) (wall facing +Z in three.js)
// Rick's veins are RED. Our default is amber: a film sets red only if this effect is that film's one red (LOOK_BIBLE).
import { clamp, lerp, smooth, easeOut, rng, toV3, toDir, flatMat, glowSprite, makeRoot, disposeRoot, makeStrips, placeRoot } from './_core.mjs';

export const DEFAULTS = {
  normal: [0, 1, 0], up: null,          // surface normal (three.js, or plan with plan: true); up = a direction in the surface (default: world up projected, or -Z for a floor)
  branches: 6, reach: 2.2, fan: 360, dir: 90, levels: 3, jitter: 0.42, step: 0.14,   // metres / degrees; dir 90 = surface up
  childChance: 0.14, childLength: 0.45,
  width: 0.028,                          // root core width in metres
  color: '#ffc23d', hot: '#fff3c4', glow: '#ff9f2a', ink: '#2a1426', inkK: 1.7, glowK: 6, glowA: 0.3,
  lead: 0.12, crawl: 0.4, hold: 1.2, dimBy: 2.2, dimTo: 0.3, end: null, fade: 0.5,
  lift: 0.01, seed: 5, plan: false,
};

export function makeCrackVeins(THREE, parent, at, params = {}) {
  const p = { ...DEFAULTS, ...params }, R = rng(p.seed), root = makeRoot(THREE, parent, 'fx_crack_veins'), centre = new THREE.Vector3();
  // surface frame (world): N normal, Vv surface up, Uu surface right
  const N = toDir(THREE, p.normal, p.plan, new THREE.Vector3(0, 1, 0)), wUp = new THREE.Vector3(0, 1, 0);
  let Vv = p.up ? toDir(THREE, p.up, p.plan, wUp) : Math.abs(N.y) > .9 ? new THREE.Vector3(0, 0, -1) : wUp.clone();
  Vv.addScaledVector(N, -Vv.dot(N)).normalize(); const Uu = new THREE.Vector3().crossVectors(Vv, N).normalize();
  // the branching tree in surface coordinates (x along Uu, y along Vv), arrival = path distance from the origin
  const strips = []; let maxD = 0;
  function grow(x, y, a, len, level, d0, w0) {
    const pts = [[x, y]], dist = [d0]; let d = d0, h = a, steps = Math.max(2, Math.round(len / p.step));
    for (let i = 0; i < steps; i++) { h += (R() - .5) * p.jitter * 2; const s = p.step * (.7 + R() * .6); x += Math.cos(h) * s; y += Math.sin(h) * s; d += s; pts.push([x, y]); dist.push(d);
      if (level < p.levels && i > 0 && i < steps - 1 && R() < p.childChance) grow(x, y, h + (R() < .5 ? -1 : 1) * (.45 + R() * .5), (len - i * p.step) * p.childLength + p.step * 2, level + 1, d, w0 * .62); }
    maxD = Math.max(maxD, d); strips.push({ uv: pts, d: dist, level, w0, len: d - d0 });
  }
  for (let i = 0; i < p.branches; i++) { const k = p.fan >= 360 ? i / p.branches : p.branches > 1 ? i / (p.branches - 1) : .5, a = (p.dir - p.fan / 2 + p.fan * k) * Math.PI / 180 + (R() - .5) * .5;
    grow(0, 0, a, p.reach * (.65 + R() * .45), 1, 0, 1); }
  for (const s of strips) { s.arr = s.d.map(v => v / maxD); s.base = s.d[0] / maxD; }
  const mkLayer = (off, mat, order) => { const S = strips.map(s => ({ ...s, pts: s.uv.map(() => new THREE.Vector3()), off })); const st = makeStrips(THREE, S, mat); st.mesh.renderOrder = order; root.add(st.mesh); return { ...st, S }; };
  const glow = mkLayer(p.lift * .6, flatMat(THREE, { additive: true, offset: -1 }), 20), ink = mkLayer(p.lift, flatMat(THREE, { offset: -2 }), 21), core = mkLayer(p.lift * 1.4, flatMat(THREE, { offset: -3 }), 22);
  const flash = glowSprite(THREE, p.hot, { order: 30 }); root.add(flash);
  const cC = new THREE.Color(p.color), cH = new THREE.Color(p.hot), cG = new THREE.Color(p.glow), cI = new THREE.Color(p.ink), tmpC = new THREE.Color();
  const sideL = new THREE.Vector3(), Uloc = new THREE.Vector3(), Vloc = new THREE.Vector3(), Nloc = new THREE.Vector3();
  let G = 0, B = 0, fadeK = 1;
  const reveal = (s, i) => { const a = s.arr[i]; if (a > G) return 0; return clamp((G - a) / .05) ; };
  const taper = (s, i) => s.w0 * (1 - .82 * (s.d[i] - s.d[0]) / Math.max(s.len, 1e-3));
  const head = (s, i) => G < 1 ? Math.exp(-Math.pow((G - s.arr[i]) / .045, 2)) : 0;

  function update(t) {
    toV3(THREE, at, p.plan, centre, t); const invQ = placeRoot(THREE, root, centre);
    Uloc.copy(Uu).applyQuaternion(invQ); Vloc.copy(Vv).applyQuaternion(invQ); Nloc.copy(N).applyQuaternion(invQ); sideL.copy(Nloc);
    const on = t >= -p.lead && !(p.end != null && t > p.end + p.fade); root.visible = on; if (!on) return;
    G = t < 0 ? 0 : easeOut(t / p.crawl);
    B = t < 0 ? 0 : t < p.hold ? 1 + .08 * Math.sin(t * 9) : lerp(1, p.dimTo, smooth((t - p.hold) / Math.max(p.dimBy - p.hold, 1e-3)));
    fadeK = p.end != null && t > p.end ? 1 - smooth((t - p.end) / p.fade) : 1;
    for (const L of [glow, ink, core]) for (const s of L.S) for (let i = 0; i < s.uv.length; i++) s.pts[i].copy(Uloc).multiplyScalar(s.uv[i][0]).addScaledVector(Vloc, s.uv[i][1]).addScaledVector(Nloc, s.off);
    const side = (out, pt, tg) => out.crossVectors(tg, sideL).normalize();
    glow.update((s, i) => p.width * p.glowK * taper(s, i) * reveal(s, i), (s, i, c) => { const k = p.glowA * B * fadeK * (1 + 1.5 * head(s, i)); c[0] = cG.r; c[1] = cG.g; c[2] = cG.b; c[3] = clamp(k); }, side);
    ink.update((s, i) => p.width * p.inkK * taper(s, i) * reveal(s, i) + .004, (s, i, c) => { c[0] = cI.r; c[1] = cI.g; c[2] = cI.b; c[3] = .92 * fadeK; }, side);
    core.update((s, i) => p.width * taper(s, i) * reveal(s, i) * (1 + .6 * head(s, i)), (s, i, c) => { const h = head(s, i), k = clamp(B); tmpC.copy(cI).lerp(cC, k).lerp(cH, clamp(h + (B - 1) * 2)); c[0] = tmpC.r; c[1] = tmpC.g; c[2] = tmpC.b; c[3] = fadeK; }, side);
    const fl = t < 0 ? .5 * smooth((t + p.lead) / p.lead) : Math.exp(-t / .18) * .9 + .15 * B; flash.material.opacity = clamp(fl * fadeK); flash.scale.setScalar(p.reach * (t < 0 ? .3 : .55 + .3 * Math.exp(-t / .15)));
    flash.position.copy(Nloc).multiplyScalar(p.lift * 3);
  }
  update(-1e3);
  return { group: root, params: p, update, dispose: () => disposeRoot(root) };
}
export default makeCrackVeins;

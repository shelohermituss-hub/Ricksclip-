// s4_map.js: S4 THE IDEA SPREADS (frames 770-969, plan rows 22-27, script line 7) on PLACE C, THE MAP. S4 stretch builder 2026-11-21, BOARD round.
// Wraps sets/map.js UNCHANGED (symlinked; sets/ is not edited) and adds ONLY this stretch's story timing on top of map.js update():
//   - paint: every truck nose stays RED while its door rolls up (row 23), the painters' station (ST. LOUIS) turns lime on "painting" (row 24, 862),
//     then all noses turn lime in a west -> east sweep on "LIME yellow" (row 25, 870-886); a brief glint (emissive lift) rides the sweep
//   - ST. LOUIS doors are open from 840 (the painters work in the left bay; the wave would reach it only at 29.3 s)
//   - PINE HOLLOW (home) doors stay down until "Plenty" and roll up 912-917 on the lime truck (row 26, 30.52)
//   - lime mist: a small points cloud at the thin painter's gun nozzle 848-866 (it never lands on them)
import { build as mapBuild } from './map.js';
const LIME = '#E3EA22', RED = '#D3141C';
const sm = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
export const S4 = { STL: 13, PH: 0, STL_OPEN: 840, STL_LIME: 862, SWEEP0: 870, SWEEP1: 886, PH_UP0: 912, PH_UP1: 917, MIST0: 848, MIST1: 866,
  nozzle: [2.93, 1.095, 0.15] };
export async function build(THREE, scene, film, ctx) {
  const M = await mapBuild(THREE, scene, film, ctx), fps = film.fps || 30;
  const META = await (await fetch(new URL('./map/out/map_meta.json', import.meta.url).href)).json();
  const xs = META.stations.map(s => s.pos[0]), x0 = Math.min(...xs), x1 = Math.max(...xs);
  const doors = {}, parts = [];
  scene.traverse(o => { if (/^door_\d\d_\d$/.test(o.name)) doors[o.name] = o; if (o.isInstancedMesh && /^map_trucks_/.test(o.name) && o.instanceColor) parts.push(o); });
  const cR = new THREE.Color(RED), cL = new THREE.Color(LIME), tmp = new THREE.Color();
  // lime mist at the nozzle
  const NM = 60, pg = new THREE.BufferGeometry(), pp = new Float32Array(NM * 3), seed = [];
  for (let i = 0; i < NM; i++) seed.push([Math.random(), Math.random() - .5, Math.random() - .5, Math.random()]);
  pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  const mist = new THREE.Points(pg, new THREE.PointsMaterial({ color: LIME, size: .012, transparent: true, opacity: .55, depthWrite: false }));
  mist.name = 's4_lime_mist'; mist.frustumCulled = false; scene.add(mist);
  const N0 = ctx.B2T(S4.nozzle);
  function update(f, t) {
    M.update(f, t);
    const sweep = i => { const s = META.stations[i]; return (f - S4.SWEEP0) / (S4.SWEEP1 - S4.SWEEP0) - (s.pos[0] - x0) / (x1 - x0); };
    META.stations.forEach((s, i) => {
      let lime = sweep(i) >= 0 ? 1 : 0; if (i === S4.STL && f >= S4.STL_LIME) lime = 1;
      const g = Math.max(0, 1 - Math.abs(sweep(i)) * 6);          // glint where the sweep is passing
      tmp.copy(lime ? cL : cR); if (g > 0 && lime) tmp.lerp(new THREE.Color('#ffffff'), .35 * g);
      for (const k of [0, 1]) for (const im of parts) im.setColorAt(2 * i + k, tmp);
      if (i === S4.STL && f >= S4.STL_OPEN) for (const d of [0, 1]) { const o = doors['door_13_' + d]; if (o) o.scale.y = .03; }
      if (i === S4.PH) { const k = sm((f - S4.PH_UP0) / (S4.PH_UP1 - S4.PH_UP0)); for (const d of [0, 1]) { const o = doors['door_00_' + d]; if (o) o.scale.y = Math.max(.03, 1 - k); } }
    });
    for (const im of parts) im.instanceColor.needsUpdate = true;
    const on = f >= S4.MIST0 && f <= S4.MIST1 + 6; mist.visible = on;
    if (on) { for (let i = 0; i < NM; i++) { const [a, b, c, d] = seed[i], age = ((f - S4.MIST0) / 12 + d) % 1;
      pp[i * 3] = N0.x - .02 - .12 * age + b * .03 * age; pp[i * 3 + 1] = N0.y + c * .05 * age + .01 * a; pp[i * 3 + 2] = N0.z + b * .06 * age; }
      pg.attributes.position.needsUpdate = true; mist.material.opacity = .55 * (1 - sm((f - S4.MIST1) / 6)); }
  }
  update(0, 0);
  return { anchors: M.anchors, update };
}

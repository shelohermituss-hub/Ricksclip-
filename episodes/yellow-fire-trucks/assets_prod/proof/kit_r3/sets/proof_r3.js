// proof_r3.js: PROOF ONLY (props-hero round 3, 2026-11-21, props/PROPS_R3.jpg). NOT a film set. Concrete yard + the round-3 assets of sets/assets.js.
// place.mode: 'hero' (half state, ribbon, plate) | 'rear' (camera on the rear: the truck's first mesh off screen, NO paint-frame workaround) |
// 'light' (truck_light with sirens + beacon row, drainWipe .5) | 'lawn' (milk van, lunch box + lemon, red ball, the five lost things grey, toy truck grey .6)
import { kit } from './prop_kit.js';
import { buildTruck, buildProp2, buildLost, buildToyTruck, place } from './assets.js';
export async function build(THREE, scene, film, ctx) {
  const { B2T } = ctx, pl = ctx.place || {}, K = kit(THREE, ctx), V = (x, y, z) => B2T([x, y, z]);
  if (ctx.sky && ctx.sky.clouds) ctx.sky.clouds({ kind: 'clear-day', seed: 4 });
  const ground = pl.mode === 'lawn' ? K.std('#5f7a3a') : ctx.relief('plaster', '#aeaaa0', { size: 4, normal: 1.4 });
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(90, 70), ground); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; scene.add(fl);
  const st = {}; const t0 = performance.now();
  if (pl.mode === 'hero' || pl.mode === 'rear') {
    const T = await buildTruck(THREE, ctx, { paint: 'half', edge: .3, masking: true, letters: 'under', ribbon: pl.mode === 'hero', wear: .6 });
    place(THREE, scene, ctx, T, [0, 0, 0], 0); st.tris = T.tris;
  }
  if (pl.mode === 'light') {
    const T = await buildTruck(THREE, ctx, { light: true, sirens: 4, beaconRow: true, paint: 'red', drain: 1, drainWipe: .5, letters: 'over' });
    T.setBeacon(true, 20, 1.8); place(THREE, scene, ctx, T, [0, 0, 0], 0); st.tris = T.tris;
  }
  if (pl.mode === 'lawn') {
    const van = await buildProp2(THREE, 'milk_van'); place(THREE, scene, ctx, van, [1.5, 3.2, 0], 0);
    const row = [['lost_wagon', -2.6, 0, 20], ['lost_kite', -1.3, .4, 30], ['lost_boot', -.35, -.3, 70], ['lost_watering_can', .45, 0, -20], ['lost_tricycle', 1.5, .2, 35]];
    for (const [n, x, y, yaw] of row) { const P = await buildLost(THREE, n, { grey: 1 }); place(THREE, scene, ctx, P, [x, y, 0], yaw); }
    const ball = await buildLost(THREE, 'red_ball'); place(THREE, scene, ctx, ball, [-1.2, -1.0, 0], 0);
    const ball2 = await buildLost(THREE, 'red_ball', { grey: 1 }); place(THREE, scene, ctx, ball2, [-.75, -1.05, 0], 0);
    const lb = await buildProp2(THREE, 'lunch_box'); place(THREE, scene, ctx, lb, [.35, -1.1, 0], 75);
    const le = await buildProp2(THREE, 'lemon'); place(THREE, scene, ctx, le, [.62, -1.25, 0], 0);
    const toy = buildToyTruck(THREE, {}); place(THREE, scene, ctx, toy, [1.05, -1.2, 0], 30);
    const toy2 = buildToyTruck(THREE, { grey: .6 }); place(THREE, scene, ctx, toy2, [1.35, -1.0, 0], 30);
  }
  st.ms = Math.round(performance.now() - t0); console.warn('PHFD_PROOF_R3 ' + JSON.stringify(st));
  return { anchors: { truck: [0, 0, 1.4] } };
}

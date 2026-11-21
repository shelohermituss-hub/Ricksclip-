// cabtest.js (character-artist FIX 3 proof, 2026-11-21): the REAL truck and milk-van GLBs on a plain ground, so the seated driver cards can be seen in the cab
// from three lenses each. Truck at plan [0,0,0] yaw 0 (front -x, driver side -y); van at plan [0,10,0] yaw 0. Not a film set: proof only.
import { buildTruck, buildProp2, place } from './assets.js';
export async function build(THREE, scene, film, ctx) {
  const g = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: '#8f8a80', roughness: .95 })); g.rotation.x = -Math.PI / 2; scene.add(g);
  const truck = await buildTruck(THREE, ctx, { paint: 'red', drain: .2, masking: false, letters: 'over', wear: .35, beacon: true, light: true });
  place(THREE, scene, ctx, truck, [0, 0, 0], 0);
  const van = await buildProp2(THREE, 'milk_van'); place(THREE, scene, ctx, van, [0, 10, 0], 0);
  const update = f => { if (truck.setPaint) truck.setPaint({ paint: f >= 30 && f < 60 ? 'lemon' : 'red' }); };
  return { anchors: {}, update };
}

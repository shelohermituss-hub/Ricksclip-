// PITCH 2 held prop (2026-11-16). Local +Y = the long axis; "grip" = where the fist closes, "tip" = the working end.
// THE STRIPING ROLLER: a yellow fibreglass extension pole with a black rubber butt cap and a grey threaded collar, a steel wire yoke, an 18-inch
// roller cover soaked in traffic white (nap texture, wet sheen, paint runs on the yoke). The roller's axle lies along local Z (toward the lens).
export function buildRoller(THREE, opts = {}) {
  const toon = opts.toon || (c => new THREE.MeshLambertMaterial({ color: c })), g = new THREE.Group(); g.name = 'striping_roller';
  const add = (geo, mat, name, p, role = 'metal') => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; m.position.set(...p); m.castShadow = true; g.add(m); return m; };
  const L = opts.len || 1.35, yel = toon('#f2c230'), blk = toon('#1a1a20'), grey = toon('#9aa0aa'), steel = toon('#c9d0e0'), white = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .25, clearcoat: .8 });
  add(new THREE.CylinderGeometry(.016, .016, L * .62, 10), yel, 'pole_upper_fibreglass', [0, L * .31 - .12, 0], 'plastic');
  add(new THREE.CylinderGeometry(.013, .013, L * .4, 10), grey, 'pole_lower_alu', [0, L * .8 - .12, 0]);
  add(new THREE.CylinderGeometry(.021, .021, .07, 12), grey, 'pole_threaded_collar', [0, L * .62 - .12, 0]);
  for (let i = 0; i < 4; i++) add(new THREE.TorusGeometry(.021, .003, 4, 12), blk, 'collar_thread', [0, L * .62 - .14 + i * .012, 0]).rotation.x = Math.PI / 2;
  add(new THREE.CylinderGeometry(.022, .02, .09, 12), blk, 'rubber_butt_cap', [0, -.14, 0], 'rubber');
  for (let i = 0; i < 3; i++) add(new THREE.BoxGeometry(.005, .05, .034), white, 'paint_run_on_pole', [.014, L * .8 + i * .1 - .2, 0], 'paint');
  const top = L - .1;
  const pts = [new THREE.Vector3(0, top, 0), new THREE.Vector3(0, top + .07, 0), new THREE.Vector3(0, top + .12, -.06), new THREE.Vector3(0, top + .12, -.25)];
  add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, .007, 6), steel, 'wire_yoke', [0, 0, 0]);
  const cov = add(new THREE.CylinderGeometry(.062, .062, .46, 22), white, 'roller_cover_wet', [0, top + .12, -.02], 'paint'); cov.rotation.x = Math.PI / 2;
  for (let i = 0; i < 18; i++) { const a = i * Math.PI * 2 / 18; const n = add(new THREE.BoxGeometry(.008, .008, .44), toon(i % 2 ? '#f4f3ee' : '#dcdcd6'), 'roller_nap', [Math.cos(a) * .062, top + .12 + Math.sin(a) * .062, -.02], 'paint'); n.castShadow = false; }
  for (const z of [-.25, .21]) add(new THREE.CylinderGeometry(.066, .066, .012, 22), toon('#d8d8d2'), 'cover_end_cap', [0, top + .12, z], 'plastic').rotation.x = Math.PI / 2;
  return { group: g, grip: new THREE.Vector3(0, .25, 0), tip: new THREE.Vector3(0, top + .12 + .062, -.02) };
}

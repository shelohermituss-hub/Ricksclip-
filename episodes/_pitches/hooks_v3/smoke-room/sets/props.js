// PITCH 3 held prop (2026-11-16). Local +Y = the long axis; "grip" = where the fist closes, "tip" = the writing end.
// THE STUDENT'S PENCIL: a yellow hexagonal No. 2 (six flat faces, two shades), a green-and-gold printed band, a ribbed brass ferrule, a worn pink eraser,
// the shaved wood cone and a black graphite point.
export function buildPencil(THREE, opts = {}) {
  const toon = opts.toon || (c => new THREE.MeshLambertMaterial({ color: c })), g = new THREE.Group(); g.name = 'student_pencil';
  const add = (geo, mat, name, p, role = 'wood') => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; m.position.set(...p); m.castShadow = true; g.add(m); return m; };
  add(new THREE.CylinderGeometry(.0075, .0075, .15, 6), toon('#f2b81c'), 'pencil_body', [0, .055, 0]);
  for (let i = 0; i < 3; i++) { const s = add(new THREE.BoxGeometry(.0012, .15, .0062), toon('#c98e10'), 'pencil_face_edge', [Math.cos(i * Math.PI / 3 * 2) * .0068, .055, Math.sin(i * Math.PI / 3 * 2) * .0068]); s.rotation.y = -i * Math.PI / 3 * 2; }
  add(new THREE.CylinderGeometry(.0078, .0078, .012, 6), toon('#1f6a3a'), 'pencil_band', [0, .1, 0]);
  add(new THREE.CylinderGeometry(.0082, .0082, .016, 10), toon('#d7b04a'), 'pencil_ferrule', [0, -.026, 0], 'metal');
  for (const y of [-.021, -.031]) add(new THREE.TorusGeometry(.0082, .0012, 4, 10), toon('#a8822a'), 'ferrule_rib', [0, y, 0], 'metal').rotation.x = Math.PI / 2;
  add(new THREE.CylinderGeometry(.0074, .0074, .014, 10), toon('#e88a9a'), 'pencil_eraser', [0, -.041, 0], 'rubber');
  add(new THREE.CylinderGeometry(.0018, .0075, .026, 6), toon('#e9c79a'), 'pencil_shaved_cone', [0, .143, 0]);
  add(new THREE.CylinderGeometry(.0003, .0019, .008, 6), toon('#2a2a30'), 'pencil_graphite', [0, .16, 0], 'graphite');
  return { group: g, grip: new THREE.Vector3(0, .03, 0), tip: new THREE.Vector3(0, .164, 0) };
}

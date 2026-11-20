// S4 held props (S4 builder 2026-11-16): the three step-climbers' WRISTBANDS (row 35), rings in the three tray colours (CAST_KEYS held_props). Kit held3d builder form.
export function buildWristband(THREE, o = {}) {
  const g = new THREE.Group(); g.name = 'wristband_' + (o.color || 'band');
  const m = new THREE.Mesh(new THREE.TorusGeometry(.036, .014, 10, 24), new THREE.MeshStandardMaterial({ color: o.color || '#5a7a9a', roughness: .55 }));
  m.rotation.x = Math.PI / 2; m.position.set(0, -.05, 0); g.add(m);
  const tag = new THREE.Mesh(new THREE.BoxGeometry(.03, .022, .006), new THREE.MeshStandardMaterial({ color: '#f4f0e4', roughness: .7 })); tag.position.set(0, -.05, .05); g.add(tag);
  return { group: g, grip: new THREE.Vector3(0, 0, 0), tip: new THREE.Vector3(0, -.05, 0) };
}

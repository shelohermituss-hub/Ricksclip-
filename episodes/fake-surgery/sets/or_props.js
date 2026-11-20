// PITCH 4 held props (2026-11-16). Local +Y = the long axis; "grip" = where the fist closes, "tip" = the working end.
// THE SCALPEL: a flat steel No. 3 handle with the knurled grip and the scale marks, a small curved No. 15 blade with a bright edge.
export function buildScalpel(THREE, opts = {}) {
  const toon = opts.toon || (c => new THREE.MeshLambertMaterial({ color: c })), g = new THREE.Group(); g.name = 'scalpel';
  const add = (geo, mat, name, p, role = 'metal') => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; m.position.set(...p); m.castShadow = true; g.add(m); return m; };
  const steel = toon('#d4dbe8'), dark = toon('#8a93a6'), bright = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  add(new THREE.BoxGeometry(.016, .13, .006), steel, 'sc_handle', [0, .06, 0]);
  for (let i = 0; i < 7; i++) add(new THREE.BoxGeometry(.017, .003, .007), dark, 'sc_knurl', [0, .02 + i * .008, 0]);
  for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(.006, .0015, .007), dark, 'sc_scale', [.004, .09 + i * .008, 0]);
  add(new THREE.BoxGeometry(.008, .02, .004), dark, 'sc_neck', [0, .135, 0]);
  const blade = add(new THREE.CylinderGeometry(.011, .006, .04, 3), steel, 'sc_blade', [0, .16, 0]); blade.scale.z = .25;
  add(new THREE.BoxGeometry(.003, .036, .005), bright, 'sc_edge', [.007, .16, 0]);
  return { group: g, grip: new THREE.Vector3(0, .05, 0), tip: new THREE.Vector3(0, .182, 0) };
}

// THE BULB SYRINGE OF SALINE: a fat GREY-BLUE rubber bulb #6a86a0 (LOOK_BIBLE: was red; THE ONE RED = pain only) (squeezed in the fist), a clear nozzle with a water line inside, and the water coming out:
// a stream and a fan of drops off the tip (the "splash" of the fake surgery).
export function buildBulb(THREE, opts = {}) {
  const toon = opts.toon || (c => new THREE.MeshLambertMaterial({ color: c })), g = new THREE.Group(); g.name = 'bulb_syringe';
  const add = (geo, mat, name, p, role = 'glass') => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; m.position.set(...p); m.castShadow = true; g.add(m); return m; };
  const rubber = toon('#6a86a0'), rubDk = toon('#4e6a84'), clear = new THREE.MeshLambertMaterial({ color: '#dff4ff', transparent: true, opacity: .55 }), water = new THREE.MeshBasicMaterial({ color: '#5fc8ff', transparent: true, opacity: .9 }), spark = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  const b = add(new THREE.SphereGeometry(.045, 16, 12), rubber, 'bulb_rubber', [0, 0, 0], 'rubber'); b.scale.y = 1.25;
  add(new THREE.TorusGeometry(.03, .006, 6, 16), rubDk, 'bulb_collar', [0, .055, 0], 'rubber').rotation.x = Math.PI / 2;
  add(new THREE.CylinderGeometry(.008, .016, .12, 12), clear, 'bulb_nozzle', [0, .115, 0]);
  add(new THREE.CylinderGeometry(.005, .01, .08, 8), water, 'nozzle_water', [0, .12, 0]);
  add(new THREE.BoxGeometry(.003, .07, .003), spark, 'nozzle_glint', [-.007, .12, .012]);
  // the stream and the drops, fanned out ahead of the tip
  add(new THREE.CylinderGeometry(.007, .012, .12, 8), water, 'water_stream', [0, .235, 0]);
  for (let i = 0; i < 26; i++) { const a = -1.3 + i * .1, r = .08 + (i % 5) * .035; const d = add(new THREE.SphereGeometry(.011 + (i % 3) * .005, 8, 6), water, 'water_drop', [Math.sin(a) * r, .27 + Math.cos(a) * r * .6, (i % 2 ? .01 : -.01)]); d.scale.y = 1.4; }
  for (let i = 0; i < 5; i++) add(new THREE.SphereGeometry(.004, 6, 4), spark, 'drop_glint', [Math.sin(-.8 + i * .4) * .13, .3 + Math.cos(-.8 + i * .4) * .07, .02]);
  return { group: g, grip: new THREE.Vector3(0, 0, 0), tip: new THREE.Vector3(0, .175, 0) };
}
// THE NEEDLE HOLDER was dropped 2026-11-16 (PICTURE_PLAN: bloodless, no needle, no stitch; the knee gets three plasters).

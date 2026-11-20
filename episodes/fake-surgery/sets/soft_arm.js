// SOFT ARM (lead, 2026-11-16). CB, twice: "arms not triangle. they are curve bend", "never do it. need to make slight curve".
// Every arm a set module draws itself (stamp rig, brush dab, packet push, hug arms, knife, card in hand...) MUST use this, never two straight
// segments with an elbow corner. The arm is ONE slight smooth curve from shoulder to fist: a cubic with both controls pushed the same way, so the
// bend is spread along the whole arm; its sag is 6-22 % of the shoulder-fist distance (the same rule as the kit's 2D arms in poses.mjs / puppets.mjs).
// If a pose needs a sharper fold than 22 %, move the hand or the body, never draw a corner.
//
// softArm(THREE, { from, to, side, width, sag, color, fist, fistR, segments })
//   from, to : THREE.Vector3 (world) shoulder and fist centre
//   side     : THREE.Vector3, the direction the elbow bows toward (e.g. down and out); it is made perpendicular to the arm
//   width    : tube radius in metres (default 0.022 = the 19 px limb line at about 1 m from a 35 mm lens; match your shot)
//   sag      : 0.06-0.22 (fraction of the shoulder-fist distance), default 0.12
//   color    : ink colour (default '#231c22'), unlit
//   fist     : true = add the round black fist (a plain circle facing the camera is drawn by the caller if it prefers; here a sphere)
//   fistR    : fist radius in metres (default width * 2.6)
// returns { group, update(from, to, side) } : call update every frame when the shoulder or the fist moves; the geometry is rebuilt cheaply.
export function softArm(THREE, o = {}) {
  const color = o.color || '#231c22', width = o.width ?? 0.022, segs = o.segments ?? 24;
  const mat = new THREE.MeshBasicMaterial({ color });
  const group = new THREE.Group(); group.name = o.name || 'soft_arm';
  const tube = new THREE.Mesh(new THREE.BufferGeometry(), mat); tube.name = 'soft_arm_tube'; group.add(tube);
  let fist = null;
  if (o.fist !== false) { fist = new THREE.Mesh(new THREE.SphereGeometry(o.fistR ?? width * 2.6, 20, 14), mat); fist.name = 'soft_arm_fist'; group.add(fist); }
  const sagK = Math.min(0.22, Math.max(0.06, o.sag ?? 0.12));
  function update(from, to, side) {
    const chord = new THREE.Vector3().subVectors(to, from), d = Math.max(chord.length(), 1e-4);
    const dir = chord.clone().divideScalar(d);
    const s = (side ? side.clone() : new THREE.Vector3(0, 0, -1));
    s.sub(dir.clone().multiplyScalar(s.dot(dir))); if (s.lengthSq() < 1e-8) s.set(0, 0, -1).cross(dir);
    s.normalize();
    const h = (sagK * d) / 0.75;                               // a cubic with equal control offsets peaks at 0.75 h
    const c1 = from.clone().addScaledVector(chord, 1 / 3).addScaledVector(s, h);
    const c2 = from.clone().addScaledVector(chord, 2 / 3).addScaledVector(s, h);
    const curve = new THREE.CubicBezierCurve3(from.clone(), c1, c2, to.clone());
    tube.geometry.dispose(); tube.geometry = new THREE.TubeGeometry(curve, segs, width, 10, false);
    if (fist) fist.position.copy(to);
  }
  if (o.from && o.to) update(o.from, o.to, o.side);
  return { group, update };
}

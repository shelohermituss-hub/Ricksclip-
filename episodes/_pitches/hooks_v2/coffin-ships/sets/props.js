// Pitch 4 held prop: THE LIFEBUOY the old seaman clutches. 1870s cork ring in a painted canvas cover (white with four ochre quarter bands),
// a grab line looped through four beckets round the outside, the ship's name stencilled small on the white quarters ("MARY ANN").
// Local frame: the ring lies in the XY plane (faces the lens), +Y up. grip_left / grip_right = where the two fists close on the ring's sides.
export function buildLifebuoy(THREE, opts = {}) {
  const toon = opts.toon || (c => new THREE.MeshLambertMaterial({ color: c })), g = new THREE.Group(); g.name = 'lifebuoy';
  const R = .2, r = .06;
  const add = (geo, mat, name, p, rot) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = 'prop'; if (p) m.position.set(...p); if (rot) m.rotation.set(...rot); m.castShadow = true; g.add(m); return m; };
  // the four quarters, white and ochre, as four torus arcs
  for (let i = 0; i < 4; i++) { const a = add(new THREE.TorusGeometry(R, r, 12, 18, Math.PI / 2), toon(i % 2 ? '#e8a42c' : '#f6f1e4'), 'buoy_quarter_' + i); a.rotation.z = i * Math.PI / 2 + Math.PI / 4; }
  // grab line: a thinner rope torus just outside, with four becket loops
  add(new THREE.TorusGeometry(R + r * 1.05, .012, 6, 48), toon('#b8925a'), 'buoy_grabline');
  for (let i = 0; i < 4; i++) { const an = i * Math.PI / 2 + Math.PI / 4; add(new THREE.TorusGeometry(.03, .01, 6, 12), toon('#9a7444'), 'buoy_becket_' + i, [Math.cos(an) * (R + r * .9), Math.sin(an) * (R + r * .9), 0], [Math.PI / 2, 0, an]); }
  // stencilled name on the top white quarter (canvas)
  if (typeof document !== 'undefined') { const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d'); x.fillStyle = '#2a2a3a'; x.font = 'bold 40px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('MARY ANN', 128, 34);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; add(new THREE.PlaneGeometry(.26, .065), new THREE.MeshBasicMaterial({ map: t, transparent: true }), 'buoy_name', [0, R + .005, r + .004]); }
  return { group: g, grip: new THREE.Vector3(-R - .02, 0, 0), grip_left: new THREE.Vector3(-R - .03, -.02, .04), grip_right: new THREE.Vector3(R + .03, -.02, .04), tip: new THREE.Vector3(R, 0, 0) };
}

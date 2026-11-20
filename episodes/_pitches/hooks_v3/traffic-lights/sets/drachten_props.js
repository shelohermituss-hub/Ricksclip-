// PITCH 1 held props (2026-11-16, "The Town That Tore Down Its Traffic Lights", Drachten, about 2003). Local +Y = the long axis, +Z = toward the lens.
const canvasTex = (THREE, w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const glowTex = (THREE, col) => canvasTex(THREE, 128, 128, (c) => { const g = c.createRadialGradient(64, 64, 2, 64, 64, 64); g.addColorStop(0, col); g.addColorStop(.25, col + 'aa'); g.addColorStop(1, col + '00'); c.fillStyle = g; c.fillRect(0, 0, 128, 128); });

// THE TRAFFIC LIGHT, ripped out with its concrete foot. Base (y 0) = the broken concrete lump with cut cables; galvanised pole with a black-and-white
// band; the yellow push-button box "WACHT" for cyclists; the small bicycle signal; the main head: black housing, black backboard with a white border,
// three lamps with hooded visors, the RED one still burning (glow); a pole cap. Grip = where the lower fist closes (1.35 m up the pole).
export function buildTrafficLight(THREE, opts = {}) {
  const toon = opts.toon || (c => new THREE.MeshLambertMaterial({ color: c })), g = new THREE.Group(); g.name = 'ripped_traffic_light';
  const add = (geo, mat, name, p, role = 'metal', rot) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; m.position.set(...p); if (rot) m.rotation.set(...rot); m.castShadow = true; g.add(m); return m; };
  const galv = toon('#b9c0c8'), galvD = toon('#8a929c'), black = toon('#1f2228'), white = toon('#f4f4f0'), yel = toon('#f2c21c'), conc = toon('#a8a29a'), concD = toon('#7d776f');
  // concrete foot, broken: a lump with chunks, rebar ends, and the cut cables (red, blue, yellow-green) sticking out
  add(new THREE.DodecahedronGeometry(.22, 0), conc, 'tl_concrete_foot', [0, .02, 0], 'stone', [.4, .2, .3]);
  add(new THREE.DodecahedronGeometry(.11, 0), concD, 'tl_concrete_chunk', [.12, -.1, .06], 'stone', [1, .5, 0]);
  add(new THREE.DodecahedronGeometry(.09, 0), conc, 'tl_concrete_chunk2', [-.13, -.08, -.04], 'stone', [.2, 1, .3]);
  for (const [x, z, a] of [[.08, .1, .5], [-.1, .08, -.6]]) add(new THREE.CylinderGeometry(.008, .008, .26, 5), toon('#7a4a2a'), 'tl_rebar', [x, -.16, z], 'metal', [0, 0, a]);
  const cab = (col, pts, name) => { const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p))); add(new THREE.TubeGeometry(curve, 24, .014, 6), toon(col), name, [0, 0, 0], 'cable'); const end = pts[pts.length - 1]; add(new THREE.CylinderGeometry(.006, .006, .03, 5), toon('#e8a050'), name + '_copper', end, 'metal'); };
  cab('#d8322a', [[0, -.05, .05], [.08, -.2, .14], [.2, -.32, .1], [.3, -.36, .2]], 'tl_cable_red');
  cab('#2a64d8', [[0, -.05, .02], [-.06, -.22, .1], [-.18, -.3, .16], [-.22, -.42, .06]], 'tl_cable_blue');
  cab('#9ac83a', [[.02, -.05, -.02], [.14, -.18, -.06], [.12, -.34, .02], [.24, -.46, -.02]], 'tl_cable_green');
  // the pole
  add(new THREE.CylinderGeometry(.06, .065, 3.3, 14), galv, 'tl_pole', [0, 1.65, 0]);
  for (let i = 0; i < 5; i++) add(new THREE.CylinderGeometry(.067, .067, .1, 14), i % 2 ? white : black, 'tl_pole_band', [0, .42 + i * .1, 0]);
  add(new THREE.CylinderGeometry(.09, .09, .05, 14), galvD, 'tl_base_collar', [0, .26, 0]);
  add(new THREE.SphereGeometry(.075, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), galvD, 'tl_pole_cap', [0, 3.3, 0]);
  // push-button box "WACHT" (the Dutch cyclist's wait button)
  const wacht = canvasTex(THREE, 128, 200, (c, w, h) => { c.fillStyle = '#f2c21c'; c.fillRect(0, 0, w, h); c.fillStyle = '#1f2228'; c.fillRect(12, 14, w - 24, 46); c.fillStyle = '#ff3a2a'; c.font = 'bold 34px Arial'; c.textAlign = 'center'; c.fillText('WACHT', w / 2, 50);
    c.fillStyle = '#1f2228'; c.beginPath(); c.arc(w / 2, 128, 30, 0, 7); c.fill(); c.fillStyle = '#d8d8d0'; c.beginPath(); c.arc(w / 2, 128, 22, 0, 7); c.fill(); c.fillStyle = '#1f2228'; c.font = 'bold 18px Arial'; c.fillText('DRUK', w / 2, 186); });
  add(new THREE.BoxGeometry(.16, .25, .1), new THREE.MeshLambertMaterial({ map: wacht }), 'tl_wacht_box', [0, .98, .1], 'sign');
  // the small bicycle signal (three little lamps with a bike in each)
  add(new THREE.BoxGeometry(.13, .36, .1), black, 'tl_bike_head', [.14, 2.05, .04]);
  const bikeLens = col => canvasTex(THREE, 64, 64, (c, w) => { c.fillStyle = col; c.beginPath(); c.arc(32, 32, 30, 0, 7); c.fill(); c.strokeStyle = '#111'; c.lineWidth = 4; c.beginPath(); c.arc(18, 40, 9, 0, 7); c.arc(46, 40, 9, 0, 7); c.moveTo(18, 40); c.lineTo(30, 24); c.lineTo(46, 40); c.moveTo(30, 24); c.lineTo(36, 22); c.stroke(); });
  [['#ff4030', 2.17, true], ['#6a5418', 2.05], ['#1e4a2a', 1.93]].forEach(([c, y, on]) => { const m = add(new THREE.CircleGeometry(.042, 16), new THREE.MeshBasicMaterial({ map: bikeLens(c), toneMapped: !on }), 'tl_bike_lens', [.14, y, .095], 'lamp'); m.castShadow = false; });
  // main head: backboard with the white border, housing, three lamps with visors
  add(new THREE.BoxGeometry(.5, 1.12, .02), white, 'tl_backboard_border', [0, 2.78, -.06]);
  add(new THREE.BoxGeometry(.44, 1.06, .025), black, 'tl_backboard', [0, 2.78, -.05]);
  add(new THREE.BoxGeometry(.3, .92, .2), black, 'tl_housing', [0, 2.78, .05]);
  [['#ff2a1a', 3.07, true], ['#5a3e10', 2.78], ['#123a22', 2.49]].forEach(([c, y, on], i) => {
    const lens = add(new THREE.CircleGeometry(.1, 20), new THREE.MeshBasicMaterial({ color: c, toneMapped: !on }), 'tl_lens_' + ['red', 'amber', 'green'][i], [0, y, .152], 'lamp'); lens.castShadow = false;
    add(new THREE.CylinderGeometry(.125, .125, .16, 16, 1, true, -Math.PI / 2, Math.PI), black, 'tl_visor', [0, y + .02, .23], 'metal', [Math.PI / 2, 0, 0]).material.side = THREE.DoubleSide;
    add(new THREE.TorusGeometry(.107, .012, 6, 20), toon('#3a3d44'), 'tl_lens_ring', [0, y, .153]);
    if (on) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(THREE, '#ff3020'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); sp.scale.set(.75, .75, 1); sp.position.set(0, y, .2); sp.name = 'tl_red_glow'; g.add(sp); }
  });
  for (const y of [2.42, 3.14]) add(new THREE.BoxGeometry(.18, .04, .1), galvD, 'tl_head_bracket', [0, y, -.08]);
  return { group: g, grip: new THREE.Vector3(0, 1.35, 0), tip: new THREE.Vector3(0, 3.35, 0) };
}

// THE BANDAGE CRATE: a slatted wooden fruit crate full of white bandage rolls and boxes of plasters, a cardboard sign stuck in it:
// "BANDAGES  €1" (in English for the viewer) and "pleisters" under it. Box grip: the fists on the two side handles (grip_left / grip_right).
export function buildBandageCrate(THREE, opts = {}) {
  const toon = opts.toon || (c => new THREE.MeshLambertMaterial({ color: c })), g = new THREE.Group(); g.name = 'bandage_crate';
  const add = (geo, mat, name, p, role = 'wood', rot) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; m.position.set(...p); if (rot) m.rotation.set(...rot); m.castShadow = true; g.add(m); return m; };
  const wood = toon('#d9a868'), woodD = toon('#a8743c'), W = .56, D = .38, H = .26;
  for (let i = 0; i < 3; i++) { add(new THREE.BoxGeometry(W, .06, .012), wood, 'crate_slat_front', [0, .04 + i * .09, D / 2]); add(new THREE.BoxGeometry(W, .06, .012), wood, 'crate_slat_back', [0, .04 + i * .09, -D / 2]); add(new THREE.BoxGeometry(.012, .06, D), wood, 'crate_slat_l', [-W / 2, .04 + i * .09, 0]); add(new THREE.BoxGeometry(.012, .06, D), wood, 'crate_slat_r', [W / 2, .04 + i * .09, 0]); }
  for (const x of [-W / 2, W / 2]) for (const z of [-D / 2, D / 2]) add(new THREE.BoxGeometry(.035, H, .035), woodD, 'crate_corner', [x, H / 2, z]);
  add(new THREE.BoxGeometry(W, .012, D), woodD, 'crate_floor', [0, .006, 0]);
  const stamp = canvasTex(THREE, 256, 64, (c, w, h) => { c.fillStyle = '#d9a868'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a5a9a'; c.font = 'bold 34px Arial'; c.textAlign = 'center'; c.fillText('FRIESLAND', w / 2, 44); });
  add(new THREE.PlaneGeometry(W * .7, .055), new THREE.MeshLambertMaterial({ map: stamp }), 'crate_stamp', [0, .13, D / 2 + .008], 'sign');
  const roll = toon('#fbfbf6'), rollE = toon('#e8e4d8'); let s = 7; const R0 = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  for (let i = 0; i < 16; i++) { const x = -W / 2 + .07 + (i % 6) * .085, z = -D / 2 + .08 + Math.floor(i / 6) * .11; add(new THREE.CylinderGeometry(.04, .04, .07, 12), i % 3 ? roll : rollE, 'bandage_roll', [x, H + .01 + R0() * .03, z], 'cloth', [Math.PI / 2 * (i % 2), R0(), 0]); }
  const box = canvasTex(THREE, 128, 80, (c, w, h) => { c.fillStyle = '#f0e4c8'; c.fillRect(0, 0, w, h); c.fillStyle = '#e8a0a0'; c.fillRect(20, 26, 88, 28); c.fillStyle = '#f6d0c0'; c.fillRect(48, 26, 32, 28); c.fillStyle = '#2a5a9a'; c.font = 'bold 14px Arial'; c.fillText('PLEISTERS', 22, 18); });
  for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(.13, .08, .05), new THREE.MeshLambertMaterial({ map: box }), 'plaster_box', [-.16 + i * .11, H + .06, .13], 'paper', [-.3, 0, (i - 1.5) * .12]);
  const sign = canvasTex(THREE, 400, 260, (c, w, h) => { c.fillStyle = '#c99a5a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#8a6030'; c.lineWidth = 6; c.strokeRect(6, 6, w - 12, h - 12);
    c.fillStyle = '#1a1a2a'; c.font = 'bold 72px "Comic Sans MS", "Segoe Print", cursive'; c.textAlign = 'center'; c.fillText('BANDAGES', w / 2, 100); c.fillStyle = '#c81e1e'; c.font = 'bold 84px "Comic Sans MS", cursive'; c.fillText('€1', w / 2, 190);
    c.fillStyle = '#3a3a4a'; c.font = 'italic 30px "Comic Sans MS", cursive'; c.fillText('pleisters', w / 2, 240); });
  add(new THREE.BoxGeometry(.5, .32, .008), new THREE.MeshLambertMaterial({ map: sign }), 'crate_sign', [0, H + .3, D / 2 - .02], 'sign', [-.12, 0, .05]);
  add(new THREE.BoxGeometry(.012, .3, .012), woodD, 'crate_sign_stick', [0, H + .1, D / 2 - .04]);
  return { group: g, grip_left: new THREE.Vector3(-W / 2 - .02, H * .6, 0), grip_right: new THREE.Vector3(W / 2 + .02, H * .6, 0) };
}

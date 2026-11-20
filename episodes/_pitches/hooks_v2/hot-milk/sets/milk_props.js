// Pitch 2 held props: THE ENAMEL MUG (white enamel, cobalt-blue rim, chipped black spots, a skin of milk, the handle). Local +Y up, the body sits at +X of the
// handle, grip = the handle's middle, tip = the mug's mouth. opts.steam: true adds the soft rising steam wisps (sprites, see-through, no depth write).
// opts.rim (colour), opts.fill (milk colour), opts.chips (number of chips).
function wispTex(THREE) {
  if (wispTex.t) return wispTex.t; const c = document.createElement('canvas'); c.width = 128; c.height = 256; const g = c.getContext('2d');
  for (let i = 0; i < 26; i++) { const y = 230 - i * 8.2, x = 64 + 22 * Math.sin(i * .42) + 8 * Math.sin(i * 1.3), r = 16 + i * 1.1, a = .5 * Math.sin(Math.PI * Math.min(1, (i + 1) / 26)) ;
    const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,255,255,${a.toFixed(3)})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; wispTex.t = t; return t;
}
export function buildMug(THREE, opts = {}) {
  const toon = opts.toon || (c => new THREE.MeshLambertMaterial({ color: c })), g = new THREE.Group(); g.name = 'enamel_mug';
  const add = (geo, mat, name, p, role = 'metal') => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; m.position.set(...p); m.castShadow = true; g.add(m); return m; };
  const S = opts.size || 1, R = .043 * S, H = .095 * S, cx = .062 * S;
  const enamel = toon(opts.body || '#f7f4ec'), rim = toon(opts.rim || '#1f4fb8'), chip = toon('#26242c'), milk = toon(opts.fill || '#fff6e0');
  const body = add(new THREE.CylinderGeometry(R, R * .94, H, 22, 1, true), enamel, 'mug_body', [cx, H / 2, 0]); body.material.side = THREE.DoubleSide;
  add(new THREE.CylinderGeometry(R * .94, R * .94, .004, 22), enamel, 'mug_base', [cx, .002, 0]);
  add(new THREE.TorusGeometry(R, .0055 * S, 8, 26), rim, 'mug_rim', [cx, H, 0]).rotation.x = Math.PI / 2;
  add(new THREE.TorusGeometry(R * .95, .004 * S, 6, 26), rim, 'mug_foot_rim', [cx, .006, 0]).rotation.x = Math.PI / 2;
  add(new THREE.CircleGeometry(R * .96, 22), milk, 'mug_milk', [cx, H * .86, 0], 'cloth').rotation.x = -Math.PI / 2;
  const hd = add(new THREE.TorusGeometry(.03 * S, .0075 * S, 8, 16, Math.PI * 1.15), enamel, 'mug_handle', [cx - R - .004, H * .55, 0]); hd.rotation.z = Math.PI * .43;
  add(new THREE.TorusGeometry(.03 * S, .0045 * S, 6, 16, Math.PI * 1.15), rim, 'mug_handle_edge', [cx - R - .004, H * .55, .006]).rotation.z = Math.PI * .43;
  for (let i = 0; i < (opts.chips ?? 3); i++) { const a = -1.9 + i * .7, y = H * (.25 + .22 * i); add(new THREE.CircleGeometry(.006 * S * (1 + i * .3), 7), chip, 'mug_chip', [cx + Math.cos(a) * R * 1.01, y, Math.sin(a) * R * 1.01]).lookAt(cx + Math.cos(a) * 2, y, Math.sin(a) * 2); }
  if (opts.steam) { const tex = wispTex(THREE);
    for (let i = 0; i < 9; i++) { const m = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: .5 - i * .035, depthWrite: false, color: i % 2 ? '#ffffff' : '#f3f6ff' }); m.rotation = .5 + .12 * i;
      const sp = new THREE.Sprite(m); sp.name = 'mug_steam'; const s = (.2 + i * .05) * S; sp.scale.set(s * .6, s, 1); sp.position.set(cx + (i % 3 - 1) * .03 - i * .03, H + s * .4 + i * .025, (i % 2 ? .03 : -.03)); g.add(sp); } }
  const grip = new THREE.Vector3(cx - R - .03 * S, H * .55, 0);
  return { group: g, grip, tip: new THREE.Vector3(cx, H, 0), mouth: new THREE.Vector3(cx, H, 0) };
}

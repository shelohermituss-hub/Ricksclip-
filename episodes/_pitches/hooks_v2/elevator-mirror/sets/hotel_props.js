// PITCH 5 held props (2026-11-16). Local +Y = the long axis; "grip" = where the fist closes, "tip" = the working end.
const canvasTex = (THREE, w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

// THE JANITOR'S SCREWDRIVER: fluted amber handle with a brass ferrule, a long steel shank, a flat blade with a bright worn edge.
export function buildScrewdriver(THREE, opts = {}) {
  const toon = opts.toon || (c => new THREE.MeshLambertMaterial({ color: c })), g = new THREE.Group(); g.name = 'janitor_screwdriver';
  const add = (geo, mat, name, p, role = 'metal') => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; m.position.set(...p); m.castShadow = true; g.add(m); return m; };
  const amber = toon('#e0902a'), dark = toon('#8a4a14'), steel = toon('#c9d0e0'), brass = toon('#e8b43c'), bright = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  add(new THREE.CylinderGeometry(.021, .018, .11, 8), amber, 'sd_handle', [0, .045, 0], 'wood');
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; add(new THREE.BoxGeometry(.006, .1, .006), dark, 'sd_flute', [Math.cos(a) * .02, .045, Math.sin(a) * .02], 'wood'); }
  add(new THREE.SphereGeometry(.021, 10, 8), amber, 'sd_butt', [0, -.01, 0], 'wood'); add(new THREE.CylinderGeometry(.012, .016, .022, 10), brass, 'sd_ferrule', [0, .108, 0]);
  add(new THREE.CylinderGeometry(.0055, .0055, .17, 8), steel, 'sd_shank', [0, .2, 0]); add(new THREE.BoxGeometry(.016, .028, .004), steel, 'sd_blade', [0, .296, 0]);
  add(new THREE.BoxGeometry(.017, .004, .005), bright, 'sd_edge', [0, .311, 0]);
  return { group: g, grip: new THREE.Vector3(0, .045, 0), tip: new THREE.Vector3(0, .312, 0) };
}

// THE ENGINEERS' BILL FOR A NEW ELEVATOR: a THICK stapled estimate (blue card cover folded back, about 60 pages: the page edges are drawn as layers),
// held up by its top corner; from its last page a long adding-machine tape of figures unrolls down to the carpet and curls on the floor.
// Hangs from the fist (grip "hang"): +Y up, the grip at the top-left corner, the paper below it; the printed face toward +Z (the lens).
export function buildBill(THREE, opts = {}) {
  const g = new THREE.Group(), W = opts.w || .34, H = opts.h || .46, T = opts.t || .045, drop = opts.drop || 1.25; g.name = 'engineers_bill';
  const page = canvasTex(THREE, 512, 700, (c, w, h) => {
    c.fillStyle = '#fbf6e8'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d3f8a'; c.fillRect(0, 0, w, 120);
    c.fillStyle = '#ffffff'; c.font = 'bold 50px Georgia, serif'; c.textAlign = 'center'; c.fillText('ENGINEERS’', w / 2, 52); c.font = 'bold 44px Georgia, serif'; c.fillText('ESTIMATE', w / 2, 102);
    c.fillStyle = '#1b1b2a'; c.font = 'bold 54px Georgia, serif'; c.fillText('NEW', w / 2, 192); c.fillText('ELEVATOR', w / 2, 250);
    c.strokeStyle = '#9aa0b8'; c.lineWidth = 3; for (let i = 0; i < 6; i++) { const y = 290 + i * 34; c.beginPath(); c.moveTo(40, y); c.lineTo(w - 40, y); c.stroke(); c.fillStyle = '#6a6f88'; c.fillRect(48, y - 22, 150 + (i * 37) % 120, 12); c.fillRect(w - 150, y - 22, 100, 12); }
    c.fillStyle = '#c0241c'; c.fillRect(30, 505, w - 60, 8); c.fillStyle = '#1b1b2a'; c.font = 'bold 46px Georgia, serif'; c.fillText('TOTAL', w / 2, 562);
    c.font = 'bold 84px Georgia, serif'; c.fillStyle = '#b01c16'; c.fillText('$120,000', w / 2, 650);
    c.strokeStyle = '#b01c16'; c.lineWidth = 6; c.beginPath(); c.ellipse(w / 2, 622, 236, 58, 0, 0, Math.PI * 2); c.stroke(); });
  const tape = canvasTex(THREE, 128, 1024, (c, w, h) => { c.fillStyle = '#f6efdc'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a2a3a'; c.font = 'bold 26px monospace'; c.textAlign = 'right';
    for (let i = 0; i < 30; i++) c.fillText((((i * 7919) % 9000) + 1000).toLocaleString('en-US') + '.00', w - 10, 30 + i * 33); c.fillStyle = '#b01c16'; c.fillRect(8, h - 30, w - 16, 4); });
  const face = new THREE.MeshBasicMaterial({ map: page }), edge = new THREE.MeshLambertMaterial({ color: '#efe6cf' }), cover = new THREE.MeshLambertMaterial({ color: '#1d3f8a' }), staple = new THREE.MeshBasicMaterial({ color: '#dfe4f0' });
  // the stack: front page (printed), the page block with layer lines, the blue back cover; the grip at the top-left corner
  const stack = new THREE.Group(); g.add(stack); stack.position.set(W / 2 - .03, -H / 2 + .02, 0);
  const fm = new THREE.Mesh(new THREE.PlaneGeometry(W, H), face); fm.position.z = T / 2 + .001; fm.name = 'bill_front_page'; stack.add(fm);
  const blk = new THREE.Mesh(new THREE.BoxGeometry(W * .99, H * .99, T), edge); blk.name = 'bill_page_block'; stack.add(blk);
  for (let i = 1; i < 9; i++) { const l = new THREE.Mesh(new THREE.BoxGeometry(W * .995, .002, T * 1.01), new THREE.MeshBasicMaterial({ color: '#c8bca0' })); l.position.y = -H / 2 + .001; l.position.z = -T / 2 + T * i / 9; l.scale.y = 1; stack.add(l);
    const r = new THREE.Mesh(new THREE.BoxGeometry(.002, H * .99, T * .9 / 9), new THREE.MeshBasicMaterial({ color: i % 2 ? '#d9cfb4' : '#fbf6e8' })); r.position.set(W / 2 - .001, 0, -T / 2 + T * (i - .5) / 9); stack.add(r); }
  const cv = new THREE.Mesh(new THREE.BoxGeometry(W * 1.01, H * 1.01, .004), cover); cv.position.z = -T / 2 - .002; cv.name = 'bill_cover'; stack.add(cv);
  for (const x of [-W * .32, W * .32]) { const s = new THREE.Mesh(new THREE.BoxGeometry(.045, .007, .004), staple); s.position.set(x, H / 2 - .025, T / 2 + .003); s.name = 'bill_staple'; stack.add(s); }
  // the tape: out of the bottom of the stack, hanging down, then a curl on the floor
  const tp = new THREE.Mesh(new THREE.PlaneGeometry(.075, drop), new THREE.MeshBasicMaterial({ map: tape, side: THREE.DoubleSide })); tp.position.set(W / 2 - .03 + W * .28, -H - drop / 2 + .03, T / 2 - .004); tp.name = 'bill_tape'; g.add(tp);
  const curl = new THREE.Mesh(new THREE.TorusGeometry(.06, .036, 6, 18, Math.PI * 1.6), new THREE.MeshLambertMaterial({ color: '#f6efdc', side: THREE.DoubleSide })); curl.rotation.y = Math.PI / 2; curl.position.set(W / 2 - .03 + W * .28, -H - drop + .02, T / 2 + .05); curl.name = 'bill_tape_curl'; g.add(curl);
  return { group: g, grip: new THREE.Vector3(0, 0, 0), tip: new THREE.Vector3(W / 2, -H, 0) };
}

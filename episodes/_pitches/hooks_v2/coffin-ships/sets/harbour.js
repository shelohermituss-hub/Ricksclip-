// SET for pitch 4 hook frame: AN ENGLISH HARBOUR QUAY AT GREY DAWN, about 1872. The coffin ship MARY ANN lies alongside, so overloaded her waist is awash.
// Plan metres, Z up, Y forward (north), built inside one group turned so plan (x, y, z) = three (x, z, -y).
// Quay (cobbles, granite coping, bollards, rope coils, gas lamp, puddles) on x < 1.6, top z 0. Water z WL. The ship on x 2.3..8.1, stern at y -1 facing the lens.
// A hand-cranked wooden quay crane swings ONE MORE giant crate over her waist. Warehouse of the owner on the left, far harbour, lighthouse, town, gulls.
// Shader guards: no custom pow/sqrt in this file (the kit's own sky shader is used).
export const WL = -1.25;
export const QX = 1.2;
const SHIP = { x0: 1.75, x1: 7.55, cx: 4.65, y0: -3.5, y1: 25, poop: -0.25, waist: WL - 0.12 };
export const CRATE = [3.45, 3.8, 2.6];

export async function build(THREE, scene, film, ctx) {
  const { toon, relief, pbr, sky, trees } = ctx;
  let seed = 11; const R0 = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * R0(), pick = a => a[Math.floor(R0() * a.length)];
  const W = new THREE.Group(); W.name = 'harbour_plan'; W.rotation.x = -Math.PI / 2; scene.add(W);
  const add = (geo, mat, name, role, p, parent = W, rot) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.set(...p); if (rot) m.rotation.set(...rot); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };
  const box = (sx, sy, sz, mat, name, role, p, parent, rot) => add(new THREE.BoxGeometry(sx, sy, sz), mat, name, role, p, parent, rot);
  const vcyl = (r0, r1, h, mat, name, role, p, parent, seg = 12) => add(new THREE.CylinderGeometry(r1, r0, h, seg), mat, name, role, p, parent, [Math.PI / 2, 0, 0]);   // plan-vertical
  const rod = (a, b, r, mat, name, role = 'rope', parent = W) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), L = A.distanceTo(B), m = add(new THREE.CylinderGeometry(r, r, L, 6), mat, name, role, null, parent);
    m.position.copy(A).add(B).multiplyScalar(.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); m.castShadow = r > .02; return m; };
  const canvasTex = (w, h, draw) => { if (typeof document === 'undefined') return null; const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const sign = (text, w, h, bg, fg, font, name, p, rot, parent = W, sub) => { const t = canvasTex(1024, Math.round(1024 * h / w), (x, cw, ch) => { if (bg) { x.fillStyle = bg; x.fillRect(0, 0, cw, ch); x.strokeStyle = fg; x.lineWidth = ch * .05; x.strokeRect(ch * .06, ch * .06, cw - ch * .12, ch - ch * .12); }
      x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = font.replace('#', Math.round(ch * (sub ? .42 : .58))); x.fillText(text, cw / 2, ch * (sub ? .38 : .54)); if (sub) { x.font = font.replace('#', Math.round(ch * .2)); x.fillText(sub, cw / 2, ch * .76); } });
    const m = add(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, transparent: !bg, color: '#e8e4ea' }), name, 'sign', p, parent, rot); m.castShadow = false; return m; };

  // materials (LOOK: grey-blue dawn with strong colour on the story things)
  const M = { cobble: relief('cobble', '#7c7e8c', { seed: 3, size: .9 }), granite: relief('stone', '#a9a9b6', { seed: 5 }), quayWall: relief('stone', '#6c6f7e', { seed: 8 }),
    brick: relief('brick', '#9c5a40', { seed: 2 }), brickDk: relief('brick', '#7a4232', { seed: 4 }), plank: relief('wood', '#8a6440', { seed: 6 }), deck: relief('wood', '#b08a5c', { seed: 9 }),
    hull: relief('wood', '#25525a', { seed: 12 }), hullBand: toon('#e8dcb4'), hullDk: toon('#1c2c34'), crate: relief('wood', '#c99252', { seed: 14 }), crateDk: relief('wood', '#a8743e', { seed: 15 }),
    mast: relief('wood', '#a87a48', { seed: 16 }), rope: toon('#b89a66'), ropeDk: toon('#5a4a3a'), tar: toon('#2e2a2c'), sail: toon('#efe4c8'), sailSh: toon('#cdbf9e'),
    iron: pbr.metal('iron', { color: '#3c4258' }), brass: pbr.metal('brass', { color: '#d8a646' }), wet: pbr.metal('wet', { color: '#2c3446', rough: .06 }), glass: new THREE.MeshBasicMaterial({ color: '#ffc46a' }),
    gullW: toon('#f4f2ee'), gullG: toon('#9aa2b4'), gullB: toon('#e8a43a'), door: relief('wood', '#2f5a4c', { seed: 21 }), slate: relief('tile', '#4a5068', { seed: 22 }),
    barrel: relief('wood', '#9a6a3a', { seed: 23 }), hoop: pbr.metal('iron', { color: '#2e3240' }), sack: toon('#c8b088'), foam: new THREE.MeshBasicMaterial({ color: '#e6eef2', transparent: true, opacity: .85 }) };

  // ---------- sky: grey dawn, peach light low in the east (screen right), soft cloud masses ----------
  sky.clouds({ kind: 'clear-day', seed: 4, coverage: 1.6, colors: { top: '#4a6aa8', mid: '#8fa4cc', hor: '#f4c6a0', sun: '#ffd4a4', lit: '#fbe0cc', shade: '#8a92b2', rim: '#ffe6cc' }, sunDir: [.8, .25, -.55] });
  scene.fog = new THREE.Fog('#b4bcd4', 70, 520);

  // ---------- WATER: dark green-teal harbour water, glossy, with ripple rings ----------
  const water = add(new THREE.PlaneGeometry(900, 900), pbr.metal('wet', { color: '#2e5e62', rough: .12 }), 'harbour_water', 'water', [200, 200, WL]); water.castShadow = false;
  for (let i = 0; i < 70; i++) { const rg = add(new THREE.RingGeometry(.3, .36, 24), M.foam, 'ripple_' + i, 'water', [rr(2, 40), rr(-8, 70), WL + .01]); rg.scale.set(rr(1, 4), rr(.4, 1), 1); rg.material = rg.material.clone(); rg.material.opacity = rr(.15, .4); rg.castShadow = false; }

  // ---------- THE QUAY ----------
  const quay = new THREE.Group(); quay.name = 'quay'; W.add(quay);
  box(40, 90, .6, M.cobble, 'quay_cobbles', 'ground', [QX - 20, 30, -.3], quay);
  box(.5, 90, .32, M.granite, 'quay_coping', 'stone', [QX - .25, 30, .02], quay);                  // granite coping stones along the edge
  for (let y = -12; y < 70; y += 1.15) box(.04, .02, .33, M.tar, 'coping_joint', 'stone', [QX - .25, y, .03], quay).castShadow = false;
  box(.3, 90, Math.abs(WL) + 1.4, M.quayWall, 'quay_wall', 'stone', [QX + .02, 30, (WL - 1.4) / 2], quay);
  for (let y = -10; y < 60; y += 2.6) box(.08, .2, Math.abs(WL) + .2, M.plank, 'fender_post', 'wood', [QX + .2, y, WL / 2 - .1], quay);   // timber fenders on the wall
  // wet puddles on the cobbles (reflect the dawn sky)
  [[-1.6, -4.6, 1.3, .7], [.2, -2.8, .9, .45], [-2.8, -1.2, 1.6, .6], [-.4, 1.5, 1.2, .5], [-3.6, 3.8, 2, .8], [.4, 5.6, 1.1, .4]].forEach(([x, y, a, b], i) => { const p = add(new THREE.CircleGeometry(1, 28), M.wet, 'puddle_' + i, 'ground', [x, y, .012], quay); p.scale.set(a * .55, b * .55, 1); p.castShadow = false; });
  // iron bollards (one foreground with a gull on it), each with a mooring rope to the ship
  const bollard = (x, y, name, rope) => { const b = new THREE.Group(); b.name = name; b.position.set(x, y, 0); quay.add(b);
    vcyl(.17, .14, .55, M.iron, name + '_body', 'metal', [0, 0, .27], b, 16); vcyl(.22, .22, .08, M.iron, name + '_cap', 'metal', [0, 0, .58], b, 16); vcyl(.24, .24, .06, M.iron, name + '_foot', 'metal', [0, 0, .03], b, 16);
    if (rope) { add(new THREE.TorusGeometry(.19, .035, 6, 18), M.rope, name + '_eye', 'rope', [0, 0, .42], b); rod([x + .15, y, .42], rope, .03, M.rope, name + '_line'); } return b; };
  bollard(0.85, -6.3, 'bollard_fg', [SHIP.x0 + .4, -0.4, SHIP.poop + .5]); bollard(0.85, 14, 'bollard_mid', [SHIP.x0 + .2, 16, WL + .5]); bollard(0.85, 30, 'bollard_far', [SHIP.x0 + .1, 25, WL + .4]);
  // rope coils: flat spirals of rope (foreground right and by the crane)
  const coil = (x, y, rad, name) => { for (let k = 0; k < 4; k++) add(new THREE.TorusGeometry(rad - k * .06, .032, 6, 30), k % 2 ? M.rope : toon('#a8885a'), name + '_' + k, 'rope', [x, y, .035 + k * .055], quay); add(new THREE.TorusGeometry(rad * .5, .03, 6, 20), M.rope, name + '_top', 'rope', [x + .05, y, .26], quay); };
  coil(.05, -6.5, .42, 'coil_fg'); coil(-.4, 4.6, .36, 'coil_mid');
  // barrels and small crates stacked at the warehouse side (left middle)
  const barrel = (x, y, z, name, rot) => { const g = new THREE.Group(); g.position.set(x, y, z); if (rot) g.rotation.set(...rot); quay.add(g);
    add(new THREE.CylinderGeometry(.28, .28, .82, 16), M.barrel, name, 'wood', [0, 0, .41], g, [Math.PI / 2, 0, 0]); add(new THREE.SphereGeometry(.32, 16, 8), M.barrel, name + '_belly', 'wood', [0, 0, .41], g).scale.set(1, 1, 1.25);
    for (const h of [.12, .3, .52, .7]) add(new THREE.TorusGeometry(h > .2 && h < .6 ? .325 : .3, .016, 6, 22), M.hoop, name + '_hoop', 'metal', [0, 0, h], g); return g; };
  barrel(-0.75, 0.6, 0, 'barrel_a'); barrel(-0.8, 1.35, 0, 'barrel_b'); barrel(-0.78, 0.98, .84, 'barrel_c'); barrel(-0.7, 12, 0, 'barrel_d');
  box(.7, .6, .55, M.crateDk, 'small_crate_a', 'wood', [-0.8, 5.4, .28], quay); box(.6, .6, .5, M.crate, 'small_crate_b', 'wood', [-0.75, 5.45, .8], quay, [0, 0, .2]);
  // a sack barrow by the barrels
  box(.5, .9, .05, M.plank, 'barrow_bed', 'wood', [-0.6, 8.2, .35], quay, [.5, 0, 0]); add(new THREE.CylinderGeometry(.18, .18, .06, 14), M.iron, 'barrow_wheel', 'metal', [-0.6, 8.65, .18], quay, [0, 0, Math.PI / 2]);
  // the gas lamp (still lit at dawn): fluted iron post, lantern with glowing glass, ladder bar
  { const L = new THREE.Group(); L.name = 'gas_lamp'; L.position.set(-.5, 10.5, 0); quay.add(L);
    vcyl(.16, .16, .35, M.iron, 'lamp_base', 'metal', [0, 0, .17], L, 12); vcyl(.07, .05, 3.2, M.iron, 'lamp_post', 'metal', [0, 0, 1.9], L, 10); box(.6, .04, .04, M.iron, 'lamp_ladderbar', 'metal', [0, 0, 3.1], L);
    box(.32, .32, .42, M.glass, 'lamp_glass', 'glow', [0, 0, 3.6], L); add(new THREE.ConeGeometry(.3, .22, 4), M.iron, 'lamp_roof', 'metal', [0, 0, 3.92], L, [Math.PI / 2, 0, Math.PI / 4]);
    const pl = new THREE.PointLight('#ffb860', 6, 9, 2); pl.position.set(0, 0, 3.5); L.add(pl); }

  // ---------- THE OWNER'S WAREHOUSE (left): four storeys of brick, loading doors, hoist beam, painted name ----------
  { const H = new THREE.Group(); H.name = 'warehouse'; quay.add(H); const x0 = -7, x1 = -1.3, y0 = -2.0, y1 = 42, top = 15;
    box(x1 - x0, y1 - y0, top, M.brick, 'wh_body', 'brick', [(x0 + x1) / 2, (y0 + y1) / 2, top / 2], H);
    box(x1 - x0 + .3, .3, 1.6, M.brickDk, 'wh_gable_band', 'brick', [(x0 + x1) / 2, y0 - .05, top - .8], H);
    for (const sd of [-1, 1]) box((x1 - x0) / 2 * 1.16, y1 - y0 + .4, .18, M.slate, 'wh_roof_' + sd, 'roof', [(x0 + x1) / 2 + sd * (x1 - x0) / 4, (y0 + y1) / 2, top + 1.5], H, [0, sd * .55, 0]);
    for (let fl = 0; fl < 4; fl++) for (let y = y0 + 2; y < y1 - 1; y += 3.4) { const z = 1.6 + fl * 3.4, door = fl > 0 && Math.abs(y - (y0 + 8.8)) < 1.8;
        if (door) { box(.12, 1.6, 2.4, M.door, 'wh_loading_door', 'wood', [x1 + .02, y, z + .2], H); box(.14, 1.75, .1, M.granite, 'wh_door_sill', 'stone', [x1 + .06, y, z - 1.0], H); }
        else { box(.1, 1.1, 1.5, toon(fl === 0 && y < 12 ? '#ffc46a' : '#2a3448'), 'wh_window', 'glass', [x1 + .02, y, z + .2], H); box(.14, 1.3, .14, M.granite, 'wh_lintel', 'stone', [x1 + .05, y, z + 1.02], H); box(.14, 1.3, .1, M.granite, 'wh_sill', 'stone', [x1 + .05, y, z - .6], H);
          box(.13, .05, 1.5, M.door, 'wh_glazing_bar', 'wood', [x1 + .05, y, z + .2], H); } }
    // hoist beam and its block and rope over the loading doors
    box(1.6, .3, .3, M.plank, 'wh_hoist_beam', 'wood', [x1 + .8, y0 + 8.8, top - .6], H); vcyl(.12, .12, .25, M.iron, 'wh_hoist_block', 'metal', [x1 + 1.45, y0 + 8.8, top - 1.0], H); rod([x1 + 1.45, y0 + 8.8, top - 1.1], [x1 + 1.45, y0 + 8.8, 2.4], .02, M.rope, 'wh_hoist_rope');
    // big ground-floor cart doors
    box(.12, 2.6, 3.0, M.door, 'wh_cart_door', 'wood', [x1 + .02, y0 + 1.6, 1.5], H); box(.14, 2.8, .16, M.granite, 'wh_cart_lintel', 'stone', [x1 + .06, y0 + 1.6, 3.08], H);
    sign('GRIMSHAW & CO.', 7.5, 1.3, '#1e3a34', '#f0c862', 'bold # Georgia, serif', 'wh_name', [x1 + .09, y0 + 13, 4.9], [Math.PI / 2, Math.PI / 2, 0], H, 'SHIPOWNERS  ·  EST. 1841');
    // gable end facing the lens, with a round window
    add(new THREE.CircleGeometry(.6, 20), toon('#2a3448'), 'wh_round_window', 'glass', [(x0 + x1) / 2 + 1.5, y0 - .02, top - 2.6], H, [Math.PI / 2, 0, 0]);
    for (let k = 0; k < 3; k++) vcyl(.3, .3, 2.2, M.brickDk, 'wh_chimney_' + k, 'brick', [x0 + 1.2, y0 + 6 + k * 11, top + 2.4], H, 8); }
  // a shipping notice pasted on a post by the warehouse: the insurance in plain words
  { box(.16, .16, 2.4, M.plank, 'notice_post', 'wood', [-1.12, -1.0, 1.2], quay);
    sign('INSURED', .9, 1.1, '#efe2c0', '#2a2430', 'bold # Georgia, serif', 'notice_bill', [-1.03, -1.0, 1.9], [Math.PI / 2, Math.PI / 2, 0], quay, 'FOR FULL VALUE'); }

  // ---------- THE CRANE: a hand-cranked wooden quay crane, its jib over the ship ----------
  { const C = new THREE.Group(); C.name = 'quay_crane'; C.position.set(0.0, 3.4, 0); quay.add(C);
    box(1.4, 1.4, .25, M.granite, 'crane_plinth', 'stone', [0, 0, .12], C); box(.34, .34, 5.4, M.mast, 'crane_post', 'wood', [0, 0, 2.95], C);
    rod([0, 0, 5.4], [3.45, 0.4, 6.4], .14, M.mast, 'crane_jib', 'wood', C); rod([0, 0, 1.6], [2.7, 0.3, 5.7], .09, M.mast, 'crane_strut', 'wood', C);
    for (const [a, b] of [[[0, 0, 2.2], [1.2, .45, 4.8]], [[.6, .2, 3.1], [1.9, .7, 5.2]]]) rod(a, b, .05, M.iron, 'crane_tie', 'metal', C);
    add(new THREE.CylinderGeometry(.42, .42, .08, 24), M.iron, 'crane_gear', 'metal', [-.25, 0, 1.45], C, [0, 0, Math.PI / 2]);   // big gear wheel
    for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8; box(.09, .06, .06, M.iron, 'crane_tooth', 'metal', [-.25, Math.cos(a) * .45, 1.45 + Math.sin(a) * .45], C); }
    add(new THREE.CylinderGeometry(.16, .16, .5, 14), M.rope, 'crane_drum', 'rope', [.05, 0, 1.1], C, [0, 0, Math.PI / 2]);
    rod([-.3, 0, 1.1], [-.3, -.35, .8], .03, M.iron, 'crane_crank', 'metal', C); rod([-.3, -.35, .8], [-.5, -.35, .8], .03, M.brass, 'crane_handle', 'metal', C);
    add(new THREE.CylinderGeometry(.14, .14, .1, 12), M.iron, 'crane_sheave', 'metal', [3.45, 0.4, 6.25], C, [0, 0, Math.PI / 2]); }
  const jibTip = [3.45, 3.8, 6.2];

  // ---------- THE CRATE: one more giant crate, stencilled, iron-strapped, slung in rope from the crane hook ----------
  { const G = new THREE.Group(); G.name = 'hero_crate'; G.position.set(...CRATE); G.rotation.z = .22; W.add(G); const a = 1.9, b = 1.5, c = 1.5;
    box(a, b, c, M.crate, 'crate_body', 'wood', [0, 0, 0], G);
    for (const s of [-1, 1]) { box(a + .02, .12, .14, M.crateDk, 'crate_batten_h', 'wood', [0, s * (b / 2 - .04), c / 2 - .1], G); box(a + .02, .12, .14, M.crateDk, 'crate_batten_l', 'wood', [0, s * (b / 2 - .04), -c / 2 + .1], G);
      box(.14, b + .02, .14, M.crateDk, 'crate_batten_e', 'wood', [s * (a / 2 - .05), 0, c / 2 - .1], G); box(.14, .12, c, M.crateDk, 'crate_batten_v', 'wood', [s * (a / 2 - .08), -(b / 2 + .01), 0], G); }
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) box(.2, .2, .2, M.hoop, 'crate_corner_iron', 'metal', [sx * (a / 2 - .06), sy * (b / 2 - .06), sz * (c / 2 - .06)], G);
    rod([-a / 2, -b / 2 - .02, .2], [a / 2, -b / 2 - .02, .2], .025, M.hoop, 'crate_strap', 'metal', G); rod([-a / 2, -b / 2 - .02, -.35], [a / 2, -b / 2 - .02, -.35], .025, M.hoop, 'crate_strap2', 'metal', G);
    sign('PIG IRON', 1.6, .5, null, '#1e1a24', 'bold # Georgia, serif', 'crate_stencil', [0, -b / 2 - .06, .12], [Math.PI / 2, 0, 0], G, null);
    sign('6 TONS', 1.2, .4, null, '#1e1a24', 'bold # Georgia, serif', 'crate_stencil2', [0, -b / 2 - .06, -.4], [Math.PI / 2, 0, 0], G, null);
    // the rope sling: four legs to the hook
    const hk = [0, 0, 1.6]; for (const sx of [-1, 1]) for (const sy of [-1, 1]) rod([sx * (a / 2 - .1), sy * (b / 2 - .1), c / 2], hk, .03, M.rope, 'crate_sling', 'rope', G);
    add(new THREE.TorusGeometry(.12, .035, 8, 16, Math.PI * 1.5), M.iron, 'crate_hook', 'metal', [0, 0, 1.62], G, [Math.PI / 2, 0, 0]); }
  rod([CRATE[0], CRATE[1], CRATE[2] + 1.75], jibTip, .035, M.rope, 'crane_fall');
  // the tag line from the crate's corner down to the docker's fists on the quay edge
  rod([CRATE[0] - .9, CRATE[1] - .7, CRATE[2] - .6], [1.55, 2.2, 1.35], .022, M.rope, 'tag_line');

  // ---------- THE SHIP: an old barque, MARY ANN of Hull, so deep the sea runs over her waist ----------
  const S = new THREE.Group(); S.name = 'coffin_ship'; W.add(S); const L = SHIP.y1 - SHIP.y0, bw = SHIP.x1 - SHIP.x0;
  // hull: a box with a pointed bow, only a hand's breadth showing above the water
  const hullShape = new THREE.Shape(); hullShape.moveTo(-bw / 2, 0); hullShape.lineTo(bw / 2, 0); hullShape.lineTo(bw / 2, L - 7); hullShape.quadraticCurveTo(bw / 2, L - 1.5, 0, L); hullShape.quadraticCurveTo(-bw / 2, L - 1.5, -bw / 2, L - 7); hullShape.lineTo(-bw / 2, 0);
  const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 2.2, bevelEnabled: false }); const hull = add(hullGeo, M.hull, 'hull', 'wood', [SHIP.cx, SHIP.y0, WL - 1.8], S);
  // bulwarks: barely above the sea in the waist, higher at the poop (stern) and the forecastle (bow)
  const bul = (x, y0, y1, z0, z1, name) => box(.16, y1 - y0, z1 - z0, M.hull, name, 'wood', [x, (y0 + y1) / 2, (z0 + z1) / 2], S);
  for (const s of [-1, 1]) { const x = SHIP.cx + s * (bw / 2 - .08); bul(x, SHIP.y0, 2.5, WL - .1, SHIP.poop + .3, 'bulwark_poop'); bul(x, 2.5, 20, WL - .1, WL + .14, 'bulwark_waist'); bul(x, 20, L - 6, WL - .1, WL + 1.0, 'bulwark_fore');
    box(.22, L - 6, .1, M.hullBand, 'cream_band', 'paint', [x + s * .02, (SHIP.y0 + L - 6) / 2, WL + .15], S); box(.24, 6, .12, M.hullBand, 'poop_rail', 'wood', [x + s * .02, -.5, SHIP.poop + .32], S); }
  // the transom (stern) facing the lens, with the name almost touching the water
  box(bw, .16, SHIP.poop + .35 - (WL - .2), M.hull, 'transom', 'wood', [SHIP.cx, SHIP.y0 - .02, (SHIP.poop + .35 + WL - .2) / 2], S);
  box(bw + .1, .2, .14, M.hullBand, 'transom_rail', 'wood', [SHIP.cx, SHIP.y0 - .03, SHIP.poop + .35], S);
  sign('MARY ANN', 3.4, .62, null, '#f2c45a', 'bold # Georgia, serif', 'stern_name', [SHIP.cx + .3, SHIP.y0 - .12, -0.42], [Math.PI / 2, 0, 0], S);
  sign('HULL', 1.0, .3, null, '#f2c45a', 'bold # Georgia, serif', 'stern_port', [SHIP.cx + .3, SHIP.y0 - .12, WL + .14], [Math.PI / 2, 0, 0], S);
  if (0) for (let k = 0; k < 3; k++) box(.5, .06, .36, M.glass, 'stern_window_' + k, 'glass', [SHIP.cx - 1.4 + k * 1.4, SHIP.y0 - .11, SHIP.poop + .12], S);
  sign('XVI', .42, .2, null, '#f4efe2', 'bold # Georgia, serif', 'draft_XVI', [SHIP.x0 + .45, SHIP.y0 - .12, WL + .06], [Math.PI / 2, 0, 0], S);
  sign('XIV', .42, .2, null, '#f4efe2', 'bold # Georgia, serif', 'draft_XIV', [SHIP.x0 + .45, SHIP.y0 - .12, WL - .3], [Math.PI / 2, 0, 0], S);
  add(new THREE.BoxGeometry(.12, .5, 2.0), M.plank, 'rudder', 'wood', [SHIP.cx, SHIP.y0 - .3, WL - .2], S);
  // decks: the poop (dry, where the crew stand) and the waist (under the sea)
  box(bw - .2, 6, .14, pbr.metal('wet', { color: '#7a6448', rough: .2 }), 'poop_deck', 'deck', [SHIP.cx, SHIP.y0 + 3, SHIP.poop - .07], S);
  box(bw - .2, .14, SHIP.poop - SHIP.waist, M.plank, 'poop_break', 'wood', [SHIP.cx, 2.5, (SHIP.poop + SHIP.waist) / 2], S);
  box(bw - .3, 17.5, .1, M.deck, 'waist_deck', 'deck', [SHIP.cx, 11.25, SHIP.waist - .05], S);
  // the sea coming aboard over the poop: a thin sheet of water and foam across the deck, spray over the far rail, cargo lashed even here
  { const sheet = add(new THREE.PlaneGeometry(bw - .4, 5.2), new THREE.MeshBasicMaterial({ color: '#9fc4c8', transparent: true, opacity: .35 }), 'poop_wash', 'water', [SHIP.cx + .2, SHIP.y0 + 3.2, SHIP.poop + .012], S); sheet.castShadow = false;
    for (let i = 0; i < 26; i++) { const f = add(new THREE.CircleGeometry(.3, 10), M.foam, 'poop_foam_' + i, 'water', [SHIP.cx + rr(-2.4, 2.6), SHIP.y0 + rr(.6, 5.8), SHIP.poop + .02], S); f.scale.set(rr(.6, 2.2), rr(.15, .4), 1); f.castShadow = false; }
    for (let i = 0; i < 30; i++) { const d = add(new THREE.SphereGeometry(rr(.03, .08), 6, 5), M.foam, 'rail_spray_' + i, 'water', [SHIP.x1 - rr(0, .5), SHIP.y0 + rr(.5, 6), SHIP.poop + rr(.3, 1.1)], S); d.castShadow = false; }
    box(1.1, 1.0, .9, M.crate, 'poop_cargo_a', 'wood', [SHIP.cx + 1.6, SHIP.y0 + 1.0, SHIP.poop + .45], S, [0, 0, .1]); box(.9, .8, .7, M.crateDk, 'poop_cargo_b', 'wood', [SHIP.cx + 1.55, SHIP.y0 + 1.05, SHIP.poop + 1.25], S, [0, 0, -.15]);
    rod([SHIP.cx + 1.0, SHIP.y0 + .5, SHIP.poop + 1.6], [SHIP.cx + 2.2, SHIP.y0 + 1.5, SHIP.poop], .02, M.rope, 'cargo_lashing'); }
  // the ship's wheel and binnacle on the poop
  { const wh = new THREE.Group(); wh.position.set(SHIP.cx + 1.7, 0.4, SHIP.poop); S.add(wh); box(.12, .12, .9, M.plank, 'wheel_post', 'wood', [0, 0, .45], wh);
    add(new THREE.TorusGeometry(.42, .03, 6, 24), M.mast, 'wheel_rim', 'wood', [0, -.08, 1.0], wh, [Math.PI / 2, 0, 0]); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; rod([0, -.08, 1.0], [Math.cos(a) * .55, -.08, 1.0 + Math.sin(a) * .55], .02, M.mast, 'wheel_spoke', 'wood', wh); }
    vcyl(.16, .2, .8, M.brass, 'binnacle', 'metal', [-1.0, .6, .4], wh); }
  // overloaded waist: stacked crates, sacks and barrels standing in the sea water
  for (let i = 0; i < 18; i++) { const x = SHIP.cx + rr(-2.1, 2.1), y = rr(3.6, 19), h = rr(.6, 1.1), sz = rr(.7, 1.2); box(sz, sz * rr(.8, 1.2), h, pick([M.crate, M.crateDk]), 'deck_cargo_' + i, 'wood', [x, y, SHIP.waist + h / 2], S, [0, 0, rr(-.3, .3)]); }
  for (let i = 0; i < 8; i++) { const sk = add(new THREE.SphereGeometry(.35, 10, 8), M.sack, 'deck_sack_' + i, 'cloth', [SHIP.cx + rr(-2, 2), rr(6, 19), SHIP.waist + rr(.7, 1.3)], S); sk.scale.set(1.3, .9, .6); }
  // the main hatch, open, with water pouring in over its coaming
  box(2.0, 2.6, .35, M.plank, 'hatch_coaming', 'wood', [SHIP.cx, 9.8, SHIP.waist + .17], S);
  // sea washing over the waist bulwark on the quay side: foam sheets and splash droplets (the water "laps over the deck")
  for (let i = 0; i < 22; i++) { const y = 3 + i * .75, f = add(new THREE.PlaneGeometry(.9, .5), M.foam, 'wash_foam_' + i, 'water', [SHIP.x0 + rr(.1, .7), y, WL + rr(.02, .1)], S); f.rotation.z = rr(-.3, .3); f.scale.set(rr(.6, 1.4), rr(.6, 1.2), 1); f.castShadow = false; }
  for (let i = 0; i < 26; i++) { const d = add(new THREE.SphereGeometry(rr(.03, .07), 6, 5), M.foam, 'splash_' + i, 'water', [SHIP.x0 + rr(-.1, .5), rr(3, 16), WL + .15 + rr(0, .45)], S); d.castShadow = false; }
  for (let i = 0; i < 30; i++) { const f = add(new THREE.PlaneGeometry(rr(.6, 1.6), rr(.08, .2)), M.foam, 'hull_foam_' + i, 'water', [SHIP.x0 - .05 - rr(0, .3), rr(-1, 25), WL + .015], S); f.rotation.z = Math.PI / 2 + rr(-.1, .1); f.castShadow = false; }
  // masts with yards and furled sails, shrouds and stays
  const mast = (y, h, name, yards) => { const base = y < 5 ? SHIP.poop : SHIP.waist; vcyl(.2, .13, h, M.mast, name, 'wood', [SHIP.cx, y, base + h / 2], S, 10);
    vcyl(.26, .26, .3, M.tar, name + '_top', 'wood', [SHIP.cx, y, base + h * .55], S, 10);
    yards.forEach((u, k) => { const z = base + h * u, w = 9 - k * 2.2; rod([SHIP.cx - w / 2, y, z], [SHIP.cx + w / 2, y, z], .09 - k * .015, M.mast, name + '_yard', 'wood', S);
      const fs = add(new THREE.CylinderGeometry(.2, .2, w * .92, 10), M.sail, name + '_furled', 'cloth', [SHIP.cx, y + .08, z - .15], S, [0, 0, Math.PI / 2]); fs.scale.set(1, 1, .8); });
    for (const s of [-1, 1]) for (let k = 0; k < 4; k++) rod([SHIP.cx + s * (bw / 2 + .1), y - 1.2 + k * .5, WL + .5], [SHIP.cx + s * .2, y, base + h * .55], .012, M.tar, name + '_shroud', 'rope', S);
    for (let r = 1; r < 9; r++) { const t = r / 9, s = -1; rod([SHIP.cx + s * (bw / 2 + .1 - (bw / 2 - .1) * t) , y - 1.2, WL + .5 + (h * .55 - .3) * t], [SHIP.cx + s * (bw / 2 + .1 - (bw / 2 - .1) * t), y + .3, WL + .5 + (h * .55 - .3) * t], .008, M.tar, name + '_ratline', 'rope', S); } };
  mast(0.6, 14, 'mizzen', [.45, .72]); mast(11, 21, 'mainmast', [.35, .58, .78]); mast(19.5, 19, 'foremast', [.35, .58, .78]);
  rod([SHIP.cx, 11, SHIP.waist + 20], [SHIP.cx, 19.5, SHIP.waist + 17], .015, M.tar, 'stay_main_fore'); rod([SHIP.cx, 0.6, SHIP.poop + 13.5], [SHIP.cx, 11, SHIP.waist + 15], .015, M.tar, 'stay_mizzen_main');
  rod([SHIP.cx, SHIP.y1 + 4, WL + 2.2], [SHIP.cx, 19.5, SHIP.waist + 18], .015, M.tar, 'fore_stay'); rod([SHIP.cx, SHIP.y1 - 1, WL + .9], [SHIP.cx, SHIP.y1 + 5, WL + 2.4], .1, M.mast, 'bowsprit', 'wood', S);
  // a red-white ensign? no: a faded blue ensign-less pennant (no flag symbol), a long cream pennant at the main truck
  { const p = add(new THREE.PlaneGeometry(2.4, .3), M.sail, 'pennant', 'cloth', [SHIP.cx + 1.2, 11, SHIP.waist + 21.2], S, [Math.PI / 2, 0, 0]); p.castShadow = false; }

  // ---------- FAR HARBOUR: other ships' masts, the pier with its lighthouse, the town and the hills ----------
  for (let i = 0; i < 9; i++) { const x = rr(14, 60), y = rr(30, 110), h = rr(12, 22); vcyl(.15, .1, h, toon('#6a6a82'), 'far_mast_' + i, 'far', [x, y, WL + h / 2], W, 6); rod([x - 3, y, WL + h * .6], [x + 3, y, WL + h * .6], .06, toon('#6a6a82'), 'far_yard_' + i, 'far');
    box(rr(4, 7), rr(14, 22), 1.2, toon(pick(['#3a4a5e', '#4a3c46', '#2e4a4a'])), 'far_hull_' + i, 'far', [x, y, WL + .3]); }
  box(4, 120, 2.2, relief('stone', '#8a8ea2', { seed: 30 }), 'pier', 'stone', [44, 90, WL + .6]);
  { const lx = 44, ly = 150; vcyl(2.2, 1.6, 16, toon('#efe8dc'), 'lighthouse', 'far', [lx, ly, WL + 8], W, 16); for (let k = 0; k < 3; k++) vcyl(2.25 - k * .2, 2.15 - k * .2, 1.4, toon('#b84a3a'), 'lighthouse_band', 'far', [lx, ly, WL + 3 + k * 4.4], W, 16);
    vcyl(1.3, 1.3, 1.6, M.glass, 'lighthouse_lamp', 'glow', [lx, ly, WL + 16.8], W, 12); add(new THREE.ConeGeometry(1.6, 1.4, 12), toon('#2e3446'), 'lighthouse_cap', 'far', [lx, ly, WL + 18.3], W, [Math.PI / 2, 0, 0]); }
  for (let i = 0; i < 70; i++) { const x = rr(-30, 110), y = rr(190, 260), w = rr(4, 10), h = rr(4, 14); box(w, rr(4, 8), h, toon(pick(['#a8786a', '#9a8a8e', '#b08c6c', '#8a7a86'])), 'town_' + i, 'far', [x, y, WL + h / 2]);
    if (R0() < .5) vcyl(.4, .4, 3, toon('#5a4a50'), 'town_chimney_' + i, 'far', [x + w * .3, y, WL + h + 1.4], W, 6); }
  for (let i = 0; i < 6; i++) { const h = add(new THREE.SphereGeometry(rr(60, 110), 18, 10), toon(pick(['#7f8fae', '#8a98b8', '#7686a6'])), 'hill_' + i, 'far', [rr(-120, 200), rr(320, 420), WL - 40]); h.scale.set(1.6, .5, .6); h.castShadow = false; }

  // ---------- GULLS: flying in the dawn light, one standing on the foreground bollard ----------
  const gull = (p, s, flap, name, stand) => { const g = new THREE.Group(); g.position.set(...p); g.scale.setScalar(s); g.rotation.z = rr(-1, 1); W.add(g);
    const b = add(new THREE.SphereGeometry(.16, 12, 8), M.gullW, name + '_body', 'bird', [0, 0, 0], g); b.scale.set(1, 2.2, 1); add(new THREE.SphereGeometry(.1, 10, 8), M.gullW, name + '_head', 'bird', [0, .36, .1], g);
    add(new THREE.ConeGeometry(.03, .14, 6), M.gullB, name + '_beak', 'bird', [0, .5, .08], g, [0, 0, 0]);
    if (stand) { for (const s2 of [-1, 1]) { box(.12, .5, .05, M.gullG, name + '_wing', 'bird', [s2 * .14, -.05, .04], g); rod([s2 * .05, 0, -.1], [s2 * .06, 0, -.32], .012, M.gullB, name + '_leg', 'bird', g); } }
    else for (const s2 of [-1, 1]) { const w = box(.9, .28, .03, M.gullW, name + '_wing', 'bird', [s2 * .5, 0, .08 + flap * .2], g, [0, s2 * -flap, 0]); const tip = box(.4, .2, .03, M.gullG, name + '_tip', 'bird', [s2 * 1.05, -.03, .08 + flap * .55], g, [0, s2 * -flap * 1.6, 0]); }
    return g; };
  gull([0.8, -6.3, .8], .45, 0, 'gull_bollard', true);
  [[3, 12, 9, 1.2, .5], [-1, 18, 12, 1.4, -.3], [6, 6, 7.5, 1.1, .7], [10, 25, 14, 1.6, .2], [-4, 30, 17, 1.6, .6], [8, 40, 19, 2, -.4], [16, 35, 12, 2, .4]].forEach(([x, y, z, s, f], i) => gull([x, y, z], s, f, 'gull_' + i));

  return { update() {} };
}

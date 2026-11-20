// SET for pitch 2 board (2026-11-16): THE S-CURVE ON LAKE SHORE DRIVE, Chicago, 2006, blue hour, a night road crew at work.
// Plan metres, Z up, Y forward (away from the frame-0 lens, looking north up the southbound lanes; traffic comes toward the lens).
// Origin = the painter's feet on the newest stripe. Our 4 lanes x -6.6..6.6 (lane lines every 3.3 m), the road bends LEFT then RIGHT from y 16.
// Parts: asphalt with tar-sealed cracks, an oil stripe down each lane, worn dashed lane lines, yellow left edge line; THE STRIPES (transverse white bars,
// spacing shrinking toward the curve; the newest one wet and glossy, half done, a blue chalk guide line where the rest will go); the dented W-beam
// MEDIAN GUARDRAIL on the right (crumpled bay, scrapes, black tyre rubber, a bent post, amber reflectors) with the SKID MARKS that run into it;
// the northbound lanes and the limestone-step revetment; LAKE MICHIGAN in blue hour; the Gold Coast high-rise wall with lit windows along the
// left and ahead following the curve; park oaks; sodium cobra-head lamps; the CURVE 25 MPH sign; the portable LIGHT TOWER (the one hard key, the pool);
// the cone taper; THE SEMI (long-nose conventional, chrome grille, stacks, amber cab lights, headlights on, LAKESIDE HAULING on the door, box trailer);
// foreground: the 5-gallon TRAFFIC WHITE pail with drips, the paint tray, a cone with reflective collars.
export const TRUCK = { x: -4.6, y: 9.5, yaw: -20 * Math.PI / 180 };

const canvasTex = (THREE, w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };
const sm = t => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
export const cx = y => -9 * sm((y - 16) / 26) + 6 * sm((y - 46) / 26);            // road centre line: S-curve, left then right
const dcx = y => (cx(y + .05) - cx(y - .05)) / .1;

export async function build(THREE, scene, film, ctx) {
  const { B2T, toon } = ctx, V = (x, y, z) => B2T([x, y, z]);
  let seed = 7; const R0 = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * R0();
  const add = (geo, mat, name, role, p, parent = scene, shadow = true) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m; };
  const box = (sx, sy, sz, mat, name, role, x, y, z, parent, shadow) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, role, V(x, y, z), parent, shadow);
  const bar = (a, b, r, mat, name, role = 'metal', parent = scene, segs = 8) => { const A = V(...a), Bv = V(...b), d = Bv.clone().sub(A), L = Math.max(d.length(), 1e-4), m = add(new THREE.CylinderGeometry(r, r, L, segs), mat, name, role, A.clone().addScaledVector(d, .5), parent); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); return m; };
  const glow = (c, o = {}) => new THREE.MeshBasicMaterial({ color: c, toneMapped: false, ...o });
  // a flat ribbon on the ground (or any z) through plan points [x, y], width w, uv u across, v along (metres / vlen)
  const ribbon = (pts, w, mat, name, z = .01, role = 'paint', vlen = 1, parent = scene) => { const P = [], U = [], I = []; let acc = 0;
    for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.max(Math.hypot(dx, dy), 1e-4), nx = -dy / l, ny = dx / l;
      if (i) acc += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); const zz = Array.isArray(z) ? z[i] : z;
      for (const s of [-1, 1]) { const q = B2T([pts[i][0] + nx * s * w / 2, pts[i][1] + ny * s * w / 2, zz]); P.push(q.x, q.y, q.z); U.push((s + 1) / 2, acc / vlen); }
      if (i) { const k = i * 2; I.push(k - 2, k - 1, k, k - 1, k + 1, k); } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); g.setIndex(I); g.computeVertexNormals();
    if (!mat.userData.ds) { mat.side = THREE.DoubleSide; mat.userData.ds = 1; } const m = add(g, mat, name, role, null, parent, false); return m; };
  const along = (off, y0, y1, step = 1) => { const p = []; for (let y = y0; y <= y1 + 1e-6; y += step) { const d = dcx(y), l = Math.hypot(1, d); p.push([cx(y) + off / l, y - off * d / l]); } return p; };

  // ---------- sky: blue hour dome, sunset glow behind the city (west = left), thin lit cloud streaks ----------
  scene.children.forEach(o => { if (o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.radius === 400) o.visible = false; });
  const skyT = canvasTex(THREE, 1024, 512, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h * .5); g.addColorStop(0, '#16245e'); g.addColorStop(.45, '#2f3f9a'); g.addColorStop(.8, '#7a5ab0'); g.addColorStop(1, '#ff9c6a'); c.fillStyle = g; c.fillRect(0, 0, w, h * .5);
    c.fillStyle = '#ff9c6a'; c.fillRect(0, h * .5, w, h * .5);
    const r = c.createRadialGradient(w * .62, h * .5, 10, w * .62, h * .5, w * .32); r.addColorStop(0, 'rgba(255,200,120,.95)'); r.addColorStop(.5, 'rgba(255,140,110,.45)'); r.addColorStop(1, 'rgba(255,140,110,0)'); c.fillStyle = r; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) { const y = h * (.18 + R0() * .27), x = R0() * w, lw = 60 + R0() * 220, th = 3 + R0() * 7; c.fillStyle = `rgba(${y > h * .36 ? '255,170,140' : '150,140,220'},${.35 + R0() * .35})`; c.beginPath(); c.ellipse(x, y, lw, th, 0, 0, Math.PI * 2); c.fill(); } });
  const dome = add(new THREE.SphereGeometry(390, 48, 24), new THREE.MeshBasicMaterial({ map: skyT, side: THREE.BackSide, fog: false, toneMapped: false }), 'blue_hour_sky', 'sky', V(0, 0, 0), scene, false); dome.rotation.y = Math.PI * .5; dome.userData.noExport = true;
  scene.background = new THREE.Color('#2f3f9a'); scene.fog = new THREE.Fog('#4a4f9a', 90, 420);
  { const gp = add(new THREE.PlaneGeometry(500, 700), toon('#22302a'), 'city_side_ground', 'ground', V(-257, 150, -.03), scene, false); gp.rotation.x = -Math.PI / 2; }

  // ---------- asphalt ----------
  const asphT = canvasTex(THREE, 1024, 1024, (c, w, h) => { c.fillStyle = '#2e2c38'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 26000; i++) { const v = 40 + R0() * 60 | 0; c.fillStyle = `rgba(${v + 6},${v + 4},${v + 12},${.35 + R0() * .4})`; c.fillRect(R0() * w, R0() * h, 1 + R0() * 3, 1 + R0() * 3); }
    for (let k = 0; k < 4; k++) { const x0 = w * (k + .5) / 4; const g = c.createLinearGradient(x0 - 60, 0, x0 + 60, 0); g.addColorStop(0, 'rgba(20,18,26,0)'); g.addColorStop(.5, 'rgba(20,18,26,.45)'); g.addColorStop(1, 'rgba(20,18,26,0)'); c.fillStyle = g; c.fillRect(x0 - 60, 0, 120, h); }   // oil stripe down each lane
    c.strokeStyle = 'rgba(14,12,18,.9)'; c.lineCap = 'round'; for (let i = 0; i < 16; i++) { c.lineWidth = 4 + R0() * 5; c.beginPath(); let x = R0() * w, y = R0() * h; c.moveTo(x, y); for (let q = 0; q < 9; q++) { x += (R0() - .5) * 70; y += 18 + R0() * 30; c.lineTo(x, y); } c.stroke(); }   // tar-sealed cracks
    c.fillStyle = 'rgba(70,64,80,.5)'; for (let i = 0; i < 10; i++) { c.beginPath(); c.ellipse(R0() * w, R0() * h, 30 + R0() * 70, 14 + R0() * 30, R0() * 3, 0, Math.PI * 2); c.fill(); } });   // patches
  const asph = new THREE.MeshStandardMaterial({ map: asphT, roughness: .82, metalness: 0 }); asphT.wrapS = asphT.wrapT = THREE.RepeatWrapping;
  const road = ribbon(along(0, -30, 140, .5), 13.2, asph, 'lsd_southbound_asphalt', 0, 'road', 13.2); road.receiveShadow = true;
  asphT.repeat.set(1, 1);
  // edges: concrete curb + gutter on the left (city side), the median strip on the right
  const conc = ctx.relief ? ctx.relief('plaster', '#b9b4bc', { size: 2 }) : toon('#b9b4bc');
  ribbon(along(-6.95, -30, 140, .5), .7, conc, 'left_gutter_curb', .06, 'stone');
  ribbon(along(7.3, -30, 140, .5), 1.4, conc, 'median_strip', .08, 'stone');
  // lane lines: worn white dashes (3 m dash, 9 m gap), the yellow edge line on the left
  const dashT = canvasTex(THREE, 64, 512, (c, w, h) => { c.fillStyle = '#e8e6de'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(60,58,68,.55)'; for (let i = 0; i < 90; i++) c.fillRect(R0() * w, R0() * h, 3 + R0() * 8, 3 + R0() * 10); });
  const dashM = new THREE.MeshStandardMaterial({ map: dashT, roughness: .6 });
  for (const off of [-3.3, 0, 3.3]) for (let y = -28; y < 130; y += 12) ribbon(along(off, y, y + 3, .5), .14, dashM, 'lane_dash', .012);
  ribbon(along(-6.4, -30, 140, .5), .14, new THREE.MeshStandardMaterial({ color: '#f2c230', roughness: .6 }), 'yellow_edge_line', .012);
  ribbon(along(6.4, -30, 140, .5), .14, dashM, 'white_edge_line', .012);

  // ---------- THE STRIPES: transverse white bars, closer and closer toward the curve ----------
  const stripeT = canvasTex(THREE, 512, 64, (c, w, h) => { c.fillStyle = '#f4f3ee'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(200,200,196,.6)'; for (let i = 0; i < 40; i++) c.fillRect(R0() * w, 0, 2 + R0() * 6, h);   // roller streaks across
    c.fillStyle = 'rgba(60,58,68,.7)'; for (let i = 0; i < 60; i++) c.fillRect(R0() * w, R0() < .5 ? R0() * 5 : h - R0() * 5, 2 + R0() * 4, 2 + R0() * 3); });
  const stripeM = new THREE.MeshStandardMaterial({ map: stripeT, roughness: .55, emissive: '#cfd4e6', emissiveIntensity: .42 });   // glass beads in the paint shine back
  const STR = [4.3, 8.0, 11.3, 14.2, 16.8, 19.1, 21.1, 22.9, 24.5, 25.9, 27.1, 28.2, 29.2, 30.1, 30.9];
  const across = (y, x0, x1) => { const d = dcx(y), l = Math.hypot(1, d), tx = 1 / l, ty = d / l, p = []; for (let s = x0; s <= x1 + 1e-6; s += .5) p.push([cx(y) + s * tx, y + s * ty]); return p; };   // a line across the road at y, plan offsets x0..x1 from the centre
  STR.forEach((y, i) => ribbon(across(y, -6.5, 6.5), .5, stripeM, 'stripe_' + i, .014, 'paint', 13));
  // the newest stripe: wet and glossy from the cone line (x -3.3) to the roller (x 1.0); a blue chalk guide line for the rest; a wet roller start blob
  const wetM = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .12, clearcoat: 1, clearcoatRoughness: .08, map: stripeT });
  ribbon(across(.12, -.55, 6.5), .5, wetM, 'stripe_wet_newest', .016, 'paint', 7);
  ribbon(across(-.13, -3.3, -.55), .03, new THREE.MeshBasicMaterial({ color: '#4f8ef0' }), 'chalk_guide_line_front', .015); ribbon(across(.37, -3.3, -.55), .03, new THREE.MeshBasicMaterial({ color: '#4f8ef0' }), 'chalk_guide_line_back', .015);
  for (let i = 0; i < 7; i++) add(new THREE.CircleGeometry(.03 + R0() * .05, 12), wetM, 'paint_drip_spot', 'paint', V(rr(-.6, 3.2), rr(-.35, .62), .017), scene, false).rotation.x = -Math.PI / 2;
  // the chalk-line reel and a tape measure lying at the stripe's right end
  box(.12, .05, .12, toon('#2a6ae0'), 'chalk_line_reel', 'tool', -3.0, .45, .06); add(new THREE.CylinderGeometry(.06, .06, .05, 14), toon('#f2c230'), 'tape_measure', 'tool', V(-2.4, -.3, .03));

  // ---------- SKID MARKS into THE DENTED MEDIAN GUARDRAIL (right side, y 5..12) ----------
  const skidM = new THREE.MeshBasicMaterial({ color: '#141218', transparent: true, opacity: .72, depthWrite: false });
  for (const [o, k] of [[-.8, 0], [.8, 1], [-.75, 2], [.85, 3]]) { const p = []; for (let t = 0; t <= 1.0001; t += .05) { const y = 26 - 18 * t + (k > 1 ? 5 : 0), x = cx(y) + 1.5 + 5.4 * Math.pow(t, 1.6) + o * (1 - t * .2); p.push([x, y]); } ribbon(p, .22, skidM, 'skid_mark', .013 + k * .001, 'mark'); }
  // W-beam guardrail on the median (x 7.1 from the centre line), posts every 1.9 m, blockouts, reflectors; crumpled bay at y 7..11
  const steel = ctx.pbr ? ctx.pbr.metal('steel', { color: '#aeb6c0', rough: .38, toon: '#aeb6c0' }) : toon('#aeb6c0'), steelD = ctx.pbr ? ctx.pbr.metal('steel', { color: '#7a828c', rough: .5, toon: '#7a828c' }) : toon('#7a828c');
  const rubber = new THREE.MeshBasicMaterial({ color: '#16141a' }), amber = glow('#ffb020');
  for (let y = -24; y < 60; y += 1.9) { const x = cx(y) + 7.25, dent = y > 6.5 && y < 11.5, bend = dent ? (y > 8.5 && y < 9.9 ? .5 : .2) : 0;
    const post = box(.1, .16, .72, steelD, 'rail_post' + (dent && bend > .3 ? '_bent' : ''), 'metal', x + bend * .3, y, .36); post.rotation.z = -bend * .9;
    box(.12, .18, .3, toon('#5a4a3a'), 'rail_blockout', 'wood', x - .1 + bend * .2, y, .55); }
  for (let y = -24; y < 60; y += .8) { const y1 = y + .8, mid = (y + y1) / 2, dent = mid > 6.5 && mid < 11.5, dd = dent ? Math.sin((mid - 6.5) / 5 * Math.PI) : 0, x = cx(mid) + 7.05 + dd * .42;
    const yaw = Math.atan(dcx(mid)); for (const [z, h] of [[.62, .14], [.47, .14]]) { const s = box(.07, .82, h, steel, dent ? 'rail_beam_crumpled' : 'rail_beam', 'metal', x + (dent ? rr(-.05, .05) : 0), mid, z - dd * .1 + (dent ? rr(-.04, .04) : 0)); s.rotation.y = yaw + (dent ? rr(-.35, .35) : 0); s.rotation.x = dent ? rr(-.25, .25) : 0; }
    if (dent) { const m = box(.01, .5, .07, rubber, 'tyre_rubber_on_rail', 'mark', x - .045, mid, .55 + rr(-.05, .05)); m.rotation.y = yaw; }
    if (!dent && Math.round(y / .8) % 5 === 0) add(new THREE.CircleGeometry(.035, 10), amber, 'rail_reflector', 'lamp', V(x - .045, mid, .55), scene, false).rotation.y = -Math.PI / 2 + yaw; }
  // bright scrape lines in the crumpled bay + a broken-off chunk of bumper and glass bits on the road
  for (let i = 0; i < 8; i++) { const y = rr(7, 11), x = cx(y) + 7.0 + Math.sin((y - 6.5) / 5 * Math.PI) * .42 - .05, s = box(.005, rr(.3, .9), .012, glow('#e8eef6'), 'rail_scrape', 'mark', x, y, rr(.45, .68), scene, false); s.rotation.x = rr(-.2, .2); }
  box(.5, .16, .12, toon('#b02a2a'), 'broken_bumper_piece', 'debris', 5.9, 8.4, .06).rotation.y = .7;
  for (let i = 0; i < 18; i++) add(new THREE.TetrahedronGeometry(.025), glow(i % 3 ? '#d8ecff' : '#ff5a3a'), 'glass_bit', 'debris', V(rr(5.2, 6.8), rr(6.5, 10), .015), scene, false);

  // ---------- beyond the median: northbound lanes, revetment, LAKE MICHIGAN ----------
  ribbon(along(11.6, -30, 140, .5), 7.2, asph, 'lsd_northbound_asphalt', -.005, 'road', 13.2);
  for (let y = -10; y < 120; y += 12) ribbon(along(11.6, y, y + 3, .5), .13, dashM, 'nb_lane_dash', .008);
  const lime = ctx.relief ? ctx.relief('stone', '#c8b896', { size: 2.4 }) : toon('#c8b896');
  for (let k = 0; k < 3; k++) ribbon(along(16.0 + k * 1.2, -30, 140, .5), 1.2, lime, 'limestone_step_' + k, -.1 - k * .45, 'stone');
  const lakeT = canvasTex(THREE, 512, 1024, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#e08a7a'); g.addColorStop(.25, '#8a5aa0'); g.addColorStop(.6, '#2a3a8a'); g.addColorStop(1, '#1a2460'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) { const y = R0() * h, a = .15 + (1 - y / h) * .5; c.fillStyle = `rgba(${y < h * .4 ? '255,200,170' : '150,170,240'},${a * R0()})`; c.fillRect(R0() * w, y, 8 + R0() * 50, 1.5 + R0() * 2); } });
  const lake = add(new THREE.PlaneGeometry(360, 760), new THREE.MeshBasicMaterial({ map: lakeT, fog: false, toneMapped: false }), 'lake_michigan', 'water', V(198, 150, -1.4), scene, false); lake.rotation.x = -Math.PI / 2;
  // a lit freighter far out and the harbour light
  box(14, 2.2, 1.6, toon('#20243a'), 'far_freighter', 'ship', 120, 230, 0); for (let i = 0; i < 6; i++) add(new THREE.SphereGeometry(.35, 8, 6), glow('#ffd890'), 'freighter_light', 'lamp', V(114 + i * 2.4, 228.8, 1.3), scene, false);

  // ---------- left: park strip, oaks, sodium lamps, the GOLD COAST HIGH-RISE WALL with lit windows ----------
  const grass = ctx.relief ? ctx.relief('grass', '#2f5a3a', { size: 3 }) : toon('#2f5a3a');
  ribbon(along(-14, -30, 140, 1), 13.4, grass, 'park_lawn', .02, 'grass', 13);
  ribbon(along(-9.6, -30, 140, 1), 2.4, conc, 'park_path', .04, 'stone', 3);
  if (ctx.trees && ctx.trees.on) for (let i = 0; i < 9; i++) { const y = -6 + i * 7.5 + rr(-1, 1), x = cx(y) - 12 - rr(0, 4); ctx.trees.tree({ kind: 'oak', at: [x, y, 0], height: rr(8, 11), seed: 30 + i, leaf: '#2e5a36', leaf2: '#4a7a3e' }); }
  for (let y = -14; y < 90; y += 16) { const x = cx(y) - 7.6; bar([x, y, 0], [x, y, 9.5], .09, toon('#3a3a44'), 'lamp_pole', 'metal'); bar([x, y, 9.5], [x + 1.8, y, 9.9], .06, toon('#3a3a44'), 'lamp_arm', 'metal');
    add(new THREE.SphereGeometry(.3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), glow('#ffb860'), 'sodium_cobra_head', 'lamp', V(x + 1.9, y, 9.8), scene, false).rotation.x = Math.PI; }
  const winT = (seedW, base) => canvasTex(THREE, 256, 512, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); const cols = 14, rows = 48;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const on = R0() < .55; c.fillStyle = on ? (R0() < .8 ? '#ffd27a' : '#bfe0ff') : 'rgba(20,24,50,.9)'; c.fillRect(4 + i * (w - 8) / cols, 4 + j * (h - 8) / rows, (w - 8) / cols - 4, (h - 8) / rows - 4); } });
  const towers = [[-70, 60, 22, 18, 64, '#4a4058'], [-62, 104, 24, 18, 82, '#5a4a52'], [-52, 150, 26, 20, 74, '#3e3a56'], [-96, 120, 22, 20, 104, '#3a3448'], [-30, 190, 30, 20, 96, '#4a4462'], [-80, 200, 26, 22, 138, '#2e2c44'], [-120, 80, 24, 22, 70, '#46405a'], [-46, 260, 30, 24, 150, '#30304a']];
  towers.forEach(([x, y, w, d, h, c], i) => { const mats = [0, 1, 2, 3, 4, 5].map(k => k === 2 || k === 3 ? toon(c) : new THREE.MeshLambertMaterial({ map: winT(i, c), emissive: '#ffffff', emissiveMap: winT(i + 99, '#000000'), emissiveIntensity: .9, fog: false }));
    const t = box(w, d, h, mats, 'gold_coast_highrise', 'building', x, y, h / 2, scene, false); for (let k = 0; k < 3; k++) box(w + .6, d + .6, .5, toon('#6a6278'), 'highrise_ledge', 'building', x, y, h * (k + 1) / 4, scene, false);
    add(new THREE.SphereGeometry(.5, 8, 6), glow('#ff3030'), 'aircraft_warning_light', 'lamp', V(x, y, h + .4), scene, false); });

  // ---------- the CURVE sign: yellow diamond with the S arrow + "25 MPH" plaque, on the left shoulder ----------
  const signT = canvasTex(THREE, 256, 256, (c, w, h) => { c.fillStyle = '#f2c230'; c.beginPath(); c.moveTo(w / 2, 6); c.lineTo(w - 6, h / 2); c.lineTo(w / 2, h - 6); c.lineTo(6, h / 2); c.closePath(); c.fill(); c.strokeStyle = '#111'; c.lineWidth = 8; c.beginPath(); c.moveTo(w / 2, 20); c.lineTo(w - 20, h / 2); c.lineTo(w / 2, h - 20); c.lineTo(20, h / 2); c.closePath(); c.stroke();
    c.lineWidth = 18; c.lineCap = 'round'; c.beginPath(); c.moveTo(w * .42, h * .78); c.bezierCurveTo(w * .42, h * .55, w * .62, h * .6, w * .58, h * .42); c.bezierCurveTo(w * .55, h * .3, w * .46, h * .32, w * .46, h * .26); c.stroke(); c.fillStyle = '#111'; c.beginPath(); c.moveTo(w * .46, h * .14); c.lineTo(w * .36, h * .3); c.lineTo(w * .56, h * .3); c.fill(); });
  const plaqT = canvasTex(THREE, 256, 128, (c, w, h) => { c.fillStyle = '#f2c230'; c.fillRect(0, 0, w, h); c.strokeStyle = '#111'; c.lineWidth = 8; c.strokeRect(8, 8, w - 16, h - 16); c.fillStyle = '#111'; c.font = 'bold 64px Arial Black, Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('25 MPH', w / 2, h / 2 + 3); });
  { const x = cx(13) - 7.5, y = 13; bar([x, y, 0], [x, y, 3.2], .05, toon('#9aa0aa'), 'sign_post', 'metal'); const s = add(new THREE.PlaneGeometry(1.3, 1.3), new THREE.MeshBasicMaterial({ map: signT, transparent: true }), 'curve_warning_sign', 'sign', V(x + .03, y - .06, 2.85), scene, false); s.rotation.y = .5;
    const p = add(new THREE.PlaneGeometry(.95, .48), new THREE.MeshBasicMaterial({ map: plaqT }), 'speed_plaque_25mph', 'sign', V(x + .03, y - .06, 1.85), scene, false); p.rotation.y = .5; }

  // ---------- THE LIGHT TOWER (the one hard key): trailer, mast, 4 lamp heads, generator ----------
  const LT = [7.9, 1.6]; const yel = toon('#f2b81e');
  box(1.4, 2.6, .9, yel, 'light_tower_trailer', 'metal', LT[0], LT[1], .75); box(1.42, 2.62, .12, toon('#2a2a30'), 'trailer_skirt', 'metal', LT[0], LT[1], .28);
  for (const dy of [-.8, .8]) add(new THREE.CylinderGeometry(.3, .3, .2, 14), toon('#1a1a20'), 'trailer_wheel', 'rubber', V(LT[0] - .75, LT[1] + dy, .3)).rotation.z = Math.PI / 2;
  bar([LT[0], LT[1], 1.2], [LT[0], LT[1], 6.6], .07, toon('#c9ccd6'), 'light_mast', 'metal'); box(1.8, .1, .1, toon('#c9ccd6'), 'lamp_crossbar', 'metal', LT[0], LT[1], 6.6);
  const lampPos = []; for (const dx of [-.62, -.2, .2, .62]) { const h = box(.36, .22, .34, toon('#2a2a30'), 'lamp_head', 'metal', LT[0] + dx * .9, LT[1] - .12, 6.85, scene, false); h.rotation.z = .5; add(new THREE.PlaneGeometry(.3, .28), glow('#fffaf0'), 'lamp_lens', 'lamp', V(LT[0] + dx * .9 - .1, LT[1] - .26, 6.8), scene, false).rotation.set(-.4, -.9, 0); lampPos.push([LT[0] + dx * .9, LT[1] - .2, 6.8]); }
  const spot = new THREE.SpotLight('#fff1d8', 170, 30, .36, .5, 1.6); spot.position.copy(V(LT[0] - .1, LT[1] - .2, 6.8)); spot.target.position.copy(V(.5, .1, .5)); spot.castShadow = true; spot.shadow.mapSize.set(2048, 2048); spot.shadow.bias = -.0006; scene.add(spot, spot.target);
  // a visible soft beam (see-through cone) and the pool painted on the road
  { const a = V(LT[0] - .1, LT[1] - .2, 6.8), b = V(.4, .1, 0), d = b.clone().sub(a), L = d.length(); const beam = add(new THREE.ConeGeometry(2.9, L, 32, 1, true), new THREE.MeshBasicMaterial({ color: '#fff0d0', transparent: true, opacity: .07, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, fog: false }), 'light_beam', 'fx', a.clone().addScaledVector(d, .5), scene, false);
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), d.clone().normalize()); beam.userData.noExport = true; beam.visible = false; }
  const poolT = canvasTex(THREE, 256, 256, (c, w, h) => { const r = c.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); r.addColorStop(0, 'rgba(255,236,200,.34)'); r.addColorStop(.6, 'rgba(255,226,180,.18)'); r.addColorStop(.85, 'rgba(255,220,170,.08)'); r.addColorStop(1, 'rgba(255,220,170,0)'); c.fillStyle = r; c.fillRect(0, 0, w, h); });
  const pool = add(new THREE.PlaneGeometry(7.5, 5.2), new THREE.MeshBasicMaterial({ map: poolT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), 'light_pool', 'fx', V(.4, .3, .02), scene, false); pool.rotation.x = -Math.PI / 2; pool.userData.noExport = true;
  box(.9, .6, .7, toon('#2f7a3a'), 'generator', 'metal', LT[0] + .1, LT[1] + 1.9, .35);

  // ---------- cone taper along the lane line x -3.3 (closing lanes 2-4) + foreground cone ----------
  const coneM = toon('#ff6a14'), refl = glow('#f4f6fa');
  const cone = (x, y, s = 1, name = 'traffic_cone') => { const g = new THREE.Group(); g.name = name; g.position.copy(V(x, y, 0)); g.scale.setScalar(s); scene.add(g);
    add(new THREE.BoxGeometry(.42, .04, .42), toon('#1a1a20'), 'cone_base', 'rubber', new THREE.Vector3(0, .02, 0), g); add(new THREE.ConeGeometry(.15, .7, 20), coneM, 'cone_body', 'plastic', new THREE.Vector3(0, .39, 0), g);
    for (const [y0, r] of [[.5, .1], [.32, .125]]) add(new THREE.CylinderGeometry(r - .012, r + .006, .07, 20), refl, 'cone_reflective_collar', 'plastic', new THREE.Vector3(0, y0, 0), g, false); return g; };
  for (let y = -6; y < 24; y += 3) cone(cx(y) - 3.3, y);
  cone(1.95, -1.45, 1.15, 'foreground_cone'); cone(-1.5, -1.9, 1.1, 'foreground_cone_2');

  // ---------- foreground: the TRAFFIC WHITE pail with drips, the paint tray ----------
  const pailT = canvasTex(THREE, 512, 256, (c, w, h) => { c.fillStyle = '#f4f3ee'; c.fillRect(0, 0, w, h); c.fillStyle = '#1e3a8a'; c.fillRect(0, 40, w, 50); c.fillStyle = '#ffffff'; c.font = 'bold 40px Arial Black, Arial, sans-serif'; c.textAlign = 'center'; c.fillText('TRAFFIC WHITE', w / 2, 80);
    c.fillStyle = '#1b1b2a'; c.font = 'bold 26px Arial, sans-serif'; c.fillText('ROAD MARKING PAINT  5 GAL', w / 2, 128); c.fillStyle = '#c0241c'; c.fillText('CITY OF CHICAGO  DOT', w / 2, 166);
    c.fillStyle = '#ffffff'; for (let i = 0; i < 9; i++) { const x = 20 + i * 56 + R0() * 20; c.fillRect(x, 0, 10 + R0() * 8, 30 + R0() * 120); c.beginPath(); c.arc(x + 8, 30 + R0() * 120, 9, 0, Math.PI * 2); c.fill(); } });
  const pail = new THREE.Group(); pail.name = 'traffic_white_pail'; scene.add(pail);
  add(new THREE.CylinderGeometry(.16, .145, .38, 28), new THREE.MeshStandardMaterial({ map: pailT, roughness: .5 }), 'pail_body', 'plastic', V(-.25, -1.75, .19), pail).rotation.y = 2.2;
  add(new THREE.TorusGeometry(.162, .012, 6, 28), toon('#e8e6de'), 'pail_rim', 'plastic', V(-.25, -1.75, .38), pail).rotation.x = Math.PI / 2;
  add(new THREE.CircleGeometry(.15, 28), new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .1, clearcoat: 1 }), 'pail_paint_surface', 'paint', V(-.25, -1.75, .36), pail, false).rotation.x = -Math.PI / 2;
  { const pts = []; for (let i = 0; i <= 16; i++) { const a = Math.PI * i / 16; pts.push(V(-.25 + Math.cos(a) * .16, -1.75 + Math.sin(a) * .02, .38 + Math.sin(a) * .2)); } add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, .006, 6), toon('#9aa0aa'), 'pail_wire_handle', 'metal', null, pail); }
  add(new THREE.CircleGeometry(.24, 20), new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .12, clearcoat: 1 }), 'pail_spill_puddle', 'paint', V(-.12, -1.58, .017), pail, false).rotation.x = -Math.PI / 2;
  const tray = box(.36, .5, .05, toon('#1a1a22'), 'paint_tray', 'plastic', -.45, -.95, .03, pail); tray.rotation.y = .4; const tp = box(.32, .3, .01, new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .1, clearcoat: 1 }), 'tray_paint', 'paint', -.45, -.9, .06, pail, false); tp.rotation.y = .4;

  // ---------- THE SEMI: long-nose conventional facing the lens, turned 30 deg, in lane 1, stopped at the cones ----------
  const T = new THREE.Group(); T.name = 'semi_truck'; T.position.copy(V(TRUCK.x, TRUCK.y, 0)); T.rotation.y = TRUCK.yaw; scene.add(T);
  const tv = (x, y, z) => B2T([x, y, z]), tb = (sx, sy, sz, mat, name, x, y, z, sh = true) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, 'truck', tv(x, y, z), T, sh);
  const paintT = ctx.pbr ? ctx.pbr.metal('wet', { color: '#1f5fb8', rough: .25, coat: 1, toon: '#1f5fb8' }) : toon('#1f5fb8'), chrome = ctx.pbr ? ctx.pbr.metal('steel', { color: '#e8eef6', rough: .12, env: 1.4, finish: 'smooth', toon: '#e8eef6' }) : toon('#e8eef6');
  const tyre = toon('#18161c'), glass = new THREE.MeshPhysicalMaterial({ color: '#2a3a6a', roughness: .05, metalness: .2, clearcoat: 1 });
  tb(2.2, 2.0, .55, paintT, 'hood', 0, -3.6, 1.45); tb(2.3, 2.1, .7, paintT, 'hood_sides', 0, -3.55, 1.0);
  const grT = canvasTex(THREE, 256, 256, (c, w, h) => { c.fillStyle = '#c8d0dc'; c.fillRect(0, 0, w, h); c.fillStyle = '#20242c'; for (let i = 0; i < 14; i++) c.fillRect(10 + i * 17.5, 12, 9, h - 24); c.strokeStyle = '#ffffff'; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10); });
  add(new THREE.PlaneGeometry(1.25, 1.15), new THREE.MeshStandardMaterial({ map: grT, metalness: .8, roughness: .2 }), 'chrome_grille', 'truck', tv(0, -4.62, 1.2), T, false).rotation.y = Math.PI;
  tb(2.5, .25, .32, chrome, 'chrome_bumper', 0, -4.75, .6);
  for (const s of [-1, 1]) { const hl = add(new THREE.PlaneGeometry(.36, .2), glow('#fffbe8'), 'headlight', 'lamp', tv(s * .85, -4.67, 1.12), T, false); hl.rotation.y = Math.PI; add(new THREE.PlaneGeometry(.14, .1), glow('#ffa020'), 'turn_lamp', 'lamp', tv(s * .85, -4.67, .88), T, false).rotation.y = Math.PI;
    const fe = add(new THREE.CylinderGeometry(.62, .62, .5, 20, 1, true, 0, Math.PI), paintT, 'front_fender', 'truck', tv(s * 1.05, -3.55, .55), T); fe.rotation.z = Math.PI / 2; fe.rotation.y = Math.PI / 2;
    for (const y of [-3.55, .9, 2.25]) { const w = add(new THREE.CylinderGeometry(.52, .52, .32, 22), tyre, 'tyre', 'rubber', tv(s * 1.08, y, .52), T); w.rotation.z = Math.PI / 2; add(new THREE.CylinderGeometry(.26, .26, .33, 16), chrome, 'hub', 'metal', tv(s * 1.08, y, .52), T).rotation.z = Math.PI / 2; }
    bar([0, 0, 0], [0, 0, 0], .01, chrome, 'x', 'metal', T).visible = false;
    const st = add(new THREE.CylinderGeometry(.09, .09, 2.6, 14), chrome, 'exhaust_stack', 'metal', tv(s * 1.32, -.55, 3.0), T); add(new THREE.CylinderGeometry(.11, .09, .3, 14), toon('#2a2a30'), 'stack_tip', 'metal', tv(s * 1.32, -.55, 4.38), T);
    const tank = add(new THREE.CylinderGeometry(.33, .33, 1.4, 20), chrome, 'fuel_tank', 'metal', tv(s * 1.12, -1.4, .72), T); tank.rotation.x = Math.PI / 2;
    tb(.06, .32, .5, toon('#22242a'), 'mirror_glass_back', s * 1.62, -2.75, 2.45); bar([s * 1.25, -2.75, 2.2], [s * 1.6, -2.75, 2.2], .02, chrome, 'mirror_arm', 'metal', T); }
  tb(2.0, 2.0, 2.05, paintT, 'cab', -.25, -1.6, 2.15); tb(.05, 2.0, .93, paintT, 'door_lower', 1.225, -1.6, 1.465); tb(.5, 2.0, .1, paintT, 'cab_roof_right', 1.0, -1.6, 3.13); tb(2.55, 2.2, 2.4, paintT, 'sleeper', 0, .55, 2.25); tb(2.6, 2.3, .12, toon('#2a2a30'), 'roof_fairing', 0, -.3, 3.48);
  add(new THREE.PlaneGeometry(2.2, .95), glass, 'windshield', 'glass', tv(0, -2.62, 2.65), T, false).rotation.set(-.12, Math.PI, 0);
  tb(2.6, .3, .12, paintT, 'sun_visor', 0, -2.75, 3.2);
  for (let i = 0; i < 5; i++) add(new THREE.SphereGeometry(.05, 8, 6), glow('#ffb020'), 'cab_marker_light', 'lamp', tv(-.6 + i * .3, -2.7, 3.3), T, false);
  bar([-.4, -1.4, 3.3], [-.4, -1.0, 3.55], .05, chrome, 'air_horn', 'metal', T); bar([.4, -1.4, 3.3], [.4, -1.0, 3.6], .05, chrome, 'air_horn', 'metal', T);
  // driver door (+x side): panel up to the sill, the window OPEN (rolled down), door name, step plates; the trucker stands inside on the cab floor (z 1.0)
  const doorT = canvasTex(THREE, 512, 256, (c, w, h) => { c.fillStyle = '#1f5fb8'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.font = 'bold 54px Arial Black, Arial, sans-serif'; c.textAlign = 'center'; c.fillText('LAKESIDE', w / 2, 92); c.font = 'bold 40px Arial Black, Arial, sans-serif'; c.fillText('HAULING', w / 2, 146);
    c.fillStyle = '#f2c230'; c.fillRect(40, 168, w - 80, 8); c.fillStyle = '#e8eef6'; c.font = 'bold 22px Arial, sans-serif'; c.fillText('USDOT 1180472   GARY IN', w / 2, 214); });
  const sideCab = new THREE.Group(); T.add(sideCab);
  add(new THREE.PlaneGeometry(1.95, .95), new THREE.MeshStandardMaterial({ map: doorT, roughness: .3 }), 'driver_door_name', 'truck', tv(1.262, -1.6, 1.42), sideCab, false).rotation.y = Math.PI / 2;
  // the door opening: cut by re-drawing the cab side as a frame (front pillar, rear pillar, roof rail) in front of a dark interior
  tb(.04, 1.9, 1.2, toon('#141420'), 'cab_interior_dark', .74, -1.6, 2.5, false); tb(.4, .3, .5, toon('#2a2a30'), 'seat_back', .5, -.9, 2.1, false);
  for (const y of [-2.55, -.65]) tb(.06, .14, 1.25, paintT, 'door_pillar', 1.27, y, 2.55);
  tb(.06, 2.0, .2, paintT, 'roof_rail', 1.27, -1.6, 3.2); tb(.07, 2.0, .06, chrome, 'window_sill_trim', 1.29, -1.6, 1.93);
  for (const z of [.55, .9]) tb(.4, .5, .04, chrome, 'step_plate', 1.35, -1.6, z);
  // the box trailer behind (white with a red stripe), its marker lights
  tb(2.2, 1.4, .25, toon('#2a2a30'), 'fifth_wheel_deck', 0, 2.2, 1.2); add(new THREE.CylinderGeometry(.5, .5, .1, 20), toon('#1a1a20'), 'fifth_wheel_plate', 'metal', tv(0, 2.2, 1.38), T); tb(2.4, .1, .7, toon('#18161c'), 'mud_flaps', 0, 2.9, .65);
  // the cab interior is dark; the headlight glow pools on the road toward the lens
  const hp = new THREE.PointLight('#fff4d8', 18, 9, 1.6); hp.position.copy(V(TRUCK.x - 1.6, TRUCK.y - 4.5, .9)); scene.add(hp);
  const hpT = canvasTex(THREE, 128, 256, (c, w, h) => { const g = c.createRadialGradient(w / 2, 10, 2, w / 2, 40, h * .9); g.addColorStop(0, 'rgba(255,244,210,.6)'); g.addColorStop(1, 'rgba(255,244,210,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  for (const s of [-1, 1]) { const g = add(new THREE.PlaneGeometry(1.4, 6), new THREE.MeshBasicMaterial({ map: hpT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), 'headlight_spill', 'fx', tv(s * .85, -7.7, .03), T, false); g.rotation.x = -Math.PI / 2; g.userData.noExport = true; }

  return { update: () => {}, anchors: { roller_tip: [-.55, .12, .03] } };
}

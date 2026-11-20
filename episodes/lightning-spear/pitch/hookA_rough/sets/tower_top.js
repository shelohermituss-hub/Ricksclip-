// SET for pitch 1 hook frame (rough, 2026-11-15): THE TOP OF THE CHURCH BELL TOWER above a north Italian hill town, dusk before a storm, about 1765.
// Plan metres, Z up, Y forward (north). The roof peak (apex) is at plan [0, 0, 0.5], so the kit's sun shadow box (28 m round the origin) covers the hero.
// The town lies 31 m below. Parts: tiled pyramid roof with barrel-tile rows and hip tiles, stone finial, THE SPEAR (lightning rod: forged leaf tip, collar,
// two strap brackets with bolts, a big nail under the hammer) and its iron wire with staples down the roof, stone cornice, belfry with arches and a bronze
// bell, plaster shaft; the town (yellow houses, terracotta gable roofs, green shutters, piazza with fountain and tiny townsfolk), fields, hills, the
// rival's white marble tower with a gold angel and cypresses, and a sky dome with a purple storm cloud wall and one far pale flash.
// Sky dome pattern from episodes/goldrush/sets/street.js (dawn dome). Every pow / sqrt / division in the shader is guarded (GPU: no not-a-number).
export const APEX = [0, 0, 0.5], HW = 1.9, RISE = 0.9, SL = RISE / HW, TOWN_Z = -31;
export const roofZ = (x, y) => APEX[2] - SL * Math.max(Math.abs(x), Math.abs(y)) + 0.075;   // top of the tile rows at plan x, y
export const SPEAR = { x: 0, y: 0, base: 0.45, shaftTop: 2.14, tip: 2.62 };
export const RIVAL = { x: 59, y: 300, base: -10, top: 44 };
export const CAM0 = { pos: [-0.15, -3.86, 1.4], aim: [-0.15, 0, 0.85], lens: 35 };

export async function build(THREE, scene, film, ctx) {
  const { B2T, toon } = ctx, pl = ctx.place || {}, col = c => new THREE.Color(c), V = (x, y, z) => B2T([x, y, z]);
  let seed = 7; const R0 = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * R0(), pick = a => a[Math.floor(R0() * a.length)];
  const add = (geo, mat, name, role, p, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };
  const M = { tile: toon('#e0602a'), tileDark: toon('#a8401a'), hip: toon('#f08a48'), stone: toon('#e6e6f2'), stoneSh: toon('#c4c0dc'), plaster: toon('#eab552'), iron: toon('#4f5880'), ironDk: toon('#2c3050'),
    bronze: toon('#c98a2e'), dark: toon('#3a2444'), marble: new THREE.MeshBasicMaterial({ color: '#fff9f2', fog: false }), marbleSh: new THREE.MeshBasicMaterial({ color: '#cdbff0', fog: false }), gold: new THREE.MeshBasicMaterial({ color: '#ffc62e' }), glint: new THREE.MeshBasicMaterial({ color: '#ffd9a0' }),
    blade: new THREE.MeshBasicMaterial({ color: '#2b3052' }), cyp: toon('#1f5a3a'), pave: toon('#f1d9a6'), wood: toon('#a8703a') };

  // ---------- the kit's own sky and fog: replaced ----------
  scene.children.forEach(o => { if (o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.radius === 400) o.visible = false; });
  scene.fog = new THREE.Fog('#b98fc8', 120, 640);

  // ---------- sky dome: peach gap at the horizon, the purple cloud wall, one far pale flash ----------
  const flash = V(.150, .962, .215).normalize(), sunD = V(-.62, -.72, .12).normalize();
  const skyMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { flashD: { value: flash }, sunD: { value: sunD } },
    vertexShader: 'varying vec3 vD; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vD = w.xyz - cameraPosition; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform vec3 flashD, sunD; varying vec3 vD;
      float fbm(vec2 q){ float cl = 0., a = .5; for (int i = 0; i < 5; i++) { cl += a * (.5 + .5 * sin(q.x * 1.7 + sin(q.y * 2.3) * 1.6) * sin(q.y * 1.3 + q.x * .45 + 1.3)); q = q * 2.03 + vec2(1.7, 4.1); a *= .5; } return cl; }
      void main(){ float L = max(length(vD), 1e-3); vec3 d = vD / L; float h = d.y; float az = atan(d.x, max(-d.z, 1e-3));
        vec2 p = vec2(az * 3.4, max(h, 0.) * 7.5);
        float cl = fbm(p + vec2(0., .6 * fbm(p * .6)));                               // billows
        float edge = .045 + .035 * sin(az * 9.) + .03 * sin(az * 23. + 1.);            // the ragged foot of the wall above the horizon gap
        float wall = smoothstep(edge, edge + .05, h);
        vec3 gap = mix(vec3(1., .66, .36), vec3(.98, .50, .56), smoothstep(0., .09, h));
        vec3 dk = vec3(.19, .09, .42), md = vec3(.36, .19, .66), hi = vec3(.56, .36, .86), warm = vec3(.95, .45, .55);
        vec3 c = mix(dk, md, smoothstep(.44, .58, cl)); c = mix(c, hi, smoothstep(.6, .7, cl));
        float lit = clamp(.5 - d.x * 1.4, 0., 1.);                                    // the low sun is behind us to the left: left flanks of the billows go warm
        c = mix(c, warm, smoothstep(.58, .72, cl) * lit * (1. - smoothstep(.1, .45, h)) * .75);
        c *= 1. - .35 * smoothstep(.25, .8, h);                                       // heavier toward the top
        float s = clamp(dot(d, flashD), 0., 1.);
        float g1 = pow(max(s, 1e-4), 260.), g2 = pow(max(s, 1e-4), 70.);
        c += vec3(.93, .90, 1.) * (1.0 * g1 + .55 * g2 * (.45 + .55 * smoothstep(.45, .65, cl)));   // the far flash, inside the cloud
        c = mix(gap, c, wall); 
        if (h < 0.) c = mix(vec3(.72, .56, .78), gap, smoothstep(-.05, 0., h));
        c = pow(max(c, vec3(0.)), vec3(2.2));   /* the kit draws into a linear buffer: sRGB picks -> linear */
        gl_FragColor = vec4(c, 1.); }` });
  const skyDome = new THREE.Mesh(new THREE.SphereGeometry(560, 48, 24), skyMat); skyDome.name = 'sky_storm_dome'; skyDome.userData.noExport = true; skyDome.renderOrder = -10; skyDome.frustumCulled = false; scene.add(skyDome);

  // ---------- THE TOWER TOP ----------
  const tower = new THREE.Group(); tower.name = 'tower_top'; scene.add(tower);
  const pyr = add(new THREE.ConeGeometry(HW * Math.SQRT2 * 1.03, RISE * 1.03, 4, 1), M.tileDark, 'roof_pyramid_pans', 'roof', V(0, 0, APEX[2] - RISE * 1.03 / 2), tower); pyr.rotation.y = Math.PI / 4;
  // barrel tile rows: tapered half-buried tubes running down each of the four faces, cut by the hips
  { const seg = new THREE.CylinderGeometry(.052, .072, 1, 8), tcols = ['#e2622a', '#d4541f', '#ee7a3a', '#c94a1c', '#e96a2e'].map(col), inst = new THREE.InstancedMesh(seg, toon('#ffffff'), 700); inst.name = 'roof_barrel_tiles'; inst.userData.role = 'roof'; inst.castShadow = inst.receiveShadow = true;
    const dir = new THREE.Vector3(0, -SL, 1).normalize(), q0 = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().negate()), m4 = new THREE.Matrix4(), SLEN = Math.sqrt(1 + SL * SL); let n = 0;
    for (let k = 0; k < 4; k++) { const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), k * Math.PI / 2), q = qy.clone().multiply(q0);
      for (let i = -12; i <= 12; i++) { const s = i * .155, d0 = Math.abs(s) + .05, d1 = HW + .1; let d = d0; while (d < d1 - .05 && n < 700) { const len = Math.min(.44, d1 - d), dm = d + len / 2;
          const p = new THREE.Vector3(s, APEX[2] - SL * dm + .02, dm).applyQuaternion(qy); m4.compose(p, q, new THREE.Vector3(1, len * SLEN * 1.12, 1)); inst.setMatrixAt(n, m4); inst.setColorAt(n, pick(tcols)); n++; d += len; } } }
    inst.count = n; inst.instanceMatrix.needsUpdate = true; if (inst.instanceColor) inst.instanceColor.needsUpdate = true; tower.add(inst); }
  const bar = (a, b, r, mat, name, role = 'metal', r2 = r, parent = tower, segs = 10) => { const A = V(...a), Bv = V(...b), d = Bv.clone().sub(A), L = Math.max(d.length(), 1e-4), m = add(new THREE.CylinderGeometry(r2, r, L, segs), mat, name, role, A.clone().addScaledVector(d, .5), parent); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); return m; };
  for (const [sx, sy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) bar([sx * (HW + .1), sy * (HW + .1), APEX[2] - RISE - .02], [sx * .12, sy * .12, APEX[2] - .02], .1, M.hip, 'roof_hip_tiles', 'roof', .085);
  // stone cornice (two steps with a row of little brackets), belfry with an arch on every face and the bronze bell, plaster shaft
  add(new THREE.BoxGeometry(3.7, .16, 3.7), M.stone, 'cornice_top', 'stone', V(0, 0, APEX[2] - RISE - .1), tower); add(new THREE.BoxGeometry(3.4, .2, 3.4), M.stoneSh, 'cornice_low', 'stone', V(0, 0, APEX[2] - RISE - .28), tower);
  for (let i = -5; i <= 5; i++) for (const s of [-1, 1]) { add(new THREE.BoxGeometry(.14, .2, .16), M.stone, 'cornice_bracket', 'stone', V(i * .3, s * 1.66, APEX[2] - RISE - .46), tower); add(new THREE.BoxGeometry(.16, .2, .14), M.stone, 'cornice_bracket', 'stone', V(s * 1.66, i * .3, APEX[2] - RISE - .46), tower); }
  const BZ = APEX[2] - RISE - .38;   // belfry top
  for (const [sx, sy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) add(new THREE.BoxGeometry(.75, 3.1, .75), M.plaster, 'belfry_pier', 'plaster', V(sx * 1.2, sy * 1.2, BZ - 1.55), tower);
  for (let k = 0; k < 4; k++) { const g = new THREE.Group(); g.rotation.y = k * Math.PI / 2; tower.add(g); add(new THREE.BoxGeometry(1.65, .7, .7), M.plaster, 'belfry_lintel', 'plaster', new THREE.Vector3(0, BZ - .35, 1.2), g);
    const arch = add(new THREE.TorusGeometry(.82, .11, 8, 20, Math.PI), M.stone, 'belfry_arch', 'stone', new THREE.Vector3(0, BZ - .95, 1.56), g); arch.scale.set(1, .8, 1); add(new THREE.BoxGeometry(1.75, .16, .9), M.stone, 'belfry_sill', 'stone', new THREE.Vector3(0, BZ - 3.02, 1.25), g); }
  add(new THREE.BoxGeometry(3.1, .2, 3.1), M.stoneSh, 'belfry_floor', 'stone', V(0, 0, BZ - 3.2), tower); add(new THREE.BoxGeometry(3.15, 30, 3.15), M.plaster, 'tower_shaft', 'plaster', V(0, 0, BZ - 3.3 - 15), tower);
  { const pts = [[.02, 0], [.16, .02], [.3, .1], [.4, .3], [.46, .55], [.6, .78], [.7, .82]].map(([r, y]) => new THREE.Vector2(r, -y)); const bell = add(new THREE.LatheGeometry(pts, 20), M.bronze, 'belfry_bell', 'metal', V(0, 0, BZ - .9), tower); bell.material.side = THREE.DoubleSide;
    add(new THREE.BoxGeometry(2.3, .18, .18), M.wood, 'bell_yoke', 'wood', V(0, 0, BZ - .8), tower); add(new THREE.SphereGeometry(.1, 10, 8), M.ironDk, 'bell_clapper', 'metal', V(0, 0, BZ - 1.75), tower); }

  // ---------- THE SPEAR (the lightning rod) on the peak: the hero object ----------
  const sp = new THREE.Group(); sp.name = 'spear_lightning_rod'; scene.add(sp); const S = SPEAR, sx = S.x, sy = S.y;
  add(new THREE.CylinderGeometry(.21, .27, .3, 8), M.stone, 'finial_block', 'stone', V(sx, sy, APEX[2] + .08), sp); add(new THREE.CylinderGeometry(.15, .2, .1, 8), M.stoneSh, 'finial_neck', 'stone', V(sx, sy, APEX[2] + .28), sp); add(new THREE.TorusGeometry(.215, .035, 8, 16), M.stone, 'finial_moulding', 'stone', V(sx, sy, APEX[2] + .22), sp).rotation.x = Math.PI / 2; add(new THREE.TorusGeometry(.265, .03, 8, 16), M.stoneSh, 'finial_moulding_low', 'stone', V(sx, sy, APEX[2] - .04), sp).rotation.x = Math.PI / 2; add(new THREE.TorusGeometry(.13, .03, 8, 14), M.ironDk, 'finial_iron_band', 'metal', V(sx, sy, APEX[2] + .34), sp).rotation.x = Math.PI / 2;
  bar([sx, sy, S.base], [sx, sy, S.shaftTop], .026, M.iron, 'spear_shaft', 'metal', .022, sp);
  bar([sx - .012, sy - .022, S.base + .2], [sx - .012, sy - .022, S.shaftTop], .007, M.glint, 'spear_shaft_glint', 'metal', .006, sp, 6);      // the low sun along the lit edge
  for (const z of [S.base + .36, S.base + .78]) { add(new THREE.TorusGeometry(.045, .017, 8, 16), M.ironDk, 'spear_strap_collar', 'metal', V(sx, sy, z), sp).rotation.x = Math.PI / 2;   // two strap collars round the shaft
    add(new THREE.SphereGeometry(.02, 8, 6), M.glint, 'spear_collar_bolt', 'metal', V(sx - .03, sy - .055, z), sp); add(new THREE.SphereGeometry(.02, 8, 6), M.glint, 'spear_collar_bolt', 'metal', V(sx + .04, sy - .05, z), sp); }
  // the bracket: a forged iron stay from the upper collar down to the roof on each side, flattened feet with bolts; the big nail the hammer is driving
  for (const s of [-1, 1]) { bar([sx + s * .045, sy - .01, S.base + .78], [sx + s * .5, sy - .02, roofZ(s * .5, 0) + .02], .02, M.ironDk, 'spear_bracket_stay', 'metal', .02, sp, 6);
    const foot = add(new THREE.BoxGeometry(.22, .03, .1), M.iron, 'spear_bracket_foot', 'metal', V(sx + s * .56, sy - .02, roofZ(s * .56, 0) + .02), sp); foot.rotation.z = -s * Math.atan(SL);
    for (const o of [-.06, .06]) add(new THREE.SphereGeometry(.022, 8, 6), M.glint, 'spear_bracket_bolt', 'metal', V(sx + s * (.56 + o), sy - .03, roofZ(s * (.56 + o), 0) + .045), sp); }
  bar([sx - .34, sy - .03, roofZ(-.34, 0) + .02], [sx - .3, sy - .03, roofZ(-.34, 0) + .17], .016, M.iron, 'spear_bracket_nail', 'metal', .016, sp, 6); add(new THREE.CylinderGeometry(.04, .04, .02, 8), M.glint, 'spear_nail_head', 'metal', V(sx - .298, sy - .03, roofZ(-.34, 0) + .178), sp);
  // the forged leaf tip: a socket collar, a flat leaf blade with a mid rib, a needle point
  add(new THREE.CylinderGeometry(.03, .042, .16, 10), M.ironDk, 'spear_tip_socket', 'metal', V(sx, sy, S.shaftTop + .06), sp); add(new THREE.TorusGeometry(.04, .014, 8, 14), M.glint, 'spear_tip_ring', 'metal', V(sx, sy, S.shaftTop - .01), sp).rotation.x = Math.PI / 2;
  { const blade = add(new THREE.ConeGeometry(.105, S.tip - S.shaftTop - .12, 4, 1), M.blade, 'spear_tip_blade', 'metal', V(sx, sy, (S.tip + S.shaftTop + .12) / 2), sp); blade.scale.set(1, 1, .3); blade.rotation.y = Math.PI / 4 * 0;
    const low = add(new THREE.ConeGeometry(.105, .13, 4, 1), M.blade, 'spear_tip_blade_low', 'metal', V(sx, sy, S.shaftTop + .12 - .065 + .001), sp); low.scale.set(1, -1, .3);
    bar([sx - .003, sy - .034, S.shaftTop + .08], [sx - .003, sy - .012, S.tip - .03], .011, M.glint, 'spear_tip_rib_glint', 'metal', .002, sp, 6); }
  // the iron wire, thick as a thumb, from the shaft foot over the tiles and down the tower, held by staples
  { const pts = [[sx + .03, sy - .05, S.base + .1], [sx + .1, sy - .3, roofZ(.1, -.3) + .03], [sx + .3, sy - 1.0, roofZ(.3, -1) + .03], [sx + .46, sy - 1.9, roofZ(.46, -1.9) + .03], [sx + .5, sy - 2.06, APEX[2] - RISE - .1], [sx + .5, sy - 1.9, APEX[2] - RISE - .7], [sx + .5, sy - 1.62, BZ - 6]].map(p => V(...p));
    add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', .15), 60, .017, 7), M.ironDk, 'spear_wire', 'metal', null, sp);
    for (const [x, y] of [[.16, -.5], [.3, -1.0], [.4, -1.5]]) add(new THREE.TorusGeometry(.03, .008, 6, 10, Math.PI), M.glint, 'spear_wire_staple', 'metal', V(sx + x, sy + y, roofZ(x, y) + .03), sp); }
  // the round ink fist ON the shaft (the cast's fist, as the kit draws it): place given by film.json places.<name>.fist after the hands are measured
  const fist = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), new THREE.MeshBasicMaterial({ color: '#2a1a1f' })); fist.name = 'spear_fist'; fist.userData.noExport = true; fist.visible = false; scene.add(fist);
  const fistIn = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), new THREE.MeshBasicMaterial({ color: '#fbf6ee' })); fistIn.name = 'spear_fist_fill'; fistIn.userData.noExport = true; fistIn.visible = false; scene.add(fistIn);
  if (pl.fist) { const r = pl.fist_r || .036; fist.visible = fistIn.visible = true; fist.position.copy(V(pl.fist[0], pl.fist[1] - .012, pl.fist[2])); fist.scale.setScalar(r); fistIn.position.copy(V(pl.fist[0], pl.fist[1] - .024, pl.fist[2])); fistIn.scale.setScalar(r * .8); }

  // ---------- THE TOWN 31 m below: yellow houses, terracotta gable roofs, green shutters, the piazza ----------
  const town = new THREE.Group(); town.name = 'town'; scene.add(town);
  add(new THREE.CircleGeometry(640, 48), toon('#6fae3e'), 'valley_ground', 'ground', V(0, 0, TOWN_Z - .05), town).rotation.x = -Math.PI / 2;
  const prism = (() => { const g = new THREE.BufferGeometry(), v = [-.5, 0, .5, .5, 0, .5, 0, 1, .5, -.5, 0, -.5, .5, 0, -.5, 0, 1, -.5], idx = [0, 1, 2, 4, 3, 5, 0, 2, 5, 0, 5, 3, 1, 4, 5, 1, 5, 2, 0, 3, 4, 0, 4, 1]; g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.setIndex(idx); const ng = g.toNonIndexed(); ng.computeVertexNormals(); return ng; })();
  const NH = 420, walls = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), toon('#ffffff'), NH), roofs = new THREE.InstancedMesh(prism, toon('#ffffff', { side: THREE.DoubleSide }), NH), shut = new THREE.InstancedMesh(new THREE.BoxGeometry(.95, 1.45, .12), toon('#ffffff'), NH * 4);
  walls.name = 'town_walls'; walls.userData.role = 'plaster'; roofs.name = 'town_roofs'; roofs.userData.role = 'roof'; shut.name = 'town_shutters'; shut.userData.role = 'wood';
  const wcols = ['#f4c542', '#f7d264', '#efb23a', '#f2a65a', '#f9dc8a', '#eebb4e'].map(col), rcols = ['#e0602a', '#d2521f', '#ea7436', '#c9491c', '#e56a30'].map(col), scols = ['#2f8a4e', '#2a7a66', '#7a3a26', '#3a8f5a'].map(col);
  const PZ = { x0: 22, x1: 60, y0: 186, y1: 222 }, m4 = new THREE.Matrix4(), qq = new THREE.Quaternion(), yAx = new THREE.Vector3(0, 1, 0); let nh = 0, ns = 0;
  for (let y = 52; y < 290 && nh < NH; y += 11.5) { const span = .34 * y + 34; for (let x = -span; x < span && nh < NH; x += rr(9.2, 11.5)) {
      const hx = x + rr(-.8, .8), hy = y + rr(-1.2, 1.2); if (hx > PZ.x0 - 5 && hx < PZ.x1 + 5 && hy > PZ.y0 - 5 && hy < PZ.y1 + 5) continue; if (Math.hypot(hx - RIVAL.x, hy - RIVAL.y) < 60) continue;
      const w = rr(7, 9.6), d = rr(7.5, 10), h = rr(6, 11.5), turn = R0() < .5 ? 0 : Math.PI / 2, gz = TOWN_Z; qq.setFromAxisAngle(yAx, turn);
      m4.compose(V(hx, hy, gz + h / 2), qq, new THREE.Vector3(w, h, d)); walls.setMatrixAt(nh, m4); walls.setColorAt(nh, pick(wcols));
      m4.compose(V(hx, hy, gz + h), qq, new THREE.Vector3(w + .9, rr(1.8, 2.8), d + .9)); roofs.setMatrixAt(nh, m4); roofs.setColorAt(nh, pick(rcols));
      const sw = turn ? d : w, sd = turn ? w : d, sc = pick(scols); for (const fx of [-.26, .26]) for (const fz of [.42, .78]) { if (fz * h + 1 > h - .6 && fz > .5) continue; m4.compose(V(hx + fx * sw, hy - sd / 2 - .03, gz + fz * h), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1)); shut.setMatrixAt(ns, m4); shut.setColorAt(ns, sc); ns++; }
      nh++; } }
  walls.count = roofs.count = nh; shut.count = ns; for (const im of [walls, roofs, shut]) { im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.frustumCulled = false; town.add(im); }
  // the piazza: pale paving, a fountain, the tiny townsfolk looking up, two striped market awnings
  add(new THREE.BoxGeometry(PZ.x1 - PZ.x0, .12, PZ.y1 - PZ.y0), M.pave, 'piazza_paving', 'ground', V((PZ.x0 + PZ.x1) / 2, (PZ.y0 + PZ.y1) / 2, TOWN_Z + .06), town);
  add(new THREE.CylinderGeometry(3.2, 3.4, .9, 16), M.stone, 'fountain_basin', 'stone', V(46, 206, TOWN_Z + .5), town); add(new THREE.CylinderGeometry(2.8, 2.8, .1, 16), toon('#3aa0d8'), 'fountain_water', 'water', V(46, 206, TOWN_Z + .96), town); add(new THREE.CylinderGeometry(.5, .7, 3.2, 10), M.stoneSh, 'fountain_post', 'stone', V(46, 206, TOWN_Z + 2), town);
  { const bcols = ['#c8372f', '#2f6fb8', '#7a4a9a', '#2f8a4e', '#e2a93b', '#3a3050']; for (let i = 0; i < 11; i++) { const px = 27 + rr(0, 14), py = 190 + rr(0, 12), g = new THREE.Group(); g.name = 'townsfolk_tiny'; g.position.copy(V(px, py, TOWN_Z + .12)); town.add(g);
      add(new THREE.ConeGeometry(.48, 1.25, 8), toon(i === 0 ? '#2a2630' : bcols[i % 6]), 'townsfolk_body', 'cloth', new THREE.Vector3(0, .62, 0), g); add(new THREE.SphereGeometry(i === 0 ? .42 : .34, 10, 8), toon('#fbf6ee'), 'townsfolk_head', 'cloth', new THREE.Vector3(0, 1.5, 0), g);
      g.scale.multiplyScalar(1.5); if (i === 0) g.scale.set(2.6, 1.8, 2.6); } }                                                        // the fat priest in black, in front of the others
  for (const [ax, ay] of [[52, 192], [26, 216]]) for (let i = 0; i < 6; i++) add(new THREE.BoxGeometry(.9, .12, 4), toon(i % 2 ? '#fbf6ee' : '#d8372f'), 'market_awning_stripe', 'cloth', V(ax + i * .9, ay, TOWN_Z + 2.8), town).rotation.x = .25;
  // fields beyond the houses, hills, a far ridge
  for (const [x, y, w, d, c] of [[-150, 330, 130, 70, '#8fc046'], [-40, 345, 90, 60, '#d9c24a'], [150, 340, 110, 60, '#5d9f3e'], [-230, 250, 90, 120, '#a8c84a'], [240, 250, 100, 130, '#7fb43c']]) add(new THREE.BoxGeometry(w, .1, d), toon(c), 'field', 'ground', V(x, y, TOWN_Z + .02), town);
  const hill = (x, y, top, rx, ry, c, name) => { const hgt = top - TOWN_Z, m = add(new THREE.SphereGeometry(1, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), toon(c), name, 'foliage', V(x, y, TOWN_Z - .2), town); m.scale.set(rx, hgt, ry); m.castShadow = false; return m; };
  hill(RIVAL.x + 4, RIVAL.y + 14, RIVAL.base + .5, 105, 70, '#4c9a44', 'hill_rival'); hill(-150, 400, -9, 190, 90, '#3f8a52', 'hill_west'); hill(-40, 470, -3, 240, 80, '#4a6fa8', 'hill_far_mid'); hill(250, 440, -6, 200, 90, '#4a7f6a', 'hill_east'); hill(-330, 330, -4, 150, 110, '#3f7f5a', 'hill_far_west');
  // ---------- THE RIVAL'S TOWER: taller, white marble, a gold angel on top, cypresses at its foot ----------
  const rt = new THREE.Group(); rt.name = 'rival_tower'; rt.position.copy(V(RIVAL.x, RIVAL.y, RIVAL.base)); scene.add(rt); const H = RIVAL.top - RIVAL.base;
  add(new THREE.BoxGeometry(11, H * .68, 11), M.marble, 'rival_shaft', 'stone', new THREE.Vector3(0, H * .34, 0), rt);
  for (const f of [.2, .4, .58]) add(new THREE.BoxGeometry(10.8, .9, 10.8), M.marbleSh, 'rival_band', 'stone', new THREE.Vector3(0, H * f, 0), rt);
  add(new THREE.BoxGeometry(11.6, 1.4, 11.6), M.marble, 'rival_cornice', 'stone', new THREE.Vector3(0, H * .685, 0), rt); add(new THREE.BoxGeometry(9, H * .14, 9), M.marble, 'rival_belfry', 'stone', new THREE.Vector3(0, H * .765, 0), rt);
  for (const s of [-2.2, 2.2]) add(new THREE.BoxGeometry(2.2, H * .095, .5), M.dark, 'rival_belfry_arch', 'stone', new THREE.Vector3(s, H * .76, 4.5), rt);
  add(new THREE.BoxGeometry(10.6, 1.2, 10.6), M.marbleSh, 'rival_cornice_top', 'stone', new THREE.Vector3(0, H * .84, 0), rt);
  const spire = add(new THREE.ConeGeometry(6.2, H * .1, 4, 1), M.marble, 'rival_spire', 'stone', new THREE.Vector3(0, H * .895, 0), rt); spire.rotation.y = Math.PI / 4;
  { const a = new THREE.Group(); a.name = 'rival_gold_angel'; a.position.set(0, H * .945, 0); a.scale.setScalar(1.7); rt.add(a); const G = M.gold;
    add(new THREE.SphereGeometry(.9, 10, 8), G, 'angel_ball', 'metal', new THREE.Vector3(0, 0, 0), a); add(new THREE.ConeGeometry(1.15, 3.1, 10), G, 'angel_robe', 'metal', new THREE.Vector3(0, 2.3, 0), a); add(new THREE.SphereGeometry(.62, 10, 8), G, 'angel_head', 'metal', new THREE.Vector3(0, 4.3, 0), a);
    for (const s of [-1, 1]) { const w = add(new THREE.SphereGeometry(1, 10, 8), G, 'angel_wing', 'metal', new THREE.Vector3(s * 1.25, 3.5, -.2), a); w.scale.set(.75, 1.7, .25); w.rotation.z = -s * .5; }
    const tr = add(new THREE.CylinderGeometry(.1, .3, 2.4, 8), G, 'angel_trumpet', 'metal', new THREE.Vector3(-1.2, 4.5, .3), a); tr.rotation.z = 1.1; }
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + .3, r = 14 + (i % 3) * 5, hc = 9 + (i % 4) * 2.2; add(new THREE.ConeGeometry(1.9, hc, 8), M.cyp, 'rival_cypress', 'foliage', new THREE.Vector3(Math.cos(a) * r, hc / 2 - 2 - r * .12, Math.sin(a) * r * .6), rt); }

  const update = (f, t, R) => { if (R && R.camera) { skyDome.position.copy(R.camera.position); skyDome.updateMatrixWorld(); } };
  return { update, anchors: { apex: APEX, spear_base: [S.x, S.y, S.base], spear_tip: [S.x, S.y, S.tip], nail_head: [S.x - .298, S.y - .03, roofZ(-.34, 0) + .178], rival_angel: [RIVAL.x, RIVAL.y, RIVAL.top], piazza: [(PZ.x0 + PZ.x1) / 2, (PZ.y0 + PZ.y1) / 2, TOWN_Z] } };
}

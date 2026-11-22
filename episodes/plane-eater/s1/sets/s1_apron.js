// s1_apron.js: S1 THE HOOK of plane-eater (film 0.00-8.56 s = frames 0-256, plan rows 1-9), the Villebrune apron in MORNING sun. S1 builder 2026-11-22.
// Builds the shared apron (sets/apron.js, symlinked) and adds ONLY this stretch's story things; no shared set or prop file is edited.
//   - the Cessna 150 F-MIAM (props/out/cessna150.glb) on ANCHORS.cessna_spot, nose south
//   - Michel's showman steamer trunk on a folding luggage stand beside the salted wing tip, lid open: "MONSIEUR / MANGETOUT" in circus letters (row 6),
//     brass corners, leather straps, a top tray with the white plate (props/out/plate.glb) for the first bite (row 9). Built in code: no asset exists.
//   - salt grains falling from the shaker cap onto the wing tip and bouncing on the aluminium (rows 1-2, f0-62)
//   - the saw cut: a neat ink line growing across the underside and leading edge of the wing tip (row 7 "cut" f173-200) + a fine silver dust puff, no sparks
//   - the first bite: ONE tiny square (metal_bites bite_3, navy stripe) rides in the sugar tongs from the cut to the plate (rows 9, f205-235), clinks on the china
//   - POWER 1 "Lunch!" f121: 8 quiet frames (motes slow), IMPACT FRAME f121-123 = napkin-red / white two-tone field with focus lines behind Michel
import { build as apronBuild, ANCHORS } from './apron.js';
import { GLB } from './pe_props.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
const PDIR = new URL('../props/out/', import.meta.url).href;
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
// story positions (plan metres, Z up), shared with make_film.py (keep in step)
export const S1 = { trunk: [5.35, -1.3, 0.03], cutX: 4.80, plateXY: [5.98, -1.62], tableTop: 1.5, LUNCH: 121, CUT: 173, PICK: 214, BITES: 235 };
let CESSNA = null;
function softTex(THREE) { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.45, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
function impactTex(THREE, bg, line) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 1820; const g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height);
  const cx = 512, cy = 760; let s = 1978; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; g.fillStyle = line;
  for (let i = 0; i < 110; i++) { const a = i / 110 * 6.283 + rnd() * .04, r0 = 250 + rnd() * 170, w = .006 + rnd() * .012; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    g.lineTo(cx + Math.cos(a - w) * 2000, cy + Math.sin(a - w) * 2000); g.lineTo(cx + Math.cos(a + w) * 2000, cy + Math.sin(a + w) * 2000); g.closePath(); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
function lidTex(THREE) {   // the inside of the trunk lid: deep navy panel, gold pinstripe border, circus letters with a drop shadow, little stars
  const c = document.createElement('canvas'); c.width = 1024; c.height = 640; const g = c.getContext('2d');
  g.fillStyle = '#1d3461'; g.fillRect(0, 0, 1024, 640); g.strokeStyle = '#e8c15a'; g.lineWidth = 10; g.strokeRect(34, 34, 956, 572); g.lineWidth = 3; g.strokeRect(54, 54, 916, 532);
  for (const [x, y] of [[90, 90], [934, 90], [90, 550], [934, 550]]) { g.fillStyle = '#e8c15a'; g.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 11 : 26, a = k * Math.PI / 5 - Math.PI / 2; g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } g.fill(); }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const word = (t, y, size) => { g.font = `900 ${size}px "Georgia", "Times New Roman", serif`; g.fillStyle = '#0d1a33'; g.fillText(t, 518, y + 9); g.fillStyle = '#f6efe0'; g.fillText(t, 512, y);
    g.lineWidth = 4; g.strokeStyle = '#e8c15a'; g.strokeText(t, 512, y); };
  word('MONSIEUR', 215, 128); word('MANGETOUT', 410, 128);
  g.font = 'italic 700 40px Georgia, serif'; g.fillStyle = '#e8c15a'; g.fillText('~ il mange tout ~', 512, 535);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
function woodTex(THREE, base, grain) { const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d'); g.fillStyle = base; g.fillRect(0, 0, 256, 256);
  let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; g.strokeStyle = grain; for (let i = 0; i < 70; i++) { g.globalAlpha = .15 + r() * .3; g.lineWidth = 1 + r() * 2; const y = r() * 256; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(80, y + r() * 10 - 5, 170, y + r() * 10 - 5, 256, y + r() * 6 - 3); g.stroke(); }
  g.globalAlpha = 1; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; }
function buildTrunk(THREE) {   // local: metres, Y up, the painted FRONT faces +Z (turned toward the lens in build), origin on the ground at the centre. Michel stands ON it.
  const g = new THREE.Group(); g.name = 's1_trunk';
  const W = .9, D = .5, H = .42;
  const M = (o) => new THREE.MeshStandardMaterial({ roughness: .55, metalness: 0, ...o });
  const wood = M({ map: woodTex(THREE, '#7a4a2a', '#3e2312'), roughness: .5 }), brass = new THREE.MeshStandardMaterial({ color: '#d9a94a', metalness: .9, roughness: .3 }),
    leather = M({ color: '#5a3320', roughness: .7 }), navy = M({ color: '#1d3461', roughness: .6 }), front = M({ map: lidTex(THREE), roughness: .55 });
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0, name = '') => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.rotation.set(rx, ry, rz); o.castShadow = o.receiveShadow = true; o.name = name; g.add(o); return o; };
  add(new THREE.BoxGeometry(W, H, D), navy, 0, H / 2, 0, 0, 0, 0, 'trunk_body');
  add(new THREE.PlaneGeometry(W - .1, H - .1), front, 0, H / 2, D / 2 + .007, 0, 0, 0, 'trunk_front_MONSIEUR_MANGETOUT');
  for (const y of [.025, H - .025]) for (const z of [-D / 2 - .004, D / 2 + .004]) add(new THREE.BoxGeometry(W + .01, .045, .012), wood, 0, y, z, 0, 0, 0, 'trunk_slat');
  for (const x of [-W / 2 - .004, W / 2 + .004]) add(new THREE.BoxGeometry(.012, H, D + .01), wood, x, H / 2, 0, 0, 0, 0, 'trunk_end');
  add(new THREE.BoxGeometry(W + .01, .03, D + .01), wood, 0, H + .012, 0, 0, 0, 0, 'trunk_lid_rim');
  for (const x of [-W / 2, W / 2]) for (const y of [0.02, H]) for (const z of [-D / 2, D / 2]) add(new THREE.BoxGeometry(.075, .075, .075), brass, x, y, z, 0, 0, 0, 'brass_corner');
  for (const x of [-.36, .36]) { add(new THREE.BoxGeometry(.05, H + .03, .008), leather, x, H / 2 + .01, D / 2 + .014, 0, 0, 0, 'strap'); add(new THREE.BoxGeometry(.062, .05, .012), brass, x, H * .72, D / 2 + .02, 0, 0, 0, 'buckle');
    add(new THREE.BoxGeometry(.05, .008, D + .02), leather, x, H + .03, 0, 0, 0, 0, 'strap_top'); }
  add(new THREE.BoxGeometry(.1, .07, .02), brass, 0, H - .07, D / 2 + .016, 0, 0, 0, 'lock_plate');
  for (const x of [-W / 2 - .02, W / 2 + .02]) add(new THREE.TorusGeometry(.045, .01, 8, 16, Math.PI), leather, x, H * .62, 0, 0, Math.PI / 2, 0, 'side_handle');
  return { group: g, top: H + .03 };
}
export async function build(THREE, scene, film, ctx) {
  const A = await apronBuild(THREE, scene, film, ctx), V = p => ctx.B2T(p);
  CESSNA ||= await new GLTFLoader().loadAsync(PDIR + 'cessna150.glb');
  const plane = CESSNA.scene.clone(true); plane.name = 'pe_cessna_FMIAM'; plane.position.copy(V(ANCHORS.cessna_spot)); scene.add(plane);
  let wing = null; plane.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; if (/^wing_L/.test(o.name) && !wing) wing = o; } });
  plane.updateMatrixWorld(true);
  // the wing tip section at the cut (ray-cast up and down through wing_L): underside and top per chord point
  const rc = new THREE.Raycaster(), sec = [];
  for (let y = -2.0; y <= -.1; y += .05) { const lo = new THREE.Vector3(), hi = new THREE.Vector3(); rc.set(V([S1.cutX, y, 0]), new THREE.Vector3(0, 1, 0)); const a = wing ? rc.intersectObject(wing, true) : [];
    rc.set(V([S1.cutX, y, 4]), new THREE.Vector3(0, -1, 0)); const b = wing ? rc.intersectObject(wing, true) : []; if (a[0] && b[0]) sec.push([y, a[0].point.y, b[0].point.y]); }
  console.warn('PE_S1_WINGSEC ' + JSON.stringify(sec.length ? { n: sec.length, le: sec[0], te: sec[sec.length - 1], mid: sec[sec.length >> 1] } : 'none'));
  // the sun's bounce off the pale concrete apron: a warm light from below lifts the wing's underside and leading edge (they read white, not shade grey)
  const bounce = new THREE.DirectionalLight('#fff1dc', 1.1); bounce.position.copy(V([6.5, -6, -2])); bounce.target.position.copy(V([3, -1, 2])); bounce.castShadow = false; scene.add(bounce, bounce.target);
  // ---- trunk + plate
  const T = buildTrunk(THREE); T.group.position.copy(V(S1.trunk)); T.group.rotation.y = .12; scene.add(T.group);   // the painted front turns to the east-south-east (the hook lens)
  // the plate stands ON the wing top beside the cut (the wing is his table): ray-cast the top surface under it
  const plate = GLB.plate.scene.clone(true); plate.name = 's1_plate'; plate.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
  // fix round (lead): the plate stands on a small pedestal side table at Michel's chest (he is on the trunk): brass column, round marble top, tripod foot
  const tbl = new THREE.Group(); tbl.name = 's1_side_table'; const brassM = new THREE.MeshStandardMaterial({ color: '#c99a45', metalness: .9, roughness: .3 }), marble = new THREE.MeshStandardMaterial({ color: '#efe9df', roughness: .25 });
  const tt = S1.tableTop, addT = (g, m, y) => { const o = new THREE.Mesh(g, m); o.position.y = y; o.castShadow = o.receiveShadow = true; tbl.add(o); return o; };
  addT(new THREE.CylinderGeometry(.2, .2, .035, 40), marble, tt - .0175); addT(new THREE.TorusGeometry(.2, .008, 8, 40), brassM, tt - .02).rotation.x = Math.PI / 2;
  addT(new THREE.CylinderGeometry(.022, .03, tt - .12, 16), brassM, (tt - .12) / 2 + .1); addT(new THREE.SphereGeometry(.04, 16, 12), brassM, tt * .55);
  for (let k = 0; k < 3; k++) { const leg = new THREE.Mesh(new THREE.BoxGeometry(.03, .025, .26), brassM); leg.position.set(Math.sin(k * 2.094) * .12, .05, Math.cos(k * 2.094) * .12); leg.rotation.y = k * 2.094; leg.castShadow = true; tbl.add(leg); }
  tbl.position.copy(V([S1.plateXY[0], S1.plateXY[1], .03])); scene.add(tbl);
  const plateP = V([S1.plateXY[0], S1.plateXY[1], .03 + tt + .002]); plate.position.copy(plateP); scene.add(plate);
  // ---- the bite (navy stripe one) + the cut line
  const biteG = new THREE.Group(); biteG.name = 's1_bite'; const bs = GLB.metal_bites.scene; bs.updateMatrixWorld(true); const b0 = bs.getObjectByName('bite_2');
  const off = b0 ? b0.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3();
  bs.traverse(o => { if (o.isMesh && /bite_2/.test(o.name + (o.parent ? o.parent.name : ''))) { const m = o.clone(); m.applyMatrix4(o.matrixWorld); m.position.sub(off); m.castShadow = true; biteG.add(m); } });
  if (!biteG.children.length) biteG.add(new THREE.Mesh(new THREE.BoxGeometry(.035, .0015, .035), new THREE.MeshStandardMaterial({ color: '#f3f4f1', metalness: .6, roughness: .3 })));
  biteG.scale.setScalar(2.2); scene.add(biteG);   // 3-4 cm square, x1.6 so it reads at phone size (still "tiny" beside his fist)
  const cutMat = new THREE.MeshBasicMaterial({ color: '#2a1830' }), cutUnder = new THREE.Mesh(new THREE.BoxGeometry(.012, .006, 1), cutMat); cutUnder.name = 's1_cut_line'; scene.add(cutUnder);
  const le = sec[0] || [-1.85, 1.78, 1.92], te = sec[sec.length - 1] || [-.3, 1.8, 1.9], cutFace = new THREE.Mesh(new THREE.BoxGeometry(.012, 1, .012), cutMat); scene.add(cutFace);
  const cutAt = u => { const L = (te[0] - le[0]) * u; cutUnder.scale.z = Math.max(.001, L); const mid = le[0] + L / 2; cutUnder.position.copy(V([S1.cutX, mid, Math.min(le[1], te[1]) - .002])); cutUnder.visible = u > 0;
    cutFace.scale.y = Math.max(.001, (le[2] - le[1]) * Math.min(1, u * 4)); cutFace.position.copy(V([S1.cutX, le[0] - .004, le[1] + (le[2] - le[1]) * Math.min(1, u * 4) / 2])); cutFace.visible = u > 0; };
  // ---- salt grains (seeded), saw dust
  const soft = softTex(THREE), NG = 110, grains = [];
  for (let i = 0; i < NG; i++) { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#fffbe8', transparent: true, depthWrite: false, opacity: 0, fog: false, toneMapped: false, blending: THREE.AdditiveBlending })); m.renderOrder = 6; scene.add(m); grains.push(m); }
  const dust = []; for (let i = 0; i < 18; i++) { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#e8edf2', transparent: true, depthWrite: false, opacity: 0, toneMapped: false })); m.renderOrder = 5; scene.add(m); dust.push(m); }
  const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  const impA = impactTex(THREE, '#f7f2ea', '#d62828'), impB = impactTex(THREE, '#d62828', '#f7f2ea');
  const imp = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: impA, toneMapped: false, fog: false })); imp.visible = false; imp.renderOrder = -1; imp.userData.noExport = true; scene.add(imp);
  const capOf = name => { let g = null; scene.traverse(o => { if (!g && o.name === name && o.visible) g = o; }); if (!g) return null; g.updateMatrixWorld(true); return g; };
  const wingTopAt = y => { let best = le; for (const s of sec) if (Math.abs(s[0] - y) < Math.abs(best[0] - y)) best = s; return best[2]; };
  function update(f, t, R) {
    A.update && A.update(f, t * (f > 112 && f < 121 ? .35 : 1));   // POWER 1 anticipation: the dust motes slow down (row 4)
    // salt: grains leave the inverted shaker cap while it shakes (f0-60), fall onto the wing top, one small bounce, fade
    const sh = capOf('pe_salt_shaker'); let cap = null; if (sh) cap = sh.localToWorld(new THREE.Vector3(0, .075, 0));
    grains.forEach((m, i) => { const life = 16, age = ((f + i * 1.31) % life), born = f - age; const on = cap && born >= 0 && born <= 60;
      if (!on) { m.material.opacity = 0; return; }
      const fall = Math.min(age, 9), x0 = cap.x + (rnd(i, 1) - .5) * .035, z0 = cap.z + (rnd(i, 2) - .5) * .035, yTop = wingTopAt(-(z0)) + .004;
      let y = cap.y - 4.9 * (fall / 30) ** 2 - .4 * fall / 30; if (y < yTop) y = yTop + (age > 9 ? .02 * Math.max(0, Math.sin(Math.PI * (age - 9) / 4)) : 0);
      m.position.set(x0 + (age > 9 ? (rnd(i, 3) - .5) * .03 * (age - 9) / 7 : 0), y, z0); m.scale.setScalar(.022 + .012 * rnd(i, 4)); m.material.opacity = 1 - Math.max(0, age - 11) / 5; });
    // the cut (rows 7-8): the line grows with the strokes f173-200, then stays; silver dust while sawing (no sparks)
    const cu = Math.max(0, Math.min(1, (f - S1.CUT) / 27)); cutAt(cu);
    dust.forEach((m, i) => { const a = ((f - S1.CUT + i * 1.6) % 14) / 14, on = f >= S1.CUT && f < 203; const b = V([S1.cutX, le[0] - .02, le[1] + .02]);
      m.position.set(b.x + (rnd(i, 5) - .5) * .12 * a, b.y - .25 * a * a + .03, b.z - .05 * a); m.scale.setScalar(.03 + .08 * a); m.material.opacity = on ? .8 * (1 - a) : 0; });
    // the bite: at the cut corner until the tongs take it (f212), in the tongs to the plate (f235), then on the plate (small clink hop)
    const tg = capOf('pe_sugar_tongs'); const onPlate = plate.position.clone().add(new THREE.Vector3(0, .016, 0));
    if (f < 200) biteG.visible = false; else { biteG.visible = true;
      if (f < 212) { biteG.position.copy(V([S1.cutX + .03, le[0] + .05, le[1] - .01])); biteG.rotation.set(0, 0, Math.PI / 2); }
      else if (f < S1.BITES && tg) { biteG.position.copy(tg.localToWorld(new THREE.Vector3(0, .12, 0))); biteG.rotation.set(0, .4, 0); }
      else { const k = f - S1.BITES, hop = k >= 0 && k < 6 ? .012 * Math.sin(Math.PI * k / 6) : 0; biteG.position.copy(onPlate).add(new THREE.Vector3(0, hop, 0)); biteG.rotation.set(0, .4, 0); } }
    // POWER 1 impact frame: f121 light field with red lines, f122-123 red field with light lines, behind Michel, facing the lens
    const E = f - S1.LUNCH; imp.visible = !!(R && R.camera) && E >= 0 && E < 3;
    if (imp.visible) { const cam = R.camera, head = V([5.35, -1.3, 2.1]), d = cam.position.distanceTo(head) + .6, fov = cam.fov * Math.PI / 180, h = 2 * d * Math.tan(fov / 2) * 1.15;
      imp.material.map = E === 0 ? impA : impB; imp.material.needsUpdate = true; const fw = new THREE.Vector3(); cam.getWorldDirection(fw);
      imp.position.copy(cam.position).addScaledVector(fw, d); imp.quaternion.copy(cam.quaternion); imp.scale.set(h * cam.aspect, h, 1); }
  }
  console.warn('PE_S1_PLATE ' + JSON.stringify([+plateP.x.toFixed(3), +(-plateP.z).toFixed(3), +plateP.y.toFixed(3)]));
  return { anchors: { ...A.anchors }, update };
}

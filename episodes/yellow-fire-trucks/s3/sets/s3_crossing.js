// s3_crossing.js: S3 (frames 474-770, plan rows 14-21), the crossing of Main and Elm in Pine Hollow at DUSK. S3 stretch builder 2026-11-21.
// It builds the shared town (sets/town.js, unchanged, LITE staging copy, trucks: false) and adds ONLY this stretch's story things (no set or prop file edited;
// sets/ and assets_prod/ are symlinked into s3/ because the render server serves the film folder only):
//   - the red pumper (full truck: 4 sirens + beacon row, dusk drain .85 so the red is nearly lost), racing west along Main in the south lane, braking into the bump
//   - the Meadowbrook DAIRY milk van, nose north on Elm: creeps to the white stop bar (475-505), rolls at "kept" (554-569), the bump on "hit" (569), rocks once
//   - POWER 2 on "hit" (f569): impact frame 569-571 (flat plum field with white focus lines on the bumpers, behind the vehicles), white shock lines at the bumper,
//     the hubcap leaves the van's front right wheel with a white spark trail, passes the lens, rolls to the kerb and stays (that wheel stays bare)
//   - row 17 "screaming": white sound rings pulse out of the four siren mouths, the brass bell swings; row 18 "flashing": the beacon row runs a wave, a pale pulse light on the Milkman
//   - a wire milk crate of bottles on the SE kerb under the lamp
import { build as townBuild } from './town.js';
import { buildTruck, buildProp2, place } from './assets.js';
const sm = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x), lerp = (a, b, u) => a + (b - a) * u, cl = x => Math.max(0, Math.min(1, x));
// story positions (plan metres, Z up; the crossing asphalt is z 0). make_film.py uses the same numbers (keep in step).
export const S3 = { HIT: 569, ty: -4.0, txHit: 28.9, tx0: 58, vx: 24.3, vy0: -11.2, vy1: -8.9, vy2: -7.6, crate: [27.35, -7.55, 0.12], cap_rest: [22.35, -4.45, 0.0] };
// truck x (nose west): races in, brakes hard the last metres (kid-safe bump), a 6 cm rebound after the bump
export const TX = f => f <= 474 ? S3.tx0 : f < S3.HIT ? S3.txHit + (S3.tx0 - S3.txHit) * Math.pow(1 - (f - 474) / (S3.HIT - 474), 1.25) : S3.txHit + .06 * Math.exp(-(f - S3.HIT) / 4) * Math.sin((f - S3.HIT) * .8);
// van y (nose north): the same linear runs as the Milkman's card in make_film.py (act 474 move_s 1.0 -> f475-505; act 553 move_s .5 -> f554-569)
export const VY = f => f < 475 ? S3.vy0 : f < 505 ? lerp(S3.vy0, S3.vy1, (f - 475) / 30) : f < 554 ? S3.vy1 : f < 569 ? lerp(S3.vy1, S3.vy2, (f - 554) / 15) : S3.vy2 - .05 * sm((f - 569) / 4);
function focusTex(THREE, bg, line) {   // impact frame field: flat plum + white focus lines closing on the centre (the bumpers)
  const c = document.createElement('canvas'); c.width = 1024; c.height = 1820; const g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height);
  const cx = 512, cy = 1000; let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; g.fillStyle = line;
  for (let i = 0; i < 110; i++) { const a = i / 110 * 6.283 + rnd() * .05, r0 = 260 + rnd() * 200, w = .005 + rnd() * .01; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    g.lineTo(cx + Math.cos(a - w) * 2200, cy + Math.sin(a - w) * 2200); g.lineTo(cx + Math.cos(a + w) * 2200, cy + Math.sin(a + w) * 2200); g.closePath(); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
function softTex(THREE) { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.4, 'rgba(255,255,255,.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }

export async function build(THREE, scene, film, ctx) {
  const T = await townBuild(THREE, scene, film, { ...ctx, place: { ...(ctx.place || {}), trucks: false } });
  const V = p => ctx.B2T(p);
  // ---- the red pumper (full asset: the light file has no sirens and no beacon row, rows 17-18 need both)
  const truck = await buildTruck(THREE, ctx, { paint: 'red', drain: .85, masking: false, letters: 'over', wear: .35, sirens: 4, beaconRow: true, priceCard: false, beacon: true, light: !!(ctx.place || {}).truckLight });
  place(THREE, scene, ctx, truck, [S3.tx0, S3.ty, 0], 0);
  // ---- the milk van, nose north (yaw -90): local front -X -> plan +Y, local +Z (cab door, open) -> plan -X
  const van = await buildProp2(THREE, 'milk_van'); place(THREE, scene, ctx, van, [S3.vx, S3.vy0, 0], -90); van.group.rotation.order = 'YXZ';
  // WORKAROUND (asset file untouched): the van GLB keeps the download's GREEN paint texture in the kit (PROPS.md: cream #F1E7CC). Re-tint the body
  // materials to cream from the texture's own lightness, so the asset's dirt and rust stay. The cornflower stripe is not drawn (request in STATE.md).
  van.group.traverse(o => { if (!o.isMesh || !/^(material|Doors|Doors\.back|Backstand_metal)$/.test(o.material.name)) return; const m = o.material.clone(); o.material = m;
    m.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n{ float l = dot(diffuseColor.rgb, vec3(.299, .587, .114)); diffuseColor.rgb = vec3(.88, .80, .62) * clamp(l * 2.4, .3, 1.0); }'); };
    m.customProgramCacheKey = () => 'phfd_van_cream'; m.needsUpdate = true; });
  const hubL =van.anchors.hubcap_front_right ? van.anchors.hubcap_front_right.clone() : new THREE.Vector3(-2.02, .31, -.86);
  const cap = await buildProp2(THREE, 'hubcap'); scene.add(cap.group);
  // the van's own front right wheel keeps the asset's cap (assets_prod STATE: "bare hub" not built): our flying cap is placed just outside it
  const crate = await buildProp2(THREE, 'milk_crate'); place(THREE, scene, ctx, crate, S3.crate, 20);
  // ---- POWER 2 parts
  const imp = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: focusTex(THREE, '#5b3f92', '#f6f1ff'), toneMapped: false, fog: false }));
  imp.visible = false; imp.renderOrder = -1; scene.add(imp);
  const soft = softTex(THREE), sparks = [], shock = [];
  for (let i = 0; i < 26; i++) { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#ffffff', transparent: true, depthWrite: false, opacity: 0, fog: false, toneMapped: false })); m.renderOrder = 6; scene.add(m); sparks.push(m); }
  const lineMat = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false, fog: false, transparent: true, side: THREE.DoubleSide });
  for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, .035), lineMat.clone()); m.visible = false; m.renderOrder = 7; scene.add(m); shock.push(m); }
  // ---- sound rings at the four siren mouths (row 17 EXTREME): white rings pulsing out toward the front (-x)
  const sirenX = -2.53 - .25, sirenY = 2.545, sirenZ = [-.78, -.27, .27, .78], rings = [];
  for (let k = 0; k < 4; k++) for (let j = 0; j < 3; j++) { const r = new THREE.Mesh(new THREE.RingGeometry(.8, 1, 40), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, toneMapped: false, fog: false, side: THREE.DoubleSide, depthWrite: false }));
    r.rotation.y = Math.PI / 2; r.renderOrder = 6; truck.group.add(r); rings.push([r, k, j]); }
  // ---- the beacon pulse that ticks over the Milkman's white jacket (row 18); pale, never red on him
  const pulse = new THREE.PointLight('#ffe9e0', 0, 5, 2); scene.add(pulse);
  const contact = [S3.txHit - 3.8, S3.ty - .9, .75];
  function update(f, t, R) {
    // trucks: position, wheels, paint frame (assets.js uInvRoot workaround from S1: called every frame), beacons, bell
    const tx = TX(f); truck.group.position.copy(V([tx, S3.ty, 0])); truck.setWheels(S3.tx0 - tx);
    const m0 = truck.group.getObjectByProperty('isMesh', true); if (m0 && m0.onBeforeRender) m0.onBeforeRender(null, scene);
    truck.setBeacon(true, f * 9, f * .32);
    const H = f - S3.HIT; truck.setBell(H > 0 ? 28 * Math.exp(-H / 30) * Math.sin(H * .45) + (f > 600 && f < 640 ? 18 * Math.sin((f - 600) * .5) : 0) : 0);
    // van: creep, roll, rock once on the bump
    const vy = VY(f); van.group.position.copy(V([S3.vx, vy, 0])); van.group.rotation.y = -Math.PI / 2;
    van.group.rotation.x = H > 0 && H < 24 ? .035 * Math.exp(-H / 6) * Math.sin(H * .9) : 0; van.group.updateMatrixWorld(true);
    const m1 = van.group.getObjectByProperty('isMesh', true); if (m1 && m1.onBeforeRender) m1.onBeforeRender(null, scene);
    // hubcap: on the wheel until the hit, then flies at the lens (toward the SE kerb), spinning, bounces once and rolls to the kerb
    const hub = van.group.localToWorld(hubL.clone().add(new THREE.Vector3(0, 0, -.04)));
    if (H < 0) { cap.group.position.copy(hub); cap.group.rotation.set(0, -Math.PI / 2, Math.PI / 2); }
    else { const u = cl(H / 26), rest = V(S3.cap_rest), mid = V([23.4, -3.7, .9]);
      const p = u < .5 ? hub.clone().lerp(mid, sm(u * 2)) : mid.clone().lerp(rest, sm((u - .5) * 2)); p.y += u < .5 ? .25 * Math.sin(Math.PI * u * 2) : .12 * Math.abs(Math.sin(Math.PI * (u - .5) * 4)) * (1 - u);
      cap.group.position.copy(p); cap.group.rotation.set(H * .55, -Math.PI / 2 + H * .2, Math.PI / 2 - (u >= 1 ? 1.45 : u * 1.2)); }
    // sparks: a white trail behind the flying hubcap (569-590)
    sparks.forEach((m, i) => { const a = H - i * .6; const on = H >= 0 && H < 22 && a > 0; if (!on) { m.material.opacity = 0; return; }
      const back = cap.group.position.clone().lerp(hub, cl(i / 26) * .9); m.position.copy(back).add(new THREE.Vector3(Math.sin(i * 7.1) * .05, Math.cos(i * 3.3) * .05, Math.sin(i * 2.7) * .05));
      m.scale.setScalar(.06 * (1 - i / 30)); m.material.opacity = .95 * (1 - i / 26) * (1 - H / 22); });
    // impact frame 569-571 and shock lines at the bumper 569-578
    const cam = R && R.camera;
    imp.visible = !!cam && H >= 0 && H < 3;
    if (imp.visible) { const c0 = V(contact), d = cam.position.distanceTo(c0) + 3.2, fov = cam.fov * Math.PI / 180, h = 2 * d * Math.tan(fov / 2) * 1.2, fw = new THREE.Vector3(); cam.getWorldDirection(fw);
      imp.position.copy(cam.position).addScaledVector(fw, d); imp.quaternion.copy(cam.quaternion); imp.scale.set(h * cam.aspect, h, 1); }
    shock.forEach((m, i) => { m.visible = !!cam && H >= 0 && H < 9; if (!m.visible) return; const c0 = V(contact), a = i / 9 * Math.PI * 2 + .3, r = .25 + .5 * sm(H / 8);
      m.position.copy(c0); m.quaternion.copy(cam.quaternion); m.rotateZ(a); m.translateX(r); m.scale.set(.45 * (1 - H / 10), 1.4, 1); m.material.opacity = 1 - H / 10; });
    // siren sound rings (600-645): three rings per siren running out of the horn mouth on a loop
    for (const [r, k, j] of rings) { const ph = ((f - 600) / 14 + j / 3) % 1, on = f >= 598 && f < 648;
      r.position.set(sirenX - .9 * ph, sirenY, sirenZ[k]); r.scale.setScalar(.09 + .3 * ph); r.material.opacity = on ? .9 * (1 - ph) : 0; }
    // pale beacon pulse ticking over the Milkman's jacket in the van door (630-664) and over his cap on "never" (725-745)
    const mk = f < 664 ? V([S3.vx - .9, vy + 1.7, 1.6]) : V([23.4, -2.6, 1.9]); pulse.position.copy(mk);
    const pw = (f > 630 && f < 664) || (f > 725 && f < 746) ? Math.max(0, Math.cos(f * .32 * 2.2)) ** 6 : 0; pulse.intensity = 9 * pw;
  }
  return { anchors: { ...T.anchors }, update };
}

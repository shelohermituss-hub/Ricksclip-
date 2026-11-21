// s6_world.js: S6 THE ANSWER (frames 1202-1576, plan rows 36-48, script lines 10-12). S6 stretch builder 2026-11-21, BOARD round.
// One wrapper, three of the film's places (no set or prop file edited; sets/ and assets_prod/ are symlinked into s6/ because the render server serves the film folder only):
//   places.<name>.mode = 'dal'   : sets/dallas.js unchanged (S5's yard at noon, both trucks at their rest marks): the push into the red truck's chrome headlamp (rows 36)
//                        'park'  : sets/town.js LITE, trucks off + the red pumper rolling WEST along Main through ONE low apricot sun shaft, red in it, its own paint drained
//                                  to grey after it (rows 40-41), the Kid's red ball rolling into the lawn and going grey (rows 42-43), the lawn of lost grey things (row 44)
//                        'cross' : the same town LITE + the milk van on the white bar (S3's mark) and the LEMON truck coming west down Main, glowing (rows 45-48),
//                                  POWER 4 (flat plum field with focus lines behind it from 1556, a lemon aura flickering on 2s)
// The lamp room itself (rows 36-39) is sets/lamproom.js unchanged (place 'eye').
import { build as townBuild } from './town.js';
import { build as dallasBuild } from './dallas.js';
import { buildTruck, buildProp2, place } from './assets.js';
const sm = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x), cl = x => Math.max(0, Math.min(1, x)), lerp = (a, b, u) => a + (b - a) * u;
// story numbers (plan metres, Z up). make_film.py uses the same (keep in step).
export const S6 = {
  TY: -4.0,                                              // the south lane of Main (S3)
  park: { tx0: 41.0, v: .085, f0: 1318, shaftX: 39.0, drain0: 1347, drain1: 1368, ball0: [36.6, -12.2, .11], ball1: [35.35, -9.75, .11], throwF: 1394, restF: 1412, greyF0: 1408, greyF1: 1414 },
  cross: { vx: 24.3, vy: -7.6, tx0: 70.0, v: .489, f0: 1470, crate: [27.35, -7.55, .12], p4: 1556 },
};
export const TXP = f => S6.park.tx0 - S6.park.v * (f - S6.park.f0);        // red pumper centre x in the park take (linear: the driver card follows it with one linear act)
export const TXC = f => S6.cross.tx0 - S6.cross.v * (f - S6.cross.f0);     // lemon truck centre x at the crossing (linear, same reason)
function softTex(THREE) { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.4, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
function shaftTex(THREE) { const c = document.createElement('canvas'); c.width = 64; c.height = 256; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 64, 0);
  gr.addColorStop(0, 'rgba(255,190,120,0)'); gr.addColorStop(.3, 'rgba(255,196,130,.55)'); gr.addColorStop(.7, 'rgba(255,196,130,.55)'); gr.addColorStop(1, 'rgba(255,190,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 256);
  const v = g.createLinearGradient(0, 0, 0, 256); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(.25, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-in'; g.fillStyle = v; g.fillRect(0, 0, 64, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
function focusTex(THREE, bg, line) {   // POWER 4 field: flat plum + long light streaks closing on the centre (S3's impact frame, re-tinted)
  const c = document.createElement('canvas'); c.width = 1024; c.height = 1820; const g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height);
  const cx = 512, cy = 1050; let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; g.fillStyle = line;
  for (let i = 0; i < 90; i++) { const a = i / 90 * 6.283 + rnd() * .05, r0 = 330 + rnd() * 260, w = .004 + rnd() * .008; g.globalAlpha = .35 + rnd() * .5; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    g.lineTo(cx + Math.cos(a - w) * 2200, cy + Math.sin(a - w) * 2200); g.lineTo(cx + Math.cos(a + w) * 2200, cy + Math.sin(a + w) * 2200); g.closePath(); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
// the Kid's ball (PROPS.md: 22 cm rubber, moulded seam, one grass stain, a faded star): coded here (no asset in assets_prod; request in STATE.md)
function ballTex(THREE) { const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(0, 0, 512, 256);
  let s = 5; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(0,0,0,${.03 + rnd() * .05})`; g.fillRect(rnd() * 512, rnd() * 256, 2 + rnd() * 5, 1 + rnd() * 3); }
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 128); for (let x = 0; x <= 512; x += 8) g.lineTo(x, 128 + 10 * Math.sin(x / 512 * 6.283 * 2)); g.stroke();
  g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283 - 1.57, r = k % 2 ? 14 : 34; g.lineTo(380 + r * Math.cos(a), 80 + r * Math.sin(a)); } g.closePath(); g.fill();
  g.fillStyle = 'rgba(70,110,40,.35)'; g.beginPath(); g.ellipse(150, 170, 40, 14, .4, 0, 6.283); g.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
// the lawn of lost things (row 44 EXTREME): wagon, kite, boot, watering can, tricycle, all the one red by day, grey at dusk. Coded stand-ins (request in STATE.md)
function lostThings(THREE, mat) {
  const G = new THREE.Group(), box = (w, h, d, x, y, z, r = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.rotation.y = r; return m; };
  const cyl = (r0, r1, h, x, y, z, rx = 0, rz = 0) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, 18), mat); m.position.set(x, y, z); m.rotation.set(rx, 0, rz); return m; };
  const tor = (R, r, x, y, z, ry = 0) => { const m = new THREE.Mesh(new THREE.TorusGeometry(R, r, 8, 24), mat); m.position.set(x, y, z); m.rotation.y = ry; return m; };
  const wagon = new THREE.Group(); wagon.add(box(.9, .18, .45, 0, .26, 0), box(.9, .05, .02, 0, .37, .22), box(.9, .05, .02, 0, .37, -.22));
  for (const [x, z] of [[-.32, .25], [.32, .25], [-.32, -.25], [.32, -.25]]) wagon.add(tor(.1, .025, x, .11, z));
  const hnd = cyl(.012, .012, .8, -.75, .2, 0, 0, 1.2); wagon.add(hnd); wagon.userData.at = [33.6, -15.6, .02, 30];
  const kite = new THREE.Group(); const ks = new THREE.Shape(); ks.moveTo(0, .45); ks.lineTo(.3, 0); ks.lineTo(0, -.65); ks.lineTo(-.3, 0); ks.closePath();
  const km = new THREE.Mesh(new THREE.ShapeGeometry(ks), mat); km.rotation.x = -Math.PI / 2 + .25; km.position.y = .06; kite.add(km, cyl(.006, .006, 1.05, 0, .07, -.1, Math.PI / 2 - .25)); kite.userData.at = [38.8, -14.2, .02, -40];
  const boot = new THREE.Group(); boot.add(box(.13, .3, .13, 0, .15, 0), box(.28, .1, .13, .08, .05, 0)); boot.rotation.z = -1.35; boot.userData.at = [35.9, -16.6, .07, 70];
  const can = new THREE.Group(); can.add(cyl(.13, .15, .26, 0, .13, 0), cyl(.02, .03, .36, .2, .22, 0, 0, -.9), cyl(.01, .01, .2, -.02, .33, 0, 0, Math.PI / 2)); can.userData.at = [40.6, -11.6, .02, 15];
  const tri = new THREE.Group(); tri.add(tor(.22, .03, 0, .22, 0), tor(.14, .025, .55, .14, .2), tor(.14, .025, .55, .14, -.2), cyl(.02, .02, .55, .28, .3, 0, 0, 1.1), box(.18, .04, .12, .32, .45, 0), cyl(.015, .015, .4, 0, .48, 0, Math.PI / 2));
  tri.rotation.z = 1.4; tri.userData.at = [37.6, -18.4, .3, -20];
  for (const o of [wagon, kite, boot, can, tri]) G.add(o); return G;
}

export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, mode = pl.mode || 'park', V = p => ctx.B2T(p), soft = softTex(THREE);
  if (mode === 'dal') {                                                        // S5's yard as built; the trucks stand at their marks (S5 rolls them there by f1024)
    const D = await dallasBuild(THREE, scene, film, ctx);
    const up = () => { for (const T of [D.red, D.lime]) { if (!T) continue; const m0 = T.group.getObjectByProperty('isMesh', true); if (m0 && m0.onBeforeRender) m0.onBeforeRender(null, scene); } };
    return { anchors: { ...D.anchors }, update: f => up() };
  }
  const T = await townBuild(THREE, scene, film, { ...ctx, place: { ...pl, trucks: false } });
  const lt = !!pl.truckLight, parts = [];
  if (mode === 'park') {
    const P = S6.park;
    const truck = await buildTruck(THREE, ctx, { paint: 'red', drain: 0, masking: false, letters: 'over', wear: .35, sirens: 4, beaconRow: true, priceCard: false, light: lt });
    place(THREE, scene, ctx, truck, [P.tx0, S6.TY, 0], 0);
    // the last low sun shaft between two buildings (row 40): a warm spot low from the west-north-west across Main, and a soft visible beam in the dust
    const sun = new THREE.SpotLight('#ffb070', 0, 40, .12, .6, 1.2); sun.position.copy(V([P.shaftX - 14, 10, 5.5])); sun.target.position.copy(V([P.shaftX, S6.TY, 1.2])); scene.add(sun, sun.target);
    const beam = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 18), new THREE.MeshBasicMaterial({ map: shaftTex(THREE), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false, opacity: .55, side: THREE.DoubleSide }));
    const a = V([P.shaftX - 7, 3, 3.2]), b = V([P.shaftX, S6.TY, .2]); beam.position.copy(a).lerp(b, .5); beam.lookAt(b); beam.rotateX(Math.PI / 2); beam.userData.noExport = true; scene.add(beam);
    const patch = new THREE.Mesh(new THREE.CircleGeometry(1, 32), new THREE.MeshBasicMaterial({ map: soft, color: '#ffb47a', transparent: true, opacity: .5, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
    patch.scale.set(1.6, 4.2, 1); patch.rotation.x = -Math.PI / 2; patch.position.copy(V([P.shaftX, S6.TY, .02])); scene.add(patch);
    const glint = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#fff1d8', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false })); glint.scale.setScalar(.5); scene.add(glint);
    // the ball: red rubber by day, its OWN paint goes grey as it leaves the last sun patch (row 43); the lost things lie grey in the lawn (row 44)
    const ballMat = new THREE.MeshStandardMaterial({ map: ballTex(THREE), color: '#D3141C', roughness: .55 }), ball = new THREE.Mesh(new THREE.SphereGeometry(.11, 32, 20), ballMat); ball.castShadow = true; scene.add(ball);
    const greyMat = new THREE.MeshStandardMaterial({ color: '#4B4753', roughness: .8 }), lost = lostThings(THREE, greyMat);
    lost.children.forEach(o => { const [x, y, z, r] = o.userData.at; o.position.copy(V([x, y, z])); o.rotation.y += r * Math.PI / 180; o.traverse(m => { if (m.isMesh) m.castShadow = true; }); }); scene.add(lost);
    const lawnSun = new THREE.Mesh(new THREE.CircleGeometry(1, 32), patch.material.clone()); lawnSun.material.opacity = .35; lawnSun.scale.set(2.2, 1.4, 1); lawnSun.rotation.x = -Math.PI / 2; lawnSun.position.copy(V([36.7, -12.3, .03])); scene.add(lawnSun);
    const red = new THREE.Color('#D3141C'), grey = new THREE.Color('#4B4753');
    function update(f, t, R) {
      const tx = TXP(f); truck.group.position.copy(V([tx, S6.TY, 0])); truck.setWheels(P.tx0 - tx);
      const m0 = truck.group.getObjectByProperty('isMesh', true); if (m0 && m0.onBeforeRender) m0.onBeforeRender(null, scene);     // the assets.js paint-frame workaround (S1)
      truck.setPaint({ drain: sm((f - P.drain0) / (P.drain1 - P.drain0)) });
      const inS = 1 - cl(Math.abs(tx - P.shaftX) / 4.5); sun.intensity = 900 * (.35 + .65 * inS);          // the shaft is there all the time; the truck is IN it at f1331
      glint.position.copy(V([tx - 3.9, S6.TY - 1.05, 1.0])); glint.material.opacity = inS * (.6 + .4 * Math.abs(Math.sin(f * .7)));
      // ball: thrown at 1394 from the Kid's fists, bounces twice, rolls toward the lens and stops at 1412; its red leaves in 6 frames 1408-1414
      const u = cl((f - P.throwF) / (P.restF - P.throwF)), e = 1 - (1 - u) * (1 - u), p0 = P.ball0, p1 = P.ball1;
      const hop = f < P.throwF ? .55 : u < .3 ? .55 + .5 * Math.sin(u / .3 * Math.PI) * (1 - u) : u < .55 ? .11 + .12 * Math.sin((u - .3) / .25 * Math.PI) : .11;
      ball.position.copy(V([lerp(p0[0], p1[0], e), lerp(p0[1], p1[1], e), f < P.throwF ? .62 : Math.max(.11, hop)])); ball.rotation.x = -e * 16; ball.visible = f >= P.throwF - 14;
      ballMat.color.copy(red).lerp(grey, sm((f - P.greyF0) / (P.greyF1 - P.greyF0))); ballMat.roughness = .55 + .3 * sm((f - P.greyF0) / 6);
    }
    return { anchors: { ...T.anchors }, update };
  }
  // ---- mode 'cross': the milk van on the white bar (S3's mark), the lemon truck coming west down Main
  const C = S6.cross;
  const truck = await buildTruck(THREE, ctx, { paint: 'lemon', masking: false, letters: 'over', wear: .25, sirens: 4, beaconRow: true, priceCard: false, light: lt });
  place(THREE, scene, ctx, truck, [C.tx0, S6.TY, 0], 0);
  const van = await buildProp2(THREE, 'milk_van'); place(THREE, scene, ctx, van, [C.vx, C.vy, 0], -90);
  van.group.traverse(o => { if (!o.isMesh || !/^(material|Doors|Doors\.back|Backstand_metal)$/.test(o.material.name)) return; const m = o.material.clone(); o.material = m;    // S3 workaround: the van GLB is green in the kit
    m.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n{ float l = dot(diffuseColor.rgb, vec3(.299, .587, .114)); diffuseColor.rgb = vec3(.88, .80, .62) * clamp(l * 2.4, .3, 1.0); }'); };
    m.customProgramCacheKey = () => 'phfd_van_cream'; m.needsUpdate = true; });
  const crate = await buildProp2(THREE, 'milk_crate'); place(THREE, scene, ctx, crate, C.crate, 20);
  // the lemon truck is the light (row 46): its own paint holds full brightness: a lemon emissive lift on the paint, a soft lemon spill on the asphalt ahead of it
  truck.group.traverse(o => { if (!o.isMesh || !o.material || !o.material.uniforms && !o.material.color) return; const m = o.material; if (m.userData.s6lift) return;
    if (m.color && m.color.r > .6 && m.color.g > .6 && m.color.b < .45) { m.emissive = new THREE.Color('#E3EA22'); m.emissiveIntensity = .35; m.userData.s6lift = 1; } });
  const spill = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshBasicMaterial({ map: soft, color: '#E3EA22', transparent: true, opacity: .45, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
  spill.rotation.x = -Math.PI / 2; spill.scale.set(7, 3.4, 1); scene.add(spill);
  const glow = new THREE.PointLight('#e9f04a', 0, 14, 1.6); scene.add(glow);
  const aura = []; for (let i = 0; i < 14; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#E3EA22', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false, opacity: 0 })); s.renderOrder = 5; scene.add(s); aura.push(s); }
  const field = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: focusTex(THREE, '#4a3374', '#f3e9ff'), toneMapped: false, fog: false, transparent: true, opacity: 0, depthWrite: false }));
  field.renderOrder = -1; scene.add(field);
  function update(f, t, R) {
    const tx = TXC(f); truck.group.position.copy(V([tx, S6.TY, 0])); truck.setWheels(C.tx0 - tx);
    const m0 = truck.group.getObjectByProperty('isMesh', true); if (m0 && m0.onBeforeRender) m0.onBeforeRender(null, scene);
    const m1 = van.group.getObjectByProperty('isMesh', true); if (m1 && m1.onBeforeRender) m1.onBeforeRender(null, scene);
    spill.position.copy(V([tx - 6.5, S6.TY, .02])); glow.position.copy(V([tx - 4.6, S6.TY, 1.6])); glow.intensity = 60;
    // POWER 4 (built from 1556 to the panel pass): the street behind drops to flat plum with light streaks; the aura flickers on 2s
    const p4 = sm((f - C.p4) / 6), cam = R && R.camera, two = Math.floor(f / 2) % 2;
    aura.forEach((s, i) => { const a = i / 14 * 6.283; s.position.copy(V([tx - 1 + 4.4 * Math.cos(a), S6.TY + .2 * Math.sin(a * 3), 1.6 + 1.5 * Math.sin(a)])); s.scale.setScalar(1.6 + .5 * ((i + two) % 2)); s.material.opacity = p4 * (two ? .32 : .2); });
    field.visible = !!cam && p4 > 0;
    if (field.visible) { const c0 = V([tx, S6.TY, 1.4]), d = cam.position.distanceTo(c0) + 4.5, fov = cam.fov * Math.PI / 180, h = 2 * d * Math.tan(fov / 2) * 1.25, fw = new THREE.Vector3(); cam.getWorldDirection(fw);
      field.position.copy(cam.position).addScaledVector(fw, d); field.quaternion.copy(cam.quaternion); field.scale.set(h * cam.aspect, h, 1); field.material.opacity = p4; }
  }
  return { anchors: { ...T.anchors }, update };
}

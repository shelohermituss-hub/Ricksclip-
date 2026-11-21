// s1_yard.js: S1 THE HOOK (frames 0-288), the Pine Hollow station yard in MORNING light. S1 stretch builder 2026-11-20.
// It builds the shared town set (sets/town.js, unchanged: GLB + the two trucks) and adds ONLY this stretch's story things and effects; no set or prop
// builder is edited (sets/, assets_prod/ are symlinked into s1/ because the render server serves the film folder only).
//   - the hero truck: half state (masking, ribbon, price card, 4 sirens), its paint EDGE advances toward the nose while he sprays (f0-116, f268-288)
//   - compressor + air hose (rebuilt every frame from the compressor outlet, through his left fist, to the gun's air inlet)
//   - lemon paint tin (near prop of frame 0), scissors on the cushion on the stool (the uncut ribbon), the Old-Timer's lunch box with the lemon
//   - spray mist from the gun tip to the panel (lemon, never on him)
//   - POWER 1 on "exploded" (f172): 8 quiet frames, IMPACT FRAME f172-174 (two-tone navy / white background with focus lines on his head, everything
//     behind him dropped), steam blast from under his helmet, yard-dust shockwave ring (piece 18, colours from this yard), the film's kick (film.json)
//   - the STAMP on "red" (f223): dust puffs under both boots, the lunch box hops, the lemon hops off, rolls to the lens and stops with one wobble (f262)
import { build as townBuild } from './town.js';
import { buildCompressor, buildProp2, hosePoints, place, COLORS } from './assets.js';
import { makeShockwaveRing } from './power/shockwave_ring.mjs';
const sm = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x), lerp = (a, b, u) => a + (b - a) * u;
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
// story positions (plan metres, Z up) shared with make_film.py (keep in step)
const Z = .14;   // the yard concrete top
export const S1 = { hero: [-2.0, 15.7, Z], chief: [2.45, 19.1, Z], box: [2.2, 18.4, Z], lemonStop: [3.3, 13.7, Z + .03], comp: [-1.05, 17.5, Z], tin: [-1.5, 13.45, Z], stool: [-2.45, 12.85, Z],
  EXPLODE: 172, RED: 223 };
export const EDGE = f => f <= 116 ? lerp(-1.55, -2.85, sm(f / 116)) : f < 268 ? -2.85 : lerp(-2.85, -3.15, sm((f - 268) / 20));
function softTex(THREE, inner = 'rgba(255,255,255,1)') { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, inner); gr.addColorStop(.45, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
function impactTex(THREE, bg, line) {   // the impact frame: flat field + focus lines closing on the centre (his head), drawn once
  const c = document.createElement('canvas'); c.width = 1024; c.height = 1820; const g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height);
  const cx = 512, cy = 700; let s = 9; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; g.fillStyle = line;
  for (let i = 0; i < 120; i++) { const a = i / 120 * 6.283 + rnd() * .04, r0 = 230 + rnd() * 160, w = .006 + rnd() * .012; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    g.lineTo(cx + Math.cos(a - w) * 2000, cy + Math.sin(a - w) * 2000); g.lineTo(cx + Math.cos(a + w) * 2000, cy + Math.sin(a + w) * 2000); g.closePath(); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }

export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {};
  const T = await townBuild(THREE, scene, film, ctx);               // hero truck opts come from places.<name>.hero (film.json)
  const V = p => ctx.B2T(p), hero = T.hero;
  // ---- props on the ground
  const comp = buildCompressor(THREE, ctx); place(THREE, scene, ctx, comp, S1.comp, 200);
  const tin = await buildProp2(THREE, 'paint_tin_lemon'); place(THREE, scene, ctx, tin, S1.tin, 35);
  const stool = await buildProp2(THREE, 'ribbon_set'); place(THREE, scene, ctx, stool, S1.stool, 20);
  const box = await buildProp2(THREE, 'lunch_box'); place(THREE, scene, ctx, box, S1.box, 75);
  const lemon = await buildProp2(THREE, 'lemon'); scene.add(lemon.group);
  const boxTop = box.anchors.lid_top ? box.anchors.lid_top.y : .2;
  // the lunch box read white in the kit (key frames v2): its enamel is navy in PROPS.md; repaint the non-metal parts navy here (asset file untouched)
  box.group.traverse(o => { if (!o.isMesh) return; const m = o.material; console.warn('PHFD_BOX ' + m.name + ' ' + m.color.getHexString() + ' metal ' + m.metalness);
    if (m.metalness < .5) { o.material = m.clone(); o.material.color.set('#22325e'); o.material.map = null; o.material.roughness = Math.min(m.roughness, .45); } });
  // ---- air hose: a tube rebuilt every frame (compressor outlet -> ground loop -> up through the left fist -> gun inlet)
  const hoseMat = new THREE.MeshStandardMaterial({ color: '#26262a', roughness: .6 }); let hose = null;
  const outlet = comp.plan.outlet ? V(comp.plan.outlet) : V([S1.comp[0], S1.comp[1], Z + .47]);
  // ---- mist
  const mistTex = softTex(THREE), mist = [];
  for (let i = 0; i < 70; i++) { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: mistTex, color: COLORS.lemon, transparent: true, depthWrite: false, opacity: 0, fog: false })); m.renderOrder = 5; scene.add(m); mist.push(m); }
  // ---- POWER 1 parts
  const steamTex = softTex(THREE), steam = [];
  for (let i = 0; i < 16; i++) { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, color: '#b9c4da', transparent: true, depthWrite: false, opacity: 0, fog: false })); m.renderOrder = 6; scene.add(m); steam.push(m); }   // grey-blue: reads on the sky and on the cream wall (white on white did not)
  const dust = [];
  for (let i = 0; i < 14; i++) { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, color: '#d9d0bf', transparent: true, depthWrite: false, opacity: 0 })); m.renderOrder = 4; scene.add(m); dust.push(m); }
  const impA = impactTex(THREE, '#f4f1ea', '#1f2a54'), impB = impactTex(THREE, '#1f2a54', '#f4f1ea');
  const imp = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: impA, toneMapped: false, fog: false, depthWrite: true }));
  imp.visible = false; imp.renderOrder = -1; scene.add(imp);
  let ring = null;
  const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  const chiefHead = V([S1.chief[0], S1.chief[1], Z + 1.78]);
  function update(f, t, R) {
    // paint edge (the stroke): truck-local x of the lemon front
    hero.setPaint({ edge: EDGE(f) });
    // WORKAROUND (assets.js, not edited): a truck's paint frame (uInvRoot) is only set in its FIRST mesh's onBeforeRender; when that mesh is culled
    // (off screen) the paint is computed in world space (the lemon rear rendered aged red at f272). Call it every frame for both trucks.
    for (const tk of [hero, T.chief]) { if (!tk) continue; const m0 = tk.group.getObjectByProperty('isMesh', true); if (m0 && m0.onBeforeRender) m0.onBeforeRender(null, scene); }
    // gun from the kit's held3d (placed before this update): tip, inlet, nozzle direction
    let gun = null; scene.traverse(o => { if (!gun && o.name === 'phfd_spray_gun' && o.visible) gun = o; });
    const spraying = f < 114 || f >= 270;
    if (gun) { gun.updateMatrixWorld(true); const g = n => { const a = gun.getObjectByName('anchor_' + n); return a ? a.getWorldPosition(new THREE.Vector3()) : gun.getWorldPosition(new THREE.Vector3()); };
      const inlet = g('air_inlet'), tip = g('tip'), grip = g('grip');
      // hose: from the inlet straight down 0.2 m and 0.12 m back (+x, behind him: he faces -x) where his left fist clamps it, then to the ground and the compressor
      const fist = inlet.clone().add(new THREE.Vector3(.12, -.2, 0)); const pts = hosePoints(THREE, outlet, fist, true); pts.push(inlet.clone().add(new THREE.Vector3(.04, -.07, 0)), inlet);
      if (hose) { hose.geometry.dispose(); scene.remove(hose); }
      hose = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), 180, .0095, 8), hoseMat); hose.castShadow = true; hose.name = 's1_air_hose'; scene.add(hose);
      // mist: a fan from the tip toward the panel (three -x); particles live 14 f, born every frame
      const dir = tip.clone().sub(grip).setY(0).normalize(); if (!isFinite(dir.x)) dir.set(-1, 0, 0);
      const panelX = -3.18, reach = Math.max(.15, tip.x - panelX);
      mist.forEach((m, i) => { const age = ((f + i * 3.7) % 14) / 14; const on = spraying ? 1 : 0; const d = reach * Math.min(1, age * 1.25);
        m.position.set(tip.x - d, tip.y + (rnd(i, 1) - .5) * .5 * age + .03 * Math.sin(i), tip.z + (rnd(i, 2) - .5) * .7 * age); m.scale.setScalar(.05 + .32 * age);
        m.material.opacity = on * .42 * Math.sin(Math.PI * Math.min(1, age * 1.1)); }); }
    // ---- lunch box hop and the lemon (sits on the lid; hops on the stamp; rolls to the lens; one wobble)
    const R0 = f - S1.RED, hop = R0 > 0 && R0 < 10 ? .09 * Math.sin(Math.PI * R0 / 10) : 0, rock = R0 > 8 && R0 < 26 ? .06 * Math.exp(-(R0 - 8) / 4) * Math.sin((R0 - 8) * 1.9) : 0;
    box.group.position.copy(V([S1.box[0], S1.box[1], Z + hop])); box.group.rotation.z = rock;
    const L0 = V([S1.box[0], S1.box[1], boxTop + .03]);
    let lp = L0.clone(), roll = 0, wob = 0;
    if (R0 > 0) { const up = R0 < 12 ? .22 * Math.sin(Math.PI * Math.min(1, R0 / 12)) : 0, side = snap(R0, 12);
      const land = V([S1.box[0] - .05, S1.box[1] - .3, Z + .03]); lp = L0.clone().lerp(land, side); lp.y += up;
      if (R0 >= 12) { const u = Math.min(1, (R0 - 12) / 27), e = 1 - (1 - u) * (1 - u); const stop = V(S1.lemonStop); lp = land.clone().lerp(stop, e); roll = e * land.distanceTo(stop) / .03;
        if (u >= 1) { const k = R0 - 39; wob = k < 14 ? .35 * Math.exp(-k / 4) * Math.sin(k * 1.7) : 0; } } }
    lemon.group.position.copy(lp); lemon.group.rotation.set(-roll + wob, Math.PI / 2, 0);
    // ---- POWER 1
    const E = f - S1.EXPLODE;
    if (R && R.camera) { if (!ring) ring = makeShockwaveRing(THREE, scene, V([S1.chief[0], S1.chief[1], Z + .03]), { orient: 'ground', radius: 2.2, color: '#f6f1e6', shade: '#c4cbe0', ink: '#1d1a2a',
        dust: { count: 18, color: '#d9d0bf', ink: '#2a2230', size: .14, lift: .4, life: 1.3 }, debris: { count: 8, color: '#6f6a60', size: .05, speed: 3.2, gravity: 9.8 }, camera: () => R.camera });
      ring.update(E >= -3 && E < 50 ? E / 30 : -1e3);
      // impact frame: f172 light field with navy lines, f173-174 navy field with white lines; behind the Chief, facing the lens, filling the frame
      imp.visible = E >= 0 && E < 3; if (imp.visible) { const cam = R.camera, d = cam.position.distanceTo(chiefHead) + .7, fov = cam.fov * Math.PI / 180, h = 2 * d * Math.tan(fov / 2) * 1.15;
        imp.material.map = E === 0 ? impA : impB; imp.material.needsUpdate = true; const fw = new THREE.Vector3(); cam.getWorldDirection(fw);
        imp.position.copy(cam.position).addScaledVector(fw, d); imp.quaternion.copy(cam.quaternion); imp.scale.set(h * cam.aspect, h, 1);
        // centre the focus lines on his head
        const hp = chiefHead.clone().project(cam); imp.material.map.offset.set(0, 0); imp.position.addScaledVector(new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion), hp.x * h * cam.aspect / 2 * .0);
      } }
    // fix round: a > 1 gave (1 - a) ** 1.1 = NaN -> a black sprite at f200; a is clamped now
    steam.forEach((m, i) => { const a = Math.min(1, Math.max(0, (E + 1) / 26)); const on = E >= 3 && E < 25; const ang = (i / 16) * Math.PI * 2, r = .18 + .55 * snap(E + 1, 10) * (.6 + .5 * rnd(i, 3));
      m.position.set(chiefHead.x + Math.cos(ang) * r, chiefHead.y + .05 + .35 * a * (.5 + rnd(i, 4)) + Math.abs(Math.sin(ang)) * .1, chiefHead.z + Math.sin(ang) * r * .6);
      m.scale.setScalar(.18 + .5 * a); m.material.opacity = on ? .95 * (1 - a) ** 1.1 : 0; });
    dust.forEach((m, i) => { const a = (f - S1.RED) / 20, on = a >= 0 && a < 1, ft = i % 2 ? -.17 : .17, ang = rnd(i, 5) * 6.283;
      const b = V([S1.chief[0] + ft * .6, S1.chief[1] + ft * .3, Z + .05]); m.position.set(b.x + Math.cos(ang) * .3 * a, b.y + .12 * a, b.z + Math.sin(ang) * .3 * a);
      m.scale.setScalar(.1 + .3 * a); m.material.opacity = on ? .7 * (1 - a) : 0; });
  }
  return { anchors: { ...T.anchors }, update };
}

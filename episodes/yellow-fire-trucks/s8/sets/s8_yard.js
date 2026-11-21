// s8_yard.js: S8 THE PAYOFF (frames 1754-1898, script line 14, plan rows 54-58), the Pine Hollow station yard at DUSK. S8 stretch builder 2026-11-21 (BOARD round).
// Wraps the shared town set (sets/town.js, unchanged) and adds ONLY this stretch's story things; no set or prop builder is edited
// (sets/, assets_prod/ are symlinked into s8/ because the render server serves the film folder only; same pattern as s1/sets/s1_yard.js).
//   - the Chief's pumper: its paint DRAINS red -> grey-plum on "evening" (f1768-1777, the paint's own response, never a grade); bell swings once on "into"
//   - the station lamp story light over the lemon truck (LOOK_BIBLE: the wall lamp is line 14's source; the lemon truck is the brightest thing)
//   - the hero's mug steam
//   - POV EDGES (rows 56-57, f1814-1868): white helmet brim above, grey walrus moustache below, lids as a soft letterbox, his own fist going out
//     to pat (row 56, "beautiful") and his marching knees rising into frame (row 57, "walked"); all fixed to the camera
//   - POWER 5 on "into" (f1876): white impact stars and shock lines at the helmet (f1876-1885), the bell rings once; the shake is film.json kicks
import { build as townBuild } from './town.js';
import { COLORS } from './assets.js';
const sm = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
const Z = .14;   // the yard concrete top (town anchors carry z 0.14): every story position is on it
export const S8 = { EVENING: 1768, BEAUT: 1820, RED: 1830, WALKED: 1857, INTO: 1876, POV: [1828, 1863], hit: [4.2, 18.05, Z + 1.62], lampOverBay1: [-3.0, 15.2, 4.2] };
export const WIPE = f => sm((f - 1764) / 20);   // assets.js round 3: drainWipe 0..1 runs nose -> tail; the door (about 0.3 of the length) greys on "evening" 1768-1777
function softTex(THREE) { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.45, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
function lidTex(THREE, top) {   // a lid: dark at the frame edge, soft into the picture
  const c = document.createElement('canvas'); c.width = 4; c.height = 256; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256);
  const a = 'rgba(28,18,40,1)', b = 'rgba(28,18,40,0)'; gr.addColorStop(0, top ? a : b); gr.addColorStop(.55, top ? 'rgba(28,18,40,.75)' : 'rgba(28,18,40,.15)'); gr.addColorStop(1, top ? b : a);
  g.fillStyle = gr; g.fillRect(0, 0, 4, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
function starTex(THREE) {       // one ink-edged white impact star, drawn once
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); g.translate(64, 64); g.beginPath();
  for (let i = 0; i < 10; i++) { const r = i % 2 ? 22 : 58, a = i / 10 * Math.PI * 2 - Math.PI / 2; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath();
  g.fillStyle = '#fbf8ee'; g.fill(); g.lineWidth = 7; g.strokeStyle = '#1d1a2a'; g.stroke(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }

export async function build(THREE, scene, film, ctx) {
  const T = await townBuild(THREE, scene, film, ctx);
  const V = p => ctx.B2T(p), hero = T.hero, chief = T.chief;
  // the station lamp's pool on the lemon truck (story light; the town's wall lamp sits by the side door, 13 m away)
  const lamp = new THREE.PointLight('#ffe6a6', 34, 13, 2); lamp.position.copy(V(S8.lampOverBay1)); scene.add(lamp);
  const spill = new THREE.PointLight('#e3ea22', 6, 5, 2); spill.position.copy(V([-2.6, 15.6, .6])); scene.add(spill);   // the lemon's own bounce on the ground
  // ---- mug steam (positions follow the held mug, found by name each frame)
  const soft = softTex(THREE), steam = [];
  for (let i = 0; i < 8; i++) { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#e9e2f0', transparent: true, depthWrite: false, opacity: 0 })); m.renderOrder = 5; scene.add(m); steam.push(m); }
  // ---- POV edges: children of a group that copies the camera every frame (built in camera space, z = -d in front of the lens)
  const pov = new THREE.Group(); pov.visible = false; scene.add(pov);
  const flat = (col, o = {}) => new THREE.MeshBasicMaterial({ color: col, toneMapped: false, fog: false, depthTest: false, depthWrite: false, transparent: true, ...o });
  const D = .5;   // overlay plane distance (m); sizes below are fractions of the frame height at that distance, set in update()
  const brim = new THREE.Mesh(new THREE.CircleGeometry(1, 64, 0, Math.PI), flat('#f2efe6')); brim.renderOrder = 30; pov.add(brim);              // white helmet brim: a wide arc over the top
  const brimInk = new THREE.Mesh(new THREE.RingGeometry(.985, 1.02, 64, 1, 0, Math.PI), flat('#1d1a2a')); brimInk.renderOrder = 31; pov.add(brimInk);
  const mShape = new THREE.Shape(); mShape.moveTo(-1, 0); mShape.bezierCurveTo(-.85, .55, -.35, .62, 0, .34); mShape.bezierCurveTo(.35, .62, .85, .55, 1, 0);
  mShape.bezierCurveTo(.7, .16, .4, .1, .2, .2); mShape.bezierCurveTo(.1, .12, -.1, .12, -.2, .2); mShape.bezierCurveTo(-.4, .1, -.7, .16, -1, 0);
  const tash = new THREE.Mesh(new THREE.ShapeGeometry(mShape, 24), flat('#8e8a92')); tash.renderOrder = 30; pov.add(tash);                    // the grey walrus moustache, seen from above its own nose
  const tashInk = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(mShape.getPoints(40).map(p => new THREE.Vector3(p.x, p.y, 0))), new THREE.LineBasicMaterial({ color: '#1d1a2a', depthTest: false, transparent: true }));
  tashInk.renderOrder = 31; pov.add(tashInk);
  const lidT = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), flat('#ffffff', { map: lidTex(THREE, true) })), lidB = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), flat('#ffffff', { map: lidTex(THREE, false) }));
  lidT.renderOrder = lidB.renderOrder = 29; pov.add(lidT, lidB);
  const fist = new THREE.Mesh(new THREE.CircleGeometry(1, 40), flat('#141218')); fist.renderOrder = 32; pov.add(fist);                         // his round ink fist (the cast's hand: a plain black circle)
  const sleeve = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), flat('#22325e')); sleeve.renderOrder = 31; pov.add(sleeve);                    // navy short sleeve -> the arm
  const arm = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), flat('#f1c7a8')); arm.renderOrder = 31; pov.add(arm);
  const knees = [0, 1].map(() => { const k = new THREE.Mesh(new THREE.CircleGeometry(1, 40, 0, Math.PI), flat('#22325e')); k.renderOrder = 28; pov.add(k); return k; });
  // ---- POWER 5: impact stars + shock lines at the helmet
  const sT = starTex(THREE), stars = [];
  for (let i = 0; i < 5; i++) { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: sT, transparent: true, depthWrite: false, depthTest: false, fog: false, toneMapped: false, opacity: 0 })); m.renderOrder = 20; scene.add(m); stars.push(m); }
  const lines = []; const lineMat = new THREE.MeshBasicMaterial({ color: '#fbf8ee', transparent: true, depthTest: false, depthWrite: false, fog: false, toneMapped: false });
  for (let i = 0; i < 7; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), lineMat.clone()); m.renderOrder = 19; scene.add(m); lines.push(m); }
  const hit = V(S8.hit);
  function update(f, t, R) {
    if (chief) chief.setPaint({ drain: 1, drainWipe: WIPE(f) });   // (the s1 paint-frame workaround is gone: assets.js sets its own paint frame since round 3)
    const b = f - S8.INTO; if (chief && chief.setBell) chief.setBell(b > 0 && b < 40 ? 28 * Math.exp(-b / 9) * Math.sin(b * .55) : 0);
    // steam over the mug
    let mug = null; scene.traverse(o => { if (!mug && o.name === 'phfd_mug' && o.visible) mug = o; });
    steam.forEach((m, i) => { if (!mug) { m.material.opacity = 0; return; } const p = mug.getWorldPosition(new THREE.Vector3()), a = ((f + i * 5) % 40) / 40;
      m.position.set(p.x + .02 * Math.sin(f * .07 + i), p.y + .1 + .3 * a, p.z + .015 * Math.cos(f * .05 + i)); m.scale.setScalar(.04 + .09 * a); m.material.opacity = .32 * Math.sin(Math.PI * a); });
    // POV edges
    const cam = R && R.camera; pov.visible = !!cam && f >= S8.POV[0] && f <= S8.POV[1];
    if (pov.visible) { cam.updateMatrixWorld(); pov.position.copy(cam.position); pov.quaternion.copy(cam.quaternion);
      const h = 2 * D * Math.tan(cam.fov * Math.PI / 360), w = h * cam.aspect, at = (o, x, y, sx, sy) => { o.position.set(x * w, y * h, -D); o.scale.set(sx, sy, 1); };
      const step = Math.sin((f - 1794) * Math.PI / 14);   // the march: one step every 14 f; brim and moustache bob against it
      const bob = .006 * Math.abs(step);
      at(brim, 0, .44 + bob, w * .9, h * .13); at(brimInk, 0, .44 + bob, w * .9, h * .13);
      at(tash, 0, -.5 - bob, w * .5, h * .16); at(tashInk, 0, -.5 - bob, w * .5, h * .16);
      at(lidT, 0, .38, w * 1.1, h * .3); at(lidB, 0, -.38, w * 1.1, h * .3);
      // the fist: out on "beautiful" (snap 8), reaching to pat a fender that is further left than he thinks; drawn in from the low right
      const out = snap(f - S8.BEAUT + 2, 8), back = snap(f - 1850, 10), u = out * (1 - back);
      const fx = .44 - .26 * u, fy = -.62 + .33 * u, fr = h * (.05 + .015 * (1 - u));
      fist.visible = sleeve.visible = arm.visible = u > .01; at(fist, fx, fy, fr, fr);
      const ax = (fx + .55) / 2, ay = (fy - .6) / 2, len = Math.hypot((.55 - fx) * w, (-.6 - fy) * h), ang = Math.atan2((-.6 - fy) * h, (.55 - fx) * w);
      arm.position.set(ax * w, ay * h, -D); arm.rotation.z = ang; arm.scale.set(len, fr * 1.1, 1);
      sleeve.position.set((.55 + ax) / 2 * w, (-.6 + ay) / 2 * h, -D); sleeve.rotation.z = ang; sleeve.scale.set(len * .5, fr * 1.6, 1);
      // knees: "walked" on, each step lifts one knee into the bottom of the frame
      knees.forEach((k, i) => { const on = f >= S8.WALKED - 6, s = Math.max(0, Math.sin((f - 1794) * Math.PI / 14 + i * Math.PI)); k.visible = on; at(k, i ? .22 : -.22, -.5 - .1 + .12 * s * (on ? 1 : 0) - .08, w * .16, h * .12); });
    }
    // POWER 5 at the helmet
    const e = f - S8.INTO, on = e >= 0 && e < 10;
    stars.forEach((m, i) => { const a = i / 5 * Math.PI * 2 + .4, r = .22 + .18 * snap(e + 1, 4); m.position.set(hit.x + Math.cos(a) * r, hit.y + .08 + Math.sin(a) * r * .8, hit.z - .1);
      m.scale.setScalar((.13 + .05 * (i % 2)) * (on ? 1 - .5 * e / 10 : 0)); m.material.opacity = on ? 1 : 0; m.material.rotation = .3 * i + .05 * e; });
    if (cam) lines.forEach((m, i) => { const a = i / 7 * Math.PI * 2, r0 = .32 + .25 * snap(e + 1, 3), L = .22 * (1 - e / 10);
      m.visible = on; if (!on) return; m.quaternion.copy(cam.quaternion); const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion), up = new THREE.Vector3(0, 1, 0).applyQuaternion(cam.quaternion);
      m.position.copy(hit).addScaledVector(right, Math.cos(a) * (r0 + L / 2)).addScaledVector(up, Math.sin(a) * (r0 + L / 2)); m.rotateZ(a); m.scale.set(L, .022, 1); });
  }
  return { anchors: { ...T.anchors }, update };
}

// SHARED FX "zzz_fx" (owner: vfx-artist, phase A 2026-11-17; fake-surgery FIX_BRIEF_v3 "Shared pieces", ISSUES_v2 A3).
// FLOATING Zs over a sleeper: drawn bold letters "Z" (white with a cool blue belly, dark ink outline, a white shine notch), one born above the head
// every 0.5-0.7 s, rising and drifting sideways in a gentle S, growing, then fading over ~1.5 s; about 3 visible at once; looping f0 .. f1.
// Camera-facing quads (turned to the camera every frame; pass the camera to update) so they always face the lens; they start ABOVE the head (lift), never on the face.
// Technique: templates/pieces/fx/power/_core.mjs (easing, hash); the letter is a drawn path (no typed font), restyled from or_room's old koZ bubble.
//
// API   import { addZzz, registerKoClean } from './zzz_fx.js';
//       const Z = addZzz(THREE, scene, { head, f0, f1, ... });   ...in the set's update(f, t, R):  Z.update(f, R && R.camera);
//   head    the TOP of the sleeper's head: plan [x, y, z] (z up) | THREE.Vector3 (world) | Object3D | function(f) returning one of these
//   f0, f1  births happen in [f0, f1); the last Zs finish their life after f1 (cut: true hides everything at f1)
//   lift    m above the head where a Z is born (default .14)          rise   m it climbs over its life (default .42)
//   size    final letter height in m (default .2; alternate Zs are 70 %)    life  frames (default 45 = 1.5 s)   every [min, max] frames between births (default [15, 21])
//   side    drift direction: 1 = screen right (default), -1 = screen left, or a plan vector     sway  S amplitude in m (default .06)
//   tint    belly colour (default '#cfe2ff'), ink (default '#1b2440')     depthTest (default true: a nurse in front hides them)
//   returns { update(f, camera), group }
//   registerKoClean(name = 'koClean')  registers a meme face = memes.mjs 'ko' (spiral + X eyes, tongue) WITHOUT the head bump and WITHOUT any zZ bubble.
//       Await it in the set's build() before the cards draw; then use face: 'koClean' in the acts instead of 'koZ' / 'koSleep'.
import { clamp, smooth, easeOut, hash, toV3 } from './power/_core.mjs';

function zTexture(THREE, tint, ink) {
  if (typeof document === 'undefined') return null; const W = 256, c = document.createElement('canvas'); c.width = c.height = W; const x = c.getContext('2d');
  // a chunky drawn Z: top bar, slanted belly, bottom bar, a little wider at the bottom, corners rounded by the ink stroke
  const P = [[54, 48], [206, 40], [214, 82], [118, 172], [206, 168], [212, 216], [44, 222], [40, 182], [134, 92], [60, 96]];
  const path = () => { x.beginPath(); P.forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py))); x.closePath(); };
  x.lineJoin = 'round'; x.lineCap = 'round'; path(); x.lineWidth = 30; x.strokeStyle = ink; x.stroke();
  const gr = x.createLinearGradient(0, 40, 0, 222); gr.addColorStop(0, '#ffffff'); gr.addColorStop(.55, '#f4f9ff'); gr.addColorStop(1, tint); path(); x.fillStyle = gr; x.fill();
  x.lineWidth = 9; x.strokeStyle = '#ffffff'; x.beginPath(); x.moveTo(70, 60); x.lineTo(150, 55); x.stroke();          // shine on the top bar
  x.lineWidth = 6; x.strokeStyle = 'rgba(70,110,190,.55)'; x.beginPath(); x.moveTo(70, 206); x.lineTo(196, 202); x.stroke();   // cool shade under the bottom bar
  const t = new THREE.CanvasTexture(c); if (THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

export function addZzz(THREE, scene, o = {}) {
  const g = new THREE.Group(); g.name = 'fx_zzz'; scene.add(g);
  const f0 = o.f0 ?? 0, f1 = o.f1 ?? 1e6, life = Math.max(6, o.life ?? 45), lift = o.lift ?? .14, rise = o.rise ?? .42, size = o.size ?? .2, sway = o.sway ?? .06;
  const ev = o.every || [15, 21], seed = o.seed ?? 3, tex = zTexture(THREE, o.tint || '#cfe2ff', o.ink || '#1b2440');
  // births: a fixed list (pure function of f; stills render out of order)
  const births = []; for (let f = f0, i = 0; f < f1 && births.length < 4000; i++) { births.push({ f, i, big: i % 3 !== 1, ph: hash(i, seed) * 6.283, tw: hash(i, seed + 1) }); f += Math.round(ev[0] + (ev[1] - ev[0]) * hash(i, seed + 2)); }
  // camera-facing quads (the kit's passes skip THREE.Sprite, so these are meshes turned to the camera every frame)
  const quad = new THREE.PlaneGeometry(1, 1), pool = []; for (let i = 0; i < 6; i++) { const m = new THREE.MeshBasicMaterial({ map: tex, color: '#ffffff', transparent: true, alphaTest: .02, depthWrite: false, depthTest: o.depthTest ?? true, toneMapped: false, side: THREE.DoubleSide });
    const s = new THREE.Mesh(quad, m); s.name = 'fx_zzz_letter'; s.visible = false; s.renderOrder = 12; s.frustumCulled = false; s.castShadow = s.receiveShadow = false; s.userData.noExport = true; g.add(s); pool.push(s); }
  const CQ = new THREE.Quaternion();
  const H = new THREE.Vector3(), RT = new THREE.Vector3(1, 0, 0), UP = new THREE.Vector3(0, 1, 0), side = o.side ?? 1;
  const head = f => { let v = o.head; if (typeof v === 'function') v = v(f); return toV3(THREE, v || [0, 0, 1.5], Array.isArray(v), H); };
  return { group: g, update(f, cam) {
      if (Array.isArray(side)) { RT.set(side[0], side[2] || 0, -side[1]); } else if (cam) { cam.updateMatrixWorld(); RT.setFromMatrixColumn(cam.matrixWorld, 0); RT.y = 0; if (RT.lengthSq() < 1e-6) RT.set(1, 0, 0); RT.normalize().multiplyScalar(side); } else RT.set(side, 0, 0);
      if (cam) cam.getWorldQuaternion(CQ); const cut = o.cut && f >= f1; let n = 0;
      for (const b of births) { const k = f - b.f; if (k < 0 || k >= life || cut) continue; const s = pool[n++ % pool.length], u = k / life;
        const hp = head(f), up = lift + rise * (u * .35 + .65 * easeOut(u)), drift = .2 * u + sway * Math.sin(u * 6.283 * .9 + b.ph * .3);    // a gentle S: steady drift + one sway
        s.position.copy(hp).addScaledVector(UP, up).addScaledVector(RT, drift + .03 * (b.tw - .5));
        const sc = size * (b.big ? 1 : .7) * (.35 + .65 * easeOut(clamp(u / .55))); s.scale.set(sc, sc, 1);
        s.quaternion.copy(CQ); s.rotateZ((side < 0 ? 1 : -1) * (.16 + .12 * Math.sin(u * 5 + b.ph)));
        s.material.opacity = smooth(u / .12) * (1 - smooth((u - .62) / .38)); s.visible = !!tex; }
      for (let i = n; i < pool.length; i++) pool[i].visible = false; } };
}

export async function registerKoClean(name = 'koClean') {
  try { const mm = await import('/puppets/memes.mjs'), MM = mm.MEMES; if (!MM || !MM.ko || MM[name]) return !!(MM && MM[name]);
    MM[name] = (cx, hy) => { const m = MM.ko(cx, hy), over = (m.over || []).filter(x => !String(x).includes('url(#sk)') && !/zZ|>Z</.test(String(x))); return { ...m, over, rot: 12 }; }; return true;
  } catch (e) { console.warn('zzz_fx registerKoClean: ' + (e && e.message)); return false; }
}

// node test_lie_legs3d.mjs out.png  - LYING ON A BED WITH 3D LEGS (2026-11-16, CB: "with this you can now create lying on bed also in 3d space").
// The body card (no legs drawn) lies along the bed: its long axis stays on the body's line (hips -> head) and it turns ABOUT that axis to face the lens.
// Camera mostly above -> the front drawing (face up at us); otherwise the side drawing with the face pointing up. The legs are 3D ink tubes on the
// mattress from the hips to the feet (knee a little up, small toe), the same as the floor sit (film.js floorLegs), so every camera sees them in perspective.
import { buildChar } from '../vector2d_characters/code/castkit.mjs';
import { drawCharacter } from '../vector2d_characters/code/char2d.mjs';
import { withHair } from '../vector2d_characters/code/hair_lib.mjs';
import { createRequire } from 'module'; import http from 'http'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url)), OUT = process.argv[2];
const GY = 1440, dd = t => t.replace(/<[a-zA-Z][^>]*>/g, tag => { const seen = new Set(); return tag.replace(/\s([a-zA-Z:-]+)="[^"]*"/g, (m, k) => seen.has(k) ? '' : (seen.add(k), m)); });
function card(view, dir, tilt = 0, hdx = 0, belly = false) {
  let spec = withHair({ name: 'x', form: 'standard', size: 'standard', coat: '#5f7fa6', face: 'standard', outfit: 'peasant' }, 'sidePart');
  const S = buildChar(spec, 400); S.view = view; S.dir = dir; S.headTilt = tilt; S.headDx = hdx; S.noLegs = true;
  if (belly) { const T = S.bodyTop ?? 333;   // VARIANT B (Rick, "What the Grave Bell Really Meant" coffin): the near hand rests on the belly, elbow back by the side; the far hand hides behind the body
    S.arms = ({ cx, dir: d, view: vw }) => { if (vw === 'front') { const A = sg => { const sx = cx + sg * 78, sy = T + 62, hx = cx + sg * 22, hy = T + 212; return { d: `M${sx},${sy} Q${cx + sg * 150},${T + 190} ${hx},${hy}`, hand: [hx, hy] }; }; return { front: [A(-1), A(1)] }; }   // from above: both hands meet on the belly, elbows out
      const sx = cx + d * 6, sy = T + 46, hx = cx + d * 58, hy = T + 215; return { front: [{ d: `M${sx},${sy} Q${cx - d * 62},${T + 250} ${hx},${hy}`, hand: [hx, hy] }], back: { d: `M${sx},${sy} Q${cx - d * 40},${T + 240} ${cx + d * 40},${T + 200}`, hand: [cx + d * 40, T + 200] } }; }; } S.lieFlat = true;   /* no standing foot shadow on a lying card */
  const K = S.headK ?? 1.5, hy = (S.bodyTop ?? 333) - 100 * K * .78, gy = S.ground ?? 900, r = drawCharacter(S), dy = GY - gy;
  return { svg: dd(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1500" width="800" height="1500"><defs>${r.defs}</defs><g transform="translate(0,${dy})">${r.body}</g></svg>`),
    hpx: gy - (hy - 100 * K), hipV: (S.bodyBot ?? 640) - 30 + dy, neckV: (S.bodyTop ?? 333) + dy, halfW: (S.wBot ?? 104) * (view === 'side' ? .8 : 1) };
}
const HT = +(process.env.HT ?? 50), HDX = +(process.env.HDX ?? 110);   // CB 2026-11-16 "turn the head more clockwise like 3pm the mouth": lying on the back, the head turns toward the feet so the mouth points along the body, as in Rick's bed shots
const C = { front: card('front', 1), back: card('back', 1), side1: card('side', 1), sideM: card('side', -1), q1: card('34', 1), qM: card('34', -1), side1H: card('side', 1, HT, HDX), sideMH: card('side', -1, -HT, -HDX), side1B: card('side', 1, HT, HDX, true), sideMB: card('side', -1, -HT, -HDX, true), frontB: card('front', 1, 0, 0, true) };   // HDX: the head slides off the body line toward the sky (a neck bend), so it lies ON the pillow while the body stays flat
const ROWS = process.env.ROWS === 'back3' ? [['back', 'A · relaxed, one knee up'], ['back2', 'B · hand on the belly, ankles crossed (Rick: Grave Bell coffin)'], ['back3', 'C · tucked in under the blanket (Rick: Burglar bed)']]
  : [['back', 'on the back'], ['belly', 'sleeping on the belly'], ['situp', 'sitting up under the blanket']];
// 'from the head, high' (fix 2026-11-16): the old [-3.6, 2.4, .9] sat BELOW the headboard top line, so the headboard hid the body and the legs read as
// sticking up. The camera now looks OVER the headboard (sight line to the face clears the board top) and aims at the chest, not the bed centre.
const CAMS = [['level, side', [0, .75, 4.4]], ['3/4 high', [3, 2.6, 3.1]], ['above', [.4, 5.2, 1.3]], ['low 3/4', [3.6, .9, 2.4]], ['3/4 from the feet', [3.8, 1.9, 1.2]], ['from the head, high', [-2.7, 3.5, 1.0], [-.15, .5, 0]]];
// CB 2026-11-16: "be carefull that face not cleary visible. use only camera angle where the body not get squish. see ricks clips. never make different angle".
// Only Rick-style angles: the face clearly seen and the body never squashed. Camera along the body line (feet or head end) squashes a lying body; from above
// on the belly or from behind the sit-up shows only the back of the head. Those cameras are NOT used, for test sheets and for films.
const SKIP = { back2: ['low 3/4', '3/4 from the feet', 'from the head, high'], back3: ['low 3/4', '3/4 from the feet', 'from the head, high'], back: ['low 3/4', '3/4 from the feet', 'from the head, high'], belly: ['above', '3/4 from the feet', 'from the head, high'], situp: ['from the head, high'] };
const W = 400, H = 520;
const html = `<html><body style="margin:0"><canvas id="c" width="${W}" height="${H}"></canvas><script type="module">
import * as THREE from '/vendor/three.module.js';
const R = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: true, preserveDrawingBuffer: true }); R.setClearColor('#cfe3f2');
const C = ${JSON.stringify(C)};
const tex = s => new Promise(r => { const im = new Image(); im.onload = () => { const cv = document.createElement('canvas'); cv.width = 800; cv.height = 1500; cv.getContext('2d').drawImage(im, 0, 0); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.userData.cv = cv; r(t); }; im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); });
const MASK = new Map();   // opaque pixels of each card, split into head (above the neck line) and body (neck to hips), in card px, every 4th px
const mask = (cd, t) => { if (MASK.has(cd.svg)) return MASK.get(cd.svg); const d = t.userData.cv.getContext('2d').getImageData(0, 0, 800, 1500).data, head = [], body = [];
  for (let v = 0; v < 1500; v += 4) for (let u = 0; u < 800; u += 4) if (d[(v * 800 + u) * 4 + 3] > 60) { if (v < cd.neckV) head.push([u, v]); else if (v <= cd.hipV + 30) body.push([u, v]); }
  const m = { head, body }; MASK.set(cd.svg, m); return m; };
// CONTACT (fix 2026-11-16, the belly pose floated): from the card's own opaque pixels, lift the card so the LOWEST body pixel touches the mattress,
// and tilt the body line (head end up) just enough that the lowest head pixel rests on the pillow top instead of sinking through it.
// world y of a card pixel = hip.y + lift + x*r.y + y*a.y, with x = (u - 400) k and y = (hipV - v) k
const contact = (cd, m, r, k, floorY, pillowY) => {
  const lowest = (px, tilt) => Math.min(...px.map(([u, v]) => (u - 400) * k * r.y * Math.cos(tilt) + (cd.hipV - v) * k * Math.sin(tilt)));
  const lb0 = lowest(m.body, 0); window.DBG = { lb0, lh0: lowest(m.head, 0), halfW: cd.halfW * k, k, ry: r.y };
  for (let deg = 0; deg <= 14; deg += .5) { const t = deg * Math.PI / 180, lb = lowest(m.body, t), lh = lowest(m.head, t), lift = floorY - lb;
    if (lift + lh >= pillowY - .004) return { lift, tilt: t, gapBody: 0, gapHead: lift + lh - pillowY }; }
  const t = 14 * Math.PI / 180, lift = floorY - lowest(m.body, t); return { lift, tilt: t, gapBody: 0, gapHead: lift + lowest(m.head, t) - pillowY };
};
window.shoot = async (pos, mode, look) => {
  const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight('#ffffff', '#8a7a66', 2.2));
  const cv = document.createElement('canvas'); cv.width = cv.height = 512; const g = cv.getContext('2d'); for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { g.fillStyle = (i + j) % 2 ? '#d9cfb8' : '#c8bc9f'; g.fillRect(i * 32, j * 32, 32, 32); }
  const ft = new THREE.CanvasTexture(cv); ft.colorSpace = THREE.SRGBColorSpace; ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(2, 2);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshBasicMaterial({ map: ft })); floor.rotation.x = -Math.PI / 2; sc.add(floor);
  const wood = new THREE.MeshBasicMaterial({ color: '#8a5a3a' }), sheet = new THREE.MeshBasicMaterial({ color: '#f4f1ea' }), lineM = new THREE.LineBasicMaterial({ color: '#2a1a1f' });
  const add = (w, h, d, x, y, z, m) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); sc.add(b); const e = new THREE.LineSegments(new THREE.EdgesGeometry(b.geometry), lineM); e.position.copy(b.position); sc.add(e); };
  add(2.3, .3, 1.2, 0, .15, 0, wood); add(2.2, .2, 1.1, 0, .4, 0, sheet); add(.08, 1.0, 1.2, -1.19, .5, 0, wood); if (mode === 'situp') add(.5, .05, .7, -.8, .525, 0, new THREE.MeshBasicMaterial({ color: '#dfe8f5' }));   // a flat pillow: the head rests on it
  const TOP = .5, cam = new THREE.PerspectiveCamera(34, ${W} / ${H}, .05, 100); cam.position.set(...pos); cam.lookAt(...(look || [0, .45, 0])); cam.updateMatrixWorld(true);
  const up = new THREE.Vector3(0, 1, 0), ink = new THREE.MeshBasicMaterial({ color: '#2a1a1f' }), rr = .02;
  const tube = pts => { const path = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), false, 'centripetal', .5); { const tm = new THREE.Mesh(new THREE.TubeGeometry(path, 48, rr, 10, false), ink); tm.renderOrder = 10; sc.add(tm); } const cap = new THREE.Mesh(new THREE.SphereGeometry(rr, 12, 8), ink); cap.position.copy(path.getPoint(1)); cap.renderOrder = 10; sc.add(cap); };
  const place = async (cd, hip, r, a, n, k, t0) => { const geo = new THREE.PlaneGeometry(1, 1); geo.translate(0, cd.hipV / 1500 - .5, 0);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: t0 || await tex(cd.svg), transparent: true, alphaTest: .03, side: THREE.DoubleSide })); m.matrixAutoUpdate = false;
    m.matrix.copy(new THREE.Matrix4().setPosition(hip).multiply(new THREE.Matrix4().makeBasis(r, a, n)).multiply(new THREE.Matrix4().makeScale(800 * k, 1500 * k, 1))); sc.add(m); };
  let art, stats = {};
  if (mode === 'situp') {   // Rick (Every Memory Has a Price, hospital bed): the upper body upright on the mattress, back to the headboard, legs under a blanket
    const hip = new THREE.Vector3(-.45, TOP + .02, 0), fwd = new THREE.Vector3(1, 0, 0), toCam = cam.position.clone().sub(hip).setY(0).normalize();
    const ang = Math.acos(Math.max(-1, Math.min(1, fwd.dot(toCam)))) * 180 / Math.PI, sideSign = fwd.clone().cross(toCam).y;   // + = he faces screen-left? decided by the right vector below
    const right = new THREE.Vector3(-toCam.z, 0, toCam.x), faceRight = fwd.dot(right) > 0;
    const cd = ang <= 25 ? C.front : ang <= 65 ? (faceRight ? C.q1 : C.qM) : ang <= 125 ? (faceRight ? C.side1 : C.sideM) : C.back, k = 1.7 / cd.hpx;
    const toCam3 = (v => { const f = Math.hypot(v.x, v.z), e = Math.min(Math.atan2(v.y, f), 20 * Math.PI / 180); return new THREE.Vector3(v.x / f * Math.cos(e), Math.sin(e), v.z / f * Math.cos(e)); })(cam.position.clone().sub(hip.clone().addScaledVector(up, .45))),   // lean capped at 20 deg (fix 2026-11-16: from high behind, a full lean laid the back over the pillow and the blanket edge cut through it)
     right3 = up.clone().cross(toCam3).normalize(), up3 = toCam3.clone().cross(right3).normalize();   // the card also leans to the lens (as film.js cards do), so a high camera still sees the whole body
    await place(cd, hip, right3, up3, toCam3, k); art = cd === C.front ? 'front' : cd === C.back ? 'back' : (cd === C.q1 || cd === C.qM) ? '3/4' : 'side';
    const bl = new THREE.Mesh(new THREE.BoxGeometry(1.43, .14, .95), new THREE.MeshBasicMaterial({ color: '#cfdcf0' })); bl.position.set(.11, TOP + .07, 0); sc.add(bl);   // the blanket wraps BEHIND the hips (fix 2026-11-16: its back edge in front of the hips cut across his back from behind)
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(bl.geometry), lineM); e.position.copy(bl.position); sc.add(e);
    const bump = new THREE.Mesh(new THREE.SphereGeometry(.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#c3d2ea' })); bump.scale.set(.75, .22, .42); bump.position.set(.3, TOP + .14, 0); sc.add(bump);   // the knees under the blanket
  } else {
    // body line: hips at x = .2, head toward -X (the pillow); the card turns ABOUT that line to face the lens
    const a = new THREE.Vector3(-1, 0, 0), hip0 = new THREE.Vector3(.2, TOP, 0), belly = mode === 'belly', V = mode === 'back2' ? 2 : mode === 'back3' ? 3 : 1;
    const toCam = cam.position.clone().sub(hip0).normalize(), perp = toCam.clone().addScaledVector(a, -toCam.dot(a));
    const flatTo = toCam.clone().setY(0).normalize(), endOn = Math.abs(flatTo.dot(a)) > Math.cos(30 * Math.PI / 180) && toCam.y > .25;   // camera within 30 deg of the body line (from the feet or the head) and above the bed: the body is seen end-on
    const n = endOn || perp.lengthSq() < 1e-4 ? up.clone() : perp.normalize(), above = endOn || n.dot(up) > Math.cos(28 * Math.PI / 180);   // end-on, a side drawing stands up like a sitter with legs hanging (fix 2026-11-16): it lies flat instead   // only a camera nearly overhead sees him flat; every other angle keeps the side drawing turned to us
    const r = a.clone().cross(n).normalize(), dir = r.dot(up) >= 0 ? 1 : -1;
    // on the back: front drawing from above, side drawing (face up) otherwise. On the belly (Rick's cart): back of the head from above, the face turned to us otherwise
    const cd = belly ? (above ? C.back : dir > 0 ? C.sideM : C.side1) : V === 2 ? (above ? C.frontB : dir > 0 ? C.side1B : C.sideMB) : (above ? C.front : dir > 0 ? C.side1H : C.sideMH), k = 1.7 / cd.hpx;   // belly: the profile faces DOWN into the pillow, his back up
    const t0 = await tex(cd.svg);
    // flat from above: the card lies just over the pillow. Otherwise CONTACT from the card's own pixels (old: a guessed halfW x 1.45 lift = the belly float)
    const ct = contact(cd, mask(cd, t0), r, k, above ? .012 : .004, above ? .05 : ${+(process.env.PY ?? .09)});   // side views (CB 2026-11-16 "put the body more flat to the bed. too much gap"): the round head hangs 9 cm below the body line, so it sinks 4 cm into the soft pillow and mattress instead of tilting the body 9 deg off the bed   // also from above: the card is turned a little about the body line, so half of it dipped into the pillow (face cut by the pillow)
    const h = a.clone().cross(up).normalize(), q = new THREE.Quaternion().setFromAxisAngle(h, -ct.tilt);   // head end up by the tilt, about the horizontal line across the body
    const a2 = a.clone().applyQuaternion(q), r2 = r.clone().applyQuaternion(q), n2 = n.clone().applyQuaternion(q);
    if (a2.y < 0) { q.setFromAxisAngle(h, ct.tilt); a2.copy(a).applyQuaternion(q); r2.copy(r).applyQuaternion(q); n2.copy(n).applyQuaternion(q); }
    const lift = ct.lift; stats = { lift: +lift.toFixed(3), tiltDeg: +(ct.tilt * 180 / Math.PI).toFixed(1), headOverPillow: +ct.gapHead.toFixed(3) };
    const cut = (t, v0) => { const c = document.createElement('canvas'); c.width = 800; c.height = 1500; const g2 = c.getContext('2d'); g2.drawImage(t.userData.cv, 0, 0); g2.clearRect(0, v0, 800, 1500 - v0); const t2 = new THREE.CanvasTexture(c); t2.colorSpace = THREE.SRGBColorSpace; return t2; };   // C: under the blanket only the head and shoulders are drawn
    await place(cd, hip0.clone().addScaledVector(up, lift), r2, a2, n2, k, V === 3 ? cut(t0, cd.neckV + 60) : t0);
    { // CB 2026-11-16 "heads more on pillow": the pillow sits under the head's centre, and the bed (frame, mattress, pillow) is drawn BEHIND the lying body, so the head lies ON the pillow, never cut by it
      const mh = mask(cd, t0).head, mv = mh.reduce((q, p) => q + p[1], 0) / mh.length, hx = hip0.x + a2.x * (cd.hipV - mv) * k;
      add(.62, .13, .7, hx, TOP + .065, 0, new THREE.MeshBasicMaterial({ color: '#dfe8f5' }));
      sc.children.forEach(o => { if (o.renderOrder === 0 && o !== floor) o.renderOrder = 1; });
      const clr = new THREE.Mesh(new THREE.PlaneGeometry(.001, .001), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false })); clr.renderOrder = 5; clr.frustumCulled = false; clr.position.copy(cam.position).addScaledVector(cam.getWorldDirection(new THREE.Vector3()), .2);
      clr.onBeforeRender = r => r.clearDepth(); sc.add(clr);
      if (V === 3) {   // VARIANT C (Rick, "The Burglar Who Only Moved Furniture" bed): a soft blanket mound from the chest to past the feet; head and shoulders lie out on the pillow
        const nx = hip0.x + a2.x * (cd.hipV - cd.neckV) * k, x0 = nx + 60 * k - .03, x1 = 1.08, peak = .26;   // a low soft blanket: the body under it is hidden, so it no longer has to be as tall as the side drawing   // one mound height for every camera: the lying body's side depth
        R.localClippingEnabled = true; const clip = [new THREE.Plane(new THREE.Vector3(0, 1, 0), -(TOP + .002))];   // only the part above the mattress
        const W2 = .6, prof = (w, h) => { const sh = new THREE.Shape(); sh.moveTo(-w, 0); sh.bezierCurveTo(-w, h * .75, -w * .55, h, 0, h); sh.bezierCurveTo(w * .55, h, w, h * .75, w, 0); sh.lineTo(-w, 0); return sh; };   // cross-section: a soft hump over the body, edges down to the mattress
        const slab = (w, h, len, mat) => { const g = new THREE.ExtrudeGeometry(prof(w, h), { depth: len, bevelEnabled: true, bevelThickness: .03, bevelSize: .02, bevelSegments: 4, curveSegments: 24 }); g.rotateY(Math.PI / 2); const m = new THREE.Mesh(g, mat); m.position.set(x0, TOP, 0); m.renderOrder = 20; sc.add(m); return m; };
        slab(W2, peak, x1 - x0, new THREE.MeshBasicMaterial({ color: '#cfdcf0', clippingPlanes: clip, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
        const o = slab(W2 + .012, peak + .012, x1 - x0 + .02, new THREE.MeshBasicMaterial({ color: '#2a1a1f', side: THREE.BackSide, clippingPlanes: clip })); o.position.x -= .01;   // ink outline: the same shape a little bigger, inside out
        const fold = new THREE.Mesh(new THREE.BoxGeometry(.07, .02, 2 * W2 + .02), new THREE.MeshBasicMaterial({ color: '#b9c9e4' })); } } art = belly ? (above ? 'back' : 'side, face down') : above ? 'front' : 'side';
    const hy = TOP + Math.min(lift, .12);   // the legs leave the hips at the hip height of the card, never above the body's middle
    if (V !== 3) for (const s of [-1, 1]) { const z = s * .07;
      tube(V === 2 && !above ? [[.2, TOP + lift, z], [.4, TOP + lift * .55, z * .8], [.62, TOP + .07, z * .5], [.84, TOP + .035, -z * .35], [.9, TOP + .085, -z * .7]]   // B: legs long and loose, ankles crossed
         : belly ? [[.2, hy, z], [.5, TOP + .05, z * 1.1], [.86, TOP + .035, z * 1.2], [.93, TOP + .012, z * 1.2]]     // on the belly: legs flat behind, toes down into the mattress
                 : above ? [[.2, TOP + Math.min(lift + .01, .07), z], [.52, TOP + .11, z * 1.2], [.86, TOP + .035, z * 1.4], [.9, TOP + .09, z * 1.4]]   // from above: as CB OK'd
                 : (s < 0 ? [[.2, TOP + lift, z], [.36, TOP + lift + .1, z * 2], [.48, TOP + lift + .16, z * 3], [.6, TOP + lift * .55, z * 2.6], [.7, TOP + .03, z * 2.2], [.76, TOP + .06, z * 2.3]]   /* CB 2026-11-16 "more outward leg bend": the bent knee falls out to the side */     // relaxed (CB 2026-11-16 "dont make the leg stiff"): one knee bent up,
                          : [[.2, TOP + lift, z], [.4, TOP + lift + .02, z * 1.6], [.58, TOP + .13, z * 2.8], [.78, TOP + .045, z * 2.4], [.93, TOP + .03, z * 2.2], [.97, TOP + .07, z * 2.4]])); }   // the other leg longer and softer, feet falling outward   // side views (CB 2026-11-16 "legs more high position at starting point around middle"): the legs leave the hip at the body's middle line  // on the back: knee a little up, toes up (lower 2026-11-16: from the low 3/4 the higher knee and toe read as a squiggle)
  }
  R.render(sc, cam); return { art, stats: { ...stats, dbg: window.DBG }, url: R.domElement.toDataURL('image/png') };
};
window.ready = true;</script></body></html>`;
const srv = http.createServer((q, s) => { const u = q.url.split('?')[0]; if (u === '/') { s.writeHead(200, { 'content-type': 'text/html' }); return s.end(html); } const f = path.join(HERE, u); if (!fs.existsSync(f)) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'content-type': 'text/javascript' }); fs.createReadStream(f).pipe(s); }).listen(0);
const GPU_ARGS = ['--use-angle=d3d11', '--use-gl=angle', '--enable-gpu', '--ignore-gpu-blocklist', '--force_high_performance_gpu', '--force-color-profile=srgb'];   // GPU always (render_gpu.mjs)
const b = await chromium.launch({ channel: 'chromium', args: GPU_ARGS }), pg = await b.newPage({ viewport: { width: W, height: H } });
pg.on('pageerror', e => console.log('ERR', e.message)); await pg.goto(`http://localhost:${srv.address().port}/`); await pg.waitForFunction('window.ready');
let out = '', Y = 8;
for (const [mode, label] of ROWS) { out += `<div style="position:absolute;left:8px;top:${Y}px;font:bold 22px sans-serif;color:#1d2f6f">${label}</div>`; Y += 32;
  for (const [i, cm] of CAMS.filter(c => !(SKIP[mode] || []).includes(c[0])).entries()) { const r = await pg.evaluate(([p, m, l]) => window.shoot(p, m, l), [cm[1], mode, cm[2]]); console.log(mode.padEnd(6), cm[0].padEnd(20), r.art.padEnd(16), JSON.stringify(r.stats));
    out += `<div style="position:absolute;left:${8 + i * (W + 6)}px;top:${Y}px;width:${W}px;font:15px sans-serif;color:#333;text-align:center">${cm[0]} · ${r.art}</div><img style="position:absolute;left:${8 + i * (W + 6)}px;top:${Y + 22}px" width="${W}" height="${H}" src="${r.url}">`; }
  Y += H + 32; }
const TW = 16 + CAMS.length * (W + 6); await pg.setViewportSize({ width: TW, height: Y + 6 });
await pg.setContent(`<html><body style="margin:0;background:#e4e9f1;position:relative">${out}</body></html>`); await pg.screenshot({ path: OUT, fullPage: true }); await b.close(); srv.close(); console.log('ok');

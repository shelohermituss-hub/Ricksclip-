// node test_move3d.mjs out.png <move.mjs path> [t]  - one motion-library move (one style per view: front / 34 / side) shown in a real three.js
// perspective room from five cameras. The card always faces the lens (as in film.js); the drawing is picked from where the camera stands
// (in front = front, half way round = 3/4, beside = side; facing left = the right card mirrored, as the films do). (2026-11-16, CB: "sitting on floor ... on 3 d space")
// The card stands where the FEET are; its ground line is the lowest drawn point of that view (soles toward the lens sit lowest).
import { makeChar, drawPose, G } from '../motion_styles/rig.mjs';
import { createRequire } from 'module'; import http from 'http'; import fs from 'fs'; import path from 'path'; import { fileURLToPath, pathToFileURL } from 'url';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url)), OUT = process.argv[2], MOVE = path.resolve(process.argv[3]), T = +(process.argv[4] || 1);
const MOD = await import(pathToFileURL(MOVE).href), move = MOD.views || MOD.default, L3 = MOD.legs3d || null, CH3 = MOD.chair3d || null, ch = makeChar('standard');
const top = ch.hy - 100 * ch.K, k = 1.7 / (G - top);                    // metres per rig px (standing height 1.7 m)
const cards = {};
for (const s of move.styles) { const P = s.pose(T, ch); if (L3) P.feet = []; const r = drawPose(ch, P);   // legs3d: the legs are 3D tubes on the floor, not on the card
  const low = L3 ? G : Math.max(G, ...(P.feet || []).flatMap(ft => (ft.pts || []).map(q => q[1] + (P.y ? 0 : 0) + 8)));   // lowest drawn point: legs toward the lens reach below the floor line
  const vb0 = low - 1460;
  cards[P.view] = { gl: (low - vb0) / 1500, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-400 ${vb0} 800 1500" width="800" height="1500"><defs>${r.defs}</defs>${r.svg}${P.front || ''}</svg>` }; }
const CAMS = [['front', [0, .75, 3.4]], ['front, from above', [.3, 1.7, 2.6]], ['3/4 right', [2.5, .8, 2.5]], ['side right', [3.5, .75, 0]], ['3/4 left', [-2.5, .8, 2.5]], ['side left', [-3.5, .75, 0]]];
const W = 360, H = 480;
const html = `<html><body style="margin:0"><canvas id="c" width="${W}" height="${H}"></canvas><script type="module">
import * as THREE from '/vendor/three.module.js';
const R = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: true, preserveDrawingBuffer: true }); R.setClearColor('#d9e4ef');
const C = ${JSON.stringify(cards)}, K = ${k}, L3 = ${JSON.stringify(L3)}, CH3 = ${JSON.stringify(CH3)};
const tex = s => new Promise(r => { const im = new Image(); im.onload = () => { const cv = document.createElement('canvas'); cv.width = 800; cv.height = 1500; cv.getContext('2d').drawImage(im, 0, 0); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; r(t); }; im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); });
window.shoot = async (pos) => {
  const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight('#ffffff', '#8a7a66', 2.4));
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 512; const g = cv.getContext('2d'); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#c99a63' : '#bf8f58'; g.fillRect(0, i * 64, 512, 64); g.fillStyle = '#8a5f35'; g.fillRect(0, i * 64, 512, 3); }
  const ft = new THREE.CanvasTexture(cv); ft.colorSpace = THREE.SRGBColorSpace; ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(4, 4);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshBasicMaterial({ map: ft })); floor.rotation.x = -Math.PI / 2; sc.add(floor);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(12, 4), new THREE.MeshBasicMaterial({ color: '#7fa7c9' })); wall.position.set(0, 2, -2.2); sc.add(wall);
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.1, 48), new THREE.MeshBasicMaterial({ color: '#b5463e' })); rug.rotation.x = -Math.PI / 2; rug.position.y = .004; sc.add(rug);
  const sh = new THREE.Mesh(new THREE.CircleGeometry(.5, 32), new THREE.MeshBasicMaterial({ color: '#1b0f2a', transparent: true, opacity: .25 })); sh.rotation.x = -Math.PI / 2; sh.scale.set(1, .6, 1); sh.position.set(0, .008, 0); sc.add(sh);
  const cam = new THREE.PerspectiveCamera(34, ${W} / ${H}, .05, 100); cam.position.set(...pos); cam.lookAt(0, .45, 0); cam.updateMatrixWorld(true);
  // the body faces +Z (toward the front camera); the drawing follows the angle between that and the lens
  const toCam = Math.atan2(pos[0], pos[2]) * 180 / Math.PI, a = Math.abs(toCam), view = a <= 25 ? 'front' : a <= 65 ? '34' : 'side', mirror = view !== 'front' && toCam > 0;   // camera on his right (+X) sees him facing screen-left
  const cd = C[view], geo = new THREE.PlaneGeometry(1, 1); geo.translate(0, cd.gl - .5, 0);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: await tex(cd.svg), transparent: true, alphaTest: .03, side: THREE.DoubleSide }));
  m.scale.set(800 * K * (mirror ? -1 : 1), 1500 * K, 1); m.rotation.y = Math.atan2(pos[0], pos[2]); sc.add(m);
  if (CH3) { const wood = new THREE.MeshBasicMaterial({ color: '#8a5a3a' }), lm = new THREE.LineBasicMaterial({ color: '#2a1a1f' }), S0 = CH3.seat;   // a dining chair under him
    // FIX 2026-11-16 (CB: "why is the arm inside a chair"): the flat card stands in the middle of the chair, so the near half of the 3D back rest cut through his arm and back.
    // The seat he sits on is always BEHIND him (his arms, thighs and shins hang in front of it), so the chair writes no depth and is drawn first, far parts before near parts; the card paints over it.
    const parts = [], box = (w, h, d, x, y, z) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color: '#8a5a3a', depthWrite: false })); b.position.set(x, y, z); sc.add(b); const e = new THREE.LineSegments(new THREE.EdgesGeometry(b.geometry), new THREE.LineBasicMaterial({ color: '#2a1a1f', depthWrite: false })); e.position.copy(b.position); sc.add(e); parts.push([b, e]); };
    box(.44, .05, .34, 0, S0 - .025, .05); for (const [x, z] of [[-.19, -.1], [.19, -.1], [-.19, .2], [.19, .2]]) box(.04, S0 - .05, .04, x, (S0 - .05) / 2, z); box(.44, .42, .04, 0, S0 + .21, -.13);
    parts.sort((p, q) => q[0].position.distanceTo(cam.position) - p[0].position.distanceTo(cam.position)).forEach(([b, e], i) => { b.renderOrder = 10 + 2 * i; e.renderOrder = 11 + 2 * i;   /* after the floor and walls (order 0), before the transparent card */ }); }
  if (L3) { const ink = new THREE.MeshBasicMaterial({ color: '#2a1a1f' });   // two 3D ink legs on the floor, true perspective from every camera
    for (const s of [-1, 1]) { const path = new THREE.CatmullRomCurve3(L3.pts.map(p => new THREE.Vector3(s * p[0], p[1], p[2])), false, 'centripetal', .5);
      sc.add(new THREE.Mesh(new THREE.TubeGeometry(path, 48, L3.r, 10, false), ink)); const cap = new THREE.Mesh(new THREE.SphereGeometry(L3.r, 12, 8), ink); cap.position.copy(path.getPoint(1)); sc.add(cap); } }
  R.render(sc, cam); return { view, mirror, url: R.domElement.toDataURL('image/png') };
};
window.ready = true;</script></body></html>`;
const srv = http.createServer((q, s) => { const u = q.url.split('?')[0]; if (u === '/') { s.writeHead(200, { 'content-type': 'text/html' }); return s.end(html); } const f = path.join(HERE, u); if (!fs.existsSync(f)) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'content-type': 'text/javascript' }); fs.createReadStream(f).pipe(s); }).listen(0);
const GPU_ARGS = ['--use-angle=d3d11', '--use-gl=angle', '--enable-gpu', '--ignore-gpu-blocklist', '--force_high_performance_gpu', '--force-color-profile=srgb'];   // GPU always (render_gpu.mjs)
const b = await chromium.launch({ channel: 'chromium', args: GPU_ARGS }), pg = await b.newPage({ viewport: { width: W, height: H } });
pg.on('pageerror', e => console.log('ERR', e.message)); await pg.goto(`http://localhost:${srv.address().port}/`); await pg.waitForFunction('window.ready');
let out = '';
for (const [i, cm] of CAMS.entries()) { const r = await pg.evaluate(p => window.shoot(p), cm[1]);
  out += `<div style="position:absolute;left:${8 + i * (W + 6)}px;top:8px;width:${W}px;font:bold 17px sans-serif;color:#1d2f6f;text-align:center">${cm[0]} camera · drawing ${r.view === '34' ? '3/4' : r.view}${r.mirror ? ' (mirrored)' : ''}</div><img style="position:absolute;left:${8 + i * (W + 6)}px;top:34px" width="${W}" height="${H}" src="${r.url}">`; }
const TW = 16 + CAMS.length * (W + 6); await pg.setViewportSize({ width: TW, height: H + 44 });
await pg.setContent(`<html><body style="margin:0;background:#e4e9f1;position:relative">${out}</body></html>`); await pg.screenshot({ path: OUT }); await b.close(); srv.close(); console.log('ok');

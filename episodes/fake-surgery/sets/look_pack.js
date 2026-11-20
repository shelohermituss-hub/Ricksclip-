// LOOK PACK of "The Surgery Where the Surgeon Did Nothing" (owner: look helper phase A 2026-11-16, then the lead). Docs: look_pack_README.md.
// ONE set of surfaces for the whole mid-1990s Houston hospital, so OR 3, the corridor, the office, the stairwell and the waiting room rhyme.
// Every surface is in REAL metres: material.userData.k3scale = metres per texture repeat, so the kit3d finish pass (look3d.mjs boxUV) gives every
// mesh metre UVs on its own (call LP.finishUV(THREE, scene) at the end of build() only if the set uses no kit3d call at all).
// Pattern: monopoly-escape/sets/look_pack.js (toon colour + normal map, world-space anti-tiling tint) + elevator-mirror/sets/look_pack.js (API M.<name>, LP.uv).
// Shaders: only the anti-tiling tint (no division, no pow, clamped) and the heat-haze UV wobble of the Texas sky (sin only, clamped UV). No NaN risk.
// THE ONE RED (LOOK_BIBLE): nothing in this pack is within 12 deg of #e01e2a with sat > .5; the orange chair is hue 34, the coral sky hue 18-30 kept under sat .5 near 6-12 deg.
export const LP_VERSION = '2026-11-16a';
const CACHE = new Map();
const rngf = seed => { let a = (seed >>> 0) || 1; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const H2 = (x, y, s) => { let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 982451653)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
const wr = (i, P) => ((i % P) + P) % P;
function vn(x, y, P, s) { const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = H2(wr(xi, P), wr(yi, P), s), b = H2(wr(xi + 1, P), wr(yi, P), s), c = H2(wr(xi, P), wr(yi + 1, P), s), d = H2(wr(xi + 1, P), wr(yi + 1, P), s); return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy; }
function fbm(u, v, P, oct, s) { let sum = 0, amp = .5, n = 0, p = P; for (let o = 0; o < oct; o++) { sum += amp * vn(u * p, v * p, p, s + o * 13); n += amp; amp *= .5; p *= 2; } return sum / n; }
const hexA = h => { const n = parseInt(h.replace('#', ''), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const shade = (h, k) => { const c = hexA(h).map(v => Math.max(0, Math.min(255, Math.round(v * k)))); return '#' + c.map(v => v.toString(16).padStart(2, '0')).join(''); };
let T3 = null;

// ---------- texture plumbing: a colour canvas + a height canvas (grey, 128 = flat) -> map + normal map ----------
function surface(THREE, key, N, S, paint, o = {}) {
  if (CACHE.has(key)) return CACHE.get(key);
  const mk = () => { const c = document.createElement('canvas'); c.width = N; c.height = o.H || N; return c; }, cc = mk(), hc = mk(), g = cc.getContext('2d'), h = hc.getContext('2d'), Hh = o.H || N;
  h.fillStyle = '#808080'; h.fillRect(0, 0, N, Hh);
  paint(g, h, N, Hh, rngf((key.length * 7919) ^ 0x51ed), N / S);
  // seamless fbm mottling + fine grain on the colour (o.mot: amount, o.motP: period, o.grain)
  if (o.mot || o.grain) { const im = g.getImageData(0, 0, N, Hh), d = im.data, R = rngf(31 + key.length);
    for (let y = 0; y < Hh; y++) for (let x = 0; x < N; x++) { const i = (y * N + x) * 4, n = o.mot ? fbm(x / N * (o.aniso || 1), y / Hh, o.motP || 4, 4, 7 + key.length) * 2 - 1 : 0, k = 1 + n * (o.mot || 0) + (R() - .5) * (o.grain || 0);
      d[i] = Math.min(255, d[i] * k); d[i + 1] = Math.min(255, d[i + 1] * k); d[i + 2] = Math.min(255, d[i + 2] * k); }
    g.putImageData(im, 0, 0); }
  const map = new THREE.CanvasTexture(cc); map.colorSpace = THREE.SRGBColorSpace; map.wrapS = map.wrapT = THREE.RepeatWrapping; map.anisotropy = 8;
  // normal map from the height canvas (wrap-around differences; one sqrt with a +1 floor: never zero)
  const hd = h.getImageData(0, 0, N, Hh).data, nc = mk(), ng = nc.getContext('2d'), ni = ng.createImageData(N, Hh), nd = ni.data, st = o.nstr ?? 3, at = (x, y) => hd[(wr(y, Hh) * N + wr(x, N)) * 4] / 255;
  for (let y = 0; y < Hh; y++) for (let x = 0; x < N; x++) { const nx = (at(x - 1, y) - at(x + 1, y)) * st, ny = (at(x, y + 1) - at(x, y - 1)) * st, q = 1 / Math.sqrt(nx * nx + ny * ny + 1), i = (y * N + x) * 4;
    nd[i] = (nx * q * .5 + .5) * 255; nd[i + 1] = (ny * q * .5 + .5) * 255; nd[i + 2] = (q * .5 + .5) * 255; nd[i + 3] = 255; }
  ng.putImageData(ni, 0, 0); const normal = new THREE.CanvasTexture(nc); normal.wrapS = normal.wrapT = THREE.RepeatWrapping; normal.anisotropy = 8;
  const out = { map, normal, S, canvas: cc }; CACHE.set(key, out); return out; }

// world-space anti-tiling tint (value noise in GLSL; no division, no pow; clamped)
const GLSL_N3 = `float lpH(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float lpN(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(mix(mix(lpH(i), lpH(i + vec3(1,0,0)), f.x), mix(lpH(i + vec3(0,1,0)), lpH(i + vec3(1,1,0)), f.x), f.y), mix(mix(lpH(i + vec3(0,0,1)), lpH(i + vec3(1,0,1)), f.x), mix(lpH(i + vec3(0,1,1)), lpH(i + vec3(1,1,1)), f.x), f.y), f.z); }`;
export function antiTile(mat, amt = .12, freq = .35) {
  if (!amt) return mat;
  mat.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vLpW;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvLpW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vLpW;\n' + GLSL_N3)
      .replace('#include <map_fragment>', `#include <map_fragment>
        float lpA = lpN(vLpW * ${freq.toFixed(4)}) * 2. - 1., lpB = lpN(vLpW * ${(freq * 3.3).toFixed(4)} + 7.) * 2. - 1.;
        diffuseColor.rgb *= clamp(1. + ${amt.toFixed(3)} * lpA + ${(amt * .5).toFixed(3)} * lpB, .6, 1.4);`); };
  mat.customProgramCacheKey = () => 'lpAT' + amt + '_' + freq; return mat; }
function gradMap(THREE) { if (CACHE.has('grad')) return CACHE.get('grad'); const t = new THREE.DataTexture(new Uint8Array([120, 120, 120, 255, 195, 195, 195, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.LinearFilter; t.needsUpdate = true; CACHE.set('grad', t); return t; }
const GLOSS = [];   // glazed / lacquered / plastic materials: they take the kit's PMREM env map from a steel material on the first update (LP.sync)
function toonSurf(THREE, s, kind, o = {}) { const m = new THREE.MeshToonMaterial({ color: o.color || '#ffffff', map: s.map, normalMap: s.normal, normalScale: new THREE.Vector2(o.normal ?? 1, o.normal ?? 1), gradientMap: gradMap(THREE), side: o.side || THREE.FrontSide });
  m.userData.k3scale = s.S; m.userData.k3kind = 'lp_' + kind; antiTile(m, o.anti ?? .12, o.freq ?? .35); return m; }
function glossSurf(THREE, s, kind, o = {}) { const m = new THREE.MeshStandardMaterial({ color: o.color || '#ffffff', map: s.map, normalMap: s.normal, normalScale: new THREE.Vector2(o.normal ?? 1, o.normal ?? 1), roughness: o.rough ?? .3, metalness: o.metal ?? 0, envMapIntensity: o.env ?? .45 });
  m.userData.k3scale = s.S; m.userData.k3kind = 'lp_' + kind; antiTile(m, o.anti ?? .1, o.freq ?? .35); GLOSS.push(m); return m; }

// ---------- 1 SEA-GREEN GLAZED TILE 15 cm (OR walls, corridor + stairwell dado): grout, per-tile tone, glaze pooling at the edges, fine crazing ----------
function tileTex(THREE, col = '#4fa59a', grout = '#c9d9d2', size = .15, seed = 1) {
  const n = 8, S = n * size;
  return surface(THREE, 'tile|' + col + grout + size + seed, 1024, S, (g, h, N, Hh, R) => { const s = N / n, gw = Math.max(3, Math.round(s * .045));
    g.fillStyle = grout; g.fillRect(0, 0, N, N); h.fillStyle = '#3a3a3a'; h.fillRect(0, 0, N, N);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const x = i * s + gw / 2, y = j * s + gw / 2, w = s - gw, tk = .9 + R() * .16 + (H2(i, j, seed) < .08 ? -.12 : 0);
      const gr = g.createLinearGradient(x, y, x + w, y + w); gr.addColorStop(0, shade(col, tk * 1.06)); gr.addColorStop(.55, shade(col, tk)); gr.addColorStop(1, shade(col, tk * .9)); g.fillStyle = gr; g.fillRect(x, y, w, w);
      g.strokeStyle = shade(col, tk * .78); g.lineWidth = 3; g.strokeRect(x + 2, y + 2, w - 4, w - 4);                              // glaze pools darker at the rounded edge
      g.fillStyle = 'rgba(255,255,255,.16)'; g.fillRect(x + w * .08, y + w * .1, w * .5, 3);                                        // glaze sheen streak
      if (R() < .35) { g.strokeStyle = 'rgba(30,60,55,.16)'; g.lineWidth = 1; g.beginPath(); let cx = x + R() * w, cy = y + R() * w; g.moveTo(cx, cy); for (let k = 0; k < 6; k++) { cx += (R() - .5) * w * .3; cy += (R() - .5) * w * .3; g.lineTo(cx, cy); } g.stroke(); }   // crazing
      if (R() < .06) { g.fillStyle = 'rgba(240,248,244,.55)'; g.beginPath(); g.arc(x + (R() < .5 ? 3 : w - 3), y + (R() < .5 ? 3 : w - 3), 3 + R() * 4, 0, 7); g.fill(); }   // chipped corner
      const hg = h.createRadialGradient(x + w / 2, y + w / 2, w * .2, x + w / 2, y + w / 2, w * .72); hg.addColorStop(0, '#b0b0b0'); hg.addColorStop(.8, '#a4a4a4'); hg.addColorStop(1, '#6a6a6a'); h.fillStyle = hg; h.fillRect(x, y, w, w); }
    for (let k = 0; k < 900; k++) { g.fillStyle = `rgba(60,70,62,${.05 + R() * .08})`; g.fillRect(R() * N, R() * N, 1.5, 1.5); }          // grime dots in the grout
  }, { mot: .05, motP: 3, grain: .03, nstr: 4 }); }

// ---------- 2 DARK TEAL CEILING PANELS 60 cm with the steel T-bar grid, fissured acoustic pinholes ----------
function ceilTex(THREE, col = '#123a36') { return surface(THREE, 'ceil|' + col, 512, 1.2, (g, h, N, Hh, R) => { const s = N / 2;
  g.fillStyle = col; g.fillRect(0, 0, N, N);
  for (let k = 0; k < 5200; k++) { const x = R() * N, y = R() * N; g.fillStyle = R() < .6 ? shade(col, .62) : shade(col, 1.35); g.fillRect(x, y, 1.5 + R() * 1.5, 1.2); h.fillStyle = '#5a5a5a'; h.fillRect(x, y, 1.5, 1.2); }
  for (let k = 0; k < 60; k++) { g.strokeStyle = shade(col, .7); g.lineWidth = 1; g.beginPath(); let x = R() * N, y = R() * N; g.moveTo(x, y); for (let q = 0; q < 4; q++) { x += (R() - .5) * 18; y += (R() - .5) * 18; g.lineTo(x, y); } g.stroke(); }   // fissures
  if (true) { g.fillStyle = 'rgba(150,120,70,.18)'; g.beginPath(); g.ellipse(N * .72, N * .3, 40, 26, .4, 0, 7); g.fill(); }   // an old water stain on one panel
  g.fillStyle = '#9aa8a8'; h.fillStyle = '#d0d0d0'; for (let i = 0; i <= 2; i++) { g.fillRect(i * s - 5, 0, 10, N); g.fillRect(0, i * s - 5, N, 10); h.fillRect(i * s - 5, 0, 10, N); h.fillRect(0, i * s - 5, N, 10); }
  g.fillStyle = 'rgba(255,255,255,.35)'; for (let i = 0; i <= 2; i++) { g.fillRect(i * s - 5, 0, 2, N); g.fillRect(0, i * s - 5, N, 2); }
}, { mot: .08, motP: 3, grain: .04, nstr: 2.5 }); }

// ---------- 3 SPECKLED SHEET VINYL (OR): chip flecks in three sizes, a welded seam every 2 m, scuffs and trolley tracks ----------
function vinylTex(THREE, col = '#7f9a90') { return surface(THREE, 'vinyl|' + col, 1024, 2.0, (g, h, N, Hh, R) => {
  g.fillStyle = col; g.fillRect(0, 0, N, N); const fl = [shade(col, .7), shade(col, 1.3), '#d8e4de', '#5a6e66', '#c8b890'];
  for (let k = 0; k < 16000; k++) { const x = R() * N, y = R() * N, s = R() < .85 ? 1.5 + R() * 2 : 3 + R() * 4; g.fillStyle = fl[Math.floor(R() * fl.length)]; g.save(); g.translate(x, y); g.rotate(R() * 3); g.fillRect(-s / 2, -s / 3, s, s * .66); g.restore(); }
  g.fillStyle = shade(col, .72); g.fillRect(0, N / 2 - 1.5, N, 3); h.fillStyle = '#606060'; h.fillRect(0, N / 2 - 1.5, N, 3);   // heat-welded seam
  for (let k = 0; k < 26; k++) { g.strokeStyle = `rgba(40,40,40,${.05 + R() * .1})`; g.lineWidth = 2 + R() * 5; g.beginPath(); const x = R() * N, y = R() * N, a = R() * 6; g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * 40, y + Math.sin(a) * 40, x + Math.cos(a + .4) * 90, y + Math.sin(a + .4) * 90); g.stroke(); }   // heel scuffs
  for (const yy of [N * .18, N * .23]) { g.strokeStyle = 'rgba(30,40,36,.07)'; g.lineWidth = 7; g.beginPath(); g.moveTo(0, yy); g.bezierCurveTo(N * .3, yy + 30, N * .6, yy - 20, N, yy); g.stroke(); }   // trolley wheel tracks
}, { mot: .07, motP: 3, grain: .05, nstr: 1.5 }); }

// ---------- 4 SPECKLED TERRAZZO (corridor): marble chips in a cream-grey matrix, brass divider strips every 1.2 m, polish wear down the middle ----------
function terrazzoTex(THREE, col = '#cfc6b0') { return surface(THREE, 'terrazzo|' + col, 1024, 1.2, (g, h, N, Hh, R) => {
  g.fillStyle = col; g.fillRect(0, 0, N, N); const ch = ['#f4efe4', '#8a8478', '#5a8a80', '#b8a888', '#3a3a3a', '#d8c8a0', '#7aa89c'];
  for (let k = 0; k < 9000; k++) { const x = R() * N, y = R() * N, s = R() < .8 ? 2 + R() * 4 : 6 + R() * 10; g.fillStyle = ch[Math.floor(R() * ch.length)]; g.beginPath(); for (let q = 0; q < 5; q++) { const a = q * 1.256 + R() * .6, r = s * (.5 + R() * .5); q ? g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : g.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } g.fill(); }
  g.fillStyle = '#c09a4a'; g.fillRect(0, 0, 5, N); g.fillRect(0, 0, N, 5); h.fillStyle = '#9a9a9a'; h.fillRect(0, 0, 5, N); h.fillRect(0, 0, N, 5);   // brass strips
}, { mot: .06, motP: 2, grain: .04, nstr: 1.2 }); }

// ---------- 5 PAINTED PLASTER butter-cream (roller stipple, patched spots, faint scuffs at chair height) ----------
function plasterTex(THREE, col = '#f3e2a6') { return surface(THREE, 'plaster|' + col, 512, 2.0, (g, h, N, Hh, R) => {
  g.fillStyle = col; g.fillRect(0, 0, N, N);
  for (let k = 0; k < 7000; k++) { const x = R() * N, y = R() * N, v = R(); g.fillStyle = v < .5 ? shade(col, .94) : shade(col, 1.04); g.fillRect(x, y, 2, 2); h.fillStyle = v < .5 ? '#747474' : '#8c8c8c'; h.fillRect(x, y, 2, 2); }
  for (let k = 0; k < 3; k++) { g.fillStyle = shade(col, 1.03); g.beginPath(); g.ellipse(R() * N, R() * N, 20 + R() * 30, 12 + R() * 20, R() * 3, 0, 7); g.fill(); }   // patched + repainted spots
  for (let k = 0; k < 8; k++) { g.strokeStyle = 'rgba(90,70,40,.08)'; g.lineWidth = 3; const x = R() * N, y = N * (.55 + R() * .1); g.beginPath(); g.moveTo(x, y); g.lineTo(x + 20 + R() * 40, y + (R() - .5) * 6); g.stroke(); }
}, { mot: .05, motP: 3, grain: .03, nstr: 1.2 }); }

// ---------- 6 PAINTED CINDER BLOCK 40 x 20 cm (stairwell above the dado): stretcher bond, struck joints, pores under the paint ----------
function blockTex(THREE, col = '#e9e0c4') { return surface(THREE, 'block|' + col, 512, 1.6, (g, h, N, Hh, R) => { const bw = N / 4, bh = N / 8, j = 4;
  g.fillStyle = shade(col, .82); g.fillRect(0, 0, N, N); h.fillStyle = '#505050'; h.fillRect(0, 0, N, N);
  for (let r = 0; r < 8; r++) for (let c = -1; c < 5; c++) { const x = c * bw + (r % 2) * bw / 2 + j / 2, y = r * bh + j / 2, k = .96 + R() * .07; g.fillStyle = shade(col, k); g.fillRect(x, y, bw - j, bh - j); h.fillStyle = '#9a9a9a'; h.fillRect(x, y, bw - j, bh - j);
    for (let p = 0; p < 40; p++) { const px = x + R() * (bw - j), py = y + R() * (bh - j); g.fillStyle = shade(col, .86); g.fillRect(px, py, 2, 2); h.fillStyle = '#787878'; h.fillRect(px, py, 2, 2); } }
}, { mot: .05, motP: 2, grain: .04, nstr: 2.5 }); }

// ---------- 7 WOOD VENEER PANELLING (office wall): 30 cm vertical boards with V-grooves, walnut-tone flat-cut figure; 8 DESK WOOD (oak, straight grain) ----------
function woodField(g, N, Hh, base, P, seed, cathedral) { const im = g.getImageData(0, 0, N, Hh), d = im.data, c = hexA(base);
  for (let y = 0; y < Hh; y++) for (let x = 0; x < N; x++) { const u = x / N, v = y / Hh, w = fbm(u, v * .5, 3, 3, seed) * 3, ph = cathedral ? (u * P + Math.abs(Math.sin(v * 6.283 * 2 + w)) * 1.2 + w) : (u * P + w * 1.5), gr = Math.sin(ph * Math.PI * 2) * .5 + .5, k = .8 + gr * .16 + (fbm(u * 4, v, 4, 2, seed + 9) - .5) * .2, i = (y * N + x) * 4;
    d[i] = c[0] * k; d[i + 1] = c[1] * k; d[i + 2] = c[2] * k * (.95 + gr * .06); d[i + 3] = 255; }
  g.putImageData(im, 0, 0); }
function veneerTex(THREE, col = '#8a5a32') { return surface(THREE, 'veneer|' + col, 512, 1.2, (g, h, N, Hh, R) => {   // grooves run up the wall (v = height on walls)
  woodField(g, N, Hh, col, 14, 5, true); const bw = N / 4;
  for (let i = 0; i < 4; i++) { const tk = .9 + R() * .18; g.fillStyle = `rgba(${tk > 1 ? '255,230,200' : '40,20,8'},${Math.abs(tk - 1) * .6})`; g.fillRect(i * bw, 0, bw, Hh); }
  for (let i = 0; i < 4; i++) { const x = i * bw; g.fillStyle = '#2a160a'; g.fillRect(x - 2, 0, 4, Hh); g.fillStyle = 'rgba(255,220,170,.25)'; g.fillRect(x + 2, 0, 1.5, Hh); h.fillStyle = '#303030'; h.fillRect(x - 3, 0, 6, Hh); }
}, { grain: .05, nstr: 3 }); }
function deskTex(THREE, col = '#a8743e') { return surface(THREE, 'desk|' + col, 512, 1.0, (g, h, N, Hh, R) => { woodField(g, N, Hh, col, 22, 12, false);
  for (let k = 0; k < 5; k++) { g.strokeStyle = 'rgba(70,40,15,.25)'; g.lineWidth = 2; g.beginPath(); g.arc(R() * N, R() * N, 22 + R() * 6, 0, 7); g.stroke(); }   // coffee-cup rings
  for (let k = 0; k < 30; k++) { g.strokeStyle = 'rgba(255,240,210,.18)'; g.lineWidth = 1; const x = R() * N, y = R() * N; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 30 + R() * 60, y + (R() - .5) * 8); g.stroke(); }   // fine scratches
}, { grain: .05, nstr: 1.5 }); }

// ---------- 9 OLIVE-GREEN BAKED STEEL PAINT (lockers, file cabinets): orange-peel, edge chips to grey primer, scuffs; 1.0 m ----------
function lockerTex(THREE, col = '#6a7a4a') { return surface(THREE, 'locker|' + col, 512, 1.0, (g, h, N, Hh, R) => {
  g.fillStyle = col; g.fillRect(0, 0, N, N);
  for (let k = 0; k < 9000; k++) { const x = R() * N, y = R() * N, v = R(); h.fillStyle = v < .5 ? '#787878' : '#888888'; h.beginPath(); h.arc(x, y, 1.5 + R() * 2, 0, 7); h.fill(); }   // orange peel
  for (let k = 0; k < 40; k++) { const x = R() * N, y = R() * N; g.fillStyle = R() < .6 ? '#9a9c94' : '#3a3c30'; g.beginPath(); g.ellipse(x, y, 1 + R() * 3, .8 + R() * 2, R() * 3, 0, 7); g.fill(); }   // chips: primer grey, dark steel
  for (let k = 0; k < 18; k++) { g.strokeStyle = 'rgba(220,225,200,.18)'; g.lineWidth = 1; const x = R() * N, y = R() * N; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R() - .5) * 60, y + (R() - .5) * 20); g.stroke(); }   // key + boot scratches
}, { mot: .06, motP: 3, grain: .02, nstr: 1 }); }

// ---------- 10 MOULDED PLASTIC (chairs: orange-yellow, teal): fine stipple + mould flow lines ----------
function plasticTex(THREE, col) { return surface(THREE, 'plastic|' + col, 256, .5, (g, h, N, Hh, R) => { g.fillStyle = col; g.fillRect(0, 0, N, N);
  for (let k = 0; k < 4000; k++) { const x = R() * N, y = R() * N; h.fillStyle = R() < .5 ? '#767676' : '#8a8a8a'; h.fillRect(x, y, 1.5, 1.5); }
  for (let k = 0; k < 6; k++) { g.strokeStyle = `rgba(255,255,255,.06)`; g.lineWidth = 4; g.beginPath(); g.arc(N / 2, N * 1.2, N * (.4 + k * .12), 3.6, 5.8); g.stroke(); } }, { mot: .04, motP: 2, nstr: .8 }); }

// ---------- 11 CARPET TILE 50 cm (waiting room): alternating pile direction (quarter-turn), tweed flecks, a worn path, a coffee spot ----------
function carpetTex(THREE, col = '#3a5a78') { return surface(THREE, 'carpet|' + col, 512, 1.0, (g, h, N, Hh, R) => { const s = N / 2;
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { g.fillStyle = shade(col, (i + j) % 2 ? .93 : 1.04); g.fillRect(i * s, j * s, s, s);
    for (let k = 0; k < 900; k++) { const vert = (i + j) % 2, x = i * s + R() * s, y = j * s + R() * s; g.fillStyle = shade(col, .8 + R() * .4); g.fillRect(x, y, vert ? 1.2 : 4, vert ? 4 : 1.2); } }
  const fl = ['#c8a050', '#5aa0a0', '#d8d0c0', '#1e2e40']; for (let k = 0; k < 2400; k++) { g.fillStyle = fl[Math.floor(R() * 4)]; g.fillRect(R() * N, R() * N, 1.5, 1.5); }
  g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; g.strokeRect(0, 0, s, s); g.strokeRect(s, s, s, s); g.strokeRect(s, 0, s, s); g.strokeRect(0, s, s, s);
  g.fillStyle = 'rgba(110,80,40,.18)'; g.beginPath(); g.ellipse(N * .3, N * .7, 18, 12, .3, 0, 7); g.fill();
  for (let k = 0; k < 6000; k++) { const x = R() * N, y = R() * N; h.fillStyle = R() < .5 ? '#6a6a6a' : '#969696'; h.fillRect(x, y, 2, 2); }
}, { mot: .08, motP: 3, grain: .12, nstr: 1.5 }); }

// ---------- 12 BLUE DRAPE CLOTH (non-woven surgical drape): fine crepe weave, fold creases from the pack, a printed hem ----------
function drapeTex(THREE, col = '#2f5fa8') { return surface(THREE, 'drape|' + col, 512, .5, (g, h, N, Hh, R) => { g.fillStyle = col; g.fillRect(0, 0, N, N);
  for (let y = 0; y < N; y += 2) { g.fillStyle = `rgba(255,255,255,${.02 + (y * 13 % 7) / 140})`; g.fillRect(0, y, N, 1); } for (let x = 0; x < N; x += 3) { g.fillStyle = 'rgba(0,10,40,.05)'; g.fillRect(x, 0, 1, N); }
  for (let k = 0; k < 3000; k++) { const x = R() * N, y = R() * N; h.fillStyle = R() < .5 ? '#727272' : '#8e8e8e'; h.fillRect(x, y, 2, 2); }
  for (const f of [N * .25, N * .75]) { const gr = g.createLinearGradient(f - 10, 0, f + 10, 0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(.5, 'rgba(10,20,60,.28)'); gr.addColorStop(1, 'rgba(255,255,255,.06)'); g.fillStyle = gr; g.fillRect(f - 10, 0, 20, N); h.fillStyle = '#5a5a5a'; h.fillRect(f - 1, 0, 2, N); }   // pack fold creases
}, { mot: .07, motP: 2, grain: .05, nstr: 1.5 }); }

// ---------- 13 KIDS' RUG (waiting-room corner): a 1990s play-mat town: road loop with dashes, ABC squares, a pond, little houses; one canvas per size ----------
function rugTex(THREE, w = 1.6, l = 1.2) { return surface(THREE, 'rug|' + w + 'x' + l, 512, w, (g, h, N, Hh, R) => {
  const W = N, H = Hh; g.fillStyle = '#5ab0d8'; g.fillRect(0, 0, W, H); g.fillStyle = '#ffd040'; g.fillRect(0, 0, W, 18); g.fillRect(0, H - 18, W, 18); g.fillRect(0, 0, 18, H); g.fillRect(W - 18, 0, 18, H);
  g.fillStyle = '#6ac060'; g.fillRect(30, 30, W - 60, H - 60); g.strokeStyle = '#4a4e58'; g.lineWidth = 34; g.strokeRect(70, 70, W - 140, H - 140); g.strokeStyle = '#ffffff'; g.lineWidth = 3; g.setLineDash([14, 12]); g.strokeRect(70, 70, W - 140, H - 140); g.setLineDash([]);
  g.fillStyle = '#4aa0e0'; g.beginPath(); g.ellipse(W * .62, H * .55, 50, 34, .2, 0, 7); g.fill();
  const L = ['A', 'B', 'C', '1', '2', '3'], cs = ['#f09a2a', '#8a5ac8', '#2aa0a0', '#ffd040', '#3a7ad8', '#f0c0d8']; g.font = 'bold 30px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
  L.forEach((c, i) => { const x = 120 + i * 48, y = H * .3; g.fillStyle = cs[i]; g.fillRect(x - 20, y - 20, 40, 40); g.fillStyle = '#1e2a5a'; g.fillText(c, x, y + 2); });
  for (let i = 0; i < 4; i++) { const x = 130 + i * 62, y = H * .62; g.fillStyle = ['#f09a2a', '#ffd040', '#8a5ac8', '#f0f0e0'][i]; g.fillRect(x - 16, y - 10, 32, 26); g.fillStyle = '#1e2a5a'; g.beginPath(); g.moveTo(x - 20, y - 10); g.lineTo(x, y - 28); g.lineTo(x + 20, y - 10); g.fill(); }
  const im = g.getImageData(0, 0, W, H), d = im.data, Rr = rngf(9); for (let i = 0; i < d.length; i += 4) { const k = .9 + Rr() * .2; d[i] *= k; d[i + 1] *= k; d[i + 2] *= k; } g.putImageData(im, 0, 0);
  for (let k = 0; k < 6000; k++) { h.fillStyle = R() < .5 ? '#6a6a6a' : '#969696'; h.fillRect(R() * W, R() * H, 2, 2); }
}, { H: Math.round(512 * l / w), nstr: 1.5 }); }

// ---------- SKIES behind the windows (backdrop planes, unlit, no shadows): texas | night | coral | overcast ----------
// LP.sky(THREE, ctx, kind, { w, h, at:[x,y,z], yaw, parent }) -> { mesh, update(t) }. The plane faces -Y (toward the room) unless yaw is given.
// The far layers are the background-painter's: this is the stand-in so the light kinds can be measured; replace the canvas, keep the API.
function skyCanvas(kind, W = 1024, H = 640) { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), R = rngf(kind.length * 31 + 7), hz = H * .66;
  const grad = (stops) => { const gr = g.createLinearGradient(0, 0, 0, hz); stops.forEach(([t, col]) => gr.addColorStop(t, col)); g.fillStyle = gr; g.fillRect(0, 0, W, hz); };
  const skyline = (col, top, n, lit) => { let x = 0; while (x < W) { const w = 18 + R() * 60, hgt = top * (.3 + R() * .9); g.fillStyle = col; g.fillRect(x, hz - hgt, w, hgt + 2); if (lit) for (let k = 0; k < hgt * w / 140; k++) { if (R() < lit) { g.fillStyle = R() < .7 ? '#ffd890' : '#bfe0ff'; g.fillRect(x + 3 + R() * (w - 6), hz - hgt + 4 + R() * (hgt - 8), 2.5, 3); } } x += w + R() * 10; } };
  if (kind === 'texas') { grad([[0, '#d8e6ee'], [.5, '#f4f2e8'], [1, '#fffaf0']]); const sg = g.createRadialGradient(W * .78, hz * .2, 4, W * .78, hz * .2, 260); sg.addColorStop(0, 'rgba(255,255,250,1)'); sg.addColorStop(1, 'rgba(255,255,240,0)'); g.fillStyle = sg; g.fillRect(0, 0, W, hz);
    skyline('rgba(170,180,186,.7)', 140, 0, 0); g.fillStyle = 'rgba(244,240,228,.55)'; g.fillRect(0, hz - 150, W, 150);                        // far downtown in heat haze
    g.fillStyle = '#d8ccb0'; g.fillRect(0, hz, W, H - hz); for (let k = 0; k < 300; k++) { g.fillStyle = R() < .5 ? '#c8bc9c' : '#e4dac0'; g.fillRect(R() * W, hz + R() * (H - hz), 6 + R() * 20, 2); }   // dry lots + parking
    const fy = hz + 28; g.fillStyle = '#b8b4aa'; g.fillRect(0, fy, W, 22); g.fillStyle = '#8a867c'; g.fillRect(0, fy + 22, W, 6); for (let x = 20; x < W; x += 90) { g.fillStyle = '#a8a49a'; g.fillRect(x, fy + 28, 10, 40); }   // the elevated freeway on piers
    for (let x = 0; x < W; x += 46) { g.fillStyle = '#7a786e'; g.fillRect(x, fy - 26, 2, 26); g.fillRect(x - 6, fy - 26, 12, 2); }   // lamp posts
    const cars = ['#f4f4f0', '#3a6aa8', '#e8c040', '#2a2a2a', '#9aa0a8', '#2a8a5a']; for (let k = 0; k < 34; k++) { g.fillStyle = cars[Math.floor(R() * 6)]; g.fillRect(R() * W, fy + 4 + (R() < .5 ? 0 : 8), 12, 6); }   // traffic
    g.fillStyle = '#8aa0a0'; g.fillRect(W * .2, hz - 70, 6, 70); g.beginPath(); g.ellipse(W * .2 + 3, hz - 78, 22, 14, 0, 0, 7); g.fill();   // water tower (no name)
    g.fillStyle = '#f0ece0'; g.fillRect(W * .55, hz - 40, 70, 30); g.fillStyle = '#7a786e'; g.fillRect(W * .55 + 33, hz - 10, 4, 22);   // blank billboard
    for (let k = 0; k < 5; k++) { const x = R() * W; g.strokeStyle = '#6a7a4a'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, hz + 30); g.lineTo(x + 3, hz - 30); g.stroke(); g.fillStyle = '#5a7a3a'; for (let q = 0; q < 6; q++) { g.beginPath(); g.ellipse(x + 3 + Math.cos(q) * 12, hz - 32 + Math.sin(q) * 4, 14, 3, q, 0, 7); g.fill(); } }   // Houston palms
  } else if (kind === 'night') { grad([[0, '#0e1e5a'], [.6, '#1e3a8a'], [1, '#3a5aa8']]); for (let k = 0; k < 120; k++) { g.fillStyle = `rgba(220,230,255,${.3 + R() * .6})`; g.fillRect(R() * W, R() * hz * .7, 1.5, 1.5); }
    g.fillStyle = '#eef2ff'; g.beginPath(); g.arc(W * .25, hz * .25, 22, 0, 7); g.fill(); g.fillStyle = '#1e3a8a'; g.beginPath(); g.arc(W * .25 + 9, hz * .25 - 5, 20, 0, 7); g.fill();   // crescent moon
    skyline('#14214e', 180, 0, .5); g.fillStyle = '#101a40'; g.fillRect(0, hz, W, H - hz); for (let x = 0; x < W; x += 30) { g.fillStyle = '#ffc870'; g.beginPath(); g.arc(x + R() * 10, hz + 24, 2.5, 0, 7); g.fill(); }   // freeway sodium lights
    for (let k = 0; k < 40; k++) { g.fillStyle = R() < .5 ? '#fff0c0' : '#ffb040'; g.fillRect(R() * W, hz + 32 + R() * 6, 4, 2); }
  } else if (kind === 'coral') { grad([[0, '#7a5ab8'], [.45, '#b07ad0'], [.68, '#d8a8c8'], [.84, '#f4b07a'], [1, '#ffb070']]); const sg = g.createRadialGradient(W * .3, hz - 30, 6, W * .3, hz - 30, 200); sg.addColorStop(0, 'rgba(255,214,150,1)'); sg.addColorStop(.15, 'rgba(255,160,90,.85)'); sg.addColorStop(1, 'rgba(255,140,80,0)'); g.fillStyle = sg; g.fillRect(0, 0, W, hz);
    for (let k = 0; k < 9; k++) { const y = hz * (.2 + R() * .55), x = R() * W, w = 120 + R() * 260; g.fillStyle = `rgba(255,${150 + R() * 40 | 0},${120 + R() * 40 | 0},.55)`; g.beginPath(); g.ellipse(x, y, w / 2, 6 + R() * 6, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(110,70,150,.35)'; g.beginPath(); g.ellipse(x + 10, y + 5, w / 2.2, 4, 0, 0, 7); g.fill(); }   // lit cloud streaks
    skyline('#5a3a6a', 150, 0, .12); g.fillStyle = '#4a3058'; g.fillRect(0, hz, W, H - hz);
  } else { grad([[0, '#8a92b4'], [.6, '#9aa4c8'], [1, '#b4b8cc']]); for (let k = 0; k < 14; k++) { const y = R() * hz, x = R() * W; g.fillStyle = `rgba(${R() < .5 ? '120,126,160' : '190,194,214'},.35)`; g.beginPath(); g.ellipse(x, y, 160 + R() * 200, 18 + R() * 20, 0, 0, 7); g.fill(); }
    skyline('#7a809a', 160, 0, .08); g.fillStyle = '#6a7088'; g.fillRect(0, hz, W, H - hz); for (let x = 0; x < W; x += 40) { g.fillStyle = '#9aa0b8'; g.fillRect(x, hz + 20, 2, 20); } }
  return c; }
export function sky(THREE, ctx, kind = 'texas', o = {}) {
  const key = 'skyTex|' + kind; let tex = CACHE.get(key); if (!tex) { tex = new THREE.CanvasTexture(skyCanvas(kind)); tex.colorSpace = THREE.SRGBColorSpace; CACHE.set(key, tex); }
  const uT = { value: 0 }, mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, fog: false, color: o.gain ? new THREE.Color(o.gain, o.gain, o.gain) : '#ffffff' });
  if (kind === 'texas' && o.haze !== false) { mat.onBeforeCompile = sh => { sh.uniforms.lpT = uT; sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float lpT;')
      .replace('#include <map_fragment>', `vec2 lpUv = vMapUv; float lpK = clamp((0.62 - lpUv.y) * 4.0, 0.0, 1.0) * clamp(lpUv.y * 6.0, 0.0, 1.0);
        lpUv.x += sin(lpUv.y * 220.0 + lpT * 7.0) * 0.0018 * lpK; lpUv.y += sin(lpUv.x * 90.0 + lpT * 5.0) * 0.0012 * lpK; lpUv = clamp(lpUv, 0.0, 1.0);
        vec4 sampledDiffuseColor = texture2D(map, lpUv); diffuseColor *= sampledDiffuseColor;`); }; mat.customProgramCacheKey = () => 'lpHaze'; }
  const w = o.w || 6, h = o.h || 3.75, m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.name = 'lp_sky_' + kind; m.userData.role = 'backdrop'; m.castShadow = false; m.receiveShadow = false;
  if (o.at && ctx.B2T) m.position.copy(ctx.B2T(o.at)); m.rotation.y = o.yaw ?? 0; if (o.parent) o.parent.add(m);
  return { mesh: m, update: t => { uT.value = t || 0; } }; }

// ---------- metre UVs on demand (same box rule as the kit), and the pass for sets with no kit3d call ----------
export function uv(mesh, size = 1) { const s = mesh.scale; if (Math.abs(s.x - 1) + Math.abs(s.y - 1) + Math.abs(s.z - 1) > .01) { mesh.geometry = mesh.geometry.clone(); mesh.geometry.scale(s.x, s.y, s.z); mesh.scale.set(1, 1, 1); } uvBox(T3, mesh, size); return mesh; }   // after LP.pack(); marks the geometry done so the kit pass keeps it
export function uvBox(THREE, mesh, scale) { let g = mesh.geometry; if (!g || !g.attributes.position || g.userData.k3uvDone) return; g = mesh.geometry = g.clone(); const P = g.attributes.position, Nn = g.attributes.normal, n = P.count, u = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) { const x = P.getX(i), y = P.getY(i), z = P.getZ(i), ax = Nn ? Math.abs(Nn.getX(i)) : 0, ay = Nn ? Math.abs(Nn.getY(i)) : 1, az = Nn ? Math.abs(Nn.getZ(i)) : 0, [a, b] = ay >= ax && ay >= az ? [x, z] : ax >= az ? [z, y] : [x, y]; u[i * 2] = a / scale; u[i * 2 + 1] = b / scale; }
  g.setAttribute('uv', new THREE.BufferAttribute(u, 2)); g.userData.k3uvDone = true; }
export function finishUV(THREE, scene) { scene.updateMatrixWorld(true); scene.traverse(o => { if (!o.isMesh || o.isInstancedMesh) return; const m = Array.isArray(o.material) ? o.material[0] : o.material; if (!m?.userData?.k3scale || !/^lp_/.test(m.userData.k3kind || '')) return;
  const ws = new THREE.Vector3(); o.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), ws); if (Math.abs(ws.x - 1) + Math.abs(ws.y - 1) + Math.abs(ws.z - 1) > .01) { o.geometry = o.geometry.clone(); o.geometry.scale(ws.x, ws.y, ws.z); o.scale.set(1, 1, 1); } uvBox(THREE, o, m.userData.k3scale); }); }

// ---------- the place light extras every set applies (LOOK_BIBLE light_over keys the kit itself does not read) ----------
// fill_color + fill_i: a second directional from the shade side; shadow_color: the hemisphere ground colour; veil_color + place key fog [near, far]: the room veil.
export function applyLight(THREE, scene, ctx, o = {}) { const L = ctx.light || {}, pl = ctx.place || {}, V = ctx.B2T ? a => ctx.B2T(a) : a => new THREE.Vector3(...a);
  scene.children.forEach(c => { if (c.isHemisphereLight && L.shadow_color) c.groundColor.set(L.shadow_color); });
  if (L.fill_color) { const fl = new THREE.DirectionalLight(L.fill_color, L.fill_i ?? .35); fl.position.copy(V(o.fillFrom || [-6, -4, 4])); fl.name = 'lp_fill'; scene.add(fl); }
  if (L.veil_color || pl.fog) scene.fog = new THREE.Fog(L.veil_color || L.hor || '#888888', ...(pl.fog || o.fog || [9, 30])); }
// glossy (glaze / lacquer / plastic) materials take the kit's env map from any kit pbr metal once it exists (call LP.sync(M) in the set's update)
export function sync(M) { if (!M || M.__synced) return; const env = M.steel && M.steel.envMap; if (!env) return; for (const m of GLOSS) { m.envMap = env; m.needsUpdate = true; } M.__synced = true; }

// ---------- THE PACK ----------
// M = LP.pack(THREE, ctx) (cached per ctx). Materials: tileSea, tileSeaGloss (glazed, env reflections: walls in close shots), dadoTile (same tile, for corridor + stairwell),
// ceilPanel, vinyl, terrazzo, plaster (butter-cream), block (painted cinder block), veneer (wall panelling), desk (desk wood), locker (olive steel paint),
// steel (brushed), chrome, steelDk, plasticOrange, plasticTeal, carpet, drape (blue), drapeDk, rug(w, l), glow(c), paint(c) (plain painted surface with plaster stipple).
// Functions: M.tile(col, grout, size), M.vinylOf(col), sizes in M.size.<name> (metres per repeat).
export function pack(THREE, ctx = {}) {
  T3 = THREE; if (ctx.__lpFS) return ctx.__lpFS;
  const M = {}, size = {}, pb = ctx.pbr, toon = ctx.toon || (c => new THREE.MeshLambertMaterial({ color: c })), pbOn = pb && pb.on !== false;
  const ts = tileTex(THREE, '#4fa59a', '#c9d9d2', .15, 1);
  M.tileSea = toonSurf(THREE, ts, 'tile', { normal: 1.2 }); M.tileSeaGloss = glossSurf(THREE, ts, 'tile', { rough: .22, env: .5, normal: 1.0 }); size.tileSea = ts.S;
  M.dadoTile = M.tileSeaGloss; M.tile = (col, grout = '#c9d9d2', sz = .15) => glossSurf(THREE, tileTex(THREE, col, grout, sz, 2), 'tile', { rough: .22, env: .5 });
  const ce = ceilTex(THREE); M.ceilPanel = toonSurf(THREE, ce, 'ceil', { anti: .08 }); size.ceilPanel = ce.S;
  const vi = vinylTex(THREE); M.vinyl = glossSurf(THREE, vi, 'vinyl', { rough: .38, env: .35, normal: .8 }); size.vinyl = vi.S; M.vinylOf = col => glossSurf(THREE, vinylTex(THREE, col), 'vinyl', { rough: .38, env: .35 });
  const tz = terrazzoTex(THREE); M.terrazzo = glossSurf(THREE, tz, 'terrazzo', { rough: .25, env: .5, normal: .7 }); size.terrazzo = tz.S;
  const pl = plasterTex(THREE); M.plaster = toonSurf(THREE, pl, 'plaster', { anti: .08 }); size.plaster = pl.S; M.paint = col => toonSurf(THREE, plasterTex(THREE, col), 'plaster', { anti: .08 });
  const bl = blockTex(THREE); M.block = toonSurf(THREE, bl, 'block', { normal: 1.3 }); size.block = bl.S; M.blockOf = col => toonSurf(THREE, blockTex(THREE, col), 'block', { normal: 1.3 });
  const ve = veneerTex(THREE); M.veneer = glossSurf(THREE, ve, 'veneer', { rough: .45, env: .25 }); size.veneer = ve.S;
  const de = deskTex(THREE); M.desk = glossSurf(THREE, de, 'desk', { rough: .35, env: .3 }); size.desk = de.S;
  const lk = lockerTex(THREE); M.locker = glossSurf(THREE, lk, 'locker', { rough: .42, metal: .25, env: .4 }); size.locker = lk.S;
  const po = plasticTex(THREE, '#f09a2a'), pt = plasticTex(THREE, '#2aa0a0'); M.plasticOrange = glossSurf(THREE, po, 'plastic', { rough: .3, env: .35 }); M.plasticTeal = glossSurf(THREE, pt, 'plastic', { rough: .3, env: .35 }); size.plastic = po.S;
  M.plasticOf = col => glossSurf(THREE, plasticTex(THREE, col), 'plastic', { rough: .3, env: .35 });
  const ca = carpetTex(THREE); M.carpet = toonSurf(THREE, ca, 'carpet', { anti: .1 }); size.carpet = ca.S;
  const dr = drapeTex(THREE), drd = drapeTex(THREE, '#24508e'); M.drape = toonSurf(THREE, dr, 'drape', { side: THREE.DoubleSide, anti: .06 }); M.drapeDk = toonSurf(THREE, drd, 'drape', { side: THREE.DoubleSide, anti: .06 }); size.drape = dr.S;
  M.rug = (w = 1.6, l = 1.2) => { const t = rugTex(THREE, w, l); const m = toonSurf(THREE, t, 'rug', { anti: 0 }); m.map.wrapS = m.map.wrapT = THREE.ClampToEdgeWrapping; m.userData.k3scale = 0; return m; };   // UV 0..1 over the rug plane: no metre UV
  // METALS (kit3d pbr: env reflections + one clean highlight per curve; toon colours when pbr is off)
  M.steel = pbOn ? pb.metal('steel', { color: '#c8d0dc', rough: .32, env: 1.1, finish: 'brushed', toon: '#c8d0dc' }) : toon('#c8d0dc');
  M.steelDk = pbOn ? pb.metal('steel', { color: '#8a94a4', rough: .45, finish: 'brushed', toon: '#8a94a4', seed: 5 }) : toon('#8a94a4');
  M.chrome = pbOn ? pb.metal('steel', { color: '#e8eef4', rough: .1, env: 1.4, finish: 'smooth', toon: '#e8eef4', seed: 7 }) : toon('#e8eef4');
  M.glow = c => new THREE.MeshBasicMaterial({ color: c, toneMapped: false });
  M.size = size; ctx.__lpFS = M; return M; }

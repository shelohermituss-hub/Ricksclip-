// PLACE SET "corridor" (+ the PRE-OP BAY): set B of fake-surgery, a Houston hospital surgical corridor, mid-1990s (owner: set helper B1, then the S2 builder).
// Plan metres, Z up, Y away from the lens. Built at world.js ORIGIN.corridor; every anchor and camera station below is in WORLD plan metres (origin added).
// Local layout: corridor x -1.4..1.4, y -3.5..12, ceiling 2.8. Far wall y=12 = THE BIG WINDOW (hot white Texas sky, car park, freeway).
// Right branch round THE CORNER at y 9.4..11.6 to x 6 (the gurney queue curls round it). OR 3 double doors on the right wall at y 3.2 (two portholes,
// amber IN USE light, "OR 3" sign). Left wall: boxy CRT on a cart, beige wall phone, wall calendar "1994", bulletin board; the PRE-OP BAY opens off the left
// wall at y 5.6..9.0 (x -4.6..-1.4): pastel mauve + teal print curtain on a ceiling rail with hooks, soft side window, visitor chair, side table.
// PLACE KEYS (film.json places.<name>; every key optional; keyframes = [[frame, value], ...] like the elevator kit):
//   clock: "12:00" | [[f,"8:00"],[f,"11:00"],[f,"2:00"]]   wall clock time (minutes interpolate between keys)
//   clock_spin: 0 | number | [[f,n]]   extra minute-hand turns per second (>= 2 the hands blur into a fan: row 15 EXTREME "hands spin into a blur")
//   window: 'noon' (default) | 'morning'   the sky outside (row 15: keyframe it, the light inside follows); window_glow: 1 (strength)
//   shimmer: 1   heat shimmer strength on the window (row 12)
//   portholes: 'work' (row 13: shaver silhouette L, jug-pouring silhouette R, same rhythm) | 'lit' (OR lit, empty) | 'dark'
//   period_right: {crt_y, cal_y, text}   S2 v2: CRT cart + calendar 1994 (with HOUSTON TX) moved to the right wall beside the OR doors
//   clock_hang: [x,y,z]   S2 v2: the clock hangs from the ceiling over the corridor facing the lens (one-direction flight into its face)
//   ph_clear: true   S2 v2 (CB: no fog out of the porthole): no glass tint, no glint, the drawn OR view a clear saturated teal (no white glow centre)
//   ph_big: true   S2 BUILD-OUT row 13: drawn porthole views (surgeon silhouette + shaver L / jug pour R over a draped knee), clipped round
//   ph_scale: .74   ph_tool: 1   ph_dy: 0   S2 v3 (C4): figure scale inside the glass / extra scale of the shaver + jug / vertical shift in canvas px
//   rhythm: 1.1   silhouette beats per second (both portholes share it: "like a factory")
//   in_use: true   amber IN USE light on/off
//   queue: 6 | [[f,n]]   gurneys inside the corridor (0..12): along the right wall from the OR door, then ROUND THE CORNER into the branch (the curl)
//   queue_out: 0 | n   gurneys OUTSIDE (row 15 EXTREME): out of the building, across the car park and up the freeway to the horizon (try 140)
//   honk: false   the pickup with the cowboy-hat driver beside the queue on the freeway, HONK lines
//   flicker: [] | [f, ...]   fluorescent flicker frames (one panel blinks for 4 frames)
//   curtain: 0.7   pre-op curtain closed fraction across the bay opening (0 = bunched open, 1 = closed)
//   preop: 'morning' (soft side window, default) | 'noon'
//   dust: 160   dust motes in the window light; wet: true   wet sheen patch + CAUTION sign by the window
//   env_v3: true   ENV v3 (E1 2026-11-17, default OFF): wall colour bands + stencil frieze + chair/picture rails, oak handrails, outlets, doors 208/212 with vision
//          panels + number plates, framed posters (WASH YOUR HANDS, QUIET PLEASE, THE KNEE JOINT, HEALTH FAIR 1994), 2nd notice board, fire extinguisher cabinet,
//          flag signs SURGERY + RADIOLOGY ->, 4 warm sconces with wall pools, cool troffers vs warm window spill, foreground dracaena + supply cart; calendar text navy
//          (full list: envV3Corridor at the end of this file, sets/STATE_env.md)
//   plant_at: [-1.0, -.2]   (v4 S2) with env_v3: plan x,y of the dracaena pot (S2 puts it behind its door picture: its leaves covered the queue faces)
//   queue_side: null | [[x, y, yawDeg] x 12]   (v5 S2, 2026-11-17) per-slot gurney plan spot + yaw (0 = head toward -x, side-on to a lens looking +y): the reclined cards lie ALONG the gurney
//   hang_sign_off: false   (v6 S2) hide the hanging 'SURGERY OR 1-4' ceiling sign at y 1.4
//   queue_lie: null | [slot, ...]   (v6 S2, 2026-11-17) those gurneys stay flat and drop the drape: the cast card lies on its back on the mattress (film.js lie path, CB bed test)
//   gurney_back: null | {slot: hingeX}   (v5 S2) raised head section 35 deg + pillow on that slot's gurney, hinge at gurney-local x (head end -x); drape_dx: 0 shifts those drapes toward the feet
//   linen_cart_off: false   (v5 S2) no linen cart at the left wall y 4.9 (its top shelf ran across a gurney patient's head)
//   rail_queue_off: false   (v4 S2, 2026-11-17) with env_v3: drop the right-wall handrail runs y 4.1-6.0 + 7.0-9.35 and the right_wall_b bumper rail behind the gurney queue (they ran across the patients)
// ANCHORS returned (world plan metres): or_door, or_door_in (inside OR 3 behind the doors), porthole_L, porthole_R, clock, crt, phone, calendar, window,
//   corner, gurney_0..gurney_11 (each { at, head, knee, yaw }), gurney_path (fn u 0..1 -> point, corridor far end -> OR door, for the tower roll row 47->48),
//   wave_spot (where the surgeon stands to wave gurneys in), preop_chair, preop_seat, preop_table, preop_clipboard, preop_cane, preop_window, preop_extra_1/2.
// CAMERA STATIONS (export STATIONS, world metres, 9:16 at character height): wide, period, portholes, window_out, queue_curl, preop, preop_form, door_fly.
import { ORIGIN, DADO_Z, TILE_SEA } from './world.js';

const O = ORIGIN.corridor, W = (x, y, z) => [x + O[0], y + O[1], z + O[2]];
export const STATIONS = {
  wide:       { pos: W(.35, -2.9, 1.5), aim: W(-.1, 9, 1.35), lens: 22, note: 'establishing CO: floor shine, gurneys right, window far end' },
  period:     { pos: W(.55, -.7, 1.42), aim: W(-1.4, 1.9, 1.3), lens: 26, note: 'row 11: CRT cart, phone, calendar 1994 on the left wall' },
  portholes:  { pos: W(-.55, 2.3, 1.55), aim: W(1.4, 3.25, 1.5), lens: 34, note: 'row 13: the two portholes, IN USE, OR 3 sign' },
  window_out: { pos: W(.1, 8.6, 1.5), aim: W(3, 60, 3.2), lens: 30, note: 'rows 12 + 15: window, freeway, queue_out to the horizon' },
  queue_curl: { pos: W(-1.0, 1.0, 1.55), aim: W(2.2, 9.8, 1.0), lens: 22, note: 'rows 14-15: queue along the wall and round the corner, clock' },
  preop:      { pos: W(-1.95, 5.85, 1.45), aim: W(-4.3, 8.3, 1.0), lens: 22, note: 'row 24: pre-op bay, soft window, chair, table' },
  preop_form: { pos: W(-3.35, 7.15, 1.6), aim: W(-3.6, 7.75, .7), lens: 34, note: 'row 25 POV start: over the chair onto the clipboard' },
  door_fly:   { pos: W(1.15, 3.25, 1.55), aim: W(-1.4, 3.0, 1.45), lens: 24, note: 'S1->S2 join: just out of the porthole, looking into the corridor' },
};

const canvasTex = (THREE, w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };
export function kf(keys, f, def = 0) { if (keys == null) return def; if (!Array.isArray(keys) || !Array.isArray(keys[0])) return keys; if (!keys.length) return def; if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) { const [f0, a] = keys[i - 1], [f1, b] = keys[i], u = (f - f0) / Math.max(1e-4, f1 - f0), s = u * u * (3 - 2 * u); return typeof a === 'number' ? a + (b - a) * s : (u < .5 ? a : b); }
  return keys[keys.length - 1][1]; }
const hm = s => { const [h, m] = String(s).split(':').map(Number); return ((h % 12) * 60 + (m || 0)); };
export function clockMinutes(keys, f) { if (!Array.isArray(keys)) return hm(keys || '12:00'); if (f <= keys[0][0]) return hm(keys[0][1]);
  for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) { let a = hm(keys[i - 1][1]), b = hm(keys[i][1]); if (b < a) b += 720; const u = (f - keys[i - 1][0]) / Math.max(1, keys[i][0] - keys[i - 1][0]); return a + (b - a) * u; }
  return hm(keys[keys.length - 1][1]); }

// shared tiny kit (also used by office.js)
export function kit(THREE, ctx, root, off) {
  const V = (x, y, z) => ctx.B2T([x + off[0], y + off[1], z + off[2]]);
  const add = (geo, mat, name, role, p, parent = root, shadow = true) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m; };
  const box = (sx, sy, sz, mat, name, role, x, y, z, parent, shadow) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, role, V(x, y, z), parent, shadow);
  const bar = (a, b, r, mat, name, role = 'metal', parent = root, segs = 8) => { const A = V(...a), Bv = V(...b), d = Bv.clone().sub(A), L = Math.max(d.length(), 1e-4), m = add(new THREE.CylinderGeometry(r, r, L, segs), mat, name, role, A.clone().addScaledVector(d, .5), parent); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); return m; };
  // a flat plane on a wall: face = 'y-' (toward the lens), 'x+' (faces +x), 'x-', 'y+', 'z+' (floor decal), 'z-' (ceiling)
  const plate = (w, h, mat, name, role, x, y, z, face = 'y-', parent = root, shadow = false) => { const m = add(new THREE.PlaneGeometry(w, h), mat, name, role, V(x, y, z), parent, shadow);
    if (face === 'x+') m.rotation.y = Math.PI / 2; else if (face === 'x-') m.rotation.y = -Math.PI / 2; else if (face === 'y+') m.rotation.y = Math.PI; else if (face === 'z+') m.rotation.x = -Math.PI / 2; else if (face === 'z-') m.rotation.x = Math.PI / 2; return m; };
  return { V, add, box, bar, plate };
}
// surfaces: look_pack.js first (when the look helper's names exist), else this set's own textured stand-ins (canvas maps + bump, never flat)
export async function surfaces(THREE, ctx) {
  let LP = null; try { LP = await import('./look_pack.js'); } catch (e) { LP = null; }
  let M = {}; try { M = LP && LP.pack ? (LP.pack(THREE, ctx) || {}) : {}; } catch (e) { console.warn('corridor/office: look_pack.pack failed: ' + e.message); M = {}; }
  const pick = (keys, fb) => { for (const k of keys) { const v = M[k]; if (v && (v.isMaterial || Array.isArray(v))) return v; if (typeof v === 'function') { try { const r = v(); if (r && r.isMaterial) return r; } catch (e) {} } } return fb(); };
  return { LP, M, pick, has: !!(LP && LP.pack) };
}
export function noiseCanvas(c, w, h, base, cols, n, s0, s1, R0) { c.fillStyle = base; c.fillRect(0, 0, w, h); for (let i = 0; i < n; i++) { c.fillStyle = cols[i % cols.length]; const s = s0 + (s1 - s0) * R0(); c.fillRect(R0() * w, R0() * h, s, s * (.6 + .8 * R0())); } }

export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, L = ctx.light || {}, root = new THREE.Group(); root.name = 'corridor_set'; scene.add(root);
  const { V, add, box, bar, plate } = kit(THREE, ctx, root, O);
  let seed = 23; const R0 = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * R0();
  const SF = await surfaces(THREE, ctx), pick = SF.pick, pb = ctx.pbr;
  let HP = null; try { HP = await import('./hero_props.js'); } catch (e) { HP = null; }
  const toon = ctx.toon, glow = (c, o) => new THREE.MeshBasicMaterial({ color: c, toneMapped: false, ...(o || {}) });
  const std = (color, rough = .6, metal = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
  const steel = pick(['steel'], () => pb ? pb.metal('steel', { color: '#c8d0dc', rough: .3, env: 1.1, toon: '#c8d0dc' }) : std('#c8d0dc', .3, .8));
  const steelDk = pick(['steelDk'], () => pb ? pb.metal('steel', { color: '#8a94a4', rough: .45, toon: '#8a94a4' }) : std('#8a94a4', .45, .7));
  const chrome = SF.M.chrome || (pb ? pb.metal('steel', { color: '#e4eaf2', rough: .15, env: 1.3, toon: '#e4eaf2' }) : std('#e4eaf2', .15, .9));
  const ink = toon('#2a1a1f'), rubber = std('#2a2a30', .8), white = std('#f6f4ee', .7), beige = std('#d9ccb0', .55), beigeDk = std('#b8aa8c', .6);
  const night = false;

  // ---------- air + light (light_over colours: fill / veil / shadow; LOOK_BIBLE CO) ----------
  scene.children.forEach(o => { if (o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.radius === 400) o.visible = false; });
  scene.background = new THREE.Color('#fff6e0'); scene.fog = new THREE.Fog(L.veil_color || '#f6ead0', ...(pl.fog || [30, 320]));
  scene.children.forEach(o => { if (o.isHemisphereLight) o.groundColor.set(L.shadow_color || '#4a4030'); });
  if (SF.LP && SF.LP.applyLight) SF.LP.applyLight(THREE, scene, ctx, { fillFrom: W(-4, -6, 5) }); else { const fl = new THREE.DirectionalLight(L.fill_color || '#bfe0d8', L.fill_i ?? .55); fl.position.copy(V(-4, -6, 5)); fl.target.position.copy(V(0, 4, 0)); root.add(fl, fl.target); }
  // the corridor looks OUT to the horizon (row 15 EXTREME): its veil starts late so the freeway and the gurney line read; place key fog_out [near, far] overrides
  scene.fog = new THREE.Fog(L.veil_color || '#f6ead0', ...(pl.fog_out || [30, 420]));
  const winLight = new THREE.DirectionalLight('#fff6e0', 1.6); winLight.position.copy(V(.6, 40, 9)); winLight.target.position.copy(V(-.3, 2, 0)); winLight.castShadow = true; winLight.shadow.mapSize.set(2048, 2048);
  { const s = winLight.shadow.camera; s.left = -8; s.right = 8; s.top = 8; s.bottom = -8; s.near = 1; s.far = 80; } winLight.shadow.bias = -.0004; root.add(winLight, winLight.target);

  // ---------- textures ----------
  const terrT = canvasTex(THREE, 1024, 1024, (c, w, h) => { noiseCanvas(c, w, h, '#d8d0bc', ['#8a8070', '#f4eee0', '#4fa59a', '#2a2a2a', '#c8a060', '#a8b8b0', '#6a6458', '#ffffff'], 26000, 1.5, 5, R0);
    for (let i = 0; i < 900; i++) { c.fillStyle = ['#3a3a36', '#e8e2d4', '#2f8a80', '#b08a50'][i % 4]; c.beginPath(); c.ellipse(R0() * w, R0() * h, 3 + R0() * 6, 2 + R0() * 4, R0() * 3, 0, 6.3); c.fill(); }
    c.strokeStyle = '#9a8e74'; c.lineWidth = 5; c.strokeRect(0, 0, w, h); c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; c.strokeRect(4, 4, w - 8, h - 8);
    c.fillStyle = 'rgba(90,80,60,.10)'; for (let i = 0; i < 40; i++) { c.beginPath(); c.ellipse(R0() * w, R0() * h, 30 + R0() * 90, 10 + R0() * 30, R0() * 3, 0, 6.3); c.fill(); } }, [13, 13]);
  const floorM = pick(['terrazzo'], () => std('#ffffff', .22, 0, { map: terrT, bumpMap: terrT, bumpScale: .4 }));
  const butterT = canvasTex(THREE, 512, 512, (c, w, h) => { noiseCanvas(c, w, h, '#f3e2a6', ['#efdc9c', '#f6e8b4', '#ead594', '#f8ecc0'], 9000, 2, 7, R0); c.fillStyle = 'rgba(160,130,70,.06)'; for (let i = 0; i < 25; i++) c.fillRect(R0() * w, R0() * h, 2, 40 + R0() * 120);
    c.fillStyle = 'rgba(120,100,60,.12)'; for (let i = 0; i < 18; i++) { c.beginPath(); c.arc(R0() * w, h * (.7 + .3 * R0()), 2 + R0() * 6, 0, 6.3); c.fill(); } }, [4, 2]);
  const wallM = (SF.M.paint && SF.M.paint(pl.co_v3 ? '#eab443' : pl.co_v2 ? '#f2cf68' : '#f3e2a6'))   /* S2 key co_v2: deeper butter (sat fix) */ || pick(['butterWall'], () => std('#ffffff', .85, 0, { map: butterT, bumpMap: butterT, bumpScale: .3 }));
  const tileT = canvasTex(THREE, 512, 512, (c, w, h) => { c.fillStyle = '#e4efe8'; c.fillRect(0, 0, w, h); const n = 8, s = w / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const base = ['#4fa59a', '#4aa094', '#56aca0', '#469a8e'][(i * 7 + j * 3) % 4]; c.fillStyle = base; c.fillRect(i * s + 3, j * s + 3, s - 6, s - 6);
      c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(i * s + 7, j * s + 7, s * .35, 4); c.fillStyle = 'rgba(0,40,36,.12)'; c.fillRect(i * s + 3, j * s + s - 9, s - 6, 6); if ((i * 13 + j * 5) % 17 === 0) { c.strokeStyle = 'rgba(30,60,55,.5)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(i * s + 8, j * s + 10); c.lineTo(i * s + s * .6, j * s + s * .7); c.stroke(); } } }, [10, 2]);
  const dadoM = pick(['dadoTile', 'tileSea'], () => std('#ffffff', .25, 0, { map: tileT, bumpMap: tileT, bumpScale: .5 }));
  const ceilT = canvasTex(THREE, 512, 512, (c, w, h) => { noiseCanvas(c, w, h, '#efe9da', ['#d8d0bc', '#faf6ec', '#c8c0aa'], 14000, 1, 3, R0); c.strokeStyle = '#b8b4a8'; c.lineWidth = 10; c.strokeRect(0, 0, w, h); c.strokeStyle = '#8c887c'; c.lineWidth = 2; c.strokeRect(5, 5, w - 10, h - 10);
    c.fillStyle = 'rgba(150,120,60,.18)'; c.beginPath(); c.ellipse(w * .7, h * .3, 50, 30, .4, 0, 6.3); c.fill(); }, [5, 12]);
  const ceilM = pick(['ceilPanel'], () => std('#ffffff', .95, 0, { map: ceilT }));
  const troffT = canvasTex(THREE, 256, 512, (c, w, h) => { c.fillStyle = '#fffbe8'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(200,190,150,.55)'; c.lineWidth = 1; for (let i = 0; i < w; i += 8) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.stroke(); } for (let j = 0; j < h; j += 8) { c.beginPath(); c.moveTo(0, j); c.lineTo(w, j); c.stroke(); }
    c.strokeStyle = '#d8d2bc'; c.lineWidth = 14; c.strokeRect(0, 0, w, h); for (const x of [w * .3, w * .7]) { const g = c.createLinearGradient(x - 30, 0, x + 30, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(x - 30, 10, 60, h - 20); } });

  //   troff_halo off: key troff_nohalo: true  (S2 round 3: the kit adds a 6 m additive halo sprite on every *lens* lamp; a troffer above/ahead of the camera veils the whole frame and flips off the frame it passes the lens plane = the f421-422 / f443-444 exposure jump; the panel is renamed so no halo is added)
  // ---------- shell: floor, walls with the sea-green dado + steel bumper rail, cove base, ceiling grid + troffers ----------
  const floor = add(new THREE.PlaneGeometry(12, 17), floorM, 'terrazzo_floor', 'floor', V(.2, 4.2, 0)); floor.rotation.x = -Math.PI / 2; floor.castShadow = false;
  for (let y = -3.5; y <= 12; y += 1.25) box(2.8, .012, .003, steelDk, 'terrazzo_divider_strip', 'metal', 0, y, .0015, root, false);
  const CZ = 2.8, WT = .12;
  // wall run helper: a wall segment along y (side walls) or along x (cross walls), dado tile below DADO_Z, butter above, bumper rail, cove base
  const wallY = (x, y0, y1, face, name) => { const L = y1 - y0, cy = (y0 + y1) / 2, s = face === 'x+' ? 1 : -1;
    box(WT, L, CZ - DADO_Z, wallM, name + '_upper', 'wall', x - s * WT / 2, cy, DADO_Z + (CZ - DADO_Z) / 2, root, false);
    box(WT, L, DADO_Z, dadoM, name + '_dado', 'wall', x - s * WT / 2, cy, DADO_Z / 2, root, false);
    box(.03, L, .04, steel, name + '_dado_cap', 'metal', x + s * .012, cy, DADO_Z, root, false);
    box(.05, L, .14, beigeDk, name + '_bumper_rail', 'plastic', x + s * .04, cy, .9); box(.015, L, .02, steel, name + '_bumper_rail_edge', 'metal', x + s * .068, cy, .9, root, false);
    for (let y = y0 + .6; y < y1 - .2; y += 1.2) box(.06, .04, .1, steelDk, name + '_rail_bracket', 'metal', x + s * .03, y, .9, root, false);
    box(.02, L, .1, std('#3a4a44', .5), name + '_cove_base', 'rubber', x + s * .01, cy, .05, root, false); };
  const wallX = (y, x0, x1, face, name) => { const L = x1 - x0, cx = (x0 + x1) / 2, s = face === 'y+' ? 1 : -1;
    box(L, WT, CZ - DADO_Z, wallM, name + '_upper', 'wall', cx, y - s * WT / 2, DADO_Z + (CZ - DADO_Z) / 2, root, false);
    box(L, WT, DADO_Z, dadoM, name + '_dado', 'wall', cx, y - s * WT / 2, DADO_Z / 2, root, false);
    box(L, .03, .04, steel, name + '_dado_cap', 'metal', cx, y + s * .012, DADO_Z, root, false);
    box(L, .05, .14, beigeDk, name + '_bumper_rail', 'plastic', cx, y + s * .04, .9); box(L, .02, .1, std('#3a4a44', .5), name + '_cove_base', 'rubber', cx, y + s * .01, .05, root, false); };
  // left wall: y -3.5..5.6 | bay opening 5.6..9.0 | 9.0..12
  wallY(-1.4, -3.5, 5.6, 'x+', 'left_wall_a'); wallY(-1.4, 9.0, 12, 'x+', 'left_wall_b');
  box(WT, 3.4, CZ - 2.3, wallM, 'bay_header', 'wall', -1.46, 7.3, 2.3 + (CZ - 2.3) / 2, root, false);
  // right wall: y -3.5..2.35 | OR doors 2.35..4.05 | 4.05..9.4 | corner opening 9.4..11.6 (branch)
  wallY(1.4, -3.5, 2.35, 'x-', 'right_wall_a'); wallY(1.4, 4.05, 9.4, 'x-', 'right_wall_b');
  if (pl.rail_queue_off) for (const o of [...root.children]) if (/^right_wall_b_(bumper_rail|bumper_rail_edge|rail_bracket)$/.test(o.name)) root.remove(o);   // v4: no bumper rail behind the gurney queue either
  box(WT, 1.7, CZ - 2.2, wallM, 'or_door_header', 'wall', 1.46, 3.2, 2.2 + (CZ - 2.2) / 2, root, false);
  // the branch round the corner (x 1.4..6): near wall y=9.4 (faces +y), far wall continues y=12, end wall x=6
  wallX(9.4, 1.4, 6, 'y+', 'branch_near_wall'); wallY(6, 9.4, 12, 'x-', 'branch_end_wall');
  // the far wall y=12 with THE BIG WINDOW in the corridor part x -1.25..1.25, z .75..2.45
  wallX(12, 1.4, 6, 'y-', 'branch_far_wall');
  const WX0 = -1.25, WX1 = 1.25, WZ0 = .75, WZ1 = 2.45;
  box(2.8, WT, WZ0, dadoM, 'window_wall_dado', 'wall', 0, 12.06, WZ0 / 2, root, false); box(2.8, WT, CZ - WZ1, wallM, 'window_wall_head', 'wall', 0, 12.06, WZ1 + (CZ - WZ1) / 2, root, false);
  for (const x of [-1.33, 1.33]) box(.16, WT, WZ1 - WZ0, wallM, 'window_wall_jamb', 'wall', x, 12.06, (WZ0 + WZ1) / 2, root, false);
  box(2.62, .22, .05, std('#e8e0c8', .4), 'window_sill', 'stone', 0, 11.9, WZ0); box(2.6, .05, .06, steel, 'window_frame_bottom', 'metal', 0, 12.0, WZ0 + .03); box(2.6, .05, .06, steel, 'window_frame_top', 'metal', 0, 12.0, WZ1 - .03);
  for (const x of [-1.25, -.42, .42, 1.25]) box(.06, .06, WZ1 - WZ0, steel, 'window_mullion', 'metal', x, 12.0, (WZ0 + WZ1) / 2); box(2.6, .05, .04, steel, 'window_transom', 'metal', 0, 12.0, 2.05);
  for (let i = 0; i < 3; i++) { const x = -.84 + i * .84; box(.04, .02, .03, steelDk, 'window_latch', 'metal', x + .3, 11.96, 1.4, root, false); }
  // a dusty half-raised venetian blind at the top of the window (period, and the light gets stripes on the sill)
  for (let i = 0; i < 9; i++) box(2.5, .03, .006, std('#efe6cc', .5), 'window_blind_slat', 'plastic', 0, 11.93, WZ1 - .04 - i * .028, root, false); box(2.56, .05, .04, beigeDk, 'window_blind_head', 'plastic', 0, 11.93, WZ1 + .01);
  bar([.9, 11.92, WZ1], [.9, 11.92, 1.55], .003, white, 'blind_cord', 'cloth', root, 4); add(new THREE.CylinderGeometry(.012, .012, .05, 8), beige, 'blind_cord_tassel', 'plastic', V(.9, 11.92, 1.53));
  // the glass: hot glow + heat shimmer layer (animated) + a pale reflection streak
  const glass = plate(2.5, WZ1 - WZ0, new THREE.MeshBasicMaterial({ color: '#fffaf0', transparent: true, opacity: .1, depthWrite: false }), 'window_glass', 'glass', 0, 11.99, (WZ0 + WZ1) / 2);
  const shimT = canvasTex(THREE, 256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); for (let j = 0; j < 40; j++) { c.strokeStyle = `rgba(255,${230 + (j % 3) * 8},190,${.12 + .1 * R0()})`; c.lineWidth = 2 + R0() * 3; c.beginPath(); for (let x = 0; x <= w; x += 8) { const y = j * 6.4 + Math.sin(x * .08 + j) * 3; x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); } }, [2, 1]);
  const shim = plate(2.5, .9, new THREE.MeshBasicMaterial({ map: shimT, transparent: true, opacity: .55 * (pl.shimmer ?? 1), depthWrite: false, toneMapped: false }), 'window_heat_shimmer', 'fx', 0, 11.97, 1.05);
  for (const x of [-.9, .3]) { const s = plate(.08, 1.4, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .16, depthWrite: false }), 'window_glass_streak', 'glass', x, 11.965, 1.6); s.rotation.z = -.35; }
  // ceiling: acoustic grid + fluorescent troffers (glow) + sprinklers, smoke detector, HVAC grilles, the green EXIT sign
  const ceil = add(new THREE.PlaneGeometry(12, 17), ceilM, 'acoustic_ceiling', 'ceiling', V(.2, 4.2, CZ), root, false); ceil.rotation.x = Math.PI / 2;
  for (let y = -3.4; y <= 12; y += .6) box(2.8, .02, .015, std('#f4f2ea', .4, .2), 'ceiling_grid_tee', 'metal', 0, y, CZ - .008, root, false);
  for (const x of [-.6, .6]) box(.02, 15.5, .015, std('#f4f2ea', .4, .2), 'ceiling_grid_main', 'metal', x, 4.25, CZ - .008, root, false);
  const troffM = new THREE.MeshBasicMaterial({ map: troffT, toneMapped: false }), troffers = [];
  for (let y = -2.4; y <= 11; y += 2.4) { const t = plate(.6, 1.2, troffM.clone(), (pl.troff_nohalo ? 'fluorescent_troffer_panel' : 'fluorescent_troffer_lens'), 'lamp', 0, y, CZ - .02, 'z-'); troffers.push(t); box(.66, 1.26, .04, std('#f0eee6', .35, .3), 'troffer_frame', 'metal', 0, y, CZ - .01, root, false);
    const pt = new THREE.PointLight('#fff2c0', .9, 5.5, 1.6); pt.position.copy(V(0, y, CZ - .3)); root.add(pt); }
  for (const [x, y] of [[3.5, 10.5], [-3.0, 7.3]]) { troffers.push(plate(.6, 1.2, troffM.clone(), (pl.troff_nohalo ? 'fluorescent_troffer_panel' : 'fluorescent_troffer_lens'), 'lamp', x, y, CZ - .02, 'z-')); const pt = new THREE.PointLight('#fff2c0', .8, 5, 1.6); pt.position.copy(V(x, y, CZ - .3)); root.add(pt); }
  for (let y = -1.2; y < 11; y += 3.0) { add(new THREE.CylinderGeometry(.03, .04, .04, 10), chrome, 'sprinkler_head', 'metal', V(.85, y, CZ - .03), root, false); add(new THREE.CylinderGeometry(.045, .045, .006, 12), chrome, 'sprinkler_deflector', 'metal', V(.85, y, CZ - .06), root, false); }
  add(new THREE.CylinderGeometry(.07, .07, .04, 16), white, 'smoke_detector', 'plastic', V(-.7, 5.2, CZ - .02), root, false); add(new THREE.SphereGeometry(.006, 6, 4), glow('#7aff8a'), 'smoke_detector_led', 'lamp', V(-.7, 5.13, CZ - .045), root, false);
  const grilleT = canvasTex(THREE, 128, 128, (c, w, h) => { c.fillStyle = '#e8e4d8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#8a8678'; c.lineWidth = 3; for (let i = 10; i < w; i += 10) { c.beginPath(); c.moveTo(i, 8); c.lineTo(i, h - 8); c.stroke(); } c.strokeStyle = '#6a665a'; c.lineWidth = 6; c.strokeRect(0, 0, w, h); c.fillStyle = 'rgba(60,50,40,.35)'; c.fillRect(0, h - 22, w, 22); });
  for (const y of [.6, 6.6]) plate(.55, .55, std('#ffffff', .6, 0, { map: grilleT }), 'hvac_return_grille', 'metal', -.6, y, CZ - .015, 'z-');
  const exitT = canvasTex(THREE, 256, 96, (c, w, h) => { c.fillStyle = '#f4f4ee'; c.fillRect(0, 0, w, h); c.fillStyle = '#1e9a4a'; c.font = 'bold 66px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('EXIT', w / 2, h / 2 + 4); c.fillStyle = '#1e9a4a'; c.beginPath(); c.moveTo(230, 48); c.lineTo(212, 34); c.lineTo(212, 62); c.fill(); });
  box(.36, .07, .16, white, 'exit_sign_box', 'plastic', 0, 9.2, CZ - .16); for (const s of [-1, 1]) plate(.32, .12, glow('#ffffff', { map: exitT }), 'exit_sign_face', 'sign', 0, 9.2 - s * .037, CZ - .16, s > 0 ? 'y-' : 'y+'); bar([0, 9.2, CZ - .08], [0, 9.2, CZ], .008, steel, 'exit_sign_stem');
  // hanging direction sign (words in the world, spelled right)
  const dirT = canvasTex(THREE, 512, 128, (c, w, h) => { c.fillStyle = '#1d3f8a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#f3e2a6'; c.lineWidth = 6; c.strokeRect(8, 8, w - 16, h - 16); c.fillStyle = '#ffffff'; c.font = 'bold 46px Arial'; c.textBaseline = 'middle'; c.fillText('SURGERY', 30, h / 2 + 3); c.fillText('OR 1-4', 290, h / 2 + 3);
    c.beginPath(); c.moveTo(w - 30, h / 2); c.lineTo(w - 60, h / 2 - 22); c.lineTo(w - 60, h / 2 + 22); c.fill(); });
  if (!pl.hang_sign_off) {   // v6 S2 key hang_sign_off: no 'SURGERY OR 1-4' ceiling sign (from the raised door picture it hung across g2's face); the wall flag SURGERY stays
  box(1.3, .04, .3, std('#1d3f8a', .5), 'hanging_sign_board', 'sign', 0, 1.4, 2.42); plate(1.26, .28, std('#ffffff', .6, 0, { map: dirT }), 'hanging_sign_face', 'sign', 0, 1.378, 2.42); plate(1.26, .28, std('#ffffff', .6, 0, { map: dirT }), 'hanging_sign_back', 'sign', 0, 1.422, 2.42, 'y+');
  for (const x of [-.5, .5]) bar([x, 1.4, 2.57], [x, 1.4, CZ], .004, steel, 'hanging_sign_chain'); }

  // ---------- OR 3 DOUBLE DOORS: two leaves with portholes, push plates, kick plates, frame, "OR 3" sign, amber IN USE light; OR glimpse behind ----------
  const DX = 1.4, DY = 3.2, PZ = 1.55, ph = {};
  const doorM = std('#9fb6c0', .45, .3), doorEdge = std('#7a909a', .4, .5);
  box(.1, 1.8, .08, steel, 'or_door_frame_head', 'metal', DX - .02, DY, 2.22); for (const s of [-1, 1]) box(.1, .08, 2.22, steel, 'or_door_frame_jamb', 'metal', DX - .02, DY + s * .86, 1.11);
  // behind the doors: a sea-green OR box, lamp-bright (seen only through the portholes)
  box(.05, 2.0, 2.4, std('#4fa59a', .4), 'or_behind_wall', 'wall', DX + 1.6, DY, 1.2, root, false); { const pt = new THREE.PointLight('#f4fbff', 4, 3.5, 1.2); pt.name = 'or_behind_lamp'; pt.position.copy(V(DX + 1.0, DY, 2.0)); root.add(pt); }
  const porthole = (side) => { const y = DY + side * .41, g = new THREE.Group(); g.name = 'porthole_' + (side < 0 ? 'L' : 'R'); root.add(g);
    box(.06, .8, 2.14, doorM, 'or_door_leaf', 'metal', DX + .03, y, 1.08); box(.065, .02, 2.14, doorEdge, 'or_door_leaf_edge', 'metal', DX + .03, y - side * .39, 1.08, root, false);
    box(.01, .78, .28, steel, 'or_door_kick_plate', 'metal', DX - .005, y, .15, root, false); box(.01, .12, .34, steel, 'or_door_push_plate', 'metal', DX - .005, y - side * .26, 1.12, root, false);
    for (const z of [.4, 1.1, 1.85]) box(.02, .04, .1, steelDk, 'or_door_hinge', 'metal', DX - .01, y + side * .39, z, root, false);
    // the round window: OR light behind, silhouette, glass + ring
    const bgT = canvasTex(THREE, 256, 256, (c, w, h) => { const g2 = c.createRadialGradient(w * .55, h * .3, 10, w / 2, h / 2, 150); g2.addColorStop(0, '#ffffff'); g2.addColorStop(.35, '#d8f4ee'); g2.addColorStop(1, '#4fa59a'); c.fillStyle = g2; c.fillRect(0, 0, w, h);
      c.fillStyle = 'rgba(30,90,80,.5)'; for (let i = 0; i < 6; i++) c.fillRect(0, i * 46, w, 3); for (let i = 0; i < 6; i++) c.fillRect(i * 46, 0, 3, h); });
    const bg = plate(.27, .27, glow('#ffffff', { map: bgT }), 'porthole_or_light', 'glass', pl.ph_front ? DX - .003 : DX + .085, y, PZ, 'x-');   /* S2 key ph_front: the OR view + silhouettes in front of the solid leaf (the leaf has no hole) */ bg.geometry = new THREE.CircleGeometry(.135, 28);
    const sil = new THREE.Group(); sil.position.copy(V(pl.ph_front ? DX - .006 : DX + .07, y, PZ - .06)); sil.rotation.y = -Math.PI / 2; root.add(sil); sil.name = 'porthole_silhouette_' + (side < 0 ? 'shaver' : 'jug');
    const silM = new THREE.MeshBasicMaterial({ color: '#163a36', toneMapped: false });
    const head = new THREE.Mesh(new THREE.CircleGeometry(.045, 18), silM); head.position.set(0, .11, 0); sil.add(head); const capM = new THREE.Mesh(new THREE.CircleGeometry(.05, 18, 0, Math.PI), silM); capM.position.set(0, .125, 0); sil.add(capM);
    const body = new THREE.Mesh(new THREE.PlaneGeometry(.17, .14), silM); body.position.set(0, .0, 0); sil.add(body); const sh = new THREE.Mesh(new THREE.CircleGeometry(.085, 18, 0, Math.PI), silM); sh.position.set(0, .06, 0); sil.add(sh);
    const arm = new THREE.Group(); arm.position.set(side < 0 ? .06 : -.06, .05, .001); sil.add(arm); const fore = new THREE.Mesh(new THREE.PlaneGeometry(.025, .1), silM); fore.position.set(0, -.04, 0); arm.add(fore);
    if (side < 0) { const shaver = new THREE.Mesh(new THREE.PlaneGeometry(.022, .07), silM); shaver.position.set(.0, -.1, 0); arm.add(shaver); const tip = new THREE.Mesh(new THREE.PlaneGeometry(.008, .03), silM); tip.position.set(0, -.145, 0); arm.add(tip); }
    else { const jug = new THREE.Mesh(new THREE.PlaneGeometry(.05, .06), silM); jug.position.set(0, -.1, 0); arm.add(jug); const spout = new THREE.Mesh(new THREE.CircleGeometry(.02, 3), silM); spout.position.set(-.03, -.08, 0); arm.add(spout);
      const pour = new THREE.Mesh(new THREE.PlaneGeometry(.006, .06), new THREE.MeshBasicMaterial({ color: '#8fdcff', toneMapped: false })); pour.position.set(-.035, -.13, 0); arm.add(pour); arm.userData.pour = pour; }
    const glassP = plate(.27, .27, new THREE.MeshBasicMaterial({ color: '#e8fff8', transparent: true, opacity: pl.ph_clear ? 0 : pl.ph_big ? .06 : .16, depthWrite: false }), 'porthole_glass', 'glass', DX - .01, y, PZ, 'x-'); glassP.geometry = new THREE.CircleGeometry(.135, 28);
    const hi = plate(.05, .2, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .35, depthWrite: false }), 'porthole_glint', 'glass', DX - .012, y - .04, PZ + .03, 'x-'); hi.rotation.z = .5; if (pl.ph_clear) hi.visible = false;
    const ring = add(new THREE.TorusGeometry(.14, .018, 8, 28), steel, 'porthole_ring', 'metal', V(DX - .01, y, PZ), root, false); ring.rotation.y = Math.PI / 2;
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; add(new THREE.SphereGeometry(.006, 5, 4), steelDk, 'porthole_screw', 'metal', V(DX - .02, y + Math.cos(a) * .14, PZ + Math.sin(a) * .14), root, false); }
    ph[side < 0 ? 'L' : 'R'] = { sil, arm, at: W(DX, y, PZ), bgT, side }; };
  porthole(-1); porthole(1);
  const signT = canvasTex(THREE, 256, 96, (c, w, h) => { c.fillStyle = '#1d3f8a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffffff'; c.lineWidth = 4; c.strokeRect(6, 6, w - 12, h - 12); c.fillStyle = '#ffffff'; c.font = 'bold 62px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('OR 3', w / 2, h / 2 + 3); });
  plate(.5, .19, std('#ffffff', .5, 0, { map: signT }), 'or3_sign', 'sign', DX - .03, DY, 2.42, 'x-');
  const inUseT = (on) => canvasTex(THREE, 256, 64, (c, w, h) => { c.fillStyle = on ? '#4a2a00' : '#3a3428'; c.fillRect(0, 0, w, h); c.fillStyle = on ? '#ffb020' : '#7a6a50'; c.font = 'bold 42px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('IN USE', w / 2, h / 2 + 2); });
  const inUseOn = pl.in_use !== false; box(.06, .4, .11, steelDk, 'in_use_housing', 'metal', DX - .02, DY, 2.62);
  plate(.36, .09, glow('#ffffff', { map: inUseT(inUseOn) }), 'in_use_light_lens', 'lamp', DX - .055, DY, 2.62, 'x-'); if (inUseOn) { const p = new THREE.PointLight('#ffb020', .8, 1.6, 2); p.position.copy(V(DX - .25, DY, 2.6)); root.add(p); }
  const roomT = canvasTex(THREE, 256, 96, (c, w, h) => { c.fillStyle = '#e8e0c8'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d3f8a'; c.font = 'bold 30px Arial'; c.fillText('AUTHORIZED', 18, 40); c.fillText('STAFF ONLY', 18, 78); });
  plate(.3, .11, std('#ffffff', .5, 0, { map: roomT }), 'or_door_staff_plaque', 'sign', DX - .012, DY - .41, 1.95, 'x-');

  // ---------- THE WALL CLOCK (right wall past the door): settable hands + spin blur ----------
  const CK = [DX - .03, 5.6, 2.15], clockT = canvasTex(THREE, 300, 300, (c, w, h) => { c.fillStyle = '#fbfaf4'; c.beginPath(); c.arc(150, 150, 142, 0, 6.3); c.fill();
    c.fillStyle = '#2a1a1f'; for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30, r1 = i % 5 ? 128 : 118; c.save(); c.translate(150 + Math.cos(a) * r1, 150 + Math.sin(a) * r1); c.rotate(a); c.fillRect(0, -1.5, i % 5 ? 8 : 16, i % 5 ? 3 : 6); c.restore(); }
    c.font = 'bold 34px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; for (let i = 1; i <= 12; i++) { const a = -Math.PI / 2 + i * Math.PI / 6; c.fillText(String(i), 150 + Math.cos(a) * 96, 150 + Math.sin(a) * 96); } c.font = 'bold 14px Arial'; c.fillStyle = '#6a6a70'; c.fillText('QUARTZ', 150, 200); });
  const clockFace = plate(.36, .36, std('#ffffff', .4, 0, { map: clockT }), 'wall_clock_face', 'sign', CK[0], CK[1], CK[2], 'x-'); clockFace.geometry = new THREE.CircleGeometry(.18, 36);
  const rimC = add(new THREE.TorusGeometry(.19, .022, 8, 36), std('#2a2a30', .5), 'wall_clock_rim', 'plastic', V(CK[0] - .01, CK[1], CK[2]), root, false); rimC.rotation.y = Math.PI / 2;
  add(new THREE.CircleGeometry(.18, 36), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .12, depthWrite: false }), 'wall_clock_glass', 'glass', V(CK[0] - .025, CK[1], CK[2]), root, false).rotation.y = -Math.PI / 2;
  const hand = (len, wd, col, name) => { const g = new THREE.Group(); g.position.copy(V(CK[0] - .015, CK[1], CK[2])); g.rotation.y = -Math.PI / 2; root.add(g); const m = new THREE.Mesh(new THREE.PlaneGeometry(wd, len), new THREE.MeshBasicMaterial({ color: col })); m.position.y = len / 2 - .015; m.name = name; g.add(m); return g; };
  const hH = hand(.1, .016, '#1a1418', 'clock_hour_hand'), hM = hand(.15, .011, '#1a1418', 'clock_minute_hand'), hS = hand(.155, .004, '#2a4a8a', 'clock_second_hand');
  add(new THREE.CircleGeometry(.012, 12), glow('#1a1418'), 'clock_hub', 'metal', V(CK[0] - .018, CK[1], CK[2]), root, false).rotation.y = -Math.PI / 2;
  const blurFan = add(new THREE.CircleGeometry(.15, 36), new THREE.MeshBasicMaterial({ color: '#3a3a48', transparent: true, opacity: 0, depthWrite: false }), 'clock_spin_blur', 'fx', V(CK[0] - .017, CK[1], CK[2]), root, false); blurFan.rotation.y = -Math.PI / 2;

  // ---------- LEFT WALL period props: beige phone (row 11), CRT cart, calendar "1994", bulletin board, a door ----------
  const LX = -1.4;
  // the beige wall phone: base plate, handset in its cradle, keypad, coiled cord
  { const y = .35, z = 1.42; box(.06, .17, .24, beige, 'wall_phone_body', 'plastic', LX + .03, y, z); box(.05, .055, .22, beigeDk, 'wall_phone_handset', 'plastic', LX + .085, y - .05, z + .01); box(.06, .07, .05, beigeDk, 'wall_phone_earpiece', 'plastic', LX + .09, y - .05, z + .11); box(.06, .07, .05, beigeDk, 'wall_phone_mouthpiece', 'plastic', LX + .09, y - .05, z - .09);
    for (let i = 0; i < 12; i++) box(.006, .022, .016, std('#f4f0e4', .4), 'wall_phone_key', 'plastic', LX + .062, y + .025 + (i % 3) * .028, z + .07 - Math.floor(i / 3) * .03, root, false);
    const pts = []; for (let i = 0; i <= 60; i++) { const u = i / 60; pts.push(V(LX + .1 + .02 * Math.cos(u * 60), y - .05 + .02 * Math.sin(u * 60), z - .1 - u * .5)); } add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, .004, 4), beigeDk, 'wall_phone_coiled_cord', 'plastic');
    const extT = canvasTex(THREE, 128, 64, (c, w, h) => { c.fillStyle = '#fffbe8'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a1a1f'; c.font = 'bold 18px Arial'; c.fillText('PAGE OP 0', 8, 26); c.fillText('X-RAY 4410', 8, 52); });
    plate(.11, .055, std('#ffffff', .6, 0, { map: extT }), 'phone_extension_list', 'paper', LX + .005, y + .17, z + .02, 'x+'); }
  // the calendar "1994" (row 11): big year, month AUGUST (Texas heat), day grid, a few days crossed off, nail + hanging loop
  { const y = 2.75, z = 1.75, calT = canvasTex(THREE, 300, 420, (c, w, h) => { c.fillStyle = '#fbf6e8'; c.fillRect(0, 0, w, h); c.fillStyle = '#2f7d9a'; c.fillRect(0, 0, w, 150);
      c.fillStyle = '#f3e2a6'; c.beginPath(); c.arc(220, 60, 34, 0, 6.3); c.fill(); c.fillStyle = '#1e5a6a'; c.beginPath(); c.moveTo(0, 150); c.lineTo(80, 90); c.lineTo(150, 130); c.lineTo(220, 80); c.lineTo(300, 150); c.fill();
      c.fillStyle = '#1d3f8a'; c.font = 'bold 74px Arial'; c.textAlign = 'center'; c.fillText('1994', w / 2, 225); c.font = 'bold 30px Arial'; c.fillStyle = '#2a1a1f'; c.fillText('AUGUST', w / 2, 262);
      c.font = 'bold 16px Arial'; ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((d, i) => c.fillText(d, 30 + i * 40, 290)); c.font = '17px Arial';
      for (let d = 1; d <= 31; d++) { const k = d + 0, col = k % 7, row = Math.floor(k / 7); c.fillStyle = '#2a1a1f'; c.fillText(String(d), 30 + col * 40, 316 + row * 22); if (d < 17) { c.strokeStyle = '#2a4a8a'; c.lineWidth = 2; c.beginPath(); c.moveTo(18 + col * 40, 304 + row * 22); c.lineTo(42 + col * 40, 320 + row * 22); c.stroke(); } } });
    plate(.34, .48, std('#ffffff', .7, 0, { map: calT }), 'wall_calendar_1994', 'paper', LX + .005, y, z, 'x+', root, true); add(new THREE.SphereGeometry(.008, 6, 4), steelDk, 'calendar_nail', 'metal', V(LX + .01, y, z + .27), root, false);
    for (let i = 0; i < 4; i++) { const p = plate(.33, .02, std('#e8e0cc', .7), 'calendar_curled_page', 'paper', LX + .012 + i * .004, y, z + .23 - i * .006, 'x+'); p.rotation.z = .02 * i; } }
  // bulletin board: cork, pinned notes, a pastel flyer, a shift rota
  { const y = 4.3, z = 1.75, corkT = canvasTex(THREE, 512, 320, (c, w, h) => { noiseCanvas(c, w, h, '#b88a58', ['#a07444', '#c89c68', '#8a6038'], 6000, 1, 4, R0); c.strokeStyle = '#6a4a2a'; c.lineWidth = 18; c.strokeRect(0, 0, w, h); });
    plate(1.0, .62, std('#ffffff', .9, 0, { map: corkT }), 'bulletin_board_cork', 'wood', LX + .006, y, z, 'x+', root, true);
    const notes = [['#fff4a0', 'STAFF MTG\nTUES 7AM'], ['#bfe0f4', 'ON CALL\nROTA'], ['#f4c8d8', 'PICNIC\nSAT'], ['#ffffff', 'SCRUB\nSIZES'], ['#c8f0d0', 'BOWLING\nNIGHT'], ['#ffe0b0', 'PARKING\nLOT B']];
    notes.forEach(([col, tx], i) => { const nT = canvasTex(THREE, 128, 128, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); c.fillStyle = '#2a2a3a'; c.font = 'bold 20px Arial'; tx.split('\n').forEach((l, k) => c.fillText(l, 10, 40 + k * 28)); for (let k = 0; k < 3; k++) c.fillRect(10, 90 + k * 10, 60 + 40 * R0(), 3); });
      const n = plate(.18, .18, std('#ffffff', .8, 0, { map: nT }), 'bulletin_note', 'paper', LX + .012 + i * .001, y - .36 + (i % 3) * .3 + rr(-.03, .03), z + (i < 3 ? .14 : -.12), 'x+'); n.rotation.z = rr(-.12, .12);
      add(new THREE.SphereGeometry(.009, 6, 4), std(['#2a6ad0', '#f2c230', '#2aa04a'][i % 3], .4), 'push_pin', 'plastic', V(LX + .02, y - .36 + (i % 3) * .3, z + (i < 3 ? .21 : -.05)), root, false); }); }
  // the boxy CRT on its steel cart (row 11): 14-inch beige CRT, screen with the OR schedule in green text, VCR below, cables, casters
  { const y = 1.55, cx = LX + .38, g = new THREE.Group(); g.name = 'crt_cart'; root.add(g);
    box(.5, .62, .03, steel, 'crt_cart_top', 'metal', cx, y, .92, g); box(.5, .62, .03, steel, 'crt_cart_shelf', 'metal', cx, y, .45, g); box(.5, .62, .03, steel, 'crt_cart_low_shelf', 'metal', cx, y, .14, g);
    for (const [dx, dy] of [[-.23, -.29], [.23, -.29], [-.23, .29], [.23, .29]]) { bar([cx + dx, y + dy, .1], [cx + dx, y + dy, .93], .012, steel, 'crt_cart_post', 'metal', g); add(new THREE.SphereGeometry(.035, 8, 6), rubber, 'crt_cart_caster', 'rubber', V(cx + dx, y + dy, .04), g); box(.02, .04, .05, steelDk, 'caster_fork', 'metal', cx + dx, y + dy, .08, g, false); }
    box(.42, .42, .36, beige, 'crt_monitor_body', 'plastic', cx + .02, y, 1.12, g); box(.34, .34, .3, beigeDk, 'crt_monitor_back_bulge', 'plastic', cx - .14, y, 1.11, g);
    const scrT = canvasTex(THREE, 320, 240, (c, w, h) => { c.fillStyle = '#0a2a1a'; c.fillRect(0, 0, w, h); c.fillStyle = '#5aff8a'; c.font = 'bold 18px monospace'; ['OR SCHEDULE  08/16/94', '--------------------', 'OR 1  0700 ARTHRO KNEE', 'OR 2  0730 ARTHRO KNEE', 'OR 3  0715 ARTHRO KNEE', 'OR 4  0800 ARTHRO KNEE', 'OR 3  0900 ARTHRO KNEE', '>_'].forEach((l, i) => c.fillText(l, 12, 26 + i * 27));
      c.fillStyle = 'rgba(0,0,0,.25)'; for (let j = 0; j < h; j += 3) c.fillRect(0, j, w, 1); });
    const scr = plate(.31, .24, glow('#ffffff', { map: scrT }), 'crt_screen_schedule', 'lamp', cx + .232, y, 1.13, 'x+', g); scr.userData.scan = true;
    box(.02, .36, .06, beigeDk, 'crt_bezel_chin', 'plastic', cx + .235, y, .97, g); add(new THREE.SphereGeometry(.008, 6, 4), glow('#5aff6a'), 'crt_power_led', 'lamp', V(cx + .245, y + .14, .97), g, false);
    for (let i = 0; i < 3; i++) add(new THREE.CylinderGeometry(.01, .01, .012, 8), beigeDk, 'crt_knob', 'plastic', V(cx + .245, y - .05 - i * .04, .97), g, false).rotation.z = Math.PI / 2;
    box(.36, .4, .09, std('#2a2a30', .5), 'vcr_body', 'plastic', cx, y, .52, g); const vcrT = canvasTex(THREE, 256, 64, (c, w, h) => { c.fillStyle = '#26262c'; c.fillRect(0, 0, w, h); c.fillStyle = '#111'; c.fillRect(20, 18, 130, 22); c.fillStyle = '#5ac8ff'; c.font = 'bold 18px monospace'; c.fillText('12:00', 170, 36); c.fillStyle = '#888'; c.font = '10px Arial'; c.fillText('VHS', 22, 56); });
    plate(.36, .09, std('#ffffff', .5, 0, { map: vcrT }), 'vcr_front', 'plastic', cx + .182, y, .52, 'x+', g);
    for (let i = 0; i < 4; i++) box(.1, .19, .025, std(['#1a1a20', '#2a2a40', '#1a1a20', '#3a2a20'][i], .6), 'vhs_tape', 'plastic', cx - .05, y - .2 + i * .1, .17 + .0125, g);
    const cab = []; for (let i = 0; i <= 10; i++) { const u = i / 10; cab.push(V(cx - .25 + u * .05, y + .2 - u * .3, 1.0 - u * .95 + .15 * Math.sin(u * 3))); } add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cab), 30, .008, 5), rubber, 'crt_power_cable', 'rubber', null, g); }
  // a door into a side room (left wall, near): wood-look door, steel frame, room plaque, kick plate, lever handle
  { const y = -1.9; box(.05, .95, 2.1, std('#b08a5a', .55), 'side_door_leaf', 'wood', LX + .03, y, 1.05); box(.07, 1.05, .06, steel, 'side_door_frame_head', 'metal', LX + .02, y, 2.13); for (const s of [-1, 1]) box(.07, .05, 2.13, steel, 'side_door_frame_jamb', 'metal', LX + .02, y + s * .5, 1.06);
    bar([LX + .08, y + .36, 1.02], [LX + .08, y + .22, 1.02], .012, chrome, 'side_door_lever'); box(.01, .9, .25, steel, 'side_door_kick_plate', 'metal', LX + .058, y, .15, root, false);
    const plT = canvasTex(THREE, 256, 96, (c, w, h) => { c.fillStyle = '#1d3f8a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.font = 'bold 34px Arial'; c.fillText('SOILED', 20, 42); c.fillText('UTILITY', 20, 80); });
    plate(.24, .09, std('#ffffff', .5, 0, { map: plT }), 'side_door_plaque', 'sign', LX + .01, y + .62, 1.55, 'x+'); }
  // the drinking fountain (beige enamel, chrome bubbler) and a paper-towel dispenser
  { const y = 8.3; box(.3, .38, .2, beige, 'drinking_fountain_bowl', 'ceramic', -1.24, y + 2.2, .9); add(new THREE.CylinderGeometry(.012, .016, .05, 8), chrome, 'fountain_bubbler', 'metal', V(-1.2, y + 2.2, 1.02)); box(.05, .06, .03, chrome, 'fountain_button', 'metal', -1.1, y + 2.2, .92); }
  // linen cart (left, near the bay): steel frame, folded sheets white + pale blue, a blue cover hanging
  if (!pl.linen_cart_off) { const x = -1.05, y = 4.9; box(.5, .8, .03, steel, 'linen_cart_top', 'metal', x, y, 1.45); for (const z of [.25, .7, 1.1]) box(.5, .8, .02, steel, 'linen_cart_shelf', 'metal', x, y, z);
    for (const [dx, dy] of [[-.23, -.38], [.23, -.38], [-.23, .38], [.23, .38]]) { bar([x + dx, y + dy, .08], [x + dx, y + dy, 1.46], .012, steel, 'linen_cart_post'); add(new THREE.SphereGeometry(.035, 8, 6), rubber, 'linen_cart_caster', 'rubber', V(x + dx, y + dy, .04)); }
    for (const z of [.27, .72, 1.12]) for (let i = 0; i < 4; i++) { const col = ['#f6f4ee', '#cfe2f4', '#f6f4ee', '#e8f0e0'][(i + Math.round(z * 10)) % 4]; box(.42, .17, .06, std(col, .9), 'folded_sheet', 'cloth', x, y - .28 + i * .19, z + .04); box(.42, .005, .055, std('#d8d6cc', .9), 'sheet_fold_line', 'cloth', x, y - .28 + i * .19 - .086, z + .04, root, false); }
    const cv = add(new THREE.PlaneGeometry(.5, .5, 8, 8), std('#5a8ac8', .9, 0, { side: THREE.DoubleSide }), 'linen_cart_cover_flap', 'cloth', V(x + .26, y, 1.2)); cv.rotation.y = Math.PI / 2; const cp = cv.geometry.attributes.position; for (let i = 0; i < cp.count; i++) cp.setZ(i, .015 * Math.sin(cp.getX(i) * 30)); cp.needsUpdate = true; cv.geometry.computeVertexNormals(); }
  // wheelchair parked by the window (steel frame, black vinyl, big wheels with spokes)
  const wheelchair = (x, y, yaw) => { const g = new THREE.Group(); g.name = 'wheelchair'; g.position.copy(V(x, y, 0)); g.rotation.y = yaw; root.add(g); const Vl = (a, b, c) => new THREE.Vector3(a, c, -b);
    const vin = std('#1e1e24', .5); const s1 = new THREE.Mesh(new THREE.BoxGeometry(.44, .03, .42), vin); s1.position.copy(Vl(0, 0, .5)); g.add(s1); const bk = new THREE.Mesh(new THREE.BoxGeometry(.44, .4, .03), vin); bk.position.copy(Vl(0, .22, .78)); g.add(bk);
    for (const s of [-1, 1]) { const wh = new THREE.Mesh(new THREE.TorusGeometry(.29, .018, 8, 32), rubber); wh.position.copy(Vl(s * .26, .08, .3)); wh.rotation.y = Math.PI / 2; g.add(wh); const hr = new THREE.Mesh(new THREE.TorusGeometry(.26, .006, 6, 32), chrome); hr.position.copy(Vl(s * .28, .08, .3)); hr.rotation.y = Math.PI / 2; g.add(hr);
      for (let k = 0; k < 12; k++) { const sp = new THREE.Mesh(new THREE.CylinderGeometry(.002, .002, .56, 3), chrome); sp.position.copy(Vl(s * .26, .08, .3)); sp.rotation.x = k * Math.PI / 12; g.add(sp); }
      const cst = new THREE.Mesh(new THREE.TorusGeometry(.07, .015, 6, 16), rubber); cst.position.copy(Vl(s * .2, -.3, .08)); cst.rotation.y = Math.PI / 2; g.add(cst);
      const pst = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .5, 8), chrome); pst.position.copy(Vl(s * .23, .24, .75)); g.add(pst); const ar = new THREE.Mesh(new THREE.BoxGeometry(.05, .03, .36), vin); ar.position.copy(Vl(s * .23, .02, .7)); g.add(ar);
      const fr = new THREE.Mesh(new THREE.BoxGeometry(.1, .01, .1), steelDk); fr.position.copy(Vl(s * .1, -.36, .12)); g.add(fr); }
    g.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.name = o.name || 'wheelchair_part'; o.userData.role = 'metal'; } }); };
  wheelchair(-.9, 10.9, .5);
  // CAUTION WET FLOOR sign (yellow A-frame; the wet sheen patch by the window)
  if (pl.wet !== false) { const cT = canvasTex(THREE, 128, 256, (c, w, h) => { c.fillStyle = '#ffd21a'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a1a'; c.font = 'bold 24px Arial'; c.textAlign = 'center'; c.fillText('CAUTION', w / 2, 40); c.font = 'bold 20px Arial'; c.fillText('WET', w / 2, 190); c.fillText('FLOOR', w / 2, 216);
      c.beginPath(); c.moveTo(w / 2, 60); c.lineTo(w / 2 + 40, 150); c.lineTo(w / 2 - 40, 150); c.closePath(); c.lineWidth = 6; c.stroke(); c.fillText('!', w / 2, 140); });
    for (const s of [-1, 1]) { const p = add(new THREE.PlaneGeometry(.3, .6), std('#ffffff', .5, 0, { map: cT, side: THREE.DoubleSide }), 'caution_wet_floor_panel', 'plastic', V(.7, 10.6 + s * .09, .3)); p.rotation.x = s * .3; if (s > 0) p.rotation.y = Math.PI; }
    const wet = add(new THREE.CircleGeometry(.8, 28), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .02, metalness: .4, transparent: true, opacity: .18, depthWrite: false }), 'wet_floor_sheen', 'water', V(.2, 10.8, .003), root, false); wet.rotation.x = -Math.PI / 2; wet.scale.set(1.4, .7, 1);
    box(.28, .28, .3, std('#f2c230', .6), 'mop_bucket', 'plastic', 1.1, 11.3, .18); bar([1.1, 11.3, .2], [1.0, 11.6, 1.3], .012, std('#c8a060', .6), 'mop_handle', 'wood'); }
  // a ficus in a pot by the window (leafy clumps, not a ball tree)
  { const px = -1.05, py = 11.55; add(new THREE.CylinderGeometry(.2, .16, .36, 16), std('#c8a070', .7), 'ficus_pot', 'ceramic', V(px, py, .18)); add(new THREE.CylinderGeometry(.19, .19, .02, 16), std('#5a4030', .9), 'ficus_soil', 'soil', V(px, py, .35));
    bar([px, py, .35], [px + .05, py, 1.4], .02, std('#8a6a48', .8), 'ficus_trunk', 'wood'); const leafM = [std('#3a7a3a', .7), std('#4a9a4a', .7), std('#2a6a3a', .7)];
    for (let i = 0; i < 26; i++) { const a = rr(0, 6.3), r = rr(.08, .32), z = rr(.95, 1.7); const cl = add(new THREE.IcosahedronGeometry(rr(.07, .13), 0), leafM[i % 3], 'ficus_leaf_clump', 'leaf', V(px + Math.cos(a) * r, py + Math.sin(a) * r * .7, z)); cl.scale.set(1, .6, 1); cl.rotation.set(rr(0, 3), rr(0, 3), 0); } }

  // ---------- THE GURNEYS: one detailed gurney builder; the queue along the right wall and ROUND THE CORNER ----------
  const sheetM = std('#f6f4ee', .9), padM = std('#5a7aa8', .7), blanketM = [std('#cfe2f4', .9), std('#e8dcc8', .9), std('#d8e8d8', .9)];
  const gurney = (name, parent, scale = 1, lite = false, k = 0) => { const g = new THREE.Group(); g.name = name; parent.add(g); const P = (a, b, c) => new THREE.Vector3(a, c, -b);
    const mk = (geo, m, nm, x, y, z, role = 'metal') => { const o = new THREE.Mesh(geo, m); o.position.copy(P(x, y, z)); o.name = nm; o.userData.role = role; o.castShadow = o.receiveShadow = true; g.add(o); return o; };
    mk(new THREE.BoxGeometry(1.9, .06, .62), steel, 'gurney_frame', 0, 0, .62); mk(new THREE.BoxGeometry(1.8, .1, .58), padM, 'gurney_mattress', 0, 0, .7, 'vinyl'); mk(new THREE.BoxGeometry(1.84, .02, .64), sheetM, 'gurney_sheet', 0, 0, .755, 'cloth');
    mk(new THREE.BoxGeometry(.4, .1, .4), sheetM, 'gurney_pillow', -.72, 0, .8, 'cloth').rotation.z = .25;
    // the drape with THE BENT-KNEE PEAK (a tented cone) and the other leg flat
    const bl = mk(new THREE.BoxGeometry(1.1, .04, .62), blanketM[k % 3], 'gurney_blanket', .25, 0, .78, 'cloth'); const peak = mk(new THREE.ConeGeometry(.17, .32, 10), blanketM[k % 3], 'gurney_knee_peak', .3, -.12, .93, 'cloth'); peak.scale.set(1, 1, .9);
    if (lite) { for (const [x, y] of [[-.8, -.24], [-.8, .24], [.8, -.24], [.8, .24]]) mk(new THREE.BoxGeometry(.05, .12, .05), rubber, 'gurney_caster', x, y, .08, 'rubber'); mk(new THREE.BoxGeometry(.08, .5, .08), steelDk, 'gurney_column', 0, 0, .35); g.scale.setScalar(scale); return g; }
    for (const s of [-1, 1]) { mk(new THREE.BoxGeometry(1.3, .02, .02), chrome, 'gurney_side_rail', 0, s * .33, .9); for (const x of [-.6, -.2, .2, .6]) mk(new THREE.CylinderGeometry(.008, .008, .16, 6), chrome, 'gurney_rail_post', x, s * .33, .82); }
    mk(new THREE.CylinderGeometry(.015, .015, .62, 8), chrome, 'gurney_push_bar', -.98, 0, .95).rotation.x = Math.PI / 2; for (const s of [-1, 1]) mk(new THREE.CylinderGeometry(.015, .015, .3, 8), chrome, 'gurney_push_post', -.95, s * .3, .8);
    for (const x of [-.6, .6]) { mk(new THREE.CylinderGeometry(.03, .04, .5, 10), steelDk, 'gurney_column', x, 0, .35); mk(new THREE.BoxGeometry(.06, .04, .55), steelDk, 'gurney_base_bar', x, 0, .12); }
    mk(new THREE.BoxGeometry(1.3, .04, .08), steelDk, 'gurney_base_spine', 0, 0, .12); mk(new THREE.BoxGeometry(.3, .03, .2), steelDk, 'gurney_pedal', .1, .2, .1);
    for (const [x, y] of [[-.8, -.24], [-.8, .24], [.8, -.24], [.8, .24]]) { const w = mk(new THREE.CylinderGeometry(.06, .06, .04, 14), rubber, 'gurney_caster_wheel', x, y, .06, 'rubber'); w.rotation.x = Math.PI / 2; mk(new THREE.BoxGeometry(.03, .06, .05), steel, 'gurney_caster_fork', x, y, .11); }
    const chT = canvasTex(THREE, 64, 96, (c, w, h) => { c.fillStyle = '#f8f4e8'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a2a3a'; for (let i = 0; i < 7; i++) c.fillRect(6, 14 + i * 11, 40 + (i * 13) % 14, 3); c.fillStyle = '#8a8a90'; c.fillRect(20, 0, 24, 8); });
    const ch = mk(new THREE.PlaneGeometry(.16, .22), std('#ffffff', .7, 0, { map: chT, side: THREE.DoubleSide }), 'gurney_chart_clipboard', 'paper', .96, 0, .78); ch.rotation.y = Math.PI / 2; ch.rotation.x = .15;
    if (k % 3 === 1) { mk(new THREE.CylinderGeometry(.01, .01, 1.2, 6), chrome, 'gurney_iv_pole', -.9, .25, 1.4); mk(new THREE.BoxGeometry(.12, .18, .03), std('#dff0f8', .3, 0, { transparent: true, opacity: .8 }), 'gurney_iv_bag', -.9, .25, 1.85, 'plastic'); }
    g.scale.setScalar(scale); return g; };
  const QN = 12, gurneys = [], gAnch = {};
  // the queue path: from the OR door back along the right wall to the corner, then round it into the branch
  const QS = pl.queue_side || null;   // v5 S2 key: [[x, y, yawDeg], ...] per slot (overrides the default slots; side-on gurneys so the reclined cards lie ALONG them)
  const qSlot0 = i => i < 4 ? { x: .78, y: 5.0 + i * 1.2, yaw: Math.PI / 2 } : i < 5 ? { x: 1.35, y: 9.95, yaw: Math.PI / 4 } : { x: 2.4 + (i - 5) * 1.05, y: 10.75, yaw: 0 };
  const qSlot = i => (QS && QS[i]) ? { x: QS[i][0], y: QS[i][1], yaw: QS[i][2] * Math.PI / 180 } : qSlot0(i);
  let gurneyFrom = 'own';
  for (let i = 0; i < QN; i++) { const s = qSlot(i), yaw = s.yaw + (i % 2 ? .04 : -.03); let g = null;
    try { if (HP && HP.buildGurney && HP.place) { const o = HP.buildGurney(THREE, ctx, { hump: true }); HP.place(THREE, root, ctx, o, W(s.x, s.y, 0), yaw * 180 / Math.PI); g = o.group; g.name = 'queue_gurney_' + i; gurneyFrom = 'hero_props'; } } catch (e) { console.warn('corridor: buildGurney ' + e.message); g = null; }
    if (!g) { g = gurney('queue_gurney_' + i, root, 1, false, i); g.position.copy(V(s.x, s.y, 0)); g.rotation.y = yaw; }
    if (pl.gurney_back && pl.gurney_back[i] != null) {   // v5 S2 key gurney_back: { slot: hingeX } raised head section (35 deg) + pillow, hinged at gurney-local x (head end = -x), deck top .87
      const hxl = pl.gurney_back[i], A = 35 * Math.PI / 180, Lb = .95, bk = new THREE.Group(); bk.name = 'gurney_backrest'; g.add(bk);
      g.traverse(o => { if (o.name === 'gurney_pillow') o.visible = false; });
      const vin = new THREE.MeshStandardMaterial({ color: '#3a5a8a', roughness: .6 }), cl = new THREE.MeshStandardMaterial({ color: '#f4f6f2', roughness: .9 }), stl = new THREE.MeshStandardMaterial({ color: '#8a94a4', roughness: .4, metalness: .6 });
      const plate = new THREE.Mesh(new THREE.BoxGeometry(Lb, .08, .56), vin); plate.name = 'gurney_backrest_pad'; plate.position.set(hxl - Math.cos(A) * Lb / 2, .87 + Math.sin(A) * Lb / 2 - .02, 0); plate.rotation.z = -A; bk.add(plate);
      const pil = new THREE.Mesh(new THREE.CapsuleGeometry(.08, .3, 6, 12), cl); pil.name = 'gurney_backrest_pillow'; pil.rotation.x = Math.PI / 2; pil.scale.set(1.3, 1, .8); pil.position.set(hxl - Math.cos(A) * (Lb - .14), .87 + Math.sin(A) * (Lb - .14) + .07, 0); bk.add(pil);
      const st = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, .5, 8), stl); st.name = 'gurney_backrest_strut'; st.position.set(hxl - Math.cos(A) * Lb * .6, .87 + .18, 0); st.rotation.z = .5; bk.add(st);
      bk.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.userData.role = o.userData.role || 'prop'; } });
      if (pl.drape_dx) g.traverse(o => { if (o.name === 'gurney_drape') o.position.x += pl.drape_dx; });
    }
    if (pl.queue_lie && pl.queue_lie.includes(i)) g.traverse(o => { if (o.name === 'gurney_drape' || /side_rail/.test(o.name)) o.visible = false; });   // v6 S2 key queue_lie (rails down: the near rail crossed a lying face): [slots] a patient LIES ON HIS BACK on this flat gurney (film.js lying path): no drape over him, pillow kept
    g.visible = false; gurneys.push(g);
    // yaw: gurney local +x = head->foot; local x maps to plan x rotated by yaw; head end = local x -0.72
    const hx = s.x - Math.cos(s.yaw) * .72, hy = s.y - Math.sin(s.yaw) * .72, kx = s.x + Math.cos(s.yaw) * .3 + Math.sin(s.yaw) * .12, ky = s.y + Math.sin(s.yaw) * .3 - Math.cos(s.yaw) * .12;
    gAnch['gurney_' + i] = { at: W(s.x, s.y, 0), head: W(hx, hy, .95), knee: W(kx, ky, 1.08), yaw: s.yaw }; }
  // IN-SITU gurney head ends point TOWARD the OR door (yaw pi/2 puts the head at -y = toward the door)

  // ---------- THE PRE-OP BAY (x -4.6..-1.4, y 5.6..9.0) ----------
  const BX0 = -4.6, BX1 = -1.4, BY0 = 5.6, BY1 = 9.0, preWin = pl.preop || 'morning';
  wallX(BY0, BX0, BX1, 'y+', 'bay_near_wall'); wallX(BY1, BX0, BX1, 'y-', 'bay_far_wall');
  // the far-left wall with the SOFT SIDE WINDOW (frosted glow, sheer, sill)
  const SWY0 = 6.3, SWY1 = 8.3, SWZ0 = .95, SWZ1 = 2.25;
  box(WT, BY1 - BY0, SWZ0, dadoM, 'bay_window_wall_dado', 'wall', BX0 - WT / 2, (BY0 + BY1) / 2, SWZ0 / 2, root, false); box(WT, BY1 - BY0, CZ - SWZ1, wallM, 'bay_window_wall_head', 'wall', BX0 - WT / 2, (BY0 + BY1) / 2, SWZ1 + (CZ - SWZ1) / 2, root, false);
  for (const [a, b] of [[BY0, SWY0], [SWY1, BY1]]) box(WT, b - a, SWZ1 - SWZ0, wallM, 'bay_window_wall_side', 'wall', BX0 - WT / 2, (a + b) / 2, (SWZ0 + SWZ1) / 2, root, false);
  const swT = canvasTex(THREE, 256, 256, (c, w, h) => { const g2 = c.createLinearGradient(0, 0, 0, h); g2.addColorStop(0, preWin === 'noon' ? '#fffaf0' : '#e8f2ff'); g2.addColorStop(1, preWin === 'noon' ? '#fff0c8' : '#fff0d8'); c.fillStyle = g2; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(120,150,120,.35)'; for (let i = 0; i < 20; i++) { c.beginPath(); c.arc(R0() * w, h * .75 + R0() * 40, 20 + R0() * 30, 0, 6.3); c.fill(); } });
  plate(SWY1 - SWY0, SWZ1 - SWZ0, glow('#ffffff', { map: swT }), 'bay_window_soft_sky', 'glass', BX0 - .03, (SWY0 + SWY1) / 2, (SWZ0 + SWZ1) / 2, 'x+');
  for (const y of [SWY0, (SWY0 + SWY1) / 2, SWY1]) box(.05, .05, SWZ1 - SWZ0, steel, 'bay_window_mullion', 'metal', BX0 + .01, y, (SWZ0 + SWZ1) / 2); for (const z of [SWZ0, SWZ1]) box(.05, SWY1 - SWY0, .05, steel, 'bay_window_frame', 'metal', BX0 + .01, (SWY0 + SWY1) / 2, z);
  box(.2, SWY1 - SWY0 + .1, .04, std('#e8e0c8', .4), 'bay_window_sill', 'stone', BX0 + .1, (SWY0 + SWY1) / 2, SWZ0);
  const sheerG = new THREE.PlaneGeometry(SWY1 - SWY0 + .2, SWZ1 - SWZ0 + .1, 30, 4), sp = sheerG.attributes.position; for (let i = 0; i < sp.count; i++) sp.setZ(i, .03 * Math.sin(sp.getX(i) * 18)); sheerG.computeVertexNormals();
  const sheer = add(sheerG, new THREE.MeshStandardMaterial({ color: '#fffaf0', transparent: true, opacity: .45, side: THREE.DoubleSide, roughness: 1, emissive: '#fff4e0', emissiveIntensity: .35 }), 'bay_window_sheer', 'cloth', V(BX0 + .12, (SWY0 + SWY1) / 2, (SWZ0 + SWZ1) / 2 + .02), root, false); sheer.rotation.y = Math.PI / 2;
  const sideSun = new THREE.DirectionalLight(preWin === 'noon' ? '#fff2c0' : '#ffe8c8', 1.1); sideSun.position.copy(V(BX0 - 6, 7.2, 3.2)); sideSun.target.position.copy(V(-2.6, 7.3, .4)); sideSun.castShadow = true; { const s = sideSun.shadow.camera; s.left = -3; s.right = 3; s.top = 3; s.bottom = -3; } root.add(sideSun, sideSun.target);
  // the 1990s PASTEL PRINT curtain (mauve + teal squiggles, confetti triangles on cream), pleated, on a ceiling rail with hooks
  const curT = canvasTex(THREE, 512, 512, (c, w, h) => { c.fillStyle = '#f4ead8'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { c.strokeStyle = ['#a87ab0', '#2aa0a0', '#c89ac8', '#5ab8b0'][i % 4]; c.lineWidth = 7; c.lineCap = 'round'; const x = R0() * w, y = R0() * h; c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x + 20, y - 30, x + 40, y + 30, x + 60, y); c.stroke(); }
    for (let i = 0; i < 90; i++) { c.fillStyle = ['#8a5aa0', '#1e8a8a', '#e8c0e0', '#f2c230'][i % 4]; const x = R0() * w, y = R0() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 14, y + 4); c.lineTo(x + 4, y + 14); c.fill(); }
    for (let i = 0; i < 60; i++) { c.fillStyle = 'rgba(90,60,110,.6)'; c.beginPath(); c.arc(R0() * w, R0() * h, 4, 0, 6.3); c.fill(); } c.fillStyle = '#c8b8d8'; c.fillRect(0, 0, w, 26); }, [3, 1]);
  const curM = new THREE.MeshStandardMaterial({ map: curT, roughness: .95, side: THREE.DoubleSide });
  const RAILX = BX1 - .15, curtains = [];
  bar([RAILX, BY0 + .1, CZ - .1], [RAILX, BY1 - .1, CZ - .1], .014, steel, 'curtain_rail'); bar([RAILX, BY0 + .1, CZ - .1], [BX0 + .2, BY0 + .1, CZ - .1], .014, steel, 'curtain_rail_return');
  for (const y of [BY0 + .3, (BY0 + BY1) / 2, BY1 - .3]) bar([RAILX, y, CZ - .1], [RAILX, y, CZ], .006, steel, 'curtain_rail_hanger');
  const curtain = (y0, len, name, along = 'y') => { const nP = Math.max(8, Math.round(len * 18)), geo = new THREE.PlaneGeometry(len, 2.15, nP * 2, 6), p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const u = p.getX(i); p.setZ(i, .05 * Math.sin(u / len * nP * Math.PI)); } geo.computeVertexNormals(); geo.userData.base = Float32Array.from(p.array);
    const m = add(geo, curM, name, 'cloth', along === 'y' ? V(RAILX, y0 + len / 2, CZ - .1 - 1.1) : V(y0 + len / 2, BY0 + .1, CZ - .1 - 1.1)); if (along === 'y') m.rotation.y = Math.PI / 2;
    for (let i = 0; i <= nP; i++) { const t = y0 + i * len / nP; add(new THREE.TorusGeometry(.012, .003, 4, 10), steel, 'curtain_hook', 'metal', along === 'y' ? V(RAILX, t, CZ - .1) : V(t, BY0 + .1, CZ - .1), root, false); }
    curtains.push(m); return m; };
  const cl = Math.max(.25, Math.min(1, pl.curtain ?? .55)), openLen = BY1 - BY0 - .2;
  curtain(BY0 + .1, openLen * cl, 'preop_curtain_front'); curtain(BX0 + .25, BX1 - BX0 - .45, 'preop_curtain_divider', 'x');
  // headwall: oxygen + vacuum outlets, a flowmeter, the BP gauge, call button, light switch
  { const y = BY1 - .05; box(1.4, .04, .22, std('#e8e0c8', .5), 'headwall_panel', 'plastic', -3.2, y, 1.55);
    for (const [x, col, lb] of [[-3.7, '#2aa04a', 'O2'], [-3.45, '#f4f4f0', 'VAC'], [-3.2, '#f2c230', 'AIR']]) { add(new THREE.CylinderGeometry(.03, .03, .03, 12), std(col, .4), 'gas_outlet_' + lb, 'plastic', V(x, y - .03, 1.55)).rotation.x = Math.PI / 2; }
    add(new THREE.CylinderGeometry(.018, .018, .16, 10), new THREE.MeshStandardMaterial({ color: '#e8fff0', transparent: true, opacity: .6 }), 'o2_flowmeter_tube', 'glass', V(-3.7, y - .07, 1.42)); add(new THREE.SphereGeometry(.008, 6, 4), std('#2a6ad0', .3), 'flowmeter_ball', 'plastic', V(-3.7, y - .07, 1.4));
    const bpT = canvasTex(THREE, 128, 128, (c, w, h) => { c.fillStyle = '#f8f8f0'; c.beginPath(); c.arc(64, 64, 60, 0, 6.3); c.fill(); c.strokeStyle = '#2a2a30'; c.lineWidth = 4; c.stroke(); c.lineWidth = 2; for (let i = 0; i < 30; i++) { const a = Math.PI * .75 + i * Math.PI * 1.5 / 29; c.beginPath(); c.moveTo(64 + Math.cos(a) * 46, 64 + Math.sin(a) * 46); c.lineTo(64 + Math.cos(a) * 54, 64 + Math.sin(a) * 54); c.stroke(); }
      c.strokeStyle = '#1a1a20'; c.lineWidth = 3; c.beginPath(); c.moveTo(64, 64); c.lineTo(30, 40); c.stroke(); c.fillStyle = '#2a2a30'; c.font = 'bold 12px Arial'; c.fillText('mmHg', 48, 100); });
    box(.2, .05, .22, std('#c8ccd2', .5), 'bp_gauge_housing', 'metal', -2.75, y - .02, 1.7); plate(.17, .17, std('#ffffff', .4, 0, { map: bpT }), 'bp_gauge_dial', 'sign', -2.75, y - .05, 1.72, 'y-').geometry = new THREE.CircleGeometry(.085, 24);
    const cuff = []; for (let i = 0; i <= 12; i++) { const u = i / 12; cuff.push(V(-2.75 + .05 * Math.sin(u * 9), y - .06 - u * .05, 1.6 - u * .5)); } add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cuff), 40, .006, 5), std('#2a2a30', .6), 'bp_cuff_hose', 'rubber'); box(.16, .04, .12, std('#3a5a8a', .8), 'bp_cuff', 'cloth', -2.72, y - .08, 1.05); }
  // the visitor chair (1990s teal vinyl, beige frame) + the patient's side table (beige laminate, drawer, water pitcher in mauve, cup, tissue box)
  const CH = [-3.35, 7.55], CHY = -Math.PI / 2 - .5; { const g = new THREE.Group(); g.name = 'preop_chair'; g.position.copy(V(CH[0], CH[1], 0)); g.rotation.y = CHY; root.add(g); const Pc = (a, b, c) => new THREE.Vector3(a, c, -b);
    const vin = std('#2a9a98', .45), fr = std('#c8b898', .5, .2); const mk = (geo, m, nm, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.copy(Pc(x, y, z)); o.name = nm; o.userData.role = 'furniture'; o.castShadow = o.receiveShadow = true; g.add(o); return o; };
    mk(new THREE.BoxGeometry(.5, .1, .48), vin, 'chair_seat_cushion', 0, 0, .46); const bk = mk(new THREE.BoxGeometry(.5, .5, .08), vin, 'chair_back_cushion', 0, .26, .78); bk.rotation.x = -.12;
    for (const s of [-1, 1]) { mk(new THREE.BoxGeometry(.06, .05, .46), fr, 'chair_arm', s * .29, 0, .66); mk(new THREE.BoxGeometry(.04, .66, .04), fr, 'chair_front_leg', s * .27, -.2, .33); mk(new THREE.BoxGeometry(.04, .9, .04), fr, 'chair_back_leg', s * .27, .24, .45); }
    for (let i = 0; i < 6; i++) mk(new THREE.SphereGeometry(.012, 6, 4), std('#1e7a78', .4), 'chair_button_tuft', -.15 + (i % 3) * .15, .3, .7 + Math.floor(i / 3) * .2); }
  { const tx = -3.95, ty = 8.45; box(.5, .42, .03, std('#e8dcc0', .3), 'side_table_top', 'laminate', tx, ty, .74); box(.46, .38, .55, std('#d8ccb0', .5), 'side_table_cabinet', 'laminate', tx, ty, .45); box(.4, .02, .13, std('#cfc2a4', .5), 'side_table_drawer', 'laminate', tx, ty - .2, .62); box(.12, .02, .02, chrome, 'drawer_handle', 'metal', tx, ty - .215, .62);
    for (const [dx, dy] of [[-.2, -.16], [.2, -.16], [-.2, .16], [.2, .16]]) add(new THREE.SphereGeometry(.025, 6, 4), rubber, 'side_table_caster', 'rubber', V(tx + dx, ty + dy, .03));
    add(new THREE.CylinderGeometry(.06, .07, .2, 14), std('#b08ab8', .4), 'water_pitcher_mauve', 'plastic', V(tx - .1, ty + .05, .86)); add(new THREE.CylinderGeometry(.065, .065, .02, 14), std('#9a72a8', .4), 'pitcher_lid', 'plastic', V(tx - .1, ty + .05, .97));
    add(new THREE.CylinderGeometry(.03, .025, .08, 10), std('#f4f4f0', .5), 'water_cup', 'plastic', V(tx + .06, ty - .05, .8)); box(.14, .1, .08, std('#bfe0f4', .7), 'tissue_box', 'paper', tx + .14, ty + .1, .79); add(new THREE.ConeGeometry(.03, .06, 5), white, 'tissue_puff', 'paper', V(tx + .14, ty + .1, .85), root, false);
    box(.16, .22, .015, std('#e8e0cc', .7), 'patient_belongings_card', 'paper', tx + .05, ty - .1, .76); }
  // clothes bag on a wall hook "PATIENT BELONGINGS", a framed pastel landscape print, a wall-mounted sharps-free waste bin
  { const bgT = canvasTex(THREE, 256, 320, (c, w, h) => { c.fillStyle = '#eef0f4'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d3f8a'; c.font = 'bold 26px Arial'; c.textAlign = 'center'; c.fillText('PATIENT', w / 2, 60); c.fillText('BELONGINGS', w / 2, 94); c.strokeStyle = '#1d3f8a'; c.lineWidth = 3; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(30, 150 + i * 36); c.lineTo(226, 150 + i * 36); c.stroke(); } });
    const bag = add(new THREE.PlaneGeometry(.34, .44, 6, 6), new THREE.MeshStandardMaterial({ map: bgT, roughness: .5, transparent: true, opacity: .92, side: THREE.DoubleSide }), 'patient_belongings_bag', 'plastic', V(-2.3, BY1 - .07, 1.45)); const bp = bag.geometry.attributes.position; for (let i = 0; i < bp.count; i++) bp.setZ(i, .03 * Math.cos(bp.getX(i) * 9) * (1 - bp.getY(i))); bag.geometry.computeVertexNormals();
    add(new THREE.SphereGeometry(.014, 8, 6), chrome, 'coat_hook_knob', 'metal', V(-2.3, BY1 - .05, 1.72));
    const prT = canvasTex(THREE, 256, 192, (c, w, h) => { const g2 = c.createLinearGradient(0, 0, 0, h); g2.addColorStop(0, '#f0c8d8'); g2.addColorStop(.5, '#f8e0c0'); g2.addColorStop(1, '#a8d8d0'); c.fillStyle = g2; c.fillRect(0, 0, w, h); c.fillStyle = '#6a9a9a'; c.beginPath(); c.moveTo(0, 140); c.quadraticCurveTo(80, 90, 140, 130); c.quadraticCurveTo(200, 160, 256, 120); c.lineTo(256, 192); c.lineTo(0, 192); c.fill();
      c.fillStyle = '#8a6aa0'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(30 + i * 40, 160, 8, 0, 6.3); c.fill(); } c.fillStyle = '#ffffff'; c.beginPath(); c.arc(190, 50, 22, 0, 6.3); c.fill(); });
    box(.62, .03, .48, std('#c8a8c8', .4), 'print_frame_mauve', 'plastic', -3.0, BY0 + .03, 1.75); plate(.56, .42, std('#ffffff', .6, 0, { map: prT }), 'pastel_landscape_print', 'paper', -3.0, BY0 + .05, 1.75, 'y+'); }
  // the cane leaning on the chair (anchor for the props helper; a stand-in shaft until hero_props.js arrives)
  let caneFrom = 'stand-in';
  try { if (HP && HP.buildCane && HP.place) { const cn = HP.buildCane(THREE, ctx, { state: 'new' }); if (cn && cn.group) { HP.place(THREE, root, ctx, cn, W(CH[0] + .32, CH[1] - .28, 0), -30, [0, 0, .12]); caneFrom = 'hero_props'; } } } catch (e) { console.warn('corridor: buildCane ' + e.message); }
  if (caneFrom === 'stand-in') { bar([CH[0] + .32, CH[1] - .3, .02], [CH[0] + .26, CH[1] - .2, .86], .014, std('#8a5a32', .5), 'cane_standin_shaft', 'wood'); const hk = add(new THREE.TorusGeometry(.05, .014, 8, 16, Math.PI), std('#8a5a32', .5), 'cane_standin_crook', 'wood', V(CH[0] + .21, CH[1] - .2, .86)); hk.rotation.y = .5; }
  // a second cubicle beyond the divider (others with clipboards wait there): a glimpse of a curtain and a gurney end
  

  // ---------- OUTSIDE THE BIG WINDOW: hot white sky, car park, the freeway to the horizon, the gurney line (queue_out) ----------
  const out = new THREE.Group(); out.name = 'outside_backdrop'; root.add(out);
  const skyT = canvasTex(THREE, 64, 512, (c, w, h) => { const g2 = c.createLinearGradient(0, 0, 0, h); g2.addColorStop(0, '#d8e8f4'); g2.addColorStop(.45, '#fff4d8'); g2.addColorStop(.75, '#fffaf0'); g2.addColorStop(1, '#fff6e0'); c.fillStyle = g2; c.fillRect(0, 0, w, h); });
  const skyM = new THREE.MeshBasicMaterial({ map: skyT, toneMapped: false, fog: false }), sky = add(new THREE.PlaneGeometry(900, 260), skyM, 'hot_white_sky', 'sky', V(0, 430, 110), out, false);
  const sunG = add(new THREE.CircleGeometry(16, 32), glow('#ffffff', { fog: false }), 'sun_glare_disc', 'lamp', V(70, 420, 70), out, false); add(new THREE.CircleGeometry(40, 32), new THREE.MeshBasicMaterial({ color: '#fff8e0', transparent: true, opacity: .4, toneMapped: false, fog: false, depthWrite: false }), 'sun_glare_halo', 'lamp', V(70, 419, 70), out, false);
  const asphT = canvasTex(THREE, 512, 512, (c, w, h) => { noiseCanvas(c, w, h, '#8a8a88', ['#7a7a78', '#9a9894', '#6a6a68', '#a8a6a0'], 12000, 1, 3, R0); c.fillStyle = '#f4f2ea'; for (let i = 0; i < 8; i++) c.fillRect(i * 64 + 4, 0, 4, 180); c.fillRect(0, 180, w, 4); for (let i = 0; i < 8; i++) c.fillRect(i * 64 + 4, 330, 4, 182);
    c.fillStyle = 'rgba(40,40,40,.25)'; for (let i = 0; i < 16; i++) { c.beginPath(); c.ellipse(R0() * w, R0() * h, 10 + R0() * 20, 6 + R0() * 10, 0, 0, 6.3); c.fill(); } }, [6, 4]);
  const ground = add(new THREE.PlaneGeometry(220, 60), std('#ffffff', .9, 0, { map: asphT }), 'car_park_asphalt', 'ground', V(0, 42, -.02), out, false); ground.rotation.x = -Math.PI / 2;
  const grassT = canvasTex(THREE, 256, 256, (c, w, h) => noiseCanvas(c, w, h, '#a8a860', ['#98984e', '#b8b870', '#8a9050', '#c8b878'], 9000, 1, 4, R0), [40, 40]);
  const field = add(new THREE.PlaneGeometry(900, 420), std('#ffffff', 1, 0, { map: grassT }), 'dry_texas_grass', 'ground', V(0, 280, -.05), out, false); field.rotation.x = -Math.PI / 2;
  // the sidewalk + curb right outside, a planter with a palm, light poles, parked 1990s cars (no red: teal, beige, white, navy, gold, sage)
  box(40, 3, .12, std('#d8d2c4', .8), 'sidewalk', 'stone', 0, 14.5, .06, out, false); box(40, .2, .16, std('#c8c0b0', .7), 'curb', 'stone', 0, 16.1, .08, out, false);
  for (let i = 0; i < 6; i++) { const x = -24 + i * 9.5; bar([x, 22, 0], [x, 22, 7], .09, steelDk, 'car_park_light_pole', 'metal', out); box(1.2, .4, .15, steelDk, 'light_pole_head', 'metal', x + .4, 22, 7, out); }
  const carCols = ['#2aa0a0', '#d8c8a0', '#f4f2ea', '#1e2a5a', '#c8a040', '#8aa890', '#6a7aa8', '#e8dcc0'];
  const car = (x, y, col, yaw, pickup) => { const g = new THREE.Group(); g.name = pickup ? 'pickup_truck' : 'parked_sedan_1990s'; g.position.copy(V(x, y, 0)); g.rotation.y = yaw; out.add(g); const m = std(col, .35, .3), gl = std('#3a4a5a', .1, .5);
    const b = new THREE.Mesh(new THREE.BoxGeometry(4.6, .7, 1.8), m); b.position.y = .55; g.add(b); const cab = new THREE.Mesh(new THREE.BoxGeometry(pickup ? 1.6 : 2.4, .6, 1.7), m); cab.position.set(pickup ? -.6 : -.2, 1.15, 0); g.add(cab);
    const win = new THREE.Mesh(new THREE.BoxGeometry(pickup ? 1.5 : 2.3, .45, 1.72), gl); win.position.copy(cab.position).add(new THREE.Vector3(0, .02, 0)); g.add(win);
    for (const [dx, dz] of [[-1.5, .9], [1.5, .9], [-1.5, -.9], [1.5, -.9]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, .25, 14), rubber); w.rotation.x = Math.PI / 2; w.position.set(dx, .34, dz); g.add(w); }
    const bmp = new THREE.Mesh(new THREE.BoxGeometry(.12, .2, 1.8), chrome); bmp.position.set(2.32, .4, 0); g.add(bmp); g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.userData.role = 'car'; o.name = o.name || 'car_part'; } }); return g; };
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { if ((r * 9 + i) % 4 === 3) continue; car(-30 + i * 6.4 + (r % 2) * 2, 26 + r * 9, carCols[(r * 5 + i * 3) % carCols.length], Math.PI / 2 + (R0() < .5 ? 0 : Math.PI), false); }
  // live oaks along the car park edge (leafy clumps)
  const oakM = [std('#4a7a3a', .8), std('#5a8a44', .8), std('#3a6a34', .8)];
  for (let i = 0; i < 9; i++) { const x = (i < 5 ? -46 + i * 6 : 26 + (i - 5) * 6) + rr(-2, 2), y = 54 + rr(-2, 2); bar([x, y, 0], [x + .3, y, 3.2], .3, std('#6a5440', .9), 'oak_trunk', 'wood', out); for (let k = 0; k < 7; k++) { const cl = add(new THREE.IcosahedronGeometry(rr(1.4, 2.4), 1), oakM[k % 3], 'oak_leaf_clump', 'leaf', V(x + rr(-2.5, 2.5), y + rr(-1.5, 1.5), rr(3.6, 5.8)), out); cl.scale.set(1, .7, 1); } }
  // THE FREEWAY: an elevated concrete ribbon that runs straight away to the horizon, piers, barriers, lane lines, light traffic, overhead sign
  const FX = 8, FY0 = 62, FY1 = 400, FZ = 5.5, FW = 16, fwL = FY1 - FY0;
  const roadT = canvasTex(THREE, 256, 1024, (c, w, h) => { noiseCanvas(c, w, h, '#a8a49c', ['#9a968e', '#b8b4aa', '#8a8680'], 9000, 1, 3, R0); c.fillStyle = '#f4f2ea'; for (const x of [64, 128, 192]) for (let y = 0; y < h; y += 64) c.fillRect(x - 2, y, 4, 32); c.fillStyle = '#f2c230'; c.fillRect(8, 0, 4, h); c.fillRect(w - 12, 0, 4, h); }, [1, 30]);
  const road = add(new THREE.PlaneGeometry(FW, fwL), std('#ffffff', .8, 0, { map: roadT }), 'freeway_deck', 'road', V(FX, (FY0 + FY1) / 2, FZ), out, false); road.rotation.x = -Math.PI / 2;
  for (const s of [-1, 1]) box(.4, fwL, .9, std('#d8d2c4', .7), 'freeway_jersey_barrier', 'concrete', FX + s * FW / 2, (FY0 + FY1) / 2, FZ + .45, out, false);
  box(FW + .8, fwL, 1.0, std('#c8c0b0', .8), 'freeway_deck_beam', 'concrete', FX, (FY0 + FY1) / 2, FZ - .5, out, false);
  for (let y = FY0 + 5; y < FY1; y += 18) box(2.2, 2.2, FZ - 1, std('#c8c0b0', .8), 'freeway_pier', 'concrete', FX, y, (FZ - 1) / 2, out, false);
  // on-ramp from the car park up to the freeway
  { const r = add(new THREE.PlaneGeometry(7, 26), std('#ffffff', .8, 0, { map: roadT }), 'freeway_on_ramp', 'road', V(FX - 9, 52, FZ / 2), out, false); r.rotation.x = -Math.PI / 2 + Math.atan(FZ / 26); r.rotation.order = 'YXZ'; }
  const signT2 = canvasTex(THREE, 512, 160, (c, w, h) => { c.fillStyle = '#1e7a4a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffffff'; c.lineWidth = 6; c.strokeRect(8, 8, w - 16, h - 16); c.fillStyle = '#ffffff'; c.font = 'bold 60px Arial'; c.textAlign = 'center'; c.fillText('I-610 LOOP', w / 2, 76); c.font = 'bold 40px Arial'; c.fillText('DOWNTOWN', w / 2, 132); });
  box(.3, .3, 7, steelDk, 'gantry_post', 'metal', FX - FW / 2 - .5, 96, FZ + 3.5, out); box(.3, .3, 7, steelDk, 'gantry_post', 'metal', FX + FW / 2 + .5, 96, FZ + 3.5, out); box(FW + 1, .3, .3, steelDk, 'gantry_beam', 'metal', FX, 96, FZ + 6.8, out);
  plate(7, 2.2, std('#ffffff', .5, 0, { map: signT2 }), 'freeway_sign_I610', 'sign', FX - 2, 95.8, FZ + 5.5, 'y-', out);
  for (let i = 0; i < 10; i++) car(FX + (i % 2 ? 5.5 : -5.5) + rr(-.6, .6), FY0 + 30 + i * 28 + rr(-5, 5), carCols[(i * 3) % carCols.length], i % 2 ? Math.PI / 2 : -Math.PI / 2, i % 4 === 0).position.y = FZ;
  // far Houston skyline in haze (silhouette towers; background-painter may replace)
  const hazeM = [std('#c8d0dc', 1, 0, { fog: true }), std('#d8dce4', 1, 0), std('#b8c4d4', 1)];
  for (let i = 0; i < 16; i++) { const x = -60 + i * 7 + rr(-2, 2), h = rr(18, 70); box(rr(4, 8), rr(4, 8), h, hazeM[i % 3], 'far_skyline_tower', 'building', x, 380 + rr(-10, 10), h / 2, out, false); }
  // QUEUE_OUT (row 15 EXTREME): small gurneys, each with its white blanket and knee peak, nose to tail from the door across the car park, up the ramp, along the freeway to the horizon
  const qOutN = Math.max(0, Math.min(400, Math.round(kf(pl.queue_out, 0, 0) || 0))), qOut = [];
  const outPath = u => { // u 0..1 -> plan point (local): door (0, 15) -> car park lane -> ramp foot (FX-9, 39) -> ramp top (FX-9, 65, FZ) -> freeway lane to the horizon
    const pts = [[0, 15, 0], [0, 22, 0], [FX - 9, 30, 0], [FX - 9, 39, 0], [FX - 9, 65, FZ], [FX - 3, 80, FZ], [FX - 3, FY1, FZ]], seg = [0, .03, .07, .1, .16, .2, 1];
    for (let i = 1; i < pts.length; i++) if (u <= seg[i]) { const t = (u - seg[i - 1]) / (seg[i] - seg[i - 1]), a = pts[i - 1], b = pts[i]; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, Math.atan2(b[1] - a[1], b[0] - a[0])]; } return pts[pts.length - 1].concat([Math.PI / 2]); };
  if (qOutN > 0) { for (let i = 0; i < qOutN; i++) { const u = Math.pow(i / Math.max(1, qOutN - 1), .55), [x, y, z, yaw] = outPath(u), g = gurney('queue_out_gurney', out, 1, i > 6, i); g.position.copy(V(x, y, z + .02)); g.rotation.y = yaw; qOut.push(g); } }
  // the pickup with the cowboy-hat driver honking at the line (row 15)
  if (pl.honk) { const pk = car(FX + 1.8, 108, '#d8c8a0', Math.PI / 2, true); pk.position.y = FZ; const hatM = new THREE.MeshBasicMaterial({ color: '#6a4a2a' }); const brim = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .05, 18), hatM); brim.position.set(-.6, 1.62, .4); pk.add(brim); const crown = new THREE.Mesh(new THREE.CylinderGeometry(.18, .22, .3, 14), hatM); crown.position.set(-.6, 1.8, .4); pk.add(crown);
    const honkT = canvasTex(THREE, 256, 128, (c, w, h) => { c.fillStyle = 'rgba(0,0,0,0)'; c.clearRect(0, 0, w, h); c.strokeStyle = '#1a1a20'; c.lineWidth = 8; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(30, 64, 30 + i * 22, -.6, .6); c.stroke(); } c.fillStyle = '#1a1a20'; c.font = 'bold 44px Arial'; c.fillText('HONK', 120, 80); });
    const hk = new THREE.Mesh(new THREE.PlaneGeometry(4, 2), new THREE.MeshBasicMaterial({ map: honkT, transparent: true, depthWrite: false })); hk.position.set(2.8, 2.6, 0); hk.name = 'honk_lines'; pk.add(hk); }
  // S2 key out_v2 (row 15 EXTREME, S2 builder): fewer bars (blind slats + inner mullions + transom hidden), a NEAR pickup in the car park lane honking at the line, sky warmer
  if (pl.out_v2) { root.traverse(o => { if (/^window_blind|^blind_cord|window_transom/.test(o.name)) o.visible = false; if (o.name === 'window_mullion' && Math.abs(o.position.x - V(0, 0, 0).x) < 1.0) o.visible = false; });
    const pk2 = car(4.2, 24, '#2aa0a0', Math.PI, true), hatM2 = new THREE.MeshBasicMaterial({ color: '#7a5230' }); const br2 = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .05, 18), hatM2); br2.position.set(-.6, 1.62, .4); pk2.add(br2); const cr2 = new THREE.Mesh(new THREE.CylinderGeometry(.18, .22, .3, 14), hatM2); cr2.position.set(-.6, 1.8, .4); pk2.add(cr2);
    const hT2 = canvasTex(THREE, 256, 128, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = '#1a1a20'; c.lineWidth = 9; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(30, 64, 30 + i * 22, -.6, .6); c.stroke(); } c.fillStyle = '#1a1a20'; c.font = 'bold 50px Arial'; c.fillText('HONK!', 112, 82); });
    const hk2 = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.6), new THREE.MeshBasicMaterial({ map: hT2, transparent: true, depthWrite: false, side: THREE.DoubleSide })); hk2.position.set(1.0, 2.6, 0); hk2.rotation.y = Math.PI; hk2.name = 'honk_lines_near'; pk2.add(hk2); skyM.color.set('#ffe6b8'); }
  // window brightness + a car-park heat haze plane
  const haze = add(new THREE.PlaneGeometry(260, 14), new THREE.MeshBasicMaterial({ color: '#fff2d8', transparent: true, opacity: .35, depthWrite: false, fog: false }), 'heat_haze_band', 'fx', V(0, 120, 4), out, false);

  // S2 key out_v3 (fix round 2, row 15 EXTREME): a saturated hot white-blue Texas sky, thin haze, the gurney line laid by arc length from RIGHT OUTSIDE the glass
  // (3-4 big near gurneys) across the car park, up the ramp and along the freeway to the horizon; the honking pickup near, its HONK facing the window
  if (pl.out_v3) { skyM.map = canvasTex(THREE, 64, 512, (c, w, h) => { const g2 = c.createLinearGradient(0, 0, 0, h); g2.addColorStop(0, '#2f7fd8'); g2.addColorStop(.35, '#5aa2e8'); g2.addColorStop(.62, '#a8d2f4'); g2.addColorStop(.82, '#e6f2fa'); g2.addColorStop(1, '#fff4d6'); c.fillStyle = g2; c.fillRect(0, 0, w, h); }); skyM.color.set('#ffffff'); skyM.needsUpdate = true;
    haze.material.opacity = .12; haze.material.color.set('#eaf4ff'); hazeM.forEach(m => m.color.multiply(new THREE.Color('#a8bcd8')));
    const P3 = [[.35, 13.5, .12], [.35, 16.0, .12], [.35, 17.0, 0], [.35, 22, 0], [FX - 9, 30, 0], [FX - 9, 39, 0], [FX - 9, 65, FZ], [FX - 3, 80, FZ], [FX - 3, FY1, FZ]], Ls = [0];
    for (let i = 1; i < P3.length; i++) { const a = P3[i - 1], b = P3[i]; Ls.push(Ls[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])); }
    const at3 = d => { for (let i = 1; i < P3.length; i++) if (d <= Ls[i]) { const t = (d - Ls[i - 1]) / (Ls[i] - Ls[i - 1]), a = P3[i - 1], b = P3[i]; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, Math.atan2(b[1] - a[1], b[0] - a[0])]; } const z = P3[P3.length - 1]; return [z[0], z[1], z[2], Math.PI / 2]; };
    qOut.forEach((g, i) => { const [x, y, z, yaw] = at3(i * 2.35); g.position.copy(V(x, y, z + .02)); g.rotation.y = yaw; g.visible = i * 2.35 <= Ls[Ls.length - 1]; });
    const pk = out.children.find(o => o.name === 'pickup_truck' && o.children.some(c => c.name === 'honk_lines_near'));
    if (pk) { pk.position.copy(V(3.3, 19.5, 0)); pk.rotation.y = 0; const hk = pk.children.find(c => c.name === 'honk_lines_near'); hk.scale.setScalar(1.5); hk.position.set(-1.3, 3.0, 0); out.updateMatrixWorld(true); hk.lookAt(V(.15, 11.7, 2.3)); } }
  // S2 key co_v3 (fix round 2): corridor saturation by day: deeper butter paint (above), warmer terrazzo + ceiling, greener dado + sea-green OR door leaves, pastel blue/peach/green blankets, the 1994 calendar 1.7x
  if (pl.co_v3) { const swap = new Map([[floorM, '#f2d49a'], [ceilM, '#f0dcae'], [dadoM, '#9ee0c4'], [doorM, '#a8e4c4']]), made = new Map();
    root.traverse(o => { if (!o.isMesh || Array.isArray(o.material) || !swap.has(o.material)) return; if (!made.has(o.material)) { const c = o.material.clone(); c.color.multiply(new THREE.Color(swap.get(o.material))); made.set(o.material, c); } o.material = made.get(o.material); });
    root.traverse(o => { if (o.name === 'wall_calendar_1994') o.scale.set(1.7, 1.7, 1); if (o.name === 'calendar_curled_page' || o.name === 'calendar_nail') o.visible = false; }); ['#8ec8f0', '#f2c08a', '#9ad8a8'].forEach((c, i) => blanketM[i].color.set(c)); }

  // ---------- air life: dust motes in the window light (instanced, drift in update) ----------
  const dustN = Math.round(pl.dust ?? 160), dust = new THREE.InstancedMesh(new THREE.SphereGeometry(.006, 4, 3), glow('#fff6d8'), Math.max(1, dustN)); dust.name = 'dust_motes'; dust.userData.role = 'fx'; dust.count = dustN; root.add(dust);
  const dSeed = []; for (let i = 0; i < dustN; i++) dSeed.push([rr(-1.2, 1.2), rr(6, 11.8), rr(.4, 2.5), rr(0, 6.3)]);
  const tmp = new THREE.Object3D();


  // S2 BUILD-OUT key ph_big (row 13): the porthole view is ONE drawn canvas per porthole, redrawn every frame, clipped by the round glass: a bright OR,
  // a gowned surgeon silhouette (cap, mask, shoulders, a thick arm) working over a draped knee mound; L = a shaver scraping, R = a jug pouring a white-blue stream.
  const phDraw = (P, beat) => { const c = P.bgT.image.getContext('2d'), w = 256, h = 256;
    const g2 = c.createRadialGradient(w * .5, h * .25, 8, w / 2, h / 2, 170); if (pl.ph_clear) { g2.addColorStop(0, '#bff0e4'); g2.addColorStop(.5, '#7fd4c2'); g2.addColorStop(1, '#3f9c8e'); } else { g2.addColorStop(0, '#ffffff'); g2.addColorStop(.4, '#dff8f2'); g2.addColorStop(1, '#5fb8aa'); } c.fillStyle = g2; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(30,110,100,.35)'; for (let i = 0; i < 6; i++) c.fillRect(0, i * 46, w, 2);
    const ink = '#04100e', L = P.side < 0, sx = L ? 1 : -1, cx = 128 - sx * 34; const PS = pl.ph_scale ?? .74, PT = pl.ph_tool ?? 1; c.save(); c.translate(128, 150 + (pl.ph_dy ?? 0)); c.scale(PS, PS); c.translate(-128, -128); c.fillStyle = ink; c.strokeStyle = ink; c.lineCap = 'round'; c.lineJoin = 'round';
    // draped knee mound (bottom, the work side)
    c.beginPath(); c.moveTo(0, 256); c.lineTo(0, 232); c.lineTo(cx + sx * 40, 228); c.lineTo(cx + sx * 78, 196); c.lineTo(cx + sx * 118, 230); c.lineTo(256 * (L ? 1 : 0), 234); c.lineTo(256 * (L ? 1 : 0), 256); c.closePath(); c.fill();
    const by = 4 * beat;   // the factory bob
    c.beginPath(); c.ellipse(cx, 150 + by, 58, 70, 0, Math.PI, 0); c.lineTo(cx + 58, 256); c.lineTo(cx - 58, 256); c.closePath(); c.fill();          // gown shoulders
    c.beginPath(); c.arc(cx, 84 + by, 30, 0, Math.PI * 2); c.fill();                                                                               // head
    c.beginPath(); c.ellipse(cx, 66 + by, 34, 20, 0, Math.PI, 0); c.fill(); c.fillRect(cx - 34, 64 + by, 68, 8);                                   // scrub cap
    c.lineWidth = 3; c.beginPath(); c.moveTo(cx - sx * 30, 70 + by); c.lineTo(cx - sx * 48, 58 + by); c.stroke();                                   // cap tie
    c.fillStyle = 'rgba(220,245,240,.55)'; c.beginPath(); c.ellipse(cx + sx * 8, 94 + by, 20, 11, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = ink;   // mask catches the light
    if (L) { const hx = cx + 70 + 12 * beat, hy = 170 + 14 * beat;                                                                                // SCRAPE: arm out, shaver down on the knee, a stroke
      c.lineWidth = 24; c.beginPath(); c.moveTo(cx + 30, 128 + by); c.quadraticCurveTo(cx + 62, 140, hx, hy); c.stroke(); c.beginPath(); c.arc(hx, hy, 14, 0, Math.PI * 2); c.fill();
      c.save(); c.translate(hx + 6, hy + 10); c.rotate(.5 + .25 * beat); c.scale(PT, PT); c.fillRect(-12, -6, 24, 58); c.fillRect(-20, 48, 40, 13); c.fillStyle = 'rgba(255,255,255,.85)'; c.fillRect(-18, 59, 36, 3); c.fillStyle = ink; c.restore();
      c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 3; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(hx + 30 + k * 7, hy + 52 - k * 4); c.lineTo(hx + 38 + k * 7, hy + 44 - k * 4); c.stroke(); } }
    else { const tilt = Math.max(0, beat), hx = cx - 64, hy = 118 - 8 * tilt;                                                                      // RINSE: jug up and tipped, water falls on the knee
      c.lineWidth = 24; c.beginPath(); c.moveTo(cx - 30, 128 + by); c.quadraticCurveTo(cx - 54, 136, hx, hy); c.stroke();
      c.save(); c.translate(hx - 8, hy - 6); c.rotate(-(.3 + .9 * tilt)); c.scale(PT, PT); c.beginPath(); c.moveTo(-22, -26); c.lineTo(22, -26); c.lineTo(28, 30); c.lineTo(-28, 30); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(-22, -26); c.lineTo(-38, -36); c.lineTo(-20, -14); c.closePath(); c.fill(); c.lineWidth = 7; c.beginPath(); c.arc(30, 2, 14, -1.2, 1.2); c.stroke(); c.restore();
      if (tilt > .15) { const sx0 = hx - 40 - 16 * tilt, sy0 = hy - 30 + 10 * tilt; c.strokeStyle = '#6fd0ff'; c.lineWidth = 10 * tilt + 4; c.beginPath(); c.moveTo(sx0, sy0); c.quadraticCurveTo(sx0 - 14, sy0 + 50, sx0 - 10, 210); c.stroke();
        c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 3; c.beginPath(); c.moveTo(sx0 + 1, sy0 + 4); c.quadraticCurveTo(sx0 - 12, sy0 + 50, sx0 - 8, 206); c.stroke();
        c.fillStyle = '#9fe2ff'; for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(sx0 - 30 + k * 12, 214 - (k % 2) * 8, 4, 0, Math.PI * 2); c.fill(); } } }
    c.restore(); P.bgT.needsUpdate = true; };
  // S2 v2 key period_right: { crt_y: 1.3, cal_y: 1.85, text: 'HOUSTON TX' }  (CB: the camera zig-zag) the CRT cart + the 1994 calendar turned 180 deg round a
  // vertical pivot onto the RIGHT wall beside the OR 3 doors, so the pull-back out of the porthole shows doors + 1994 + Houston in ONE picture with no whip.
  if (pl.period_right) { const pr = pl.period_right === true ? {} : pl.period_right;
    const rot = (objs, py) => { if (!objs.length) return; const pv = new THREE.Group(); pv.name = 'period_right_pivot'; pv.position.copy(V(0, py, 0)); root.add(pv); root.updateMatrixWorld(true); objs.forEach(o => pv.attach(o)); pv.rotation.y = Math.PI; pv.updateMatrixWorld(true); };
    const cart = root.getObjectByName('crt_cart'); if (cart) rot([cart], (1.55 + (pr.crt_y ?? 1.3)) / 2);
    const cal = []; root.traverse(o => { if (/^(wall_calendar_1994|calendar_nail|calendar_curled_page)$/.test(o.name)) cal.push(o); }); rot(cal, (2.75 + (pr.cal_y ?? 1.85)) / 2);
    const cp = root.getObjectByName('wall_calendar_1994'); if (cp && pr.text !== '') { const c = cp.material.map.image.getContext('2d'); c.fillStyle = 'rgba(255,252,240,.95)'; c.fillRect(22, 12, 256, 50); c.fillStyle = '#b8322a'; c.font = 'bold 36px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(pr.text || 'HOUSTON TX', 150, 38); cp.material.map.needsUpdate = true; } }
  // S2 v2 key clock_hang: [x, y, z]  the wall clock becomes a ceiling-hung hospital clock over the corridor, facing the lens (-y), on a steel rod:
  // the flight down the corridor sees window + queue + clock in ONE direction and pushes straight into the face (matches the office clock join, no turn).
  if (pl.clock_hang) { const H = pl.clock_hang, parts = [hH, hM, hS, blurFan]; root.traverse(o => { if (/^(wall_clock_face|wall_clock_rim|wall_clock_glass|clock_hub)$/.test(o.name)) parts.push(o); });
    const pv = new THREE.Group(); pv.name = 'clock_hang_pivot'; pv.position.copy(V(...CK)); root.add(pv); root.updateMatrixWorld(true); parts.forEach(o => pv.attach(o));
    pv.rotation.y = Math.PI / 2; pv.position.copy(V(...H)); pv.updateMatrixWorld(true);
    parts.forEach(o => { if (o.name === 'wall_clock_face' && o.material && o.material.emissive) { o.material.emissive.set('#ffffff'); o.material.emissiveMap = o.material.map; o.material.emissiveIntensity = .45; o.material.needsUpdate = true; } });
    add(new THREE.CylinderGeometry(.205, .205, .05, 36), std('#2a2a30', .5), 'clock_hang_body', 'plastic', V(H[0], H[1] + .035, H[2]), root, true).rotation.x = Math.PI / 2;
    bar([H[0], H[1] + .035, H[2] + .2], [H[0], H[1] + .035, CZ], .012, steel, 'clock_hang_rod', 'metal'); }
  // ENV v3 (E1 2026-11-17): richer walls, doors, posters, sconces, second light colour, foreground (envV3Corridor at the end of this file); OFF unless env_v3
  const ENV = pl.env_v3 ? envV3Corridor({ THREE, V, add, box, bar, plate, std, glow, steel, steelDk, chrome, beige, beigeDk, rubber, R0, rr, root, pl }) : null;
  // ---------- update: clock, spin blur, porthole rhythm, queue count, flicker, curtain sway, shimmer, CRT scan, dust ----------
  const fps = (film && film.fps) || 30, flick = Array.isArray(pl.flicker) ? pl.flicker : [];
  const update = (f, t) => { t = t ?? f / fps; if (SF.LP && SF.LP.sync) SF.LP.sync(SF.M); if (ENV) ENV.update(t);
    let mins = clockMinutes(pl.clock || '12:00', f); const spin = kf(pl.clock_spin, f, 0) || 0; mins += spin * 60 * t;
    hM.rotation.z = -(mins % 60) / 60 * Math.PI * 2; hH.rotation.z = -(mins / 720) * Math.PI * 2; hS.rotation.z = -((t * (1 + spin * 30)) % 60) / 60 * Math.PI * 2;
    blurFan.material.opacity = Math.min(.55, Math.max(0, (spin - 1.5) * .25)); hM.visible = spin < 4;
    const mode = pl.portholes || 'work', beat = Math.sin(t * Math.PI * 2 * (pl.rhythm ?? 1.1));
    for (const k of ['L', 'R']) { const P = ph[k]; P.sil.visible = mode === 'work'; if (mode !== 'work') continue; if (pl.ph_big) { P.sil.visible = false; phDraw(P, k === 'L' ? beat : Math.sin(t * Math.PI * 2 * (pl.rhythm ?? 1.1) - .6)); continue; } P.sil.position.y = ctx.B2T([0, 0, P.at[2] - .06]).y + .012 * beat;
      if (k === 'L') P.arm.rotation.z = .25 + .35 * beat; else { P.arm.rotation.z = -.4 - .45 * Math.max(0, beat); if (P.arm.userData.pour) P.arm.userData.pour.visible = beat > .2; } }
    const qn = Math.max(0, Math.min(QN, Math.round(kf(pl.queue, f, 6)))); gurneys.forEach((g, i) => g.visible = i < qn);
    const fl = flick.some(x => f >= x && f < x + 4); troffers.forEach((m, i) => { m.material.color.setScalar(fl && i === 3 ? ((f % 2) ? .35 : .8) : 1); });
    for (const c of curtains) { const p = c.geometry.attributes.position, b = c.geometry.userData.base; for (let i = 0; i < p.count; i++) { const y = b[i * 3 + 1], lo = (1.075 - y) / 2.15; p.array[i * 3 + 2] = b[i * 3 + 2] + .012 * lo * Math.sin(t * 1.3 + b[i * 3] * 2.1); } p.needsUpdate = true; }
    shimT.offset.set(Math.sin(t * .7) * .02, (t * .08) % 1); shim.material.opacity = (.45 + .1 * Math.sin(t * 3.1)) * (pl.shimmer ?? 1);
    sheer.rotation.z = .006 * Math.sin(t * .9);
    for (let i = 0; i < dustN; i++) { const s = dSeed[i]; tmp.position.copy(V(s[0] + .05 * Math.sin(t * .3 + s[3]), s[1] + .04 * Math.cos(t * .2 + s[3]), s[2] + .06 * Math.sin(t * .25 + s[3] * 2))); tmp.updateMatrix(); dust.setMatrixAt(i, tmp.matrix); } dust.instanceMatrix.needsUpdate = true;
    const win = kf(pl.window, f, 'noon'); const morning = win === 'morning'; if (!pl.out_v3) skyM.color.set(morning ? '#d8e2f0' : '#f4ecd8'); winLight.color.set(morning ? '#ffe8c8' : '#fff6e0'); winLight.intensity = (morning ? .7 : 1.0) * (pl.window_glow ?? 1);
  };
  update(0, 0);

  // ---------- anchors (world plan metres) ----------
  const gPath = u => { const pts = [[0, 11.2], [0, 6.0], [.2, 3.6], [1.9, 3.2]], n = pts.length - 1, s = Math.min(n - 1e-6, Math.max(0, u) * n), i = Math.floor(s), k = s - i, a = pts[i], b = pts[i + 1]; return W(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, 0); };
  return { update, anchors: { or_door: W(DX, DY, 0), or_door_in: W(DX + .9, DY, 0), porthole_L: ph.L.at, porthole_R: ph.R.at, clock: W(...CK), crt: W(LX + .6, 1.55, 1.13), phone: W(LX + .09, .35, 1.42),
    calendar: W(LX, 2.75, 1.75), clock_hang: pl.clock_hang ? W(...pl.clock_hang) : null, window: W(0, 12, 1.6), corner: W(1.4, 10.5, 0), ...gAnch, gurney_path: gPath, wave_spot: W(-.35, 4.2, 0),
    preop_chair: W(CH[0], CH[1], 0), preop_seat: W(CH[0], CH[1], .5), preop_table: W(-3.95, 8.45, .76), preop_clipboard: W(CH[0] + .15, CH[1] - .2, .72), preop_cane: W(CH[0] + .3, CH[1] - .25, 0),
    preop_window: W(BX0, 7.3, 1.6), preop_extra_1: W(-2.4, 6.3, 0), preop_extra_2: W(-1.95, 8.4, 0), queue_out_count: qOutN, stations: STATIONS, surfaces_from: SF.has ? 'look_pack' : 'own-canvas', cane_from: caneFrom, gurney_from: gurneyFrom } };
}

// ================= ENV v3 (helper E1, 2026-11-17; place key env_v3: true, default OFF so S2-S5 renders stay as they are) =================
// CB "environment looks little weak" (ISSUES_v2 A7): no big flat butter wall left empty at phone size. Adds, all in local plan metres:
//   wall bands: deeper ochre band z 1.2-1.5 over the dado + oak chair rail, the butter field, a teal/navy stencil frieze z 2.42-2.52, a lighter cream band
//   z 2.52-2.8 + picture rail (all wall runs); oak handrails on brackets (z 1.02) along both walls; duplex outlets (z .3); room doors 208 STAFF LOUNGE (right,
//   y -2.7) + 212 RECOVERY (right, y 6.5): steel frames, wired-glass vision panels, number plates, levers, kick + push plates; framed posters: WASH YOUR HANDS
//   (left y -1.0), QUIET PLEASE (left y 1.55), THE KNEE JOINT chart (right y .9), HEALTH FAIR 1994 (right y 7.9); a second cork notice board with 8 papers,
//   pins + a polaroid (right y -1.1); a recessed FIRE EXTINGUISHER cabinet (right y 4.55, stainless water can: no red); projecting flag signs SURGERY
//   (left y 3.3) + RADIOLOGY -> (right y 7.5); four warm wall sconces with light pools on the wall (2 real point lights);
//   SECOND LIGHT COLOUR: troffer lights go cool white #eef4ff, the window throws a warm gold spill (#ffb45a spot + floor/wall pools by the window);
//   FOREGROUND for depth: a tall dracaena in a teal glazed pot (left, y -.2) + a 1990s supply cart (right, y -1.6). The 1994 calendar's HOUSTON TX goes navy (red gate).
//   Micro motion: the dracaena leaves sway in the air-con (out of phase). Signs, posters and flags hang still.
function envV3Corridor(E) {
  const { THREE, V, add, box, bar, plate, std, glow, steel, steelDk, chrome, beige, beigeDk, rubber, R0, rr, root, pl } = E;
  const tex = (w, h, draw, rep) => canvasTex(THREE, w, h, draw, rep), mat = (t, r = .6) => std('#ffffff', r, 0, { map: t });
  const LX = -1.4, RX = 1.4, oak = std('#8a5a32', .45), oakDk = std('#6a4224', .5), frameM = std('#2a2a30', .4), frameW = std('#c8a060', .45);
  const addv = (geo, m, name, role, x, y, z, sh = false) => add(geo, m, name, role, V(x, y, z), root, sh);
  // ---- wall bands on every run: [axis, fixed, a0, a1, face]
  const runs = [['y', LX, -3.5, 5.6, 'x+'], ['y', LX, 9.0, 12, 'x+'], ['y', RX, -3.5, 2.35, 'x-'], ['y', RX, 4.05, 9.4, 'x-'], ['x', 9.4, 1.4, 6, 'y+'], ['x', 12, 1.4, 6, 'y-'], ['y', 6, 9.4, 12, 'x-']];
  const bandLo = std('#c98f2a', .8), bandHi = std('#f7e3a4', .85);
  const friezeDraw = (c, w, h) => { c.fillStyle = '#f7e3a4'; c.fillRect(0, 0, w, h); c.fillStyle = '#2f8a80'; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(i * 64 + 8, h - 10); c.lineTo(i * 64 + 32, 12); c.lineTo(i * 64 + 56, h - 10); c.fill(); } c.fillStyle = '#1d3f8a'; c.fillRect(0, h - 6, w, 6); c.fillRect(0, 0, w, 4); };
  const off = (face, d) => face === 'x+' ? [d, 0] : face === 'x-' ? [-d, 0] : face === 'y+' ? [0, d] : [0, -d];
  for (const [ax, fx, a0, a1, face] of runs) { const L = a1 - a0, c0 = (a0 + a1) / 2, [ox, oy] = off(face, .004), at = z => ax === 'y' ? [fx + ox, c0, z] : [c0, fx + oy, z];
    plate(L, .3, bandLo, 'env_wall_band_low', 'wall', ...at(1.35), face);
    plate(L, .1, mat(tex(512, 64, friezeDraw, [Math.max(1, Math.round(L / .9)), 1]), .7), 'env_frieze_stencil', 'wall', ...at(2.47), face);
    plate(L, .28, bandHi, 'env_wall_band_high', 'wall', ...at(2.66), face);
    const [px, py] = off(face, .02), bx = (z, hh, m, nm) => ax === 'y' ? box(.035, L, hh, m, nm, 'wood', fx + px, c0, z, root, false) : box(L, .035, hh, m, nm, 'wood', c0, fx + py, z, root, false);
    bx(1.5, .045, oakDk, 'env_chair_rail'); bx(2.4, .035, beigeDk, 'env_picture_rail'); }
  plate(1.7, .4, bandHi, 'env_or_header_band', 'wall', RX - .004, 3.2, 2.6, 'x-');
  // ---- handrails (oak tube on steel brackets) + outlets
  const rail = (x, s, y0, y1) => { bar([x + s * .095, y0, 1.02], [x + s * .095, y1, 1.02], .024, oak, 'env_handrail', 'wood', root, 12); for (let y = y0 + .3; y < y1 - .1; y += 1.2) { bar([x + s * .01, y, 1.0], [x + s * .095, y, 1.0], .009, steel, 'env_handrail_bracket'); box(.012, .07, .1, steel, 'env_handrail_rose', 'metal', x + s * .008, y, 1.0, root, false); } };
  rail(LX, 1, -3.4, -2.45); rail(LX, 1, -1.35, 1.2); rail(LX, 1, 1.95, 5.5); rail(RX, -1, -2.15, 2.3); if (!pl.rail_queue_off) { rail(RX, -1, 4.1, 6.0); rail(RX, -1, 7.0, 9.35); }   // rail_queue_off (v4, default off): no right-wall handrail behind the gurney queue (it crossed the reclined patients)
  const outT = tex(64, 112, (c, w, h) => { c.fillStyle = '#e8dcc0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#b8a888'; c.lineWidth = 4; c.strokeRect(2, 2, w - 4, h - 4); c.fillStyle = '#3a3428'; for (const y of [30, 72]) { c.fillRect(20, y - 8, 6, 14); c.fillRect(38, y - 8, 6, 14); c.beginPath(); c.arc(32, y + 12, 4, 0, 6.3); c.fill(); } });
  for (const [x, s, ys] of [[LX, 1, [-.9, 3.0, 4.95]], [RX, -1, [-1.9, .3, 5.2, 8.3]]]) for (const y of ys) { box(.012, .075, .125, beige, 'env_outlet_box', 'plastic', x + s * .006, y, .3, root, false); plate(.07, .12, mat(outT, .5), 'env_outlet_face', 'plastic', x + s * .0125, y, .3, s > 0 ? 'x+' : 'x-'); }
  // ---- room doors with number plates + vision panels (right wall)
  const door = (y, num, name) => { const s = -1, x = RX, leafM = std('#9ec8b8', .5), g = 'env_door_' + num;
    box(.05, .95, 2.1, leafM, g + '_leaf', 'wood', x + s * .03, y, 1.05); box(.07, 1.07, .06, steel, g + '_frame_head', 'metal', x + s * .02, y, 2.13); for (const k of [-1, 1]) box(.07, .05, 2.13, steel, g + '_frame_jamb', 'metal', x + s * .02, y + k * .5, 1.06);
    const wgT = tex(64, 256, (c, w, h) => { c.fillStyle = '#4a6a78'; c.fillRect(0, 0, w, h); const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, 'rgba(255,255,255,.45)'); gr.addColorStop(.4, 'rgba(255,255,255,0)'); gr.addColorStop(.7, 'rgba(255,255,255,.2)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(30,30,30,.55)'; c.lineWidth = 1.2; for (let i = -h; i < h; i += 14) { c.beginPath(); c.moveTo(0, i); c.lineTo(w, i + w); c.stroke(); c.beginPath(); c.moveTo(w, i); c.lineTo(0, i + w); c.stroke(); } });
    box(.06, .2, .64, steelDk, g + '_vision_frame', 'metal', x + s * .035, y - .22, 1.55); plate(.15, .58, glow('#ffffff', { map: wgT }), g + '_vision_glass', 'glass', x + s * .066, y - .22, 1.55, 'x-');
    bar([x + s * .08, y + .36, 1.02], [x + s * .08, y + .22, 1.02], .012, chrome, g + '_lever'); box(.01, .9, .25, steel, g + '_kick_plate', 'metal', x + s * .058, y, .15, root, false); box(.01, .12, .3, steel, g + '_push_plate', 'metal', x + s * .058, y + .3, 1.25, root, false);
    const nT = tex(192, 96, (c, w, h) => { c.fillStyle = '#1d3f8a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#f3e2a6'; c.lineWidth = 5; c.strokeRect(5, 5, w - 10, h - 10); c.fillStyle = '#fff'; c.font = 'bold 34px Arial'; c.textAlign = 'center'; c.fillText(num, w / 2, 44); c.font = 'bold 18px Arial'; c.fillText(name, w / 2, 76); });
    box(.012, .26, .13, std('#1d3f8a', .4), g + '_plate_back', 'sign', x + s * .006, y + .7, 1.6, root, false); plate(.24, .12, mat(nT, .4), g + '_number_plate', 'sign', x + s * .013, y + .7, 1.6, 'x-'); };
  door(-2.7, '208', 'STAFF LOUNGE'); door(6.5, '212', 'RECOVERY');
  // ---- framed posters (canvas art, words spelled right, no red)
  const framed = (w, h, t, fm, x, y, z, face, name) => { const s = face === 'x+' ? 1 : -1; box(.025, w + .05, h + .05, fm, name + '_frame', 'plastic', x + s * .0125, y, z, root, true); plate(w, h, mat(t, .55), name, 'paper', x + s * .027, y, z, face); plate(w, h, new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: .08, roughness: .05, metalness: .2, depthWrite: false }), name + '_glass', 'glass', x + s * .03, y, z, face); };
  const washT = tex(300, 420, (c, w, h) => { c.fillStyle = '#e6f2f6'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d6fa8'; c.fillRect(0, 0, w, 120); c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = 'bold 64px Arial'; c.fillText('WASH', w / 2, 62); c.font = 'bold 36px Arial'; c.fillText('YOUR HANDS', w / 2, 104);
    c.fillStyle = '#e8c49a'; for (const [x, r] of [[110, -.3], [190, .3]]) { c.save(); c.translate(x, 260); c.rotate(r); c.beginPath(); c.ellipse(0, 20, 38, 52, 0, 0, 6.3); c.fill(); for (let k = 0; k < 4; k++) { c.beginPath(); c.ellipse(-27 + k * 18, -44, 8, 26, 0, 0, 6.3); c.fill(); } c.restore(); }
    c.fillStyle = '#2a8ad0'; for (let i = 0; i < 9; i++) { const x = 70 + (i * 37) % 170, y = 150 + (i * 23) % 60; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 9, y + 16, x, y + 20); c.quadraticCurveTo(x - 9, y + 16, x, y); c.fill(); }
    c.strokeStyle = '#8ad0f0'; c.lineWidth = 3; for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(60 + i * 30, 330 - (i % 3) * 14, 8 + (i % 2) * 5, 0, 6.3); c.stroke(); } c.fillStyle = '#1d3f8a'; c.font = 'bold 22px Arial'; c.fillText('EVERY PATIENT', w / 2, 378); c.fillText('EVERY TIME', w / 2, 404); });
  framed(.4, .56, washT, frameM, LX, -1.0, 1.82, 'x+', 'env_poster_wash_hands');
  const quietT = tex(300, 220, (c, w, h) => { c.fillStyle = '#2a3a7a'; c.fillRect(0, 0, w, h); c.fillStyle = '#f3e2a6'; c.beginPath(); c.arc(220, 70, 40, 0, 6.3); c.fill(); c.fillStyle = '#2a3a7a'; c.beginPath(); c.arc(240, 58, 36, 0, 6.3); c.fill(); c.fillStyle = '#fff'; for (let i = 0; i < 14; i++) c.fillRect((i * 71) % w, (i * 37) % 120, 3, 3); c.textAlign = 'center'; c.font = 'bold 44px Arial'; c.fillText('QUIET', w / 2, 160); c.font = 'bold 30px Arial'; c.fillText('PLEASE', w / 2, 198); });
  framed(.4, .3, quietT, frameW, LX, 1.55, 2.0, 'x+', 'env_poster_quiet');
  const kneeT = tex(320, 440, (c, w, h) => { c.fillStyle = '#f6efdc'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d3f8a'; c.textAlign = 'center'; c.font = 'bold 34px Arial'; c.fillText('THE KNEE', w / 2, 40); c.font = 'bold 22px Arial'; c.fillText('JOINT', w / 2, 66);
    c.fillStyle = '#efe0bc'; c.strokeStyle = '#4a3a28'; c.lineWidth = 3; c.beginPath(); c.moveTo(130, 80); c.lineTo(190, 80); c.lineTo(186, 190); c.quadraticCurveTo(222, 214, 196, 236); c.lineTo(124, 236); c.quadraticCurveTo(98, 214, 134, 190); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(118, 262); c.quadraticCurveTo(160, 250, 202, 262); c.lineTo(188, 300); c.lineTo(184, 420); c.lineTo(138, 420); c.lineTo(134, 300); c.closePath(); c.fill(); c.stroke(); c.beginPath(); c.moveTo(206, 290); c.lineTo(214, 290); c.lineTo(212, 420); c.lineTo(204, 420); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#8ab8d8'; c.beginPath(); c.ellipse(140, 247, 24, 7, 0, 0, 6.3); c.fill(); c.beginPath(); c.ellipse(182, 247, 24, 7, 0, 0, 6.3); c.fill(); c.fillStyle = '#d8c49a'; c.beginPath(); c.ellipse(222, 200, 15, 24, .2, 0, 6.3); c.fill(); c.stroke();
    c.strokeStyle = '#2aa0a0'; c.lineWidth = 6; c.beginPath(); c.moveTo(126, 220); c.lineTo(130, 280); c.stroke(); c.beginPath(); c.moveTo(196, 222); c.lineTo(208, 290); c.stroke();
    c.strokeStyle = '#3a3a44'; c.lineWidth = 1.5; c.fillStyle = '#2a2a3a'; c.font = 'bold 15px Arial'; c.textAlign = 'left'; for (const [tx, x, y, ex, ey] of [['FEMUR', 10, 130, 130, 130], ['PATELLA', 236, 160, 226, 185], ['MENISCUS', 4, 250, 120, 247], ['LIGAMENT', 222, 300, 208, 275], ['TIBIA', 10, 360, 138, 360], ['FIBULA', 240, 400, 212, 400]]) { c.fillText(tx, x, y); c.beginPath(); c.moveTo(x < 100 ? x + 60 : x - 2, y - 5); c.lineTo(ex, ey); c.stroke(); } });
  framed(.42, .58, kneeT, frameM, RX, .9, 1.85, 'x-', 'env_poster_knee_chart');
  const fairT = tex(320, 440, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#ffd060'); g.addColorStop(1, '#ffa040'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#fff6d0'; c.beginPath(); c.arc(w / 2, 150, 70, 0, 6.3); c.fill();
    for (const [x, y, col] of [[60, 120, '#2aa0a0'], [262, 100, '#1d3f8a'], [250, 190, '#2aa04a']]) { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, 26, 32, 0, 0, 6.3); c.fill(); c.strokeStyle = '#3a3a3a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y + 32); c.quadraticCurveTo(x + 10, y + 70, x, y + 110); c.stroke(); }
    c.textAlign = 'center'; c.fillStyle = '#1d3f8a'; c.font = 'bold 40px Arial'; c.fillText('HEALTH FAIR', w / 2, 52); c.font = 'bold 86px Arial'; c.lineWidth = 6; c.strokeStyle = '#1d3f8a'; c.strokeText('1994', w / 2, 180); c.fillStyle = '#ffffff'; c.fillText('1994', w / 2, 180);
    c.fillStyle = '#0e5a5a'; c.font = 'bold 28px Arial'; c.fillText('FREE CHECKUPS', w / 2, 290); c.font = 'bold 22px Arial'; c.fillText('SAT OCT 8  9AM - 3PM', w / 2, 330); c.fillText('MAIN LOBBY', w / 2, 362); c.fillStyle = '#1d3f8a'; c.fillRect(0, h - 40, w, 40); c.fillStyle = '#fff'; c.font = 'bold 20px Arial'; c.fillText('BRING THE FAMILY', w / 2, h - 13); });
  framed(.44, .6, fairT, frameM, RX, 7.9, 1.82, 'x-', 'env_poster_health_fair');
  // ---- second notice board (right y -1.1): cork, oak frame, 8 papers, pins, a polaroid
  { const y = -1.1, z = 1.78, cT = tex(512, 320, (c, w, h) => { noiseCanvas(c, w, h, '#b88a58', ['#a07444', '#c89c68', '#8a6038'], 6000, 1, 4, R0); });
    box(.03, 1.08, .7, oakDk, 'env_notice_frame', 'wood', RX - .015, y, z, root, true); plate(1.0, .62, mat(cT, .9), 'env_notice_cork', 'wood', RX - .032, y, z, 'x-');
    const notes = [['#ffffff', 'IN-SERVICE', 'THURS 2PM'], ['#fff4a0', 'CPR CLASS', 'SIGN UP'], ['#bfe0f4', 'LOST PAGER', 'CALL 4410'], ['#ffe0b0', 'CAFETERIA', 'MENU'], ['#c8f0d0', 'CAR POOL', 'KATY / I-10'], ['#e8d8f4', 'SHIFT SWAP', 'SEE NANCY'], ['#ffffff', 'FLU SHOTS', 'OCT 3-7'], ['#f4e8c8', 'BAKE SALE', 'FRIDAY']];
    notes.forEach(([col, a, b], i) => { const nT = tex(128, 150, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a2a'; c.font = 'bold 19px Arial'; c.fillText(a, 8, 32); c.font = '16px Arial'; c.fillText(b, 8, 58); c.fillStyle = 'rgba(40,40,60,.5)'; for (let k = 0; k < 4; k++) c.fillRect(8, 78 + k * 16, 70 + (k * 23) % 40, 3); });
      const py = y - .38 + (i % 4) * .25 + rr(-.03, .03), pz = z + (i < 4 ? .14 : -.15) + rr(-.02, .02), n = plate(.17, .2, mat(nT, .8), 'env_notice_paper', 'paper', RX - .036 - i * .0007, py, pz, 'x-'); n.rotation.x = rr(-.1, .1);
      addv(new THREE.SphereGeometry(.01, 6, 4), std(['#2a6ad0', '#f2c230', '#2aa04a', '#f4f0e4'][i % 4], .35), 'env_push_pin', 'plastic', RX - .045, py, pz + .085); });
    const pT = tex(96, 112, (c, w, h) => { c.fillStyle = '#fbfaf4'; c.fillRect(0, 0, w, h); const g = c.createLinearGradient(0, 8, 0, 88); g.addColorStop(0, '#7ab8e0'); g.addColorStop(1, '#4a8a4a'); c.fillStyle = g; c.fillRect(8, 8, 80, 78); c.fillStyle = '#2a3a7a'; c.fillRect(30, 40, 10, 30); c.fillRect(52, 36, 12, 34); });
    const pp = plate(.09, .105, mat(pT, .6), 'env_notice_polaroid', 'paper', RX - .04, y + .42, z + .02, 'x-'); pp.rotation.x = .15; }
  // ---- recessed fire extinguisher cabinet (right y 4.55): white enamel tub, steel trim, glass door, stainless water can (no red), label strip
  { const y = 4.55, z = 1.38, cab = std('#f0eee6', .4, .1);
    box(.09, .44, .74, cab, 'env_extinguisher_cabinet_trim', 'metal', RX - .03, y, z); box(.012, .38, .66, std('#3a4048', .6), 'env_extinguisher_cabinet_back', 'metal', RX - .078, y, z, root, false);
    addv(new THREE.CylinderGeometry(.075, .075, .46, 18), chrome, 'env_extinguisher_can', 'metal', RX - .16, y, z - .06, true); addv(new THREE.SphereGeometry(.075, 14, 8, 0, 6.3, 0, 1.6), chrome, 'env_extinguisher_dome', 'metal', RX - .16, y, z + .17);
    box(.05, .06, .05, std('#1a1a20', .5), 'env_extinguisher_valve', 'metal', RX - .16, y, z + .24); box(.12, .02, .015, std('#1a1a20', .5), 'env_extinguisher_handle', 'metal', RX - .16, y, z + .28);
    const hp = []; for (let i = 0; i <= 12; i++) { const u = i / 12; hp.push(V(RX - .16 + .07 * Math.sin(u * 3), y - .06 - .03 * u, z + .22 - u * .42)); } add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hp), 24, .01, 6), rubber, 'env_extinguisher_hose', 'rubber');
    const lT = tex(256, 48, (c, w, h) => { c.fillStyle = '#f6f4ee'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a1a'; c.font = 'bold 22px Arial'; c.textAlign = 'center'; c.fillText('FIRE EXTINGUISHER', w / 2, 32); });
    plate(.4, .7, new THREE.MeshStandardMaterial({ color: '#dfeef0', transparent: true, opacity: .16, roughness: .05, metalness: .3, depthWrite: false }), 'env_extinguisher_glass', 'glass', RX - .082, y, z, 'x-'); box(.02, .02, .2, chrome, 'env_extinguisher_pull', 'metal', RX - .085, y + .16, z, root, false);
    plate(.42, .08, mat(lT, .5), 'env_extinguisher_label', 'sign', RX - .006, y, z + .44, 'x-'); }
  // ---- projecting flag signs (double sided, still)
  const flag = (x, y, s, text, arrow, name) => { const fT = tex(512, 160, (c, w, h) => { c.fillStyle = '#1d3f8a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#f3e2a6'; c.lineWidth = 8; c.strokeRect(10, 10, w - 20, h - 20); c.fillStyle = '#ffffff'; c.font = 'bold 62px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, arrow ? w / 2 - 34 : w / 2, h / 2 + 4);
      if (arrow) { c.beginPath(); c.moveTo(w - 34, h / 2); c.lineTo(w - 78, h / 2 - 30); c.lineTo(w - 78, h / 2 + 30); c.fill(); c.fillRect(w - 110, h / 2 - 9, 36, 18); } });
    const cx = x + s * .33; box(.62, .03, .2, std('#1d3f8a', .5), name + '_board', 'sign', cx, y, 2.3); plate(.6, .19, mat(fT, .5), name + '_face', 'sign', cx, y - .017, 2.3, 'y-'); plate(.6, .19, mat(fT, .5), name + '_back', 'sign', cx, y + .017, 2.3, 'y+');
    bar([x, y, 2.44], [cx + s * .28, y, 2.44], .008, steel, name + '_arm'); box(.012, .08, .16, steel, name + '_rose', 'metal', x + s * .006, y, 2.44, root, false); for (const d of [-.25, .25]) bar([cx + d, y, 2.4], [cx + d, y, 2.44], .003, steel, name + '_hanger'); };
  flag(LX, 3.3, 1, 'SURGERY', false, 'env_flag_surgery'); flag(RX, 7.5, -1, 'RADIOLOGY', true, 'env_flag_radiology');
  // ---- warm wall sconces with light pools (2 lit as real lights, all 4 with drawn pools)
  const poolT = tex(256, 256, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const poolM = (col, op) => new THREE.MeshBasicMaterial({ color: col, map: poolT, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  [[LX, 1, 2.15], [LX, 1, -2.95], [RX, -1, -.05], [RX, -1, 5.0]].forEach(([x, s, y], i) => { const face = s > 0 ? 'x+' : 'x-';
    addv(new THREE.CylinderGeometry(.11, .07, .14, 16, 1, false, 0, Math.PI), std('#f4ead2', .4, 0, { emissive: '#ffd890', emissiveIntensity: .35 }), 'env_sconce_shade', 'lamp', x, y, 2.2, true).rotation.y = s > 0 ? 0 : Math.PI;
    box(.02, .06, .06, steelDk, 'env_sconce_backplate', 'metal', x + s * .01, y, 2.12, root, false);
    const up = plate(.9, .75, poolM('#ffc870', .42), 'env_sconce_pool_up', 'fx', x + s * .009, y, 2.5, face); up.renderOrder = 2; const dn = plate(.55, .42, poolM('#ffc870', .22), 'env_sconce_pool_down', 'fx', x + s * .009, y, 1.95, face); dn.renderOrder = 2;
    if (i % 2 === 0) { const p = new THREE.PointLight('#ffc070', .55, 2.4, 1.6); p.position.copy(V(x + s * .25, y, 2.25)); root.add(p); } });
  // ---- SECOND LIGHT COLOUR: cool fluorescent vs warm window spill
  root.traverse(o => { if (o.isPointLight && o.color.getHexString() === 'fff2c0') o.color.set('#eef4ff'); });
  const spill = new THREE.SpotLight('#ffb45a', 7, 11, .62, .6, 1.2); spill.position.copy(V(0, 12.3, 2.3)); const st = new THREE.Object3D(); st.position.copy(V(-.2, 7.2, 0)); root.add(spill, st); spill.target = st; spill.castShadow = false;
  const fT = tex(256, 512, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.5, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const fl = add(new THREE.PlaneGeometry(2.6, 4.2), new THREE.MeshBasicMaterial({ color: '#ffb45a', map: fT, transparent: true, opacity: .3, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), 'env_window_spill_floor', 'fx', V(0, 9.8, .006), root, false); fl.rotation.x = -Math.PI / 2; fl.renderOrder = 2;
  for (const [x, face] of [[LX + .01, 'x+'], [RX - .01, 'x-']]) { const wp = plate(3.0, 2.2, poolM('#ffb45a', .28), 'env_window_spill_wall', 'fx', x, 11.0, 1.4, face); wp.renderOrder = 2; }
  // ---- FOREGROUND: dracaena in a glazed pot (left) + a 1990s supply cart (right)
  const leaves = [];
  { const px = (pl.plant_at || [-1.0, -.2])[0], py = (pl.plant_at || [-1.0, -.2])[1]; addv(new THREE.CylinderGeometry(.21, .16, .42, 18), std('#2a8a80', .3), 'env_plant_pot', 'ceramic', px, py, .21, true); addv(new THREE.TorusGeometry(.205, .018, 6, 24), std('#2a8a80', .3), 'env_plant_pot_rim', 'ceramic', px, py, .42).rotation.x = Math.PI / 2;
    addv(new THREE.CylinderGeometry(.2, .2, .02, 16), std('#4a3424', .95), 'env_plant_soil', 'soil', px, py, .4);
    const lm = [std('#3a8a3a', .6, 0, { side: THREE.DoubleSide }), std('#5aa84a', .6, 0, { side: THREE.DoubleSide }), std('#2a6a34', .6, 0, { side: THREE.DoubleSide })];
    [[0, 0, 1.25], [.06, .04, 1.55], [-.05, .05, 1.05]].forEach(([dx, dy, tz], k) => { bar([px + dx * .3, py + dy * .3, .4], [px + dx, py + dy, tz], .022, std('#8a7a5a', .8), 'env_plant_cane', 'wood');
      for (let i = 0; i < 16; i++) { const a = i * 2.4 + k, len = rr(.32, .5), g = new THREE.Group(); g.position.copy(V(px + dx, py + dy, tz - .05 + rr(-.04, .06))); root.add(g);
        const geo = new THREE.PlaneGeometry(.05, len, 1, 4), p = geo.attributes.position; for (let j = 0; j < p.count; j++) { const yy = p.getY(j) + len / 2; p.setY(j, yy); p.setZ(j, -.35 * yy * yy); } geo.computeVertexNormals();
        const lf = new THREE.Mesh(geo, lm[(i + k) % 3]); lf.castShadow = true; lf.name = 'env_plant_leaf'; lf.userData.role = 'leaf'; g.add(lf); g.rotation.set(rr(.5, 1.2), a, 0, 'YXZ'); g.userData.ph = rr(0, 6.3); g.userData.rx = g.rotation.x; leaves.push(g); } }); }
  { const x = 1.08, y = -1.6, g = new THREE.Group(); g.name = 'env_supply_cart'; root.add(g); const body = std('#d8ccb0', .5), drw = std('#7fb0c8', .45);
    box(.42, .62, .82, body, 'env_cart_body', 'plastic', x, y, .52, g); box(.46, .66, .03, std('#c8bca0', .4), 'env_cart_top', 'plastic', x, y, .945, g);
    for (let i = 0; i < 4; i++) { box(.008, .56, .16, drw, 'env_cart_drawer', 'plastic', x - .214, y, .82 - i * .19, g); box(.012, .18, .02, chrome, 'env_cart_drawer_pull', 'metal', x - .222, y, .86 - i * .19, g); }
    for (const [dx, dy] of [[-.17, -.27], [.17, -.27], [-.17, .27], [.17, .27]]) add(new THREE.SphereGeometry(.045, 10, 8), rubber, 'env_cart_caster', 'rubber', V(x + dx, y + dy, .05), g);
    bar([x - .25, y - .3, .9], [x - .25, y + .3, .9], .012, chrome, 'env_cart_handle', 'metal', g);
    const gb = tex(128, 64, (c, w, h) => { c.fillStyle = '#f4f4f0'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a6ad0'; c.fillRect(0, 0, w, 16); c.fillStyle = '#1a1a22'; c.font = 'bold 15px Arial'; c.fillText('EXAM GLOVES', 8, 40); c.fillText('MEDIUM', 8, 58); });
    box(.12, .24, .09, mat(gb, .6), 'env_cart_glove_box', 'paper', x, y - .15, 1.005, g); box(.12, .22, .1, std('#9ad0e8', .6), 'env_cart_tissue_box', 'paper', x, y + .14, 1.01, g);
    for (let i = 0; i < 3; i++) box(.3, .26, .04, std(['#f6f4ee', '#cfe2f4', '#e8f0e0'][i], .9), 'env_cart_folded_towel', 'cloth', x + .02, y + .02, 1.08 + i * .04, g);
    box(.008, .23, .32, std('#8a5a32', .5), 'env_cart_clipboard', 'wood', x - .22, y, .62, g); plate(.2, .26, std('#fbfaf4', .8), 'env_cart_clipboard_paper', 'paper', x - .226, y, .6, 'x-', g); }
  // ---- the 1994 calendar's HOUSTON TX goes navy (red gate: S2's #b8322a lettering counts as THE red)
  const cp = root.getObjectByName('wall_calendar_1994'); if (cp && pl.period_right && cp.material.map) { const c = cp.material.map.image.getContext('2d'); c.fillStyle = 'rgba(255,252,240,1)'; c.fillRect(22, 12, 256, 50); c.fillStyle = '#1d3f8a'; c.font = 'bold 36px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText((pl.period_right.text) || 'HOUSTON TX', 150, 38); cp.material.map.needsUpdate = true; }
  return { update: t => { for (const g of leaves) g.rotation.x = g.userData.rx + .035 * Math.sin(t * 1.1 + g.userData.ph); } };
}

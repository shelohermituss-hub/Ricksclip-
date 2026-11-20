// PLACE SET "waiting" (E) of "The Surgery Where the Surgeon Did Nothing" (owner: set helper B2 2026-11-16, then the S5 builder). Mid-1990s Houston hospital waiting room, afternoon.
// Plan metres, Z up, Y forward. Built at world.js ORIGIN.waiting; LOCAL coordinates below, ABSOLUTE = ORIGIN + local (anchors + stations are absolute).
// PLACE KEYS (film.json places.<name>): lamps: true|false (warm table lamps lit, default true) · sun_dir: [x,y,z] plan direction TOWARD the sun (default: through the
//   right-wall window with the vertical blinds, hard stripes on the carpet + chairs) · bubbles: true|false (fish-tank bubbles, default true) · fish_stare: 0..1
//   (row 42 gag: the near fish turns to the lens; default 0) · fish_stare_at: [[frame, v], ...] · tv: true|false (corner CRT glow, default true) · hide: [names]
// ANCHORS (plan metres, absolute): boy_seat (seat top centre of the boy's chair, row 42-44), boy_knee (where his scuffed knee sits when seated), nurse_kneel (her knee spot on
//   the carpet, row 43, facing +x to the boy), boy_run_out (row 44 exit point), fish_tank (front glass centre), stare_fish, reception_window, nurse_station, clock,
//   lamp_<k>, chair_<row>_<k> (seat top centres; rows a, b, c, d).
// STATIONS (export STATIONS, absolute, 9:16): wide_af (row 42 wide: the boy wailing on his chair, the fish tank behind on the left, reception + clock), knee_close
//   (ROW 43: low front third, the boy's knee NEAREST the lens, the hook's knee-close framing), pull_back (row 44: the pull back, room to run out), tank (fish turns).
// PARTS: carpet tile (quarter-turned 0.5 m tiles), drop ceiling (0.6 m tiles on a T-bar grid, lit troffers, return grille, sprinkler heads); butter-cream walls over a teal-
//   grey vinyl wainscot with an oak chair rail; GANGED moulded plastic chairs (orange #f09a2a / teal #2aa0a0 shells, chrome beam + T-legs + glides, shell bolts),
//   oak end tables with warm ceramic table lamps (pleated shades), magazine stacks + a wall magazine rack; the fish tank (oak cabinet, aluminium trim, hood with a
//   strip light, gravel, plants, a treasure-chest bubbler, orange-gold fish, rising bubbles); kids' corner (round rug, wooden letter blocks, a bead-maze table, a small
//   chair, a toy truck); reception window (sliding glass in an aluminium frame, laminate counter, bell, sign-in clipboard on a chain, brochure holder) + the nurse
//   station counter (transaction ledge, beige phone, file folders, a beige CRT terminal, wire in/out tray); wall clock (4:10); bluebonnet print; window with vertical
//   blinds; water cooler + cone cups; ficus in a basket; corner CRT TV on a bracket; coat rack; trash can. Surfaces: sets/look_pack.js. No red anywhere in this set.
// S5 BUILDER KEYS 2026-11-16 (all OFF unless set; rows 40-50 only, nothing else changes):
//   wrap: 'or_room' | 'stairwell' | 'office'   build THAT set (its own keys from the same place block), then lay the S5 overlays below on top (rows 40-41, 45-50)
//   glow: [{ at, color, i, dist }] warm point lights (EV_or corridor glow) . hide_pre: ['storey2', ...] hide every mesh/group whose name STARTS with one
//   impact: [[f, '#rrggbb'], ...] anime IMPACT FRAME (invert quad) . power: [{ kind, at, f, opts }] sets/power pieces from word frame f (ray_burst ...)
//   aura: { f0, f1, pts, color, size, grow, op }  ROW 40: warm gold glow along his body ON TWOS, spreading from pts[0] (the plaster)
//   sparkle: [{ f0, f1, at, r, n, color, size }]  soft glints with a thin streak (never a star), on twos
//   field: { f0, f1, color, color2, color3, dist }  the background drops to a warm abstract field (camera-held plane at dist m; nearer things stay in front)
//   props: [{ b, o, path: [[f, [x,y,z], yaw, [rx,0,rz], visible]...], glide, set: [[f, 'setter', value]...] }]  hero_props builders placed + keyed
//   sag: { match, f, amp, n }  ROW 46 EXTREME: meshes named match* dip and spring back . blizzard: { f, at, n, h, spread, ceil } paper burst . pens: { f, at }
//   drops: [{ kind: 'tear'|'bubble', at, f0, f1, pop, r }]  ROW 44: the frozen tear, the sob bubble (pops on pop)
// S5 ROUND 2 KEYS (2026-11-16, new keys only): impact_warm: true  the impact frames MULTIPLY the picture by their colour (a warm two-tone hit, never a white invert)
//   blizzard.f1: last frame the papers show . blizzard.ramp_in n (S5 v2r3): papers grow in over n frames . blizzard.near m (S5 v2r3): papers nearer the lens than m shrink away smoothly . blizzard.clear {at, r} (S5 v4): papers within r of the lens-to-at line shrink away (a face stays clear) . fist: [{ path: [[f, [x,y,z]], ...], r, sleeve, up: [x,y,z], len, plaster_until, plaster_child }]  a round black ink fist
//   (never a 3D hand) on a scrub sleeve that leaves the frame upward; carries a held plaster under it until plaster_until (ROW 43 the nurse's slap from the top edge)
// S5 R2 KEY: troffer_flat '#hex' = the ceiling lens lamps as a plain toon colour (the glow material pumped the whole frame's brightness 5-15 grey levels whenever the camera swept the ceiling in/out of view: flicker 1826/1888-91/1910). S5 BUILD-OUT KEYS (2026-11-16): fade: [[f, op], ...] keyed black veil (open from S4's dark lid) . recolor: [{ match: ['prefix', ...], color }] recolour set meshes (r50 landing edge)
// S5 v4 KEY (2026-11-17): gang_drop: { a: [k, ...] } leaves seats k of the front gang a out (the gang splits into separate frames, no beam through the gap): row 43 the nurse kneels on open floor. gang_y: { a: y } moves the front gang a in plan y (default .5).
// S5 v3 KEY (2026-11-17): zzz: { head, f0, f1, lift, rise, size, side, ... } floating Zs from sets/zzz_fx.js anchored at a plan point (rows 40-41).
// ENV v3 key (env helper E2 2026-11-17; OFF unless set; every older key unchanged; with wrap the wrapped set reads the same key):
//   env_v3: true   1990s WALLPAPER BORDER (teal/peach) + peach band over the chair rail, 1990s SNACK VENDING MACHINE (glass front, 25 packs on coils, keypad, slots, SNACKS header),
//                  framed TEXAS prints (longhorn, Gulf Coast derrick, San Jacinto 1836), CHECK IN lettering on the reception glass + PLEASE SIGN IN card, TV programme card
//                  (CHANNEL 11 4:00 NEWS, HOUSTON 94, TUE JUNE 7 1994), kids' crayon DRAWINGS taped on the wall, TOY BOX + ball + teddy + toy plane, dracaena / counter pothos /
//                  peace lily (leaves tremble), COATS on chair backs (denim, raincoat, windbreaker), purse, HOUSTON POST newspaper, tote, foam cup, magazine covers with titles,
//                  CEILING DETAIL: back-wall soffit with 4 downlights, 2 square supply diffusers with paper streamers (flutter), water-stained tile, speaker, smoke detector,
//                  hanging EXIT sign (green); SECOND LIGHT COLOUR: cool fluorescent fill + corner fill. No red.
import { ORIGIN } from './world.js';
import * as HP from './hero_props.js';
import * as LP from './look_pack.js';

const O = ORIGIN.waiting, A = (x, y, z) => [O[0] + x, O[1] + y, O[2] + z];
const X0 = -4, X1 = 4, Y0 = -3.6, Y1 = 4, CEIL = 2.75, SEAT = .45;
export const STATIONS = {
  wide_af:    { pos: A(1.0, -3.45, 1.15), aim: A(-1.0, 1.4, .82), lens: 26, purpose: 'row 42 wide: the boy wailing on the front chair, fish tank left, reception + clock behind' },
  knee_close: { pos: A(-.62, -.32, .52), aim: A(-.9, .55, .62), lens: 28, purpose: 'ROW 43: low front third, the boy knee nearest the lens (hook knee-close framing); the nurse kneels at nurse_kneel' },
  pull_back:  { pos: A(.4, -3.0, 1.1), aim: A(-.8, .9, .8), lens: 24, purpose: 'row 44: pull back, room to run out to the right' },
  tank:       { pos: A(-2.6, -.2, 1.1), aim: A(-3.75, 1.3, 1.0), lens: 30, purpose: 'row 42 background gag: the fish turns to stare' },
};
const canvasTex = (THREE, w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const keyed = (k, f, d) => { if (!Array.isArray(k) || !k.length) return d; if (f <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (f <= k[i][0]) { const [fa, a] = k[i - 1], [fb, b] = k[i]; return a + (b - a) * (f - fa) / Math.max(1e-6, fb - fa); } return k[k.length - 1][1]; };

export async function build(THREE, scene, film, ctx) {
  const plw = ctx.place || {};
  if (plw.wrap && plw.wrap !== 'waiting') { const mod = await import('./' + plw.wrap + '.js'), built = (await mod.build(THREE, scene, film, ctx)) || {}, fx = await s5fx(THREE, scene, ctx, plw);
    return { update: (f, t, R) => { if (built.update) built.update(f, t, R); fx.update(f, t, R); }, anchors: built.anchors || {}, stations: built.stations }; }
  const pl = ctx.place || {}, M = LP.pack(THREE, ctx), toon = ctx.toon, V = (x, y, z) => ctx.B2T([x, y, z]);
  const root = new THREE.Group(); root.name = 'waiting_room'; root.position.copy(ctx.B2T(O)); scene.add(root);
  let seed = 23; const R0 = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * R0();
  const add = (geo, mat, name, role, p, parent = root, shadow = true) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.userData.role = role; if (p) m.position.copy(p); m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m; };
  const box = (sx, sy, sz, mat, name, role, x, y, z, parent = root, shadow = true) => add(new THREE.BoxGeometry(sx, sz, sy), mat, name, role, V(x, y, z), parent, shadow);
  const bar = (a, b, r, mat, name, role = 'metal', parent = root, segs = 10) => { const P = V(...a), Q = V(...b), d = Q.clone().sub(P), L = Math.max(d.length(), 1e-4), m = add(new THREE.CylinderGeometry(r, r, L, segs), mat, name, role, P.clone().addScaledVector(d, .5), parent); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return m; };
  const glow = M.glow, ink = toon('#2a1a1f'), chrome = M.chrome, steel = M.steel, steelDk = M.steelDk;
  const oak = M.desk, wallP = M.plaster, wains = M.paint('#8fb0a8'), laminate = M.paint('#e8e0cc'), beige = M.plasticOf ? M.plasticOf('#d8cfb8') : toon('#d8cfb8');
  scene.children.forEach(o => { if (o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.radius === 400) o.visible = false; });
  LP.applyLight(THREE, scene, ctx, { fillFrom: [O[0] - 6, O[1] - 6, 3], fog: [10, 34] }); scene.background = new THREE.Color('#3a3a6a');
  const sd = pl.sun_dir || [1, -.25, .5], sv = V(...sd).sub(V(0, 0, 0)).normalize(), tgt = ctx.B2T(A(0, 0, 1));
  scene.traverse(o => { if (o.isDirectionalLight && o.castShadow) { o.target.position.copy(tgt); scene.add(o.target); o.position.copy(tgt).addScaledVector(sv, 30); Object.assign(o.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 70 }); o.shadow.camera.updateProjectionMatrix(); o.shadow.bias = -.0005; } });

  // ================= SHELL: carpet tile, drop ceiling, walls with wainscot + chair rail, window with vertical blinds =================
  box(X1 - X0, Y1 - Y0, .04, M.carpet, 'carpet_tile_floor', 'floor', 0, (Y0 + Y1) / 2, -.02, root, false);
  box(X1 - X0, Y1 - Y0, .04, M.ceilPanel, 'drop_ceiling_tiles', 'ceiling', 0, (Y0 + Y1) / 2, CEIL + .02, root, false);
  for (let x = X0 + .6; x < X1; x += .6) box(.022, Y1 - Y0, .012, toon('#f4f2ea'), 'ceiling_tbar', 'metal', x, (Y0 + Y1) / 2, CEIL - .004, root, false);
  for (let y = Y0 + .6; y < Y1; y += .6) box(X1 - X0, .022, .012, toon('#f4f2ea'), 'ceiling_tbar', 'metal', 0, y, CEIL - .004, root, false);
  for (const [x, y] of [[-1.8, -1.2], [1.2, -1.2], [-1.8, 1.8], [1.2, 1.8]]) { box(.6, 1.2, .02, pl.troffer_flat ? toon(pl.troffer_flat) : glow('#fff4dc'), 'troffer_lens_lamp', pl.troffer_flat ? 'plastic' : 'lamp', x, y, CEIL - .012, root, false); for (let k = 1; k < 4; k++) box(.6, .012, .012, toon('#d8d4c8'), 'troffer_louvre', 'metal', x, y - .6 + k * .3, CEIL - .025, root, false); }
  box(.6, .6, .015, toon('#cfcbc0'), 'return_air_grille', 'metal', -.3, .3, CEIL - .01, root, false); for (let k = 0; k < 8; k++) box(.56, .01, .012, toon('#9a968c'), 'grille_slat', 'metal', -.3, .03 + k * .075, CEIL - .02, root, false);
  for (const [x, y] of [[0, -2.2], [-2.6, .6], [2.4, .6], [0, 3.0]]) add(new THREE.CylinderGeometry(.03, .015, .03, 10), chrome, 'sprinkler_head', 'metal', V(x, y, CEIL - .02), root, false);
  const wall = (sx, sy, x, y, nm) => { box(sx, sy, CEIL, wallP, nm, 'wall', x, y, CEIL / 2, root, true); };
  wall(.15, Y1 - Y0, X0 - .075, (Y0 + Y1) / 2, 'wall_left'); wall(X1 - X0, .15, 0, Y1 + .075, 'wall_back'); wall(X1 - X0, .15, 0, Y0 - .075, 'wall_front_4th');
  // right wall with the window opening (y .2..2.2, z .9..2.2)
  const WX = { y0: .2, y1: 2.2, z0: .9, z1: 2.2 };
  box(.15, WX.y0 - Y0, CEIL, wallP, 'wall_right_a', 'wall', X1 + .075, (Y0 + WX.y0) / 2, CEIL / 2); box(.15, Y1 - WX.y1, CEIL, wallP, 'wall_right_b', 'wall', X1 + .075, (WX.y1 + Y1) / 2, CEIL / 2);
  box(.15, WX.y1 - WX.y0, WX.z0, wallP, 'wall_right_sill', 'wall', X1 + .075, (WX.y0 + WX.y1) / 2, WX.z0 / 2); box(.15, WX.y1 - WX.y0, CEIL - WX.z1, wallP, 'wall_right_head', 'wall', X1 + .075, (WX.y0 + WX.y1) / 2, (WX.z1 + CEIL) / 2);
  const sky = LP.sky(THREE, ctx, 'texas', { w: 6, h: 3.5, parent: root }); sky.mesh.position.copy(V(X1 + 3, 1.2, 1.6)); sky.mesh.rotation.y = -Math.PI / 2;
  for (let k = 0; k <= 4; k++) box(.05, .04, WX.z1 - WX.z0, M.steel, 'window_mullion', 'metal', X1 + .02, WX.y0 + k * (WX.y1 - WX.y0) / 4, (WX.z0 + WX.z1) / 2);
  box(.2, WX.y1 - WX.y0 + .1, .03, laminate, 'window_sill', 'stone', X1 - .06, (WX.y0 + WX.y1) / 2, WX.z0);
  box(.06, WX.y1 - WX.y0 + .2, .06, steel, 'blind_headrail', 'metal', X1 - .1, (WX.y0 + WX.y1) / 2, WX.z1 + .05);
  const vaneM = M.paint('#efe6d0'); for (let k = 0; k < 22; k++) { const y = WX.y0 + .04 + k * .09, v = box(.008, .085, WX.z1 - WX.z0 + .02, vaneM, 'vertical_blind_vane', 'cloth', X1 - .12, y, (WX.z0 + WX.z1) / 2, root, true); v.rotation.y = .9; }
  bar([X1 - .12, WX.y1 - .02, WX.z1 + .03], [X1 - .12, WX.y1 - .02, WX.z0 + .1], .003, toon('#efe6d0'), 'blind_wand', 'plastic', root, 4);
  for (const [x0, x1, y0, y1, ax] of [[X0, X1, Y1, Y1, 'y'], [X0, X0, Y0, Y1, 'x']]) { const len = ax === 'y' ? x1 - x0 : y1 - y0, cx = ax === 'y' ? 0 : X0 + .008, cy = ax === 'y' ? Y1 - .008 : (Y0 + Y1) / 2;
    box(ax === 'y' ? len : .012, ax === 'y' ? .012 : len, .9, wains, 'vinyl_wainscot', 'wall', cx, cy, .45, root, false);
    box(ax === 'y' ? len : .04, ax === 'y' ? .04 : len, .06, oak, 'oak_chair_rail', 'wood', cx, cy, .92, root, false); box(ax === 'y' ? len : .02, ax === 'y' ? .02 : len, .1, toon('#5a6a66'), 'rubber_cove_base', 'rubber', cx, cy, .05, root, false); }
  box(.012, -Y0 + 0, .9, wains, 'vinyl_wainscot_r', 'wall', X1 - .008, Y0 / 2, .45, root, false); box(.04, -Y0, .06, oak, 'oak_chair_rail_r', 'wood', X1 - .008, Y0 / 2, .92, root, false);

  // ================= GANGED MOULDED CHAIRS =================
  const shellGeo = (() => { const s = new THREE.Shape(), t = .012; s.moveTo(-.22, .02); s.quadraticCurveTo(-.24, -.01, -.18, -.015); s.lineTo(.17, -.01); s.quadraticCurveTo(.22, 0, .21, .07);   // seat front -> back (x = depth), y = up
    s.quadraticCurveTo(.215, .2, .26, .45); s.quadraticCurveTo(.27, .5, .245, .5); s.quadraticCurveTo(.2, .2, .17, .07 + t); s.lineTo(-.18, .015 + t); s.quadraticCurveTo(-.215, .015, -.22, .02);
    const g = new THREE.ExtrudeGeometry(s, { depth: .44, bevelEnabled: true, bevelThickness: .012, bevelSize: .01, bevelSegments: 3, curveSegments: 10 }); g.translate(0, 0, -.22); return g; })();
  const orange = M.plasticOrange, teal = M.plasticTeal, chairs = {};
  const gang = (id, x0, y, n, facing, colours, koff = 0) => { const g = new THREE.Group(); g.name = 'chair_gang_' + id; root.add(g); const dirY = facing === '-y' ? -1 : 1;   // facing = where the sitter looks
    const step = .55, xs = []; for (let k = 0; k < n; k++) xs.push(x0 + k * step);
    bar([x0 - .25, y + dirY * .02, .36], [x0 + (n - 1) * step + .25, y + dirY * .02, .36], .022, chrome, 'gang_beam', 'metal', g, 14);
    for (const xl of [x0 - .2, x0 + (n - 1) * step + .2, ...(n > 3 ? [x0 + (n - 1) * step / 2] : [])]) { bar([xl, y, .36], [xl, y, .03], .018, chrome, 'gang_leg', 'metal', g, 12); bar([xl, y - .26, .025], [xl, y + .26, .025], .016, chrome, 'gang_foot', 'metal', g, 10); for (const s of [-1, 1]) add(new THREE.CylinderGeometry(.02, .022, .02, 10), toon('#2a2a30'), 'floor_glide', 'rubber', V(xl, y + s * .26, .01), g, false); }
    xs.forEach((x, k) => { const col = colours[k % colours.length], sh = add(shellGeo, col === 'o' ? orange : teal, 'chair_shell_' + (col === 'o' ? 'orange' : 'teal'), 'plastic', V(x, y, SEAT - .02), g, true);
      sh.rotation.y = dirY > 0 ? -Math.PI / 2 : Math.PI / 2;   // shape x (depth, front at -x) -> plan: back away from the facing
      for (const s of [-1, 1]) { bar([x + s * .12, y, .37], [x + s * .12, y, SEAT - .03], .012, chrome, 'shell_bracket', 'metal', g, 8); add(new THREE.SphereGeometry(.009, 8, 6), steelDk, 'shell_bolt', 'metal', V(x + s * .12, y - dirY * .1, SEAT - .035), g, false); }
      if (k < xs.length - 1) { box(.05, .3, .03, chrome, 'arm_rest_bar', 'metal', x + step / 2, y - dirY * .02, .64, g, true); bar([x + step / 2, y + dirY * .1, .37], [x + step / 2, y + dirY * .1, .64], .01, chrome, 'arm_rest_post', 'metal', g, 8); box(.06, .32, .025, toon('#2a2a30'), 'arm_pad', 'rubber', x + step / 2, y - dirY * .02, .66, g, false); }
      chairs['chair_' + id + '_' + (k + koff)] = A(x, y - dirY * .02, SEAT); });
    return g; };
  { const drop = (pl.gang_drop && pl.gang_drop.a) || [], cols = ['o', 't', 'o', 't'], runs = []; let r = null;   // S5 v4 gang_drop: seats left out split the gang into separate frames
    for (let k = 0; k < 4; k++) { if (drop.includes(k)) { r = null; continue; } if (!r) { r = [k, 0]; runs.push(r); } r[1]++; }
    for (const [k0, n] of runs) gang('a', -1.4 + k0 * .55, (pl.gang_y && pl.gang_y.a) ?? .5, n, '-y', cols.slice(k0).concat(cols), k0); }   // front row, facing the lens (the boy's row)
  gang('b', -1.4, 1.25, 4, '+y', ['t', 'o', 't', 'o']);      // back to back, facing reception
  gang('c', 1.7, 2.9, 3, '-y', ['o', 'o', 't']);             // under the nurse station side
  gang('d', -.9, -2.1, 3, '+y', ['t', 'o', 't']);            // foreground row, backs to the lens (big + close)
  // ================= END TABLES + WARM LAMPS + MAGAZINES =================
  const lamps = []; const table = (x, y, nm) => { box(.55, .55, .03, oak, nm + '_top', 'wood', x, y, .55); for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(.04, .04, .54, oak, nm + '_leg', 'wood', x + sx * .24, y + sy * .24, .27); box(.5, .5, .02, oak, nm + '_shelf', 'wood', x, y, .14);
    // ceramic ginger-jar lamp base (teal glaze), brass neck, pleated cream shade
    const base = add(new THREE.SphereGeometry(.1, 16, 12), M.plasticOf ? M.plasticOf('#3a8a8a') : toon('#3a8a8a'), nm + '_lamp_base', 'ceramic', V(x - .1, y + .1, .68)); base.scale.set(1, 1.2, 1);
    bar([x - .1, y + .1, .78], [x - .1, y + .1, .98], .01, M.steel, nm + '_lamp_neck', 'metal', root, 8);
    const shade = add(new THREE.CylinderGeometry(.1, .17, .2, 24, 1, true), new THREE.MeshLambertMaterial({ color: '#fbe8c0', emissive: pl.lamps === false ? '#000000' : '#ffb860', emissiveIntensity: .55, side: THREE.DoubleSide }), nm + '_lamp_shade', 'lamp', V(x - .1, y + .1, 1.02), root, false);
    for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; bar([x - .1 + Math.cos(a) * .102, y + .1 + Math.sin(a) * .102, 1.12], [x - .1 + Math.cos(a) * .172, y + .1 + Math.sin(a) * .172, .92], .002, toon('#e8d0a0'), nm + '_shade_pleat', 'cloth', root, 3); }
    add(new THREE.SphereGeometry(.035, 10, 8), glow(pl.lamps === false ? '#c8c0b0' : '#fff0c8'), nm + '_lamp_bulb_globe', 'lamp', V(x - .1, y + .1, .98), root, false);
    if (pl.lamps !== false) { const p = new THREE.PointLight('#ffc070', 2.2, 4.5, 1.6); p.position.copy(V(x - .1, y + .1, .95)); root.add(p); }
    lamps.push(A(x - .1, y + .1, .98));
    const mag = ['#2a7ab8', '#f2c62a', '#3a8a9a', '#2fae7a', '#f0b050', '#e8e4da', '#3a5aa8']; for (let k = 0; k < 5; k++) { const m = box(.21, .28, .006, toon(mag[(k + x * 3 | 0) % mag.length] || '#2a7ab8'), nm + '_magazine', 'paper', x + .1 + rr(-.03, .03), y - .1 + rr(-.03, .03), .572 + k * .007, root, false); m.rotation.y = rr(-.4, .4); }
    for (let k = 0; k < 3; k++) box(.21, .28, .006, toon(mag[(k + 2) % mag.length]), nm + '_shelf_magazine', 'paper', x + rr(-.1, .1), y + rr(-.1, .1), .155 + k * .007, root, false); };
  table(1.0, .55, 'table_a'); table(-2.15, 1.25, 'table_b'); table(.15, -2.1, 'table_d');
  // magazine wall rack (3 pockets) on the left wall
  for (let k = 0; k < 3; k++) { box(.04, .6, .3, oak, 'mag_rack_pocket', 'wood', X0 + .04, -1.3, .95 + k * .35); for (let q = 0; q < 3; q++) box(.006, .2, .26, toon(['#2a7ab8', '#f2c62a', '#2fae7a', '#3a5aa8'][(k + q) % 4]), 'rack_magazine', 'paper', X0 + .07 + q * .008, -1.48 + q * .19, 1.02 + k * .35, root, false); }

  // ================= THE FISH TANK on its oak cabinet (left wall) =================
  const FT = { x: X0 + .35, y: 1.6, z0: .78, w: 1.2, d: .42, h: .5 }, tankG = new THREE.Group(); tankG.name = 'fish_tank'; root.add(tankG);
  box(FT.d + .06, FT.w + .06, FT.z0, oak, 'tank_cabinet', 'wood', FT.x, FT.y, FT.z0 / 2, tankG); for (const s of [-1, 1]) { box(.01, FT.w / 2 - .04, FT.z0 - .14, M.paint('#7a4a26'), 'cabinet_door_panel', 'wood', FT.x + FT.d / 2 + .035, FT.y + s * FT.w / 4, FT.z0 / 2, tankG, false); box(.02, .02, .08, chrome, 'cabinet_knob', 'metal', FT.x + FT.d / 2 + .045, FT.y + s * .05, FT.z0 / 2 + .05, tankG, false); }
  const glassM = new THREE.MeshPhysicalMaterial({ color: '#dff6f4', transparent: true, opacity: .16, roughness: .05, depthWrite: false }), waterM = new THREE.MeshLambertMaterial({ color: '#4ac8c0', transparent: true, opacity: .42, emissive: '#1a6a70', emissiveIntensity: .45, depthWrite: false });
  box(FT.d - .02, FT.w - .02, FT.h - .06, waterM, 'tank_water', 'water', FT.x, FT.y, FT.z0 + (FT.h - .06) / 2 + .01, tankG, false);
  box(FT.d, FT.w, FT.h, glassM, 'tank_glass', 'glass', FT.x, FT.y, FT.z0 + FT.h / 2, tankG, false);
  for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) box(.02, .02, FT.h, toon('#2a2a30'), 'tank_corner_trim', 'plastic', FT.x + dx * FT.d / 2, FT.y + dy * FT.w / 2, FT.z0 + FT.h / 2, tankG, false);
  box(FT.d + .03, FT.w + .03, .04, toon('#2a2a30'), 'tank_base_trim', 'plastic', FT.x, FT.y, FT.z0 + .02, tankG, false); box(FT.d + .04, FT.w + .04, .08, toon('#2a2a30'), 'tank_hood', 'plastic', FT.x, FT.y, FT.z0 + FT.h + .04, tankG, true);
  box(.06, FT.w - .1, .012, glow('#e8fbff'), 'tank_hood_strip_lamp', 'lamp', FT.x, FT.y, FT.z0 + FT.h - .005, tankG, false);
  const tl = new THREE.PointLight('#9ff0ff', 1.2, 2.2, 1.5); tl.position.copy(V(FT.x + .1, FT.y, FT.z0 + FT.h - .1)); tankG.add(tl);
  const grav = ['#d8c8a0', '#a89070', '#6a8a9a', '#e8e0d0', '#5a6a5a']; for (let k = 0; k < 160; k++) add(new THREE.SphereGeometry(rr(.008, .016), 5, 4), toon(grav[k % 5]), 'tank_gravel', 'stone', V(FT.x + rr(-FT.d / 2 + .03, FT.d / 2 - .03), FT.y + rr(-FT.w / 2 + .03, FT.w / 2 - .03), FT.z0 + .05 + rr(0, .03)), tankG, false);
  const plantM = [toon('#3a9a4a'), toon('#5ab858'), toon('#2a7a40')]; for (let k = 0; k < 14; k++) { const px = FT.x + rr(-.12, .1), py = FT.y + (k < 7 ? rr(-.55, -.25) : rr(.25, .55)), h = rr(.18, .38); const pts = []; for (let q = 0; q <= 6; q++) { const u = q / 6; pts.push(V(px + Math.sin(u * 3 + k) * .02, py + Math.sin(u * 2 + k) * .03, FT.z0 + .07 + u * h)); }
    add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 10, .009, 4), plantM[k % 3], 'tank_plant_blade', 'plant', null, tankG, false); }
  const chest = new THREE.Group(); chest.name = 'treasure_chest_bubbler'; tankG.add(chest); box(.08, .12, .07, M.paint('#8a5a2a'), 'chest_box', 'wood', FT.x - .05, FT.y + .05, FT.z0 + .1, chest); const lid = box(.08, .12, .02, M.paint('#9a6a32'), 'chest_lid_open', 'wood', FT.x - .09, FT.y + .05, FT.z0 + .16, chest); lid.rotation.z = .6; box(.082, .02, .072, M.paint('#d8a83c'), 'chest_brass_band', 'metal', FT.x - .05, FT.y + .02, FT.z0 + .1, chest, false);
  const fishM = [toon('#f28a2a'), toon('#ffb030'), toon('#f6a040')], fishes = [];
  const mkFish = (x, y, z, s, k) => { const g = new THREE.Group(); g.name = k === 0 ? 'stare_fish' : 'goldfish'; g.position.copy(V(x, y, z)); tankG.add(g); const b = new THREE.Mesh(new THREE.SphereGeometry(.03 * s, 12, 10), fishM[k % 3]); b.scale.set(1.6, 1, .7); g.add(b);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(.022 * s, .04 * s, 3), fishM[(k + 1) % 3]); tail.rotation.z = Math.PI / 2; tail.position.x = -.06 * s; tail.scale.z = .3; g.add(tail);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(.007 * s, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' })); eye.position.set(.03 * s, .008 * s, .016 * s); g.add(eye); const pu = new THREE.Mesh(new THREE.SphereGeometry(.004 * s, 6, 4), ink); pu.position.set(.034 * s, .008 * s, .021 * s); g.add(pu);
    const eye2 = eye.clone(); eye2.position.z = -.016 * s; g.add(eye2); const pu2 = pu.clone(); pu2.position.z = -.021 * s; g.add(pu2); fishes.push({ g, x, y, z, k, tail }); };
  mkFish(FT.x + .08, FT.y - .1, FT.z0 + .3, 1.5, 0); for (let k = 1; k < 6; k++) mkFish(FT.x + rr(-.1, .1), FT.y + rr(-.45, .45), FT.z0 + rr(.15, .4), rr(.8, 1.2), k);
  const bubbles = []; if (pl.bubbles !== false) for (let k = 0; k < 26; k++) { const b = add(new THREE.SphereGeometry(rr(.005, .011), 8, 6), new THREE.MeshBasicMaterial({ color: '#eaffff', transparent: true, opacity: .75 }), 'tank_bubble', 'water', V(FT.x - .05, FT.y + .05, FT.z0 + .1), tankG, false); bubbles.push({ b, ph: R0(), dx: rr(-.015, .015) }); }

  // ================= KIDS' CORNER =================
  const rug = add(new THREE.CircleGeometry(.85, 40), M.rug ? M.rug(1.7, 1.7) : toon('#2a7ab8'), 'kids_round_rug', 'carpet', V(-2.8, -1.7, .006), root, false); rug.rotation.x = -Math.PI / 2;
  const bc = ['#2a7ab8', '#f2c62a', '#2fae5a', '#f09a2a', '#3a5aa8', '#2aa0a0'], letters = 'ABCKIDS';
  for (let k = 0; k < 11; k++) { const t = canvasTex(THREE, 64, 64, (c, w, h) => { c.fillStyle = '#f4ead4'; c.fillRect(0, 0, w, h); c.strokeStyle = bc[k % 6]; c.lineWidth = 8; c.strokeRect(4, 4, w - 8, h - 8); c.fillStyle = bc[(k + 2) % 6]; c.font = 'bold 44px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(letters[k % letters.length], w / 2, h / 2 + 2); });
    const stack = k < 4, bx = stack ? -2.55 : -3.2 + rr(-.3, .6), by = stack ? -1.4 : -1.9 + rr(-.4, .4), bz = stack ? .04 + k * .08 : .04; const b = box(.08, .08, .08, new THREE.MeshLambertMaterial({ map: t }), 'wooden_letter_block', 'wood', bx, by, bz, root, true); b.rotation.y = stack ? k * .2 : rr(0, 3); }
  // bead-maze table: wooden box with looping coloured wires and beads
  box(.5, .5, .32, oak, 'bead_maze_table', 'wood', -3.25, -1.1, .16); for (let w = 0; w < 4; w++) { const pts = []; for (let q = 0; q <= 12; q++) { const u = q / 12; pts.push(V(-3.45 + u * .4, -1.1 + Math.sin(u * 6 + w) * .15, .32 + Math.sin(u * Math.PI) * (.18 + w * .05))); }
    const crv = new THREE.CatmullRomCurve3(pts); add(new THREE.TubeGeometry(crv, 30, .006, 5), toon(bc[w]), 'bead_maze_wire', 'metal', null, root, true); for (let q = 0; q < 4; q++) add(new THREE.SphereGeometry(.025, 10, 8), toon(bc[(w + q + 1) % 6]), 'bead_maze_bead', 'wood', crv.getPoint(.15 + q * .2), root, true); }
  box(.3, .3, .02, M.plasticOf ? M.plasticOf('#f2c62a') : toon('#f2c62a'), 'kid_chair_seat', 'plastic', -2.2, -2.3, .28); box(.3, .02, .28, M.plasticOf ? M.plasticOf('#f2c62a') : toon('#f2c62a'), 'kid_chair_back', 'plastic', -2.2, -2.15, .43); for (const sx of [-1, 1]) for (const sy of [-1, 1]) bar([-2.2 + sx * .13, -2.3 + sy * .13, .27], [-2.2 + sx * .13, -2.3 + sy * .13, 0], .012, chrome, 'kid_chair_leg', 'metal', root, 6);
  box(.22, .12, .08, M.plasticOf ? M.plasticOf('#2a7ab8') : toon('#2a7ab8'), 'toy_truck_body', 'plastic', -3.0, -2.25, .07); box(.1, .11, .07, M.plasticOf ? M.plasticOf('#f2c62a') : toon('#f2c62a'), 'toy_truck_cab', 'plastic', -2.86, -2.25, .14); for (const sx of [-1, 1]) for (const sy of [-1, 1]) { const wh = add(new THREE.CylinderGeometry(.028, .028, .02, 12), ink, 'toy_truck_wheel', 'rubber', V(-2.95 + sx * .08, -2.25 + sy * .065, .03)); wh.rotation.x = Math.PI / 2; }

  // ================= RECEPTION WINDOW + NURSE STATION (back wall) =================
  const RW = { x: -1.2, w: 1.9 }, recG = new THREE.Group(); recG.name = 'reception'; root.add(recG);
  box(RW.w, .35, 1.02, M.veneer || oak, 'reception_counter_front', 'wood', RW.x, Y1 - .2, .51, recG); box(RW.w + .06, .42, .035, laminate, 'reception_counter_top', 'wood', RW.x, Y1 - .2, 1.04, recG);
  box(RW.w, .04, .9, toon('#c8d0d8'), 'reception_window_frame', 'metal', RW.x, Y1 - .01, 1.55, recG, false);
  box(RW.w - .1, .02, .8, new THREE.MeshPhysicalMaterial({ color: '#e0f0f4', transparent: true, opacity: .25, roughness: .05 }), 'reception_sliding_glass', 'glass', RW.x - .2, Y1 - .04, 1.55, recG, false);
  box(.03, .03, .8, toon('#c8d0d8'), 'sliding_glass_stile', 'metal', RW.x + .25, Y1 - .055, 1.55, recG, false);
  box(RW.w - .06, .02, .84, M.paint('#f4ead0'), 'office_behind_glass', 'wall', RW.x, Y1 + .4, 1.5, recG, false);
  for (let k = 0; k < 3; k++) { box(.9, .25, .02, oak, 'office_shelf', 'wood', RW.x - .3, Y1 + .3, 1.25 + k * .25, recG, false); for (let q = 0; q < 8; q++) box(.04, .2, .2, toon(['#f2c62a', '#2a7ab8', '#e8e4da', '#2fae7a'][(q + k) % 4]), 'office_file_binder', 'paper', RW.x - .7 + q * .1, Y1 + .3, 1.36 + k * .25, recG, false); }
  const bell = add(new THREE.SphereGeometry(.04, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), chrome, 'counter_bell', 'metal', V(RW.x + .5, Y1 - .3, 1.06), recG); add(new THREE.CylinderGeometry(.045, .045, .012, 14), toon('#2a2a30'), 'bell_base', 'metal', V(RW.x + .5, Y1 - .3, 1.062), recG);
  box(.23, .3, .012, M.paint('#8a5a32'), 'sign_in_clipboard', 'wood', RW.x - .3, Y1 - .3, 1.065, recG); box(.21, .27, .004, toon('#f8f6ee'), 'sign_in_sheet', 'paper', RW.x - .3, Y1 - .31, 1.073, recG, false); for (let k = 0; k < 7; k++) box(.17, .004, .002, toon('#6a7aa8'), 'sign_in_line', 'paper', RW.x - .3, Y1 - .42 + k * .035, 1.076, recG, false);
  bar([RW.x - .15, Y1 - .2, 1.07], [RW.x - .05, Y1 - .45, 1.07], .004, chrome, 'pen_ball_chain', 'metal', recG, 4); bar([RW.x - .05, Y1 - .45, 1.072], [RW.x + .08, Y1 - .48, 1.072], .006, toon('#1e2a5a'), 'pen_on_chain', 'plastic', recG, 6);
  box(.25, .1, .2, new THREE.MeshPhysicalMaterial({ color: '#f0f8ff', transparent: true, opacity: .4 }), 'brochure_holder', 'plastic', RW.x + .8, Y1 - .3, 1.15, recG, false); for (let k = 0; k < 2; k++) box(.1, .02, .18, toon(['#2aa0a0', '#f2c62a'][k]), 'brochure', 'paper', RW.x + .74 + k * .12, Y1 - .3, 1.16, recG, false);
  // nurse station: L counter at the back right with a transaction ledge
  const NS = { x: 2.6, y: 3.3 }; box(2.2, .55, 1.08, M.veneer || oak, 'nurse_station_counter', 'wood', NS.x, NS.y, .54); box(2.3, .3, .03, laminate, 'nurse_station_ledge', 'wood', NS.x, NS.y - .3, 1.1);
  box(.5, .4, .4, beige, 'beige_crt_terminal', 'plastic', NS.x + .5, NS.y + .1, 1.3); box(.34, .02, .26, glow('#7ad8a8'), 'crt_terminal_screen_glass', 'glass', NS.x + .5, NS.y - .11, 1.32, root, false); box(.45, .18, .04, beige, 'terminal_keyboard', 'plastic', NS.x + .5, NS.y - .2, 1.13);
  box(.2, .22, .08, beige, 'beige_phone_base', 'plastic', NS.x - .3, NS.y - .1, 1.15); bar([NS.x - .38, NS.y - .15, 1.21], [NS.x - .22, NS.y - .15, 1.21], .025, beige, 'beige_phone_handset', 'plastic', root, 10);
  const cord = []; for (let k = 0; k <= 16; k++) cord.push(V(NS.x - .38 - Math.sin(k) * .015, NS.y - .1 + Math.cos(k * 1.3) * .015, 1.19 - k * .01)); add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cord), 40, .004, 4), beige, 'phone_coil_cord', 'plastic', null, root, false);
  for (let k = 0; k < 4; k++) { const fo = box(.3, .23, .01, toon(['#f2d88a', '#e8d8b0', '#f2d88a', '#c8b48a'][k]), 'file_folder', 'paper', NS.x - .8 + k * .02, NS.y + .05 + k * .01, 1.13 + k * .012, root, false); fo.rotation.y = k * .08; }
  for (let k = 0; k < 2; k++) { box(.32, .26, .005, steelDk, 'wire_tray_floor', 'metal', NS.x + 1.0, NS.y, 1.14 + k * .09); for (const s of [-1, 1]) box(.32, .005, .06, steelDk, 'wire_tray_side', 'metal', NS.x + 1.0, NS.y + s * .13, 1.17 + k * .09, root, false); }
  // the wall clock (4:10 PM) over the reception window
  const clk = canvasTex(THREE, 300, 300, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(150, 150, 140, 0, 7); c.fill(); c.strokeStyle = '#2a1a1f'; c.lineWidth = 12; c.stroke(); c.fillStyle = '#2a1a1f'; c.font = 'bold 32px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) { const a = -Math.PI / 2 + i * Math.PI / 6; c.fillText(String(i), 150 + Math.cos(a) * 106, 150 + Math.sin(a) * 106); } c.lineCap = 'round'; const hA = -Math.PI / 2 + 4.17 * Math.PI / 6, mA = -Math.PI / 2 + 10 * Math.PI / 30;
    c.lineWidth = 12; c.beginPath(); c.moveTo(150, 150); c.lineTo(150 + Math.cos(hA) * 62, 150 + Math.sin(hA) * 62); c.stroke(); c.lineWidth = 7; c.beginPath(); c.moveTo(150, 150); c.lineTo(150 + Math.cos(mA) * 98, 150 + Math.sin(mA) * 98); c.stroke(); });
  add(new THREE.CircleGeometry(.2, 32), new THREE.MeshLambertMaterial({ map: clk }), 'wall_clock_face', 'sign', V(RW.x, Y1 - .01, 2.3), root, false); add(new THREE.TorusGeometry(.205, .02, 8, 32), steel, 'wall_clock_rim', 'metal', V(RW.x, Y1 - .02, 2.3));
  // bluebonnet print in a frame (left wall), water cooler + cones, ficus, corner CRT TV, coat rack, trash can
  const bb = canvasTex(THREE, 400, 280, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#a8d0f0'); g.addColorStop(.45, '#e8f0f4'); g.addColorStop(.5, '#7a9a5a'); g.addColorStop(1, '#4a7a3a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (let k = 0; k < 900; k++) { const y = h * .5 + Math.random() * h * .5; c.fillStyle = Math.random() < .85 ? '#3a5ad0' : '#f4f4f0'; c.fillRect(Math.random() * w, y, 2 + (y - h * .5) / 40, 3 + (y - h * .5) / 30); } c.fillStyle = '#5a6a4a'; c.fillRect(w * .7, h * .3, 6, h * .22); c.beginPath(); c.ellipse(w * .7 + 3, h * .3, 40, 22, 0, 0, 7); c.fill(); });
  box(.03, 1.0, .72, oak, 'print_frame', 'wood', X0 + .02, -.1, 1.7); const pr = add(new THREE.PlaneGeometry(.9, .62), new THREE.MeshLambertMaterial({ map: bb }), 'bluebonnet_print', 'sign', V(X0 + .04, -.1, 1.7), root, false); pr.rotation.y = Math.PI / 2;
  const WC = [3.6, -2.7]; box(.32, .32, .9, toon('#e8e4da'), 'water_cooler_cabinet', 'plastic', WC[0], WC[1], .45); add(new THREE.CylinderGeometry(.14, .14, .42, 20), new THREE.MeshPhysicalMaterial({ color: '#9ad8f0', transparent: true, opacity: .55, roughness: .05 }), 'water_cooler_bottle', 'glass', V(WC[0], WC[1], 1.13), root, false);
  for (const dy of [-.06, .06]) box(.04, .04, .05, toon(dy < 0 ? '#2a7ab8' : '#e8e4da'), 'cooler_tap', 'plastic', WC[0] - .17, WC[1] + dy, .78); bar([WC[0] - .17, WC[1] - .2, 1.0], [WC[0] - .17, WC[1] - .2, .78], .028, toon('#f4f2ea'), 'cone_cup_dispenser', 'plastic');
  const pot = add(new THREE.CylinderGeometry(.22, .18, .35, 16), M.paint('#b8956a'), 'ficus_wicker_basket', 'wood', V(3.55, 3.75 - 4.5 + 4.2 - .5, .175)); const fx = 3.55, fy = 2.95 - .3;
  pot.position.copy(V(fx, -.9, .175)); bar([fx, -.9, .3], [fx + .05, -.9, 1.5], .02, toon('#6a4a2a'), 'ficus_trunk', 'wood'); for (let k = 0; k < 60; k++) { const lf = add(new THREE.SphereGeometry(.04, 6, 5), [toon('#3a8a3a'), toon('#5aa84a'), toon('#2a6a32')][k % 3], 'ficus_leaf', 'plant', V(fx + rr(-.35, .35), -.9 + rr(-.35, .35), rr(1.0, 1.85))); lf.scale.set(1, .3, .6); lf.rotation.set(rr(0, 3), rr(0, 3), 0); }
  const tvG = new THREE.Group(); tvG.name = 'corner_tv'; root.add(tvG); box(.55, .5, .45, toon('#2e2e34'), 'crt_tv_body', 'plastic', X0 + .45, Y1 - .45, 2.2, tvG); const tvs = box(.02, .4, .3, glow(pl.tv === false ? '#2a3a3a' : '#8ab8d8'), 'crt_tv_screen_glass', 'glass', X0 + .45 + .2, Y1 - .45 - .2, 2.2, tvG, false); tvs.rotation.y = -Math.PI / 4 + Math.PI / 2;
  bar([X0 + .3, Y1 - .3, 1.95], [X0 + .02, Y1 - .02, 1.95], .02, steelDk, 'tv_bracket_arm', 'metal', tvG); box(.3, .3, .03, steelDk, 'tv_bracket_shelf', 'metal', X0 + .4, Y1 - .4, 1.96, tvG);
  bar([3.6, 3.9 - 7.2 + 2.6 - .5, 0], [3.6, -1.6, 1.75], .02, M.paint('#4a3a2a'), 'coat_rack_pole', 'wood'); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; bar([3.6, -1.6, 1.68], [3.6 + Math.cos(a) * .15, -1.6 + Math.sin(a) * .15, 1.78], .01, M.paint('#4a3a2a'), 'coat_rack_hook', 'wood'); }
  root.children.filter(o => o.name === 'coat_rack_pole').forEach(o => { o.position.copy(V(3.6, -1.6, .875)); o.quaternion.identity(); o.scale.set(1, 1.75 / o.geometry.parameters.height, 1); });
  add(new THREE.CylinderGeometry(.16, .13, .4, 16, 1, true), M.paint('#8a9a9a'), 'trash_can', 'metal', V(1.95, -2.2, .2)).material.side = THREE.DoubleSide;

  // ================= AIR: dust in the blind stripes =================
  let dust = null, dustB = []; { const n = 360, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const t = R0() * 3, p = [X1 - .2 - sd[0] * t, rr(WX.y0, WX.y1) - sd[1] * t, rr(WX.z0, WX.z1) - sd[2] * t]; if (p[2] < .1) p[2] = rr(.2, 1.2); dustB.push(p); const v = V(...p); pos.set([v.x, v.y, v.z], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); dust = new THREE.Points(g, new THREE.PointsMaterial({ color: '#fff0c0', size: .01, transparent: true, opacity: .7, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); dust.name = 'dust_motes'; root.add(dust); }
  // ================= ENV v3 (env helper E2, 2026-11-17; place key env_v3: true, default OFF): break the big walls + the ceiling grid, more 1994 waiting-room life =================
  const envT = [];
  if (pl.env_v3) {
    const lab = (w, h, bg, draw) => new THREE.MeshLambertMaterial({ map: canvasTex(THREE, w, h, (c, W, H) => { if (bg) { c.fillStyle = bg; c.fillRect(0, 0, W, H); } draw(c, W, H); }) });
    const txt = (c, s, x, y, px, col = '#1e2a2a', al = 'center') => { c.fillStyle = col; c.font = 'bold ' + px + 'px Arial'; c.textAlign = al; c.textBaseline = 'middle'; c.fillText(s, x, y); };
    const plane = (w, h, mat, nm, x, y, z, rotY = 0, role = 'sign') => { const m = add(new THREE.PlaneGeometry(w, h), mat, nm, role, V(x, y, z), root, false); m.rotation.y = rotY; return m; };
    const onB = (w, h, mat, nm, x, z, d = .012) => plane(w, h, mat, nm, x, Y1 - d, z), onL = (w, h, mat, nm, y, z, d = .012) => plane(w, h, mat, nm, X0 + d, y, z, Math.PI / 2), onRw = (w, h, mat, nm, y, z, d = .012) => plane(w, h, mat, nm, X1 - d, y, z, -Math.PI / 2);
    const plas = c => (M.plasticOf ? M.plasticOf(c) : toon(c));
    // (1) 1990s WALLPAPER BORDER at 2.05-2.2 m on the back, left and right walls (dusty teal + peach geometric), a peach band over the chair rail
    { const bT = canvasTex(THREE, 512, 64, (c, W, H) => { c.fillStyle = '#e8d8c0'; c.fillRect(0, 0, W, H); c.fillStyle = '#2f8a8a'; c.fillRect(0, 0, W, 6); c.fillRect(0, H - 6, W, 6);
        for (let x = 0; x < W; x += 64) { c.fillStyle = '#e8a07a'; c.beginPath(); c.moveTo(x + 8, H - 10); c.lineTo(x + 32, 12); c.lineTo(x + 56, H - 10); c.fill(); c.strokeStyle = '#3a6a9a'; c.lineWidth = 4; c.beginPath(); c.moveTo(x, 32); c.quadraticCurveTo(x + 16, 14, x + 32, 32); c.quadraticCurveTo(x + 48, 50, x + 64, 32); c.stroke(); } });
      const bm = len => { const t = bT.clone(); t.needsUpdate = true; t.wrapS = THREE.RepeatWrapping; t.repeat.set(len / 1.2, 1); return new THREE.MeshLambertMaterial({ map: t }); };
      onB(X1 - X0, .15, bm(X1 - X0), 'env_wallpaper_border_back', 0, 2.12, .009); onL(Y1 - Y0, .15, bm(Y1 - Y0), 'env_wallpaper_border_left', (Y0 + Y1) / 2, 2.12, .009);
      onRw(.2 - Y0, .15, bm(.2 - Y0), 'env_wallpaper_border_r_a', (Y0 + .2) / 2, 2.12, .009); onRw(Y1 - 2.2, .15, bm(Y1 - 2.2), 'env_wallpaper_border_r_b', (2.2 + Y1) / 2, 2.12, .009);
      onB(X1 - X0, .05, M.paint('#e8b090'), 'env_peach_band_back', 0, .99, .009); onL(Y1 - Y0, .05, M.paint('#e8b090'), 'env_peach_band_left', (Y0 + Y1) / 2, .99, .009); }
    // (2) VENDING MACHINE (1990s snack machine) on the back wall between reception and the nurse station: glass front, coil rows of snacks, keypad, coin + bill slots, lit SNACKS header, delivery flap
    { const VX = .78, VY = Y1 - .4, vg = new THREE.Group(); vg.name = 'env_vending_machine'; root.add(vg); const fy = VY - .376;
      box(.86, .75, 1.82, plas('#24466a'), 'vend_cabinet', 'metal', VX, VY, .91, vg); box(.56, .02, 1.12, toon('#e8eef2'), 'vend_back_panel', 'metal', VX - .1, VY - .2, 1.12, vg, false);
      const sn = ['#f2c230', '#f09a2a', '#3a7ad8', '#3aae5a', '#8a5ac8', '#a8703a', '#f4f4f0', '#2aa0a0'];
      for (let r = 0; r < 5; r++) { const z = .66 + r * .21; box(.56, .3, .01, steelDk, 'vend_shelf', 'metal', VX - .1, VY - .1, z - .02, vg, false);
        for (let k = 0; k < 5; k++) { const px = VX - .32 + k * .11; box(.085, .02, .13, toon(sn[(r * 3 + k) % 8]), 'vend_snack_pack', 'paper', px, fy + .12, z + .06, vg, false); box(.06, .004, .03, toon('#f8f8f2'), 'vend_snack_logo', 'paper', px, fy + .108, z + .08, vg, false);
          add(new THREE.TorusGeometry(.03, .003, 4, 10), chrome, 'vend_coil', 'metal', V(px, fy + .16, z + .02), vg, false); box(.05, .004, .018, toon('#f4f4f0'), 'vend_price_tag', 'paper', px, fy + .03, z - .01, vg, false); } }
      box(.6, .012, 1.12, new THREE.MeshPhysicalMaterial({ color: '#e0f0f4', transparent: true, opacity: .2, roughness: .05 }), 'vend_glass_front', 'glass', VX - .1, fy + .008, 1.12, vg, false);
      plane(.8, .16, lab(400, 80, '#2a7ab8', (c, W, H) => { txt(c, 'SNACKS', W / 2, H / 2 + 2, 52, '#f2d24a'); }), 'vend_header_sign', VX, fy - .002, 1.74);
      box(.2, .02, 1.12, plas('#1a3450'), 'vend_control_panel', 'metal', VX + .3, fy + .002, 1.12, vg, false);
      for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) box(.035, .012, .028, toon('#e8e4da'), 'vend_key', 'plastic', VX + .25 + k * .05, fy - .01, 1.28 - r * .045, vg, false);
      box(.12, .01, .05, toon('#0a1a14'), 'vend_display', 'plastic', VX + .3, fy - .01, 1.42, vg, false); box(.05, .012, .02, chrome, 'vend_coin_slot', 'metal', VX + .3, fy - .01, 1.04, vg, false); box(.12, .012, .03, steelDk, 'vend_bill_slot', 'metal', VX + .3, fy - .01, .96, vg, false);
      box(.52, .015, .16, toon('#1a2a3a'), 'vend_delivery_flap', 'plastic', VX - .1, fy - .005, .36, vg, false); box(.14, .012, .1, steelDk, 'vend_coin_return', 'metal', VX + .3, fy - .01, .5, vg, false); }
    // (3) framed TEXAS PRINTS over the nurse station (longhorn at sunset, oil derrick on the coast), a print of the San Jacinto monument on the right wall
    const frame = (x, z, w, h, mat, nm, onWall = onB, y) => { box(w + .06, .025, h + .06, oak, nm + '_frame', 'wood', x, Y1 - .013, z, root, false); return onWall(w, h, mat, nm, x, z, .028); };
    frame(2.05, 1.85, .62, .44, lab(310, 220, null, (c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#f2b44c'); g.addColorStop(.6, '#f4d890'); g.addColorStop(.61, '#a8945a'); g.addColorStop(1, '#6a5a32'); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.fillStyle = '#3a2a1a'; c.beginPath(); c.ellipse(150, 140, 46, 24, 0, 0, 7); c.fill(); c.fillRect(110, 150, 8, 40); c.fillRect(180, 150, 8, 40); c.beginPath(); c.ellipse(205, 124, 16, 12, 0, 0, 7); c.fill(); c.lineWidth = 6; c.strokeStyle = '#e8e0c8'; c.beginPath(); c.moveTo(150, 110); c.quadraticCurveTo(205, 100, 260, 90); c.moveTo(212, 116); c.quadraticCurveTo(170, 96, 150, 92); c.stroke(); txt(c, 'TEXAS', W / 2, 204, 22, '#f4efe0'); }), 'env_print_longhorn');
    frame(3.1, 1.85, .62, .44, lab(310, 220, null, (c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5a8ac8'); g.addColorStop(.55, '#f2c27a'); g.addColorStop(.56, '#3a7a9a'); g.addColorStop(1, '#2a5a7a'); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.strokeStyle = '#1e1e28'; c.lineWidth = 4; c.beginPath(); c.moveTo(120, 124); c.lineTo(150, 30); c.lineTo(180, 124); for (let k = 0; k < 4; k++) { c.moveTo(126 + k * 7, 104 - k * 22); c.lineTo(174 - k * 7, 104 - k * 22); } c.stroke(); txt(c, 'GULF COAST', W / 2, 190, 22, '#f4efe0'); }), 'env_print_derrick');
    { box(.025, .5, .7, oak, 'env_print_sanjac_frame', 'wood', X1 - .013, 2.85, 1.65, root, false); onRw(.44, .64, lab(220, 320, '#f4ead0', (c, W, H) => { c.fillStyle = '#c8d8e8'; c.fillRect(10, 10, W - 20, H - 70); c.fillStyle = '#b8a888'; c.beginPath(); c.moveTo(96, 250); c.lineTo(104, 40); c.lineTo(116, 40); c.lineTo(124, 250); c.fill(); c.fillStyle = '#8a7a5a'; c.beginPath(); c.moveTo(103, 40); c.lineTo(110, 22); c.lineTo(117, 40); c.fill(); txt(c, 'SAN JACINTO', W / 2, 276, 20, '#1e2a5a'); txt(c, '1836', W / 2, 300, 18, '#1e2a5a'); }), 'env_print_sanjacinto', 2.85, 1.65, .028); }
    // (4) CHECK IN lettering on the reception glass + a PLEASE SIGN IN card on the counter
    plane(.8, .15, lab(400, 76, '#f8f6ee', (c, W, H) => { c.fillStyle = '#1d3f8a'; c.fillRect(0, 0, W, 8); c.fillRect(0, H - 8, W, 8); txt(c, 'CHECK IN', W / 2, H / 2 + 2, 50, '#1d3f8a'); }), 'env_check_in_sign', -1.2, Y1 - .07, 1.9);
    { const cd = plane(.2, .1, lab(160, 80, '#fff8e0', (c, W, H) => { txt(c, 'PLEASE', W / 2, 24, 22, '#1e3f8a'); txt(c, 'SIGN IN', W / 2, 56, 24, '#1e3f8a'); }), 'env_sign_in_card', -1.65, Y1 - .28, 1.12); cd.rotation.x = -.35; box(.2, .03, .02, toon('#c8b48a'), 'env_sign_in_card_stand', 'paper', -1.65, Y1 - .26, 1.065); }
    // (5) the corner TV shows a 1994 programme card on its front face (channel 11, 4:00 news, the Houston weather)
    { const tvT = canvasTex(THREE, 256, 192, (c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1d3f8a'); g.addColorStop(1, '#2a6ab8'); c.fillStyle = g; c.fillRect(0, 0, W, H); c.fillStyle = '#f2d24a'; c.fillRect(0, 0, W, 40); txt(c, 'CHANNEL 11', W / 2, 21, 26, '#1d3f8a'); txt(c, '4:00 NEWS', W / 2, 78, 34, '#ffffff'); txt(c, 'HOUSTON  94°', W / 2, 124, 26, '#bfe8ff'); txt(c, 'TUE  JUNE 7  1994', W / 2, 162, 18, '#f2d24a'); for (let y = 0; y < H; y += 3) { c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(0, y, W, 1); } });
      box(.44, .02, .34, toon('#1e1e22'), 'env_tv_front_bezel', 'plastic', X0 + .45, Y1 - .7, 2.2, root, false); plane(.38, .28, new THREE.MeshBasicMaterial({ map: tvT, toneMapped: false, color: pl.tv === false ? '#202424' : '#c8c8c8' }), 'env_tv_programme_card', X0 + .45, Y1 - .712, 2.21, 0, 'lamp');
      for (let k = 0; k < 3; k++) box(.02, .01, .02, toon('#8a8a90'), 'env_tv_knob', 'plastic', X0 + .2 + .05 * k, Y1 - .712, 2.0, root, false); }
    // (6) CHILDREN'S CORNER: crayon drawings taped on the left wall, a toy box with toys, a ball, a teddy (no red crayon)
    { const dr = [(c, W, H) => { c.fillStyle = '#f2c230'; c.beginPath(); c.arc(W - 30, 30, 20, 0, 7); c.fill(); c.strokeStyle = '#3a5ad0'; c.lineWidth = 5; c.strokeRect(40, 70, 70, 60); c.beginPath(); c.moveTo(34, 72); c.lineTo(75, 36); c.lineTo(116, 72); c.stroke(); c.fillStyle = '#3aae5a'; c.fillRect(0, H - 14, W, 14); },
      (c, W, H) => { c.strokeStyle = '#8a5ac8'; c.lineWidth = 5; for (const x of [40, 80, 120]) { c.beginPath(); c.arc(x, 50, 12, 0, 7); c.moveTo(x, 62); c.lineTo(x, 100); c.moveTo(x - 16, 78); c.lineTo(x + 16, 78); c.moveTo(x, 100); c.lineTo(x - 12, 128); c.moveTo(x, 100); c.lineTo(x + 12, 128); c.stroke(); } txt(c, 'MY FAMILY', W / 2, 146, 16, '#2a7ab8'); },
      (c, W, H) => { c.fillStyle = '#3aae5a'; c.beginPath(); c.ellipse(80, 90, 50, 26, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(132, 58, 16, 12, 0, 0, 7); c.fill(); c.fillRect(118, 58, 10, 30); c.fillRect(50, 105, 10, 30); c.fillRect(96, 105, 10, 30); c.fillStyle = '#f09a2a'; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(50 + k * 22, 66); c.lineTo(60 + k * 22, 48); c.lineTo(70 + k * 22, 66); c.fill(); } },
      (c, W, H) => { c.strokeStyle = '#1e2a5a'; c.lineWidth = 5; c.beginPath(); c.arc(80, 40, 16, 0, 7); c.stroke(); c.fillStyle = '#2aa0a0'; c.fillRect(56, 58, 48, 60); c.fillStyle = '#f3dcb4'; c.fillRect(66, 124, 26, 12); c.strokeStyle = '#1e2a5a'; c.lineWidth = 2; c.strokeRect(66, 124, 26, 12); txt(c, 'DR. BOO-BOO', W / 2, 150, 15, '#3a5ad0'); },
      (c, W, H) => { ['#f09a2a', '#f2c230', '#3aae5a', '#3a7ad8', '#8a5ac8'].forEach((col, i) => { c.strokeStyle = col; c.lineWidth = 9; c.beginPath(); c.arc(W / 2, H - 10, 90 - i * 11, Math.PI, 0); c.stroke(); }); txt(c, 'JOSH 6', W / 2, H - 24, 16, '#1e2a5a'); }];
      dr.forEach((d, i) => { const p = onL(.3, .3, lab(160, 160, '#fbfaf4', d), 'env_kid_drawing', -1.95 - i * .34, 1.25 + (i % 2) * .16, .012 + i * .001); p.rotation.z = rr(-.08, .08); for (const s of [-1, 1]) { const tp = onL(.06, .02, new THREE.MeshLambertMaterial({ color: '#f4f0d8', transparent: true, opacity: .8 }), 'env_drawing_tape', -1.95 - i * .34 + s * .12, 1.25 + (i % 2) * .16 + .14, .018 + i * .001); tp.rotation.z = s * .5; } });
      const TB = [-3.72, -2.95]; box(.44, .6, .4, M.desk || oak, 'env_toy_box', 'wood', TB[0], TB[1], .2); box(.46, .62, .03, oak, 'env_toy_box_rim', 'wood', TB[0], TB[1], .41);
      const lid = box(.46, .62, .03, oak, 'env_toy_box_lid', 'wood', TB[0] - .22, TB[1], .62); lid.rotation.z = Math.PI / 2 - .25; lid.position.copy(V(TB[0] - .25, TB[1], .62));
      add(new THREE.SphereGeometry(.09, 14, 10), plas('#3a7ad8'), 'env_toy_ball', 'plastic', V(TB[0] + .05, TB[1] + .12, .48)); add(new THREE.TorusGeometry(.09, .012, 6, 18), plas('#f2c230'), 'env_toy_ball_band', 'plastic', V(TB[0] + .05, TB[1] + .12, .48));
      const bear = new THREE.Group(); bear.name = 'env_teddy_bear'; root.add(bear); const bm = toon('#a8703a'); add(new THREE.SphereGeometry(.08, 12, 10), bm, 'teddy_body', 'cloth', V(TB[0] + .02, TB[1] - .16, .47), bear); add(new THREE.SphereGeometry(.06, 12, 10), bm, 'teddy_head', 'cloth', V(TB[0] + .02, TB[1] - .17, .59), bear);
      for (const s of [-1, 1]) add(new THREE.SphereGeometry(.025, 8, 6), bm, 'teddy_ear', 'cloth', V(TB[0] + .02, TB[1] - .17 + s * .05, .645), bear); add(new THREE.SphereGeometry(.022, 8, 6), toon('#e8d0a8'), 'teddy_muzzle', 'cloth', V(TB[0] + .07, TB[1] - .17, .58), bear);
      box(.04, .2, .03, plas('#2fae5a'), 'env_toy_plane_body', 'plastic', TB[0] - .08, TB[1] + .05, .5); box(.2, .04, .01, plas('#2fae5a'), 'env_toy_plane_wing', 'plastic', TB[0] - .08, TB[1] + .07, .51);
      add(new THREE.SphereGeometry(.1, 14, 10), plas('#f09a2a'), 'env_floor_ball', 'plastic', V(-2.1, -2.75, .1)); }
    // (7) PLANTS: a tall dracaena in a basket under the TV, a pothos on the reception counter, a peace lily by the vending machine (leaves tremble in the vent air)
    { const lm = [toon('#3f8a3a'), toon('#5aa848'), toon('#2f6a32'), toon('#7ab84a')], lv = [];
      const plant = (x, y, z, n, h, sc, nm, pot = '#b8956a') => { add(new THREE.CylinderGeometry(.16 * sc, .12 * sc, .3 * sc, 16), M.paint(pot), nm + '_pot', 'wood', V(x, y, z + .15 * sc));
        for (let s = 0; s < n; s++) { const a = s * 2.4, top = [x + Math.cos(a) * .12 * sc, y + Math.sin(a) * .12 * sc, z + h * (.6 + .4 * ((s * 7) % 5) / 5)]; bar([x, y, z + .28 * sc], top, .008 * sc + .004, toon('#6a5a3a'), nm + '_stem', 'plant');
          for (let k = 0; k < 6; k++) { const b = k / 6 * Math.PI * 2, lf = add(new THREE.SphereGeometry(.09 * sc, 8, 6), lm[(s + k) % 4], nm + '_leaf', 'plant', V(top[0] + Math.cos(b) * .08 * sc, top[1] + Math.sin(b) * .08 * sc, top[2] - .03)); lf.scale.set(1.4, .2, .35); lf.rotation.set(rr(-.5, .5), -b, rr(-.4, .4)); lv.push({ lf, r: lf.rotation.x, ph: rr(0, 6) }); } } };
      plant(-3.6, 3.1, 0, 7, 1.55, 1.2, 'env_dracaena'); plant(-.45, Y1 - .22, 1.06, 4, .35, .55, 'env_counter_pothos', '#e8e4da'); plant(.18, Y1 - .3, 0, 5, .85, .9, 'env_peace_lily', '#2f6f96');
      envT.push(t => lv.forEach(o => { o.lf.rotation.x = o.r + .045 * Math.sin(t * 1.4 + o.ph); })); }
    // (8) COATS + BAGS on the chairs (denim jacket, beige raincoat, teal windbreaker over the backs; a purse, a tote, a folded newspaper, a foam cup under a seat)
    { const loc = k => { const p = chairs[k]; return p ? [p[0] - O[0], p[1] - O[1], p[2] - O[2]] : null; };
      const coat = (k, back, col, nm) => { const p = loc(k); if (!p) return; const by = p[1] + back * .2; box(.42, .05, .42, toon(col), nm, 'cloth', p[0], by + back * .03, .62, root, true); const roll = add(new THREE.CylinderGeometry(.04, .04, .44, 10), toon(col), nm + '_collar_roll', 'cloth', V(p[0], by, .84)); roll.rotation.z = Math.PI / 2;
        for (const s of [-1, 1]) { const sl = box(.1, .05, .36, toon(col), nm + '_sleeve', 'cloth', p[0] + s * .16, by + back * .06, .58, root, true); sl.rotation.y = s * .12; } box(.42, .052, .012, toon('#2a2a30'), nm + '_hem_seam', 'cloth', p[0], by + back * .03, .42, root, false); };
      coat('chair_d_0', -1, '#3a5a8a', 'env_coat_denim'); coat('chair_b_2', -1, '#c8b48a', 'env_coat_raincoat'); coat('chair_c_2', 1, '#2a8a8a', 'env_coat_windbreaker');
      const pc = loc('chair_c_0'); if (pc) { box(.26, .1, .18, toon('#6a4a8a'), 'env_purse', 'leather', pc[0], pc[1], .54); const hd = add(new THREE.TorusGeometry(.08, .008, 6, 16, Math.PI), toon('#4a3060'), 'env_purse_handle', 'leather', V(pc[0], pc[1], .63)); }
      const pa = loc('chair_a_3'); if (pa) { const np = box(.28, .2, .012, toon('#e8e4d8'), 'env_newspaper', 'paper', pa[0], pa[1], .47); np.rotation.y = .25; const hl = plane(.24, .06, lab(160, 40, '#e8e4d8', (c, W, H) => txt(c, 'HOUSTON POST', W / 2, H / 2, 20, '#1e1e22')), 'env_newspaper_head', pa[0], pa[1], .478); hl.rotation.set(-Math.PI / 2, 0, .25); }
      const pd = loc('chair_d_2'); if (pd) { box(.3, .14, .32, toon('#2f7a5a'), 'env_tote_bag', 'cloth', pd[0] + .35, pd[1] + .1, .16); bar([pd[0] + .23, pd[1] + .1, .32], [pd[0] + .47, pd[1] + .1, .32], .01, toon('#245a44'), 'env_tote_strap', 'cloth'); }
      const pb = loc('chair_b_0'); if (pb) add(new THREE.CylinderGeometry(.04, .03, .1, 12), toon('#f8f6ee'), 'env_foam_cup', 'plastic', V(pb[0] + .1, pb[1] + .1, .05)); }
    // (9) magazine covers with titles on the existing left-wall rack
    { const mt = [['TEXAS', '#2a7ab8'], ['GOLF', '#3aae5a'], ['PARENTS', '#f2c230'], ['AUTO 94', '#8a5ac8'], ['HOME', '#2aa0a0'], ['FISHING', '#f09a2a']];
      for (let k = 0; k < 3; k++) for (let q = 0; q < 2; q++) { const [t, col] = mt[k * 2 + q]; onL(.19, .25, lab(96, 128, '#f8f6ee', (c, W, H) => { c.fillStyle = col; c.fillRect(0, 0, W, 34); txt(c, t, W / 2, 18, t.length > 5 ? 14 : 20, '#fff'); c.fillStyle = col; c.globalAlpha = .45; c.fillRect(14, 46, W - 28, 60); c.globalAlpha = 1; }), 'env_magazine_cover', -1.45 + q * .3, 1.02 + k * .35, .075); } }
    // (10) CEILING DETAIL (not more grid): a drywall soffit along the back wall with recessed downlights, two square supply diffusers with a paper streamer, a water-stained tile, a speaker, a smoke detector, a hanging EXIT sign
    { box(X1 - X0, .36, .22, wallP, 'env_soffit', 'wall', 0, Y1 - .18, CEIL - .11, root, false); box(X1 - X0, .012, .04, M.paint('#2f8a8a'), 'env_soffit_trim', 'wall', 0, Y1 - .365, CEIL - .2, root, false);
      for (const x of [-3.0, -.2, 1.6, 3.3]) { const d = add(new THREE.CircleGeometry(.07, 20), toon('#fff2d0'), 'env_downlight', 'plastic', V(x, Y1 - .18, CEIL - .222), root, false); d.rotation.x = Math.PI / 2; add(new THREE.TorusGeometry(.075, .01, 6, 20), chrome, 'env_downlight_trim', 'metal', V(x, Y1 - .18, CEIL - .222), root, false).rotation.x = Math.PI / 2; }
      const dfT = canvasTex(THREE, 128, 128, (c, W, H) => { c.fillStyle = '#e8e4da'; c.fillRect(0, 0, W, H); c.strokeStyle = '#a8a498'; c.lineWidth = 5; for (let k = 0; k < 4; k++) c.strokeRect(10 + k * 13, 10 + k * 13, W - 20 - k * 26, H - 20 - k * 26); c.fillStyle = '#8a867c'; c.fillRect(56, 56, 16, 16); });
      for (const [x, y] of [[-.6, -2.4], [2.4, -2.4]]) { const d = add(new THREE.PlaneGeometry(.58, .58), new THREE.MeshLambertMaterial({ map: dfT }), 'env_supply_diffuser', 'metal', V(x, y, CEIL - .012), root, false); d.rotation.x = Math.PI / 2;
        const st = add(new THREE.PlaneGeometry(.02, .22), new THREE.MeshLambertMaterial({ color: '#f4f0e0', side: THREE.DoubleSide }), 'env_vent_streamer', 'paper', V(x + .2, y, CEIL - .13), root, false); envT.push(t => { st.rotation.x = .5 + .35 * Math.sin(t * 5.3 + x); st.rotation.y = .3 * Math.sin(t * 3.1 + y); }); }
      const stT = canvasTex(THREE, 128, 128, (c, W, H) => { c.fillStyle = 'rgba(0,0,0,0)'; c.clearRect(0, 0, W, H); for (let k = 0; k < 3; k++) { c.strokeStyle = 'rgba(150,110,60,' + (.35 - k * .1) + ')'; c.lineWidth = 6; c.beginPath(); c.ellipse(64, 64, 50 - k * 12, 40 - k * 9, .3, 0, 7); c.stroke(); } c.fillStyle = 'rgba(170,130,80,.18)'; c.beginPath(); c.ellipse(64, 64, 46, 36, .3, 0, 7); c.fill(); });
      const sn = add(new THREE.PlaneGeometry(.5, .5), new THREE.MeshLambertMaterial({ map: stT, transparent: true, depthWrite: false }), 'env_ceiling_water_stain', 'mark', V(-3.0, -.9, CEIL - .013), root, false); sn.rotation.x = Math.PI / 2;
      add(new THREE.CylinderGeometry(.12, .12, .015, 20), toon('#e8e4da'), 'env_ceiling_speaker', 'plastic', V(1.5, .3, CEIL - .01), root, false); for (let k = 0; k < 4; k++) add(new THREE.TorusGeometry(.03 + k * .022, .004, 4, 20), toon('#a8a498'), 'env_speaker_ring', 'plastic', V(1.5, .3, CEIL - .02), root, false).rotation.x = Math.PI / 2;
      add(new THREE.CylinderGeometry(.06, .065, .03, 16), toon('#efece4'), 'env_smoke_detector', 'plastic', V(-1.0, -1.5, CEIL - .02));
      const ex = canvasTex(THREE, 192, 80, (c, W, H) => { c.fillStyle = '#f4f4ee'; c.fillRect(0, 0, W, H); txt(c, 'EXIT', W / 2, H / 2 + 2, 56, '#1f9a4a'); c.fillStyle = '#1f9a4a'; c.beginPath(); c.moveTo(170, 40); c.lineTo(156, 28); c.lineTo(156, 52); c.fill(); });
      const eg = new THREE.Group(); eg.name = 'env_exit_sign'; root.add(eg); box(.4, .07, .18, toon('#f4f4ee'), 'env_exit_box', 'plastic', 3.2, -1.0, CEIL - .3, eg, false); for (const s of [-1, 1]) { const f = add(new THREE.PlaneGeometry(.36, .15), new THREE.MeshLambertMaterial({ map: ex }), 'env_exit_face', 'sign', V(3.2, -1.0 + s * .037, CEIL - .3), eg, false); if (s > 0) f.rotation.y = Math.PI; } bar([3.2, -1.0, CEIL - .21], [3.2, -1.0, CEIL], .012, steelDk, 'env_exit_stem', 'metal', eg); }
    // (10b) the T-bar grid toned down to the tile colour (grid lines read softer; the ceiling share is carried by the soffit, diffusers and lights, not by grid contrast)
    { const tb = toon('#d4cdbd'); root.traverse(o => { if (o.isMesh && o.name === 'ceiling_tbar') o.material = tb; }); }
    // (11) SECOND LIGHT COLOUR: a cool fluorescent fill from the troffers (vs the warm window sun + table lamps)
    { const c1 = new THREE.PointLight('#b8d4ff', .9, 8, 1.2); c1.position.copy(V(-.6, -.6, CEIL - .4)); c1.name = 'env_cool_fluor_fill'; root.add(c1); const c2 = new THREE.PointLight('#a8d8e8', .5, 6, 1.2); c2.position.copy(V(-3.2, 2.6, 1.6)); c2.name = 'env_cool_corner_fill'; root.add(c2); }
  }
  for (const nm of pl.hide || []) root.traverse(o => { if (o.name === nm) o.visible = false; });

  const boySeat = chairs.chair_a_0, anchors = { ...chairs, boy_seat: boySeat, boy_knee: [boySeat[0], boySeat[1] - .38, SEAT + .1], nurse_kneel: [boySeat[0] - .45, boySeat[1] - .55, 0], boy_run_out: A(2.4, -1.2, 0),
    fish_tank: A(FT.x + FT.d / 2, FT.y, FT.z0 + FT.h / 2), stare_fish: A(FT.x + .08, FT.y - .1, FT.z0 + .3), reception_window: A(RW.x, Y1, 1.55), nurse_station: A(NS.x, NS.y - .6, 0), clock: A(RW.x, Y1, 2.3), lamps: lamps.map(p => [...p]) };
  lamps.forEach((p, k) => anchors['lamp_' + k] = p);
  const update = (f, t) => { LP.sync(M); const tt = t ?? f / 30, stare = keyed(pl.fish_stare_at, f, pl.fish_stare ?? 0);
    fishes.forEach((F, i) => { const s = i === 0 ? 1 - stare : 1, ph = tt * (.4 + i * .07) + i * 2; F.g.position.copy(V(F.x + Math.sin(ph) * .05 * s, F.y + Math.sin(ph * .7) * .3 * s, F.z + Math.sin(ph * 1.3) * .03));
      F.g.rotation.y = i === 0 ? (1 - stare) * (Math.cos(ph * .7) > 0 ? -Math.PI / 2 : Math.PI / 2) + stare * 0 : (Math.cos(ph * .7) > 0 ? -Math.PI / 2 : Math.PI / 2); F.tail.rotation.y = Math.sin(tt * 9 + i) * .4; });
    bubbles.forEach(B => { const u = (tt * .35 + B.ph) % 1; B.b.position.copy(V(FT.x - .05 + B.dx + Math.sin(u * 20 + B.ph * 9) * .006, FT.y + .05 + B.dx, FT.z0 + .14 + u * (FT.h - .2))); });
    if (dust) { const P = dust.geometry.attributes.position; for (let i = 0; i < dustB.length; i++) { const b = dustB[i], v = V(b[0] + Math.sin(tt * .3 + i) * .04, b[1] + Math.cos(tt * .25 + i) * .04, b[2] + Math.sin(tt * .2 + i * .7) * .05); P.setXYZ(i, v.x, v.y, v.z); } P.needsUpdate = true; } };
  const fxS5 = await s5fx(THREE, scene, ctx, pl);
  update(0, 0);
  return { update: (f, t, R) => { update(f, t); for (const fn of envT) fn(t ?? f / 30); fxS5.update(f, t, R); }, anchors, stations: STATIONS };
}

// ================= S5 OVERLAYS (see S5 BUILDER KEYS at the top) =================
const kf = (k, f) => { let v = null; for (const e of k || []) if (f >= e[0]) v = e; return v; };
const hsh = (i, s) => { const v = Math.sin((i + 1) * 12.9898 + (s + 1) * 78.233) * 43758.5453; return v - Math.floor(v); };
async function s5fx(THREE, scene, ctx, pl) {
  const V = p => ctx.B2T(p), U = [], RR = { camera: null }, tex = (w, h, d) => canvasTex(THREE, w, h, d);
  const camQuad = (mat, ro) => { const q = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat); q.renderOrder = ro; q.frustumCulled = false; q.visible = false; scene.add(q); return q; };
  const fitQuad = (q, d) => { const cam = RR.camera; if (!cam) return false; cam.updateMatrixWorld(true); const hh = 2 * d * Math.tan((cam.fov || 60) * Math.PI / 360) * 1.25;
    q.position.copy(cam.getWorldPosition(new THREE.Vector3())).add(cam.getWorldDirection(new THREE.Vector3()).multiplyScalar(d)); q.quaternion.copy(cam.getWorldQuaternion(new THREE.Quaternion())); q.scale.set(hh * Math.max(1, cam.aspect || 1) * 1.3, hh, 1); return true; };
  if (pl.hide_pre) scene.traverse(o => { if (pl.hide_pre.some(p => (o.name || '').startsWith(p))) o.visible = false; });
  for (const g of pl.glow || []) { const L = new THREE.PointLight(g.color || '#ffb070', g.i ?? 3, g.dist ?? 6, 1.6); L.position.copy(V(g.at)); L.name = 's5_glow'; scene.add(L); }
  for (const pw of pl.power || []) { try { const mod = await import('./power/' + pw.kind + '.mjs'), mk = mod['make' + pw.kind.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join('')];
    const o = mk(THREE, scene, V(pw.at), { ...(pw.opts || {}), camera: () => RR.camera }); U.push(f => o.update((f - pw.f) / 30)); } catch (e) { console.warn('waiting.js s5 power ' + pw.kind, e && e.message); } }
  if (pl.impact && pl.impact.length) { const q = camQuad(new THREE.MeshBasicMaterial({ color: '#ffffff', blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: pl.impact_warm ? THREE.ZeroFactor : THREE.OneMinusDstColorFactor, blendDst: pl.impact_warm ? THREE.SrcColorFactor : THREE.ZeroFactor, depthTest: false, depthWrite: false, fog: false, toneMapped: false }), 9999); q.name = 's5_impact_frame';
    U.push(f => { const k = pl.impact.find(([g]) => Math.round(f) === g); q.visible = !!k && fitQuad(q, .12); if (q.visible) q.material.color.set(k[1] || '#ffffff'); }); }
  if (pl.dim) { const DM = pl.dim, q = camQuad(new THREE.MeshBasicMaterial({ color: DM.color || '#000000', transparent: true, opacity: DM.op ?? .2, depthTest: false, depthWrite: false, fog: false, toneMapped: false }), 9990); q.name = 's5_dim';
    U.push(f => { const k = DM.ramp ? Math.min(1, Math.max(0, (f - DM.f0) / DM.ramp)) : 1, e = k * k * (3 - 2 * k); q.material.opacity = (DM.op ?? .2) * e; q.visible = f >= DM.f0 && f <= DM.f1 && e > .002 && fitQuad(q, .15); }); }   // R2: ramp = frames of fade-in (no one-frame switch-on)   // 2004 office letter close-up: scene-level dark veil (before the bloom) so the black ink reads
  if (pl.fade && pl.fade.length) { const q = camQuad(new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 1, depthTest: false, depthWrite: false, fog: false, toneMapped: false }), 9995); q.name = 's5_fade';
    U.push(f => { let op = 0, K = pl.fade; if (f <= K[0][0]) op = K[0][1]; else if (f >= K[K.length - 1][0]) op = K[K.length - 1][1]; else for (let i = 1; i < K.length; i++) if (f <= K[i][0]) { const u = (f - K[i - 1][0]) / Math.max(1e-6, K[i][0] - K[i - 1][0]), s = u * u * (3 - 2 * u); op = K[i - 1][1] + (K[i][1] - K[i - 1][1]) * s; break; }
      q.visible = op > .002 && fitQuad(q, .13); q.material.opacity = op; }); }   // BUILD-OUT: open from dark (S4's lid) = a keyed black veil
  for (const RC of pl.recolor || []) scene.traverse(o => { if (o.isMesh && RC.match.some(p => (o.name || '').startsWith(p)) && o.material && o.material.color) { o.material = o.material.clone(); o.material.color.set(RC.color); } });   // BUILD-OUT: recolour named set meshes (r50 landing edge)
  const gT = tex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const sT = tex(256, 64, (c, w, h) => { const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, h / 2 - 2, w, 4);
    const r = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, h / 2); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = r; c.fillRect(w / 2 - h / 2, 0, h, h); });
  const spr = (map, col, ro = 30) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map, color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })); s.renderOrder = ro; s.visible = false; scene.add(s); return s; };
  // ROW 40: warm gold aura ON TWOS, spreading from the plaster (pts[0]) over his whole body
  if (pl.aura) { const A = pl.aura, P = A.pts, S = [...Array(P.length * 3)].map(() => spr(gT, A.color || '#ffc860', 32));
    U.push(f => { const on = f >= A.f0 && f <= A.f1, f2 = f - (f % 2), k = Math.min(1, Math.max(0, (f2 - A.f0) / (A.grow || 10)));
      S.forEach((s, i) => { const j = Math.floor(i / 3), reach = j / Math.max(1, P.length - 1); s.visible = on && k >= reach * .9; if (!s.visible) return;
        const p = P[j], jx = (hsh(i, f2) - .5) * .08, jz = (hsh(i + 7, f2) - .5) * .08, sz = (A.size || .5) * (.75 + .5 * hsh(i + 3, f2)) * Math.min(1, (k - reach * .9) * 4 + .3);
        s.position.copy(V([p[0] + jx, p[1] - .05, p[2] + jz])); s.scale.set(sz, sz, 1); s.material.opacity = (A.op || .5) * (.7 + .3 * hsh(i + 11, f2)); }); }); }
  for (const SP of pl.sparkle || []) { const S = [...Array(SP.n || 24)].map(() => spr(sT, SP.color || '#fff0c0', 34)), c = SP.at, r = SP.r || .6;
    const pos = S.map((_, i) => { const a = hsh(i, 1) * 6.283, b = (hsh(i, 2) - .5) * 2.4, d = r * (.35 + .65 * hsh(i, 3)); return [c[0] + Math.cos(a) * Math.cos(b) * d, c[1] + Math.sin(a) * Math.cos(b) * d * .6, c[2] + Math.sin(b) * d * .7]; });
    U.push(f => { const on = f >= SP.f0 && f <= SP.f1, f2 = f - (f % 2); S.forEach((s, i) => { const ph = hsh(i, Math.floor(f2 / 4)); s.visible = on && ph > .35; if (!s.visible) return; const sz = (SP.size || .12) * (.5 + ph); s.position.copy(V(pos[i])); s.scale.set(sz * 2.2, sz * .55, 1); s.material.opacity = Math.min(1, (f - SP.f0 + 1) / 3) * (.6 + .4 * ph); }); }); }
  if (pl.field) { const FD = pl.field, ft = tex(512, 900, (c, w, h) => { const g = c.createRadialGradient(w / 2, h * .45, 20, w / 2, h * .45, h * .7); g.addColorStop(0, FD.color || '#fff2c0'); g.addColorStop(.45, FD.color2 || '#ffb44a'); g.addColorStop(1, FD.color3 || '#c8602a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      for (let i = 0; i < 180; i++) { const x = hsh(i, 5) * w, y = hsh(i, 6) * h, r = 1.5 + 5 * hsh(i, 7), q = c.createRadialGradient(x, y, 0, x, y, r * 3); q.addColorStop(0, 'rgba(255,255,240,.95)'); q.addColorStop(1, 'rgba(255,255,240,0)'); c.fillStyle = q; c.fillRect(x - r * 3, y - r * 3, r * 6, r * 6); } });
    const q = camQuad(new THREE.MeshBasicMaterial({ map: ft, transparent: true, fog: false, toneMapped: false }), -1); q.name = 's5_field';
    U.push(f => { const on = f >= FD.f0 && f <= FD.f1; q.visible = on && fitQuad(q, FD.dist || 2.5); if (q.visible) q.material.opacity = Math.min(1, (f - FD.f0 + 1) / 3) * Math.min(1, (FD.f1 - f + 1) / 4); }); }
  if (pl.props && pl.props.length) ctx.lookPack = ctx.lookPack || LP.pack(THREE, ctx);
  for (const pr of pl.props || []) { try { const o = HP.BUILDERS[pr.b](THREE, ctx, pr.o || {}), p0 = pr.path[0]; HP.place(THREE, scene, ctx, o, p0[1], p0[2] || 0, p0[3]); o.group.name = 's5_' + pr.b;
    U.push(f => { const e = kf(pr.path, f) || p0, nx = pr.path[pr.path.indexOf(e) + 1]; let p = e[1];
      if (nx && pr.glide && f > e[0]) { const u = Math.min(1, (f - e[0]) / (nx[0] - e[0])), s = 1 - (1 - u) * (1 - u) * (1 - u); p = p.map((v, j) => v + (nx[1][j] - v) * s); }
      o.group.position.copy(V(p)); o.group.rotation.y = (e[2] || 0) * Math.PI / 180; if (e[3]) { o.group.rotation.x = e[3][0] || 0; o.group.rotation.z = e[3][2] || 0; } o.group.visible = e[4] !== false;
      for (const [g, fn, v] of pr.set || []) if (f >= g && typeof o[fn] === 'function' && o['_s5' + fn] !== g) { o[fn](v); o['_s5' + fn] = g; } }); } catch (e) { console.warn('waiting.js s5 prop ' + pr.b, e && e.message); } }
  if (pl.sag) { const SG = pl.sag, ms = []; scene.traverse(o => { if (o.isMesh && (o.name || '').startsWith(SG.match)) ms.push([o, o.position.y]); });
    U.push(f => { const d = f - SG.f, n = SG.n || 14, a = d < 0 || d > n ? 0 : (SG.amp || .06) * Math.exp(-d / 4) * Math.cos(d * 1.3); for (const [o, y0] of ms) o.position.y = y0 - a; }); }
  if (pl.blizzard) { const B = pl.blizzard, pT = tex(64, 84, (c, w, h) => { c.fillStyle = '#f8f6ee'; c.fillRect(0, 0, w, h); c.fillStyle = '#5a5a66'; for (let i = 0; i < 7; i++) c.fillRect(8, 12 + i * 9, i % 3 === 2 ? 26 : 46, 2); c.strokeStyle = '#c8c2b0'; c.strokeRect(.5, .5, w - 1, h - 1); });
    const mat = new THREE.MeshLambertMaterial({ map: pT, side: THREE.DoubleSide }), PS = [...Array(B.n || 40)].map(() => { const m = new THREE.Mesh(new THREE.PlaneGeometry(.21, .28), mat); m.name = 's5_paper'; m.visible = false; m.castShadow = true; scene.add(m); return m; });
    U.push(f => { const d = (f - B.f) / 30; PS.forEach((m, i) => { m.visible = d >= 0 && !(B.f1 && f > B.f1); if (!m.visible) return; const fo = Math.min(B.f1 && B.fade ? Math.min(1, Math.max(0, (B.f1 - f) / B.fade + .15)) : 1, B.ramp_in ? Math.min(1, (f - B.f + 1) / B.ramp_in) : 1); m.scale.setScalar(fo * fo * (3 - 2 * fo) + .001); const a = hsh(i, 1) * 6.283, sp = (B.spread || 1.2) * (.3 + hsh(i, 2)), vz = (B.h || 2.3) * (.6 + .5 * hsh(i, 3)) * 2.2, tt = Math.min(d, 3);
      const z = Math.max(.02, B.at[2] + vz * tt - 2.4 * tt * tt * (.5 + .3 * hsh(i, 4))), out = 1 - Math.exp(-tt * 2.5);
      m.position.copy(V([B.at[0] + Math.cos(a) * sp * out, B.at[1] + Math.sin(a) * sp * out * .7, Math.min(z, B.ceil || 3.1)])); m.rotation.set(tt * (2 + 4 * hsh(i, 5)) + i, tt * (1 + 3 * hsh(i, 6)), tt * 3 * (hsh(i, 7) - .5));
      if (B.near && RR.camera) { const k = Math.min(1, Math.max(0, (m.position.distanceTo(RR.camera.position) - .5 * B.near) / (.5 * B.near))); m.scale.multiplyScalar(k * k * (3 - 2 * k) + .001); }
      if (B.clear && RR.camera) { const c = RR.camera.position, q = V(B.clear.at), L = q.clone().sub(c), u = Math.min(1, Math.max(0, m.position.clone().sub(c).dot(L) / L.lengthSq())), dd = m.position.distanceTo(c.clone().add(L.multiplyScalar(u))), k = Math.min(1, Math.max(0, (dd - .5 * (B.clear.r || .35)) / (.5 * (B.clear.r || .35)))); m.scale.multiplyScalar(k * k * (3 - 2 * k) + .001); } }); }); }   // S5 v4 blizzard.clear {at, r}: papers near the lens-to-face line shrink away (the face stays clear)   // S5 v2r3 keys: ramp_in (papers grow in over n f), near (m: a paper nearer the lens shrinks away smoothly, no one-frame lens flash)
  if (pl.pens) { const P = pl.pens, ps = ['#2a4a9a', '#1a1a22', '#2a6a4a', '#d8a020'].map(c => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.007, .007, .15, 8), new THREE.MeshLambertMaterial({ color: c })); m.name = 's5_pen'; m.visible = false; scene.add(m); return m; });
    U.push(f => { const d = (f - P.f) / 30; ps.forEach((m, i) => { m.visible = d >= 0 && d < 1.2; if (!m.visible) return; const z = P.at[2] + .1 + 2.6 * d - 4.9 * d * d; m.position.copy(V([P.at[0] + (i - 1.5) * .36 * d, P.at[1] - .05 * i * d, Math.max(P.at[2], z)])); m.rotation.set(d * (6 + i), 0, d * (4 - i) + i); }); }); }
  for (const D of pl.drops || []) { const bub = D.kind === 'bubble', m = new THREE.Mesh(new THREE.SphereGeometry(bub ? (D.r || .05) : .014, 16, 12), new THREE.MeshPhongMaterial({ color: bub ? '#e8f8ff' : '#9ad8ff', transparent: true, opacity: bub ? .5 : .9, shininess: 120, specular: '#ffffff', depthWrite: false }));
    m.name = 's5_' + D.kind; m.visible = false; m.renderOrder = 36; scene.add(m); const ring = spr(sT, '#ffffff', 37);
    U.push(f => { const on = f >= D.f0 && f <= D.f1 && !(D.pop && f >= D.pop); m.visible = on; if (on) { m.position.copy(V(D.at)); const g = bub ? Math.min(1, (f - D.f0 + 1) / 4) : 1; m.scale.set(g, bub ? g : 1.5, g); }
      ring.visible = !!(D.pop && f >= D.pop && f < D.pop + 4); if (ring.visible) { const k = (f - D.pop + 1) / 4; ring.position.copy(V(D.at)); ring.scale.set(.3 * k + .1, .3 * k + .1, 1); ring.material.opacity = 1 - k * .7; } }); }
  for (const FS of pl.fist || []) { const g = new THREE.Group(); g.name = 's5_fist'; scene.add(g); const r = FS.r || .04, ink = new THREE.MeshBasicMaterial({ color: '#16161c' });
    const fb = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), ink); fb.scale.set(r * 1.15, r * .95, r); fb.name = 's5_fist_ball'; g.add(fb);
    const up = new THREE.Vector3(...ctx.B2T(FS.up || [0, .35, 1]).toArray()).sub(ctx.B2T([0, 0, 0])).normalize(), L = FS.len || .7;
    const sl = new THREE.Mesh(new THREE.CylinderGeometry(r * .78, r * .95, L, 16), new THREE.MeshLambertMaterial({ color: FS.sleeve || '#86a8cc' })); sl.name = 's5_fist_sleeve';
    sl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up); sl.position.copy(up.clone().multiplyScalar(L / 2 + r * .6)); g.add(sl);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(r * .9, r * .16, 8, 20), new THREE.MeshLambertMaterial({ color: '#5f86b0' })); cuff.quaternion.copy(sl.quaternion).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)); cuff.position.copy(up.clone().multiplyScalar(r * .9)); g.add(cuff);
    let pg = null; if (FS.plaster_until) { const po = HP.buildPlaster(THREE, ctx, { child: !!FS.plaster_child }); pg = po.group; pg.position.copy(ctx.B2T([0, -.005, -r * .9]).sub(ctx.B2T([0, 0, 0]))); pg.rotation.x = -Math.PI / 2; g.add(pg); }
    U.push(f => { const P = FS.path, e = kf(P, f) || P[0], nx = P[P.indexOf(e) + 1]; let p = e[1];
      if (nx && f > e[0]) { const u = Math.min(1, (f - e[0]) / (nx[0] - e[0])), s = u * u * (3 - 2 * u); p = p.map((v, j) => v + (nx[1][j] - v) * s); }
      g.visible = f >= P[0][0] && f <= P[P.length - 1][0]; g.position.copy(V(p)); if (pg) pg.visible = f < FS.plaster_until; }); }
  for (const SH of pl.shoes || []) { const g = new THREE.Group(); g.name = 's5_shoe'; scene.add(g); const sc = SH.s || 1, up = new THREE.MeshLambertMaterial({ color: SH.color || '#3a62b8' }), so = new THREE.MeshLambertMaterial({ color: '#f4f4ee' });
    const u = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), up); u.scale.set(.05 * sc, .042 * sc, .095 * sc); u.position.set(0, .045 * sc, 0); u.name = 's5_shoe_upper'; g.add(u);
    const so1 = new THREE.Mesh(new THREE.BoxGeometry(.085 * sc, .022 * sc, .2 * sc), so); so1.position.set(0, .011 * sc, .01 * sc); so1.name = 's5_shoe_sole'; g.add(so1);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), so); cap.scale.set(.044 * sc, .03 * sc, .04 * sc); cap.position.set(0, .03 * sc, .075 * sc); cap.name = 's5_shoe_cap'; g.add(cap);
    for (let i = 0; i < 3; i++) { const lc = new THREE.Mesh(new THREE.BoxGeometry(.05 * sc, .004 * sc, .008 * sc), so); lc.position.set(0, .085 * sc, (-.01 + i * .02) * sc); lc.name = 's5_shoe_lace'; g.add(lc); }
    g.position.copy(V(SH.at)); g.rotation.y = (SH.yaw || 0) * Math.PI / 180; U.push(f => { g.visible = f >= (SH.f0 ?? -1) && f <= (SH.f1 ?? 1e9); }); }
  // S5 v2 (FIX_BRIEF_v2): drawn cast-style overlays, camera-facing, never a 3D limb.
  //   thought: { f0, f1, at, h }  ROW 40-41: a cartoon THOUGHT BUBBLE (ink cloud + trail circles) showing a line knee with a cream plaster, a big green tick and a smiling sun;
  //     anchored at its trail end (at = just above the dreamer's head), pops in with an overshoot over 6 f; h = height in metres.
  //   stickers: [{ kind: 'plaster'|'scuff', at, f0, f1, w, rot, pop }]  drawn marks on a card's black line leg (ROW 43 the boy's scuff + the cream plaster), lifted toward the lens by .04 m
  //     v2 r2: card: '<who>', px: [x, y] = pinned to that card's plane at its canvas px (CARD 800x1500, ground 1440; the knee joint), lift (m) toward the lens, hidden with the card
  const inkR = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const drawPlaster = (c, x, y, w, h, a) => { c.save(); c.translate(x, y); c.rotate(a); c.lineWidth = Math.max(3, h * .09); c.strokeStyle = '#17171d'; c.fillStyle = '#f3dcb4'; inkR(c, -w / 2, -h / 2, w, h, h * .45); c.fill(); c.stroke();
    c.fillStyle = '#e2b98a'; inkR(c, -w * .17, -h * .36, w * .34, h * .72, h * .16); c.fill(); c.lineWidth = Math.max(2, h * .05); c.stroke(); c.fillStyle = '#c9a073';
    for (const s of [-1, 1]) for (const q of [-.22, .22]) { c.beginPath(); c.arc(s * w * .33, q * h, h * .055, 0, 6.283); c.fill(); } c.restore(); };
  const ST = new THREE.Vector3();
  const faceCam = (s, at, lift) => { const p = V(at); if (RR.camera && lift) { RR.camera.getWorldPosition(ST); p.addScaledVector(ST.sub(p).normalize(), lift); } s.position.copy(p); };
  if (pl.thought) { const TH = pl.thought, W = 640, H = 560, tt = tex(W, H, (c) => {
      c.lineJoin = 'round'; c.lineCap = 'round'; c.strokeStyle = '#17171d'; c.fillStyle = '#ffffff';
      const puffs = [[330, 225, 205, 150], [190, 200, 95, 85], [470, 200, 100, 88], [250, 105, 95, 80], [410, 105, 100, 82], [215, 320, 92, 70], [440, 322, 98, 72], [330, 355, 110, 62]];
      c.lineWidth = 14; for (const [x, y, rx, ry] of puffs) { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 6.283); c.stroke(); }
      for (const [x, y, rx, ry] of puffs) { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 6.283); c.fill(); }
      for (const [x, y, r] of [[118, 440, 30], [70, 500, 19], [36, 540, 11]]) { c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill(); c.lineWidth = 9; c.stroke(); }
      // the smiling sun (top left)
      c.save(); c.translate(225, 150); c.strokeStyle = '#17171d'; c.lineWidth = 7; c.fillStyle = '#ffd23f';
      for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; c.beginPath(); c.moveTo(Math.cos(a) * 58, Math.sin(a) * 58); c.lineTo(Math.cos(a) * 80, Math.sin(a) * 80); c.stroke(); }
      c.beginPath(); c.arc(0, 0, 46, 0, 6.283); c.fill(); c.stroke(); c.fillStyle = '#17171d';
      for (const s of [-1, 1]) { c.beginPath(); c.lineWidth = 6; c.arc(s * 16, -6, 8, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
      c.beginPath(); c.lineWidth = 6; c.arc(0, 8, 22, .25, Math.PI - .25); c.stroke(); c.fillStyle = '#f39aac'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * 30, 14, 9, 5, 0, 0, 6.283); c.fill(); } c.restore();
      // the line knee: thigh + shin as one bold black line, bent at the knee, khaki shorts hem, a shoe; a cream plaster on the knee
      c.save(); c.translate(0, 0); c.strokeStyle = '#17171d'; c.lineWidth = 16;
      c.fillStyle = '#c8b27a'; inkR(c, 250, 228, 92, 62, 14); c.fill(); c.lineWidth = 7; c.stroke();
      c.lineWidth = 15; c.beginPath(); c.moveTo(330, 262); c.quadraticCurveTo(390, 250, 420, 262); c.quadraticCurveTo(430, 320, 412, 380); c.stroke();
      c.fillStyle = '#3a62b8'; c.beginPath(); c.ellipse(430, 392, 34, 17, 0, 0, 6.283); c.fill(); c.lineWidth = 6; c.stroke();
      drawPlaster(c, 418, 268, 76, 34, .75); c.restore();
      // the big green tick (right)
      c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = '#17171d'; c.lineWidth = 46; c.beginPath(); c.moveTo(470, 180); c.lineTo(510, 228); c.lineTo(590, 92); c.stroke();
      c.strokeStyle = '#3fbe5a'; c.lineWidth = 30; c.beginPath(); c.moveTo(470, 180); c.lineTo(510, 228); c.lineTo(590, 92); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 7; c.beginPath(); c.moveTo(516, 206); c.lineTo(574, 112); c.stroke(); c.restore(); });
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tt, transparent: true, depthTest: false, depthWrite: false, fog: false, toneMapped: false })); s.center.set(36 / W, 1 - 540 / H); s.renderOrder = 40; s.visible = false; s.name = 's5_thought'; scene.add(s);
    U.push(f => { s.visible = f >= TH.f0 && f <= TH.f1; if (!s.visible) return; const d = f - TH.f0, u = Math.min(1, d / 6), k = d >= 6 ? 1 : 1 + (1.7 * Math.pow(u - 1, 3) + 2.7 * Math.pow(u - 1, 2)) * .0 + (u < .66 ? u / .66 * 1.14 : 1.14 - (u - .66) / .34 * .14);
      const h = (TH.h || .5) * (1 + Math.sin(f * .21) * .012); faceCam(s, TH.at, .02); s.scale.set(h * W / H * k, h * k, 1); }); }
  // S5 v3 KEY zzz: { head: [x,y,z] plan (top of the sleeper's DRAWN head, lens side), f0, f1, ...addZzz opts }  floating Zs (sets/zzz_fx.js, ISSUES_v2 A3)
  if (pl.zzz) { try { const { addZzz } = await import('./zzz_fx.js'), ZO = pl.zzz, Z = addZzz(THREE, scene, { ...ZO, head: V(ZO.head) }); U.push(f => Z.update(f, RR.camera)); } catch (e) { console.warn('waiting.js s5 zzz', e && e.message); } }
  for (const SK of pl.stickers || []) { const sc = SK.kind === 'scuff', W = 256, H = sc ? 200 : 128, t2 = tex(W, H, (c) => {
      if (sc) { c.fillStyle = 'rgba(214,120,112,.92)'; c.beginPath(); c.ellipse(W / 2, H / 2, W * .36, H * .3, -.2, 0, 6.283); c.fill(); c.fillStyle = 'rgba(176,84,78,.95)'; c.beginPath(); c.ellipse(W / 2 + 6, H / 2 + 2, W * .2, H * .16, -.2, 0, 6.283); c.fill();
        c.strokeStyle = '#8a3a36'; c.lineWidth = 6; c.lineCap = 'round'; for (const q of [-28, -6, 16]) { c.beginPath(); c.moveTo(W / 2 - 44, H / 2 + q - 6); c.lineTo(W / 2 + 40, H / 2 + q - 22); c.stroke(); } }
      else drawPlaster(c, W / 2, H / 2, W * .9, H * .62, 0); });
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t2, transparent: true, depthWrite: false, fog: false, toneMapped: false, rotation: (SK.rot || 0) * Math.PI / 180 })); s.renderOrder = 38; s.visible = false; s.name = 's5_sticker_' + SK.kind; scene.add(s);
    U.push(f => { s.visible = f >= SK.f0 && f <= (SK.f1 ?? 1e9); if (!s.visible) return; const d = f - SK.f0, sq = SK.pop && d < 4 ? [1.35, 1.18, 1.06, 1.0][d] : 1, w = (SK.w || .08) * sq;
      if (SK.card) { const cd = RR.R && RR.R.cards && RR.R.cards[SK.card]; if (!cd || !cd.mesh.visible) { s.visible = false; return; }   // v2 r2: card px on the card's own plane (follows the card)
        cd.mesh.updateMatrixWorld(true); const px = SK.px; s.position.set((px[0] - 400) / 800, (1440 - px[1]) / 1500, 0); cd.mesh.localToWorld(s.position);
        if (RR.camera) { RR.camera.getWorldPosition(ST); s.position.addScaledVector(ST.sub(s.position).normalize(), SK.lift ?? .012); } }
      else faceCam(s, SK.at, SK.lift ?? .04);
      s.scale.set(w, w * H / W / (sq > 1 ? sq * .92 : 1), 1); }); }
  return { update: (f, t, R) => { if (R && R.camera) RR.camera = R.camera; if (R) RR.R = R; for (const u of U) u(f); } };
}


// PLACE SET "office": set C of fake-surgery, the doctors' office / lounge of the mid-1990s Houston hospital (owner: set helper B1, then the S2 builder; S4 + S5 use dresses).
// Plan metres, Z up, Y away from the lens. Built at world.js ORIGIN.office; anchors + camera stations are WORLD plan metres (origin added).
// Room x -2.2..2.2, y -2.5..2.6, CEILING 3.2 (row 19 EXTREME: the 180-card stack sways up to it). Back wall (y 2.6): wood-veneer V-groove panelling + chair rail,
// the LIGHT BOX (charts mount), the WALL CLOCK (row 15->16 flight comes out of its face), the SCOPE CASE shelf, the coat hook with a white coat, a bookcase of binders.
// Left wall (x -2.2): the window with VENETIAN BLINDS (stripes dress: hard sun stripes across the desk and the back wall). Right wall (x 2.2): four OLIVE steel
// lockers (the sticky-note spot on locker 2), the door to the corridor with a wired-glass panel (row 47: the tower rolls away past it).
// Middle: the steel 1990s desk (wood-grain top, pedestal drawers), desk lamp (the amber pool), three wire trays (anchors; hero_props when present), blotter,
// beige desk phone, pen cup, rolodex, swivel chair. Side: the coffee machine on a two-drawer file cabinet, mugs, sugar, creamer.
// PLACE KEYS (film.json places.<name>; all optional; keyframes [[f, v], ...]):
//   dress: 'night' (rows 16-23, NI: deep-blue window, ONE amber desk-lamp pool) | 'stripes' (rows 36-39, AF: low gold sun through the blinds) | 'y2004' (rows 45-47, GR:
//          grey-lilac overcast, weak lamp, beige CRT computer + keyboard + mouse on the desk, a newer calendar, the phone list yellowed)
//   clock: "9:40" | [[f,"9:40"],...]   clock_spin: 0   (as the corridor clock; the flight out of the face lands here)
//   lamp_nohalo: true   S2 v3 (D1): the bulb gets no film.js additive halo sprite (the halo glared the trays white-orange)
//   lamp: 1 (lamp strength; 0 = off)   lamp_duck: 0..1 | [[f,v]] (row 19: the lamp head ducks away from the rising card stack)
//   blinds: 0.55 (slat tilt 0 shut .. 1 open)   blinds_up: 0 (0..1 raised)   sun: 2.6 (stripes sun strength)
//   charts: [.55,.55,.55] | false   stripes dress only: the hero light box with the three pain bars (THE ONE RED); false = X-ray films (night + y2004 always X-ray)
//   trays: true   the three wire trays (hero_props buildWireTray scrape / rinse / trick) at tray_1..3; false = empty desk spots
//   note: 'locker' (default night) | 'none' | 'tray'   the "?" sticky note on locker 2 (row 16) / gone (it moved to tray 3, row 23)
//   scope_case: true   the scope case on its shelf (hero_props buildScopeCase); lid: 0..1 (open amount, settable)
//   door: 0..1 (open; row 47) ; steam: true (coffee machine steam) ; dust: 220 (dust in the stripes / lamp cone)
//   env_v3: true   ENV v3 (E1 2026-11-17, default OFF; all dresses): wallpaper border + crown moulding, high shelf (binders, books, FILMS 1993 box, trophy,
//          trailing pothos), 2 diplomas, bulletin board with X-rays above the lockers, tall filing cabinet + folders + calendar, coat rack + white coat, mini fridge +
//          microwave, lattice rug, desk clutter; lamp capped (D1: trays never blow out), NI cool fill + moon patch + X-ray halo, y2004 open blinds + grey-lilac
//          window glow + cool window key + 30 dust motes (D3). Full list: envV3Office at the end of this file, sets/STATE_env.md
// ANCHORS (world plan metres): desk_top, desk_front, card_stack (row 19 stack spot, front edge centre), tray_1, tray_2, tray_3, note_locker, lamp_head, lamp_pool,
//   light_box (bottom centre of the box, faces the lens), bar_top_1..3 + ruler_rest (stripes, when the hero light box is in), scope_case, scope_case_lid,
//   coffee_cup (desk), coffee_machine, clock, chair, surgeon_sit (behind the desk), surgeon_stand, letter_spot, stamp_spot, pen_cup, door, door_out (fn u 0..1: the corridor
//   path past the door glass, row 47), window, ceiling_z.
// CAMERA STATIONS: export STATIONS (9:16, character height): desk_wide, locker_note, trays, light_box, stack_tall, clock_out, door_2004, blinds.
import { ORIGIN, DADO_Z } from './world.js';
import { kit, surfaces, kf, clockMinutes, noiseCanvas } from './corridor.js';

const O = ORIGIN.office, W = (x, y, z) => [x + O[0], y + O[1], z + O[2]];
export const STATIONS = {
  desk_wide:   { pos: W(.25, -2.25, 1.45), aim: W(0, 1.8, 1.2), lens: 22, note: 'establishing: desk, lamp pool, light box, lockers right, window left' },
  locker_note: { pos: W(.55, -.15, 1.58), aim: W(2.2, .55, 1.5), lens: 30, note: 'row 16-17: hand taps the sticky note on locker 2' },
  trays:       { pos: W(.05, -.55, 1.3), aim: W(0, .8, .82), lens: 30, note: 'rows 20-23: three trays level, lamp warm' },
  light_box:   { pos: W(-.15, .15, 1.5), aim: W(-.3, 2.6, 1.5), lens: 28, note: 'rows 36-37: three charts on the light box, blind stripes' },
  stack_tall:  { pos: W(.45, -2.35, 1.2), aim: W(0, 1.0, 1.85), lens: 20, note: 'row 19 EXTREME: stack from desk to ceiling, lamp ducks' },
  clock_out:   { pos: W(1.05, 2.3, 2.45), aim: W(.1, -1.5, 1.35), lens: 22, note: 'row 15->16 join: out of the wall clock face into the night office' },
  door_2004:   { pos: W(-1.1, -.9, 1.45), aim: W(2.2, -1.45, 1.25), lens: 26, note: 'row 47: through the door glass the tower rolls away' },
  blinds:      { pos: W(.9, -1.2, 1.5), aim: W(-2.2, .4, 1.5), lens: 24, note: 'stripes: the blinds and the sun on the desk' },
};
const canvasTex = (THREE, w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };

export async function build(THREE, scene, film, ctx) {
  const pl = ctx.place || {}, L = ctx.light || {}, dress = pl.dress || 'night', NIGHT = dress === 'night', STR = dress === 'stripes', Y4 = dress === 'y2004';
  const root = new THREE.Group(); root.name = 'office_set'; scene.add(root);
  const { V, add, box, bar, plate } = kit(THREE, ctx, root, O);
  let seed = 41; const R0 = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = (a, b) => a + (b - a) * R0();
  const SF = await surfaces(THREE, ctx), M = SF.M, pick = SF.pick, pb = ctx.pbr, toon = ctx.toon;
  let HP = null; try { HP = await import('./hero_props.js'); } catch (e) { HP = null; }
  const std = (color, rough = .6, metal = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
  const glow = (c, o) => new THREE.MeshBasicMaterial({ color: c, toneMapped: false, ...(o || {}) });
  const steel = M.steel || (pb ? pb.metal('steel', { color: '#c8d0dc', rough: .3, toon: '#c8d0dc' }) : std('#c8d0dc', .3, .8)), steelDk = M.steelDk || std('#8a94a4', .45, .7), chrome = M.chrome || std('#e4eaf2', .15, .9);
  const rubber = std('#26262c', .8), beige = (M.plasticOf && M.plasticOf('#d8ccb0')) || std('#d8ccb0', .5), beigeDk = std('#b8aa8c', .6), white = std('#f6f4ee', .7);

  // ---------- air + light per dress ----------
  scene.children.forEach(o => { if (o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.radius === 400) o.visible = false; });
  scene.background = new THREE.Color(NIGHT ? '#141a3a' : Y4 ? '#5a6078' : '#3a3a6a'); scene.fog = new THREE.Fog(L.veil_color || (NIGHT ? '#2a3a7a' : '#f0d8b0'), ...(pl.fog || [12, 40]));
  scene.children.forEach(o => { if (o.isHemisphereLight) o.groundColor.set(L.shadow_color || (NIGHT ? '#141a3a' : Y4 ? '#2a3048' : '#3a3a6a')); });
  if (SF.LP && SF.LP.applyLight) SF.LP.applyLight(THREE, scene, ctx, { fillFrom: W(3, -5, 4), fog: [12, 40] }); else { const fl = new THREE.DirectionalLight(L.fill_color || (NIGHT ? '#2a3a7a' : Y4 ? '#7a9aa8' : '#8a90c8'), L.fill_i ?? (NIGHT ? .5 : .55)); fl.position.copy(V(3, -5, 4)); fl.target.position.copy(V(0, 1, 1)); root.add(fl, fl.target); }

  // ---------- textures (look_pack first) ----------
  const veneerT = canvasTex(THREE, 512, 512, (c, w, h) => { c.fillStyle = '#8a5a32'; c.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 2) { c.fillStyle = `rgba(${60 + 40 * R0()},${30 + 20 * R0()},10,${.15 + .2 * R0()})`; c.fillRect(x, 0, 1 + R0() * 2, h); }
    for (let i = 0; i < 4; i++) { c.fillStyle = '#4a2a14'; c.fillRect(i * 128, 0, 4, h); c.fillStyle = 'rgba(255,220,170,.15)'; c.fillRect(i * 128 + 4, 0, 2, h); } }, [6, 1]);
  const veneerM = pick(['veneer'], () => std('#ffffff', .45, 0, { map: veneerT }));
  const lockerM = (M.locker && M.locker.isMaterial) ? M.locker : std('#6a7a4a', .42, .3);
  const deskTop = pick(['desk'], () => std('#b8885a', .35));
  const floorM = pick(['carpet'], () => { const t = canvasTex(THREE, 512, 512, (c, w, h) => noiseCanvas(c, w, h, '#5a6470', ['#4a5460', '#6a7480', '#505a68', '#7a8490'], 30000, 1, 3, R0), [8, 8]); return std('#ffffff', .95, 0, { map: t }); });
  const paintM = (M.paint && M.paint(Y4 ? '#d8d2c0' : '#e8dcb8')) || std('#e8dcb8', .85);
  const ceilM = pick(['ceilPanel'], () => std('#efe9da', .95));

  // ---------- shell ----------
  const RX0 = -2.2, RX1 = 2.2, RY0 = -2.5, RY1 = 2.6, CZ = 3.2, WT = .12, PZ = 2.25;   // PZ = top of the veneer panelling
  const floor = add(new THREE.PlaneGeometry(RX1 - RX0 + 2, RY1 - RY0 + 1), floorM, 'office_carpet_tiles', 'floor', V(0, (RY0 + RY1) / 2, 0)); floor.rotation.x = -Math.PI / 2; floor.castShadow = false;
  for (let x = RX0 + .5; x < RX1; x += .5) box(.004, RY1 - RY0, .002, std('#3a4250', .9), 'carpet_tile_seam', 'carpet', x, (RY0 + RY1) / 2, .001, root, false);
  const ceil = add(new THREE.PlaneGeometry(RX1 - RX0, RY1 - RY0), ceilM, 'office_ceiling_tiles', 'ceiling', V(0, (RY0 + RY1) / 2, CZ), root, false); ceil.rotation.x = Math.PI / 2;
  for (let y = RY0 + .6; y < RY1; y += .6) box(RX1 - RX0, .02, .015, std('#f4f2ea', .4, .2), 'ceiling_grid_tee', 'metal', 0, y, CZ - .008, root, false);
  for (let x = RX0 + 1.2; x < RX1; x += 1.2) box(.02, RY1 - RY0, .015, std('#f4f2ea', .4, .2), 'ceiling_grid_main', 'metal', x, (RY0 + RY1) / 2, CZ - .008, root, false);
  // the fluorescent troffer: ON only by day (stripes: off, the sun does it; y2004: on, dim)
  const trT = canvasTex(THREE, 128, 256, (c, w, h) => { c.fillStyle = '#fffbe8'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(190,180,140,.5)'; for (let i = 0; i < w; i += 6) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.stroke(); } for (let j = 0; j < h; j += 6) { c.beginPath(); c.moveTo(0, j); c.lineTo(w, j); c.stroke(); } c.strokeStyle = '#d8d2bc'; c.lineWidth = 10; c.strokeRect(0, 0, w, h); });
  const trOn = Y4; plate(.6, 1.2, trOn ? glow('#e8ecf4', { map: trT }) : std('#d8d4c8', .5, 0, { map: trT }), (pl.troff_nohalo ? 'office_troffer_panel' : 'office_troffer_lens'), 'lamp', .6, .3, CZ - .02, 'z-'); box(.66, 1.26, .04, std('#f0eee6', .35, .3), 'troffer_frame', 'metal', .6, .3, CZ - .01, root, false);
  if (trOn) { const p = new THREE.PointLight('#c8d0e8', 1.6, 6, 1.6); p.position.copy(V(.6, .3, CZ - .3)); root.add(p); }
  // back wall: veneer panelling (V-grooves every 0.4 m, chair rail, top trim), painted above
  const back = (x0, x1, y, face, name) => { const s = face === 'y-' ? -1 : 1, Lw = x1 - x0, cx = (x0 + x1) / 2;
    box(Lw, WT, PZ, veneerM, name + '_veneer', 'wood', cx, y - s * WT / 2, PZ / 2, root, false); box(Lw, WT, CZ - PZ, paintM, name + '_paint', 'wall', cx, y - s * WT / 2, PZ + (CZ - PZ) / 2, root, false);
    for (let x = x0 + .4; x < x1 - .05; x += .4) box(.008, .006, PZ - .12, std('#3a2210', .7), name + '_vgroove', 'wood', x, y + s * .003, PZ / 2 + .02, root, false);
    box(Lw, .035, .06, std('#6a4224', .5), name + '_chair_rail', 'wood', cx, y + s * .018, .92); box(Lw, .04, .07, std('#6a4224', .5), name + '_top_trim', 'wood', cx, y + s * .02, PZ); box(Lw, .03, .1, std('#3a2a1a', .6), name + '_skirting', 'wood', cx, y + s * .015, .05); };
  const side = (x, y0, y1, face, name) => { const s = face === 'x+' ? 1 : -1, Lw = y1 - y0, cy = (y0 + y1) / 2;
    box(WT, Lw, PZ, veneerM, name + '_veneer', 'wood', x - s * WT / 2, cy, PZ / 2, root, false); box(WT, Lw, CZ - PZ, paintM, name + '_paint', 'wall', x - s * WT / 2, cy, PZ + (CZ - PZ) / 2, root, false);
    for (let y = y0 + .4; y < y1 - .05; y += .4) box(.006, .008, PZ - .12, std('#3a2210', .7), name + '_vgroove', 'wood', x + s * .003, y, PZ / 2 + .02, root, false);
    box(.035, Lw, .06, std('#6a4224', .5), name + '_chair_rail', 'wood', x + s * .018, cy, .92); box(.04, Lw, .07, std('#6a4224', .5), name + '_top_trim', 'wood', x + s * .02, cy, PZ); box(.03, Lw, .1, std('#3a2a1a', .6), name + '_skirting', 'wood', x + s * .015, cy, .05); };
  back(RX0, RX1, RY1, 'y-', 'back_wall');
  // the 4th wall (behind the lens, for reverse shots): veneer + a corkboard
  back(RX0, RX1, RY0, 'y+', 'fourth_wall');
  // left wall with the window x -2.2, y -.7..1.5, z .85..2.35
  const WY0 = -.7, WY1 = 1.5, WZ0 = .85, WZ1 = 2.35;
  side(RX0, RY0, WY0, 'x+', 'left_wall_a'); side(RX0, WY1, RY1, 'x+', 'left_wall_b');
  box(WT, WY1 - WY0, WZ0, veneerM, 'window_wall_low', 'wood', RX0 - WT / 2, (WY0 + WY1) / 2, WZ0 / 2, root, false); box(WT, WY1 - WY0, CZ - WZ1, paintM, 'window_wall_head', 'wall', RX0 - WT / 2, (WY0 + WY1) / 2, WZ1 + (CZ - WZ1) / 2, root, false);
  box(.22, WY1 - WY0 + .14, .04, std('#6a4224', .45), 'window_sill', 'wood', RX0 + .1, (WY0 + WY1) / 2, WZ0); box(.05, WY1 - WY0, .05, steel, 'window_frame_low', 'metal', RX0 + .01, (WY0 + WY1) / 2, WZ0 + .03); box(.05, WY1 - WY0, .05, steel, 'window_frame_high', 'metal', RX0 + .01, (WY0 + WY1) / 2, WZ1 - .03);
  for (const y of [WY0, (WY0 + WY1) / 2, WY1]) box(.05, .05, WZ1 - WZ0, steel, 'window_mullion', 'metal', RX0 + .01, y, (WZ0 + WZ1) / 2);
  // outside the window per dress: night deep-blue sky + city lights + a car park lamp; stripes gold sky; y2004 grey-lilac overcast
  const outT = canvasTex(THREE, 512, 384, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h);
    if (NIGHT) { g.addColorStop(0, '#0e1a5a'); g.addColorStop(.7, '#1e3a8a'); g.addColorStop(1, '#3a4a9a'); } else if (Y4) { g.addColorStop(0, '#8a90b8'); g.addColorStop(.7, '#9aa4c8'); g.addColorStop(1, '#b0b4cc'); } else { g.addColorStop(0, '#f8d890'); g.addColorStop(.7, '#ffe8b0'); g.addColorStop(1, '#fff0c8'); }
    c.fillStyle = g; c.fillRect(0, 0, w, h); const bc = NIGHT ? '#0a1236' : Y4 ? '#6a7090' : '#c89a6a';
    for (let i = 0; i < 18; i++) { const bw = 20 + R0() * 40, bh = 40 + R0() * 150, bx = i * 30 + R0() * 10; c.fillStyle = bc; c.fillRect(bx, h - bh, bw, bh); if (NIGHT) for (let k = 0; k < 14; k++) { c.fillStyle = R0() < .5 ? '#ffd890' : '#bfe0ff'; c.fillRect(bx + 3 + R0() * (bw - 6), h - bh + 4 + R0() * (bh - 8), 3, 3); } }
    if (NIGHT) { c.fillStyle = '#ffffff'; for (let i = 0; i < 40; i++) c.fillRect(R0() * w, R0() * h * .5, 1.5, 1.5); c.fillStyle = '#fff2c0'; c.beginPath(); c.arc(w * .8, h * .18, 16, 0, 6.3); c.fill(); }
    if (Y4) { c.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < 9; i++) { c.beginPath(); c.ellipse(R0() * w, R0() * h * .4, 60 + R0() * 60, 14 + R0() * 10, 0, 0, 6.3); c.fill(); } } });
  let lpSky = null; if (!STR && SF.LP && SF.LP.sky) { try { lpSky = SF.LP.sky(THREE, ctx, NIGHT ? 'night' : 'overcast', { w: 6, h: 3.75, at: W(RX0 - 2.5, (WY0 + WY1) / 2, 1.7), yaw: Math.PI / 2, parent: root }); } catch (e) { lpSky = null; } }
  if (!lpSky) plate(WY1 - WY0 + .4, WZ1 - WZ0 + .3, glow('#ffffff', { map: outT }), 'window_outside_' + dress, 'sky', RX0 - .6, (WY0 + WY1) / 2, (WZ0 + WZ1) / 2, 'x+');
  plate(WY1 - WY0, WZ1 - WZ0, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .07, depthWrite: false }), 'window_glass', 'glass', RX0 + .02, (WY0 + WY1) / 2, (WZ0 + WZ1) / 2, 'x+');
  // VENETIAN BLINDS: 1-inch aluminium slats (cast the stripes), head rail, bottom rail, ladder cords, tilt wand, lift cord
  const tilt = Math.max(0, Math.min(1, pl.blinds ?? (STR ? .62 : NIGHT ? .5 : .35))), up = Math.max(0, Math.min(.9, pl.blinds_up ?? 0)), slatM = std(Y4 ? '#d8d4c8' : '#e8e2d0', .45, .2), slats = [];
  const BX = RX0 + .07, BZ1 = WZ1 + .03, BZ0 = WZ0 + (WZ1 - WZ0) * up + .02, SLP = .05, nSl = Math.max(4, Math.round((BZ1 - BZ0) / SLP));
  for (let i = 0; i < nSl; i++) { const s = box(.052, WY1 - WY0 - .04, .003, slatM, 'blind_slat', 'metal', BX, (WY0 + WY1) / 2, BZ1 - .02 - i * SLP); s.rotation.z = 0; slats.push(s); }
  const setTilt = k => { for (const s of slats) s.rotation.z = (1 - k) * 1.35 + .1; }; setTilt(tilt);
  box(.05, WY1 - WY0 + .04, .04, std('#d8d4c8', .4, .3), 'blind_head_rail', 'metal', BX, (WY0 + WY1) / 2, BZ1 + .02); box(.035, WY1 - WY0 - .04, .015, std('#d8d4c8', .4, .3), 'blind_bottom_rail', 'metal', BX, (WY0 + WY1) / 2, BZ0 - .01);
  for (const y of [WY0 + .25, (WY0 + WY1) / 2, WY1 - .25]) for (const dx of [-.013, .013]) bar([BX + dx, y, BZ1], [BX + dx, y, BZ0], .0012, white, 'blind_ladder_cord', 'cloth', root, 3);
  bar([BX + .03, WY1 - .12, BZ1], [BX + .03, WY1 - .12, 1.1], .004, std('#e8e4d8', .3), 'blind_tilt_wand', 'plastic', root, 6); bar([BX + .02, WY0 + .1, BZ1], [BX + .02, WY0 + .1, 1.0], .0018, white, 'blind_lift_cord', 'cloth', root, 3);
  add(new THREE.CylinderGeometry(.01, .01, .04, 8), beige, 'blind_cord_tassel', 'plastic', V(BX + .02, WY0 + .1, .98));
  // the sun through the blinds (stripes dress) / the moonlight (night) / flat overcast (y2004)
  const sun = new THREE.DirectionalLight(STR ? '#ffcf7a' : NIGHT ? '#3a5ab0' : '#c8d0e8', STR ? (pl.sun ?? 2.6) : NIGHT ? .25 : .5);
  sun.position.copy(V(RX0 - 6, -1.6, 3.6)); sun.target.position.copy(V(.2, 2.2, .9)); sun.castShadow = STR; if (STR) { sun.shadow.mapSize.set(4096, 4096); const s = sun.shadow.camera; s.left = -3.5; s.right = 3.5; s.top = 3.5; s.bottom = -3.5; s.near = 1; s.far = 20; sun.shadow.bias = -.0002; sun.shadow.normalBias = 0; }
  root.add(sun, sun.target);
  // S2 FIX 2026-11-16 (stripes): the slat shadow alone never read (the kit sun has no shadow camera at the office origin and floods the room).
  // So the stripes dress gets (1) the kit's own sun + hemisphere cut down so the room falls into warm shade, and (2) a GOBO: a spot light outside the
  // window whose map is the blind (gold bars with dark gaps, cut to the window shape), aimed across the desk + light box. Keys: stripes_i (6),
  // stripes_n (13 bars), stripes_aim [x,y,z] plan metres (default desk/light box), shade_k (.38 kit sun factor). Only dress 'stripes' changes.
  let gobo = null;
  if (STR) { const kSun = pl.shade_k ?? .38;
    scene.children.forEach(o => { if (o.isDirectionalLight && o !== sun) o.intensity *= kSun; if (o.isHemisphereLight) o.intensity *= Math.min(1, kSun + .3); });
    const nB = Math.max(4, Math.round(pl.stripes_n ?? 13)), opn = Math.max(.15, Math.min(.85, .35 + tilt * .4));
    const gT = canvasTex(THREE, 512, 512, (c, w, h) => { c.fillStyle = '#000000'; c.fillRect(0, 0, w, h); const x0 = w * .1, x1 = w * .9, y0 = h * .1, y1 = h * .9, p = (y1 - y0) / nB;
      for (let i = 0; i < nB; i++) { const g = c.createLinearGradient(0, y0 + i * p, 0, y0 + i * p + p * opn); g.addColorStop(0, 'rgba(255,214,140,.0)'); g.addColorStop(.18, '#ffd68c'); g.addColorStop(.82, '#fff0c8'); g.addColorStop(1, 'rgba(255,214,140,.0)'); c.fillStyle = g; c.fillRect(x0, y0 + i * p, x1 - x0, p * opn); }
      for (const xm of [.5]) { c.fillStyle = '#000000'; c.fillRect(w * xm - 4, y0, 8, y1 - y0); } });
    gobo = new THREE.SpotLight('#ffd08a', pl.stripes_i ?? 6, 14, .62, .12, 0); gobo.name = 'blind_stripes_gobo'; gobo.map = gT; gobo.castShadow = true; gobo.shadow.mapSize.set(2048, 2048); gobo.shadow.bias = -.0004; gobo.shadow.camera.near = .5; gobo.shadow.camera.far = 14;
    const ga = pl.stripes_aim || [-.3, 1.8, 1.2]; gobo.position.copy(V(RX0 - 1.8, -2.2, 3.0)); gobo.target.position.copy(V(...ga)); root.add(gobo, gobo.target);
    // the window wall must stop the gobo outside the window (walls cast in this dress only)
    root.traverse(o => { if (o.isMesh && /^(left_wall|window_wall)/.test(o.name)) o.castShadow = true; }); for (const s of slats) s.castShadow = false; }
  // right wall: lockers y -.2..1.9, door y -1.95..-.95
  const DY0 = -1.95, DY1 = -.95, DZ = 2.15;
  side(RX1, RY0, DY0, 'x-', 'right_wall_a'); side(RX1, DY1, RY1, 'x-', 'right_wall_b'); box(WT, DY1 - DY0, CZ - DZ, paintM, 'door_header', 'wall', RX1 + WT / 2, (DY0 + DY1) / 2, DZ + (CZ - DZ) / 2, root, false);
  // the door: hinged at DY1, wired-glass panel, lever, kick plate, closer arm; open by key `door`
  const doorG = new THREE.Group(); doorG.name = 'office_door'; doorG.position.copy(V(RX1 - .02, DY1, 0)); root.add(doorG);
  { const dw = DY1 - DY0 - .02, Pd = (a, b, c) => new THREE.Vector3(a, c, -b), mk = (geo, m, nm, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.copy(Pd(x, y, z)); o.name = nm; o.userData.role = 'wood'; o.castShadow = o.receiveShadow = true; doorG.add(o); return o; };
    const leafM = std('#9a6a40', .5), gz0 = 1.2, gz1 = 1.9, gw = .32; mk(new THREE.BoxGeometry(.045, gz0, dw), leafM, 'door_leaf_veneer_low', 0, -dw / 2, gz0 / 2); mk(new THREE.BoxGeometry(.045, DZ - .02 - gz1, dw), leafM, 'door_leaf_veneer_top', 0, -dw / 2, gz1 + (DZ - .02 - gz1) / 2);
    for (const s of [-1, 1]) mk(new THREE.BoxGeometry(.045, gz1 - gz0, (dw - gw) / 2), leafM, 'door_leaf_veneer_side', 0, -dw / 2 + s * (gw / 2 + (dw - gw) / 4), (gz0 + gz1) / 2);
    const wgT = canvasTex(THREE, 128, 256, (c, w, h) => { c.fillStyle = '#c8d8e0'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(60,70,80,.6)'; c.lineWidth = 1.5; for (let i = -h; i < w + h; i += 14) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i + h, h); c.stroke(); c.beginPath(); c.moveTo(i + h, 0); c.lineTo(i, h); c.stroke(); } });
    const gp = mk(new THREE.PlaneGeometry(.32, .7), new THREE.MeshBasicMaterial({ map: wgT, transparent: true, opacity: .55, depthWrite: false }), 'door_wired_glass', -.026, -dw / 2, 1.55); gp.rotation.y = -Math.PI / 2;
    for (const s of [-1, 1]) { mk(new THREE.BoxGeometry(.06, .025, .36), std('#6a4224', .5), 'door_glass_bead', -.002, -dw / 2, 1.55 + s * .35); mk(new THREE.BoxGeometry(.06, .72, .025), std('#6a4224', .5), 'door_glass_bead', -.002, -dw / 2 + s * .16, 1.55); }
    mk(new THREE.BoxGeometry(.015, .25, dw - .04), steel, 'door_kick_plate', -.026, -dw / 2, .14); const lv = mk(new THREE.CylinderGeometry(.01, .01, .13, 8), chrome, 'door_lever', -.06, -dw + .1, 1.02); lv.rotation.x = Math.PI / 2;
    const plT = canvasTex(THREE, 256, 96, (c, w, h) => { c.fillStyle = '#1d3f8a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.font = 'bold 36px Arial'; c.fillText('PHYSICIANS', 14, 44); c.fillText('LOUNGE', 14, 84); });
    const pq = mk(new THREE.PlaneGeometry(.24, .09), std('#ffffff', .5, 0, { map: plT }), 'door_plaque', -.026, -dw / 2, 1.97); pq.rotation.y = -Math.PI / 2; }
  // the glass panel needs a hole in the leaf: draw the frame on both faces instead (leaf box keeps the panel area opaque except the glass plane in front)
  doorG.rotation.y = -(kf(pl.door, 0, 0) || 0) * 1.4;
  // the corridor stub behind the door (butter wall + dado + terrazzo): what the door glass and the open door show
  { const cM = (M.paint && M.paint('#f3e2a6')) || std('#f3e2a6', .85), tM = (M.dadoTile) || std('#4fa59a', .3), fz = M.terrazzo || std('#d8d0bc', .25);
    const fl2 = add(new THREE.PlaneGeometry(3, 8), fz, 'stub_corridor_terrazzo', 'floor', V(RX1 + 1.5, -1.4, 0)); fl2.rotation.x = -Math.PI / 2; fl2.castShadow = false;
    box(.1, 8, CZ - DADO_Z, cM, 'stub_corridor_wall_upper', 'wall', RX1 + 2.6, -1.4, DADO_Z + (CZ - DADO_Z) / 2, root, false); box(.1, 8, DADO_Z, tM, 'stub_corridor_dado', 'wall', RX1 + 2.6, -1.4, DADO_Z / 2, root, false);
    box(.05, 8, .14, beigeDk, 'stub_bumper_rail', 'plastic', RX1 + 2.53, -1.4, .9); const p = new THREE.PointLight('#fff2c0', NIGHT ? .6 : 1.4, 5, 1.6); p.position.copy(V(RX1 + 1.4, -1.4, 2.6)); root.add(p);
    plate(.6, 1.2, glow(NIGHT ? '#d8d0b0' : '#fffbe8'), 'stub_troffer', 'lamp', RX1 + 1.4, -1.4, CZ - .02, 'z-'); }

  // ---------- OLIVE STEEL LOCKERS (4) on the right wall: louvres, handles, number plates, padlock hasp, base, top; locker 2 = the sticky-note door ----------
  const LKX = RX1 - .03, LK0 = -.35, LKW = .5, LKH = 1.95, lockers = [];
  for (let i = 0; i < 4; i++) { const y = LK0 + i * LKW + LKW / 2, g = new THREE.Group(); g.name = 'locker_' + (i + 1); root.add(g);
    box(.46, LKW, LKH, lockerM, 'locker_body', 'metal', LKX - .23, y, .1 + LKH / 2, g); box(.012, LKW - .03, LKH - .06, lockerM, 'locker_door', 'metal', LKX - .466, y, .1 + LKH / 2, g);
    for (let k = 0; k < 6; k++) box(.01, LKW * .55, .012, std('#3a4428', .6), 'locker_louvre', 'metal', LKX - .476, y, 1.75 + k * .035, g, false); for (let k = 0; k < 6; k++) box(.01, LKW * .55, .012, std('#3a4428', .6), 'locker_louvre', 'metal', LKX - .476, y, .28 + k * .035, g, false);
    box(.03, .03, .16, chrome, 'locker_handle', 'metal', LKX - .485, y - LKW * .3, 1.1, g); box(.02, .04, .05, steelDk, 'locker_hasp', 'metal', LKX - .48, y - LKW * .3, 1.0, g, false);
    const nT = canvasTex(THREE, 96, 64, (c, w, h) => { c.fillStyle = '#e8e4d0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#3a3a30'; c.lineWidth = 3; c.strokeRect(3, 3, w - 6, h - 6); c.fillStyle = '#1a1a1a'; c.font = 'bold 38px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(21 + i), w / 2, h / 2 + 2); });
    plate(.07, .045, std('#ffffff', .5, 0, { map: nT }), 'locker_number_plate', 'sign', LKX - .475, y, 1.6, 'x-', g);
    for (const z of [.35, 1.85]) box(.015, .03, .06, steelDk, 'locker_hinge', 'metal', LKX - .475, y + LKW * .45, z, g, false);
    // wear: a scuff band at shoe height and a dent highlight
    box(.003, LKW * .8, .12, std('#556238', .7), 'locker_scuff', 'metal', LKX - .474, y, .2, g, false); lockers.push(g); }
  box(.48, LKW * 4, .1, std('#3a4428', .6), 'locker_base', 'metal', LKX - .24, LK0 + LKW * 2, .05); box(.48, LKW * 4 + .02, .03, lockerM, 'locker_top', 'metal', LKX - .24, LK0 + LKW * 2, .1 + LKH + .015);
  // on top of the lockers: a boxed X-ray film pack, a rolled poster, a hard hat? (no) -> a cardboard box "FILMS", a bowling trophy, a fan
  box(.4, .3, .22, std('#c8a070', .8), 'locker_top_box', 'paper', LKX - .25, LK0 + .4, 2.2); const fbT = canvasTex(THREE, 128, 64, (c, w, h) => { c.fillStyle = '#c8a070'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a2a2a'; c.font = 'bold 30px Arial'; c.fillText('FILMS', 14, 44); });
  plate(.3, .14, std('#ffffff', .8, 0, { map: fbT }), 'locker_top_box_label', 'paper', LKX - .451, LK0 + .4, 2.2, 'x-');
  add(new THREE.CylinderGeometry(.04, .05, .03, 12), std('#d8a83c', .3, .7), 'trophy_base', 'metal', V(LKX - .25, LK0 + 1.2, 2.13)); add(new THREE.CylinderGeometry(.008, .008, .16, 6), std('#d8a83c', .3, .7), 'trophy_column', 'metal', V(LKX - .25, LK0 + 1.2, 2.22)); add(new THREE.SphereGeometry(.035, 10, 8), std('#d8a83c', .3, .7), 'trophy_bowling_ball', 'metal', V(LKX - .25, LK0 + 1.2, 2.33));
  // the sticky note "?" spot on locker 2 (hero_props buildStickyNote when present; else a small yellow square with the drawn "?")
  const NOTE = [LKX - .48, LK0 + LKW * 1.5, 1.42], noteMode = pl.note || (NIGHT ? 'locker' : 'none'); let noteFrom = 'none';
  if (noteMode === 'locker') { try { if (HP && HP.buildStickyNote) { const n = HP.buildStickyNote(THREE, ctx, { size: .076 }); HP.place(THREE, root, ctx, n, W(...NOTE), -90); noteFrom = 'hero_props'; } } catch (e) { console.warn('office: sticky note ' + e.message); }
    if (noteFrom === 'none') { const nT = canvasTex(THREE, 128, 128, (c, w, h) => { c.fillStyle = '#fff07a'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a22'; c.font = 'bold 96px Arial'; c.textAlign = 'center'; c.fillText('?', 44, 100); c.lineWidth = 5; c.strokeStyle = '#1a1a22'; c.beginPath(); c.arc(96, 58, 18, 0, 6.3); c.stroke(); });
      plate(.076, .076, std('#ffffff', .8, 0, { map: nT }), 'sticky_note_standin', 'paper', NOTE[0] - .003, NOTE[1], NOTE[2], 'x-'); noteFrom = 'stand-in'; } }
  // the coat hook by the door (right wall near the back) -> on the back wall right corner: white coat + a stethoscope? (stethoscope reads modern? 1990s OK), umbrella stand
  { const x = 1.75; box(.3, .04, .05, std('#6a4224', .5), 'coat_hook_board', 'wood', x, RY1 - .04, 1.78); for (const dx of [-.08, .08]) add(new THREE.SphereGeometry(.018, 8, 6), chrome, 'coat_hook_knob', 'metal', V(x + dx, RY1 - .08, 1.78));
    const coat = add(new THREE.PlaneGeometry(.55, 1.05, 10, 10), std('#f4f4f0', .9, 0, { side: THREE.DoubleSide }), 'white_coat_hanging', 'cloth', V(x - .08, RY1 - .12, 1.25)); const cp = coat.geometry.attributes.position; for (let i = 0; i < cp.count; i++) cp.setZ(i, .04 * Math.cos(cp.getX(i) * 12) + .05 * (1 - (cp.getY(i) + .52)));
    coat.geometry.computeVertexNormals(); for (let k = 0; k < 4; k++) add(new THREE.CircleGeometry(.008, 8), std('#c8c8c0', .4), 'coat_button', 'plastic', V(x - .08, RY1 - .19, 1.55 - k * .14), root, false);
    add(new THREE.CylinderGeometry(.13, .11, .5, 16, 1, true), std('#2a4a6a', .5, 0, { side: THREE.DoubleSide }), 'umbrella_stand', 'metal', V(x + .2, RY1 - .25, .25)); bar([x + .2, RY1 - .25, .05], [x + .25, RY1 - .28, .85], .012, std('#1e2a5a', .6), 'umbrella_shaft', 'cloth'); }

  // ---------- back wall: the LIGHT BOX (charts mount), the WALL CLOCK, the scope-case shelf, bookcase, framed knee poster, the calendar ----------
  const LB = [-.35, RY1 - .05, 1.25];   // bottom centre of the light box (face toward the lens)
  let lbFrom = 'own', lbO = null; const charts = STR ? (pl.charts === false ? false : (pl.charts || [.55, .55, .55])) : false;
  if (charts && HP && HP.buildLightBox) { try { lbO = HP.buildLightBox(THREE, ctx, { bars: charts, glow: true }); HP.place(THREE, root, ctx, lbO, W(...LB), 0); lbFrom = 'hero_props'; } catch (e) { console.warn('office: light box ' + e.message); lbO = null; } }
  if (!lbO) { box(.94, .08, .54, steel, 'xray_viewer_case', 'metal', LB[0], LB[1] - .04, LB[2] + .27);
    const xT = canvasTex(THREE, 512, 300, (c, w, h) => { c.fillStyle = '#eef6ff'; c.fillRect(0, 0, w, h); for (const ox of [16, 268]) { c.fillStyle = '#141c26'; c.fillRect(ox, 12, 228, 276); c.fillStyle = 'rgba(220,235,245,.85)';
        c.beginPath(); c.moveTo(ox + 84, 18); c.lineTo(ox + 144, 18); c.lineTo(ox + 140, 120); c.quadraticCurveTo(ox + 166, 150, ox + 144, 158); c.lineTo(ox + 84, 158); c.quadraticCurveTo(ox + 62, 146, ox + 88, 120); c.fill();
        c.beginPath(); c.moveTo(ox + 86, 170); c.lineTo(ox + 146, 170); c.quadraticCurveTo(ox + 154, 190, ox + 138, 200); c.lineTo(ox + 134, 284); c.lineTo(ox + 96, 284); c.lineTo(ox + 92, 200); c.quadraticCurveTo(ox + 76, 190, ox + 86, 170); c.fill();
        c.fillStyle = '#ffe9a0'; c.font = 'bold 22px Arial'; c.fillText(ox < 100 ? 'R' : 'L', ox + 12, 40); } });
    plate(.9, .5, glow(NIGHT ? '#dfe8ff' : '#ffffff', { map: xT }), 'xray_viewer_films', 'lamp', LB[0], LB[1] - .085, LB[2] + .27); box(.05, .02, .012, std('#2a2a2e', .5), 'xray_viewer_switch', 'plastic', LB[0] + .41, LB[1] - .09, LB[2] + .01); }
  { const p = new THREE.PointLight('#dfeeff', NIGHT ? 1.4 : .3, 3.2, 1.6); p.position.copy(V(LB[0], LB[1] - .4, LB[2] + .3)); root.add(p); }
  // wall clock (back wall right of the light box, high): settable + spin blur
  const CK = [1.05, RY1 - .02, 2.45], clockT = canvasTex(THREE, 300, 300, (c, w, h) => { c.fillStyle = Y4 ? '#f2efe4' : '#fbfaf4'; c.beginPath(); c.arc(150, 150, 142, 0, 6.3); c.fill(); c.fillStyle = '#2a1a1f';
    for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30, r1 = i % 5 ? 128 : 118; c.save(); c.translate(150 + Math.cos(a) * r1, 150 + Math.sin(a) * r1); c.rotate(a); c.fillRect(0, -1.5, i % 5 ? 8 : 16, i % 5 ? 3 : 6); c.restore(); }
    c.font = 'bold 34px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; for (let i = 1; i <= 12; i++) { const a = -Math.PI / 2 + i * Math.PI / 6; c.fillText(String(i), 150 + Math.cos(a) * 96, 150 + Math.sin(a) * 96); } });
  plate(.36, .36, std('#ffffff', .4, 0, { map: clockT }), 'wall_clock_face', 'sign', CK[0], CK[1] - .02, CK[2]).geometry = new THREE.CircleGeometry(.18, 36);
  add(new THREE.TorusGeometry(.19, .022, 8, 36), std('#3a2a1a', .5), 'wall_clock_rim_wood', 'wood', V(CK[0], CK[1] - .03, CK[2]), root, false);
  const hand = (len, wd, col, name) => { const g = new THREE.Group(); g.position.copy(V(CK[0], CK[1] - .035, CK[2])); root.add(g); const m = new THREE.Mesh(new THREE.PlaneGeometry(wd, len), new THREE.MeshBasicMaterial({ color: col })); m.position.y = len / 2 - .015; m.name = name; g.add(m); return g; };
  const hH = hand(.1, .016, '#1a1418', 'clock_hour_hand'), hM = hand(.15, .011, '#1a1418', 'clock_minute_hand'), hS = hand(.155, .004, '#2a4a8a', 'clock_second_hand');
  const blurFan = add(new THREE.CircleGeometry(.15, 36), new THREE.MeshBasicMaterial({ color: '#3a3a48', transparent: true, opacity: 0, depthWrite: false }), 'clock_spin_blur', 'fx', V(CK[0], CK[1] - .036, CK[2]), root, false);
  // scope-case shelf (left of the light box): steel brackets, wood shelf, the scope case (hero_props) + a box of gloves + a binder
  const SH = [-1.55, RY1 - .17, 1.42]; box(.7, .28, .03, std('#6a4224', .45), 'scope_shelf_board', 'wood', SH[0], SH[1], SH[2]); for (const dx of [-.28, .28]) { box(.02, .02, .22, steel, 'shelf_bracket_upright', 'metal', SH[0] + dx, RY1 - .04, SH[2] - .1); bar([SH[0] + dx, RY1 - .04, SH[2] - .2], [SH[0] + dx, RY1 - .25, SH[2] - .02], .006, steel, 'shelf_bracket_brace'); }
  let scFrom = 'none', scO = null;
  if (pl.scope_case !== false) { try { if (HP && HP.buildScopeCase) { scO = HP.buildScopeCase(THREE, ctx, { lid: kf(pl.lid, 0, NIGHT ? 0 : 1) }); HP.place(THREE, root, ctx, scO, W(SH[0] + .05, SH[1], SH[2] + .016), 0); scFrom = 'hero_props'; } } catch (e) { console.warn('office: scope case ' + e.message); scO = null; }
    if (!scO) { box(.46, .16, .09, std('#2a2a30', .5), 'scope_case_standin', 'plastic', SH[0] + .05, SH[1], SH[2] + .06); for (const dx of [-.15, .15]) box(.04, .02, .03, chrome, 'scope_case_latch', 'metal', SH[0] + .05 + dx, SH[1] - .085, SH[2] + .07); scFrom = 'stand-in'; } }
  const gloveT = canvasTex(THREE, 128, 64, (c, w, h) => { c.fillStyle = '#f4f4f0'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a6ad0'; c.fillRect(0, 0, w, 16); c.fillStyle = '#1a1a22'; c.font = 'bold 16px Arial'; c.fillText('LATEX GLOVES', 8, 40); c.fillText('MEDIUM', 8, 58); });
  box(.14, .24, .08, [white, white, white, white, std('#ffffff', .7, 0, { map: gloveT }), white], 'glove_box', 'paper', SH[0] - .26, SH[1], SH[2] + .055);
  // bookcase of binders (between shelf and window corner, floor-standing): oak frame, 4 shelves, binders in navy, teal, mustard, grey, cream (no red)
  { const bx = -1.8, by = RY1 - .2, g = new THREE.Group(); g.name = 'binder_bookcase'; root.add(g); const oak = std('#7a4e2a', .5);
    box(.75, .32, .02, oak, 'bookcase_top', 'wood', bx + .05, by, 1.2, g); for (const dx of [-.37, .37]) box(.02, .32, 1.2, oak, 'bookcase_side', 'wood', bx + .05 + dx, by, .6, g);
    for (const z of [.04, .42, .8]) box(.72, .3, .02, oak, 'bookcase_shelf', 'wood', bx + .05, by, z, g);
    const bc = ['#1e2a5a', '#2aa0a0', '#c8a040', '#7a8494', '#e8dcc0', '#3a6a9a', '#6a7a4a', '#4a3a6a'];
    for (const z of [.05, .43, .81]) { let x = bx - .3; while (x < bx + .38) { const t = rr(.04, .075), hgt = rr(.26, .33); const b2 = box(t, .27, hgt, std(bc[Math.floor(R0() * bc.length)], .5), 'binder', 'paper', x + t / 2, by - .01, z + .01 + hgt / 2, g); if (R0() < .15) b2.rotation.y = .12; box(t * .7, .003, .05, white, 'binder_spine_label', 'paper', x + t / 2, by - .146, z + hgt * .7, g, false); x += t + .004; } } }
  // framed knee-anatomy poster (no words but "KNEE") + a framed diploma-style certificate with seal ring in GOLD (no names: wavy lines)
  { const kT = canvasTex(THREE, 256, 340, (c, w, h) => { c.fillStyle = '#f4efe0'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d3f8a'; c.font = 'bold 34px Arial'; c.textAlign = 'center'; c.fillText('THE KNEE', w / 2, 40);
      c.fillStyle = '#e8d0b0'; c.beginPath(); c.moveTo(100, 60); c.lineTo(156, 60); c.lineTo(152, 160); c.quadraticCurveTo(180, 186, 150, 196); c.lineTo(106, 196); c.quadraticCurveTo(76, 186, 104, 160); c.fill(); c.beginPath(); c.moveTo(102, 210); c.lineTo(156, 210); c.lineTo(146, 320); c.lineTo(112, 320); c.fill();
      c.strokeStyle = '#2aa0a0'; c.lineWidth = 3; c.beginPath(); c.moveTo(96, 200); c.lineTo(160, 202); c.stroke(); c.fillStyle = '#c8a8c8'; c.beginPath(); c.ellipse(182, 180, 14, 22, .3, 0, 6.3); c.fill();
      c.strokeStyle = '#3a3a44'; c.lineWidth = 1.5; for (const [x, y] of [[60, 120], [200, 150], [60, 260]]) { c.beginPath(); c.moveTo(x, y); c.lineTo(128, y + 30); c.stroke(); c.fillStyle = '#3a3a44'; c.fillRect(x - 30, y - 4, 26, 3); } });
    box(.44, .03, .58, std('#2a2a30', .4), 'poster_frame', 'plastic', .45, RY1 - .02, 1.65); plate(.4, .53, std('#ffffff', .6, 0, { map: kT }), 'knee_anatomy_poster', 'paper', .45, RY1 - .04, 1.65);
    const dT = canvasTex(THREE, 256, 192, (c, w, h) => { c.fillStyle = '#fbf6e4'; c.fillRect(0, 0, w, h); c.strokeStyle = '#8a6a2a'; c.lineWidth = 6; c.strokeRect(10, 10, w - 20, h - 20); c.strokeStyle = '#3a3a44'; c.lineWidth = 2; for (let i = 0; i < 6; i++) { c.beginPath(); for (let x = 40; x < 216; x += 8) c.lineTo(x, 50 + i * 18 + Math.sin(x * .3) * 2); c.stroke(); }
      c.fillStyle = '#d8a83c'; c.beginPath(); c.arc(200, 150, 20, 0, 6.3); c.fill(); });
    box(.4, .03, .31, std('#6a4224', .4), 'certificate_frame', 'wood', 1.7, RY1 - .02, 2.0); plate(.36, .27, std('#ffffff', .6, 0, { map: dT }), 'certificate', 'paper', 1.7, RY1 - .04, 2.0);
    // the wall calendar (1994, or 2004 in the y2004 dress)
    const yr = Y4 ? '2004' : '1994', mo = STR ? 'MAY' : Y4 ? 'OCTOBER' : 'AUGUST', calT = canvasTex(THREE, 256, 360, (c, w, h) => { c.fillStyle = '#fbf6e8'; c.fillRect(0, 0, w, h); c.fillStyle = Y4 ? '#5a6a8a' : '#2f7d9a'; c.fillRect(0, 0, w, 120);
      c.fillStyle = '#ffffff'; c.font = 'bold 60px Arial'; c.textAlign = 'center'; c.fillText(yr, w / 2, 84); c.fillStyle = '#2a1a1f'; c.font = 'bold 28px Arial'; c.fillText(mo, w / 2, 156); c.font = '16px Arial';
      for (let d = 1; d <= 31; d++) { const col = (d + 2) % 7, row = Math.floor((d + 2) / 7); c.fillText(String(d), 24 + col * 34, 190 + row * 30); } });
    plate(.28, .4, std('#ffffff', .7, 0, { map: calT }), 'wall_calendar_' + yr, 'paper', RX0 + .005, 1.95, 1.7, 'x+', root, true); }

  // ---------- THE DESK (steel 1990s, wood-grain top, two pedestals, modesty panel) + chair ----------
  const DK = { x: 0, y: .85, w: 1.55, d: .78, z: .76 };
  box(DK.w, DK.d, .035, deskTop, 'desk_top', 'wood', DK.x, DK.y, DK.z - .018); box(DK.w + .01, DK.d + .01, .012, steelDk, 'desk_top_edge_band', 'metal', DK.x, DK.y, DK.z - .04, root, false);
  const deskBody = std('#8a8c84', .45, .35);
  for (const s of [-1, 1]) { const px = DK.x + s * (DK.w / 2 - .22); box(.42, DK.d - .04, DK.z - .06, deskBody, 'desk_pedestal', 'metal', px, DK.y, (DK.z - .06) / 2 + .02);
    for (let k = 0; k < 3; k++) { const z = .15 + k * .22; box(.38, .015, .19, std('#9a9c94', .4, .35), 'desk_drawer_front', 'metal', px, DK.y - DK.d / 2 + .01, z + .1); box(.12, .02, .02, chrome, 'desk_drawer_pull', 'metal', px, DK.y - DK.d / 2, z + .15); box(.05, .012, .025, std('#e8e4d0', .5), 'drawer_label_slot', 'paper', px, DK.y - DK.d / 2 - .002, z + .04, root, false); } }
  box(DK.w - .9, .02, .45, deskBody, 'desk_modesty_panel', 'metal', DK.x, DK.y + .2, .5); box(DK.w - .9, DK.d - .1, .02, deskBody, 'desk_center_drawer', 'metal', DK.x, DK.y, DK.z - .1);
  const TOP = DK.z + .002;
  // blotter (green), pen cup with pens + pencils, rolodex, beige desk phone, a stack of charts, paper clips, a stapler, a "KNEE" textbook
  box(.62, .42, .006, std('#3a6a4a', .8), 'desk_blotter', 'leather', -.05, .92, TOP + .003); for (const s of [-1, 1]) box(.05, .42, .008, std('#5a3a1e', .5), 'blotter_corner', 'leather', -.05 + s * .3, .92, TOP + .004, root, false);
  const PC = [.6, 1.05]; add(new THREE.CylinderGeometry(.04, .036, .11, 14, 1, true), std('#2a4a6a', .4, .3, { side: THREE.DoubleSide }), 'pen_cup', 'metal', V(PC[0], PC[1], TOP + .055));
  const pens = []; for (let i = 0; i < 7; i++) { const a = i * .9, c2 = ['#1a1a22', '#2a4cc8', '#f2c230', '#1a1a22', '#2aa04a', '#e8e4d8', '#2a4cc8'][i]; const p = bar([PC[0] + Math.cos(a) * .015, PC[1] + Math.sin(a) * .015, TOP + .02], [PC[0] + Math.cos(a) * .04, PC[1] + Math.sin(a) * .04, TOP + .17], .005, std(c2, .4), 'pen_in_cup', 'plastic', root, 6); pens.push(p); }
  { const g = new THREE.Group(); g.name = 'rolodex'; root.add(g); box(.16, .12, .02, std('#2a2a30', .5), 'rolodex_base', 'plastic', .66, .86, TOP + .01, g); for (let i = 0; i < 18; i++) { const c = box(.13, .002, .08, std(i % 4 ? '#f8f4e8' : '#bfe0f4', .8), 'rolodex_card', 'paper', .66, .81 + i * .006, TOP + .07, g, false); c.rotation.x = (i - 9) * .04; } add(new THREE.TorusGeometry(.045, .006, 6, 16), chrome, 'rolodex_ring', 'metal', V(.66, .86, TOP + .06), g).rotation.y = Math.PI / 2; }
  { const g = new THREE.Group(); g.name = 'desk_phone'; root.add(g); box(.2, .22, .06, beige, 'desk_phone_body', 'plastic', -.66, .88, TOP + .03, g); box(.2, .055, .045, beigeDk, 'desk_phone_handset', 'plastic', -.66, .94, TOP + .08, g); for (let i = 0; i < 12; i++) box(.025, .022, .008, std('#f4f0e4', .4), 'desk_phone_key', 'plastic', -.71 + (i % 3) * .035, .8 + Math.floor(i / 3) * .027, TOP + .063, g, false);
    const pts = []; for (let i = 0; i <= 50; i++) { const u = i / 50; pts.push(V(-.76 - u * .02 + .012 * Math.cos(u * 70), .94 - u * .2, TOP + .06 - u * .05 + .012 * Math.sin(u * 70))); } add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 150, .003, 4), beigeDk, 'desk_phone_coiled_cord', 'plastic', null, g); }
  for (let i = 0; i < 5; i++) box(.24, .31, .012, std(['#e8d4a0', '#d8e8f4', '#e8d4a0', '#f4f0e4', '#e2cc94'][i], .8), 'chart_folder_pile', 'paper', -.15 + rr(-.01, .01), 1.08, TOP + .006 + i * .013, root, false).rotation.y = rr(-.08, .08);
  if (!Y4) box(.15, .04, .05, std('#2a2a30', .4, .3), 'stapler', 'metal', .3, 1.15, TOP + .025); for (let i = 0; i < 8; i++) add(new THREE.TorusGeometry(.007, .0012, 4, 8), chrome, 'paper_clip', 'metal', V(.2 + rr(-.04, .04), 1.18 + rr(-.03, .03), TOP + .002), root, false).rotation.x = Math.PI / 2;
  // DESK LAMP (1990s architect lamp, cream enamel): weighted base, two arm links + springs, the cone head; SpotLight = the amber pool; head ducks on key lamp_duck
  const LBASE = [-.52, 1.08], lampG = new THREE.Group(); lampG.name = 'desk_lamp'; root.add(lampG); const lampM = std('#e8dcc0', .35, .2);
  add(new THREE.CylinderGeometry(.08, .09, .03, 18), lampM, 'lamp_base', 'metal', V(LBASE[0], LBASE[1], TOP + .015), lampG); const arm1 = new THREE.Group(); arm1.position.copy(V(LBASE[0], LBASE[1], TOP + .03)); lampG.add(arm1);
  const lk = (g2, len, nm) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, len, 6), chrome); m.position.y = len / 2; m.name = nm; m.castShadow = true; g2.add(m); const sp = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, len * .7, 6), steelDk); sp.position.set(.015, len / 2, 0); sp.name = nm + '_spring'; g2.add(sp); };
  lk(arm1, .38, 'lamp_arm_lower'); arm1.rotation.x = -.25; const arm2 = new THREE.Group(); arm2.position.y = .38; arm1.add(arm2); lk(arm2, .34, 'lamp_arm_upper'); arm2.rotation.x = 1.25;
  const head = new THREE.Group(); head.position.y = .34; arm2.add(head); const shade = new THREE.Mesh(new THREE.ConeGeometry(.085, .15, 20, 1, true), new THREE.MeshStandardMaterial({ color: '#e8dcc0', roughness: .35, side: THREE.DoubleSide })); shade.name = 'lamp_head_shade'; shade.castShadow = true; shade.position.y = -.04; head.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(.03, 10, 8), glow('#fff0c8')); bulb.name = pl.lamp_nohalo ? 'lamp_bulb_core' : 'lamp_bulb_globe'; bulb.userData.role = 'lamp'; bulb.position.y = -.09; head.add(bulb); head.rotation.x = .2;
  const lampOn = (pl.lamp ?? 1) * (NIGHT ? 1 : Y4 ? .35 : .25), lampL = new THREE.SpotLight('#ffc068', 22 * lampOn, 3.6, .78, .55, 1.4); lampL.castShadow = lampOn > 0; lampL.shadow.mapSize.set(1024, 1024); lampL.shadow.bias = -.0006; head.add(lampL); lampL.position.y = -.08; const lampTgt = new THREE.Object3D(); root.add(lampTgt); lampL.target = lampTgt; lampTgt.position.copy(V(-.2, .85, TOP));
  bulb.visible = lampOn > 0; if (lampOn > 0) { const warm = new THREE.PointLight('#ffc068', 2.2 * lampOn, 4.5, 1.3); warm.position.copy(V(-.45, .75, TOP + .7)); root.add(warm); }
  // CHAIR (navy fabric swivel, 5-star base, casters, gas column)
  const CHP = [0, 1.62]; { const g = new THREE.Group(); g.name = 'desk_chair'; g.position.copy(V(CHP[0], CHP[1], 0)); g.rotation.y = Math.PI + .2; root.add(g); const fab = std('#2a3a6a', .9), Pc = (a, b, c) => new THREE.Vector3(a, c, -b), mk = (geo, m, nm, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.copy(Pc(x, y, z)); o.name = nm; o.userData.role = 'furniture'; o.castShadow = o.receiveShadow = true; g.add(o); return o; };
    mk(new THREE.BoxGeometry(.5, .09, .48), fab, 'chair_seat', 0, 0, .48); mk(new THREE.BoxGeometry(.46, .55, .08), fab, 'chair_back', 0, .26, .85).rotation.x = -.1; mk(new THREE.CylinderGeometry(.025, .025, .3, 10), chrome, 'chair_gas_column', 0, 0, .28);
    for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5, l = mk(new THREE.BoxGeometry(.3, .03, .04), rubber, 'chair_star_leg', Math.cos(a) * .15, Math.sin(a) * .15, .08); l.rotation.y = a; mk(new THREE.SphereGeometry(.028, 8, 6), rubber, 'chair_caster', Math.cos(a) * .3, Math.sin(a) * .3, .03); }
    for (const s of [-1, 1]) { mk(new THREE.BoxGeometry(.04, .05, .24), rubber, 'chair_armrest_pad', s * .27, 0, .66); mk(new THREE.BoxGeometry(.03, .2, .03), rubber, 'chair_arm_post', s * .27, .02, .56); } }
  // y2004: the beige CRT computer + keyboard + mouse + tower; a mouse pad; the CRT glow (pale blue)
  if (Y4) { const g = new THREE.Group(); g.name = 'computer_2004'; root.add(g); const pc = std('#ddd4bc', .45);
    box(.4, .42, .36, pc, 'crt_2004_body', 'plastic', .35, 1.0, TOP + .2, g); box(.3, .3, .28, std('#cfc6ac', .5), 'crt_2004_back', 'plastic', .35, 1.25, TOP + .19, g); box(.24, .2, .03, pc, 'crt_2004_foot', 'plastic', .35, 1.0, TOP + .015, g);
    const sT = canvasTex(THREE, 320, 240, (c, w, h) => { const gg = c.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, '#3a6ab0'); gg.addColorStop(1, '#5a8ac8'); c.fillStyle = gg; c.fillRect(0, 0, w, h); c.fillStyle = '#e8eef8'; c.fillRect(30, 30, 200, 150); c.fillStyle = '#1d3f8a'; c.fillRect(30, 30, 200, 18); c.fillStyle = '#3a3a44'; for (let i = 0; i < 8; i++) c.fillRect(40, 60 + i * 14, 120 + (i * 31) % 60, 4); c.fillStyle = '#c8d0dc'; c.fillRect(0, h - 22, w, 22); });
    plate(.32, .25, glow('#ffffff', { map: sT }), 'crt_2004_screen', 'lamp', .35, .785, TOP + .21, 'y-', g); add(new THREE.SphereGeometry(.006, 6, 4), glow('#7aff8a'), 'crt_2004_led', 'lamp', V(.5, .785, TOP + .05), g, false);
    box(.44, .16, .025, pc, 'keyboard_2004', 'plastic', .1, .62, TOP + .013, g); for (let r = 0; r < 5; r++) for (let k = 0; k < 15; k++) box(.024, .022, .008, std('#efe8d4', .5), 'key_cap', 'plastic', -.07 + k * .026, .57 + r * .026, TOP + .03, g, false);
    box(.2, .18, .003, std('#2a4a6a', .9), 'mouse_pad', 'rubber', .5, .62, TOP + .002, g); const ms = add(new THREE.SphereGeometry(.03, 10, 8), pc, 'mouse_2004', 'plastic', V(.5, .62, TOP + .015), g); ms.scale.set(.8, .5, 1.2);
    const cab = []; for (let i = 0; i <= 10; i++) { const u = i / 10; cab.push(V(.5 - u * .1, .66 + u * .4, TOP + .01 + .03 * Math.sin(u * 3))); } add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cab), 20, .003, 4), pc, 'mouse_cable', 'plastic', null, g);
    box(.2, .45, .42, pc, 'pc_tower_2004', 'plastic', .55, 1.35, .21, g); add(new THREE.SphereGeometry(.008, 6, 4), glow('#7aff8a'), 'pc_tower_led', 'lamp', V(.55, 1.12, .35), g, false); box(.15, .01, .04, std('#2a2a30', .5), 'pc_tower_cd_slot', 'plastic', .55, 1.125, .34, g, false);
    const glw = new THREE.PointLight('#9ab8ff', 1.0, 1.8, 2); glw.position.copy(V(.35, .6, TOP + .25)); root.add(glw); }
  // ---------- the coffee corner: two-drawer file cabinet + the drip COFFEE MACHINE, carafe, mugs, sugar, creamer, stir sticks; a waste bin ----------
  const CF = [1.35, RY1 - .3]; box(.46, .5, .72, std('#8a8c84', .45, .35), 'file_cabinet', 'metal', CF[0], CF[1], .36); for (const z of [.2, .54]) { box(.42, .01, .3, std('#9a9c94', .4, .35), 'file_cabinet_drawer', 'metal', CF[0], CF[1] - .25, z); box(.12, .02, .02, chrome, 'file_drawer_pull', 'metal', CF[0], CF[1] - .26, z + .08); }
  const CT = .72; { const g = new THREE.Group(); g.name = 'coffee_machine'; root.add(g); const cm = std('#2a2a2e', .4), cmB = std('#d8ccb0', .45);
    box(.22, .26, .06, cm, 'coffee_base_plate', 'plastic', CF[0] - .05, CF[1], CT + .03, g); box(.22, .1, .38, cmB, 'coffee_tower', 'plastic', CF[0] - .05, CF[1] + .1, CT + .22, g); box(.22, .26, .08, cmB, 'coffee_head', 'plastic', CF[0] - .05, CF[1], CT + .4, g);
    box(.15, .14, .06, cm, 'coffee_filter_basket', 'plastic', CF[0] - .05, CF[1] - .02, CT + .34, g); add(new THREE.CylinderGeometry(.075, .07, .02, 18), steel, 'coffee_hot_plate', 'metal', V(CF[0] - .05, CF[1] - .03, CT + .07), g);
    const car = add(new THREE.CylinderGeometry(.065, .075, .15, 18), new THREE.MeshStandardMaterial({ color: '#e8f0f4', transparent: true, opacity: .45, roughness: .05 }), 'coffee_carafe_glass', 'glass', V(CF[0] - .05, CF[1] - .03, CT + .155), g); add(new THREE.CylinderGeometry(.068, .068, .07, 18), std('#4a2a18', .2), 'carafe_coffee', 'liquid', V(CF[0] - .05, CF[1] - .03, CT + .115), g);
    box(.03, .02, .1, cm, 'carafe_handle', 'plastic', CF[0] + .04, CF[1] - .03, CT + .16, g); add(new THREE.SphereGeometry(.007, 6, 4), glow('#ffb020'), 'coffee_on_light', 'lamp', V(CF[0] + .04, CF[1] - .13, CT + .05), g, false);
    for (let i = 0; i < 3; i++) { const col = ['#f4f4f0', '#2aa0a0', '#1e2a5a'][i]; add(new THREE.CylinderGeometry(.04, .036, .09, 14, 1, true), std(col, .35, 0, { side: THREE.DoubleSide }), 'coffee_mug', 'ceramic', V(CF[0] + .14, CF[1] - .12 + i * .1, CT + .045), g); add(new THREE.TorusGeometry(.022, .006, 5, 10), std(col, .35), 'mug_handle', 'ceramic', V(CF[0] + .18, CF[1] - .12 + i * .1, CT + .05), g); }
    add(new THREE.CylinderGeometry(.035, .035, .1, 12), new THREE.MeshStandardMaterial({ color: '#f4f4f0', transparent: true, opacity: .7 }), 'sugar_jar', 'glass', V(CF[0] - .2, CF[1] + .12, CT + .05), g); box(.07, .05, .1, std('#f2c230', .6), 'creamer_box', 'paper', CF[0] - .2, CF[1] - .05, CT + .05, g); for (let i = 0; i < 6; i++) bar([CF[0] - .2 + i * .005, CF[1] - .17, CT], [CF[0] - .19 + i * .006, CF[1] - .17, CT + .1], .002, std('#c8a070', .7), 'stir_stick', 'wood', g, 3); }
  add(new THREE.CylinderGeometry(.14, .12, .34, 16, 1, true), std('#5a6a4a', .5, .2, { side: THREE.DoubleSide }), 'waste_bin', 'metal', V(.95, 1.45, .17)); for (let i = 0; i < 4; i++) add(new THREE.IcosahedronGeometry(.04, 0), white, 'crumpled_paper', 'paper', V(.95 + rr(-.06, .06), 1.45 + rr(-.06, .06), .3 + i * .02));
  // a wall rack of steel X-ray film hangers (wear + period) beside the door
  for (let i = 0; i < 4; i++) { bar([RX1 - .04, -.55 + i * .04, 1.95], [RX1 - .04, -.55 + i * .04, 1.45], .003, steel, 'film_hanger_wire'); box(.005, .03, .38, steelDk, 'film_hanger_clip_bar', 'metal', RX1 - .05, -.55 + i * .04, 1.95, root, false); }

  // ---------- THE THREE WIRE TRAYS (rows 20-23), desk front, left->right = scrape, rinse, trick (hero_props) ----------
  const TRAY = [[-.38, .62], [0, .62], [.38, .62]], trayO = []; let trayFrom = 'none';
  if (pl.trays ?? !Y4) { for (let i = 0; i < 3; i++) { try { if (HP && HP.buildWireTray) { const o = HP.buildWireTray(THREE, ctx, { kind: ['scrape', 'rinse', 'trick'][i], fill: pl.tray_fill ?? .5, note: pl.note === 'tray' }); HP.place(THREE, root, ctx, o, W(TRAY[i][0], TRAY[i][1], TOP), 0); trayO.push(o); trayFrom = 'hero_props'; } } catch (e) { console.warn('office: tray ' + e.message); } }
    if (!trayO.length) { for (let i = 0; i < 3; i++) { const [x, y] = TRAY[i]; for (const s of [-1, 1]) { bar([x - .17, y + s * .13, TOP + .07], [x + .17, y + s * .13, TOP + .07], .0025, chrome, 'tray_standin_rail'); bar([x + s * .17, y - .13, TOP + .07], [x + s * .17, y + .13, TOP + .07], .0025, chrome, 'tray_standin_rail'); }
      for (let k = 0; k < 9; k++) bar([x - .16 + k * .04, y - .13, TOP + .004], [x - .16 + k * .04, y + .13, TOP + .004], .002, chrome, 'tray_standin_floor_wire'); } trayFrom = 'stand-in'; } }

  // ---------- AIR LIFE: dust in the stripes / lamp cone (instanced), steam over the carafe ----------
  const dustN = Math.round(pl.dust ?? 220), dust = new THREE.InstancedMesh(new THREE.SphereGeometry(.005, 4, 3), glow(STR ? '#fff0c0' : NIGHT ? '#ffd8a0' : '#e0e4f0'), Math.max(1, dustN)); dust.name = 'dust_motes'; dust.userData.role = 'fx'; dust.count = dustN; root.add(dust);
  const dS = []; for (let i = 0; i < dustN; i++) dS.push(STR ? [rr(-2, .6), rr(-.6, 2.4), rr(.8, 2.3), rr(0, 6.3)] : [rr(-.8, .2), rr(.6, 1.4), rr(.85, 1.5), rr(0, 6.3)]);
  const steamM = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .25, depthWrite: false }), steam = [];
  if (pl.steam !== false) for (let i = 0; i < 8; i++) { const s = add(new THREE.SphereGeometry(.025, 8, 6), steamM.clone(), 'coffee_steam_puff', 'fx', V(CF[0] - .05, CF[1] - .03, CT + .25), root, false); s.userData.ph = i / 8; steam.push(s); }
  // ================= S2 keys (S2 builder 2026-11-16; all OFF unless the place key is set, so S3/S4/S5 dresses do not change) =================
  //   ni_v2: true          NI fix: yellower, wider, stronger lamp pool + a cool ceiling bounce (NI mean >= .31, no pink on the tray cards)
  //   chair: false         hide the swivel chair (he stands behind the desk)
  //   impact: [[f,'#hex']] anime IMPACT FRAME (lens-filling invert quad), as or_room.js
  //   qfield: [[f,u]] + qfield_at [x,y,z] plan (local): POWER r18 abstract field: indigo backdrop + giant drawn "?" marks turning round his head
  //   focus: [[f,u]]       focus lines (radial speed lines on a lens quad, clear centre)
  //   sweat: [[f,u]] + sweat_at [x,y,z]; glint: [[f,u]] + glint_at [x,y,z]   sweat drop / glasses glint sprites
  //   tower: [[f,u]] + tower_at [x,y] + tower_h 2.25 + tower_lift [[f,dz]]   EXTREME r19 card tower (hero_props buildCardStack), setSway(sine) while u>0
  //   tap: { from: [x,y,z], to: [x,y,z], taps: [f,...], f0, f1 }   r16 the colleague's hand only (soft_arm), round black fist taps the note
  //   troff_nohalo: true   S2 v2: no kit halo sprite on the ceiling troffer (the pull-back passes its plane: frame-wide veil flip, as corridor.js)
  //   ask_bubble: { at, f0, f1, size }   S2 v2 r16: white speech bubble with a red '?' (tail to the off-frame colleague) instead of the soft_arm hand  (S2 v3: qcolor, default red; S2 uses purple: ONE red = pain only)
  //   clock_spin_int: true   S2 v2r3: the clock_spin keys are INTEGRATED per frame (hands slow down smoothly, no backward whirl when spin falls) and the hands land on 'clock' at the last spin key
  //   deal: { from: [x,y,z], frames: [f,...], fly: 5 }   r20 cards fly from his fist into tray 1,2,3,1,2,3...; tray_fill_k: [[f,[a,b,c]]]
  const S2 = { fx: [] }, RR = { camera: null };
  if (pl.chair === false) root.traverse(o => { if (o.name === 'desk_chair') o.visible = false; });
  if (pl.ni_v2 && NIGHT) { lampL.color.set('#ffd488'); lampL.intensity *= 1.5; lampL.angle = .98; lampL.distance = 4.6;
    const b = new THREE.PointLight('#9ab0f0', 2.4, 7, 1.2); b.position.copy(V(0, .2, CZ - .25)); root.add(b); const w2 = new THREE.PointLight('#ffd08a', 1.6, 3.5, 1.4); w2.position.copy(V(.4, .6, TOP + .9)); root.add(w2);
    root.traverse(o => { if (o.isMesh && /_paint$|ceiling_tiles/.test(o.name) && o.material && o.material.color) { o.material = o.material.clone(); o.material.color.lerp(new THREE.Color('#ffffff'), .25); } }); }
  // impact frame
  let impQ = null; if (pl.impact && pl.impact.length) { impQ = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: '#ffffff', blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneMinusDstColorFactor, blendDst: THREE.ZeroFactor, depthTest: false, depthWrite: false, fog: false, toneMapped: false })); impQ.name = 'fx_impact_frame'; impQ.renderOrder = 9999; impQ.frustumCulled = false; impQ.visible = false; scene.add(impQ); }
  const lensQuad = (q, dist, k = 1.3) => { const cam = RR.camera; if (!cam) return false; cam.updateMatrixWorld(true); const hh = 2 * dist * Math.tan((cam.fov || 60) * Math.PI / 360) * k;
    q.position.copy(cam.getWorldPosition(new THREE.Vector3())).add(cam.getWorldDirection(new THREE.Vector3()).multiplyScalar(dist)); q.quaternion.copy(cam.getWorldQuaternion(new THREE.Quaternion())); q.scale.set(hh * (cam.aspect || .5625), hh, 1); return true; };
  S2.fx.push(f => { if (!impQ) return; const k = pl.impact.find(([g]) => Math.round(f) === g); impQ.visible = !!k && lensQuad(impQ, .12, 1.4); if (k) impQ.material.color.set(k[1] || '#ffffff'); });
  // "?" field
  if (pl.qfield) { const QA = pl.qfield_at || [.1, 1.45, 1.55], qT = (col, ink) => canvasTex(THREE, 256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); c.font = 'bold 230px Arial Black, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 16; c.strokeStyle = ink; c.strokeText('?', w / 2, h / 2 + 8); c.fillStyle = col; c.fillText('?', w / 2, h / 2 + 8); });
    const cols = [['#ffe27a', '#1a1440'], ['#7fe0ff', '#141a3a'], ['#ffffff', '#1a1440'], ['#c8a0ff', '#141a3a']], qs = [];
    const bgT = canvasTex(THREE, 512, 512, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * .7); g.addColorStop(0, '#5a4ab8'); g.addColorStop(.5, '#2a2a7a'); g.addColorStop(1, '#10123a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(160,170,255,.25)'; c.lineWidth = 6; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(w / 2, h / 2, 40 + i * 34, 0, 6.3); c.stroke(); }
      c.fillStyle = 'rgba(255,255,255,.12)'; c.font = 'bold 60px Arial'; c.textAlign = 'center'; for (let i = 0; i < 40; i++) c.fillText('?', (i * 97) % w, (i * 151) % h); });
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: bgT, transparent: true, opacity: 0, depthWrite: false, fog: false, toneMapped: false })); bg.name = 'fx_qfield_backdrop'; bg.renderOrder = -5; scene.add(bg);
    for (let i = 0; i < 9; i++) { const c = cols[i % 4], sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: qT(c[0], c[1]), transparent: true, fog: false, toneMapped: false, depthWrite: false })); sp.name = 'fx_qfield_mark'; sp.userData.ph = i / 9 * Math.PI * 2; sp.userData.r = .48 + (i % 3) * .14; sp.userData.s = .22 + (i % 4) * .07; sp.userData.z = ((i * 37) % 9) / 9 - .5; scene.add(sp); qs.push(sp); }
    S2.fx.push((f, t) => { const u = Math.max(0, Math.min(1, kf(pl.qfield, f, 0) || 0)), C = V(...QA), cam = RR.camera; bg.visible = u > .01 && !!cam; qs.forEach(q => q.visible = bg.visible);
      if (!bg.visible) return; const cp = cam.getWorldPosition(new THREE.Vector3()), dir = C.clone().sub(cp).normalize(), back = C.clone().addScaledVector(dir, 1.6);
      bg.position.copy(back); bg.quaternion.copy(cam.getWorldQuaternion(new THREE.Quaternion())); const dd = cp.distanceTo(back), hh = 2 * dd * Math.tan((cam.fov || 60) * Math.PI / 360) * 1.25; bg.scale.set(hh * (cam.aspect || .5625) * 1.2, hh, 1); bg.material.opacity = u;
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion), up = new THREE.Vector3(0, 1, 0).applyQuaternion(cam.quaternion);
      qs.forEach(q => { const a = q.userData.ph + t * .9, r = q.userData.r * (.6 + .4 * u); q.position.copy(C).addScaledVector(right, Math.cos(a) * r).addScaledVector(up, Math.sin(a) * r * 1.25 + .05).addScaledVector(dir, q.userData.z * .5); const s = q.userData.s * (.3 + .7 * u); q.scale.set(s, s, s); q.material.rotation = .35 * Math.sin(a * 1.3); }); }); }
  // focus lines
  if (pl.focus) { const fT = canvasTex(THREE, 512, 910, (c, w, h) => { c.clearRect(0, 0, w, h); c.fillStyle = 'rgba(16,14,40,.9)'; for (let i = 0; i < 90; i++) { const a = i / 90 * Math.PI * 2 + (i % 3) * .01, r0 = (.33 + ((i * 7) % 5) * .03) * h, r1 = h * .9, wd = .012 + ((i * 11) % 4) * .004;
        c.beginPath(); c.moveTo(w / 2 + Math.cos(a - wd) * r1, h * .4 + Math.sin(a - wd) * r1); c.lineTo(w / 2 + Math.cos(a) * r0, h * .4 + Math.sin(a) * r0); c.lineTo(w / 2 + Math.cos(a + wd) * r1, h * .4 + Math.sin(a + wd) * r1); c.fill(); } });
    const fq = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: fT, transparent: true, depthTest: false, depthWrite: false, fog: false, toneMapped: false })); fq.name = 'fx_focus_lines'; fq.renderOrder = 9000; fq.frustumCulled = false; scene.add(fq);
    S2.fx.push(f => { const u = kf(pl.focus, f, 0) || 0; fq.visible = u > .01 && lensQuad(fq, .15, 1.0); fq.material.opacity = Math.min(1, u); }); }
  // sweat drop + glint
  const sprite = (draw, name) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: canvasTex(THREE, 128, 128, draw), transparent: true, fog: false, toneMapped: false, depthTest: false })); s.name = name; s.renderOrder = 60; s.visible = false; scene.add(s); return s; };
  if (pl.sweat) { const sw = sprite((c, w, h) => { c.clearRect(0, 0, w, h); c.beginPath(); c.moveTo(64, 8); c.bezierCurveTo(100, 60, 104, 92, 64, 116); c.bezierCurveTo(24, 92, 28, 60, 64, 8); c.fillStyle = '#9fe4ff'; c.fill(); c.lineWidth = 7; c.strokeStyle = '#1a2a5a'; c.stroke(); c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(52, 80, 8, 14, -.3, 0, 6.3); c.fill(); }, 'fx_sweat_drop');
    S2.fx.push(f => { const u = kf(pl.sweat, f, 0) || 0; sw.visible = u > .01; if (!sw.visible) return; const p = pl.sweat_at || [.28, 1.4, 1.72]; sw.position.copy(V(p[0], p[1], p[2] - .05 * u)); sw.scale.setScalar(.11 * Math.min(1, u * 1.5)); }); }
  if (pl.glint) { const gl = sprite((c, w, h) => { c.clearRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 9 : 62; c.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); } c.fill(); }, 'fx_glasses_glint');
    S2.fx.push(f => { const u = kf(pl.glint, f, 0) || 0; gl.visible = u > .01; if (!gl.visible) return; const p = pl.glint_at || [.12, 1.35, 1.6]; gl.position.copy(V(...p)); gl.scale.setScalar(.14 * u); gl.material.rotation = f * .08; }); }
  // the card tower
  if (pl.tower && HP && HP.buildCardStack) { try { const TH = pl.tower_h ?? 2.25, o = HP.buildCardStack(THREE, ctx, { count: 180, height: TH }), TA = pl.tower_at || [.05, 1.12];
      HP.place(THREE, root, ctx, o, W(TA[0], TA[1], TOP), 0); const g = o.group, z0 = g.position.y;
      /* S2 key tower_w (fix round 2): the EXTREME tower as wide as his body (cards scaled tower_w across, height kept), the 180 KNEES tab 2.6x and upright, purple divider tabs -> green (red gate under the amber lamp) */
      if (pl.tower_w) { const k = pl.tower_w; g.scale.set(k, 1, k * .8); g.traverse(m => { if (m.name === 'top_tab_180_knees') m.scale.set(2.6 / k, 2.6, 1); if (m.name === 'card_tower_cards' && m.instanceColor) { const c = new THREE.Color(), w = new THREE.Color('#f6d48a'); for (let j = 0; j < m.count; j++) { m.getColorAt(j, c); m.setColorAt(j, c.multiply(w)); } m.instanceColor.needsUpdate = true; } if (m.name === 'card_tower_divider_tabs' && m.instanceColor) { const c = new THREE.Color(); for (let j = 0; j < m.count; j++) { m.getColorAt(j, c); if (c.b > c.g * 1.3 && c.r > c.g) m.setColorAt(j, c.set('#3a9a5a')); } m.instanceColor.needsUpdate = true; } }); }
      S2.fx.push((f, t) => { const u = kf(pl.tower, f, 0) || 0; g.visible = u > .01; if (!g.visible) return; g.position.y = z0 + (kf(pl.tower_lift, f, 0) || 0); if (pl.tower_grow) { const gu = Math.min(1, Math.max(0, kf(pl.tower_grow, f, 1) ?? 1)), ge = gu * gu * (3 - 2 * gu); g.scale.set(g.userData.sx0 ?? (g.userData.sx0 = g.scale.x), Math.max(.02, ge) * (g.userData.sy0 ?? (g.userData.sy0 = g.scale.y)), g.userData.sz0 ?? (g.userData.sz0 = g.scale.z)); g.position.y -= 0; } if (o.setSway) o.setSway(.55 * Math.sin(t * 2.6) * Math.min(1, u)); }); } catch (e) { console.warn('office tower ' + e.message); } }
  // the colleague's hand (soft arm), taps the note
  if (pl.tap) { try { const SA = await import('./soft_arm.js'), T = pl.tap, arm = SA.softArm(THREE, { width: .028, sag: .14, fistR: .055, name: 'colleague_arm' }); root.add(arm.group);
      const from = V(...T.from), to0 = V(...T.to), back = from.clone().sub(to0).normalize();
      S2.fx.push(f => { const on = f >= (T.f0 ?? 0) && f <= (T.f1 ?? 1e9); arm.group.visible = on; if (!on) return; const enter = Math.min(1, Math.max(0, (f - (T.f0 ?? 0)) / 6)); let off = .35 * (1 - enter * enter * (3 - 2 * enter));
        { const W_ = T.win || 4, A_ = T.amp ?? .05; for (const g of T.taps || []) { const d = f - g; if (d > -W_ && d < 0) off += A_ * Math.sin(Math.PI * (d + W_) / W_) ** (T.win ? 2 : 1); } }
        arm.update(from, to0.clone().addScaledVector(back, .055 + off), new THREE.Vector3(0, -1, 0)); arm.group.traverse(o => { if (o.geometry) o.geometry.computeBoundingBox(); }); }); } catch (e) { console.warn('office tap ' + e.message); } }
  // S2 v2 key ask_bubble: { at: [x,y,z] local plan, f0, f1, size: .5 }  r16 "another doctor ASKS him" WITHOUT a body part (CB: no human arm):
  // a white cartoon speech bubble with a big "?" pops in (overshoot) from the corridor-door side, its tail points off frame to the unseen colleague, bobs, pops out.
  if (pl.ask_bubble) { const B = pl.ask_bubble, cv = document.createElement('canvas'); cv.width = 256; cv.height = 256; const c = cv.getContext('2d');
    c.lineJoin = 'round'; c.lineWidth = 10; c.strokeStyle = '#111111'; c.fillStyle = '#ffffff';
    c.beginPath(); c.ellipse(118, 104, 100, 82, 0, 0, Math.PI * 2); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(178, 160); c.lineTo(246, 226); c.lineTo(146, 178); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(118, 104, 95, 77, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = (B.qcolor || '#d0342c'); c.font = 'bold 132px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 118, 112);
    const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthWrite: false, toneMapped: false }));
    sp.name = 'ask_bubble'; sp.userData.role = 'fx'; const P0 = V(...B.at), sz = B.size || .5; root.add(sp);
    S2.fx.push((f, t) => { const a = f - B.f0, b = B.f1 - f; sp.visible = a >= 0 && b >= 0; if (!sp.visible) return;
      const u = Math.min(1, a / 5), back = 1 + 2.2 * Math.pow(u - 1, 3) + 1.2 * Math.pow(u - 1, 2), out = Math.min(1, b / 4), k = Math.max(.01, (u < 1 ? back : 1) * out);
      sp.scale.set(sz * k, sz * k, 1); sp.position.copy(P0); sp.position.y += .015 * Math.sin(t * 6); }); }
  // dealt cards fly into the trays
  if (pl.deal) { const D = pl.deal, cM = std('#f8f4e8', .7), cards = []; for (let i = 0; i < D.frames.length; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(.127, .002, .076), cM); m.name = 'dealt_card'; m.castShadow = true; m.visible = false; root.add(m); cards.push(m); }
    S2.fx.push(f => { cards.forEach((m, i) => { const f0 = D.frames[i], u = (f - f0) / (D.fly || 5); m.visible = u > 0 && u < 1.0; if (!m.visible) return; const a = D.from, b = TRAY[i % 3], e = 1 - Math.pow(1 - u, 2);
      m.position.copy(V(a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, a[2] + (TOP + .06 - a[2]) * e + .18 * Math.sin(Math.PI * u))); m.rotation.set(.3 * (1 - u), 4 * u + i, .2); }); }); }
  if (pl.tray_fill_k && trayO.length) S2.fx.push(f => { const v = kf(pl.tray_fill_k, f, null); if (Array.isArray(v)) trayO.forEach((o, i) => o.setFill && o.setFill(v[i])); });
  const tmp = new THREE.Object3D(), fps = (film && film.fps) || 30;

  // ENV v3 (E1 2026-11-17): richer walls + shelves + clutter, lamp cap (D1), 2004 overcast window (D3) (envV3Office at the end of this file); OFF unless env_v3
  const ENV = pl.env_v3 ? envV3Office({ THREE, V, add, box, bar, plate, std, glow, steel, steelDk, chrome, rubber, R0, rr, root, pl, NIGHT, STR, Y4, RX0, RX1, RY0, RY1, CZ, TOP, lampL, slats, setTilt, dust }) : null;
  const update = (f, t, R) => { t = t ?? f / fps; if (ENV) ENV.update(t); if (R && R.camera) RR.camera = R.camera; for (const fn of S2.fx) fn(f, t); if (!S2.bb) { S2.bb = 1; scene.traverse(o => { if ((o.isMesh || o.isSprite) && !o.isInstancedMesh && o.geometry && !o.geometry.boundingBox) o.geometry.computeBoundingBox(); }); } if (SF.LP && SF.LP.sync) SF.LP.sync(M); if (lpSky) lpSky.update(t);
    let mins = clockMinutes(pl.clock || (NIGHT ? '9:40' : STR ? '4:20' : '6:10'), f); const spin = kf(pl.clock_spin, f, 0) || 0; let secT = t * (1 + spin * 30);
    if (pl.clock_spin_int && Array.isArray(pl.clock_spin) && Array.isArray(pl.clock_spin[0])) { const kE = pl.clock_spin[pl.clock_spin.length - 1][0];
      if (!S2.spinCum) { S2.spinCum = [0]; for (let g = 1; g <= kE; g++) S2.spinCum.push(S2.spinCum[g - 1] + (kf(pl.clock_spin, g, 0) || 0) / fps); }
      const cum = S2.spinCum[Math.max(0, Math.min(kE, Math.round(f)))]; mins += 60 * (cum - S2.spinCum[kE]); secT = t + 30 * cum; mins = ((mins % 720) + 720) % 720; }
    else mins += spin * 60 * t;
    hM.rotation.z = -(mins % 60) / 60 * Math.PI * 2; hH.rotation.z = -(mins / 720) * Math.PI * 2; hS.rotation.z = -((secT) % 60) / 60 * Math.PI * 2; blurFan.material.opacity = Math.min(.55, Math.max(0, (spin - 1.5) * .25)); hM.visible = spin < 4;
    const duck = kf(pl.lamp_duck, f, 0) || 0; arm1.rotation.x = -.25 + duck * .7; arm2.rotation.x = 1.25 + duck * .9; head.rotation.x = .2 + duck * .6;
    doorG.rotation.y = -(kf(pl.door, f, 0) || 0) * 1.4;
    for (const s of slats) s.rotation.x = .004 * Math.sin(t * .8 + s.position.y * 9);   // the blinds breathe in the air-con
    for (let i = 0; i < dustN; i++) { const s = dS[i]; tmp.position.copy(V(s[0] + .04 * Math.sin(t * .25 + s[3]), s[1] + .03 * Math.cos(t * .2 + s[3]), s[2] + .05 * Math.sin(t * .3 + s[3] * 2))); tmp.updateMatrix(); dust.setMatrixAt(i, tmp.matrix); } dust.instanceMatrix.needsUpdate = true;
    for (const s of steam) { const u = (t * .35 + s.userData.ph) % 1; s.position.copy(V(CF[0] - .05 + .02 * Math.sin(u * 7 + s.userData.ph * 9), CF[1] - .03, CT + .24 + u * .35)); s.scale.setScalar(.6 + u * 2.2); s.material.opacity = .22 * (1 - u); }
  };
  update(0, 0);

  const T2 = (o, k) => o && o.plan && o.plan[k] ? o.plan[k] : null;
  const doorOut = u => W(RX1 + 1.2, -1.4 + 4 * (u - .5), 0);
  return { update, anchors: { desk_top: W(DK.x, DK.y, TOP), desk_front: W(DK.x, DK.y - DK.d / 2, TOP), card_stack: W(0, .7, TOP), tray_1: W(TRAY[0][0], TRAY[0][1], TOP), tray_2: W(TRAY[1][0], TRAY[1][1], TOP), tray_3: W(TRAY[2][0], TRAY[2][1], TOP),
    note_locker: W(...NOTE), lamp_head: W(LBASE[0], LBASE[1] + .15, TOP + .62), lamp_pool: W(-.2, .85, TOP), light_box: W(...LB),
    bar_top_1: T2(lbO, 'bar_top_1'), bar_top_2: T2(lbO, 'bar_top_2'), bar_top_3: T2(lbO, 'bar_top_3'), ruler_rest: T2(lbO, 'ruler_rest'),
    scope_case: W(SH[0] + .05, SH[1], SH[2] + .016), scope_case_lid: T2(scO, 'lid_front'), coffee_cup: W(.45, .78, TOP), coffee_machine: W(CF[0] - .05, CF[1], CT), clock: W(...CK), chair: W(CHP[0], CHP[1], 0),
    surgeon_sit: W(0, 1.55, 0), surgeon_stand: W(-.15, 1.4, 0), letter_spot: W(-.05, .9, TOP + .007), stamp_spot: W(-.05, .9, TOP + .007), pen_cup: W(PC[0], PC[1], TOP), door: W(RX1, (DY0 + DY1) / 2, 0), door_out: doorOut,
    window: W(RX0, (WY0 + WY1) / 2, 1.6), ceiling_z: O[2] + CZ, stations: STATIONS, from: { surfaces: SF.has ? 'look_pack' : 'own', trays: trayFrom, note: noteFrom, light_box: lbFrom, scope_case: scFrom } } };
}

// ================= ENV v3 (helper E1, 2026-11-17; place key env_v3: true, default OFF so S2-S5 renders stay as they are) =================
// CB "environment looks little weak" (ISSUES_v2 A7 + D1 + D3). Adds, local plan metres, all three dresses (night / stripes / y2004):
//   a 1990s wallpaper BORDER (cream, teal ribbon wave, mauve diamonds, navy pinstripes) z 2.36-2.50 round all four walls + an oak crown moulding;
//   a HIGH SHELF on the back wall (x -2.1..-.35, z 2.62) with binders, books, a box "FILMS 1993", a bowling trophy and a trailing pothos (vines sway);
//   two framed DIPLOMAS (back wall x 1.5 / 1.95, z 2.75; no names); a BULLETIN BOARD high on the right wall above the lockers (y -.25..1.45, z 2.66) with
//   three knee X-ray films in binder clips, a call rota, notes, a Galveston postcard, pins; a tall 4-drawer FILING CABINET (right wall y 1.95) with stacked
//   folders on top + a wall CALENDAR above it (1994 / 2004); a bentwood COAT RACK in the back-right corner with a WHITE COAT (pocket pen, stethoscope);
//   a beige MINI FRIDGE (x .78 by the back wall) with magnets, a menu, a microwave + cups on top (next to the coffee machine on its cabinet);
//   a dusty-blue lattice RUG with cream/teal border under the desk (no red, no big medallion); DESK CLUTTER: stapler, tape dispenser, manila folder stack, a photo frame, a sticky pad.
//   LIGHT: D1 the desk lamp is capped (spot <= 8 night / 6 else, its warm points x .45) so the trays and their "60" labels never blow out; NI gets a cool ceiling fill +
//   a blue moonlight patch on the floor + an X-ray box halo (the second light colour); y2004 (D3): blinds tilted open, lighter slats, a grey-lilac window glow
//   and a cool window key, dust cut to 30 motes (no "snow" against the window).
function envV3Office(E) {
  const { THREE, V, add, box, bar, plate, std, glow, steel, steelDk, chrome, rubber, R0, rr, root, pl, NIGHT, STR, Y4, RX0, RX1, RY0, RY1, CZ, TOP, lampL, slats, setTilt, dust } = E;
  const tex = (w, h, draw, rep) => canvasTex(THREE, w, h, draw, rep), mat = (t, r = .6) => std('#ffffff', r, 0, { map: t });
  const addv = (geo, m, name, role, x, y, z, sh = true) => add(geo, m, name, role, V(x, y, z), root, sh);
  const oak = std('#6a4224', .45), frameM = std('#2a2a30', .4), gold = std('#c8a040', .3, .6);
  // ---- wallpaper border + crown moulding on all four walls
  const borderDraw = (c, w, h) => { c.fillStyle = Y4 ? '#e2dccb' : '#efe6cc'; c.fillRect(0, 0, w, h); c.fillStyle = '#1e2a5a'; c.fillRect(0, 3, w, 3); c.fillRect(0, h - 6, w, 3);
    c.strokeStyle = '#2a9a90'; c.lineWidth = 7; c.beginPath(); for (let x = 0; x <= w; x += 4) c.lineTo(x, h / 2 + 12 * Math.sin(x / w * Math.PI * 4)); c.stroke();
    c.fillStyle = '#b07aa8'; for (let i = 0; i < 4; i++) { const x = i * w / 4 + w / 8, y = h / 2 - 12 * Math.sin((x / w) * Math.PI * 4); c.beginPath(); c.moveTo(x, y - 11); c.lineTo(x + 9, y); c.lineTo(x, y + 11); c.lineTo(x - 9, y); c.fill(); }
    c.fillStyle = '#6a8ac8'; for (let i = 0; i < 8; i++) { c.beginPath(); c.arc(i * w / 8 + w / 16, h / 2 + 14 * ((i % 2) ? 1 : -1), 3, 0, 6.3); c.fill(); } };
  const walls = [['x', RY1, RX0, RX1, 'y-'], ['x', RY0, RX0, RX1, 'y+'], ['y', RX1, RY0, RY1, 'x-'], ['y', RX0, RY0, RY1, 'x+']];
  for (const [ax, fx, a0, a1, face] of walls) { const L = a1 - a0, c0 = (a0 + a1) / 2, d = face === 'y-' || face === 'x-' ? -1 : 1, at = (z, o) => ax === 'x' ? [c0, fx + d * o, z] : [fx + d * o, c0, z];
    plate(L, .14, mat(tex(512, 64, borderDraw, [Math.max(1, Math.round(L / .5)), 1]), .7), 'env_wallpaper_border', 'wall', ...at(2.43, .004), face);
    const [cx, cy] = at(0, .03); if (ax === 'x') box(L, .06, .07, oak, 'env_crown_moulding', 'wood', cx, cy, CZ - .035, root, false); else box(.06, L, .07, oak, 'env_crown_moulding', 'wood', cx, cy, CZ - .035, root, false); }
  // ---- high shelf on the back wall: binders, books, FILMS box, trophy, trailing pothos
  const vines = [];
  { const x0 = -2.1, x1 = -.35, y = RY1 - .14, z = 2.62; box(x1 - x0, .26, .03, oak, 'env_high_shelf', 'wood', (x0 + x1) / 2, y, z); for (const x of [x0 + .15, (x0 + x1) / 2, x1 - .15]) { box(.02, .03, .2, steelDk, 'env_shelf_standard', 'metal', x, RY1 - .02, z - .08, root, false); box(.02, .22, .02, steelDk, 'env_shelf_bracket', 'metal', x, y, z - .025, root, false); }
    const bc = ['#1e2a5a', '#2aa0a0', '#c8a040', '#7a8494', '#e8dcc0', '#3a6a9a', '#6a7a4a', '#4a3a6a'], bT = tex(64, 256, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(0, 0, 6, h); c.fillStyle = '#fbfaf0'; c.fillRect(14, 40, 36, 60); c.fillStyle = '#2a2a2a'; for (let k = 0; k < 4; k++) c.fillRect(18, 50 + k * 12, 28, 3); c.beginPath(); c.arc(32, 200, 7, 0, 6.3); c.fill(); });
    let x = x0 + .05; while (x < -1.2) { const t = rr(.045, .075), hh = rr(.27, .31), m = std(bc[Math.floor(R0() * bc.length)], .5, 0, { map: bT }); box(t, .24, hh, m, 'env_shelf_binder', 'plastic', x + t / 2, y, z + .015 + hh / 2); x += t + .004; }
    x = -1.15; for (let i = 0; i < 7; i++) { const t = rr(.03, .05), hh = rr(.18, .25), b = box(t, .18, hh, std(['#4a2a5a', '#2a5a4a', '#8a6a2a', '#1e3a6a', '#5a5a4a', '#2a4a6a', '#7a4a2a'][i], .6), 'env_shelf_book', 'paper', x + t / 2, y, z + .015 + hh / 2); if (i === 6) { b.rotation.z = .35; } x += t + .003; }
    const fT = tex(256, 128, (c, w, h) => { c.fillStyle = '#c8a070'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a2a2a'; c.font = 'bold 40px Arial'; c.fillText('FILMS', 20, 56); c.font = 'bold 34px Arial'; c.fillText('1993', 20, 100); c.strokeStyle = '#8a6a40'; c.lineWidth = 4; c.strokeRect(4, 4, w - 8, h - 8); });
    box(.3, .22, .18, std('#c8a070', .8), 'env_shelf_films_box', 'paper', -.72, y, z + .105); plate(.28, .14, mat(fT, .8), 'env_shelf_films_label', 'paper', -.72, y - .112, z + .105, 'y-');
    addv(new THREE.CylinderGeometry(.04, .05, .05, 12), std('#3a2a1a', .5), 'env_trophy_base', 'wood', -.46, y, z + .04); addv(new THREE.CylinderGeometry(.008, .008, .12, 8), gold, 'env_trophy_post', 'metal', -.46, y, z + .12); addv(new THREE.SphereGeometry(.035, 12, 8), gold, 'env_trophy_ball', 'metal', -.46, y, z + .2);
    const potX = -1.0; addv(new THREE.CylinderGeometry(.075, .06, .12, 14), std('#d8b890', .6), 'env_pothos_pot', 'ceramic', potX + .25, y - .02, z + .075);
    const leafM = [std('#3a8a3a', .6), std('#6ab04a', .6), std('#2a6a34', .6)];
    for (let k = 0; k < 4; k++) { const g = new THREE.Group(); g.position.copy(V(potX + .2 + k * .04, y - .1, z + .1)); root.add(g); g.userData.ph = k * 1.7; vines.push(g); const len = .35 + k * .12, pts = [];
      for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push(new THREE.Vector3(.04 * Math.sin(u * 5 + k), -u * len, -.03 * u)); }
      const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, .004, 4), std('#4a7a3a', .7)); tube.name = 'env_pothos_vine'; g.add(tube);
      for (let i = 1; i <= 8; i++) { const lf = new THREE.Mesh(new THREE.SphereGeometry(.028, 6, 4), leafM[(i + k) % 3]); lf.scale.set(1, .7, .35); lf.position.copy(pts[i]).add(new THREE.Vector3((i % 2 ? .02 : -.02), 0, -.01)); lf.name = 'env_pothos_leaf'; lf.castShadow = true; g.add(lf); } }
    for (let i = 0; i < 9; i++) { const lf = addv(new THREE.SphereGeometry(.04, 6, 4), leafM[i % 3], 'env_pothos_crown_leaf', 'leaf', potX + .25 + rr(-.08, .08), y - .02 + rr(-.06, .06), z + .16 + rr(0, .07)); lf.scale.set(1, .5, .8); } }
  // ---- two framed diplomas (no names: wavy lines, gold seal, ribbon)
  const dipT = (land) => tex(land ? 320 : 240, land ? 240 : 320, (c, w, h) => { c.fillStyle = '#fbf6e4'; c.fillRect(0, 0, w, h); c.strokeStyle = '#8a6a2a'; c.lineWidth = 5; c.strokeRect(10, 10, w - 20, h - 20); c.lineWidth = 1.5; c.strokeRect(18, 18, w - 36, h - 36);
    c.fillStyle = '#1e2a5a'; c.textAlign = 'center'; c.font = 'bold 20px Georgia, serif'; c.fillText(land ? 'DOCTOR OF MEDICINE' : 'BOARD CERTIFIED', w / 2, 56); c.font = 'italic 15px Georgia, serif'; c.fillText(land ? 'with all the rights' : 'Orthopaedic Surgery', w / 2, 82);
    c.strokeStyle = '#5a5a6a'; c.lineWidth = 2; for (let k = 0; k < 4; k++) { c.beginPath(); for (let x = 40; x < w - 40; x += 4) c.lineTo(x, 110 + k * 22 + 2 * Math.sin(x * .3 + k)); c.stroke(); }
    c.fillStyle = '#d8a83c'; c.beginPath(); c.arc(w - 60, h - 52, 24, 0, 6.3); c.fill(); c.fillStyle = '#2a4a8a'; c.beginPath(); c.moveTo(w - 70, h - 34); c.lineTo(w - 78, h - 10); c.lineTo(w - 64, h - 18); c.fill(); c.beginPath(); c.moveTo(w - 50, h - 34); c.lineTo(w - 42, h - 10); c.lineTo(w - 56, h - 18); c.fill(); });
  for (const [x, w, h, land] of [[1.5, .36, .27, true], [1.96, .27, .36, false]]) { box(w + .06, .03, h + .06, std('#1a1a1e', .35), 'env_diploma_frame', 'wood', x, RY1 - .015, 2.75); box(w + .02, .005, h + .02, std('#f4efe0', .8), 'env_diploma_mat', 'paper', x, RY1 - .032, 2.75, root, false); plate(w - .04, h - .04, mat(dipT(land), .5), 'env_diploma', 'paper', x, RY1 - .036, 2.75); }
  // ---- bulletin board high on the right wall: X-ray films in clips, call rota, notes, postcard, pins
  { const y = .6, z = 2.66, W = 1.7, H = .6, cT = tex(512, 192, (c, w, h) => { noiseCanvas(c, w, h, '#b88a58', ['#a07444', '#c89c68', '#8a6038'], 5000, 1, 4, R0); });
    box(.03, W + .06, H + .06, oak, 'env_bulletin_frame', 'wood', RX1 - .015, y, z, root, false); plate(W, H, mat(cT, .9), 'env_bulletin_cork', 'wood', RX1 - .032, y, z, 'x-');
    const xT = (k) => tex(128, 160, (c, w, h) => { c.fillStyle = '#10161e'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(200,220,235,.85)'; c.beginPath(); c.moveTo(44, 0); c.lineTo(84, 0); c.lineTo(82, 62); c.quadraticCurveTo(100, 76, 84, 84); c.lineTo(44, 84); c.quadraticCurveTo(28, 76, 46, 62); c.fill(); c.beginPath(); c.moveTo(40, 92); c.lineTo(88, 92); c.lineTo(80, 112); c.lineTo(78, h); c.lineTo(50, h); c.lineTo(48, 112); c.fill(); c.fillStyle = 'rgba(200,220,235,.5)'; c.fillRect(92, 100, 8, 60); c.fillStyle = '#e8f0f8'; c.font = 'bold 12px Arial'; c.fillText(['L', 'R', 'L'][k], 8, 16); });
    for (let k = 0; k < 3; k++) { const py = y - .7 + k * .22; plate(.19, .24, glow(NIGHT ? '#c8d4e8' : '#ffffff', { map: xT(k) }), 'env_bulletin_xray', 'film', RX1 - .036, py, z + .02, 'x-'); box(.012, .05, .025, std('#1a1a1e', .4, .5), 'env_binder_clip', 'metal', RX1 - .042, py, z + .14, root, false); }
    const rotaT = tex(192, 160, (c, w, h) => { c.fillStyle = Y4 ? '#f2ead0' : '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#1e2a5a'; c.font = 'bold 18px Arial'; c.fillText(Y4 ? 'CALL ROTA 2004' : 'CALL ROTA', 8, 22); c.strokeStyle = '#7a8494'; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(6, 32 + i * 22); c.lineTo(w - 6, 32 + i * 22); c.stroke(); } for (let j = 0; j < 5; j++) { c.beginPath(); c.moveTo(6 + j * 45, 32); c.lineTo(6 + j * 45, h - 18); c.stroke(); } c.fillStyle = '#2a6ad0'; for (let i = 0; i < 9; i++) c.fillRect(14 + (i % 4) * 45, 38 + Math.floor(i / 4) * 22 + (i % 3) * 6, 24, 6); });
    plate(.26, .22, mat(rotaT, .8), 'env_bulletin_rota', 'paper', RX1 - .036, y + .02, z + .05, 'x-');
    const nts = [['#fff4a0', 'M&M CONF', 'WED 7AM'], ['#bfe0f4', 'NEW SCOPES', 'ROOM 3'], ['#c8f0d0', 'GOLF SAT', 'SIGN UP'], ['#f4e8c8', 'PARKING', 'LOT B']];
    nts.forEach(([col, a, b], i) => { const nT = tex(128, 128, (c, w, h) => { c.fillStyle = Y4 ? '#efe3b8' : col; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a2a'; c.font = 'bold 18px Arial'; c.fillText(a, 8, 30); c.font = '16px Arial'; c.fillText(b, 8, 56); c.fillStyle = 'rgba(40,40,60,.45)'; for (let k = 0; k < 3; k++) c.fillRect(8, 76 + k * 15, 60 + k * 14, 3); });
      const py = y + .25 + (i % 2) * .2, pz = z + (i < 2 ? .14 : -.13), n = plate(.15, .15, mat(nT, .8), 'env_bulletin_note', 'paper', RX1 - .038 - i * .0008, py, pz, 'x-'); n.rotation.x = rr(-.12, .12);
      addv(new THREE.SphereGeometry(.01, 6, 4), std(['#2a6ad0', '#f2c230', '#2aa04a', '#f4f0e4'][i], .35), 'env_push_pin', 'plastic', RX1 - .046, py, pz + .065, false); });
    const pcT = tex(160, 112, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#6ab8e8'); g.addColorStop(.55, '#bfe4f4'); g.addColorStop(.56, '#2a8aa8'); g.addColorStop(.75, '#e8d8a8'); g.addColorStop(1, '#d8c08a'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.font = 'bold 20px Arial'; c.fillText('GALVESTON', 10, 28); c.fillStyle = '#2a5a2a'; c.fillRect(120, 40, 4, 36); c.beginPath(); c.ellipse(122, 40, 16, 6, 0, 0, 6.3); c.fill(); });
    const pc = plate(.16, .11, mat(pcT, .6), 'env_bulletin_postcard', 'paper', RX1 - .04, y + .72, z - .12, 'x-'); pc.rotation.x = -.1; }
  // ---- tall 4-drawer filing cabinet (right wall y 1.95) + folders on top + a wall calendar above
  { const x = RX1 - .3, y = 1.95, cab = std(Y4 ? '#a8a69c' : '#8a8c84', .45, .35), drw = std(Y4 ? '#b8b6ac' : '#9a9c94', .4, .35); box(.54, .46, 1.32, cab, 'env_file_cabinet_tall', 'metal', x, y, .66);
    for (let i = 0; i < 4; i++) { const z = .2 + i * .32; box(.01, .42, .29, drw, 'env_file_drawer', 'metal', x - .272, y, z); box(.012, .12, .02, chrome, 'env_file_drawer_handle', 'metal', x - .282, y, z + .03); box(.006, .08, .04, std('#f4f0e0', .6), 'env_file_label', 'paper', x - .279, y, z + .09, root, false); }
    for (let s = 0; s < 3; s++) for (let i = 0; i < 4 + s; i++) { const f = box(.24, .32, .012, std(['#e8c890', '#d8b878', '#e0c088'][i % 3], .8), 'env_folder', 'paper', x - .05 + rr(-.02, .02) + (s - 1) * .02, y + (s - 1) * .02, 1.326 + i * .014 + s * .07, root, false); f.rotation.y = rr(-.08, .08); box(.05, .006, .02, std(['#2a6ad0', '#2aa04a', '#f2c230', '#b07aa8'][i % 4], .5), 'env_folder_tab', 'paper', x - .05 + .06, y - .162 + (s - 1) * .02, 1.333 + i * .014 + s * .07, root, false); }
    const yr = Y4 ? '2004' : '1994', calT = tex(240, 340, (c, w, h) => { c.fillStyle = '#fbf6e8'; c.fillRect(0, 0, w, h); const g = c.createLinearGradient(0, 0, 0, 140); g.addColorStop(0, '#8ac8f0'); g.addColorStop(.6, '#cfe8f4'); g.addColorStop(.61, '#4a8a3a'); g.addColorStop(1, '#3a7a2a'); c.fillStyle = g; c.fillRect(0, 0, w, 140);
      c.fillStyle = '#3a5ad8'; for (let i = 0; i < 60; i++) { c.beginPath(); c.arc((i * 37) % w, 95 + (i * 13) % 45, 3, 0, 6.3); c.fill(); } c.fillStyle = '#1e2a5a'; c.textAlign = 'center'; c.font = 'bold 48px Arial'; c.fillText(yr, w / 2, 192); c.font = 'bold 22px Arial'; c.fillText(Y4 ? 'OCTOBER' : STR ? 'MAY' : 'AUGUST', w / 2, 222);
      c.font = '14px Arial'; for (let d = 1; d <= 31; d++) { const col = (d + 2) % 7, row = Math.floor((d + 2) / 7); c.fillText(String(d), 22 + col * 33, 250 + row * 18); } });
    plate(.3, .42, mat(calT, .7), 'env_wall_calendar_' + yr, 'paper', RX1 - .006, y, 1.74, 'x-', root, true); addv(new THREE.SphereGeometry(.007, 6, 4), steelDk, 'env_calendar_nail', 'metal', RX1 - .01, y, 1.96, false); }
  // ---- bentwood coat rack in the back-right corner with the WHITE COAT (+ stethoscope, pocket pen)
  { const x = 2.0, y = 2.38, wood = std('#5a3a1e', .45); bar([x, y, .03], [x, y, 1.82], .022, wood, 'env_coat_rack_pole', 'wood'); addv(new THREE.SphereGeometry(.04, 12, 8), wood, 'env_coat_rack_knob', 'wood', x, y, 1.86);
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + .6; bar([x, y, .28], [x + .2 * Math.cos(a), y + .2 * Math.sin(a), .02], .014, wood, 'env_coat_rack_leg', 'wood'); bar([x, y, 1.66], [x + .13 * Math.cos(a), y + .13 * Math.sin(a), 1.76], .01, wood, 'env_coat_rack_hook', 'wood'); }
    const g = new THREE.Group(); g.name = 'env_white_coat'; g.position.copy(V(x - .14, y - .06, 1.2)); g.rotation.y = .5; root.add(g); const coat = std('#f6f4ee', .8, 0, { side: THREE.DoubleSide });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(.13, .22, 1.0, 16, 4, true), coat); body.scale.z = .55; body.name = 'env_white_coat_body'; body.castShadow = true; g.add(body);
    const col = new THREE.Mesh(new THREE.TorusGeometry(.1, .025, 6, 16, Math.PI), coat); col.position.set(0, .5, 0); col.rotation.x = Math.PI / 2; col.name = 'env_white_coat_collar'; g.add(col);
    for (const s of [-1, 1]) { const sl = new THREE.Mesh(new THREE.CylinderGeometry(.045, .06, .62, 10), coat); sl.position.set(s * .17, .12, 0); sl.rotation.z = s * .12; sl.name = 'env_white_coat_sleeve'; sl.castShadow = true; g.add(sl);
      const pk = new THREE.Mesh(new THREE.PlaneGeometry(.12, .12), std('#e8e6de', .8, 0, { side: THREE.DoubleSide })); pk.position.set(s * .1, -.2, .118); pk.name = 'env_white_coat_pocket'; g.add(pk); }
    const pen = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, .12, 6), std('#2a4cc8', .4)); pen.position.set(-.1, .26, .115); pen.name = 'env_white_coat_pen'; g.add(pen);
    const tube = new THREE.Mesh(new THREE.TorusGeometry(.11, .007, 6, 24, Math.PI * 1.3), std('#1e1e24', .5)); tube.position.set(0, .3, .125); tube.rotation.z = Math.PI * 1.1; tube.name = 'env_stethoscope'; g.add(tube);
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, .015, 14), chrome); bell.position.set(.08, .14, .13); bell.rotation.x = Math.PI / 2; bell.name = 'env_stethoscope_bell'; g.add(bell);
    const jk = new THREE.Mesh(new THREE.CylinderGeometry(.12, .19, .8, 12, 1, true), std('#2a3a6a', .8, 0, { side: THREE.DoubleSide })); jk.scale.z = .5; jk.position.copy(V(x + .1, y + .08, 1.32)); jk.name = 'env_rack_windbreaker'; root.add(jk); }
  // ---- mini fridge + microwave + cups (back wall x .78), next to the coffee machine
  { const x = .78, y = RY1 - .27, fr = std(Y4 ? '#dcd6c4' : '#e8e0cc', .4, .1); box(.48, .48, .82, fr, 'env_mini_fridge', 'plastic', x, y, .43); box(.46, .01, .005, std('#9a9484', .6), 'env_fridge_seam', 'plastic', x, y - .242, .62, root, false);
    box(.02, .015, .3, chrome, 'env_fridge_handle', 'metal', x + .19, y - .25, .52); box(.44, .01, .04, std('#3a3a3a', .7), 'env_fridge_grille', 'metal', x, y - .242, .07, root, false);
    [['#2a6ad0', -.12, .7], ['#f2c230', .05, .74], ['#2aa04a', -.02, .3]].forEach(([c2, dx, z]) => box(.04, .012, .04, std(c2, .4), 'env_fridge_magnet', 'plastic', x + dx, y - .247, z, root, false));
    const mT = tex(128, 170, (c, w, h) => { c.fillStyle = '#fbfaf4'; c.fillRect(0, 0, w, h); c.fillStyle = '#1e2a5a'; c.font = 'bold 22px Arial'; c.fillText('PIZZA', 10, 30); c.fillStyle = 'rgba(40,40,60,.55)'; for (let k = 0; k < 7; k++) c.fillRect(10, 48 + k * 16, 60 + (k * 17) % 40, 4); });
    const mn = plate(.12, .16, mat(mT, .8), 'env_fridge_menu', 'paper', x + .05, y - .246, .64, 'y-'); mn.rotation.z = .08;
    const mw = std(Y4 ? '#cfc8b4' : '#d8ccb0', .5); box(.46, .34, .26, mw, 'env_microwave', 'plastic', x, y + .02, .97); box(.28, .01, .17, std('#1a1e24', .2, .2), 'env_microwave_window', 'glass', x - .05, y - .152, .97);
    box(.1, .01, .2, std('#bfb4a0', .5), 'env_microwave_panel', 'plastic', x + .15, y - .152, .97); addv(new THREE.CylinderGeometry(.018, .018, .012, 12), std('#3a3a3a', .5), 'env_microwave_dial', 'plastic', x + .15, y - .16, 1.03, false).rotation.x = Math.PI / 2;
    for (let i = 0; i < 6; i++) box(.018, .006, .012, std('#3a3a3a', .5), 'env_microwave_key', 'plastic', x + .13 + (i % 2) * .04, y - .158, .95 - Math.floor(i / 2) * .022, root, false);
    for (let i = 0; i < 5; i++) addv(new THREE.CylinderGeometry(.035, .028, .09, 12, 1, true), std('#f6f4ee', .6, 0, { side: THREE.DoubleSide }), 'env_styrofoam_cup', 'plastic', x - .14, y, 1.145 + i * .018, false); }
  // ---- rug under the desk (navy field, gold + teal borders, cream medallion; no red)
  { const rT = tex(512, 640, (c, w, h) => { c.fillStyle = '#c8b48a'; c.fillRect(0, 0, w, h); c.fillStyle = '#4a6a9a'; c.fillRect(22, 22, w - 44, h - 44); c.fillStyle = '#2a8a80'; c.fillRect(34, 34, w - 68, 8); c.fillRect(34, h - 42, w - 68, 8); c.fillRect(34, 34, 8, h - 68); c.fillRect(w - 42, 34, 8, h - 68);
      for (let y = 60; y < h - 50; y += 36) for (let x = 60; x < w - 50; x += 36) { const k = ((x + y) / 36) % 2; c.fillStyle = k ? '#e8dcc0' : '#2a4a7a'; c.beginPath(); c.moveTo(x, y - 9); c.lineTo(x + 9, y); c.lineTo(x, y + 9); c.lineTo(x - 9, y); c.fill(); c.fillStyle = '#c8a040'; c.fillRect(x + 16, y + 16, 4, 4); }
      c.fillStyle = 'rgba(255,255,255,.06)'; for (let i = 0; i < 4000; i++) c.fillRect(R0() * w, R0() * h, 2, 2); c.fillStyle = 'rgba(40,30,20,.08)'; for (let i = 0; i < 9; i++) { c.beginPath(); c.ellipse(R0() * w, R0() * h, 40, 20, R0() * 3, 0, 6.3); c.fill(); } });
    const rug = add(new THREE.PlaneGeometry(2.4, 3.0), std('#ffffff', .95, 0, { map: rT }), 'env_rug', 'carpet', V(0, .3, .005), root, false); rug.rotation.x = -Math.PI / 2; rug.receiveShadow = true;
    for (const s of [-1, 1]) for (let i = 0; i < 40; i++) box(.006, .05, .003, std('#e8dcc0', .9), 'env_rug_fringe', 'cloth', -1.17 + i * .06, .3 + s * 1.525, .006, root, false); }
  // ---- desk clutter: stapler, tape dispenser, manila folder stack, photo frame (back to the lens), sticky pad
  { const T = TOP; box(.15, .045, .022, std('#2a2a30', .4), 'env_stapler_base', 'metal', .22, 1.17, T + .011); const st = box(.14, .04, .024, std('#d8ccb0', .4), 'env_stapler_top', 'plastic', .225, 1.17, T + .034); st.rotation.y = .04;
    box(.11, .05, .04, std('#3a3a40', .4), 'env_tape_dispenser', 'plastic', .04, 1.2, T + .02); addv(new THREE.TorusGeometry(.022, .008, 6, 16), std('#e8e4d0', .3, 0, { transparent: true, opacity: .8 }), 'env_tape_roll', 'plastic', .04, 1.2, T + .05, false);
    for (let i = 0; i < 4; i++) { const f = box(.23, .3, .01, std(['#e8c890', '#d8b878', '#e0c088', '#cfe2f4'][i], .8), 'env_desk_folder', 'paper', -.22 + rr(-.01, .01), 1.1, T + .005 + i * .011, root, false); f.rotation.y = rr(-.06, .06); }
    const g = new THREE.Group(); g.name = 'env_photo_frame'; g.position.copy(V(.4, 1.22, T)); g.rotation.y = Math.PI + .25; root.add(g); const fb = new THREE.Mesh(new THREE.BoxGeometry(.13, .17, .012), std('#5a3a1e', .4)); fb.position.y = .085; fb.rotation.x = -.15; fb.name = 'env_photo_frame_back'; fb.castShadow = true; g.add(fb);
    box(.08, .08, .006, std('#f2c230', .7), 'env_sticky_pad', 'paper', -.12, 1.02, T + .003, root, false); }
  // ---- LIGHT. D1: cap the desk lamp so the trays and their "60" labels never blow out
  lampL.intensity = Math.min(lampL.intensity, NIGHT ? 8 : 6); lampL.penumbra = Math.max(lampL.penumbra, .75);
  root.traverse(o => { if (o.isPointLight && /^(ffc068|ffd08a)$/.test(o.color.getHexString())) o.intensity *= .45; });
  const poolT = tex(256, 256, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.4, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const poolM = (col, op) => new THREE.MeshBasicMaterial({ color: col, map: poolT, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  if (NIGHT) { const f = new THREE.PointLight('#8a9ae8', 4.0, 8, 1.2); f.position.copy(V(.3, -.6, CZ - .3)); root.add(f); const f2 = new THREE.PointLight('#9aa8f0', 2.4, 6, 1.2); f2.position.copy(V(.4, 2.0, CZ - .3)); root.add(f2);
    const moon = add(new THREE.PlaneGeometry(1.4, 2.2), poolM('#7a9aff', .3), 'env_moon_floor_patch', 'fx', V(RX0 + .8, .4, .007), root, false); moon.rotation.x = -Math.PI / 2; moon.renderOrder = 2;
    const halo = plate(1.6, 1.2, poolM('#bfd8ff', .22), 'env_xray_box_halo', 'fx', -.35, RY1 - .008, 1.6, 'y-'); halo.renderOrder = 2; }
  if (STR) { const halo = plate(1.4, 1.0, poolM('#ffd890', .12), 'env_sun_wall_glow', 'fx', -.6, RY1 - .008, 1.9, 'y-'); halo.renderOrder = 2; }
  if (Y4) { setTilt(1); for (const s of slats) { s.material = s.material.clone(); s.material.color.set('#eeeae0'); }
    const wg = plate(2.2, 1.5, glow('#aab2d6', { transparent: true, opacity: .55, depthWrite: false }), 'env_overcast_window_glow', 'sky', RX0 - .03, .4, 1.6, 'x+', root, false); wg.renderOrder = -1;
    const k = new THREE.DirectionalLight('#c8d0e8', .9); k.position.copy(V(RX0 - 4, .4, 3.2)); const kt = new THREE.Object3D(); kt.position.copy(V(.2, .9, .8)); root.add(k, kt); k.target = kt;
    const patch = add(new THREE.PlaneGeometry(1.2, 2.2), poolM('#b8c0e8', .22), 'env_overcast_floor_patch', 'fx', V(RX0 + .7, .4, .007), root, false); patch.rotation.x = -Math.PI / 2; patch.renderOrder = 2;
    if (dust && dust.isInstancedMesh) dust.count = Math.min(dust.count, 30); }
  return { update: t => { for (const g of vines) g.rotation.z = .03 * Math.sin(t * .9 + g.userData.ph); } };
}

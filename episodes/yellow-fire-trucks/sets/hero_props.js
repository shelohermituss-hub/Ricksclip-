// hero_props.js: the SPRAY KIT of "Why Fire Trucks Turned Yellow" (props-hero 2026-11-20): the held spray gun, its wheeled compressor, the paint tin, the air hose.
// Every builder: buildX(THREE, ctx, opts) or buildX(THREE, opts) (the kit's held3d form) -> { group, parts, tris, grip, tip, anchors, ...setters }.
// Groups: LOCAL METRES, Y UP, real size. In a set: HP.place(THREE, scene, ctx, o, [x, y, z] plan, yawDeg) -> o.plan.<anchor> (plan metres, Z up).
// Held: film.json "held3d": [{ who, obj: "spray_gun", module: "sets/hero_props.js", builder: "buildSprayGun", grip: "handle", face: "out", hand: "R", anchor: "grip", tip: "tip", when: "always" }]
// opts.paintColor on the gun, compressor and tin = the wet paint colour (default lemon; line 13 repaint: pass PAINT.red). The tin's printed label stays lemon.
// The film's yellow is hero_truck.js PAINT.yellow (#e2e31c): tin, drips, the gun's cup and the fan all use it. No red anywhere in this file (the truck is the red).
import { kit, args, done, place as placeProp, handText } from './prop_kit.js';
import { PAINT } from './hero_truck.js';
export const place = placeProp;
const PI = Math.PI;
const yellowM = (THREE, col) => new THREE.MeshPhysicalMaterial({ color: col || PAINT.yellow, roughness: .18, clearcoat: 1, clearcoatRoughness: .08 });

// ================================================================ THE SPRAY GUN (line 1; in the hero's fist all through lines 1-2, on the bench in 13)
// A 1970s siphon-feed cup gun: cast aluminium body, knurled brass air cap with two horns, steel trigger on a pin, fluid and fan knobs at the back, hanging hook,
// one-quart aluminium cup under the nose with a clamp yoke and cam lever, brass air inlet at the foot of the handle with the hose on it.
// opts.cup 'glass' (default: a glass jar, the lemon seen inside; setCup(level, tilt) sloshes it) | 'metal' (aluminium quart can).
// Origin = the middle of the handle (grip). Handle along Y, nose toward +X. opts.hose = length of the hose tail hanging from the handle (0 = none); opts.spray = show the fan.
export function buildSprayGun(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'spray_gun';
  const cast = K.metal('steel', '#c4c9d0', .32, 1.15, { finish: 'cast', nscale: .5, scale: .08 }), pol = K.metal('steel', '#eef2f6', .08, 1.5, { finish: 'smooth', nscale: .03, scale: .1 }), brass = K.metal('brass', '#e0b24e', .2, 1.4, { finish: 'smooth', nscale: .1, scale: .08 });
  const cupM = K.metal('steel', '#d0d4da', .22, 1.3, { finish: 'brushed', nscale: .3, scale: .1 }), hoseM = K.std('#26262a', { roughness: .65 }), Y = yellowM(THREE, opts.paintColor);
  const hd = K.add(g, new THREE.CylinderGeometry(.017, .019, .12, 14), cast, 'gun_handle', 'metal', [-.006, -.005, 0], [0, 0, .16]); hd.scale.z = .72;
  for (let i = 0; i < 5; i++) K.bx(g, -.026 + i * .0015, -.022 + i * .0015, -.04 + i * .018, -.032 + i * .018, -.0135, .0135, cast, 'handle_finger_ridge', 'metal');
  K.cyl(g, .019, .15, 'x', cast, 'gun_body_barrel', 'metal', [.04, .078, 0], 16); K.sphere(g, .024, cast, 'gun_body_shoulder', 'metal', [.0, .07, 0], [1.2, 1, .8]);
  K.cyl(g, .024, .03, 'x', brass, 'air_cap_knurled_ring', 'metal', [.128, .078, 0], 20); for (let i = 0; i < 16; i++) { const a2 = i / 16 * PI * 2; K.box(g, [.028, .003, .003], brass, 'air_cap_knurl', 'metal', [.128, .078 + Math.sin(a2) * .0245, Math.cos(a2) * .0245]).castShadow = false; }
  K.cyl(g, .018, .012, 'x', pol, 'air_cap_face', 'metal', [.148, .078, 0], 16); for (const s of [1, -1]) K.box(g, [.014, .012, .008], pol, 'air_cap_horn', 'metal', [.158, .078 + s * .014, 0]); K.cyl(g, .004, .012, 'x', brass, 'fluid_tip', 'metal', [.158, .078, 0], 8, .0025);
  K.sphere(g, .006, Y, 'paint_on_the_tip', 'paint', [.163, .078, 0]); K.tube(g, [[.15, .062, .012], [.15, .05, .014], [.149, .04, .013]], .0028, Y, 'paint_run_on_air_cap', 'paint', 8, 5);
  K.cyl(g, .012, .03, 'x', pol, 'fluid_adjust_knob', 'metal', [-.05, .078, 0], 12); K.cyl(g, .005, .03, 'x', pol, 'fluid_needle_stem', 'metal', [-.03, .078, 0], 6); K.cyl(g, .01, .02, 'x', pol, 'fan_adjust_knob', 'metal', [-.038, .104, 0], 12); K.cyl(g, .012, .02, 'x', cast, 'fan_valve_boss', 'metal', [-.018, .1, 0], 10);
  K.tube(g, [[.0, .095, 0], [.0, .125, 0], [.02, .14, 0], [.04, .128, 0]], .004, pol, 'hanging_hook', 'metal', 16, 6);
  K.box(g, [.007, .1, .012], pol, 'trigger', 'metal', [.034, .018, 0], [0, 0, -.22]); K.cyl(g, .004, .034, 'z', brass, 'trigger_pivot_pin', 'metal', [.024, .066, 0], 8); K.cyl(g, .005, .02, 'x', brass, 'air_valve_stem', 'metal', [.012, .03, 0], 6);
  // the cup: quart can under the nose, lid with clamp yoke + cam lever, siphon tube, vent hole
  const cx = .09, cup = new THREE.Group(); cup.name = 'paint_cup'; g.add(cup);
  const glassCup = opts.cup !== 'metal', jar = glassCup ? new THREE.MeshPhysicalMaterial({ color: '#dfeef2', roughness: .05, metalness: 0, transparent: true, opacity: .32, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false }) : cupM;
  const can = K.lathe(cup, [[0, -.165], [.05, -.165], [.053, -.16], [.053, -.05], [.055, -.046]], jar, glassCup ? 'cup_glass_jar' : 'cup_can', glassCup ? 'glass' : 'metal', [cx, 0, 0], null, 26); can.renderOrder = 3;
  const lvl = new THREE.Group(); lvl.position.set(cx, -.163, 0); cup.add(lvl); const liq = K.cyl(lvl, .0495, .1, 'y', Y, 'cup_lemon_paint', 'paint', [0, .05, 0], 24); liq.visible = glassCup; K.torus(cup, .0535, .003, cast, 'cup_jar_thread_ring', 'metal', [cx, -.052, 0], [PI / 2, 0, 0], PI * 2, 5, 26); K.cyl(cup, .057, .012, 'y', cast, 'cup_lid', 'metal', [cx, -.04, 0], 26); K.cyl(cup, .012, .06, 'y', cast, 'cup_siphon_neck', 'metal', [cx, -.005, 0], 10); K.cyl(cup, .016, .014, 'y', brass, 'cup_union_nut', 'metal', [cx, .03, 0], 6);
  K.tube(cup, [[cx - .06, -.07, 0], [cx - .062, -.03, 0], [cx - .03, -.022, 0], [cx + .03, -.022, 0], [cx + .062, -.03, 0], [cx + .06, -.07, 0]], .0035, pol, 'cup_clamp_yoke', 'metal', 24, 6); K.box(cup, [.012, .008, .05], pol, 'cup_cam_lever', 'metal', [cx, -.02, .028], [.3, 0, 0]);
  for (const s of [1, -1]) K.cyl(cup, .005, .008, 'x', pol, 'cup_yoke_ear', 'metal', [cx + s * .058, -.07, 0], 8);
  K.torus(cup, .0535, .0025, cupM, 'cup_bead', 'metal', [cx, -.1, 0], [PI / 2, 0, 0], PI * 2, 5, 26); K.sphere(cup, .0025, K.std('#111'), 'cup_vent_hole', 'metal', [cx + .03, -.033, .02]);
  K.reseed(5); for (let i = 0; i < 5; i++) { const an = i * 1.3 + .4, L = .03 + K.rr(0, .07), r = .0536; K.tube(cup, [[cx + Math.cos(an) * r, -.047, Math.sin(an) * r], [cx + Math.cos(an + .05) * r, -.047 - L * .6, Math.sin(an + .05) * r], [cx + Math.cos(an + .03) * r, -.047 - L, Math.sin(an + .03) * r]], .003, Y, 'yellow_drip_on_cup', 'paint', 8, 5); K.sphere(cup, .0045, Y, 'yellow_drip_bead', 'paint', [cx + Math.cos(an + .03) * r, -.047 - L, Math.sin(an + .03) * r]); }
  K.torus(cup, .056, .003, Y, 'yellow_ring_at_lid', 'paint', [cx, -.046, 0], [PI / 2, 0, 0], PI * 2, 5, 26); K.sphere(g, .007, Y, 'yellow_thumb_print', 'paint', [-.012, .03, .013], [1, 1.4, .3]);
  // air inlet + hose tail
  K.cyl(g, .008, .02, 'y', brass, 'air_inlet_nipple', 'metal', [-.016, -.072, 0], 8); K.cyl(g, .012, .018, 'y', brass, 'hose_coupler_hex', 'metal', [-.018, -.09, 0], 6); K.cyl(g, .0105, .02, 'y', pol, 'hose_ferrule', 'metal', [-.019, -.108, 0], 10);
  const hl = opts.hose ?? .9, end = [-.25 - hl * .25, -.118 - hl * .8, .06];
  if (hl > 0) K.tube(g, [[-.019, -.118, 0], [-.025, -.118 - hl * .3, .0], [-.08, -.118 - hl * .62, .02], [-.2, -.118 - hl * .78, .05], end], .0085, hoseM, 'air_hose_tail', 'rubber', 40, 7);
  const fan = K.add(g, new THREE.ConeGeometry(.2, .55, 20, 1, true), new THREE.MeshBasicMaterial({ color: opts.paintColor || PAINT.yellow, transparent: true, opacity: .22, depthWrite: false, side: THREE.DoubleSide }), 'spray_fan', 'fx', [.165 + .275, .078, 0], [0, 0, PI / 2], false); fan.scale.z = .35; fan.visible = !!opts.spray;
  return done(THREE, g, K, { grip: [0, 0, 0], tip: [.165, .078, 0], anchors: { nozzle: [.165, .078, 0], cup: [cx, -.1, 0], hose_end: end, hook: [.02, .14, 0], fan_end: [.72, .078, 0] }, setSpray: on => { fan.visible = !!on; }, setCup: (level = .7, tilt = 0) => { lvl.scale.y = Math.max(.05, level) / .9; lvl.rotation.z = tilt; } });   // setCup(level 0..1, tilt rad): the lemon sloshes in the glass
}

// ================================================================ THE COMPRESSOR (lines 1-2, 13): a small 1970s wheeled shop compressor, half horsepower
// Origin = the floor under the middle of the tank. Tank along X, wheels at +X, pull handle and foot at -X. About 0.95 long, 0.45 wide, 0.82 to the handle.
export function buildCompressor(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'air_compressor';
  const tankM = K.metal('wet', opts.color || '#3f6f6c', .3, .9, { finish: 'cast', nscale: .35, coat: .6, coatRough: .25, scale: .15 }), iron = K.metal('iron', '#3c3f46', .5, .7, { rust: .12, scale: .2 }), steel = K.metal('steel', '#c2c8cf', .25, 1.2, { scale: .15 }), pol = K.metal('steel', '#eef2f6', .08, 1.5, { finish: 'smooth', nscale: .03, scale: .1 });
  const brass = K.metal('brass', '#dcae52', .25, 1.3, { scale: .1 }), copper = K.metal('bronze', '#c8743a', .22, 1.3, { finish: 'smooth', patina: .05, nscale: .1, scale: .1 }), rubber = K.std('#1a1a1c', { roughness: .9 }), Y = yellowM(THREE, opts.paintColor);
  K.cyl(g, .15, .56, 'x', tankM, 'air_tank', 'metal', [0, .3, 0], 28); for (const s of [1, -1]) K.sphere(g, .15, tankM, 'tank_dished_end', 'metal', [s * .28, .3, 0], [.45, 1, 1], 24, 12); for (const x of [-.2, .2]) K.torus(g, .151, .004, tankM, 'tank_weld_seam', 'metal', [x, .3, 0], [0, PI / 2, 0], PI * 2, 5, 28);
  K.bar(g, [.22, .1, -.23], [.22, .1, .23], .012, steel, 'wheel_axle', 'metal', 8); for (const s of [1, -1]) { K.bx(g, .2, .24, .09, .2, s * .12, s * .14, iron, 'axle_bracket', 'metal'); const w = new THREE.Group(); w.position.set(.22, .1, s * .21); g.add(w);
    K.lathe(w, [[.055, -.02], [.09, -.022], [.1, -.012], [.1, .012], [.09, .022], [.055, .02]], rubber, 'wheel_tyre_solid', 'rubber', null, [PI / 2, 0, 0], 22); K.cyl(w, .056, .03, 'z', steel, 'wheel_disc', 'metal', null, 16); K.cyl(w, .016, .05, 'z', pol, 'wheel_hub_cap', 'metal', null, 10); K.torus(w, .007, .002, steel, 'axle_cotter_pin', 'metal', [0, 0, s * .028]); }
  K.tube(g, [[-.2, .17, -.1], [-.3, .08, -.1], [-.32, .012, -.1], [-.32, .012, .1], [-.3, .08, .1], [-.2, .17, .1]], .011, iron, 'front_foot_bar', 'metal', 30, 7); for (const s of [1, -1]) K.cyl(g, .018, .016, 'y', rubber, 'rubber_foot_pad', 'rubber', [-.32, .008, s * .1], 10);
  K.tube(g, [[-.24, .4, -.13], [-.42, .62, -.13], [-.5, .8, -.13], [-.5, .8, .13], [-.42, .62, .13], [-.24, .4, .13]], .012, iron, 'pull_handle', 'metal', 30, 7); K.cyl(g, .017, .2, 'z', rubber, 'handle_grip', 'rubber', [-.5, .8, 0], 12);
  K.bx(g, -.24, .26, .44, .455, -.12, .12, iron, 'motor_deck_plate', 'metal'); for (const [x, z] of [[-.2, -.1], [-.2, .1], [.22, -.1], [.22, .1]]) K.cyl(g, .008, .01, 'y', steel, 'deck_bolt', 'metal', [x, .46, z], 6);
  // motor
  K.cyl(g, .075, .2, 'x', iron, 'electric_motor', 'metal', [-.1, .535, -.02], 22); for (let i = 0; i < 7; i++) K.torus(g, .076, .004, iron, 'motor_cooling_rib', 'metal', [-.18 + i * .027, .535, -.02], [0, PI / 2, 0], PI * 2, 5, 22).castShadow = false; K.sphere(g, .075, iron, 'motor_end_bell', 'metal', [-.2, .535, -.02], [.35, 1, 1]);
  K.bx(g, -.14, -.06, .6, .64, -.05, .01, steel, 'motor_capacitor_box', 'metal'); K.decal(g, K.tex('comp_motor_plate', 128, 64, (c, w, h) => { c.fillStyle = '#b9b3a0'; c.fillRect(0, 0, w, h); c.fillStyle = '#222'; c.font = 'bold 15px "DejaVu Sans", sans-serif'; c.textAlign = 'center'; c.fillText('1/2 H.P.  115 V', w / 2, 24); c.font = '11px "DejaVu Sans", sans-serif'; c.fillText('1725 R.P.M.  60 CY', w / 2, 44); }), .07, .035, 'motor_name_plate', [-.1, .535, .0565], null, { rough: .4 });
  // pump: crankcase, finned cylinder, head, filter, copper line to the tank
  K.bx(g, .08, .2, .455, .56, -.07, .05, iron, 'pump_crankcase', 'metal'); for (let i = 0; i < 8; i++) K.bx(g, .09, .19, .565 + i * .014, .572 + i * .014, -.06, .04, steel, 'pump_cooling_fin', 'metal'); K.bx(g, .095, .185, .677, .7, -.055, .035, iron, 'pump_head', 'metal'); for (const [x, z] of [[.105, -.045], [.175, -.045], [.105, .025], [.175, .025]]) K.cyl(g, .006, .01, 'y', steel, 'head_bolt', 'metal', [x, .703, z], 6);
  K.cyl(g, .028, .05, 'y', steel, 'air_filter_can', 'metal', [.2, .73, -.01], 14); K.tube(g, [[.1, .69, -.01], [.02, .72, -.08], [-.02, .6, -.11], [.0, .46, -.1], [.02, .43, -.06]], .006, copper, 'copper_delivery_tube', 'metal', 30, 6); for (const p of [[.1, .69, -.01], [.02, .44, -.065]]) K.cyl(g, .01, .014, 'y', brass, 'flare_nut', 'metal', p, 6);
  // belt drive under a wire guard
  K.cyl(g, .085, .018, 'z', iron, 'pump_flywheel', 'metal', [.14, .52, .085], 24); for (let i = 0; i < 5; i++) { const a2 = i / 5 * PI * 2; K.bar(g, [.14, .52, .096], [.14 + Math.cos(a2) * .075, .52 + Math.sin(a2) * .075, .096], .006, iron, 'flywheel_spoke', 'metal', 5).castShadow = false; } K.cyl(g, .03, .02, 'z', steel, 'motor_pulley', 'metal', [-.1, .535, .085], 14);
  K.tube(g, [[.14, .606, .085], [.02, .59, .085], [-.1, .566, .085], [-.131, .535, .085], [-.1, .504, .085], [.02, .47, .085], [.14, .434, .085], [.226, .52, .085]], .006, rubber, 'v_belt', 'rubber', 48, 5, true);
  for (let i = 0; i < 6; i++) K.tube(g, [[-.15, .47 + i * .025, .105], [-.0, .45 + i * .034, .112], [.24, .43 + i * .036, .105]], .0022, steel, 'belt_guard_wire', 'metal', 12, 4).castShadow = false; K.tube(g, [[-.15, .47, .105], [-.16, .535, .105], [-.15, .6, .105]], .003, steel, 'belt_guard_frame', 'metal', 8, 4);
  // manifold: pressure switch, gauge, regulator, safety valve, outlet coupler, drain
  K.bx(g, -.24, -.17, .46, .54, .04, .1, iron, 'pressure_switch_box', 'metal'); K.box(g, [.012, .03, .008], steel, 'switch_lever_auto_off', 'metal', [-.205, .555, .07], [0, 0, .4]);
  K.cyl(g, .012, .08, 'y', brass, 'manifold_riser', 'metal', [-.02, .47, -.1], 8); K.cyl(g, .036, .02, 'z', pol, 'pressure_gauge_case', 'metal', [-.02, .53, -.115], 20); K.decal(g, K.tex('comp_gauge', 128, 128, (c, w, h) => { c.clearRect(0, 0, w, h); c.fillStyle = '#f2eedf'; c.beginPath(); c.arc(64, 64, 62, 0, 7); c.fill(); c.strokeStyle = '#111'; for (let i = 0; i <= 15; i++) { const a2 = PI * .75 + i / 15 * PI * 1.5; c.lineWidth = i % 5 ? 2 : 4; c.beginPath(); c.moveTo(64 + Math.cos(a2) * 48, 64 + Math.sin(a2) * 48); c.lineTo(64 + Math.cos(a2) * 58, 64 + Math.sin(a2) * 58); c.stroke(); } c.fillStyle = '#111'; c.font = 'bold 13px sans-serif'; c.textAlign = 'center'; c.fillText('0-150 P.S.I.', 64, 96); const a3 = PI * .75 + .3 * PI * 1.5; c.lineWidth = 4; c.beginPath(); c.moveTo(64, 64); c.lineTo(64 + Math.cos(a3) * 46, 64 + Math.sin(a3) * 46); c.stroke(); }), .066, .066, 'pressure_gauge_dial', [-.02, .53, -.1255], [0, PI, 0]);
  K.cyl(g, .014, .03, 'y', dark(K), 'regulator_knob', 'rubber', [.04, .5, -.1], 10); K.cyl(g, .008, .04, 'y', brass, 'safety_valve', 'metal', [-.07, .49, -.1], 6); K.torus(g, .009, .0018, steel, 'safety_valve_pull_ring', 'metal', [-.07, .52, -.1]);
  K.cyl(g, .009, .05, 'z', brass, 'outlet_quick_coupler', 'metal', [.04, .47, -.135], 8); K.cyl(g, .007, .02, 'y', brass, 'tank_drain_cock', 'metal', [0, .14, 0], 6); K.box(g, [.02, .004, .006], brass, 'drain_cock_wing', 'metal', [0, .128, 0]);
  // power cord hung on the handle, stencil, overspray
  const cord = []; for (let i = 0; i <= 26; i++) { const t = i / 26 * PI * 2 * 3; cord.push([-.47 + Math.sin(t) * .012, .66 + Math.cos(t) * .07 - i * .001, -.14 - i * .0016]); } K.tube(g, cord, .0045, rubber, 'power_cord_coil', 'rubber', 90, 5); K.box(g, [.03, .022, .018], rubber, 'power_plug', 'rubber', [-.47, .585, -.19]); for (const s of [1, -1]) K.box(g, [.012, .002, .005], brass, 'plug_blade', 'metal', [-.47 + .02, .585 + s * .005, -.19]);
  const st = K.tex('comp_stencil', 256, 96, (c, w, h) => { c.clearRect(0, 0, w, h); c.fillStyle = 'rgba(240,232,205,.92)'; c.font = 'bold 34px "DejaVu Sans Mono", monospace'; c.textAlign = 'center'; c.fillText('P.H.F.D.', w / 2, 40); c.font = 'bold 22px "DejaVu Sans Mono", monospace'; c.fillText('ENGINE Co. 3 SHOP', w / 2, 76); });
  const sd = K.add(g, new THREE.CylinderGeometry(.1515, .1515, .34, 24, 1, true, -.55, 1.1), new THREE.MeshStandardMaterial({ map: st, transparent: true, roughness: .8, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }), 'tank_stencil_lettering', 'paint', [0, .3, 0], [PI / 2 + .25, 0, PI / 2], false); sd.rotation.set(-.15, 0, PI / 2);
  K.reseed(9); for (let i = 0; i < 14; i++) { const an = K.rr(-.9, .9), x = K.rr(-.24, .24); K.sphere(g, K.rr(.004, .011), Y, 'yellow_overspray_fleck', 'paint', [x, .3 + Math.cos(an) * .151, Math.sin(an) * .151], [1, .25, 1]).castShadow = false; }
  return done(THREE, g, K, { grip: [-.5, .8, 0], anchors: { outlet: [.04, .47, -.165], handle: [-.5, .8, 0], top: [.14, .76, 0], gauge: [-.02, .53, -.13] } });
}
const dark = K => K.std('#17181b', { roughness: .8 });

// ================================================================ THE PAINT TIN (lines 1-2): one US gallon of lemon yellow enamel, lid off, drips down the label
// Origin = floor under the middle. 0.166 across, 0.19 tall. opts.lid 'off' (lid beside it, wet side up) | 'on'; opts.stick true = the stir stick stands in it.
export function buildPaintTin(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'paint_tin';
  const tin = K.metal('steel', '#cfd3d8', .2, 1.3, { finish: 'brushed', nscale: .25, scale: .12 }), Y = yellowM(THREE, opts.paintColor), steel = K.metal('steel', '#b6bcc4', .3, 1.1, { scale: .1 }), wood = ctx.relief ? ctx.relief('wood', '#c9a26a', { size: .2 }) : K.toon('#c9a26a');
  tin.side = THREE.DoubleSide; K.lathe(g, [[0, 0], [.08, 0], [.083, .004], [.083, .186], [.0855, .19], [.078, .19], [.076, .182]], tin, 'tin_can_body', 'metal', null, null, 32); for (const y of [.004, .186]) K.torus(g, .0835, .0028, tin, 'tin_rolled_seam', 'metal', [0, y, 0], [PI / 2, 0, 0], PI * 2, 5, 32);
  const label = K.tex('tin_label', 1024, 256, (c, w, h) => { c.fillStyle = '#f4efe0'; c.fillRect(0, 0, w, h); c.fillStyle = '#1f3f7a'; c.fillRect(0, 0, w, 36); c.fillRect(0, h - 30, w, 30);
    for (const x0 of [0, 512]) { c.fillStyle = PAINT.yellow; c.beginPath(); c.arc(x0 + 96, 130, 62, 0, 7); c.fill(); c.strokeStyle = '#1f3f7a'; c.lineWidth = 5; c.stroke(); for (let i = 0; i < 12; i++) { const a2 = i / 12 * PI * 2; c.beginPath(); c.moveTo(x0 + 96 + Math.cos(a2) * 70, 130 + Math.sin(a2) * 70); c.lineTo(x0 + 96 + Math.cos(a2) * 86, 130 + Math.sin(a2) * 86); c.stroke(); }
      handText(c, 'SUNBEAM', x0 + 330, 84, 60, { fill: '#1f3f7a', seed: 3 + x0 }); handText(c, 'ENAMEL', x0 + 330, 136, 40, { fill: '#1f3f7a', seed: 4 + x0 }); c.fillStyle = '#111'; c.font = 'bold 30px "DejaVu Sans", sans-serif'; c.textAlign = 'center'; c.fillText('LEMON YELLOW No. 12', x0 + 320, 186); c.font = '17px "DejaVu Sans", sans-serif'; c.fillText('ONE U.S. GALLON · HIGH GLOSS · FOR METAL', x0 + 300, 212); }
    c.fillStyle = '#f4efe0'; c.font = 'bold 20px "DejaVu Sans", sans-serif'; c.textAlign = 'center'; for (const x0 of [256, 768]) { c.fillText('STIR WELL · KEEP FROM FLAME', x0, 25); c.fillText('MADE IN U.S.A.', x0, h - 9); } c.fillStyle = 'rgba(90,70,40,.10)'; for (let i = 0; i < 60; i++) c.fillRect(Math.random() * w, Math.random() * h, 40, 14); });
  K.add(g, new THREE.CylinderGeometry(.0836, .0836, .15, 40, 1, true), new THREE.MeshStandardMaterial({ map: label, roughness: .6 }), 'tin_paper_label', 'paper', [0, .095, 0]);
  K.add(g, new THREE.CircleGeometry(.0765, 32), Y, 'paint_surface_yellow', 'paint', [0, .15, 0], [-PI / 2, 0, 0], false); K.torus(g, .08, .0045, Y, 'yellow_in_the_rim_groove', 'paint', [0, .1895, 0], [PI / 2, 0, 0], PI * 2, 5, 32);
  K.reseed(13); for (let i = 0; i < 7; i++) { const an = i * .9 + K.rr(0, .4), L = .04 + K.rr(0, .12), r = .0842; K.tube(g, [[Math.cos(an) * r, .19, Math.sin(an) * r], [Math.cos(an + .02) * r, .19 - L * .5, Math.sin(an + .02) * r], [Math.cos(an - .01) * r, .19 - L, Math.sin(an - .01) * r]], .0036 + K.rr(0, .002), Y, 'yellow_drip_run', 'paint', 10, 5); K.sphere(g, .0062, Y, 'yellow_drip_bead', 'paint', [Math.cos(an - .01) * r, .19 - L, Math.sin(an - .01) * r], [1, 1.3, 1]); }
  for (const s of [1, -1]) { K.cyl(g, .009, .006, 'x', steel, 'bail_ear', 'metal', [s * .086, .15, 0], 10); } K.torus(g, .087, .0022, steel, 'wire_bail_handle', 'metal', [0, .15, 0], [-.5, 0, 0], PI, 5, 30).rotation.set(1.15, 0, 0);
  K.add(g, new THREE.CircleGeometry(.14, 26), Y, 'yellow_puddle_ring', 'paint', [.03, .0015, .02], [-PI / 2, 0, 0], false).scale.set(1, .7, 1);
  if (opts.stick !== false) { K.box(g, [.028, .32, .006], wood, 'stir_stick', 'wood', [.02, .2, .01], [.12, .4, -.22]); K.box(g, [.03, .1, .0075], Y, 'stir_stick_dipped_end', 'paint', [.045, .1, .02], [.12, .4, -.22]); }
  const lid = new THREE.Group(); lid.name = 'tin_lid'; g.add(lid); K.cyl(lid, .078, .008, 'y', tin, 'lid_disc', 'metal', null, 30); K.torus(lid, .074, .004, tin, 'lid_bead', 'metal', [0, .004, 0], [PI / 2, 0, 0], PI * 2, 5, 30); K.add(lid, new THREE.CircleGeometry(.068, 26), Y, 'lid_wet_underside', 'paint', [0, .0046, 0], [-PI / 2, 0, 0], false);
  K.box(lid, [.16, .006, .012], steel, 'lid_prying_screwdriver_blade', 'metal', [.11, .006, .03], [0, .4, 0]); K.cyl(lid, .013, .09, 'x', K.std('#2a4a7a', { roughness: .5 }), 'screwdriver_handle', 'wood', [.2, .014, -.01], 10).rotation.set(0, .4, PI / 2);
  const setLid = st => { if (st === 'on') { lid.position.set(0, .19, 0); lid.rotation.set(PI, 0, 0); } else { lid.position.set(.2, .004, .1); lid.rotation.set(0, .5, 0); } }; setLid(opts.lid || 'off');
  return done(THREE, g, K, { grip: [0, .32, 0], anchors: { rim: [0, .19, 0], surface: [0, .15, 0], handle: [0, .24, 0] }, setLid });
}

// ================================================================ THE AIR HOSE on the floor between two points (group-local metres, Y up): lazy S with one loop, lies ON the ground
// buildAirHose(THREE, ctx, { from: [x, y, z], to: [x, y, z], loops: 1 })   from / to in the caller's three.js coordinates (use ctx.B2T(plan).toArray())
export function buildAirHose(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'air_hose';
  const A = new THREE.Vector3(...(opts.from || [0, .47, 0])), B = new THREE.Vector3(...(opts.to || [2, .0, 0])), d = B.clone().sub(A), side = new THREE.Vector3(-d.z, 0, d.x).normalize(), r = .0085, pts = [A.toArray()];
  const P = (t, off, y) => { const p = A.clone().addScaledVector(d, t).addScaledVector(side, off); p.y = y; return p.toArray(); };
  pts.push(P(.04, .02, Math.max(r, A.y * .5)), P(.1, .12, r), P(.3, .32, r), P(.45, .1, r)); if (opts.loops !== 0) pts.push(P(.52, -.22, r), P(.42, -.34, r), P(.38, -.12, r * 3), P(.55, .05, r));
  pts.push(P(.72, -.2, r), P(.9, -.06, r), P(.97, .0, Math.max(r, B.y * .5)), B.toArray());
  K.tube(g, pts, r, K.std('#26262a', { roughness: .65 }), 'air_hose', 'rubber', 120, 7); for (const p of [A, B]) K.sphere(g, .012, K.metal('brass', '#dcae52', .25, 1.3, { scale: .1 }), 'hose_end_coupler', 'metal', p.toArray());
  return done(THREE, g, K, { anchors: { from: A, to: B } });
}
export const BUILDERS = { buildSprayGun, buildCompressor, buildPaintTin, buildAirHose };

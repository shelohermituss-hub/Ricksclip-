// hero_truck.js: THE HERO OBJECT of "Why Fire Trucks Turned Yellow" (props-hero 2026-11-20).
// A 1970s American cab-forward pumper, "ENGINE Co. 3" of the (fictional) town PINE HOLLOW, built from real parts. ONE model, paint by parameter.
//   import * as HT from './hero_truck.js';
//   const truck = HT.buildTruck(THREE, ctx, { paint: 'red' | 'yellow' | 'half', edge: 0.3, masking: true|false, wear: .35, lettering: true, town: 'PINE HOLLOW', engine: 3 });
//   HT.place(THREE, scene, ctx, truck, [x, y, 0], yawDeg)     -> truck.plan.<anchor> in plan metres (Z up)
//   every frame (or once when the truck never moves): truck.update()                  (keeps the paint edge in the truck's own space)
//   truck.setPaint({ mode, edge, soft, drain, a, b })   mode red | yellow | half; edge = truck X of the sprayed edge (front of it colour a, behind it colour b);
//                                                       drain 0..1 = dusk: the paint loses its red the way a dim-adapted eye does (red goes dark grey, lemon stays light)
//   truck.setMasking(bool) · truck.setWheels(metresRolled) · truck.setSteer(deg) · truck.setBeacon(on, angleRad) · truck.setDoor(deg)   (driver's door on its hinges)
// LOCAL METRES, Y UP. FRONT = -X, DRIVER'S SIDE (pump panel, hard suction hoses) = +Z toward the lens, OFFICER'S SIDE (ladder) = -Z. Ground = y 0.
// Real size: 8.02 m long (bumper to tailboard), 2.4 m body (2.6 over mirrors and hoses), 2.89 m to the top of the beacon.
import { kit, args, done, place as placeProp, handText } from './prop_kit.js';
export const place = placeProp;
export const PAINT = { red: '#c4141a', yellow: '#e2e31c', roof: '#f3efe2', gold: '#e8b93c', vinyl: '#5a1f1c', hose: '#d9cfae', hoseOld: '#c2aa74', tape: '#d8c79a', kraft: '#b08a5a' };
export const TRUCK = { length: 8.02, width: 2.4, height: 2.89, wheelR: .52, frontAxleX: -2.75, rearAxleX: 1.9, town: 'PINE HOLLOW' };
const WR = .52, PI = Math.PI;

function normalFromHeight(THREE, K, key, N, draw, strength = 2, repeat) {       // a canvas height picture -> a normal map (for tread plate, tyre tread)
  return K.tex(key, N, N, (c, w, h) => { draw(c, w, h); const im = c.getImageData(0, 0, w, h), d = im.data, H = new Float32Array(w * h); for (let i = 0; i < w * h; i++) H[i] = d[i * 4] / 255;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x, dx = (H[y * w + (x + 1) % w] - H[y * w + (x + w - 1) % w]) * strength, dy = (H[((y + 1) % h) * w + x] - H[((y + h - 1) % h) * w + x]) * strength, l = Math.hypot(dx, dy, 1);
      d[i * 4] = 255 * (-dx / l * .5 + .5); d[i * 4 + 1] = 255 * (dy / l * .5 + .5); d[i * 4 + 2] = 255 * (1 / l * .5 + .5); d[i * 4 + 3] = 255; } c.putImageData(im, 0, 0); }, { data: true, repeat: repeat || [1, 1] });
}
const goldFill = (c, px) => { const g = c.createLinearGradient(0, -px * .5, 0, px * .5); g.addColorStop(0, '#fff2a8'); g.addColorStop(.35, '#f3c94a'); g.addColorStop(.62, '#c08a22'); g.addColorStop(.8, '#f0cf6a'); g.addColorStop(1, '#a8741c'); return g; };
const gold = (c, s, x, y, px, o = {}) => handText(c, s, x, y, px, { fill: goldFill(c, px), outline: '#2a1608', lw: px * .1, shade: 'rgba(10,6,4,.85)', ...o });

export function buildTruck(THREE, a, b) {
  const [ctx, opts] = args(a, b), K = kit(THREE, ctx), g = new THREE.Group(); g.name = 'fire_truck_engine3';
  const town = opts.town || TRUCK.town, eng = opts.engine ?? 3, wear = opts.wear ?? .35;
  // ------------------------------------------------------------------ materials
  const U = { uTruckInv: { value: new THREE.Matrix4() }, uColA: { value: new THREE.Color(PAINT.red) }, uColB: { value: new THREE.Color(PAINT.red) }, uEdge: { value: 0 }, uSoft: { value: .32 }, uDrain: { value: 0 } };
  const paintMat = (seed = 11) => { const m = K.pb ? K.pb.metal('wet', { color: '#ffffff', rough: .2, finish: 'smooth', nscale: .06, coat: 1, coatRough: .05, env: .85, toon: PAINT.red, scale: 1.3, seed }) : K.toon('#ffffff');
    if (m.color) m.color.set('#ffffff');
    m.onBeforeCompile = sh => { Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform mat4 uTruckInv;\nvarying vec3 vTP;').replace('#include <project_vertex>', '#include <project_vertex>\nvTP = (uTruckInv * modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uColA; uniform vec3 uColB; uniform float uEdge; uniform float uSoft; uniform float uDrain;\nvarying vec3 vTP;')
        .replace('#include <map_fragment>', `#include <map_fragment>
        { float hs = fract(sin(dot(floor(vTP * 260.0), vec3(12.9898, 78.233, 37.719))) * 43758.5453);                    // spray speckle, 4 mm droplets
          float wob = sin(vTP.y * 6.3 + vTP.z * 4.1) * .16 + sin(vTP.y * 17.0 - vTP.z * 9.0) * .06;                        // the hand does not hold a straight line
          float k = smoothstep(0.0, 1.0, (vTP.x - uEdge) / max(uSoft, 1e-3) * .5 + .5 + (hs - .5) * .55 + wob);
          vec3 pc = mix(uColA, uColB, k);
          float night = dot(pc, vec3(.02, .82, .16));                                                                       // what a dim-adapted eye keeps: almost no red
          pc = mix(pc, vec3(night * .9, night * .95, night * 1.05), clamp(uDrain, 0.0, 1.0));
          diffuseColor.rgb *= pc; }`); };
    m.customProgramCacheKey = () => 'truck_paint_v1'; m.userData.truckPaint = true; return m; };
  const paint = paintMat(11), paintB = paintMat(23);
  const roofW = K.metal('wet', PAINT.roof, .22, .8, { finish: 'smooth', nscale: .06, coat: 1, coatRough: .06, scale: 1.3 });
  const chrome = K.metal('steel', '#eef2f7', .05, 1.6, { finish: 'smooth', nscale: .03, scale: .5 }), chromeB = K.metal('steel', '#dfe5ec', .16, 1.35, { finish: 'brushed', nscale: .25, scale: .4 });
  const stainless = K.metal('steel', '#c9ced6', .3, 1.1, { finish: 'brushed', nscale: .5, scale: .5 }), alu = K.metal('steel', '#b9bfc6', .34, 1.05, { finish: 'brushed', nscale: .35, scale: .5 });
  const brass = K.metal('brass', '#e2b24e', .14, 1.5, { finish: 'smooth', nscale: .08, scale: .3 }), brassOld = K.metal('brass', '#c79a45', .32, 1.2, { scale: .2 });
  const iron = K.metal('iron', '#3a3d44', .5, .7, { rust: .08, scale: .5 }), ironRust = K.metal('iron', '#4a4038', .6, .6, { rust: .35, scale: .4 });
  const glass = K.metal('wet', '#24323c', .04, 1.3, { finish: 'smooth', nscale: .02, coat: 1, coatRough: .02 }); glass.transparent = true; glass.opacity = .5; glass.depthWrite = false;
  const mirrorM = K.metal('steel', '#f4f7fb', .02, 1.9, { finish: 'smooth', nscale: .0, scale: .5 });
  const rubber = K.std('#19191b', { roughness: .88 }), rubberHose = K.std('#222226', { roughness: .7 }), dark = K.std('#16171a', { roughness: .95 }), vinyl = new THREE.MeshPhysicalMaterial({ color: PAINT.vinyl, roughness: .45, clearcoat: .4, clearcoatRoughness: .4 });
  const wood = ctx.relief ? ctx.relief('wood', '#b98a4e', { size: .5 }) : K.toon('#b98a4e'), rope = K.std('#cdb98a', { roughness: 1 }), leather = K.std('#4a2e1c', { roughness: .7 });
  const lensW = new THREE.MeshPhysicalMaterial({ color: '#fbf6e2', roughness: .1, clearcoat: 1, emissive: '#fff1c8', emissiveIntensity: .25 }), lensAmber = new THREE.MeshPhysicalMaterial({ color: '#f39a1c', roughness: .15, clearcoat: 1, emissive: '#f08a10', emissiveIntensity: .25 });
  const lensRed = new THREE.MeshPhysicalMaterial({ color: '#d81a14', roughness: .12, clearcoat: 1, transparent: true, opacity: .86, emissive: '#e01208', emissiveIntensity: .35 });
  const treadN = normalFromHeight(THREE, K, 'tread_plate_n', 256, (c, w, h) => { c.fillStyle = '#404040'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff';
    for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) { c.save(); c.translate(i * 32 + 16, j * 32 + 16); c.rotate(((i + j) % 2 ? 1 : -1) * PI / 4); c.beginPath(); c.ellipse(0, 0, 13, 3.6, 0, 0, 7); c.fill(); c.restore(); } }, 3);
  const tread = K.metal('steel', '#c4cad1', .26, 1.25, { finish: 'smooth', nscale: .1, scale: .22, seed: 5 }); if (K.pb) { tread.normalMap = treadN; treadN.wrapS = treadN.wrapT = THREE.RepeatWrapping; tread.normalScale = new THREE.Vector2(1.1, 1.1); }
  const tyreMap = K.tex('tyre_map', 256, 256, (c, w, h) => { c.fillStyle = '#1d1d20'; c.fillRect(0, 0, w, h); c.fillStyle = '#0c0c0e'; for (let i = 0; i < 4; i++) { const x = i * 64; c.fillRect(x, 78, 10, 100); c.fillRect(x + 32, 60, 10, 50); c.fillRect(x + 32, 146, 10, 50); } c.fillRect(0, 124, w, 8);
    c.strokeStyle = '#2c2c30'; c.lineWidth = 3; for (const y of [22, 40, 216, 234]) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } c.fillStyle = 'rgba(150,135,110,.16)'; for (let i = 0; i < 500; i++) c.fillRect(Math.random() * w, Math.random() * h, 2, 2); }, { repeat: [9, 1] });
  const tyreM = new THREE.MeshStandardMaterial({ map: tyreMap, roughness: .9, bumpMap: tyreMap, bumpScale: 2.5 });
  const weave = (key, base) => K.tex(key, 128, 64, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 4) for (let x = 0; x < w; x += 4) { c.fillStyle = ((x + y) / 4) % 2 ? 'rgba(255,255,255,.10)' : 'rgba(60,40,10,.14)'; c.fillRect(x, y, 4, 4); }
    c.fillStyle = 'rgba(40,60,120,.55)'; c.fillRect(0, 28, w, 3); c.fillStyle = 'rgba(70,50,20,.10)'; for (let i = 0; i < 60; i++) c.fillRect(Math.random() * w, Math.random() * h, 6 + Math.random() * 10, 2); c.fillStyle = 'rgba(40,30,10,.22)'; c.fillRect(0, 0, w, 3); c.fillRect(0, h - 3, w, 3); }, { repeat: [30, 1] });
  const hoseM = new THREE.MeshStandardMaterial({ map: weave('hose_weave_a', PAINT.hose), roughness: .95 }), hoseM2 = new THREE.MeshStandardMaterial({ map: weave('hose_weave_b', PAINT.hoseOld), roughness: .95 });
  const S = [1, -1], zrot = s => s > 0 ? null : [0, PI, 0];

  // ------------------------------------------------------------------ 1. CHASSIS: frame rails, cross members, springs, axles, drive line, tank, exhaust
  const ch = new THREE.Group(); ch.name = 'chassis'; g.add(ch);
  for (const s of S) { K.bx(ch, -3.86, 3.92, .62, .82, s * .39, s * .47, iron, 'frame_rail', 'metal');
    for (const [ax, nm] of [[TRUCK.frontAxleX, 'front'], [TRUCK.rearAxleX, 'rear']]) { for (let i = 0; i < 4; i++) K.bx(ch, ax - .62 + i * .09, ax + .62 - i * .09, .585 - i * .022, .605 - i * .022, s * .52, s * .60, iron, 'leaf_spring_' + nm, 'metal');
      K.cyl(ch, .028, .12, 'z', iron, 'spring_shackle_pin', 'metal', [ax - .62, .6, s * .56]); K.cyl(ch, .028, .12, 'z', iron, 'spring_shackle_pin', 'metal', [ax + .62, .6, s * .56]); K.bx(ch, ax - .05, ax + .05, .48, .62, s * .5, s * .62, iron, 'spring_u_bolt_plate', 'metal'); } }
  for (const x of [-3.6, -1.9, -.4, 1.0, 2.9, 3.8]) K.bx(ch, x - .04, x + .04, .64, .78, -.39, .39, iron, 'frame_cross_member', 'metal');
  K.cyl(ch, .055, 2.1, 'z', iron, 'front_axle_beam', 'metal', [TRUCK.frontAxleX, WR, 0], 12); K.bar(ch, [TRUCK.frontAxleX + .2, .45, -.86], [TRUCK.frontAxleX + .2, .45, .86], .018, iron, 'steering_tie_rod');
  K.cyl(ch, .075, 2.0, 'z', iron, 'rear_axle_housing', 'metal', [TRUCK.rearAxleX, WR, 0], 14); K.sphere(ch, .21, iron, 'differential', 'metal', [TRUCK.rearAxleX, WR, 0], [1, 1, .85]);
  K.bar(ch, [-.9, .62, 0], [TRUCK.rearAxleX - .2, WR + .02, 0], .045, iron, 'drive_shaft', 'metal', 12); K.sphere(ch, .07, iron, 'universal_joint', 'metal', [-.9, .62, 0]); K.sphere(ch, .07, iron, 'universal_joint', 'metal', [TRUCK.rearAxleX - .2, WR + .02, 0]);
  K.bx(ch, -3.3, -2.0, .5, 1.1, -.36, .36, dark, 'engine_block', 'metal'); K.cyl(ch, .2, .34, 'x', iron, 'gearbox', 'metal', [-1.7, .64, 0]);
  K.cyl(ch, .2, 1.0, 'x', alu, 'fuel_tank', 'metal', [-.2, .44, -.72], 20); for (const x of [-.55, .15]) K.torus(ch, .203, .012, iron, 'fuel_tank_strap', 'metal', [x, .44, -.72], [0, PI / 2, 0]); K.cyl(ch, .035, .05, 'y', chrome, 'fuel_cap', 'metal', [-.5, .65, -.74]);
  K.tube(ch, [[-2.2, .5, .3], [-1.6, .42, .62], [.2, .4, .66], [1.0, .4, .7], [1.18, .36, 1.0], [1.2, .34, 1.16]], .042, ironRust, 'exhaust_pipe', 'metal', 30, 8); K.cyl(ch, .1, .7, 'x', ironRust, 'muffler', 'metal', [-.4, .41, .65], 14); K.cyl(ch, .05, .06, 'z', chrome, 'exhaust_tip', 'metal', [1.2, .34, 1.17], 12);
  K.bx(ch, -3.36, -2.14, .62, 1.12, -.82, .82, dark, 'front_wheel_well', 'metal'); K.bx(ch, -.8, 3.6, .78, 1.42, -.84, .84, dark, 'water_tank_500_gal', 'metal');
  for (const s of S) { K.bx(ch, 2.62, 2.66, .16, .78, s * .62, s * 1.16, rubber, 'mud_flap', 'rubber'); }

  // ------------------------------------------------------------------ 2. WHEELS on their axles (front single, rear dual), spin groups
  const spins = [], steerG = [];
  const wheel = (x, z, s, kind) => { const hold = new THREE.Group(); hold.position.set(x, WR, z); hold.rotation.y = s > 0 ? 0 : PI; hold.name = 'wheel_' + kind; g.add(hold); const w = new THREE.Group(); hold.add(w); spins.push([w, s]);
    K.lathe(w, [[.3, -.125], [.35, -.14], [.46, -.14], [.505, -.115], [.52, -.07], [.52, .07], [.505, .115], [.46, .14], [.35, .14], [.3, .125]], tyreM, 'tyre', 'rubber', null, [PI / 2, 0, 0], 40);
    for (let i = 0; i < 28; i++) { const a = i / 28 * PI * 2, o = K.box(w, [.055, .02, .1], rubber, 'tyre_tread_lug', 'rubber', [Math.cos(a) * .522, Math.sin(a) * .522, (i % 2 ? .06 : -.06)], [0, 0, a + PI / 2]); o.castShadow = false; }
    K.cyl(w, .305, .23, 'z', iron, 'rim_barrel', 'metal', null, 28, .305, true); const dz = kind === 'rear_outer' ? -.05 : kind === 'rear_inner' ? .02 : .07;
    K.cyl(w, .3, .03, 'z', paintB, 'rim_disc', 'metal', [0, 0, dz], 28); K.torus(w, .3, .014, kind === 'front' ? chrome : paintB, 'rim_lip', 'metal', [0, 0, .12]);
    for (let i = 0; i < 5; i++) { const a = i / 5 * PI * 2 + .3; K.cyl(w, .042, .034, 'z', dark, 'rim_hand_hole', 'metal', [Math.cos(a) * .225, Math.sin(a) * .225, dz], 12); }
    if (kind === 'front') { K.cyl(w, .105, .09, 'z', chrome, 'hub', 'metal', [0, 0, dz + .05], 20); K.sphere(w, .1, chrome, 'hub_cap', 'metal', [0, 0, dz + .09], [1, 1, .55]); }
    else { K.cyl(w, .125, .2, 'z', paintB, 'rear_axle_hub', 'metal', [0, 0, dz + .1], 20); K.cyl(w, .085, .03, 'z', chrome, 'axle_flange', 'metal', [0, 0, dz + .21], 16); for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2; K.cyl(w, .011, .016, 'z', iron, 'axle_flange_bolt', 'metal', [Math.cos(a) * .065, Math.sin(a) * .065, dz + .228], 6); } }
    if (kind !== 'rear_inner') for (let i = 0; i < 10; i++) { const a = i / 10 * PI * 2; K.cyl(w, .017, .035, 'z', chrome, 'lug_nut', 'metal', [Math.cos(a) * .165, Math.sin(a) * .165, dz + .03], 6); }
    K.bar(w, [.27, 0, dz + .01], [.3, 0, dz + .05], .006, brass, 'valve_stem', 'metal', 6); return hold; };
  for (const s of S) { steerG.push(wheel(TRUCK.frontAxleX, s * 1.03, s, 'front')); wheel(TRUCK.rearAxleX, s * 1.03, s, 'rear_outer'); wheel(TRUCK.rearAxleX, s * .73, s, 'rear_inner'); }

  // ------------------------------------------------------------------ 3. CAB (cab-forward): lower body, skirts, pillars, glass, white roof, doors on hinges
  const cab = new THREE.Group(); cab.name = 'cab'; g.add(cab);
  K.slab(cab, -3.8, -1.9, -1.18, 1.18, 1.12, 1.86, [.2, .04], paint, 'cab_lower_body', 'metal', .012);
  K.slab(cab, -3.8, -3.36, -1.18, 1.18, .62, 1.14, [.2, .02], paint, 'cab_front_panel', 'metal', .01); K.slab(cab, -2.14, -1.9, -1.18, 1.18, .62, 1.14, [.02, .04], paint, 'cab_rear_skirt', 'metal', .01);
  K.slab(cab, -3.74, -1.96, -1.13, 1.13, 1.86, 2.45, [.18, .03], glass, 'cab_glass', 'glass').castShadow = false;
  K.slab(cab, -3.86, -1.84, -1.21, 1.21, 2.44, 2.59, [.24, .08], roofW, 'cab_roof_white', 'metal', .045); K.slab(cab, -3.83, -1.87, -1.2, 1.2, 2.425, 2.445, [.22, .06], chrome, 'roof_drip_rail', 'metal');
  K.bx(cab, -2.02, -1.9, 1.86, 2.44, -1.16, 1.16, paint, 'cab_rear_wall', 'metal'); K.bx(cab, -2.035, -2.02, 1.98, 2.34, -.5, .5, glass, 'cab_rear_window', 'glass');
  K.bx(cab, -3.72, -2.02, 1.38, 1.42, -1.1, 1.1, dark, 'cab_floor', 'metal');
  for (const s of S) { K.bar(cab, [-3.68, 1.86, s * 1.045], [-3.66, 2.44, s * 1.03], .05, paint, 'a_pillar', 'metal', 10); K.bx(cab, -2.26, -2.16, 1.86, 2.44, s * 1.11, s * 1.165, paint, 'b_pillar', 'metal');
    K.torus(cab, .61, .035, rubber, 'front_wheel_arch_lip', 'rubber', [TRUCK.frontAxleX, WR, s * 1.175], null, PI, 8, 24);
    K.bx(cab, -3.6, -1.92, 1.862, 1.892, s * 1.18, s * 1.195, chrome, 'belt_moulding', 'metal'); K.bx(cab, -3.3, -2.25, 2.4, 2.425, s * 1.13, s * 1.15, chrome, 'side_window_frame_top', 'metal');
    K.bx(cab, -2.74, -2.71, 1.89, 2.42, s * 1.125, s * 1.15, chrome, 'vent_window_post', 'metal');
    K.bx(cab, -2.12, -1.92, .7, .74, s * 1.18, s * 1.34, tread, 'cab_step', 'metal'); K.bar(cab, [-2.06, 1.25, s * 1.25], [-2.06, 2.3, s * 1.25], .017, chrome, 'cab_grab_rail', 'metal', 10); for (const y of [1.25, 2.3]) K.bar(cab, [-2.06, y, s * 1.17], [-2.06, y, s * 1.25], .014, chrome, 'grab_rail_standoff', 'metal', 8);
    // west-coast mirror on a chrome tube frame
    K.tube(cab, [[-3.34, 1.78, s * 1.18], [-3.4, 1.82, s * 1.42], [-3.4, 2.3, s * 1.42], [-3.34, 2.36, s * 1.16]], .012, chrome, 'mirror_arm', 'metal', 24, 6); K.bx(cab, -3.425, -3.39, 1.86, 2.26, s * 1.34, s * 1.5, chrome, 'mirror_head', 'metal'); K.bx(cab, -3.39, -3.386, 1.875, 2.245, s * 1.35, s * 1.49, mirrorM, 'mirror_glass', 'glass'); }
  K.bx(cab, -3.765, -3.74, 1.86, 2.44, -.02, .02, chrome, 'windscreen_centre_post', 'metal');
  for (const s of S) { K.bar(cab, [-3.775, 1.9, s * .5], [-3.79, 2.22, s * .2], .008, dark, 'wiper_arm', 'metal', 6); K.bar(cab, [-3.795, 2.0, s * .2], [-3.795, 2.36, s * .2], .012, rubber, 'wiper_blade', 'rubber', 6); K.cyl(cab, .02, .03, 'x', chrome, 'wiper_pivot', 'metal', [-3.78, 1.9, s * .5], 8); }
  // the driver's door: a real leaf on two hinges (hinge line at its front edge), opens with setDoor
  const doors = [];
  for (const s of S) { const dg = new THREE.Group(); dg.name = 'cab_door_' + (s > 0 ? 'driver' : 'officer'); dg.position.set(-3.3, 0, s * 1.18); cab.add(dg); doors.push([dg, s]);
    K.bx(dg, .0, 1.06, 1.15, 1.86, s * .002, s * .014, paint, 'door_skin', 'metal'); K.bx(dg, -.008, .004, 1.15, 1.86, 0, s * .016, dark, 'door_seam_front', 'metal'); K.bx(dg, 1.056, 1.068, 1.15, 1.86, 0, s * .016, dark, 'door_seam_rear', 'metal'); K.bx(dg, 0, 1.06, 1.14, 1.152, 0, s * .016, dark, 'door_seam_sill', 'metal');
    for (const y of [1.3, 1.72]) K.cyl(dg, .016, .09, 'y', chrome, 'door_hinge', 'metal', [.0, y, s * .022], 10);
    K.bx(dg, .86, 1.0, 1.6, 1.64, s * .014, s * .03, chrome, 'door_handle_plate', 'metal'); K.bar(dg, [.87, 1.62, s * .05], [.99, 1.62, s * .05], .011, chrome, 'door_handle', 'metal', 8); K.cyl(dg, .012, .012, 'z', brass, 'door_key_lock', 'metal', [.93, 1.54, s * .02], 10); }
  // inside: padded bench seat, steering wheel on its column, dash with dials, gear lever, radio handset
  K.slab(cab, -2.78, -2.16, -.98, .98, 1.42, 1.6, .06, vinyl, 'bench_seat_cushion', 'cloth', .03); K.slab(cab, -2.26, -2.06, -.98, .98, 1.58, 2.18, .05, vinyl, 'bench_seat_back', 'cloth', .03);
  for (let i = -5; i <= 5; i++) { K.bx(cab, -2.77, -2.2, 1.6, 1.606, i * .17 - .004, i * .17 + .004, dark, 'seat_piping', 'cloth'); K.bx(cab, -2.266, -2.26, 1.62, 2.14, i * .17 - .004, i * .17 + .004, dark, 'seat_back_piping', 'cloth'); }
  K.bx(cab, -3.66, -3.42, 1.72, 1.9, -1.08, 1.08, dark, 'dashboard', 'metal'); for (let i = 0; i < 4; i++) K.cyl(cab, .04, .01, 'x', chrome, 'dash_dial', 'metal', [-3.415, 1.82, .34 + i * .13], 14);
  K.bar(cab, [-3.5, 1.72, .56], [-3.12, 1.98, .56], .02, dark, 'steering_column', 'metal', 8); { const sw = K.torus(cab, .23, .017, dark, 'steering_wheel', 'rubber', [-3.1, 1.99, .56], null, PI * 2, 8, 30); sw.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(.38, .26, 0).normalize());
    for (let i = 0; i < 3; i++) { const a = i / 3 * PI * 2 + PI / 2; K.bar(sw, [0, 0, 0], [Math.cos(a) * .22, Math.sin(a) * .22, 0], .011, chrome, 'steering_spoke', 'metal', 6).castShadow = false; } K.sphere(sw, .035, chrome, 'horn_button', 'metal', [0, 0, 0], [1, 1, .5]); }
  K.bar(cab, [-2.95, 1.42, 0], [-3.05, 1.82, .05], .012, chrome, 'gear_lever', 'metal', 6); K.sphere(cab, .03, dark, 'gear_knob', 'rubber', [-3.05, 1.83, .05]);
  K.bx(cab, -3.45, -3.4, 1.74, 1.82, -.2, -.02, dark, 'two_way_radio', 'metal'); K.bx(cab, -3.4, -3.37, 1.75, 1.83, -.3, -.25, dark, 'radio_handset', 'rubber'); K.tube(cab, [[-3.4, 1.75, -.27], [-3.33, 1.66, -.2], [-3.36, 1.6, -.12], [-3.41, 1.72, -.08]], .006, dark, 'radio_coil_cord', 'rubber', 20, 5);

  // ------------------------------------------------------------------ 4. FRONT FACE: chrome bumper, grille, twin round headlights, bell, warning lights, plate
  const fr = new THREE.Group(); fr.name = 'front_face'; g.add(fr);
  K.slab(fr, -4.02, -3.83, -1.23, 1.23, .5, .74, [.09, .02], chrome, 'front_bumper_chrome', 'metal', .03);
  for (const s of S) { K.bx(fr, -3.9, -3.5, .58, .66, s * .4, s * .46, iron, 'bumper_bracket', 'metal'); K.torus(fr, .05, .014, iron, 'tow_eye', 'metal', [-4.04, .6, s * .5], [0, PI / 2, 0]);
    K.slab(fr, -3.825, -3.795, s * .52, s * 1.0, .8, 1.06, .01, chrome, 'headlight_panel', 'metal', .006);
    for (const z of [.65, .87]) { K.torus(fr, .088, .016, chrome, 'headlight_bezel', 'metal', [-3.83, .93, s * z], [0, PI / 2, 0]); K.sphere(fr, .082, lensW, 'headlight_lens', 'glass', [-3.815, .93, s * z], [.35, 1, 1]); K.sphere(fr, .02, mirrorM, 'headlight_bulb', 'metal', [-3.845, .93, s * z]); }
    K.cyl(fr, .05, .03, 'x', chrome, 'turn_signal_bezel', 'metal', [-3.805, 1.26, s * .98], 16); K.sphere(fr, .043, lensAmber, 'turn_signal_lens', 'glass', [-3.82, 1.26, s * .98], [.5, 1, 1]);
    K.cyl(fr, .085, .05, 'x', chrome, 'warning_light_bezel', 'metal', [-3.81, 1.66, s * .86], 20); K.sphere(fr, .075, lensRed, 'warning_light_red', 'glass', [-3.835, 1.66, s * .86], [.5, 1, 1]); }
  K.bx(fr, -3.815, -3.8, .68, 1.1, -.42, .42, dark, 'grille_backing', 'metal'); K.slab(fr, -3.84, -3.8, -.44, .44, .66, 1.12, .03, chrome, 'grille_frame', 'metal');
  K.bx(fr, -3.846, -3.838, .7, 1.08, -.4, .4, dark, 'grille_opening', 'metal'); for (let i = -6; i <= 6; i++) K.bx(fr, -3.862, -3.842, .7, 1.08, i * .062 - .012, i * .062 + .012, chrome, 'grille_bar', 'metal'); K.bx(fr, -3.868, -3.845, .875, .905, -.4, .4, chrome, 'grille_cross_bar', 'metal');
  // the bell on its yoke, front centre, with clapper and pull cord
  { const bg = new THREE.Group(); bg.name = 'bell'; bg.position.set(-3.98, 1.56, 0); fr.add(bg);
    K.lathe(bg, [[0, 0], [.03, 0], [.045, -.02], [.07, -.05], [.085, -.12], [.1, -.2], [.13, -.25], [.14, -.27], [.132, -.275], [.092, -.2], [.075, -.12], [.06, -.055], [0, -.03]], brass, 'bell_bronze', 'metal', null, null, 36);
    K.cyl(bg, .016, .05, 'y', brass, 'bell_crown_nut', 'metal', [0, .02, 0], 8); K.bar(bg, [0, -.05, 0], [0, -.22, .02], .008, iron, 'bell_clapper_rod', 'metal', 6); K.sphere(bg, .028, iron, 'bell_clapper', 'metal', [0, -.23, .02]);
    K.tube(bg, [[.15, -.3, -.17], [.02, -.28, -.17], [.0, .0, -.17], [0, .06, 0], [.0, .0, .17], [.02, -.28, .17], [.15, -.3, .17]], .014, chrome, 'bell_yoke', 'metal', 40, 8); K.cyl(bg, .012, .36, 'z', chrome, 'bell_pivot_pin', 'metal', [0, .0, 0], 8);
    K.tube(bg, [[0, -.23, .02], [.02, -.34, .05], [.05, -.42, .04]], .005, rope, 'bell_pull_cord', 'cloth', 12, 5); K.sphere(bg, .012, rope, 'bell_cord_knot', 'cloth', [.05, -.42, .04]);
    for (const s of S) K.bx(bg, .13, .19, -.33, -.27, s * .15, s * .19, chrome, 'bell_yoke_foot', 'metal'); }
  K.bx(fr, -4.035, -4.02, .53, .69, -.2, .2, K.std('#f2ecd8'), 'licence_plate', 'metal');

  // ------------------------------------------------------------------ 5. ROOF: rotating red beacon, chrome mechanical siren, twin air horns, spotlight
  const rf = new THREE.Group(); rf.name = 'roof_gear'; g.add(rf);
  K.cyl(rf, .15, .07, 'y', chrome, 'beacon_base', 'metal', [-2.85, 2.62, 0], 24, .13); const beam = new THREE.Group(); beam.position.set(-2.85, 2.74, 0); rf.add(beam);
  K.cyl(beam, .05, .1, 'x', mirrorM, 'beacon_reflector', 'metal', [-.03, 0, 0], 14, .02); K.sphere(beam, .025, lensW, 'beacon_bulb', 'glass', [.02, 0, 0]); K.cyl(beam, .05, .1, 'x', mirrorM, 'beacon_reflector', 'metal', [.07, 0, 0], 14).rotation.z = -PI / 2;
  const dome = K.lathe(rf, [[.13, 0], [.132, .1], [.12, .17], [.09, .215], [.04, .24], [0, .245]], lensRed, 'beacon_dome_red', 'glass', [-2.85, 2.655, 0], null, 28); dome.castShadow = false; K.cyl(rf, .035, .02, 'y', chrome, 'beacon_top_cap', 'metal', [-2.85, 2.9, 0], 12);
  { const sg = new THREE.Group(); sg.name = 'siren'; sg.position.set(-3.42, 2.59, .56); rf.add(sg);
    K.cyl(sg, .1, .26, 'x', chrome, 'siren_stator_housing', 'metal', [0, .15, 0], 24); K.cyl(sg, .1, .14, 'x', chrome, 'siren_horn_bell', 'metal', [-.2, .15, 0], 24, .135); K.cyl(sg, .07, .12, 'x', chromeB, 'siren_motor', 'metal', [.19, .15, 0], 18); K.sphere(sg, .07, chromeB, 'siren_motor_cap', 'metal', [.25, .15, 0], [.5, 1, 1]);
    for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2; K.box(sg, [.16, .012, .02], dark, 'siren_port_slot', 'metal', [-.02, .15 + Math.sin(a) * .1, Math.cos(a) * .1], [-a, 0, 0]).castShadow = false; }
    for (let i = 0; i < 3; i++) K.torus(sg, .135 - i * .035, .008, chrome, 'siren_grille_ring', 'metal', [-.275, .15, 0], [0, PI / 2, 0]); K.bx(sg, -.28, -.27, .02, .28, -.006, .006, chrome, 'siren_grille_bar', 'metal');
    K.bx(sg, -.08, .08, 0, .06, -.06, .06, chrome, 'siren_pedestal', 'metal'); K.bx(sg, -.12, .12, 0, .012, -.09, .09, chrome, 'siren_foot_plate', 'metal'); for (const [x, z] of [[-.1, -.07], [.1, -.07], [-.1, .07], [.1, .07]]) K.cyl(sg, .008, .01, 'y', iron, 'siren_foot_bolt', 'metal', [x, .016, z], 6); }
  for (const z of [-.46, -.66]) { K.cyl(rf, .022, .5, 'x', chrome, 'air_horn_trumpet', 'metal', [-3.3, 2.68, z], 16, .06); K.cyl(rf, .035, .08, 'x', chrome, 'air_horn_diaphragm', 'metal', [-3.02, 2.68, z], 14); K.bx(rf, -3.2, -3.16, 2.59, 2.66, z - .015, z + .015, chrome, 'air_horn_bracket', 'metal'); }
  K.bar(rf, [-3.6, 2.44, 1.12], [-3.6, 2.66, 1.12], .012, chrome, 'spotlight_post', 'metal', 8); K.sphere(rf, .075, chrome, 'spotlight_shell', 'metal', [-3.6, 2.72, 1.12], [1.1, 1, 1]); K.cyl(rf, .07, .012, 'x', lensW, 'spotlight_lens', 'glass', [-3.68, 2.72, 1.12], 18);

  // ------------------------------------------------------------------ 6. PUMP MODULE with a pump panel on each side (gauges, valve wheels, outlets, intake), hose reel on top
  const pm = new THREE.Group(); pm.name = 'pump_module'; g.add(pm);
  K.bx(pm, -1.88, -.8, .62, 2.06, -1.16, 1.16, paint, 'pump_house', 'metal'); K.bx(pm, -1.9, -.78, 2.06, 2.09, -1.18, 1.18, tread, 'pump_house_top_plate', 'metal');
  const gaugeTex = (key, label, max, val, redFrom) => K.tex('gauge_' + key, 256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); c.fillStyle = '#f4f0e2'; c.beginPath(); c.arc(128, 128, 124, 0, 7); c.fill(); c.strokeStyle = '#161616'; c.fillStyle = '#161616';
    const A = v => PI * .75 + v / max * PI * 1.5; for (let i = 0; i <= 30; i++) { const a = A(i / 30 * max), r0 = i % 5 ? 104 : 92; c.lineWidth = i % 5 ? 3 : 6; c.beginPath(); c.moveTo(128 + Math.cos(a) * r0, 128 + Math.sin(a) * r0); c.lineTo(128 + Math.cos(a) * 116, 128 + Math.sin(a) * 116); c.stroke();
      if (i % 5 === 0) { c.font = 'bold 22px "DejaVu Sans", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(Math.round(i / 30 * max)), 128 + Math.cos(a) * 72, 128 + Math.sin(a) * 72); } }
    if (redFrom) { c.strokeStyle = '#1f6a3a'; c.lineWidth = 7; c.beginPath(); c.arc(128, 128, 120, A(redFrom), A(max)); c.stroke(); }
    c.font = 'bold 20px "DejaVu Sans", sans-serif'; c.fillStyle = '#161616'; c.fillText(label, 128, 178); c.font = '13px "DejaVu Sans", sans-serif'; c.fillText('P.S.I.', 128, 200);
    const a = A(val); c.strokeStyle = '#0a0a0a'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(128 - Math.cos(a) * 22, 128 - Math.sin(a) * 22); c.lineTo(128 + Math.cos(a) * 98, 128 + Math.sin(a) * 98); c.stroke(); c.fillStyle = '#b08a3a'; c.beginPath(); c.arc(128, 128, 12, 0, 7); c.fill(); });
  const plateTex = (key, lines, bg = '#1a1a1a', fg = '#e9e2c8') => K.tex('plate_' + key, 256, 96, (c, w, h) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.strokeStyle = fg; c.lineWidth = 4; c.strokeRect(6, 6, w - 12, h - 12); c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle';
    lines.forEach((t, i) => { c.font = `bold ${lines.length > 1 ? 30 : 44}px "DejaVu Sans", sans-serif`; c.fillText(t, w / 2, h * (i + .5) / lines.length + (lines.length > 1 ? (i ? -4 : 4) : 0)); }); for (const [x, y] of [[14, 14], [w - 14, 14], [14, h - 14], [w - 14, h - 14]]) { c.beginPath(); c.arc(x, y, 4, 0, 7); c.fill(); } });
  const stainTex = K.tex('water_stain', 64, 256, (c, w, h) => { c.clearRect(0, 0, w, h); for (let i = 0; i < 7; i++) { const x = 8 + Math.random() * 48, L = 80 + Math.random() * 170, gr = c.createLinearGradient(0, 0, 0, L); gr.addColorStop(0, 'rgba(235,235,225,.5)'); gr.addColorStop(.6, 'rgba(120,110,90,.3)'); gr.addColorStop(1, 'rgba(120,110,90,0)'); c.fillStyle = gr; c.fillRect(x, 0, 2 + Math.random() * 5, L); } });
  const panelAnchors = {};
  for (const s of S) { const P = new THREE.Group(); P.name = 'pump_panel_' + (s > 0 ? 'driver' : 'officer'); pm.add(P); const Z = s * 1.16, zo = d => Z + s * d, R = zrot(s);
    K.bx(P, -1.84, -.84, .72, 2.0, zo(0), zo(.012), stainless, 'pump_panel_plate', 'metal'); for (const [x, y] of [[-1.82, .74], [-.86, .74], [-1.82, 1.98], [-.86, 1.98], [-1.34, .74], [-1.34, 1.98], [-1.82, 1.36], [-.86, 1.36]]) K.cyl(P, .009, .008, 'z', chrome, 'panel_screw', 'metal', [x, y, zo(.014)], 8);
    // panel light hood
    K.cyl(P, .035, .9, 'x', chrome, 'panel_light_hood', 'metal', [-1.34, 2.0, zo(.035)], 14); for (const x of [-1.62, -1.34, -1.06]) K.sphere(P, .02, lensW, 'panel_lamp', 'glass', [x, 1.975, zo(.04)]);
    // gauges: two masters, four line gauges, each a chrome bezel + printed dial + glass
    const gauge = (x, y, r, tex, nm) => { K.cyl(P, r * 1.12, .03, 'z', chrome, nm + '_bezel', 'metal', [x, y, zo(.025)], 28); K.decal(P, tex, r * 2, r * 2, nm + '_dial', [x, y, zo(.0415)], R, { rough: .6 }); K.torus(P, r, r * .1, chrome, nm + '_rim', 'metal', [x, y, zo(.042)]); const gl = K.cyl(P, r * .96, .004, 'z', glass, nm + '_glass', 'glass', [x, y, zo(.046)], 24); gl.castShadow = false; };
    gauge(-1.6, 1.76, .095, gaugeTex('master_in', 'INTAKE', 300, 40, 0), 'master_gauge_intake'); gauge(-1.34, 1.76, .095, gaugeTex('master_out', 'PUMP', 600, 150, 400), 'master_gauge_pressure');
    gauge(-1.03, 1.78, .07, gaugeTex('tach', 'R.P.M. x100', 30, 9, 24), 'tachometer');
    [['L1', 110], ['L2', 0], ['L3', 85], ['TANK', 30]].forEach(([nm, v], i) => gauge(-1.66 + i * .2, 1.5, .058, gaugeTex('line_' + nm, nm, 300, v, 0), 'line_gauge_' + nm));
    // discharge pull handles (chrome T on a rod) with engraved plates
    ['1', '2', '3', 'TANK FILL'].forEach((nm, i) => { const x = -1.66 + i * .2; K.cyl(P, .012, .11, 'z', chrome, 'valve_pull_rod', 'metal', [x, 1.3, zo(.06)], 8); K.cyl(P, .016, .1, 'x', chrome, 'valve_t_handle', 'metal', [x, 1.3, zo(.12)], 10); K.cyl(P, .025, .012, 'z', brass, 'valve_rod_gland', 'metal', [x, 1.3, zo(.016)], 10);
      K.decal(P, plateTex('d' + nm, nm.split(' ')), .11, .04, 'valve_name_plate', [x, 1.375, zo(.014)], R); });
    K.cyl(P, .03, .05, 'z', dark, 'throttle_knob', 'rubber', [-1.0, 1.52, zo(.04)], 14); K.cyl(P, .034, .01, 'z', chrome, 'throttle_collar', 'metal', [-1.0, 1.52, zo(.016)], 14); K.decal(P, plateTex('thr', ['THROTTLE']), .12, .04, 'throttle_plate', [-1.0, 1.59, zo(.014)], R);
    K.cyl(P, .012, .09, 'z', chrome, 'primer_pull_rod', 'metal', [-1.0, 1.32, zo(.05)], 8); K.sphere(P, .026, dark, 'primer_knob', 'rubber', [-1.0, 1.32, zo(.1)]); K.decal(P, plateTex('prm', ['PRIMER']), .1, .035, 'primer_plate', [-1.0, 1.385, zo(.014)], R);
    // two 2 1/2 inch discharges with hand wheels above, caps on chains, and the big steamer intake
    for (const x of [-1.62, -1.38]) { K.cyl(P, .06, .13, 'z', chrome, 'discharge_outlet', 'metal', [x, .98, zo(.07)], 20); K.cyl(P, .072, .05, 'z', chromeB, 'discharge_cap', 'metal', [x, .98, zo(.15)], 20); for (const a of [0, PI / 2]) K.bar(P, [x - Math.cos(a) * .095, .98 - Math.sin(a) * .095, zo(.15)], [x + Math.cos(a) * .095, .98 + Math.sin(a) * .095, zo(.15)], .012, chromeB, 'cap_rocker_lug', 'metal', 6);
      K.tube(P, [[x, .92, zo(.15)], [x + .03, .85, zo(.1)], [x + .02, .88, zo(.02)]], .004, brassOld, 'cap_chain', 'metal', 10, 4);
      K.cyl(P, .014, .08, 'z', chrome, 'hand_wheel_stem', 'metal', [x, 1.14, zo(.04)], 8); K.torus(P, .062, .009, dark, 'valve_hand_wheel', 'metal', [x, 1.14, zo(.08)]); for (let i = 0; i < 4; i++) { const a = i * PI / 2 + .4; K.bar(P, [x, 1.14, zo(.08)], [x + Math.cos(a) * .06, 1.14 + Math.sin(a) * .06, zo(.08)], .006, dark, 'hand_wheel_spoke', 'metal', 5); } K.cyl(P, .014, .016, 'z', brass, 'hand_wheel_nut', 'metal', [x, 1.14, zo(.088)], 6);
      K.decal(P, stainTex, .1, .24, 'water_stain_under_outlet', [x + .01, .82, zo(.0135)], R, { opacity: .4 + wear }); }
    K.cyl(P, .105, .16, 'z', chrome, 'steamer_intake', 'metal', [-1.06, .98, zo(.085)], 24); K.cyl(P, .12, .06, 'z', chromeB, 'steamer_cap', 'metal', [-1.06, .98, zo(.19)], 24); K.bar(P, [-1.23, .98, zo(.19)], [-.89, .98, zo(.19)], .016, chromeB, 'steamer_cap_handle', 'metal', 8); K.sphere(P, .022, chromeB, 'steamer_cap_handle_knob', 'metal', [-1.23, .98, zo(.19)]); K.sphere(P, .022, chromeB, 'steamer_cap_handle_knob', 'metal', [-.89, .98, zo(.19)]);
    K.tube(P, [[-1.06, .87, zo(.19)], [-1.0, .78, zo(.1)], [-1.02, .82, zo(.02)]], .004, brassOld, 'cap_chain', 'metal', 10, 4);
    for (let i = 0; i < 5; i++) { K.cyl(P, .012, .03, 'z', brassOld, 'drain_cock', 'metal', [-1.7 + i * .17, .77, zo(.025)], 8); K.bx(P, -1.7 + i * .17 - .006, -1.7 + i * .17 + .006, .77, .82, zo(.03), zo(.04), brassOld, 'drain_cock_lever', 'metal'); }
    K.decal(P, K.tex('maker_plate', 256, 128, (c, w, h) => { c.fillStyle = '#c9a24a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#3a2a10'; c.lineWidth = 5; c.strokeRect(7, 7, w - 14, h - 14); c.fillStyle = '#2a1c08'; c.textAlign = 'center'; c.font = 'bold 26px "DejaVu Serif", serif'; c.fillText(town + ' F.D.', w / 2, 40); c.font = 'bold 22px "DejaVu Serif", serif'; c.fillText('ENGINE Co. ' + eng, w / 2, 70); c.font = '16px "DejaVu Sans", sans-serif'; c.fillText('1000 G.P.M.  ·  1974  ·  No. 7403', w / 2, 100); }), .2, .1, 'maker_plate_brass', [-1.0, 1.93, zo(.0135)], R, { rough: .35 });
    K.bx(P, -1.9, -.78, .56, .6, s * 1.16, s * 1.36, tread, 'pump_operator_step', 'metal');
    panelAnchors[s > 0 ? 'pump_panel' : 'pump_panel_officer'] = [-1.34, 1.4, s * 1.3]; }
  // booster hose reel on the pump house: chrome flanges on an axle in pillow blocks, red-brown rubber hose wound on, nozzle clipped
  { const rg = new THREE.Group(); rg.name = 'booster_reel'; rg.position.set(-1.34, 2.44, 0); pm.add(rg); for (const s of S) { K.cyl(rg, .3, .016, 'z', chrome, 'reel_flange', 'metal', [0, 0, s * .42], 32); K.torus(rg, .3, .012, chrome, 'reel_flange_rim', 'metal', [0, 0, s * .42]); K.bx(rg, -.12, .12, -.35, .02, s * .47 - .02, s * .47 + .02, iron, 'reel_a_frame', 'metal'); K.cyl(rg, .04, .06, 'z', iron, 'reel_pillow_block', 'metal', [0, 0, s * .47], 10); }
    K.cyl(rg, .03, 1.0, 'z', chrome, 'reel_axle', 'metal', null, 10); K.cyl(rg, .2, .8, 'z', rubberHose, 'reel_hose_core', 'rubber', null, 24); for (let i = 0; i < 17; i++) K.torus(rg, .225 + (i % 2) * .012, .024, rubberHose, 'booster_hose_wrap', 'rubber', [0, 0, -.38 + i * .0475], null, PI * 2, 6, 26);
    K.tube(rg, [[.2, -.12, .3], [.33, -.2, .34], [.4, -.3, .36]], .022, rubberHose, 'booster_hose_tail', 'rubber', 12, 6); K.cyl(rg, .02, .16, 'y', brass, 'booster_nozzle', 'metal', [.41, -.34, .36], 10, .03); K.bx(rg, .38, .44, -.36, -.33, .33, .39, chrome, 'nozzle_clip', 'metal');
    K.bar(rg, [-.3, -.1, .5], [-.3, .1, .5], .01, chrome, 'reel_rewind_crank', 'metal', 6); K.cyl(rg, .014, .08, 'z', dark, 'reel_crank_grip', 'rubber', [-.3, .1, .55], 8); K.bar(rg, [0, 0, .5], [-.3, -.1, .5], .01, chrome, 'reel_crank_arm', 'metal', 6); }

  // ------------------------------------------------------------------ 7. BODY: compartments with latched doors, upper side walls, running boards, hose bed, tailboard
  const bd = new THREE.Group(); bd.name = 'body'; g.add(bd);
  const latch = (par, x, y, z, s) => { K.cyl(par, .034, .008, 'z', chrome, 'latch_cup', 'metal', [x, y, z + s * .004], 16); K.torus(par, .024, .005, chrome, 'latch_d_ring', 'metal', [x, y - .012, z + s * .012], null, PI * 2, 6, 14); };
  for (const s of S) { const zo = s * 1.18;
    K.bx(bd, -.78, 1.24, .6, 1.46, s * .84, zo, paint, 'compartment_front', 'metal'); K.bx(bd, 2.56, 3.6, .6, 1.46, s * .84, zo, paint, 'compartment_rear', 'metal'); K.bx(bd, 1.24, 2.56, 1.14, 1.46, s * .84, zo, paint, 'rear_fender', 'metal');
    K.torus(bd, .61, .035, rubber, 'rear_wheel_arch_lip', 'rubber', [TRUCK.rearAxleX, WR, s * 1.175], null, PI, 8, 24); K.bx(bd, 1.24, 2.56, .62, 1.14, s * .56, s * .6, dark, 'rear_wheel_well', 'metal');
    K.bx(bd, -.8, 3.6, 1.46, 2.12, s * .96, s * 1.16, paint, 'body_side_wall', 'metal'); K.bx(bd, -.82, 3.62, 2.12, 2.14, s * .94, s * 1.18, chromeB, 'side_wall_cap_strip', 'metal');
    // doors: skins proud of the box, piano hinge on top, D-ring latch, dark seam all round
    for (const [x0, x1, nm] of [[-.72, .2, 'A'], [.26, 1.18, 'B'], [2.62, 3.54, 'C']]) { K.bx(bd, x0 - .012, x1 + .012, .64, 1.42, zo, zo + s * .004, dark, 'compartment_door_seam', 'metal'); K.bx(bd, x0, x1, .652, 1.408, zo + s * .002, zo + s * .014, paint, 'compartment_door_' + nm, 'metal');
      K.cyl(bd, .011, x1 - x0, 'x', chrome, 'door_piano_hinge', 'metal', [(x0 + x1) / 2, 1.415, zo + s * .014], 8); latch(bd, (x0 + x1) / 2, .78, zo + s * .014, s); K.bx(bd, x0 + .02, x1 - .02, .652, .69, zo + s * .014, zo + s * .018, chromeB, 'door_kick_strip', 'metal'); }
    K.bx(bd, -.8, 1.3, .55, .6, s * .84, s * 1.34, tread, 'running_board', 'metal'); K.bx(bd, -.8, 1.3, .535, .555, s * 1.325, s * 1.345, chrome, 'running_board_edge_trim', 'metal'); for (const x of [-.6, .25, 1.1]) K.bx(bd, x - .025, x + .025, .5, .55, s * .47, s * 1.3, iron, 'running_board_outrigger', 'metal');
    // chrome top rail on stanchions
    K.bar(bd, [-.6, 2.3, s * 1.06], [3.4, 2.3, s * 1.06], .017, chrome, 'top_hand_rail', 'metal', 10); for (const x of [-.6, .4, 1.4, 2.4, 3.4]) { K.bar(bd, [x, 2.14, s * 1.06], [x, 2.3, s * 1.06], .013, chrome, 'rail_stanchion', 'metal', 8); K.cyl(bd, .026, .012, 'y', chrome, 'stanchion_foot', 'metal', [x, 2.146, s * 1.06], 10); }
    // rear corner: grab rail, tail lamps
    K.bar(bd, [3.66, 1.0, s * 1.1], [3.66, 2.2, s * 1.1], .017, chrome, 'rear_grab_rail', 'metal', 10); for (const y of [1.0, 2.2]) K.bar(bd, [3.6, y, s * 1.1], [3.66, y, s * 1.1], .013, chrome, 'grab_rail_standoff', 'metal', 8);
    K.cyl(bd, .06, .03, 'x', chrome, 'tail_lamp_bezel', 'metal', [3.61, 1.3, s * .98], 18); K.sphere(bd, .052, lensRed, 'tail_lamp_red', 'glass', [3.62, 1.3, s * .98], [.5, 1, 1]); K.cyl(bd, .05, .03, 'x', chrome, 'turn_lamp_bezel', 'metal', [3.61, 1.14, s * .98], 18); K.sphere(bd, .043, lensAmber, 'turn_lamp_amber', 'glass', [3.62, 1.14, s * .98], [.5, 1, 1]);
    K.cyl(bd, .075, .04, 'x', chrome, 'rear_warning_bezel', 'metal', [3.61, 1.95, s * 1.06], 18); K.sphere(bd, .066, lensRed, 'rear_warning_light', 'glass', [3.625, 1.95, s * 1.06], [.5, 1, 1]); }
  K.bx(bd, -.8, 3.6, 1.4, 1.46, -.96, .96, alu, 'hose_bed_floor', 'metal'); K.bx(bd, -.8, -.74, 1.46, 2.12, -.96, .96, paint, 'hose_bed_bulkhead', 'metal'); K.bx(bd, -.74, 3.56, 1.46, 2.1, -.012, .012, alu, 'hose_bed_divider', 'metal');
  K.bx(bd, 3.54, 3.6, .6, 1.4, -.84, .84, paint, 'rear_panel', 'metal'); K.bx(bd, 3.6, 4.0, .52, .57, -1.2, 1.2, tread, 'tailboard_step', 'metal'); K.bx(bd, 3.985, 4.005, .505, .58, -1.21, 1.21, chrome, 'tailboard_edge_trim', 'metal');
  for (const s of S) K.bar(bd, [3.62, .62, s * .43], [3.96, .53, s * .43], .02, iron, 'tailboard_bracket', 'metal', 6);
  K.cyl(bd, .06, .12, 'x', chrome, 'rear_discharge', 'metal', [3.66, .92, -.5], 18); K.cyl(bd, .072, .04, 'x', chromeB, 'rear_discharge_cap', 'metal', [3.73, .92, -.5], 18); K.bx(bd, 3.6, 3.61, .68, .82, .3, .62, K.std('#f2ecd8'), 'rear_licence_plate', 'metal');
  // the hose load: two bays of flat-laid cotton hose, fold loops showing at the tailboard, couplings and a brass playpipe on top
  const hb = new THREE.Group(); hb.name = 'hose_bed'; g.add(hb); K.reseed(41);
  for (const [z0, mat, nm] of [[.03, hoseM, 'new'], [-.945, hoseM2, 'old']]) for (let i = 0; i < 7; i++) { const z = z0 + i * .1305, n = 10 + Math.floor(K.rr(0, 3)), top = 1.46 + n * .052, xr = 3.4 + K.rr(-.06, .05);
    K.bx(hb, -.72, xr, 1.46, top, z + .004, z + .126, mat, 'hose_flat_lay_' + nm, 'cloth'); for (let j = 0; j + 1 < n; j += 2) { const o = K.add(hb, new THREE.CylinderGeometry(.052, .052, .122, 10, 1, false, 0, PI), mat, 'hose_fold_loop', 'cloth', [xr + K.rr(-.01, .02), 1.46 + (j + 1) * .052, z + .065], [PI / 2, 0, 0]); o.rotation.set(PI / 2, 0, 0); }
    for (let j = 1; j < n; j++) K.bx(hb, xr - .3, xr + .002, 1.46 + j * .052 - .003, 1.46 + j * .052 + .003, z + .004, z + .126, dark, 'hose_layer_gap', 'cloth').castShadow = false; }
  { const y = 2.02; K.cyl(hb, .045, .12, 'x', brass, 'hose_coupling_male', 'metal', [2.7, y + .05, .5], 14); K.cyl(hb, .052, .05, 'x', brass, 'hose_coupling_swivel', 'metal', [2.79, y + .05, .5], 14); for (const a of [0, PI]) K.box(hb, [.03, .02, .02], brass, 'coupling_lug', 'metal', [2.79, y + .05 + Math.cos(a) * .058, .5 + Math.sin(a) * .058]);
    K.cyl(hb, .042, .5, 'x', brass, 'playpipe_nozzle', 'metal', [3.15, y + .05, .5], 16, .022); K.torus(hb, .05, .012, leather, 'playpipe_leather_grip', 'cloth', [3.25, y + .05, .5], [0, PI / 2, 0]); K.torus(hb, .05, .012, leather, 'playpipe_leather_grip', 'cloth', [3.05, y + .05, .5], [0, PI / 2, 0]);
    K.cyl(hb, .045, .12, 'x', brassOld, 'hose_coupling_old', 'metal', [2.2, y + .06, -.45], 14); K.bx(hb, 1.5, 1.86, y + .0, y + .09, -.72, -.36, K.std('#8a6a3a'), 'hose_strap_roll', 'cloth'); }

  // ------------------------------------------------------------------ 8. DRIVER'S SIDE: two hard suction hoses in saddles with straps. OFFICER'S SIDE: extension ladder on brackets, pike pole
  const sd = new THREE.Group(); sd.name = 'side_gear'; g.add(sd);
  [1.66, 1.92].forEach((y, k) => { const z = 1.16 + .095, x0 = -.55 + k * .1, x1 = 2.55 + k * .1; K.cyl(sd, .07, x1 - x0, 'x', rubberHose, 'hard_suction_hose', 'rubber', [(x0 + x1) / 2, y, z], 16);
    for (let x = x0 + .08; x < x1 - .05; x += .075) K.torus(sd, .072, .011, rubberHose, 'suction_hose_rib', 'rubber', [x, y, z], [0, PI / 2, 0], PI * 2, 5, 16).castShadow = false;
    for (const [x, d] of [[x0 - .06, -1], [x1 + .06, 1]]) { K.cyl(sd, .085, .13, 'x', chromeB, 'suction_coupling', 'metal', [x, y, z], 18); K.torus(sd, .087, .012, chrome, 'suction_coupling_ring', 'metal', [x + d * .05, y, z], [0, PI / 2, 0]); for (const a of [.6, .6 + PI]) K.box(sd, [.035, .03, .03], chromeB, 'suction_coupling_lug', 'metal', [x, y + Math.sin(a) * .095, z + Math.cos(a) * .095]); }
    for (const x of [.0, 1.0, 2.0]) { K.bx(sd, x - .03, x + .03, y - .1, y + .02, 1.16, 1.2, chrome, 'suction_saddle_bracket', 'metal'); K.torus(sd, .078, .008, leather, 'suction_strap', 'cloth', [x, y, z], [0, PI / 2, 0]); K.box(sd, [.03, .03, .012], brass, 'strap_buckle', 'metal', [x, y + .02, z + .08]); } });
  { const L = new THREE.Group(); L.name = 'extension_ladder'; sd.add(L); const zb = -(1.16 + .05);
    [[-.5, 3.3, zb, 'bed'], [-.3, 3.42, zb - .055, 'fly']].forEach(([x0, x1, z, nm]) => { for (const y of [1.58, 2.02]) K.bx(L, x0, x1, y - .038, y + .038, z - .014, z + .014, alu, 'ladder_rail_' + nm, 'metal'); for (let x = x0 + .15; x < x1 - .05; x += .3) K.cyl(L, .016, .44, 'y', alu, 'ladder_rung_' + nm, 'metal', [x, 1.8, z], 8);
      for (const y of [1.58, 2.02]) K.bx(L, x1 - .002, x1 + .06, y - .045, y + .045, z - .02, z + .02, rubber, 'ladder_foot_' + nm, 'rubber'); });
    K.cyl(L, .03, .02, 'z', iron, 'ladder_pulley', 'metal', [-.2, 1.8, zb - .03], 12); K.tube(L, [[-.2, 1.83, zb - .03], [1.2, 1.86, zb - .03], [2.9, 1.83, zb - .03], [3.1, 1.75, zb - .03], [2.9, 1.72, zb - .03], [1.0, 1.75, zb - .03], [-.2, 1.77, zb - .03]], .007, rope, 'ladder_halyard_rope', 'cloth', 40, 5);
    for (const x of [1.3, 1.6]) K.bx(L, x, x + .05, 1.5, 1.66, zb - .09, zb - .07, iron, 'ladder_pawl_lock', 'metal');
    for (const x of [.1, 1.5, 2.9]) { K.bx(sd, x - .03, x + .03, 1.48, 1.52, -1.3, -1.16, chrome, 'ladder_bracket_hook', 'metal'); K.bx(sd, x - .03, x + .03, 1.5, 1.6, -1.31, -1.29, chrome, 'ladder_bracket_lip', 'metal'); K.bx(sd, x - .03, x + .03, 2.08, 2.12, -1.3, -1.16, chrome, 'ladder_top_clamp', 'metal'); K.cyl(sd, .012, .03, 'z', brass, 'ladder_clamp_wing_nut', 'metal', [x, 2.1, -1.31], 6); }
    K.bar(sd, [-.4, 2.36, -1.06], [3.2, 2.36, -1.06], .018, wood, 'pike_pole_shaft', 'wood', 8); K.bar(sd, [-.4, 2.36, -1.06], [-.62, 2.36, -1.06], .012, iron, 'pike_pole_point', 'metal', 6, .002); K.tube(sd, [[-.5, 2.36, -1.06], [-.52, 2.36, -1.12], [-.46, 2.36, -1.15]], .008, iron, 'pike_pole_hook', 'metal', 10, 5); for (const x of [.4, 2.4]) K.torus(sd, .022, .005, chrome, 'pike_pole_clip', 'metal', [x, 2.345, -1.06], [0, PI / 2, 0]); }
  // pick-head axe on the rear panel, soda-acid extinguisher on the running board, wheel chock
  { K.bar(sd, [3.61, .72, -.2], [3.61, 1.34, .1], .017, wood, 'axe_handle', 'wood', 8); K.box(sd, [.03, .1, .22], iron, 'axe_head', 'metal', [3.615, 1.32, .08], [.45, 0, 0]); K.box(sd, [.022, .03, .12], stainless, 'axe_edge', 'metal', [3.617, 1.375, .2], [.45, 0, 0]); for (const p of [[3.61, .8, -.16], [3.61, 1.2, .03]]) K.torus(sd, .024, .006, chrome, 'axe_clip', 'metal', p, [PI / 2, 0, 0]);
    K.cyl(sd, .085, .5, 'y', brass, 'soda_acid_extinguisher', 'metal', [1.12, .86, 1.27], 20); K.sphere(sd, .085, brass, 'extinguisher_dome', 'metal', [1.12, 1.11, 1.27], [1, .5, 1]); K.cyl(sd, .02, .05, 'y', brassOld, 'extinguisher_cap', 'metal', [1.12, 1.17, 1.27], 8); K.tube(sd, [[1.12, 1.12, 1.33], [1.14, 1.0, 1.37], [1.1, .8, 1.36]], .01, rubberHose, 'extinguisher_hose', 'rubber', 12, 5); K.torus(sd, .09, .008, chrome, 'extinguisher_bracket', 'metal', [1.12, .95, 1.27], [PI / 2, 0, 0]);
    K.box(sd, [.3, .16, .16], wood, 'wheel_chock_oak', 'wood', [2.9, .68, 1.27], [0, 0, 0]); }

  // ------------------------------------------------------------------ 9. LETTERING (hand-laid gold leaf, from THIS story) and pin striping
  const doorTex = K.tex('door_gold_' + town + eng, 1024, 620, (c, w, h) => { c.clearRect(0, 0, w, h);
    gold(c, town, w / 2, 150, 104, { arc: 46, seed: 5 }); gold(c, 'FIRE DEPT.', w / 2, 262, 66, { seed: 9 });
    c.strokeStyle = '#e2b53a'; c.lineWidth = 5; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(w / 2 + s * 60, 322); c.bezierCurveTo(w / 2 + s * 200, 300, w / 2 + s * 300, 350, w / 2 + s * 400, 318); c.stroke(); c.beginPath(); c.arc(w / 2 + s * 412, 322, 12, 0, 7); c.stroke(); }
    c.fillStyle = '#e2b53a'; c.beginPath(); c.moveTo(w / 2, 304); c.lineTo(w / 2 + 22, 322); c.lineTo(w / 2, 340); c.lineTo(w / 2 - 22, 322); c.fill();
    gold(c, 'ENGINE Co.', w / 2 - 110, 452, 112, { seed: 13 }); gold(c, String(eng), w / 2 + 330, 440, 210, { seed: 17 });
    c.font = 'italic bold 34px "Caladea", "DejaVu Serif", serif'; c.fillStyle = '#e8c45a'; c.textAlign = 'center'; c.fillText('Est. 1891  ·  Always Ready', w / 2 - 80, 566);
    c.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 40 + wear * 160; i++) { c.fillStyle = `rgba(0,0,0,${.25 + Math.random() * .5})`; c.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 1 + Math.random() * 2); } c.globalCompositeOperation = 'source-over'; });
  const numTex = K.tex('front_no_' + eng, 256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); gold(c, String(eng), w / 2, 138, 220, { seed: 3 }); }), noTex = K.tex('front_No', 256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); gold(c, 'No.', w / 2, 140, 130, { seed: 4 }); });
  const backTex = K.tex('keep_back', 1024, 256, (c, w, h) => { c.clearRect(0, 0, w, h); gold(c, 'KEEP BACK 300 FEET', w / 2, 90, 88, { seed: 21 }); gold(c, town + ' F.D.', w / 2, 196, 64, { seed: 22 }); });
  const stripeTex = K.tex('pinstripe', 512, 64, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = '#e8b93c'; c.lineWidth = 7; c.strokeRect(8, 8, w - 16, h - 16); c.lineWidth = 2; c.strokeStyle = '#f5dc8a'; c.strokeRect(18, 18, w - 36, h - 36); });
  const plTex = K.tex('plate_txt', 256, 128, (c, w, h) => { c.fillStyle = '#f2ecd8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#1c3a6a'; c.lineWidth = 6; c.strokeRect(6, 6, w - 12, h - 12); c.fillStyle = '#1c3a6a'; c.textAlign = 'center'; c.font = 'bold 26px "DejaVu Sans", sans-serif'; c.fillText('FIRE DEPT · 1974', w / 2, 36); c.font = 'bold 60px "DejaVu Sans", sans-serif'; c.fillText('PH·F' + eng, w / 2, 100); });
  const lett = new THREE.Group(); lett.name = 'lettering'; g.add(lett);
  for (const s of S) { const R = zrot(s); K.decal(lett, doorTex, .98, .594, 'door_lettering_gold_leaf', [-2.77, 1.5, s * 1.196], R, { rough: .3, glow: .12 });
    for (const [x0, x1] of [[-.72, .2], [.26, 1.18], [2.62, 3.54]]) K.decal(lett, stripeTex, x1 - x0 - .12, .56, 'door_pin_stripe', [(x0 + x1) / 2, 1.08, s * 1.1945], R, { rough: .3, glow: .1 });
    K.decal(lett, K.tex('flap_txt', 128, 128, (c, w, h) => { c.clearRect(0, 0, w, h); c.fillStyle = '#e8e2d0'; c.font = 'bold 40px "DejaVu Sans", sans-serif'; c.textAlign = 'center'; c.fillText('P.H.', 64, 56); c.fillText('F.D.', 64, 100); }), .34, .34, 'mud_flap_letters', [2.661, .42, s * .89], [0, PI / 2, 0], { rough: .9 }); }
  K.decal(lett, noTex, .3, .3, 'front_no_gold', [-3.802, 1.5, .5], [0, -PI / 2, 0], { rough: .3, glow: .12 }); K.decal(lett, numTex, .34, .34, 'front_number_gold', [-3.802, 1.5, -.5], [0, -PI / 2, 0], { rough: .3, glow: .12 });
  K.decal(lett, backTex, 1.5, .375, 'rear_keep_back_gold', [3.602, 1.14, -.02], [0, PI / 2, 0], { rough: .3, glow: .12 });
  K.decal(lett, plTex, .4, .16, 'front_plate_text', [-4.0355, .61, 0], [0, -PI / 2, 0], { rough: .5 }); K.decal(lett, plTex, .32, .14, 'rear_plate_text', [3.611, .75, .46], [0, PI / 2, 0], { rough: .5 });

  // ------------------------------------------------------------------ 10. WEAR: a NEW truck (line 1 "brand-new") with honest marks: stone chips, road dust, soot at the exhaust, boot scuffs
  const wr = new THREE.Group(); wr.name = 'wear'; g.add(wr); K.reseed(77);
  const blot = (key, col, n, sz) => K.tex(key, 256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); for (let i = 0; i < n; i++) { const x = 128 + (Math.random() - .5) * 150, y = 128 + (Math.random() - .5) * 150, r = sz * (.4 + Math.random()); const gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, col.replace(/[\d.]+\)$/, '0)')); c.fillStyle = gr; c.fillRect(x - r, y - r, r * 2, r * 2); } });
  const soot = blot('soot', 'rgba(14,12,10,.55)', 26, 46), dust = blot('dust', 'rgba(160,140,105,.30)', 40, 60);
  const chipTex = K.tex('chips', 256, 64, (c, w, h) => { c.clearRect(0, 0, w, h); for (let i = 0; i < 46; i++) { const x = Math.random() * w, y = Math.random() * h, r = 1 + Math.random() * 3.2; c.fillStyle = Math.random() < .5 ? '#8f8c86' : '#3a2f2a'; c.beginPath(); c.ellipse(x, y, r * (1 + Math.random()), r, Math.random() * 3, 0, 7); c.fill(); } });
  const scuffTex = K.tex('boot_scuffs', 256, 128, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = 'rgba(30,26,22,.5)'; c.lineCap = 'round'; for (let i = 0; i < 26; i++) { c.lineWidth = 2 + Math.random() * 6; const x = Math.random() * w, y = Math.random() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 10 + Math.random() * 40, y + (Math.random() - .5) * 14); c.stroke(); } });
  if (wear > 0) { const op = Math.min(1, .35 + wear);
    K.decal(wr, soot, .7, .5, 'soot_at_exhaust', [1.0, .86, 1.1965], null, { opacity: op, rough: 1 }); K.decal(wr, scuffTex, 1.6, .34, 'boot_scuffs_tailboard', [3.8, .5715, 0], [-PI / 2, 0, PI / 2], { opacity: op, rough: 1 }); K.decal(wr, scuffTex, 1.4, .3, 'boot_scuffs_running_board', [.2, .6015, 1.1], [-PI / 2, 0, 0], { opacity: op, rough: 1 });
    for (const s of S) { const R = zrot(s); K.decal(wr, dust, 1.3, .5, 'road_dust_rear_arch', [2.5, .95, s * 1.1965], R, { opacity: op * .8, rough: 1 }); K.decal(wr, dust, 1.0, .46, 'road_dust_cab_skirt', [-2.05, .9, s * 1.1965], R, { opacity: op * .8, rough: 1 });
      K.decal(wr, chipTex, .9, .16, 'stone_chips_door_sill', [-2.75, 1.22, s * 1.1968], R, { opacity: op, rough: .9 }); K.decal(wr, chipTex, .9, .14, 'stone_chips_compartment', [.25, .72, s * 1.1968], R, { opacity: op, rough: .9 }); }
    K.decal(wr, chipTex, 1.4, .2, 'stone_chips_front_panel', [-3.803, .74, 0], [0, -PI / 2, 0], { opacity: op, rough: .9 }); }

  // ------------------------------------------------------------------ 11. MASKING for the spray job: newspaper and tape over glass, chrome, lamps, gauges, tyres
  const mk = new THREE.Group(); mk.name = 'masking'; g.add(mk);
  const news = K.tex('newspaper_' + town, 512, 512, (c, w, h) => { c.fillStyle = '#d9d2bd'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a2824'; c.textAlign = 'center'; c.font = 'bold 40px "DejaVu Serif", serif'; c.fillText('The ' + town.split(' ').map(t => t[0] + t.slice(1).toLowerCase()).join(' ') + ' Gazette', w / 2, 46);
    c.fillRect(14, 60, w - 28, 3); c.font = 'bold 30px "DejaVu Serif", serif'; c.fillText('NEW ENGINE ARRIVES', w / 2, 100); c.font = '15px "DejaVu Serif", serif'; c.fillText('Company No. ' + eng + ' takes delivery of 1000-gallon pumper', w / 2, 124);
    c.fillStyle = '#8f8a7c'; c.fillRect(20, 140, 200, 130); c.fillStyle = '#5b574e'; c.fillRect(40, 200, 150, 40); c.fillRect(60, 175, 60, 30); for (const x of [70, 150]) { c.beginPath(); c.arc(x, 245, 16, 0, 7); c.fill(); }
    c.fillStyle = '#4a463e'; for (let col = 0; col < 4; col++) for (let y = (col < 2 ? 286 : 140); y < h - 16; y += 9) { const x = 20 + col * 122; c.fillRect(x, y, 104 - Math.random() * 26, 3); } c.fillStyle = 'rgba(120,100,60,.12)'; for (let i = 0; i < 30; i++) c.fillRect(Math.random() * w, Math.random() * h, 60, 30); });
  const newsM = new THREE.MeshStandardMaterial({ map: news, roughness: 1, side: THREE.DoubleSide }), kraftM = new THREE.MeshStandardMaterial({ color: PAINT.kraft, roughness: 1, side: THREE.DoubleSide }), tapeM = new THREE.MeshStandardMaterial({ color: PAINT.tape, roughness: .8, side: THREE.DoubleSide });
  const sheet = (x0, x1, y0, y1, z, s, mat, nm, lean = 0) => { const w = x1 - x0, h = y1 - y0, p = K.add(mk, new THREE.PlaneGeometry(w, h, 6, 4), mat, nm, 'paper', [(x0 + x1) / 2, (y0 + y1) / 2, z + s * lean / 2], [s * -Math.atan2(lean, h), s > 0 ? 0 : PI, 0]); const P = p.geometry.attributes.position; for (let i = 0; i < P.count; i++) P.setZ(i, Math.sin(P.getX(i) * 9 + i) * .006 + Math.cos(P.getY(i) * 7) * .005); p.geometry.computeVertexNormals();
    const tz = z + s * (.004); for (const [a, b2, c2, d] of [[x0, x1, y1 - .03, y1 + .02], [x0, x1, y0 - .02, y0 + .03]]) { const t = K.add(mk, new THREE.PlaneGeometry(b2 - a + .04, d - c2), tapeM, 'masking_tape', 'paper', [(a + b2) / 2, (c2 + d) / 2, c2 < (y0 + y1) / 2 ? tz + s * lean : tz], [0, s > 0 ? 0 : PI, K.rr(-.015, .015)]); t.castShadow = false; }
    for (const x of [x0, x1]) { const t = K.add(mk, new THREE.PlaneGeometry(.05, h + .04), tapeM, 'masking_tape', 'paper', [x, (y0 + y1) / 2, tz + s * lean / 2], [s * -Math.atan2(lean, h), s > 0 ? 0 : PI, K.rr(-.01, .01)]); t.castShadow = false; } return p; };
  for (const s of S) { sheet(-3.62, -2.74, 1.88, 2.43, s * 1.16, s, newsM, 'window_paper_side_front'); sheet(-2.72, -2.26, 1.88, 2.43, s * 1.16, s, kraftM, 'window_paper_side_rear');
    sheet(-1.86, -.82, .74, 2.02, s * 1.2, s, newsM, 'pump_panel_paper', .2); sheet(-.6, 2.72, 1.52, 2.06, s * (s > 0 ? 1.36 : 1.34), s, kraftM, s > 0 ? 'suction_hose_paper' : 'ladder_paper');
    for (const [x, r] of [[TRUCK.frontAxleX, .5], [TRUCK.rearAxleX, .5]]) { const d = K.add(mk, new THREE.CircleGeometry(r, 26), newsM, 'wheel_paper_disc', 'paper', [x, WR, s * 1.185], [0, s > 0 ? 0 : PI, .3]); d.castShadow = false; for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; K.add(mk, new THREE.PlaneGeometry(.05, .14), tapeM, 'masking_tape', 'paper', [x + Math.cos(a) * r, WR + Math.sin(a) * r, s * 1.188], [0, s > 0 ? 0 : PI, (s > 0 ? 1 : -1) * (a - PI / 2)]).castShadow = false; } }
    K.bar(mk, [3.66, .98, s * 1.1], [3.66, 2.22, s * 1.1], .024, tapeM, 'grab_rail_tape_wrap', 'paper', 8); for (const [y, r2] of [[1.3, .075], [1.14, .065], [1.95, .09]]) K.add(mk, new THREE.CircleGeometry(r2, 14), tapeM, 'lamp_tape_patch', 'paper', [3.655, y, s * (y > 1.5 ? 1.06 : .98)], [0, PI / 2, 0]).castShadow = false;
    K.bar(mk, [-.62, 2.3, s * 1.06], [3.42, 2.3, s * 1.06], .023, tapeM, 'top_rail_tape_wrap', 'paper', 8); }
  { const w = K.add(mk, new THREE.PlaneGeometry(2.0, .58, 8, 2), newsM, 'windscreen_paper', 'paper', [-3.775, 2.15, 0], [0, -PI / 2, 0]); const t1 = K.add(mk, new THREE.PlaneGeometry(2.06, .05), tapeM, 'masking_tape', 'paper', [-3.778, 2.43, 0], [0, -PI / 2, .01]); const t2 = K.add(mk, new THREE.PlaneGeometry(2.06, .05), tapeM, 'masking_tape', 'paper', [-3.778, 1.87, 0], [0, -PI / 2, -.008]); for (const o of [w, t1, t2]) o.castShadow = false;
    K.slab(mk, -4.035, -3.82, -1.245, 1.245, .49, .755, [.1, .02], kraftM, 'bumper_paper_wrap', 'paper'); for (const z of [-.8, -.3, .3, .8]) K.bx(mk, -4.04, -3.82, .485, .76, z - .025, z + .025, tapeM, 'bumper_tape_band', 'paper');
    for (const s of S) K.add(mk, new THREE.PlaneGeometry(.56, .34), newsM, 'headlight_paper', 'paper', [-3.92, .93, s * .76], [0, -PI / 2, 0]); K.add(mk, new THREE.PlaneGeometry(.92, .5), kraftM, 'grille_paper', 'paper', [-3.875, .89, 0], [0, -PI / 2, 0]);
    K.lathe(mk, [[0, .04], [.06, .03], [.12, -.06], [.16, -.2], [.17, -.3], [.12, -.33]], kraftM, 'bell_paper_bag', 'paper', [-3.98, 1.57, 0], null, 9); K.torus(mk, .125, .012, tapeM, 'bell_bag_tape', 'paper', [-3.98, 1.27, 0], [PI / 2, 0, 0], PI * 2, 5, 9);
    K.lathe(mk, [[0, .3], [.1, .29], [.165, .2], [.18, .02], [.17, -.03]], kraftM, 'beacon_paper_bag', 'paper', [-2.85, 2.62, 0], null, 8); K.torus(mk, .172, .012, tapeM, 'beacon_bag_tape', 'paper', [-2.85, 2.625, 0], [PI / 2, 0, 0], PI * 2, 5, 8);
    K.box(mk, [.62, .34, .32], kraftM, 'siren_paper_wrap', 'paper', [-3.44, 2.76, .56], [0, .05, .03]); K.box(mk, [.64, .05, .33], tapeM, 'siren_tape_band', 'paper', [-3.44, 2.74, .56], [0, .05, .03]); K.box(mk, [.6, .2, .34], kraftM, 'air_horn_paper_wrap', 'paper', [-3.26, 2.7, -.56], [0, -.04, 0]);
    for (const s of S) { K.box(mk, [.06, .42, .2], kraftM, 'mirror_paper_wrap', 'paper', [-3.41, 2.06, s * 1.42]); K.box(mk, [.065, .04, .21], tapeM, 'mirror_tape_band', 'paper', [-3.41, 2.06, s * 1.42]); }
    // a corner of the windscreen paper has come loose and curls down
    const fl = K.add(mk, new THREE.PlaneGeometry(.3, .22, 3, 3), newsM, 'paper_corner_peeling', 'paper', [-3.83, 2.36, -.92], [.5, -PI / 2 - .5, .2]); fl.castShadow = false; }

  // ------------------------------------------------------------------ state
  const mode = { paint: 'red', edge: opts.edge ?? .3 };
  const setPaint = st => { if (typeof st === 'string') st = { mode: st }; if (st.mode) mode.paint = st.mode; if (st.edge !== undefined) mode.edge = st.edge; if (st.soft !== undefined) U.uSoft.value = st.soft; if (st.drain !== undefined) U.uDrain.value = st.drain;
    const A = st.a || (mode.paint === 'yellow' ? PAINT.yellow : PAINT.red), B = st.b || (mode.paint === 'red' ? PAINT.red : PAINT.yellow); U.uColA.value.set(A); U.uColB.value.set(B); U.uEdge.value = mode.edge; return mode; };
  const setMasking = on => { mk.visible = !!on; };
  const setWheels = m => { for (const [w, s] of spins) w.rotation.z = s * m / WR; };            // metres rolled forward (toward -X)
  const setSteer = deg => { steerG.forEach((h, i) => { h.rotation.y = (i === 0 ? 0 : PI) + deg * PI / 180; }); };
  const setBeacon = (on, ang = 0) => { beam.rotation.y = ang; lensRed.emissiveIntensity = on ? 1.6 : .35; };
  const setDoor = deg => { for (const [d, s] of doors) if (s > 0) d.rotation.y = deg * PI / 180; };
  const update = () => { g.updateWorldMatrix(true, false); U.uTruckInv.value.copy(g.matrixWorld).invert(); };
  setPaint({ mode: opts.paint || 'red' }); setMasking(opts.masking ?? (opts.paint === 'half')); if (opts.lettering === false) lett.visible = false; if (opts.steer) setSteer(opts.steer); update();
  const names = new Set(K.parts.map(p => p.name));
  return done(THREE, g, K, { partNames: [...names].sort(), partKinds: names.size, uniforms: U, setPaint, setMasking, setWheels, setSteer, setBeacon, setDoor, update, groups: { chassis: ch, cab, front: fr, roof: rf, pump: pm, body: bd, hoseBed: hb, side: sd, lettering: lett, wear: wr, masking: mk },
    anchors: { ...panelAnchors, door: [-2.77, 1.5, 1.2], door_handle: [-2.37, 1.62, 1.24], spray_edge: [mode.edge, 1.3, 1.2], front: [-4.02, 1.2, 0], bumper: [-4.02, .62, 0], bell: [-3.98, 1.4, 0], beacon: [-2.85, 2.78, 0], siren: [-3.5, 2.74, .56], roof: [-2.85, 2.59, 0],
      driver_seat: [-2.5, 1.6, .56], cab_step: [-2.02, .74, 1.26], tailboard: [3.8, .57, 0], rear: [4.0, 1.2, 0], hose_bed: [1.4, 2.05, 0], ladder: [1.4, 1.8, -1.24], suction_hose: [1.0, 1.8, 1.26], front_wheel: [TRUCK.frontAxleX, WR, 1.17], rear_wheel: [TRUCK.rearAxleX, WR, 1.17], top: [0, 2.89, 0], centre: [0, 1.4, 0] } });
}
export const BUILDERS = { buildTruck };

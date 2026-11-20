# Shared FX for fake-surgery: `water_fx.js` + `zzz_fx.js` (owner: vfx-artist, phase A 2026-11-17)
Import them from a set file; never copy them into a stretch. They fix ISSUES_v2 A1, A2 (opaque blue plastic water) and A3 (static zZ sticker in the face).
Proof: `sets/_fx_test/` (`bash run.sh`: s1's film + a test wrapper `fxt_room.js`; 12 stills, `fx_sheet.jpg`, `numbers.txt`). TEST ONLY, never in the film.

## FX style sheet (ONE water language, ONE sleep language)
- Water body: SEE-THROUGH, fresnel shader: clear cyan `#22a6dc` in the middle, white `#eafcff` at the rims and on top, alpha .45-.95; a thin dark-cyan rim shell `#17669a` (alpha .5) on drops and the jet so it reads on the blue drape. No opaque blue, no plastic shine, no red.
- White: foam beads on the crown spikes, a white core streak along the jet / pour column, a white glint on every drop (turned to the camera), white ripple rings, white wave streaks + foam on the floor water. Small white areas only (bloom 1 must not swallow the knee marks).
- Shapes: fat round drops, stretched along their velocity (up to 1.7x), gravity -6.5 m/s2 (a little floaty so the arc reads); crowns rise in 40 % of their life, then collapse and spread; nothing hangs static.
- Zs: drawn bold "Z" (no font), white -> cool blue belly `#cfe2ff`, ink outline `#1b2440`, a white shine notch; billboards; tilt 10-16 deg against the drift.

## water_fx.js
```js
import { addWater, hideStaticBulbWater } from './water_fx.js';
const W = addWater(THREE, scene, 'bulb_splash' | 'jug_flood', opts);   // in update(f, t, R): W.update(f, R && R.camera)
```
Points are PLAN metres (x, y forward, z up) like film.json, or a THREE.Vector3 (world), an Object3D, or a function(f) returning one. Every frame is a pure function of f (stills may render out of order).
- `bulb_splash` `{ at, dir, from, f0, f1, bursts, size = 1.3, drops = 12, normal, land = 'auto', seed }`: per squeeze (default bursts `[f0+4, f0+.6(f1-f0)]` = 89, 103 for f85-115):
  jet nozzle -> knee in 2 f (sag arc, fat front, glug wobble, white core), holds to +4 f, tail arrives +7 f; crown on the drape (rises 5 f, collapses to 12 f, foam beads on 9-10 spikes);
  12-14 fat drops in gravity arcs that land ON the drape (raycast at build on cloth/skin/paper meshes) as wet splats with a white sheen arc and a mini ripple; fine white mist (9 f);
  2 ripple rings per burst; a darker wet patch + white highlight crescent at the hit that grows on burst 2 and stays. Burst 2 is 1.25x (gag escalation).
- `jug_flood` `{ at:[x,y], from, f0, f1, floorZ = 0, depth = .30, radius = 3.2, size = 1, drops = 26, bob, seed }`: the pour column (fat, glugging, gravity arc, white core) lands at f0+3;
  a BIG crown (0.3 m wide, 0.5 m tall, 14 f) + 26 big drops landing as ripples; small crowns every 8 f while pouring (pour ends f0 + .6(f1-f0)); a foam skirt at the impact;
  the floor sheet spreads (foam edge) and rises to `depth` by f1 (see-through: table legs, feet show under it tinted), animated white wave streaks, ripple rings every 5 f from the pour;
  `bob`: `[{ obj | name, xy, amp, phase, yaw, draft }]` floats objects (bob, roll, slow drift away from the pour) once the water is deeper than `draft`; default = a white clog + a steel kidney dish; `[]` = none.
  `W.level(f)` = the surface height (plan z) for other parts (bucket, gurney wheels).
- `hideStaticBulbWater(scene)`: hides or_props' static bulb fan (`water_stream`, `water_drop`, `drop_glint`).

## zzz_fx.js
```js
import { addZzz, registerKoClean } from './zzz_fx.js';
await registerKoClean('koClean');                // in build(), before the cards draw: memes 'ko' (spiral + X eyes, tongue) without the head bump and without any zZ
const Z = addZzz(THREE, scene, { head, f0, f1 }); // in update(f, t, R): Z.update(f, R && R.camera)
```
`{ head, f0, f1, lift = .14, rise = .42, size = .2, life = 45, every = [15, 21], side = 1, sway = .06, tint, ink, depthTest = true, cut = false, seed }`.
`head` = the TOP of the sleeper's head (plan point, Vector3, Object3D or function(f) when he moves). One Z every 0.5-0.7 s, 1.5 s life, about 3 visible, every 3rd one 70 % size, rising in an S and drifting to screen right (side -1 = left).

## How each stretch switches (the stretch builder edits its own file; nothing else changes)
- **S1 (`or_room.js`, owner S1 builder)**: 1) drop the `splash_big` block; at its place: `hideStaticBulbWater(scene); const W = addWater(THREE, scene, 'bulb_splash', { at: dotPts[1] /* knee_dot_2 */, f0: 85, f1: 115, bursts: SB.bursts || [89, 103], size: SB.size ?? 1.3, from: () => tipWorld() })`
  where `tipWorld()` = `h3x.bulb.tip` through `h3x.bulb.holder.localToWorld` (the code the old stream used), and `fxU.push(f => W.update(f, RR.camera))`. Keep the place key name `splash_big` (or add `water_v3`) so old films are unchanged.
  2) `ko_face`: register `koClean` with `registerKoClean()` instead of `koZ`'s bubble, and add `addZzz(THREE, scene, { head: [anchors.patient_head[0], anchors.patient_head[1], anchors.patient_head[2] + .06], f0: 0, f1: 386 })`; in `build_film.py` the patient's `face='koZ'` -> `'koClean'`.
- **S3 (`s3_wrap.js`, owner S3 builder)**: replace `X.splash_big` (and the or_room `water_floor` sheet for row 29) by `addWater(THREE, scene, 'jug_flood', { at: [x, y] under the jug, from: f => the held jug's spout (held3d jug_pour, anchor 'tip') as a world Vector3, f0: 1215, f1: 1260, floorZ: 0, depth: .3, bob: clogs as [{ obj, xy }] })`;
  the update goes into `ups`. Keep `water_floor` at 0 when jug_flood is on (or both sheets fight). The ko patient of rows 27-30: `koClean` + `addZzz` as in S1.
- **S5 (`s5/moves/memes3.mjs` `koSleep`, owner S5 builder)**: delete the zZ paths from `koSleep` (keep spiral + X eyes + tongue), or use `koClean`; add `addZzz` to the S5 set wrapper on the patient's head for rows 40-41 (f1672-1765).

## What the three.js kit does here, and what it does not
Built in three.js (real, animated): see-through water bodies, crowns, drops with glints, ripples, wet sheen, mist points, floor water with waves and floaters, Zs. Not built: real refraction of the floor under the water (the sheet is alpha-blended, not refractive), caustics on the floor, water volume physics; those would need a Blender pass (TAKEN OUT for now, CB_RULES 11a).

## Notes from the proof (2026-11-17)
- Zs are camera-facing MESH quads, not THREE.Sprite: the kit's passes skip Sprites (measured: Sprites rendered 0 px). Always pass the camera: `Z.update(f, R && R.camera)`.
- `head` is where the CARD's drawn head is, not or_room's `patient_head` anchor (that is the 3D table head; it lands on the patient's chest on screen, under the ceiling problem below).
  The Zs are depth-tested: a head point far from the lens puts them behind the OR ceiling. Put the point on the lens side of the card (S1 frame-0 camera: `[-0.80, 0.20, 1.84]`, lift .06, rise .32).
- `f0` may be negative (pre-warm): with f0 = -30 three Zs are already in the air on frame 0.
- or_room's kick bucket does not float (or_room owns it); give it to `bob` or read `W.level(f)` if it must.

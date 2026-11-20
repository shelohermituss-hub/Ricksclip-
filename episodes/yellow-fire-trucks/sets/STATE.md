# STATE: sets/ of yellow-fire-trucks (props-hero round 1, 2026-11-20)

## NOT done
- Not compared with a Rick frame (none in the repo). The detail gate "at least 90 % of Rick's close-up" is therefore OPEN, not passed.
- Only the truck, spray gun, compressor, paint tin and air hose are built. Every other prop in `../PROPS.md` is a five-detail list.
- Grip tested with the kit's `cast:firefighter` only (front and 3/4 drawings; its "side" view draws the front card). Re-test on the film's own hero when the cast exists.
- No PROP_STATES.md yet (no shots are locked); the paint states per line are in PROPS.md.
- `opts.paintColor` (spray kit), `town: 'DALLAS'`, `setDoor`, `setSteer`, `setWheels`, `setBeacon`, `setCup`, `drain`, `letters: 'over'` and the red-over-lemon repaint are in code, NOT looked at in a picture.

## Built (looked at in `../props/HERO_SHEET.jpg`, 16 tiles, 1600 x 1200, and `../props/GUN_GRIP_3VIEWS.jpg`)
- `prop_kit.js`: shared builder kit (adapted from fake-surgery hero_props.js kit(); adds cyl, torus, slab, lathe, decal, handText, a studio reflection for held props).
- `hero_truck.js` `buildTruck(THREE, ctx, opts)`: ONE model, paint by parameter. API and options at the top of the file. Call `truck.update()` in the set's update.
- `hero_props.js`: `buildSprayGun`, `buildCompressor`, `buildPaintTin`, `buildAirHose`.
- `hero_yard_test.js`: TEST yard only (concrete, brick station wall, sign). Not the film's set.
- `_hero_test/`: `bash run.sh` = film.json, bake, single frames, sheet, numbers (50 s for 18 tiles at 600 x 450; `FULL=20,22` adds 1200 x 900 close-ups; `FRAMES=` picks tiles). `sets` in it is a link to this folder.

## Numbers
- Truck: 103,256 triangles, 1,482 meshes, 337 named part kinds; 8.02 x 2.4 (2.6 over mirrors) x 2.89 m.
- Spray gun 5,816 tris / 38 kinds; compressor 14,120 / 49; tin 5,100 / 17.
- `tools/measure/detail_density.py`, full-size close-ups (1200 x 900): pump panel edge 0.2225, regions 1310, fine 1196; door lettering 0.0963 / 446 / 339; spray kit 0.1642 / 636 / 514; gun in fist 0.1444 / 605 / 505.
- Whole-truck tiles (600 x 450): edge 0.10-0.15, regions 615-1430 (`_hero_test/numbers.txt`). Rick's stored whole-frame number is edge 0.087 (rules slice line 126): a different kind of frame, not a pass.
- Render cost here (software WebGL): about 2.5 s per 600 x 450 still with three trucks loaded.

## Weak, seen in the sheet
- Ribbon reads as a white plank: a flat band standing 15 cm off the cab side and straight across the windscreen. The bow is fine.
- Cab glass shows almost no reflection, the windscreen looks empty; the price card is small (36 cm).
- Chrome bumper reads light grey, not mirror; the strong streaks are on the bell, bezels, rails and pump caps only.
- Masking on bell, beacon, siren, horns and mirrors is plain brown bags and boxes; the suction-hose paper is one flat brown sheet.
- Officer's side in the rear 3/4 tiles is in the sun's shadow and reads dark (one key, no fill).
- Wear is light and decal-only (right for a brand-new truck, thin for a close-up of the sill); stone chips read as flakes.
- Sprayed edge is a shader blend (speckle + mist): no real runs or drips on the truck body.
- The spray fan is a flat yellow cone, a stand-in for the vfx mist. The hose tail on the held gun ends above the ground; it is not joined to the floor hose.
- T pull handles on the pump panel read as flat strips at close range.
- Compressor stencil says "ENGINE Co. 3" (the plan now says No. 1).
- Pump panels: the officer's side is a copy of the driver's side.

## Open for other departments
- Lead: OK the town name PINE HOLLOW and the door text; masking vs price card in plan row 4 (PROPS.md "Open").
- Set builder: the yard needs `kit3d: { envGround: '#8f8a7e' }` or the chrome reflects a dark floor. One truck = 1,482 draw calls; rows of trucks need a merged far version (ask props-hero).
- Animator / vfx: `tip`, `fan_end`, `hose_end` anchors on the gun; held3d line at the top of hero_props.js; `scale: 1.7` used in the test.
- Lighting: dusk = `truck.setPaint({ drain })`, tuned so the red lands near `#4B4753`; not looked at in a dusk light.

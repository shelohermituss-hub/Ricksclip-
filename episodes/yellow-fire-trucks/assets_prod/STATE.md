# STATE: production asset pack (props-hero). ROUND 3 2026-11-21 on top; round 2 kept below (condensed). Proof: `props/PROPS_R3.jpg` (8 tiles, looked at), `props/PROPS_R3_phone.jpg`.

## ROUND 3 (2026-11-21): done and seen in a picture
1. Paint frame: `buildTruck` keeps uInvRoot itself (group.updateMatrixWorld / updateWorldMatrix overrides + every paint mesh's onBeforeRender); `T.update()`. Kit tile "rear" (first mesh off screen, NO workaround): lemon rear correct. The stretches' workaround stays harmless (same function kept).
2. LIGHT truck keeps the 4 sirens + beacon row: 43,372 tris (target 42 k; small inner parts dropped). In three.js a light truck shows them only when asked: `buildTruck(THREE, ctx, { light: true, sirens: 4, beaconRow: true })` (default light = plain, so the map/Dallas rows do not change).
3. Plate "LIBAU / LAND OF LINCOLN" gone from every variant (full, light, toy): 1940s cream porcelain plate "PINE HOLLOW / F.D. 1 / FIRE DEPT. 1941"; `setLetters('truck_letters_dal14'|'_dal22')` (kit) and `T.set_letters` (Blender) swap it to "TEXAS / DALLAS".
4. Milk van: cream baked INTO the texture (GLB and blend), cornflower stripe = geometry both flanks (0.90-1.04 m), decal placed on the outermost of 5 rays (+1 cm). Kit and Blender both show "Meadowbrook DAIRY".
5. Ribbon: per-side outer profile of the body at 0.86 m (fenders/running boards excluded, window 0.2 m, smoothed), 1.2 cm proud (round 2: convex hull through the fenders, 0.2-0.4 m off).
6. `setPaint({ drainWipe: 0..1 })` (dusk drain runs nose -> tail, soft front 0.4 m) and `setPaint({ wipe: 0..1, from, to })` (repaint nose -> tail via the half-state edge). Blender twins: paint_nodes input `drainEdge`, `T.set_paint(drain_wipe=, wipe=, wipe_from=, wipe_to=)`. Seen: kit + Blender light tiles at drainWipe .5.
7. Red ball (built, 32 cm, seams, stars, grass stain) + lost wagon 1.10 m, kite 1.0 m, boot 0.45 m, watering can 0.56 m, tricycle 0.85 m (downloads, ASSETS.md): `buildLost(THREE, name, { grey })`, `.setGrey(k)`; Blender `props_api.set_grey(root, k)`.
8. `buildToyTruck(THREE, { grey, length })` in assets.js (sync, toy_truck.glb 1.42 MB preloaded, 18,435 tris): 10 tin tabs, front-right hubcap missing, ladder bent 8 deg; `.setGrey(k)`.
9. Lunch box navy in the kit (GLB colour factor; `save(glb_plain=)`), dome end caps added; lemon texture retinted to #E3EA22.
10. Chalk "3x" texture only: `out/chalk_3x.png` (alpha). NO decal mesh / builder yet.

## ROUND 3: NOT done / weak
- S7 red mist and two gun-stroke decals: not built. Mug crest/chip, sandwich, drivers' heads, lunch-box initials, lemon sticker: not built.
- Lost things at phone size (kit lawn tile, camera 6.6 m): readable as shapes but small; the grey reads blue-grey. Boot stands (on its side it read as a hair dryer).
- Wagon is a "Radio Flyer" model: check no brand lettering shows in a close shot. Toy in the kit was only seen tiny (lawn tile); Blender close tile shows it.
- Toy setGrey clones materials on first call: later changes to `toy.paint.color` (s2_shop.js style) no longer apply after setGrey; use setGrey.
- No Rick frame in the repo: no side-by-side, no detail-density pair vs Rick.

## Files (round 3)
- New: `scripts/tex_r3.py`, `fetch_r3.sh`, `bl_props3.py`, `bl_toy.py`, `bl_proof3.py`, `sheet3.py`, `check_glb_colours.py` (guard), `proof/kit_r3/` (proof set + 4 films). Changed: `bl_truck.py` (ribbon, plate), `bl_light.py` (keeps gear, src arg), `bl_props2.py` (van, lunch box, lemon, temp-name GLB writes), `paint_nodes.py`, `truck_api.py`, `props_api.py`, `build_assets.sh`, `sets/assets.js`.
- out/ (new): toy_truck, red_ball, lost_{wagon,kite,boot,watering_can,tricycle} .glb/.blend, badges_pine/dallas.png, chalk_3x.png, props3_meta.json. Rebuilt: truck (182,344 tris), truck_light (43,372), milk_van (19,032), lunch_box (928), lemon.

## Numbers (round 3, 640x480; proof/numbers_r3.json)
- Blender Cycles 16 spp + OIDN s/frame: hero 5.3, light 4.8, van 8.3, lawn 9.6, close 12.8. Kit one-frame runs (load incl.): 8.2 / 8.6 / 7.6 / 19.9 s.
- Edge density: hero BL 0.076 / kit 0.076; rear kit 0.079; light BL 0.035 / kit 0.033; van 0.038; lawn kit 0.057; close 0.052.

## Round 2 (condensed)
## NOT done / weak (seen in the round-2 tiles)
- PRIORITY 3 not started (head mirror, trial-lens case, chalk, slate boards RED/LIME + tallies + "UP TO 3x", 4-leaf calendar, ladder sections, red ball + five lost things, order sheet REPAINT: RED).
- three.js side: assets.js extended (kraft tyres, runs, beacon wave, setExtras/setLetters/setAge, light truck, buildProp2, buildMilkBottle, buildMug) and passes `node --check`, but NO kit still was rendered this round: unverified in a picture. Toy truck not wired in three.js (needs uniforms wscale/chipZ).
- Chief's ENGINE No. 2 reads almost as new at a wide shot: older chrome + wear 1.0 are subtle; soot is not visible. Needs stronger soot / faded paint.
- Toy truck: geometry is a true 18 cm miniature, but on the yard concrete it reads full-size (no scale cue, no depth of field) and the tin wear is not visible.
- Lunch box (built, 880 tris): the dome has OPEN ENDS (no end caps), reads glossy plastic, a latch reads as a white square; the lemon sits against the handle. Lunch box and milk bottle (built) replace downloads that were modern (plastic food box, plastic jug). Lunch box is plain: no initials, no dents.
- Missing story marks: lemon sticker, MAYOR engraving + cut-ribbon end on the scissors, mug chip/crest/lemon print, bottle crack, van dented wing + bare hub (asset wheel keeps its cap), air horns in a row (row 17), plaster pop.
- Paint runs widened (3.5 cm, bead 7.5 cm); water-stain streaks (wear G) on the red also read as pale drips: possible confusion with the runs.
- Dusk light still the Poly Haven HDRI (look dept owns plum/apricot). No Rick frame in repo; no phone-size check done.
## Files (sources committed by the lead; out/, build/, logs/, proof tiles git-ignored and rebuilt)
- `build_assets.sh` now also: 9 new Sketchfab fetches (retry on 429), `scripts/bl_light.py` (light truck), `scripts/bl_props2.py` (van, hubcap, bottle, crate, lunch box, lemon, 3 paint tins, mug, ribbon set, plaster), `--proof` adds `scripts/bl_proof2.py` (groups hero, fleet, props) + `scripts/sheet2.py` -> props/PROPS_R2.jpg.
- `bl_truck.py` section 5b: 4 sirens, beacon bar + 5 beacons, price card, split windscreen (driver pane papered, passenger pane clear), plaster anchors; masking 2 = kraft on tyres; `mask_paper`/`mask_kraft` fake users (LECONS).
- `paint_nodes.py`: RUN_* constants (runs visible at medium), inputs `wscale`, `chipZ` (toy). GLSL twin in `sets/assets.js` uses the same constants.
- `truck_api.py`: set_beacon(wave=), set_extras, set_letters, set_age (call AFTER set_paint: set_paint resets wear), kraft masking. `tex_make.py`: newspaper 2048 (masthead, headlines, ruled columns), kraft, price_card, 4 letter decals (e1, e2, dal14, dal22), van_decal, 3 can labels.
- out/: truck.glb 28.3 MB 181,840 tris; truck_light.glb/.blend 35,042 tris; milk_van 18,572; hubcap 1,536; milk_bottle 1,712; milk_crate 2,280; lunch_box 880; lemon 7,492; paint_tin_* 31,784; mug 12,288; ribbon_set 67,488; plaster 140 (props2_meta.json).
## Frames
Truck as round 1 (front -X, driver -Y, Z up, origin on the ground, 7.59 m). Sirens at x -2.40 (y +-0.27, +-0.78), beacon bar x -1.42 (5 beacons y 0, +-0.38, +-0.76). Card on the dash behind the +Y pane. Milk van: front -X, 5.40 m. Props: origin on the ground, Z up.
## Numbers (4 CPU, Cycles 32 spp + OIDN, 800x600; proof/numbers_r2.json has every tile)
- s/frame: hero 16.8-31.0, Chief 11.9/27.4, light-vs-full 16.4, Dallas 20.0, toy 18.5, van 10.4, hubcap+bottles 15.4, ribbon set 12.5, lunch box 13.6, tins+mug 19.0.
- Edge density (400x300 tiles): hero medium 0.074, card crop 0.160, windscreen 0.175, runs side 0.117, roof dusk 0.092, Chief wide 0.047, Chief door 0.185, Dallas 0.064, van 0.043, small props 0.021-0.057.
## Open for the lead
- three.js kit tile of round 2 (assets.js changes unverified in a picture). Look dept: dusk light. Set-builder: the station needs bay 2 for ENGINE No. 2.
- Chief's truck aging and toy scale cue need one more round. Accept the built lunch box / bottle (downloads were modern) or ask for another search.

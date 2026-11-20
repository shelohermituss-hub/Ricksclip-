# STATE: production asset pack (props-hero, round 2, 2026-11-20). Proof sheets: `props/ASSET_PACK.jpg` (round 1), `props/PROPS_R2.jpg` (round 2, looked at).

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

# STATE: style test (look-finisher), round 1 = BLOCKOUT + LAYOUT (2026-11-21)

## Built
- look/build_scene.py (`blender -b --factory-startup --python look/build_scene.py -- info|preview [out.png]`, env SPP PCT EXPO FILL):
  camera, Rick day light (rick_light.json "day": sun 7 #ffe2c0 angle 1.2 el 45, Light Path camera/glossy sky #1a86f2->#0f79e8 + cumulus band
  el 10-45 deg, fill #b4c3f0 x .85), grey/tinted blockout at planned sizes, draft cast cards (self-lit, turned about Z only, sun-facing shadow
  card, contact patch), water stand-in (Principled transmission 1, IOR 1.333, rough 0), outline id pass (lines_key), cast mask pass.
  Writes LAYOUT.json and saves scene.blend.
- LAYOUT.json (round 2, lead fixes): metres, Z up, camera (0.35, 2.6, 1.0) heading 2 deg left, pitch +1.5, 26 mm vertical 36 mm sensor; car yaw 26 deg, FRONT three-quarter to the lens
  (Blender rot_z -26), every piece's point + _screen_numbers (screen x/y from top-left, depth, card visible share, down-angle).
- look/cast_draft/: my draft cards (farmer + soccer kid from the bible, posed) used only until character-artist fills cast/.
- assets/buick54/buick54.glb: Sketchfab "FREE 1950s American Sedan 3 (1954 Buick based)" by robinmikart, CC BY 4.0, uid bcbaca10cf23460eb92a12e2487669be,
  107k tris, credits plane (Object_92) and plate text (Image_25) to blank. Downloaded before the plan change: for props-hero to take or drop.
- look/prev/blockout_raw.png (540x960, 16 spp + OIDN, 16 s), blockout_final.png (finish_key DAY + lines), blockout_numbers.json.

## Numbers (blockout, 540x960)
raw p1 .102 p50 .416 p99 .844 mean .466 contrast .171 sat .566 | final p1 .060 p50 .414 p99 .964 mean .459 contrast .192 sat .479
shadows .12/.19/.13 (green lawn) | DAY target p1 .061 p50 .467 p99 .966 mean .48 contrast .208 sat .381 shadows .134/.153/.178.
Screen: grandpa x .79 (top .37, feet .68, 31 % of frame height), kid x .16 (visible .94), car .22-.98, reel lower right .95/.82, house centre, tree top right.

## Weak / open
- Composition deviates from SHOT.md on purpose: a 0.9 m lens sees nothing below ~1.05 m behind the hood, so a kid "behind the car" shows only
  his head (visible share .19-.21 measured). Kid now on the lawn beyond the car front (left), car in the right 3/4 (wider than 45 %: at 45 % the
  cast was 16 % of frame height). Lead to confirm.
- grade_rick on the flat bright blockout drive near the lens posterises/clips (white blotches lower left). Re-check on the real concrete; if it
  stays: EXPO -0.7 and a lower concrete albedo before the grade.
- Waiting for: props/ (car, bucket, sponge, hose+reel, water arc+drops, mailbox, bike), set/ (house, garage, drive, lawn, tree), cast/ (cards + CAST.md).
  Next round: assemble mode (append their collections at LAYOUT points, replace bo_*), preview 540x960 16 spp, then final 1080x1920 64 spp CPU in background.

## Lessons (problem, cause, fix, guard, proof)
1. Kid hidden behind the car: camera 0.9 m is below the hood line (1.04 m), so everything behind the car under ~1.05 m is masked. Fix: kid on open
   lawn beyond the car front. Guard: info mode prints visible_share per card (must be > .8). Proof: .21 -> .94.
2. Car faced the wrong way: Blender rot_z +a turns the -Y front toward +X, but the layout vector f turned it toward -X. Fix: objects use rot_z = -YAW.
   Guard: car_corners screen numbers (front corner must be screen-left). Proof: blockout 1 vs 2.
3. Blender 5.3 File Output writes `<prefix>_/pass_mask.png` (a folder), not `<prefix>_mask0001.png`. Guard: `find -name "*mask*"` before finish_key.
4. grade toward DAY on a flat near-white surface posterises it (blockout drive). Guard: look at the near ground after grading. Proof: prev/blockout_final.png.

## Round 2 (lead: front three-quarter, kid 25-30 %, grandpa at the fender, no blotches)
Car centre (0.9, 10.6), front (grille, 2 headlamps, chrome bumper) to the lens, car .27-.87 = 60 % of width. Kid (-0.62, 5.85) 3.25 m from the lens,
27.6 % of frame height, x .16, visible 1.0. Grandpa at(car, 1.55 fwd, 1.3 side) beside the front fender, x .77, bucket at his feet x .82.
Concrete #a7a6a3, EXPO -0.7: graded near drive clean (no blotches). Final p1 .059 p50 .427 p99 .967 mean .461 contrast .189 sat .450.
Mailbox moved to the left edge (no blockout re-render; LAYOUT re-run). Bike is outside the frame at this lens (props-hero may skip it).

## Round 3: ASSEMBLY + FINAL (look/assemble.py; `blender -b --factory-startup --python look/assemble.py -- info|preview|final [png]`)
- Appends set/set.blend (SET_style_test; Line names read from a second append, then deleted) + props.blend (car, bucket, chamois, reel, mailbox,
  bike); sponge/water/hose re-made here: hose via props/hose_tool.make_hose to the kid's back fist (nozzle x1.35+, barrel through both fists),
  water via make_water from the nozzle tip to grandpa (apex from the barrel slope), 90 drops + 160 mist droplets, arc thickened 12 mm.
- Cards: cast/*.png, emission 2^-EXPO; kid split at px row 1080: upper card pushed 0.9 m back along the lens rays (same picture) so nozzle and
  water start sit in front of him; fist overlay card in front of the nozzle; shadow cards (full figure), contact patches (grandpa .8 dark).
- Mailbox moved to set-local (2.5, -4.0) (right lawn, right edge). Leaves: HSV hue .46 sat 1.3 value 1.7 on island_tree_02_leaves.
  Foam: opaque white, bubbles x1.9 (lens sees the hood edge-on). Water: transmission .6, coat 1, SSS .25, IOR 1.333.
- Final: look/final/st_raw.png, 64 spp + OIDN, 1080x1920, Cycles CPU: render 378 s, lines 12 s, wall 474 s (with the 80 s load).
  STYLE_TEST.png (graded DAY + lines), STYLE_TEST_preview.png (= prev/asm4_final), STYLE_TEST_numbers.json.
- Final numbers: p1 .077 p50 .438 p99 .990 mean .442 contrast .202 sat .422 shadows .169/.177/.154 (target .061/.467/.966/.480/.208/.381,
  .134/.153/.178); lines on 4.5 % of pixels. Raw p99 .993 (< .995 guard).
## Weak (final)
- Water arc: its first ~30 cm after the tip vanish against the bright house (thin glass): reads as starting above the hood.
- A short green hose loop shows beside the nozzle (segment going back along the lens ray). Shadows rgb warm-green (lawn), not blue-violet.
- Tree crown fills the top half (layout); sky only top-left. Foam reads as a few white heaps on the hood only.
## Lessons
5. Water leaving a card-held nozzle is hidden by the card when it heads into depth. Fix: split the card at the knees, push the upper part
   back along the lens rays (scale about the camera). Guard: zoom the nozzle area. Proof: prev/asm3 vs asm4.
6. Appending a second collection that holds the same objects duplicates them (.001). Fix: read names, strip suffixes, delete the copies.

## Round 4: LIBRARY nature (CB_RULES 3 point 1b + THE ASSET LIBRARY)
- Set's Poly Haven trees (hero + 13 far, 1.07 M tris each x2), lawn_hair (973k strands) and grass_near_blades deleted in assemble.py;
  library rick_tree (yard tree near, 22 clumps, seed 8, clump_var .55-1.6; 13 far trees lod mid) + rick_grass (lawn_material on lawn_soil,
  tufts: lens band 1.0-2.6 m h .2, both drive edges, trunk ring, fence; blade colours root #5e9a28 tip #b0d84c).
- Lawn/blade bounce greyed for non-camera rays (Light Path -> saturation .2); sky fill #a6b6f2 (was #b4c3f0).
- Water: opaque blue-white core tube on the first 0.42 m; hose ends along the lens ray behind the back fist, nozzle built separately (no loop).
- Rendered tris 32 M -> 2.22 M. Final 1080x1920 64 spp: render 378 s -> 264 s, lines 12 s -> 2 s, wall 474 s -> 361 s. Preview 38 s -> 19.5 s.
- Final numbers: p1 .070 p50 .457 p99 .994 mean .456 contrast .209 sat .443 shadows .152/.169/.134 (DAY .061/.467/.966/.480/.208/.381).
- Weak: shadows metric still green (darkest pixels = grass/tree undersides); drive shade .49/.49/.52 (recipe #898d9a .54/.55/.60);
  a short gap remains where the stream crosses the white face edge; far trees read as round puffs (no trunks seen); lens tufts darker than lawn.
- Library: library/trees/rick_tree.py got an optional clump_var parameter (default unchanged), noted in library/trees/STATE.md.

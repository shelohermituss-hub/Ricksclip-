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

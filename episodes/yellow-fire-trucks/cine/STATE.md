# cine/ STATE: key frames A and B in THE RICK RECIPE (look-finisher, 2026-11-21 evening). A2 + B2 previews done, runpod/A2 + runpod/B2 READY (not sent).
Old v1 keys (build_A.py, build_B.py, grade_key.py, runpod/A, runpod/B, CINE_KEYS.jpg) are kept as history; the v1 grade (warm haze, lavender veil,
sun bands, sat x1.62) is NOT used any more (LOOK_BIBLE v2).

## Files
- build_A2.py (run from sets/town: `blender -b out/town.blend --python ../../cine/build_A2.py -- info|preview|package`, env SUN_AZ SUN_EL EXPO FILL PCT SPP)
- build_B2.py (run from sets/lamproom: `blender -b out/lamproom.blend --python ../../cine/build_B2.py -- preview|package`)
- finish_key.py = grade_rick (world only, cast mask) + thin lines + rick_grade_study numbers. rick_targets.json = Rick targets, numbers only.
- runpod_kit/job.py + render.sh (copied into runpod/A2, runpod/B2 with job.env). recipe_sheet.py -> RECIPE_KEYS.jpg.
- prev/A2_raw.png, A2_final.png, A2_numbers.json, A2_lines_id.png, A2_/pass_mask.png, A2_raw_lin.exr; same for B2 (B2_final = strength .45).
- templates/blender_look/rick_outline/lines_key.py (new) + composite.py --key (new mode; exercise mode behind --exercise) + README.

## A2 (S1 f0): what changed (staging, camera, cards, props identical to build_A.py)
- Sun: preset day (7, #ffe2c0, angle 1.2). Sun scan (info mode, 54x96 camera rays): az 265 el 45 = hero card 100 % and hero-truck front 88 % in sun
  (az 255 el 28 of v1: truck front 71 %). Shadows fall back-right, lifted blue-violet.
- Sky: Light Path (camera OR glossy) = flat blue #1a86f2 -> #0f79e8 + noise cumulus in el 3-28 deg; other rays = fill #b4c3f0 x1.36 (preset .85 x1.6).
- Exposure -0.7 EV, view Standard. Lavender fill and cream rim area lights removed; lemon bounce kept (film signature).
- Trucks: paint Metallic .55, Coat 1 / coat rough .03 (roughness stays linked to the paint group), wear .05; tyres un-masked (mask==2 kraft ->
  tyre_black), redwheel -> cine_rim_red (#D3141C metallic .45 + coat). Masking paper on the body stays (story).
- Trees/grass: the town already uses Poly Haven island_tree_02 + grass_bermuda_01 (realistic); only one tree tip is in A. No download made.

## Numbers (540x960, Cycles CPU 16 spp + OIDN; rick_grade_study stats, full frame incl. cast)
| | p1 | p50 | p99 | mean | contrast | sat | shadows rgb |
| DAY target | .061 | .467 | .966 | .480 | .208 | .381 | .134 .153 .178 |
| A2 final | .068 | .498 | .959 | .484 | .231 | .299 | .192 .135 .150 |
| INTERIOR target | .082 | .438 | .940 | .429 | .220 | .364 | .154 .149 .143 |
| B2 final (.45) | .053 | .283 | .901 | .345 | .207 | .331 | .179 .158 .215 |
A2 render 89 s + lines 3.1 s (+ ~45 s load). B2 31 s + 2.1 s. Lines: A 3.7 % of pixels (809 objects), B 1.5 % (185).

## Weak (below Rick or below the kit), named
- A sat .30 vs .38 full frame (world is graded to .381; the big white hero card, grey concrete and clapboard pull it down). Not forced: more would burn the red.
- A shadows rgb warm (.19/.14/.15): the dark pixels are mostly red truck, tyres and black hats; the concrete shade itself reads cool lavender.
- A sunlit red cab front is very bright, near clipping in red; front rim reads orange-red (lemon bounce + lemon mist next to it).
- A no cumulus visible: the only sky is the top-left corner at > 30 deg elevation. The lemon spray is grainy at 16 spp (512 on GPU should clear it).
- B: INTERIOR at full strength washes the dome lavender (p50 .43): graded at strength .45 with sat floor = raw. Dome between bulbs lighter than the
  kit's near-black; sat .33 vs kit .73. The lead decides whether B should follow INTERIOR at all (it is a dark lamp dome).

## RunPod packages (NOT sent; no pod created)
runpod/A2 (201 MB scene.blend) and runpod/B2 (25 MB): 0 libraries, 0 linked ids, 0 unpacked images, RICK_LINES stored, 1080x1920, 512 spp adaptive .01
+ OIDN, Standard. `bash render.sh`: job.py tries OPTIX then CUDA, prints "DEVICE OPTIX ...", exits 3 with NO_GPU if neither (tested here: exit 3);
then lines pass, then finish_key.py -> out/<NAME>_final.png + numbers.json. Tested from scratch copies with ALLOW_CPU=1 PCT=10 SPP=8:
A2 68 s, B2 4 s, both DONE, "not found" 0.

## Lessons (problem, cause, fix, guard, proof)
1. Red rims went orange, whites clipped: Standard view + sun 7 at exposure 0 (raw p99 1.0). Fix EXPO -0.7. Guard: read raw p99 (< .995) before grading. Proof: A2 raw p99 .993.
2. Shadows too dark beside a tall building: the station hides half the sky from the yard. Fix: fill x1.6. Guard: sun/fill scan per framing. Proof: RECIPE_KEYS A.
3. grade_rick default targets sit in references/ (private, absent on a pod). Fix: rick_targets.json (numbers only) + --targets. Guard: grep "references" in a package. Proof: pod test ran.
4. INTERIOR targets wash a dark lamp room. Fix: --strength .45 --sat-floor raw. Guard: look at s1/.6/.45/.3 side by side. Proof: prev/B2_final_s*.png.
5. composite.py ran the exercise at import (missing files). Fix: functions + --key / --exercise modes. Proof: import test ok.
6. Line width: 2-sided edges at render size were 2 px. Fix: one-sided edges on a 900x1600 id pass, area-resized. Proof: prev crop, 1 px at 900.
7. Package log printed 6 "LIBRARY" lines (append leftovers) but the saved .blend has 0 libraries: check by OPENING the package, not by the build log.

## Open
- Lead/CB: approve A2/B2 look, then OK the RunPod cost (one new 4090, ~2-4 min per frame estimated from v1, not measured for A2/B2).
- 3d-designer: station clapboard is a photo wood texture (moderate, acceptable); the recipe asks for clean simplified clapboard lines.

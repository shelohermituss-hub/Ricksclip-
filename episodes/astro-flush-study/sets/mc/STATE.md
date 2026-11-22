# mc (mission control, LOOK_INVENTORY C): STATE round 1 (2026-11-22)

Build: `bash build_mc.sh` (tex_mc.py PIL pictures, then bl_mc.py -> out/mc.blend, mc_lite.glb 5 MB with JPEG screens, mc_meta.json).
Stills: `blender -b out/mc.blend -P scripts/still_mc.py -- f180 ...` (RES=270 SPP=8 for a quick check, THREADS=2 default), then `python3 scripts/proof_mc.py`.
Side-by-sides: `references/look_match/astro_flush/work/proof/mc/sbs_<f>.jpg` (hold his frames, stay there). Kit module: `sets/mc.js` (loads the GLB only).
Reused: helper style of library row `yft_town_helpers` as rewritten in sets/toilet/scripts/bl_toilet.py (mat, abox, alathe, aquad, obj with own origin), still/proof scripts after toilet's.

States (mc_api.set_state / mc.js setState): screen map|ring|3|2|1|go|alarm|noflush|offcourse (one plane mc_screen_<state>), mood blue|teal|red-violet|pink,
clock (9 pictures, his digits: MET 17:33 f120 -> 17:38 f270, LOS 12:03 -> 11:59; shot 10 17:55/16:42:19/11:42 -> 17:57/16:42:21/11:40), off (9 OFF COURSE pictures,
DEV 0.0 f803 -> 4.7 f826, red line grows to f860), nogo_box pop f176-180, cover f258-261, press f262-264, bin until f150. `mc_api.frame_state(f)` gives the reference timing.
mc_space_panel: own plane, placeholder picture, rect in meta.space_panel (uv .022-.149 x .035-.435 of the screen). cam_monitor = f283 framing in meta.

## Round 2 (layout solved from his frames with a pinhole model of the Blender camera: director feet/head, pedestal domes, controller heads, screen top)
Desk 1.87 m (heads .62 m apart as his), x -1.5..0.37, y -12.25, 0.95 m tall, GUIDO end just left of the GO pedestal; controllers y -11.6; director (0.9, -13.21);
GO pedestal (0.49, -13.0), NO GO (1.44, -13.3), box tops 0.98 m (his domes at the director's waist); counter x 1.75-3.6 y -10.7. Cameras: f180-f283 one lens
(34 deg) pushing in from y -21.5 to -19.8; f140 own camera (34 deg, y -17.5, looking up at the screen); f820/f860 low and close (38 / 34 deg, y -17.7 / -17.3).
Fills greyer (moods in params). Kit test: scratchpad film, `render_gpu.mjs --frames 0 --scale 0.5 --grab fast` loads mc.js (77 meshes, 69.5k tris), GO screen + teal
state from "keys": "reference"; fixed: clock/OFF COURSE pictures are now preloaded (the swapped clock plane rendered black on the first frame).

| frame | mean L ours / his | p1 | p99 | mean sat |
|---|---|---|---|---|
| f140 | 0.293 / 0.267 | 0.012 / 0.007 | 1.000 / 0.978 | 0.530 / 0.549 |
| f180 | 0.333 / 0.304 | 0.017 / 0.008 | 1.000 / 0.997 | 0.530 / 0.503 |
| f200 | 0.315 / 0.283 | 0.016 / 0.008 | 1.000 / 0.996 | 0.508 / 0.481 |
| f235 | 0.338 / 0.298 | 0.018 / 0.007 | 1.000 / 0.997 | 0.510 / 0.491 |
| f270 | 0.295 / 0.273 | 0.012 / 0.006 | 1.000 / 0.999 | 0.557 / 0.489 |
| f283 | 0.327 / 0.286 | 0.012 / 0.003 | 1.000 / 0.999 | 0.458 / 0.490 |
| f820 | 0.352 / 0.299 | 0.012 / 0.006 | 1.000 / 1.000 | 0.418 / 0.440 |
| f860 | 0.404 / 0.332 | 0.012 / 0.006 | 1.000 / 1.000 | 0.394 / 0.429 |

Still wrong, worst first (round 2)
1. Shot 10 too bright (f860 0.404 vs 0.332, f820 0.352 vs 0.299): mostly the big flat white stand-in card (wider than his thin puppet); the room itself is near. Re-measure with the real card.
2. Every frame 0.02-0.04 too bright; p1 0.012-0.018 vs 0.003-0.008 (blacks not deep enough: under-desk, soffit and bezel take too much fill).
3. f270 red-violet saturation 0.557 vs 0.489 (still the most coloured mood); f283/f820/f860 now slightly under his.
4. f140: his room is cheated (screen/desk ratio differs from f180); ours keeps one room, so his clocks sit at 14 % of the height and ours at 20 %, heads at 66 % vs his 68 %.
5. Head size in shot 10: measured on his frames the head is 20 % (f820) and 25 % (f860) of the frame height, not 30 %; ours follows his frames.
6. The GO pedestal is half hidden behind the wide director card at f180-f283 (his thin puppet leaves the dome free); NO GO letters thinner than his; map continents generic.
7. Kit preview: lights are a hemisphere + top + screen point light, darker and greener than the Blender still; DOF of the kit blurs the screen text. Lens of the test station guessed (35 mm).

## Round 1 numbers (old layout)
| frame | mean L ours / his | p1 | p99 | mean sat |
|---|---|---|---|---|
| f140 | 0.232 / 0.267 | 0.012 / 0.007 | 1.000 / 0.978 | 0.633 / 0.549 |
| f180 | 0.313 / 0.304 | 0.016 / 0.008 | 1.000 / 0.997 | 0.591 / 0.503 |
| f200 | 0.290 / 0.283 | 0.014 / 0.008 | 1.000 / 0.996 | 0.565 / 0.481 |
| f235 | 0.334 / 0.298 | 0.018 / 0.007 | 1.000 / 0.997 | 0.569 / 0.491 |
| f270 | 0.269 / 0.273 | 0.011 / 0.006 | 1.000 / 0.999 | 0.632 / 0.489 |
| f283 | 0.281 / 0.286 | 0.012 / 0.003 | 1.000 / 0.999 | 0.537 / 0.490 |
| f820 | 0.319 / 0.299 | 0.012 / 0.006 | 1.000 / 1.000 | 0.488 / 0.440 |
| f860 | 0.334 / 0.332 | 0.011 / 0.006 | 1.000 / 1.000 | 0.474 / 0.429 |

Still wrong, worst first
1. Staging depth: the controller desk is at the director's depth and too far left, so in f180-f283 the three controllers fall out of frame left. His desk sits BEHIND
   the director (smaller heads) and its right end is just left of the GO pedestal. Move the desk about +2 m toward the screen and +1.5 m right.
2. f140 camera is wrong: ours is low and back, desk big, screen small; his is close under the screen, looking up, map and clocks fill the top 2/3, three heads at the bottom.
   His room is not consistent between f140 and f180 (screen/desk size ratio), so f140 probably needs its own cheat (wider lens, camera nearer the desk).
3. Saturation 0.06-0.14 too high in every frame (worst f270 red-violet: 0.63 vs 0.49): the carpet and ceiling take too much of the mood colour. Greyer fills or lower world strength.
4. Screen size vs room: screen is 7.0 x 3.94 m (16:9, his f806 proves 16:9); his screen top sits a bit lower in frame at f180 and the bulkhead/cove is thinner.
5. Side monitors and the right counter books are small and partly out of frame; the director-side pedestal heights (box 1.42 m) not yet checked against his stand-in size.
6. NO GO letters: ours lighter/thinner outline than his; OFF COURSE white letters slightly narrower than his (his 75 % of the screen); map continents are generic shapes, not his exact outlines.
7. Space panel shows a placeholder (by design); his inset sits a little narrower.

## Change by the mc stretch builder (round 2, 2026-11-22, lead's order)
- NO GO pedestal moved 0.25 m toward the director: scripts/bl_mc.py NX 1.44 -> 1.19 (the pedestal x is in bl_mc.py, not in params_mc.json). Rebuilt with build_mc.sh (BUILT mc 77 objects 17 movers).
- NO FLUSHING TONIGHT box: scripts/tex_mc.py make_noflush x 0.12-0.90 -> 0.20-0.80 of the screen (60 % wide, dark screen around), letters 150 -> 118, header 38 -> 30.

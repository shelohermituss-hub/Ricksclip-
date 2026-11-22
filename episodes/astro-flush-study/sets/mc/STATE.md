# mc (mission control, LOOK_INVENTORY C): STATE round 1 (2026-11-22)

Build: `bash build_mc.sh` (tex_mc.py PIL pictures, then bl_mc.py -> out/mc.blend, mc_lite.glb 5 MB with JPEG screens, mc_meta.json).
Stills: `blender -b out/mc.blend -P scripts/still_mc.py -- f180 ...` (RES=270 SPP=8 for a quick check, THREADS=2 default), then `python3 scripts/proof_mc.py`.
Side-by-sides: `references/look_match/astro_flush/work/proof/mc/sbs_<f>.jpg` (hold his frames, stay there). Kit module: `sets/mc.js` (loads the GLB only).
Reused: helper style of library row `yft_town_helpers` as rewritten in sets/toilet/scripts/bl_toilet.py (mat, abox, alathe, aquad, obj with own origin), still/proof scripts after toilet's.

States (mc_api.set_state / mc.js setState): screen map|ring|3|2|1|go|alarm|noflush|offcourse (one plane mc_screen_<state>), mood blue|teal|red-violet|pink,
clock (9 pictures, his digits: MET 17:33 f120 -> 17:38 f270, LOS 12:03 -> 11:59; shot 10 17:55/16:42:19/11:42 -> 17:57/16:42:21/11:40), off (9 OFF COURSE pictures,
DEV 0.0 f803 -> 4.7 f826, red line grows to f860), nogo_box pop f176-180, cover f258-261, press f262-264, bin until f150. `mc_api.frame_state(f)` gives the reference timing.
mc_space_panel: own plane, placeholder picture, rect in meta.space_panel (uv .022-.149 x .035-.435 of the screen). cam_monitor = f283 framing in meta.

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
(f200, f235, f283, f860 stills are from the camera before the last +0.6 m x shift in params; re-render them.)

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

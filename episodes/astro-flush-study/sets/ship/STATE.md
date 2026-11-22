# ship place: STATE (round 1, 2026-11-22)

Sections B (exterior LODESTAR, Earth, stars, flame, glitter), F (cockpit with glass canopy) and G (radio console) of LOOK_INVENTORY.md.
One ship model: body x 0..21.5, nose cockpit x 21.5..26.4 with real interior; radio station on the +Y cockpit wall. 184 set objects, 3 world objects, about 84,000 faces, 35 movers.

## Files
- `params_ship.json`: palette (kept as it was), plus `cams` and `proofs` (one camera and state per proof frame) added.
- `scripts/make_tex.py`: pictures in `tex/` (kept as it was).
- `scripts/bl_ship.py`: builds everything -> `out/ship.blend`, `out/ship_lite.glb`, `out/ship_meta.json`. Run with `build_ship.sh` (`NOTEX=1` skips the pictures).
- `scripts/ship_api.py`: `set_state(scene, light, sun_dir, flame, preglow, glitter, glitter_ck, comm, digits, starmap, shot, ship, earth, earth_emit, fan)`, `set_light(scene, kind)`, where kind is space / warm / map / radio.
- `scripts/still_ship.py`: `blender -b out/ship.blend -P scripts/still_ship.py -- f40 ...`. A proof can give `earth_screen` [sx, sy, dist, angular radius], which puts the Earth on a camera ray.
- `scripts/proof_ship.py`: makes the side-by-sides in `references/look_match/astro_flush/work/proof/ship/sbs_*.jpg` and prints the table below.
- `../ship.js`: kit module. It only loads the GLB and applies states, and makes no geometry. Not yet loaded in a browser.
- Reused: helper functions copied from `sets/toilet/scripts/bl_toilet.py` (library row `yft_town_helpers`). Added alpha/emission pictures, `abeam` and `apoly`.

## Movers
`ship_root` (all ship objects are its children), `earth` (+ `earth_rim`), `flame_core/mid/outer/halo` (origin at the nozzle exit), `nozzle_glow`,
`glitter_trail_0..3`, `glitter_collar`, `glitter_cockpit_0..2`, `solar_fan_p/n` (+ spokes), `float_cup/book/pencil/juice`, `hanging_toy`, `wrench`,
`star_map_sheet` (+ tape), `comm_lamp_on/off`, `mfd_on/off`, `radio_digits_0..3`. Portholes with a real opening: `porthole_a` (aft-most, shot 2) and `porthole_b`
(6th from the nose, shot 11), each with a lit stub room. Card anchors: `newguy_s2`, `newguy_s11`, `navigator_s7`.

## Numbers, round 2 (540x960, 16 spp + OIDN; ours / his)
| frame | mean L | p1 | p99 | mean sat |
|---|---|---|---|---|
| f40 | 0.352 / 0.271 | 0.001 / 0.004 | 1.000 / 0.992 | 0.539 / 0.688 |
| f70 | 0.572 / 0.394 | 0.039 / 0.005 | 1.000 / 0.997 | 0.394 / 0.590 |
| f110 | 0.119 / 0.132 | 0.032 / 0.005 | 1.000 / 0.996 | 0.612 / 0.782 |
| f600 | 0.185 / 0.212 | 0.008 / 0.013 | 1.000 / 0.934 | 0.347 / 0.393 |
| f680 | 0.199 / 0.199 | 0.036 / 0.004 | 1.000 / 0.861 | 0.274 / 0.363 |
| f740 | 0.102 / 0.078 | 0.001 / 0.004 | 1.000 / 0.989 | 0.696 / 0.804 |
| f790 | 0.128 / 0.139 | 0.001 / 0.000 | 0.982 / 0.964 | 0.681 / 0.546 |
| f880 | 0.255 / 0.245 | 0.000 / 0.000 | 0.712 / 0.890 | 0.290 / 0.362 |
| f990 | 0.098 / 0.064 | 0.049 / 0.005 | 1.000 / 0.772 | 0.548 / 0.881 |

## Round 2 changes
- Earth picture is now 4096x2048 with warped cloud swirls, vivid green land and cyan shallows. The hard sun is tamed by a Hue/Sat value of .62, the rim is thicker (power 6, #bfeaff), and the Earth is turned so its equator faces the lens.
- The kit gets JPEGs: `out/earth_kit.jpg` and `out/stars_kit.jpg`, both 4096 wide. The GLB carries 8x4 stand-in pictures for the Earth and the sky (6.3 MB, down from 11.6).
- Windows: 9 a side, 2.3 m apart, opening .55 x .85, frame .26 wide. `porthole_b` is now window index 3 (x 8.3).
- Hull panels have irregular widths. In the stub room the inner porthole sits in the opening's view and the red rail is low.
- Flame is longer (5 soft layers up to 48 m, white core). Glitter trail is sparse (110 points per step). Back-wall slats are flipped. There is a warm `wall_wash` spot light, and the radio body is maroon.
- API: `sun_k`, `sky_rot` and `wash` were added. `still_ship.py` resets the state before every proof; before this, the f110 ship pose leaked into later stills.
- Ship poses are in params and meta: `ship_poses.shot2_f110_away`.
- Kit test: a private film in the scratchpad (`kit_test/film.json`, the `sets` link points at the episode's sets), rendered with `render_gpu.mjs --frames 0,12 --scale 0.5 --grab fast`. `ship.js` loads (130,868 tris, 151 ms), and keys switch flame, glitter and comm. `sets/vendor/` holds GLTFLoader.js and BufferGeometryUtils.js, copied from plane-eater.

## Still wrong, worst first (round 2)
1. Earth at f70 is still blurry and stretched, with flat green land and no cloud detail. That camera sees a small area of the globe, so 4096 is not enough there. Needs a detail cloud layer that tiles, or a separate cloud shell. Also f70 is too bright (0.57 vs 0.39). f40 now reads (clouds, rim, glare) but is still too bright. The sun glare spot is centred, not at the lower right.
2. Kit: the picture stays a flat blue wash. The kit light preset (here "night") or its post greys the frame, and the stars dome and Earth do not show. The kit's glow sprites on emissive meshes make a huge white halo around the flame and glitter. ship.js does switch states correctly. Needs a space light preset / `light_over` and no glow sprites on flame or glitter.
3. f110: the flame is still a hard purple spindle with no soft halo and no white core visible. His is a soft wide plume. The Earth corner is too small.
4. f990: the sky is still too bright (p1 0.049; the nebula is everywhere, so sky_rot does not help; needs a darker region or a sky dim state). The fans are still small and dark-blue edge-on rather than pale-blue discs. The glitter is still clumped near the tail.
5. f680: the camera is too far and too high, and the interior is cut by the bars. The hull is light grey, not warm tan. Brightness matches (0.199).
6. f600: the camera is too far and centred on the chair. His is closer, with the navigator head larger and the side glass bars at the frame edges. The wall wash makes a hot spot at the roof.
7. f880: the porthole frame is too big in frame (the camera is now too close) and too dark grey. The bolts read as dark posts. The room shows the stand-in in front of the inner porthole.
8. f790: closer to his, but the panel still fills the top half and the radio sits low-left. The cube lever block is too big.
9. f740 is unchanged (the pencil mover is still in view).

## Round 3 (cameras by fit, cloud shell, kit space light)
- `scripts/fit_cams.py`: it reads the points in params "fits" (pixel on his frame + model point), solves by least squares and writes the cams with `fit_rms_px`. With the lens free the fits run off to very wide, close cameras, so each lens is fixed (f40 45, f70 45, f600 50, f880 40, f990 45, f790 55).
- Fit rms: f40 14 px, f70 11 px, f880 23 px, f990 25 px, f790 42 px. f600 fit 1 px on 4 lamp points, but they are coplanar, so the solve is not reliable; f600 stays by eye. f680 is not fitted (by eye).
- Model changed from what the points measured:
  - Windows: 10 a side, opening .5 x .76 with a .12 frame, 1.45 m apart, a larger gap after the aft porthole. `porthole_b` is now window 2 (x 4.75), so the letters are not above it.
  - LODESTAR is on the side band above the windows (4 m word).
  - Arrays stand above and below the truss.
  - Fans are 8.4 m across on side booms.
  - The navigator card is moved forward to x 24.2.
- Earth: a procedural cloud shell (`earth_clouds`, noise with warp, alpha, pale-blue shade); base darkened (value .5). The kit uses `out/cloud_tile_kit.png` (seamless 2048, repeated 6x3).
- Flame: 5 layers, soft at the edges and fading along the length (`flame_mat`: layer weight x length gradient).
- ship.js space light:
  - hides the kit gradient sky (baseLight), no fog, black background, the kit hemisphere fill dimmed to navy, the kit sun put at the Blender key;
  - sky, Earth, rim, clouds, flame and glitter use unlit basic materials (toneMapped false);
  - the additive flame blending is removed.
- Proof: `references/look_match/astro_flush/work/proof/ship/kit_vs_blender.jpg` (kit f0, kit f12 with the flame on | Blender f990, f110).

| frame | mean L | p1 | p99 | mean sat |
|---|---|---|---|---|
| f40 | 0.250 / 0.271 | 0.000 / 0.004 | 1.000 / 0.992 | 0.583 / 0.688 |
| f70 | 0.317 / 0.394 | 0.007 / 0.005 | 1.000 / 0.997 | 0.630 / 0.590 |
| f110 | 0.105 / 0.132 | 0.032 / 0.005 | 1.000 / 0.996 | 0.614 / 0.782 |
| f600 | 0.212 / 0.212 | 0.008 / 0.013 | 0.905 / 0.934 | 0.357 / 0.393 |
| f680 | 0.204 / 0.199 | 0.036 / 0.004 | 1.000 / 0.861 | 0.276 / 0.363 |
| f740 | 0.102 / 0.078 | 0.001 / 0.004 | 1.000 / 0.989 | 0.696 / 0.804 |
| f790 | 0.182 / 0.139 | 0.005 / 0.000 | 1.000 / 0.964 | 0.693 / 0.546 |
| f880 | 0.211 / 0.245 | 0.000 / 0.000 | 0.785 / 0.890 | 0.349 / 0.362 |
| f990 | 0.117 / 0.064 | 0.049 / 0.005 | 0.997 / 0.772 | 0.521 / 0.881 |

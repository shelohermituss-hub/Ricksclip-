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

## Numbers (540x960, 16 spp + OIDN; ours / his)
| frame | mean L ours / his | p1 | p99 | mean sat |
|---|---|---|---|---|
| f40 | 0.294 / 0.271 | 0.004 / 0.004 | 1.000 / 0.992 | 0.629 / 0.688 |
| f70 | 0.327 / 0.394 | 0.008 / 0.005 | 1.000 / 0.997 | 0.643 / 0.590 |
| f110 | 0.214 / 0.132 | 0.008 / 0.005 | 1.000 / 0.996 | 0.748 / 0.782 |
| f600 | 0.148 / 0.212 | 0.005 / 0.013 | 0.993 / 0.934 | 0.375 / 0.393 |
| f680 | 0.116 / 0.199 | 0.008 / 0.004 | 0.935 / 0.861 | 0.432 / 0.363 |
| f740 | 0.112 / 0.078 | 0.007 / 0.004 | 1.000 / 0.989 | 0.677 / 0.804 |
| f790 | 0.190 / 0.139 | 0.008 / 0.000 | 0.992 / 0.964 | 0.624 / 0.546 |
| f880 | 0.314 / 0.245 | 0.000 / 0.000 | 1.000 / 0.890 | 0.284 / 0.362 |
| f990 | 0.143 / 0.064 | 0.057 / 0.005 | 1.000 / 0.772 | 0.473 / 0.881 |

## Still wrong, worst first
1. Earth has no clouds at this zoom. `earth.png` is too coarse when one cap fills the frame: it reads as a smooth blue and green ball with a cyan rim, where his has big white cloud swirls and a sun glare (f40, f70, f110). Needs a higher-frequency cloud layer, or a separate cloud shell.
2. f110: the ship flies the wrong way. Its nose points down-left and the flame points up-right; in his the flame goes to the lower right. The flame is also about half his length and too narrow, and too white-violet with a hard edge. The ship needs a yaw/pitch pose for this shot (the `ship` state exists but is not set), not only the camera.
3. f990: the round solar fans are edge-on, dark and small, where his are big pale-blue discs facing the camera. Their normal should tilt toward the camera (`fan` state or a build change). The sky here is too bright: p1 0.057 against 0.005, from the purple nebula behind. The ship is a bit small, and the glitter trail is a dense white blob where his is sparse.
4. f680: too dark (L 0.116 against 0.199). The hull does not take the warm grey-tan key (#736870). The glass box reads as black slabs and the nose skin is black, where his is light with a bright interior. The camera is too close and from the wrong height. His has a blue fan behind the roof.
5. f600: the interior is too dark (0.148 against 0.212). The slats are lit only near the lamps, with no bright fan on the back wall. The chevron slats point down where his are diagonal panels. The glass frame/brow crosses the top third, and the front centre bar has been removed. The navigator card is a stand-in.
6. f790: the camera looks too steeply down and too close. The juice-box brow (a yellow blob) comes in at the top left. The upper panel is too small in frame, and the radio body is pinkish-grey where his is maroon.
7. f740: the map is right. The pencil mover floats into the view (the yellow cylinder at the bottom). His sheet is a bit smaller and tinted.
8. f880: the hull panels are lighter than his and too evenly spaced. The stub room shows the red rail across the opening, where his shows a white wall and a purple inner porthole. The stand-in sits in front of it.
9. f40: the hull shoulder catches too much light, and our windows are smaller and closer together than his. The LODESTAR letters are thin at this size. The rectangular solar arrays are not in frame where his show at the right edge.
10. GLB is 11.6 MB because `stars.png` (8192x4096) and `earth.png` are embedded. The kit may want a smaller sky picture.

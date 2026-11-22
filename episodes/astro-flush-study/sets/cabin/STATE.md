# STATE: place `cabin` (LOOK_INVENTORY D ship cabin day + E sleep bay night), round 1, 2026-11-22

Round 1 = "readable and going the right way". Not committed.

D and E are TWO ROOMS, not two walls of one module: D has grey riveted panels, a teal rail and a quilted lower wall on a light dotted floor;
E has dark blue panels, a wall that leans in with skylights, portholes, a blue end wall with the door and a dark grate floor. Nothing is shared.
Both rooms are in ONE blend: the cabin around x 0 (back wall y 1.5), the sleep bay around x -12 (bag wall y 1.2, end wall x -9.5,
toilet room beyond the door). State `mode` day / night switches the lights and world.

## Files
- `params_cabin.json`: palette (one hex per surface, D1 + E1), 7 cameras (`cams`: f284 start of the pull-back + the 6 proofs) and the proof states (`proofs`).
- `scripts/tex_cabin.py`: PIL pictures in `tex/` (HEAD sign, LINK • HOUSTON FLIGHT label, monitor placeholder, MEGA SIP cover, clipboard grid, 4 drawer labels, bag label, porthole stars, kid drawing MY DAD, crisp bag, bay door sign).
- `scripts/bl_cabin.py`: builds both rooms -> `out/cabin.blend`, `out/cabin_lite.glb` (collection `cabin_set` only, 94 objects, 75k faces, 8.9 MB), `out/cabin_meta.json`.
- `scripts/cabin_api.py`: `set_state(scene, mode, bag_new_guy, door, shot, sway, monitor)`, `set_light(scene, kind)`, `set_monitor(png)`.
- `scripts/still_cabin.py`: `blender -b out/cabin.blend -P scripts/still_cabin.py -- f300 f330 ...` (about 10 s per still, 540x960, 16 spp + OIDN).
- `scripts/proof_cabin.py`: side-by-sides -> `references/look_match/astro_flush/work/proof/cabin/sbs_<frame>.jpg` + the table below.
- `build_cabin.sh`: pictures, midline check, Blender build (about 3 s).
- `../cabin.js`: kit module, loads GLB + meta only. mode (lights from meta: SUN -> directional with shadow, SPOT, POINT/AREA -> point), bag_new_guy swap, door, sway, `setMonitor(texture|url)`, `mover(name)` / `rest(name)`.
  Ran with `render_gpu.mjs --frames 0 --scale 0.5 --grab fast` on a private test film (scratchpad, place `cabin`): day and night both load (94 meshes, 168k tris, 0.15 s), 3.2-4.7 s per frame in software WebGL. Fixed: sun too strong (sun_scale 0.55 -> 0.4).

Reused: the helper block of `sets/toilet/scripts/bl_toilet.py` (after library row `yft_town_helpers`), plus new `arrplate`, `asph`, `multi` (one object, several flat materials), `panels` (any wall direction, z offset).

## Monitor picture
`cabin_monitor_pic`: 1.26 x 2.24 m (9:16 portrait) emissive plane, placeholder `tex/monitor_placeholder.png`; centre, normal and the 4 corners in meta `monitor_pic`.
It shows mission control for the whole of shot 4 (f284-410). Blender: `set_state(monitor=<png>)`; kit: `setMonitor(...)`.

## Movers (meta `movers`, 15)
magazine (with its black straw), drink_ball (red/white ball + straw), clipboard, pencil, float_tube, float_book, float_crisps, float_strip, float_pen,
bag_navigator, bag_commander, bag_new_guy (full) / bag_new_guy_open (empty; swapped by `bag_new_guy`), all origins at the hook (`sway_deg` 2.5),
bay_door (`open`: slides 1.25 m into the end wall), cabin_monitor_pic.

## Numbers, round 3 (ours / his, 540x960)

| frame | mean L ours / his | p1 | p99 | mean sat |
|---|---|---|---|---|
| f300 | 0.448 / 0.441 | 0.101 / 0.003 | 0.904 / 0.999 | 0.279 / 0.376 |
| f330 | 0.518 / 0.515 | 0.066 / 0.003 | 0.897 / 0.995 | 0.232 / 0.294 |
| f390 | 0.511 / 0.500 | 0.073 / 0.003 | 0.899 / 0.997 | 0.241 / 0.318 |
| f430 | 0.084 / 0.121 | 0.005 / 0.006 | 0.712 / 0.968 | 0.865 / 0.801 |
| f460 | 0.113 / 0.157 | 0.002 / 0.006 | 0.652 / 0.973 | 0.838 / 0.782 |
| f490 | 0.129 / 0.140 | 0.004 / 0.003 | 0.807 / 0.972 | 0.854 / 0.808 |

## Still wrong after round 3, worst first
1. Day shadows are not dark enough: on the quilt ours are mid grey-brown, his are near black (p1 0.07 vs 0.003). This is with 1 diffuse bounce and a world at 0.05. The light bouncing off the bright floor fills them. Next: make the floor and quilt not light each other, or add a negative fill.
2. Night f430 / f460: too dark (L 0.08-0.11 vs 0.12-0.16) and no bright whites (p99 0.65-0.71 vs 0.97; his whites come mostly from the faces). The warm pools now show but read purple, not warm #654d58. The empty green bag reads grey-green; his is a lit lime with a bright mint rim.
3. f300 framing: the monitor is narrower than his at the same height (his 67 % of the width), so his monitor may be wider than 1.4 m, or the lens differs during the move. The close new guy stand-in is placed by eye.
4. f460 camera: moved right, but his frame still shows more of the blue end wall at the right and the commander's head cut at the left edge.
5. Day: the floor dots read as fine noise at 540 px. His dot grid is coarser and clearer. The upper wall is flatter than his (his panels have a soft gradient and darker seams). The galley table is only partly in frame.
6. Kit: with a 24 mm test lens the empty space above the cabin wall (sky colour) shows at the top. The cabin has no closed ceiling over the camera side, so long lenses only. The floor is lighter than in Blender.
7. Sleeping bag shapes are simple lathes: no broad folds, and no collar opening around the head.

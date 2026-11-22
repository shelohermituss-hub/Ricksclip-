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

## Round 3 (staging fixes)
- Sleeping bags rebuilt: collar opening at z 2.05, body 1.45 m (bottom z 0.6), centred on the card plane y 1.0 (back half behind the card, front below the collar covers the chest), headrest pad behind the head, hook straps to the rail, dark collar opening.
  Meta movers bag_*: `head` [x, 1.0, 2.32], `card_y` 1.0, `collar_z` 2.05. Night stand-ins stand there (heads free).
  bag_new_guy_open: back half in the light lining, lower front kept, upper front flap folded down 165 deg over it.
- Day: second light `key_floor` (spot at 1.45, 1.3, 5.0, from the right-back, high) lights ONLY the floor by Blender light linking; the front sun `key_day` lights everything but the floor. Floor shadows now fall down-left toward the camera, quilt shadows stay. Kit: no light linking in three.js, key_floor is dimmed x0.35 there.
- Night cams refit with two head points (f430) and the new bag bottom (f460): rms f430 10.0 px, f460 14.8 px.
- Kit re-run after the rebuild: day and night both load (95 meshes, 143k tris), same names.

## Round 2 (coordinator's 5 points)
- Cameras by fit: `scripts/fit_cams_cabin.py` (5-13 points measured by hand on his frames, least squares on position, yaw, pitch, roll and lens, with a 10 px/degree prior on the lens; f300 is level and fits position only; `--write` stores the cams in params).
  Model changes where the residual was high: monitor 2.35-4.85 m, rail top 1.61 m, monitor label at the frame's bottom edge and 0.1 m left of centre, HEAD sign 0.11 m lower, the day duffels 0.17-0.2 m lower, hatch 0.1 m higher;
  in the bay, blue bag +0.1, green bag -0.1, right porthole +0.1, corner/end wall 0.35 m nearer the green bag (EX = BX + 2.15), door 0.35 m farther from the corner, rail over the door 0.8 m long, grab bar 1.9 m tall, kid drawing lower (at the rail).
  RMS after: f300 3.9 px, f330 2.9, f390 6.7, f430 9.6, f460 13.7, f490 17.5.
- Day: 0 diffuse bounces, a dim warm world, a small warm fill from the key side, sun 4.6. Night: orange pools at 1000 W, stand-in heads glow (0.9), lime story bag #38b52c with a mint glow and a light lining.
- Day details: dots 6 cm at 11 cm pitch, darker and wider panel seams, galley table moved into f330, `cabin_shell` (ceiling, sides, front and back cover; no shadows) so a wide kit lens shows no sky. Checked in the kit at 24 mm.
- Bags: broad folds (a slow radial wave), a dark collar opening round the head.

## Numbers, round 2 (ours / his, 540x960)

| frame | mean L ours / his | p1 | p99 | mean sat |
|---|---|---|---|---|
| f300 | 0.389 / 0.441 | 0.004 / 0.003 | 0.916 / 0.999 | 0.297 / 0.376 |
| f330 | 0.506 / 0.515 | 0.007 / 0.003 | 0.920 / 0.995 | 0.245 / 0.294 |
| f390 | 0.484 / 0.500 | 0.005 / 0.003 | 0.922 / 0.997 | 0.265 / 0.318 |
| f430 | 0.133 / 0.121 | 0.007 / 0.006 | 0.847 / 0.968 | 0.818 / 0.801 |
| f460 | 0.190 / 0.157 | 0.006 / 0.006 | 1.000 / 0.973 | 0.788 / 0.782 |
| f490 | 0.142 / 0.140 | 0.006 / 0.003 | 1.000 / 0.972 | 0.850 / 0.808 |

## Still wrong after round 2, worst first
1. f490: fit RMS 17.5 px. The camera solves high and looking down (z 2.65, pitch -13), and in ours the door and the stand-in fill much more of the frame than in his. The door, rail and toilet-room layout are still guessed. His door opening also shows shelves, which we do not have.
2. f460: fit RMS 13.7 px, and the frame is too bright (0.19 vs 0.16). The end wall takes about 45 % of our frame against about 30 % of his. The empty green bag reads as a flat slab, not his peeled-open bag.
3. Day saturation is still low (0.25-0.30 vs 0.29-0.38). His wall is a cooler blue-grey and his quilt is warmer. Our p99 is 0.92: no lit white reaches 0.99, because his whites are the faces. f300 is dark (0.39 vs 0.44) because the close stand-in card covers the lit quilt.
4. Day shadow shapes: ours fall nearly straight back. His fall further down-left, with long floor shadows toward the camera. That probably needs a second, higher light that we do not have.
5. f430: the camera solves 3.5 m high and looking down 15 degrees, so the skylights read bigger than his. The warm pools are now warm, but they are rounder and brighter at the top than his.
6. The floor dots are now clear but bigger and harder than his. The upper wall has no soft gradient, because flat colours plus a sun give none.
7. Kit: the floor is still lighter than in Blender, and the kit has no 0-bounce setting, so its shadows are lighter.

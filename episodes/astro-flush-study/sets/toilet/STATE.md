# STATE: place `toilet` (LOOK_INVENTORY A ship toilet room + H under-floor hose bay, WASTE VENT, nozzle, inside of the tube), round 1, 2026-11-22

Round 1 = "readable and going the right way". Not committed.

## Files
- `params_toilet.json`: palette (one hex per surface, A1 + H1), the 8 proof cameras (`cams`) and their states (`proofs`).
- `scripts/tex_toilet.py`: PIL pictures in `tex/` (Earth by day, stars, poster FLUSH (mirrored, as in the reference), WASTE LINE, WASTE VENT, kid drawing).
- `scripts/bl_toilet.py`: builds the whole place -> `out/toilet.blend`, `out/toilet_lite.glb` (collection `toilet_set` only, no stand-ins), `out/toilet_meta.json`.
- `scripts/toilet_api.py`: `set_state(scene, light, glow, exploded, door, hatch, pulse, shot, commander, paper)`, `set_light(scene, kind)`.
- `scripts/still_toilet.py`: `blender -b out/toilet.blend -P scripts/still_toilet.py -- f5 f33 ...` (cams + states from params, no rebuild). About 13 s per still at 540x960, 16 spp + OIDN.
- `scripts/proof_toilet.py`: side-by-sides -> `references/look_match/astro_flush/work/proof/toilet/sbs_<frame>.jpg` + the numbers table below.
- `build_toilet.sh`: pictures then the Blender build (about 40 s).
- `../toilet.js`: kit module. Loads the GLB + meta only, no geometry. Applies light kind (variant visibility, point lights from meta), glow (emission), exploded / door / hatch (movers from meta rest -> target), pulse (position on `hose_path`), paper (roll / ribbon). Round 2: run once with `render_gpu.mjs` on a private test film (scratchpad, one place, one frame, --scale 0.5 --grab fast): loads (112 meshes, 93k tris, 0.1 s), movers reach the exploded pose, lights read; 4.8 s per frame in software WebGL. Imports `./vendor/GLTFLoader.js` (copied into `sets/vendor/` from plane-eater: the old cross-episode path would not be served).

Reused: generic helpers written after library row `yft_town_helpers` (lin, flat principled mat, box/cyl builders), rewritten so every object keeps its own origin. `garden_hose_nozzle` was not used: the ribbed hose is our own tube + rib rings along a Catmull-Rom path (`hose_path` in meta).

## Movers (meta `movers`, 28)
Toilet parts, each with rest + `exploded` transforms: toilet_base, toilet_bowl, toilet_seat, toilet_lid, toilet_tank, toilet_tank_lid, toilet_flush_lever,
toilet_flush_button, toilet_hinge_peg_l/r, toilet_flange, toilet_gasket, toilet_bolt_1..4, explode_ring_1..4 (scale .01 at rest, 1 exploded).
door_leaf (`open`), hatch_panel (`open`), paper_roll_float, paper_ribbon, hose_pulse (runs along `hose_path` by `pulse`), cup, toothbrush, tube_core.

## Numbers, round 2 (ours / his, 540x960)

| frame | mean L ours / his | p1 | p99 | mean sat |
|---|---|---|---|---|
| f5 | 0.448 / 0.349 | 0.004 / 0.000 | 0.999 / 1.000 | 0.303 / 0.381 |
| f33 | 0.393 / 0.308 | 0.004 / 0.000 | 0.995 / 0.999 | 0.256 / 0.377 |
| f37 | 0.033 / 0.221 | 0.000 / 0.000 | 0.925 / 0.879 | 0.470 / 0.622 |
| f515 | 0.307 / 0.321 | 0.000 / 0.004 | 1.000 / 0.998 | 0.608 / 0.652 |
| f1030 | 0.266 / 0.324 | 0.009 / 0.000 | 1.000 / 1.000 | 0.233 / 0.219 |
| f1105 | 0.397 / 0.327 | 0.016 / 0.000 | 1.000 / 1.000 | 0.232 / 0.248 |
| f1150 | 0.247 / 0.367 | 0.012 / 0.002 | 1.000 / 0.989 | 0.340 / 0.560 |
| f1190 | 0.098 / 0.169 | 0.004 / 0.006 | 0.729 / 0.851 | 0.737 / 0.662 |

## Still wrong after round 2, worst first
1. f1150 under the floor: camera roll and the elements are right now (flange in the middle, WASTE VENT top-right, foil low, dark beam), but the camera is too close: the foil fills too little of the frame and the big beam is missing top-left (L 0.25 vs 0.37, sat 0.34 vs 0.56). The bay frame at x 0.1 blocks the camera from backing off: the camera needs a path through a frame opening.
2. f37 from outside: the room through the porthole reads, but around it there is only the black wall slab on dark space (L 0.03 vs 0.22). His hull, the stripe, the hazard box and Earth below belong to the `ship` place; the two have to be combined.
3. f515 night: toilet now shaded pale blue (L 0.31 vs 0.32, sat 0.61 vs 0.65), but there is no halo of light around it and no glowing floor strip; the stand-in card is still too big (the character spot is too close to the camera).
4. Kit frame: too much bloom around the exploded stack and the pulse; the kit picture is lighter and greyer than the Blender one (`light_scale` 0.025 set by eye on one frame).
5. Shot 1 day (f5 L 0.45 vs 0.35, f33 0.39 vs 0.31): still lighter than his; the floor whites are bright all over, not only where the key hits. Earth is now a curved limb with a rim glow, but has too many flat clouds and too little blue.
6. f1190 tube: navy and cyan now (sat 0.74 vs 0.66), but too dark (L 0.10 vs 0.17); the core is a white disc, his is a cyan glow; his has lighter ring bands.
7. Wide f1030: long hard shadows toward the lens now, but the whole frame is darker than his (0.27 vs 0.32), and the shelf/toilet corner is dark. f1105: the exploded stack sits right but is a little low and blown white at the top.

## REQUESTS FROM STAGING (toilet stretch, 2026-11-22; shots/toilet/STATE.md)
1. ONE MOVE HATCH -> TUBE (his f1132-1199 is one camera, no cut):
   a. An opening behind the WASTE LINE hatch (hatch at Blender (-1.8, 1.55, 0.2)): a shaft at least 0.5 x 0.5 m going down from the hatch mouth to the
      under-floor bay (bay floor z -1.7), lit (bay_fill reaches it), so the camera can pitch down through it (now it crosses the floor slab f1137-1141; hidden by
      a near-plane trick in the stage wrapper).
   b. A tube entry AT the flange: the WASTE VENT flange (1.745, 1.5, -0.9) open in its centre (dark ring + bore 0.25 m wide) leading into the tube interior
      (rings, core) placed on the flange axis (+x) right behind it, instead of the tube 30 m away at y -26..-34. Then the camera flies through the flange into
      the tube with no cut (his nozzle fills the frame at f1176, rings from f1178).
   c. Until then staging keeps the cut at f1176, inside the dark of the flange.
2. Bowl swirl for shot 1 (his f24-28) and a ribbon with its own pivot at the roll (now world-placed at the origin: it can only be scaled into the bowl).
3. Shot 6: glow strip lights along the floor and a halo around the toilet (his f500-530).
4. The wide key light by the toilet blooms into a white blob in the kit (bloom lowered to .35 in s12); the pulse light blows the flange out white at f1170
   (staging scales it to .12 from f1162 through the wrapper).
5. A face smug + ONE sweat drop (his f512-530) is not in the cast (stand-in k:nervousSmile) - for the character artist.

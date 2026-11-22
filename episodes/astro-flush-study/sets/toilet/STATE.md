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
- `../toilet.js`: kit module. Loads the GLB + meta only, no geometry. Applies light kind (variant visibility, point lights from meta), glow (emission), exploded / door / hatch (movers from meta rest -> target), pulse (position on `hose_path`), paper (roll / ribbon). Syntax-checked with node; NOT yet run in the kit renderer (three.js light strengths `light_scale` are a guess).

Reused: generic helpers written after library row `yft_town_helpers` (lin, flat principled mat, box/cyl builders), rewritten so every object keeps its own origin. `garden_hose_nozzle` was not used: the ribbed hose is our own tube + rib rings along a Catmull-Rom path (`hose_path` in meta).

## Movers (meta `movers`, 28)
Toilet parts, each with rest + `exploded` transforms: toilet_base, toilet_bowl, toilet_seat, toilet_lid, toilet_tank, toilet_tank_lid, toilet_flush_lever,
toilet_flush_button, toilet_hinge_peg_l/r, toilet_flange, toilet_gasket, toilet_bolt_1..4, explode_ring_1..4 (scale .01 at rest, 1 exploded).
door_leaf (`open`), hatch_panel (`open`), paper_roll_float, paper_ribbon, hose_pulse (runs along `hose_path` by `pulse`), cup, toothbrush, tube_core.

## Numbers (ours / his, 540x960, round 1 final)
| frame | mean L | p1 | p99 | mean sat |
|---|---|---|---|---|
| f5 | 0.529 / 0.349 | 0.008 / 0.000 | 1.000 / 1.000 | 0.233 / 0.381 |
| f33 | 0.456 / 0.308 | 0.013 / 0.000 | 1.000 / 0.999 | 0.176 / 0.377 |
| f515 | 0.439 / 0.321 | 0.000 / 0.004 | 1.000 / 0.998 | 0.486 / 0.652 |
| f1030 | 0.280 / 0.324 | 0.012 / 0.000 | 1.000 / 1.000 | 0.231 / 0.219 |
| f1105 | 0.384 / 0.327 | 0.017 / 0.000 | 1.000 / 1.000 | 0.240 / 0.248 |
| f1125 | 0.354 / 0.360 | 0.035 / 0.000 | 1.000 / 1.000 | 0.239 / 0.207 |
| f1150 | 0.461 / 0.367 | 0.029 / 0.002 | 1.000 / 0.989 | 0.463 / 0.560 |
| f1190 | 0.338 / 0.169 | 0.019 / 0.006 | 0.643 / 0.851 | 0.272 / 0.662 |

## Still wrong, worst first
1. f1190 inside the tube: grey and flat-lit (mean L 0.34 vs 0.17, sat 0.27 vs 0.66, p99 0.64 vs 0.85). His is navy concentric rings with a bright cyan core; ours lit grey walls, core ring too white, no navy.
2. f1150 under the floor: framing is off (the cyan-grey frame ring fills the top half, the flange and WASTE VENT sit mid-frame; his has the foil filling the lower half, the big curved beam top-left, flange top-centre, sign top-right, dark hull wall on the right). Beams too cyan/bright, foil too green-yellow and too small in frame. Camera has 25 deg roll that the projection helper ignores; needs a re-match.
3. Shot 1 day (f5, f33) too bright and too grey: mean L 0.53 vs 0.35, sat 0.23 vs 0.38; floor whites and wall panels lighter than his navy-grey walls; Earth is a flat cloud band (no curved limb, no rim glow). In f33 the room reads shallow: his pull-back shows a long narrow corridor-like room.
4. Night f515: toilet halo is a blown white shape without his pale-blue shading on the bowl and lid; walls not blue enough (sat 0.49 vs 0.65); stand-in card too big (camera too close to the character spot).
5. Wide f1030 / f1105: overall matches (L 0.28 / 0.38 vs 0.32 / 0.33) but no long hard character shadows across the checker (the key is a spot inside the room); the hose on the floor reads; exploded stack readable but sits too close to the window wall and too tall in frame vs his.
6. Glossy floor shows big white reflection blobs of the halo and pulse lamps (f1105, f1125); his has one small cyan spill at the hose joint.
7. f1125: camera close to his but the left wall port/WASTE LINE plate are cut at the left edge; door right is right.
8. Room seen from outside through the porthole (f35-41): walls, porthole ring and bolts exist, but no proof still was made for it in this round; the hull outside the porthole belongs to `ship`.
9. Kit module `sets/toilet.js` not run in the kit yet (light strengths and the Blender->three rotation conversion of movers unproven).

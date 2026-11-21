# cine/ STATE: two CINEMATIC KEY FRAMES in Blender (look-finisher, 2026-11-21). A: package READY. B: package READY (preview only here).
Plan changed by the user (via the coordinator): finals render on a RunPod RTX 4090; here only 540x960 16 spp CPU previews + one packed package per frame.

## Method (frame A, S1 f0, the hook poster)
1. Kit reference: `kitA/` = copy of s1/film.json (puppet path +1 level) + s1/out/plan, symlinks to s1/sets, s1/moves, cast, voice, assets_prod.
   `render_gpu.mjs film.json --frames 0 --scale 1 --grab fast --no-captions --stills-dir ../kit_A --eval ../dump_scene.js` -> kit_A/f_00000.png (23.8 s).
2. The same call dumps the kit state (`dump_A.json`: camera matrix + fov, each card's drawn texture, world corners, UVs; prop matrices; hose tube; mist
   sprites) and `dump_fist.js` -> `dump_A_fist.json` (the 3D fist on the gun). No --export-lock needed; the Blender frame matches the kit to the pixel.
3. `prep_cards.py dump_A.json A_cards left` = the kit cards + pale inner rim on the sun side (never on face/hand whites).
4. `build_A.py` (blender -b sets/town/out/town.blend): FULL town (AM), hero truck half red/lemon, edge -1.55, masking, 4 sirens, price card;
   compressor, lemon tin, ribbon stool, lunch box, lemon, spray gun from assets_prod/*.blend at the kit matrices; hose + fist as kit meshes; cards as
   self-lit image planes (tint #fff6ea like the kit), contact patches, SHADOW cards (hidden copies facing the sun); mist = small lit lemon volumes.
   ULTRA light: key chosen for this framing (sun az 255 el 28, from screen left behind the lens; the town's az 205 put him in the truck's shade),
   cream rim area light from behind-left (gun, fist, lemon flank, chrome), lemon bounce on the concrete (the film's signature), lavender fill #a2a8e6,
   sky full for the lens but 0.55 as light. Passes: //out/pass_depth (16-bit 0-200 m). Standard view.
5. `grade_key.py --preset A` (world only, cast untouched via `make_mask.py`): depth haze pale warm, lavender veil on darks, diagonal cream sun bands,
   bloom on lemon/chrome, background soft beyond 11 m (never the cast), sat x1.62, black .085, white .955, world gain solved for mean .46. No vignette, no grain.

## Numbers (A, preview 540x960, 16 spp, CPU, 74.6 s incl. ~50 s scene load)
| | sat | mean | dark 1 % | contrast | white | corner/centre |
| kit f0 | .381 | .371 | .012 | .181 | .969 | .918 |
| Blender graded | .441 | .478 | .110 | .185 | .972 | 1.173 |
All in band (sat .36-.50, mean .42-.50, dark .08-.15, contrast .17-.21, white .92-.98, corner >= .97). Sheet: CINE_KEYS.jpg (A preview row).

## RunPod package A: runpod/A/ (193 MB scene.blend, everything packed, 0 libraries, 0 "not found" at 10 %)
scene.blend (1080x1920, Cycles GPU, 512 spp adaptive .01 + OIDN, Standard, output //out/A_raw_####.png + pass_depth/pass_mask), render.sh
(picks OPTIX > CUDA > ... > CPU, renders -f 1, then grade_key.py with mask_A.png -> out/A_final.png + numbers.json), grade_key.py, grade_metrics.py, vidio.py.
Tested here at 10 %: opens, renders (57 s total, mostly load), grade runs. Estimate on a 4090: ~1 min load + ~1-2 min for 512 spp = 2-4 min per frame.

## What the Blender frame ADDS over the kit frame
Real raytraced sun with long shadows on the truck and yard, chrome and clearcoat reflections, bounce light, the lemon spill on the concrete,
rim on the gun/fist/truck flank, depth haze, sun bands, bloom on the lemon panel, lifted lavender darks, full-detail town (not LITE).

## BLENDER NEVER WEAKER: what A has LESS than the kit frame (checked side by side, preview)
- Front wheel: kit = red rim, dark tyre; Blender = gold/orange rim, tan tyre (asset material in truck.blend; props-hero / 3d-designer).
- Spray mist: kit = a soft fan of lemon spray from the tip; Blender = a rounder lemon puff (volumes from the same sprite places). Weaker gesture.
- Hero figure shadow: mostly behind him / leaving frame right; only the contact patch reads at his feet.
- Kit dust specks (look_dust) are denser than the town's AIR motes in Blender.
- Station clapboard reads more yellow-olive after the grade than the kit's warmer olive (sat x1.62); within LOOK_BIBLE but check beside the film.
Nothing missing in props, words or lamps: PINE HOLLOW sign, door letters, masking paper, 4 sirens, compressor, gun, fist, hose all present.

## B (S6 f1293 "red FIRST.", lamp room) - package READY: runpod/B/ (25 MB scene.blend, all packed, 0 libraries, 0 "not found" at 10 %)
- kitB: film_plan check -> out/plan; kit_B/f_01293.png + dump_B.json (5.6 s). No cast card in the room (hero is drawn in the window picture) -> mask empty, no rim/shadow card.
- build_B.py (run FROM sets/lamproom: blender -b out/lamproom.blend --python ../../cine/build_B.py -- preview|package): window images made absolute + packed;
  set_state wave 4, iris .758 (keys .62@1289 -> 1@1300), dim .6, grey 1; OFF red glass x.18 (dead colour); kit camera; window light cool #b4b6e0 x.5;
  cool spill disk 18 W; set fills green/blue/back x.5; iris rake lights amber #ffa858 30 W (kit's amber ring). Preset B in grade_key.py: haze .08, veil .06,
  no DOF (dof_d0 60: the window is the subject), sat 1.35, contrast 1.12, black .06, white .95, mean solved .27, no vignette, no grain.
- Numbers (540x960 16 spp CPU, 31.7 s): kit sat .733 mean .160 dark .011 contr .199 white .896 corner .307 | Blender graded .353 .270 .086 .192 .893 .632 (gain .905).
- runpod/B: scene.blend, render.sh (OptiX > CUDA > HIP > CPU, probes only device types this Blender has; PCT/SPP env for tests), grade_key.py, grade_metrics.py,
  vidio.py, mask_B.png (1080x1920, empty). Tested from a scratch copy at PCT=10 SPP=8: renders, grades, NOTFOUND 0.
- BLENDER NEVER WEAKER, what B has LESS than the kit: (1) saturation .35 vs .73: the lemon/blue lamps read paler, the dome lighter navy-grey, the deck mauve
  not near-black; (2) the kit's continuous amber ring round the iris is only orange spots on nearby bulbs; (3) the pupil lip shows bead reflections of lamps
  (kit: a clean pale rim); (4) relay box lid reads flat cream-tan (kit: orange gradient). Same props/words: window picture (grey truck, MAIN ST, hero) identical.
- ADDS: real bulb glass with rings, raytraced chrome iris blades, bounce of lemon/blue on the deck and rail, bloom on lit lamps, depth haze.

## Open
- A and B finals at full size come from RunPod (not rendered here, per the user's decision). runpod/A/render.sh has the old device loop, which on Blender 5.3 Linux logs
  'enum "METAL" not found' (harmless, but trips a "not found" grep): copy B's loop if A is re-sent.
- Set-builder: lamproom_api.set_state should darken the OFF red glass itself (build_B does it locally).

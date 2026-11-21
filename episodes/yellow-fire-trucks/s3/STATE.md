# S3 STATE: THE CROSSING AT DUSK, BOARD round (S3 stretch builder, 2026-11-21). Frames 474-770 (15.80-25.65 s), plan rows 14-21, lines 5-6.
## NOT done
- BOARD only: no moving clip, no polish. Key frames looked at by me only. No Rick frame exists in the repo: no side-by-side (RULE NO. 1 test open).
- KEYS_NOTE
- The S2 -> S3 join "EVERY" (push into the toy truck that becomes the real truck) is only S3's half: f474 starts on the real truck down Main on a 50 mm lens;
  S2 does not exist yet, so the match frame is not checked against the toy.
- 0 FAIL only in the shifted check (check_shifted.py, the stretch alone); the absolute `film_plan.py check film.json --window 474-770` gives 3 FAIL
  (2 are frame-0 artefacts, 1 real: camera at rest while a face is on screen 24 %, target 40). See CAMERA_NOTE.md.
- frame_checks / camsafe: CHECKS_NOTE
## Built (files)
- `make_film.py` -> `film.json` (camera v2, camsafe, kit3d, tween ones, face_frames 0, card_shade 0/0, costume_shade keep_drawn_light + smooth 40, faces_ep from CAST_KEYS;
  Milkman lip sync `say [72,75]` = 24.02-25.50). `film_light.json` = the same with `places.crossing.truckLight` (see lessons). ONE take, 7 stations (CAMERA_NOTE.md).
- `moves/ep_s3.mjs` (3 episode moves, STUDIO MOTION: mk_van, mk_out, sc_cab; no kit pose, no frozen move), `moves/studio_ep.mjs` (copy of S1's).
- `sets/s3_crossing.js` (new): the town (LITE, trucks off) + red pumper racing west on Main (south lane) braking into the bump; Meadowbrook van creeping to the
  white bar, rolling on "kept", the bump on "hit" f569 (van rocks once); POWER 2 (impact frame flat plum + white focus lines f569-571, white shock lines at the
  bumper, kick f569 amp 3, hubcap off the front right wheel with a white spark trail past the lens to rest); siren sound rings 598-648; bell swing; beacon wave;
  pale pulse light over the Milkman; milk crate on the SE kerb. Symlinks as S1: cast, voice, assets_prod, sets/{town.js, assets.js, prop_kit.js, town}.
- `tools/render_s3.mjs` (copy of render_gpu.mjs: kit path + 240 s screenshot wait), `render_keys.sh` (one frame per process, 3 tries), `board.py` -> BOARD.jpg,
  `check_shifted.py` (plan check of the stretch alone).
## Weak points in the frames (my own list)
- WEAK_NOTE
## Requests (not done by me)
- set-builder (town, being fixed now): the sodium lamp POOL on the road at the crossing is missing: the crossing reads as one flat apricot asphalt, the van and the
  Milkman get no pool of light to stand in (rows 14-16, 19-21 all suffer; worst in f569/f694 where half the frame is plain road).
- props-hero: (1) the milk van GLB shows the download's GREEN paint in the kit (no cream, no cornflower stripe, no "Meadowbrook DAIRY" lettering seen); I re-tint
  the body to cream in s3_crossing.js from the texture's lightness. (2) truck_light.glb has NO sirens and NO beacon row (rows 17-18 need both), and the full
  truck.glb gets chrome killed for memory here: a light truck WITH sirens + beacon row is needed. (3) the hubcap: the van wheel keeps its own cap (bare hub
  not built), so the flying cap is a second one. (4) buildTruck should set uInvRoot itself (S1 lesson, workaround copied here). (5) red at dusk: drain .85 still
  reads salmon red in the kit, not the nearly-lost grey-plum of LOOK_BIBLE.
- character-artist: none needed (frozenWide, holdBreath, nervousSmile, concentrate, browUp, surprised all exist).
## LECONS (for LECONS_TECHNIQUES.md, the lead copies)
LECONS_NOTE

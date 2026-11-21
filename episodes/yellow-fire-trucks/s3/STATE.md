# S3 STATE: THE CROSSING AT DUSK, BOARD round (S3 stretch builder, 2026-11-21). Frames 474-770 (15.80-25.65 s), plan rows 14-21, lines 5-6.
## NOT done / wrong in the board (seen in BOARD.jpg, my own list)
- BOARD only, no clip, no polish; looked at by me only. No Rick frame exists in the repo: no side-by-side (RULE NO. 1 test open).
- Row 18 f643 "flashing": the Milkman is NOT in the frame (the camera is still on the roof line; v2 reaches via point E ~25 f late). Beacons + rings only.
- Row 16 f584 "crossings": the camera is travelling; the Milkman's freeze and bottle check are not seen (hubcap + spark only). f584 has the old Sceptic spot.
- Row 21 f765 "it": the tilt has not landed; the truck does NOT fill the frame "out of the top" (truck mid-distance). Row 19-21: the truck reads big, not "three storeys".
- Faces read weakly: frozenWide/nervousSmile on the Milkman look almost the same as concentrate at board size; arms on "I never" are half wide (rig clamps).
- f511: his "look left" face is half hidden by the van pillar. The Sceptic never leans OUT of the window (driver side faces away from this camera): he leans to the windscreen.
- Red at dusk reads salmon/clear red, not the nearly-lost grey-plum of LOOK_BIBLE (drain .85 in assets.js). Lower frame halves are plain apricot asphalt (no lamp pool).
- Frames 511-584, 694-765 use truck_light.glb (no sirens, no beacon row): full truck.glb got Chrome killed by the shared memory limit; 613/643 have the full truck.
- frame_checks / camsafe: see CHECKS below. 0 FAIL only in the shifted plan check; the absolute check has 3 FAIL (CAMERA_NOTE.md).
- S2 -> S3 join ("EVERY", toy truck -> real truck): only S3's half exists (f474 long lens on the real truck); S2 is not built, the match is unchecked.
## Built (files)
- `make_film.py` -> `film.json` (camera v2, camsafe, kit3d, tween ones, face_frames 0, card_shade 0/0, costume_shade keep_drawn_light + smooth 40, faces_ep from
  CAST_KEYS; Milkman lip sync `say [72,75]` = 24.02-25.50). `film_light.json` = the same + `places.crossing.truckLight`. ONE take, 7 stations (CAMERA_NOTE.md).
- `moves/ep_s3.mjs`: 3 episode moves (STUDIO MOTION): mk_van, mk_out (Milkman), sc_cab (Sceptic). No kit pose, no frozen move. `moves/studio_ep.mjs` = S1's copy.
- `sets/s3_crossing.js`: town LITE (trucks off) + red pumper racing west on Main (south lane), braking into the bump; van creeping to the white bar, rolling on
  "kept", bump on "hit" f569, rocks once; POWER 2 (impact frame flat plum + white focus lines f569-571, shock lines at the bumper, kick f569, hubcap off the front
  right wheel with a spark trail past the lens to rest); siren sound rings 598-648; bell swing; beacon wave; pale pulse light on the Milkman; milk crate on the kerb.
  Symlinks as S1 (cast, voice, assets_prod, sets/{town.js, assets.js, prop_kit.js, town}).
- `tools/render_s3.mjs` (render_gpu.mjs copy: kit path + 240 s screenshot wait), `render_keys.sh` (one frame per process, waits for memory, 3 tries),
  `check_shifted.py` (plan check of the stretch alone), `board.py` -> `BOARD.jpg`. Key frames: `key/f_*.png` 1080x1920, no captions.
## Numbers
- Plan: shifted check 0 FAIL / 9 WARN; absolute `--window 474-770` 3 FAIL (2 frame-0 artefacts) / 12 WARN; WINDOW speed p90 12.8, peak 21.0 px/f.
- Render: 45-62 s per full-size frame (grab 38-56 s) with ~7 helpers on the CPU; 12 of ~25 tries were killed (memory), all before the memory wait.
- CHECKS
## Requests (not done by me)
- set-builder (town, being fixed now): the sodium lamp POOL on the road at the crossing is missing: every frame's lower half is one flat apricot asphalt, the van
  and the Milkman have no pool to stand in (worst f569, f694, f734). Also no mist/moths at the lamp (LOOK_BIBLE DU particles).
- props-hero: (1) the van GLB shows the download's GREEN paint in the kit; s3_crossing.js re-tints the body cream from the texture lightness; no cornflower stripe,
  no "Meadowbrook DAIRY" lettering visible. (2) truck_light.glb has no sirens and no beacon row: a light truck WITH them is needed (memory). (3) the van wheel keeps
  its cap: the flying hubcap is a second one. (4) buildTruck should set uInvRoot itself (S1 lesson, copied). (5) dusk drain: red must sink to #4B4753.
  (6) the hero/pumper licence plate "LIBAU" from the asset shows on the bumper (also in the town STATE).
- camera-director: a v2 layout that reaches rows 16 and 18 ON their words (via points arrive late; 297 f leave room for ~4 stations).
## LECONS (LECONS_TECHNIQUES.md format; the lead copies)
- 2026-11-21 (S3) Full-size kit stills died: Playwright screenshot timeout 30 s (grab took 26-56 s on the shared CPU) and `--grab canvas` crashed the page every
  time (also on S1's film). Fix: s3/tools/render_s3.mjs = render_gpu.mjs with a 240 s screenshot wait. Guard: comment line 1 of the copy. Proof: key/*.png. OUVERT
  for the kit owner (a --grab-timeout flag in render_gpu.mjs).
- 2026-11-21 (S3) Chrome was OOM-killed (memory cgroup shared by all helpers; Blender proofs peak). Fix: render_keys.sh renders ONE frame per process and waits for
  3.8 GB free. Guard: logs/keys.log line per try. Proof: 0 kills after the wait was added (12 before).
- 2026-11-21 (S3) film_plan.py check counts film-wide gates from frame 0; a stretch on absolute frames (S3 starts at 474) FAILs "first face", "faces in the first
  15 s", "longest without a face", rests/effects/moods per minute. Fix: check_shifted.py checks a copy shifted to 0 (words too). Guard: run both. Proof: 3 vs 0 FAIL.
- 2026-11-21 (S3) camera v2 moves a hold-0 station later than its `at` (wants 48-67 f per travel): row pictures on via points land ~25 f late. Guard: project the
  cast on the baked camera at the word frame before rendering (s3/proj_cast.py). Proof: f643 Milkman off frame.
- 2026-11-21 (S3) the step-van card: in a 3/4 card the act `dir` flips which screen side he faces, not plan left/right: from camera B dir -1 = his look LEFT.

# S3 STATE: THE CROSSING AT DUSK, BOARD v2 = fix round (S3 stretch builder, 2026-11-21). Frames 474-770 (15.80-25.65 s), plan rows 14-21, lines 5-6.
## NOT done / still wrong (seen in BOARD.jpg v2, my own list)
- Row 21 f760 "it": the tilt lands on the word, but the truck does NOT fill the frame "out of the top". It is a real 2.6 m cab; a low 16 mm lens 2-3 m away
  shows mostly sky above it (tried at 1.5 m: worse). "Three storeys" needs a scale cheat or a set decision (lead): a bigger truck for this shot, or the camera on the bumper.
- Faces: the drivers' faces are partly hidden by the cab and van bodies from the low angles (frame_checks face_covered, below). The Sceptic never leans out
  (seated card stays in the seat; driver side faces away from the camera corner). f760: the bottle hand, not the free knuckle, ends at the cap.
- Board is HALF SIZE (540x960, as ordered). No clip, no polish. No Rick frame in the repo: no side-by-side.
- Absolute plan check `--window 474-770`: 3 FAIL (2 frame-0 artefacts; "at rest while a face is on screen" 22 %, target 40). Shifted check: 0 FAIL.
- S2 -> S3 join ("EVERY", toy -> real truck) unchecked: S2 not built.
## Fixed this round (seen in the v2 tiles)
1 Drivers seated: `milkmanDriver` (van seat, plan [VX-.11, vy+1.45, .29], rides the van's linear runs) and `sceptic` = scepticDriver puppet (truck seat
  [TXH-2.30, TY-.42, .42], helmet on: it did not clip the roof in any tile). Climb-out = visible swap to the standing `milkman` at f662. body_in_mesh gone.
2 Rows on their words: f582 "crossings" camera AT REST, Milkman frozen behind his windscreen; f644 "flashing" at rest: beacons + rings at the top, Milkman
  in frame lower right; f614 "screaming" is the rise (sirens + rings top left, still moving); f760 "it" at rest after the tilt (see NOT done).
3 Red at dusk: drain 1 (was .85): the pumper reads grey-plum, chrome and beacons carry it. 4 "I never" f735: both arms fully out (mk_out arms past reach).
- Dropped my workarounds: uInvRoot call, van re-tint (van is cream with stripe now), full truck (light truck has sirens + beacon row), render_s3.mjs copy.
## Built (files)
- `make_film.py` -> `film.json` (camera v2, camsafe, kit3d, tween ones, face_frames 0, card_shade 0/0, costume_shade keep_drawn_light + smooth 40; Milkman
  lip sync `say [72,75]`). ONE take, 6 stations: A474 tele, B508 rest, C580 rest (bump + freeze), D640 rest (roof + Milkman), F694 rest, H752 rest (CAMERA_NOTE.md).
- `moves/ep_s3.mjs` (mk_van, mk_out, sc_cab; the clock of every move = film frame - 474, see lessons). `sets/s3_crossing.js` (staging, POWER 2, rings, beacons, hubcap).
- `render_keys.sh` (ONE process, kit render_gpu --scale 0.5 --grab fast --grab-timeout 120), `board.py key2 BOARD.jpg`, `check_shifted.py`, `proj_cast.py`.
- Key frames v2 in `key2/` (511 530 569 582 614 644 694 735 760); v1 full-size frames in `key/`, v1 board `BOARD_v1.jpg`.
## Numbers
- Shifted plan check 0 FAIL / 7 WARN; absolute 3 FAIL / 9 WARN; WINDOW speed p90 10.0, peak 19.8 px/f.
- Render: 9 frames in 48-63 s (5.3-7.0 s per half-size frame, grab fast 80 ms). No crash this round.
- `node tools/frame_checks/check.mjs film.json --frames 474-770`: FAIL face_covered x3 (milkmanDriver f508-531 behind the van pillar; sceptic f694-714 and
  f752-770 behind the cab front from the low camera), WARN face_covered sceptic f640-651; FAIL body_contact x2 = the kit's "in_vehicle needs a body rig"
  (kit-owner item, DRIVER_NOTE). No body_in_mesh, feet or slide FAIL any more.
- `node tools/camsafe/validate.mjs film.json --frames 474-770 --step 2`: 252 checks, PASS 252, FAIL 0.
## Requests (not done by me)
- lead / set-builder: row 21 scale decision (above). Kit owner: body rig / driverSeat for in_vehicle drivers (body_contact FAIL).
- camera-director: "rest on faces" 22 % (rows 16-18 are object pictures with small faces).
## LECONS (LECONS_TECHNIQUES.md format; the lead copies)
- 2026-11-21 (S3 fix) Problem: the Milkman's "arms wide" never showed. Cause: a move's clock starts at the FIRST act that names the pose (here the hidden
  act at f474), not at a later act that names it again; mk_out assumed f668, so every frame played the end of the move. Fix: every S3 move uses
  f = F(t) + 474 (film frame). Guard: comment in ep_s3.mjs; check one acting frame in a still before the board. Proof: key2/f_00735.png arms wide. FERMÉ
- 2026-11-21 (S3 fix) Problem: rows 16 and 18 landed off their words. Cause: v2 delays a station by its travel; via points and long holds shift the rest.
  Fix: fewer stations (6), holds tuned until proj_cast.py shows the cast in frame AND state 'rest' on the word. Guard: proj_cast.py before every render. FERMÉ
- 2026-11-21 (S3) film_plan check counts film-wide gates from frame 0: a stretch on absolute frames fails them. check_shifted.py measures the stretch alone.
- 2026-11-21 (S3, v1) Full-size kit stills: screenshot 30 s timeout / canvas grab crash / OOM. Now solved in the kit (--grab fast, --grab-timeout, retry).
- 2026-11-21 (S3) In a 3/4 card the act `dir` flips the screen side he faces, not plan left/right (from camera B dir -1 = his look LEFT).

# S2 STATE: THE TABLE (plane-eater rows 10-18, film 8.56-17.30 s = frames 257-519). DRAFT round, S2 stretch builder 2026-11-22. Half size (540x960).

## NOT DONE / below Rick (fix round starts here)
- DRAFT RENDERED (263 frames, 3.4 s/frame, 895 s) -> draft.mp4 8.77 s with voice, KEYFRAMES.jpg, S2_strip_4fps.jpg. Took about 100 min (limit 75).
  It is FAR BELOW RICK. Do not show it as a version. Seen on KEYFRAMES.jpg:
  - Michel's card faces the lens/3-4, not the table; his 3D legs point at the table: camsafe 237 FAIL LEGS_DISAGREE (body drawn 'side' by the
    move while camsafe wants the true view for 3D legs). Fix: the move must return the view camsafe asks for (sit_chair returns `view` = want, legs3d), or drop legs3d.
  - The props do not read: oil glass, jug, tongs, bites are tiny or hidden behind his hand; no close-up actually lands (305 and 375 are still mediums,
    456 is too close and cuts his head). The tire stretch and the needle on "2 lb / 900 g" can't be read. Rows 11, 13, 17 FAIL the line check.
  - frame_checks: 3 FAIL (michel head_cut + body_side on f0-206 = frames before the window, the baked lead-in; owner head cut by the right edge at f519).
  - camsafe validate: exit 1, 237 LEGS_DISAGREE (above).
- Seen on the first rendered frames (257-281, key/test/sheet2.jpg) and the 3 test stills (key/test/sheet.jpg):
  - The OWNER stands straight behind Michel's head from the station-290 angle (one figure covering another): move OWNER (make_film.py) about 1.5 m west, e.g. (-0.2, 2.0).
  - Michel is already seated at 257: the "walks to the table, sits, tucks his chair in" (row 10) is only a 10-frame drop. S1's last state is unknown
    (no s1/film.json when I built); the join needs S1 to end with Michel standing at the chair (3.4, -1.45) or S2 to start with a walk-in act.
  - Too much dark concrete in the lower third of the wides (floor > 1/3): lower the camera or aim lower; the cloth under the wing reads dark-blue grey.
  - Held props are real size (18 cm glass, 28 cm jug) against a cartoon head of about 0.58 m: they read small; a CLOSE on the oil glass and the dial is needed (rows 11, 13).
  - The four list bites (wing slice, wheel hub, seat cushion, tire) are simple stand-in shapes built in sets/s2_apron.js, not props-hero models: below Hard Rule 2.
  - The tire "gum" strand is a stretched cylinder from the held tire along its +X; it does not yet reach his mouth (needs the mouth point per frame).
  - "DON'T TRY THIS AT HOME" plaque (rows 10-18) is out of shot from the SE camera side (plaque at 8.75, 8.94): not shown.
  - No sound effects (crunch, glug, boing, rubber snap) in the draft.
- film_plan check --window 257-519: 2 FAIL, 8 WARN (plan_check.txt):
  - "camera goes around a figure, view stays back" at f222-252: frames BEFORE this window (the baked lead-in to station 257), belongs to the S1/S2 join.
  - "owner frozen 6.4 s": the owner's move leans and winces inside ow_watch, but the planner only counts acts: add owner face acts (e.g. 330, 407, 450).
  - head-centre gates were computed for a STANDING 1.8 m figure; Michel sits (m:../../ep_s2/mi_table exports legs3d + chair3d, seat 0.485 m), so
    the planner's head height is about 0.5 m too high (film_plan.py knows only m:sit_chair / m:sit_floor as seated: LEGS3D_MOVES).

## Built (files)
- make_film.py -> film.json (camera v2, camsafe, kit3d, tween ones, face_frames 0, the film's full voice/words, start 257, end 520, card_shade 0/0).
- moves/ep_s2.mjs: m:mi_table (Michel seated, one move for rows 10-18: sit + tuck, glass lift/swirl/sniff/nod, jug glug, tumbler drink, tongs drop on
  "pounds", wing crack 407, hub 428, cushion 451 + spring pushed back, tire pull/stretch 480-488, snap 489, chew, swallow, belly pats 512/517);
  exports legs3d + chair3d (3D ink legs to the floor, seat 0.485 m). m:ow_watch (owner arms crossed, leans in, winces 489, head shake).
- sets/s2_apron.js: apron.js + the sliced Cessna (props/out/cessna150_sliced.glb) on cessna_spot, our oil glass / jug / tumbler / kitchen scale on the cloth
  (the set's own copies hidden), scale needle live (0 lb -> past 2 to 3.1 -> settles on 2 lb by 386), bites fall onto the pan on 365, white crumbs on 407,
  spring 452-466, tire strand 480-489; held3d builders buildOil, buildJug, buildTumbler, buildTongs, buildWingSlice, buildHub, buildCushion, buildTire.
- sets/ links: apron.js, apron/, vendor/ -> ../../sets/. Links cast, props, voice -> ../.
- FIXED in the shared set: sets/apron.js imported GLTFLoader from yellow-fire-trucks (outside the served folder: 404) -> './vendor/GLTFLoader.js'.
  Noted in sets/SET_CHANGES.md. It now loads in the kit: PE_APRON 1397 meshes, 997,733 tris, load 369 ms.
- finish_s2.sh: mp4 with voice + KEYFRAMES.jpg + strip.

## Camera (stations in make_film.py; one take, no cut)
257 W start on the wing-shadow line (M09) -> 290 W land on the table (Michel, sliced Cessna, hangar) -> 305 M push in on the oil glass (M02) -> 345 M jug
-> 375 C push in on the dial (M02) -> 410 / 452 M lateral truck along the bites (M13) -> 484 C push in on the tire stretch (M02) -> 519 M settle on the belly
(for the M21 match dissolve into the X-ray film, S3). Plan estimate speed p90 under 22 px/f, peak under 26.

## Numbers
- Test stills: 4.1 s/frame at half size (3 frames, software). Draft: about 5 s/frame while other builders render.

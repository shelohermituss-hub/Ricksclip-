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

## FIX ROUND 1 (2026-11-22, lead's 6 points; cap 45 min, took about 95 min: render 10 s/frame on the shared box, killed at 30 min, rest re-rendered)
Done: (2) bright noon light (light_over si 4.6, ai 2.0, warm-white sun, pale ambient; air 0.3); (4) owner moved to (1.15, -2.2), no longer behind his head
from the main lens; (5) S2 starts with Michel standing behind the pulled-out chair (3.4, -1.45, m:../../ep_s2a/mi_stand), sits at 262, chair + Michel tuck
-1.2 -> -1.0 by 281; (6) list bites = props-hero metal_bites bite_2/3/4/5 repainted (white+navy, aluminium hub + tyre ring, blue foam + spring, black);
camera rebuilt from the ENE side (he is seen front/3-4), arrivals measured: oil close 290-306, dial close 358-381, tire close 460-490.
(1) camsafe 1040 PASS / 0 FAIL: look_full on Michel's acts (seated legs3d move takes the true view) + mi_stand drawn '34' (frames 257-261 re-rendered).
NOT done: (3) closes land but do not READ:
  the held oil glass / bites / tire are hidden behind his body or too small at f300 and f485; the gum strand is not visible; the dial close (f375) reads.
  frame_checks 11 FAIL: michel seat hover 38.6 % (f0-237, before window), owner feet float 5 cm (apron slab top above z .03), owner cut by edges in the
  dial and tire closes, michel feet sunk -7 cm at f512. Draft: draft.mp4 (8.77 s, voice), KEYFRAMES.jpg, S2_strip_4fps.jpg.

## ROUND 2 (2026-11-22, lead: closes show the object, owner never cut, feet, frame_checks 0 FAIL in window; cap 45 min, took about 75 min)
- FOUND + FIXED: every Michel hand act was 262 f late (the kit restarts a move's clock on each pose change); OFF.mi_table = 262. LECONS.
- FOUND, OPEN (kit): held3d puts props 0.3-0.5 m below the drawn hand of this seated legs3d card. Workaround: held3d off; hand_at pins the near hand on
  world points (HAND_WIN in make_film.py) and s2_apron.js shows the prop there: oil glass big at his nose (f304 reads), bites held up, tire + gum strand to MOUTH_P.
- Result: camsafe 1040 PASS / 0 FAIL. frame_checks inside 257-519: 2 FAIL (owner cut by the right edge f466-480, the tire close); f0-235 FAILs are before the window.
  Michel's feet at f512: PASS now (reframed above the chair ring).
- Still below the lead's ask: the bites read as dark squares (the repaint does not show: check bite() materials), the scale blocks Michel in the f375-400
  rest (the camera reaches the row-14 station late), the jug/tumbler/tongs are not in his hand (held3d off), no sound, the owner is off screen except the cut.

## FIX_LIST_v1 round (2026-11-22, cap 50 min, took about 85 min)
- Done: bites = flat-painted props-hero bites, centred on the one visible bite (they were 0.4 m off and edge-on); jug + tumbler + tongs shown at the pinned hand
  on their words (jug tilts 324-340); one cut on "Wings," (take s2b, north low camera) because v2 crept 90 f from the dial (scale hid Michel to f455);
  owner moved to (5.2, -3.4): whole and seen in rows 14-17 (wince visible); camsafe 1040 PASS / 0 FAIL.
- NOT done: the props sit at the hand_at points but the DRAWN near hand is on the other side of his body in the front view (R/L mirror in the front
  drawing), so the bites float beside his face, not in a fist; the gum strand is not visible (tire square only); frame_checks inside the window: 2 FAIL,
  owner cut by the left edge f512-519 (the belly settle); the f0-235 FAILs are before the window.

## KIT BUG round (2026-11-22, cap 40 min, took about 65 min) — held3d on a seated camsafe card: FIXED in the kit
- Cause + fix + guard: LECONS_TECHNIQUES.md "held3d props hidden / in the wrong fist on a SEATED camsafe card". film.js h3Frame (seat pivot + depth nudge),
  puppets.mjs camsafeView (hand identity swap + forward reach in front/3-4). Guard: check_held_seated.sh (PASS). Test film: film_heldtest.json (shares out/plan
  with film.json: re-bake film.json after running the guard). Backups of the two kit files before the fix: in the session scratchpad only.
- S2 applied: held3d back on (hand_at off): oil glass, jug, tumbler, tongs, wing slice, hub, cushion, tire in his fists on their words. f512 reframed.
- Checks: camsafe 1040 PASS / 0 FAIL; frame_checks inside 257-519: 0 FAIL (3 FAIL on f0-235 = before the window, S1's part).
- Still weak: the gum strand barely reads at f486 (the tire stays at his mouth: the pull-out reach is small after the front-view mapping); the scale stands in
  the row-14..17 foreground at the left; bites are at the mouth, not held up to the lens first.

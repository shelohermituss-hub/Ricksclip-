# mc stretch STATE (round 1, 2026-11-22, stretch builder mc). PRIVATE study. Not committed.
Files: make_film.py -> mc3/film.json (shot 3, start 120, end 411) and mc10/film.json (shot 10, start 803, end 867); moves/ep_mc.mjs (8 episode moves).
Frames: film frame f = his frame f. Each film runs from f0 (camera pre-roll parked, never rendered) and "start" = first frame of the shot. Links in mc3/ and mc10/: cast, sets, refs, moves.
Set: sets/mc.js in "keys": "reference" (ref_f0 0): map/ring/3/2/1/GO/NO GO/noflush/OFF COURSE land on his frames (checked on stills f192 3, f224 GO, f264 NO GO, f276 banner, f803-866 OFF COURSE).
Draft: half size, 291 + 64 frames, about 1 s/frame (software). Mp4s in references/look_match/astro_flush/work/drafts/mc/ (mc3_/mc10_ ours, his, sbs; key3.jpg, strip3.jpg, strip10.jpg).

## Checks (round 1)
- film_plan check --window: mc3 10 FAIL 7 WARN, mc10 11 FAIL 3 WARN (plan_check.txt). Not fixed, explained: lens 58.9 mm = the set's cams fitted to HIS frames (34 deg);
  head height/caption band/feet/shot mix/first-face/rests are whole-film framing gates that disagree with his measured framing; effects + mood 0 = the set module
  changes the light and screens itself (the planner does not see it); mc10 speed 0 / frozen 27.8 s are counted over the pre-roll f0-802 (camera moves 0.47 m/s in 803-866).
  mc3 "dead still 31 %": tail f283-410 creep is deliberately slight (board: holds the framing).
- check_objects: mc3 FAIL director hands (262: arm reach), controllers head/hands (held over long float); mc10 FAIL director parts (pre-roll), mc_nogo_box/cover (static in shot 10).
- check_collide: mc3 FAIL controllers inside desk_body f0-130 (cards stand behind the desk at y -11.6, boxes overlap 32-67 cm; only before/at the pull-back); mc10 0 FAIL.
- frame_checks: mc3 5 FAIL (ctlBlue cut by left edge f180-410 = his framing also cuts the left controller; director foot slide 5.6 cm/f in the walk 149-179), mc10 7 FAIL (ctlDark/ctlBlue cut left; director 2 % in button_box_go).
- camsafe: mc3 65 FAIL at f129-133 (VIEW_MISMATCH/STEEP during the pull-back, camera 50-80 deg down on the controllers), mc10 0 FAIL.

## For the set builder
- NO GO button is 0.54 m right of the director: his arm cannot reach it from the anchor (move him or the pedestal ~0.25 m closer).

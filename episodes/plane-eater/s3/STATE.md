# S3 STATE: THE X-RAY (PICTURE_PLAN rows 19-22, line 5, film 17.30-21.28 s = frames 519-638). DRAFT round 1, 2026-11-22. Half size (540x960).
## NOT done / failing
- Row 19: the Doctor leaves the frame by f541 ("him"): the push starts too early, so "over the Doctor's shoulder" is not held; his clip hand does not
  touch the film (he stands about 0.6 m from the wall: frame_checks body_in_mesh WARN 23 % of his card in wall_back_0 at f542). No Michel in the room.
- Camera: plan p90 31.6 px/f in the window (target <= 22): the fly into the film (f556-573) and the inside travel (f574-592) are short.
  The cut into the X-ray world is a HARD CUT at f574 when the film fills the lens (two takes), with a cold-blue wash, not a true fly-through.
- Rows 20-22 look: the mattress reads as round BUBBLES (bubble wrap), not a quilted mattress (set fault, known in sets/xray/STATE.md); the runway dashes
  barely read; the frame is washed light blue; the oil sparkle fx sit beside the plane, not behind it. Row 22 "camera rides with it": the camera follows
  a slow arc (a fixed-ish 3/4 view), not a true ride; the plane leaves frame right as planned.
- camsafe 2 FAIL (f561-562 VIEW_MISMATCH: front asked while the camera passes over him; he is hidden from f563). Plan check 8 FAIL: framing gates are
  counted over frames 0-505 too (the Doctor card before this stretch), the real one is the camera speed; the "frozen figure" gate counts pre-window frames.
- frame_checks 2 FAIL are on f0-505 (outside the window). Row 23 (double take) belongs to the next stretch: the Doctor is hidden from f563 and must be
  shown again there.
## Done
- xray.js runs in the kit unchanged (first run): flicker keys (two flickers f519-527), puff on THICK (f584-593), ride on SLID (f618-660), propeller spin.
- moves/ep_s3.mjs dr_lean (side + 3/4 drawings for camsafe): clip hand up, leans in on "-rayed", glasses down on "and", jolt on "found".
  Faces browUp / think / surprised / shocked. POWER 2 white flash + kick on THICK (f592), glint on the film f528.
- Stations: 519 wide (doctor + film, box flickers), 558 push over the shoulder, 573 film fills the lens, 574 inside (ribs, bean, parked plane),
  592 lining push-in on THICK, 622-638 3/4 follow of the sliding bite-Cessna.
## Numbers
- Render 120 frames in 410 s under load (1.5 s/frame on a quiet machine, 181 s). camsafe 563 checks: 561 PASS, 2 FAIL.
- frame_checks 2 FAIL (pre-window) / 1 WARN / 6 PASS. film_plan check --window 519-638: 8 FAIL, 7 WARN of 44.
## Files
make_film.py -> film.json, moves/ep_s3.mjs, render_s3.sh, sheets.py, draft.mp4 (4.0 s, voice, captions), KEYFRAMES.jpg, strip_4fps.jpg,
plan_check.txt, checks.txt, camsafe.txt. Symlinks cast, voice, sets, props -> episode folders.

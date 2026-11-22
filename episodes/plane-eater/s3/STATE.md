# S3 STATE: THE X-RAY (PICTURE_PLAN rows 19-22, line 5, film 17.30-21.28 s = frames 519-638). DRAFT fix round 1, 2026-11-22. Half size (540x960).
## FIX LIST v1 (draft/FIX_LIST_v1.md) - result
- Doctor bigger in the wide: PARTLY (camera in to 0.55, 0.10; he is about 1.3x bigger, still a medium-small figure). The first-frame jump is fixed
  (creep on a first station runs from frame 0: creep 0 + drift with ends, LECONS 2026-11-22).
- Doctor's fist on the film edge: NOT met (hand_at given; his hand rises to his head, short of the film).
- Cushions: kept as round puffs (for Blender).
- frame_checks 0 FAIL / 0 WARN, camsafe 584 PASS / 1 FAIL (f566), window camera p90 9.8 px/f. Plan check 6 FAIL.
## FIX ROUND 2 (lead: simplify) - result
- Five passes, four dissolves on the move (blend.py, passes.json): A1 clinic wide 519-565 -> A2 film close -> B1 X-ray world/lining -> B2 ride -> C back out.
  Each pass a slow drift: window camera p90 18.4 px/f (PASS <= 22). frame_checks 0 FAIL / 3 WARN (wall 3 %). camsafe 584 PASS / 1 FAIL.
- The Doctor is whole in frame through row 19 (A1) and whole for the double take (C, f628-638, jaw drop).
- NOT met: his fist does not touch the film (hand_at 519-600 given; the hand stays up by his head; he stands about 0.4 m from the film).
  In the wide he is small and the tiny plane on the film does not read; f519 is a closer framing than f520+ (first-frame jump of pass A1, not found).
- Cushions: round puffs (accepted for the draft).
## FIX ROUND 1 (lead's 4 points) - result
- (2) DONE: no hard cut. Two DISSOLVES ON THE MOVE (blend.py): 568-577 the push into the film (pass A, film_A.json) into the X-ray world (pass B),
  628-637 the world back out to the clinic (pass C). film.json (cut-based) is only for the checks.
- (3) PARTLY: the world is a richer blue (xray.js "tone": lining glow x.35 #4a86c8, backdrop #2f6fb3, bands x.8, key light x.5, bloom .35); the cushions
  now shade but still read as round puffs, no button tufts (not built). Camera p90 still 32.4 px/f (plan estimate; the 594->620 lining-to-ride leg, 5.1 m in 54 f).
- (4) DONE: the Doctor is back at 620, DOUBLE TAKE in the move (looks away 628, snaps back 633, jaw drop k:peJawDrop). Fault: the last frame cuts him
  at the left edge (frame_checks body_side 44 %, head_cut 31 % at f638).
- (1) PARTLY: the Doctor holds in frame from 519 to about 545 (hand raised to the box, not touching the film), then the push leaves him; he is not kept
  over the shoulder through f562. Wall: body_in_mesh down to 4 % (WARN). camsafe 585 PASS / 0 FAIL. Plan check 6 FAIL (speed p90, rests, head p90).
## Round 1 notes (before the fix round)
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

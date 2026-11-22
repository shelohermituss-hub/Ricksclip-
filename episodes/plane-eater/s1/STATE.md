# S1 STATE: plane-eater THE HOOK (rows 1-9, f0-256 = 0.00-8.56 s), DRAFT round 1, S1 builder 2026-11-22. Half size (540x960), not checked by the lead.
## NOT DONE / below Rick (read first)
- HOOK FAILS RULE NO. 1: frame 0 does not read as "a man seasoning an airplane". The shaker is a small dark blob beside his face, the grains
  are too small to see, and the wing is edge-on: a thin pale line at chin height behind his cheek. Cause: the wing tip is at 1.92-2.01 m
  (ray-cast). A 1.8 m Michel on the ground cannot reach over it, so he stands on his MONSIEUR MANGETOUT trunk (top 0.48 m). The 10-degree
  down-angle rule then puts the lens at about 2.1 m, the height of the wing, so we never see its sunlit top. Options for the lead: (a) lower
  the wing tip with a small roll of the plane (about 6 deg, left wing down; the left main wheel has to go: a continuity question for every
  stretch); (b) waive the down-angle rule for frame 0 only (lens at 2.6-2.8 m looking down at the white top); (c) a hand-made shaker close-up insert.
- Row 7 saw and row 9 tongs/plate/bite: the fists reach the wing but the saw, the cut line, the bite and the plate are too small or
  hidden at half size (f178, f245). The plate on the wing top cannot be seen from his eye level.
- camsafe 31 FAIL VIEW_MISMATCH (f122-152, "Lunch!" look to the lens: asked front, drew 3/4). Fix: give mi_hook a front drawing (third export or a
  view argument for front) or keep the look at 3/4. No waiver.
- Not done: the owner in frame 0 (he is out of the frame, by the propeller; seen in rows 3 and 8); the owner polishing the cut edge (row 8: he
  jolts and polishes faster at the propeller instead); the moustache twitch (row 2); the "MEETING AERIEN 1978" poster is not in frame 0; no 11i
  density or cam_track run; arm_over_reach 78 px on the salting arm (motion gate contact).
- Staging change against the plan: everything happens at the wing tip (salt, saw, first bite); there is no kneeling at the fuselage.
  Reason: one spot, no teleport, and it follows the lead's note.
## Done
- s1/ folder (symlinks cast, voice, props, sets/apron*, sets/vendor). make_film.py -> film.json (camera v2, camsafe, kit3d, tween ones, face_frames 0).
- sets/s1_apron.js: apron + Cessna F-MIAM GLB, code-built showman trunk with MONSIEUR / MANGETOUT front (no asset exists), salt grains, saw cut line +
  silver dust, the bite in the tongs to the plate, POWER 1 impact frame (napkin-red / white focus lines f121-123), ground-bounce light under the wing.
- sets/pe_props.js: held3d builders for the shaker, fork, hacksaw, tongs and rag from props/out GLBs. moves/ep_s1.mjs: mi_hook and ow_polish (STUDIO MOTION).
- Shared fix: sets/apron.js GLTFLoader import (SET_CHANGES.md). LECONS_TECHNIQUES.md: 2 entries (served path; tip_at ignored by move poses).
- CAMERA_NOTE.md (6 stations, 11h moves, reasons).
## Numbers
- film_plan check --window 0-256: 0 FAIL, 4 WARN (plan_check.txt); window speed p90 21.7 px/f, peak 22.4 px/f (plan estimate).
- frame_checks: 0 FAIL, 3 WARN (foot slide 5-10 cm on 1 frame each), 30 PASS. camsafe: 514 checks, 483 PASS, 31 FAIL (above).
- Motion gate: mi_hook twos 0, linear 0, no_settle 0, creep 0, dps 24.8; ow_polish all 0, dps 30.
- Render: 257 frames at half size, one process, 6.8 s/frame (machine load about 18) = 29 min.
## Files
draft.mp4 (8.57 s, voice + captions, half size), KEYFRAMES.jpg (3 per line), S1_strip_4fps.jpg, S1_feet_eyes.jpg, key/t*.jpg (test frames),
render_s1.sh (whole cycle), keyframes.py, sheets.py, sheet.py; frames/ (git-ignored).

## FIX ROUND 1 (lead option b, 2026-11-22) - checks pass, picture still below Rick
- Done: waiver frame 0 (CAMERA_NOTE.md); lens 2.75 m on the wing top; shaker x2.2, 110 additive salt grains; rows 6-8 and 9 CLOSE rests; pedestal
  side table (top 1.50 m, brass + marble) with the plate; aluminium dust larger; mi_hook front drawing (camsafe 0 FAIL); arm over-reach 0.
- Numbers: plan 1 FAIL (shot mix close 29 % of the window: waived, lead-ordered closes), p90 18.6 px/f; frame_checks 0 FAIL 3 WARN 36 PASS;
  camsafe 513 PASS 1 WARN (flicker f63) 0 FAIL; motion gate all 0, reach 0. Render 3.4 s/frame (f150-256 re-rendered at 2.2 s after the close reframes).
- STILL BELOW RICK: f0 the big shaker sits at his MOUTH, not over the wing (the front drawing moved the hand), so the salting does not read;
  the wing top reads grey-blue, not white; in the saw close (f182-205) the wing crosses his face and the hacksaw is hidden behind it; in the plate
  close the tongs are not visible (the bite on the plate is tiny). Row 8 wide removed (camera speed). Next round: hand targets per view for the front
  drawing (verify with render --held), shaker tip_at off, saw/tongs scale 2x and framed below the wing line.

## FIX ROUND 2 (lead, 2026-11-22)
- Done: hand_at (kit st.tgt) blended into mi_hook for the salt, saw and tongs fists; saw x2.8, tongs x3.4; wing_L/aileron/flap with a little sun-coloured
  emission (reads WHITE now); trunk 0.55 m; row 8 is take s1b: an eased 8 f blend f200-207 (blend.sh) from the saw close into a wide REST (whole plane,
  owner jolting), then a push to the plate close (f256). Plan 0 FAIL, p90 19.9; frame_checks 0 FAIL 3 WARN 53 PASS; camsafe 513/1 WARN/0 FAIL; gate 0.
- STILL BELOW RICK: f0 the shaker is still at his mouth: `render --hands michel:0-1` shows tgt [-187, 115] rig px (above his head) and the fist
  clamped short of it: the wing-tip point is beyond the arm in card space from this high lens. Saw close: the hacksaw is still hidden behind the wing.
  Next: draw the salting arm at full reach UP-LEFT in the front drawing (or move Michel 0.2 m nearer and lower the target to 2.10), frame the saw
  close from below the wing line (lens about 1.7 m) so the blade shows under the leading edge.

## FIX ROUND 3 (last, lead 2026-11-22)
- Salting: hand_at fist target raised to 2.22 m (the kit's rig scale puts the fist about 12 % lower than the point; checked with `render --hands`:
  fist 2.02 m, cap 1.87 m) and the front drawing reaches full up/out; the shaker pours over the wing-tip end (best at f20). Michel 0.2 m nearer
  was tried and put the wing tip through his face (key/h1.jpg): kept at x 5.3. Saw close from 1.7 m below the wing line: the blade shows under
  the leading edge (f185), but its grip crosses his cheek. Numbers: plan 0 FAIL p90 19.9; frame_checks 0 FAIL 3 WARN 53 PASS; camsafe 0 FAIL 1 WARN; gate 0.
- Still weak: f0 the shaker also touches his mouth (reads half as salting); saw grip over his cheek; feet slide WARN 5 cm (1 frame x3).

## FIX LIST v1 round (2026-11-22, draft/FIX_LIST_v1.md S1 line)
- Re-rendered only f0-75 and f148-207 (fix_s1.sh) + the blend. Salting fist target moved 0.24 m west (2.28 m), shaker tipped 138-158 deg: the cap
  is on the wing-tip end from f0, but the arm is at full reach (rig clamp) so the shaker body still touches his chin on screen. Saw fist 0.2 m
  lower, saw angle -20: the grip is below the wing and clear of his face at f185; the blade now crosses the wing upright (cuts THROUGH it).
- Checks: plan 0 FAIL; frame_checks 0 FAIL 3 WARN 53 PASS; camsafe 513 PASS 1 WARN 0 FAIL.

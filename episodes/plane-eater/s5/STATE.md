# S5 STATE: THE ENDING (PICTURE_PLAN rows 35-38, line 8b, film 31.44-34.04 s = frames 943-1021). DRAFT round 1, 2026-11-22. Half size (540x960).
## NOT done / failing
- SEATING is wrong: both men read too tall, their bottoms above the cushions, the 3D legs dangle in front of the seat. frame_checks: feet sunk (owner -18 cm,
  michel -4.7 cm), owner hips hover 6.5 % above seat_0B; camsafe 47 FAIL LEGS_DISAGREE (the 3D legs point where he faces, not along the seat, when the
  look turns him). Fix next round: pos z from the real cushion top (anchor .52 may be the seat-pan top, not the cushion) and SEAT_M, legs locked to +x
  (seat direction) with the view taken from the camera, or a seated cast cut at the hips (the fire-truck DRIVER_NOTE method).
- Row 38 is NOT shown: the last frame has the window beside Michel with the sky card, but the airliner wing and its bite are NOT seen. Needs a station on
  the CAM_WINDOW ray (window_L_0 -> wing_bite) with Michel in front, or the bite moved into the new view. The owner's window wipe (rag pay-off) not acted.
- f1021 last frame: Michel cut by the left edge 78 %, owner head cut left+top; framing still close (head width median high).
- Rag: held as "hang" at the owner's hip; it does not go to his eyes with the rub (the hand rises without it). Fork and knife read as black blades
  (dark materials at the half size) and appear at f989 from nothing (should come from the cutlery pack). Foil lift reads weakly.
- Loop to frame 0 not checked (S1 owns frame 0).
- Plan gates (window 943-1021): 7 FAIL, 13 WARN; most FAIL gates are whole-film numbers counted on frames 0-942 where this stretch has no camera
  move (dead still 95 %, rests per 10 s); the real ones: framing (heads too big, cut), moods.
## Done
- cabin.js runs in the kit (first run). Changes, all opt-in (sets/SET_CHANGES.md): "meal" slide state, WILD ROW (row 8 A/B upper seat backs lifted: no
  lens fits in the 0.45 m leg room; the row-8 backs hid both men from the aisle), SKY CARD outside the left windows (the known fault), clear window glass.
- sets/pe_props.js (fork, knife, rag from props/out GLBs for held3d). moves/ep_s5.mjs: mi_meal (foil lift, STILLNESS 955-968, disgust, one-finger
  slide, knife and fork up on "airline", strike on FOOD, chew) and ow_wary (wary, rubs his eyes after FOOD), seated with legs3d.
- Acts on the words: foil 948, STILLNESS 955-968 (camera creep 0), disgust 969, meal slides 976-988, pea 980-996, knife+fork up 991, bite +
  POWER 4 (clank fx, kick 3, white flash) 1001, chew 1007, wink 1015. Faces k:skeptical/peDisgust/proud/peChewHard/peChew/slyWink; owner skeptical/worried/frustrated.
## Numbers
- Render: 79 frames in 547 s (load average ~20 from other builders; 2.6 s/frame on a quieter machine). camsafe 2044 checks: 1996 PASS, 1 WARN, 47 FAIL.
- frame_checks: 7 FAIL / 4 WARN / 20 PASS. film_plan check --window 943-1021: 7 FAIL, 13 WARN of 44.
## Files
make_film.py -> film.json, moves/ep_s5.mjs, render_s5.sh (one command: bake, frames, checks, draft.mp4), sheets.py, draft.mp4 (2.6 s, voice, captions),
KEYFRAMES.jpg, strip_4fps.jpg, plan_check.txt, checks.txt, camsafe.txt. Symlinks cast, voice, sets, props -> episode folders.

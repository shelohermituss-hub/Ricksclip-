# S8 STATE: THE PAYOFF, FIX ROUND 1 (same builder, 2026-11-21). Frames 1754-1898, line 14, rows 54-58, yard DUSK. BOARD.jpg = v2 (half size, key_v2/).
## FIX ROUND: NOT done / wrong
- Plan window still FAILS: p90 29.4 px/f (<= 22), peak 29.8 (plan_check.txt). One take now, no cut; but door push + pull back + push into the eyes +
  whip out = 3 fast moves in 145 f; p90 allows ~14 fast frames. The door station is flowed through (push in, drain, pull back, no rest). Needs a lead call:
  drop one move, or accept the window FAIL for this stretch.
- f1890 last frame: the chiefDown card faces LEFT, away from his truck, and stands upright: he does not read as flat against it. Check dir/view in the act.
- f1806 (row 55): the Chief is NOT in the picture (the pull-back via point frames the hero and the pumper). Row 55 fails.
- POV f1840/f1851: the pumper still reads clearly (bays 0.15 + full drain); not "almost nothing". Fist and arm are flat overlay shapes.
- frame_checks/check.mjs NOT run (time box). camsafe: 11178 checks, FAIL 0, WARN 1.
## FIX ROUND: done
- Door push opens S8, drain wipe nose->tail on "evening" (drainWipe), seen red f1762 -> grey f1772 (gold kept). Workaround removed (assets.js own paint frame).
- Chief march = moves/shared_walks.mjs use s8_ch_march (added by me, N 80 -> 100; gate twos 0 linear 0 slide 0). Pasted per SHARED_WALKS.md.
- Hero no longer cut by the edge (f1890, f1806). Last frame: hero left, Chief at the grey pumper nose, lemon truck + firemen back left, pumper visible.
- he_mug glance cut (no_settle). bays: 0.15 in places.yard.

## ROUND 1 (kept for history): BOARD round 1 (S8 stretch builder, 2026-11-21). Frames 1754-1898 (58.45-63.25 s), script line 14, plan rows 54-58, yard, DUSK.
## NOT done / wrong (seen or measured)
- film_plan.py check --window 1754-1898: 17 FAIL, 8 WARN (plan_check.txt). WINDOW p90 64.2 px/f (FAIL <= 22), peak 68.4. NOT 0 FAIL. The plan's 4 framings
  (close door -> wide -> his eyes -> wide) do not fit 145 f under camera v2 (it wants 89 f + 138 f of travel, room 29 + 30). A framing must go: CAMERA_NOTE.md, 3 options.
  The other FAILs are the known artefact of frames 0-1753 (S1-S7) counted as one parked rest, plus "camera goes around a figure" 1 (the whip).
- The POV is entered by a HARD CUT (take s8b at 1836), against the rule (no cut inside a stretch, enter through the eye). Board-only stand-in.
- Row 56 ("beautiful red truck") plays in the WIDE, not POV; "straight" (1864) falls inside the whip out, not in the POV.
- Row 55: the Chief does not come OUT of the station door: the side door (9.3, 20.3) is beside bay 2 and the yard line runs from the street into the
  pumper's nose, so the march has to run up the line; he is just "there" on "chief" (f1787).
- Last frame f1890 (looked at): hero CUT by the right frame edge; the grey pumper hidden behind the hero; the Chief stands small mid-picture, does
  not read as flat on the truck; floor about half the frame; three firemen small (about 10 % of the frame). Below Rick: NOT a poster yet. Fix = aim about
  15 deg right, lens 30, hero 1 m left and nearer the lens (chest up), camera lower (1.1 m).
- f1762 (the RED door, row 54 "That") did not render (grab Error at the end of the run): the board has 5 of 6 frames; the red-to-grey change is NOT shown.
- Board looked at: the Chief's march card faces screen LEFT (away from his truck) and stands small among the firemen in f1808/f1826: dir/look wrong, he
  does not read as marching to the truck. The hero is cut by the right edge in every wide. POV f1846: the pumper is lit by the bay tubes (reads plainly, not
  "almost nothing"); fist + arm read as flat overlay shapes; brim is a flat cream band. The drained door f1776 reads well (grey-plum, gold letters kept).
- Motion gate (motion_gate.txt): twos 0, linear 0, contact 0; no_settle in he_mug (glance f70-91 too short) and rk_up (helmet push f131-142).
- Not built: smear frame on the last step (POWER 5), camera bob in the POV (the overlay bobs, the lens does not), a sandwich for the Old-Timer (empty fist),
  the Chief's lit-window pool; the lemon truck glow is a point light (no bloom pass checked).
- No Rick frames exist in the repo: no side-by-side.
## Built (files, s8/)
- make_film.py -> film.json (camera v2, camsafe, kit3d, tween ones, face_frames 0, card_shade 0/0, costume_shade keep_drawn_light + smooth 40, LITE town,
  truckFull, kind du). Takes: "pre" (parked stand-in 0-1753), s8a (door -> wide), s8b (POV -> whip -> last frame).
- moves/ep_s8.mjs: 6 episode moves (ch_march, ch_splat, he_mug, ot_bite, rk_up, sc_open), studio_ep.mjs copy, tools/check_motion_ep.mjs copy.
  Plain kit poses 0, frozen moves 0. Faces on the word: proudShut (Chief), chiefDown card on "into", hero proud on the sip, Rookie/Sceptic on "it".
- sets/s8_yard.js: wraps sets/town.js; pumper paint DRAIN on "evening" (1768-1777); bell swing on "into"; story lamp over the lemon truck + lemon spill;
  mug steam; POV edges fixed to the lens (brim, moustache, lids, fist going out on "beautiful", knees on "walked"); POWER 5 stars + shock lines; kick f1876.
- Symlinks cast, voice, assets_prod, sets/{town.js, town, assets.js, prop_kit.js} (as s1). CAMERA_NOTE.md, board.py -> BOARD.jpg, key/f_*.png.
## Requests (not done by me)
- lead / camera-director: pick one CAMERA_NOTE option (best: S7 ends on the red door and drains it; S8 starts wide). Also OK to drop "out of the door".
- town (set-builder): the yard line is a chipped double strip (it hurts row 57, the EXTREME "ruler"): one clean white line, x 4.2, 7.9 -> 18.55.
  The town's wall lamp is 13 m from the lemon truck: a lamp over bay 1 (I add a story point light).
- props-hero: buildTruck should set uInvRoot itself (workaround copied from s1); a sandwich for the Old-Timer; the mug's crest/chip/lemon print.
- kit owner: render_gpu.mjs default --grab on SwiftShader timed out at 30 s on the first S8 frame with the CPU shared; --grab canvas works.
## LECONS (LECONS format, for the lead to copy into LECONS_TECHNIQUES.md)
- 2026-11-21 Problem: a mid-film stretch's first camera station never rested (the camera was already flying at f1754). Cause: film_plan.py starts the first
  take at frame 0, so the travel into the 2nd station was stretched back into 0-1753. Fix: a parked "pre" take at 0 so the stretch take starts AT its
  first frame. Guard: make_film.py builds the "pre" take; check camera_baked frame <start> state "rest". Proof: f1754-1777 rest after the fix. FERMÉ
- 2026-11-21 Problem: key frames died with "locator.screenshot: Timeout 30000ms" (no PNG). Cause: SwiftShader on a CPU shared by ~7 helpers; the
  default grab is a compositor screenshot with a 30 s limit. Fix: --grab canvas. Guard: the line in this file's render command. Proof: f1890 written. FERMÉ
- 2026-11-21 Problem: motion gate crashed (sig[a] undefined). Cause: the gate looks ~20 f past a strike; N ended at the stretch end. Fix: N = 165 in
  ep_s8.mjs. Guard: comment at N. Proof: motion_gate.txt exit 0. FERMÉ
## Checks
- camsafe validate: 11177 checks, PASS 11177, FAIL 0 (camsafe.txt). frame_checks/check.mjs: NOT run (time box over; it renders, one process at a time).
- motion gate: motion_gate.txt (above). film_plan check: plan_check.txt (above).

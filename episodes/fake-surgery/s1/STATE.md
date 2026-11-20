# S1 v4b STRICT (2026-11-17, FIX_BRIEF_v4 v4b: every-frame check 0-386). Same ONE command: bash final/run_final.sh. Backup: build_film_v4.py.bak. Sets untouched.
## What changed (build_film.py camera + one patient hide)
- Splash travel f40-142: via [0.5,-1.25,1.62] aim x -0.62 -> via [0.6,-1.7,1.62] aim x -0.45 (further back, aimed right): the nurse is whole (was cut by the right edge f59-113).
- ONE HARD CUT f279 on "whispers" (takes 'or' f0-278 + 'or2' f279-386): the tray rest holds to f278, then the nurse two-shot (lens 19 -> 18). The 1.4 s pan sliced the lying patient by the left edge for 22 frames.
- Patient card off from f279 (visible=False): he is out of the two-shot; his drape sliver sat on the 15 % line and failed in the door flight.
- Door flight f345-386: via [[0.95,-0.15,1.95],[1.3,1.5,1.75]] aim_via [[0.25,1.3,1.7],[1.0,2.6,1.68]]: backs off first (team smaller), then swings to the door mid-move; surgeon/nurse leave the left edge in 1-3 frames (was 10). f386 porthole pose, impact f156 unchanged.
## Numbers
- Strict check (--all-frames 0-386 --no-body): 5 FAIL -> 0 FAIL, 4 WARN (surgeon 3+2 frames, nurse 2+1 frames leaving the left edge in the door swing f362-366). board/checks_strict_v4b.txt.
- film_plan check: speed median 1.24 / p90 7.2 FAIL, speed peak 62.4 WARN (door swing), dead still 28.8 WARN (the two-shot rest is a near-still hold).
- Re-rendered f40-142 + f255-386; rest check 0 FAIL / 2 WARN (patient 2 % table head section, allowed); flicker FAIL f155-158 (planned impact) + f279 (the planned cut); WARN 352-358, 380 (door swing). Logs final/run_v4b.log.

# S1 v4 FIX (2026-11-17, FIX_BRIEF_v4: no cut heads/bodies). Same ONE command: bash final/run_final.sh. Backup: build_film_v3.py.bak. Sets untouched.
## What changed (build_film.py camera only; positions, timings, impact f156, f386 porthole kept)
- Knee rest f142: aim x -0.06 -> -0.12, lens 24 -> 19 (KN_LENS) so the patient (left) and nurse (right) are whole.
- Power peak f156: crash zoom 24->31 became 19 -> 19.6 + aim 5 cm left (KN2), creep 0 and side drift 0 (the creep pushed 0.22 m in and cut both); a vertical drift z -0.14 keeps it alive. Impact frames + kick unchanged.
- Nurse two-shot f300: aim x 0.02 -> 0.11, creep 0.007 -> 0.001 (the creep pushed the surgeon out at f344, the old aim left a patient sliver at f300).
## Numbers
- Frame checks v3 -> v4: 5 FAIL / 3 WARN -> 0 FAIL / 2 WARN (both patient 2 % in table_head_section/back pad = allowed type 1).
- film_plan check: dead still 11.1 -> 23.8 % (WARN, ok line 29: the two-shot rest is nearly parked; any side/vertical drift there cuts the patient or the surgeon). Other gates as v3.
- Weak: the crash zoom on "plasters" is now a small 19->19.6 punch (the kick + impact frames carry the power).

# S1 v3 FIX (2026-11-17, FIX_BRIEF_v3 + ISSUES_v2). Same ONE command: bash final/run_final.sh. Backups: build_film_v2r2.py.bak, or_room_before_s1v3.js.bak, or_props_before_s1v3.js.bak (or_props.js untouched).
## What changed
- sets/or_room.js NEW keys (default off): water_v3 {bursts,size,drops} = shared water_fx 'bulb_splash' from the bulb nozzle (replaces splash_big); ko_clean = registerKoClean('koClean');
  zzz_v3 {head,toLens,lift,rise,f0,f1} = shared zzz_fx on the CARD head [-0.92,0.78,2.02], moved 0.6 m toward the lens every frame (pre-warm f0 -30). Imports water_fx.js + zzz_fx.js.
- build_film.py: env_v3 on; patient face 'koClean' (no zZ in the face) + floating Zs; splash size 2.2 (1.7x the 1.3 default) with 12 drops (more drops left a field of bubble-like wet splats).
- CAMERA (6 stations): f0 rest moved back/left, 24 mm (patient head WHOLE, nurse whole); splash view aim moved left (patient head whole at the splash); knee view higher + further [0.42,-0.85,1.8] aim z 1.7, 24 -> 31 mm crash zoom (surgeon head WHOLE); tray rest f228-255 at [1.3,-0.95,1.6] 16 mm (all three whole);
  NEW nurse medium two-shot f300-345 [0.42,0.05,1.9] aim [0.02,1.3,1.72] 19 mm (her line, his smiling eyes on "operation" f350); door flight f345-386 via [0.95,0.95,1.85] passes the nurse/team on the left. Impact f156/f157 + kick f156 and the f386 porthole pose unchanged.
- final/make_final.py: board_vs_final skipped when board panels are absent (they were deleted after approval).
## Numbers
- film_plan.py check (camera): 0 FAIL camera gates (WARN speed p90 14.8); lines in final/plan_camera_v3.txt. Acting gate "camera goes around a figure" FAIL 3 (as in v2).
- check_film.py final/preview.mp4: speed median 4.25 PASS, travel p90 2.3 s PASS, rest median 0.75 s PASS, whips/min 9.33 PASS, dead still 5.1 % PASS; FAIL at rest 17.9 %, FAIL cuts/10 s 3.89 (impact frames f155-158 + splash flashes read as cuts; no camera cut), WARN rests/10 s 1.55, WARN speed p90 29.7 (final/check_film_v3.txt).
- Frame checks 5 FAIL / 3 WARN / 94 PASS: 4 FAIL in the knee views f142-185 (nurse right edge, patient left edge: knee waiver; the SURGEON head is whole), 1 FAIL patient body (not head) sliver at the left edge f300-312 of the two-shot.
- Flicker: FAIL only f158 (planned impact); WARN f118-122 (splash), 287/293, 354-358 (flight past the nurse). Motion gate: twos 0, linear 0, no_settle 0. Colour: sat .469, mean .418, red px 4 (impact frames).
## Still weak
- Wet splats stay on the drape after the splash as see-through rings (can read as bubbles in the knee view); water_fx owner could fade them.
- The door flight is 1.37 s (A4 holds the nurse till f345); fast past the nurse (WARN flicker 354-358). Zs mostly high frame-left at f0 (near the ceiling grid).
- check_film rests/at-rest numbers below target: the rests carry creep 0.003-0.007 so the measured camera rarely reads as resting.

# S1 v2 ROUND 2: CAMERA ONLY (2026-11-16, CB: camera "too fast ... like zig zag"). Same ONE command: bash final/run_final.sh. Backup: build_film_v2b.py.bak (v2 round 1 cam).
## Stations (build_film.py cam, 5 stations, 4 rests, every travel eased by smoother over its whole length)
- f0-40 FRAME 0 rest (approved pose unchanged), creep 0, drift [-0.07,-0.15,0] truck = slow pull-back a little left: patient AND nurse stay whole (v2 had patient body_side FAIL f0-32).
- f40-142 3.4 s move via the splash view [0.55,-1.0,1.62] to a MEDIUM knee view [0.34,-0.36,1.97] 26 mm (was 0.72 m close; now ~1.05 m: drape window + plasters read).
- f150-156 the ONE planned whip: POWER crash zoom lens 26 -> 33 (6 f, whip: true), impact f156 unchanged (kick f156, impact frames f156 #bff0e0 / f157 white).
- f156-188 held peak; f188-263 2.5 s pull-back off the knee to the merged two-shot (tray rest + nurse two-shot merged into ONE rest): [1.15,-0.65,1.55] aim [-0.06,0.95,1.35] 17 mm, STERILE tray in the foreground, f263-320 (creep 0, small arc drift).
- f320-386 door flight 2.2 s via [1.55,0.9,1.64]; f386 porthole join pose unchanged ([1.43,2.79,1.6] -> [1.43,3.6,1.6], 24 mm).
## Numbers
film_plan.py check (camera): 0 FAIL (WARN speed p90 13.6, dead still 25.1 %); lines in final/plan_camera_v2r2.txt.
check_film.py final/preview.mp4, v2 -> v2r2: whips/min 14.0 -> 9.33 PASS; rests/10 s 4.66 -> 3.11 PASS; travel p90 1.90 -> 2.24 s PASS; speed p90 26.7 -> 23.5 PASS; speed median 3.11 -> 2.25 PASS; dead still 4.2 %; cuts/10 s 2.33 FAIL = only the planned impact frames f155-157 (no camera cut).
Measured holds f0-58, f128-148, f159-202, f258-324; travels 2.3 / 0.4 (zoom+shake) / 1.9 / 2.0 s.
Motion gate: twos 0, linear 0, no_settle 0. Frame checks 7 FAIL / 3 WARN / 70 PASS: all FAILs in the knee views f142-149 and f161-196 (knee-close waiver: surgeon head top, patient/nurse at the edges); frame-0 rest and the two-shot rest clean. Flicker FAIL only on the planned impact f155-158; WARN f349-354 (door flight past the team).
## Still weak
- The door flight still measures 2 whips (f349-357 ~50 px/f passing the team/monitor cart, f372-377 ~64 px/f as the porthole ring sweeps by in the last 0.4 m). The end is intrinsic to the f386 join pose 0.17 m from the glass in 2.2 s; only a longer flight (start ~f300) or a join pose further from the glass would remove it.
- The crash zoom peaks 42 px/f for 2 f (not counted as a whip).
- The knee medium view f142-149 still crops the surgeon's head top (knee waiver); a 5-10 cm higher/further pose would clear it.

# S1 v2 FIX (2026-11-16, CB notes on final v1). Same ONE command: bash final/run_final.sh. Backups: build_film_v1.py.bak, build_film_v2a.py.bak, or_room_before_s1v2.js.bak, or_props_before_s1v2.js.bak (or_props.js untouched).
## What changed
- CAMERA: 9 stations -> 6 (4 rests + the frame-0 start + the door). f0 frame-0 rest 1.1 s (drift) -> ONE 3.9 s eased move via the splash view (front-right) into the knee close (f150) -> power rest (f150-178, kick f156) -> 1.2 s pull-back to the tray rest (f212-236: sealed scope on the Mayo tray, knee, NO SIGNAL monitor) -> 2.7 s rise to the nurse/surgeon two-shot (f318-344) -> 1.4 s flight to the porthole (f386). No 10 mm lens, no teleport, no whip station.
- Patient: KNOCKED-OUT meme face 'koZ' (or_room.js key ko_face: registers MEMES.koZ = memes 'ko' without the head bump + zZ bubble) all stretch; thumbs-up from under the drape on "operation" stays (pose).
- Splash (row 4): or_room.js key splash_big {bursts, size, drops}: fat blue stream from the nozzle, opaque inked splash crown + ring, 14 fat drops landing as wet splats on the drape (raycast). The bulb's static drop fan is hidden under this key.
- Row 6: the impossible scope view and its crinkle streaks are GONE (scope_view/scope_cam off). Key scope_tray: the scope coiled in a clear sealed bag (white seal edges, one fold, big yellow STERILE/SEALED tag) on the Mayo tray; NO SIGNAL monitor behind.
- Porthole: key porthole_view: the door glass shows the amber corridor (S2 colours: amber wall, green dado, dark green ceiling) with a faint glint, no white glow. Join pose at f386 unchanged ([1.43,2.79,1.6] -> [1.43,3.6,1.6], 24 mm).
- For S3/S5: set ko_face=True and splash_big=dict(...) on the OR place to reuse the meme face 'koZ' and the big splash.
## Camera numbers
film_plan.py check (camera, v2): 0 FAIL
  PASS camera   at rest (< 2 px/f), % of frames                            61.0           target >= 
  PASS camera   rests per 10 s                                             3.88           target 2.2
  PASS camera   rest length median, s                                      1.63           target >= 
  PASS camera   longest travel, s                                          1.27           target 3-7
  WARN camera   speed median px/f                                          1.8            target abo
  PASS camera   speed p90 px/f                                             16.4           target abo
  PASS camera   dead still (reads under 0.3 px/f when measured), % of frames 10.3           target <
  PASS camera   speed peak px/f                                            49.5           target <= 
  PASS camera   cuts per 10 s                                              0.0            target <= 
  PASS camera   tilt while resting, deg                                    0.0            target lev
  PASS camera   roll rate peak deg/f                                       0.0            target <= 
  PASS camera   lens outside 16-55 mm on non-insert frames, %              0.0            target wid
  PASS camera   travels that swing the view over 120 deg                   0              target 0: 
  PASS camera   word stations not at rest on their word                    0              target 0: 
  PASS camera   at rest while a face is on screen, %                       64.0           target >= 
  FAIL acting   camera goes around a figure but its view never changes     3              target 0: 
         FIX: surgeon f0-364: camera goes 64 deg around, view stays 34 (no look); nurse f191-367: ca

check_film.py final/preview.mp4, v1 -> v2: rests/10 s 6.22 -> 4.66 (WARN); travel p90 0.94 -> 1.90 s (WARN); speed median 1.71 -> 3.11 (PASS); speed p90 24.5 -> 26.7; cuts/10 s 4.66 -> 2.33 (FAIL: the planned two-tone IMPACT frames f156-157 + the door flight); whips/min 9.3 -> 14.0 (FAIL: the push into the knee close, the pull-back off it, the door flight).
## Checks
Motion gate: twos 0, linear 0, no_settle 0. Frame checks 4 FAIL / 3 WARN / 75 PASS: surgeon head_cut only in the knee CLOSE f162-177 (knee-close waiver); the other FAILs are patient body_side (his body cut by the left edge, head whole) f0-32 (frame 0), f162-177, f212-237. Flicker FAIL only on the planned impact f155-158.
Impact frames unchanged: f156 (#bff0e0) + f157 (white), kick f156; splash bursts f89, f103.
## Still weak
- whips/min 14 and cuts 2.33 in check_film: the knee push-in and the door flight still read as whips; next step: longer pull-back (2 s) and start the door flight at f340.
- The STERILE tag reads but is small at the tray rest (f212-236); a closer tray rest or a bigger tag would help.
- The splash happens while the camera is moving (about 6-8 px/f); it reads in the stills, check at full speed.

# S1 STATE: BUILD-OUT (2026-11-16, round 6). Board rounds 1-5 archived in STATE_board_rounds1-5.md.
Film frames 0-374 (0.00-12.50 s), rendered 0-386 (12 handle frames), plan rows 1-10, one flying take "or" in OR 3 (light kind OR).

## The ONE command (from s1/)
`bash final/run_final.sh` (STAGE=post = no render): build_film.py -> bake -> motion gate -> GPU 0-386 at 1080x1920 in 3 calls (shared queue)
-> final/make_final.py (numbers.txt, strip_2fps.jpg, board_vs_final.jpg, preview.mp4 720x1280 + voice) -> frame checks (final/checks.txt) + flicker (final/flicker.txt).

## Delivered in final/
frames/f_00000..f_00386.png, preview.mp4, strip_2fps.jpg, board_vs_final.jpg (each approved board panel above the final frame), numbers.txt, checks.txt, flicker.txt, motion_gate.txt.

## Build-out changes
- sets/or_room.js NEW key knee_crisp {edge, ink, er, ir, fold, back}: hard lamp-edge line along the thigh + shin tops, dark ink line behind it
  (the V silhouette), fold lines down the near flank, darker body mound behind (back '#24488a'). scope_cam.fade: the bag film rides .07 in front of
  the lens and fades in/out with the seal tag by the lens' distance to the scope (no one-frame pop). Backup: or_room_before_s1r6.js.bak. or_props.js untouched.
  Round-5 keys unchanged and still working (lie_body, leg_drape, knee_win 'thin', knee_scale, steps).
- build_film.py (backup build_film_r5.py.bak): THE OR KNEE values now (S3/S5 copy these for one look):
  knee_v3=dict(at=[-0.04,0.47,1.31], hip=[-0.32,0.47,0.93], foot=[0.25,0.47,0.9], face=[0,-0.7,0.72], win=0.13, ball=0.092, dx=0.04, dot=0.0135,
  dome=0.022, pw=[0.039,0.08,0.035,0.076,0.023,0.023], w=0.11), knee_crisp=dict(back='#24488a'), plus the r5 keys leg_drape, knee_win 'thin', lie_body, steps.
  Thigh ~50 deg, shin ~52 deg up, foot flat. Frame-0 leg V about 40 % of the width (was 31 %), crisp edge; window + dot 1 above the caption.
- Patient card visible from f0 to the end (the hide f120-210 removed: it popped him out at f120 and in at f211 inside moving shots).
- Row 6 scope view: 10 mm, aim [-0.08,0.85,1.36]: patient, surgeon and nurse whole (patient cut 38-60 % before).
- Row 7 exit: via [0.78,-0.3,1.42] lifts the camera over the steel bowl (was a foreground whip-pop).
- NEW last station (arrive f386, 0.8 s flight from f362): the join to S2 (below).

## Impact / hit frames (sound + joins)
tik dots f25, f37, f46 (row 2) | plaster slap 1 f133, slap 2 f147 | POWER row 5: hand hangs high f148-155, IMPACT FRAME f156 (#bff0e0) + f157 (white),
ray burst + stamp ring f156, camera shake 7 f from f156 | small pat f166 | bulb squeezes f88-122 (row 4) | pats on plaster 3 f350, f359 | nurse lips f262-367.

## Joins
- Inside S1: none cut, one take (fly, land, rest, fly on). Hard cuts: 0.
- OUT to S2: f362-386 the camera flies across the OR to the OR 3 door; at f386 the LEFT porthole glass (wired) fills the frame:
  camera [1.43, 2.79, 1.6] aim [1.43, 3.6, 1.6], 24 mm, level (porthole_L anchor [1.43, 2.96, 1.6], glass 0.17 m in front). S2 starts out of that glass.

## Numbers
- Motion gate sg_s1 / nr_s1 / pt_s1: twos 0, linear 0, no_settle 0, creep 0 (final/motion_gate.txt).
- Frame checks: 3 FAIL / 11 WARN / 150 PASS. All 3 FAIL = row 5 knee CLOSE f126-155 (surgeon head_cut 21 %, surgeon body_side 79 %, patient body_side 36 %):
  waived (PICTURE_PLAN knee rules: in the knee close a figure at the edge is meant). WARNs = 1-4 % body_in_mesh (cards against drape/pillow).
- Flicker: FAIL frames 155-158 (the planned IMPACT frames + shake), 173 (score 1.16, fast push-out from the knee close), 179 (seal tag enters at the bag), 384 (porthole ring
  sweeping past the lens on the join). No unplanned pops elsewhere.
- Colour (ungraded): sat 0.489 (min .066 on the white impact frame f157; per second .37-.60), mean .389 (min .317), red-gate px 8 total, all on impact frames f156-157.

## Weak / open
- Row 6: at 10 mm the STERILE tag and the surgeon are smaller than on the board panel (all three figures whole instead); a larger tag (scope_cam tag size) would help.
- Red gate: 7 px on impact frame f156 (+1 on f157), inside the two-tone flash; tint the impact a step cooler if the grade flags it.
- Row 1: only dot 1 drawn at f0 (knee_track by design: dots 2-3 on "three tiny holes"); the fist + scalpel sit just above the window.
- The leg V is still under the surgeon's chest from the near side (no gap), read by its lit edge + ink line, not by background contrast.
- Porthole end: the glass is a light wired disc; S2 must match its colour on the way out.

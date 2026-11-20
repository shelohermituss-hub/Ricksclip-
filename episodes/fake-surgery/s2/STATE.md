# S2 STATE: BUILD-OUT (2026-11-16), rows 11-20, film 375-777, rendered 363-789 (12 handles each side), 427 frames 1080x1920 in final/frames/f_<film>.png
## LAST OFFICE STATION (S3 starts from it; fixed, held f736 -> f789, at rest from about f754)
- lens 26 mm, pos world [120.1, -0.8, 1.4] (office local O(.1, -.8, 1.4)), aim world [120.0, 0.95, 0.95] (local O(0, .95, .95)), place NI office (dress 'night', ni_v2, trays). Subject: the three trays L-M-R (scrape, rinse, trick), fill k [.6,.6,.6] from f768.
## The ONE command (from s2/)
- `bash final/run_final.sh`: build_film.py -> bake -> motion gate -> final/render_final.py (shared fair queue ../tools/gpu_render.sh, chunks of 145, resumable: delete a frame to re-render it) -> final/make_final.py (numbers.txt, strip_2fps.jpg, board_vs_final.jpg, preview.mp4 720 wide + voice) -> frame checks -> flicker.
- Rough board command unchanged: `bash run.sh` (key frames into board/).
## Takes, joins, impact/hit frames (film frames)
- Take co (corridor CO) f363-539: f363 IN the OR 3 door porthole L glass (S1's end), pull back to the doors (f380), whip round to the CRT/calendar (f394, "1990s"), window (424), porthole L (456) -> R (470), gurney queue (488), window out EXTREME (506), clock spin (526), push into the clock face (537).
- Join r15->16: matched clock face, corridor clock (f539) -> office clock (f540) at night = the plan's "fly into the clock, out of the office clock". No other cut in S2.
- Take of (office NI) f540-789: clock pull out -> lockers + colleague's hand tap (taps f552, f562) -> note close (588, push 600) -> POWER r18 (628) -> tower EXTREME (684) -> trays (736, last station above).
- POWER r18: hold f628-649 (cup at lips), IMPACT FRAMES f650 (inverted white) + f651 (pale yellow), camera kick (shake) on f650, "?" field f652-664, focus lines 651-664, sweat 656-668, glint 650, cup overflow f652-669, settle to f672.
- EXTREME r19 tower f668-724 (lift 674-686, sway sine, lamp ducks 676-734). Deal into trays f736-766 (6 cards, 6 f apart).
## Changes this round (only new keys; S3/S4/S5 dresses untouched)
- corridor.js key `ph_big`: each porthole view is a drawn canvas redrawn per frame (clipped by the glass): gowned surgeon silhouette (cap, mask, shoulders) over a draped knee mound; L = clipper scraping, R = jug pouring a white-blue stream, same factory beat. Glass veil .16 -> .06 under ph_big.
- build_film.py: render from 363 (porthole pull-back + whip to the CRT), r12 aim lowered (less ceiling), r13 lens 22 -> 38 (porthole fills about 60 % width), r14 aim up (heads off the top edge), CO ambient ai .78 -> .64, tower_at [.5, 1.3] (beside him: face now visible; it was hiding his face), r19 aim O(.3,1.25,1.85).
## Numbers (final/numbers.txt, ungraded, captions in, every 3rd frame)
- sat / mean per row: r11 .345/.539, r12 .231/.606, r13 .294/.515, r14 .243/.636, r15 .398/.619, r16 .417/.354, r17 .630/.352, r18 .379/.499, r19 .319/.508, r20 .409/.414. ALL sat .371, mean .491.
- Red gate 0 px in every measured frame. NI mean min .241 (inside the clock pull-out/note close moments; row means all >= .35).
- Motion gate 0/0/0/0 (sg_s2, so_s2, gw_s2). Frame checks 0 FAIL, 1 WARN (g2 body_in_mesh 4 % in the gurney drape = the reclined-under-drape waiver), 59 PASS.
- Flicker FAIL: 27 frames > 1 (final/flicker.txt). f540 = the planned clock-face join; f650-651 impact (planned). NOT planned: 374-375 + 387-388 (porthole pull-back / whip to CRT), 416-421 + 441-444 (CRT->window travel, window shimmer), 482 + 498 (r14->r15 travel, surgeon passes near), 553 (hand tap), 673 (tower pop-in at 668). Fix next: longer travels (travel .4 -> .7) on 380/394/424/506, the tower fade-in over 6 f.
## Weak / open
- CO saturation still < .30 on r12 (.23) and r14 (.24): pale ceiling grid + white sky/gurneys; the grade (editor) must lift CO, or the ceiling needs colour.
- r19: the fists are not ON the tower sides (the tower centred on him hid his face; it now stands beside him, near fist at its edge). "180 KNEES" tab reads only partly near the ceiling.
- f495-500 travel r14->r15: the waving surgeon passes big in front of the queue for a few frames.
- Porthole clipper (r13 L) small at phone size; the jug pour reads.
- surgeonOff mask: maskChin (round 2) kept.
## ROUND 2 (flicker fix, 2026-11-16) - EDITS DONE, RENDER PENDING IN THE SHARED QUEUE
- build_film.py: 363 hold .05; 380 travel .55 hold 0; CRT station 394->398 (travel .5, hold .2); window 424->428 (travel .8, hold .25); queue_out 506->509 (travel .6); surgeon hidden from f489 (no wipe in r14->r15; the wave is gone, he is out of every frame there anyway); tower_grow [[667,0],[676,1]] (eased y-scale from the table top); tap 'win' 7 'amp' .04 (softer tap, taps stay f552/f562).
- sets/office.js: NEW optional keys only: tower_grow, tap.win / tap.amp (defaults unchanged).
- Frames deleted for re-render: 363-540, 546-566, 664-680. `bash final/run_final.sh` (started in the background, log final/run2.log) renders them, then make_final, checks, flicker. If it died: just run `bash final/run_final.sh` again (resumes). Then read final/flicker.txt (expect only 540 + 650-651), final/checks.txt (0 FAIL), strip_2fps.jpg.
- NOT done: r19 fists on the tower sides + "180 KNEES" tab (not cheap).  Results of flicker/checks not yet read.
- UPDATE: all 427 frames rendered (216 re-rendered), make_final done (preview.mp4, strip_2fps.jpg, numbers.txt refreshed); frame checks + flicker were still running at hand-back (run2.log has the end). final/flicker.txt shown before then is the OLD one: re-read it when `real` appears in final/run2.log.
- ROUND 2 RESULT (final run complete): frame checks 0 FAIL / 0 WARN / 58 PASS. Flicker still FAIL, 26 frames (was 27): 372-373, 388-389, 411-412, 416-417, 421-422, 443-444 (+ f540 planned; list truncated, f650-651 not confirmed). Worst after 540: f422 4.4, f444 3.8, f373 3.6, f389 3.1, f417 3.0, f553 2.6 (tap unchanged), f500 2.2. f673 and f498 are out of the worst list (tower grow and surgeon hide worked). Longer travel did not clear 372-444: next try a different camera path (smaller turn on 380->398 whip, less distance 398->428), not more frames. Strip not looked at.
## ROUND 3 (2026-11-16): CORRIDOR EXPOSURE JUMP FIXED
- Cause (not camera speed): film.js adds a 6 m additive halo sprite on every mesh named *lens*/*globe* with role lamp; the 8 troffer lenses (corridor.js) veiled the whole frame when a troffer was ahead of/above the camera and the veil vanished on the frame it passed the lens plane (f421-422, 443-444, 388-389, 416-417 ...). Fix: NEW corridor.js key `troff_nohalo` (renames the panel so no halo is added); set in build_film.py COp. Default off, other sets unchanged.
- Frames 363-540 re-rendered, make_final, frame checks 0 FAIL / 0 WARN / 58 PASS, motion gate unchanged.
- Flicker FAIL frames now 6: 536 (1.9, push into the clock face), 540 (planned join), 552/553 (hand tap), 585, 673 (tower). Corridor 372-444 all cleared. f650-651 not listed. Next: tap (552-553), 585, 673, 536 are small leftovers.
## v2 FIX ROUND (2026-11-16, FIX_BRIEF_v2.md): camera re-planned as 2 flowing takes; no soft_arm; no corridor fog
- LAST OFFICE STATION (S3 starts from it): UNCHANGED = lens 26, pos world [120.1, -0.8, 1.4], aim world [120.0, 0.95, 0.95], arrives f756 (was 736), at rest to f789. Tilt-down from the tower station O(-.3,-.3,1.3)->O(.3,1.25,1.85) 18 mm.
- Corridor take (3 stations, was 10): f363 in the porthole glass (ph_clear: no glass tint/glint, teal OR view, no white glow) -> slow pull-out (via a point 0.24 m off the glass) ->
  f405 rest (1.45 s, default creep+slide): OR 3 doors + both porthole silhouettes + CRT cart + calendar "1994 / HOUSTON TX" moved to the RIGHT wall beside the doors (corridor.js key period_right)
  -> ONE 2.9 s flight straight down the corridor beside the gurney queue (sore knees), window + queue_out ahead (all day long), into the face of a CEILING-HUNG clock (corridor.js key clock_hang
  [-.3,7.2,2.2], face facing the lens, lit) = straight push, matches the office clock join at 540 (no 90 deg turn). The surgeon is NOT in the corridor (he is the porthole silhouette); no wave, no glide.
- Office take (6 stations, was 8): clock face f540 -> straight pull-back to a wide f582 (he sips BEHIND THE DESK from f540: no pos change = no glide; the "?" note on locker 2; NEW office.js key
  ask_bubble: a white speech bubble with a red "?" pops f560-604 by the lockers, tail to the off-frame colleague; the soft_arm hand ('tap') is REMOVED) -> slow push f643 (anticipation) -> crash zoom f652
  (power, impact frames 650/651 unchanged) -> pull back + tilt up with the tower f704 -> tilt down into the trays f756.
- Camera numbers (film_plan bake, measured over S2's own frames 363-789; the stock `film_plan.py check` also counts the unseen frames 0-362 as one dead rest, so its speed median reads low):
  BEFORE v1: 17 stations, speed median 0.68 px/f, p90 38.2, peak 430.6 (FAIL), dead still 50 % (FAIL), longest travel 0.77 s.
  AFTER v2: 9 stations, rests/10 s 4.9 (plan; picture reads ~1 lower), rest median 1.0 s, longest travel 2.9-3.0 s, speed median 3.4, p90 ~19, peak 56 (f386-389, the pull-out of the porthole glass turning to the doors; every other frame <= 38), dead still 8 %, cuts/10 s 0.7 (the one clock-face join). 0 FAIL camera gates on the S2 range.
  Stock check on the whole film.json: final/plan_check_v2.txt.
- v2 render 1 lessons (fixed before render 2): (a) a creep on the FIRST station runs from frame 0, so 363 frames of creep pushed the lens THROUGH the porthole plate (f363-375 teal, pop 47 at f376): first station creep=0;
  (b) the office pull-back passed the troffer lens plane = the same halo veil flip as the corridor (f561-562): NEW office.js key troff_nohalo; (c) g1-g3 sat at the left edge of the door picture (body_side/head_cut FAIL)
  and g3's card met the dado at the flight angle: door picture aim turned 9 deg right, g1+g2 visible all take, g3 out.
- Picture measure on render 1 (check_film on preview.mp4): rests/10 s 4.23, rest median 0.93, travel p90 1.73, speed median 6.7, p90 42, "cuts" 4.23 (it reads the fast porthole pull-out, the bubble pop and the impact frames as cuts; only 540 is a real cut).
- v2 RENDER 2 RESULT (final, all 427 frames, make_final + checks + flicker done; log final/run_v2b.log): flicker PASS (only the planned f540 join; corridor/office halo + porthole pops gone);
  motion gate 0 linear / 0 no_settle / 0 creep; frame checks 1 FAIL: g1 body_side 39 % (cut by the LEFT edge on the door picture f415-453; fix: hide g1+g2 until f450 or turn that aim 5 deg further right).
  check_film on preview.mp4 (picture tracker): rests/10 s 4.23 (WARN), rest median 0.93, travel p90 1.92 (WARN), speed median 8.65 (FAIL), p90 43.8 (FAIL), "cuts" 2.82/10 s (FAIL; the only real cut is f540),
  whips 21/min (FAIL). The plan estimate (median 3.4, peak 56) reads far calmer than the picture: the near walls/gurneys of the 2.8 m corridor flight and the porthole pull-out move fast on screen.
  STILL WEAK / NEXT: slow the corridor flight in the PICTURE (fly higher/mid-corridor, farther from the gurney cards, or split it with a rest at the queue, which costs the "one move"); the pull-out from the glass 1.7 s -> ~2.3 s.
  The surgeon's face is small on the f582 wide (rows 16-17); the "?" bubble carries "asks".
## v2 ROUND 2 (2026-11-16, camera only: picture too fast) - build_film.py stations + corridor keys clock_hang/period_right moved
- LAST OFFICE STATION UNCHANGED (pos/aim/lens as above); arrives f760 (was 756), at rest to f789.
- Corridor: pull-out 363->432 (2.3 s, was 1.7) straight back off the glass through 3 via points spaced for an even zoom, door picture rest C(-.75,1.0,1.55)->C(1.4,2.6,1.45) 26 mm
  (33 deg turn; CRT cart crt_y 2.0, calendar cal_y 2.1 so both stay in frame; g1/g2 now about 27 deg left = out of the 26 mm frame), hold .9 s, then ONE 2.65 s flight down the
  MIDDLE of the corridor at 1.55-1.9 m (no aim swing toward the gurneys), lens 26 -> 36, into the hung clock (clock_hang z 2.2 -> 1.9) ending 0.6 m off the face (36 mm = same face size as the office 30 mm at 0.5: the 540 join kept).
- Office: clock pull-back 540->590 (1.65 s, was 1.3), push 605->643 (1.25 s), crash zoom 643->652 UNCHANGED, tower 666->708 (lens 18 -> 21), tray tilt 726->760 (1.15 s, was 1.0).
- Probe method (fast, 4 min): low-res render (scale .25) of 363-789 -> mp4 -> check_film; it matched the full preview within 2 px/f (p90 41.6 vs 43.8 on the old plan).
  Probes: old plan p90 41.6 / >25 px/f on 127 of 426 frames; flight on 40 mm + aim swing 40.4 / 140; mid-corridor flight, no swing 39.4 / 128; geometric-via pull-out + half-face clock join 41.8 / 136.
- WHY THE TARGET IS HARD (measured): the instrument reads a pull-out from 16 cm off the porthole glass to the door picture, and a push from 6.6 m into a clock face, as a log zoom of about
  2.5 units each (= about 1800 px of picture travel). Under 25 px/f that needs about 4.5 s per move, and the corridor take has 176 frames for both. The near door (pull-out start) and the
  office desk/cooler (pull-back at f560-575) add parallax spikes. A longer lens did NOT help the corridor flight (the clock zoom dominates, not the side walls).
- ROUND 2 RESULT (full render, final/run_v2r2.log): frame checks 0 FAIL / 2 WARN (g1/g2 body_in_mesh 5-6 % in the wall bumper rail, reclined waiver) / 39 PASS: the g1 left-edge cut is FIXED.
  Motion gate 0/0/0. Flicker FAIL: f540 (planned join) + f573 (NEW, 1.07: the office pull-back passes the desk/cooler near the lens).
  check_film on preview.mp4: NOT FIXED: speed p90 44.1 (was 43.8), median 11.9 (was 8.65), whips 21/min (same), rests 4.93/10 s (was 4.23), cuts 2.82 (540 + the planned impact frames 650-652), travel p90 2.17 (PASS, was 1.92).
- The previous v2 build is kept as build_film_v2r1.py.bak (its frames were overwritten by this round). Neither version meets p90 <= 25.
- NEXT (needs the lead's call, it changes the picture plan, not only the camera): (1) start S2 0.8-1 m off the porthole (S1->S2 as a short dissolve or S1 ends farther out) instead of 16 cm in the glass;
  (2) the clock join at half-face framing (or a dissolve on the clock) instead of a face-filling push + pull; (3) give the corridor take more time or drop the door-picture rest; (4) office pull-back path that avoids the desk/cooler (f560-575).
## v2 ROUND 3 (2026-11-16, LEAD DECISION: dissolves on the joins) - build_film.py stations, office.js key clock_spin_int, final/run_final.sh handles, final/make_final.py dissolve
- FIRST S2 FRAME (f363; the S1->S2 join is now an 18 f dissolve, EDIT_LIST B=375 len 18 = frames 366-383): lens 24 mm, pos world [60.45, 2.45, 1.55] (corridor local C(.45, 2.45, 1.55)),
  aim world [61.4, 3.05, 1.5] (C(1.4, 3.05, 1.5)) = 1.0 m off the porthole L glass, both portholes + OR 3 doors + corridor ceiling in view. The camera is already easing back (speed 0 at 363,
  about 7 px/f at 375, 20 at 380) into the door picture (f414, 24 mm, C(-.75,1.0,1.55) -> C(1.4,2.9,1.45): doors, portholes, calendar 1994 HOUSTON TX, CRT), rest 414-424.
- Corridor: ONE 3.8 s travel 424 -> 537 down the corridor (via C(-.7,3.2,1.6), left of the gurney queue) to the hung clock at about 1/3-1/2 face width (30 mm, 1.8 m, pos C(-.3,5.4,1.62),
  aim C(-.25,7.2,1.69)), the window + queue_out under it, hands spinning (clock_spin 5): rest 537 -> on (portholes rest + window/clock rest = the two corridor rests).
  g1 + g2 hidden (their faces swept huge past the right edge in the flight, probe frame 500); the queue gurneys stay.
- CLOCK JOIN = 12 f DISSOLVE 534-545, BAKED in final/frames by final/make_final.py (lead: no blend needed at 540; EDIT_LIST "540" note should now read "12 f clock dissolve 534-545 baked").
  Handles: S2_VARIANT=out python build_film.py -> film_out.json (corridor take on to 545) -> final/handles/out_00540-545.png; S2_VARIANT=in -> film_in.json (office take from 534)
  -> final/handles/in_00534-539.png. Unblended main frames 534-545 are kept in final/_unblended (delete it with the frames before a re-render).
  Office clock framed the same (30 mm, 1.8 m, O(1.05,.76,2.24) -> O(1.05,2.56,2.24)); office.js NEW key clock_spin_int (spin keys integrated, hands slow down and land on 9:40): clock_spin [[533,5],[547,5],[575,0]].
- Office: pull-back 541 -> 616 (2.5 s) via O(.5,-.12,1.87), high (z 1.9-2.2) and right of the desk, to O(-.1,-1.0,1.5) 20 mm; flows (hold 0) into the push 616 -> 643 (24 mm), hold 0 into the
  crash zoom 643 -> 652 (UNCHANGED, impact 650/651). Tower + trays are ONE 3.3 s move 666 -> 764 (via O(-.3,-.3,1.3), aim_via O(.3,1.25,1.85)): the tower rest is gone.
- LAST OFFICE STATION UNCHANGED (26 mm, world [120.1,-0.8,1.4] -> [120.0,0.95,0.95]); arrives f764 (was 760), at rest 764-789.
- Probe log (0.25 scale, check_film on a blended mp4; scratch only): p1 p90 35.3 rests 4.23 whips 16.9 | p2 (g1 hidden, lens/via) 36.7 / 4.23 / 12.7 | p3 (wide flows, tower+trays one move) 34.3 / 3.52 / 0 |
  p4 (clock framing 1.8 m, g2 hidden) 29.2 / 3.52 / 0, travel p90 2.92 | p5 (final plan) p90 28.3, rests 3.52, rest median 0.77 s, travel p90 2.95, whips 0, peak 34.
  WHY p90 STAYS ~28: the tracker reads scale change as speed; the corridor travel is a log-zoom of about 1.4 units (clock 8 % -> 35 % of the width) and costs 38 frames over 25 even at 3.8 s;
  the pull-back (clock -> wide) 22 frames. Under 25 needs either a smaller clock at the join or about 5 s of corridor travel (no room: Houston f424 must be on the door picture).
- v2r3 RESULT (full render, `bash final/run_final.sh`, 7.3 min, log final/run_v2r3.log): 427 frames + 12 handles, dissolve 534-545 baked; frame checks 0 FAIL / 0 WARN / 19 PASS;
  motion gate unchanged; FLICKER PASS (worst f533 0.79, inside the planned dissolve; f540 and f573 gone). check_film on final/preview.mp4 (final/film_check/): rests 3.52/10 s PASS,
  rest median 0.73 s, travel p90 2.90 s PASS, whips 0/min PASS, speed p90 28.7 (WARN, was 44.1), median 11.3 (FAIL), "cuts" 2.11 = only the planned impact frames 649-651 (no real cut left in S2).
  Sheet out/v2r3_sheet.jpg. Open: p90 28.7 > 25 (reason above); "sore knees" now shows the empty gurney queue (no patient faces); f690-705 the surgeon's head is large at the lower left in the tower move.
## v3 FIX ROUND (2026-11-17, FIX_BRIEF_v3.md) - started
- LAST OFFICE STATION (S3 starts from it): UNCHANGED = lens 26, pos world [120.1, -0.8, 1.4], aim world [120.0, 0.95, 0.95], place NI office (dress 'night', ni_v2, trays), at rest from about f764 to f789.
- v3 build_film.py (backup build_film_v2r3.py.bak): corridor 4 stations: join 363 -> door picture 405 (rest to 420) -> portholes push 454 (32 mm, rest to 466; C4) -> ONE eased pan 466->508 from above head height onto the gurney queue with three different wincing patients g1 (gurney_0), g2 (gurney_2), g3 (curl gurney_4) + hung clock + window, creep to the 534-545 dissolve (C3).
  Office: clock 540 -> WIDE 582 (24 mm, O(-1.4,-2.2,1.6) -> O(.9,1.0,1.4), rest to 602): surgeon WHOLE behind the desk + "?" bubble (562-612) + "?" note on locker 2 (C2, B4) -> push 643 -> crash zoom 652 UNCHANGED (impact 650/651) -> tower REST 690-712 (20 mm, surgeon whole beside the tower, B5) -> trays 764 (last station unchanged).
- New keys: corridor.js ph_scale / ph_tool / ph_dy (porthole figure + tool size, S2: .82 / 1.4 / -42); office.js lamp_nohalo (D1: no additive halo sprite on the lamp bulb = the tray glare). env_v3 on in co + of; office dust 30 (was 220 sparkling over the trays).
- film_plan check (final/plan_check_v3.txt): camera peak 38.5 px/f, rests 3.8/10 s, 0 word stations off rest; speed median + dead still FAIL = the known artefact of the unseen frames 0-362 counted as one dead rest (as v2).
- v3 RESULT (final/run_v3.log + run_v3b.log [g1 hidden until the pan 466, frames 405-465] + run_v3c.log [bubble "?" purple, key ask_bubble.qcolor, frames 562-612]): 427 frames + clock dissolve 534-545 baked; frame checks 0 FAIL / 2 WARN (g2/g3 body_in_mesh 4-5 %, reclined-on-gurney waiver) / 57 PASS; flicker only f650 (planned impact); motion gate 0 linear / 0 no_settle / 0 creep.
  Numbers: red gate 0 px in every row (the bubble "?" was 2456 red px before qcolor); NI row means .346 / .308 / .395 / .335 / .330 (row 17 NASTY QUESTION .308 and f~780 min .297 stay just under .31: needs NI ai lift or the grade).
  check_film on preview.mp4: rests 4.93/10 s (FAIL), rest median .67, travel p90 1.3 s (FAIL), speed median 6.4, p90 34.5 (FAIL, v2r3 28.7), cuts 2.11 (= planned impact frames 649-652 only). The new porthole push + the queue pan + the tower rest made the camera busier than v2r3.
  NEXT: merge the porthole push into the door rest (one creep), lengthen the queue pan, NI fill +10 %; the office wide shows about 30 % ceiling (aim lower).
## v3 ROUND 2 (2026-11-17, camera only + NI fill) - build_film.py (backup build_film_v3.py.bak), logs final/run_v3r2.log + run_v3r2b.log (office 540-789 + in-handles re-rendered)
- Stations: corridor join 363 -> door picture 418 (rest to 424) -> ONE 98 f travel to the queue 522 (via C(-.9,1.45,1.75) + aim_via C(1.3,3.6,1.45): the aim holds on the portholes for "scrape and rinse" while the camera rises, then pans onto the queue; hold-0 CHAIN stations stalled to 0 px/f in the picture, so via/aim_via are used instead) -> queue creep into the dissolve 534-545.
  Office: clock opened wider (26 mm, O(.85,-.6,2.05) -> O(1.0,2.56,2.15), hold 0) -> 57 f pull-back to the wide 597 (rest to 607, bubble) -> push 643 -> crash zoom 652 UNCHANGED (hold .3, was .45) -> ONE 103 f travel through the tower framing (via O(.1,-.95,1.47) + aim_via O(.3,1.3,1.72), no back-and-forth) into the trays 764 (last station unchanged).
- NI light_over ai 3.0 -> 3.6, fill_i .9 -> 1.15 (lamp glare untouched): row 17 only .309 -> .310 (min .307), row 20 .346 (min .338): the keys move the mean very little; more needs the grade.
- RESULT check_film on preview.mp4: rests 3.52/10 s PASS, travel p90 2.15 PASS, speed p90 23.1 PASS (was 34.5), median 6.2 WARN, whips 0, cuts 2.11 (= planned impact 649-652 only).
  Frame checks 0 FAIL / 2 WARN (g2 25 % in the handrail at f473 mid-pan, g3 5 %: reclined waiver); flicker PASS (only planned f650); motion gate 0/0/0.
- Probe log (0.25 scale, no dissolve): p1 chain stations: p90 27.0, stalls at the chain points | p2 no reversals: 24.4, still stalls | p3 via/aim_via: 23.3, travel p90 1.84 | p4 longer corridor + office pull: 22.5, 2.07.
- OPEN: office opening frame 540-550 shows the surgeon cut at the left edge (inside the dissolve/move start); g2 crosses the handrail mid-pan f473.
## v4 FIX ROUND (2026-11-17, FIX_BRIEF_v4: CB "patient in hall way also have half of the head") - build_film.py (backup build_film_v3r2.py.bak), corridor.js NEW keys rail_queue_off + plant_at
- Cause (by eye, f466-482 + strict --all-frames check): the v3r2 travel swung right to the portholes then panned left, so g1/g2/g3 came in through the LEFT edge mid-pan (g1 head 9 % f472, g2 head 3-14 % f477 = the half heads), g2 25 % in the right-wall handrail f473, g3 5 % in the drape.
- Fix: door picture 1.8 m further back, C(-.9,-.8,1.6) -> C(1.2,4.2,1.4), 24 mm (OR 3 doors, both portholes, 1994 HOUSTON calendar, CRT AND the whole queue with g1-g3 from f418; g1 no longer hidden);
  the opening pull-back turns left early (via C(-.6,.6,1.6), aim_via C(.8,6.5,1.4)) so the patients enter inside the S1->S2 dissolve (366-383); the queue travel (same frames 424-522, same end station)
  no longer swings right (via C(-1,.5,1.85), aim_via C(1,4.8,1.4)): portholes stay in frame to ~f480 on "scrape and rinse", every patient stays whole. Props: right-wall handrail + right_wall_b bumper rail
  behind the queue removed (rail_queue_off), dracaena moved behind the door picture (plant_at [-1,-2.2]; its leaves covered g1/g2 faces from the new spot). g1 +3 cm, g2/g3 +4 cm (drape/feet).
- Frame checks (brief command): before 0 FAIL / 2 WARN (g2 25 % handrail, g3 5 % drape) -> after 0 FAIL / 0 WARN / 41 PASS. Strict --all-frames 363-539: before 6 FAIL (edge cuts f466-481 + handrail);
  after only the entry under the dissolve: heads cut 2 frames each (f378-379), bodies 3-4 frames (f375-379), fastest part of the pull-back, S2 image 50-75 % in the dissolve.
- Re-rendered 363-545 + out handles (final/run_v4.log).
- By eye on the new frames: f392-500 every patient whole, nothing across a head (sheet: board-free check). LEFT: f376-380 g1 enters at the left edge in the fast pull-back (head cut f378-380, whole from f382), under the S1->S2 dissolve (S2 at 55-80 %).
  Lead's call: hide g1-g3 until f382 (a pop under the dissolve) or start the dissolve's S2 later. run_v4 COMPLETE: 427 frames, make_final done, final checks 0 FAIL / 0 WARN / 41 PASS; flicker: see final/flicker.txt.

## v4b STRICT EVERY-FRAME ROUND (2026-11-17, FIX_BRIEF_v4 "v4b") - build_film.py only (backup build_film_v4.py.bak), no set keys changed
- Strict check `--all-frames --frames 363-789 --no-body` before: 3 FAIL / 4 WARN (surgeonOff head 27 % / body 51 % cut by the left edge f540-563 in the clock pull-back; g1-g3 entering through the left edge f375-380 under the S1->S2 dissolve, S2 at 55-80 %).
- Fix by camera only: S2 opening station 363 aim C(1.4,3.05,1.5) -> C(.9,4.9,1.5) (P0_AIM): the pull-back starts already looking down the corridor, g1-g3 WHOLE in frame from 363 (no entry);
  office clock station (OF0) pos O(.85,-.6,2.05) -> O(-.4,-.6,2.0) (CLK_POS), same aim/lens: the surgeon WHOLE in frame from 540 (also in the 'in' handles 534-539). Crash zoom 650-652 + last station 764-789 unchanged.
- Strict after: 0 FAIL / 0 WARN / 18 PASS (also S2_VARIANT=in 534-560 and out 534-546 clean). Re-render: frames 363-420 + 534-597 + in handles, log final/run_v4b.log.
- v4b RESULT (bash final/run_final.sh, 8.9 min, final/run_v4b.log): 427 frames, make_final done; rest check 0 FAIL / 0 WARN / 56 PASS; strict 363-789 on the final plan 0 FAIL / 0 WARN / 18 PASS (board/checks_strict_v4b.txt); flicker PASS (only f650 crash zoom; one-frame WARN flips 376-389 in the new pull-back under the dissolve). By eye f372/378/386/540/548/556: g1 and the surgeon whole.

## v5 FIX ROUND (2026-11-17, CB at 0:13 "patient outside. on bed the head still half ... laying position is way off and too big") - build_film.py (backup build_film_v4b.py.bak), corridor.js NEW keys queue_side, gurney_back, drape_dx, linen_cart_off (backup sets/corridor_before_s2v5.js.bak)
- Cause: the queue gurneys stood END-ON to the lens (yaw 90, along the right wall) while the reclined card is a billboard, so g1-g3 lay ACROSS their gurneys in the picture: a huge tilted card floating over a narrow gurney end, heads cut by the wall unit.
- Fix: g1-g3 gurneys SIDE-ON (queue_side per slot [x, y, yawDeg]: g1 slot0 [.4,4.6,-15], g2 slot2 [-.3,7.0,-15], g3 slot4 [.7,11.3,-15]; empty slots 1 [1.0,8.4,90] + 3 [5.0,9.9,0] moved out of the head lanes),
  each with a raised 35 deg head section + pillow (gurney_back {slot: hinge x -.15}, flat pillow hidden, drape_dx .1). Cards: pose gw_s2 (= S1 pt_s1 recline), cast default size, ground line on the mattress top z .87,
  card origin at gurney-local x GB_H + CARD_DX (-.15 - .17) so the back-bottom sits on the hinge; hips/legs under the drape + knee hump. Face k:wince (unchanged).
- Heads in three lanes so none covers another: camera raised so farther heads sit higher: S2 opening P0 pos C(.3,1.4,1.8) aim C(.4,4.9,1.4); door picture 22 mm, pos C(-.9,-.8,1.95) aim C(.8,4.2,1.3) (OR doors, portholes, 1994 HOUSTON calendar, CRT kept);
  queue travel aim_via C(.4,4.8,1.4) (g2 was cut by the left edge f466). Hung clock moved to C(1.0,6.2,2.2) (it sat over g1's head); linen cart removed (its top shelf crossed g2's head).
- Strict check `--all-frames --frames 363-545 --no-body` on the plan: before (first layout) g2 head_cut 76 % f466 -> after 0 FAIL / 0 WARN.
- Known: in the door picture (418-424) g3 (farthest, by the window) is small and partly behind g1's head top; whole from the travel on (f450+).
- v5 RESULT (`bash final/run_final.sh`, log final/run_v5.log; frames 363-545 + out handles re-rendered, _unblended rebuilt): 427 frames, make_final done; flicker PASS (only the planned f650);
  strict plan check 363-545 0 FAIL. Rest check 9 FAIL / 0 WARN / 47 PASS: ALL 9 are g1-g3 body_in_mesh 9-16 % "inside gurney_backrest_pad" = the card's back lying on its own raised head section
  (the same reclined-on-support case as the OR patient; earlier rounds waived it as WARN). Lead's call: waive, or thin/push the pad 4-5 cm behind the card plane (needs a camera-facing offset).
- By eye out/v5_look.jpg (f390/420/450/480/510): g1 + g2 lie on side-on gurneys, back on the raised section, legs under the drape + knee hump, real size, heads whole, wincing.
  g3 (farthest, by the window) is HIDDEN behind g1/g2 heads in f390-480 (fully covered, not cut) and shows whole only from about f505 in the queue rest. Not solved within the hour.

## v6 FIX ROUND (2026-11-17, CB "on bed the head still half ... laying position way off and too big" + "we made some test before people ly on bed ... why dont take from it") - build_film.py (backup build_film_v5.py.bak), corridor.js NEW keys queue_lie, hang_sign_off (backup sets/corridor_before_s2v6.js.bak)
- Taken from the bed test (templates/threejs_film/_pose_review/bed_poses_v5.png, "on the back": "3/4 high · side"): g1-g3 LIE ON THEIR BACKS on FLAT gurneys through the film.js lying path (pose lie_back -> lieOf 'back', lie_cam.mjs side/top drawing by camera), cast default size, face k:wince. v5 reclined card + gurney_back + CARD_DX/drape_dx are OFF.
- corridor.js queue_lie [0,2,4]: those gurneys drop the drape and the side rails (the near rail crossed g2's face), pillow kept. hang_sign_off: the 'SURGERY OR 1-4' ceiling sign at y 1.4 hid g2's face from the raised door picture (the wall flag SURGERY stays).
- Layout: gurneys side-on in a row HEAD-TO-TOE (QSIDE g1 [.15,5.0,0], g2 [0,6.45,180], g3 [.55,8.1,0]; empty slots 1/3 end-on by the walls at y 9.7-9.9), GDIR [1,-1,1] (head left / right / left) so no head sits behind another. Body centre BODY_DX .06 toward the feet (head on the pillow), on the mattress top z .87.
- Camera: door picture DOOR_POS C(-.9,-.8,2.6) aim C(.6,4.2,.95) 22 mm (OR doors, portholes, 1994 HOUSTON calendar, CRT kept); travel via C(-.6,.9,2.5) aim_via C(.4,4.8,1.0); queue end (522) C(0,2.6,2.6) aim C(.1,6.4,.8) 20 mm = high 3/4 down the row, hung clock + window in frame at "all day long".
- KNOWN TOOL GAP: tools/film_plan.py bake keeps only view/dir/pose/prop/hand/visible/look/... so act keys lie_yaw / lie_lift never reach film.js. The bodies lie ACROSS the shot (yaw from the camera, head side = dir) and use film.js' default lift (half the head). The side-on gurneys match within ~15 deg. To use lie_yaw/lie_lift add them to the body whitelist in film_plan.py bake_performance (shared tool, not changed here).
- Strict check `--all-frames --frames 363-789 --no-body`: before (first v6 layout) g2 face_covered by hanging_sign_face f466 (FAIL), then by its own side rail (WARN) -> after 0 FAIL / 0 WARN / 15 PASS (board/checks_strict_v6.txt). No body_in_mesh on the lying bodies.
- Re-render: deleted final/frames 363-545, _unblended 534-545, handles out_540-545; `bash final/run_final.sh` log final/run_v6.log.
- v6 RESULT (run_v6.log): 183 frames re-rendered (363-545), 427 frames, make_final done (ALL sat .533, mean .401); rest check 0 FAIL / 1 WARN (g3 body_in_mesh 3 % in right_wall_b_dado, 2/80 frames) / 46 PASS. Flicker PASS (only the planned f650; one-frame WARN flips 634-715 are office, none in the corridor).
- By eye out/v6_look.jpg (f390/420/450/480/510): every patient lies on his back on his gurney like the test's '3/4 high · side', heads on the pillows, whole, wincing, head-to-toe; door picture keeps OR doors + portholes + 1994 calendar + CRT; clock + window in the queue rest. f390: only g1 in view (g2/g3 behind the wall line).
- Open: the lying patients are a static kit pose (lie_back) with no wince pulse on "sore" (the gw_s2 move had one); a lying motion move would need the film.js lie path to accept an m: move.

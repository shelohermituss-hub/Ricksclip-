# S4 STATE: BUILD-OUT (2026-11-16). Board rounds 1-3 history: out/STATE_board_rounds.md
Film 1290-1683 (rows 31-39), rendered 1278-1695 (12 handles each side), 418 frames 1080x1920 WITH captions in final/frames/f_<film>.png.

## The ONE command (from s4/)
`bash final/render_final.sh && python final/make_final.py` (resumable: skips frames on disk; delete frames to re-render them; it bakes film_in/film_out/film in turn: they share out/plan)
then `timeout 420 node ../../../tools/frame_checks/check.mjs film.json --skip 'sky|dome|cone|beam|haze|fog|dust|glow|halo|smoke|spark|cloud|backdrop|mote|shaft|s4_' > board/checks.txt` and `python ../../../tools/frame_checks/flicker.py final/frames`.
Variants: `S4_VARIANT=in|out python build_film.py` writes film_in.json (off take from 1482) / film_out.json (st take on to 1497) for the dissolve handles (final/handles/in_*, out_*).
make_final.py blends 1482-1497 (originals kept in final/_unblended) and writes numbers.txt, strip_2fps.jpg, line_check.jpg, preview.mp4 (720 wide + voice).

## Cuts, joins, hit frames (for sound + join)
- HARD CUT 2 at f1290 ("Two"): first frame of S4 (1278-1289 = stairwell handle, no blend needed).
- r35 -> r36 MATCH DISSOLVE 1482-1497 (16 f, smoothstep): stairwell camera flies onto the pain dial (station 1489), needle sweeps .09 -> .6 -> .55 (1480-1497) = the bars' level; dissolves into the light-box chart close (office station 1490), which flies back to the r36 M by 1506.
- r36 bar pops f1508, 1516, 1525. r37: ruler lands 1544-1559, IMPACT FRAME f1560-1561 (in the render, two-tone gold/violet + black stripe bands), kick/shake from 1560, light band 1561-1572.
- r38 POV: glint 1578-1592, rims 1590-1617 (in through the glint ~1589, out 1618).
- r39: lid shut f1643 (half 1640), DUST PUFF 1643-1669 (new sprite cloud).
- S5 JOIN: camera pushes onto the shut lid 1675-1690, dark veil 1676 -> 1691 full black; 1691-1695 black (S5 opens from dark).

## Build-out fixes (LEAD_QUEUE S4)
1. r37 fist: s4_office.js key s4o.arm3d (soft_arm, width .024, round black fist r .052) from the surgeon's shoulder B(.64,1.95,1.22) ON the ruler tip (follows hover + land), 1534-1695, hidden in the POV 1589-1617; sg_ruler tucks the card's near arm behind from move f44 (motion gate still 0/0/0/0). hand_at removed.
2. r39 dust: s4o.dust = 26 soft grey-brown sprites (#958675) from the seam (front + sides), drift out/up, grow, fade (hero_props balls off); scope visible until the lid shuts.
3. r35 -> r36 match dissolve (above). 4. End on the dark lid (above, s4o.dark).
Backups: out/build_film_before_buildout.py, out/ep_s4_before_buildout.mjs, out/s4_office_before_buildout.js.

## Numbers (final/numbers.txt; ungraded, captions on)
- sat: r31 .57, r32 .51, r33-35 .42-.43 (min .348), r36 .48 (min .304, the white chart close in the dissolve), r37 .72, r38 .59, r39 .63. mean min .33 (r31) / .26 (r38 POV dip) else >= .36.
- red px: rows 36-38 bars as planned (max 18.8k px); rows 33-35 <= 1040 px (the dial's red zone, 0.05 % of the frame); r31, r32, r39 = 0.
- Frame checks: 2 FAIL / 4 WARN / 66 PASS. FAIL = surgeonOff body_in_mesh back_wall_veneer f1546-1626: his card sits just OFF the right frame edge in r37 (crop shows only the 3D arm entering); not visible, waiver asked (or hide him 1540-1588 + re-render 49 f).
  WARN: climber3 slides 1.5/2.4 cm/f, patient f1353 2.8 cm/f (pre-existing).
- Flicker: FAIL on 12 frames: planned 1559-1562 (impact), 1589 (into the lens), 1627 (r38 -> r39 pull-out); NOT planned: 1322 (knee leg pops in), 1389, 1421-22, 1505, 1523 (open, not diagnosed).

## Weak / open
- r37 arm is long (~.9 m) entering from the right edge; the surgeon himself is off frame in r37 (fist on the ruler reads; owner of the arm only by implication).
- Unplanned flicker pops above; r32 knee leg still reads as a tube; r35 climbers bunch.
- r38 POV mean .26 min.

## ROUND 2 (2026-11-16, S4 build-out r2)
- WAIVER (lead): frame check surgeonOff body_in_mesh back_wall_veneer f1528-1626 (his card sits off the right frame edge in r37, not visible): WAIVED, do not chase.
- Planned flicker pops stay: 1290 (hard cut), 1559-1562 (impact), 1589 (into the lens), 1627 (r38 -> r39).
- 1322 knee leg: cause = knee_leg visible from 1319 while the camera flew THROUGH the thigh (1321 = khaki block). Fix: stairwell.js key knee_leg.slide {f0,f1,d}; build_film.py knee_leg f=[1322,1347], slide f1322-1331 d=[-.55,0,0] (he strides in from the side).
- Red: stairwell.js key dial_red_at [[f,u]] mutes the dial's red zone to sand (#ddd0a4) outside row 34; build_film.py dial_red_at 0 until 1384, full 1392-1428, 0 from 1436 (rows 33 + 35 + the dissolve handles carry no red zone).
- r38 POV: s4_office.js key s4o.pov_fill {at, i, f} neutral PointLight inside the glasses view, build_film.py pov_fill i=5 f 1590-1618, eased 3 f.
- 1389 / 1421-22 / 1505 / 1523: NOT a prop or leg; measured as whole-frame luminance steps with a static camera (1523: -20 grey levels everywhere, 1505: +24, both persist, 1421 one-frame dip). No light/prop key in sets or film.js changes on those frames; cause not found by reading (the shared GPU queue was full, no bisect render possible). Frames were re-rendered (see numbers below).
- R2 RESULT (final/numbers.txt, flicker 1278-1695, check.mjs): knee leg 1322 FIXED (leg now enters 1322-1331 and exits 1341-1348 before the 1349 cut; 1347/1319-21 clean). Red: row 33 = 0 px, row 35 = 32 px (was 1040), row 34 736 (allowed). r38 mean min .319 (was .279; pov_fill {at B(.3,.7,1.7), i 9, f 1586-1618}). Frame checks 2 FAIL (the waived surgeonOff veneer) / 4 WARN / 66 PASS.
- STILL OPEN, identical after re-render (so deterministic scene content, not render noise): flicker FAIL 1389, 1421-22, 1505, 1523 (whole-frame luminance steps, static camera, not a prop). Also flagged but PLANNED: 1560-62, 1619 (rims out at 1618), 1627. Next step for the owner: bisect by rendering 1522/1523 with lights/fx keys toggled (office: s4o.stripes spot, case_fill, hf fill; stairwell: LP.sync lamps) - nobody has done this yet.

## ROUND 3 (2026-11-16, S4 build-out r3): NOT FIXED, bisect started, time cap hit (shared GPU queue ~8 deep, one 4-frame job = 10+ min wait)
- The four pops are NOT a light/effect key switching on a frame. Whole-frame mean luma (final/frames, 108x192): 1499-1502 dissolve tail 161 -> 109.5; 1503 112, 1504 115 (A) -> 1505 129.7 (B, +15) holds 129.8 -> 128.6 to 1522 -> 1523 112.4 (A, -16) holds 112.2. 1382-1393: 148.9 -> 132 (1387) -> 135 (1389); 1420 134 -> 128.9 (1421) -> 143.2 (1422). Steps are uniform over all 18 grid cells (not a patch).
- Isolated single-frame renders of the CURRENT film.json reproduce it exactly (1504 116.1, 1505 131.0, 1522 129.5, 1523 113.4): deterministic, depends on the camera pose, NOT on render batch / earlier frames. Baked camera is smooth (1504 x120.393 y.2375; 1505 x120.441 y.121; 1522 x120.556; 1523 x120.563: B holds only for x 120.40-120.56).
- Ruled out: s4o.stripes (render without it: 115.5/130.1/129.0/112.7, same steps). No key in build_film.py/s4_office.js/office.js update changes on 1505/1523 (pops 1508/1516/1525, hover, band, fill are constant or later). film.js has no auto exposure.
- Not yet tested (bisect jobs film_t_nofill / film_t_nocase were queued, results in %TEMP%\bis_*): hemisphere fill, case_fill. Next suspects (camera-dependent, in office.js/film.js): sun/gobo shadow frustum or shadow-map culling (sun shadow box +-3.5 at 4096 centred on the set, far 20), frustum culling of a large mesh by a stale bounding sphere, lpSky / env PMREM (LP.sync), kit hemisphere kSun scaling. Test: render 1504/1505 with sun.castShadow=false, gobo.castShadow=false, shadow camera enlarged, frustumCulled=false on the big walls/floor. Same method for stairwell 1387-1389 and 1421-1422 (also whole-frame, camera in flight there).
- Fallback if no cause: grade-level easing is NOT possible (the steps are the renderer's state, not a key); instead re-render with the cause removed.
- Frames on disk unchanged; film.json re-baked (identical). No re-render, no make_final, flicker numbers as in round 2.

## v2 FIX (2026-11-16, FIX_BRIEF_v2 S4). Backups: out/build_film_before_v2.py, out/stairwell_before_v2.js, out/s4_office_before_v2.js; v1 numbers out/v1_numbers/
- CAMERA re-planned as two flowing takes (17 -> 8 stations). st: cane close (HARD CUT 1290 kept) -> eased 1.4 s drop to the knee close -> 2.35 s FOLLOW up the flight (via point) -> rest in front of him + the dial -> ONE eased 1.6 s pull back up-and-back over the climbers to the wide (no more fly onto the dial). off: chart close (dissolve) -> 1.85 s pull back while the bars pop -> rest on HIM + light box + ruler (land, IMPACT 1560) -> 1.65 s truck left following his look -> rest on the case to 1695.
- Measured on the window 1290-1683 (board/cam_window.py, plan): v1 -> v2: rests/10 s 7.6 -> 5.3 (plan reads ~1 high), rest median .83 -> .90 s, travels .2-.6 s -> 1.2-1.6 s measured (stations 1.4-2.35 s), speed peak 1014 -> 37.5 px/f, p90 40 -> 10, median 1.7 -> 1.9, dead still 23 -> 11 %. Whole-file film_plan check (board/plan_camera_v2.txt): speed median/p90 FAIL only because frames 0-1277 are the parked lead-in (v1 had the same); peak, cuts, tilt, roll, lens, swing PASS.
- r32 NO 3D LEG: knee_leg gone; the patient's own card (stance pt_bound@=0) at the foot from 1300, framed close from the knee down; stairwell.js knee_plasters = three cartoon plasters (cream, black line) stacked on his line knee, turned to the lens, drawn on top 1318-1352.
- r35 climbers visible from 1405 (cl_step@=0, one/two treads lower, off frame) so they never pop in; they step into the pull back. The r35->36 match dissolve is now a PLAIN dissolve wide stairwell -> chart close (still 1482-1497 from the handles).
- r37 NO 3D ARM: s4o.arm3d removed; the surgeon (SGP B(.62,2.12,0)) holds the ruler end with HIS round fist (hand_at per frame on the ruler end; ruler in his fist .18 m over the bars from r36, lowered 1544-1560).
- r38 POV glasses (glint, rims, pov_fill, the surgeon hide) REMOVED: calmer; the camera follows his look to the case instead.
- r39: case light steel grey (s4o.case_col), denser grey dust puff (dust.op), warm fill 1.3, case_fill 3; NO dark veil (s4o.dark removed): the S5 join is bright (S5 dissolves in from the case close).
- Camera-pose luma steps (1389, 1421-22, 1505, 1523): the camera no longer sits at those poses (new paths); re-check in board/flicker_v2.txt.
- v2 RESULT (render 1278-1695 done, make_final run): flicker FAIL 8 = 1455-56 (pull back passing climber1), 1490 (dissolve end), 1536, 1559-65 (impact, planned); the old luma steps 1389/1421-22/1505/1523 are GONE with the new camera. check_film preview: rests/10 s 6.47 FAIL, travel p90 1.77 WARN, speed median 6.5, p90 37 FAIL, cuts/10 s 2.16 (hard cut 1290 + dissolve + impact frames read as cuts). Frame checks 4 FAIL / 5 WARN: climbers 1-3 slide 3-4.7 cm/f in the r35 steps (card moved linearly per tread, pre-existing), patient body cut by the left edge 1418-1440 (dial rest framed too tight on the left). Numbers: mean luminance rows 37-39 .45-.52 (bright), case light grey, no dark end.
- OPEN for the next round: widen/re-aim the 1418 dial rest; make the 1489 pull back slower (it drives the speed p90 + 1455 pop); climber step slide; check_film rests still high (cane + knee + dial + 2 office rests + dissolve ends).

## v2 ROUND 2 (2026-11-16, camera only + two frame-check items). Backups: out/build_film_before_v2r2.py, out/ep_s4_before_v2r2.mjs
- CAMERA now `camera: {v2: true}` (picture-speed ease: ramp in, gentle cruise, ramp out; no fast smootherstep middle). 7 stations (st 4, off 3) instead of 8, every path SHORTER:
  st: cane (moves off at 1291, the handle is the rest) -> 1.73 s to a nearer knee close (camera stands right of the knee: 19 deg pan instead of 47) -> rest 1342-1348 -> 2.35 s rise FOLLOWING him (via) -> WIDE dial rest 1418-1440 (lens 20, aim moved left: patient whole) -> ONE slow 2.8 s pull back that is still moving through the dissolve (station 1525 sits after the take end, so no rest at 1489).
  off: chart (moves at once from 1490, creep 0; the in-handle holds 8 f then the same travel) -> 1.93 s pull back -> ruler rest 1548-1572 (IMPACT 1560) -> 2.45 s truck with his look -> case rest 1645-1695. Rests creep 0.0015 (about 0.7 px/f measured; the v2 default drift measured 2-3 px/f = read as travel).
  Variants: 'out' keeps the off take at 1498, 'in' starts it at 1482 with hold .27; st camera identical except ~1.5 cm drift in the out handle (blended).
- Plan (board/cam_window.py, window 1290-1683): rests 3.05/10 s (1341+12, 1415+33, 1546+32, 1641+43), rest median 1.10 s, travels 1.4-2.1 s (plan ramps cut them short), peak 15.2, p90 12.5; film_plan check camera: 0 FAIL in the camera gates except the whole-file speed median (frames 0-1277 parked lead-in, as before); v2 notes 0; word stations at rest 0 FAIL (board/plan_camera_v2r2.txt).
- Low-res test render measured BEFORE the final (board/v2r2test.mp4, rests still on v2 drift): speed p90 22.9 PASS, travel p90 2.19 PASS, rests 2.16 (drift too fast) -> creep fix above.
- Climbers (row 35): new move m:cl_march (moves/ep_s4.mjs, motion gate 0 FAIL): same STEP rhythm, each foot lifts and plants back on its own spot, the card NEVER moves. Staged already on the flight at treads 1/1/0 (lanes 1.45/.85/1.2), behind the dial camera's plane, revealed by the pull back. Only the patient still climbs on (WARN slide 1.5-2.5 cm/f, pre-existing).
- Frame checks (plan, before render): 0 FAIL / 3 WARN (patient slide WARNs) / 32 PASS: the 1418 patient left-edge cut and the climber slides are gone.
- v2r2 RESULT (render 1278-1695 + handles redone, make_final run; ONE command unchanged):
  check_film final/preview.mp4 (board/check_film_v2r2.txt): rests/10 s 6.47 -> 3.6 PASS, speed p90 37.3 -> 22.9 PASS, travel p90 1.77 -> 2.89 PASS, rest median .97, at rest 31.6 %, dead still 1 %, whips 0, roll .32. Still FAIL speed median 10.5 (target about 4: more frames are now in slow long travels, fewer in rests) and WARN cuts 1.44/10 s (hard cut 1290 + the impact frames 1559-1561 read as cuts).
  Frame checks 0 FAIL / 3 WARN (patient slide 1.5-2.5 cm/f) / 32 PASS. Flicker (board/flicker_v2r2.txt): FAIL 1559-1562 (impact, planned), 1540 and 1574 (not diagnosed: 1574 = light band end 1572?, 1540 = ruler lowering?); the old 1455/1490/1536 pops are gone. Motion gate 0 FAIL.
- WEAK / OPEN: the row 35 twist reads poorly: by the dissolve (1485) the pull back shows only one climber's head at the bottom right; the three climbers in step are not seen together (they sit at treads 0-1 behind the dial camera). Next: give the pull back a lower aim / earlier arrival or a 2nd climber lane nearer the centre, re-render 1441-1497 only. The surgeon sits half off the right edge in the ruler rest (1530-1590, as v2; checks pass).

## v2 ROUND 3 (2026-11-16): two aims only (backup out/build_film_before_v2r3.py), re-rendered 1441-1497 + 1525-1595 (+handles), make_final run
- Row 35 pull back: st 1525 -> st(1502, A(.5,-3.3,2.1), A(1.2,.6,1.1), 20): camera further back and lower; at f1480 the three climbers (blue stripes, teal, purple) are in frame together, whole bodies, feet on treads, patient above.
- Ruler rest: st(1548, B(.2,-.25,1.5), B(.2,2.45,1.3), 19): surgeon whole in frame, fist on ruler, three bars in frame (1550, 1580).
- Checks (board/*_v2r3.txt): frame checks 0 FAIL / 3 WARN (patient slide) / 27 PASS; check_film speed p90 24.5 PASS, whips 0 PASS; REGRESSION vs r2: rest median .97 -> .38 FAIL, speed median 10.5 -> 14.6 FAIL, rests/10 s 4.32 WARN, at rest 27.6 %; flicker FAIL 1533 (new, undiagnosed) 1596 + planned 1559-62.

## v3 FIX (2026-11-17, FIX_BRIEF_v3 S4). Backups: out/build_film_before_v3.py, out/stairwell_before_v3.js, out/s4_office_before_v3.js, out/make_final_before_v3.py. ONE command unchanged (delete final/frames, handles, _raw, _unblended first).
- env_v3 ON for both places (stairwell E2, office E1). stairwell.js: poster heart recoloured purple #8a5ac8 (red gate).
- B7/C7 row 32: NO waist-down crop: station 1338 low camera A(1.05,-2.55,.5) lens 24 frames the patient WHOLE at the foot of the stair; knee_plasters s .095 (were .036): three big cartoon plasters on his line knee; the strides 1353-1380 seen whole.
- B8 row 35: dial rest holds to 1434 (the camera no longer flies over the climbers on "surgery"), short pull back lands EARLY at 1468 on the wide (him on top, three climbers whole in step), creep to 1489.
- D2: dissolve stair -> chart now 8 f (1486-1493, make_final D0/D1) instead of 16 f.
- B9/C6/D5 office: s4_office.js new keys s4o.hide [names, 'x*' prefix] and s4o.case_at / case_dx / case_rot. Hidden: desk_lamp (the globe that swept the lens) + env mini fridge/microwave/cup (stood in front of him). Scope case moved to the desk's right corner in front of him (case_dx [2.1,-1.36,-.676]): the lid shuts beside him. Stations: chart+HIM 1490 B(.12,.35,1.45) -> ruler rest 1548 B(.18,-.3,1.45) -> push to him + case 1640 B(.42,.15,1.3). Faces: think on "SEE" 1584, stunned on "wasn't" 1629, humble 1650; fist lets go of the ruler at 1583.
- Tried and dropped: surgeon LEFT of the light box (the ruler then crossed his face).
- v3 RESULT (render 1278-1695 + handles, make_final run): red px rows 31-35 = 0; sat .39-.57, mean .45-.59. Self-look at strip_2fps: row 32 patient whole 1335-1350 (head cut by the top edge mid-travel ~1320), strides whole, climbers whole 1455-1485, surgeon whole 1530-1695 with the case lid in front-right of him; 1500-1515 surgeon near the right edge (check). Flicker: board/flicker_v3.txt. NOT RUN (time cap): check.mjs frame checks, motion gate, check_film on preview.
- Flicker v3: FAIL

## v4b STRICT EVERY-FRAME FIX (2026-11-17, FIX_BRIEF_v4 v4b). Backups: out/build_film_before_v4b.py (+ s4_office/stairwell copies, unchanged). Sets NOT touched. ONE command unchanged.
- Strict check before (board/checks_strict_before_v4b.txt): 7 FAIL / 6 WARN. Plan after (board/checks_strict_v4b_plan.md): 1 FAIL (patient slide 5.5 cm/f at 1362, pre-existing stride, not an edge/face line) / 7 WARN (camera crossings of 1-2 f: climbers 1446-1449, surgeon slide 1585) / 20 PASS. 0 head_cut / body_side / face_covered FAIL.
- Patient (0:44): the camera no longer sweeps over him. Station 2 arrives 1324 (travel 1.1 s) on the EMPTY stair foot; he waits off frame left (PX0 -.5, dir 1, pt_bound from 1324) and LEAPS into S0 in the bound air phase 1332-1335 (one frame part-in, = entering exception), lands + turns dir -1 at 1336 (stance), plasters 1336-1352. Strides 1353 unchanged.
- Climbers: lanes 1.0/.55/.8, climber3 on tread 2, visible from 1420 (behind the dial-rest camera: no pop at 1405-08); pull back station 1468 travel .9 s (was 1.1): each crosses the right/bottom edge in 1-2 f; climber1 no longer inside the right wall / behind the wall rail.
- Surgeon (0:50): office station 1490 pos/aim x +.06/+.07 (B(.18,.35,1.45) -> B(.15,2.4,1.32)): head whole from the dissolve.
- Re-rendered 1278-1550 + both handle sets, make_final run.

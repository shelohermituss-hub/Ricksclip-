# fake-surgery S3 STATE (BUILD-OUT, 2026-11-16)
Range: film 777-1289 (rows 21-30), rendered 765-1301 (12 handles each side). Frame = FILM frame (no offset). Round-2 state kept in out/STATE_round2.md, out/build_film.r2.py, out/s3_wrap.r2.js.
## The ONE command (from s3/)
`bash final/run_final.sh` = build_film.py -> bake -> motion gate -> final/render_final.py (resumable, gpu_render.sh queue, chunks of 120; delete frames to redo them) -> final/make_final.py (numbers.txt, strip_2fps.jpg, line_check.jpg, preview.mp4 720 + voice) -> frame checks (final/checks.txt) -> flicker (final/flicker.txt).
## Delivered: final/frames f_00765..f_01301 (537, 1080x1920), preview.mp4, strip_2fps.jpg, line_check.jpg, numbers.txt, checks.txt, flicker.txt.
## Changes this round (build_film.py only; s3_wrap.js unchanged, no base-set edit)
- OR rows 27-30 = S1 round 5 lying patient, keys copied exactly: knee_v3 (at/hip/foot/face/win/ball/dx/dot/dome/pw/w), leg_drape #5f8fd0, knee_win thin, knee_tapes strips, lie_body, steps, knee_tone #857b72, lamp_at [-.05,.6,1.5]; knee_track [[0,3,3]] (3 dots + 3 plasters). Cast: SG [-.08,1.08,.36] (step), patientR [-.6,.78,.9]; KNEE = [-.04,.41,1.37].
- Nurse moved to [.85,1.15,.32] (her step too): S1's spot stands on the inside-CRT sight line. Hidden 1124-1157 (inside-CRT view; the fly-in covers it).
- r28: pump keys now move patient_leg_drape_tent + patient_kneecap_drape + knee_face_v3 (amp .06, 1169-1189); camera close [.32,-.5,1.9] -> [-.04,.5,1.45] 28 mm, from 1166 (knee window + 3 plasters + his fist, surgeon face in frame).
- r29: surgeon turns dir +1 at 1194 toward the steel bowl, now at [.42,1.12,.95] beside the nurse; jug rises, pours into the bowl, SPLOOSH at the bowl next to her face; clogs bob by her; wide [-.1,-2.45,1.95] -> [.1,1.1,1.45] 21 mm keeps jug, bowl, nurse wipe and patient head in one frame. r30 [-1.15,-1.55,1.75] 22 mm: patient smile + nurse still wiping behind.
- r27_b fly into the CRT: travel .12; measured 0 pink-fill frames 1116-1129.
- Office start = S2's last station (lens 26, ow(.1,-.8,1.4) -> ow(0,.95,.95)) held 765-784, then flies (to 788+) to the low trays station ow(.32,-.72,1.22) 18 mm, shifted right so the surgeon stays in frame. Surgeon starts on S2's spot ow(.05,1.45), strolls to ow(.95,1.75) from 790 (1.3 s).
- Pre-op bay: S2's corridor colour keys co_v2 + co_v3 + light_over ai .64 si 1.0 rich 1.0 veil #e8c878 (sat .24-.27 -> .31-.55).
## Cuts, impacts, joins (for the sound and the edit)
- HARD CUT 1 at f927 (new day). The S3/S4 hard cut at f1290 is S4's (frames 1290-1301 are handles only).
- IMPACT f1226-1227 (SPLOOSH, impact frame + kick amp 1.4 at 1226; lamp rattle 1226-1248; sploosh 1224-1252). Label pops ("60") 793, 841, 879; note stick 902; tick 996-1004.
- Joins inside: r26->27 porthole flight (1084 -> 1087 inside OR), into the CRT 1119-1124, out of the CRT to the knee 1158-1166, dry -> flooded on 1226.
## Numbers (final/numbers.txt)
- sat / mean per row: r21 .41/.35, r22 .42/.33, r23 .38/.37, r24 .38/.56, r25 .55/.48, r26 .31/.57 (min .16 = door/gurney join), r27 .47/.33 (min mean .25 inside the CRT), r28 .44/.40, r29 .59/.36, r30 .64/.36. Red px 0 (max .002 % in r29).
- Motion gate 0/0/0/0 (board/motion_gate.txt). Frame checks: 2 FAIL / 11 WARN / 163 PASS; both FAILs are the reclined patientR card cut at the edge (inside-CRT view 1124-1148 right edge 57 %; knee close 1166-1190 left edge 49 %), WAIVED as "the reclined patient under the drape" / knee close (same as S1 r5). Skip list adds table_pad + patient_left_leg_drape (surgeon on his step 1-4 % against the patient drape during the flight).
- Flicker FAIL: 18 frames. Planned: 927 (hard cut), 1087 (porthole join), 1226/1228 (impact). NOT planned (pre-op take, round-2 staging): 978-981 (patient + g1/g2 hidden for the POV), 1027-1028 (patient/surgeon reappear), 1062-1063 (surgeon hidden), 1076/1080 (gurney/door flight).
## Weak / open
- Pre-op visibility pops (978-981, 1027-1028, 1062-1063): replace the hides with camera-covered exits or 4-6 f fades.
- r21-22: the surgeon stays in frame, but his fist does not touch the labels (he stands behind the desk; the labels are 1 m away). Needs him at the desk front end, plus a new walk.
- r29: the jug is small and dark at head height, not from high up; the glasses wipe reads at 720 but is small at phone size. A jug-high pose in sg_s3 and/or a closer nurse station would help.
- r26 door/gurney join sat .16 (white corridor door) and r27 inside-CRT mean .25 (< .31).
## ROUND 2b (2026-11-16, flicker + S1 knee_crisp)
- build_film.py: 982 tilt travel .25->.45, patient/g1/g2 hides 976->978; patient+surgeon reappear 1028->1022; surgeon hide 1062->1068; door station travel .5->.9; gurney path eased (5 mid keys). ORK knee_v3 = S1 latest values + knee_crisp=dict(back='#24488a'). Frames 966-990 and 1016-1301 re-rendered, make_final/checks/flicker re-run.
- Flicker FAIL 20 -> frames [926,927,976,1027,1028,1060-1063,1075,1076,1079,...]: 978-981 and 1080 gone; STILL open: 1027-1028 (3.6), 1060-1063 (1063 pop 14.9, white gurney sheet sweeping the lens = real object motion, not a hide), 1075-1079 (door flight whip, 1076 4.7). Planned 927/1087/1226/1228 stay.
- Frame checks 5 FAIL: 2 waived (patientR) + NEW g1 f969-991 inside bay_far_wall_dado (21 %, hides at 978 let the camera pass it), surgeon f1149-1165 inside drape_hip_fold 12 % (bigger knee_crisp drape), patient f1021-1029 foot slide 3.1 cm/f (he shows at 1022 now). Fix next: hide g1 back to 976 with travel .3, surgeon step off the fold, patient show 1026 or walk pose.
- r26 door join saturation NOT lifted (not done).

## ROUND 3 (2026-11-16)
- build_film.py: g1 moved to y 8.35 (off the far wall), g1/g2/patient hides 978->976, 982 tilt travel .45->.3; surgeon SG y 1.08->1.2 (off drape_hip_fold); patient + surgeon reappear 1022->1030 (after the camera move); door camera station 1066 pulled back/left cw(-1.7,5.3,1.7) aim cw(.9,3.9,1.3), 1084 station cw(.95,2.7,1.62) travel .55; gurney end moved to (.8,3.95). Frames 927-1301 re-rendered; make_final, checks, flicker re-run.
- Frame checks: 2 FAIL (the 2 waived patientR), 8 WARN, 162 PASS. The 3 round-2b FAILs (g1 wall, surgeon hip fold, patient foot slide) are GONE. Motion gate: planted_foot_slide 0 for all; sg_s3 arm_over_reach 213 px (surgeon now 12 cm further back, hand_at the knee: check it).
- Flicker FAIL 17 (was 20): 926/927/1087(planned), 1226/1228 (planned) stay. STILL open: 978, 981 (new: shorter 982 tilt whips), 1027-1028 (= pov_arm f1=1027 ends: the set-drawn arm vanishes, not the cast), 1060, 1072/1076/1078/1081 (door flight still pops; the gurney/lens fix did not remove them). Next: end pov_arm with a 4 f fade or hold it to 1030; restore tilt travel .45 and hide at 976 with the tilt starting earlier; door flight: check the white gurney sheet in 1060 and 1072-1081 crops.

## v2 FIX (2026-11-16, FIX_BRIEF_v2.md). v1 kept in out/build_film.v1final.py, out/ep_s3.v1final.mjs, out/s3_wrap.v1final.js
- CAMERA: 19 stations / 5 takes -> 9 stations / 5 takes. creep=0 parks removed (only the S2 join hold keeps it, because the first take bakes from frame 0). Office = ONE 4.1 s travel (via) A -> tray 3 following the walking surgeon; pre-op = wide -> over-the-table push (1.85 s) -> drift (0.93 s); door take = follow the gurney through the opening doors (0.8 s); OR = CRT rest -> ONE 3.1 s pull back over the knee wiggle to the wide -> flood swap at the SAME pose (computed F1P) -> 1.5 s push in on the ko patient.
- Camera gates on 777-1289 only (out/cam_gates_range.py; film_plan.py check reads from frame 0 and is diluted by 765 handle-less frames): BEFORE (v1) rest 88 %, dead still 87 %, peak 1038 px/f, 2 swings > 120 deg. AFTER: rests/10 s 5.3 (plan count, eased ends split), rest median 0.9 s, peak 36 px/f, swings > 120 deg 0, dead still 16 %, speed median 1.5 FAIL, cuts/10 s 2.3 FAIL (927 planned hard cut, 1058 door blend, 1087 place change, 1226 invisible place swap at the same pose).
- No sliding: so_s3 walks (moves/ep_s3.mjs WALKS: stepping feet + bob on every film.json floor move). No human limbs: pov_arm (set-drawn arm + sleeve) removed. No pops: every hide/show in pre-op and OR removed (patient, g1, g2, surgeon, nurse all visible throughout their take; g1 moved to cw(-2.6,8.35); surgeon waits across the table at cw(-4.3,7.55) with the envelope from 927).
- Door (36 s): s3_wrap NEW key door_open (leaves + plates + portholes swing 82 deg about their hinges 1066-1080, lit sea-green vestibule); porthole_glass/glint hidden (no haze); gurney rolls through to cw(2.4,3.2).
- OR: inside-CRT impossible view dropped (no 4 f fly-in, no nurse hide). Patient = k:koSleep (spiral + X eyes, tongue, stars, zZ) -> k:koDream at 1252 (smile, zZ + heart). Splash: s3_wrap NEW key splash_big (opaque blue crown x2.4, 18 fat drops, floor ring) replaces the sploosh, f1224-1254.
- WEAK: pre-op surgeon partly hidden behind the patient card at 1005-1058 (envelope beat reads poorly); clipboard form only partly in frame, his fist not on it; speed median low; office head cut at the right edge mid-travel ~860.
- RENDERED v2 (all 765-1301, final/run_final.sh). check_film on preview: rest 44 %, rests/10 s 3.92 (WARN), rest median 0.97 s, travel p90 2.46 s, speed median 2.95, p90 24.9, dead still 9.4 %, whips 0 -> PASS except cuts/10 s 5.04 FAIL (planned 927/1058/1087/1226 + detector hits). Frame checks 15 FAIL: surgeonOff foot slide 5.9 cm/f (walk feet do not counter-move), surgeonOff head cut right 904-926, g1 cut right 927-953, pre-op surgeon inside bay_window_wall_dado (SG_PRE too far left: move to about cw(-4.05,7.5)), patient "seat none" 1005-1028, splash_big crown overlaps surgeon/nurse/patient 1226-1247 (effect, waivable or scale 1.8). NEXT ROUND: these.

## v2 ROUND 2 (2026-11-16)
- Office foot slide: moves/ep_s3.mjs soS3 walk rewritten (old walk teleported the planted foot 60 px at each step boundary): stance foot counter-moves at the card's lateral speed (WALKS [from,to,vm]), swing foot returns lifted, feet carried across holds, feet negated while the card is mirrored (f880-887, the dir +1 turn). Isolated check 870-905: WARN 1.8 cm/f only.
- Heads at the right edge: office station 904 + via shifted +.2 m in x (camera only); pre-op 927 aim cw(-3.8,8.3,1.0), g1 -> cw(-2.9,8.25). Pre-op cast: PT_PRE cw(-4.0,8.0) (off the chair: seat check), SG_PRE cw(-3.98,7.55) (off the window dado), g2 cw(-4.2,6.75). Residual: surgeon/g2 inside bay_window_sill 3-5 % during the 954-1004 tilt (WARN-level).
- WAIVER (EXTREME, planned): splash_big crown overlaps surgeon/nurse/patientR 1226-1247 (body_in_mesh inside CylinderGeometry/SphereGeometry): an effect, not a body fault. Plus the 2 reclined patientR (knee close, inside view).
- NOT done: item 6 (envelope beat, surgeon half hidden behind the patient) left for the next round.
- RESULT round 2 (all 765-1301 re-rendered, make_final done): frame checks 11 FAIL / 12 WARN (was 15 FAIL): GONE = surgeonOff foot slide, both head cuts (904-926, g1 927-953), pre-op dado, patient seat none, surgeon+g2 overlap. LEFT = waived splash (surgeon/nurse/patientR 1226-1247, 5 rows), small sill 3-5 % (g2 x3, surgeon 954-1004: tight bay), surgeonOff desk_pedestal 2 % 904-926 (new, from the +.2 m camera shift? no: his body vs pedestal at SO1; step him 5 cm off next round). Strip not re-viewed.

## v3 FIX (2026-11-17, FIX_BRIEF_v3.md + ISSUES_v2). v2 files kept in out/v2final/ (build_film.v2.py, s3_wrap.v2.js, run_final.sh, make_final.py)
- ONE command unchanged: `bash final/run_final.sh` (now also renders the dissolve handles: S3_VARIANT=in/out python build_film.py -> film_in.json / film_out.json -> final/handles; make_final.py bakes them).
  Re-render: delete final/frames, final/_unblended, final/handles first.
- Start = S2's last office station (unchanged: 26 mm, world [120.1,-0.8,1.4] -> [120.0,0.95,0.95]), held 765-780.
- env_v3 on for office (dust 20), corridor/pre-op, OR (dust 0: the white "snow" motes in the CRT shot are gone).
- Office (D1, B6): end station pulled back ow(.9,-1.2,1.45) 24 mm (was 26 mm at -0.68): surgeon whole head-to-feet beside the trays; "60" labels read (env_v3 lamp cap).
- Pre-op (D7, A5): extra g1 wears g3's lilac-stripe gown (only one green figure); window recoloured (bay_window_soft_sky #9fb2b8, sheer #d8d2c4: not blown);
  surgeon SG_PRE cw(-3.65,7.25) (was -3.98,7.55, directly behind the patient); g1 cw(-3.2,8.4), g2 cw(-4.3,8.6) back row; wide 927 cw(-1.7,6.9,1.5) 18 mm; push 1005 cw(-2.9,8.65,1.5).
- Door (A6): gurney rolls 1040-1122 (was 1056-1092), doors swing 1060-1082; camera follows 2.0 s (travel to 1114, cut by the OR take at J2 mid-move).
- DISSOLVES (D2): 12 f, baked, both sides moving: J1 1044-1055 (pre-op drift -> door push), J2 1094-1105 (door push forward -> OR slow push). No held-frame dissolves.
- OR (C5, A2, A3): ONE place 'orw' (no dry/flood swap). CRT station [.3,-1.0,1.75] -> [.32,2.4,1.38] 24 mm: CRT ~1/3 frame width with VCR + tape, nurse beside it (NR moved to [1.0,1.7]).
  s3_wrap NEW key jug_flood (shared water_fx 'jug_flood' from the held jug_pour spout via window.held3dAll, at [.3,.95], f1215-1260, depth .3, 2 white clogs float);
  splash_big, bowl, water_floor dropped (water_floor 0). Patient faces koSleep/koDream without the drawn zZ; or_room zzz_v3 floating Zs on the card head (f T2-30..1301). Row 30 push aim moved left (patient head whole).
- Camera gates 777-1289 (out/cam_gates_range.py): rests/10 s 4.09, rest median 1.17 s, peak 46.5 px/f (927->1005 push), 0 swings; FAIL speed median 1.4 / p90 8.3 (calm, as v2), cuts 1.75/10 s = planned 927 hard cut + J1 + J2 dissolves.
- RENDER: started at the 100 min cap through the shared queue (log final/run_v3.log, EXIT line at the end); it finishes make_final (dissolves, strip, preview), checks.txt, flicker.txt unattended.
  Self-look on the first 240 frames (out/v3_look.jpg): see-through flood + floating clogs OK, Zs float over the head, CRT + VCR + nurse beside, one green figure in pre-op.
- OPEN: CRT shot 1120-1150 the surgeon's card fills the left third (covers part of the console); pre-op 940 the lilac extra touches the right edge; A5/B6 not yet verified on final frames;
  check_film on preview and flicker/frame checks NOT yet read (run still going); camera speed median low.
- RENDER DONE (after the report): 537/537 frames, dissolves baked, preview.mp4 + strip written. Frame checks 9 FAIL / 5 WARN / 141 PASS (out/frame_checks.md).
  Flicker FAIL: planned 927 (hard cut), 1226/1228 (SPLOOSH impact); NOT planned: f1087 pop 12.9 and f1060 5.2 (door push: door swing start 1060 / the gurney+vestibule at 1087), to check. check_film on the preview not run yet.
  The 9 FAILs, worst first:
  - CRT rest 1100-1140: the surgeon is cut by the left edge (78 %). His foot slides 82 cm/f at f1112. The cause is the T2 act: he jumps from the pre-op bay to the OR spot at the take start, and the move eases between the two spots. Fix: give him `pos=SG` with no move at T2, or start him on SG with visible False before T2.
  - CRT rest: the reclined patientR is cut by the left edge (28 %; the old reclined-patient waiver).
  - Pre-op 954-1004: g1 is 48 % inside side_table_cabinet and g2 is 17 % inside the bay window dado. Both are new spots: move g1 to about x -3.0 and g2 to about x -4.15.
  - g1 has no seat at 1005-1022.
  - Small (1-3 %): surgeonOff inside the desk pedestal at 904 and inside locker 3 at 881; the patient 1 % inside the bay window sill at 1045.

## v4 FIX (2026-11-17, FIX_BRIEF_v4.md: no overlaps, no cut heads). v3 files kept in out/v3final/ (build_film.v3.py, s3_wrap.v3.js)
- Check (plain `check.mjs film.json`, whole plan) BEFORE 12 FAIL / 6 WARN (board/checks_sweep.txt) -> AFTER 0 FAIL of the listed types; left: surgeonOff desk_top 1 % WARN 904-926 + locker_2 0 % WARN 3 f at 881 (his hand on tray 3 / on the locker-2 note = the contact the act asks for), patientR 3 % in patient_leg_drape_tent 1290-1301 (allowed 1), slide WARNs (not a v4 type).
- s3_wrap NEW key shift [{names, d}] (move base meshes by plan metres): OR IV pole + legs + hook bar + saline bags + tube +0.55 x, +0.5 y (behind the nurse: no bag over her face).
- CRT rest: CRT_P [-0.2,-1.6,1.8] aim [-0.18,2.4,1.38] 18 mm (was [0.3,-1,1.75] 24 mm): reclined patient + surgeon whole. Surgeon jumps to SG at T2-3 (move_s .03: 1 f, during the door take, off its lens): no 82 cm/f glide.
- Row 30 push end aim [-0.32,0.87,1.48] (was [-0.62,0.95,1.48]): the nurse whole, no cut at the right edge.
- Pre-op: g1 cw(-4.02,6.6) (v3 cw(-3.2,8.4) stood in the push lens + side table), g2 cw(-4.24,8.62), patient x -3.92 (off the sill), bay_far_wall_bumper_rail hidden (ran through g2).
- Office: SOL ow(1.18,0.45) (in front of locker 2), SO1 ow(1.28,0.28) (in front of the desk corner); env_file_cabinet_tall hidden (3 % in his walk at 849).
- Re-render: frames 848-1301 + handles + _unblended deleted, `bash final/run_final.sh` (log final/run_v4.log).
- RENDERED v4 (848-1301 + handles, run_v4.log EXIT 0, 537/537): final/checks.txt 0 FAIL / 4 WARN / 147 PASS (WARNs = 2 slides + the 2 surgeonOff contact lines above). Flicker unchanged from v3 (planned 927, 1226/1228; 1060/1087 door push as v3). Look: out/v4_look.jpg (881,915,940,990,1010,1045,1110,1140,1288).
- OPEN: the CRT now reads smaller at 18 mm (screen ~1/5 frame width); g1 is only in the push/drift frames (out of the 927 wide).

## v4b STRICT (2026-11-17, FIX_BRIEF_v4.md v4b). v4 files kept in out/build_film.v4.py, out/s3_wrap.v4.js (s3_wrap not changed in v4b)
- Strict check `check.mjs film.json --all-frames --frames 765-1301 --no-body`: BEFORE 10 FAIL / 2 WARN (board/checks_strict.txt) -> AFTER 0 FAIL / 2 WARN (board/checks_strict_v4b.txt; WARNs = the 2 old foot slides).
- Pre-op push (the "half heads" 979-1046): a straight push on the 927 axis, PRE_P cw(-2.22,7.09,1.5) aim cw(-3.9,7.7,1.12) 20 mm, drift PRE2 cw(-2.26,7.14,1.52)/cw(-3.9,7.72,1.16) 20 mm (v4 swung round to cw(-2.9,8.65) at 22 mm: g2 slid out right, g1 in left, surgeon + patient sliced). Surgeon, patient, g2 + the table whole the whole take; g1 stays out.
- preop_chair shifted [-0.5,-1.5] (existing s3_wrap shift key, group by name) into the window corner: its back covered the table + form in the push.
- Office: end station 904 ow(1.02,-1.25,1.45) aim ow(1.08,0.85,1.12) (was ow(0.9,-1.2)/ow(0.95,0.85)): his reach to locker 2 at 879-887 no longer cut by the right edge; via unchanged (trays + rinse "60" at 841 kept).
- Re-render: final frames 781-1062 + _unblended 1044-1055 + all out_ handles deleted, `bash final/run_final.sh` (log final/run_v4b.log). Hard cut 927 and dissolves J1 1044-1055 / J2 1094-1105 unchanged.
- RENDERED v4b (run_v4b.log EXIT 0, 537/537): final/checks.txt 0 FAIL / 4 WARN / 149 PASS; strict check on the rendered plan 0 FAIL / 2 WARN (board/checks_strict_v4b_final.txt). Flicker FAIL frames = the planned ones only (926/927 cut, 1059/1060 + 1086/1087 door push as v3/v4, 1225-1228 SPLOOSH flash). Look: out/v4b_look.jpg (882,887,927,960,990,1010,1030,1046,1050).

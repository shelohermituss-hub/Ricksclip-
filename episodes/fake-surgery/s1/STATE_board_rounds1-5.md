# S1 STATE (stretch builder, 2026-11-16, one round, 90 min cap)
Film 0.00-12.50 s = frames 0-374 (+12 handle frames to 386), plan rows 1-10, script lines 1-3. One take "or" in OR 3, light kind OR (PLACE_KEYS.json "OR").

## The ONE command
`bash run.sh` (STAGE=hook | key | post | plan). build_film.py -> bake -> motion gate -> GPU 0-374 at scale .5 (board/all, the hook) + 24 key frames at scale 1 (board/key) -> sheets + numbers -> hook mp4 + strip -> frame checks.

## Files
- film.json, build_film.py, words_s1.json ("Doctor," 10.12-10.75, "you" 11.10, "operation." 11.66 from the loudness curve of voice.wav), OFFSET.txt, run.sh
- moves/ep_s1.mjs (sg_s1 surgeon, nr_s1 nurse, pt_s1 reclined patient), moves/studio_ep.mjs, moves/tools/check_motion_ep.mjs (sheet surgery.mjs)
- sets/or_room.js (I own it): NEW keys only, documented at the file top: knee_v2, knee_track, knee_tone, lamp_pos, lamp_angle, drape_soft, power, impact, tiks, scope_view + scope_cam; anchors knee_r, knee_plaster_1..3. Backup before my edits: or_room_before_s1.js.bak. or_props.js unchanged.
- board/: frames/ (r<row>_<a..d>_f<f>.png, 1080x1920, kit captions), sheet_360.jpg, line_check.jpg, numbers.txt, checks.txt, motion_gate.txt, hook_moving.mp4, hook_strip.jpg, f0test/ (frame-0 proofs)

## Staging
Surgeon [0, 1.05] behind the table facing the head end (34, dir -1); nurse [0.6, 1.75] behind his right (34, dir -1); patient puppet at anchors.patient_card [-0.42, .57, .85] (pt_s1, reclined).
Frame-0 camera [0.7, 0, 1.8] -> [-0.35, 1, 1.0], 18 mm: knee nearest the lens, surgeon behind it, the patient's moustached face at frame left, the OR lamp swung in front (lamp_pos) so cap, glasses and the knee face are lit.
Cameras: r3 swing to the patient's face; r4 back over the knee; r5 push-in to the knee (POWER: slap 1 f133, slap 2 f147, hand hangs high f148-155, IMPACT f156-157 two-tone, white focus-line ray burst + cream stamp ring, kick 7 f, pat f166);
r6 IMPOSSIBLE VIEW from inside the scope bag on the tower shelf (crinkle film + STERILE SEALED tag foreground, surgeon far off); r7 pull back to knee + clean tray; r8-10 two-shot, push on "forgot".
Joins / hard cuts inside S1: none (one flying take). Out-join to S2 at 12.50 (plain at the gate; build-out: out through the door porthole).

## Numbers
See board/numbers.txt, board/checks.txt, board/motion_gate.txt (summary in the report).
Motion gate: sg_s1 / nr_s1 / pt_s1 twos 0, linear 0, no_settle 0, creep 0. pt_s1 "dps 0" is a checker artefact (its feet are point-list legs, the checker reads q.x = NaN); the card turns and breathes every frame.

## Weak / open
- Knee vs caption: the knee sits low, near the 71.5 % caption line in frame 0; the camera looks down about 25 deg (rule: <= 10 deg on a character) to keep the surgeon's face above the knee. A raised camera + larger knee prop (or a knee_scale key) is the build-out fix.
- Surgeon about a third of the frame height in frame 0, not half.
- Held props (hand L per lead note): tip_at does not move the drawn fist; the fist does not reach the knee from behind the table (the knee is ~0.6 m in front of his card). Scalpel / bulb / plaster ride the fist, not the knee: weak on rows 1-2, 4, 5.
- Glasses glint on the power hold, pinky-out squeeze, monitor flicker on "never", glasses-chain swing: not built.
- Knee: iodine reads strong orange; patch brightness not measured separately.
- hero_props placeKneeMarks not used (lead: use or_room's own knee keys until the props fix lands).

## Round 2 (2026-11-16, fix round 2: the hook)
Backups: or_room_before_s1r2.js.bak, or_props_before_s1r2.js.bak (or_props unchanged), build_film_r1.py.bak, ep_s1_r1.mjs.bak.
- or_room.js NEW keys (others unchanged): knee_v3 (bent leg under a drape tent: thigh up ~32 deg, shin down, a round kneecap PEAK, taped dark-blue window 17 cm,
  matte iodine dome #c0702a inside it, 3 dots / 3 plasters in one row on the face toward the lens: face = [.68,-.52,.52]); hand3d (the surgeon's working arm =
  soft_arm + round black fist + scalpel / grey-blue bulb with water fan + pinky out / plaster, driven by keyed targets on the knee anchors, so the fist is ON
  the knee in front of it; the card's near arm is tucked behind his body with behind: true in sg_s1); tray_at (Mayo tray at [.72,-.12,.95]).
- Staging: surgeon [0.12,1.08], nurse [0.6,1.45] (in frame behind his right), patient card [-0.5,.57,.92] lifted; torso drape tube OUT under knee_v3 (low hip fold only).
- Patient card is visible:false on the frame-0 rest (f0-44): from the foot end its gown edge is always cut by the left edge (no frame-0 camera with knee >= 22 %
  keeps him whole: searched). His beat is r3; visible from f45.
- Cameras: f0 foot-end 3/4 [0.92,0.1,1.36]->[0.35,1.1,1.3] 20 mm (3 deg down); r3 near side head end; r4 and r8-10 one wide near-side frame with all four
  (patient thumbs-up readable); r5 close [0.64,.42,1.53] (knee face normal); r6 from the sealed scope on the Mayo tray (path no longer crosses the head); r7 knee + tray.
- held3d entries removed (props are in hand3d). hand_at keeps the far fist at the back of the knee.

## Round 1 result (2026-11-16, cap reached)
- Frame checks 41 FAIL / 5 WARN / 102 PASS (board/checks.txt): patient body_in_mesh (his card sinks into patient_torso_drape) and cut by the left edge in most rests; nurse cut by the right edge rows 4-5, 8-10. Not waived; build-out fixes.
- Saturation .37-.62 (impact frame f156 .19 by design), mean .30-.53, red-gate px 0 on all 24 panels. Motion gate 0/0/0/0.
- Seen on the sheet: knee reads as a dark orange BALL, dots/plasters small and under the caption line; held props hidden (fist cannot reach the knee); row 6 travel f200-220 passes through the patient's head (camera path from the knee close to the tower crosses the table: needs a waypoint over the lamp); rows 8-10 nurse at the right edge, lean barely visible; row 7 tray out of frame.
- Round 2 result: frame checks 1 FAIL / 2 WARN / 147 PASS (the 1 FAIL = surgeon head at the right edge in the row 5 knee CLOSE, waived by PICTURE_PLAN knee rules).
  Motion gate 0/0/0/0 (sg_s1, nr_s1, pt_s1). Sat .36-.61 (impact f156 .32 by design), mean .32-.65, red px 0 on all 24 panels.
  Iodine patch (window) frame 0: 17 % of width, y 55-64 % (above the caption line), patch V mean .82 (target <= .80; lower knee_tone a step). r5 close 24-26 %.
  hook_moving.mp4 re-rendered at scale .5 (queue), not full size.
- Weak / open (round 2): frame 0 the knee window overlaps the surgeon's mask/chin (his face sits right above the knee; needs the surgeon 0.3 m further
  toward the head end or a lower knee); the leg tent does not read as a triangle from the foot end (it reads from the near side); the 3D fist reads in
  r4/r5 (bulb + water, plaster slaps, pats) but is small/half hidden in frame 0 (scalpel tip hard to see); rows 4 and 7-10 are wide all-four frames,
  knee only ~6 % there (dots not countable); patient hidden on the frame-0 rest (visible:false f0-44), not truly out of frame.

## Round 3 (2026-11-16, fix round 3: frame 0 staging, tapes, knee tone; cap reached)
Backups: or_room_before_s1r3.js.bak, build_film_r2.py.bak, run_r2.sh.bak.
- or_room.js NEW key knee_tapes: 'strips' (four thin straight off-white strips on the dark-blue window edges, short of the corners, never crossing; default = old corner X tapes).
- build_film.py: knee_tone '#a89e92' (was #c8bcb0), knee_tapes='strips', knee_v3 win 0.20 (was .17; all rows' window slightly bigger), cam[0] = near side LOW
  [0.061,-0.759,1.371] -> [0.27,1.23,1.371], 28 mm, level (knee peak + .15 m). Picked by a station search in the live scene (scratchpad probe e3.js: 24 k stations,
  cards turned to each lens, window box %, head boxes vs knee box, edge cuts). NO station met every rule: at 28-32 mm the fat surgeon's head (box ~45 % wide,
  head z 1.45 = only .23 m above the knee peak) + the nurse + a 22 % knee do not fit; the patient (x -1) is never in a near-side 28-32 mm frame -> still hidden f0-44.
- run.sh: hook stills at scale 1 (full size); hook_moving.mp4 re-made from 1080x1920 frames.
- Result: both faces whole and clear ABOVE the knee (no window on a face). Weak: the window is seen nearly edge-on (face normal [.68,-.52,.52] points to the
  foot end, the camera is on the near side), a narrow tilted slab under the nurse's chin; dots not countable at phone size. Next fix: turn knee_v3 face toward
  this lens (e.g. [0.1,-0.8,0.6]) and re-aim the r5 close along the new normal, or lower the knee / raise the surgeon so a foot-end 3/4 works.
- Numbers: frame checks 1 FAIL (r5 close head_cut, waived) / 3 WARN / 146 PASS. Motion gate 0/0/0/0. Patch V: f0 .75 (s1_measure box is polluted by other
  orange pixels at f0, width number unusable), f166 .77, f196 no patch in view (.74 in the half-size test). All <= .80.

## Round 4 (2026-11-16, fix round 4; goal changed mid-round by CB: "lay on bed in 3D space position with knee more up")
Backups: or_room_before_s1r4.js.bak, build_film_r3.py.bak. Test stills: board/f0test/r4a..r4c (f0, f48, f152 at scale .5).
- or_room.js NEW keys: knee_scale (kneecap ball, window, dome, dots, spacing, plasters x s), lie_body (his body = a flattened drape mound from
  the raised head section to the hips, + chest fold, so the drape reads as a man lying on the table).
- build_film.py: knee_v3 at [.08,.74,1.30] hip [-.16,.74,.93] foot [.33,.74,.9] (thigh ~58 deg, shin ~56 deg up: an upside-down V, foot flat),
  ball .155, face [.1,-.8,.55] (top/front of the kneecap toward the near side), knee_scale 1.1, lie_body; knee_tone #988e84 (was #a89e92: r5 patch V .85 in test);
  surgeon on a 36 cm step (SG z .36; nurse z .18) so his whole face stays above the high knee; hand3d shoulder z + step; far fist [.08,.86,1.42].
  cam[0] near side [.04,-1.1,1.40] -> [.05,1.2,1.30] 28 mm (2 deg down). r5 close re-aimed along the new normal: [.161,.089,1.664] -> C0 [.098,.597,1.315].
  Scope cam aim kept [.36,.85,1.32]. NEW key steps (OR step stools under surgeon + nurse: feet planted). knee_v3 w .12, lie_body r .13 zs .5 (no body_in_mesh FAIL). r5 cam moved to [.30,.09,1.66] (13 deg off the normal) so the nurse leaves the close. Patient card visible from f61 (was 45): his gown arm no longer crosses rows 1-2. KNEE = C0 [.10,.60,1.32] (power fx).
- Window measured by its dark-blue tape mask (s1_window_measure.py, lit tape ~ (67,107,185)): test f0 21.5 % wide, x 44-65 %, y 47-57 % (below both faces,
  far above the caption), 3 dots on f48.
- Result (full run, frames at scale 1, hook_moving.mp4 1080x1920 0-374): frame checks 2 FAIL / 10 WARN / 143 PASS: r5 close surgeon head_cut (waived as before)
  + NEW r6 scope view surgeon body_side 83 % cut by the left edge f184-206 (open: re-aim the scope cam toward the surgeon/knee at x .1). Motion gate 0/0/0/0.
  Window (tape mask) f0 21.7 % wide x 44-66 % y 47-57 %, f48 20.9 % with 2-3 dots; iodine V f0 .72, r5 .69-.79 (all <= .80).
- Weak / open: the bent-leg V reads as a rounded knee peak on the drape but its shin side is soft against the nurse's light gown; window 21.7 % (just under 22);
  in f0 only dot 1 is drawn (knee_track by design); the patient card appears at f61 near the end of the swing (pop while the camera lands).

## Round 5 (2026-11-16, fix round 5: frame 0 = near-side layout, raised knee in silhouette)
Backups: or_room_before_s1r5.js.bak, build_film_r4.py.bak. Test stills: board/f0test/r5a..r5d (f0 at scale .5).
- or_room.js NEW keys: leg_drape {color, fold, far_y} (leg tent + kneecap LIGHTER blue #5f8fd0 with painted fold lines; straight far leg moved to far_y),
  knee_win 'thin' (window = thin dark edge .008, no thick slab; tape strips stay).
- build_film.py: knee_v3 moved to the NEAR half of the table: at [-.04,.47,1.30] hip [-.28,.47,.93] foot [.21,.47,.9] (thigh/shin ~57 deg up), ball .085,
  win .115 (~11 cm), w .10, face [0,-.7,.72] (top/front, up toward the lens), dots dx .034 dot .011, small plasters; knee_scale removed; KNEE = [-.04,.41,1.37].
  Cast: SG [-.08,1.08,.36], NR [.32,1.45,.32] (higher step: her face off the knee), PT [-.6,.78,.9] (card behind the leg tent, visible from f0 now).
  cam[0] [-.42,-1.63,1.28] -> [-.42,1.2,1.36] 28 mm, level (~1.6 deg up). lamp_at [-.05,.6,1.5]. knee_tone #857b72. hand_at far fist [-.04,.62,1.44].
  r5 close [.22,-.12,1.78] -> [-.04,.42,1.37] 30 mm. Scope cam aim [.12,.85,1.36] (was .36).
- f0 numbers (scale .5 test r5d, same layout as the board): leg-V light-blue bbox x 57-90 % (33 % wide), top profile 61 -> 53 (peak, x 70-80 %) -> 59 %;
  iodine window x 74-80 % y 49-52 %; patient face (whole) x 4-37 % y 35-51 %; surgeon face x 54-71 % y 30-45 % (ABOVE the knee top 49 %: no overlap); caption 71.5 % clear of the V.
- Result (full run, 0-374 at scale 1, 24 key frames, hook_moving.mp4 1080x1920 with voice + captions): board frame f0 leg-V 31 % wide, iodine V .66; r5 patch V .60-.73
  (f152 reading .93 is an orange blob at the TOP edge, y 4-10 %, not the patch: unverified). Motion gate 0/0/0/0.
  Frame checks 4 FAIL / 9 WARN / 145 PASS: r5 close surgeon head_cut 21 % (waived) + surgeon body_side 79 %, patient body_side 36 % (f126-155);
  r6 scope: surgeon no longer cut (aim .12), but patient body_side 38 % by the left edge f184-206. TARGET <= 1 NOT MET (cap reached).
- Tried and rejected (checks only, no render): r5 top-down 35 mm (6 FAIL), r5 from the head side 30 mm (nurse head cut), scope aim -.25 at 13 mm (6 FAIL).
- Open: r5/r6 now see the patient card (moved to y .78, visible from f0) at the left edge. Next: hide the patient card f120-210 (he is not in those beats)
  or give r5 a camera from the foot end; re-check f152 top-edge orange.

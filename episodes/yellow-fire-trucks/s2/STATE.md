# S2 STATE: THE SECRET, BOARD round (S2 stretch builder, 2026-11-21). Frames 288-474 (9.60-15.80 s), lines 3-4, plan rows 9-13, eye shop, MORNING.
## NOT done
- No moving clip, no strip, no feet-and-eyes sheet, no lock, no cam_track, no 11i density run (board round). Frames looked at by me only.
- No Rick frame exists in the repo: no side-by-side (numbers only, as LOOK_BIBLE says).
- Row 9: the camera does NOT start on S1's last station: the lead joins S1 -> S2 with an 8-12 f blend on the motion (see CAMERA_NOTE A). The fireman is
  NOT in row 9 (his jog across Main St was a card glide: frame_checks slide FAIL 15 cm/f; hidden until a locked-feet walk exists). He is first seen inside
  (f336) already in the white coat, helmet on the stand: the row 10/11 QUICK CHANGE gag (helmet off backward onto the hook, coat on) is NOT acted on screen.
- Row 10 coat tug is two small hand dips at the coat sides (reads weakly).
- Row 11: the head mirror cannot flip DOWN (heroShop draws it UP only): the knuckle goes to the band on "eye", glint fx at 385, mirror stays up.
- Row 13 "window a shade warmer" not built; row 11 "shingle swings outside" not visible (camera faces the back wall); shingle not rigged in the set.
## Built (files)
- `make_film.py` -> `film.json` (camera v2, camsafe, kit3d pbr/relief, tween ones, face_frames 0, card_shade 0/0, costume_shade keep_drawn_light + smooth 40,
  faces_ep from CAST_KEYS, places.shop.lite true). ONE take, 6 stations (one lead-in anchor at f0), CAMERA_NOTE.md.
- `moves/ep_s2.mjs`: he_enter (walk, hero card), he_shop (coat tug, knuckle flick on "eye", toy up to the lamp, out of the cone and back, glance) +
  `studio_ep.mjs` (copy of s1) + `moves/tools/check_motion_ep.mjs` (copy of s1's).
- `sets/s2_shop.js` (new, wraps sets/town.js unchanged): lemon-finished truck in bay 1, coat stand + white coat + black helmet (from 328), instrument table
  with a CLONE of the set's own desk lamp asset (desk_lamp_arm_01, CC0) + amber spot and faint cone, toy truck on the table to f404, `buildToyTruck`
  (held3d: truck_light.glb at 18 cm, red tin paint, dulls to #5a3a40 f436-446 = out of the cone; its own paint, no grade), paint-frame workaround of s1.
- Symlinks in s2/ (the render server serves the stretch folder only): cast, voice, assets_prod, sets/{town.js, assets.js, prop_kit.js, town}.
- `render_key.sh` (one background command: bake + key frames), `plan_window.py` (plan gates on the window only), `board.py` -> `BOARD.jpg`.
- Key frames `key/f_00292/344/386/418/440/458.png` (1080x1920, no captions), `render_each.sh` = one frame per process.
## Numbers
- plan_window.py (gates on 288-474): 0 FAIL, 4 WARN of 42. Real file `film_plan.py check film.json --window 288-474`: 1 FAIL ("at rest while a face is on
  screen" 22 %: the 288 lead-in frames; the window alone reads 34 %, WARN), WINDOW p90 19.4 px/f PASS, peak 35.1 WARN (window crossing f332-336).
- Motion gate (both moves, side + front exports): twos 0, linear 0, no_settle 0, creep 0, contact 0 px; holds dead still (0 px/f). Plain kit poses 0, frozen moves 0.
- Render: 31-42 s per full-size frame here (draw ~3.7 s + grab 27-38 s, CPU shared by ~7 helpers); one render crashed ("Target crashed", memory), re-run.
- frame_checks.mjs --frames 288-474 (rests + moving body rows): 0 FAIL, 1 WARN (heroShop planted-foot slide 5.3 cm/f mid-arc = the view switch while the camera
  swings), 18 PASS. camsafe validate.mjs --frames 288-474: 146 checks, PASS 146, FAIL 0.
## Weak points (my own list, seen in BOARD.jpg)
- The shop ceiling is a hot amber blob (town.js point light at 3.6 m); cameras raised to 1.8-1.9 m to show less of it; still big.
- The chart reads E / R / ED / GOES / FIRST / LPED: an extra top E in the set texture (user decision is R / ED / GOES / FIRST).
- Line 4 is drawn in SIDE view (apply_looks, he faces the lamp): the glance to the lens on "red" reads weakly in profile. Lamp clone: its cone is faint; the "dulls out of the cone" reads only as a small colour change on an 18 cm toy (x1.5 in the fist).
- The shop window glass is invisible in the kit (no reflection sweep on the pass-through).
- aim / glanceCam faces show the pink tongue (CAST_KEYS _mouth_note: lead to rule). Hero small in the two wides (W).
## Requests (not done by me; I edited no sets/ or assets_prod/ file)
- character-artist: heroShop "mirror DOWN" state (disc over the eye) for row 11; a helmet-in-hand state for the yard card so the doff can be acted on screen.
- set-builder: chart texture R / ED / GOES / FIRST without the top E; shop ceiling light softer (pt at [-1,-12.3,3.6] I 40); shingle as a separate swinging
  node; shop glass visible (opacity .18 reads as nothing); a closed-door-open state so he can be seen walking in.
- props-hero: a real three.js toy (folded tabs, bent ladder, missing hubcap, tin wear: PROPS line "Red toy truck"); `buildTruck` should set uInvRoot itself.
- lead: blend S1 f288 -> S2 (place change); decide if the board may keep the off-screen quick change.
## LECONS (LECONS_TECHNIQUES.md format; the lead copies)
- 2026-11-21 film_plan check on a stretch file FAILed first face, face share, speed median (9 FAIL). Cause: every gate counts from frame 0; a stretch starting
  at f288 carries 288 parked lead-in frames with no cast. Fix: s2/plan_window.py shifts a copy by -288 (words too) and runs the gates on the window only.
  Guard: plan_check_window.txt beside plan_check.txt. Proof: same stations, 9 FAIL -> real faults only, now 0 FAIL. OUVERT for the tool (a --stretch flag).
- 2026-11-21 The first station at S1's last framing made the pull back start ~3 s BEFORE f288. Cause: film_plan forces the first station's arrive to frame 0, so
  the v2 speed stretch takes the whole lead-in as "rest before". Fix: an anchor station at f0 with the same pose; the real first station at 288 with a hold.
  Guard: the baked camera at f288 must equal station 1 (proj check). Proof: camera at f288 = (1.2, -5.3, 2.1). FERMÉ
- 2026-11-21 scene.getObjectByName('desk_lamp_arm_01.000') found nothing. Cause: GLTFLoader sanitises node names (the '.' is dropped). Fix: match by regex
  /^desk_lamp_arm_01/. Guard: s2_shop.js warns "not found" in the render log. Proof: the lamp clone is on the table in key/f_00344. FERMÉ
- 2026-11-21 render_gpu.mjs stills died "locator.screenshot: Timeout 30000ms" with 7 helpers on the CPU. Cause: software mode defaults to grab screenshot,
  the compositor misses 30 s under load. Fix: --grab canvas. Guard: render_key.sh passes it. Proof: 6 frames, 31 s each. FERMÉ
- 2026-11-21 The shop moves played 40 f ahead (the knuckle at the eye on "job", the toy out before "strange"). Cause: an episode move's clock starts at
  the FIRST act that sets the pose (heroShop at f288, hidden); re-setting the same pose at f328 does not restart it. Fix: he_shop f = F(t) + 288.
  Guard: board LINE CHECK tiles (the action must match the CAPS word). Proof: f386 knuckle at the mirror on "eye", f440 toy out on "strange". FERMÉ
- 2026-11-21 camsafe validate: 126 of 146 checks FAIL VIEW_MISMATCH. Cause: the moves always returned view '34' while apply_looks (act "look") asked front
  or side. Fix: ep_s2.mjs exports `default` (side) and `front` (front; camsafeView turns it to 3/4 or back). Guard: validate.mjs in the cycle.
  Proof: 146/146 PASS. FERMÉ

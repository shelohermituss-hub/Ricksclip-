# S4 STATE: THE IDEA SPREADS, BOARD round (S4 stretch builder, 2026-11-21). Frames 770-969 (25.65-32.30 s), line 7, plan rows 22-27, the map, bleached day.
## NOT done / wrong
- Plan gates on the window: NOT 0 FAIL. plan_window.py 2 FAIL (speed median 10.45 px/f, heads in caption band 8.9 %); real file WINDOW p90 22.4 (FAIL by 0.4).
  I rendered anyway because of the time box. Cause and 3 options in CAMERA_NOTE.md: the lead must pick one.
- frame_checks/check.mjs NOT run (time box). camsafe validate 770-969: 492 checks, 492 PASS. Motion gate run (motion_gate.txt): twos 0, linear 0, contact 0;
  1 no_settle (rk_peek cover-up at 966 settles after the stretch end).
- No Rick frame exists in the repo: no side-by-side.
- Row 22: title block U.S.A. ROAD MAP 1970s not in view (it is 14 m away in the SW corner); f775 is dominated by the station roof (camera too close); the
  "town becomes a dot" pull-out is short (A -> B is 1 m). Brass bell/roof caps read black (known set fault).
- Row 23 (EXTREME "cities"): f840 shows the table and horizon above the map and only ~8 stations; the wave reads weakly (KC/St Louis open, red noses in).
  Not "hundreds of doors": the EXTREME does not land yet. Wider/higher B needed (fights the speed gate).
- Row 24: the lime band is a whole-nose switch at 862 (instance colour), not a stroke; the thin Painter faces the lens, not the truck (34 card); gun at x0.15.
- Row 25: every nose lime in f884 but the close shows one station; the glint is a white lift of the instance colour; cloud shadows not built.
- Row 26: f936 Sceptic fist over the eyes reads; the Old-Timer's lunch box not placed (no held3d at this scale).
- Row 27: f956 the peek reads weakly: only the near fist shows (sunk to the mouth), the far fist is behind the body; peekOne face shows one wide eye. Helmet
  drop on "hated" NOT done (rookieDown would hide the eye). Old-Timer helmet pull is at 960 (after the key frame).
- Firemen stand on the station apron, 15 cm tall; card sizes OK, feet + shadows OK in f936/f956.
## Built (files, s4/)
- make_film.py -> film.json (camera v2, camsafe, kit3d pbr/relief, tween ones, face_frames 0, card_shade 0/0, costume_shade keep_drawn_light + smooth 40,
  faces_ep from CAST_KEYS; cast scaled x0.088). moves/ep_s4.mjs: pt_spray, pt_watch, sc_hate, rk_peek, ot_late (clocks from 770; side + front exports).
- sets/s4_map.js wraps sets/map.js unchanged: red noses then ST. LOUIS lime at 862, west -> east lime sweep 870-886 with glint, ST. LOUIS doors open from 840,
  PINE HOLLOW doors up 912-917 on "Plenty", lime mist points at the gun 848-872. Symlinks cast, voice, assets_prod, sets/{map.js, map, assets.js, prop_kit.js}.
- plan_window.py (s2's, offset 770), render_key.sh (one frame per process, --grab canvas), board.py -> BOARD.jpg, key/f_00775/840/860/884/936/956.png.
- Render: 5.8 s per full-size frame (draw 0.8 + grab 5.0) on this map.
## Requests (I edited no sets/, assets_prod/, s1-s3, s8 file)
- set-builder (map): a per-station paint and door control in map.js (story overrides live in s4_map.js now); a partial paint stroke (lime band) on the tiny
  truck; the title block nearer the Midwest or a second one; the stuck DENVER door is not in my view. Known: pale colours, table in wides, brass black.
- character-artist: a Rookie peek pose state where both fists show at the eyes in 3/4 (far fist in front); helmet-drop that keeps one eye.
- props-hero: lunch box and LIME paint can at station scale (x0.088).
- lead: pick a CAMERA_NOTE option; S3 -> S4 cross-fade to the PINE HOLLOW plan; S4 -> S5 starts from F (the firemen close), not from the DALLAS highway glide:
  the S5 builder needs a rise off F to the printed highway (sand blend `places.map.sand` not used in S4).
## LECONS (LECONS_TECHNIQUES.md format; the lead copies)
- 2026-11-21 People on the map: cast at real height would be giants beside 0.76 m station models. Fix: cast height x META truck_scale (0.088), positions on
  map_geo.fold_z + 7 mm (station base minus fold_z). Guard: make_film.py derives both from the set files. Proof: f936/f956 feet on the apron, shadows. FERMÉ
- 2026-11-21 Painters drew in BACK view in the plan. Cause: `look` aimed into the bay, behind them from the lens, so apply_looks turned them away.
  Fix: no `look`, dir only. Guard: debug projection of perf views (head_box) before rendering. Proof: f860 painters in 3/4. FERMÉ
- 2026-11-21 Fist "over the eyes" sat at the mouth. Cause: the big-head puppets have eyes about S - .88 L, not S - .66 L. Fix: eye level S - .88 L, brim S - 1.08 L.
  Guard: board LINE CHECK tile. Proof: f936 Sceptic fist across the eyes. FERMÉ
- 2026-11-21 Map paint/door story timing cannot be set per station in map.js. Fix: s4_map.js calls map.js update() then overwrites instanceColor (2*i+k) and
  door_ii_d scale.y. Guard: comment in s4_map.js. Proof: f860 red noses + lime mist, f884 lime. OUVERT for the set (a per-station API).

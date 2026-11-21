# S5 STATE: THE COUNT, BOARD round (S5/S7 stretch builder, 2026-11-21). Frames 969-1202 (32.30-40.05 s), lines 8-9, plan rows 28-35, Dallas yard, NOON.
## NOT done / wrong (seen in BOARD.jpg or measured)
- No moving clip, no strip, no feet-and-eyes sheet, no lock, no cam_track, no 11i run. frame_checks.mjs NOT run (time box over; it renders). No Rick frame exists in the repo: no side-by-side.
- Plan gates on the window (plan_window.py): 2 FAIL, 6 WARN = NOT 0 FAIL. FAIL 1: whole-body figure height 0.26 (aim 0.45): rows 28-33 share ONE
  framing that must hold the station front, both trucks, both boards and the Clerk (the scene decides; a closer lens loses the trucks and DALLAS).
  FAIL 2: heads in the caption band 9.7 % (the Clerk low in frame during the drop to the headlamp). Real file --window: FAILs of the 969 parked lead-in frames (known, s2 LECONS).
- Row 28: DALLAS FIRE DEPT. is hidden behind the boards in the shared framing (only "DEPT" shows); no map-to-sand blend (S4 side). Trucks roll ("ran") but the
  board does not show it moving; no drivers in the cabs; no sand dust.
- Row 31: the set already has torn YEAR 1 / YEAR 3 leaves lying at the board foot BEFORE "four" (E8 dressing): continuity clash with the leaves that drop.
  Plaster pop not readable in the shared framing (small). Shadow sweeps = 2 `moods` (white edge flash in the kit), not a real sun move.
- Row 32: no close-up on the chalk mark (the camera stays in the shared framing); the Clerk's concentrate face shows the pink tongue (CAST_KEYS _mouth_note).
- Rows 33-35 (first render): the Clerk is OUT of frame on the ladder (f1150, f1168) and UP TO 3x cut by the right edge. Fixed in the camera plan
  (station 1166, lens 26, planned whip to the headlamp). Re-render seen: f1168 the Clerk on the top rung, "3x" readable, "UP TO" small and half behind
  him (needs him 0.3 m right); f1150 his HEAD IS CUT by the bottom edge (head-cut = FAIL, not fixed); f1200 headlamp end OK, no Clerk.
- The ladder climb is a card rising on rung glides (4 steps of 1.2 m in 3 f each): cartoon-fast; feet on treads NOT checked. The 3x is already written
  in the set texture (no live chalk stroke). Hat tip and the long look are in the move but not shown in a key frame.
- Motion gate (motion_gate.txt): twos 2 (f1136, 1147), no_settle 2 (nods 1050-62; the point-back into the first tick 1075-80), linear 0, creep 0,
  arm over-reach 42 px (rig clamps). Plain kit poses 0, frozen moves 0 (one episode move m:../../ep_s5/cl_count).
## Built (files, s5/)
- make_film.py -> film.json (camera v2, camsafe, kit3d pbr/relief/sky, tween ones, face_frames 0, card_shade 0/0, costume_shade keep_drawn_light + smooth 40,
  LITE dallas, boards n1 / ladder off). ONE take: anchor f0 (creep 0), rest 969 (rows 28-33), rise 1166 (row 34), whip down 1202 (headlamp join). CAMERA_NOTE.md.
- moves/ep_s5.mjs (cl_count: ready chalk, nods per leaf, point back at the plasters, ticks, blow, stool, climb, 3x strokes, hat tip, look down; side + front exports),
  studio_ep.mjs + tools/check_motion_ep.mjs (copies of s2's; run with GATE_SHEET=firetrucks.mjs GATE_MOVES=ep_s5.mjs).
- sets/s5_dallas.js (wraps sets/dallas.js unchanged): trucks roll out on "ran" (992-1024, wheels turn, stop dip); YEAR 1-3 leaves fall on "four"; 4 plasters
  (assets plaster.glb on the trucks' plaster anchors) pop; red boards 2 and 3 drop on (1136, 1155); OWN stool (1126) and OWN sectioned ladder at the RIGHT edge
  of the red stack (section A swings up on "hit" 1144, B clacks on 1157-1161); buildChalk (held3d); the paint-frame workaround of s1.
- Symlinks: cast, voice, assets_prod, sets/{dallas.js, dallas, assets.js, prop_kit.js}. plan_window.py (s2's, OFF = film start, drops the f0 anchor).
- render_each.sh (one frame per process, --grab canvas), board.py -> BOARD.jpg, key/f_*.png (984 1040 1086 1150 1168 1200).
## Numbers
- Render: 19.7 s per full-size frame (draw 3.3 + grab 16.5) at load ~4. camsafe validate --frames 969-1202: 234 checks, PASS 192, WARN 42 (low camera), FAIL 0.
- WINDOW speed p90 18.9 px/f, peak 20.3 (plan estimate) before the whip; the whip adds a peak (see plan_check.txt).
## Requests (not done by me; no sets/ or assets_prod/ file edited)
- set-builder: (1) the set ladder covers UP TO 3x and RED: I switch it off and use my own; move it to the stack's right edge (x -0.1, foot y 6.95) or
  add a ladder_x switch; (2) remove the loose YEAR leaves at the board foot (or a leaves_on_ground switch) - they clash with row 31; (3) apron reads warm sand,
  not pale concrete; (4) far skyline/derrick/water tank do not show; (5) a place.still switch; (6) the station front sign is low behind the boards from the yard.
- props-hero: buildTruck should set uInvRoot itself (workaround copied again); a live chalk-stroke decal for the 3x; drivers' heads in the cabs for "ran".
- character-artist / lead: the concentrate face shows the tongue (rule needed); a ladder-climb library move with feet on treads.
- lead: OK the planned whip into the headlamp at the place change (camera v2 gives the drop 30 f), or ask S6 to start its push from the 3x framing.
## LECONS (LECONS_TECHNIQUES.md format; the lead copies)
- 2026-11-21 plan_window.py (from s2) read 4 % "at rest" on a 4.9 s hold. Cause: the f0 lead-in anchor shifted to f-969 in the window copy and its
  default creep (0.0028) carried into the window's first rest. Fix: plan_window drops stations before the window; the anchor gets creep 0.
  Guard: the comment in plan_window.py. Proof: at rest 4.3 % -> 41-59 %, real camera at 969 unchanged. FERMÉ
- 2026-11-21 Camera v2 stretched the travel out of a short rest and the camera was not on UP TO 3x on "three" (it had left at 1151 for the headlamp).
  Cause: v2 wants 1.5 s + 0.25 s/m per travel and starts it early from the previous rest. Fix: the drop to the headlamp is a whip (place change), the 3x station
  at 1166. Guard: print camera_baked state at the word frames before rendering. Proof: f1168 state rest at the 3x framing. FERMÉ (picture: BOARD.jpg)
- 2026-11-21 Mid-stretch "rest creep" sits on a knife edge between two gates (at rest < 2 px/f >= 30 % and speed median about 4): creep .0012 -> median FAIL,
  .0021 -> at-rest FAIL, .0018 passes both. Guard: try 3 creep values in one loop (make_film + bake + plan_window). OUVERT for the tool (a window-aware gate).

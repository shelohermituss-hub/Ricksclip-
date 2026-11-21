# S6 STATE: THE ANSWER, BOARD round (S6 stretch builder, 2026-11-21). Frames 1202-1576 (40.05-52.54 s), plan rows 36-48, lines 10-12. BOARD.jpg = 13 key frames.
## NOT done / wrong (seen in BOARD.jpg, my own list)
- Board only: no clip, no polish, looked at by me only. No Rick frame exists in the repo: no side-by-side (RULE NO. 1 test open).
- PLAN GATES ARE NOT 0 FAIL: plan_window.py = 7 FAIL / 5 WARN (plan_check_window.txt). I rendered anyway, against the brief. Structural: "cuts per 10 s" 2.4 (four
  places = four takes; the kit has no blend between takes, so the plan's three "blend on motion" joins count as cuts), "face in the first 5 s" (the stretch opens in a
  room with no cast). Mine to fix: speed p90 37.9 (the piece-11 flights), figure height .15 / feet .60 (cast small), shot mix, "camera around a figure, view fixed" (1).
- Hand-set "travel" on 5 stations (rule: only for whips): the three piece-11 flights use the plan's own 27/23/28 frames; park G 1.2 s, H .9 s and cross J 1.5 s
  keep the rests (v2 wants 1.5 s + .25 s/m and would flow the rows through). Camera lead to decide.
- frame_checks (rests + moving rows): park 10 FAIL, cross 9 FAIL (frame_checks_*.txt). Drivers: Sceptic and Rookie cards stand INSIDE the cabs (73-100 % body_in_mesh,
  not seen in the frames: hidden by the cab, so the Rookie is NOT visible at the wheel in any key, row 46 fails); slides = cards riding the trucks / Kid run (card glide);
  Kid in the LITE tufts; Milkman face_covered by the van pillar f1470-1514; his feet float 23 cm at f1560. camsafe: park 121/121 PASS, cross 106/106 PASS.
- Signature: the headlamp chrome is a matcap ring I lay over the asset rim (kit has no env map); the window is a flat picture (top edge shows as a navy band at f1303);
  the inverted flash frame, the relay clacks/sparks, the lamp-glass ripple and the toy in the hero's fist going grey are NOT built; the room-to-park exit is a cut.
- Line 11: the sun SHAFT is not readable (spot + additive beam invisible against the bright sky); the grey drain is uniform, not a nose-to-tail wipe (assets.js has one
  uDrain); f1401 the throw is not readable (ball not seen in the air); EXTREME f1452 reads thin: 10 coded grey shapes, dark and small, half hidden in the grass.
- Line 12: f1484 is M not CLOSE on his face; f1524 the lemon truck glows but sits behind the van body; f1565 POWER 4 field + aura work, but the toast (bottle up) is
  not readable, the Milkman is cut by the right edge, Rookie hidden in the cab. Row 47 (boot on the brake) has no key. The S6->S7 door panel on "And" is NOT staged.
- Key labels: f1233/1236 land on "light"/"gets" (the 27-frame push starts on "YOU" 1207 and lands at 1234).
## Built (files)
- `make_film.py` -> `film.json` (camera v2, camsafe, kit3d, tween ones, face_frames 0, card_shade 0/0, costume_shade keep_drawn_light + smooth 40, faces_ep from
  CAST_KEYS) + `film_<dal|eye|park|cross>.json` (the same film cut to one take, with a first-station anchor at f0: one place per render process). `--proj` = pinhole check.
- `sets/s6_world.js` (wraps dallas.js / town.js unchanged): dal = S5's yard + chrome matcap rim on the headlamp; park = red pumper rolling west (TXP), sun shaft, paint
  drain 1347-1368, the coded red ball (seam, star, grass stain) thrown 1394, grey 1408-1414, 10 lost grey things; cross = van on S3's mark (S3 cream workaround),
  lemon truck (TXC, two linear runs), lemon spill + point light, POWER 4 plum focus field + aura on 2s from 1556. Lamp room = sets/lamproom.js unchanged (keys: dim 1243,
  iris .55 by 1255, wave 1/2/3/4 at 1280/1283/1286/1289, iris 1.0 by 1300).
- `moves/ep_s6.mjs`: kid_park, mk_cross, rk_cab, sc_park (STUDIO MOTION, no kit pose, no frozen move). `moves/studio_ep.mjs` = S3's copy.
- `CAMERA_NOTE.md`, `render_keys.sh` (bakes each place copy, one frame per process, memory wait), `tools/render_s6.mjs` (S3's 240 s grab copy), `proj_s6.py`
  (baked-camera projection per place), `plan_window.py` (S2's, OFF 1202), `board.py`. Symlinks: cast, voice, assets_prod, sets/{town,dallas,lamproom}(.js), assets.js, prop_kit.js.
## Numbers
- Render: 4.5-42 s per full-size frame (lamp room 4-12 s, Dallas 22-27, park 13-28, crossing 22-42); 0 memory kills in 31 renders.
- check_midline_comments.py: 0 suspect lines before every render.
## Requests (not done by me)
- Kit owner: a blend between takes (place change on motion) so the plan's joins are not cuts; a seated/hidden-legs driver card (body_in_mesh exemption or seat mode).
- Props-hero: the red ball, the lost things (wagon, kite, boot, watering can, tricycle) as assets; the drain as a nose-to-tail wipe uniform; the plate "LIBAU" still shows.
- Set-builder (lamproom): window picture larger than the view at the exit (navy band); a chrome env for the kit. (town): a worn patch where the ball rests (tufts hide it).
- Lead / camera-director: the S6->S7 door-panel pass; whether line 12 row 45 may be M; who stages the window -> park blend.
## LECONS (LECONS_TECHNIQUES.md format; the lead copies)
- 2026-11-21 (S6) A one-place film copy that starts mid-film baked its first station as a flowed-through travel (camera at the exit at f1236). Cause: film_plan bakes
  from frame 0; the take's first station was the first point. Fix: make_film.py prepends a copy of the first station at at=0 in every film_<place>.json. Guard: proj_s6.py
  prints state/pos per key frame before rendering. Proof: f1236 = CAM_ENTRY rest (BOARD). FERME
- 2026-11-21 (S6) Two of my stations were silently flowed through (cross I f1470, park F): v2 wants 1.5 s + .25 s/m of travel, rows were 1-1.5 s apart. Fix: hand-set
  travel (flagged above). Guard: grep "flowed through" in logs/bake_<place>.txt. Proof: f1484 rest on the Milkman. OUVERT (camera lead: travel rule vs dense rows).
- 2026-11-21 (S6) Kit chrome at 0.3 m read as a black disc (no env map). Fix: MeshMatcapMaterial ring + faint glass sheen over the asset rim (s6_world.js dal). Guard:
  comment in the code. Proof: f1233. FERME for the board; Blender final needs none.
- 2026-11-21 (S6) Key frames on a word must be ceil(word start x 30): 44.38 s x 30 = 1331.4, so f1331 is still "bright". Guard: board.py prints the word on the frame.

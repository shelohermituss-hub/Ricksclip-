# S1 STATE: THE HOOK, key frames v2 (S1 stretch builder, 2026-11-20). Frames 0-288 (0.00-9.60 s), plan rows 1-8, yard, MORNING.
## NOT done (stopped on the lead's order "short rounds": key frames only)
- No moving clip, no S1_hook.mp4, no 4 fps strip, no feet-and-eyes sheet, no lock export. frame_checks / camsafe validate / cam_track / 11i NOT run (they run on the clip).
- Key frames v2 are looked at by me only. No Rick frame available: no side-by-side.
## Built (files)
- `make_film.py` -> `film.json` (camera v2, camsafe, kit3d, tween ones, face_frames 0, card_shade 0/0, costume_shade keep_drawn_light + smooth 40, faces_ep from CAST_KEYS).
  One stretch, ONE take, 4 stations (CAMERA_NOTE.md: idea, move ids, attention chain). Chief lip sync `say [19,28]` (6.66-9.42).
- `moves/ep_s1.mjs` (6 episode moves, STUDIO MOTION: he_spray, ch_burst, rk_frozen, rk_jump, ot_frozen, sc_crossed), `moves/studio_ep.mjs` (copy of fake-surgery s4),
  `moves/tools/check_motion_ep.mjs` (one line changed: 'q2' -> 'hero').
- `sets/s1_yard.js` (new): wraps sets/town.js unchanged; adds compressor, per-frame air hose (outlet -> left fist -> gun inlet), lemon tin, stool with scissors, lunch box + lemon
  (hop on "red", roll to the lens, wobble), spray mist, paint EDGE advancing (truck x -1.55 -> -2.85, f0-116), POWER 1 (impact frame f172-174 navy/white
  with focus lines behind the Chief, steam, shockwave ring piece 18 in yard colours, kick f172), stamp dust. `sets/power/` = copy of templates/pieces/fx/power.
- Symlinks in s1/ (the render server serves the film folder only): cast, voice, assets_prod, sets/{town.js, assets.js, prop_kit.js, town}.
- `render_s1.sh`: the ONE background command for the clip (2 parallel chunks with captions -> run_stretch.sh -> camsafe -> motion gate -> mp4). Not run to the end (stopped).
- Key frames: `key/f_00000/00060/00168/00172/00272.png` (1080x1920, no captions), sheet `key/KEYFRAMES_v2.jpg` (1600 wide).
## Numbers
- film_plan.py check --window 0-288: 0 FAIL, 4 WARN of 44 (reasons in CAMERA_NOTE.md). Window speed p90 14.2, peak 15.0 px/f (plan estimate). At rest 51.6 %.
- Motion gate: all 6 moves twos 0, linear 0, no_settle 0, creep 0; arm over-reach 14-15 px (clamped by the rig); planted-foot slide 0.
- Plain kit poses 0, frozen moves 0 (every act is m:../../ep_s1/...).
- Render cost measured: 12.7-16 s per full-size frame (grab 11-14 s). --scale 0.5 costs the same. Full clip estimate about 60 min single, ~35-40 min in 2 chunks (not measured).
## Fixed between v1 and v2 (seen in the pictures)
- Cards and props were 14 cm under the yard concrete (yard top z 0.14): every position and camera +0.14; the lemon frame's "broken ground strip" was the camera under the slab.
- White band crossing the hero = the truck's ribbon (`ribbon: true`): it stands far off the body. Ribbon OFF in S1 (see requests).
- f172 impact frame had no Chief (camera still on the hero): the flight now lands on him at f165, 7 quiet frames before "exploded".
- f272 lemon truck rendered aged red: assets.js paint-frame culling bug, worked around in s1_yard.js (LECONS_TECHNIQUES.md).
## Weak points still in the frames (my own list)
- f168: the Chief does not visibly burst OUT of bay 2: the bay mouth is behind/right, he reads as already in the yard. Needs the camera to land 4-6 f earlier or a start inside the lit bay.
- Helmet jump and moustache-out of POWER 1 are NOT possible (helmet and moustache are drawn in the locked cast): the whole Chief jumps instead, steam reads weakly on white.
- "brand new" X1 is now only price card + stool with scissors (no ribbon, no bow). The wide (row 4) is a flowed-through pass, not a rest.
- The lunch box reads white/grey, not navy; the scanned lemon reads orange-yellow next to the lime truck; Old-Timer has no sandwich prop (empty fist at the mouth).
- Row 2 "grabbed": the left fist snapping onto the hose is small in the frame-0 rest; the sweep cannot travel along the truck (it is depth for a side card).
- Rookie: helmet-over-eyes card swaps to the normal card mid-hop at f164 (a step, by design; check it moving).
## Requests (not done by me)
- props-hero: ribbon must hug the truck body (it crosses the yard 1 m off the side); buildTruck should set uInvRoot itself (culling bug); lunch box navy; lemon nearer #E3EA22.
- character-artist: a Chief "helmet up" state (hatDrop about -60) and a moustache-out state for POWER 1; a sandwich for the Old-Timer.
- from_lock / Blender: the set is a GLB (town.glb, kit-decimated trees 6 %, grass 30 %); from_lock imports out/lock/sets/<place>.glb, so it would rebuild the DECIMATED town.
  Better: append sets/town/out/town.blend and take only camera, cards and motion from the lock. Not in the lock as TRS: the paint EDGE (shader uniform; drive
  truck_api.set_paint(edge) per frame with EDGE(f) of s1_yard.js), the hose (a new tube every frame), the shockwave ring (vertex updates), the impact-frame texture swap.

# S1 STATE: THE HOOK, moving clip v1 (S1 stretch builder, 2026-11-21). Frames 0-288 (0.00-9.60 s), plan rows 1-8, yard, MORNING, LITE town.
## NOT done / failing (the clip is NOT ready for the user)
- frame_checks 12 FAIL / 3 WARN / 22 PASS (out/fc/frame_checks.md): firemen cut by the LEFT edge in the Chief rest (f165-288: Old-Timer, Sceptic, Rookie);
  hero + rookieDown cut during the flight f130-148; Chief slide 33 cm/f during the 10-frame burst glide (f161-170); Chief cut by the right edge at f157 (first frame visible).
- cam_track p90 26.1 px/f (FAIL, <= 22), move peak median 26.6. The plan estimated 15.2: the via-point flight A -> wide -> Chief (f54-165) is faster on screen than planned.
- Row 5 MISSED: the flight leaves the hero at f120; f128-152 frame an empty bay wall ("lemon", "yellow": his judging pose is not seen).
- f200: a black rectangle at the top of the frame (strip sheet), not diagnosed (one frame; steam sprites or a broken retry render).
- Lock export, Blender: not done (lead's order).
## Built (files)
- `make_film.py` -> `film.json` (places.yard: lite true, truckFull true, chief light; camera v2, camsafe, kit3d, tween ones, face_frames 0, card_shade 0/0,
  costume_shade keep_drawn_light + smooth 40). `CAMERA_NOTE.md` (idea, move ids, attention chain). `moves/ep_s1.mjs` (6 moves). `sets/s1_yard.js`.
- `render_s1.sh` (2 chunks with captions -> run_stretch -> camsafe -> motion gate -> mp4 -> sheets); `finish_s1.sh` (renders missing frames one by one with retries, then the same).
- Deliverables: `S1_hook.mp4` (1080x1920, 9.63 s, voice + captions), `S1_strip_4fps.jpg`, `S1_feet_eyes.jpg`, `key/KEYFRAMES_v2.jpg`, frames in `frames/` (git-ignored).
## Numbers
- Seconds per frame, LITE + full hero truck, 2 frames (f162, f176), 1080x1920: 13.0 s (draw 2.0 + grab 11.0). Full town was 12.7-16 s: the screenshot grab dominates.
  Clip: 274 frames in 2290 s in 2 chunks (= 8.4 s/frame wall) while other helpers ran 3-4 Blender proofs (load average 20 on 4 CPUs); chunk A crashed at f130
  (screenshot timeout 30 s / target crashed), f130-144 needed up to 4 retries one frame at a time.
- film_plan check --window 0-288: 0 FAIL, 3 WARN. camsafe validate: 1288 checks, PASS 1288, 0 FAIL. Motion gate: 6 moves, twos 0, linear 0, no-settle 0, creep 0.
- 11i detail (density_check, 4 frames, captions burned in): G1 edge .25 / .29 / .19 / .25 (median ~.25 >= .14 PASS).
- cam_track: speed median 8.8, p90 26.1, cuts 0, hold 0.7 %, drift 30.9 %, move 68.4 %.
## Fixed this round (seen in pictures)
- The Chief comes out of the bay 2 doorway beside his red pumper (visible from f157, burst on "chief"); camera aim at f165 moved right to (1.1, 17.6).
- Steam grey-blue (#b9c4da), shown from f175 (after the impact frame), reads on the wall. Lunch box: its enamel_navy material rendered white
  (white base colour with a map that did not show) -> repainted #22325e in s1_yard.js (asset untouched). Shockwave ring radius 3.4 -> 2.2 (it rolled over the lens).
## Next fix round (cheap, in this order)
1. Camera: give the wide its own rest (f100-140, hero judging in frame) and move the Chief station later (f175), or split the A->C flight; re-check p90 <= 22.
2. Chief rest framing: wider aim or firemen moved right so they are whole; start the Chief one step inside the frame (f157); burst as a walk with planted feet (no glide).
3. Diagnose f200 black box (re-render f195-205).
## Weak points (unchanged from v2)
- POWER 1 helmet jump / moustache out impossible on the locked cast (whole-body jump instead). No ribbon (props-hero request). Lemon reads orange next to the lime truck.
- Requests: props-hero (ribbon hugging the body, uInvRoot set in buildTruck, lunch box material), character-artist (Chief helmet-up and moustache-out states).
- from_lock note: the lock would carry the LITE/decimated town; Blender should append sets/town/out/town.blend; paint edge EDGE(f), hose, ring and impact texture are not TRS (re-drive them).

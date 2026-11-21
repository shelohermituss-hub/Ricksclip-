# S1 STATE: THE HOOK, fix round 1 (2026-11-21). HALF-SIZE DRAFT clip (540x960; user rule 2026-11-21: drafts at --scale 0.5).
## NOT done / failing (fix round 1)
- frame_checks 8 FAIL / 1 WARN / 28 PASS: every FAIL is a figure crossing the LEFT edge while the camera moves: hero f150-185 (the push from the wide
  to the Chief), Old-Timer f178-186, Rookie, Sceptic f250-259 (the sink to the lemon). Rests: no cuts. Fixing it needs flights that keep the people in frame.
- cam_track p90 27.6 px/f (FAIL, <= 22), measured on the 540-wide draft video; peak median 20.7 (was 26.6). Plan estimate 15.9. Main cost: the 6.3 m push f158-215.
- Row 5 is now in a rest (wide f110-158, hero judging on "lemon") but the hero is SMALL at the left; the wide is mostly the station wall and empty yard.
- Lock export and Blender: not done (lead's order).
## Fix round 1 (done, seen on the strip S1_strip_4fps.jpg)
- Camera: 4 stations A f0 (hook rest 0-48) -> W f110 wide REST to f158 (row 5) -> D f215 Chief rest (stamp f223 in the rest) -> F f276 lemon. Plan 0 FAIL / 5 WARN.
- Chief: no glide any more; he bursts out IN the bay 2 mouth (2.45, 19.1) and stomps in place (planted feet; slide FAIL gone). Lunch box moved to his boots (2.2, 18.4),
  lemon rolls to (3.3, 13.7). D frame: Chief, his red pumper behind his shoulder, lunch box; firemen out of frame (not cut). F: lemon, lemon truck, firemen whole, his point.
- Black square f200: NaN steam opacity ((1-a)**1.1 with a > 1), clamped; gone on the strip. LECONS added (and the swallowed-line edit that broke every frame once).
- Frames: 0-124 were rendered full size before the half-size rule; kept in frames_full/ and downscaled into frames/; 125-288 rendered at half size.
  Half size, --grab fast, ONE process: 2.9 s/frame (106 frames in 306 s). One process per frame cost about 3 min/frame (browser start-up): never again.
- Gates: camsafe 1288 PASS / 0 FAIL; motion gate 6 moves 0/0/0/0; 11i edge .256/.273/.180/.167 (PASS); S1_hook.mp4 9.63 s with voice + captions (half-size draft).

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

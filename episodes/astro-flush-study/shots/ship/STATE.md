# ship stretch STATE (round 1, 2026-11-22, stretch builder ship). PRIVATE study. Not committed.
Files: make_film.py -> s2 (start 29, end 141), s7 (531, 713), s8 (706, 771), s9 (763, 803), s11 (867, 1007) film.json + caps_his.json; moves/ep_ship.mjs (nav7, ng11);
stage/ship_stage.js = thin wrapper on sets/ship.js, no geometry: Earth placed 450 m from the camera on its true ray (stage.earth keys = real far place, Catmull-Rom),
sky_dome follows the camera, comm_lamp_on pulse, float_cup/book/pencil drift. ship.js keys written for EVERY frame. render_all.sh (scale 0.35, time box), post.sh.
Frames: film f = his f; each film starts at f0 with the camera parked on a pre-roll station (never rendered), the travel leaves 10-20 f before "start".
Blur: kit DOF off with places.ship.post = {"dof": 0, "dust": 0, "bloom": 0.5, "vignette": 0} (film.js lookCfg: per-place post overrides film post; film post set the same).
Pins on fitted cams: s2 f40, f70; s7 f600; s9 f790; s11 f880, f990. Set's non-fitted cams pinned: f110, f740. BY EYE: s2 f29, f36, f58, f88, f140; s7 f540, f555, f630, f680
(the set's by-eye f680 cam was too far/high in the kit: moved 42 % closer), f712; s8 f706, f770; s9 f763, f802; s11 f867, f900, f930, f960, f1006.
Rolls: s7 0.4 -> 14 (board). s11: f990 kept on the fit's 9.5, so total roll is ~10, not the board's 22 (the fit and the board disagree).

## Checks (round 1)
- film_plan check: s2 13 FAIL, s7 13, s8 14, s9 13, s11 13: same whole-film gates as mc/toilet (speed/dead still counted over the parked pre-roll, head size/caption band,
  shot mix, effects/acting per 10 s). Not fixed.
- check_objects: s2 8 FAIL: CAMERA + sky_dome JUMP f38-39 (746 cm in one step: his own pull-back is exponential, 4.6 m at f36 -> 25 m at f40, cam f40 fitted) and f70-71;
  flame_* JUMP f98 (ignition from scale 0). s7 1 FAIL (navigator.handR, arms-out at 624). s8, s9, s11 0 FAIL.
- check_collide: 0 FAIL all (s7 3 WARN).
- camsafe: s7 73 FAIL f640+ VIEW_MISMATCH (move turns her to 3/4 as the camera goes round; camsafe asks front); others 0 FAIL.
- frame_checks: NOT RUN (renders compete with the drafts; time box).

## Fluidity (fluidity_clean.py; held / pops / jerk)
| range | ours | his |
|---|---|---|
| s11 f867-997 | 0.008 / 0.000 / 0.108 | 0.008 / 0.000 / 0.040 |
Others: drafts still rendering at hand-off (render.done lists finished shots); then `SPECS=... bash post.sh`.

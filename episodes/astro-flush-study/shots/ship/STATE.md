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

## ROUND 2 (2026-11-22, ship staging helper, on the set's round 8; set files untouched)
make_film.py now reads round 8 META: kit roll = -META roll (film.js + roll = picture CCW; META cams.f680 note), checked in picture (f990 nose lower right as his);
s2 f70 needs +4 deg by eye on top (R70_EYE). s11 f990 = META cams.f990 (+Y side, below, kit -189.15): the travel turns the picture ~190 deg f880-990 as his
(his f911 roof up, f951 roof lower right); stations f900 (porthole_b stays centred, straight pull back as his f889-900), f930, f960 (= f990 cam 4 m closer) by eye.
Light kinds per shot as keys: s2/s11 'space' (+ proofs sun_dir/sun_k, f990 earth_term), s7 'map' (by eye: 'warm' and 'space' paint the slat walls and roof beige),
wash .001, sun to f680 dir, sun_k 2.5, radio_desk 0 / shot 7; s8 'map'; s9 'radio'. Fan -44 at f990 (sign as META). Glitter trail fades in f935-968 (per-sparkle).
Flame: preglow f84-94, flame eased from f94 (no scale-0 pop at ignition), full value 1.6 (longer), flame_w 0.8, flame_w .001 when there is no flame (the purple
nozzle disc at f40 and in s11 is gone). New guy: META anchor newguy_s11 + 0.3 m up, card .85, face k:smug (his smirk; afSweat is a gasp), slide .35 m sideways
+ .6 m deeper (at .9 / .55 he entered porthole_b_room_walls, collide FAIL), hidden f884 (behind the wall in picture).
IMPORTANT: run film_plan check after every make_film.py: the renderer uses out/plan/camera_baked.json (a stale bake renders the OLD camera).
Proof sheet: references/look_match/astro_flush/work/proof/ship/round2_keys.jpg (ours | his).

### Still different from his, worst first (seen on the round 2 sheet and the s11 4 fps strip)
0. s11 f935-955 (strip): the travel f930 -> f960 swings: hull fills the frame nearly vertical, then snaps to the diagonal (the ~170 deg roll and
   the look point both change in 30 f). His frames reach the final diagonal by ~f945 from mid distance. Next: an f945 station on the f960 line, f930 farther out.
1. s11 f960-990: no glitter cloud at all (also at --scale 1, f990 full frame): SET (glitter meshes / shader in the kit). Ship shows its navy belly where he shows the grey
   side+roof with LODESTAR: the f990 fit sees the belly (fit or mirror question for the set).
2. s7 f640/f680: the canopy glass is invisible in the kit (no glass faces/edges); our camera reads "inside under the roof". SET (glass material) + camera by eye.
3. s7 f600: map light = dark grey walls like his but the whole picture too dark; his walls lit cool grey with stars behind. No light kind gives cool interior light.
4. s2 f98-118: plume long and purple but no white core, harder edges; his is soft white-hot. SET (flame materials). Earth too green (texture) SET.
5. s11 f900-930: our hull has a white roof box and LODESTAR sits further +X than his (his text is over porthole_b): SET geometry; our f930 is closer than his.
6. s2 f40: our camera sees more roof than his fitted frame; f110 ship turned less toward the lens than his.
7. s9 f790: radio console layout/colour (red wash) differs: SET.

### Checks (round 2)
- film_plan check: s2 13 FAIL, s7 13, s8 14, s9 13, s11 14: the whole-film gates as round 1; s11 adds roll rate peak 8.1 deg/f (his own turn of ~135 deg f911-951).
- check_objects: s2 23 FAIL: CAMERA + sky_dome JUMP f38-39, f70-71 (his exponential pull-back, as round 1); flame_* JUMP f83-84 (flame_w .001 -> ramp, sub-pixel),
  f86, f96-97, f99 (ignition growth; his flame_on is f96-100, 4 f). s7 1 FAIL navigator.handR f640 (front -> 34 view swap in nav7, rule 7: open). s8, s9 0.
  s11 2 FAIL newguy head/feet JUMP f878 (slide start; his slide is 8 f) + 4 WARN POP f884 (hidden behind the wall).
- check_collide: all 0 FAIL (s7 6 WARN float_cup / canopy_bars, s11 WARN belt/porthole boxes).

## Fluidity round 2 (post.sh, scale 0.5; held / pops / jerk)
| shot range | ours | his |
|---|---|---|
| s2 f36-119 | 0.000 / 0.048 / 0.148 | 0.096 / 0.000 / 0.093 |
| s7 f538-705 | 0.000 / 0.000 / 0.068 | 0.000 / 0.000 / 0.055 |
| s8 f713-762 | 0.000 / 0.000 / 0.054 | 0.000 / 0.143 / 0.093 |
| s9 f771-802 | 0.000 / 0.033 / 0.197 | 0.033 / 0.033 / 0.196 |
| s11 f867-997 | 0.069 / 0.054 / 0.105 | 0.008 / 0.000 / 0.040 |
Drafts: references/look_match/astro_flush/work/drafts/ship/<shot>_{ours,his,sbs}.mp4 and _strip.jpg.

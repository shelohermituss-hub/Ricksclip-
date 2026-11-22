# toilet stretch STATE (round 1, 2026-11-22). PRIVATE study. Not committed.
Files: make_film.py (+ card_scale.json) -> s1/film.json (shot 1, start 0, end 42: f0-41), s6/film.json (start 495, end 538), s12/film.json (start 998, end 1200: shot 12,
the 12->13 move, shot 13; take s12 f998-1175 + take s13 f1176-1199, cut in the dark of the flange). moves/ep_toilet.mjs (ng1, ng6, cmd12, ng12).
stage/toilet_stage.js = thin wrapper on sets/toilet.js (no geometry): camera near plane through the porthole wall f<=34, flush lever, paper roll drift + pull,
ribbon drawn into the bowl, exploded view part by part (own delay each). toilet.js keys (light/glow/door/hatch/pulse/paper) are written for EVERY frame
(toilet.js leaves a hole where a key lacks a value). Frames: film f = his f; each film starts at f0, pre-roll parked (never rendered), "start" = first rendered frame
(shot 1 renders from f0: its travel starts eased at f0). render_all.sh, post.sh (mp4s + fluidity rows).

## Checks (round 1, after the face fix)
- film_plan check: s1 6 FAIL, s6 9 FAIL, s12 14 FAIL: whole-film gates (rests per 10 s, shot mix, mood/effects per minute, head width) + camera peak px/f
  (s1 pull-back = his 0.72/frame scale; s12 = the take cut f1176 and the dive). Not fixed; explained.
- check_objects: s1 6 FAIL (lever 3-frame press f8-10 and its return; roll pull f13-16; camera fov steps f30/35/37 at the porthole pins), s6 3 FAIL (lever f507; handR f515),
  s12 27 FAIL (every exploded part: ease-OUT cubic puts 35-45 % of the move in its first frame f1098-1103; hatch_panel; hands f1057/f1097; camera f1176 cut).
- check_collide: 0 FAIL on all three (s12 26 WARN).
- frame_checks: s1 1 FAIL (seat: newguy hips "above toilet_seat" f0: he stands beside it, false hit), s6 0, s12 0.
- camsafe: s1 0, s6 0, s12 5 FAIL (f1097 VIEW_MISMATCH: the move asks 3/4 for the profile turn, the camera wants front).

## Fluidity (fluidity_clean.py, same frame ranges; held / pops / jerk)
| range | ours | his |
|---|---|---|
| s1 f0-34 | 0.000 / 0.147 / 0.268 | 0.000 / 0.147 / 0.233 |
| s6 f500-530 | 0.000 / 0.033 / 0.322 | 0.000 / 0.000 / 0.250 |
| s12 f1007-1113 | 0.019 / 0.000 / 0.088 | 0.000 / 0.000 / 0.071 |
| s12 f1114-1175 (12->13 + 13) | 0.033 / 0.000 / 0.232 | 0.000 / 0.000 / 0.070 |
Ours is worse than his on jerk everywhere and on pops in s6.

Mp4s: references/look_match/astro_flush/work/drafts/toilet/{s1,s6,s12}_{ours,his,sbs}.mp4 + _strip.jpg.

## For the set builder
1. No opening behind the WASTE LINE hatch down to the under-floor bay: the dive crosses the floor slab (dark frames f1137-1140).
2. Shot 13 to the tube is a cut (tube is 30 m away at y -26..-34): a nozzle/tube entry that continues from the flange would make it one move.
3. Flush swirl in the bowl (his f24-28) and a bowl target for the ribbon: not in the set. Ribbon geometry is world-placed at origin, so it can only be scaled into the bowl.
4. Shot 6: no floor glow strip / halo; shot 12: the wide key light beside the toilet blooms into a white blob (bloom lowered to .35 here, still visible); f1170 the flange
   area blows out white (pulse light + bloom) where his shows the WASTE VENT sign and flange.
5. Shot 1 f37+: outside the porthole is only the black wall slab (the hull/Earth are the ship place: lead's join).

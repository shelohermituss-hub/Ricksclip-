# cabin stretch STATE (round 1, 2026-11-22, stretch builder cabin). PRIVATE study. Not committed.
Files: make_film.py (+ proj.py) -> cab4/film.json (shot 4, start 284, end 423 = f284-422) and bay5/film.json (shot 5, start 411, end 500 = f411-499);
moves/ep_cab.mjs (6 episode moves); stage/cab_stage.js = thin wrapper of sets/cabin.js (no geometry): moves the set's movers BY NAME every frame
(magazine, drink_ball on the new guy's hands, clipboard + pencil on the navigator's, via window.handWorld; magazine tossed f392, drink let go f396;
float_* drift in the bay). Each film has sets/ = links to cabin.js, cabin/, vendor/ + cab_stage.js; links cast, moves, refs.
Frames: film frame f = his frame f. Films run from f0 (pre-roll parked, never rendered), "start" = first rendered frame (offset, as mc).
Cameras: the set's fitted cams f284/f300/f330/f390 and f430/f460/f490 (lens 18/tan(vfov/2)); f300 and f430 are catmull "via" points of one eased move
(hold-0 vias were flowed and missed the frame), so the camera at f300 is 0.5 m behind the fit.
Size: card scale shot 4 = 1.21 all three; shot 5 navigator .82, commander 1.0, new guy .91; positions from his head centre unprojected on planes y .7 (cabin) / 1.0 (bags).
Expected head height vs his (plan math): f330/f390 within 7 %; f300 new guy -4 %, commander -9 %; f430/460/490 new guy within 3 %; commander f460 +33 % (edge, unsure).
Render: half size, 2.0 s/f (cab4 139 f), 1.5 s/f (bay5 89 f). Draft mp4s: references/look_match/astro_flush/work/drafts/cabin/.

## Checks (round 1)
- film_plan --window: cab4 12 FAIL 10 WARN, bay5 11 FAIL 3 WARN (plan_check.txt): whole-film gates over the pre-roll (face first, shot mix, effects, mood) as in mc;
  cab4 window p90 23.8 px/f (> 22) = his pull-back (peak 4.3 % H/f); bay5 window PASS.
- check_objects: cab4 FAIL feet/hands of newguy, commander (dangle swing), cabin/drink_ball (jump at the release f396); bay5 FAIL newguy feet/head/hands (slide out 457-474). CAMERA PASS both.
- check_collide: cab4 5 FAIL (bodies in cabin_quilt_backing/wall f288-302 = the f300 cheat marks near the wall); bay5 FAIL sleepers inside bay_wall_backing and their bags (meant: inside the bags, but the wall too).
- frame_checks: cab4 4 FAIL (feet float = weightless, by the brief; commander in quilt f275-389 31 %); bay5 FAIL face_covered navigator/commander (heads behind the bag fronts, see below), body_in_mesh.
- camsafe: cab4 547 FAIL VIEW_MISMATCH (moves draw 3/4 for commander/navigator, the camsafe asks front); bay5 6 FAIL (f474 new guy 3/4).

## Fluidity (fluidity_clean.py, clean shot range, same frames)
| shot | range | ours held / pops / jerk / chroma | his |
|---|---|---|---|
| 4 | f284-410 | 0.064 / 0.016 / 0.094 / 0.0038 | 0.008 / 0.246 / 0.095 / 0.0061 |
| 5 | f423-494 | 0.014 / 0.000 / 0.119 / 0.0045 | 0.000 / 0.000 / 0.068 / 0.0046 |

## For the set builder
- Bags: the sleepers' heads are hidden. The bag tops are above the head height his frames give (head centres z 2.24-2.40 at y 1.0); the bags need a collar/opening
  at about z 2.1 that a card at y ~1.0 shows through, or tell us the plane inside the bag (anchor) where the head clears the collar.
- Sleep mask for the navigator: not in the cast (head_wear sleepMask is "pushed up"); needs a character-artist variant.

## Round 2 (2026-11-22, coordinator's 5 points + MOTION RULES) - render 2c started, NOT yet checked
- Camera: ONE travel per shot through pinned pass stations (hold 0, pin): cab4 f272 pre-roll -> 284/300/330/390 (fitted) -> eased landing 422;
  bay5 f399 pre-roll -> 411/430/460/490 -> landing 499. Baked positions are ON the fitted cams at those frames. Plan window: cab4 p90 16.2 PASS, peak 30.9 WARN (his pull-back);
  bay5 p90 10.7, peak 10.9 PASS.
- Marks: cabin plane y .45 (f300 marks y .30), 1.05-1.2 m off the quilt; scale 1.15 (f300 new guy .84 / commander .745 growing to 1.15 f300-318 under the pull-back).
  Bay: sleepers on the bags' head anchors [x, 1.0, 2.32]. Acts eased (ease inout), poses smoothstep >= 6 f starting 2 f early; big arm moves 10-14 f.
- FOUND: the kit tips every card to the lens about its feet; from the high f430 cam the heads leaned 0.38 m back into the headrest pad and wall = no heads.
  cab_stage.js "upright" takes the tip off the sleepers' cards (new guy eased back in from f446 over 16 f). Checked on f430: three heads above the collars.
- FOUND: the film keeps the ACT's face, not the move's: round 1 faces never played. Faces now in acts (FACES4 / FACES5 in make_film.py).
- Commander / navigator: look = "newguy" (camsafe wants 3/4, moves draw 3/4). cab4 camsafe 0 FAIL (render 2b, before the face fix).
- Props: toss / release start from the hand's own velocity; magazine push [-1.1, -.35, 1.0] m/s, spin 220/140/380 deg/s. Monitor placeholder pulses +-6 % (period 9 f) so its frames are not held.
- WAIVERS: feet float (frame_checks "feet") = weightless crew, his frames show dangling legs. bay5 collide ignore bag_* and bay_wall_backing: sleepers stand IN the bags on the set's card plane.

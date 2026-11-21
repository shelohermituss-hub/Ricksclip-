# Plan check: Why Fire Trucks Turned Yellow, S2 THE SECRET (lines 3-4, frames 288-474)

Camera idea: **none named**. 

42 gates: 38 pass, 4 warn, 0 fail. 187 frames, 6.2 s, 1 takes.

| | Gate | Value | Target | Fix |
|-|-|-|-|-|
| PASS | camera: at rest (< 2 px/f), % of frames | 31.6 | >= 30 (Rick median 32, range 6-58) |  |
| PASS | camera: rests per 10 s | 3.21 | 2.2-4.5, aim 3 (Rick 3.1, range 0.9-4.7; the plan reads about 1 higher than the picture). CB 2026-11-10: the scene decides, but the camera must flow like his |  |
| PASS | camera: rest length median, s | 0.88 | >= 0.6 (Rick 0.62); one in ten >= 1.8 |  |
| PASS | camera: longest travel, s | 3.3 | 3-7 in a film of 30 s or more: at least one long flowing move (Rick's long travels: median 3.0, upper quarter 4.8-9.5; Railroads and Roller Coasters 4.7) |  |
| WARN | camera: speed median px/f | 7.37 | about 4 (Rick 4.1, middle half 2.5-6.1) | too busy: fewer stations, slower travels |
| PASS | camera: speed p90 px/f | 19.6 | about 23 (Rick 23, range 9.8-33.8) |  |
| PASS | camera: dead still (reads under 0.3 px/f when measured), % of frames | 3.2 | <= 21, aim 9 (Rick 9.3, range 1-29) |  |
| PASS | camera: speed peak px/f | 34.4 | <= 60 outside planned whips |  |
| PASS | camera: cuts per 10 s | 0.0 | <= 0.9, aim 0.4 (Rick 0.4; CB: fewer cuts) |  |
| PASS | camera: tilt while resting, deg | 0.0 | level (<= 0.5); tilt only inside a move (Rick: 0 % of holds) |  |
| PASS | camera: roll rate peak deg/f | 0.0 | <= 1.1 (Rick p99 1.08) |  |
| PASS | camera: lens outside 16-55 mm on non-insert frames, % | 0.0 | wide and close: about 24 mm = 73 deg tall (Rick, measured); long lenses only for object inserts |  |
| PASS | camera: travels that swing the view over 120 deg | 0 | 0: lay the places along the travel direction so the camera never turns back |  |
| WARN | camera: camera v2 notes (flowed-through stations, short travels, capped whips) | 4 | 0 | s2 station 3 (f74): hold 0, the camera flows through it as a via point; s2 station 1 (f0): stations 0-1 leave room for a 0 f travel where the move wants 45 f; flowed through as a via point (space stations >= 2.5 s apart, or chain them with hold 0); s2 station 2 (f42): stations 0-2 leave room for a 42 f travel where the move wants 113 f; flowed through as a via point (space stations >= 2.5 s apart, or chain them with hold 0); s2 station 4 (f107): 15.7 m in 107 f still peaks 34 px/f on the plan (aim 22); the move wants about 168 f but the stations leave no more room: move the station later |
| PASS | camera: word stations not at rest on their word | 0 | 0: key nouns land with the camera at rest, 0-6 f before the word (CB's rule) |  |
| PASS | framing: first face, s | 0.0 | <= 1.5 (Rick median 0.0) |  |
| PASS | framing: face on screen, first 5 s, % | 89.0 | >= 50 (Rick 55-63) |  |
| PASS | framing: face on screen, first 15 s, % | 91.0 | >= 50 (Rick 55-63) |  |
| PASS | framing: longest stretch without a face, s | 0.4 | <= 6 |  |
| PASS | framing: frames with a face, % | 91.0 | 45-68 (Rick 55, range 23-66): about a third of the film belongs to the world and the story object |  |
| PASS | framing: head width / frame width, median | 0.3 | about 0.25 (Rick 0.25, range 0.16-0.52) |  |
| PASS | framing: head width / frame width, p90 | 0.46 | <= 0.55 |  |
| PASS | framing: whole-body rests: figure height / frame height, median | 0.52 | about 0.45 (his head width of 0.25 at puppet proportions) |  |
| PASS | framing: whole-body rests: feet height (0 = top), median | 0.84 | 0.80-0.95: feet near the bottom, at most a fifth of the frame is empty floor |  |
| PASS | framing: head centre height, median (0 = top) | 0.41 | 0.45 (Rick 0.39-0.51), above the caption band |  |
| PASS | framing: head centres inside the caption band, % of all heads on screen | 0.6 | <= 3 (Rick 2.7) |  |
| PASS | framing: face frames with the head cut by the edge, % | 11.0 | <= 13 (Rick 13) |  |
| PASS | framing: face frames where the whole body fits, % | 68.0 | >= 65 (Rick 68) |  |
| WARN | camera: at rest while a face is on screen, % | 34.0 | >= 40 (Rick 41): rest on faces, move on places and objects | hold on the face, travel between faces |
| PASS | framing: shot mix W/M/C/P/O, % of time | 84/16/0/0/0 | whole body 45, medium 20, close <= 7, place 15, object insert <= 15 (Rick) |  |
| PASS | framing: world-led frames (place + object framing), % of time | 0 | 25-40 (Rick: place 15 + object up to 15; his 3D films are about half world-led by eye) |  |
| PASS | framing: medium shots, % of time | 16 | about 20 (Rick): the middle size is the dull one |  |
| PASS | world: places in the film | 1 | >= 4, aim 5-8 at 55 s or more (Rick's 3D films: 5-8 places) |  |
| PASS | world: share of the film in its most used light, % | 100 | <= 75: 2-3 kinds of light per film (day, golden, morning, night, interior); the light changes at the turn of the story |  |
| PASS | framing: same framing on the same subject in a row (stations) | 2 | <= 3 |  |
| WARN | story: sentences table | missing | film.json needs 'sentences' so the story gates can run | add one row per sentence: words [first, last], subject, nouns |
| PASS | acting: pose or face changes per 10 s on screen | 17.6 | >= 4 (Rick 4.5 on one figure, range 3-7; this counts every figure on screen) |  |
| PASS | acting: longest fully frozen figure with a resting camera, s | 0.7 | <= 3 unless something else moves |  |
| PASS | acting: held props without a hand | 0 | 0: every held prop is attached to a hand on every frame |  |
| PASS | acting: camera goes around a figure but its view never changes | 0 | 0: a pure camera move never turns a character; the view follows the camera (act key look / look_full) |  |
| PASS | acting: effects per 10 s | 1.6 | 1-2, on the action noun or verb (Rick) |  |
| PASS | acting: mood (light / colour) changes per minute | 38.5 | >= 12, in-shot on the word (Rick 13.7, range 3.9-15.5) |  |

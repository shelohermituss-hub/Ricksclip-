# Plan check: Why Fire Trucks Turned Yellow, S4 THE IDEA SPREADS (line 7, frames 770-969)

Camera idea: **none named**. 

40 gates: 28 pass, 5 warn, 7 fail. 200 frames, 6.7 s, 1 takes.

| | Gate | Value | Target | Fix |
|-|-|-|-|-|
| PASS | camera: at rest (< 2 px/f), % of frames | 33.5 | >= 30 (Rick median 32, range 6-58) |  |
| PASS | camera: rests per 10 s | 4.5 | 2.2-4.5, aim 3 (Rick 3.1, range 0.9-4.7; the plan reads about 1 higher than the picture). CB 2026-11-10: the scene decides, but the camera must flow like his |  |
| PASS | camera: rest length median, s | 0.6 | >= 0.6 (Rick 0.62); one in ten >= 1.8 |  |
| PASS | camera: longest travel, s | 2.7 | 3-7 in a film of 30 s or more: at least one long flowing move (Rick's long travels: median 3.0, upper quarter 4.8-9.5; Railroads and Roller Coasters 4.7) |  |
| FAIL | camera: speed median px/f | 14.66 | about 4 (Rick 4.1, middle half 2.5-6.1) | too busy: fewer stations, slower travels |
| WARN | camera: speed p90 px/f | 29.1 | about 23 (Rick 23, range 9.8-33.8) | give fast travels more frames or less distance |
| PASS | camera: dead still (reads under 0.3 px/f when measured), % of frames | 20.5 | <= 21, aim 9 (Rick 9.3, range 1-29) |  |
| PASS | camera: speed peak px/f | 29.5 | <= 60 outside planned whips |  |
| PASS | camera: cuts per 10 s | 0.0 | <= 0.9, aim 0.4 (Rick 0.4; CB: fewer cuts) |  |
| PASS | camera: tilt while resting, deg | 0.0 | level (<= 0.5); tilt only inside a move (Rick: 0 % of holds) |  |
| PASS | camera: roll rate peak deg/f | 0.0 | <= 1.1 (Rick p99 1.08) |  |
| PASS | camera: lens outside 16-55 mm on non-insert frames, % | 0.0 | wide and close: about 24 mm = 73 deg tall (Rick, measured); long lenses only for object inserts |  |
| PASS | camera: travels that swing the view over 120 deg | 0 | 0: lay the places along the travel direction so the camera never turns back |  |
| WARN | camera: camera v2 notes (flowed-through stations, short travels, capped whips) | 3 | 0 | s4 station 1 (f0): stations 0-1 leave room for a 0 f travel where the move wants 45 f; flowed through as a via point (space stations >= 2.5 s apart, or chain them with hold 0); s4 station 3 (f100): stations 2-3 leave room for a 30 f travel where the move wants 63 f; flowed through as a via point (space stations >= 2.5 s apart, or chain them with hold 0); s4 station 4 (f164): 4.2 m in 86 f still peaks 30 px/f on the plan (aim 22); the move wants about 116 f but the stations leave no more room: move the station later |
| PASS | camera: word stations not at rest on their word | 0 | 0: key nouns land with the camera at rest, 0-6 f before the word (CB's rule) |  |
| WARN | framing: first face, s | 3.17 | <= 1.5 (Rick median 0.0) | open on the hero doing the strange act, not on a prop or a place |
| FAIL | framing: face on screen, first 5 s, % | 5.0 | >= 50 (Rick 55-63) | keep the hero in frame while the set is introduced |
| FAIL | framing: face on screen, first 15 s, % | 29.0 | >= 50 (Rick 55-63) | keep the hero in frame while the set is introduced |
| PASS | framing: longest stretch without a face, s | 3.2 | <= 6 |  |
| WARN | framing: frames with a face, % | 29.0 | 45-68 (Rick 55, range 23-66): about a third of the film belongs to the world and the story object | fewer object and place frames |
| PASS | framing: head width / frame width, median | 0.22 | about 0.25 (Rick 0.25, range 0.16-0.52) |  |
| PASS | framing: head width / frame width, p90 | 0.27 | <= 0.55 |  |
| PASS | framing: head centre height, median (0 = top) | 0.44 | 0.45 (Rick 0.39-0.51), above the caption band |  |
| FAIL | framing: head centres inside the caption band, % of all heads on screen | 8.5 | <= 3 (Rick 2.7) | a face sits under the caption (often the short character): re-aim, raise them on a step, or move them out of the 58-76 % band |
| FAIL | framing: face frames with the head cut by the edge, % | 88.0 | <= 13 (Rick 13) | widen or re-aim the cut-off stations |
| FAIL | framing: face frames where the whole body fits, % | 12.0 | >= 65 (Rick 68) | pull a medium back until the feet are in, or change who is in the picture instead of the shot size |
| PASS | camera: at rest while a face is on screen, % | 66.0 | >= 40 (Rick 41): rest on faces, move on places and objects |  |
| PASS | framing: shot mix W/M/C/P/O, % of time | 58/42/0/0/0 | whole body 45, medium 20, close <= 7, place 15, object insert <= 15 (Rick) |  |
| PASS | framing: world-led frames (place + object framing), % of time | 0 | 25-40 (Rick: place 15 + object up to 15; his 3D films are about half world-led by eye) |  |
| PASS | framing: medium shots, % of time | 42 | about 20 (Rick): the middle size is the dull one |  |
| PASS | world: places in the film | 1 | >= 4, aim 5-8 at 55 s or more (Rick's 3D films: 5-8 places) |  |
| PASS | world: share of the film in its most used light, % | 100 | <= 75: 2-3 kinds of light per film (day, golden, morning, night, interior); the light changes at the turn of the story |  |
| PASS | framing: same framing on the same subject in a row (stations) | 2 | <= 3 |  |
| WARN | story: sentences table | missing | film.json needs 'sentences' so the story gates can run | add one row per sentence: words [first, last], subject, nouns |
| PASS | acting: pose or face changes per 10 s on screen | 25.9 | >= 4 (Rick 4.5 on one figure, range 3-7; this counts every figure on screen) |  |
| PASS | acting: longest fully frozen figure with a resting camera, s | 1.2 | <= 3 unless something else moves |  |
| PASS | acting: held props without a hand | 0 | 0: every held prop is attached to a hand on every frame |  |
| PASS | acting: camera goes around a figure but its view never changes | 0 | 0: a pure camera move never turns a character; the view follows the camera (act key look / look_full) |  |
| FAIL | acting: effects per 10 s | 4.5 | 1-2, on the action noun or verb (Rick) | too many effects: keep the ones on action words |
| PASS | acting: mood (light / colour) changes per minute | 36.0 | >= 12, in-shot on the word (Rick 13.7, range 3.9-15.5) |  |

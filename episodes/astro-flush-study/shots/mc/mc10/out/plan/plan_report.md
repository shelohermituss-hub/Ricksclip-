# Plan check: astro-flush mc, shot 10 (f803-866)

Camera idea: **none named**. 

42 gates: 28 pass, 3 warn, 11 fail. 867 frames, 28.9 s, 1 takes.

| | Gate | Value | Target | Fix |
|-|-|-|-|-|
| PASS | camera: at rest (< 2 px/f), % of frames | 97.0 | >= 30 (Rick median 32, range 6-58) |  |
| FAIL | camera: rests per 10 s | 0.35 | 2.2-4.5, aim 3 (Rick 3.1, range 0.9-4.7; the plan reads about 1 higher than the picture). CB 2026-11-10: the scene decides, but the camera must flow like his | break long travels with a resting station on the next noun |
| PASS | camera: rest length median, s | 28.03 | >= 0.6 (Rick 0.62); one in ten >= 1.8 |  |
| PASS | camera: longest travel, s | 0.87 | 3-7 in a film of 30 s or more: at least one long flowing move (Rick's long travels: median 3.0, upper quarter 4.8-9.5; Railroads and Roller Coasters 4.7) |  |
| FAIL | camera: speed median px/f | 0.0 | about 4 (Rick 4.1, middle half 2.5-6.1) | too calm: raise the creep on the rests, add a drift, or lengthen the travels |
| FAIL | camera: speed p90 px/f | 0.0 | about 23 (Rick 23, range 9.8-33.8) | the travels crawl: cover more distance or take fewer frames (set travel on the station) |
| FAIL | camera: dead still (reads under 0.3 px/f when measured), % of frames | 92.7 | <= 21, aim 9 (Rick 9.3, range 1-29) | the rests are parked: raise creep on those stations or add a drift |
| PASS | camera: speed peak px/f | 2.6 | <= 60 outside planned whips |  |
| PASS | camera: cuts per 10 s | 0.0 | <= 0.9, aim 0.4 (Rick 0.4; CB: fewer cuts) |  |
| PASS | camera: tilt while resting, deg | 0 | level (<= 0.5); tilt only inside a move (Rick: 0 % of holds) |  |
| PASS | camera: roll rate peak deg/f | 0 | <= 1.1 (Rick p99 1.08) |  |
| PASS | camera: lens outside 16-55 mm on non-insert frames, % | 0.0 | wide and close: about 24 mm = 73 deg tall (Rick, measured); long lenses only for object inserts |  |
| PASS | camera: travels that swing the view over 120 deg | 0 | 0: lay the places along the travel direction so the camera never turns back |  |
| WARN | camera: camera v2 notes (flowed-through stations, short travels, capped whips) | 1 | 0 | s10 station 1 (f803): travel 0.10 s is read as a whip (write whip: true) |
| PASS | camera: word stations not at rest on their word | 0 | 0: key nouns land with the camera at rest, 0-6 f before the word (CB's rule) |  |
| PASS | framing: first face, s | 0.0 | <= 1.5 (Rick median 0.0) |  |
| PASS | framing: face on screen, first 5 s, % | 100.0 | >= 50 (Rick 55-63) |  |
| PASS | framing: face on screen, first 15 s, % | 100.0 | >= 50 (Rick 55-63) |  |
| PASS | framing: longest stretch without a face, s | 0.0 | <= 6 |  |
| PASS | framing: frames with a face, % | 100.0 | 45-68 (Rick 55, range 23-66): about a third of the film belongs to the world and the story object |  |
| PASS | framing: head width / frame width, median | 0.32 | about 0.25 (Rick 0.25, range 0.16-0.52) |  |
| PASS | framing: head width / frame width, p90 | 0.32 | <= 0.55 |  |
| FAIL | framing: head centre height, median (0 = top) | 0.6 | 0.45 (Rick 0.39-0.51), above the caption band | raise or lower the aim point so faces sit just above centre |
| FAIL | framing: head centres inside the caption band, % of all heads on screen | 97.8 | <= 3 (Rick 2.7) | a face sits under the caption (often the short character): re-aim, raise them on a step, or move them out of the 58-76 % band |
| PASS | framing: face frames with the head cut by the edge, % | 0.0 | <= 13 (Rick 13) |  |
| FAIL | framing: face frames where the whole body fits, % | 0.0 | >= 65 (Rick 68) | pull a medium back until the feet are in, or change who is in the picture instead of the shot size |
| PASS | camera: at rest while a face is on screen, % | 97.0 | >= 40 (Rick 41): rest on faces, move on places and objects |  |
| WARN | framing: shot mix W/M/C/P/O, % of time | 0/100/0/0/0 | whole body 45, medium 20, close <= 7, place 15, object insert <= 15 (Rick) | object inserts and close-ups are the two that run over |
| PASS | framing: world-led frames (place + object framing), % of time | 0 | 25-40 (Rick: place 15 + object up to 15; his 3D films are about half world-led by eye) |  |
| PASS | framing: medium shots, % of time | 100 | about 20 (Rick): the middle size is the dull one |  |
| PASS | world: places in the film | 1 | >= 4, aim 5-8 at 55 s or more (Rick's 3D films: 5-8 places) |  |
| PASS | world: share of the film in its most used light, % | 100 | <= 75: 2-3 kinds of light per film (day, golden, morning, night, interior); the light changes at the turn of the story |  |
| PASS | framing: same framing on the same subject in a row (stations) | 1 | <= 3 |  |
| WARN | story: sentences table | missing | film.json needs 'sentences' so the story gates can run | add one row per sentence: words [first, last], subject, nouns |
| FAIL | acting: pose or face changes per 10 s on screen | 0.7 | >= 4 (Rick 4.5 on one figure, range 3-7; this counts every figure on screen) | add an act (face, pose, turn, step, prop beat) on the content words |
| FAIL | acting: longest fully frozen figure with a resting camera, s | 27.8 | <= 3 unless something else moves | ctlDark: add a face change, or let the camera creep / another character act |
| PASS | acting: held props without a hand | 0 | 0: every held prop is attached to a hand on every frame |  |
| PASS | acting: camera goes around a figure but its view never changes | 0 | 0: a pure camera move never turns a character; the view follows the camera (act key look / look_full) |  |
| FAIL | acting: effects per 10 s | 0.0 | 1-2, on the action noun or verb (Rick) | add a glint, glow, stamp, coin or dust hit on the key nouns |
| FAIL | acting: mood (light / colour) changes per minute | 0.0 | >= 12, in-shot on the word (Rick 13.7, range 3.9-15.5) | add light or colour shifts on the turn, the proof and the payoff |
| PASS | camera: WINDOW f803-866 speed p90 px/f (plan estimate) | 2.5 | <= 22 (lean default; old traffic lights 21.8 measured) |  |
| PASS | camera: WINDOW f803-866 speed peak px/f (plan estimate) | 2.6 | <= 26 outside a planned whip |  |

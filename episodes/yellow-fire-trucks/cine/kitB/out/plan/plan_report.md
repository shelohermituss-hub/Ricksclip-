# Plan check: Why Fire Trucks Turned Yellow, S6 THE ANSWER (lines 10-12, frames 1202-1576)

Camera idea: **none named**. 

33 gates: 15 pass, 7 warn, 11 fail. 1318 frames, 43.9 s, 1 takes.

| | Gate | Value | Target | Fix |
|-|-|-|-|-|
| PASS | camera: at rest (< 2 px/f), % of frames | 91.0 | >= 30 (Rick median 32, range 6-58) |  |
| FAIL | camera: rests per 10 s | 0.68 | 2.2-4.5, aim 3 (Rick 3.1, range 0.9-4.7; the plan reads about 1 higher than the picture). CB 2026-11-10: the scene decides, but the camera must flow like his | break long travels with a resting station on the next noun |
| PASS | camera: rest length median, s | 1.1 | >= 0.6 (Rick 0.62); one in ten >= 1.8 |  |
| WARN | camera: longest travel, s | 2.53 | 3-7 in a film of 30 s or more: at least one long flowing move (Rick's long travels: median 3.0, upper quarter 4.8-9.5; Railroads and Roller Coasters 4.7) | every move is a short hop: where the scene has something to follow (a train, a walk, a falling thing, a line of rails) let one move run 4-5 s (station key travel) |
| FAIL | camera: speed median px/f | 1.28 | about 4 (Rick 4.1, middle half 2.5-6.1) | too calm: raise the creep on the rests, add a drift, or lengthen the travels |
| FAIL | camera: speed p90 px/f | 1.8 | about 23 (Rick 23, range 9.8-33.8) | the travels crawl: cover more distance or take fewer frames (set travel on the station) |
| PASS | camera: dead still (reads under 0.3 px/f when measured), % of frames | 0.4 | <= 21, aim 9 (Rick 9.3, range 1-29) |  |
| PASS | camera: speed peak px/f | 43.7 | <= 60 outside planned whips |  |
| PASS | camera: cuts per 10 s | 0.0 | <= 0.9, aim 0.4 (Rick 0.4; CB: fewer cuts) |  |
| PASS | camera: tilt while resting, deg | 0.0 | level (<= 0.5); tilt only inside a move (Rick: 0 % of holds) |  |
| PASS | camera: roll rate peak deg/f | 0.0 | <= 1.1 (Rick p99 1.08) |  |
| PASS | camera: lens outside 16-55 mm on non-insert frames, % | 0.0 | wide and close: about 24 mm = 73 deg tall (Rick, measured); long lenses only for object inserts |  |
| PASS | camera: travels that swing the view over 120 deg | 0 | 0: lay the places along the travel direction so the camera never turns back |  |
| WARN | camera: camera v2 notes (flowed-through stations, short travels, capped whips) | 2 | 0 | s6_eye station 2 (f1258): travel 17 f is under 1 s and is not a whip; s6_eye station 3 (f1317): travel 26 f is under 1 s and is not a whip |
| PASS | camera: word stations not at rest on their word | 0 | 0: key nouns land with the camera at rest, 0-6 f before the word (CB's rule) |  |
| FAIL | framing: first face, s | None | <= 1.5 (Rick median 0.0) | open on the hero doing the strange act, not on a prop or a place |
| FAIL | framing: face on screen, first 5 s, % | 0.0 | >= 50 (Rick 55-63) | keep the hero in frame while the set is introduced |
| FAIL | framing: face on screen, first 15 s, % | 0.0 | >= 50 (Rick 55-63) | keep the hero in frame while the set is introduced |
| FAIL | framing: longest stretch without a face, s | 43.9 | <= 6 | show the noun WITH a character (in hand, beside them) instead of an empty insert |
| FAIL | framing: frames with a face, % | 0.0 | 45-68 (Rick 55, range 23-66): about a third of the film belongs to the world and the story object | fewer object and place frames |
| FAIL | framing: shot mix W/M/C/P/O, % of time | 4/0/96/0/0 | whole body 45, medium 20, close <= 7, place 15, object insert <= 15 (Rick) | object inserts and close-ups are the two that run over |
| WARN | framing: world-led frames (place + object framing), % of time | 0 | 25-40 (Rick: place 15 + object up to 15; his 3D films are about half world-led by eye) | let the world or the story object fill the frame and make the character tiny or leave them out for that beat; then go very close |
| PASS | framing: medium shots, % of time | 0 | about 20 (Rick): the middle size is the dull one |  |
| WARN | world: places in the film | 1 | >= 4, aim 5-8 at 55 s or more (Rick's 3D films: 5-8 places) | a story in one place still gets more views of it as places of their own (from the air, inside the vehicle, under the machine, the same set at night); an analogy or cutaway is a small 3D place, never a flat card |
| WARN | world: share of the film in its most used light, % | 100 | <= 75: 2-3 kinds of light per film (day, golden, morning, night, interior); the light changes at the turn of the story | give the turn or the ending its own light: a second place entry on the same set with another light (golden, night), or move that beat indoors |
| PASS | framing: same framing on the same subject in a row (stations) | 2 | <= 3 |  |
| WARN | story: sentences table | missing | film.json needs 'sentences' so the story gates can run | add one row per sentence: words [first, last], subject, nouns |
| FAIL | acting: pose or face changes per 10 s on screen | 0.0 | >= 4 (Rick 4.5 on one figure, range 3-7; this counts every figure on screen) | add an act (face, pose, turn, step, prop beat) on the content words |
| PASS | acting: longest fully frozen figure with a resting camera, s | 0.0 | <= 3 unless something else moves |  |
| PASS | acting: held props without a hand | 0 | 0: every held prop is attached to a hand on every frame |  |
| PASS | acting: camera goes around a figure but its view never changes | 0 | 0: a pure camera move never turns a character; the view follows the camera (act key look / look_full) |  |
| FAIL | acting: effects per 10 s | 0.5 | 1-2, on the action noun or verb (Rick) | add a glint, glow, stamp, coin or dust hit on the key nouns |
| WARN | acting: mood (light / colour) changes per minute | 6.8 | >= 12, in-shot on the word (Rick 13.7, range 3.9-15.5) | add light or colour shifts on the turn, the proof and the payoff |

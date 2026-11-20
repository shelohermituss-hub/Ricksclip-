# Rick's camera moves: the copy library (2026-11-16)

PRIVATE: `pictures/moves/` holds Rick's frames. Project files only, never in a published page or our videos.

Every camera move found in all 26 of Rick's videos (tracked with `tools/measure/cam_track.py` at 15 fps, then checked by eye on 1-frame-per-second sheets). 490 flights were measured. The tracker names direction and size (push, pull, truck, crane); orbits, POV, top-down, dissolves and wipes were read by eye.

How to use it: tag each picture-plan row with its story job, pick the move from the menu below, copy its stations from `camera_moves_template.json`, then move the numbers onto your set's anchors (hero, prop, set line). Each move's sheet is `pictures/moves/Mxx.jpg`; six to a page in `pictures/moves/page_*.jpg`.

## 1. Rick's numbers, all 26 films

| | Rick, 26 films | Ours: spear v2 / surgery v1 |
|---|---|---|
| time flying | 18-62 % (most 31-51) | 24 % / 26 % |
| time at rest | 13-57 % (most 30-45) | 58 % / 61 % |
| median flight | 0.4-1.6 s (most 0.9-1.2) | 0.4 s / 0.5 s |
| longest flight | 1.4-10.9 s | 1.5 s / 1.1 s |
| flights of 3 s or longer | 0-4 per film (16 of 26 have at least one) | 0 / 0 |
| first flight | 0.1-2.6 s (most under 1 s) | 0.4 s / 1.5 s |

Most used, by count: push in (89 flights, 25 films), push + truck (78, 18 films), pull back (38), pull + truck (50), push + crane up or down (61), pull + crane (40), pure truck (27), pure crane (16). Pull backs are about one in four flights, and almost every one is a reveal.

## 2. Story job to move (the menu)

| Story job | Moves |
|---|---|
| HOOK (0-4 s) | M02 or M03 on the strange act, then M05 or M04 to reveal the big thing. First flight by 1 s. |
| SET UP THE WORLD | M09 along a set line, or M17 top-down then drop; M11 to arrive at the hero. |
| TALK / MOCKER | M01 creep, M02 on the angry or smug word, M16 orbit only at the peak. |
| ACT / BUILD | M10 attention chain (face, hand, part, result, reaction); M03 into the insert. |
| EXPLANATION | M07 into the object, then M06 down the list or M13 along the row; M00 rests only where the picture changes. |
| ANALOGY | In with M21 or M20, then M08 one long push; the payoff repeats the same path. M25 to compare two. |
| TURN / REVEAL | M04, M05 or M12. |
| CHANGE OF PLACE / TIME | M20 dissolve while flying, M21 match dissolve, M22 wipe, M07 fly-through. |
| CLIMAX | M14 ride with the thing (the film's longest flight), M15 alongside, M23 kick on the hit. |
| END | M26 pull back to the calm hero in front of the result, creep in, loop to frame 0. |

## 3. The moves

| # | Move | What it looks like | When Rick uses it | Numbers | Example |
|---|---|---|---|---|---|
| M00 | **LIVING REST** | The camera lands and stays, with only a slow creep (under 2 px per frame). The PICTURE changes instead: colour, a counter, a calendar, a face. | Lip sync lines, a reaction, a counter or calendar ticking, the end of every flight. | Rest 20-48 % of a film (most 20-28 %). One rest 0.6-3.3 s. Never dead still. | Railroads 38.6-41.9: a 3.3 s rest while the rail turns red and the calendar flips. |
| M01 | **CREEP IN ON TALK** | A very slow push toward the speaker while he talks, so the face grows about 10-20 % over the line. | TALK and MOCKER lines, the hero explaining calmly, the smug face at the end. | Glide speed 0.08-0.25 frame widths per second; 1.2-2.8 s; zoom x1.1-1.25. | Town 0.6-1.8: creep in on the two at the button while the line sets the rule. |
| M02 | **PUSH IN TO LAND** | A short, eased push that lands closer on the thing the voice just named. | The noun the voice names, the clue, the angry word. His most common move: in all 26 films. | 89 pure push flights in 25 of 26 films; median 0.6 s, up to 2.9 s; zoom x1.2-2.4. | Humans random 32.2-34.5: push in x2 on the coin board to the row of six. |
| M03 | **WHIP PUSH (SNAP IN)** | A very fast push, often tipping down, from the room to a macro of hands or a bowl, with motion blur. Lands hard, then rests. | ACT: the hero grabs, pours, presses. A punch word. Into an insert. | 0.6-1.5 s; zoom x3-9; peak speed 2-3x a normal flight. | Pink cell 5.3-6.4: whip push x3 down into the paint bowl. |
| M04 | **PULL BACK REVEAL** | Start close on a detail and pull straight back to show what it belongs to. | TURN ('but...'), the joke, how big the thing is. | 38 pure pull flights in 18 films; median 0.5 s, up to 2.2 s; zoom x0.3-0.9. | Window 2.3-4.4: pull back x0.34 from the detail to the whole scene. |
| M05 | **PULL BACK + CRANE UP (BIG REVEAL)** | Pull back while rising, so the hero gets small and the huge thing (loop, ship, storm) fills the frame. | HOOK reveal, TURN, the danger, the scale of the world. Nearly every film. | 23 flights in 16 films; median 1.2 s, up to 4.1 s; zoom x0.5-0.6. | Sailors 34.3-38.5: 4.1 s pull back + crane up from the deck to the ship in the storm. |
| M06 | **CRANE DOWN THE LIST (READING)** | The camera slides down a list, a column, a rail or a wall like eyes reading it, landing on the important line. | EXPLANATION: a list of rules, steps, prices, a mechanism from top to bottom. | Crane-only flights in 8 films; 1-2.7 s per stretch; zoom about x1. | Slots 22.5-25.1: crane down the list of outcomes inside the machine. |
| M07 | **FLY INTO THE OBJECT** | A long push that goes INTO a machine, a door, a body, through its opening, and keeps going inside. | EXPLANATION start ('crack it open', 'inside your brain'), PLACE CHANGE into the inside world. | Slots 4.3 s, zoom x8.9; painkillers 8.7 s, zoom x58. | Slots 17.1-21.4: push into the machine and down inside it. |
| M08 | **ANALOGY CORRIDOR (ONE-POINT PUSH)** | Dissolve into the analogy world, then ONE long straight push down a corridor (one-point perspective) to the target room. The payoff repeats the SAME path with the change. | ANALOGY ('picture your body as a house'), and its payoff. | Painkillers 15.0-23.7 (8.7 s) and 25-34 (9.3 s, the same path again). His longest flights. | Painkillers 15-23.7: through the front door and down the corridor to the HEAD room, 8.7 s. |
| M09 | **TRAVEL ALONG A SET LINE** | One long flight that follows a rail, road, river, rope or wire and joins several places without a cut. | SET UP THE WORLD (who, where, stakes); moving between places that are connected. | Railroads 3.7-11.5: one 7.8 s flight, 4 places, 0 cuts. | Railroads 3.7-11.5: canyon rim, over the edge, across the desert, into the hall, all one flight. |
| M10 | **ATTENTION CHAIN** | One flight with 3-5 short landings: the face, the hand, the part, the result, the reaction. | ACT / BUILD: the hero makes or uses the thing. | Cart 17.5-22.7: one 5.3 s flight round the board, the tubes, the strings, his hands, the crowd. | Cart 17.5-22.7: board, tubes, strings, hands, crowd in one flight. |
| M11 | **PUSH + TRUCK ARC (ARRIVE BESIDE)** | Push in while sliding sideways, so the camera curves around a foreground object and arrives beside the subject. Strong parallax. | Arriving at a new character or place inside the same set; the most common combined move. | 78 push + truck flights in 18 films; median 1.1-1.2 s, up to 5.2 s; zoom x1.3-5. | Cart 6.0-7.9: push + truck past the front soldiers to the two in the corner. |
| M12 | **PULL + TRUCK (STEP BACK TO SHOW TWO)** | Pull back while sliding sideways, so a second thing (rival, crowd, result) joins the frame. | Comparison, the rival enters, 'everyone else', after a close moment to show the room. | 50 flights in 16 films; median 1.3 s, up to 3.9 s; zoom x0.3-0.9. | Job Japan 34.1-37.7: pull back + truck from the man at his desk out through the window to the whole building. |
| M13 | **LATERAL TRUCK ALONG A ROW** | A sideways slide past a row of things (barrels, faces, machines, houses), same distance all the way. | Listing items, a crowd of the same people, 'one after another'. | 27 flights in 12 films; median 1.0-1.2 s, up to 2.9 s; zoom about x1. | Second draw 21.9-24.7: truck right beside the cowboy along the row of saloon fronts. |
| M14 | **RIDE WITH THE MOVING THING** | The camera moves with the spark, cart, ball or ship, keeping it the same size while the world rushes by. Often the longest flight of the film. | CLIMAX (the idea works), any 'it flies, it races, it falls'. | Cart 51.7-55.5 crane up with the spark 3.9 s; coaster 52.3-59.9 up the loop; pirate cannonball 30-31; second draw 0.8-3.5 rides with the bullet; painkillers 6.9-9.5 rides with the pill down the tube. | Cart 51.7-55.5: crane up WITH the spark as it splits into 82 flames. |
| M15 | **TRACK ALONGSIDE** | The camera runs beside a racer or walker at its speed, side on, background streaming. | A race, a chase, two speeds compared, the march. | Mirror 27.5-32.2 beside the horses; coaster 41.4-46.2 slow car then fast car (same move, two speeds). | Mirror 27.5-32.2: tracking beside the racing horses. |
| M16 | **ORBIT ROUND THE SPEAKER** | A slow quarter-circle around a face, often with a crane down, while he gets angry or smug. | MOCKER at its peak, the villain's line, the hero's decision. Never just to decorate. | Railroads 13.7-19.6: push in, then 3.1 s orbit + crane down while the face goes purple. | Railroads 13.6-19.6: push in, then orbit + crane down round the angry boss. |
| M17 | **TOP-DOWN GOD VIEW + DROP** | Straight down over the whole set (a town plan, a field, a board), then a crane down into it. | SET UP a place that is a pattern (round town, maze, army), a crowd forming a shape. | Town 4.5-9.5: top-down over the round town, then down to the centre; 53-55 the crowd from above. | Town 4.5-9.5: top-down over the round town, then down to the button. |
| M18 | **HUGE-TINY VERTICAL TILT** | Tilt or crane up a tall thing (ladder, wall, tower) with a tiny figure on it, to show the height. | Scale, effort, 'so tall nobody...', the hero's climb. | Town 13-15.5 (the ladder); spear 'taller tower'; push + crane up 32 flights in 16 films. | Town 13-15.5: the tall ladder with the tiny climber. |
| M19 | **POV THROUGH THE OBJECT** | We see through the cannon barrel, telescope, keyhole or mirror; often a round mask. | Aiming, spying, 'he spots', the target. | Pirate 25-27 down the cannon; mirror 18 through the telescope ring. | Pirate 24.5-27: from the furnace to over the cannon barrel, the gun's view of the gunners. |
| M20 | **DISSOLVE WHILE FLYING** | The push keeps going and the next place dissolves in under it; the same move continues there. | CHANGE OF PLACE or TIME when the places are not connected. | Coaster 25.9-30.6; mirror 2.5-3.5, 14.5-15.5, 26.8-27.8. Dissolve 6-14 frames. | Coaster 25.9-30.6: push, dissolve while flying, the same push on up the red carpet. |
| M21 | **MATCH DISSOLVE (SHAPE TO SHAPE)** | A round soup pot becomes the round sea, a pupil becomes a planet: a top-down macro of one thing dissolves into a matching shape. | Analogy start, 'just like...', jump from small to big. | Sailors 50-53: oil on the soup turns into the calm sea. | Sailors 50-53: oil on the soup dissolves into the ocean. |
| M22 | **FOREGROUND WIPE** | A ship hull, train, body or wall passes close to the lens and covers the cut. | Place change in a busy scene, a quick time jump. | Pirate 48.5-50.6 (the hull passes); railroads train wipe. | Pirate 48.3-50.6: the hull passes close and wipes to the next shot. |
| M23 | **IMPACT KICK** | A short shake on a hit, decaying in 3-8 frames. | The smash, the explosion, the bell, the fall. | Pirate 6-8 (smash), cart 64 (blast), short and rare. | Pirate 6.2-8.7: the smash with a kick, then pull back + truck to the wreck. |
| M24 | **TIPPED SWING (DUTCH IN THE MOVE)** | The horizon tips while the camera swings (storm, fall, panic) and levels when it lands. | Danger, a storm, chaos, falling. | Sailors 31-34 on the rolling deck; roll up to about 15 degrees; level at every rest. | Sailors 31-34: tipped high angle on the rolling deck. |
| M25 | **SAME MOVE, TWO SPEEDS** | The same camera move twice: slow with the slow thing, fast with the fast thing. | Comparing two options, before and after. | Coaster 41.4-46.2: slow truck with the slow car, then fast push with the fast car that flips. | Coaster 41.4-46.2: slow truck with the slow car, fast push with the fast one. |
| M26 | **END PULL BACK** | Pull back from the result so the calm hero stands big in front of it, then a creep in on the smug face into the loop. | PUNCHLINE / last frame. | Cart 64.4-66.8, coaster 61-63, railroads 64.3-65. | Cart 64.4-66.8: pull back to the hero in front of the mushroom cloud. |

## 4. How to build each one (film.json stations)

Stations are for a hero at the origin, z up, metres, head about 1.6 m. `at` is a word or seconds; `travel` is the flight time into this station (over 3 s must be set by hand, the default cap is 3.0); `hold` is the rest after landing; `creep`/`drift` keep a rest alive; a station with `hold` 0 is a pass-point that bends the path (travel is a straight line between stations).

### M00 LIVING REST

Build: One station with a long hold and a small creep. The change comes from the set (material, counter, decal), not the camera.

Camera-safe: Character height, within 10 degrees down.

```json
[
 {
  "at": "<word>",
  "pos": [
   0,
   -4.2,
   1.5
  ],
  "aim": [
   0,
   0,
   1.3
  ],
  "lens": 32,
  "framing": "M",
  "hold": 2.4,
  "creep": 0.02
 }
]
```

### M01 CREEP IN ON TALK

Build: Station with framing M and creep 0.04-0.06. The next station is a small push in on the angry or smug word (M02).

Camera-safe: Eye level. Two-shot: both faces at least 3/4 to the lens (validate.mjs VIEW_MISMATCH).

```json
[
 {
  "at": "<word>",
  "pos": [
   0,
   -3.2,
   1.5
  ],
  "aim": [
   0,
   0,
   1.45
  ],
  "lens": 35,
  "framing": "M",
  "hold": 2.0,
  "creep": 0.05
 }
]
```

### M02 PUSH IN TO LAND

Build: Two stations on one line; travel 0.6-1.2 s; the second lands on the word.

Camera-safe: Stay at head height on the way in; never end with the head cut by the caption band.

```json
[
 {
  "at": "<before>",
  "pos": [
   0,
   -5,
   1.5
  ],
  "aim": [
   0,
   0,
   1.3
  ],
  "lens": 28,
  "framing": "W",
  "hold": 0.8
 },
 {
  "at": "<named word>",
  "pos": [
   0,
   -2.0,
   1.5
  ],
  "aim": [
   0,
   0,
   1.45
  ],
  "lens": 35,
  "framing": "C",
  "travel": 0.8,
  "hold": 1.0
 }
]
```

### M03 WHIP PUSH (SNAP IN)

Build: Short travel (0.6-0.8 s) with a big distance change; turn on motion blur; follow with a rest. Use kicks only if it hits something.

Camera-safe: Ends top-down on the prop, so no face in frame: the 10-degree limit does not apply to a P framing without a character.

```json
[
 {
  "at": "<before>",
  "pos": [
   0,
   -4,
   1.6
  ],
  "aim": [
   0,
   0,
   1.0
  ],
  "lens": 28,
  "framing": "M",
  "hold": 0.6
 },
 {
  "at": "<act word>",
  "pos": [
   0,
   -0.9,
   1.6
  ],
  "aim": [
   0,
   -0.1,
   0.9
  ],
  "lens": 40,
  "framing": "P",
  "travel": 0.7,
  "hold": 1.0
 }
]
```

### M04 PULL BACK REVEAL

Build: Close station, then a wide one on the same line behind it. Put a foreground object between them so the pull has parallax.

Camera-safe: Keep the hero at the frame's lower third so his feet stay in (frame_checks).

```json
[
 {
  "at": "<detail word>",
  "pos": [
   0,
   -1.2,
   1.4
  ],
  "aim": [
   0,
   0,
   1.3
  ],
  "lens": 40,
  "framing": "C",
  "hold": 0.7
 },
 {
  "at": "<but word>",
  "pos": [
   0,
   -7,
   2.0
  ],
  "aim": [
   0,
   0,
   1.5
  ],
  "lens": 28,
  "framing": "W",
  "travel": 1.6,
  "hold": 1.2
 }
]
```

### M05 PULL BACK + CRANE UP (BIG REVEAL)

Build: Second station further back and higher; aim moves UP to the big thing, not down to the hero. Set travel (over 3 s needs an explicit travel).

Camera-safe: High end has no close face, so the camera may look down; the first station stays at character height.

```json
[
 {
  "at": "<act>",
  "pos": [
   0,
   -2.5,
   1.5
  ],
  "aim": [
   0,
   0,
   1.4
  ],
  "lens": 32,
  "framing": "M",
  "hold": 0.8
 },
 {
  "at": "<reveal word>",
  "pos": [
   0,
   -9,
   5.5
  ],
  "aim": [
   0,
   2,
   3.0
  ],
  "lens": 24,
  "framing": "W",
  "travel": 2.5,
  "hold": 1.2
 }
]
```

### M06 CRANE DOWN THE LIST (READING)

Build: pos and aim both drop by the same amount (a truck, not a tilt), so the list stays flat to the lens. Highlight the key line when the camera lands.

Camera-safe: No character in frame; keep the caption band clear of the key line.

```json
[
 {
  "at": "<list word>",
  "pos": [
   0,
   -1.8,
   2.6
  ],
  "aim": [
   0,
   0,
   2.6
  ],
  "lens": 35,
  "framing": "P",
  "hold": 0.5
 },
 {
  "at": "<key line word>",
  "pos": [
   0,
   -1.8,
   0.9
  ],
  "aim": [
   0,
   0,
   0.9
  ],
  "lens": 35,
  "framing": "P",
  "travel": 2.0,
  "hold": 0.8
 }
]
```

### M07 FLY INTO THE OBJECT

Build: Three stations: outside, the opening (hold 0), inside. The opening must be a real hole in the model; or put a 6-10 frame ep_dissolve at the middle station.

Camera-safe: Do not pass through a character card (FACE_BEHIND).

```json
[
 {
  "at": "<open word>",
  "pos": [
   0,
   -3.5,
   1.6
  ],
  "aim": [
   0,
   0,
   1.4
  ],
  "lens": 28,
  "framing": "M",
  "hold": 0.6
 },
 {
  "pos": [
   0,
   -0.2,
   1.4
  ],
  "aim": [
   0,
   1,
   1.3
  ],
  "lens": 28,
  "framing": "O",
  "travel": 1.6,
  "hold": 0.0
 },
 {
  "at": "<inside word>",
  "pos": [
   0,
   2.5,
   1.2
  ],
  "aim": [
   0,
   4,
   1.0
  ],
  "lens": 24,
  "framing": "W",
  "travel": 1.4,
  "hold": 0.8
 }
]
```

### M08 ANALOGY CORRIDOR (ONE-POINT PUSH)

Build: Straight line, centred vanishing point, doors on both sides. Save the stations; the payoff copies them with the changed set. ep_dissolves at the start.

Camera-safe: Corridor at eye height; walls must not clip the near plane.

```json
[
 {
  "at": "<like word>",
  "pos": [
   0,
   -6,
   1.6
  ],
  "aim": [
   0,
   0,
   1.6
  ],
  "lens": 24,
  "framing": "W",
  "hold": 0.4
 },
 {
  "pos": [
   0,
   0,
   1.6
  ],
  "aim": [
   0,
   6,
   1.6
  ],
  "lens": 24,
  "framing": "O",
  "travel": 2.5,
  "hold": 0
 },
 {
  "at": "<target word>",
  "pos": [
   0,
   12,
   1.6
  ],
  "aim": [
   0,
   16,
   1.5
  ],
  "lens": 28,
  "framing": "M",
  "travel": 5.0,
  "hold": 1.0
 }
]
```

### M09 TRAVEL ALONG A SET LINE

Build: Pass-point stations (hold 0) every 2-3 s along the line; build the line as ONE connected set. Needs follow for set lines to make it easy (tool gap).

Camera-safe: Land at character height when the hero comes into frame.

```json
[
 {
  "at": "<place 1 word>",
  "pos": [
   0,
   -6,
   3
  ],
  "aim": [
   0,
   0,
   1
  ],
  "lens": 24,
  "framing": "W",
  "hold": 0.4
 },
 {
  "pos": [
   0,
   12,
   4
  ],
  "aim": [
   0,
   20,
   1
  ],
  "lens": 24,
  "framing": "W",
  "travel": 2.6,
  "hold": 0
 },
 {
  "pos": [
   0,
   30,
   3
  ],
  "aim": [
   0,
   38,
   1
  ],
  "lens": 24,
  "framing": "W",
  "travel": 2.6,
  "hold": 0
 },
 {
  "at": "<place 4 word>",
  "pos": [
   0,
   44,
   1.6
  ],
  "aim": [
   0,
   48,
   1.5
  ],
  "lens": 28,
  "framing": "M",
  "travel": 2.4,
  "hold": 1.0
 }
]
```

### M10 ATTENTION CHAIN

Build: Short holds (0.3-0.5 s) so it reads as one move. The hand landing is where the props touch (hands on objects rule).

Camera-safe: Each landing with a face: 3/4 to the lens, eye level; check the middle of each travel too.

```json
[
 {
  "at": "<face word>",
  "pos": [
   0,
   -2.2,
   1.5
  ],
  "aim": [
   0,
   0,
   1.5
  ],
  "lens": 35,
  "framing": "M",
  "hold": 0.5
 },
 {
  "at": "<hand word>",
  "pos": [
   0.4,
   -1.2,
   1.3
  ],
  "aim": [
   0.3,
   0,
   1.0
  ],
  "lens": 40,
  "framing": "C",
  "travel": 0.9,
  "hold": 0.3
 },
 {
  "at": "<part word>",
  "pos": [
   1.2,
   -1.0,
   1.2
  ],
  "aim": [
   1.2,
   0.3,
   0.9
  ],
  "lens": 40,
  "framing": "P",
  "travel": 0.9,
  "hold": 0.3
 },
 {
  "at": "<result word>",
  "pos": [
   2.0,
   -3.0,
   1.8
  ],
  "aim": [
   2.0,
   1.0,
   1.2
  ],
  "lens": 28,
  "framing": "W",
  "travel": 1.0,
  "hold": 0.4
 },
 {
  "at": "<reaction word>",
  "pos": [
   -1.5,
   -2.5,
   1.5
  ],
  "aim": [
   -1.5,
   0.5,
   1.5
  ],
  "lens": 35,
  "framing": "M",
  "travel": 1.1,
  "hold": 0.8
 }
]
```

### M11 PUSH + TRUCK ARC (ARRIVE BESIDE)

Build: Travel is straight between stations, so an arc needs a middle pass-point (hold 0). Put a foreground object near the first half.

Camera-safe: The arc changes the view angle of the hero: views come from apply_looks; validate.mjs at 0/25/50/75/100 %.

```json
[
 {
  "at": "<word>",
  "pos": [
   -3,
   -5,
   1.6
  ],
  "aim": [
   0,
   0,
   1.4
  ],
  "lens": 28,
  "framing": "W",
  "hold": 0.5
 },
 {
  "pos": [
   -0.5,
   -3.5,
   1.6
  ],
  "aim": [
   0.5,
   0,
   1.4
  ],
  "lens": 30,
  "framing": "O",
  "travel": 1.2,
  "hold": 0
 },
 {
  "at": "<subject word>",
  "pos": [
   1.5,
   -2.2,
   1.5
  ],
  "aim": [
   0.3,
   0,
   1.45
  ],
  "lens": 35,
  "framing": "M",
  "travel": 1.2,
  "hold": 0.8
 }
]
```

### M12 PULL + TRUCK (STEP BACK TO SHOW TWO)

Build: Two stations; aim also moves toward the second subject so both end in frame.

Camera-safe: Keep both figures inside the frame edges at the end (frame_checks).

```json
[
 {
  "at": "<word>",
  "pos": [
   0,
   -2,
   1.5
  ],
  "aim": [
   0,
   0,
   1.45
  ],
  "lens": 35,
  "framing": "C",
  "hold": 0.6
 },
 {
  "at": "<rival word>",
  "pos": [
   -2.5,
   -6,
   1.8
  ],
  "aim": [
   -1.2,
   0,
   1.4
  ],
  "lens": 28,
  "framing": "W",
  "travel": 1.6,
  "hold": 1.0
 }
]
```

### M13 LATERAL TRUCK ALONG A ROW

Build: pos and aim move by the same vector. Or use drift on a rest for a slow slide.

Camera-safe: Do not truck behind a character standing in the row (FACE_BEHIND).

```json
[
 {
  "at": "<first item>",
  "pos": [
   -3,
   -2.5,
   1.4
  ],
  "aim": [
   -3,
   0,
   1.2
  ],
  "lens": 35,
  "framing": "M",
  "hold": 0.4
 },
 {
  "at": "<last item>",
  "pos": [
   3,
   -2.5,
   1.4
  ],
  "aim": [
   3,
   0,
   1.2
  ],
  "lens": 35,
  "framing": "M",
  "travel": 2.4,
  "hold": 0.6
 }
]
```

### M14 RIDE WITH THE MOVING THING

Build: Today follow works for characters only. For a prop or effect, key pass-points every 0.5 s along its path (same offset each time), until film_plan.py gets follow for props.

Camera-safe: Long follows stay at character height, within 10 degrees down.

```json
[
 {
  "at": "<launch word>",
  "pos": [
   0,
   -3,
   1.5
  ],
  "aim": [
   0,
   0,
   1.5
  ],
  "lens": 30,
  "framing": "M",
  "hold": 0.3,
  "follow": "<character or (tool gap) prop>",
  "follow_k": 1.0,
  "travel": 4.0
 }
]
```

### M15 TRACK ALONGSIDE

Build: follow with follow_k 1.0 and a side offset; for 'two speeds', copy the same station with the faster runner.

Camera-safe: Side view needs the side drawing: camsafe gives it; check MEME_SIDE faces.

```json
[
 {
  "at": "<race word>",
  "pos": [
   0,
   -4,
   1.3
  ],
  "aim": [
   0,
   0,
   1.2
  ],
  "lens": 32,
  "framing": "M",
  "hold": 0.2,
  "follow": "<runner>",
  "follow_k": 1.0,
  "travel": 3.0
 }
]
```

### M16 ORBIT ROUND THE SPEAKER

Build: Three or more stations on a circle round the face (radius kept). Say the reason in CAMERA_NOTE.md.

Camera-safe: Max 60-70 degrees round a card; never past side view (camsafe views, VIEW_MISMATCH).

```json
[
 {
  "at": "<line start>",
  "pos": [
   -1.6,
   -2.4,
   1.7
  ],
  "aim": [
   0,
   0,
   1.5
  ],
  "lens": 35,
  "framing": "C",
  "hold": 0.4
 },
 {
  "pos": [
   0,
   -2.9,
   1.6
  ],
  "aim": [
   0,
   0,
   1.5
  ],
  "lens": 35,
  "framing": "O",
  "travel": 1.5,
  "hold": 0
 },
 {
  "at": "<angry word>",
  "pos": [
   1.6,
   -2.4,
   1.4
  ],
  "aim": [
   0,
   0,
   1.5
  ],
  "lens": 35,
  "framing": "C",
  "travel": 1.5,
  "hold": 0.8
 }
]
```

### M17 TOP-DOWN GOD VIEW + DROP

Build: Top-down station needs up [0,1,0] so the heading cannot spin.

Camera-safe: Characters are tiny from above, fine; the landing is back at character height.

```json
[
 {
  "at": "<plan word>",
  "pos": [
   0,
   -0.01,
   40
  ],
  "aim": [
   0,
   0,
   0
  ],
  "lens": 28,
  "framing": "W",
  "up": [
   0,
   1,
   0
  ],
  "hold": 1.0,
  "creep": 0.03
 },
 {
  "at": "<centre word>",
  "pos": [
   0,
   -5,
   2.0
  ],
  "aim": [
   0,
   0,
   1.0
  ],
  "lens": 28,
  "framing": "W",
  "travel": 2.2,
  "hold": 0.8
 }
]
```

### M18 HUGE-TINY VERTICAL TILT

Build: Crane (move pos up), not only tilt, so the climber stays readable.

Camera-safe: Low angle on a figure: STEEP/LOW flags in validate.mjs; keep the hero's face visible.

```json
[
 {
  "at": "<base word>",
  "pos": [
   0,
   -6,
   1.0
  ],
  "aim": [
   0,
   0,
   2.0
  ],
  "lens": 24,
  "framing": "W",
  "hold": 0.4
 },
 {
  "at": "<top word>",
  "pos": [
   0,
   -6,
   6.0
  ],
  "aim": [
   0,
   0,
   8.0
  ],
  "lens": 24,
  "framing": "W",
  "travel": 2.0,
  "hold": 0.8
 }
]
```

### M19 POV THROUGH THE OBJECT

Build: Camera inside or right behind the object; the object's rim is the foreground. A round mask is a 2D overlay.

Camera-safe: No face close to the lens; check FACE_HIDDEN on the subject.

```json
[
 {
  "at": "<aim word>",
  "pos": [
   0,
   -0.6,
   1.2
  ],
  "aim": [
   0,
   4,
   1.2
  ],
  "lens": 30,
  "framing": "W",
  "hold": 1.0,
  "creep": 0.04
 }
]
```

### M20 DISSOLVE WHILE FLYING

Build: End the old take mid-travel; start the new take mid-travel the same way; ep_dissolves [{at, frames: 8-12}] at the joint.

Camera-safe: Both takes: character height at the joint.

```json
[
 {
  "at": "<word>",
  "pos": [
   0,
   -5,
   1.6
  ],
  "aim": [
   0,
   0,
   1.5
  ],
  "lens": 28,
  "framing": "W",
  "hold": 0.3
 },
 {
  "at": "<new place word>",
  "pos": [
   0,
   -2.5,
   1.6
  ],
  "aim": [
   0,
   0,
   1.5
  ],
  "lens": 30,
  "framing": "M",
  "travel": 1.5,
  "hold": 0.6,
  "_note": "next take starts with the same direction of motion"
 }
]
```

### M21 MATCH DISSOLVE (SHAPE TO SHAPE)

Build: Shape centred at the same place in both takes; ep_dissolves 10-14 frames; keep a slow push through the joint.

Camera-safe: No face in the macro.

```json
[
 {
  "at": "<word>",
  "pos": [
   0,
   -0.01,
   1.4
  ],
  "aim": [
   0,
   0,
   0.9
  ],
  "up": [
   0,
   1,
   0
  ],
  "lens": 40,
  "framing": "P",
  "hold": 0.6,
  "creep": 0.05
 }
]
```

### M22 FOREGROUND WIPE

Build: An object moves across close to the lens; cut the take when it fills the frame.

Camera-safe: The wiping object never passes through a character.

```json
[
 {
  "at": "<word>",
  "pos": [
   0,
   -6,
   1.6
  ],
  "aim": [
   0,
   0,
   1.5
  ],
  "lens": 28,
  "framing": "W",
  "hold": 1.2,
  "drift": [
   0.6,
   0,
   0
  ]
 }
]
```

### M23 IMPACT KICK

Build: Top-level kicks [{at, amp}]; only on a real hit.

Camera-safe: Shake never moves a character.

```json
[
 {
  "_top_level": "kicks",
  "at": "<hit word>",
  "amp": 0.6
 }
]
```

### M24 TIPPED SWING (DUTCH IN THE MOVE)

Build: Use travel_roll on the move, never roll on a rest (gate: tilt while resting <= 0.5).

Camera-safe: Roll rate <= 1.1 deg per frame.

```json
[
 {
  "at": "<word>",
  "pos": [
   0,
   -3,
   2.4
  ],
  "aim": [
   0,
   0,
   1.2
  ],
  "lens": 28,
  "framing": "W",
  "hold": 0.4
 },
 {
  "at": "<danger word>",
  "pos": [
   1.5,
   -2.5,
   2.6
  ],
  "aim": [
   0,
   0,
   1.0
  ],
  "lens": 28,
  "framing": "W",
  "travel": 1.6,
  "travel_roll": 12,
  "hold": 0.6
 }
]
```

### M25 SAME MOVE, TWO SPEEDS

Build: Copy the station block; change only the subject and the travel time.

Camera-safe: As M15.

```json
[
 {
  "at": "<slow word>",
  "pos": [
   -2,
   -4,
   1.3
  ],
  "aim": [
   -2,
   0,
   1.0
  ],
  "lens": 30,
  "framing": "M",
  "hold": 0.2,
  "travel": 3.0
 },
 {
  "at": "<fast word>",
  "pos": [
   2,
   -4,
   1.3
  ],
  "aim": [
   2,
   0,
   1.0
  ],
  "lens": 30,
  "framing": "M",
  "hold": 0.2,
  "travel": 1.0
 }
]
```

### M26 END PULL BACK

Build: Last station loop: true ends on frame 0 (the hook picture).

Camera-safe: Hero at character height, result behind him, both in frame.

```json
[
 {
  "at": "<result word>",
  "pos": [
   0,
   -2,
   1.5
  ],
  "aim": [
   0,
   0,
   1.5
  ],
  "lens": 35,
  "framing": "C",
  "hold": 0.4
 },
 {
  "at": "<last line>",
  "pos": [
   0,
   -5.5,
   1.6
  ],
  "aim": [
   0,
   2,
   2.2
  ],
  "lens": 28,
  "framing": "W",
  "travel": 1.8,
  "hold": 0.6
 },
 {
  "loop": true,
  "travel": 1.2
 }
]
```

## 5. Tool gaps (to make every move copyable)

1. `follow` works for characters only. M09, M14 and M15 with a prop, an effect or a set line need pass-points every 0.5 s until film_plan.py gets follow for props, effect paths and set lines.
2. Curves (M11, M16) need pass-point stations; a spline option would make them smoother.
3. Travel over 3 s (M08, M09, M14) must be written by hand.
4. `frame_checks` and `validate.mjs` test only the rests; run them at 0, 25, 50, 75 and 100 % of each flight.
5. The plan gate "word stations not at rest on their word" forces a stop on every noun; it fights M09, M10 and M14.

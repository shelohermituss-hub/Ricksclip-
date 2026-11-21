# CAMERA NOTE, S2 THE SECRET (frames 288-474, plan rows 9-13). S2 stretch builder 2026-11-21, BOARD round
Built from the BUILT set (sets/town/out/town_meta.json + bl_town.py shop block): shop x -7..7, y -7.6 (window wall, glass x -4.7..2.7, mullions
x -4.8 / -2.4 / 0.4 / 2.8, door x 3.4) to -16.8 (back wall); floor top z 0.15; chart on the back wall at (-1.6, -16.72, 1.26-2.54); exam chair (-1.6, -11.4);
bay 1 truck (-4.2, 17.8) straight across Main St. Added in s2/sets/s2_shop.js: coat stand (2.2, -12.3), instrument table + clone of the set's desk lamp
(0.45, -11.2), toy on it until f405. Hero spot (1.2, -11.5). Camera v2, lens in mm on a 36 mm tall frame. Plan check: `plan_window.py` (see the end).

## One flowing idea: "follow the red out of the yard and into his hand"
From the street the lens holds the station with its finished lemon truck and the fireman crossing to his shop, backs away through the shop glass,
swings round him while he becomes the eye doctor, lands with the letter chart behind him, and pushes in to the one red thing in the room, the toy at the lamp.
ONE take, no cut inside, 2 flights (the long pull back + arc is one 3.5 s flight; the push in is the second).

| # | at (f) | pos -> aim (plan m) | lens | move id | rows | why, from this scene |
|---|---|---|---|---|---|---|
| A | 288, rest to ~301 | (1.2, -5.3, 2.1) -> (-3.0, 15.5, 1.75) | 22 | M00 living rest | 9 | the station across the street, the lemon truck finished in bay 1 (time has passed), the fireman jogging toward his shop on "But the fireman". S1 ends low in the yard on the lemon: the place changes, so the lead joins S1 to this with an 8-12 f blend on the motion (an exact S1 station D start made the planner start the pull back 3 s BEFORE f288). |
| B | 330 (lands, flowed) | (0.0, -14.2, 1.5) -> (1.6, -7.5, 1.3) | 22 | M04 pull back reveal | 9-10 | back through the window glass (crossing x 0.55, 9 cm from the mullion) into the shop: he stands by the chair in the white coat, the station through the window behind him, his helmet on the stand; coat tug on "job". |
| C | 362 (via) | (3.2, -12.9, 1.55) -> (1.2, -11.5, 1.5) | 24 | M11 truck arc (east side) | 10 | the arc keeps him in frame while it swings the room round; passes 1 m from the stand. |
| D | 395, rest to ~411 | (3.1, -9.7, 1.58) -> (0.53, -12.76, 1.3) | 26 | M11 lands, M00 | 11 | his front, the chart R / ED / GOES / FIRST behind his left shoulder, the stand with his helmet at the left edge; the knuckle flick on "eye" (385) is in the last 10 f of the landing ease. |
| E | 445, rest to 474 | (2.3, -10.0, 1.5) -> (0.95, -11.45, 1.42) | 28 | M09 push in, M02 creep (0.004) | 12-13 | in to face and toy at the lamp for "strange", rests and creeps in for the glance on "red"; the creep runs on into S3's push into the toy. |

## Attention chain, line 4 (rows 12-13, CB_RULES 11h.7)
1 FACE: he turns to the lamp (look -> lamp, f403), `think`. 2 HAND: the toy rises in his near fist to the lamp (405-417). 3 PROP: the toy truck in the cone.
4 CONSEQUENCE: out of the cone it dulls (436-446, its own paint), back in it is red. 5 REACTION: his eyes slide to the lens on "red" (453, `glanceCam`). One push (D -> E), one rest.

## Numbers
- `python plan_window.py` (the gates on 288-474 only; film_plan counts every gate from frame 0, so the 288 parked lead-in frames of a stretch fail
  first face / face share / speed median by themselves): **0 FAIL, 4 WARN of 42**. WARNs: v2 flowed B (the pull back wants 112 f, room 33: B is a pass, by design),
  v2 flowed C (hold 0, a via), rests per 10 s, longest-travel band.
- `film_plan.py check film.json --window 288-474` (whole file, with the lead-in): WINDOW speed p90 21.7 px/f PASS (<= 22), peak 33.8 WARN (<= 26) at the window
  crossing f332-336; FAILs left are lead-in gates (see plan_check.txt).

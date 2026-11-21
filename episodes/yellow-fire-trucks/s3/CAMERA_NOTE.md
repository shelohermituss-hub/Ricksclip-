# CAMERA NOTE, S3 THE CROSSING AT DUSK (frames 474-770, plan rows 14-21, lines 5-6). S3 stretch builder 2026-11-21
Built from the BUILT set (sets/town/out/town_meta.json + town_STORY.md): Main Street along X (asphalt y -5..5), Elm along Y (x 17.5..26.5), the white stop
bar on Elm northbound at y -6.2..-6.6 (x 22..26.5, the van's lane), the sodium lamp on the SE corner (25.3, -6.95, 7.05). Asphalt z 0. Camera v2, lens in mm on a 36 mm tall frame.
Staging (sets/s3_crossing.js S3, make_film.py): the red pumper races WEST along Main in the south lane (y -4.0) out of the long dark stretch with no lamp, brakes hard
and stops nose x 25.1; the milk van (nose north, x 24.3) creeps to the bar (f475-505), rolls on "kept" (f554-569) and its front RIGHT corner meets the truck's
bumper on "hit" (f569) at (25.05, -4.9). The Milkman stands at the wheel in the open door (west side, card at van x -0.8); the Sceptic drives (driver side = south).
After the bump the Milkman climbs out and stands in front of the truck's nose, north of his van (23.8, -3.3).

## One flowing idea: "the corner he pulls out from"
The lens never leaves the north-west corner of the crossing, the corner the Milkman looks out of. It starts there on a long lens down Main on the racing truck
(the match from S2's toy truck), widens onto the careful Milkman, drops low into the bump, rises up the stopped truck to its roof of sirens, sinks back past the
beacons to the man, and ends low in front of the truck nose, tilting up the thing he "never saw". ONE take, no cut, everything seen from the same corner.

| # | at (f) | pos -> aim (plan m) | lens | move id | rows | why, from this scene |
|---|---|---|---|---|---|---|
| A | 474 | (20.5,-5.1,1.3) -> (58,-4,1.7) | 50 | M09 match (piece 11), lens widens | 14 | the real truck down the dark street on a long lens |
| B | 508, rest ~532 | (20.4,-5.0,1.25) -> (30,-9.0,1.15) | 19 | M00 living rest | 14-15 | Milkman seated at the wheel, white bar, truck far down Main: look left "dusk", right "red" |
| C | 580, rest ~592 | (22.7,-3.4,0.85) -> (24.7,-5.6,1.05) | 22 | M03 hit on object, lands low | 16 | flies in through the bump (f569), at REST on "crossings" (f582): bumpers, hubcap, his freeze |
| D | 640, rest ~652 | (20.95,-2.4,1.5) -> (25.2,-5.1,2.15) | 18 | M13 rise | 17-18 | the rise passes the sirens on "screaming", lands on roof + beacons at the top and the Milkman lower right on "flashing" |
| F | 694, rest ~715 | (21.9,-1.8,0.55) -> (24.6,-4.0,1.2) | 24 | M00 low living rest | 19-20 | man small in front of the truck nose, Sceptic at the wheel; arms wide on "I never" |
| H | 752, rest to 770 | (22.5,-2.2,0.22) -> (25.0,-4.3,2.7) | 16 | M14 tilt up with the head | 21 | low and wide on "it"; the real cab is too small to fill the frame (STATE.md) |

Kick: f569 amp 3 with POWER 2 (no other shake).

## Attention chain, the bump (rows 15-16, CB_RULES 11h.7)
1 FACE: the Milkman's long look right at the truck (f530), then the nod (f553). 2 HAND/BODY: both fists on the wheel, the van rolls.
3 PROP: the bumper on the van corner (f569). 4 CONSEQUENCE: the hubcap leaves with sparks, passes the lens, rolls to rest. 5 REACTION: frozen, shoulders up,
then the bottle check (f591); the Sceptic's one brow (f572).

## The numbers (plan_check.txt, plan_check_shifted.txt; fix round)
- Absolute `--window 474-770`: 3 FAIL (two frame-0 artefacts; at rest while a face is on screen 22 %). WINDOW speed p90 10.0, peak 19.8 px/f.
- Shifted (check_shifted.py, the stretch alone): 0 FAIL, 7 WARN. proj_cast.py: rest + cast in frame on 582 and 644.

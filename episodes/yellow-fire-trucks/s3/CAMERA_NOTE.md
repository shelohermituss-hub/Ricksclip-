# CAMERA NOTE, S3 THE CROSSING AT DUSK (frames 474-770, plan rows 14-21, lines 5-6). S3 stretch builder 2026-11-21
Built from the BUILT set (sets/town/out/town_meta.json + town_STORY.md): Main Street along X (asphalt y -5..5), Elm along Y (x 17.5..26.5), the white stop
bar on Elm northbound at y -6.2..-6.6 (x 22..26.5, the van's lane), the sodium lamp on the SE corner (25.3, -6.95, 7.05). Asphalt z 0. Camera v2, lens in mm on a 36 mm tall frame.
Staging (sets/s3_crossing.js S3, make_film.py): the red pumper races WEST along Main in the south lane (y -4.0) out of the long dark stretch with no lamp, brakes hard
and stops nose x 25.1; the milk van (nose north, x 24.3) creeps to the bar (f475-505), rolls on "kept" (f554-569) and its front RIGHT corner meets the truck's
bumper on "hit" (f569) at (25.05, -4.9). The Milkman stands at the wheel inside the open door (west side); the Sceptic drives (driver side = south).
After the bump the Milkman climbs out and stands in front of the truck's nose, north of his van (23.8, -3.3).

## One flowing idea: "the corner he pulls out from"
The lens never leaves the north-west corner of the crossing, the corner the Milkman looks out of. It starts there on a long lens down Main on the racing truck
(the match from S2's toy truck), widens onto the careful Milkman, drops low into the bump, rises up the stopped truck to its roof of sirens, sinks back past the
beacons to the man, and ends low in front of the truck nose, tilting up the thing he "never saw". ONE take, no cut, everything seen from the same corner.

| # | at (f) | pos -> aim (plan m) | lens | move id | rows | why, from this scene |
|---|---|---|---|---|---|---|
| A | 474 | (20.5,-5.1,1.3) -> (58,-4,1.7) | 50 | M09 push-in match (piece 11), then lens widens | 14 | the toy truck of S2 becomes the real truck: down the dark street on a long lens, dull and heavy |
| B | 508, rest to ~547 | (20.4,-5.0,1.25) -> (30,-8.6,1.2) | 22 | M00 living rest | 14-15 | Milkman at the wheel in the open door, the white bar, truck far down Main behind him: look left on "dusk", right on "red" |
| C | 569 (via) | (22.4,-2.9,0.6) -> (25.1,-4.9,0.9) | 22 | M03 hit on object, low | 16 | the camera drops low onto the two bumpers for the bump; impact frame, hubcap leaves toward the lens |
| D | 613, rest | (23.3,-2.4,2.9) -> (26.3,-4.0,2.5) | 26 | M13 rise up the object | 17 | the rise up the stopped truck lands on the roof line: four sirens with sound rings, the bell below |
| E | 643 (via) | (21.2,-3.2,1.05) -> (25.0,-5.6,1.75) | 20 | M02 sink | 18 | on the way down: beacons at the top, the Milkman small behind his windscreen |
| F | 694, rest | (21.2,-1.2,0.5) -> (24.6,-4.0,1.2) | 22 | M00 low living rest | 19-20 | man small, truck nose huge; Sceptic over the wheel; arms wide, eyes to the lens |
| G | 766 | (22.2,-2.0,0.25) -> (24.3,-4.0,1.6) | 18 | M14 tilt up with the head | 21 | the camera sinks and widens as his head climbs the truck; the truck fills the frame and out of the top |

Kick: f569 amp 3 with POWER 2 (no other shake).

## Attention chain, the bump (rows 15-16, CB_RULES 11h.7)
1 FACE: the Milkman's long look right at the truck (f530), then the nod (f553). 2 HAND/BODY: both fists on the wheel, the van rolls.
3 PROP: the bumper on the van corner (f569). 4 CONSEQUENCE: the hubcap leaves with sparks, passes the lens, rolls to rest. 5 REACTION: frozen, shoulders up,
then the bottle check (f591); the Sceptic's one brow (f572).

## The numbers (see plan_check.txt and plan_check_shifted.txt)
- Absolute check `film_plan.py check film.json --window 474-770`: 3 FAIL. Two are artefacts of the absolute frame numbers (the film-wide gates count from frame 0,
  and S3 has nothing before 474): "face on screen, first 15 s" and "longest stretch without a face 14.7 s". The third, "at rest while a face is on screen 24 %"
  (target >= 40) is real: rows 16-18 are a moving camera on objects with his face small in frame. WINDOW speed p90 13.5, peak 21.1 px/f (PASS).
- The same film shifted to start at 0 (check_shifted.py, measures the stretch alone): 0 FAIL, 12 WARN.
- v2 moves the via points C and E later than their word (it wants 48-67 f travels); the key frames are taken where the row's picture is.

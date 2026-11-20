# CAMERA NOTE, S1 THE HOOK (frames 0-288, plan rows 1-8). S1 stretch builder 2026-11-20
Built from the BUILT set (sets/town/out/town_meta.json anchors): hero truck at bay1_truck (-4.2, 17.8), nose south (y 14.0), driver side (gold
lettering, pump panel) facing +x at x = -3.2; the Chief's red pumper in bay 2 (4.2, 22.35); yard concrete top z = 0.14. Camera v2, lens in mm on a 36 mm tall frame.

## One flowing idea: "follow the lemon"
The lens is led by whatever is lemon. It starts on the wet lemon edge eating the red (the stroke), backs away along it until the whole gift-wrapped truck
is in, swings round past the truck to bay 2 where the red pumper's owner bursts out, and ends down on the ground with the one other lemon in the yard,
the real one, as big as the truck's lemon half. ONE take, no cut, 3 flights.

| # | at (f) | pos -> aim (plan m) | lens | move id | rows | why, from this scene |
|---|---|---|---|---|---|---|
| A | 0, rest to 54 | (-1.35, 13.0, 1.14) -> (-2.75, 16.9, 1.84) | 24 | M00 living rest | 1-3 | frame 0 = the hook: doer, gun, both fists (gun + hose), mist and the red/lemon edge, the three frozen firemen behind him, the paint tin near the lens. The stroke itself is the action, so the camera only creeps; rows 2-3 (grab, painted) play inside this rest. |
| B | 120 (via) | (-1.6, 10.2, 1.34) -> (-3.0, 16.0, 1.74) | 20 | M04 pull back reveal | 4-5 | "brand new firetruck": the pull back starts as the stroke crosses the door and reveals the whole new truck (price card, sirens, the stool with the scissors on the cushion); he steps back and judges (127) while we pass the wide. |
| C | 165, rest to 231 | (1.45, 14.9, 0.74) -> (0.5, 17.6, 1.24) | 22 | M11 push + truck arc, then M00 | 6-7 | the flight swings right round the truck to bay 2 and lands low on the Chief 7 f before "exploded"; it rests on him for the quote and the stamp on "RED" (boots + lunch box in frame, the lemon truck behind his shoulder). |
| D | 272, rest to 288 | (2.2, 14.02, 0.30) -> (-0.15, 18.1, 1.30) | 22 | M02 push in to land (sinking) | 8 | the camera sinks with the rolling lemon and lands with it at the lens on "lemon": real lemon, lemon truck and his pointing fist in one picture. |

Kick: film.json kicks f172 amp 3 (the planner's 7-frame decaying kick), with POWER 1 (no other shake).

## Attention chain, the Chief's beat (rows 6-8, CB_RULES 11h.7)
1 FACE: he bursts out of bay 2 (f160-170), eyes wide on the truck (frozenWide), the camera landing on him (f165).
2 HAND/BODY: the POWER 1 jump (f172), both fists flung out, then the two-fist STAMP on "RED" (f223).
3 PROP: the Old-Timer's lunch box at his boots hops (f223-233).
4 CONSEQUENCE: the lemon hops off, rolls 2.7 m to the lens (f235-262), one wobble; the camera sinks with it (flight C->D).
5 REACTION: his stiff arm points at the truck on "giant" (f262); the Old-Timer's browUp (f230). The Old-Timer's slow look "lemon, then truck" at 10.0 s is after this stretch (S2 starts 9.60).

## The numbers (film_plan.py check --window 0-288): 0 FAIL, 4 WARN of 44 gates
- WINDOW speed p90 14.2 px/f, peak 15.0 (plan estimate; <= 22 / <= 26). At rest 51.6 %.
- WARN v2 "station B flowed through as a via point": on purpose. The wide is a pass on the way round to bay 2; a rest there would leave the Chief's
  burst and the 8 quiet frames before "exploded" to a rushed flight (v2 wants 87 f for C, the room is 45 f).
- WARN speed median 1.98 px/f (Rick ~4): the stretch is 52 % rest because the hook stroke and the quote are acting beats; the creep is raised to 0.0028.
- WARN speed p90 14.2 (Rick ~23): fine for the lean gate (<= 22); this stretch has no long chase.
- WARN "sentences table missing": story gates not run (rows checked by hand in the line check).

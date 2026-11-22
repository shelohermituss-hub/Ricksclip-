# CAMERA NOTE: plane-eater S1 THE HOOK (frames 0-256, rows 1-9), S1 builder 2026-11-22
One take, one place (the Villebrune apron, morning sun from the south-south-east). Camera v2, 6 stations, 2 of them via points. Plan check:
`python tools/film_plan.py check film.json --window 0-256` = 0 FAIL (plan_check.txt). Window speed p90 21.7 px/f, peak 22-25 px/f (plan estimate).

## Idea
"The meal and the diner": the camera stays beside Michel at his eye level and turns with his look: from his salting hand to the whole plane
he is measuring, back onto his face for the idea, down past his trunk to the saw, out to the whole plane with its first cut, and in to the plate.

## Stations (row -> move, attached to, reason)
| # | at | rows | move (11h) | attached to | reason in this scene | focus |
|---|---|---|---|---|---|---|
| A | f0, rest to ~f39 | 1-2 | M00 living rest + M01 creep | Michel's face + the salted wing tip | frame 0 = the strange act with the hero object: a man seasoning an airplane | the shaker |
| B | f82, rest 0.2 s | 3 | M11 push + truck along his eyeline (reveal) | his look along the wing | "looked at an airplane": the whole Cessna F-MIAM must be seen once, whole, before it is eaten | the plane |
| C | f124 (arrives ~f119), rest to ~f146 | 4-5 | M02 push in, lands on the face | his face | "thought" + POWER 1 "Lunch!": the idea is the beat; impact frame f121-123 is in the rest | his eyes |
| D | f178 via (hold 0) | 6-7 | M04 pull back from the trunk front + M10 face -> hand -> blade | the trunk front, the saw | "Michel Lottito": the name in the world (MONSIEUR MANGETOUT on the trunk) then the careful saw | the blade |
| E | f205 via (hold 0) | 8 | M05 pull back | the plane + the owner | "a whole Cessna": the meal's size against the man; the owner jolts | the cut |
| F | f238, rest to the end | 9 | M02 push in, lands on the plate | the tongs and the plate on the wing | "tiny metal bites": the bite must read small and neat | the plate |

## WARN read (plan_check.txt)
- Stations D and E are via points by design (one flowing pull-out and push-in from the face to the plate, CAMERA rule "flows through").
- B is framed 'P' (the plane is the subject of that word, Michel at the right edge); E as well.
- Mood changes per minute below Rick: one light change (POWER 1 flash) in 8.5 s; the light stays the morning sun in this stretch.

## Weak (camera)
- Station heights are capped by the 10-degree down-angle rule to Michel's chest: with Michel on his trunk the lens sits at 2.05-2.2 m, the
  height of the wing (1.92-2.01 m), so the wing reads edge-on, a thin pale line beside his face, not the white top surface. See STATE.md.
- B lands with Michel at about 26 deg right of centre (inside the frame at 16 mm, but near the edge while the camera travels into C).
- The crane up of row 8 (M05) is only 5 cm: a higher lens breaks the down-angle rule on Michel.

## FIX ROUND 1 (lead decision 2026-11-22, option b)
- WAIVER, frame 0 and the hook rest only (f0 to about f39): station A at 2.75 m looks DOWN on the sunlit white wing top (down-angle on Michel's
  chest above 10 deg). Reason (lead): the joke is the wing top; Michel glances UP at the lens (k:glanceCam) so his face reads. No other station is waived.
- Rows 6-9 are now TWO CLOSE rests (lead order): D f182 the hacksaw on the cut line with aluminium dust; F f238 the tongs and the plate on a pedestal
  side table at his chest. Station E (the row-8 wide pull back) is REMOVED: with it the window speed p90 was 24-25 px/f (FAIL); without it 18.6.
  Row 8 ("a WHOLE Cessna") now has no wide shot; the owner's jolt happens off frame. Open for the lead.
- Plan gate "shot mix" FAIL (close 29 % of this window; target <= 7 % of the whole film): WAIVER, the lead ordered rows 7 and 9 as CLOSE; the
  gate is a whole-film share and 8.5 s of one stretch is not the film. Head cut by the edge in the two closes (plan estimate 33 % of face frames) is
  the close framing on the hands and props; frame_checks decides per rest (no waiver for a head cut there).

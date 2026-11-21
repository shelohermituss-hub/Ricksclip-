# CAMERA NOTE, S8 THE PAYOFF (frames 1754-1898, plan rows 54-58). S8 stretch builder 2026-11-21, BOARD round
Built from the BUILT set (sets/town/out/town_meta.json): the Chief's pumper sits INSIDE bay 2 (centre 4.2, 22.35; nose at the bay mouth y 18.55; driver
door about (5.2, 19.75) facing +x); the white yard line runs x 4.2 from y 7.9 straight into that nose; the lemon truck stands OUT in front of bay 1
(-4.2, 17.8, side at x -3.0); station side door + wall lamp at (9.3, 20.3). Yard top z 0.14. Camera v2, lens mm on a 36 mm tall frame.

## Idea: "the colour leaves, then the man walks into what is left"
Close on the red door, the red drains, pull back to the yard at dusk, ride his eyes up the white line, crash back out to the poster.

| # | take | at (f) | pos -> aim (plan m) | lens | move | rows | why |
|---|---|---|---|---|---|---|---|
| A | s8a | 1754, rest to ~1777 | (6.3, 18.95, 1.32) -> (5.2, 19.95, 1.12) | 30 | M09 push + colour change on the object | 54 | the S7 join lands on a red door panel; on "evening" (1768-1777) the paint itself drains to grey-plum (s8_yard.js DRAIN), gold lettering stays |
| B | s8a | 1806, rest to 1835 | (10.6, 14.9, 1.42) -> (0.6, 17.6, 1.25) | 22 | M04 pull back reveal | 55, 56 | the yard at dusk: Chief marching side on up the line, hero + mug front right, lemon truck + firemen back left; fist goes out on "beautiful" |
| C | s8b | 1836, rest to ~1852 | his eyes (follow: chief) -> 20 deg left of the line | 18 | M21 POV ride | 56-57 | brim, moustache, lids, fist, knees; the line runs from his toes into the grey shape, the lemon truck at the left edge |
| D | s8b | 1876, rest to 1898 | = B (lens 24) | 24 | M26 crash pull back (whip: true) | 58 | POWER 5 on "into"; the last picture rests 0.73 s, slow drift |

## What does NOT work (numbers, film_plan.py check --window 1754-1898, plan_check.txt)
- WINDOW p90 64.2 px/f (FAIL, <= 22), peak 68.4. Cause: the plan asks for 4 framings in 4.8 s (close door -> wide -> inside his eyes -> wide). v2 wants
  89 f for the close-to-wide pull back (room 29 f) and 138 f for wide-to-eyes (room 30 f). Not fixable by tuning: a framing has to go.
- The take change at 1836 is a HARD CUT into the POV (rule: no cut inside a stretch; POV entered through the eye). It is there only so the board
  can show the POV frames. The whip out of his eyes is stretched to 24 f (1852-1876): "straight" (1864) falls inside the whip, not in the POV.
- Whole-film gates (rests per 10 s, speed median, dead still, faces in the first 5/15 s, shot mix, moods) FAIL on the 0-1753 range that belongs to
  S1-S7 (the parked "pre" take): the known artefact of a mid-film stretch (fake-surgery s2/s5 STATE.md). "camera goes around a figure" FAIL 1: the whip.
- Proposals for the lead / camera-director (pick one): (1) drop the door close: start S8 already wide in the yard and let S7's red drain on a
  door panel in S7's own last frames (the join = a match on the panel); then B -> POV has 48 f more; (2) enter the POV through the lemon-lit
  glint on his helmet brim as a 10 f blend (needs the kit to blend inside a stretch); (3) keep the POV only for row 57 and play row 56 in the wide (as now).

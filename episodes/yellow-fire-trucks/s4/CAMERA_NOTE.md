# CAMERA NOTE, S4 THE IDEA SPREADS (frames 770-969, plan rows 22-27). S4 stretch builder 2026-11-21, BOARD round
Built from the BUILT set (sets/map/out/map_meta.json): PINE HOLLOW station (2.478, 0.025, base .058), doors on y -0.365; ST. LOUIS (3.055, 1.514), doors y 1.124,
index 13; paper height = map_geo.fold_z + 7 mm. People at station scale x0.088 (= META truck_scale): firemen about 15 cm. Camera v2, lens mm on a 36 mm tall frame.
## One flowing idea: "the idea leaves the town and comes back home as lime"
Close over the printed plan of the home town, rise and tilt up so it becomes one station among many as the doors roll, drop to the nearest station where
the Painters work, then sink home to the three firemen at the open door. ONE take, no cut; 3 flights.
| # | at (f) | pos -> aim (map m) | lens | rows | why, from this scene |
|---|---|---|---|---|---|
| 0 | 0 | = A | 24 | - | lead-in anchor (s2 trick): the rise cannot start before 770 |
| A | 770, rest 0.5 s | (2.55, -0.95, 0.85) -> (2.48, -0.12, 0.06) | 24 | 22 | the printed PINE HOLLOW plan + home station; the lead cross-fades S3's town into it |
| B | 833 (via, hold 0) | (3.45, -0.30, 0.78) -> (2.85, 1.9, 0.05) | 24 | 22-23 | the rise over the Midwest stations on "cities"; chained into the next flight (0.5 s from "cities" to "painting" leaves no room for a rest) |
| D | 876, rest 0.12 s | (3.18, 0.78, 0.19) -> (2.99, 1.05, 0.16) | 26 | 24-25 | the Painters in the ST. LOUIS bay mouth, lime band 862, all noses lime 870-886 |
| F | 934, rest to 969 | (2.455, -0.80, 0.165) -> (2.425, -0.50, 0.17) | 24 | 26-27 | three firemen in front of the home door (up 912-917 on the lime truck), Rookie centre; creep .005 |
## Numbers (plan_window.py = the gates on 770-969 only; plan_check.txt = the real file with --window)
- plan_window: **2 FAIL**, 5 WARN of 42: speed median 10.45 px/f (FAIL > 8.1; Rick 4) and heads in the caption band 8.9 % (FAIL > 8; the Painters low in frame
  during the B -> D descent). WARN: v2 flowed B (by design), first face 2.27 s, face first 5 s 37 % (rows 22-23 have no face by the plan), head cut 23 %.
- real file --window: WINDOW speed p90 22.4 px/f (FAIL, aim <= 22, 0.4 over), peak 22.8 PASS. Its other FAILs are the 770 parked lead-in frames (s2 LECONS).
- Why it is busy: the plan asks for wide on "cities" (27.78) and close on "painting" (28.28) and home on "firemen" (31.06): three places in 6.6 s. Fix options
  for the lead: (1) let row 24's close come at "trucks" (28.86) instead of "painting"; (2) a whip (capped 9 f) B -> D; (3) drop the A close (start S4 on B, S3 rises into it).

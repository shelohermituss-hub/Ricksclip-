# STATE: PLACE C, airliner cabin row (set-builder round 1, 2026-11-21). Sheet: CABIN_SHEET.jpg (4 tiles, looked at). NOT DONE.
## NOT done / still weak (seen in the sheet)
- CAM_TWO (row 35) renders BLACK: the camera sits inside the backrest of seat 8D (x .55, y -.6). Move to the aisle: pos (.45, .15, 1.3), aim (-.05, 1.1, .9).
- Whole cabin OVEREXPOSED (mean .79-.82, whites clipped): cove fill 2 x 140 W -> 2 x 30, world .9 -> .35, sun 5.5 -> 4. Windows read flat white:
  no clouds or wing seen in any tile.
- CAM_WINDOW (row 38) is blocked by the seat back of row 0 at 0.3 m: the bitten wing is not seen. Needs a station at the window seat looking out
  (e.g. pos (-.1, 1.0, 1.05) aim (.6, 3.0, .6), lens 24) and a check that the bite at y 6.4 sits in the window view.
- Tray table hangs too low/far from Michel's seat (reads beside the seat); meal reads small and pale; the bite on tray_table_bitten is not readable at CAM_TRAY.
- Gates (density_check --day): two 1/7 (black), tray 3/7, traybitten 3/7, window 2/7; edge .050-.051 vs bar .086.
- Kit module cabin.js: syntax-checked only, not rendered. No airline name on the headrest covers (lead to decide).
## Built
- scripts/tex_cabin.py (carpet, blue weave fabric, sky gradient, SAFETY card), scripts/bl_cabin.py, build_cabin.sh; out/cabin.blend (cams CAM_TWO, CAM_TRAY,
  CAM_WINDOW), out/cabin_lite.glb (7.2 MB), out/cabin_meta.json (anchors, cams, states). ../cabin.js (bitten, foil, pea, keys). ../cabin_STORY.md, ../cabin_DRESSING.md.
- 5 rows x 5 seats (A B | D E F), armrests, bins + latches, PSU (gaspers, reading lamps, belt signs, row numbers 12-17), cove light, curved sidewalls with
  superellipse windows (bezel, reveal, glass, shades), tray table whole + bitten (boolean crescent with tooth scallops), grey meal (tray, dish, stew, 14 peas +
  runaway pea, foil on/lifted, roll, butter, cup, cutlery pack, napkin), outside: swept wing with a crescent bite at the leading edge (y 6.4), canoes, winglet,
  nav light, engine + pylon, 70 cumulus heaps, sky dome.
## Numbers
- Triangles: cabin 132,290; outside 62,296; total 194,586. GLB 7.18 MB. Previews 30-53 s a tile.

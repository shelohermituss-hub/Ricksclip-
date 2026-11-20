# STATE set helper B2 (2026-11-16): stairwell.js + waiting.js (one build round)
Files: sets/stairwell.js, sets/waiting.js (keys/anchors/stations in each file's top comment; export STATIONS), sets/_b2_test/ (film.json, run.sh, measure.py, out/, sheet.jpg, numbers.txt).
Surfaces: all from look_pack.js (M.block, dadoTile, terrazzo, steel/chrome, paint, carpet, ceilPanel, plasticOrange/Teal, rug, LP.sky texas/coral, LP.applyLight).
Props: hero_props.js buildCane (cobweb+spider+dust), buildPainDial (scaled 1.35, needle key), buildHandrailSign (spin key) are imported; local stand-ins only if missing.
Sets are built at world.js ORIGIN (+180 / +240 in x); each set re-aims the kit sun (and its shadow box) at its own origin. Stations/anchors are ABSOLUTE plan metres.
Light key: the set reads place.light_kind || place.light ('evening' = EV); PLACE_KEYS uses light 'day' + light_kind, so use light_kind.

## Stairwell layout (local)
Hall x -2..2, y -4.6..4.6, ceiling 6.6. Flight 1 right (x .2..2) climbs +Y from y 0 to the full-width half landing (z 1.6, y 2.7..4.6) under the tall
window (x -1.6..1.6, z 2.1..6.1, back wall). Flight 2 left climbs -Y to the storey-2 slab (left half, z 3.2, y -4.6..0). Under flight 2 = closed cupboard
(end wall facing the foot: stencil "1", cork board). Fire door on the left wall at ground y -2.2 (door key 0..1, corridor stub behind, green EXIT). Newel + cane at the
foot of flight 1 (x .23, y 0). Sign on the right wall at y -.45 z 1.78; pain dial right wall y 2.05 z 2.35 (beside a climber near the top of flight 1).
Climber feet anchors: f1_<1..9>_<w|r>, land_0..5, f2_<1..9>_<w|r>, s2_0..3, and ordered list `climb` (row 50 stream).

## Measured (ungraded, scale .5; sets/_b2_test/numbers.txt)
stair AF wide: sat .466 bright .437 dark1% .093 red 0 · edge .179 · density_check 6/7 (G6_fine fail)
stair EV last_low: sat .597 bright .390 dark1% .065 red 7 px (thin vertical line in the coral window, x258-268) · edge .133 · 4/7 (G1, G6, G7 haze fail)
waiting AF wide: sat .401 bright .489 dark1% .154 red 0 · edge .148 · 6/7 (G2 shapes 752 fail)

## Weak / open
- EV last frame: the storey-2 slab + guard fill the upper left; flight 2 is hidden behind the cupboard, so the stream reads up flight 1 + across the window only.
  Option for S5: place key hide ['storey2_slab','storey2_terrazzo','storey2_guard_*'] or a camera further right.
- EV red 7 px: coral sky through glass (look_pack 'coral' sky band near hue 7 deg); ask look helper to pull that band to hue >= 18.
- Stairwell big plain block walls: G6 fine-detail fails; more wall life needed (signs, pipes are in; notices, fire alarm box (not red), handrail wear).
- Waiting room: ceiling grid takes the top third at the wide; gang-d chair orientation in foreground to be checked in a crop (should show its back).
- No side-by-side vs Rick frame or close-up detail crops made this round (time cap); no cast in the stills (no climbers/boy yet).
- STORY.md / DRESSING.md not written (owner list allowed only these files); dressing notes are the file top comments.

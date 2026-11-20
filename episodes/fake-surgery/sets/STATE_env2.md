# STATE env helper E2 (2026-11-17): ENVIRONMENT v3 for or_room.js, stairwell.js, waiting.js (one round)
Key: `env_v3: true` on the place block (default OFF; with it off the three sets build exactly as before). Wrappers (s3_wrap, waiting wrap:) pass the same place block, so the key reaches the base set.
What each file gets is listed in its top comment ("ENV v3 key"). Code = one `if (pl.env_v3) { ... }` block per file (OR: before `const d3`; stairwell + waiting: before the return; their update now also runs env micro motion).

## Adds (short)
- OR 3: tile colour band, anaesthesia drug cart (drawers, 3 dials, vitals unit, sharps, syringes), whiteboard "OR SCHEDULE TUE" (OR 3 8:15 KNEE SCOPE), ceiling gas pendant + 4 coloured hoses (sway),
  suction unit, back table with drape/instruments/basin/"KNEE SET", linen hamper, 2nd kick bucket, 2 glass-door cabinets with labelled boxes, OXYGEN IN USE sign, wall phone, sharps box,
  thermometer, orange outlets, 2nd X-ray viewer, floor cables + power strip + cable cover, laminar diffuser + seams, speaker, smoke detector; cool tile bounce light (lilac at evening).
- Stairwell: blue wayfinding stripe, STAIR B / 1 FLOOR sign, fire exit plan, TAKE THE STAIRS! poster, landing notice case, FLU SHOTS poster, stainless WATER extinguisher + FIRE HOSE label,
  warm light pools under the caged lamps (flat decals), scuffs/heel marks, landing plant (tremble), view out (oaks + visitor parking; evening sodium lamps), venetian blinds (sway),
  steel pipe guard (foreground posts), cool dado bounce + landing fill.
- Waiting: wallpaper border + peach band, snack vending machine, 3 Texas prints, CHECK IN on the glass + PLEASE SIGN IN card, TV card "CHANNEL 11 4:00 NEWS ... 1994", kids' drawings,
  toy box/teddy/ball/plane, 3 plants (tremble), coats on chairs, purse, HOUSTON POST, tote, foam cup, magazine covers, soffit + 4 downlights, 2 diffusers with streamers (flutter),
  water stain, speaker, smoke detector, hanging EXIT sign, T-bar grid toned down, cool fluorescent fill.

## Proof: sets/_env2_test/ (run.sh, film.json, names.json, measure.py, numbers.txt, sheet.jpg 1500 px; ./sets is a JUNCTION to ..: never rm -rf)
Same camera before/after (scale .5, ungraded): sat / bright / red px / edge(detail_density)
- OR s1 f0 cam:   .656/.349/0/.178  ->  .630/.373/0/.187
- OR wide cam:    .555/.390/0/.239  ->  .533/.411/0/.245
- SW wide_af:     .466/.437/0/.179  ->  .407/.464/0/.192
- SW last_low EV: .596/.390/7/.134  ->  .529/.407/19/.152  (7 px = the coral window band known from B2; +12 px new, x 270-427 = right wall: likely the orange poster heart or the warm lamp pools under coral light; view tint change did not move it, numbers2.txt)
- WA wide_af:     .401/.489/0/.148  ->  .390/.495/0/.160   (after T-bar tone-down: .392/.493/0/.159, numbers2.txt)
Colours (16-level) up in every frame (+30..+86). density_check G6_fine still FAIL on most (as before).

## Weak / open
- The test stations see little of the new walls: OR stations face the back wall (side cabinets, hamper, back table mostly off-frame); stair wide/last_low see poster/plant/guard small;
  the window view is mostly hidden behind the landing geometry from these stations; waiting wide_af crops the vending machine to the right edge, kids' corner is behind the lens.
  Stretch cameras that turn will show more; at these stations the gain is moderate, not a transformation.
- Saturation drops .01-.07 (more neutral greys/whites added). Stretches may need the grade to keep the LOOK_BIBLE saturation.
- Stairwell EV red px: coral sky band (look_pack 'coral', hue ~7 deg): needs the look owner to move it to hue >= 18.
- Upper stairwell block (z 3-6) still plain; upper OR tile wall above the X-ray box still plain.
- No Rick side-by-side or close-up crops this round (time cap).

# props-hero check, style test (2026-11-21)
Side by side: `crew/props-hero_vs_rick.jpg` (top: ours car left, Rick car science f_0021 right, PRIVATE; bottom: hood foam macro, nozzle macro).
Proof sheet: `props/PROPS_SHEET.jpg` (12 tiles, Cycles 16 spp, 400 px, plain grey ground, LAYOUT sun, flat sky).

## Detail number, car close-up (tools/measure/detail_density.py, same-size crops 540x377)
| | edge density | regions | fine regions | colours (>=0.1 % of crop) |
|---|---|---|---|---|
| ours | 0.0685 | 869 | 801 | 233 |
| Rick | 0.0701 | 818 | 708 | 249 |
| ours / Rick | 98 % | 106 % | 113 % | 94 % |
All >= 90 %: PASS. Parts by eye: ours bumpers, grille (38 bars), hood ornament, 2 headlamps + hoods, side spears, 4 whitewalls + hubcaps, wipers, mirror, plate, interior seats/dash; Rick: grille, LED strip, rims, mirrors, seats, dash screen. Ours >= his.

## Gate
- Hero (car) part count >= Rick's: yes (809 objects, 164k triangles after letter blanking). Shiny streak: yes (sky/sun streaks on hood, fenders, chrome).
- Five details per object: PROPS.md. Lettering: "27" on the mailbox; brand letters, author plate and logo blanked.
- Held props: sponge -> grandpa hand 1, nozzle -> kid hands (LAYOUT points); no prop flies in (one still).
- Ground: every ground prop min_z 0.000 (bucket -0.007 = drip-trail blobs sunk 7 mm, on purpose). Hose never below ground (min 0.0001).
- Phone check: props alone read at 400 px tile size; the in-frame phone check belongs to the assembled still (look-finisher).

## Still below Rick / open
- Water arc and drops: placeholder clear material, thin at sheet size; reads only once the look-finisher shades it (glints, mist).
- Wet streaks on the hood: barely visible under flat sky; they need the house/sky reflections of the real scene to read.
- Sponge pores only read in a macro.
- Bike lying 0.5 m from the hose reel path and next to the bucket zone: check in the layout camera (the assembler).

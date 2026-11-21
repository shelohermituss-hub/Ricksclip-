# props-hero check, 2026-11-21 (Cessna 150 F-MIAM + states)
Side by side: crew/props-hero_vs_rick.jpg (git-ignored; ours left = side view crop of props/tiles/B_side_final.png, Rick right =
"He Survived Falling Out Of A Plane" t=57 s, his blue hero car, the closest hero-vehicle side shot in references/video; private).
## Gate numbers
| gate | ours | Rick | result |
|---|---|---|---|
| visible real parts (count by eye, side view) | 22: fuselage, wing, 2 struts, fin, rudder, stabiliser, elevator, 2 prop blades, spinner, cowl, 3 tyres, 3 hubs/spats, gear legs, door, handle, 4 glass panes, cheat line, F-MIAM x2, 2 seats, yokes | 14: body, 4 glass, 2 doors, 2 handles, mirror, 2 wheels, 2 hubs with lug nuts, seat, wheel | PASS |
| detail_density edge (crop) | 0.054 | 0.158 | FAIL (34 %) |
| detail_density regions / fine | 660 / 597 | 1237 / 1153 | FAIL (53 %) |
| shiny metal streak | chrome spinner + handles, spec px 1-2.7 % per tile (A 1.0 %, B 2.7 %) | yes | PASS |
| lettering from this story | F-MIAM navy, both fin sides + both fuselage sides | - | PASS |
| model tris | 185,052 (intact) | - | above Po-2 38k |
| light | rick_light.json day, Standard, camera-ray sky, flat_lawn, 32 spp + OIDN, 540x960, no grade | | as asked |
Why the density fails: the proof tiles stand the plane on an empty flat lawn under a flat sky (the lead's spec), and the plane is
small in a 540 px portrait tile; his crop has a carved rock wall behind the car. Plane-only detail is higher than his car, but the
number is measured on the crop as the rule says: BELOW RICK on edge density / regions until it stands in the dressed airfield set.
## Five details per main object
- Cessna intact: 1 navy F-MIAM bold letters on fin + fuselage, both sides; 2 navy cheat line and spat stripes on clean white gloss;
  3 chrome spinner and door handles with a sun streak; 4 V wing struts both sides (right one mirrored, the asset had one) + spring gear legs
  with spats; 5 normal-map rivet rows/panel seams + cabin with 2 leather seats and yokes behind clear glass.
- Sliced: 1 9 even slices, 0.22 m gaps; 2 bare aluminium cut faces; 3 pine sawhorses (beam, 4 splayed legs, stretcher) under the 7 slices
  with no full wheel; 4 the wing cut chordwise with the plane; 5 nodes slice_0..8 so the kit eats from the tail.
- Wing-off: 1 stub sawn in 5 stepped squares (0.10-0.46 m); 2 aluminium faces; 3 left strut + left spat gone (no floating strut);
  4 outer panel 2.2 m lying flat on the grass; 5 right wing untouched.
## Phone check (360 px)
Hero 3/4 and side read as "white plane" in black fill; letters F-MIAM read on the macro and the fin of the side tile, too small at
360 px in the wide tiles (fine: the film frames are closer). One focal point per tile.
## Still below / open
- density numbers above (needs the set); instrument panel plain dark grey (no 1970s dials: needed for CREATIVE idea B cockpit shot);
- the asset is a 172SP: rear side windows and modern wheel fairings stay; 150-only details (smaller cabin) not modelled;
- nose-only slice stands on a tall sawhorse (plausible, slightly odd); a tyre sliver from slice 2 lies on the grass in the half-eaten state;
- sky flat without cumulus in the proof (set-builder's job in the scene); salt shaker / bites / plate etc. are SPEC only (PROPS.md).

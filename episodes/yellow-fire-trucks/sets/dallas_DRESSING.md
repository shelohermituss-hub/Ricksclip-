# PLACE B, DALLAS yard: dressing, stand-ins, micro motion and air life (set-builder, 2026-11-21)
Most parts are already ready-made CC0 Poly Haven models (assets/ASSETS.md DALLAS SET). Coded stand-ins and the model each could become:
| coded part | five details built | could become | material kind |
|---|---|---|---|
| station (stucco, 2 bays, office wing, shed) | parapet with galvanised coping; navy bay jambs + head trim; roll-up shutters in drums with slats, bottom bar and tracks; bollards at the jambs; downspouts with splash blocks | stays coded (story building) | tinted Poly Haven stucco, shutter, block |
| front band DALLAS FIRE DEPT. + STATION 14 plate | hand-painted wobble letters; sun fade and flakes; navy trim rails; enamel plate with border; chrome screws | stays (story lettering) | painted texture |
| tally boards RED / LIME | slate with eraser smears; chalk heads + ticks in fives (never numbers); pine frame of 4 battens; nail heads; chalk ledge with sticks | a CC0 large blackboard if one appears (Poly Haven's is 0.9 m) | slate PNG + pine |
| red stack (boards 2, 3 + UP TO 3x) | odd crooked battens of two woods; longer easel posts and rear legs per level; guy ropes to pegs; chalk dust at the foot; ladder against it | same | same |
| 4-leaf calendar | navy header YEAR n; month grid; crosses; card back; nail + string on a batten | same | paper PNG |
| water cooler | galvanised can with 3 bands; lid + knob; chrome tap; tin cup on a chain; wet patch under the tap | Sketchfab CC-BY galvanised water cooler (search not done) | galvanised metal |
| water tank (far) | 4 legs with girts + X braces at 4 levels; riser pipe; balcony with 24 rail posts; ladder rungs; cone roof | stays (far, background-painter may paint over) | pale paint |
| oil derrick + 3 pump jacks + 3 oil tanks (far) | tapered 4-leg lattice, 9 levels of X braces; crown block; drill floor; corrugated shed; nodding beams with horse heads | stays | rusty paint |
| low skyline | 11 towers with set-back tops, 2 spires; 30 low far blocks; three haze colours by distance | background-painter's layer | flat haze colours |
## Micro motion of the world (out of phase; all frozen when place.still = true for the STILLNESS 57.75-58.45). Grass/halyard/pump jacks NOT rigged yet (open); FIX 2: the kit air life IS built (below) and the still switch works (place.still true | [t0, t1]).
- flag pole halyard ticking against the pole (2 ropes, 1.3 s and 1.7 s); dry grass clumps on the verges in the hot wind (sway 2-4 deg); tumbleweed rocking in the wire;
  the pump jacks nodding far off (one cycle 5 s, three phases); calendar leaves lift at their bottom edge before they tear (row 31).
- Signs and lettering hang still: front band, plate, boards, calendar body (CB 2026-11-13).
## Air life and weather (effects dept): heat shimmer over the apron and the far skyline; dust devils crossing the far lot (row 29-35 behind); flies over the cooler;
  chalk dust off each tick (row 32); sand dust behind both trucks as they roll out (row 29); red paint mist off the guns (row 50, never on the painters).
## Per shot (plan rows): 28 halyard + heat shimmer; 29 grass sway + sand dust; 30-31 grass + leaves + shimmer; 32 chalk dust + flies; 33-35 halyard + shimmer + pump jacks;
  49 grass + shimmer; 50 red mist + grass; 51-52 halyard + shimmer; 53 STILLNESS: nothing moves.
## FIX 2 (2026-11-21) built in the kit (dallas.js airLife, seeded, places.<name>.air 0-1, frozen by places.<name>.still = true or [57.667, 58.467] for S7 f1730-1754)
- 600 noon dust motes over the apron (x -9..9, y 1..21, z .3-4), 90 chalk-dust motes at the RED board foot, 9 flies at the cooler. Blender twin NOT built (effects / next round).
- Roof sign DALLAS FIRE DEPT. on a steel frame (6 posts, braces, X bracing, 5 gooseneck lamps): words hang still. Torn YEAR leaves on the concrete = switches gl1..gl4.

# PLACE B, DALLAS FIRE DEPT. STATION 14 yard, hot noon (set-builder, 2026-11-21). Written BEFORE the build (CB_RULES 3, story-driven world).
Lines 8-9 (S5 32.30-40.05, plan rows 28-35) and line 13 (S7 52.54-58.45, rows 49-53). Frame: metres, X east, Y north, Z up; the station faces south.

## 1. Required location
The real test (FACTS 4): a big-city station, same kind of building as Pine Hollow so it rhymes, but WIDER and FLATTER: one storey, flat roof with a
parapet, pale stucco (not brick), two bays with roll-up steel shutters, office wing east with the person door. Pale concrete apron, sand and dry grass
round it, a low far skyline, an elevated water tank and one oil derrick far off. Sky is the palest of the film (#9CBDF2, background-painter).

## 2. Essential action props (where the moves happen)
| prop | where | used in rows |
|---|---|---|
| RED truck ENGINE No. 14, LIME truck ENGINE No. 22 | parked nose level, noses south on the apron, centres x -3.2 (red, west) / +3.2 (lime, east), y 12 | 29-35, 49-53 |
| two slate tally boards on easel posts, RED and LIME (#33302E slate, chalk heads) | between the trucks at the nose line, faces south: RED at x -0.95, LIME at x +0.95 | 30-35 |
| RED board stack: 1, 2 or 3 boards nailed on with odd battens (top 7.3 m, above the 5.6 m roof), UP TO 3x chalked at the top | `set_boards(n)` 1-3 | 33-35, 49 (3) |
| 4-leaf wall calendar YEAR 1..4 on a batten between the easels | x 0, z 1.75 | 30-31 |
| chalk box on a small trestle table, a stick rolled off | at the LIME board foot | 30, 32 |
| folding step stool, then the sectioned ladder against the red stack | stool at the RED foot; ladder foot x -0.95, y 8.2 | 33-35 |
| two painters' step ladders, three paint cans (RED, LIME, LEMON), drop cloth, clipboard with the order sheet REPAINT: RED | east of the LIME truck (its open driver side) | 49-53 |
| galvanised water cooler with a tin cup on a stand | on the pier between the bays | 28, 29 |

## 3. Interactive surfaces
Chalk ticks in fives on both boards (the red board full to the top, the lime with a few), eraser smears; the board ledge takes the chalk; the ladder rail
takes the Clerk's fist; the calendar leaves tear off (the four leaves are loose cards in the kit: anchors calendar_leaf_1..4); the drop cloth takes red mist;
the sand around the boards takes chalk dust and leaves. Wet red on the lime truck is the truck's own paint (props-hero), never the set.

## 4. Environmental evidence (unfinished work, wear, leftovers)
Oil stains under both bay mouths, tyre tracks from the bays to the apron, expansion joints with dry weeds, a hose laid flat to dry on the west verge,
crate of paint cans, paint drips by the painters' ladders (red over old lime), worn chalk stubs and torn calendar leaves at the board feet (E8, light),
sun-faded paint on the shutters, sun-bleached sign letters, a rusted jerrycan, a bucket of sand, a tyre against the fence.

## 5. Character-specific details
Clerk: his clipboard of crash sheets (stamped DALLAS F.D., coffee ring) on the trestle, a spare chalk box, a folding stool. Painters: two step ladders
with five old colours, rag on a rung, a tin on a hook; the order sheet REPAINT: RED on a clipboard on the drum by their ladders. Chief (VISITOR): none on set.

## 6. Optional gags
The flag pole with no flag, its halyard ticking in the hot wind; a dust devil crossing the lot behind (effects); a tumbleweed caught in the chain link.

## 7. Continuity constraints
- No red brick, no stop sign, no yellow road lines, no red flag, nothing teal (LOOK_BIBLE). No red or lemon on the set except the trucks and the
  cans: the board heads are white chalk words RED / LIME.
- Words in the world: DALLAS FIRE DEPT. (front band), STATION 14 (plate on the office wing), RED / LIME (board heads), UP TO 3x, YEAR 1..4 (calendar),
  REPAINT: RED (order sheet), the can labels (props). Nothing else lettered. Tally ticks are never readable as numbers.
- The STILLNESS 57.75-58.45: every world motion (halyard, grass, dust) has a freeze switch (kit: place.still = true; Blender: no animation).
- The red truck is WEST: rotated nose-south its driver side (-Y local, plasters, props-hero anchors plaster_1..3) faces EAST, the boards: the Clerk points over his shoulder at it (row 32).
- Hard short noon shadows: sun elevation 72 degrees, from the south-south-west, so the station front is lit and the board faces are lit.

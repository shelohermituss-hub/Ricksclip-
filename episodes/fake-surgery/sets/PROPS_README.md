# Hero + held props of "The Surgery Where the Surgeon Did Nothing" (props-hero phase A, 2026-11-16)
Module: `sets/hero_props.js` (owner props-hero; wishes to the lead in `../SET_CHANGES.md`). `or_props.js` keeps the hook board's scalpel + bulb (bulb now grey-blue); the needle holder is NOT IN USE.
Every builder: `buildX(THREE, ctx, opts)` or `buildX(THREE, opts)` (the kit's held3d form) -> `{ group, parts, tris, grip, tip, anchors, ...setters }`; every anchor is also a top-level key (held3d `"anchor"` / `"tip"` names).
Groups: three.js LOCAL metres, **Y up, readable face +Z** (toward the lens), real size. In a set: `HP.place(THREE, scene, ctx, o, [x, y, z] plan, yawDeg, [rx, 0, rz])` -> `o.plan.<anchor>` in plan metres (Z up): return them in the set's `anchors` for `held3d.tip_at` and cameras.
THE ONE RED `PAIN_RED #e01e2a`: only `buildPainDial` (red zone) and `buildLightBox` (three bars). Stamp ink black, bulb grey-blue `#6a86a0`, iodine orange-brown, scuff pink-brown.
Surfaces: kit3d `ctx.pbr.metal` (shiny steel streaks), `ctx.relief('wood')`, canvas lettering. LOOK PACK HOOK: set `ctx.lookPack = LP.pack(THREE, ctx)` before building and plastics come from `plasticOf(colour)`.
Test + sheet: `sets/_props_test/` (`bash run.sh`; STATE.md there has the numbers).

## THE KNEE (rows 1-10, 27-30, 32, 40-44; PICTURE_PLAN "The knee must read at phone size")
| Export | Options / states | Anchors |
|---|---|---|
| `placeKneeMarks(THREE, scene, ctx, opts)` | ON or_room's knee (call after or_room build): `knee` KNEE_OR, `radii` KNEE_OR_RADII, `normal` plan `[0,-.8,.6]` (toward the frame-0 lens + up), `row [1,0,0]`, `dots` 0-3, `plasters` 0-3, `faded` (3 pale squares, no dots, no iodine), `iodine` true, `hideOld` true (hides or_room's `tiny_cut_*` slits + blue `the_stitch`, turns the orange ball to skin). Setter `set({ dots, plasters, faded, iodine })` per frame in the set's update | `o.plan.dot_1..3`, `plaster_1..3`, `knee_top` (plan) |
| `buildKneeLeg` | `kind 'adult'` (khaki shorts + hem + creases, leg hair, `faded` 3 pale squares by default, row 32) / `'child'` (navy shorts, striped sock, pink-brown scuff `#b07a6a`, `plasters` 0/1, rows 42-44); `bend` deg; `set()` | `plaster_1..3`, `scuff`, `knee_front`, `thigh_top` |
| `buildPlaster` | held for the slap: curled strip, peeled backing tab; `child` | `grip` = tab (point), `tip` = sticky end, `sticky_centre` |
Sizes (phone rule): dot 34 mm `#4a2a18`, plaster 46 x 98 mm cream `#f2e6c8`, tan pad `#c9a56a`, dark outline `#3a2a1e`, spacing 62 mm in a straight row; iodine patch 25 cm `#c0702a` with swab circles, dull sheen, no glow.

## OR + tower (rows 4-7, 27-29, 48)
| Export | States | Anchors / grip | Size |
|---|---|---|---|
| `buildBulb` | `water` 0..1 (the fan), `squeeze` 0..1; `setWater(u)` | grip bulb centre, tip nozzle, `fan_centre` | 0.29 m with fan |
| `buildScope` | sealed scope in crinkled clear bag; `sealed`, `crinkle`; yellow price-tag SEAL TAG "STERILE / SEALED / DO NOT OPEN IF DAMAGED LOT 0715" on a string | `lens`, **`cam_lens`** (inside the bag at the lens: row 6 IMPOSSIBLE VIEW camera), `cam_look`, `tag`, `bag_centre` | 0.46 x 0.06 x 0.22 |
| `buildCRT` | `screen` 'nosignal' / 'snow' / 'tape' (smooth pink joint, round scope vignette, PLAY, counter) / 'off'; `inside` (glass see-through from behind); `setScreen(k)`, `update(t)` (snow) | `screen_centre`, **`cam_inside`** (rows 27-28 IMPOSSIBLE VIEW, behind the glass), `cam_look`, `power_led` | 0.42 x 0.36 x 0.40, beige, no logo (blank badge) |
| `buildVCR` | `play` (green VFD "7:15 ▶ PLAY" + PLAY light), `tapeIn` | `play_light`, `display`, `slot`; `.tape` | 0.38 x 0.09 x 0.30 |
| `buildTape` | `label` 'REAL ONE' (marker hand on a ruled label) | grip end, `label` | VHS 0.187 x 0.103 |
| `buildJug` | `pour` 0..1 (stream 0.9 m); `setPour(u)`; steel, rolled rim, spout, riveted handle | grip handle (held3d `handle`), tip spout, `stream_end` | 0.2 m |
| `buildBowl` | `water` level | `water_centre`, `rim_left/right` | 0.27 m |
| `buildSploosh` | `u` 0..1 crown + 16 crown tips + 24 drops + ring wave; `setU(u)` | `centre` | |
| `buildInstrumentTray` | always clean: towel with folds, capped scalpel, scissors, 2 ratchet clamps, forceps, probe, gauze, plain blue strip | `centre`, `grip_left/right` (nurse row 48, held3d `box`) | 0.48 x 0.32 |
| `buildGurney` | `drape`, `hump` (bent-knee peak) | `deck`, `knee_hump`, `head`, `push_bar`, `grip_left/right` | 2.0 x 0.68, deck 0.78 |

## Office (rows 16-23, 36-39, 45-47)
| Export | States | Anchors / grip |
|---|---|---|
| `buildCoffeeCup` | `fill`, `overflow` 0..1 (dome, 5 runs + beads, puddle), `steam`; `set({...})` | grip handle, `lip`, `surface` |
| `buildStickyNote` | "?" + drawn doubtful head, glue band, `curl`, `size` | grip/tip = peel corner, `glue_top` |
| `buildCardStack` | `count` 180, `height` (0.054 real), `sway` 0..1 (`setSway`), tray-colour index tabs every 15, top card "KNEE No. 001" + knee doodle, yellow top tab **"180 KNEES"**. **height > 0.5 = EXTREME TOWER** (round 2): real 0.127 x 0.076 cards, 4 mm each (725 cards at 2.9 m), fanned yaw +-0.3, x walk, 3 % loose cards slipping out, coloured divider tabs out of the FRONT every 12 cards, big 0.2 m "180 KNEES" tab on top toward the lens; animate `setSway(0.5 + 0.25 * sin)` for the wobble | `grip_left/right` (box hold), `top`, `tab` |
| `buildFileCard` | `n`, `doodle` | grip short end, tip |
| `buildWireTray` | `kind` 'scrape' (steel-blue, scraper icon "60") / 'rinse' (aqua, drop "60") / 'trick' (purple, "?" + magician hat + stars, "60", **"PRETEND SURGERY"**), `fill` 0..1 (`setFill`), `note` (the "?" sticky on the trick label) | `label`, `cards_top`, `drop`, `grip_left/right` |
| `buildLightBox` | three chart films (tray icons + "60", axis PAIN, grid), **red bars** `bars [h1,h2,h3]` 0..1 (`setBars`) | **`bar_top_1..3`**, `ruler_rest` |
| `buildRuler` | 1 m steel rule, cm ticks, numbers each 10, edge streak, ink outline (reads on the white light box) | grip 5 cm end, tip far end (held3d point; `tip_at` bar_top_1). **On the light box as a shelf: `HP.restRulerOnBars(THREE, lb, ru)` after `place()` of the light box** (child of it, lower edge on the highest bar top, 1.4 cm in front, fills `ru.plan`) |
| `buildScopeCase` | `lid` 0..1 (`setLid`), `puff` 0..1 (`setPuff`): foam cut-out with the shiny scope, egg-crate lid foam, 2 latches, hinge pin, handle | `lid_front`, `seam`, `scope` |
| `buildLetter` | plain, no letterhead: "November 2004 / RE: KNEE ARTHROSCOPY FOR ARTHRITIS", `stamped` 0..1 (black "NOT PAID: / ARTHRITIS KNEE", worn ink), `lifted` (corners up from the thump) | `stamp_spot` |
| `buildStamp` | `size` 'normal' (80 x 40 die) / **'tin'** (x5.2, EXTREME row 46); mirrored die, right-reading index label, steel plate, beech knob | grip knob, tip die, `knob_top` |

## Pre-op, stairwell (rows 24-26, 31-35)
| Export | States | Anchors / grip |
|---|---|---|
| `buildClipboard` | consent form "CONSENT TO TAKE PART IN A KNEE STUDY", 2 small boxes, the big box **"MAY BE PRETEND SURGERY"**, signature, "1994"; `tick` 0..1 (pen stroke drawn live, `setTick`), `signed` | **`tick_box`** (pen tip_at), `tick_end`, `sign_line`, `clip`; grip left edge |
| `buildPen` | navy click pen (also the surgeon's pocket pen) | grip, tip |
| `buildEnvelope` | manila, glued flap, string-and-button wound, "GROUP ? DO NOT OPEN" | grip top edge |
| `buildCane` | `cobweb` 0..1 (hammock: 18 strands + 6 cross threads + film), `spider` (asleep, closed eyes, "zZ"), `dust` 0..1; `setState({...})` | grip crook, `crook_inner` (hang on the newel post), `spider` |
| `buildPainDial` | `value` 0..1 or `needleDeg`; `setNeedle(v)`; zones green / yellow / RED, 0-10, "PAIN", LOW / HIGH, chrome bezel, 4 screws, glass glint | `centre`, `needle_tip` |
| `buildHandrailSign` | "USE HANDRAIL" enamel on ONE screw (top-left hole, 3 empty holes), `spin` deg (`setSpin(deg, fast)`), `blur` = a small trailing smear fan (one sign wide, 55 deg) + 2 speed arcs, turns with the plate | origin = screw, `plate_centre` |

## Held props: which hand, which word (from PICTURE_PLAN; film.json held3d keys proven in `_props_test`)
**HAND KEY ON A LIBRARY MOVE (round 2 fault, the reason the plaster / jug / pen were not seen):** on a `m:` move in view 34 / front the kit maps `"hand": "R"` = the move's `hands[0]`
and `"L"` = `hands[1]` (film.js h3Hands), whatever the move calls them. Our moves (ep_surgery sg_work, ep_props sg_hold / sg_pour / sg_write, and the style of every stretch move) put the
WORKING near fist (`over: true`) in `hands[1]`, so held3d on them needs **`"hand": "L"`**. With "R" the prop locks on the far fist on the hip (jug grip 0.65 m high, 0.7 m under the drawn fist).
Check: `--held` row `fists[0].px` must be inside 0..1 and on the drawn fist. tip_at does NOT move the drawn fist of a library move (only plain poses): the move must put the fist one tip length from the target.
Proven round 2 (`_props_test`): jug `hand L` on sg_pour (grip 1.37 m, fist in frame); pen `hand L, angle -110` (the pen's POINT is its -Y: negative angle = point down); ruler `hand L, angle -5`;
plaster on the OR knee `hand L, "toward": 0.42` (the prop comes 0.42 m toward the lens so it is not inside the knee ellipsoid; tip 3.7 cm from knee_plaster_3).
| Row / word | Who, hand | Prop | held3d |
|---|---|---|---|
| 5 "PLASTERS", 40 | surgeon R | buildPlaster | `grip point, angle 80, tip_at "knee_plaster_3"` (set returns placeKneeMarks plan anchors) |
| 4 "SPLASHED" | surgeon R | buildBulb `{water}` | `grip point, angle 60` (as the hook board) |
| 18 "HEADS" | surgeon R | buildCoffeeCup | `grip handle` |
| 19-20 "180", "SPLITS" | surgeon both | buildCardStack | `grip box, anchors [grip_left, grip_right]` |
| 23 "TRICK" | surgeon R | buildStickyNote | `grip point` |
| 24-25 "SIGNS", "PRETEND" | patient R pen, L clipboard | buildPen / buildClipboard | pen `grip point, tip_at "<clipboard>_tick_box"` |
| 26 "TOLD WHICH" | surgeon R | buildEnvelope | `grip raise` |
| 29 "SPLASHES" | surgeon R | buildJug `{pour}` | `grip handle` |
| 37 "SAME HEIGHT" | surgeon R | buildRuler | `grip point, angle -5, tip_at "<lightbox>_bar_top_1"` |
| 43 "PLASTERS" | nurse R | buildPlaster `{child}` | as row 5, tip_at the child leg's `plaster_1` |
| 46 "STOPPED PAYING" | surgeon R | buildStamp `{size}` | `grip raise` (tin: `grip box`) |
| 48 "RIGHT" | nurse both | buildInstrumentTray | `grip box` |

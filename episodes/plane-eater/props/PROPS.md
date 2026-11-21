# PROPS: The Man Who Ate An Airplane (plane-eater), props-hero, 2026-11-21
Sources: SCRIPT.md v1, FACTS.md, CREATIVE.md (gags), lead note 2026-11-21: Cessna stripes and letters NAVY #1d3461, white #f3f4f1;
RED #d62828 is ONLY on Michel (his napkin). No prop is red. Recipe level (CB_RULES 3, RICK RECIPE 1): vehicles REALISTIC and clean (Cessna, airliner
parts, bikes, carts as dessert models); small props SIMPLIFIED and clean (bevelled, flat saturated paint, no grime).
Hands (CREATIVE section 0): fork RIGHT hand, knife LEFT. Holder/word columns follow CREATIVE section 1 timings; the animator fixes the
grip point from cards/meta.json. Status: BUILT = in props/out; SPEC = to build (next round), with the planned source.

## 1. HERO: Cessna 150 "F-MIAM" (BUILT)
| item | value |
|---|---|
| file | out/cessna150.glb/.blend (intact), out/cessna150_wingoff.*, out/cessna150_sliced.* (build: `bash props/build_props.sh [--proof]`) |
| source | "FREE Cessna 172SP" NLM-Group, Sketchfab c9cadc2f026946da8cf9715a683739e9, CC BY 4.0 (ASSETS.md), adapted to a 1970s 150 |
| size | span 10.17 m, length 7.61 m, height 2.48 m (real 150: 10.17 / 7.29 / 2.59); 172,684 tris, 73 parts |
| era | 1970s two-seat trainer; 172SP shape = same family (high strut wing, swept fin, rear window). Still a 172SP in detail: see weak points |
| axes | nose -Y, up +Z, span X, pilot's LEFT wing +X = suffix `_L`; tyres on z = 0 |
| held by | nobody (stands); Michel salts its LEFT wing tip (beat 1), saws at the fuselage (beat 2), the owner polishes the prop (1, 2) |

Parts and materials (named nodes, so the kit can hide or grab them):
| part | material |
|---|---|
| fuselage, fin, rudder, fin_cap, stabiliser_L/R, elevator_L/R, wing_L/R, flap_L/R, aileron_L/R, strut_L/R, wheel_spats_L/R, gear_legs_L/R, doors, cowl_nose, roof_vent | `Body`: white #f3f4f1 gloss paint (rough .20, clear coat 1.0, coat rough .04), clean navy #1d3461 stripes (the asset's navy, de-grimed), fin + rudder whitened for the letters; the asset's normal map kept (panel seams, rivet rows, hinge lines) |
| reg_L / reg_R, reg_fin_L / reg_fin_R | "F-MIAM" (CREATIVE 4.2, "miam" = yum, invented registration), DejaVu Sans Bold, navy #1d3461, 1.5 mm raised letters projected on both rear-fuselage sides (0.26 m high) and both fin sides (0.20 m) |
| spinner, door handles, wing-root fittings | `Metal`: polished chrome (metallic 1, rough .12) |
| prop, prop_tips | brushed aluminium blades (metallic 1, rough .30), white tip bands |
| tyres_main_L/R, tyre_nose | rubber with the asset's tread normal map (rough .62) |
| hubs_main_L/R, hub_nose | cast aluminium (metallic 1, rough .22) |
| glass_cabin, door_glass_L/R | clear glass: dark teal base, alpha .22, rough .03 (weak reflection, cabin visible) |
| seat_cushions, seat_backs, cabin_lining | brown leather and dark trim from the asset (2 front seats; the 172 rear bench removed) |
| instrument panel | dark grey #26282b (the asset's G1000 photo and sim-panel sheet switched off: anachronistic / credit text) |
| alu_cut (all cut faces of the states) | bare aluminium (metallic 1, rough .28) |

Five details (Hard Rule 2): 1 navy F-MIAM on fin and fuselage, both sides; 2 navy cheat-line stripes along fuselage and wheel spats; 3 polished chrome spinner and door handles with a sharp sun streak; 4 V-strut wing braces both sides + spring-steel gear legs with spats; 5 rivet rows and panel seams from the normal map + a visible cabin with two leather seats and yokes through clear glass.
Mechanics: wings carried by struts to the fuselage floor, wheels on legs on axles, prop on the spinner hub, doors on hinges (asset geometry), control surfaces split at their hinge lines.

States (PROP_STATES: once cut, a part never comes back; the kit hides nodes, never resets):
| state | file | what changes | beat |
|---|---|---|---|
| S0 intact | cessna150 | - | 1 |
| S1 sliced like a loaf | cessna150_sliced | 9 even slices, gap 0.22 m, bare aluminium faces, 5 tail slices on pine sawhorses (no wheel under them); nodes slice_0 (nose) .. slice_8 (tail) | 2, 3 (camera flies through a gap) |
| S2..S9 eaten from the tail | cessna150_sliced | hide slice_8, then 7, ... (beat 6 time-lapse) | 6 |
| S10 last piece | cessna150_sliced | only node `s0_spinner` left ("like a cherry") | 6 PLANE |
| W wing off | cessna150_wingoff | left wing, flap, aileron, strut, left spat gone; stub sawn in 5 stepped square bites (6-23 cm), outer wing panel (2.2 m) lies on the grass | 4 "Wings" (alt. to a slice) |

## 2. SCRIPT AND CREATIVE PROPS (SPEC; each: size, era, holder + word, source, five details)
| prop | size | holder, word | source plan | five details |
|---|---|---|---|---|
| metal bites | 3-4 cm squares, 1 mm sheet | tongs right (2 BITES), fork right (4) | code from the Cessna paint (cut squares of `Body` + `alu_cut`) | 1 white paint face, 2 navy painted stripe on some, 3 bare aluminium cut edges with a saw burr, 4 one or two rivet heads, 5 slight bend |
| sugar tongs | 11 cm | right hand, little finger up, 7.14-7.82 | code (st_prop_helpers lathe/tube) | 1 silver-plate, 2 claw ends, 3 spring bow, 4 engraved scroll, 5 bright streak |
| white plate | dia 27 cm | table; catch with right on COFFIN | code lathe | 1 porcelain white #f3f4f1 (same as skin), 2 raised rim, 3 thin silver rim line, 4 foot ring shadow, 5 gloss reflection of the sky |
| knife + fork | 21 / 20 cm | fork RIGHT, knife LEFT (4, 8b) | code | 1 bistro steel, 2 4-tine fork with gaps, 3 knife edge serration, 4 three rivets in a wood handle, 5 chrome streak |
| red napkin | 40x40 cm, tucked in collar | Michel's collar from LUNCH (1) | code cloth (THE one red #d62828) | 1 the only red in the film, 2 hem stitches, 3 fold creases, 4 tucked corner, 5 cloth weave bump; NO red check |
| glass salt shaker | 12 cm | right hand, 0.0-2.0 | Sketchfab CC0/CC-BY search, else code | 1 faceted glass, 2 chrome cap with holes, 3 salt inside, 4 grains falling (particles), 5 caustic glint |
| hacksaw | 55 cm | right hand, kneel 5.24-6.3 | library? none: Sketchfab CC-BY download | 1 steel frame with wing nut tension, 2 fine-tooth blade, 3 navy-free blue grip, 4 aluminium dust at the cut, 5 sparks none (aluminium), shine on blade |
| bolt cutter | 60 cm | not in CREATIVE: spare | Sketchfab | 1 long handles, 2 rubber grips, 3 hardened jaws, 4 pivot bolts, 5 adjuster |
| wine glass of oil | 20 cm | right hand, swirl 9.42-10.1 | code lathe + glass | 1 amber mineral oil #f0a81c (the warmest thing), 2 swirl legs on the glass, 3 thin stem, 4 rim highlight, 5 oil meniscus |
| big water jug + tumbler | jug 28 cm, tumbler 10 cm | both hands, 10.4-11.3 | code lathe + glass | 1 clear glass jug with handle, 2 water line + bubbles, 3 pouring arc, 4 tumbler thick base, 5 condensation drops |
| kitchen scale "2 lb / 900 g" | 22 cm | on the table, POUNDS 12.16 | code | 1 round dial, both scales lb + g, 2 black needle (red is only Michel's) with bounce, 3 chrome pan with bites, 4 cream enamel body 1970s, 5 label "2 lb / 900 g" mark |
| white-cloth table + chair | table 0.9x0.9 m | Michel sits 8.56 | code (library has none) | 1 white cloth with folds, 2 cloth hem, 3 bentwood chair, 4 table legs in grass tufts, 5 wing shade dapple |
| X-ray film + light box | 43x35 cm film | doctor right hand, 16.98 | code | 1 film clip, 2 glowing cyan box, 3 film corner label, 4 film curl, 5 metal frame screws |
| mini Cessna of bites | 0.5 m in the X-ray world | slides on SLID 20.9 | from cessna150 low-poly + square cell pattern | 1 navy stripe kept, 2 visible square tiling, 3 prop, 4 cyan rim light, 5 touches the lining |
| bikes (dessert tier) | 1.7 m | dessert trolley 25.6 | library `kids_bike_16` adapted to adult size | 1 spoked wheels, 2 chain + crank, 3 saddle, 4 bell, 5 cream swirl |
| shopping carts | 0.95 m | dessert tier 26.24 | Sketchfab CC-BY | 1 wire basket, 2 child seat flap, 3 four castors, 4 plastic handle, 5 cream swirl |
| TVs (1970s) | 0.6 m | dessert tier 27.28 | Sketchfab CC-BY | 1 wood cabinet, 2 curved screen, 3 knobs, 4 rabbit-ear antenna, 5 cream swirl |
| coffin cake-topper | 2 m (cake scale 0.4 m) | falls, caught on plate (COFFIN 28.32) | code (simplified) | 1 polished warm wood, 2 six-sided lid, 3 brass handles, 4 lid seam, 5 empty, no cross (kid-safe) |
| dessert trolley + silver bell | trolley 1.0 m | rolls in 24.28; bell right hand | code + Sketchfab bell | 1 two-tier trolley, 2 castors, 3 silver cloche, 4 push bar, 5 bell ding |
| certificate in metal frame | 40x30 cm | both hands, DIET 30.4 (corner bitten) | code + PIL lettering | 1 "STRANGEST DIET EVER" (no Guinness logo, G2), 2 metal frame with a bite out, 3 gold seal, 4 glass, 5 hanging wire |
| airliner seat + tray table | 1 seat row | 8b; tray bitten FOOD 33.38 | Sketchfab CC-BY | 1 cabin blue #1f4fa0 cover, 2 tray table with a neat bite, 3 seat belt buckle chrome, 4 grey-beige meal #b9b3a3 + foil, 5 window shade |
| deck chair + beard (4 sizes) + yellow rag | 1.0 m | owner (6, running gag) | code | 1 striped canvas (blue/white, no red), 2 wood frame on pivots, 3 beard sizes S-XL, 4 yellow rag folds, 5 contact shadows |

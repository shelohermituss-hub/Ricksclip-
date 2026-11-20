# PROPS: "Why Fire Trucks Turned Yellow" (props-hero, 2026-11-20, round 1)

Status words: BUILT = a model exists and was looked at in `props/HERO_SHEET.jpg`. LIST = the five details are written, nothing is built yet.
Era: small-town USA, early 1970s (Dallas rows: the real test ran 1984-88, FACTS 4; the same truck model is used, see "open" at the end).
Proposed town name (fictional, the lead decides): **PINE HOLLOW**. Colours from LOOK_BIBLE: the one red `#D3141C`, lemon-lime `#E3EA22`, dusk grey-plum `#4B4753`.
Not compared with a Rick frame: the repo holds no Rick frames, only measured numbers.

## THE HERO OBJECT: the fire truck (BUILT, `sets/hero_truck.js` `buildTruck`)
1970s American cab-forward pumper, "ENGINE No. 1" of Pine Hollow. Real size 8.02 m long, 2.4 m body (2.6 over mirrors and hoses), 2.89 m to the beacon top; a 1.75 m man reaches the top of the pump panel.
103,256 triangles, 1,482 meshes, 337 named part kinds. Front = local -X, driver's side (pump panel, suction hoses) = +Z, officer's side (ladder) = -Z.

| Paint state | Call | Lines |
|---|---|---|
| classic red, white cab roof | `paint: 'red'` | 5-6, 8-9, 13-14, the Chief's truck |
| lemon-lime, white cab roof | `paint: 'yellow'` | 7, 8-9, 12, 14 |
| half sprayed: front red, rear lemon, soft speckled edge at truck x = `edge`, newspaper + tape on glass, chrome, lamps, gauges, tyres | `paint: 'half', masking: true, edge: 0.3`; animate with `setPaint({ edge })` | 1-2 |
| dusk: the red drains to grey-plum, the lemon stays | `setPaint({ drain: 0..1 })` (the paint's own response, not a grade) | 10, 12, 14 |
| brand new: mayor's white ribbon + bow, dealer's price card | `ribbon: true` | 1 (plan row 4) |
| far too much of everything | `sirens: 4, horns: 5` | 5 (plan row 17) |
| gold goes under the lemon / is re-lettered | `setPaint({ letters: 'under' | 'over' })` | 1 (plan row 3), 12 |

Parts by group (each a real, named part with its material):
- Chassis: two frame rails and six cross members (dark iron), leaf springs with shackle pins and U-bolt plates on both axles, front axle beam + tie rod, rear axle housing + differential, drive shaft with two universal joints, gearbox, engine block, aluminium fuel tank on two straps with a chrome cap, rusty exhaust pipe + muffler + chrome tip, mud flaps lettered P.H. F.D.
- Wheels (on the axles, they spin: `setWheels(metres)`; front pair steers: `setSteer(deg)`): tyres with tread lugs and tread bump, rim barrel, painted disc with 5 hand holes, 10 chrome lug nuts, chrome hub cap (front), rear axle hub + flange with 8 bolts, brass valve stem; rear wheels are DUAL.
- Cab: painted lower body with rounded front corners, white roof with chrome drip rail, glass, A and B pillars, chrome belt moulding, vent-window posts, doors with dark seams on two chrome hinges each (the driver's door opens: `setDoor(deg)`), chrome handle + brass key lock, tread-plate cab steps, chrome grab rails on standoffs, west-coast mirrors on tube arms, two wipers on pivots.
- Inside: oxblood padded bench seat with piping, steering wheel with three chrome spokes and horn button on its column, dashboard with four dials, gear lever with knob, two-way radio with handset on a coiled cord.
- Front face: chrome bumper on brackets with two tow eyes, chrome grille (13 bars + cross bar), four round headlights in chrome bezels on chrome panels, amber turn signals, two red warning lights, the brass BELL on a chrome yoke with clapper and pull cord, gold "No." and "1", licence plate PH·F1.
- Roof: rotating red beacon (chrome base, reflectors, bulb, dome, cap; `setBeacon(on, angle)`), chrome mechanical siren (stator with 12 port slots, horn bell, grille rings, motor, pedestal with four bolts), twin air horns, spotlight on a post.
- Pump module, a panel on each side: brushed stainless plate with 8 screws, lamp hood with 3 lamps, two master gauges + tachometer + four line gauges (printed dials, chrome bezels, glass), four chrome T pull handles with engraved plates (1, 2, 3, TANK FILL), throttle knob, primer pull, two 2 1/2 inch discharges with caps, rocker lugs and chains, two black hand wheels with brass nuts, the big steamer intake with a long-handled cap, five brass drain cocks, brass maker's plate, tread-plate operator step. On top: booster hose reel (chrome flanges, axle in pillow blocks, 17 wraps of rubber hose, brass nozzle in a clip, rewind crank).
- Body: three compartments a side with proud door skins, dark seams, chrome piano hinges, D-ring latches and kick strips; rear fender over the dual wheels; tread-plate running boards on outriggers with chrome edge trim; chrome top rails on five stanchions; rear grab rails; red tail lamps, amber turn lamps, rear warning lights; tread-plate tailboard on brackets; rear discharge with cap.
- Hose bed: two bays split by an aluminium divider, 14 stacks of flat-laid cotton hose (new off-white with a blue tracer line, old tan), fold loops showing at the tailboard, brass couplings with lugs, a brass playpipe with two leather grips, a rolled hose strap.
- Driver's side: two 3 m black ribbed hard suction hoses with chrome couplings in three chrome saddles each, leather straps with brass buckles. Officer's side: two-section aluminium extension ladder (rails, rungs, rubber feet, pulley, halyard rope, pawl locks) on three chrome hook brackets with top clamps and brass wing nuts; pike pole in clips on the top rail. Rear: pick-head axe in two clips. Running board: brass soda-acid extinguisher in a chrome bracket, oak wheel chock.
- Lettering, hand-laid gold leaf with black shade, each letter slightly off (never a typed line): door "PINE HOLLOW / FIRE DEPT. / ENGINE No. 1 / Est. 1891 · Always Ready" with a scroll; front "No." "1"; rear "KEEP BACK 300 FEET / PINE HOLLOW F.D."; gold pin-stripe frames on the compartment doors.

FIVE STORY DETAILS (with wear and imperfections; it is BRAND NEW, so the marks are small and honest):
1. The gold number on the cab door is the town's pride: laid by hand, the letters not quite level, tiny holidays in the leaf. The lemon goes straight over it.
2. The sprayed edge is not a line: speckle and mist reach 40 cm into the red, the passes lean, and the masking newspaper is the Pine Hollow Gazette headlined "NEW ENGINE ARRIVES" (one corner has come loose and curls).
3. The mayor's white ribbon and bow are still on it and the dealer's price card ($41,750, "sold to the town of Pine Hollow") is in the windscreen: nobody has driven it yet.
4. First marks of work already: lime streaks under the two discharge outlets, soot behind the exhaust tip, boot scuffs on the tailboard and running board, road dust on the skirts, a few stone chips on the door sill.
5. The old tan hose from the last engine is loaded beside the new white hose, and the brass bell on the nose is the polished one thing the crew would never mask badly (it wears a paper bag with tape).

## Line 1: "A fireman grabbed a spray gun and painted his town's brand-new fire truck bright lemon yellow."
| Prop | Who holds it | Real size | Status | Five details |
|---|---|---|---|---|
| Fire truck, half sprayed | stands in the yard | 8.02 x 2.4 x 2.89 m | BUILT | above |
| Spray gun, `buildSprayGun` | the hero, RIGHT fist on the handle (held3d `grip: "handle", face: "out"`, drawn x1.7 for the cartoon fist); his left fist takes the hose behind it on "grabbed" | 0.21 long, 0.30 tall with cup | BUILT (38 part kinds, 5,816 tris) | 1 glass cup of lemon under the nose (`setCup(level, tilt)` sloshes it), clamp yoke and cam lever; 2 knurled brass air cap with two horns, a bead of lemon on the fluid tip; 3 lemon runs down the cup and a lemon thumb print on the body; 4 steel trigger on a brass pin, fluid and fan knobs at the back, hanging hook; 5 brass inlet with a hex coupler and the black hose on it |
| Compressor, `buildCompressor` | nobody; stands by the rear wheel | 0.95 x 0.45 x 0.82 m | BUILT (49 kinds, 14,120 tris) | 1 teal hammer-finish tank with weld seams, stencilled "P.H.F.D. ENGINE Co. 3 SHOP" (TO CHANGE to No. 1), lemon overspray flecks on top; 2 motor with cooling ribs and a 1/2 H.P. name plate, V-belt to a spoked flywheel behind a wire guard; 3 finned pump cylinder, air filter can, copper delivery tube with flare nuts; 4 pressure gauge, regulator knob, safety valve with pull ring, pressure switch lever; 5 two solid-tyre wheels on a pinned axle, bent front foot with rubber pads, pull handle with the power cord looped on it |
| Paint tin, `buildPaintTin` | nobody; open on the concrete | 0.166 across, 0.19 tall (1 US gallon) | BUILT (17 kinds) | 1 printed label "SUNBEAM ENAMEL · LEMON YELLOW No. 12" (the word in the world); 2 seven lemon runs down the label with beads; 3 lid beside it wet side up, the screwdriver that pried it; 4 wooden stir stick dipped lemon; 5 wire bail handle, lemon ring on the concrete under it |
| Air hose, `buildAirHose` | lies on the ground gun to compressor | 9 mm, any length | BUILT | 1 one lazy loop; 2 brass couplers both ends; 3 lifts off the ground only at the ends; 4 black rubber with a dull sheen; 5 TO ADD: lemon footprints across it |
| Three firemen's things: sandwich (Old-Timer), too-big helmet (Rookie) | cast | sandwich 12 cm | LIST | wax paper half unwrapped; one bite out; lettuce edge; crumbs on the glove; helmet front shield "1" |
| Scissors on a velvet cushion (plan row 4) | on a stool | 25 cm | LIST | gilt handles; navy cushion with tassels; a cut ribbon end; engraved "MAYOR"; a lemon speck on the blade |

## Line 2: "The chief exploded: Fire trucks are RED! We look like a giant lemon!"
| Prop | Who | Size | Status | Five details |
|---|---|---|---|---|
| Lunch box | on the ground by the Chief's boot (Old-Timer's, plan row 26) | 25 x 17 x 10 cm domed steel | LIST | dented corner; wire handle; chipped navy enamel showing steel; initials scratched in the lid; one latch sprung |
| Lemon | hops off the lunch box on "RED", rolls | 7 cm | LIST | pored skin with one green end; a stem nub; a grocer's sticker; rolls lopsided on its point; the same `#E3EA22` as the truck |
| Chief's white helmet | Chief (cast) | | LIST (cast) | gold front shield CHIEF; leather sweat band; one scorch mark; chin strap swinging; jumps on steam |

## Line 3: "But the fireman had a second job. By day, he was an eye doctor."
| Prop | Who | Size | Status | Five details |
|---|---|---|---|---|
| Fire helmet | hero, lifts it off (both fists) | 30 cm | LIST | black leather, long rear brim; brass eagle holding the shield "1"; lemon overspray on one side; cracked varnish; hung on the coat stand |
| Head mirror | hero, puts it on | 9 cm disc on a leather band | LIST | concave polished steel with the centre hole; scuffed leather band, brass buckle; ball joint; flashes on the turn; a thumb mark |
| Letter chart | on the wall | 28 x 56 cm | LIST | hand-inked letters shrinking by row; top letters spell a word from the story (lead to choose); yellowed card, curled corner; brass eyelets, one nail; a pencil tick beside row 6 |
| Shingle EYE DOCTOR | hangs outside the shop | 60 x 40 cm | LIST | painted spectacles; two chains, it swings; flaking gilt edge; hand-lettered; bird mark on top |

## Line 4: "And he knew something strange about red."
| Prop | Who | Size | Status | Five details |
|---|---|---|---|---|
| Red toy truck | hero, one fist, held up to the lamp | 18 cm pressed tin | LIST (must echo the hero truck: cab-forward, white roof, bell) | folded tin tabs; one bent ladder; rubber wheels, one missing its hubcap; worn paint on the corners showing tin; the only red in the room |
| Eye lamp | on the desk | gooseneck, 45 cm | LIST | chrome flex neck; enamel shade; toggle switch; cloth cord; moth-speck on the bulb |

## Lines 5-6: the crossing at dusk. "I never saw it!"
| Prop | Who | Size | Status | Five details |
|---|---|---|---|---|
| Red truck at dusk | Sceptic drives | as hero | BUILT (`paint: 'red'`, `setPaint({ drain })`, `setBeacon(true, a)`, `sirens: 4`) | beacon turning; headlamps on; reads grey-plum at dusk; four sirens (gag); bell swinging: NOT rigged yet |
| Milk van | Milkman drives | 4.2 x 1.9 x 2.3 m, 1960s divco-type | LIST | cream body, hand-lettered dairy name; folding door open; wire crates of bottles; one headlamp dimmer; after the bump: a dented front wing (stays dented) |
| Hubcap | spins away on the road | 25 cm chrome | LIST | domed chrome with a stamped ring; rings as it spins down; a scuff; comes from the VAN's front wheel (that wheel stays bare); rolls to the kerb and stays there |
| Milk bottles in a carrier | Milkman, later lifts one as a toast (plan row 48) | 6-bottle wire carrier | LIST | glass with cream line; foil caps; one bottle cracked after the bump; wire handle; milk drip on the road |

## Line 7: "cities started painting their trucks lime yellow. Plenty of firemen hated them."
| Prop | Who | Size | Status | Five details |
|---|---|---|---|---|
| Truck noses in station doors on the map | none | model scale | BUILT as the same truck (`paint`, `engine`, `town` options); a light far version is NOT built (1,482 meshes each: see open) | city name on each door; red then lime; small hard shadows; one door stuck half up; glint runs through |
| Painters' spray guns | thin and fat Painter | as line 1 | BUILT (`buildSprayGun`, `opts.paintColor`) | lime in the cup; white overalls' prints on the handle; longer hose; one gun drips; tin lettered LIME |
| Paint can LIME | on the ground | 1 gallon | BUILT model, label reads LEMON (TO ADD: label option) | as the tin |

## Lines 8-9: Dallas counts. "up to three times as often"
| Prop | Who | Size | Status | Five details |
|---|---|---|---|---|
| Red and lime trucks side by side | none | as hero | BUILT (`town: 'DALLAS'` changes the door, rear lettering, maker's plate and newspaper; the licence plate keeps PH; not looked at in a picture) | same model, two colours; DALLAS on the doors; unit numbers differ; both dusty; equal light on both |
| Two tally boards | Clerk chalks | 1.2 x 2.4 m blackboards on posts, the red one grows to three boards | LIST | hand-chalked headings RED / LIME; ticks in fives; smeared eraser marks; "UP TO 3x" chalked at the top; boards nailed on with odd battens |
| Chalk | Clerk's fist | 8 cm | LIST | snapped short; chalk dust on the cuff; a box of sticks on the ledge; one stick rolls off; squeak marks |
| Step stool, then extension ladder in sections | Clerk | 0.5 m; 3 m per section | LIST (the truck's ladder code can be made its own builder) | paint-spattered rungs; rope tie; each section clacks on; rubber feet; wobble at the top |
| Clipboard with the crash sheets | Clerk | 23 x 32 cm | LIST | spring clip; carbon copies; coffee ring; pencil on a string; stamped DALLAS F.D. |

## Lines 10-12: the eye, the ball, the lemon truck
| Prop | Who | Size | Status | Five details |
|---|---|---|---|---|
| Truck losing its red | none | as hero | BUILT (`drain`) | red to grey-plum `#4B4753`; gold lettering still catches light; chrome stays; lemon truck unchanged; headlamp rim for the push-in |
| Red ball | the kid | 22 cm rubber | LIST | scuffed; a moulded seam; one grass stain; a faded star; rolls into the grass and reads grey |
| Lemon truck at dusk | Rookie drives | as hero | BUILT | glows (paint keeps its value under `drain`); beacon on; wet road reflections are the set's; milk-bottle toast; door panel fills the frame |

## Lines 13-14: back to red; the Chief walks into it
| Prop | Who | Size | Status | Five details |
|---|---|---|---|---|
| Order sheet REPAINT: RED | thin Painter | letter size on a clipboard | LIST | rubber stamp slightly crooked; signature; carbon smudge; a lemon thumb print; curls in the heat |
| Paint ladders | Painters | 1.8 m wooden step ladders | LIST | old paint in five colours; a rag on a rung; tin hook; rope spreader; one short leg on a shim |
| Truck being sprayed red over lemon | none | as hero | BUILT (`setPaint({ mode: 'half', a: '#e3ea22', b: '#d3141c', edge })`) | red goes over lemon; masking again; wet shine; drip at the sill; lettering re-laid |
| The Chief's grey truck | Chief flat against it | as hero | BUILT (`paint: 'red', drain: 1`) | invisible grey-plum; his helmet print in the dust; the bell rings from the bump (not rigged); still warm headlamps; lemon truck glowing behind |
| Coffee mug | hero, LEFT fist on the handle | 9 cm | REUSE `episodes/fake-surgery/sets/hero_props.js buildCoffeeCup` (glaze colour to change: no teal, no red) | chipped rim; steam; a lemon fingerprint; station crest; ring on the bumper where it stood |

## Open (for the lead)
- Town name PINE HOLLOW and the door text are a proposal; `town` and `engine` are options.
- The compressor stencil still says "ENGINE Co. 3"; the yard sign in the test set is a test set only.
- Masking paper on the windscreen covers the price card (plan row 4 wants both in one shot): choose `masking: false` for that pull-back or ask for a windscreen sheet that leaves the card free.
- A row of trucks (line 7) and two trucks (lines 8-9, 14) cost 1,482 meshes each: a merged far version is needed before those sets.
- Dallas rows: the real test was 1984-88; a 1970s pumper there is a small period liberty. Say if the Dallas trucks need a different cab.

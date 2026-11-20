# PROPS: "Why Fire Trucks Turned Yellow" (props-hero, 2026-11-20, round 1)

Status words: BUILT = a model exists and was looked at in `props/HERO_SHEET.jpg`. LIST = the five details are written, nothing is built yet.
Era: small-town USA, early 1970s (Dallas rows: the real test ran 1984-88, FACTS 4; the same truck model is used, see "open" at the end).
Proposed town name (fictional, the lead decides): **PINE HOLLOW**. Colours from LOOK_BIBLE: the one red `#D3141C`, lemon-lime `#E3EA22`, dusk grey-plum `#4B4753`.
Not compared with a Rick frame: the repo holds no Rick frames, only measured numbers.

## PRODUCTION ASSETS (CB 2026-11-20: downloaded Blender assets replace the hand-coded three.js models; props-hero asset pack round 1)
Built by `assets_prod/build_assets.sh` (re-runnable from the downloads) into `assets_prod/out/` (git-ignored, rebuilt): one GLB for the three.js staging
(`sets/assets.js`) and one .blend for the final Blender render (`assets_prod/scripts/truck_api.py`, `props_api.py`), same meshes, names and pivots. Proof: `props/ASSET_PACK.jpg`.

| Prop | Asset, licence | Real size, tris | What was changed for THIS story | Controls / anchors |
|---|---|---|---|---|
| THE TRUCK, Pine Hollow ENGINE No. 1 | "FREE 1940s US Fire Truck (American LaFrance)" by robinmikart, CC BY 4.0 | 7.59 x 2.51 x 2.66 m (scale 1.0 as shipped), 142,792 tris (GLB 27 MB) | baked to front -X / driver -Y / ground z=0; "City of Elgin / Fire Department / Engine No. 32 / ELGIN, ILLINOIS" removed from the decal texture with PIL and re-lettered in gold leaf with dark outline + shade: door and nose "PINE HOLLOW / FIRE DEPT.", door + rear "ENGINE No. 1", body "PINE HOLLOW F.D."; paint by one node group PHFD_paint (red #D3141C / lemon #E3EA22 / half with speckled edge, overspray dots and runs / dusk drain of the red only to #4B4753 / white cab roof / soot, water stains, stone chips from wear.png); masking: Pine Hollow Gazette newspaper + tape on glass, lamps, chrome nose and tyres; the asset's yellow tool box repainted body colour; ADDED: brass bell on a chrome yoke with axle, crown, clapper and pull ring (front fender, driver side), the mayor's white satin ribbon round the body with a two-loop bow and swallow-tailed tails on the nose (plan row 4) | `setPaint({paint, edge, drain, masking, letters, ribbon, wear})`, `setWheels(m)` (4 wheel pivots on the axles), `setBeacon(on, deg)` (roof beacon pivot, dome glows), `setDoor(deg)` (driver door on its front hinge), `setBell(deg)`; anchors cab_door, door_handle, pump_panel, rear_step, bell, beacon, nose, ribbon_bow |
| SPRAY GUN | "Spray Gun" by Oleksii.Rozumnyi, CC BY 4.0 | 0.24 x 0.08 x 0.18 m, 31,096 tris | red plastic body -> polished aluminium (the film's one red stays on trucks/toy/ball); handle -> black rubber grip; 200 lemon overspray flecks on the front half; a lemon run under the nozzle ending in a hanging drop; origin = grip point | held3d builder `buildSprayGun` (sets/assets.js), anchors grip, tip, air_inlet, drip; the cast's ROUND BLACK FIST closes on the grip (fist colour fix in assets.js, see assets_prod/STATE.md) |
| AIR COMPRESSOR | "Air compressor" by TheAlex, CC BY 4.0 | 0.70 x 0.40 x 0.62 m, 24,612 tris | the CE "300PSI" label replaced by a sprayed stencil "P.H.F.D. / ENGINE No. 1 SHOP" on the navy tank paint; 320 lemon overspray flecks on its top | `buildCompressor`, anchors outlet, top |
| AIR HOSE | built (no asset needed) | 9 mm rubber, any length | one lazy loop lying on the ground, lifts only at its ends, brass couplers; the same point rule in both renderers (`hosePoints` / `hose_points`) | `buildAirHose({from, to})`, Blender `props_api.air_hose(A, B)` |

FIVE STORY DETAILS, production truck: 1 the gold "PINE HOLLOW / FIRE DEPT. / ENGINE No. 1", each letter hand-laid (own tilt and baseline, pin holes in the leaf), goes UNDER the lemon in the half state (`letters: 'under'`); 2 the sprayed edge is speckle and overspray dots 0.8 m deep with lemon runs and beads dripping over the red; 3 the mayor's satin ribbon and bow still on the nose; 4 the Pine Hollow Gazette "NEW ENGINE ARRIVES" taped over glass, lamps, chrome nose and tyres; 5 the brass bell on the front fender, the one polished thing. Spray gun: aluminium body, black grip, lemon flecks, the drip at the nozzle, brass air inlet. Compressor: P.H.F.D. stencil, lemon flecks on top, gauge, hose to the gun.
NOT carried over from the coded truck (open): the 1970s cab-forward shape (the asset is a 1940s cab), dealer's price card in the windscreen, four sirens and the beacon ROW (plan row 17-18: the asset has one beacon, one bumper siren, roof lamps), the paper bag on the bell.

## ROUND 2 (props-hero 2026-11-20): gag gear on the hero truck, the other trucks, the hook props. Proof: `props/PROPS_R2.jpg` (Blender Cycles CPU 32 spp + OIDN, Standard view, single frames)
Built by the same `assets_prod/build_assets.sh` (new: `scripts/bl_light.py`, `scripts/bl_props2.py`, `scripts/bl_proof2.py`, `scripts/sheet2.py`); three.js twins in `sets/assets.js`.

| Prop | Source, licence | Real size, tris | Story changes | Controls |
|---|---|---|---|---|
| HERO truck additions | built on the ALF asset | +39 k tris (truck now 181,840) | FOUR chrome mechanical sirens on the cab-roof front edge (stator drum, 16 dark port slots, 3 grille rings + cross bars + hub, ribbed motor can, cast foot, rubber pad, 4 bolts, cable); a chrome light BAR on two bolted stanchions with FIVE rotating beacons (chrome base, motor, mirror reflector, bulb, ribbed red dome, own material each); the dealer's PRICE CARD 56 x 39 cm on the dash behind the passenger pane: "BAXTER FIRE APPARATUS CO. / DELIVERED PRICE / $41,750 / SOLD TO THE TOWN OF / PINE HOLLOW"; the windscreen split: driver pane papered, passenger pane clear (card reads in the half state); masking: Pine Hollow Gazette 1.2 m page (masthead, "NEW ENGINE ARRIVES", "Mayor to cut the ribbon at noon", photo, ruled columns), tyres in brown KRAFT paper with tape bands (no more white-walls); lemon runs 3.5 cm wide, 30-90 cm long with a bead, 0.2-1.1 m ahead of the edge | `T.set_extras(root, sirens=0..4, beacon_row, price_card)`, `T.set_beacon(root, on, deg, wave=rad)` (running pulse, row 18); three: `setExtras({sirens, beaconRow, priceCard})`, `setBeacon(on, deg, wave)`; anchors price_card, siren_row, beacon_row, plaster_1..4; pivots siren_1..4, beacon_row_1..5 |
| Chief's ENGINE No. 2 (bay 2) | same ALF asset | 7.59 m, full or light | decal "PINE HOLLOW / FIRE DEPT. / ENGINE No. 2"; older chrome and brass (rougher, yellowed), wear 1.0 (soot, stains, chips), no gag gear | `T.set_letters(root, 'truck_letters_e2')`, `T.set_age(root, 1.0)` (call after set_paint); three: `letters_set`, `age` opts |
| LIGHT truck | `bl_light.py` from truck.blend | 35,042 tris (decimate 0.183 on parts > 300 tris; GLB 24.6 MB, textures kept) | same names, pivots, paint group; sirens, beacon row, card and ribbon removed | `T.append_truck('out/truck_light.blend')`; three: `buildTruck(THREE, ctx, {light: true})` |
| DALLAS pair | light truck x2 | as above | "DALLAS / FIRE DEPT. / ENGINE No. 14" (red) and "ENGINE No. 22" (lemon-lime); cross PLASTERS (built, 30 cm, two crossed fabric strips + pad) on anchors plaster_1..4 of the driver side: three on the red, one on the lime (row 31) | `set_letters(..., 'truck_letters_dal14' / '_dal22')`, plaster.blend/.glb |
| TOY truck | light truck x 0.0237 | 18 cm | red, wear 1, aged chrome, wear map 8x coarser (`wscale` 0.12, `chipZ` 99: chips anywhere) | Blender only so far (paint group inputs wscale, chipZ); three.js toy NOT wired |
| MILK VAN | "Rustic Chevrolet P30 Step-Van Replica", the.snajp, CC-BY 4.0 | 5.40 x 2.02 x 2.20 m, 18,572 tris | front -X; cream #F1E7CC body keeping the asset's dirt, ONE cornflower #6495ED stripe at 0.98-1.16 m, both flanks lettered "Meadowbrook / DAIRY / GRADE A MILK · PINE HOLLOW · ELM ST." with a milk-bottle emblem each end | anchors hubcap_front_right, cab_door, front_corner |
| HUBCAP | built (a 1960s dog-dish) | 25 cm, 1,536 tris | chrome dome with a stamped ring, a dull road scuff on the rim | hubcap.glb/.blend |
| MILK BOTTLE | built (the download "Milk" is a modern plastic jug, rejected) | quart, 23.8 cm, 1,712 tris | clear glass (transmission), milk with the CREAM LINE in the neck, crimped foil cap | `buildMilkBottle` (held3d, anchor grip) |
| MILK CRATE | "Antique Wooden Milk Crates", CurlyFryWhy, CC-BY | 0.92 m pair, 2,280 tris | as downloaded (wood) | milk_crate.glb |
| LUNCH BOX | built (the download "Woodsman Lunch Box" is a modern plastic box, rejected) | 25 x 19 x 20 cm (handle up), 880 tris | domed steel pail in navy enamel chipped to steel (noise mask), wire handle, two hinges, two latches (one sprung) | lunch_box.glb, anchor lid_top |
| LEMON | "Lemon", svnfbgr, CC-BY 4.0 (scan) | 8.5 cm, 7,492 tris | lying on its side | lemon.glb |
| PAINT TINS | "Used Open Red Paint Can with Paint Brush", glowbox3d, CC-BY | 1 US gal, 19 cm (brush across), 31,784 tris | paint retinted (dirt and drips kept): LEMON YELLOW and LIME = #E3EA22, RED = #D3141C; label band "SUNBEAM ENAMEL / LEMON YELLOW (LIME, RED) / No. 12 ONE U.S. GALLON FIRE APPARATUS" | paint_tin_lemon/lime/red |
| SCISSORS on CUSHION on STOOL | "Tailor's Scissors", shuvalov.di (Sketchfab Free Standard); "wooden stool", diana_ver, CC-BY; cushion built | stool 46 cm, cushion 38 cm, scissors 26 cm; 67,488 tris | handles retinted gilt, navy velvet cushion (sheen) plumped in the middle, four gilt tassels | ribbon_set.glb, anchor scissors_grip |
| COFFEE MUG | "Classic Red Coffee Mug", hungry_beagle, CC-BY | 9.5 cm, 12,288 tris | cream glaze (no red, no teal) | `buildMug` (held3d, anchor handle) |

FIVE DETAILS, round-2 props: van: cream + one cornflower stripe, hand-sign dairy name, open sliding door, the asset's rust and dents at the corners, chrome bumper; hubcap: domed chrome, stamped ring, scuff, 25 cm, comes off the van's front right wheel (anchor); bottle: glass, cream line, foil cap, thick base, real quart size; lunch box: navy enamel, chips to steel, wire handle, sprung latch, hinge pins; tins: SUNBEAM label word in the world, lemon drips and dirt kept from the asset, brush across the rim, wet paint surface, three colours; ribbon set: gilt scissors, navy velvet, gilt tassels, plumped cushion, worn wooden stool.
NOT done this round: initials scratched in the lunch box lid, a grocer's sticker on the lemon, "MAYOR" engraving and a cut-ribbon end on the scissors, the mug's chipped rim + station crest + lemon fingerprint, the bottle crack after the bump, the van's dented wing and bare hub (the asset's wheel keeps its own cap), air horns in a row (row 17 says "horns in a row": not built), a three.js toy, plaster pop animation. PRIORITY 3 not started: head mirror, trial-lens case, chalk, slate boards RED/LIME with tallies and "UP TO 3x", 4-leaf calendar, ladder sections, red ball and the five lost things, order sheet REPAINT: RED.

## THE HERO OBJECT: the fire truck (CODED REFERENCE, replaced in the film by the asset above; `sets/hero_truck.js` `buildTruck`)
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

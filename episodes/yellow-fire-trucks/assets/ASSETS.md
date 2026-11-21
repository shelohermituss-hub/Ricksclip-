# ASSETS: downloaded 3D assets of "Why Fire Trucks Turned Yellow" (props-hero asset TEST, 2026-11-20)

The files are NOT in git (`.gitignore`: `episodes/*/assets/**`, this file excepted). Download again from the URL
(Sketchfab: `GET https://api.sketchfab.com/v3/models/<uid>/download` -> `glb.url`, through the proxy, no key; Poly Haven: `https://api.polyhaven.com/files/<id>`).
Licence rule: CC0, CC-BY or Sketchfab Free Standard only; no NonCommercial, no ShareAlike. Nothing was bought.
USED IN THE FILM (CB 2026-11-20): alf_1940s (the hero truck), spray_gun, air_compressor and the three Poly Haven files, rebuilt for the story by `assets_prod/build_assets.sh` (see PROPS.md). The Pierce and Ward files stay test-only.

FINAL CREDIT LINES (YOUTUBE.md):
- "FREE 1940s US Fire Truck (American LaFrance)" by robinmikart (sketchfab.com/3d-models/9548e406e29e49e18a7ea39a4de1111d), CC BY 4.0 (creativecommons.org/licenses/by/4.0/), repainted and re-lettered
- "Spray Gun" by Oleksii.Rozumnyi (sketchfab.com/3d-models/bbeebeb544e44045aa721f652ba2033a), CC BY 4.0, recoloured
- "Air compressor" by TheAlex (sketchfab.com/3d-models/e0401b9109d9480dabedcefba5d7c1f2), CC BY 4.0, relabelled
- HDRIs and concrete texture: Poly Haven (polyhaven.com), CC0
- (round 2) "Rustic Chevrolet P30 Step-Van Replica" by the.snajp (sketchfab.com/3d-models/45c4e2166c8a4cbc88f04ae404fa9a02), CC BY 4.0, repainted and re-lettered as a dairy van
- (round 2) "Woodsman Collection - Lunch Box" by re1monsen (sketchfab.com/3d-models/03c0408215684e1fb2395a49ed8a1e90), CC BY 4.0
- (round 2) "Lemon" by svnfbgr (sketchfab.com/3d-models/4d41836da54b4595bf228481306622dc), CC BY 4.0
- (round 2) "Used Open Red Paint Can with Paint Brush" by glowbox3d (sketchfab.com/3d-models/b9f7df7222034d52b496e4e3a7c21dbb), CC BY 4.0, recoloured and relabelled
- (round 2) "Tailor's Scissors" by shuvalov.di (sketchfab.com/3d-models/2318ed5e22a2420a9ddaa914333f8fbf), Sketchfab Free Standard
- (round 2) "Classic Red Coffee Mug" by hungry_beagle (sketchfab.com/3d-models/c89fa8b5390145488a28c41ec54ccc8d), CC BY 4.0, recoloured
- (round 2) "wooden stool" by diana_ver (sketchfab.com/3d-models/79847abac75a4211a4f072c45516fbea), CC BY 4.0
- (round 2) "Milk" by Multipainkiller_Studio (sketchfab.com/3d-models/5e8d71045e2040ba8f6619d86d204cf5), CC BY 4.0
- (round 2) "Antique Wooden Milk Crates" by CurlyFryWhy (sketchfab.com/3d-models/489a6f095dc44bb1b279ed58e5bb3571), CC BY 4.0

| file | name / url | author | licence | size | what it is / used for | YOUTUBE.md credit line (only if it goes into the film) |
|---|---|---|---|---|---|---|
| `american_fire_engine/american_fire_engine.glb` | "American Fire Engine" https://sketchfab.com/3d-models/4baba9d1644c4844ae10c22abea43aec | eyvan | CC-BY 4.0 | 120 MB, 1,803,276 tris, 449 meshes, 71 flat-colour materials, no textures | Pierce Enforcer (2000s) pumper. BEST of the test: repaint states, Blender + three.js tiles | "American Fire Engine" by eyvan (sketchfab.com/eyvan), CC BY 4.0, repainted |
| `alf_1940s/alf_1940s.glb` | "FREE 1940s US Fire Truck (American LaFrance)" https://sketchfab.com/3d-models/9548e406e29e49e18a7ea39a4de1111d | robinmikart | CC-BY 4.0 | 28 MB, 137,352 tris, 148 meshes, 31 textured materials (1024 px) | 1940s open-cab pumper, wrong era; second truck tile (textured asset) | "FREE 1940s US Fire Truck (American LaFrance)" by robinmikart, CC BY 4.0 |
| `ward_lafrance_m1000/ward_lafrance_m1000.glb` | "Ward LaFrance M1000" https://sketchfab.com/3d-models/6f377645c7754f89be4b4fc80bfc86f8 | jordipeco | CC-BY 4.0 | 41 MB, 1,460,081 tris, 1 material, NO texture | REJECTED: AI-made (Meshy) mesh of a military WRECKER, not a fire engine; 1.9 m long as shipped, grey, no parts | - |
| `spray_gun/spray_gun.glb` | "Spray Gun" https://sketchfab.com/3d-models/bbeebeb544e44045aa721f652ba2033a | Oleksii.Rozumnyi | CC-BY 4.0 | 4.3 MB, 25,296 tris, 5 materials (red plastic, black, brass, metal, plate), 1024 px PBR textures | old industrial spray gun; Blender still + kit fist test | "Spray Gun" by Oleksii.Rozumnyi, CC BY 4.0 |
| `air_compressor/air_compressor.glb` | "Air compressor" https://sketchfab.com/3d-models/e0401b9109d9480dabedcefba5d7c1f2 | TheAlex | CC-BY 4.0 | 4.3 MB, 18,212 tris, 4 materials | modern small compressor; Blender still only | "Air compressor" by TheAlex, CC BY 4.0 |
| `polyhaven/kloofendal_43d_clear_puresky.hdr` | https://polyhaven.com/a/kloofendal_43d_clear_puresky | Greg Zaal | CC0 | 4.5 MB, 2k | sunny-morning sky + light in Blender | (CC0, credit optional) Poly Haven |
| `polyhaven/industrial_sunset_02.hdr` | https://polyhaven.com/a/industrial_sunset_02 | Sergej Majboroda | CC0 | 6.2 MB, 2k | dusk sky + light in Blender | (CC0) Poly Haven |
| `polyhaven/concrete_floor_worn_001_{diff,nor_gl,rough}_2k.jpg` | https://polyhaven.com/a/concrete_floor_worn_001 | Dimitrios Savva, Rico Cilliers | CC0 | 3 x 2k jpg | yard ground in Blender | (CC0) Poly Haven |

| `step_van/step_van.glb` | "Rustic Chevrolet P30 Step-Van Replica" https://sketchfab.com/3d-models/45c4e2166c8a4cbc88f04ae404fa9a02 | the.snajp | CC-BY 4.0 | 26 MB, 18,568 tris, 30 textured materials | the MILK VAN (round 2): 5.4 m, cream + cornflower stripe, "Meadowbrook DAIRY" decals | see credit lines |
| `lunch_box/lunch_box.glb` | "Woodsman Collection - Lunch Box" https://sketchfab.com/3d-models/03c0408215684e1fb2395a49ed8a1e90 | re1monsen | CC-BY 4.0 | 15 MB, 94,480 tris kept (stump + ground dropped) | the Old-Timer's lunch box, 27 cm | see credit lines |
| `lemon/lemon.glb` | "Lemon" https://sketchfab.com/3d-models/4d41836da54b4595bf228481306622dc | svnfbgr | CC-BY 4.0 | 3.8 MB, 7,492 tris, scanned texture | the lemon, 8.5 cm | see credit lines |
| `paint_can/paint_can.glb` | "Used Open Red Paint Can with Paint Brush" https://sketchfab.com/3d-models/b9f7df7222034d52b496e4e3a7c21dbb | glowbox3d | CC-BY 4.0 | 8.1 MB, 31,656 tris | paint tins LEMON YELLOW / LIME / RED (1 US gal, 19 cm) | see credit lines |
| `scissors/scissors.glb` | "Tailor's Scissors" https://sketchfab.com/3d-models/2318ed5e22a2420a9ddaa914333f8fbf | shuvalov.di | Sketchfab Free Standard | 3.8 MB, 54,080 tris | the mayor's ribbon scissors, 26 cm | see credit lines |
| `mug/mug.glb` | "Classic Red Coffee Mug" https://sketchfab.com/3d-models/c89fa8b5390145488a28c41ec54ccc8d | hungry_beagle | CC-BY 4.0 | 0.35 MB, 12,288 tris | the hero's coffee mug, recoloured cream | see credit lines |
| `stool/stool.glb` | "wooden stool" https://sketchfab.com/3d-models/79847abac75a4211a4f072c45516fbea | diana_ver | CC-BY 4.0 | 2.5 MB, 3,008 tris | the stool under the scissors cushion, 46 cm | see credit lines |
| `milk_bottle/milk_bottle.glb` | "Milk" https://sketchfab.com/3d-models/5e8d71045e2040ba8f6619d86d204cf5 | Multipainkiller_Studio | CC-BY 4.0 | 0.8 MB, 1,952 tris | the Milkman's bottle, 23.5 cm | see credit lines |
| `milk_crate/milk_crate.glb` | "Antique Wooden Milk Crates" https://sketchfab.com/3d-models/489a6f095dc44bb1b279ed58e5bb3571 | CurlyFryWhy | CC-BY 4.0 | 4.1 MB, 2,280 tris | milk crates on the kerb, 0.92 m | see credit lines |
Built in `bl_props2.py` (no fitting free asset found or quicker and more period-true to build): velvet cushion with gilt tassels, 1960s dog-dish hubcap, cross plaster; on the truck: four sirens, beacon row, price card.

Searched and not taken (round 2): "Divco milk truck" (no free result), "meh red truck" (CC-BY-NC-SA), "Streamline vintage delivery van" (CC-BY, 922k tris, 1930s), "Volvo Hubcap" (modern), "Cushion" sandoakn (242k tris), "Lunch Box Food Tiffin Carrier" (not US), "Still Life: Lemons" (a group). Sketchfab answers 429 after about four downloads in a row: wait 60 s and retry.

Searched and not taken: "Stylized Fire Truck with Crew Cab" (CC-BY-NC: excluded), "1954 O-11A" (CC-BY-NC-SA: excluded), "Pumper Truck / Fire Engine"
b895053933 (CC-BY, 15k faces, one material: too plain), "Bristow Fire Engine" 7ac89a7a7a (CC-BY, UK, 750k), "Harbor Freight spray gun" a6e67cbc51 (CC-BY scan, 570k, one material).
No 1960s-70s American cab-forward pumper (Ward LaFrance P-80, Mack CF, Seagrave, American LaFrance 900/1000) was found free and downloadable under CC-BY/CC0 on Sketchfab.
BlenderKit fire trucks: shown as paid / plan only; nothing bought.

## TOWN SET (set-builder, 2026-11-20): PLACE A, PINE HOLLOW (sets/town/build_town.sh re-downloads them: sets/town/scripts/fetch_town.py)
All from Poly Haven (polyhaven.com), licence CC0 (no credit required; credited anyway). Files in `assets/ph_town/models/<id>/` (glTF 1k) and `assets/ph_town/tex/` (1k jpg).
FINAL CREDIT LINE (YOUTUBE.md): "Town models and textures: Poly Haven (polyhaven.com), CC0."
| id | kind | author (Poly Haven page) | used as | adapted for the story |
|---|---|---|---|---|
| street_lamp_01, street_lamp_02 | model | Poly Haven | downloaded, NOT placed (modern heads); the crossing lamp is coded (post, arm, sodium globe) | - |
| painted_wooden_bench | model | Poly Haven | station bench by the door, park bench | as is |
| metal_trash_can (clean variant) | model | Poly Haven | yard bin, park bin | as is |
| water_manhole_cover | model | Poly Haven | the yard drain | as is |
| fire_hydrant (clean variant) | model | Poly Haven | hydrant on the station corner | repainted silver-grey (no red, no yellow on the set) |
| industrial_wall_lamp | model | Poly Haven | the station wall lamp over the door (line 14's source) | scale 1.4, warm emission at dusk |
| garden_hose_wall_mounted_01 | model | Poly Haven | the hose reel on the station wall | scale 1.7 |
| wooden_crate_01, oil_tin, wooden_bucket_01, old_tyre, watering_can_metal_01, metal_toolbox, wooden_ladder, barrel_03, cardboard_box_01, rubber_boots, utility_box_01 | models | Poly Haven | yard and bay dressing | as is |
| BarberShopChair_01 | model | Poly Haven | the eye doctor's exam chair (shop_chair) | as is |
| desk_lamp_arm_01 | model | Poly Haven | the amber desk lamp | amber point light added |
| hanging_picture_frame_01, wall_clock | models | Poly Haven | shop wall (framed photo of the red truck, clock) | photo picture painted by tex_town.py |
| island_tree_02 | model | Poly Haven | every leafy tree (park's big tree x3.1, street clumps x2-2.8) | decimated to 6 % in the GLB only |
| shrub_02 (b), shrub_03 (a) | models | Poly Haven | bushes, far tree clumps on the hills (x5-9), shop planters | as is |
| grass_bermuda_01 (medium, seedling clumps) | model | Poly Haven | lawn blades: 260 clumps joined into a 2 m patch, 210 patches | greener (mix to #7bbf5a); patch decimated to 30 % in the GLB |
| dandelion_01 (c), weed_plant_02 | models | Poly Haven | lawn flowers, weeds in the yard joints | as is |
| tree_stump_01, jacaranda_tree | models | Poly Haven | downloaded, NOT placed | - |
| weathered_plank_siding, white_planks_clean, wooden_garage_door, concrete_block_wall, concrete_floor_worn_001, concrete_pavement, asphalt_02, leafy_grass, grey_roof_01, roof_slates_02, painted_plaster_wall, bark_brown_02, plank_flooring, forest_ground_04 | textures | Poly Haven | clapboard (sage, cream, white, blue-grey, green, tan), bay doors, block base, yard, walks, streets, lawn, roofs, poles, floors, far ground | repainted by tex_town.py (paint colour x the texture's own light and dark) |
Coded (no usable free asset found or needed): the station, hose tower, shop, houses, water tower, picket fence, telephone poles + wires, crossing lamp, blades, bell, flag pole, all lettering and decals.

## DALLAS SET (set-builder, 2026-11-21): PLACE B, DALLAS FIRE DEPT. STATION 14 yard (sets/dallas/build_dallas.sh re-downloads them: sets/dallas/scripts/fetch_dallas.py)
All from Poly Haven (polyhaven.com), licence CC0 (no credit required; credited anyway). Files in `assets/ph_dallas/models/<id>/` (glTF 1k) and `assets/ph_dallas/tex/` (1k jpg). Nothing bought, nothing NonCommercial.
FINAL CREDIT LINE (YOUTUBE.md): "Dallas yard models and textures: Poly Haven (polyhaven.com), CC0."
| id | kind | used as | adapted for the story |
|---|---|---|---|
| ladder_sectioned_01 | model | the Clerk's sectioned ladder against the red stack (two copies, section on section) | scaled 1.3 wide, stretched to the stack |
| folding_wooden_stool | model | the step stool (row 33) | as is |
| small_wooden_table_01 | model | the trestle with the chalk box (row 30) | chalk box + sticks coded on top |
| clipboard | model | the Clerk's crash sheets; the painters' order sheet REPAINT: RED (on the drum) | order sheet painted by tex_dallas.py |
| wooden_ladder | model | the painters' two step ladders (line 13) | as is |
| barrel_03, spray_paint_bottles (clean), wooden_bucket_02 | models | painters' corner | as is |
| grass_medium_01 | model | dry grass clumps on the verges, fence lines, expansion joints | straw tint #cdb46e; decimated in the GLBs |
| wild_rooibos_bush, dry_branches_medium_01 | models | dry scrub on the lots; tumbleweed caught in the chain link | as is |
| industrial_wall_lamp, fire_hydrant (clean), metal_trash_can (clean), metal_jerrycan, propane_tank, tool_cart, metal_tool_chest, wooden_crate_02, old_tyre, oil_tin, painted_wooden_bench, metal_jug, can_rusted, garden_hose_wall_mounted_01, water_manhole_cover, cardboard_box_01, concrete_road_barrier | models | yard and bay dressing | hydrant repainted silver-grey (no red, no yellow on the set) |
| standing_chalkboard_01, modular_chainlink_fence, sand_rocks_small_01, dead_tree_trunk_02 | models | downloaded, NOT placed (chalkboard too small for the 1.2 x 2.4 m tally boards; fence 89 k tris; rocks 739 k tris) | - |
| white_stucco, smooth_concrete_floor, concrete_floor_worn_001, dry_ground_01, withered_grass, painted_metal_shutter, concrete_pavement, asphalt_02, rusty_metal, wood_table_worn, concrete_block_wall, sandy_gravel, box_profile_metal_sheet, corrugated_iron | textures | station stucco (cream, tan, grey), pale apron, bay floor, sand #D9B98C, dry grass, roll-up shutters, walks, street, derrick, easel wood, plinth/roof, far lots, shed | repainted by tex_dallas.py (paint colour x the texture's own light and dark) |
| paint_tin_red / _lime / _lemon (assets_prod, glowbox3d CC-BY, see PROPS) | models | the painters' cans | from assets_prod/out GLBs |
Coded (no usable free asset found): the station (bays, shutters, office wing, shed, roof units, mast), the two slate boards + easels + battens, the 4-leaf calendar, the water cooler, the chain-link fence, flag pole, poles + wires, the water tank, the derrick + pump jacks + oil tanks, the low skyline, all lettering and decals.

## MAP SET (set-builder, 2026-11-21): PLACE C, THE MAP (S4, line 7). Re-downloaded by sets/map/build_map.sh (sets/map/scripts/fetch_map.py) into `assets/map/` (git-ignored)
FINAL CREDIT LINE (YOUTUBE.md): "Map models and textures: Poly Haven (polyhaven.com) and ambientCG (ambientcg.com), CC0. State outlines: us-atlas (ISC), from US Census Bureau data. Fonts: Patrick Hand and Righteous (SIL Open Font License)."
| id | source, licence | author | used as | adapted for the story |
|---|---|---|---|---|
| seadogs_compass | Poly Haven, CC0 | Benny Weimer | brass compass on the Atlantic | scale x35 table scale (2.4 m) |
| magnifying_glass_01 | Poly Haven, CC0 | Nazar Borodavka | magnifier on the table by the title block | as is |
| measuring_tape_01 | Poly Haven, CC0 | Kuutti Siitonen | tape measure on the table, top right | as is |
| pine_sapling_small | Poly Haven, CC0 | Rob Tuytel, Rico Cilliers | 10 model pines round the Pine Hollow station model | scaled to 0.34 m (model-railway trees) |
| wood_table_worn | Poly Haven texture, CC0 | Dimitrios Savva, Rico Cilliers | the table under the map | as is |
| Paper001 (grain + normal), Paper004, Cardboard004 | ambientCG, CC0 | ambientCG (Lennart Demes) | paper grain under the printed map, paper normal; 004s downloaded, not used yet | print multiplied over the grain |
| us-atlas 3.0.1 states-10m.json | npm, ISC (data: US Census Bureau, public domain) | Mike Bostock | state shapes of the printed map (Albers, lower 48) | redrawn as a 1970s print by tex_map.py |
| @fontsource/patrick-hand, @fontsource/righteous | npm, SIL OFL 1.1 | Patrick Wagesreiter; Astigmatic | hand-lettered city labels; title block, state names, station signs | - |
| truck_light (assets_prod) | our own adaptation (see ALF 1940s above) | - | a truck nose in each of the 94 bays (Blender: instances, lime #E3EA22 and red; kit: 4 k-tri tiny copy) | repainted by truck_api.set_paint |
Coded (no usable free asset): the printed map itself, the pop-up station models (card, cream brick print, navy trim, hose tower, signs), pushpins, the pencil.

## LAMP ROOM (set-builder, 2026-11-21): PLACE D, THE LAMP ROOM BEHIND THE EYE (sets/lamproom/build_lamproom.sh re-downloads them: sets/lamproom/scripts/fetch_lamproom.py)
All from Poly Haven (polyhaven.com), licence CC0. Files in `assets/ph_lamproom/models/<id>/` (glTF 1k) and `assets/ph_lamproom/tex/` (1k jpg). Git-ignored like ph_town.
FINAL CREDIT LINE (YOUTUBE.md): "Lamp room models and textures: Poly Haven (polyhaven.com), CC0."
| id | kind | used as | adapted for the story |
|---|---|---|---|
| lightbulb_01 | model | every one of the 4,376 dome lamps (Blender, instanced) | scaled to 9.5 cm; glass swapped per kind/state (red, lemon-green, blue; on, flicker, dead); the kit uses a coded 140-tri bulb |
| pull_chain_light_socket | model | the socket of every lamp housing (Blender, instanced; the pull chain removed) | turned to face the room, scale 1.3, on a coded riveted relay plate |
| retro_multimeter | model | the meter on top of the brass relay box | scale 1.7 |
| power_box_01 | model | the fuse cabinet on the catwalk (door open) | scale 2.2, texture multiplied by a plum-steel tint |
| modular_electric_cables (cable_box_4way only) | model | the junction boxes where the cable bundles meet the iris track | scale 3 |
| metal_plate, metal_plate_02 | texture | the riveted dome plates, the bulkhead | diffuse x plum-indigo #4a3a86 / #3e3274 |
| painted_metal_shutter | texture | the pleated back of the iris | diffuse x indigo #3a3aa8 |
| metal_grate_rusty | texture | the catwalk deck | diffuse x #5a5470 |
Coded (no fitting free asset): the dome shell, iris pleats with the 'open' shape key, chrome entry ring/bezel/reflector, relay box with switches, cables (bezier), ladder rail.

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

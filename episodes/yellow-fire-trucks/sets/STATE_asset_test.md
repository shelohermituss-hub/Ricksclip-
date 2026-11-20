# STATE: downloaded-asset TEST (props-hero, 2026-11-20). Test only; the film's sets, plan and cast are untouched.

## NOT done
- No 1960s-70s cab-forward pumper and no 1970s cup spray gun exists free under CC-BY/CC0 on Sketchfab (searched 13 queries); BlenderKit trucks are paid: nothing bought.
- The white cab roof did NOT come out on the Pierce asset (its roof is a separate black material; my position mask only whitens red panels). Seen in the sheet.
- Dusk tile is not dusk: the HDRI reads as a grey-blue evening, no warm low sun on the truck, no `drain` to #4B4753.
- Blender stills have no yard (HDRI + concrete plane only), no cast card. Compressor tile is framed too tight (my camera rule). No Rick frame (none in the repo).
- EEVEE was timed at 540x960 and 1200x900 only, not at 1080x1920.

## Files
- `tools/install_blender.sh` (idempotent; /opt/blender, link /usr/local/bin/blender). Blender 5.3.0: 388 MB download, install 39 s, 1.3 GB on disk. EEVEE needed `apt-get install libegl1 libgl1-mesa-dri` (now in the script's fallback list: libegl1).
- `assets/ASSETS.md` (licences, credits; binaries git-ignored by the new `.gitignore` line `episodes/*/assets/**`).
- `sets/_asset_test/`: `bl_render.py` (one Blender still: asset, paint, light, engine, cam), `batch.sh`, `batch2.sh`, `build.py` + `run_kit.sh` (kit tiles), `sets/asset_yard.js` (hero_yard_test's yard + a GLB truck, our paint by material), `sets/asset_props.js` (GLB gun as held3d builder), `vendor/GLTFLoader.js` (three r165, imports pointed at /kit), `coded_time.sh`, `sheet.py` -> `props/ASSET_TEST.jpg`, `numbers.json`, `inspect.txt`. Logs in `out/*.log`.

## Assets checked (Blender import; `inspect.txt`)
| asset | size as shipped | tris | materials | era / what is missing | repaint |
|---|---|---|---|---|---|
| Pierce "American Fire Engine" (eyvan) | 8.2 m, true scale | 1,803,276 / 449 meshes | 71 flat colours, no textures | 2000s Pierce Enforcer. No chrome, black glass with no reflection, no lettering, no bell, no masking | EASY: 16 red materials swapped by colour test; white roof failed (black roof material) |
| 1940s American LaFrance (robinmikart) | 7.6 m (x1.05) | 137,352 | 31, textured 1024 px | open cab, long hood: wrong era. Gold "City of Elgin, Illinois" painted in the texture | MEDIUM: one body material `van_paint_2`; the wrong town's gold lettering stays on |
| Ward LaFrance M1000 (jordipeco) | 1.9 m (x4.2) | 1,460,081 | 1, no texture | REJECTED: AI (Meshy) mesh of a military wrecker, grey | - |
| Spray Gun (Oleksii.Rozumnyi) | 0.32 units -> 0.24 m | 25,296 | 5 PBR | modern red plastic gun, no paint cup | not repainted |
| Air compressor (TheAlex) | -> 0.75 m | 18,212 | 4 | modern mini compressor, no tank, no wheels | not used |

## Numbers (measured here, 4 CPU cores, no GPU; times = render call only)
- Blender Cycles CPU, 32 spp + OIDN, Pierce 1.8 M tris: 1080x1920 36.8 s (dusk 39.6 s); 540x960 10.3-10.6 s; 1200x900 23.9-27.0 s. Import of the 120 MB GLB 7.5 s (once per process).
- Colour: the portrait stills (`out/bl_*`) used AgX, which greyed the lemon #E3EA22 to a cream; the sheet tiles (`out/t_*`) use the Standard view and keep the hexes. Use Standard for brand paint.
- Blender EEVEE (started after the EGL install; Mesa llvmpipe software GL): 540x960 36.6 s, 1200x900 31.3 s: SLOWER than Cycles on CPU. Picture almost the same as Cycles.
- three.js kit (SwiftShader), same GLB: 5.2-5.3 s/frame at 1200x900, 5.8 s at 1080x1920; 1940s ALF 1.8 s; gun in fist 3.7 s. CODED truck film at 1200x900: 1.7 s/frame.
- Edge density (detail_density.py on the 400x300 tiles): coded 0.130 / 0.123; Pierce kit 0.116 / 0.105; Pierce Cycles 0.067 / 0.059; EEVEE 0.057; dusk 0.072; ALF Cycles 0.065, ALF kit 0.088; gun: coded in fist 0.142, asset in fist 0.189, asset in Blender 0.026. Blender tiles lose edges mostly to the empty HDRI backdrop (no yard), not only to the asset.

## What the sheet shows (looked at `props/ASSET_TEST.jpg`)
- ASSET vs RENDERER: the same Pierce GLB looks almost the same in the kit and in Cycles. Cycles adds soft sky shadow, contact darkening under the truck and cleaner paint; the kit adds a yard and costs 1/5 of the time. The gap to our coded truck is the ASSET (era, gold leaf, pump panel, bell, chrome, story lettering), not the renderer.
- Our coded truck carries this story (PINE HOLLOW ENGINE No. 1, 1970s cab, ribbon, masking, newspaper on wheels); no downloaded truck does. The coded tile's weakness is light (flat sky light, weak chrome) = what Blender does better.
- Wrong beside the tiles: Pierce = modern, black windows, no white roof, red hubs repainted; kit half-spray edge shows blocky speckle squares at close range; ALF = Elgin lettering, dark in the kit (no env on its textured paint); gun = modern plastic, no cup; fist on the asset gun reads dark maroon, not ink black (not checked why); compressor crop too tight.

## Pipeline impact
- Full film in Blender (world + truck), 1898 frames at 1080x1920 from the 36.8 s measurement: about 19.4 h CPU here, BEFORE a yard, cards and props (more). EEVEE on CPU is slower. Kit with the 1.8 M GLB: about 3.1 h (5.8 s x 1898); coded kit: about 1 h (CLAUDE.md, 2 s/frame).
- Cards in Blender: the parked method (BLENDER_PARKED.md): image planes facing the lens, hand point minus cards/meta.json offset, two-sided card shader with own-colour floor 0.7 day / 0.35 night, a contact patch at the feet, `proj.py tune.json` before each render. CB's 2026-11-13 rule: Blender only renders MASKED LAYERS (metal reflections, bounce, AO) over the coded frame, never the whole frame.
- RunPod (ESTIMATE from the armor film, not measured here): RTX 4090, `install_blender.sh` + `libegl1 libgl1 libopengl0`, 6-8 Blender processes per machine; armor: 4.2-4.6 s/frame, 362 frames for about 1.30 USD. 1898 truck-layer frames would be a few USD and 1-3 machine hours; needs the lead to create machines and CB's spending cap.
- Assets in three.js instead: hero_truck.js would load a GLB (GLTFLoader vendored into templates/threejs_film/vendor, async set build already supported), swap red materials by colour, and lose `setDoor/setSteer/setWheels/setBeacon`, masking, ribbon, lettering anchors unless rebuilt on the asset; 1.8 M tris = 3x render time; needs decimation (to about 300 k) for rows of trucks.

## Recommendation (3 lines)
1. Keep the CODED truck and gun as the hero: no free asset has the era or the story; the downloaded ones are generic (Hard Rule No. 2 fails).
2. Use downloads only for background parts (CC0 HDRI/concrete textures, maybe a modern Pierce in a "today" shot), logged in ASSETS.md.
3. If CB wants Blender light, do it as the parked masked layers (paint/chrome reflections, contact shadow) on RunPod, not as the whole frame: 19 h CPU here is too long.

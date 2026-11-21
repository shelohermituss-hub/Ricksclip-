# STATE: PLACE C, THE MAP (S4, line 7, 25.65-32.30 s; set-builder round 1, 2026-11-21). Sheet: MAP_SHEET.jpg (8 tiles, looked at)
## NOT done / still wrong (seen in the sheet)
- No Rick frame in the repo: no side-by-side, no close-up 90 % check; numbers only against his measured bands (LOOK_BIBLE).
- Saturation low: Blender 0.19-0.26 (< 0.30 day floor), kit 0.27-0.46. The pastel print + bleached sun wash out; the paper reads near white in Blender closes.
- Kit wide edge below the 0.14 target in the first pass (0.098: half the frame was table and sky); re-aimed, see numbers below.
- Not built: cloud shadows drifting (row 22), glint wave through the lime noses (row 25), air life (motes, shimmer), paper corner draught. Door wave and paint wave ARE built.
- Kit: the tiny truck has 4 flat materials (no PBR paint patch, no letters); near closes (Dallas, Pine Hollow) show it; use assets.js buildTruck(light) there if it shows.
- Station models are coded card boxes (~600 tris): no fold edges, roofs plain; the Pine Hollow model is the same model as all others (sign differs only).
- Printed town plan at Pine Hollow: streets read but PINE HOLLOW label sits on the grid lines; MISSOURI / OUR TOWN letters cross the plan in the inset.
- Blender seconds per frame 52-101 s at 540x960 16 spp (CPU shared with other helpers): heavier than the town (22-42 s).
## Built (files)
- `build_map.sh` (one re-runnable script; `--lite` kit copy only; `--proof` stills + numbers + sheet; ends MAP_BUILD_END / MAP_PROOF_END; build about 1 min, proof about 9 min).
- `scripts/fetch_map.py` (Poly Haven, ambientCG, us-atlas and fonts from npm), `map_geo.py` (ONE geography: Albers lower 48, cities, interstates, fold height, stations),
  `tex_map.py` (PIL print 8192x5120 + 4k, insets 640 px/m at Pine Hollow and Dallas, sand disc, sign atlas, door/wall/roof), `bl_map.py` (the world), `map_api.py`
  (Blender controls set_doors / set_paint / set_sand, LIGHT, KIT_LIGHT), `bl_map_lite.py`, `bl_map_proof.py`, `cams.py` + `map_cams.json`, `kit_films.py`, `numbers_sheet.py`, `proof/run_kit.sh`.
- `out/map.blend` (61 MB, 4.25 M tris incl. 2 truck copies; 94 truck instances), `out/map_meta.json` (anchors, stations, door row, light), `out/map_lite.glb` (25 MB, 241 k tris),
  `out/map_truck_tiny.glb` (3,989 tris, 4 materials). `../map.js` (kit module), `../map_STORY.md`, `../map_DRESSING.md`, assets/ASSETS.md MAP section.
- film.json: places.map = { set: 'map', light: 'morning', light_over: LIGHT.map, doors: {at, wave, dur}, paint: 'lime'|'red'|'wave', sand: v | {at, dur} } (proof/kit/film_*.json).
- Anchors (Z up, plan m): map_centre, pine_hollow_station, dallas_label, dallas_station, door_row [x,y,z,city] west->east (94), highway_path (Pine Hollow -> Little Rock ->
  Texarkana -> DALLAS, 31 points on the paper), title_block, compass, cities{}. I-35 and I-45 also reach the DALLAS dot from the south (the proof glide uses I-35).
## Numbers (proof/numbers.json; 540x960; Blender Cycles CPU 16 spp + OIDN, Standard; kit 2nd-frame seconds)
NUMBERS_TABLE
## LECONS (LECONS format; the lead copies them into LECONS_TECHNIQUES.md)
- 2026-11-21 truck_api.set_paint(masking=False) on truck_light.blend: AssertionError mask_paper missing. Cause: the light truck has no mask materials (bl_light removed them
  with no fake user). Fix: masking=None (leave the masks as saved). Guard: bl_map.py calls set_paint(masking=None); build stops on Traceback. Proof: logs/map.log MAP_DONE. FERMÉ
- 2026-11-21 94 truck_light copies would be 94 x 161 draw calls (15 k) and 3.3 M tris in the kit. Cause: the glTF truck is 161 meshes / 34 materials. Fix: map_truck_tiny.glb
  (joined, 4 materials, 4 k tris) drawn as 4 InstancedMesh with per-instance paint colour. Guard: PHFD_MAP line prints meshes/trucks/tris. Proof: 615,888 tris, 600 meshes, 1.1-7 s/frame. FERMÉ
- 2026-11-21 matplotlib is not installed (point-in-polygon). Fix: a 50 px/m PIL raster of the states as the inside test (tex_map.inside_us_fn). FERMÉ
- 2026-11-21 DejaVuSerif-Italic is not in the image (OSError cannot open resource). Fix: LiberationSerif-Italic. Guard: fonts are absolute paths at the top of tex_map.py. FERMÉ
## Open for other departments
- Lead: Pine Hollow is placed in the Ozarks (lon -91.55, lat 36.3, north Arkansas / south Missouri line): OK or move it (map_geo.CITIES). Saturation fix wanted? (stronger tints).
- Effects: lime mist row 24, glint wave row 25, heat shimmer on the sand (row 28). Background painter: nothing (indoor table; the sky is only seen past the table edge in lows).
- Stretch builder: the S3->S4 join needs the town to cross-fade to the printed plan at Pine Hollow (anchors pine_hollow_station; the plan's MAIN ST runs E-W through the dot).

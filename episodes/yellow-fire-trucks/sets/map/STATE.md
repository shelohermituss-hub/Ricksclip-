# STATE: PLACE C, THE MAP (S4, line 7, 25.65-32.30 s; set-builder round 1, 2026-11-21). Sheet: MAP_SHEET.jpg (8 tiles, looked at)
## NOT done / still wrong (seen in the sheet)
- No Rick frame in the repo: no side-by-side, no close-up 90 % check; numbers only against his measured bands (LOOK_BIBLE).
- Saturation low: Blender 0.19-0.26 (< 0.30 day floor), kit 0.27-0.46. The pastel print + bleached sun wash out; the paper reads near white in Blender closes.
- Wide still below 0.14 (.124 both): the portrait frame shows the table above and below the map. Dallas close: a near station roof blocks the lower left.
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
| cam | Blender edge / s | kit edge / s | note |
|---|---|---|---|
| wide | .124 / 57 | .124 / 1.7 | below .14: portrait frame of a 1.6:1 map shows table above and below |
| station_open | .163 / 53 | .143 / 1.9 | door wave mid-way, red->lime |
| dallas | .140 / 57 | .142 / 3.5 | a near station roof (bell) fills the lower left: re-aim in the stretch |
| pine_sink | .273 / 101 | .261 / 1.1 | |
GATE median: Blender .151 PASS, kit .143 PASS (target .14; none under .08). Brightness .46-.69 (above the .42-.50 band in closes), saturation above.
Kit: 615,888 tris (241 k set + 94 x 4 k trucks), 600 meshes, load 1.5-2.4 s. Kit brass (bell, flag ball) renders black: no env map on GLB metals.
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
## FIX 2 (2026-11-21) - sheet FIX2_SHEET.jpg (8 tiles, looked at), numbers proof/fix2/numbers.json; run fix2_run.sh (3 rounds a/b/c; build -> out_tmp/, renamed)
- NOT done: Blender saturation station_open .263 (< .30): a third of that frame is the grey-blue world sky (LOOK, lead); the others pass (wide .319, dallas .329,
  pine_sink .321, cities_field .325; before .186-.258). Field stations are all one model without signs; the S4 builder must call add_field / places.field.
  WARNING to S4: between 02:33 and 02:39 out/map_truck_tiny.glb was a shattered truck (see LECONS); a kit render of S4 made in that window must be redone.
- Done, seen: 1 print tints about x3 (state tints, water, paper cream), card walls warm tan, roofs warm slate. 2 dense pop-up field: make_field.py -> out/map_field.json
  (260 small stations, scale .5-.68, on land, >= .62 m apart, >= .8 m from a city); kit places.<name>.field: true | n (instanced: station parts, doors with the
  wave, tiny lime trucks with the paint wave), Blender MA.add_field(scene) (linked copies, map_station 'FIELD', driven by set_doors / set_paint). Camera
  counts (projection, 9:16, lens on 36 mm tall): S4 B as planned (3.45,-.3,.78)->(2.85,1.9,.05) 24 mm: 4 city stations -> 26 with the field (table edge shows at the
  top); (3.0,-.3,4.0)->(2.85,1.9,.05) 24 mm: 35, no table edge (proof cam cities_field). No camera shows more than 14 without the field.
  3 kit metals get a painted studio env map (brass compass reads brass, tile 7). 4 map.js setStation(i | 'CITY', { paint, door }) + stations(); setStation(i, null) clears.
- Kit cost with field: +260 x (station + 2 doors + 2 trucks of 6,000 tris): 4.6 s/f at load 3.3 (cities_field).
## FIX 2 LECONS (LECONS format)
- 2026-11-21 The rebuilt tiny truck came out in shards (kit bays). Cause: assets_prod truck_light grew to 37,236 tris (02:15) and one COLLAPSE decimate to 4,000
  tore it. Fix: bl_map_lite planar dissolve 4 deg, then collapse only above 6,000 (37,236 -> 6,000). Guard: TINY_DEC line in logs/fix2_lite.log; look at a kit
  close after any assets_prod change. Proof: FIX2_SHEET tile 7 (kit dallas: whole lime trucks). FERME
- 2026-11-21 Doubling pastel tints only moved Blender saturation .19 -> .25. Cause: the closes are mostly cream station walls and grey sky, not print. Fix: tints x3
  + warm card walls. Guard: measure saturation per tile (fix2_sheet.py). Proof: 4 of 5 tiles >= .30. FERME for the set; station_open OUVERT (sky, lead).

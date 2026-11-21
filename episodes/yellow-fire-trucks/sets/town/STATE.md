# STATE: PLACE A, PINE HOLLOW town set (set-builder, round 1, 2026-11-20). Sheet: TOWN_SHEET.jpg (8 tiles, looked at).
## NOT done / still wrong (seen in the sheet)
- No Rick frame in the repo: no side-by-side, no close-up 90 % detail check per object. Numbers only against his measured bands.
- Kit PARK still times out (Playwright 30 s screenshot limit under SwiftShader, even with 40 % of the grass): no kit park tile. Needs a lighter kit park (fewer tree/grass tris) or a kit timeout.
- DU Blender park brightness 0.293 (< 0.31 floor); DU Blender yard_wide edge 0.121 (passes the floor, below 0.14): plain asphalt foreground.
- DU: no visible sodium pool on the road at the crossing; kit DU sky is a flatter violet than Blender's plum-to-apricot.
- Yard line in the low close reads as a wide chipped strip with its ghost line, not one clean ruler line (row 57 wants clean): decal to simplify.
- KEEP CLEAR on Main reads mirrored from the shop (it faces drivers coming from the east); shop window glass is invisible in the kit (opacity .18 too low to read).
- Street blades are tiny in the crossing tile; swing hidden behind the trunk in the park view; no air life (dust, moths, pigeons) built; signs/shingle motion not rigged.
- Houses are coded boxes with porches (no free 1970s house asset found yet); water tower, poles, lamp head coded too (DRESSING.md lists them).
- Chief's pumper is the same 1940s ALF asset as the hero (aged, 1 siren); a licence plate from the asset shows on its bumper (props-hero).
## Built (files)
- `build_town.sh` (ONE re-runnable script; `--proof` = stills + numbers + sheet; ends TOWN_BUILD_END / TOWN_PROOF_END; whole build about 2 min, proof about 20 min).
- `scripts/fetch_town.py` (46 Poly Haven CC0 files), `tex_town.py` (PIL: repainted textures, lettering, decals), `bl_town.py` (the world), `town_api.py`
  (Blender controls: set_light('am'|'du'), set_trucks, hero_root, chief_root; KIT_LIGHT), `bl_town_proof.py`, `town_cams.json`, `kit_films.py`, `numbers_sheet.py`, `proof/run_kit.sh`.
- `out/town.blend` (157 MB, both lights switchable, trucks appended from assets_prod/out/truck.blend as independent copies so paint and dusk drain work per truck;
  a pure link would share one paint), `out/town.glb` (83 MB, 395 k unique tris; tree at 6 %, grass at 30 %), `out/town_meta.json` (anchors + kit light).
- `../town.js` (kit set module: GLB + two trucks from assets.js, lamps, lit windows, card stand-in, anchors, export LIGHT), `../town_STORY.md`, `../town_DRESSING.md`, assets/ASSETS.md TOWN section.
- film.json: places.<name> = { set: 'town', kind: 'am'|'du', light: 'morning'|'golden', light_over: LIGHT[kind], kit3d: { envGround } } (see proof/kit/film_*.json).
## Numbers (proof/numbers.json; 540x960; Blender Cycles CPU 32 spp + OIDN for this set, 16 spp from now on (user rule "aperçus légers"))
| gate (yard_wide, yard_medium, yard_low) | edges | median | PASS |
|---|---|---|---|
| Blender AM | .243 .220 .248 | .243 | PASS |
| Blender DU | .121 .149 .166 | .149 | PASS |
| kit AM | .250 .194 .226 | .226 | PASS |
| kit DU | .220 .166 .164 | .166 | PASS |
- Extras: Blender shop .256/.237, crossing .194/.167, park .386/.238 (AM/DU). Kit shop .203/.196, crossing .233/.182.
- Seconds per frame: Blender 22-42 s (median ~31 s); kit second frame 3.3-7.1 s AM, 7.2-13.5 s DU (lamps).
- Brightness DU: Blender .42-.48 except park .293; kit .34-.54. Day sky share: Blender wide .39 before the re-aim, kit .18-.26.
## LECONS (for LECONS_TECHNIQUES.md, the lead copies)
- 2026-11-20 Poly Haven answered 403 to every download. Cause: it refuses the default "Python-urllib" User-Agent. Fix: fetch_town.py sends a browser-like UA.
  Guard: build_town.sh stops if logs/fetch.log has a FAIL. Proof: 46 files ok. FERMÉ
- 2026-11-20 The decimated kit tree was not decimated (GLB 148 MB). Cause: a modifier on an object in an EXCLUDED collection is never evaluated. Fix: decimate a
  temporary object linked to the scene. Guard: log line DECIMATE n -> m. Proof: 1,072,212 -> 64,332. FERMÉ
- 2026-11-20 DU stills failed with KeyError 'headlight_glass'. Cause: masking swaps a truck's own materials out; with 0 users they are dropped on save, set_masking(False)
  then cannot restore. Fix: town_api.link_trucks sets use_fake_user on all materials. Guard: the DU proof runs set_trucks(masking False) after reopening. Proof: 6 DU tiles. FERMÉ
- 2026-11-20 build_town.sh stopped silently after the AM tiles. Cause: `set -e` + a grep with no match. Fix: `|| true` on report greps. Guard: TOWN_PROOF_END line. FERMÉ
- 2026-11-20 glTF loses emission set to 0. Cause: the exporter drops an emissive of strength 0. Fix: strength 1 at export, the kit sets the level per kind. FERMÉ (DU kit windows lit).
## Open for other departments
- Lead: OK the map (station north of Main, shop south facing bay 1, crossing east, park SE, water tower N). Kit owner: a per-film screenshot timeout (park).
- Background painter: sky dome, clouds, far haze (hills are simple domes). Props-hero: plate on the asset bumper; a distinct older pumper if wanted.

## LITE (kit staging copy, 2026-11-21; the final render stays on town.blend, untouched)
- Built: `scripts/bl_town_lite.py` (opens out/town.blend, writes out/town_lite.glb), run by `bash build_town.sh` and alone by `bash build_town.sh --lite` (18 s). `town.js`: `places.<name>.lite = true`
  loads town_lite.glb and, in lite, both trucks use truck_light.glb (35 k tris; `truckFull: true` keeps the full trucks). Default is unchanged. `LITE=1 ONLY="am_<cam>_lite" bash proof/run_kit.sh` renders lite stills.
- Means: grass patches only within 8 m of yard/crossing/park/shop anchors and camera spots (120 of 210 removed, the ground texture carries the lawn), kept patches and trees decimated hard (tree 1.07 M -> 6.4 k, patch 207 k -> 4 k), bush/dandelion capped 800 tris, any mesh >40 k capped. Env knobs: LITE_GRASS_R, LITE_TREE_RATIO, LITE_GRASS_RATIO.
- Numbers (AM, 540x960, kit, 2nd-frame seconds; full = old STATE numbers 3.3-7.1 s, park timeout >30 s): tris 16.4 M -> 1.15 M (+2 light trucks).
  | cam | lite s | edge full | edge lite |
  | yard_wide | 1.7 | .250 | .249 |
  | yard_medium | 3.0 (card+shadows, noisy) | .194 | .193 |
  | yard_low | 2.5 | .226 | .225 |
  | park | 6.0 (1st frame 19 s, no timeout) | timeout | .294 |
  Yard median edge .225 (>= .14 floor, PASS); park .294 PASS. Sheet: LITE_SHEET.jpg (FULL park tile empty: it times out).
- NOT met: the 2 s target is met only on yard_wide (1.7 s); yard_medium/low 2.5-3.0 s. Timing is noisy (+-0.5 s). Yard views are pixel-near identical to full (no trees/grass in frame), so the cost left is the kit's own floor.
- WEAK: lite park: grass reads as a dark spiky mass (decimated blade cards), tree leaves sparse. A near-grass tier (ratio .1 within 4 m) did not look better and cost +4 s: dropped. Better fix: a grass proxy (flat green tufts card or textured ground only) or bake a lawn texture.
- LECON 2026-11-21: problem: 16.4 M tris in the kit though the GLB has 395 k unique. Cause: glTF instances share meshes; the loader clones them, and 210 grass patches (62 k each = 13 M) + 36 trees (64 k = 2.3 M) are counted per instance. Fix: lite GLB (above). Guard: log line PHFD_TOWN {"lite":..,"tris":..} and LITE_TRIS in logs/lite.log. Proof: 16.4 M -> 1.15 M.
- LECON 2026-11-21: problem: kit frame cost stayed 2.5-3 s after cutting the town to 1.1 M tris. Cause: the two full trucks (assets.js) cost about 2.2 s/frame of the total (no trucks: 0.9 s). Fix: opts.light (truck_light.glb) in lite. Guard: measure with trucks:false first. Also: `film_plan.py bake` writes one shared out/plan: never run two films' bakes in parallel.

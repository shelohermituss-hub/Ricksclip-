# STATE: production asset pack (props-hero, round 1, 2026-11-20). Proof sheet: `props/ASSET_PACK.jpg` (looked at).

## NOT done / weak (seen in the sheet)
- Era: the truck is the 1940s ALF (long-nose closed cab), not the plan's 1970s cab-forward. No dealer's price card, no four sirens, no beacon ROW (plan rows 4, 17, 18): the asset has ONE roof beacon, one bumper siren, roof lamps. Not added this round.
- Sprayed edge: reads as a soft speckled gradient; the lemon RUNS are in the shader but hardly visible at tile size (4x crop shows none clearly). Newspaper print on the masking is not legible at tile size (reads as white paper; tyres read like white-walls).
- Dusk tiles use the Poly Haven industrial-sunset HDRI: pale evening, NOT the LOOK_BIBLE plum/apricot (light is the look dept's). The paint drain itself works (red -> grey-plum, lemon stays light).
- Compressor is still a modern 12 V mini compressor (shape); gun alone tile floats 16 cm above the concrete (product shot, shadow below). Gun reads dark grey in the kit fist tile (aluminium with prop_kit's studio env).
- Speckle/run noise differs between Blender (Blender noise) and three.js (own GLSL hash): same rules and constants, not pixel-equal.
- No phone-size (360 px) check, no Rick frame (none in repo). Sheet labels overrun into the next tile in two places.
- Blender tiles have no yard set (concrete + HDRI only); the kit tile has the asset-test yard.

## Files (sources committed; out/, build/, logs/, proof tiles git-ignored and rebuilt)
- `build_assets.sh` (re-runnable: re-downloads missing files, extracts textures, PIL edits, builds GLB + .blend; `--proof` adds tiles + sheet). Ends BUILD_ASSETS_END / PROOF_END. Whole run here: about 4 min.
- `scripts/bl_extract.py` (textures + object list), `tex_make.py` (PIL, outside Blender: truck_letters.png, newspaper.png, wear.png, comp_label.png), `paint_nodes.py` (node group PHFD_paint), `bl_truck.py`, `bl_props.py`, `truck_api.py` + `props_api.py` (Blender controls for the final: append, set_paint, set_wheels, set_beacon, set_door, set_bell, air_hose), `bl_proof.py`, `sheet.py`.
- `out/truck.glb` 27.5 MB 142,792 tris; `out/truck.blend` (packed); `out/gun.glb/.blend` 31,096 tris; `out/compressor.glb/.blend` 24,612 tris; `out/truck_meta.json`, `props_meta.json` (pivots, anchors, sizes).
- three.js: `sets/assets.js` (buildTruck async, setPaint/setWheels/setBeacon/setDoor/setBell, anchors; buildSprayGun (held3d, sync: GLBs preloaded by top-level await), buildCompressor, buildAirHose, hosePoints). `sets/assets_proof_yard.js` = PROOF set only. `vendor/` = GLTFLoader (three r165, imports /kit).
- Proof: `proof/run_kit.sh`, `proof/kit/build_kit.py` (symlinks sets, assets_prod), `proof/numbers.json`.

## Frames
Truck: metres, front -X, driver side -Y (three: +Z), Z up, origin on the ground, 7.59 x 2.51 x 2.66 m, wheel r 0.502 at x -1.68 / 2.02. Gun: nozzle +X, origin = grip. Compressor: origin on the ground. Plan coords = Blender coords.

## Numbers (measured here, 4 CPU, no GPU; proof/numbers.json)
- Blender Cycles 32 spp + OIDN, 800x600: truck tiles 10.7-12.4 s, door close-up 20.7 s, gun 10.2 s, compressor+hose 10.6 s (open .blend once per process; truck build 4 s).
- three.js kit 800x600: truck 1.0 s/frame, gun in fist 1.2 s (second frame); GLB load 0.5-0.6 s.
- Edge density (detail_density.py on 400x300 tiles): Blender truck wide 0.046-0.061 (empty sky + ground), kit truck same camera 0.094, door close-up 0.182, lettering crop 0.160, fist 0.153, bell+bow crop 0.089, gun alone 0.032, compressor+hose 0.023.

## LECONS (for LECONS_TECHNIQUES.md, the lead copies) 
### 2026-11-20 — The held-prop fist read dark maroon, not ink (yellow-fire-trucks, kit held3d) — FERMÉ
- Problem: the round fist on the asset gun measured (31, 2, 7) beside the card arm (42, 26, 29) (sets/_asset_test kit_gun_fist).
- Cause: film.js h3Fist draws ink #2a1a1f with toneMapped:false, but the final post pass tone-maps every pixel OUTSIDE the card mask with neutral(); for dark colours it subtracts x - 6.25x^2 (x = min channel) from all channels: linear (.0232,.0103,.0137) -> (.0136,.0007,.0041) = sRGB (31,2,8). The fist is not in the card mask.
- Fix: sets/assets.js inkFist(): an onBeforeRender on each fist mesh pre-compensates c = t + (sqrt(t_min/6.25) - t_min) (flat .04 above .08), once per colour set. Proper fix for the kit owner: draw held3d_fist meshes white in the mask pass (film.js swaps loop) so they skip neutral().
- Guard: the compensation is in the prop module every held3d asset uses; numbers check: fist pixel == arm pixel.
- Proof: proof/kit/stills/kit_gun_fist/f_00000.png: fist (42,25,28) x294 px = arm (42,25,28).
### 2026-11-20 — A '#' or '//' comment pasted mid-line ate the statements after it (bl_truck.py, assets.js) — FERMÉ
- Problem: pivots did not hold their meshes (door and beacon stayed on the root, data shifted); the fist fix did nothing. Cause: a sed/replace appended a comment in the middle of a multi-statement line (REGLES 4 already warns). Fix: comment on its own line. Guard: print parent names after the build (DOOR/BEACON lines in logs/truck.log); grep for '; *#' and '; *//' lines before a render. Proof: door_driver now parents 6 meshes (dbg in logs), sheet shows the door.
### 2026-11-20 — Still rendered before the GLB's helper textures loaded: black masking paper (assets.js) — FERMÉ
- Cause: TextureLoader.load is async, the kit renders frame 0 at once. Fix: await loadAsync before buildTruck returns. Proof: kit tile shows the papered glass and tyres.

## Open for the lead
- Kit owner: put held3d fists in the character mask (film.js) and drop inkFist. Look dept: dusk light for Blender (plum/apricot), yard set in Blender. Plan: accept the 1940s cab or ask for the missing gags (price card, sirens x4, beacon row) as additions on the asset.

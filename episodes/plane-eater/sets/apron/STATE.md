# STATE: AIRFIELD APRON, AERODROME DE VILLEBRUNE (plane-eater, set-builder). Round 1 + one fix round, 2026-11-21. Sheet: APRON_SHEET.jpg (looked at).
## Built (code only, no hand edits): `bash build_apron.sh [--proof]` (about 10 s build, about 3 min proof on a loaded 4-core box)
- scripts/tex_apron.py (painted textures: concrete, cloth, wood, canvas, sign, plaque, poster, pump face, windsock, field patchwork), scripts/bl_apron.py (world),
  scripts/apron_api.py (`set_light(sc, 'day'|'dusk'|'winter')`: Rick recipe sky + sun from rick_light.json, sun from SSE; dusk switches the 4 work lamps; `link_cessna`),
  scripts/bl_apron_proof.py + apron_cams.json (4 plan stations), scripts/apron_sheet.py (outline via rick_outline, numbers, sheet).
- out/apron.blend (no plane; the proof appends props/out/cessna150.blend), out/apron_lite.glb (21 MB, all meshes), out/apron_meta.json (20 anchors, tris, kit light).
- ../apron.js (kit: loads apron_lite.glb, dusk work lamps + hangar tubes, 160 drifting motes, windsock sway; node --check OK, NOT yet run in the kit).
- ../apron_STORY.md, ../apron_DRESSING.md, library rows pe_hangar + pe_apron (library/LIBRARY.md, Buildings).
## Triangles (evaluated, bevels applied): total 392,919 (< 1.5 M) = NEAR 115,060 / MID 127,816 / FAR 91,256 / GRASS 57,347 / AIR 1,440. Proof lens band adds about 40 k per camera.
## Layout (metres, X east, Y north): Cessna spot origin, nose south. Hangar 20 x 16 m (y 9..25, eave 6.0, ridge 8.2), doors 4 x 3.85 m half open (gap 7.4 m).
  Table (3.6, -.55) under the left wing; chair south of it; hazard plaque (8.75, 8.94, 1.81) on the east pier behind the table in V3; poster west pier; deck chair (-6.4, 5.4)
  facing SE; AVGAS pump (-11, 2); drums (11.3, 8); windsock (-15.5, -7); near tree (8.2, -5.2); strip y -26..-48; fence y -56 and x 34 (gate at y -6); far fields, 14 hills.
## Numbers (proof/numbers.json, 540x960, 16 spp + OIDN, outline on, NO grade). Sec per still: 44 / 49 / 43 / 26.
| still | edge | regions | colours>1% | mean | p1 | p99 | density_check --day |
|---|---|---|---|---|---|---|---|
| V1 hook row 1 | .095 | 819 | 38 | .52 | .24 | 1.0 | 2/7 (edge, empty 54 %, layers 1, haze) |
| V2 wide row 8 | .360 | 1062 | 45 | .54 | .13 | 1.0 | 4/7 (lens-band grass overdoes the edge number) |
| V3 table row 10 | .127 | 831 | 46 | .61 | .21 | .995 | 3/7 |
| V4 reverse row 27 | .090 | 380 | 28 | .67 | .20 | 1.0 | 1/7 (sky + concrete empty 62 %) |
## WEAK / still below Rick (honest)
- Means .52-.67 vs DAY .48 and p1 .13-.24 vs .06: too bright and flat; shadows lack the deep contact darks. Grade not applied (lead decided no grade for props);
  needs a light pass: darker concrete still, or exposure -0.3, and AO/contact under table, drums, wheels.
- The table is NOT clearly in the wing's shade in V3 (the shade lands behind it): move the table ~0.8 m north (y +.25) or turn the sun more south; check in one still.
- V1 and V4 have big empty concrete foregrounds (G3 empty 54 % / 62 %); the stretch builder's own lens props (shaker, wing tip) must fill them; V4 needs the trolley.
- Near tree crown reads round / topiary (library known fault); far trees are lollipops. Slab tops show faint diagonal shading (low spp + OIDN?): check at 64 spp.
- GLB: lawn, blades and tree crowns are procedural in Blender: the kit gets base colours only. 21 MB GLB with about 2,000 objects: join per material if the kit is slow.
- No sky clouds (background-painter); hills/fields are place-holders. No air-life seen at proof size. Phone check (360 px) not done on these stills.
## Open for other departments
- Stretch builders: own cameras + lens bands (G.tufts_lens_band), frame-0 wing tip framing (V1 is a set proof, not the hook shot).
- Background-painter: sky, cumulus, far haze; sight lines kept south (strip/fence/hills) and NE (poplar row).
- Lead: OK on the airfield name "AÉRODROME DE VILLEBRUNE" (invented) and the windsock/cones in safety ORANGE (not red).

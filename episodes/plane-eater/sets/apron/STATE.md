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
## FIX 2 (lead round, 2026-11-21): concrete #a7a6a3 (float-blurred mottling + warm/cool drift; joint bed under the slabs), exposure -0.3 (sky lifted 2**.3),
  grade_rick DAY on the proofs (apron_sheet.py), table moved to (3.4, -.32) = cloth top fully in the wing shade (ray-cast to the sun, 9/9 points), near tree to (7, -4.9)
  (dapple on the concrete beside the table), cumulus low in the camera sky (style-test world nodes, apron_api._world), contact discs under legs/wheels/drums/chairs
  (contact_*, Blender only; kit hides them), far trees lod mid with irregular clumps + a 40-blob tree line at 160-230 m before softer, lower hills.
## Triangles now: total 997,733 (< 1.5 M) = NEAR 115,126 / MID 127,816 / FAR 696,004 / GRASS 57,347 / AIR 1,440.
## Numbers (proof/numbers.json, 540x960, 16 spp + OIDN, graded, outline). about 30 s per still.
| still | edge | regions | colours>1% | mean | p1 | p99 | density_check --day |
|---|---|---|---|---|---|---|---|
| V1 hook | .106 | 723 | 48 | .463 | .073 | .964 | 4/7 (edge, empty 35 %, layers) |
| V2 wide | .400 | 1081 | 44 | .497 | .051 | .947 | 5/7 (lens-band grass inflates edge) |
| V3 table | .136 | 849 | 48 | .480 | .058 | .963 | 4/7 (edge, chroma 75.6, layers) |
| V4 reverse | .120 | 805 | 44 | .484 | .052 | .963 | 4/7 (edge, empty 19 %, haze) |
## WEAK / still below Rick
- V4: white blotches on the hangar floor in the foreground (not the texture, not gloss: still there with roughness .92); likely 16-spp OIDN noise from the
  2 area fills, amplified by the grade. Try 64 spp or lower the area fills. OPEN.
- Leaf dapple reads on the concrete around the table, not on the cloth (the cloth is in the wing shade, as asked). Near crown still round (library fault).
- V1/V4 foregrounds empty until the stretch builders' near props, trolley and lens bands arrive. Kit apron.js not yet run in the kit. Phone check not done.
## Open for other departments
- Stretch builders: own cameras + lens bands (G.tufts_lens_band), frame-0 wing tip framing (V1 is a set proof, not the hook shot).
- Lead decided 2026-11-21: Villebrune OK, safety orange OK, sky built here (no separate painter).

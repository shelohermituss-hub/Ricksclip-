# STATE props-hero (plane-eater), 2026-11-21, after round 2 (small props)
Built (all by `bash props/build_props.sh [--proof]`, about 8 s build + 2 min proof):
- out/cessna150.{glb,blend}: Cessna 150 F-MIAM from Sketchfab c9cadc2f (NLM-Group, CC BY 4.0) 172SP; 75 parts, 185,052 tris,
  span 10.17 / length 7.61 / height 2.48 m; white #f3f4f1 gloss + navy #1d3461 stripes (lead: red only on Michel); fin whitened;
  F-MIAM DejaVu Sans Bold navy, raised 1.5 mm, projected per vertex on both fin and fuselage sides; parts split _L (+X) / _R.
- out/cessna150_wingoff.*: left wing + flap + aileron + strut + spat gone, stepped stub, outer panel on grass.
- out/cessna150_sliced.*: 9 slices, gap 0.22 m, nodes slice_0 (nose)..slice_8 (tail), sawhorses on slices 0,2,4-8; eaten stages = hide from tail.
- out/cessna_meta.json: sizes, parts, slice table. Scripts: props/scripts/bl_cessna.py, bl_proof.py, make_sheets.py; props/fetch.sh.
- Sheets: props/HERO_SHEET.jpg (hero 3/4, side, front, top rear, wing-off), props/STATES_SHEET.jpg (sliced, tail+cabin eaten,
  nose only, stub macro, F-MIAM macro); tiles in props/tiles (git-ignored), times 10-17 s per tile.
- PROPS.md (all script + CREATIVE props with five details), ASSETS.md, library/LIBRARY.md row `cessna150_fmiam`.
Numbers: see crew/props-hero_check.md (density 0.054 vs Rick 0.158 on crop: below, empty proof set).
Weak / open: no 1970s instrument dials; 172SP details; tyre sliver loose in half-eaten state; small props (bites, plate, shaker,
scale, oil glass, jug, tongs, certificate, tray) not built yet: next round from PROPS.md.
Lessons: o.bound_box is stale right after a bmesh edit (use vertex coords); shrinkwrap OUTSIDE_SURFACE sank letters into this asset
(inward normals) -> per-vertex X ray projection; flat text over a curved skin needs densify before projection; Blender's Python has no PIL.
Round 2 (small props): scripts/bl_props2.py -> out/{fork,knife,salt_shaker,hacksaw,sugar_tongs,metal_bites,plate,oil_glass,water_jug,
kitchen_scale,dessert_trolley,cloche_bell,record_book,certificate,owner_rag_spanner,airline_tray}.glb + props2.blend + props2_meta.json;
proof scripts/bl_proof2.py + make_sheets2.py -> PROPS_SHEET2.jpg (`bash build_props.sh --proof2`, ~6 min, 5 tiles, preview stands only).
Weak: rag is a lumpy sheet; cake tower items small (cart hidden behind the bike from the front); fork/knife small in the table tile;
scale "2" numeral sits under the needle. Open: X-ray film/light box, mini Cessna of bites, deck chair + beards, airliner seat, napkin.
Lesson: a copied stage() that returns early skips the render settings -> AgX + 1920x1080 beauty vs 900x1600 id pass = ghost outlines.

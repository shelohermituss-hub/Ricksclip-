# props STATE (props-hero, 2026-11-21, round 1)
Built: car (Sketchfab CC BY Buick, repainted, letters/plate/logo/credits blanked, foam + wet), bucket, chamois, sponge, hose reel,
hose (curve) + brass nozzle, mailbox + flowers, kid's bike (lying), water arc + drops + crown. All placed to LAYOUT.json at build time.
Files: build_props.py (run: `blender -b --python props/build_props.py`, about 3.5 min), hose_tool.py (make_hose / make_water,
importable in scene.blend), props.blend (22 MB), hose_points.json + water_points.json (WORLD; delete them to regenerate from
LAYOUT, edit them to re-route), props_stats.json (sizes, triangles, placements), render_sheet.py -> _sheet_tiles/ + PROPS_SHEET.jpg,
ASSETS.md, PROPS.md, PROP_STATES.md, crew/props-hero_check.md, crew/props-hero_vs_rick.jpg (PRIVATE: has a Rick frame).
Numbers: car 1.83x5.41x1.50 m, 164k tris, density vs Rick 98/106/113/94 %. Water arc 5.33 m, 96 drops total.
Weak: water shading (look-finisher), wet streak visibility, sponge pores only in macro.
Open: if LAYOUT moves the kid, the hose and water JSONs must be deleted and the script re-run (they are frozen once written).

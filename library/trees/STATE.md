# rick_tree + rick_grass state (2026-11-21, 3d-designer)
Built: library/trees/rick_tree.py (make_tree), library/grass/rick_grass.py (flat_lawn, tufts, tufts_along, tufts_around, tufts_lens_band).
Proof: library/trees/tree_sheet.sh -> TREE_SHEET.jpg (2x2: spread/round/tall near + road with mid/far), out/stats.json (git-ignored).
Bark: Poly Haven bark_brown_02 1k CC0 via fetch_tex.sh into tex/ (git-ignored from now; NOTE commit 5ca778d already added tex/*.jpg).
Measured (Cycles CPU 16 spp + OIDN, 540x960, 4 cores): 7-12 s per panel; whole proof 38 s incl. build.
Tris: near spread 67k, round 118k, tall 55k; mid 14-21k; far 2.7k; scene 624k. Build 0.01-0.7 s per tree.
Weak: crown lit tops less yellow than Rick's; some edge-on cards pale blue-grey; solid crown shadow (no holes);
  no terrain snap for tufts; no mask-image input; lawn colour tuned under day light only.
Open: card translucency/fresnel test; optional dapple holes; GLB export test into the three.js kit.
Round 2 (lead notes): smooth puffy denser clumps, cards half size x~3 count over whole outer surface, cells .075 m, card translucency = leaf colour x.5, spec 0.
  Tris near 66-84k, mid 35-45k, far 2.7k; 9-10.5 s per panel. Weak: clumps a bit topiary-regular; few light-grey cards from below.

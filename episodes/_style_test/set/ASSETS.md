# set/ ASSETS (3d-designer, 2026-11-21)
Every downloaded file is from Poly Haven (polyhaven.com), licence **CC0** (no credit required; credited anyway). Nothing bought, no NC/SA.
Files in `episodes/_style_test/assets/ph_set/` (git-ignored). Re-download: `python3 set/fetch_set.py episodes/_style_test/assets`
(uses the identical local CC0 copy from `episodes/yellow-fire-trucks/assets/ph_town` first, else `https://api.polyhaven.com/files/<id>`, glTF 1k).

FINAL CREDIT LINE (YOUTUBE.md): "Tree, plants, garden gnome and sprinkler models: Poly Haven (polyhaven.com), CC0."

| id | page | got | tris | used as | changed for this set |
|---|---|---|---|---|---|
| island_tree_02 | polyhaven.com/a/island_tree_02 | local copy (yft) | 1,072,212 | hero tree (9.5 m) + 13 far trees (same mesh, instanced) | leaves: saturation 1.4, value 1.15, yellow-green multiply, dark-underside gradient (object Z), sheen 0; branches greened 25 % |
| garden_gnome | polyhaven.com/a/garden_gnome | downloaded | 28,858 | the gnome by the stepping stones | saturation 1.35, value 1.1 |
| garden_sprinkler_01 | polyhaven.com/a/garden_sprinkler_01 | downloaded | 8,192 | oscillating sprinkler on the right lawn | scale 1.2, saturation 1.2 |
| flower_gazania | polyhaven.com/a/flower_gazania | downloaded | 14,340 (6 plants) | bed flowers, window-box flowers | scale 1.3-2.0, saturation 1.3 |
| flower_ursinia | polyhaven.com/a/flower_ursinia | downloaded | 24,917 (5) | bed flowers | scale 1.3-1.7, saturation 1.3 |
| periwinkle_plant | polyhaven.com/a/periwinkle_plant | downloaded | 34,350 (6) | bed flowers, tree-ring flowers | scale 1.2-1.6, saturation 1.3 |
| shrub_02 | polyhaven.com/a/shrub_02 | local copy (yft) | 27,254 (4) | foundation shrubs, hedge behind the right fence | scale .42-.7, saturation 1.25, green multiply 15 % |
| shrub_03 | polyhaven.com/a/shrub_03 | local copy (yft) | 8,287 (4) | plants in the two porch pots | scale 1.3-1.5 |
| grass_bermuda_01 | polyhaven.com/a/grass_bermuda_01 | local copy (yft) | 941 (21 clumps) | grass tufts along both drive edges | scale 1.6-2.2, saturation 1.3 |
| concrete_pavement (texture) | polyhaven.com/a/concrete_pavement | downloaded | - | NORMAL map only (strength .25) on drive, walks, steps, kerbs; colour stays ours | - |

Built by code in `set/build_set.py` (no clean free asset in the house style, or the layout needed exact sizes): house, garage, porch,
door + wreath + lamps, windows, clapboard, roof shingles, gutters, chimney, drive slabs/joints/cracks, walks, kerbs, streets,
stepping stones, beds + edging, picket fence, birdhouse, street sign, neighbour houses, hair lawn and the near grass blades.

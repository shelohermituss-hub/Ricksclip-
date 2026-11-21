# set/ STATE (3d-designer, round 1, 2026-11-21)
Rebuild: `blender -b --factory-startup --python set/build_set.py -- build set` (36 s) -> set.blend (75 MB, compressed) + set_meta.json.
Proof: `bash set/run_sheet.sh` (key 58 s + overview 46 s, Cycles CPU 16 spp, 3 threads) -> set/sheet/key.png, overview.png, set/SET_SHEET.jpg.
Downloads: `python3 set/fetch_set.py episodes/_style_test/assets` (all Poly Haven CC0, list in ASSETS.md).

## Frame
Built in a LOCAL frame (driveway along local +Y, garage door front at local y 9, metres, Z up), parented to the empty `set_root`, which
places it on LAYOUT.json: world = T(garage pos) Rz(-26 deg) T(0,-9). Checked: mark_house/garage/tree/drive/car_spot land on the
LAYOUT points to the mm (set_meta.json "anchors_world"). The LAYOUT camera is read into the local frame for the near grass and the birdhouse.
No lights or camera are saved in set.blend; the sheet adds a preview sun/sky from rick_light.json "day" + the LAYOUT sun, in memory only.

## Built (collections under SET_style_test; the outline objects are also in `Line`)
- House 10 x 8 m, butter-yellow REAL clapboard (each board a tilted strip, true shadow line), white trims with bevels, 4 double-hung
  windows (casing 9 cm proud, sill, apron, drip cap, muntins, glass set back, sheer curtains), teal louvred shutters, window box with
  flowers, teal 6-panel gloss door with brass knob/deadbolt/kick plate/knocker, evergreen wreath with berries and bow, coach lamp,
  brass "27", porch (3 concrete steps with nosings, 2 posts, shed roof, handrails), coir mat with rubber rim, 2 terracotta pots,
  shingle roof (real rows + tab seams), fascia/rake boards, K gutters with hangers, downpipe with elbows/kick-out/splash block, brick chimney.
- Garage 3.6 x 6 m, front gable with sunburst vent, 4-section door (12 raised panels + 4 windows), handle, seal, lamp, "27"; link wall to the house.
- Ground: drive slabs 3 m with saw joints (1.6 cm) and a few procedural hairline cracks, public walk + side-street walk, kerbs, two
  asphalt streets, storm drain, lawn soil with soft mowing stripes.
- Yard: hair lawn 0.97 M strands (8.5 cm, denser near the lens), 70,000 modelled near blades in the lens's ground (7-21 cm, bent,
  translucent), 3 mulch beds with scalloped edging + tree ring, Poly Haven flowers (gazania, ursinia, periwinkle) and shrubs,
  6 flagstone stepping stones, picket fence (pointed pickets, posts with caps, 2 rails), gnome, sprinkler, red birdhouse on the trunk.
- Tree: Poly Haven island_tree_02 at the LAYOUT point, 9.5 m, two instances per tree for a full crown; 13 far trees.
- Far: 6 neighbour houses in mint/pink/aqua/lilac/cream/peach (real boards on the street face, windows, door, shingle roof),
  corner street sign LINDEN ST / MAPLE AVE, hedge.

## Numbers
Triangles: 2.06 M unique; 31.9 M rendered with instances (28 tree instances x 1.07 M); 410 objects; hair 973,539 strands.
Render memory/time fine on the 4-CPU box (58 s key at 540x960 16 spp).

## Weak / open
- Tree crown reads olive and dark from the low lens; lit tops are not yet the yellow-green Rick has (light may fix part; else leaf colour).
- Drive control joints and cracks are faint at 540 px; the near drive is plain. Concrete albedo lowered once (#c8c3b9) to stop clipping.
- Not done: close-up material stills, detail_density.py beside the storyboard/Rick, the crew check file, look/<place>_MATERIALS.md,
  the 360 px phone check. No storyboard exists for this test.
- Mailbox (props) LAYOUT point lands ON the drive in the 3.4 m drive (local x .66, y -6.3): lead to move it or narrow the drive.
- Hose reel and bike points are on the right lawn; the drive-edge flower bed (local x 1.75-2.45, y -2.5..2.8) avoids them.

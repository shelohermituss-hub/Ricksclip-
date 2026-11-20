# hot-milk hook frame STATE (pitch 2 "Why Hot Milk Froze First", Tanganyika 1963) 2026-11-16
One three.js kit still (kit3d on), GPU via the fair queue. No polish, no judge, no motion delivered.

## Files
- out/hook.png (1080x1920), out/hook_small.jpg (540x960), out/frame_checks.md, out/plan/ (baked plan, held3d.json)
- film.json: 1 place `kitchen`, 5 acts, 1 station (cam [0,-2.15,1.2] aim [0.02,0.6,1.12] lens 24), 4 held3d enamel mugs
- sets/kitchen.js: red-oxide cement floor, green gloss dado + limewash wall, steel window (banana leaves, sky) with sun shaft,
  timber trusses + corrugated iron, bare bulb, blackboard "ICE CREAM DAY 1. BOIL 2. COOL 3. FREEZE" (COOL underlined), calendar JULY 1963,
  enamel plate shelf, cocoa tin, clock, wood stove + aluminium sufuria of milk, table with 6 cooling mugs + jug, bench (kid3 on it),
  THE FRIDGE (rounded cabinet, chrome, open door with racks and 3 capped milk bottles, frosted freezer box with icicles, ice trays,
  dark-blue mouth, cold glow, cold vapour, point light), TANGA TEA 1st crate the boy stands on, MAZIWA milk churn (built, see weak)
- sets/milk_props.js buildMug: white enamel, cobalt rim, chips, milk skin, handle; steam wisps on the boy's mug
- cast/sheets/milk.mjs: boy (kid form, khaki drill uniform, school badge), kid1-3 (khaki / navy V-neck pullover), master (white
  short-sleeve shirt, narrow tie, square horn-rims, pencil moustache). moves/ep_milk.mjs: boy_shove, kid_point, kid_fold, kid_hold, master_fold
- Rebuild: python ../../../../tools/film_plan.py bake film.json ; bash ../../../monopoly-escape/tools/gpu_render.sh film.json --frames 0 --scale 1 --stills-dir out/full

## Numbers (full frame)
- saturation 0.495 (day target >= 0.30), brightness 0.460, near-black 0.25 %; thirds sat 0.55 / 0.36 / 0.58
- frame_checks: 0 FAIL, 0 WARN, 25 PASS
- boy about 36 % of frame height (head top ~37 %, soles ~73 %); faces all above the lower third; plain kit poses 0 (5 episode moves)

## Weak vs rick_ref.jpg
- Boy reads big but in profile: the grin is clear, the open freezer is smaller and busier than Rick's single hero object; no light cone on him.
- Middle third is crowded (4 heads at the same height band); kid1 "pointing" arm reads as a held mug, not a point; master's folded arms
  are half hidden behind kid2; head shake is only a 4 deg tilt in a still.
- Cold blue light is a glow inside the fridge, not on the boy (face-light rule); warm window light is a soft shaft, no hard sun patch.
- The foreground milk churn sits out of frame at this lens; floor is the bottom ~25 %; caption band lands on the boy's legs.
- Steam is soft sprites (no curl shape); roof trusses use the plaster sky colour behind (no ceiling depth detail).

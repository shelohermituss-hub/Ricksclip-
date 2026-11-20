# elevator-mirror hook STATE (pitch 5 "The Mirror That Fixed a Slow Elevator", frame 0) 2026-11-16
One three.js kit still on the GPU (fair queue), kit3d pbr + relief on. No voice, motion or captions (words.json is empty on purpose).

## Files
- out/hook.png (1080x1920), out/hook_small.jpg (540x960), out/f_00000.png (raw), out/frame_checks.md, out/plan/ (baked)
- film.json: 1 place `lobby`, 4 acts (episode moves, 0 plain kit poses), 2 held3d, 1 station lens 26, cam [-0.3,-3,1.75] aim [-0.22,0.5,1.3]
- sets/lobby.js: brass cage car (posts with rings, diamond lattice sides, scroll crest, dome lamp, parquet, mahogany back wall + hand rail, hoist cables,
  folded scissor gate), THE MIRROR (bevelled glass with the chandelier + lattice reflected, gilt frame, shell crest, 4 rosettes, 3 screws home and the
  top-left one half in, pencil mark), FRAGILE MIRROR crate with straw + leaning lid, red toolbox + screw jar; floor-indicator dial (arrow on L),
  ELEVATOR plaque, sconce, damask wall + mahogany wainscot; marble checker floor, red runner + gate mat with gold border; crystal chandelier (2 rings,
  candle bulbs, drops, garlands) = the warm point light; clock at five to nine with gilt sunburst; reception desk, bell, key rack with brass tags;
  arched windows on a blue evening street; marble columns, palms, coffered gilt ceiling; brass stanchions + velvet rope; COMPLAINTS box (off frame right).
- sets/hotel_props.js: buildScrewdriver, buildBill (thick stapled ENGINEERS' ESTIMATE / NEW ELEVATOR / TOTAL $120,000 + adding-machine tape to the floor)
- cast/sheets/hotel.mjs: janitor (grey coveralls, badge-less grey service cap, bushy grey moustache), owner (fat, navy pinstripe, gold tie, watch
  chain, slick-back + pencil moustache), watchman (camel suit, fedora), lady (teal shirtwaist, Peter Pan collar, victory rolls), sailor (built, not in frame)
- moves/ep_hotel.mjs: jan_screw, own_bill, g_watch, g_cross, g_hips (frame 0 = the hold, the action plays on after it)
- measure.py (saturation / brightness). Rebuild: python ../../../../tools/film_plan.py bake film.json ; bash ../../../monopoly-escape/tools/gpu_render.sh film.json --frames 0 --scale 1 --stills-dir out

## Numbers (final frame)
- frame_checks: 0 FAIL, 0 WARN, 20 PASS. Saturation 0.714 (target >= 0.30), brightness 0.426, near-black 0 %
- janitor about 35 % of frame height (head 0.37, soles 0.72); owner about 45 %; all faces between 0.37 and 0.47 of height (above the lower third)
- camera level-ish (down 7 deg to the aim), period check 1950s in the sheet header

## Weak against rick_ref.jpg
- Two heroes compete: the owner is nearer and bigger than the janitor; Rick's hook has ONE big figure. The mirror (hero object) is only ~16 % of the
  frame width and the janitor's body covers its left third.
- The queue reads as only 2 guests (watchman's watch-tap hands are hidden behind the owner; the sailor had no free slot and is left out).
- Lower third is mostly flat red carpet; no light shaft / glow pool like Rick's (the chandelier light is even, no strong key shadow on the floor).
- The car's front-left brass post crosses the bill's tape; the COMPLAINTS box, the folded gate and the stanchion by the door fall outside the frame.

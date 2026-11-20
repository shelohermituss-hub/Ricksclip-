# hookA STATE (pitch 1 "Why The Safest Tower Had A Spear On Top", frame 0, ROUGH) 2026-11-15
One three.js kit still, GPU (RTX 2070 SUPER, shared queue). No polish, no judge, no animation.

## Files (all in episodes/_next_pitch/hookA/)
- out/hook_A.png (1080x1920), out/hook_A_small.jpg (540x960), out/f_00000.png (raw still)
- film.json (1 place tower_top, 1 act, 1 station lens 35, cam [-0.15,-3.86,1.4] aim [-0.15,0,0.85] = 8 deg down)
- sets/tower_top.js: tiled pyramid roof (barrel tile rows, hip tiles), stone finial, SPEAR (leaf tip, socket, 2 strap collars, bolts,
  2 bracket stays with bolted feet, the nail), iron wire with staples, cornice, belfry + bronze bell, town (about 400 houses, shutters),
  fields, hills, rival white tower + gold angel + cypresses, sky dome (purple cloud wall, peach horizon gap, one pale flash)
- sets/tower_props.js buildHammer (held3d, near fist) · moves/ep_tower.mjs tower_nail (episode move: wind-up hold, then strike)
- cast/sheets/tower.mjs: mason = bible body standard/standard, outfit mason1765 registered from library parts, cap = library beanie without pompom
- measure.py (saturation / brightness) · out/frame_checks.md · out/plan/ (baked plan, hands.json, held3d.json)
- Rebuild: python ../../../tools/film_plan.py bake film.json ; bash ../../moonrakers/tools_lead/gpu_render.sh film.json --frames 0 --scale 1 --stills-dir out

## Numbers (final frame)
- saturation 0.714 (target >= 0.36), mean brightness 0.412; thirds top/mid/low sat 0.54 / 0.68 / 0.92; near-black 0.28 %
- frame_checks: 0 FAIL, 0 WARN, 4 PASS (head cut, body cut, face covered, feet)
- hero about 48 % of frame height (head top 14 %, soles 62 %), face at about 28 %, caption line 71.5 % = on the roof, clear of face and tip
- spear tip at about 4-15 % of height; blade luminance 0.12-0.17 against sky 0.5-0.8; shaft 0.20 against 0.49
- far fist on the shaft: card hand measured (--hands) and the card moved so the hand is at x 0.00; hammer fist gap 0 (held3d)
- camera down-angle 8 deg (limit 10); plain kit poses 0 (one episode move)
- period check 1765: open linen collar, no stock / cravat; buttoned waistcoat; knitted cap, pompom removed; no brimmed 1800s hat

## Weak (not fixed inside the cap)
- The LAST two changes (dark blade, flash moved right off the tip) were checked by numbers only, not looked at (3 looks used).
- Bell, belfry and cornice are built but OUT OF FRAME at this hero size; "church" reads only from the rival tower. Needs a wider or lower second shot, or a cross / bell element at the peak.
- Roof fills about 40 % of the frame bottom (rule: floor at most a third).
- Piazza, fountain, tiny townsfolk and the priest stand-in are built (x 22-60, y 186-222) but hidden behind house rows from this height. No pointing priest visible.
- Legs are thin and dark; feet sit near the bracket stays, a stay crosses the shins. Side view only (no 3/4).
- Finial reads as a simple turned stone; town houses are boxes with gable roofs and shutters, no chimneys, streets or church.
- Sky is a shader (no 3D cloud volumes, no rain curtain); flash is a soft glow, no bolt.
- Outfit mason1765 and the pompom-less cap live only in this folder's sheet (registered at load), not in the library. Not compared beside a Rick frame.

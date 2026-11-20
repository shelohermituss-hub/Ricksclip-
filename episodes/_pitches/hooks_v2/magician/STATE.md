# hooks_v2 / magician STATE (pitch 1 "The Box the Strongest Man Couldn't Lift", frame 0, ROUGH) 2026-11-16
One three.js kit still (kit3d on), GPU through the fair queue. No polish, no judge. About 70 min (over the 60 min cap).

## Files
- out/hook.png (1080x1920, no captions), out/hook_small.jpg (540x960), out/f_00000.png, out/frame_checks.md
- film.json: 1 place `square`, 8 acts, 1 station (lens 28, cam [-0.5,-4.9,1.0] aim [-0.5,0,1.32], slight up tilt, level)
- sets/square.js: low stage (planks, seams, nails, posts, tricolour pleated skirt + gold fringe, steps), THE TINY BOX (walnut, lid rim, 16 iron
  corners, nails, keyhole plate, gold star, brass bail handle + mounts), banner "ROBERT-HOUDIN" (canvas paint) with tassels and a brass lantern,
  orange stall with striped awning, 6 whitewashed houses (parapets, merlons, horseshoe-arch doors with studs, window grilles, sills), laundry line,
  geraniums, square minaret with green tile band and gold finial, 4 date palms, far hills, kit clear-day clouds, foreground table + brass pot + tea glasses + jar
- cast/sheets/magic.mjs: 8 stand-ins with an 1856 period check in the header (strongman: gandoura + saffron sash + white wrapped turban + moustache;
  Robert-Houdin: tailcoat with tails, white waistcoat + white tie, stovepipe hat, clean-shaven; crowd: burnous, chechia, French officer kepi, etc.)
- moves/ep_magic.mjs: episode moves strain / wave / laughR / laughL / bellyA / bellyB / boyhop (frame 0 = key pose, motion after)
- Rebuild: python ../../../../tools/film_plan.py bake film.json ; bash ../../../monopoly-escape/tools/gpu_render.sh film.json --frames 0 --scale 1 --no-captions --stills-dir out

## Numbers
- frame_checks: 0 FAIL, 0 WARN, 40 PASS. Saturation 0.542 (target >= 0.30 by day), mean brightness 0.422.
- Strongman 2.4 m, about 40 % of frame height (head top ~30 %, feet ~72 %), face at ~38-45 % (above the lower third).
- Fists measured (--hands) at plan x -0.61, z 0.88-0.90 = on the box's bail handle.
- Box CHEATED along the camera ray: at y -0.76, z 0.695 (in front of the strongman's card plane) so it lands on the stage lip in the picture and is not hidden
  by his card; its own shadows are off, a contact patch sits on the deck. In motion from another angle this cheat shows; rebuild with the box in the card plane.

## Weak (honest, against rick_ref.jpg)
- The tiny box reads small and dark against the robe; the size joke is there but not yet LOUD (no light on it, no close framing, it sits at the robe edge).
- Robert-Houdin's waving hand does not read: the raised fist was measured at head height but is lost (likely behind the body / against the wall). Gloves not done (kit fists).
- Crowd mostly hidden: the stage and the magician cover the officer, merchant and boy; the boy sits behind the magician's legs. Laughter does not read at phone size.
- Floor about a third of the frame (big orange cobble cells), foreground table cut at the right edge, banner cut ("ROBERT-HOU...").
- Strongman is in SIDE view (3/4 near arm could not reach the handle); strain face reads, but no red face tint (only vein / marks fx) and he leans back only 13 deg.
- Houses and minaret are boxes with plaster relief; no golden rim light on the set; the sky is a pale clear-day, not a rich golden-hour sky.
- Looked at 5 pictures (one over the limit).

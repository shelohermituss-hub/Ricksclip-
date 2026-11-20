# braking-lines board STATE (pitch 2 "The Lines That Made Drivers Brake", first 5 s) 2026-11-16
Three three.js kit stills on the GPU (fair queue), kit3d pbr + relief + trees. No voice, motion clip or captions (words.json empty on purpose).

## Files
- out/p1.png, p2.png, p3.png (1080x1920, frames 0 / 69 / 114), out/board.jpg (3 x 540 px + words), out/frame_checks.md, out/plan/ (baked)
- OPENING.md: 17 words, panel times 0.0 / 2.3 / 3.8 s
- film.json: 1 place `curve` (blue hour, light tower key: spot + kit sun from the same side), 3 takes x 1 station (creep 0), 3 acts (episode moves, 0 plain kit poses), 1 held3d (roller, tip_at on the road)
- sets/lsd.js: S-curve road (ribbons along cx(y)), asphalt with tar cracks/oil stripes/patches, worn lane dashes, yellow edge line; 15 transverse STRIPES closing up toward the curve (glass-bead glow) + the wet glossy half-done newest one + blue chalk guide lines + drips; dented W-beam median rail (crumpled bay, bent post, scrapes, tyre rubber, amber reflectors) + 4 skid marks + bumper piece + glass bits; northbound lanes, limestone steps, Lake Michigan, far freighter; park lawn, oaks, sodium cobra-head lamps, Gold Coast high-rises (lit windows, red warning lights); CURVE sign + 25 MPH plaque; light tower (trailer, mast, 4 lamps, generator, pool); cone taper + 2 foreground cones; TRAFFIC WHITE pail (drips, wire handle, puddle) + paint tray; the semi (blue long-nose tractor, chrome grille/bumper/stacks/tanks, headlights + spill, 5 amber cab lights, air horns, mirrors, open driver window, LAKESIDE HAULING door, fifth wheel, mud flaps; trailer left off so the curve stays open)
- sets/lsd_props.js: buildRoller (yellow fibreglass pole, threaded collar, rubber butt cap, wire yoke, wet 18-inch cover with nap, end caps, paint runs)
- cast/sheets/lsd.mjs: painter (hard hat, orange hi-vis vest with silver bands and white paint splats, navy shirt, tool belt, stubble), trucker (fat, red plaid, denim vest, blue cap, grey mullet, horseshoe moustache). Period check 2006 in the header.
- moves/ep_lsd.mjs: pnt_roll (push stroke every 24 f), trk_mock (jabbing point every 18 f)
- Rebuild: python ../../../../tools/film_plan.py bake film.json ; bash ../../../monopoly-escape/tools/gpu_render.sh film.json --frames 0,69,114 --scale 1 --no-captions --stills-dir out ; python measure.py out (needs f_*.png)

## Numbers
- frame_checks: 0 FAIL, 2 WARN, 18 PASS. The 2 WARN = trucker 5 % "inside door_lower": he stands in the cab doorway behind the thin door, as meant.
- saturation 0.41 / 0.40 / 0.60, brightness 0.57 / 0.58 / 0.47 (night floor 0.31)
- painter in P1: about 50 % of frame height, face at about 0.3 of height; trucker small (about 10 %) left behind

## Weak against Rick
- The key light is not a hard pool: the light tower is out of frame and the road is evenly lit; no dark surround, no shaft. Needs ambient down and a visible lamp/beam.
- P1 does not show the CURVE: the stripes ladder runs into flat road and high-rises; the S-bend and the dented rail read only in P2. P3 is a boxy blue cab, the trucker's pointing arm is hidden, "LAKESIDE" is split by the door pillar.
- Not done: the hero's 3D fist sits only on the upper pole hand; no motion test of the moves (stills only).

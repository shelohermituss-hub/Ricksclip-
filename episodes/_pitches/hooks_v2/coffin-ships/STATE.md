# coffin-ships hook STATE (pitch 4 "Why Ship Owners Wanted Their Ships to Sink", frame 0) 2026-11-16
One three.js kit still (kit3d on), GPU fair queue, 1080x1920, no captions. Stand-in cast, no voice, no motion.
## Files
- out/hook.png (1080x1920), out/hook_small.jpg (540x960), out/f_00000.png raw; out/frame_checks.md; out/plan/ (baked)
- film.json (place quay, 4 acts, 1 station: cam [-0.4,-7.6,1.25] aim [2.6,3,1.5] lens 24) · words.json (stub)
- cast/sheets/coffin.mjs: owner (FAT, plum fur-collared overcoat 'owner1872', gold waistcoat + watch chain, cream cravat, stovepipe, mutton chops),
  sailor (pea jacket 'seaman1872', knit cap no pompom, full beard), deckhand (THIN, guernsey, ginger curls + short beard), docker (waistcoat, kerchief, knit cap, stubble). Outfits registered in this sheet only.
- moves/ep_coffin.mjs: owner_point, sailor_buoy, deck_panic, docker_haul (episode moves, frame 0 = hold) · sets/props.js buildLifebuoy (held3d two-hand 'box')
- sets/harbour.js: wet cobble quay (puddles, granite coping, fenders), owner's brick warehouse "GRIMSHAW & CO. SHIPOWNERS" with loading doors + hoist beam,
  "INSURED" bill on a post, iron bollards + mooring lines, rope coils, barrels, barrow, gas lamp (lit), hand-cranked wooden crane (gear wheel, drum, crank),
  the PIG IRON / 6 TONS crate in a rope sling + tag line, barque MARY ANN of HULL (teal hull, cream band at the waterline, Roman draft marks XIV under / XVI at the water,
  awash waist with cargo stacks, wet poop with a water sheet + foam + spray, wheel, binnacle, 3 masts with yards, furled sails, shrouds, ratlines, stays),
  far ships, pier + striped lighthouse, town, hills, gulls, kit3d clear-day sky recoloured to a peach-grey dawn.
- proj.py (screen position of plan points for a camera) · measure.py
- Rebuild: python ../../../../tools/film_plan.py bake film.json ; bash ../../../monopoly-escape/tools/gpu_render.sh film.json --frames 0 --scale 1 --no-captions --stills-dir out
## Numbers (final)
- saturation 0.508 (day target >= 0.30), brightness 0.366, near-black 0.05 %; thirds sat 0.41 / 0.46 / 0.66
- frame_checks: 0 FAIL, 0 WARN, 20 PASS. Owner about 45 % of frame height (hat 33 % to soles 79 %); face above the lower third.
## Weak vs rick_ref.jpg
- The "sits so low the water laps over the deck" idea reads only half: from quay height the waist is hidden; the read is the white wash on the poop and the hull band at the water. No splash over the near rail in view.
- Sailors are small (about 13 % of height) and far right; terror reads by face, not by body. The docker on the crane is hidden behind the owner.
- No single key light / light shaft like Rick's; dawn light is even. Foreground: quay coping blocks + a cut bollard and its mooring line slash the bottom right; cobbles read large and blue.
- Text in the world mostly unreadable at phone size (crate stencil faces away, warehouse sign out of frame, stern name hidden by the quay).

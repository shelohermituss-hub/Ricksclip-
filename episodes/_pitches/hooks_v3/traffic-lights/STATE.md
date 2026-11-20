# traffic-lights board STATE (pitch 1 "The Town That Tore Down Its Traffic Lights", first 5 s) 2026-11-16
Three three.js kit stills on the GPU (fair queue), kit3d pbr + relief + sky + trees. No voice (words.json empty); words + rough times in OPENING.md.
## Files
- out/board.jpg (3 x 540 px panels + words), out/p1.png p2.png p3.png (1080x1920, frames 0 / 72 / 130), out/frame_checks.md, out/plan/ (baked)
- film.json: place `crossing`, 1 take, 3 stations (f0 lens 26 low 3/4 on the worker; f62 lens 20 rise-back wide; f112 lens 36 from behind the doubters)
- sets/crossing.js: asphalt main road with RED bike lanes + painted bikes, brick-klinker side street, zebra + shark-teeth, 30 cm grey tiles, kerbs; THE HOLE
  (pit, broken tiles, rubble, cut cables), cones, red-white barrier, big spanner, cable drum; far light still standing with its head in a black bin bag + tape;
  Dutch row houses (step / neck / bell gables, brick relief, white frames, net curtains, iron wall anchors, year stones, house numbers, flower pots);
  DROGISTERIJ with green sign + striped awning + shelf window; canal with brick quays, bollards, blue sloep, bridge with white railings, lime trees; lamp posts,
  blue bike-path sign, green bin, bike racks with omafiets; moving traffic (white/teal bus "5 CENTRUM", 4 hatchbacks with NL yellow rear plates);
  ONE hard key = warm SpotLight pool on the worker (sun si 1.3 / ambient 0.85 under it).
- sets/drachten_props.js: buildTrafficLight (concrete foot torn out, cut red/blue/green cables + copper ends, banded pole, yellow WACHT/DRUK button box,
  bike signal, white-bordered backboard, visors, RED lamp lit + glow), buildBandageCrate (FRIESLAND slatted crate, bandage rolls, PLEISTERS boxes, "BANDAGES €1 / pleisters" sign)
- cast/sheets/drachten.mjs (2003 check in header): worker (orange roadWorker, yellow hard hat, blond beard), drogist (pale-blue shop coat, glasses, fat),
  oldman (cardigan, comb-over, bushy moustache), lady (teal fleece, perm), 2 cyclists. moves/ep_crossing.mjs: haul, crate, point, gasp; cyclists = library bike/A.
- Rebuild: python ../../../../tools/film_plan.py bake film.json ; bash ../../../monopoly-escape/tools/gpu_render.sh film.json --frames 0,72,130 --scale 1 --no-captions --stills-dir out
## Numbers
- frame_checks: 0 FAIL, 0 WARN, 92 PASS. Saturation p1 0.55 / p2 0.61 / p3 0.57 (>= 0.30), brightness 0.39 / 0.32 / 0.37
- worker in P1 about 50 % of frame height, face at about 0.55 of height (above the lower third). Plain kit poses 0.
## Weak (vs rick_ref.jpg)
- P1: at angle -108 the pole stands almost upright in front of him: it reads "holds a pole", not "hauls it DOWN"; needs the pole falling toward the lens/side
  with the head swinging, and a darker surround so the key pool reads like Rick's (the street is still evenly lit).
- P3: the worker and his pole are hidden behind the sign / drogist / old man; the BANDAGES sign overlaps the drogist's eye. Needs the crate lower and the
  camera shifted so the worker shows in the gap. Drogist's fist is 7 cm short of the crate (kit warning).
- P2: floor about a third (grey tiles + cable drum); the worker is small. Bike riders are 2D ink bikes (library move), not 3D.

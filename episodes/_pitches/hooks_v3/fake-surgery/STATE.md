# fake-surgery first-5-s board STATE (pitch 4, "The Surgery Where the Surgeon Did Nothing") 2026-11-16
Three three.js kit stills on the GPU (fair queue), kit3d pbr + relief on, no captions. Hand-timed words.json (no voice). One take, 3 camera stations.
## Files
- out/board.jpg (3 x 540 px panels + words), out/p1.png p2.png p3.png (1080x1920, frames 0 / 84 / 130), out/frame_checks.md, out/plan/, out/stage/ (half-size stagings)
- OPENING.md (words + panel times), film.json (place `or`, 4 acts = 2 episode moves, 3 held3d with tip_at, hand_at, 3 stations lens 26/24/24)
- sets/or_room.js: OR 3, Houston VA-style 2002: sea-green tiled walls, steel skirting, dark teal ceiling, speckled vinyl + drain; table (pad, rails,
  column, base, pedal, folded blue drapes); patient under drapes (bent RIGHT knee in iodine orange, 3 tiny cut marks, blue X stitch + tail, drape
  window with tape, blue stockinette shin with ribs, sleeping 3D head in a blue cap on a pillow); OR LAMP (hub, arm, yoke, dome, 6 bulbs, sterile
  handle) = SpotLight key with shadows + see-through cone + floor pool + dust; arthroscopy tower (CAMERA/LIGHT/PUMP units reading OFF/0.0,
  NO SIGNAL / ARTHROSCOPE: NOT CONNECTED monitor, unused coiled scope cable); IV pole with two SALINE 0.9% 3000 mL bags + tube; Mayo tray (towel,
  2 scalpels, 3 clamps, gauze, SUTURE 3-0 packs, steel bowl of water with ripple); X-ray box with a knee film; clock 7:15; OR 3 door with
  portholes and IN USE light; glass steel cabinet; kick bucket; foot switch; splash puddle.
- sets/or_props.js: buildScalpel, buildBulb (red rubber bulb, water stream + 26 drops), buildNeedleHolder (ratchet, gold jaws, curved needle, blue suture)
- cast/sheets/surgery.mjs: surgeon (FAT, green scrubs 2002, tie-back cap, pleated mask, rectangular glasses), nurse (ceil-blue scrubs,
  printed bouffant cap, mask pulled under the chin). moves/ep_surgery.mjs: sg_work (cut / splash / sew on the words), nr_stare.
- measure.py. Rebuild: python ../../../../tools/film_plan.py bake film.json ; bash ../../../monopoly-escape/tools/gpu_render.sh film.json --frames 0,84,130 --scale 1 --no-captions --stills-dir out
## Numbers (full size)
- frame_checks: 0 FAIL, 3 WARN (surgeon card grazes table pad / foot 1-4 % only on the camera flights and the P2 rest), 26 PASS
- saturation p1 0.530, p2 0.554, p3 0.556 (target >= 0.30); brightness 0.417 / 0.397 / 0.391; near-black <= 0.14 %
- held3d gaps: scalpel 0.025 m on the cut, bulb 0.115 m (nozzle aimed, water fan covers it), needle free (raised)
- surgeon about 45-55 % of frame height; faces at 0.25-0.5 of height (above the lower third)
## Weak against rick_ref.jpg
- The KNEE (the thing) is half hidden behind the surgeon's fists and blooms to an orange glow in the lamp light; it does not read as
  "a knee with three tiny holes" at phone size. Next: knee bigger, out in front of the fists, less bloom on it, cuts as bold marks.
- The pool of light falls on the floor, not on the hero: the surgeon's face sits in a soft cone wash, no hard light/shadow edge on him like Rick's miner.
- The nurse's raised hand is hidden (behind the patient's drape / head); only her stare reads. The patient's 3D head reads as a blue blob.
- The surgeon is masked: only the eyes act (P3 happy eyes read; P1 focus is weak).

# STATE: look/film (look-finisher, BLENDER FILM PIPELINE round, 2026-11-22)
## Built (one pipeline for the 5 stretches; same set .blend, light, outline, grade as the LOOK CARD)
- export_locks.sh <s..>: kit --export-lock (camera, cards per frame, motion, set glb) + --held on every frame -> <s>/out/lock/held_all.json.
- dump_nodes.sh <s> f0 f1 [base]: per-frame visibility + matrices of script-driven pieces from the kit page (render_gpu --eval dump_nodes.js) -> nodes_dump.json.
  base = villebrune_apron skips the base set; __none__ (s2-s5) also catches base parts the stretch hides or moves (table jug, chair, meal, tray swap).
- film_lock.py <s> info|keys|hats|package: set .blend + lock: camera (from_lock.camera), cards (lock2.card, emission 2^-exposure, shadow card,
  contact patch), stretch pieces from the lock glb (all roots but the base set), materials again from props/out blends by name (glb has no maps),
  glassware = transparent + fresnel gloss, held props per frame (props2 parts, grip->tip, ink fist), dump keys, motion, outline id, cast mask.
- film_fixes.py: S1 kit_paint (trunk wood + MONSIEUR MANGETOUT texture tex_s1_trunk_front.png), salt_fix (f0-72: re-posed drawings fix_s1/m_####.png from
  fix_s1_cards.mjs, card pulled 0.5 m to the lens in front of the wing, shaker at the drawn fist over the wing tip), salt_grains (falling stream f0-60);
  S4 seasons (s4_apron.js KEYS: autumn/snow/spring/dusk sky, sun, fill, exposure, lawn+leaf tint, snow skin, work lamps + pink key from f740); S5 cabin_window.
- stretches.json (place, blend, light, windows s1 0-256, s2 257-519, s3 520-638, s4 639-942, s5 943-1021, keys, grade per key), render_keys.sh, run_all.sh,
  overlay_keys.sh (kit drawn layer), finish_keys.py (finish_key grade + outline + overlay -> ../KEYS_FILM.jpg, ../keys_numbers.json), KIT_VS_BLENDER.jpg.
- runpod_kit/ (job_film.py OPTIX->CUDA, exit 3 without GPU, skips done frames; render.sh range + parallel finish), package_all.sh -> ../../runpod/<s>/.
## Numbers: keys_numbers.json (12 keys, 540x960 24 spp, CPU 17-62 s each incl. load ~10-30 s setup).
## Weak / open
- S1 LUNCH f121: the kit's red/white impact lines (POWER 1) are not in the overlay layer: missing in Blender. s1_bite / s1_cut_line (hidden at lock
  time, not in the glb) are not rebuilt (saw cut, bite in the tongs). Michel f0-72 is a static re-posed drawing (no blink) and switches front->3/4 at f66.
- Held props: direction from grip->tip only (roll free); S2 bites recoloured, sizes from the kit tips.
- S4: no falling snow flakes, no sun swing in the time-lapse (strobe only). S3 x-ray world graded with sat floor (.60 vs .75 target).
- Overlay for the film must be rendered at --scale 1 per stretch and laid over the finals (render.sh does not do it yet).
- Kit draft frames on disk (s*/frames) are stale: compare against fresh render_gpu stills.
## Packages (2026-11-22): runpod/s1..s5 (1.2 GB: scene.blend + seq/ drawings + job_film.py, render.sh, finish tools). Packing test: 1 key frame
per package, CPU PCT 10 SPP 8, final written; s4 f850 at PCT 25 looked at (dusk, cards, props OK). Sequence paths fixed (fix_seq_paths.py).
Estimate runpod/estimate.json: 1022 frames, 18-90 s/frame on a 4090 (not measured), 7-14 h. Measure 3 frames on the pod first.

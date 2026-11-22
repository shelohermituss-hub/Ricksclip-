# unity_kit

The Unity kit (main engine since 2026-11-22, see `../UNITY_KIT_PLAN.md`).
- `tools/export_puppet.mjs <who>`: a cast member as Unity puppet parts -> `data/cast/<who>/` (env `OUT_DIR`, `FACES`). Reads the astro-flush cast sheet today: change `CAST` to the new film's cast folder.
- `tools/page_dump.js`: runs inside the three.js kit page (`render_gpu.mjs --eval`) and dumps a shot frame by frame (camera, moving nodes, cards, lights): the way to move a kit shot into Unity (used for `../unity_test`).
- `Packages/com.ricksclips.kit/`: to be written on the PC (step 1 of the plan).

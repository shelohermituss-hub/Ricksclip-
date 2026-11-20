# Motion gate (V1.2.1)

`check_motion_ep.mjs` plays every move of a film frame by frame and counts what makes motion look stiff:
twos 0, linear 0, no_settle 0, creep 0, contact 0 px (CB_RULES section 5 and the motion rule in section 11).

How to use it in your film:
1. Copy `check_motion_ep.mjs` into `episodes/<your-film>/moves/tools/` (for a film built in stretches: `episodes/<your-film>/<stretch>/moves/tools/`).
2. Set your two file names, at the top of the script or as variables:
   - `GATE_SHEET`: your cast sheet in `cast/sheets/` (for example `myfilm.mjs`)
   - `GATE_MOVES`: your moves file in `moves/` (for example `ep_s1.mjs`). It must export `default.styles` and `PLAN`, like the example.
3. From the film (or stretch) folder run `node moves/tools/check_motion_ep.mjs`. It prints a table and writes `moves/out/check_motion.json`.

Worked example: `episodes/fake-surgery/s4/` (`moves/ep_s4.mjs`, cast sheet `episodes/fake-surgery/cast/sheets/surgery.mjs`).
The curves the moves use (snap, tr, dip, ring) are in `templates/pieces/motion_core.mjs`.

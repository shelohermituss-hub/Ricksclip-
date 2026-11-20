# Ricks Clips Animation Skill: V1.2.1 patch

Fixes missing files and dead paths found by members (thank you, Dan and Krushank).

## How to install
1. Unzip this patch INTO your V1.2 folder (the folder with CB_RULES.md in it).
2. When Windows asks, choose "Replace the files in the destination".
3. Run `python tools/install.py` again, so the helpers get the new rule files.
Your own films in `episodes/` are not touched.

## What it fixes
- `rules/dept/` was missing: every helper's short rule file (writer, animator, camera director and 16 more). Generated from V1.2's own CB_RULES.md with `tools/slice_rules.py`.
- The motion gate: `tools/motion_gate/check_motion_ep.mjs` with a README. It finds your cast sheet and moves file instead of only the example's.
- Dead paths in `CB_RULES.md`, `SKILL.md`, `agents/animator.md` and `cloud_rules/motion/STUDIO_MOTION.md`:
  - `episodes/moonrakers/moves/tools/check_motion_ep.mjs` is now `tools/motion_gate/check_motion_ep.mjs`
  - `templates/motion_styles/studio.mjs` is now `templates/pieces/motion_core.mjs`
  - `templates/motion_styles/check_motion.mjs` is now `tools/motion_gate/check_motion_ep.mjs`
- The fake-surgery example's S4 motion gate runs as-is.

Still to know: paths to `episodes/<other films>/...` inside the rule book are history notes from CB's own films. They are not needed to make a film.

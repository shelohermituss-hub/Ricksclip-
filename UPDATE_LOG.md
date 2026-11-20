# Update log

## V1.2.1 (2026-11-18)
- Added the missing `rules/dept/` rule slices for every helper.
- Added the motion gate `tools/motion_gate/check_motion_ep.mjs` and fixed its dead paths in CB_RULES.md, SKILL.md, agents/animator.md and STUDIO_MOTION.md.

## V1.2 (2026-11-17)
- NEW `START_FILM_PROMPT.md`: one universal starter prompt for every film (beats as exact words = what we see, cast, sets, light, stillness, signature shot, sound, tier).
- NEW sound kit (`templates/sound_kit/`, `SOUND_AND_MUSIC.md`): index your own SFX and music folders, search them, start the cue list from the plan, mix voice + one music theme + SFX + ambience + power hits, master and measure (loudness, true peak, voice on top, loop).
- NEW token saving (`TOKEN_SAVING.md`): quality tiers Standard / Premium / Ultra with budgets per finished minute; the lean way per stretch (one builder, camera locked before render, one small helper at most, time box).
- NEW STEP 0 skill check and the five pre-build checks (reference pack, prop list OK, look card OK, hook test first, checks after every scene).
- NEW `creative-director` agent and CB_RULES section 12 (one acted gag per beat, one signature shot, a colour world per film).
- NEW camera move library M00-M26 by story job, the 12 camera-director points, the camera DON'Ts, camera v2 on every new film (CB_RULES 11h, 11a 2b; `references/camera_moves/`).
- NEW camera-safe characters as the default for new films (`"camsafe": true`, `tools/camsafe/validate.mjs`).
- NEW look rules: one action on a named word, one stillness, hero signature colour, visible light sources, depth in every shot, named prop lists with wear, rich coloured dark, no vignette except flashback or dream, the measured detail gate (11i).
- NEW power moments, extreme gags, POV and impossible views (CB_RULES 11e-11g).
- NEW second example film: "The Surgery That Did Nothing" (episodes/fake-surgery).
- NEW `tools/install.py` for a fresh PC (skill, 17 agents, rule slices, PC check).
- CHANGED SKILL.md is a lean how-to; CB_RULES.md v2 with contradictions merged; character template v13 (curved arms, sit poses).
- PARKED Blender passes (rules/parked/BLENDER_PARKED.md).
- NEW body and scale checks inside the frame checks (characters in vehicles are no longer skipped); `tools/run_stretch.sh` runs one stretch cycle in one command.
- COMING IN 1.2.x: the full-body pose rig switched on in the film renderer (the solver and its check already ship).

## V1.1
- The full skill: rules, 16 helper agents, the three.js film kit, character and motion libraries, voice, captions, sound mix and colour grade.
- The look kit: real metal that reflects the sky, textured stone, tiles and mud at real size, painted storm skies, detailed trees, real lightning.
- The worked example "Why The Safest Tower Had A Spear On Top" with its script, picture plan, briefs, sets and code.
- The lean pipeline and rule slices: about 86 % less reading at every start.

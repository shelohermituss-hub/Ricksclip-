# HANDOFF

## CURRENT STATE (read this section only; Claude updates it at the end of every film)
- KIT: Ricks Clips Animation Skill V1.2.1 (patch applied), cloud edition: skill and agents live in this repo's `.claude/` (read `CLAUDE.md`). Tested in the cloud 2026-11-20: install check, plan check, storyboard, full-size frames and animatic of `templates/film_example` all run.
- RULES: CB_RULES.md (the one rule book), SKILL.md (the lean how-to). STEP 0 before every film: read CB_RULES + SKILL.md + this section, run `python tools/refresh_installed_skill.py`, say "Skill checked, up to date".
- SOUND: library folders set in `templates/sound_kit/sound_config.json`: `sound_pack/sfx`, `sound_pack/music` (free Sound Pack V1.2, 625 files). Index built by `tools/cloud_setup.sh`.
- VOICE: Fish Audio through `tools/fish_tts.py` (key added by the cloud proxy); voice name: "rick" (bf223ba8059343d6b32bc1cbe0b4a586).
- NEXT FILM (user 2026-11-22): start in a NEW session ON THIS BRANCH (claude/film-prompt-startup-uubljz; the default branch lacks 214 commits: the Rick recipe, the library, the lessons). First read REGLES_METHODE.md, then CB_RULES section 3: THE RICK RECIPE, THE ASSET LIBRARY, THE FOUR FAULTS OF THE PLANE-EATER FILM (collisions, character scale, fluid motion like a video game, light and shadow play), and LECONS_TECHNIQUES 2026-11-22. Build the collision check and the per-object fluidity check before the first draft.
- 2026-11-22 plane-eater (episodes/plane-eater/, 34 s, Ultra): rendered once in Blender on RunPod (plane_eater_blender_v1_NOT_FINAL.mp4); NOT final (kit-coded objects lost: dessert tower, mattress); the user STOPPED the corrections: lessons only (LECONS_TECHNIQUES 2026-11-22, REGLES_METHODE 2). Do not resume without the user asking.
- LOOK: the private look-match exercise is FINISHED (2026-11-21, CB: « J'ai ce que je voulais »). Its result is CB_RULES section 3 "THE RICK RECIPE". NEXT: resume the fire-truck film with that look (rebuild LOOK_BIBLE and LOOK_CARD to the recipe, then the Blender key frames).
- FILMS IN WORK: PUT ASIDE AGAIN 2026-11-21 by the user (« on va mettre de côté cette vidéo »), after the Rick-recipe previews of key frames A2/B2 (cine/RECIPE_KEYS.jpg). Open points when it resumes: station clapboard is a photo wood texture (make it clean, simple, saturated), red cab near clipping, front rim tinted by the lemon bounce, little sky in A; B: the user to decide whether the lamp room keeps the kit's deep black instead of the INTERIOR target; packages runpod/A2, runpod/B2 ready (GPU time not measured). Film: "Why Fire Trucks Turned Yellow" (episodes/yellow-fire-trucks/), Ultra, Guided mode. Script and voice approved (63.25 s). Picture plan, creative, look bible written. 2026-11-20: Blender back with ready-made assets (CB_RULES section 3), final render on RunPod.
- OPEN QUESTIONS: none.
- PRIVATE EXERCISE 2026-11-21 (user): reproduce Rick's scene "He Crashed His Own Car For Science" 13-25 s with our pipeline and cast, to learn his render, camera and timing. Folder references/look_match/car_science/ (git-ignored, never published, never in a film). Findings so far: references/reports/rick_grade_2026-11-21/ (grade numbers), the pink-cell calibration (clean flat pastel materials, built objects with bevels and bolts, thin dark outline on objects not walls, soft enveloping light, low contrast).

## How Claude writes a film section here (newest first)
```
## <FILM TITLE> (episodes/<name>/): <phase>, <date>
- Final: <path>, <length>, <loudness>.
- Tier: <Standard/Premium/Ultra>; tokens <used> / <budget> (python tools/token_report.py <session>).
- Known weak: <list>.
- Lessons for the next film: <one line each>.
```

Everything below is the HISTORY LOG of each film, newest first. Read a section only when the current work needs that film.

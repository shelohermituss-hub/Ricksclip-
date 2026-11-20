# HANDOFF

## CURRENT STATE (read this section only; Claude updates it at the end of every film)
- KIT: Ricks Clips Animation Skill V1.2.1 (patch applied), cloud edition: skill and agents live in this repo's `.claude/` (read `CLAUDE.md`). Tested in the cloud 2026-11-20: install check, plan check, storyboard, full-size frames and animatic of `templates/film_example` all run.
- RULES: CB_RULES.md (the one rule book), SKILL.md (the lean how-to). STEP 0 before every film: read CB_RULES + SKILL.md + this section, run `python tools/refresh_installed_skill.py`, say "Skill checked, up to date".
- SOUND: library folders set in `templates/sound_kit/sound_config.json`: `sound_pack/sfx`, `sound_pack/music` (free Sound Pack V1.2, 625 files). Index built by `tools/cloud_setup.sh`.
- VOICE: Fish Audio through `tools/fish_tts.py` (key added by the cloud proxy); voice name: "rick" (bf223ba8059343d6b32bc1cbe0b4a586).
- FILMS IN WORK: "Why Fire Trucks Turned Yellow" (episodes/yellow-fire-trucks/), Ultra, Guided mode. Script and voice approved (63.25 s). Picture plan, creative, look bible written. 2026-11-20: Blender back with ready-made assets (CB_RULES section 3), final render on RunPod.
- OPEN QUESTIONS: none.

## How Claude writes a film section here (newest first)
```
## <FILM TITLE> (episodes/<name>/): <phase>, <date>
- Final: <path>, <length>, <loudness>.
- Tier: <Standard/Premium/Ultra>; tokens <used> / <budget> (python tools/token_report.py <session>).
- Known weak: <list>.
- Lessons for the next film: <one line each>.
```

Everything below is the HISTORY LOG of each film, newest first. Read a section only when the current work needs that film.

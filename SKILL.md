---
name: cartoon-3d-short
description: The main skill for all Ricks Clips animation (CB 2026-11-09). Makes a ~60-75 s vertical cartoon story Short: flat 2D vector puppet characters with ink, drawn in code, acting in a detailed 3D three.js world (kit3d look), one flowing camera, voice narration, sound, word captions, rendered on the PC's graphics card. Use for any Ricks Clips style video, any story, place or time of day; also when the user asks for "another video like these", "the cartoon short skill", or a history, science or tale short with cartoon characters in 3D.
---

# Ricks Clips animation: the main skill (lean version, 2026-11-16)

**READ [CB_RULES.md](CB_RULES.md) FIRST, EVERY TIME (CB 2026-11-11: "make that is rules. at one place and every new generation need to follow").** It is the one list of CB's rules. The LEAD reads all of it once per session; a HELPER reads only its slice `rules/dept/<department>.md` (CB_RULES 11b T1). If anything here differs from CB_RULES.md, CB_RULES.md wins and this file gets fixed. A new rule from CB is added there first. Copy for cloud sessions: project files `rules/CB_RULES.md`.

**This file is the HOW-TO:** the order of work with its commands, the crew, the tools, the kit keys. It holds no rule text of its own any more. Until 2026-11-16 it repeated most of CB_RULES.md ("same text as CB_RULES ...") next to older workflows that later rules had replaced (1.2x voice pace, trimmed silence, Blender Stage A/B, judge 8.5 before CB, "the camera never stops"). The lead read both books, about 90,000 tokens, and could follow a dead line. The full old file is kept word for word in `references/archive/SKILL_before_2026-11-16.md`: history, never followed; open it only to look up how an old tool was used.

Then read `HANDOFF.md` section CURRENT STATE (the films in work, open tool gaps). Updating this file: after any change to SKILL.md or `agents/`, run `python tools/refresh_installed_skill.py` (it also regenerates the rule slices and installs the agents).

## WORKING RULES (CB 2026-11-09, from Anthropic's prompting guide for the newest Claude models). They say HOW to work; THE ORDER OF WORK says WHAT to do.

### Finish the whole job
Do not stop while work CB asked for is still owed. A status note is welcome; an offer to wait is not: start the next part. An error, a timeout, a locked file, an empty result or a failing tool is an ordinary obstacle. Find the cause first, then work through it (wait and retry, fix the call, use another tool or source). Stop only when the work cannot move without CB (a gate below, or a real choice about the story or the look), or when a blocker is deliberate (a locked file, access that was withheld). Then say plainly what you found, and keep going on every part that does not depend on the answer.

### Steps that need NO OK from CB (do them, then say what you did)
- Retry a failed or crashed render, export or tool call. Re-run any check or gate.
- Regenerate ONE failing voice line with the same voice (a normal Fish Audio call).
- Re-make a board panel, a still or a preview. Fix a set, a prop, a material or a light until its check passes.
- Use an asset the BlenderKit account already has (Royalty Free or CC0).
- Write new files in `episodes/<name>/`, `out/` and `library/`. Fix a bug in `tools/` or `templates/` (not in the locked parts named below).
- Copy backups to OneDrive. Run `tools/refresh_installed_skill.py` after a SKILL.md or agent change.
- Start the helpers THE ORDER OF WORK names for a step. Delete a film's frame folders, old versions and logs once its final is approved (CB_RULES 11a ONE FOLDER PER FILM).

### Steps that ALWAYS need CB's OK first
- The gates: the story pick, the quality tier, the script and voice, the PROP LIST and the LOOK CARD (quick OKs in the chat, not polish rounds; CB_RULES 11a step 1b), THE ONE GATE (picture plan + CREATIVE.md + rough board + moving hook), each version CB reviews, the final.
- Delete or move anything outside the film's own folder (no version control here; episode files were lost once, 2026-11-06).
- Change a LOCKED part: the vector puppet package `templates/vector2d_characters/`, the cast, the faces, the views, the locked voice. Reason: CB approved each one by eye.
- Change a rule in CB_RULES.md, SKILL.md, WORKFLOW.md or the agents. Back the file up first (<your backup folder>).
- Spend beyond normal use: a whole new voice take, any RunPod or other online render, any new paid service or asset. Going past the tier's token cap.
- Publish or send anything outside the project.
Once CB gives the OK for a step, that OK covers the whole step; do not ask again.

### When to split work across helpers
Only where THE ORDER OF WORK names helpers: the creative-director once per film, one stretch builder per stretch, the camera-director per stretch, the small-model helpers for mechanical work (CB_RULES 11b T6). One session does the rest: a quick check, one file, one fix, anything under about ten minutes. Every helper starts with no context and costs tokens, so brief it with the goal, its slice, the files to read, the check it must pass and what is locked (template: `agents/STRETCH_BUILDER_BRIEF.txt`). The lead keeps film.json, LOOK_BIBLE.md and the look.

### This pipeline code is ours
The tools, templates and agents are ours to restructure: merge repeated code instead of adding another copy, fix a nearby bug when you see it. This does NOT cover the locked parts or Rick's reference material, and never means changing the look or the behaviour of a finished step without CB.

### Reports to CB
CB reads short, plain messages and has not seen the work. Lead with the result or the decision needed. Plain words, full sentences, one idea per sentence, the same word for the same thing. No names invented during the work. Give the link or file, what was checked, what is still open. Leave out the steps unless CB asks.

### How rules are written
Every "never" and "always" has a scope and, where it is not obvious, a reason. When a rule's reason is gone, the rule is removed (back up first) or parked with its reason, never left to pile up next to the rule that replaced it.

### Cloud and PC (Wrong Helmet, 2026-11-11)
- The PC session refuses scripts that arrive from the cloud ("Code from External"), and a chat approval does not lift it. Never ask CB to fix it at the PC. Run only scripts that are already on the PC; send the PC results as plain picture and data files.
- A thread links the PC in its first turn (CB_RULES section 9). Only the finished film is saved on the PC (and copied to OneDrive); everything CB has to see or decide is shown in the chat.

## THE ORDER OF WORK (CB_RULES section 11, the lean pipeline of 2026-11-15; the creative step and the five pre-build checks of 2026-11-16, CB_RULES 11a step 1b)
LEAN DEFAULT FROM THE NEXT FILM (CB 2026-11-17, CB_RULES 11a step 0): per stretch the order is (1) the builder's slice of the rules (11b T1), (2) the kit reuse list (five story details per reused object, Hard Rule No. 2), (3) board + build-out + camera plan by ONE builder, (4) `python tools/film_plan.py check film.json --window a-b` 0 FAIL, (5) one command per cycle `bash tools/run_stretch.sh film.json a-b`, (6) self-review numbers (frame checks, scale/body rows, 11i, cam_track p90 <= 22), (7) CB. In the table below this means: steps 8, 9 and 10 for one stretch are the same builder in one session, inside its time box (11b T9b); department agents are called only when the stretch needs NEW kit.
| # | Step | Who | Check before the next step |
|---|---|---|---|
| 0 | SKILL CHECK before every new film (CB_RULES section 0, STEP 0): read CB_RULES.md in full, SKILL.md, HANDOFF CURRENT STATE from the PC master; run `python tools/refresh_installed_skill.py`; check `rules/dept/INDEX.md` is current | lead | exit 0; tell CB in one line "Skill checked ... up to date" before any work. Rick's quality is the target, the token budget a guide (CB_RULES Rule No. 1) |
| 1 | Pitch and facts: 3 stories from `episodes/_pitches/` style idea lists, each with hook act, mocker, twist, title (CB_RULES 11e) | lead + `writer` | CB picks the story AND the quality tier (11a2) |
| 2 | REFERENCE PACK first: 5-10 Rick frames per beat picked from `references/` -> `refs/REF_PACK.md` + one small sheet per beat (check 1). Then the script (Rick pattern, opens on action, 195-210 words) | `rick-researcher`, `writer` | every beat has its frames; `tools/measure/script_stats.py`; CB approves |
| 3 | Voice (Energetic Storyteller, pace 1.0, a 2-3 word energy tag on every clause, quotes in a clearly different tone), `tools/voice_breathe.py` for pauses (never trim), faster-whisper to `voice/words.json` | `writer` + lead | CB approves the take |
| 4 | CAST_PERSONALITY.md and the first character locked (bible, presets, IDs) | `writer`, `character-artist` | check_views PASS |
| 5 | CREATIVE.md: one acted gag per beat, the signature shot, the colour world, up to 5 more ideas (CB_RULES 12) | `creative-director` (once) | the lead reads it against the guard (12e) |
| 6 | PICTURE_PLAN.md (`templates/PICTURE_PLAN.md`): every named thing on its word, CLOSE / IN SCENE and why, story-job tag, acted gag, signature row, extreme gags, power moments, POV and impossible views | `writer` + lead | every row has a reason from THIS story |
| 6b | HERO OBJECT MODEL (three views, in the fist, beside a Rick frame) + `PROPS.md`: every prop, size, era, holder, FIVE specific details each (check 2) | `props-hero` + lead | CB's quick OK in the chat; no set or prop built before it |
| 7 | LOOK_BIBLE.md (colour world from CREATIVE.md, 11c numbers, light per place), then the one-page LOOK CARD beside Rick frames of the same light (check 3, CB's quick OK in the chat), then the shared look pack `sets/look_pack.js` beside a frame of the best approved film | lead, one set helper | look pack proven beside the best film |
| 8 | Camera plan per stretch from the built sets (CAMERA_NOTE.md, move library M00-M26 by story job, camera v2) | `camera-director` | `python tools/film_plan.py check` 0 FAIL; WARNs with the scene's reason |
| 8b | HOOK TEST: frame 0 + the first 10-15 s AT FULL DETAIL (look pack, dressing, light, acted gag, voice, captions) before anything else is built (check 4) | hook stretch builder | side-by-side with the reference pack: weaker than Rick = STOP and fix the method; passed = clip to CB in the chat, other stretches start |
| 9 | THE ONE GATE: every other stretch rough (2-3 real key frames per line, 60-90 min cap per builder) + the hook from 8b | one stretch builder per stretch (`agents/STRETCH_BUILDER_BRIEF.txt`) | AFTER EVERY SCENE: frame checks + camsafe 0 FAIL + Rick side-by-side sheet (check 5); the lead's cam_track beside a Rick clip; CB says yes |
| 10 | Build out and polish the stretches in parallel from ONE shared sets folder; the approved board is the floor | fresh builder per round (11b T2); lean default: the same stretch builder while its time box lasts (11a step 0) | after EVERY scene: frame checks, camsafe, Rick side-by-side (check 5); motion gate, 2 fps self-review beside Rick |
| 10b | LOOK BY TIER on the moving takes (CB_RULES 11a2, rebuilt 2026-11-17). Standard: look-pack light + the grade. Premium: a light and atmosphere pass per place (warm key against cool fill, haze in depth, bloom on lamps and windows, no vignette except flashback or dream, depth of field), a colour pass per place, and every shot at the 11i detail floor (edge density median 0.14, none under 0.08; Rick's clips 0.10-0.18). Ultra: the same per shot, close shots at about 0.18, real-part props within 3 m of the lens. No Blender. | `lighting-director` (moving takes only), stretch builders | side-by-side with the armor film and Rick frames of the same light; edge density measured |
| 11 | CB's notes in batches: one fix round per version (2 / 3 / 4 rounds by tier) | lead, fresh builders | token_report "used / budget" in STATE.md |
| 12 | Sound (CB's sample library first), then the grade (last picture step), captions, delivery with YOUTUBE.md | `sound-designer`, `editor-compositor`, `studio-director` PASS | 16-frame check, loudness about -16 LUFS, the final decodes |
TAKEN OUT FOR NOW (CB 2026-11-16, until CB asks by name): light rounds and effects rounds on still boards, and every Blender pass. Their rules are parked in `rules/parked/BLENDER_PARKED.md`; `look-finisher` and `3d-designer` are not called. Department rounds on still pictures and judge loops are gone for good (a judge runs at most once per version, after the gate, as the tier says).

## THE CREW (agents in `agents/`, installed to `~/.claude/agents/` by the refresh tool). Each reads ITS SLICE `rules/dept/<name>.md` first, never the whole book.
LEAN DEFAULT (2026-11-17, CB_RULES 11a step 0 and 11b T6): ONE stretch builder per stretch does board, build-out and camera; no helper by default, at most one small-model helper for render and measure only, each with a time box. The department agents below are called only for NEW kit (a new set, person, prop, move, or a camera idea not in the 11h move library).
| Agent | Step | Owns (CB_RULES) |
|---|---|---|
| `writer` | 1-4, 6 | 1, 2, 11e, 11g, picture plan with the lead, CAST_PERSONALITY |
| `creative-director` | 5 | 12: acted gags, signature shot, colour world, fresh ideas (proposes, never builds) |
| `rick-researcher` | 2 (the reference pack, picked from `references/`), and on a new question only (11b T8) | 6b, 11e; Rick frames per beat from `references/` |
| `character-artist` | 4, on request | 4, presets and IDs, check_views |
| `camera-director` | 8 | 6, 6b, 11a 2b, 11d2, 11f, 11h |
| stretch builder (general helper with the brief) | 9-11 | 2, 6, 10, 11c-11h in its stretch |
| `animator` | inside a stretch when a move is missing | 5, STUDIO_MOTION, 12a acting sequences |
| `set-builder`, `background-painter`, `props-hero` | 6b (props-hero: hero model + PROPS.md), 7, or a new set or hero object | 3, 11c |
| `lighting-director` | 7 (writes the light targets only) | 3 light, 11c |
| `vfx-artist` | only for one named effect no piece covers | 6, 11f, 11g |
| `sound-designer` | 12 | music theme, SFX on every action, mix |
| `editor-compositor` | 12 | joins, captions, grade, loop |
| `storyboard-judge` | as the tier says | scores on the moving clip |
| `studio-director` | before CB sees a version | Rule 1, Rule 2, section 7 |
| `3d-designer`, `look-finisher` | PARKED with Blender | rules/parked/BLENDER_PARKED.md |

## TOOLS AND COMMANDS (run from the skill root)
- **film.json** (`episodes/<name>/<stretch>/film.json`): everything timed, anchored to words (`["deck", 2, -4]` = 4 frames before the second "deck"): `cast`, `places`, `props`, `takes` with camera `stations`, `acts` (pose, face, look, prop in hand, quotes), `sentences`, `fx`, `moods`, `sound`. Every new film.json starts with `"camera": {"v2": true}`, `"camsafe": true`, `"kit3d": true`, `"tween": {"ones": true, "face_frames": 0}`, `card_shade` amount 0 and rim_amount 0, `costume_shade` with `keep_drawn_light: true` and `smooth: 40`. Worked example: `templates/film_example/film.json`.
- **Plan check:** `python tools/film_plan.py check <film.json>` bakes `out/plan/` (camera, performance, sound events) and runs the plan gates (camera bands as WARN, station teleports and unplanned whips FAIL, "camera goes around a figure but its view never changes", places and light shares). 0 FAIL before any render.
- **Render (three.js kit, `templates/threejs_film/`):** `node render.mjs film.json --storyboard | --animatic --scale 1 | --frames 0,45 | --stills-dir <dir>`; on the PC's graphics card `render_gpu.mjs` (one process, two only when the card is free; never mix GPU and software frames in one stretch; guard `pow`, `sqrt` and divisions in set shaders). Pattern for a stretch cycle: `episodes/armor-no-holes/stretches/armor-pins-test/render_final.sh`.
- **Frame checks:** `node tools/frame_checks/check.mjs <film.json>`: head or body cut by the edge, set geometry in front of a face, feet floating or sunk, seat, overlap, foot slide, prop in hand; exits 1 on FAIL. **Camera-safe:** `node tools/camsafe/validate.mjs <film.json>` (README there). **Views:** `node tools/check_views.mjs` must PASS after any change to char2d, castkit, cast, memes, bodies, puppets or poses. **Camera beside Rick:** `python tools/measure/cam_track.py`. **Rendered film:** `python tools/check_film.py <video.mp4> --film <film.json>`. **Motion gate:** `tools/motion_gate/check_motion_ep.mjs` (copied into the film's moves/tools/; tools/motion_gate/README.md): 0 twos, 0 linear, 0 no-settle, 0 creep, contact 0 px, plain kit poses 0, frozen moves 0.
- **Pieces (technique, never content):** `templates/pieces/INDEX.md` (17 pieces + power effects in `fx/power/`); after an edit `node templates/pieces/prove.mjs` and `prove_fx.mjs` print PASS. A plan row names the piece AND what changes for this story.
- **Camera moves:** `references/camera_moves/RICK_CAMERA_MOVES_LIBRARY.md` + `camera_moves_template.json` (project files; 27 moves by story job). Station keys: `travel` (seconds), `via` (bend), `travel_roll`, `follow` (characters only for now), `drift`, `creep`, `kicks` (7-frame impacts), `hold: 0` (pass without stopping), `whip: true` (capped 9 frames), `loop: true` (ends on frame 0). Lens: `lens` 24 mm on a 36 mm tall frame = 73 degrees tall (Rick). Character height, at most 10 degrees down when a face is in frame.
- **Tokens:** `python tools/token_report.py <session> [--until <time>]` at the gate, after every round and at delivery. `python tools/slice_rules.py` regenerates the slices (the refresh tool runs it).
- **Voice:** `tools/fish_tts.py`, `tools/voice_prep.py`, `tools/voice_breathe.py` (pauses kept; never tighten.py). Captions: kit default style (Arial Bold white, thin black outline, lowercase as spoken, 1-2 words, 3.9 % of frame height, baseline 71.5 %).
- **Sound and music:** CB's samples `<your SFX folder, set in templates/sound_kit/sound_config.json>` and `<your music folder, set in templates/sound_kit/sound_config.json>`, searched through `templates/sound_kit/` (index_library.py, find_sound.py, mix.py; see SOUND_AND_MUSIC.md) before any synthetic sound.
- **Delivery:** the final video, `YOUTUBE.md` (moonrakers format: 5 titles, description with fact vs fable note and the Skool link placeholder, hashtags, tags, pinned comment, Skool post), a copy to OneDrive, then delete frame folders, old versions and logs.

## CHARACTERS (the locked vector puppets; rules in CB_RULES section 4)
- Package `templates/vector2d_characters/` (locked; built in the "characters" threads, this skill uses it and does not edit it): `char2d.mjs` (`drawCharacter(S)`, faces and FACES acting presets, 10 lip-sync mouths, blinks), `castkit.mjs`, `bible_sizes.mjs` (`bibleCast(n)`, `bibleChar(name)`; sizes thin, standard, fat), `hair_lib.mjs` (`withHair`), `head_gear.mjs` (`withGear`), `head_wear.mjs` (`wear`), `face_gear.mjs` (`withFace`), `outfit_lib.mjs` + `outfits_100..500.mjs` (`dress(S, key, {a, b, c})`; `node code/of_check.mjs` after changes), `long_cloth.mjs`, `grips.mjs`. Character IDs and presets: `code/char_id/` (CHAR_0xx). View rules: `VIEW_RULES.md`; approved sheets `views_golden/APPROVED_character_views_v10.png` and `APPROVED_body_sizes_v10.png` (six views).
- In film.json `cast` names a puppet (`"cast:<name>"`, `"form:<body form>"`, or an ID); `templates/threejs_film/puppets.mjs` draws one state per frame, `poses.mjs` solves the arms from hand targets. Every act gives a `look` (cast name, world point or `"cam"`; `look_full` for the true angle); `film_plan.py` apply_looks picks the view. Never set a view by hand where the camera goes around a character; never squash a card.
- Moves: every act is an episode move `m:<file>/<style>` drawn new on every frame, or a library move `m:<id>` from `templates/motion_styles/` (`pick({ action, feeling, energy, view, persona, avoid })`, `actionFromText(line)`). `@0.4` starts 0.4 s in; `@=` freezes (never in a film). A 3D held prop follows the hand: `held3d` / `hand_at`, `window.moveHand(who, frame, hand)`. Lying: act key `lie_yaw`, `lie_cam.mjs`. Floor sit with 3D legs: `m:sit_floor/A`. The newest motion method lives in the newest film's `moves/` and `cloud_rules/motion/STUDIO_MOTION.md`; name it in the animator's first brief.
- Arms are one slight curve with a round black fist; set-drawn arms use `episodes/monopoly-escape/sets/soft_arm.js`. Faces: only the template's drawn shade (CB_RULES FACES).

## THE WORLD (rules in CB_RULES sections 3 and 11c)
- Look: kit3d (`templates/threejs_film/look3d.mjs`, `PBR_FEATURES.md`): PBR metal, gold and glass with the scene sky as environment map, normal or bump maps on stone, wood, brick and bark, lit layered cloud skies per light kind, real trees. Start colours from `episodes/armor-no-holes/colour_pass/COLOUR_PASS.md` and the film's colour world (CB_RULES 12c); the grade from `episodes/armor-no-holes/grade_final/`.
- Sets live in ONE shared folder `episodes/<name>/sets/`; a set change is switched on by a film.json key and listed in `SET_CHANGES.md`. `sets/<place>_STORY.md` before a set is built; `PROP_STATES.md` for key props.
- Reference frames: `references/video/<title>/` and `references/frames/` (PRIVATE: never in a published page or our videos). The approved targets: `references/look_locked/`.

## WHERE THE REST IS
- CB_RULES.md: every rule. `rules/dept/`: generated slices (never edit). `rules/parked/BLENDER_PARKED.md`: the Blender rules while Blender is out. `rules/CB_WORDING_ARCHIVE.md`: CB's pasted rule texts word for word.
- `CINEMATOGRAPHY.md`: action shots and the camera v2 test. `WORKFLOW.md` and `DENSITY_RULES.md`: older plain-words guides; CB_RULES wins.
- `HANDOFF.md`: CURRENT STATE at the top; older film logs below it are history. `FILE_GUIDE.md`: what to keep or delete. `memory/`: the project notes (copy each new note there too).
- `references/archive/SKILL_before_2026-11-16.md`: the old full SKILL.md (history). `references/skill_legacy/SKILL_legacy_2026-11-09.md`: the older bridge pipeline (history).

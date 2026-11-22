# Ricks Clips Animation Skill V1.2.1, cloud edition

> 2026-11-22: CB made **Unity the main engine** and moved the work to a Claude session on his PC. Read `UNITY_KIT_PLAN.md` first; the cloud notes below hold for cloud sessions only.

This repo IS the skill folder ("the skill root", "the PC master" in the rule books). It was made for a Windows PC and was
reorganised on 2026-11-20 to run in Claude Code cloud sessions. The skill `cartoon-3d-short` and its 17 helper agents are
installed inside the repo (`.claude/skills/`, `.claude/agents/`), so every new session has them without any install step.

## Start of a session
1. `python tools/install.py --check` must end with "All needed parts are there." If a line says MISS, run
   `bash tools/cloud_setup.sh` (Python parts, the Playwright link, the sound index) and check again.
2. Read `REGLES_METHODE.md` in full (the user's method rules: how to work, render cheaply, report honestly), before any code. Every technical problem solved goes into `LECONS_TECHNIQUES.md` in the same session (problem, cause, fix, guard, proof).
3. Then follow SKILL.md (STEP 0: read CB_RULES.md, SKILL.md, HANDOFF.md CURRENT STATE).

## What is different from the PC (this wins over PC-only lines in SKILL.md, CB_RULES.md, INSTALL.md)
| The books say | In the cloud |
|---|---|
| "CB" | the user |
| Render on the PC's graphics card (`render_gpu.mjs`) | There is no graphics card. `render_gpu.mjs` switches to software WebGL (SwiftShader) by itself on Linux; `render.mjs` always did. Same pictures, slower: test with `--frames` and small `--scale` first, run long renders in the background, render stretch by stretch. |
| `pip install ...`, `npm install`, `npx playwright install chromium` | `bash tools/cloud_setup.sh`. Never run `playwright install` here: Chromium is already in the image. |
| Skill and agents in `~/.claude/` | In this repo's `.claude/`. After a change to SKILL.md or `agents/`: `python tools/refresh_installed_skill.py`, then commit. New agents load in the next session. |
| Copy backups to OneDrive; "no version control here" | Git is the backup. Commit and push the film's keep-list (FILE_GUIDE.md) at every gate; the container is thrown away after the session. Frame folders are in `.gitignore`. |
| Show CB the picture / save the final in `Downloads\FINAL` | Send stills, sheets and videos to the user in the chat (file send), and commit the final mp4 in `episodes/<name>/`. |
| Fish Audio key in `FISH_API_KEY` | Not needed: the network proxy adds the key on calls to `api.fish.audio` (`tools/fish_tts.py` handles it). A voice take costs credits: the user's OK first, as the rules say. |
| Sound folders `C:/Users/...` | `templates/sound_kit/sound_config.json` points at `sound_pack/` (the free Sound Pack V1.2, licences in `sound_pack/LICENSES.md`). The index is rebuilt by `cloud_setup.sh`. |
| "Cloud and PC" link rules (CB_RULES section 9, SKILL.md) | Do not apply: everything runs in this one session. |
| Blender | BACK since 2026-11-20 (CB_RULES section 3 "BLENDER IS BACK"): ready-made assets first, staging in three.js, Blender rebuilds from the lock. Install with `bash tools/install_blender.sh` (Blender 5.3, 1.3 GB, about 40 s). Here: one key frame per preview (Cycles CPU about 37 s per full frame). The film render runs on RunPod after the user OKs the cost. |

## Measured here (2026-11-20, `templates/film_example`)
- Storyboard: 13 s. Animatic at `--scale 0.5`: about 0.5 s per frame (460 frames in 4 min).
- Full size 1080x1920 (`render_gpu.mjs --scale 1`): about 2 s per frame, so a 70 s film is about 70 min of rendering. Run it
  in the background, stretch by stretch.
- Two checks fail in the kit as shipped, on a PC too, because the author's own films are not in the zip. Not a cloud fault:
  `node templates/pieces/prove.mjs` needs `episodes/armor-s1-hook/`, and `node tools/check_views.mjs` has no approved
  per-view pictures for some casts ("no approved picture") and skips casts of films that are not included.
- `node tools/frame_checks/check.mjs` on the example reports 2 FAIL (kid slide f316-332): that is the example's own content.

## Network
Allowed: package registries, Google Drive, Fish Audio, Sketchfab, BlenderKit, Poly Haven, ambientCG, Hugging Face (the
faster-whisper model downloads from there on first use). Any other host needs the user's approval.

## Privacy
`references/` holds frames measured from another creator's videos: never put them in a published page or in a film.

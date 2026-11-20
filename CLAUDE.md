# Ricks Clips Animation Skill V1.2.1, cloud edition

This repo IS the skill folder ("the skill root", "the PC master" in the rule books). It was made for a Windows PC and was
reorganised on 2026-11-20 to run in Claude Code cloud sessions. The skill `cartoon-3d-short` and its 17 helper agents are
installed inside the repo (`.claude/skills/`, `.claude/agents/`), so every new session has them without any install step.

## Start of a session
1. `python tools/install.py --check` must end with "All needed parts are there." If a line says MISS, run
   `bash tools/cloud_setup.sh` (Python parts, the Playwright link, the sound index) and check again.
2. If `MISSING_FILES.md` exists, read it first: part of the character package is missing and nothing with a character renders
   until the user supplies a good copy of the zip.
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
| Blender | Parked by the rules themselves (`rules/parked/BLENDER_PARKED.md`). Not installed by the setup. |

## Network
Allowed: package registries, Google Drive, Fish Audio, Sketchfab, BlenderKit, Poly Haven, ambientCG, Hugging Face (the
faster-whisper model downloads from there on first use). Any other host needs the user's approval.

## Privacy
`references/` holds frames measured from another creator's videos: never put them in a published page or in a film.

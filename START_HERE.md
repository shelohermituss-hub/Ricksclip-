# START HERE: Ricks Clips Animation Skill V1.2

This folder is the whole kit: the rules, the 17 helper agents, the three.js film kit, the character and motion libraries, the sound kit, and two worked example films. Claude Code does the work on your own PC.

## 1. Install (about 15 minutes, once)
Follow `INSTALL.md`. At the end, `python tools/install.py` says "All needed parts are there."

## 2. Make a film
Open Claude Code in this folder and paste `START_FILM_PROMPT.md`, filled in. If you only have a topic, use the short version at the bottom of that file.

## 3. What to read when
| File | What it is |
|---|---|
| `WHATS_NEW_V1.2.md` | What changed since V1.1, in plain words |
| `START_FILM_PROMPT.md` | The prompt for every new film |
| `CB_RULES.md` | The one rule book. Claude reads all of it at STEP 0; helpers read their slice in `rules/dept/` |
| `SKILL.md` | The how-to: the order of work with its commands, the crew, the tools |
| `HANDOFF.md` | CURRENT STATE: your films in work. Claude updates it at the end of every film |
| `SOUND_AND_MUSIC.md` | Background music and sound effects: setup and the per-film steps |
| `TOKEN_SAVING.md` | Quality tiers, the token rules and the lean way |
| `UPDATE_LOG.md` | Every version and what it changed |

## 4. Read this once
- **"CB" in the rules means the director, which is now you.** Where a rule says "CB's OK" or "show CB in the chat", Claude asks you.
- **Reference frames are not included.** The rules compare every shot with a frame of the same kind of shot from the style you study. Collect your own study frames in `references/frames/<video title>/` (for private study only: never publish them, never copy a story, character or shot). Claude's `rick-researcher` picks from what you put there.
- **Sound and music are not included.** Point the kit at your own licensed folders (`SOUND_AND_MUSIC.md`), or let Claude make sound in code.
- **Voice**: a Fish Audio account (the rules use an energetic storyteller voice at pace 1.0 with a mood tag on every line), another text-to-speech tool, or your own recording.
- **Back up** your `episodes/` folder somewhere safe; this kit has no version control.
- When files disagree: CB_RULES.md wins, then SKILL.md, then the newest dated note.

## 5. Help
Questions and results: the Viral Shorts by CB community on Skool.

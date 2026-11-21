# library/ — two things live here

1. **The ASSET library** (CB_RULES section 3, "THE ASSET LIBRARY: BUILD ONCE, REUSE AND ADAPT", CB 2026-11-21): the catalogue
   `LIBRARY.md` of every model, material, tree, grass system, prop, set piece, character card, light preset and pipeline a film has built.
2. **The LEARNING library** (CB rule 2026-11-04, below): pitfall / solution / recipe / module notes, indexed in `INDEX.md`.

## The asset library: how to use it
1. **Search `LIBRARY.md` FIRST**, before any department builds anything (set, prop, vehicle, tree, grass, light, card). Start from the
   closest entry. Building from zero needs one line in the department report saying why no entry fits.
2. **Adapt through parameters, not by editing a copy blindly.** Each row names its build script and the knobs it has (size, colour, paint
   state, detail level, layout file, anchors). Read the row's "known faults" before you start: many builders were written inside one film
   and read that film's files (`LAYOUT.json`, `cards.json`, `assets/...`); the row lists what must change to reuse them.
3. **Push fixes back.** A fix made to a library item inside a film goes back to the item's source script (or, once the item is extracted,
   to its copy under `library/`) the same day, and the row's "known faults" line is updated.
4. **New items go in the same day** (the rule): build script with parameters, a preview picture, a `LIBRARY.md` row (name, what it is,
   made for which film, source and licence of any download, scale, how to adapt, known faults, preview path).
5. **Big binaries stay out of Git** (REGLES_METHODE 3): `*.blend`, `*.glb`, `*.fbx` and downloads are git-ignored (`.gitignore` covers
   `library/**` too). The build script plus the download log (the episode's `ASSETS.md`: URL, author, licence) rebuild them in a new session.
   Only scripts, small JSON, markdown and preview pictures are committed.
6. **Licences**: CC0, CC-BY or Sketchfab Free Standard only; no NonCommercial, no ShareAlike, nothing bought without CB's OK. A CC-BY
   download in a film needs its credit line in YOUTUBE.md (the row names the episode `ASSETS.md` that holds the exact line).
7. **Private**: nothing from `references/` ever goes into `library/` (frames, renders or files measured from another creator's videos).
   Code ideas from the private look-match exercise are listed as "to extract (private folder; copy code only)".

Preview contact sheet: `LIBRARY_SHEET.jpg` (made from proof pictures already committed in the episodes; `python3 library/make_sheet.py`).

---

# Learning library — how we get better with every episode (CB rule, 2026-11-04)

One markdown file per note in `library/<kind>/`. Kinds:
- **pitfall** — something that went wrong. Fields: Symptom, Cause, Fix, Detect (how to catch it
  automatically), Root cause, Permanent rule, Automation opportunity, Priority (CRITICAL/HIGH/MED/LOW).
- **solution** — a reusable technique that worked (what, why it works, reusable pattern).
- **recipe** — a story/staging structure that worked.
- **module** — a reusable prop/set/effect (code path or GLB). Asset modules are now catalogued in `LIBRARY.md`.

## The loop (non-negotiable)
1. **BEFORE every episode and every big step:** read `INDEX.md`, open every note whose tags match.
2. **THE MOMENT something breaks and gets fixed:** write the pitfall right away — not at the end.
3. **AFTER every episode:** harvest — new solutions/modules/recipes, one line each into INDEX.md.
4. **A fix seen twice becomes code**: a kit helper, a preset, or a check in `tools/qa/` (the Detect
   line of every pitfall is written so a script can test it).
5. Never delete a note — supersede it (note the replacement in both files).

Provenance: notes marked [adopted] were taken from CB's production library (claude-animated-shorts)
after verification; everything else was earned here.

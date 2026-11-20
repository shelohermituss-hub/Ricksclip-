# Character ID system (CB 2026-11-13: "preserve identity, vary performance")
Not on the PC yet: waits for CB's OK. Built in the cloud on the newest kit copies in project files (the PC master may be a little newer).

## What it is
Every character has one ID, CHAR_001 to CHAR_187, and one preset file `templates/vector2d_characters/code/char_id/registry/CHAR_xxx.json` with the 5 sections of CB_RULES section 4:
1. **ID**: id, name, label, style family, source, status (locked / draft), who approved it.
2. **Visual blueprint (locked)**: the designer's note, body form and bible size, exact proportions (headK, bodyTop, bodyBot, widths, height in px and in metres), head shape, face, hair, face items, headwear, outfit, costume length (+ reason if long), palette, limb style, line style, skin, art style, views, side-view arms. Linked to the **master asset**: the frozen castkit spec (sheet module + name) and the golden pictures per view (`assets/CHAR_xxx/{front,34,side,back}.{svg,png}`), plus the Blender card and an optional GLB.
3. **Personality**: the 13-point profile (temperament, confidence vs skill, fears, motivations, quirks, posture, rhythm, signature gestures, micro-behaviours, reaction speed, relationships). Written now for 3 (Inventor, Napoleon, the fireworks Boy); the other 184 are drafts that the writer fills in `personality_seed.json` before a character is first used. PERSONALITY DEPENDS ON THE STORY (CB 2026-11-13 02:57 "but this depends on the story"): the film's own CAST_PERSONALITY.md holds each character's profile for that story, headed with its ID; the film check fails only when that is missing. Preset profiles are optional defaults. Costumes for a new story are added as approved variants of the same ID after CB sees them.
4. **Allowed variations**: kit faces and face sets, the 10 lip-sync mouths, blinks, motion-library poses, the four views, any camera angle, scene light, held props, and the approved costume variants (e.g. CHAR_152@inventor_shirt).
5. **Forbidden deviations**: plus the "hardest locked" list.

IDs: CHAR_001-150 = the 150 bible cast in sheet order (bible three sizes). CHAR_151-187 = the casts of the 8 episodes (their sheets frozen into `code/sheets/ep_<episode>__<file>.mjs`), with hand and costume variants grouped under one ID. An ID never changes once given.

## How a film uses it
film.json: `"puppet": "char:CHAR_152"` or `"char:CHAR_152@inventor_shirt"`. film.js (patched, `CID.resolveCast`) loads the preset, draws the exact frozen spec and sets the locked height. A look key on the entry (coat, outfit, hair, height, look_bible, ...) or an unknown ID, an unlocked preset or an unapproved costume **stops the render**. Films already in animation keep `cast:`; they pass the film check only with `"legacy_cast": true`.

## Tools (from the skill root)
- `node tools/char_id.mjs register --all` registers everything (keeps existing IDs) and makes the golden pictures from the kit.
- `node tools/char_id.mjs register --sheet sheets/x.mjs --name foo` adds a NEW character as a draft. Show CB the sheet, then `lock CHAR_xxx --by "CB <date> <his words>"`.
- `node tools/char_id.mjs check` is the **drift check**: all 187 x 4 views are rebuilt and compared with the golden pictures (exact SVG after id renumbering, then pixels at 0.001 % and a silhouette grid). It exits 1 on drift and says whether the sheet or the kit moved. Run it after any kit change and before any render.
- `node tools/char_id.mjs film episodes/x/film.json` is the **preset compliance check** for a film.
- `node tools/char_id.mjs sheet CHAR_xxx ... --out f.png` makes the preset sheet (four views, 8 faces, 4 mouths, palette, the five sections).
- `node tools/char_id.mjs find <word>`.
- Blender: `code/char_id/blender/char_id_blender.py` has `load_char(id, view)` (image card at the locked height, hash checked), `load_char_svg`, `load_glb` and `verify`. Not run yet: there is no Blender in the cloud.

## Proof (cloud)
- check: PASS 187 x 4 views. With two deliberate changes (Napoleon's coat colour in his sheet; fat heads +6 % in bodies.mjs) it reports DRIFT on Napoleon's 4 views and on 33 fat characters (pictures/drift_demo.jpg).
- Browser path (tests/browser_film_test.mjs): film.json char: -> resolveCast -> puppets.svgFor gives drawings identical to the golden ones (16 of 16), and the render is stopped for coat, look_bible, CHAR_999 and an unapproved costume.
- film check: tests/film_ok PASS; tests/film_bad FAIL with 5 named problems.

## Gaps (said to CB)
- Side view draws one arm on all 187: CB's new rule says both arms. That is a kit change for the character threads; the check lists it as a note.
- 7 long costumes have no reason written yet (CB: short by default). 45 episode characters have no design note (label only).
- Personality profiles: 3 written, 184 drafts.
- On the PC: run `register --all` there so the golden pictures come from the PC master. The assets (about 140 MB) are not sent from the cloud.

## Install (after CB's OK)
Back up first (<your backup folder>\char_id_2026-11-13\before: templates\threejs_film\film.js). Copy `install/` into the skill root, EXCEPT film.js: apply its two small edits (the `cast|char` test and the CHARACTER ID block before `memes3 = ...`) to the PC's own film.js, which may be newer. Then run `register --all` and `check` on the PC, then check_views.

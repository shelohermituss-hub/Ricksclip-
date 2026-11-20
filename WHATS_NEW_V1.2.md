# What's new in V1.2

V1.1 gave you the full skill and the lean pipeline ("same quality, half the tokens"). V1.2 is about getting it right **before** it is built, so a film needs fewer fix rounds: better camera, more creative acting, a measured world, a full sound track, and a clear token budget you choose.

## The big ones

**1. A starter prompt that works for any film** (`START_FILM_PROMPT.md`)
One message to paste into a new chat: title, tier, your voice file, the beats as "exact words = what we see", the cast, sets, light, the one stillness, the signature shot and the sound mood. Claude checks the skill first, shows you the prop list and look card, then the hook moving, then the whole rough film.

**2. Background music and sound effects, mixed for you** (`SOUND_AND_MUSIC.md`, `templates/sound_kit/`)
Point the kit at your own licensed sound and music folders once. For every film Claude builds a cue list from the plan, puts a sound on every action, an ambience bed on every place and ONE music theme that follows the story (stated at the start, changed at the low point, back at the end), then mixes and measures it: loudness, true peak, voice always on top, a click-free loop. One command, a report and a phone preview.

**3. Token saving you control** (`TOKEN_SAVING.md`)
- Pick a quality tier per film: Standard (about 400 M tokens per finished minute), Premium (about 700 M) or Ultra (about 1 billion). Each tier says what it buys (light, detail, effects, edit rounds). No tier skips a check.
- The lean way per stretch: one builder does board, build-out and camera in one session, the camera is locked before the first render, at most one small helper for render and measure, and a time box. Measured on a test stretch: about 25-30 % fewer tokens for the same job.
- Claude warns you at 80 % of the budget and never passes the cap without your yes.

**4. Step 0 and the five pre-build checks**
Every film starts with a skill check ("Skill checked, up to date"). Then five cheap checks catch the expensive faults early: (1) a reference pack of frames per beat, (2) the hero object and a prop list with five specific details each, OKed by you, (3) a one-page look card, OKed by you, (4) the hook built at full detail first, and stopped if it is weaker than the reference, (5) automatic checks after every scene, not only at the end.

**5. A creative director and "the creative edge"** (CB_RULES section 12)
A new helper, `creative-director`, runs once per film after the script and voice. It gives every beat one acted gag (a double take, a fumble and catch, a proud pose that backfires), one signature shot nobody else would make, and a colour world for the film (its own palette, one accent). The goal: match Rick on camera and world, beat him on character acting.

**6. A camera that is calm and tells the story** (CB_RULES 11h)
- A library of 27 camera moves (M00-M26), each with when to use it, its numbers and copyable stations, picked by the story job of the moment (hook, setup, explanation, analogy, reveal, climax, ending).
- The 12 camera-director points, including the attention chain (face, hand, prop, consequence, reaction) and a story keyframe with a purpose for every station.
- Camera DON'Ts: 13 things that must never happen (random zooms, decorative orbits, shakes without a hit, whips that were not planned...).
- Camera v2 on every new film: travel time grows with distance, close shots keep drifting, whips are capped. The camera plan is checked before anything renders.

**7. Camera-safe characters by default**
New films start with `"camsafe": true`: the flat characters always show the right view (front, 3/4, side, back) as the camera moves around them, seated characters stay on their seats, and a validator flags every wrong view before you see it.

**8. A richer, more readable picture** (lessons from the "Miner" prompt, CB_RULES sections 2, 3, 11i, 12c)
- Exact words and ONE action on a named word in every beat.
- One planned stillness per film.
- One signature colour, on the hero only.
- Every light has a visible source, and the light follows the story.
- Depth in every shot (near, mid, far).
- A named prop list per set, with wear on everything.
- A rich, coloured dark instead of black.
- No vignette, except for a flashback or a dream.
- A measured detail gate: every place is dressed and its edge detail measured against Rick's range before the build.

**9. Power moments, extreme gags and impossible views** (CB_RULES 11e-11g)
3-5 power moments per film directed like an anime visual director, "the word made extreme" (a fat cheque becomes a mountain of money), POV shots and one or two impossible camera views, all tied to story words.

**10. A second worked example**
"The Surgery That Did Nothing" (fake-surgery): a complete, approved film in five stretches, built with the lean pipeline, camera v2 and the strict frame checks. Text and code only (script, picture plan, briefs, sets, stretch film.json files, sound cues). The V1.1 example "Why The Safest Tower Had A Spear On Top" is still included.

## Smaller changes
- SKILL.md is now a lean how-to (about 22 kB instead of 180 kB). The rules live in one place, CB_RULES.md v2, with old contradictions merged.
- Character template v13: arms are one slight curve with a round fist, front sit with the legs over the body, floor sit with 3D legs.
- `tools/install.py` installs the skill, all 17 helpers and the rule slices on a fresh PC and checks what is missing.
- Blender passes are parked (`rules/parked/BLENDER_PARKED.md`): the three.js film with its light pass and grade is the final picture. Blender comes back only when you ask for it.

**11. Body and scale checks in every cycle**
The frame checks now also check characters in vehicles (they used to be skipped): a body check (seat, back rest, pedals, wheel, desk, pillow contacts, drawn size against the cast size) and a scale check (head to roof, shoulder to window sill, hands on the wheel, rider against the bus door). One command per stretch cycle, `tools/run_stretch.sh`, runs the plan check, render, frame checks, detail gate and camera numbers together.

## Coming in 1.2.x (not in this zip yet)
- **Full-body pose rig in the film renderer**: every joint of a seated, driving or lying character placed from what it touches, with cars and buses built around a full-size rider. The solver ships already (the body check uses it, `templates/body_rig/`), but it is not yet switched on in the film renderer; that step is waiting for the final OK.

## Updating from V1.1
Your films stay yours. Unzip V1.2 into a NEW folder, copy your `episodes/` folder from V1.1 into it, run `python tools/install.py`, then start new films with `START_FILM_PROMPT.md`. Films you started in V1.1 can be finished in V1.1's way; new films use V1.2.

# UNITY KIT PLAN: Unity as the main engine (decided by CB 2026-11-22)

Read this first in the Claude Code session on CB's PC. It replaces the cloud session: from now on CB works with that session
(« continuer tous nos prochains conversation dans l'autre session car il a aussi accès a mon pc »).

## Decisions (CB, 2026-11-22)
| question | answer |
|---|---|
| engine | **Unity is the main engine** (« construire le kit unity, et le mettre comme moteur principal »). Unity 6000.3.29f1 LTS, URP, on the PC (NVIDIA 940MX 2 GB: URP only, no HDRP). |
| characters | **our 2D puppet cast kept** (Rick's look): head+body picture per view and face, limbs drawn as ink lines on the joints, moved by **Mixamo** motion (proven: `puppet_X_BotWalking.mp4`, 0 pops). |
| sets and props | **ready packs first** (Kenney, Quaternius: CC0; Unity Asset Store: CB adds packs to his account), **Blender by script only for what is missing** (the GLB route is proven, see below). |
| next film | **a NEW video** (the astro-flush study is stopped). Topic to choose with CB. |
| fallback | the three.js kit (`templates/threejs_film`) stays as fallback until the Unity kit has made one whole film. |

## What is already proven (do not redo)
- `unity_test/README.md` (shot 11 of the study, end section "Résultat"): glTF -> Unity conversion `(x,y,z) -> (-x,y,z)`, quaternion `(qx,-qy,-qz,qw)`,
  camera `* Euler(0,180,0)`; 0.003 px error on 700 points. Render 69 ms per frame, 164 ms with the PNG write, on the 940MX.
- Lessons from that test: glTFast in URP loses `KHR_materials_specular` (rebuild materials from the GLB colours); URP/Lit does not flip back faces
  (flat panels need double sided); our GLB colours came out grey and needed a tint table: **set the colour pipeline once** (linear vs gamma, tone mapping off
  or neutral, exposure) instead of tinting material by material.
- The glitter/particle look: Unity's particles + bloom did what the kit could not (dense bright cloud).
- Same data = same picture: the gap to Rick in that test came from staging and models, not from the engine. Unity is chosen for speed on the PC,
  physics, particles, Cinemachine and Timeline, not as a fix for weak staging.

## What stays the same (the system around the engine)
- Rules: `REGLES_METHODE.md` (read in full at the start of each session), `CB_RULES.md` (one rule book; section 3 has the ENGINE line), `LECONS_TECHNIQUES.md`
  (every technical problem solved goes in, same session: problem, cause, fix, guard, proof).
- Story side: the `writer` / `creative-director` agents, script, words with times (faster-whisper), voice through `tools/fish_tts.py` (on the PC the key is
  `FISH_API_KEY`; a voice take costs credits: CB's OK first), sound from `sound_pack/`.
- Camera brain: `tools/film_plan.py` (film.json stations -> `out/plan/camera_baked.json`, per-frame pos/aim/roll/fov in plan metres, Z up). Unity plays that
  baked camera, or uses it as Cinemachine targets.
- Checks on the finished mp4: `tools/measure/fluidity_clean.py` (held / pops / jerk) works on any video.
- Cast drawing: `templates/vector2d_characters/` + the episode cast sheet. `unity_kit/tools/export_puppet.mjs <who>` writes the Unity parts
  (36 PNG per character: full_<view>, torso_<view>_<face> for 3 views x 11 faces, and rig.json with hips, shoulders, limb lengths in card pixels;
  card 800x1500 px, feet on y 1440). It reads the astro-flush cast sheet today: point it at the new film's cast sheet.

## What the Unity kit must do (build in this order, each step proven in picture before the next)
1. **Project and render.** One Unity project (outside git, e.g. `unityrick`) that holds the kit as a package in this repo: `unity_kit/Packages/com.ricksclips.kit`
   (Runtime + Editor C#). Batch-mode command: film.json in -> PNG frames -> mp4 with the mixed sound (ffmpeg). Colour pipeline set once (see above).
2. **Film reader.** Reads the same film.json as the three.js kit (places, cast, acts, words, takes, post) so the agents and tools keep working.
   Camera from `camera_baked.json`. Captions in Rick's style on `words`. Every new film.json field is written in `unity_kit/FILM_JSON_UNITY.md`.
3. **Puppet rig.** Torso picture on a card; limbs = ink lines (colour `#2a1a1f`, 19 card px, hands = discs of radius 26 px) on Mixamo joints projected
   to the card plane; face swap on act `face` keys and on the words (talk visemes); views front / 3/4 / side chosen from the facing (a flat card handles
   turns badly: switch view at the turn, as the three.js kit does). Feet planted (Mixamo foot IK), no foot slide (the test: 0.62 cm per frame).
   Map our move names (walk, run, wave, point, shrug, laugh, scared...) to Mixamo clips in one table `unity_kit/MOVES.md`.
4. **Sets.** Packs first (Kenney / Quaternius download from the PC; Asset Store via CB's account), assembled by a C# place script per place (like `sets/<place>.js`),
   every moving thing a named object; Blender-by-script GLBs only for what no pack has. Physics (rigidbodies) for things that fall, float or bounce.
5. **Light and look.** URP lights with soft shadows, one key light per scene, post (bloom, colour grade toward Rick's numbers in
   `references/reports/rick_grade_2026-11-21/`, privately on the PC), the thin dark object outline of REGLES_METHODE section 2.
6. **Effects.** Particles / VFX for sparks, smoke, glow, the "power" effects of CB_RULES 11f, each on its word.
7. **Checks.** Port the two motion checks to Unity dumps (collisions between objects and characters; every moving object fluid, no held frames, no jumps):
   write a per-frame JSON in the same shape as `tools/motion_objects` so the same thresholds apply.

## First film with the Unity kit
A new short (CB picks the topic). Same pipeline as SKILL.md for the story side; picture side through the Unity kit. Show CB a short draft early
(REGLES_METHODE 2: key frames first, whole film once at the end). Update `SKILL.md`, `CLAUDE.md` and the agents' engine lines only when the kit has made
this film (until then this plan is the reference).

## PC session notes
- This repo's `CLAUDE.md` is the CLOUD edition (no graphics card, `cloud_setup.sh`). On the PC: the graphics card exists, Unity is installed, tools that are
  bash scripts need Git Bash or a PowerShell twin; Python and Node must be installed for the story-side tools and `export_puppet.mjs` (it uses Playwright's
  Chromium: `npx playwright install chromium` on the PC).
- Commit and push from the PC to this repo (branch `ccr-e4844daf-xc796n`, or a new branch CB names) at every gate: git is the backup.
- `references/` (Rick's measured frames) never goes into a published page or a film; it is git-ignored and stays on CB's machines.
- Free disk was 11 GB after the test: a Unity project grows by several GB (Library); check space before importing packs.

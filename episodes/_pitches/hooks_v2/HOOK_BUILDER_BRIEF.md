# Brief: ONE hook frame in the three.js kit for a pitch (CB 2026-11-16: "you can create them here in three js i want see the real work")

Skill root: `<skill folder>`. Your folder: `episodes/_pitches/hooks_v2/<idea>/`. Work only inside it.

## Goal
One finished-looking 9:16 hook frame (frame 0) for the idea named in your task, built in the real three.js kit the way our films are built. CB uses it to pick the next film, so it must look like our real work, not a sketch. Stand-in cast from the character library, recostumed for the era, is fine. No voice, no motion, no captions.

## Read, in this order and nothing more (token rule T1)
1. `rules/dept/stretch-builder.md`. It is your rule slice: the kit, the cast, render_gpu, the frame checks.
2. `episodes/_pitches/IDEAS_v2_2026-11-16.md`: only your idea's section.
3. `episodes/_pitches/hooks_v2/HOOK_PROMPTS.md`: only your idea's paragraph. That is the picture to build.
4. Look at `episodes/_pitches/hooks_v2/rick_ref.jpg` (Rick's hook: one character with his object, big in frame, in a lit set with depth) and `episodes/_pitches/hooks_v2/style_ref.jpg` (our approved lightning film). Your frame must stand beside them. Take the method from Rick, never his content.
5. The newest film's working setup, to copy the way a film.json, the cast and the sets are wired:
   - `episodes/lightning-spear/` (approved kit3d look: its film.json, cast/ and set modules);
   - `episodes/monopoly-escape/LOOK_BIBLE.md` for the colour targets (CB_RULES 11c).
   Grep before you build (T8). Reuse library characters, props and set parts from `templates/` and earlier episodes, then change them for this story.

## Rules that matter most here
- FRAME 0 = the strange act, readable at phone size with the sound off. The doer, the thing and the mocker are all in frame. The hero object must be readable.
- Characters as big as Rick's: the main figure takes at least a third of the frame height. Faces stay above the lower third, and nothing stands in front of the subject.
- Era-true costume: hat, neckwear and facial hair for the decade. No coloured light rim on faces. `costume_shade.smooth` 40. Round fists, never 3D hands.
- A real set with depth: a foreground prop, the middle with the action, a detailed background. Five specific details per main object (Hard Rule No. 2). Strong colour from the first render (LOOK_BIBLE targets: saturation at least 0.30 by day; night never under brightness 0.31).
- Taken out: no Blender, no separate light or effects rounds. You set the light yourself in the render.

## Render (shared graphics card, the Monopoly film is rendering at the same time)
Use ONLY the fair queue: from your folder, `bash ../../../monopoly-escape/tools/gpu_render.sh film.json --frames 0 --scale 1 --stills-dir out`. It allows two GPU jobs at a time and serves first come, first served. Never start node render_gpu.mjs directly. Render small first (`--scale 0.5`) while staging, then one full frame. Then run `node tools/frame_checks/check.mjs <your film.json>` (from the skill root): 0 FAIL.

## Limits and report
- Time cap: 60 minutes. Look at pictures small (T3): one image at a time, at most about 4 looks in total.
- At the end: `out/hook.png` (full size, 1080x1920 if the kit's default) and `out/hook_small.jpg` (540 px wide), plus `STATE.md` (at most 30 lines: what was built, the files, what is still weak compared with Rick's frame).
- Report in at most 15 lines: the path of hook.png, the frame-check numbers, the 3 weakest points compared with rick_ref.jpg.

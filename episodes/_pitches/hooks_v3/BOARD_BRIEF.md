# Brief: the first 5 seconds of a pitch as a three.js storyboard (CB 2026-11-16: "create for first 4 the first 5 second storyboard image for me to see")

Skill root: `<skill folder>`. Your folder: `episodes/_pitches/hooks_v3/<idea>/`. Work only inside it.

## Goal
CB uses this to pick the next film, so it must look like our real work. Make:
- 3 key frames in the real three.js kit, covering the first ~5 seconds of the film;
- one board image that puts them side by side, with the spoken words under each panel.

## Step 1: the opening words (no voice is recorded)
Write the film's first 1-2 sentences (14-18 words, about 5 s at Rick's pace of about 3.6 words a second), Rick's way:
- open on the strange act, told like a 10-year-old to a friend;
- the mocker's line, if it fits in 5 s.

Examples of Rick's openings:
- "[line from a reference film left out]."
- "They painted the jail cell pink."

Save it as `OPENING.md` with a rough time per word, e.g. panel 1 = 0.0 s, panel 2 = about 2.0 s, panel 3 = about 4.0 s.

## Step 2: three panels
- **Panel 1 = FRAME 0:** the strange act, ONE hero big in frame with the thing. The person who mocks or doubts it is small or behind. Last round's lesson (`episodes/_pitches/hooks_v2/HOOKS_SHEET.jpg`): when two strong figures compete, the frame is weaker than Rick's.
- **Panels 2-3:** a NEW angle or a clear camera move each, staying on the words: the doer, the thing and the result in one frame.

## Read, in this order and nothing more (token rule T1)
1. `rules/dept/stretch-builder.md`, your rule slice.
2. `episodes/_pitches/IDEAS_v3_2026-11-16.md`: only your idea's section.
3. Two references to look at:
   - `episodes/_pitches/hooks_v2/rick_ref.jpg`: Rick's hook, one character with his object, big, under a hard pool of light.
   - `episodes/_pitches/hooks_v2/elevator-mirror/out/hook_small.jpg`: our best pitch frame so far.
   Take the method from Rick, never his content.
4. To copy the way a film.json, the cast and the sets are wired, read one earlier pitch folder: `episodes/_pitches/hooks_v2/elevator-mirror/` (STATE.md, film.json, cast/, sets/).
   - Grep before you build (T8). Reuse library characters, props and set parts, changed for this story.
   - Use `episodes/monopoly-escape/LOOK_BIBLE.md` for the colour targets.

## Rules that matter most
- The strange act reads at phone size with the sound off.
- The main figure takes at least a third of the frame height, and faces stay above the lower third.
- Era-true costumes. No coloured light rim on faces, `costume_shade.smooth` 40, round fists, never 3D hands.
- ONE hard key light with real shadows and a pool of light on the hero. Last round, every frame's light was too flat.
- A foreground prop in frame, and five specific details per main object (Hard Rule No. 2).
- Saturation at least 0.30 by day; night brightness never under 0.31.
- Taken out: Blender, and separate light or effects rounds.

## Render (shared graphics card: two films are rendering at the same time)
- Use ONLY the fair queue. From your folder: `bash ../../../monopoly-escape/tools/gpu_render.sh film.json --frames <the 3 frames> --scale 1 --no-captions --stills-dir out`. Never run render_gpu.mjs directly.
- Stage with `--scale 0.5` first.
- Then, from the skill root: `node tools/frame_checks/check.mjs <your film.json>` must show 0 FAIL.

## Output
- `out/p1.png`, `out/p2.png`, `out/p3.png` (full size).
- `out/board.jpg`: the three panels side by side, each 540 px wide, with the panel's words in plain white text on a dark strip under it, and the idea's title at the top.
- `STATE.md` (at most 30 lines).
- Time cap: 60 minutes. Look at pictures small, at most 5 looks in total.
- Report in at most 12 lines: the path of board.jpg, the opening words, the frame-check numbers, and the 2 weakest points compared with Rick.

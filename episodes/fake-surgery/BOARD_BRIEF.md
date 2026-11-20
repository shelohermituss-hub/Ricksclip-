# Fake surgery: the rough board. Brief for every stretch builder (lead, 2026-11-16)

Film: "The Surgery Where the Surgeon Did Nothing". Story, voice and picture plan are approved by CB. This round is THE ONE GATE (CB_RULES 11a.2): 2-3 real three.js key frames for EVERY picture-plan row of your stretch, no polish, so CB can say yes or no to the whole film. S1 also brings the HOOK MOVING (0-12.5 s with voice and captions). HARD CAP 90 minutes of work (aim for 75). No judge, no department rounds, no light or effects rounds on stills, no Blender.

## Stretches (times from voice/words.json; acts are plain FILM frame numbers at 30 fps)
| S | film s | rows | lines | places / light kind (LOOK_BIBLE) | musts from PICTURE_PLAN "ADDED" |
|---|---|---|---|---|---|
| S1 | 0.00-12.50 | 1-10 | 1-3 | OR 3 / OR | POWER r5 (three plasters), IMPOSSIBLE r6 (from the sealed scope's lens), nurse quote r10 (start from the loudness curve, about 10.0 s), patient reclined puppet; HOOK MOVING |
| S2 | 12.50-25.90 | 11-20 | 4-6 | corridor / CO, office / NI | EXTREME r15 (gurney queue to the horizon), POWER r18 ("?" field), EXTREME r19 (card stack to the ceiling); join r15->16 through the clock face |
| S3 | 25.90-42.70 | 21-30 | 7-9 | office / NI, pre-op bay / CO, OR 3 / OR | POV r25 (form top-down), IMPOSSIBLE r27-28 (from inside the CRT), EXTREME r29 (OR flood); HARD CUT at about 30.9 |
| S4 | 42.70-56.10 | 31-39 | 10-12 | stairwell / AF, office stripes / AF | EXTREME r31 (cobweb cane), EXTREME r33 (three strides), POWER r37 (ruler), POV r38 (through his glasses); HARD CUT at 43.00 |
| S5 | 56.10-73.62 | 40-50 | 13-16 | OR replay / OR, waiting room / AF, office 2004 / GR, OR evening / EV, stairwell evening / EV | POWER r40 (gold aura), SIGNATURE r43 (row 5 framing), EXTREME r46 (paint-tin stamp), rows 49-50 RE-STAGED (last frame on the stairs), POWER + EXTREME r50 |

## Read, in this order, and nothing more
0. `episodes/fake-surgery/LEAD_QUEUE.md` (decisions + notes for your stretch).
1. `rules/dept/stretch-builder.md` (your rule slice; never CB_RULES.md or SKILL.md whole; grep for a word).
2. `episodes/fake-surgery/LOOK_BIBLE.md` (world, palette, THE ONE RED = pain, the light kind of your rows, cast, camera, Never).
3. `episodes/fake-surgery/PICTURE_PLAN.md`: "The knee must read at phone size", the section "ADDED 2026-11-16 ... 11e, 11f, 11g" and "THE PATIENT IS A FULL CHARACTER" at the end (your rows in them are musts and win over the table), then YOUR rows only, "Same-framing pairs" (5 / 32 / 43 the knee close; 20 / 36-37; 1 / 50; 6 / 48), "Notes for the builders", "Known word-time faults".
4. `episodes/fake-surgery/SCRIPT.md`: only your lines.
5. `episodes/fake-surgery/cast/STATE.md` + `cast/CAST_KEYS.json` (import the cast; the face and shade keys every film.json must carry; how the reclined patient works).
6. `episodes/fake-surgery/sets/README.md` (owners), `sets/world.js`, `sets/PLACE_KEYS.json` (light per kind), `sets/STATE.md`, `sets/look_pack_README.md`, `sets/PROPS_README.md` (every prop and its states: import, never rebuild), the top comment of each set file you use (its place keys).
7. Patterns (list first, read only what you need): the hook board `episodes/_pitches/hooks_v3/fake-surgery/film.json` (+ `moves/ep_surgery.mjs`: sg_work, nr_stare); the stretch pattern that passed today: `episodes/elevator-mirror/s1/` (run.sh = the ONE command, build_film.py, board/make_sheets.py, board/make_hook.py, moves/studio_ep.mjs, moves/tools/check_motion_ep.mjs).
8. `templates/pieces/INDEX.md` only if your row names a piece (technique only; write what you changed for this story). Power effects: `sets/power/` (a copy of the library; shockwave_ring, crack_veins and aura are weak defaults: restyle for your scene or build the scene's own effect).

## Set up
- Your folder: `episodes/fake-surgery/s<N>/` (exists; `sets`, `cast`, `voice` are junctions to the film's shared folders: load through them, never copy, never rm -rf them). `moves/` is YOUR folder: copy `studio_ep.mjs` and `tools/check_motion_ep.mjs` from the elevator s1 pattern, adapt the sheet name (`cast/sheets/surgery.mjs`), write your moves in `moves/ep_s<N>.mjs` (you may copy from `episodes/fake-surgery/moves/ep_surgery.mjs`). Put film.json, build_film.py, run.sh, `board/`, `STATE.md`, `OFFSET.txt` (film frame range + rows) in your folder.
- Voice: `voice/voice.wav` + `voice/words.json` (approved; never re-record, never trim). Fix the word times the plan marks only from the loudness curve of voice.wav, in your own `words_s<N>.json`.
- Sets: edit ONLY a file you own (sets/README.md: S1 owns or_room.js + or_props.js; S2 owns corridor.js + office.js; S4 owns stairwell.js; S5 owns waiting.js). Import the others. Wishes for a file you do not own go into `episodes/fake-surgery/SET_CHANGES.md` (one line: who, file, what, which row). A change to a set file you own is switched on by a NEW film.json place key so the other stretches do not change. If a file you need is missing, build your other rows first.
- Render ONLY on the graphics card through the SHARED fair queue (four films render now; two GPU jobs at a time across all of them), from your folder: `bash ../tools/gpu_render.sh film.json --frames <list> --scale 1 --stills-dir board/frames`  (from a stretch folder s<N>/; from deeper folders use the right number of ../). Never render_gpu.mjs or render.mjs directly, never software. Few calls, many frames per call. Stage with `--scale 0.5` first if the queue is long. Guard pow, sqrt and divisions in any new shader. If one of YOUR processes hangs, stop it yourself; never stop another film's processes.

## What a key frame must be
- A real moment of an episode MOVE (`m:`) on the newest STUDIO MOTION curves (`studio_ep.mjs`), passing `moves/tools/check_motion_ep.mjs` (twos 0, linear 0, no_settle 0, creep 0): plain kit poses 0, frozen moves 0, `tween.ones` true, `face_frames` 0. Round black fists ON the object (never a 3D hand). Arms one slight curve (view rule 34; `sets/soft_arm.js` for set-drawn arms).
- Faces change ON the word (the plan's "feeling" column); the nurse's mouth moves with her quote (row 10).
- The named thing in frame ON its word (CLOSE or IN SCENE as the row says). Doer + thing + result in one frame. Reads with the sound off at phone size. Knee shots follow the knee rules (three dots / three plasters countable at 360 px).
- Colour from the first day: your light kind from `sets/PLACE_KEYS.json`; ungraded saturation at least 0.36 (0.30 by day); NI mean brightness at least 0.31; THE ONE RED only on the pain dial's red zone and the pain bars (RED GATE: hue within 12 deg of #e01e2a, S>.5, V>.55). Faces clean white (CAST_KEYS). `kit3d: { pbr: true, relief: true }` from the first render; surfaces from look_pack.js only.
- Camera at character height, at most 10 deg down on a character; faces and the named thing above the caption line (71.5 % of the height); nobody cut by a frame edge on a rest (waivers only where the plan says, e.g. the knee closes); every foot on a visible surface; floor at most a third of a wide; something big and close in frame.
- Power moments as anime-directed sequences inside your take (hold, impact frame, crash zoom or freeze, abstract field, shake on the hit, settle); EXTREME gags on their word, held about 1 s. Kid-safe, bloodless always.
- Period: Houston hospital mid-1990s (2004 only rows 45-47). No real name, no hospital name, no logo or seal.

## Deliver, in `episodes/fake-surgery/s<N>/board/`
- `frames/`: 2-3 key frames per plan row, 1080x1920, WITH the kit's captions (caption "no better", "180", "60" as the plan says), named `r<row>_<a|b|c>_f<filmframe>.png`.
- `sheet_360.jpg` (all panels 360 px wide, row order, row number + landing word under each), `line_check.jpg` (each row's words beside its frames).
- `numbers.txt`: saturation and mean brightness per panel, red-gate pixel count per panel.
- `checks.txt`: `timeout 420 node ../../../tools/frame_checks/check.mjs film.json` = 0 FAIL (or name the plan row that waives it). ALWAYS under `timeout 420`.
- `motion_gate.txt` (check_motion_ep.mjs output).
- S1 only: `hook_moving.mp4` (film 0-12.5 s, voice + captions) + `hook_strip.jpg`.
- `STATE.md` (max 60 lines): built, files, the ONE command, numbers, joins + hard cuts in your stretch, weak, open.

## Report (max 25 lines)
Done; numbers (frame checks, motion gate, saturation, brightness, red pixels); per row one word (ok / weak + why); set and move file names; SET_CHANGES you asked for; weak points; files. Never paste long tool output; name the file.

## Token rules (CB_RULES 11b)
ONE command per cycle (`bash run.sh`: build -> bake -> motion gate -> GPU stills -> sheets + numbers -> frame checks). Numbers before pictures; look at one small sheet (max 1600 px wide) at most 3 times in the whole job. Run `bash run.sh` in the foreground with the longest timeout (10 min); split frames over calls if needed. Never poll a log or sleep-wait. Do not study Rick again (T8). Do not build a tool that exists (grep tools/, templates/, episodes/elevator-mirror/ first).

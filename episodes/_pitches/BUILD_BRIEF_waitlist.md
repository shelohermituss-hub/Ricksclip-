# Build brief for the three waiting-list films (CB 2026-11-16: "create the 3 clips in sup line similar mirror an monopoly")

Skill root: `<skill folder>`. You are the LEAD of ONE film's build phase, run the same way as the Monopoly and elevator builds.
The story phase is done and CB approved it: FACTS.md, SCRIPT.md v1, the voice (`voice/voice.wav` + `voice/words.json`, untrimmed, voice_breathe pauses) and PICTURE_PLAN.md.

## Quality tier (CB_RULES 11a2, from 2026-11-16)
The film's tier (STANDARD / PREMIUM / ULTRA) and its budget per finished minute are set by CB before the build. If the brief doesn't name one, ask the lead or CB first. Write "used / budget" in STATE.md at the gate and after every round.

## Read first (only these, then rule slices as needed, CB_RULES 11 T1-T9)
- CB_RULES.md section 11 (lean pipeline, token rules), 11c, 11e, 11f, 11g. SKILL.md "Rick's latest, 2026-11-16".
- HANDOFF.md sections 0m, the elevator 0l (BUILD PHASE bullets = the method and rules learned), and the Monopoly 0k + "0l FINAL v1 APPROVED" (what worked, the known weak list, why it went over the token budget).
- Your film's STATE.md, SCRIPT.md, PICTURE_PLAN.md, FACTS.md, voice/VOICE_NOTES.md, and `episodes/_pitches/hooks_v3/<film>/STATE.md` (the 5-second board CB liked; fix its weak points).
- As the bar for method and depth (copy nothing): `episodes/elevator-mirror/` (LOOK_BIBLE.md, sets/, stretch STATE.md + run.sh, gate/) and `episodes/monopoly-escape/` (sets/look_pack.js, sets/soft_arm.js, join/, sound/, YOUTUBE.md).

## Before any builder starts
1. Add to PICTURE_PLAN.md an "ADDED 11e-11g" section, as the elevator did: 4-8 EXTREME gags (11g), 3-5 power moments directed like an anime/manga visual director and matching the scene (never a fixed list), 1-2 POV shots where they fit, 1-2 IMPOSSIBLE VIEW rows, the key term + one number on a sign in the world, at most 1 hard cut per 10 s, and the LAST FRAME = the hero calm in front of the huge result.
   - fake-surgery only: the ending needs a final PICTURE (11e point 2), e.g. the veteran running up the hospital stairs past the surgeon.
2. LOOK_BIBLE.md (light kinds, the ONE red, red gate) and a shared `sets/look_pack.js` at the best film's look (kit3d) BEFORE builders start. The Monopoly overrun came from building rough boards without it.
3. Cast from template v12: arms are one slight curve (view rule 34, Monopoly's `sets/soft_arm.js`), hands only a black circle, every act a motion-library move, costumes checked against the era.
4. COPY the power library `templates/pieces/fx/power/` into your `sets/power/`. shockwave_ring, crack_veins and aura are weak defaults, so restyle them for your scene.

## Camera (CB_RULES 11a 2b, added 2026-11-16 after four films came out with a fast, jumpy camera)
- A picture-plan row is NOT a camera station. Before a stretch renders in motion, the camera-director writes its camera from the built sets: a few flowing moves through several rows, the reason for each move written in CAMERA_NOTE.md.
- `python tools/film_plan.py check` runs in every run.sh before a render. The bands are warnings, the scene decides; outside a band only with the reason in CAMERA_NOTE.md. A teleport or an unplanned whip is always FAIL. Keep moves eased, about 40 px/frame at most (11f SMOOTH).
- Every new film.json has `"camera": {"v2": true}` (CINEMATOGRAPHY.md section 7); read every camera v2 WARN.
- The lead measures the first moving stretch with tools/measure/cam_track.py and watches it beside a Rick clip of the same kind of scene before the other stretches render.

## GPU (shared by every film running now)
- Never call render_gpu.mjs directly. Make `tools/gpu_render.sh` in your film as a one-line wrapper around the shared fair queue, exactly like `episodes/elevator-mirror/tools/gpu_render.sh` (`exec bash .../monopoly-escape/tools/gpu_render.sh "$@"`). There are two GPU jobs at a time across ALL films.
- Every frame check runs under `timeout 420`. If one of your processes hangs, stop it yourself; never stop another film's processes.
- Four films share the card, so expect queue waits. Render numbers and few frames first (T-rules), and avoid big still batches.

## The one gate (CB's workflow: one gate, then autonomous to the final)
- Stretch builders (4-5 stretches as in the plan, a fresh helper per round, Sonnet for mechanical work) turn the plan into the whole film rough, with the hook moving.
- Run the self-review before CB (2 fps review + numbers: camera rests, overlaps, effects, light, cuts) and the frame checks.
- The gate package goes in `episodes/<film>/gate/`: GATE.md (what works, known weak list, tokens so far, the one question), the board sheets, hook_moving.mp4, NUMBERS.md. Then STOP and report to CB. After CB's yes: build-out, sound (library first), grade, join, YOUTUBE.md (Rick-style 3-6 word title), the final in `final/`.
- Never show CB an old test sheet. Write a short HANDOFF.md section for your film and keep STATE.md current. Target about 450 M tokens for the whole build; report the tokens at the gate.

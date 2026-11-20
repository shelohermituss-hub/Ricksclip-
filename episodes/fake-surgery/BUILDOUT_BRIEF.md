# Fake surgery: BUILD-OUT brief for every stretch builder (lead, 2026-11-16; CB said "Yes, build out" at the gate)

CB approved the gate (gate/GATE.md). This round turns each stretch's approved board into its FULL MOVING TAKE, polished, autonomous to the final. THE APPROVED BOARD IS THE FLOOR: every polished frame keeps every story element its board panel shows (props, characters, the gag, the named thing) and the light of its place; check board beside polish before you report (CB_RULES 11a.3).

## Frames (30 fps; film frame numbers; render 12 HANDLE frames before and after your range for the join blends)
| S | film frames | render | rows |
|---|---|---|---|
| S1 | 0-374 | 0-386 | 1-10 |
| S2 | 375-777 | 363-789 | 11-20 |
| S3 | 777-1289 | 765-1301 | 21-30 (hard cut 2 at 1290 belongs to S4's first frame) |
| S4 | 1290-1683 | 1278-1695 | 31-39 |
| S5 | 1684-2229 | 1672-2229 | 40-50 (the film runs to f2229 = 74.3 s: after "missed it" the FREEZE + slow push holds to the end; the last 12 frames will be blended into frame 0 for the loop) |

## Read (in order, nothing more)
1. `rules/dept/stretch-builder.md`.
2. Your `s<N>/STATE.md` (all rounds) and `LEAD_QUEUE.md` (Decisions, ALL STRETCHES, your S-section, the BUILD-OUT section at the end).
3. `gate/GATE.md` "Known weak" (your items are in LEAD_QUEUE BUILD-OUT), `PICTURE_PLAN.md` your rows + the ADDED section + the CB notes at the end.
4. Pattern for a full-take render (list first, read only what you need): `episodes/monopoly-escape/s3/final/` (render_final.py, make_final.py) and `s3/STATE.md` "The ONE command".

## Rules
- Render ALL frames of your range at 1080x1920 into `s<N>/final/frames/f_<filmframe 5 digits>.png`, through `bash ../tools/gpu_render.sh` ONLY (the shared fair GPU queue; never render_gpu.mjs directly). Split into calls of at most about 150 frames; run long calls in the background (one command per cycle; never poll or sleep-wait).
- Board is the floor; colour per LOOK_BIBLE and PLACE_KEYS (ungraded sat >= .36 film, .30 day; NI mean >= .31; red only on rows 34, 36-38 by the red gate; mouths exempt).
- Camera: one flying take per place: fly, land, rest, fly on. INSIDE your stretch the plan's joins (PICTURE_PLAN "ONE FLYING TAKE") are flights or dissolves on motion, never chopped inserts. Hard cuts in the whole film: only 30.9 s (S3, new day) and 43.00 s (S3 -> S4 boundary). Every POWER moment as directed (hold, impact frame IN THE RENDER, crash zoom or freeze, abstract field, camera shake 3-8 f on the hit frame, settle). Write each impact frame and each power hit frame into STATE.md (the sound and the join need them).
- Every act a motion-library move on the newest studio curves (motion gate 0/0/0/0), round black fists on the objects, held3d hand "L", arms one slight curve, every foot on a surface, faces change on the word, the nurse's lips move with her quote.
- Frame checks: `timeout 420 node ../../../tools/frame_checks/check.mjs film.json` = 0 FAIL except named waivers (r5/r32/r43 knee closes, the reclined patient under the drape, the grandkid on the shoulders). `python ../../../tools/frame_checks/flicker.py final/frames` PASS (only planned hard cuts / impact frames).
- Deliver in `s<N>/final/`: frames/, preview.mp4 (your range + voice, 1080 or 720 wide), strip_2fps.jpg (small), numbers.txt (sat, mean, red px per second), and update STATE.md (max 60 lines: the ONE command, frame range, impact/hit frames, joins, numbers, weak). Report in at most 20 lines.
- Self-review before you report: look at strip_2fps.jpg (at most 1600 px wide) beside your board sheet once; camera rests, overlaps, effects, light, cuts.
- Hard cap 100 minutes of work. If renders queue, start them early and finish the rest while they run. Never stop another film's processes.

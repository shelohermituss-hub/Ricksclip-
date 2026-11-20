# fake-surgery STATE (writer, script v1, 2026-11-16)
Built: SCRIPT.md v1 (16 lines, elevator table format, beats, per-line effects + gags, cast, places/light, twist pick + alternative),
voice/voice_text_v1.txt (35 tagged clauses, 2-4 tags each, the nurse's quote = same narrator, dry/whispering tone only).
No voice recorded, nothing rendered (waits for CB's OK on the script).
Numbers: 228 words (band 200-230), about 63 s at 3.62 w/s; hook 19 words; "You see" at word 161 = 70.6 % (Rick median 69.35 %).
Hook: "A surgeon cut three tiny holes in a man's knee, splashed some water around, and stuck on three plasters."
Mocker: nurse, "Doctor, you forgot the operation."  Twist: "Turns out the nurse was right. He forgot the operation, and the patients never missed it."
Change from the 5-s board: "sewed him up" -> "stuck on three plasters" (FACTS row 7; stitching not sourced). Set dept: blue X stitch -> 3 plasters.
Open / unsure:
- Line 5: a colleague's question as narrator paraphrase (true per Hidden Brain); colleague shown as a hand only.
- Line 13 "Being sure you're fixed can make a knee hurt less": general placebo claim, kept soft; all three groups improved.
- Line 16 "never missed it": true for the trial's patients; Medicare line limits it to arthritis knee pain.
- Line 10 patient on the stairs is a cartoon stand-in for the sham group, not a quoted real patient.
- Cast needs a third puppet (patient, lean, plain cap, no logo); the board has surgeon + nurse only.
Next: CB reads the script; then the voice take (pace 1.0) and voice/words.json; then PICTURE_PLAN.md and CAST_PERSONALITY.md.

## 2026-11-16, picture plan (writer)
Built: PICTURE_PLAN.md, 50 rows from the approved voice (voice.wav 73.62 s, words.json). Nothing rendered.
Numbers: shown 49/50 = 98 %, CLOSE 12/50 = 24 % (under Rick's 40 % on purpose: kid safety, story-clock rows).
Marks: HOOK 1, TWIST 35, SIGNATURE 43 (kid's plaster in the hook's knee-close framing, 61.42), LAST FRAME 50.
Stretches: S1 0-12.50, S2 12.50-25.90, S3 25.90-42.70, S4 42.70-56.10, S5 56.10-73.62.
Knee readability rules written (size, no bloom, dot/plaster sizes, phone check). Bloodless: X stitch + needle holder dropped.
Open for lead/CB: no LOOK_BIBLE yet; ONE red = pain (dial + bars) needs bulb -> grey-blue, IN USE light -> amber;
5 sets (OR built; corridor, office, stairwell, waiting room new); patient puppet (lean) still to build;
loudness-curve checks: "Doctor" 10.34, "surgeons/scrape" 15.24, numbers 13.34, 22.70, 26.42, 28.04, 29.30, 64.48; caption "no better".

## 2026-11-16 13:00, BUILD PHASE (lead session 6076479e, from BUILD_BRIEF_waitlist.md)
- Done by the lead: PICTURE_PLAN.md "ADDED 2026-11-16" (11e-g: last frame re-staged on the stairs, 7 EXTREME, 5 anime power moments, 2 POV, 2 impossible views, words in the world, 2 hard cuts + flights) and "THE PATIENT IS A FULL CHARACTER" (CB: "use patient also chracter"); backup PICTURE_PLAN_pre11eg.md.bak.
- LOOK_BIBLE.md v1 (6 light kinds OR/CO/NI/AF/GR/EV, ONE red = pain, red gate), sets/world.js, sets/README.md (owners), BOARD_BRIEF.md (stretch builders), tools/gpu_render.sh (shared fair queue wrapper), s1..s5 with junctions sets/cast/voice.
- Copied: sets/power/ (library), sets/soft_arm.js, sets/or_room.js + or_props.js, cast/sheets/surgery.mjs, moves/ep_surgery.mjs (from hooks_v3).
- Phase A running: look pack + PLACE_KEYS + OR port; cast (patient puppet reclined); hero props. Phase B running: corridor + office; stairwell + waiting.
- Next: 5 stretch builders (BOARD_BRIEF.md), then self-review, gate/ package, report to CB.

## 2026-11-16 15:55, THE GATE PACKAGE IS WITH CB (lead session 6076479e)
- gate/: GATE.md (works, known weak, cost, the question), board_part1-4.jpg (126 key frames, rows 1-50), line_check_s1-s5.jpg, hook_moving.mp4 (0-12.5 s, 1080x1920, voice + captions), hook_strip.jpg, NUMBERS.md, PICTURE_PLAN.md, make_gate.py.
- Stretches s1..s5: each has STATE.md + ONE command (run.sh). Shared: sets/ (look_pack, or_room [S1], corridor/office [S2], stairwell [S4], waiting [S5], hero_props, s3_wrap, s4_office), cast/ (patient = full character, reclined), LEAD_QUEUE.md (all lead notes).
- CB note in this phase: "use patient also chracter" (done); frame 0 "lay on bed in 3d space position with knee more up" (done in S1 round 5, still soft; S3/S5 OR rows to follow).
- Tokens at the gate: 263 M, 2.8 h, 23 helpers. Waiting for CB's yes/no.

## 2026-11-16 18:40, FINAL v1 DELIVERED (CB: "Yes, build out", then "create end to end"); waiting for CB's approval
- final/fake_surgery_v1.mp4 (+ _small): 1080x1920, 30 fps, 74.33 s (2230 f), mix v2 -14.0 LUFS / TP -1.9, loops into frame 0; decodes OK. Copies: Downloads\FINAL\the_surgery_that_did_nothing_v1.mp4, <your backup folder>\fake_surgery_final_2026-11-16\ (+ YOUTUBE.md). YOUTUBE.md in the film folder.
- Rebuild: each sN/STATE.md has its ONE command (frames in sN/final/frames); join: `cd join && python join.py v1 --grade ../grade/grade.py --force` (CPU ~30 min; EDIT_LIST.json = joins 375/777/1684 blends, hard cuts 927 + 1290, in-take dissolves s3 974->986 and 1058->1072, deflicker ranges, loop 12 f). Sound: sound/mix.py v2.
- Known weak: r43 kid knee (boomerang leg, nurse arm reads as a pipe); r32 knee reads as a tube; r21-22 fist not on labels; r29 jug small; deflicker skipped (>15 %) at s2 535-536/553/585 and s4 1499-1502; thumb-step detector 13 unplanned flags, mostly the planned fly-throughs (clock, porthole, CRT in/out, POV); S4 luma steps tied to camera pose (cause not found); one pink hair bobble trips the red gate in r50.
- Cleanup (delete frame folders, _test, board frames, caches, v0) waits for CB's approval of the final (CB_RULES 11a).
- Tokens: 415 M for the build phase (gate 263 M), 5.6 working hours, 38 helpers.

## CAMERA FAULT FOUND AFTER FINAL v1 (CB: "whats wrong why the camere is so uncontrolled and too fast?")
- check_film.py on v1: rests 6.3 per 10 s (Rick 3.1), travel p90 1.06 s (Rick 3.0), camera "cuts" 6.7 per 10 s (target <= 0.9), speed median 1.3 px/f with p90 23: park -> 0.5 s hop -> park. 81 camera stations in 74 s (about one per plan row); film_plan.py check on s3: longest travel 0.73 s, dead still 87 %, speed peak 1038 px/f (station teleports).
- Cause: the builders placed one station per picture-plan row and never ran `tools/film_plan.py check` (the camera gates); the lead briefs did not require it and no camera-director pass was run. Fix = camera-director pass per stretch (one flowing take per place, about 3 rests per 10 s, travels 2-5 s, creep on rests, no teleports), film_plan.py check 0 FAIL before render, then re-render + rejoin.

## CB REVIEW OF FINAL v1 (2026-11-16, after "leave it like now")
- patient should be a fainted meme (sleeping); splash weak; 6 s lines (bag crinkle overlay); 15-20 s zigzag camera + sliding characters; 36 s white fog (porthole flight haze); 45 s human leg (3D skin leg; we have black line legs); 55 s horror (dark coffin-like case close, fast camera, half head); 57 s aura makes no sense; 62 s human arm on the plaster slap ("we dont have human body in our clips").
- Saved as memory rules (no human body parts; meme states + readable effects; camera plan gate).

## FINAL v2 (CB: "Yes, fix this film"), 2026-11-16 night
- final/fake_surgery_v2.mp4 (+ _small): 74.33 s, sound/mix_v3.wav -14.0 LUFS / TP -1.8, loops. Copies: Downloads\FINAL\the_surgery_that_did_nothing_v2.mp4, <your backup folder>/fake_surgery_final_2026-11-16/.
- Camera (check_film, whole film) v1 -> v2: rests 6.33 -> 3.63 per 10 s, travel p90 1.06 -> 2.7 s, speed median 1.32 -> 4.66, speed p90 23.95, whips 9.69 -> 0.81 per min; cuts 6.73 -> 2.56 (planned impacts, dissolves, 2 hard cuts; unplanned detector hits 1087, 1525, 1596, 2165).
- CB notes done: patient knocked-out meme + zZ (S1/S3/S5), big blue splash, scope on the tray (no streak view), no white fog, no 3D human limbs (line legs, round fists), no sliding, bright scope case, thought bubble with a ticked knee instead of the aura, speech bubble for the colleague.
- Weak: row 32 knee close frames the patient from the waist down (head out of frame on purpose); row 43 the plaster on the boy's knee is small; the inside-CRT and POV-glasses views were dropped for a calmer camera; mix v3 not listened to by ear.
- Tokens: 585 M for the whole build phase (gate 263 M, v1 415 M, v2 fix 170 M), 8.8 h, 52 helpers.

## FINAL v3 (CB: "Yes, fix all" on ISSUES_v2), 2026-11-17
- final/fake_surgery_v3.mp4 (+ _small), 74.33 s, mix v4 -14 LUFS. Copies: Downloads\FINAL\the_surgery_that_did_nothing_v3.mp4, OneDrive. Per-item status: ISSUES_v2.md "STATUS IN v3". Rebuild: each sN/STATE.md v3 section + join/FINAL_v3.md.
- Shared new: sets/water_fx.js, sets/zzz_fx.js (FX_README.md), env_v3 key in all five sets (STATE_env.md, STATE_env2.md).
- Tokens: 727 M total for the build phase (v3 round about 140 M), 64 helpers.

## FINAL v5 (CB: "the nurse and kid still in the chair ... patient in hall way also have half of the head ... i dont want have stupid mistakes like this"), 2026-11-17
- final/fake_surgery_v5.mp4 (+ _small), 74.33 s, mix v4 -14 LUFS; v3/v4 deleted. Copies: Downloads\FINAL\the_surgery_that_did_nothing_v5.mp4, OneDrive.
- Fixed: nurse no longer inside the waiting-room chair (that seat removed), boy on the seat (front row moved back), hallway gurney patients whole (camera no longer swings them in through the edge; the handrail behind them removed), nurse/table, surgeon/cabinet, every half head found by the STRICT every-frame check (check.mjs --all-frames --no-body) in all 5 stretches: 0 head_cut / body_side / face_covered FAIL left except allowed walk-ins (patient leaps in at 0:44, <= 4 f) and frames inside dissolves.
- New: one planned hard cut S1 f279 ("whispers"), so 3 hard cuts in 74 s.
- Left: the boy's seat check reads his hips 2-3 cm above the seat (25 %), he looks seated by eye; S4 climbers bunch in the wide; flicker steps only at planned cuts/impacts.
- Rules: FIX_BRIEF_v4.md (+ v4b strict check); memory feedback-no-waived-overlaps.

## FINAL v6 (CB on v5: hallway patients floating/too big/half head; "we made some test before people ly on bed ... why dont take from it"), 2026-11-17
- S2 hallway patients now lie on their backs on flat gurneys via the film.js lying path from the bed test (templates/threejs_film/test_lie_legs3d.mjs, _pose_review/bed_poses_v5.png), high 3/4 camera, heads on pillows, whole. final/fake_surgery_v6.mp4 (+ _small, _phone 12 MB). Copies in Downloads\FINAL + OneDrive.
- Gap: tools/film_plan.py bake drops the act keys lie_yaw/lie_lift; lying patients hold a static lie_back pose (no motion move on the lie path yet).

## APPROVED v6 by CB 2026-11-17 ("Approve v6"). The fake-surgery film is DONE.
- Kept: final/fake_surgery_v6.mp4 (+ _small, _phone), scripts, STATE/briefs/ISSUES, sets, cast, voice, sound, join/grade code, YOUTUBE.md. Deleted: all frame/raw/handle folders, join caches, sound stems, old versions v1/v2 and old sheets (folder about 0.9 GB). Final decodes OK. Frames re-render from each sN ONE command.

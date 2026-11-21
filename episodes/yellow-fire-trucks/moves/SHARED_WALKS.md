# SHARED_WALKS: locked-feet place changes for every stretch (animator, 2026-11-21)

Files: `moves/shared_walks.mjs` (the moves + the USES table), `moves/tools/make_acts.mjs` (writes `moves/shared_walks_acts.json`),
`moves/tools/check_motion_ep.mjs` (gate copy), `moves/tools/probe_px.mjs` (card px per metre of each cast member), gate output `moves/out/motion_gate*.txt`.

## NOT done
- Picture proof: no 4-fps strip was rendered with the real puppet (time box over). Gate numbers only. `_test/` is empty.
- frame_checks slide row not measured in a render (the method makes it 0 for the across part by construction; it must be proven).
- S5 climb: the voice gives 1147-1177 for the climb; at one tread per step the Clerk reaches +1.5 m (tread z 2.22), NOT the 3x at z 5.52.
  The lead must choose: start the climb before "hit", put the chalk 3x lower, or cut away (camera) for the middle of the climb.

## How it works (read before pasting)
- The card is NOT moved by a film_plan tween. One act per frame puts the card where the body is (pos, move_s 0.0334, linear). An act at `at`
  lands the card at `at + 2`. The move draws the feet at (foot world - body) in card px, so a planted foot keeps its spot across the picture.
- Depth (toward / away from the lens) cannot be undone on one card. Runs and the burst put 65 % of it on flight frames (both feet up) and
  35 % on planted frames; walks carry it with the body. That depth part is NOT checked by frame_checks. It is listed below per use.
- Do NOT put a `face` key in the act that sets the pose (film_plan would start the body one frame late, and the card would be one frame ahead of it).
  Put the face in its own act on the same frame or later.
- Each stretch must link the file: `ln -s ../../moves/shared_walks.mjs <stretch>/moves/shared_walks.mjs` (puppet_pkg 'moves' copies it into the cache).
- Paste in make_film.py (after `acts = [...]`):
  `acts += json.load(open(os.path.join(EP, 'moves', 'shared_walks_acts.json')))['<use>']`, and remove the old glide act named below.
- After editing USES: `node moves/tools/make_acts.mjs`, then the gate (both exports), from `episodes/yellow-fire-trucks`:
  `GATE_SHEET=firetrucks.mjs GATE_MOVES=shared_walks.mjs node moves/tools/check_motion_ep.mjs`.

## Uses (frames from voice/words.json; numbers printed by make_acts.mjs)
| use | stretch | who | frames | path | across / depth | max card step across / depth | remove |
|---|---|---|---|---|---|---|---|
| s1_ch_burst | S1 | chief | 157-171, hands back to `m:../../ep_s1/ch_burst@5.7` at 171 | [3.0, 20.15] -> CHIEF [2.45, 19.1] | 0.10 / 1.18 m | 1.4 / 29.1 cm/f | nothing (the chief act at 157 stays: visible true) |
| s2_he_walk | S2 | hero | 289-333 (still hidden at 322 as now) | [2.95, -2.15] -> [2.6, -3.2] | 0.31 / 1.06 m | 1.3 / 4.5 cm/f | act at 289 (pos, move_s 1.0); the hero's first act must have pos [2.9576, -2.1552, 0.02], dir 1, view side |
| s6_kid_run | S6 | kid | 1408-1438 | [36.9, -12.8] -> [36.35, -10.35] | 1.06 / 2.28 m | 6.7 / 22.5 cm/f | act at 1418 (pos, move_s .4); the 1445 step-over is NOT built yet |
| s7_cv_march | S7 | chiefVisitor | 1647-1690, hands back to `m:../../ep_s7/cv_s7@3.8` at 1690 | CH0 NEW [6.82, 9.89] -> CH1 [5.75, 9.35] | 1.17 / 0.28 m | 4.9 / 1.2 cm/f | act at 1672 (pos CH1, move_s .25); CH0 in make_film.py -> [6.8127, 9.8883, 0.12] |
| s5_cl_climb | S5 | clerk | 1147-1211 (top 1177, hat tip 1183-1203) | from tread z 0.72 up 5 treads to z 2.22 | vertical | 5 card jumps of one tread | acts 1150-1162 (rung glides) |

Acting in each move (STUDIO MOTION, all on ones, snap curves, dead still at the end):
- S1 burst: anticipation crouch 8 px, three planted foot moves at 3 f (half stride, full stride, closing), lean 10, fists pumping, flight hop 12 px;
  lands in ch_burst's own f171 crouch (y 14, rot .4, head -6, fists at the hips) so the hand-back has no pop. Burst ON "chief" (163).
- S2 walk: the hero's long calm stride, 12 f per step (STUDIO_MOTION normal), upright (lean 2), arms long and loose, no bob beyond the leg geometry.
- S6 run: 2 f crouch, 5 steps of 4 f, lean 14, fists pumping, flight hop 8 px, skid back -5 deg ring at the stop, head tilts 8 (her "stop with the head tilted").
- S7 march: the Chief's proud stomp, high knees (lift 40 px), thumbs in the belt (cv_s7's own hands), chest out (lean -4), a 6 px stomp dip on every plant;
  the last plant lands ON "firetruck" (f1678 = g 31); settles to rot -4 / head -3 = cv_s7 at 1690.
- S5 climb: three stages of two steps (4 f each), a 4 f pause between stages, the opposite hand reaches two rungs as each foot steps,
  hips never above the reach of the lower planted foot, the hat tip at the top (knuckle to the brim, 6 f after the last step), the look up.

## Gate numbers (moves/out/motion_gate.txt side, motion_gate_front.txt front / 3/4)
All five uses, both exports: twos 0, linear 0, no_settle 0, creep 0, planted foot slide 0 px, arm over-reach 0 px, leg stretch 0 px.

## Weak points (my own list)
- Not seen in a picture yet. The 3/4 and front exports are the side math with the view changed (feet ft.x the same).
- Depth part per frame: burst 29 cm/f and Kid 22.5 cm/f on flight frames (the card jumps toward the lens while both feet are up): may read as a pop.
- S2: the walk is 1.1 m, not the whole Main St crossing (4.6 m in 33 f would be a 4.2 m/s jog, against his "never hurried" rhythm).
- S7 needs CH0 moved 0.97 m (it sat 0.8 m off the camera's across axis).
- Ladder: the card depth changes 5.6 cm per tread (the ladder lean) on the jump frames; the climb is fast (4 f a step) and short (see NOT done).

## LECONS (LECONS_TECHNIQUES.md format; the lead copies)
## 2026-11-21 — A card tween cannot carry a walk: the feet glide (yellow-fire-trucks, shared walks) — OUVERT
- Problème : four place changes glided (S1 33 cm/f, S2 15 cm/f, S7 1.9 m in 8 f, S6 run) and the S5 climb rose on 3-frame glides.
- Cause réelle : the card travels by film_plan's pos tween, while the move draws its feet in card px; nothing ties a planted foot to the world.
- Correction : moves/shared_walks.mjs draws feet at (foot world - body) and make_acts.mjs writes one card-position act per frame (at -> lands at+2).
- Garde-fou : the motion gate with `_walk.travel` (planted foot slide in world px) on both exports; frame_checks slide row after the render.
- Preuve : gate 0/0/0/0, slide 0 px on 5 uses (moves/out/motion_gate*.txt). Picture proof NOT done: OUVERT.
## 2026-11-21 — A `//` comment inserted mid-line ate the rest of the statement (shared_walks.mjs) — FERMÉ
- Problème : "Unexpected token export" after a patch. Cause : the comment was placed before `inc[g] = d; ...` on the same line.
- Correction : the comment on its own line. Garde-fou : tools/check_midline_comments.py (0 suspect lines). Preuve : gate runs.
## 2026-11-21 — Rig arm length differs between the kit and the gate (shared walks) — FERMÉ
- Problème : 9-21 px arm over-reach in the gate on the pumping fists. Cause : the gate's ch.armL is x1.06, the kit's x1.24, and the shoulder turns with the lean.
- Correction : reach() pulls each fist to 96 % of ch.armL from the leaned shoulder of the drawn view. Garde-fou : gate contact row. Preuve : over-reach 0 px.

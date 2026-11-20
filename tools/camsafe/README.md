# CAMERA-SAFE CHARACTERS (2026-11-16, CB thread "Build camera-safe 2.5D character rig")

CB pasted an outside plan for a "camera-aware 2.5D rig" (torso and face turned a little toward the lens, view drawings, a shot validator).
We measured our real kit first with a turntable (7 angles x high/eye/low x standing/sitting/walking/holding) and built only what was missing.

## What our rig already did (nothing to build)
- **No thin or cardboard bodies.** A card always turns to the lens AND tips to it (film.js, CB 2026-11-10 "never squash"), so its width never
  shrinks with the angle. The plan's "turn the torso 15 deg / face 25 deg toward the camera" would SQUASH the card, which VIEW RULE 1 forbids. Not built.
- **View drawings per angle.** tools/film_plan.py apply_looks picks front / 3/4 / side / back from where the lens stands, with 6 deg hysteresis.
- **Contact checks.** tools/frame_checks/check.mjs (feet, seat, overlap, slide, prop in hand, body in mesh).

## What the turntable showed was broken (all fixed, with film.json "camsafe": true)
| fault | cause | fix |
|---|---|---|
| a WALK or SIT seen from behind showed his FACE (side drawing) | library moves have only side + front drawings; a back view fell back to the side drawing | puppets.mjs camsafeView: back = the move's front drawing with the back of the character |
| a walk at 3/4 drew the full front | same | 3/4 = the front drawing with the face parts moved (VIEW RULE 2) |
| sitting on a chair: 3D legs point sideways, body drawn front (45-90 deg) | apply_looks cheats standing figures open to the lens; the 3D legs show the true direction | film_plan.py: sit_chair / sit_floor take the true view; the card has no legs, so any view fits |
| high camera: chair back cut across his chest, hips off the seat (18 cm) | the card tips about its FEET | film.js: a seated card tips about its SEAT and is scaled toward the lens by its lean (same place and size on screen, depth in front of its own chair back; not when seen from behind) |

## Files
- `templates/threejs_film/puppets.mjs`: `camsafeView`, `drawnView`, `faceMode` (only with `st.camsafe`; stateKey gets a `cs|` prefix then).
- `templates/threejs_film/film.js`: `camsafeSt`, contact pivot + depth nudge, `seatH`, `facingOf`, `window.camsafe(f)`.
- `templates/threejs_film/render.mjs`: `--camsafe [a-b] [--step n] [--camsafe-out file]` writes out/plan/camsafe.json.
- `tools/film_plan.py`: `LEGS3D_MOVES`; apply_looks true view for them and hysteresis reset on a cut (only with camsafe).
- `tools/camsafe/validate.mjs`: THE SHOT VALIDATOR (one command, numbers only, exit 1 on FAIL).
- `tools/camsafe/turntable.py` + `turntable_sheet.py`: the turntable test for any preset (`--orbit` = one continuous camera move round him).

## Use
```
film.json: "camsafe": true                      (new films; old films without it render pixel-identical)
node tools/camsafe/validate.mjs <film.json> [--frames a-b] [--step 2]     before CB sees a version, with frame_checks
python tools/camsafe/turntable.py <dir> --puppet cast:<sheet>/<name> --height 1.75 --pkg episodes/<film>/cast --camsafe
node templates/threejs_film/render.mjs <dir>/film.json --frames all-84 --no-captions --camsafe   (or validate.mjs <dir>/film.json)
python tools/camsafe/turntable_sheet.py <dir> --tag after
```
Flags: RIG_ERROR, VIEW_MISMATCH, FACE_BEHIND, LEGS_DISAGREE, SEAT_DRIFT, STEEP (warn > 62 deg down, fail > 75), LOW (warn > 40 deg up),
FACE_HIDDEN (talks with only the back drawn), FLICKER (view changes again within 8 frames without a cut), MEME_SIDE (side view with a meme face:
the face slides, it is not a profile). Each prints the least disruptive fix first (move the camera a little, then switch / add a drawing, then change the act).

## Proof (2026-11-16, cloud copy of the PC kit)
- Turntable sandy (monopoly cast, thin): camsafe OFF 31 of 84 FAIL (VIEW_MISMATCH 24, LEGS_DISAGREE 15, SEAT_DRIFT 14); ON 84 of 84 PASS.
- Continuous orbit, walking, 240 frames: 6 view changes, no flicker, 0 FAIL.
- Presets with camsafe ON: monopoly otto (fat, long coat), towerguard, form:kid, form:standard, cast:jack 84/84 PASS; form:lady and cast:cowboy
  12 MEME_SIDE warnings (their faces are meme faces); stationmaster RIG_ERROR on every move (he cannot play library moves at all: known old demo character).
- film_example rendered with the old and the new kit (seeded): 10 frames, 0 pixels differ. check_views PASS 5 characters x 6 views.
- frame_checks seat rows on the sitting turntable: before WARN body_in_mesh 4 % (it did not catch the chair back across his chest), after 1 %.

## Not done / open
- Moves with a FRONT drawing only cannot give a side view (validate says so). Moves with a SIDE drawing only and no front (walk/sad, skip,
  pace) use the side drawing at 3/4 and front angles: VIEW_MISMATCH shows where.
- A view change is a clean switch of drawing (no in-between; a blend would be morphing). Hysteresis keeps it from flickering.
- The depth nudge is for seated cards only. A standing card under a high camera also leans back; frame_checks body_in_mesh still watches that.

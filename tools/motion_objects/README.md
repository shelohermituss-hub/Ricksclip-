# motion_objects: is the moving film fluid? (user rule 2026-11-22, "fluid like a video game")

Guards the rule: every moving thing (characters, held props, set pieces, the camera) moves on EVERY frame with eased, continuous motion. No zero-then-jump (on twos or threes), no frame step above the move's own speed, no pose pop, no camera hitch. **A version with a FAIL is not sent to the user.**

## Run

```
node tools/motion_objects/check_objects.mjs <film.json> [--window a-b] [--step 1] [--all] [--puppets dir,dir] [--out dir]
```

- Needs the baked plan beside the film (`out/plan/camera_baked.json`).
- One `render_gpu.mjs` page session (its `--eval` hook, `page_objects.js`). The draw call is switched off: no pixels. Measured here: 4-5 ms per frame, the 460-frame example in 4 s.
- Writes `out/motion_objects.json` beside the film (`summary`, `table` = one row per track, `events` = every FAIL / WARN). `--out <dir>` puts it elsewhere.
- Exit code 1 on any FAIL, 0 otherwise, 2 when it could not run.

## What is recorded, per frame

- CAMERA: position, quaternion, fov.
- Every character card: `who.feet` (the card's ground point), `who.head` (the kit's head centre), `who.handR` / `who.handL` (the kit's `window.handWorld`, the same source as `--hand-world`), and the pose name.
- Every scene object with a name whose own matrix, visibility or opacity changes in the window: position, quaternion, scale, visible, opacity. A child that only rides on a named moving parent is dropped; children of a moving parent with no name are shown once ("+N moving with it"). Held 3D props (`held3d`) show up here by their group name.

## The rules and the numbers (all per frame of the film)

| rule | level | when |
|---|---|---|
| `HELD` | FAIL | 1 to 3 frozen steps (under 0.02 mm and 0.002 deg) between two moving steps of the same shot, going on the same way after the hold, both over 0.5 mm/frame (hands 2 mm) or 0.05 deg/frame and over 25 % of the median speed around. = motion on twos, threes or fours. Only with `--step 1`. |
| `JUMP` | FAIL | one step over 4x the median of the 12 steps around it (6 before, 6 after, same shot) AND over the floor: card 2 cm, hand 4 cm, object 2 cm / 3 deg / 10 % scale, camera 1 cm / 0.5 deg / 0.5 deg fov. A hand JUMP on a frame where the pose name changes says "(pose pop)". |
| `KICK` | WARN | a camera JUMP on frames the plan marks `kick` (a wanted impact shake). |
| `POP` | WARN | a thing turns visible or invisible inside the camera frame and its scale or opacity is not under 80 % of what it is 3 frames later (no ramp). |
| `CUT` | listed | plan cuts (take or place change, `cut` flag) and camera teleports the plan does not declare (over 0.5 m or 20 deg in one step and over 8x the median): printed as "NOT IN THE PLAN". No rule is tested across a cut. |

The table: `frames` = frames where the track is visible, `moving` = steps where it moves (over 0.2 mm or 0.02 deg), `max cm/f`, `max deg/f`, then the counts. The CAMERA line above the table gives the share of frames where the camera moves. Under the table: one line per rule and track, the first event in full, then how many times and on which frames. Objects with PASS are hidden unless `--all`.

## Known blind spots (said plainly)

- It reads positions, not pictures. A drawing that changes inside a card without moving the hands or head (face, mouth, a prop drawn on the card, a leg cycle) is not seen. Pose pops are seen only through the two hand points.
- Hands of a standing character "move" on most frames because the card turns to the lens; that is counted as moving, so a frozen pose under a moving camera is not reported.
- Effects driven by shader time, particles, sprites sheets, textures that scroll, instanced copies (`InstancedMesh` instance matrices), skinned bones and morphs: not tracked. Only Object3D matrices, `.visible` and material opacity.
- HELD needs the hold to be exact (same numbers). Motion slower than 0.5 mm/frame (1.5 cm/s) on twos is not reported; a hold of 4 frames or more is read as a stop and a new start.
- JUMP compares a step with its 12 neighbours: a move that is fast and rough all along (every step big) has a high median and passes. A linear start with no ease-in passes (first step = the move's speed). Easing quality itself is not graded.
- An undeclared cut is only listed, not failed; a real hitch over 0.5 m is therefore listed as a detected CUT, not as a JUMP: read the CUT lines.
- A camera kick is a WARN, not a FAIL, because the plan asks for it.
- Objects without a name are counted (`changing_without_name` in the json) but not tested.
- With `--window` starting late, set scripts that keep state from earlier frames may behave differently from a full run.
- The three.js stage only: a Blender pass that moves something is not seen.

## Proof (2026-11-22)

- `templates/film_example/film.json`, 460 frames, 4 s: CAMERA PASS (moves on 99 % of frames, the kick at f105 is a WARN), 24 FAIL, 1 WARN: the kit swaps poses in one frame (hand JUMPs of 13-71 cm with "pose pop" at f25, f105, f184 ...) and the kid's slide starts with a 20 cm step at f322 (the same slide frame_checks reports).
- A broken copy (lady slid on threes f20-50, kid teleported f60-80, master teleported f100-110): `HELD lady.feet f24-25 ... motion on 3s [9 times]`, `JUMP kid.feet f60 1092.5 cm [f60 f81]`, `JUMP master.feet f100 200.0 cm [f100 f111]`, `JUMP test_stick f100` (his held prop). Exit 1.

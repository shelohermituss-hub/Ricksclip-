# STRETCH BRIEF (lead, 2026-11-22): staging one place of astro-flush-study in the three.js kit

Private exercise: we reproduce the first 40 s of a Rick video shot for shot (camera, acting, timing on the same frames). His frames,
video and sound stay in `references/look_match/astro_flush/` (git-ignored): never copy them outside it.

## Read (and nothing more, unless a tool's own README is needed)
- This file; your shots' sections of `refs/SHOT_BOARD.md` (camera rows per 0.5 s, acting frames, joins, captions); `cast/CAST_KEYS.md`
  and `cast/cast.json`; your place's `sets/<place>/STATE.md` + `out/<place>_meta.json` (anchors, cams fitted to his frames, movers, states)
  and `sets/<place>.js`; `rules/dept/stretch-builder.md` for the kit keys. Not CB_RULES.md, not SKILL.md.
- film.json examples: `templates/film_example/film.json`; with a GLB set, held props and episode moves: `episodes/plane-eater/s2/`.
- Reference: `references/look_match/astro_flush/ref/all/f_%04d.jpg` (540x960, file = frame + 1), `ref/ref40.mp4`, sound `ref/ref40.wav`,
  words `refs/words_ref.json`. The film is 30 fps; YOUR film.json frame f must equal the reference frame f (start your film at the
  first frame of your shot with an offset key, or pad; say which in STATE.md).

## What to build: `shots/<name>/film.json` (+ moves/, STATE.md)
1. CAMERA: reproduce his camera of every shot from the board and the set's fitted cams: same framing at the start, at every 0.5 s row and
   at the end; it never rests (push or drift under every hold), eases in 4-6 frames and out 6-10, reverses without stopping.
2. ACTING on his frames: every pose and expression change on the frame the board gives, snap in 2-3 frames (never 1: a 1-frame pose
   change is a pop), then hold 10-40 frames with a weightless float (slow bob 2-4 cm, slight tilt) so nothing is ever frozen; mouths move
   on his speaking frames. Characters in his screen positions and sizes (measure head height in % of the frame against his frame).
3. MOVERS: every set object that moves is animated BY NAME through the set module's states/keys on every frame (eased). You create NO
   geometry in the kit: if something is missing in the set, write it in STATE.md for the set builder (lesson of the last film).
4. JOINS between shots are handled by the lead (picture-in-picture planes fed with the neighbour shot's frames); you make your shot start
   and end on the exact framing the board gives for the join, and render 20 extra frames at each end where the board says the neighbour
   picture keeps playing.
5. CAPTIONS as his: white heavy sans, black outline, centred at 69-72% of the height, 1-3 words, hard swap 0-4 frames before the word.

## Checks, every cycle (all must be read, and FAILs fixed or explained by name)
- `python tools/film_plan.py check <film.json>` 0 FAIL before the first render.
- `node tools/motion_objects/check_objects.mjs <film.json>` (held / jump / pop per object and camera) and
  `node tools/collide/check_collide.mjs <film.json>` (nothing passes through anything; add the "collide" block for resting props).
- `node tools/frame_checks/check.mjs <film.json>` and `node tools/camsafe/validate.mjs <film.json>`.
- Render drafts at half size: `node templates/threejs_film/render_gpu.mjs <film.json> --scale 0.5 --grab fast` (software WebGL, 3-6 s a
  frame; first 3-4 key frames per shot with `--frames`, look at them BESIDE his frames, only then the moving draft). One render at a time.
- Moving draft: mp4 at 540x960 with his sound, and a side-by-side mp4 (ours | his) saved in
  `references/look_match/astro_flush/work/drafts/<name>/`. Then `python tools/measure/fluidity_clean.py` on OUR half and on HIS same
  frame range: report both rows (held, pops, jerk). Ours must not be worse than his.
- LOOK at a 4 fps strip of the side-by-side yourself and list what differs, worst first, before you report.

Do not commit. Time box in your task. If a tool or the set fails, stop and say so; no silent workaround.

## MOTION RULES FOR THIS FILM (2026-11-22, from the mc fluidity fix; LECONS_TECHNIQUES same date; reference: shots/mc/make_film.py, moves/ep_mc.mjs)
1. Camera: ONE travel per shot through its fitted cams as pass stations with `"hold": 0, "pin": true` (+ `"roll"`): the camera is ON each cam on its frame, speed continuous, no stop. Last station = the shot's last rendered frame, with `"travel"` = its length. No `travel_roll` with pins (put the roll on the pinned stations).
2. A shot that opens on a moving match cut starts its travel 10-15 frames BEFORE `start` (pre-roll station parked just behind the first framing), so the first frame already moves.
3. No rest-then-short-travel (a 13 f "settle" = a speed dip to 0 and a held frame): pin the cam instead.
4. Character moves (`acts` with `pos`): `"ease": "inout"` (eased start and landing) and at least 10 frames per metre-ish; never `move_s` under 0.3 for a lunge (his lunge builds over 12 frames).
5. Pose keys in moves: smoothstep over 6 frames minimum, starting 2 f before the key (ep_mc.mjs `snap`/`tr`); never a 2-3 frame fast-out snap (48 % of the move in one frame = check_objects JUMP).
6. Set movers by the set's `motion` block (sets/mc.js): screen cross-fades where HE fades (`screen_fade`), light colour eased into a new mood (`mood_fade`), objects rise by translation not from scale 0 (`box_rise`), hinged parts eased over 8-10 f (`cover`). Keep a hard swap only where his own frame swaps hard (1 -> GO screen, the red NO GO flash at f264).
7. Keep `"tween": {"ones": true}`; cards that appear behind furniture: make them visible a few frames before they rise.
8. Proof every cycle: fluidity rows ours/his on the same range (ours <= his on pops and jerk), check_objects FAIL 0 or each explained with his frame.

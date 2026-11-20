# STUDIO MOTION: the animation style guide (draft v1, 2026-11-11, waiting for CB's OK)

Why: CB asked what we can take from the "12 principles / studio animation" text, then sent five rules measured on a Rick film. This guide turns both into numbers that the kit plays and a check that measures them. Proof clip: `studio-motion/press_old_vs_studio_v1.mp4` (old library press left, new right, with sound). Curve: `studio-motion/strike_curve.png`.
Rick wins where the studio text and Rick disagree (CB Rule No. 1). Everything is in frames at 30 fps.

## 1. CB's five Rick rules, checked on Rick's own films

| Rule | What I measured | Verdict |
|---|---|---|
| 1. A new pose on every frame, no motion blur | "Town Built Around a Button": 0.3 % of 1966 frames repeat the one before; "Railroads": 0.4 % of 1800. No twos. | Holds. Our kit draws library moves on twos (every 2nd frame repeats): fix in the kit. |
| 2. Snap: 60-70 % of a move in the first 4-5 frames, then a slow settle | His button press, body tracked frame by frame: 5 % after f1, 16 % f2, 31 % f3, 48 % f4, **66 % f5**, 79 % f6, 88 % f7, then a slow settle to 100 % by about f16. The head is faster (79 % at f5) and overshoots about 8 % before settling. | Holds. Note it is not a pure ease-out: it builds speed for 2 frames first. |
| 3. Dead still when a character stops | After the press settles he moves 0.1-0.3 px per frame for 20+ frames, and that is the camera creeping. No breathing, no sway. | Holds. Clashes with tonight's "holds keep breathing" line (section 6). |
| 4. Faces change as a step | Breath-hold face to squeezed eyes in one frame (f1194 to f1195); one eye opens in one frame (about f1234). | Holds. Clashes with the kit's 8-frame face blend (`face_frames: 8`). |
| 5. Cut on the word | Not measured here (no word timings for his films on the PC). His press lands 0-2 f before the caption "presses" appears. Our baboon film already passes the new gate (every cut within 2 f of a word). | Taken as CB gave it. |

## 2. The 12 principles against our flat puppets in 3D sets (honest)

| Principle | We already have | Weak or missing | What changes |
|---|---|---|---|
| Squash and stretch | Head wobble pop rule | Cards may never squash (CB lock). Props never squash either. | Squash goes on PROPS and effects only (button cap, bell, ball, dust), volume kept, 10-12 f damped. The head pop stays the only "squash" on a character. |
| Anticipation | A few library moves wind up (button A, hammer) | No system; the kit's pose change goes straight A to B | Every strike gets a counter-move: 25-35 % of the strike distance, the opposite way, 6 f, then a 4-10 f hold. (Rick: 13 px back over 6 f before a 40 px press.) |
| Timing and spacing | Word-anchored beats, 7 f tween | One timing for everything; library moves on twos; reaches in slow ease-in-out (button A takes 1.6 s to reach) | `snap` curve for every pose change, holds as long as the story needs, all on ones. |
| Follow-through and overlap | Nothing | Head, hands and props arrive on the same frame as the body | Head leads a NOTICE by 1 f, lags a STRIKE by 1 f and rebounds 5-10 %; held props and hanging things settle 6-10 f after the hand stops. The body itself never overshoots (Rick). |
| Strong poses and silhouettes | Lean in library poses, four locked views | Kit hand poses are often symmetric front poses | Every key pose: lean 8-15 deg toward the action, arms off the body, side or 3/4 view for actions. Check: the pose reads as a black silhouette. |
| Arcs | Arms are curves | Hand paths are straight lines between poses | Hands travel on an `arc()` with 15-25 % bend. |
| Character acting (think before acting) | Calm face, change on the word, blinks | No NOTICE beat; eyes do not look before the body moves | Every action starts with NOTICE: face step + head turns to the thing, then a read hold, then the move. |
| Exaggeration | Meme faces, funny library styles | Timing is never exaggerated | Longer holds before the strike, shorter strikes, bigger leans. |
| Slow in and slow out | Ease-out tween | Everything eased the same; nothing fast; library uses symmetric ease-in-out | Strikes `snap`; ease-in-out only for camera travels and slow drifts. Never linear. |
| Staging and camera | Strong (measured camera rules, station rests, push-ins) | Camera does not react to hits | 3-4 f camera kick on big hits (amp 6-10 px), push-in on the hand for key actions (already a rule). |
| Secondary action | Micro motion rule for the WORLD (wind, hit reactions) | Characters have none during a move | Secondary moves happen DURING and right after a move (hand settles, hat shakes, prop swings); never in a held pose. |
| Appeal and consistency | Locked cast, persona per character | No shared timing across films | This guide's numbers are the house timing for every film. |

## 3. The action sequence (every meaningful action)

NOTICE, READ, ANTICIPATE, HOLD, STRIKE, IMPACT, REACT, SETTLE, DEAD STILL. Frames below are the defaults; the band is what is allowed.

| Beat | Frames | What moves | Curve |
|---|---|---|---|
| Notice | 4-5 f snap + 6-8 f settle | Face STEP, head turns to the thing first, body follows 1 f later | snap |
| Read hold | 8-18 f | Nothing. One blink allowed (4 f: half, shut, shut, half) | still |
| Anticipate | 6 f snap + settle | Opposite way, 25-35 % of the strike distance; face STEP (squeeze, breath hold) | snap |
| Hold | 4-10 f (longer = funnier) | Nothing | still |
| Strike | 7 f, 70 % in 5 f, on an arc | Hand or body to the target; head lags 1 f | snap |
| Impact | contact frame + 3 f | Body dips 6-10 px and back; prop squashes; light STEPS on with a glow flash that fades over 20 f; 5-7 sparks fall; camera kick 3-4 f; SFX on the contact frame | steps + damped |
| React | on the word, 0-3 f before it | Face STEP + head pop (6 %, settles in 6 f); a small lean | snap |
| Settle | 8-12 f | Parts rebound 5-10 % and come to rest; body never overshoots | snap tail |
| Dead still | until the next beat | Nothing moves on the character. The camera may creep. | still |

## 4. Curves (code: `templates/pieces/motion_core.mjs`)

- `snap(f)`: body moves. Builds speed 2 f, 70 % on f5, settles over 10 f. Matches Rick's body within 4 % on frames 1-10 (graph); after that his press dips, which the IMPACT beat adds.
- `snap(f, {hit: 6, share: .95, settle: 8, os: .08})`: head, hands, hair, held props (Rick's head curve, with its rebound).
- `step()`: faces, eyes, mouth shapes, lamps, button states, view changes. Zero in-between frames.
- `arc(a, b, u, bend)`: hand and head paths.
- `squash()`: props and effects only. `kick()`: camera on a hit. `pop()`: head wobble on a face change. `blink()`: Rick's 4-frame blink.
- Ease in-out: camera travels and slow drifts only. Linear: never.

## 5. Per move (numbers for the library and the kit)

- **Walk**: steps 12 f (normal), 17 f (strut), 7 f (nervous); planted feet, the body bobs once per step; starting and stopping a walk is a snap with a settle. Rick has no running figure in his corpus, so runs are ours: 3-6 f per step.
- **Run**: 3-6 f per step, lean 10-20 deg, a 2 f anticipation crouch before the first step, a 6-10 f skid settle at the stop.
- **Head turn**: the view change is a STEP (front to side in one frame, the locked rule), framed by a 4 f head snap and a 1 f head-pop; eyes look first: pupils lead the turn by 2-3 f (the face kit can slide pupils; the rig hook for it is still to build).
- **Hand gesture** (point, wave, shrug): anticipation 4 f the other way, gesture 5 f snap on an arc, hold 12+ f dead still, release 6 f.
- **Eyes**: the eyes move first, then the head, then the body (each 1-3 f apart). Blinks 4 f, every 0.5-2.3 s, never mid-line, one on every big face change.
- **Comedy reactions** (take): see it, freeze 6-10 f, face STEP to the big face with a 6 % head pop, the body jolts back in 3-4 f (snap), hold 18-30 f dead still. A double take = look away 8 f, snap back.
- **Camera**: unchanged CB rules (one slow continuous move per beat, push-in on key actions); add a 3-4 f kick on hits and keep the camera moving through character holds so the frame is never frozen.
- **Transitions**: the change starts on the word (gate: within 2 f). Rick often uses a quick 6-13 f blend there instead of a hard cut (seen in the button film, frames 478-485; see rick-reference-lessons); form or object match and zoom into an object stay as the rules say.

- **Smears and speed lines** (CB 2026-11-11, decided in the studio crew thread): characters never get motion blur. The fastest moves (a strike over about 40 px per frame, a whip turn) get one or two smear frames in the middle of the strike, never on the contact frame; speed lines are allowed but thin and premium, 2-4 f, fading.

## 6. Clashes for CB to decide

1. DECIDED by CB 2026-11-11 18:13Z: "Dead still, like Rick". **Dead still vs tonight's "holds keep breathing and blinks" + "secondary motion on hair, cloth and held props".** Rick is dead still once he stops (measured). Recommendation: characters are dead still in holds (blinks allowed, they are steps); hair, cloth and props move only during a move and its settle; WIND and hit reactions stay on the world (grass, banners, lanterns), which is what the micro-motion rule asks.
2. **Faces as a step vs the kit's 8-frame face blend.** Recommendation: step (CB's rule 4, measured).
3. **Head wobble pop** stays (CB asked for it); it is the only size change a character ever gets.

## 7. What is wired in and what is not yet

- `templates/pieces/motion_core.mjs`: the curves above (snap, tr, dip, ring).
- `templates/motion_styles/moves/act_button_studio.mjs`: the new press, plus the old press as the kit plays it; `compare.mjs` renders old vs new with a spacing graph.
- `templates/motion_styles/rig.mjs`: two small hooks (a face given as parts; head pop). Old moves draw exactly as before.
- `tools/motion_gate/check_motion_ep.mjs` (copied into the film's moves/tools/): plays every move frame by frame. Library today: 195 styles, 481 moves: 40 on-twos frames, 60 linear runs, 103 creeping holds, 126 slow starts, 138 stops with no settle. The new press: 0 twos, 0 linear.
- `templates/threejs_film/film.js`: `"tween": {"ease": "snap", "frames": 15, "face_frames": 0, "ones": true}` (all opt-in, so running episodes do not change).
- `tools/film_plan.py`: new motion gates (cuts on the word, face in-betweens, tween curve, moves on ones, idle sway).
- Not done yet: re-timing the 195 library moves to the sequence (the check lists them; do the most used ones first: walk, idle, react, push, hammer, point); a NOTICE helper that the plan tool adds before every act; Blender look pass unchanged (it plays the same baked cards).

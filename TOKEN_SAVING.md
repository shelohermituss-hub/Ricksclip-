# Token saving: how V1.2 spends less without losing quality

A Ricks Clips film is built by Claude reading and re-reading files. Measured on our films: about 97 % of all tokens are **re-reading** (every step a helper takes reads again everything it has seen). So the savings come from reading less, keeping sessions short, and never building or fixing the same thing twice. Quality is never the thing that is cut: "Rick's quality is the target; tokens are a guide" (CB_RULES Rule No. 1).

## 1. Pick a quality tier (you choose, per film)

| | Standard | Premium | Ultra |
|---|---|---|---|
| Tokens per finished minute | about 400 M (cap 450 M) | about 700 M (cap 780 M) | about 1 billion (cap 1.1 billion) |
| Edit rounds after the first full version | 2 | 3 | 4 |
| Light and atmosphere | the look pack's light per place | a light pass per place: warm key against cool fill, haze in depth, bloom, depth of field | the light pass per shot, rim light, light shafts, a light change on every beat |
| Detail | the detail floor (every place dressed and measured) | the floor on every shot | the floor plus Rick's densest close shots |
| Effects and gags | 3 power moments, 4 extreme gags | 4-5 power moments, 6 gags, 1 POV, 1 impossible view | 5 power moments, 8 gags, POVs and impossible views |

Every tier keeps every check (facts, picture plan, the five pre-build checks, camera plan, frame checks, the one gate, the grade). Standard is cheaper because it builds fewer new things and gets fewer rounds, never because it skips a check. Claude tells you at 80 % of the budget, and never passes the cap without your yes.

## 2. The rules that save tokens (CB_RULES 11b, for every helper and the lead)

| Rule | What it means | Why it saves |
|---|---|---|
| T1 Read only your slice | A helper reads `rules/dept/<its job>.md` (a cut of the rule book made by `tools/slice_rules.py`), not the whole 180 kB book. | The sound designer reads 17 % of the book, the writer 31 %. |
| T2 A fresh helper per fix round | A helper does one round, writes `STATE.md` (60 lines max), and ends. The next round starts fresh from STATE.md. | A resumed helper re-reads its whole history on every step. |
| T3 Numbers before pictures | Scripts measure (cut heads, saturation, loudness, camera speed); pictures are opened small and only when a number fails. | A picture costs far more to read than a number. |
| T4 One command per cycle | Render + sheets + measurements in one script call; long runs go in the background, no polling. | Every wake-up re-reads everything. |
| T5 Short reports | 25 lines max; tables go into files. | The lead reads less. |
| T6 Small model for mechanical work | Rendering, joining, measuring, sound-mix runs go to a Sonnet or Haiku helper. | Same result, a fraction of the cost. |
| T7 A fresh lead session per phase | Story, build and finish are three sessions, each started from HANDOFF.md. | Long sessions get expensive per step. |
| T8 Nothing built twice | Grep `tools/`, `templates/` and the last film before building anything. | Re-building existing tools was a big waste. |
| T9 Measure every film | `python tools/token_report.py <session>` at the gate, after every round and at delivery. | You see where tokens went. |

## 3. The lean way per stretch (approved by CB on 2026-11-17)

Tested on one stretch of a delivered film (6.97 s, rebuilt with the kit it already had): **16.9 M tokens in one session against about 23 M for the same job the old way, about 25-30 % cheaper**, with a real bike, a visible driver and one take. Round 2 then fixed the camera speed and the driver scale with the new checks in the cycle.

- **One builder per stretch** does the board, the build-out and the camera in one session, instead of a chain of four department helpers.
- **The camera plan is locked first**: it passes `python tools/film_plan.py check film.json --window a-b` (with the window speed check) before the first render.
- **One command per stretch cycle**: `bash tools/run_stretch.sh <film.json> <a-b>` bakes, runs the plan check, renders on the graphics card, runs the frame checks (with the body and scale rows), the detail gate and the camera numbers, and writes one log.
- **The camera numbers are in every cycle**: `tools/measure/cam_track.py` p90 at most 22 px per frame (720p) and no move peak over 26 outside a planned whip. In the test, round 1 shipped 33.2 because the number was not in its cycle; round 2 had it and landed at 18.2.
- **Body and scale checks**: characters in cars, buses and on bikes are checked too (seated height, head to roof, hands on the wheel). In the test this caught drivers drawn 0.65 m tall that no check had seen.
- **At most one small-model helper**, only for rendering and measuring (no judging, no building).
- **The builder reads only its slice** at the start, not the whole rule book.
- **A time box (T9b)**: about 60 steps per 7-second stretch. Fix rounds stay with the same builder while the time box lasts; when it ends, the builder writes STATE.md and a fresh builder continues from it.
- **Kit reuse first**, with Hard Rule No. 2 kept: every reused set or prop gets five story-specific details before it counts as done.
- Department agents stay available but are called only when the stretch needs something NEW (a new set, a new character, a new prop).
- Every guard stays: frame checks 0 FAIL, the detail gate, the plan check, the reference side-by-side, the one gate, the self-review.

Expected: about 2-4 M tokens per second of film once the kit has the sets and cast a story needs (measured: round 1 alone 2.4 M per second, rounds 1 and 2 together about 4.6 M per second), so roughly 150-250 M for a 60 s film against 720 M measured for the old way on the same film. A story that needs new sets and cast costs more (about 100-200 M extra). These numbers come from one measured test and are a guide, not a promise. The quality tier stays your budget cap; these are the expected spend inside it.

## 4. Where the tokens went before (so you know what not to do)

- A still-picture storyboard with judge rounds that was rejected once it moved: about 750 M on one film. Now: the whole film rough plus the hook moving at ONE gate.
- Light and effect rounds on still pictures: 159 M + 104 M. Now: light comes from the look bible before the sets are built, effects from the picture plan.
- A camera rule that arrived after the build-out, so every stretch rendered twice. Now: the camera plan is locked before any stretch renders.
- A world found at half Rick's detail after the gate. Now: the detail gate runs before the build.

## 5. How to check your own spend

```
python tools/token_report.py <session id>            # tokens per helper, hours, the three most expensive helpers
python tools/token_report.py <session id> --until 14:00
```
The lead writes "used / budget" into the film's STATE.md after every round.

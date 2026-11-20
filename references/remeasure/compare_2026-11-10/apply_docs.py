# -*- coding: utf-8 -*-
"""apply_docs.py: writes the CINEMATIC RULES (CB 2026-11-10 'apply all to knowledge') into SKILL.md, WORKFLOW.md, CINEMATOGRAPHY.md and the two agents.
Every replacement must match exactly once, or nothing is written. Run from anywhere with the system Python."""
import os, sys, json
SK = r"<skill folder>" if len(sys.argv) < 2 else sys.argv[1]
T = {}; log = []
def load(rel): T[rel] = open(os.path.join(SK, rel), encoding="utf-8").read().replace("\r\n", "\n")
def rep(rel, old, new):
    c = T[rel].count(old)
    if c != 1: raise SystemExit("NO MATCH (%d) in %s: %s" % (c, rel, old[:70]))
    T[rel] = T[rel].replace(old, new); log.append((rel, old[:40]))
for f in ("SKILL.md", "WORKFLOW.md", "CINEMATOGRAPHY.md", "agents/camera-director.md", "agents/storyboard-judge.md"): load(f)

RULES = '''### Cinematic rules (CB 2026-11-10 on the finished baboon film: "our is less cinematic", then "apply all to knowledge. but the camera movements really depends on the scene and situation but we should make it more cinematic like his")
**Why.** The baboon film passed every gate and still read less cinematic than Rick's. Measured against five of his films (data and script: `references/remeasure/compare_2026-11-10/`), brightness, saturation and the camera gates matched, but the world never changed: two places and one noon light for 77 s, a face on 89 % of the frames, a middle-sized character in front of the same backdrop, a camera that hopped between 39 stations, no haze, a weak vignette, neutral shadows and plain ground. Several of these were already rules (moods, an analogy gets its own place, MAIN LOOK vignette 0.67 and blue shadows) that nothing enforced. The seven rules below are ranked by effect. Rules 1-3 are decided before anything is built; rules 4-7 are the look pass.
1. **Places and light.** A film of 55 s or more uses 5-8 places and 2-3 kinds of light (his Railroads about 8 places, Roller Coasters 7, Drivers and Pink Prison 5; noon, low sun, dusk, night). A story that happens in one place still gets more views of it as places of their own: from the air, inside the vehicle, under the machine, the same set at dusk or at night. The light changes at the turn of the story. An analogy, a cutaway or a time jump is a small 3D place with its own light, never a flat drawn card. Decided at the pitch and in the script: the beat list names place and light for every beat. Plan gates: places >= 4, most used light <= 75 % of the film.
2. **Scale.** A third to a half of the film is led by the world or the story object: a wall that towers, the machine, the vehicle, rails to the horizon, a view from the air, with the character tiny or absent. Then go very close. The middle size is the dull one (medium about 20 % of the time; the baboon film had 33). Behind a character stands something big and close, not open sky. At least three towering shots per film. Plan gates: frames with a face 45-68 %, world-led frames 25-40 %, medium <= 28 %.
3. **Camera flow, led by the scene.** CB: the camera depends on the scene and the situation, so these are bands, not laws, and their gates warn before they fail. The camera still rests on faces and on the named nouns, but it must not hop from station to station. Aim for 3 rests per 10 s, not 4-5. Wherever the scene has something to follow (a train, a walker, a thrown or falling thing, a line of rails, a rising structure), ONE move flows with it for 3-7 s: an explicit `travel` of 4-6 s on the landing station, or a chain of `hold: 0` stations. Push in slowly on about 45 % of the frames. A calm talk scene may stay on short moves (his Pink Prison: 4.1 rests per 10 s, long travels 2.2 s); a travel or action scene must flow (his Railroads and Roller Coasters: 2.5-2.7 rests, long travels 4.7 s). Gates: plan rests 2.2-4.5 per 10 s and a longest travel of 3-7 s; picture rests 2.2-3.8 and travel p90 2.1-6.3 s. A cinematic gate may stay on WARN only with the scene's reason written in CAMERA_NOTE.md. Scene by scene: CINEMATOGRAPHY.md section 6.
4. **Low sun, real shadows, a light that changes.** Outdoors the sun stands low (25-40 degrees), from the side or three-quarter back, so characters and structures throw long hard shadows on the ground and on walls; the sun disc and its glare are in frame in two or three shots; shadows are blue (b* -4 to -12). Every `moods` entry of film.json is rendered in Blender as a real light or grade key (in three.js it is only a placeholder wash): a mood that is not in the final picture does not count. One stretch of the film goes dark (night, deep shade, an interior with one window).
5. **Air and sky.** The sky is pale at the horizon and deeper above, with soft painted clouds (not small popcorn puffs); everything far is lifted by haze (haze lift 6-14); outdoors the sky is brighter than the ground.
6. **Grade.** Vignette 0.65-0.75 measured on the picture (the baboon film's 0.87 was too weak), big surfaces calm (lit C* 20-30) with one loud accent, deep blacks.
7. **Detail where the lens is.** Dense ground cover near the camera (ballast, pebbles, grass blades), grain on the big planes, gloss and a bright edge on rails, metal and glass (glints 1-3 % of the frame), and a sharp picture outdoors: depth comes from haze and light, blur only behind close-ups.

**Checks.** Plan (stage 5): the cinematic gates inside `film_plan.py check`. Look frames (stage 9) and final (stage 10): `python tools/measure/cine_look.py <folder of frames | final.mp4> [--interior]`, bands in `references/measure/gates_cine.json`, 0 FAIL. A FAIL there is a value outside all five of his films. __BABOON_LINE__
The characters stay as locked. Stronger cast shadows and the scene's light tint on the cards belong to rule 4 and do not change the puppets.

'''
S = "SKILL.md"
rep(S, "and runs 37 gates on the PLAN:", "and runs about 42 gates on the PLAN (since 2026-11-10 with the cinematic gates: places, light share, world-led frames, medium share, and two-sided bands for rests, longest travel and face share):")
rep(S, "| 1 | Topic and facts: pitch 3 stories (UPGRADES 1) | lead | CB picks |", "| 1 | Topic and facts: pitch 3 stories (UPGRADES 1); each pitch names its 5-8 places and 2-3 kinds of light (CINEMATIC RULES 1) | lead | CB picks |")
rep(S, "`film_plan.py check`: 0 FAIL, at most 2 WARN |", "`film_plan.py check`: 0 FAIL, at most 2 WARN; a cinematic gate (places, light, world-led, medium, rests, long travel) may stay on WARN only with the scene's reason in CAMERA_NOTE.md |")
rep(S, "| `tools/check_episode.py` (density + 3D look); one still per place + one short clip; CB approves the look |", "| `tools/check_episode.py` (density + 3D look); `tools/measure/cine_look.py` on the look frames: 0 FAIL; one still per place + one short clip; CB approves the look |")
rep(S, "| `check_film.py` on the final: plan vs picture, scan |", "| `check_film.py` on the final: plan vs picture, scan; `cine_look.py` on the final mp4: 0 FAIL |")
rep(S, "and travels to the next station with zero speed at both ends, at most 3 s.", "and travels to the next station with zero speed at both ends. Without a `travel` key a move takes at most 3 s; since 2026-11-10 the scene decides the length: short hops between faces, and at least one flowing move of 3-7 s per film that follows something through the set (CINEMATIC RULES 3).")
rep(S, "### Rulings on the old contradictions\n", RULES + "### Rulings on the old contradictions\n")
rep(S, "- Dissolves: another studio counted about 12 per minute", "- Moods do not reach Blender yet: `lock2.py` and the look scripts have no mood keys, so the baboon film's planned mood changes (15.5 per minute in the plan) never reached the final picture. Build it at the next look pass (light strength and colour keys per mood, or a per-frame grade), and prove it with `cine_look.py` (spread of L >= 10).\n- The day grade used on the baboon film (`karoo_day`, pc_post vignette 0.3) measured vignette 0.87, shadow b* -0.8 and haze -0.6 against MAIN LOOK's 0.67 and -8. Tune the day preset and the grade against `cine_look.py` on a few frames before the next look gate.\n- The cinematic bands come from five of his films and one of ours. Re-cut them in `gates_cine.json` when more films are measured.\n- Dissolves: another studio counted about 12 per minute")
rep(S, "\n## CINEMATOGRAPHY (CB 2026-11-09:", "- **Day and exterior, added 2026-11-10 (CB: \"apply all to knowledge\"; CINEMATIC RULES 4-7 in THE PIPELINE):** sun low (25-40 degrees), sky stops pale at the horizon, a haze range short enough that far things lift (measured haze 6-14), blue fill, the vignette fitted until the picture measures 0.65-0.75, lit C* 20-30 on the big planes. The first day presets (`karoo_day`, baboon film) measured vignette 0.87, shadow b* -0.8 and haze -0.6 and are not the model for exteriors; the office interior of that film is a good model for interiors. Judge: `tools/measure/cine_look.py`.\n\n## CINEMATOGRAPHY (CB 2026-11-09:")

W = "WORKFLOW.md"
rep(W, "Pitch 3 true stories with first line, mocker, twist and title. CB picks.", "Pitch 3 true stories with first line, mocker, twist and title. Each pitch also names its places (5 to 8) and its kinds of light (2 or 3). CB picks.")
rep(W, "must show 0 FAIL. Nothing is rendered before that.", "must show 0 FAIL. The cinematic checks in it (places, light, world-led frames, medium shots, rests, one long flowing move) may stay on WARN only with a reason from the scene. Nothing is rendered before that.")
rep(W, "Check: `python tools/check_episode.py`. **CB approves", "Check: `python tools/check_episode.py`, and `python tools/measure/cine_look.py <look frames folder>` with 0 FAIL. **CB approves")
rep(W, "Check: `check_film.py` on the final.", "Check: `check_film.py` on the final, and `cine_look.py` on the final mp4 with 0 FAIL.")
rep(W, "## Craft rules for each step (a rule book, NOT a second order)", '''## Cinematic rules (CB 2026-11-10, full text: SKILL.md, THE PIPELINE, "Cinematic rules")

Our baboon film passed every check and still looked less cinematic than Rick's, because its world never changed. These seven rules fix that, most important first.

1. **More places, more light.** 5 to 8 places and 2 or 3 kinds of light per film. A one-place story gets extra views of the place (from the air, inside the vehicle, at night). A cutaway idea is a small 3D scene, not a flat card.
2. **Play with size.** A third to a half of the film shows the world or the story object, with the character tiny or absent. Then go very close. Put something big and close behind the character.
3. **Let the camera flow, as the scene asks.** Calm talk: short moves and rests on faces. Something travels: one long move of 3 to 7 seconds follows it. About 3 rests per 10 seconds, not 4 or 5.
4. **Low sun and real shadows.** Long hard shadows, the sun in frame sometimes, blue shadows, and one part of the film that goes dark. Every planned mood change must be visible in the final picture.
5. **Air and sky.** Sky pale at the horizon, soft clouds, haze on everything far away.
6. **Grade.** A clear vignette, calm big surfaces, one loud accent colour.
7. **Detail near the lens.** Dense ground, glints on metal and glass, a sharp picture outdoors.

Checks: the plan check (step 5) warns on rules 1 to 3; `tools/measure/cine_look.py` (steps 9 and 10) fails on rules 4 to 7.

## Craft rules for each step (a rule book, NOT a second order)''')

C = "CINEMATOGRAPHY.md"
T[C] = T[C].rstrip("\n") + '''

## 6. Camera flow in every scene (CB 2026-11-10)

CB after the baboon film: "the camera movements really depends on the scene and situation but we should make it more cinematic like his". So the scene picks the move, and the numbers are bands that warn, not laws. What was measured (same instrument, `references/remeasure/compare_2026-11-10/`):

| Film | Rests per 10 s | Long travels (p90), s | Frames pushing in | What the scenes are |
|---|---|---|---|---|
| Our baboon film | 4.1 | 2.0 | 32 % | one junction, talk and lever pulls |
| Railroads | 2.5 | 4.6 | 47 % | travel along a line, canyon, bridge |
| Roller Coasters | 2.7 | 4.7 | 51 % | rides, loops, fly-overs |
| Storm Oil | 2.0 | 3.5 | 42 % | ship, sea, storm |
| Drivers | 3.5 | 2.4 | 21 % | car interiors, locked dash-cam views |
| Pink Prison | 4.1 | 2.2 | 31 % | rooms, talk |

His talk films sit where ours sat; his travel films flow twice as long. Our film had trains, a trolley and a walk in it and still hopped, so it read as a slideshow of stations.

| The scene | The camera |
|---|---|
| Talk, a reaction, a joke on a face | Rest on the face with a slow push; short hops of 1-2 s between faces. |
| Something travels (train, cart, walker, letter, ball) | One move rides or follows it for 3-7 s and lands on a face or on the noun. No rest in the middle. |
| A place is introduced | Start on a detail and rise or pull back until the place towers over the character (or the reverse). The world leads the frame. |
| A mechanism is explained | Follow the force through the machine in one move (hand, lever, rod, signal). |
| Time passes | A dissolve with a double exposure, or the light changes in the shot. Not a flat card. |
| A big thing arrives | Low and close, the thing rises over the lens; the character is small at the bottom. |
| The payoff | Very close after a wide, or the object comes to the lens. |

In film.json: a flowing move is an explicit `travel` of 4-6 s on the landing station, or a chain of `hold: 0` stations with `via` points; `follow` trucks with a walker. Count the stations before writing them: about 3 rests per 10 s. Gates: plan rests 2.2-4.5 per 10 s and a longest travel of 3-7 s (`film_plan.py`); picture rests 2.2-3.8 and travel p90 2.1-6.3 s (`check_film.py`). A value outside the band is kept only with the scene's reason in CAMERA_NOTE.md.
'''

A = "agents/camera-director.md"
rep(A, "(37 gates, about 1 s, so run it after every change)", "(about 42 gates, about 1 s, so run it after every change)")
rep(A, "4. Write the idea in the film's `camera_idea` block:", '''3b. **World and scale plan (CB 2026-11-10; SKILL.md "Cinematic rules").** Before any number: list the film's places (aim 5-8; a one-place story gets views of it as places of their own: from the air, inside the vehicle, under the machine, the same set at dusk or night) and its 2-3 kinds of light, with the light change at the turn of the story. Then mark every beat: who leads the frame, a FACE, the WORLD or the story OBJECT. A third to a half of the film is world- or object-led, with the character tiny or absent; at least three shots where something towers; after a wide, go very close. Medium shots are the dull size: keep them near 20 %. Behind a character stands something big and close, not open sky. An analogy or cutaway is a small 3D place, never a flat card.
3c. **Flow plan.** For every scene write one line: does something travel here (a train, a walker, a thrown thing, a force through a machine)? If yes, ONE move of 3-7 s follows it and lands on the noun. If the scene is talk, rest on faces and hop. Count the stations: about 3 rests per 10 s. The table is in CINEMATOGRAPHY.md section 6.
4. Write the idea in the film's `camera_idea` block:''')
rep(A, "- Travels last 3 s at most and end in a rest of 0.6 s or more. In a film of 30 s or more, three to six long journeys (travels over 1.5 s); a 15 s film may have one or two.", "- Travels end in a rest of 0.6 s or more. The scene decides their length (CB 2026-11-10): short hops of 1-2 s between faces in a talk scene; wherever something moves through the set, one flowing move of 3-7 s that follows it (set `travel` on the landing station, or chain `hold: 0` stations). In a film of 30 s or more: three to six long journeys (over 1.5 s), at least one of them 3 s or longer, and about 3 rests per 10 s, not 4-5: station hopping reads as a slideshow. A 15 s film may have one or two long journeys.")
rep(A, "- Every device needs a trigger in the story.", "- World and scale (CB 2026-11-10): 4 or more places (aim 5-8) and 2-3 kinds of light in a film of 30 s or more; a face on 45-68 % of the frames; the world or the story object leads 25-40 % of the time; medium shots under 28 %. These gates warn. A WARN stays only with the scene's reason in your note.\n- Every device needs a trigger in the story.")
rep(A, "   - a hero moment breaks a gate:", "   - places, light share, world-led frames, medium shots, rests or longest travel on WARN (the cinematic gates): the film sits in one place, one light or one shot size, or it hops. Add a view of the place as its own place, give the turn its own light, hand two beats to the world or the object, merge stations into one flowing move. Keep such a WARN only when the scene truly asks for it, and write the reason.\n   - a hero moment breaks a gate:")

J = "agents/storyboard-judge.md"
rep(J, "- The last panel against the first: does it loop?", "- Cinematic rules (CB 2026-11-10; SKILL.md \"Cinematic rules\"): count the places and the kinds of light you can see (aim 5-8 places and 2-3 lights at 55 s or more). Is a third to a half of the panels led by the world or the story object, with the character tiny or absent, and are there three panels where something towers? More than a quarter of the panels a middle-sized character in the centre is a finding. Does something big and close stand behind the characters, or is it open sky again? Is any analogy, cutaway or time jump a flat card where it should be a small 3D place? Name the scenes where something travels and the camera does not follow it.\n- The last panel against the first: does it loop?")
rep(J, "4. **Look and life (0-2).** Not generic:", "4. **Look and life (0-2).** Depth lines that lead into the picture, something big and close behind the subject, a scale that differs from the panel before. Not generic:")

if "--dry" in sys.argv: print("dry run ok, %d edits" % len(log)); raise SystemExit
BAB = sys.argv[sys.argv.index("--baboon") + 1] if "--baboon" in sys.argv else ""
T[S] = T[S].replace("__BABOON_LINE__", BAB)
for rel, txt in T.items(): open(os.path.join(SK, rel), "w", encoding="utf-8", newline="\n").write(txt)
print("written", len(T), "files,", len(log), "edits")

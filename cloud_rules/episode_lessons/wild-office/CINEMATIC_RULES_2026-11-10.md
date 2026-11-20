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

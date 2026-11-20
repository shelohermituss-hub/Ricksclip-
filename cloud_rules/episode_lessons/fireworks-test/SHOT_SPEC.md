# SHOT_SPEC: fireworks-test (camera-director, 2026-11-13; CB_RULES s7 REFERENCE STILL APPROVAL BEFORE ANIMATION, s6 HIGH-QUALITY VFX AND CAMERA WITH A PURPOSE)

PRIVATE references: the Rick frames named below are the LOOK_BIBLE "Chosen Rick frames" and are on `refs/board_b1..b5_*.jpg`. They are never published.

One block per camera rest. The film is one take with no cuts, and the camera never stops: every "rest" is a creep under 2 px/f, and the travels between rests are the moves.

## How the numbers were measured
- **Source.** All numbers come from the current plan: `out/plan/camera_baked.json` and `out/plan/frame_check.json`, after fix round 3 (0 FAIL, 1 WARN), plus projections of the SET points through each rest camera.
- **Screen positions** are given as (x, y), each running 0-1. x runs left to right and y runs top to bottom. The caption band is y 0.58-0.76.
- **Yaw** is the plan azimuth the lens looks along (0 = east, 90 = north). **Pitch** is positive when the lens looks up.
- **Down** is the frame_check angle from the lens down to his chest (negative = the lens looks up at him). The rule is at most 10 deg down.

## Light rig, shared by every block
The light rig is owned by the lighting-director (gen_film.py MOODS, LIGHT_RIG and CARD_SHADE; sets/lighting.js):
- **Moon key / rim:** az 150, el 28, #c4d0ff. Seen from our lenses (yaw 78-142) it is high back-left, so on him it reads as the cool rim on his screen-left edge. It casts the one hard shadow.
- **Fill:** SE sky fill (az -60, el 18, #8096e0), which sits nearly behind the lens, plus a soft camera fill riding above the lens. Shadows stay navy, never black.
- **Warm practicals:**
  - lantern pole LP_E [2.9,-1.4,2.7], front-right of his mark (warm amber rim on his screen-right side);
  - LP_W [-2.6,-3.4,2.5];
  - the porch lamp;
  - the kitchen window [-0.95,6.0,1.55], the ONE warm window behind the rack.
- **Story light on his card:**
  - lighter flame f141-208 (key on fist, face and rack);
  - fuse spark f209-391 (gold, low);
  - burst flashes from f471 (whole garden in the burst colour, then back to moon blue).
- **Haze:**
  - fog #5a72c4 from 1 m to 38 m (far roofs, hedge and tree go pale);
  - haze 0 until "Whooosh", then 0.03, then 0.06 from "boom", plus the lit smoke dome;
  - the cast takes no fog.
- **Depth of field:** post `dof` is 0, so every block gets its depth from layering, fog and lens choice, not from blur (see Proposed change 5).

---

## 1. HOOK f0 (the push starts at f1 and runs to f80)
Rick frames: BELL 17.9 (main: snow street read in one look, a warm window, ruts leading the eye), BELL 12.5 (the big close post at the edge), JAR 36.5 (night garden, moon, branch).
- **Camera:** pos [1.74,-3.76], 0.90 m high (character height, he stands about 1.2 m). Yaw 118, pitch -4.1, down 4.5 deg. 35 mm, 4.0 m from him. Then a slow push in at about +2-4 %/s along the path.
- **Subject:**
  - The boy stands at his mark K [0.25,-0.05] with his fist ON the rack's east rail. His head centre is at (0.69,0.45) and his feet at (0.69,0.65): about a quarter of the frame height, right of centre.
  - The rack spans x 0.22-0.57 at y 0.44-0.64 (left of centre), with the 12 rockets readable above its deck.
- **Foreground:**
  - the bird table post, full height, at the right edge (x 0.98, 1.24 m from the lens);
  - snow ruts and his bootprints leading in from the bottom;
  - the dry tufts by the fuse (0.34,0.65).
- **Midground:**
  - the rack, the BIG BANG CO. box (0.04,0.60), the sand bucket (0.16,0.57) and the burnt sparkler (0.11,0.67);
  - the instruction sheet under its stone in front of the rack, with the drag line running to it.
- **Background:**
  - the brick kitchen extension with the warm window behind the rack at (0.89,0.37);
  - the blue clapboard house on the left and the LS2 lantern string over him;
  - the moon, and the far roofs in haze.
- **Light:** the moon rim is back-left, cool. LP_E gives the warm amber on his right side. The SE fill is front. Cold_moon mood.
- **Depth and haze:** four layers (post, boy and rack, extension, sky). Fog pales the far roofs. No smoke yet.
- **Story action / focal point:** "This kid kneels by 12 rockets". The focal point is the boy's hand on the rack, then the rockets. The path leads the eye there.
- **Key props / mechanics:**
  - The rack is planks with bolts and a cross brace, 1.04 m long. The 12 rockets carry wrappers (BOOM / SKY KING / 12 SHOT).
  - The fuse rail runs along the front of the rack. The lead fuse runs to the 0.34 m stake.
  - The props are snow-capped.
- **VFX:** falling snow in 2-3 sizes, with near flakes soft. Purpose: the cold night, and depth in front of the lens.
- **Pose / expression:** kneel/L. He leans on the rack, then kneels on f14 and settles on f22. Face: standard, then smug on "rockets".
- **Cat:** on the extension eave, cat_spot (0.50,0.24): a small loaf silhouette against the sky, centre-top, with a half-lidded stare.

## 2. LIGHTER, medium on his hands, f81-97
Rick frames: BELL 24.5 (main: a figure in a warm lantern pool on snow, the face warm on the lamp side), CART 33.5 (character on the hero object at night).
- **Camera:** pos [0.60,-1.90], 0.62 m high. Yaw 107, pitch -2.1, down 1.1 deg. 35 mm, 1.9 m. The push continues at the same speed (no hop); it creeps at f81-97, then pushes on to the flick.
- **Subject:**
  - He kneels whole, head (0.69,0.35), feet (0.68,0.78), about half the frame height, on the right.
  - The fist with the lighter is at chest height, above the caption band. The rack's east end is at x 0.38-0.41, and the rockets stand beside him on the left.
- **Foreground:** snow with knee prints, his bootprints, and the bird table sliding out at the right.
- **Midground:** the rack's east end, the fuse stake (0.53,0.64) and the lead fuse.
- **Background:** the kitchen window (0.65,0.35), lanterns on the top edge, and the cat at (0.16,0.20), top-left.
- **Light:** cool moon rim on his left side, LP_E warm on his right cheek and fist. Cold_moon mood.
- **Depth and haze:** the boy is near, the rack is mid, the window glow is far. Light fog.
- **Story action / focal point:** "pulls a lighter out of his pocket". The hand digs into the coat pocket, gives two tugs and YANKS on "out" (f94). Focal point: the fist with the lighter.
- **Key props:** the lighter (props-hero 3D model, its grip anchor locked in the fist; metal body and lid), the coat pocket flap, the rack's end planks and bolts.
- **VFX:** a metal glint (one thin streak) at f97 after the yank. Purpose: the lighter reads as the new object.
- **Pose / expression:** pocket/L. A sly glance one way, then the other (f74), the dig, the yank. Then skeptical, with one brow up, on "pocket" (f107, during the next push).

## 3. FLICK f134-148
Rick frames: CART 51.5 (lens at rope height, the hero object rising behind), CART 33.5.
- **Camera:** pos [0.90,-1.51], 0.46 m high (his chest height when he kneels). Yaw 120, pitch +1.4, down -4.4 deg (slightly up at him). 35 mm, 1.6 m. The low arc keeps turning the same way (yaw 107 -> 120 -> 140).
- **Subject:** He is big, head (0.68,0.29), feet (0.68,0.81), about 0.6 of the frame height, right of centre. The lighter is in his fist at about chest height. The fuse stake top (0.44,0.62) is below the fist.
- **Foreground:** snow and tufts at the bottom edge.
- **Midground:** the rack's east end planks and rockets (x 0.38-0.41) on the left, behind his fist.
- **Background:** the extension wall, lanterns on the top edge, and the cat near the top centre (0.51,0.24).
- **Light:** the moon rim stays. From f141 the flame becomes the warm key under his face and on the fist and rack (warm_flame mood, from f154).
- **Depth and haze:** low lens and shallow ground, so the rack and the house sit behind him.
- **Story action / focal point:** "Flick, flame". The lid SNAPS open on f139 and the flame pops on f141. Focal point: the flame in his fist.
- **Key props:** the lighter (the lid hinge, the flint wheel, the flame), the fuse stake with its wrapped tip below.
- **VFX:** a flint spark fan with a 2-frame flash. The flame pops f141-144 with overshoot, settles on f147 and flickers. Purpose: the tiny success that starts the danger.
- **Pose / expression:** flick/L, thumb cocked, small chin-up. Face: smug half-smile with one brow up, then focus on "flame" (f154: one eye squinted, lips pressed).

## 4. IGNITION MACRO f175-199
Rick frames: CART 52.3 (main: the spark lights the wood around it, fine lines on every plank), CART 52.8 (the flare: thin gold streaks, about 1 % white-hot, the rope still sharp).
- **Camera:** pos [0.90,-0.92], 0.36 m high (fuse height). Yaw 142, pitch -7.4 (he is out of frame, so the down-angle rule does not apply). 85 mm, about 1.0 m from the stake. A slow arc plus push (creep), the aim nudged left and down in fix round 3.
- **Subject:**
  - The wrapped fuse tip is at (0.65,0.29), right of centre in the upper third. The flame touches it and rises above it.
  - The fist and the lighter body are under and right of the tip. His head is fully out of the top of the frame.
- **Foreground:** the fuse stake and its binding rings, sharp.
- **Midground:** the rack's east end leg, planks, bolts and the cross brace, filling the left half.
- **Background:** the rockets' feet and the snow under the rack, cool blue.
- **Light:** the flame and then the fuse spark are the KEY (warm #ffb060, then gold #eabd60), lighting the stake and the planks from the tip outward. The moon stays a cool rim on the edges of the planks.
- **Depth and haze:** three layers from the long lens: stake, rack, snow. No blur in post (see Proposed change 5).
- **Story action / focal point:** "and the fuse spits sparks". The flame meets the tip on f181 and the fuse catches. It spurts on "sparks" (f198). Focal point: the tip.
- **Key props / mechanics:** the wrapped paper fuse tip (twisted wrap, binding), the lead fuse running down the stake to the rail, the rack joinery (bolt heads, plates).
- **VFX:**
  - A catch flash ON the tip at f181. The spray is born AT the tip.
  - Gold streaks with white-hot heads. They have real emission, speed, drag and lifetime, and fall on the snow.
  - A spurt of 1.35x speed and 2x density at f198.
  - Purpose: the danger starts here. The spray must come FROM the tip, not float near it.
- **Pose / expression:** light/L. He leans in, makes two tiny wrist corrections, then is dead still. The face is off screen: focus, then tongue out (f177), then frozen on "sparks" (f198).
- **Open:** the flame is drawn over the tip (hand_at) and a sliver of his arm sits at the top-right edge. See Proposed changes 1 and 2.

## 5. CAT take f229-243
Rick frames: CART 52.8 (spark density at the object), PIR 43.3 (reaction staging: one figure's take beside the hazard).
- **Camera:** pos [1.63,-1.21], 0.46 m high. Yaw 141, pitch +5.0, down -3.9 deg. 26 mm, 1.8 m. A straight pull back on the same yaw out of the macro (no reversal).
- **Subject:**
  - The whole take, head (0.52,0.41), feet (0.52,0.75), about 0.4 of the frame height, centred.
  - The rack is on the left (x 0.14-0.41). The spitting fuse stake (0.34,0.62) is at his knees.
- **Foreground:** snow with spark burns and tufts.
- **Midground:** the rack and rockets, the sand bucket (0.17,0.63), and the porch lamp (0.15,0.36).
- **Background:** the blue house wall and back door, and the extension at the right edge. The cat is at cat_spot (0.87,0.35), right edge, small.
- **Light:** the gold fuse spark lights him from low left. The moon is straight behind (rim on the top of the hat and the shoulders). The SE fill is front.
- **Depth and haze:** low lens, the house close behind, light fog.
- **Story action / focal point:** "like an angry cat". The delayed, over-fast bolt: off the fuse, lid shut, up tall, fists up. Focal point: his shocked face, with the spitting fuse beside it.
- **Key props:** the fuse stake and the lit fuse running to the rail, the closed lighter in his fist.
- **VFX:** two bold whisker spark fans (7 a side, 2x size) left and right at knee height on "cat" (f232). Purpose: the sparks act out the words "angry cat" (whiskers).
- **Pose / expression:**
  - The boy: take/L, k:shocked, eyes wide, mouth open, then dead still.
  - The cat: on the eave, full puff-up (arched back, bottle-brush tail), locked on the sparks.

## 6. BRAVEST f272-287
Rick frames: CART 31.5 (night pull back off the hero object, which stays the focal point), JAR 35.5 (pull back in a night garden; subject and object stay centred as the garden comes in).
- **Camera:** pos [0.90,-2.00], 0.60 m high. Yaw 120, pitch -2.6, down 0.5 deg. 26 mm, 2.1 m. This is one long JAR-style ease-out pull back: fast start, settle to a creep. It continues through the run to the ears.
- **Subject:**
  - The boy is on the right, head (0.76,0.38), feet (0.75,0.68), about 0.35 of the frame height.
  - The whole rack is in frame (x 0.13-0.58). The burning spark is on its rail at about x -0.2 (plan) at f277.
- **Foreground:** snow, tufts (0.21,0.69), his knee prints.
- **Midground:** the rack, the bucket (0.08,0.57) and the box.
- **Background:** the kitchen window (0.86,0.38) behind him, lanterns, moon, and the cat at the top centre (0.50,0.27).
- **Light:** the cold moon returns, with the gold spark glowing low on the rail, LP_E warm on his right side.
- **Depth and haze:** the full garden layers come in; fog on the far roofs.
- **Story action / focal point:** "So he does the bravest thing he knows". Fake bravado. Focal point: the boy's puffed chest, set against the creeping spark (the threat he is pretending to ignore).
- **Key props:** the spark travelling on the fuse rail, the lighter going into his pocket (seen).
- **VFX:** the fuse spark (a point with a gold glow and small streaks), creeping along the rail. Purpose: the countdown clock.
- **Pose / expression:** brave/L. He pockets the lighter, fists on hips, elbows out, chest and chin up. Face: smug.

## 7. EARS f356-370 (the run f312-354 plays in the pull back before it)
Rick frames: PIR 43.3 (main: crouched, both hands ON his ears, eyes shut), PIR 44.3 (holding the cover after the bang).
- **Camera:** pos [1.20,-4.00], 0.75 m high (his crouch height). Yaw 106, pitch 0, down 1.8 deg. 24 mm, 1.9 m. A creep, then the push to the launch.
- **Subject:**
  - He has run at the lens to RUN_TO and crouches on the right: head (0.76-0.81,0.40), feet (0.77), about 0.4 of the frame height.
  - The rack is in the left third (x 0.19-0.47). The spark is near the rail's west end.
- **Foreground:** his run prints, kick scuffs and trodden snow, from f324.
- **Midground:**
  - the rack, the box (0.06,0.60), the bucket and the sparkler;
  - the LS2 lantern string top-left (0.15,0.15).
- **Background:** the kitchen window (0.56,0.45). The cat's perch is empty and dented: it bolted at f310 and knocked the snow puff off.
- **Light:** moon rim, cold_moon_fuseglow mood, the spark the warm point at the rack.
- **Depth and haze:** deep: the boy near, the rack mid, the house far.
- **Story action / focal point:** "He runs, fingers in his ears". Focal point: his fingers in his ears, then the rack, which is about to go.
- **Key props:** the rack, the burning rail fuse; the snowman's ear muffs (out of frame; the echo is in the dialogue only).
- **VFX:** snow kicks on each of the 6 run steps (f324-354; clumps plus a powder puff), and the fuse spark. Purpose: panic speed, and the clock still ticking.
- **Pose / expression:** flee/L into a crouch, fingers ON his ears (f361), k:brace (eyes screwed shut, teeth gritted), dead still. One eye peeks at f378.

## 8. LAUNCH f404-413 (the push lands here; "Whooosh" is f392)
Rick frame: CART 60.5 (main: the rockets leave the hero object in a smoke puff and spark spray; low lens; the object big).
- **Camera:** pos [-0.10,-1.95], 0.50 m high. Yaw 103, pitch +15.4 (looking up at the rack and the trails). 24 mm, 2.0 m from the rack. Then the tilt up rides with the rockets.
- **Subject:** He is out of frame (behind the lens, right). The whole rack fills about two thirds of the width (x 0.19-0.81, y 0.55-0.90), nothing cut. The 12 rockets are leaving it.
- **Foreground:** snow, scorch and melt appearing from f404, and tufts at the bottom edge.
- **Midground:** the rack in its launch puff, with the gold spark fountain at each nozzle.
- **Background:**
  - the kitchen window (0.64,0.59) glowing through the smoke;
  - the house wall on the left;
  - the LS2 lanterns and the moon in the upper half, where the trails rise.
- **Light:**
  - a white launch flash (white_launch_flash mood);
  - the nozzle flares light the rack and the snow from inside the puff;
  - the moon is back-left.
- **Depth and haze:** haze 0.03. The smoke puff is see-through at its edges; trails go up into the frame top.
- **Story action / focal point:** "Whooosh! All 12 shoot". Focal point: the rack launching, with the trail heads leaving its top.
- **Key props / mechanics:**
  - The 12 rockets are real meshes with sticks. Each nozzle pre-lights at f389.
  - They lift off f392-400 in launch order. The empty slots stay empty.
- **VFX:**
  - A launch puff with a plume shape that turns over and fades.
  - Spark fountains of 0.45 s per nozzle.
  - Bold moon-bright trails aligned to each rocket's velocity, tapering and curling.
  - Falling sparks.
  - Purpose: the event dominates the frame (the loaded rack firing, not the wall).
- **Pose:** his lookup/L happens off screen.

## 9. BOOM f466-480 (the lanterns pass is at f440 during the tilt)
Rick frame: CART 62.5 (main: the sky FILLS with smoke trails, each with a bright head; the world below stays readable). PIR 47.5 for the burst light.
- **Camera:** pos [0.50,-3.45], 0.70 m high. Yaw 92, pitch +51 (the tilt up). 24 mm. Creep and drift back.
- **Subject:** The first big gold and red peony [1.2,9.5,21] fills the top of the frame. The 12 trails come up from the bottom into it.
- **Foreground:** the lantern string LS2 at the bottom-left edge (0.05,0.69).
- **Midground:** the trails and smoke columns.
- **Background:** the deep blue sky with stars, and the burst.
- **Light:** the f471 flash: a hot core, 8 star rays and coloured bloom, 2 frames. The whole garden takes the gold (gold_burst_flood), and the trails are lit in the burst colour.
- **Depth and haze:** haze 0.06 and the lit smoke dome; the far trails are paler.
- **Story action / focal point:** "and boom". Focal point: the burst centre.
- **Key props:** the rocket heads at the top of their climb.
- **VFX:**
  - A 640-star peony with stars that have drag and fall. Glitter, and smoke left as haze.
  - Never a flat disc.
  - Purpose: the big payoff; the frame's light changes.
- **Pose:** his lookup/L is off screen (he is below the frame); k:shocked on "boom".

## 10. RED f528-543 (the eased tilt down runs f481-527 through "millions of lights")
Rick frames: PIR 47.5 (main: fire light on a surface, reflection streaks), CART 62.5 (the sky full).
- **Camera:** pos [0.62,-3.95], 0.72 m high. Yaw 78, pitch +6.6, down 2.5 deg. 24 mm, 1.9 m. Creep.
- **Subject:**
  - He stands up in awe in the centre: head (0.54,0.50), feet (0.54,0.85), about 0.4 of the frame height.
  - The red peony [3.0,10,10.5] is at the top of the frame above him.
- **Foreground:** the bird table at the right edge (0.92,0.46), and snow with burst-colour bounce.
- **Midground:** the boy, the rack's east end at the left edge (0.02,0.62), and the fuse stake (0.08,0.66).
- **Background:** the kitchen window at the left edge, the hedge and fence in haze, and the sky full of bursts.
- **Light:**
  - The red burst key from above-front (#F08048 at f533). The ground goes red, then back to blue.
  - The moon is a side-back rim on the left.
  - The face and coat take the burst colour.
- **Depth and haze:** smoke haze lifts the darkest tones. Glitter falls behind him.
- **Story action / focal point:** "millions of lights, red". Focal point: his awed face, lit red.
- **Key props:** none new. Scorch and melt remain at the rack.
- **VFX:** red peony, glitter falling 3-5.5 s, crackles. Purpose: the colours land ON him (the next words are "all over his face").
- **Pose / expression:** rise/L (fingers out of his ears, standing, arms opening). Face: excited, then happy on "red".

## 11. FACE + LOOP f585-635 (green f544 and gold f554 play in the travel before it)
Rick frame: CART 66.3 (main: the hero's smug face, arms crossed, centred in front of the giant result, rimmed by the result's light).
- **Camera:** arcs from [1.35,-4.34] to the frame-0 pose [1.74,-3.76], 0.90 m high. Yaw 110 -> 118, pitch -4.0, down 7-8 deg. 35 mm. It ends exactly ON the f0 camera, so f635 joins f0.
- **Subject:**
  - The animator's current plan has him trot home (home/LB, f587-617) and lean on the rack at K. At f635 he is in the f0 spot: head about (0.69,0.45), a quarter of the frame height, right of centre, with the rack left of centre.
  - From the current bake, the f585 head is at the right edge (0.91).
- **Foreground:** the bird table at the right edge, and the tufts and flower pot at the bottom (FG_tufts_end).
- **Midground:** the boy and the rack (empty slots, scorch), the bucket, the box and the sparkler.
- **Background:**
  - the kitchen window and lanterns;
  - the cat peeking back on the eave (0.43-0.50,0.25), impressed despite itself;
  - gold willow trails and haze over him.
- **Light:**
  - warm_multi_face mood: glow 0.22 #ffb850. The burst light rims him from above.
  - For the loop, the last 1.5 s must ease back to the f0 cold_moon blue (lighting-director).
- **Depth and haze:** sky haze with glitter falling behind him.
- **Story action / focal point:** "all over his face". Focal point: his face lit by the colours, then the rack, as the loop lands.
- **Key props:** the empty rack, the smouldering scorch (fades by about f635).
- **VFX:** the gold willow drooping over his head, sky haze and glitter holding to the end, a crossette splitting at about f594. Purpose: the result above the hero.
- **Pose / expression:** cross/home (arms crossed, smug) on "face", then home to the rack, the awe face, one slow blink. The cat: two eyes peeking.

---

## Narration: what each sentence is about, and whether the framing shows it

| # | Sentence | What it is about | Shown in | Framing check |
|---|---|---|---|---|
| S1 | "This kid kneels by 12 rockets, and pulls a lighter out of his pocket." | the kid + his rack, then the lighter | f0-97 | YES: the hook shows kid + rack + rockets; f81-97 is a medium on the hands with the pocket yank. "pocket" (f107) falls on the push, but the hands stay in frame. |
| S2 | "Flick, flame, and the fuse spits sparks like an angry cat." | the lighter flame, then the fuse catching, then the angry-cat sparks | f134-243 | MOSTLY: flick shows the flame; the macro shows the tip catching and the spurt; the cat take shows his face plus the whisker fans. NOT YET: the flame covers the tip (Proposed change 1), and the real cat is tiny at the right edge (Proposed change 4). |
| S3 | "So he does the bravest thing he knows." | his fake bravery next to the creeping spark | f272-287 | YES: the boy in a hero pose, the whole rack and the spark on the rail; the pull back sets up the joke (he runs). |
| S4 | "He runs, fingers in his ears." | the panic run, then the ear cover | run f312-354, ears f356-370 | YES: he runs at the lens during the pull back; the ears rest has him crouched with his fingers on his ears and the rack in the left third. |
| S5 | "Whooosh! All 12 shoot past the lanterns and boom, millions of lights, red, green, gold, all over his face." | launch, then rockets past the lanterns, then the sky full, then the colours on his face | f392-635 | MOSTLY: the launch rack is big at f404; the tilt passes LS2 at f440; boom fills the sky; red lights him. NOT YET: the rest lands 12 f after "Whooosh" (Proposed change 3), and "face" is a wide, not CART 66.3's medium on the face (Proposed change 6). |

## Proposed changes (NOT applied: the animator is mid-round; gen_film.py untouched)
1. **Animator (acts):** aim hand_at for f168-216 about 3-4 cm ABOVE `fuse_end`, i.e. [0.14,-0.28,0.355]. Then the flame touches the tip from above and the wrapped tip reads sharp. Today hand_at lays the flame exactly over the tip as the lens sees it.
2. **Camera (macro):**
   - Move the macro lens 4 cm lower: pos z 0.36 -> 0.32, aim z 0.23 -> 0.24.
   - Swing yaw 142 -> 146.
   - This puts the tip against the rack planks and pushes the last arm sliver out of the top-right. Re-check the head-out and the lens gate.
3. **Camera (launch):** arrive at f398 instead of f404, i.e. station `S(WS("whooosh")) + 6`, so the rack is big while the 12 lift off (f392-400). Today the push is still landing during the lift-off.
4. **Camera (cat):**
   - Aim 0.25 m further right: aim [0.30,0.10,0.75], pitch about +7.
   - This brings the eave cat from x 0.87 to about x 0.75, readable at the right third while the boy stays whole. CAST_PERSONALITY's cat must be seen locked on the sparks.
   - Needs a check of the head cut on his right.
5. **Lighting-director / post:** a world-only shallow depth of field on the macro (f170-200: rack planks soft, tip sharp), as CART 52.8. The cast stays unblurred (CB_RULES 6b pass 3).
6. **Camera + animator (face):**
   - CB_RULES ENDING and CART 66.3 want a medium on his smug face on "face" (f590). Our face rest is a 35 mm wide whose loop pose shows him at a quarter of the frame height.
   - Proposal: at f585-605, a medium push to about 1.4 m, 35 mm, his head in the upper third. Then one 1.0 s pull back that lands on the f0 pose at f635 (check the peak speed ≤60).
   - This needs the animator to move the home trot later (f605-630).

## Fix round 4 (camera-director, applying the SHOT_SPEC proposals)

**Result.** Plan check 0 FAIL, 3 WARN of 41 gates:
- speed peak 83 px/f on the f204-210 pull-out (WARN band ≤90, over 60 for about 7 f);
- head width p90 0.55;
- feet height median 0.72.

frame_check:
- down-angle max 7.8 deg with him in frame;
- the real head in the caption band only on f516-520;
- the camera inside no solid.

Renders: episode kit, `preview/camera/fix4/` (f0, 90, 150, 185, 210, 216, 220, 236, 280, 360, 398, 410, 470, 535, 560, 586, 610, 635) and `sheet_fix4.png`.

I touched only the camera stations, plus a block of camera-director knobs right above `ST` in plan/gen_film.py. I made no SET change this round. The acts, moods and sets are untouched.

### The five changes
1. **Macro f175-199.**
   - Change: yaw 142 -> 146 (pos [0.94,-0.86,0.36], aim [0.13,-0.29,0.22], 85 mm), looking 8 deg down.
   - Result: the frame top runs under his chin, and the stake, the flame and the fist round the lighter sit together in the centre.
   - Why not lower: I tried the lens at 0.32 m, and his head came in at the top. The lens stays at 0.36 m.
   - Still open: on f185 the 3D lighter still sits upper-left of the fist circle. That is the animator's grip fix.
   - **Depth of field:** the kit's look pass (kit_patch/threejs_film/film.js, renderLook) already blurs the world only. It uses a character mask, so cards stay crisp, and focus = the aim distance. But `dof` is set for the whole film or place only (film.post / places.post); the lighting-director's post has dof 0. **Proposed one-line kit patch:** in renderLook, `u.dof.value = c.dof ?? cfg.dof` (the baked camera frame `c`). film_plan would then need to pass a station's `dof` into its baked frames, so the macro station can carry `dof: 1.2` and nothing else changes. Note: the 3D lighter is a world mesh, not a card. It sits at the focus distance, so it stays sharp.
2. **Launch.** Now arrives on **f398** (`S(WS("whooosh")) + 6`, rest f398-407). The whole rack is big while the 12 lift off f392-400, with the trails rising.
3. **Cat take f229-243.**
   - Change: the aim is now [0.30,0.06,0.70]. cat_spot moves from x 0.87 to **(0.76,0.39)**, on the kitchen-extension roof edge in the right third, and the boy stays whole.
   - **Note:** film.json cast has only the boy. No cat card or mesh exists yet, so the perch is empty in every render.
4. **f200-229 re-route.**
   - Change: a new waypoint at f216 (pos [1.10,-1.35,0.42], aim [0.14,-0.32,-0.32], 26 mm). The lens goes WIDE while looking DOWN at the spitting stake, then tilts up into the cat take.
   - Result: every frame where his head would be big (head width 0.5-2.0 of the frame, f200-217) has the head fully out of frame. It enters only at width 0.40, at the top for f219-222, and is whole from f223.
   - Cost: f210-217 is mostly snow with the stake and his coat at the top, and the travel peaks at 83 px/f (f204-210, WARN).
5. **Ending.**
   - The red rest is shortened to f528-536.
   - **Medium on his face f548-586** (35 mm, 1.6 m in front of him at RUN_TO, lens 0.85 m): his head half the frame width, centred at (0.50,0.40) above the captions, through green f544 and gold f554 with the burst light on him (CART 66.3).
   - Then one pull back (travel 1.4 s, f586-628) while he walks home, landing on a creep that ends exactly on the f0 pose (f628-635).
   - His head x stays at 0.37-0.69 on f584-635, never near the right edge (the old f585 cut is gone).

### Beat frames, round 4
| Beat | Frames |
|---|---|
| hook | f0 (push f1-80) |
| lighter | f81-97 |
| flick | f134-148 |
| macro | f175-199 |
| wide pull-out | f200-216 |
| tilt up | f217-228 |
| cat | f229-243 |
| bravest | f272-287 |
| ears | f356-370 |
| launch | f398-407 |
| lanterns pass | f440 |
| boom | f466-480 |
| red | f528-536 |
| punchline medium | f548-586 |
| pull back to the loop | f587-627 |
| loop creep | f628-635 (= f0 camera) |

## Fix round 5 (camera-director: world-only DOF on the macro + the "angry cat" re-route)

**Result.** Plan check (`python3 kit_patch/film_plan.py check film.json`): 0 FAIL, 3 WARN.
- speed peak 82 px/f on f197-202, the pull-out pass;
- head width p90 0.55;
- feet height median 0.72.

frame_check: down-angle max 7.8 deg. Renders are in `preview/camera/fix5/` (f185, 190, 200, 204, 208, 212, 216, 224, 232, 240) plus `sheet_fix5.png`.

### Depth of field
The world-only depth of field is IN and works.
- **Kit line:** one line in kit_patch/threejs_film/film.js renderLook: `u.dof.value = c.dof ?? cfg.dof`.
- **Bake:** the episode copy **kit_patch/film_plan.py** (tools/film_plan.py plus one pass-through) writes a station's `dof` into its REST frames only.
- **Setting:** macro station `dof=MACRO_DOF` (3.0), giving dof on f175-192.
- **Look:** on f185 and f190 the rack planks and bars are soft. The fuse stake, the 3D lighter (it sits at the focus distance) and the card are crisp. The cards are masked, so they never blur.
- **WARNING:** anyone who re-runs `../../tools/film_plan.py check` bakes WITHOUT the dof. I saw this happen once this round. Use `python3 kit_patch/film_plan.py check film.json` from now on.

### Angry-cat re-route, f193-243
- **Macro:** yaw 146 -> **133** (pos [0.812,-1.021,0.36], aim [0.13,-0.29,0.22], 85 mm). The rest is shortened to f175-192 (hold 0.6), so the turn stays one way: flick 120 -> macro 133 -> cat take 133.
- **Pull back f193-218:** one pull back through a fast pass point at f207 (28 mm, low, looking down the spitting stake). The lens widens while his head is above the frame. Then it tilts up.
- **Cat take f219-243:**
  - Framing: one low rest, 26 mm, lens 0.30 m, about 12 deg up past the stake. pos [1.70,-1.40,0.30], aim [0.336,0.063,0.725].
  - Contents: the spitting stake low-left (0.23,0.65); his frozen tongue-out face mid-left, head (0.41,0.46) and width 0.33; the extension eave at upper right with cat_spot at **(0.68-0.73,0.44)** from "angry" (f221) through "cat" (f232); house, lanterns and moon behind.
- **Still open:**
  - His head comes in sliced at the top for about 5 frames (f204-208) during the fast pass. It is whole from f212.
  - f200-208 is mostly snow under the stake.
  - There is still no cat in film.json's cast, so the eave is empty in the renders.
  - The brown bits on the snow belong to the vfx.

### Beat frames, round 5
| Beat | Frames |
|---|---|
| macro | f175-192 |
| pull back | f193-218 (pass point f207) |
| cat take | f219-243 |

Every other beat is as in round 4.

## Fix round 6 (camera-director, storyboard-judge report r2)

**Result.** Plan check (`python3 kit_patch/film_plan.py check film.json`): 0 FAIL, 3 WARN.
- speed peak 77 px/f on the macro pull-out pass;
- speed p90 27;
- feet height median 0.75.

frame_check: down-angle max 7.8 deg; the real head in the caption band only on f516-521.

**Renders** (`preview/camera/fix6/`):
- rests f0, 89, 141, 185, 236, 280, 363, 532, 627;
- dense strips f300-318 and f370-388;
- phone-size (about 360 px tall) sheets `rests_fix6_360.png`, `strip_f300-318_360.png` and `strip_f370-388_360.png`.

All changes are in the camera stations, as knobs above `ST`.

### The eight items
1. **Hook f0.**
   - Change: lens 0.70 m (was 0.90), 0.2 m closer, tilted up (`HOOK_POS/HOOK_AIM`). The loop end uses the same pose.
   - Result: feet at y 0.75, so snow is about 25 %. Head at (0.70,0.53), width 0.23.
   - The bird-table post now sits just past the right edge.
2. **Lighter f81-97 and flick f134-148.**
   - Change: backed off to 3.0-3.3 m at 35 mm, so the whole kneeling body is in frame with head width 0.26-0.29. Head is at (0.60,0.41), and the aim is at chest height so the fist sits around y 0.50.
   - Yaw goes 104 (lighter) -> 110 (flick) -> 133 (macro); the flick station stays off the bird-table line.
3. **Macro.** The aim moved 7 cm left (`MACRO_AIM`), putting the tip and flame right of centre. Seen from the SE, the coat card is always about 3 cm right of the stake, so it can never leave the frame entirely. It is now only a dark sliver at the right edge (f185).
4. **Bravest.** Aimed 0.3 m right and pulled back 0.3 m. Head (0.57,0.37-0.40), width 0.27, whole for the whole rest. The hold is shortened to 0.3 s (f272-281) to make room for the cat beat.
5. **Ears.**
   - The rest runs f356-382 (hold 0.87), and the aim moved 0.25 m right.
   - He is whole through the peek, head x 0.67-0.77 up to f384.
   - He slides out only on the fast push to the launch, f385-389.
6. **CAT BEAT, f301-318 (new station).**
   - Framing: 55 mm from [2.52,-2.41,0.90], with the boy as the foreground left (head (0.33-0.40,0.41-0.51), width 0.42). The eave cat is upper right, crouching, then leaping off at f310 (cat top (0.72-0.80,0.08-0.14)).
   - Size: the cat is **about 8 % of frame height**. 12 % is not reachable with him in the foreground: the cat is 3 m up and 7 m behind him, and the lens gate caps us at 55 mm. Cat size over head width is fixed at about 0.2 by that geometry, so a 12 % cat would need a head width of about 0.6.
   - Cat take f219-243: pulled back 0.8 m. The cat is still small, about 4 % of frame height.
7. **Red.** Orbited 14 deg west round him (`RED_POS`). The red burst now sits behind his head, clear of the post, which stays at the right edge (f532).
8. **Pull back and loop.** The new hook pose keeps the post out of frame at f627 (lo1 0.137; f0 lo1 0.133). The loop still ends exactly on the f0 pose.

### Beat frames, round 6
| Beat | Frames |
|---|---|
| hook | f0 |
| lighter | f81-97 |
| flick | f134-148 |
| macro | f175-193 |
| pull-out | f194-218 |
| cat take | f219-243 |
| bravest | f272-281 |
| **cat beat** | **f301-318** |
| ears | f356-382 |
| launch | f398-407 |
| lanterns | f440 |
| boom | f466-480 |
| red | f528-536 |
| face medium | f548-586 |
| pull back | f587-627 |
| loop | f628-635 |

## Fix round 7 (camera-director, storyboard-judge report r3)

**Result.** Plan check (`python3 kit_patch/film_plan.py check film.json`): 0 FAIL, 2 WARN.

**Renders:** `preview/camera/fix7/` (f165, 175, 185, 193, 300, 310, 318, 532) and `sheet_fix7.png`.

All changes are in the camera stations only.

1. **Macro f175-193.**
   - Change: same lens position, yaw about 133, 85 mm, and the world-only depth of field (dof 3.0) is kept. `MACRO_AIM` moves back right to [0.151,-0.270,0.22].
   - Why it now works: the hand target FUSE_AIM_T sits 6 cm to screen-right of the tip, so the fist lands BESIDE the stake and the stake never hides the case. Measured from the animator's hands.json: the tip is at (0.44,0.26) and the fist/case target at (0.69,0.17).
   - Result: fist, case, flame and tip read together on f175-193.
   - Cost: the coat card is back in the right fifth. That is the price of keeping the fist in frame.
   - The turn stays one way: flick 110 -> macro 133 -> cat take 133.
2. **Red f528-536.** Panned 7 deg left (`RED_AIM` [0.796,-1.911,0.95]). The bird-table post is out of frame. The red burst fills the upper left behind him, and his head is whole on the right. The hook is unchanged.
3. **Cat beat f301-318.** Checked against the animator's new cat bake:
   - crouch f296-310 at (0.77-0.82, top 0.08-0.10);
   - leap f312-318 at (0.78->0.74, 0.10-0.12);
   - the arc stays in frame on the travel out, landing at (0.39,0.52) on f336.
   - The cat is about 8 % of frame height, and the boy is the foreground on the left.

### Fix round 7b (re-check against preview/anim/fix6/hands.json, lighter cheat removed)
Aim unchanged. On f170-196 the fist (0.62-0.69) and the flame (0.51-0.58) sit beside the tip (0.44), all in frame; renders are in `preview/camera/fix7b/`. On f188-196 the stake still crosses the left edge of the case, while the fist, the flame on the tip and most of the case read.

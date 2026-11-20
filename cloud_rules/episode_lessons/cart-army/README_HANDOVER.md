# Cart army match: handover (2026-11-11 about 18:25Z)
CB: "lets copy exact same. and learn from it what it takes to create the same." Shot-for-shot learning match of Rick's "How One Cart Stopped an Entire Army", his voice track, our flat cast.
## Rebuild the cloud workspace
    mkdir -p /home/user/sk && tar xzf /mnt/project-files/episodes/roller-coaster/kit/kit_latest/skill_kit_latest.tar.gz -C /home/user/sk
    K=/mnt/project-files/episodes/roller-coaster/kit/kit_latest/character_template_v13_merged
    cp $K/{char2d,bodies,castkit}.mjs /home/user/sk/templates/vector2d_characters/code/; cp $K/{poses,puppets}.mjs /home/user/sk/templates/threejs_film/
    cp -r /mnt/project-files/episodes/cart-army /home/user/sk/episodes/
Two small kit patches in templates/threejs_film/film.js (needed by sets/fort.js): line 77 camera far plane 600 -> 1500; line 86 ctx gets `camera: cam` (the army cards turn to the lens).
Run from episodes/cart-army: `python3 plan/gen_film.py && python3 ../../tools/film_plan.py check film.json` then `node ../../templates/threejs_film/render.mjs film.json --frames 15,165`.
His video: stage from the PC references\video\How One Cart Stopped an Entire Army - Ricks Clips (1080p, h264)\ (mp4, mp3, cart_words.json).
## State
- SHOT_TABLE.md (36 pictures), WHAT_IT_TAKES.md: done.
- sets/fort.js: ONE world (yard, wall, gate, pavilion, tower, wall walk, valley, mountains, clouds), the rig (board, holes, cart, arrows, tubes, strings, rope, coat, glow) driven by place events, army of 320 instanced cards, rain, ladders, ground crack, smoke trails, fireball. Light names: day, golden (dusk), night, morning (sunrise). First version, runs, far below his look.
- cast/sheets/cartarmy.mjs: inventor (+ coat-off version), commander, 5 fort soldiers, general, enemy.
- plan/gen_film.py: shots 1-11 only (0-19.4 s), rough cameras; sun set with light_over dir [-5, 9, -6] so the yard face of the wall is lit.
- preview/blockin_v1.jpg: his frames over ours at 0.5, 5.5, 8.5, 11, 13.7, 15 s.
## Known gaps after block-in v1 (fix in this order)
1. Grass blades are fat and cover the lower frame at low cameras: thinner, shorter, a clear patch near each camera spot; his grass is fine and dense with light and dark patches.
2. Characters too small and wrong pose: inventor must be side view, bent over the hand drill (new move), about 40 % of frame height in shot 1; commander big at left in shot 8.
3. Stone wall: bigger rough blocks with bevels, lighter warm grey; arch niche with the warm light shaft is in the wrong place and shape.
4. Valley: lush terraces, road, river, haze; general on a litter under a parasol; army cards need shields and banners.
5. Shots 12-36, the four other lights, all effects timing, dissolves, held props (drill, torch, hammer), new motions (list in WHAT_IT_TAKES.md).
6. Then: dense strips against his (plan/strip.py from the kit), side-by-side animatic at --scale 1, Blender look.

## Round 3 (2026-11-11 about 19:10Z): block-in v2 of shots 1 to 11
Files here are now round 3 (sets/fort.js, sets/ep_kit.js, plan/gen_film.py, plan/cmp.py). Sheet: preview/blockin_v2.jpg (his on top, ours below).
- IMPORTANT: after every `python3 plan/gen_film.py` run `python3 ../../tools/film_plan.py check film.json`. The renderer reads the baked plan in out/plan, so without the check the old plan is rendered.
- `python3 plan/cmp.py out/x.jpg 15 36 110 ...` builds his frame over ours for the given frames (needs his mp4 staged in the cloud).
- Screen direction: with the camera looking south (at the yard face of the wall) plan +X is screen LEFT.
- New in the set: real stone blocks on the wall in the inventor's corner, warm arched doorway at x 10.9 with light spill, hand drill (event `drill`), bent drilling poses drill0..3, stable fence and second tower in the east, general's litter with parasol (object `litter`, the general rides it with ep_seats), army_front_1..3 seat objects, march dust, roadside grass, gate arch fill, valley terrain 280 segments with its own lift.
- Places: fort_day (sun dir [-9, 7, -1.5], rakes the wall) and fort_valley (same set, sun from the south west, for shots 3 and 5).
- Still weaker than his in shots 1 to 11: grass (short, flat lit), no long cast shadows on the grass, inventor has a cap instead of hair and headband, commander face kinds (only standard, open, smirk, happy, angry, sad, surprised, talk exist as k: faces), general small on the litter, no sword, army cards plain (no shields, spears), gate shot wall face dark, cart shafts and stand detail, paper tubes with fuses, held hammer, crowd soldiers walking by.
- Not started: shots 12 to 36.

## Round 4 (2026-11-11 20:15Z): all 36 shots blocked, side-by-side v1
sets/fort.js and plan/gen_film.py here are round 4. preview/side_by_side_v1.mp4 = his film left, our animatic right, his voice (animatic rendered with --step 3, about 8 s per frame in the cloud, 45 minutes; run it in the background with a 2 hour limit).
- Places: fort_day, fort_valley, fort_dusk (golden), fort_night (rain), fort_rise (morning), fort_charge, fort_battle. Wall scenes play on a new paved terrace west of the gate (WALK = [-10, 2.6]); gen_film.py shifts the wall-top coordinates by SH = -18 at the end.
- inventor2 = the inventor in his shirt (coat off), swapped at 31.7 s; he lies on the coat with an ep_seats roll of 90.
- Rough in shots 12 to 36: slap effect lines, crack blocks, coat cloth, torch, lantern, ladders seen from the walk, the single rocket label picture (31), front row army faces (26), fly-through (30) is washed out, trails and fireball shapes, the enemy helmet at the wall (24).

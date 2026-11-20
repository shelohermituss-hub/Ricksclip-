# Roller coaster match demo: handover (2026-11-11, about 10:20Z)

Everything from the old thread's cloud machine is in this folder. A new machine can rebuild it like this.

## Rebuild the cloud workspace
    mkdir -p /home/user/skill/episodes /home/user/skill/templates /home/user/skill/tools
    cp -r /mnt/project-files/episodes/roller-coaster /home/user/skill/episodes/            # episode (film.json, sets, plan, out/lock, out/stills, out/plan)
    cp -r /mnt/project-files/episodes/roller-coaster/work_2026-11-11/kit_threejs_film /home/user/skill/templates/threejs_film
    cp -r /mnt/project-files/episodes/roller-coaster/work_2026-11-11/templates/vector2d_characters /home/user/skill/templates/
    cp -r /mnt/project-files/episodes/roller-coaster/work_2026-11-11/tools/* /home/user/skill/tools/
(The kit in work_2026-11-11 is a copy of the PC skill's templates/threejs_film and tools; the PC is the master. Playwright and Chromium are pre-installed in the cloud; do not install them.)

## Storyboard (three.js)
Run from /home/user/skill/episodes/roller-coaster:
- `python3 plan/gen_film.py` writes film.json (all look values are here: SKY_DAY, SKY_NIGHT, "ep_grade", "ep_detail").
- `python3 ../../tools/film_plan.py check film.json` runs the plan gates and bakes out/plan (9 camera/framing gates still FAIL: camera re-plan is not done).
- `node ../../templates/threejs_film/render.mjs film.json --frames 90,444,870` renders stills to out/stills/f_#####.png (about 2 s each).
- `python3 plan/match_sheets.py v5` renders the 46 key frames and builds preview/match_v5_part1-5.jpg (his frame left, ours right). It reads Rick's video from the PC skill folder staged at /mnt/user-data/uploads/Downloads/Ricks Clips Animation Skill/references/video/ (stage it with device_stage_files) and caches frames in REF_CACHE.
- `sets/ep_kit.js` is the episode layer over the untouched set files. New on 2026-11-11: RICK GRADE (film.json ep_grade: fog/haze, greens, dirt, night desaturation, sky dome) and SURFACE DETAIL (film.json ep_detail: procedural grain, plank seams, nails, bark, grass, pebbles by material label). Backups from before: work_2026-11-11/ep_kit.before_grade.js, gen_film.before_grade.py.
- Latest sheets: preview/match_v4_part1-5.jpg.

## Blender look (runs on the PC, GPU, seconds per frame)
- Script: look/look_rc.py (same file on the PC at episodes\roller-coaster\look\look_rc.py). Painted banner images: look/banners/.
- Usage: `blender --background --factory-startup --python look_rc.py -- <place> <tag> <res %> <samples> <frames csv> [options]` -> out\look\<tag>\<place>\f_#####.png + result.json.
  Places: road, midway, station_night, station_day, park, field. Options: style=real (BlenderKit car and trees, natural grass), seat_z2= glass_refl= (driver in car), spot= nt=r,g,b bulb= (night light), sky_light= exposure= (day brightness), held=<who>:<x>,<y>,<r px>:<hex> (3D balloon in front of a 2D held one), brick= clump= trees=alder banner=font.
- Settings that gave the frames CB saw: road `road rN 75 48 1260,1311 style=real seat_z2=-.12 glass_refl=.12`; night `station_night nN 75 48 444 spot=90 nt=.2,.25,.46 bulb=40`; midway `midway mN 75 48 870 sky_light=.5 exposure=-.1 held=girl:680,920,36:e3242b`.
- On the PC start it from the Blender connector with subprocess.Popen on a .bat (pattern: out\run_r3.bat, writes out\LOOK_WAITING.txt while it runs). One Blender job at a time; check other episodes' out\RENDER_RUNNING.txt / *WAIT*.txt first. After changing look_rc.py in project files wait 10 s, then device_commit_files to the PC.
- The lock (out/lock) on the PC is from BEFORE the grade and detail pass. The Blender look does not read ep_grade/ep_detail; it has its own materials. Re-export the lock only if set geometry changes.
- BlenderKit models on the PC in library\blenderkit: studebaker_1953, pine_siberian_a3, alder_tall, alder_medium, toon_tree_bushy, toon_tree_wide, toon_tree_spreading, spruce_7m, hot_rod_cenek (not placed yet), maple_trees and grass_small_patch (not used).
- Blender test frames copied here: work_2026-11-11/blender_frames (r7, r9 road; n4, n7 night; m2, m5 midway). m6 (midway with the 3D balloon and mesh colours) is rendered on the PC at out\look\m6\midway\f_00870.png and has NOT been looked at yet.
- Pair builder: work_2026-11-11/post/post_pairs logic is in look/post_pairs.py (grade(), caption()); Rick stills rick_14.8/29.0/42.0/43.7.png in work_2026-11-11/post. Since CB's rule of 10:00Z do NOT apply grade() (no added contrast or dark corners).

## What CB decided on 2026-11-11 (all in CB_RULES.md section 3 unless noted)
1. Toon/paint Blender finish rejected. Real BlenderKit models, detailed landscape, natural colour: "yes thats looks much better".
2. Workflow: the old Stage 1 / Stage 2 workflow stays for this film; the simple-stand-in workflow is tested on a later episode.
3. Light and brightness are finished in the coded storyboard; Blender only adds materials, textures and effects and keeps the coded look. No dark spotlight nights, no added contrast.
4. Night: light on platform and character; background trees and field stay dark.
5. Banner lettering must look hand-painted and part of the cloth (done: look/banners).
6. Props near the character need a real material; "you need to make a real balloon" (held props are 2D cards today).
7. Storyboard must carry Rick's grade, saturation and haze, plus more surface detail (done in v4, CB has not answered yet). NOT yet in CB_RULES.md or SKILL.md.

## Open work, in order
1. CB's verdict on match_v4 sheets (colour, haze, detail).
2. Storyboard content: night field dirt path and grass tufts, leafy trees instead of ball trees, UPSIDE-DOWNER lettering on the cart, fire-and-smoke explosion, held props (balloon) as 3D objects that follow the hand.
3. Blender: look at m6; midway stalls/flags colours (mesh_colours step), stump too dark at night, night banner letters small and grainy, road: orange bank from the land's vertex colours (done in code, r10 rendered on PC, not looked at), camera on his spot.
4. Camera re-plan (fewer stops, long slow moves, low and high angles), one joined park, motion library, full Blender look for all places, final render. Rick's audio is the voice track.
5. Write rule 7 into CB_RULES.md and SKILL.md (back up first, refresh the installed skill), after CB's verdict.
This thread can no longer attach files (24 of 24 used); pictures must be shown in the new thread.

#!/bin/bash
# round 3: waits for any earlier cabin render_all, renders both drafts (half size), then the checks
cd /home/user/Ricksclip-; S=episodes/astro-flush-study/shots/cabin
# (round 3) the plan must be re-baked after every make_film.py: the renderer reads out/plan/*_baked.json, not the acts
for d in cab4 bay5; do python3 tools/film_plan.py check $S/$d/film.json > $S/$d/plan_check.txt 2>&1; done
node templates/threejs_film/render_gpu.mjs $S/cab4/film.json --scale 0.5 --grab fast --frames 284-422 > $S/cab4/render.log 2>&1
node templates/threejs_film/render_gpu.mjs $S/bay5/film.json --scale 0.5 --grab fast --frames 411-499 > $S/bay5/render.log 2>&1
for d in cab4 bay5; do
  node tools/motion_objects/check_objects.mjs $S/$d/film.json > $S/$d/check_objects.txt 2>&1
  node tools/collide/check_collide.mjs $S/$d/film.json --window $([ $d = cab4 ] && echo 284-422 || echo 411-499) > $S/$d/check_collide.txt 2>&1
  node tools/frame_checks/check.mjs $S/$d/film.json > $S/$d/frame_checks.txt 2>&1
  node tools/camsafe/validate.mjs $S/$d/film.json > $S/$d/camsafe.txt 2>&1
done
echo DONE

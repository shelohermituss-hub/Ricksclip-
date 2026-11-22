#!/bin/bash
# renders both drafts (half size) one after the other, then the checks
cd /home/user/Ricksclip-; S=episodes/astro-flush-study/shots/cabin
node templates/threejs_film/render_gpu.mjs $S/cab4/film.json --scale 0.5 --grab fast --frames 284-422 > $S/cab4/render.log 2>&1
node templates/threejs_film/render_gpu.mjs $S/bay5/film.json --scale 0.5 --grab fast --frames 411-499 > $S/bay5/render.log 2>&1
for d in cab4 bay5; do
  node tools/motion_objects/check_objects.mjs $S/$d/film.json > $S/$d/check_objects.txt 2>&1
  node tools/collide/check_collide.mjs $S/$d/film.json > $S/$d/check_collide.txt 2>&1
  node tools/frame_checks/check.mjs $S/$d/film.json > $S/$d/frame_checks.txt 2>&1
  node templates/threejs_film/../../tools/camsafe/validate.mjs $S/$d/film.json > $S/$d/camsafe.txt 2>&1
done
echo DONE

#!/bin/bash
# renders the three drafts (half size) one after the other
cd /home/user/Ricksclip-; S=episodes/astro-flush-study/shots/toilet
node templates/threejs_film/render_gpu.mjs $S/s1/film.json --scale 0.5 --grab fast --frames 0-41 > $S/s1/render.log 2>&1
node templates/threejs_film/render_gpu.mjs $S/s6/film.json --scale 0.5 --grab fast --frames 495-537 > $S/s6/render.log 2>&1
node templates/threejs_film/render_gpu.mjs $S/s12/film.json --scale 0.5 --grab fast --frames 998-1199 > $S/s12/render.log 2>&1
echo DONE > $S/render.done

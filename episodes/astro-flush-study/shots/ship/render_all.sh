#!/bin/bash
# moving drafts at scale 0.5 (round 2), one after the other
cd /home/user/Ricksclip-; S=episodes/astro-flush-study/shots/ship
for sp in s11:867-1006 s7:531-712 s2:29-140 s8:706-770 s9:763-802; do n=${sp%%:*}; r=${sp#*:}
  node templates/threejs_film/render_gpu.mjs $S/$n/film.json --scale 0.5 --grab fast --frames $r > $S/$n/render.log 2>&1; echo "$n done" >> $S/render.done; done

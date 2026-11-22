#!/usr/bin/env bash
# overlay_keys.sh: the kit's drawn layer (power-moment focus lines, glints, captions, transitions) for every key frame -> <s>/out/overlay/o_#####.png
# (render.mjs --overlay, half size for the 540x960 previews; the film uses --scale 1). The finish lays it over the graded Blender frame.
R="$(cd "$(dirname "$0")/../../../.." && pwd)"; EP="$R/episodes/plane-eater"; SC=${SCALE:-0.5}
python3 -c "import json;[print(s, ' '.join(map(str,c['keys']))) for s,c in json.load(open('$EP/look/film/stretches.json')).items()]" | while read s ks; do
  for f in $ks; do node "$R/templates/threejs_film/render.mjs" "$EP/$s/film.json" --overlay --range "$f-$f" --scale "$SC" 2>&1 | grep -E "overlay ->|rror"; done; done
echo OVERLAY_END

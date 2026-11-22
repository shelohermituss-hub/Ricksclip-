#!/usr/bin/env bash
# overlay_all.sh [stretch ...]: the kit's drawn layer (captions, glints, transitions) at 1080x1920 for every frame of each stretch window
# -> <s>/out/overlay/o_#####.png (film frame numbers). render.mjs --overlay --scale 1 --range f0-f1 (one page load per stretch).
D="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$D/../.." && pwd)"; R="$(cd "$EP/../.." && pwd)"
for s in ${@:-s1 s2 s3 s4 s5}; do W=$(python3 -c "import json;w=json.load(open('$D/stretches.json'))['$s']['window'];print('%d-%d'%tuple(w))")
  T0=$(date +%s); node "$R/templates/threejs_film/render.mjs" "$EP/$s/film.json" --overlay --scale 1 --range "$W" 2>&1 | grep -E "overlay ->|rror"; echo "OVERLAY $s $W $(( $(date +%s) - T0 )) s"; done
echo OVERLAY_ALL_END

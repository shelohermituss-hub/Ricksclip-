#!/usr/bin/env bash
# render_keys.sh <stretch> [<stretch> ...]: the stretch's key frames (stretches.json "keys") in Blender, 540x960 24 spp, then grade/outline + KEYS_FILM.jpg
R="$(cd "$(dirname "$0")/../../../.." && pwd)"; EP="$R/episodes/plane-eater"
for s in "$@"; do
  K=$(python3 -c "import json;print(','.join(map(str,json.load(open('$EP/look/film/stretches.json'))['$s']['keys'])))")
  B=$(python3 -c "import json;print(json.load(open('$EP/look/film/stretches.json'))['$s']['set_blend'])")
  blender -b "$EP/$B" --python "$EP/look/film/film_lock.py" -- "$s" keys "$K" 2>&1 | grep -E "FRAME|SALT|HELD|KEPT|MOTION|Traceback|Error:"
done
python3 -I "$EP/look/film/finish_keys.py"
echo RENDER_KEYS_END

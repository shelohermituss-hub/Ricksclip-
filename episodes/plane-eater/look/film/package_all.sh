#!/usr/bin/env bash
# package_all.sh <stretch ...>: RunPod package per stretch (episodes/plane-eater/runpod/<s>/: scene.blend + cards/ + frames.json + render.sh + job_film.py
# + finish tools) and the packing test here: ONE key frame at PCT=10, SPP 8, CPU (ALLOW_CPU=1), which must give a final picture.
D="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$D/../.." && pwd)"
for s in "$@"; do
  B=$(python3 -c "import json;print(json.load(open('$D/stretches.json'))['$s']['set_blend'])"); K=$(python3 -c "import json;print(json.load(open('$D/stretches.json'))['$s']['keys'][0])")
  rm -rf "$EP/runpod/$s"; blender -b "$EP/$B" --python "$D/film_lock.py" -- "$s" package "$EP/runpod/$s" 2>&1 | grep -E "PACKAGE|SEQ|PACK_FAIL|Traceback|Error:"
  ( cd "$EP/runpod/$s" && rm -rf out && T0=$(date +%s) && ALLOW_CPU=1 PCT=${TPCT:-10} SPP=8 bash render.sh "$K" "$K" | tail -2 && echo "TEST $s f$K $(( $(date +%s) - T0 )) s"; mkdir -p "$D/pkg_test"; cp out/final/f_*.png "$D/pkg_test/${s}_test.png"; rm -rf out )
  du -sh "$EP/runpod/$s"
done
echo PACKAGE_ALL_END

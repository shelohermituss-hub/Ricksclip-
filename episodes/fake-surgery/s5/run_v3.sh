#!/usr/bin/env bash
# S5 v3: the ONE command chain (from s5/). render_final skips existing files, so final/raw, handles, frames are deleted first.
cd "$(dirname "$0")"
python build_film.py && HANDLE=1 python build_film.py && HANDLE=2 python build_film.py && python ../../../tools/film_plan.py bake film.json | tail -1
rm -rf final/raw final/handles final/frames out/.puppet_cache
python final/render_final.py > final/render_v3.log 2>&1
python final/make_final.py > final/make_v3.log 2>&1
python ../../../tools/frame_checks/flicker.py final/frames > final/flicker_v3.txt 2>&1
python ../../../tools/check_film.py final/preview.mp4 > final/check_film_v3.txt 2>&1
timeout 420 node ../../../tools/frame_checks/check.mjs film.json > board/checks_v3.txt 2>&1
echo V3_DONE

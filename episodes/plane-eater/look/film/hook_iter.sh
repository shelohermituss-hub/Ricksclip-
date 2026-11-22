#!/usr/bin/env bash
# hook_iter.sh: S1 hook cycle = hand targets for the hook camera -> re-posed drawings -> a low-res f0 + f40 test render (env HOOK_* override the camera)
D="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$D/../.." && pwd)"; R="$(cd "$EP/../.." && pwd)"
blender -b "$EP/sets/apron/out/apron.blend" --python "$D/film_lock.py" -- s1 hats 2>&1 | grep -E "HATS|Traceback" | cut -c1-200
node "$D/fix_s1_cards.mjs" | tail -1
W=${W:-270} H=${H:-480} SPP=${SPP:-8} blender -b "$EP/sets/apron/out/apron.blend" --python "$D/film_lock.py" -- s1 keys ${KEYS:-0,40} "${OUT:-$D/hook_test}" 2>&1 | grep -E "FRAME|Traceback"

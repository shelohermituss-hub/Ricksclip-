#!/usr/bin/env bash
D="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$D/../.." && pwd)"
blender -b "$EP/sets/cabin/out/cabin.blend" --python "$D/film_lock.py" -- s5 keys 969,1001 2>&1 | grep -E "FRAME|Trace"
python3 -I "$D/finish_keys.py" | tail -1
TPCT=25 bash "$D/package_all.sh" s1 s2 s3 s4 s5
echo CHAIN6_END

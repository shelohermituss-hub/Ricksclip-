#!/usr/bin/env bash
D="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$D/../.." && pwd)"; O="$D/keys_fix"
blender -b "$EP/sets/apron/out/apron.blend" --python "$D/film_lock.py" -- s4 keys 675,700,770,800,825,838 "$O" 2>&1 | grep -E "LATE|DUMP_APPLIED|SEASONS|FRAME|Traceback|Error:"
blender -b "$EP/sets/xray/out/xray.blend" --python "$D/film_lock.py" -- s3 keys 540,592,600 "$O" 2>&1 | grep -E "XRAY|EXPO|FRAME|Traceback|Error:"
blender -b "$EP/sets/apron/out/apron.blend" --python "$D/film_lock.py" -- s2 keys 450,480 "$O" 2>&1 | grep -E "HELD|FRAME|Traceback|Error:"
blender -b "$EP/sets/cabin/out/cabin.blend" --python "$D/film_lock.py" -- s5 keys 1020 "$O" 2>&1 | grep -E "FRAME|Traceback|Error:"
echo CHAIN8_END

#!/bin/bash
# render the proof stills of set.blend (preview light only) and compose SET_SHEET.jpg. Usage: bash run_sheet.sh  (env SPP, THREADS, SHOTS)
D="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$D/sheet"
blender -b --factory-startup --python "$D/build_set.py" -- sheet "$D" "$D/sheet" > "$D/sheet/log_sheet.txt" 2>&1
grep "SET_RENDERED\|Traceback\|Error" "$D/sheet/log_sheet.txt"
python3 "$D/make_sheet.py" "$D/sheet"
echo SHEET_DONE

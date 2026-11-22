#!/bin/bash
# build_cabin.sh: pictures (PIL) then the whole place in Blender -> out/cabin.blend, cabin_lite.glb, cabin_meta.json
# stills: blender -b out/cabin.blend -P scripts/still_cabin.py -- f300 f430 ...   then   python3 scripts/proof_cabin.py
set -e; cd "$(dirname "$0")"
python3 scripts/tex_cabin.py
python3 ../../../../tools/check_midline_comments.py scripts
blender -b -P scripts/bl_cabin.py 2>&1 | grep -E "BUILT|Error|Traceback|line |error" || true
ls -la out

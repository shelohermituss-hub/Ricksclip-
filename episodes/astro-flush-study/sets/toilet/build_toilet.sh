#!/bin/bash
# build_toilet.sh: pictures (PIL) then the whole place in Blender -> out/toilet.blend, toilet_lite.glb, toilet_meta.json
# stills: blender -b out/toilet.blend -P scripts/still_toilet.py -- f5 f1030 ...   then   python3 scripts/proof_toilet.py
set -e; cd "$(dirname "$0")"
python3 scripts/tex_toilet.py
blender -b -P scripts/bl_toilet.py 2>&1 | grep -E "BUILT|Error|Traceback|line |error" || true
ls -la out

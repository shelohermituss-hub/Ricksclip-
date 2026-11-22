#!/bin/bash
# build_mc.sh: pictures (PIL) then the whole place in Blender -> out/mc.blend, mc_lite.glb, mc_meta.json
# stills: blender -b out/mc.blend -P scripts/still_mc.py -- f140 f180 ...   then   python3 scripts/proof_mc.py
set -e; cd "$(dirname "$0")"; mkdir -p out   # out/ is git-ignored: a fresh clone has none
python3 scripts/tex_mc.py
blender -b -P scripts/bl_mc.py 2>&1 | grep -E "BUILT|Error|Traceback|line |error" || true
ls -la out

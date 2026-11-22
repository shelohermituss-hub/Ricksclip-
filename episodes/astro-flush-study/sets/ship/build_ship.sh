#!/bin/bash
# build_ship.sh: pictures (PIL) then the whole place in Blender -> out/ship.blend, ship_lite.glb, ship_meta.json
# stills: blender -b out/ship.blend -P scripts/still_ship.py -- f40 f600 ...   then   python3 scripts/proof_ship.py
# NOTEX=1 skips the pictures (stars.png takes about a minute).
set -e; cd "$(dirname "$0")"
[ -n "$NOTEX" ] || python3 scripts/make_tex.py
blender -b -P scripts/bl_ship.py 2>&1 | grep -E "BUILT|Error|Traceback|line |error" || true
ls -la out

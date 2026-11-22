#!/bin/bash
# build_ship.sh: pictures (PIL) then the whole place in Blender -> out/ship.blend, ship_lite.glb, ship_meta.json
# stills: blender -b out/ship.blend -P scripts/still_ship.py -- f40 f600 ...   then   python3 scripts/proof_ship.py
# NOTEX=1 skips the pictures (stars.png takes about a minute).
set -e; cd "$(dirname "$0")"; mkdir -p out   # out/ is git-ignored: a fresh clone has none
[ -n "$NOTEX" ] || python3 scripts/make_tex.py
[ -n "$NOTEX" ] || [ -n "$NOEARTH" ] || python3 scripts/make_earth_stars.py   # earth + stars (about 80 s); NOEARTH=1 keeps the last ones
blender -b -P scripts/bl_ship.py 2>&1 | grep -E "BUILT|Error|Traceback|line |error" || true
ls -la out

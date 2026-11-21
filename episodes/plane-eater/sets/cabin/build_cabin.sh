#!/usr/bin/env bash
# build_cabin.sh: rebuilds the plane-eater 'cabin' set (set-builder 2026-11-21). Re-runnable (RunPod or a new session).
#   bash build_cabin.sh          -> tex/*.png, out/cabin.blend, out/cabin_lite.glb, out/cabin_meta.json
#   bash build_cabin.sh --proof  -> + the light previews, sheet and gate numbers for both sets (../run_proofs.sh)
# Needs: blender 5 (bash tools/install_blender.sh), python3 + PIL + numpy. Ends CABIN_BUILD_END.
set -euo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; cd "$T"; mkdir -p logs out proof tex
python3 scripts/tex_cabin.py tex > logs/tex.log 2>&1
blender -b --factory-startup --python scripts/bl_cabin.py -- tex out > logs/build.log 2>&1
grep -q CABIN_DONE logs/build.log && ! grep -q Traceback logs/build.log || { echo "cabin FAILED (logs/build.log)"; exit 1; }
grep -E "^TRIS" logs/build.log; echo CABIN_BUILD_END
[ "${1:-}" = "--proof" ] && bash ../run_proofs.sh || true

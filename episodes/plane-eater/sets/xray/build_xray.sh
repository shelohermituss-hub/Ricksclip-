#!/usr/bin/env bash
# build_xray.sh: rebuilds the plane-eater 'xray' set (set-builder 2026-11-21). Re-runnable (RunPod or a new session).
#   bash build_xray.sh          -> tex/*.png, out/xray.blend, out/xray_lite.glb, out/xray_meta.json
#   bash build_xray.sh --proof  -> + the light previews, sheet and gate numbers for both sets (../run_proofs.sh)
# Needs: blender 5 (bash tools/install_blender.sh), python3 + PIL + numpy. Ends XRAY_BUILD_END.
set -euo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; cd "$T"; mkdir -p logs out proof tex
python3 scripts/tex_xray.py tex > logs/tex.log 2>&1
blender -b --factory-startup --python scripts/bl_xray.py -- tex out > logs/build.log 2>&1
grep -q XRAY_DONE logs/build.log && ! grep -q Traceback logs/build.log || { echo "xray FAILED (logs/build.log)"; exit 1; }
grep -E "^TRIS" logs/build.log; echo XRAY_BUILD_END
[ "${1:-}" = "--proof" ] && bash ../run_proofs.sh || true

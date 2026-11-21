#!/usr/bin/env bash
# fix2_run.sh (FIX 2, set-builder 2026-11-21): rebuild the town (swing turned to face north; files are written *_tmp then renamed by the build itself),
# then only the FIX 2 proofs: Blender DU park / s6_H / s6_G / yard_dim (bays .1), kit lite DU crossing (glow), s6_H, park, yard_dim. Ends FIX2_END.
set -uo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; cd "$T"; mkdir -p logs proof/fix2/bl
python3 /home/user/Ricksclip-/tools/check_midline_comments.py scripts > /dev/null || { echo MIDLINE_FAIL; exit 1; }
uptime > logs/fix2_load.txt
if [ -z "${SKIP_BUILD:-}" ]; then bash build_town.sh > logs/fix2_build.log 2>&1; tail -3 logs/fix2_build.log; grep -q TOWN_BUILD_END logs/fix2_build.log || { echo BUILD_FAIL; exit 1; }; fi
uptime >> logs/fix2_load.txt
blender -b out/town.blend --python scripts/bl_town_proof.py -- proof/fix2/bl du 540 960 ${CAMS_BL:-park,s6_H,s6_G,yard_dim} > logs/fix2_bl.log 2>&1; grep "^PROOF\|Traceback" logs/fix2_bl.log
uptime >> logs/fix2_load.txt
LITE=1 W=540 H=960 ONLY="${ONLY_KIT:-du_crossing_lite du_s6_H_lite du_park_lite du_yard_dim_lite}" bash proof/run_kit.sh > logs/fix2_kit.log 2>&1; grep KIT_TIME logs/fix2_kit.log
uptime >> logs/fix2_load.txt; echo FIX2_END

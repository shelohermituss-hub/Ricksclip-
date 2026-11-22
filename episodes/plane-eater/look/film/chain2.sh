#!/usr/bin/env bash
D="$(cd "$(dirname "$0")" && pwd)"
bash "$D/render_keys.sh" s2 s4
bash "$D/export_locks.sh" s3 s5
echo CHAIN2_END

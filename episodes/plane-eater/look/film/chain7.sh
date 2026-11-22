#!/usr/bin/env bash
D="$(cd "$(dirname "$0")" && pwd)"
bash "$D/render_keys.sh" s1 s5
TPCT=25 bash "$D/package_all.sh" s1 s2 s3 s4 s5
echo CHAIN7_END

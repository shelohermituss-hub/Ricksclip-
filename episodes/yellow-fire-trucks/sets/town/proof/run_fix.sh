#!/usr/bin/env bash
# FIX 1 proof (set-builder 2026-11-21): only the tiles the fixes change. Blender light previews (540x960, 16 spp + OIDN, Standard) + kit LITE stills, then FIX_SHEET.jpg.
# bash proof/run_fix.sh [bl] [kit] [sheet]   (default all). One render process at a time. Ends FIX_PROOF_END.
T="$(cd "$(dirname "$0")/.." && pwd)"; cd "$T"; mkdir -p proof/fix/bl; W=540; H=960; what="${*:-bl kit sheet}"
if [[ $what == *bl* ]]; then
  blender -b out/town.blend --python scripts/bl_town_proof.py -- proof/fix/bl du $W $H crossing,park,yard_low > logs/fix_bl_du.log 2>&1; grep "^PROOF" logs/fix_bl_du.log || tail -5 logs/fix_bl_du.log
  blender -b out/town.blend --python scripts/bl_town_proof.py -- proof/fix/bl am $W $H shop_window > logs/fix_bl_am.log 2>&1; grep "^PROOF" logs/fix_bl_am.log || tail -5 logs/fix_bl_am.log
fi
if [[ $what == *kit* ]]; then
  W=$W H=$H LITE=1 TIME2=1 ONLY="${KIT_ONLY:-du_crossing_lite am_park_lite du_yard_low_lite am_shop_window_lite du_park_lite}" bash proof/run_kit.sh > logs/fix_kit.log 2>&1; grep -E "KIT_TIME|rror" logs/fix_kit.log
fi
python3 - <<'PY'
import json, re, os
t = {}
for k in ('du', 'am'):
    p = 'proof/fix/bl/bl_times_%s.json' % k
    if os.path.exists(p): t.update({'bl_%s_%s' % (k, c): s for c, s in json.load(open(p)).items()})
p = 'proof/fix/before/bl_times_du.json'
if os.path.exists(p): t.update({'bl_before_du_%s' % c: s for c, s in json.load(open(p)).items()})
t['kit_before_am_park_lite'] = 6.0                                    # LITE round, STATE.md (second frame)
for l in open('logs/fix_kit.log') if os.path.exists('logs/fix_kit.log') else []:
    m = re.match(r'KIT_TIME (\w+) one_frame_run ([\d.]+) s(?:, second_frame ([-\d.]+) s)?', l)
    if m: t[m.group(1)] = float(m.group(3) or m.group(2))
json.dump(t, open('proof/fix/times.json', 'w'), indent=1)
PY
[[ $what == *sheet* ]] && python3 scripts/fix_sheet.py . "$T/FIX_SHEET.jpg"
echo FIX_PROOF_END

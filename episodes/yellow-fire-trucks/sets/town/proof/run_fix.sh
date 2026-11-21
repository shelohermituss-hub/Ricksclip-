#!/usr/bin/env bash
# FIX 1 proof (set-builder 2026-11-21): only the tiles the fixes change. Blender light previews (540x960, 16 spp + OIDN, Standard) + kit LITE stills, then FIX_SHEET.jpg.
# bash proof/run_fix.sh [bl] [kit] [sheet]   (default all; env BL_DU, BL_AM, KIT_ONLY pick the tiles). One render process at a time. Ends FIX_PROOF_END.
T="$(cd "$(dirname "$0")/.." && pwd)"; cd "$T"; [ -f proof/fix/tiles.env ] && . proof/fix/tiles.env;   # the tile lists of the current round (BL_DU, BL_AM, KIT_ONLY)
 mkdir -p proof/fix/bl; W=540; H=960; what="${*:-bl kit sheet}"
if [[ $what == *bl* ]]; then
  # only the tiles a fix changes (REGLES 2): BL_DU / BL_AM camera lists ("" = skip); earlier times are kept in bl_times_<kind>_prev.json
  for k in du am; do v=BL_${k^^}; cams=${!v-$([ $k = du ] && echo crossing,park,yard_low || echo shop_window)}; [ -z "$cams" ] && continue
    [ -s proof/fix/bl/bl_times_$k.json ] && python3 -c "import json,os;p='proof/fix/bl/bl_times_${k}_prev.json';a=json.load(open(p)) if os.path.exists(p) else {};a.update(json.load(open('proof/fix/bl/bl_times_$k.json')));json.dump(a,open(p,'w'))"
    blender -b out/town.blend --python scripts/bl_town_proof.py -- proof/fix/bl $k $W $H $cams > logs/fix_bl_$k.log 2>&1; grep "^PROOF" logs/fix_bl_$k.log || tail -5 logs/fix_bl_$k.log; done
fi
if [[ $what == *kit* ]]; then
  [ -s logs/fix_kit.log ] && cat logs/fix_kit.log >> logs/fix_kit_prev.log
  W=$W H=$H LITE=1 TIME2=1 ONLY="${KIT_ONLY:-du_crossing_lite am_park_lite du_yard_low_lite am_shop_window_lite du_park_lite}" bash proof/run_kit.sh > logs/fix_kit.log 2>&1; grep -E "KIT_TIME|rror" logs/fix_kit.log
fi
python3 - <<'PY'
import json, re, os
t = {}
for k in ('du', 'am'):
    for p in ('proof/fix/bl/bl_times_%s_prev.json' % k, 'proof/fix/bl/bl_times_%s.json' % k):
        if os.path.exists(p): t.update({'bl_%s_%s' % (k, c): s for c, s in json.load(open(p)).items()})
p = 'proof/fix/before/bl_times_du.json'
if os.path.exists(p): t.update({'bl_before_du_%s' % c: s for c, s in json.load(open(p)).items()})
t['kit_before_am_park_lite'] = 6.0                                    # LITE round, STATE.md (second frame)
for l in [l for f in ('logs/fix_kit_prev.log', 'logs/fix_kit.log') if os.path.exists(f) for l in open(f)]:
    m = re.match(r'KIT_TIME (\w+) one_frame_run ([\d.]+) s(?:, second_frame ([-\d.]+) s)?', l)
    if m: t[m.group(1)] = float(m.group(3) or m.group(2))
json.dump(t, open('proof/fix/times.json', 'w'), indent=1)
PY
[[ $what == *sheet* ]] && python3 scripts/fix_sheet.py . "$T/FIX_SHEET.jpg"
echo FIX_PROOF_END

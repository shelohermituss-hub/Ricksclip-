#!/usr/bin/env bash
# run_proofs.sh: light previews (540x960, 16 spp, <= 90 s a tile) + sheets + gate numbers for the xray and cabin sets. One render process at a time.
set -uo pipefail
S="$(cd "$(dirname "$0")" && pwd)"; RT="$(cd "$S/../../.." && pwd)"
cd "$S/xray"; rm -f proof/bl_times.json
blender -b out/xray.blend --python ../pe_proof.py -- proof "shoulder:CAM_SHOULDER:;wide:CAM_WIDE:;film:CAM_FILM:;inside:CAM_INSIDE:puff=0;lining:CAM_LINING:puff=1;ride:CAM_RIDE:puff=1|ride=0.12" > logs/proof.log 2>&1
grep PROOF logs/proof.log
python3 ../pe_sheet.py . XRAY_SHEET.jpg "shoulder:19 over the shoulder" "wide:clinic reverse" "film:20 fly-in start" "inside:20 inside, flat lining" "lining:21 THICK mattress" "ride:22 SLID ride" > logs/sheet.log 2>&1; cat logs/sheet.log
python3 "$RT/tools/measure/density_check.py" --day proof/bl_*.png --json proof/density.json > logs/density.log 2>&1; cat logs/density.log
cd "$S/cabin"; rm -f proof/bl_times.json
blender -b out/cabin.blend --python ../pe_proof.py -- proof "two:CAM_TWO:;tray:CAM_TRAY:;traybitten:CAM_TRAY:hide=tray_table+meal_foil_on|show=tray_table_bitten+meal_foil_lifted;window:CAM_WINDOW:" > logs/proof.log 2>&1
grep PROOF logs/proof.log
python3 ../pe_sheet.py . CABIN_SHEET.jpg "two:35 two-shot" "tray:36 the grey meal" "traybitten:37 tray bitten" "window:38 bitten wing" > logs/sheet.log 2>&1; cat logs/sheet.log
python3 "$RT/tools/measure/density_check.py" --day proof/bl_*.png --json proof/density.json > logs/density.log 2>&1; cat logs/density.log
echo RUN_PROOFS_END

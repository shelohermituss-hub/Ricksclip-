#!/usr/bin/env bash
# TEST ONLY: Blender tiles at the SAME camera as sets/_hero_test F34 (1200x900) for ASSET_TEST.jpg. Log out/batch2.log, end marker BATCH2_END.
cd "$(dirname "$0")"; O=$PWD/out
r(){ n=$1; shift; echo "== $n $*"; blender -b --factory-startup --python bl_render.py -- "$@" out=$O/$n.png 2>&1 | grep -E "REPAINTED|RENDER_SECONDS|EEVEE engine|Traceback|Error:"; }
r t_bl_afe_red_34   asset=afe paint=red  light=sun  cam=hero34 w=1200 h=900 samples=32
r t_bl_afe_half_34  asset=afe paint=half light=sun  cam=hero34 w=1200 h=900 samples=32
r t_bl_alf_orig_34  asset=alf paint=orig light=sun  cam=hero34 w=1200 h=900 samples=32
r t_bl_afe_half_dusk_34 asset=afe paint=half light=dusk cam=hero34 w=1200 h=900 samples=32
r t_ee_afe_half_34  asset=afe paint=half light=sun  cam=hero34 w=1200 h=900 samples=32 engine=eevee
echo BATCH2_END

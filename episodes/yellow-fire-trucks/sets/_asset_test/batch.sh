#!/usr/bin/env bash
# TEST ONLY: all Blender stills of the asset test. Log: out/batch.log, end marker BATCH_END.
cd "$(dirname "$0")"; O=$PWD/out
r(){ n=$1; shift; echo "== $n $*"; blender -b --factory-startup --python bl_render.py -- "$@" out=$O/$n.png 2>&1 | grep -E "REPAINTED|FIT|RENDER_SECONDS|EEVEE engine|Traceback|Error:"; }
C="dist=7.2 tx=0.3 samples=32"
r bl_afe_red_sun_1080   asset=afe paint=red   light=sun  w=1080 h=1920 $C
r bl_afe_red_sun_540    asset=afe paint=red   light=sun  w=540 h=960 $C
r bl_afe_half_sun_540   asset=afe paint=half  light=sun  w=540 h=960 $C
r bl_afe_lemon_sun_540  asset=afe paint=lemon light=sun  w=540 h=960 $C
r bl_afe_half_dusk_1080 asset=afe paint=half  light=dusk w=1080 h=1920 $C
r bl_afe_half_dusk_540  asset=afe paint=half  light=dusk w=540 h=960 $C
r bl_alf_orig_sun_540   asset=alf paint=orig  light=sun  w=540 h=960 $C
r bl_alf_half_sun_540   asset=alf paint=half  light=sun  w=540 h=960 $C
r bl_gun_sun_540        asset=gun paint=orig  light=sun  w=540 h=960 samples=32
r bl_comp_sun_540       asset=comp paint=orig light=sun  w=540 h=960 samples=32
r bl_afe_red_sun_eevee_540 asset=afe paint=red light=sun w=540 h=960 engine=eevee $C
echo BATCH_END

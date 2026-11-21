#!/usr/bin/env bash
# Key frame A (S1 f0, the hook poster) on the RunPod GPU: render, then the world-only grade. Needs: blender 5.x on PATH, python3 with numpy, pillow, scipy.
# usage: bash render.sh        outputs: out/A_raw_0001.png, out/pass_depth*.png, out/A_final.png, out/numbers.json, out/render_seconds.txt
set -e; cd "$(dirname "$0")"; mkdir -p out
DEV='import bpy
p = bpy.context.preferences.addons["cycles"].preferences
for t in ("OPTIX", "CUDA", "HIP", "METAL", "ONEAPI"):
    try:
        p.compute_device_type = t; p.get_devices(); ok = [d for d in p.devices if d.type == t]
        if ok:
            for d in p.devices: d.use = d.type == t
            bpy.context.scene.cycles.device = "GPU"; print("DEVICE", t, [d.name for d in ok]); break
    except Exception as e: print("no", t, e)
else:
    bpy.context.scene.cycles.device = "CPU"; print("DEVICE CPU fallback")'
T0=$(date +%s); blender -b scene.blend --python-expr "$DEV" -f 1 2>&1 | tee out/blender.log | grep -E "DEVICE|Saved|Warning: path|not found|Error" || true
echo $(( $(date +%s) - T0 )) > out/render_seconds.txt
RAW=$(ls out/A_raw_*.png | head -1); DEP=$(ls out/pass_depth*.png | head -1)
python3 grade_key.py "$RAW" "$DEP" mask_A.png out/A_final.png --preset A --json out/numbers.json
echo "DONE: out/A_final.png ($(cat out/render_seconds.txt) s render)"

# bl_proof3.py: the round-3 Blender proof stills (props-hero 2026-11-21): light previews (REGLES 2: Cycles 16 spp + OIDN, Standard, 640x480 landscape tiles).
# blender -b --factory-startup --python bl_proof3.py -- <group trucks|props> <assets_prod dir> <out png dir> 640 480
# Prints PROOF <name> RENDER_SECONDS <s>; writes times_r3_<group>.json. No date or time in any image.
import bpy, sys, os, math, json
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.append(HERE)
grp, AP, OUTD = sys.argv[sys.argv.index('--') + 1:][:3]
import bl_proof as P, truck_api as T, props_api as PA
P.AP, P.OUTD, P.PH = AP, OUTD, os.path.join(AP, '..', 'assets', 'polyhaven') + '/'
times = {}
def setup():
    P.setup_render(); bpy.context.scene.cycles.samples = 16
def shot(nm, cam): P.camera(*cam); times[nm] = P.shot(nm)
O = lambda n: os.path.join(AP, 'out', n + '.blend')
if grp == 'trucks':
    bpy.ops.wm.open_mainfile(filepath=O('truck')); setup(); P.yard(80, 4.0); P.light('am')
    root = bpy.data.objects['TRUCK']
    T.set_paint(root, paint='half', edge=0.3, masking=True, letters='under', ribbon=True); T.set_extras(root, 4, True, True); T.set_beacon(root, False)
    shot('r3_hero_ribbon_plate', ((-8.4, -5.6, 1.5), (-1.6, 0, 1.0), 35))                 # ribbon hugging the body, bow, PINE HOLLOW F.D. 1 plate
    for o in T._objs(root): o.hide_render = True
    li = T.append_truck(O('truck_light'), 'LIGHT'); T.set_extras(li, 4, True, False)
    T.set_paint(li, paint='red', drain=1.0, drain_wipe=0.5, masking=False, letters='over', ribbon=False); T.set_beacon(li, True, 20, wave=1.8)
    shot('r3_light_sirens_drainwipe', ((-11.0, -8.0, 3.4), (-0.5, 0, 1.5), 35))           # light truck: 4 sirens + beacon row, drain wipe half way
if grp == 'props':
    bpy.ops.wm.read_factory_settings(use_empty=True); setup(); P.yard(30, 3.0); P.light('am')
    van = PA.append(O('milk_van'), 'MILK_VAN')
    shot('r3_milk_van', ((-7.6, -6.4, 1.9), (-0.6, 0, 1.1), 35))                            # cream, cornflower stripe, Meadowbrook DAIRY
    for o in bpy.data.objects:
        if o.type != 'CAMERA' and o.name not in ('yard', 'sun'): o.hide_render = True
    lay = [('lost_wagon', -2.6, 0, 20), ('lost_kite', -1.3, .4, 30), ('lost_boot', -.35, -.3, 70), ('lost_watering_can', .45, 0, -20), ('lost_tricycle', 1.5, .2, 35)]
    for n, x, y, yaw in lay:
        r = PA.append(O(n), n.upper()); r.location = (x, y, 0); r.rotation_euler.z = math.radians(yaw)
        if n in ('lost_boot', 'lost_tricycle'): PA.set_grey(r, 1.0)                           # two of five in the dusk grey state (kit tile: all five)
    b = PA.append(O('red_ball'), 'RED_BALL'); b.location = (-1.2, -1.0, 0)
    lb = PA.append(O('lunch_box'), 'LUNCH_BOX'); lb.location = (.35, -1.1, 0); lb.rotation_euler.z = math.radians(75)
    le = PA.append(O('lemon'), 'LEMON'); le.location = (.62, -1.25, 0)
    toy = PA.append(O('toy_truck'), 'TOY_TRUCK'); toy.location = (1.05, -1.2, 0); toy.rotation_euler.z = math.radians(30)
    shot('r3_lawn_lost_things', ((-0.4, -6.6, 1.9), (0.0, 0.2, 0.5), 35))
    shot('r3_close_box_lemon_toy_ball', ((0.2, -2.6, 0.55), (0.3, -1.1, 0.1), 50))
json.dump(times, open(os.path.join(OUTD, 'times_r3_%s.json' % grp), 'w'), indent=1)
print('PROOF3_END', grp)

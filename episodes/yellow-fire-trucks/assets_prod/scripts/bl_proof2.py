# bl_proof2.py: the round-2 proof stills (props-hero 2026-11-20), Blender Cycles CPU 32 spp + OIDN, Standard view, single frames.
# blender -b --factory-startup --python bl_proof2.py -- <group hero|fleet|props> <assets_prod dir> <out png dir> [ONLY=substring env]
# Prints PROOF <name> RENDER_SECONDS <s>; writes times_r2_<group>.json. No date or time in any image.
import bpy, sys, os, math, json
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.append(HERE)
grp, AP, OUTD = sys.argv[sys.argv.index('--') + 1:][:3]
import bl_proof as P, truck_api as T
P.AP, P.OUTD, P.PH = AP, OUTD, os.path.join(AP, '..', 'assets', 'polyhaven') + '/'
ONLY = os.environ.get('ONLY', ''); times = {}
def shot(nm, cam):
    if ONLY and ONLY not in nm: return
    P.camera(*cam); times[nm] = P.shot(nm)
meta = json.load(open(os.path.join(AP, 'out', 'truck_meta.json'))); AN = {k: Vector(v) for k, v in meta['anchors'].items()}

if grp == 'hero':
    bpy.ops.wm.open_mainfile(filepath=os.path.join(AP, 'out', 'truck.blend')); P.setup_render(); P.yard(80, 4.0)
    root = bpy.data.objects['TRUCK']
    T.set_paint(root, paint='half', edge=0.3, masking=True, letters='under', ribbon=True); T.set_extras(root, 4, True, True); T.set_beacon(root, False); P.light('am')
    shot('r2_hero_half_medium', ((-7.4, -6.2, 2.4), (-0.9, 0, 1.3), 35))                 # plan row 4 framing: whole truck, card, masking, runs
    shot('r2_hero_card_close', ((-6.0, -1.6, 1.9), (-3.0, 0.15, 1.9), 50))                  # windscreen: card + papered driver pane
    shot('r2_hero_runs_side', ((0.6, -5.2, 1.2), (0.5, 0, 1.05), 40))                        # paint runs + kraft tyre at a medium side shot
    T.set_paint(root, paint='red', drain=1.0, masking=False, letters='over', ribbon=False); T.set_beacon(root, True, 20, wave=1.8); P.light('dusk')
    shot('r2_hero_roofline_dusk', ((-4.6, -3.4, 3.6), (-2.0, 0, 2.55), 35))                 # plan rows 17-18: four sirens + beacon row (wave)

def put_plaster(root, k, tag):
    pl = PA.append(os.path.join(AP, 'out', 'plaster.blend'), 'PLASTER')
    n = Vector(meta['plaster_normals']['plaster_%d' % k]); pl.location = root.location + AN['anchor_plaster_%d' % k] + n * 0.003
    pl.rotation_euler = n.to_track_quat('Z', 'X').to_euler(); pl.rotation_euler.rotate_axis('Z', math.radians(17 * k))
if grp == 'fleet':
    import props_api as PA
    bpy.ops.wm.open_mainfile(filepath=os.path.join(AP, 'out', 'truck.blend')); P.setup_render(); P.yard(80, 4.0); P.light('am')
    full = bpy.data.objects['TRUCK']; T.set_extras(full, 0, False, False)
    # 1. the Chief's older pumper, bay 2: ENGINE No. 2, older chrome, soot and wear
    T.set_paint(full, paint='red', masking=False, letters='over', ribbon=False); T.set_letters(full, 'truck_letters_e2'); T.set_age(full, 1.0)
    shot('r2_chief_engine2_old', ((-9.0, -7.6, 2.6), (-0.5, 0, 1.15), 35))
    shot('r2_chief_engine2_door', ((-2.3, -3.2, 1.45), (-2.5, 0, 1.3), 45))
    # 2. the LIGHT truck (decimated) beside the full one, same paint
    li = T.append_truck(os.path.join(AP, 'out', 'truck_light.blend'), 'LIGHT'); T.set_extras(li, 0, False, False)
    T.set_letters(full, 'truck_letters'); T.set_paint(li, paint='red', masking=False, letters='over', ribbon=False); full.location = (0, -1.6, 0); li.location = (0, 1.6, 0)
    shot('r2_light_vs_full', ((-10.5, -8.5, 3.2), (-0.5, 0, 1.0), 35))
    for o in T._objs(full): o.hide_render = True
    # 3. the Dallas pair: red ENGINE No. 14 with three cross plasters, lime ENGINE No. 22 with one (plan rows 30-34); two light trucks abreast
    li2 = T.append_truck(os.path.join(AP, 'out', 'truck_light.blend'), 'LIGHT2'); T.set_extras(li2, 0, False, False)
    li.location = (0, 1.7, 0); li2.location = (0, -1.7, 0)
    T.set_paint(li2, paint='red', letters='over'); T.set_letters(li2, 'truck_letters_dal14')
    T.set_paint(li, paint='lemon', letters='over'); T.set_letters(li, 'truck_letters_dal22')
    for k in (1, 2, 3): put_plaster(li2, k, 'r')
    shot('r2_dallas_pair', ((-11.0, -8.0, 2.4), (-0.8, 0, 1.0), 35))
    for o in T._objs(li) + T._objs(li2): o.hide_render = True
    # 4. the TOY: the light truck as an 18 cm pressed-tin miniature, worn to the tin on its corners
    toy = T.append_truck(os.path.join(AP, 'out', 'truck_light.blend'), 'TOY'); T.set_extras(toy, 0, False, False)
    k = 0.18 / meta['size'][0]; toy.scale = (k, k, k); toy.location = (0, 0, 0)
    T.set_paint(toy, paint='red', letters='over', wear=1.0); T.set_age(toy, 1.0)
    for m, n in T._paint_groups(toy): n.inputs['wscale'].default_value = 0.12; n.inputs['chipZ'].default_value = 99.0
    shot('r2_toy_truck', ((-0.24, -0.2, 0.09), (0.0, 0, 0.03), 50))
if grp == 'props':
    import props_api as PA
    bpy.ops.wm.read_factory_settings(use_empty=True); P.setup_render(); P.yard(30, 3.0); P.light('am')
    O = lambda n: os.path.join(AP, 'out', n.lower() + '.blend')
    van = PA.append(O('MILK_VAN'), 'MILK_VAN'); hub = PA.append(O('HUBCAP'), 'HUBCAP'); hub.location = (-3.0, -2.5, 0.0); hub.rotation_euler = (0.12, 0, 0)
    cr = PA.append(O('MILK_CRATE'), 'MILK_CRATE'); cr.location = (-1.0, -2.6, 0); cr.rotation_euler.z = 0.3
    for i in range(3):
        b = PA.append(O('MILK_BOTTLE'), 'MILK_BOTTLE'); b.location = (-2.55 + 0.11 * i, -2.15 - 0.04 * i, 0)
    shot('r2_milk_van', ((-7.6, -6.4, 1.9), (-0.6, 0, 1.0), 35))
    shot('r2_hubcap_bottles', ((-2.3, -4.1, 0.75), (-2.6, -2.35, 0.08), 45))
    for o in bpy.data.objects:
        if o.type != 'CAMERA' and o.name not in ('yard', 'sun'): o.hide_render = True
    rs = PA.append(O('RIBBON_SET'), 'RIBBON_SET'); rs.location = (0, 0, 0)
    shot('r2_ribbon_set', ((0.75, -0.95, 0.95), (0, 0, 0.45), 45))
    rs.location = (50, 0, 0)
    lb = PA.append(O('LUNCH_BOX'), 'LUNCH_BOX'); lb.location = (0, 0, 0)
    le = PA.append(O('LEMON'), 'LEMON'); bpy.context.view_layer.update(); lmeta = json.load(open(os.path.join(AP, 'out', 'props2_meta.json')))
    le.location = (-0.075, -0.02, 0.153)
    shot('r2_lunchbox_lemon', ((0.38, -0.42, 0.3), (0, 0, 0.06), 45))
    lb.location = le.location = (50, 0, 0)
    for i, n in enumerate(('PAINT_TIN_LEMON', 'PAINT_TIN_LIME', 'PAINT_TIN_RED')):
        t = PA.append(O(n), n); t.location = (-0.32 + 0.32 * i, 0, 0); t.rotation_euler.z = 0.5
    mg = PA.append(O('MUG'), 'MUG'); mg.location = (0.18, -0.3, 0)
    shot('r2_tins_mug', ((0.05, -1.25, 0.55), (0, -0.05, 0.1), 40))
json.dump(times, open(os.path.join(OUTD, 'times_r2_%s.json' % grp), 'w'), indent=1)
print('PROOF2_END', grp)

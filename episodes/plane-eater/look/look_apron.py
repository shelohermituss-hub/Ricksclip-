# look_apron.py: LOOK CARD frame A = PICTURE_PLAN row 1 / frame 0 (look-finisher, 2026-11-21).
#   blender -b episodes/plane-eater/sets/apron/out/apron.blend --python episodes/plane-eater/look/look_apron.py -- <info|preview> [out.png]
#   env: W H SPP (540 960 24), CAM "x,y,z" AIM "x,y,z" LENS, MX MY (Michel's shaker target), THREADS
# Set (set-builder apron.blend, Rick day light via apron_api.set_light) + Cessna F-MIAM (props-hero cessna150.blend) + table props of the set.
# MICHEL on the bistro chair (moved from the table) just outboard of the left wing tip: the glass shaker (props2 salt_shaker, turned over) over the
# wing tip, the fork (props2 fork) up in his other fist; salt grains falling onto the white wing tip. OWNER far behind at the nose, back to us,
# polishing the propeller blade with the yellow rag. Low lens at the grass edge (lens band of tufts).
import bpy, sys, os, json, math, random
from mathutils import Vector, Matrix
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import pe_look as PL
EP = PL.EP; ROOT = PL.ROOT
sys.path[:0] = [os.path.join(EP, 'sets', 'apron', 'scripts'), os.path.join(ROOT, 'library', 'grass')]
import apron_api as AA, rick_grass as G
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else ['info']
MODE = args[0]; OUT = args[1] if len(args) > 1 else os.path.join(HERE, 'prev', 'A_raw.png')
ev = lambda k, d: [float(x) for x in os.environ.get(k, d).split(',')]
sc = bpy.context.scene
AA.EXPO_DAY = float(os.environ.get('EXPO', '-0.1')); AA.set_light(sc, 'day'); AA.link_cessna(sc, os.path.join(EP, 'props', 'out', 'cessna150.blend'))
for o in list(bpy.data.objects):
    if o.name.startswith(('lawn.', 'wheel_tufts')) and 'CESSNA' in [c.name for c in o.users_collection]: bpy.data.objects.remove(o)
sun = bpy.data.objects['apron_sun']; to_sun = (sun.matrix_world.to_3x3() @ Vector((0, 0, 1))).normalized()
CAM = Vector(ev('CAM', '8.3,-2.15,0.42')); AIM = ev('AIM', '0.5,0.2,1.55'); LENS = float(os.environ.get('LENS', '17'))
cam = PL.camera(sc, CAM, AIM, LENS)

# ---- Michel on the chair: shaker fist (his R) over the wing tip, seen from the lens; the card plane stays just outboard of the tip
TIPS = Vector(ev('MT', '5.18,-1.05,2.08'))           # the fist point (in the card plane, outboard of the tip end x 5.09)
CHAIR_H = 0.465
chair_from = Vector((3.4, -1.0, 0))
loc = PL.place_card_hand('michel_salt', 'R', TIPS - Vector((0, 0, CHAIR_H)), CAM); loc.z = 0
d = Vector((loc.x, loc.y, 0)) - chair_from
for o in bpy.data.objects:
    if o.name.startswith(('chair_', 'contact_chair')) and o.parent is None: o.location += d
mi = PL.add_card(sc, 'michel_salt', loc + Vector((0, 0, CHAIR_H)), CAM, to_sun)
# ---- held props: shaker turned over, its cap over the wing (pushed back along the lens ray until it is above the wing top, scaled to keep its screen size)
fR = PL.card_pt(mi, 'michel_salt', PL.CJ['michel_salt']['hands_px']['R']); fL = PL.card_pt(mi, 'michel_salt', PL.CJ['michel_salt']['hands_px']['L'])
SHS = float(os.environ.get('SHS', '1.9')); FKS = float(os.environ.get('FKS', '1.7'))
PUSH = float(os.environ.get('PUSH', '0.42')); k = ((fR - CAM).length + PUSH) / (fR - CAM).length; sh_pt = CAM + (fR - CAM) * k
yaw = mi.rotation_euler.z
sh, _ = PL.prop(sc, 'salt_shaker', sh_pt, (0, 0, 0), SHS * k)
sh.rotation_euler = (0, 0, 0); sh.matrix_world = Matrix.Translation(sh_pt) @ Matrix.Rotation(yaw, 4, 'Z') @ Matrix.Rotation(math.radians(float(os.environ.get('SHR', '-140'))), 4, 'Y') @ Matrix.Scale(SHS * k, 4)
fk, _ = PL.prop(sc, 'fork', fL + (CAM - fL).normalized() * 0.03, (0, 0, 0), 1.2)
fk.matrix_world = Matrix.Translation(fL + (CAM - fL).normalized() * 0.03) @ Matrix.Rotation(yaw, 4, 'Z') @ Matrix.Rotation(math.radians(90), 4, 'Z') @ Matrix.Rotation(math.radians(-80), 4, 'Y') @ Matrix.Rotation(math.radians(10), 4, 'X') @ Matrix.Scale(FKS, 4)
bpy.context.view_layer.update()
fists = PL.fist_overlay(sc, mi, 'michel_salt', ['R', 'L'], CAM, d=0.05)
# ---- salt grains from the cap down onto the wing top (tiny glinting cubes), a few bounced on the skin
cap = sh.matrix_world @ Vector((0, 0, 0.075))
gm = bpy.data.materials.new('salt_grain'); gm.use_nodes = True; b = gm.node_tree.nodes['Principled BSDF']
b.inputs['Base Color'].default_value = (1, 1, 1, 1); b.inputs['Roughness'].default_value = .15; b.inputs['Emission Color'].default_value = (1, 1, 1, 1); b.inputs['Emission Strength'].default_value = .6
rnd = random.Random(4); GR = []
for i in range(45):
    t = rnd.random() ** .8; z = cap.z - t * max(cap.z - 2.005, .05)
    p = Vector((cap.x + rnd.gauss(0, .012 + .03 * t), cap.y + rnd.gauss(0, .012 + .03 * t), z))
    bpy.ops.mesh.primitive_cube_add(size=rnd.uniform(.004, .007), location=p, rotation=(rnd.random() * 3, rnd.random() * 3, rnd.random() * 3))
    g = bpy.context.object; g.name = 'salt_%02d' % i; g.data.materials.append(gm); GR.append(g)
for i in range(30):   # grains lying on the wing top around the impact
    p = Vector((cap.x + rnd.gauss(0, .07), cap.y + rnd.gauss(0, .07), 2.0))
    bpy.ops.mesh.primitive_cube_add(size=rnd.uniform(.004, .007), location=p, rotation=(0, 0, rnd.random() * 3)); g = bpy.context.object; g.name = 'salt_on_%02d' % i; g.data.materials.append(gm); GR.append(g)
# ---- the owner far behind, at the nose, his rag fist on the upper propeller blade
OW = Vector(ev('OW', '-0.22,-3.47,1.42'))
oloc = PL.place_card_hand('owner_polish', 'R', OW, CAM); oloc.z = 0
ow = PL.add_card(sc, 'owner_polish', oloc, CAM, to_sun)
# ---- contact patches (chair legs carry their own; Michel's soles on the seat; the owner on the concrete)
PL.contact(sc, oloc, .30, .8, name='owner')
cs = PL.contact(sc, loc + Vector((0, 0, CHAIR_H)), .2, .55, name='michel_seat')
# ---- bounce from the lawn and the concrete greyed (white wing undersides stay blue-violet), and the leaf dapple of the table tree on the near concrete
for o in sc.objects:
    if o.type == 'MESH' and o.name.startswith(('lawn', 'apron_slab', 'tufts', 'grass', 'runway_mow', 'taxi_', 'hangar_floor')):
        for m in o.data.materials: PL.bounce_grey(m)
if os.environ.get('DAPPLE', '1') == '1': PL.dapple(sc, CAM + (Vector(AIM) - CAM).normalized() * 1.6 * Vector((1, 1, 0)), 5.0, to_sun, height=5.0, density=float(os.environ.get('DD', '.42')), scale=float(os.environ.get('DS', '1.6')))
# ---- lens band: tall grass tufts in front of the low lens (the grass edge)
bpy.context.view_layer.update()
lens_band = G.tufts_lens_band(cam, d0=float(os.environ.get('B0', '0.45')), d1=float(os.environ.get('B1', '1.1')), density=10, height=float(os.environ.get('BH', '.2'))) if os.environ.get('BAND', '1') == '1' else None

NOLINE = ('lawn', 'apron_slab', 'hangar_floor', 'runway_mow', 'taxi_', 'fields_', 'hill_', 'tufts', 'clad_', 'hangar_wall', 'hangar_pier', 'hangar_header',
          'gable_infill', 'air_mote', 'glass', 'win_glass', 'door_glass', 'office_wall', 'office_clad', 'roof', 'cloth_top', 'oil_in', 'jug_water', 'tree', 'poplar',
          'CARD_', 'SHADOWCARD_', 'CONTACT_', 'contact', 'salt_', 'DAPPLE', 'shaker_glass', 'shaker_salt', 'lens_band')
LINES = [o for o in sc.objects if o.type == 'MESH' and o.visible_get() and not o.hide_render and not o.name.startswith(NOLINE)]
PL.HIDE.extend(GR)
fo = PL.render_setup(sc, int(os.environ.get('W', 540)), int(os.environ.get('H', 960)), int(os.environ.get('SPP', 24)), bounces=5)
bpy.context.view_layer.update()
info = dict(cam=list(CAM), aim=AIM, lens=LENS, michel_foot=[round(x, 2) for x in loc], chair_top=CHAIR_H,
            scr=dict(michel_foot=PL.screen(sc, loc + Vector((0, 0, CHAIR_H))), michel_head=PL.screen(sc, mi.location + Vector((0, 0, 1.8))), fist_R=PL.screen(sc, fR),
                     shaker_cap=PL.screen(sc, cap), wing_tip=PL.screen(sc, (5.09, -1.15, 2.0)), owner_foot=PL.screen(sc, oloc), owner_head=PL.screen(sc, oloc + Vector((0, 0, 1.74))),
                     prop_hub=PL.screen(sc, (0, -3.5, 1.13)), table=PL.screen(sc, (3.4, -0.32, 0.78))),
            down_angle_deg=dict(michel=PL.down_angle(sc, mi), owner=PL.down_angle(sc, ow)), cap_z=round(cap.z, 3), lines=len(LINES))
print('INFO', json.dumps(info), flush=True)
json.dump(info, open(os.path.join(HERE, 'prev', 'A_info.json'), 'w'), indent=1)
if MODE == 'preview':
    PL.go(sc, OUT, fo, LINES)
    if os.environ.get('SAVE'): bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, 'look_apron.blend'), compress=True)

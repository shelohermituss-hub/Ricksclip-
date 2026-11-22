# look_cabin.py: LOOK CARD frame C = PICTURE_PLAN row 36 "STILL better" (look-finisher, 2026-11-21).
#   blender -b episodes/plane-eater/sets/cabin/out/cabin.blend --python episodes/plane-eater/look/look_cabin.py -- <info|preview> [out.png]
#   env: W H SPP, CAM AIM LENS, EXPO, MLOC (Michel's foot point), THREADS
# Set (set-builder cabin.blend: airliner row, window seat, tray table with the grey meal, outside wing + cumulus). MICHEL in the window seat,
# DISGUST face, one fist on the meal tray (sliding it aside); the lens in front of him, low over the tray (push-in on the tray, row 36).
import bpy, sys, os, json, math
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import pe_look as PL
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else ['info']
MODE = args[0]; OUT = args[1] if len(args) > 1 else os.path.join(HERE, 'prev', 'C_raw.png')
ev = lambda k, d: [float(x) for x in os.environ.get(k, d).split(',')]
sc = bpy.context.scene
print('LIGHTS', [(o.name, o.data.type, round(o.data.energy, 1), [round(x, 2) for x in o.location]) for o in sc.objects if o.type == 'LIGHT'])
print('EXPO', sc.view_settings.view_transform, sc.view_settings.exposure)
CAM = Vector(ev('CAM', '0.62,1.0,1.02')); AIM = ev('AIM', '-0.1,1.32,0.95'); LENS = float(os.environ.get('LENS', '20'))
cam = PL.camera(sc, CAM, AIM, LENS)
sc.view_settings.exposure = float(os.environ.get('EXPO', str(sc.view_settings.exposure)))
WILD = []
for o in sc.objects:   # wild wall: the row in front of Michel is hidden from the lens only (it still casts its shadow and bounce), as a film crew pulls a seat row
    if o.name.startswith(tuple(os.environ.get('WILD', 'seat_8A,seat_8B,seat_8C,arm_8_').split(','))) and 'tray_table' not in o.name: o.visible_camera = False; WILD.append(o.name)
print('WILD', len(WILD)); print('CAM_INSIDE', PL.cam_inside(sc, CAM))
key = Vector((0.1, 1.0, 0.25)).normalized()                     # the window light comes in from +Y (the window wall)
if os.environ.get('MLOC'): loc = Vector(ev('MLOC', '0.12,1.2,0'))
else: loc = PL.place_card_hand('michel_meal', 'R', Vector(ev('HT', '0.22,1.12,0.84')), CAM); loc.z = 0
EX = sc.view_settings.exposure
# ---- row 36 state: the foil is off (lifted in row 35), the grey stew and peas show
for n, hid in (('meal_foil_on', True), ('meal_foil_lifted', False)):
    if bpy.data.objects.get(n): bpy.data.objects[n].hide_render = hid
# ---- WINDOW VIEW FIX (the set's window reads flat grey): a bright sky-above-the-clouds card outside the window, seen by the lens only
# (the cabin light keeps the set's window_fill). Deep blue top, white cumulus deck with light-blue shade low (LOOK_BIBLE cabin + sky rows).
WG = Vector((0.18, 1.77, 1.02)); vd = (WG - CAM).normalized(); BD = WG + vd * float(os.environ.get('BDD', '2.2'))
bpy.ops.mesh.primitive_plane_add(size=float(os.environ.get('BDS', '3.0')), location=BD); bd = bpy.context.object; bd.name = 'window_view_card'
bd.rotation_euler = (-vd).to_track_quat('Z', 'Y').to_euler()
m = bpy.data.materials.new('window_view'); m.use_nodes = True; N, L = m.node_tree.nodes, m.node_tree.links
for n in list(N): N.remove(n)
tc = N.new('ShaderNodeTexCoord'); sp = N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Generated'], sp.inputs[0])
rp = N.new('ShaderNodeValToRGB'); L.new(sp.outputs[1], rp.inputs[0]); e = rp.color_ramp.elements
e[0].position = .3; e[0].color = PL.lin('#7fb6f4'); e[1].position = .85; e[1].color = PL.lin('#0f79e8')
nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 3.2; nz.inputs['Detail'].default_value = 6; nz.inputs['Roughness'].default_value = .55
mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1, 2.2, 1); L.new(tc.outputs['Generated'], mp.inputs['Vector']); L.new(mp.outputs[0], nz.inputs['Vector'])
band = N.new('ShaderNodeMapRange'); band.interpolation_type = 'SMOOTHSTEP'; L.new(sp.outputs[1], band.inputs[0]); band.inputs[1].default_value = .95; band.inputs[2].default_value = .7
cl = N.new('ShaderNodeMath'); cl.operation = 'ADD'; L.new(nz.outputs['Fac'], cl.inputs[0]); L.new(band.outputs[0], cl.inputs[1])
th = N.new('ShaderNodeMapRange'); L.new(cl.outputs[0], th.inputs[0]); th.inputs[1].default_value = .86; th.inputs[2].default_value = .94
shd = N.new('ShaderNodeMapRange'); L.new(nz.outputs['Fac'], shd.inputs[0]); shd.inputs[1].default_value = .42; shd.inputs[2].default_value = .62
cc = N.new('ShaderNodeMix'); cc.data_type = 'RGBA'; L.new(shd.outputs[0], cc.inputs['Factor']); cc.inputs['A'].default_value = PL.lin('#b5cbf3'); cc.inputs['B'].default_value = PL.lin('#ffffff')
sky = N.new('ShaderNodeMix'); sky.data_type = 'RGBA'; L.new(th.outputs[0], sky.inputs['Factor']); L.new(rp.outputs[0], sky.inputs['A']); L.new(cc.outputs['Result'], sky.inputs['B'])
em = N.new('ShaderNodeEmission'); L.new(sky.outputs['Result'], em.inputs['Color']); em.inputs['Strength'].default_value = float(os.environ.get('BDE', '1.0')) * 2 ** (-EX)
o_ = N.new('ShaderNodeOutputMaterial'); L.new(em.outputs[0], o_.inputs['Surface']); bd.data.materials.append(m)
for o in sc.objects:
    if o.name.startswith(('window_glass_L', 'window_shade_L', 'shade_L', 'fuselage_skin_outer', 'tray_arm_')): o.visible_camera = False; print('HIDE_CAM', o.name)
bd.visible_diffuse = False; bd.visible_shadow = False; bd.visible_glossy = True; bd.visible_transmission = True
mi = PL.add_card(sc, 'michel_meal', loc, CAM, (key.x, key.y), strength=float(os.environ.get('CARDS', 2 ** (-EX))))
# seated: the card is cut at the seat cushion (world z of the cushion top), so no drawn shins lie on the blue seat; the seat and tray hold the rest
CUT = float(os.environ.get('SEATCUT', '0.53')) - loc.z
for o in [mi] + [x for x in PL.SHADOWS if 'michel_meal' in x.name]:
    nt = o.data.materials[0].node_tree; N, L = nt.nodes, nt.links; mx = [n for n in N if n.type == 'MIX_SHADER'][0]; fac = mx.inputs['Fac'].links[0].from_socket
    tc = N.new('ShaderNodeTexCoord'); sp = N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Object'], sp.inputs[0])
    gt = N.new('ShaderNodeMath'); gt.operation = 'GREATER_THAN'; gt.inputs[1].default_value = CUT; L.new(sp.outputs['Z'], gt.inputs[0])
    mu = N.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; L.new(fac, mu.inputs[0]); L.new(gt.outputs[0], mu.inputs[1]); L.new(mu.outputs[0], mx.inputs['Fac'])
NOLINE = ('floor', 'carpet', 'wall', 'ceil', 'glass', 'win', 'CARD_', 'SHADOWCARD_', 'CONTACT_', 'contact', 'sky', 'cloud', 'cumulus', 'out_', 'cove', 'fabric')
PL.HIDE.extend([o for o in sc.objects if o.type == 'MESH' and not o.visible_camera])   # wild row, outer skin, glass: no lines from what the lens does not see
LINES = [o for o in sc.objects if o.type == 'MESH' and o.visible_get() and not o.hide_render and o.visible_camera and not o.name.startswith(NOLINE)]
fo = PL.render_setup(sc, int(os.environ.get('W', 540)), int(os.environ.get('H', 960)), int(os.environ.get('SPP', 24)), bounces=6)
bpy.context.view_layer.update()
info = dict(cam=list(CAM), aim=AIM, lens=LENS, michel_foot=[round(x, 2) for x in loc], exposure=EX,
            scr=dict(michel_foot=PL.screen(sc, loc), michel_head=PL.screen(sc, loc + Vector((0, 0, 1.3))), meal=PL.screen(sc, (0.30, 1.25, 0.79)),
                     window=PL.screen(sc, (0.18, 1.754, 1.02)), seat=PL.screen(sc, (0, 1.2, 0.52))),
            down_angle_deg=dict(michel=PL.down_angle(sc, mi)), lines=len(LINES))
print('INFO', json.dumps(info), flush=True); json.dump(info, open(os.path.join(HERE, 'prev', 'C_info.json'), 'w'), indent=1)
if MODE == 'preview': PL.go(sc, OUT, fo, LINES)

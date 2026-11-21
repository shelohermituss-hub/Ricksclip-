"""bl_proof.py: light-preview tiles of the Cessna states in the Rick day light (templates/blender_look/rick_light.json), on the flat
airfield lawn (library/grass rick_grass) Cycles CPU 32 spp + OIDN, 540x960, plus the outline id pass per tile.
Run: blender -b --factory-startup --python bl_proof.py -- <props/out> <tiles dir>      Ends with PROOF_DONE."""
import bpy, sys, os, json, math, time
from mathutils import Vector

A = sys.argv[sys.argv.index('--') + 1:]
OUT, TIL = A[0], A[1]
os.makedirs(TIL, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'library', 'grass')); sys.path.insert(0, os.path.join(ROOT, 'templates', 'blender_look', 'rick_outline'))
LT = json.load(open(os.path.join(ROOT, 'templates', 'blender_look', 'rick_light.json')))['day']

SHOTS = {   # tile: (blend, camera, look-at, lens, hide-rule)
    'A_hero34': ('cessna150', (6.2, -6.6, 0.55), (0.2, -0.4, 1.45), 20, None),
    'B_side': ('cessna150', (10.6, 0.5, 1.3), (0, 0.5, 1.2), 26, None),
    'C_front': ('cessna150', (0.0, -13.5, 1.3), (0, 0, 1.25), 26, None),
    'D_top_rear': ('cessna150', (-5.6, 8.0, 5.4), (0, 0.2, 0.8), 22, None),
    'E_wingoff': ('cessna150_wingoff', (6.8, -6.4, 1.3), (1.3, -0.4, 1.05), 22, None),
    'F_sliced': ('cessna150_sliced', (9.0, -4.2, 2.6), (0, 0.9, 0.9), 22, None),
    'G_sliced_half': ('cessna150_sliced', (6.8, -6.4, 2.2), (0, -1.6, 0.9), 22, [3, 4, 5, 6, 7, 8]),
    'H_nose_only': ('cessna150_sliced', (2.6, -5.8, 1.1), (0, -3.3, 0.85), 26, [1, 2, 3, 4, 5, 6, 7, 8]),
    'I_stub_macro': ('cessna150_wingoff', (3.3, -2.4, 2.25), (0.95, -0.9, 1.8), 32, None),
    'J_reg_macro': ('cessna150', (3.6, -0.6, 1.5), (0.4, 1.1, 1.35), 30, None),
}


def lin(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in c] + [1.0]


def stage(sc):
    import rick_grass as G
    w = bpy.data.worlds.new('sky'); sc.world = w; w.use_nodes = True; N, L = w.node_tree.nodes, w.node_tree.links
    bg_lit = N['Background']; bg_cam = N.new('ShaderNodeBackground'); lp = N.new('ShaderNodeLightPath'); mix = N.new('ShaderNodeMixShader')
    tc = N.new('ShaderNodeTexCoord'); sep = N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Generated'], sep.inputs[0])
    mr = N.new('ShaderNodeMapRange'); mr.inputs['From Max'].default_value = .35; L.new(sep.outputs['Z'], mr.inputs['Value'])
    ramp = N.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].color = lin(LT['sky_low']); ramp.color_ramp.elements[1].color = lin(LT['sky_top'])
    L.new(mr.outputs[0], ramp.inputs[0]); L.new(ramp.outputs[0], bg_cam.inputs['Color'])
    bg_lit.inputs['Color'].default_value = lin(LT['fill_col']); bg_lit.inputs['Strength'].default_value = LT['fill']
    L.new(lp.outputs['Is Camera Ray'], mix.inputs[0]); L.new(bg_lit.outputs[0], mix.inputs[1]); L.new(bg_cam.outputs[0], mix.inputs[2])
    L.new(mix.outputs[0], N['World Output'].inputs[0])
    sd = bpy.data.lights.new('sun', 'SUN'); sd.energy = LT['sun']; sd.angle = math.radians(LT['sun_angle_deg']); sd.color = lin(LT['sun_col'])[:3]
    sun = bpy.data.objects.new('sun', sd); sc.collection.objects.link(sun)
    el, az = math.radians(LT['sun_el']), math.radians(130)       # sun from the front-left: the left flank and F-MIAM in full sun
    d = Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
    sun.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    G.flat_lawn(size=(400, 400), location=(0, 60, 0))
    pts = []
    for o in sc.objects:
        if o.type == 'MESH' and not o.hide_render and ('tyre' in o.name or 'sawhorse' in o.name):
            v = [o.matrix_world @ Vector(c) for c in o.bound_box]
            pts.append(((min(p.x for p in v) + max(p.x for p in v)) / 2, (min(p.y for p in v) + max(p.y for p in v)) / 2, 0))
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 32; sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.max_bounces = 6
    sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 540, 960, 100
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; sc.view_settings.exposure = LT['exposure']
    sc.render.image_settings.file_format = 'PNG'


times = {}
import lines_key as LK
for tile, (blend, cam, look, lens, hide) in SHOTS.items():
    bpy.ops.wm.open_mainfile(filepath=os.path.join(OUT, blend + '.blend'))
    sc = bpy.context.scene
    if hide:
        for i in hide:
            for c in bpy.data.objects[f'slice_{i}'].children: c.hide_render = True
    stage(sc)
    cd = bpy.data.cameras.new('cam'); cd.lens = lens; cd.sensor_width = 36; cd.clip_end = 900
    co = bpy.data.objects.new('cam', cd); sc.collection.objects.link(co); co.location = cam
    co.rotation_euler = (Vector(look) - Vector(cam)).to_track_quat('-Z', 'Y').to_euler(); sc.camera = co
    sc.render.filepath = os.path.join(TIL, tile + '.png'); t0 = time.time(); bpy.ops.render.render(write_still=True)
    times[tile] = round(time.time() - t0, 1)
    line_objs = [o for o in sc.objects if o.type == 'MESH' and not o.hide_render and not o.name.startswith(('lawn', 'wheel_tufts'))
                 and 'glass' not in o.name]
    LK.setup(sc, line_objs, []); LK.render(sc, os.path.join(TIL, tile + '_lines_id.png'))
    print('TILE', tile, times[tile], 's')
json.dump(times, open(os.path.join(TIL, 'times.json'), 'w'))
print('PROOF_DONE')

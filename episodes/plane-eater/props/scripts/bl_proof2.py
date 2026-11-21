"""bl_proof2.py: light preview of the round-2 props (props/out/props2.blend), Rick day light (rick_light.json), flat lawn, preview
stands (white cloth boxes, NOT set pieces), Cycles 32 spp + OIDN, 540x960 tiles + outline id pass.
Run: blender -b --factory-startup --python bl_proof2.py -- <props/out> <tiles dir>      Ends with PROOF2_DONE."""
import bpy, sys, os, json, math, time
from mathutils import Vector, Matrix
A = sys.argv[sys.argv.index('--') + 1:]
OUT, TIL = A[0], A[1]
os.makedirs(TIL, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'library', 'grass')); sys.path.insert(0, os.path.join(ROOT, 'templates', 'blender_look', 'rick_outline'))
LT = json.load(open(os.path.join(ROOT, 'templates', 'blender_look', 'rick_light.json')))['day']
import lines_key as LK

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



bpy.ops.wm.open_mainfile(filepath=os.path.join(OUT, 'props2.blend'))
sc = bpy.context.scene
dg = bpy.context.evaluated_depsgraph_get()


def box_of(cname):
    lo, hi = Vector((1e9,) * 3), Vector((-1e9,) * 3)
    for o in bpy.data.collections[cname].objects:
        if o.type != 'MESH' or o.hide_render: continue
        ev = o.evaluated_get(dg); me = ev.to_mesh()
        for v in me.vertices:
            w = o.matrix_world @ v.co; lo = Vector(map(min, lo, w)); hi = Vector(map(max, hi, w))
        ev.to_mesh_clear()
    return lo, hi


def place(cname, x, y, ztop, rz=0.0):
    """move a prop so its footprint centre is at (x, y) and its lowest point on ztop (preview only)"""
    lo, hi = box_of(cname); c = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
    M = Matrix.Translation((x, y, ztop)) @ Matrix.Rotation(rz, 4, 'Z') @ Matrix.Translation(-c)
    for o in bpy.data.collections[cname].objects: o.matrix_world = M @ o.matrix_world


cloth = bpy.data.materials.get('p2_cloth_white')
def stand(x, y, w, d, h=.75):
    bpy.ops.mesh.primitive_cube_add(location=(x, y, h / 2)); o = bpy.context.active_object; o.scale = (w / 2, d / 2, h / 2)
    o.data.materials.append(cloth); o.name = 'preview_stand'
    m = o.modifiers.new('b', 'BEVEL'); m.width = .02; m.segments = 3
    return o


T = .75
stand(0, 0, 1.3, .8)
place('plate', 0, 0, T); place('metal_bites', 0, 0, T + .009, .3)
place('fork', -.02, -.25, T); place('knife', .02, -.3, T)
place('oil_glass', .28, .14, T); place('water_jug', -.33, .18, T); place('kitchen_scale', .42, -.12, T, math.radians(-15))
place('salt_shaker', .14, .27, T); place('sugar_tongs', -.25, -.12, T, .5)
place('dessert_trolley', -5, 0, 0, math.radians(-20))
stand(5, 0, 1.3, .8)
place('record_book', 4.62, -.05, T, .25); place('certificate', 5.1, .2, T); place('cloche_bell', 5.0, -.2, T); place('airline_tray', 5.42, -.18, T, -.2)
stand(10, 0, 1.3, .8)
place('hacksaw', 9.85, -.05, T, .2); place('owner_rag_spanner', 10.2, .12, T, -.4)
SHOTS = {
    'P1_table': ((0, -1.05, 1.45), (0, .02, .8), 30),
    'P2_dessert': ((-5 + 1.2, -2.6, 1.5), (-5, 0, .95), 30),
    'P3_records_tray': ((5, -1.15, 1.45), (5, 0, .82), 30),
    'P4_tools': ((10, -.95, 1.35), (10, 0, .8), 30),
    'P5_scale_macro': ((.36, -.55, 1.0), (.42, -.12, .86), 45),
}
stage(sc)
times = {}
for tile, (cam, look, lens) in SHOTS.items():
    cd = bpy.data.cameras.new('cam'); cd.lens = lens; cd.sensor_width = 36; cd.clip_end = 900
    co = bpy.data.objects.new('cam_' + tile, cd); sc.collection.objects.link(co); co.location = cam
    co.rotation_euler = (Vector(look) - Vector(cam)).to_track_quat('-Z', 'Y').to_euler(); sc.camera = co
    sc.render.filepath = os.path.join(TIL, tile + '.png'); t0 = time.time(); bpy.ops.render.render(write_still=True)
    times[tile] = round(time.time() - t0, 1)
    line_objs = [o for o in sc.objects if o.type == 'MESH' and not o.hide_render and not o.name.startswith(('lawn', 'preview_stand'))
                 and 'glass' not in o.name and 'water' not in o.name]
    LK.setup(sc, line_objs, []); LK.render(sc, os.path.join(TIL, tile + '_lines_id.png'))
    print('TILE', tile, times[tile], flush=True)
json.dump(times, open(os.path.join(TIL, 'times2.json'), 'w'))
print('PROOF2_DONE')

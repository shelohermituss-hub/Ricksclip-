# bl_town_proof.py: the DETAIL GATE stills of the DALLAS set in Blender (Cycles CPU 16 spp (light preview rule; the first gate set was 32 spp) + OIDN, Standard view; single frames only).
# blender -b out/dallas.blend --python bl_dallas_proof.py -- <out png dir> [w h] [cams comma list]
# The cameras are the SAME numbers as proof/kit (CAMS in dallas_cams.json): plan frame, lens on a 36 mm tall sensor (LOOK_BIBLE 24 mm).
import bpy, sys, os, json, math, time
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.append(HERE); import dallas_api as TA
a = sys.argv[sys.argv.index('--') + 1:]; OUTD, KIND = a[0], 'no'; a = [a[0], 'no'] + a[1:]; W, H = (int(a[2]), int(a[3])) if len(a) > 3 else (540, 960)
CAMS = json.load(open(os.path.join(HERE, 'dallas_cams.json'))); want = a[4].split(',') if len(a) > 4 else list(CAMS)
os.makedirs(OUTD, exist_ok=True); sc = bpy.context.scene
TA.set_light(sc); TA.set_boards(sc, n=3, ladder=True, stool=False, painters=True, leaves=0)
r = sc.render; r.resolution_x, r.resolution_y, r.resolution_percentage = W, H, 100; r.image_settings.file_format = 'PNG'
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; r.engine = 'CYCLES'; sc.cycles.device = 'CPU'
# light previews (user 2026-11-20 "Oui applique les aperçus légers"): 16 spp + OIDN at 540x960 (FIX 1: this line used to sit behind a mid-line '#', so OIDN was never set)
sc.cycles.samples = 16; sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.use_adaptive_sampling = True
sc.cycles.max_bounces = 5; sc.cycles.transparent_max_bounces = 12
def card(png, pos, height, cam):
    im = bpy.data.images.load(png); w, h = im.size; px = [im.pixels[i * 4 + 3] for i in range(0, w * h, 7)]
    s = height / (h * .723)                                           # the figure fills about 72 % of the picture height (cast/views)
    m = bpy.data.materials.new('card'); m.use_nodes = True; N = m.node_tree.nodes; b = N['Principled BSDF']; t = N.new('ShaderNodeTexImage'); t.image = im
    m.node_tree.links.new(t.outputs[0], b.inputs['Base Color']); m.node_tree.links.new(t.outputs[1], b.inputs['Alpha']); b.inputs['Roughness'].default_value = 1.
    m.node_tree.links.new(t.outputs[0], b.inputs['Emission Color']); b.inputs['Emission Strength'].default_value = .35
    bpy.ops.mesh.primitive_plane_add(size=1); o = bpy.context.object; o.name = 'CAST_CARD'; o.data.materials.append(m)
    o.scale = (w * s, h * s, 1); o.rotation_euler = (math.radians(90), 0, 0)
    d = Vector(cam) - Vector(pos); o.rotation_euler.z = math.atan2(d.y, d.x) - math.pi / 2
    o.location = (pos[0], pos[1], pos[2] + h * s / 2 - (h - 1082) * s); return o
times = {}
for name in want:
    c = CAMS[name]; co = bpy.data.objects.get('cam') or bpy.data.objects.new('cam', bpy.data.cameras.new('cam'))
    if co.name not in sc.collection.objects: sc.collection.objects.link(co)
    co.data.sensor_fit = 'VERTICAL'; co.data.sensor_height = 36; co.data.lens = c['lens']; co.data.clip_start = .03; co.data.clip_end = 2000
    co.location = c['pos']; co.rotation_euler = (Vector(c['aim']) - Vector(c['pos'])).to_track_quat('-Z', 'Y').to_euler(); sc.camera = co
    TA.set_boards(sc, **{**dict(n=3, ladder=True, stool=False, painters=True, leaves=0), **c.get('boards', {})})
    old = bpy.data.objects.get('CAST_CARD')
    if old: bpy.data.objects.remove(old)
    if c.get('card'): card(os.path.normpath(os.path.join(HERE, '..', '..', '..', c['card']['png'])), c['card']['pos'], c['card']['h'], c['pos'])
    r.filepath = os.path.join(OUTD, 'bl_%s_%s.png' % (KIND, name)); t0 = time.time(); bpy.ops.render.render(write_still=True)
    times[name] = round(time.time() - t0, 1); print('PROOF bl_%s_%s RENDER_SECONDS %.1f SIZE %dx%d' % (KIND, name, times[name], W, H), flush=True)
json.dump(times, open(os.path.join(OUTD, 'bl_times_%s.json' % KIND), 'w'))
print('BL_PROOF_END')

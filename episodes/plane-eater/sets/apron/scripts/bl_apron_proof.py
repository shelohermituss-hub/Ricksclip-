# bl_apron_proof.py: light-preview stills of the apron from the plan's main camera stations (apron_cams.json), Rick day light, the Cessna on its spot.
# blender -b out/apron.blend --python bl_apron_proof.py -- <tiles dir> <cessna blend> [W H spp]   -> <tile>.png + <tile>_lines_id.png ; ends PROOF_DONE
import bpy, sys, os, json, time
from mathutils import Vector
A = sys.argv[sys.argv.index('--') + 1:]; TIL, CES = A[0], A[1]; W, H, SPP = (int(A[2]), int(A[3]), int(A[4])) if len(A) > 4 else (540, 960, 16)
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..'))
sys.path[:0] = [HERE, os.path.join(ROOT, 'templates', 'blender_look', 'rick_outline')]
import apron_api as AA, lines_key as LK
os.makedirs(TIL, exist_ok=True); sc = bpy.context.scene
AA.set_light(sc, 'day'); AA.link_cessna(sc, CES)
for o in list(bpy.data.objects):
    if o.name.startswith(('lawn.', 'wheel_tufts')) and 'CESSNA' in [c.name for c in o.users_collection]: bpy.data.objects.remove(o)
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SPP; sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.max_bounces = 5
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = W, H, 100; sc.render.image_settings.file_format = 'PNG'
CAMS = json.load(open(os.path.join(HERE, 'apron_cams.json')))
NOLINE = ('lawn', 'apron_slab', 'hangar_floor', 'runway_mow', 'taxi_', 'fields_', 'hill_', 'tufts', 'clad_', 'hangar_wall', 'hangar_pier', 'hangar_header',
          'gable_infill', 'air_mote', 'glass', 'win_glass', 'door_glass', 'office_wall', 'office_clad', 'roof', 'cloth_top', 'oil_in', 'jug_water')
times = {}
for tile, c in CAMS.items():
    if tile.startswith('_'): continue
    cd = bpy.data.cameras.new('cam_' + tile); cd.lens = c['lens']; cd.sensor_width = 36; cd.clip_end = 2000; cd.clip_start = .05
    co = bpy.data.objects.new('cam_' + tile, cd); sc.collection.objects.link(co); co.location = c['pos']
    co.rotation_euler = (Vector(c['look']) - Vector(c['pos'])).to_track_quat('-Z', 'Y').to_euler(); sc.camera = co
    sc.render.filepath = os.path.join(TIL, tile + '.png'); t0 = time.time(); bpy.ops.render.render(write_still=True); times[tile] = round(time.time() - t0, 1)
    lines = [o for o in sc.objects if o.type == 'MESH' and o.visible_get() and not o.name.startswith(NOLINE) and not o.name.startswith('tree') and not o.name.startswith('poplar')]
    LK.setup(sc, lines, []); LK.render(sc, os.path.join(TIL, tile + '_lines_id.png')); print('TILE', tile, times[tile], 's')
json.dump(times, open(os.path.join(TIL, 'times.json'), 'w')); print('PROOF_DONE')

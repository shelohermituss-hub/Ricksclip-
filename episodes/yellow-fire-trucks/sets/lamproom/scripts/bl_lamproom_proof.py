# bl_lamproom_proof.py: single Blender stills of the lamp room (light preview rule: 540x960, Cycles 16 spp + OIDN, Standard view). No date or time in any image.
# blender -b out/lamproom.blend --python bl_lamproom_proof.py -- <out dir> <tile,tile,...>   tile = name:CAM:wave:iris
import bpy, sys, os, time, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.append(HERE); import lamproom_api as API
a = sys.argv[sys.argv.index('--') + 1:]; OUT = a[0]; os.makedirs(OUT, exist_ok=True); sc = bpy.context.scene
sc.cycles.use_denoising = True
sc.cycles.denoiser = 'OPENIMAGEDENOISE'
sc.cycles.samples = int(os.environ.get('SPP', 16))
tf = os.path.join(OUT, 'bl_times.json'); times = json.load(open(tf)) if os.path.exists(tf) else {}
for t in a[1].split(','):
    name, cam, wave, iris = t.split(':'); API.set_state(sc, wave=int(wave), iris=float(iris)); API.use_cam(sc, cam)
    sc.render.filepath = os.path.join(OUT, 'bl_%s.png' % name); t0 = time.time(); bpy.ops.render.render(write_still=True)
    times[name] = round(time.time() - t0, 1); print('PROOF', name, 'RENDER_SECONDS', times[name], flush=True)
json.dump(times, open(tf, 'w'), indent=1); print('BL_PROOF_END')

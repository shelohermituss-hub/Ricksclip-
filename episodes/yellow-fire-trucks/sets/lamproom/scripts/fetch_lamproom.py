# fetch_lamproom.py: downloads the CC0 Poly Haven parts of THE LAMP ROOM (bulb, cables, power box, meter, socket; 4 metal textures). Re-runnable.
# python3 fetch_lamproom.py <assets dir>   -> <assets>/ph_town/models/<id>/<id>.gltf (+ bin + 1k textures), <assets>/ph_town/tex/<id>_{diff,nor_gl,rough}_1k.jpg
# Licence: every file is CC0 (polyhaven.com/license). Prints FETCH_END.
import json, os, sys, urllib.request
A = os.path.join(sys.argv[1], 'ph_lamproom'); os.makedirs(A, exist_ok=True)
MODELS = ['lightbulb_01', 'modular_electric_cables', 'power_box_01', 'retro_multimeter', 'pull_chain_light_socket']
TEX = ['metal_plate', 'metal_plate_02', 'metal_grate_rusty', 'painted_metal_shutter']
UA = {'User-Agent': 'Mozilla/5.0 (asset-fetch)'}  # Poly Haven answers 403 to the default Python-urllib agent
def op(url): return urllib.request.urlopen(urllib.request.Request(url, headers=UA))
def get(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 0: return
    os.makedirs(os.path.dirname(path), exist_ok=True); tmp = path + '.part'
    open(tmp, 'wb').write(op(url).read()); os.replace(tmp, path)
def files(i): return json.load(op('https://api.polyhaven.com/files/' + i))
for m in MODELS:
    try:
        g = files(m)['gltf']['1k']['gltf']; d = os.path.join(A, 'models', m)
        get(g['url'], os.path.join(d, m + '.gltf'))
        for p, v in g.get('include', {}).items(): get(v['url'], os.path.join(d, p))
        print('MODEL', m, 'ok', flush=True)
    except Exception as e: print('MODEL', m, 'FAIL', e, flush=True)
for t in TEX:
    try:
        f = files(t)
        for k, key in (('diff', 'Diffuse'), ('nor_gl', 'nor_gl'), ('rough', 'Rough')):
            get(f[key]['1k']['jpg']['url'], os.path.join(A, 'tex', '%s_%s_1k.jpg' % (t, k)))
        print('TEX', t, 'ok', flush=True)
    except Exception as e: print('TEX', t, 'FAIL', repr(e), flush=True)
print('FETCH_END')

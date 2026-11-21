# fetch_set.py: downloads the CC0 Poly Haven parts of the _style_test front-yard set (re-runnable: skips files already there).
# python3 fetch_set.py <assets dir>  -> <assets>/ph_set/models/<id>/<id>.gltf (+ bin + 1k textures), <assets>/ph_set/tex/<id>_{diff,nor_gl,rough}_1k.jpg
# A local copy from episodes/yellow-fire-trucks/assets/ph_town is used first when it exists (same CC0 file). Prints FETCH_END.
import json, os, sys, shutil, urllib.request
A = os.path.join(sys.argv[1], 'ph_set'); os.makedirs(A, exist_ok=True)
LOCAL = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../yellow-fire-trucks/assets/ph_town'))
MODELS = ['island_tree_02', 'garden_gnome', 'garden_sprinkler_01', 'flower_gazania', 'flower_ursinia', 'periwinkle_plant',
          'shrub_02', 'shrub_03', 'shrub_04', 'grass_bermuda_01']
TEX = ['concrete_pavement']
UA = {'User-Agent': 'Mozilla/5.0 (asset-fetch)'}
def op(url): return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120)
def get(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 0: return
    os.makedirs(os.path.dirname(path), exist_ok=True); tmp = path + '.part'
    open(tmp, 'wb').write(op(url).read()); os.replace(tmp, path)
def files(i): return json.load(op('https://api.polyhaven.com/files/' + i))
fail = 0
for m in MODELS:
    d = os.path.join(A, 'models', m)
    if os.path.isdir(os.path.join(LOCAL, 'models', m)) and not os.path.exists(os.path.join(d, m + '.gltf')):
        shutil.copytree(os.path.join(LOCAL, 'models', m), d, dirs_exist_ok=True); print('MODEL', m, 'local copy', flush=True); continue
    try:
        g = files(m)['gltf']['1k']['gltf']
        get(g['url'], os.path.join(d, m + '.gltf'))
        for p, v in g.get('include', {}).items(): get(v['url'], os.path.join(d, p))
        print('MODEL', m, 'ok', flush=True)
    except Exception as e: fail += 1; print('MODEL', m, 'FAIL', e, flush=True)
for t in TEX:
    try:
        f = files(t)
        for k, key in (('diff', 'Diffuse'), ('nor_gl', 'nor_gl'), ('rough', 'Rough')):
            src = os.path.join(LOCAL, 'tex', '%s_%s_1k.jpg' % (t, k)); dst = os.path.join(A, 'tex', '%s_%s_1k.jpg' % (t, k))
            if os.path.exists(src) and not os.path.exists(dst): os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copy(src, dst); continue
            get(f[key]['1k']['jpg']['url'], dst)
        print('TEX', t, 'ok', flush=True)
    except Exception as e: fail += 1; print('TEX', t, 'FAIL', repr(e), flush=True)
print('FETCH_END fails=%d' % fail)

# fetch_map.py: downloads the ready-made parts of PLACE C, THE MAP (S4, line 7). Re-runnable: skips files already there. Prints FETCH_END.
# python3 fetch_map.py <assets dir>  -> <assets>/map/{ph/<id>/..., tex/..., acg/<id>/..., us-atlas/states-10m.json}
# Licences: Poly Haven CC0, ambientCG CC0, us-atlas (npm, ISC; data from the US Census Bureau, public domain).
import json, os, sys, urllib.request, zipfile, io, tarfile
A = os.path.join(sys.argv[1], 'map'); os.makedirs(A, exist_ok=True)
UA = {'User-Agent': 'Mozilla/5.0 (asset-fetch)'}   # Poly Haven answers 403 to the default Python-urllib agent (LECONS 2026-11-20)
def op(url): return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120)
def get(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 0: return
    os.makedirs(os.path.dirname(path), exist_ok=True); tmp = path + '.part'; open(tmp, 'wb').write(op(url).read()); os.replace(tmp, path)
def files(i): return json.load(op('https://api.polyhaven.com/files/' + i))
for m in ['seadogs_compass', 'magnifying_glass_01', 'pine_sapling_small', 'measuring_tape_01']:
    try:
        g = files(m)['gltf']['1k']['gltf']; d = os.path.join(A, 'ph', m); get(g['url'], os.path.join(d, m + '.gltf'))
        for p, v in g.get('include', {}).items(): get(v['url'], os.path.join(d, p))
        print('MODEL', m, 'ok', flush=True)
    except Exception as e: print('MODEL', m, 'FAIL', repr(e), flush=True)
for t in ['wood_table_worn']:
    try:
        f = files(t)
        for k, key in (('diff', 'Diffuse'), ('nor_gl', 'nor_gl'), ('rough', 'Rough')): get(f[key]['1k']['jpg']['url'], os.path.join(A, 'tex', '%s_%s_1k.jpg' % (t, k)))
        print('TEX', t, 'ok', flush=True)
    except Exception as e: print('TEX', t, 'FAIL', repr(e), flush=True)
for t in ['Paper001', 'Paper004', 'Cardboard004']:
    d = os.path.join(A, 'acg', t)
    try:
        if not os.path.exists(os.path.join(d, 'ok')):
            z = zipfile.ZipFile(io.BytesIO(op('https://ambientcg.com/get?file=%s_2K-JPG.zip' % t).read())); os.makedirs(d, exist_ok=True)
            for n in z.namelist():
                if n.endswith('.jpg'): open(os.path.join(d, os.path.basename(n)), 'wb').write(z.read(n))
            open(os.path.join(d, 'ok'), 'w').write('ok')
        print('ACG', t, 'ok', flush=True)
    except Exception as e: print('ACG', t, 'FAIL', repr(e), flush=True)
p = os.path.join(A, 'us-atlas', 'states-10m.json')
try:
    if not os.path.exists(p):
        meta = json.load(op('https://registry.npmjs.org/us-atlas/3.0.1')); tb = tarfile.open(fileobj=io.BytesIO(op(meta['dist']['tarball']).read()))
        os.makedirs(os.path.dirname(p), exist_ok=True); open(p, 'wb').write(tb.extractfile('package/states-10m.json').read())
    print('ATLAS ok', flush=True)
except Exception as e: print('ATLAS FAIL', repr(e), flush=True)
for pk, fn in (('patrick-hand', 'patrick-hand-latin-400-normal.woff'), ('righteous', 'righteous-latin-400-normal.woff')):   # OFL fonts from npm (@fontsource)
    p = os.path.join(A, 'fonts', fn)
    try:
        if not os.path.exists(p):
            meta = json.load(op('https://registry.npmjs.org/@fontsource/%s/latest' % pk)); tb = tarfile.open(fileobj=io.BytesIO(op(meta['dist']['tarball']).read()))
            os.makedirs(os.path.dirname(p), exist_ok=True); open(p, 'wb').write(tb.extractfile('package/files/' + fn).read())
        print('FONT', pk, 'ok', flush=True)
    except Exception as e: print('FONT', pk, 'FAIL', repr(e), flush=True)
print('FETCH_END')

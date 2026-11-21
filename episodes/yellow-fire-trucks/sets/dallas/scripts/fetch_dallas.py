# fetch_dallas.py: downloads the ready-made CC0 Poly Haven parts of PLACE B, the DALLAS station yard (re-runnable: skips files already there).
# python3 fetch_dallas.py <assets dir>   -> <assets>/ph_dallas/models/<id>/<id>.gltf (+ bin + 1k textures), <assets>/ph_dallas/tex/<id>_{diff,nor_gl,rough}_1k.jpg
# Licence: every file is CC0 (polyhaven.com/license). Prints FETCH_END. Models already fetched for the town (assets/ph_town) are reused from there.
import json, os, sys, urllib.request, shutil
A = os.path.join(sys.argv[1], 'ph_dallas'); TOWN = os.path.join(sys.argv[1], 'ph_town'); os.makedirs(A, exist_ok=True)
MODELS = ['standing_chalkboard_01', 'clipboard', 'ladder_sectioned_01', 'wooden_ladder', 'folding_wooden_stool', 'grass_medium_01', 'dry_branches_medium_01',
          'metal_jerrycan', 'propane_tank', 'wooden_crate_02', 'metal_trash_can', 'oil_tin', 'old_tyre', 'barrel_03', 'small_wooden_table_01', 'can_rusted',
          'metal_tool_chest', 'sand_rocks_small_01', 'wild_rooibos_bush', 'fire_hydrant', 'industrial_wall_lamp', 'modular_chainlink_fence', 'metal_jug',
          'wooden_bucket_02', 'garden_hose_wall_mounted_01', 'painted_wooden_bench', 'concrete_road_barrier', 'spray_paint_bottles', 'water_manhole_cover',
          'tool_cart', 'cardboard_box_01', 'dead_tree_trunk_02']
TEX = ['white_stucco', 'smooth_concrete_floor', 'concrete_floor_worn_001', 'dry_ground_01', 'withered_grass', 'corrugated_iron', 'painted_metal_shutter',
       'concrete_pavement', 'asphalt_02', 'rusty_metal', 'wood_table_worn', 'concrete_block_wall', 'sandy_gravel', 'box_profile_metal_sheet']
UA = {'User-Agent': 'Mozilla/5.0 (asset-fetch)'}  # Poly Haven answers 403 to the default Python-urllib agent (LECONS 2026-11-20)
def op(url): return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60)
def get(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 0: return
    os.makedirs(os.path.dirname(path), exist_ok=True); tmp = path + '.part'
    open(tmp, 'wb').write(op(url).read()); os.replace(tmp, path)
def files(i): return json.load(op('https://api.polyhaven.com/files/' + i))
for m in MODELS:
    d = os.path.join(A, 'models', m); src = os.path.join(TOWN, 'models', m)
    if not os.path.exists(os.path.join(d, m + '.gltf')) and os.path.exists(os.path.join(src, m + '.gltf')): shutil.copytree(src, d, dirs_exist_ok=True)
    try:
        g = files(m)['gltf']['1k']['gltf']
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

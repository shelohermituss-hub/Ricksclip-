# fetch_town.py: downloads the ready-made CC0 Poly Haven parts of the PINE HOLLOW town set (re-runnable: skips files already there).
# python3 fetch_town.py <assets dir>   -> <assets>/ph_town/models/<id>/<id>.gltf (+ bin + 1k textures), <assets>/ph_town/tex/<id>_{diff,nor_gl,rough}_1k.jpg
# Licence: every file is CC0 (polyhaven.com/license). Prints FETCH_END.
import json, os, sys, urllib.request
A = os.path.join(sys.argv[1], 'ph_town'); os.makedirs(A, exist_ok=True)
MODELS = ['street_lamp_01', 'street_lamp_02', 'painted_wooden_bench', 'metal_trash_can', 'water_manhole_cover', 'fire_hydrant', 'industrial_wall_lamp',
          'garden_hose_wall_mounted_01', 'wooden_crate_01', 'oil_tin', 'wooden_ladder', 'watering_can_metal_01', 'BarberShopChair_01', 'desk_lamp_arm_01',
          'hanging_picture_frame_01', 'wall_clock', 'shrub_02', 'shrub_03', 'shrub_04', 'island_tree_02', 'jacaranda_tree', 'grass_bermuda_01', 'dandelion_01',
          'weed_plant_02', 'utility_box_01', 'old_tyre', 'barrel_03', 'cardboard_box_01', 'wooden_bucket_01', 'metal_toolbox', 'tree_stump_01', 'rubber_boots']
TEX = ['weathered_plank_siding', 'white_planks_clean', 'concrete_floor_worn_001', 'concrete_pavement', 'asphalt_02', 'leafy_grass', 'grey_roof_01',
       'concrete_block_wall', 'wooden_garage_door', 'painted_plaster_wall', 'bark_brown_02', 'plank_flooring', 'roof_slates_02', 'forest_ground_04']
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

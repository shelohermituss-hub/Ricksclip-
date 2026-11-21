# make_field.py (FIX 2, set-builder 2026-11-21): the DENSE POP-UP FIELD of small stations for the S4 EXTREME on "cities" ("hundreds of doors"): the 47 city stations
# are 1.05 m apart, so no portrait camera over the paper shows more than about 14 of them. This adds smaller stations (scale .5-.68) on land between them,
# at least .62 m from each other and .8 m from a city station, in the lower 48 only, deterministic (seed). No rebuild needed: the kit (map.js places.<name>.field)
# and Blender (map_api.add_field) both read out/map_field.json.   python3 make_field.py <assets/map> <out dir> [n_max 260] [seed 7]
import sys, os, json, random, math
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import map_geo as G
A, OUT = sys.argv[1], sys.argv[2]; NMAX = int(sys.argv[3]) if len(sys.argv) > 3 else 260; SEED = int(sys.argv[4]) if len(sys.argv) > 4 else 7
ST = G.load_states(os.path.join(A, 'us-atlas', 'states-10m.json'))
PX = 20.; X0, Y0 = -G.MAP_W / 2, -G.MAP_H / 2; W, H = int(G.MAP_W * PX), int(G.MAP_H * PX)
im = Image.new('L', (W, H), 0); d = ImageDraw.Draw(im)
for _, (nm, rings) in ST.items():
    for r in rings:
        pts = [G.ll(lo, la) for lo, la in r]; d.polygon([((x - X0) * PX, (H - (y - Y0) * PX)) for x, y in pts], fill=255)
land = np.asarray(im) > 0
def on_land(x, y, m=.5):
    for u, v in ((0, 0), (-m, 0), (m, 0), (0, -m), (0, m)):
        i, j = int(H - (y + v - Y0) * PX), int((x + u - X0) * PX)
        if not (0 <= i < H and 0 <= j < W) or not land[i, j]: return False
    return True
city = [(s[1], s[2] + G.STATION_OFF) for s in G.stations()]
rnd = random.Random(SEED); pts = []
for _ in range(40000):
    if len(pts) >= NMAX: break
    x, y = rnd.uniform(X0 + 1, -X0 - 1), rnd.uniform(Y0 + 1, -Y0 - 1)
    if not on_land(x, y): continue
    if any(math.hypot(x - a, y - b) < .8 for a, b in city): continue
    if any(math.hypot(x - a, y - b) < .62 for a, b, _, _ in pts): continue
    s = round(rnd.uniform(.5, .68), 3); z = max(G.fold_z(x + u * s, y + v * s) for u in (-.45, 0, .45) for v in (-.55, 0, .45)) - .004
    pts.append((round(x, 3), round(y, 3), round(z, 4), s))
pts.sort(key=lambda p: p[0])
json.dump(dict(note='FIX 2 dense pop-up field: [x, y, z, scale] plan metres, sorted west -> east; station model = st_00 without its sign',
               count=len(pts), seed=SEED, field=[list(p) for p in pts]), open(os.path.join(OUT, 'map_field.json'), 'w'))
print('FIELD', len(pts))

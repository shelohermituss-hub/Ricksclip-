# map_geo.py: the ONE geography of PLACE C (shared by tex_map.py, bl_map.py, the kit meta). Map metres, Z up, map centre (0,0), north +Y.
# The printed USA (lower 48) is drawn with an Albers equal-area conic (parallels 29.5/45.5, centre lon -96, lat 38.5): the 1970s road-map look.
import math, json, os
MAP_W, MAP_H = 32.0, 20.0                 # paper size in metres (a real 0.91 x 0.57 m road map at x35, so 1 m on the table = 2.9 cm real)
PANELS = (8, 4)                           # fold panels across and down
P1, P2, LON0, LAT0 = map(math.radians, (29.5, 45.5, -96.0, 38.5))
N = (math.sin(P1) + math.sin(P2)) / 2; C = math.cos(P1) ** 2 + 2 * N * math.sin(P1); R0 = math.sqrt(C - 2 * N * math.sin(LAT0)) / N
def albers(lon, lat):
    l, p = math.radians(lon), math.radians(lat); r = math.sqrt(C - 2 * N * math.sin(p)) / N; t = N * (l - LON0)
    return r * math.sin(t), R0 - r * math.cos(t)
# fit: the lower-48 box (measured once from the atlas: x -0.3689..0.3531, y -0.2284..0.2282 in unit Albers) into x -12.8..12.8, y -7.3..8.9
AX0, AX1, AY0, AY1 = -0.3689, 0.3531, -0.2284, 0.2282
SC = 25.6 / (AX1 - AX0); OX = -12.8 - AX0 * SC; OY = -7.3 - AY0 * SC
def ll(lon, lat):
    x, y = albers(lon, lat); return (x * SC + OX, y * SC + OY)
def inv(X, Y):                            # map metres -> lon, lat (numpy arrays ok)
    import numpy as np
    x = (np.asarray(X) - OX) / SC; y = (np.asarray(Y) - OY) / SC; ry = R0 - y; r = np.sqrt(x * x + ry * ry); t = np.arctan2(x, ry)
    lat = np.degrees(np.arcsin(np.clip((C - (r * N) ** 2) / (2 * N), -1, 1))); lon = np.degrees(LON0 + t / N); return lon, lat
def fold_z(x, y):
    """paper height (m): accordion creases (8 x 4 panels), corner curl, a slow waviness. Same numbers in the kit meta (anchors carry z)."""
    pw, ph = MAP_W / PANELS[0], MAP_H / PANELS[1]; u = (x + MAP_W / 2) / pw; v = (y + MAP_H / 2) / ph
    tri = lambda s: abs(((s % 2) + 2) % 2 - 1)            # 1 at even creases, 0 at odd
    z = .07 * tri(u) + .045 * tri(v + .5) + .012 * math.sin(x * .9 + 1.3) * math.sin(y * .7 - .4)
    cx = max(0, abs(x) - (MAP_W / 2 - 3.2)) / 3.2; cy = max(0, abs(y) - (MAP_H / 2 - 2.6)) / 2.6
    return z + .32 * (cx * cy) ** 1.6 + .03 * cx * cx
# cities (lon, lat). STATION = has a pop-up station model (kept if 1.05 m from every kept one, in this priority order)
CITIES = {
 'SEATTLE': (-122.33, 47.61), 'PORTLAND': (-122.68, 45.52), 'SPOKANE': (-117.43, 47.66), 'BOISE': (-116.2, 43.62), 'SAN FRANCISCO': (-122.42, 37.77),
 'SACRAMENTO': (-121.49, 38.58), 'LOS ANGELES': (-118.24, 34.05), 'SAN DIEGO': (-117.16, 32.72), 'LAS VEGAS': (-115.14, 36.17), 'RENO': (-119.81, 39.53),
 'PHOENIX': (-112.07, 33.45), 'TUCSON': (-110.97, 32.22), 'SALT LAKE CITY': (-111.89, 40.76), 'ALBUQUERQUE': (-106.65, 35.08), 'EL PASO': (-106.49, 31.76),
 'DENVER': (-104.99, 39.74), 'CHEYENNE': (-104.82, 41.14), 'BILLINGS': (-108.5, 45.78), 'BISMARCK': (-100.78, 46.81), 'FARGO': (-96.79, 46.88),
 'RAPID CITY': (-103.23, 44.08), 'OMAHA': (-95.93, 41.26), 'KANSAS CITY': (-94.58, 39.10), 'WICHITA': (-97.34, 37.69), 'OKLAHOMA CITY': (-97.52, 35.47),
 'TULSA': (-95.99, 36.15), 'AMARILLO': (-101.83, 35.22), 'DALLAS': (-96.80, 32.78), 'HOUSTON': (-95.37, 29.76), 'SAN ANTONIO': (-98.49, 29.42),
 'AUSTIN': (-97.74, 30.27), 'MIDLAND': (-102.08, 31.99), 'MINNEAPOLIS': (-93.27, 44.98), 'DES MOINES': (-93.61, 41.59), 'ST. LOUIS': (-90.20, 38.63),
 'SPRINGFIELD': (-93.29, 37.21), 'LITTLE ROCK': (-92.29, 34.75), 'TEXARKANA': (-94.05, 33.43), 'SHREVEPORT': (-93.75, 32.53), 'MEMPHIS': (-90.05, 35.15),
 'NEW ORLEANS': (-90.07, 29.95), 'JACKSON': (-90.18, 32.30), 'BIRMINGHAM': (-86.80, 33.52), 'MOBILE': (-88.04, 30.69), 'NASHVILLE': (-86.78, 36.16),
 'LOUISVILLE': (-85.76, 38.25), 'CHICAGO': (-87.63, 41.88), 'MILWAUKEE': (-87.91, 43.04), 'DETROIT': (-83.05, 42.33), 'INDIANAPOLIS': (-86.16, 39.77),
 'CINCINNATI': (-84.51, 39.10), 'COLUMBUS': (-83.0, 39.96), 'CLEVELAND': (-81.69, 41.50), 'PITTSBURGH': (-79.99, 40.44), 'BUFFALO': (-78.88, 42.89),
 'ATLANTA': (-84.39, 33.75), 'KNOXVILLE': (-83.92, 35.96), 'CHARLOTTE': (-80.84, 35.23), 'RALEIGH': (-78.64, 35.78), 'COLUMBIA': (-81.03, 34.0),
 'JACKSONVILLE': (-81.66, 30.33), 'TAMPA': (-82.46, 27.95), 'MIAMI': (-80.19, 25.76), 'RICHMOND': (-77.44, 37.54), 'WASHINGTON': (-77.04, 38.91),
 'BALTIMORE': (-76.61, 39.29), 'PHILADELPHIA': (-75.17, 39.95), 'NEW YORK': (-74.0, 40.71), 'ALBANY': (-73.76, 42.65), 'BOSTON': (-71.06, 42.36),
 'DULUTH': (-92.1, 46.79), 'FLAGSTAFF': (-111.65, 35.2), 'BARSTOW': (-117.02, 34.9), 'PINE HOLLOW': (-91.55, 36.3),
}
PRIORITY = ['PINE HOLLOW', 'DALLAS', 'NEW YORK', 'LOS ANGELES', 'CHICAGO', 'HOUSTON', 'BOSTON', 'WASHINGTON', 'ATLANTA', 'MIAMI', 'SEATTLE', 'SAN FRANCISCO',
 'DENVER', 'ST. LOUIS', 'KANSAS CITY', 'MINNEAPOLIS', 'DETROIT', 'NEW ORLEANS', 'PHOENIX', 'SALT LAKE CITY', 'MEMPHIS', 'NASHVILLE', 'OKLAHOMA CITY',
 'ALBUQUERQUE', 'EL PASO', 'SAN ANTONIO', 'OMAHA', 'CLEVELAND', 'PITTSBURGH', 'CINCINNATI', 'INDIANAPOLIS', 'PORTLAND', 'BOISE', 'BILLINGS', 'BISMARCK',
 'LAS VEGAS', 'SAN DIEGO', 'TAMPA', 'JACKSONVILLE', 'CHARLOTTE', 'BIRMINGHAM', 'AMARILLO', 'WICHITA', 'DES MOINES', 'SPOKANE', 'CHEYENNE', 'BUFFALO',
 'RALEIGH', 'JACKSON', 'LOUISVILLE', 'TUCSON', 'MILWAUKEE', 'SACRAMENTO', 'RENO', 'FARGO', 'RAPID CITY', 'TULSA', 'LITTLE ROCK', 'PHILADELPHIA']
HIGHWAYS = {   # interstates as city chains (printed navy double lines with cream shields)
 '5': ['SEATTLE', 'PORTLAND', 'SACRAMENTO', 'LOS ANGELES', 'SAN DIEGO'], '10': ['LOS ANGELES', 'PHOENIX', 'TUCSON', 'EL PASO', 'SAN ANTONIO', 'HOUSTON', 'NEW ORLEANS', 'MOBILE', 'JACKSONVILLE'],
 '20': ['MIDLAND', 'DALLAS', 'SHREVEPORT', 'JACKSON', 'BIRMINGHAM', 'ATLANTA', 'COLUMBIA'], '30': ['DALLAS', 'TEXARKANA', 'LITTLE ROCK'],
 '35': ['SAN ANTONIO', 'AUSTIN', 'DALLAS', 'OKLAHOMA CITY', 'WICHITA', 'KANSAS CITY', 'DES MOINES', 'MINNEAPOLIS', 'DULUTH'],
 '40': ['BARSTOW', 'FLAGSTAFF', 'ALBUQUERQUE', 'AMARILLO', 'OKLAHOMA CITY', 'LITTLE ROCK', 'MEMPHIS', 'NASHVILLE', 'KNOXVILLE', 'RALEIGH'],
 '44': ['OKLAHOMA CITY', 'TULSA', 'SPRINGFIELD', 'ST. LOUIS'], '55': ['CHICAGO', 'ST. LOUIS', 'MEMPHIS', 'JACKSON', 'NEW ORLEANS'],
 '70': ['DENVER', 'KANSAS CITY', 'ST. LOUIS', 'INDIANAPOLIS', 'COLUMBUS', 'PITTSBURGH', 'BALTIMORE'],
 '80': ['SAN FRANCISCO', 'SACRAMENTO', 'RENO', 'SALT LAKE CITY', 'CHEYENNE', 'OMAHA', 'DES MOINES', 'CHICAGO', 'CLEVELAND', 'NEW YORK'],
 '90': ['SEATTLE', 'SPOKANE', 'BILLINGS', 'RAPID CITY', 'MINNEAPOLIS', 'MILWAUKEE', 'CHICAGO', 'CLEVELAND', 'BUFFALO', 'ALBANY', 'BOSTON'],
 '94': ['BILLINGS', 'BISMARCK', 'FARGO', 'MINNEAPOLIS'], '95': ['BOSTON', 'NEW YORK', 'PHILADELPHIA', 'BALTIMORE', 'WASHINGTON', 'RICHMOND', 'RALEIGH', 'JACKSONVILLE', 'MIAMI'],
 '75': ['DETROIT', 'CINCINNATI', 'KNOXVILLE', 'ATLANTA', 'TAMPA'], '25': ['CHEYENNE', 'DENVER', 'ALBUQUERQUE', 'EL PASO'], '15': ['SALT LAKE CITY', 'LAS VEGAS', 'BARSTOW', 'LOS ANGELES'],
 '65': ['CHICAGO', 'INDIANAPOLIS', 'LOUISVILLE', 'NASHVILLE', 'BIRMINGHAM', 'MOBILE'], '45': ['DALLAS', 'HOUSTON'], '84': ['PORTLAND', 'BOISE', 'SALT LAKE CITY'],
}
HOME_ROUTE = ['PINE HOLLOW', 'LITTLE ROCK', 'TEXARKANA', 'DALLAS']     # the S5 glide: US 65 down to Little Rock, then I-30 to the DALLAS label
def wiggle(pts, n=10, amp=.0, seed=1):
    import random; rnd = random.Random(seed); out = []
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        dx, dy = x1 - x0, y1 - y0; L = math.hypot(dx, dy) or 1; nx, ny = -dy / L, dx / L; ph = rnd.random() * 6
        for i in range(n):
            t = i / n; w = amp * math.sin(t * math.pi) * math.sin(t * 9 + ph) * min(1, L / 3)
            out.append((x0 + dx * t + nx * w, y0 + dy * t + ny * w))
    out.append(pts[-1]); return out
def stations():
    kept = []
    for c in PRIORITY:
        x, y = ll(*CITIES[c])
        if all(math.hypot(x - a, y - b) >= 1.05 for _, a, b in kept): kept.append((c, x, y))
    return kept
STATION_OFF = .55  # the station model stands this far north of its city dot; the label sits south of the dot, the highways end at the dot
SKIP_FIPS = {'02', '15', '60', '66', '69', '72', '78'}
def load_states(path):
    """us-atlas states-10m.json (TopoJSON) -> {fips: (name, [rings of (lon, lat)])}, lower 48 + DC only."""
    d = json.load(open(path)); sx, sy = d['transform']['scale']; tx, ty = d['transform']['translate']; arcs = []
    for a in d['arcs']:
        x = y = 0; pts = []
        for dx, dy in a: x += dx; y += dy; pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)
    def ring(ids):
        out = []
        for i in ids:
            p = arcs[i] if i >= 0 else arcs[~i][::-1]; out += p if not out else p[1:]
        return out
    res = {}
    for g in d['objects']['states']['geometries']:
        if g['id'] in SKIP_FIPS: continue
        polys = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]
        res[g['id']] = (g['properties']['name'], [ring(r) for p in polys for r in p])
    return res

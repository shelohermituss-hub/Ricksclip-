#!/usr/bin/env python3
"""toilet stretch (astro-flush-study): writes s1/film.json (shot 1, f0-34, rendered to f41: pull-back out through the porthole),
s6/film.json (shot 6, f500-530, rendered f495-537 for both dissolves) and s12/film.json (shot 12 f1007-1113 + the 12->13 move f1114-1141 +
shot 13 f1142-1199, rendered from f998). Film frame f = his reference frame f: each film starts at f0 (pre-roll parked, never rendered),
"start" = first rendered frame (shot 1 starts at f0 itself). Cameras = sets/toilet/out/toilet_meta.json cams (fitted to his frames), ONE travel per
take through pinned pass stations (MOTION RULES 1-3). Set movers by name: toilet.js keys (written per frame here) + stage/toilet_stage.js."""
import json, math, os
H = os.path.dirname(os.path.abspath(__file__)); EP = os.path.join(H, '..', '..')
META = json.load(open(os.path.join(EP, 'sets/toilet/out/toilet_meta.json'))); CAST = json.load(open(os.path.join(EP, 'cast/cast.json')))
PAR = json.load(open(os.path.join(EP, 'sets/toilet/params_toilet.json')))
C = dict(META['cams']); C['f1150'] = PAR['cams']['f1150']          # params f1150 is the set builder's newer cam (no rebuild needed for a cam)
A = META['anchors']; MV = META['movers']
lens = lambda vfov: round(18 / math.tan(math.radians(vfov) / 2), 2)
R4 = lambda v: [round(x, 4) for x in v]
def cam(c, **k): return {**dict(pos=R4(c['loc']), aim=R4(c['look']), lens=lens(c['vfov']), roll=c.get('roll', 0)), **k}
def st(pos, aim, vfov, roll=0, **k): return dict(pos=R4(pos), aim=R4(aim), lens=lens(vfov), roll=roll, **k)
def unit(v): l = math.sqrt(sum(x * x for x in v)); return [x / l for x in v]
add = lambda a, b, s=1: [a[i] + b[i] * s for i in range(3)]
lerp = lambda a, b, u: [a[i] + (b[i] - a[i]) * u for i in range(3)]
LOOK = lambda p, c: [c[0], c[1], 1.3]                                  # cards face the lens side
ss = lambda u: (lambda v: v * v * (3 - 2 * v))(max(0., min(1., u)))

from scipy.interpolate import PchipInterpolator
def dense(stations, step=2):
    """round 2 (jerk): the kit's pin spline put speed spikes at uneven pins (233 mm/f at f1134 between 73 and 200). The key stations here are
    joined by a monotone cubic (PCHIP, per coordinate, no overshoot) in FRAME time, then laid down as pinned pass stations every `step` frames:
    the kit only joins near-straight short pieces, so the speed follows our curve (continuous, no spikes)."""
    S = sorted(stations, key=lambda d: d['at']); fr = [d['at'] for d in S]
    vf_ = lambda d: 2 * math.degrees(math.atan(18 / d['lens']))
    P = PchipInterpolator(fr, [d['pos'] for d in S]); Aim = PchipInterpolator(fr, [d['aim'] for d in S])
    Ro = PchipInterpolator(fr, [d.get('roll', 0) for d in S]); Vf = PchipInterpolator(fr, [vf_(d) for d in S])
    out = []; f0, f1 = fr[0], fr[-1]; frames = list(range(f0, f1, step)) + [f1]
    for i, f in enumerate(frames):
        d = dict(pos=R4(P(f)), aim=R4(Aim(f)), lens=lens(float(Vf(f))), roll=round(float(Ro(f)), 3), at=f, hold=0)
        src = next((x for x in S if x['at'] == f), None)
        d.update(subject=(src or {}).get('subject'), framing=(src or {}).get('framing', 'W'), purpose=(src or {}).get('purpose', 'curve point'))
        if i == 0: d.update(creep=0)
        elif i == len(frames) - 1: d.update(travel=(f1 - f0) / 30, hold=S[-1].get('hold', .2), creep=0)
        else: d['pin'] = True
        out.append(d)
    return out
CARD = json.load(open(os.path.join(H, 'card_scale.json'))) if os.path.exists(os.path.join(H, 'card_scale.json')) else {}

def base(title, start, end, cast, light, toilet, stage, over):
    return {"title": title, "fps": 30, "size": [1080, 1920], "words": "caps_his.json", "start": start, "end": end,
        "camera": {"v2": True}, "camsafe": True, "kit3d": {"pbr": True, "relief": True, "sky": False, "trees": False},
        "tween": {"frames": 0, "face_frames": 0, "ones": True}, "move_face": True,
        "puppet_pkg": ["moves", "cast", "../../../../../templates/vector2d_characters/code"],
        "cast": {k: CAST['cast'][k] for k in cast},
        "face_shadow": True, "costume_shade": CAST['costume_shade'], "card_shade": CAST['card_shade'], "caption_rick_scale": 1.0,
        "post": {"dof": 0.0, "dust": 0.0, "bloom": 1, "vignette": 0},
        "places": {"toilet": {"set": "toilet_stage", "kind": "interior", "light": light, "light_over": over, "toilet": toilet, "stage": stage}}}
def keys_per_frame(f0, f1, fn):
    """toilet.js eases only between keys that BOTH carry a value: write every value on every frame (exact, no holes)"""
    return [dict(f=f, **{k: (round(v, 4) if isinstance(v, float) else v) for k, v in fn(f).items()}) for f in range(f0, f1 + 1)]

# ---------------- shot 1 (day). f0-29 slow push in (z1.06 then 1.02 per 0.5 s, cam f5 fitted); f29 the pull-back starts and accelerates
# (scale per frame 0.94 .88 .82 .76 .72 at f31-35) out through the porthole wall: f33 cam (near plane past the wall), f37 cam from outside (fitted),
# on to f41 still pulling back and sliding (content moves right).
c5, c33, c37 = C['f5'], C['f33'], C['f37']; NG1 = [A['newguy_s1'][0], A['newguy_s1'][1] - .17, 0]
def d_at(f):   # subject distance (m) for the board's per-frame scale, anchored on cam f5 (2.9 m)
    d = 2.9
    if f <= 5: return d * 1.0039 ** (5 - f)
    return d / (1.0039 ** min(f - 5, 10)) / (1.0013 ** max(0, f - 15))
X = lambda f: NG1[0] - d_at(f)
S1 = [st([X(0), 2.9, .95], c5['look'], 55, at=0, hold=0, creep=0, subject="newguy", framing="M", purpose="f0 frame 0 = the hook: new guy smug beside the toilet; slow push in starts"),
      st([X(15), 2.9, .95], c5['look'], 55, at=15, hold=0, pin=True, subject="newguy", framing="M", purpose="pinned pass: push in eases to z1.02"),
      st([X(29), 2.9, .96], c5['look'], 55, at=29, hold=0, pin=True, subject="newguy", framing="M", purpose="pinned pass: pull-back starts f29"),
      st([-1.88, 2.9, .99], [2.0, 2.86, .89], 55, at=31, hold=0, pin=True, subject="newguy", framing="W", purpose="pinned pass: camera crosses the porthole wall (near plane keeps the room)"),
      st(c33["loc"], c33["look"], 55, at=33, hold=0, pin=True, subject="newguy", framing="W", purpose="pinned pass: cam f33 fitted (room small, side walls enter)"),
      st(c37["loc"], c37["look"], 58, at=37, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: cam f37 fitted, outside: the room through the porthole"),
      st([-10.2, 3.55, 1.3], [2.0, 3.2, 1.25], 60, at=41, travel=41 / 30, hold=0.2, creep=0, subject=None, framing="W", purpose="f41 still pulling back on the porthole axis, sliding (content moves right); the lead joins the ship shot here")]
def tk1(f):
    return {"light": "day", "glow": 0.0, "exploded": 0.0, "door": 0.0, "hatch": 0.0, "pulse": 0.0, "paper": 0 if f < 20 else 1}
bowl = A['toilet_bowl_centre']
F1 = base("astro-flush toilet, shot 1 (f0-34, pull-back to f41)", 0, 42, ("newguy",), "day",
          {"light": "day", "glow": 0, "door": 0, "paper": 0, "keys": keys_per_frame(0, 42, tk1)},
          {"near": {"to": 34, "x": -1.88}, "lever": [[6, 0], [12, -28], [17, -28], [25, 0]],
           "roll": {"v": [.01, -.03, .012], "spin": [0, 0, 25], "pull": [11, 20], "to": [bowl[0], bowl[1], bowl[2] + .22]},
           "ribbon": {"f": [20, 28], "pivot": [bowl[0], bowl[1], bowl[2] - .05], "hide": 29}},
          {"tint": "#ffffff"})
F1["takes"] = [{"id": "s1", "place": "toilet", "stations": dense(S1)}]
s1 = CARD.get('s1', 1.0)
F1["card_scale"] = {"newguy": [[0, s1, s1], [2000, s1, s1]]}
F1["acts"] = [dict(who="newguy", at=0, pos=[NG1[0], NG1[1], 0], pose="m:../../ep_toilet/ng1", look=LOOK(NG1, c5['loc']), note="smug, flushes f8-10, laughs")]

# ---------------- shot 6 (night close). Pre-roll travel leaves f485 so f495 (dissolve in) already moves; z1.06 per 0.5 s to f515 (cam fitted), z1.02 after.
c515 = C['f515']; NG6 = A['newguy_s6']; dv = unit([c515['look'][i] - c515['loc'][i] for i in range(3)])
def d6(f): return 1.79 * (1.0039 ** (515 - f) if f <= 515 else 1 / 1.0028 ** (f - 515))   # round 2: the push keeps its pace into the dissolve (his picture keeps changing f522-530)
P6 = lambda f: add(c515['loc'], dv, 1.79 - d6(f)); A6 = lambda f: add(c515['look'], dv, 1.79 - d6(f))
S6 = [st(P6(485), A6(485), 62, at=480, hold=0, creep=0, subject="newguy", framing="C", purpose="pre-roll (never rendered); the travel leaves f485"),
      st(P6(500), A6(500), 62, at=500, hold=0, pin=True, subject="newguy", framing="C", purpose="f500 clean: new guy big at the left, glowing toilet lower right"),
      cam(c515, at=515, hold=0, pin=True, subject="newguy", framing="C", purpose="pinned pass: cam f515 fitted"),
      st(P6(537), A6(537), 62, at=537, travel=(537 - 480) / 30, hold=0.3, creep=0, subject="newguy", framing="C", purpose="slow push on through the dissolve out f531-537")]
def tk6(f):
    g = .55 if f < 505 else (.55 + .85 * ss((f - 505) / 4) if f < 509 else 1.4 - .4 * ss((f - 509) / 10))   # flash over 4 frames (a 2-frame flash = a pop)
    return {"light": "night", "glow": round(g, 4), "exploded": 0.0, "door": 0.0, "hatch": 0.0, "pulse": 0.0, "paper": 0}
F6 = base("astro-flush toilet, shot 6 (f500-530, rendered f495-537)", 495, 538, ("newguy",), "night",
          {"light": "night", "glow": .55, "door": 0, "keys": keys_per_frame(480, 538, tk6)}, {"lever": [[504, 0], [510, -28], [515, -28], [523, 0]]}, {"tint": "#d8dcff"})
F6["takes"] = [{"id": "s6", "place": "toilet", "stations": dense(S6, 3)}]
s6 = CARD.get('s6', 1.0)
F6["card_scale"] = {"newguy": [[0, s6, s6], [2000, s6, s6]]}
F6["acts"] = [dict(who="newguy", at=0, pos=[NG6[0], NG6[1], 0], pose="m:../../ep_toilet/ng6", look=LOOK(NG6, c515['loc']), note="wince, flush snap 507-508, relief, sweat")]

# ---------------- shot 12 + 12->13 + 13 (wide dark room -> hatch -> under the floor -> WASTE VENT flange; cut in the dark nozzle f1176 -> tube).
c1030, c1105, c1125, c1150, c1190 = C['f1030'], C['f1105'], C['f1125'], C['f1150'], C['f1190']; NG12 = A['newguy_s12']; CM12 = A['commander_s12']
d12 = unit([c1030['look'][i] - c1030['loc'][i] for i in range(3)])
# push in 3, 4, 6, 9, 12 % per 0.5 s (rows f1005-1080): picture scale relative to f1030 -> dolly along the view (the back wall at y -1.7 stops the dolly before f1030: lens there)
def S12(f):
    rows = [(1005, 1.03), (1020, 1.04), (1035, 1.06), (1050, 1.09), (1065, 1.12)]
    def cum(f):
        s = 1.0
        for a, z in rows:
            s *= z ** (max(0, min(f, a + 15) - a) / 15)
        return s
    return cum(f) / cum(1030)
D0 = 4.65
P12 = lambda f, dx=0: add(add(c1030['loc'], d12, D0 - D0 / S12(f)), [dx, 0, 0]); A12 = lambda f, dx=0: add(add(c1030['look'], d12, D0 - D0 / S12(f)), [dx, 0, 0])
vf = lambda s: round(2 * math.degrees(math.atan(math.tan(math.radians(40)) / s)), 2)
flange = A['flange']
S12s = [st([-.05, -1.68, .36], c1030['look'], 82, at=960, hold=0, creep=0, subject="newguy", framing="W", purpose="pre-roll (never rendered); travel leaves f970"),
        cam(c1030, at=1030, hold=0, pin=True, subject="newguy", framing="W", purpose="pinned pass: cam f1030 fitted"),
        st(P12(1050, .08), A12(1050, .2), 80, at=1050, hold=0, pin=True, subject="newguy", framing="W", purpose="pinned pass: push faster, slight pan right"),
        st(P12(1065, .2), A12(1065, .55), 80, at=1065, hold=0, pin=True, subject="newguy", framing="W", purpose="pinned pass: push faster; the commander slides out left by f1074"),
        st(P12(1077, .3), A12(1077, .8), 80, roll=-.4, at=1077, hold=0, pin=True, subject="newguy", framing="M", purpose="peak of the push; reverses into the pull back without a stop"),
        cam(c1105, roll=-1.2, at=1105, hold=0, pin=True, subject="newguy", framing="W", purpose="pinned pass: cam f1105 fitted: room above for the exploded toilet"),
        st([-.4, -.8, .5], [.4, 3.9, 1.75], 80, roll=-.4, at=1114, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: f1114 the fast pan left starts"),
        st([-.3, -.2, .38], c1125['look'], 80, roll=3, at=1125, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: cam f1125 aim (pos pulled onto the dive line: one direction of travel): hose on the floor leads left"),
        st([-.6, .35, .32], [-1.95, 1.55, .12], 80, roll=6, at=1131, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: low on the hose, WASTE LINE hatch ahead (opens f1131-1138)"),
        st([-1.15, .95, .27], [-2.15, 1.55, -.2], 79, roll=10, at=1135, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: the dive at the open hatch"),
        st([-1.55, 1.3, .05], [-1.95, 1.4, -1.0], 77, roll=14, at=1138, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: pitching down through the hatch (near plane past the floor slab)"),
        st([-1.6, 1.38, -.4], [-.9, 1.42, -1.25], 75, roll=18, at=1141, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: under the floor, pitching up to fly along the hose"),
        st([-1.25, 1.34, -.6], [.4, 1.42, -1.05], 74, roll=22, at=1144, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: along the hose"),
        cam(c1150, at=1152, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: cam f1150 (set params) at f1155 so the flight keeps one speed: flange in the middle, WASTE VENT top right"),
        st(lerp(c1150['loc'], flange, .55), [flange[0] + .4, flange[1], flange[2] - .02], 72, roll=17, at=1166, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: constant-speed flight to the flange, then it accelerates"),
        st([flange[0] - .1, flange[1], flange[2] + .01], [flange[0] + .6, flange[1], flange[2]], 72, roll=8, at=1175, travel=(1175 - 960) / 30, hold=0, creep=0, subject=None, framing="C", purpose="into the flange: it fills the frame (his nozzle 100 % at f1176)")]
T0 = META['anchors']['tube_core']
S13 = [st([0, -33.6, 0], T0, 80, at=1176, hold=0, min_hold=0, creep=0, subject=None, framing="W", purpose="f1176 inside the tube (cut in the dark of the nozzle), already flying"),
       cam(c1190, roll=-8, at=1190, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: cam f1190 fitted: rings, core at the centre"),
       st([0, -27.6, 0], T0, 80, roll=-12, at=1199, travel=23 / 30, hold=0.2, creep=0, subject=None, framing="W", purpose="on toward the core, spinning")]
def tk12(f):
    pk = [(1100, 0.), (1131, .42), (1150, .86), (1168, 1.)]
    if f <= pk[0][0]: pu = 0.
    elif f >= pk[-1][0]: pu = 1.
    else:
        for (a, va), (b, vb) in zip(pk, pk[1:]):
            if a <= f <= b: pu = va + (vb - va) * (f - a) / (b - a)
    return {"light": "wide", "glow": round(ss((f - 1086) / 5), 4), "exploded": 0.0, "door": 1.0, "hatch": round(ss((f - 1129) / 8), 4), "pulse": round(pu, 4), "paper": 0}
order = ['toilet_base', 'toilet_flange', 'toilet_gasket', 'toilet_bolt_1', 'toilet_bolt_2', 'toilet_bolt_3', 'toilet_bolt_4', 'explode_ring_1', 'toilet_bowl', 'explode_ring_2', 'toilet_seat',
         'toilet_hinge_peg_l', 'toilet_hinge_peg_r', 'explode_ring_3', 'toilet_lid', 'toilet_tank', 'toilet_flush_lever', 'explode_ring_4', 'toilet_tank_lid', 'toilet_flush_button']
F12 = base("astro-flush toilet, shot 12 + 12->13 + 13 (f1007-1199, rendered from f998)", 998, 1200, ("commander", "newguy"), "night",
           {"light": "wide", "glow": 0, "door": 1, "keys": keys_per_frame(990, 1200, tk12)},
           {"floor": {"from": 1134, "to": 1142, "z": -0.25}, "pulse_light": [[1150, 1], [1162, .12], [1200, .12]], "explode": {"f": 1095, "n": 10, "delay": .3, "order": order, "float": .015}}, {"tint": "#e6e8ff"})
F12["post"]["bloom"] = .35   # the white key light near the toilet blooms into a blob at 1 (set STATE: too much bloom)
F12["takes"] = [{"id": "s12", "place": "toilet", "stations": dense(S12s)}, {"id": "s13", "place": "toilet", "stations": dense(S13)}]
s12 = CARD.get('s12', 1.0); s12c = CARD.get('s12c', s12)
F12["card_scale"] = {"newguy": [[0, s12, s12], [2000, s12, s12]], "commander": [[0, s12c, s12c], [2000, s12c, s12c]]}
NGC = [NG12[0] + CARD.get('slide', .3), NG12[1] - .05, 0]
F12["acts"] = [dict(who="commander", at=0, pos=[CM12[0], CM12[1] - .1, 0], pose="m:../../ep_toilet/cmd12", look=LOOK(CM12, c1030['loc']), note="doorway, arms crossed, glare"),
               dict(who="commander", at=1100, visible=False, note="out of frame since f1074 (camera move); hidden"),
               dict(who="newguy", at=0, pos=[NG12[0], NG12[1], 0], pose="m:../../ep_toilet/ng12", look=LOOK(NG12, c1030['loc']), note="scared, innocent smile, explains"),
               dict(who="newguy", at=1072, pos=NGC, move_s=0.7, ease="inout", look=LOOK(NGC, c1105['loc']), note="slides to centre f1072-1093, eased"),
               dict(who="newguy", at=CARD.get('ng_hide', 1121), visible=False, note="left the frame right with the pan (his f1120); no characters after")]

CAPS = [("If you", 0.0), ("flush", .36), ("the", .58), ("toilet", .78), ("on a", 1.08), ("spaceship,", 1.42),
        ("and", 16.48), ("flushes.", 16.76), ("The", 17.48), ("next", 17.58), ("morning,", 17.76),
        ("how do you", 33.04), ("get", 33.6), ("lost", 33.72), ("from", 34.06), ("one", 34.34), ("flush?", 34.66), ("Well,", 35.38), ("a", 35.84), ("spaceship", 35.9),
        ("toilet", 36.24), ("doesn't", 36.64), ("have", 37.08), ("pipes.", 37.22), ("It's", 37.84), ("just a", 38.02), ("hose", 38.34), ("that", 38.62), ("sprays", 38.88),
        ("straight", 39.24), ("out", 39.62), ("into...", 39.86)]
ENDS = {1.42: 1.8, 17.76: 18.12, 39.86: 40.0, 16.48: 16.76 - .068}
caps = []
for i, (w, s) in enumerate(CAPS):
    nxt = CAPS[i + 1][1] if i + 1 < len(CAPS) else 40.1
    e = nxt - .068 - .001 if nxt - s < 1.0 else s + 1.0
    caps.append(dict(w=w, s=round(max(0, s - .067), 3), e=round(e, 3)))
for name, Fm in (("s1", F1), ("s6", F6), ("s12", F12)):
    d = os.path.join(H, name); os.makedirs(os.path.join(d, 'sets'), exist_ok=True)
    for ln, tgt in (("cast", "../../../cast"), ("moves", "../moves"), ("refs", "../../../refs"), ("sets/toilet_stage.js", "../../stage/toilet_stage.js"),
                    ("sets/toilet.js", "../../../../sets/toilet.js"), ("sets/toilet", "../../../../sets/toilet"), ("sets/vendor", "../../../../sets/vendor")):
        p = os.path.join(d, ln)
        if not os.path.lexists(p): os.symlink(tgt, p)
    json.dump(Fm, open(os.path.join(d, 'film.json'), 'w'), indent=1); json.dump(caps, open(os.path.join(d, 'caps_his.json'), 'w'), indent=0)
    print('wrote', name, Fm['start'], Fm['end'])

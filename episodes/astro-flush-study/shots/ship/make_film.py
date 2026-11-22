#!/usr/bin/env python3
"""ship stretch (astro-flush-study), ROUND 2 (2026-11-22): on the set's round 8 meta (cams f990 on the +Y side, f680, fan sign, anchor newguy_s11,
light kinds per shot from META.proofs, flame keys from preglow so ignition has no scale pop, glitter per-sparkle fade).
ship stretch (astro-flush-study): writes s2, s7, s8, s9, s11 film.json. Film frame f = his reference frame f: each film starts at f0 (camera parked on
a pre-roll station, never rendered), "start" = first rendered frame. Cameras = sets/ship/out/ship_meta.json cams (fitted to his frames, f680 by eye) as
pinned pass stations of ONE travel per shot (MOTION RULES 1-3); the other stations are by eye on the board rows (marked "by eye").
Set movers by name: ship.js keys written for EVERY frame + stage/ship_stage.js (Earth on its camera ray, sky follows, lamp pulse, floating props)."""
import json, math, os
H = os.path.dirname(os.path.abspath(__file__)); EP = os.path.join(H, '..', '..')
META = json.load(open(os.path.join(EP, 'sets/ship/out/ship_meta.json'))); CAST = json.load(open(os.path.join(EP, 'cast/cast.json')))
WORDS = json.load(open(os.path.join(EP, 'refs/words_ref.json')))
C = META['cams']; A = META['anchors']; PR = META['proofs']
CARD = json.load(open(os.path.join(H, 'card_scale.json'))) if os.path.exists(os.path.join(H, 'card_scale.json')) else {}
lens = lambda vfov: round(18 / math.tan(math.radians(vfov) / 2), 2)
R4 = lambda v: [round(x, 4) for x in v]
KR = lambda c: KSIGN * c.get('roll', 0)   # round 2: fitted rolls: kit roll = + META roll, checked in picture on f70 (the - sign tilted the ship and horizon 18 deg CW of his)
KSIGN = 1
def cam(c, **k): return {**dict(pos=R4(c['loc']), aim=R4(c['look']), lens=lens(c['vfov']), roll=round(KR(c), 3)), **k}
def st(pos, aim, vfov, roll=0, **k): return dict(pos=R4(pos), aim=R4(aim), lens=lens(vfov), roll=round(roll, 3), **k)
add = lambda a, b, s=1: [a[i] + b[i] * s for i in range(3)]
sub = lambda a, b: [a[i] - b[i] for i in range(3)]
lerp = lambda a, b, u: [a[i] + (b[i] - a[i]) * u for i in range(3)]
def unit(v): l = math.sqrt(sum(x * x for x in v)); return [x / l for x in v]
def cross(a, b): return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
ss = lambda u: (lambda v: v * v * (3 - 2 * v))(max(0., min(1., u)))
def rot(v, ax, a):   # Rodrigues
    c, s = math.cos(a), math.sin(a); d = sum(v[i] * ax[i] for i in range(3)); x = cross(ax, v)
    return [v[i] * c + x[i] * s + ax[i] * d * (1 - c) for i in range(3)]
def earth_world(c, es):
    """still_ship.py earth_screen [sx, sy, dist, ang] -> Earth centre + radius (Blender metres) for that camera"""
    sx, sy, dist, ang = es; fw = unit(sub(c['look'], c['loc'])); rt = unit(cross(fw, [0, 0, 1])); up = cross(rt, fw)
    r = math.radians(c.get('roll', 0)); rt, up = [rt[i]*math.cos(r)+up[i]*math.sin(r) for i in range(3)], [up[i]*math.cos(r)-rt[i]*math.sin(r) for i in range(3)]
    vh = math.radians(c['vfov']) / 2; hh = math.atan(math.tan(vh) * 540 / 960)
    d = unit(rot(rot(fw, up, -sx * hh), rt, sy * vh)); p = add(c['loc'], d, dist); return [round(x, 2) for x in p] + [round(dist * math.sin(math.radians(ang)), 2)]

def keys_per_frame(f0, f1, fn):
    return [dict(f=f, **{k: (round(v, 4) if isinstance(v, float) else ([round(x, 4) for x in v] if isinstance(v, list) else v)) for k, v in fn(f).items()}) for f in range(f0, f1 + 1)]
def caps(f0, f1, joins=()):
    """his words in range, 1-3 a caption (joins = words glued to the next), hard swap 2 f before the word"""
    W = [w for w in WORDS if f0 / 30 - .5 <= w['s'] <= f1 / 30 + .3]; out = []; i = 0
    while i < len(W):
        g = [W[i]]
        while g[-1]['w'].lower().strip(',.') in joins and i + 1 < len(W): i += 1; g.append(W[i])
        out.append(dict(w=' '.join(x['w'] for x in g), s=round(max(0, g[0]['s'] - 2 / 30), 3))); i += 1
    for k in range(len(out)): out[k]['e'] = round(out[k + 1]['s'] - .01, 3) if k + 1 < len(out) else round(W[-1]['e'] + .3, 3)
    return out
J = ('the', 'a', 'to', 'of', 'on', 'it', 'there', "they're", 'how', 'every', 'any')

def base(title, start, end, cast, ship_keys, stage, held=None):
    pl = {"set": "ship_stage", "light": "night", "light_over": {"tint": "#ffffff", "card_gain": 1.0, "card_fog": False}, "post": {"dof": 0.0, "dust": 0.0, "bloom": 0.5, "vignette": 0},
          "ship": {"fog": False, "keys": ship_keys}, "stage": stage}
    if held: pl["held"] = held
    return {"title": title, "fps": 30, "size": [1080, 1920], "words": "caps_his.json", "start": start, "end": end,
        "camera": {"v2": True}, "camsafe": True, "kit3d": {"pbr": True, "relief": True, "sky": False, "trees": False},
        "tween": {"frames": 0, "face_frames": 0, "ones": True},
        "puppet_pkg": ["moves", "cast", "../../../../../templates/vector2d_characters/code"],
        "cast": {k: CAST['cast'][k] for k in cast},
        "face_shadow": True, "costume_shade": CAST['costume_shade'], "card_shade": CAST['card_shade'], "caption_rick_scale": 1.0,
        "post": {"dof": 0.0, "dust": 0.0, "bloom": 0.5, "vignette": 0},
        "places": {"ship": pl}}
ER0 = [101.2, 267.1, 314.1]

# ================= shot 2 (f36-119, render f29-140). Out of porthole_a (accelerating pull-back, his scale/frame .94 .88 .82 .76 .72 at f31-35),
# whole ship over Earth, rest f60-74 (here a slow drift), f75 the ship turns away, camera follows and rolls, flame f96-100, f119 full-frame space + flame.
pa = A['porthole_a']
def pa_cam(d, dx=0, dz=0): return [pa[0] + dx, pa[1] + d, pa[2] + dz]
c40, c70, c110 = cam(C['f40']), cam(C['f70']), cam(C['f110'])
d70 = sub(C['f70']['look'], C['f70']['loc']); R70 = KR(C['f70'])
S2 = [st(pa_cam(.75), [pa[0], pa[1] - 10, pa[2]], 45, at=0, hold=0, creep=0, subject=None, framing="C", purpose="pre-roll (never rendered); the travel leaves f17"),
      st(pa_cam(1.15, .05), [pa[0] + .05, pa[1] - 10, pa[2] - .1], 45, at=29, hold=0, pin=True, subject=None, framing="C", purpose="by eye: f29 porthole_a fills the frame (lead feeds the room); pull-back already moving"),
      st(pa_cam(4.6, .6, -.25), [pa[0] + .1, pa[1] - 10, pa[2] - 1.6], 45, at=36, hold=0, pin=True, subject=None, framing="M", purpose="by eye: f36 porthole 25 % of H, Earth below, sliding (content moves right)"),
      dict(c40, at=40, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: cam f40 fitted (LODESTAR on the hull)"),
      st(add(C['f70']['loc'], d70, 5.2), add(C['f70']['look'], d70, 5.2), 45, R70 - 1.6, at=58, hold=0, pin=True, subject=None, framing="W", purpose="by eye: f58 ship 30 % of W, closing on the f70 framing"),
      dict(c70, at=70, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: cam f70 fitted (his rest f60-74: here a slow drift, rule 3)"),
      st(lerp(C['f70']['loc'], C['f110']['loc'], .3), lerp(C['f70']['look'], [0, 0, 0], .55), 43, R70 - 2.7, at=88, hold=0, pin=True, subject=None, framing="W", purpose="by eye: f88 following the turning ship, rolling (r -1.4, -3.6 per 0.5 s)"),
      dict(c110, roll=round(R70 - 7.2, 3), at=110, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: cam f110 (set's), ship tiny, flame 25 % of W; roll carried on"),
      st(add(C['f110']['loc'], [-14, 40, 10]), [-4, -2, -14], 40, R70 - 9.2, at=140, travel=round((140 - 17) / 30, 4), hold=0.2, creep=0, subject=None, framing="W",
         purpose="by eye: f119 full-frame space + flame (ship upper centre); still moving at f140 for the lead's join")]
E2 = [[40] + earth_world(C['f40'], PR['f40']['earth_screen']), [70] + earth_world(C['f70'], PR['f70']['earth_screen']), [110] + earth_world(C['f110'], PR['f110']['earth_screen'])]
E2 = [[0] + E2[0][1:]] + E2 + [[200] + E2[-1][1:]]
SPACE_SUN = META['light_kinds']['space']['sun'][0]; WARM_SUN = META['light_kinds']['warm']['sun'][0]
FW2 = 1.0   # round 2: flame_w for his f110 plume (set default 1.5 = the short fat blob)
POSE_AWAY = META['ship_poses']['shot2_f110_away']
def sk2(f):
    u = ss((f - 75) / 38); ux = max(0, (f - 113) / 27) * .25
    ship = [0, 0, 0, 0, POSE_AWAY[4] * (u + ux), POSE_AWAY[5] * (u + ux)]
    # round 2: preglow f84-94 (META.frames), flame eased in from f94 over 8 f (ship.js flame_scale: length max(.06 pg, f^.8), no scale-0 pop), full f101-118
    fl = ss((f - 94) / 8) * (.55 + .45 * ss((f - 101) / 17)); fl *= 1 + .05 * math.sin(f * 1.9) + .03 * math.sin(f * 3.7) if fl > 0 else 1
    g = ss((f - 40) / 30)
    return dict(light='space', shot=2, sun_dir=lerp(PR['f40']['sun_dir'], SPACE_SUN, ss((f - 40) / 40)), flame_w=max(.001, FW2 * ss((f - 82) / 8)), flame=round(fl, 4), preglow=ss((f - 84) / 10), glitter=0.0, glitter_ck=0.0, comm=0, digits=0, starmap=0.0, ship=ship, fans=0, fan=0.0,
                earth_rot=[ER0[0], ER0[1], ER0[2] + .06 * (f - 29)], earth_glare=lerp([.3, -.78, .08, 2.2][:3], [.6, -.72, .08], g) + [2.2])
F2 = base("astro-flush ship, shot 2 (f36-119, rendered f29-140)", 29, 141, (), keys_per_frame(0, 141, sk2), {"earth": E2, "sky_follow": True})
F2["takes"] = [{"id": "s2", "place": "ship", "stations": S2}]; F2["acts"] = []

# ================= shot 7 (f538-705, render f531-712): crane down over the cockpit roof, push in on the navigator, pull out and around the nose with roll.
L7 = 'space'   # round 2 test
C680_UP = [0, .5, 1.4]   # round 2 by eye: lift the f680 cam above the canopy roof line (his: outside, glass faces and the roof's top seen)
c600 = C['f600']; c680 = C['f680']; dv = unit(sub(c600['look'], c600['loc']))
NAV = A['navigator_s7']
p555 = add(c600['loc'], dv, -.55)
S7 = [st(add(p555, [.2, 0, 1.9]), [22.5, 0, 1.8], 45, .8, at=0, hold=0, creep=0, subject="navigator", framing="M", purpose="pre-roll (never rendered); travel leaves f519"),
      st(add(p555, [.15, 0, 1.25]), [22.0, -.02, .9], 45, .6, at=540, hold=0, pin=True, subject="navigator", framing="M", purpose="by eye: f540 above the roof tilting down, navigator low"),
      st(p555, add(c600['look'], [0, 0, .05]), 45, .4, at=555, hold=0, pin=True, subject="navigator", framing="M", purpose="by eye: f555 her eye level, frontal; slow push in to f600"),
      dict(cam(c600), at=600, hold=0, pin=True, subject="navigator", framing="M", purpose="pinned pass: cam f600 fitted; pull back + roll start"),
      st(add(lerp(c600['loc'], c680['loc'], .45), C680_UP, .45), lerp(c600['look'], c680['look'], .6), 44, 5.0, at=630, hold=0, pin=True, subject="navigator", framing="W", purpose="by eye: f630 rising to her upper left, canopy frame enters"),
      dict(cam(dict(c680, loc=add(c680['loc'], C680_UP))), roll=-c680['roll'], at=680, hold=0, pin=True, subject="navigator", framing="W", purpose="pinned pass: META cams.f680 (round 8; its note: kit roll 12 = META -12)"),
      st(add(add(c680['loc'], C680_UP), sub(c680['loc'], c600['loc']), .03), c680['look'], 40, -c680['roll'] + 2.0, at=712, travel=round((712 - 519) / 30, 4), hold=0.2, creep=0, subject="navigator", framing="W",
         purpose="easing out, almost still, never fully")]
def sk7(f):   # round 2: light 'warm', wall wash off (META.proofs.f600 wash .001), sun to the f680 proof; glitter_ck .67 at f600 -> 1 at f680 (proofs)
    u = max(0., min(1., (f - 560) / 120)); w = ss((f - 600) / 80)
    return dict(light=L7, shot=7, radio_desk=0, wash=PR['f600']['wash'], sun_dir=lerp(WARM_SUN, PR['f680']['sun_dir'], w), sun_k=1 + (PR['f680']['sun_k'] - 1) * w,
                flame=0.0, preglow=0.0, glitter=0.0, glitter_ck=round(1 - (1 - u) ** 2.6, 4), comm=0, digits=0, starmap=0.0, ship=[0, 0, 0, 0, 0, 0], fans=1, fan=round(20 + .4 * f, 3),
                earth_rot=ER0, earth_glare=[.5, -.7, .3, 0])
F7 = base("astro-flush ship, shot 7 (f538-705, rendered f531-712)", 531, 713, ("navigator",), keys_per_frame(500, 713, sk7),
          {"earth": [[0, 0, -3000, -2600, 1500]], "sky_follow": True,
           "float": {"float_cup": {"f0": 600, "v": [.02, -.16, .03], "spin": [20, 40, 70], "bob": .01}, "float_book": {"f0": 0, "v": [-.015, .01, .008], "spin": [4, 6, 9]},
                     "float_pencil": {"f0": 0, "v": [.01, -.012, -.006], "spin": [0, 10, 25]}}})
F7["takes"] = [{"id": "s7", "place": "ship", "stations": S7}]
s7 = CARD.get('s7', 1.0); F7["card_scale"] = {"navigator": [[0, s7, s7], [2000, s7, s7]]}
NP = [NAV[0], NAV[1], NAV[2] + CARD.get('s7_dz', 0)]
F7["acts"] = [dict(who="navigator", at=0, pos=NP, pose="m:../../ep_ship/nav7", look=[30, 0, NP[2] + 1.2], note="floats in front of the seat, faces the lens (acting in the move)")]
F7["acts"] += [dict(who="navigator", at=f_, face=fc, note="face on his frame") for f_, fc in ((531, 'k:standard'), (564, 'k:smug'), (582, 'k:afEyeRoll'), (588, 'k:shocked'), (594, 'k:surprised'), (600, 'k:shocked'), (618, 'k:open'))]

# ================= shot 8 (f713-762, render f706-770): star map taped on the glass, slow push, then drift right + roll.
c740 = C['f740']; d8 = unit(sub(c740['look'], c740['loc']))
S8 = [st(add(c740['loc'], d8, -.26), c740['look'], 42, .3, at=0, hold=0, creep=0, subject=None, framing="C", purpose="pre-roll; travel leaves f696"),
      st(add(c740['loc'], d8, -.17), c740['look'], 42, .2, at=706, hold=0, pin=True, subject=None, framing="C", purpose="by eye: map centred a little above the middle; creep in"),
      dict(cam(c740), at=740, hold=0, pin=True, subject=None, framing="C", purpose="pinned pass: cam f740 (set's)"),
      st(add(c740['loc'], [.04, .07, 0]), add(c740['look'], [0, -.1, 0]), 42, -5.5, at=770, travel=round((770 - 696) / 30, 4), hold=0.2, creep=0, subject=None, framing="C",
         purpose="by eye: drift, picture slides right and rolls (r -5.5)")]
def sk8(f): return dict(light='map', shot=8, flame=0.0, preglow=0.0, glitter=0.0, glitter_ck=1.0, comm=0, digits=0, starmap=1.0, ship=[0, 0, 0, 0, 0, 0], fans=1, fan=0.0, earth_rot=ER0, earth_glare=[.5, -.7, .3, 0])
F8 = base("astro-flush ship, shot 8 (f713-762, rendered f706-770)", 706, 771, (), keys_per_frame(690, 771, sk8), {"earth": [[0, 0, -3000, -2600, 1500]], "sky_follow": True})
F8["takes"] = [{"id": "s8", "place": "ship", "stations": S8}]; F8["acts"] = []

# ================= shot 9 (f771-802, render f763-802): radio console close, COMM INCOMING f772, lamp pulses, digits change; slow steady push (0.33 %/f).
c790 = C['f790']; d9 = unit(sub(c790['look'], c790['loc']))
S9 = [st(add(c790['loc'], d9, -.12), c790['look'], 90, -1.2, at=0, hold=0, creep=0, subject=None, framing="C", purpose="pre-roll; travel leaves f752"),
      st(add(add(c790['loc'], d9, -.08), [.01, 0, .01]), c790['look'], 90, -1.35, at=763, hold=0, pin=True, subject=None, framing="C", purpose="by eye: radio lower left, sign top"),
      dict(cam(c790), at=790, hold=0, pin=True, subject=None, framing="C", purpose="pinned pass: cam f790 fitted"),
      st(add(add(c790['loc'], d9, .04), [-.005, 0, -.004]), c790['look'], 90, -1.65, at=802, travel=round((802 - 752) / 30, 4), hold=0.2, creep=0, subject=None, framing="C",
         purpose="steady push to the hard cut 802/803")]
def sk9(f): return dict(light='radio', shot=9, flame=0.0, preglow=0.0, glitter=0.0, glitter_ck=1.0, comm=1 if f >= 772 else 0, digits=0 if f < 772 else (1 if f < 783 else (2 if f < 794 else 3)),
                        starmap=1.0, ship=[0, 0, 0, 0, 0, 0], fans=1, fan=0.0, earth_rot=ER0, earth_glare=[.5, -.7, .3, 0])
F9 = base("astro-flush ship, shot 9 (f771-802, rendered f763-802)", 763, 803, (), keys_per_frame(745, 803, sk9), {"earth": [[0, 0, -3000, -2600, 1500]], "sky_follow": True, "lamp_pulse": [14, .35]})
F9["takes"] = [{"id": "s9", "place": "ship", "stations": S9}]; F9["acts"] = []

# ================= shot 11 (f867-997, render f867-1006): porthole_b + new guy, pull back along the hull past LODESTAR, whole ship with glitter, roll +22.
c880, c990 = C['f880'], C['f990']; d11 = unit(sub(c880['look'], c880['loc']))
ROLL990_WRAP = -360.0   # 0: the travel turns the picture one way to -189.15; 360: the other way to 170.85 (chosen in picture)
NG_CARD = 0.6
EROLL = -1
NG_DZ = 0.5   # round 2 by eye: at card .6 the anchor put his head at the porthole's lower edge
ST900 = ([8.0, 7.5, -1.0], [8.6, 2.4, 0.3], 45, -2.0)
ST930 = ([18.0, 22.0, -9.0], [10.0, 2.0, 0.0], 45, -15.0)
d990 = unit(sub(c990['look'], c990['loc'])); ST960 = (add(c990['loc'], d990, 4.0), add(c990['look'], d990, 4.0), 45, KR(c990) - 360 + 6.0)
# round 2: f990 = META cams.f990 (round 8, porthole +Y side, below, Blender roll 189.15 -> kit -189.15): the picture turns ~180 deg over f900-990 as in his
# frames (f911 roof up, hull level; f951 roof lower right, nose lower right). Stations f900-960 by eye on that path.
R880, R990 = KR(c880), KR(c990) + ROLL990_WRAP   # 189.15 - 360 = -170.85: the picture turns one way (content clockwise) as his
def path11(u): return lerp(c880['loc'], c990['loc'], u)
S11 = [st(add(c880['loc'], d11, .55), add(c880['look'], d11, .55), 20, R880, at=0, hold=0, creep=0, subject="newguy", framing="C", purpose="pre-roll; travel leaves f855 (near rest f867-875, slow creep)"),
       st(add(c880['loc'], d11, .45), add(c880['look'], d11, .45), 20, R880, at=867, hold=0, pin=True, subject="newguy", framing="C", purpose="by eye: porthole frontal 30 %, new guy head 18 %"),
       dict(cam(c880), at=880, hold=0, pin=True, subject=None, framing="C", purpose="pinned pass: cam f880 fitted; pull back starts f876"),
       st(*ST900, at=900, hold=0, pin=True, subject=None, framing="W", purpose="by eye: f900 track along the hull from below: windows row, LODESTAR above, stripe below"),
       st(*ST930, at=930, hold=0, pin=True, subject=None, framing="W", purpose="by eye: f930 hull descends to the right, tail + fans enter left"),
       st(*ST960, at=960, hold=0, pin=True, subject=None, framing="W", purpose="by eye: f960 whole ship on the diagonal, easing in to f990"),
       dict(cam(c990), roll=round(R990, 3), at=990, hold=0, pin=True, subject=None, framing="W", purpose="pinned pass: META cams.f990 (round 8)"),
       st(add(c990['loc'], sub(c990['loc'], c990['look']), .02), c990['look'], 45, R990 + .1, at=1006, travel=round((1006 - 855) / 30, 4), hold=0.2, creep=0, subject=None, framing="W",
          purpose="his rest f992-1001: here a creep (rule 3)")]
E11 = [[0] + earth_world(dict(c990, roll=EROLL * c990['roll']), PR['f990']['earth_screen'])]
P880, P990 = PR['f880'], PR['f990']
def sk11(f):   # round 2: space light, sun f880 proof -> f990 proof over f895-965; glitter trail fades in sparkle by sparkle f935-968 (META.frames glitter_trail 950-998); fan -44 at f990
    w = ss((f - 895) / 70)
    return dict(light='space', shot=11, sun_dir=lerp(P880['sun_dir'], P990['sun_dir'], w), sun_k=P880['sun_k'] + (1 - P880['sun_k']) * w, earth_term=P990['earth_term'],
                flame=0.0, preglow=0.0, glitter=round(ss((f - 935) / 33), 4), glitter_ck=1.0, flame_w=0.001, comm=0, digits=0, starmap=0.0, ship=[0, 0, 0, 0, 0, 0], fans=1,
                fan=round(P990['fan'] - .5 * (f - 990), 3), earth_rot=ER0, earth_glare=[.5, -.7, .3, 0])
F11 = base("astro-flush ship, shot 11 (f867-997, rendered f867-1006)", 867, 1007, ("newguy",), keys_per_frame(840, 1007, sk11), {"earth": E11, "sky_follow": True})
F11["takes"] = [{"id": "s11", "place": "ship", "stations": S11}]
s11 = CARD.get('s11', NG_CARD); F11["card_scale"] = {"newguy": [[0, s11, s11], [2000, s11, s11]]}
NG = add(A['newguy_s11'], [0, 0, NG_DZ])   # round 2: META anchor (round 8: head centred in porthole_b at 18 % of the frame)
F11["acts"] = [dict(who="newguy", at=0, pos=NG, pose="m:../../ep_ship/ng11", look=[NG[0], 9, NG[2] + 1.2], note="nervous smile, sweat drop, small worried bob"),
               dict(who="newguy", at=875, pos=[NG[0] + .9, NG[1] - .1, NG[2]], move_s=0.4, ease="inout", look=[NG[0] + .9, 9, NG[2] + 1.2], note="f876-884 slides sideways out of the window (his 8 f; 12 f eased)"),
               dict(who="newguy", at=890, visible=False, note="out of view"), dict(who="newguy", at=867, face="k:afSweat", note="nervous smile, sweat drop")]

for name, Fm, rng, j in (("s2", F2, (29, 140), J), ("s7", F7, (531, 712), J), ("s8", F8, (706, 770), J), ("s9", F9, (763, 802), J), ("s11", F11, (867, 1006), J)):
    d = os.path.join(H, name); os.makedirs(os.path.join(d, 'sets'), exist_ok=True)
    for ln, tgt in (("cast", "../../../cast"), ("moves", "../moves"), ("refs", "../../../refs")):
        if not os.path.lexists(os.path.join(d, ln)): os.symlink(tgt, os.path.join(d, ln))
    for ln, tgt in (("ship", "../../../../sets/ship"), ("ship.js", "../../../../sets/ship.js"), ("vendor", "../../../../sets/vendor"), ("ship_stage.js", "../../stage/ship_stage.js")):
        if not os.path.lexists(os.path.join(d, 'sets', ln)): os.symlink(tgt, os.path.join(d, 'sets', ln))
    json.dump(Fm, open(os.path.join(d, 'film.json'), 'w'), indent=1); json.dump(caps(*rng, joins=j), open(os.path.join(d, 'caps_his.json'), 'w'), indent=0)
    print('wrote', name)

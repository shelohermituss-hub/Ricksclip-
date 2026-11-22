#!/usr/bin/env python3
"""cabin stretch (astro-flush-study): writes cab4/film.json (shot 4, f284-410, rendered to f422 for the 4->5 dissolve) and
bay5/film.json (shot 5, f423-494, rendered f411-499 for both dissolves). Film frame f = his reference frame f: each film starts at f0
(pre-roll parked, never rendered) and "start" = first rendered frame. Cameras = sets/cabin/out/cabin_meta.json cams (fitted to his frames).
Characters: head size and head centre measured on his frames (HIS below, fractions of the frame) -> card scale per shot + plan position
per measured frame (proj.py unprojects the head centre at the depth that gives his head size with that scale)."""
import json, math, os
from proj import unproject, frame_h, depth_of
H = os.path.dirname(os.path.abspath(__file__)); EP = os.path.join(H, '..', '..')
META = json.load(open(os.path.join(EP, 'sets/cabin/out/cabin_meta.json'))); CAST = json.load(open(os.path.join(EP, 'cast/cast.json')))
C = META['cams']; A = META['anchors']
lens = lambda vfov: round(18 / math.tan(math.radians(vfov) / 2), 2)
def cam(c, **k): return dict(pos=[round(x, 4) for x in c['loc']], aim=[round(x, 4) for x in c['look']], lens=lens(c['vfov']), roll=c.get('roll', 0), **k)
lerp = lambda a, b, u: [a[i] + (b[i] - a[i]) * u for i in range(3)]
# his head (visible head incl. hair / cap) centre x, y and height, fractions of the frame (measured on ref/all at 540x960 with a 5 % grid)
HIS = {300: {'newguy': (.55, .74, .22), 'commander': (.03, .62, .22)},
       330: {'commander': (.21, .425, .15), 'newguy': (.52, .48, .125), 'navigator': (.82, .43, .13)},
       390: {'commander': (.15, .39, .16), 'newguy': (.49, .45, .15), 'navigator': (.84, .40, .155)},
       430: {'navigator': (.03, .445, .085), 'commander': (.48, .445, .125), 'newguy': (.86, .475, .095)},
       460: {'newguy': (.49, .386, .133), 'commander': (.04, .45, .13)},
       490: {'newguy': (.46, .437, .125)}}
HT = {w: CAST['cast'][w]['height'] for w in ('newguy', 'commander', 'navigator')}; HTALL = 2.93
VIS = {'newguy': 1.12, 'commander': 1.22, 'navigator': 1.18}        # visible head (hair / cap) / drawn ball: calibrated on our render (CAL)
CAL = json.load(open(os.path.join(H, 'cal.json'))) if os.path.exists(os.path.join(H, 'cal.json')) else {}
def ray_y(c, sx, sy, y):
    a = unproject(c, sx, sy, 1.0); o = c['loc']; t = (y - o[1]) / (a[1] - o[1]); return [o[i] + (a[i] - o[i]) * t for i in range(3)], t
def need(f, who, y):
    """his head at frame f on the plane y = const: (head centre, card scale that gives his head height)"""
    c = C['f%d' % f]; sx, sy, h = HIS[f][who]; k = CAL.get('%s@%d' % (who, f), [0, 0, 1])
    p, t = ray_y(c, sx - k[0], sy - k[1], y); dep = depth_of(c, p); return p, h * k[2] * frame_h(c, dep) / (HT[who] / HTALL * VIS[who])
def place(f, who, s, y):
    p, _ = need(f, who, y); return [round(p[0], 3), round(y, 3), round(p[2] - s * HT[who] * (1 - .5 / HTALL), 3)]
def base(title, start, end, cast):
    return {"title": title, "fps": 30, "size": [1080, 1920], "words": "caps_his.json", "start": start, "end": end,
        "camera": {"v2": True}, "camsafe": True, "kit3d": {"pbr": True, "relief": True, "sky": False, "trees": False},
        "tween": {"frames": 0, "face_frames": 0, "ones": True},
        "puppet_pkg": ["moves", "cast", "../../../../../templates/vector2d_characters/code"],
        "cast": {k: CAST['cast'][k] for k in cast},
        "face_shadow": True, "costume_shade": CAST['costume_shade'], "card_shade": CAST['card_shade'], "caption_rick_scale": 1.0,
        "post": {"dof": 0.0, "dust": 0.0, "bloom": 1, "vignette": 0}}
LOOK = lambda p: [p[0], p[1] - 6.0, 1.4]

# ---------------- shot 4 (day). Round 2 (MOTION RULES): ONE travel f272-422 through pinned pass stations f284 (monitor fills the frame), f300, f330,
# f390 (fitted cams); pre-roll parked just inside the monitor so f284 already moves (match move from shot 3); eased landing at f422.
S4 = 1.15                                     # one scale from his f330 + f390 heads on the plane y 0.45 (0.45 m in front of the quilt: no collision)
S4_300 = {'newguy': .90, 'commander': .80}    # his f300 heads are smaller than the fitted f300 cam gives with S4: the scale grows .90/.80 -> 1.15 under the pull-back (f300-318)
F4 = base("astro-flush cabin, shot 4 (f284-410, + dissolve f411-422)", 284, 423, ("commander", "newguy", "navigator"))
F4["places"] = {"cabin": {"set": "cab_stage", "kind": "interior", "light": "day", "light_over": {"tint": "#ffffff"},
    "cabin": {"mode": "day", "door": 1, "sway": 0}, "monitor_live": {"amp": 0.06, "period": 9},
    "held": [dict(obj="magazine", who="newguy", hand=0, off=[0, 0, -.05], spin=[0, 0, -8], toss=dict(f=391, v=[-1.1, -.35, 1.0], spin=[220, 140, 380], carry=1.0)),
             dict(obj="drink_ball", who="newguy", hand=1, off=[0, 0, .02], toss=dict(f=394, v=[-.25, -.05, .10], spin=[20, 40, 30], carry=1.0)),
             dict(obj="clipboard", who="navigator", hand=0, off=[0, 0, -.12], spin=[0, 0, -10]),
             dict(obj="pencil", who="navigator", hand=1, off=[0, 0, .04], spin=[0, 0, 30])]}}
c284, c300, c330, c390 = cam(C['f284']), cam(C['f300']), cam(C['f330']), cam(C['f390'])
pre4 = dict(c284, pos=[round(c284['pos'][i] + 0.12 * (c284['pos'][i] - c300['pos'][i]), 4) for i in range(3)])
w = [(c390['pos'][i] - c330['pos'][i]) / 60.0 * .25 for i in range(3)]                 # creep on after f390 at a quarter of the 330-390 speed
c422 = dict(c390, pos=[round(c390['pos'][i] + w[i] * 32, 4) for i in range(3)], aim=[round(c390['aim'][i] + w[i] * 32, 4) for i in range(3)])
F4["takes"] = [{"id": "s4", "place": "cabin", "stations": [
    dict(at=0, **pre4, hold=0.7, creep=0, subject=None, framing="C", purpose="pre-roll (never rendered): parked just inside the monitor; the travel leaves at f272"),
    dict(at=284, **c284, hold=0, pin=True, framing="C", purpose="pinned pass f284: monitor 95 % of the frame, already pulling back"),
    dict(at=300, **c300, hold=0, pin=True, framing="M", subject="newguy", purpose="pinned pass f300 (fitted): dropped to head height, new guy's head big at the bottom"),
    dict(at=330, **c330, hold=0, pin=True, framing="W", subject="newguy", purpose="pinned pass f330 (fitted): settled wide, slow push in"),
    dict(at=390, **c390, hold=0, pin=True, framing="W", subject="newguy", purpose="pinned pass f390 (fitted): creep in"),
    dict(at=422, **c422, travel=round((422 - 272) / 30.0, 4), hold=1.0, creep=0, subject="newguy", framing="W", purpose="eased landing through the dissolve f411-422"),
]}]
Y4 = .45
P4 = {w_: {f: place(f, w_, S4, Y4) for f in (330, 390)} for w_ in ('commander', 'newguy', 'navigator')}
for w_ in ('newguy', 'commander'): P4[w_][300] = place(300, w_, S4_300[w_], Y4)
F4["card_scale"] = {'navigator': [[0, S4, S4], [900, S4, S4]]}
for w_ in ('newguy', 'commander'): F4["card_scale"][w_] = [[0, S4_300[w_], S4_300[w_]], [300, S4_300[w_], S4_300[w_]], [318, S4, S4], [900, S4, S4]]
F4["acts"] = []
for w_, mv, lk in (('commander', 'cmd4', 'newguy'), ('newguy', 'ng4', None), ('navigator', 'nav4', 'newguy')):
    p = P4[w_]; first = p.get(300, p[330]); L_ = lk or LOOK(first)
    F4["acts"] += [dict(who=w_, at=0, pos=first, pose="m:../../ep_cab/" + mv, look=L_, note="floating, weightless (bob in the move); turned to the new guy" if lk else "floating, faces the lens")]
    if 300 in p: F4["acts"] += [dict(who=w_, at=300, pos=p[330], move_s=0.6, ease="inout", look=L_, note="his f300 mark -> his f330 mark under the pull-back, eased")]
    F4["acts"] += [dict(who=w_, at=335, pos=p[390], move_s=1.8, ease="inout", look=L_, note="slow float drift to his f390 mark, eased")]

# ---------------- shot 5 (night). ONE travel f399-499 pinned on f411 (already panning right), f430, f460, f490 (fitted); sleepers on the bags' head anchors.
S5 = {'navigator': .82, 'commander': .95, 'newguy': .92}
MV = META['movers']
F5 = base("astro-flush cabin, shot 5 (f423-494, + dissolves f411-422 and f495-499)", 411, 500, ("navigator", "commander", "newguy"))
F5["places"] = {"cabin": {"set": "cab_stage", "kind": "interior", "light": "night", "light_over": {"tint": "#c9cff5"},
    "cabin": {"mode": "night", "door": 1, "bag_new_guy": "full", "sway": -.6,
              "keys": [{"f": 0, "sway": -.6, "bag_new_guy": "full"}, {"f": 440, "sway": .5}, {"f": 452, "bag_new_guy": "full", "sway": .2}, {"f": 453, "bag_new_guy": "empty"}, {"f": 476, "sway": -.5}, {"f": 500, "sway": .4}]},
    "held": [dict(obj="float_crisps", who=None, drift=dict(f=411, v=[.02, -.01, .03], spin=[0, 0, 12])), dict(obj="float_book", who=None, drift=dict(f=411, v=[-.03, 0, -.015], spin=[6, 0, 9])),
             dict(obj="float_tube", who=None, drift=dict(f=411, v=[.03, 0, .01], spin=[0, 10, 14])), dict(obj="float_strip", who=None, drift=dict(f=411, v=[0, -.02, .02], spin=[8, 0, -10])),
             dict(obj="float_pen", who=None, drift=dict(f=411, v=[.02, 0, .02], spin=[0, 20, 0]))]}}
c430, c460, c490 = cam(C['f430']), cam(C['f460']), cam(C['f490'])
p411 = dict(c430, pos=[round(c430['pos'][0] - .3, 4), round(c430['pos'][1] - .2, 4), round(c430['pos'][2] + .04, 4)], aim=[round(c430['aim'][0] - 1.0, 4), c430['aim'][1], c430['aim'][2]], roll=-2.2)
pre5 = dict(p411, pos=[round(p411['pos'][0] - .2, 4), p411['pos'][1], p411['pos'][2]], aim=[round(p411['aim'][0] - .6, 4), p411['aim'][1], p411['aim'][2]], roll=-2.6)
v = [(c490['pos'][i] - c460['pos'][i]) / 30 * .5 for i in range(3)]
c499 = dict(c490, pos=[round(c490['pos'][i] + v[i] * 9, 4) for i in range(3)], aim=[round(c490['aim'][i] + v[i] * 9, 4) for i in range(3)])
F5["takes"] = [{"id": "s5", "place": "cabin", "stations": [
    dict(at=0, **pre5, hold=0.7, creep=0, framing="W", purpose="pre-roll (never rendered); the travel leaves at f399"),
    dict(at=411, **p411, hold=0, pin=True, framing="W", purpose="pinned pass f411 (first ghost): already panning right"),
    dict(at=430, **c430, hold=0, pin=True, subject="commander", framing="W", purpose="pinned pass f430 (fitted): three bags"),
    dict(at=460, **c460, hold=0, pin=True, subject="newguy", framing="M", purpose="pinned pass f460 (fitted): pan right + push in to commander + new guy"),
    dict(at=490, **c490, hold=0, pin=True, subject="newguy", framing="M", purpose="pinned pass f490 (fitted): pans right with him and pulls back to the door"),
    dict(at=499, **c499, travel=round((499 - 399) / 30.0, 4), hold=0.5, creep=0, subject="newguy", framing="M", purpose="eased landing through the dissolve f495-499"),
]}]
def on_head(who, bag):
    h = MV[bag]['head']; s = S5[who]; return [h[0], h[1], round(h[2] - s * HT[who] * (1 - .5 / HTALL), 3)]
P5 = {'navigator': on_head('navigator', 'bag_navigator'), 'commander': on_head('commander', 'bag_commander')}
ng = {430: on_head('newguy', 'bag_new_guy'), 460: place(460, 'newguy', S5['newguy'], .75), 490: place(490, 'newguy', S5['newguy'], -.3)}
DOOR = [A['bay_door'][0], A['bay_door'][1], 1.4]
F5["card_scale"] = {w_: [[0, s_, s_], [900, s_, s_]] for w_, s_ in S5.items()}
F5["acts"] = [dict(who='navigator', at=0, pos=P5['navigator'], pose="m:../../ep_cab/nav5", look=LOOK(P5['navigator']), note="asleep, head on the teal bag's head anchor"),
              dict(who='commander', at=0, pos=P5['commander'], pose="m:../../ep_cab/cmd5", look=LOOK(P5['commander']), note="asleep, head on the blue bag's head anchor, mouth open"),
              dict(who='newguy', at=0, pos=ng[430], pose="m:../../ep_cab/ng5", look=LOOK(ng[430]), note="asleep, head on the green bag's head anchor"),
              dict(who='newguy', at=446, pos=ng[460], move_s=0.55, ease="inout", look=LOOK(ng[460]), note="slides up and out of the green bag f446-462, eased both ends, body straight"),
              dict(who='newguy', at=472, pos=ng[490], move_s=0.6, ease="inout", look=DOOR, note="floats right to the back door f472-490, eased; turned to the door (3/4)")]

CAPS = [("flushing,", 9.5), ("the new guy", 10.15), ("rolls", 10.567), ("his", 10.933), ("eyes.", 11.12), ("It's a", 11.533), ("toilet.", 11.867), ("What's", 12.533),
        ("it gonna", 12.8), ("do?", 13.0), ("That", 13.64), ("night,", 13.82), ("while", 14.25), ("everyone's", 14.38), ("asleep,", 14.88), ("He", 15.45), ("floats", 15.53),
        ("to", 15.83), ("the back", 16.1), ("and", 16.45), ("flushes.", 16.73)]
caps = [dict(w=w, s=s, e=(CAPS[i + 1][1] - .01 if i + 1 < len(CAPS) else 17.2)) for i, (w, s) in enumerate(CAPS)]
for name, Fm in (("cab4", F4), ("bay5", F5)):
    os.makedirs(os.path.join(H, name), exist_ok=True)
    json.dump(Fm, open(os.path.join(H, name, 'film.json'), 'w'), indent=1); json.dump(caps, open(os.path.join(H, name, 'caps_his.json'), 'w'), indent=0)
    print('wrote', name, {a['who'] + '@' + str(a['at']): a['pos'] for a in Fm['acts'] if 'pos' in a})

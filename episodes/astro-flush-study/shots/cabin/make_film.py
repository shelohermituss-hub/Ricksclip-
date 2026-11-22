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

# ---------------- shot 4 (day). Camera: f284 monitor fills the frame -> f300 (fitted) -> settle f317 -> push to f330 (fitted) -> f360 rest/creep -> f390 (fitted) -> creep to f422
S4 = 1.21
F4 = base("astro-flush cabin, shot 4 (f284-410, + dissolve f411-422)", 284, 423, ("commander", "newguy", "navigator"))
F4["places"] = {"cabin": {"set": "cab_stage", "kind": "interior", "light": "day", "light_over": {"tint": "#ffffff"},
    "cabin": {"mode": "day", "door": 1, "sway": 0},
    "held": [dict(obj="magazine", who="newguy", hand=0, off=[0, 0, -.05], spin=[0, 0, -8], toss=dict(f=392, v=[-.55, .25, .55], spin=[160, 90, 260])),
             dict(obj="drink_ball", who="newguy", hand=1, off=[0, 0, .02], toss=dict(f=396, v=[-.35, .05, .12], spin=[20, 40, 30])),
             dict(obj="clipboard", who="navigator", hand=0, off=[0, 0, -.12], spin=[0, 0, -10]),
             dict(obj="pencil", who="navigator", hand=1, off=[0, 0, .04], spin=[0, 0, 30])]}}
c284, c300, c330, c390 = C['f284'], C['f300'], C['f330'], C['f390']
p360 = lerp(c330['loc'], c390['loc'], .55); a360 = lerp(c330['look'], c390['look'], .55)
v4 = [(p360[i] - c330['loc'][i]) / 1.0 for i in range(3)]                   # m/s 330 -> 360
p317 = [c330['loc'][i] - v4[i] * 13 / 30 * 1.6 for i in range(3)]          # board: z1.07 at 330 = the push is fastest just after the settle
w390 = [(c390['loc'][i] - c330['loc'][i]) * .05 for i in range(3)]         # creep on after f390 (z1.01-1.02 per 0.5 s)
F4["takes"] = [{"id": "s4", "place": "cabin", "stations": [
    cam(c284, at=0, hold=0.7, creep=0, subject=None, framing="C", purpose="pre-roll (never rendered): the monitor fills the frame"),
    cam(c284, at=284, hold=0, min_hold=0, creep=0, travel=0.1, framing="C", purpose="f284 match move from shot 3: monitor 95 % of the frame"),
    dict(pos=[round(x, 4) for x in p317], aim=[round(c330['look'][i] - v4[i] * 13 / 30 * 1.6, 4) for i in range(3)], lens=lens(60), roll=0.38, at=317, travel=33 / 30, via=[[round(x, 4) for x in c300['loc']]], aim_via=[[round(x, 4) for x in c300['look']]],
         hold=43 / 30, creep=0, drift=[round(x * 1.15, 4) for x in v4], drift_aim=1, subject="newguy", framing="W", purpose="settle f312-317, then the slow push in through f330 (cam f330 fitted) to f360"),
    cam(c390, at=390, travel=1.0, hold=32 / 30, creep=0, drift=[round(x * 30 / 32, 4) for x in w390], drift_aim=1, subject="newguy", framing="W", purpose="rest/creep 360-390 into cam f390 (fitted), creep on to the dissolve f411-422"),
]}]
P4 = {w: {f: place(f, w, S4, .7) for f in (330, 390)} for w in ('commander', 'newguy', 'navigator')}
P4['newguy'][300] = place(300, 'newguy', S4, 1.12)       # his f300 cheat: the new guy sits deeper (the size of his f300 head needs y 1.12 with the shot scale)
P4['commander'][300] = place(300, 'commander', S4, 1.35)
F4["card_scale"] = {w: [[0, S4, S4], [900, S4, S4]] for w in ('commander', 'newguy', 'navigator')}
F4["acts"] = []
for w, mv in (('commander', 'cmd4'), ('newguy', 'ng4'), ('navigator', 'nav4')):
    p = P4[w]; first = p.get(300, p[330])
    F4["acts"] += [dict(who=w, at=0, pos=first, pose="m:../../ep_cab/" + mv, look=LOOK(first), note="floating, weightless (bob in the move)")]
    if 300 in p: F4["acts"] += [dict(who=w, at=300, pos=p[330], move_s=0.6, look=LOOK(p[330]), note="cheat mark of his f300 -> real mark under the settle")]
    F4["acts"] += [dict(who=w, at=340, pos=p[390], move_s=1.6, look=LOOK(p[390]), note="slow float drift to his f390 mark")]

# ---------------- shot 5 (night). Camera: f411 already panning right -> f430 (fitted) -> near rest f452 -> f460 (fitted) -> pan right + pull back to f490 (fitted) -> on to f499
S5 = {'navigator': .82, 'commander': 1.0, 'newguy': .91}
F5 = base("astro-flush cabin, shot 5 (f423-494, + dissolves f411-422 and f495-499)", 411, 500, ("navigator", "commander", "newguy"))
F5["places"] = {"cabin": {"set": "cab_stage", "kind": "interior", "light": "night", "light_over": {"tint": "#c9cff5"},
    "cabin": {"mode": "night", "door": 1, "bag_new_guy": "full", "sway": -.6,
              "keys": [{"f": 0, "sway": -.6, "bag_new_guy": "full"}, {"f": 440, "sway": .5}, {"f": 462, "bag_new_guy": "full", "sway": -.2}, {"f": 463, "bag_new_guy": "empty"}, {"f": 476, "sway": -.5}, {"f": 500, "sway": .4}]},
    "held": [dict(obj="float_crisps", who=None, drift=dict(f=411, v=[.02, -.01, .03], spin=[0, 0, 12])), dict(obj="float_book", who=None, drift=dict(f=411, v=[-.03, 0, -.015], spin=[6, 0, 9])),
             dict(obj="float_tube", who=None, drift=dict(f=411, v=[.03, 0, .01], spin=[0, 10, 14])), dict(obj="float_strip", who=None, drift=dict(f=411, v=[0, -.02, .02], spin=[8, 0, -10])),
             dict(obj="float_pen", who=None, drift=dict(f=411, v=[.02, 0, .02], spin=[0, 20, 0]))]}}
c430, c460, c490 = C['f430'], C['f460'], C['f490']
v5 = [(c460['loc'][i] - c430['loc'][i]) / 30 * .25 * 30 / 8 for i in range(3)]
p411 = [c430['loc'][0] - .35, c430['loc'][1] - .25, c430['loc'][2] + .05]; a411 = [c430['look'][0] - 1.1, c430['look'][1], c430['look'][2]]
p452 = lerp(c430['loc'], c460['loc'], .9); a452 = lerp(c430['look'], c460['look'], .9)
w490 = [(c490['loc'][i] - c460['loc'][i]) / 30 * .25 for i in range(3)]
F5["takes"] = [{"id": "s5", "place": "cabin", "stations": [
    dict(pos=[round(x, 4) for x in p411], aim=a411, lens=lens(60), roll=-2.5, at=0, hold=0.7, creep=0, framing="W", purpose="pre-roll (never rendered)"),
    dict(pos=[round(x, 4) for x in p411], aim=a411, lens=lens(60), roll=-2.5, at=411, hold=0, min_hold=0, creep=0, travel=0.1, framing="W", purpose="f411 first ghost: already panning right"),
    dict(pos=[round(x, 4) for x in p452], aim=[round(x, 4) for x in a452], lens=lens(60), roll=2.0, at=452, travel=41 / 30, via=[[round(x, 4) for x in c430['loc']]], aim_via=[[round(x, 4) for x in c430['look']]], hold=8 / 30, creep=0,
         drift=[round((c460['loc'][i] - p452[i]) / (8 / 30), 4) for i in range(3)], drift_aim=1, subject="newguy", framing="M", purpose="pan right + push in to commander + new guy, near rest ('asleep.'), drifts into cam f460 (fitted)"),
    cam(c490, at=490, travel=30 / 30, hold=10 / 30, creep=0, drift=[round(x * 30, 4) for x in w490], drift_aim=1, subject="newguy", framing="M", purpose="pans right with him and pulls back to the door (cam f490 fitted), on through the dissolve"),
]}]
P5 = {'navigator': place(430, 'navigator', S5['navigator'], 1.0), 'commander': place(430, 'commander', S5['commander'], 1.0)}
ng = {430: place(430, 'newguy', S5['newguy'], 1.0), 460: place(460, 'newguy', S5['newguy'], .75), 490: place(490, 'newguy', S5['newguy'], -.3)}
F5["card_scale"] = {w: [[0, s, s], [900, s, s]] for w, s in S5.items()}
F5["acts"] = [dict(who='navigator', at=0, pos=P5['navigator'], pose="m:../../ep_cab/nav5", look=LOOK(P5['navigator']), note="asleep in the teal bag"),
              dict(who='commander', at=0, pos=P5['commander'], pose="m:../../ep_cab/cmd5", look=LOOK(P5['commander']), note="asleep in the blue bag, mouth open"),
              dict(who='newguy', at=0, pos=ng[430], pose="m:../../ep_cab/ng5", look=LOOK(ng[430]), note="asleep in the green bag"),
              dict(who='newguy', at=457, pos=ng[460], move_s=0.4, look=LOOK(ng[460]), note="slides up out of the green bag f457-469, eased, body straight"),
              dict(who='newguy', at=474, pos=ng[490], move_s=0.65, look=LOOK(ng[490]), note="drifts right to the back door")]

CAPS = [("flushing,", 9.5), ("the new guy", 10.15), ("rolls", 10.567), ("his", 10.933), ("eyes.", 11.12), ("It's a", 11.533), ("toilet.", 11.867), ("What's", 12.533),
        ("it gonna", 12.8), ("do?", 13.0), ("That", 13.64), ("night,", 13.82), ("while", 14.25), ("everyone's", 14.38), ("asleep,", 14.88), ("He", 15.45), ("floats", 15.53),
        ("to", 15.83), ("the back", 16.1), ("and", 16.45), ("flushes.", 16.73)]
caps = [dict(w=w, s=s, e=(CAPS[i + 1][1] - .01 if i + 1 < len(CAPS) else 17.2)) for i, (w, s) in enumerate(CAPS)]
for name, Fm in (("cab4", F4), ("bay5", F5)):
    os.makedirs(os.path.join(H, name), exist_ok=True)
    json.dump(Fm, open(os.path.join(H, name, 'film.json'), 'w'), indent=1); json.dump(caps, open(os.path.join(H, name, 'caps_his.json'), 'w'), indent=0)
    print('wrote', name, {a['who'] + '@' + str(a['at']): a['pos'] for a in Fm['acts'] if 'pos' in a})

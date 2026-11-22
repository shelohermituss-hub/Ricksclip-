#!/usr/bin/env python3
"""mc stretch (astro-flush-study): writes mc3/film.json (shot 3, f120-283 + f284-410 monitor tail) and mc10/film.json (shot 10, f803-866).
Film frame f = his reference frame f: the film starts at f0, "start" = first frame of the shot (frames before it are baked, never rendered).
Cameras from sets/mc/out/mc_meta.json (cams fitted to his frames); lens = 18 / tan(vfov / 2) (36 mm sensor on the long side)."""
import json, math, os
H = os.path.dirname(os.path.abspath(__file__)); EP = os.path.join(H, '..', '..')
META = json.load(open(os.path.join(EP, 'sets/mc/out/mc_meta.json'))); CAST = json.load(open(os.path.join(EP, 'cast/cast.json')))
lens = lambda vfov: round(18 / math.tan(math.radians(vfov) / 2), 2)
C = META['cams']; CM = META['cam_monitor']; SP = META['space_panel']
def cam(c): return dict(pos=c['loc'], aim=c['look'], lens=lens(c['vfov']), roll=c.get('roll', 0))

def base(title, start, end):
    return {
        "title": title, "fps": 30, "size": [1080, 1920], "words": "refs/words_ref.json", "start": start, "end": end,
        "camera": {"v2": True}, "camsafe": True, "kit3d": {"pbr": True, "relief": True, "sky": False, "trees": False},
        "tween": {"frames": 0, "face_frames": 0, "ones": True},
        "puppet_pkg": ["moves", "cast", "../../../../../templates/vector2d_characters/code"],
        "cast": {k: CAST['cast'][k] for k in ("director", "ctlGreen", "ctlBlue", "ctlDark")},
        "face_shadow": True, "costume_shade": CAST['costume_shade'], "card_shade": CAST['card_shade'],
        "caption_rick_scale": 0.75,
        "post": {"dof": 0.0, "dust": 0.0, "bloom": 1, "vignette": 0},
        "places": {"mc": {"set": "mc", "kind": "interior", "light": "interior", "mc": {"keys": "reference", "ref_f0": 0}}},
    }

A = META['anchors']
D = [A['director'][0], A['director'][1], 0.0]
CTL = {"ctlGreen": A['ctl_fao'], "ctlBlue": A['ctl_capcom'], "ctlDark": A['ctl_guido']}
LOOK = lambda p: [p[0], p[1] - 6.0, 1.4]          # faces the camera side (-y)

# ---------------- shot 3
F3 = base("astro-flush mc, shot 3 (f120-283, monitor tail to f410)", 120, 411)
pc = SP['centre']; ph = SP['size'][1]; L3 = lens(34); d0 = ph / 2 * L3 / 18     # the space panel fills the frame height (the 9:16 frame width 0.886 m ~ panel 0.889 m)
p120 = dict(pos=[pc[0], round(pc[1] - d0, 4), pc[2]], aim=[pc[0], pc[1], pc[2]], lens=L3, roll=0)
c140 = cam(C['f140']); c180 = cam(C['f180']); c283 = cam(CM)
push = [(c283['pos'][i] - c180['pos'][i]) / ((270 - 180) / 30.0) for i in range(3)]     # rest 180-270 drifts to the f283 spot, then a 13 f settle onto cam_monitor
F3["takes"] = [{"id": "s3", "place": "mc", "stations": [
    dict(at=0, **p120, hold=0.7, creep=0, subject=None, framing="C", purpose="pre-roll (never rendered): parked on the panel"),
    dict(at=120, **p120, hold=0, min_hold=0, creep=0, framing="C", purpose="f120 match move from shot 2: the space panel fills the frame", travel=0.1),
    dict(at=142, **dict(c140, roll=0), travel_roll=-2.5, hold=0.07, min_hold=0, creep=0.002, framing="W", travel=0.73, subject="ctlBlue", purpose="f142 pull back + drop: orbit map wall, clocks, three heads at the bottom (cam f140 fitted)"),
    dict(at=180, **c180, travel_roll=3.0, hold=3.0, creep=0, drift=[push[0] + 0.02, push[1], push[2]], drift_aim=0, travel=1.2, subject="director", framing="M", purpose="f180 settled: screen top half, director centre right, slow push in"),
    dict(at=283, **c283, hold=4.0, creep=0.00015, drift=[0.03, 0.0, 0.0], drift_aim=0.5, travel=0.43, subject="director", framing="M", purpose="f283 = cam_monitor; holds with a slight drift to f410 (monitor picture of shot 4)"),
]}]
F3["acts"] = [
    dict(who="director", at=0, pos=[2.55, D[1], 0], pose="m:../../ep_mc/dir3", visible=False, look=LOOK(D), note="off right until f149"),
    dict(who="director", at=149, visible=True, pos=D, move_s=0.97, linear=False, look=LOOK(D), note="f150 enters right, bouncy walk to the left, arrives ~f178"),
    dict(who="director", at=176, face="k:talk", look=LOOK(D), note="exactly when"),
    dict(who="director", at=224, face="k:smug", look=LOOK(D), note="GO: flush."),
    dict(who="director", at=262, face="k:concentrate", look=LOOK(D), note="red button 262-264"),
    dict(who="director", at=268, face="k:afEyeRoll", look=LOOK(D), note="flat stare"),
    dict(who="director", at=300, face="k:annoyed", look=LOOK(D), note="monitor tail: quiet"),
    dict(who="director", at=340, face="k:afEyeRoll", look=LOOK(D), note="head shake 330-350"),
    dict(who="director", at=375, face="k:skeptical", look=LOOK(D), note="monitor tail"),
]
for who, p, mv in (("ctlGreen", CTL["ctlGreen"], "fao3"), ("ctlBlue", CTL["ctlBlue"], "capcom3"), ("ctlDark", CTL["ctlDark"], "guido3")):
    F3["acts"] += [dict(who=who, at=0, pos=[p[0], p[1], 0], pose="m:../../ep_mc/" + mv, look=LOOK(p), note="behind the console, float"),
                   dict(who=who, at=244, face="k:surprised", look=LOOK(p), note="eyes big, look at the director"),
                   dict(who=who, at=300, face="k:standard", look=LOOK(p), note="quiet in the monitor")]

# ---------------- shot 10
F10 = base("astro-flush mc, shot 10 (f803-866)", 803, 867)
c820 = cam(C['f820']); L10 = 55.0
v = [0.0, 0.47, -0.10]                                        # m/s: push in + down, with the lens between his f820 (38 deg) and f860 (34 deg)
p803 = [c820['pos'][i] - v[i] * 17 / 30.0 for i in range(3)]
F10["takes"] = [{"id": "s10", "place": "mc", "stations": [
    dict(at=0, pos=p803, aim=c820['aim'], lens=L10, roll=0, hold=0.7, creep=0, framing="M", purpose="pre-roll (never rendered)"),
    dict(at=803, pos=[round(x, 4) for x in p803], aim=c820['aim'], lens=L10, roll=0, hold=3.0, min_hold=0, creep=0, drift=v, drift_aim=0, travel=0.1, subject="director", framing="M",
         purpose="f803 hard cut: director centre, OFF COURSE behind his head; steady push in to f866 (z ~1.07 per 0.5 s)"),
]}]
F10["acts"] = [
    dict(who="director", at=0, pos=D, pose="m:../../ep_mc/dir10", face="k:shocked", look=LOOK(D), note="803 shocked"),
    dict(who="director", at=812, face="k:angry", look=LOOK(D), note="drifting"),
    dict(who="director", at=838, pos=[D[0] + 0.05, D[1] - 1.0, 0], move_s=0.13, look=LOOK(D), note="839-842 lunges to the lens (head 15% -> 21%)"),
    dict(who="director", at=842, face="k:furious", look=LOOK(D), note="Who flushed? fist up 842-845"),
]
for who, p, mv in (("ctlGreen", CTL["ctlGreen"], "fao10"), ("ctlBlue", CTL["ctlBlue"], "capcom10"), ("ctlDark", CTL["ctlDark"], "guido10")):
    F10["acts"] += [dict(who=who, at=0, pos=[p[0], p[1], 0], pose="m:../../ep_mc/" + mv, face="k:shocked", look=LOOK(p), note="round eyes"),
                    dict(who=who, at=845, face="k:shocked", look=LOOK(p), note="845 CAPCOM ducks")]

for name, Fm in (("mc3", F3), ("mc10", F10)):
    json.dump(Fm, open(os.path.join(H, name, 'film.json'), 'w'), indent=1); print('wrote', name)

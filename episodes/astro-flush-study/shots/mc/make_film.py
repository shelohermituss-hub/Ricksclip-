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
        "title": title, "fps": 30, "size": [1080, 1920], "words": "caps_his.json", "start": start, "end": end,
        "camera": {"v2": True}, "camsafe": True, "kit3d": {"pbr": True, "relief": True, "sky": False, "trees": False},
        "tween": {"frames": 0, "face_frames": 0, "ones": True},
        "puppet_pkg": ["moves", "cast", "../../../../../templates/vector2d_characters/code"],
        "cast": {k: CAST['cast'][k] for k in ("director", "ctlGreen", "ctlBlue", "ctlDark")},
        "face_shadow": True, "costume_shade": CAST['costume_shade'], "card_shade": CAST['card_shade'],
        "caption_rick_scale": 1.0,
        "post": {"dof": 0.0, "dust": 0.0, "bloom": 1, "vignette": 0},
        "places": {"mc": {"set": "mc", "kind": "interior", "light": "night", "light_over": {"top": "#2a2f8a", "hor": "#4b3f9e", "sun": "#b4b0ff", "si": 1.0, "amb": "#6a62c8", "ai": 1.1, "tint": "#ffffff"}, "mc": {"keys": "reference", "ref_f0": 0,
            "motion": {"screen_fade": {"ring": [6, 0], "noflush": [0, 6]}, "mood_fade": {"teal": 8}, "box_rise": [170, 182], "cover": [254, 263]}}}},
    }

A = META['anchors']
D = [A['director'][0], A['director'][1], 0.0]
CTL = {k: [v[0], v[1] + 0.25, 0] for k, v in (("ctlGreen", A['ctl_fao']), ("ctlBlue", A['ctl_capcom']), ("ctlDark", A['ctl_guido']))}   # round 2: 0.25 m behind the desk back edge (collide)
LOOK = lambda p: [p[0], p[1] - 6.0, 1.4]          # faces the camera side (-y)

# ---------------- shot 3
F3 = base("astro-flush mc, shot 3 (f120-283, monitor tail to f410)", 120, 411)
pc = SP['centre']; ph = SP['size'][1]; L3 = lens(34); d0 = ph / 2 * L3 / 18     # the space panel fills the frame height (the 9:16 frame width 0.886 m ~ panel 0.889 m)
p120 = dict(pos=[pc[0], round(pc[1] - d0, 4), pc[2]], aim=[pc[0], pc[1], pc[2]], lens=L3, roll=0)
c140 = cam(C['f140']); c180 = cam(C['f180']); c283 = cam(CM)
push = [(c283['pos'][i] - c180['pos'][i]) / ((270 - 180) / 30.0) for i in range(3)]     # rest 180-270 drifts to the f283 spot, then a 13 f settle onto cam_monitor
# round 3 (motion): ONE travel f108-410 through pinned pass stations (film_plan "pin": the camera is ON each station on its frame, speed continuous,
# no dip): already moving at f120 (match move from shot 2), f142 = cam f140 fitted, f180 = cam f180, f283 = cam_monitor, eased landing at f410.
c410 = dict(c283, pos=[c283['pos'][0] + 0.03 * 127 / 30, c283['pos'][1], c283['pos'][2]], aim=[c283['aim'][0] + 0.015 * 127 / 30, c283['aim'][1], c283['aim'][2]])
pre = dict(p120, pos=[round(p120['pos'][i] + 0.12 * (p120['pos'][i] - c140['pos'][i]), 4) for i in range(3)], roll=-3.6)
F3["takes"] = [{"id": "s3", "place": "mc", "stations": [
    dict(at=0, **pre, hold=0.7, creep=0, subject=None, framing="C", purpose="pre-roll (never rendered): parked just inside the panel; the travel leaves at f108"),
    dict(at=120, **dict(p120, roll=-4), hold=0, pin=True, framing="C", purpose="f120 match move from shot 2: the space panel fills the frame, camera already moving"),
    dict(at=142, **dict(c140, roll=-7), hold=0, pin=True, framing="W", subject="ctlBlue", purpose="pinned pass: orbit map wall, clocks, three heads at the bottom (cam f140 fitted)"),
    dict(at=180, **c180, hold=0, pin=True, subject="director", framing="M", purpose="pinned pass: director on his mark, level, slow push in"),
    dict(at=283, **c283, hold=0, pin=True, subject="director", framing="M", purpose="pinned pass: f283 = cam_monitor (monitor picture of shot 4)"),
    dict(at=410, **c410, travel=round((410 - 108) / 30.0, 4), hold=1.0, creep=0, subject="director", framing="M", purpose="eased landing at the end of the monitor tail"),
]}]
F3["acts"] = [
    dict(who="director", at=0, pos=[D[0] + 1.65, D[1], 0], pose="m:../../ep_mc/dir3", visible=False, look=LOOK(D), note="off right until f149"),
    dict(who="director", at=149, visible=True, pos=D, move_s=1.0, linear=True, look=LOOK(D), note="f150 enters right, bouncy walk to the left, arrives ~f178"),
    dict(who="director", at=178, face="k:browUp", look=LOOK(D), note="exactly when"),
    dict(who="director", at=224, face="k:smug", look=LOOK(D), note="GO: flush."),
    dict(who="director", at=262, face="k:concentrate", look=LOOK(D), note="red button 262-264"),
    dict(who="director", at=268, face="k:afEyeRoll", look=LOOK(D), note="flat stare"),
    dict(who="director", at=300, face="k:annoyed", look=LOOK(D), note="monitor tail: quiet"),
    dict(who="director", at=340, face="k:afEyeRoll", look=LOOK(D), note="head shake 330-350"),
    dict(who="director", at=375, face="k:skeptical", look=LOOK(D), note="monitor tail"),
]
F3["card_scale"] = {"director": [[0, .8, .93], [900, .8, .93]], "ctlGreen": [[0, .6, .6], [146, .6, .6], [176, 1, 1], [900, 1, 1]],
                    "ctlBlue": [[0, .6, .6], [146, .6, .6], [176, 1, 1], [900, 1, 1]], "ctlDark": [[0, .6, .6], [146, .6, .6], [176, 1, 1], [900, 1, 1]]}
cx = CTL["ctlBlue"][0] - 0.32
for i, (who, mv) in enumerate((("ctlGreen", "fao3"), ("ctlBlue", "capcom3"), ("ctlDark", "guido3"))):
    p = CTL[who]; ch = [cx + (i - 1) * 0.31, p[1], 0.58]
    F3["acts"] += [dict(who=who, at=0, pos=ch, pose="m:../../ep_mc/" + mv, visible=False, look=LOOK(p), note="hidden behind the desk until the camera is level"),
                   dict(who=who, at=131, visible=True, look=LOOK(p), note="heads rise in from the bottom f131-139 (his f134-138)"),
                   dict(who=who, at=146, pos=p, move_s=1.0, ease="inout", look=LOOK(p), note="cheat marks of his f142 -> real marks by f176 (under the pull-back), eased both ends"),
                   dict(who=who, at=176, face="k:open", look=LOOK(p), note="heads turn to the director"),
                   dict(who=who, at=264, face="k:surprised", look=LOOK(p), note="mild surprise at NO GO"),
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
    dict(at=845, pos=[round(p803[i] + v[i] * 42 / 30.0 - (0.07 if i == 2 else 0), 4) for i in range(3)], aim=[c820['aim'][0], c820['aim'][1], c820['aim'][2] + 0.2], lens=L10, roll=0, hold=1.0, travel=0.2, whip=True,
         creep=0, drift=v, drift_aim=0, subject="director", framing="M", purpose="f840-845 the picture bumps 3 % down with the lunge, then the push goes on"),
]}]
F10["card_scale"] = {"director": [[0, .8, .93], [900, .8, .93]]}
F10["acts"] = [
    dict(who="director", at=0, pos=[D[0], D[1] - 0.8, 0], pose="m:../../ep_mc/dir10", face="k:open", look=LOOK(D), note="803 shocked"),
    dict(who="director", at=812, face="k:angry", look=LOOK(D), note="drifting"),
    dict(who="director", at=834, pos=[D[0] + 0.05, D[1] - 1.6, 0], move_s=0.4, ease="inout", look=LOOK(D), note="834-846 lunges to the lens (his build-up 833-845, head 15% -> 21%), eased"),
    dict(who="director", at=842, face="k:afGrit", look=LOOK(D), note="Who flushed? fist up 842-845"),
]
for who, p, mv in (("ctlGreen", CTL["ctlGreen"], "fao10"), ("ctlBlue", CTL["ctlBlue"], "capcom10"), ("ctlDark", CTL["ctlDark"], "guido10")):
    F10["acts"] += [dict(who=who, at=0, pos=[p[0], p[1], 0], pose="m:../../ep_mc/" + mv, face="k:open", look=LOOK(p), note="round eyes"),
                    dict(who=who, at=845, face="k:open", look=LOOK(p), note="845 CAPCOM ducks")]

for name, Fm in (("mc3", F3), ("mc10", F10)):
    json.dump(Fm, open(os.path.join(H, name, 'film.json'), 'w'), indent=1); print('wrote', name)

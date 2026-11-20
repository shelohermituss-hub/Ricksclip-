# S2 (film 12.50-25.90 s = frames 375-777, plan rows 11-20, script lines 4-6). Writes film.json + words_s2.json + OFFSET.txt. Stretch frame = FILM frame.
# Two takes: "co" (corridor, light CO, rows 11-15) and "of" (office night, light NI, rows 16-20), joined through the clock face: the corridor take ends pushed
# into the spinning corridor clock, the office take starts on the office clock face (cut on the matched face at 540, "Then").
# Light keys re-read from sets/PLACE_KEYS.json at every build. S2 keys: corridor.js co_v2, out_v2; office.js ni_v2, chair, impact, qfield, focus, sweat,
# glint, tower, tap, deal, tray_fill_k (top comments of the set files). Moves: moves/ep_s2.mjs (sg_s2, so_s2, gw_s2).
import json, copy, os
KEYS = json.load(open('cast/CAST_KEYS.json', encoding='utf-8'))
PK = json.load(open('sets/PLACE_KEYS.json', encoding='utf-8'))
WORDS = json.load(open('voice/words.json', encoding='utf-8'))
F0, END = 363, 790
json.dump([dict(w=w['w'], s=w['s'], e=w['e']) for w in WORDS if w['s'] < END / 30], open('words_s2.json', 'w', encoding='utf-8'), indent=0)
def st(at, pos, aim, lens, subject, framing, purpose, **k): return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, **k)
M = lambda n: 'm:../../ep_s2/' + n
C = lambda x, y, z: [round(60 + x, 3), round(y, 3), round(z, 3)]     # corridor local -> world
O = lambda x, y, z: [round(120 + x, 3), round(y, 3), round(z, 3)]    # office local -> world
# v2 CAMERA (CB 2026-11-16: "camera just move quick why? like zig zag", "why they sliding"): 2 flowing takes, few stations, eased 1.2-2.9 s travels,
# rests >= 0.8 s with a creep. Corridor: out of the porthole -> ONE picture of the OR doors + 1994/HOUSTON calendar + CRT (period_right) -> one long
# flight down the corridor beside the gurney queue (window + queue_out on "all day long") into the clock face.
# v2 ROUND 2 (2026-11-16, picture too fast: p90 43.8, whips 21/min): the near walls/ceiling/gurneys swept the lens. Corridor: shorter, slower pull-out
# (2.3 s, 33 deg turn), door picture rest nearer the doors, the flight at mid height (1.55-1.95 m, ceiling 2.8) down the middle of the corridor on a
# LONGER lens (24 -> 40 mm) so near things stay out of the frame edges; the clock hangs lower (1.95) and the push ends 0.6 m off its face at 40 mm
# (= the old 30 mm at 0.45 m: same face size for the 540 join). Office: every travel 1.4-1.8 s with fewer metres; the crash zoom 643-652 unchanged.
# v2 ROUND 3 (2026-11-16, LEAD DECISION): S1->S2 is an 18-frame dissolve (EDIT_LIST B=375 len 18), so S2 starts 1 m off the porthole L glass with the doors
# and the corridor wall in view, already moving (no pull-out from 16 cm). The corridor take ends at REST on the hung clock at HALF-FACE framing (30 mm, 1.35 m,
# the window + queue_out under it) with the hands spinning; the office take starts on the office clock framed the same way (30 mm, 1.35 m, same screen spot)
# and a 12-frame DISSOLVE on the clocks (534-545) is baked in final/make_final.py from handle frames (S2_VARIANT=out: corridor on to 545; S2_VARIANT=in:
# office from 534). ONE slow 3.1 s travel down the corridor (443 -> 537). The office pull-back starts at 551, on a path above and right of the desk.
VAR = os.environ.get('S2_VARIANT', '')    # '' main | 'out' (corridor take runs on to 545) | 'in' (office take starts at 534)
OF0 = {'': 540, 'out': 546, 'in': 534}[VAR]
# v3 (FIX_BRIEF_v3, ISSUES_v2 C2 C3 C4 B4 B5 D1 A7): corridor = join -> door picture (1990s/Houston) -> push to the portholes (C4: big silhouettes on
# "scrape and rinse") -> ONE eased pan + drift down the corridor onto the gurney queue with wincing patients g1-g3 (C3) + hung clock + window (all day long).
# Office = clock -> pull back to a WIDE with the surgeon whole + the "?" bubble + the "?" note on locker 2 (C2, B4) -> push -> crash zoom (unchanged 643-652)
# -> pull back to a tower REST with the surgeon whole beside the tower (B5) -> tilt down into the trays (lamp_nohalo: D1). env_v3 on both places (A7).
# v3 ROUND 2 (camera only, picture too busy: rests 4.93/10 s, travel p90 1.3 s, speed p90 34.5): fewer, longer moves. Corridor = join -> door picture rest ->
# ONE 3.1 s move (push toward the portholes on "scrape and rinse", a hold-0 chain station, then crane up/left and pan down the corridor onto the queue) -> queue rest
# creeping into the clock dissolve. Office = clock (opened wider: 26 mm 3.1 m, less zoom to the wide) -> wide rest (bubble) -> push + crash zoom (unchanged 643-652)
# -> ONE 3.3 s move through the tower (hold-0 chain station, surgeon whole beside the tower) down into the trays (last station unchanged).
LENS_DOOR = float(os.environ.get('LENS_DOOR', 22))   # door picture lens (v4: kept 24)
DOOR_POS = eval(os.environ.get('DOOR_POS', '[-.9, -.8, 2.6]')); DOOR_AIM = eval(os.environ.get('DOOR_AIM', '[.6, 4.2, .95]'))
Q_POS = eval(os.environ.get('Q_POS', '[0.0, 2.6, 2.6]')); Q_AIM = eval(os.environ.get('Q_AIM', '[.1, 6.4, .8]')); Q_LENS = float(os.environ.get('Q_LENS', 20))   # v6: queue end station (high 3/4 onto the lying patients)
Q_VIA = eval(os.environ.get('Q_VIA', '[-.6, .9, 2.5]')); Q_AIMVIA = eval(os.environ.get('Q_AIMVIA', '[.4, 4.8, 1.0]'))
# v4 (FIX_BRIEF_v4, CB "patient in hall way also have half of the head"): the pan used to bring g1-g3 in through the LEFT edge (half heads f466-480) and
# g2 crossed the right-wall handrail. Now the door picture stands 1.8 m further back (C(-.9,-.8,1.6) -> C(1.2,4.2,1.4), 24 mm): OR 3 doors, both portholes,
# 1994 HOUSTON calendar, CRT AND the whole gurney queue with g1-g3 in one picture from f418; the travel (same frames 424-522, same end station) no longer
# swings right to the portholes (via C(-1,.5,1.85), aim_via C(1,4.8,1.4)), so every patient stays whole inside the frame all the way. Handrail behind the
# queue removed (corridor.js rail_queue_off). g2 + g3 sit 4 cm higher (feet/legs were 4-5 % in the gurney drape). g1 no longer hidden (G1_HIDE False).
G1_HIDE = False
_dv = eval(os.environ.get('DOOR_VIA', '[-.6, .6, 1.6]')); _dav = eval(os.environ.get('DOOR_AIMVIA', '[.8, 6.5, 1.4]'))   # v4: the opening pull-back turns left early: g1-g3 enter inside the S1->S2 dissolve (366-383)
DOOR_VIA = dict(**({'via': [C(*_dv)]} if _dv else {}), **({'aim_via': [C(*_dav)]} if _dav else {}))
CLK_POS = eval(os.environ.get('CLK_POS', '[-.4, -.6, 2.0]')); CLK_AIM = eval(os.environ.get('CLK_AIM', '[1.0, 2.56, 2.15]')); CLK_LENS = float(os.environ.get('CLK_LENS', 26))   # v4b: office clock station 1.25 m left: the surgeon WHOLE in frame from 540 (was cut by the left edge 540-563)
P0_POS = eval(os.environ.get('P0_POS', '[.3, 1.4, 1.8]')); P0_AIM = eval(os.environ.get('P0_AIM', '[.4, 4.9, 1.4]'))   # v4b: S2 opens aimed down the corridor: g1-g3 WHOLE in frame from 363 (no entry through the left edge inside the S1->S2 dissolve)
co = [
 st(363, C(*P0_POS), C(*P0_AIM), 24, 'portholes', 'M', 'JOIN S1->S2 (18 f dissolve): 1 m off the porthole L glass, both portholes + the corridor wall in view, already easing back', hold=0, creep=0),
 st(418, C(*DOOR_POS), C(*DOOR_AIM), LENS_DOOR, 'portholes', 'W', 'ROWS 11-12 "BACK in the 1990s in HOUSTON": OR 3 doors, calendar 1994 HOUSTON TX + CRT beside the doors, slow creep in', travel=55 / 30., hold=6 / 30., **DOOR_VIA),
 st(522, C(*Q_POS), C(*Q_AIM), Q_LENS, 'queue', 'W', 'ROWS 14-15 "SORE KNEES ... ALL DAY LONG" (C3): the same move cranes up and pans onto the gurney queue, three different wincing patients, hung clock spinning, window + queue out (via + aim_via: the aim holds on the portholes for "scrape and rinse" while the camera rises, one eased travel)', travel=98 / 30., hold=0, creep=0.0015, via=[C(*Q_VIA)], aim_via=[C(*Q_AIMVIA)]),
]
of = [
 st(OF0, O(*CLK_POS), O(*CLK_AIM), CLK_LENS, 'clock', 'M', 'JOIN (12 f dissolve 534-545): the office wall clock at night, opened wider (26 mm, 3.1 m) so the pull to the wide is a shorter zoom, hands spinning down', hold=0, creep=0),
 st(597, O(-1.4, -2.2, 1.6), O(.9, 1.0, 1.4), 24, 'surgeonOff', 'W', 'ROWS 16-17 "ANOTHER DOCTOR ASKS him a NASTY QUESTION" (C2, B4): wide, surgeon WHOLE behind the desk mid-sip, the "?" bubble by the lockers, the "?" note on locker 2', travel=57 / 30., hold=10 / 30.),
 st(643, O(.12, -.75, 1.52), O(.05, 1.45, 1.47), 24, 'surgeonOff', 'M', 'ROW 18 "what if it is all in their heads": slow push in on him, cup at his lips (flows into the crash zoom)', travel=36 / 30., hold=0),
 st(652, O(.12, .2, 1.55), O(.05, 1.45, 1.5), 30, 'surgeonOff', 'C', 'ROW 18 POWER "HEADS": crash zoom, impact frame, "?" field, focus lines, sweat, glint', travel=.12, hold=.3),
 st(764, O(.1, -.8, 1.4), O(0, .95, .95), 26, 'trays', 'M', 'ROW 20 "SPLITS them into THREE GROUPS": the same move tilts down with the falling cards into the three trays L-M-R (S3 starts here); via + aim_via = the tower framing on the way (surgeon WHOLE beside the 180-card tower, f~700), one eased travel', travel=103 / 30., hold=.6, via=[O(.1, -.95, 1.47)], aim_via=[O(.3, 1.3, 1.72)]),
]
FC = dict(KEYS.get('faces_ep', {}))
FC.update(dict(
  maskCalm=dict(eyes='happy', brows=[[4, -1, 3], [6, -1, 4]], mouth='smileSmall'),
  maskCheer=dict(eyes='happyXL', brows=[[10, -3, 6], [10, -3, 6]], mouth='smileSmall'),
  sipCalm=dict(eyes='lid', brows=[[2, 1, 1], [3, 1, 2]], mouth='flat'),
  sipSide=dict(eyes='lookSide', brows=[[6, -3, 4], [-2, 4, 0]], mouth='flat', side=1),
  caught=dict(eyes='oval', brows=[[14, -9, 7, 1.2], [14, -9, 7, 1.2]], mouth='wavy', wavyW=20),
  thinking=dict(eyes='lookSide', brows=[[-4, 6, 0, 1.15], [10, -5, 6, 1.15]], mouth='sideways', side=1),
  determined=dict(eyes='squint', brows=[[-6, 8, 0, 1.1], [-6, 8, 0, 1.1]], mouth='flatXL'),
  playful=dict(eyes='happy', brows=[[6, -3, 5], [8, -3, 6]], mouth='smirkXL')))
SG = C(-.75, 6.2, 0)
acts = [
 dict(who='surgeon', at=0, pos=SG, view='34', dir=1, pose=M('sg_s2'), face='k:maskCalm', visible=False, note='v2: he is inside OR 3 (the porthole silhouettes); not in the corridor flight'),
 dict(who='surgeon', at=OF0, visible=False, note='to the office'),
 dict(who='surgeonOff', at=0, pos=O(.05, 1.45, 0), view='34', dir=1, pose=M('so_s2'), face='k:sipCalm', visible=False),
 dict(who='surgeonOff', at=OF0, visible=True, note='ROW 16 mid-sip by the lockers'),
 dict(who='surgeonOff', at=566, face='k:sipSide', note='"asks": eyes slide to the note'),
 dict(who='surgeonOff', at=622, face='k:thinking', note='"what if": thinking'),
 dict(who='surgeonOff', at=650, face='k:caught', note='"HEADS": caught out'),
 dict(who='surgeonOff', at=674, face='k:determined', note='"takes": determined'),
 dict(who='surgeonOff', at=733, face='k:playful', note='"splits": quick, playful dealer'),
]
# v5 (CB at 0:13 "patient outside. on bed the head still half ... laying position is way off and too big"): the gurneys stood END-ON to the lens, so the
# reclined card lay ACROSS them, floating and huge. Now g1-g3 gurneys stand SIDE-ON (corridor.js queue_side, yaw ~-15, head at screen-left), each with a raised
# 35 deg head section + pillow (gurney_back, hinge at gurney-local x GB_H); the card's ground line sits on the mattress top (.87) with its back-bottom on the hinge.
import math
GB_H = float(os.environ.get('GB_H', -.15)); CARD_DX = float(os.environ.get('CARD_DX', -.17)); MAT_Z = .87
QSIDE = [[.4, 4.6, -15], [1.0, 8.4, 90], [-.3, 7.0, -15], [5.0, 9.9, 0], [.7, 11.3, -15]]   # v5: three head lanes (g2 left/mid-far, g1 right/near, g3 between/farthest); slots 1+3 empty gurneys out of the lanes
# v6 (CB 2026-11-17 "we made some test before people ly on bed ... why dont take from it. maybe a top view or side view?"): the bed test (templates/threejs_film/
# _pose_review/bed_poses_v5.png, row 'on the back', '3/4 high' + 'above'). g1-g3 LIE ON THEIR BACKS on FLAT gurneys through the film.js lying path (pose lie_back ->
# lieOf 'back', lie_cam.mjs picks the side / top drawing from the camera), lie_yaw = the gurney's own yaw (head on its pillow, local -x), cast default size.
# The gurneys stand side-on in a row, HEAD-TO-TOE (g2 turned 180) so no head can sit behind another; the camera looks down on them from high 3/4.
# The v5 reclined card + raised gurney back (gurney_back, CARD_DX) are OFF.
QSIDE = [[.15, 5.0, 0], [1.05, 9.7, 90], [.0, 6.45, 180], [-1.05, 9.9, 90], [.55, 8.1, 0]]
# v6 camera: door picture raised to 2.6 m (high 3/4 onto the lying queue, OR doors + portholes + 1994 calendar + CRT kept), queue end C(0,2.6,2.6) 20 mm = the test's '3/4 high'.
# NOTE: tools/film_plan.py bake drops act keys lie_yaw / lie_lift (not in its body whitelist), so film.js lays each body ACROSS the shot (yaw from the camera)
# with head side = dir (GDIR 1 = head screen-left, -1 = right); the side-on gurneys match that within ~15 deg, lift = film.js default (half the head).
QSIDE = eval(os.environ.get('QSIDE', repr(QSIDE)))
CLK_HANG = eval(os.environ.get('CLK_HANG', '[1.0, 6.2, 2.2]'))
GDIR = eval(os.environ.get('GDIR', '[1, -1, 1]'))
BODY_DX = float(os.environ.get('BODY_DX', .06)); LIE_LIFT = os.environ.get('LIE_LIFT')   # v6: body centre along the gurney (local +x = to the feet) so the head lies on the pillow; LIE_LIFT (x body height) overrides film.js default (half the head)
def gpos(slot):
    x, y, yw = QSIDE[slot]; a = math.radians(yw); lx = BODY_DX
    return C(x + lx * math.cos(a), y + lx * math.sin(a), MAT_Z)
for i, g in enumerate(['g1', 'g2', 'g3']):
    sl = [0, 2, 4][i]; la = dict(lie_yaw=QSIDE[sl][2]); la.update(dict(lie_lift=float(LIE_LIFT)) if LIE_LIFT else {})
    acts.append(dict(who=g, at=0, pos=gpos(sl), view='front', dir=GDIR[i], pose='lie_back', face='k:wince', visible=True, note='v6: lies on his back on gurney %d (bed test, film.js lie path), wincing' % (i + 1), **la))
    if g == 'g1' and G1_HIDE: acts.append(dict(who=g, at=0, visible=False, note='v3: out until the pan (its card was cut by the left edge of the door picture f405-419)')); acts.append(dict(who=g, at=466, visible=True))
    acts.append(dict(who=g, at=OF0, visible=False, note='office'))
cast = {k: dict(KEYS['cast'][k], walk_speed=99) for k in ('surgeon', 'surgeonOff', 'g1', 'g2', 'g3')}
shade = dict(KEYS['card_shade'])
def place(kind, extra):
    p = copy.deepcopy(PK[kind]); p['light_over']['card_shade'] = dict(shade); p.update(extra); return p
COp = place('CO', dict(linen_cart_off=True, queue_side=QSIDE, queue_lie=[0, 2, 4], hang_sign_off=True, env_v3=True, rail_queue_off=True, plant_at=[-1.0, -2.2], ph_scale=.82, ph_tool=1.4, ph_dy=-42, ph_clear=True, clock_hang=CLK_HANG, period_right=dict(crt_y=2.0, cal_y=2.1, text='HOUSTON TX'), co_v2=True, out_v2=True, co_v3=True, out_v3=True, troff_nohalo=True, clock=[[375, '8:00'], [505, '11:00'], [522, '2:00']], clock_spin=[[500, 0], [522, 5], [540, 5]], window=[[375, 'morning'], [505, 'noon']],
  portholes='work', ph_front=True, ph_big=True, rhythm=1.1, queue=[[375, 6], [440, 12]], queue_out=160, honk=True, flicker=[440], fog_out=[40, 520]))
COp['light_over'].update(ai=0.64, si=1.0, rich=1.0, veil_color='#e8c878')
DEAL = [735, 741, 747, 753, 759, 765]
NIp = place('NI', dict(env_v3=True, dust=30, lamp_nohalo=True, troff_nohalo=True, dress='night', ni_v2=True, chair=False, note='locker', clock='9:40', clock_spin=[[533, 5], [547, 5], [575, 0]], clock_spin_int=True, trays=True, tray_fill=.15,
  impact=[[650, '#ffffff'], [651, '#fff2a0']], qfield=[[640, 0], [650, 0], [652, 1], [664, 1], [670, 0]], qfield_at=[.05, 1.45, 1.5],
  focus=[[650, 0], [651, 1], [664, 1], [668, 0]], sweat=[[652, 0], [656, 1], [668, 1], [671, 0]], sweat_at=[.3, 1.42, 1.66], glint=[[647, 0], [650, 1], [655, .25], [660, 0]], glint_at=[.14, 1.36, 1.56],
  tower_grow=[[667, 0], [676, 1]], tower=[[667, 0], [668, 1], [724, 1], [725, 0]], tower_at=[.5, 1.3], tower_h=2.0, tower_w=3.0, tower_lift=[[674, 0], [686, .14]], lamp_duck=[[676, 0], [686, 1], [726, 1], [734, 0]],
  deal=dict(**{'from': [.12, 1.2, 1.1]}, frames=[d + 1 for d in DEAL], fly=6), tray_fill_k=[[700, [.15, .15, .15]], [742, [.3, .22, .15]], [754, [.45, .42, .35]], [768, [.6, .6, .6]]]))
NIp['light_over'].update(ai=3.6, fill_i=1.15)   # v3r2: NI fill +20 % (rows 17 + f780 under .31); the lamp glare untouched
NIp.pop('tap', None)   # v2: no soft_arm hand (CB: no human arm); the ask is a speech bubble
NIp['ask_bubble'] = dict(at=[1.55, .25, 2.05], f0=562, f1=612, size=.6, qcolor='#6a3cc0')
F = dict(title='fake-surgery S2 BUILD-OUT: rows 11-20, film 375-777 (render 363-789)', fps=30, size=[1080, 1920], words='words_s2.json', end=END,
  tween=dict(frames=0, face_frames=0, ones=True), auto_view=False, puppet_pkg=['moves', 'cast', '../../../templates/vector2d_characters/code'],
  cast=cast, costume_shade=KEYS['costume_shade'], card_shade=dict(shade), face_shadow=KEYS.get('face_shadow', True), kit3d=dict(pbr=True, relief=True, sky=False, trees=False), faces_ep=FC,
  post=dict(dof=0.0, dust=0, bloom=1, vignette=0.45),
  places=dict(co=COp, of=NIp),
  props=dict(crt=dict(pos=C(1.0, 2.0, 1.13), kind='the CRT on its cart'), calendar=dict(pos=C(1.39, 2.1, 1.75), kind='calendar 1994'), window=dict(pos=C(0, 12, 1.6), kind='the Houston window'),
    portholes=dict(pos=C(1.4, 3.2, 1.55), kind='the OR portholes'), clock=dict(pos=C(*CLK_HANG), kind='the corridor clock (hung)'), note=dict(pos=O(1.72, .4, 1.42), kind='the sticky note'),
    trays=dict(pos=O(0, .62, .78), kind='the three trays'), queue=dict(pos=C(.78, 7.4, .9), kind='the gurney queue with wincing patients'), tower=dict(pos=O(.05, 1.1, 2.0), kind='the 180-card tower')),
  acts=acts, kicks=[dict(at=650, amp=1.0)],
  held3d=[dict(who='surgeonOff', obj='cup', module='sets/hero_props.js', builder='buildCoffeeCup', opts=dict(fill=.85), grip='handle', hand='L', anchor='grip', scale=1.0, when='always', f0=540, f1=651),
          dict(who='surgeonOff', obj='cup_over', module='sets/hero_props.js', builder='buildCoffeeCup', opts=dict(fill=1, overflow=1), grip='handle', hand='L', anchor='grip', scale=1.0, when='always', f0=652, f1=669),
          dict(who='surgeonOff', obj='card', module='sets/hero_props.js', builder='buildFileCard', opts=dict(n=7, doodle=True), grip='point', hand='L', anchor='grip', tip='tip', angle=-30, scale=1.0, when='always', f0=728, f1=789)],
  takes=[dict(id='co', place='co', stations=co), dict(id='of', place='of', stations=of)])
FN = {'': 'film.json', 'out': 'film_out.json', 'in': 'film_in.json'}[VAR]
json.dump(F, open(FN, 'w', encoding='utf-8'), indent=1)
open('OFFSET.txt', 'w').write('S2 = film 12.50-25.90 s = frames 375-777 (+12 handle frames to 789); stretch frame = FILM frame (offset 0). Plan rows 11-20 (script lines 4-6). Takes: co f375-539 (rows 11-15), of f540-789 (rows 16-20), joined on the clock face at 540.\n')
print(FN, 'written: end', END)

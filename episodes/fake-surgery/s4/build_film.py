# S4 board (script lines 10-12, plan rows 31-39, film 42.70-56.10 s = frames 1281-1683): writes film.json + words_s4.json + OFFSET.txt. Plain FILM frames (30 fps).
# Takes: "st" stairwell AF (rows 31-35, f1281-1489; 1281-1289 = handle, HARD CUT on "Two" f1290) and "off" office striped afternoon AF (rows 36-39, f1490-1683).
# Light keys read from sets/PLACE_KEYS.json at every build. S4 keys: sets/stairwell.js (cobweb_xl, knee_leg, speed_lines, dial_at, sign_spin_at) and sets/s4_office.js (s4o).
import json, copy, os
VAR = os.environ.get('S4_VARIANT', '')   # '' main | 'out' (st take runs on to 1497 for the r35->36 dissolve) | 'in' (off take starts at 1482)
KEYS = json.load(open('cast/CAST_KEYS.json', encoding='utf-8')); PK = json.load(open('sets/PLACE_KEYS.json', encoding='utf-8'))
W = json.load(open('voice/words.json', encoding='utf-8'))
WS = [dict(w=('no' if w['w'] == 'know' and abs(w['s'] - 48.72) < .05 else w['w']), s=w['s'], e=w['e']) for w in W]   # plan caption fix: "know better" -> "no better"
json.dump(WS, open('words_s4.json', 'w', encoding='utf-8'), indent=0)
F0, F1 = 1278, 1695   # BUILD-OUT render range (film 1290-1683 + 12 handles)
O, OF = [180, 0, 0], [120, 0, 0]
A = lambda x, y, z: [round(O[0] + x, 3), round(O[1] + y, 3), round(O[2] + z, 3)]
B = lambda x, y, z: [round(OF[0] + x, 3), round(OF[1] + y, 3), round(OF[2] + z, 3)]
def st(at, pos, aim, lens, subject, framing, purpose, **k): return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, **k)
M = lambda n: 'm:../../ep_s4/' + n
T = lambda i: (round((i - .5) * .3, 3), round(i * .16, 3))   # flight 1 tread i: centre y, top z (stairwell.js: RISE .16, RUN .3)
PX0 = -.5   # S4 v4b: the patient's off-frame start (left of the stair-foot rest frame)
LX = 1.25                                                        # the climbing lane on flight 1 (x .2 .. 2)
shade = dict(KEYS['card_shade'])
def place(kind, **over):
    p = copy.deepcopy(PK[kind]); p['light_over']['card_shade'] = dict(shade); p.update(over); return p
# ---------------- stairwell (rows 31-35)
S0 = A(LX, -.45, 0)
KP = A(LX + .02, -.457, .36)   # S4 v2 row 32: the card's line knee at the foot of the stair (stance pose pt_bound@=0)
stp = place('AF', set='stairwell', light_kind='afternoon', env_v3=True, cobweb_xl=1, cobweb=0, cane=True, dial_xyz=[1.98, 2.6, 2.62],
  knee_plasters=dict(at=KP, f=[1336, 1352], s=.095, toward=.14, stack=1, top=1),   # S4 v3 (B7/C7): bigger, the patient WHOLE in a low frame   # S4 v2 (CB: no human leg): three faint cartoon plasters ON the patient card's black line knee (no 3D leg)
  dial_red_at=[[0, 0], [1384, 0], [1392, 1], [1422, 1], [1431, 0]],   # S4 r2: the red zone reads only in row 34
  dial_at=[[0, .92], [1396, .92], [1399, .88], [1408, .1], [1411, .04], [1414, .13], [1418, .09], [1480, .09], [1488, .42], [1493, .6], [1497, .55]],          # red -> green on "down", one wobble in green; BUILD-OUT: 1480-97 the needle sweeps up to the bars' level (.55) = the match dissolve into the chart
  sign_spin_at=[[0, .02], [1352, .02], [1366, 2.6], [1380, 4.1], [1394, 4.45], [1402, 4.5]],                # spins like a propeller in his wake
  speed_lines=[dict(f0=1352, f1=1364, **{'from': A(LX, -.6, .95)}, to=A(LX, .6, 1.45)), dict(f0=1361, f1=1373, **{'from': A(LX, .3, 1.4)}, to=A(LX, 1.5, 1.95)),
               dict(f0=1370, f1=1384, **{'from': A(LX, 1.2, 1.85)}, to=A(LX, 2.45, 2.35))])
stp.pop('dress', None)
stations_st = [   # S4 v2 r2 (CB: "uncontrolled and too fast"): 4 stations, camera v2 picture-speed ease, shorter paths: cane -> knee (small pan) -> one long rise following him to a WIDER dial rest -> slow pull back that is still moving through the dissolve (no rest at 1489)
 st(F0, A(.85, -1.05, 1.06), A(.24, .02, .97), 34, 'cane', 'C', 'ROW 31 HARD CUT on "Two" (f1290; 1278-89 = handle): the old cane on the newel post, cobweb thick as a hammock', hold=0.05),
 st(1324, A(1.05, -2.55, .5), A(1.25, -.45, .9), 24, 'knee', 'F', 'ROW 32 the MAN from the TABLE (S4 v3 B7/C7: NO waist-down crop): low camera, the patient WHOLE head to feet at the foot of the stair, three big cartoon plasters on his line knee (S4 v4b: the camera STOPS on the empty stair foot at 1324, he BOUNDS in from the left in one leap 1327-1330: no edge slice during the move)', travel=1.1, hold=0.35, creep=0.0015),
 st(1418, A(.42, .38, 2.05), A(1.4, 2.5, 2.42), 20, 'dial', 'M', 'ROW 33-34: one long eased rise FOLLOWING him up the flight (three springy strides), rest WIDE on him beside the pain dial: the needle swings red -> green',
    travel=2.35, hold=0.55, creep=0.0015, via=[A(.85, -.75, 1.3)], aim_via=[A(1.3, 1.3, 1.5)]),
 st(1468, A(.55, -3.6, 2.35), A(1.25, .5, 1.2), 20, 'climbers', 'W', 'ROW 35 TWIST (S4 v3 B8): the pull back starts on "groups" and lands EARLY (1468) on the wide: him on top, the three climbers whole in step below; a slow creep through the short dissolve (S4 v4b: travel .9 s, lanes 1.0/.55/.8: each climber crosses the frame edge in <= 3 f)', travel=0.9, hold=0.6, creep=0.0015),
]
# ---------------- office striped afternoon (rows 36-39)
SGP = B(.62, 2.12, 0)   # S4 v3: right of the light box (left of it the ruler crossed his face); the case comes to the desk corner in front of him (C6)   # S4 v2: beside the light box, close enough that his OWN round fist holds the ruler end (no 3D arm)
RE = [120.17, 2.536, 1.557]   # the ruler's right (tip) end at its shelf rest: office LB (-.35, 2.55, 1.25) + restRulerOnBars (cx .02 + L/2, bar top .291 + .0155, 1.4 cm out)
RH = lambda dz: [RE[0], RE[1], round(RE[2] + dz, 3)]
HOV = [[0, .18], [1544, .18], [1552, .075], [1557, .07], [1560, 0]]   # S4 v2: the ruler is in his fist from r36 (held .18 m over the bar tops), lowered onto them 1544-1560
def kf(k, f):
    if f <= k[0][0]: return k[0][1]
    for (fa, a), (fb, b) in zip(k, k[1:]):
        if f <= fb: u = (f - fa) / max(1e-6, fb - fa); return a + (b - a) * u * u * (3 - 2 * u)
    return k[-1][1]
offp = place('AF', set='s4_office', dress='stripes', env_v3=True, charts=[.55, .55, .55], lid=1, blinds=.62,   # S4 v3: case moved left on its shelf (case_dx) so it sits BESIDE his head, not behind it

  s4o=dict(pops=[1508, 1516, 1525], hover=HOV,
           band=[1561, 1572], flash=[1561, 1567], lid_at=[[0, 1], [1636, 1], [1639, .55], [1642, .06], [1643, 0]], puff=[1643, 22], dust=dict(f0=1643, n=30, col='#7a7d84', op=1.0),
           case_col=dict(shell='#aab1ba', cap='#949ba5', handle='#6c727c', foam='#8a909a'),   # S4 v2: light steel grey case (black read as a coffin)
           impact=[1560, 1561], case_fill=dict(at=B(-1.3, 1.85, 2.05), i=3),
           stripes=dict(at=B(-3.6, 1.0, 3.1), aim=B(.0, 2.4, 1.2), i=14, col='#fff2e2'), fill=dict(i=1.3, col='#fff4e4'), hide=['desk_lamp', 'env_mini_fridge', 'env_fridge_*', 'env_microwave*', 'env_styrofoam_cup'], case_dx=[2.1, -1.36, -.676]))   # S4 v3 D5: the desk lamp globe never crosses the lens   # S4 v2: brighter warm fill, no dark veil, no POV glasses
stations_off = [   # S4 v3 (B9, C6, D5): ONE calm take that always holds HIM whole + the light box (+ the case from row 38): no edge cuts, no desk lamp crossing the lens
 st(1490, B(.18, .35, 1.45), B(.15, 2.4, 1.32), 22, 'charts', 'M', 'ROW 36 out of the dissolve: the light-box chart with HIM whole beside it; a slow pull back starts at once', hold=0.0, creep=0, drift=[0, 0, 0]),
 st(1548, B(.18, -.3, 1.45), B(.14, 2.4, 1.25), 20, 'ruler', 'M', 'ROW 36-37: slow eased pull back as the three red bars pop; rest on HIM, the light box and the ruler in his round fist: it lands, IMPACT f1560-61, light band', travel=1.9, hold=0.8, creep=0.0015),
 st(1640, B(.42, .15, 1.3), B(.5, 2.0, 1.12), 22, 'case', 'M', 'ROW 38-39: slow truck left with his look to the light grey scope case BESIDE him; he turns back to the bars on "wasn\'t", the lid shuts, grey dust puff (bright, S5 dissolves in)', travel=2.4, hold=1.0, creep=0.0015),
]
if VAR == 'out': stations_off[0]['at'] = 1498   # the st take runs on to 1497 (only its st frames 1490-1497 are used)
if VAR == 'in': stations_off[0].update(at=1482, hold=0.27)   # the in-handle rests 8 f (no creep), then the same travel from 1490
FC = dict(relief=dict(eyes='lid', brows=[[8, -6, 3, 1.1], [9, -6, 3, 1.1]], mouth='smileSmall'),
          happy=dict(eyes='lidHalf', brows=[[8, -8, 3], [10, -8, 3]], mouth='smirk'), proud=dict(eyes='lid', brows=[[4, -2, 2], [6, -3, 3]], mouth='smileSmall'),
          think=dict(eyes='lookSide', brows=[[-4, 6, 0, 1.15], [8, -3, 5, 1.15]], mouth='sideways', side=-1),
          stunned=dict(eyes='oval', brows=[[14, -4, 7, 1.15], [16, -4, 8, 1.15]], mouth='flatXL'),
          humble=dict(eyes='lidHalf', brows=[[6, 4, 2, 1.1], [7, 4, 2, 1.1]], mouth='smileSmall'))
FC.update(KEYS['faces_ep'])
P = 'patientShorts'
acts = [
 dict(who=P, at=0, visible=False, pos=A(PX0, -.45, 0), view='side', dir=1, pose=M('pt_step'), face='k:springGrin'),
 dict(who=P, at=1324, visible=True, pos=A(PX0, -.45, 0), dir=1, pose=M('pt_bound'), face='k:springGrin', note='S4 v4b: off frame left (the camera rests), bounds in on "man"'),
 dict(who=P, at=1332, pos=S0, linear=True, move_s=0.1, note='S4 v4b: ONE leap into the frame in the bound air phase (crosses the edge in <= 2 f)'),
 dict(who=P, at=1336, pos=S0, dir=-1, pose=M('pt_bound') + '@=0', face='k:springGrin', note='S4 v2 ROW 32: lands at the foot, turns to the stairs (stance held), plasters on his knee'),
 dict(who=P, at=1345, pos=S0, pose=M('pt_bound'), face='k:springGrin', note='ROW 33: at the foot, then three strides'),
]
for f, i in ((1353, 3), (1362, 6), (1371, 9)):   # the card moves only in the air phase (bound g 2..8), 6 f
    y, z = T(i); acts.append(dict(who=P, at=f, pos=A(LX, y, z), linear=True, move_s=0.1, note='stride to tread %s' % i))
y7, z7 = T(9)
acts += [dict(who=P, at=1380, pos=A(LX, y7, z7), pose=M('pt_dial'), face='k:springGrin', note='ROW 34 beside the dial, fist on the rail'),
         dict(who=P, at=1406, face='k:relief', note='"down": relief')]
CL = [('climber1', '#5a7a9a', 1), ('climber2', '#3fc2c8', 1), ('climber3', '#7a4aa8', 2)]   # r2: staged on the flight (below the dial rest's frame), revealed by the pull back   # S4 v2: one tread lower, off frame until the pull back
LN = {P: LX, 'climber1': 1.0, 'climber2': .55, 'climber3': .8}   # spread over the tread width
for who, col, i in CL:
    y, z = T(i); acts.append(dict(who=who, at=0, visible=False, pos=A(LX, y, z), view='side', dir=-1, pose=M('pt_dial'), face='k:' + ('springGrin' if who == 'climber1' else 'happy' if who == 'climber2' else 'proud')))
    acts[-1]['pos'] = A(LN[who], y, z); acts.append(dict(who=who, at=1420, visible=True, pos=A(LN[who], y, z), pose=M('cl_march') + '@=0')); acts.append(dict(who=who, at=1426, pose=M('cl_march')))   # S4 v2 r2: staged on the flight, step IN PLACE (no slide)   # S4 v2: there (off frame) before the reveal, no pop-in
acts.append(dict(who=P, at=1426, pos=A(LX, y7, z7), pose=M('pt_step'), face='k:springGrin', note='ROW 35: climbs on, the climbers in step behind him'))
for k in range(5):
    fk = 1428 + k * 12
    for who, i0 in [(P, 9)]:   # S4 v2 r2: only the patient climbs on (moves with his lifted foot); the climbers step in place
        i = i0 + k + 1; y, z = T(i) if i <= 9 else (round(2.85 + (i - 10) * .3, 3), 1.6)
        acts.append(dict(who=who, at=fk + 1, pos=A(LN[who], y, z), linear=True, move_s=0.2))   # moves with the lifted foot only (6 f)
for who in [P] + [c[0] for c in CL]: acts.append(dict(who=who, at=1498 if VAR == 'out' else 1490, visible=False))
acts += [dict(who='surgeonOff', at=0, visible=False, pos=SGP, view='34', dir=-1, pose=M('pt_dial'), face='k:think'),
         dict(who='surgeonOff', at=1482, visible=True, pos=SGP, pose=M('sg_ruler'), face='k:think', note='ROW 36: beside the light box, the ruler ready'),
         dict(who='surgeonOff', at=1558, face='k:stunned', note='ROW 37 "height": quietly stunned'),
         dict(who='surgeonOff', at=1584, pose=M('pt_dial'), face='k:think', note='ROW 38 "SEE": he turns to the scope case beside him (S4 v3 C6)'),
         dict(who='surgeonOff', at=1629, face='k:stunned', note='ROW 39 "wasn\'t": turns back to the bars, the penny drops (S4 v3 C6)'), dict(who='surgeonOff', at=1650, face='k:humble')]
cast = {k: dict(KEYS['cast'][k], walk_speed=99) for k in (P, 'climber1', 'climber2', 'climber3', 'surgeonOff')}
held3d = [dict(who=who, obj='wristband', module='props_s4.js', builder='buildWristband', opts=dict(color=col), grip='point', hand='L', anchor='grip', scale=1.0, when='always', f0=1420, f1=1489) for who, col, _ in CL]
RE_ = lambda f: [RE[0], RE[1], round(RE[2] + kf(HOV, f), 4)]
hand_at = [dict(who='surgeonOff', f0=f, f1=f, at=RE_(f)) for f in range(1482, 1561)] + [dict(who='surgeonOff', f0=1561, f1=1583, at=RE_(1561))]   # S4 v3: lets go when he turns to the case   # S4 v2: HIS round fist on the ruler end (no 3D arm)
props = dict(cane=dict(pos=A(.23, .02, 1.0), kind='the old cane + cobweb'), knee=dict(pos=A(LX, -.62, .55), kind='the healed knee'), sign=dict(pos=A(1.99, -.45, 1.78), kind='USE HANDRAIL sign'),
             dial=dict(pos=A(1.98, 2.05, 2.35), kind='the pain dial'), charts=dict(pos=B(-.35, 2.55, 1.5), kind='three pain charts'), ruler=dict(pos=B(-.33, 2.54, 1.52), kind='the ruler on the bars'),
             case=dict(pos=B(-1.5, 2.43, 1.45), kind='the scope case'))
FILM = dict(title='fake-surgery S4 THE BOARD: rows 31-39 (film 1281-1683)', fps=30, size=[1080, 1920], words='words_s4.json', start=F0, end=F1 + 1,
  tween=dict(frames=0, face_frames=0, ones=True), auto_view=False, puppet_pkg=['moves', '.', 'cast', '../../../templates/vector2d_characters/code'],
  camera=dict(v2=True), cast=cast, costume_shade=KEYS['costume_shade'], card_shade=dict(shade), face_shadow=KEYS.get('face_shadow', True), faces_ep=FC,
  kit3d=dict(pbr=True, relief=True, sky=False, trees=False), post=dict(dof=0.0, dust=0, bloom=1, vignette=0.45),
  places=dict(st=stp, off=offp), props=props, acts=acts, held3d=held3d, hand_at=hand_at, kicks=[dict(at=1560, amp=1.0)],
  takes=[dict(id='st', place='st', stations=[dict(stations_st[0], at=0)] + stations_st), dict(id='off', place='off', stations=stations_off)])
json.dump(FILM, open({'out': 'film_out.json', 'in': 'film_in.json'}.get(VAR, 'film.json'), 'w', encoding='utf-8'), indent=1)
if VAR: raise SystemExit(print('variant', VAR, 'written'))
open('OFFSET.txt', 'w').write('S4 = film 42.70-56.10 s = frames 1281-1683, plan rows 31-39 (script lines 10-12). film.json frames are plain FILM frames (no offset). '
  'Takes: st 1281-1489 (stairwell AF, rows 31-35; 1281-1289 handle, HARD CUT on "Two" f1290), off 1490-1683 (office stripes AF, rows 36-39; plain cut at 1490 on the gate, match dissolve dial->chart in the build-out).\n')
print('film.json written')

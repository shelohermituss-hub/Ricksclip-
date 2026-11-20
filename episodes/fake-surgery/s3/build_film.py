# S3 THE BOARD (fake-surgery): script lines 7-9, plan rows 21-30, FILM 25.90-42.70 s = frames 777-1281 (stretch frame = FILM frame, no offset).
# Places: office NI (rows 21-23), corridor pre-op bay CO (rows 24-26 + the join to the OR door), OR 3 morning OR (rows 27-30; a dry OR and the flooded OR
# of the EXTREME r29, switched on the SPLOOSH impact frame). Every place uses set "s3_wrap" (sets/s3_wrap.js, owned by S3) over the owner's base set,
# so office.js / corridor.js / or_room.js are imported, never edited. Light from sets/PLACE_KEYS.json, re-read every run.
import json, copy, math, os
# v3 (FIX_BRIEF_v3): two 12 f DISSOLVES baked in final/make_final.py from handle frames: J1 pre-op -> door push, J2 door push -> OR 3.
# S3_VARIANT='in' = the later takes start 6 f early (handles in_), 'out' = the earlier takes run 6 f longer (handles out_).
VAR = os.environ.get('S3_VARIANT', '')
J1, J2 = 1050, 1100
DV = {'': 0, 'in': -6, 'out': 6}[VAR]
T1, T2 = J1 + DV, J2 + DV
KEYS = json.load(open('cast/CAST_KEYS.json', encoding='utf-8'))
PK = json.load(open('sets/PLACE_KEYS.json', encoding='utf-8'))
W = json.load(open('voice/words.json', encoding='utf-8'))
F0, F1 = 765, 1301   # BUILD-OUT: film 777-1289 + 12 handle frames each side
json.dump([dict(w=w['w'], s=w['s'], e=w['e']) for w in W if 25.0 <= w['s'] < 43.2], open('words_s3.json', 'w', encoding='utf-8'), indent=0)
shade = dict(KEYS['card_shade'])
def place(kind, s3, **extra):
    p = copy.deepcopy(PK[kind]); p['light_over']['card_shade'] = dict(shade); p['base'] = p['set']; p['set'] = 's3_wrap'; p.update(extra); p['s3'] = s3; return p
O, C = 120.0, 60.0
ow = lambda x, y, z: [round(x + O, 3), y, z]
cw = lambda x, y, z: [round(x + C, 3), y, z]
# ---- office night (rows 21-23) ----
off = place('NI', dict(hide=['env_file_cabinet_tall'], recolor=[dict(names=['desk_top'], color='#a8a090')], pop_peak=2.4, pop_settle=2.0, cards=dict(color='#a89a7c', tab='#2c3c6a', top='#b8ab8c'), pops=[dict(kind='scrape', f=793), dict(kind='rinse', f=841), dict(kind='trick', f=879)],
                       note=dict(locker=ow(1.69, 0.40, 1.42), yaw=-90, tray='trick', f_peel=887, f_stick=902)), note='none', trays=True, tray_fill=0.6, clock='9:40', chair=False, ni_v2=True, env_v3=True, dust=20)
# ---- pre-op bay, morning (rows 24-26) ----
TB = cw(-3.95, 8.42, 0.772)
TICK = [round(TB[0] - 0.075, 3), round(TB[1] - 0.068, 3), 0.774]
pre = place('CO', dict(clip=dict(at=TB, yaw=0, tick=[[0, 0], [996, 0], [1004, 1]]),
                       hide=['porthole_glass', 'porthole_glint', 'bay_far_wall_bumper_rail'],
                       shift=[dict(names=['preop_chair'], d=[-0.5, -1.5, 0.0])],   # v4b: the armchair out of the push line (its back covered the table + form), into the corner by the window   # v4: the far-wall bumper rail ran through g2's card
                       recolor=[dict(names=['bay_window_soft_sky'], color='#9fb2b8'), dict(names=['bay_window_sheer'], color='#d8d2c4')],   # v3 A5: the bay window not blown white
                         # v2: no glass haze on the door push (CB 36 s)
                       door_open=dict(f0=1060, f1=1082, ang=82, vest=True),   # v2: the doors swing open in front of the gurney, the camera follows it through
                       gurney=dict(path=[[0, cw(-0.6, 6.2, 0)], [1040, cw(-0.6, 6.2, 0)], [1052, cw(-0.55, 5.95, 0)], [1066, cw(-0.2, 5.25, 0)], [1080, cw(0.3, 4.4, 0)], [1094, cw(0.95, 3.6, 0)], [1108, cw(1.7, 3.25, 0)], [1122, cw(2.6, 3.2, 0)]], yaw=0)),
          preop='morning', curtain=0.45, queue=0, in_use=True, portholes='lit', clock='8:00', co_v2=True, co_v3=True, env_v3=True)
pre['light_over'].update(ai=0.64, si=1.0, rich=1.0, veil_color='#e8c878')   # BUILD-OUT: S2's corridor colour keys (sat fix), same paint as S2 rows 11-15
# ---- OR 3 morning (rows 27-30): S1's light keys (knee_v2, lamp) so the OR rhymes with the hook ----
KNEE_NAMES = ['patient_leg_drape_tent', 'patient_kneecap_drape', 'knee_face_v3']   # BUILD-OUT: S1 round 5 knee_v3 parts (dots + plasters ride on knee_face_v3)
HIDE = ['monitor_crt_shell', 'monitor_bezel', 'monitor_screen', 'monitor_power_led', 'monitor_knob', 'monitor_neck']
ors = dict(hide=HIDE, shift=[dict(names=['iv_pole', 'iv_base_leg', 'iv_hook_bar', 'saline_bag', 'saline_tube'], d=[0.55, 0.5, 0.0])],   # v4: the IV pole + saline bags off the nurse's face (behind her, right)
           crt=dict(at=[0.42, 2.40, 1.13], scale=1.5, screen='tape'), vcr=dict(at=[0.42, 2.30, 1.67], scale=1.3),
           tape=dict(at=[0.22, 2.17, 1.80], scale=1.2), pump=dict(names=KNEE_NAMES, f0=1169, f1=1189, period=10, amp=0.06))
SG, NR, PTR = [-0.08, 1.2, 0.36], [1.0, 1.7, 0.32], [-0.6, 0.78, 0.9]   # nurse moved right of the CRT line (S3: the inside-CRT view looks past her); S1 round 5 cast spots: surgeon on a 36 cm step, nurse on an 32 cm step, patient card behind the leg tent
KNEE = [-0.04, 0.41, 1.37]   # S1 round 5 knee window centre
ORK = dict(knee_v2=True, knee={'dots': 3, 'plasters': 3}, knee_track=[[0, 3, 3]], knee_v3=dict(at=[-0.04, 0.47, 1.31], hip=[-0.32, 0.47, 0.93], foot=[0.25, 0.47, 0.9], face=[0.0, -0.7, 0.72], win=0.13, ball=0.092, dx=0.04, dot=0.0135, dome=0.022, pw=[0.039, 0.08, 0.035, 0.076, 0.023, 0.023], w=0.11), knee_crisp=dict(back='#24488a'),
           leg_drape=dict(color='#5f8fd0', fold='#3e6aa8', far_y=0.76), knee_win='thin', lie_body=dict(r=0.13, zs=0.5), steps=[SG, NR], knee_tapes='strips',
           lamp_angle=0.34, lamp_i=14, knee_tone='#857b72', drape_soft=True, lamp_pos=[0.55, -0.15, 2.35], lamp_at=[-0.05, 0.6, 1.5], monitor='off', dust=0,
           env_v3=True, zzz_v3=dict(head=[-0.92, 0.78, 2.02], toLens=0.6, f0=T2 - 30, f1=1301))   # v3: shared floating Zs on the drawn card head (A3)
orw = place('OR', dict(ors, jug_flood=dict(at=[0.3, 0.95], f0=1215, f1=1260, depth=0.3, size=1.1, clogs=[[0.75, 0.6], [1.2, 0.85]], fall=[0.32, 1.02, 1.55]), rattle=dict(f0=1226, n=22)),
            **ORK, water_floor=0, impact=[[1226, '#e8fbff'], [1227, '#ffffff']])   # v3: ONE OR place, shared water_fx jug_flood from the held jug's spout (A2)
def st(at, pos, aim, lens, subject, framing, purpose, hold=0.4, travel=None, creep=None, via=None):
    d = dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold)
    if creep is not None: d['creep'] = creep; d['drift'] = [0, 0, 0]
    if via: d['via'] = via[0]; d['aim_via'] = via[1]
    if travel: d['travel'] = travel
    return d
# v2 CAMERA (CB: "camera just move quick why? like zig zag"): one flowing take per place, eased travels that follow the action, rests that creep.
O4P, O4A, C4 = [-0.1, -2.45, 1.95], [0.1, 1.1, 1.45], 0.0025
PRE_P, PRE_A = cw(-2.22, 7.09, 1.5), cw(-3.9, 7.7, 1.12)   # v4b: a straight push on the 927 axis (v4 swung to cw(-2.9,8.65): g2 slid out right, g1 in left, the surgeon + patient sliced 979-1046)
PRE2_P, PRE2_A = cw(-2.26, 7.14, 1.52), cw(-3.9, 7.72, 1.16)
DOOR0_P, DOOR0_A = cw(-1.0, 6.75, 1.6), cw(1.2, 3.6, 1.2)
DOOR1_P, DOOR1_A = cw(1.05, 4.05, 1.5), cw(2.7, 3.15, 1.3)
CRT_P, CRT_A, CRT_L = [-0.2, -1.6, 1.8], [-0.18, 2.4, 1.38], 18   # v4: wider + back so the reclined patient and the surgeon are whole (was [0.3,-1.0,1.75] 24 mm)
takes = [
 dict(id='off', place='off', stations=[
   st(765, ow(0.1, -0.8, 1.4), ow(0.0, 0.95, 0.95), 26, 'trays', 'M', 'JOIN S2->S3: S2 last office station, held still over the join exactly as S2 holds it (the first take bakes from frame 0, so no slide)', 0.5, creep=0.0),
   st(904, ow(1.02, -1.25, 1.45), ow(1.08, 0.85, 1.12), 24, 'trays', 'M', 'ROWS 21-23 ONE flowing move with the walking surgeon: back and right over the three trays (each "60" pops in scene, locker 2 in frame), then in on tray 3 as he sticks the "?" and winks', 0.6, 4.1, via=([ow(0.6, -1.05, 1.42)], [ow(0.6, 0.85, 1.02)]))]),
 dict(id='pre', place='pre', stations=[
   st(927, cw(-1.7, 6.9, 1.5), cw(-3.6, 7.98, 1.05), 18, 'patient', 'W', 'ROW 24 HARD CUT (new day) pre-op bay: the patient signs, two others with clipboards, the surgeon waits across the table with the envelope', 0.9),
   st(1005, PRE_P, PRE_A, 20, 'clipboard', 'M', 'ROW 25 push: the form ("MAY BE PRETEND SURGERY"), the patient and the surgeon side by side, both heads whole, no window behind them (A5)', 0.6, 1.85),
   st(1062, PRE2_P, PRE2_A, 20, 'surgeon', 'M', 'ROW 26 slow drift right: the envelope into the surgeon pocket, the patient peeks (v3: still moving at the 12 f dissolve J1)', 0.0, 1.3)]),
 dict(id='door', place='pre', stations=[
   st(T1, DOOR0_P, DOOR0_A, 24, 'door', 'W', 'JOIN r26->27 (v3: 12 f dissolve J1 on the motion): behind the rolling draped gurney, the OR 3 doors ahead', 0.05),
   st(1114, DOOR1_P, DOOR1_A, 24, 'door', 'M', 'v3 A6: follow the gurney slowly (2 s) through the swinging doors; 12 f dissolve J2 into OR 3 on the forward motion', 0.0, 2.0)]),
 dict(id='or', place='orw', stations=[
   st(T2, CRT_P, CRT_A, CRT_L, 'crt', 'M', 'ROW 27 (v3 C5): the CRT smaller in frame, VCR PLAY + the tape "REAL ONE" readable, the surgeon at the knee beside it; a slow push continues the door motion', 1.25, creep=0.0012),
   st(1210, O4P, O4A, 21, 'surgeon', 'W', 'ROWS 28-29 one long pull back: the surgeon wiggles the plastered knee, then the jug HIGH, the pour floods the OR floor (water_fx jug_flood), the nurse beside, the ko patient', 0.5, 2.3, creep=C4),
   st(1290, [-1.2, -1.2, 1.72], [-0.32, 0.87, 1.48], 22, 'patient', 'M', 'ROW 30 "sounds real": push in on the knocked-out patient, his tongue-out face melts into a dreamy smile, floating Zs + a heart', 0.3, 1.5)]),
]
FC = dict(KEYS['faces_ep'],
  offPleased=dict(eyes='lidHalf', brows=[[2, -2, 1, 1.1], [4, -3, 2, 1.1]], mouth='smirkXL'), offPoint=dict(eyes='oval', brows=[[6, -4, 4, 1.1], [6, -4, 4, 1.1]], mouth='smileSmall'),
  offSly=dict(eyes='lookSide', brows=[[-3, 4, 0, 1.15], [10, -4, 6, 1.15]], mouth='smirkXL'), offWink=dict(eyes=['happy', 'oval'], brows=[[6, -2, 4, 1.1], [10, -4, 6, 1.1]], mouth='smirkXL'),
  ptWary=dict(eyes='lidHalf', brows=[[6, -6, 3, 1.1], [6, -6, 3, 1.1]], mouth='wavy', wavyW=16), ptCurious=dict(eyes='lookSide', brows=[[10, -6, 6, 1.15], [10, -6, 6, 1.15]], mouth='o'),
  sgBland=dict(eyes='lidHalf', brows=[[-1, 2, 0, 1.1], [-1, 2, 0, 1.1]], mouth='flat'), sgEarnest=dict(eyes='oval', brows=[[8, -4, 5, 1.1], [8, -4, 5, 1.1]], mouth='flat'),
  sgShow=dict(eyes='happy', brows=[[10, -4, 6, 1.1], [10, -4, 6, 1.1]], mouth='flat'), nrDeadpan=dict(eyes='lidHalf', brows=[[-2, 3, 0, 1.15], [12, -5, 7, 1.15]], mouth='flat'),
  ptSmile=dict(eyes='happy', brows=[[8, -4, 5, 1.15], [8, -4, 5, 1.15]], mouth='smileSmall'),
  koSleep=dict(eyes=['spiral', 'x'], brows=None, mouth='tongue', fx=['stars']), koDream=dict(eyes=['spiral', 'x'], brows=None, mouth='smileSmall', fx=['heart']),
  exWait=dict(eyes='lidHalf', brows=[[-2, 3, 0, 1.1], [-2, 3, 0, 1.1]], mouth='flat'))
M = lambda n: 'm:../../ep_s3/' + n
SO_S2 = ow(0.05, 1.45, 0.0)   # S2's last spot (join)
SO0, SOL, SO1 = ow(0.95, 1.75, 0.0), ow(1.18, 0.45, 0.0), ow(1.28, 0.28, 0.0)   # v4: SOL in front of locker 2 (off locker 3), SO1 in front of the desk corner (v3 ow(1.1,0.9) stood in the desk pedestal / top)
PT_PRE = cw(-3.92, 8.0, 0.0)   # v4: 8 cm off the bay window sill; g1 cw(-4.02,6.6) (v3 cw(-3.2,8.4) stood in the push lens + the side table), g2 cw(-4.24,8.62) (v3 cw(-4.3,8.6) in the window dado)
SG_PRE = cw(-3.65, 7.25, 0.0)   # v2: the surgeon waits across the side table from 927 (no pop in, no hides)
acts = [
 dict(who='surgeonOff', at=0, pos=SO_S2, view='34', dir=-1, pose=M('so_s3'), face='k:offPleased', note='row 21: by the lockers, a card in the near fist, proud of his three trays'),
 dict(who='surgeonOff', at=790, pos=SO0, linear=True, move_s=1.3, note='after the join: strolls from the S2 spot to the desk end, beside tray 3'),
 dict(who='surgeonOff', at=793, face='k:offPoint', note='"60": points at the scraper label as it pops'),
 dict(who='surgeonOff', at=841, face='k:offPoint'), dict(who='surgeonOff', at=860, face='k:offPleased'),
 dict(who='surgeonOff', at=832, pos=ow(1.38, 1.66, 0.0), linear=True, move_s=0.5, note='strolls behind the bin round the desk end (slow: no foot slide)'),
 dict(who='surgeonOff', at=848, pos=SOL, linear=True, move_s=1.03, note='to locker 2'),
 dict(who='surgeonOff', at=879, view='34', dir=1, face='k:offSly', note='"60" no. 3: turns to locker 2, peels the "?" note'),
 dict(who='surgeonOff', at=888, view='34', dir=-1),
 dict(who='surgeonOff', at=890, pos=SO1, linear=True, move_s=0.4, note='two steps to tray 3 with the note, during the push-in'),
 dict(who='surgeonOff', at=902, face='k:offWink', note='"trick": sticks it on tray 3 and winks to the lens'),
 dict(who='surgeonOff', at=927, visible=False),
 dict(who='patient', at=0, pos=PT_PRE, view='34', dir=-1, pose=M('pt_s3'), face='k:ptWary', visible=False),
 dict(who='patient', at=927, visible=True, note='row 24: cap, gown, cane; signs the form on the side table, wary but willing'),
 dict(who='patient', at=1046, face='k:ptCurious', note='"told": leans to peek at the envelope'), dict(who='patient', at=1056, face='k:ptWary'),
 dict(who='patient', at=T2, visible=False),
 dict(who='g1', at=0, pos=cw(-4.02, 6.6, 0.0), view='34', dir=1, pose=M('ex_s3a'), face='k:exWait', visible=False), dict(who='g1', at=927, visible=True),
 dict(who='g2', at=0, pos=cw(-4.24, 8.62, 0.0), view='34', dir=1, pose=M('ex_s3b'), face='k:exWait', visible=False), dict(who='g2', at=927, visible=True),
 dict(who='surgeon', at=0, pos=SG_PRE, view='34', dir=-1, pose=M('sg_s3'), face='k:sgBland', visible=False),
 dict(who='surgeon', at=927, visible=True, note='rows 24-26: waits across the table with the envelope; on nobody it goes into his pocket, bland'),
 dict(who='surgeon', at=T2 - 3, pos=SG, move_s=0.03, note='v4: jumps to the OR spot 2 f before the OR take (off the door shot), no glide'),
 dict(who='surgeon', at=T2, visible=True, view='34', dir=-1, face='k:sgEarnest', note='OR: at the knee'),
 dict(who='surgeon', at=1194, view='34', dir=1, note='"splashes": turns to the steel bowl beside the nurse, the jug rises HIGH'),
 dict(who='surgeon', at=1201, face='k:sgShow', note='"splashes": showman, jug high'), dict(who='surgeon', at=1252, face='k:sgBland'),
 dict(who='nurse', at=0, pos=NR, view='34', dir=1, pose=M('nr_s3'), face='k:nrDeadpan', visible=False), dict(who='nurse', at=T2, visible=True),
 dict(who='patientR', at=0, pos=PTR, view='34', dir=1, pose=M('ptr_s3'), face='k:koSleep', visible=False), dict(who='patientR', at=T2, visible=True),
 dict(who='patientR', at=1252, face='k:koDream', note='sounds: still knocked out, the tongue flop melts into a dreamy smile, zZ + a heart'),
]
cast = {k: dict(KEYS['cast'][k], walk_speed=999) for k in ('surgeonOff', 'surgeon', 'nurse', 'patient', 'g1', 'g2')}
cast['patientR'] = dict(KEYS['cast']['patient'], walk_speed=999)
cast['g1'] = dict(KEYS['cast']['g3'], walk_speed=999)   # v3 D7: lilac-stripe gown (g1's mint read as a second green surgeon)
HPm = 'sets/hero_props.js'
held = [
 dict(who='surgeonOff', obj='card', module=HPm, builder='buildFileCard', opts={}, grip='point', hand='L', anchor='grip', tip='tip', angle=-60, scale=1.2, when='always', f0=765, f1=878),
 dict(who='surgeonOff', obj='note', module=HPm, builder='buildStickyNote', opts={'size': 0.076}, grip='point', hand='L', anchor='grip', tip='tip', angle=0, scale=1.3, when='always', f0=887, f1=901),
 dict(who='patient', obj='pen', module=HPm, builder='buildPen', opts={}, grip='point', hand='L', anchor='grip', tip='tip', angle=-110, scale=1.4, when='always', f0=927, f1=T2 - 1,
      tip_at=[dict(f0=941, f1=980, at='clip_sign_line'), dict(f0=990, f1=1012, at='clip_tick_box')]),
 dict(who='patient', obj='cane', module=HPm, builder='buildCane', opts={}, grip='hang', hand='R', anchor='grip', scale=1.0, when='always', f0=927, f1=T2 - 1),
 dict(who='g1', obj='clipboard', module=HPm, builder='buildClipboard', opts={'tick': 1}, grip='raise', hand='L', anchor='grip', scale=1.0, when='always', f0=927, f1=T2 - 1),
 dict(who='g2', obj='clipboard', module=HPm, builder='buildClipboard', opts={'tick': 0}, grip='raise', hand='L', anchor='grip', scale=1.0, when='always', f0=927, f1=T2 - 1),
 dict(who='surgeon', obj='envelope', module=HPm, builder='buildEnvelope', opts={}, grip='raise', hand='L', anchor='grip', scale=0.8, when='always', f0=927, f1=T2 - 1),
 dict(who='surgeon', obj='jug', module=HPm, builder='buildJug', opts={'pour': 0}, grip='handle', hand='L', anchor='grip', tip='tip', scale=1.3, when='always', f0=1192, f1=1214),
 dict(who='surgeon', obj='jug_pour', module=HPm, builder='buildJug', opts={'pour': 0.9}, grip='handle', hand='L', anchor='grip', tip='tip', scale=1.3, when='always', f0=1215, f1=1240),
]
FILM = dict(title='fake-surgery S3 THE BOARD: rows 21-30 (film 777-1281)', fps=30, size=[1080, 1920], words='words_s3.json', end=F1 + 1,
  tween=dict(frames=0, face_frames=0, ones=True), auto_view=False, puppet_pkg=['moves', 'cast', '../../../templates/vector2d_characters/code'],
  cast=cast, costume_shade=KEYS['costume_shade'], card_shade=shade, face_shadow=KEYS.get('face_shadow', True), kit3d=dict(pbr=True, relief=True, sky=False, trees=False), faces_ep=FC,
  post=dict(dof=0.0, dust=0, bloom=1, vignette=0.45), places=dict(off=off, pre=pre, orw=orw),
  props=dict(trays=dict(pos=ow(0, 0.62, 0.8), kind='the three trays'), clipboard=dict(pos=TB, kind='the consent form'), crt=dict(pos=[0.42, 2.1, 1.43], kind='the CRT'), knee=dict(pos=KNEE, kind='the knee')),
  acts=acts, held3d=held, hand_at=[dict(who='surgeon', f0=T2, f1=1191, at=[KNEE[0], KNEE[1] - 0.02, KNEE[2] + 0.05])], takes=takes, kicks=[dict(at=1226, amp=1.4)])
FN = {'': 'film.json', 'in': 'film_in.json', 'out': 'film_out.json'}[VAR]
json.dump(FILM, open(FN, 'w', encoding='utf-8'), indent=1)
open('OFFSET.txt', 'w').write('S3 = film 25.90-42.70 s = frames 777-1281; stretch frame = FILM frame (no offset). Plan rows 21-30 (script lines 7-9). Takes: off f765-926 (rows 21-23, NI), pre f927-1086 (rows 24-26, CO; HARD CUT at 927 = 30.9 s), orin f1087-1123 + crt f1124-1225 (rows 27-29, OR), flood f1226-1293 (rows 29-30, OR flooded).\n')
print('film.json written')

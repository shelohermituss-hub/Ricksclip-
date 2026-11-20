# S1 (film 0.00-12.50 s = frames 0-374, plan rows 1-10, script lines 1-3). Writes film.json + words_s1.json + OFFSET.txt. Stretch frame = FILM frame.
# ONE take in OR 3, light kind OR (sets/PLACE_KEYS.json, re-read at every build). S1 keys in sets/or_room.js (knee_v2, knee_track, lamp_angle, drape_soft,
# power, impact, tiks, scope_view). Moves: moves/ep_s1.mjs (sg_s1, nr_s1, pt_s1).
import json, copy, sys
KEYS = json.load(open('cast/CAST_KEYS.json', encoding='utf-8'))
PK = json.load(open('sets/PLACE_KEYS.json', encoding='utf-8'))
W = json.load(open('voice/words.json', encoding='utf-8'))
END = 387   # film 0-374 + 12 handle frames
FIX = {'Doctor,': (10.12, 10.75), 'you': (11.10, 11.28), 'operation.': (11.66, 12.25)}   # loudness curve of voice.wav (PICTURE_PLAN "Known word-time faults")
ws = []
for w in W:
    if w['s'] >= END / 30: break
    s, e = FIX.get(w['w'], (w['s'], w['e'])) if 9.5 < w['s'] < 12.3 else (w['s'], w['e'])
    ws.append(dict(w=w['w'], s=s, e=e))
json.dump(ws, open('words_s1.json', 'w', encoding='utf-8'), indent=0)
def st(at, pos, aim, lens, subject, framing, purpose, **k): return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, **k)
M = lambda n: 'm:../../ep_s1/' + n
KNEE = [-0.04, 0.41, 1.37]   # r5: C0 of the small window on the top/front of the kneecap (ball .085, face [0,-.7,.72])
KNEE_R4 = [0.10, 0.60, 1.32]   # r4: the knee_v3 window centre C0 of the HIGH bent knee (at [.08,.74,1.30], face [.1,-.8,.55], knee_scale 1.1, ball .155)
KNEE_R3 = [0.29, 0.69, 1.23]   # round 2: the knee_v3 kneecap face (knee joint [.25, .72, 1.22] + face normal * .07)
SG = [-0.08, 1.08, 0.36]; NR = [0.32, 1.45, 0.32]; PT = [-0.6, 0.78, 0.9]   # r4: surgeon on a 30 cm step stool (nurse 18 cm) behind the table, so his whole face stays above the high knee; PT = [-0.5, 0.57, 0.92]   # round 2: surgeon close at the table side behind the knee; nurse behind his right, in frame; patient card lifted onto the head section
TRAY = [0.72, -0.12, 0.95]
SCOPE_CAM = dict(pos=[0.62, -0.08, 1.1], aim=[-0.08, 0.85, 1.36], fade=True)   # build-out: 10 mm wide scope lens, patient + surgeon + nurse whole
CAM0_POS, CAM0_AIM, CAM0_LENS = [-0.55, -1.95, 1.32], [-0.48, 1.2, 1.4], 24
SPL_POS, SPL_AIM = [0.6, -1.7, 1.62], [-0.45, 0.78, 1.5]   # v4b: further back + aim right: the nurse (right) and patient (left) whole through the splash travel (was [0.5,-1.25,1.62] aim x -0.62)
KN_POS, KN_AIM = [0.42, -0.85, 1.8], [-0.12, 0.62, 1.7]   # v4: re-aimed left + 19 mm so the patient (left) and nurse (right) are whole
KN_LENS = 19
KN2_POS, KN2_LENS = [0.41, -0.83, 1.79], 19.6   # v4: crash zoom 19 -> 19.6 + aim 5 cm left, no side drift (was 24 -> 31: cut both)
TRAY_F, TRAY_TR, TRAY_H = 228, 1.4, 0.9
NR_POS, NR_AIM, NR_LENS, NR_TR, NR_H, NR_DRIFT = [0.42, 0.05, 1.9], [0.11, 1.3, 1.72], 18, 1.4, 1.5, [-0.01, -0.03, 0.0]
DOOR_TR, DOOR_VIA, DOOR_VAIM = 1.37, [[0.95, -0.15, 1.95], [1.3, 1.5, 1.75]], [[0.25, 1.3, 1.7], [1.0, 2.6, 1.68]]   # v4b: back off first (team small, whole), then swing to the door mid-move (was via [0.95,0.95,1.85] past the team: half heads)
cam = [   # S1 v3 (FIX_BRIEF_v3: B1 patient head whole at f0 + splash, B2 surgeon head whole in the knee view, A4 the nurse two-shot on her line, B3 the door flight passes the team). Impact f156 + f386 porthole pose kept.
 st(0, CAM0_POS, CAM0_AIM, CAM0_LENS, 'surgeon', 'M', 'ROWS 1-3 FRAME 0: from the NEAR SIDE, eye level with the knee: the bent leg V, the kneecap window with the 3 dots, the surgeon behind on his step, the nurse behind his right, the knocked-out patient WHOLE on the head section at frame left with his Zs floating up. Slow pull-back.', hold=1.33, creep=0.007, drift=[-0.03, -0.12, 0.0], drift_aim=1.0),
 st(142, KN_POS, KN_AIM, KN_LENS, 'knee', 'M', 'ROWS 3-5 one 3.4 s eased move round the table end to the front-right past the SPLASH (bulb, see-through water crown, foam, spray; the patient out cold WHOLE at the left) to a MEDIUM knee view: drape window + plasters read, the surgeon WHOLE above it', travel=3.4, via=[SPL_POS], aim_via=[SPL_AIM], hold=0.27, creep=0.0015, drift=[0.06, 0.0, 0.0]),
 st(156, KN2_POS, [KN_AIM[0] - 0.05, KN_AIM[1], KN_AIM[2]], KN2_LENS, 'knee', 'C', 'ROW 5 POWER: the planned crash zoom (6 f) on "plasters", landing on the IMPACT frame f156 (kick); held peak, the surgeon head stays whole', travel=0.2, whip=True, hold=0.87, creep=0.0, drift=[0.0, 0.0, -0.14]),
 st(TRAY_F, [1.3, -0.95, 1.6], [-0.15, 0.95, 1.42], 16, 'tray', 'M', 'ROWS 6-7: an eased pull-back off the knee (never once went INSIDE the knee) that opens the clean Mayo tray (the scope coiled in its SEALED bag, STERILE tag) in the foreground with the whole team behind', travel=TRAY_TR, hold=TRAY_H, creep=0.003, drift=[0.02, 0.02, 0.0]),
 st(300, NR_POS, NR_AIM, NR_LENS, 'nurse', 'M', 'ROWS 8-10 (A4): following her lean, the camera rises to a MEDIUM TWO-SHOT: the nurse big, whispering at the surgeon ear, mouth moving on "Doctor, you forgot the operation"; slow drift onto the surgeon smiling eyes for "operation"', travel=NR_TR, hold=NR_H, creep=0.001, drift=NR_DRIFT),
 st(386, [1.43, 2.79, 1.6], [1.43, 3.6, 1.6], 24, 'door', 'C', 'JOIN S1 -> S2 (B3): from the two-shot the camera flies on PAST the team (nurse and surgeon slide by at the left) to the OR 3 door; the LEFT porthole fills the frame at f386', travel=DOOR_TR, hold=0, via=DOOR_VIA, aim_via=DOOR_VAIM),
]
# v4b (strict every-frame check): the 1.4 s pan from the tray rest to the two-shot sliced the lying patient by the left edge for 22 frames (f274-296),
# a wide lying body cannot leave a pan fast enough. ONE hard cut (allowed: <= 1 per 10 s) on "whispers" f279 straight into the two-shot rest.
CUT_F = 279
CAM2 = [dict(cam[4], at=CUT_F, hold=(386 - DOOR_TR * 30 - CUT_F) / 30.0)] + cam[5:]
for k in ('travel',): CAM2[0].pop(k, None)
CK = KEYS['faces_ep']
FC = dict(CK, focus=dict(eyes='lidHalf', brows=[[-5, 7, 0, 1.15], [-4, 7, 0, 1.15]], mouth='pressed'),
          narrow=dict(eyes='squint', brows=[[-8, 9, 0, 1.2], [-7, 9, 0, 1.2]], mouth='pressed'),
          calm=dict(eyes='lid', brows=[[2, 0, 1, 1.1], [2, 0, 1, 1.1]], mouth='pressed'),
          twitch=dict(eyes='lidHalf', brows=[[-3, 5, 0], [-2, 5, 0]], mouth='wavy', wavyW=20),
          nrDry=dict(eyes='lidHalf', brows=[[-3, 3, 0, 1.15], [10, -4, 6, 1.15]], mouth='flat'),
          nrStop=dict(eyes='wideXL', brows=[[10, -4, 6, 1.15], [12, -4, 7, 1.15]], mouth='flat'),
          nrSly=dict(eyes='lid', brows=[[-2, 2, 1, 1.15], [14, -6, 8, 1.2]], mouth='smirkXL'),
          nrDown=dict(eyes='lidHalf', brows=[[2, 0, 2, 1.15], [12, -5, 7, 1.15]], mouth='smirkXL'))
acts = [
 dict(who='surgeon', at=0, pos=SG, view='34', dir=-1, pose=M('sg_s1'), face='k:focus', note='FRAME 0: bent over the knee from BEHIND it, scalpel tip on dot 1'),
 dict(who='surgeon', at=86, face='k:calm', note='"splashed": casual, almost playful'),
 dict(who='surgeon', at=140, face='k:focus'),
 dict(who='surgeon', at=148, face='k:narrow', note='POWER hold: eyes narrow over the mask'),
 dict(who='surgeon', at=160, face='k:smileEyes', note='tidy satisfaction'),
 dict(who='surgeon', at=330, face='k:smileEyes', note='amused: eyes smile over the mask'),
 dict(who='nurse', at=0, pos=NR, view='34', dir=-1, pose=M('nr_s1'), face='k:nrDry', note='arms folded, dry'),
 dict(who='nurse', at=250, face='k:nrStop', note='"nurse": stops dead'),
 dict(who='nurse', at=262, face='k:nrSly', say=[32, 36], note='leans in; "Doctor, you forgot the operation." lip-sync'),
 dict(who='nurse', at=338, face='k:nrDown', note='"forgot": eyes down to the clean tray'),
 dict(who='nurse', at=350, face='k:nrSly', note='"operation": eyebrow up at him'),
 dict(who='patient', at=0, pos=PT, dir=1, pose=M('pt_s1'), face='koClean', note='v2 (CB: the patient should be sleeping, a fainted meme): KNOCKED-OUT meme (spiral + X eyes, tongue, birdies) + zZ bubble all stretch; the thumbs-up on operation rises from under the drape while he stays out cold'),
 dict(who='patient', at=CUT_F, visible=False, note='v4b: off from the hard cut f279 (out of the two-shot and the door flight; his drape sliver at the left edge failed body_side)'),
]
H3K = [[0, 'knee_dot_1', 0.004, 'scalpel'], [14, 'knee_dot_1', 0.05, 'scalpel'], [22, 'knee_dot_1', 0.055, 'scalpel'], [25, 'knee_dot_1', 0.003, 'scalpel'], [30, 'knee_dot_1', 0.04, 'scalpel'], [34, 'knee_dot_2', 0.055, 'scalpel'], [37, 'knee_dot_2', 0.003, 'scalpel'], [41, 'knee_dot_2', 0.04, 'scalpel'], [43, 'knee_dot_3', 0.055, 'scalpel'], [46, 'knee_dot_3', 0.003, 'scalpel'], [53, 'knee_dot_3', 0.035, 'scalpel'], [70, 'knee_dot_3', 0.03, 'scalpel'], [82, 'knee_dot_2', 0.2, 'bulb'], [88, 'knee_dot_2', 0.2, 'bulb'], [90, 'knee_dot_2', 0.16, 'bulb'], [96, 'knee_dot_2', 0.2, 'bulb'], [102, 'knee_dot_2', 0.2, 'bulb'], [104, 'knee_dot_2', 0.16, 'bulb'], [110, 'knee_dot_2', 0.2, 'bulb'], [122, 'knee_dot_2', 0.21, 'bulb'], [126, 'knee_dot_1', 0.16, 'plaster'], [130, 'knee_dot_1', 0.17, 'plaster'], [133, 'knee_dot_1', 0.0, 'plaster'], [134, 'knee_dot_1', 0.005, None], [137, 'knee_dot_1', 0.06, 'plaster'], [142, 'knee_dot_2', 0.17, 'plaster'], [147, 'knee_dot_2', 0.0, 'plaster'], [148, 'knee_dot_2', 0.005, None], [149, 'knee_dot_3', 0.08, 'plaster'], [152, 'knee_dot_3', 0.24, 'plaster'], [155, 'knee_dot_3', 0.25, 'plaster'], [156, 'knee_dot_3', 0.0, 'plaster'], [157, 'knee_dot_3', 0.004, None], [161, 'knee_dot_3', 0.035, None], [163, 'knee_dot_3', 0.04, None], [166, 'knee_dot_3', 0.004, None], [171, 'knee_dot_3', 0.03, None], [182, 'knee_top', 0.02, None], [340, 'knee_top', 0.02, None], [346, 'knee_plaster_3', 0.05, None], [350, 'knee_plaster_3', 0.004, None], [355, 'knee_plaster_3', 0.04, None], [359, 'knee_plaster_3', 0.004, None], [366, 'knee_plaster_3', 0.03, None]]
cast = {k: dict(KEYS['cast'][k], walk_speed=99) for k in ('surgeon', 'nurse', 'patient')}
shade = dict(KEYS['card_shade'])
p = copy.deepcopy(PK['OR']); p['light_over']['card_shade'] = dict(shade)
p.update(knee_v2=True, knee_v3=dict(at=[-0.04, 0.47, 1.31], hip=[-0.32, 0.47, 0.93], foot=[0.25, 0.47, 0.9], face=[0.0, -0.7, 0.72], win=0.13, ball=0.092, dx=0.04, dot=0.0135, dome=0.022, pw=[0.039, 0.08, 0.035, 0.076, 0.023, 0.023], w=0.11), knee_crisp=dict(back='#24488a'), leg_drape=dict(color='#5f8fd0', fold='#3e6aa8', far_y=0.76), knee_win='thin', lie_body=dict(r=0.13, zs=0.5), steps=[[SG[0], SG[1], SG[2]], [NR[0], NR[1], NR[2]]], tray_at=TRAY, hand3d=dict(shoulder=[SG[0], SG[1], 1.17 + SG[2]], dx=-0.2, keys=H3K), knee_track=[[0, 1, 0], [38, 2, 0], [47, 3, 0], [134, 3, 1], [148, 3, 2], [156, 3, 3]], lamp_angle=0.34, lamp_i=14, knee_tone='#857b72', knee_tapes='strips', drape_soft=True,
  lamp_pos=[0.55, -0.15, 2.35], lamp_at=[-0.05, 0.6, 1.5], tiks=[[25, 0], [37, 1], [46, 2]], ko_face=False, ko_clean=True, env_v3=True, zzz_v3=dict(head=[-0.92, 0.78, 2.02], toLens=0.6, f0=-30, f1=400), water_v3=dict(bursts=[89, 103], size=2.2, drops=12), scope_tray=dict(at=[-0.04, 0.0]), porthole_view=True,
  impact=[[156, '#bff0e0'], [157, '#ffffff']],
  power=[dict(kind='ray_burst', at=[KNEE[0] + 0.03, KNEE[1] - 0.03, KNEE[2] + 0.02], f=156, opts=dict(count=28, length=0.45, innerRadius=0.2, width=0.05, color='#f4fbff', core='#ffffff', dur=0.5, spin=0, flash=dict(size=0.25, life=0.08))),
         dict(kind='shockwave_ring', at=[KNEE[0] + 0.05, KNEE[1] - 0.06, KNEE[2] + 0.03], f=156, opts=dict(orient='camera', radius=0.22, startRadius=0.03, thickness=0.25, dur=0.45, color='#f2e6c8', shade='#c9a56a', inkWidth=0.006,
              ring2=dict(color='#ffffff', delay=-0.03, scale=1.35, width=0.01, dur=0.4), flash=dict(color='#fff4d6', size=0.15, life=0.08), dust=dict(count=0), debris=dict(count=0)))])
F = dict(title='fake-surgery S1: rows 1-10, film 0-374 (the hook)', fps=30, size=[1080, 1920], words='words_s1.json', end=END,
  tween=dict(frames=0, face_frames=0, ones=True), auto_view=False, puppet_pkg=['moves', 'cast', '../../../templates/vector2d_characters/code'],
  cast=cast, costume_shade=KEYS['costume_shade'], card_shade=dict(shade), face_shadow=KEYS.get('face_shadow', True), kit3d=dict(pbr=True, relief=True, sky=False, trees=False), faces_ep=FC,
  post=dict(dof=0.0, dust=0, bloom=1, vignette=0.45),
  places=dict(orm=p),
  props=dict(knee=dict(pos=KNEE, kind='the knee'), tray=dict(pos=TRAY, kind='the clean tray'), scope=dict(pos=[TRAY[0] + 0.02, TRAY[1] - 0.02, TRAY[2] + 0.07], kind='the sealed scope in its bag on the tray')),
  acts=acts, kicks=[dict(at=156, amp=1.0)],
  hand_at=[dict(who='surgeon', f0=0, f1=END, at=[-0.04, 0.62, 1.44])],   # the FAR (steadying) fist on the back of the knee, above its silhouette
  takes=[dict(id='or', place='orm', stations=cam[:4]), dict(id='or2', place='orm', stations=CAM2)])
json.dump(F, open('film.json', 'w', encoding='utf-8'), indent=1)
open('OFFSET.txt', 'w').write('S1 = film 0.00-12.50 s = frames 0-374 (+12 handle frames to 386); stretch frame = FILM frame (offset 0). Plan rows 1-10 (script lines 1-3). One take "or" (OR 3, light kind OR).\n')
print('film.json written: end', END)

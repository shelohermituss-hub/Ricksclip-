# S5 (film 56.10-73.62 s = frames 1683-2209, plan rows 40-50, script lines 13-16). Writes film.json + OFFSET.txt. Plain FILM frames, no offset.
# Takes: orrp (OR replay, OR light, 1683-1765, rows 40-41) | wait (waiting room AF, 1766-1925, rows 42-44) | off (office 2004 GR, 1926-2062, rows 45-47)
# | ore (OR 3 evening EV_or, 2063-2155, rows 48-49) | st (stairwell evening EV, 2156-2209, row 50 LAST FRAME). All places use set 'waiting' (S5 owns it):
# 'wrap' builds or_room / office / stairwell unchanged and lays the S5 overlays (aura, sparkle, field, impact, props, sag, blizzard, drops, glow) on top.
import json, copy, os, sys
# BUILD-OUT: HANDLE=1|2 writes film_h<k>.json for the join dissolves: the next take is removed so the out-take runs 12 frames on, and the out-take's people stay 12 frames longer.
#   h1 removes wait + ore (orrp runs 1766-1777, off runs 2063-2074); h2 removes off + st (wait runs 1926-1937, ore runs 2156-2167).
HANDLE = os.environ.get('HANDLE', ''); PAD = 12 if HANDLE else 0
KEYS = json.load(open('cast/CAST_KEYS.json', encoding='utf-8')); PK = json.load(open('sets/PLACE_KEYS.json', encoding='utf-8'))
def st(at, pos, aim, lens, subject, framing, purpose, **k): return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, **k)
M = lambda n: 'm:../../ep_s5/' + n
shade = dict(KEYS['card_shade'])
def place(kind, **extra):
    p = copy.deepcopy(PK[kind]); p['light_over']['card_shade'] = dict(shade); p.pop('dress', None) if kind in ('AF',) else None; p['env_v3'] = True; p.update(extra); p['set'] = 'waiting'; return p   # v3 A7: env_v3 on every S5 place
C = KEYS['cast']
def ck(name, src=None): return dict(C[src or name], walk_speed=99)
cast = dict(sg_r=ck('surgeon'), pt_r=ck('patient'), boy=ck('boy'), nr_k=ck('nurse'), sg_o=ck('surgeonOff'),
            nr_e=ck('nurse'), sg_e=ck('surgeon'), sgoff_e=ck('surgeonOff'), sg_s=ck('surgeonOff'), vet=ck('patientShorts'), kid=ck('grandkid'), nr_s=ck('nurse'))
# ROW 50 round 2: 9 climbers + the vet (kid on his shoulders): flight 1 (steps 5/7/9), the landing (3), flight 2 top steps 6/8/9 (the only flight-2 treads a camera
# below storey 2 can see over the flight's own rise). Tread tops: f1 step i y=(i-.5)*.3 z=i*.16; f2 step i y=2.55-(i-1)*.3 z=1.6+i*.16; lanes f1 x 180.7/181.5, f2 179.3/178.5.
CL = [('climber1', [181.5, 1.35, .80], 1), ('climber2', [180.75, 1.95, 1.12], 1), ('g1s', [181.45, 2.55, 1.44], 1), ('climber3', [181.1, 3.4, 1.6], -1),
      ('g2s', [180.25, 3.95, 1.6], -1), ('g4s', [180.55, 3.65, 1.6], -1), ('g5s', [179.3, 1.05, 2.56], -1), ('boy', [178.5, .45, 2.88], -1), ('g3s', [179.3, .15, 3.04], -1)]
for n, _, _ in CL: cast['c_' + n] = ck(n)
FC = dict(KEYS.get('faces_ep', {}))
FC.update(focus=dict(eyes='lidHalf', brows=[[-5, 7, 0, 1.15], [-4, 7, 0, 1.15]], mouth='pressed'),
          kind=dict(eyes='lid', brows=[[2, 0, 1], [2, 0, 1]], mouth='smileSmall'),
          drowsyFrown=dict(eyes='lidHalf', brows=[[-6, 8, -1, 1.2], [-6, 8, -1, 1.2]], mouth='flat'),
          frozen=dict(eyes='wideXL', brows=[[12, -6, 7, 1.2], [12, -6, 7, 1.2]], mouth='o'),
          cheer=dict(eyes='happyXL', brows=[[12, -4, 7, 1.1], [12, -4, 7, 1.1]], mouth='smileSmall'),
          watch=dict(eyes='oval', brows=[[4, -2, 2], [6, -3, 3]], mouth='flat'),
          stern=dict(eyes='lidHalf', brows=[[-7, 9, -1, 1.25], [-6, 10, -1, 1.25]], mouth='pressed'),
          dryUp=dict(eyes='lidHalf', brows=[[-2, 3, 0, 1.1], [16, -7, 9, 1.25]], mouth='smirk'),
          sheepish=dict(eyes='happy', brows=[[8, -2, 5, 1.1], [10, -3, 6, 1.1]], mouth='smirk'),
          calmGrin=dict(eyes='lid', brows=[[2, -1, 1], [4, -2, 2]], mouth='smileSmall'),
          proudGrin=dict(eyes='happy', brows=[[6, -3, 4, 1.1], [8, -3, 5, 1.1]], mouth='proud'),
          ride=dict(eyes='happyXL', brows=[[14, -4, 8, 1.1], [14, -4, 8, 1.1]], mouth='smileSmall'),
          climbOK=dict(eyes='lid', brows=[[3, -1, 2], [3, -1, 2]], mouth='smileSmall'))
A = lambda who, at, **k: dict(who=who, at=at, **k)
def span(who, f0, f1, **first):   # visible only inside its take (+ PAD on the take's last frame for the handle renders)
    return [A(who, 0, visible=False, **first), A(who, f0, visible=True), A(who, f1 + 1 + (PAD if f1 in (1765, 1925, 2062, 2155) else 0), visible=False)]
acts = []
NK = [239.2, 0.6, 0]   # v3 C1: BEHIND the boy (further from the lens than his card), right of the knee: nothing between the knee and the lens; was [239.3,-.1]. Older note: v2 r3: nearer the lens and right of the knee seen from the boy front-left camera; v2 r2 nurse kneel spot: SIDE view facing left, at the boy's knee side, a touch nearer the lens than his card (her fist draws over his knee)
KNEE_W = [238.845, 0.12, 0.68]   # v2 r2 the boy's knee point in plan metres (card px BOY_KNEE; tuned on the 1850 still) = her fist target (hand_at)
# ---- orrp: rows 40-41
acts += span('sg_r', 1672, 1765, pos=[-0.08, 1.08, 0.36], view='34', dir=-1, pose=M('sg_slap3'), face='k:focus')
acts += [A('sg_r', 1717, face='k:kind', note='"fixed": calm, pleased')]
acts += span('pt_r', 1672, 1765, pos=[-0.6, 0.78, 0.9], view='34', dir=1, pose=M('pt_smile5'), face='koSleep')   # v2: KNOCKED-OUT meme (moves/memes3.mjs), zZ bubble
acts += [A('pt_r', 1745, face='koMelt', note='v2 ROW 41 "knee": the tongue-out ko face melts'), A('pt_r', 1750, face='koBliss', note='v2: blissful smile, hearts, happy zZ')]
# ---- wait: rows 42-44
acts += span('boy', 1766, 1925, pos=[238.6, 0.12, 0], view='side', dir=1, pose=M('boy_sit'), face='k:wail')
acts += [A('boy', 1896, face='k:frozen', note='"STOPS": frozen mid-wail'), A('boy', 1906, face='k:cheer', note='v2 "hurting": the frozen wail turns into a grin (no run-off slide)')]
acts += span('nr_k', 1766, 1925, pos=NK, view='side', dir=-1, pose=M('nr_kneel'), face='k:kind')   # v2: her card's own round fist slaps the plaster (no 3D arm)
# ---- off: rows 45-47
acts += span('sg_o', 1926, 2062,   # v3 B10: he stays (no vanish mid-move); the letter close frames him out
              pos=[119.9, 1.42, 0], view='front', dir=1, pose=M('sg_stamp'), face='k:stern')
acts += [A('sg_o', 1977, face='k:stern'), A('sg_o', 2020, face='k:watch')]
# ---- ore: rows 48-49
acts += span('nr_e', 2063, 2155, pos=[0.88, 0.22, 0],   # v4: was [.85,.3] (8 % in table_frame); [1.08,.08] hid the surgeon
                # v3 B11: left of the surgeon (was [1.0,.7], covered him)
              view='34', dir=1, pose=M('nr_tray'), face='k:kind')
acts += [A('nr_e', 2095, face='k:dryUp', note='"right": eyebrow ting')]
acts += span('sg_e', 2063, 2124, pos=[2.1, 1.5, 0], view='34', dir=-1, pose=M('sg_mask'), face='k:watch')
acts += span('sgoff_e', 2125, 2155, pos=[2.1, 1.5, 0], view='34', dir=-1, pose=M('sg_shrug'), face='k:sheepish')
# ---- st: row 50
acts += span('sg_s', 2156, 2229, pos=[180.05, -2.85, 0], view='front', dir=1, pose=M('sg_fold'), face='k:calmGrin')
acts += [A('sg_s', 2194, face='k:proudGrin', note='"missed": the grin')]
acts += span('vet', 2156, 2229, pos=[180.72, -2.0, 0], view='side', dir=1, pose=M('vet_bound'), face='k:springGrin')
acts += span('kid', 2156, 2229, pos=[180.7, -2.05, 1.68], view='front', dir=1, pose=M('kid_ride'), face='k:ride')
acts += span('nr_s', 2156, 2229, pos=[179.55, -1.3, 0], view='34', dir=1, pose=M('nr_door'), face='k:dryUp')
acts += [A('nr_s', 2194, face='k:kind')]
for n, p, d in CL: acts += span('c_' + n, 2156, 2229, pos=p, view='34', dir=d, pose=M('climb'), face='k:climbOK')
HP = 'sets/hero_props.js'
held3d = [dict(who='sg_r', obj='plaster', module=HP, builder='buildPlaster', opts={}, grip='point', hand='L', anchor='grip', tip='tip', angle=80, scale=1.0, toward=0.45, when='always', f0=1672, f1=1708),
          dict(who='nr_e', obj='tray', module=HP, builder='buildInstrumentTray', opts={}, grip='point', hand='L', anchor='centre', scale=1.0, when='always', f0=2063, f1=2155),
          dict(who='nr_s', obj='tray_s', module=HP, builder='buildInstrumentTray', opts={}, grip='point', hand='L', anchor='centre', scale=1.0, when='always', f0=2156, f1=2229)]
TH_AT = [-.8, .8, 1.47]   # v3 C8: lower (beside his head) + bigger (h .55 -> .72); was [-.64, .8, 1.72]   # v2 thought bubble trail end, just above the patient's head (tuned on stills)
BOY_KNEE = [130, 650]; KNEE_PX = [400 + BOY_KNEE[0], 430 + BOY_KNEE[1]]   # v2 r2 = moves/ep_s5.mjs BOY_KNEE (move rig) -> card px (CARD.CX 400, CARD.GY - MG = 430)
PLR = [-.04, .41, 1.40]   # BUILD-OUT: the S1 round-5 knee window (KNEE C0 [-.04,.41,1.37])
places = dict(
  orrp=place('OR', wrap='or_room', knee_v2=True, knee_track=[[0, 3, 2], [1709, 3, 3]], lamp_angle=.42, drape_soft=True,   # v2: no black veil (S4 joins with a bright dissolve)
             knee_v3=dict(at=[-0.04, 0.47, 1.31], hip=[-0.32, 0.47, 0.93], foot=[0.25, 0.47, 0.9], face=[0.0, -0.7, 0.72], win=0.13, ball=0.092, dx=0.04, dot=0.0135, dome=0.022, pw=[0.039, 0.08, 0.035, 0.076, 0.023, 0.023], w=0.11), knee_crisp=dict(back='#24488a'),
             leg_drape=dict(color='#5f8fd0', fold='#3e6aa8', far_y=0.76), knee_win='thin', lie_body=dict(r=0.13, zs=0.5), knee_tone='#857b72', knee_tapes='strips', steps=[[-0.08, 1.08, 0.36]],   # = S1 round 5 (one OR knee for the film)
             thought=dict(f0=1717, f1=1790, at=TH_AT, h=.8), zzz=dict(head=[-0.95, 0.6, 1.8], f0=1640, f1=1766, side=-1, size=.16, lift=.08, rise=.3)),   # v2 ROWS 40-41: the plaster lands (knee_track 1709), the thought bubble pops on "fixed" (replaces the gold aura/field/sparkle)
  wait=place('AF', light_kind='afternoon', troffer_flat='#fff4dc', fish_stare_at=[[0, 0], [1790, 0], [1800, 1]],
             stickers=[dict(kind='scuff', card='boy', px=KNEE_PX, f0=1826, f1=1925, w=.13, rot=-10, lift=.012), dict(kind='plaster', card='boy', px=KNEE_PX, f0=1844, f1=1925, w=.16, rot=-14, pop=True, lift=.016)],   # v2 r2 ROW 43: on the KNEE JOINT of the boy's line leg (card px, follows the card)
             hide_pre=['table_d_'], gang_drop=dict(a=[1]), gang_y=dict(a=.58),   # v4: the teal seat beside the boy left out (the nurse kneels on open floor, CB 'nurse still in the chair')
             drops=[dict(kind='tear', at=[238.67, 0.22, 1.03], f0=1896, f1=1925), dict(kind='bubble', at=[238.55, 0.2, 0.95], f0=1896, f1=1925, pop=1904, r=.045)]),
  off=place('GR', wrap='office', dress='y2004', door=1,
            props=[dict(b='buildStamp', o=dict(size='tin'), glide=True, path=[[1926, [120.3, 1.05, .772], 0], [1950, [120.3, 1.05, .772], 0], [1955, [120.3, 1.05, 1.6], 0], [1960, [119.95, 1.0, 1.6], 0], [1974, [119.95, 1.0, 1.6], 0], [1977, [119.95, .9, .772], 0], [2010, [119.95, .9, .772], 0], [2016, [120.35, 1.1, .772], 0]]), dict(b='buildLetter', o={}, glide=True, path=[[1926, [119.35, .55, .772], 25], [1952, [119.95, .9, .772], 0]], set=[[1978, 'setStamped', 1]])],
            sag=dict(match='desk', f=1977, amp=.07, n=16), blizzard=dict(f=1978, f1=2016, fade=6, ramp_in=5, near=1.3, clear=dict(at=[119.9, 1.42, 1.35], r=.4), at=[120.75, .9, .82], n=12, h=1.6, spread=.8, ceil=2.3), pens=dict(f=1978, at=[120.5, .8, .78]), dim=dict(f0=2011, f1=2090, op=.32, ramp=9),
            impact=[[1977, '#ffffff'], [1978, '#ffe08a']]),
  ore=place('EV_or', wrap='or_room', evening=True, knee=dict(dots=0, plasters=0), hide_pre=['table_frame', 'drape_hang_foot', 'stockinette_foot', 'env_cabinet_right'],   # v4: the steel under-frame below the pad hidden (the nurse stood in it)
           
            glow=[dict(at=[1.85, 2.6, 1.7], color='#ffb070', i=5, dist=5), dict(at=[0.3, 0.6, 2.4], color='#ffd0a0', i=2.5, dist=6)],
            sparkle=[dict(f0=2097, f1=2104, at=[1.05, 0.65, 1.62], r=.05, n=3, color='#ffffff', size=.08)]),
  st=place('EV', wrap='stairwell', light_kind='evening', door=1, cane=False, cobweb=0,
           hide=['storey2_slab', 'storey2_terrazzo', 'storey2_edge_angle', 'storey2_guard', 'cupboard_end_wall'], hide_pre=['storey2_guard', 'end_dado', 'end_cove', 'cupboard_end'],
           impact=[[2194, '#ffc878'], [2195, '#ffe4b8']], impact_warm=True, recolor=[dict(match=['nosing_abrasive'], color='#3a3634'), dict(match=['tread_nosing', 'nosing_lip', 'storey2_edge'], color='#b89a74')],
           glow=[dict(at=[180.6, -2.9, 2.1], color='#fff2e0', i=2.5, dist=3.5), dict(at=[180.1, -3.8, 2.3], color='#ffd8b8', i=4, dist=8), dict(at=[180.2, 1.6, 3.0], color='#ffb878', i=4, dist=7), dict(at=[179.2, -1.2, 2.2], color='#fff4e8', i=1.0, dist=5)],
           power=[dict(kind='ray_burst', at=[180, 4.5, 4.1], f=2194, opts=dict(count=30, length=4.8, innerRadius=.3, width=.22, color='#ffd27a', core='#fff6dc', dur=1.2, spin=4, flash=dict(size=1.4, life=.12)))],
           sparkle=[dict(f0=2194, f1=2229, at=[180.07, -2.95, 1.6], r=.12, n=5, color='#ffffff', size=.1)]))
# v2 CAMERA: one flowing take per place, eased travels that follow the action, about one rest per place (FIX_BRIEF_v2 rule 1)
# v2 r3 CAMERA: ONE slow eased travel of 2.6-3.6 s per take (FIX_BRIEF_v2 rule 1; check_film v2r2 travel p90 1.23 s, rests 4.31/10 s). Each take opens moving out of its dissolve.
orrp = [st(1672, [-0.55, -1.6, 1.35], [-0.6, 0.9, 1.3], 26,   # v3: shifted .15 left (patient head whole)
                 'pt_r', 'M', 'ROW 40 side view low on the knee (frame-0 rhyme), already moving out of the S4 dissolve: the third plaster lands', hold=0.03, drift=[0.03, 0, 0], creep=0.001, ends=True),
        st(1765, [-1.62, -1.05, 1.85], [-0.84, 0.8, 1.5], 24,   # v3 C8: 24 mm + .12 left: head + bigger bubble whole
                 'pt_r', 'M', 'ROW 40-41: ONE eased 3.0 s arc up round from the knee to his ko face + the thought bubble (knee, green tick, sun) popping on "fixed"; lands on "less" = the bliss melt', travel=3.0, hold=0.0, drift=[0.06, 0, 0], creep=0.002)]
wait = [st(1766, [239.7, -2.6, 1.2], [238.55, 0.9, 0.88], 26, 'boy', 'W', 'ROW 42 wide, moving out of the dissolve: the boy wailing on the orange chair, the nurse kneeling beside him, fish tank', hold=0.0),
        st(1856, [239.6, -1.15, 0.8], [238.95, 0.2, 0.8], 22,   # v4: 23 -> 22 mm (boy head whole at 1920-25)
                   # v3 C1: from the KNEE side (front-right, low): the knee nearest the lens, the faces behind it
                 'boy', 'M', 'ROW 43 SIGNATURE (v2 r3): ONE eased 2.85 s travel down and round to the boy front-left, low and level: his raised knee with the scuff in the front-low third, the nurse kneeling to the right (not between the lens and the knee), her round fist slaps the plaster on "plasters" and lifts off; both faces whole above; ROW 44 he freezes, tear, sob bubble, grin (slow drift)', travel=2.97, hold=2.3, drift=[0.03, 0, 0], creep=0.0015)]
off = [st(1926, [120.15, -1.25, 1.5], [119.98, 0.95, 1.12], 22, 'stamp', 'M', 'ROW 45-46 office 2004, moving out of the dissolve: the letter slides to him, the paint-tin stamp rises (slow rising drift with it), SLAM on "stopped", desk sag, paper blizzard', hold=0.05, drift=[0.0, 0.02, 0.07], creep=0.001),
       st(2060, [119.95, 0.2, 1.45], [119.93, 1.1, 1.05], 22,   # v4b: he stays WHOLE above the letter (was [119.95,.62,1.3]->[119.95,.93,.77] 28 mm: half body cut 2040-2054)
           'letter', 'C', 'ROW 47: ONE eased 2.77 s travel down through the falling papers onto NOT PAID: ARTHRITIS KNEE (v3 B10: starts 2006, so at 1:07 the surgeon is still whole)', travel=1.8, hold=0.0, drift=[0.02, 0, 0])]
ore = [st(2063, [1.25, -2.2, 1.35], [1.45, 1.7, 1.3], 22, 'nr_e', 'M', 'ROW 48 OR 3 evening 7:15: the nurse lifts the clean unused tray, eyebrow ting; coral portholes behind', hold=0.05),
       st(2153, [0.75, -0.9, 1.5], [1.62, 2.5, 1.4], 21,   # v4b: 24 -> 21 mm, aim x 1.55 -> 1.62 (sgoff_e cut by the right edge at 2146)
            # v3 D4: ends further back (the old path passed an orange lamp at the lens)
              'sgoff_e', 'M', 'ROW 48-49: ONE eased 2.9 s follow from the nurse tray over to the surgeon: mask down, shrug, his fist pushes the OR door (JOIN to the stairwell)', travel=2.9, hold=0.0, drift=[0.03, 0, 0])]
stair = [st(2156, [179.8, -4.45, 1.42],   # v4b: start inside the room (y -4.95 was behind wall_front_block_4th, every face hidden 2156-2166)
           [180.6, 3.0, 2.45], 18, 'sg_s', 'W', 'ROW 50 opens moving out of the dissolve, pulled back and left of the approved last frame', hold=0.03),
         st(2195, [180.18, -4.3, 1.5], [180.75, 3.0, 2.5], 18, 'sg_s', 'W', 'ROW 50: ONE eased 1.27 s glide into the APPROVED last frame (last_low: surgeon BIG and calm in front, the stream up both flights to the window); POWER impact on "missed", rays, FREEZE + slow push = the last frame', travel=1.27, hold=0.0, drift=[0, 0, 0], creep=0.0012)]
props = dict(knee=dict(pos=[.36, .44, 1.3], kind='the plastered knee (row 40)'), kidknee=dict(pos=[238.6, -.01, .5], kind='the boy knee'), letter=dict(pos=[119.95, .9, .77], kind='the letter + stamp'),
             tray=dict(pos=[0.15, 1.3, 1.2], kind='the clean tray'), window=dict(pos=[180, 4.6, 4.1], kind='the stair window'))
F = dict(camera=dict(v2=True), title='fake-surgery S5 build-out: rows 40-50, film 1684-2229 (render 1672-2229)', fps=30, size=[1080, 1920], words='voice/words.json', end=2230,
  tween=dict(frames=0, face_frames=0, ones=True), auto_view=False, puppet_pkg=['moves', 'cast', '../../../templates/vector2d_characters/code'],
  cast=cast, costume_shade=KEYS['costume_shade'], card_shade=dict(shade), face_shadow=KEYS.get('face_shadow', True), faces_ep=FC,
  kit3d=dict(pbr=True, relief=True, sky=False, trees=False), post=dict(dof=0.0, dust=0, bloom=1, vignette=0.42),
  places=places, props=props, acts=acts, held3d=held3d, hand_at=[dict(who='nr_k', f0=1826, f1=1925, at=[KNEE_W[0], KNEE_W[1], KNEE_W[2] + .05])], kicks=[dict(at=1977, amp=1.2), dict(at=2194, amp=0.5), dict(at=1709, amp=0.5)],
  takes=[dict(id='orrp', place='orrp', stations=orrp), dict(id='wait', place='wait', stations=wait), dict(id='off', place='off', stations=off),
         dict(id='ore', place='ore', stations=ore), dict(id='st', place='st', stations=stair)])
if HANDLE:
    drop = {'1': ('wait', 'ore'), '2': ('off', 'st')}[HANDLE]; F['takes'] = [t for t in F['takes'] if t['id'] not in drop]
json.dump(F, open('film_h%s.json' % HANDLE if HANDLE else 'film.json', 'w', encoding='utf-8'), indent=1)
open('OFFSET.txt', 'w').write('S5 = film 56.10-73.62 s = frames 1683-2209; plain FILM frames, no offset. Plan rows 40-50, script lines 13-16.\n'
  'Takes: orrp 1683-1765 (rows 40-41, OR) | wait 1766-1925 (42-44, AF) | off 1926-2062 (45-47, GR office y2004) | ore 2063-2155 (48-49, EV_or) | st 2156-2209 (50, EV stairwell).\n')
print('film.json written')

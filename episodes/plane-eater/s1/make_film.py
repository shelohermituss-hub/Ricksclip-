"""make_film.py: writes s1/film.json for plane-eater S1 THE HOOK (frames 0-256 = 0.00-8.56 s, PICTURE_PLAN rows 1-9, script lines 1-2). S1 builder 2026-11-22.
Edit this file, not film.json. Positions are plan metres (X east, Y north, Z up) in the Villebrune apron; Cessna at the origin, nose south.
They match sets/s1_apron.js (S1). Staging (lead's note): no chair; Michel stands IN SUN on his showman trunk on the south side of the LEFT wing tip (tip 1.9-2.0 m: from the
ground a 1.8 m man cannot reach over it), seen low from the side; he salts it, saws its end and takes the first bite from it: one spot, no teleport."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.join(HERE, '..')
keys = json.load(open(os.path.join(EP, 'cast', 'CAST_KEYS.json')))
meta = json.load(open(os.path.join(EP, 'sets', 'apron', 'out', 'apron_meta.json')))
cast = {k: dict(keys['cast'][k], walk_speed=99) for k in ['michel', 'owner']}
Z = 0.03
MI, OW = [5.35, -1.3, 0.48], [1.0, -3.05, Z]   # Michel stands ON his showman trunk (top 0.48 m): the wing tip (top 1.95-2.0 m) is then at his hands
TIP = [5.06, -1.25, 2.0]        # the salted wing-tip corner (leading edge, outer end)
CUT = [4.82, -1.6, 1.97]        # the saw cut at the leading edge, underside
PLATE = [5.98, -1.62, 1.52]      # fix round: the plate on a small pedestal side table at his chest (top 1.50 m), not on the wing (s1_apron.js prints PE_S1_PLATE)
NOSE = [0.0, -3.5, 1.1]
M = lambda k: 'm:../../ep_s1/' + k
acts = [
    dict(who='michel', at=0, pos=MI, view='34', dir=1, pose=M('mi_hook'), face='k:glanceCam', look=TIP, note='row 1 FRAME 0: salts the wing tip like a steak, fork up'),
    dict(who='michel', at=40, face='k:proud', note='row 1: back to the wing'),
    dict(who='michel', at=54, face='k:smug', note='row 2 "guy": pleased'),
    dict(who='michel', at=62, face='k:aim', look=NOSE, note='row 3 "looked at an airplane": measures the meal along the wing'),
    dict(who='michel', at=98, face='k:think', note='row 4 "thought": chin on the fork fist, eyes narrow (POWER 1 anticipation)'),
    dict(who='michel', at=121, face='k:glanceCam', look='cam', note='row 5 POWER 1 "Lunch!": to the lens, napkin snap'),
    dict(who='michel', at=127, face='k:frozenTongue', note='row 5: the lip lick'),
    dict(who='michel', at=133, face='k:proud', note='row 5: grin to the lens, dead still to f150'),
    dict(who='michel', at=152, face='k:concentrate', look=CUT, note='rows 6-7: to the cut, saw up'),
    dict(who='michel', at=173, face='k:frozenTongue', note='row 7 "cut": tongue in the corner, pastry-chef strokes'),
    dict(who='michel', at=205, face='k:concentrate', note='row 9: the tongs'),
    dict(who='michel', at=226, look=PLATE, note='row 9: carries the bite to the plate'),
    dict(who='michel', at=235, face='k:proud', note='row 9 "bites": proud nod over the plate'),
    dict(who='owner', at=0, pos=OW, view='34', dir=-1, pose=M('ow_polish'), face='k:concentrate', look=[0.45, -3.42, 0.85], note='row 1: polishing the propeller, knows nothing'),
    dict(who='owner', at=187, face='k:peJawDrop', look=TIP, note='row 8 "whole": sees the cut wing tip'),
    dict(who='owner', at=200, face='k:shocked', look=[0.45, -3.42, 0.85], note='row 8: polishes faster, in denial'),
]
# held props (props/out GLBs through sets/pe_props.js); tip_at puts the working end on the story point, the fist follows
shake = [[f, 98 if (f // 3) % 2 == 0 else 122] for f in range(0, 61, 3)] + [[64, 100]]
strokes = []
for k in range(5):
    s = 162 + k * 8
    strokes.append(dict(f0=s, f1=s + 4, at=[CUT[0], CUT[1] - 0.07, CUT[2]], ramp=[2, 1]))
    strokes.append(dict(f0=s + 4, f1=s + 8, at=[CUT[0], CUT[1] + 0.07, CUT[2]], ramp=[1, 2]))
held3d = [
    dict(who='michel', obj='salt_shaker', module='sets/pe_props.js', builder='buildShaker', grip='point', hand='R', anchor='grip', tip='tip', when='always', f1=150,
         angle=shake, scale=2.2),   # turned over, cap down, rocking 98-122 deg every 3 f = the shake (no tip_at: it would aim the cap up at the point)
    dict(who='michel', obj='fork', module='sets/pe_props.js', builder='buildFork', grip='raise', hand='L', anchor='grip', tip='tip', when='always', f1=150, scale=1.3,
         angle=[[0, -80], [112, -80], [120, -15], [131, -15], [138, -80]]),   # the fork turns out to the side while the fist is at the collar (never across his face)
    dict(who='michel', obj='hacksaw', module='sets/pe_props.js', builder='buildSaw', grip='point', hand='L', anchor='grip', tip='tip', when='always', f0=151, f1=204, angle=-4, scale=1.4,
         tip_at=[dict(f0=156, f1=162, at=[CUT[0], CUT[1] - 0.07, CUT[2]], ramp=[6, 0])] + strokes),
    dict(who='michel', obj='sugar_tongs', module='sets/pe_props.js', builder='buildTongs', grip='point', hand='L', anchor='grip', tip='tip', when='always', f0=205, scale=1.8, angle=35,
         tip_at=[dict(f0=206, f1=218, at=[CUT[0] + 0.03, CUT[1] + 0.05, CUT[2] - 0.02], ramp=[8, 4]), dict(f0=226, f1=256, at=[PLATE[0], PLATE[1], PLATE[2] + 0.03], ramp=[10, 0])]),
    dict(who='owner', obj='rag', module='sets/pe_props.js', builder='buildRag', grip='hang', hand='R', anchor='grip', when='always', scale=1.0),
]

def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.0028, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)
stations = [
    st(0, [5.25, -3.35, 2.75], [5.05, -1.35, 1.75], 24, 'michel', 'M', 'ROWS 1-2 FRAME 0 (HOOK, M00 living rest + M01 creep). WAIVER (lead 2026-11-22, frame 0 + hook only): lens 2.75 m, looking DOWN on the sunlit white/navy wing top (the joke is the wing top), Michel looks UP at the lens so his face reads: Michel big on his MONSIEUR MANGETOUT trunk at the END of the wing, salting the white wing tip beside his face like a steak; the sunlit leading edge runs away to the left', hold=1.3, shows=['tip']),
    st(82, [7.4, -3.5, 2.3], [2.0, -0.9, 1.2], 16, 'michel', 'P', 'ROW 3 (M11 push + truck along his eyeline, lands as a reveal): his look runs along the wing to the nose; the camera rises a little, swings left with his look and widens until the whole Cessna F-MIAM stands in frame, Michel near at its wing tip', hold=0.2, shows=['plane']),
    st(124, [6.2, -3.3, 2.12], [5.55, -1.3, 1.98], 26, 'michel', 'M', 'ROWS 4-5 (M02 push in to land on the face, POWER 1): the idea forms (chin on fork), then LUNCH! to the lens with the napkin snap; the wing tip beside him', hold=0.9, shows=['michel']),
    st(182, [6.05, -3.05, 2.05], [5.05, -1.5, 1.98], 32, 'michel', 'C', 'ROWS 6-8 CLOSE rest (M10 face -> hand -> blade): the hacksaw on the cut line at the wing tip, aluminium dust, his tongue in the corner; the owner jolts in the back', hold=0.4, shows=['trunk', 'cut']),
    st(238, [6.75, -3.05, 1.9], [5.9, -1.55, 1.58], 36, 'michel', 'C', 'ROW 9 CLOSE (M02 push in to land on the plate): the tongs set ONE tiny square on the white plate on the side table, his proud nod above it', hold=0.6, shows=['plate']),
]
props = {
    'tip': dict(pos=TIP, kind='the salted wing tip'), 'plane': dict(pos=[0, 0, 1.2], kind='the Cessna F-MIAM'), 'cut': dict(pos=CUT, kind='the saw cut'),
    'trunk': dict(pos=[5.5, -1.3, 0.25], kind='the MONSIEUR MANGETOUT trunk'), 'plate': dict(pos=PLATE, kind='the plate with the first bite'),
}
place = dict(set='s1_apron', kind='day', light='morning', light_over=meta['light']['day'], kit3d=dict(envGround='#a7a6a3'), air=1, wind=1, backdrop=30)
film = {
    'title': 'The Man Who Ate An Airplane, S1 THE HOOK (lines 1-2, frames 0-256)',
    'fps': 30, 'size': [1080, 1920], 'words': 'voice/words.json', 'start': 0, 'end': 257,
    'camera': {'v2': True}, 'camsafe': True, 'kit3d': {'pbr': True, 'relief': True, 'sky': True, 'trees': False},
    'tween': {'frames': 0, 'face_frames': 0, 'ones': True}, 'auto_view': False,
    'puppet_pkg': ['moves', '.', 'cast', '../../../templates/vector2d_characters/code'],
    'cast': cast, 'face_shadow': True,
    'costume_shade': dict(keys['costume_shade'], keep_drawn_light=True, smooth=40),
    'card_shade': dict(keys['card_shade'], amount=0, rim_amount=0),
    'post': {'dof': 0.0, 'dust': 0.4, 'bloom': 1, 'vignette': 0},
    'places': {'apron': place}, 'props': props, 'acts': acts, 'held3d': held3d,
    'kicks': [{'at': 121, 'amp': 2}],
    'fx': [dict(at=124, kind='glint', pos=[5.8, -1.45, 2.15], note='row 5 POWER 1: the fork-tine glint'), dict(at=20, kind='glint', pos=TIP, note='row 1: the sun catches the salted tip')],
    'moods': [dict(at=121, look='flash_white', note='row 5 POWER 1 impact (with the set impact frame f121-123)')],
    'sentences': [dict(text='In 1978, a French guy looked at an airplane... and thought: Lunch!', words=[0, 11], subject='michel', nouns=[dict(word='airplane', show='plane')]),
                  dict(text='Michel Lottito cut a whole Cessna into tiny metal bites.', words=[12, 21], subject='michel', nouns=[dict(word='Cessna', show='plane'), dict(word='bites', show='plate')])],
    'takes': [{'id': 's1', 'place': 'apron', 'stations': stations}],
}
json.dump(film, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
print('film.json written:', len(acts), 'acts,', len(stations), 'stations')

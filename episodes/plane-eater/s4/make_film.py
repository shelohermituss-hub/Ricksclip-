"""make_film.py: writes the S4 films of plane-eater (PICTURE_PLAN rows 23-34, film 21.28-31.44 s = frames 638-942). S4 stretch builder 2026-11-22 (DRAFT).
Two passes joined by a DISSOLVE ON THE MOVE (blend.py, 662-672, row 24 "M20 dissolve while flying"):
  film_A.json  clinic (sets/xray): row 23, the Doctor's double take holds (jaw drop, glasses at the nose tip), Michel behind him pats his belly; the camera backs out.
  film_B.json  apron (sets/s4_apron.js): rows 24-34, the two-year time-lapse, the spinner, "dessert?", the cake tower, the coffin catch, the record, the medal bite.
film.json = film_B (the checks read it); film_A is checked on its own window. Edit this file, not the json. Plan metres X east, Y north, Z up."""
import json, os, copy
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
keys = json.load(open(os.path.join(EP, 'cast', 'CAST_KEYS.json')))
meta = json.load(open(os.path.join(EP, 'sets', 'apron', 'out', 'apron_meta.json')))
Z = 0.03
def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.003, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)
base = {
    'fps': 30, 'size': [1080, 1920], 'words': 'voice/words.json',
    'camera': {'v2': True}, 'camsafe': True, 'tween': {'frames': 0, 'face_frames': 0, 'ones': True},
    'puppet_pkg': ['moves', '.', 'cast', '../../../templates/vector2d_characters/code'], 'face_shadow': True,
    'costume_shade': dict(keys['costume_shade'], keep_drawn_light=True, smooth=40),
    'card_shade': dict(keys['card_shade'], amount=0, rim_amount=0),
}
# ------------------------------------------------------------------ PASS A: the clinic, row 23 (638-672)
DOC = [-0.22, 1.42, 0.0]; FILM = [0.11, 2.085, 1.47]
MI_CL = [-0.8, 1.15, 0.0]                      # behind the Doctor's far shoulder, free of the light box (the camera sees both from the desk side)
actsA = [
    dict(who='doctor', at=519, pos=DOC, view='34', dir=-1, pose='m:../../ep_s3/dr_lean', face='k:peJawDrop', look=FILM, note='row 23: S3 hands him over mid DOUBLE TAKE (snap back 633), jaw drop, glasses at the nose tip'),
    dict(who='doctor', at=650, face='k:shocked', look=FILM, note='row 23: frozen, the man of science is the only one shocked'),
    dict(who='michel', at=519, pos=MI_CL, view='34', dir=1, pose='m:../../ep_s4b/mi_clinic', face='k:proud', look='doctor', note='row 23: behind the Doctor, pats his belly politely (646, 652), normal day'),
    dict(who='michel', at=656, face='k:happy', look='doctor', note='row 23: a small polite bow'),
]
stA = [st(638, [0.52, 1.30, 1.47], [-0.25, 1.70, 1.30], 20, 'doctor', 'M', 'ROW 23 "slid THROUGH." (EXPLAIN reaction, M07 reversed: backs out of the film): the Doctor jaw-dropped at the film, Michel calm behind him', hold=0.0, shows=['film']),
       st(672, [1.25, -0.05, 1.42], [-0.45, 1.55, 1.2], 20, 'doctor', 'W', 'ROW 23 end (still backing out, dissolve source): both men, the glowing film', hold=0.0)]
xr = dict(keys=[dict(f=505, flicker=0, puff=1, ride=1)], tone=dict(lining=.35, backdrop=.6, bands=.8, key=.5, lining_color='#4a86c8', backdrop_color='#2f6fb3'))
filmA = dict(base, title='plane-eater S4 pass A: clinic, row 23 (638-672)', start=638, end=673,
    kit3d={'pbr': True, 'relief': True, 'sky': False, 'trees': False}, auto_view=False, post={'dof': 0.0, 'dust': 0.3, 'bloom': 0.35, 'vignette': 0},
    cast={k: dict(keys['cast'][k], walk_speed=99) for k in ['doctor', 'michel']},
    places={'xray': dict(set='xray', kind='am', light='day', xray=xr, kit3d=dict(envGround='#a9c4bd'))},
    props={'film': dict(pos=FILM, kind='the X-ray film with the tiny bite-Cessna')}, acts=actsA,
    takes=[{'id': 'A', 'place': 'xray', 'stations': stA}])
# ------------------------------------------------------------------ PASS B: the apron, rows 24-34 (660-942)
MICHEL = [3.4, -1.0, Z]; DECK = [5.8, -3.7, Z]; CRADLE = [1.6, -1.3, Z]
TABLE_LOOK = [3.4, -0.2, 0.9]; TOWER = [3.25, 1.55, 3.0]
OWN = ['owner', 'ownerBeardS', 'ownerBeardM', 'ownerBeardL', 'ownerBeardXL']
SWAP = [660, 679, 686, 694, 701]                # the beard grows on the words: two 679, years 686, to 694, finish 701 (S chest, M belly, L hem, XL knees)
actsB = [dict(who='michel', at=0, pos=MICHEL, pose='m:../../ep_s4/mi_s4', look=TABLE_LOOK, look_full=True, note='rows 24-34: one seated move (time-lapse eating, spinner, bell, catch, certificate, bite)')]
for a, fc, n, lk in [(662, 'peChew', 'row 25 time-lapse: eats, never looks up', TABLE_LOOK), (703, 'aim', 'row 26: picks the spinner', TABLE_LOOK), (713, 'peChew', 'row 26 PLANE: pops it like a cherry', TABLE_LOOK),
                     (718, 'proud', 'row 26: dabs his mouth, deep satisfaction', TABLE_LOOK), (728, 'standard', 'row 27 planned stillness', TABLE_LOOK), (737, 'browUp', 'row 27 DESSERT?: rings the bell', TABLE_LOOK),
                     (755, 'happy', 'rows 28-30: thrilled, watches the tower rise', TOWER), (841, 'nervousSmile', 'row 31: the coffin topples, he catches it', [3.6, -0.7, 1.6]),
                     (858, 'proud', 'row 31-32: relief, then the cloche', [3.47, -0.42, 0.9]), (894, 'proud', 'row 33 STRANGEST: certificate up, chest out', TABLE_LOOK),
                     (912, 'peChew', 'row 34 DIET: bites the frame like a medal', TABLE_LOOK), (930, 'happy', 'row 34: calm delight', TABLE_LOOK)]:
    actsB.append(dict(who='michel', at=a, face='k:' + fc, look=lk, look_full=True, note=n))
for i, (who, f0) in enumerate(zip(OWN, SWAP)):
    actsB.append(dict(who=who, at=0, pos=DECK, view='34', dir=1, visible=False, note='hidden until his beat'))
    actsB.append(dict(who=who, at=f0, pos=DECK, view='34', dir=1, visible=True, pose='m:../../ep_s4o/ow_deck', face='k:browUp' if i < 2 else 'k:think', look='michel', note='row 25: waits in the deck chair, rag in his lap; beard %s' % (who[10:] or 'none')))
    if i < 4: actsB.append(dict(who=who, at=SWAP[i + 1], visible=False, note='beard swap'))
actsB += [dict(who='ownerBeardXL', at=713, face='k:peJawDrop', look='michel', note='row 26: the jaw drops into the beard'),
                    dict(who='ownerBeardXL', at=740, pos=CRADLE, view='34', dir=-1, pose='m:../../ep_s4b/ow_stare', face='k:shocked', look='michel', look_full=True, note='rows 33-34: stands at the empty cradle, beard to his knees, rag down, stares (moved while the camera is on the cloche)')]
H = lambda who, obj, b, f0, f1, hand='R', grip='handle', module='sets/s4_apron.js', **kw: dict(who=who, obj=obj, module=module, builder=b, opts={}, grip=grip, hand=hand, when='always', f0=f0, f1=f1, **kw)
held3d = [H('michel', 'fork', 'buildFork', 662, 702, grip='raise', module='sets/pe_props.js', anchor='grip', tip='tip', note='row 25: time-lapse fork'),
          H('michel', 'spinner', 'buildSpinner', 704, 713, grip='point', note='row 26: the spinner, like a cherry'),
          H('michel', 'bell', 'buildBell', 737, 752, note='row 27: the silver table bell'),
          H('michel', 'cloche', 'buildCloche', 860, 880, note='row 32: his near hand lifts the cloche off the book'),
          H('michel', 'plate', 'buildPlate', 830, 855, angle=[[830, 0]], note='row 31: plate up, the coffin lands on it at 850'),
          H('michel', 'certificate', 'buildCert', 882, 942, hand='L', angle=[[882, -90], [894, -80], [906, -80], [912, -75]], note='rows 33-34: STRANGEST DIET EVER, bitten corner from 913')]
for who, f0, f1 in zip(OWN, SWAP, SWAP[1:] + [740]):
    held3d.append(H(who, 'rag', 'buildRag', f0, f1 - 1, grip='hang', module='sets/pe_props.js', anchor='grip', note='the yellow rag in his lap'))
held3d.append(H('ownerBeardXL', 'rag', 'buildRag', 740, 942, grip='hang', module='sets/pe_props.js', anchor='grip', note='rows 33-34: the rag hangs from his hand'))
PASSES = [   # (id, render from, render to, stations): one take each, joined by DISSOLVES (blend.py) instead of fast camera moves (camera p90 <= 22)
    ('B1', 660, 712, [st(660, [9.4, -2.9, 2.8], [1.6, -3.0, 1.0], 18, 'michel', 'W', 'ROWS 24-25 "It TOOK him two YEARS" (PLACE + EXTREME 2, M00 living rest, slow drift): the owner in his deck chair in front (beard clock), Michel at the table, the Cessna shrinking slice by slice, seasons', creep=0.0, shows=['table', 'plane', 'deck']),
                      st(712, [9.1, -2.8, 2.7], [1.7, -2.9, 1.0], 18, 'michel', 'W', 'ROW 25 end: drift', travel=1.7, hold=0.0, creep=0.0)]),
    ('B2', 705, 745, [st(705, [5.6, -1.85, 1.5], [3.45, -0.85, 1.28], 28, 'michel', 'C', 'ROWS 26-27 "to finish the PLANE, and for DESSERT?" (M02 slow push): the spinner cherry, the napkin dab, the stillness, the bell', creep=0.0, shows=['table']),
                      st(745, [5.25, -1.7, 1.45], [3.45, -0.85, 1.3], 28, 'michel', 'C', 'push', travel=1.3, hold=0.0, creep=0.0)]),
    ('B3', 738, 847, [st(738, [7.7, -0.3, 2.0], [2.6, 3.4, 1.7], 22, 'trolley', 'W', 'ROW 27-28 (M12): the work lamps snap on, the trolley rolls out of the hangar toward the table', creep=0.0, shows=['trolley']),
                      st(772, [7.7, -0.5, 2.3], [3.25, 1.55, 2.4], 22, 'tower', 'W', 'ROW 28 "BIKES," (M18 crane up starts)', travel=1.1, hold=0.0, creep=0.0, shows=['tower']),
                      st(840, [6.7, -0.3, 3.9], [3.25, 1.55, 3.35], 22, 'tower', 'W', 'ROWS 29-31 carts, TVs, the coffin topper wobbles (M18 up the tower, slow)', travel=2.2, hold=0.0, creep=0.0, shows=['tower'])]),
    ('B4', 840, 891, [st(840, [5.6, -2.3, 1.75], [3.1, -1.0, 1.45], 22, 'michel', 'M', 'ROWS 31-32 COFFIN (the coffin drops into frame onto his plate) + GUINNESS (his hand lifts the cloche off the book)', creep=0.0, shows=['table', 'book']),
                      st(891, [5.3, -2.15, 1.6], [3.1, -1.05, 1.35], 22, 'michel', 'M', 'push', travel=1.6, hold=0.0, creep=0.0)]),
    ('B5', 884, 942, [st(884, [5.15, -2.05, 1.6], [3.2, -1.2, 1.45], 26, 'michel', 'C', 'ROWS 33-34 STRANGEST DIET EVER up, POWER 3 flashes, the medal bite, the owner stares from the cradle', creep=0.0, shows=['cert']),
                      st(942, [4.95, -1.95, 1.55], [3.15, -1.25, 1.4], 26, 'michel', 'C', 'slow push', travel=1.9, hold=0.0, creep=0.0)]),
]
stB = [x for p in PASSES for x in p[3]]
props = {
    'table': dict(pos=[3.4, -0.32, 0.8], kind='the white-cloth table under the wing'),
    'plane': dict(pos=[0, 0.8, 1.0], kind='the sliced Cessna, eaten tail first'),
    'deck': dict(pos=[DECK[0], DECK[1], 0.8], kind='the owner in his deck chair, beard growing'),
    'trolley': dict(pos=[2.4, 5.6, 1.0], kind='the dessert trolley rolling out of the hangar'),
    'tower': dict(pos=TOWER, kind='the cake tower: bikes, carts, TVs, coffin'),
    'book': dict(pos=[3.47, -0.42, 0.85], kind='BOOK OF RECORDS + certificate under the cloche'),
    'cert': dict(pos=[3.6, -0.75, 1.45], kind='the STRANGEST DIET EVER certificate'),
}
light = dict(meta['light']['day'], top='#1a86f2', hor='#cfe6ff', sun='#fff6e6', si=4.6, amb='#e6edf7', ai=2.0, tint='#ffffff')   # bright noon from the first frame (S2 lesson); s4_apron.js turns it to dusk
filmB = dict(base, title='The Man Who Ate An Airplane, S4 TWO YEARS / DESSERT / RECORD (lines 6-8a, frames 660-942), DRAFT', start=660, end=943,
    kit3d={'pbr': True, 'relief': True, 'sky': True, 'trees': False}, post={'dof': 0.0, 'dust': 0.3, 'bloom': 1, 'vignette': 0},
    cast={k: dict(keys['cast'][k], walk_speed=99) for k in ['michel'] + OWN},
    places={'apron': dict(set='s4_apron', kind='day', light='day', light_over=light, air=0.3, wind=1)}, props=props, acts=actsB, held3d=held3d,
    moods=[dict(at=740, look='warm_up', note='row 27: the work lamps snap on'), dict(at=894, look='flash_white', note='row 33 POWER 3: every flashbulb fires at once')],
    kicks=[{'at': 850, 'amp': 1}, {'at': 894, 'amp': 2}],
    fx=[dict(at=740, kind='glint', pos=[3.6, -0.7, 1.25], note='row 27: bell ring'),
        dict(at=713, kind='glint', pos=[3.5, -0.9, 1.35], note='row 26: the spinner pop'),
        *[dict(at=a, kind='glint', pos=p, note='row 32-34: a flashbulb in the dark hangar doorway') for a, p in [(866, [-1.5, 9.2, 1.8]), (880, [1.8, 9.2, 1.6]), (894, [0.2, 9.2, 1.9]), (896, [-2.5, 9.2, 1.7]), (898, [2.6, 9.2, 1.8]), (918, [-0.8, 9.2, 1.7]), (930, [1.3, 9.2, 1.8])]],
        dict(at=913, kind='shine', pos=[3.55, -0.85, 1.42], note='row 34: sparkle on the bite mark')],
    takes=[{'id': p[0], 'place': 'apron', 'stations': p[3]} for p in PASSES])
json.dump(filmA, open(os.path.join(HERE, 'film_A.json'), 'w'), indent=1)
for p in PASSES:
    F = copy.deepcopy(filmB); F['takes'] = [{'id': p[0], 'place': 'apron', 'stations': p[3]}]; json.dump(F, open(os.path.join(HERE, 'film_%s.json' % p[0]), 'w'), indent=1)
json.dump(filmB, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
print('film_A.json (%d acts) + film_B.json = film.json (%d acts, %d held3d, %d stations) written' % (len(actsA), len(actsB), len(held3d), len(stB)))

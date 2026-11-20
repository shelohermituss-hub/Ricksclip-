# TEST ONLY: one film_<tile>.json per tile (one place each, so only one big GLB is in the page). Run by run_kit.sh.
import json
LIGHT = dict(top='#3e7fd2', hor='#cfe0f0', sun='#fff3dc', si=2.9, amb='#aebfdb', ai=1.2, dir=[-5, 6.5, 6], tint='#fffaf0', card_gain=1.0)   # = sets/_hero_test
F34 = dict(pos=[-9.6, -8.4, 2.3], aim=[-.4, 0, 1.3], lens=72)
FIST = dict(pos=[-.3, -4.6, 1.3], aim=[.35, -2.2, 1.2], lens=110)
TILES = {
  'kit_afe_red':  (dict(asset='afe', paint='red'), F34, False),
  'kit_afe_half': (dict(asset='afe', paint='half', edge=.3), F34, False),
  'kit_alf_orig': (dict(asset='alf', paint='orig'), F34, False),
  'kit_gun_fist': (dict(asset='afe', paint='half', edge=.3), FIST, True),
  'kit_afe_red_portrait': (dict(asset='afe', paint='red'), dict(pos=[-6.2, -4.9, 1.9], aim=[-.3, 0, 1.25], lens=24), False),   # timing at 1080x1920
}
for name, (truck, cam, gun) in TILES.items():
  place = dict(set='asset_yard', light='day', time='day', light_over=LIGHT, kit3d=dict(envGround='#8f8a7e'), set_key=name, **truck)
  film = dict(title='asset test (test only) ' + name, fps=30, size=[1080, 1920] if 'portrait' in name else [1200, 900], words='words.json', end=2, tween=dict(frames=0, face_frames=0, ones=True), auto_view=False,
    cast=dict(fireman=dict(puppet='cast:firefighter', height=1.75, heads_tall=2.9, walk_speed=9999)),
    costume_shade=dict(amount=.45, start=.35, cool=.15, smooth=40, keep_drawn_light=True), face_shadow=True,
    kit3d=dict(pbr=True, relief=True, sky=True, trees=False), post=dict(dof=0.0, dust=0, bloom=1, vignette=.35),
    places=dict(yard=place), props=dict(truck=dict(pos=[0, 0, 1.4], kind='the fire truck')),
    acts=[dict(who='fireman', at=0, pos=[1.0, -2.2, 0] if gun else [30, 30, 0], view='34', dir=-1, pose='hold_out', face='cool', hand='R', prop='spray_gun')],
    takes=[dict(id=name, place='yard', stations=[dict(at=0, subject='truck', framing='W', hold=0, **cam)])])
  if gun: film['held3d'] = [dict(who='fireman', obj='spray_gun', module='sets/asset_props.js', builder='buildAssetGun', opts={}, grip='handle', face='out', hand='R', anchor='grip', tip='tip', when='always', scale=1.7)]
  json.dump(film, open('film_%s.json' % name, 'w'), indent=1)
json.dump([dict(w='truck', s=0.0, e=.3)], open('words.json', 'w'))
print(' '.join(TILES))

# PROOF ONLY: film_<tile>.json for the three.js kit tiles of props/ASSET_PACK.jpg (run by ../run_proof.sh). Cameras = the Blender proof cameras
# (bl_proof.py: lens 35 on a 36 mm HORIZONTAL sensor at 4:3 = lens 46.7 on the kit's 36 mm vertical rule).
import json
LIGHT = dict(top='#3e7fd2', hor='#cfe0f0', sun='#fff3dc', si=2.9, amb='#aebfdb', ai=1.2, dir=[-5, 6.5, 6], tint='#fffaf0', card_gain=1.0)
F34 = dict(pos=[-9.0, -7.6, 2.6], aim=[-.5, 0, 1.15], lens=46.7)
FIST = dict(pos=[-.3, -4.6, 1.3], aim=[.35, -2.2, 1.2], lens=110)
TILES = {
  'kit_truck_half_f34': (dict(paint='half', edge=.3, masking=True, letters='under', ribbon=True), F34, False),
  'kit_gun_fist': (dict(paint='half', edge=.3, masking=True, letters='under', ribbon=False), FIST, True),
}
for name, (truck, cam, gun) in TILES.items():
  place = dict(set='assets_proof_yard', light='day', time='day', light_over=LIGHT, kit3d=dict(envGround='#8f8a7e'), **truck)
  film = dict(title='asset pack proof ' + name, fps=30, size=[800, 600], words='words.json', end=2, tween=dict(frames=0, face_frames=0, ones=True), auto_view=False,
    cast=dict(fireman=dict(puppet='cast:firefighter', height=1.75, heads_tall=2.9, walk_speed=9999)),
    costume_shade=dict(amount=.45, start=.35, cool=.15, smooth=40, keep_drawn_light=True), face_shadow=True,
    kit3d=dict(pbr=True, relief=True, sky=True, trees=False), post=dict(dof=0.0, dust=0, bloom=1, vignette=0),
    places=dict(yard=place), props=dict(truck=dict(pos=[0, 0, 1.4], kind='the fire truck')),
    acts=[dict(who='fireman', at=0, pos=[1.0, -2.2, 0] if gun else [30, 30, 0], view='34', dir=-1, pose='hold_out', face='cool', hand='R', prop='spray_gun')],
    takes=[dict(id=name, place='yard', stations=[dict(at=0, subject='truck', framing='W', hold=0, **cam)])])
  if gun: film['held3d'] = [dict(who='fireman', obj='spray_gun', module='sets/assets.js', builder='buildSprayGun', opts={}, grip='handle', face='out', hand='R', anchor='grip', tip='tip', when='always', scale=1.7)]
  json.dump(film, open('film_%s.json' % name, 'w'), indent=1)
print(' '.join(TILES))

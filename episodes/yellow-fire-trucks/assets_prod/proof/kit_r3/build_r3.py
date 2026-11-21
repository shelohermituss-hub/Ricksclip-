# PROOF ONLY: film_<tile>.json for the round-3 kit tiles of props/PROPS_R3.jpg (cameras = bl_proof3.py cameras: lens 35 on a 36 mm horizontal sensor at 4:3
# = lens 46.7 on the kit's vertical rule; 640x480).
import json
LIGHT = dict(top='#3e7fd2', hor='#cfe0f0', sun='#fff3dc', si=2.9, amb='#aebfdb', ai=1.2, dir=[-5, 6.5, 6], tint='#fffaf0', card_gain=1.0)
CAM = {'hero': dict(pos=[-8.4, -5.6, 1.5], aim=[-1.6, 0, 1.0], lens=46.7), 'rear': dict(pos=[6.6, -3.2, 1.7], aim=[3.0, 0, 1.2], lens=46.7),
       'light': dict(pos=[-11.0, -8.0, 3.4], aim=[-0.5, 0, 1.5], lens=46.7), 'lawn': dict(pos=[-0.4, -6.6, 1.9], aim=[0.0, 0.2, 0.5], lens=46.7)}
for mode, cam in CAM.items():
  place = dict(set='proof_r3', light='day', time='day', light_over=LIGHT, kit3d=dict(envGround='#8f8a7e'), mode=mode)
  film = dict(title='props r3 proof ' + mode, fps=30, size=[640, 480], words='words.json', end=2, tween=dict(frames=0, face_frames=0, ones=True), auto_view=False,
    cast=dict(fireman=dict(puppet='cast:firefighter', height=1.75, heads_tall=2.9, walk_speed=9999)),
    kit3d=dict(pbr=True, relief=True, sky=True, trees=False), post=dict(dof=0.0, dust=0, bloom=1, vignette=0),
    places=dict(yard=place), props=dict(truck=dict(pos=[0, 0, 1.4], kind='the fire truck')),
    acts=[dict(who='fireman', at=0, pos=[60, 60, 0], view='34', dir=-1, pose='stand', face='cool')],
    takes=[dict(id='r3_' + mode, place='yard', stations=[dict(at=0, subject='truck', framing='W', hold=0, **cam)])])
  json.dump(film, open('film_r3_%s.json' % mode, 'w'), indent=1)
print(' '.join(CAM))

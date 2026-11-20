# Test film for the hero truck proof sheet: one take (= one camera) per tile, 2 frames each. Writes film.json + words.json. Run by run.sh.
import json
LIGHT = dict(top='#3e7fd2', hor='#cfe0f0', sun='#fff3dc', si=2.9, amb='#aebfdb', ai=1.05, dir=[-5, 6.5, 6], tint='#fffaf0', card_gain=1.0)
def place(key, **k): return dict(set='hero_yard_test', light='day', time='day', light_over=LIGHT, set_key=key, **k)
places = dict(red=place('red', truck=dict(paint='red')), yellow=place('yellow', truck=dict(paint='yellow')),
              half=place('half', truck=dict(paint='half', masking=True, edge=.3), kit=True, hose_to=[.95, -2.25, .02]),
              kitp=place('kitp', truck=dict(paint='half', masking=True, edge=.3), kit=True, gun_on_floor=True, hose_to=[1.3, -3.2, .1]))
F34 = dict(pos=[-9.6, -8.4, 2.3], aim=[-.4, 0, 1.3], lens=72); SIDE = dict(pos=[0, -13.5, 1.7], aim=[0, 0, 1.4], lens=66); R34 = dict(pos=[9.4, 8.6, 2.8], aim=[.3, 0, 1.3], lens=72)
TILES = [('red_front34', 'red', F34), ('red_side', 'red', SIDE), ('red_rear34', 'red', R34),
         ('yellow_front34', 'yellow', F34), ('yellow_side', 'yellow', SIDE), ('yellow_rear34', 'yellow', R34),
         ('half_front34', 'half', F34), ('half_side', 'half', SIDE), ('half_rear34', 'half', R34),
         ('scale_fireman', 'half', dict(pos=[2.4, -9.2, 1.5], aim=[.3, -1.0, 1.35], lens=58)),
         ('pump_panel', 'red', dict(pos=[-1.0, -3.3, 1.5], aim=[-1.34, -1.16, 1.36], lens=50)),
         ('door_lettering', 'red', dict(pos=[-3.3, -3.2, 1.6], aim=[-2.77, -1.2, 1.5], lens=80)),
         ('spray_kit', 'kitp', dict(pos=[1.2, -5.0, .75], aim=[2.05, -3.15, .3], lens=62)),
         ('gun_in_fist', 'half', dict(pos=[.2, -4.6, 1.3], aim=[.9, -2.0, 1.1], lens=90)),
         ('hose_bed_rear', 'yellow', dict(pos=[7.2, -3.4, 3.6], aim=[2.6, 0, 1.6], lens=62)),
         ('front_face', 'red', dict(pos=[-7.6, -1.6, 1.5], aim=[-3.9, 0, 1.45], lens=58))]
takes = [dict(id=n, place=p, stations=[dict(at=i * 2, subject='truck', framing='W', hold=0, **cam)]) for i, (n, p, cam) in enumerate(TILES)]
film = dict(title='hero truck proof (test only)', fps=30, size=[1200, 900], words='words.json', end=len(TILES) * 2, tween=dict(frames=0, face_frames=0, ones=True), auto_view=False,
  cast=dict(fireman=dict(puppet='cast:firefighter', height=1.75, heads_tall=2.9)),
  costume_shade=dict(amount=.45, start=.35, cool=.15, smooth=40, keep_drawn_light=True), face_shadow=True,
  kit3d=dict(pbr=True, relief=True, sky=True, trees=False), post=dict(dof=0.0, dust=0, bloom=1, vignette=.35),
  places=places, props=dict(truck=dict(pos=[0, 0, 1.4], kind='the fire truck')),
  acts=[dict(who='fireman', at=18, pos=[1.0, -2.2, 0], view='34', dir=-1, pose='hold_out', face='cool', hand='R', prop='spray_gun'), dict(who='fireman', at=20, visible=False),
        dict(who='fireman', at=26, visible=True), dict(who='fireman', at=28, visible=False)],
  held3d=[dict(who='fireman', obj='spray_gun', module='sets/hero_props.js', builder='buildSprayGun', opts=dict(hose=.9, spray=True), grip='handle', face='out', hand='R', anchor='grip', tip='tip', when='always', scale=1.0)],
  takes=takes)
json.dump(film, open('film.json', 'w'), indent=1); json.dump([dict(w='truck', s=0.0, e=.3)], open('words.json', 'w'))
json.dump([n for n, _, _ in TILES], open('tiles.json', 'w'))
print('film.json:', len(TILES), 'tiles')

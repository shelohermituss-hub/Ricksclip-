# map_api.py: the controls of PLACE C, THE MAP inside Blender (final render); twins of sets/map.js (kit). import sys; sys.path.append(<scripts>); import map_api as MA
#   MA.set_doors(scene, t, wave=2.4, dur=.5)   door wave west -> east: station i opens over [t0_i, t0_i + dur], t0_i = wave * (x_i - xmin) / (xmax - xmin); t<0 shut, big t open
#   MA.set_paint(scene, t=None, lime=True)      truck noses: all lime/red, or per station by the same wave timing (lime once its door has opened)
#   MA.set_sand(scene, v)                      0..1 the paper around DALLAS turns to sand (S4 -> S5 join)
#   MA.LIGHT / MA.KIT_LIGHT                     bleached map day (Blender sun/sky) and the same for the kit (places.<name>.light_over)
import bpy, math
STUCK = 'DENVER'          # PROPS.md: "one door stuck half up"
def _st(): return [o for o in bpy.data.objects if o.get('map_station')]
def _wave(o, t, wave, dur, xs):
    x0, x1 = min(xs), max(xs); t0 = wave * (o.location.x - x0) / max(1e-6, x1 - x0); return max(0., min(1., (t - t0) / dur))
def set_doors(sc, t=99., wave=2.4, dur=.5):
    st = _st(); xs = [o.location.x for o in st]
    for o in st:
        k = _wave(o, t, wave, dur, xs)
        for i, d in enumerate(c for c in o.children if c.get('map_door') is not None):
            kk = min(k, .5) if (o['map_station'] == STUCK and i == 1) else k; d.scale.z = max(.03, 1 - kk); o['open'] = k
def set_paint(sc, t=None, lime=True, wave=2.4, dur=.5):
    st = _st(); xs = [o.location.x for o in st]; L, R = bpy.data.collections['LIME'], bpy.data.collections['RED']
    for o in st:
        on = lime if t is None else (_wave(o, t, wave, dur, xs) >= 1)
        for c in o.children:
            if c.get('map_truck') is not None: c.instance_collection = L if on else R
def set_sand(sc, v):
    o = bpy.data.objects.get('sand_blend'); m = bpy.data.materials['sand_blend']; m.node_tree.nodes['SAND'].outputs[0].default_value = v
    if o: o.hide_render = v <= 0
LIGHT = dict(sun='#fff4e2', sun_e=4.2, sun_az=232., sun_el=52., sky_top='#8fb3ef', sky_hor='#e9eef4', world=1.1)
KIT_LIGHT = dict(top='#8fb3ef', hor='#e9eef4', sun='#fff4e2', si=3.2, amb='#c9d3ee', ai=1.35, tint='#fffaf0', card_gain=1.0,
                 dir=[round(10 * math.cos(math.radians(52)) * math.cos(math.radians(232)), 2), round(10 * math.sin(math.radians(52)), 2), round(-10 * math.cos(math.radians(52)) * math.sin(math.radians(232)), 2)])

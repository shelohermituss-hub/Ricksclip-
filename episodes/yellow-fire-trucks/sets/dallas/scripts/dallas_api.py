# dallas_api.py: the controls of PLACE B (Dallas station yard, hot noon) INSIDE Blender (final render), twins of sets/dallas.js in three.js.
#   import sys; sys.path.append('<sets/dallas/scripts>'); import dallas_api as DA
#   DA.set_light(scene)                         the one LOOK_BIBLE light of Dallas: NO noon (high white-hot sun, short hard shadows, pale sky bounce)
#   DA.set_boards(scene, n=3, ladder=True, stool=False, painters=True, leaves=0)   story states: red stack 1-3 boards, ladder up, the painters' gear, calendar leaves torn
#   DA.set_trucks(scene, red=dict(paint='red'), lime=dict(paint='lemon'))         truck_api.set_paint keys; DA.red_root(), DA.lime_root()
import bpy, math, os, sys
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__))
AP_SCRIPTS = os.path.normpath(os.path.join(HERE, '..', '..', '..', 'assets_prod', 'scripts'))
if AP_SCRIPTS not in sys.path: sys.path.append(AP_SCRIPTS)
def lin(h):
    h = h.lstrip('#'); v = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [(c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4) for c in v] + [1.]
# NO noon: sun from the south-south-west (az 247.5 = direction TO the sun, from +X east, counter-clockwise), 70 degrees up: the station front and the
# board faces (all facing south) are lit, shadows are short and fall north-north-east. Sky: the palest of the film (CREATIVE #9CBDF2), bleached horizon.
LIGHT = dict(sun_col='#fff3d0', sun_e=4.6, sun_az=247.5, sun_el=70., sky_top='#8fb4ee', sky_hor='#e9eef4', ground='#cdb690', world=1.0)
def _kit_dir(az, el, d=10.):
    a, e = math.radians(az), math.radians(el); x, y, z = math.cos(e) * math.cos(a) * d, math.cos(e) * math.sin(a) * d, math.sin(e) * d
    return [round(x, 2), round(z, 2), round(-y, 2)]
KIT_LIGHT = {'no': dict(top='#8fb4ee', hor='#e9eef4', sun='#fff3d0', si=3.3, amb='#dfe5ef', ai=1.35, dir=_kit_dir(247.5, 70.), tint='#fffaf0', card_gain=1.0)}
def _world(sc):
    w = sc.world or bpy.data.worlds.new('DALLAS_SKY'); sc.world = w; w.use_nodes = True; nt = w.node_tree; N, L = nt.nodes, nt.links
    if 'dal_ramp' in N: return N
    for n in list(N): N.remove(n)
    tc = N.new('ShaderNodeTexCoord'); sp = N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Generated'], sp.inputs[0])
    mr = N.new('ShaderNodeMapRange'); mr.inputs[1].default_value = -.05; mr.inputs[2].default_value = .6; L.new(sp.outputs[2], mr.inputs[0])
    rp = N.new('ShaderNodeValToRGB'); rp.name = 'dal_ramp'; L.new(mr.outputs[0], rp.inputs[0])
    els = rp.color_ramp.elements; els[0].position = 0.; els[1].position = 1.; e2 = els.new(.09); e2.position = .09; e3 = els.new(.3); e3.position = .3
    bg = N.new('ShaderNodeBackground'); bg.name = 'dal_bg'; L.new(rp.outputs[0], bg.inputs[0]); out = N.new('ShaderNodeOutputWorld'); L.new(bg.outputs[0], out.inputs[0])
    return N
def build_lights(sc, anchors):
    def add(name, kind, pos, energy, col, **kw):
        ld = bpy.data.lights.new(name, kind); ld.energy = energy; ld.color = lin(col)[:3]
        for k, v in kw.items(): setattr(ld, k, v)
        o = bpy.data.objects.new(name, ld); o.location = pos; sc.collection.objects.link(o); return o
    add('dal_sun', 'SUN', (0, 0, 60), 6., '#ffffff', angle=math.radians(.6))
    for bx in (-3.2, 3.2): add('lamp_bay', 'AREA', (bx, 28, 4.6), 500., '#f2f4ea', size=4.)   # the bay tubes (the bays read as deep but not black)
    sc['phfd_anchors'] = str(anchors)
def set_light(sc):
    P = LIGHT; N = _world(sc); rp = N['dal_ramp'].color_ramp.elements
    for e, c in zip(sorted(rp, key=lambda e: e.position), [P['ground'], P['sky_hor'], P['sky_hor'], P['sky_top']]): e.color = lin(c)
    N['dal_bg'].inputs[1].default_value = P['world']
    s = bpy.data.objects['dal_sun']; s.data.energy = P['sun_e']; s.data.color = lin(P['sun_col'])[:3]
    a, e = math.radians(P['sun_az']), math.radians(P['sun_el']); d = -Vector((math.cos(e) * math.cos(a), math.cos(e) * math.sin(a), math.sin(e)))
    s.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); sc['phfd_light'] = 'no'
def set_boards(sc, n=3, ladder=True, stool=False, painters=True, leaves=0):
    """story states of the tally: n red boards (1-3), the sectioned ladder, the step stool, the painters' gear (line 13), calendar leaves torn off (0-3)."""
    for o in sc.objects:
        g = o.get('grp', '')
        if not g: continue
        hide = None
        if g == 'stack2': hide = n < 2
        elif g == 'stack3': hide = n < 3
        elif g == 'ladder': hide = not ladder
        elif g == 'stool': hide = not stool
        elif g == 'painters': hide = not painters
        elif g.startswith('cal') and g[3:].isdigit(): hide = int(g[3:]) <= leaves
        if hide is not None: o.hide_render = o.hide_viewport = hide
    sc['dal_boards'] = str(dict(n=n, ladder=ladder, stool=stool, painters=painters, leaves=leaves))
def _paint(root, st):
    import truck_api as T
    keys = ('paint', 'edge', 'drain', 'masking', 'letters', 'wear', 'ribbon', 'a', 'b'); T.set_paint(root, **{k: st[k] for k in keys if k in st}); root['dal_state'] = st
def red_root(): return bpy.data.objects.get('RED_TRUCK')
def lime_root(): return bpy.data.objects.get('LIME_TRUCK')
def link_trucks(sc, truck_blend, anchors, nose_y):
    """the Dallas pair from assets_prod/out/truck.blend as independent copies (own paint): ENGINE No. 14 red (west), ENGINE No. 22 lime (east), noses
    south, nose level at nose_y. Returns {name: root location} so the anchors are the real spots."""
    import truck_api as T
    with bpy.data.libraries.load(truck_blend, link=False) as (src, dst):
        dst.materials = [m for m in src.materials if m in ('mask_paper', 'mask_kraft')]
    out = {}
    for name, an, st, let in (('RED_TRUCK', 'truck_red', dict(paint='red', masking=False, letters='over', wear=.45, ribbon=False), 'truck_letters_dal14'),
                              ('LIME_TRUCK', 'truck_lime', dict(paint='lemon', masking=False, letters='over', wear=.35, ribbon=False), 'truck_letters_dal22')):
        root = T.append_truck(truck_blend, name=name + '_COL'); root.name = name; p = anchors[an]
        root.location = (p[0], p[1], p[2]); root.rotation_euler = (0, 0, math.radians(90)); bpy.context.view_layer.update()
        ys = [(o.matrix_world @ Vector(c)).y for o in T._objs(root) if o.type == 'MESH' for c in o.bound_box]
        root.location.y += nose_y - min(ys); out[an] = [round(root.location.x, 3), round(root.location.y, 3), round(root.location.z, 3)]
        _paint(root, st)
        if let not in bpy.data.images:                      # the letter decals are packed in truck.blend but do not come with the collection: load + pack
            im = bpy.data.images.load(os.path.join(os.path.dirname(truck_blend), let + '.png'), check_existing=True); im.name = let; im.pack(); im.use_fake_user = True
        try: T.set_letters(root, let)
        except Exception as e: print('LETTERS_FAIL', name, e)
        try: T.set_extras(root, sirens=2, beacon_row=True, price_card=False)
        except Exception as e: print('EXTRAS_FAIL', name, e)
    for m in bpy.data.materials: m.use_fake_user = True   # masking swaps materials out: unused ones must survive the save (LECONS 2026-11-20)
    return out
def set_trucks(sc, red=None, lime=None):
    for r, st in ((red_root(), red), (lime_root(), lime)):
        if r is not None and st: s = r['dal_state'].to_dict() if 'dal_state' in r else {}; s.update(st); _paint(r, s)

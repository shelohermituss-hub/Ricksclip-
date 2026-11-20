# truck_api.py: the controls of the production truck INSIDE Blender (final render), the twins of sets/assets.js in three.js.
#   import sys; sys.path.append('<assets_prod>/scripts'); import truck_api as T
#   root = T.append_truck('<assets_prod>/out/truck.blend', name='ENGINE1')      # a new, independent copy (own paint materials)
#   T.set_paint(root, paint='half', edge=0.3, drain=0.0, masking=True, letters='under', wear=0.6, ribbon=False)
#   T.set_wheels(root, metres)   T.set_beacon(root, on=True, angle_deg=0)   T.set_door(root, deg)   T.set_bell(root, deg)
# Frame: metres, front -X, driver side -Y, Z up, origin on the ground at the middle of the wheelbase box.
import bpy, math

RED, LEMON = '#D3141C', '#E3EA22'


def lin(hexs):
    h = hexs.lstrip('#'); v = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4) for c in v] + [1.0]


def _objs(root):
    out = []
    def walk(o):
        out.append(o)
        for c in o.children: walk(c)
    walk(root); return out


def append_truck(blend, name='TRUCK'):
    with bpy.data.libraries.load(blend, link=False) as (src, dst):
        dst.collections = ['TRUCK']
    col = dst.collections[0]; col.name = name
    bpy.context.scene.collection.children.link(col)
    root = next(o for o in col.objects if o.parent is None and o.type == 'EMPTY')
    make_unique(root); return root


def make_unique(root):
    """Own copies of the paint, letters and masking materials, their coordinates pointed at THIS truck's root."""
    done = {}
    for o in _objs(root):
        if o.type != 'MESH': continue
        for sl in o.material_slots:
            m = sl.material
            if m and m.get('phfd_role'):
                if m.name not in done: done[m.name] = m.copy()
                sl.material = done[m.name]
    for m in done.values():
        for n in m.node_tree.nodes:
            if n.type == 'TEX_COORD': n.object = root
    root['phfd_mats'] = [m.name for m in done.values()]


def _paint_groups(root):
    for o in _objs(root):
        if o.type != 'MESH': continue
        for sl in o.material_slots:
            m = sl.material
            if m and m.get('phfd_role') in ('paint', 'letters'):
                for n in m.node_tree.nodes:
                    if n.type == 'GROUP' and n.node_tree and n.node_tree.name.startswith('PHFD_paint'): yield m, n


def set_paint(root, paint='red', edge=0.3, drain=0.0, masking=None, letters='over', wear=0.6, ribbon=None, a=None, b=None):
    """paint: 'red' | 'lemon' | 'half' (front a=red, rear b=lemon). letters 'under' = the gold disappears where coat B covers it."""
    A = a or (LEMON if paint == 'lemon' else RED); B = b or (RED if paint == 'red' else LEMON)
    for m, n in _paint_groups(root):
        n.inputs['colA'].default_value = lin(A); n.inputs['colB'].default_value = lin(B)
        n.inputs['edge'].default_value = edge if paint == 'half' else (99.0 if paint != 'lemon' else -99.0)
        n.inputs['drain'].default_value = drain; n.inputs['wear'].default_value = wear
        n.inputs['drainA'].default_value = 1.0 if A.upper() == RED else 0.0
        n.inputs['drainB'].default_value = 1.0 if B.upper() == RED else 0.0
        if m.get('phfd_role') == 'letters':
            for k in m.node_tree.nodes:
                if k.name == 'under': k.inputs[1].default_value = 1.0 if letters == 'under' else 0.0
    if masking is not None: set_masking(root, masking)
    if ribbon is not None:
        for o in _objs(root):
            if o.get('phfd_part') == 'ribbon': o.hide_render = o.hide_viewport = not ribbon
    root['paint'] = paint; root['edge'] = edge; root['drain'] = drain


def set_masking(root, on):
    paper = bpy.data.materials.get('mask_paper')
    for o in _objs(root):
        if o.type != 'MESH' or not o.get('mask'): continue
        if on:
            if 'mask_orig' not in o: o['mask_orig'] = o.material_slots[0].material.name
            for sl in o.material_slots: sl.material = paper
        elif 'mask_orig' in o:
            for sl in o.material_slots: sl.material = bpy.data.materials[o['mask_orig']]


def _find(root, name):
    return next((o for o in _objs(root) if o.name.split('.')[0] == name or o.get('phfd_part') == name), None)


def set_wheels(root, metres):
    for o in _objs(root):
        if o.get('phfd_part') == 'wheel':
            o.rotation_euler.y = -metres / o['radius']   # rolls forward (-X) for positive metres (axle along Y)


def set_beacon(root, on=True, angle_deg=0.0):
    b = _find(root, 'beacon')
    if b: b.rotation_euler.z = math.radians(angle_deg)
    m = bpy.data.materials.get('beacon_dome')
    for o in _objs(root):
        if o.type == 'MESH' and o.get('phfd_part') == 'beacon_dome':
            for sl in o.material_slots:
                bs = next((n for n in sl.material.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
                if bs: bs.inputs['Emission Strength'].default_value = 6.0 if on else 0.0


def set_door(root, deg):
    d = _find(root, 'door_driver')
    if d: d.rotation_euler.z = -math.radians(deg)   # opens outward toward -Y


def set_bell(root, deg):
    b = _find(root, 'bell_swing')
    if b: b.rotation_euler.y = math.radians(deg)

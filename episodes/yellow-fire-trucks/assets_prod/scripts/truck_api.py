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


def set_paint(root, paint='red', edge=0.3, drain=0.0, masking=None, letters='over', wear=0.6, ribbon=None, a=None, b=None, drain_wipe=None, wipe=None, wipe_from=None, wipe_to=None):
    """paint: 'red' | 'lemon' | 'half' (front a=red, rear b=lemon). letters 'under' = the gold disappears where coat B covers it.
    round 3 WIPES (twins of assets.js setPaint): drain_wipe 0..1 = the dusk drain front runs nose (0) to tail (1) (None = the whole truck at once);
    wipe 0..1 with wipe_from / wipe_to = a repaint running nose to tail (e.g. lime -> red in S7): the half-state edge moves from x -4.3 to +4.3."""
    if wipe is not None:
        paint, a, b, edge = 'half', (wipe_to or RED), (wipe_from or LEMON), -4.3 + 8.6 * wipe
    A = a or (LEMON if paint == 'lemon' else RED); B = b or (RED if paint == 'red' else LEMON)
    for m, n in _paint_groups(root):
        n.inputs['colA'].default_value = lin(A); n.inputs['colB'].default_value = lin(B)
        n.inputs['edge'].default_value = edge if paint == 'half' else (99.0 if paint != 'lemon' else -99.0)
        n.inputs['drain'].default_value = drain; n.inputs['wear'].default_value = wear
        if 'drainEdge' in n.inputs: n.inputs['drainEdge'].default_value = 99.0 if drain_wipe is None else -4.3 + 8.6 * drain_wipe
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
    paper = bpy.data.materials.get('mask_paper'); kraft = bpy.data.materials.get('mask_kraft') or paper
    assert paper is not None, 'mask_paper missing from the .blend (needs use_fake_user, LECONS 2026-11-20)'
    for o in _objs(root):
        if o.type != 'MESH' or not o.get('mask'): continue
        if on:
            if 'mask_orig' not in o: o['mask_orig'] = o.material_slots[0].material.name
            for sl in o.material_slots: sl.material = kraft if o.get('mask') == 2 else paper
        elif 'mask_orig' in o:
            for sl in o.material_slots: sl.material = bpy.data.materials[o['mask_orig']]


def _find(root, name):
    return next((o for o in _objs(root) if o.name.split('.')[0] == name or o.get('phfd_part') == name), None)


def set_wheels(root, metres):
    for o in _objs(root):
        if o.get('phfd_part') == 'wheel':
            o.rotation_euler.y = -metres / o['radius']   # rolls forward (-X) for positive metres (axle along Y)


def set_beacon(root, on=True, angle_deg=0.0, wave=None):
    """wave: None = every beacon of the row steady on/off; a number (radians) = the running pulse of plan row 18 (beacon k peaks at wave = k * 0.9)."""
    b = _find(root, 'beacon')
    if b: b.rotation_euler.z = math.radians(angle_deg)
    for o in _objs(root):
        if o.get('phfd_part') == 'beacon_row':
            k = int(o.name.split('.')[0].split('_')[-1]); o.rotation_euler.z = math.radians(angle_deg + 47 * k)
        if o.type == 'MESH' and o.get('phfd_part') == 'beacon_row_dome':
            k = int(o.parent.name.split('.')[0].split('_')[-1]); lvl = (1.0 if wave is None else max(0.0, math.cos(wave - 0.9 * k)) ** 2) if on else 0.0
            bs = next((n for n in o.material_slots[0].material.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
            if bs: bs.inputs['Emission Strength'].default_value = 8.0 * lvl
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


def set_extras(root, sirens=4, beacon_row=True, price_card=None):
    """The gag gear of plan rows 17-18 (the hero truck only): sirens 0..4, the beacon row on/off, the dealer's card."""
    for o in _objs(root):
        nm = o.name.split('.')[0]
        if nm.startswith('siren_') and o.type == 'EMPTY':
            hide = int(nm.split('_')[1]) > sirens
            for c in _objs(o): c.hide_render = c.hide_viewport = hide
        if nm == 'beacon_bar':
            for c in _objs(o): c.hide_render = c.hide_viewport = not beacon_row
        if nm == 'price_card' and price_card is not None: o.hide_render = o.hide_viewport = not price_card


def set_letters(root, which='truck_letters'):
    """'truck_letters' (ENGINE No. 1), 'truck_letters_e2' (the Chief's ENGINE No. 2), 'truck_letters_dal14' / 'truck_letters_dal22' (Dallas pair)."""
    img = bpy.data.images[which]
    plate = bpy.data.images.get('badges_dallas' if '_dal' in which else 'badges_pine')   # round 3: the period plate follows the town
    for o in _objs(root):
        for sl in getattr(o, 'material_slots', []):
            m = sl.material
            if m and m.get('phfd_role') == 'letters':
                for n in m.node_tree.nodes:
                    if n.type == 'TEX_IMAGE': n.image = img
            if m and m.get('phfd_role_plate') and plate:
                for n in m.node_tree.nodes:
                    if n.type == 'TEX_IMAGE' and n.image and n.image.name.startswith('badges_'): n.image = plate


def set_age(root, age=1.0):
    """The Chief's older pumper: duller, yellowed chrome and brass (own copies), more soot, older paint (wear up)."""
    done = {}
    for o in _objs(root):
        for sl in getattr(o, 'material_slots', []):
            m = sl.material
            if not m or m.get('phfd_role') or m.name.startswith('mask_'): continue
            bs = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None) if m.node_tree else None
            if not bs or bs.inputs['Metallic'].default_value < 0.5 or bs.inputs['Metallic'].links: continue
            if m.name not in done:
                k = m.copy(); k.name = m.name + '_old'; kb = next(n for n in k.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
                kb.inputs['Roughness'].default_value = min(0.6, kb.inputs['Roughness'].default_value + 0.22 * age)
                c = kb.inputs['Base Color'].default_value; kb.inputs['Base Color'].default_value = (c[0] * (1 - .25 * age), c[1] * (1 - .3 * age), c[2] * (1 - .42 * age), 1)
                done[m.name] = k
            sl.material = done[m.name]
    for m, n in _paint_groups(root): n.inputs['wear'].default_value = 0.6 + 0.4 * age

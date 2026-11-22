# film_fixes.py: per-stretch fixes in Blender of what the kit could not draw (stretches.json "fix"). Called by film_lock.py after the lock is built.
import bpy, random, math
from mathutils import Vector

def salt_grains(sc, cfg, K, n=60):
    """salt falling from the shaker cap onto the wing while the shaker is held (S1 rows 1-2): small glinting cubes parented to the shaker,
    plus a fixed scatter on the wing top under the pour (kit: additive sprites, not exported)."""
    e = K['PROPS'].get(('michel', 'salt_shaker'))
    if not e: return
    e = e[0]; gm = bpy.data.materials.new('salt_grain_film'); gm.use_nodes = True; b = gm.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (1, 1, 1, 1); b.inputs['Roughness'].default_value = .15; b.inputs['Emission Color'].default_value = (1, 1, 1, 1); b.inputs['Emission Strength'].default_value = .6
    rnd = random.Random(4)
    for i in range(n):   # in the shaker's own space: below the cap (+Z is the cap; the stream falls along world -Z, approximated in the prop frame)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0)); g = bpy.context.object; g.name = 'salt_fall_%02d' % i; g.data.materials.append(gm)
        c = g.constraints.new('COPY_LOCATION'); c.target = e; c.use_offset = False
        t = rnd.random() ** .8; g.location = (0, 0, 0); g['t'] = t
        g.delta_location = (rnd.gauss(0, .01 + .03 * t), rnd.gauss(0, .01 + .03 * t), .02 - t * .32)
        g.scale = (.006, .006, .006); g.rotation_euler = (rnd.random() * 3, rnd.random() * 3, rnd.random() * 3)
        # COPY_LOCATION ignores delta: put the offset after the constraint with a second, offset-only transform
        c.use_offset = True
    sc['salt_grains'] = n

def apply(sc, cfg, K):
    for name in cfg.get('fix', []):
        fn = globals().get(name)
        if fn: fn(sc, cfg, K); print('FIX', name)

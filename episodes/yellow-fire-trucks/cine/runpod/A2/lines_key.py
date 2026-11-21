"""lines_key.py: the Rick thin-outline SOURCE for a key frame built from the kit (build_*.py, from_lock.py scenes). Runs INSIDE Blender, in the same
session as the beauty render (no second scene load). Same idea as lines_wb2.py (Workbench, flat object colours, about 1 s), adapted:
  - the scene camera is used as it is (no <place>_frames.json, no RickCam);
  - every LINE object gets its own flat colour, every other object is black (it still hides what is behind it);
  - the cast (cards, shadow cards, the 3D fist, anything with pass_index 1), mist volumes and air motes are HIDDEN in this pass:
    composite.py lays the lines UNDER the cards with the card alpha from pass_mask, so a card never gets a line;
  - rendered at ID_W x ID_H (900 x 1600 by default): a 1 px edge there is 1.2 px at 1080 and 0.6 px at 540 (the rule's width).
Usage inside a build script, after the Cycles render:
  import lines_key as LK
  LK.setup(sc, line_objs, hide_objs)        # stores the colours on the objects and the lists in the text block RICK_LINES (saved with a package)
  LK.render(sc, '/abs/out/lines_id.png')    # Workbench render, then the scene's engine / settings / hide flags are restored
On a render machine: LK.render(sc, path) alone (the stored colours and lists are read back from the .blend)."""
import bpy, json, random

ID_W, ID_H = 900, 1600


def setup(sc, line_objs, hide_objs, seed=5):
    rnd = random.Random(seed); lines = set()
    for o in line_objs:
        if o.type in ('MESH', 'CURVE', 'SURFACE', 'META', 'FONT'):
            o.color = (rnd.uniform(.15, 1), rnd.uniform(.15, 1), rnd.uniform(.15, 1), 1); lines.add(o.name)
    for o in sc.objects:
        if o.type in ('MESH', 'CURVE', 'SURFACE', 'META', 'FONT') and o.name not in lines: o.color = (0, 0, 0, 1)
    t = bpy.data.texts.get('RICK_LINES') or bpy.data.texts.new('RICK_LINES'); t.clear()
    t.write(json.dumps(dict(lines=sorted(lines), hide=sorted(o.name for o in hide_objs))))
    return len(lines)


def render(sc, out_png, w=ID_W, h=ID_H):
    st = json.loads(bpy.data.texts['RICK_LINES'].as_string()); r = sc.render
    keep = dict(engine=r.engine, x=r.resolution_x, y=r.resolution_y, pct=r.resolution_percentage, path=r.filepath, ft=r.film_transparent,
                fmt=r.image_settings.file_format, cm=r.image_settings.color_mode, cd=r.image_settings.color_depth, use_comp=r.use_compositing,
                vt=sc.view_settings.view_transform, look=sc.view_settings.look, exp=sc.view_settings.exposure)
    hid = []
    for n in st['hide']:
        o = bpy.data.objects.get(n)
        if o is not None and not o.hide_render: o.hide_render = True; hid.append(o)
    r.engine = 'BLENDER_WORKBENCH'; r.resolution_x, r.resolution_y, r.resolution_percentage = w, h, 100; r.film_transparent = True   # sky = alpha 0 (no world colour to reset)
    r.use_compositing = False; r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGBA'; r.image_settings.color_depth = '8'
    sc.display.render_aa = 'OFF'; sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; sc.view_settings.exposure = 0
    sh = sc.display.shading; sh.light = 'FLAT'; sh.color_type = 'OBJECT'; sh.show_shadows = False; sh.show_cavity = False
    sh.show_object_outline = False; sh.show_specular_highlight = False
    r.filepath = out_png; bpy.ops.render.render(write_still=True)
    for o in hid: o.hide_render = False
    r.engine = keep['engine']; r.resolution_x, r.resolution_y, r.resolution_percentage = keep['x'], keep['y'], keep['pct']; r.filepath = keep['path']
    r.film_transparent = keep['ft']; r.use_compositing = keep['use_comp']; r.image_settings.file_format = keep['fmt']; r.image_settings.color_mode = keep['cm']
    r.image_settings.color_depth = keep['cd']; sc.view_settings.view_transform = keep['vt']; sc.view_settings.look = keep['look']; sc.view_settings.exposure = keep['exp']
    print('LINES_ID', out_png, w, h, 'line objects', len(st['lines']), 'hidden', len(hid))

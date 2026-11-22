"""fix_seq_paths.py: point every image sequence of a package scene.blend at //seq/<folder>/ next to it (packages made before 2026-11-22 fix).
  blender -b runpod/<s>/scene.blend --python look/film/runpod_kit/fix_seq_paths.py"""
import bpy, os
for im in bpy.data.images:
    if im.source == 'SEQUENCE':
        im.filepath = '//seq/' + os.path.basename(os.path.dirname(bpy.path.abspath(im.filepath))) + '/' + os.path.basename(im.filepath); print('SEQFIX', im.name, im.filepath)
bpy.ops.wm.save_mainfile(compress=True)

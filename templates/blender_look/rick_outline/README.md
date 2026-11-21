# Fast thin outline pass (the Rick recipe, CB_RULES section 3)
Proved on the private look-match exercise (2026-11-21, 376 frames). In place of Freestyle, which took 90 s a frame on the cloud CPU:
1. `lines_wb2.py` (run inside Blender on the place .blend): a Workbench render in which every object of the `Line` collection has its own flat
   colour and everything else is black. One animation render per run of frames (state keyed), so 0.3-1.1 s a frame.
2. `composite.py`: turns the colour edges into thin #2a1830 lines (about 0.6 px at 540 width, 1.2 px at 1080, alpha 0.62-0.75) on the beauty
   pass, under the character cards.
ADAPTED TO KIT-BUILT KEY FRAMES (2026-11-21, yellow-fire-trucks cine/build_A2.py and build_B2.py): `lines_key.py` + `composite.py --key`.
1. In the build script (inside Blender, same session as the beauty, no second scene load), after the scene is dressed:
   `sys.path.append('<skill>/templates/blender_look/rick_outline'); import lines_key as LK`
   `LK.setup(sc, LINE_OBJS, HIDE_OBJS)`: LINE_OBJS = trucks, props, hose, small set props, trims/doors/signs (never ground, walls, roofs,
   glass panes, wires, trees, grass); HIDE_OBJS = cast cards, shadow cards, the 3D fist, mist volumes, air motes, contact patches. Colours and
   lists are stored on the objects and in the text block RICK_LINES, so a packed .blend carries them to the render machine.
   After `bpy.ops.render.render(write_still=True)`: `LK.render(sc, '<dir>/X_lines_id.png')` = Workbench, scene camera, 900x1600, about 3 s;
   engine, size, colour settings and hide flags are restored after.
2. The cast alpha: the build's compositor writes `pass_mask` (Object Index 1 = cards and fist, ID Mask anti-aliased).
3. `python composite.py --key graded.png X_lines_id.png pass_mask.png out.png [--alpha .70]`, or `key_composite()` from Python
   (episodes/yellow-fire-trucks/cine/finish_key.py does grade_rick + lines + numbers in one call). One-sided 1 px edges at 900 wide =
   1.2 px at 1080, 0.6 px at 540; #2a1830 at alpha .70; lines * (1 - mask), so no card gets a line.
4. Render machine: the package's job.py calls `LK.render` after the Cycles still (episodes/yellow-fire-trucks/cine/runpod_kit/).
Measured: A (town yard) 809 line objects, 3.1 s at 900x1600 on the cloud CPU, lines on 3.7 % of pixels; B (lamp room) 185 objects, 2.1 s, 1.5 %.
The exercise use (per-frame RickCam file) is kept behind `composite.py --exercise`; lines_wb2.py is unchanged.
Limit: silhouettes and borders between line objects only (no crease lines inside one object).

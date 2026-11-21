# Fast thin outline pass (the Rick recipe, CB_RULES section 3)
Proved on the private look-match exercise (2026-11-21, 376 frames). In place of Freestyle, which took 90 s a frame on the cloud CPU:
1. `lines_wb2.py` (run inside Blender on the place .blend): a Workbench render in which every object of the `Line` collection has its own flat
   colour and everything else is black. One animation render per run of frames (state keyed), so 0.3-1.1 s a frame.
2. `composite.py`: turns the colour edges into thin #2a1830 lines (about 0.6 px at 540 width, 1.2 px at 1080, alpha 0.62-0.75) on the beauty
   pass, under the character cards.
NOT YET ADAPTED to the kit lock (`from_lock.py`): the copies still read the exercise's per-frame camera file (`<place>_frames.json`, camera
object `RickCam`) and project the hero card with the exercise's tracked camera. In a film, the cards are inside the Blender scene: hide them in
the line pass and use the card alpha from the beauty render instead. Adapt and test on 3 frames before the first film use.
Limit: silhouettes only (no crease lines inside one object).

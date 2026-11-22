# SET BRIEF (lead, 2026-11-22): how every place of astro-flush-study is built

Private exercise: we rebuild the first 40 s of a Rick video shot for shot. The target is HIS picture in THIS video, as exact as
we can. Rick's frames stay in `references/look_match/astro_flush/` (git-ignored): never copy one outside that folder.

Read only: this file, your place's section of `../refs/LOOK_INVENTORY.md` (palette, light, inventory, top view), the rows of your
shots in `../refs/SHOT_BOARD.md`, and `../cast/CAST_KEYS.md` for heights. Reference frames: `references/look_match/astro_flush/ref/all/f_%04d.jpg`
(540x960, file number = frame + 1) and `ref/full2/t_%03d.jpg` (1080x1920, one per 0.5 s). Do not read CB_RULES.md or SKILL.md.

## Method (one script per place, written once, re-run with settings)
- `sets/<place>/scripts/bl_<place>.py` (Blender 5.3, `blender -b -P`): builds the whole place -> `sets/<place>/out/<place>.blend`,
  `<place>_lite.glb` (for the three.js kit) and `<place>_meta.json` (anchors, cameras per shot, movers, palette). `sets/<place>/build_<place>.sh` runs it.
- `sets/<place>/scripts/<place>_api.py`: `set_state(scene, **kw)` (variants: day / night / wide, screen picture number, exploded 0-1, ...)
  and `set_light(scene, kind)`; a still of any shot = load the blend, call the api, set the camera, render. Never rebuild a scene for a new still.
- `sets/<place>.js`: kit module that ONLY loads the lite GLB and applies states (pattern: `episodes/plane-eater/sets/cabin.js`).
  NO geometry is created in the kit module: everything seen is in the Blender scene (last film lost its kit-coded objects in Blender).
- Search `library/LIBRARY.md` first (generic Blender helpers: row `yft_town_helpers`; hose: `garden_hose_nozzle`). Say in STATE.md what you reused.

## Scale
Our characters are 1.62-1.82 m tall (NEW GUY 1.70 m, head about 0.62 m wide). The inventory sizes assume a 1.1 m character: multiply them
by 1.55, then check on the proof still that the character stand-in has the same size against the door, toilet, desk as in Rick's frame.
Blender metres, Z up. Put a flat stand-in card (character colour, right height and width) at each character position for the proofs,
in a collection `standins` that is excluded from the GLB.

## Look (measured on this video; it wins over the general "Rick recipe")
- PALETTE TABLE FIRST: `sets/<place>/params_<place>.json` with one hex per surface from the inventory, before any material.
- Every material is ONE flat uniform colour (principled, no texture, no noise). Detail = geometry: bevels on every edge, panel seams,
  rivets, handles, stickers and lettering (lettering and screen pictures as PNGs made with PIL in `sets/<place>/tex/`, word for word).
- NO outline on props or set. Glossy only where the inventory says so (toilet porcelain, glass, chrome).
- Full range: blacks near 0, whites near 1, high saturation, coloured shadows (never grey). One hard key where the place is bright,
  sharp dark shadows. Emissive things (screens, lamps, letters, flame, glow) are real emission; bloom is added later in post, not here.
- Cycles, view transform Standard. Previews: 540x960, 16 samples + OIDN. At most 8 stills per round; re-render only what changed.
- Run `python tools/check_midline_comments.py <your scripts folder>` before every render.

## Movers (fluid like a video game)
Every thing that moves, appears or changes in the shots (floating objects, doors, parts of the exploded toilet, screen pictures, lamps,
flame, glitter, the ship itself) is its own named object with its origin at its pivot, listed in meta `movers` with its rest transform.
The stretch builders animate it by name on every frame in the kit, and Blender keys the same name. Screen contents that change are
picture sequences or separate named planes, listed with the frame numbers of the reference.

## Proof (round 1 = "readable and going the right way", then stop and report)
For each shot of your place: one camera matched by eye to a named reference frame (store it in meta `cams`), one still, and a side-by-side
(ours | Rick) saved in `references/look_match/astro_flush/work/proof/<place>/` (it holds his frame, so it stays there). Plus a table in
`sets/<place>/STATE.md`: mean luminance, p1, p99, mean HSV saturation, ours vs his, and your own list of what is still wrong, worst first.
LOOK at every side-by-side yourself before you report. Time box: 50 minutes. Do not commit. If Blender or a download fails, stop and say so.

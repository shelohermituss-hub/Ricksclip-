# Third-party code and the origin of every picture and 3D file (V1.2)

The skill itself is under the MIT licence in `LICENSE` (Copyright (c) 2026 Mr omi). This page lists where each picture,
texture and 3D file in the zip comes from, and the one piece of third-party code.

## Third-party code

| Files | Origin | Licence |
|---|---|---|
| `templates/threejs_film/vendor/three.module.js`, `GLTFExporter.js`, `TextureUtils.js` | three.js r165 (threejs.org) | MIT, notice in `templates/threejs_film/vendor/LICENSE_three.txt` |

Node packages are not shipped: `npm install` in `templates/threejs_film` fetches them under their own licences.

## Pictures and textures (all made by us)

| Files | Origin | Licence |
|---|---|---|
| `templates/blender_look/tex/*.png` (19 textures: brick, burlap, canvas, cirrus, cobble, deck, drum, grass, ground, moon, mud, planks, plaster, roof, straw, water) | Painted in code by `templates/blender_look/paint_stage.py`, `paint_density.py` and `paint_v2.py` (Python + PIL); re-run them to remake the files | MIT, as the skill |
| `templates/blender_look/cards/*.png` (5 character cards) | Rendered from our own 2D vector puppets (`templates/vector2d_characters`) | MIT, as the skill |
| `templates/vector2d_characters/sheets_png/`, `faces_png/`, `views_golden/` (36 sheets) | Rendered from our own 2D vector cast code | MIT, as the skill |

## Left out on purpose

- **3D models**: no `.glb`, `.gltf`, `.blend`, `.fbx` or `.obj` file is shipped. BlenderKit models and textures are never
  shipped (their licence does not allow it); with your own BlenderKit account the look-finisher can fetch them on your PC.
- **Sound and music**: none shipped. See `SOUND_AND_MUSIC.md` for free sources and their licences.
- **Reference films**: no frames, video, transcripts or caption text from the films we studied. Only our own measured
  numbers and written notes. The list of titles is in `references/REFERENCE_VIDEOS.md`.

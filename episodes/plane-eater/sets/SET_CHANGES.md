# SET_CHANGES (fixes made by the stretch builders inside sets/)
- 2026-11-22 S1 builder: apron.js imported GLTFLoader from '../../yellow-fire-trucks/assets_prod/vendor/' (outside the film folder, which the kit's
  render server does not serve: /ep is the stretch folder only) -> './vendor/GLTFLoader.js' (the copy already in sets/vendor/, as xray.js and cabin.js do).
# SET_CHANGES (kit copies of the sets, changed by the stretch builders)
- 2026-11-22 S2 builder: sets/apron.js imported GLTFLoader from '../../yellow-fire-trucks/assets_prod/vendor/GLTFLoader.js'. The kit serves only the
  film.json folder (/ep/), so that path is outside it and the module fails to load from a stretch folder. Changed to './vendor/GLTFLoader.js'
  (sets/vendor/ holds the same loader + BufferGeometryUtils.js, as cabin.js and xray.js already use). A stretch links sets/apron.js, sets/apron/, sets/vendor/.

## 2026-11-22, S3 + S5 stretch builder (first kit runs of xray.js and cabin.js)
- xray.js: loads and renders in the kit unchanged (PE_XRAY 313 meshes, 88,576 tris, 3 morphs, load 127 ms; software WebGL 1.4-2.0 s a half-size frame).
  Usage note: the keys interpolate per key pair, so a key that leaves out "puff" drops it (the lining went flat again on the ride). Every key after
  the puff must carry puff: 1 (done in s3/make_film.py). Not a code change.
- cabin.js (code changes, all opt-in from film.json, nothing changes for a film that does not ask):
  1. "meal" 0..1 (row 36): all meal_* nodes slide 14 cm toward the aisle together (Michel's one-finger push), eased between keys.
  2. "wild": ["8A", "8B"] (WILD ROW): hides the upper seat backs (back, shell, covers, headrest, pocket, card, latch, belts) of the named seats
     and the owner's stowed tray (tray_table_B_stowed). Why: the leg room in front of Michel is 0.45 m; every lens in front of the two men sat inside
     the row-8 seats (renders were blue fabric), and from the aisle the row-8 seat backs hid both men. Seat pans, legs and Michel's tray table stay.
     Weak: Michel's tray table now hangs on its two arms with no seat back behind it (reads in the draft; Blender should keep the back and use a
     narrower lens path or cut the back only where the lens is).
  3. SKY CARD (the known fault, as look/look_cabin.py did in Blender): a 60 x 30 m canvas card at plan y 14 outside the left windows: deep blue top,
     pale horizon, a white cumulus deck. "sky_card": false turns it off.
  4. window_glass_* opacity at most 0.18 (they rendered near-opaque grey-white).
- pe_props.js (new): buildFork / buildKnife / buildRag for the kit's generic held3d path, loading props/out/fork.glb, knife.glb, owner_rag_spanner.glb
  (rag node only), turned +X -> +Y. Needs the stretch folder to see props/ (s3/props, s5/props are symlinks to ../props).

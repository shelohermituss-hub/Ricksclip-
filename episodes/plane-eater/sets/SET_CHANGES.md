# SET_CHANGES (fixes made by the stretch builders inside sets/)
- 2026-11-22 S1 builder: apron.js imported GLTFLoader from '../../yellow-fire-trucks/assets_prod/vendor/' (outside the film folder, which the kit's
  render server does not serve: /ep is the stretch folder only) -> './vendor/GLTFLoader.js' (the copy already in sets/vendor/, as xray.js and cabin.js do).
# SET_CHANGES (kit copies of the sets, changed by the stretch builders)
- 2026-11-22 S2 builder: sets/apron.js imported GLTFLoader from '../../yellow-fire-trucks/assets_prod/vendor/GLTFLoader.js'. The kit serves only the
  film.json folder (/ep/), so that path is outside it and the module fails to load from a stretch folder. Changed to './vendor/GLTFLoader.js'
  (sets/vendor/ holds the same loader + BufferGeometryUtils.js, as cabin.js and xray.js already use). A stretch links sets/apron.js, sets/apron/, sets/vendor/.

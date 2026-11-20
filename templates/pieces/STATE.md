# STATE: templates/pieces (library of proven pieces), built 2026-11-15 from "Armor Where Nobody Shot"

## What is here
- `INDEX.md`: 17 entries (what, when it fits and not, timing, parameters, what must change, where in the armor film, the fix-round lesson) and the 10-line how-to.
- `motion_core.mjs`: piece 8, the helpers, exported once.
- `moves/`: 7 factories, each with an `ARMOR` block of named values: `hop_onto_box`, `laugh_whole_body`, `hit_on_object`, `double_tap_tool`, `stroke_drawn_live`, `got_it`, `told_you_so`.
- `fx/`: `highlight_part.js` (13), `fly_and_hit.js` (14 and the storm of 15), `burst_of_living_things.js` (16), `time_pass.py` (17).
- `camera/camera_pieces.json`: pieces 9, 10, 11, 12, 15 as station snippets with the film's numbers.
- `prove.mjs`, `prove_fx.mjs`: the numeric proofs. Run both from the skill root after any edit.
- Nothing outside `templates/pieces/` was written. No render, no graphics card.

## Count
- Captured as code: 12 (pieces 1-8 motion, 13, 14, 16, 17 effects).
- Captured as documentation with numbers only: 5 (camera pieces 9, 10, 11, 12; piece 15 is a camera snippet that names code from 14 and 13).
- Not found: 0. All 17 are in the film.

## Proven (numbers)
- All 11 code files load in node; `time_pass.py` parses; the JSON parses.
- `prove.mjs`: each of the 7 moves, played with its ARMOR values against the stretch's own `cast/ep_*.mjs` every half frame (121-321 samples each, 10 runs incl. flat-feet tap, a moving stroke target, a missing target): largest difference 0 on every number of the pose (body, feet, hands, flags, held prop angle and scale).
- `prove.mjs`: `walker` planted foot slides 0.0000 px over 4 s; 5 changed parameters each change the pose (72-356 px or deg).
- `prove_fx.mjs`: `posOf` against the original text of `fx_s4.js` cut out and run: 0 difference over 14 x 131 samples. `timetable`: 430 hit frames equal to the rules of `hangar.js` 603-611. `time_pass.py` against the original script on made-up frames: 0 of 255.

## Weak
- Effects 13 and 14 (per-frame values: quiver, flash, band, blink) are TRANSCRIBED from the set code and tested only against the numbers the source states, not run against the set code itself (it needs three.js and a browser canvas). `posOf` and the timetable are the parts compared with the source.
- The effect files are numbers only. The meshes, sprites and materials of the armor film are NOT here; a new film builds its own look. That is on purpose (technique, not content) but it means an effect costs set-builder work every time.
- In the moves the BEATS, heights and props are parameters; the amounts of lean, arm and head inside the bodies are still the armor characters' (marked in `hop_onto_box.mjs`). A different body needs those retuned by an animator; the factories do not do it.
- Piece 3 keeps the Chief's own business (patch from the pocket, the lick) as beats `takeOut`, `show`, `business`: they can be moved but not removed without editing the file. It also starts from the laugh's end pose by default (`from`).
- Piece 15: the armor close-up has no hand placing the newest thing, which the reference study names as the method. The piece records what was built, not the better version.
- Camera pieces are not code and not checked by a tool here; their numbers were read from the five `film.json` files.
- Not captured: the armor film's drawn props (slide rule, chalk stick, patch). They are content. `barProp` is a plain stand-in.

## Open
- NOT TESTED IN THE KIT: an episode moves file that imports from `templates/pieces/`. The kit plays a copy in `out/.puppet_cache/` and that copy imports `./motion/rig.mjs`; a relative import from there to `templates/pieces/` should resolve (four folders up) but no film has run it. First user: test one move with `tools/frame_checks` before building on it. If the cache breaks relative imports, copy `motion_core.mjs` and the one move file into the episode's `cast/` and change the import line.
- `motion_core.mjs` imports `cycle` from `templates/motion_styles/rig.mjs` (only `walker` needs it).
- FOUND ON THE WAY: `episodes/armor-no-holes/stretches/armor-pins-test/out/.puppet_cache/ep_pins.mjs` and `episodes/armor-no-holes/stretches/armor-s5-payoff/out/.puppet_cache/ep_s5.mjs` are NOT the same as their `cast/` files (the cache has no `m_realise` and no `m_told`); S1's cache is the same. The proofs use `cast/`. Whoever re-renders those stretches from the stretch folders should refresh the cache first or check which copy the final film used (`episodes/armor-no-holes/final/`).
- FOUND ON THE WAY: `spot_fx` with `marks` and `blinks: 3` shows TWO pulses, not three (negative half wave is dark). The film is as CB approved it; for a new film pass 2n - 1.
- `PICTURE_PLAN.md` already tells the writer to name a piece and what changes; it still says "when it exists". The lead may want to point it at `templates/pieces/INDEX.md` (not edited here: outside my folder).
- Pieces a next film is likely to add: the walk-in and the scurry (only `walker` is here), the flinch, the duck-and-peek, a held 3D prop put down on a frame, the lantern-light move. They are in the armor moves files but were not on the list.


# STATE: power effects `fx/power/` (pieces 18-23), built 2026-11-16 by the vfx-artist (CB: "Yes, build it")

## What is here
- Six modules, each ships the LOOK as well as the timing: `shockwave_ring.mjs`, `ray_burst.mjs`, `crack_veins.mjs`, `aura.mjs`, `spiral_eyes.mjs`, `spark_trail.mjs`; shared helpers `_core.mjs`.
- `prove_power.mjs`: the numeric proof. `proof/`: test film (`film.json`, `make_plan.mjs`, `sets/powertest.js`, one stand-in card `cast:sheriff`), `run.sh` (copy modules, bake plan, 18 stills through the monopoly fair GPU queue, sheet), `sheet.py`, `rick/` (7 Rick frames cut with ffmpeg), `out/` (18 stills, 540x960), `POWER_FX_SHEET.jpg` (1215 px wide: per effect build, peak, settle + Rick).
- Nothing outside `templates/pieces/` was written (INDEX.md entries 18-23 and this section added).

## Proven
- `node templates/pieces/fx/power/prove_power.mjs` -> PASS: 20 runs (6 effects, 10 cases, each under the scene and under a moved, turned, scaled parent) with the kit's own three.js r165; update(t) for -0.5..3.0 s at 30 fps, 0 non-finite numbers in any transform, opacity, uniform or vertex; stateless (t = 0.5 equal after a jump from 2.9); something visible at t = 0.1; dispose leaves 0 objects and frees every geometry and material.
- Real render on the GPU (RTX 2070 SUPER via the queue): all six draw, 85 ms per still, no black or NaN blocks. Shader code has no pow of a negative base, divisions guarded.
- In a film the effects work from a set module with the real card (`R.cards[who]`) and camera: spiral discs land on the sheriff's drawn eyes with the default `eyeOffset`; the aura sits behind the card; veins lie on wall and floor.

## Weak (honest, against Rick's frames on the sheet)
- Ring: a flat graphic ring with toon dust, not Rick's soft volumetric smoke torus; no sky warp. Reads as cartoon impact, not as his.
- Rays: reads close to his cart fan; his crash rays are fewer, longer, thinner sky beams (count 10, width .06, length 8 gets nearer; not tried).
- Veins: shape and crawl read; ours glow gold and are still a little thick and tree-like; his are thin, dark red, almost no glow, on a cracked floor.
- Aura: closest to Rick after tuning (dark violet cloud behind the card), but flame-licked where his is a still scalloped cloud; ours does not sit ON the wall (behind = 0.6 m in the proof).
- Spiral eyes: placement good; Rick lights the whole face orange (face rule forbids it here; `cardWarm` exists, untested in a picture).
- Spark trail: head small and pale on a light floor (additive washes out); trail thin; the burst covers the crate. Not compared in a close shot like Rick's.
- A bug the proof did NOT catch: an edit once commented out `root.add` of the spark head, prove_power still passed (objects never added are not counted). Only the picture found it. Add a "made objects are in the scene" check if this file is edited again.
- Only 18 stills checked; no moving clip watched; no SFX; not tested under kit3d (PBR) light or with the Blender look pass (all fx roots have userData.noExport).

## Open
- Import path: a film must COPY the modules into its `sets/power/` (server serves only the film folder). A kit change to serve `templates/pieces/` would remove the copy; not done (kit is shared by two running films).
- Next uses: the waiting-list films' picture plans name 3-5 power moments; each use retunes colours from the LOOK_BIBLE and `eyeOffset` per character.

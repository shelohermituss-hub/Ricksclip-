# fake-surgery sets STATE (look helper phase A, 2026-11-16, one round, ~75 min)
## Built
- `look_pack.js` + `look_pack_README.md`: hospital surfaces in real metres (k3scale -> kit metre UVs), toon/gloss + normal maps, anti-tiling tint (clamped GLSL):
  tileSea/tileSeaGloss/dadoTile 15 cm, ceilPanel, vinyl, terrazzo, plaster/paint(c), block, veneer, desk, locker, plasticOrange/Teal, carpet, drape/drapeDk, rug(w,l),
  steel/steelDk/chrome (kit pbr); `LP.sky` texas (freeway, heat-haze shader) / night / coral / overcast; `LP.applyLight` (fill/shadow/veil keys), `LP.sync` (env on gloss), `LP.uv`, `LP.finishUV`.
- `or_room.js` (now look_pack): tiles #4fa59a glazed, ceiling panels + louvred troffers, vinyl, steel; IN USE amber; no red (clock second hand blue, cabinet/LED pink -> purple);
  raised head section 35 deg (hinge x -0.42, pillow, gas strut, rails), drape body along the backrest, 3D head REMOVED, anchors `patient_card/head/hip`;
  knee iodine #c0702a Lambert (no glow), dots #4a2a18 in one row, plasters (cream, tan pad, outline, vent holes); stitch, cuts, suture packs, needle holder gone;
  lamp aimed by `lamp_at` (default knee+surgeon), floor pool mesh removed; anaesthesia machine, gas outlets, suction canister, wired portholes, CRT monitor with VCR/PLAY,
  sealed scope bag + tag, hand pendant; micro motion: dust motes drift, bowl ripple, monitor snow, flood ripples/bucket bob.
  New keys (top of file): knee {dots, plasters, faded}, lamp_at, lamp_i, evening, eve_i, water_floor, monitor nosignal|tape|snow|off, head_deg, dust.
- `or_props.js`: bulb grey-blue #6a86a0; buildNeedleHolder removed (hook versions in scratch only).
- `PLACE_KEYS.json`: blocks OR, CO, NI, AF, GR, EV (stairwell), EV_or (OR 3 evening). Values from LOOK_BIBLE, tuned 3 rounds.
- `lp_testroom.js`: TEST BOX only (key `dress` CO/NI/AF/GR/EV, window sun with its own shadow box). Not for the film.
- `_test/`: film.json, run.sh (bake + shared GPU queue + measure), measure.py, numbers.txt, kinds_sheet.jpg (1540 px), or_vs_best.jpg. `_test/sets` is a JUNCTION to `..`: never rm -rf.
## Numbers (ungraded, scale .5, _test/numbers.txt)
- OR sat .572 bright .437 red 0 | EV_or .647 / .247 / 0 | CO .357 / .735 / 0 | NI .597 / .273 / 2 | AF .602 / .474 / 0 | GR .293 / .430 / 0 | EV .564 / .465 / 25
- Distances: AF-EV 17.9, NI-GR 21.0, OR-EV_or 30.5, all other pairs 24-55.
- Knee (OR frame-0 cam): iodine pixels luminance mean .44, p95 .73 (<= .80 PASS); brightest channel p95 .98 (orange saturates in R); patch only 10 % of frame width (stretch camera must bring it to >= 22 %).
- detail_density edge: OR .206; test boxes .05-.14 (bare boxes, expected).
## Weak / open
- NI mean brightness .273 < .31 in the test box (dark veneer + vinyl; ai 2.3->3.0 moved it only .006): the office builder needs the desk-lamp pool + lighter wall/ceiling, or the lead raises NI amb/fill; re-measure in office.js.
- AF-EV 17.9 just under 18 (test box, different dressings will separate them more; re-measure with the real stairwell/office).
- EV red gate 25 px (coral sun on pink terrazzo) and NI 2 px: tiny but must be 0 outside rows 34/36-38; push EV sun more orange if it grows.
- GR sat .293 (bible "about .30"): OK by intent, borderline.
- EV_or bright .247: dark; porthole shafts need eve_i up or a second coral fill in S5.
- or_vs_best: the near drape (drape_hang_front) is one flat blue slab and the torso drape a stiff tube: below the best film; needs a cloth sim-style folded drape mesh. Spot spill makes a hot floor patch bottom-left (lower lamp_i or narrow cone in S1). Ceiling troffer slabs read flat.
- Sky canvases are stand-ins for the background-painter.
- sets/README.md owner table does not list lp_testroom.js (lead to add or ignore).

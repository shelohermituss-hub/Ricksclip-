# STATE: PLACE B, DALLAS FIRE DEPT. STATION 14 yard, hot noon (set-builder, round 1, 2026-11-21). Sheet: DALLAS_SHEET.jpg (8 tiles, looked at).
## NOT done / still wrong (seen in the sheet)
- No Rick frame in the repo: no side-by-side, no 90 % close-up detail check per object. Numbers only against the 11i floor.
- UP TO 3x is NOT readable in the wide and boards views: the sectioned ladder leans over the middle of the red stack and covers it (and the RED head in the wide).
  Fix next round: ladder to the stack's left edge (LF x - .45) or the chalk words on the right half. Row 34 (CLOSE on UP TO 3x) needs its own camera check.
- Far layer does not show: water tank (30,165), derrick (-42,240) and the skyline sit outside or behind the wide frame (or melt into the sky): no camera proves them yet.
- The apron reads warm sandy, not pale grey concrete (yard tint #d9d3c5 under a #fff3d0 sun); big empty apron foreground in the wide (edge .159/.148).
- DALLAS FIRE DEPT. on the front band is half hidden by the red stack from the wide (boards stand centred in front of the bay pier). Readable from the side views.
- boards tile edge .137 (Blender) / .124 (kit): mostly sky (not a gate tile, below .14). Station walls are still plain stucco between the pilasters.
- World micro motion (halyard, grass, pump jacks, leaves) and air life NOT rigged (list in ../dallas_DRESSING.md); no place.still switch in dallas.js yet (STORY says so).
- Plasters on the trucks (props-hero anchors) not placed; painters' cans/ladders not looked at in a tile (painters camera not rendered). No phone-size check written.
- Kit seconds per frame are not trustworthy this round: load average 14 on 4 CPUs (other helpers); second frame 1.5-6.8 s, one negative value (-2.1).
## Built (files)
- `build_dallas.sh` (ONE re-runnable script: fetch, textures, Blender build, both GLBs; `--proof` / `--proof-only` = stills + numbers + sheet; ends DALLAS_BUILD_END /
  DALLAS_PROOF_END; build 40 s on a quiet CPU).
- `scripts/fetch_dallas.py` (32 Poly Haven CC0 models + 14 textures, 46 ok), `tex_dallas.py` (PIL: tints, DALLAS FIRE DEPT., STATION 14, 5 slate boards with chalk tallies,
  4 calendar leaves, order sheet REPAINT: RED, decals, chain-link), `_head.py` (helpers copied from town/bl_town.py + story groups) + `_body.py` (the world) + `_tail.py`
  (anchors, merge by material + group, trucks, save, exports) -> assembled into `bl_dallas.py` by the build; `dallas_api.py` (Blender controls: set_light, set_boards,
  set_trucks, red_root, lime_root; KIT_LIGHT), `bl_dallas_proof.py`, `dallas_cams.json`, `kit_films.py`, `run_kit.sh`, `numbers_sheet.py`.
- `out/dallas.blend` (134 MB; trucks appended from assets_prod as independent copies, letters dal14/dal22 packed), `out/dallas.glb` (1.80 M tris counted per instance),
  `out/dallas_lite.glb` (676 k), `out/dallas_meta.json` (anchors, light, groups). Files are in out/ (git-ignored, rebuilt by the script), like the town.
- `../dallas.js` (kit module: GLB/lite + the Dallas pair from assets.js, story switches `boards: {n, ladder, stool, painters, leaves}`, anchors, export LIGHT),
  `../dallas_STORY.md`, `../dallas_DRESSING.md`, assets/ASSETS.md DALLAS SET section.
- Layout: station faces south (front y 22, x -12.5..12.5, office wing east to 23.5, shed west); RED truck west x -3.2, LIME east x +3.2, noses at y 8.4; RED board x -.95,
  LIME board x +.95, calendar between at x 0; clerk_spot (0, 7.65); painters east of the lime truck (x 5.75); cooler on the bay pier; flag pole (21.5, 15.5) bare.
- film.json: places.<name> = { set: 'dallas', kind: 'no', light: 'day', light_over: LIGHT.no, lite: true, boards: {...}, kit3d: { envGround: '#cdb690' } } (proof/kit/film_*.json).
## Numbers (proof/numbers.json; 540x960; Blender Cycles CPU 16 spp + OIDN, Standard view; kit lite, SwiftShader)
| cam | Blender edge | Blender s/f | kit edge | kit s/f (2nd frame) |
|---|---|---|---|---|
| wide (gate) | .159 | 95.6 | .148 | 5.8 |
| medium (gate, clerk card) | .249 | 113.3 | .240 | 1.5 |
| low (gate) | .270 | 126.5 | .235 | (-2.1, noise) |
| boards | .137 | 63.7 | .124 | 6.8 |
- GATE (median of wide/medium/low >= .14, none < .08): Blender .249 PASS, kit .235 PASS. Brightness .58-.78 Blender, .41-.65 kit (hot noon; Blender wide .78 is near white).
- Kit load: 669 k tris + 2 light trucks, GLB parse 4-6.5 s, first frame run 28-38 s (shared CPU). Blender times at load average 14 (shared): about 2x a quiet CPU.
## LECONS (for LECONS_TECHNIQUES.md, the lead copies)
- 2026-11-21 problem: the Dallas trucks kept the ENGINE No. 1 letters (log LETTERS_FAIL, key "truck_letters_dal14" not found). Cause: truck_api.append_truck appends the
  TRUCK collection only; the extra letter images live in truck.blend with a fake user and do not come along. Fix: dallas_api.link_trucks loads
  assets_prod/out/<letters>.png, packs it, then set_letters. Guard: build_dallas.sh prints any LETTERS_FAIL line. Proof: run 2 has none, DALLAS FIRE DEPT. on the doors. FERMÉ
- 2026-11-21 problem: kit "second frame" seconds came out negative (-2.1 s). Cause: the time is (frames 0,1) - (frame 0) of two separate runs, and the shared CPU
  (load 14 on 4 cores) changes the page load time between runs by more than a frame. Fix: none yet; read the numbers as noise when the load is high. Guard: write
  the load average next to timings (`uptime` in run_kit.sh: TO ADD). OUVERT
## Open for other departments
- Props-hero: plasters (3 red, 1 lime) on the driver sides; with the red truck WEST, its driver side faces the boards (dallas_STORY.md 7). The 3 board and calendar
  props are built by the set here (PROPS.md listed them as LIST): props-hero may replace them.
- Background-painter: sky dome, far haze, skyline may be painted; leave the water tank and derrick sight lines (anchors water_tank, derrick, far_skyline).
- Effects: heat shimmer, dust devils, flies, chalk dust, red mist (DRESSING.md). Lead: OK the layout (red west, lime east; boards centred on the bay pier).
## FIX 2 (2026-11-21) - sheet FIX2_SHEET.jpg (8 tiles, looked at), numbers proof/fix2/numbers.json; runs fix2_run.sh + fix2_rerun.sh (build -> out_tmp/, renamed)
- NOT done: Blender air life twin; grass/halyard/pump-jack motion; skyline towers are plain haze boxes (no window rows); Blender S5/S7 saturation .15-.16 and S7
  brightness .79 (pale apron at hot noon, near white); the period of DALLAS FIRE DEPT. does not read at preview size; no Rick side-by-side (no refs).
- Done, seen in the sheet: 1 apron pale grey (tint #b6bec8 keep .1, grain pulled 45 % to its mean; texture mean 189/188/192, was brown-cream), oil/cracks/joints kept.
  2 boards.ladder 'side' (kit) / set_boards(ladder='side') (Blender): ladder on the stack's west edge, dx -.9 (meta ladder_side_dx; anchors ladder_side_foot/top);
  board 3 UP TO 150 px + 3x 400 px chalk in a chalk box. 3 far layer moved: tank (-12,70) body 40-47 m, derrick (-38,60) 44 m, skyline x.3 y.27 h x1.1 (300-370 m):
  all three read from the S5 and S7 cameras (cams s5, s7 in dallas_cams.json). DALLAS FIRE DEPT. is a roof sign (10.4 x 1.3 m, centre z 9.7) clear of the boards in S5.
  4 dallas.js still: true | [t0, t1] (frozen, no jump) over the new air life; update(f, t) returned. 5 boards.ground 0-4 (default 3 as before; gl4 by the red nose).
  Kit metals get a painted noon env (ladder read black). Anchors: all 28 old names kept; MOVED (needed by the fix): sign_front, water_tank, derrick, far_skyline.
| tile | edge | bright | sat | s/f (load) |
|---|---|---|---|---|
| BL wide BEFORE | .159 | .779 | .238 | 95.6 (~14) |
| BL S5 cam after | .296 | .666 | .159 | 15.5 (3.5) |
| BL S7 cam after | .176 | .791 | .149 | 15.2 (3.5) |
| BL boards before / after | .137 / .180 | .665 / .643 | .296 / .276 | 63.7 (~14) / 16.7 (3.1) |
| KIT lite S5 / S7 / boards after | .294 / .182 / .168 | .548 / .690 / .559 | .325 / .231 / .391 | 3.3 / 3.1 / 3.1 (4.3) |
- For stretch builders: S5/S7 wrappers must call the returned update(f, t) for the air life; S7 passes still: [57.667, 58.467]; S5 row 34 may pass ladder: 'side'.
## FIX 2 LECONS (LECONS format)
- 2026-11-21 The far landmarks (tank, derrick, skyline) were in the set but never in a frame. Cause: placed by plan only; from a 1.3 m camera 18 m from a 6.3 m
  roof, anything under 16 deg up hides (a 38 m tank at 163 m is 13 deg). Fix: place far things by the elevation test against the roof and the sign from the
  shot cameras. Guard: the s5/s7 cams in dallas_cams.json are proof tiles. Proof: FIX2_SHEET tiles 2, 3, 6, 7. FERME
- 2026-11-21 The apron read warm sand after a grey tint. Cause: tint() keeps 25-50 % of the source colour and the Poly Haven concrete is brown (85/60/41).
  Fix: keep .1 + pull the grain to the mean. Guard: tex_dallas prints nothing: check the texture mean (python one-liner in STATE) before a build. Proof: tiles 2/3. FERME

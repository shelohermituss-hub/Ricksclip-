# STATE: PLACE A, PINE HOLLOW town set (set-builder). Rounds: 1 (2026-11-20, TOWN_SHEET.jpg), LITE (2026-11-21, LITE_SHEET.jpg), FIX 1 (2026-11-21, FIX_SHEET.jpg).
## FIX 1 (2026-11-21) NOT done / still wrong
- Blender DU park brightness 0.284 (< 0.31; before 0.269 on the same new camera, old camera 0.293). The sun patch light helps only the near lawn; the dark real grass rules the frame.
- Swing: seat raised to .62 m, pale rope and seat, worn earth (2 grass patches removed) and a new park camera with the swing 5.5 deg left of the trunk: still NOT clearly readable at 540x960.
- Kit LITE canopy fuller (whole leaf cards, 1.6 % kept, x2.8) but still airy; kit DU street-lamp halo too big (sprite + kit bloom). Kit park s/f 12.6 s under load 22 (was 6.0 s).
- Air life built in both renderers but not visible at proof size except the Blender lamp mist; moths/dust not checked at a close shot. No Rick frames: no side-by-side.
## FIX 1 done (seen in FIX_SHEET.jpg; numbers proof/fix/numbers.json, times proof/fix/times.json)
- Crossing DU: lamp_street spot 12000 W 90 deg (town_api) + kit SpotLight 520 cd and additive pool decals (road + walk). Warm pool on road, stop bar, kerb in both. Blades 1.5 x .3 m, letters 140 px,
  navy rim, retro letters (emission .35 Blender / .45 kit at dusk). Black pit at the corner FIXED (see lesson). BL edge .112 -> .157, bright .499 -> .577; kit .184 / .472, 3.9 s/f.
- Yard line: one clean 14 cm white line (tex_town line(), quad .55 -> .14 m); kit DU yard_low edge .162, BL .166.
- LITE park: grass patches -> 2587 tuft cards (3 crossed quads, tex tuft.png), tree -> whole leaf cards + decimated wood (16 k tris); cut-out (alphaTest) leaves; LITE 1.14 M tris. Kit AM park edge .294 -> .351.
- KEEP CLEAR yaw 180 -> 0 (all plan cameras look north from street/shop to the yard: rows 9-12, S1); kit shop glass opacity .34 + procedural sheen streaks. Kit shop edge .199, 11.8 s/f.
- Air: Blender collection AIR (air_am_dust_yard/shop, air_du_moths_0..4, air_du_mist_street/wall; NOISE drift), set_light shows its kind; kit airLife() (places.<name>.air), per-frame drift. DRESSING.md table.
- Proof cameras changed (town_cams.json): crossing = van approach on Elm (23.4,-14.5 -> 25.6,-6.2), park = swing beside the trunk (44.5,-30.5 -> 37,-16.5). Anchors, layout, lettering unchanged (guard: 21 anchors asserted).
- Safety: town.blend / town.glb / town_lite.glb / town_meta.json written to *_tmp then os.replace. Tools: proof/run_fix.sh (+ proof/fix/tiles.env), scripts/fix_sheet.py.
## FIX 1 LECONS (LECONS format, for LECONS_TECHNIQUES.md)
- 2026-11-21 Anchors yard_line_start/end vanished from town_meta.json after my edit. Cause: a '#' comment put in the middle of a line with ';' statements (REGLES 4). Fix: comment on its own line.
  Guard: bl_town.py asserts the 21 needed anchors before writing meta (build fails loudly). Proof: rebuild -> ANCHORS 21. FERME
- 2026-11-21 A black rectangle at the Main x Elm corner in Cycles. Cause: two walk boxes overlapped with coplanar tops (z .15); shadow rays from one face hit its twin. Fix: Elm walks stop at
  y -7.5 / 7.5 (no overlap). Guard: comment at the loop; look for coplanar boxes when a hard black patch shows. Proof: FIX_SHEET tile 1 vs 2. FERME
- 2026-11-21 bl_town_proof.py never set OIDN. Cause: the denoise settings sat behind a mid-line '#'. Fix: own line. Guard: same rule as above. Proof: proof/fix renders. FERME
- 2026-11-21 Kit stills timed out (30 s) under load average 22 (7 helpers): shop and DU park LITE failed the first run, passed the second. Not a scene fault; rerun one at a time. OUVERT (kit owner: timeout knob).
## Open for other departments
- Lead: the park dusk floor needs a choice: brighter dusk fill for the whole place, a paler grass tint, or accept .28 with the sun patch. Kit owner: screenshot timeout knob.
- Background painter: sky dome, clouds, far haze. Props-hero: plate on the asset bumper; a distinct older pumper if wanted.
## History (round 1 and LITE, short; full text: git show 1bcfcc7:episodes/yellow-fire-trucks/sets/town/STATE.md)
- Round 1: build_town.sh (one re-runnable script; --proof, --lite), scripts fetch_town / tex_town / bl_town / town_api / bl_town_proof / town_cams.json / kit_films / numbers_sheet,
  out/town.blend (both lights, trucks appended), out/town.glb (16.4 M instanced tris), out/town_meta.json; ../town.js, ../town_STORY.md, ../town_DRESSING.md. Gate PASS (yard medians BL AM .243, DU .149, kit AM .226, DU .166).
- LITE: scripts/bl_town_lite.py -> out/town_lite.glb (places.<name>.lite = true; light trucks). Yard 1.7-3.0 s/f in the kit.
- Still open from round 1: houses / water tower / poles / lamp head are coded stand-ins (DRESSING.md lists the models); signs and shingle motion not rigged; BL DU yard_wide edge .121.
- Earlier LECONS (Poly Haven UA, decimate in excluded collection, fake-user materials, set -e grep, glTF emission 0, instanced tris, truck cost) are in LECONS_TECHNIQUES.md and commit 1bcfcc7.

# S7 STATE: THE FALSE WIN, BOARD round (S5/S7 stretch builder, 2026-11-21). Frames 1576-1754 (52.54-58.45 s), line 13, plan rows 49-53, Dallas, NOON.
## NOT done / wrong
- The LEAD DECISION end (push into the wet red door panel) is NOT built: camera v2 stretched it to 36 f and it ate the stillness. S7 ends on the frozen
  Chief tableau (CAMERA_NOTE.md: two options for the lead).
- STILLNESS is 1730-1754 (0.8 s, starts on the settle after "red"), not 1733: all moves dead still from 1729, camera creep 0 from 1727; only the post
  dust (air) moves. The set has no world motion to freeze (no halyard, grass or mist rigged: dallas_DRESSING.md), so "only the air moving" holds trivially.
- No moving clip, strip, feet-and-eyes sheet, lock, cam_track, 11i. frame_checks.mjs NOT run (time box over). No Rick frame exists: no side-by-side.
- No red mist from the guns (a dust puff fx stands in at 1629); the paint is the lime truck's own shader edge (assets.js setPaint 'half'), sweeping from the
  nose back (1629-1648), held at the last rear patch for the pat (1650-1658), covered 1658-1664. Its edge is a straight soft band, not two gun strokes.
- The Chief "plants himself" with a 1.9 m card glide (1672, 8 f) + a hop in the move: a glide, not locked feet (slide not measured).
- The order sheet REPAINT: RED is the set's (painters: true); not checked readable in a key frame. "UP TO 3x" small over his shoulder (row 52) not checked.
- Motion gate (motion_gate.txt): twos 0, linear 0, creep 0; no_settle 2 in pt_s7 (shrug, sweep) and 2 in cv_s7 (nod, salute); pf_s7 clean.
  Plain kit poses 0, frozen moves 0 (3 episode moves).
- Seen in BOARD.jpg: f1600 is still the close on the lemon door (no painters, no shrug, order sheet not seen: the pull back starts late);
  f1640/1655 the red sweep reads well but the Painters are at the right edge / out of frame (fat one's pat NOT visible); f1690-1742 the Chief reads
  (VISITOR, chest out, proudShut) but the thin painter and the set step ladder stand behind/beside him; no boards/UP TO 3x in any frame.
## Built (files, s7/)
- make_film.py -> film.json (camera v2, camsafe, kit3d, tween ones, face_frames 0, card_shade 0/0, costume_shade keep_drawn_light + smooth 40, LITE dallas,
  boards n3 / ladder off / painters on / leaves 3). ONE take: anchor, lemon door 1576, pull-back rest 1618, push to the Chief 1727 + stillness. CAMERA_NOTE.md.
- moves/ep_s7.mjs: pt_s7 (shrug at the order sheet, aim, long sweep on "back", step aside), pf_s7 (dabs, pats the last yellow patch on "anyway", covers it,
  step aside), cv_s7 (thumbs in belt, the plant on "firetruck", eyes-shut salute + rock back on "has", catch + proud nod on "red"); side + front exports.
  Faces: sleepy / concentrate (thin), concentrate / lipBite (fat), proud -> proudShut ("has") -> proud ("red") for the Chief (VISITOR tag = chiefVisitor cast).
- sets/s7_dallas.js (wraps sets/dallas.js unchanged): the repaint edge per frame, the paint-frame workaround. held3d: two spray guns (assets.js buildSprayGun).
- Symlinks as s5; plan_window.py, render_each.sh, board.py -> BOARD.jpg, key/f_*.png (1600 1640 1655 1690 1712 1742).
## Numbers
- plan_window.py (gates on 1576-1754): 0 FAIL, 8 WARN of 42. Real file --window: WINDOW p90 15.6 px/f PASS, peak 16.9 PASS (other FAILs = the parked
  lead-in frames 0-1575, known s2 artefact).
- camsafe validate --frames 1576-1754: 537 checks, PASS 537, FAIL 0. Render about 20-60 s per full-size frame (shared CPU).
## Requests (no sets/ or assets_prod/ file edited)
- lead: pick the S7 -> S8 option (push at the head of S8, or a shorter stillness + 12 f push); OK the 1730 stillness start.
- set-builder: rig the halyard / grass / dust with a place.still switch; ladder fix as S5; apron pale concrete; far layer.
- props-hero: a two-stroke red spray decal (gun-shaped strokes) + red mist piece for the repaint; buildTruck sets uInvRoot itself.
- animator: a locked-feet two-step for the Chief's plant (no glide).
## LECONS (LECONS format)
- 2026-11-21 A planned stillness at the END of a stretch cannot be followed by a camera move in the same stretch under camera v2. Cause: v2 times every
  travel (a whip is stretched to stay under 46 px/f: 36 f here), so the move starts inside the stillness. Fix: end the stretch on the frozen tableau; the next
  stretch carries the move. Guard: print camera_baked state over the stillness frames (must read rest with zero motion). Proof: 1730-1754 rest. FERMÉ (for the plan: OUVERT, lead decision)
- 2026-11-21 Painters spraying a truck side face the truck, so a lens on the open side sees their BACKS. Fix: stand them rear-ward of the patch, spraying
  forward-diagonal, lens south-east: apply_looks gives 3/4 front. Guard: camsafe validate (FACE_BEHIND) before rendering. Proof: 537/537 PASS. FERMÉ

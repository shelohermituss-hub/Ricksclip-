# STATE: look/ (look-finisher, LOOK CARD round, 2026-11-21)
## Built
- pe_look.py: shared Blender helpers (cards self-lit + sun-facing shadow card, place_card_hand, fist_overlay, contact, prop from props2.blend,
  dapple canopy, bounce_grey, cam_inside, render_setup with cast mask pass, outline id via rick_outline/lines_key).
- cards/make_look_cards.mjs (+ finish_look_cards.py): posed cards michel_salt, doctor_clip (+ mirrored doctor_clipM), owner_polish, michel_meal; cards.json.
- look_apron.py (A), look_xray.py (B), look_cabin.py (C): `blender -b <set.blend> --python look/look_<x>.py -- info|preview out.png` (env below).
- make_look_card.py -> ../LOOK_CARD.jpg + prev/phone360.jpg. Finish = yellow-fire-trucks/cine/finish_key.py (grade_rick + outline + numbers).
## Exact settings of the delivered stills (540x960, SPP 24)
- A: CAM=6.85,-0.45,0.36 AIM=2.3,-1.6,2.05 LENS=17 MT=5.3,-1.15,2.05 PUSH=0.3 FKS=2.2 SHS=2.2 (EXPO -0.1 default); finish DAY strength .5.
- B: CAM=0.1,-0.2,1.38 AIM=0.42,2.2,1.38 LENS=30 EXPO=-0.6; finish INTERIOR 1.0.
- C: CAM=1.05,1.02,1.06 AIM=0.1,1.36,0.92 LENS=22 MLOC=0.04,1.2,-0.17; finish INTERIOR .6.
## Numbers: see ../crew/look-finisher_check.md (A mean .442 sat .539; B .505/.247; C .521/.190). Render 20-40 s each on CPU.
## Weak / open
- A plane read from below only (no gloss streak); Michel on the chair is MY staging choice (wing top 2.0 m > his reach 1.57 m): lead/animator to confirm.
- B upper wall plain; C head cut at left, meal small. Cards not from a lock.
- Set fixes asked: cabin fuselage_skin_outer has no window holes (worked around here); clinic wall plain.

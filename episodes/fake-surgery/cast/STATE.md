# CAST STATE: fake-surgery (character-artist, phase A, 2026-11-16; NOT locked by CB)

## Who (sheet cast/sheets/surgery.mjs, 20 puppets cast:surgery/<name>)
surgeon (fat, masked), surgeonOff (mask down), nurse (standard), patient (thin, gown), patientShorts (thin, polo + shorts), boy + grandkid (kid form),
climber1-3 (fat/standard/thin), g1-g5 gurney gowns + g1s-g5s same people in street clothes. Colleague = a hand only (sets/soft_arm.js), no puppet.
Recipes registered at load in the sheet (library NOT edited): scrubsOR1995, scrubsNurse1995, gownPatient1995, poloShorts1995, kidStripe1995,
kidDungaree1995, gownG1-G5; part PART.penPocket (blue + black pen; the library pocket's 2nd pen is red). Cap = library baseball with its red "R" disc
stripped (capOf(pin)). Details, colours, signatures: CASTING.md.

## How to import (film.json)
- puppet_pkg: [<rel>/episodes/fake-surgery/cast, <rel>/templates/vector2d_characters/code]; cast entries from CAST_KEYS.json `cast` (height, heads_tall).
- Copy into film.json: face_shadow true, costume_shade {.45,.35,.15, smooth 40, keep_drawn_light true}, card_shade all 0 + hat_shadow 0 + lights [],
  and `faces_ep` (drowsy, wince, thumbsSmile, springGrin, smileEyes, wail) -> use as face "k:<name>".
- Held props per character (hand, grip kind): CAST_KEYS held_props (scalpel, bulb, plaster, jug, pen, clipboard, envelope, cane, ruler, cup, cards, tray, wristbands).

## The reclined patient (OR table, rows 1-10, 27-30, 40-41)
- Episode moves in moves/ep_surgery.mjs: m:../../ep_surgery/pt_recline (rest, slow breath), pt_thumbs (row 10: near fist rises above the drape
  ~0.8-1.6 s then holds), pt_smile (head lifts on the smile), pt_recline_side (camera across the table). View 3/4 (side for the _side style).
- The card is turned back 55 deg about the BACK-BOTTOM of the body (= 35 deg above the pad, the raised head section's hinge); head counter-tilted +22
  so the face reads; body slid right 230 u (X0) so the head stays on the card; near leg knee up, far leg along the pad (under the drape). Not a kit
  "lie" pose (lie_cam lays the card FLAT; a 35 deg recline is a drawing, so it stays a standing billboard card).
- Stretch use: act { who: patient, pose "m:../../ep_surgery/pt_recline", face "k:drowsy", pos [x, y, PAD_TOP_Z] with the card's ground line on the pad
  under his hips, hinge of the 3D head section at the card's back-bottom (card x about -0.25 of card width from centre = X0 - body half width),
  dir so the head points to the raised section }. Build the 3D head-section plane at 35 deg + pillow behind the card, the drape + knee window
  (hero_props) IN FRONT of the card from the chest down. Mirror with dir -1.
- Proof: cast/out/recline_proof.png (2D composite: tilted table, pillow, drape, knee window) + recline_proof_phone360.png. NOT yet a three.js still.

## Numbers (render_cast.mjs, 92 cards incl. 4 reclined)
- RED GATE (hue within 12 deg of #e01e2a, S>.5, V>.55): 0 px on all 92 cards (fixed: red pen in the scrubs pockets; open-mouth faces avoided).
- Feet on ground 1440 on all standing cards; recline bbox x 16-768 of 800 (inside the card).
- Face zone: coloured share 0-0.01, shade touched 0 on all unmasked heads. Flags left (8, all explained): surgeon front grey/colour = the mask;
  g5/g1s/g3s/g5s colour = moustache or hat brim edge in the zone; patient/patientShorts BACK streak 214 jumps (grey hair band under the cap back
  + gown print; smooth 0 is the same, so not the costume shade).
- node tools/check_views.mjs: PASS (5 x 6 views, library unchanged).
- heads_tall written into CAST_KEYS (fat 2.79, standard 2.93, thin 3.1, kid 2.04).

## Weak / open
- Reclined proof is a 2D composite, not a three.js still through gpu_render.sh (cap reached). First stretch builder with the OR set should do ONE still.
- The template's OPEN mouths (smile, smileXL, grinXL, gasp(XL), wail, shout) have a pink inside #c94a5f that FAILS the red gate; faces use red-free
  mouths. Lip-sync visemes may also show it: lead to decide exemption for mouth interiors or count per take.
- Drape in the proof covers the arms: the rest hands are under it; only the thumbs-up fist reads. Fine for the story, check in 3D.
- Patient standard face reads a bit stern (chevron moustache over the lens mouth); acting comes from faces_ep.
- Not done: Rick side-by-side (crew/character-artist_vs_rick.jpg), crew check file, line-up still in a set, PRESETS.md, 3D hold checks of props.
- Wristbands are 3D rings (limbs stay one colour) - props helper must build them; the boy's scuff lives on the knee hero prop.
- Move recipes, PART.penPocket and capOf into the library when CB locks the cast.

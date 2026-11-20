# Real hand grips, kneel and lying (2026-11-12, waiting for CB's OK)

pictures/  hands_rick_vs_ours, grips_before_after_4views, grips_8kinds_3sizes, grips_two_hands_4views,
           closeup_real_hands, kneel_before_after, lying_v1_before, lying_v2_legs_feet_bed
kit_patch/ new vector2d_characters/code/grips.mjs; changed char2d.mjs (kneel legs only), threejs_film/poses.mjs
           (grip_* and lie_* poses, kneel), puppets.mjs, film.js (lying card turn), motion_styles rig.mjs, rig_cast.mjs,
           moves/act_hammer.mjs (wrap); test sheet tool threejs_film/test_grips.mjs

How it works
- Hand on a handle: the object is drawn first, then a round black fist ON TOP with a thumb lobe and finger creases,
  centred on the shaft; the shaft comes out both sides. Two hands = both fists on one straight shaft.
- Kinds: pole, two-hand, shoulder pole, edge (sign/box held by fists on the front corners), behind (shield covers
  the hand), hang (lantern/bucket straight down from the fist), handles (cart push).
- Close-up shots: realHand = black glove with four fingers wrapped round the handle and the thumb along it.
- Motion library moves: held entry gets `wrap: <handle angle>` (or `grip: {obj}`) and the fist closes round it.
- Kneel: body upright, thighs straight down, knees on the floor (side: shin back along the floor).
- Lying legs (v2, CB 13:14Z): own leg drawing in char2d (S.liePose): heels on the floor line, toes up on the back, soles up on the belly, knee-up and kick (belly on a bed) variants, no standing foot shadow.
- Lying: whole card turned 90 degrees in film.js and resting on the floor, always the side view, head at one end,
  face to the lens. Top-down camera: pose lie_flat, card laid flat on the floor.
Install on the PC only after CB's OK; back up the originals to <your backup folder>\grips_2026-11-12\before;
re-read PC files and merge (other threads change them); run tools\check_views.mjs after.

Lying in perspective (v3, CB 13:39Z "the camera view angle. perpective"): new threejs_film/lie_cam.mjs.
- The body lies along a real line on the floor (act key lie_yaw in degrees; without it the body lies across the shot as before).
- Every frame the camera decides the drawing: camera high = top drawing (front view on the back, back view on the belly)
  laid along that line; body across the shot = side lying drawing turned to the floor line (diagonal in 3/4 shots);
  body pointing at the lens = 'feet' drawing (big soles in front, belly, head peeking behind) or 'head' drawing.
- Card never squashed; it is slid toward the lens along its own ray when it would dip under the floor.
- Test: node threejs_film/test_lie3d.mjs out.png (three.js scene, 6 cameras, floor and bed). Not yet tried in a full film render.

## Logic round (CB 18:58-19:01Z: "which grip which side", kneel working on the side, body-mechanics rule)
Files: kit_patch_logic/ (grips.mjs, char2d.mjs, poses.mjs, test_grips.mjs). Pictures: pictures/logic_*.png. NOT on the PC yet (waits for CB's OK).
- Same hand in every view: items default to the RIGHT hand; shield on the LEFT arm (GRIP_OBJECTS.shield.hand 'L'); state.hand or grip.hand overrides.
- Near/far: facing right, the right hand is near; facing left it is far. A one-hand hold in the far hand (side, 3/4) is drawn behind the body (arm in back[], item under).
- Back view: hands mirrored; shield shows its wooden inside with the fist on the strap.
- Kneel to work: poses kneel_work (both hands low to the work) and kneel_hammer (right hand raises the hammer). One knee up on the work side, the other knee on the floor; side view leans to the work, front view does not lean (rotSide). toolHand 'R' puts the work on the right-hand side in front, 3/4 and back.
- Body mechanics: arms never stretch past full length (arm() clamp); foot shadow stays on the floor when the body drops (S.shadowDy).
- check_views PASS 20/20 on the PC files plus these changes.

# Acting habits on the faces (CB 2026-11-13 02:21 Bangkok, "CHARACTER ACTING & MICRO-EXPRESSION RULES")
Not on the PC yet: waits for CB's OK. This kit_patch includes the grip-logic round (characters/grips_2026-11-12/kit_patch_logic), which is waiting for CB's OK too.
New face presets in char2d.mjs FACES (use as face 'k:<name>' in film.json acts):
think, concentrate, aim, lipBite, holdBreath, browUp, frozenTongue, glanceCam, nervousSmile, proud.
New parts: eyes squint, shut, lookSide; mouths tongueCorner, lipBite, pressed, nervous, proud; fx puff (cheeks), held.
F.side = which mouth corner / glance side (1 = screen right). It defaults to the facing side when the head is turned.
Fix: faceKit no longer mutates a shared preset when a face is passed as a string.
New pose kneel_hammer_hit (poses.mjs): the hammer head comes down on the work.
Tests: threejs_film/test_faces.mjs (face close-ups x views); test_grips.mjs pose tuple 4th element takes {face, side, turn, extra svg}.
check_views PASS 20/20.
Gaps: no real head tilt or breathing in one picture (they come from the film's head rotation and timing); the face turn to the camera at the end of the gag is weak in side view.
- Side view (CB 02:31 Bangkok): only the near arm is fully seen; the far (back) arm and its prop are drawn behind the body (poses.mjs S.arms side branch, under[]).
- Side view v2 (CB 02:33 'it need to be shown but correctly'): the far arm starts a little behind and above the near shoulder, behind the body; with a two-hand hold the far arm takes the hand further out; when both bare hands meet at one spot the far hand reaches a little higher and further, so its forearm and fist show past the body. When the far hand is exactly behind the near one on a held thing (cart handles, sign) it stays hidden behind the near fist.

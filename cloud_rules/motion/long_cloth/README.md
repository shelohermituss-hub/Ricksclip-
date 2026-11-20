# Long cloth motion (thread "Rework character motion for long cloth", 2026-11-12)

CB: "we need to work on the character motion again since we add long cloth to it".

Problem: the motion library (templates/motion_styles) and the film bridge (threejs_film/puppets.mjs moveDraw) draw their own legs with S.noLegs,
so char2d never saw the legs and a long cloth (S.skirt, 233 of the 500 outfits) stayed a stiff standing tube in every move: through stools and the
floor when sitting, kneeling, crawling or lying, no swing in walks, leaning with the body in runs. Capes (S.behind) stuck up in the air on a crawl.

Fix (kit_patch/, NOT on the PC yet, waits for CB's OK on the clip):
- motion_styles/cloth_live.mjs (new): applyLive(S, legsW, toLocal, rot, G, lag, ox) passes the rig's legs to char2d in body coords (S.legsLive),
  world-down (S.clothG), the floor (S.clothFloor), leg length (S.legLen) and a follow-through offset (S.clothLag). clothLag(poseAt, t, ch) is stateless:
  a damped spring over the last 14 frames of hip motion, so cloth trails, settles in about 8-12 frames and is dead still in holds.
- vector2d_characters/code/char2d.mjs: only active with S.noLegs + S.legsLive. Three cases:
  upright = the approved A-line, hem corners make room for the feet, edge curves pass just outside a lifted knee, hangs to gravity, never below the floor;
  every thigh bent past 55 deg (sit, tuck) or hips low in front view (kneel) = the approved lap drapes fed with the rig's knees;
  hips low in side view (kneel, crouch) or body tipped 35 deg+ (crawl, fall, lie) = the cloth wraps the legs (hull), sags, is cut at the floor.
  Capes: skew with the lag and gravity, lie along the back when face down, clipped at the floor.
  Static characters are pixel-identical: tools/idt.mjs compared 1,728 drawings (72 outfits x 2 sizes x 4 views x stand/chair/kneel) against the old file, 0 different.
- motion_styles/rig_cast.mjs: calls applyLive before drawCharacter; accepts P._lag.
- threejs_film/puppets.mjs (moveOf + moveDraw), film.js (loads motion/cloth_live.mjs), render.mjs (copies it into the cache).
Rick check: in "How One Cart Stopped an Entire Army" his robes are simple shapes that barely flutter, so the follow-through is kept small.
Open: lap drape on crossed legs (sit/C front) is a wide wedge; horse riding and ladder not tuned; 3/4 and back views only as far as the library has them.
Tools: tools/sheet.mjs (stills grid), tools/clip.mjs (before | after clip; needs a kit_before copy with the old char2d + rig_cast).

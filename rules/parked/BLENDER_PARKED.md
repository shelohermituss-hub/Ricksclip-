# BLENDER RULES, PARKED (2026-11-16)

CB 2026-11-16: "ok lets take it out for now. update the skill" (CB_RULES 11a TAKEN OUT FOR NOW). These lines were in CB_RULES.md until the v2 audit. They are NOT read and NOT followed until CB asks for a Blender pass by name in a new message; then the lead reads this file whole and puts the lines it needs back into CB_RULES.md. Nothing here was deleted: each line is CB's rule as it stood.

<!-- from CB_RULES.md line 56, section 3. World and look (Rick's 3D world, n -->
- [ ] HOW THE WORLD IS MADE, never skipped (CB 2026-11-11: "make image in code first and we can compare", "and then put in blender", "totally different from the witch and airfield"; CB also corrected the skipping of Stage 1 twice on 2026-11-09):

<!-- from CB_RULES.md line 57, section 3. World and look (Rick's 3D world, n -->
  1. Hero object first, alone, as a detailed model (airfield: the Po-2, about 38,000 triangles; BlenderKit first).

<!-- from CB_RULES.md line 58, section 3. World and look (Rick's 3D world, n -->
  2. STAGE 1 = the picture made in code: the whole scene built by Python as a dense 3D scene in the finished toon-and-ink look (30+ prop kinds, 600+ objects, one clear focal point, lamps, haze), with render-look-fix rounds until it matches references/look_locked/stage1_airfield_approved.png in quality. Show CB.

<!-- from CB_RULES.md line 59, section 3. World and look (Rick's 3D world, n -->
  3. STAGE 2 = Blender material effects: the SAME scene converted to the locked main look (materials, engine light, grade). Nothing rebuilt. Target: night_airfield_approved.png.

<!-- from CB_RULES.md line 60, section 3. World and look (Rick's 3D world, n -->
  CB'S 7 BUILD STEPS, in this order for every place (CB 2026-11-11: "1. shot plan, 2. then the build, 3. then check camera angle, 4. environment overhaul, 5 post procession, 6 shading, 7 check the frames send fix to builder"):

<!-- from CB_RULES.md line 61, section 3. World and look (Rick's 3D world, n -->
  1. Shot plan: shot table row + Rick reference frames for this shot, before any model.

<!-- from CB_RULES.md line 62, section 3. World and look (Rick's 3D world, n -->
  2. Build: hero object alone, then the scene blocks and the characters in library poses.

<!-- from CB_RULES.md line 63, section 3. World and look (Rick's 3D world, n -->
  3. Camera check: lens, height and angle against the Rick frame of the same shot kind; subject big, hero object not covered, faces above the caption line. Fix the camera BEFORE adding detail.

<!-- from CB_RULES.md line 64, section 3. World and look (Rick's 3D world, n -->
  4. Environment overhaul: Stage 1 density (30+ prop kinds, 600+ objects, big foreground props, background, sky).

<!-- from CB_RULES.md line 65, section 3. World and look (Rick's 3D world, n -->
  5. Post processing: grade and bloom (post_toon.py, later grade.py).

<!-- from CB_RULES.md line 66, section 3. World and look (Rick's 3D world, n -->
  6. Shading: Stage 2 = Blender LAYERS only over the coded frame (see BLENDER = ONLY THE LAYERS IT DOES BETTER).

<!-- from CB_RULES.md line 67, section 3. World and look (Rick's 3D world, n -->
  7. Check the frames: a SEPARATE checker (not the builder) looks at every frame beside the Rick frame and the look_locked target, writes one fix list, the builder fixes all, repeat until it passes. Only then CB sees it.

<!-- from CB_RULES.md line 68, section 3. World and look (Rick's 3D world, n -->
  ADDED TO THE 7 STEPS (proposed by Claude 2026-11-11 after CB asked "what else we need?"; CB can strike any of them):

<!-- from CB_RULES.md line 69, section 3. World and look (Rick's 3D world, n -->
  a. Before step 1, the ONE-LINE PICTURE TEST: write in one sentence what the viewer understands with the sound off. No sentence = no shot.

<!-- from CB_RULES.md line 70, section 3. World and look (Rick's 3D world, n -->
  b. Inside step 2, ACTING: poses from the motion library, hands ending on the object, calm start face. Checked before the camera.

<!-- from CB_RULES.md line 71, section 3. World and look (Rick's 3D world, n -->
  c. Between 4 and 5, LIGHT as its own step: one key light, hard long shadows on the floor, the subject brighter than the background.

<!-- from CB_RULES.md line 72, section 3. World and look (Rick's 3D world, n -->
  d. Shading (6) is judged before the final grade; post processing is run again last, on the shaded frame.

<!-- from CB_RULES.md line 73, section 3. World and look (Rick's 3D world, n -->
  e. After 7, MOTION CHECK: the shot is checked moving (walk, push-in, the way in and out of the shot), not only as a still.

<!-- from CB_RULES.md line 74, section 3. World and look (Rick's 3D world, n -->
  f. A frame CB approves is saved to references/look_locked as the new target for the next episodes.

<!-- from CB_RULES.md line 75, section 3. World and look (Rick's 3D world, n -->
  The three.js scene is for staging, camera and timing only. A flat sketch or a simple block set is never shown as the look. Details: SKILL.md FULL WORKFLOW steps 4-7, memory airfield-process.md.

<!-- from line 88 CONTACT SHADOW -->
  - In Blender the flat cards do not occlude by themselves: give each card a contact patch at its feet (decal or shadow-only plane on the floor) and keep EEVEE AO / fast GI on for the world.

<!-- from CB_RULES.md line 111, section 3. World and look (Rick's 3D world, n -->
  - How: look_rc.py style=real in episodes/roller-coaster/look (variants/inst/real_trees/real_ground/real_grass/real_car/place_cars). The 2D cast stays as it is.

<!-- from CB_RULES.md line 112, section 3. World and look (Rick's 3D world, n -->
- [ ] LIGHT AND BRIGHTNESS ARE FINISHED IN THE CODED STORYBOARD; BLENDER KEEPS THEM (CB 2026-11-11 on the dark night station test: "why is ours so dark and bad lighting", "contrast is too strong", "light brightness should be finished in the coded already. The Blender just gives the effects and material and texture, but keep the coded style"). Blender adds materials, textures, real shadows, reflections and effects only. Before CB sees a Blender frame, put it next to the coded frame of the same moment: overall brightness, how even the light is, and each surface's colour must match the coded one. Never one strong spotlight that leaves the rest dark, never crushed blacks, no added contrast or dark corners in the finishing step. Night = an evenly lit scene tinted blue (as Rick does), not a dark scene with a lamp.

<!-- from CB_RULES.md line 114, section 3. World and look (Rick's 3D world, n -->
- [ ] BLENDER = ONLY THE LAYERS IT DOES BETTER (CB 2026-11-13 10:48 Bangkok, roller coaster thread: "yes thats the new rule. only take what blender do better."). For every film the coded three.js frame is the FINAL BASE: faces, cards, colours, light, framing and fx stay exactly as they are. A full Blender frame is no longer the final picture. Blender renders only MASKED LAYERS from the same lock camera, composited over the coded frame: metal reflections that move with the camera, wood grain and surface texture, bounce light, lit smoke and haze, light glowing through paper or snow, glints, motion blur on fast fx (never on characters). Each layer gets a before/after against the coded frame shown to CB; keep only a layer that clearly adds something, never one that makes the frame darker or flatter. This REPLACES the old Stage 2 "whole frame in Blender" step (step 6 above and SKILL.md FULL WORKFLOW Stage B are now "Blender layers"); BLENDER KEEPS THE CODED LIGHT and BLENDER NEVER WEAKER still hold. First used on the fireworks test (snow sparkle and burst bounce kept; lanterns, smoke and blur dropped).

<!-- from CB_RULES.md line 115, section 3. World and look (Rick's 3D world, n -->
- [ ] BLENDER NEVER WEAKER THAN THE STORYBOARD (CB 2026-11-12 10:11Z on the roller coaster Blender film: "Is almost a downgrade", "texture details FX lighting missing", "no hammer, no blueprint chart, no money pocket"). A Blender frame is never weaker than its storyboard frame. Before CB sees any Blender picture, every frame (every 0.5 s) is put beside its storyboard frame; any prop, painted texture, glow or light pool, colour, or word that the storyboard has and the Blender frame lacks means the frame is not done. Things the lock export loses and must be carried over: held props (unnamed meshes in noExport groups), canvas-painted faces (boards, plates, patterned cloth), sky details (moon craters, night clouds), objects hidden at frame 0 (crash parts), instanced part colours (instances.json base), vertex-painted ground colours, and painted word planes, which must be parented to the cloth they hang on. No sheen on grass or leaves, because it turns lawns pale.

<!-- from CB_RULES.md line 116, section 3. World and look (Rick's 3D world, n -->
- [ ] PRODUCTION-READY 3D MATERIALS, MECHANICAL GEOMETRY AND BLENDER SHADING (CB 2026-11-13 02:09 Bangkok, pasted as a rule; his 16 points kept): identify the correct real-world materials, construction, surface properties and mechanical relationships for every object in the story. 1 MATERIAL IDENTIFICATION: name each component's material (wood, metal, stone, concrete, glass, plastic, rubber, fabric, soil, grass, water...) and give it a matching shader; never generic plastic-looking materials. 2 CLEAN MODELING: correct scale, consistent topology, real thickness, correct normals, clean intersections, subtle edge bevels; no holes, overlapping faces, z-fighting, broken surfaces or needless polygons. 3 MECHANICAL PLAUSIBILITY: tools, machines, furniture, vehicles and structures have parts that could work: hinges on valid pivots, wheels on axles, screws and bolts joining parts, gears that mesh, supports that carry the load, clearance for moving parts; no decorative mechanics that cannot function. 4 PBR MATERIALS: base colour, roughness, metallic, normal or bump, and displacement or transmission where needed; reflectance and finish match the real material. 5 WOOD: grain direction follows the shape and how the part was made, end grain on cross cuts, fibre variation, believable cut faces, knots where they fit. 6 METAL: polished, brushed, painted, rusty and rough metal look different (metallic response, reflection, roughness, wear, machining detail). 7 STONE AND CONCRETE: irregular surfaces, chips, pores, cracks, layers, roughness; natural rock, cut stone and concrete look different. 8 GRASS AND VEGETATION: grounded blades or clumps with natural size and direction variation, density that fits, real transitions to other ground; no flat plastic grass, no repeating pattern. 9 GLASS AND TRANSPARENT: real thickness, transmission, refraction, reflection, roughness; clear glass, frosted glass and plastic look different. 10 SHINE: highlights and reflections come from material, light and geometry (roughness, reflectivity, environment), never painted white glare. 11 UV AND TEXTURE: consistent texture scale and texel density, logical UV direction, minimal stretching, deliberate or seamless material transitions. 12 STYLIZED ART DIRECTION: keep our polished stylized 3D cartoon look: clean silhouettes, simplified geometry, readable materials, controlled highlights; no photoreal noise. 13 BLENDER-READY: meshes, materials, textures, pivots, modifiers and object names organised for reuse; editable node materials on Principled BSDF. 14 SURFACE RESPONSE: wood, metal, glass and stone react differently to the same light; forms stay readable with the key light, fill, rim and contact shadows. 15 ASSET CONTINUITY: material identity, texture scale, wear, geometry and mechanics stay the same across all scenes and camera angles. 16 QUALITY VALIDATION before final render: check every asset for wrong materials, stretched textures, too much shine, bad normals, floating parts, intersecting geometry, implausible construction and wrong scale. Every object is recognisable, mechanically understandable where relevant, beautifully shaded and ready for reuse and animation in Blender. HOW IT FITS OUR RULES: point 12's 'consistent outline thickness' means our existing lines only (the cast's outline and fine BUILD lines on objects); no ink outlines on the world (section 3 lines rule stands). Point 14's light stays the coded light (BLENDER KEEPS THE CODED LIGHT: Blender adds no new key or contrast). Characters keep the clean look (CAUTION ON CHARACTERS). Owners: props-hero builds parts and mechanics (point 3) in the kit, 3d-designer owns points 1-2 and 4-13 and 15-16 in Blender with a materials list per object in `look/<place>_MATERIALS.md`, look-finisher and lighting-director check point 14 and 16 on the render.

<!-- from line 117 -->
- [ ] Renders local EEVEE.

<!-- from CB_RULES.md line 267, section 8. Build fixes learned (magic bell, 2 -->
- [ ] Run `proj.py tune.json` before EVERY render: each card's feet and head must land inside 0.08..0.92 of the frame width, and the camera must not sit inside any set object (booth radius, candle stands, walls). A camera inside geometry gives a black or curtain-only frame.

<!-- from CB_RULES.md line 271, section 8. Build fixes learned (magic bell, 2 -->
- [ ] Hands on an object: cards turn toward the camera, so place the card origin at hand point minus the hand offset (from cards/meta.json) along screen-right, with the hand a few cm in front of the surface facing the camera; otherwise the hand sinks behind the object.

<!-- from CB_RULES.md line 273, section 8. Build fixes learned (magic bell, 2 -->
- [ ] A backdrop plane behind a window (sky, garden) must not cast shadows (visible_shadow = False), or the sun patch through the window disappears.

<!-- from CB_RULES.md line 276, section 8. Build fixes learned (magic bell, 2 -->
- [ ] Cloud bpy needs `apt-get install libegl1 libegl-mesa0`, or bpy dies silently with exit 134.

<!-- from line 277, superseded -->
- [ ] Dark limbs vanish on dark objects (ink-black arm on the black ink bell): draw a white open palm at the hand (cards_gen over.palmHand) so every touch reads. Place a touch card WITHOUT the mirror flag (mirror puts the hand on the other side).

<!-- from CB_RULES.md line 278, section 8. Build fixes learned (magic bell, 2 -->
- [ ] Cloud renders die when the container idles: render each still in the foreground (res 55, 20 samples, about 8 min) and send results as they finish.

<!-- from CB_RULES.md line 279, section 8. Build fixes learned (magic bell, 2 -->
- [ ] Card lighting in Blender (2026-11-12): the card shader takes light from both faces (diffuse + translucent) with an own-colour floor of 0.7 by day and 0.35 at night, plus a key-side band: the half toward the key is brighter in the key colour, the far half takes a cool shadow tint (hall_head.py card(), tune card_emit, card_side, card_band). Do not stack edge_shadow.py on v12+ cards: the template draws the face shadow.

<!-- from line 282 FIREWORKS items 4-5 -->
4 Blender layers: glints on snow work; a bounce-light layer needs the sky key off and a character mask, or it veils the snow and greys the cards; lantern glow went neon and volumetric smoke flattened the sky, so drop those layers unless a before/after proves them. 5 The lock export writes decal alpha as white (snow footprints): dump decals separately (look/dump_decals.mjs) before a Blender layer pass.

<!-- from CB_RULES.md line 316, section 10. THE PROVEN BUILD METHOD (pin stre -->
- BLENDER LAYERS ON RUNPOD (CB 2026-11-14: "ok do runpod"). Blender layer frames render on rented RTX 4090 machines, not on our card: the picture matches local to 0.005 of 255, so cloud and local frames can share a shot. One Blender process is held up by the processor (tens of thousands of objects set per frame), so the speed comes from 6-8 processes per machine (4.2-4.6 s a frame against 23 s here) and from several machines at once. Steps and image in `episodes/armor-no-holes/blender_metal/RUNPOD.md` (needs `libegl1 libgl1 libopengl0`). Only the lead creates machines; check a machine's upload speed in the first 2 minutes and drop a slow one (one upload crawled at 18 MB in 20 minutes); terminate each machine the moment its frames are counted on this PC. Armor film: 362 metal frames, about 1 h 20 min of machine time, about 1.30 USD. Put the Blender layer only where the thing it improves covers at least 1.5 % of the picture (measured per frame on the matte); in wide shots it adds glints and nothing to see.

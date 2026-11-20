# Character template upgrade: handover (2026-11-11, 15:40Z)

## Locked by CB
- **Standard template v12** (CB: "Lock this as standard template").
  - Ink line is thicker on the side away from the light, on head and body.
  - Bigger face parts, with the brows following the 3D geometry.
  - Soft grey face shadow on the side away from the light.
  - Legs set wider; toes 45 degrees down in front and 3/4, toes up in the back view.
  - Thicker limbs and fists.
  - In the back view, the arms sit behind the body and the outfit has its own back design.
- **Rules** (VIEW_RULES 6-22, CB_RULES section 4):
  - Line shadow comes from the light source.
  - Leg and feet direction follow the camera view.
  - Limbs act like human limbs.
  - Outfit and face match the environment colour, light and reflections. The face reflects light sources and goes darker at night (this replaces the self-lit lock).
  - Hats, hair, fur, ears and snouts turn with the view.
  - Hair colour is the same in every view, with the pink hair tie.
  - Back clothing is its own design.
  - Tails sit at the back.
  - Rule 22: when sitting, kneeling or crouching, the thighs become part of the outfit and the ink legs start at the knee (ref: Rick's seated cashier).
- **Locked package:** new-characters/vector2d/LOCKED_cast_v2_NEW_STYLE/ (code, VIEW_RULES.md, views_golden v8).
- **Scope:** new episodes only. Roller coaster and magic bell finish on the old cast.

## Built, waiting for CB's verdict
- **Rule 22 seated thighs.** Pictures and code are in v13_seated/ (poses_before.png, poses_after.png, char2d.mjs, bodies.mjs, poses.mjs).
  - check_views PASSES, so the standing views are unchanged.
  - The front sit and kneel come out short, because the knees point at the camera. CB may want more thigh showing.
  - After CB's OK, copy the v13 code into the LOCKED package too.

## Queued for the PC (rules/pc_push/; the PC link dropped at about 15:16Z)
- CB_RULES.md: the face-follows-light update, v12 and rule 22.
- character_template_v12/:
  - code/: char2d, bodies (v13), castkit
  - threejs_film/: puppets.mjs, poses.mjs
  - episode_jack/jack.mjs
  - views_golden v8
  - VIEW_RULES.md
  - REF jpg
- Before pushing:
  - Re-read the PC files.
  - Back up to <your backup folder>\character_template_upgrade_2026-11-11.
  - Diff puppets.mjs and poses.mjs against the PC copies, because the cloud base came from the magic-bell kit (puppets_BASE_was_magicbell_copy.mjs).
- After pushing:
  - Run tools\check_views.mjs on the PC.
  - Run tools\refresh_installed_skill.py.
  - Add the new rules to SKILL.md.

## Open
- Meme faces (e.g. the inspector) are not scaled up like faceKit.
- Most cast characters still need their own backDetails. Only standard, dad and lady have them.
- The Blender edge_shadow may stack on the new face shadow. Check this on the first Blender frame.
- Full log: memory character-limb-change-2026-11-11.md.

## Update 15:41Z: CB rejected the front seated legs
CB's words, with Rick's cashier frame: "totally wrong. Every limb is viewed by camera angle. This is front sitting, the leg line will move to the lower body part".

So in the front, 3/4 and back views there is no thigh shape. The ink leg starts ON the lower body, drawn over the coat. It goes out to a knee at the body's bottom edge, then the shin goes down to the floor with 45° toes. The side view keeps the outfit-coloured thigh.

Work in progress is in v13b_front_sit_wip/:
- char2d.mjs: the front branch builds `seatFront` paths and draws them after the body ink.
- poses.mjs: new pose `sit_chair` (drop .42, spread .08).
- poses_after2.png and poses_sheet.mjs: the test sheet.

Still to do:
- Spread the knees wider. In Rick's frame the legs splay out past the body edge, starting from near the centre of the lower body.
- Check the 3/4 and back views.
- The front kneel legs come out very short.
- Show CB, re-run check_views, then update pc_push.

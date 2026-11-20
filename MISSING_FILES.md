# Missing files (damaged download, 2026-11-20)

The archive `RicksClips_Animation_Skill_V1.2.zip` that was on Google Drive is damaged: two blocks of it (about 5.9 MB and
5.8 MB) contain only zeros. The file was downloaded twice with the same result, so the copy on Drive itself is incomplete
(usually an upload or a download that stopped half way). 965 files came out intact; the 67 below could not be read.

**What this blocks:** `templates/vector2d_characters/code/char2d.mjs` and its sister files are the character engine. Without
them no character can be drawn, so the storyboard, the animatic and the final render stop with "puppet package not found".
Everything else (plan check, sound kit, voice, rules, agents) works.

**How to repair:** download the zip again from the original source, check that it opens without errors on the PC, upload it
again and give Claude the new link. Claude then copies only these 67 files into place and runs
`python tools/install.py --check` (the line "character package" must say ok) and the two tests of INSTALL.md step 5.
Then delete this file.

## The 67 files
- `templates/vector2d_characters/code/board2.mjs`
- `templates/vector2d_characters/code/board3.mjs`
- `templates/vector2d_characters/code/bodies.mjs`
- `templates/vector2d_characters/code/bodyboard.mjs`
- `templates/vector2d_characters/code/bodyboard2.mjs`
- `templates/vector2d_characters/code/cast.mjs`
- `templates/vector2d_characters/code/castkit.mjs`
- `templates/vector2d_characters/code/castsheet.mjs`
- `templates/vector2d_characters/code/CAST_BRIEF.md`
- `templates/vector2d_characters/code/CAST_BRIEF2.md`
- `templates/vector2d_characters/code/char2d.mjs`
- `templates/vector2d_characters/code/faces_monster.mjs`
- `templates/vector2d_characters/code/faces_teen.mjs`
- `templates/vector2d_characters/code/faces_villain.mjs`
- `templates/vector2d_characters/code/face_gear.mjs`
- `templates/vector2d_characters/code/face_sheet.mjs`
- `templates/vector2d_characters/code/gear_sheet.mjs`
- `templates/vector2d_characters/code/grips.mjs`
- `templates/vector2d_characters/code/hairlib_sheet.mjs`
- `templates/vector2d_characters/code/hair_lib.mjs`
- `templates/vector2d_characters/code/head_gear.mjs`
- `templates/vector2d_characters/code/head_wear.mjs`
- `templates/vector2d_characters/code/long_cloth.mjs`
- `templates/vector2d_characters/code/memes.mjs`
- `templates/vector2d_characters/code/memes2.mjs`
- `templates/vector2d_characters/code/memes3.mjs`
- `templates/vector2d_characters/code/of_check.mjs`
- `templates/vector2d_characters/code/outfits_100.mjs`
- `templates/vector2d_characters/code/outfits_200.mjs`
- `templates/vector2d_characters/code/outfits_300.mjs`
- `templates/vector2d_characters/code/outfits_400.mjs`
- `templates/vector2d_characters/code/outfits_500.mjs`
- `templates/vector2d_characters/code/outfit_cols.mjs`
- `templates/vector2d_characters/code/outfit_hook_test.mjs`
- `templates/vector2d_characters/code/outfit_lib.mjs`
- `templates/vector2d_characters/code/outfit_sheet.mjs`
- `templates/vector2d_characters/code/pieces_sheet.mjs`
- `templates/vector2d_characters/code/size_lock_sheet.mjs`
- `templates/vector2d_characters/code/size_sheet.mjs`
- `templates/vector2d_characters/code/wear_sheet.mjs`
- `templates/vector2d_characters/code/wear_sheets.mjs`
- `templates/vector2d_characters/code/sheets/sheet01.mjs`
- `templates/vector2d_characters/code/sheets/sheet02.mjs`
- `templates/vector2d_characters/code/sheets/sheet03.mjs`
- `templates/vector2d_characters/code/sheets/sheet04.mjs`
- `templates/vector2d_characters/code/sheets/sheet05.mjs`
- `templates/vector2d_characters/code/sheets/sheet06.mjs`
- `templates/vector2d_characters/code/sheets/sheet07.mjs`
- `templates/vector2d_characters/code/sheets/sheet08.mjs`
- `templates/vector2d_characters/code/sheets/sheet09.mjs`
- `templates/vector2d_characters/code/sheets/sheet10.mjs`
- `templates/vector2d_characters/code/sheets/sheet11.mjs`
- `templates/vector2d_characters/code/sheets/sheet12.mjs`
- `templates/vector2d_characters/code/sheets/sheet13.mjs`
- `templates/vector2d_characters/code/sheets/sheet14.mjs`
- `templates/vector2d_characters/code/sheets/sheet15.mjs`
- `templates/vector2d_characters/faces_png/faces_monster.png`
- `templates/vector2d_characters/faces_png/faces_teen.png`
- `templates/vector2d_characters/faces_png/faces_villain.png`
- `templates/vector2d_characters/faces_png/new_body_forms_toddler_teen_brute_ghost.png`
- `templates/vector2d_characters/sheets_png/sheet01_ancient_world.png`
- `templates/vector2d_characters/sheets_png/sheet02_old_asia.png`
- `templates/vector2d_characters/sheets_png/sheet12_babies_toddlers_kids.png`
- `templates/vector2d_characters/sheets_png/sheet13_teens_parents_grandparents.png`
- `templates/vector2d_characters/sheets_png/sheet14_villains.png`
- `templates/vector2d_characters/sheets_png/sheet15_monsters.png`
- `templates/vector2d_characters/sheets_png/three_sizes/sheet01_ancient_world_sizes.jpg`

# CASTING: Why Fire Trucks Turned Yellow (character-artist 2026-11-20, phase A, NOT locked by CB)
Sheet module: `cast/sheets/firetrucks.mjs` (period check in its header) · keys: `cast/CAST_KEYS.json` · one command: `node episodes/yellow-fire-trucks/cast/tools/render_cast.mjs`
Pictures: `cast/sheets/CAST_SHEET.jpg` (all characters, six views, black fills), `CAST_FACES.jpg` (face and hair zoom), `LINEUP.jpg` + `LINEUP_phone360.jpg`. Numbers: `cast/out/numbers.json`.
Package untouched: bodies (three sizes + kid form), outfit_lib parts, hair_lib, head_wear, head_gear `fire` and face_gear are used as they are. Film recipes `yt*` and three small parts (bolo, visitorTag, collarPins, bibGrey) are registered in the sheet module at load, like fake-surgery. The kit fire helmet (red shell, gold shield, "7") and the gold trims of the library cap/cowboy hat/bib are RECOLOURED at draw time (shape unchanged), because LOOK_BIBLE allows no red and no yellow on a person.

| ID (cast:firetrucks/...) | Role | Size, height | Outfit key, colours (LOOK_BIBLE source) | Hair / head / face gear | Signature (fixed) | Why |
|---|---|---|---|---|---|---|
| hero | Fireman-Eye-Doctor, yard | thin, 1.88 | ytHeroYard: turtleneck TEAL #12A5A0 (hero signature), braces + bunker trousers black #2e2d34 (turnout black), reflective band #e6e9ee (silver-white) | sidePart #6b4423; black helmet, plain black front, pushed back (hatDrop -14) | big round wire glasses (kit roundGlasses) | calm expert; teal pops against red and lemon |
| heroShop | same man, eye shop (lines 3-4) | thin, 1.88 | ytHeroShop: short white coat #f4f2ec open over the TEAL roll-neck, 3 pockets | head mirror on a black band (sheet piece) | glasses + teal | doctor at a glance |
| heroShopEye | same man, eye shop, S2 row 11 "eye" (FIX 1) | thin, 1.88 | ytHeroShop | head mirror swung DOWN over the right eye (band + faceTop disc, centre hole on the eye) | glasses (left lens clear) + teal | the doctor looking through his mirror |
| scepticDriver / rookieDriver / milkmanDriver | the drivers at the wheel, S3 / S6 (FIX 1) | as the base puppet | as the base puppet | same; card cut under the hips, pose 'drive', in_vehicle (DRIVER_NOTE.md) | as the base | no body through the cab |
| heroBare | same man, no helmet (last picture option) | thin | ytHeroYard | sidePart | glasses | for the mug shot if the lead wants the face clear |
| chief | the mocker, speaks line 2 | fat, 1.62 | ytChief: navy #1f2a54 shirt and trousers (turnout navy), black tie, silver badge, collar pins and big buckle (silver, not gold) | buzz grey #a6a6ae; WHITE helmet #f1efe9, navy front lettered CHIEF | grey walrus moustache (kit walrus lifted 10 px, 92 %, so the mouth shows under it) | round loud boss; only white helmet, only fat body in the yard |
| chiefVisitor | Chief in Dallas (line 13) | fat | ytChiefVisitor: + white VISITOR tag, badge moved right | same | same | open question 1 |
| chiefDown | Chief after the hit (line 14) | fat | ytChief | helmet dropped over the eyes (hatDrop 64), moustache bent 9 deg | same | "helmet over the eyes, bent moustache" |
| oldTimer | Old-Timer | standard, 1.76 | ytCoatOpen: turnout black, two silver-white bands, coat open over a white undershirt, flap pockets, back number 3 | elderGrey + grey sideWhiskers; black helmet, silver-white front "3", low on the brow | dented lunch box in the LEFT fist (PROP, props dept) | slow, comfortable |
| rookie | Rookie | thin, 1.64 | ytCoatButtoned: 4 chrome clasps to the chin, collar up | moptop sandy #c2ad86 (tan-blond, not yellow); freckles; helmet x1.16 | helmet one size too big | young, eager |
| rookieDown | Rookie, helmet over the eyes | thin | same | helmet x1.16 dropped 58 px | same | plan rows 27, line 1 jump |
| sceptic | Sceptic | standard, 1.88 | ytCoatStd: 3 clasps, silver-white name tag, side pocket | feathered dark #3a2a22 (long, over the ears) + dark chevron moustache; helmet dead level | arms crossed high (POSE, not costume) | cool, unimpressed |
| crew1-3 | crowd firemen (line 7) | fat / standard / thin | ytCoatCrewA/B/C (open collar; radio strap; collar up) | curlyCrop + handlebar / mullet + bushy / afro + mutton chops | none (crowd) | never clones |
| milkman | Milkman, speaks line 6 | thin, 1.62 | ytMilkman: white #f4f2ec jacket with navy piping, black bow tie, chrome buttons, cream name tag, off-white trousers #e6e2d8 | slickBack #2e2420 + pencil moustache; white peaked cap x0.86, silver badge | full milk bottle in the LEFT fist (PROP) | small honest delivery man |
| kid | Kid with the red ball (line 11) | kid form, 1.18 | ytKid: white tee, two navy bands, denim #4a6a96 shorts | bowlCut #7a5030 | plaster on the LEFT knee (drawn in spec.over) | busy little boy |
| clerk | Dallas Clerk | standard, 1.78 | ytClerk: white western shirt (yoke, pearl buttons), bolo with silver slide, brown #6a4a32 trousers, big silver buckle, chalk dust | sidePart salt-grey #8c8680; tan cowboy hat #c8a46a (tan from palette); pencil behind the ear | tan cowboy hat | Dallas in one glance |
| painterThin | Painter, thin | thin, 1.86 | ytPainter: white bib overalls over a cream shirt, grey speckles, grey stitching | buzz; white painter cap with speckles | brush behind the ear (kit earPencil, wood + grey tip) | brisk |
| painterFat | Painter, fat | fat, 1.64 | ytPainterB: white bib overalls over a grey shirt, speckles | curlyCrop + chevron; white painter cap | rag out of the back pocket (side + back views) | careful |

## Five details per main character
- Hero: round wire glasses; teal roll-neck with rib lines; black braces with clips; bunker trousers with silver-white reflective band; helmet pushed back with a plain black front (shop: open coat, three pockets, head mirror with centre hole on a band).
- Chief: white helmet with navy CHIEF front; walrus moustache; silver Maltese-style badge + collar pins; black tie + flap pockets with buttons + epaulettes; black belt with a big silver buckle.
- Old-Timer: open coat showing the white undershirt; grey side whiskers; company-3 helmet low; flap pockets; back number 3.
- Rookie: oversize helmet; freckles; collar up; four clasps to the chin; hair sticking out under the brim.
- Sceptic: feathered long hair over the ears; chevron moustache; name tag; three clasps; back number 3.
- Milkman: peaked cap with silver badge; bow tie; navy piping; name tag + breast pocket; belt with chrome buckle.
- Kid: bowl cut; navy-band tee; denim shorts with turn-ups; knee plaster; (ball = prop).
- Clerk: cowboy hat; bolo; western yoke + pearl buttons; big buckle; pencil + chalk dust.
- Painters: white caps with speckles; bib overalls with grey stitching; speckles; brush behind the ear / rag in the back pocket; bib + hip pockets.

## Faces (FACES presets vs plan NEEDS)
Exist as presets: proud, browUp, lipBite, aim, glanceCam, think, concentrate, surprised, shocked, sleepy, furious. Proposed as `faces_ep` (kit parts only, package untouched, LEAD OK NEEDED): chiefShout = angry eyes + angry brows + teeth mouth (red-free; the kit `shout` mouth has the pink #c94a5f inside), proudShut = closed eyes + proud mouth, peekOne = one eye shut + one wide (the fist in front is a pose), frozenWide = wideXL + flatXL. Helmet over the eyes = puppets chiefDown / rookieDown (a hat state, not a face).

# astro-flush study: cast keys (character-artist, 2026-11-22; PRIVATE exercise, never published, not locked by the user)

Sheet code: `cast/sheets/astro_flush.mjs` (locked package untouched; own parts, recipes, pieces and faces registered at load).
film.json block: `cast/cast.json`. Picture: `cast/CAST_SHEET.jpg`; zoom: `cast/sheets/CAST_FACES.jpg`; line-up: `cast/sheets/LINEUP.jpg`.
Re-run: `node episodes/astro-flush-study/cast/tools/render_cast.mjs` (about 1 min; reads and updates `CAST_KEYS.json`).
All seven: body form `standard` (the locked bean), face `standard`, six views, limbs ink, no shoes. Hex = median of a patch on the lit side of the reference frame named.

| who | puppet | size | height m | hair (hair_lib) + colour | head gear | face gear | outfit key | colours a / b / c | from frame |
|---|---|---|---|---|---|---|---|---|---|
| NEW GUY | `cast:astro_flush/newguy` | standard | 1.70 | texturedCrop #ba864c | none | none | afNewGuy | #f8d136 / #d9ae1f / #f4f3ef | t_001 |
| COMMANDER | `cast:astro_flush/commander` | standard | 1.76 | buzz #3a3440 | cmdCap = library baseball cap, navy #354173, round gold #e8b93a star badge | none | afCommander | #d63231 / #a82424 / #e8b93a | t_069, t_021 |
| NAVIGATOR | `cast:astro_flush/navigator` | standard | 1.66 | messyBun #8a5630 | pieces navVisor (tan #b98a5a, gold clip) + bunPencil (yellow, through the bun) | none | afNavigator | #8e5bdc / #6c3fb8 / #e8b93a | t_038 |
| FLIGHT DIRECTOR | `cast:astro_flush/director` | thin | 1.82 | sidePart #342f2b | piece headsetBand | acc headset | afDirector | #f4f3ef / #dcdde0 / tie #2b2c3a | t_018, t_055 |
| CONTROLLER green (FAO) | `cast:astro_flush/ctlGreen` | thin | 1.62 | sleekBob #3d3042 | piece headsetBand | acc roundGlasses + headset | afCtlGreen | #2ab29a / #1f9480 / #2b3140 | t_010 |
| CONTROLLER blue (CAPCOM) | `cast:astro_flush/ctlBlue` | thin | 1.66 | curtains90 #c47346 | piece headsetBand | acc headset | afCtlBlue | #487ede / #3566c0 / #2b3140 | t_010 |
| CONTROLLER dark (GUIDO) | `cast:astro_flush/ctlDark` | thin | 1.68 | twoBlock #342f2b | piece headsetBand | acc headset | afCtlDark | #4b4f5e / #3a3e4b / #2b3140 | t_010 (top colour by eye: the patch measured was in shade) |

## Outfit recipes (library parts unless marked NEW)
- Jumpsuits (afNewGuy, afCommander, afNavigator): shirtCollar, zip, belt with a silver buckle, two flap hip pockets, back seam; plus flagPatch (NEW: small striped flag, blue canton, wearer's right chest), and namePatch (NEW: white sewn patch, crooked, hand-drawn stroke letters "NEW GUY") or missionPatch (NEW: round navy patch, gold ring, gold star, white orbit line); commander also gold epaulettes.
- afDirector: shirtCollar, tie, placketBtns (NEW: 3 white buttons on a stitched strip), breast pocket, nameTag (ID). Short sleeves cannot be drawn: arms are ink lines.
- Controller tops: shirtCollar + polo placket, dark lower band (trousers); blue has an ID tag, dark has the mission patch.

## Faces (film.json `face`)
| need | key | note |
|---|---|---|
| smug | `k:smug` | kit |
| eye roll | `k:afEyeRoll` (episode) | half lids, flat brows, flat mouth = the deadpan look of t_021; the kit has no pupils-rolled-up eyes |
| sleepy | `k:sleepy` | kit: closed eyes, open mouth, zzz |
| sweat / worried | `k:afSweat` (episode: big eyes, small round mouth, ONE drop) or kit `k:worried` / `k:nervous` (several drops) | |
| shocked | `k:shocked` | kit (ring eyes, gasp, shock lines) |
| shouting | `k:afGrit` (episode: clenched teeth, angry brows, vein, as t_055) or kit `k:furious` (open shout, steam) | |
| grin | `k:happy` or `k:laugh` | kit |

## Film keys (same as plane-eater)
`face_shadow: true`, `card_shade` amount 0 / rim 0 / hat_shadow 0 / lights [], `costume_shade` amount .45 start .35 cool .15 smooth 40 keep_drawn_light true.

## What our cast cannot do like the reference
- Short sleeves, trouser legs, shoes, cuffs: limbs are single ink lines (locked). The director's shirt ends at the body.
- A patch wider than the body: outfit parts are clipped to the body outline, so NEW GUY is smaller than his (about 13 px letters on the card; readable in close and medium shots, a white tab in wide shots).
- A true eye roll (pupils up): not in the kit eyes; deadpan half-lid is the stand-in.
- Hand props (clipboard, magazine, drink with straw) are 3D props for props-hero, not on the cards.
- Left views mirror the right card: the lettering mirrors in 3/4 L and side L (film.js draws dir -1). Stage the new guy facing right or front when the patch must read.

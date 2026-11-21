# LOOK BIBLE: Why Fire Trucks Turned Yellow (owned by the lead; every helper reads it, none edits it)
v2 2026-11-21: THE RICK RECIPE (CB_RULES section 3; CB: « reprendre le film des camions de pompiers avec ce rendu »). Where v1 below disagrees, v2 wins.

## v2: THE RICK RECIPE applied to this film (read first)
- Two levels of realism: trees, grass, hedges and every truck are REALISTIC and clean (Poly Haven / Sketchfab trees, grass blades, truck paint high-gloss metallic clearcoat reflecting sky and houses, real chrome and glass). Station, eye shop, houses, props: SIMPLIFIED and clean (rounded bevels, flat saturated paint, clapboard lines, a few cracks). Wear and grime at the LOW end everywhere (the hero truck's masking paper and wet paint stay: they are story, not dirt).
- AM (lines 1-4): one hard bright sun, higher than v1 (elevation 35-50, chosen per shot so the hero and the truck front are in full sun), sun #ffe2c0; strong sky fill, shadows lifted and BLUE-VIOLET, soft edged; leaf dapple only on empty ground. Camera sky deep flat blue #0f79e8 (low #1a86f2) with white cumulus; this replaces cornflower #5C8FEA (the teal turtleneck #12A5A0 still reads against it: hue gap and value gap kept; the torso still never against open sky by day). NO warm haze: a slight blue haze on far streets only.
- DU dusk: violet sky (Rick dusk #604bde zenith) over the apricot band, pink-warm key, long soft shadows; plum shade lifted as v1. Street lamps and windows as v1.
- NO Dallas noon: same recipe with a higher sun (el 65-70), pale dry ground; still clean and saturated, not bleached.
- LR lamp room: lamps as v1; clean saturated colour, INTERIOR targets.
- Thin outline on objects (trucks, props, station and house edges): #2a1830, 1.2 px at 1080, alpha 0.62-0.75; not on ground, walls, sky or cast cards.
- Grade: tools/grade_rick.py toward templates/blender_look/rick_light.json targets (DAY mean .48, p1 .06, sat .38, contrast .21, cool shadows). The v1 recipe of the old key frames (pale warm depth haze, lavender veil on darks, cream sun bands, sat x1.62) is REMOVED.
- Kept from v1: the palette roles (THE ONE RED, the lemon accent, the teal signature, no red/yellow on people), the period rules, the light changing with the story, the lemon truck's own bounce, no vignette, no grain, the camera and detail rules.

## v1 (2026-11-20), kept for the story, places and palette roles
No Rick frames ship in this repo: every "beside Rick" check is done against his MEASURED numbers (saturation 0.40-0.50, brightness 0.42-0.50, darkest 1 % at 0.08-0.15, edge density median 0.14) and said so in the report.
`kit3d: { pbr: true, relief: true }` in every film.json from the first render. Surfaces only from `sets/look_pack.js` (start: `episodes/fake-surgery/sets/look_pack.js`).

## Story world: one small American town, early 1970s, plus Dallas
- A TOWN (one connected world, the same landmarks from every side): the fire station (two bay doors, hose tower, brass bell, flag pole without a red flag) with its concrete YARD on the corner of a CROSSING; across the street the EYE DOCTOR'S shop (big window, giant spectacles sign); beside the crossing a PARK CORNER (long grass, a bench, one big tree). Far: water tower with the town's name, clapboard houses, telephone poles, hills.
- B DALLAS station yard, hot noon: wider, flatter, a low skyline and a water tank, two bays, the two tally boards. Same kind of station so it rhymes, different sky and ground (pale concrete, dry grass).
- C THE MAP: a 1970s folded road map / model of America on which station doors open (line 7).
- D THE LAMP ROOM BEHIND THE EYE (line 10, the signature): a dome of red, lemon-green and blue lamps, the pupil a round window on the dusk crossing.
Period rules: no stop sign, no red brick, no yellow road lines, no red flag, no teal anywhere on a set (those colours are kept for the story).

## Palette: "lemon drop and fire-engine red under a plum evening"
| Role | Hex | Where, and only there |
|---|---|---|
| THE ONE RED | `#D3141C` | the red trucks, the toy truck, the kid's ball. At dusk the same paint reads `#4B4753` (grey-plum): a change of the paint's own response to the light, never a frame grade |
| THE LOUD ACCENT | `#E3EA22` lemon-lime | the yellow trucks, wet paint, the lemon |
| HERO SIGNATURE | `#12A5A0` teal | the hero's turtleneck; on no other person, on no set |
| Day sky | `#5C8FEA` cornflower | kept clearly bluer and lighter than the teal; the hero's torso never against open sky by day |
| Dusk | `#5B3F92` plum over `#F3A86A` apricot at the horizon | sky, shade and haze of every dusk scene |
Base of the town: warm cream and sage clapboard, grey-buff concrete, dark green trees, chrome and white cab roofs. People: navy and black turnout gear with SILVER-WHITE stripes, cream, tan, denim. No red and no yellow on any person. Faces white by day, tinted by the light at dusk (colour only).

## Light per place (the light IS the story; 4 kinds, each with a visible source)
| Kind | Place, lines | Key (source you see) | Fill / shade | Must read as |
|---|---|---|---|---|
| AM morning sun | town yard 1-2; eye shop 3-4 (through its big window) | low sun from screen left, cream `#ffd896`, hard long shadows; chrome glints; in the shop: window light bars + the eye lamp | lavender fill `#a2a8e6`, pale warm haze | bright, clean, cheerful: the red is at its reddest, the wet lemon glows |
| DU dusk | crossing 5-6, park 11, crossing 12, yard 14 | the apricot band of the set sun low behind the houses + sodium street lamps and lit windows; the truck's beacon and headlamps | plum shade `#5B3F92` lifted (darkest 5 % at 0.11-0.14), mist at the lamps | a rich plum evening, never black; mean brightness at least 0.31. The red truck is nearly gone, the lemon truck is the brightest thing in frame |
| NO Dallas noon | Dallas 8-9, 13 | high white-hot sun `#fff3d0`, short hard shadows, heat shimmer | pale sky bounce, dust | flat, hot, honest counting light: both colours equally clear |
| LR lamp room | inside the eye, 10 | the lamps themselves; the pupil window's dusk | deep violet dome | the red lamps go out on "red" and the room loses its warmth |
Light changes with the story: AM (pride) -> DU (trouble) -> map/NO (proof, neutral) -> LR + DU (the reason) -> NO (false win) -> DU (payoff: the brightest object is the lemon truck). Distance between kinds at least 18 before the grade.
The film's ONE signature constant light: the lemon truck's own bounce (a soft yellow-green spill on the ground and on whoever stands near it), in every scene it is in.
Numbers, ungraded: saturation at least 0.36 for the film, 0.30 by day; dusk mean brightness at least 0.31; darkest 1 % lifted to 0.08-0.15. NO VIGNETTE anywhere (no flashback or dream in this film). No grain.

## Shadows
Hard long cast shadows from the one key, full figures; a small dark contact patch under every sole, wheel and prop leg. Floors never flicker.

## Camera
Lens 24 mm (36 mm tall frame), character height, at most 10 degrees down on a face. One flying take per stretch; the film's camera idea is "follow the colour": the lens is led by whatever is red or lemon in the scene.

## Air and motion of the world
AM: dust motes and paint mist in the sun, pigeons. DU: mist and moths at the street lamps, lit windows coming on, leaves moving. NO: heat shimmer, dust devils, flies. Two particle layers in every shot. Signs and lettering hang still.

## Detail floor (11i, Ultra)
Every place: edge density median at least 0.14, no test frame under 0.08, close shots about 0.18; every prop within 3 m of the lens built from real parts with wear.

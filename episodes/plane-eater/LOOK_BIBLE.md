# LOOK BIBLE: The Man Who Ate An Airplane (owned by the lead; every helper reads it, none edits it)
v1 2026-11-21. Tier ULTRA. Voice 34.04 s, locked. Plan: PICTURE_PLAN.md v2. Ideas: CREATIVE.md. Look: THE RICK RECIPE (CB_RULES section 3, incl. 1b trees/grass) - it wins over anything here.
Reuse first: library/LIBRARY.md (rick_tree, rick_grass, rick_light.json, rick_outline, grade_rick.py, Cessna F-MIAM, style-test house/props).

## Palette ("aluminium lunch")
| Role | Hex | Where, and only there |
|---|---|---|
| THE ONE RED | #d62828 | Michel's napkin and bow tie ONLY (decided 2026-11-21: the plane is navy). No other person, prop or set is red |
| Cessna white / navy | #f3f4f1 / #1d3461 | the plane skin, tablecloth, plates / the plane's stripe and F-MIAM letters |
| Sky | #0f79e8 zenith, #1a86f2 low | every day sky, white cumulus with #b5cbf3 shade |
| Airfield green | #9ccc3c flat lawn | rick_grass flat_lawn; tufts only at wheels, table legs, fence posts, hangar edge, lens band |
| Oil amber | #f0a81c | the oil glass, the warmest thing on the table |
| X-ray | #7fe9ff on #2f6fb3 | the light box and the whole inside-the-stomach world (never black) |
| Cabin | #1f4fa0 seats, bright white window | the airliner; the meal #b9b3a3 is the ONE dull colour, on purpose |
Owner: olive coverall + yellow rag (#f2c230). Doctor: white coat, green tie. Hangar: simple clean pastel (pale sage #c9dcc0 walls, white trim, grey-blue doors), never grimy.

## Light per place (rick_light.json presets; Blender view Standard)
| Kind | Place, plan rows | Key | Must read as |
|---|---|---|---|
| DAY noon | airfield apron, table under the wing (rows 1-18, 23-27) | recipe "day": sun #ffe2c0 str 7 el 50, blue-violet sky fill, soft leaf dapple from one rick_tree near the table | bright, clean: white plane near clip, navy and red sing |
| CLINIC | X-ray room (rows 19-22 frame) | cool window light + the light box glow | clean, light, never dark |
| X-RAY WORLD | inside the stomach (impossible view) | self-lit cyan on mid-blue #2f6fb3, mean brightness >= 0.31 | a playful cartoon X-ray, not a medical scan |
| WINTER (time-lapse) | apron, two years passing | same day sun, snow #cfe0f5, then back to spring | a time-lapse in one move |
| DUSK | dessert trolley (rows 28-33) | recipe "dusk": violet sky #604bde, warm pink key | rich evening, cream and warm coffin wood |
| CABIN | airliner (rows 34-38) | bright white window light above clouds, soft fill | clean, bright, deep blue seats |
Targets after grade (grade_rick.py): DAY mean .48, p1 .06, sat .38, contrast .21; others from rick_light.json.

## Finish
Thin outline #2a1830 on objects (rick_outline). No vignette, no grain, no warm haze. Characters NEVER blur. Captions: kit default.
"Don't try this at home": a hazard-style plaque on the hangar wall near the table, readable in rows 10-18.

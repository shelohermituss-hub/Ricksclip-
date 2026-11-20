# Magic bell: rebuild v4 (lead's notes after CB's review of animatic v3, 2026-11-11)

CB's words: "there are so many issue", "start frame should be something noticeable, a hook. you had a closed up frame to the bell. thats so bad", "we did train body movement character movement you didn't use any of them here", "treasure flying in, that's also wrong", "the expression made at the same time of narration, not before", "background blur is too much" (fixed in film.js: wides and mediums sharp), "asleep and why standing sleeping, that not make sense", "touch this it rings: zoom to the hand and bell, light pointing, same as the dragon jar when he gives the ball in the mouth or points", "when hang black curtain why not like the reference video: the 2 guards walk in and surround the curtain, looks more fun", "camera need to match story some wide some closed".

Standing rules (memory): frame 0 = the hook picture (character doing the strange act + hero object readable); faces start calm, change ON the word, blink when idle; characters never blur; stay in old China; bodies never pass through objects; hands END ON what they touch; held things are held (never float); every move picked from the trained motion library by action + feeling + energy + character, always comedy; no faces with drawn text; captions Rick style (film.js default); voice = take 2, pace 1.0 (new words.json coming from the PC; gen_film.py is word-anchored).

## Beat list v4 (what the picture must show)
| Line | Picture |
|---|---|
| 1 "A judge ... dragged a temple bell into court to catch a thief" | FRAME 0: low wide (24-28 mm, lens ~0.6 m) inside the gate: four guards hauling the bell in its frame on rollers TOWARD the lens (funny strain haul from the library), the bell TOWERING over them, the judge strolling calmly in front, hands behind his back, face readable in the first second. Crowd heads turn. No macro of the bell anywhere in the film. |
| 2 "Somebody walked off with a whole chest of silver" | night house: the hooded thief CARRIES the chest in both arms over the wall top (sneak/tiptoe + heavy carry; hands on the chest, chest never floats), silver glints on "silver". |
| 2b "guards rounded up five men" | wide of the hall: guards shove/march the five into ONE row, all five whole bodies in frame. |
| 3 "nobody saw a thing, and all five swear they were home asleep" | the five in the row swearing innocence: hand on chest, hands up "not me", head shakes, one shrug; nobody sleeps. Slow truck along the faces is fine; no bodies cut by the frame edge. |
| 4 "So the judge pats the bell and goes, If a thief touches this, it rings" | medium on the judge beside the bell; on "touches this" PUSH IN to his hand flat ON the bronze, a light pool on the hand and bell (highlight on "rings": bronze glow + thin glint). |
| 5 "The whole court bursts out laughing" | crowd laugh, medium-wide, heads filling the upper half (lens lower/closer; floor not half the frame); laugh faces start ON "laughing". |
| 5b-6 "biggest suspect leans right into his face ... my rooster is smarter than that bell" | mocker two-shot then his close-up, lip-sync; judge calm. |
| 7 "But the judge doesn't even blink" | close on the judge, no blink for the whole hold. |
| 7b "He hangs a thick black curtain around the bell" | TWO GUARDS run in with the black cloth from both sides, circle the bell in opposite directions and wrap it into a curtain BOOTH in the hall (set mover `booth` 0..1). Fun, readable, wide-medium. The bell stays in the hall; the side chamber is no longer used. While hidden, bell_ink goes 1 (unseen). |
| 7c "and blows out every lamp" | judge front or 3/4 (not from behind) blows; lamps 1 -> ~0.35: the hall goes blue-dim but characters and booth stay readable. |
| 8 "One at a time. Put your hand on it." | judge medium-close, calm, pointing at the booth. |
| 9 "The first man creeps in shaking so hard his sandals rattle, and the bell stays silent" | shaky tiptoes to the booth shaking (library: scared creep), slips through the curtain slit; INSIDE view: tight on his shaking hand reaching and pressing ON the bell (hand insert, a slit of light on the hand; the bell reads dark, NO handprints visible yet, no ink colour reveal); beat of stillness on "silent". |
| 10 "The second man slaps it like it owes him money. Silence." | slapper winds up and SLAPS (hand lands on the bell, kick), smug dust-off; "Silence" hold. |
| 11 "Then the big guy strolls in whistling, and he's back out in two seconds, bowing to the crowd. Silence." | big guy struts in (proud strut), INSIDE: he looks at the bell, hand hovers a few cm away then goes behind his back (the audience sees he does NOT touch; do not explain), struts out and bows on "bowing". |
| 12 "By the fifth man the crowd is howling, Arrest the bell! It's in on it!" | crowd howling ON "howling", the farmer shouts the line pointing at the booth (lip-sync). |
| 13 "The judge just smiles and goes, Hands up." | close on the judge's small smile ON "smiles"; on "Hands" lamps back + golden shafts (sun 1), flash. |
| 14-15 cookies analogy | old Chinese kitchen: mom points at the JAR, jar big in frame beside her (counter level, medium). Boy 1st pass: walks happily right past the jar (jar in frame, same shot). 2nd pass: crumbs on his mouth, tiptoes in a wide arc AROUND the jar, sweating, eyes away. One flowing shot, jar always visible. |
| 16 "So four men hold up palms as black as coal" | medium-wide on the row from chest height, close enough that the black palms are BIG beside each face (palms at head height, clearly hands, not earmuffs: arms up, palms toward the lens, fingers spread); pan along the four; highlight on the palms on "black". |
| 17 "and the big guy holds up a hand that's perfectly clean" | close on the big guy: white clean palms, grin melts to sweat ON "clean". |
| 18 reveal | guards pull the curtain away (booth 1 -> 0): the bell is glossy JET BLACK with four clear white-ish/bronze handprints wiped out of the ink (prints are the absence of ink = bronze colour showing, on a black bell), ink drips at the rim; judge beside it holding a big ink brush on "painted". LAST FRAME / LOOP: must cut cleanly back to frame 0 (same low wide composition or a matching element), never a macro. |

## Picture rules for v4
- No frame may be empty of story (25-26 s of v3 was an empty hall).
- Wides: lens low and close enough that characters fill at least a third of the frame height; floor never more than about a third of the frame.
- No back view on a character who is the subject of the line (v3 30 s blank head).
- Nobody stands on set dressing (v3 47 s judge on a pillar base).
- Light shafts must be soft and transparent (v3: opaque white slabs crossing bodies).
- The hall is very red/orange: characters must separate (darker/cooler floor and far wall behind them, or frame them against the teal/green parts).

# PICTURE PLAN: "The Surgery Where the Surgeon Did Nothing" (fake-surgery)

Written 2026-11-16 from SCRIPT.md v1 and the approved voice (voice/voice.wav + voice/words.json, 73.62 s, untrimmed take with breath pauses, CB "All approved" 2026-11-16). Format: templates/PICTURE_PLAN.md. Written fresh for this story; no row copied from another film.
Times are word starts from words.json, never from the script. Render nothing yet: the build waits for a free slot.
BLOODLESS, ALWAYS: three plasters, no open knee, no stitches, no blood, no instrument in a joint, never a scalpel close-up (FACTS "must avoid"). The board's blue X stitch and its needle holder are OUT; plasters only.

## Known word-time faults (check on the loudness curve of voice.wav, not words.json)
- "Doctor," 10.34: VOICE_NOTES says whisper puts it late inside the nurse quote; the quote may start up to about 0.8 s earlier (gap 9.56-10.34 holds speech).
- "surgeons" and "scrape" both at 15.24: one of the two is mistimed.
- Number words, all whisper ends early: "1990s" 13.34, "180" 22.70, "60" 26.42 / 28.04 / 29.30, "2004" 64.48 (VOICE_NOTES: 2004 mistimed).
- Caption fix: whisper heard "know better" (48.72); the caption says "no better". "180" and "60" are spoken as words; caption them as "180" and "60".

## The film in one sentence
A surgeon fakes a knee operation with three plasters and a splash of water, and the fake patients climb the stairs as well as the real ones.

## Marks
HOOK = row 1 · SIGNATURE = row 43 · TWIST = row 35 · LAST FRAME = row 50.

## Signature moment
**Row 43, "a nurse PLASTERS his scraped KNEE" (61.42).** The boy's knee is shown in EXACTLY the framing of the hook's knee close (row 5): same lens, same height, same slap. One plaster lands like the three did, and the wail stops. The idea of the film (being sure you are fixed is the fix) told by one picture the viewer has already seen, with no chart and no caption. Row 32 (the veteran's healed knee) uses the same framing too, so the knee close appears three times: fake op, healed, kid.

## The knee must read at phone size (the board's weak point, solved here)
The 5-s board hid the knee behind the surgeon's fists, bloomed it to an orange glow and its three cut marks were too small. Rules for every knee shot:
- Frame 0 and every OR wide: the bent knee is the nearest thing to the lens, front-low third of the frame, at least 22 % of frame width, its peak a clear triangle in the black-fill silhouette. The surgeon's fists come from ABOVE and BEHIND it, never over it; the scalpel tip touches the near side so the hand never covers the patch.
- The lamp may not bloom the knee: knee patch brightness at most about 0.80 (measure), iodine an orange-brown (not red, not glowing), drape window a clear dark-blue frame round it.
- Marks: three bold dark-brown dots in a straight row across the kneecap, each at least 10 px wide on a 360 px phone frame. No red, no opening, no line that reads as a cut.
- Plasters: cream-white strips with a darker tan pad and a thin dark outline, each about 3 x the dot size, in the same straight row; they must read against the orange in black-and-white too.
- The CLOSE (rows 5, 32, 43): push-in 0.35 s, the knee fills about 45 % of frame width, the hand that slaps is in from the top edge only. Frame-check waiver: in these closes a face at the frame edge is meant.
- Phone check on rows 1, 5, 32, 43 at 360 px with captions on: count the three dots / three plasters by eye. Fail = not built.

## Cast (cast/sheets/surgery.mjs from hooks_v3 has surgeon + nurse; reuse)
- **The surgeon** (THE ONE HERO, fat): green 1990s scrubs, tie-back cap, pleated mask, rectangular glasses. Calm, tidy, unhurried; his eyes smile over the mask (eyebrows and a glasses glint do the acting while masked). In FRAME 0 he is big (about half the frame height), behind the knee, lit by the OR lamp with a hard light edge on his cap, glasses and hands (board fault: the light pool fell on the floor). Mask down only in the lounge (rows 16-23) and in the last frame.
- **The nurse** (standard): ceil-blue scrubs, printed bouffant cap, mask under her chin, glasses on a chain. Dry, one eyebrow up, arms folded; the mocker. Staged clear of the patient's head so her hands read (board fault: her raised hand was hidden). She is also the nurse in the waiting room (row 43): same face, same caps.
- **The patient** (lean, NEW puppet): veteran, early fifties, grey moustache, plain navy cap with no logo, hospital gown, cane at the start; in the OR his head on the pillow shows the moustache and half-shut drowsy eyes (board fault: the head read as a blue blob). Sedated, never "asleep" as a fact. From row 31 in shorts (Texas heat) so the knee shows.
- Extras: the colleague (a hand only, row 16), gurney patients (row 14), three step-climbers with wristbands in the three tray colours (row 35), the boy (rows 42-44), the grandkid (row 50).

## Places and light (colour targets go in LOOK_BIBLE.md before any set is built; there is no LOOK_BIBLE yet: lead)
Five sets, to keep the build lean:
| place | light | rows |
|---|---|---|
| A OR 3 (built, hooks_v3 sets/or_room.js) | MORNING 7:15 AM: hard white lamp on the knee, sea-green tiles | 1-10, 27-30, 40-41 |
| A OR 3 | EVENING 7:15 PM: lamp off, warm corridor glow through the door porthole (loop back to frame 0's green) | 48-50 |
| B corridor (new: OR doors with portholes, gurney queue, wall clock, window on a hot Texas sky, curtained pre-op bay) | morning to noon, flat fluorescent + hot white window; pre-op bay soft morning window | 11-15, 24-26 |
| C doctors' office (new: lockers, desk + lamp, light box, file trays, scope case) | evening into night, one desk lamp, blue window (16-23); late afternoon blind stripes to dusk (36-39); 2004 grey evening, beige computer on the desk (45-47) | 16-23, 36-39, 45-47 |
| D stairwell (new: tall window, handrail, USE HANDRAIL sign, pain dial on the wall, newel post) | afternoon, warm sun through the tall window | 31-35 |
| E waiting room (new, same hospital: plastic chairs, fish tank, warm lamps) | afternoon warm lamps | 42-44 |
Light distance to check in the LOOK_BIBLE: C's three looks must stay apart (warm lamp night / striped afternoon / grey 2004).

## The film's ONE red = PAIN
Red means pain and nothing else: the red zone of the stairwell pain dial (row 34) and the red bars of the three pain charts (rows 36-37). Everything near the knee keeps away from red so nothing reads as blood: iodine orange-brown, the board's red rubber bulb becomes grey-blue rubber, the OR door's IN USE light becomes amber, the boy's scrape is a pink-brown scuff, the 2004 stamp ink is black. (Set dept change, asked through the lead.)

## Stretches (cut in pauses; times from words.json)
S1 hook 0.00-12.50 (rows 1-10, lines 1-3; cut in the gap 12.18-12.84) · S2 12.50-25.90 (rows 11-20, lines 4-6; gap 25.86-26.42) · S3 25.90-42.70 (rows 21-30, lines 7-9; gap 42.40-43.00) · S4 42.70-56.10 (rows 31-39, lines 10-12; gap 55.76-56.50) · S5 56.10-73.62 (rows 40-50, lines 13-16)
Lengths: 12.5 / 13.4 / 16.8 / 13.4 / 17.5 s.

## Speaking lines (cinematic master)
All narration is NARRATOR except row 10, the NURSE's quote "Doctor, you forgot the operation." (about 10.0-12.18; start from the loudness curve). Her tone (voice fix q1b): amused, sly, hushed, teasing, a pause after "Doctor". Eyes: on his ear on "Doctor", then down to the clean tray on "forgot", then up to him, eyebrow up, on "operation". Head: leans in, tilts toward him; one hand cupped at her mouth, the other flat toward the tray. The surgeon listens without stopping work: eyes smile over the mask, a small nod, pats the third plaster on "operation". The patient listens drowsy: a slow thumbs-up under the drape. Row 18 ("what if it's all in their heads") is the narrator's paraphrase of the colleague, not a quote: no lip movement on the hand-only colleague.

## The table
| # | words (landing word in CAPS) | sec | what we see: doer + thing + result | shown, and why in this story | feeling on the word | effect or gag from this story | piece + what changes |
|---|---|---|---|---|---|---|---|
| 1 HOOK | "A SURGEON cut" | 0.20 | FRAME 0: the fat surgeon big behind the bent, iodine-orange knee, scalpel tip touching its near side, first dark dot already made; lamp hard on his cap and glasses; nurse a soft shape behind, patient's moustached head on the pillow at frame side | IN SCENE, low medium: a surgeon doing almost nothing to a knee is the strange act; knee nearest the lens (see knee rules), surgeon the one big figure | calm, absorbed: he does this on purpose | none | none |
| 2 | "CUT THREE tiny HOLES" | 0.54 / 0.82 / 1.54 | three light touches of the tip, on "three", "tiny", "holes": three dark dots in a row | IN SCENE, never a scalpel close (kid safety): the knee is big enough in frame 0 to count the dots | precise, almost bored | a tiny "tik" spark per touch | none (sg_work cut beat from moves/ep_surgery.mjs, re-timed to three touches) |
| 3 | "a MAN'S KNEE" | 2.12 / 2.44 | the patient's drowsy face on the pillow, moustache twitching; the knee peak under its drape window | IN SCENE: the man and his knee must be one person before he returns on the stairs (row 32) | drowsy, trusting | none | none |
| 4 | "SPLASHED some WATER around" | 2.92 / 3.46 | he squeezes the grey-blue rubber bulb, pinky out like a perfume spray; a fan of water over the knee, drops sparkle in the lamp | IN SCENE: the splash is half of the whole "operation"; it must look silly, not medical | casual, almost playful | pinky-out perfume squeeze (physical) | none (sg_work splash beat; bulb recoloured) |
| 5 | "STUCK on THREE PLASTERS" | 4.36 / 4.90 / 5.16 | push-in to the knee: he slaps plaster 1, 2, 3 on the three dots like stamps on a letter, a small pat on the last | CLOSE: this is the whole fake operation finished, and the board's weak point: here the viewer counts three plasters on one knee. Framing reused in rows 32 and 43 | tidy satisfaction | stamp thump per plaster (prop comedy) | push-in (9) + hit (3); object = plaster on knee, slap from the top edge, morning lamp, 3 hits on the three words |
| 6 | "He NEVER once went INSIDE" | 6.24 / 7.10 | the camera slides off the knee to the tower: the coiled scope still sealed in its sterile bag, the seal tag like a price tag; monitor flickers to NO SIGNAL on "never" | CLOSE: the proof that nothing went in; without it the hook sounds like a normal operation | none (objects) | monitor snow on "never"; the scope's unbroken seal (prop comedy) | highlight (13) `markGlow` on the seal tag, cold lamp white |
| 7 | "the KNEE" | 7.60 | pull back: plastered knee and the clean, unused tray in one frame | IN SCENE: knee and unused tool together say "nothing inside" | none | none | none |
| 8 | "The NURSE LEANS in" | 8.32 / 8.54 | the nurse stops dead with a clean tray, mask under her chin, and leans to his ear, clear of the patient's head | IN SCENE, two-shot: the mocker must be in from line 1 because the last line is hers | dry disbelief | she stops so hard her glasses chain swings | none (nr_stare from ep_surgery.mjs, then a lean) |
| 9 | "WHISPERS" | 9.30 | her hand cupped at her mouth | IN SCENE | conspiratorial | none | none |
| 10 | [NURSE] "DOCTOR, you FORGOT the OPERATION" | 10.34 (check on the loudness curve) / 11.26 / 11.78 | she nods at the clean tray on "forgot"; his eyes smile over the mask; he pats the third plaster on "operation" | IN SCENE: the joke is that he is not worried at all (calm expert, sceptical nurse) | teasing; he is amused | the drowsy patient's slow thumbs-up under the drape (reversal) | none |
| 11 | "BACK in the 1990s" | 12.84 / 13.34 (check on the loudness curve) | the corridor: boxy CRT on a cart, beige phone, a wall calendar with a big 1990s year | IN SCENE: period told by the props | none (place) | none | none |
| 12 | "in HOUSTON" | 14.24 | the window: hot white Texas sky, heat shimmer over a freeway | IN SCENE, background | none | heat shimmer on the window | none |
| 13 | "SURGEONS SCRAPE and RINSE" | 15.24 (check on the loudness curve) / 15.86 | two OR door portholes: in one a gowned silhouette with a small shaver, in the other a jug pouring | IN SCENE as silhouettes only: the real operations must be named but never shown inside a joint (kid safety) | busy routine | the two silhouettes move in the same rhythm, like a factory | none |
| 14 | "SORE KNEES" | 16.10 / 16.40 | a queue of gurneys, each a bent knee peak under a drape, each patient wincing, hand on knee | IN SCENE: the number of knees is the size of the habit the test will question | weary pain | none | none |
| 15 | "ALL DAY LONG" | 16.64 / 17.18 | the surgeon waves one gurney in, the next is already there; the wall clock jumps 8, 11, 2 and the window goes from morning to noon | IN SCENE | cheerful routine | the queue curls round the corner and back into frame (escalation) | time pass (17) on the clock and window light only |
| 16 | "ANOTHER DOCTOR ASKS him" | 18.12 / 18.86 | office, evening lamp: a colleague's hand (no face) comes in at the frame edge and taps a sticky note on the surgeon's locker | IN SCENE, the colleague NOT SHOWN as a face: a face for one line would add a cast member who never returns; the hand is the question | the surgeon, mask down, mid-sip | none | double tap (4); tool = a fingertip on the sticky note |
| 17 | "a NASTY QUESTION" | 19.52 / 19.84 | the note: a big "?" next to a drawn head | CLOSE: the note is where the test begins and it comes back on tray 3 (row 23) | none (object) | none | push-in (9); object = sticky note, desk-lamp warm |
| 18 | "all in their HEADS" | 21.66 | the surgeon freezes with the cup at his lips; coffee keeps pouring and overflows the rim | IN SCENE, medium on his first unmasked face: the doubt lands on him | caught out, thinking | the coffee overflow (physical) | none |
| 19 | "he TAKES 180 sore knees" | 22.48 / 22.70 (check on the loudness curve) | he lifts a stack of 180 file cards, thick as a phone book, a knee doodle on the top card | CLOSE on the stack: the number the viewer must believe | determined | the stack sags in his hands | hundreds count (15) as numbers only, no storm; things = file cards |
| 20 | "SPLITS them into THREE GROUPS" | 24.44 / 25.22 / 25.48 | he deals the cards into three trays like a card dealer; the trays fill level | IN SCENE: three level trays plant the three level bars (row 37), same left-to-right order | quick, playful | one card sticks to his thumb, he flicks it into tray 3 (physical) | fly and hit (14), no damage; things = cards into trays |
| 21 | "60 get SCRAPED" | 26.42 (check on the loudness curve) / 27.06 | tray 1's label pops: a small scraper icon | IN SCENE, three-tray frame, tray 1 lit | none | label pop | highlight (13) `strongBlink` on the label, lamp warm |
| 22 | "60 get RINSED" | 28.04 (check on the loudness curve) / 28.42 | tray 2's label pops: a water-drop icon | IN SCENE | none | label pop | same as row 21, tray 2 |
| 23 | "60 get the TRICK" | 29.30 (check on the loudness curve) / 30.08 | he peels the "?" note off his locker, sticks it on tray 3 and winks at the lens | CLOSE on tray 3 and the wink: this is the group the story follows | sly | the question becomes the label (callback) | push-in (9); object = tray 3 + face |
| 24 | "EVERYONE SIGNS a FORM" | 31.08 / 31.94 | pre-op bay, morning window: the patient (cap, cane) signs a clipboard; others behind him with clipboards | IN SCENE: everybody agreed; the test is honest | wary but willing | none | none |
| 25 | "a PRETEND surgery" | 33.20 | the form: a box "MAY BE PRETEND", his pen ticks it | CLOSE: the proof the patients knew it could be fake | none (object) | pen squeak on the tick | stroke drawn live (5); stroke = a tick in a box, soft window light |
| 26 | "NOBODY is TOLD WHICH" | 34.32 / 34.88 / 35.10 | a sealed envelope goes into the surgeon's pocket; the patient leans to peek; the surgeon slides it higher | IN SCENE | patient curious, surgeon bland | the peek and the slide (reversal of who is curious) | none |
| 27 | "a real operation PLAYS on the SCREEN" | 37.44 / 38.10 | OR 3, frame 0 light: the VCR light shows PLAY, the CRT plays a generic smooth pink joint picture | CLOSE on monitor + VCR: the trick's main tool; the viewer must see it is a tape | none (object) | the tape label reads "REAL ONE" (prop comedy) | push-in (9); object = CRT + VCR, cold lamp spill |
| 28 | "He WIGGLES the LEG" | 38.98 / 39.50 | he bends the plastered knee back and forth like a pump handle | IN SCENE, knee big and the three plasters readable | earnest acting | the pump-handle rhythm (physical) | none |
| 29 | "SPLASHES water LOUDLY" | 40.04 / 40.86 | he pours a jug from high up into the steel bowl: SPLOOSH ring | IN SCENE | showman | the nurse wipes her splashed glasses, deadpan (background) | none |
| 30 | "so it SOUNDS REAL" | 41.74 / 42.02 | the drowsy patient smiles at the sound, eyes half shut | IN SCENE: belief is what the trick works on | comforted | none | none |
| 31 | "TWO YEARS LATER" | 43.00 / 43.38 | stairwell, afternoon sun: the old cane hangs on the newel post with a cobweb | IN SCENE: time told by a retired cane | none (place) | cobweb on the cane (visual metaphor) | none |
| 32 | "the MAN from the TABLE" | 44.08 / 44.60 | his knee in shorts, three faint pale squares where the plasters were | CLOSE in the row 5 framing: links the stair climber to frame 0's knee | none (object) | none | push-in (9), same lens and height as row 5, warm sun |
| 33 | "CLIMBING STAIRS again" | 45.10 / 45.40 | full figure, the patient takes the last step two at a time | IN SCENE: the result must be a whole body moving | springy, proud | the USE HANDRAIL sign swings in his wake (escalation) | hop onto a box (1) adapted to a stair step, lean body |
| 34 | "PAIN way DOWN" | 46.38 / 46.88 | the wall pain dial beside him: needle swings from the red zone to green | IN SCENE: the one red leaves the frame | relieved | the needle wobbles once in green | none |
| 35 TWIST | "the REAL SURGERY GROUPS NO BETTER" | 47.72 / 48.32 / 48.72 (caption "no") | three patients behind him, wristbands in the three tray colours, climbing in exact step with him | IN SCENE: the real operations did not beat the fake; the climb in step is the proof without a chart | none (they climb) | all four lift the same foot at once (visual rhyme) | none |
| 36 | "THREE PAIN CHARTS" | 50.28 / 50.82 | office, striped afternoon: three red bar charts pop on the light box in tray order | IN SCENE: same left-right order as the trays (row 20) | none | three pops in a row | none |
| 37 | "all the SAME HEIGHT" | 51.80 / 52.00 | the surgeon lays a ruler across the three tops; it rests like a shelf | CLOSE: the measured proof | quietly stunned | the ruler balances perfectly (prop comedy) | highlight (13) `lightBand` along the ruler edge, striped afternoon light |
| 38 | "You SEE, the WORK inside the knee" | 52.80 / 53.38 | he looks from the shiny scope in its open case to the bars | IN SCENE: the turn of the film is his look | thinking | none | got it (6), fat body: slower, smaller |
| 39 | "WASN'T what made them feel BETTER" | 54.30 / 55.42 | the scope case lid drops shut, a dust puff | CLOSE on the lid: the operation retired | humble | dust puff (visual metaphor) | hit (3); object = case lid, no hand |
| 40 | "Being SURE you're FIXED" | 56.70 / 57.22 | OR 3 replay from the patient's side: his drowsy face, the third plaster landing past his chin | IN SCENE: his face is what "sure" looks like | trusting | none | none |
| 41 | "a KNEE HURT LESS" | 58.16 / 58.54 | his frown melts into a smile | IN SCENE | eased | none | none |
| 42 | "a KID in the WAITING ROOM" | 59.44 / 59.86 | waiting room, afternoon lamps: a small boy wailing over a pink-brown scuff on his knee | IN SCENE: the comparison stays in the same hospital | wailing, outraged | a fish in the tank turns to stare (background) | none |
| 43 SIGNATURE | "a NURSE PLASTERS his scraped KNEE" | 61.20 / 61.42 / 62.58 | the nurse slaps one plaster on his knee | CLOSE in the exact row 5 framing: the hook's picture again, a kid's version (see Signature) | brisk, kind | the same stamp thump as row 5 | push-in (9) + hit (3), row 5 numbers, child knee, warm lamps |
| 44 | "it STOPS HURTING" | 63.20 / 63.52 | pull back: he stops mid-wail, a tear frozen mid-fall, his last sob a bubble that pops; he runs off | IN SCENE: the result is his face and whole body | instant cheer | the sob bubble pops (escalation) | none |
| 45 | "In 2004, MEDICARE" | 64.48 (check on the loudness curve) / 65.68 | office, 2004 grey evening: a plain letter with no logo slides across the desk; beige computer on the desk | IN SCENE: the room aged eight years | none | none | none |
| 46 | "STOPPED PAYING" | 65.90 / 66.36 | a stamp THUMPS black "NOT PAID" on it | CLOSE: the real-world result the viewer must believe | none (object) | THUMP lifts the papers | hit (3); object = rubber stamp on a letter |
| 47 | "ARTHRITIS KNEE PAIN" | 67.48 / 68.24 | the stamp's second line reads it; through the door the tower rolls away on squeaky wheels | IN SCENE | none | the wheel squeak like a sad sigh (background) | none |
| 48 | "the NURSE was RIGHT" | 69.50 / 69.90 | OR 3, evening 7:15 PM: the nurse holds up the clean, unused tray, one eyebrow up | IN SCENE: her line 3 comes true | dry triumph | eyebrow "ting" | told you so (7), standard body, tray instead of a pointing hand |
| 49 | "He FORGOT the OPERATION" | 70.82 / 71.34 | the surgeon pulls his mask down and shrugs | IN SCENE | sheepish | none | none |
| 50 LAST FRAME | "the PATIENTS never MISSED it" | 72.34 / 73.14 | surgeon big in front with his sheepish grin to the lens; behind him through the porthole the patient jogs past with a grandkid on his shoulders | IN SCENE: the hero's punchline face in front of the result, same pairing as frame 0 (surgeon big + the knee's owner), so the loop closes | sheepish, quietly proud | the grandkid bonks the porthole (callback, background) | none |

## Count at the end (a check, not a quota)
50 rows · named things shown on their word: 49 of 50 (row 16: the colleague is a hand, no face; the note carries the word) = 98 % · CLOSE: 12 of 50 = 24 % (rows 5, 6, 17, 19, 23, 25, 27, 32, 37, 39, 43, 46; rows 5 / 32 / 43 share one framing).
Under Rick's 40 % on purpose: kid safety forbids closes on the scalpel, the real operations and the cuts (rows 2, 13), and 7 rows are story-clock words told by light. Next honest closes if the lead wants more: row 34 (pain dial), row 26 (the envelope), row 48 (the clean tray).

## Same-framing pairs (builders must match)
Rows 5 / 32 / 43 (the knee close) · 20 / 36-37 (three trays level, three bars level, same order) · 1 / 50 (surgeon big with the knee's owner) · 6 / 48 (the unused scope and tray).

## Notes for the builders
- Every verb row (cut, splash, slap, tap, freeze, deal, peel, sign, tick, pocket, wiggle, pour, climb, lay, slap, stamp, hold up, pull down) has the doer's hands on the thing.
- From hooks_v3: keep sets/or_room.js, or_props.js, cast/sheets/surgery.mjs, moves/ep_surgery.mjs; drop the needle holder and the X stitch; recolour bulb and IN USE light; re-stage frame 0 by the knee rules; patient head gets moustache and drowsy eyes.
- Not built: Blender, light and effects storyboard rounds (taken out). Effects come only from this table.


## ADDED 2026-11-16 (build lead, before any builder starts): CB_RULES 11e, 11f, 11g. Every item below is a must for its stretch; where it differs from a row above, THIS section wins.

### 11e: THE LAST LINE IS A PICTURE (point 2): rows 49-50 are RE-STAGED
The script ends on a statement ("the patients never missed it"), and a jogger seen through a small porthole does not read at phone size. New rows 49-50:
| # | words | sec | what we see | shown, and why | feeling | effect or gag | piece |
|---|---|---|---|---|---|---|---|
| 49 | "He FORGOT the OPERATION" | 70.82 / 71.34 | OR 3 evening: the surgeon pulls his mask down and shrugs, then turns and pushes the OR door open; the camera goes with him THROUGH the door (one flight, no cut) | IN SCENE | sheepish | none | none |
| 50 LAST FRAME | "the PATIENTS never MISSED it" | 72.34 / 73.14 | the hospital STAIRWELL at 7:15 PM (set D, evening light EV): low camera at the foot of the stairs. The surgeon BIG and CALM in front (about half the frame height, mask down, arms folded, the sheepish-proud grin to the lens). Behind and above him the veteran BOUNDS up the stairs two at a time with the grandkid on his shoulders (arms up like on a ride), the old cane gone; behind them a whole STREAM of former patients climbs the stairs up to the tall window, every knee with three faint plaster marks, all lifting the same foot at once (the row 35 rhyme). The nurse at the stairwell door, unused tray under her arm, one eyebrow up, a small smile | IN SCENE: the proof with the sound off: the man from the table climbs past the man who "forgot the operation"; the hero calm in front of the huge result (11f) | quietly proud | EXTREME (the stairwell full of climbers up to the window) + POWER 5 below | hop (1) adapted to a stair step for the veteran; "freeze + slow push" on the surgeon for the last 0.6 s |
Loop: the stairwell has the hospital's SEA-GREEN tile dado (the same tile as OR 3), so the last frame's green meets frame 0's green.
11e point 3 (the mocker falls by her own act): the nurse's own words come true; she lifts the clean, unused tray herself (row 48) and in the last frame she carries it, smiling. Kept.

### EXTREME (11g): 6 + the last frame, at most one per line, each ON its word and held about 1 s, built from the hospital's own objects; the voice keeps every true number
| row | word | EXTREME picture | stretch |
|---|---|---|---|
| 15 | "ALL DAY LONG" | the gurney queue does not fit the hospital: through the corridor window we see it go out of the building, across the car park and along the shimmering freeway to the horizon, a pickup driver in a cowboy hat honking at it; the wall clock's hands spin into a blur | S2 |
| 19 | "180 sore knees" | the stack of 180 file cards is TALLER THAN THE SURGEON, it sways up to the lounge ceiling as he lifts it, the desk lamp ducks; tab on the top card "180 KNEES" | S2 |
| 29 | "splashes water LOUDLY" | one jug makes a tidal wave: the whole OR floor goes shin-deep, the steel kick bucket and the nurse's clogs bob, a SPLOOSH ring rattles the lamp; the nurse stands in it, deadpan, wiping her glasses (no water near the patient's face; he stays dry on the table) | S3 |
| 31 | "TWO YEARS LATER" | the old cane on the newel post is wrapped in cobweb thick as a hammock, a little spider asleep in it, dust on the handle like snow | S4 |
| 33 | "CLIMBING STAIRS again" | he bounds up the whole flight in three springy strides (speed lines), the USE HANDRAIL sign spins on its screw like a propeller | S4 |
| 46 | "STOPPED PAYING" | the rubber stamp is as big as a paint tin; it lands so hard the desk sags in the middle, the pens jump out of their cup and the papers blizzard to the ceiling | S5 |
| 50 | "PATIENTS never MISSED it" | the stairwell full of former patients climbing up to the window (see row 50 above) | S5 |
Count 7 in 73.6 s.

### POWER MOMENTS (11f): 5, drawn cartoon power on story words, each a short ANIME-DIRECTED sequence (anticipation hold 6-12 f, a 2-4 f IMPACT FRAME, crash zoom or freeze + slow push, the background dropping to an abstract field on the peak, camera shake on the same frame as a sound hit, settle). Calm and real between them. The column is the idea for THIS scene, not a library pick (sets/power/ only helps).
| row | word | the directed sequence | why in this story | stretch |
|---|---|---|---|---|
| 5 | "three PLASTERS" (5.16) | plasters 1 and 2 slap like stamps; on 3: his hand hangs high (hold 8 f), eyes narrow over the mask, a glint runs across his glasses; IMPACT FRAME (2 f, two-tone sea-green / white, ink silhouettes of hand and knee); a ring of focus lines closes on the knee; a cream "stamp ring" pops off the plaster; camera shake 5 f with the thump; settle on his small pat | the hero's act: the whole fake operation lands like a rubber stamp | S1 |
| 18 | "all in their HEADS" (21.66) | hold: the cup at his lips, the coffee rising (10 f); IMPACT FRAME on "heads" (inverted flash); the background drops to a field of giant drawn "?" marks turning slowly round his head; focus lines on his eyes, a sweat drop, a glasses glint; the coffee overflows on the settle | the question that starts the whole test hits him | S2 |
| 37 | "the SAME HEIGHT" (52.00) | hold: the ruler hovers over the three bars (8 f); it lands; IMPACT FRAME (two-tone, the blind stripes as hard black bands); a light band races along the ruler edge; the three bar tops flash at once with one "lock" shock line; freeze + slow push 0.6 s; settle as the ruler rests like a shelf | the turn: the measured proof | S4 |
| 40 | "Being SURE you're FIXED" (56.70 / 57.22) | the replay slows; the third plaster lands past his chin; a warm gold aura flickers on twos out from the plaster over his whole body; the OR background drops to a warm sparkle field on "fixed"; his drowsy frown melts into a smile on the settle (row 41) | the idea of the film made visible: being sure as a glow | S5 |
| 50 | "never MISSED it" (73.14) | hold on the surgeon's calm face (8 f) while the climbers rise behind him; on "missed" the veteran's foot hits the top step: IMPACT FRAME (2 f), a burst of evening light rays from the tall window behind the climbers, a sparkle on the surgeon's grin; FREEZE with a slow push = the last frame | the climax: the hero proved right | S5 |
Small marks (not power moments): the nurse's eyebrow "ting" and glasses glint on "operation" (row 10) and on "right" (row 48); a sweat drop on the boy (row 42).

### POV (11f): 2, entered and left by a camera move, never a hard cut; the frame edges tell whose view it is
- Row 25 "a PRETEND surgery" (S3): the patient's view straight down on the clipboard (a top-down macro of hand work): the form fills the frame, his round black fist with the pen at the bottom edge, his gown sleeve and the clipboard clip at the edges; the pen ticks the box "MAY BE PRETEND SURGERY". Entered by tilting down over his shoulder, left by tilting back up to the envelope (row 26).
- Row 38 "You SEE, the WORK inside the knee" (S4): the voice says "you": THROUGH THE SURGEON'S GLASSES. The black rectangular rims frame the view; on the left the shiny scope in its open case, on the right the three level red bars with the ruler; the view moves scope -> bars. Entered by flying into the glint on his glasses lens, left by pulling back out of the lens for row 39.

### IMPOSSIBLE VIEWS (11f): 2, entered and left by a camera move; the frame edges show where we are; kid-safe (never inside the knee)
- Row 6 "He NEVER once went INSIDE" (S1): FROM THE UNUSED SCOPE'S OWN LENS, inside its sealed sterile bag on the tray: crinkled clear plastic over the lens, the bag's seal tag in the foreground, and far off, soft through the plastic, the surgeon patting the plastered knee. On "never" the monitor beside it shows NO SIGNAL (the scope's eye never saw a knee). Entered by sliding off the knee along the scope cable into the bag; left by pulling back out for row 7.
- Rows 27-28 "PLAYS on the SCREEN ... WIGGLES the LEG" (S3): FROM INSIDE THE CRT, looking out: the curved glass, scanlines and the bezel edges from inside, the tape's smooth pink joint picture faint on the glass, and through it the surgeon pumping the leg like a pump handle and the drowsy patient. Entered by flying into the screen on "plays", left by flying back out through the glass on "leg".

### WORDS IN THE WORLD (11f): the key term and one key number, spelled right, no logo
- Key term: "PRETEND SURGERY" on the consent form's tick box (row 25, the POV), and again on tray 3's label under the "?" (row 23).
- Key number: "180" on the top card tab "180 KNEES" (row 19); "60" on each tray label (rows 21-23). Also: "NOT PAID: ARTHRITIS KNEE" on the stamp (rows 46-47), "OR 3", "USE HANDRAIL", "REAL ONE" on the tape, "NO SIGNAL".

### ONE FLYING TAKE (11f): at most 1 hard cut per 10 s (at most 7 in 73.6 s); planned: 2
| join | where | how |
|---|---|---|
| S1 -> S2 | 12.50, OR -> corridor | the camera flies out through the OR door porthole into the corridor |
| row 15 -> 16 | corridor noon -> office evening | fly into the corridor wall clock face (hands spinning), out of the office wall clock at night |
| row 23 -> 24 | office night -> pre-op morning | HARD CUT 1 (about 30.9 s, a new day) |
| row 26 -> 27 | pre-op -> OR morning | follow the patient's gurney through the OR door portholes |
| row 30 -> 31 | OR -> stairwell, "two years later" | HARD CUT 2 (43.00 s, the time jump) |
| row 35 -> 36 | stairwell -> office stripes | match dissolve on motion: the pain dial's needle sweep becomes the light-box chart |
| row 39 -> 40 | office -> OR replay | the scope case lid shuts on the lens (dark), opens on the OR from the patient's side |
| row 41 -> 42 | OR -> waiting room | dissolve on motion on a lateral glide (warm lamps fade up) |
| row 44 -> 45 | waiting room -> office 2004 | the boy runs out of frame; the glide carries on and dissolves into the desk with the letter |
| row 47 -> 48 | office 2004 -> OR evening | follow the tower rolling away down the corridor into OR 3 at 7:15 PM |
| row 49 -> 50 | OR evening -> stairwell | through the OR door with the surgeon (row 49) |
Inside a stretch: flights, never chopped inserts. Each builder lists its cuts and joins in STATE.md. At the gate the joins BETWEEN stretches may still be plain; the build-out makes them flights.

### Places table change (from this section)
- D STAIRWELL also gets the EVENING light (7:15 PM, low warm sun through the tall window) for row 50, and the sea-green tile dado.
- A OR 3 evening is now rows 48-49 only.

### Count at the end (with this section)
EXTREME 7 (incl. the last frame) · POWER 5 (rows 5, 18, 37, 40, 50) · POV 2 (25, 38) · IMPOSSIBLE 2 (6, 27-28) · hard cuts 2 (0.27 per 10 s) · last frame = the hero calm in front of the huge result.

### THE PATIENT IS A FULL CHARACTER (CB 2026-11-16: "use patient also chracter")
- The veteran is a real cast puppet (lean, template v12, grey moustache, plain navy cap, gown) in EVERY row he is in, INCLUDING on the OR table (rows 1-10, 27-30, 40-41). The hook board's 3D sleeping head on the pillow is OUT.
- On the table he lies RECLINED, back raised about 35 deg on the table's raised head section, so his whole face reads in 3/4 or side over the drape: drowsy half-lid eyes, moustache, small acting on the words (row 3 moustache twitch, row 10 slow thumbs-up with a round black fist, row 30 smile at the sound, rows 40-41 frown melts into a smile). His bent knee stays the nearest thing to the lens (knee rules above); the drape covers him from chest to shin, the knee in its drape window.
- He is the same puppet and face from frame 0 to the last frame (pre-op, stairs, last frame with the grandkid), so the viewer knows him as one person. Cast name `cast:surgery/patient`.

### CB note 2026-11-16 on frame 0: "this looks weired. check better lay on bed in 3d space position with knee more up."
- The patient lies ALONG the OR table in 3D (a body under the drape from the raised head section to the foot end); the operated knee is bent HIGH: foot flat on the table, kneecap the highest point pointing up (an upside-down V), the drape window with iodine + dots on top of the kneecap. Frame 0 is shot from the side so the raised knee reads as a silhouette. All OR rows follow it.

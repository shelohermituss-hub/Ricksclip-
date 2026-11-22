# plane-eater: sound cue sheet (generated from sound_events.json by the sound designer, 2026-11-22)

Anchors: `f:N` = absolute film frame from sN/film.json (acts, fx, kicks, held props); `w:word` = word onset in voice/words.json. Retime in sound_events.json, then `python episodes/plane-eater/sound/build_mix.py`.
SYNTH = synthesized in build_mix.py because the Sound Pack V1.2 has nothing for it. Every other clip is a Kenney CC0 sample.

| row | stretch | anchor | frames | what | clips (dB) |
|---|---|---|---|---|---|
| 1 | s1 | `f:0` | 0-27 | salt shaker shakes over the wing tip (frame 0 = loop point) | salt -27, salt -29, salt -28, salt -30 |
| 1 | s1 | `f:3` | 3-34 | salt grains bounce on the aluminium | grain -36, grain -38, grain -36, grain -39, grain -37, grain -38 |
| 1 | s1 | `f:20` | 20 | fx glint: sun catches the salted tip | sparkle -31 |
| 1 | s1 | `f:8` | 8-74 | owner polishes the propeller far back (rag running gag) | rag -38, rag2 -39, rag -39, rag2 -40 |
| 3 | s1 | `f:62` | 62 | he stops salting, turns along the wing (clothes) | cloth3 -34 |
| 5 | s1 | `f:121` | 118-121 | POWER 1 LUNCH!: napkin snapped tight in the collar | napkin -15, whip -24 |
| 5 | s1 | `f:124` | 124 | fx glint on his fork tines | sparkle2 -23 |
| 6 | s1 | `f:152` | 152-158 | he kneels at the fuselage, saw up | cloth -32, knee -31 |
| 7 | s1 | `f:173` | 173-199 | hacksaw on aluminium: tiny pastry-chef strokes | saw1 -26, saw2 -28, saw1 -27, saw2 -28, saw1 -27, tin_tick -34 |
| 8 | s1 | `f:187` | 200-215 | owner sees the cut, polishes faster (denial) | rag -33, rag2 -33, rag -34, rag2 -34 |
| 9 | s1 | `f:205` | 205 | sugar tongs pick ONE tiny bite | tongs -29 |
| 9 | s1 | `w:bites.` | 235-236 | the bite clinks on the china plate (f235) | china -22, clink2 -32 |
| 10 | s2 | `f:262` | 262-266 | he drops onto the seat, tucks the chair in | chair_down -27, chair_scoot -30 |
| 11 | s2 | `f:283` | 283 | picks up the oil wine glass | glass_tap -28 |
| 11 | s2 | `f:300` | 300 | sniffs the oil like wine | sniff SYNTH -33 |
| 12 | s2 | `f:318` | 318-321 | the big jug lifted and GLUGS into the tumbler (SYNTH glug) | jug_set -31, glug SYNTH -21 |
| 12 | s2 | `f:344` | 344-358 | tumbler up, he drinks (gulps) | glass_tap -31, gulp -30, gulp -32 |
| 13 | s2 | `f:345` | 346 | tongs back in hand | tongs -32 |
| 13 | s2 | `w:pounds-4` | 361-369 | bites drop on the kitchen scale (f361-369) | clink -25, clink3 -27, clink2 -26 |
| 13 | s2 | `w:pounds+1` | 366-378 | the scale needle swings past, wobbles, settles on 2 lb (SYNTH needle) | needle SYNTH -24, scale_tick -28 |
| 14 | s2 | `f:396` | 396 | picks up the wing slice | tin_tick -33 |
| 14 | s2 | `f:407` | 407-408 | WINGS: wing slice snapped like a cracker (fx glint) | crack -18, crunch -22, chop -27 |
| 14 | s2 | `f:412` | 412-422 | chews the wing slice, belly putt-putt (SYNTH putt) | chew -30, chew -31, putt SYNTH -31 |
| 15 | s2 | `f:418` | 418 | picks up the wheel hub | clink -33 |
| 15 | s2 | `f:428` | 428 | WHEELS: hub bitten like a doughnut | hub_bite -20, crunch2 -23 |
| 15 | s2 | `f:433` | 433-442 | chews the hub, putt-putt | chew -30, chew -31, putt SYNTH -31 |
| 16 | s2 | `f:442` | 442 | picks up the seat cushion | cloth3 -32 |
| 16 | s2 | `f:451` | 451-462 | SEATS: cushion bitten like a sandwich, a spring boings out (SYNTH boing), pushed back in | foam -22, crunch -30, boing SYNTH -22, push -30 |
| 17 | s2 | `f:468` | 468 | picks up the tire | rubber_chew -33 |
| 17 | s2 | `f:478` | 478 | EVEN THE TIRES: bites, the rubber stretches like gum | stretch -22 |
| 17 | s2 | `f:489` | 489-490 | rubber SNAP back against his cheeks, cheeks wobble (kick, fx glint) | snap -16, boing_hi SYNTH -23 |
| 17 | s2 | `f:494` | 494-510 | chews hard (rubber squeaks), swallows, belly putt | rubber_chew -30, rubber_chew -31, rubber_chew -32, gulp2 -27, putt SYNTH -29 |
| 18 | s2 | `w:Doctors+2` | 511-516 | he pats his belly (into the match dissolve) | pat -25, pat -27 |
| 18 | s3 | `f:512` | 512 | match dissolve belly -> X-ray film: soft whoosh | whoosh_soft -31 |
| 19 | s3 | `f:519` | 519-526 | the light box clunks on and flickers twice, then holds | lb_clunk -23, flicker -27, flicker2 -28 |
| 19 | s3 | `f:528` | 528 | fx glint runs over the tiny bite-Cessna on the film | sparkle3 -27 |
| 19 | s3 | `f:541` | 541 | Doctor pushes his half-moon glasses down | tick_small -31 |
| 19 | s3 | `f:550` | 550 | Doctor jolts back: he sees the tiny plane | cloth -28 |
| 20 | s3 | `f:560` | 560 | fly into the X-ray film | whoosh_in -23 |
| 21 | s3 | `f:592` | 592-595 | POWER 2 THICK: the lining PUFFS into a mattress, floomp (kick, fx glow) | floomp -13, floomp_air -20, sparkle2 -26 |
| 22 | s3 | `f:606` | 606 | the tiny Cessna's propeller hums as it starts down the runway | prop_tiny -31 |
| 22 | s3 | `w:slid-5` | 622 | the mini Cessna SLIDES down the mattress runway | slide -23 |
| 22 | s3 | `f:630` | 630-636 | fx shine: oil sparkle trail behind the plane | sparkle3 -31, sparkle -33 |
| 23 | s3 | `f:617` | 617 | camera backs out of the film | whoosh_out -26 |
| 23 | s3 | `f:633` | 633-636 | Doctor DOUBLE TAKE: head snaps back, glasses slide to the nose tip | whip -25, tick_small -30 |
| 24 | s4 | `f:660` | 660 | dissolve light box -> apron daylight | whoosh_soft -29 |
| 24 | s4 | `f:662` | 662-696 | fork back in hand, he eats on (time-lapse chewing) | tongs -33, chew -32, chew -33, chew -33, chew -34, chew -34, chew -34 |
| 25 | s4 | `w:years-14` | 672-698 | TWO YEARS time-lapse: seasons race (SYNTH riser + whooshes) | riser SYNTH -23, whoosh_soft -30, whoosh_soft -30, whoosh_soft -30 |
| 25 | s4 | `f:686` | 686 | winter: a snowy wind gust (SYNTH wind) | gust SYNTH -24 |
| 25 | s4 | `f:679` | 679-701 | owner's beard grows: pop per size (S, M, L, XL) | pop -29, pop -29, pop -29, pop -28 |
| 26 | s4 | `f:704` | 704 | picks the spinner | clink2 -32 |
| 26 | s4 | `f:713` | 713-715 | pops the last piece (spinner) like a cherry; owner's jaw drops (fx glint) | pop2 -22, sparkle -29, creak_wob2 -34 |
| 26 | s4 | `f:718` | 718 | dabs his mouth with the napkin | rag2 -31 |
| 27 | s4 | `f:730` | 730-732 | dusk: the hangar work lamps snap on | lamps -25, latch -31 |
| 27 | s4 | `f:737` | 737 | picks up the silver bell | tick_small -32 |
| 27 | s4 | `f:740` | 740-746 | DESSERT?: he rings the little silver bell (fx glint) | bell -19, bell -23 |
| 27 | s4 | `f:748` | 748-762 | the dessert trolley rolls in from the hangar doors | trolley -28, squeak_w -33, squeak_w -34 |
| 28 | s4 | `w:Bikes,` | 768-772 | BIKES tier: bicycle bells, cream swirl | bikebell -25, bikebell -27, whoosh_soft -33 |
| 29 | s4 | `w:carts,` | 796-801 | CARTS tier: nested shopping carts rattle | cart -24, clink -28, cart -27 |
| 30 | s4 | `w:TVs,` | 818-823 | TVs tier: screens click on to test stripes | tv_on -25, tv_whine -37, tv_on -28 |
| 31 | s4 | `w:and#5-15` | 826-835 | the coffin cake topper wobbles (27.52-28.04) | creak_wob -24, creak_wob2 -26 |
| 31 | s4 | `f:830` | 830 | plate up in his hand | china -32 |
| 31 | s4 | `f:845` | 845 | the coffin falls | whip -28 |
| 31 | s4 | `f:850` | 850 | COFFIN caught on his plate one-handed (kick) | thud -18, plate -24 |
| 32 | s4 | `f:860` | 862 | a hand lifts the silver cloche: the BOOK OF RECORDS | cloche -24 |
| 32 | s4 | `f:866` | 866-868 | the first flashbulb pops in the dark doorway (fx glint) | shutter -27, flashpop -31, flashwhine -40 |
| 32 | s4 | `f:876` | 876-900 | owner walks to the cradle: footsteps on concrete | step1 -31, step2 -32, step3 -31, step4 -32 |
| 33 | s4 | `f:880` | 880-882 | flashbulb; certificate in his hand | shutter -27, flashpop -31, tick_small -33 |
| 33 | s4 | `f:894` | 894-898 | POWER 3 STRANGEST: every flashbulb fires at once (kick) | shutter -18, shutter -19, flashpop -20, flashpop -23, flashpop -23, flashwhine -30 |
| 34 | s4 | `f:912` | 912-913 | DIET: bites the corner of the metal frame like a medal (fx shine) | cert_bite -19, crunch2 -26, sparkle3 -30 |
| 34 | s4 | `f:918` | 918-930 | flashbulb pops one by one | shutter -28, flashpop -32, shutter -29, flashpop -33 |
| 35 | s5 | `f:940` | 940 | match dissolve: flash glare -> airliner window | whoosh_soft -30 |
| 35 | s5 | `w:Honestly,+2` | 945 | lifts the foil off the airline meal | foil -23 |
| 35 | s5 | `f:956` | 956 | STILLNESS 31.82-32.28: the sniff (SYNTH sniff) | sniff SYNTH -25 |
| 36 | s5 | `f:969` | 969-986 | slides the grey meal aside with one finger; a pea rolls off | scrape -24, grain -32, grain -33, grain -34, plip -29 |
| 36 | s5 | `f:977` | 977 | owner leans away from the sliding meal | cloth3 -32 |
| 37 | s5 | `f:991` | 991-993 | knife and fork up over the tray table (fx glint 993) | shing -24, sparkle -30 |
| 37 | s5 | `f:1001` | 1001 | POWER 4 FOOD: the CHOMP out of the plastic tray table (kick, fx clank) | chomp -14, crunch -18, clank -24 |
| 37 | s5 | `f:1003` | 1003-1018 | owner rubs his eyes with the yellow rag, then wipes the window (squeaks) | rag -30, squeak SYNTH -29, squeak SYNTH -29, squeak SYNTH -30 |
| 38 | s5 | `f:1007` | 1007-1012 | chews the tray table, happy | chew -26, chew -27 |
| 38 | s5 | `f:1015` | 1015 | slow smug wink: sparkle ting | wink -22 |

## Beds (one per place; 0.45 s blends; the frame-0 bed is led in under the last 0.5 s for the loop)
| from | place | layers |
|---|---|---|
| `f:0` | APRON morning: wind over the grass, a Cessna circuit far off | amb_wind SYNTH -31, amb_prop SYNTH -40 |
| `f:514` | X-RAY ROOM: room tone + light-box buzz (from the belly match dissolve) | amb_room SYNTH -33, amb_lightbox SYNTH -41 |
| `f:565` | INSIDE THE X-RAY FILM: soft low drone | amb_xray -35, amb_lightbox SYNTH -48 |
| `f:619` | X-RAY ROOM again (camera backs out) | amb_room SYNTH -33, amb_lightbox SYNTH -41 |
| `f:664` | APRON, the two years (dissolve 662-672) | amb_wind SYNTH -31, amb_prop SYNTH -42 |
| `f:726` | APRON at DUSK: lighter wind, crickets | amb_wind SYNTH -35, amb_crickets SYNTH -41 |
| `f:942` | AIRLINER CABIN: jet roar and hum | amb_cabin SYNTH -30, amb_jet -40 |

## Power moments (music and beds drop over the hold, slam back +3 dB on the impact frame)
| frame | hold | why |
|---|---|---|
| `f:121` | 8 | POWER 1 LUNCH!: 8 quiet frames, napkin snap |
| `f:592` | 6 | POWER 2 THICK: the lining puffs into a mattress, floomp |
| `f:894` | 6 | POWER 3 STRANGEST: every flashbulb at once |
| `f:1001` | 8 | POWER 4 FOOD: the chomp into the tray table |

## Music: ONE melody, Kevin MacLeod "Fluffing a Duck" (CC BY 4.0)
| film s | source s | section |
|---|---|---|
| 0.00 | 0.00 | statement: the bouncy theme from bar 1 (hook to the tires) |
| 16.98 | 19.00 | low: the X-ray room, the same theme slowed 0.8 and dark (low-passed), -4 dB |
| 22.30 | 49.95 | return: the theme back in full; the track's last BUM (61.05 s) lands on FOOD (33.38) |

Ducked under speech (-15 dB under the voice), lifted in the gaps (-10 dB); -7 dB in the STILLNESS 31.82-32.28; end fade 33.75-34.05; its first 0.5 s is led in under the last 0.5 s (loop).

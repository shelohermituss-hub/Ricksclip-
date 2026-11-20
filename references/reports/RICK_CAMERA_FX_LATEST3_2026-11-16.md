# Rick's camera and "super power" effects in his latest 3 clips (2026-11-16, CB: "for camera and also for effects. the last 3 clips. prison pink. the car drive the castle fire work. he add like super power effects to it")

Clips: The Pink Prison Cell Experiment (65 s), The Instinct That Makes You Crash (60 s), How One Cart Stopped an Entire Army (67 s).
Sheets at 1 frame a second, with the second written on each: `references/reports/latest3/*_1fps.jpg`.
Cuts measured with ffmpeg scene detection (threshold 0.32).

## 1. Camera: one flying take, almost no cuts
| Clip | Hard cuts | Average "shot" |
|---|---|---|
| Cart army | **0** | the whole 67 s is one move |
| Pink cell | 1 | about 33 s |
| Crash tree | 6 | 8.5 s (the cuts are the drive POV and the eye) |

He never cuts between ideas. The camera FLIES from one picture to the next. Where a cut would come he uses:
- **A dissolve with motion.** The next scene fades through while the camera keeps moving (pink cell s11, s20, s30; cart s43).
- **A fly-through object.** Into an eye's black pupil and out as the driver's POV (crash s43-44). Into a CRT monitor and out inside the cell (pink s44-46).
- **An aerial pull-out to the whole country** for "jails all over the country". A map with fields, then down onto a truck loaded with pink paint (pink s39-42).
- **Macro inserts on the hands' work**, top-down: paint pouring (pink s6-7), drilled holes and paper tubes (cart s16-19).
- **POV shots for the "you" part:** behind the wheel, with the windscreen and dashboard filling the frame (crash s44-58).

Our rules already ask for "shots, not panels" and fly-through transitions (CB_RULES 6 and 10). These three clips show the target number: **at most 1 hard cut per 10 s**. The rest are flights, dissolves on motion, and fly-throughs into an object from the story.

## 2. The "super power" effects (CB's word): cartoon power on the story's big word
| Clip, second | Word | Effect |
|---|---|---|
| Pink s27-28 | "laughing" | **Red crack veins** shoot out over the pink walls and floor from the 300 lb inmate (his strength made visible) |
| Pink s51 | "bench" | A **dark aura or shadow** grows behind the angry inmate |
| Pink s55-56 | "the fight" | The cell door **shakes**, debris and sparkles fly, pink glow (power breaking out) |
| Crash s30-35 | "axe … down" | The sheriff's axe fells the tree: a **white shockwave ring**, **radial light rays** bursting from the stump, a debris storm and the sky warped like a dome |
| Crash s46-48 | "nothing … lighthouse" | **Tunnel vision:** the world dark grey, only the tree lit, a red glow on the road |
| Crash s53-54 | "onto it … let go" | The sheriff's eyes become **glowing, hypnotised spirals**, his face lit orange in the dark |
| Cart s51-54 | "races … splits … tiny flames" | The **spark trail** races down the rope with a glow and bursts into a **golden fan of light rays** |
| Cart s61-63 | "every which way" | The sky fills with **white smoke trails** in all directions |
| Cart s64-66 | "not a single one misses" | A **giant mushroom explosion** behind the calm hero, who stands big in front: the LAST FRAME |

The pattern:
- **3-5 "power" moments per film,** always on a story word: the mocker's strength, the hero's act, the turn, the climax.
- **They are drawn, not physical:** rings, rays, veins, auras, spiral eyes. Anime and cartoon language on top of the 3D world.
- **The last frame is often the hero calm and big in front of the huge result** (mushroom cloud, wrecked stump).
- **Between power moments the picture is calm and real.** The effect works because it breaks that calm.

## 3. Words in the world name the idea (no captions needed)
- Crash: **"TARGET FIXATION" on a green highway sign** at the moment the term is said (s44-45). Also "HIT THIS TREE" in neon arrows, "DAYS SINCE LAST CRASH 0", "YOUR SPEED 15", "TREE TOWING CASH ONLY".
- Pink: the paint spec sheet "P-618 BAKER-MILLER PINK, 1 PINT RED, 1 GALLON WHITE, EXACTLY!" (s3), and the colour swatch held up (s10).
- Each sign carries a fact or a joke and turns the word into a picture.

## 4. Exaggerated props carry the joke
- Crash: the giant flashing neon arrow nailed to the tree; the car standing straight up on its nose against the stump (s41).
- Pink: the calm inmate knitting a pink-striped scarf so long it trails off the bench (s57-63, "calm").
- Cart: rope coils on the ground; a slap with shock lines (s25).

## What this means for our skill (proposed, needs CB's OK)
1. **Power-effects library (new pieces).** Build 6 drawn effects once as tested code in `templates/pieces/fx/`, so every picture plan can call them on its big words:
   - shockwave ring;
   - radial light-ray burst;
   - crack veins;
   - aura or shadow;
   - spiral or glowing eyes;
   - glowing spark trail with a burst.
   The big explosion and the smoke trails build on our existing fly-and-hit and burst pieces. This is NOT the old "effects round on stills": it is a library, used inside the moving takes.
2. **Picture-plan rule:** every plan names **3-5 power moments** (word, effect, why in this story). The LAST FRAME is a picture that proves the hero right, often the hero calm in front of the result.
3. **Camera rule, measured:** at most 1 hard cut per 10 s. Every place change is a flight, a dissolve on motion, or a fly-through into a story object (an eye, a screen, a map). There is an aerial "whole country" move when the voice says the idea spread.
4. **Sign rule:** each film puts its key term and one key number on a sign or prop in the world, on its word.
5. **First use:** the waiting-list films' picture plans get a power-moment column and a sign line added before their builds. The elevator and Monopoly builds use the library once it exists, if CB wants that mid-build.

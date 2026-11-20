# Fake surgery v2: CB's notes on final v1 (2026-11-16, "Yes, fix this film"). One fix round per stretch, then re-join.

CB's notes (his words):
- "the patient should be sleeping take a meme where is is fainted. the splash water looks weak. 6 second what are those lines/ from 15 to 20 s. camere just move quick why? like ziack zack. and why they sliding. and 36 why there is white fog effects? at 45 why show human leg since we have the black line leg. at 55 thsi horror . camera too fast and dont know what you want to show. head of chracte ris half again. 57 sec highlight effects make no sense. 1.02 pflaster. why you use human arm now? we dont have human body in our clips."
- Earlier the same day: "whats wrong why the camere is so uncontrolled and too fast?"

## RULES FOR EVERY STRETCH (all five, most important first)
1. **CAMERA FLOWS (the main fault).** v1 measured 81 camera stations in 74 s, 6.3 rests per 10 s (Rick 3.1), moves of about 1 s (Rick 3 s) and a 1000 px one-frame teleport. Re-plan your camera like a camera director:
   - one flowing take per place;
   - about 3 rests per 10 s, each rest at least 0.8 s with a slow creep (never parked dead still);
   - eased travels of 2-5 s that FOLLOW the action (a walk, a hand, a gurney);
   - camera speed at most about 40 px/f, except the power-moment crash zoom (60);
   - no teleports, no whip unless it is a planned power moment.
   - Fewer stations, not one per plan row. The named thing still lands in frame on its word, IN SCENE where a close-up is not needed (close-ups are secondary).
   - `python ../../../tools/film_plan.py check film.json` must show 0 FAIL in the camera gates BEFORE any render; paste its camera lines into STATE.md. After rendering, `python ../../../tools/check_film.py final/preview.mp4` on your stretch: rests per 10 s 2.2-3.8, travel p90 >= 2.1 s, speed median about 4, cuts per 10 s <= 0.9 (planned hard cuts excepted).
2. **NO HUMAN BODY PARTS.** Never a skin-coloured 3D leg, knee, arm, sleeve or hand. A close-up on a body part is drawn in the cast style: the character card framed close (black line leg, round black fist) with a cartoon plaster/prop on it. Remove every 3D limb (knee_leg, child knee leg, the nurse's 3D arm/sleeve, set-drawn soft_arm "pipes" that read as human arms in a close).
   - The OR knee under the drape (the blue drape tent + window) is a PROP and stays.
3. **NO SLIDING.** A character who moves over the floor walks (a walk move with planted feet). A card that glides is a fault. Prefer staging that does not need the move.
4. **NO HALF HEADS.** No head cut by the frame edge on a rest (frame checks 0 FAIL, waivers only for the knee-prop closes).
5. **EVERY EFFECT READS IN 1 SECOND** (sound-off test: a kid can name it).
   - No abstract lines (the sterile-bag crinkle streaks at 6 s).
   - No white fog or haze veils (the porthole flight at 36 s).
   - No glow without a visible cause (the gold aura at 57 s).
   - Comedy stays bright: no dark low-key close on a black box (55 s read as a coffin = horror).
6. **THE PATIENT IS ASLEEP AS A MEME.** On the OR table (S1 rows 1-10, S3 rows 27-30, S5 rows 40-41) the patient wears the KNOCKED-OUT meme face (templates/vector2d_characters/code/memes.mjs `ko`: spiral + X eyes, tongue flop, birdies; or char2d preset `dizzy`; leave out the head bump if it reads as an injury), with a zZ bubble. Find how a film.json face key selects a meme (grep `memes`/`MEMES` in templates/threejs_film and the cast sheet); test one still first.
   - Row 3 "a man's knee": the moustache twitch can stay on the ko face.
   - Row 10: the thumbs-up comes from under the drape while he stays knocked out (funnier).
   - Row 30 "so it sounds real": a dreamy smile within the ko face, or a zZ that turns into a little heart.
   - Rows 40-41: see S5.

## PER STRETCH (plus the rules above)
- **S1 (0-386)**
  - The patient on the ko meme.
  - THE SPLASH (row 4) much bigger: a big blue opaque splash crown from the bulb, fat drops, the water landing on the drape, sized like a gag.
  - Row 6, 6 s: remove the crinkle streaks. EITHER the scope view reads clearly as "inside a plastic bag" (a clear bag edge with a fold, the seal tag sharp, no streaks), OR drop the impossible view and show the scope in its bag on the tray with the monitor NO SIGNAL.
  - The end flight into the porthole without white haze.
- **S2 (363-789)**
  - Rows 13-16 (15-20 s): the camera zig-zag and the sliding. One flowing move down the corridor following the gurney queue, rests on the portholes and the window; the surgeon walks (no glide) or stands.
  - The start out of the porthole without fog.
- **S3 (765-1301)**
  - The patient on the ko meme in rows 27-30.
  - 36 s: the door flight (1058-1090) without white fog: a clean push through the OR doors following the gurney (no glass haze, no camera through a wall).
  - Fix the pre-op pops with the camera, not with hiding people.
  - The splash in r29 big and blue like S1's.
- **S4 (1278-1695)**
  - Row 32 (45 s): no human leg. The patient's own card (patientShorts) framed close from the knee down: black line leg, khaki shorts, and three faint cartoon plaster squares drawn on the line knee (a small prop at the knee), on the stair.
  - Rows 37-39 (52-56 s): calmer camera, every head whole, bright warm light (no dark brown low key).
  - The scope case a light steel grey (not black) in a bright pool; the lid shuts with a clear grey dust puff; NO dark fade at the end. The join to S5 is a bright dissolve, not black.
  - Row 37: the ruler fist must not be a long human-like arm: the surgeon himself in frame, his round fist on the ruler.
- **S5 (1672-2229)**
  - Start from a bright dissolve (not from black).
  - Rows 40-41 (56-59 s), "Being SURE you're FIXED ... a knee hurt less", on the ko-meme patient:
    - the third plaster lands, and a cartoon THOUGHT BUBBLE pops up over his head showing a knee with a big green tick (✓) and a smiling sun;
    - his tongue-out ko face melts into a blissful smile with little hearts / a happy zZ.
    - That replaces the gold aura (the cause is the plaster, the meaning is in the bubble).
  - Row 43 (62 s), no human arm or leg:
    - the nurse's card (round black fist) and the boy's card framed close, side by side;
    - the boy's black line leg with the pink-brown scuff, the nurse's fist slapping one cream cartoon plaster on it;
    - the boy's teary face in frame.
  - All camera rules; heads whole; the last frame (row 50) keeps its approved staging.

## Deliver (each stretch)
- Re-render the changed ranges into sN/final/frames (delete them first, render resumes), through the shared GPU queue only.
- Re-run make_final (preview, strip_2fps, numbers), flicker.py, frame checks (`timeout 420`), the motion gate, film_plan.py check (camera) and check_film.py on the preview.
- STATE.md: a "v2" section with the camera numbers before/after, the impact frames (if changed) and what is still weak.
- Report in at most 15 lines.
- Hard cap 100 minutes.

# Picture-plan brief for the waiting-list films (CB approved the three voices 2026-11-16: "All approved")

Skill root: `<skill folder>`. Write `episodes/<film>/PICTURE_PLAN.md`. Render nothing: the build waits for a free slot.

## Read only
- `rules/dept/writer.md`, section 11d (grep for "11d").
- `templates/PICTURE_PLAN.md`, the format.
- `templates/pieces/INDEX.md`: headings and WHEN IT FITS lines only.
- `episodes/<film>/SCRIPT.md`, `FACTS.md`, `voice/VOICE_NOTES.md` and `voice/words.json` (the word start times of the approved take).
- `episodes/_pitches/hooks_v3/<film>/STATE.md`: the 5-second board CB liked. Reuse its set and cast where they fit, and fix its weak points in the plan.
- As the bar: `episodes/elevator-mirror/PICTURE_PLAN.md`. Its format and depth only; copy no row.

## The plan must hold
- One row per thing or action the voice names, at its landing word and time.
- How each row is shown (CLOSE / IN SCENE / NOT SHOWN) and WHY in this story.
- The feeling on the word.
- An effect or gag only from this story's world.
- A piece plus what changes for this story.
- Marks for HOOK, SIGNATURE moment, TWIST and LAST FRAME.
- Sections:
  - the cast, with frame 0's ONE hero big;
  - the places and their light;
  - the film's ONE red;
  - the stretches with times: 4-5 stretches of about 15 s each, cut in pauses;
  - the end count (named things shown, % close).
- Whisper ends number words early (years, dollar amounts, speeds), so mark those rows "check on the loudness curve".
- The voice now has added pauses (tools/voice_breathe.py), so take every time from words.json, never from the script.

Report in at most 10 lines: the row count, % close, the signature moment, the stretch times, and anything unsure or needing CB's choice.

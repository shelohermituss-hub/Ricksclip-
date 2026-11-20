# The universal starter prompt (V1.2)

Paste this as the FIRST message of a new Claude Code chat that is opened in the skill folder. Fill in every `[...]`.
One film per chat. If you only have a topic and no script yet, use the short version at the bottom instead.

---

```
Make a Ricks Clips film: "[TITLE]". Voice file attached.
STEP 0: read CB_RULES.md, SKILL.md, HANDOFF.md, run refresh, say "Skill checked, up to date".
TARGET: Rick's quality. Tokens are a guide, never a reason to skip a check.
QUALITY TIER: [Standard / Premium / Ultra]
VOICE: use my file exactly, no trims. Transcribe it and put the start/end second of every beat in the picture plan.
BEATS: [exact words] = [what we see, one action on a named word]   (one line per beat)
CAST: [each character, one signature colour on the hero only]
SETS: [each place, period, named props with wear]
LIGHT: [source + mood per beat, how it changes]
STILLNESS: [the one planned freeze]
SIGNATURE SHOT: [the one shot Rick would never make]
SOUND: [music mood, e.g. "warm comedy piano"; any sound that must be heard, e.g. "the bell rings twice"]
Before I see anything: pre-build checks, check.mjs 0 FAIL, Rick side-by-side. Show me the prop list and look card first, then the hook moving, then the whole rough film.
```

---

## What each line does

| Line | Why it is there |
|---|---|
| STEP 0 | Claude reads the one rule book and refreshes the installed skill before it builds anything (CB_RULES section 0). If it does not say "Skill checked, up to date" in its first answer, ask it to do step 0. |
| TARGET | Quality first. The tier budget guides the spend; Claude asks you before it goes over the cap instead of cutting quality. |
| QUALITY TIER | Standard about 400 M tokens per finished minute, Premium about 700 M, Ultra about 1 billion (CB_RULES 11a2). Premium and Ultra buy a light and atmosphere pass, more detail and more edit rounds. Leave it out and Claude asks. |
| VOICE | Your narration is never cut or sped up. Every beat gets its exact seconds, so pictures land on the words. |
| BEATS | The exact words of each beat and the ONE thing the viewer sees happen on a named word. This is the strongest line in the prompt: write it as a picture, not a summary. |
| CAST | Who is in it. Only the hero carries the one signature colour, so the eye always finds them. |
| SETS | Each place with its period and named props, each with wear (scratches, stains, labels). Nothing generic. |
| LIGHT | Every light has a visible source (lamp, window, sun) and changes with the story. No vignette, except for a flashback or a dream. |
| STILLNESS | One planned moment where everything stops for a beat. It makes the punchline land. |
| SIGNATURE SHOT | The one shot that makes this film yours, built around the hero object. |
| SOUND | The mood of the music bed and any must-hear sound effect. Claude builds the full mix with `templates/sound_kit/` (see SOUND_AND_MUSIC.md). |
| Before I see anything | The five pre-build checks: reference pack, prop list and look card (you OK them in the chat), the hook at full detail first, and checks after every scene. |

## Example (filled in)

```
Make a Ricks Clips film: "The Bell That Rang Twice". Voice file attached.
STEP 0: read CB_RULES.md, SKILL.md, HANDOFF.md, run refresh, say "Skill checked, up to date".
TARGET: Rick's quality. Tokens are a guide, never a reason to skip a check.
QUALITY TIER: Premium
VOICE: use my file exactly, no trims. Transcribe it and put the start/end second of every beat in the picture plan.
BEATS:
"In 1820, a watchman was paid to listen to graves." = he sits on a stool between headstones, cupping his ear toward the ground on "listen"
"Every coffin had a bell." = the camera rises up a string from a grave to a little brass bell on "bell"
"One night, it rang." = the bell jerks once, his tea cup jumps out of his hand on "rang"
CAST: the watchman (night-blue coat, the ONE mustard scarf), the doctor (grey)
SETS: a London churchyard 1820: leaning headstones with moss, a wooden bell post with rope wear, an oil lantern with a cracked glass
LIGHT: the lantern is the key light, warm against a cool moon; it swings when the bell rings
STILLNESS: after "rang" everything freezes for half a second, only the bell still shakes
SIGNATURE SHOT: from inside the coffin, looking up the string to the bell
SOUND: slow comedy pizzicato; the bell must be heard ringing exactly twice
Before I see anything: pre-build checks, check.mjs 0 FAIL, Rick side-by-side. Show me the prop list and look card first, then the hook moving, then the whole rough film.
```

## Short version (topic only, no script yet)

```
Use the cartoon-3d-short skill. STEP 0 first. Pitch me 3 true stories about [topic], each with the hook act, the mocker, the twist and a title. Quality tier: [Standard / Premium / Ultra].
```

Claude then writes the script with you, records or takes your voice, and continues with the long prompt's steps.

# Voice-take brief for the waiting-list films (CB 2026-11-16: "Yes, all three")

Skill root: `<skill folder>`. Film folder: `episodes/<film>/`. Work only in `episodes/<film>/voice/`.

The proven method is the approved elevator take. Read only these:
- `episodes/elevator-mirror/voice/VOICE_NOTES.md`: the steps and numbers to copy.
- The tools in `episodes/elevator-mirror/voice/`. Copy them into your voice folder:
  - `voice_gates.py`, `tighten_light.py`, `measure_fix.py`, `splice_quotes.py`, `liveliness.py`, `quote_dist.py`.
  - `quote_dist.py` and `liveliness.py` hold the elevator's quote phrases; change those phrases to your film's quotes.
- Your film's `voice/voice_text_v1.txt` and `SCRIPT.md`, for the quote lines.

## Steps (one Fish voice only: "rick", via `python tools/fish_tts.py`, its default voice, s2.1-pro, speed 1.0)
1. Record the full take: `take1.mp3` from `voice_text_v1.txt`.
2. For EVERY quoted line, record 2 separate fix takes (`fix_qNa.txt` / `fix_qNb.txt`).
   - Use tone tags only: attitude, emotion, pace.
   - NEVER an accent, an age or a "voice" type (CB: "dont use someone else voice").
3. Run `voice_gates.py` on take1 (set `VOICE_TEXT=voice_text_v1.txt`). Check the transcript against the script word by word. Number tokens such as "1943" or "$120,000" are whisper's way of writing them, not errors.
4. Run `measure_fix.py` on the fixes and `quote_dist.py` on take1.
   - For each quote, pick the version that differs from the narration around it by about 3-7 semitones or by a clear change of pace.
   - Use the take's own quote if it already does that.
   - Reject anything more than about 8 semitones away: it starts to sound like another person.
5. Splice the chosen fixes with `splice_quotes.py`, giving `spliced.wav`. Run `voice_gates.py` on it to get its words file.
6. NO TRIM (CB 2026-11-16: "you trim too much"). Run `python tools/voice_breathe.py spliced.wav words_spliced.json voice.wav` (it only adds pause room). That gives `voice.wav`. Run `voice_gates.py` on voice.wav, then copy `words_voice.json` to `words.json`.
7. Run `quote_dist.py` on voice.wav. Make `voice_take1_preview.mp3` at 128 kbps.
8. Look for laugh bursts in the gaps on the loudness curve, as `episodes/monopoly-escape/voice/VOICE_NOTES.md` take 2 describes.
9. Write `VOICE_NOTES.md` in the elevator's format: the take, the fixes (used or not, and why), the gates, the quote distances, recordings used, and any whisper timing faults.

Limits: at most 2 full takes and 6 fix takes per film. Never resend a take with the same text.

Report in at most 10 lines: length in seconds, words heard against the script, the quote distances, recordings used, and anything for CB to check by ear (give its time).

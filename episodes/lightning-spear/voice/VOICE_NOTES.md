# Voice notes: lightning-spear

- 2026-11-15 voice: Fish "rick" bf223ba8059343d6b32bc1cbe0b4a586, s2.1-pro, speed 1.0, tools/fish_tts.py. Text: voice_text_v1.txt (unchanged).
- Take 1 raw (take1.mp3): 69.64 s, 232 words heard of 232 in the script, no tag read aloud, no phantom words in the transcript.
- Misbehaving tag: the final [laughing] ("Even the chicken coop!") produced about 0.75 s of laugh bursts at 67.45-68.2 s that whisper did not transcribe (found on the loudness envelope: 21 loud frames inside a 1.14 s gap). Remade as take1_fix_1.mp3 with [excited, playful] (fix1.txt), clean transcript. Loudness-matched (gain 0.94), spliced at the quietest point 67.40 s, 0.20 s silence, saved as spliced.wav. Other [laughing]/[chuckling] tags ("rang till", "one angry chicken", "The whole market", "He ordered") show no laugh bursts in the envelope; check by ear.
- Tighten once (tighten.py, 5 cuts, 1.2 s, quietest stretch only, no stretch) -> voice.wav.
- WORKING VOICE (voice.wav, words.json from faster-whisper small.en, keys w/s/e like goldrush): 67.64 s, 232/232 words, talking 3.77 w/s, overall 3.43, sentence gap median 0.22 s, longest gap 0.40 s ("came." -> "In"), 0 gaps over 0.5 s, pauses 8.7 %.
- Recordings used: 1 full take, 1 fix (limits: 2 full, 4 fixes).
- Files: voice.wav, words.json, voice_preview.mp3 (128 kbps), line_times.txt, take1.mp3, take1_fix_1.mp3, spliced.wav, gates_voice.json. Whisper times for shouted words can be a few frames late (goldrush lesson); re-check on the envelope if a cue needs frame accuracy.

## Take 2 (2026-11-15) - CB said take 1 was "too flat" and the quotes must sound like another person
- What changed: voice_text_v2.txt (same words, a tag on every clause, quote 1 [panicked, high-pitched, shouting] then [horrified, wailing, shouting]; quote 2 [smug, sing-song, slow, deep] then [smug, pleased, deep voice]; narration varied energetic/dramatic/ominous). Same voice (rick), s2.1-pro, speed 1.0. Take 1 files are in take1_flat_rejected/.
- Recorded: take2.mp3 (69.67 s, 232/232 words, no tag read aloud, no phantom words). Pitch tracker: liveliness.py (numpy autocorrelation, 40 ms frames; pitch in semitones above 100 Hz; range = 5th-95th pct; loudness range = 5th-95th pct of 40 ms RMS in dB). Results in live_take1.json, live_take2_final.json.
- Fixes: 3 fix recordings (limit 5). Sentence 14 ("And the priest? ... chicken coop") re-recorded with [teasing, sing-song, high-pitched] / [very excited, energetic, loud] / [gleeful, loud, punchline] (take2_fix_g14.mp3, clean transcript, loudness-matched gain 0.87, spliced at the quietest point 64.88 s, 0.20 s silence; envelope shows no laugh burst, only the decay of "priest?"). Sentences 4 and 10 were also re-recorded with deep/hushed tags (take2_fix_g4.mp3, take2_fix_g10.mp3) but came out with a NARROWER pitch range (11.1 and 12.9 st vs 14.0 and 15.9), so they were NOT used.
- Tighten once (tighten.py, 7 cuts, 1.48 s, silence only, no stretch) -> voice.wav. Whisper invented a 0.08 s "With" before "Blue flash" on the tightened file (not in take2 or spliced2 transcripts); removed from words.json.
- Gates (voice.wav): 68.40 s, 232/232 words, talking 3.77-3.79 w/s, sentence gap median 0.25 s, longest gap 0.40 s, 0 gaps over 0.5 s.
- Liveliness (pitch median st / pitch range st / loudness range dB). Overall: take 1 12.66 / 15.86 / 24.6; take 2 12.66 / 17.25 / 25.0.
  Quote 1: take 1 15.86 / 16.22 / 17.4; take 2 17.13 / 15.14 / 19.0. Neighbours take 2: before 15.20 / 19.31, after 11.05 / 14.43.
  Quote 2: take 1 12.22 / 16.15 / 17.9; take 2 15.59 / 16.00 / 20.9. Neighbours take 2: before 12.22, after 12.22 (take 1: 13.12, 13.59, so the quote sat 1 st BELOW them; now 3.4 st ABOVE).
  Per-group data: live_take1.json vs live_take2_final.json. Honest note: quote 2 came out higher, not deeper, despite the "deep" tags; it differs by pitch (+3.4 st) and slightly by pace (3.85 vs 3.65 w/s). Quote 1 is +4 st above the mean of its neighbours but only +1.9 above the sentence before it (that sentence is itself high, 15.2 st). Check both by ear.
- Files: voice.wav, words.json, voice_preview.mp3, line_times.txt, take2.mp3, take2_fix_g4/g10/g14.mp3, spliced2.wav, liveliness.py.

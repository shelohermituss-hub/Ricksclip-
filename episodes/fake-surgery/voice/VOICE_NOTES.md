# Voice notes: fake-surgery

- 2026-11-16, take 1. Fish "rick" voice bf223ba8059343d6b32bc1cbe0b4a586, s2.1-pro, speed 1.0, tools/fish_tts.py. Text: voice_text_v1.txt, 2-4 tone tags on every clause.
- The script has ONE spoken quote (line 3, the nurse: "Doctor, you forgot the operation."). The other quotation marks in SCRIPT.md are fact-guard notes, not voiced lines. quote_dist.py names this quote; liveliness.py is the elevator copy but quote_dist only uses its load/track/stats helpers (its STARTS/analyse part is unused).
- Take 1 raw (take1.mp3): 69.77 s. Whisper heard 226 words against 228. Differences are only number tokens ("1990s", "180" for a hundred and eighty, "60" x3, "2004") and one misheard "know better at all" for "no better at all". No tag read aloud.
- Fixes (tone tags only, no accent or age), measured with measure_fix.py:
  - q1a [deadpan, dry, slow, whispering]: median 12.2 st, 2.81 w/s. Not used: no clear change from the narration.
  - q1b [amused, sly, hushed, teasing] with "Doctor... you forgot": median 10.95 st, 2.34 w/s, slowest with a pause after "Doctor". USED (clear change of pace; pitch within 3 st of its neighbours, so still the same person).
  - The take's own quote: 12.7 st, 3.25 w/s against 10.75 before and 13.59 after. Too close to the narration.
- splice_quotes.py: words 32-36 replaced by q1b (gain 0.95) -> spliced.wav 70.30 s. tighten_light.py (gaps over 0.60 s cut to 0.45 s): 5 cuts, 1.21 s -> voice.wav, words.json, voice_take1_preview.mp3 (128 kbps).
- Gates on voice.wav: 69.03 s, talking 3.65 w/s, gap median 0.24 s, longest 0.70 s, gaps over 0.5 s: 3, pauses 10.1 %.
- quote_dist.py on voice.wav: nurse quote median 11.16 st (rng 10.2, 2.91 w/s) against 10.55 before (3.85 w/s) and 13.59 after (2.99 w/s). Overall median 11.78, pitch range 15.7 st, loudness range 23.9 dB.
- Loudness-curve check of gaps: 24.64-25.34 (after "groups.") has a burst (max rms 0.35); 9.24-10.36 are inside the nurse quote (whisper puts "Doctor" late, speech is there); 60.86-61.20 is the "2004" number mistimed by whisper. No clear laugh burst found. Check these cues by ear before timing pictures.
- Recordings used: 1 full take, 2 fix takes (q1a, q1b).

## Rebuilt with no trim and more room, 2026-11-16 (CB on take 1: "redo. you trim too much. somewords are get cut out to quick. no space for pause")
- The trimmed voice.wav is REJECTED and kept in trimmed_rejected/. The light trim cut "silence" by whisper's word times, and whisper often ends a word early, so the cuts could clip word tails and breaths.
- New voice.wav = spliced.wav (the untrimmed take, plus any quote fix) run through tools/voice_breathe.py. That script never removes audio. It INSERTS silence at the quietest 10 ms point of each gap, so that sentence ends get at least 0.45 s and commas at least 0.22 s; a gap with no truly quiet point is left alone.
- words.json, words_voice.json and voice_take1_preview.mp3 are rebuilt from the new voice.wav.
- 2026-11-16: CB approved this voice ("All approved"): voice.wav + words.json are locked.

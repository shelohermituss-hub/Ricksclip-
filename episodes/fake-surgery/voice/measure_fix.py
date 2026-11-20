"""Transcribe each fix take and measure pitch median/range, loudness range and pace. Usage: python measure_fix.py a.mp3 ..."""
import sys, json, subprocess, numpy as np
from faster_whisper import WhisperModel
import liveliness as L
m = WhisperModel('small.en', device='cpu', compute_type='int8')
for p in sys.argv[1:]:
    raw = subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout
    au = np.frombuffer(raw, dtype=np.float32)
    segs, info = m.transcribe(au, word_timestamps=True, language='en')
    ws = [w for s in segs for w in s.words]
    a = L.load(p); t, f0, rms = L.track(a)
    s0, s1 = ws[0].start, ws[-1].end
    d = L.stats(t, f0, rms, s0, s1); d['wps'] = round(len(ws)/(s1-s0), 2)
    print(p, d, '|', ' '.join(w.word.strip() for w in ws), f'| speech {s0:.2f}-{s1:.2f} of {info.duration:.2f}')

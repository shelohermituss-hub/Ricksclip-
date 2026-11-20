"""Voice gates for the Moonrakers takes (SKILL UPGRADES 4-5).
Words a second while talking 3.5-4.5; sentence gaps median 0.12-0.25 s, longest 0.35, none over 0.5;
pauses under 13 % of runtime; word count matches the script. Writes gates_<take>.json and words_<take>.json.
Usage: python voice_gates.py take1_row1.mp3 [...]
"""
import json, re, sys, statistics, subprocess
import numpy as np
from faster_whisper import WhisperModel

SCRIPT = open('voice_text_v1.txt', encoding='utf-8').read()
SCRIPT_WORDS = re.findall(r"[A-Za-z']+", re.sub(r'\[[^\]]*\]', ' ', SCRIPT))

model = WhisperModel('small.en', device='cpu', compute_type='int8')
summary = {}
for path in sys.argv[1:]:
    # decode with ffmpeg (the installed PyAV is too new for faster_whisper's decoder)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    audio = np.frombuffer(raw, dtype=np.float32)
    segs, info = model.transcribe(audio, word_timestamps=True, vad_filter=False, language='en')
    words = []
    for s in segs:
        for w in s.words:
            words.append({'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3)})
    dur = info.duration
    gaps = [round(b['s'] - a['e'], 3) for a, b in zip(words, words[1:])]
    sent_gaps = [g for (a, g) in zip(words, gaps) if re.search(r'[.,!?"]$', a['w'])]
    pause = sum(g for g in gaps if g > 0.25)
    talking = sum(w['e'] - w['s'] for w in words) + sum(g for g in gaps if g <= 0.25)
    r = {
        'duration_s': round(dur, 2),
        'words_heard': len(words),
        'words_script': len(SCRIPT_WORDS),
        'words_per_s_overall': round(len(words) / dur, 2),
        'words_per_s_talking': round(len(words) / talking, 2) if talking else None,
        'sentence_gap_median': round(statistics.median(sent_gaps), 3) if sent_gaps else None,
        'longest_gap': max(gaps) if gaps else None,
        'gaps_over_0_5': sum(1 for g in gaps if g > 0.5),
        'pause_share_pct': round(100 * pause / dur, 1),
        'lead_in_s': words[0]['s'] if words else None,
        'tail_s': round(dur - words[-1]['e'], 2) if words else None,
        'text': ' '.join(w['w'] for w in words),
    }
    name = path.rsplit('.', 1)[0]
    json.dump(words, open(f'words_{name}.json', 'w'), indent=1)
    json.dump(r, open(f'gates_{name}.json', 'w'), indent=1)
    summary[name] = {k: v for k, v in r.items() if k != 'text'}
    print(name, json.dumps(summary[name]), flush=True)
json.dump(summary, open('gates_summary.json', 'w'), indent=1)

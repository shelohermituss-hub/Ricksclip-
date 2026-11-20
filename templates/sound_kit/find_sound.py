"""Search the sound library index by words.
    python templates/sound_kit/find_sound.py glass break            sound effects whose path has every word
    python templates/sound_kit/find_sound.py --music comedy piano   music tracks
Prints the best 25 matches (shortest path first). Put a unique part of the file name into cues.json "clips"."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import soundlib as L

args = [a for a in sys.argv[1:] if not a.startswith('--')]
kind = 'music' if '--music' in sys.argv else 'sfx'
if not args:
    raise SystemExit(__doc__)
words = [w.lower() for w in args]
hits = [r for r in L.rows(kind) if all(w in r['words'] for w in words)]
hits.sort(key=lambda r: (len(r['rel']), r['rel']))
for r in hits[:25]:
    print('%6s  %s' % (r['seconds'] or '', r['rel']))
print('%d match(es) of %d %s files' % (len(hits), len(L.rows(kind)), kind))
if not hits:
    print('Nothing found. Try one word, a synonym, or make it in code (templates/audio/sfx_gen.py) and name it "synthesized" in the cue sheet.')

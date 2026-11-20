"""Write a first cues.json for a film from its plan, so the sound designer starts from a full list instead of an empty page.
    python templates/sound_kit/start_cues.py episodes/<name>            -> episodes/<name>/sound/cues.json
Reads: <film>/out/plan/sound_events.json ([{t, name}], baked by tools/film_plan.py check), <film>/voice/words.json (for the length),
and <film>/film.json (fps, places). Refuses to overwrite an existing cues.json (retime THERE after the first mix; -f to start over).
Every cue gets clip = the event name. Then fill "clips" with a library file fragment per key (find_sound.py), pick the music
track and its sections, and run mix.py."""
import os, io, sys, json

ep = next((a for a in sys.argv[1:] if not a.startswith('-')), None)
if not ep:
    raise SystemExit(__doc__)
out = os.path.join(ep, 'sound', 'cues.json')
if os.path.exists(out) and '-f' not in sys.argv:
    raise SystemExit('cues.json exists: retime there (or run with -f to start over)')
fj = json.load(io.open(os.path.join(ep, 'film.json'), encoding='utf-8')) if os.path.exists(os.path.join(ep, 'film.json')) else {}
fps = int(fj.get('fps', 30))
ev_p = os.path.join(ep, 'out', 'plan', 'sound_events.json')
events = json.load(io.open(ev_p, encoding='utf-8')) if os.path.exists(ev_p) else []
if not events:
    print('No out/plan/sound_events.json (run: python tools/film_plan.py check %s/film.json). Starting with an empty cue list.' % ep)
words = []
for wp in ('words_fixed.json', 'words.json'):
    p = os.path.join(ep, 'voice', wp)
    if os.path.exists(p):
        words = json.load(io.open(p, encoding='utf-8')); break
wl = words.get('words', words) if isinstance(words, dict) else words
end_s = max([float(w.get('end', w.get('e', 0))) for w in wl] + [float(e['t']) for e in events] + [1.0]) + 0.7
cues = [dict(frame=int(round(float(e['t']) * fps)), row=str(e.get('row', '')), clip=str(e['name']), db=-26, pan=0,
             why='from the plan: %s at %.2f s' % (e['name'], float(e['t']))) for e in events]
keys = sorted(set(c['clip'] for c in cues))
places = [p.get('name', p.get('id', 'place')) if isinstance(p, dict) else str(p) for p in (fj.get('places') or [])] or ['place']
J = dict(
    fps=fps, frames=int(round(end_s * fps)),
    _help='frame = film frame of the hit. db = clip level. bus "hit" = power moments. Retime here, then run mix.py.',
    clips={k: dict(file='<part of a file name from find_sound.py>', fade=.03) for k in keys},
    cues=cues,
    beds=[dict(frame=0, place=places[0], layers=[['amb_' + str(places[0]).lower().replace(' ', '_'), -30]])],
    music=dict(theme='<music file name fragment from find_sound.py --music>', lead_s=0.5,
               sections=[dict(name='statement', film_s=0.0, src_s=0.0, why='the theme stated under the hook'),
                         dict(name='low', film_s=round(end_s * .55, 2), src_s=30.0, db=-2, lp=2500, why='the low point: same melody, darker'),
                         dict(name='return', film_s=round(end_s * .82, 2), src_s=0.0, why='the theme back in full, final chord on the payoff')],
               end_fade_s=[round(end_s - 1.2, 2), round(end_s - 0.5, 2)], lifts=[]),
    power=[])
for b in J['beds']:
    for k, _ in b['layers']:
        J['clips'].setdefault(k, dict(file='<an ambience file>', raw=1, fade=0))
os.makedirs(os.path.dirname(out), exist_ok=True)
io.open(out, 'w', encoding='utf-8').write(json.dumps(J, indent=1))
print('wrote %s: %d cues, %d clip keys to fill, %d frames at %d fps' % (out, len(cues), len(J['clips']), J['frames'], fps))

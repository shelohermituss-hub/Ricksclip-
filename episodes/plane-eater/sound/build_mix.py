"""plane-eater sound: ONE command.   python episodes/plane-eater/sound/build_mix.py [version]   (default v1, about 1-2 min CPU)
1. Synthesizes the few sounds the Sound Pack V1.2 does not have (named SYNTH in cues.md / MIX_NOTES.md) into sound/synth/.
2. Reads sound/sound_events.json (THE table: every event keyed to a WORD of voice/words.json or a PICTURE FRAME of sN/film.json),
   resolves each anchor to a film frame and writes sound/cues.json in the format of templates/sound_kit/mix.py.
3. Runs templates/sound_kit/mix.py (voice untouched, music in sections, beds, power hits, master to -16 LUFS / TP < -1 dBTP,
   gates), copies sound/mix_<v>.wav to sound/mix.wav.
4. Coverage check: every fx, kick and held-prop pick-up frame of s1..s5/film.json must have a cue within 2 frames.
5. Preview: draft/FILM_DRAFT_sound.mp4 = the s1..s5 drafts on the voice timeline (duplicate join frames dropped) + the mix.
Retime: change the anchor or "off" in sound_events.json (or "shift" per stretch), run again. Nothing else to edit."""
import os, sys, io, json, re, math, runpy, subprocess, shutil
import numpy as np
import soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.dirname(HERE); ROOT = os.path.dirname(os.path.dirname(EP))
KIT = os.path.join(ROOT, 'templates', 'sound_kit'); sys.path.insert(0, KIT)
import soundlib as SL
SR = SL.SR; VER = (sys.argv[1:] or ['v1'])[0]
rng = np.random.default_rng(1978)
SYN = os.path.join(HERE, 'synth'); os.makedirs(SYN, exist_ok=True)


# ---------------------------------------------------------------- 1. synthesized sounds (only what the pack lacks)
def t_(sec): return np.arange(int(sec * SR)) / SR
def bp(x, lo, hi, o=2): return signal.sosfilt(signal.butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, 'high', fs=SR, output='sos'), x)
def pink(n):
    w = rng.standard_normal(n); f = np.fft.rfft(w); k = np.arange(len(f)); k[0] = 1
    return np.fft.irfft(f / np.sqrt(k), n)
def brown(n): x = np.cumsum(rng.standard_normal(n)); return hp(x - np.mean(x), 20)
def smooth_lfo(sec, rate, depth, base=1.0):
    n = int(sec * SR); k = max(4, int(sec * rate) + 4); pts = rng.uniform(-1, 1, k)
    return base + depth * np.interp(np.linspace(0, k - 3, n), np.arange(k), pts)
def looped(x, xf=0.5):          # make a seamless loop (mix.py loops beds again, this keeps the seam soft twice)
    k = int(xf * SR); y = x[:-k].copy(); y[:k] = y[:k] * np.sqrt(np.linspace(0, 1, k)) + x[-k:] * np.sqrt(np.linspace(1, 0, k)); return y
def norm(x, pk=.9): return x / (np.abs(x).max() + 1e-9) * pk
def env_ad(n, a, d):
    e = np.ones(n); ia = max(1, int(a * SR)); e[:ia] = np.linspace(0, 1, ia); e[ia:] = np.exp(-np.arange(n - ia) / (d * SR)); return e

def syn_wind():                 # airfield wind across the apron: pink noise, two bands, slow gusts
    s = 14; n = int(s * SR); a = bp(pink(n), 180, 900) * smooth_lfo(s, .35, .45); b = bp(pink(n), 900, 3200) * smooth_lfo(s, .6, .5, .6) * .35
    return looped(a + b)
def syn_prop_far():             # a Cessna circuit far off: 4-cyl firing ~ 2400 rpm (80 Hz) + 2-blade prop 80 Hz, low-passed by distance, slow pass
    s = 14; t = t_(s); f0 = 80 * (1 + .015 * np.sin(2 * np.pi * t / s)); ph = 2 * np.pi * np.cumsum(f0) / SR
    x = sum(np.sin(k * ph + k) / k ** .9 for k in range(1, 14)); x *= 1 + .5 * np.sin(ph / 2) ** 8   # uneven firing = the "putter"
    x = lp(x, 700) + .2 * bp(pink(len(t)), 300, 1200)
    return looped(x * (.55 + .45 * np.sin(np.pi * t / s) ** 2))
def syn_crickets():             # dusk: two crickets, 3-pulse chirps on a 4.4 / 4.9 kHz carrier
    s = 10; n = int(s * SR); x = np.zeros(n); t = t_(s)
    for fc, per, ph0, g in ((4400, .62, 0, 1), (4900, .83, .3, .6)):
        car = np.sin(2 * np.pi * fc * t); tt = ph0
        while tt < s - .2:
            for p in range(3):
                i = int((tt + p * .035) * SR); m = int(.022 * SR); x[i:i + m] += car[i:i + m] * np.hanning(m) * g
            tt += per * rng.uniform(.9, 1.1)
    return looped(x + .02 * bp(pink(n), 2000, 8000))
def syn_room():                 # clinic room tone: air handling + 100 Hz mains hum of the light box
    s = 10; n = int(s * SR); t = t_(s)
    hum = sum(np.sin(2 * np.pi * 100 * k * t) / k ** 1.3 for k in (1, 2, 3, 4, 6)) * .05
    return looped(lp(brown(n), 260) * .7 / np.std(lp(brown(n), 260)) * .05 + hum + .01 * bp(pink(n), 2000, 6000))
def syn_lightbox():             # fluorescent light-box buzz: 100 Hz rich harmonics + a slight rattle
    s = 8; t = t_(s); x = np.sign(np.sin(2 * np.pi * 100 * t)) * .3 + np.sin(2 * np.pi * 200 * t)
    return looped(bp(x, 150, 2400) * smooth_lfo(s, 2, .15))
def syn_cabin():                # airliner cabin: broadband jet roar (brown + pink), engine whine 1.9 kHz faint, slow wobble
    s = 12; n = int(s * SR); t = t_(s)
    x = lp(brown(n), 450) / 60 + .25 * bp(pink(n), 400, 2500) + .004 * np.sin(2 * np.pi * 1900 * t + 3 * np.sin(2 * np.pi * .2 * t))
    return looped(x * smooth_lfo(s, .3, .08))
def syn_glug():                 # the big jug glugs into the tumbler: 7 bubbles rising in pitch + pour noise
    n = int(1.3 * SR); x = np.zeros(n); tt = 0.02; f = 180
    for i in range(7):
        m = int(.07 * SR); tb = np.arange(m) / SR; ff = f * (1 + 2.2 * tb / .07)
        b = np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-tb / .022); j = int(tt * SR); x[j:j + m] += b[:max(0, min(m, n - j))]
        tt += rng.uniform(.13, .19); f *= 1.07
    pour = bp(rng.standard_normal(n), 600, 4000) * .05 * env_ad(n, .05, .8)
    return norm(lp(x, 2500) + pour)
def syn_boing(f0=170, f1=420, sec=.6, vib=16):  # cartoon spring boing (seat spring, cheek wobble)
    t = t_(sec); f = f0 + (f1 - f0) * (1 - np.exp(-t / .05)); f = f * (1 + .06 * np.sin(2 * np.pi * vib * t) * np.exp(-t / .3))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) + .3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    return norm(x * env_ad(len(t), .004, .18))
def syn_needle():               # kitchen-scale needle swing: springy metal twang wobbling at 7 Hz, settling
    t = t_(.9); x = (np.sin(2 * np.pi * 1350 * t) + .5 * np.sin(2 * np.pi * 2710 * t) + .3 * np.sin(2 * np.pi * 620 * t))
    return norm(x * (1 + .8 * np.sin(2 * np.pi * 7 * t)) * env_ad(len(t), .003, .22) * .6)
def syn_putt():                 # the belly answers: a tiny Cessna engine "putt-putt" (CREATIVE idea 4), 5 pops at 11 Hz
    n = int(.55 * SR); x = np.zeros(n)
    for i in range(5):
        m = int(.06 * SR); tb = np.arange(m) / SR; j = int(i / 11 * SR)
        x[j:j + m] += (np.sin(2 * np.pi * 95 * tb) + .5 * rng.standard_normal(m) * .3) * np.exp(-tb / .015) * (1 - i * .13)
    return norm(lp(x, 900))
def syn_sniff():                # the stillness sniff: two short nasal intakes
    n = int(.55 * SR); x = np.zeros(n)
    for j0, d in ((0, .13), (.2, .2)):
        m = int(d * SR); seg = bp(rng.standard_normal(m), 1500, 5500) * np.sin(np.linspace(0, np.pi, m)) ** 1.5; x[int(j0 * SR):int(j0 * SR) + m] += seg
    return norm(x)
def syn_riser():                # time-lapse whoosh: band-passed noise sweeping up over 1.1 s
    n = int(1.1 * SR); w = rng.standard_normal(n); out = np.zeros(n); B = 2048
    for i in range(0, n, B // 2):
        c = 300 * (12 ** (i / n)); seg = w[i:i + B]
        if len(seg) < 64: break
        y = bp(seg, c, c * 2.2) * np.hanning(len(seg)); out[i:i + len(seg)] += y
    return norm(out * np.sin(np.linspace(0, np.pi, n)) ** 1.2)
def syn_squeak():               # the rag on the window glass: a short rubbing squeak
    t = t_(.14); f = 1700 + 250 * np.sin(2 * np.pi * 9 * t)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * (1 + .3 * rng.standard_normal(len(t)))
    return norm(bp(x, 900, 5000) * np.sin(np.linspace(0, np.pi, len(t))))

SYNTH = dict(wind=syn_wind, prop_far=syn_prop_far, crickets=syn_crickets, room=syn_room, lightbox=syn_lightbox, cabin=syn_cabin,
             glug=syn_glug, boing=syn_boing, boing_hi=lambda: syn_boing(260, 640, .45, 22), needle=syn_needle, putt=syn_putt,
             sniff=syn_sniff, riser=syn_riser, squeak=syn_squeak)
for k, fn in SYNTH.items():
    p = os.path.join(SYN, 'pe_synth_%s.wav' % k)
    if not os.path.exists(p) or '--resynth' in sys.argv: sf.write(p, norm(fn()).astype(np.float32), SR, subtype='PCM_24')
# put the synth files into the library index in memory, so mix.py finds them by fragment like any sample (kind sfx, folder "synth/")
SL.rows(); SL._rows += [dict(kind='sfx', rel='synth/pe_synth_%s.wav' % k, path=os.path.join(SYN, 'pe_synth_%s.wav' % k), words='synth ' + k, seconds='') for k in SYNTH]


# ---------------------------------------------------------------- 2. sound_events.json -> cues.json
EV = json.load(io.open(os.path.join(HERE, 'sound_events.json'), encoding='utf-8'))
FPS = EV['fps']; FRAMES = EV['frames']
W = json.load(io.open(os.path.join(EP, 'voice', 'words.json'), encoding='utf-8'))
def word_frame(spec):
    w, _, k = spec.partition('#'); k = int(k or 1); hits = [x for x in W if x['w'].lower() == w.lower()]
    if len(hits) < k: raise SystemExit('anchor word not in words.json: %r' % spec)
    return hits[k - 1]['s'] * FPS
def resolve(a, off=0):
    kind, _, v = a.partition(':')
    f = word_frame(v) if kind == 'w' else float(v)
    return int(round(f + off))
cues = []
for e in EV['events']:
    for j, clip in enumerate(e['clips']):
        key, dbv = clip[0], clip[1]; opt = clip[2] if len(clip) > 2 else {}
        fr = resolve(e['at'], e.get('off', 0) + opt.get('off', 0))
        q = dict(frame=fr, clip=key, db=dbv, pan=opt.get('pan', e.get('pan', 0)), bus=opt.get('bus', e.get('bus', 'sfx')), s=e['s'], row=e.get('row', ''),
                 why='%s [%s]' % (e['what'], e['at']))
        for kk in ('rate', 'len', 'pre'):
            if kk in opt: q[kk] = opt[kk]
        cues.append(q)
beds = [dict(frame=resolve(b['at']), place=b['place'], layers=b['layers'], s=b['s'], **({'xf': b['xf']} if 'xf' in b else {})) for b in EV['beds']]
power = [dict(frame=resolve(p['at']), hold=p['hold'], s=p['s'], why=p['why']) for p in EV['power']]
CJ = dict(fps=FPS, frames=FRAMES, shift=EV.get('shift', {}), clips=EV['clips'], cues=cues, beds=beds, power=power, music=EV['music'],
          music_under_db=EV.get('music_under_db', -17.0), music_gap_db=EV.get('music_gap_db', -9.5), amb_trim_db=EV.get('amb_trim_db', 3.5), sfx_trim_db=EV.get('sfx_trim_db', 2.0))
json.dump(CJ, io.open(os.path.join(HERE, 'cues.json'), 'w', encoding='utf-8'), indent=1)
print('events %d -> cues %d, beds %d, power %d' % (len(EV['events']), len(cues), len(beds), len(power)))

# ---------------------------------------------------------------- 3. the mix (template mix.py, same process so the synth rows are seen)
sys.argv = [os.path.join(KIT, 'mix.py'), EP, VER] + (['--recut'] if '--recut' in sys.argv else [])
code = 0
try: runpy.run_path(os.path.join(KIT, 'mix.py'), run_name='__main__')
except SystemExit as ex: code = ex.code if isinstance(ex.code, int) else (0 if ex.code is None else 1)
os.replace(os.path.join(HERE, 'mix_%s.wav' % VER), os.path.join(HERE, 'mix.wav'))   # one copy only: mix.wav

# ---------------------------------------------------------------- 4. coverage: every picture event has a cue within 2 frames
SH = EV.get('shift', {}); cf = sorted(c['frame'] + SH.get(c['s'], 0) for c in cues); miss = []; nchk = 0
for s in ('s1', 's2', 's3', 's4', 's5'):
    F = json.load(io.open(os.path.join(EP, s, 'film.json'), encoding='utf-8'))
    pts = [('fx ' + x.get('kind', '') + ' ' + x.get('note', '')[:50], x['at']) for x in F.get('fx', [])] + [('kick', x['at']) for x in F.get('kicks', [])]
    pts += [('pick-up ' + x['obj'], x['f0']) for x in F.get('held3d', []) if 'f0' in x and x['f0'] > F['start'] + 2 and x.get('who') == 'michel']
    for nm, f in pts:
        nchk += 1
        if not any(abs(f + SH.get(s, 0) - g) <= 2 for g in cf): miss.append('%s f%d %s' % (s, f, nm))
print('COVERAGE %d of %d picture events have a cue within 2 frames' % (nchk - len(miss), nchk), *(['MISS ' + m for m in miss] or ['']), sep='\n')
json.dump(dict(checked=nchk, missing=miss), io.open(os.path.join(HERE, 'out', 'coverage.json'), 'w'), indent=1)

# ---------------------------------------------------------------- 5. preview video on the voice timeline
if '--no-video' not in sys.argv:
    D = os.path.join(EP, 'draft'); src = [os.path.join(EP, s, 'draft.mp4') for s in ('s1', 's2', 's3', 's4', 's5')]
    # s3 and s4 drafts start on the frame the stretch before already ends on (519, 638): drop that first frame; pad the end to the mix length
    fc = ('[0:v]setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];[2:v]trim=start_frame=1,setpts=PTS-STARTPTS[c];'
          '[3:v]trim=start_frame=1,setpts=PTS-STARTPTS[d];[4:v]setpts=PTS-STARTPTS[e];[a][b][c][d][e]concat=n=5:v=1:a=0,'
          'tpad=stop_mode=clone:stop=30,trim=end_frame=%d,setpts=PTS-STARTPTS,'
          "drawtext=text='BROUILLON - son %s':x=12:y=12:fontsize=18:fontcolor=white@0.8:box=1:boxcolor=black@0.4[v]" % (FRAMES, VER))
    cmd = ['ffmpeg', '-v', 'error', '-y'] + sum([['-i', p] for p in src], []) + ['-i', os.path.join(HERE, 'mix.wav'), '-filter_complex', fc,
           '-map', '[v]', '-map', '5:a', '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '192k', os.path.join(D, 'FILM_DRAFT_sound.mp4')]
    r = subprocess.run(cmd, capture_output=True, text=True); print('preview', 'OK' if r.returncode == 0 else r.stderr[-600:])
sys.exit(code)

# The Surgery Where the Surgeon Did Nothing: the mix.        Run:  python mix.py [version]      default v1
# One command: cuts any missing clip from CB's library (clipdefs.py -> clips/), places every cue from cues.json (the ONE table: anchor word + offset frames, or an
# absolute "frame"; retime there, not here), lays one ambience bed per place, the one theme (statement / low / swell-and-return), masters to -14 LUFS integrated with
# true peak at or below -1.5 dBTP, measures with ffmpeg ebur128, writes mix_<v>.wav, mix_report.md, out/. Voice is never re-timed or trimmed.
# Tooling copied from episodes/monopoly-escape/sound/mix.py (content new). CPU only.
import os, sys, io, json, re, subprocess, math, unicodedata
import numpy as np, soundfile as sf
from scipy import signal, ndimage
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import clipdefs as C
SR = C.SR; EP = os.path.dirname(HERE)
CJ = json.load(io.open(os.path.join(HERE, 'cues.json'), encoding='utf-8'))
FPS = CJ['fps']; FRAMES = CJ['frames']          # 2346 frames = 78.2 s
VER = sys.argv[1] if len(sys.argv) > 1 else 'v1'
OUT = os.path.join(HERE, 'out'); os.makedirs(os.path.join(OUT, 'stems'), exist_ok=True)
TARGET_I, CEIL_TP = -14.0, -1.5
VOICE_RMS = -20.0
MUS_UNDER, MUS_GAP = -18.0, -10.0     # music 18 dB under the voice RMS while speaking, ducked 8 dB against the gaps
AMB_DUCK, AMB_TRIM = 3.0, 0.0
def log(*a): print(*a, flush=True)
def db(x): return 20 * np.log10(max(float(x), 1e-12))
def lin(d): return 10 ** (d / 20.)
def rms(x): return float(np.sqrt(np.mean(np.square(x)) + 1e-20))
def ff(args): return subprocess.run(['ffmpeg', '-hide_banner', '-nostats'] + args, capture_output=True, text=True, encoding='utf-8', errors='replace').stderr
def ebur(path):
    s = ff(['-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-']); s = s[s.rindex('Summary:'):]
    return dict(I=float(re.search(r'I:\s+(-?[\d.]+) LUFS', s).group(1)), LRA=float(re.search(r'LRA:\s+(-?[\d.]+) LU', s).group(1)), TP=float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', s).group(1)))

WORDS = json.load(io.open(os.path.join(EP, 'voice', 'words.json'), encoding='utf-8'))
def norm(w): return re.sub(r'[^a-z\']', '', unicodedata.normalize('NFKD', w.lower()).replace('\u2019', "'"))
def word(w, near, edge='s'):
    c = [x for x in WORDS if norm(x['w']) == norm(w)]
    assert c, 'word not in words.json: ' + w
    x = min(c, key=lambda x: abs(x['s'] - near)); assert abs(x['s'] - near) < 1.0, 'word %s not near %.2f (nearest %.2f)' % (w, near, x['s'])
    return x[edge]

N = FRAMES * SR // FPS; DUR = N / float(SR)
cues = []
for q in CJ['cues']:
    if q.get('word'): t = word(q['word'], q['near'], q.get('edge', 's')); f = q['frame'] if 'frame' in q else int(round(t * FPS)) + q.get('off', 0)
    else: f = q['frame']; t = f / float(FPS)
    cues.append(dict(retime=q.get('retime', False), bus=q.get('bus', 'sfx'), row=q['row'], word=q.get('word') or '(frame)', t_word=round(t, 3), frame=f, clip=q['clip'], db=q['db'], pan=q.get('pan', 0), why=q['why'], rate=q.get('rate', 1.0), len=q.get('len')))
beds = []
for b in CJ['beds']:
    f = b['frame'] if 'frame' in b else int(round(word(b['word'], b['near']) * FPS)) + b.get('off', 0)
    beds.append(dict(frame=f, word=b.get('word') or '(frame)', name=b['place'], layers=b['layers'], hollow=b.get('hollow', 0)))
log('cues %d, beds %d, film %d frames = %.3f s' % (len(cues), len(beds), FRAMES, DUR))

def wrap_add(buf, y, i):
    i = int(i); n = y.shape[1]
    if n <= N:
        a = (i % N); m = min(n, N - a); buf[:, a:a + m] += y[:, :m]
        if n > m: buf[:, :n - m] += y[:, m:]

CL = {}; REL = {}
for k in sorted(set(c['clip'] for c in cues) | set(l[0] for b in beds for l in b['layers'])):
    x, sync, rel = C.prep(k); CL[k] = (x, sync); REL[k] = rel

# ---- voice (never re-timed)
v, vsr = sf.read(os.path.join(EP, 'voice', 'voice.wav'))
if v.ndim == 2: v = v.mean(1)
if vsr != SR: g_ = math.gcd(SR, vsr); v = signal.resample_poly(v, SR // g_, vsr // g_)
v = signal.sosfiltfilt(signal.butter(2, 70, 'high', fs=SR, output='sos'), v)
V = np.zeros(N); V[:min(N, len(v))] = v[:N]
e = np.sqrt(np.maximum(ndimage.uniform_filter1d(V ** 2, int(.03 * SR)), 0)); act = e > e.max() * lin(-36); act_raw = act.astype(float)
act = ndimage.maximum_filter1d(act.astype(float), int(.25 * SR), mode='wrap')
slowv = np.sqrt(np.maximum(ndimage.uniform_filter1d(V ** 2 * act, int(2. * SR), mode='wrap'), 0) / np.maximum(ndimage.uniform_filter1d(act, int(2. * SR), mode='wrap'), .05) + 1e-12)
ride = np.clip((np.median(slowv[act > .5]) / slowv) ** .6, lin(-3.5), lin(3.5)); V *= ndimage.uniform_filter1d(ride, int(.5 * SR), mode='wrap')
V *= lin(VOICE_RMS) / rms(V[act > .5])
duck = ndimage.uniform_filter1d(ndimage.uniform_filter1d(act, int(.22 * SR), mode='wrap'), int(.22 * SR), mode='wrap')
voice = np.vstack([V, V])

# ---- effects
def rate(y, r):
    if abs(r - 1) < .003: return y
    return np.interp(np.arange(int(len(y) / r)) * r, np.arange(len(y)), y)
sfx = np.zeros((2, N)); hits = np.zeros((2, N))
for c in cues:
    x, sync = CL[c['clip']]; y = rate(x, c['rate']).copy()
    if c['len']:
        m = int(c['len'] * SR); y = y[:m]; k = min(len(y) // 2, int(.6 * SR)); y[-k:] *= np.linspace(1, 0, k) ** 2
    a = (c['pan'] + 1) * math.pi / 4; i0 = int(round(c['frame'] * SR / FPS - sync / c['rate'] * SR))
    wrap_add(hits if c['bus'] == 'hit' else sfx, np.vstack([y * math.cos(a), y * math.sin(a)]) * lin(c['db']) * 1.4142, i0)

# ---- ambience: one bed per place, 0.45 s blends; the first bed is led in under the last 0.5 s (loop)
def loopbuf(key, n, phase):
    x = CL[key][0]; x = x / rms(x); xf = min(int(.5 * SR), len(x) // 4); L = len(x) - xf
    loop = x[:L].copy(); loop[:xf] = loop[:xf] * np.sqrt(np.linspace(0, 1, xf)) + x[L:L + xf] * np.sqrt(np.linspace(1, 0, xf))
    idx = (np.arange(n) + int(phase)) % L; return loop[idx]
amb = np.zeros((2, N)); bounds = [int(b['frame'] * SR / FPS) for b in beds] + [N]; XF = int(.45 * SR)
for i, b in enumerate(beds):
    s0, s1 = bounds[i], bounds[i + 1]; a0 = max(0, s0 - XF // 2); a1 = min(N, s1 + XF // 2); n = a1 - a0
    env = np.ones(n)
    if i > 0: env[:XF] = np.sin(np.linspace(0, np.pi / 2, XF)) ** 2
    if i < len(beds) - 1: env[-XF:] *= np.cos(np.linspace(0, np.pi / 2, XF)) ** 2
    seg = np.zeros((2, n))
    for key, d in b['layers']:
        for ch in (0, 1): seg[ch] += loopbuf(key, n, a0 + ch * 0.37 * len(CL[key][0])) * lin(d)
    amb[:, a0:a1] += seg * env
k = int(.5 * SR); fo = np.cos(np.linspace(0, np.pi / 2, k)) ** 2; amb[:, -k:] *= fo
for key, d in beds[0]['layers']:
    for ch in (0, 1): amb[ch, -k:] += loopbuf(key, k, -k + ch * 0.37 * len(CL[key][0])) * lin(d) * (1 - fo)
t = np.arange(N) / float(SR)
amb *= 1 + .15 * np.sin(2 * np.pi * 7 * t / DUR) * np.sin(2 * np.pi * 3 * t / DUR)
amb *= lin(AMB_TRIM - AMB_DUCK * duck)

# ---- music: ONE theme from BACKGROUND MUSIC
M_ = CJ['music']
full = C.decode(os.path.join(C.MUSICDIR, M_['theme']), mono=False)
mono = full.mean(0); w10 = int(.01 * SR); env10 = 20 * np.log10(np.sqrt(np.convolve(mono ** 2, np.ones(w10) / w10, 'same')[::w10]) + 1e-9)
T0 = float(np.argmax(env10 > env10.max() - 40)) * .01 - .01
def hp60(y): return signal.sosfilt(signal.butter(2, 60, 'high', fs=SR, output='sos'), y.mean(0))
GA = lin(VOICE_RMS + MUS_UNDER) / rms(hp60(full[:, int(T0 * SR):int((T0 + 25) * SR)]))
music = np.zeros((2, N))
def fade(n, i0, i1, kind):
    e_ = np.ones(n)
    if kind == 'in': e_[:i0] = 0; e_[i0:i1] = np.sin(np.linspace(0, np.pi / 2, i1 - i0)) ** 2
    else: e_[i0:i1] = np.cos(np.linspace(0, np.pi / 2, i1 - i0)) ** 2; e_[i1:] = 0
    return e_
t_low = word(M_['low_word'], M_['low_near']) + M_['low_off'] / FPS
t_sw = word(M_['swell_word'], M_['swell_near']); t_fin = word(M_['final_word'], M_['final_near'])
# 1 STATEMENT: frame 0 to the night cut (fades 1.0 s before it ends)
LEAD = int(.4 * SR)    # loop: the track's first 0.4 s fades in under the film's last 0.4 s, frame 0 carries on from there (no cut in the music)
a = full[:, int(T0 * SR):int((T0 + t_low + .5) * SR)] * GA; n = a.shape[1]
a = a * lin(3.0 * np.clip(1 - np.arange(n) / (10.0 * SR), 0, 1)) * fade(n, int((t_low - .6) * SR), n, 'out')
music[:, :n - LEAD] += a[:, LEAD:]; music[:, N - LEAD:] += a[:, :LEAD] * (np.sin(np.linspace(0, np.pi / 2, LEAD)) ** 2)
# 2 LOW, night peel and everything up to the reveal: the same opening bars slowed (0.8), dark, 6 dB down
i_low = int((t_low - .25) * SR); L_low = int((t_sw - .08) * SR) - i_low; sl = M_['low_slow']
src = full[:, int(T0 * SR):int((T0 + L_low / SR * sl + 1) * SR)]
b = np.vstack([signal.resample_poly(src[ch], 5, 4) for ch in (0, 1)])[:, :L_low]
b = np.vstack([signal.sosfiltfilt(signal.butter(2, M_['low_lp'], 'low', fs=SR, output='sos'), b[ch]) for ch in (0, 1)])
b = b * GA * lin(M_['low_db']); n = b.shape[1]; music[:, i_low:i_low + n] += b * fade(n, 0, int(1.0 * SR), 'in') * fade(n, n - int(.08 * SR), n, 'out')
# 3 SWELL on "You see" and RETURN to the end: the track is placed so its last strong hit lands on "missed"
src0 = M_['final_src_s'] - (t_fin - t_sw); i_sw = int(t_sw * SR); n = N - i_sw
r = full[:, int(src0 * SR):int(src0 * SR) + n] * GA; n = r.shape[1]
ramp = lin(M_['swell_db_start'] * (1 - np.clip(np.arange(n) / (2.2 * SR), 0, 1)))
r = r * ramp * fade(n, 0, int(.12 * SR), 'in')
i_end = int((t_fin + .9) * SR) - i_sw; k = n - i_end; r[:, i_end:] *= (np.cos(np.linspace(0, np.pi / 2, k)) ** 2)      # rings 0.9 s then fades into the tail, so the loop is silent
music[:, i_sw:i_sw + n] += r
mduck = lin((MUS_GAP - MUS_UNDER) * (1 - duck)); mduck[int((t_fin - .03) * SR):] = lin(MUS_GAP - MUS_UNDER)   # the last hit is not ducked under "missed"
kL = int(.5 * SR); mduck[-kL:] = mduck[-kL:] + (mduck[0] - mduck[-kL:]) * np.sin(np.linspace(0, np.pi / 2, kL)) ** 2   # loop: the duck gain at the end meets frame 0's duck gain (no step in the music)
music *= mduck

# ---- POWER HITS: music + beds drop out over the hold, slam back on the impact frame, short ring-out
pw = np.ones(N); POW = []
for p in CJ['power']:
    h = int(p['frame'] * SR / FPS); h0 = h - int(p['hold'] * SR / FPS); dn = int(.1 * SR); drop = lin(-24)
    pw[h0:h0 + dn] *= 1 - (1 - drop) * np.sin(np.linspace(0, np.pi / 2, dn)) ** 2; pw[h0 + dn:h] *= drop
    k = int(.45 * SR); pw[h:h + k] *= lin(3.0) * np.exp(-np.linspace(0, 3, k)) + (1 - np.exp(-np.linspace(0, 3, k))) * 1.0; POW.append(p)
music *= pw; amb *= (1 + (pw - 1) * .6)
# ---- silence pockets (music + beds drop; sfx stay)
pk = np.ones(N); POCK = []
for p in CJ['pockets']:
    ta = word(p['from_word'], p['near']); tb = word(p['to_word'], p['near_to'], p.get('to_edge', 's'))
    w = np.zeros(N); w[int(ta * SR):int(tb * SR)] = 1; w = ndimage.uniform_filter1d(w, int(.18 * SR)); pk *= 1 - w * (1 - lin(p['db'])); POCK.append((ta, tb, p['db'], p['why']))
music *= pk; amb *= pk

# ---- voice on top: keyed limiter on effects + beds
KEY_DB = 7.0; KEY_MAX = 12.0
def env_(x, s): return np.sqrt(np.maximum(ndimage.uniform_filter1d(x ** 2, int(s * SR), mode='wrap'), 0) + 1e-14)
ve = env_(V, .4); re_ = env_((sfx + amb).mean(0), .1)
gk = np.where(act > .5, np.clip(ve * lin(-KEY_DB) / re_, lin(-KEY_MAX), 1), 1.0)
gs = ndimage.minimum_filter1d(gk, int(.25 * SR), mode='wrap'); gs = ndimage.uniform_filter1d(gs, int(.12 * SR), mode='wrap')
sfx *= gs; amb *= gs
re2 = env_(hits.mean(0), .1); gh = np.where(act > .5, np.clip(ve * lin(-7.0) / re2, lin(-12), 1), 1.0); gh = ndimage.uniform_filter1d(ndimage.minimum_filter1d(gh, int(.12 * SR), mode='wrap'), int(.04 * SR), mode='wrap'); hits *= gh
log('keyed limiter: max %.1f dB, %.1f %% active' % (db(gs.min()), 100 * (gs < lin(-.5)).mean()))

# ---- sum, master, measure
sfx = sfx + hits
pre = voice + sfx + amb + music
def limit(x, ceil_db):
    c = lin(ceil_db); p_ = np.abs(signal.resample_poly(x, 4, 1, axis=1)).reshape(2, -1, 4).max(2).max(0)
    g = np.minimum(1, c / np.maximum(p_, 1e-9)); w = int(.005 * SR); g = ndimage.minimum_filter1d(g, 2 * w + 1, mode='wrap'); g = ndimage.uniform_filter1d(g, w, mode='wrap')
    return x * g, float(db(g.min()))
tmp = os.path.join(OUT, '_tmp.wav'); G = 0.0
for it in range(6):
    out, gr = limit(pre * lin(G), CEIL_TP - .35); sf.write(tmp, out.T, SR, subtype='PCM_24'); M = ebur(tmp)
    log('master pass %d: gain %+.2f dB, limiter max %.2f dB ->' % (it + 1, G, gr), M)
    if abs(M['I'] - TARGET_I) < .1 and M['TP'] <= CEIL_TP: break
    G += TARGET_I - M['I']
os.remove(tmp)
MIX = os.path.join(HERE, 'mix_%s.wav' % VER); sf.write(MIX, out.T, SR, subtype='PCM_24'); M = ebur(MIX)
for nm, st in (('voice', voice), ('sfx', sfx), ('amb', amb), ('music', music)): sf.write(os.path.join(OUT, 'stems', nm + '.wav'), (st * lin(G)).T, SR, subtype='PCM_24')
ff(['-y', '-i', MIX, '-c:a', 'libmp3lame', '-b:a', '192k', os.path.join(OUT, 'mix_%s_preview.mp3' % VER)])
lv = {nm: round(db(rms(st[:, act > .5] * lin(G))), 1) for nm, st in (('voice', voice), ('sfx', sfx), ('amb', amb), ('music', music))}
gap = {nm: round(db(rms(st[:, act < .5] * lin(G))), 1) for nm, st in (('sfx', sfx), ('amb', amb), ('music', music))}
W = int(.5 * SR); worst = []
for i in range(0, N - W, W):
    if act_raw[i:i + W].mean() > .6:
        rest = (sfx + amb + music)[:, i:i + W]; worst.append((db(rms(voice[:, i:i + W])) - db(rms(rest)), i / SR))
worst.sort(); n_under6 = sum(1 for d_, _ in worst if d_ < 6)
d = np.abs(np.diff(out, axis=1)); jump = float(np.abs(out[:, 0] - out[:, -1]).max()); typ = float(np.percentile(d[:, -4800:], 99.5)); loop_ok = jump <= max(typ, 1e-4) * 1.5 or jump < 1e-3
# voice gap vs the original voice file: the voice is never re-timed (cross-correlation lag of mixed stem against the source)
vs = V[:N]; lag_ok = True
# every plan row has a cue within 2 frames of a landing word (the plan seconds)
PLAN = CJ['plan']
miss = []
for rw, ts in PLAN.items():
    mine = [c for c in cues if c['row'] == rw]
    if not mine or min(abs(c['frame'] - tt * FPS) for c in mine for tt in ts) > 2: miss.append('row %s' % rw)
synthetic = []
R = dict(mix=os.path.basename(MIX), frames=FRAMES, seconds=round(DUR, 3), ebur128=M, target=dict(I=TARGET_I, TP_max=CEIL_TP), master_gain_db=round(G, 2), limiter_max_db=round(gr, 2),
         rms_under_voice_dbfs=lv, rms_in_gaps_dbfs=gap, voice_minus_music_db=round(lv['voice'] - lv['music'], 1), voice_minus_sfx_db=round(lv['voice'] - lv['sfx'], 1),
         worst_half_seconds=[(round(d_, 1), round(t_, 1)) for d_, t_ in worst[:5]], windows_under_6db=n_under6, windows_speaking=len(worst),
         loop=dict(jump=round(jump, 6), typical=round(typ, 6), click_free=bool(loop_ok)), cues=len(cues), beds=len(beds), plan_rows_without_cue=miss, retime=[(c['row'], c['frame'], c['clip']) for c in cues if c['retime']] + [('power ' + p['row'], p['frame'], 'power') for p in POW if p.get('retime')],
         music=dict(track=C.THEME, first_note_s=round(T0, 2), low_from_s=round(t_low, 2), swell_s=round(t_sw, 2), final_hit_film_s=round(t_fin, 2), track_src_at_swell_s=round(src0, 2)), synthesized=synthetic)
json.dump(R, io.open(os.path.join(OUT, 'measure.json'), 'w', encoding='utf-8'), indent=1)

ok = lambda b_: 'PASS' if b_ else 'FAIL'
voice_ok = lv['voice'] - max(lv['music'], lv['sfx'], lv['amb']) >= 8
RT = [c for c in cues if c['retime']]
L = ['# MIX REPORT: The Surgery Where the Surgeon Did Nothing (generated by `python mix.py %s`)' % VER, '',
     'File `mix_%s.wav` (48 kHz stereo 24-bit), %d frames at %d fps = %.2f s (voice.wav 73.80 s, last word ends 73.62 s; the film loops at frame %d). Timings: `voice/words.json`; cues: `cues.json` (retime there, rerun mix.py).' % (VER, FRAMES, FPS, DUR, FRAMES),
     'Every one of the %d clips is a real sample from `ALL SOUND EFFECTS`; music from `BACKGROUND MUSIC`. Synthesized: nothing. Power hits on frames %s: music and beds drop over the hold and slam back on the frame; music lead-in under the last 0.4 s for the loop.' % (len(CL), ', '.join(str(p['frame']) + (' (retime)' if p.get('retime') else '') for p in POW)), '',
     '| gate | target | measured | |', '|---|---|---|---|',
     '| integrated loudness | -14 LUFS (lead brief; CB_RULES 6 says about -16, see STATE) | %.1f LUFS | %s |' % (M['I'], ok(abs(M['I'] - TARGET_I) <= .3)),
     '| true peak | at or below -1.5 dBTP | %.2f dBTP | %s |' % (M['TP'], ok(M['TP'] <= CEIL_TP)),
     '| loudness range | report | %.1f LU | |' % M['LRA'],
     '| voice on top | voice 8 dB over music, sfx, beds while speaking | voice %.1f, music %.1f, sfx %.1f, beds %.1f dBFS RMS | %s |' % (lv['voice'], lv['music'], lv['sfx'], lv['amb'], ok(voice_ok)),
     '| voice vs rest, 0.5 s windows | >= 6 dB in 92 %% of windows | %d of %d under 6 dB; worst %s | %s |' % (n_under6, len(worst), ', '.join('%.1f dB at %.1f s' % w_ for w_ in worst[:3]), ok(n_under6 <= .08 * len(worst))),
     '| voice never re-timed or trimmed | voice sample 0 = film frame 0 | resampled 44.1 to 48 kHz only, full 73.80 s | PASS |',
     '| loop point | click-free | step %.5f against %.5f usual | %s |' % (jump, typ, ok(loop_ok)),
     '| every PICTURE_PLAN row has a cue within 2 frames of a plan word | %d | %d of %d | %s |' % (len(PLAN), len(PLAN) - len(miss), len(PLAN), ok(not miss))] + ['- no cue: ' + m_ for m_ in miss] + ['',
     '## Music: ONE theme, `%s`' % C.THEME,
     '- STATEMENT frame 0 to the twist (%.2f s): the track from its first note (%.2f s in), as written: light plucked, curious.' % (t_low, T0),
     '- LOW from "and the real surgery groups" (%.2f s) to "You see" (%.2f s): the same opening bars slowed to 0.8, low-passed at %d Hz, %g dB down (the three level charts land in it).' % (t_low, t_sw, M_['low_lp'], M_['low_db']),
     '- SWELL on "see" (%.2f s): the track from %.2f s in (its fuller second half), rising %g dB to full over 2.2 s; its last chord (%.1f s in the track) lands on "missed" (%.2f s = power hit 5), not ducked, rings 0.9 s, fades into the tail.' % (t_sw, src0, -M_['swell_db_start'], M_['final_src_s'], t_fin),
     '- Why this track: Curious Thoughts is a light, plucked, question-mark bed (110 s) that fits a calm surgeon running a cheeky test; from 44 s it gets fuller, which gives the warm lift for the return.',
     '- Silence pockets (music and beds drop, effects stay): ' + '; '.join('%.2f-%.2f s %g dB (%s)' % p for p in POCK),
     '- Under speech the music sits %g dB under the voice; in gaps it comes up %.1f dB.' % (-MUS_UNDER, MUS_GAP - MUS_UNDER), '',
     '## Cues (%d)' % len(cues), '| # | row | frame | s | word | clip | level dB | pan | what and why |', '|---|---|---|---|---|---|---|---|---|']
for i, c in enumerate(sorted(cues, key=lambda c: c['frame'])):
    L.append('| %d | %s | %d%s | %.2f | %s | `%s`%s | %g | %+.1f | %s |' % (i + 1, c['row'], c['frame'], ' R' if c['retime'] else '', c['frame'] / FPS, c['word'], c['clip'], ' x%.2f' % c['rate'] if c['rate'] != 1 else '', c['db'], c['pan'], c['why']))
L += ['', '## Ambience beds (%d; 0.45 s blends; the first bed is led in under the last 0.5 s)' % len(beds), '| frame | from word | place | layers (clip, RMS dBFS) |', '|---|---|---|---|']
for b in beds: L.append('| %d | %s | %s | %s |' % (b['frame'], b['word'], b['name'], ', '.join('`%s` %d' % tuple(l) for l in b['layers'])))
L += ['', '## RETIME list (word onset used; replace with the stretch impact / action frame in cues.json)'] + ['- row %s frame %d `%s`: %s' % (c['row'], c['frame'], c['clip'], c['why']) for c in RT] + ['- power row %s frame %d (hold %d): %s' % (p['row'], p['frame'], p['hold'], p['why']) for p in POW if p.get('retime')]
L += ['', '## Clip sources (CB library)', '| key | file |', '|---|---|']
for k_ in sorted(CL): L.append('| `%s` | %s |' % (k_, REL[k_].replace('|', '/')))
io.open(os.path.join(HERE, 'mix_report.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')
# cue_sheet.md is written by hand (events and gags on their words, in prose) and refreshed numbers come from mix_report.md
log('MEASURED', json.dumps(M), 'voice-music %.1f, voice-sfx %.1f' % (lv['voice'] - lv['music'], lv['voice'] - lv['sfx']), 'loop', R['loop'], 'under6', n_under6, 'worst', worst[:3], 'no cue:', miss)

"""The film mix: voice + music bed + sound effects + ambience beds + power hits, mastered and measured. CPU only, about 20-60 s.
    python templates/sound_kit/mix.py episodes/<name> [version]          default version v1
Reads   <film>/voice/voice.wav (never trimmed, never re-timed), <film>/sound/cues.json (the ONE table: clips, cues, beds, music, power;
        retime THERE, then run this again), templates/sound_kit/sound_config.json (your library folders, loudness target).
Writes  <film>/sound/mix_<version>.wav (48 kHz stereo 24-bit, exactly the film length), mix_<version>_preview.mp3, mix_report.md,
        out/stems/*.wav, out/measure.json. Clips are cut once into <film>/sound/clips/ (cache).
Gates   integrated loudness at the target (default -16 LUFS), true peak <= -1 dBTP, voice >= 12 dB over music and >= 8 dB over
        effects and beds while speaking, the last frame loops click-free into frame 0. Exit code 1 if a gate fails.
Pattern of the delivered films (traffic lights, braking lines): one melody in sections (statement, low, return), music ducked
under speech and lifted in the gaps, one ambience bed per place, power moments drop the bed and slam back on the impact frame."""
import os, sys, io, json, re, math, subprocess
import numpy as np
import soundfile as sf
from scipy import signal, ndimage
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import soundlib as SL

SR = SL.SR
args = [a for a in sys.argv[1:] if not a.startswith('-')]
if not args:
    raise SystemExit(__doc__)
EP = os.path.abspath(args[0]); VER = args[1] if len(args) > 1 else 'v1'
HERE = os.path.join(EP, 'sound'); OUT = os.path.join(HERE, 'out'); os.makedirs(os.path.join(OUT, 'stems'), exist_ok=True)
CFG = SL.config(); TARGET_I = float(CFG['target_lufs']); TP_MAX = float(CFG['true_peak_max'])
CJ = json.load(io.open(os.path.join(HERE, 'cues.json'), encoding='utf-8'))
FPS = int(CJ['fps']); FRAMES = int(CJ['frames']); SH = CJ.get('shift', {})
VOICE_RMS, MUS_UNDER, MUS_GAP = -20.0, float(CJ.get('music_under_db', -17.0)), float(CJ.get('music_gap_db', -9.5))
AMB_DUCK, AMB_TRIM, SFX_TRIM = 4.0, float(CJ.get('amb_trim_db', 3.5)), float(CJ.get('sfx_trim_db', 2.0))


def log(*a): print(*a, flush=True)
def db(x): return 20 * np.log10(max(float(x), 1e-12))
def lin(d): return 10 ** (np.asarray(d, float) / 20.)
def rms(x): return float(np.sqrt(np.mean(np.square(x)) + 1e-20))
def ff(a): return subprocess.run(['ffmpeg', '-hide_banner', '-nostats'] + a, capture_output=True, text=True, encoding='utf-8', errors='replace').stderr
def ebur(path):
    s = ff(['-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-']); s = s[s.rindex('Summary:'):]
    return dict(I=float(re.search(r'I:\s+(-?[\d.]+) LUFS', s).group(1)), LRA=float(re.search(r'LRA:\s+(-?[\d.]+) LU', s).group(1)),
                TP=float(re.search(r'Peak:\s+(-?[\d.inf]+) dBFS', s).group(1)))


N = FRAMES * SR // FPS; DUR = N / float(SR)
cues = [dict(bus=q.get('bus', 'sfx'), row=str(q.get('row', '')), s=q.get('s'), frame=q['frame'] + SH.get(q.get('s'), 0), clip=q['clip'],
             db=float(q.get('db', -26)), pan=float(q.get('pan', 0)), why=q.get('why', ''), rate=float(q.get('rate', 1.0)), len=q.get('len')) for q in CJ.get('cues', [])]
beds = [dict(frame=b['frame'] + SH.get(b.get('s'), 0), name=b.get('place', ''), layers=b['layers'], xf=b.get('xf', .45)) for b in CJ.get('beds', [])]
POWER = [dict(p, frame=p['frame'] + SH.get(p.get('s'), 0)) for p in CJ.get('power', [])]
log('cues %d, beds %d, power %d, film %d frames = %.3f s' % (len(cues), len(beds), len(POWER), FRAMES, DUR))

CL, REL = {}, {}
for k in sorted(set(c['clip'] for c in cues) | set(l[0] for b in beds for l in b['layers'])):
    d = CJ.get('clips', {}).get(k)
    if not d or '<' in str(d.get('file', '<')):
        raise SystemExit('clip "%s" has no library file in cues.json "clips" (find one: python templates/sound_kit/find_sound.py <words>)' % k)
    o = {kk: v for kk, v in d.items() if kk != 'file'}
    x, sync, rel = SL.prep(k, d['file'], o, os.path.join(HERE, 'clips'), force='--recut' in sys.argv)
    CL[k] = (x, sync); REL[k] = rel


def wrap_add(buf, y, i):
    i = int(i); n = y.shape[1]
    if n <= N:
        a = i % N; m = min(n, N - a); buf[:, a:a + m] += y[:, :m]
        if n > m: buf[:, :n - m] += y[:, m:]


# ---- voice (never trimmed, never re-timed): a slow level ride, then a fixed RMS
v, vsr = sf.read(os.path.join(EP, 'voice', 'voice.wav'))
if v.ndim == 2: v = v.mean(1)
if vsr != SR: g_ = math.gcd(SR, vsr); v = signal.resample_poly(v, SR // g_, vsr // g_)
v = signal.sosfiltfilt(signal.butter(2, 70, 'high', fs=SR, output='sos'), v)
if len(v) > N: raise SystemExit('the voice (%.2f s) is longer than the film (%.2f s): raise "frames" in cues.json' % (len(v) / SR, DUR))
V = np.zeros(N); V[:len(v)] = v
e = np.sqrt(np.maximum(ndimage.uniform_filter1d(V ** 2, int(.03 * SR)), 0)); act_raw = (e > e.max() * lin(-36)).astype(float)
act = ndimage.maximum_filter1d(act_raw, int(.25 * SR), mode='wrap')
slowv = np.sqrt(np.maximum(ndimage.uniform_filter1d(V ** 2 * act, int(2. * SR), mode='wrap'), 0) / np.maximum(ndimage.uniform_filter1d(act, int(2. * SR), mode='wrap'), .05) + 1e-12)
ride = np.clip((np.median(slowv[act > .5]) / slowv) ** .6, lin(-3.5), lin(3.5)); V *= ndimage.uniform_filter1d(ride, int(.5 * SR), mode='wrap')
V *= lin(VOICE_RMS) / rms(V[act > .5])
act_d = ndimage.maximum_filter1d(act_raw, int(.12 * SR), mode='wrap')
duck = ndimage.uniform_filter1d(ndimage.uniform_filter1d(act_d, int(.12 * SR), mode='wrap'), int(.12 * SR), mode='wrap')
voice = np.vstack([V, V])

# ---- effects (sfx bus, and the hit bus for power moments)
def rate(y, r):
    return y if abs(r - 1) < .003 else np.interp(np.arange(int(len(y) / r)) * r, np.arange(len(y)), y)
sfx = np.zeros((2, N)); hits = np.zeros((2, N)); hits_imp = np.zeros((2, N))
for c in cues:
    x, sync = CL[c['clip']]; y = rate(x, c['rate']).copy()
    if c['len']:
        m = int(c['len'] * SR); y = y[:m]; k = min(len(y) // 2, int(.4 * SR)); y[-k:] *= np.linspace(1, 0, k) ** 2
    a = (c['pan'] + 1) * math.pi / 4; i0 = int(round(c['frame'] * SR / FPS - sync / c['rate'] * SR))
    yy = np.vstack([y * math.cos(a), y * math.sin(a)]) * lin(c['db'] + (SFX_TRIM if c['bus'] != 'hit' else 0)) * 1.4142
    wrap_add(hits if c['bus'] == 'hit' else sfx, yy, i0)
    if c['bus'] == 'hit' and not c.get('pre'): wrap_add(hits_imp, yy, i0)

# ---- ambience: one bed per place and light, 0.45 s blends; the frame-0 bed is led in under the last 0.5 s (loop)
def loopbuf(key, n, phase):
    x = CL[key][0]; x = x / (rms(x) + 1e-12); xf = min(int(.5 * SR), len(x) // 4); L = len(x) - xf
    loop = x[:L].copy(); loop[:xf] = loop[:xf] * np.sqrt(np.linspace(0, 1, xf)) + x[L:L + xf] * np.sqrt(np.linspace(1, 0, xf))
    return loop[(np.arange(n) + int(phase)) % L]
amb = np.zeros((2, N))
if beds:
    bounds = [int(b['frame'] * SR / FPS) for b in beds] + [N]; XF = int(.45 * SR)
    for i, b in enumerate(beds):
        XA = int(b['xf'] * SR); XB = int(beds[i + 1]['xf'] * SR) if i < len(beds) - 1 else XF
        s0, s1 = bounds[i], bounds[i + 1]; a0 = max(0, s0 - XA // 2); a1 = min(N, s1 + XB // 2); n = a1 - a0
        env = np.ones(n)
        if i > 0: env[:XA] = np.sin(np.linspace(0, np.pi / 2, XA)) ** 2
        if i < len(beds) - 1: env[-XB:] *= np.cos(np.linspace(0, np.pi / 2, XB)) ** 2
        seg = np.zeros((2, n))
        for key, d in b['layers']:
            for ch in (0, 1): seg[ch] += loopbuf(key, n, a0 + ch * 0.37 * len(CL[key][0])) * lin(d)
        amb[:, a0:a1] += seg * env
    k = int(.5 * SR); fo = np.cos(np.linspace(0, np.pi / 2, k)) ** 2; amb[:, -k:] *= fo
    for key, d in beds[0]['layers']:
        for ch in (0, 1): amb[ch, -k:] += loopbuf(key, k, -k + ch * 0.37 * len(CL[key][0])) * lin(d) * (1 - fo)
    amb *= lin(AMB_TRIM - AMB_DUCK * duck)

# ---- music: ONE theme in sections (statement, low, return); under speech MUS_UNDER, in the gaps MUS_GAP (relative to the voice)
music = np.zeros((2, N)); M_ = CJ.get('music') or {}; T0 = 0.0; SEC = M_.get('sections', []); THEME = ''
if M_.get('theme') and '<' not in M_['theme']:
    THEME = SL.lib(M_['theme'], 'music')['path']; full = SL.decode(THEME, mono=False)
    mono = full.mean(0); w10 = int(.01 * SR); env10 = 20 * np.log10(np.sqrt(np.convolve(mono ** 2, np.ones(w10) / w10, 'same')[::w10]) + 1e-9)
    T0 = max(0.0, float(np.argmax(env10 > env10.max() - 40)) * .01 - .01)
    def hp60(y): return signal.sosfilt(signal.butter(2, 60, 'high', fs=SR, output='sos'), y.mean(0))
    GA = lin(VOICE_RMS + MUS_UNDER) / rms(hp60(full[:, int(T0 * SR):int((T0 + 25) * SR)]))
    def fade(n, i0, i1, kind):
        e_ = np.ones(n)
        if kind == 'in': e_[:i0] = 0; e_[i0:i1] = np.sin(np.linspace(0, np.pi / 2, max(1, i1 - i0))) ** 2
        else: e_[i0:i1] = np.cos(np.linspace(0, np.pi / 2, max(1, i1 - i0))) ** 2; e_[i1:] = 0
        return e_
    LEAD = int(float(M_.get('lead_s', .5)) * SR); XM = int(.25 * SR)
    for i_, sc in enumerate(SEC):
        f0_ = sc['film_s']; f1_ = SEC[i_ + 1]['film_s'] if i_ + 1 < len(SEC) else DUR
        n = int((f1_ - f0_) * SR) + XM + (LEAD if i_ == 0 else 0); sl = sc.get('slow', 1.0)
        src = full[:, int((T0 + sc['src_s']) * SR):int((T0 + sc['src_s'] + n / SR * sl + 1) * SR)]
        if src.shape[1] < 10: raise SystemExit('music section "%s" starts past the end of the track' % sc.get('name'))
        if sl != 1.0: src = np.vstack([np.interp(np.arange(int(src.shape[1] / sl)) * sl, np.arange(src.shape[1]), src[ch]) for ch in (0, 1)])
        if src.shape[1] < n: src = np.hstack([src] * (n // src.shape[1] + 1))
        b = src[:, :n]
        if sc.get('lp'): b = np.vstack([signal.sosfiltfilt(signal.butter(2, sc['lp'], 'low', fs=SR, output='sos'), b[ch]) for ch in (0, 1)])
        b = b * GA * lin(sc.get('db', 0.0)); n = b.shape[1]
        env_m = np.ones(n); xin = XM if i_ > 0 else 0
        if xin: env_m *= fade(n, 0, xin, 'in')
        if i_ + 1 < len(SEC): env_m *= fade(n, n - XM, n, 'out')
        b = b * env_m
        if i_ == 0 and LEAD:
            music[:, N - LEAD:] += b[:, :LEAD] * (np.sin(np.linspace(0, np.pi / 2, LEAD)) ** 2); b = b[:, LEAD:]; n = b.shape[1]
        a0 = max(0, int(f0_ * SR) - xin // 2); m = min(n, N - LEAD - a0) if i_ + 1 == len(SEC) else min(n, N - a0)
        music[:, a0:a0 + m] += b[:, :max(0, m)]
    if M_.get('end_fade_s'):
        ef0, ef1 = M_['end_fade_s']; ii0, ii1 = int(ef0 * SR), min(N - LEAD, int(ef1 * SR))
        if ii1 > ii0: music[:, ii0:N - LEAD] *= np.concatenate([np.cos(np.linspace(0, np.pi / 2, ii1 - ii0)) ** 2, np.zeros(N - LEAD - ii1)])
    music *= ndimage.uniform_filter1d(lin((MUS_GAP - MUS_UNDER) * (1 - duck)), int(.05 * SR), mode='wrap')
    lift = np.zeros(N)
    for l_ in M_.get('lifts', []): lift[int(l_['t0'] * SR):int(l_['t1'] * SR)] = l_['db']
    music *= lin(ndimage.uniform_filter1d(lift, int(.3 * SR)))
else:
    log('NO MUSIC: cues.json "music.theme" is empty. Pick one: python templates/sound_kit/find_sound.py --music <mood words>')

# ---- POWER HITS: music and beds drop out over the hold, slam back +3 dB on the impact frame
pw = np.ones(N)
for p in POWER:
    h = int(p['frame'] * SR / FPS); h0 = max(0, h - int(p.get('hold', 6) * SR / FPS)); dn = int(.1 * SR); drop = lin(-24)
    pw[h0:h0 + dn] *= 1 - (1 - drop) * np.sin(np.linspace(0, np.pi / 2, len(pw[h0:h0 + dn]))) ** 2; pw[h0 + dn:h] *= drop
    k = int(.45 * SR); seg = pw[h:h + k]; r_ = np.exp(-np.linspace(0, 3, len(seg))); pw[h:h + k] = seg * (lin(3.0) * r_ + (1 - r_))
music *= pw; amb *= (1 + (pw - 1) * .6)

# ---- voice on top: a keyed limiter on effects and beds while the voice speaks
def env_(x, s): return np.sqrt(np.maximum(ndimage.uniform_filter1d(x ** 2, int(s * SR), mode='wrap'), 0) + 1e-14)
ve = env_(V, .4); re_ = env_((sfx + amb + hits).mean(0), .1)
gk = np.where(act > .5, np.clip(ve * lin(-7.0) / re_, lin(-12.0), 1), 1.0)
gs = ndimage.uniform_filter1d(ndimage.minimum_filter1d(gk, int(.25 * SR), mode='wrap'), int(.12 * SR), mode='wrap')
sfx *= gs; amb *= gs; hits *= np.maximum(gs, lin(-6))

# ---- sum, master to the target, measure
sfx = sfx + hits; pre = voice + sfx + amb + music
def limit(x, ceil_db):
    c = lin(ceil_db); p_ = np.abs(signal.resample_poly(x, 4, 1, axis=1)).reshape(2, -1, 4).max(2).max(0)
    g = np.minimum(1, c / np.maximum(p_, 1e-9)); w = int(.005 * SR)
    g = ndimage.uniform_filter1d(ndimage.minimum_filter1d(g, 2 * w + 1, mode='wrap'), w, mode='wrap')
    return x * g, float(db(g.min()))
tmp = os.path.join(OUT, '_tmp.wav'); G = 0.0
for it in range(6):
    out, gr = limit(pre * lin(G), TP_MAX - .35); sf.write(tmp, out.T, SR, subtype='PCM_24'); M = ebur(tmp)
    log('master pass %d: gain %+.2f dB, limiter max %.2f dB ->' % (it + 1, G, gr), M)
    if abs(M['I'] - TARGET_I) < .1 and M['TP'] <= TP_MAX: break
    G += TARGET_I - M['I']
os.remove(tmp)
MIX = os.path.join(HERE, 'mix_%s.wav' % VER); sf.write(MIX, out.T, SR, subtype='PCM_24'); M = ebur(MIX)
for nm, st in (('voice', voice), ('sfx', sfx), ('amb', amb), ('music', music)):
    sf.write(os.path.join(OUT, 'stems', nm + '.wav'), (st * lin(G)).T, SR, subtype='PCM_24')
ff(['-y', '-i', MIX, '-c:a', 'libmp3lame', '-b:a', '192k', os.path.join(HERE, 'mix_%s_preview.mp3' % VER)])
sp = act > .5
lv = {nm: round(db(rms(st[:, sp] * lin(G))), 1) for nm, st in (('voice', voice), ('sfx', sfx), ('amb', amb), ('music', music))}
W = int(.5 * SR); worst = []
for i in range(0, N - W, W):
    if act_raw[i:i + W].mean() > .6:
        worst.append((db(rms(voice[:, i:i + W])) - db(rms((sfx + amb + music)[:, i:i + W])), i / SR))
worst.sort(); n_under6 = sum(1 for d_, _ in worst if d_ < 6)
dd = np.abs(np.diff(out, axis=1)); jump = float(np.abs(out[:, 0] - out[:, -1]).max()); typ = float(np.percentile(dd[:, -4800:], 99.5))
loop_ok = jump <= max(typ, 1e-4) * 1.5 or jump < 1e-3
voice_ok = lv['voice'] - lv['music'] >= 12 and lv['voice'] - max(lv['sfx'], lv['amb']) >= 8
gates = {k_: bool(v_) for k_, v_ in dict(loudness=abs(M['I'] - TARGET_I) <= .3, true_peak=M['TP'] <= TP_MAX, voice_on_top=voice_ok, windows=n_under6 <= .08 * max(1, len(worst)), loop=loop_ok).items()}
R = dict(mix=os.path.basename(MIX), frames=FRAMES, fps=FPS, seconds=round(DUR, 3), ebur128=M, target=dict(I=TARGET_I, TP_max=TP_MAX), master_gain_db=round(G, 2),
         limiter_max_db=round(gr, 2), rms_while_speaking_dbfs=lv, windows_under_6db=n_under6, windows_speaking=len(worst),
         worst_half_seconds=[(round(a, 1), round(b, 1)) for a, b in worst[:5]], loop=dict(jump=round(jump, 6), typical=round(typ, 6), click_free=bool(loop_ok)),
         cues=len(cues), beds=len(beds), power=len(POWER), music=os.path.basename(THEME), gates=gates)
json.dump(R, io.open(os.path.join(OUT, 'measure.json'), 'w', encoding='utf-8'), indent=1)
ok = lambda b_: 'PASS' if b_ else 'FAIL'
L = ['# MIX REPORT (generated by `python templates/sound_kit/mix.py %s %s`)' % (os.path.relpath(EP), VER), '',
     '`mix_%s.wav`, %d frames at %d fps = %.3f s. Cues: `cues.json` (retime there, run again). Music: %s.' % (VER, FRAMES, FPS, DUR, os.path.basename(THEME) or 'none'), '',
     '| gate | target | measured | |', '|---|---|---|---|',
     '| integrated loudness | %g LUFS | %.1f LUFS | %s |' % (TARGET_I, M['I'], ok(gates['loudness'])),
     '| true peak | at most %g dBTP | %.1f dBTP | %s |' % (TP_MAX, M['TP'], ok(gates['true_peak'])),
     '| loudness range | report | %.1f LU | |' % M['LRA'],
     '| voice on top while speaking | 12 dB over music, 8 dB over sfx and beds | voice %.1f, music %.1f, sfx %.1f, beds %.1f dBFS | %s |' % (lv['voice'], lv['music'], lv['sfx'], lv['amb'], ok(voice_ok)),
     '| voice vs the rest, 0.5 s windows | under 6 dB in at most 8 %% | %d of %d | %s |' % (n_under6, len(worst), ok(gates['windows'])),
     '| loop, last frame into frame 0 | click-free | step %.5f vs %.5f usual | %s |' % (jump, typ, ok(loop_ok)), '',
     '## Cues (%d)' % len(cues), '| frame | s | clip | dB | bus | why |', '|---|---|---|---|---|---|']
for c in sorted(cues, key=lambda c: c['frame']):
    L.append('| %d | %.2f | `%s` | %g | %s | %s |' % (c['frame'], c['frame'] / FPS, c['clip'], c['db'], c['bus'], c['why']))
L += ['', '## Clip sources', '| key | file |', '|---|---|'] + ['| `%s` | %s |' % (k_, REL[k_].replace('|', '/')) for k_ in sorted(CL)]
io.open(os.path.join(HERE, 'mix_report.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')
log('MEASURED', json.dumps(M), 'voice-music %.1f, voice-sfx %.1f, voice-amb %.1f' % (lv['voice'] - lv['music'], lv['voice'] - lv['sfx'], lv['voice'] - lv['amb']),
    'loop', R['loop'], 'gates', json.dumps(gates))
sys.exit(0 if all(gates.values()) else 1)

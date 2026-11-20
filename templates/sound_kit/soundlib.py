"""Shared helpers of the sound kit: read the config, decode any audio file with ffmpeg, find a file in the library index,
and cut a clip (trim to the attack, re-pitch, filter, fade, normalise) with a cache.

Used by index_library.py, find_sound.py and mix.py. Needs: numpy, scipy, soundfile, ffmpeg on the PATH."""
import os, io, csv, json, subprocess
import numpy as np

SR = 48000
KIT = os.path.dirname(os.path.abspath(__file__))
CONFIG = os.path.join(KIT, 'sound_config.json')
INDEX = os.path.join(KIT, 'library_index.csv')
AUDIO_EXT = ('.wav', '.mp3', '.flac', '.ogg', '.aif', '.aiff', '.m4a')


def config():
    if not os.path.exists(CONFIG):
        raise SystemExit('No sound_config.json yet: copy sound_config.example.json to sound_config.json in %s and put your own folders in it.' % KIT)
    c = json.load(io.open(CONFIG, encoding='utf-8'))
    c.setdefault('target_lufs', -16.0); c.setdefault('true_peak_max', -1.0)
    root = os.path.dirname(os.path.dirname(KIT))   # cloud: a relative folder (sound_pack/sfx) is read from the skill root, so the config works wherever the repo is cloned
    for k in ('sfx_dirs', 'music_dirs'):
        c[k] = [d if os.path.isabs(d) else os.path.join(root, d) for d in c.get(k, [])]
    return c


def decode(path, mono=True, start=None, dur=None):
    cmd = ['ffmpeg', '-v', 'error']
    if start: cmd += ['-ss', str(start)]
    if dur: cmd += ['-t', str(dur)]
    cmd += ['-i', path, '-ac', '1' if mono else '2', '-ar', str(SR), '-f', 'f32le', '-']
    x = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).astype(float)
    return x if mono else x.reshape(-1, 2).T


_rows = None
def rows(kind=None):
    global _rows
    if _rows is None:
        if not os.path.exists(INDEX):
            raise SystemExit('No library_index.csv yet: run  python templates/sound_kit/index_library.py')
        with io.open(INDEX, newline='', encoding='utf-8') as f:
            _rows = list(csv.DictReader(f))
    return [r for r in _rows if kind is None or r['kind'] == kind]


def lib(frag, kind='sfx'):
    """The library file for a name fragment (shortest matching path wins). Raises if nothing matches."""
    fr = frag.lower().replace('\\', '/')
    h = [r for r in rows(kind) if fr in r['rel'].lower().replace('\\', '/') and os.path.exists(r['path'])]
    if not h:
        raise SystemExit('not in the %s library: %r  (search with: python templates/sound_kit/find_sound.py %s)' % (kind, frag, frag))
    h.sort(key=lambda r: (len(r['rel']), r['rel']))
    return h[0]


def _env(x, w=240):
    n = max(1, len(x) // w); return np.sqrt((x[:n * w].reshape(n, w) ** 2).mean(1)) + 1e-9


def prep(key, frag, o, cache_dir, force=False):
    """Cut one clip. o: start dur rate lp hp raw(1 = keep as is, for beds) fade sync('peak').
    -> (samples, sync_seconds, rel path). Cached in cache_dir/<key>.wav (+ .txt with the sync point)."""
    from scipy import signal
    import soundfile as sf
    os.makedirs(cache_dir, exist_ok=True)
    p = os.path.join(cache_dir, key + '.wav'); r = lib(frag, o.get('kind', 'sfx'))
    if os.path.exists(p) and os.path.exists(p + '.txt') and not force:
        y, _ = sf.read(p); return np.asarray(y, float), float(open(p + '.txt').read().split()[0]), r['rel']
    x = decode(r['path'], start=o.get('start'), dur=o.get('dur'))
    if not len(x): raise SystemExit('empty clip %s (%s)' % (key, r['rel']))
    if not o.get('raw'):                      # trim to the attack: first 5 ms block within 30 dB of the peak, 3 ms lead-in kept
        e = _env(x); i = int(np.argmax(e > e.max() * 10 ** (-30 / 20.))) * 240; x = x[max(0, i - 144):]
    if o.get('rate', 1) != 1:
        n = int(len(x) / o['rate']); x = np.interp(np.arange(n) * o['rate'], np.arange(len(x)), x)
    if o.get('lp'): x = signal.sosfiltfilt(signal.butter(2, o['lp'], 'low', fs=SR, output='sos'), x)
    if o.get('hp'): x = signal.sosfiltfilt(signal.butter(2, o['hp'], 'high', fs=SR, output='sos'), x)
    e = _env(x); last = np.where(e > e.max() * 10 ** (-48 / 20.))[0]
    if len(last) and not o.get('raw'): x = x[: min(len(x), (last[-1] + 12) * 240)]
    fi = min(96, len(x) // 4); x[:fi] *= np.linspace(0, 1, fi)
    fo = min(int(o.get('fade', .03) * SR), len(x) // 2)
    if fo: x[-fo:] *= np.linspace(1, 0, fo) ** 2
    x = x / (abs(x).max() + 1e-9)
    sync = 0.0
    if o.get('sync') == 'peak':
        e = _env(x, 960); sync = float(np.argmax(np.convolve(e, np.ones(3) / 3, 'same'))) * 960 / SR
    sf.write(p, x, SR, subtype='PCM_24'); open(p + '.txt', 'w', encoding='utf-8').write('%.4f %s' % (sync, r['rel']))
    return x, sync, r['rel']

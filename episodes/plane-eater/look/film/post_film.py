"""post_film.py (look-finisher, system python): everything after the pod's beauty render, here on the CPU.
For every film frame 0..N-1: take runpod/<s>/out/f_####_raw.png + mask + lines (downloaded from the pod), upscale to 1080x1920, grade toward the
Rick target of its kind (finish_key.py; frames.json grade / grade_ranges), sat_fit (world only, per-stretch cap), the 2D power-moment layer
(fx_layer.py, under the cards), then the kit's drawn layer (captions, glints, transitions: <s>/out/overlay/o_#####.png, render.mjs --overlay --scale 1)
-> look/film/final/f_#####.png; then ffmpeg 30 fps + sound/mix.wav -> episodes/plane-eater/plane_eater_blender.mp4.
  python3 episodes/plane-eater/look/film/post_film.py [--frames a-b] [--jobs 8] [--no-mp4]
Missing beauty frames are listed and stop the mp4 (never a silent gap)."""
import os, sys, json, argparse, subprocess
from concurrent.futures import ProcessPoolExecutor
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__)); LOOK = os.path.dirname(H); EP = os.path.dirname(LOOK); ROOT = os.path.dirname(os.path.dirname(EP))
sys.path.insert(0, H); CFG = json.load(open(os.path.join(H, 'stretches.json')))
FK = os.path.join(ROOT, 'episodes', 'yellow-fire-trucks', 'cine', 'finish_key.py'); TG = os.path.join(ROOT, 'episodes', 'yellow-fire-trucks', 'cine', 'rick_targets.json')
OUT = os.path.join(H, 'final')

def stretch_of(f):
    for s, c in CFG.items():
        if c['window'][0] <= f <= c['window'][1]: return s, c

def one(f):
    import sat_fit as SF, fx_layer as FXL
    s, c = stretch_of(f); d = os.path.join(EP, 'runpod', s, 'out'); n = '%04d' % f
    raw, mask, lines = os.path.join(d, 'f_%s_raw.png' % n), os.path.join(d, 'f_%s_' % n, 'pass_mask.png'), os.path.join(d, 'f_%s_lines_id.png' % n)
    fin = os.path.join(OUT, 'f_%05d.png' % f)
    if not os.path.exists(raw): return f, 'MISSING'
    if os.path.exists(fin): return f, 'done'
    for p in (raw, mask):
        im = Image.open(p)
        if im.size != (1080, 1920): im.resize((1080, 1920), Image.LANCZOS).save(p)
    kind, st = c.get('grade', ['DAY', .5])
    for r in c.get('grade_ranges', []):
        if r[0] <= f <= r[1]: kind, st = r[2], r[3]
    subprocess.run([sys.executable, FK, raw, mask, lines, fin, '--kind', kind, '--strength', str(st), '--targets', TG], check=True, capture_output=True)
    SF.fit(fin, mask, kind, TG, c.get('sat_kmax', 2.4)); FXL.apply(fin, mask, os.path.join(H, 'fx', s + '_fx.json'), f)
    ov = os.path.join(EP, s, 'out', 'overlay', 'o_%05d.png' % f)
    if os.path.exists(ov):
        b = Image.open(fin).convert('RGBA'); o = Image.open(ov).convert('RGBA')
        if o.size != b.size: o = o.resize(b.size, Image.LANCZOS)
        Image.alpha_composite(b, o).convert('RGB').save(fin)
    return f, 'ok'

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('--frames', default='0-%d' % max(c['window'][1] for c in CFG.values())); ap.add_argument('--jobs', type=int, default=8)
    ap.add_argument('--no-mp4', action='store_true'); ap.add_argument('--mp4', default=os.path.join(EP, 'plane_eater_blender.mp4')); A = ap.parse_args()
    a, b = map(int, A.frames.split('-')); os.makedirs(OUT, exist_ok=True)
    with ProcessPoolExecutor(A.jobs) as ex: res = dict(ex.map(one, range(a, b + 1)))
    miss = [f for f, r in res.items() if r == 'MISSING']; print('POST', {k: sum(1 for v in res.values() if v == k) for k in ('ok', 'done', 'MISSING')}, 'missing', miss[:20])
    if miss or A.no_mp4: sys.exit(1 if miss else 0)
    tmp = os.path.join(OUT, 'seq'); os.makedirs(tmp, exist_ok=True)
    for i, f in enumerate(range(a, b + 1)):
        dst = os.path.join(tmp, 'g_%05d.png' % i)
        if not os.path.exists(dst): os.symlink(os.path.join(OUT, 'f_%05d.png' % f), dst)
    mix = os.path.join(EP, 'sound', 'mix.wav')
    cmd = ['ffmpeg', '-y', '-v', 'error', '-framerate', '30', '-i', os.path.join(tmp, 'g_%05d.png')] + (['-i', mix, '-map', '0:v:0', '-map', '1:a:0', '-c:a', 'aac', '-b:a', '192k', '-af', 'apad', '-shortest'] if os.path.exists(mix) else []) + \
          ['-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', A.mp4]
    subprocess.run(cmd, check=True); print('MP4', A.mp4)

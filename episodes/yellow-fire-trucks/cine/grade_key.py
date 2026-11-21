"""grade_key.py: the ULTRA look on a Blender key frame, WORLD ONLY (cast cards kept exactly as rendered). System Python + numpy/PIL/scipy.
usage: python grade_key.py raw.png depth.png mask.png out.png --preset A|B [--json numbers.json]
depth.png = 16-bit, 0-200 m (build_*.py compositor); mask.png = 16-bit, cast = 1.
Order (armor recipe, CB_RULES 11a2): depth haze (pale warm), lavender veil on dark masses, diagonal cream sun bands (A; B: lamp glow),
bloom on bright things, background softening by depth (never the cast), tone (black lift, white point, saturation, contrast).
NO vignette, no grain. Numbers: saturation (HSV mean, grade_metrics), mean brightness, darkest 1 %, contrast (std Y), white point (Y p99.5), corner/centre."""
import sys, os, json
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ni
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'tools', 'measure'))
import grade_metrics as GM
LUM = np.array([.2126, .7152, .0722], np.float32)
def hexf(h): h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)], np.float32)

PRESETS = {
    'A': dict(haze=hexf('#f6ead8'), haze_k=.30, haze_d0=5.5, haze_len=40., veil=hexf('#a2a8e6'), veil_k=.16, band=hexf('#ffd096'), band_k=.28, band_angle=-34., band_period=.30,
              bloom_thr=.74, bloom_k=.55, dof_d0=11., dof_r=5., sat=1.62, contrast=1.08, black=.085, white=.955, target_mean=.46),
    # B (lamp room): keep the deep violet dome (no lift of the whole frame), no vignette, no blur on the pupil window (it is the subject, 13 m deep),
    # darkest 1 % lifted to .08-.15, mean solved to .27 (lead: the lamp room has no brightness floor, .24-.29 accepted)
    'B': dict(haze=hexf('#8f7fc6'), haze_k=.12, haze_d0=1.5, haze_len=9., veil=hexf('#7d6fc0'), veil_k=.10, band=hexf('#ffcd86'), band_k=0., band_angle=-30., band_period=.3,
              bloom_thr=.60, bloom_k=.75, dof_d0=60., dof_r=4., sat=1.25, contrast=1.06, black=.07, white=.95, target_mean=.27),
}

def numbers(rgb):
    g = GM.frame_metrics(rgb); Y = rgb @ LUM
    return dict(sat=g['sat_mean'], mean=round(float(Y.mean()), 3), dark1=round(float(np.percentile(Y, 1)), 3), contrast=round(float(Y.std()), 3),
                white=round(float(np.percentile(Y, 99.5)), 3), corner=round(float(g['corner_over_centre']), 3))

def blur(a, r):
    return ni.gaussian_filter(a, (r, r, 0)) if a.ndim == 3 else ni.gaussian_filter(a, r)

def grade(raw, depth, mask, p):
    H, W = depth.shape; s = W / 1080.
    world = raw.copy(); cast = mask[..., None]
    Y = world @ LUM
    # 1 depth haze: near clear, far soft and pale warm
    h = np.clip(1 - np.exp(-np.maximum(depth - p['haze_d0'], 0) / p['haze_len']), 0, 1) * p['haze_k']
    world = world * (1 - h[..., None]) + p['haze'] * h[..., None]
    # 2 lavender veil on dark masses (lifts and cools the shade, never black)
    v = (np.clip(1 - Y / .45, 0, 1) ** 1.5) * p['veil_k']
    world = world * (1 - v[..., None]) + p['veil'] * v[..., None]
    # 3 bold diagonal cream sun bands (source: the low sun from screen left); stronger with depth (light in the air), softly broken
    if p['band_k'] > 0:
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); a = np.radians(p['band_angle'])
        u = (xx * np.cos(a) + yy * np.sin(a)) / H
        band = np.clip(np.sin(2 * np.pi * u / p['band_period']) * .5 + .5, 0, 1) ** 2.2
        band = band * (.55 + .45 * np.clip(np.sin(2 * np.pi * u / (p['band_period'] * 2.7) + 1.3), 0, 1))
        band *= np.clip(1 - yy / (H * 1.05), .25, 1)
        dw = np.clip((depth - 2.0) / 10., .35, 1)
        bk = band * dw * p['band_k']
        world = world + p['band'] * bk[..., None] * (1 - world * .5)
    # 4 bloom on bright things (lemon paint, chrome, lamps): from the world picture only
    Yw = world @ LUM; hot = world * np.clip((Yw - p['bloom_thr']) / (1 - p['bloom_thr']), 0, 1)[..., None] * (1 - cast)
    acc = np.zeros_like(world)
    for r, wt in ((6, .5), (20, .35), (55, .25)): acc += blur(hot, r * s) * wt
    world = world + acc * p['bloom_k']
    # 5 background softening by depth (normalised convolution without the cast, so no character colour bleeds into the world)
    rad = np.clip((depth - p['dof_d0']) / (p['dof_d0'] * 2.5), 0, 1) * p['dof_r'] * s
    keep = (1 - cast)
    soft = blur(world * keep, p['dof_r'] * s) / np.maximum(blur(keep, p['dof_r'] * s), 1e-3)
    k = (rad / max(p['dof_r'] * s, 1e-3))[..., None]
    world = world * (1 - k) + soft * k
    # 6 tone: saturation, contrast about mid grey, black lift and white point
    Yw = (world @ LUM)[..., None]; world = Yw + (world - Yw) * p['sat']
    world = .5 + (world - .5) * p['contrast']
    world = p['black'] + (p['white'] - p['black']) * np.clip(world, 0, 1)
    out = world * (1 - cast) + raw * cast
    return np.clip(out, 0, 1)

if __name__ == '__main__':
    A = sys.argv[1:]; pre = A[A.index('--preset') + 1]; p = dict(PRESETS[pre])
    raw = np.asarray(Image.open(A[0]).convert('RGB')).astype(np.float32) / 255
    def load16(f, shape):
        im = Image.open(f); a = np.asarray(im).astype(np.float32); a = a / (65535. if a.max() > 255 else 255.)
        if a.ndim == 3: a = a[..., 0]
        if a.shape != shape: a = np.asarray(Image.fromarray(a).resize((shape[1], shape[0]), Image.BILINEAR))
        return a
    depth = load16(A[1], raw.shape[:2]) * 200.; depth = ni.median_filter(depth, size=max(5, raw.shape[1] // 90)); depth = ni.gaussian_filter(depth, 1.5); mask = np.clip(load16(A[2], raw.shape[:2]), 0, 1)
    mask = np.maximum(mask, ni.grey_dilation(mask, size=(3, 3)) * .0)
    if p.get('target_mean'):   # solve the gain of the world so the whole frame lands on the target mean
        lo, hi = .7, 1.5
        for _ in range(12):
            g = (lo + hi) / 2; t = grade(np.clip(raw * np.where(mask[..., None] > .5, 1, g), 0, 1), depth, mask, p)
            if (t @ LUM).mean() < p['target_mean']: lo = g
            else: hi = g
        raw_in = np.clip(raw * np.where(mask[..., None] > .5, 1, (lo + hi) / 2), 0, 1); print('world gain', round((lo + hi) / 2, 3))
    else: raw_in = raw
    out = grade(raw_in, depth, mask, p)
    Image.fromarray((out * 255 + .5).astype(np.uint8)).save(A[3])
    nr, ng = numbers(raw), numbers(out); print('RAW', nr); print('GRADED', ng)
    if '--json' in A: json.dump(dict(raw=nr, graded=ng), open(A[A.index('--json') + 1], 'w'), indent=1)

# The Surgery Where the Surgeon Did Nothing: the clip table. Every clip is a real sample from CB's libraries
#   SFX   <your SFX folder, set in templates/sound_kit/sound_config.json>      MUSIC  <your music folder, set in templates/sound_kit/sound_config.json>
# Found through library_index.csv (copied from episodes/monopoly-escape/sound, 3135 sfx, 165 music). Nothing here is synthesized.
# prep() cuts the piece, trims it to its attack, filters / re-pitches it if asked, and writes clips/<key>.wav (48 kHz mono, peak 1.0).
# Tooling copied from episodes/monopoly-escape/sound/clipdefs.py (same prep, new clip list for this film).
import os, csv, io, subprocess
import numpy as np, soundfile as sf
from scipy import signal
HERE = os.path.dirname(os.path.abspath(__file__))
INDEX = os.path.join(HERE, 'library_index.csv')
CLIPDIR = os.path.join(HERE, 'clips')
SR = 48000

# key: (file name fragment in the library, options)   options: start dur rate lp hp sync('peak') raw fade
CLIPS = {
    # ---- v4 additions (FINAL JOIN v3, 2026-11-17) ----
    'water_spray':  ('SplashWetHeavy_S011TX.469', dict(rate=1.7, hp=1800, lp=9000, dur=1.1, fade=.5)),   # bulb_splash: thin spray
    'drip1':        ('DropSingleDrip_S08WR.48', dict(lp=7000, fade=.1)),
    'drip2':        ('DropSingleDrip_S08WR.49', dict(lp=7000, fade=.1)),
    'water_pour':   ('WaterPour_AP1.1343', dict(lp=6000, hp=200, dur=3.0, fade=.4)),                   # jug_flood: the jug pours (water, not a thunk)
    'water_move':   ('WaterMovement_AP1.1339', dict(lp=5000, dur=2.0, fade=.5)),                      # floor waves / slosh
    'gurgle':       ('WaterGurgle_AP1.1338', dict(lp=4000, dur=1.5, fade=.4)),
    'vcr_whirr':    ('ServoMotorShort_S011IN.537', dict(rate=1.5, hp=250, lp=2800, dur=1.5, fade=.3)),   # VCR tape heads whirr (closest stand-in)
    'wheel_roll':   ('ScrapeSlideWood_S011TX.459', dict(rate=.7, hp=120, lp=1200, dur=1.6, fade=.5)),   # slower gurney roll
    # ---- ambience beds (raw loops) ----
    'amb_hum':      ('ServoMotor_S011IN.536', dict(lp=420, raw=1, fade=0)),                 # OR air handling hum
    'amb_monitor':  ('ATMBeep_S011IN.40', dict(rate=1.25, hp=500, lp=5000, raw=1, fade=.05, pad=1.0)),   # one beep per second = the OR monitor
    'amb_room':     ('Ambiences (Room filler)', dict(start=40, dur=24, lp=5000, raw=1, fade=0)),
    'amb_fluor':    ('ServoMotor_S011IN.536', dict(rate=1.9, hp=110, lp=1600, raw=1, fade=0)), # fluorescent tube buzz
    'amb_pa':       ('HumanCrowdStudio_S08HU.147', dict(hp=250, lp=1300, raw=1, fade=0)),   # distant PA / corridor murmur
    'amb_traffic':  ('ES_Traffic Highway 1', dict(lp=1400, raw=1, fade=0)),                 # the freeway through the window
    'amb_clock':    ('Clock Tick.mp3', dict(lp=5000, raw=1, fade=0)),
    'amb_echo':     ('WindDroneSteady_S011HO.418', dict(lp=600, raw=1, fade=0)),            # stairwell air
    'amb_bubbles':  ('Bubbles 2', dict(lp=3500, raw=1, fade=0)),                           # waiting room fish tank
    'amb_printer':  ('PrinterPrint_S08OF.406', dict(lp=1500, raw=1, fade=0)),               # 2004 office printer / PC hum
    'amb_people':   ('Group of People sfx', dict(start=10, dur=40, hp=200, lp=2500, raw=1, fade=0)),
    # ---- OR work ----
    'tik':          ('MMFX_CLICK METALLIC_SB01.320', dict(rate=1.7, hp=1500, lp=9000)),
    'tik_spark':    ('MMFX_DIGITAL SHIMMER DELAY', dict(rate=1.6, hp=3000, dur=.35, fade=.2)),
    'squeeze':      ('SquishSuction_S011TX.560', dict(lp=4000, dur=.6, fade=.2)),
    'water_fan':    ('SplashWetHeavy_S011TX.469', dict(rate=1.35, hp=900, lp=8000, dur=.8, fade=.4)),
    'slap':         ('09-Sound Effects\\Slap.mp3', dict(lp=6000)),
    'stamp':        ('TimeCardPuncher_S011OF.72', dict(sync='peak', fade=.2)),
    'tape':         ('MaskingTape_AP1.1253', dict(dur=.4, lp=6000, fade=.15)),
    'pat':          ('BaseballGlove_AP1.1289 (1)', dict(lp=2500)),
    'static':       ('CbRadioStatic_S08TE.394', dict(dur=1.0, hp=400, lp=7000, fade=.3)),
    'chain':        ('ChainRattleMove_S08FO.499', dict(rate=1.7, hp=1500, dur=.5, fade=.2)),
    'cloth_soft':   ('BagCrumple_AP1.1064', dict(rate=.8, lp=1100, fade=.15)),
    'ting':         ('BellDing_AP1.1065', dict(rate=1.5, hp=1500, fade=.5)),
    'snore':        ('sleeping_mimimimimi', dict(lp=2200, hp=120, fade=.5, dur=2.6)),   # v2: the knocked-out patient's soft snore / zZ
    'ding':         ('BellDing_AP1.1065', dict(rate=.95, hp=500, fade=.9)),   # v2: the happy thought-bubble ding
    'bag_crinkle':  ('BagCrumple_AP1.1064', dict(rate=1.2, hp=1200, lp=7000, dur=.6, fade=.2)),
    # ---- corridor ----
    'shaver':       ('ElectricPencil_AP1.1237', dict(lp=2500, dur=1.0, fade=.3)),
    'pour':         ('WaterPour_AP1.1343', dict(lp=5000, dur=2.0, fade=.5)),
    'wheels':       ('ScrapeSlideWood_S011TX.459', dict(rate=.8, lp=1500, dur=1.4, fade=.5)),
    'squeak':       ('LeverSqueakSlow_S08CT.101', dict(lp=5000, fade=.2)),
    'squeak2':      ('LeverSqueakSlow_S08CT.102', dict(lp=5000, fade=.2)),
    'hinge':        ('MetalHingeSqueak_S011FO.667', dict(lp=5000, fade=.3)),
    'clock_spin':   ('Clock ticking fast', dict(dur=1.4, lp=6000, fade=.4)),
    'clock_cartoon':('CARTOON CLOCK', dict(dur=1.2, fade=.4)),
    'honk':         ('CarHornHonkTwice_S08TM.15', dict(lp=3000, hp=250, fade=.2)),
    # ---- office ----
    'tap':          ('ArcadeGameTap_S08TE.50', dict(rate=.8, lp=3200)),
    'coffee_pour':  ('WhiskeyPour_S011FO.1011', dict(lp=5000, dur=1.6, fade=.4)),
    'drips':        ('DripsSplatty_S08WR.46', dict(lp=5000, dur=1.0, fade=.4)),
    'creak':        ('ES_Creak_Squeak_1', dict(lp=4000, fade=.3)),
    'paper_rustle': ('NewspaperRustle_AP1.1103', dict(dur=1.0, lp=6000, fade=.3)),
    'riffle':       ('CardsShuffle_S08SP.142', dict(dur=1.2, fade=.3)),
    'card_flip':    ('CardsFlipCard_S08SP.149', dict()),
    'card_flip2':   ('CardsFlipCard_S08SP.150', dict()),
    'card_slap':    ('GameCardDrop_S011SP.176', dict()),
    'pop':          ('09-Sound Effects\\Pop.mp3', dict(lp=8000)),
    'peel':         ('StickyFastRip_S011TX.577', dict(rate=.9, lp=5000, dur=.5, fade=.2)),
    'glint':        ('FlashHit_BWU.230', dict(hp=2500, fade=.4)),
    'pen_squeak':   ('DryEraseMarker_AP1.1234', dict(dur=.7, lp=7000, fade=.2)),
    'pen_write':    ('MarkerWrite_AP1.1247', dict(dur=1.0, lp=7000, fade=.3)),
    'envelope':     ('Paper Flip 1', dict(dur=.5, fade=.1)),
    'note_snap':    ('NewspaperUp_AP1.1102', dict(lp=6000, dur=.5, fade=.15)),
    'vcr_clunk':    ('Cassette_Insert__Sound_Effect_HD', dict(lp=5000, dur=1.0, fade=.3)),
    'play_click':   ('MMFX_CLICK METALLIC_SB01.320', dict(rate=1.0)),
    'sploosh':      ('SplashWetHeavy_S011TX.468', dict(lp=7000, fade=.6)),
    'wave':         ('OceanWaves_S08AM.48', dict(start=1.0, dur=2.5, lp=3000, raw=1, fade=1.2)),
    'plop':         ('DripDropPlop_S08WR.32', dict(rate=.8, lp=3000)),
    'cane_creak':   ('CreakPlastic_S011TX.47', dict(rate=.7, lp=3000, fade=.3)),
    'boing':        ('SpringBoing_S011TX.513', dict(lp=6000, fade=.3)),
    'boing2':       ('SpringBoing_S011TX.514', dict(rate=1.4, lp=7000, fade=.3)),
    'boot':         ('WorkBoots_S08FS.585', dict(lp=3500)),
    'crowd_walk':   ('FOLYFeet_Footsteps Boots Walk Concrete Gritty Distance', dict(dur=3.0, lp=3500, fade=1.0)),
    'sign_spin':    ('Sfx\\Wheel Spin.mp3', dict(dur=1.4, lp=6000, fade=.5)),
    'needle':       ('WhipWhoosh_AP1.1133', dict(lp=5000, sync='peak', raw=1)),
    'clack':        ('ClavesHit_BWU.123', dict(lp=4500, fade=.06)),
    'lid_thunk':    ('ImpactWoodHit_S011IM.354', dict(rate=.75, lp=2200)),
    'dust_puff':    ('Dust_Swoosh', dict(lp=5000, sync='peak', raw=1)),
    'wail':         ('HumanCryWhine_S08HU.215', dict(lp=6000, dur=1.8, fade=.5)),
    'bubble_pop':   ('Pop Bubble Sound Effect', dict()),
    'bubble':       ('WaterBubble_AP1.1328', dict(lp=4000, fade=.2)),
    'money_flutter':('Rustling Paper 1', dict(rate=1.3, hp=700, dur=1.2, fade=.4)),
    'pens':         ('CoinsDrop_AP1.1082', dict(rate=.75, hp=900, lp=5000, fade=.2)),
    'door':         ('CompartmentDoor_S011SF.193', dict(lp=3000, fade=.3)),
    'kids_cheer':   ('KidsCheerLight_S011HU.6', dict(lp=6000, dur=1.6, fade=.6)),
    'bonk':         ('Bamboo Hit (Anime_Cartoon Bonk)', dict(lp=6000, fade=.2)),
    # ---- moves, power hits ----
    'whoosh_soft':  ('Whoosh Deep Light', dict(lp=1400, sync='peak', raw=1)),
    'whoosh_sweep': ('Whoosh Deep Light', dict(lp=800, rate=.7, sync='peak', raw=1)),
    'whoosh_short': ('Whoosh/Whoosh 5', dict(lp=5000, sync='peak', raw=1)),
    'whoosh_rev':   ('ES_Whoosh_Reverse_3', dict(sync='peak', raw=1, fade=.05)),
    'hit_boom':     ('boom impact', dict(lp=6000, fade=.8)),
    'thud_deep':    ('Deep Overdrive Dramatic Thud', dict(lp=3000, fade=.8)),
    'tympani':      ('TympaniDrumHit_BWU.177', dict(fade=.6)),
    'stab':         ('epic trailer hit 5', dict(fade=1.0)),
    'shimmer':      ('MMFX_DIGITAL SHIMMER DELAY', dict(fade=.8)),
    'cymbal_harp':  ('CymbalHarp_S08MU.114', dict(fade=.8)),
    'twinkle':      ('Epic_Twinkle', dict(fade=.5)),
    'sparkle':      ('Anime Magic Sparkle Sound Effect', dict(fade=.4)),
    'boom_low':     ('Cinematic Bass Boom', dict(lp=250, fade=1.5)),
}

MUSICDIR = r'<your music folder, set in templates/sound_kit/sound_config.json>'
THEME = 'Curious Thoughts (Royalty Free Music) - Zack D Films Background Music (1).mp3'  #     # about 101 s, steady sneaky bed, ends on a last hit near 97 s and a decay

_rows = None
def lib(frag):
    """the library file for a name fragment (shortest match), from the index in this folder"""
    global _rows
    if _rows is None:
        with io.open(INDEX, newline='', encoding='utf-8') as f: _rows = [r for r in csv.DictReader(f) if r['kind'] == 'sfx']
    fr = frag.lower().replace('\\', '/')
    h = [r for r in _rows if fr in r['rel'].lower().replace('\\', '/') and os.path.exists(r['path'])]
    assert h, 'not in the library: ' + frag
    h.sort(key=lambda r: (len(r['rel']), r['rel']))
    return h[0]

def decode(path, mono=True, start=None, dur=None):
    cmd = ['ffmpeg', '-v', 'error']
    if start: cmd += ['-ss', str(start)]
    if dur: cmd += ['-t', str(dur)]
    cmd += ['-i', path, '-ac', '1' if mono else '2', '-ar', str(SR), '-f', 'f32le', '-']
    x = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).astype(float)
    return x if mono else x.reshape(-1, 2).T

def _env(x, w=240):
    n = len(x) // w; return np.sqrt((x[:n * w].reshape(n, w) ** 2).mean(1)) + 1e-9

def prep(key, force=False):
    """-> (samples, sync_seconds, library rel path). Cached in clips/<key>.wav (+ .txt with the sync point)."""
    frag, o = CLIPS[key]; os.makedirs(CLIPDIR, exist_ok=True)
    p = os.path.join(CLIPDIR, key + '.wav'); r = lib(frag)
    if os.path.exists(p) and os.path.exists(p + '.txt') and not force:
        y, _ = sf.read(p); return np.asarray(y, float), float(open(p + '.txt').read().split()[0]), r['rel']
    x = decode(r['path'], start=o.get('start'), dur=o.get('dur'))
    if not o.get('raw'):                       # trim to the attack: first 5 ms block within 30 dB of the peak, 3 ms of lead-in kept
        e = _env(x); i = int(np.argmax(e > e.max() * 10 ** (-30 / 20.))) * 240; x = x[max(0, i - 144):]
    if o.get('rate', 1) != 1:
        n = int(len(x) / o['rate']); x = signal.resample_poly(x, n, len(x)) if len(x) < 400000 else np.interp(np.arange(n) * o['rate'], np.arange(len(x)), x)
    if o.get('lp'): x = signal.sosfiltfilt(signal.butter(2, o['lp'], 'low', fs=SR, output='sos'), x)
    if o.get('hp'): x = signal.sosfiltfilt(signal.butter(2, o['hp'], 'high', fs=SR, output='sos'), x)
    e = _env(x); last = np.where(e > e.max() * 10 ** (-48 / 20.))[0]
    if len(last) and not o.get('raw'): x = x[: min(len(x), (last[-1] + 12) * 240)]
    fi = min(96, len(x) // 4); x[:fi] *= np.linspace(0, 1, fi)
    fo = int(o.get('fade', .03) * SR); fo = min(fo, len(x) // 2)
    if fo: x[-fo:] *= np.linspace(1, 0, fo) ** 2
    x = x / (abs(x).max() + 1e-9)
    if o.get('pad'): z = max(0, int(o['pad'] * SR) - len(x)); x = np.concatenate([np.zeros(int(z * .45)), x, np.zeros(z - int(z * .45))])   # a short sample padded to a loop length (monitor beep once a second)
    sync = 0.0
    if o.get('sync') == 'peak': e = _env(x, 960); sync = float(np.argmax(np.convolve(e, np.ones(3) / 3, 'same'))) * 960 / SR
    sf.write(p, x, SR, subtype='PCM_24'); open(p + '.txt', 'w', encoding='utf-8').write('%.4f %s' % (sync, r['rel']))
    return x, sync, r['rel']

if __name__ == '__main__':
    import sys
    for k in CLIPS:
        x, s, rel = prep(k, force='-f' in sys.argv); print('%-14s %6.2fs sync %.2f  %s' % (k, len(x) / SR, s, rel.encode('ascii', 'replace').decode()))

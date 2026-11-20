"""Walk your sound-effect and music folders (from sound_config.json) and write library_index.csv beside this file.
    python templates/sound_kit/index_library.py            index (file names only, fast)
    python templates/sound_kit/index_library.py --dur      also measure each file's length with ffprobe (slower)
Run it once, and again after you add sounds. Every later step searches this index, never the disk."""
import os, io, csv, sys, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import soundlib as L


def dur(p):
    try:
        r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True, timeout=20)
        return '%.2f' % float(r.stdout.strip())
    except Exception:
        return ''


def main():
    c = L.config(); want_dur = '--dur' in sys.argv; out = []
    for kind, key in (('sfx', 'sfx_dirs'), ('music', 'music_dirs')):
        for root in c.get(key, []):
            if not os.path.isdir(root):
                print('MISSING folder (%s): %s' % (kind, root)); continue
            n = 0
            for d, _, files in os.walk(root):
                for f in files:
                    if f.lower().endswith(L.AUDIO_EXT):
                        p = os.path.join(d, f); rel = os.path.relpath(p, root).replace('\\', '/')
                        words = ' '.join(rel.lower().replace('_', ' ').replace('-', ' ').replace('/', ' ').split())
                        out.append(dict(kind=kind, rel=rel, path=p, words=words, seconds=dur(p) if want_dur else ''))
                        n += 1
            print('%-5s %6d files  %s' % (kind, n, root))
    with io.open(L.INDEX, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=['kind', 'rel', 'path', 'words', 'seconds']); w.writeheader(); w.writerows(out)
    print('wrote', L.INDEX, len(out), 'rows')
    if not out:
        print('The index is empty. Put your folders in sound_config.json. Without a library the kit can still make sound in code: templates/audio/.')


if __name__ == '__main__':
    main()

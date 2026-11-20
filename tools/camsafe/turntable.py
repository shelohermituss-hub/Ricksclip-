#!/usr/bin/env python3
"""CAMERA-SAFE TURNTABLE (CB 2026-11-16, thread "Build camera-safe 2.5D character rig").

Builds a test film folder whose frames are a turntable around ONE character preset: 7 camera angles round him
(0 / 30 / 45 / 60 / 90 / 135 / 180 deg, 0 = in front of his face), 3 camera heights (high, eye, low) and 4 acts
(standing, sitting on a chair, walking, holding a box). He never turns: he faces plan -Y in every frame, and the
camera goes round him, exactly as CB_RULES 11d2 asks ("a pure camera move never turns a character").

The views are picked by the REAL pipeline (tools/film_plan.py apply_looks), the frames are drawn by the REAL kit
(templates/threejs_film/render.mjs), so the sheet shows what a film would show.

  python tools/camsafe/turntable.py <out_dir> [--puppet cast:cowboy] [--height 1.75] [--true-angle] [--pkg episodes/x/cast] [--camsafe] [--orbit standing|sitting|walking|holding --frames 240 --pitch 12]
  node templates/threejs_film/render.mjs <out_dir>/film.json --frames all --no-captions
  python tools/camsafe/turntable_sheet.py <out_dir>

--true-angle sets look_full on every act (the view is the true angle, back included); without it standing,
sitting and holding are "cheated open to the lens" as films do, and only walking uses the true angle.
"""
import json, math, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, 'tools')); import film_plan as FP

ANGLES = [0, 30, 45, 60, 90, 135, 180]
HEIGHTS = [('high', 38.0), ('eye', 4.0), ('low', -14.0)]          # camera pitch, degrees down (+) or up (-), toward the aim point
ACTS = [('standing', 'stand'), ('sitting', 'm:sit_chair/A@=0.5'), ('walking', 'm:walk/A@=0.35'), ('holding', 'grip_box')]
LENS, DIST = 35.0, 3.3

def main(a):
    out = a[0]; puppet = a[a.index('--puppet') + 1] if '--puppet' in a else 'cast:cowboy'
    height = float(a[a.index('--height') + 1]) if '--height' in a else 1.75; true_angle = '--true-angle' in a; camsafe = '--camsafe' in a
    pkg = a[a.index('--pkg') + 1].split(',') if '--pkg' in a else None          # extra puppet folders (an episode's cast/), the kit's code folder is added last
    os.makedirs(os.path.join(out, 'out', 'plan'), exist_ok=True); os.makedirs(os.path.join(out, 'sets'), exist_ok=True)
    places = {'studio': {'set': 'turntable', 'light': 'morning', 'backdrop': 9}, 'studio_chair': {'set': 'turntable_chair', 'light': 'morning', 'backdrop': 9}}
    film = {'title': 'CAMERA-SAFE TURNTABLE ' + puppet, 'fps': 30, 'size': [1080, 1920], 'words': 'voice/words.json',
            'cast': {'hero': {'puppet': puppet, 'height': height, 'heads_tall': 2.9}}, 'places': places, 'props': {'box': {'held_by': 'hero'}},
            'takes': [], 'acts': [], 'sentences': [], 'fx': [], 'moods': [], 'sound': [], 'tween': {'pop': 0},
            'card_shade': {'amount': 0, 'rim_amount': 0}, 'face_shadow': True}
    if camsafe: film['camsafe'] = True
    if pkg: film['puppet_pkg'] = [os.path.abspath(x) for x in pkg] + [os.path.join(ROOT, 'templates', 'vector2d_characters', 'code')]
    cam, frames, index = [], [], []
    f = 0
    if '--orbit' in a:            # one continuous camera move all the way round him (no cuts): shows how the drawing switches while the camera moves
        act = a[a.index('--orbit') + 1]; pose = dict(ACTS)[act]; place = 'studio_chair' if act == 'sitting' else 'studio'; aimz = height * (0.42 if act == 'sitting' else 0.55)
        n = int(a[a.index('--frames') + 1]) if '--frames' in a else 240; pitch = float(a[a.index('--pitch') + 1]) if '--pitch' in a else 12.0
        for i in range(n):
            u = i / (n - 1); e = u * u * (3 - 2 * u); ang = 360.0 * e; r = math.radians(ang); horiz = DIST * math.cos(math.radians(pitch)); z = aimz + DIST * math.sin(math.radians(pitch))
            cam.append({'f': i, 'kick': False, 'take': 'orbit', 'place': place, 'backdrop': 9, 'station': 0, 'state': 'travel', 'cut': i == 0, 'pos': [round(horiz * math.sin(r), 4), round(-horiz * math.cos(r), 4), round(z, 4)],
                        'aim': [0, 0, round(aimz, 4)], 'up': None, 'roll': 0.0, 'lens': LENS, 'fov_v': round(FP.fov_v(LENS), 3), 'subject': 'hero', 'framing': 'M', 'shows': []})
            st = {'view': 'front', 'dir': 1, 'pose': pose if not pose.startswith('m:') else pose.split('@')[0], 'face': 'standard', 'mouth': None, 'blink': None, 'pos': [0, 0, 0], 'visible': True, 'look': [0, -6, 0], 'place': place}
            if act == 'holding': st.update(prop='box', hand='R')
            if true_angle or act == 'walking': st['look_full'] = True
            frames.append(st); index.append({'f': i, 'act': act, 'height': 'orbit', 'pitch': pitch, 'angle': round(ang, 1)})
        f = n
    for act, pose in ([] if '--orbit' in a else ACTS):
        place = 'studio_chair' if act == 'sitting' else 'studio'
        aimz = height * (0.42 if act == 'sitting' else 0.55)
        for hname, pitch in HEIGHTS:
            for ang in ANGLES:
                r = math.radians(ang); horiz = DIST * math.cos(math.radians(pitch)); z = aimz + DIST * math.sin(math.radians(pitch))
                pos = [round(horiz * math.sin(r), 4), round(-horiz * math.cos(r), 4), round(max(0.12, z), 4)]
                cam.append({'f': f, 'kick': False, 'take': 'tt', 'place': place, 'backdrop': 9, 'station': f, 'state': 'rest', 'cut': True,
                            'pos': pos, 'aim': [0, 0, round(aimz, 4)], 'up': None, 'roll': 0.0, 'lens': LENS, 'fov_v': round(FP.fov_v(LENS), 3),
                            'subject': 'hero', 'framing': 'M', 'shows': []})
                st = {'view': 'front', 'dir': 1, 'pose': pose, 'face': 'standard', 'mouth': None, 'blink': None, 'pos': [0, 0, 0], 'visible': True,
                      'look': [0, -6, 0], 'place': place}
                if act == 'holding': st.update(prop='box', hand='R')
                if true_angle or act == 'walking': st['look_full'] = True
                frames.append(st); index.append({'f': f, 'act': act, 'height': hname, 'pitch': pitch, 'angle': ang}); f += 1
    perf = {'hero': FP._pack(frames)}; F = dict(film); F['_perf'] = perf
    perf = FP.apply_looks(F, cam)
    json.dump(film, open(os.path.join(out, 'film.json'), 'w'), indent=1)
    os.makedirs(os.path.join(out, 'voice'), exist_ok=True); json.dump([{'w': 'turn', 's': 0.0, 'e': 0.2}], open(os.path.join(out, 'voice', 'words.json'), 'w'))
    json.dump({'fps': 30, 'size': [1080, 1920], 'stations': [], 'frames': cam}, open(os.path.join(out, 'out', 'plan', 'camera_baked.json'), 'w'))
    json.dump(perf, open(os.path.join(out, 'out', 'plan', 'performance_baked.json'), 'w'))
    json.dump(index, open(os.path.join(out, 'turntable_index.json'), 'w'), indent=0)
    for name, chair in (('turntable', False), ('turntable_chair', True)):
        open(os.path.join(out, 'sets', name + '.js'), 'w').write(SET.replace('__CHAIR__', 'true' if chair else 'false'))
    print('turntable:', f, 'frames,', puppet, '->', out)

# a plain studio: a tiled floor that shows perspective, a low ring wall far away, and (sitting) a wooden chair under his hips.
SET = r"""
export function build(THREE, scene, film, ctx) {
  const { B2T, toon } = ctx, CHAIR = __CHAIR__;
  const add = (m, name, role) => { m.name = name; m.userData.role = role; m.castShadow = true; m.receiveShadow = true; scene.add(m); return m; };
  const box = (name, role, w, d, h, at, col) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), toon(col)); m.position.copy(B2T([at[0], at[1], at[2] + h / 2])); return add(m, name, role); };
  for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) box('floor_tile', 'stone', .98, .98, .02, [i, j, -.02], (i + j) % 2 ? '#d8c7a4' : '#c4ae86');
  box('floor_mark_front', 'stone', .1, 1.2, .004, [0, -1.0, 0], '#b8403a');               // a red line on the floor toward where he faces
  for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; const m = box('ring_wall', 'plaster', 1.7, .25, 1.4 + (k % 3) * .4, [Math.sin(a) * 7, Math.cos(a) * 7, 0], ['#7fa7c9', '#c98f7f', '#9fc28a'][k % 3]); m.rotation.y = -a; }
  if (CHAIR) { const S = .30, wood = '#8a5a3a';                                             // seat height of moves/sit_chair.mjs (SEAT_M)
    box('chair_seat', 'wood', .44, .36, .05, [0, .04, S - .05], wood);
    for (const [x, y] of [[-.19, -.12], [.19, -.12], [-.19, .2], [.19, .2]]) box('chair_leg', 'wood', .04, .04, S - .05, [x, y, 0], wood);
    box('chair_back', 'wood', .44, .04, .46, [0, .21, S], wood); }
  return {};
}
"""
if __name__ == '__main__': main(sys.argv[1:])

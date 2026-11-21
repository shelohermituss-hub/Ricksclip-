# check_glb_colours.py: GUARD (props-hero round 3, LECONS 2026-11-21): a Blender colour made with nodes (mix, noise, object-space bands) does not
# survive the glTF export; the kit then shows the plain default (round 2: navy lunch box WHITE, cream van GREEN). Lists every material of the GLBs
# with its exported base colour; flags "WHITE?" when it has neither a texture nor a colour factor. python3 check_glb_colours.py <glb> [...]  (exit 1 on a flag)
import sys, json, struct
bad = 0
for f in sys.argv[1:]:
    b = open(f, 'rb').read(); n = struct.unpack('<I', b[12:16])[0]; j = json.loads(b[20:20 + n])
    for m in j.get('materials', []):
        pbr = m.get('pbrMetallicRoughness', {}); fac = pbr.get('baseColorFactor'); tex = 'baseColorTexture' in pbr
        flag = '' if (tex or fac) else '  WHITE?'
        if flag and not m.get('name', '').lower().startswith(('white', 'milk', 'glass', 'bottle', 'chrome', 'metal', 'bulb')): bad += 1
        else: flag = flag and '  (white by design?)'
        print('%-28s %-34s %s%s' % (f.split('/')[-1], m.get('name', '?')[:34], 'texture' if tex else (str([round(x, 3) for x in fac[:3]]) if fac else '-'), flag))
print('GLB_COLOURS flags', bad); sys.exit(1 if bad else 0)

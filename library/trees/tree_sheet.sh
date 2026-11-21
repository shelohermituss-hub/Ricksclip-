#!/usr/bin/env bash
# Rebuild library/trees/TREE_SHEET.jpg (4 panels 540x960 -> 2x2 sheet 1080x1920 scaled to 800 wide) and out/stats.json.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/out"
bash "$HERE/fetch_tex.sh" >/dev/null
blender -b -P "$HERE/make_tree_sheet.py" -- "$OUT" "$@" 2>&1 | grep -E "STATS|Error|Traceback|rick_" || true
python3 - "$OUT" "$HERE/TREE_SHEET.jpg" <<'EOF'
import json, sys
from PIL import Image, ImageDraw
out, dst = sys.argv[1], sys.argv[2]
st = json.load(open(out + "/stats.json"))
names = ["A_spread_near", "B_round_near", "C_tall_near", "D_road_mid_far"]
sheet = Image.new("RGB", (1080, 1920), "black")
d = ImageDraw.Draw(sheet)
for i, n in enumerate(names):
    im = Image.open("%s/%s.png" % (out, n)).convert("RGB")
    x, y = (i % 2) * 540, (i // 2) * 960
    sheet.paste(im, (x, y))
    tr = st["trees"]
    if n.startswith("D"):
        lab = "%s  mid %dk / far %.1fk tris  %ss" % (n, max(v["tris"] for k, v in tr.items() if k.endswith("_mid")) // 1000,
                                                    max(v["tris"] for k, v in tr.items() if k.endswith("_far")) / 1000, st["render_s"][n])
    else:
        s = n.split("_")[1]
        lab = "%s  %dk tris  %ss" % (n, tr[s + "_near"]["tris"] // 1000, st["render_s"][n])
    d.rectangle((x, y, x + 540, y + 28), fill=(0, 0, 0))
    d.text((x + 8, y + 8), lab, fill=(255, 255, 255))
sheet.resize((800, 1422)).save(dst, quality=88)
print("sheet", dst)
EOF

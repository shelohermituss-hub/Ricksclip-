"""Review sheets of harvested heads (W >= 70 px at 720-wide), numbered, for a person to reject false hits."""
import json, os, sys
from PIL import Image, ImageDraw
H = json.load(open("data/heads.json"))
for i, h in enumerate(H): h["id"] = i
big = [h for h in H if h["W_px"] >= 70]
print(len(big), "heads >= 70 px")
C = 10; R = 8; S = 110
for s in range(0, len(big), C * R):
    sheet = Image.new("RGB", (C * S, R * S), (40, 40, 40))
    for k, h in enumerate(big[s:s + C * R]):
        im = Image.open(os.path.join("..", "frames", h["ep"], h["f"])).convert("RGB")
        if im.width != 720: im = im.resize((720, 1280))
        x0, y0, x1, y1 = h["box"]
        c = im.crop((x0, y0, x1, y1)); c.thumbnail((S - 4, S - 16))
        sheet.paste(c, ((k % C) * S + 2, (k // C) * S + 14))
        d = ImageDraw.Draw(sheet); d.text(((k % C) * S + 2, (k // C) * S), str(h["id"]) + ("" if h["bare_top"] else " h"), fill=(255, 255, 0))
    sheet.save(f"out/heads_sheet_{s // (C * R):02d}.jpg", quality=85)
json.dump(H, open("data/heads.json", "w"), indent=0)

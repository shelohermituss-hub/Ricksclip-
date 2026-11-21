"""make_sheet.py: library/LIBRARY_SHEET.jpg = a contact sheet of the asset library's preview pictures.
Only proof pictures already committed in the episodes (never anything from references/).
  python3 library/make_sheet.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ST, YFT = "episodes/_style_test", "episodes/yellow-fire-trucks"
TILES = [  # (label, path)
    ("ST set: house, garage, yard", f"{ST}/set/sheet/key.png"),
    ("ST set overview, far houses", f"{ST}/set/sheet/overview.png"),
    ("ST props: Buick, bucket, hose...", f"{ST}/props/PROPS_SHEET.jpg"),
    ("ST cast cards", f"{ST}/cast/CAST_SHEET.jpg"),
    ("ST assembled still (Rick recipe)", f"{ST}/STYLE_TEST_preview.png"),
    ("YFT asset pack: truck, gun, compressor", f"{YFT}/props/ASSET_PACK.jpg"),
    ("YFT props round 2", f"{YFT}/props/PROPS_R2.jpg"),
    ("YFT props round 3", f"{YFT}/props/PROPS_R3.jpg"),
    ("YFT light truck, sirens", f"{YFT}/assets_prod/proof/tiles_r3/r3_light_sirens_drainwipe.png"),
    ("YFT milk van", f"{YFT}/assets_prod/proof/tiles_r3/r3_milk_van.png"),
    ("YFT lost things", f"{YFT}/assets_prod/proof/tiles_r3/r3_lawn_lost_things.png"),
    ("YFT coded hero truck (kit)", f"{YFT}/props/HERO_SHEET.jpg"),
    ("YFT town set", f"{YFT}/sets/town/TOWN_SHEET.jpg"),
    ("YFT Dallas set", f"{YFT}/sets/dallas/DALLAS_SHEET.jpg"),
    ("YFT map set", f"{YFT}/sets/map/MAP_SHEET.jpg"),
    ("YFT lamp room", f"{YFT}/sets/lamproom/LAMPROOM_SHEET.jpg"),
    ("YFT cast line-up", f"{YFT}/cast/sheets/LINEUP.jpg"),
    ("YFT key frames: grade + outline", f"{YFT}/cine/RECIPE_KEYS.jpg"),
]
TW, TH, LAB, COLS = 400, 400, 26, 6


def font(size):
    for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf"):
        if os.path.exists(f):
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def main():
    tiles = [(l, p) for l, p in TILES if os.path.exists(os.path.join(ROOT, p)) and "references" not in p.split("/")]
    rows = (len(tiles) + COLS - 1) // COLS
    sheet = Image.new("RGB", (COLS * TW, rows * (TH + LAB)), (24, 24, 28))
    d, F = ImageDraw.Draw(sheet), font(15)
    for i, (label, p) in enumerate(tiles):
        im = Image.open(os.path.join(ROOT, p)).convert("RGB")
        im.thumbnail((TW - 8, TH - 8))
        x, y = (i % COLS) * TW, (i // COLS) * (TH + LAB)
        sheet.paste(im, (x + (TW - im.width) // 2, y + (TH - im.height) // 2))
        d.text((x + 6, y + TH + 4), label, fill=(235, 235, 235), font=F)
    out = os.path.join(ROOT, "library", "LIBRARY_SHEET.jpg")
    sheet.save(out, quality=85)
    print(out, sheet.size, len(tiles), "tiles")


if __name__ == "__main__":
    main()

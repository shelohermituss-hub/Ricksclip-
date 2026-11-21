# STATE: PLACE X, X-ray clinic corner + X-RAY WORLD (set-builder round 1, 2026-11-21). Sheet: XRAY_SHEET.jpg (6 tiles, looked at).
## NOT done / still weak (seen in the sheet)
- X-ray world rows 21-22 are WASHED OUT: lining + dashes + glass wall + fog glow add up to near-white (mean .78/.84; edge .016/.023, colours 66/89).
  Fix: lining emission .45 -> .1, base colour toward #5fb3e0, glare strength .5 -> .25, stomach rim emission 2.2 -> 1.0, xw_key 160 -> 60.
- Row 21 mattress quilting reads as round bubbles, not a quilted mattress: add seam grooves between pillows + button dots; dashes barely visible.
- Row 20 CAM_INSIDE: the bean reads but is small and below a big rib; no Cessna readable at that distance. Move camera closer / lower, ribs fewer in front.
- Mini Cessna (row 22) reads as a plane of square bites, but too small in CAM_RIDE; ride camera 0.3 m closer.
- Clinic: walls still bright (shoulder mean .69, wide .56 fine); a black square at a T-bar crossing in CAM_WIDE (not found yet); window sky is a flat placeholder
  (background-painter). Shoulder tile edge .066 / 293 regions: wall area too plain left of the box (add a poster / notice board / switch plate).
- Gates (density_check --day): shoulder 1/7, wide 4/7, film 4/7, inside 1/7, lining 2/7, ride 1/7. Edge density 0.016-0.077 vs Rick bar 0.086.
- Kit module xray.js: syntax-checked only, not rendered in the kit. The backdrop sphere needs side BackSide in the kit (flipped normals may not survive).
- No close-up detail pairs measured against Rick (only one ours-vs-Rick sheet: crew/set-builder_vs_rick.jpg, private, holds Rick frames).
## FIX 1 (lead round, 2026-11-21) - result, sheet re-rendered
- Done: X-ray world no longer washed out (inside .58, lining .61, ride .64; colours 205/197/404 from 90/66/89); diamond button-tufted mattress (quilt.png +
  diamond grooves in the shape key, 150x60 grid); stomach bigger in row 20 (CAM_INSIDE moved in); ride camera closer, the bite-Cessna reads with its navy stripe;
  wall left of the box dressed (BALANCED DIET poster with pins + slips, coat hook + stethoscope, light switch, thermometer; chart and apron moved left).
- Still weak: row 21 shows a hard flat diagonal edge at the bottom right (the stomach wall interior / lining edge, check next); row 20 bean still sits under a
  rib and the Cessna is tiny there; means .58-.64 are above the lead's .45 target; edge .044-.052 vs Rick .086. Clinic tiles .68/.56/.81 still bright.
- Gates now: shoulder 2/7 (edge .081), wide 4/7, film 4/7, inside 2/7, lining 2/7, ride 3/7. Tris: clinic 35,230, X-ray world 53,348, total 88,578 (GLB 3.96 MB).
## Built
- scripts/tex_xray.py (film_hero = the signature: cyan skeleton on #2f6fb3, bean stomach, Cessna of square bites with navy stripe, F-MIAM, label M. LOTITO
  GRENOBLE 1978; film_before; lino; eye chart; world backdrop), scripts/bl_xray.py, build_xray.sh, ../pe_bl.py (helpers), ../pe_proof.py, ../pe_sheet.py, ../run_proofs.sh.
- out/xray.blend (cams CAM_SHOULDER, CAM_WIDE, CAM_FILM, CAM_INSIDE, CAM_LINING, CAM_RIDE), out/xray_lite.glb (3.4 MB, morph 'puff'), out/xray_meta.json
  (anchors, cams, slide_path + slide_path_flat, mini Cessna node). ../xray.js (kit: puff, ride, flicker, keys; propeller spin). ../xray_STORY.md, ../xray_DRESSING.md.
## Numbers
- Triangles: clinic 33,848; X-ray world 41,464; total 75,312 (all bevels applied). GLB 3.44 MB.
- Previews 540x960 Cycles CPU 16 spp + OIDN, load 8-12: 60-98 s a tile. proof/numbers.json, proof/density.json.
## Layout (Blender metres, Z up)
Clinic floor z 0; back wall inner face y 2.2 (light box centre x .35 z 1.5, hero film on panel x .11); window wall x -2.2 (window y .35-1.75, z .95-2.15);
4th wall y -2.6 with coat hooks; door in the right wall. X-ray world at X0 (30,0,0): stomach centre (30.4,-.2,-1.4), axes 2.9/1.9/1.6; spine at y +4.2.

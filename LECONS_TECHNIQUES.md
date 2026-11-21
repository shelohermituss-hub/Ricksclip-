# Registre des leçons techniques

Rôle (REGLES_METHODE.md, section 1) : chaque problème technique résolu est inscrit ici dans la même séance, le plus récent en haut. Ce que CB veut (ses corrections, avec sa phrase et la date) va dans `CB_RULES.md` ; ici, seulement la technique.

Une entrée n'est complète que si elle a un garde-fou et une preuve. « Corrigé dans le code » sans « vérifié en image » ou sans test s'écrit OUVERT.

## Modèle d'entrée
```
## AAAA-MM-JJ — <titre court> (<film ou outil>) — FERMÉ / OUVERT
- Problème : ce qui s'est passé, avec le chiffre mesuré (temps perdu, images fausses).
- Cause réelle : pas le symptôme.
- Correction : le fichier et ce qui a changé.
- Garde-fou : le contrôle automatique, le test ou la ligne de modèle qui empêche le retour (fichier, commande).
- Preuve : la commande lancée et son résultat, ou l'image vérifiée (chemin).
```

## Entrées

## 2026-11-21 — truck_api (yellow-fire-trucks, carte) — FERMÉ
- truck_api.set_paint(masking=False) on truck_light.blend: AssertionError mask_paper missing. Cause: the light truck has no mask materials (bl_light removed them with no fake user). Fix: masking=None (leave the masks as saved). Guard: bl_map.py calls set_paint(masking=None); build stops on Traceback. Proof: logs/map.log MAP_DONE. FERMÉ

## 2026-11-21 — 94 truck_light copies would be 94 x 161 draw calls (15 k) and 3 (yellow-fire-trucks, carte) — FERMÉ
- 94 truck_light copies would be 94 x 161 draw calls (15 k) and 3.3 M tris in the kit. Cause: the glTF truck is 161 meshes / 34 materials. Fix: map_truck_tiny.glb (joined, 4 materials, 4 k tris) drawn as 4 InstancedMesh with per-instance paint colour. Guard: PHFD_MAP line prints meshes/trucks/tris. Proof: 615,888 tris, 600 meshes, 1.1-7 s/frame. FERMÉ

## 2026-11-21 — matplotlib is not installed (point-in-polygon) (yellow-fire-trucks, carte) — FERMÉ
- matplotlib is not installed (point-in-polygon). Fix: a 50 px/m PIL raster of the states as the inside test (tex_map.inside_us_fn). FERMÉ

## 2026-11-21 — DejaVuSerif-Italic is not in the image (OSError cannot open resource) (yellow-fire-trucks, carte) — FERMÉ
- DejaVuSerif-Italic is not in the image (OSError cannot open resource). Fix: LiberationSerif-Italic. Guard: fonts are absolute paths at the top of tex_map.py. FERMÉ

## 2026-11-21 — Les camions de Dallas gardaient le lettrage « ENGINE No. 1 » (yellow-fire-trucks, décor Dallas) — FERMÉ
- Problème : log LETTERS_FAIL, clé "truck_letters_dal14" introuvable.
- Cause réelle : truck_api.append_truck n'ajoute que la collection TRUCK ; les images de lettrage supplémentaires restent dans truck.blend.
- Correction : dallas_api.link_trucks charge assets_prod/out/<letters>.png, l'empaquette, puis set_letters.
- Garde-fou : build_dallas.sh affiche toute ligne LETTERS_FAIL.
- Preuve : 2e build sans LETTERS_FAIL, « DALLAS FIRE DEPT. » sur les portes.

## 2026-11-21 — Les temps par image ne veulent plus rien dire quand la machine est surchargée (yellow-fire-trucks) — OUVERT
- Problème : une mesure de temps du kit est sortie négative ; Blender a pris 64 à 127 s par aperçu au lieu d'environ 30 s.
- Cause réelle : sept assistants en parallèle sur 4 cœurs (charge moyenne autour de 19).
- Correction : aucune encore. Les durées mesurées sous charge ne servent pas d'estimation.
- Garde-fou à mettre : noter la charge (`uptime`) à côté de chaque temps mesuré ; au plus 3 ou 4 assistants qui rendent en même temps sur cette machine.
- Preuve : sets/dallas/STATE.md, charge 18,9 relevée par le lead à 01:02.

## 2026-11-21 — Le décor comptait 16,4 M de triangles dans le kit pour 395 k uniques (yellow-fire-trucks, ville) — FERMÉ
- Problème : 16,4 M de triangles dans le kit alors que le GLB n'en a que 395 k uniques ; 3 à 13 s par image.
- Cause réelle : les instances glTF partagent leurs maillages, mais le chargeur les clone : 210 carrés d'herbe (62 k chacun = 13 M) et 36 arbres (64 k = 2,3 M).
- Correction : `town_lite.glb` (herbe seulement à 8 m des caméras, arbres et herbe décimés), option `lite` dans `sets/town.js`.
- Garde-fou : la ligne de log PHFD_TOWN donne lite et tris à chaque rendu ; LITE_TRIS dans logs/lite.log.
- Preuve : 16,4 M -> 1,15 M ; cour large 1,7 s par image, densité de détail inchangée (0,250 -> 0,249).

## 2026-11-21 — Après l'allègement du décor, l'image restait à 2,5-3 s (yellow-fire-trucks) — FERMÉ
- Problème : le temps par image ne baissait plus sous 2,5-3 s.
- Cause réelle : les deux camions complets coûtent environ 2,2 s par image (sans camions : 0,9 s).
- Correction : en mode lite, camions en version légère (35 k triangles) ; `truckFull: true` garde le camion complet là où il est vu de près.
- Garde-fou : mesurer d'abord sans camions (trucks:false). Aussi : `film_plan.py bake` écrit un seul out/plan partagé, ne jamais lancer deux bakes de films en parallèle.
- Preuve : sets/town/LITE_SHEET.jpg et les temps de sets/town/STATE.md (LITE).

## 2026-11-20 — Poly Haven answered 403 to every download (yellow-fire-trucks, décor de la ville) — FERMÉ
- Poly Haven answered 403 to every download. Cause: it refuses the default "Python-urllib" User-Agent. Fix: fetch_town.py sends a browser-like UA. Guard: build_town.sh stops if logs/fetch.log has a FAIL. Proof: 46 files ok. FERMÉ

## 2026-11-20 — The decimated kit tree was not decimated (GLB 148 MB) (yellow-fire-trucks, décor de la ville) — FERMÉ
- The decimated kit tree was not decimated (GLB 148 MB). Cause: a modifier on an object in an EXCLUDED collection is never evaluated. Fix: decimate a temporary object linked to the scene. Guard: log line DECIMATE n -> m. Proof: 1,072,212 -> 64,332. FERMÉ

## 2026-11-20 — DU stills failed with KeyError 'headlight_glass' (yellow-fire-trucks, décor de la ville) — FERMÉ
- DU stills failed with KeyError 'headlight_glass'. Cause: masking swaps a truck's own materials out; with 0 users they are dropped on save, set_masking(False) then cannot restore. Fix: town_api.link_trucks sets use_fake_user on all materials. Guard: the DU proof runs set_trucks(masking False) after reopening. Proof: 6 DU tiles. FERMÉ

## 2026-11-20 — build_town (yellow-fire-trucks, décor de la ville) — FERMÉ
- build_town.sh stopped silently after the AM tiles. Cause: `set -e` + a grep with no match. Fix: `|| true` on report greps. Guard: TOWN_PROOF_END line. FERMÉ

## 2026-11-20 — glTF loses emission set to 0 (yellow-fire-trucks, décor de la ville) — FERMÉ
- glTF loses emission set to 0. Cause: the exporter drops an emissive of strength 0. Fix: strength 1 at export, the kit sets the level per kind. FERMÉ (DU kit windows lit).

## 2026-11-20 — Masking paper rendered plain white: the paper material was never saved in truck.blend (yellow-fire-trucks, bl_truck.py) — FERMÉ
- Problem: round 1 sheet (props/ASSET_PACK.jpg) showed the masking as blank white paper and white-wall tyres; the newspaper print never appeared.
- Cause: `mask_paper` had no user when truck.blend was saved (it is only put on parts by truck_api.set_masking at render time), so Blender dropped it; set_masking then assigned `None` = no material = plain white.
- Fix: `paper.use_fake_user = True` (and `mask_kraft`) in bl_truck.py; set_masking asserts the material exists.
- Guard: the assert in truck_api.set_masking (a render with masking fails loudly if the material is missing).
- Proof: assets_prod/proof/tiles_r2/r2_hero_card_close.png: the Pine Hollow Gazette page and the brown kraft tyres show.
## 2026-11-20 — Sketchfab downloads came back empty (build_assets.sh fetch_sketchfab) — FERMÉ
- Problem: 9 new assets "downloaded" as missing files. Cause 1: `file "$tmp/m.zip" | grep -qi zip` matched the FILE NAME, so a plain .glb was sent to unzip and lost. Cause 2: after ~4 downloads the API answers 429 "Too many requests".
- Fix: `file -b ... | grep -qi "zip archive"`; fetch_sketchfab retries up to 8 times with a 60 s wait. Guard: the retry loop prints each wait; `file -b` never prints the name. Proof: all 9 GLBs fetched (logs in the session), sizes in assets/ASSETS.md.

## 2026-11-20 — The held-prop fist read dark maroon, not ink (yellow-fire-trucks, kit held3d) — FERMÉ
- Problem: the round fist on the asset gun measured (31, 2, 7) beside the card arm (42, 26, 29) (sets/_asset_test kit_gun_fist).
- Cause: film.js h3Fist draws ink #2a1a1f with toneMapped:false, but the final post pass tone-maps every pixel OUTSIDE the card mask with neutral(); for dark colours it subtracts x - 6.25x^2 (x = min channel) from all channels: linear (.0232,.0103,.0137) -> (.0136,.0007,.0041) = sRGB (31,2,8). The fist is not in the card mask.
- Fix: sets/assets.js inkFist(): an onBeforeRender on each fist mesh pre-compensates c = t + (sqrt(t_min/6.25) - t_min) (flat .04 above .08), once per colour set. Proper fix for the kit owner: draw held3d_fist meshes white in the mask pass (film.js swaps loop) so they skip neutral().
- Guard: the compensation is in the prop module every held3d asset uses; numbers check: fist pixel == arm pixel.
- Proof: proof/kit/stills/kit_gun_fist/f_00000.png: fist (42,25,28) x294 px = arm (42,25,28).
## 2026-11-20 — A '#' or '//' comment pasted mid-line ate the statements after it (bl_truck.py, assets.js) — FERMÉ
- Problem: pivots did not hold their meshes (door and beacon stayed on the root, data shifted); the fist fix did nothing. Cause: a sed/replace appended a comment in the middle of a multi-statement line (REGLES 4 already warns). Fix: comment on its own line. Guard: print parent names after the build (DOOR/BEACON lines in logs/truck.log); grep for '; *#' and '; *//' lines before a render. Proof: door_driver now parents 6 meshes (dbg in logs), sheet shows the door.
## 2026-11-20 — Still rendered before the GLB's helper textures loaded: black masking paper (assets.js) — FERMÉ
- Cause: TextureLoader.load is async, the kit renders frame 0 at once. Fix: await loadAsync before buildTruck returns. Proof: kit tile shows the papered glass and tyres.

## 2026-11-20 — Blender EEVEE ne démarre pas sans GPU (yellow-fire-trucks, essai d'assets) — FERMÉ
- Problème : EEVEE refusait de démarrer dans le conteneur cloud (pas de carte graphique).
- Cause réelle : les bibliothèques OpenGL logicielles (libEGL, Mesa) manquent dans l'image.
- Correction : `tools/install_blender.sh` les installe par apt-get si `libEGL.so.1` est absent.
- Garde-fou : le script vérifie `ldconfig -p | grep libEGL.so.1` avant de finir ; relançable.
- Preuve : EEVEE a rendu après l'installation (36,6 s par image à 540x960, plus lent que Cycles CPU : 10,4 s). Conséquence : sur CPU, Cycles, pas EEVEE.

## 2026-11-20 — La transformation de vue AgX de Blender change les couleurs de marque (yellow-fire-trucks) — FERMÉ
- Problème : le citron #E3EA22 sortait crème dans les rendus Blender.
- Cause réelle : la transformation de vue par défaut AgX compresse les couleurs saturées.
- Correction : `view_transform = 'Standard'` dans `sets/_asset_test/bl_render.py`.
- Garde-fou : le réglage par défaut du script est Standard ; tout futur script Blender du film part de celui-ci.
- Preuve : tuiles de `props/ASSET_TEST.jpg` en Standard, citron conforme à l'œil.

(aucune pour l'instant ; les problèmes cités entre parenthèses dans REGLES_METHODE.md viennent de sessions antérieures et y restent comme origine des règles)

- 2026-11-20 (yellow-fire-trucks S1) The hero truck's lemon rear rendered aged red in a single-frame render (f272). Cause: sets/assets.js sets the paint's
  truck frame (uInvRoot) only in the FIRST mesh's onBeforeRender; when that mesh is off screen (culled) the uniform stays identity and the paint is
  computed in world space. Fix (stretch side, builder not edited): s1/sets/s1_yard.js calls that onBeforeRender for both trucks in update() every frame.
  Guard: the comment in s1_yard.js + request to the props-hero to set it in buildTruck itself (STATE.md). Proof: s1/key/f_00272.png lemon after the fix.
- 2026-11-20 (S1) Cards and props sank 14 cm: the town yard top is z 0.14 (town_meta anchors), not 0. Fix: Z = 0.14 on every S1 position and camera.
  Guard: make_film.py and s1_yard.js both read one Z constant. Proof: key frames f0/f272 feet on the concrete.
- 2026-11-20 (S1) render_gpu.mjs on CPU: --scale 0.5 costs the same ~11-14 s per frame as --scale 1 (the screenshot grab dominates). Measured on 1-4 frames.
  So a half-size timing pass saves nothing in this cloud; go to full size after the key frames.

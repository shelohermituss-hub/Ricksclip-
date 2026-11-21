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

## 2026-11-21 — Le piège du commentaire en milieu de ligne, cinquième fois, et un cas dans le kit livré (poses.mjs) — FERMÉ
- Problème : quatre fois dans ce film (pivots du camion, ancres de la ligne de cour, débruitage, matière chrome de l'iris) un « # » ou « // » placé au milieu d'une ligne à plusieurs instructions a supprimé le code qui suivait. En cherchant, l'outil a trouvé le même défaut dans le kit livré : `templates/threejs_film/poses.mjs` ligne 162, où `S.chairPose` et `S.liePose` étaient dans un commentaire, donc les poses assis sur une chaise et couché ne recevaient jamais leur dessin par ce chemin.
- Cause réelle : des modifications par sed ou par remplacement qui ajoutent un commentaire en bout de ligne, sur des lignes qui contiennent plusieurs instructions.
- Correction : commentaire sur sa propre ligne dans poses.mjs (et dans chaque fichier du film concerné).
- Garde-fou : `python tools/check_midline_comments.py <dossier>` (sort 1 si une ligne suspecte) ; à lancer avant chaque rendu et dans chaque brief d'assistant. Testé sur une faute plantée en .py et en .js.
- Preuve : check_views.mjs identique avant et après la correction (mêmes 24 « no approved picture », aucune autre différence) ; test_lie3d.mjs sort 0 ; l'outil donne 0 sur poses.mjs.

## 2026-11-21 — A sed appended a '#' comment in the middle of the iris line and ate `iris (yellow-fire-trucks, salle des lampes) — FERMÉ
- A sed appended a '#' comment in the middle of the iris line and ate `iris.data.materials.append(chrome)`. Cause: REGLES 4 trap again. Fix: comment on its own line. Guard: `grep -n "; *#" scripts/*.py` before every render (it caught this one). Proof: the chrome lip shows in bl_irisopen.png. FERMÉ

## 2026-11-21 — The socket asset joined to an empty list (IndexError) (yellow-fire-trucks, salle des lampes) — FERMÉ
- The socket asset joined to an empty list (IndexError). Cause: the filter `'chain' in name` also matched the asset's own name pull_chain_light_socket. Fix: `name.endswith('_chain')`. Guard: join() fails loudly on an empty list. Proof: SRC_housing built, LAMPS line in logs/build.log. FERMÉ

## 2026-11-21 — ReferenceError after bpy (yellow-fire-trucks, salle des lampes) — FERMÉ
- ReferenceError after bpy.ops.object.join. Cause: the joined objects are deleted; the loop then read their names. Fix: list the non-mesh objects before the join. Guard: in join(). Proof: logs/build.log LAMPROOM_DONE. FERMÉ

## 2026-11-21 — Lamps at emission 9 clipped in the Standard view: red read salmon, lemon read white (yellow-fire-trucks, salle des lampes) — FERMÉ
- Lamps at emission 9 clipped in the Standard view: red read salmon, lemon read white. Fix: E_ON 3.0 in lamproom_api. Guard: the constant's comment. Proof: bl_allon.png round 2, red reads red. FERMÉ

## 2026-11-21 — Mirror chrome reads black where nothing bright is in front (Blender reflector bowl; every  (yellow-fire-trucks, salle des lampes) — FERMÉ
- Mirror chrome reads black where nothing bright is in front (Blender reflector bowl; every kit chrome without an env map). Fix: brushed reflector (rough .2) + a dim violet fill (160 W blew it white, 9 W kept); kit caps metalness .55. Proof: bl_entry.png / kit entry, round 3. FERMÉ

## 2026-11-21 — Full-size kit stills died: Playwright screenshot timeout 30 s (grab took 26-56 s on the sh (yellow-fire-trucks, S3) — OUVERT
- Full-size kit stills died: Playwright screenshot timeout 30 s (grab took 26-56 s on the shared CPU) and `--grab canvas` crashed the page every time (also on S1's film). Fix: s3/tools/render_s3.mjs = render_gpu.mjs with a 240 s screenshot wait. Guard: comment line 1 of the copy. Proof: key/*.png. OUVERT for the kit owner (a --grab-timeout flag in render_gpu.mjs).

## 2026-11-21 — Chrome was OOM-killed (memory cgroup shared by all helpers; Blender proofs peak) (yellow-fire-trucks, S3) — FERMÉ
- Chrome was OOM-killed (memory cgroup shared by all helpers; Blender proofs peak). Fix: render_keys.sh renders ONE frame per process and waits for 3.8 GB free. Guard: logs/keys.log line per try. Proof: 1 kill in 16 tries after the wait (about 14 before).

## 2026-11-21 — film_plan (yellow-fire-trucks, S3) — FERMÉ
- film_plan.py check counts film-wide gates from frame 0; a stretch on absolute frames (S3 starts at 474) FAILs "first face", "faces in the first 15 s", "longest without a face", rests/effects/moods per minute. Fix: check_shifted.py checks a copy shifted to 0 (words too). Guard: run both. Proof: 3 vs 0 FAIL.

## 2026-11-21 — camera v2 moves a hold-0 station later than its `at` (wants 48-67 f per travel): row pictu (yellow-fire-trucks, S3) — FERMÉ
- camera v2 moves a hold-0 station later than its `at` (wants 48-67 f per travel): row pictures on via points land ~25 f late. Guard: project the cast on the baked camera at the word frame before rendering (s3/proj_cast.py). Proof: f643 Milkman off frame.

## 2026-11-21 — the step-van card: in a 3/4 card the act `dir` flips which screen side he faces, not plan  (yellow-fire-trucks, S3) — FERMÉ
- the step-van card: in a 3/4 card the act `dir` flips which screen side he faces, not plan left/right: from camera B dir -1 = his look LEFT.

## 2026-11-21 — film_plan check on a stretch file FAILed first face, face share, speed median (9 FAIL) (yellow-fire-trucks, S2) — OUVERT
- film_plan check on a stretch file FAILed first face, face share, speed median (9 FAIL). Cause: every gate counts from frame 0; a stretch starting at f288 carries 288 parked lead-in frames with no cast. Fix: s2/plan_window.py shifts a copy by -288 (words too) and runs the gates on the window only. Guard: plan_check_window.txt beside plan_check.txt. Proof: same stations, 9 FAIL -> real faults only, now 0 FAIL. OUVERT for the tool (a --stretch flag).

## 2026-11-21 — The first station at S1's last framing made the pull back start ~3 s BEFORE f288 (yellow-fire-trucks, S2) — FERMÉ
- The first station at S1's last framing made the pull back start ~3 s BEFORE f288. Cause: film_plan forces the first station's arrive to frame 0, so the v2 speed stretch takes the whole lead-in as "rest before". Fix: an anchor station at f0 with the same pose; the real first station at 288 with a hold. Guard: the baked camera at f288 must equal station 1 (proj check). Proof: camera at f288 = (1.2, -5.3, 2.1). FERMÉ

## 2026-11-21 — scene (yellow-fire-trucks, S2) — FERMÉ
- scene.getObjectByName('desk_lamp_arm_01.000') found nothing. Cause: GLTFLoader sanitises node names (the '.' is dropped). Fix: match by regex /^desk_lamp_arm_01/. Guard: s2_shop.js warns "not found" in the render log. Proof: the lamp clone is on the table in key/f_00344. FERMÉ

## 2026-11-21 — render_gpu (yellow-fire-trucks, S2) — FERMÉ
- render_gpu.mjs stills died "locator.screenshot: Timeout 30000ms" with 7 helpers on the CPU. Cause: software mode defaults to grab screenshot, the compositor misses 30 s under load. Fix: --grab canvas. Guard: render_key.sh passes it. Proof: 6 frames, 31 s each. FERMÉ

## 2026-11-21 — The shop moves played 40 f ahead (the knuckle at the eye on "job", the toy out before "str (yellow-fire-trucks, S2) — FERMÉ
- The shop moves played 40 f ahead (the knuckle at the eye on "job", the toy out before "strange"). Cause: an episode move's clock starts at the FIRST act that sets the pose (heroShop at f288, hidden); re-setting the same pose at f328 does not restart it. Fix: he_shop f = F(t) + 288. Guard: board LINE CHECK tiles (the action must match the CAPS word). Proof: f386 knuckle at the mirror on "eye", f440 toy out on "strange". FERMÉ

## 2026-11-21 — camsafe validate: 126 of 146 checks FAIL VIEW_MISMATCH (yellow-fire-trucks, S2) — FERMÉ
- camsafe validate: 126 of 146 checks FAIL VIEW_MISMATCH. Cause: the moves always returned view '34' while apply_looks (act "look") asked front or side. Fix: ep_s2.mjs exports `default` (side) and `front` (front; camsafeView turns it to 3/4 or back). Guard: validate.mjs in the cycle. Proof: 146/146 PASS. FERMÉ

## 2026-11-21 — Deux pavés superposés faisaient un trou noir au coin du carrefour (yellow-fire-trucks, ville) — FERMÉ
- Problème : une tache noire nette au coin du trottoir. Cause : deux boîtes de pavé coplanaires qui se chevauchaient. Correction : y -7,5 / 7,5, plus de chevauchement. Garde-fou : commentaire dans la boucle ; chercher des boîtes coplanaires dès qu'une tache noire dure apparaît. Preuve : FIX_SHEET vignettes 1 et 2.

## 2026-11-21 — Un « # » au milieu d'une ligne a encore supprimé du code (ville : ancres de la ligne de cour, débruitage) — FERMÉ
- Problème : les deux ancres de la ligne de cour avaient disparu, et le débruitage OIDN n'était jamais appliqué aux aperçus. Cause : un commentaire « # » collé au milieu d'une ligne à plusieurs instructions (déjà dans REGLES_METHODE section 4, revenu deux fois). Correction : commentaire sur sa propre ligne. Garde-fou : le build vérifie maintenant les 21 ancres ; chercher « ; *# » avant un rendu. Preuve : proof/fix.

## 2026-11-21 — Les images du kit dépassent la limite de 30 s quand la machine est chargée (yellow-fire-trucks) — OUVERT
- Problème : la boutique et le parc du soir ont échoué au premier essai, réussi au second. Cause : charge moyenne autour de 22 (7 assistants). Correction à faire : un réglage de délai par film dans le kit. En attendant : relancer une image à la fois.

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

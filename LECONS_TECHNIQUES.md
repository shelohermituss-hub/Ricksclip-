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

## 2026-11-21 — Le suivi de caméra de Blender ne tourne qu'avec un écran virtuel, et son point principal est normalisé en Blender 5 (projet privé car_science) — FERMÉ
- Problème : les outils de suivi (bpy.ops.clip) échouaient en mode batch ; ensuite toutes les résolutions de caméra étaient fausses.
- Cause réelle : les opérateurs du suivi demandent un éditeur de clip, donc une fenêtre ; et en Blender 5 le point principal de la caméra de suivi est normalisé (0 = centre), alors qu'on le donnait en pixels.
- Correction : lancer Blender sous Xvfb (écran virtuel) pour le suivi ; donner le point principal en coordonnées normalisées.
- Garde-fou : vérifier l'erreur médiane de reprojection après chaque résolution (attendu sous 1 px).
- Preuve : 0,22 px de reprojection médiane après correction ; plan S3 résolu à 0,50 px.

## 2026-11-21 — Le client Python de la machine RunPod recevait 403 alors que curl passait (proxy RunPod) — FERMÉ
- Problème : HTTP 403 à chaque appel de tools/runpod/pod.py, alors que curl obtenait 200 sur la même adresse avec le même jeton.
- Cause réelle : le proxy de RunPod refuse l'User-Agent par défaut « Python-urllib » (même piège que Poly Haven le même jour).
- Correction : pod.py envoie un User-Agent explicite.
- Garde-fou : tout client HTTP en Python de ce dépôt envoie un User-Agent explicite.
- Preuve : `python tools/runpod/pod.py health` renvoie « ok blender=Blender 5.3.0 ».

## 2026-11-21 — Les personnages glissaient d'un plan à l'autre à travers une coupe (kit, film_plan.py) — OUVERT pour l'outil
- Problème : le personnage traversait l'image en grand entre deux plans et restait hors de la voiture.
- Cause réelle : film_plan.bake_performance fait glisser tout changement de position (`pos`) sur 0,5 s, même à travers une coupe franche vers un autre lieu.
- Correction : dans le make_film.py du film, réécrire la position image par image en marches après la cuisson (chaque changement de lieu est une coupe). Correction de fond à faire dans tools/film_plan.py : ne pas lisser une position à travers une coupe.
- Preuve : images tests du projet privé car_science, avant/après.

## 2026-11-21 — Un GLB exporté perd la couleur de peinture d'un nœud de shader (Blender vers three.js) — FERMÉ
- Problème : la voiture bleue sortait blanche dans le kit. Cause : la couleur venait d'un nœud de shader que l'export glTF n'emporte pas. Correction : le module du kit remet la couleur au chargement ; mieux, mettre la couleur de base directement dans le matériau avant l'export.

## 2026-11-21 — Rendus Blender tués par manque de mémoire avec de vrais arbres et Freestyle (décor privé car_science) — OUVERT
- Problème : 2 vignettes sur 4 tuées par manque de mémoire une fois 11 arbres Poly Haven ajoutés et les contours Freestyle activés, pendant qu'un autre assistant rendait avec Chromium.
- Cause réelle : la machine partage environ 15 Go entre tous les assistants ; des arbres réalistes en instances plus Freestyle (qui garde toute la géométrie en mémoire pour tracer les lignes) dépassent ce que la machine peut tenir à côté d'un autre rendu.
- Correction à appliquer : rendre une vignette à la fois quand rien d'autre de lourd ne tourne ; ou tracer les contours dans une deuxième couche sans les arbres ; ou rendre ces décors réalistes sur RunPod (plus de mémoire).
- Garde-fou à mettre : vérifier la mémoire libre (`free -g`) avant de lancer un rendu Blender avec végétation, et ne pas lancer deux rendus lourds en même temps.

## 2026-11-21 — L'herbe en poils devenait des murs verts de 2 m (Blender 5.3, décor privé car_science) — FERMÉ
- Problème : l'herbe rendait comme des murs verts. Cause : régler `normal_factor` après `hair_length` recalcule la longueur. Correction : régler hair_length en dernier, ne jamais toucher normal_factor. Garde-fou : hair_length est le dernier réglage de grass(). Preuve : gazon de 7 cm au 2e tour.

## 2026-11-21 — Construire un décor de 1 100 boîtes avec bpy.ops prend 80 s (Blender) — FERMÉ
- Cause : chaque appel bpy.ops met la scène à jour. Correction : créer les boîtes en données bmesh. Preuve : 43 s.

## 2026-11-21 — Une caméra calée sur un seul plan ne sépare pas la distance de l'objectif (calage de caméra sur une image de référence) — OUVERT
- Problème : les points de la porte de garage collent pour n'importe quel champ de vision. Correction : ajouter un indice de profondeur (taille connue d'un objet à une autre distance) ou des valeurs a priori sur la hauteur et l'objectif, et le dire.

## 2026-11-21 — L'image clé B a été rendue sur le processeur du serveur RunPod au lieu de la carte RTX 4090 (yellow-fire-trucks, cine B) — FERMÉ
- Problème : « DEVICE CPU fallback » dans le log ; 1 063 s de rendu au lieu d'environ 2 à 4 min sur la carte (l'image A, même machine, avait pris 50 s avec OptiX). Payé environ 18 min de machine pour rien.
- Cause réelle : pour éviter un message « enum METAL not found », le script B lisait la liste des types d'appareil (`enum_items`) avant que Blender la remplisse : en mode batch, cette liste est dynamique et ne contient pas encore OPTIX ni CUDA, donc aucun type GPU n'était essayé.
- Correction : retour à la boucle de A qui essaie OPTIX, CUDA, HIP, ONEAPI un par un (METAL retiré : Linux) dans cine/runpod/B/render.sh.
- Garde-fou : avant de lancer un rendu long sur RunPod, rendre d'abord une image à 1 % de la résolution sur le pod et exiger « DEVICE OPTIX » ou « DEVICE CUDA » dans le log ; sinon arrêter.
- Preuve : log A « DEVICE OPTIX ['NVIDIA GeForce RTX 4090'] » contre log B « DEVICE CPU fallback ».

## 2026-11-21 — An OFF red lamp still read lit in Blender (yellow-fire-trucks, cine key B) — FERMÉ (cine), OUVERT (set API)
- Problème : key frame B (wave 4, all red off): every red bulb read bright red in the Blender preview; the kit shows dark red rings.
- Cause réelle : lamproom_api.set_state sets only the emission to 0; the glass keeps base colour (.65, .01, .01) rough .15, lit by the lemon/blue lamps and fills.
- Correction : cine/build_B.py multiplies the base colour of bulb_red_on/flick_g1-4 by .18 (the set's own dead-bulb colour) when off.
- Garde-fou : the kit | Blender pair (CINE_KEYS.jpg row B) before any package; set-builder to move it into set_state.
- Preuve : prev/prev_B.png round 2 vs round 1: red bulbs dark with a small red pip, like kit_B/f_01293.png.

## 2026-11-21 — The RunPod log test counted a "not found" that was not a file (yellow-fire-trucks, cine render.sh) — FERMÉ
- Problème : the 10 % test of runpod/B logged 1 "not found".
- Cause réelle : the device probe sets compute_device_type to "METAL", an enum value Linux Blender 5.3 does not have: 'enum "METAL" not found'.
- Correction : runpod/B/render.sh probes only the types in compute_device_type.enum_items.
- Garde-fou : `grep -ci "not found" out/blender.log` = 0 after `PCT=10 SPP=8 bash render.sh` from a scratch copy of the package.
- Preuve : scratchpad pkgtest run: NOTFOUND 0, B_final.png written.

## 2026-11-21 — Lamp-room window pictures packed from an absolute path (yellow-fire-trucks, cine key B) — FERMÉ
- Problème : the window images are stored 'out/window_*.png' relative to the working folder (lamproom entry above, OUVERT).
- Cause réelle : bl_lamproom.py loaded them with a relative path.
- Correction : build_B.py sets im.filepath to sets/lamproom/out/<name>, reload, pack, before anything else.
- Garde-fou : WINDOW_PACKED lines in logs_B_pkg.log; the package test runs from a scratch copy, where no relative path can resolve.
- Preuve : scratch-copy render at 10 % shows the grey truck in the pupil.

## 2026-11-21 — The solved grade gain dimmed the lamps (yellow-fire-trucks, cine key B) — FERMÉ
- Problème : preset B at mean .27 solved a world gain of .72; the white point fell to .71 and the lit lamps went dull.
- Cause réelle : the light in the scene was too high (set fills and a 650 W window light lit the deck and dome grey), and black lift + veil + haze added more.
- Correction : light lowered in build_B.py (fills x.5, window x.5, spill 18 W), preset B black .06, veil .06, haze .08: gain .905, white .893.
- Garde-fou : grade_key.py prints 'world gain'; below .85 = fix the light in Blender, not the grade.
- Preuve : prev/gradeB.json (mean .270, dark1 .086, white .893).

## 2026-11-21 — problem: the Dallas trucks kept the ENGINE No (yellow-fire-trucks, dallas, fix 2) — FERMÉ
- problem: the Dallas trucks kept the ENGINE No. 1 letters (log LETTERS_FAIL, key "truck_letters_dal14" not found). Cause: truck_api.append_truck appends the TRUCK collection only; the extra letter images live in truck.blend with a fake user and do not come along. Fix: dallas_api.link_trucks loads assets_prod/out/<letters>.png, packs it, then set_letters. Guard: build_dallas.sh prints any LETTERS_FAIL line. Proof: run 2 has none, DALLAS FIRE DEPT. on the doors. FERMÉ

## 2026-11-21 — problem: kit "second frame" seconds came out negative (-2 (yellow-fire-trucks, dallas, fix 2) — OUVERT
- problem: kit "second frame" seconds came out negative (-2.1 s). Cause: the time is (frames 0,1) - (frame 0) of two separate runs, and the shared CPU (load 14 on 4 cores) changes the page load time between runs by more than a frame. Fix: none yet; read the numbers as noise when the load is high. Guard: write the load average next to timings (`uptime` in run_kit.sh: TO ADD). OUVERT

## 2026-11-21 — The far landmarks (tank, derrick, skyline) were in the set but never in a frame (yellow-fire-trucks, dallas, fix 2) — FERMÉ
- The far landmarks (tank, derrick, skyline) were in the set but never in a frame. Cause: placed by plan only; from a 1.3 m camera 18 m from a 6.3 m roof, anything under 16 deg up hides (a 38 m tank at 163 m is 13 deg). Fix: place far things by the elevation test against the roof and the sign from the shot cameras. Guard: the s5/s7 cams in dallas_cams.json are proof tiles. Proof: FIX2_SHEET tiles 2, 3, 6, 7. FERME

## 2026-11-21 — The apron read warm sand after a grey tint (yellow-fire-trucks, dallas, fix 2) — FERMÉ
- The apron read warm sand after a grey tint. Cause: tint() keeps 25-50 % of the source colour and the Poly Haven concrete is brown (85/60/41). Fix: keep .1 + pull the grain to the mean. Guard: tex_dallas prints nothing: check the texture mean (python one-liner in STATE) before a build. Proof: tiles 2/3. FERME

## 2026-11-21 — Kit street-lamp halo a third of the sky wide; making the sprite and the lens emission smal (yellow-fire-trucks, town, fix 2) — FERMÉ
- Kit street-lamp halo a third of the sky wide; making the sprite and the lens emission smaller changed nothing (mean diff 1/255). Cause: the post bloom (quarter-res blur, 168 px radius) fed by the globe lit by the lamp's own PointLight 0.3 m away (inverse square). Fix: town.js globe base black + emissive only, light .9 m lower. Guard: comment in town.js; test a halo with post.bloom 0 and the place option at 0 before changing art. Proof: proof/kit/stills/t_bloom0 vs t_glow0 vs du_crossing_lite (sky patch 161 -> 82). FERME

## 2026-11-21 — A swing seen from the north read as one rope (yellow-fire-trucks, town, fix 2) — FERMÉ
- A swing seen from the north read as one rope. Cause: both ropes on the camera axis (y -19.3 / -18.7) and the seat end-on. Fix: ropes along x. Guard: build hanging/flat props facing the shot cameras listed in the CAMERA_NOTE. Proof: FIX2_SHEET tiles 3 and 7. FERME

## 2026-11-21 — A sed appended a '#' comment in the middle of the iris line and ate `iris (yellow-fire-trucks, lamproom, fix 2) — FERMÉ
- A sed appended a '#' comment in the middle of the iris line and ate `iris.data.materials.append(chrome)`. Cause: REGLES 4 trap again. Fix: comment on its own line. Guard: `grep -n "; *#" scripts/*.py` before every render (it caught this one). Proof: the chrome lip shows in bl_irisopen.png. FERMÉ

## 2026-11-21 — The socket asset joined to an empty list (IndexError) (yellow-fire-trucks, lamproom, fix 2) — FERMÉ
- The socket asset joined to an empty list (IndexError). Cause: the filter `'chain' in name` also matched the asset's own name pull_chain_light_socket. Fix: `name.endswith('_chain')`. Guard: join() fails loudly on an empty list. Proof: SRC_housing built, LAMPS line in logs/build.log. FERMÉ

## 2026-11-21 — ReferenceError after bpy (yellow-fire-trucks, lamproom, fix 2) — FERMÉ
- ReferenceError after bpy.ops.object.join. Cause: the joined objects are deleted; the loop then read their names. Fix: list the non-mesh objects before the join. Guard: in join(). Proof: logs/build.log LAMPROOM_DONE. FERMÉ

## 2026-11-21 — Lamps at emission 9 clipped in the Standard view: red read salmon, lemon read white (yellow-fire-trucks, lamproom, fix 2) — FERMÉ
- Lamps at emission 9 clipped in the Standard view: red read salmon, lemon read white. Fix: E_ON 3.0 in lamproom_api. Guard: the constant's comment. Proof: bl_allon.png round 2, red reads red. FERMÉ

## 2026-11-21 — Mirror chrome reads black where nothing bright is in front (Blender reflector bowl; every  (yellow-fire-trucks, lamproom, fix 2) — FERMÉ
- Mirror chrome reads black where nothing bright is in front (Blender reflector bowl; every kit chrome without an env map). Fix: brushed reflector (rough .2) + a dim violet fill (160 W blew it white, 9 W kept); kit caps metalness .55. Proof: bl_entry.png / kit entry, round 3. FERMÉ

## 2026-11-21 — Cabinet tint never took: nodes (yellow-fire-trucks, lamproom, fix 2) — FERMÉ
- Cabinet tint never took: nodes.get('Principled BSDF') was None on the glTF material. Fix: find by type, log CABINET_TINT. Guard: the log line. Proof: tile 4. FERME

## 2026-11-21 — Darker deck tint changed nothing: metal  (yellow-fire-trucks, lamproom, fix 2) — FERMÉ
- Darker deck tint changed nothing: metal .6 mirrored the lamps. Fix: metal 0, rough x1.8. Guard: check metal first. Proof: band std .198 -> .047. FERME

## 2026-11-21 — Window images are stored 'out/window_* (yellow-fire-trucks, lamproom, fix 2) — OUVERT
- Window images are stored 'out/window_*.png' relative to the CWD: Blender must run from sets/lamproom. Guard: IMGPATHS print. OUVERT (pack for RunPod).

## 2026-11-21 — The rebuilt tiny truck came out in shards (kit bays) (yellow-fire-trucks, map, fix 2) — FERMÉ
- The rebuilt tiny truck came out in shards (kit bays). Cause: assets_prod truck_light grew to 37,236 tris (02:15) and one COLLAPSE decimate to 4,000 tore it. Fix: bl_map_lite planar dissolve 4 deg, then collapse only above 6,000 (37,236 -> 6,000). Guard: TINY_DEC line in logs/fix2_lite.log; look at a kit close after any assets_prod change. Proof: FIX2_SHEET tile 7 (kit dallas: whole lime trucks). FERME

## 2026-11-21 — Doubling pastel tints only moved Blender saturation  (yellow-fire-trucks, map, fix 2) — OUVERT
- Doubling pastel tints only moved Blender saturation .19 -> .25. Cause: the closes are mostly cream station walls and grey sky, not print. Fix: tints x3 + warm card walls. Guard: measure saturation per tile (fix2_sheet.py). Proof: 4 of 5 tiles >= .30. FERME for the set; station_open OUVERT (sky, lead).

## 2026-11-21 — Truck paint computed in world space when the truck's first mesh is off screen (yellow-fire-trucks, assets.js) — FERMÉ
- Problème : S1 f272, the lemon rear of the hero rendered aged red; every stretch (S1, S2, S3, S5, S7, S8) copied a workaround.
- Cause réelle : uInvRoot (the paint frame) was refreshed only in the FIRST mesh's onBeforeRender; three.js skips onBeforeRender of a culled mesh, so the inverse stayed identity.
- Correction : `sets/assets.js` buildTruck overrides the truck group's updateMatrixWorld / updateWorldMatrix (the renderer calls them every frame) to refresh the inverse, plus onBeforeRender on every paint mesh; `T.update()`.
- Garde-fou : proof tile `assets_prod/proof/kit_r3` mode "rear" (camera on the rear, no workaround) in `build_assets.sh --proof`.
- Preuve : `props/PROPS_R3.jpg` tile 3: lemon rear correct without the workaround.

## 2026-11-21 — Blender node colours vanish in the GLB (yellow-fire-trucks, props) — FERMÉ
- Problème : the kit showed the navy lunch box WHITE and the cream milk van GREEN (the download's paint); stretches repainted them by hand.
- Cause réelle : the colour was a Blender node trick (Mix with noise, object-space band); the glTF exporter only writes a texture or a flat factor, so it wrote nothing (white) or the original texture.
- Correction : bake the colour into the texture (van, lemon: numpy in Blender), real geometry for the stripe, and `bl_props2.save(glb_plain=)` (flat factor for the GLB export only, nodes relinked for the .blend).
- Garde-fou : `python3 assets_prod/scripts/check_glb_colours.py out/*.glb` (exit 1 on a material with neither texture nor factor), run by `build_assets.sh`.
- Preuve : check prints enamel_navy [0.018, 0.034, 0.112], GLB_COLOURS flags 0; kit lawn tile shows the navy box and the cream van.

## 2026-11-21 — Ribbon "around" the truck stood 0.2-0.4 m off the body (yellow-fire-trucks, bl_truck.py) — FERMÉ
- Problème : the mayor's ribbon floated off the doors and the pump panel.
- Cause réelle : convex hull of every painted vertex at band height: the wheel fenders (|y| 1.26 m) set the hull, the body is 0.87-1.05 m.
- Correction : per-side outer profile every 5 cm from all meshes but the wheels, points |y| <= 1.10 m, window 0.2 m, smoothed, 1.2 cm proud.
- Garde-fou : the build log prints `R3 ribbon profile y(-) min/max` (max must stay under 1.12).
- Preuve : log 0.312 / 1.11; PROPS_R3 tiles 1-2 (Blender + kit).

## 2026-11-21 — A comment I inserted before "; next statement" disabled the statement (yellow-fire-trucks, bl_props3.py) — FERMÉ
- Problème : the grey tint of the lost things was silently skipped (a scripted replace put "# ..." in front of "; tint.inputs[7] = ...").
- Cause réelle : the known midline-comment trap (REGLES 4), this time made by a text replace, not by hand.
- Correction : comment moved to its own line.
- Garde-fou : `python tools/check_midline_comments.py <dir>` before every render (it caught this one before the proof).
- Preuve : MIDLINE_COMMENTS 0 on assets_prod/scripts and sets/assets.js before the last renders.

## 2026-11-21 — Le « temps de capture » de 11 à 20 s n'était pas la capture (kit three.js, rendu logiciel) — FERMÉ
- Problème : 13 à 22 s par image en taille réelle, dont 11 à 20 s attribuées à la capture d'écran ; des rendus tués par la limite de 30 s.
- Cause réelle : SwiftShader exécute encore les commandes GL de l'image après le retour de renderFrame ; la capture attend ce travail. Le coût vient des pixels (multi-échantillonnage, ombres douces, flou du look), pas de la capture. Les plantages « --grab canvas » étaient des tués par manque de mémoire (dmesg), pas le mode de capture.
- Correction : `render_gpu.mjs --grab fast` (capture réelle 0,2 à 0,3 s, attente sans limite de 30 s), `--grab-timeout <s>`, et une image ratée est réessayée une fois sur une page neuve ; les images qui ratent deux fois sont listées et la sortie vaut 3.
- Garde-fou : utiliser `--grab fast` dès que la machine est partagée ; pour accélérer vraiment, réduire les pixels (`--scale 0.5` : 5,5 s par image au lieu de 15 à 29 s) ou une carte graphique.
- Preuve : pixels identiques au mode capture d'écran (écart 0 à 2 pixels, moins que le bruit entre deux captures) ; renderer tué par kill -9 puis réessayé, sortie 0. Détails : templates/threejs_film/GPU_RENDER.md.

## 2026-11-21 — (S6) A one-place film copy that starts mid-film baked its first station as a flowed-throug (yellow-fire-trucks, S6) — FERMÉ
- (S6) A one-place film copy that starts mid-film baked its first station as a flowed-through travel (camera at the exit at f1236). Cause: film_plan bakes from frame 0; the take's first station was the first point. Fix: make_film.py prepends a copy of the first station at at=0 in every film_<place>.json. Guard: proj_s6.py prints state/pos per key frame before rendering. Proof: f1236 = CAM_ENTRY rest (BOARD). FERME

## 2026-11-21 — (S6) Two of my stations were silently flowed through (cross I f1470, park F): v2 wants 1 (yellow-fire-trucks, S6) — OUVERT
- (S6) Two of my stations were silently flowed through (cross I f1470, park F): v2 wants 1.5 s + .25 s/m of travel, rows were 1-1.5 s apart. Fix: hand-set travel (flagged above). Guard: grep "flowed through" in logs/bake_<place>.txt. Proof: f1484 rest on the Milkman. OUVERT (camera lead: travel rule vs dense rows).

## 2026-11-21 — (S6) Kit chrome at 0 (yellow-fire-trucks, S6) — FERMÉ
- (S6) Kit chrome at 0.3 m read as a black disc (no env map). Fix: MeshMatcapMaterial ring + faint glass sheen over the asset rim (s6_world.js dal). Guard: comment in the code. Proof: f1233. FERME for the board; Blender final needs none.

## 2026-11-21 — (S6) Key frames on a word must be ceil(word start x 30): 44 (yellow-fire-trucks, S6) — FERMÉ
- (S6) Key frames on a word must be ceil(word start x 30): 44.38 s x 30 = 1331.4, so f1331 is still "bright". Guard: board.py prints the word on the frame.

## 2026-11-21 — plan_window (yellow-fire-trucks, S5) — FERMÉ
- plan_window.py (from s2) read 4 % "at rest" on a 4.9 s hold. Cause: the f0 lead-in anchor shifted to f-969 in the window copy and its default creep (0.0028) carried into the window's first rest. Fix: plan_window drops stations before the window; the anchor gets creep 0. Guard: the comment in plan_window.py. Proof: at rest 4.3 % -> 41-59 %, real camera at 969 unchanged. FERMÉ

## 2026-11-21 — Camera v2 stretched the travel out of a short rest and the camera was not on UP TO 3x on " (yellow-fire-trucks, S5) — FERMÉ
- Camera v2 stretched the travel out of a short rest and the camera was not on UP TO 3x on "three" (it had left at 1151 for the headlamp). Cause: v2 wants 1.5 s + 0.25 s/m per travel and starts it early from the previous rest. Fix: the drop to the headlamp is a whip (place change), the 3x station at 1166. Guard: print camera_baked state at the word frames before rendering. Proof: f1168 state rest at the 3x framing. FERMÉ (picture: BOARD.jpg)

## 2026-11-21 — Mid-stretch "rest creep" sits on a knife edge between two gates (at rest < 2 px/f >= 30 %  (yellow-fire-trucks, S5) — OUVERT
- Mid-stretch "rest creep" sits on a knife edge between two gates (at rest < 2 px/f >= 30 % and speed median about 4): creep .0012 -> median FAIL, .0021 -> at-rest FAIL, .0018 passes both. Guard: try 3 creep values in one loop (make_film + bake + plan_window). OUVERT for the tool (a window-aware gate).

## 2026-11-21 — A planned stillness at the END of a stretch cannot be followed by a camera move in the sam (yellow-fire-trucks, S7) — OUVERT
- A planned stillness at the END of a stretch cannot be followed by a camera move in the same stretch under camera v2. Cause: v2 times every travel (a whip is stretched to stay under 46 px/f: 36 f here), so the move starts inside the stillness. Fix: end the stretch on the frozen tableau; the next stretch carries the move. Guard: print camera_baked state over the stillness frames (must read rest with zero motion). Proof: 1730-1754 rest. FERMÉ (for the plan: OUVERT, lead decision)

## 2026-11-21 — Painters spraying a truck side face the truck, so a lens on the open side sees their BACKS (yellow-fire-trucks, S7) — FERMÉ
- Painters spraying a truck side face the truck, so a lens on the open side sees their BACKS. Fix: stand them rear-ward of the patch, spraying forward-diagonal, lens south-east: apply_looks gives 3/4 front. Guard: camsafe validate (FACE_BEHIND) before rendering. Proof: 537/537 PASS. FERMÉ

## 2026-11-21 — People on the map: cast at real height would be giants beside 0 (yellow-fire-trucks, S4) — FERMÉ
- People on the map: cast at real height would be giants beside 0.76 m station models. Fix: cast height x META truck_scale (0.088), positions on map_geo.fold_z + 7 mm (station base minus fold_z). Guard: make_film.py derives both from the set files. Proof: f936/f956 feet on the apron, shadows. FERMÉ

## 2026-11-21 — Painters drew in BACK view in the plan (yellow-fire-trucks, S4) — FERMÉ
- Painters drew in BACK view in the plan. Cause: `look` aimed into the bay, behind them from the lens, so apply_looks turned them away. Fix: no `look`, dir only. Guard: debug projection of perf views (head_box) before rendering. Proof: f860 painters in 3/4. FERMÉ

## 2026-11-21 — Fist "over the eyes" sat at the mouth (yellow-fire-trucks, S4) — FERMÉ
- Fist "over the eyes" sat at the mouth. Cause: the big-head puppets have eyes about S - .88 L, not S - .66 L. Fix: eye level S - .88 L, brim S - 1.08 L. Guard: board LINE CHECK tile. Proof: f936 Sceptic fist across the eyes. FERMÉ

## 2026-11-21 — Map paint/door story timing cannot be set per station in map (yellow-fire-trucks, S4) — OUVERT
- Map paint/door story timing cannot be set per station in map.js. Fix: s4_map.js calls map.js update() then overwrites instanceColor (2*i+k) and door_ii_d scale.y. Guard: comment in s4_map.js. Proof: f860 red noses + lime mist, f884 lime. OUVERT for the set (a per-station API).

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
- 2026-11-21 (yellow-fire-trucks S1 fix round) A black square at f200 (S1 v1). Cause: steam age a = (E+1)/26 went above 1 while the sprite was still on, and
  (1 - a) ** 1.1 of a negative number is NaN -> NaN opacity draws black. Fix: a clamped to 0..1, steam off at E 25. Guard: comment in s1/sets/s1_yard.js;
  rule: never raise a value that can go negative to a fractional power in an effect. Proof: re-rendered f195-205 (S1 fix round).
- 2026-11-21 (same fix) My edit added a "//" comment in the middle of the one-line steam forEach and swallowed `const ang = ...` (ReferenceError, every frame
  failed). tools/check_midline_comments.py did NOT flag it (the swallowed text "const ang = (i / 16) * ..." ends without ";" on that line, so CODE_AFTER_JS
  misses it). Fix: comment moved to its own line. Guard: `node --check` is not enough either (it parses); render one frame after every set-module edit.
- 2026-11-21 (yellow-fire-trucks cine, key frame A) The Blender cast mask from the Object Index pass was speckled where the lemon mist volume sits in front of a
  card's clear area (and the Z pass is random inside volumes, so depth haze and depth blur turned to grain there). Fix: cine/make_mask.py draws the cast mask
  exactly from the kit dump (card alpha warped to its projected corners, 99.5 % agreement with the ID pass elsewhere); grade_key.py median-filters the depth.
  Guard: grade_key.py takes the drawn mask, never the ID pass. Proof: prev/prevA_graded.png has no grain in the mist. FERMÉ
- 2026-11-21 (same) Card SHADOW PASS "did not work": the sun-facing shadow card cast fine (ray_cast hit it; an emission card does block Cycles shadow rays),
  but the town's AM sun (az 205) put the hero in the truck's shade and threw the figure shadow out of frame to the right. Fix: per-framing key angle checked
  by ray_cast from the feet toward the sun BEFORE rendering (az 255, el 28 for S1 f0). Guard: project the shadow tip into the frame first (60-75 s per preview
  saved). Proof: build_A.py info mode SHRAY lines. FERMÉ
- 2026-11-21 (same) Kit -> Blender exact rebuild without --export-lock: render_gpu.mjs --frames N --eval cine/dump_scene.js dumps the camera matrix + fov,
  each visible card's drawn texture + world corners + UVs, the props' group matrices, the hose tube and the mist sprites (three Y-up; Blender = C M C^-1 with
  C (x,y,z)->(x,-z,y); camera = C M). The Blender frame lines up with the kit frame to the pixel. Packed blend: libraries vanish on save after append
  (LIBS [] in the test), 0 "not found" lines at 10 %. FERMÉ

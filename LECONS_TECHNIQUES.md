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

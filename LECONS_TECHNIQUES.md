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

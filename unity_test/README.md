# unity_test : refaire le plan 11 de l'exercice dans Unity

Essai privé (jamais publié). But : savoir si Unity rend ce plan **mieux et plus vite** que notre kit three.js, pour décider de la suite.
Le plan 11 a été choisi parce qu'il porte nos pires défauts actuels : un mouvement de caméra de 140 images avec un grand roulis, un nuage
d'étincelles invisible dans le kit, un personnage 2D dans un hublot.
La comparaison avec la vidéo de référence se fait dans la session cloud (la référence ne quitte pas le cloud). Ici on rend seulement **notre** version.

Machine : PC de l'utilisateur, Unity 6000.3.29f1 LTS, URP, NVIDIA 940MX (2 Go). Rendu par script (capture caméra -> PNG -> mp4), comme l'essai `shapes.mp4`.

## Ce qu'il y a dans ce dossier
| chemin | contenu |
|---|---|
| `scene/ship_lite.glb` | le décor complet du vaisseau (coque, hublots, cockpit, panneaux solaires, Terre, ciel, flamme, étincelles), fait dans Blender. Axes glTF : mètres, Y en haut. |
| `scene/earth_kit.jpg`, `scene/stars_kit.jpg` | les vraies images de la Terre (`earth`) et du ciel étoilé (`sky_dome`). Le GLB ne contient que de minuscules images de remplacement : **remplacer** la texture de ces deux matériaux par ces fichiers. |
| `scene/ship_meta.json` | ancres, palette, liste des objets mobiles (`movers`), réglages de lumière. Lecture seulement. |
| `shot11/s11_dump.json` | le plan 11, **image par image** (f867 à f1006, 30 i/s, 140 images), tel que le kit le joue. Voir plus bas. |
| `shot11/kit_stills/f_00867.jpg` ... `f_00990.jpg` | 6 images du kit en 1080x1920 aux mêmes instants : la **preuve d'alignement** (même cadrage attendu). |
| `character/newguy/` | le personnage « new guy » en morceaux : `torso_<vue>_<visage>.png` = tête + corps **sans** bras ni jambes ; `full_<vue>.png` = le même avec les membres du kit (référence) ; `rig.json` = articulations. |
| `tools/` | les scripts qui ont produit ces fichiers (côté cloud, pas besoin de les lancer). |

## s11_dump.json (axes three.js = glTF : mètres, Y en haut, repère droit)
- `camera` : une ligne par image `[f, px, py, pz, qx, qy, qz, qw, sx, sy, sz, fov_vertical_deg]`. La caméra regarde vers son **-Z local** (convention glTF / three.js). Image 1080x1920 (portrait), fov vertical donné (de 20 à 45°).
- `nodes` : les objets du GLB qui bougent (`ship_root` = tout le vaisseau, `earth`, `earth_rim`, `sky_dome`, `solar_fan_n/p`, `porthole_b_room_*`). Ligne `[f, px, py, pz, qx, qy, qz, qw, sx, sy, sz, visible]` en **monde**. Une ligne n'est écrite que quand la valeur change : garder la dernière valeur connue.
- `cards.newguy` : la carte du personnage, `[f, pos(3), quat(4), scale(3), visible]`. Le **point d'origine de la carte = ses pieds** (ligne de sol). `scale.x` = largeur de la carte en m, `scale.y` = hauteur de la carte en m (la carte fait 800x1500 px, sol à 1440 px). Visible de f867 à f883 ; il glisse de côté et en profondeur f876-884 (sortie du hublot). Visage : **sourire en coin** (`torso_*_smug.png`).
- `glitter` : `[f, 'cockpit', état, scintillement, 'trail', état, scintillement]`. La traînée d'étincelles (`glitter_trail_0..3`, `glitter_collar`) apparaît **étincelle par étincelle** de f935 à f968 (état 0 -> 1).
- `lights` : la lumière du kit (soleil `DirectionalLight_13` : couleur, intensité three.js, position, **direction**). À reprendre en esprit, pas en valeur : Unity a ses propres unités.

## Conversion glTF -> Unity (le piège principal)
L'importeur glTF de Unity (glTFast) passe du repère droit glTF au repère gauche de Unity. Il faut convertir la caméra, `nodes` et `cards` **exactement de la même façon** que l'importeur l'a fait pour le GLB. Ne pas deviner : vérifier.
- Test : poser un objet témoin à l'ancre `porthole_b` (ship_meta `anchors.porthole_b`, coordonnées du plan Blender `(x, y, z)` Z en haut, soit glTF `(x, z, -y)`) converti avec ta règle : il doit tomber pile sur le 2e hublot de la coque importée.
- Puis rendre f880 et f990 et les comparer à `kit_stills/f_00880.jpg` et `f_00990.jpg` : même cadrage (nez du vaisseau en bas à droite à f990, la Terre en haut à droite). Le roulis de la caméra est dans le quaternion ; si l'image est en miroir ou tourne à l'envers, la conversion est fausse.

## Les étincelles (le point le plus important)
Chaque étincelle est une petite étoile à 4 branches dans les maillages `glitter_*`. Leur **couleur de sommet** (`COLOR_0`) n'est pas une couleur : R = phase (l'état à partir duquel l'étincelle apparaît), G = luminosité, B = graine du scintillement.
Formule du kit (à reproduire dans un shader URP non éclairé, additif, sans écriture de profondeur, double face) :
```
fade = clamp((etat * 1.15 - R) * 6.67, 0, 1)
shim = 0.55 + 0.45 * sin(2*pi * (scintillement + B))
k    = fade * shim * G
couleur = (1, 0.97, 0.92) * min(3 * k, 1)
```
Dans le kit elles sont **presque invisibles** : 1 à 3 px en 1080. Chez la référence, f960-990, c'est un **nuage dense et lumineux** qui monte en diagonale vers le haut à gauche depuis le milieu du vaisseau. Tu as le droit de faire mieux que le kit : par exemple un système de particules (ou VFX) aux mêmes positions, avec un halo (bloom URP), tant que ça apparaît f935-968 et que ça reste des petites étoiles blanches.

## Le personnage
- Recopier la marionnette de l'essai précédent : `torso_*.png` sur un plan, bras et jambes = **lignes d'encre** sur les articulations (couleur `#2a1a1f`, épaisseur 19 px de carte, mains = disques de rayon 26 px, cf. `rig.json`).
- `rig.json` `joints_card_px` : hanches, épaules, longueurs de jambe et de bras en px de carte (vue de face). Taille réelle 1,70 m ; `metres_per_px` donne l'échelle ; la carte du kit est réduite par `card_scale` 0.85 (déjà dans `scale` des cartes du dump).
- Dans ce plan il est **derrière un hublot** (on voit surtout la tête et le haut du corps) : une petite animation Mixamo d'attente nerveuse suffit (léger balancement), puis il glisse hors du hublot f876-884.
- Le personnage reçoit la lumière de la scène mais **sans ombre portée sur lui-même**, comme dans l'essai.

## Ce qu'on attend en retour
1. `s11_unity.mp4` : 1080x1920, 30 i/s, f867-1006 (140 images), sans son.
2. Les 6 images Unity aux mêmes instants que `kit_stills/` et une planche « kit | Unity » côte à côte.
3. Le temps par image (rendu, écriture) et ce qui n'a pas marché, **en première ligne**.
4. Ne pas modifier les fichiers de `scene/`, `shot11/`, `character/` : faire les réglages dans le projet Unity (dans le dossier `unityrick`, hors de ce dépôt).

## Comment récupérer ce dossier sur le PC
Dépôt GitHub `shelohermituss-hub/Ricksclip-`, branche `ccr-e4844daf-xc796n`, dossier `unity_test/`
(par exemple `git clone --depth 1 -b ccr-e4844daf-xc796n https://github.com/shelohermituss-hub/Ricksclip-.git`, ou le téléchargement zip de la branche sur GitHub).

## Résultat (2026-11-22, vérifié dans la session cloud)
- Reçu : `s11_unity.mp4` (1080x1920, 30 i/s, 140 images) + rapport `RESULTATS.md` de la session du PC (copiés dans `references/look_match/astro_flush/work/unity/`, ignoré par git).
- Conversion glTF -> Unity prouvée : `(x,y,z) -> (-x,y,z)`, quaternion `(qx,-qy,-qz,qw)`, caméra `* Euler(0,180,0)` ; 0,003 px d'écart sur 700 points.
- Temps sur la 940MX : rendu 69 ms par image, 164 ms avec l'écriture PNG ; le plan entier en environ 1 min.
- Image : Unity refait le kit presque à l'identique (mêmes données). Seul vrai gain visible : le nuage d'étincelles, dense et lumineux (le kit ne le montre pas).
  Les couleurs de coque ont dû être recalées à la main sur les images du kit.
- Fluidité f867-997 (pauses / à-coups / secousses) : kit 0,069 / 0,054 / 0,105 ; Unity 0,069 / 0,023 / 0,089 ; Rick 0,008 / 0 / 0,040.
- L'écart avec Rick vient de la mise en scène et des modèles (même trajet de caméra, même coup de roulis f935-955, dessous du vaisseau au lieu du flanc LODESTAR,
  nouveau qui reste au hublot jusqu'à f883), pas du moteur.
- README : `porthole_b` est la 3e fenêtre de la rangée (2e hublot habité).

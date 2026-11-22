# Règles de méthode (comment travailler)

**But de ce fichier.** Ce sont les règles de méthode apprises en construisant le skill RicksClips (films courts en Blender, décors 3D + personnages 2D en cartes). Elles ne décrivent pas un style : elles décrivent comment travailler pour aller vite, ne pas refaire deux fois la même erreur, et ne pas présenter comme « fait » ce qui ne l'est pas. Chaque règle vient d'un problème réel ; le problème est indiqué entre parenthèses.

**Comment l'utiliser.** Claude lit ce fichier en entier au début de chaque session, avant de toucher au code. Quand une règle ne s'applique plus, on la retire ; on ne l'ignore pas en silence.

## 1. La règle mère : chaque problème résolu devient une règle
- Un problème résolu se documente dans la même séance : ce qui s'est passé, la cause réelle, la correction, et un garde-fou (contrôle automatique, test, ligne dans un modèle) qui empêche qu'il revienne. Une leçon sans garde-fou revient.
- Chaque correction de CB devient une règle écrite, avec sa phrase d'origine entre guillemets, la date, et le fichier de code qui l'applique. Les corrections reviennent par familles : relire la liste avant chaque plan.
- Deux fichiers, deux rôles : un journal des corrections de CB (ce qu'il veut) et un registre des leçons techniques (problème → cause → correction → test → preuve). Les deux sont dans le dépôt, pas seulement dans la mémoire de la session. Ici : le journal des corrections est `CB_RULES.md`, le registre est `LECONS_TECHNIQUES.md`.
- Commit et push après chaque étape : le conteneur cloud est effacé après inactivité ; tout ce qui n'est pas poussé est perdu.

## 2. Rendu : ce qui fait gagner le plus de temps
- Jamais le film entier pour corriger. On corrige sur 2 à 4 images clés par plan. Le plan en mouvement ne se calcule qu'une fois les images clés validées, et le film entier une seule fois, à la fin. (Problème : 64 minutes de calcul pour 3,2 s de film, puis tout à refaire.)
- Aperçus Blender légers (CB 2026-11-20 : « Oui applique les aperçus légers ») : 540x960 en portrait (640x480 pour une vignette paysage), Cycles 16 échantillons + débruitage OIDN, vue Standard ; une planche d'essai a 8 vignettes au plus ; on ne recalcule que les vignettes qu'une correction change. La pleine qualité est réservée à l'image clé montrée comme rendu final et au film (RunPod).
- Vitesse (CB 2026-11-20 : « Oui applique 1 à 3 ») : la mise en scène se juge dans le kit sur une copie légère du décor (1 à 2 s par image) ; chaque brouillon est montré tout de suite, marqué « brouillon, non vérifié » ; Blender seulement à la fin d'une partie validée (une image clé), puis le film sur RunPod. Les assistants travaillent en tours courts et rendent compte après chaque tour. (Problème : un décor de 16,4 millions de triangles faisait 3 à 13 s par image dans le kit.)
- Brouillons du kit en demi-taille (CB 2026-11-21 : « Oui, passe les brouillons en demi-taille ») : images clés et clips de travail en 540x960 (`--scale 0.5`, environ 5,5 s par image au lieu de 15 à 29 s ici), marqués « brouillon » ; la taille réelle 1080x1920 seulement pour ce que CB valide (la règle « animatiques en taille réelle » de CB_RULES section 9 vaut pour ces versions-là). Toujours `--grab fast` quand la machine est partagée.
- Une seule image quand on règle un seul point (cadrage, couleur d'un sol) : 4–5 minutes au lieu de 20.
- Processeur = images clés et aperçus rapides. GPU loué = vrais rendus, uniquement avec l'accord de CB et un plafond de dépense. Mesurer le temps GPU sur une image avant d'annoncer un coût. (CB 2026-11-20 : « pour le GPU je prévois de les rendre sur runpod si ça prend trop de temps » : le rendu par défaut est le rendu logiciel du cloud ; RunPod seulement quand la durée mesurée est trop longue, après l'accord de CB sur le plafond.)
- Ne recalculer que ce qui a changé : un aperçu saute les images déjà calculées ; on supprime seulement les images du plan modifié.
- Vérifier que la reconstruction a réussi avant de lancer un rendu : chercher Traceback et SyntaxError dans le journal, et regarder l'heure du fichier de scène. (Problème : une heure de rendu sur d'anciennes scènes parce qu'une faute de frappe avait fait échouer la construction sans bruit.)
- Annoncer les durées à partir d'une mesure, pas d'une impression. Mes estimations à l'œil ont été fausses plusieurs fois.
- Les calculs longs tournent en arrière-plan, avec un journal et un marqueur de fin ; pendant ce temps on documente ou on prépare la suite.

- Assistants : vitesse avant tout (CB 2026-11-21 : « pourquoi chaque assistant passe 15-30 minute pour juste lire les règle et tes fichiers ? »). Le lead fait lui-même les petites corrections (une couleur, une option, une ligne) ; un assistant reçoit une consigne courte et précise (quel fichier, quoi changer, quelle preuve), pas une longue liste de lecture ; le même assistant est gardé d'un tour à l'autre pour garder sa mémoire ; au plus 3 assistants en même temps sur cette machine. (Problème : consignes trop lourdes et 5 à 7 assistants qui se ralentissaient entre eux.)

- Contour des objets façon Rick (CB 2026-11-21 : « L'outline noir est trop épais, il doit être fin ») : trait sombre FIN, environ 0,6 px pour 540 px de large (1,2 px en 1080), opacité environ 0,75, couleur #2a1830, sur les objets seulement (pas les murs, le sol ni les personnages).

- Machines RunPod (CB 2026-11-21 : « Tu ne dois pas la conserver et arrêter à la fin, c'est mieux d'en construire une nouvelle ») : une machine NEUVE par travail de rendu, SUPPRIMÉE (terminate) dès les résultats récupérés et vérifiés ; jamais de machine arrêtée gardée pour plus tard (au redémarrage, RunPod ne garantit pas la carte graphique). Chaque nouvelle machine demande une autorisation de CB pour son adresse.
- Avant tout rendu long sur une machine louée : télécharger et REGARDER une image d'essai par morceau ; « DEVICE OPTIX » dans le journal ne suffit pas. (Problème 2026-11-22 : personnages en aplats magenta sur RunPod, chemins d'images absolus ; vu seulement en regardant l'image.)
- Ressource prévue qui échoue (machine, carte graphique, service) : l'assistant S'ARRÊTE et prévient le lead tout de suite ; jamais de solution de secours silencieuse qui change la qualité ou le coût.

- Scènes Blender scriptées et relancées (CB 2026-11-22 : « applique le point b pour économiser du temps pour les rendus ») : chaque lieu a UN script d'assemblage (décor, accessoires, cartes, lumière, caméra, contour, étalonnage) écrit une fois ; toute image suivante du même lieu (autre cadrage, autre pose, autre moment, image clé du film) se fait en changeant des réglages et en relançant ce script, jamais en reconstruisant la scène. Mêmes réglages, même qualité. Pour une étape de validation, l'assistant s'arrête à « lisible et dans la bonne direction », sans tours de finition. (Problème : la planche de rendu de plane-eater a pris 42 min, surtout pour écrire et mettre au point les 3 scènes.)

## 3. Environnement cloud, accès, secrets
- Première chose à faire dans une nouvelle session : vérifier l'environnement (bonne version de Blender, hôtes réseau autorisés, clés enregistrées) et restaurer les fichiers non versionnés avec un script unique et relançable. (Problème : 40 minutes perdues sur un environnement mal préparé.)
- Les clés ne passent jamais par la discussion ni par un fichier : elles sont enregistrées comme secrets réseau de l'environnement. Les scripts qui attendent une variable reçoivent une valeur factice.
- Quand un hôte est bloqué, le demander proprement (la liste exacte des hôtes, une fois), ne pas contourner.
- Les gros fichiers téléchargés restent hors Git (ignorés), avec un journal qui dit d'où ils viennent et sous quelle licence, pour pouvoir les retélécharger.
- Jamais supprimer une machine louée avant d'avoir récupéré et vérifié ses résultats. (Problème : 92 minutes de calcul perdues.)
- Un outil Python lancé par Blender n'a pas les mêmes modules que le Python du système : le dessin d'images (PIL) se fait hors de Blender.

## 4. Blender 5 : pièges déjà rencontrés
> ACTIF depuis le 2026-11-20 (CB : « à partir de maintenant ... tu vas utiliser des asset blender de préférence ... pour le rendu du film ... on va utiliser une machine runpod »). Aperçus ici : une image clé ; rendu du film sur RunPod.
- Pas de ciel NISHITA ; le compositeur est `scene.compositing_node_group` avec un nœud de sortie de groupe ; les réglages de plusieurs nœuds (halo, balance des couleurs) sont des entrées, pas des propriétés ; les actions sont en couches.
- `resolution_percentage` est un entier.
- Un cylindre entièrement lissé s'ombre comme une boule : marquer les arêtes vives.
- Un matériau qui multiplie par un attribut de couleur rend noir sur un objet qui n'a pas cet attribut.
- Un volume de brume trop petit montre son bord ; un volume ou des cartes de rayons à faible qualité donnent du grain : préférer la passe de brume et le compositeur.
- Un commentaire `#` au milieu d'une ligne à plusieurs instructions neutralise tout ce qui suit. Garde-fou depuis le 2026-11-21 : `python tools/check_midline_comments.py <dossier>` avant chaque rendu (le piège est revenu cinq fois, et existait dans le kit livré).
- Deux rendus de la même image doivent donner les mêmes octets : pas de date ni de temps de rendu écrits dans l'image.

## 5. Honnêteté du compte rendu
- Dire en première ligne ce qui n'est pas fait. Ne jamais annoncer « décors faits » si la finition (matières, lumière, étalonnage) ne l'est pas. Un aperçu d'animation s'annonce comme tel.
- Distinguer « corrigé dans le code » de « vérifié en image ». Seul le second compte comme fait.
- Lister soi-même ce qui est encore faux à côté de chaque image envoyée, avant que CB ait à le faire.
- Donner les chiffres mesurés tels quels, y compris quand ils échouent.

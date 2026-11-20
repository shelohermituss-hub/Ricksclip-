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
- Une seule image quand on règle un seul point (cadrage, couleur d'un sol) : 4–5 minutes au lieu de 20.
- Processeur = images clés et aperçus rapides. GPU loué = vrais rendus, uniquement avec l'accord de CB et un plafond de dépense. Mesurer le temps GPU sur une image avant d'annoncer un coût. (CB 2026-11-20 : « pour le GPU je prévois de les rendre sur runpod si ça prend trop de temps » : le rendu par défaut est le rendu logiciel du cloud ; RunPod seulement quand la durée mesurée est trop longue, après l'accord de CB sur le plafond.)
- Ne recalculer que ce qui a changé : un aperçu saute les images déjà calculées ; on supprime seulement les images du plan modifié.
- Vérifier que la reconstruction a réussi avant de lancer un rendu : chercher Traceback et SyntaxError dans le journal, et regarder l'heure du fichier de scène. (Problème : une heure de rendu sur d'anciennes scènes parce qu'une faute de frappe avait fait échouer la construction sans bruit.)
- Annoncer les durées à partir d'une mesure, pas d'une impression. Mes estimations à l'œil ont été fausses plusieurs fois.
- Les calculs longs tournent en arrière-plan, avec un journal et un marqueur de fin ; pendant ce temps on documente ou on prépare la suite.

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
- Un commentaire `#` au milieu d'une ligne à plusieurs instructions neutralise tout ce qui suit.
- Deux rendus de la même image doivent donner les mêmes octets : pas de date ni de temps de rendu écrits dans l'image.

## 5. Honnêteté du compte rendu
- Dire en première ligne ce qui n'est pas fait. Ne jamais annoncer « décors faits » si la finition (matières, lumière, étalonnage) ne l'est pas. Un aperçu d'animation s'annonce comme tel.
- Distinguer « corrigé dans le code » de « vérifié en image ». Seul le second compte comme fait.
- Lister soi-même ce qui est encore faux à côté de chaque image envoyée, avant que CB ait à le faire.
- Donner les chiffres mesurés tels quels, y compris quand ils échouent.

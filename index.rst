.. jeu-iq documentation master file, created by
   sphinx-quickstart on Mon Apr 13 10:05:29 2026.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

jeu-iq documentation
====================

Présentation
------------
Ce projet est une version digitale des puzzles IQ.
Ces jeux sont des jeux de logique destinés à un seul joueur.

Le principe est de placer différentes pièces sur un plateau afin de remplir
toutes les cases disponibles. Certaines contraintes peuvent exister,
comme des cases dans lesquelles il est impossible de placer des pièces.

L'objectif du projet est de créer une application web interactive
dans laquelle le joueur peut manipuler les pièces avec la souris,
les placer sur une grille et résoudre un puzzle.



Fonctionnalités
---------------
.. ajouter ce qui est encore developpe
Actuellement, l'application permet :

- d'afficher un plateau dont la taille est définie par l'utilisateur
- de générer automatiquement des pièces en fonction de cette taille
- de déplacer les pièces avec la souris
- de faire pivoter les pièces
- de placer les pièces sur le plateau ou de les remettre dans leur zone

L'utilisateur peut également :

- modifier la largeur et la hauteur du plateau
- choisir un préréglage de difficulté
- personnaliser le pourcentage d'obstacles
- personnaliser la taille minimale et maximale des pièces
- générer un nouveau puzzle
- réinitialiser le plateau en remettant toutes les pièces dans leur zone initiale

Enfin, un message de victoire s'affiche lorsque le puzzle est résolu, avec un retour à l'accueil.
.. eventuellement dire ce qui reste à faire ou n'a pas pu etre developpe



Technologies utilisées
-----------------------
Ce projet utilise diverses technologies pour son bon fonctionnement :

- HTML : il est utilisé pour la structure de l'interface du jeu, comme
  les boutons, les textes et les zones d'affichage du plateau et des pièces.

- CSS : il sert à gérer l'apparence du jeu, comme les couleurs, la disposition
  des éléments, le style des boutons et l'aspect visuel du plateau et des pièces.

- JavaScript : il sert à programmer le fonctionnement du jeu, c'est-à-dire la
  génération du puzzle, le déplacement des pièces, la vérification des placements
  et la détection de la victoire.

- SVG : il est utilisé pour dessiner le plateau et les pièces du puzzle, car cela
  permet d'afficher des formes précises, redimensionnables et faciles à manipuler.

- Sphinx / reStructuredText : ils sont utilisés pour rédiger et générer la
  documentation du projet.



Structure du projet
-------------------
Le projet est organisé en plusieurs fichiers qui séparent l'interface, le style,
la logique du jeu et la documentation.

Fichiers principaux
~~~~~~~~~~~~~~~~~~~
- `index.html` : page principale de l'application. Elle contient les éléments de
  l'interface utilisateur, comme les paramètres de génération, les règles du jeu,
  le plateau, la zone des pièces et les boutons d'action.

- `style.css` : feuille de style de l'application. Elle gère l'apparence
  générale, la disposition des éléments, l'affichage du plateau, des pièces,
  des boutons, des messages et des états visuels du jeu.

- `js/` : dossier contenant la logique JavaScript du projet, découpée en
  plusieurs modules spécialisés.

Organisation du dossier `js`
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
- `js/script.js` : point d'entrée principal. Il importe les différents modules,
  relie les fonctions au système d'état global et initialise l'interface ainsi
  que les interactions du jeu.

- `js/data.js` : centralise les constantes, les références vers les éléments du
  DOM, les paramètres de difficulté et l'état global de la partie.

- `js/ui.js` : gère les interactions avec les contrôles de l'interface
  (boutons, choix de difficulté, champs personnalisés).

- `js/game.js` : gère la création d'une nouvelle partie, la mise à jour des
  paramètres choisis par l'utilisateur et le passage entre l'écran d'accueil
  et l'écran de jeu.

- `js/board.js` : initialise et dessine le plateau de jeu.

- `js/pieces.js` : génère les pièces du puzzle en fonction de la taille de la
  grille et des contraintes choisies.

- `js/draw-pieces.js` : affiche graphiquement les pièces dans leur zone de
  réserve ou sur le plateau.

- `js/obstacle.js` : génère les obstacles sur la grille.

- `js/drag.js`, `js/drag-start.js`, `js/drag-helpers.js` : gèrent le système
  de déplacement des pièces avec la souris.

- `js/snap-place.js` et `js/placement.js` : vérifient et appliquent le placement
  des pièces sur le plateau.

- `js/win.js` : détecte la victoire, affiche le message de fin et gère le
  retour à l'écran d'accueil ou la réinitialisation.

- `js/timer.js` : gère le chronomètre de la partie.

- `js/svg-helpers.js` : fournit des fonctions utilitaires pour la création et
  la manipulation des éléments SVG.

- `js/utils.js` : contient des fonctions utilitaires réutilisées dans plusieurs
  modules.

Documentation et outils
~~~~~~~~~~~~~~~~~~~~~~~
- `index.rst` : fichier principal de la documentation Sphinx.

- `conf.py` : configuration de Sphinx.

- `README.md` : présentation rapide du projet et consignes de lancement.

- `Makefile` et `make.bat` : commandes permettant de générer la documentation.

- `_build/` : fichiers générés par Sphinx.

- `_static/` et `_templates/` : ressources complémentaires utilisées par la
  documentation.



Fonctionnement interne
----------------------
Le fonctionnement de l'application se fait sur plusieurs modules JavaScript
qui agissent ensemble pour générer une partie, afficher le puzzle et gérer les
interactions du joueur

1. Initialisation
~~~~~~~~~~~~~~~~~~
Lorsque la page s'ouvre, le fichier `js/script.js` lance l'application.
Il charge les différents modules JavaScript, met en place les interactions
principales et prépare l'interface pour que le joueur puisse commencer une partie.

2. Gestion de l'état du jeu
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
La gestion de l'état du jeu se fait avec le fichier `js/data.js`, qui permet de 
centraliser l'état global de la partie. Il contient notamment:

- la taille du plateau
- la liste des obstacles
- les pièces générées
- la pièce en cours de déplacement
- les paramètres de difficulté
- l'état de victoire
- les références vers les éléments HTML et SVG

Cela permet aux différents modules de partager les mêmes informations.

3. Génération de la partie 
~~~~~~~~~~~~~~~~~~~~~~~~~~~
Lorsque le joueur clique sur le bouton de lancement, le module `js/game.js`
récupère les paramètres choisis, comme la difficulté ou le mode personnalisé,
puis:

- définit la largeur et la hauteur du plateau
- génère les obstacles
- crée la structure logique de la grille
- génère les pièces à placer
- démarre le chronomètre
- demande l'affichage du plateau et des pièces

4. Affichage du plateau et des pièces
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Le plateau et les pièces sont dessinés en SVG. Ce choix permet de manipuler
facilement les formes, les positions et les rotations.

- `js/board.js` dessine la grille et les obstacles
- `js/draw-pieces.js` affiche les pièces dans la zone de réserve ou sur le plateau

5. Déplacement et rotation des pièces
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Le joueur peut sélectionner une pièce, la déplacer avec la souris et la faire
pivoter. Cette logique est répartie dans les modules liés au drag and drop :

- `js/drag.js`
- `js/drag-start.js`
- `js/drag-helpers.js`

Lorsqu'une pièce est relâchée, le programme vérifie si son placement est
possible. Si c'est le cas, elle est posée sur la grille ; sinon, elle retourne
dans sa zone.

6. Vérification du placement 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Les modules `js/snap-place.js` et `js/placement.js` contrôlent si une pièce
peut être placée à un endroit donné. Le programme vérifie notamment :

- que la pièce reste dans les limites du plateau
- qu'elle ne recouvre pas un obstacle
- qu'elle ne recouvre pas une case déjà occupée

7. Détection de la victoire
~~~~~~~~~~~~~~~~~~~~~~~~~~~
Après chaque placement, le module `js/win.js` vérifie si toutes les cases
libres du plateau sont occupées. Si c'est le cas :

- le chronomètre s'arrête
- un message de victoire s'affiche
- le temps final est montré au joueur
- un retour à l'accueil est ensuite proposé

8. Réinitialisation
~~~~~~~~~~~~~~~~~~~~

Le joueur peut aussi réinitialiser la partie en cours. Dans ce cas, les pièces
sont retirées du plateau et replacées dans leur zone initiale, sans recréer
une nouvelle grille.


Limites et améliorations possibles
----------------------------------
Même si le projet est jouable et fonctionnel, certaines limites restent
présentes dans sa version actuelle.

Limites du projet
~~~~~~~~~~~~~~~~~~
- La difficulté repose principalement sur la taille du plateau, le nombre
d'obstacles et la taille des pièces. Elle n'est donc pas encore fondée sur
des puzzles conçus individuellement avec une solution précise.

- La vérification de victoire consiste surtout à contrôler que toutes les cases
libres du plateau sont remplies. Le programme ne compare pas encore la disposition 
finale des pièces à une solution prédéfinie.

- Le projet reste centré sur une utilisation à la souris. Il ne comporte pas
encore de commandes clavier ou d'améliorations spécifiques liées à l'accessibilité.

Amélioration possibles
~~~~~~~~~~~~~~~~~~~~~~
Il est possible d'ajouter des modifications afin de faire évoluer le projet:

- créer une liste de niveaux ou de défis prédéfinis avec une difficulté progressive

- associer chaque défi à une solution connue afin de renforcer la vérification
de la résolution

- améliorer les effets visuels lors du déplacement et du placement des pièces,
par exemple avec des surbrillances ou des animations

- enrichir l'interface avec davantage d'informations pour le joueur, comme un
meilleur guidage, des messages d'erreur plus explicites ou des aides
contextuelles 

- proposer d'autres options de jeu, comme un mode chronométré, un système de
score ou des statistiques de partie

Installation
-------------
.. améliorer la description de l'installation
Pour utiliser le projet :

- ouvrir le dossier du projet dans VS Code
- ouvrir `index.html` dans un navigateur



Utilisation
------------
Pour jouer :

- choisir une difficulté prédéfinie ou le mode personnalisé
- régler la largeur, la hauteur, le pourcentage d'obstacles et la taille des pièces si besoin
- cliquer sur **Commencer**
- cliquer une première fois sur une pièce pour l'attraper
- cliquer une seconde fois pour la poser
- faire un clic droit pendant qu'une pièce est en l'air pour la faire pivoter
- utiliser le bouton de réinitialisation pour remettre les pièces dans leur zone
- remplir toutes les cases libres pour gagner



.. toctree::
   :maxdepth: 2
   :caption: Contents:

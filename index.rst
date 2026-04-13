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


Installation
-------------

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

Structure du projet
-------------------

- `index.html` : structure de la page et interface du jeu
- `style.css` : styles, mise en page et apparence visuelle
- `script.js` : logique du jeu et interactions
- `index.rst` : documentation principale du projet
- `conf.py` : configuration Sphinx
- `README.md` : présentation rapide et consignes d'utilisation
- `Makefile` et `make.bat` : commandes de génération de la documentation
- `_static`, `_templates`, `_build` : ressources et fichiers liés à la documentation


.. toctree::
   :maxdepth: 2
   :caption: Contents:

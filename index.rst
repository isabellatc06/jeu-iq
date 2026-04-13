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
- générer un nouveau puzzle
- réinitialiser le plateau en remettant toutes les pièces dans leur zone initiale
- Surfer entre les differents niveaux de difficulté

Enfin, un message de victoire s'affiche lorsque le puzzle est résolu.

.. eventuellement dire ce qui reste à faire ou n'a pas pu etre developpe

Technologies utilisées
-----------------------
Ce projet utilise diverse technologies pour son bon fonctionnement :

- Html: Il est utilisé pour la structure de l'interface du jeu commme
les boutons, les textes et les zones d'affichage du plateau et des pièces.

- CSS: Il sert à gérer l'apparence du jeu, comme les couleurs, la disposition 
des éléments, le style des boutons et l'aspect visuel du plateau et des pièces.

- JavaScript: Il sert à programmer le fonctionnement du jeu, c'est-à-dire la 
génération du puzzle, le déplacement des pièces, la vérification des placements 
et la détention de la victoire.

- SVG: Il est utilisé pour dessier le plateau et les pièces du puzzle, car cela 
permet d'afficher des formes précises, redimensionnables et faciles à manipuler.


Installation
-------------

Utilisation
------------

Structure du projet
-------------------






.. toctree::
   :maxdepth: 2
   :caption: Contents:

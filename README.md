# Puzzle IQ

Puzzle IQ est un jeu de placement de pièces en HTML, CSS et JavaScript. Le joueur choisit une difficulté, génère une grille, puis déplace des pièces jusqu'à remplir toutes les cases libres.

## Lancer le jeu

1. Ouvrir le dossier du projet dans VS Code ou dans un éditeur similaire.
2. Ouvrir `index.html` dans un navigateur.
3. Choisir une difficulté puis cliquer sur **Commencer**.

## Règles du jeu

1. Clic gauche sur une pièce: la prendre.
2. Clic gauche une seconde fois: la poser.
3. Clic droit pendant qu'une pièce est en l'air: la faire pivoter de 90°.
4. Les cases noires sont des obstacles et ne peuvent pas être recouvertes.
5. La partie est gagnée quand toutes les cases libres sont occupées.

## Contrôles

### Accueil

- `Difficulté` : charge un preset ou active le mode personnalisé.
- `Largeur` et `Hauteur` : dimensions de la grille.
- `Obstacles (%)` : pourcentage de cases noires.
- `Taille pièce min / max` : taille des pièces générées, en nombre de cases.
- **Commencer** : crée une nouvelle grille.

### En jeu

- **Générer nouveau** : repart sur une nouvelle grille avec les mêmes paramètres.
- **Réinitialiser les pièces** : remet les pièces dans la réserve sans recréer la grille.
- Le chronomètre se lance à chaque génération de grille.

## Structure du projet

- `index.html` : structure de l'interface.
- `style.css` : mise en page, couleurs, animations et états d'affichage.
- `script.js` : génération de la grille, des pièces, du drag and drop, du timer et de la victoire.

## Fonctionnement interne

- La grille contient des obstacles générés aléatoirement.
- Les pièces sont créées sous forme de groupes de cellules connectées.
- Le plateau et la réserve sont dessinés en SVG pour permettre un rendu précis.
- Le timer redémarre à chaque génération et s'arrête à la victoire.
- Le message de victoire affiche le temps final sans quitter automatiquement la partie.

## Notes techniques

- Encodage recommandé: **UTF-8** pour tous les fichiers texte.
- Le dossier `venv/` est ignoré par Git et ne doit pas être versionné.

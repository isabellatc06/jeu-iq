# Puzzle IQ

Puzzle IQ est un jeu de placement de pièces développé en HTML, CSS et JavaScript. Le joueur choisit une difficulté, génère une grille, puis déplace des pièces jusqu'à remplir toutes les cases libres du plateau.

## Installation

Pour installer le projet :

1. Assurez-vous d'avoir installé Git et Visual Studio Code avant de commencer.
2. Copiez le lien HTTPS du dépôt GitHub.
3. Ouvrez Visual Studio Code et un terminal dans VS Code.
4. Clonez le projet avec la commande :

```bash
git clone https://github.com/isabellatc06/jeu-iq.git
```

5. Accédez au dossier du projet :

```bash
cd jeu-iq
```

6. Ouvrez le projet avec :

```bash
code .
```

## Installer Sphinx

Pour générer la documentation en HTML, vous devez installer Sphinx dans votre environnement Python.

Si votre version de Python n'accepte pas la toute dernière version de Sphinx, vous pouvez installer une version compatible avec :

```bash
pip install sphinx==9.0.4
```

Vous pouvez ensuite vérifier l'installation avec :

```bash
sphinx-build --version
```

## Générer la documentation HTML

Une fois Sphinx installé, placez-vous dans le dossier du projet puis lancez :

```powershell
.\make.bat html
```

Cette commande génère la documentation HTML dans le dossier `_build/html`.

## Ouvrir la documentation dans le navigateur

Après la génération :

1. Ouvrez le dossier `_build/html`.
2. Cherchez le fichier `index.html`.
3. Double-cliquez sur ce fichier, ou ouvrez-le avec le navigateur de votre choix.

Le fichier principal de la documentation est donc :

```text
_build/html/index.html
```

## Lancer le jeu

Pour lancer le jeu :

1. Cherchez dans les fichiers le fichier `index.html`.
2. Faites un clic droit sur le fichier `index.html`.
3. Choisissez l'option **Open with Live Server**.
4. Si l'extension n'est pas installée, ajoutez **Live Server** de Ritwick Dey dans l'onglet des extensions.

## Règles du jeu

1. Clic gauche sur une pièce : la prendre.
2. Clic gauche une seconde fois : la poser.
3. Clic droit pendant qu'une pièce est en l'air : la faire pivoter de 90°.
4. Les cases noires sont des obstacles et ne peuvent pas être recouvertes.
5. La partie est gagnée quand toutes les cases libres sont occupées.

## Contrôles

### Accueil

- `Difficulté` : charge un préréglage ou active le mode personnalisé.
- `Largeur` et `Hauteur` : définissent les dimensions de la grille.
- `Obstacles (%)` : définit le pourcentage de cases noires.
- `Taille pièce min / max` : définit la taille des pièces générées, en nombre de cases.
- **Commencer** : crée une nouvelle grille.

### En jeu

- **Générer nouveau** : relance une nouvelle grille avec les mêmes paramètres.
- **Réinitialiser les pièces** : remet les pièces dans la réserve sans recréer la grille.
- Le chronomètre se lance à chaque génération de grille.

## Structure du projet

- `index.html` : structure de l'interface.
- `style.css` : mise en page, couleurs, animations et états d'affichage.
- `js/` : contient les différents modules JavaScript du projet.

## Fonctionnement interne

- La grille contient des obstacles générés aléatoirement.
- Les pièces sont créées sous forme de groupes de cellules connectées.
- Le plateau et la réserve sont dessinés en SVG pour permettre un rendu précis.
- Le chronomètre redémarre à chaque génération et s'arrête à la victoire.
- Le message de victoire affiche le temps final.

## Notes techniques

- Encodage recommandé : **UTF-8** pour tous les fichiers texte.
- Le dossier `venv/` est ignoré par Git et ne doit pas être versionné.

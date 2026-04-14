export const CELL = 50;

// Taille d'une case en pixels dans les rendus SVG.
// Tous les calculs de position reposent sur cette unite.

// References DOM partagees dans tout le jeu.
// Centraliser ces acces evite de rechercher les memes elements dans chaque module.
export const refs = {
    boardSVG: document.getElementById("board"),
    piecesSVG: document.getElementById("pieces"),
    timerText: document.getElementById("timer"),
    generateButton: document.getElementById("generate"),
    resetButton: document.getElementById("reset-placed"),
    hintText: document.querySelector(".hint"),
    difficultySelect: document.getElementById("difficulty"),
    widthInput: document.getElementById("w"),
    heightInput: document.getElementById("h"),
    obstacleRatioInput: document.getElementById("obstacle-ratio"),
    pieceMinInput: document.getElementById("piece-min"),
    pieceMaxInput: document.getElementById("piece-max")
};

export const difficultyPresets = {
    easy: { w: 5, h: 5, obstacleRatio: 0.1, pieceMin: 3, pieceMax: 4, label: "Facile" },
    normal: { w: 6, h: 6, obstacleRatio: 0.15, pieceMin: 3, pieceMax: 5, label: "Moyen" },
    hard: { w: 8, h: 8, obstacleRatio: 0.2, pieceMin: 4, pieceMax: 6, label: "Difficile" },
    custom: { w: 6, h: 6, obstacleRatio: 0.15, pieceMin: 3, pieceMax: 5, label: "Personnalise" }
};

// Etat global partage entre les modules.
// Cette structure stocke:
// - les donnees de la partie en cours (grille, pieces, obstacles)
// - le contexte drag and drop courant
// - les callbacks relies depuis script.js pour eviter les imports circulaires
export const state = {
    board: [],
    boardW: 0,
    boardH: 0,
    obstacles: [],
    pieces: [],
    dragged: null,
    dragOrigin: null,
    offset: { x: 0, y: 0 },
    gameWon: false,
    winTimer: null,
    returnToStartupTimer: null,
    timerInterval: null,
    timerStartedAt: 0,
    elapsedSeconds: 0,
    gameSettings: { ...difficultyPresets.normal },
    gameStarted: false,
    handlers: {
        drawBoard: null,
        drawPieces: null,
        checkWin: null,
        returnToStartup: null,
        startDragFromTray: null,
        startDragFromBoard: null,
        snapAndPlace: null,
        rotateDraggedPiece: null,
        setGameStartedUI: null,
        resetTimer: null,
        startTimer: null,
        stopTimer: null,
        getElapsedTimeLabel: null
    }
};

// Couche HTML flottante utilisee pour afficher l'apercu d'une piece pendant le drag.
// On la separe des SVG fixes pour garder un rendu fluide au deplacement souris.
export const dragLayer = document.createElement("div");
dragLayer.style.position = "fixed";
dragLayer.style.left = "0";
dragLayer.style.top = "0";
dragLayer.style.width = "0";
dragLayer.style.height = "0";
dragLayer.style.pointerEvents = "none";
dragLayer.style.zIndex = "1000";
document.body.appendChild(dragLayer);

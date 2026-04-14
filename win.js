import { dragLayer, refs, state } from "./data.js";
import { initBoard } from "./board.js";
import { getElapsedTimeLabel, resetTimer, stopTimer } from "./timer.js";

// Affiche (ou met a jour) la popup de victoire avec le temps final.
export function showWinMessage() {
    let message = document.getElementById("win-message");

    if (!message) {
        message = document.createElement("div");
        message.id = "win-message";
        message.className = "win-message";
        message.innerHTML = `
            <strong>Bravo !</strong> Puzzle complete.
            <button id="win-new-game" type="button">Retour accueil</button>
        `;
        document.body.appendChild(message);

        // Bouton de retour vers l'accueil depuis la popup.
        const newGameButton = message.querySelector("#win-new-game");
        newGameButton.onclick = () => state.handlers.returnToStartup();
    }

    message.innerHTML = `
        <strong>Bravo !</strong> Puzzle complete.
        <div class="win-time">Temps final : ${getElapsedTimeLabel()}</div>
        <button id="win-new-game" type="button">Retour accueil</button>
    `;

    const newGameButton = message.querySelector("#win-new-game");
    newGameButton.onclick = () => state.handlers.returnToStartup();

    message.classList.add("show");
}

export function hideWinMessage() {
    const message = document.getElementById("win-message");
    if (!message) return;
    message.classList.remove("show");
}

// Retour complet a l'etat d'accueil, sans partie active.
// Utilise pour le bouton popup et pour le retour auto apres victoire.
export function returnToStartup() {
    clearTimeout(state.winTimer);
    clearTimeout(state.returnToStartupTimer);
    stopTimer();

    state.dragged = null;
    state.dragOrigin = null;
    dragLayer.innerHTML = "";
    state.gameWon = false;

    state.board = [];
    state.obstacles = [];
    state.pieces = [];
    state.boardW = 0;
    state.boardH = 0;
    refs.boardSVG.innerHTML = "";
    refs.piecesSVG.innerHTML = "";
    refs.boardSVG.removeAttribute("width");
    refs.boardSVG.removeAttribute("height");
    refs.piecesSVG.removeAttribute("width");
    refs.piecesSVG.removeAttribute("height");

    hideWinMessage();
    resetTimer();
    state.handlers.setGameStartedUI(false);
}

// Verification de victoire:
// si aucune case libre (0) ne reste sur la grille, la partie est gagnee.
export function checkWin() {
    if (state.gameWon) return;

    for (let y = 0; y < state.boardH; y++) {
        for (let x = 0; x < state.boardW; x++) {
            if (state.board[y][x] === 0) return;
        }
    }

    state.gameWon = true;
    stopTimer();
    clearTimeout(state.winTimer);
    clearTimeout(state.returnToStartupTimer);

    // Leger delai pour fluidifier la transition visuelle apres la derniere pose.
    state.winTimer = setTimeout(() => {
        requestAnimationFrame(() => {
            showWinMessage();

            // Retour automatique vers l'accueil apres affichage court de la victoire.
            state.returnToStartupTimer = setTimeout(() => {
                state.handlers.returnToStartup();
            }, 1800);
        });
    }, 120);
}

// Reset "partie en cours":
// - conserve dimensions + obstacles
// - vide toutes les poses
// - renvoie toutes les pieces dans la reserve
export function resetPlacedPieces() {
    state.gameWon = false;
    clearTimeout(state.winTimer);
    clearTimeout(state.returnToStartupTimer);
    hideWinMessage();

    state.board = initBoard(state.boardW, state.boardH, state.obstacles);

    state.pieces.forEach(piece => {
        piece.placed = false;
        piece.boardX = 0;
        piece.boardY = 0;
    });

    state.dragged = null;
    state.dragOrigin = null;
    dragLayer.innerHTML = "";

    state.handlers.drawBoard();
    state.handlers.drawPieces();
}

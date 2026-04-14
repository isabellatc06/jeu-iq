import { dragLayer, refs, state } from "./data.js";
import { initBoard } from "./board.js";

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

        const newGameButton = message.querySelector("#win-new-game");
        newGameButton.onclick = () => state.handlers.returnToStartup();
    }

    message.classList.add("show");
}

export function hideWinMessage() {
    const message = document.getElementById("win-message");
    if (!message) return;
    message.classList.remove("show");
}

export function returnToStartup() {
    clearTimeout(state.winTimer);
    clearTimeout(state.returnToStartupTimer);

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
    state.handlers.setGameStartedUI(false);
}

export function checkWin() {
    if (state.gameWon) return;

    for (let y = 0; y < state.boardH; y++) {
        for (let x = 0; x < state.boardW; x++) {
            if (state.board[y][x] === 0) return;
        }
    }

    state.gameWon = true;
    clearTimeout(state.winTimer);
    clearTimeout(state.returnToStartupTimer);
    state.winTimer = setTimeout(() => {
        requestAnimationFrame(() => {
            showWinMessage();
            state.returnToStartupTimer = setTimeout(() => {
                state.handlers.returnToStartup();
            }, 1800);
        });
    }, 120);
}

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

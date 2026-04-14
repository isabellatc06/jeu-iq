import { difficultyPresets, refs, state } from "./data.js";
import { initBoard } from "./board.js";
import { generateObstacles } from "./obstacle.js";
import { generateSimplePieces } from "./pieces.js";
import { startTimer } from "./timer.js";
import { hideWinMessage } from "./win.js";
import { clamp } from "./utils.js";

// Lance une partie complete a partir des parametres actifs.
// Sequence: reset etat victoire -> generation obstacles -> generation grille -> generation pieces -> rendu.
export function generateGame(w, h) {
    state.boardW = w;
    state.boardH = h;
    state.gameWon = false;
    clearTimeout(state.winTimer);
    clearTimeout(state.returnToStartupTimer);
    hideWinMessage();

    state.obstacles = generateObstacles(w, h, state.gameSettings.obstacleRatio);
    state.board = initBoard(w, h, state.obstacles);
    state.pieces = generateSimplePieces(
        w,
        h,
        state.obstacles,
        state.gameSettings.pieceMin,
        state.gameSettings.pieceMax
    );

    startTimer();
    state.handlers.drawBoard();
    state.handlers.drawPieces();
}

// Bascule les elements d'interface entre mode accueil et mode partie.
export function setGameStartedUI(started) {
    state.gameStarted = started;
    document.body.classList.toggle("startup", !started);
    refs.generateButton.textContent = started ? "Generer nouveau" : "Commencer";
    refs.resetButton.style.display = started ? "inline-block" : "none";
    refs.hintText.style.display = started ? "none" : "block";
    refs.hintText.textContent = "Choisis une difficulte, puis clique sur Commencer";
}

// Applique un preset de difficulte et verrouille/deverrouille les champs custom.
// En dehors du mode custom, les champs affichent strictement les valeurs du preset.
export function updateSettingsFromDifficulty() {
    const selected = difficultyPresets[refs.difficultySelect.value] || difficultyPresets.normal;
    state.gameSettings = { ...selected };

    const isCustom = refs.difficultySelect.value === "custom";
    refs.widthInput.disabled = !isCustom;
    refs.heightInput.disabled = !isCustom;
    refs.obstacleRatioInput.disabled = !isCustom;
    refs.pieceMinInput.disabled = !isCustom;
    refs.pieceMaxInput.disabled = !isCustom;

    if (!isCustom) {
        refs.widthInput.value = selected.w;
        refs.heightInput.value = selected.h;
        refs.obstacleRatioInput.value = Math.round(selected.obstacleRatio * 100);
        refs.pieceMinInput.value = selected.pieceMin;
        refs.pieceMaxInput.value = selected.pieceMax;
    }

    if (!state.gameStarted) {
        // Message explicite tant que la partie n'a pas commence.
        refs.hintText.textContent = "Choisis une difficulte, puis clique sur Commencer";
    }
}

// Valide les saisies custom et les normalise dans des bornes jouables.
// Cette fonction protege l'etat contre les valeurs vides ou incoherentes.
export function updateSettingsFromCustomInputs() {
    const w = clamp(+refs.widthInput.value || 6, 4, 10);
    const h = clamp(+refs.heightInput.value || 6, 4, 10);
    const obstaclePercent = clamp(+refs.obstacleRatioInput.value || 15, 5, 35);
    let pieceMin = clamp(+refs.pieceMinInput.value || 3, 2, 6);
    let pieceMax = clamp(+refs.pieceMaxInput.value || 5, 3, 7);

    // pieceMin ne doit jamais depasser pieceMax.
    if (pieceMin > pieceMax) {
        pieceMax = pieceMin;
    }

    refs.widthInput.value = w;
    refs.heightInput.value = h;
    refs.obstacleRatioInput.value = obstaclePercent;
    refs.pieceMinInput.value = pieceMin;
    refs.pieceMaxInput.value = pieceMax;

    state.gameSettings = {
        w,
        h,
        obstacleRatio: obstaclePercent / 100,
        pieceMin,
        pieceMax,
        label: "Personnalise"
    };
}

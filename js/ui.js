import { refs, state } from "./data.js";
import { generateGame, setGameStartedUI, updateSettingsFromCustomInputs, updateSettingsFromDifficulty } from "./game.js";
import { resetPlacedPieces } from "./win.js";

export function initUI() {
    refs.generateButton.onclick = () => {
        updateSettingsFromDifficulty();
        if (refs.difficultySelect.value === "custom") {
            updateSettingsFromCustomInputs();
        }

        if (!state.gameStarted) {
            setGameStartedUI(true);
        }

        generateGame(state.gameSettings.w, state.gameSettings.h);
    };

    refs.resetButton.onclick = () => {
        resetPlacedPieces();
    };

    refs.difficultySelect.onchange = () => {
        updateSettingsFromDifficulty();
    };

    [
        refs.widthInput,
        refs.heightInput,
        refs.obstacleRatioInput,
        refs.pieceMinInput,
        refs.pieceMaxInput
    ].forEach(input => {
        input.onchange = () => {
            if (refs.difficultySelect.value !== "custom") return;
            updateSettingsFromCustomInputs();
        };
    });

    updateSettingsFromDifficulty();
    setGameStartedUI(false);
}

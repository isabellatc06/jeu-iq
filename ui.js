import { refs, state } from "./data.js";
import { generateGame, setGameStartedUI, updateSettingsFromCustomInputs, updateSettingsFromDifficulty } from "./game.js";
import { resetPlacedPieces } from "./win.js";

// Branche tous les controles UI (boutons + champs).
// Cette fonction est appelee une seule fois au demarrage.
export function initUI() {
    refs.generateButton.onclick = () => {
        // Recharge les parametres depuis le preset courant.
        updateSettingsFromDifficulty();
        if (refs.difficultySelect.value === "custom") {
            updateSettingsFromCustomInputs();
        }

        if (!state.gameStarted) {
            setGameStartedUI(true);
        }

        // Generation complete d'une partie avec les parametres finalises.
        generateGame(state.gameSettings.w, state.gameSettings.h);
    };

    refs.resetButton.onclick = () => {
        // Reset doux: on garde la meme grille et les memes obstacles.
        resetPlacedPieces();
    };

    refs.difficultySelect.onchange = () => {
        // Changer la difficulte recharge les valeurs associees.
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
            // Les champs numeriques ne sont pris en compte qu'en mode custom.
            if (refs.difficultySelect.value !== "custom") return;
            updateSettingsFromCustomInputs();
        };
    });

    // Etat initial: ecran d'accueil + preset applique.
    updateSettingsFromDifficulty();
    setGameStartedUI(false);
}

import { refs, state } from "./data.js";

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Met à jour le texte affiché dans l'interface.
function renderTimer() {
    if (!refs.timerText) return;
    refs.timerText.textContent = `Temps : ${formatTime(state.elapsedSeconds)}`;
}

// Revient à un chrono propre pour une nouvelle partie ou un retour accueil.
export function resetTimer() {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    state.timerStartedAt = 0;
    state.elapsedSeconds = 0;
    renderTimer();
}

// Le chrono démarre à la génération d'une nouvelle grille.
export function startTimer() {
    clearInterval(state.timerInterval);
    state.timerStartedAt = Date.now();
    state.elapsedSeconds = 0;
    renderTimer();

    state.timerInterval = setInterval(() => {
        state.elapsedSeconds = Math.floor((Date.now() - state.timerStartedAt) / 1000);
        renderTimer();
    }, 250);
}

// Fige le temps final lorsque la partie est gagnée ou quittée.
export function stopTimer() {
    if (state.timerStartedAt) {
        state.elapsedSeconds = Math.floor((Date.now() - state.timerStartedAt) / 1000);
    }
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    renderTimer();
}

export function getElapsedTimeLabel() {
    return formatTime(state.elapsedSeconds);
}

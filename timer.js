import { refs, state } from "./data.js";

// Formate une duree en secondes vers MM:SS.
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Rafraichit l'affichage du timer dans l'interface.
function renderTimer() {
    if (!refs.timerText) return;
    refs.timerText.textContent = `Temps : ${formatTime(state.elapsedSeconds)}`;
}

// Remet le chrono a zero (nouvelle partie ou retour accueil).
export function resetTimer() {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    state.timerStartedAt = 0;
    state.elapsedSeconds = 0;
    renderTimer();
}

// Demarre le chrono de partie.
// Intervalle court pour une mise a jour visuelle fluide du temps affiche.
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

// Fige le temps final (victoire ou abandon de partie), puis stoppe l'intervalle.
export function stopTimer() {
    if (state.timerStartedAt) {
        state.elapsedSeconds = Math.floor((Date.now() - state.timerStartedAt) / 1000);
    }
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    renderTimer();
}

export function getElapsedTimeLabel() {
    // Expose le temps deja calcule, pret a afficher dans la popup de victoire.
    return formatTime(state.elapsedSeconds);
}

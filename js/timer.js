import { refs, state } from "./data.js";

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderTimer() {
    if (!refs.timerText) return;
    refs.timerText.textContent = `Temps : ${formatTime(state.elapsedSeconds)}`;
}

export function resetTimer() {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    state.timerStartedAt = 0;
    state.elapsedSeconds = 0;
    renderTimer();
}

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

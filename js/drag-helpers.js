import { refs, state } from "./data.js";

// Déplace visuellement l'aperçu flottant de la pièce.
export function updateDragPreviewPosition(clientX, clientY) {
    if (!state.dragged) return;
    const scale = parseFloat(refs.boardSVG.dataset.scale || 1);
    state.dragged.preview.setAttribute(
        "style",
        `position: fixed; left: 0; top: 0; overflow: visible; pointer-events: none; transform-origin: top left; transform: translate(${clientX - state.offset.x}px, ${clientY - state.offset.y}px) scale(${scale});`
    );
}

export function isInsideRect(clientX, clientY, rect) {
    return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
    );
}

// Retire une pièce du plateau logique avant de la reprendre à la main.
export function removePieceFromBoard(piece) {
    for (let y = 0; y < state.boardH; y++) {
        for (let x = 0; x < state.boardW; x++) {
            if (state.board[y][x] === piece.id) {
                state.board[y][x] = 0;
            }
        }
    }

    piece.placed = false;
}

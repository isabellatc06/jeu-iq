import { refs, state } from "./data.js";

// Met a jour la position ecran de l'apercu flottant.
// Le scale du plateau est reapplique pour garder une taille visuelle coherente.
export function updateDragPreviewPosition(clientX, clientY) {
    if (!state.dragged) return;
    const scale = parseFloat(refs.boardSVG.dataset.scale || 1);
    state.dragged.preview.setAttribute(
        "style",
        `position: fixed; left: 0; top: 0; overflow: visible; pointer-events: none; transform-origin: top left; transform: translate(${clientX - state.offset.x}px, ${clientY - state.offset.y}px) scale(${scale});`
    );
}

// Test geometrique simple: indique si un point ecran est dans un rectangle DOM.
export function isInsideRect(clientX, clientY, rect) {
    return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
    );
}

// Nettoie la grille logique avant de reprendre une piece deja posee.
// Toutes les cases marquees avec l'id de la piece redeviennent libres.
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

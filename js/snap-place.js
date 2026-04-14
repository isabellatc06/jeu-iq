import { CELL, dragLayer, refs, state } from "./data.js";
import { isInsideRect } from "./drag-helpers.js";
import { canPlaceAt, placePieceOnBoard } from "./placement.js";

// Traduit la position de la souris en coordonnées de grille, puis tente la pose.
export function snapAndPlace(piece, clientX, clientY) {
    const trayRect = refs.piecesSVG.getBoundingClientRect();
    if (isInsideRect(clientX, clientY, trayRect)) {
        piece.placed = false;
        state.dragged = null;
        state.dragOrigin = null;
        dragLayer.innerHTML = "";
        state.handlers.drawBoard();
        state.handlers.drawPieces();
        return;
    }

    const rect = refs.boardSVG.getBoundingClientRect();
    const scale = parseFloat(refs.boardSVG.dataset.scale || 1);

    const localX = (clientX - state.offset.x - rect.left) / scale;
    const localY = (clientY - state.offset.y - rect.top) / scale;

    const gx = Math.round(localX / CELL);
    const gy = Math.round(localY / CELL);

    const fits = canPlaceAt(piece, gx, gy);

    // Si la pose est invalide mais que la pièce venait du plateau, on la remet à sa place.
    if (fits) {
        placePieceOnBoard(piece, gx, gy);
    } else if (state.dragOrigin?.placed) {
        placePieceOnBoard(piece, state.dragOrigin.boardX, state.dragOrigin.boardY);
    } else {
        piece.placed = false;
    }

    state.dragged = null;
    state.dragOrigin = null;
    dragLayer.innerHTML = "";

    state.handlers.drawBoard();
    state.handlers.drawPieces();
    state.handlers.checkWin();
}

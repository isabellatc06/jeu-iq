import { CELL, dragLayer, refs, state } from "./data.js";
import { isInsideRect } from "./drag-helpers.js";
import { canPlaceAt, placePieceOnBoard } from "./placement.js";

// Finalise un drag: convertit la position souris en cellule grille et tente la pose.
export function snapAndPlace(piece, clientX, clientY) {
    const trayRect = refs.piecesSVG.getBoundingClientRect();

    // Drop dans la reserve: la piece reste simplement non posee.
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

    // Arrondi a la case la plus proche pour obtenir une origine de pose.
    const gx = Math.round(localX / CELL);
    const gy = Math.round(localY / CELL);

    const fits = canPlaceAt(piece, gx, gy);

    // Si la pose est invalide mais que la piece venait du plateau,
    // on la restaure a sa position d'origine pour eviter une perte de piece.
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

    // Rendu final et verification de victoire apres chaque pose.
    state.handlers.drawBoard();
    state.handlers.drawPieces();
    state.handlers.checkWin();
}

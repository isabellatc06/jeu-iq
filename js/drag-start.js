import { CELL, refs, state } from "./data.js";
import { rotateShape } from "./utils.js";
import { removePieceFromBoard, updateDragPreviewPosition } from "./drag-helpers.js";
import { createDragPreview } from "./svg-helpers.js";

// Lance un drag depuis la reserve.
// trayX/trayY correspondent a l'origine visuelle de la piece dans la colonne de droite.
export function startDragFromTray(piece, event, trayX, trayY) {
    if (state.gameWon) return;

    state.dragged = {
        piece,
        preview: createDragPreview(piece)
    };

    state.dragOrigin = { placed: false };

    // Calcule le decalage souris -> origine piece pour eviter un "saut" visuel.
    const trayRect = refs.piecesSVG.getBoundingClientRect();
    state.offset.x = event.clientX - (trayRect.left + trayX);
    state.offset.y = event.clientY - (trayRect.top + trayY);

    updateDragPreviewPosition(event.clientX, event.clientY);
    state.handlers.drawPieces();
}

// Lance un drag depuis une piece deja posee sur la grille.
// On memorise sa position d'origine pour pouvoir la restaurer si la nouvelle pose echoue.
export function startDragFromBoard(piece, event) {
    if (state.gameWon) return;

    state.dragged = {
        piece,
        preview: createDragPreview(piece)
    };

    state.dragOrigin = {
        placed: true,
        boardX: piece.boardX,
        boardY: piece.boardY
    };

    const boardRect = refs.boardSVG.getBoundingClientRect();
    const scale = parseFloat(refs.boardSVG.dataset.scale || 1);
    // Le decalage tient compte du zoom applique au plateau.
    state.offset.x = event.clientX - (boardRect.left + piece.boardX * CELL * scale);
    state.offset.y = event.clientY - (boardRect.top + piece.boardY * CELL * scale);

    removePieceFromBoard(piece);
    state.handlers.drawBoard();
    state.handlers.drawPieces();
    updateDragPreviewPosition(event.clientX, event.clientY);
}

// Rotation de 90 degres de la piece actuellement tenue.
// On regenere l'apercu apres rotation pour refléter immediatement la nouvelle forme.
export function rotateDraggedPiece(clientX, clientY) {
    if (!state.dragged) return;

    state.dragged.piece.shape = rotateShape(state.dragged.piece.shape);
    state.dragged.preview = createDragPreview(state.dragged.piece);
    updateDragPreviewPosition(clientX, clientY);
}

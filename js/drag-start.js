import { CELL, refs, state } from "./data.js";
import { rotateShape } from "./utils.js";
import { removePieceFromBoard, updateDragPreviewPosition } from "./drag-helpers.js";
import { createDragPreview } from "./svg-helpers.js";

export function startDragFromTray(piece, event, trayX, trayY) {
    if (state.gameWon) return;

    state.dragged = {
        piece,
        preview: createDragPreview(piece)
    };

    state.dragOrigin = { placed: false };

    const trayRect = refs.piecesSVG.getBoundingClientRect();
    state.offset.x = event.clientX - (trayRect.left + trayX);
    state.offset.y = event.clientY - (trayRect.top + trayY);

    updateDragPreviewPosition(event.clientX, event.clientY);
    state.handlers.drawPieces();
}

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
    state.offset.x = event.clientX - (boardRect.left + piece.boardX * CELL * scale);
    state.offset.y = event.clientY - (boardRect.top + piece.boardY * CELL * scale);

    removePieceFromBoard(piece);
    state.handlers.drawBoard();
    state.handlers.drawPieces();
    updateDragPreviewPosition(event.clientX, event.clientY);
}

export function rotateDraggedPiece(clientX, clientY) {
    if (!state.dragged) return;

    state.dragged.piece.shape = rotateShape(state.dragged.piece.shape);
    state.dragged.preview = createDragPreview(state.dragged.piece);
    updateDragPreviewPosition(clientX, clientY);
}

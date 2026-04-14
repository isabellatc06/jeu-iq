import { CELL, refs, state } from "./data.js";
import { getShapeBounds } from "./utils.js";
import { createPieceGroup } from "./svg-helpers.js";

// Dessine la réserve à droite, avec un emplacement par pièce.
export function drawPieces() {
    refs.piecesSVG.innerHTML = "";
    const trayRowHeight = 80;
    const trayColWidth = 110;
    const trayPadding = 20;
    const trayInnerWidth = trayColWidth - 20;
    const trayInnerHeight = trayRowHeight - 20;
    const preferredHeight = Math.max(280, state.boardH * CELL);
    const rowsPerColumn = Math.max(1, Math.floor((preferredHeight - trayPadding * 2) / trayRowHeight));
    const visibleRows = Math.max(1, Math.min(rowsPerColumn, state.pieces.length));
    const columnCount = Math.max(1, Math.ceil(state.pieces.length / rowsPerColumn));
    const trayWidth = trayPadding + columnCount * trayColWidth - 10;
    const trayHeight = trayPadding + visibleRows * trayRowHeight;

    refs.piecesSVG.setAttribute("width", trayWidth);
    refs.piecesSVG.setAttribute("height", trayHeight);

    state.pieces.forEach(piece => {
        const column = Math.floor(piece.trayIndex / rowsPerColumn);
        const row = piece.trayIndex % rowsPerColumn;
        const trayX = trayPadding + column * trayColWidth;
        const trayY = trayPadding + row * trayRowHeight;
        const bounds = getShapeBounds(piece.shape);
        // Chaque pièce est réduite pour rentrer dans sa case de réserve.
        const unit = Math.min(
            CELL / 2,
            trayInnerWidth / bounds.width,
            trayInnerHeight / bounds.height
        );
        const pieceWidth = bounds.width * unit;
        const pieceHeight = bounds.height * unit;
        const offsetX = trayX + (trayInnerWidth - pieceWidth) / 2;
        const offsetY = trayY + (trayInnerHeight - pieceHeight) / 2;

        const slot = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        slot.setAttribute("x", trayX - 10);
        slot.setAttribute("y", trayY - 10);
        slot.setAttribute("width", trayInnerWidth);
        slot.setAttribute("height", trayInnerHeight);
        slot.setAttribute("rx", 14);
        slot.setAttribute("class", "tray-slot");
        refs.piecesSVG.appendChild(slot);

        // On n'affiche pas ici une pièce déjà posée ou actuellement tenue par le joueur.
        if (piece.placed || (state.dragged && state.dragged.piece === piece)) {
            return;
        }

        const g = createPieceGroup(piece, unit);
        g.setAttribute("transform", `translate(${offsetX},${offsetY})`);

        g.onpointerdown = e => {
            if (state.dragged) return;
            e.preventDefault();
            e.stopPropagation();
            state.handlers.startDragFromTray(piece, e, trayX, trayY);
        };

        refs.piecesSVG.appendChild(g);
    });
}
